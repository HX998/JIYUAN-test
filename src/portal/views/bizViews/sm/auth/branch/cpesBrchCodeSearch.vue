<template>
  <!--票交机构弹出框-->
  <h-msg-box v-model="tempBrchCodeWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :z-index='1010'>
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh">
          <h-input v-model="formItem.brchFullNameZh" :maxlength="125"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
          <h-input v-model="formItem.brchCode" :maxlength="9"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNo">
          <h-input v-model="formItem.transBrchBankNo" :maxlength="12"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.memberId')" prop="memberId" v-if="optType === '2'">
          <h-input v-model="formItem.memberId" :maxlength="6"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
          <h-input v-model="formItem.memberName" :maxlength="60"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate">
          <span class="h-more-input" @click="ifShowMore=!ifShowMore" v-if="optType === '2'">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                          :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      :url="datagridUrl"
      :bindForm="formItem"
      :onCurrentChange="onCurrentChange"
      :onCurrentChangeCancel="onCurrentChangeCancle"
      :onRowDbClick="doubleHandleClick"
      :autoLoad=false
      :has-select="false"
      :row-select="this.selectType === 'duoxuan'"
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
  import { on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "cpesBrchCodeSearch",
    data() {
      let columns = [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.brchCode"),
          key: "brchCode",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.brchFullNameZh"),
          key: "brchFullNameZh",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.transBrchBankNo"),
          key: "transBrchBankNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.common.memberId"),
          key: "memberId",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.common.memberName"),
          key: "memberName",
          hiddenCol: false,
          ellipsis: false
        }
      ];
      if (this.selectType === "duoxuan") {
        columns.splice(0, 0, {
          type: "selection",
          key: "duoxuan",
          width: 60,
          align: "center",
          hiddenCol: false
        });
      } else {
        columns.splice(0, 0, {
          title: " ",
          type: "radio",
          align: "center",
          width: 60,
          hiddenCol: false
        });
      }
      return {
        columns: columns,
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          transBrchBankNo: "",
          memberId: "",
          memberName: ""
        },
        datagridUrl: "/shcpe/cpes/branch/agencyInformation/func_queryBranchs",
        ifShowMore: false,
        currentSelectRow: null,
        currentSelectList: []
      };
    },
    props: {
      brchCodeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "查询票交机构"
      },
      //1-只查询当前会员下的票交机构，2-查询全部
      optType: {
        type: String,
        default: "1"
      },
      //选择框类型
      selectType: {
        type: String
      },
      showEnable: {
        type: Boolean,
        default() {
          return true;
        }
      },
      memberBankNo: "",
    },
    comments: {},
    watch: {
      brchCodeWin(val) {
        if (val === true) {
          this.datagridUrl = this.optType === "1" ? "/shcpe/cpes/branch/agencyInformation/func_queryBranchs" : "/cpes/branch/queryBranchList";
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.transBrchBankNo = this.memberBankNo;
            this.formItem.showEnable = this.showEnable;
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempBrchCodeWin: {
        get() {
          return this.brchCodeWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      doubleHandleClick(arr) {
        if (this.selectType !== "duoxuan") {
          this.currentSelectList = arr;
          this.$emit("brchCodeChange", this.currentSelectList);
        }
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("brchCodeWinClose", "");
      },
      submitForm() {
        if (this.selectType == "duoxuan") {
          this.currentSelectList = this.$refs.datagrid.selects;
          if (this.currentSelectList != null && this.currentSelectList.length !== 0) {
            this.$emit("brchCodeChange", this.currentSelectList);
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }
        } else {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.$emit("brchCodeChange", this.currentSelectRow);
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }
        }

      }
    }
  };
</script>

<style scoped>

</style>
