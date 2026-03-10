<template>
  <h-msg-box v-model="tempBillListWin" :width="1000" :mask-closable="false"
             @on-close="handleClose"
             class="h-form-table-layer" :maximize="true">
    <p slot="header">
      <span>票据清单</span>
    </p>
    <h-form :model="formItem" :label-width="90" ref="formItem" :cols="3" class="h-form-search">
      <common-input v-model="formItem.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo"
                    :maxlength="30"></common-input>
      <query-btn :formSearch="handleSearch" :advanceShow="false"
                 :formSearchReset="resetSearch"></query-btn>
    </h-form>
    <div>
      <h-datagrid
        :columns="columns"
        highlightRow
        url="/pe/busiqry/payFlowOccurQuery/func_queryPaymentBillByPage"
        :bindForm="formItem"
        :auto-load="false"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="handleClose()">{{$t("m.i.common.goBack")}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <div slot="footer">
    </div>
    <bopp-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                         :billId="billId"></bopp-bill-info-main>
  </h-msg-box>
</template>

<script>
  import {formatNumber, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";
  export default {
    name: "billListQuery",
    data() {
      return {
        formItem: {
          payInfoId: "",
          billNo: "",
          legalNo: "",
        },
        columns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.id)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.stdAmt"),
            key: "stdAmt",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.stdAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let remitDt = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let remitDt = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false,
          },
        ],
        showBillInfoWin: false,
        billId: "",
      }
    },
    props: {
      billListWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      param: {
        type: Object,
        default() {
          return {
            payInfoId: ""
          };
        }
      },
      dictMap: {
        type: Map
      }

    },
    computed: {
      tempBillListWin: {
        get() {
          return this.billListWin;
        },
        set() {
        }
      }
    },
    watch: {
      billListWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.payInfoId = this.param.payInfoId;
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
    },
    methods: {
      handleClose() {
        this.$refs.formItem.resetFields();
        this.$emit("billListWinClose", "");
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      billInfoWinClose() {
        this.billId = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
    },
    created() {
      this.formItem.legalNo = this.$store.getters.userInfo.legalNo
    }
  }
</script>

<style scoped>

</style>
