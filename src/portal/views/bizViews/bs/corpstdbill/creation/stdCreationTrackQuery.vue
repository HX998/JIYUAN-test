<!--创设业务-设立确认-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--存托机构名称-->
                <show-branch v-model="formItem.applBrchNames"  :label="$t('m.i.bs.dpstBrchName')" prop="brchName"
                             :showCheckBox="true" :brchNo.sync="formItem.applBrchNos" :brchName.sync="formItem.applBrchNames"></show-branch>
                <!--批次号-->
                <common-input v-model="formItem.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" :maxlength="50"></common-input>
                <!--基础资产种类-->
                <common-select v-model="formItem.baseAssetType" :label="$t('m.i.bs.baseAssetType')" prop="baseAssetType"
                               :dictList="baseAssetTypeList"></common-select>
                <!--标票产品名称-->
                <common-input v-model="formItem.stdProductNameLike" :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                              showIcon @on-click="queryProductName"></common-input>
                <!--电票账号-->
                <common-input v-model="formItem.ecdsAcctNo" :label="$t('m.i.bs.ecdsAcctNo')" prop="ecdsAcctNo"
                              :validRules="validAcctNoRules" :maxlength=32></common-input>
                <!--承销机构名称-->
                <common-input v-model="formItem.sellBrchName" :label="$t('m.i.bs.sellBrchName')"
                              prop="sellBrchName" :maxlength="150"></common-input>
                <!--申购结果-->
                <common-select v-model="formItem.purchaseResult" :label="$t('m.i.bs.purchaseResult')" prop="purchaseResult"
                               :dictList="purchaseResultList"></common-select>
                <!--产品规模(元)-->
                <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationAmt')" :integerNum="16" :suffixNum="2":validRules="creationAmtRule"
                                         :rangeProps="['minCreationAmt','maxCreationAmt']" :bigTips="false"></common-type-field-range>
                <!--申购日期-->
                <common-date-picker v-model="purchaseDate" :label="$t('m.i.bs.purchaseDt')" type="daterange" :autoPlacement="true" @on-change="handlePublishDateChange"></common-date-picker>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/corpstdbill/creation/stdCreationTrackQuery/func_queryStdCreationTrackQuery"
            :bindForm="formItem"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="listExport()">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>

    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      :showMemberId="false" :memberId="memberId"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

    <std-creation-detail :stdCreationDetail="stdCreationDetail" :batchId="batchId" @stdCreationDetailClose="stdCreationDetailClose"></std-creation-detail>
  </div>
</template>

<script>
  import { post, formatNumber,exportList,rateSortMethod } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationTrackQuery",
    components: {
      StdCreationDetail:()=>import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationDetail" */`@/views/bizViews/bs/corpstdbill/creation/stdCreationDetail`),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
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
          batchNo:"",
          stdProductNo: "",
          stdProductNameLike:"",
          ecdsAcctNo:"",
          dpstBrchCode:"",
          dpstBrchName:"",
          applBrchNames:this.$store.getters.userInfo.brchName,
          applBrchNos:this.$store.getters.userInfo.brchNo,
          sellBrchName:"",
          minCreationMaxAmt:"",
          maxCreationMaxAmt:"",
          minCreationMaxTerm:"",
          maxCreationMaxTerm:"",
          minPurchaseDt:"",
          maxPurchaseDt:"",
          purchaseResult:"",
          minCreationAmt:"",
          maxCreationAmt:""
        },
        purchaseDate:[],
        columns: [
          {
            type: "selection",
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "StdCreationFlowStatus", params.row.flowStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            hiddenCol: false,
            sortable: true
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
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.sellBrchName'),
            key: 'sellBrchName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bs.creationMaxAmt"),
            key: "creationMaxAmt",
            align: "right",
            hiddenCol: false,
            sortable: true,
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
            align: "right",
            hiddenCol: false,
            sortable: true,
            sortMethod:(a,b,type)=>{
              if (type==="asc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1-a2;
              }else if (type==="desc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2-a1;
              }
            }
          },
          {
            title: this.$t('m.i.bs.financeMinRatePct'),
            key: 'financeMinRatePct',
            align: "right",
            hiddenCol: false,
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
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.creationAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.creationNum'),
            key: 'creationNum',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.creationTerm'),
            key: 'creationTerm',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.purchaseResult'),
            key: 'purchaseResult',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'PurchaseResult', params.row.purchaseResult);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.bs.financeRatePct'),
            key: 'financeRatePct',
            align: "right",
            hiddenCol: false,
            sortable: true,
            sortMethod:(a,b,type)=>{
              if (type==="asc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1-a2;
              }else if (type==="desc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2-a1;
              }
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
          },
          {
            title: this.$t("m.i.bs.totalFeeAmt"),
            key: "totalFeeAmt",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalFeeAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.totalSettleAmt"),
            key: "totalSettleAmt",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalSettleAmt, 2, ","));
            }
          },
        ],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        showCpesBranch:false,
        baseAssetTypeList:[],
        transPlaceList:[],
        purchaseResultList:[],
        stdCreationFlowStatusList:[],
        billTypeList:[],
        billClassList: [],
        isList:[],
        batchParams: {},
        tempShowExcelTemplateWin:false,
        param: "",
        rows: "",
        stdCreationDetail: false,
        batchId: "",
      };
    },
    mounted() {
      this.getDictListByGroups("BaseAssetType,Yon,DraftTypeCode,CDMedia,TransPlace,StdCreationFlowStatus,PurchaseResult,RatingExpectationType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.isList = res.get("Yon");
        this.baseAssetTypeList = res.get("BaseAssetType");
        this.transPlaceList = res.get("TransPlace");
        this.stdCreationFlowStatusList = res.get("StdCreationFlowStatus");
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
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.minPurchaseDt="";
        this.formItem.maxPurchaseDt="";
        this.purchaseDate=[];
        this.formItem.applBrchNos=this.$store.getters.userInfo.brchNo;
        this.formItem.applBrchNames=this.$store.getters.userInfo.brchName;
        this.formItem.stdProductNo="";
        this.formItem.dpstBrchCode="";
        this.$refs.formItem.resetFields();
      },
      handlePublishDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minPurchaseDt = arr[0].replace(/-/g, "");
          this.formItem.maxPurchaseDt = arr[1].replace(/-/g, "");
          this.purchaseDate = [arr[0], arr[1]];
        } else {
          this.formItem.minPurchaseDt = "";
          this.formItem.maxPurchaseDt = "";
          this.purchaseDate=[];
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
        // this.$parent.validateField('buyProductName');
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
      listExport() {
        this.param = "stdCreationExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/creation/stdCreationTrackQuery/func_exportStdCreation";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },
      stdCreationDetailOpen(id){
        this.batchId = id;
        this.stdCreationDetail = true;
      },
      stdCreationDetailClose(){
        this.batchId = "";
        this.stdCreationDetail = false;
      }
    }
  };
</script>

<style scoped>

</style>
