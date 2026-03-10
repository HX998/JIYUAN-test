<!--承销管理-退汇跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div class="h-form-search-box">
          <!-- 查询表单 -->
          <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <!--基础资产种类-->
              <common-select v-model="formItem.baseAssetType" :label="$t('m.i.bs.baseAssetType')" prop="baseAssetType"
                             :dictList="baseAssetTypeList"></common-select>
              <!--标票产品名称-->
              <common-input v-model="formItem.stdProductNameLike" :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                            showIcon @on-click="queryProductName"></common-input>
              <!--电票账号-->
             <!-- <common-input v-model="formItem.ecdsAcctName" :label="$t('m.i.bs.ecdsAcctName')" prop="ecdsAcctName"
                            readonly showIcon @on-click="queryEcdsAcctNo"></common-input>-->
              <common-input v-model="formItem.ecdsAcctNo" :label="$t('m.i.bs.ecdsAcctNo')" prop="ecdsAcctNo"
                            :validRules="validAcctNoRules" :maxlength=32></common-input>
              <!--承销机构名称-->
              <common-input v-model="formItem.sellBrchName" :label="$t('m.i.bs.sellBrchName')"
                            prop="sellBrchName" :maxlength="150"></common-input>
              <!--产品规模(元)-->
              <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationAmt')" :integerNum="16" :suffixNum="2":validRules="creationAmtRule"
                                       :rangeProps="['minCreationAmt','maxCreationAmt']" :bigTips="false"></common-type-field-range>
              <!--认购日期-->
              <common-date-picker v-model="purchaseDate" :label="$t('m.i.bs.purchaseDt')" type="daterange" :autoPlacement="true" @on-change="handlePurchaseDateChange"></common-date-picker>
              <!--收款总额(元)-->
              <common-type-field-range v-model="formItem" :label="$t('m.i.bs.totalCollectAmt')" :integerNum="16" :suffixNum="2":validRules="totalCollectAmtRule"
                                       :rangeProps="['minTotalCollectAmt','maxTotalCollectAmt']" :bigTips="false"></common-type-field-range>
              <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
            </h-form>
          </h-panel>
        </div>
        <!-- 数据展示表格 -->
        <h-datagrid
          :columns="columns"
          highlightRow
          url="/bs/corpstdbill/underwrite/stdCreationReexchangeTrackQuery/func_queryStdCreationByPage"
          :bindForm="formItem"
          :row-select="true"
          :has-select="false"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="listExport()">{{$t("m.i.common.listExport")}}</h-button>
          </div>
        </h-datagrid>
      </h-col>
    </h-row>
    <!-- 查看投资人清单 -->
    <std-reexchange-info :stdReexchangeInfoWin="stdReexchangeInfoWin" :batchParams="batchParams"
                      @stdReexchangeInfoWinClose="stdReexchangeInfoWinClose" ref="stdReexchangeInfo"></std-reexchange-info>
    <!--标票产品名称-->
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      :showMemberId="false" :memberId="memberId"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true></show-cust-acct-no>
    <!--标票详情-->
    <std-creation-detail :stdCreationDetail="stdCreationDetail" :batchId="batchId" @stdCreationDetailClose="stdCreationDetailClose"></std-creation-detail>
    <!--导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber, exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationReexchangeTrackQuery",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      StdCreationDetail:()=>import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationDetail" */`@/views/bizViews/bs/corpstdbill/creation/stdCreationDetail`),
      StdReexchangeInfo:() =>import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdReexchangeInfo" */`@/views/bizViews/bs/corpstdbill/underwrite/stdReexchangeInfo`),
    },
    data() {
      return {
        creationAmtRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "产品规模(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        totalCollectAmtRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "收款总额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        validAcctNoRules: [{
          test: /^[0-9a-zA-Z]{1,32}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为32位"
        }],
        formItem: {
          baseAssetType:"",
          stdProductNo: "",
          stdProductNameLike:"",
          ecdsAcctNo:"",
          sellBrchName:"",
          purchaseResult:"",
          minCreationAmt:"",
          maxCreationAmt:"",
          minTotalCollectAmt:"",
          maxTotalCollectAmt:"",
          minPurchaseDt:"",
          maxPurchaseDt:""
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
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  on: {
                    click: () => {
                      this.stdCreationDetailOpen(params.row.id);
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.bs.totalCollectAmt"),
            key: "totalCollectAmt",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalCollectAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.reexchangeStatus"),
            key: "reexchangeStatus",
            hiddenCol: false,
            render: (h, params) => {
              let reexchangeStatus = this.getDictValueFromMap(this.dictMap, "StdReexchangeFlowStatus", params.row.reexchangeStatus);
              return h("span", {
                domProps: {
                  title: reexchangeStatus
                }
              }, reexchangeStatus);
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
              let transPlace =this.getDictValueFromMap(this.dictMap, 'TransPlace', params.row.transPlace);
              return h("span", {
                domProps: {
                  title: transPlace
                }
              }, transPlace);
            }
          },
          {
            title: this.$t("m.i.bs.stdReexchangeInfo"),
            key: "stdReexchangeInfo",
            render: (h, params) => {
              let attachment = "查看";
              return h("a", {
                on: {
                  click: () => {
                    this.showStdReexchangeInfo(params.row.id);
                  }
                }
              }, attachment);
            }
          }
        ],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        showCpesBranch:false,
        showCustAcctNoWin: false,
        baseAssetTypeList:[],
        transPlaceList:[],
        stdReexchangeInfoWin:false,
        batchParams: {},
        batchId: "",
        stdCreationDetail: false,
        batchParams: {},
        tempShowExcelTemplateWin:false,
        param: "",
        rows: "",
      };
    },
    mounted() {
      this.getDictListByGroups("BaseAssetType,TransPlace,StdReexchangeFlowStatus").then(res => {
        this.baseAssetTypeList = res.get("BaseAssetType");
        this.transPlaceList = res.get("TransPlace");
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
        this.purchaseDate=[];
        this.formItem.minPurchaseDt="";
        this.formItem.maxPurchaseDt="";
        this.formItem.stdProductNo="";
        this.formItem.ecdsAcctNo="";
        this.$refs.formItem.resetFields();
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
      //查询电票账号
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
      listExport() {
        this.param = "stdCreationReexchangeExportInfo";
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
        let url = window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/underwrite/stdCreationReexchangeTrackQuery/func_exportStdCreationList";
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
      //打开投资人明细页面
      showStdReexchangeInfo(id){
        this.batchParams.batchId = id;
        this.stdReexchangeInfoWin = true;
      },
      //关闭投资人明细页面
      stdReexchangeInfoWinClose() {
        this.stdReexchangeInfoWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
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
