<template>
  <!--信用与增信查询信用查复弹出框-->
  <h-msg-box v-model="tempCreditInfoReplyWin" width="1000" height="390"  top="30" :mask-closable="false" @on-close="handleClose"
             :maximize="true"  :z-index="1010" @on-maximize="onMaximize" class="h-ticket-layer">
    <p slot="header">
      <span>信用查复</span>
    </p>
    <h-tabs :animated="false" :value="billPane" @on-click="clickTabs" ref="closetab">

      <h-tab-pane label="增信信息" name="trustInfo" :class="this.blankClass">
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
            <div>
              <!--数据展示表格-->
              <h-datagrid
                :columns="columnsForTrust"
                highlight-row
                :bindForm="trustInfoItem"
                :auto-load="false"
                height="300"
                url="/pe/credit/creditQry/func_pagingQueryTrustInfoResp"
                ref="trustDatagrid">
              </h-datagrid>
            </div>
      </h-tab-pane>
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
                    <h-col span="5" class="label">{{$t("m.i.shcpe.acptAmtThsYr")}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.acptAmtThsYr)}}</h-col>
                    <h-col span="5" class="label">{{$t("m.i.shcpe.acptAmtLastYr")}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.acptAmtLastYr)}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.acptAmtLast5Yr')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.acptAmtLast5Yr)}}</h-col>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.acptBalanceAmt')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.acptAmt)}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrAmtOccurThsYr')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.dshnrAmtSncThsYr)}}</h-col>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrAmtOccurLastYr')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.dshnrAmtSncLastYr)}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrAmtSncLast5Yr')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.dshnrAmtSncLast5Yr)}}</h-col>
                    <h-col span="5" class="label">{{$t('m.i.shcpe.dshnrBal')}}:</h-col>
                    <h-col span="7" class="val">{{formatNumber(viewDetailForm.dshnrAmt)}}</h-col>
                  </h-row>

                </h-col>
              </h-row>

            </div>
          </div>
        </h-form>

      </h-tab-pane>
      <h-tab-pane label="评级信息" name="ratingInfo" :class="this.blankClass">
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
          <div>
            <!--数据展示表格-->
            <h-datagrid
              :columns="columnsForRating"
              highlight-row
              :bindForm="ratingInfoItem"
              :auto-load="false"
              height="300"
              url="/pe/credit/creditQry/func_pagingQueryRatingInfoResp"
              ref="ratingDatagrid">
            </h-datagrid>
          </div>
      </h-tab-pane>

    </h-tabs>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off,getDictListByGroups,formatNumber,getDictValueFromMap} from "@/api/bizApi/commonUtil";


  export default {
    name: "creditInfoReply",
    data() {
      return {
        billPane : "",
        blankClass : "h-ticket",
        billOriginList:[],
        billTypeList:[],
        dictMap:new Map(),
        viewDetailForm: {
          acptAmtThsYr:"",
          acptAmtLastYr:"",
          acptAmtLast5Yr:"",
          acptAmt : "",
          dshnrAmtSncThsYr:"",
          dshnrAmtSncLastYr:"",
          dshnrAmtSncLast5Yr : "",
          dshnrAmt:""
        },
        trustInfoItem : {
          reqMsgId : "",
          trgtPtcptType : ""
        },
        ratingInfoItem:{
          reqMsgId : "",
          trgtPtcptType : ""
        },
        columnsForTrust: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
          },
          {
            title: this.$t('m.i.billInfo.creditTrustTp'),
            key: "trustType",
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"GrntTypeCode",params.row.trustType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.creditTrustAmt'),
            key: "trustBalance",
            sortable: true,
            render: (h, params) => {
              let trustBalance = formatNumber(params.row.trustBalance, 2, ',');
              return h("span", {
                domProps: {
                  title: trustBalance
                }
              }, trustBalance);
            }
          },
          {
            title: this.$t('m.i.billInfo.creditTrustDt'),
            key: "trustDate",
            sortable: true,
            render: (h, params) => {
              if(params.row.trustDate == null || params.row.trustDate === ""){
                return "";
              }
              let date = this.$moment(params.row.trustDate, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.creditTrustBrchCode'),
            key: "trustBrchCode",
            sortable: true
          },
        ],
        columnsForRating: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
          },
          {
            title: this.$t('m.i.billInfo.cdtRatgs'),
            key: "creditRating",
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.cdtRatgAgcy'),
            key: "creditRatingMain",
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.cdtRatgDueDt'),
            key: "creditRatgDueDt",
            sortable: true,
            render: (h, params) => {
              if(params.row.creditRatgDueDt == null || params.row.creditRatgDueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.creditRatgDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.busiChannelCode'),
            key: "memberId",
            sortable: true
          },
        ]
      };
    },

    props: {
      creditInfoReplyWin: {
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
      creditInfoReplyWin(val) {
        if (val) {
          this.billPane = "trustInfo";
          this.trustInfoItem.reqMsgId = this.creditRespInfo.reqMsgId;
          this.trustInfoItem.trgtPtcptType = this.creditRespInfo.trgtPtcptType;
          this.ratingInfoItem.reqMsgId = this.creditRespInfo.reqMsgId;
          this.ratingInfoItem.trgtPtcptType = this.creditRespInfo.trgtPtcptType;
          this.$nextTick(() => {
            this.getCreditInfo();
            this.$refs.trustDatagrid.dataChange(1);
            this.$refs.ratingDatagrid.dataChange(1);
          });
        }else{
          this.$refs.trustDatagrid.tData = [];
          this.$refs.trustDatagrid.total = 0;
          this.$refs.ratingDatagrid.tData = [];
          this.$refs.ratingDatagrid.total = 0;
        }
      }
    },
    computed: {
      tempCreditInfoReplyWin: {
        get() {
          return this.creditInfoReplyWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.trustDatagrid.$refs.gridContent.handleResize();
          this.$refs.ratingDatagrid.$refs.gridContent.handleResize();
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
                this.viewDetailForm.acptAmtThsYr = creditInfo.acptAmtThsYr;
                this.viewDetailForm.acptAmtLastYr = creditInfo.acptAmtLastYr;
                this.viewDetailForm.acptAmtLast5Yr = creditInfo.acptAmtLast5Yr;
                this.viewDetailForm.acptAmt = creditInfo.acptAmt;
                this.viewDetailForm.dshnrAmtSncThsYr = creditInfo.dshnrAmtSncThsYr;
                this.viewDetailForm.dshnrAmtSncLastYr = creditInfo.dshnrAmtSncLastYr;
                this.viewDetailForm.dshnrAmtSncLast5Yr = creditInfo.dshnrAmtSncLast5Yr;
                this.viewDetailForm.dshnrAmt = creditInfo.dshnrAmt;

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
        this.$emit("creditInfoReplyWinClose", "");
      },
      //table点击切换事件
      clickTabs(name) {
        this.billPane = name;
        this.$refs.trustDatagrid.$refs.gridContent.handleResize();
        this.$refs.ratingDatagrid.$refs.gridContent.handleResize();
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,BillOrigin,DraftTypeCode,CdtQrySignCode,GrntTypeCode").then(res => {
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
