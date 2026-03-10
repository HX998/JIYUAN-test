<template>
  <!--支付信用查复对象列表-->
  <h-msg-box v-model="tempCreditInfoReplyMemberWin" width="1000" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer" :maximize="true"  top="30">
    <p slot="header">
      <span>{{title}}</span>
    </p>

    <div>
      <h-datagrid
        :columns="columns"
        :bindForm="formItem"
        highlight-row
        url="/pe/credit/creditQry/func_pagingQueryCreditInfoRespMember"
        :autoLoad="false"
        :hasPage="false"
        ref="datagrid">
      </h-datagrid>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>

    <credit-info-reply :creditInfoReplyWin="creditInfoReplyWin" :creditRespInfo="creditRespInfo" :showForm="showForm"
                       @creditInfoReplyWinClose="creditInfoReplyWinClose"></credit-info-reply>

    <credit-info-reply-ecds :creditInfoReplyEcdsWin="creditInfoReplyEcdsWin" :creditRespInfo="creditRespInfo" :showForm="showForm"
                            @creditInfoReplyEcdsWinClose="creditInfoReplyEcdsWinClose"></credit-info-reply-ecds>

  </h-msg-box>
</template>

<script>
  import {
    post, on, getDictListByGroups,
    getDictValueFromMap, formatNumber,formatBillRange
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditInfoReplyMember",
    components: {
      CreditInfoReplyEcds: () => import(/* webpackChunkName: "pe/credit/creditInfoReply" */`@/views/bizViews/pe/credit/creditInfoReplyEcds`),
      CreditInfoReply: () => import(/* webpackChunkName: "pe/credit/creditInfoReply" */`@/views/bizViews/pe/credit/creditInfoReply`)
    },
    data() {
      return {
        formItem : {
          reqMsgId: "",
        },
        creditRespInfo :{
          reqMsgId : "",
          trgtPtcptType : ""
        },
        showForm:{
          billNo : "",
          billOrigin : "",
          billType : "",
          billMoney : "",
          acptName : "",
          trgtPtcptName : ""
        },
        creditInfoReplyWin: false,
        creditInfoReplyEcdsWin: false,
        ecdsAvailable : true,
        dictMap:new Map(),
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.queryObjType"),
            key: "trgtPtcptType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = "";
              if (params.row.trgtPtcptType === "CI04"){
                dictValue = "承兑人";
              }else {
                dictValue = "交易对手";
              }
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.shcpe.queryObject'),
            key: "trgtPtcptName",
            hiddenCol: false,
            render: (h, params) => {
              let name = "";
              if (params.row.trgtPtcptType === "CI04"){
                name = params.row.acptName
              }else {
                name = params.row.trgtPtcptName
              }
              return h("a", {
                on: {
                  click: () => {
                    if (params.row.billOrigin === "CS01" && this.ecdsAvailable){
                      this.showCreditInfoReplyEcds(params.row);
                    }else{
                      this.showCreditInfoReply(params.row);
                    }
                  }
                }
              }, name);
            }
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          }
        ],
        ifShowMore: false,
        tableRef: "selfTable"
      };
    },
    props: {
      creditInfoReplyMemberWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "查复清单"
      },
      reqMsgId: {
        type: String
      }
    },
    comments: {},
    watch: {
      creditInfoReplyMemberWin(val) {
        if (val === true) {
          this.formItem.reqMsgId = this.reqMsgId;
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },

    computed: {
      tempCreditInfoReplyMemberWin: {
        get() {
          return this.creditInfoReplyMemberWin;
        },
        set() {
        }
      }
    },
    methods: {
      handleClose() {
        this.formItem.reqMsgId = "";
        this.$emit("creditInfoReplyMemberWinClose", "");
      },
      showCreditInfoReply(row) {
        this.creditRespInfo.reqMsgId = row.reqMsgId;
        this.creditRespInfo.trgtPtcptType = row.trgtPtcptType;
        this.showForm.billNo = row.billNo;
        this.showForm.billOrigin = row.billOrigin;
        this.showForm.billType = row.billType;
        this.showForm.billMoney = row.billMoney;
        this.showForm.acptName = row.acptName;
        this.showForm.trgtPtcptName = row.trgtPtcptName;
        this.creditInfoReplyWin = true;
      },
      creditInfoReplyWinClose() {
        this.creditRespInfo.reqMsgId = "";
        this.creditRespInfo.trgtPtcptType = "";
        this.creditInfoReplyWin = false;
      },
      showCreditInfoReplyEcds(row) {
        this.creditRespInfo.reqMsgId = row.reqMsgId;
        this.creditRespInfo.trgtPtcptType = row.trgtPtcptType;
        this.showForm.billNo = row.billNo;
        this.showForm.billOrigin = row.billOrigin;
        this.showForm.billType = row.billType;
        this.showForm.billMoney = row.billMoney;
        this.showForm.acptName = row.acptName;
        this.showForm.trgtPtcptName = row.trgtPtcptName;
        this.creditInfoReplyEcdsWin = true;
      },
      creditInfoReplyEcdsWinClose() {
        this.creditRespInfo.reqMsgId = "";
        this.creditRespInfo.trgtPtcptType = "";
        this.creditInfoReplyEcdsWin = false;
      },
      getEcdsAvailable(){
        post({}, "/pe/credit/creditQry/func_getEcdsAvailable").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData !== null) {
                this.ecdsAvailable = res.data.retData;
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,BillOrigin,cdtQrySignStatus").then(res => {

        this.dictMap = res.get("map");
      });
      this.getEcdsAvailable();
      on(window, "resize", this.handleResize);
    }
  };
</script>

<style scoped>

</style>
