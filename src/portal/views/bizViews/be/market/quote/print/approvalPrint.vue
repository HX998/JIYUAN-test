<style type="text/css" scoped>
  body, h1, h2, h3, h4, h5, h6, hr, p, ul, ol, li, div, textarea, th, td { margin: 0; padding: 0;}
  body {font-family: "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;font-size: 12px;line-height: 1.5;color: #333333;background-color: #fff;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}
  html,body{height: 100%;}
  h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {margin-bottom: 0.5rem;font-weight: 500;line-height: 1.1;color: inherit;}
  i, em {font-style: normal;}
  ul, ol {list-style: none;}
  :focus {outline: 0;}
  * {box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);}
  .h-ticket-table table {border-collapse: collapse;border-spacing: 0;width: 100%;}
  .h-ticket td {border: 1px solid #666666;height: 40px;padding: 0 12px;color: #000000;}
  .h-ticket .th {text-align: right;color: #333333;}
  .h-t_blue .th {background: rgba(12, 103, 176, 0.10);}
  .h-t_green .th {background: rgba(107, 175, 27, 0.10);}
  .h-t_pink .th {background: rgba(179, 60, 90, 0.10);}
  .h-t_orange .th {background: rgba(198, 127, 28, 0.10);}
  .h-ticket-title {font-size: 20px;font-weight: bold;text-align: center;padding: 20px 0 15px 0;}
  .h-ticket .tac {text-align: center;}
  .h-ticket .h-money-cell {height: 59px;padding: 0;}
  .h-ticket .h-money-unit {height: 26px;border-bottom: 1px solid #666666;}
  .h-money-unit em {width: 8.3%;height: 26px;text-align: center;line-height: 26px;border-right: 1px solid #666666;color: #666666;float: left;}
  .h-money-unit .h-last {border-right: none;}
  .h-money-num span {width: 8.3%;height: 33px;text-align: center;line-height: 33px;border-right: 1px solid #666666;float: left;font-size: 16px;}
  .h-money-num .h-last {border-right: none;}
  .h-fs14 {font-size: 14px;font-weight: bold;}
  .h-btw2 {border-top: 2px solid #666666;}
  .h-ticket-info {margin: -5px 20px 10px 20px;}
  .h-ticket-info li {float: left;width: 33.33%;margin-bottom: 5px;}
  .h-bz-l {float: left;width: 40%;}
  .h-bz-c {float: left;width: 30%;}
  .h-bz-r {float: right;width: 130px;}
  .h-pj-l {float: left;width: 50%;}
  .h-pj-c {float: left;width: 25%;}
  .h-pj-r {float: right;width: 140px;}
  .h-ticket-dq {color: #238fdc;border: 1px solid rgba(35, 143, 220, 0.60);border-radius: 2px;height: 18px;padding: 0 4px;float: right;line-height: 16px;cursor: default;}
  .h-c6 {color: #666666;}
  .h-t_white {background: #fff;background-image: none;}
  .h-t_white .th {text-align: center;}
  .h-idea-box{width: 100%;padding: 10px 0;}
  .h-idea-box .idea{height: 60px;}
  .h-idea-box .date{text-align: right;padding-right: 20px;}
  .h-ticket label{margin-right: 25px;}
  .h-ticket .check{vertical-align: bottom;margin: 0 0 2px 4px;}
  .h-ticket .money{padding: 0 10px;border-bottom: 1px solid #333;}
  .table-record{padding: 0 20px;}
</style>
<template>
    <div>
      <h-msg-box v-model="tempApprovalPrintWin" @on-close="handleClose" :maximize="true" width="1000" :height="600" :footerHide="true">
        <h-button type="ghost"  @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="printList" >打印</h-button>
        <div  ref="approval">
          <keep-alive >
            <component :is="printType" :formItem ="formItem" :dictMap="dictMap">
            </component>
          </keep-alive>
        </div>
      </h-msg-box>
    </div>
</template>

<script>
  import { post, on, off,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "approvalPrint",
    data() {
      return {
        formItem : {
          id:'',
          legalNo:'',
          memberId:'',
          batchNo:'',
          quoteNo:'',
          dealNo:'',
          dealType:'',
          dealDt:'',
          dealDtTm:'',
          dealStatus:'',
          busiType:'',
          trDir:'',
          prodNo:'',
          prodName:'',
          reqBrchCode:'',
          reqBrchName:'',
          reqTraderNo:'',
          reqTraderName:'',
          reqProductNo:'',
          reqProductName:'',
          cpBrchCode:'',
          cpBrchName:'',
          cpBankNo:'',
          cpTraderName:'',
          cpTraderNo:'',
          cpProductNo:'',
          cpProductName:'',
          billClass:'',
          billType:'',
          clearSpeed:'',
          clearType:'',
          settleMode:'',
          selectType:'',
          packetSeq:'',
          subDeal:'',
          quoteTm:'',
          setTm:'',
          firstSettleDt:'',
          dueSettleDt:'',
          rate:'',
          ratePct:'',
          dueRate:'',
          dueRatePct:'',
          totalNum:'',
          totalAmt:'',
          totalAmtCap:'',
          buyBackTotalAmt:'',
          tenorDays:'',
          yieldRate:'',
          firstSettleAmt:'',
          dueSettleAmt:'',
          firstPayInterest:'',
          dueInterest:'',
          duePayInterest:'',
          duePayAmt:'',
          interestStatus:'',
          batchStatus:'',
          isInner:'',
          preTradeBhvr:'',
          clearStatus:'',
          dueClearStatus:'',
          redeemFlag:'',
          acctStatus:'',
          dueAcctFlag:'',
          acctDt:'',
          dueAcctDt:'',
          applTellerNo:'',
          checkTellerNo:'',
          acctTellerNo:'',
          transBrchNo:'',
          acctBrchNo:'',
          dealPrcCode:'',
          dealPrcMsg:'',
          creditBatchFlowNo:'',
          creditCtrctNo:'',
          preFlag:'',
          isPreAudit:'',
          auditNo:'',
          auditStatus:'',
          teamNo:'',
          channelSource:'',
          createTime:'',
          updateTime:'',
          isFirstIssue:'',
          linkMan:'',
          phone:'',
        },
        printType:'',
        curBatchId:''
      }
    },
    components: {
    },
    props: {
      batchId: Number,
      approvalPrintWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      dictMap: {
        type:Object
      }
    },
    computed: {
      tempApprovalPrintWin: {
        get() {
          return this.approvalPrintWin;
        },
        set() {}
      }
    },
    watch: {
      approvalPrintWin(val){
        if(val){
          this.curBatchId=this.batchId;
          this.init();
        }
      },
    },
    methods: {
      turnForm(formItem,obj){
          formItem.id=obj.id;
          formItem.legalNo=obj.legalNo;
          formItem.memberId=obj.memberId;
          formItem.batchNo=obj.batchNo;
          formItem.quoteNo=obj.quoteNo;
          formItem.dealNo=obj.dealNo;
          formItem.dealType=obj.dealType;
          formItem.dealDt=obj.dealDt;
          formItem.dealDtTm=obj.dealDtTm;
          formItem.dealStatus=obj.dealStatus;
          formItem.busiType=obj.busiType;
          formItem.trDir=obj.trDir;
          formItem.prodNo=obj.prodNo;
          formItem.prodName=obj.prodName;
          formItem.reqBrchCode=obj.reqBrchCode;
          formItem.reqBrchName=obj.reqBrchName;
          formItem.reqTraderNo=obj.reqTraderNo;
          formItem.reqTraderName=obj.reqTraderName;
          formItem.reqProductNo=obj.reqProductNo;
          formItem.reqProductName=obj.reqProductName;
          formItem.cpBrchCode=obj.cpBrchCode;
          formItem.cpBrchName=obj.cpBrchName;
          formItem.cpBankNo=obj.cpBankNo;
          formItem.cpTraderName=obj.cpTraderName;
          formItem.cpTraderNo=obj.cpTraderNo;
          formItem.cpProductNo=obj.cpProductNo;
          formItem.cpProductName=obj.cpProductName;
          formItem.billClass=obj.billClass;
          formItem.billType=obj.billType;
          formItem.clearSpeed=obj.clearSpeed;
          formItem.clearType=obj.clearType;
          formItem.settleMode=obj.settleMode;
          formItem.selectType=obj.selectType;
          formItem.packetSeq=obj.packetSeq;
          formItem.subDeal=obj.subDeal;
          formItem.quoteTm=obj.quoteTm;
          formItem.setTm=obj.setTm;
          formItem.firstSettleDt=obj.firstSettleDt;
          formItem.dueSettleDt=obj.dueSettleDt;
          formItem.rate=obj.rate;
          formItem.ratePct=obj.ratePct;
          formItem.dueRate=obj.dueRate;
          formItem.dueRatePct=obj.dueRatePct;
          formItem.totalNum=obj.totalNum;
          formItem.totalAmt=obj.totalAmt;
          formItem.totalAmtCap=obj.totalAmtCap;
          formItem.buyBackTotalAmt=obj.buyBackTotalAmt;
          formItem.tenorDays=obj.tenorDays;
          formItem.yieldRate=obj.yieldRate;
          formItem.firstSettleAmt=obj.firstSettleAmt;
          formItem.dueSettleAmt=obj.dueSettleAmt;
          formItem.firstPayInterest=obj.firstPayInterest;
          formItem.dueInterest=obj.dueInterest;
          formItem.duePayInterest=obj.duePayInterest;
          formItem.duePayAmt=obj.duePayAmt;
          formItem.interestStatus=obj.interestStatus;
          formItem.batchStatus=obj.batchStatus;
          formItem.isInner=obj.isInner;
          formItem.preTradeBhvr=obj.preTradeBhvr;
          formItem.clearStatus=obj.clearStatus;
          formItem.dueClearStatus=obj.dueClearStatus;
          formItem.redeemFlag=obj.redeemFlag;
          formItem.acctStatus=obj.acctStatus;
          formItem.dueAcctFlag=obj.dueAcctFlag;
          formItem.acctDt=obj.acctDt;
          formItem.dueAcctDt=obj.dueAcctDt;
          formItem.applTellerNo=obj.applTellerNo;
          formItem.checkTellerNo=obj.checkTellerNo;
          formItem.acctTellerNo=obj.acctTellerNo;
          formItem.transBrchNo=obj.transBrchNo;
          formItem.acctBrchNo=obj.acctBrchNo;
          formItem.dealPrcCode=obj.dealPrcCode;
          formItem.dealPrcMsg=obj.dealPrcMsg;
          formItem.creditBatchFlowNo=obj.creditBatchFlowNo;
          formItem.creditCtrctNo=obj.creditCtrctNo;
          formItem.preFlag=obj.preFlag;
          formItem.isPreAudit=obj.isPreAudit;
          formItem.auditNo=obj.auditNo;
          formItem.auditStatus=obj.auditStatus;
          formItem.teamNo=obj.teamNo;
          formItem.channelSource=obj.channelSource;
          formItem.createTime=obj.createTime;
          formItem.updateTime=obj.updateTime;
          formItem.isFirstIssue=obj.isFirstIssue;
          formItem.linkMan=obj.linkMan;
          formItem.phone=obj.phone;
          formItem.custName=obj.custName;
          formItem.workDate=obj.workDate;
        },
      // format(groupcode, key) {
      //   return getDictValueFromMap(this.dictMap, groupcode, key);
      // },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      handleClose() {
        this.$emit("approvalPrintWinClose", "");
      },
      init(){
        let batchId= this.curBatchId;
        let url ='/be/market/quote/quoteManager/findQuoteBatchById';
        post({id:batchId},url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                // todo
                let custId = "approvalPrint000000";
                // if (!!obj.custId) {
                //   custId = "approvalPrint" + obj.custId;
                // }
                this.printType=()=>import(/* webpackChunkName: "be/market/quote/print/bank" */`@/views/bizViews/be/market/quote/print/bank/approvalPrint000000.vue`);
                this.turnForm(this.formItem, obj);
                if(this.formItem.totalAmt){
                  this.formItem.totalAmt=formatNumber(this.formItem.totalAmt, 2, ',');
                };
                if (this.formItem.isFirstIssue) {
                  if(this.formItem.isFirstIssue=="0"){
                    document.getElementById("isFirstIssueNo").setAttribute("checked","true");
                    document.getElementById("isFirstIssueYes").removeAttribute("checked");
                  }else{
                    document.getElementById("isFirstIssueNo").removeAttribute("checked");
                    document.getElementById("isFirstIssueYes").setAttribute("checked","true");
                  }
                };
                if(this.formItem.trDir){
                  if(this.formItem.trDir=="TDD01"){
                    document.getElementById("TDD01").setAttribute("checked","true");
                    document.getElementById("TDD02").removeAttribute("checked");
                    document.getElementById("CRD01").removeAttribute("checked");
                    document.getElementById("CRD02").removeAttribute("checked");
                  }else if(this.formItem.trDir=="TDD02"){
                    document.getElementById("TDD01").removeAttribute("checked");
                    document.getElementById("TDD02").setAttribute("checked","true");
                    document.getElementById("CRD01").removeAttribute("checked");
                    document.getElementById("CRD02").removeAttribute("checked");
                  }else if(this.formItem.trDir=="CRD01"){
                    document.getElementById("TDD01").removeAttribute("checked");
                    document.getElementById("TDD02").removeAttribute("checked");
                    document.getElementById("CRD01").setAttribute("checked","true");
                    document.getElementById("CRD02").removeAttribute("checked");
                  }else if(this.formItem.trDir=="CRD02"){
                    document.getElementById("TDD01").removeAttribute("checked");
                    document.getElementById("TDD02").removeAttribute("checked");
                    document.getElementById("CRD01").removeAttribute("checked");
                    document.getElementById("CRD02").setAttribute("checked","true");
                  }
                }
                if(this.formItem.billClass&&this.formItem.billType){
                  if(this.formItem.billClass=="ME01"&&this.formItem.billType=="AC01"){
                    document.getElementById("ME01AC01").setAttribute("checked","true");
                    document.getElementById("ME01AC02").removeAttribute("checked");
                    document.getElementById("ME02AC01").removeAttribute("checked");
                    document.getElementById("ME02AC02").removeAttribute("checked");
                  }else if(this.formItem.billClass=="ME01"&&this.formItem.billType=="AC02"){
                    document.getElementById("ME01AC01").removeAttribute("checked");
                    document.getElementById("ME01AC02").setAttribute("checked","true");
                    document.getElementById("ME02AC01").removeAttribute("checked");
                    document.getElementById("ME02AC02").removeAttribute("checked");
                  }else if(this.formItem.billClass=="ME02"&&this.formItem.billType=="AC01"){
                    document.getElementById("ME01AC01").removeAttribute("checked");
                    document.getElementById("ME01AC02").removeAttribute("checked");
                    document.getElementById("ME02AC01").setAttribute("checked","true");
                    document.getElementById("ME02AC02").removeAttribute("checked");
                  }else if(this.formItem.billClass=="ME02"&&this.formItem.billType=="AC02"){
                    document.getElementById("ME01AC01").removeAttribute("checked");
                    document.getElementById("ME01AC02").removeAttribute("checked");
                    document.getElementById("ME02AC01").removeAttribute("checked");
                    document.getElementById("ME02AC02").setAttribute("checked","true");
                  }
                }
                if(this.formItem.settleMode){
                  if(this.formItem.settleMode=="ST01"){
                    document.getElementById("ST01").setAttribute("checked","true");
                    document.getElementById("ST02").removeAttribute("checked");
                  }else if(this.formItem.settleMode=="ST02"){
                    document.getElementById("ST01").removeAttribute("checked");
                    document.getElementById("ST02").setAttribute("checked","true");
                  }
                }
                if(this.formItem.firstSettleDt){
                  this.formItem.firstSettleDt= this.$moment(this.formItem.firstSettleDt,'YYYYMMDD').format('YYYY年MM月DD日');
                }
                if(this.formItem.dueSettleDt){
                  this.formItem.dueSettleDt= this.$moment(this.formItem.dueSettleDt,'YYYYMMDD').format('YYYY年MM月DD日');
                }
                if(this.formItem.workDate){
                  this.formItem.workDate= this.$moment(this.formItem.workDate,'YYYYMMDD').format('YYYY-MM-DD');
                }
              });
            }else {
                this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
        });
      },
      printList() {
          let batchInfo=this.$refs.approval.innerHTML;
          // let approvalHead=this.$refs.approval.$refs.approvalHead.innerHTML;
          let approvalHead=document.getElementById("approvalHead").innerHTML;
        let approvalFoot=document.getElementById("approvalFoot").innerHTML;
          this.$print.printListHtm(this,approvalHead,batchInfo,{ bodyTop: "15%", bodyLeft:"1%", bodyWidth:"99%", bodyHeight:"85%" },approvalFoot);
      },
    },

  };
</script>

<style scoped>

</style>
