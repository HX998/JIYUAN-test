<!--付款确认跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.be.applSignFlag')" prop="applSignFlag" class="h-form-long-label">
                  <h-select v-model="formItem.applSignFlag" :setDefSelect="true" :clearable="false">
                    <h-option v-for="item in applSignFlagList" :value="item.value" :key="item.value">{{ item.label}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.flowStatus')" prop="billStatus">
                  <h-select v-model="formItem.billStatus" placeholder="">
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
                <!--                <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
                                  <h-input v-model="formItem.brchName" placeholder="" readonly icon="android-search"
                                           @on-click="organSearch('query')" clearable @on-clear="clearVal('brchName')" :title="formItem.brchName"></h-input>
                                </h-form-item>-->
                <show-branch v-model="formItem.brchNoList" :label="$t('m.i.common.brchName')" prop="brchNoList"
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.brchNoList"
                             :brchName.sync="formItem.brchName"></show-branch>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.respFlag')" prop="respFlag">
                  <h-select v-model="formItem.respFlag" placeholder="">
                    <h-option v-for="item in respFlagList" :value="item.value" :key="item.value">{{ item.label }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.respDt')" prop="respDtRange">
                  <h-date-picker type="daterange" autoPlacement :value="respDtRange" format="yyyy-MM-dd"
                                 :showFormat="true"
                                 placeholder="" @on-change="handleRespDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney">
                  <h-row>
                    <h-col span="11">
                      <h-form-item prop="minBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.minBillMoney" type="money" bigTips placeholder=""
                                     :maxlength="10"></h-typefield>
                      </h-form-item>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-form-item prop="maxBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.maxBillMoney" type="money" bigTips placeholder=""></h-typefield>
                      </h-form-item>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDate">
                  <h-date-picker type="daterange" autoPlacement :value="dueDate" format="yyyy-MM-dd" :showFormat="true"
                                 placeholder="" @on-change="handleDueDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.applDate')" prop="applDate" class="h-form-long-label">
                  <h-date-picker type="daterange" autoPlacement :value="applDate" format="yyyy-MM-dd" :showFormat="true"
                                 placeholder="" @on-change="handleApplDateChange"></h-date-picker>
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
            :columns="dataColumns"
            url="/be/barter/payment/payConfirmApplyQueryHistory/func_queryPayConfirmApplyHistoryByPage"
            :bindForm="formItem"
            :hasSelect="hasSelect" rowSelect
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportData')}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--<show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange"
                 ifcheck="true" :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>

  </div>
</template>

<script>
  import {post, on, off, formatNumber, getDictValueFromMap} from "@/api/bizApi/commonUtil";
  import {dateFormat} from "@/api/bizApi/be/barter/payment/payConfirmCommon";

  export default {
    name: "payConfirmApplyQueryHistory",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        dueDate: [],
        applDate: [],
        respDtRange: [],
        formItem: {
          applSignFlag: "1",//默认查询申请方
          billStatus: "",
          brchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNo: "",
          likeBillNo: "",
          brchName: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          respFlag: "",
          billType: "",
          minBillMoney: "",
          maxBillMoney: "",
          billNo: "",
          minDueDt: "",
          maxDueDt: "",
          minApplDt: "",
          maxApplDt: "",
          dueDate: "",
          applDate: "",
          minRespDt: "",
          maxRespDt: "",
          acctStatus: ""
        },
        applSignFlagList: [{
          value: "1",
          label: "申请方"
        }, {
          value: "2",
          label: "应答方"
        }],
        respFlagList: [{
          value: "SU00",
          label: "应答同意"
        }, {
          value: "SU01",
          label: "应答拒绝"
        }, {
          value: "SU03",
          label: "未应答"
        }],
        billTypeList: [],
        billStatusList: [],
        billAcctStatus: [],
        tableRef: "selfTable",
        ifShowMore: false,
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: new Map(),

        //设置列表列内容
        dataColumns: [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", dateFormat(params.row.applDt, "yyyy-MM-dd"));
            }
          },
          {
            title: this.$t('m.i.be.cfmAppReqType'),
            key: "cfmAppType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CfmAppType", params.row.cfmAppType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
            exportRender: (cellData) => {
              return this.getDictValueFromMap(this.dictMap, "CfmAppType", cellData);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
            exportRender: (cellData) => {
              return this.getDictValueFromMap(this.dictMap, "DraftTypeCode", cellData);
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoneyByUnit'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.respFlag'),
            key: "respFlag",

            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.respFlag === "SU00") {
                return h("span", "应答同意");
              } else if (params.row.respFlag === "SU01") {
                return h("span", "应答拒绝");
              } else {
                return h("span", "未应答");
              }
            },
            exportRender: (cellData) => {
              switch (cellData) {
                case "SU00":
                  return "应答同意";
                case "SU01":
                  return "应答拒绝";
              }
              return "未应答";
            }
          },
          {
            title: this.$t('m.i.be.respDt'),
            key: "respDt",
            hiddenCol: false,
            render(h, params) {
              if (params.row.respDt == null || params.row.respDt === "") {
                return "";
              }
              let date = dateFormat(params.row.respDt, "yyyy-MM-dd");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", dateFormat(params.row.remitDt, "yyyy-MM-dd"));
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", dateFormat(params.row.dueDt, "yyyy-MM-dd"));
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),

            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
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
            },
            exportRender: (cellData) => {
              return this.getDictValueFromMap(this.dictMap, "BarterTrustStatus", cellData);
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
            title: this.$t('m.i.common.brchName'),
            key: "brchName",

            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptAcctNo'),
            key: "acptAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.cfmAppRefuseCode'),
            key: "cfmAppRefuseCode",

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "RefuseReason", params.row.cfmAppRefuseCode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
            exportRender: (cellData) => {
              return this.getDictValueFromMap(this.dictMap, "RefuseReason", cellData);
            }
          },
          {
            title: this.$t('m.i.billInfo.cfmAppOpin'),
            key: "cfmAppOpin",

            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.result'),
            key: "dealPrcMsg",
            hiddenCol: false
          }],

        payConfirmForm: {
          cfmAppOpin: ""
        },

        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,

        //showBranchWin: false,
        hasSelect: false
      };
    },
    watch: {},
    computed: {},
    mounted() {
      this.getDictListByGroups("DraftTypeCode,BarterTrustStatus,CfmAppType,RefuseReason,AcctFlag").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billStatusList = res.get("BarterTrustStatus");
        this.billAcctStatus = res.get("AcctFlag");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      /**
       * 列表搜索
       * */
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleDueDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDate = [];
        }
      },
      handleRespDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minRespDt = arr[0].replace(/-/g, "");
          this.formItem.maxRespDt = arr[1].replace(/-/g, "");
          this.respDtRange = [arr[0], arr[1]];
        } else {
          this.formItem.minRespDt = "";
          this.formItem.maxRespDt = "";
          this.respDtRange = [];
        }
      },
      handleApplDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDate = [arr[0], arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDate = [];
        }
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.dueDate = [];
        this.applDate = [];
        this.formItem.dueDate = "";
        this.formItem.applDate = "";
        this.respDtRange = [];
        this.$refs.formItem.resetFields();
        this.formItem.brchName = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.brchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = "payConfirmApplyReportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/barter/payment/payConfirmApplyQueryHistory/func_exportPay";
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if (this.$refs.datagrid.total == 0) {
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              applSignFlag: this.formItem.applSignFlag,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              applSignFlag: this.formItem.applSignFlag,
              billNo: this.formItem.billNo,
              billStatus: this.formItem.billStatus,
              brchNoList: this.formItem.brchNoList,
              billType: this.formItem.billType,
              respFlag: this.formItem.respFlag,
              minBillMoney: this.formItem.minBillMoney,
              maxBillMoney: this.formItem.maxBillMoney,
              minDueDt: this.formItem.minDueDt,
              maxDueDt: this.formItem.maxDueDt,
              minApplDt: this.formItem.minApplDt,
              maxApplDt: this.formItem.maxApplDt,
              minImpawnApplDt: this.formItem.minImpawnApplDt,
              maxImpawnApplDt: this.formItem.maxImpawnApplDt,
              field: field,
              exportType: exportType,
              excelName: this.param,
              pageSize: pageSize,
              minRespDt: this.formItem.minRespDt,
              maxRespDt: this.formItem.maxRespDt,
              acctStatus: this.formItem.acctStatus
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
            let url = window.LOCAL_CONFIG.API_HOME + "/be/barter/payment/payConfirmApplyQueryHistory/func_exportPay";
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
            input6.name = "applSignFlag";
            input6.value = this.formItem.applSignFlag;
            form.appendChild(input6);
            let input7 = document.createElement("input");
            input7.type = "text";
            input7.name = "brchNoList";
            input7.value = this.formItem.brchNoList;
            form.appendChild(input7);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/barter/payment/payConfirmApplyQueryHistory/func_exportPay";
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
      /*clearVal(type) {
        this.formItem.brchNoList = "";
        this.formItem.brchName = "";
      },

      organSearch(optType) {
        this.showBranchWin = true;
        this.optType = optType;
      },*/
      /* showBranchWinClose() {
         this.showBranchWin = false;
       },
       brchNoChange(info) {
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
         this.formItem.brchNoList = brchNos.substring(0, brchNos.length - 1);
         this.formItem.brchName = brchNames.substring(0, brchNames.length - 1);
         this.showBranchWin = false;
       },*/
      //票面
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
