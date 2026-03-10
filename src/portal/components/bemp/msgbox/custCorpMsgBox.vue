<!-- 企业客户弹出框 -->
<template>
  <h-msg-box v-model="tempShowCustCorpWin" @on-close="handleClose" width="1000" class="h-form-table-layer">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search"
              v-if="!isBreakGroup">
        <common-input v-model="formItem.custNo" :label="$t('m.i.common.custNo')" prop="custNo"></common-input>
        <common-input v-model="formItem.custName" :label="$t('m.i.common.custName')" prop="custName"></common-input>
        <org-code v-model="formItem.orgCode"></org-code>
        <common-select v-model="formItem.isGroupCus" :dictList="isList" :label="$t('m.i.common.isGroupCus')"
                       prop="isGroupCus" v-if="!custCorpParams.isMainGroupCus"></common-select>
        <query-btn @showChange="showChange" :formSearch="formSearch" :advanceShow="!custCorpParams.isMainGroupCus"
                   :formSearchReset="formSearchReset"></query-btn>
      </h-form>
    </div>
    <h-datagrid
      :columns="columns"
      :url="datagridUrl"
      :bindForm="formItem"
      highlight-row
      :auto-load="false"
      :row-select="this.selectType === 'check'"
      :onCurrentChange="onCurrentChange"
      :onCurrentChangeCancel="onCurrentChangeCancel"
      :onRowDbClick="doubleHandleClick"
      ref="datagrid">
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{this.isBreakGroup ? $t("m.i.bm.relieve") :
        $t("m.i.common.commit")}}
      </h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "custCorpMsgBox",
    data() {
      return {
        formItem: {
          custNo: "",
          custName: "",
          orgCode: "",
          isGroupCus: "",
          activeFlag: "1",
          licenseFlag: ""
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
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.orgCode"),
            key: "orgCode",
            hiddenCol: false
          }
        ],
        dictMap: new Map(),
        currentSelectRow: null,
        isList: [],
        ifShowMore: false,
        //该集团总部下，是否所有集团关系都已解除
        isRemoveAll: ""
      };
    },
    props: {
      title: {
        type: String,
        default: "查询客户信息"
      },
      showCustCorpWin: {
        type: Boolean,
        default: false
      },
      selectType: { //选择框类型，默认为单选，radio-单选，check-复选
        type: String,
        default: "radio"
      },
      licenseFlag: {//查询机构是否授权此菜单
        type: Boolean,
        default: false
      },
      isBreakGroup: {//是否为解除集团总部下客户集团关系
        type: Boolean,
        default: false
      },
      datagridUrl: {//表单数据查询接口
        type: String,
        default() {
          return this.isBreakGroup ? "/bm/cust/corp/showCustCorp/func_pageQueryCustCorpByMainCustNo" : this.licenseFlag ? "/bm/cust/corp/pageQueryLicenseCustCorpList" : "/bm/cust/corp/pageQueryCustCorpList";
        }
      },
      custCorpParams: {//查询企业客户需额外添加的条件
        type: Object,
        default() {
          return {};
        }
      },
      isQueryCustAcct: {//是否需要根据客户号查询客户账户
        type: Boolean,
        default: false
      },
      custAcctQueryUrl: {//根据客户号查询客户账户接口
        type: String,
        default: "/bm/cust/acct/pageQueryCustAcctList"
      },
      custAcctParams: {//查询企业客户账号需额外添加的条件
        type: Object,
        default() {
          return { isOtherBankAcct: "0" };
        }
      },
      isSelectRequired: {//点击确定按钮时是否必选
        type: Boolean,
        default: true
      },
      breakGroupUrl: {//解除集团总部下客户集团关系接口
        type: String,
        default: "/bm/cust/corp/showCustCorp/func_breakGroupCustCorp"
      },
      breakGroupParams: {//解除集团总部下客户集团关系参数
        type: Object
      }
    },
    computed: {
      tempShowCustCorpWin: {
        get() {
          return this.showCustCorpWin;
        },
        set() {
        }
      }
    },
    watch: {
      showCustCorpWin(val) {
        if (val) {
          this.$nextTick(() => {
            if (!this.isBreakGroup) {
              this.formSearchReset();
            }
            this.initFormItem();
            this.formSearch();
          });
        } else {
          this.currentSelectRow = null;
          if (!this.isBreakGroup) {
            this.formSearchReset();
          }
        }
      }
    },
    methods: {
      initFormItem() {
        this.formItem.licenseFlag = this.licenseFlag.toString();
        for (let obj in this.custCorpParams) {
          if (this.custCorpParams.hasOwnProperty(obj)) {
            this.formItem[obj] = this.custCorpParams[obj];
          }
        }
      },
      handleClose() {
        this.currentSelectRow = null;
        for (let obj in this.custCorpParams) {
          if (this.custCorpParams.hasOwnProperty(obj)) {
            delete this.formItem[obj];
          }
        }
        this.$emit("custCorpWinClose", this.isRemoveAll);
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      formSearch(pageNo = 1, isInitFormItem) {
        this.currentSelectRow = null;
        if (isInitFormItem) {
          this.initFormItem();
        }
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
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
          if (this.isQueryCustAcct) {
            this.getCustAcctList(this.currentSelectRow.custNo);
          } else {
            this.$emit("custCorpChange", this.currentSelectRow);
          }
        }
      },
      submitForm() {
        if (this.selectType === "check") {
          if (this.isSelectRequired && (this.$refs.datagrid.selects == null || this.$refs.datagrid.selects.length === 0)) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$emit("custCorpChange", this.$refs.datagrid.selects);
        } else {
          if (this.isSelectRequired && this.currentSelectRow == null) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          if (this.isBreakGroup) {
            this.breakGroupConfirm();
            return;
          }
          if (this.isSelectRequired && this.isQueryCustAcct) {
            this.getCustAcctList(this.currentSelectRow.custNo);
          } else {
            this.$emit("custCorpChange", this.currentSelectRow);
          }
        }
      },
      //解除集团关系
      breakGroupConfirm() {
        if (this.currentSelectRow.isMainGroupCus.toString() === "1") {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "检测到该客户为集团总部。若解除集团关系，则总部下所有集团的集团关系都会解除。是否要解除？",
            onOk: () => {
              this.isRemoveAll = "1";
              this.breakGroup();
            }
          });
        } else {
          this.breakGroup();
        }
      },
      breakGroup() {
        let params = Object.keys(this.breakGroupParams).length > 0 ? this.breakGroupParams : {
          isGroupCus: "0",
          id: this.currentSelectRow.id
        };
        post(params, this.breakGroupUrl).then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = null;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              if (this.isRemoveAll === "1") {
                this.isRemoveAll = "";
              }
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            if (this.isRemoveAll === "1") {
              this.isRemoveAll = "";
            }
          }
        });
      },
      // 根据客户号查询客户账户，若仅有一条账户，则直接反显账户
      getCustAcctList(custNo, callback) {
        post(Object.assign({ custNo: custNo }, this.custAcctParams), this.custAcctQueryUrl).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let list = res.data.retData.list;
                let currentSelectRow = this.currentSelectRow == null ? {} : this.currentSelectRow;
                if (list.length === 1) {
                  currentSelectRow.custAcctNo = list[0].custAcctNo;
                  currentSelectRow.openBankNo = list[0].openBankNo;
                  currentSelectRow.openBrchNo = list[0].openBrchNo;
                }
                if (callback) {
                  callback(currentSelectRow);
                } else {
                  this.$emit("custCorpChange", currentSelectRow);
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      }
    },
    mounted() {
      this.getDictListByGroups("Yon").then(res => {
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
