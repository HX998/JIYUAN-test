<!--簿记管理-簿记信息管理管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--产品规模(元)-->
                <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationAmt')" :integerNum="16"
                                         :suffixNum="2"
                                         :validRules="creationAmtRule" :rangeProps="['minCreationAmt','maxCreationAmt']"
                                         :bigTips="false"></common-type-field-range>
                <!--标票产品名称-->
                <h-form-item :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike">
                  <h-input v-model="formItem.stdProductNameLike" placeholder="" icon="android-search"
                           @on-click="queryProductName" :maxlength="60" lengthByByte></h-input>
                </h-form-item>
                <!--认购日期-->
                <common-date-picker v-model="purchaseDate" :label="$t('m.i.bs.purchaseDt')" type="daterange"
                                    :autoPlacement="true" @on-change="handlePurchaseDateChange"></common-date-picker>
                <!--是否已提交-->
                <h-form-item :label="this.$t('m.i.be.isCommit')" prop="isCommit" cols="2">
                  <h-radio-group v-model="formItem.isCommit">
                    <h-radio label="0" @on-click="noCommitButton">
                      <span>未提交</span>
                    </h-radio>
                    <h-radio label="1" @on-click="hasCommitButton">
                      <span>已提交</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/corpstdbill/underwrite/stdBookKeepingApply/func_queryStdBookKeepingPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="stdBookKeepingOperate('add')" :disabled="hasCommit">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="stdBookKeepingOperate('modify')" :disabled="hasCommit">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="stdBookKeepingDelete()" :disabled="hasCommit">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="stdBookKeepingCancel()" :disabled="noCommit">
                {{$t("m.i.common.revoke")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 新增修改弹窗 -->
    <std-book-keeping-add :stdBookKeepingAddOrEditWin="stdBookKeepingAddOrEditWin" :batchParams="batchParams"
                          :dictMap="dictMap"
                          @stdBookKeepingAddOrEditWinClose="stdBookKeepingAddOrEditWinClose"
                          ref="stdBookKeepingAdd"></std-book-keeping-add>
    <std-book-keeping-detail :stdBookKeepingDetailWin="stdBookKeepingDetailWin" :batchParams="batchParams"
                          :dictMap="dictMap"
                          @stdBookKeepingDetailClose="stdBookKeepingDetailClose"
                          ref="stdBookKeepingDetail"></std-book-keeping-detail>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false"  :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>


  </div>
</template>

<script>
  import {post, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdBookKeepingApply",
    components: {
      StdBookKeepingAdd: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdBookKeepingAdd" */`@/views/bizViews/bs/corpstdbill/underwrite/stdBookKeepingAdd`),
      StdBookKeepingDetail: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdBookKeepingDetail" */`@/views/bizViews/bs/corpstdbill/underwrite/stdBookKeepingDetail`),
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      return {
        creationAmtRule: [{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "产品规模(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        formItem: {
          minCreationAmt: "",
          maxCreationAmt: "",
          stdProductNo: "",
          stdProductNameLike: "",
          minPurchaseDt: "",
          maxPurchaseDt: "",
          isCommit: "0"
        },
        purchaseDate: [],
        hasCommit: false,
        noCommit: true,
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.stdBookKeepingDetailOpen(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
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
            title: this.$t("m.i.bs.creationAmt"),
            key: "creationAmt",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.creationAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.purchaseDt'),
            key: 'purchaseDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.purchaseDt ? this.$moment(params.row.purchaseDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        isList: [],
        priceMethodList: [],
        stdBookKeepingAddOrEditWin: false,
        stdBookKeepingDetailWin: false,
        batchParams: {},
        batchId: "",
      };
    },
    mounted() {
      this.getDictListByGroups("Yon,MemberType,PriceMethod,StdBookKeepingFlowStatus").then(res => {
        this.isList = res.get("Yon");
        this.priceMethodList = res.get("PriceMethod");
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
        this.purchaseDate = [];
        this.formItem.minPurchaseDt = "";
        this.formItem.maxPurchaseDt = "";
        this.formItem.stdProductNo = "";
        this.$refs.formItem.resetFields();
        this.noCommitButton();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handlePurchaseDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minPurchaseDt = arr[0].replace(/-/g, "");
          this.formItem.maxPurchaseDt = arr[1].replace(/-/g, "");
          this.purchaseDate = [arr[0], arr[1]];
        } else {
          this.formItem.minPurchaseDt = "";
          this.formItem.maxPurchaseDt = "";
          this.purchaseDate = [];
        }
      },
      //未提交
      noCommitButton() {
        this.noCommit = true;
        this.hasCommit = false;
        this.formItem.isCommit = '0';
        this.handleSearch();
      },
      //已提交
      hasCommitButton() {
        this.hasCommit = true;
        this.noCommit = false;
        this.formItem.isCommit = '1';
        this.handleSearch();
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
      //簿记新增/修改
      stdBookKeepingOperate(str) {
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
            return;
          }
          this.batchParams.batchId = this.currentSelectRow.id;
        } else {
          this.batchParams.batchId = "";
        }
        this.assembleParams(str);

      },
      assembleParams(optType){
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.isList = this.isList;
        this.batchParams.priceMethodList = this.priceMethodList;
        this.stdBookKeepingAddOrEditWin = true;
      },
      //簿记新增/修改关闭
      stdBookKeepingAddOrEditWinClose() {
        this.stdBookKeepingAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      // 簿记删除
      stdBookKeepingDelete() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "删除信息",
            content: "确定要删除吗？",
            onOk: () => {
              let params = {id: this.currentSelectRow.id};
              let url = "/bs/corpstdbill/underwrite/stdBookKeepingApply/func_deleteStdBookKeeping";
              this.sendPost(params, url);
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
      //簿记撤销
      stdBookKeepingCancel() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "撤销信息",
            content: "确定要撤销申请吗？",
            onOk: () => {
              let params = {id: this.currentSelectRow.id};
              let url = "/bs/corpstdbill/underwrite/stdBookKeepingApply/func_cancelStdBookKeeping";
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
      stdBookKeepingDetailOpen(id) {
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.stdBookKeepingDetailWin = true;
      },
      stdBookKeepingDetailClose() {
        this.stdBookKeepingDetailWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      }
    }
  };
</script>

<style scoped>

</style>
