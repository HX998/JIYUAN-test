<template>
  <div>
    <!-- 批次信息 -->
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="columns"
        highlight-row
        :height="350"
        :bindForm="billFormItem"
        url="/pl/plsign/preAgreementMain/func_pagingPreAgreement"
        ref="datagrid">
      </h-datagrid>
    </div>
  </div>
</template>

<script>
  import { accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "preAgreementAudit",
    data() {
      let columns = [
        {
          type: "radio",
          title: " ",
          key: "multiSelect",
          width: 60,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pl.agreementNo"),
          key: "agreementNo",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pl.signStartDt"),
          key: "signStartDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.signStartDt == null || params.row.signStartDt === "") {
              return "";
            }
            let date = this.$moment(params.row.signStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pl.signEndDt"),
          key: "signEndDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.signEndDt == null || params.row.signEndDt === "") {
              return "";
            }
            let date = this.$moment(params.row.signEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pl.signFunc"),
          key: "signFuncNo",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let _signFuncNo = params.row.signFuncNo.indexOf("!") >=0 ? params.row.signFuncNo.substring(0,params.row.signFuncNo.length-1) : params.row.signFuncNo;
            let dictValue = this.getDictValueFromMap(this.dictMap, "SignFuncNo", _signFuncNo);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pl.signCustNo"),
          key: "custNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pl.custSettleAcctNo"),
          key: "custAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.pl.poolBillBailAcctNo"),
          key: "billBailAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t('m.i.pl.poolBailSubAcctNo'),
          key: "poolBailSubAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.pl.authorizer"),
          key: "authorizer",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pl.secondAuthorizer"),
          key: "secondAuthorizer",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.pl.isGroupCus"),
          key: "isGroupCus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGroupCus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pl.saleOffMode"),
          key: "saleOffMode",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "SaleOffMode", params.row.saleOffMode);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pl.discountPcet"),
          key: "discountPcet",
          hiddenCol: false,
          render: (h, params) => {
            let discountPcet = params.row.discountPcet;
            if (discountPcet != null && discountPcet !== "" &&  discountPcet !== 0) {
              discountPcet = accMul(discountPcet, 100);
              return h("span", discountPcet);
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: this.$t("m.i.pl.maxMoney"),
          key: "maxMoney",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let maxMoney = formatNumber(params.row.maxMoney, 2, ",");
            return h("span", {
              domProps: {
                title: maxMoney
              }
            }, maxMoney);
          }
        },
        {
          title: this.$t("m.i.pl.isCollect"),
          key: "isCollect",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCollect);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.signStatus"),
          key: "signStatus",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "PoolSignStatus", params.row.signStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
      ];
      return {
        dictMap : new Map(),
        billFormItem : {
          id: "",
        },
        columns:columns
      };
    },

    created() {
      this.billFormItem.id = this.batchId;
    },
    mounted() {
      getDictListByGroups("SignFuncNo,SaleOffMode,Yon,FreezedFuncNo,CDMedia,DraftTypeCode,bankLevel,CorpScale,ModeType,PoolSignStatus").then(res => {
        this.dictMap = res.get("map");
      });

    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    methods: {

    }
  };
</script>

<style scoped>

</style>
