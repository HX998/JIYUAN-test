<!--创设业务-设立管理-->
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
                <h-form-item :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"  >
                  <h-input v-model="formItem.stdProductNameLike" placeholder="" icon="android-search"
                           @on-click="queryProductName" :maxlength="60" lengthByByte></h-input>
                </h-form-item>
                <!--是否已提交-->
                <h-form-item :label="this.$t('m.i.be.isCommit')" prop="isCommit" cols="2" >
                  <h-radio-group v-model="formItem.isCommit" >
                    <h-radio label="0" @on-click="noCommitButton">
                      <span>未提交</span>
                    </h-radio>
                    <h-radio label="1" @on-click="hasCommitButton">
                      <span>已提交</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <!--电票账号-->
                <h-form-item :label="$t('m.i.bs.ecdsAcctNo')" prop="ecdsAcctNo"  :validRules="validAcctNoRules">
                  <h-input v-model="formItem.ecdsAcctNo" :maxlength=32></h-input>
                </h-form-item>
                <!--存托机构名称-->
                <h-form-item :label="$t('m.i.bs.dpstBrchName')" prop="dpstBrchName"  >
                  <h-input v-model="formItem.dpstBrchName" placeholder="" readonly icon="android-search"
                           @on-click="queryCpesBrchName"></h-input>
                </h-form-item>
                <!--承销机构名称-->
                <common-input v-model="formItem.sellBrchName" :label="$t('m.i.bs.sellBrchName')"
                              prop="sellBrchName" :maxlength="150"></common-input>
                <!--创设规模（万元内）-->
                <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationMaxAmt')" class="h-form-long-label" :integerNum="12" :suffixNum="2" :validRules="creationMaxAmtRule"
                                         :rangeProps="['minCreationMaxAmt','maxCreationMaxAmt']" :bigTips="false"></common-type-field-range>
                <!--创设期限（天内）-->
                <common-type-field-range v-model="formItem" :rangeProps="['minCreationMaxTerm','maxCreationMaxTerm']" class="h-form-long-label" :integerNum="3" :suffixNum="0"
                                         :label="$t('m.i.bs.creationMaxTerm')" prop="remainingPeriod"
                                         :bigTips="false"></common-type-field-range>
                <!--披露日期-->
                <common-date-picker v-model="publishDate" :label="$t('m.i.bs.publishDt')" type="daterange" :autoPlacement="true" @on-change="handlePublishDateChange"></common-date-picker>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/corpstdbill/creation/stdCreationApply/func_queryStdCreationApply"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="stdCreationOperate('add')" :disabled="hasCommit">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="stdCreationOperate('modify')" :disabled="hasCommit">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="stdCreationDelete()" :disabled="hasCommit">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="stdCreationCancel()" :disabled="noCommit">{{$t("m.i.common.revoke")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 新增修改弹窗 -->
    <std-creation-add :stdCreationAddOrEditWin="stdCreationAddOrEditWin" :batchParams="batchParams" :dictMap="dictMap"
                    @stdCreationAddOrEditWinClose="stdCreationAddOrEditWinClose" ref="stdCreationAdd"></std-creation-add>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true></show-cust-acct-no>
    <!-- 详情页面 -->
<!--    <rebuy-apply-detail :rebuyApplyDetailWin="rebuyApplyDetailWin" :batchParams="batchParams"
                    @rebuyApplyDetailWinClose="rebuyApplyDetailWinClose" ref="rebuyApplyDetail"></rebuy-apply-detail>-->
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>

    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      :showMemberId="false" :memberId="memberId"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>

    <std-creation-detail :stdCreationDetail="stdCreationDetail" :batchId="batchId" :batchParams="batchParams"
                         @stdCreationDetailClose="stdCreationDetailClose"></std-creation-detail>

  </div>
</template>

