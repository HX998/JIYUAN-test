<!--创设业务-费用收取-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--批次号-->
                <common-input v-model="formItem.batchNo" :label="$t('m.i.common.batchNo')"
                              prop="batchNo" :maxlength="150"></common-input>
                <!--标票产品名称-->
                <common-input v-model="formItem.stdProductNameLike" :label="$t('m.i.bs.stdProductName')"
                              prop="stdProductNameLike"  :maxlength="60" :showIcon="true" @on-click="queryProductName" ></common-input>
                <!--产品兑付日期-->
                <common-date-picker v-model="paymentDt" :label="$t('m.i.bs.prodPaymentDt')" type="daterange" :autoPlacement="true" @on-change="handlePaymentDtChange"></common-date-picker>
                <!--兑付状态-->
                <common-select v-model="formItem.cashStatus" :label="$t('m.i.be.cashStatus')" prop="cashStatus"
                               :dictList="stdCashStatusList"></common-select>

                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/corpstdbill/payment/stdPayment/func_queryStdPaymentAccount"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account()">{{$t("m.i.be.acct")}}</h-button>
              <h-button type="primary" @click="returnBack()">{{$t("m.i.be.returnBack")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.ecdsAcctNo" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true></show-cust-acct-no>
    <!-- 产品选择  -->
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>

    <acct-record :param="param"  :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 :url="acctRecord" @acctSubmitSure="acctSubmitSure"></acct-record>

    <std-payment-detail :stdPaymentDetailWin="stdPaymentDetailWin" :batchParams="batchParams" :dictMap="dictMap"
                               @stdPaymentDetailWinClose="stdPaymentDetailWinClose" ref="stdPaymentDetail"></std-payment-detail>

  </div>
</template>

<script>
  import { post, accMul, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationPaymentAccount",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      StdPaymentDetail: () => import(/* webpackChunkName: "bs/corpstdbill/payment/stdPaymentDetail" */`@/views/bizViews/bs/corpstdbill/payment/stdPaymentDetail`),
    },
    data() {
      return {
        creationAmtRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "产品规模(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        validAcctNoRules: [{
          test: /^[0-9a-zA-Z]{1,32}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为32位"
        }],
        formItem: {
          batchNo:"",
          stdProductNo: "",
          stdProductName:"",
          stdProductNameLike:"",
          ecdsAcctNo:"",
          ecdsAcctName: "",
          sellBrchName:"",
          minCreationAmt:"",
          maxCreationAmt:"",
          minPaymentDt:"",
          maxPaymentDt:""
        },
        paymentDt:[],
        stdPaymentDetailWin:false,
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.acctDetail(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t('m.i.bs.stdProductShortName'),
            key: 'stdProductShortName',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bs.currPaymentAmt"),
            key: "currPaymentAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.currPaymentAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.paymentDt'),
            key: 'currPaymentDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.currPaymentDt ? this.$moment(params.row.currPaymentDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.cashStatus'),
            key: 'cashStatus',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'StdCashStatus', params.row.cashStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.bs.stdProductName'),
            key: 'stdProductName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bs.baseAssetType"),
            key: "baseAssetType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BaseAssetType", params.row.baseAssetType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.bs.creationAmt"),
            key: "creationAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.creationAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.creationTerm'),
            key: 'creationTerm',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.prodPaymentDt'),
            key: 'paymentDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.paymentDt ? this.$moment(params.row.paymentDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
        ],
        currentSelectRow: [],

        param : {},
        acctRecord : "/bs/corpstdbill/payment/stdPayment/func_queryStdCreationPaymentRecord",
        accountUrl : "/bs/corpstdbill/payment/stdPayment/func_stdPaymentAccount",
        showPrintButton:false,
        acctSubmitFlag:false,
        showAcctRecordWin : false,

        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch:false,
        showCustAcctNoWin: false,
        baseAssetTypeList:[],
        transPlaceList:[],
        purchaseResultList:[],
        stdCashStatusList:[],
        draftTypeCodeList:[],
        isList:[],
        collectModeList:[],
        batchParams: {},
      };
    },
    mounted() {
      this.getDictListByGroups("BaseAssetType,Yon,TransPlace,PurchaseResult,StdCashStatus,DraftTypeCode").then(res => {
        this.isList = res.get("Yon");
        this.baseAssetTypeList = res.get("BaseAssetType");
        this.transPlaceList = res.get("TransPlace");
        this.purchaseResultList = res.get("PurchaseResult");
        this.stdCashStatusList = res.get("StdCashStatus");
        this.draftTypeCodeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.paymentDt=[];
        this.formItem.minPaymentDt="";
        this.formItem.maxPaymentDt="";
        this.formItem.stdProductNo="";
        this.formItem.batchNo="";
        this.formItem.cashStatus="";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handlePaymentDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minPaymentDt = arr[0].replace(/-/g, "");
          this.formItem.maxPaymentDt = arr[1].replace(/-/g, "");
          this.paymentDt = [arr[0], arr[1]];
        } else {
          this.formItem.minPaymentDt = "";
          this.formItem.maxPaymentDt = "";
          this.paymentDt = [];
        }
      },
    // 根据弹框所选数据进行赋值
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        // this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
      },
      queryEcdsAcctNo(){
        this.showCustAcctNoWin = true;
      },
      showCustAcctNoWinClose(){
        this.showCustAcctNoWin = false;
      },
      custAcctNoSelectSubmit(info) {
        this.formItem.ecdsAcctNo = info.custAcctNo;
        this.formItem.ecdsAcctName = info.custName;
        this.showCustAcctNoWin = false;
      },

      printSuccessCallback(){
        this.showAcctRecordWinClose();
      },

      account() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要兑付记账吗") + "?",
          onOk: () => {
            this.param = {id:this.currentSelectRow.id,ownedBrchNo:this.currentSelectRow.applBrchNo};
            this.showAcctRecordWin = true;
          }
        });
      },
      //退回
      returnBack() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要退回吗") + "?",
          onOk: () => {
          let id = this.currentSelectRow.id;
          let url = "/bs/corpstdbill/payment/stdPayment/func_cancelStdPaymentConfirm";
          post({ id: id }, url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
            }
          });
          }
        });
      },

      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ id: info.id ,ownedBrchNo:info.ownedBrchNo,
          ownedBrchName:info.ownedBrchName }, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },

      acctDetail(id){
        this.batchParams.batchId = id;
        this.batchParams.batchType = "show";
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.baseAssetTypeList = this.baseAssetTypeList;
        this.batchParams.transPlaceList = this.transPlaceList;
        this.batchParams.isList = this.isList;
        this.batchParams.purchaseResultList = this.purchaseResultList;
        this.batchParams.stdCashStatusList = this.stdCashStatusList;
        this.stdPaymentDetailWin = true;
      },
      stdPaymentDetailWinClose() {
        this.stdPaymentDetailWin = false;
        this.batchParams = {};
      },
    }
  };
</script>

<style scoped>

</style>
