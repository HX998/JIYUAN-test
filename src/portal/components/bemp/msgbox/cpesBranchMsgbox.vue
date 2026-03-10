<!--票交机构弹出框-->
<template>
  <h-msg-box v-model="tempShowCpesBranchWin" width="1000" :mask-closable="false" top="10" class="h-form-table-layer"
             @on-close="handleClose" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <common-input v-model="formItem.brchFullNameZh" :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh"
                      :maxlength="60"></common-input>
        <common-input v-model="formItem.brchCode" :label="$t('m.i.common.brchCode')" prop="brchCode"
                      :maxlength="9"></common-input>
        <common-input v-model="formItem.transBrchBankNo" :label="$t('m.i.common.transBrchBankNo')"
                      prop="transBrchBankNo" :maxlength="12"></common-input>
        <common-input v-model="formItem.memberName" :label="$t('m.i.common.memberName')" prop="memberName"
                      :maxlength="60" :readonly="!!cpesBrchParams.memberName"></common-input>
        <common-input v-model="formItem.memberId" :label="$t('m.i.common.memberId')" prop="memberId"
                      :maxlength="60" :readonly="!!cpesBrchParams.memberId"></common-input>
        <query-btn @showChange="ifShowMore=!ifShowMore" :formSearch="formSearch"
                   :formSearchReset="formSearchReset"></query-btn>
      </h-form>
    </div>
    <h-datagrid
      :columns="columns"
      :url="datagridUrl"
      :bindForm="formItem"
      highlight-row
      :auto-load="false"
      :onCurrentChange="onCurrentChange"
      :onCurrentChangeCancel="onCurrentChangeCancel"
      :onRowDbClick="doubleHandleClick"
      :has-select="this.selectType === 'radio'"
      :row-select="this.selectType === 'check'"
      ref="datagrid">
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  export default {
    name: "cpesBranchMsgbox",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          transBrchBankNo: "",
          memberName: "",
          memberId: "",
          showEnableStr: ""
        },
        columns: [
          {
            title: this.selectType === "radio" ? " " : null,
            type: this.selectType === "radio" ? "radio" : "selection",
            align: "center",
            width: 60
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.transBrchBankNo"),
            key: "transBrchBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "brchFullNameZh",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchType"),
            key: "brchType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BrchType", params.row.brchType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.bankProv"),
            key: "transProvinceCode",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Province", params.row.transProvinceCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.brchStatus"),
            key: "brchStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", params.row.brchStatus === "ST01" ? "活动" : params.row.brchStatus === "ST02" ? "禁用" : "")
              ]);
            }
          }
        ],
        dictMap: new Map(),
        currentSelectRow: null,
        ifShowMore: false
      };
    },
    props: {
      title: {//弹窗标题
        type: String,
        default: "票交机构查询"
      },
      showCpesBranchWin: {//控制弹窗显隐
        type: Boolean,
        default: false
      },
      datagridUrl: {//表单数据查询接口，默认只查询当前会员下的票交机构
        // 1-只查询当前会员下的票交机构  /shcpe/cpes/branch/agencyInformation/func_queryBranchs，2-查询全部 /cpes/branch/queryBranchList
        type: String,
        default: "/shcpe/cpes/branch/agencyInformation/func_queryBranchs"
      },
      selectType: { //选择框类型，默认为单选，radio-单选，check-复选
        type: String,
        default: "radio"
      },
      showEnable: {//是否查询可用机构
        type: Boolean,
        default: true
      },
      cpesBrchParams: {//查询票交机构需额外添加的条件
        type: Object,
        default() {
          return {}
        }
      },
      isSelectRequired: {//点击确定按钮时是否必选
        type: Boolean,
        default() {
          return true;
        }
      }
    },
    computed: {
      tempShowCpesBranchWin: {
        get() {
          return this.showCpesBranchWin;
        },
        set() {
        }
      }
    },
    watch: {
      showCpesBranchWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            for (let obj in this.cpesBrchParams) {
              if (this.cpesBrchParams.hasOwnProperty(obj)) {
                this.formItem[obj] = this.cpesBrchParams[obj];
              }
            }
            this.formItem.showEnableStr = this.showEnable ? "1" : "0";
            this.formSearch();
          });
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit("cpesBranchWinClose", "");
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        // 入参为true，不能对readonly字段清空
        this.$refs.formItem.resetFields(true);
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      doubleHandleClick(arr) {
        if (this.selectType === "radio") {
          this.currentSelectRow = arr;
          this.$emit("cpesBranchChange", arr);
        }
      },
      submitForm() {
        if (this.selectType === "check") {
          if (this.isSelectRequired && (this.$refs.datagrid.selects == null || this.$refs.datagrid.selects.length === 0)) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$emit("cpesBranchChange", this.$refs.datagrid.selects);
        } else {
          if (this.isSelectRequired && this.currentSelectRow == null) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$emit("cpesBranchChange", this.currentSelectRow);
        }
      }
    },
    mounted() {
      this.getDictListByGroups("Province,BrchType").then(res => {
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
