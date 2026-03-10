<template>
  <div>
    <h-msg-box v-model="tempSaleTotalChangeWin" :mask-closable="false" @on-close="handleClose" :maximize="true"
               width="1000" :height="600" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div>
        <h-form :model="formItem" :label-width="100" ref="formItem" cols="3" class="h-form-search" onlyBlurRequire>
          <quote-input :busiType="bt" :isChange="isChange" :formItem="formItem" :brchType="formItem.brchType" :dictMap="dictMap" :saleTotalChangeWin="tempSaleTotalChangeWin">
            <div slot="save">
              <h-form-item label="" prop="prodName" class="h-form-three">
                <h-button type="primary" @click="editApply()">{{$t('m.i.common.save')}}</h-button>
              </h-form-item>
            </div>
          </quote-input>
        </h-form>
      </div>
      <!-- 数据展示表格 -->
      <h-row>
        <h-col span="24">
          <h-datagrid :columns="columns"
                      url="/be/market/quote/sale/saleTotalColl/func_querySaleBillList"
                      :bindForm="billFormItem"
                      :onSelectChange="quoteBillSelectClick"
                      :rowSelect="true"
                      :auto-load="false"
                      ref="billDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pickBill()">{{$t('m.i.common.pickBill')}}</h-button>
              <h-button type="primary" @click="importPickBill()">{{$t('m.i.common.exportPickBill')}}</h-button>
              <h-button type="primary" @click="calcInterest()">{{$t('m.i.be.calcInterest')}}</h-button>
              <h-button type="primary" @click="apply()">{{$t('m.i.be.applyBatch')}}</h-button>
              <h-button type="primary" @click="deleteBill()">{{$t('m.i.be.deleteBill')}}</h-button>
              <h-button type="primary" @click="downMoudle()">{{$t('m.i.common.templateDownload')}}</h-button>
              <h-button type="primary" @click="preDelBill()">{{$t('m.i.be.preDelBill')}}</h-button>
              <h-button type="primary" @click="replyDel()">{{$t('m.i.be.replyDel')}}</h-button>
              <h-button type="primary" @click="resetSaleQuote()" v-if="formItem.quoteNo">{{$t('m.i.be.resetQuote')}}</h-button>
              <h-button type="primary" @click="exportBill()" :disabled="exportBillCommit">{{$t('m.i.common.exportExcel')}}</h-button>
              <h-button type="primary" @click="printBill()" v-if="this.btnAuth.saleTotalChangePrintBill === undefined ? true : this.btnAuth.saleTotalChangePrintBill.isShow">{{$t('m.i.be.printBill')}}</h-button>
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
    </h-msg-box>

    <h-msg-box v-model="applyWin" :maximize="false" width="400" :footerHide="true" :closable="false" :z-index="2010">
      <div class="modal-body">
        <div class="h-modal-confirm">
          <div class="h-modal-confirm-head">
            <div class="h-modal-confirm-head-icon h-modal-confirm-head-icon-confirm">
              <i class="h-icon iconfont icon-feedback"></i>
            </div>
            <div class="h-modal-confirm-head-title">确认要继续提交申请吗?</div>
          </div>
          <div class="h-modal-confirm-body">
            <div>{{applyTitle}}</div>
          </div>
          <div class="h-modal-confirm-footer">
            <button type="button" @click="applyClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span></button>
            <button type="button" @click="applyCommit()" class="h-btn h-btn-primary h-btn-large"><span>确定</span>
            </button>
          </div>
        </div>
      </div>
    </h-msg-box>

    <!-- 批量导入-->
    <upload
      :uploadUrl="uploadUrl"
      :batchId="curBatchId"
      :isLock="isLock"
      @uploadWinClose="uploadWinClose"
      :uploadWin="uploadWin"
      :importSelect="importSelect"
      :selectDataFirst="selectDataFirst">
    </upload>
    <pickBill
      :pickBillUrl="pickBillUrl"
      :batchId="curBatchId"
      :billType="billType"
      :billClass="billClass"
      :isLock="isLock"
      :busiType="busiType"
      :dictMap="dictMap"
      :custBrchCode="this.formItem.buyBrchCode"
      :isTotalColl="isTotalColl"
      @pickBillWinClose="pickBillWinClose"
      :rootUrl="rootUrl"
      :pickBillWin="pickBillWin">
    </pickBill>
    <pickPackBill
      :pickPackBillUrl="pickPackBillUrl"
      :batchId="curBatchId"
      :billType="billType"
      :billClass="billClass"
      :dictMap="dictMap"
      @pickPackBillWinClose="pickPackBillWinClose"
      :pickPackBillWin="pickPackBillWin">
    </pickPackBill>
    <sale-detail-print :batchId="curBatchId" :dictMap="dictMap.dictListMap" :busiType="bt" :isTotalColl="isTotalColl" :rootUrl="rootUrl"
                       :saleDetailPrintWin="showSaleDetilPrint" @closeMsgBox="closeDetilPrint()"></sale-detail-print>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>
