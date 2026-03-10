<!--回购申请-修改申请单-->
<template>
  <h-msg-box
    v-model="tempApplyEditWin"
    width="1000"
    :mask-closable="false"
    @on-close="handleClose"
    top="10"
    class="h-form-search-layer"
    :maximize="true"
    :footerHide="true"
    :height="getHeight"
  >
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <!--批次明细反显界面-->
      <sale-mature-batch-detail
        :editForm="editForm"
        :dictList="dictList"
        :isShowPyeeInfo="isShowPyeeInfo"
        ref="batchDetail"
        @batchDetailSubmit="batchDetailSubmit"
        @changeDueRate="changeDueRate"
      ></sale-mature-batch-detail>
      <h-datagrid
        :columns="columns"
        highlight-row
        url="/be/market/redeem/sale/querySaleMatureBillList"
        :bindForm="applyEditParams"
        :notSetWidth="true"
        :onSelectChange="handleCurrentChange"
        :autoLoad="false"
        ref="datagrid"
      >
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="handleCalcInterest" v-if="authObj.calcInterestAuth">利息计算</h-button>
          <h-button type="primary" @click="adjustInterest" v-if="authObj.adjustInterestAuth">利息调整</h-button>
          <h-button
            type="primary"
            @click="downloadSaleInfo"
            v-if="authObj.downloadSaleInfoAuth"
          >{{$t('m.i.common.exportData')}}</h-button>
          <h-button type="primary" @click="handleSubmitApply" v-if="authObj.submitApplyAuth">提交申请</h-button>
        </div>
      </h-datagrid>
    </div>
    <!--利息调整界面-->
    <adjust-interest
      :adjustInterestWin="adjustInterestWin"
      :adjustParams="adjustParams"
      @adjustInterestWinClose="adjustInterestWinClose"
      @adjustInterestSubmit="adjustInterestSubmit"
    ></adjust-interest>
    <bill-info-main
        @billInfoWinClose="billInfoWinClose"
        :showBillInfoWin="showBillInfoWin"
        :billId="billId"
        :billNo="billNo"
        :billRangeStart="billRangeStart"
        :billRangeEnd="billRangeEnd"
      ></bill-info-main>
  </h-msg-box>
</template>

<script>
import { post, on, off, accMul, accDiv,formatNumber, formatBillRange } from "@/api/bizApi/commonUtil";

