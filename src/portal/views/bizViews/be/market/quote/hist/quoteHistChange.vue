<template>
    <div>
        <h-msg-box v-model="tempQuoteChangeWin" :mask-closable="false" @on-close="handleClose" :maximize="true" width="1000" :height="600" :footerHide="true">
            <p slot="header">
                <span>{{title}}</span>
            </p>
            <div>
                 <h-form :model="formItem" :label-width="100" ref="formItem" cols="3" class="h-form-search">
                    <quote-input
                      :isQuoteNew="temIsQuoteNew"
                      :histBusiType="histBusiType"
                      :formItem="formItem"
                      :dictMap="dictMap"
                      @clearTemIsQuoteNew="clearTemIsQuoteNew"
                      @init="init">
                    </quote-input>
                 </h-form>
            </div>
             <!-- 数据展示表格 -->
              <h-datagrid :columns="columns"
                          :url="billListURL"
                          :bindForm="billFormItem"
                          :onSelectChange="quoteBillSelectClick"
                          :rowSelect="true"
                          :auto-load="false"
                          ref="billDatagrid">

              </h-datagrid>
        </h-msg-box>
      <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                      :billNo="billNo"  :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    </div>
</template>
<script >
import { post, on, off,formatNumber,getDictValueFromMap} from "@/api/bizApi/commonUtil";
export default {
    name: "quoteHistChange",
    data(){
      return {
        formItem:{
          id:'',
          busiType:'',
          quoteNo:'',
          reqNum:'',
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
          tradeCount:[],
          creditMainBrchCode:'',
          creditMainBankName:'',
          creditMainBankType:''
        },
        columns:[
          // {
          //     type: 'selection',
          //     width: 50,
          //     hiddenCol: false,
          //     align: 'center'
          //   },
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(this.trDir === "TDD01" || this.trDir === "CRD01"){
                return h("span",params.row.billNo);
              }
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('p',formatNumber(params.row.billMoney, 2, ','))
            }
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
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap.dictListMap, 'AssetIndustry', params.row.assetIndustry);
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
            },
            exportRender: (cellData) => {
              return formatNumber(cellData, 2, '，')
            }
          },
          {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueInterest, 2, ','))
            },
            exportRender: (cellData) => {
              return formatNumber(cellData, 2, '，')
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            },
            exportRender: (cellData) => {
              return formatNumber(cellData, 2, '，')
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueSettleAmt, 2, ','))
            },
            exportRender: (cellData) => {
              return formatNumber(cellData, 2, '，')
            }
          }
        ],
        // 分页切换配置
        pageSizeOpts : [10, 20, 50, 200],
        billFormItem:{batchId:null},
        importSelect:false,
        selectDataFirst:false,
        quoteBillSelectList:[],
        quoteBillSelectRowInx:[],
        billType:"",
        billClass:"",
        maxNum:"",
        temIsQuoteNew:'',
        showBillInfoWin:false,
        billId:"",
        billNo:"",
        billRangeStart:'',
        billRangeEnd:'',
      }
    },
    components:{
        QuoteInput:()=>import(/* webpackChunkName: "be/market/quote/hist/quoteHistInput" */`@/views/bizViews/be/market/quote/hist/quoteHistInput`)
    },
    props:{
      title:String,
      trDir:String,//交易方向：买入、卖出、正回购、逆回购
      bt:String, //交易类型：转贴现，质押式回购，买断式回购
      quoteNo:String,// 报价单编号
      isQuoteNew:String,//是否最新报价
      reqNum:String,//请求次数
      dictMap:{
          type:Object
      },
      initURL:{
        type: String,
        default() {
          return '/be/market/quote/quoteManager/func_findQuoteApplHist';
        }
      },
      billListURL:{
        type: String,
        default() {
          return '/be/market/quote/quoteManager/func_queryQuoteBillHistByPage';
        }
      },
      quoteHistChangeWin: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    computed: {
      tempQuoteChangeWin: {
        get() {
          return this.quoteHistChangeWin;
        },
        set(){

        }
      },
      histBusiType:{
        get() {
          return "H"+(!this.bt?"BT01":this.bt);
        },
        set(){}
      }

    },
    watch:{
      quoteHistChangeWin(val){
        if(val){
          this.temIsQuoteNew=this.isQuoteNew;
          this.init();
        }
      }
    },
    methods:{
      turnForm(formItem,obj){
        formItem.id=obj.id;
        formItem.busiType=obj.busiType;
        formItem.quoteNo=obj.quoteNo;
        formItem.reqNum=obj.reqNum;
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
        formItem.diffMsg=obj.diffMsg;

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
          this.maxNum=null;
          this.$emit("quoteHistChangeWinClose", "");
        },
        //选择记录
      quoteBillSelectClick(arr, selectInx){
        this.quoteBillSelectList = arr;
        this.quoteBillSelectRowInx = selectInx;
      },
      clearTemIsQuoteNew(){
        this.temIsQuoteNew=null;
      },
        //  初始化页面;
        init(){
          let quoteNo= this.quoteNo;
          let trDir=this.trDir;
          let reqNum=null;
          let txIsQuoteNew=null;
          if(this.temIsQuoteNew){
            txIsQuoteNew=this.temIsQuoteNew;
          }else{
            reqNum=this.formItem.reqNum;
          }
          post({quoteNo:quoteNo,trDir:trDir,isQuoteNew:txIsQuoteNew,reqNum:reqNum},this.initURL).then(res => {
            if (res && res.data) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
                this.$nextTick(() => {
                  let obj = res.data.retData;
                  if(obj){
                    this.turnForm(this.formItem, obj);
                    this.formItem.id=obj.id;
                    if(!this.maxNum){
                      this.maxNum=this.formItem.reqNum;
                    }
                    for (let i=1;i<=this.maxNum;i++) {
                      this.formItem.tradeCount[i-1]=i;
                    };
                    if(this.formItem.firstSettleDt){
                      this.formItem.firstSettleDt= this.$moment(this.formItem.firstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                    }
                    if(this.formItem.dueSettleDt){
                      this.formItem.dueSettleDt= this.$moment(this.formItem.dueSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                    }
                    this.billFormItem.batchId = this.formItem.id;
                    this.$refs.billDatagrid.dataChange(1);
                  }else{
                    this.formItem.id="";
                    this.formItem.busiType="";
                    this.formItem.quoteNo="";
                    this.formItem.reqNum="";
                    this.formItem.saleBrchCode="";
                    this.formItem.saleBrchName="";
                    this.formItem.saleTraderNo="";
                    this.formItem.saleTraderName="";
                    this.formItem.saleProductNo="";
                    this.formItem.saleProductName="";
                    this.formItem.buyBrchCode="";
                    this.formItem.buyBrchName="";
                    this.formItem.buyTraderNo="";
                    this.formItem.buyTraderName="";
                    this.formItem.buyProductNo="";
                    this.formItem.buyProductName="";
                    this.formItem.subDeal="";
                    this.formItem.billClass="";
                    this.formItem.billType="";
                    this.formItem.clearSpeed="";
                    this.formItem.clearType="";
                    this.formItem.settleMode="";
                    this.formItem.selectType="";
                    this.formItem.packetSeq="";
                    this.formItem.quoteTm="";
                    this.formItem.setTm="";
                    this.formItem.firstSettleDt="";
                    this.formItem.dueSettleDt="";
                    this.formItem.ratePct="";
                    this.formItem.dueRatePct="";
                    this.formItem.totalNum="";
                    this.formItem.totalAmt="";
                    this.formItem.buyBackTotalAmt="";
                    this.formItem.tenorDays="";
                    this.formItem.yieldRatePct="";
                    this.formItem.firstSettleAmt="";
                    this.formItem.dueSettleAmt="";
                    this.formItem.firstPayInterest="";
                    this.formItem.dueInterest="";
                    this.formItem.diffMsg="";
                    this.billFormItem.batchId=null;
                    this.$refs.billDatagrid.dataChange(1);
                    this.$msgTip.error(this, { info:"根据报价单编号[" +quoteNo+"]未查询到对应的交易历史"});
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
    }

}
</script>

