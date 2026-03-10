<!--创设业务-存托签收-->
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
                              prop="stdProductNameLike" showIcon  @on-click="queryProductName"></common-input>
                <!--电票账号-->
                <common-input v-model="formItem.ecdsAcctNo" :label="$t('m.i.bs.ecdsAcctNo')" :validRules="validAcctNoRules"
                              prop="ecdsAcctNo"  :maxlength="32"></common-input>
                <!--存托机构名称-->
               <!-- <common-input v-model="formItem.dpstBrchName" :label="$t('m.i.bs.dpstBrchName')"
                              prop="dpstBrchName" showIcon readonly @on-click="queryCpesBrchName"></common-input>-->
                <!--承销机构名称-->
                <common-input v-model="formItem.sellBrchName" :label="$t('m.i.bs.sellBrchName')"
                              prop="sellBrchName"  :maxlength="150"></common-input>
                <!--创设规模（万元内）-->
                <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationMaxAmt')" class="h-form-long-label" :integerNum="12" :suffixNum="2":validRules="creationMaxAmtRule"
                                         :rangeProps="['minCreationMaxAmt','maxCreationMaxAmt']" :bigTips="false"></common-type-field-range>
                <!--创设期限（天内）-->
                <common-type-field-range v-model="formItem" :rangeProps="['minCreationMaxTerm','maxCreationMaxTerm']" class="h-form-long-label" :integerNum="3":suffixNum="0"
                                         :label="$t('m.i.bs.creationMaxTerm')" prop="remainingPeriod"
                                         :bigTips="false"></common-type-field-range>
                <!--申报日期-->
                <common-date-picker v-model="declareEndDate" :label="$t('m.i.bs.declareEndDt')" type="daterange" :autoPlacement="true" @on-change="handleDeclareEndDateChange"></common-date-picker>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/corpstdbill/dpst/stdCorpDpstApply/func_queryStdCreationApply"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="stdCreationOperate('modify')" >{{$t("m.i.common.modify")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 新增修改弹窗 -->
    <std-creation-dpst-edit :stdCreationDpstEditWin="stdCreationDpstEditWin" :batchParams="batchParams"
                    @stdCreationDpstEditWinClose="stdCreationDpstEditWinClose" ref="stdCreationDpstEdit"></std-creation-dpst-edit>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>

    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      :showMemberId="false" :memberId="memberId"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <std-creation-detail :stdCreationDetail="stdCreationDetail" :batchId="creationId" @stdCreationDetailClose="stdCreationDetailClose" :batchParams="batchParams"></std-creation-detail>
  </div>
</template>

