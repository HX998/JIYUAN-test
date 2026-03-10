<!--付款确认申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchName"  :label="$t('m.i.be.transBrch')"      prop="brchName"
                             :showCheckBox="true"     :brchNo.sync="formItem.transBrchNo" :brchName.sync="formItem.brchName">
                </show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo">
                  <h-input v-model="formItem.quoteNo" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
                  <h-input v-model="formItem.dealNo" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')"  prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                  <h-input v-model="formItem.billNoLike"></h-input>
                </h-form-item>
                <show-cpes-branch v-model="formItem.saleBrchName" :label="$t('m.i.be.otherBrchName')" prop="saleBrchName"
                                  :brchCode.sync="formItem.saleBrchCode" :cpesBrchName.sync="formItem.saleBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" >
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="" >
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.firstAcctStatus')" prop="acctStatus">
                  <h-select v-model="formItem.acctStatus" placeholder="" >
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.dealStatus')" prop="dealStatus">
                  <h-select v-model="formItem.dealStatus" placeholder="" >
                    <h-option v-for="item in dealStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.firstClearStatus')" prop="clearStatus">
                  <h-select v-model="formItem.clearStatus" placeholder="">
                    <h-option v-for="item in clearStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.firstSettleDate')" prop="firstSettleDtt">
                  <h-date-picker type="daterange" autoPlacement :value="firstSettleDtt" :showFormat="true" placeholder="" @on-change="handleFirstSettleDttChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dueSettleDt')" prop="dueSettleDtt">
                  <h-date-picker type="daterange" autoPlacement :value="dueSettleDtt" :showFormat="true" placeholder="" @on-change="handleDueSettleDttChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid
                :columns="dataColumns"
                :hasSelect="false"
                rowSelect
                url="/be/market/quote/rebuy/rebuyTrarckQuery/func_queryRebuyBatchByPage"
                :bindForm="formItem"
                ref="datagrid">
                <div slot="toolbar" class='pull-left'>
                  <h-button type="primary" @click="dealDetail()">{{$t('m.i.be.transDetail')}}</h-button>
                  <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
                  <h-button type="primary" @click="dealExport()">{{$t('m.i.be.dealExport')}}</h-button>
                  <h-button type="primary" @click="exportBatchTransSheet()"
                            v-if="btnAuth.showBatchDealExportButton === undefined ? false : btnAuth.showBatchDealExportButton.isShow">成交单批量导出</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <rebuy-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :rebuyDetailWin="showDetilBox"
      @closeMsgBox="closeDetil" :rootUrl="rootUrl"></rebuy-detail>

    <common-excel-download @handleSubmit="exportTable" @showExcelTemplateWinClose="showExcelTemplateWinClose" :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post,formatNumber, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyTrackQuery",
    components: {
      RebuyDetail:()=>import(/* webpackChunkName: "be/market/quote/rebuy/rebuyDetail" */`@/views/bizViews/be/market/quote/rebuy/rebuyDetail`),

    },
    data() {
      return {
        btnAuth:{},
        formItem: {
          transBrchNos: "",
          batchNo: "",
          quoteNo: "",
          dealNo:"",
          busiType: "",
          billType:"",
          billClass:"",
          acctStatus: "",
          dealStatus: "",
          clearStatus: "",
          firstSettleDtt: "",
          minFirstSettleDt: "",
          maxFirstSettleDt: "",
          dueSettleDtt: "",
          minDueSettleDt: "",
          maxDueSettleDt: "",
          isRedisc: "",
          transBrchNo: "",
          brchName: "",
          saleBrchName:"",
          saleBrchCode:"",
          busiTypes:"",
          urlType:"",
          remindDays:"",
          billNoLike:"",
          billOrigin:""
        },
        //清单导出
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        billTypeList: [],
        billClassList: [],
        acctStatusList: [],
        clearStatusList: [],
        busiTypeList: [],
        dealStatusList: [],
        billOriginList:[],
        brchTreeData: [],
        firstSettleDtt:[],
        dueSettleDtt:[],
        brchNoWin:false,
        type: "",
        ifShowMore: false,
        brchNameSelectWin: false,
        isDisabled: false,
        quoteMonitorbrchName: '',
        currentSelectList: [],
        currentSelectRowInx: [],
        dataColumns: [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showDetil(params.row.id, params.row.busiType)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t('m.i.be.quoteNo'),
            key: "quoteNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.be.custTraderName'),
            key: "saleTraderName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.dealDtTm'),
            key: "dealDtTm",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
            }
          },
          {
            title: this.$t('m.i.be.firstClearStatus'),
            key: "clearStatus",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'StlResult', params.row.clearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dueClearStatus'),
            key: "dueClearStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'StlResult', params.row.dueClearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstAcctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.acctStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dueAcctStatus'),
            key: "dueAcctFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.dueAcctFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: 'batchStatus',
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteBatchStatus', params.row.batchStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dealNo'),
            key: "dealNo",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.dealStatus'),
            key: "dealStatus",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t('m.i.be.preTradeBhvr'),
            key: "preTradeBhvr",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'PreTradeBhvr', params.row.preTradeBhvr);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstTransRate'),
            key: "ratePct",
            sortable: true,
            hiddenCol: false,
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
            title: this.$t('m.i.be.dueTransRate'),
            key: "dueRatePct",
            sortable: true,
            hiddenCol: false,
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
            title: this.$t('m.i.be.subDeal'),
            key: "subDeal",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'Yon', params.row.subDeal);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.clearSpeed'),
            key: "clearSpeed",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.firstSettleDate'),
            key: "firstSettleDt",
            hiddenCol: false,
            sortable:true,
            render: (h, params) => {
              return h('span', params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }, {
            title: this.$t('m.i.be.dueSettleDt'),
            key: "dueSettleDt",
            hiddenCol: false,
            sortable:true,
            render: (h, params) => {
              return h('span', params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.settleMode'),
            key: "settleMode",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.clearType'),
            key: "clearType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.clearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.quoteTm'),
            key: "quoteTm",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.setTm'),
            key: "setTm",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.totalAmtBillPackage'),
            key: "totalAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('p', formatNumber(params.row.totalAmt, 2, ','))
            },
          }, {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstPayInterest, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.dueInterest, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstSettleAmt, 2, ','))
            },
          }, {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.dueSettleAmt, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.tenorDays'),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherNoLegalProd'),
            key: "saleProductName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.brchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.traderName'),
            key: "buyTraderName",
            sortable: true,
            hiddenCol: false
          }
        ],
        showDetilBox : false,
        rootUrl:"/be/market/quote/rebuy/rebuyTrackQuery",
        busiType : '',
        batchId:'',
        showProvisionDetil : false,
        dictMap : new Map(),
        tmpForm:{}
      }
    },
    methods: {
      showDetil(i, busiType) {
        this.batchId = i
        this.busiType = busiType
        this.showDetilBox = true
      },
      closeDetil() {
        this.showDetilBox = false
      },
      /**
       * 列表搜索
       * */
      formSearch() {
        this.$nextTick(() => {
          this.currentSelectList = [];
          this.currentSelectRowInx = [];
          this.formItem.batchNo=this.formItem.batchNo.replace(/^\s+|\s+$/gm,'');
          this.formItem.quoteNo=this.formItem.quoteNo.replace(/^\s+|\s+$/gm,'');
          this.formItem.dealNo=this.formItem.dealNo.replace(/^\s+|\s+$/gm,'');
          /**清除多页选择的数据*/
          this.$refs.datagrid.selectIds=[];
          this.$refs.datagrid.selects=[];
          //设置清单导出时所需的查询条件
          this.tmpForm = JSON.parse(JSON.stringify(this.formItem));
          this.$refs.datagrid.dataChange(1);
        });
      },
      handleFirstSettleDttChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minFirstSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxFirstSettleDt = arr[1].replace(/-/g, "");
          this.firstSettleDtt = [arr[0],arr[1]];
        } else {
          this.formItem.minFirstSettleDt = "";
          this.formItem.maxFirstSettleDt = "";
          this.firstSettleDtt = [];
        }
      },
      handleDueSettleDttChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueSettleDt = arr[1].replace(/-/g, "");
          this.dueSettleDtt = [arr[0],arr[1]];
        } else {
          this.formItem.minDueSettleDt = "";
          this.formItem.maxDueSettleDt = "";
          this.dueSettleDtt = [];
        }
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.firstSettleDtt = [];
        this.dueSettleDtt = [];
        this.formItem.saleBrchCode='';
        this.$refs.formItem.resetFields();
        this.formItem.minFirstSettleDt = ''
        this.formItem.minDueSettleDt = ''
        this.formItem.maxFirstSettleDt = ''
        this.formItem.maxDueSettleDt = ''
        this.quoteMonitorbrchName = "";
        this.formItem.transBrchNo='';
        this.formItem.brchName='';
        this.formItem.busiTypes='';
        this.formItem.urlType='';
        this.formItem.remindDays='';
      },
      //交易明细
      dealDetail() {
        this.currentSelectList=this.$refs.datagrid.selects
        if (this.currentSelectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectList.length == 1) {
          this.batchId = this.currentSelectList[0].id;
          this.busiType = this.currentSelectList[0].busiType;
          this.showDetilBox = true
        }
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      tempShowExcelTemplateWinOpen() {
        this.param = 'rebuyTrarckQuery';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportTable(field, exportType) {
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let url = window.LOCAL_CONFIG.API_HOME + '/be/market/quote/rebuy/rebuyTrarckQuery/func_exportData'
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = { ids: this.$refs.datagrid.selectIds, pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType,
              excelName: this.param};
          }else {
            params = {};
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj) && this.formItem[obj] && this.formItem[obj] !== "") {
                params[obj]= this.formItem[obj];
              }
            }
            params.field = field;
            params.exportType = exportType;
            params.excelName = this.param;
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          let url = window.LOCAL_CONFIG.API_HOME + '/be/market/quote/rebuy/rebuyTrarckQuery/func_exportData'
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          let key;
          for (key in this.tmpForm) {
            let input = document.createElement('input')
            input.type = 'text'
            input.name = key
            input.value = this.tmpForm[key]
            form.appendChild(input);
          }
          let input1 = document.createElement('input')
          input1.type = 'text'
          input1.name = "ids"
          input1.value = this.$refs.datagrid.selectIds
          form.appendChild(input1);
          let input2 = document.createElement('input')
          input2.type = 'text'
          input2.name = 'field';
          input2.value = field;
          form.appendChild(input2)
          let input3 = document.createElement('input')
          input3.type = 'text'
          input3.name = 'exportType';
          input3.value = exportType;
          form.appendChild(input3)
          let input4 = document.createElement('input')
          input4.type = 'text'
          input4.name = 'excelName';
          input4.value = this.param;
          form.appendChild(input4)
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      //成交单导出
      dealExport() {
        this.currentSelectList=this.$refs.datagrid.selects
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if(this.currentSelectList[0].dealStatus!="QS06"){
          this.$msgTip.info(this, { info: "该记录不是成交状态，不能导出成交单" });
          return;
        }
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/rebuy/rebuyTrarckQuery/func_exportDeal";
        let form = document.createElement("form");
        form.innerHTML = `<input type="text" name="id" value="${this.currentSelectList[0].id}"/>`
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      exportBatchTransSheet(){
        this.currentSelectList=this.$refs.datagrid.selects
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        if (this.currentSelectList.length>200){
          this.$msgTip.info(this, { info: "批量成交单导出最大不能超过200笔" });
          return;
        }
        let flag=this.currentSelectList.some(child => {
          return child.dealStatus!='QS06';
        });
        if (flag) {
          this.$msgTip.info(this, { info: "存在记录不是成交状态，不能导出成交单" });
          return;
        }
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/rebuy/rebuyTrarckQuery/func_exportBatchDeal";
        let form = document.createElement('form');
        form.setAttribute("id", "formId");
        form.setAttribute('action', url);
        form.setAttribute("method", "post");
        let input = document.createElement('input')
        input.type = 'text'
        input.name = 'batchIds'
        input.value = this.$refs.datagrid.selectIds
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      clearVal(type){
        if(type == 'brchName'){
          this.formItem.transBrchNo = '';
          this.formItem.brchName = '';
        }
      },
      getParams(){
        if (this.$route.path === "/be/market/quote/rebuy/rebuyTrackQuery") {
          let flag=false;
          if (this.$route.query.dueSettleDtt) {
            let dueSettleDtt = this.$moment(this.$route.query.dueSettleDtt, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.dueSettleDtt = [dueSettleDtt, dueSettleDtt];
            flag=true
          }
          if (this.$route.query.dealStatus) {
            this.formItem.dealStatus=this.$route.query.dealStatus;
            flag=true
          };
          if (this.$route.query.minDueSettleDt && this.$route.query.maxDueSettleDt) {
            let minDueSettleDt = this.$moment(this.$route.query.minDueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            let maxDueSettleDt = this.$moment(this.$route.query.maxDueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.dueSettleDtt = [minDueSettleDt, maxDueSettleDt];
            flag=true
          }
          if (flag){
            this.$nextTick(() => {
              this.formSearch();
            });
          } ;
        }
      },
    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      this.$nextTick(()=>{
        this.getDictListByGroups("PreRelationFlag,QuoteBatchStatus,BookType,AssetIndustry,CreditDeductRule,DraftTypeCode,CdSelectMode,CDMedia,QuoteBusiType,AcctFlag,QuoteStatus,SettleType,PreTradeBhvr,Yon,ClearSpeed,ClearType,StlResult,MmbStlStatus,CreditMajor,BillOrigin").then(res => {
          this.billTypeList = res.get("DraftTypeCode");
          this.billClassList = res.get("CDMedia");
          this.busiTypeList = res.get("QuoteBusiType");
          this.acctStatusList = res.get("AcctFlag");
          this.dealStatusList = res.get("QuoteStatus");
          this.clearStatusList = res.get("StlResult");
          this.billOriginList = res.get("BillOrigin");
          this.dictMap = res.get("map");
        });
        this.getParams();
        post({ authId: JSON.parse(window.sessionStorage.getItem("curMenu")).id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth =JSON.parse(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      });
    }
  }

</script>

<style scoped>

</style>
