<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.be.rgstDt')" prop="rgstDt">
                  <h-date-picker :value="formItem.rgstDt" type="date" :editable=false :showFormat=true placeholder="" @on-change="handleRgstDtChange"
                                 @on-clear="clearVal('rgstDt')"></h-date-picker>
                </h-form-item>
            <!--    <h-form-item :label="$t('m.i.be.brchName')" prop="brchName">
                  <h-input v-model="formItem.brchName" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal('brchName')" :title="formItem.brchName"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.brchName" :label="$t('m.i.be.brchName')" prop="brchName"
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.rgstBrchNoList" :brchName.sync="formItem.brchName"></show-branch>

                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.rgstType')" prop="rgstClass">
                  <h-select v-model="formItem.rgstClass" placeholder="" showTitle>
                    <h-option value="RI00">承兑登记</h-option>
                    <h-option value="RI04">贴现登记</h-option>
                    <h-option value="RI03">承兑保证登记</h-option>
                    <h-option value="RI01">质押登记</h-option>
                    <h-option value="RI02">质押解除登记</h-option>
                    <h-option value="RI06">结清登记</h-option>
                    <h-option value="RI07">止付登记</h-option>
                    <h-option value="RI08">解止付登记</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.rgstStatus')" prop="rgstStatus">
                  <h-select v-model="formItem.rgstStatus" placeholder="" showTitle>
                    <h-option value="BTA01">待登记</h-option>
                    <h-option value="BTA03">登记处理中</h-option>
                    <h-option value="BTA04">登记成功</h-option>
                    <h-option value="BTA05">登记失败</h-option>
                    <h-option value="BTA08">撤销登记处理中</h-option>
                    <h-option value="BTA09">登记撤回成功</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/ce/cpesrgst/paperRegInfoQuery/paperRgstSumInfo/pagingQueryPaperRgstSumInfo"
            :bindForm="formItem"
            :paramId="'rowNo'"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
            </div>
          </h-datagrid>
          <!--票面信息-->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
        </div>
      </h-col>
    </h-row>

    <!--明细弹出框-->
    <h-msg-box v-model="showDetilWin" width="800" :mask-closable="false" class="h-form-search-layer"
               @on-close="detailClose" :maximize="true">
      <p slot="header">
        <span>{{"汇总明细信息"}}</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid
        highlight-row
        url="/ce/cpesrgst/paperRgstInfoQuery/paperRgstSumInfo/func_pagingQueryPaperRgstDetail"
        :columns="detailColumns"
        :bindForm="detailFormItem"
        :height="300"
        :notSetWidth="true"
        :autoLoad="false"
        ref="datagridbill">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="detailClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="detailClose">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--<show-branch :showBranchWin="brchNoWin" title="机构名称" @brchNoChange="brchNoChange" ifcheck="isTrue"
                 :checkStrictly="true" @showBranchWinClose="brchNoWinClose"></show-branch>-->

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "paperRegSumInfo",
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        formItem : {
          billType: "",
          scope:"",
          rgstDt:window.sessionStorage.getItem("workDate"),
          transBrchNo:"",
          rgstClass:"",
          rgstStatus:"",
          brchName:"",
          sumMoney:"",
          rgstBrchNoList:""
        },
        detailFormItem : {
          rgstDt: "",
          rgstClass:"",
          rgstStatus:"",
          transBrchNo:"",
          rgstBrchNoList:""
        },
        ifShowMore :false,
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            width:60,
            align: 'center'
          },
          {
            title: this.$t('m.i.be.rgstType'),
            key: "rgstClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "RgstClass", params.row.rgstClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.rgstStatus'),
            key: "rgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcptRgstStatus", params.row.rgstStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.count'),
            key: "totalNum",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showDetilBox(params.row.rgstClass, params.row.rgstStatus );
                  }
                }
              }, params.row.totalNum);
            }
          },
          {
            title: this.$t('m.i.be.sumMoney'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.totalAmt, 2, ','))
            },
          }
        ],
        detailColumns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            width:60,
            align: 'center'
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.billMoney, 2, ','))
            },
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
       // brchNoWin : false,
        showDetilWin:false,
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        dictMap : new Map(),
        billTypeList : []
      };
    },
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      this.formItem.rgstBrchNoList = userInfo.brchNo;
      this.formItem.brchName = userInfo.brchName;
      this.formItem.rgstDt = window.sessionStorage.getItem("workDate");
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
        this.currentSelectList=[];
      },
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.formItem.rgstBrchNoList = userInfo.brchNo;
        this.formItem.brchName = userInfo.brchName;
        this.$refs.formItem.resetFields();
        this.formItem.rgstDt =window.sessionStorage.getItem("workDate");
      },
      /*brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.transBrchNo = brchNos.substring(0, brchNos.length - 1);
        this.formItem.brchName = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
        showBillInfo(billId, billNo) {
            this.billId = billId;
            this.billNo = billNo;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      showDetilBox(rgstClass, rgstStatus) {
        this.detailFormItem.rgstClass = rgstClass;
        this.detailFormItem.rgstStatus = rgstStatus;
        this.detailFormItem.rgstDt = this.formItem.rgstDt.replace(/-/g, "");
        this.detailFormItem.rgstBrchNoList = this.formItem.rgstBrchNoList;
        this.detailFormItem.billType = this.formItem.billType;
        this.showDetilWin = true;
        this.$nextTick(() => {
          this.$refs.datagridbill.dataChange(1);
        });
      },
      detailClose() {
        this.detailFormItem.rgstClass = "";
        this.detailFormItem.rgstStatus = "";
        this.detailFormItem.rgstDt = "";
        this.detailFormItem.rgstBrchNoList = "";
        this.showDetilWin = false;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      tempShowExcelTemplateWinOpen() {
        this.param = "paperRegSumReportInfo";
        this.rows = this.$refs.datagrid.total;
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/paperRgstInfoQuery/paperRgstSumInfo/func_exportPaperRegisterList";
        let options = {};
        options.params = this.formItem;
        options.pageSize = this.$refs.datagrid.total;
        exportList(this, this.param, field, exportType, url, options);
/*


        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/paperRgstInfoQuery/paperRgstSumInfo/func_exportPaperRegisterList";
          let pageSize = this.$refs.datagrid.total;
          if (this.$refs.datagrid.total == 0) {
            pageSize = 1;
          }
          let count = this.detailFormItem.totalNum;
          if(!this.detailFormItem.totalNum){
            count = 0;
          }
          let params = null;
          if (this.$refs.datagrid.selects.length != 0) {
            params = {
              json: JSON.stringify(this.$refs.datagrid.selects),
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            let rgstDt = this.formItem.rgstDt ? this.formItem.rgstDt.replace(/-/g, "") : "";
            params = {
              rgstType: this.formItem.rgstType, rgstStatus: this.formItem.rgstStatus,
              count: count, sumMoney: this.formItem.sumMoney,rgstDt: rgstDt,
              field: field, exportType: exportType, excelName: this.param, pageSize: pageSize
            };
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          let url = window.LOCAL_CONFIG.API_HOME + "/pc/btrc/corp/func_exportPaperRegisterList";
          let form = document.createElement("form");
          if (this.$refs.datagrid.selects.length != 0) {
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "json";
            input1.value = JSON.stringify(this.$refs.datagrid.selects);
            form.appendChild(input1);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "field";
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);
          }else{
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement("input");
              input1.type = "text";
              input1.name = "pageSize";
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1);
            }
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "field";
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }*/
      },
      clearVal(type) {
        debugger
        if("brchName" == type){
          this.addForm.rgstBrchNoList = "";
          this.addForm.brchName = "";
        }
        if("rgstDt" == type){
          this.rgstDt = "";
          this.formItem.rgstDt = "";
        }
      },
      handleRgstDtChange(rgstDt){
        this.formItem.rgstDt = rgstDt ? rgstDt.replace(/-/g, "") : "";
      },
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,AcptRgstStatus,RgstClass").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
