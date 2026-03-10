<!--付款确认申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="saleTrackQueryItem" :label-width="90" ref="saleTrackQueryItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.be.transBrch')">
                  <h-input v-model="saleTrackQueryItem.brchName" icon="android-search" @on-click="brchNoWinOpen"
                           readonly  clearable @on-clear="clearVal('brchName')" maxlength="50"></h-input>
                </h-form-item>-->

                <show-branch v-model="saleTrackQueryItem.brchName"  :label="$t('m.i.be.transBrch')"      prop="brchName"
                             :showCheckBox="true"     :brchNo.sync="saleTrackQueryItem.transBranchNo" :brchName.sync="saleTrackQueryItem.brchName">
                </show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="saleTrackQueryItem.batchNo" maxlength="50"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.flowStatus')"  prop="batchStatusList" >
                <h-select v-model="saleTrackQueryItem.batchStatusList" multiple placeholder="" showTitle>
                  <h-option v-for="item in moveBatchStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.outClearSpeed')" prop="outClearSpeed">
                  <h-select v-model="saleTrackQueryItem.outClearSpeed" placeholder="">
                    <h-option v-for="item in clearSpeedList" :value="item.key" :key="item.key">{{item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.innerQuoteNo')" prop="innerQuoteNo" class="h-form-three h-form-long-label">
                  <h-input v-model="saleTrackQueryItem.innerQuoteNo"  maxlength="20"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.outQuoteNo')" prop="outQuoteNo" class="h-form-three h-form-long-label">
                  <h-input v-model="saleTrackQueryItem.outQuoteNo" maxlength="20"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.innerDealNo')" prop="innerDealNo" class="h-form-three h-form-long-label">
                  <h-input v-model="saleTrackQueryItem.innerDealNo" maxlength="20"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.outDealNo')" prop="outDealNo" class="h-form-three h-form-long-label">
                  <h-input v-model="saleTrackQueryItem.outDealNo" maxlength="20"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="saleTrackQueryItem.billNo" maxlength="50"></h-input>
                </h-form-item>
                <show-cpes-branch v-model="saleTrackQueryItem.outBuyBrchName" :label="$t('m.i.be.outBuyBrchName')" prop="outBuyBrchName"
                                  :brchCode.sync="saleTrackQueryItem.outBuyBrchCode" :cpesBrchName.sync="saleTrackQueryItem.outBuyBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList"
                                  queryUrl="/cpes/branch/queryBranchList" ></show-cpes-branch>

                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="saleTrackQueryItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="saleTrackQueryItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <!-- <h-form-item :label="$t('m.i.be.innerAcctStatus')" prop="innerAcctStatus" class="h-form-three h-form-long-label">
                  <h-select v-model="saleTrackQueryItem.innerAcctStatus" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.outAcctStatus')" prop="outAcctStatus" class="h-form-three h-form-long-label">
                  <h-select v-model="saleTrackQueryItem.outAcctStatus" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item> -->
                <h-form-item :label="$t('m.i.be.outFirstSettleDt')" prop="outFirstSettleDtt" class="h-form-long-label">
                  <h-date-picker type="daterange" autoPlacement :value="outFirstSettleDtt" :showFormat="true" placeholder="" @on-change="handleFirstSettleDttChange"></h-date-picker>
                </h-form-item>
                <!-- <h-form-item :label="$t('m.i.be.innerDealStatus')" prop="innerDealStatus">
                  <h-select v-model="saleTrackQueryItem.innerDealStatus" placeholder="">
                    <h-option v-for="item in dealStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.outDealStatus')" prop="outDealStatus">
                  <h-select v-model="saleTrackQueryItem.outDealStatus" placeholder="">
                    <h-option v-for="item in dealStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item> -->
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid
                :columns="dataColumns"
                :hasSelect="false"
                rowSelect
                url="/be/market/quote/innerMoveBill/saleQuoteApply/trackQuery/func_findInnerMoveBillBatch"
                :bindForm="saleTrackQueryItem"
                ref="datagrid">
                <div slot="toolbar" class='pull-left'>
                  <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
                  <h-button type="primary" @click="dealExport()">{{$t('m.i.be.dealExport')}}</h-button>
                  <h-button type="primary" @click="exportBatchTransSheet()"
                            v-if="btnAuth.showBatchDealExportButton === undefined ? false : btnAuth.showBatchDealExportButton.isShow">成交单批量导出</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <!-- 机构名称选择弹窗框 -->
    <!--<show-branch :showBranchWin="brchNoWin" title="机构名称" @brchNoChange="brchNoChange" ifcheck="isTrue"
                 :checkStrictly="true" @showBranchWinClose="brchNoWinClose"></show-branch>-->
    <sale-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :saleDetailWin="showDetilBox" @closeMsgBox="closeDetil"></sale-detail>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
    <!--<brch-code-search :brchCodeWin="brchCodeWinBrch" @brchCodeWinClose="brchCodeWinClose"-->
                      <!--@brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "saleTrackQuery",
    components: {
      SaleDetail:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/saleDetail" */`@/views/bizViews/be/market/quote/innerMoveBill/saleDetail`),
      //ShowBranch:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`),
      // BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)

    },
    data() {
      return {
        btnAuth:{},
        filename : "卖出票据明细",
        batchfilename : "卖出批次清单",
        batchUrl : "/be/market/quote/sale/saleTrackQuery/func_findByBatchId",
        billsUrl : "/be/market/quote/sale/saleTrackQuery/func_queryBills",
        saleTrackQueryItem : {
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
          transBranchNo:"",
          brchName:"",
          buyBrchName:"",
          buyBrchCode:"",
          billNo:"",
          busiTypes:"",
          urlType:"",
          remindDays:"",
          innerQuoteNo:"",
          outQuoteNo:"",
          innerDealNo:"",
          outDealNo:"",
          outBuyBrchName:"",
          outBuyBrchCode:"",
          outBusiType:"",
          innerAcctStatus:"",
          outAcctStatus:"",
          outFirstSettleDtt:"",
          innerDealStatus:"",
          outDealStatus:"",
          innerMinFirstSettleDt: "",
          innerMaxFirstSettleDt: "",
          outMinFirstSettleDt: "",
          outMaxFirstSettleDt: "",
          batchStatusList:[],
          outClearSpeed: "",
        },

        billTypeList : [],
        billClassList : [],
        acctStatusList : [],
        clearStatusList : [],
        assetIndustry : [],
        busiTypeList : [],
        dealStatusList : [],
        moveBatchStatusList : [],
        brchTreeData : [],
        firstSettleDtt:[],
        outFirstSettleDtt:[],
        dueSettleDtt:[],
        clearSpeedList:[],

        type : "",
        ifShowMore : false,
        brchNameSelectWin : false,
        isDisabled : false,
        quoteMonitorbrchName : '',
        currentSelectList : [],
        currentSelectRowInx : [],
        //brchNoWin:false,
        // brchCodeWinBrch: false,
        dataColumns : [
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
            title: this.$t('m.i.billInfo.flowStatus'),
            key: 'batchStatus',
            hiddenCol: false,
            render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, 'MoveBatchStatus', params.row.batchStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
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
            title: this.$t('m.i.be.innerQuoteNo'),
            key: "innerQuoteNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.outQuoteNo'),
            key: "outQuoteNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.innerDealNo'),
            key: "innerDealNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.outDealNo'),
            key: "outDealNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.innerDealDtTm'),
            key: "innerDealDtTm",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.innerDealDtTm ? this.$moment(params.row.innerDealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
            }
          },
          {
            title: this.$t('m.i.be.outDealDtTm'),
            key: "outDealDtTm",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.outDealDtTm ? this.$moment(params.row.outDealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
            }
          },
          {
            title: this.$t('m.i.be.innerBuyBrchName'),
            key: "innerBuyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.innerBuyTraderName'),
            key: "innerBuyTraderName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.outBuyBrchName'),
            key: "outBuyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.outBuyTraderName'),
            key: "outBuyTraderName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
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
            title: this.$t('m.i.be.innerRate'),
            key: "innerRatePct",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', params.row.innerRatePct)
            },
          },
          {
            title: this.$t('m.i.be.outRate'),
            key: "outRatePct",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', params.row.outRatePct)
            },
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
            title: this.$t('m.i.be.innerClearSpeed'),
            key: "innerClearSpeed",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.innerClearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.outClearSpeed'),
            key: "outClearSpeed",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.outClearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.innerFirstSettleDt'),
            key: "innerFirstSettleDt",
            hiddenCol: false,
            sortable:true,
            render: (h, params) => {
              return h('span', params.row.innerFirstSettleDt ? this.$moment(params.row.innerFirstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.outFirstSettleDt'),
            key: "outFirstSettleDt",
            hiddenCol: false,
            sortable:true,
            render: (h, params) => {
              return h('span', params.row.outFirstSettleDt ? this.$moment(params.row.outFirstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
           {
            title: this.$t('m.i.be.innerSettleMode'),
            key: "innerSettleMode",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.innerSettleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
           {
            title: this.$t('m.i.be.outSettleMode'),
            key: "outSettleMode",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.outSettleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.innerClearType'),
            key: "innerClearType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.innerClearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.outClearType'),
            key: "outClearType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.outClearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.innerQuoteTm'),
            key: "innerQuoteTm",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.outQuoteTm'),
            key: "outQuoteTm",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.innerSetTm'),
            key: "innerSetTm",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.outSetTm'),
            key: "outSetTm",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.totalAmtByYUAN'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.totalAmt, 2, ','))
            },
          },
           {
            title: this.$t('m.i.be.innerFirstInterest'),
            key: "innerFirstInterest",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.innerFirstInterest, 2, ','))
            },
          },
		      {
            title: this.$t('m.i.be.innerFirstSettleAmt'),
            key: "innerFirstSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.innerFirstSettleAmt, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.innerTenorDays'),
            key: "innerTenorDays",
            hiddenCol: false
          },
		      {
            title: this.$t('m.i.be.outFirstInterest'),
            key: "outFirstInterest",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.outFirstInterest, 2, ','))
            },
          },
		      {
            title: this.$t('m.i.be.outFirstSettleAmt'),
            key: "outFirstSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.outFirstSettleAmt, 2, ','))
            },
          },
		      {
            title: this.$t('m.i.be.outTenorDays'),
            key: "outTenorDays",
            sortable: true,
            hiddenCol: false
          },

		     {
            title: this.$t('m.i.be.totalCount'),
            key: "totalNum",
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.brchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.traderName'),
            key: "saleTraderName",
            sortable: true,
            hiddenCol: false
          }
        ],
        batchId:'',
        showDetilBox : false,
        busiType : '',
        showProvisionDetil : false,
        dictMap : new Map(),
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        tmpForm:{}
      };
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

     /* brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },
      brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.saleTrackQueryItem.transBranchNo = brchNos.substring(0,brchNos.length - 1);
        this.saleTrackQueryItem.brchName = brchNames.substring(0,brchNames.length - 1);
        // this.formItem.brchName=info[0].title;
        this.brchNoWin = false;
      },*/
      /**
       * 列表搜索
       **/
      formSearch() {
        this.$nextTick(() => {
          this.currentSelectList = [];
          this.currentSelectRowInx = [];
          //尾部去空格
          this.saleTrackQueryItem.batchNo = this.saleTrackQueryItem.batchNo.replace(/^\s+|\s+$/gm, '');
          this.saleTrackQueryItem.innerQuoteNo = this.saleTrackQueryItem.innerQuoteNo.replace(/^\s+|\s+$/gm, '');
          this.saleTrackQueryItem.outQuoteNo = this.saleTrackQueryItem.outQuoteNo.replace(/^\s+|\s+$/gm, '');
          this.saleTrackQueryItem.innerDealNo = this.saleTrackQueryItem.innerDealNo.replace(/^\s+|\s+$/gm, '');
          this.saleTrackQueryItem.outDealNo = this.saleTrackQueryItem.outDealNo.replace(/^\s+|\s+$/gm, '');
          /**清除多页选择的数据*/
          this.$refs.datagrid.selectIds = [];
          this.$refs.datagrid.selects = [];
          //设置清单导出时所需的查询条件
          this.tmpForm = JSON.parse(JSON.stringify(this.saleTrackQueryItem));
          this.$refs.datagrid.dataChange(1);
        });
      },
      handleFirstSettleDttChange(arr){
        if (arr && arr.length >= 2) {
          this.saleTrackQueryItem.outMinFirstSettleDt = arr[0].replace(/-/g, "");
          this.saleTrackQueryItem.outMaxFirstSettleDt = arr[1].replace(/-/g, "");
          //this.firstSettleDtt = [arr[0],arr[1]];
          this.outFirstSettleDtt = [arr[0],arr[1]];
        } else {
          this.saleTrackQueryItem.outMinFirstSettleDt = "";
          this.saleTrackQueryItem.outMaxFirstSettleDt = "";
          //this.firstSettleDtt = [];
          this.outFirstSettleDtt = [];
        }
      },
      handleDueSettleDttChange(arr){
        if (arr && arr.length >= 2) {
          this.saleTrackQueryItem.minDueSettleDt = arr[0].replace(/-/g, "");
          this.saleTrackQueryItem.maxDueSettleDt = arr[1].replace(/-/g, "");
          this.dueSettleDtt = [arr[0],arr[1]];
        } else {
          this.saleTrackQueryItem.minDueSettleDt = "";
          this.saleTrackQueryItem.maxDueSettleDt = "";
          this.dueSettleDtt = [];
        }
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.firstSettleDtt = [];
        this.outFirstSettleDtt = [];
        this.dueSettleDtt = [];
        this.$refs.saleTrackQueryItem.resetFields();
        this.saleTrackQueryItem.minFirstSettleDt = ''
        this.saleTrackQueryItem.outMinDueSettleDt = ''
        this.saleTrackQueryItem.outMaxFirstSettleDt = ''
        this.saleTrackQueryItem.maxDueSettleDt = ''
        this.saleTrackQueryItem.transBranchNo='';
        this.saleTrackQueryItem.brchName='';
        this.saleTrackQueryItem.busiTypes='';
        this.saleTrackQueryItem.urlType='';
        this.saleTrackQueryItem.remindDays='';
        this.saleTrackQueryItem.buyBrchCode='';
        this.saleTrackQueryItem.outBuyBrchCode='';
      },
      //交易明细
      dealDetail() {
        this.currentSelectList = this.$refs.datagrid.selects
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
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'innerMoveBillTrackQueryReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType){
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/innerMoveBill/saleQuoteApply/trackQuery/func_exportBatchData";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
            transBranchNo:this.saleTrackQueryItem.transBranchNo,
            urlType:this.saleTrackQueryItem.urlType,
            remindDays:this.saleTrackQueryItem.remindDays
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.saleTrackQueryItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

      //成交单导出
      dealExport() {
        this.currentSelectList = this.$refs.datagrid.selects
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if(this.currentSelectList[0].outDealStatus!="QS06"){
          this.$msgTip.info(this, { info: "该记录不是成交状态，不能导出成交单" });
          return;
        }
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/trackQuery/func_exportDealSale";
        let form = document.createElement("form");
        form.innerHTML = `<input type="text" name="id" value="${this.currentSelectList[0].outSaleBatchId}"/>`
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      exportBatchTransSheet() {
        this.currentSelectList = this.$refs.datagrid.selects
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
        if(flag){
          this.$msgTip.info(this, { info: "存在记录不是成交状态，不能导出成交单" });
          return;
        }
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/trackQuery/func_exportBatchSaleDeal";
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
          this.saleTrackQueryItem.transBranchNo = '';
          this.saleTrackQueryItem.brchName = '';
        }
      },
      getParams(){
        if (this.$route.path === "/be/market/quote/sale/saleTrackQuery") {
          let flag=false;
          if (this.$route.query.dueSettleDtt) {
            let dueSettleDtt = this.$moment(this.$route.query.dueSettleDtt, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.dueSettleDtt = [dueSettleDtt, dueSettleDtt];
            flag=true;
          }
          if (this.$route.query.dealStatus){
            this.saleTrackQueryItem.dealStatus=this.$route.query.dealStatus;
            flag=true
          } ;
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

      // brchCodeWinOpen() {
      //   this.brchCodeWinBrch = true;
      // },
      // brchCodeWinClose() {
      //   this.brchCodeWinBrch = false;
      // },
      // brchCodeChange(info) {
      //   this.saleTrackQueryItem.buyBrchName = info.brchFullNameZh;
      //   this.saleTrackQueryItem.buyBrchCode = info.brchCode;
      //   this.brchCodeWinBrch = false;
      // },
    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      this.$nextTick(()=>{
        this.getDictListByGroups("PreRelationFlag,AssetIndustry,QuoteBatchStatus,DraftTypeCode,CdSelectMode,CDMedia,QuoteBusiType,AcctFlag,QuoteStatus,SettleType,PreTradeBhvr,Yon,ClearSpeed,ClearType,StlResult,MmbStlStatus,CreditMajor,MoveBatchStatus,BillOrigin").then(res => {
          this.billTypeList = res.get("DraftTypeCode");
          this.billClassList = res.get("CDMedia");
          this.busiTypeList = res.get("QuoteBusiType");
          this.acctStatusList = res.get("AcctFlag");
          this.dealStatusList = res.get("QuoteStatus");
          this.clearStatusList = res.get("StlResult");
          this.assetIndustry = res.get("AssetIndustry");
          this.moveBatchStatusList = res.get("MoveBatchStatus");
          this.clearSpeedList= res.get('ClearSpeed');
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
