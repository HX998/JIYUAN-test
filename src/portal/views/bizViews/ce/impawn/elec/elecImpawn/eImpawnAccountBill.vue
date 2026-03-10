<!--质押/解质押记账明细-->
<template>
  <div>
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">

                <!--票据来源：下拉框-->
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="billManagerFormItem.billOrigin" placeholder="">
                    <h-option v-for="item in impawnBillParams.billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <!--票据（包）号码：-->
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="billManagerFormItem.reverseBillNo"></h-input>
                </h-form-item>
                <!--子票区间：区间框-->
                <bill-range :form-item="billManagerFormItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
<!--                <h-form-item :label="$t('m.i.billInfo.billRange')" prop="billRange">-->
<!--                  <h-row>-->
<!--                    <h-col span="11">-->
<!--                      <h-typefield v-model="billManagerFormItem.minBillRangeStart" placeholder=""></h-typefield>-->
<!--                    </h-col>-->
<!--                    <h-col span="2" style="text-align: center">至</h-col>-->
<!--                    <h-col span="11">-->
<!--                      <h-typefield v-model="billManagerFormItem.maxBillRangeEnd" placeholder=""></h-typefield>-->
<!--                    </h-col>-->
<!--                  </h-row>-->
<!--                </h-form-item>-->
                <!--票据（包）金额：-->
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" :label-width="100">
                  <h-typefield type="money" v-model="billManagerFormItem.billMoney" placeholder="" @on-blur="formatBillMoney('blur')"
                               @on-focus="formatBillMoney('focus')" bigTips></h-typefield>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="billManagerFormItem.remitDt" placeholder="" showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="billManagerFormItem.dueDt" placeholder="" showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <impawn-batch-detail :batchDetailParams="impawnBillParams" ref="impawnBatchDetail"></impawn-batch-detail>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      :url="dataUrl"
                      highlightRow
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      :has-select="false"
                      :rowSelect="true"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="accountDetail">
                <h-button type="primary">记账
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                 <h-dropdown-item name="batch">{{$t('m.i.ce.batchAccount')}}</h-dropdown-item>
                  <h-dropdown-item name="select">{{$t('m.i.ce.selectAccount')}}</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-dropdown placement="bottom-start" @on-click="backDetail" v-if="impawnBillParams.billClass === 'ME01'">
                <h-button type="primary">退回<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次退回</h-dropdown-item>
                  <h-dropdown-item name="select">选择退回</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="ghost" @click="returnMain">返回</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 分录弹框 -->
    <acct-record :param="acctRecordParam" :url="acctRecordUrl" :submitFlag="acctSubmitFlag" :showPrintButton="this.showPrintButton" :show-acct-record-win="showAcctRecordWin" @acctSubmitSure="acctSubmitSure"
                 @showAcctRecordWinClose="showAcctRecordWinClose" @printSuccessCallback="printSuccessCallback" @acctAuthorize="acctAuthorize"></acct-record>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off, formatNumber, getDictListByGroups,formatBillRange } from "@/api/bizApi/commonUtil";
  import ImpawnBatchDetail from "@/views/bizViews/ce/impawn/elec/elecImpawn/eImpawnAccountBatchDetail";

  export default {
    name: "eImpawnAccountBill",
    components: {
      ImpawnBatchDetail
    },
    data() {
      return {
        showPrintButton: false,
        ifShowMore: false,
        dataUrl: "",
        columns: [],
        billManagerFormItem: {
          batchId: "",
          funcNo: "",
          billClass: "",
          reverseBillNo: "",
          billMoney: "",
          remitDt: "",
          dueDt: "",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
        },
        billManagerColumns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
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
            title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.impawnBillParams.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'), //票据（包）号码
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params;
                type = "billId";
              } else {
                info = params;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),   //票据(包)金额
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),   //子票区间
            key: "billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.impawnBillParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
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
            ellipsis: false,
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
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            ellipsis: false,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          }
        ],
        acctSubmitFlag: false,
        showAcctRecordWin: false,
        acctRecordParam: {},
        acctRecordUrl: "",
        //区分批次记账和明细记账
        acctType: "",
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:"",
        billRangeEnd:"",
      }
    },

    props: {
      billManagerVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      impawnBillParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          batchId: "",
          funcNo: "",
          billClass: "",
          accountType:"",    //区分质押和解质押记账
          detailType: "",     //区分批次明细展现字段
          billOriginList: [],
        }
      }
    },
    computed: {
      tempBillManagerVue: {
        get() {
          return this.billManagerVue;
        },
        set() {
        }
      }
    },
    // mounted() {
    //   getDictListByGroups("DraftTypeCode,BillOrigin").then(res => {
    //     this.dictMap = res.get("map");
    //     this.billOriginList = res.get("BillOrigin");
    //   });
    // },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.impawnBillParams.batchId;
          this.billManagerFormItem.funcNo = this.impawnBillParams.funcNo;
          this.billManagerFormItem.billClass = this.impawnBillParams.billClass;
          this.dataUrl = "/ce/impawn/elec/elecImpawn/eImpawnAccountMain/func_pageQueryImpawnBillList";
          this.$nextTick(() => {
            this.columns = this.deepClone(this.billManagerColumns);
            this.$refs.billManagerDatagrid.createShowCol(this.columns);
            this.handleSearch();
            this.$refs.impawnBatchDetail.getImpawnBatchInfo(this.impawnBillParams.accountType);
          });
        }
      }
    },
    methods: {
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.billManagerFormItem.billMoney)) && isFinite(this.billManagerFormItem.billMoney)) {
            this.billManagerFormItem.billMoney = this.billManagerFormItem.billMoney == null ? "0.00" : formatNumber(this.billManagerFormItem.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.billManagerFormItem.billMoney = this.billManagerFormItem.billMoney.toString().replace(/,/g, "");
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.billManagerDatagrid.selects = [];
        this.billManagerFormItem.remitDt = this.billManagerFormItem.remitDt.replace(/-/g, "");
        this.billManagerFormItem.dueDt = this.billManagerFormItem.dueDt.replace(/-/g, "");
        // this.billManagerFormItem.billMoney = this.billManagerFormItem.billMoney.toString().replace(/,/g, "");
        this.$refs.billManagerDatagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.billManagerFormItem.reverseBillNo = "";
        this.billManagerFormItem.billMoney = "";
        this.billManagerFormItem.remitDt = "";
        this.billManagerFormItem.dueDt = "";
        this.billManagerFormItem.minBillRangeStart = "";
        this.billManagerFormItem.maxBillRangeEnd = "";
        this.billManagerFormItem.billOrigin = "";
      },
      //批次记账或选择记账
      accountDetail(type) {
        this.acctType = type;
        if (type === "select") {
          let list = this.$refs.billManagerDatagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let impawnIds = [];
          for (let i = 0; i < list.length; i++) {
            impawnIds.push(list[i].id);
          }
          let params = {
            batchId: this.impawnBillParams.batchId,
            impawnIds: impawnIds.join(","),
            operType: "0",
            funcNo: this.billManagerFormItem.funcNo,
            acctAuthBusiType:"05"
          };
          this.handleAccountSubmit(params);
        } else if (type === "batch") {
          if (this.$refs.billManagerDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = {
            batchId: this.impawnBillParams.batchId,
            operType: "1",
            funcNo: this.billManagerFormItem.funcNo,
            acctAuthBusiType:"05"
          };
          this.handleAccountSubmit(params);
        }
      },
      handleAccountSubmit(params) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账吗?",
          onOk: () => {
            this.getEntryInfo(params);
          }
        });
      },
      //获取分录信息
      getEntryInfo(params) {
        this.acctRecordUrl =  "/ce/impawn/elec/elecImpawn/eImpawnAccountMain/func_getImpawnAccount";
        this.acctRecordParam = params;
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        let params = {};
        if (this.acctType === "select") {
          let impawnIds = [];
          for (let i = 0; i < this.$refs.billManagerDatagrid.selects.length; i++) {
            impawnIds.push(this.$refs.billManagerDatagrid.selects[i].id);
          }
          params = {
            batchId: this.impawnBillParams.batchId,
            impawnIds: impawnIds.join(","),
            operType: "0",
            funcNo: this.billManagerFormItem.funcNo
          };
        } else if (this.acctType === "batch") {
          params = {
            batchId: this.impawnBillParams.batchId,
            operType: "1",
            funcNo: this.billManagerFormItem.funcNo
          };
        }
        this.acctSubmitFlag = true;
        let url =  "/ce/impawn/elec/elecImpawn/eImpawnAccountMain/func_impawnAccount" ;
        post(params, url).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      acctAuthorize(){
        let params = {};
        if (this.acctType === "select") {
          let impawnIds = [];
          for (let i = 0; i < this.$refs.billManagerDatagrid.selects.length; i++) {
            impawnIds.push(this.$refs.billManagerDatagrid.selects[i].id);
          }
          params = {
            batchId: this.impawnBillParams.batchId,
            impawnIds: impawnIds.join(","),
            operType: "0",
            funcNo: this.billManagerFormItem.funcNo
          };
        } else if (this.acctType === "batch") {
          params = {
            batchId: this.impawnBillParams.batchId,
            operType: "1",
            funcNo: this.billManagerFormItem.funcNo
          };
        }
        this.acctSubmitFlag = true;
        let url =  "/ce/impawn/elec/elecImpawn/eImpawnAccountMain/func_addAcctAuthorize" ;
        post(params, url).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showAcctRecordWinClose();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.impawnBatchDetail.getImpawnBatchInfo(this.impawnBillParams.accountType);
        this.$refs.billManagerDatagrid.dataChange(1,(data)=>{
          if(data.length === 0) {
            this.returnMain();
          }
        })
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //记账批次退回或选择退回
      backDetail(type) {
        if (type === "select") {
          let list = this.$refs.billManagerDatagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let impawnIds = [];
          for (let i = 0; i < list.length; i++) {
            impawnIds.push(list[i].id);
          }
          let params = params = {
            batchId: this.impawnBillParams.batchId,
            impawnIds: impawnIds.join(","),
            operType: "0"
          };
          this.handleAccountBack(params);
        } else if (type === "batch") {
          if (this.$refs.billManagerDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = { batchId: this.impawnBillParams.batchId, operType: "1" };
          this.handleAccountBack(params);
        }
      },
      handleAccountBack(params) {
        let url =  "/ce/impawn/elec/elecImpawn/eImpawnAccountMain/func_impawnAccountBack";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账退回吗",
          onOk: () => {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.acctType === "batch" || this.$refs.billManagerDatagrid.tData.length === this.$refs.billManagerDatagrid.selects.length) {
                    this.returnMain();
                  } else {
                    this.$refs.impawnBatchDetail.getImpawnBatchInfo(this.impawnBillParams.accountType);
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                    this.$refs.billManagerDatagrid.selects = [];
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //返回主页面
      returnMain() {
        this.resetSearch();
        this.$emit("returnAccountMain", "");
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(row, type) {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        if (type === "billId") {
          this.billId = row.billId;
        } else {
          this.billNo = row.billNo;
        }
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
