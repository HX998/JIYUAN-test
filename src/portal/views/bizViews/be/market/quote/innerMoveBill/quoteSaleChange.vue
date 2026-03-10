<template>
  <div>
    <h-msg-box v-model="tempQuoteChangeWin" :mask-closable="false" @on-close="handleClose" :maximize="true" width="1000" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div>
        <h-form :model="formItem" :label-width="100" ref="formItem" cols="3" class="h-form-search" onlyBlurRequire>
          <quote-input :busiType="bt" :isChange="isChange" :formItem="formItem" :dictMap="dictMap" :licenseFlag="this.licenseFlag" :isInnerBuyBrch="this.isInnerBuyBrch" :isInnerBuyTrader="this.isInnerBuyTrader" :quoteChangeWin="tempQuoteChangeWin" :childrenBtnAuth="childrenBtnAuth">
            <div slot="save">
              <h-form-item label="" prop="prodName"  class="h-form-three">
                <h-button type="primary" @click="saveBatch()">{{$t('m.i.common.save')}}</h-button>
              </h-form-item>
            </div>
          </quote-input>
        </h-form>
      </div>
      <!-- 数据展示表格 -->
      <h-row>
        <h-col span="24">
          <h-datagrid :columns="columns"
                      url="/be/market/quote/innerMoveBill/saleQuoteApply/queryIMBBillList"
                      :bindForm="billFormItem"
                      :hasSelect="hasSelect"
                      :page-size="pageSizeParamValue"
                      rowSelect
                      :auto-load="false"
                      ref="billDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pickBill()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.common.pickBill')}}</h-button>
              <h-button type="primary" @click="importPickBill()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.common.exportPickBill')}}</h-button>
              <h-button type="primary" @click="pickPackBill()" v-if="'BT02'==bt" :disabled="this.formItem.selectType !== 'CSM02'">{{$t('m.i.be.pickPacketBill')}}</h-button>
              <h-button type="primary" @click="calcInterest()" >{{$t('m.i.be.calcInterest')}}</h-button>
              <h-button type="primary" @click="apply()" >{{$t('m.i.be.applyBatch')}}</h-button>
              <h-button type="primary" @click="clearPack()" v-if="'BT02'==bt" :disabled="this.formItem.selectType !== 'CSM02'">{{$t('m.i.be.clearPacket')}}</h-button>
              <h-button type="primary" @click="deleteBill()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.be.deleteBill')}}</h-button>
              <h-button type="primary" @click="downMoudle()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.common.templateDownload')}}</h-button>
              <h-button type="primary" @click="preDelBill()" v-if="formItem.quoteNo">{{$t('m.i.be.preDelBill')}}</h-button>
              <h-button type="primary" @click="replyDel()" v-if="formItem.quoteNo">{{$t('m.i.be.replyDel')}}</h-button>
              <h-button type="primary" @click="resetSaleQuote()" v-if="formItem.quoteNo">{{$t('m.i.be.resetQuote')}}</h-button>
              <h-button type="primary" @click="exportBill()"  :disabled="exportBillCommit" >{{$t('m.i.common.exportExcel')}}</h-button>
              <h-button type="primary" @click="deletePreAudit()" v-if="formItem.isPreAudit==='1'">{{$t('m.i.be.deletePreAudit')}}</h-button>
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
    </h-msg-box>

    <!-- 批量导入-->
    <upload
      :uploadUrl="uploadUrl"
      :batchId="curBatchId"
      :isLock="isLock"
      @uploadWinClose="uploadWinClose"
      :uploadWin="uploadWin"
      :importSelect="importSelect"
      :isTemStorage="isTemStorage"
      :selectDataFirst="selectDataFirst">
    </upload>
    <pickBill
      :pickBillUrl="pickBillUrl"
      :batchId="curBatchId"
      :billType="billType"
      :isLock="isLock"
      :billClass="billClass"
      :busiType="busiType"
      :dueSettleDt="dueSettleDt"
      :isTemStorage="isTemStorage"
      :dictMap="dictMap"
      :custBrchCode="this.formItem.innerBuyBrchCode"
      :childrenBtnAuth="this.childrenBtnAuth"
      @pickBillWinClose="pickBillWinClose"
      :pickBillWin="pickBillWin">
    </pickBill>
    <pickPackBill
      :pickPackBillUrl="pickPackBillUrl"
      :batchId="curBatchId"
      :billType="billType"
      :billClass="billClass"
      :firstSettleDt="formItem.innerFirstSettleDt"
      :dueSettleDt="formItem.dueSettleDt"
      :isTemStorage="isTemStorage"
      :dictMap="dictMap"
      @pickPackBillWinClose="pickPackBillWinClose"
      :pickPackBillWin="pickPackBillWin">
    </pickPackBill>
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
            <button type="button"  @click="applyClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span></button>
            <button type="button"  @click="applyCommit()" class="h-btn h-btn-primary h-btn-large"><span>确定</span></button>
          </div>
        </div>
      </div>
    </h-msg-box>
    <sale-detail-print :batchId="curBatchId" :dictMap="dictMap.dictListMap" :busiType="bt" :saleDetailPrintWin="showSaleDetilPrint" @closeMsgBox="closeDetilPrint()"></sale-detail-print>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>
