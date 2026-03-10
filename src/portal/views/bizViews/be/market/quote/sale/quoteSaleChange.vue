<template>
  <div>
    <h-msg-box v-model="tempQuoteChangeWin" :mask-closable="false" @on-close="handleClose" :maximize="true" width="1000" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div>
        <h-form :model="formItem" :label-width="100" ref="formItem" cols="3" class="h-form-search" onlyBlurRequire>
          <quote-input :busiType="bt" :isChange="isChange" :formItem="formItem" :dictMap="dictMap" :licenseFlag="this.licenseFlag" :quoteChangeWin="tempQuoteChangeWin" :childrenBtnAuth="childrenBtnAuth">
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
                      url="/be/market/quote/quoteManager/func_querySaleBillList"
                      :bindForm="billFormItem"
                      :hasSelect="hasSelect"
                      :page-size="pageSizeParamValue"
                      rowSelect
                      :auto-load="false"
                      :hasAdvanced="true"
                      :advancedParams="advancedParams"
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
              <h-button type="primary" @click="printBill()" v-if="this.childrenBtnAuth.quoteSaleChangePrintBill === undefined ? true : this.childrenBtnAuth.quoteSaleChangePrintBill.isShow">{{$t('m.i.be.printBill')}}</h-button>
              <h-button type="primary" @click="deletePreAudit()" v-if="formItem.isPreAudit==='1' && (this.childrenBtnAuth.quoteSaleChangeDeletePreAudit === undefined ? true : this.childrenBtnAuth.quoteSaleChangeDeletePreAudit.isShow)">{{$t('m.i.be.deletePreAudit')}}</h-button>
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
      :custBrchCode="this.formItem.buyBrchCode"
      :childrenBtnAuth="this.childrenBtnAuth"
      @pickBillWinClose="pickBillWinClose"
      :rootUrl="rootUrl"
      :pickBillWin="pickBillWin">
    </pickBill>
    <pickPackBill
      :pickPackBillUrl="pickPackBillUrl"
      :batchId="curBatchId"
      :billType="billType"
      :billClass="billClass"
      :firstSettleDt="formItem.firstSettleDt"
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
    <h-msg-box v-model="auditWin" width="800" class="h-approve-layer" :maximize="true"
               :mask-closable="false" @on-close="auditClose">
      <p slot="header">
        <span>选择审批岗</span>
      </p>
      <div>
        <h-row>
          <h-col span="12" class="pt-15">
            <h-form :model="auditFormItem" :label-width="100" ref="auditFormItem" class="h-form-search">
              <h-form-item
                :label="$t('m.i.pc.tellerNo')" prop="userName" >
                <h-input v-model="auditFormItem.userNames" :placeholder="''" readonly
                         icon="android-search" @on-click="queryAudit" clearable @on-clear="clearAudit"></h-input>
              </h-form-item>
            </h-form>
          </h-col>
        </h-row>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="auditClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="auditSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <sale-detail-print :batchId="curBatchId" :dictMap="dictMap.dictListMap" :busiType="bt" :saleDetailPrintWin="showSaleDetilPrint" @closeMsgBox="closeDetilPrint()"></sale-detail-print>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <show-first-audit-station-and-user :showFirstAuditStationAndUserWin="showFirstAuditStationAndUserWin" :title="'分配首岗审核柜员'"
                        @showFirstAuditStationAndUserWinClose="showFirstAuditStationAndUserWinClose"
                        @auditSelect="auditSelect" :prodNo="prodNo" :billType="billType" :billClass="billClass"></show-first-audit-station-and-user>
  </div>