export default {
  name: "saleMatureApplyEdit",
  data() {
    return {
      authObj : {
        calcInterestAuth: true,       //利息计算
        adjustInterestAuth: true,     //利息调整
        downloadSaleInfoAuth: true,   //清单导出
        submitApplyAuth: true         //提交申请
      },
      columns : [
        {
          type: "selection",
          width: 50,
          hiddenCol: false,
          align: "center"
        },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center"
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key:"billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.pageShowFormatBillOrigin(this.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'),
          key: "billNo",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("a", {
                on: {
                    click: () => {
                        this.showBillInfo(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                    }
                }
            }, params.row.billNo);
        }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          key:"billRange",
          hiddenCol: false,
          render: (h, params) => {
            let list = formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("span", formatNumber(params.row.billMoney, 2, ","));
          }
        },
        {
          title: this.$t('m.i.be.trialInterestByUnit'),
          key: "dueInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.dueInterest, 2, ","));
          }
        },
        {
          title: this.$t('m.i.be.trialDueInterestByUnit'),
          key: "dueSettleAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.dueSettleAmt, 2, ","));
          }
        },
        {
          title: this.$t('m.i.be.duePayInterestByUnit'),
          key: "duePayInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.duePayInterest, 2, ","));
          }
        },
        {
          title: this.$t('m.i.be.duePayAmtByUnit'),
          key: "duePayAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.duePayAmt, 2, ","));
          }
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
          key: "remitDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.billInfo.dueDt'),
          key: "dueDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.billInfo.drwrName'),
          key: "drwrName",
          sortable: true,
          hiddenCol: false,

        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: "acptName",
          sortable: true,
          hiddenCol: false,

        },
        {
          title: this.$t('m.i.billInfo.acptBrchCode'),
          key: "acptBrchCode",
          hiddenCol: false,

        },
        {
          title: this.$t('m.i.billInfo.acptBankName'),
          key: "acptBankName",
          sortable: true,
          hiddenCol: false,

        },
        {
          title: this.$t('m.i.billInfo.cfmAppBrchCode'),
          key: "cfmAppBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.cfmAppBankName'),
          key: "cfmAppBankName",
          sortable: true,
          hiddenCol: false,

        },
        {
          title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
          key: "acptGuarntrBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptGuarntrBankName'),
          key: "acptGuarntrBankName",
          sortable: true,
          hiddenCol: false

        },
        {
          title: this.$t('m.i.billInfo.discBrchCode'),
          key: "discBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.discBankName'),
          key: "discBankName",
          hiddenCol: false,
          sortable: true

        },
        {
          title: this.$t('m.i.billInfo.discGuarntrBrchCode'),
          key: "discGuarntrBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.discGuarntrBankName'),
          key: "discGuarntrBankName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
          key: "guarntrTrustBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.guarntrTrustBankName'),
          key: "guarntrTrustBankName",
          sortable: true,
          hiddenCol: false
        }
      ],
      editForm : {
        batchNo: "",    //批次号
        dealNo: "",     //成交单编号
        busiType: "",   //业务类型
        saleBrchName: "",   //本方机构名称
        buyBrchCode: "",    //对方机构代码
        buyBrchName: "",    //对方机构名称
        billType: "",       //票据种类
        billClass: "",      //票据介质
        dueSettleDt: "",    //原到期结算日
        applDt: "",         //申请日期
        redeemType: "",     //赎回类别
        redeemReason:"",    //赎回原因
        rate: "",           //原交易利率
        dueRate: "",        //赎回(到期)利率
        ratePct:"",        //原交易利率(百分比)
        dueRatePct:"",     //赎回(到期)利率(百分比)
        totalAmt: "",        //原票据总额
        buyBackTotalAmt: "",    //回购总金额
        totalNum: "",          //原票据张数
        redeemSumAmt: "",      //票据总额(赎回总金额)
        redeemSumBuyTotalAmt: "",     //赎回回购总金额
        redeemSumNum: "",          //票据张数(赎回总笔数)
        dueInterest: "",        //试算利息
        dueSettleAmt: "",        //试算结算金额
        duePayInterest: "",     //实付利息
        duePayAmt: "",          //实付结算金额
        reqDealOpin: "",       //发起方处理意见
        reqRemark: "",        //申请备注
        sgnOpin: "",          //应答方处理意见
        respRemark: "",         //应答备注
        minDueRate: "",          //赎回最小利率
        maxDueRate: "",          //赎回最大利率
        operName: "",          //区分当前操作
        pyeeAcctNo:"",          //收款人账号
        pyeeName:"",            //收款人名称
        pyeeBankNo:"",          //收款人开户行号
        pyeeBankName:"",         //收款人开户行名
        licenseFlag: this.licenseFlag,
      },
      //利息调整弹出框
      adjustInterestWin : false,
      showBillInfoWin : false,
        billId : "",
        billNo : "",
      billRangeStart:'',
      billRangeEnd:'',
      //选中需调整利息id
      adjustParams : {
        adjustId: "",
        billNo: "",
        billMoney: "",
        dueInterest: ""
      },
      calInterestFlag : false,
      preDueRate: "",
      dictMap: null
    }
  },
  props: {
    isShowPyeeInfo:{
      type:String,
      default:"1"
    },
    title: {
      type: String,
      default: "修改申请单"
    },
    applyEditWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    licenseFlag:false,
    applyEditParams: {
      type: Object,
      default: {
        batchId: ""
      }
    },
    dictList: {
      type: Object,
      default: {
        busiTypeList: [],
        billTypeList: [],
        billClassList: [],
        redeemTypeList: [],
        adjustTypeList: [],
        settleTypeList:[]
      }
    }
  },
  components: {
    AdjustInterest:()=>import(/* webpackChunkName: "be/market/redeem/sale/adjustInterest" */`@/views/bizViews/be/market/redeem/sale/adjustInterest`),
    SaleMatureBatchDetail:()=>import(/* webpackChunkName: "be/market/redeem/sale/saleMatureBatchDetail" */`@/views/bizViews/be/market/redeem/sale/saleMatureBatchDetail`)
  },
  watch: {
    applyEditWin(val) {
      if (val) {
        this.initData();
      }
    }
  },
  computed: {
    tempApplyEditWin: {
      get() {
        return this.applyEditWin;
      },
      set() {}
    },
    getHeight() {
      return window.innerHeight - 50;
    }
  },
  methods: {
    initData() {
      this.queryObjById();
      this.$nextTick(() => {
        this.currentSelectRow = [];
        this.currentSelectRowInx = [];
        this.$refs.datagrid.dataChange(1);
      });
    },
    //根据批次号查询明细
    queryObjById() {
      let batchId = this.applyEditParams.batchId;
      post({ id: batchId }, "/be/market/redeem/sale/editSaleMature").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$nextTick(() => {
              let obj = res.data.retData;
              Object.assign(this.editForm, obj);
              this.calInterestFlag = obj.interestStatus === "1";
              this.preDueRate = this.editForm.dueRatePct;
              this.editForm.licenseFlag = this.licenseFlag;
              if (obj.dueSettleDt != null && obj.dueSettleDt !== "") {
                this.editForm.dueSettleDt = this.$moment(
                  obj.dueSettleDt,
                  "YYYYMMDD"
                ).format("YYYY-MM-DD");
              }
              if (obj.applDt != null && obj.applDt !== "") {
                this.editForm.applDt = this.$moment(
                  obj.applDt,
                  "YYYYMMDD"
                ).format("YYYY-MM-DD");
              }
              if (this.editForm.settleMode=='ST01' && this.editForm.busiType == 'RBT02'){
                this.authObj.adjustInterestAuth = false;
              } else {
                this.authObj.adjustInterestAuth = true;
              }
              // this.editForm.rate = accMul(this.editForm.rate, 100);
              // this.editForm.dueRate = accMul(this.editForm.dueRate, 100);
            });
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    handleClose() {
      this.$refs.batchDetail.$refs.editForm.resetFields();
      this.$emit("applyEditWinClose", "");
    },
    handleCurrentChange(arr, selectInx) {
      this.currentSelectRow = arr;
      this.currentSelectRowInx = selectInx;
    },

    //批次明细保存
    batchDetailSubmit(editForm, opType, callback) {
      editForm.dueSettleDt = editForm.dueSettleDt.replace(/-/g, "");
      editForm.applDt = editForm.applDt.replace(/-/g, "");
      // editForm.rate = accDiv(editForm.rate, 100);
      // editForm.dueRate = accDiv(editForm.dueRate, 100);
      if(opType === "save"){
        this.editForm.operName = "save";
      }
      post(editForm, "/be/market/redeem/sale/updateSaleMature").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            if (opType === "save") {
              this.$msgTip.success(this);
              this.initData();
            } else if (opType === "calcInterest") {
              this.calcInterest();
            } else if (opType === "commitApply") {
              this.submitApply(res => {
                callback();
              });
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    //利息计算
    handleCalcInterest() {
      this.$hMsgBox.confirm({
          title: "利息计算",
          content: "确定要利息计算吗？",
          onOk: () => {
            this.editForm.operName = "calcInterest";
            this.batchDetailSubmit(this.editForm, "calcInterest");
          }
      });
    },
    calcInterest() {
      post(
        { id: this.applyEditParams.batchId },
        "/be/market/redeem/sale/calcInterest"
      ).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.initData();
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    //利息调整
    adjustInterest() {
      if(this.calInterestFlag) {
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          if (this.currentSelectRow[0].dueInterest) {
            this.adjustParams.adjustId = this.currentSelectRow[0].id;
            this.adjustParams.billNo = this.currentSelectRow[0].billNo;
            this.adjustParams.billMoney = this.currentSelectRow[0].billMoney;
            this.adjustParams.dueInterest = this.currentSelectRow[0].dueInterest;
            this.adjustParams.adjustTypeList = this.dictList.adjustTypeList;
            this.adjustInterestWin = true;
          } else {
            this.$msgTip.info(this, { info: "试算利息为空，请先利息计算" });
          }
        }
      }else{
        this.$msgTip.error(this, { info: this.$t("利息未计算") });
      }
    },
    adjustInterestWinClose() {
      this.adjustInterestWin = false;
    },
    //利息调整提交
    adjustInterestSubmit() {
      this.adjustInterestWin = false;
      this.initData();
    },
    //清单导出t
    downloadSaleInfo() {
      if (this.$refs.datagrid.total > 0) {
        let url =
          window.LOCAL_CONFIG.API_HOME + "/be/market/redeem/sale/downloadSaleInfo";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        let input = document.createElement("input");
        input.tpye = "text";
        input.name = "ids";
        input.value = this.$refs.datagrid.selectIds;
        form.appendChild(input);
        let input1 = document.createElement("input");
        input1.type = "text";
        input1.name = "batchId";
        input1.value = this.applyEditParams.batchId;
        form.appendChild(input1);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      } else {
        this.$hMessage.warning("暂无数据可导出");
      }
    },
    //提交申请
    handleSubmitApply() {
      this.$hMsgBox.confirm({
          title: "提交申请",
          content: "确定要提交申请吗？",
          onOk: () => {
            this.editForm.operName = "commitApply";
            this.batchDetailSubmit(this.editForm, "commitApply", res => {
              this.$refs.batchDetail.$refs.editForm.resetFields();
              this.$emit("applyEditWinClose", "");
            });
          }
      });
    },
    submitApply(callback) {
      post(
        { id: this.applyEditParams.batchId ,ownedBrchNo:this.editForm.ownedBrchNo,licenseFlag:this.licenseFlag},
        "/be/market/redeem/sale/commitApply"
      ).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$emit("applyEditWinClose", "");
            callback();
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
      this.billId = billId;
      this.billNo = billNo;
      this.billRangeStart=billRangeStart;
      this.billRangeEnd=billRangeEnd;
      this.showBillInfoWin = true;
    },
    billInfoWinClose() {
      this.billId = null;
      this.billNo = null;
      this.billRangeStart = null;
      this.billRangeEnd = null;
      this.showBillInfoWin = false;
    },
    changeDueRate(val){
      this.calInterestFlag = this.preDueRate === val;
    },
    pageShowFormatBillOrigin(map, groupCode, key) {
      if (key == null || key === '') {
        return '-';
      }
      if (key.toString() === 'CS00') {
        return '-';
      }
      return this.getDictValueFromMap(map, groupCode, key);
    }
  },
  created() {
    this.getDictListByGroups("BillOrigin").then(res => {
      this.dictMap = res.get("map");
    });

  }
};
</script>

<style scoped>
</style>
