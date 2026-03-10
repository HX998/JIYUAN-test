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
                                  :brchCode.sync="formItem.saleBrchCode"  :cpesBrchName.sync="formItem.saleBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <select-trader :label="$t('m.i.be.custTraderName')" prop="saleTraderName" class="h-form-long-label"
                               v-model="formItem.saleTraderName" @traderIdChange="traderIdChange"
                               :clearVal="clearVal" clearValTag="saleTraderName"></select-trader>
                <query-btn :advanceShow="false" @showChange="showChange" :formSearch="formSearch"
                           :formSearchReset="formSearchReset"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" highlight-row :url="batchsUrl" :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel" :bindForm="formItem" ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account">{{$t("m.i.be.acct")}}</h-button>
              <h-button type="primary" @click="setAssetType()" v-if="openI9flag" :disabled="isShowInner==='0'">{{$t('m.i.be.setAssetType')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <rebuy-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :rebuyDetailWin="showDetilBox"
                  @closeMsgBox="closeDetil" :rootUrl="rootUrl"></rebuy-detail>

    <acct-record :param="param" :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 :url="acctRecord" @acctSubmitSure="acctSubmitSure"></acct-record>

    <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>

    <!--资产分类-->
    <assetIndustry
      :batchId="curBatchId"
      :billIds="billIds"
      :dictMap="dictObject"
      :assetInd="assetInd"
      :isAssetIndustryChooseBoolen="isAssetIndustryChooseBoolen"
      :isNeedBookTypeBoolen="isNeedBookTypeBoolen"
      :assetIndustryWin="assetIndustryWin"
      @assetIndustryClose="assetIndustryClose">
    </assetIndustry>
  </div>
</template>
<script>
  import { getDictListByGroups, getDictValueFromMap, post, formatNumber,getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyAccount",
    data() {
      return {
        batchsUrl: "/be/market/clickdeal/rebuy/rebuyAccount/func_queryBatch",
        acctRecord: "/be/market/clickdeal/rebuy/rebuyAccount/func_queryAcctRecord",
        accountUrl: "/be/market/clickdeal/rebuy/rebuyAccount/func_account",
        dictMap: new Map(),
        //资产分类
        dictObject:{},
        isShowInner:"",
        isInnerDiscSetIndustry:"",
        curBatchId:this.batchId,
        billIds:'',
        assetInd:'',
        isNeedBookTypeBoolen:false,
        isAssetIndustryChooseBoolen:false,
        assetIndustryWin:false,
        openI9flag:"",
        busiType: "",
        batchId: "",
        showPrintButton: false,
        acctSubmitFlag: false,
        columns: [
          {
            type: "radio",
            width: 50,
            title: "  ",
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showDetil(params.row.id, params.row.busiType);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "quoteNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "QuoteBusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.common.dealStatus"),
            key: "dealStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "QuoteStatus", params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.common.dealDtTm"),
            key: "dealDtTm",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "");
            }
          }, {
            title: this.$t("m.i.be.otherBrchName"),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.be.custTraderName"),
            key: "saleTraderName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.pe.dealRate"),
            key: "ratePct",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.ratePct != null && params.row.ratePct !== "") {
                let ratePct = params.row.ratePct + "(%)";
                return h("span", ratePct);
              }
            }
          },  {
            title: this.$t("m.i.be.subDeal"),
            key: "subDeal",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.subDeal);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.be.clearSpeed"),
            key: "clearSpeed",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "ClearSpeed", params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.be.settleDt"),
            key: "firstSettleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dt = params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h("span", dt);
            }
          }, {
            title: this.$t("m.i.be.settleMode"),
            key: "settleMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.be.clearType"),
            key: "clearType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "ClearType", params.row.clearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.common.totalAmtBillPackage"),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          }, {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          }, {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          }, {
            title: this.$t("m.i.be.tenorDays"),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false
          }
        ],
        formItem: {
          quoteNo: "",
          busiType: "",
          dealNo: "",
          saleBrchName: "",
          saleBrchCode: "",
          saleTraderName: "",
          saleTraderNo: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames: "",
          ownedBrchNos: "",
          authPath: this.$route.path,
          licenseFlag: this.licenseFlag
        },
        ifShowMore: false,
        showbrch: false,
        showtrader: false,
        busiTypeList: [],
        selectData: [],
        showDetilBox: false,
        rootUrl:"/be/market/clickdeal/rebuy/rebuyAccount",
        param: {},
        showAcctRecordWin: false,
        //集中授权管理
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        brchNoWin: false
      };
    },
    components: {
      TraderIdSearch: () => import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
      AssetIndustry:()=>import(/* webpackChunkName: "be/market/quote/rebuy/assetIndustry" */`@/views/bizViews/be/market/quote/rebuy/assetIndustry`),
      RebuyDetail: () => import(/* webpackChunkName: "be/market/clickdeal/rebuy/quoteRebuyDetail" */`@/views/bizViews/be/market/clickdeal/rebuy/quoteRebuyDetail`)
    },
    mounted() {
      getSingleParamValuesByKeys("bm.valuate.is_inner_set_valuate").then(res => {
        let isResetIndustry = res["bm.valuate.is_inner_set_valuate"];
        if (isResetIndustry === "" || isResetIndustry == null || isResetIndustry == undefined) {
          this.isInnerDiscSetIndustry = "0";
        } else {
          this.isInnerDiscSetIndustry = isResetIndustry;
        }
      });
      getDictListByGroups("BookType,AssetIndustryManage,CreditDeductRule,Yon,CdSelectMode,QuoteStatus,QuoteBusiType,SettleType,ClearType,ClearSpeed,CDMedia,DraftTypeCode,CreditMajor,PreRelationFlag,AssetIndustry,BillOrigin").then(res => {
        this.busiTypeList = res.get("QuoteBusiType");
        this.dictMap = res.get("map");
        this.dictObject={
          assetIndustryList:res.get("AssetIndustryManage"),
          bookTypeList:res.get("BookType")
        }
      });
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
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
        let list = this.selectData;
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
        //this.billIds=ids;
        this.curBatchId=list[0].id;
        // //资产分类是否可选，"1"可选 false 表示非只读
        // this.isAssetIndustryChooseBoolen=(this.formItem.isAssetIndustryChoose=='1'?false:true);
        // if(isAssetIndustry&&assetInd&&!this.isAssetIndustryChooseBoolen){
        //   this.assetInd=assetInd;
        // }else{
        //   this.assetInd=this.formItem.defaultAssetIndustry;
        // }
        // this.isNeedBookTypeBoolen=(this.formItem.isNeedBookType=='1'?true:false);

        this.assetIndustryWin=true;
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      onCurrentChange(data) {
        this.selectData[0] = data;
        let isInner = this.selectData[0].isInner;
        if (isInner ==="1" && this.isInnerDiscSetIndustry==="0") {
          this.isShowInner = "0";
        } else {
          this.isShowInner = "1";
        }
      },
      onCurrentChangeCancel() {
        this.selectData = [];
        this.isShowInner = "";
      },
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.saleBrchCode = info.brchCode;
        this.formItem.saleBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },*/
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
      closeBranch() {
        this.showbrch = false;
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.selectData = [];
        this.isShowInner = "";
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.formItem.saleBrchCode = "";
        this.formItem.saleTraderNo = "";
        this.formItem.saleBrchName = "";
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({
          id: info.id, licenseFlag: this.licenseFlag, ownedBrchNo: info.ownedBrchNo,
          ownedBrchName: info.ownedBrchName
        }, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if (!info.isHasPrint) {
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
      printSuccessCallback() {
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
        this.param = {
          id: list[0].id, licenseFlag: this.licenseFlag, ownedBrchNo: list[0].ownedBrchNo,
          ownedBrchName: list[0].ownedBrchName
        };
        this.showAcctRecordWin = true;
      },
      showDetil(id, busiType) {
        this.batchId = id;
        this.busiType = busiType;
        this.showDetilBox = true;
      },
      closeDetil() {
        this.showDetilBox = false;
      },
      clearVal(type) {
        if (type == "saleBrchName") {
          this.formItem.saleBrchCode = "";
          this.formItem.saleBrchName = "";
        }
        if (type == "saleTraderName") {
          this.formItem.saleTraderNo = "";
          this.formItem.saleTraderName = "";
        }
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      }
    }
  };

</script>
