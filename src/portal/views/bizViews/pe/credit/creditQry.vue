<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
                <!--票据来源-->
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <!--票据(包)号码-->
                <bill-no v-model="formItem.billNoLike" prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')"></bill-no>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>

                <bill-money-range v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" :label="$t('m.i.billInfo.billPackageMoney')"></bill-money-range>
                <!--申请状态-->
                <common-select v-model="formItem.status" :label="$t('m.i.shcpe.aplStatus')" prop="status"
                               :dictList="applyStatusList"></common-select>
                <!--查询日期-->
                <common-date-picker v-model="formItem.queryDt" :label="$t('m.i.common.queryDt')" :autoPlacement="true" @on-change="handleDateChange"></common-date-picker>
                <!-- 签收状态 -->
                <common-select v-model="formItem.cdtQrySignStatus" :label="$t('m.i.shcpe.cdtInfoType')" prop="cdtQrySignStatus"
                               :dictList="cdtQrySignStatusList"></common-select>
                <query-btn :advanceShow='true' @showChange="showChange" :formSearch='formSearch' :formSearchReset='formSearchReset'></query-btn>

              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pe/credit/creditQry/func_pagingQueryCreditInfo"
                      :bindForm="formItem"
                      :onRowClick="handlelRowClick"
                      :onSelectChange="handleSelectClick"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="creditInfoPickBill()">{{$t("m.i.shcpe.queryCreditApplInfo")}}</h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--信用查询挑票弹框-->
    <credit-pick-bill :creditPickBillWin="creditPickBillWin" @creditPickBillWinClose="creditPickBillWinClose" @creditPickSubmit="creditPickSubmit"></credit-pick-bill>

    <!--支付信用查复弹框-->
    <credit-info-reply-member :creditInfoReplyMemberWin="creditInfoReplyMemberWin" :reqMsgId="reqMsgId"
                @creditInfoReplyMemberWinClose="creditReplyMemberClose"></credit-info-reply-member>


    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"
                    :billId="this.billId"></bill-info-main>
  </div>
</template>

<script>
  import {
    post,
    formatNumber,
    getDictListByGroups,
    getDictValueFromMap,
    formatBillRange
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditQry",
    components: {
      CreditInfoReplyMember: () => import(/* webpackChunkName: "pe/credit/creditInfoReplyMember" */`@/views/bizViews/pe/credit/creditInfoReplyMember`),
      CreditPickBill: () => import(/* webpackChunkName: "pe/credit/creditPickBill" */`@/views/bizViews/pe/credit/creditPickBill`)
    },
    data() {
      return {
        billNo : "",
        showBillInfoWin : false,
        billId : "",
        billRangeStart:"",
        billRangeEnd:"",
        creditPickBillWin : false,
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render:(h,params) => {
              return h("span",getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
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
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.cpesBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.formatBillStatus(params.row.billOrigin,params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.queryDt'),
            key: "queryDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.queryDt == null || params.row.queryDt === ""){
                return "";
              }
              let date = this.$moment(params.row.queryDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.shcpe.cdtInfoType'),
            key: "cdtQrySignStatus",
            hiddenCol: false,
            sortable: true,
            render:(h,params) => {
              return h("span",getDictValueFromMap(this.dictMap,"CdtQrySignCode",params.row.cdtQrySignStatus));
            }
          },
          {
            title: this.$t('m.i.shcpe.aplStatus'),
            key: "status",
            hiddenCol: false,
            sortable: true,
            render:(h,params) => {
              return h("span",getDictValueFromMap(this.dictMap,"QryDraftStatusCode",params.row.status));
            }
          },
          {
            title: this.$t('m.i.shcpe.replyResult'),
            key: "replyResult",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.status === '2'){
                return h("a", {
                  on: {
                    click: () => {
                      this.showCreditReplyMember(params.row.reqMsgId);
                    }
                  }
                }, "查复结果");
              }

            }
          },
        ],
        cdtQrySignStatusList : [],
        dictMap:new Map(),
        formItem: {
          billNoLike: "",
          billOrigin:"",
          status:"",
          cdtQrySignStatus : '',
          billRangeStart:"",
          minBillRangeStart:"",
          maxBillRangeEnd : "",
          billRangeEnd:"",
          billMoney : "",
          minBillMoney:"",
          maxBillMoney:"",
          queryDt : ""
        },
        submitFlag: false,
        isRequired: true,
        deletDisabled: false,
        ifShowMore: false,
        creditInfoReplyMemberWin: false,
        reqMsgId: "",
        billOriginList:[],
        applyStatusList:[]
      };
    },
    watch: {},

    computed: {},
    methods: {
      handleDateChange(value) {
        this.formItem.queryDt = value.replace(/-/g, "");
      },
      creditInfoPickBill() {
        this.creditPickBillWin = true;
      },
      showCreditReplyMember(reqMsgId) {
        this.reqMsgId = reqMsgId;
        this.creditInfoReplyMemberWin = true;
      },
      creditReplyMemberClose() {
        this.reqMsgId = "";
        this.creditInfoReplyMemberWin = false;
      },

      // 挑票窗关闭
      creditPickBillWinClose(){
        this.creditPickBillWin = false;
      },

      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.unDisabled();
            this.$refs.datagrid.dataChange(1);
            this.currentSelectRow = [];
            this.currentSelectList = [];
          }
        });
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.queryDt = "";
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //票面信息
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;

      },
      // 挑票确认
      creditPickSubmit(listId,cdtQrySignStatus){
        let url = "/pe/credit/creditQry/func_queryCreditSaveAndSendDraft";
        post({listId : listId ,cdtQrySignStatus : cdtQrySignStatus}, url).then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.$msgTip.success(this);
              this.creditPickBillWin = false;
              this.formSearch();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });

      },
      formatBillStatus(billOrigin, billStatus){
        if(billOrigin==="CS01"){
          return  this.dictMap.get("EcdsBillStatusCode").get(billStatus);
        }else {
          return this.dictMap.get("BillStatusCode").get(billStatus);
        }

      },
    },
    mounted() {
      getDictListByGroups("BillOrigin,CdtQrySignCode,QryDraftStatusCode,DraftTypeCode,EcdsBillStatusCode,BillStatusCode").then(res => {
        this.billOriginList = res.get("BillOrigin");
        this.cdtQrySignStatusList = res.get("CdtQrySignCode")
        this.applyStatusList = res.get("QryDraftStatusCode")
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
