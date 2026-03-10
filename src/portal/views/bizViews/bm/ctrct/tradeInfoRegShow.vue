<!--贸易背景管理--->
<template>
  <div>
    <h-msg-box v-model="tempTradeInfoRegShow" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" >
      <p slot="header">
        <span>{{this.batchParams.title}}</span>
      </p>
      <div>
        <h-form :model="tradeInfoRegForm" :label-width="115" ref="tradeInfoRegForm" cols="3" class="h-form-search">
          <trade-info-item :tradeForm="tradeInfoRegForm" :batchParams="batchParams"></trade-info-item>
        </h-form>
        <!--数据展示表格-->
        <!--<h-datagrid >
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="invoiceManager()">{{$t("m.i.bm.invoiceManager")}}</h-button>
            <h-button type="primary" @click="ctrctManager()">{{$t("m.i.bm.ctrctManager")}}</h-button>
            <h-button type="primary" @click="otherVoucherManager()">{{$t("m.i.bm.otherVoucherManager")}}</h-button>
          </div>
        </h-datagrid>-->
      </div>
     <!-- <div slot="footer">
      </div>-->
      <div slot="footer">
        <h-button type="primary" @click="invoiceManager()">{{$t("m.i.bm.invoiceManager")}}</h-button>
        <h-button type="primary" @click="ctrctManager()">{{$t("m.i.bm.ctrctManager")}}</h-button>
        <h-button type="primary" @click="otherVoucherManager()">{{$t("m.i.bm.otherVoucherManager")}}</h-button>
        <h-button v-if="this.batchParams.endorType=='BB01'" type="primary" @click="register()">{{$t("m.i.bm.register")}}</h-button>
      </div>
    </h-msg-box>

    <contract-manager @relationContractBillClose="relationContractBillClose" :relationContractBillWin="relationContractBillWin"
                          ref="contractManager" :batchParams="batchParams" :dictMap="dictMap"></contract-manager>
    <invoice-manager @relationInvoiceBillClose="relationInvoiceBillClose" :relationInvoiceBillWin="relationInvoiceBillWin"
                      ref="invoiceManager" :batchParams="batchParams" :dictMap="dictMap"></invoice-manager>
    <voucher-manager @relationVoucherBillClose="relationVoucherBillClose" :relationVoucherBillWin="relationVoucherBillWin"
                     ref="voucherManager" :batchParams="batchParams" :dictMap="dictMap"></voucher-manager>
  </div>
</template>

