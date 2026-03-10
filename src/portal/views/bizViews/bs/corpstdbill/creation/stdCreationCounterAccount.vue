<!--创设业务-费用收取-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--基础资产种类-->
                <common-select v-model="formItem.baseAssetType" :label="$t('m.i.bs.baseAssetType')" prop="baseAssetType"
                               :dictList="baseAssetTypeList"></common-select>
                <!--标票产品名称-->
                <common-input v-model="formItem.stdProductNameLike" :label="$t('m.i.bs.stdProductName')"
                              prop="stdProductNameLike"  :maxlength="60" :showIcon="true" @on-click="queryProductName" ></common-input>
                <!--电票账号-->
                <common-input v-model="formItem.ecdsAcctNo" :label="$t('m.i.bs.ecdsAcctNo')" :validRules="validAcctNoRules"
                              prop="ecdsAcctNo"  :maxlength="32"></common-input>
                <!--承销机构名称-->
                <common-input v-model="formItem.sellBrchName" :label="$t('m.i.bs.sellBrchName')"
                              prop="sellBrchName" :maxlength="150"></common-input>
                <!--产品规模（元）-->
                <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationAmt')" :integerNum="12" :suffixNum="2":validRules="creationAmtRule"
                                         :rangeProps="['minCreationAmt','maxCreationAmt']" :bigTips="false"></common-type-field-range>
                <!--认购日期-->
                <common-date-picker v-model="purchaseDt" :label="$t('m.i.bs.purchaseDt')" type="daterange" :autoPlacement="true" @on-change="handlePurchaseDtChange"></common-date-picker>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/corpstdbill/creation/stdCreationCounterAccount/func_queryStdCreationCounter"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="stdCreationCounterShow()">{{$t("m.i.bs.payAcct")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 收费记账弹窗 -->
    <std-creation-counter-show :stdCreationCounterShowWin="stdCreationCounterShowWin" :batchParams="batchParams" :dictMap="dictMap"
                           @stdCreationCounterShowWinClose="stdCreationCounterShowWinClose" ref="stdCreationCounterShow"></std-creation-counter-show>

    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.ecdsAcctNo" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true></show-cust-acct-no>
    <!-- 产品选择  -->
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>

  </div>
</template>

<script>
  import { post, accMul, formatNumber, rateSortMethod } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationCounterAccount",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      StdCreationCounterShow: () => import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationCounterShow" */`@/views/bizViews/bs/corpstdbill/creation/stdCreationCounterShow`),
    },
    data() {
      return {
        creationAmtRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "产品规模(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        validAcctNoRules: [{
          test: /^[0-9a-zA-Z]{1,32}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为32位"
        }],
        formItem: {
          stdProductNo: "",
          stdProductName:"",
          stdProductNameLike:"",
          ecdsAcctNo:"",
          ecdsAcctName: "",
          sellBrchName:"",
          minCreationAmt:"",
          maxCreationAmt:"",
          minPurchaseDt:"",
          maxPurchaseDt:""
        },
        purchaseDt:[],
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
                    this.showDetail(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t("m.i.bs.baseAssetType"),
            key: "baseAssetType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BaseAssetType", params.row.baseAssetType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.bs.stdProductName'),
            key: 'stdProductName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.stdProductShortName'),
            key: 'stdProductShortName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.ecdsAcctNo'),
            key: 'ecdsAcctNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.ecdsAcctName'),
            key: 'ecdsAcctName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.dpstBrchName'),
            key: 'dpstBrchName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.dpstBrchCode'),
            key: 'dpstBrchCode',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.sellBrchName'),
            key: 'sellBrchName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.financeRatePct'),
            key: 'financeRatePct',
            hiddenCol: false,
            align: "right",
            sortable: true,
            sortMethod:(a,b,type)=>{
              return rateSortMethod(a,b,type);
            }
          },
          {
            title: this.$t('m.i.bs.beginDueDt'),
            key: 'beginDueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.beginDueDt ? this.$moment(params.row.beginDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.endDueDt'),
            key: 'endDueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.endDueDt ? this.$moment(params.row.endDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.bs.creationAmt"),
            key: "creationAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.creationAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.creationNum'),
            key: 'creationNum',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.creationTerm'),
            key: 'creationTerm',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bs.totalFeeAmt"),
            key: "totalFeeAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalFeeAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.totalSettleAmt"),
            key: "totalSettleAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.publishDt'),
            key: 'publishDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.publishDt ? this.$moment(params.row.publishDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.declareEndDtTm'),
            key: 'declareEndDtTm',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.declareEndDtTm ? this.$moment(params.row.declareEndDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
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
            title: this.$t('m.i.bs.raiseDt'),
            key: 'raiseDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.raiseDt ? this.$moment(params.row.raiseDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.paymentDt'),
            key: 'paymentDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.paymentDt ? this.$moment(params.row.paymentDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.transPlace'),
            key: 'transPlace',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'TransPlace', params.row.transPlace);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.bs.purchaseResult'),
            key: 'purchaseResult',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'PurchaseResult', params.row.purchaseResult);
              return h("span", {
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
        stdCreationCounterShowWin: false,
        showCpesProductBranch:false,
        showCustAcctNoWin: false,
        baseAssetTypeList:[],
        transPlaceList:[],
        isList:[],
        purchaseResultList:[],
        billTypeList:[],
        collectModeList:[],
        batchParams: {},
      };
    },
    mounted() {
      this.getDictListByGroups("BaseAssetType,Yon,TransPlace,PurchaseResult,DraftTypeCode").then(res => {
        this.isList = res.get("Yon");
        this.baseAssetTypeList = res.get("BaseAssetType");
        this.transPlaceList = res.get("TransPlace");
        this.purchaseResultList = res.get("PurchaseResult");
        this.billTypeList = res.get("DraftTypeCode");
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
        this.purchaseDt=[];
        this.formItem.minPurchaseDt="";
        this.formItem.maxPurchaseDt="";
        this.formItem.stdProductNo="";
        this.formItem.ecdsAcctNo="";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handlePurchaseDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minPurchaseDt = arr[0].replace(/-/g, "");
          this.formItem.maxPurchaseDt = arr[1].replace(/-/g, "");
          this.purchaseDt = [arr[0], arr[1]];
        } else {
          this.formItem.minPurchaseDt = "";
          this.formItem.maxPurchaseDt = "";
          this.purchaseDt = [];
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
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        // this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
      },
      queryEcdsAcctNo(){
        this.showCustAcctNoWin = true;
      },
      showCustAcctNoWinClose(){
        this.showCustAcctNoWin = false;
      },
      custAcctNoSelectSubmit(info) {
        this.formItem.ecdsAcctNo = info.custAcctNo;
        this.formItem.ecdsAcctName = info.custName;
        this.showCustAcctNoWin = false;
      },


      //打开新增和修改页面
      stdCreationCounterShow(){
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchParams.batchId = this.currentSelectRow.id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.baseAssetTypeList = this.baseAssetTypeList;
        this.batchParams.transPlaceList = this.transPlaceList;
        this.batchParams.purchaseResultList = this.purchaseResultList;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.isList = this.isList;
        this.stdCreationCounterShowWin = true;
      },

      stdCreationCounterShowWinClose() {
        this.stdCreationCounterShowWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },

      showDetail(id){
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.baseAssetTypeList = this.baseAssetTypeList;
        this.batchParams.transPlaceList = this.transPlaceList;
        this.batchParams.purchaseResultList = this.purchaseResultList;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.isList = this.isList;
        this.stdCreationCounterShowWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
