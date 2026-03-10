<!--额度批复-票据池额度批复明细-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <quote-control-batch-detail :batchDetailParams="quoteControlDetailParams"
                                      ref="quoteControlBatchDetail"></quote-control-batch-detail>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/pl/quoteControl/quoteControlManager/func_pagingQueryWhiteQuoteInfoByBatchId"
            highlight-row
            :auto-load="false"
            :bindForm="billManagerFormItem"
            ref="billManagerDatagrid">
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
import {accMul, formatNumber, off, on, post} from "@/api/bizApi/commonUtil";

export default {
  name: "quoteControlAudit",
  data() {
    let columns = [
      {
        type: "index",
        title: this.$t("m.i.common.index"),
        width: 60,
        align: "center"
      },
      {
        title: this.$t("m.i.common.custName"),
        key: "custName",
        hiddenCol: false,
        ellipsis: false,
        sortable: true
      },
      {
        title: this.$t('m.i.pl.acptPartnerType'),
        key: "acptPartnerType",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "partnerType", params.row.acptPartnerType);
          return h("span", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t("m.i.billInfo.acptName"),
        key: "acptName",
        hiddenCol: false,
        ellipsis: false,
        sortable: true
      },
      {
        title: this.$t("m.i.pl.acptBankNo"),
        key: 'acptBankNo',
        hiddenCol: false,
      },
      {
        title: this.$t("m.i.pl.inPoolLimitBillAmt"),
        key: "impawnLimitAmt",
        hiddenCol: false,
        ellipsis: false,
        sortable: true,
        render: (h, params) => {
          if (params.row.impawnLimitAmt === "" || params.row.impawnLimitAmt === null) {
            return h("span", "");
          }
          let money = formatNumber(params.row.impawnLimitAmt, 2, ",");
          return h("span", {
            domProps: {
              title: money
            }
          }, money);
        }
      },
      {
        title: this.$t("m.i.pl.inPoolLimitAmt"),
        key: "creditLimitAmt",
        hiddenCol: false,
        ellipsis: false,
        sortable: true,
        render: (h, params) => {
          if (params.row.creditLimitAmt === "" || params.row.creditLimitAmt === null) {
            return h("span", "");
          }
          let money = formatNumber(params.row.creditLimitAmt, 2, ",");
          return h("span", {
            domProps: {
              title: money
            }
          }, money);
        }
      },
      {
        title: this.$t("m.i.pl.discountPcet"),
        key: "discountPcet",
        hiddenCol: false,
        render: (h, params) => {
          let discountPcet = params.row.discountPcet;
          if (discountPcet != null && discountPcet !== "") {
            discountPcet = formatNumber(accMul(discountPcet, 100), 2, ",");
            return h("span", discountPcet);
          } else {
            return h("span", "");
          }
        }
      },
    ];
    return {
      dictMap: new Map(),
      columns: columns,
      billManagerFormItem: {
        batchId: ""
      },
    };
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    listIds: "",
    batchId: ""
  },
  computed: {
    quoteControlDetailParams: {
      get() {
        return {
          "batchId": this.batchId,
          "isAudit": true
        };
      },
      set() {
      }
    },
  },
  mounted() {
    this.getDictListByGroups("partnerType").then(res => {
      this.dictMap = res.get("map");
    });
    this.$nextTick(() => {
      this.billManagerFormItem.batchId = this.batchId;
      this.handleSearch();
    })
  },
  methods: {
    handleSearch() {
      this.$refs.billManagerDatagrid.dataChange(1);
      this.$refs.quoteControlBatchDetail.getBatchInfo();
    }
  }
};
</script>

<style scoped>

</style>
