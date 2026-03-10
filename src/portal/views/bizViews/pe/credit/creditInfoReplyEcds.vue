<template>
  <!--ecds支付信用查询信用查复弹出框-->
  <h-msg-box v-model="tempCreditInfoReplyEcdsWin" width="1000" height="390"  top="30" :mask-closable="false" @on-close="handleClose"
             :maximize="true" :z-index="1010" @on-maximize="onMaximize" class="h-ticket-layer">
    <p slot="header">
      <span>信用查复</span>
    </p>
    <h-tabs :animated="false" :value="billPane" @on-click="clickTabs" ref="closetab">
      <h-tab-pane label="支付信用" name="creditInfo" :class="this.blankClass">
        <div>
          <h-form :model="showForm" :label-width="100" ref="showForm" cols="3" class="h-form-search">
            <!--票据(包)号码-->
            <bill-no v-model="showForm.billNo" prop="billNo" :label="$t('m.i.billInfo.billPackageNo')" :readonly="true"></bill-no>
            <!--票据来源-->
            <common-select v-model="showForm.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                           :dictList="billOriginList" :readonly="true"></common-select>

            <bill-type v-model="showForm.billType" :dictList="billTypeList" :readonly="true"></bill-type>
            <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" readonly>
              <h-typefield type="money" v-model="showForm.billMoney" placeholder="" readonly></h-typefield>
            </h-form-item>
            <opp-name v-model="showForm.trgtPtcptName" :readonly="true"></opp-name>
            <acpt-name v-model="showForm.acptName" :readonly="true"></acpt-name>
          </h-form>
        </div>
        <h-form :model="viewDetailForm" ref="">
          <div class="text-wrap mb-10">
            <div class="text-body">
              <h-row :gutter="12">
                <h-col span="24">
                  <h-row>
                    <h-col span="5" class="label">{{$t("m.i.shcpe.acptSum")}}:</h-col>
                    <h-col span="7" class="val">{{viewDetailForm.acptSum}}</h-col>
                    <h-col span="5" class="label">{{$t("m.i.shcpe.acptAmt")}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.acptAmt)}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.pydQty')}}:</h-col>
                    <h-col span="7" class="val">{{viewDetailForm.pydQty}}</h-col>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.pydAmt')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.pydAmt)}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.pdgQty')}}:</h-col>
                    <h-col span="7" class="val">{{viewDetailForm.pdgQty}}</h-col>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.pdgAmt')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.pdgAmt)}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrQty')}}:</h-col>
                    <h-col span="7" class="val">{{viewDetailForm.dshnrQty}}</h-col>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrAmt')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.dshnrAmt)}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrQtySncThsYr')}}:</h-col>
                    <h-col span="7" class="val">{{viewDetailForm.dshnrQtySncThsYr}}</h-col>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrAmtSncThsYr')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.dshnrAmtSncThsYr)}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrQtySncLastYr')}}:</h-col>
                    <h-col span="7" class="val">{{viewDetailForm.dshnrQtySncLastYr}}</h-col>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrAmtSncLastYr')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.dshnrAmtSncLastYr)}}</h-col>
                  </h-row>
                </h-col>
              </h-row>
            </div>
          </div>
        </h-form>

      </h-tab-pane>
    </h-tabs>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off,getDictListByGroups,formatNumber} from "@/api/bizApi/commonUtil";
  export default {
    name: "creditInfoReplyEcds",
    data() {
      return {
        billPane : "",
        blankClass : "h-ticket",
        billOriginList:[],
        billTypeList:[],
        dictMap:new Map(),
        viewDetailForm: {
          acptSum:"",
          acptAmt:"",
          pydQty:"",
          pydAmt:"",
          pdgQty:"",
          pdgAmt:"",
          dshnrQty:"",
          dshnrAmt:"",
          dshnrQtySncThsYr:"",
          dshnrAmtSncThsYr:"",
          dshnrQtySncLastYr:"",
          dshnrAmtSncLastYr:"",
        },
      };
    },

    props: {
      creditInfoReplyEcdsWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      creditRespInfo: {
        type: Object,
        default: {}

      },
      showForm:{
        type: Object,
        default: {}
      },
    },
    comments: {},
    watch: {
      creditInfoReplyEcdsWin(val) {
        if (val) {
          this.billPane = "creditInfo";
          this.$nextTick(() => {
            this.getCreditInfo();
          });
        }
      }
    },
    computed: {
      tempCreditInfoReplyEcdsWin: {
        get() {
          return this.creditInfoReplyEcdsWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {

        }, 100);
      },
      formatNumber(value){
        return formatNumber(value, 2, ',');
      },
      //支付信用信息
      getCreditInfo() {
        let params = {
          reqMsgId : this.creditRespInfo.reqMsgId ,
          trgtPtcptType : this.creditRespInfo.trgtPtcptType
        };
        post(params, "/pe/credit/creditQry/func_queryCreditInfoResp").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData !== null) {
                let creditInfo = res.data.retData[0];
                this.viewDetailForm.acptSum = creditInfo.acptSum;
                this.viewDetailForm.acptAmt = creditInfo.acptAmt;
                this.viewDetailForm.pydQty = creditInfo.pydQty;
                this.viewDetailForm.pydAmt = creditInfo.pydAmt;
                this.viewDetailForm.pdgQty = creditInfo.pdgQty;
                this.viewDetailForm.pdgAmt = creditInfo.pdgAmt;
                this.viewDetailForm.dshnrQty = creditInfo.dshnrQty;
                this.viewDetailForm.dshnrAmt = creditInfo.dshnrAmt;
                this.viewDetailForm.dshnrQtySncThsYr = creditInfo.dshnrQtySncThsYr;
                this.viewDetailForm.dshnrAmtSncThsYr = creditInfo.dshnrAmtSncThsYr;
                this.viewDetailForm.dshnrQtySncLastYr = creditInfo.dshnrQtySncLastYr;
                this.viewDetailForm.dshnrAmtSncLastYr = creditInfo.dshnrAmtSncLastYr;
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

      handleClose() {
        this.$emit("creditInfoReplyEcdsWinClose", "");
      },
      //table点击切换事件
      clickTabs(name) {
        this.billPane = name;
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,BillOrigin,DraftTypeCode,CdtQrySignCode").then(res => {
        this.billOriginList = res.get("BillOrigin");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
      on(window, "resize", this.handleResize);
    }
  };
</script>

<style scoped>

</style>
