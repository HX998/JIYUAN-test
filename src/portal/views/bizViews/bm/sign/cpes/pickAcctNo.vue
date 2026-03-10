<template>
  <h-msg-box v-model="tempPickAcctNoWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
             width="1000" class="h-form-table-layer" @on-maximize="onMaximize">
    <p slot="header">
      <span>账户信息查询</span>
    </p>
    <!--弹出框内容-->
    <div>
      <!--数据展示表格-->
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <common-input v-model="formItem.custAcctNo" :label="$t('m.i.bm.custAcctNo')" prop="custAcctNo"
                      :maxlength="32" ></common-input>
        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <h-datagrid
      :columns="columns"
      highlightRow
      url="/bm/cpes/custsign/custCorpSign/func_queryPickCustAcctInfoByPage"
      :bindForm="formItem"
      :auto-load="false"
      rowSelect
      :hasSelect="false"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>

  </h-msg-box>
</template>

<script>
export default {
  name: "pickAcctNo",
  data(){
    return {
      formItem : {
        custAcctNo: "",
        custNo:"",
        custId:"",
        acctNo:"",
        custRgstStatus:"0",
      },
      columns : [
        {
          type: "selection",
          width: 50,
          hiddenCol: false,
          align: "center"
        },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center"
        },
        {
          title: this.$t("m.i.common.custNo"),
          key: "custNo",
          hiddenCol: false,
          ellipsis: false,
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          hiddenCol: false,
          ellipsis: false,
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          hiddenCol: false,
          ellipsis: false,
        },
        {
          title: this.$t("m.i.common.cpesAcctType"),
          key: "cpesAcctType",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "CpesAcctType", params.row.cpesAcctType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.common.custAcctKind"),
          key: "custAcctKind",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "custAcctKind", params.row.custAcctKind);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.common.openBrchName"),
          key: "openBrchName",
          hiddenCol: false,
          ellipsis: false,
        },
        {
          title: this.$t("m.i.common.openBrchNo"),
          key: "openBrchNo",
          hiddenCol: false,
          ellipsis: false,
        },
        {
          title: this.$t("m.i.common.custOpenBankNo"),
          key: "openBankNo",
          hiddenCol: false,
          ellipsis: false,
        },
      ],
    }
  },
  props: {
    pickAcctNoWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    custCorpParams: {
      type: Object,
      default: {}
    },
    dictMap: { //MemberType, CreditRating
      type: Map,
      required: true
    },
  },
  watch: {
    pickAcctNoWin(val) {
      if (val) {
        this.formItem.custId = this.custCorpParams.custId;
        this.formItem.custNo = this.custCorpParams.custNo;
        this.$nextTick(() => {
          this.handleSearch();
        });
      }
    }
  },
  computed: {
    tempPickAcctNoWin: {
      get() {
        return this.pickAcctNoWin;
      },
      set() {
      }
    }
  },
  methods: {
    handleSearch() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.dataChange(1);
    },
    handleClose() {
      this.formSearchReset();
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$emit("pickAcctNoWinClose", "");
    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
    },

    submitForm() {
      let list = this.$refs.datagrid.selectIds;
      if (list && list.length > 0) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("pickAcctNoWinSubmit", list);
        this.formItem.custAcctNo = "";
        this.$refs.formItem.resetFields();
        this.$refs.datagrid.dataChange(1);
      }else {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
      }
    },
  }
}
</script>

<style scoped>

</style>
