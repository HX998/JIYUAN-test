<!--业务查询-公共查询-资产业务查询-->
<template>

  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNoList" :label="$t('m.i.common.brchName')" prop="brchNoList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.brchNoList" :brchName.sync="formItem.brchNameList"></show-branch>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" readonly icon="android-search"
                           @on-click="queryCustNo" clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.status')" prop="currentStatusList">
                  <h-select v-model="formItem.currentStatusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in currentStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pl.transType')" prop="transType">
                  <h-select v-model="formItem.transTypeList" placeholder="" multiple showTitle>
                    <h-option v-for="item in transTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pl.occurDt')" prop="minOperDt">
                  <h-date-picker :value="operDt" type="daterange" showFormat :editable=false
                                 @on-change="handleOperDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="queryBill()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div>
            <div class="text-wrap mb-10">
              <!--<div class="text-header"><span class="tit">详细信息</span></div>-->
              <div class="text-body">
                <h-row :gutter="8">
                  <h-col span="8">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.pl.sumCount')}}：</h-col>
                      <h-col span="15" class="val">{{ this.sumCount }}</h-col>
                    </h-row>
                  </h-col>
                  <h-col span="8">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.pl.sumMoney')}}：</h-col>
                      <h-col span="15" class="val">{{ this.sumMoney}}</h-col>
                    </h-row>
                  </h-col>
                </h-row>
              </div>
            </div>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            rowSelect
            :hasSelect = false
            get-data-func
            @get-data="getFinanceDataList"
            :gridData="gridData"
            :bindForm="formItem"
            :row-select="true"
            :has-select="false"
            :auto-load="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billExport()">{{$t('m.i.pe.flowExport')}}</h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 明细导出 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { formatNumber, off, on, post } from "@/api/bizApi/commonUtil";


  export default {
    name: "financeBusiQuery",
    data() {
      return {
        tempShowExcelTemplateWin:false,
        param : null,
        rows : null,
        ifShowMore : false,
        formItem : {
          brchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          custNo: "",
          custName: "",
          currentStatusList: [],
          transType: "",
          minOperDt: "",
          maxOperDt: "",
          transTypeList: []
        },
        operDt : [],
        gridData : {},
        sumCount : "",
        sumMoney : "",
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.status'),
            key: "currentStatus",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FinanceStatus", params.row.currentStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title:  this.$t('m.i.pl.transType'),
            key: "transType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FinanceType", params.row.transType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title:  this.$t('m.i.pl.ctrctAmt'),
            key: "ctrctAmt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let ctrctAmt = formatNumber(params.row.ctrctAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: ctrctAmt
                }
              }, ctrctAmt);
            }
          },
          // {
          //   title: "放款金额",
          //   key: "ctrctAmt",
          //   ellipsis: false,
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     let ctrctAmt = formatNumber(params.row.ctrctAmt, 2, ",");
          //     return h("span", {
          //       domProps: {
          //         title: ctrctAmt
          //       }
          //     }, ctrctAmt);
          //   }
          // },
          {
            title: this.$t('m.i.pl.releasedAmt'),
            key: "releasedAmt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let releasedAmt = formatNumber(params.row.releasedAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: releasedAmt
                }
              }, releasedAmt);
            }
          },
          {
            title: this.$t('m.i.pl.limitPracAmt'),
            key: "limitPracAmt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let limitPracAmt = formatNumber(params.row.limitPracAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: limitPracAmt
                }
              }, limitPracAmt);
            }
          },
          {
            title: this.$t('m.i.billInfo.transCtrctNo'),
            key: "transCtrctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title:this.$t('m.i.pe.flowNo'),
            key: "flowNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pl.transDueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.occurDt"),
            key: "operDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.operDt == null || params.row.operDt === "") {
                return "";
              }
              let date = this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        currentStatusList : [],
        transTypeList : [],
        showCustMessageWin : false,
        dictMap : new Map(),
      };
    },
    components: {  },
    mounted() {
      this.getDictListByGroups("FinanceStatus,FinanceType").then(res => {
        this.currentStatusList = res.get("FinanceStatus");
        this.transTypeList = res.get("FinanceType");
        this.dictMap = res.get("map");
      });
      this.getFinanceDataList();
    },
    methods: {
      getFinanceDataList() {
        let params = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize
        });
        post(params, "/pl/finance/financeBusiQuery/func_pagingQueryFinanceInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.gridData = res.data.retData;
              this.sumCount = res.data.retData.pageInfo.count;
              this.sumMoney = res.data.retData.pageInfo.sumMoney === null ? "0.00" : formatNumber(res.data.retData.pageInfo.sumMoney, 2, ",");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      resetSearch() {
        this.formItem.brchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.brchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.custNo = "";
        this.formItem.minOperDt = "";
        this.formItem.maxOperDt = "";
        this.operDt = [];
        this.$refs.formItem.resetFields();
        this.formItem.transTypeList = [];
      },
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.showCustMessageWin = false;
      },
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      handleOperDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minOperDt = arr[0].replace(/-/g, "");
          this.formItem.maxOperDt = arr[1].replace(/-/g, "");
          this.operDt = [arr[0], arr[1]];
        } else {
          this.formItem.minOperDt = "";
          this.formItem.maxOperDt = "";
          this.operDt = [];
        }
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
      },
      //查询明细
      queryBill() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //清单导出
      billExport() {
        this.param = 'getFinanceBusiQueryExportInfo';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let pageSize = this.$refs.datagrid.total;
          if (this.$refs.datagrid.total === 0) {
            pageSize = 1;
          }
          let url = window.LOCAL_CONFIG.API_HOME + "/pl/finance/financeBusiQuery/func_exportData";
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              custNo: this.formItem.custNo,
              custName: this.formItem.custName,
              currentStatusList: this.formItem.currentStatusList,
              transType: this.formItem.transType,
              minOperDt: this.formItem.minOperDt,
              maxOperDt: this.formItem.maxOperDt,
              field: field,
              exportType: exportType,
              excelName: this.param,
              pageSize: pageSize
            };
          }
          post(params, url).then(res => {
            if (res.status === 200 && res.data === null) {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else if (res.status === 200 && res.data === "") {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else {
              this.$msgTip.error(this, {info: "异步导出失败"});
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/pl/finance/financeBusiQuery/func_exportData";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/pl/finance/financeBusiQuery/func_exportData";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'pageSize';
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1)
            }
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
    }
  };
</script>

<style scoped>

</style>
