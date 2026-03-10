<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
                <h-col span="15" class="val">{{format("QuoteBusiType",formItem.outBusiType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.batchNo')}}:</h-col>
                <h-col span="15" class="val">{{formItem.batchNo}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.outQuoteNo')}}:</h-col>
                <h-col span="15" class="val">{{formItem.outQuoteNo}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.brchName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.traderName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">外转机构名称：</h-col>
                <h-col span="15" class="val">{{formItem.outBuyBrchName}}</h-col>
              </h-row>
            </h-col>

          </h-row>

          <h-row :gutter="8">
          <h-col span="8">
              <h-row>
                <h-col span="9" class="label">外转机构代码：</h-col>
                <h-col span="15" class="val">{{formItem.outBuyBrchCode}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.outBuyTraderName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.outBuyTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.outBuyTraderNo')}}：</h-col>
                <h-col span="15" class="val">{{formItem.outBuyTraderNo}}</h-col>
              </h-row>
            </h-col>

          </h-row>

          <h-row :gutter="8">
          <h-col span="8">
              <h-row>
                <h-col span="9" class="label">部分成交：</h-col>
                <h-col span="15" class="val">{{format("Yon",formItem.subDeal)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
                <h-col span="15" class="val">{{format("DraftTypeCode",formItem.billType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billClass')}}：</h-col>
                <h-col span="15" class="val">{{format('CDMedia',formItem.billClass)}}</h-col>
              </h-row>
            </h-col>

          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.outClearType')}}：</h-col>
                <h-col span="15" class="val">{{format("ClearType",formItem.outClearType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.outSettleMode')}}：</h-col>
                <h-col span="15" class="val">{{format("SettleType",formItem.outSettleMode)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.outClearSpeed')}}：</h-col>
                <h-col span="15" class="val">{{format('ClearSpeed',formItem.outClearSpeed)}}</h-col>
              </h-row>
            </h-col>

          </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.outFirstSettleDt')}}：</h-col>
                  <h-col span="15" class="val">{{formatDate(formItem.outFirstSettleDt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.outRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.outRatePct)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.outSetTm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.outSetTm}}</h-col>
                </h-row>
              </h-col>

            </h-row>

            <h-row :gutter="8">
               <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.outQuoteTm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.outQuoteTm}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.prodName}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.totalAmtByYUAN')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.totalAmt)}}</h-col>
                </h-row>
              </h-col>

            </h-row>

            <h-row :gutter="8">
             <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.totalNum')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.totalNum}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.outFirstInterest')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.outFirstInterest)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.outFirstSettleAmt')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.outFirstSettleAmt)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.be.outTenorDays')}}：</h-col>
                    <h-col span="15" class="val">{{formItem.outTenorDays}}</h-col>
                  </h-row>
                </h-col>
              <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.be.outYieldRate')}}：</h-col>
                    <h-col span="15" class="val">{{formatRate(formItem.outYieldRatePct)}}</h-col>
                  </h-row>
                </h-col>
            </h-row>
        </div>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :height="350"
            :notSetWidth="true"
            :bindForm="billFormItem"
            url="/be/market/quote/innerMoveBill/saleQuoteApply/queryIMBBillList"
            ref="billDatagrid">
            <div slot="toolbar">
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
    </div>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo"></bill-info-main>
  </div>
</template>

<script>
  import { formatNumber, getDictValueFromMap, post, on, off ,getDictListByGroups,accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteSaleAudit",
    data(){
      return {
        billFormItem:{
          batchId:""
        },
        formItem:{
          id:'',
          busiType:'',
          batchNo: "",
          outQuoteNo:'',
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
          outSetTm:'',
          outQuoteTm:'',
          outFirstSettleDt:'',
          dueSettleDt:'',
          prodNo:'',
          ratePct:'',
          dueRatePct:'',
          totalNum:'',
          totalAmt:'',
          buyBackTotalAmt:null,
          outTenorDays:'',
          outYieldRatePct:'',
          firstSettleAmt:'',
          dueSettleAmt:'',
          outFirstInterest:'',
          dueInterest:'',
          productMapDict:'',
          sumInterestMargin:'',
          outBusiType:'',
          outBuyBrchName:'',
          outBuyBrchCode:'',
          outBuyTraderName:'',
          outBuyTraderNo:'',
          outClearType:'',
          outSettleMode:'',
          outClearSpeed:'',
          outFirstSettleAmt:'',
        },
        billColumns:[
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
            title: this.$t('m.i.billInfo.billNo'),
            key: 'billNo',
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoneyByUnit'),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
            align: "right",
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
          }
        ],
        // 分页切换配置
        pageSizeOpts : [10, 20, 50, 200],
        dictMap:new Map(),
        busiType:"",
        showBillInfoWin:false,
        billId:"",
        billNo:""
      };
    },
    components:{
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    created() {
      this.billFormItem.batchId = this.batchId;
    },
    mounted() {
      getDictListByGroups("QuoteBatchStatus,PreRelationFlag,PreTradeBhvr,CdSelectMode,ClearSpeed,SettleType,ClearType,Yon,QuoteBusiType,TrDir,CDMedia,DraftTypeCode,AcctFlag,QuoteStatus,StlResult,AssetIndustry").then(res => {
        this.dictMap = res.get("map");
      });
      this.init();
    },
    methods: {
      turnForm(formItem,obj){
        formItem.id=obj.id;
        formItem.busiType=obj.busiType;
        formItem.batchNo=obj.batchNo;
        formItem.outQuoteNo=obj.outQuoteNo;
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
        formItem.outSetTm=obj.outSetTm;
        formItem.outQuoteTm=obj.outQuoteTm;
        formItem.outFirstSettleDt=obj.outFirstSettleDt;
        formItem.dueSettleDt=obj.dueSettleDt;
        formItem.prodNo=obj.prodNo;
        formItem.prodName=obj.prodName;
        formItem.outRatePct=obj.outRatePct;
        formItem.dueRatePct=obj.dueRatePct;
        formItem.totalNum=obj.totalNum;
        formItem.totalAmt=obj.totalAmt;
        formItem.buyBackTotalAmt=obj.buyBackTotalAmt;
        formItem.outTenorDays=obj.outTenorDays;
        formItem.outYieldRatePct=obj.outYieldRatePct;
        formItem.firstSettleAmt=obj.firstSettleAmt;
        formItem.dueSettleAmt=obj.dueSettleAmt;
        formItem.outFirstInterest=obj.outFirstInterest;
        formItem.dueInterest=obj.dueInterest;
        formItem.preChangeInfo=obj.preChangeInfo;
        formItem.productMapDict=obj.productMap;
        formItem.sumInterestMargin=obj.sumInterestMargin;
        formItem.outBusiType=obj.outBusiType;
        formItem.outBuyBrchName=obj.outBuyBrchName;
        formItem.outBuyBrchCode=obj.outBuyBrchCode;
        formItem.outBuyTraderName=obj.outBuyTraderName;
        formItem.outBuyTraderNo=obj.outBuyTraderNo;
        formItem.outClearType=obj.outClearType;
        formItem.outSettleMode=obj.outSettleMode;
        formItem.outClearSpeed=obj.outClearSpeed;
        formItem.outFirstSettleAmt=obj.outFirstSettleAmt;
      },
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo){
        this.billId=billId;
        this.billNo=billNo;
        this.showBillInfoWin=true;
      },
      format(groupcode, key) {
        return getDictValueFromMap(this.dictMap, groupcode, key)
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : ""
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
      },
      //  初始化页面
      init(){
        let batchId= this.batchId;
        let url ='';
        if(batchId){
          url='/be/market/quote/innerMoveBill/saleQuoteApply/findIMBBatchById';
        }else{
          this.$msgTip.error(this, { info:"批次ID不能为空"});
        }
        post({id:batchId},url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.turnForm(this.formItem, obj);
                this.busiType=obj.busiType;
                if(this.formItem.outFirstSettleDt){
                  this.formItem.outFirstSettleDt= this.$moment(this.formItem.outFirstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }else {
                  this.formItem.outFirstSettleDt= this.$moment(obj.workDate,'YYYYMMDD').format('YYYY-MM-DD');
                }
                if(this.formItem.dueSettleDt){
                  this.formItem.dueSettleDt= this.$moment(this.formItem.dueSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
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

    }
  };
</script>

<style scoped>

</style>
