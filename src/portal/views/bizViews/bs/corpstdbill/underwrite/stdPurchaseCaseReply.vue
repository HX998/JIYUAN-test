<!--簿记管理-认购函登记-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--标票产品名称-->
                <h-form-item :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike">
                  <h-input v-model="formItem.stdProductNameLike" placeholder="" icon="android-search"
                           @on-click="queryProductName" :maxlength="60" lengthByByte></h-input>
                </h-form-item>
                <!--机构名称-->
                <common-input v-model="formItem.investBrchNameLike" :label="$t('m.i.common.brchName')"
                              prop="investBrchNameLike" :maxlength="150"></common-input>
                <query-btn :advanceShow="false" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/corpstdbill/underwrite/stdPurchaseCaseReply/func_queryStdPurchaseCaseBatchPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="stdPurchaseCaseBatchPass()">
                {{$t("m.i.common.pass")}}
              </h-button>
              <h-button type="primary" @click="stdPurchaseCaseBatchBack()">
                {{$t("m.i.common.back")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <std-purchase-case-batch-detail :stdPurchaseCaseBatchDetailWin="stdPurchaseCaseBatchDetailWin"
                                    :batchParams="batchParams"
                                    :dictMap="dictMap"
                                    @stdPurchaseCaseBatchDetailClose="stdPurchaseCaseBatchDetailClose"
                                    ref="stdPurchaseCaseBatchDetail"></std-purchase-case-batch-detail>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>


  </div>
</template>

<script>
  import {post, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdPurchaseCaseReply",
    components: {
      StdPurchaseCaseBatchDetail: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdPurchaseCaseBatchDetail" */`@/views/bizViews/bs/corpstdbill/underwrite/stdPurchaseCaseBatchDetail`),
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      return {
        formItem: {
          stdProductNo: "",
          stdProductNameLike: "",
          investBrchNameLike: "",
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
            title: this.$t('m.i.bs.stdProductName'),
            key: 'stdProductName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.stdProductShortName'),
            key: 'stdProductShortName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "investBrchName",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.stdPurchaseCaseBatchDetailOpen(params.row.id)
                  }
                }
              }, params.row.investBrchName)
            }
          },

        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        stdPurchaseCaseBatchDetailWin: false,
        batchParams: {},
        batchId: "",
      };
    },
    mounted() {
      this.getDictListByGroups("StdBookKeepingFlowStatus,StdPurchaseCaseBatchStatus,StdPurchaseCaseFlowStatus").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.stdProductNo = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      // 根据弹框所选数据进行赋值
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, {info: "请先选择记录！"});
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        this.showCpesProductBranch = false;
      },
      // 认购函通过
      stdPurchaseCaseBatchPass() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "通过信息",
            content: "确定要通过吗？",
            onOk: () => {
              let params = {id: this.currentSelectRow.id};
              let url = "/bs/corpstdbill/underwrite/stdPurchaseCaseReply/func_agreeStdPurchaseCase";
              this.sendPost(params, url);
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
      // 认购函驳回
      stdPurchaseCaseBatchBack() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "驳回信息",
            content: "确定要驳回申请吗？",
            onOk: () => {
              let params = {id: this.currentSelectRow.id};
              let url = "/bs/corpstdbill/underwrite/stdPurchaseCaseReply/func_refuseStdPurchaseCase";
              this.sendPost(params, url);
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },

      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      stdPurchaseCaseBatchDetailOpen(id) {
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.batchUrl = "/bs/corpstdbill/underwrite/stdPurchaseCaseReply/func_findStdPurchaseCaseBatchById";
        this.batchParams.dataGridUrl = "/bs/corpstdbill/underwrite/stdPurchaseCaseReply/func_queryStdPurchaseCaseDetailPage";
        this.stdPurchaseCaseBatchDetailWin = true;
      },
      stdPurchaseCaseBatchDetailClose() {
        this.stdPurchaseCaseBatchDetailWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      }
    }
  };
</script>

<style scoped>

</style>
