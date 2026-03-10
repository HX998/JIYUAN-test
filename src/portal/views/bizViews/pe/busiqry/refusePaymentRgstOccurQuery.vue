<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.transBrchNos" :label="$t('m.i.ce.paymentBrchName')" prop="transBrchNos" isNeedChecked
                             title="解付机构名称" :showCheckBox="true" :brchNo.sync="formItem.transBrchNos" :brchName.sync="formItem.transBrchNameList"></show-branch>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.value">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.value">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.refuseRgstDt')" prop="rgstDt">
                  <h-date-picker :value="rgstDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRgstDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement  showFormat :editable=false @on-change="handleDueDtChange" placeholder=""></h-date-picker>
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
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pe.sumMoney')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pe.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="showColumns"
            url="/pe/busiqry/refusePaymentRgstOccurQuery/func_pageOccurQueryAcptCollRgstBillList"
            :bindForm="formItem"
            hasPage
            showListCkeckBox
            :hasSelect="false"
            :rowSelect="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="refusePaymentBillInfoExport">
                {{$t("m.i.pe.flowExport")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" :isAllBankAcct=true
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
  </div>

</template>

<script>
  import { post, on, off, formatNumber,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "refusePaymentRgstOccurQuery",
    data() {
      return {
        billId: "",
        billNo: "",
        showBillInfoWin: false,
        showCustMessageWin:false,
        showCustAcctNoWin:false,
        ifShowMore:false,
        rgstDt: [],
        remitDt: [],
        dueDt: [],
        billClassList: [],
        billTypeList: [],
        dictMap: new Map(),

        formItem: {
          transBrchNos: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          billClass: "",
          billType: "",
          maxRgstDt: "",
          minRgstDt: "",
          billNo: "",
          drwrName: "",
          drwrAcctNo: "",
          drwrCustNo: "",
          maxRemitDt: "",
          minRemitDt: "",
          maxDueDt: "",
          minDueDt: ""
        },
        sumMoney: "",
        total: "",
        showColumns: [
          {
            type: "selection",
            width: 60,
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
            title: this.$t("m.i.ce.refuseRgstDt"),
            key: "rgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rgstDt == null || params.row.rgstDt === "") {
                return "";
              }
              let date = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              } else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId,params.row.billNo);
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
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
            title: this.$t("m.i.billInfo.acptBrchNo"),
            key: "acptBrchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBrchNme"),
            key: "acptBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.paymentBrchName"),
            key: "paymentBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pe.drweBankName"),
            key: "drweBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
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
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.ce.payRefuseReason"),
            key: "rejectReason",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustAcctNo"),
            key: "prsttnAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustName"),
            key: "prsttnName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustBankNo"),
            key: "prsttnBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustBankName"),
            key: "prsttnBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.operTellerName"),
            key: "operTellerName",
            hiddenCol: false
          },
        ],
        // 明细导出
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,

      }
    },
    mounted() {
      this.getOccurData();
      this.getDictListByGroups("DraftTypeCode,CDMedia").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      getOccurData() {
        let obj = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize
        });
        let url = "/pe/busiqry/refusePaymentRgstOccurQuery/func_querySumDto";
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.total = res.data.retData.counts;
                this.sumMoney = formatNumber(res.data.retData.sumBillMoney, 2, ",");
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      //日期选择框
      handleRgstDtChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.minRgstDt = arr[0].replace(/-/g, "");
          this.formItem.maxRgstDt = arr[1].replace(/-/g, "");
          this.rgstDt = [arr[0], arr[1]];
        }else{
          this.formItem.minRgstDt = "";
          this.formItem.maxRgstDt = "";
          this.rgstDt = [];
        }
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      handleDueDtChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      //查询
      formSearch() {
        this.getOccurData();
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.transBrchNos = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.billClass = "";
        this.formItem.billType = "";
        this.formItem.maxRgstDt = "";
        this.formItem.minRgstDt = "";
        this.formItem.billNo = "";
        this.formItem.drwrName = "";
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrCustNo = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minDueDt = "";
        this.rgstDt = [];
        this.remitDt = [];
        this.dueDt = [];
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if(this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      clearVal(optType) {
        if (optType === "drwrName") {
          this.formItem.drwrAcctNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrCustNo = "";
        }
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      refusePaymentBillInfoExport() {
        this.param = "refusePaymentRgstOccurExportInfo";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/refusePaymentRgstOccurQuery/func_exportRefusePaymentRgstOccurExcel";
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params.ids = this.$refs.datagrid.selectIds;
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

    }

  };
</script>

<style scoped>

</style>