<script>
  import { post, accMul, formatNumber, rateSortMethod } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCorpDpstApply",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      StdCreationDpstEdit: () => import(/* webpackChunkName: "bs/corpstdbill/dpst/stdCreationDpstEdit" */`@/views/bizViews/bs/corpstdbill/dpst/stdCreationDpstEdit`),
      StdCreationDetail:()=>import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationDetail" */`@/views/bizViews/bs/corpstdbill/creation/stdCreationDetail`),

    },
    data() {
      return {
        creationMaxAmtRule:[{
          test: /^(?:[1-9]\d{0,11}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "创设规模上限(万元)必须是大于等于0的数字，最多12位整数且小数位不超过两位"
        }],
        validAcctNoRules: [{
          test: /^[0-9a-zA-Z]{1,32}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为32位"
        }],
        formItem: {
          stdProductNo: "",
          stdProductNameLike:"",
          baseAssetType:"",
          ecdsAcctNo:"",
          dpstBrchCode:"",
          dpstBrchName:"",
          sellBrchName:"",
          minCreationMaxAmt:"",
          maxCreationMaxAmt:"",
          minCreationMaxTerm:"",
          maxCreationMaxTerm:"",
          minDeclareEndDt:"",
          maxDeclareEndDt:"",
        },
        declareEndDate:[],
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
                    this.stdCreationDetailOpen(params.row.id)
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
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.stdProductShortName'),
            key: 'stdProductShortName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.ecdsAcctNo'),
            key: 'ecdsAcctNo',
            hiddenCol: false,
            sortable: true,
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
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.sellBrchName'),
            key: 'sellBrchName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.bs.creationMaxAmt"),
            key: "creationMaxAmt",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.creationMaxAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.creationMaxTerm'),
            key: 'creationMaxTerm',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.financeMaxRatePct'),
            key: 'financeMaxRatePct',
            hiddenCol: false,
            sortable: true,
            align: "right",
            sortMethod:(a,b,type)=>{
              return rateSortMethod(a,b,type);
            }
          },
          {
            title: this.$t('m.i.bs.financeMinRatePct'),
            key: 'financeMinRatePct',
            hiddenCol: false,
            sortable: true,
            align: "right",
            sortMethod:(a,b,type)=>{
              return rateSortMethod(a,b,type);
            }
          },
          // {
          //   title: this.$t('m.i.bs.preBeginDueDt'),
          //   key: 'preBeginDueDt',
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     return h('span', params.row.preBeginDueDt ? this.$moment(params.row.preBeginDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          //   }
          // },
          // {
          //   title: this.$t('m.i.bs.preEndDueDt'),
          //   key: 'preEndDueDt',
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     return h('span', params.row.preEndDueDt ? this.$moment(params.row.preEndDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          //   }
          // },
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
            sortable: true,
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
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        showCpesBranch:false,
        baseAssetTypeList:[],
        transPlaceList:[],
        billTypeList:[],
        billClassList: [],
        isList:[],
        collectModeList:[],
        controlModeList:[],
        calFeeTypeList:[],
        stdCreationDpstEditWin:false,
        batchParams: {},
        stdCreationDetail: false,
        creationId: "",
      };
    },
    mounted() {
      this.getDictListByGroups("BaseAssetType,Yon,DraftTypeCode,CDMedia,TransPlace,CollectMode,CorpScale,Industry,partnerType,CalFeeRuleControlMode,CalFeeType,MemberType,CreditRating,DpstBillFlowStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.isList = res.get("Yon");
        this.baseAssetTypeList = res.get("BaseAssetType");
        this.transPlaceList = res.get("TransPlace");
        this.collectModeList = res.get("CollectMode");
        this.controlModeList = res.get("CalFeeRuleControlMode");
        this.calFeeTypeList = res.get("CalFeeType");
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
        this.declareEndDate=[];
        this.formItem.minDeclareEndDt="";
        this.formItem.maxDeclareEndDt="";
        this.formItem.stdProductNo="";
        this.formItem.dpstBrchCode="";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleDeclareEndDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDeclareEndDt = arr[0].replace(/-/g, "");
          this.formItem.maxDeclareEndDt = arr[1].replace(/-/g, "");
          this.declareEndDate = [arr[0], arr[1]];
        } else {
          this.formItem.minDeclareEndDt = "";
          this.formItem.maxDeclareEndDt = "";
          this.declareEndDate = [];
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
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        this.showCpesProductBranch = false;
      },
      // 根据弹框所选数据进行赋值
      queryCpesBrchName() {
        this.showCpesBranch = true;
      },
      showCpesBranchClose() {
        this.showCpesBranch = false;
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.dpstBrchCode = info.brchCode;
        this.formItem.dpstBrchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },

      //打开新增和修改页面
      stdCreationOperate(str){
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchParams.batchId = this.currentSelectRow.id;
        this.assembleParams(str);
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.billClassList = this.billClassList;
        this.batchParams.baseAssetTypeList = this.baseAssetTypeList;
        this.batchParams.transPlaceList = this.transPlaceList;
        this.batchParams.isList = this.isList;
        this.batchParams.collectModeList = this.collectModeList;
        this.batchParams.controlModeList = this.controlModeList;
        this.batchParams.calFeeTypeList = this.calFeeTypeList;
        this.batchParams.batchUrl="/bs/corpstdbill/dpst/stdCorpDpstApply/func_findStdCorpDpstById";
        this.batchParams.dataGridUrl="/bs/corpstdbill/dpst/stdCorpDpstApply/func_queryStdCorpDpstBillPage";
        this.stdCreationDpstEditWin = true;
      },
      //关闭新增、修改弹窗
      stdCreationDpstEditWinClose() {
        this.stdCreationDpstEditWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      stdCreationDetailOpen(id){
        this.creationId = id;
        this.batchParams.batchUrl="/bs/corpstdbill/dpst/stdCorpDpstApply/func_findStdCorpDpstById";
        this.batchParams.dataGridUrl="/bs/corpstdbill/dpst/stdCorpDpstApply/func_queryStdCorpDpstBillPage";
        this.batchParams.creditMainUrl = "/bs/corpstdbill/dpst/stdCorpDpstApply/func_queryStdCreditMainPage";
        this.batchParams.orgHolderUrl = "/bs/corpstdbill/dpst/stdCorpDpstApply/func_queryStdCorpOrgHolderPage";
        this.stdCreationDetail = true;
      },
      stdCreationDetailClose(){
        this.creationId = "";
        this.batchParams.batchUrl="";
        this.batchParams.dataGridUrl="";
        this.stdCreationDetail = false;
      }
    }
  };
</script>

<style scoped>

</style>
