<!--移库跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" cols="4" ref="formItem" class="h-form-search">
                <h-form-item :label="$t('m.i.be.trDir')" prop="trDir">
                  <h-select v-model="formItem.trDir" placeholder="" :clearable="false">
                    <h-option v-for="item in trDirList" :value="item.value" :key="item.value">{{ item.label}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.ecdsBillStatus')" prop="billStatus">
                  <h-select v-model="formItem.billStatus" placeholder="" showTitle>
                    <h-option v-for="item in billStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctStatus')" prop="acctStatus">
                  <h-select v-model="formItem.acctStatus" placeholder="" showTitle>
                    <h-option v-for="item in billAcctStatus" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="moveOutDtRange" :label="$t('m.i.be.moveApplDt')">
                  <h-date-picker :value="moveOutDtRange" type="daterange" autoPlacement showFormat :editable=false
                                 placeholder="" @on-change="handleMoveOutDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.respFlag')" prop="respFlag">
                  <h-select v-model="formItem.respFlag" placeholder="" showTitle>
                    <h-option v-for="item in respFlagList" :value="item.value" :key="item.value">{{ item.label}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.moveType')" prop="moveType">
                  <h-select v-model="formItem.moveType" placeholder="" showTitle>
                    <h-option v-for="item in stockMoveTypeList" :value="item.key" :key="item.key">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
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
            hasPage
            url="/be/barter/stockmove/indexQuery/func_queryStockMoveBill"
            :bindForm="formItem"
            :hasSelect="hasSelect" rowSelect
            showListCkeckBox
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}
              </h-button>
            </div>
          </h-datagrid>
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                          :billId="this.billId"></bill-info-main>
        </div>
      </h-col>
    </h-row>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import {post, on, off, formatNumber} from "@/api/bizApi/commonUtil";
  import {dateFormat} from "@/api/bizApi/be/barter/payment/payConfirmCommon";

  export default {
    name: "indexQuery",
    data() {
      return {
        formItem: {
          billNo: "",
          likeBillNo: "",
          billMoney: "",
          dueDt: "",
          trDir: "1",
          moveOutDt: "",
          moveOutDtRange: "",
          moveOutBrchCode: "",
          moveInBrchCode: "",
          acptBankName: "",
          minMoveOutDt: "",
          maxMoveOutDt: "",
          respFlag: "",
          billStatus: "",
          moveType: "",
          acctStatus: ""
        },
        moveOutDtRange: [],
        trDirList: [{
          value: "1",
          label: "移出"
        }, {
          value: "2",
          label: "移入"
        }],
        billStatusList: [],
        stockMoveTypeList: [],
        billAcctStatus: [],
        hasSelect: false,
        respFlagList: [{
          value: "SU00",
          label: "同意"
        }, {
          value: "SU01",
          label: "拒绝"
        }, {
          value: "SU02",
          label: "未应答"
        }],
        billId: null,
        showBillInfoWin: false,
        //数据字典转型
        dictMap: new Map(),
        //是否显示高级查询
        ifShowMore: false,
        currentSelectList: [],
        currentSelectRowInx: [],
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        //库存移出列表
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            },
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.moveType'),
            ellipsis: false,
            key: "moveType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "StockMoveType", params.row.moveType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", dateFormat(params.row.dueDt, "yyyy-MM-dd"));
            },
            exportRender: (cellData) => {
              return this.datatoDate(cellData);
            }
          },
          {
            title: this.$t('m.i.be.moveApplDt'),
            ellipsis: false,
            key: "moveOutDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", dateFormat(params.row.moveOutDt, "yyyy-MM-dd"));
            },
            exportRender: (cellData) => {
              return this.datatoDate(cellData);
            }
          },
          {
            title: this.$t('m.i.billInfo.ecdsBillStatus'),
            ellipsis: false,
            key: "billStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BarterTrustStatus", params.row.billStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.moveOutBrchName'),
            ellipsis: false,
            key: "moveOutBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.moveInBrchName'),
            ellipsis: false,
            key: "moveInBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            ellipsis: false,
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.hldrBrchName'),
            key: "hldrBrchName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.respFlag'),
            key: "respFlag",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", this.formatterRespFlag(params.row.respFlag))
              ]);
            }
          },
          {
            title: this.$t('m.i.common.result'),
            key: "dealPrcMsg",
            ellipsis: false,
            hiddenCol: false
          }]
      };
    },
    components: {},
    computed: {},
    methods: {
      /**
       * 列表搜索
       * */
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleMoveOutDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minMoveOutDt = arr[0].replace(/-/g, "");
          this.formItem.maxMoveOutDt = arr[1].replace(/-/g, "");
          this.moveOutDtRange = [arr[0], arr[1]];
        } else {
          this.formItem.minMoveOutDt = "";
          this.formItem.maxMoveOutDt = "";
          this.moveOutDtRange = [];
        }
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = "stockMoveQueryReportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let userNo = window.sessionStorage.getItem("userName");
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/barter/stockmove/indexQuery/func_exportExcel";
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if (this.$refs.datagrid.total == 0) {
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              trDir: this.formItem.trDir,
              moveType: this.formItem.moveType,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              moveType: this.formItem.moveType, billNo: this.formItem.billNo, trDir: this.formItem.trDir,
              billStatus: this.formItem.billStatus, respFlag: this.formItem.respFlag, acctStatus: this.formItem.acctStatus,
              minMoveOutDt: this.formItem.minMoveOutDt, maxMoveOutDt: this.formItem.maxMoveOutDt,
              field: field, exportType: exportType, excelName: this.param, pageSize: pageSize
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
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/barter/stockmove/indexQuery/func_exportExcel";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "ids";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "pageSize";
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2);
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
            let input6 = document.createElement("input");
            input6.type = "text";
            input6.name = "moveType";
            input6.value = this.formItem.moveType;
            form.appendChild(input6);
            let input7 = document.createElement("input");
            input7.type = "text";
            input7.name = "trDir";
            input7.value = this.formItem.trDir;
            form.appendChild(input7);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/barter/stockmove/indexQuery/func_exportExcel";
            let form = document.createElement("form");
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

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },

      // 表格导出功能
      exportCsv(params) {
        /* {
          filename:  '' // 文件名
          columns: []// 导出表格列
          data: [] // 导出表格数据
          noHeader: false //是否导出表格头
        } */
        this.$refs.gridContent.exportCsv(params);
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.moveOutDtRange = [];
        this.formItem.moveType = "1";
        this.formItem.minMoveOutDt = "";
        this.formItem.maxMoveOutDt = "";
        this.$refs.formItem.resetFields();
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      datatoDate(value) {
        if (value != null && value != "") {
          var str = value.toString();
          return str.slice(0, 4) + "-" + str.slice(4, 6) + "-" + str.slice(6, 8);
        } else {
          return "";
        }
      },
      formatterRespFlag(value) {
        if (value == null || value == "") {
          return "";
        }
        switch (value) {
          case "SU00":
            return "同意";
          case "SU01":
            return "拒绝";
          case "SU02":
            return "未应答";
        }
      }
    },

    mounted() {
      this.getDictListByGroups("BarterTrustStatus,DraftTypeCode,StockMoveType,AcctFlag").then(res => {
        this.billStatusList = res.get("BarterTrustStatus");
        this.stockMoveTypeList = res.get("StockMoveType")
        this.billAcctStatus = res.get("AcctFlag");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
