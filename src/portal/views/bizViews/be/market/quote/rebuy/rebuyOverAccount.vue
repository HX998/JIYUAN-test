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
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"      prop="ownedBrchNames"
                             v-if="this.licenseFlag"     :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo">
                  <h-input v-model="formItem.quoteNo"></h-input>
                </h-form-item>

                <show-cpes-branch  :label="$t('m.i.be.otherBrchName')"
                                   :brchCode.sync="formItem.saleBrchCode"  :cpesBrchName.sync="formItem.saleBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.custTraderName')" prop="saleTraderName" class="h-form-long-label">
                  <h-input @on-click="showtrader = true" v-model="formItem.saleTraderName" icon="search" readonly
                           clearable @on-clear="clearVal('saleTraderName')">
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
              <h-datagrid :columns="dataColumns" hasPage highlight-row url="/be/market/quote/rebuy/rebuyOverAccount/func_findDueOverAccountBatchList"
                :bindForm="formItem"  :onCurrentChange="onCurrentChange" :onCurrentChangeCancel="onCurrentChangeCancel" showListCkeckBox ref="datagrid">
                <div slot="toolbar" class='pull-left'>
                  <h-button type="primary" @click="dueOverAccount()">{{$t('m.i.be.dueOverAccount')}}</h-button>
                  <h-button type="primary" @click="setAssetType()" v-if="openI9flag" :disabled="isShowInner==='0'">{{$t('m.i.be.setAssetType')}}</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <trader-id-search :traderIdWin="showtrader" :brchCode="formItem.saleBrchCode" @traderIdWinClose="traderIdWinClose" @traderIdChange="traderIdChange"></trader-id-search>
    <acct-record title="分录信息" :param="param" :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                :url="url" @acctSubmitSure="acctSubmitSure"></acct-record>
    <rebuy-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :rebuyDetailWin="showDetilBox"  @closeMsgBox="closeDetil" :rootUrl="rootUrl"></rebuy-detail>
    <assetIndustry
      :batchId="curBatchId"
      :billIds="billIds"
      :dictMap="dictObject"
      :assetInd="assetInd"
      :isAssetIndustryChooseBoolen="isAssetIndustryChooseBoolen"
      :isNeedBookTypeBoolen="isNeedBookTypeBoolen"
      :assetIndustryWin="assetIndustryWin"
      :rootUrl="rootUrl"
      @assetIndustryClose="assetIndustryClose">
    </assetIndustry>

  </div>
</template>

