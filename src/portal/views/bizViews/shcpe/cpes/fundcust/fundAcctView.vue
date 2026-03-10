<template>
  <h-msg-box v-model="tempFundAcctView" @on-close="handleClose" width="1000"
             class="h-form-table-layer" :maximize="true">
    <p slot="header">
      <span>查询资金账户</span>
    </p>
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <!--<h-form-item :label="$t('m.i.common.brchName')" prop="branchName">
          <h-input v-model="formItem.brchCode" v-show="false"></h-input>
          <h-input v-model="formItem.branchName" placeholder="" readonly :title="formItem.branchName"
                   icon="android-search" @on-click="queryBranchCode()"></h-input>
        </h-form-item>-->
        <show-cpes-branch :label="$t('m.i.common.brchName')"
                          :brchCode.sync="formItem.brchCode"  :cpesBrchName.sync="formItem.branchName"
                          datagridUrl="/cpes/branch/queryBranchList" prop="branchName"
                          queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

        <h-form-item label="资金账户账号" prop="cpesAcctNo">
          <h-input v-model="formItem.cpesAcctNo" placeholder="" :maxlength="50"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
        <h-datagrid
          :columns="columns"
          highlight-row
          url="/fundCust/fundCustInfo/queryFundAcctInfo"
          :bindForm="formItem"
          :onRowClick="handleRowClick"
          ref="datagrid">
        </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
    <!--<show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>-->
  </h-msg-box>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "fundAcctView",
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    props: {
      fundAcctView: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempFundAcctView: {
        get() {
          return this.fundAcctView;
        },
        set() {
        }
      }
    },
    mounted() {
      getDictListByGroups("AcctStatus,AcctOpType").then(res => {
        this.dictMap = res.get("map");
      });
    },
    watch: {
      tempFundAcctView(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },

    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.memberId'),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchCode'),
            key: "brchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.cpesAcctNo"),
            key: "cpesAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.fundAcctName"),
            key: "fundAcctName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.balanceAmt"),
            key: "balanceAmt",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.acctAvailableAmt"),
            key: "acctAvailableAmt",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.accountStatus"),
            key: "accountStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "AcctStatus", params.row.accountStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.acctOperMark"),
            key: "acctOperMark",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "AcctOpType", params.row.acctOperMark);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        formItem: {
          brchCode: "",
          cpesAcctNo: "",
          branchName: ""
        },

        tableRef: "selfTable",
        //showCpesBranch: false,
        showBranchWin: false,
        currentSelectRow: [],
        dictMap: []
      };
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.brchCode="";
        this.formItem.branchName="";
      },
      handleRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      //确定
      submitForm() {
        this.$emit("fundAcctViewSubmit", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.formItem.brchCode="";
        this.formItem.branchName="";
        this.$emit("fundAcctViewClose", "");
      },
      /*queryBranchCode() {
        this.showCpesBranch = true;
      },*/
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.brchCode = info.brchCode;
        this.formItem.branchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      }*/
    }
  };
</script>

<style scoped>

</style>