<script >
  import { post, on, off,formatNumber,accMul,getDictValueFromMap,getUploadImgType,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteSaleChange",
    data(){

      return {
        formItem:{
          id:'',
          busiType:'',
          innerBusiType:'',
          quoteNo:'',
          saleBrchCode:'',
          saleBrchName:'',
          saleTraderNo:'',
          saleTraderName:'',
          saleProductNo:'',
          saleProductName:'',
          innerBuyBrchCode:'',
          innerBuyBrchName:'',
          innerBuyTraderNo:'',
          innerBuyTraderName:'',
          outBuyBrchCode:'',
          outBuyBrchName:'',
          outBuyTraderNo:'',
          outBuyTraderName:'',
          buyProductNo:'',
          buyProductName:'',
          subDeal:'',
          billClass:'',
          billType:'',
          innerClearSpeed:'',
          outClearSpeed:'',
          innerClearType:'',
          outClearType:'',
          innerSettleMode:'',
          outSettleMode:'',
          selectType:'',
          packetSeq:'',
          innerQuoteTm:'',
          outQuoteTm:'',
          setTm:'',
          inneretTm:'',
          outSetTm:'',
          innerFirstSettleDt:'',
          outFirstSettleDt:'',
          prodNo:'',
          isInner:'',
          ratePct:'',
          dueRatePct:'',
          totalNum:'',
          totalAmt:'',
          buyBackTotalAmt:'',
          yieldRatePct:'',
          innerFirstSettleAmt:'',
          outFirstSettleAmt:'',
          innerFirstInterest:'',
          outFirstInterest:'',
          dueInterest:'',
          productMapDict:'',
          workDate:'',
          maxTenorDays:'',
          minRate:'',
          maxRate:'',
          brchType:'',
          isPreAudit:'',
          auditNo:'',
          creditMainBrchCode:'',
          creditMainBankName:'',
          creditMainBankType:'',
          ownedBrchNo:'',
          liFlag:false,
          memberId:'',
          isTemStorage:"",
          buttonName:"",
          isNoticeFirstAudit:"",
          showNoticeFirstStationItem:false,
          sumInterestMargin:"",
          innerRatePct:'',
          outRatePct:'',
          isInnerBuyBrch:false,
          isInnerBuyTrader:false,
          innerTenorDays:'',
          outTenorDays:'',
          innerYieldRate:'',
          outYieldRate:'',
          innerYieldRatePct:"",
          outYieldRatePct:"",
        },
        showFlag:"",
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
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap.dictListMap, 'BillOrigin', params.row.billOrigin);
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
              return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },

          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.remitDt?this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt?this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: 'dueMatDt',
            hiddenCol: false,
            sortable: true,
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
            sortable: true,

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
            sortable: true,

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
            sortable: true,

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
            sortable: true,

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
            sortable: true,

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
            sortable: true,

          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            hiddenCol: false,
            sortable: true,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,
            sortable: true,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditMainBankType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap.dictListMap, 'CreditMajor', params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap.dictListMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.innerTenorDays'),
            key: "innerRemainDays",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.outTenorDays'),
            key: "outRemainDays",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.innerFirstInterest'),
            key: "innerFirstPayInterest",
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.innerFirstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.innerFirstSettleAmt'),
            key: "innerFirstSettleAmtv",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.innerFirstSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.outFirstInterest'),
            key: "outFirstInterest",
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.outFirstInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.outFirstSettleAmt'),
            key: "outFirstSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.outFirstSettleAmt, 2, ','))
            }
          },
        ],
        pageSizeParamValue : "",
        // 分页切换配置
        pageSizeOpts : [10, 20, 50, 200],
        riskFlag : "0",
        preFlag : "0",
        curBatchId:this.batchId,
        isChange:false,
        billFormItem:{batchId:this.batchId},
        uploadUrl:'',
        uploadWin:false,
        importSelect:false,
        selectDataFirst:false,
        quoteBillSelectList:[],
        quoteBillSelectRowInx:[],
        pickPackBillWin:false,
        pickPackBillUrl:'',
        pickBillUrl:'',
        pickBillWin:false,
        billType:"",
        billClass:"",
        dueSettleDt:"",
        busiType:"",
        isLock:'0',//卖出挑票 islock='0'
        exportBillCommit:false,
        applyWin:false,
        applyTitle:"",
        showSaleDetilPrint: false,
        hasSelect:false,
        showBillInfoWin:false,
        billId:"",
        billNo:"",
        billRangeStart:'',
        billRangeEnd:'',
        liFlag:false,
        preDict:this.dictMap,
        isTemStorage:"",
        title:"",
      };
    },
    components:{
      Upload:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/upload" */`@/views/bizViews/be/market/quote/innerMoveBill/upload`),
      PickBill:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/pickBill" */`@/views/bizViews/be/market/quote/innerMoveBill/pickBill`),
      QuoteInput:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/quoteSaleInput" */`@/views/bizViews/be/market/quote/innerMoveBill/quoteSaleInput`),
      PickPackBill:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/pickPackBill" */`@/views/bizViews/be/market/quote/innerMoveBill/pickPackBill`),
      SaleDetailPrint:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/saleDetailPrint" */`@/views/bizViews/be/market/quote/innerMoveBill/saleDetailPrint`)
    },
    props:{
      title:String,
      trDir:String,//交易方向：买入、卖出、正回购、逆回购
      bt:String, //交易类型：转贴现，质押式回购，买断式回购
      batchId:Number,
      licenseFlag: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isInnerBuyBrch: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isInnerBuyTrader: {
        type: Boolean,
        default() {
          return false;
        }
      },
      dictMap:{
        type:Object
      },
      quoteSaleChangeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      childrenBtnAuth: {
        type: Object,
        default(){
          return {
            quoteSaleChangePrintBill:{
              isShow:true
            }
          }
        }
      },
      isNoticeFirstAudit:{
        type:String,
        default(){
          return "0"
        }
      },
      showNoticeFirstStationItem: {
        type:Boolean,
        default(){
          return false
        }
      }
    },
    computed: {
      tempQuoteChangeWin: {
        get() {
          return this.quoteSaleChangeWin;
        },
        set(){

        }
      },
    },
    watch:{
      quoteSaleChangeWin(val){
        if(val){
          this.curBatchId=this.batchId;
          if(this.batchId){
            this.isChange=false;
          }else{
            this.isChange=true;
          }
          this.hasSelect=false;
          this.formItem.showNoticeFirstStationItem=this.showNoticeFirstStationItem;
          this.formItem.isNoticeFirstAudit=this.isNoticeFirstAudit;
          this.init();
        }
      },
    },
    methods:{
      turnForm(formItem,obj){
        formItem.id=obj.id;
        formItem.busiType=obj.busiType;
        formItem.quoteNo=obj.quoteNo;
        formItem.saleBrchCode=obj.saleBrchCode;
        formItem.saleBrchName=obj.saleBrchName;
        formItem.saleTraderNo=obj.saleTraderNo;
        formItem.saleTraderName=obj.saleTraderName;
        formItem.saleProductNo=obj.saleProductNo;
        formItem.saleProductName=obj.saleProductName;
        formItem.buyProductNo=obj.buyProductNo;
        formItem.buyProductName=obj.buyProductName;
        formItem.subDeal=obj.subDeal;
        formItem.billClass=obj.billClass;
        formItem.billType=obj.billType;
        formItem.selectType=obj.selectType;
        formItem.packetSeq=obj.packetSeq;
        formItem.innerSetTm=obj.innerSetTm.slice(0,8);
        formItem.outSetTm=obj.outSetTm.slice(0,8);
        formItem.prodNo=obj.prodNo;
        formItem.productMapDict=obj.productMap;
        formItem.isInner=obj.isInner;
        formItem.ratePct=obj.ratePct;
        formItem.dueRatePct=obj.dueRatePct;
        formItem.totalNum=obj.totalNum;
        formItem.totalAmt=obj.totalAmt;
        formItem.buyBackTotalAmt=(obj.buyBackTotalAmtStr?obj.buyBackTotalAmtStr:'0')+"";
        formItem.yieldRatePct=obj.yieldRatePct;
        formItem.dueInterest=obj.dueInterestStr;
        formItem.preChangeInfo=obj.preChangeInfo;
        formItem.productMapDict=obj.productMap;
        formItem.workDate=obj.workDate;
        formItem.maxTenorDays=obj.maxTenorDays;
        formItem.minRate=obj.minRate;
        formItem.maxRate=obj.maxRate;
        formItem.brchType=obj.brchType;
        formItem.isPreAudit=obj.isPreAudit;
        formItem.auditNo=obj.auditNo;
        formItem.ownedBrchNo=obj.ownedBrchNo;
        formItem.ownedBrchName=obj.ownedBrchName;
        formItem.isTemStorage=obj.isTemStorage;
        if (!!obj.isNoticeFirstAudit) {
          formItem.isNoticeFirstAudit=obj.isNoticeFirstAudit
        }else {
          formItem.isNoticeFirstAudit=this.isNoticeFirstAudit; //老数据，放默认值
        }
        formItem.innerBuyBrchCode=obj.innerBuyBrchCode;
        formItem.innerBuyBrchName=obj.innerBuyBrchName;
        formItem.innerBuyTraderNo=obj.innerBuyTraderNo;
        formItem.innerBuyTraderName=obj.innerBuyTraderName;
        formItem.innerSettleMode=obj.innerSettleMode;
        formItem.innerClearSpeed=obj.innerClearSpeed;
        formItem.innerFirstSettleDt=obj.innerFirstSettleDt;
        formItem.innerQuoteTm=obj.innerQuoteTm;
        formItem.innerFirstSettleAmt=obj.innerFirstSettleAmt;
        formItem.innerFirstInterest=obj.innerFirstInterest;
        formItem.innerClearType=obj.innerClearType;
        formItem.innerRatePct=obj.innerRatePct;


        formItem.outBuyBrchCode=obj.outBuyBrchCode;
        formItem.outBuyBrchName=obj.outBuyBrchName;
        formItem.outBuyTraderNo=obj.outBuyTraderNo;
        formItem.outBuyTraderName=obj.outBuyTraderName;
        formItem.outSettleMode=obj.outSettleMode;
        formItem.outClearSpeed=obj.outClearSpeed;
        formItem.outFirstSettleDt=obj.outFirstSettleDt;
        formItem.outQuoteTm=obj.outQuoteTm;
        formItem.outFirstSettleAmt=obj.outFirstSettleAmt;
        formItem.outFirstInterest=obj.outFirstInterest;
        if(obj.innerTenorDays&&obj.innerTenorDays>0){
          formItem.innerTenorDays=obj.innerTenorDays;
        }else{
          formItem.innerTenorDays="";
        }
        if(obj.outTenorDays&&obj.outTenorDays>0){
          formItem.outTenorDays=obj.outTenorDays;
        }else{
          formItem.outTenorDays="";
        }
        formItem.innerYieldRate=obj.innerYieldRate;
        formItem.outYieldRate=obj.outYieldRate;
        formItem.innerYieldRatePct=obj.innerYieldRatePct;
        formItem.outYieldRatePct=obj.outYieldRatePct;
        formItem.outClearType=obj.outClearType;
        formItem.outRatePct=obj.outRatePct;
        //formItem.isInnerBuyBrch=obj.innerBuyBrch;
        //formItem.isInnerBuyTrader=obj.innerBuyTrader;
        if(obj.innerBuyBrch){
          this.isInnerBuyBrch = true;
        }else{
          this.isInnerBuyBrch = false;
        }
        if(obj.innerBuyTrader){
          this.isInnerBuyTrader = true;
        }else{
          obj.innerBuyTrade = false;
        }
      },
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,billRangeStart,billRangeEnd){
        this.billId=billId;
        this.billNo=billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin=true;
      },
      handleClose() {
        this.initFlag();
        this.formItem.innerClearSpeed='';
        this.formItem.outClearSpeed='';
        this.curBatchId=null;
        this.billFormItem.batchId=null;
        this.hasSelect=true;
        this.$refs.formItem.resetFields();
        /**清除多页选择的数据*/
        this.$refs.billDatagrid.selectIds=[];
        this.$refs.billDatagrid.selects=[];
        this.$emit("quoteSaleChangeWinClose", "");
      },
      //选择记录
      quoteBillSelectClick(arr, selectInx){
        this.quoteBillSelectList = arr;
        this.quoteBillSelectRowInx = selectInx;
      },
      // 关闭上传
      uploadWinClose() {
        this.uploadWin = false;
        this.uploadUrl = '';
        this.importSelect = false;
        this.isTemStorage="";
        this.selectDataFirst = false;
        this.init();
      },
      //关闭挑票页面
      pickBillWinClose(){
        this.pickBillWin=false;
        this.isTemStorage="";
        this.init();
      },
      //关闭票据包挑票页面
      pickPackBillWinClose(){
        this.pickPackBillWin=false;
        this.isTemStorage="";
        this.init();
      },
      //保存批次
      saveBatch(){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要保存批次吗") + "?",
          onOk: () => {
            this.editApply();
          }
        });
      },
      //保存
      editApply(optType){
        if(this.formItem.innerFirstSettleDt){
          this.formItem.innerFirstSettleDt = this.$moment(this.formItem.innerFirstSettleDt,'YYYY-MM-DD').format('YYYYMMDD');
        }
        if(this.formItem.outFirstSettleDt){
          this.formItem.outFirstSettleDt = this.$moment(this.formItem.outFirstSettleDt,'YYYY-MM-DD').format('YYYYMMDD');
        }
        if(optType){
          this.formItem.buttonName=optType;
        }else{
          this.formItem.buttonName="";
        }
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            let minRate=this.formItem.minRate?this.formItem.minRate:0;
            let maxRate=this.formItem.maxRate?this.formItem.maxRate:100;
            let minInnerRateBoolean=this.formItem.innerRatePct?this.formItem.innerRatePct-minRate<0:false;
            let maxInnerRateBoolean=this.formItem.innerRatePct?this.formItem.innerRatePct-maxRate>0:false;
            let innerBusiType=this.formItem.innerBusiType;
            if(minInnerRateBoolean){
              if('BT01'==innerBusiType){
                this.$msgTip.error(this, { info: "内转交易利率必须大于等于票交所最小利率参数:"+minRate });
                return;
              }
            }
            if(maxInnerRateBoolean){
              if('BT01'==innerBusiType){
                this.$msgTip.error(this, { info: "内转交易利率必须小于等于票交所最大利率参数:"+maxRate });
                return;
              }
            }
            let minOutRateBoolean=this.formItem.outRatePct?this.formItem.outRatePct-minRate<0:false;
            let maxOutRateBoolean=this.formItem.outRatePct?this.formItem.outRatePct-maxRate>0:false;
            let outBusiType=this.formItem.outBusiType;
            if(minOutRateBoolean){
              if('BT01'==outBusiType){
                this.$msgTip.error(this, { info: "外转交易利率必须大于等于票交所最小利率参数:"+minRate });
                return;
              }
            }
            if(maxOutRateBoolean){
              if('BT01'==outBusiType){
                this.$msgTip.error(this, { info: "外转交易利率必须小于等于票交所最大利率参数:"+maxRate });
                return;
              }
            }

            let url = '/be/market/quote/innerMoveBill/saleQuoteApply/func_editInnerMoveBillBatch';
            this.formItem.liFlag = this.licenseFlag;
            this.formItem.isInnerBuyBrch = this.licenseFlag;
            this.formItem.isInnerBuyTrader = this.licenseFlag;
            //解决原本发送的时间数据为xx:xx:xx.xxx格式的问题
            this.formItem.innerSetTm=this.formItem.innerSetTm.slice(0,8);
            this.formItem.outSetTm=this.formItem.outSetTm.slice(0,8);
            post(this.formItem,url).then(res => {
              if(res){
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let obj=res.data.retData;
                if(retCode=="000000") {
                  if (obj.id) {
                    this.curBatchId = obj.id;
                    this.billFormItem.batchId = obj.id;
                  }
                  if(optType){
                    this.init(optType);
                  }else{
                    this.init();
                    this.$msgTip.success(this);
                  }
                }else{
                  if(this.formItem.innerFirstSettleDt){
                    this.formItem.innerFirstSettleDt = this.$moment(this.formItem.innerFirstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                  }
                  if(this.formItem.outFirstSettleDt){
                    this.formItem.outFirstSettleDt = this.$moment(this.formItem.outFirstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                  }
                  this.$msgTip.error(this, { info: msg });
                }
              }else{
                if(this.formItem.innerFirstSettleDt){
                  this.formItem.innerFirstSettleDt = this.$moment(this.formItem.innerFirstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }
                if(this.formItem.outFirstSettleDt){
                  this.formItem.outFirstSettleDt = this.$moment(this.formItem.outFirstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      // 挑票
      pickBill(){
        setTimeout(() => {
          this.editApply("pickBill");
        },600);
      },
      pickBillCallback(){
        if(this.formItem.id) {
          if(this.formItem.selectType&&this.formItem.selectType=='CSM02'){
            this.$msgTip.info(this, { info: this.$t("挑票类型为票据包时，不能进行挑票操作，请选择票据包挑票操作！") });
            return;
          }
          this.billType=this.formItem.billType,
          this.billClass=this.formItem.billClass,
          this.busiType=this.formItem.innerBusiType,
          this.curBatchId = this.formItem.id;
          this.isTemStorage=this.formItem.isTemStorage;
          this.pickBillWin = true;
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 导入挑票
      importPickBill(){
        setTimeout(() => {
          this.editApply("importPickBill");
        },600);
      },
      importPickBillCallback(){
        if(this.formItem.id) {
          if(this.formItem.selectType&&this.formItem.selectType=='CSM02'){
            this.$msgTip.info(this, { info: this.$t("挑票类型为票据包时，不能进行导入挑票操作！") });
            return;
          }
          this.uploadWin = true;
          this.uploadUrl = window.LOCAL_CONFIG.API_HOME+'/be/market/quote/innerMoveBill/saleQuoteApply/func_batchSaleBill';
          this.curBatchId = this.formItem.id;
          this.isTemStorage=this.formItem.isTemStorage;
          this.importSelect = true;
          this.selectDataFirst = false;
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 票据包挑票
      pickPackBill(){
        setTimeout(() => {
          this.editApply("pickPackBill");
        },600);
      },
      pickPackBillCall(){
        if(this.formItem.id) {
          if(this.formItem.selectType&&this.formItem.selectType!='CSM02'){
            this.$msgTip.info(this, { info: this.$t("挑票类型不是票据包时，不能进行票据包挑票操作！") });
            return;
          }

          this.curBatchId = this.formItem.id;
          this.billType=this.formItem.billType;
          this.billClass=this.formItem.billClass;
          this.isTemStorage=this.formItem.isTemStorage;
          this.pickPackBillWin = true;
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 利息计算
      calcInterest(){
        this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要计算利息吗") + "?",
            onOk: () => {
              this.editApply("calcInterest");
            }
        });
      },
      calcInterestCallback(){
        if(this.formItem.id){
          let id = this.formItem.id;
          let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_calcSaleInterest";
          post({ id: id ,isTemStorage:this.formItem.isTemStorage}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.curBatchId =this.formItem.id;
                this.init();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
            }
          });
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      getBillNoAndCdRange(billNo, billRangeStart, billRangeEnd) {
        if (billNo && billNo.length === 30) {
          let mark = billNo.charAt(0);
          if (mark === '5' || mark === '6' || mark === '7' || mark === '8') {
            if (billRangeStart === 0) {
              return billNo+"，子票区间[0]";
            }
            if(billRangeStart){
              if (billRangeEnd) {
                return billNo+"，子票区间["+( "0000000000000000" + billRangeStart ).substr( -12 )
                  +( "0000000000000000" + billRangeEnd ).substr( -12 )+"]";
              } else {
                return billNo+"，子票区间["+( "0000000000000000" + billRangeStart ).substr( -12 )+"]";
              }
            }
          }
        }
        return billNo;
      },
      setInfo(){
        if(window.sessionStorage.getItem("isOpenI9")=="1"){
          let list=this.$refs.billDatagrid.tData;
          let flag=1;
          let billList='';
          console.log(list)
          for(let i=0;i<list.length;i++){
            if (list[i].assetIndustry == "1") {
              if(billList){
                billList+="、";
              }
              billList+=('票据(包)号码'+this.getBillNoAndCdRange(list[i].billNo,list[i].billRangeStart,list[i].billRangeEnd));
              flag=0;
            }
          }
          if(flag==0 && this.showFlag!=1){
            this.$hMsgBox.confirm({
              title: "确认",
              content: "选中" + billList + "资产类型为持有-按摊余成本计量，请确定是否提交？",
              onOk: () => {
                this.applyWin = true;
                this.applyTitle = "确认要提交申请吗?";
              },
              onCancel: () =>{
                return;
              }
            });
          }else if(flag==0 && this.showFlag==1){
            let info="选中" + billList + "资产类型为持有-按摊余成本计量，不允许提交";
            this.$msgTip.error(this, { info: info});
          }
          else{
            this.applyWin = true;
            this.applyTitle = "确认要提交申请吗?";
          }
        }else{
          this.applyWin = true;
          this.applyTitle = "确认要提交申请吗?";
        }

      },


      // 提交申请
      apply(){
        let flag="";
        getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
          let value = res.value
          if(value=='0'){//否
            flag="0";
          }else if(value=="1"){//是
            flag="1";
          }
          if(this.formItem.innerBusiType=="BT01" && flag=="0"){
            this.showFlag=1;
            this.setInfo();
          }else {
            this.showFlag=0
            this.setInfo();
          }
        })
      },
      applyClose(){
        this.applyWin=false;
        this.applyTitle="";
      },
      applyCommit(){
        this.editApply("commitApply");
        this.applyWin=false;
        this.applyTitle="";
      },
      applyCallback(){
        this.initFlag();
        if(this.formItem.id){
              let id = this.formItem.id;
              let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_commitInnerMoveApply";
              post({ id: id ,riskFlag:this.riskFlag, preFlag:this.preFlag}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    let obj = res.data.retData;
                    let riskInfo=obj.riskInfo;
                    let preAuditInfo = obj.preAuditInfo;
                    if (riskInfo) {
                      this.riskFlag = "1";
                      this.continueApply(riskInfo, id);
                    }else if(preAuditInfo){
                      this.preFlag = "1";
                      this.continueApply(preAuditInfo, id);
                    } else {
                      this.$msgTip.success(this);
                      /**清除多页选择的数据*/
                      this.$refs.billDatagrid.selectIds=[];
                      this.$refs.billDatagrid.selects=[];
                      this.handleClose();
                    }
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                }
              });
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      continueApply(content, id){
        let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_commitInnerMoveApply";
        this.$hMsgBox.confirm({
          title:"确认要继续提交申请吗?",
          content:content,
          onOk: () => {
            post({ id: id, riskFlag:this.riskFlag, preFlag:this.preFlag }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let obj = res.data.retData;
                  let riskInfo=obj.riskInfo;
                  let preAuditInfo = obj.preAuditInfo;
                  if (riskInfo) {
                    this.riskFlag = "1";
                    this.continueApply(riskInfo, id);
                  }else if(preAuditInfo){
                    this.preFlag = "1";
                    this.continueApply(preAuditInfo, id);
                  } else {
                    this.$msgTip.success(this);
                    /**清除多页选择的数据*/
                    this.$refs.billDatagrid.selectIds=[];
                    this.$refs.billDatagrid.selects=[];
                    this.handleClose();
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              }else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },
      initFlag(){
        this.riskFlag = "0";
        this.preFlag = "0";
      },
      // 清除票据包
      clearPack(){
        if(this.formItem.id){
          if(this.formItem.selectType&&this.formItem.selectType!='CSM02'){
            this.$msgTip.info(this, { info: this.$t("挑票类型不是票据包时，不能进行票据包清除操作！") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要清除票据包吗") + "?",
            onOk: () => {
              let id = this.formItem.id;
              let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_deleteSalePacketBill";
              post({ id: id,isTemStorage:this.formItem.isTemStorage }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId =this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                }
              });
            }
          });
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 删除票据
      deleteBill(){
        if(this.formItem.id){
          if(this.formItem.selectType&&this.formItem.selectType=='CSM02'){
            this.$msgTip.info(this, { info: this.$t("挑票类型为票据包时，不能删除票据进行操作！") });
            return;
          }
          let list = this.$refs.billDatagrid.selects;
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
              let url = "/be/market/quote/innerMoveBill/saleQuoteApply/func_deleteInnerMoveBill";
              let batchId = this.formItem.id
              post({ batchId: batchId, ids: ids,isTemStorage:this.formItem.isTemStorage }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
              })
            }
          });
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 模板下载
      downMoudle(){
        if(this.formItem.id){
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/innerMoveBill/saleQuoteApply/func_downloadSaleBill";
          let form = document.createElement('form');
          form.setAttribute("id","formId");
          form.setAttribute('action',url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 预删除票据
      preDelBill(){
        if(this.formItem.id){
          let list = this.$refs.billDatagrid.selects;
          if (list.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要预删除票据吗") + "?",
            onOk: () => {
              let ids = "";
              for (let i = 0; i < list.length; i++){
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_removeSaleBill";
              let batchId=this.formItem.id
              post({batchId:batchId,ids:ids},url).then(res => {
                if (res) {
                  let retCode = res.data.retCode
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId =this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
              })
            }
          });
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 恢复预删除
      replyDel(){
        if(this.formItem.id){
          let list = this.$refs.billDatagrid.selects;
          if (list.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要恢复预删除票据吗") + "?",
            onOk: () => {
              let ids = "";
              for (let i = 0; i < list.length; i++){
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_restoreSaleBill";
              let batchId=this.formItem.id
              post({batchId:batchId,ids:ids},url).then(res => {
                if (res) {
                  let retCode = res.data.retCode
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId =this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
              })
            }
          });
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      resetSaleQuote(){
        if(this.formItem.id){
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要报价重置吗") + "?",
            onOk: () => {
              let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_resetLastSaleQuote";
              let batchId=this.formItem.id
              post({id:batchId},url).then(res => {
                if (res) {
                  let retCode = res.data.retCode
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId =this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
              })
            }
          });
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 导出清单
      exportBill(){
        if(this.formItem.id){
          this.exportBillCommit=true;
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/innerMoveBill/saleQuoteApply/downloadSaleInfo";
          let form = document.createElement('form');
          form.setAttribute("id","formId");
          form.setAttribute('action',url);
          form.setAttribute("method", "post");
          form.setAttribute("target","downLoadFrame");
          let input=document.createElement('input');
          input.setAttribute("name", "batchId");
          input.setAttribute("value",this.formItem.id);
          form.appendChild(input);
          let list = this.$refs.billDatagrid.selects;
          if(list.length>0){
            let ids = "";
            for (let i = 0; i < list.length; i++){
              ids += list[i].id;
              if (i < list.length - 1) {
                ids += ",";
              }
            }
            let input2=document.createElement('input');
            input2.setAttribute("name", "ids");
            input2.setAttribute("value",ids);
            form.appendChild(input2);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
          this.exportBillCommit=false;
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },

      // 打印清单
      printBill(){
        if(this.curBatchId){
          this.showSaleDetilPrint = true;
        }else{
          this.$msgTip.error(this, { info: "该批次号为空" });
        }
      },
      //关闭打印窗口
      closeDetilPrint(i) {
        this.showSaleDetilPrint = false;
      },
      deletePreAudit(){
        if(this.formItem.id){
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要清除预审批单吗") + "?",
            onOk: () => {
              let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_deleteSalePreAudit";
              let batchId=this.formItem.id;
              post({id:batchId},url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId =this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
              })
            }
          });
        }else{
          this.formItem.auditNo = "";
        }
      },

      //  初始化页面
      init(optType){
        //this.formItem.innerBusiType = this.bt;
        let batchId= this.curBatchId;
        let busiType=this.bt;
        let url ='';
        if(batchId){
          url='/be/market/quote/innerMoveBill/saleQuoteApply/findIMBBatchById';
        }else{
          url='/be/market/quote/innerMoveBill/saleQuoteApply/func_findIMBAddData';
        }
        post({id:batchId,busiType:busiType},url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.turnForm(this.formItem, obj);
                this.formItem.innerBusiType = busiType;
                this.formItem.outBusiType = busiType;
                if(this.formItem.innerFirstSettleDt){
                  this.formItem.innerFirstSettleDt= this.$moment(this.formItem.innerFirstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }else {
                  this.formItem.innerFirstSettleDt= this.$moment(obj.workDate,'YYYYMMDD').format('YYYY-MM-DD');
                }
                if(this.formItem.outFirstSettleDt){
                  this.formItem.outFirstSettleDt= this.$moment(this.formItem.outFirstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }else {
                  this.formItem.outFirstSettleDt= this.$moment(obj.workDate,'YYYYMMDD').format('YYYY-MM-DD');
                }
                this.billFormItem.batchId = obj.id;
                // if(this.billFormItem.batchId){
                this.$refs.billDatagrid.dataChange(1);
                /**清除多页选择的数据*/
                this.$refs.billDatagrid.selectIds=[];
                this.$refs.billDatagrid.selects=[];
                // }
                if (optType){
                  if("pickBill"==optType){
                    this.pickBillCallback();
                  }else if("importPickBill"==optType){
                    this.importPickBillCallback();
                  }else if("pickPackBill"==optType){
                    this.pickPackBillCall();
                  }else if("calcInterest"==optType){
                    this.calcInterestCallback();
                  }else if("commitApply"==optType){
                    this.applyCallback();
                  }
                }
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
            }else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
        })
      }
    },
    created(){
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));

    },
    mounted() {
      this.innerClearSpeed = "CS00";
      this.outClearSpeed = "CS00";


    }

  }
</script>