<script>
  import { post, formatNumber, on, off,getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";
  import assetIndustry from "./assetIndustry";
  export default {
    name: "rebuyOverAccount",
    data() {
      return  {
        openI9flag:"",
        dictObject:{},
        showPrintButton:false,
        acctSubmitFlag:false,
        isShowInner:"",
        isInnerDiscSetIndustry:"",
        formItem : {
          batchNo: "",
          quoteNo: "",
          saleBrchName: "",
          saleBrchCode: "",
          saleTraderName: "",
          saleTraderNo: "",
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
        //集中授权管理
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        //自己添加的data
        curBatchId:this.batchId,
        billIds:'',
        assetInd:'',
        isNeedBookTypeBoolen:false,
        isAssetIndustryChooseBoolen:false,
        assetIndustryWin:false,

        messageBox : {
          show: false,
          Title: '',
          Body: '',
          Type: ''
        },

        batchId:'',
        busiType : '',
        showDetilBox : false,
        rootUrl:"/be/market/quote/rebuy/rebuyOverAccount",
        dataColumns : [
          {
            type: "radio",
            width: 50,
            title: ' ',
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
          let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
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
              let dt =params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : ""
              return h('span', dt)
            }
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.custTraderName'),
            key: "saleTraderName",
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
          },
          {
            title: this.$t('m.i.be.firstTransRate'),
            key: "ratePct",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.ratePct != null && params.row.ratePct !== ""){
                let ratePct = params.row.ratePct + "(%)";
                return h("span", ratePct);
              }
            }
          },
          {
            title: this.$t('m.i.be.dueTransRate'),
            key: "dueRatePct",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueRatePct != null && params.row.dueRatePct !== ""){
                let dueRatePct = params.row.dueRatePct + "(%)";
                return h("span", dueRatePct);
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
           sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dt =params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : ""
              return h('span', dt)
            }
          }, {
            title: this.$t('m.i.be.dueSettleDt'),
            key: "dueSettleDt",
           sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dt = params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : ""
              return h('span', dt)
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
        dictMap: new Map(),
        param:{},
        showAcctRecordWin: false,
        id: null,
        ids: null,
        url: '/be/market/quote/rebuy/rebuyOverAccount/func_getDueOverAccountRecord'
      };
    },
    components: {
     TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
      RebuyDetail:()=>import(/* webpackChunkName: "be/market/quote/rebuy/rebuyDetail" */`@/views/bizViews/be/market/quote/rebuy/rebuyDetail`),
      AssetIndustry:()=>import(/* webpackChunkName: "be/market/quote/rebuy/assetIndustry" */`@/views/bizViews/be/market/quote/rebuy/assetIndustry`),
    },

    methods: {
      onCurrentChange(data){
        this.currentSelectList[0]=data;
        let isInner = this.currentSelectList[0].isInner;
        if (isInner ==="1" && this.isInnerDiscSetIndustry==="0") {
          this.isShowInner = "0";
        } else {
          this.isShowInner = "1";
        }
      },
      onCurrentChangeCancel(){
        this.currentSelectList=[];
        this.isShowInner = "";
      },
      //记账弹窗
      dueOverAccount() {
        if (this.currentSelectList.length == 1) {
          let list = this.currentSelectList;
          this.param = {id:list[0].id,licenseFlag:this.licenseFlag,ownedBrchNo:list[0].ownedBrchNo,
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
        let url = "/be/market/quote/rebuy/rebuyOverAccount/func_dueOverAccount";
        let dealNo = this.currentSelectList[0].dealNo;
        this.acctSubmitFlag = true;
        post({ dealNo: dealNo,licenseFlag:this.licenseFlag,ownedBrchNo:obj.ownedBrchNo,
          ownedBrchName:obj.ownedBrchName }, url).then(res => {
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
        this.formItem.saleTraderNo = info.traderId;
        this.formItem.saleTraderName = info.traderName;
        this.showtrader = false;
      },
      traderIdWinClose() {
        this.showtrader = false;
      },
      assetIndustryClose(){
        this.billIds=null;
        this.assetIndustryWin=false;
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
        this.assetInd=null;
        this.$refs.datagrid.dataChange(1);
      },
      // 设置资产分类
      setAssetType(){
        let list = this.currentSelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let ids = "";
        let assetInd='';
        let isAssetIndustry=true;
        for (let i = 0; i < list.length; i++) {
          let obj=list[i];
          ids += obj.id;
          if(assetInd){
            if(isAssetIndustry){
              if(!(assetInd===obj.assetIndustry)){
                isAssetIndustry=false;
              }
            }
          }else{
            assetInd=obj.assetIndustry;
          }
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.curBatchId=list[0].id;
        this.assetIndustryWin=true;
      },
      /**
       * 列表搜索
       * */
      formSearch() {
        this.currentSelectList = [];
        this.currentSelectRowInx = [];
        this.$refs.datagrid.dataChange(1);
        this.isShowInner = "";
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.formItem.saleBrchName = "";
        this.formItem.saleTraderName = '';
        this.formItem.saleBrchCode="";
        this.formItem.saleTraderNo='';
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
        if(type == 'saleBrchName'){
          this.formItem.saleBrchCode = '';
          this.formItem.saleBrchName = '';
        }
        if(type == 'saleTraderName'){
          this.formItem.saleTraderNo = '';
          this.formItem.saleTraderName = '';
        }
      },
    },
    mounted() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false
      this.getDictListByGroups("PreRelationFlag,BookType,AssetIndustryManage,CreditDeductRule,DraftTypeCode,CdSelectMode,QuoteStatus,CDMedia,QuoteBusiType,SettleType,PreTradeBhvr,Yon,DealStatus,ClearSpeed,ClearType,MmbStlStatus,CreditMajor,AssetIndustry,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.dictMap = res.get("map");
        this.dictObject={
          assetIndustryList:res.get("AssetIndustryManage"),
          bookTypeList:res.get("BookType")
        }
      });
      getSingleParamValuesByKeys("bm.valuate.is_inner_set_valuate").then(res => {
        let isResetIndustry = res["bm.valuate.is_inner_set_valuate"];
        if (isResetIndustry === "" || isResetIndustry == null || isResetIndustry == undefined) {
          this.isInnerDiscSetIndustry = "0";
        } else {
          this.isInnerDiscSetIndustry = isResetIndustry;
        }
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