<script>
  import { post, formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "tradeInfoRegShow",
    components: {
      contractManager:()=>import(/* webpackChunkName: "bm/ctrct/contractManager" */`@/views/bizViews/bm/ctrct/contractManager`),
      invoiceManager:()=>import(/* webpackChunkName: "bm/ctrct/invoiceManager" */`@/views/bizViews/bm/ctrct/invoiceManager`),
      voucherManager:()=>import(/* webpackChunkName: "bm/ctrct/voucherManager" */`@/views/bizViews/bm/ctrct/voucherManager`),
      tradeInfoItem: () => import(/* webpackChunkName: "bm/ctrct/tradeInfoItem" */"@/views/bizViews/bm/ctrct/tradeInfoItem"),
    },
    data() {
      return {
        relationInvoiceBillWin:false,
        relationContractBillWin:false,
        relationVoucherBillWin:false,
        tradeInfoRegForm: {
          id:"",
          billNo:"",
          billRange:"",
          billMoney:"",
          endorType:"",
          histFlowNo:"",
          tradeAmt:"",
          tradeModel:"",
          buyerName:"",
          buyerSocCode:"",
          buyerDistType:"",
          buyerAcctName:"",
          buyAcctNo:"",
          buyerBrchCode:"",
          sellerName:"",
          sellerSocCode:"",
          sellerDistType:"",
          sellerAcctName:"",
          sellerAcctNo:"",
          sellerBrchCode:"",
          invoiceNum:"",
          ctrctNum:"",
          otherVoucherNum:"",
          listId:"",
          tradeOperType:"",
        },
      };
    },
    props: {
      tradeInfoRegShowWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
    },

    watch: {
      tradeInfoRegShowWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.queryObjById();
          });
        }
      },
    },
    computed: {
      tempTradeInfoRegShow: {
        get() {
          return this.tradeInfoRegShowWin;
        },
        set() {
        }
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { listId: this.batchParams.listId,endorType:this.batchParams.endorType,billNo:this.batchParams.billNo,billRangeStart:this.batchParams.billRangeStart,billRangeEnd:this.batchParams.billRangeEnd,tradeOperType:this.batchParams.operType,id:this.batchParams.tradeId};
        let url = "/bm/ctrct/tradeInfo/func_getTradeRgstInfo";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.tradeInfoRegForm.id=obj.id;
              this.tradeInfoRegForm.billNo=obj.billNo;
              this.tradeInfoRegForm.billMoney=obj.billMoney;
              this.tradeInfoRegForm.billRangeStart = obj.billRangeStart;
              this.tradeInfoRegForm.billRangeEnd = obj.billRangeEnd;
              this.tradeInfoRegForm.billRange = formatBillRange(obj.billOrigin, obj.billRangeStart, obj.billRangeEnd);
              this.tradeInfoRegForm.endorType=obj.endorType;
              this.tradeInfoRegForm.histFlowNo=obj.histFlowNo;
              if (obj.tradeAmt){
                 this.tradeInfoRegForm.tradeAmt = obj.tradeAmt;
              }
              if (obj.tradeModel){
                this.tradeInfoRegForm.tradeModel = obj.tradeModel;
              }
              this.tradeInfoRegForm.buyerName=obj.buyerName;
              this.tradeInfoRegForm.buyerSocCode=obj.buyerSocCode;
              this.tradeInfoRegForm.buyerDistType=obj.buyerDistType;
              this.tradeInfoRegForm.buyerAcctName=obj.buyerAcctName;
              this.tradeInfoRegForm.buyAcctNo=obj.buyAcctNo;
              this.tradeInfoRegForm.buyerBrchCode=obj.buyerBrchCode;
              this.tradeInfoRegForm.sellerName=obj.sellerName;
              this.tradeInfoRegForm.sellerSocCode=obj.sellerSocCode;
              this.tradeInfoRegForm.sellerDistType=obj.sellerDistType;
              this.tradeInfoRegForm.sellerAcctName=obj.sellerAcctName;
              this.tradeInfoRegForm.sellerAcctNo=obj.sellerAcctNo;
              this.tradeInfoRegForm.sellerBrchCode=obj.sellerBrchCode;
              this.tradeInfoRegForm.invoiceNum=obj.invoiceNum;
              this.tradeInfoRegForm.ctrctNum=obj.ctrctNum;
              this.tradeInfoRegForm.otherVoucherNum=obj.otherVoucherNum;
              this.tradeInfoRegForm.billRange= formatBillRange(obj.billOrigin,obj.billRangeStart,obj.billRangeEnd)
              this.batchParams.tradeId = obj.id;
              this.batchParams.buyerName = obj.buyerName;
              this.batchParams.sellerName=obj.sellerName;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //发票管理
      invoiceManager(){
          this.relationInvoiceBillWin = true;
      },
      ctrctManager(){
          this.relationContractBillWin = true;
      },
      otherVoucherManager(){
          this.relationVoucherBillWin = true;
      },

      //关闭弹窗
      handleClose() {
        this.$refs.tradeInfoRegForm.resetFields();
        this.$emit("tradeInfoRegShowClose", "");
      },

      addOper(){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确定要登记贸易信息吗") + "?",
          onOk: () => {
            this.submit();
          }
        });
      },


      manegerOper(){
        post({id:this.batchParams.tradeId}, "/bm/ctrct/tradeInfo/func_getOper").then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$hMsgBox.confirm({
                title: this.$t("m.i.common.confirm"),
                content:  res.data.retMsg ,
                onOk: () => {
                  this.submit();
                }
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },

      register(){
        this.$refs["tradeInfoRegForm"].validate(valid => {
          if (valid) {
            if (this.batchParams.isManageOpen == "1"){
              this.manegerOper();
            } else {
              this.addOper();
            }
          }
        });
      },


      submit(){
        this.tradeInfoRegForm.tradeOperType = this.batchParams.operType;
        let url = "/bm/ctrct/tradeInfo/func_tradeInfoRgst";
        post(this.tradeInfoRegForm, url).then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.handleClose();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },

      relationContractBillClose(){
        this.relationContractBillWin = false;
        this.queryObjById();
      },
      relationInvoiceBillClose(){
        this.relationInvoiceBillWin = false;
        this.queryObjById();
      },
      relationVoucherBillClose(){
        this.relationVoucherBillWin = false;
        this.queryObjById();
      }

    }
  };
</script>

<style scoped>

</style>