<script>
  import { post, accMul, formatNumber, rateSortMethod } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationApply",
    components: {
      StdCreationDetail:()=>import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationDetail" */`@/views/bizViews/bs/corpstdbill/creation/stdCreationDetail`),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      StdCreationAdd: () => import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationAdd" */`@/views/bizViews/bs/corpstdbill/creation/stdCreationAdd`),
      // RebuyApplyDetail: () => import(/* webpackChunkName: "be/market/anonyclick/rebuy/rebuyApplyDetail" */`@/views/bizViews/be/market/anonyclick/rebuy/rebuyApplyDetail`)
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
          ecdsAcctNo:"",
          ecdsAcctName: "",
          dpstBrchCode:"",
          dpstBrchName:"",
          sellBrchName:"",
          minCreationMaxAmt:"",
          maxCreationMaxAmt:"",
          minCreationMaxTerm:"",
          maxCreationMaxTerm:"",
          minPublishDt:"",
          maxPublishDt:"",
          isCommit:"0"
        },
        hasCommit:false,
        noCommit:true,
        publishDate:[],
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
            title: this.$t('m.i.bs.ecdsAcctNo'),
            key: 'ecdsAcctNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.ecdsAcctName'),
            key: 'ecdsAcctName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.dpstBrchName'),
            key: 'dpstBrchName',
            hiddenCol: false,
            sortable: true,
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
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.financeMaxRatePct'),
            key: 'financeMaxRatePct',
            hiddenCol: false,
            align: "right",
            sortable: true,
            sortMethod:(a,b,type)=>{
              return rateSortMethod(a,b,type);
            }
          },
          {
            title: this.$t('m.i.bs.financeMinRatePct'),
            key: 'financeMinRatePct',
            hiddenCol: false,
            align: "right",
            sortable: true,
            sortMethod:(a,b,type)=>{
              return rateSortMethod(a,b,type);
            }
          },
          {
            title: this.$t('m.i.bs.preBeginDueDt'),
            key: 'preBeginDueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.preBeginDueDt ? this.$moment(params.row.preBeginDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.preEndDueDt'),
            key: 'preEndDueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.preEndDueDt ? this.$moment(params.row.preEndDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
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
        stdCreationAddOrEditWin:false,
        showCustAcctNoWin: false,
        // rebuyApplyDetailWin:false,
        batchParams: {},
        stdCreationDetail: false,
        batchId: "",
      };
    },
    mounted() {
      this.getDictListByGroups("BaseAssetType,Yon,DraftTypeCode,CDMedia,TransPlace,CollectMode,CorpScale,Industry,partnerType,CalFeeRuleControlMode,CalFeeType,MemberType,CreditRating,RatingExpectationType").then(res => {
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
        this.publishDate=[];
        this.formItem.minPublishDt="";
        this.formItem.maxPublishDt="";
        this.formItem.stdProductNo="";
        this.formItem.dpstBrchCode="";
        this.formItem.ecdsAcctNo="";
        this.formItem.baseAssetType="";
        this.$refs.formItem.resetFields();
        this.noCommitButton();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handlePublishDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minPublishDt = arr[0].replace(/-/g, "");
          this.formItem.maxPublishDt = arr[1].replace(/-/g, "");
          this.publishDate = [arr[0], arr[1]];
        } else {
          this.formItem.minPublishDt = "";
          this.formItem.maxPublishDt = "";
          this.publishDate = [];
        }
      },
      //未提交
      noCommitButton(){
        this.noCommit = true;
        this.hasCommit = false;
        this.formItem.isCommit='0';
        this.handleSearch();
      },
      //已提交
      hasCommitButton(){
        this.hasCommit = true;
        this.noCommit = false;
        this.formItem.isCommit='1';
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
          this.$msgTip.error(this, { info: "请先选择记录！" });
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
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.batchId = this.currentSelectRow.id;
          this.batchParams.isPublishDt=false;
          this.batchParams.isDeclareEndDtTm=false;
          this.batchParams.isPurchaseDt=false;
          this.batchParams.isRaiseDt=false;
          this.batchParams.isPaymentDt=false;
        } else {
          this.batchParams.batchId = "";
          this.batchParams.isPublishDt=true;
          this.batchParams.isDeclareEndDtTm=true;
          this.batchParams.isPurchaseDt=true;
          this.batchParams.isRaiseDt=true;
          this.batchParams.isPaymentDt=true;
        }
        this.assembleParams(str);
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.billClassList = this.billClassList;
        this.batchParams.baseAssetTypeList = this.baseAssetTypeList;
        this.batchParams.transPlaceList = this.transPlaceList;
        this.batchParams.collectModeList = this.collectModeList;
        this.batchParams.calFeeTypeList = this.calFeeTypeList;
        this.batchParams.isList = this.isList;
        this.stdCreationAddOrEditWin = true;
      },
      //关闭新增、修改弹窗
      stdCreationAddOrEditWinClose() {
        this.stdCreationAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //删除批次
      stdCreationDelete(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "删除信息",
            content: "确定要删除吗？",
            onOk: () => {
              let params={ id: this.currentSelectRow.id };
              let url="/bs/corpstdbill/creation/stdCreationApply/func_deleteStdCreation";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      stdCreationCancel(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "撤销信息",
            content: "确定要撤销申请吗？",
            onOk: () => {
              let params={ id: this.currentSelectRow.id };
              let url="/bs/corpstdbill/creation/stdCreationApply/func_cancelStdCreation";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
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
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      stdCreationDetailOpen(id){
        this.batchId = id;
        this.batchParams.batchUrl="/bs/corpstdbill/creation/stdCreationApply/func_jumpEditStdCreation";
        this.batchParams.dataGridUrl="";
        this.batchParams.creditMainUrl = "/bs/corpstdbill/creation/stdCreationApply/func_queryStdCreditMainPage";
        this.batchParams.orgHolderUrl = "/bs/corpstdbill/creation/stdCreationApply/func_queryStdCorpOrgHolderPage";
        this.batchParams.isNotShowExport = true;
        this.batchParams.isNotShowFee = true;
        this.stdCreationDetail = true;
      },
      stdCreationDetailClose(){
        this.batchId = "";
        this.batchParams.batchUrl="";
        this.batchParams.dataGridUrl="";
        this.batchParams.creditMainUrl = "";
        this.batchParams.orgHolderUrl = "";
        this.batchParams.isNotShowExport = false;
        this.batchParams.isNotShowFee = false;
        this.stdCreationDetail = false;
      }
    }
  };
</script>

<style scoped>

</style>
