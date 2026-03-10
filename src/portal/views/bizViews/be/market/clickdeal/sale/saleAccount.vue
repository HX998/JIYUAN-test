<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo"></common-input>
                <common-input v-model="formItem.dealNo" :label="$t('m.i.be.dealNo')" prop="dealNo"></common-input>
                <show-cpes-branch :label="$t('m.i.be.otherBrchName')"
                                  :brchCode.sync="formItem.buyBrchCode"  :cpesBrchName.sync="formItem.buyBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>


                <select-trader :label="$t('m.i.be.custTraderName')" prop="buyTraderName" class="h-form-long-label"
                               v-model="formItem.buyTraderName" @traderIdChange="traderIdChange"
                               :clearVal="clearVal" clearValTag="buyTraderName"></select-trader>
                <query-btn :advanceShow="false" @showChange="showChange" :formSearch="formSearch"
                           :formSearchReset="formSearchReset"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns" highlight-row :url="batchsUrl" :bindForm="formItem" :onCurrentChange="onCurrentChange" :onCurrentChangeCancel="onCurrentChangeCancel" ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="account">{{$t('m.i.be.acct')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <quote-sale-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :saleDetailWin="showDetilBox"  @closeMsgBox="closeDetil" :rootUrl="rootUrl"></quote-sale-detail>
    <acct-record :param="param"  :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 :url="acctRecord" @acctSubmitSure="acctSubmitSure"></acct-record>

  </div>
</template>
<script>
  import { post ,formatNumber } from '@/api/bizApi/commonUtil'

  export default {
    name: "saleAccount",
    data() {
      return {
        filename : "卖出票据明细",
        batchUrl : "/be/market/clickdeal/sale/saleAccount/func_findByBatchId",
        billsUrl : "/be/market/clickdeal/sale/saleAccount/func_queryBills",
        batchsUrl : "/be/market/clickdeal/sale/saleAccount/func_queryBatch",
        acctRecord : "/be/market/clickdeal/sale/saleAccount/func_queryAcctRecord",
        accountUrl : "/be/market/clickdeal/sale/saleAccount/func_saleAccount",
        showPrintButton:false,
        acctSubmitFlag:false,
        dictMap : new Map(),
        columns : [
          {
            type: "radio",
            width: 50,
            title: " ",
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
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
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
          let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          }, {
            title: this.$t('m.i.be.dealNo'),
            key: "dealNo",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.dealStatus'),
            key: "dealStatus",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.common.dealDtTm'),
            key: "dealDtTm",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
            }
          }, {
            title: this.$t('m.i.be.otherBrchName'),
            key: "buyBrchName",
              sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.custTraderName'),
            key: "buyTraderName",
            sortable: true,
            hiddenCol: false
          }, {
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
          }, {
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
          }, {
            title: this.$t('m.i.pe.dealRate'),
            key: "ratePct",
            sortable: true,
            hiddenCol: false
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
          }, {
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
            title: this.$t('m.i.be.settleDt'),
            key: "firstSettleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }, {
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
            title: this.$t('m.i.common.totalAmtBillPackage'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.totalAmt, 2, ','))
            },
          }, {
            title: this.$t('m.i.be.payInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstPayInterest, 2, ','))
            },
          },  {
            title: this.$t('m.i.be.settleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstSettleAmt, 2, ','))
            },
          }, {
            title: this.$t('m.i.be.tenorDays'),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: "totalNum",
            hiddenCol: false
          }
        ],
        formItem : {
          quoteNo: "",
          dealNo: "",
          busiType: "",
          buyBrchName: "",
          buyBrchCode: "",
          buyTraderName: "",
          buyTraderNo: "",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          licenseFlag:this.licenseFlag,
        },
        ifShowMore : false,
        showbrch : false,
        showtrader : false,
        busiTypeList : [],
        assetIndustryList : [],
        selectData : [],
        showDetilBox : false,
        param : {},
        showAcctRecordWin : false,
        busiType : "",
        batchId:'',
        //集中授权管理
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        rootUrl: "/be/market/clickdeal/sale/saleAccount"
      }
    },
    components: {
      QuoteSaleDetail: () => import(/* webpackChunkName: "be/market/clickdeal/sale/quoteSaleDetail" */`@/views/bizViews/be/market/clickdeal/sale/quoteSaleDetail`),
    },
    mounted() {
      this.getDictListByGroups('BusiType,Yon,CdSelectMode,AssetIndustry,QuoteStatus,QuoteBusiType,SettleType,ClearType,ClearSpeed,CDMedia,DraftTypeCode,CreditMajor,PreRelationFlag,BillOrigin').then(res => {
        this.busiTypeList = res.get('QuoteBusiType');
        this.assetIndustryList = res.get("AssetIndustry");

        this.dictMap = res.get('map')
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
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      onCurrentChange(data){
        this.selectData[0]=data
      },
      onCurrentChangeCancel(){
        this.selectData=[]
      },
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.buyTraderNo = info.traderId;
        this.showtrader = false;
      },
      traderIdWinClose() {
        this.showtrader = false;
      },
      closeBranch() {
        this.showbrch = false;
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.selectData = [];
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.formItem.buyBrchCode = "";
        this.formItem.buyTraderNo = '';
        this.formItem.buyBrchName = "";
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ id: info.id ,licenseFlag:this.licenseFlag,ownedBrchNo:info.ownedBrchNo,
          ownedBrchName:info.ownedBrchName }, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
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
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
        this.selectData = [];
      },
      account() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.param = {id:list[0].id,licenseFlag:this.licenseFlag,ownedBrchNo:list[0].ownedBrchNo,
          ownedBrchName:list[0].ownedBrchName};
        this.showAcctRecordWin = true;
      },
      showDetil(i,busiType) {
        this.batchId = i
        this.busiType=busiType
        this.showDetilBox = true
      },
      closeDetil() {
        this.showDetilBox = false
      },
      clearVal(type){
        debugger
        if(type == 'buyBrchName'){
          this.formItem.buyBrchCode = '';
          this.formItem.buyBrchName = '';
        }
        if(type == 'buyTraderName'){
          this.formItem.buyTraderNo = '';
          this.formItem.buyTraderName = '';
        }
      },
    }
  }

</script>
