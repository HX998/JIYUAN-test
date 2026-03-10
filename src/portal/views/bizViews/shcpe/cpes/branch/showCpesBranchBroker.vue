<template>
  <h-msg-box v-model="tempShowCpesBranch" width="1000" @on-close="handleClose" class="h-form-table-layer"
             :maximize="true" :zIndex="1003" top="45">
    <p slot="header">
      <span>查询机构名称</span>
    </p>
    <div>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <common-input v-model="formItem.brchNum" :label="$t('m.i.common.brchNum')" prop="brchNum" :maxlength="21"></common-input>
          <common-input v-model="formItem.brchCode" :label="$t('m.i.common.brchCode')" prop="brchCode" :maxlength="9"></common-input>
          <common-input v-model="formItem.brchFullNameZh" :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh" :maxlength="60"></common-input>
          <common-input v-model="formItem.transBrchBankNo" :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNo" :maxlength="12"></common-input>
          <common-input v-model="formItem.memberName" :label="$t('m.i.common.memberName')" v-if="showMemberId" prop="memberName" :maxlength="60"></common-input>
          <common-input v-model="formItem.memberId" :label="$t('m.i.common.memberId')" v-if="showMemberId" prop="memberId" :maxlength="6"></common-input>
          <query-btn :advanceShow="true" @showChange="showChange" :formSearch="formSearch" :formSearchReset="formSearchReset"></query-btn>
        </h-form>
      </div>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="columns"
          highlight-row
          url="/cpes/branch/queryBranchList"
          :bindForm="formItem"
          :onCurrentChangeCancel="onCurrentChangeCancel"
          :onCurrentChange="onCurrentChange"
          :onRowDbClick="doubleHandleClick"
          :auto-load="false"
          ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "showCpesBranch",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          brchNum:"",
          transBrchBankNo: "",
          memberName: "",
          memberId: "",
          brchType: "",
          showEnableStr: "",
        },
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        dictMap: new Map(),
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.brchNum"),
            key: "brchNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "brchFullNameZh",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.transBrchBankNo"),
            key: "transBrchBankNo",
            hiddenCol: false
          },
        ],
        tableRef: "selfTable",
        currentSelectRow: null,
        ifShowMore: false,
        id: null
      };
    },
    props: {
      memberId: String,
      brchType: String,
      showMemberId: {
        type: Boolean,
        default() {
          return true;
        }
      },
      showCpesBranch: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showEnable: {
        type: Boolean,
        default() {
          return true;
        }
      }
    },
    computed: {
      tempShowCpesBranch: {
        get() {
          return this.showCpesBranch;
        },
        set() {
        }
      }
    },
    watch: {
      tempShowCpesBranch(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.memberId = this.memberId;
            this.formItem.brchType = this.brchType;
            if(!this.showEnable){
              this.formItem.showEnableStr = "0";
            }else{
              this.formItem.showEnableStr = "1";
            }
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //确定
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("showCpesBranchSubmit", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }

      },
      //关闭
      handleClose() {
        this.$emit("showCpesBranchClose", "");
      },
      onCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      onCurrentChange(arr, selectInx) {
        this.currentSelectRow = arr;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("showCpesBranchSubmit", this.currentSelectRow);
      }
    },
    mounted() {
      this.getDictListByGroups("Province,BrchType").then(res => {
        this.dictMap = res.get("map");
      });
    },
  };
</script>

<style scoped>

</style>
