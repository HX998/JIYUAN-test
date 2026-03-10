<!--簿记管理-簿记结果查询-->
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
                <!--产品规模(元)-->
                <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationAmt')" :integerNum="16"
                                         :suffixNum="2"
                                         :validRules="creationAmtRule" :rangeProps="['minCreationAmt','maxCreationAmt']"
                                         :bigTips="false"></common-type-field-range>
                <!--认购日期-->
                <common-date-picker v-model="purchaseDate" :label="$t('m.i.bs.purchaseDt')" type="daterange"
                                    :autoPlacement="true" @on-change="handlePurchaseDateChange"></common-date-picker>
                <!--认购结果-->
                <common-select v-model="formItem.purchaseResult" :label="$t('m.i.bs.purchaseResult')" prop="purchaseResult"
                               :dictList="purchaseResultList"></common-select>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/corpstdbill/underwrite/stdBookKeepingResultQry/func_queryStdBookKeepingPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <std-book-keeping-result-detail :stdBookKeepingResultDetailWin="stdBookKeepingResultDetailWin" :batchParams="batchParams"
                          :dictMap="dictMap"
                          @stdBookKeepingDetailClose="stdBookKeepingDetailClose"
                          ref="stdBookKeepingResultDetail"></std-book-keeping-result-detail>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>


  </div>
</template>

<script>
  import {post, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdBookKeepingResultQry",
    components: {
      StdBookKeepingAdd: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdBookKeepingAdd" */`@/views/bizViews/bs/corpstdbill/underwrite/stdBookKeepingAdd`),
      StdBookKeepingResultDetail: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdBookKeepingResultDetail" */`@/views/bizViews/bs/corpstdbill/underwrite/stdBookKeepingResultDetail`),
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
          },
          {
            title: this.$t('m.i.bs.purchaseResult'),
            key: 'purchaseResult',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PurchaseResult", params.row.purchaseResult);
              return h("span",
                {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
            }
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        isList: [],
        priceMethodList: [],
        stdBookKeepingAddOrEditWin: false,
        stdBookKeepingResultDetailWin: false,
        batchParams: {},
        batchId: "",
        purchaseResultList:[],
      };
    },
    mounted() {
      this.getDictListByGroups("Yon,MemberType,PriceMethod,PurchaseResult,StdBookKeepingFlowStatus,purchaseResultList").then(res => {
        this.isList = res.get("Yon");
        this.priceMethodList = res.get("PriceMethod");
        this.purchaseResultList = res.get("PurchaseResult");
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
        this.formItem.purchaseResult = "";
        this.$refs.formItem.resetFields();
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
      assembleParams(optType){
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.isList = this.isList;
        this.batchParams.priceMethodList = this.priceMethodList;
        this.batchParams.purchaseResultList = this.purchaseResultList;
        this.stdBookKeepingAddOrEditWin = true;
      },

      stdBookKeepingDetailOpen(id) {
        this.batchParams.bkId = id;
        this.batchParams.bookResultPage = "query";
        this.batchParams.dictMap = this.dictMap;
        this.stdBookKeepingResultDetailWin = true;
      },
      stdBookKeepingDetailClose() {
        this.stdBookKeepingResultDetailWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      }
    }
  };
</script>

<style scoped>

</style>
