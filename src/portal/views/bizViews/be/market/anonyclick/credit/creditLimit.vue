<!--匿名点击-授信额度维护-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-select v-model="formItem.validFlag" :dictList="isList"
                               :label="$t('m.i.common.validFlag')" prop="validFlag"></common-select>
                <query-btn :advanceShow="false" formClassAdd="1" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/market/anonyclick/credit/creditLimit/func_queryCreditTradeBatchPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="creditLimitAdd('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="creditLimitAdd('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="creditLimitOperate('sync')">{{$t("m.i.common.synch")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 新增修改弹窗 -->
    <credit-limit-add :creditLimitAddOrEditWin="creditLimitAddOrEditWin" :batchParams="batchParams"
                       @creditLimitAddOrEditWinClose="creditLimitAddOrEditWinClose"
                       ref="creditLimitAdd"></credit-limit-add>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditLimit",
    components: {
      CreditLimitAdd: () => import(/* webpackChunkName: "be/market/anonyclick/credit/creditLimitAdd" */`@/views/bizViews/be/market/anonyclick/credit/creditLimitAdd`)
    },
    data() {
      return {
        formItem: {
          validFlag: ""
        },
        columns: [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
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
            title: this.$t("m.i.common.headCpesBrchCode"),
            key: "headBrchCode",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.headCpesBrchName"),
            key: "headBrchName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.ownBrchCode"),
            key: "applBrchCode",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.ownBrchName"),
            key: "applBrchName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.validFlag"),
            key: "validFlag",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ValidFlag", params.row.validFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.status"),
            key: "status",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CreditSendStatus", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.result"),
            key: "errorMsg",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        isList: [],
        creditMajorList: [],
        tenorVarietiesList: [],
        creditLimitAddOrEditWin: false,
        batchParams: {}
      };
    },
    mounted() {
      this.getDictListByGroups("ValidFlag,CreditSendStatus,CreditOperStatus,CreditMajor,TenorCode").then(res => {
        this.isList = res.get("ValidFlag");
        this.creditMajorList = res.get("CreditMajor");
        this.tenorVarietiesList = res.get("TenorCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.transBrchTypes = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //新增、修改
      creditLimitAdd(str) {
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.creditId = this.currentSelectRow.id;
        } else {
          if (this.$refs.datagrid.total > 0) {
            this.$msgTip.info(this, { info: "批次已存在，请勿重复操作" });
            return;
          }
          this.batchParams.creditId = "";
        }
        this.assembleParams(str);
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.isList = this.isList;
        this.batchParams.creditMajorList = this.creditMajorList;
        this.batchParams.tenorVarietiesList = this.tenorVarietiesList;
        this.creditLimitAddOrEditWin = true;
      },
      //关闭新增、修改弹窗
      creditLimitAddOrEditWinClose() {
        this.creditLimitAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //同步
      creditLimitOperate(optType) {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          let title = "";
          let content = "";
          let url = "";
          if (optType === "sync") {
            title = "同步信息";
            content = "确定要同步吗？";
            url = "/be/market/anonyclick/credit/creditLimit/func_creditTradeAppl";
          }
          this.$hMsgBox.confirm({
            title: title,
            content: content,
            onOk: () => {
              this.handleOperate(url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      handleOperate(url) {
        post({ id: this.currentSelectRow.id }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