<script>
  import { post, on, off,formatNumber,getUploadImgType } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleTotalChange",
    data() {
      return  {
        btnAuth: {
          type: Object,
          default(){
            return {
              saleTotalChangePrintBill:{
                isShow:true
              }
            }
          }
        },
        formItem:{
          id:'',
          busiType:'',
          quoteNo:'',
          saleBrchCode:'',
          saleBrchName:'',
          saleTraderNo:'',
          saleTraderName:'',
          saleProductNo:'',
          saleProductName:'',
          buyBrchCode:'',
          buyBrchName:'',
          buyTraderNo:'',
          buyTraderName:'',
          buyProductNo:'',
          buyProductName:'',
          subDeal:'',
          billClass:'',
          billType:'',
          clearSpeed:'',
          clearType:'',
          settleMode:'',
          selectType:'',
          packetSeq:'',
          quoteTm:'',
          setTm:'',
          firstSettleDt:'',
          dueSettleDt:'',
          prodNo:'',
          ratePct:'',
          dueRatePct:'',
          totalNum:'',
          totalAmt:'',
          buyBackTotalAmt:'',
          tenorDays:'',
          yieldRatePct:'',
          firstSettleAmt:'',
          dueSettleAmt:'',
          firstPayInterest:'',
          dueInterest:'',
          productMapDict:'',
          workDate:'',
          maxTenorDays:'',
          minRate:'',
          maxRate:'',
          isInner:'',
          brchType:'',
          sumInterestMargin:"",
        },
        columns:[
          {
              type: 'selection',
              width: 50,
              hiddenCol: false,
              align: 'center'
            },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('m.i.common.status'),
            key: 'preRelationFlag',
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.$parent._data.dictMap,"PreRelationFlag",params.row.preRelationFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.$parent._data.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: 'billNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.remitDt?this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueDt?this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: 'dueMatDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueMatDt?this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
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
            hiddenCol: false,

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
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false,

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
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
            key: "guarntrTrustBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap.dictListMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.remainDays'),
            key: "remainDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dueRemainDays'),
            key: "dueRemainDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.interestMargin'),
            key: "interestMargin",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.interestMargin, 2, ','))
            }
          }
        ],
        // 分页切换配置
        pageSizeOpts : [10, 20, 50, 200],
        applyWin : false,
        applyTitle : "",
        curBatchId: null,
        isChange: false,
        saleFlag:"",
        billFormItem: { batchId: this.curBatchId },
        uploadUrl: "",
        uploadWin: false,
        importSelect: false,
        selectDataFirst: false,
        quoteBillSelectList: [],
        quoteBillSelectRowInx: [],
        pickPackBillWin: false,
        pickPackBillUrl: "",
        pickBillUrl: "",
        pickBillWin: false,
        billType: "",
        billClass: "",
        busiType: "",
        exportBillCommit: false,
        isLock: null,
        showBillInfoWin: false,
        showSaleDetilPrint: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        rootUrl:"/be/market/quote/sale/saleTotalColl",
        isTotalColl:"1"
      };
    },
    components: {
      Upload:()=>import(/* webpackChunkName: "be/market/quote/sale/upload" */`@/views/bizViews/be/market/quote/sale/upload`),
      PickBill:()=>import(/* webpackChunkName: "be/market/quote/sale/pickBill" */`@/views/bizViews/be/market/quote/sale/pickBill`),
      QuoteInput:()=>import(/* webpackChunkName: "be/market/quote/sale/saleTotalInput" */`@/views/bizViews/be/market/quote/sale/saleTotalInput`),
      PickPackBill:()=>import(/* webpackChunkName: "be/market/quote/sale/pickPackBill" */`@/views/bizViews/be/market/quote/sale/pickPackBill`),
      SaleDetailPrint:()=>import(/* webpackChunkName: "be/market/quote/sale/saleDetailPrint" */`@/views/bizViews/be/market/quote/sale/saleDetailPrint`)
  },
    props: {
      title: String,
      trDir: String,//交易方向：买入、卖出、正回购、逆回购
      bt: String, //交易类型：转贴现，质押式回购，买断式回购
      batchId: Number,
      dictMap: {
        type: Object
      },
      saleTotalChangeWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempSaleTotalChangeWin: {
        get() {
          return this.saleTotalChangeWin;
        },
        set() {

        }
      }
    },
    watch: {
      saleTotalChangeWin(val) {
        if (val) {
          this.curBatchId = this.batchId;
          if (this.batchId) {
            this.isChange = false;
          } else {
            this.isChange = true;
          }
          this.init();
        }
      }
    },
    methods: {
      getButtonAuth(){
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth =JSON.parse(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      turnForm(formItem,obj){
        formItem.id=obj.id;
        formItem.memberId=obj.memberId;
        formItem.busiType=obj.busiType;
        formItem.quoteNo=obj.quoteNo;
        formItem.saleBrchCode=obj.saleBrchCode;
        formItem.saleBrchName=obj.saleBrchName;
        formItem.saleTraderNo=obj.saleTraderNo;
        formItem.saleTraderName=obj.saleTraderName;
        formItem.saleProductNo=obj.saleProductNo;
        formItem.saleProductName=obj.saleProductName;
        formItem.buyBrchCode=obj.buyBrchCode;
        formItem.buyBrchName=obj.buyBrchName;
        formItem.buyTraderNo=obj.buyTraderNo;
        formItem.buyTraderName=obj.buyTraderName;
        formItem.buyProductNo=obj.buyProductNo;
        formItem.buyProductName=obj.buyProductName;
        formItem.subDeal=obj.subDeal;
        formItem.billClass=obj.billClass;
        formItem.billType=obj.billType;
        formItem.clearSpeed=obj.clearSpeed;
        formItem.clearType=obj.clearType;
        formItem.settleMode=obj.settleMode;
        formItem.selectType=obj.selectType;
        formItem.packetSeq=obj.packetSeq;
        formItem.quoteTm=obj.quoteTm;
        formItem.setTm=obj.setTm;
        formItem.firstSettleDt=obj.firstSettleDt;
        formItem.dueSettleDt=obj.dueSettleDt;
        formItem.prodNo=obj.prodNo;
        formItem.ratePct=obj.ratePct;
        formItem.dueRatePct=obj.dueRatePct;
        formItem.totalNum=obj.totalNum;
        formItem.totalAmt=obj.totalAmt;
        formItem.buyBackTotalAmt=obj.buyBackTotalAmt+"";
        formItem.tenorDays=obj.tenorDays;
        formItem.yieldRatePct=obj.yieldRatePct;
        formItem.firstSettleAmt=obj.firstSettleAmt;
        formItem.dueSettleAmt=obj.dueSettleAmt;
        formItem.firstPayInterest=obj.firstPayInterest;
        formItem.dueInterest=obj.dueInterest;
        formItem.preChangeInfo=obj.preChangeInfo;
        formItem.productMapDict=obj.productMap;
        formItem.workDate=obj.workDate;
        formItem.maxTenorDays=obj.maxTenorDays;
        formItem.minRate=obj.minRate;
        formItem.maxRate=obj.maxRate;
        formItem.isInner=obj.isInner;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      handleClose() {
        this.formItem.clearSpeed = "";
        this.curBatchId = null;
        this.billFormItem.batchId = null;
        this.saleBrchCode = "";
        this.$refs.formItem.resetFields();
        /**清除多页选择的数据*/
        this.$refs.billDatagrid.selectIds = [];
        this.$refs.billDatagrid.selects = [];
        this.$emit("saleTotalChangeWinClose", "");
      },
      //选择记录
      quoteBillSelectClick(arr, selectInx) {
        this.quoteBillSelectList = arr;
        this.quoteBillSelectRowInx = selectInx;
      },
      // 关闭上传
      uploadWinClose() {
        this.uploadWin = false;
        this.uploadUrl = "";
        this.importSelect = false;
        this.selectDataFirst = false;
        this.init();
      },
      //关闭挑票页面
      pickBillWinClose() {
        this.pickBillWin = false;
        this.init();
      },
      //关闭票据包挑票页面
      pickPackBillWinClose() {
        this.pickPackBillWin = false;
        this.init();
      },
      //保存
      editApply(optType) {
        if (this.formItem.firstSettleDt) {
          this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, "YYYY-MM-DD").format("YYYYMMDD");
        }
        if (this.formItem.dueSettleDt) {
          this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, "YYYY-MM-DD").format("YYYYMMDD");
        }
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            let minRate = this.formItem.minRate ? this.formItem.minRate : 0;
            let maxRate = this.formItem.maxRate ? this.formItem.maxRate : 100;
            let minRateBoolean = this.formItem.ratePct-minRate < 0;
            let maxRateBoolean = this.formItem.ratePct-maxRate > 0;
            let busiType = this.formItem.busiType;
            if (minRateBoolean) {
              if ("BT01" == busiType) {
                this.$msgTip.error(this, { info: "交易利率必须大于等于票交所最小利率参数:" + minRate });
                return;
              } else if ("BT02" == busiType) {
                this.$msgTip.error(this, { info: "回购利率必须大于等于票交所最小利率参数:" + minRate });
                return;
              } else if ("BT03" == busiType) {
                this.$msgTip.error(this, { info: "首期交易利率必须大于等于票交所最小利率参数:" + minRate });
                return;
              }
            }
            if (maxRateBoolean) {
              if ("BT01" == busiType) {
                this.$msgTip.error(this, { info: "交易利率必须小于等于票交所最大利率参数:" + maxRate });
                return;
              } else if ("BT02" == busiType) {
                this.$msgTip.error(this, { info: "回购利率必须小于等于票交所最大利率参数:" + maxRate });
                return;
              } else if ("BT03" == busiType) {
                this.$msgTip.error(this, { info: "首期交易利率必须小于等于票交所最大利率参数:" + maxRate });
                return;
              }
            }
            if ("BT03" == busiType) {
              let minDueRateBoolean = this.formItem.dueRatePct-minRate < 0;
              let maxDueRateBoolean = this.formItem.dueRatePct-maxRate > 0;
              if (minDueRateBoolean) {
                this.$msgTip.error(this, { info: "到期交易利率必须大于等于票交所最小利率参数:" + minRate });
                return;
              }
              if (maxDueRateBoolean) {
                this.$msgTip.error(this, { info: "到期交易利率必须小于等于票交所最大利率参数:" + maxRate });
                return;
              }
            }
            if ("BT03" == busiType || "BT02" == busiType) {
              let maxTenorDays = this.formItem.maxTenorDays ? this.formItem.maxTenorDays : 365;
              if (parseInt(this.formItem.tenorDays) > parseInt(maxTenorDays)) {
                this.$msgTip.error(this, { info: "回购期限不能大于" + maxTenorDays + "天" });
                return;
              }
            }
            let url = "/be/market/quote/sale/saleTotalColl/func_editSaleTotalApply";
            post(this.formItem, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let obj = res.data.retData;
                if (retCode == "000000") {
                  if (obj.id) {
                    this.curBatchId = obj.id;
                    this.billFormItem.batchId = obj.id;
                  }
                  if (optType) {
                    this.init(optType);
                  } else {
                    this.init();
                    this.$msgTip.success(this);
                  }
                } else {
                  if (this.formItem.firstSettleDt) {
                    this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                  }
                  if (this.formItem.dueSettleDt) {
                    this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                  }
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                if (this.formItem.firstSettleDt) {
                  this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                if (this.formItem.dueSettleDt) {
                  this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      // 挑票
      pickBill() {
        this.editApply("pickBill");
      },
      pickBillCallback() {
        if (this.formItem.id) {
          if (this.formItem.selectType && this.formItem.selectType == "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型为票据包时，不能进行挑票操作，请选择票据包挑票操作！") });
            return;
          }
          this.billType = this.formItem.billType,
            this.billClass = this.formItem.billClass,
            this.busiType = this.formItem.busiType,
            this.curBatchId = this.formItem.id;
          this.pickBillWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 导入挑票
      importPickBill() {
        this.editApply("importPickBill");
      },
      importPickBillCallback() {
        if (this.formItem.id) {
          if (this.formItem.selectType && this.formItem.selectType == "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型为票据包时，不能进行导入挑票操作！") });
            return;
          }
          this.uploadWin = true;
          this.uploadUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/sale/saleTotalColl/func_batchSaleBill";
          this.curBatchId = this.formItem.id;
          this.importSelect = true;
          this.selectDataFirst = false;
        }
      },
      // 票据包挑票
      pickPackBill() {
        this.editApply("pickPackBill");
      },
      pickPackBillCall() {
        if (this.formItem.id) {
          if (this.formItem.selectType && this.formItem.selectType != "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型不是票据包时，不能进行票据包挑票操作！") });
            return;
          }
          this.pickPackBillWin = true;
          this.curBatchId = this.formItem.id;
        }
      },
      // 利息计算
      calcInterest() {
        this.editApply("calcInterest");
      },
      calcInterestCallback() {
        if (this.formItem.id) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要计算利息吗") + "?",
            onOk: () => {
              let id = this.formItem.id;
              let url = "/be/market/quote/sale/saleTotalColl/func_calcSaleInterest";
              post({ id: id }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        }
      },
      // 提交申请
      apply() {
        let list=this.$refs.billDatagrid.tData;
        let flag=1;
        let billList=[];
        console.log(list)
        if(window.sessionStorage.getItem("isOpenI9")=="1"){
          for(let i=0;i<list.length;i++){
            if(list[i].assetIndustry=="1"){
              billList.push(list[i].billNo)
              flag=0;
            }
          }
        }
        if(flag==0){
          this.$hMsgBox.confirm({
            title: "确认",
            content: "选中票据【"+billList.toString()+"】资产类型为持有-按摊余成本计量，请确定是否提交？",
            onOk: () => {
              this.applyWin = true;
              this.applyTitle = "确认要提交申请吗?";
            },
            onCancel: () =>{
              return;
            }
          });
        }else{
          this.applyWin = true;
          this.applyTitle = "确认要提交申请吗?";
        }
      },
      applyCallback() {
        if (this.formItem.id) {
          let id = this.formItem.id;
          let url = "/be/market/quote/sale/saleTotalColl/func_commitSaleTotalApply";
          post({ id: id, riskFlag: "0" }, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                let obj = res.data.retData;
                let riskInfo = obj.riskInfo;
                if (riskInfo) {
                  this.$hMsgBox.confirm({
                    title: "确认要继续提交申请吗?",
                    content: riskInfo,
                    onOk: () => {
                      post({ id: id, riskFlag: "1" }, url).then(res => {
                        if (res) {
                          let retCode = res.data.retCode;
                          if (retCode == "000000") {
                            this.$msgTip.success(this);
                            this.quoteBillSelectList = [];
                            this.handleClose();
                          } else {
                            this.$msgTip.error(this, { info: res.data.retMsg });
                          }
                        } else {
                          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                        }
                      });
                    }
                  });
                } else {
                  this.$msgTip.success(this);
                  this.quoteBillSelectList = [];
                  this.handleClose();
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      // 清除票据包
      clearPack() {
        if (this.formItem.id) {
          if (this.formItem.selectType && this.formItem.selectType != "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型不是票据包时，不能进行票据包清除操作！") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要清除票据包吗") + "?",
            onOk: () => {
              let id = this.formItem.id;
              let url = "/be/market/quote/sale/saleTotalColl/func_deleteSalePacketBill";
              post({ id: id }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        }
      },
      // 删除票据
      deleteBill() {
        if (this.formItem.id) {
          if (this.formItem.selectType && this.formItem.selectType == "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型为票据包时，不能删除票据进行操作！") });
            return;
          }
          let list = this.quoteBillSelectList;
          if (list.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要删除票据吗") + "?",
            onOk: () => {
              let ids = "";
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              let url = "/be/market/quote/sale/saleTotalColl/func_deleteSaleBill";
              let batchId = this.formItem.id;
              post({ batchId: batchId, ids: ids }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            }
          });
        }
      },
      // 模板下载
      downMoudle() {
        if (this.formItem.id) {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/sale/saleTotalColl/func_downloadSaleBill";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      // 预删除票据
      preDelBill() {
        if (this.formItem.id) {
          let list = this.quoteBillSelectList;
          if (list.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要预删除票据吗") + "?",
            onOk: () => {
              let ids = "";
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              let url = "/be/market/quote/sale/saleTotalColl/func_removeSaleBill";
              let batchId = this.formItem.id;
              post({ batchId: batchId, ids: ids }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            }
          });
        }
      },
      // 恢复预删除
      replyDel() {
        if (this.formItem.id) {
          let list = this.quoteBillSelectList;
          if (list.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要恢复预删除票据吗") + "?",
            onOk: () => {
              let ids = "";
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              let url = "/be/market/quote/sale/saleTotalColl/func_restoreSaleBill";
              let batchId = this.formItem.id;
              post({ batchId: batchId, ids: ids }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.batchId = this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            }
          });
        }
      },
      resetSaleQuote() {
        if (this.formItem.id) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要报价重置吗") + "?",
            onOk: () => {
              let url = "/be/market/quote/sale/saleTotalColl/func_resetLastSaleQuote";
              let batchId = this.formItem.id;
              post({ id: batchId, fromPage: "saleTotalColl" }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            }
          });
        }else{
          this.$msgTip.error(this, { info: "未保存批次，无法重置报价" });
        }
      },
      // 导出清单
      exportBill() {
        if (this.formItem.id) {
          this.exportBillCommit = true;
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/sale/saleTotalColl/func_exportExcel";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          form.setAttribute("target", "downLoadFrame");
          let input = document.createElement("input");
          input.setAttribute("name", "batchId");
          input.setAttribute("value", this.formItem.id);
          form.appendChild(input);
          let list = this.$refs.billDatagrid.selects;
          if (list.length > 0) {
            let ids = "";
            for (let i = 0; i < list.length; i++) {
              ids += list[i].id;
              if (i < list.length - 1) {
                ids += ",";
              }
            }
            let input2 = document.createElement("input");
            input2.setAttribute("name", "ids");
            input2.setAttribute("value", ids);
            form.appendChild(input2);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
          this.exportBillCommit = false;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 打印清单
      printBill() {
        if (this.curBatchId) {
          this.showSaleDetilPrint = true;
        }else{
          this.$msgTip.error(this, { info: "该批次号为空" });
        }

      },
      //关闭打印窗口
      closeDetilPrint(i) {
        this.showSaleDetilPrint = false;
      },
      //初始化资产分类参数
      initParams(){
        getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
          let value = res.value
          if(value=='0'){//否
            this.saleFlag=0;
          }else if(value=="1"){//是
            this.saleFlag=1;
          }

        })
      },

      //  初始化页面
      init(optType) {
        let batchId = this.curBatchId;
        let busiType = this.bt;
        let url = "";
        if (batchId) {
          url = "/be/market/quote/sale/saleTotalColl/func_findSaleBatchById";
        } else {
          url = "/be/market/quote/sale/saleTotalColl/func_findSaleTotalCollAddData";
        }
        post({ id: batchId, busiType: busiType }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(async () => {
                this.formItem.brchType = await this.getBranchType(res.data.retData.saleBrchCode);
              });
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.turnForm(this.formItem, obj);
                this.formItem.busiType = busiType;
                if (this.formItem.firstSettleDt) {
                  this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                } else {
                  this.formItem.firstSettleDt = this.$moment(obj.workDate, "YYYYMMDD").format("YYYY-MM-DD");
                }
                if (this.formItem.dueSettleDt) {
                  this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                this.billFormItem.batchId = obj.id;
                // if(this.billFormItem.batchId){
                this.$refs.billDatagrid.dataChange(1);
                this.quoteBillSelectList = [];
                // }
                if (optType) {
                  if ("pickBill" == optType) {
                    this.pickBillCallback();
                  } else if ("importPickBill" == optType) {
                    this.importPickBillCallback();
                  } else if ("pickPackBill" == optType) {
                    this.pickPackBillCall();
                  } else if ("calcInterest" == optType) {
                    this.calcInterestCallback();
                  } else if ("apply" == optType) {
                    this.applyCallback();
                  }
                }
                // this.formItem = Object.assign({},this.formItem,obj);
                if (this.curBatchId) {
                  if (null !== obj.sumInterestMargin) {
                    this.formItem.sumInterestMargin = obj.sumInterestMargin;
                  } else {
                    this.formItem.sumInterestMargin = 0.00;
                  }
                } else {
                  this.formItem.sumInterestMargin = null;
                }
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      getBranchType(saleBrchCode){
        if (saleBrchCode != null && saleBrchCode.trim().length == 9) {
          return post({brchCode:saleBrchCode}, "/cpes/branch/queryBranchList").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (res.data.retData.list.length > 0) {
                  return res.data.retData.list[0].brchType;
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        } else {
          return "";
        }
      },
      applyClose() {
        this.applyWin = false;
        this.applyTitle = "";
      },
      applyCommit() {
        this.editApply("apply");
        this.applyWin = false;
        this.applyTitle = "";
      }
    },
    created() {
      this.getButtonAuth();
    }

  };
</script>

