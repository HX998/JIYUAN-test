<!--付款确认申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="saleDueOverAccountItem" :label-width="90" ref="saleDueOverAccountItem" cols="4" class="h-form-search">
                <show-branch v-model="saleDueOverAccountItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"      prop="ownedBrchNames"
                             v-if="this.licenseFlag"         :showCheckBox="true"     :brchNo.sync="saleDueOverAccountItem.ownedBrchNos" :brchName.sync="saleDueOverAccountItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="saleDueOverAccountItem.batchNo" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo">
                  <h-input v-model="saleDueOverAccountItem.quoteNo" ></h-input>
                </h-form-item>
                <show-cpes-branch  :label="$t('m.i.be.otherBrchName')"
                                   :brchCode.sync="saleDueOverAccountItem.buyBrchCode"  :cpesBrchName.sync="saleDueOverAccountItem.buyBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.custTraderName')" prop="buyTraderName" class="h-form-long-label">
                  <h-input @on-click="showtrader = true" v-model="saleDueOverAccountItem.buyTraderName"
                           clearable @on-clear="clearVal('buyTraderName')" icon="search" readonly>
                  </h-input>
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
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="dataColumns" hasPage highlight-row url="/be/market/quote/sale/saleOverAccount/func_findDueOverAccountBatchList"
                :bindForm="saleDueOverAccountItem"  :onCurrentChange="onCurrentChange" :onCurrentChangeCancel="onCurrentChangeCancel" showListCkeckBox ref="datagrid">
                <div slot="toolbar" class='pull-left'>
                  <h-button type="primary" @click="dueOverAccount()">{{$t('m.i.be.dueOverSaleAccount')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>

    <trader-id-search :traderIdWin="showtrader" :brchCode="saleDueOverAccountItem.buyBrchCode" @traderIdWinClose="traderIdWinClose" @traderIdChange="traderIdChange"></trader-id-search>
    <acct-record title="分录信息" :param="param" :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                  :url="url" @acctSubmitSure="acctSubmitSure"></acct-record>
    <sale-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :saleDetailWin="showDetilBox" @closeMsgBox="closeDetil" :rootUrl="rootUrl"></sale-detail>

  </div>
</template>

<script>
  import {  post, on, off, formatNumber  } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleOverAccount",
    data() {
      return  {
          showPrintButton:false,
          acctSubmitFlag:false,
          saleDueOverAccountItem : {
            batchNo: "",
            quoteNo: "",
            buyBrchCode:"",
            buyBrchName: "",
            buyTraderNo: "",
            buyTraderName:"",
            ownedBrchName:"",
            ownedBrchNo:"",
            ownedBrchNames:"",
            ownedBrchNos:"",
            authPath:this.$route.path ,
            licenseFlag:this.licenseFlag,
          },

          billTypeList : [],
          billClassList : [],
          busiTypeList : [],
          showtrader : false,
          type : "",
          ifShowMore : false,
          dealDetailWin : false,
          currentSelectList : [],
          currentSelectRowInx : [],

          messageBox : {
            show: false,
            Title: '',
            Body: '',
            Type: ''
          },

          batchId:'',
          busiType : '',
          showDetilBox : false,
          batchUrl : "/be/market/quote/sale/saleOverAccount/func_findByBatchId",
          billsUrl : "/be/market/quote/sale/saleOverAccount/func_queryBills",
          rootUrl:"/be/market/quote/sale/saleOverAccount",
          dataColumns : [
            {
              type: "radio",
              width: 50,
              align: "center",
              title: ' ',
              hiddenCol: false
            },
            {
              title: this.$t("m.i.common.index"),
              type: "index",
              width: 60,
              align: "center"
            },
            {
              title: this.$t("m.i.common.ownedBrchNo"),
              key: "ownedBrchName",
              hiddenCol: false
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
              title: this.$t('m.i.common.busiType'),
              key: "busiType",
              hiddenCol: false,
              render: (h, params) => {
            let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              },
            },
            {
              title: this.$t('m.i.be.dealNo'),
              key: "dealNo",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t('m.i.common.dealStatus'),
              key: "dealStatus",
              hiddenCol: false,
              render: (h, params) => {
            let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              },
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
              title: this.$t('m.i.be.otherBrchName'),
              key: "buyBrchName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t('m.i.be.custTraderName'),
              key: "buyTraderName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t('m.i.billInfo.billType'),
              key: "billType",
              hiddenCol: false,
              render: (h, params) => {
            let dictValue =this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            }, {
              title: this.$t('m.i.billInfo.billClass'),
              key: "billClass",
              hiddenCol: false,
              render: (h, params) => {
            let dictValue =this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
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
              hiddenCol: false
            },
            {
              title: this.$t('m.i.be.dueTransRate'),
              key: "dueRatePct",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t('m.i.be.subDeal'),
              key: "subDeal",
              hiddenCol: false,
              render: (h, params) => {
            let dictValue =this.getDictValueFromMap(this.dictMap, 'Yon', params.row.subDeal);
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
            let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.clearSpeed);
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
              sortable: true,
              render: (h, params) => {
                return h('span', params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
              }
            }, {
              title: this.$t('m.i.be.dueSettleDt'),
              key: "dueSettleDt",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                return h('span', params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
              }
            },
            {
              title: this.$t('m.i.be.settleMode'),
              key: "settleMode",
              hiddenCol: false,
              render: (h, params) => {
            let dictValue =this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.settleMode);
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
            let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.clearType);
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
            }, {
              title: this.$t('m.i.common.totalAmtBillPackage'),
              key: "totalAmt",
              sortable: true,
              hiddenCol: false,
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
            }
          ],
          dictMap : new Map(),
          param:{},
        //集中授权管理
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        showAcctRecordWin: false,
        id: null,
        ids: null,
        url: '/be/market/quote/sale/saleOverAccount/func_getDueOverAccountRecord'
      };
    },
    components: {
      TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
      SaleDetail:()=>import(/* webpackChunkName: "be/market/quote/sale/saleDetail" */`@/views/bizViews/be/market/quote/sale/saleDetail`),
    },
    methods: {
      onCurrentChange(data){
        this.currentSelectList[0]=data
      },
      onCurrentChangeCancel(){
        this.currentSelectList=[]
      },
      //记账弹窗
      dueOverAccount() {
        if (this.currentSelectList.length == 1) {
          let list = this.currentSelectList;
          this.param={id: list[0].id,licenseFlag:this.licenseFlag,ownedBrchNo:list[0].ownedBrchNo,
            ownedBrchName:list[0].ownedBrchName};
          this.showAcctRecordWin = true;
        } else if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return
        } else if (this.currentSelectList == null || this.currentSelectList.length <= 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return
        }
      },
      //确定记账，发送记账请求
      acctSubmitSure(obj) {
        let url = "/be/market/quote/sale/saleOverAccount/func_dueOverAccount";
        let dealNo = this.currentSelectList[0].dealNo;
        this.acctSubmitFlag = true;
        post({ dealNo: dealNo,licenseFlag:this.licenseFlag,ownedBrchNo:obj.ownedBrchNo,
          ownedBrchName:obj.ownedBrchName  }, url).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!obj.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      printSuccessCallback(){
        this.showAcctRecordWinClose();
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.currentSelectList = [];
      },
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.saleDueOverAccountItem.buyTraderNo = info.traderId;
        this.saleDueOverAccountItem.buyTraderName = info.traderName;
        this.showtrader = false;
      },
      traderIdWinClose() {
        this.showtrader = false;
      },
      formSearch() {
        this.currentSelectList = [];
        this.currentSelectRowInx = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.saleDueOverAccountItem.ownedBrchNo = "";
        this.saleDueOverAccountItem.ownedBrchName = "";
        this.saleDueOverAccountItem.ownedBrchNos = "";
        this.saleDueOverAccountItem.ownedBrchNames = "";
        this.$refs.saleDueOverAccountItem.resetFields();
        this.saleDueOverAccountItem.buyBrchName = "";
        this.saleDueOverAccountItem.buyTraderName = '';
        this.saleDueOverAccountItem.buyBrchCode="";
        this.saleDueOverAccountItem.buyTraderNo='';

      },
      closeDetil() {
        this.showDetilBox = false
      },
      showDetil(i, busiType) {
        this.batchId = i
        this.busiType = busiType
        this.showDetilBox = true
      },
      clearVal(type){
        if(type == 'buyBrchName'){
          this.saleDueOverAccountItem.buyBrchCode = '';
          this.saleDueOverAccountItem.buyBrchName = '';
        }
        if(type == 'buyTraderName'){
          this.saleDueOverAccountItem.buyTraderNo = '';
          this.saleDueOverAccountItem.buyTraderName = '';
        }
      },
    },
    mounted() {
      this.getDictListByGroups("PreRelationFlag,DraftTypeCode,CdSelectMode,AssetIndustry,QuoteStatus,CDMedia,QuoteBusiType,SettleType,PreTradeBhvr,Yon,DealStatus,ClearSpeed,ClearType,MmbStlStatus,CreditMajor,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.dictMap = res.get("map");
      });

      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  }

</script>

<style scoped>

</style>
