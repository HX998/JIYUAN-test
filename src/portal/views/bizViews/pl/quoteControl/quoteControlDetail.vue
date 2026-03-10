<!--额度批复-票据池额度批复明细-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="billManagerVue">
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
            <div slot="toolbar" class="pull-left">
              <h-button type="ghost" @click="returnMain">{{ $t("m.i.pl.return") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
import {accMul, formatNumber, off, on, post} from "@/api/bizApi/commonUtil";

export default {
  name: "quoteControlDetail",
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
      {
        title: this.$t("m.i.pc.usedCreditAmt"),
        key: "usedCreditAmt",
        hiddenCol: false,
        ellipsis: false,
        sortable: true,
        render: (h, params) => {
          if (params.row.usedCreditAmt === "" || params.row.usedCreditAmt === null) {
            return h("span", "");
          }
          let money = formatNumber(params.row.usedCreditAmt, 2, ",");
          return h("span", {
            domProps: {
              title: money
            }
          }, money);
        }
      },
      {
        title: this.$t("m.i.pc.doAmt"),
        key: "doAmt",
        hiddenCol: false,
        ellipsis: false,
        sortable: true,
        render: (h, params) => {
          if (params.row.doAmt === "" || params.row.doAmt === null) {
            return h("span", "");
          }
          let money = formatNumber(params.row.doAmt, 2, ",");
          return h("span", {
            domProps: {
              title: money
            }
          }, money);
        }
      },
    ];
    return {
      dictMap: new Map(),
      columns: columns,
      cloneColumns: this.deepClone(columns),
      billManagerFormItem: {
        batchId: "",
      },
      optType: "",
    };
  },
  props: {
    billManagerVue: {
      type: Boolean,
      default() {
        return false;
      }
    },
    quoteControlDetailParams: {
      type: Object,
      default: {
        batchId: '',
        operType: ''
      }
    }
  },
  components: {},
  watch: {
    billManagerVue(val) {
      if (val) {
        this.getDictListByGroups("partnerType").then(res => {
          this.dictMap = res.get("map");
        });

        this.billManagerFormItem.batchId = this.quoteControlDetailParams.batchId;
        this.$nextTick(() => {
          if (this.quoteControlDetailParams.operType === 'control') {
            this.cloneColumns.forEach((value, index) => {
              if (value.key === 'usedCreditAmt' || value.key === 'doAmt') {
                value.hiddenCol = true;
              }
            });
            this.columns = this.deepClone(this.cloneColumns);
            this.$refs.billManagerDatagrid.createShowCol(this.columns);
          }
          this.handleSearch();
        });

      }
    }
  },
  methods: {
    handleSearch() {
      this.$refs.billManagerDatagrid.dataChange(1);
      this.$refs.quoteControlBatchDetail.getBatchInfo();
    },
    //返回主页面
    returnMain() {
      this.$emit("returnMain", "");
    }
  }
};
</script>

<style scoped>

</style>