</template>
<script >
  import { post, on, off,formatNumber,accMul,getDictValueFromMap,getUploadImgType} from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteSaleChange",
    data(){

      return {
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
          isInner:'',
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
          rateAverPct:"",
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
            title: this.$t('m.i.common.status'),
            key: 'preRelationFlag',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =getDictValueFromMap(this.dictMap.dictListMap, 'PreRelationFlag', params.row.preRelationFlag);
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
            title: this.$t('m.i.be.remainDays'),
            key: "remainDays",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.dueRemainDays'),
            key: "dueRemainDays",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.billInfo.rateMargin'),
            key: 'rateMargin',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.rateMargin != null && params.row.rateMargin !== ""){
                let rateMargin = accMul(params.row.rateMargin, 100);
                return h("span", formatNumber(rateMargin, 4, ','));
              } else {
                return h("span", "-");
              }
            }
          },
          {
            title: this.$t('m.i.be.interestMargin'),
            key: "interestMargin",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.interestMargin, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.lastOppName'),
            key: "oppName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.lastRebuyRate'),
            key: "buyRate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.buyRate != null && params.row.buyRate !== "") {
                let rate = accMul(params.row.buyRate, 100);
                rate = formatNumber(rate,4, '');
                return h("span", rate);
              }
            }
          },
        ],
        pageSizeParamValue : "",
        // 分页切换配置
        pageSizeOpts : [10, 20, 50, 200],
        riskFlag : "0",
        preFlag : "0",
        userIds:"",
        isNeedToAudit: "0",
        auditWin:false,
        auditFormItem:{
          userIds: "",
          userNames: "",
        },
        showFirstAuditStationAndUserWin: false,
        prodNo: "",
        curBatchId:this.batchId,
        isChange:false,
        billFormItem:{
          batchId: this.batchId,
          billMoneyRange : {
            minBillMoney: "",
            maxBillMoney: "",
          },
          minBillMoney: "",
          maxBillMoney: "",
          reverseBillNo: "",
          acptName: "",
          dueDtRange: [],
          minDueDt: "",
          maxDueDt: "",
        },
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
        rootUrl:"/be/market/quote/quoteManager",
        advancedParams : {}
      };
    },
    components:{
      Upload:()=>import(/* webpackChunkName: "be/market/quote/sale/upload" */`@/views/bizViews/be/market/quote/sale/upload`),
      PickBill:()=>import(/* webpackChunkName: "be/market/quote/sale/pickBill" */`@/views/bizViews/be/market/quote/sale/pickBill`),
      QuoteInput:()=>import(/* webpackChunkName: "be/market/quote/sale/quoteSaleInput" */`@/views/bizViews/be/market/quote/sale/quoteSaleInput`),
      PickPackBill:()=>import(/* webpackChunkName: "be/market/quote/sale/pickPackBill" */`@/views/bizViews/be/market/quote/sale/pickPackBill`),
      SaleDetailPrint:()=>import(/* webpackChunkName: "be/market/quote/sale/saleDetailPrint" */`@/views/bizViews/be/market/quote/sale/saleDetailPrint`),
      ShowFirstAuditStationAndUser: () => import(/* webpackChunkName: "bm/audit/showFirstAuditStationAndUser"*/"@/views/bizViews/bm/audit/showFirstAuditStationAndUser.vue"),
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
            },
            quoteSaleChangeDeletePreAudit: {
              isShow: true
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
        formItem.setTm=obj.setTm.slice(0,8);
        formItem.firstSettleDt=obj.firstSettleDt;
        formItem.dueSettleDt=obj.dueSettleDt;
        formItem.prodNo=obj.prodNo;
        formItem.isInner=obj.isInner;
        formItem.ratePct=obj.ratePct;
        formItem.dueRatePct=obj.dueRatePct;
        formItem.totalNum=obj.totalNum;
        formItem.totalAmt=obj.totalAmtStr;
        formItem.buyBackTotalAmt=(obj.buyBackTotalAmtStr?obj.buyBackTotalAmtStr:'0')+"";
        if(obj.tenorDays&&obj.tenorDays>0){
          formItem.tenorDays=obj.tenorDays;
        }else{
          formItem.tenorDays="";
        }
        formItem.yieldRatePct=obj.yieldRatePct;
        formItem.firstSettleAmt=obj.firstSettleAmtStr;
        formItem.dueSettleAmt=obj.dueSettleAmtStr;
        formItem.firstPayInterest=obj.firstPayInterestStr;
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
        formItem.rateAverPct = obj.rateAverPct;
        if (!!obj.isNoticeFirstAudit) {
          formItem.isNoticeFirstAudit=obj.isNoticeFirstAudit
        }else {
          formItem.isNoticeFirstAudit=this.isNoticeFirstAudit; //老数据，放默认值
        }
      },
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
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
        this.userIds = "";
        this.formItem.clearSpeed='';
        this.curBatchId=null;
        this.billFormItem.batchId=null;
        this.billFormItem.reverseBillNo = "";
        this.billFormItem.billMoneyRange.minBillMoney = "";
        this.billFormItem.billMoneyRange.maxBillMoney = "";
        this.billFormItem.minBillMoney = "";
        this.billFormItem.maxBillMoney = "";
        this.billFormItem.dueDtRange = [];
        this.billFormItem.minDueDt = "";
        this.billFormItem.maxDueDt = "";
        this.billFormItem.acptName = "";
        this.$refs.billDatagrid.showAdvanced = false;
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
        this.$refs["formItem"].validate(valid => {
            if (valid) {
              this.$hMsgBox.confirm({
                title: this.$t("m.i.common.confirm"),
                content: this.$t("确认要保存批次吗") + "?",
                onOk: () => {
                  this.editApply();
                }
              });
            }
        });
      },
      //保存
      editApply(optType){
        if(this.formItem.firstSettleDt){
          this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt,'YYYY-MM-DD').format('YYYYMMDD');
        }
        if(this.formItem.dueSettleDt){
          this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt,'YYYY-MM-DD').format('YYYYMMDD');
          this.dueSettleDt=this.formItem.dueSettleDt;
        }else{
          this.dueSettleDt='';
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
            let minRateBoolean=this.formItem.ratePct?this.formItem.ratePct-minRate<0:false;
            let maxRateBoolean=this.formItem.ratePct?this.formItem.ratePct-maxRate>0:false;
            let busiType=this.formItem.busiType;
            if(minRateBoolean){
              if('BT01'==busiType){
                this.$msgTip.error(this, { info: "交易利率必须大于等于票交所最小利率参数:"+minRate });
                return;
              }else if('BT02'==busiType){
                this.$msgTip.error(this, { info: "回购利率必须大于等于票交所最小利率参数:"+minRate});
                return;
              }else if('BT03'==busiType){
                this.$msgTip.error(this, { info: "首期交易利率必须大于等于票交所最小利率参数:"+minRate });
                return;
              }
            }
            if(maxRateBoolean){
              if('BT01'==busiType){
                this.$msgTip.error(this, { info: "交易利率必须小于等于票交所最大利率参数:"+maxRate });
                return;
              }else if('BT02'==busiType){
                this.$msgTip.error(this, { info: "回购利率必须小于等于票交所最大利率参数:"+maxRate});
                return;
              }else if('BT03'==busiType){
                this.$msgTip.error(this, { info: "首期交易利率必须小于等于票交所最大利率参数:"+maxRate });
                return;
              }
            }
            if('BT03'==busiType){
              let minDueRateBoolean=this.formItem.dueRatePct?this.formItem.dueRatePct-minRate<0:false;
              let maxDueRateBoolean=this.formItem.dueRatePct?this.formItem.dueRatePct-maxRate>0:false;
              if(minDueRateBoolean){
                this.$msgTip.error(this, { info: "到期交易利率必须大于等于票交所最小利率参数:"+minRate });
                return;
              }
              if(maxDueRateBoolean){
                this.$msgTip.error(this, { info: "到期交易利率必须小于等于票交所最大利率参数:"+maxRate });
                return;
              }
            }
            if('BT03'==busiType||'BT02'==busiType){
              let maxTenorDays=this.formItem.maxTenorDays?this.formItem.maxTenorDays:365;
              if(parseInt(this.formItem.tenorDays)>parseInt(maxTenorDays)){
                this.$msgTip.error(this, { info: "回购期限不能大于"+maxTenorDays +"天"});
                return;
              }
            }
            let url = '/be/market/quote/quoteManager/func_editSaleApply';
            this.formItem.liFlag = this.licenseFlag;
            //解决原本发送的时间数据为xx:xx:xx.xxx格式的问题
            this.formItem.setTm=this.formItem.setTm.slice(0,8);
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
                  if(this.formItem.firstSettleDt){
                    this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                  }
                  if(this.formItem.dueSettleDt){
                    this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                  }
                  this.$msgTip.error(this, { info: msg });
                }
              }else{
                if(this.formItem.firstSettleDt){
                  this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }
                if(this.formItem.dueSettleDt){
                  this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
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
          this.busiType=this.formItem.busiType,
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
          this.uploadUrl = window.LOCAL_CONFIG.API_HOME+'/be/market/quote/quoteManager/func_batchSaleBill';
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
          let url="/be/market/quote/quoteManager/func_calcSaleInterest";
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
          let list=[];
          let billList='';
          let url="/be/market/quote/quoteManager/func_querySaleBillListAll";
          let batchId=this.batchId
          post({batchId:batchId},url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
                list=res.data.retData.list;

                let flag=1;
                console.log(list)
                for(let i=0;i<list.length;i++){
                  if (list[i].assetIndustry == "1"
                    &&(list[i].preRelationFlag==='1'||list[i].preRelationFlag==='2')) {
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
                      // 有审批时选择审批岗用户
                      if (this.isNeedToAudit == '1'){
                        this.$hMsgBox.confirm({
                            title: "确认",
                            content: "是否需要选择审批首岗？",
                            onOk: () => {
                              this.prodNo = this.formItem.prodNo;
                              this.billType = this.formItem.billType;
                              this.billClass = this.formItem.billClass;
                              this.auditWin = true;
                            },
                            onCancel: () =>{
                              // 无审批直接提交
                              this.applyWin = true;
                              this.applyTitle = "确认要提交申请吗?";
                            }
                        });

                      }else{
                        // 无审批直接提交
                        this.applyWin = true;
                        this.applyTitle = "确认要提交申请吗?";
                      }
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
                  console.log(this.isNeedToAudit);
                  // 有审批时选择审批岗用户
                  if (this.isNeedToAudit == '1'){
                    this.$hMsgBox.confirm({
                      title: "确认",
                      content: "是否需要选择审批首岗？",
                      onOk: () => {
                        this.prodNo = this.formItem.prodNo;
                        this.billType = this.formItem.billType;
                        this.billClass = this.formItem.billClass;
                        this.auditWin = true;
                      },
                      onCancel: () =>{
                        // 无审批直接提交
                        this.applyWin = true;
                        this.applyTitle = "确认要提交申请吗?";
                      }
                    });
                  }else{
                    // 无审批直接提交
                    this.applyWin = true;
                    this.applyTitle = "确认要提交申请吗?";
                  }
                }


              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
            }
          })

        }else{
          // 有审批时选择审批岗用户
          if (this.isNeedToAudit == '1'){
            this.$hMsgBox.confirm({
              title: "确认",
              content: "是否需要选择审批首岗？",
              onOk: () => {
                this.prodNo = this.formItem.prodNo;
                this.billType = this.formItem.billType;
                this.billClass = this.formItem.billClass;
                this.auditWin = true;
              },
              onCancel: () =>{
                // 无审批直接提交
                this.applyWin = true;
                this.applyTitle = "确认要提交申请吗?";
              }
            });

          }else{
            // 无审批直接提交
            this.applyWin = true;
            this.applyTitle = "确认要提交申请吗?";
          }
        }

      },


      // 提交申请
      apply(){
        post({ prodNo:  this.formItem.prodNo}, "/bm/audit/audit/func_checkIsNeedToAudit").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === true){
                this.isNeedToAudit = 1;
              }else{
                this.isNeedToAudit = 0;
              }
              let flag="";
              getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
                let value = res.value
                if(value=='0'){//否
                  flag="0";
                }else if(value=="1"){//是
                  flag="1";
                }
                if(this.formItem.busiType=="BT01" && flag=="0"){
                  this.showFlag=1;
                  this.setInfo();
                }else {
                  this.showFlag=0;
                  this.setInfo();
                }
              })
            } else {
              this.isNeedToAudit = "0";
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
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
              let url="/be/market/quote/quoteManager/func_commitSaleApply";
          post({ id: id ,riskFlag:this.riskFlag, preFlag:this.preFlag, userIds:this.userIds}, url).then(res => {
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
        let url="/be/market/quote/quoteManager/func_commitSaleApply";
        this.$hMsgBox.confirm({
          title:"确认要继续提交申请吗?",
          content:content,
          onOk: () => {
            post({ id: id, riskFlag:this.riskFlag, preFlag:this.preFlag, userIds:this.userIds }, url).then(res => {
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
              let url="/be/market/quote/quoteManager/func_deleteSalePacketBill";
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
              let url = "/be/market/quote/quoteManager/func_deleteSaleBill";
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
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/quoteManager/func_downloadSaleBill";
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
              let url="/be/market/quote/quoteManager/func_removeSaleBill";
              let batchId=this.formItem.id;
              post({batchId:batchId,ids:ids},url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
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
              let url="/be/market/quote/quoteManager/func_restoreSaleBill";
              let batchId=this.formItem.id;
              post({batchId:batchId,ids:ids},url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
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
              let url="/be/market/quote/quoteManager/func_resetLastSaleQuote";
              let batchId=this.formItem.id;
              post({id:batchId},url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
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
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/quoteManager/func_downloadSaleInfo";
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
              let url="/be/market/quote/quoteManager/func_deleteSalePreAudit";
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
        let batchId= this.curBatchId;
        let busiType=this.bt;
        let url ='';
        if(batchId){
          url='/be/market/quote/quoteManager/func_findSaleBatchById';
        }else{
          url='/be/market/quote/quoteManager/func_findSaleAddData';
        }
        post({id:batchId,busiType:busiType},url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.turnForm(this.formItem, obj);
                this.formItem.busiType = busiType;
                if(this.formItem.firstSettleDt){
                  this.formItem.firstSettleDt= this.$moment(this.formItem.firstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }else {
                  this.formItem.firstSettleDt= this.$moment(obj.workDate,'YYYYMMDD').format('YYYY-MM-DD');
                }
                if(this.formItem.dueSettleDt){
                  this.formItem.dueSettleDt= this.$moment(this.formItem.dueSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }
                this.billFormItem.batchId = obj.id;
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
      },
      queryAudit() {
        this.showFirstAuditStationAndUserWin = true;
      },
      clearAudit() {
        this.auditFormItem.userIds = "";
        this.auditFormItem.userNames = "";
      },
      showFirstAuditStationAndUserWinClose() {
        this.showFirstAuditStationAndUserWin = false;
      },
      auditSelect(info) {
        this.auditFormItem.userIds = info.userIds;
        this.auditFormItem.userNames = info.userName;
        this.showFirstAuditStationAndUserWin = false;
      },
      //审批确认
      auditSubmit() {
        this.userIds = this.auditFormItem.userIds;
        this.auditClose();
        this.applyWin = true;
        this.applyTitle = "确认要提交申请吗?";
      },
      //审批关闭
      auditClose() {
        this.$nextTick(() => {
          this.prodNo = "";
          this.billType = "";
          this.billClass = "";
          this.auditWin = false;
          this.$refs.auditFormItem.resetFields();
          this.auditFormItem.userIds = "";
          this.auditFormItem.userNames = "";
        });
      },
      // 组件中获取的金额区间赋值到传输到后台的最大最小金额上
      billMoneyRangeChange(billMoneyRange) {
        if (billMoneyRange != null) {
          this.billFormItem.minBillMoney = billMoneyRange.minBillMoney;
          this.billFormItem.maxBillMoney = billMoneyRange.maxBillMoney;
        }
      },

    },
    created(){
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
    },
    mounted() {
      this.$nextTick(()=>{
        this.advancedParams = {
          formItem: this.billFormItem,
          formItemCols: 2,
          componentList: [
            {
              model: 'reverseBillNo',
              componentName: "commonInput",
              componentProps: {
                label: this.$t('m.i.billInfo.billPackageNo'),
                prop: "reverseBillNo",
                className: "h-form-long-label",
              },
              componentOns: {}
            },
            {
              componentName: "billMoneyRange",
              model: 'billMoneyRange',
              componentProps: {
                label: this.$t('m.i.billInfo.billPackageMoney'),
                prop: "billMoneyRange",
                className: "h-form-long-label",
                bigTips: false,
              },
              componentOns: {}
            },
            {
              componentName: "dueDtRange",
              model: 'dueDtRange',
              componentProps: {
                label: this.$t('m.i.billInfo.dueDt'),
                prop: "dueDtRange",
                className: "h-form-long-label",
                transfer: true,
              },
              componentOns: {
                input: (date) => {
                  if (date && date.length >= 2) {
                    this.billFormItem.minDueDt = date[0].replace(/-/g, "");
                    this.billFormItem.maxDueDt = date[1].replace(/-/g, "");
                    this.billFormItem.dueDtRange = [date[0], date[1]];
                  } else {
                    this.billFormItem.minDueDt = "";
                    this.billFormItem.maxDueDt = "";
                    this.billFormItem.dueDtRange = [];
                  }
                }
              }
            },
            {
              componentName: "commonInput",
              model: 'acptName',
              componentProps: {
                label: this.$t('m.i.billInfo.acptName'),
                prop: "acptName",
                className: "h-form-long-label",
              },
              componentOns: {}
            },
          ],
          formSearch: ()=>{
            this.billMoneyRangeChange(this.billFormItem.billMoneyRange);
            this.$refs.billDatagrid.dataChange(1);
            this.$refs.billDatagrid.showAdvanced = false;
          },
          formSearchReset: ()=> {
            this.billFormItem.reverseBillNo = "";
            this.billFormItem.billMoneyRange.minBillMoney = "";
            this.billFormItem.billMoneyRange.maxBillMoney = "";
            this.billFormItem.minBillMoney = "";
            this.billFormItem.maxBillMoney = "";
            this.billFormItem.dueDtRange = [];
            this.billFormItem.minDueDt = "";
            this.billFormItem.maxDueDt = "";
            this.billFormItem.acptName = "";
          },
        }
      });
    }
  }
</script>

