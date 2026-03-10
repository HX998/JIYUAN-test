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
        url="/pl/plsign/billAgreementMain/func_pagingBillAgreement"
        ref="datagrid">
      </h-datagrid>
    </div>
<!--    多池模式查看保证金账号-->
    <multi-pool-bail-acct-no-show :win="multiPoolBailAcctNoWin" :params="multiPoolParams" @showMultiPoolBailAcctNoWinClose="showMultiPoolBailAcctNoWinClose"></multi-pool-bail-acct-no-show>
  </div>
</template>

<script>
import { accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter,getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";
import MultiPoolBailAcctNoShow from "../../common/multiPoolBailAcctNoShow";

export default {
  name: "agreementAudit",
  components: {MultiPoolBailAcctNoShow},
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
        title: this.$t("m.i.common.brchName"),
        key: "brchName",
        ellipsis: false,
        hiddenCol: false,
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
        render: (h, params) => {
          if (this.isMultiPool === '1'){
            let attachment = "查看保证金账户";
            return h("a", {
              on: {
                click: () => {
                  this.showAttachDeal(params.row);
                }
              }
            }, attachment);
          } else {
            return h("span", params.row.billBailAcctNo);
          }
        },
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
          if (discountPcet != null && discountPcet !== "" && discountPcet !== 0) {
            discountPcet = formatNumber(accMul(discountPcet, 100), 2, ",");
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
        title: this.$t("m.i.pl.isCheckBeforeInPool"),
        key: "isCheckBeforeInPool",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCheckBeforeInPool);
          return h("span", {
            domProps: {
              title: dictValue
            }
          }, dictValue);
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
      }
    ];
    return {
      isMultiPool : "0",
      isSubAcctWorks : "",
      dictMap : new Map(),
      billFormItem : {
        id: "",
      },
      columns:columns,
      multiPoolParams : {},
      multiPoolBailAcctNoWin : false,
    };
  },

  created() {
    this.billFormItem.id = this.batchId;
  },
  mounted() {
    this.getDictListByGroups("SignFuncNo,SaleOffMode,Yon,FreezedFuncNo,CDMedia,DraftTypeCode,bankLevel,bankType,CorpScale,ModeType").then(res => {
      this.signFuncNoList = res.get("SignFuncNo");
      this.saleOffModeList = res.get("SaleOffMode");
      this.YonList = res.get("Yon");
      this.freezedFuncNoList = res.get("FreezedFuncNo");
      this.dictMap = res.get("map");
    });
    getSingleParamValuesByKeys("bm.cust.is_sub_acct_works,pl.plsign.is_multi_pool").then(res => {
      this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
      this.isMultiPool = res["pl.plsign.is_multi_pool"];  // 是否允许多池模式
      if (this.isSubAcctWorks==='0'){
        this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo",true);  //不显示保证金子账号
      }
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
    //查看多池保证金账号
    showAttachDeal(info) {
      this.multiPoolBailAcctNoWin = true;
      this.multiPoolParams.signPoolInfoList = info.signPoolInfoList;
      this.multiPoolParams.isSubAcctWorks = this.isSubAcctWorks;
      this.multiPoolParams.optType = "renew";
      this.multiPoolParams.custNo = info.custNo;
      this.multiPoolParams.isMultiPool = this.isMultiPool;
      this.multiPoolParams.legalNo = this.info.legalNo;
    },
    showMultiPoolBailAcctNoWinClose(){
      this.multiPoolBailAcctNoWin = false;
    },
  }
};
</script>

<style scoped>

</style>
