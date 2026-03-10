<template>
  <h-msg-box v-model="tempShowBankCustAcctWin" width="1000" class="h-form-table-layer" :maximize="true"
             @on-close="handleClose" :z-index="1002">
    <p slot="header">
      <span>同业账号选择</span>
    </p>
    <div>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="80" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.bm.isOtherBank')" prop="isOtherBank">
            <h-select v-model="formItem.isOtherBank" placeholder="">
              <h-option value="1">他行账号</h-option>
              <h-option value="0">本行账号</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.bailAcctType')" prop="bailAcctType">
            <h-select v-model="formItem.bailAcctType" placeholder="">
              <h-option v-for="item in custAcctKindList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.acctNo')" prop="acctNo">
            <h-input v-model="formItem.acctNo"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.acctName')" prop="acctName">
            <h-input v-model="formItem.acctName"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.openBankNo')" prop="openBankNo">
            <h-input v-model="formItem.openBankNo"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.openBankName')" prop="openBankName">
            <h-input v-model="formItem.openBankName"></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
              <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                              :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
    </div>
    <h-datagrid
        :columns="columns"
        highlight-row
        :autoLoad="false"
        :onCurrentChange="handleCurrentChange"
        :onCurrentChangeCancel="handleCurrentChangeCancel"
        :onRowDbClick="doubleHandleClick"
        url="/bm/cust/bankcustacct/pageQueryBankCustAcctList"
        :bindForm="formItem"
        ref="datagrid">
    </h-datagrid>

    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "showBankCustAcct",
    data() {
      let columns = [
        {
          title: " ",
          type: "radio",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          key: "xuhao",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchCode'),
          key: "openBrchCode",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "openBrchName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.isOtherBank'),
          key: "isOtherBank",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getIsOtherBank(params.row.isOtherBank));
          }
        },
        {
          title: this.$t('m.i.common.acctNo'),
          key: "acctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.acctName'),
          key: "acctName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankName'),
          key: "openBankName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bailAcctType'),
          key: "bailAcctType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", this.getDictValueFromMap(this.dictMap, "custAcctKind", params.row.bailAcctType));
          }
        },
        {
          title: this.$t('m.i.common.acctFuncNo'),
          key: "acctFuncNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchNo'),
          key: "createBrchNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchName'),
          key: "createBrchName",
          ellipsis: false,
          hiddenCol: false
        }
      ];
      let formItem = {
        isOtherBank: "",
        bailAcctType: "",
        acctNo: "",
        acctName: "",
        openBankNo: "",
        openBankName: ""
      };

      function getIsOtherBank(value) {
        if (value != null && value != "") {
          switch (value) {
            case "1":
              return "他行账号";
            case "0":
              return "本行账号";
          }
        } else {
          return "";
        }
      }

      return {
        columns: columns,
        formItem: formItem,
        brchType: "",
        ifShowMore: false,
        showCpesBranchWin: false,
        currentSelectRow: [],
        custAcctKindList: []
      };
    },
    props: {
      showBankCustAcctWin: {
        type: Boolean,
        default: false
      },
      rcvBranchCode: "",
      accountType: ""
    },
    watch: {
      showBankCustAcctWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.formItem.openBrchCode = this.rcvBranchCode;
            this.formItem.accountType = this.accountType;
            this.formItem.flowStatus = "FS08";
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempShowBankCustAcctWin: {
        get() {
          return this.showBankCustAcctWin;
        },
        set() {
        }
      }
    },
    mounted() {
      this.getDictListByGroups("custAcctKind").then(res => {
        this.custAcctKindList = res.get("custAcctKind");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("getBankCustAcct", this.currentSelectRow);
      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("getBankCustAcct", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleClose() {
        this.$refs.formItem.resetFields();
        this.$emit("showBankCustAcctWinClose", "");
      },
      formSearch() {
        this.selectReset();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.openBrchNo = "";
        this.formItem.openBrchCode = "";
        this.$refs.formItem.resetFields();
        this.formItem.openBrchCode = this.rcvBranchCode;
        this.formItem.accountType = this.accountType;
        this.formItem.flowStatus = "FS08";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      selectReset() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      }
    }
  };
</script>

<style scoped>

</style>
