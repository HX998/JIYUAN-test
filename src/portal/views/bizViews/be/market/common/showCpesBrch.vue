<!--点击成交-授信关系管理-挑选票交机构弹出框-->
<template>
  <h-msg-box v-model="tempBrchCodeWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :z-index='1010'>
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <common-input v-model="formItem.transMemberId" :label="$t('m.i.common.memberId')" prop="transMemberId"
                      :maxlength="6" ></common-input>
        <common-input v-model="formItem.transBrchCode" :label="$t('m.i.common.brchCode')" prop="transBrchCode"
                      :maxlength="9" ></common-input>
        <common-input v-model="formItem.transBrchName" :label="$t('m.i.common.brchFullNameZh')" prop="transBrchName"
                      :maxlength="125" ></common-input>
        <h-form-item class="h-form-operate">
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
      :row-select="this.selectType === 'check'"
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
    name: "showCpesBrch",
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
          title: this.$t("m.i.common.memberId"),
          key: "transMemberId",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.common.memberName"),
          key: "transMemberName",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.common.brchCode"),
          key: "transBrchCode",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.brchFullNameZh"),
          key: "transBrchName",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t("m.i.shcpe.transBrchClass"),
          key: "transBrchClass",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.shcpe.transBrchClassName"),
          key: "transBrchClassName",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "BrchClass", params.row.transBrchClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        }
      ];
      if (this.selectType === "check") {
        columns.splice(0, 0, {
          type: "selection",
          key: "check",
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
          transMemberId: "",
          transBrchCode: "",
          transBrchName: "",
          findBranchFlag: "",
          batchId: "",
          brchClassList: ""
        },
        ifShowMore: false,
        currentSelectRow: null,
        currentSelectList: [],
        dictMap: new Map()
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
      //1-全市场机构信息、2-我行机构信息、3-他行机构信息
      findBranchFlag: {
        type: String,
        default: "1"
      },
      //选择框类型
      selectType: {
        type: String,
        default: "check"
      },
      datagridUrl: {
        type: String,
        default: "/be/market/clickdeal/credit/creditManage/func_findPreCreditTradeMemberByPage"
      },
      cpesBrchParams: {
        type: Object,
        default: {
          batchId: "",
          transBrchTypes: ""
        }
      }
    },
    comments: {},
    watch: {
      brchCodeWin(val) {
        if (val === true) {
          this.getDictListByGroups("BrchClass").then(res => {
            this.dictMap = res.get("map");
          });
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.batchId = this.cpesBrchParams.batchId;
            this.formItem.brchClassList = this.cpesBrchParams.transBrchTypes;
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
      onCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle() {
        this.currentSelectRow = null;
      },
      doubleHandleClick(arr) {
        if (this.selectType !== "check") {
          this.currentSelectList = arr;
          this.$emit("brchCodeChange", this.currentSelectList);
        }
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("brchCodeWinClose", "");
      },
      submitForm() {
        if (this.selectType === "check") {
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
