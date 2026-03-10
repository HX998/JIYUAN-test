<template>
  <!--纸票贴现计息复核-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="discReCheckBatchMain" key="1">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <!--<own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWinOpen" v-if="this.licenseFlag"></own-brch-nos>-->
                  <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                               :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                               url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <cust-name :formItem = "formItem" @queryCustMessage="queryCustMessage"></cust-name>
                  <cust-acct-no :formItem = "formItem" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no>
                  <batch-no v-model="formItem.batchNo"></batch-no>
                  <query-btn v-on:showChange="showQry" :advanceShow="this.licenseFlag" :formSearch='handleSearch' :formSearchReset='resetSearch'> </query-btn>

                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                getDataFunc
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                url="/ce/disc/paper/reCheck/discReCheckBatchMain/func_pageQueryDiscBatchList"
                :on-current-change="handleSelectClick"
                :on-current-change-cancel="handleSelectClickCancel"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <bill-manage-btn @handleForm="handleForm"></bill-manage-btn>
                </div>
              </h-datagrid>
              <!-- 查询客户信息弹窗 -->
              <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
              <!-- 查询客户账号信息弹窗 -->
              <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo" :isAllBankAcct=true
                                 @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
            </div>
          </div>
        </div>
        <div v-if="discReCheckBillMain" key="2">
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="billFormItem" :label-width="90" ref="billFormItem" cols="4" class="h-form-search">
                <bill-no v-model="billFormItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <query-btn :advanceShow='false' :formSearch='billManagerHandleSearch' :formSearchReset='billManagerResetSearch'></query-btn>

              </h-form>
            </h-panel>
          </div>
        </div>
        <disc-batch-info-detail :is-show="discReCheckBillMain" :batchId="this.discBatchId"
                                :queryBatchUrl="'/ce/disc/paper/apply/discApplyBatchMain/func_queryDiscBatch'"
                                :isQuery="isQuery" funcNo="PICE020702" ref="discBatchInfoDetail"></disc-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="discReCheckBillMain" key="3">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billFormItem"
            url="/ce/disc/paper/reCheck/discReCheckBatchMain/func_pageQueryCeDiscBillList"
            :row-select="true"
            :has-select="hasSelect"
            ref="discReCheckBillDatagrid">
            <div slot="toolbar" class="pull-left">
              <recheck-pass-btn @reCheckList="reCheckList"></recheck-pass-btn>
              <recheck-back-btn @reCheckBackList="reCheckBackList"
                                :btnAuth="childrenBtnAuth"
                                ></recheck-back-btn>


              <prod-type-choose-btn v-if="openI9flag && (this.btnAuth.busiClassify === undefined ? false : this.btnAuth.busiClassify.isShow)" @prodTypeChoose="prodTypeChoose"></prod-type-choose-btn>
              <proof-print-btn @voucherPrinting="voucherPrinting"></proof-print-btn>
              <go-back-btn @returnBack="returnBack"></go-back-btn>


            </div>
          </h-datagrid>
        </div>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

      </h-col>
    </h-row>
    <!--资产分类选择界面-->
    <asset-industry :assetIndustryWin="prodTypeChooseWin" :dictMap="{'assetIndustryList': busiClassifyList}" :assetInd="prodTypeChooseFormItem.busiClassify"
                    :isAssetIndustryChooseBoolen="isAllowChangeProdType === '0'" :isAssetIndustryRequired="true" :isProdTypeChoose="true"
                    @assetIndustryClose="prodTypeChooseClose" @assetIndustryChange="prodTypeChooseSubmit" ref="prodTypeChooseFormItem"></asset-industry>
    <!--业务所属机构-->
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off ,getDictListByGroups, billMoneyDisplay, cmycurd,formatNumber, getDictValueFromMap ,accMul} from "@/api/bizApi/commonUtil";

  export default {
    name: "discReCheckBatchMain",
    components: {
      AssetIndustry:()=>import(/* webpackChunkName: "be/market/quote/rebuy/assetIndustry" */`@/views/bizViews/be/market/quote/rebuy/assetIndustry`)
      // DiscBatchInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/discBatchInfoDetail" */`@/views/bizViews/ce/disc/common/discBatchInfoDetail`) ,
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)
    },
    data() {
      let columns= [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
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
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.batchNoMain(params.row.id, params.row)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
           title: this.$t("m.i.billInfo.discDt"),
          key: "discDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.discDt == null || params.row.discDt === ""){
              return "";
            }
            let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", discDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "ratePct",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: "sumCount",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
          key: "sumMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.sumMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.common.busiType"),
          key: "prodName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.interestMethod"),
          key: "payType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"PayType",params.row.payType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t("m.i.ce.salerCustName"),
          key: "salerCustName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.salerAcctNo"),
          key: "salerAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.buyPayPcetByUnit"),
          key: "buyPayPcet",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.buyerPayInterName"),
          key: "payCustName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.buyerPayInterAcctNo"),
          key: "payAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.thirdPayPcet"),
          key: "thirdPayPcet",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.thirdCustName"),
          key: "thirdCustName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.thirdAcctNo"),
          key: "thirdAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.transCtrctNo"),
          key: "transCtrctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.busiBrchName"),
          key: "busiBrchName",
          hiddenCol: false
        },
        {
            title: this.$t("m.i.common.corpScale"),
          key: "corpScale",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"CorpScale",params.row.corpScale);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
           title: this.$t("m.i.common.isGreenCorp"),
          key: "isGreenCorp",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isGreenCorp);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
      ];
      let billColumns = [
        {
          type: "selection",
          width: 60,
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
          title: this.$t("m.i.billInfo.billNo"),
          key: "billNo",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row.billId);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "ratePct",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.outAcctNo"),
          key: "putOutNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drweBankName"),
          key: "drweBankName",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drweBankNo"),
          key: "drweBankNo",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: "remitDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.remitDt == null || params.row.remitDt === ""){
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.billMoney"),
          key: "billMoney",
          hiddenCol: false,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.ce.isOwnBankAcpt"),
          key: "isAcpt",
          hiddenCol: false,
          render:(h,params) => {
            if (params.row.isAcpt == null || params.row.isAcpt === ""){
              return "";
            }
            if (params.row.isAcpt === '1') {
              return h("span", "是");
            } else {
              return h("span", "否");
            }
          }
        },
        {
          title: this.$t("m.i.ce.isSameCity"),
          key: "isSameCity",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isSameCity);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.be.assetIndustry"),
          key: "busiClassify",
          hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.busiClassify);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.interestDueDt"),
          key: "galeDt",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.galeDt == null || params.row.galeDt === ""){
              return "";
            }
            let date = this.$moment(params.row.galeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.interestCalDays"),
          key: "interestCalDays",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.delayDays"),
          key: "delayDays",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.buyerInterest"),
          key: "buyerInterest",
          hiddenCol: false,
          render: (h, params) => {
            let buyerInterest = formatNumber(params.row.buyerInterest, 2, ',');
            return h("span", {
              domProps: {
                title: buyerInterest
              }
            }, buyerInterest);
          }
        },
        {
          title: this.$t("m.i.ce.salerInterest"),
          key: "salerInterest",
          hiddenCol: false,
          render: (h, params) => {
            let salerInterest = formatNumber(params.row.salerInterest, 2, ',');
            return h("span", {
              domProps: {
                title: salerInterest
              }
            }, salerInterest);
          }
        },
        {
          title: this.$t("m.i.ce.thirdInterest"),
          key: "thirdInterest",
          hiddenCol: false,
          render: (h, params) => {
            let thirdInterest = formatNumber(params.row.thirdInterest, 2, ',');
            return h("span", {
              domProps: {
                title: thirdInterest
              }
            }, thirdInterest);
          }
        },
        {
          title: this.$t("m.i.ce.realPayAmt"),
          key: "realPayAmt",
          hiddenCol: false,
          render: (h, params) => {
            let realPayAmt = formatNumber(params.row.realPayAmt, 2, ',');
            return h("span", {
              domProps: {
                title: realPayAmt
              }
            }, realPayAmt);
          }
        },
        {
          title: this.$t("m.i.ce.bankPayAmt"),
          key: "payAmt",
          hiddenCol: false,
          render: (h, params) => {
            let payAmt = formatNumber(params.row.payAmt, 2, ',');
            return h("span", {
              domProps: {
                title: payAmt
              }
            }, payAmt);
          }
        },
        {
          title: this.$t("m.i.ce.buyerCustName"),
          key: "buyerCustName",
          hiddenCol: false
        },
      ];
      return {
        formItem : {
          custName: "",
          custAcctNo: "",
          custNo:"",
          batchNo:"",
          funcNo:"PICE020702",
          billClass:"ME01",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
        },
        billFormItem : {
          billNo:"",
          funcNo:"PICE020702",
          batchId:"",
          reverseBillNo: ""
        },
        btnAuth:"",
        childrenBtnAuth:{},
        columns : columns,
        billColumns : billColumns,
        isList : [],
        protectTypeList : [],
        rateTypeList : [],
        payTypeList : [],
        billTypeList : [],
        corpScaleList : [],
        dictMap : new Map(),
        prodTypeChooseWin : false,
        //业务分类界面
        prodTypeChooseFormItem : {
          busiClassify:"1",
          batchId:"",
          discIds:""
        },
        submitFlag : false,
        isAllowChangeProdType : '1',
        busiClassifyList : [],
        discReCheckBatchMain : true,
        discReCheckBillMain : false,
        showCustAcctNoWin : false,
        openI9flag:false,
        showCustMessageWin : false,
        ifShowMore : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        discBatchId : "",
        isQuery : false,
        showBillInfoWin : false,
        billId : "",
        hasSelect : false,
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billColumns),
        //业务所属机构
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath:this.$route.path ,
        //当前贴现客户信息，凭证打印用
        selectedCustName: "",
        selectedCustNo: "",
        selectedOpenBankNo: "",
        selectedAcctNo: "",
        // brchNoWin : false,
      };
    },
    mounted() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      getDictListByGroups("QueryType,ArbitrateMode,ProtectType,RateType,PayType,DraftTypeCode,CorpScale,Yon,AssetIndustryManage,AssetIndustry").then(res => {
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
        this.busiClassifyList = res.get("AssetIndustryManage");
      });
      post({ paramKey: "ce.disc.default_prod_type" }, "/sm/auth/systemParameter/findSystemParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.prodTypeChooseFormItem.busiClassify = res.data.retMsg ? res.data.retMsg : "1"
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      post({ paramKey: "ce.disc.is_allow_change_prod_type" }, "/sm/auth/systemParameter/findSystemParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.isAllowChangeProdType = res.data.retMsg;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if(this.btnAuth.manager!=null&&this.btnAuth.manager!=undefined){
              if(this.btnAuth.manager.children!=null&&this.btnAuth.manager.children!=undefined) {
                this.childrenBtnAuth = this.btnAuth.manager.children;
              }
            }
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let  columns = [];
            if (this.licenseFlag) {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.temp = this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      showQry(val){
        this.ifShowMore = val;
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "custAcctNo"){
          this.formItem.custAcctNo = "";
        }
      },
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
        this.formItem.batchId = this.discBatchId;
        this.$refs.datagrid.selectIds = [];
      },
      //重置查询结果
      resetSearch() {
        // this.$refs.formItem.resetFields();
        this.formItem.custNo = '';
        this.formItem.custName = '';
        this.formItem.custAcctNo = '';
        this.formItem.batchNo = '';
        this.billFormItem.billNo = '';
        this.billFormItem.reverseBillNo = '';
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      handleSelectClickCancel() {
        this.currentSelectList = [];
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.discReCheckBillDatagrid.selects = [];
          this.$refs.discReCheckBillDatagrid.selectIds = [];
          this.$refs.discReCheckBillDatagrid.dataChange(1);
        })
      },
      //票据管理界面重置
      billManagerResetSearch(){
        this.$refs.billFormItem.resetFields();
      },
      //票据管理界面行选中
      discReCheckBillHandleSelectClick(arr, selectInx) {
        this.currentBillSelectList = arr;
        this.currentBillSelectRowInx = selectInx;
      },
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //票据管理
      handleForm() {
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.selectedCustName = this.currentSelectList.custName;
        this.selectedCustNo = this.currentSelectList.custNo;
        this.selectedOpenBankNo = this.currentSelectList.aoAcctBankNo;
        this.selectedAcctNo = this.currentSelectList.custAcctNo;

        this.discReCheckBatchMain = false;
        this.discBatchId = this.currentSelectList.id;
        this.billFormItem.batchId = this.currentSelectList.id;
        this.isQuery = true;
        this.discReCheckBillMain = true;
        this.billManagerHandleSearch();
        this.$nextTick(() => {
          this.billColumns = this.deepClone(this.billTemp);
          this.$refs.discReCheckBillDatagrid.selfAdaption();
          this.$refs.discReCheckBillDatagrid.createShowCol(this.billTemp);
        });
      },
      //返回
      returnBack() {
        this.selectedCustName = '';
        this.selectedCustNo = '';
        this.selectedOpenBankNo = '';
        this.selectedAcctNo = '';
        this.currentSelectList = [];
        this.currentBillSelectList = [];
        this.isQuery = false;
        this.resetSearch();
        this.discReCheckBillMain = false;
        this.discReCheckBatchMain = true;
        this.$nextTick(() => {
          this.columns = this.deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
        });
      },
      //复核通过按钮下拉选择“选择复核通过/批次复核通过”
      reCheckList(str){
        if(str === "select"){
          this.reCheckSelect();
        }
        if(str === "batch"){
          this.reCheckBatch();
        }
      },
      //选择复核通过
      reCheckSelect(){
        if(this.$refs.discReCheckBillDatagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let dataList=this.$refs.discReCheckBillDatagrid.selects;
        let flag=window.sessionStorage.getItem("isOpenI9")=="1"?true:false;
        if(flag){
          for(let i=0;i<dataList.length ; i++){
            if(dataList[i].busiClassify==null || dataList[i].busiClassify=="" || dataList[i].busiClassify==undefined){
              this.$msgTip.info(this, { info: "资产分类为空的票不允许提交" });
              return;
            }
          }
        }
        let operType = "0";
        let funcNo = "PICE020702";
        let ids = this.$refs.discReCheckBillDatagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定选择复核通过吗?",
          onOk: () => {
            post({discIds:ids,operType:operType,funcNo:funcNo}, "/ce/disc/paper/reCheck/discReCheckBatchMain/func_discReCheckPass\n").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if(this.$refs.discReCheckBillDatagrid.total === this.$refs.discReCheckBillDatagrid.selects.length) {
                    this.returnBack();
                  }else{
                    this.$refs.discBatchInfoDetail.getBatchInfo();
                    this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
                    this.currentBillSelectList = [];
                    this.$refs.discReCheckBillDatagrid.selects = [];
                    this.$refs.discReCheckBillDatagrid.selectIds = [];
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //批次复核通过
      reCheckBatch() {
        console.log(this.$refs.discReCheckBillDatagrid.tData)
        let dataList=this.$refs.discReCheckBillDatagrid.tData;
        let flag=window.sessionStorage.getItem("isOpenI9")=="1"?true:false;
        console.log(flag)
        if(flag){
          for(let i=0;i<dataList.length ; i++){
            if(dataList[i].busiClassify==null || dataList[i].busiClassify=="" || dataList[i].busiClassify==undefined){
              this.$msgTip.info(this, { info: "资产分类为空的票不允许提交" });
              return;
            }
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次复核通过吗？",
          onOk: () => {
            this.handleReCheckBatch();
          }
        });
      },
      handleReCheckBatch() {
        let operType = "1";
        let funcNo = "PICE020702";
        post({ batchId:this.discBatchId,operType:operType,funcNo:funcNo }, "/ce/disc/paper/reCheck/discReCheckBatchMain/func_discReCheckPass").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
              this.currentBillSelectList = [];
              this.$refs.discReCheckBillDatagrid.selects = [];
              this.$refs.discReCheckBillDatagrid.selectIds = [];
              this.returnBack();
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //退回按钮下拉选择“选择退回/批次退回”
      reCheckBackList(str){
        if(str === "select"){
          this.reCheckSelectBack();
        }
        if(str === "batch"){
          this.reCheckBatchBack();
        }
      },
      //业务类型选择界面
      prodTypeChoose() {
        this.prodTypeChooseWin = true;
      },
      prodTypeChooseClose() {
        this.prodTypeChooseWin = false;
      },
      //业务类型选择界面提交
      prodTypeChooseSubmit(assetIndustryRef, assetIndustry) {
        this.prodTypeChooseFormItem.batchId = this.discBatchId;
        let ids = this.$refs.discReCheckBillDatagrid.selectIds.join(",");
        this.prodTypeChooseFormItem.discIds = ids;
        let funcNo = "PICE020702";
        this.$refs["prodTypeChooseFormItem"].$refs[assetIndustryRef].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post({busiClassify:assetIndustry,funcNo:funcNo,
              batchId:this.prodTypeChooseFormItem.batchId,discIds:this.prodTypeChooseFormItem.discIds}, "/ce/disc/paper/reCheck/discReCheckBatchMain/func_updateBusiClassify").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.prodTypeChooseWin = false;
                  this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
                  this.$refs.discReCheckBillDatagrid.$refs.discReCheckBillDatagrid.clearElevator();
                  this.currentSelectList = [];
                  this.$refs.discReCheckBillDatagrid.selects = [];
                  this.$refs.discReCheckBillDatagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
                  this.$refs.discReCheckBillDatagrid.$refs.gridPage.clearElevator();
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //选择退回
      reCheckSelectBack(){
        if(this.$refs.discReCheckBillDatagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let operType = "0";
        let funcNo = "PICE020702";
        let ids = this.$refs.discReCheckBillDatagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定选择退回吗?",
          onOk: () => {
            post({discIds:ids,operType:operType,funcNo:funcNo}, "/ce/disc/paper/reCheck/discReCheckBatchMain/func_discReCheckBack").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.prodTypeChooseWin = false;
                  if(this.$refs.discReCheckBillDatagrid.total === this.$refs.discReCheckBillDatagrid.selects.length) {
                    this.returnBack();
                  }else{
                    this.$refs.discBatchInfoDetail.getBatchInfo();
                    this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
                    this.currentBillSelectList = [];
                    this.$refs.discReCheckBillDatagrid.selects = [];
                    this.$refs.discReCheckBillDatagrid.selectIds = [];
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //批次退回
      reCheckBatchBack() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次退回吗？",
          onOk: () => {
            this.handleReCheckBatchBack();
          }
        });
      },
      handleReCheckBatchBack() {
        let operType = "1";
        let funcNo = "PICE020702";
        post({ batchId:this.discBatchId,operType:operType,funcNo:funcNo }, "/ce/disc/paper/reCheck/discReCheckBatchMain/func_discReCheckBack").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
              this.currentBillSelectList = [];
              this.$refs.discReCheckBillDatagrid.selects = [];
              this.$refs.discReCheckBillDatagrid.selectIds = [];
              this.returnBack();
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //凭证打印
      voucherPrinting(printType){
          let vocherData = [];
          if(printType == "select"){
              //选择打印
              if(this.$refs.discReCheckBillDatagrid.selects.length === 0) {
                  this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
                  return;
              }
             vocherData = this.deepClone(this.$refs.discReCheckBillDatagrid.selects);
              this.queryTempCOnf(vocherData);
          }else{
              //批次打印
              let url="/ce/disc/paper/reCheck/discReCheckBatchMain/batchPrint";
              let param = {funcNo:"PICE020702",batchId : this.discBatchId};
              post(param, url).then(res => {
                  if (res) {
                      let return_code = res.data.retCode;
                      if (return_code === "000000") {
                          vocherData = res.data.retData;
                          this.queryTempCOnf(vocherData);
                      }else {
                          this.$msgTip.error(this, { info: res.data.retMsg });
                      }
                  }else {
                      this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                  }
              });
          }
      },
      //获取打印模板
      queryTempCOnf(vocherData){
          let url = '/pe/print/voucherPrint/voucherPrintManger/queryTempConf';
          let params = {voucherType: "PE030602"};
          post(params, url).then(res => {
              if (res) {
                  let return_code = res.data.retCode;
                  if (return_code === "000000") {
                      let templateInfo = res.data.retData.tempContent;
                      this.assembleDiscParams(templateInfo,vocherData);
                  }else {
                      this.$msgTip.error(this, { info: res.data.retMsg });
                  }
              }else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
          });
      },
      //组装打印数据
      assembleDiscParams(templateInfo,vocherData) {
        for (let i = 0; i < vocherData.length; i++) {
          let currentDate = this.$moment(new Date()).format("YYYYMMDD");
          vocherData[i].yyyy = currentDate.toString().substring(0, 4);
          vocherData[i].mm = currentDate.toString().substring(4, 6);
          vocherData[i].dd = currentDate.toString().substring(6, 8);
          let remitDt = vocherData[i].remitDt;
          vocherData[i].remitYear =remitDt.toString().substring(0, 4);
          vocherData[i].remitMonth = remitDt.toString().substring(4, 6);
          vocherData[i].remitDate = remitDt.toString().substring(6, 8);
          let dueDt = vocherData[i].dueDt;
          vocherData[i].dueYear =dueDt.toString().substring(0, 4);
          vocherData[i].dueMonth = dueDt.toString().substring(4, 6);
          vocherData[i].dueDate = dueDt.toString().substring(6, 8);
          let billMoney = vocherData[i].billMoney === null ? "0" : vocherData[i].billMoney;
          vocherData[i].billMoney = cmycurd(vocherData[i].billMoney);
          let tempMoney = "¥" + billMoney.toString();
          billMoneyDisplay(tempMoney, vocherData[i], "b");
          let interest = vocherData[i].interest === null ? "0" : vocherData[i].interest;
          let tempInterest = "¥" + interest.toString();
          billMoneyDisplay(tempInterest, vocherData[i], "r");
          let realPayAmt = vocherData[i].realPayAmt === null ? "0" : vocherData[i].realPayAmt;
          let tempRealPayAmt = "¥" + realPayAmt.toString();
          billMoneyDisplay(tempRealPayAmt, vocherData[i]);
          let billType = vocherData[i].billType;
          if('2' === billType){
            billType='商承贴现';
          } else {
            billType='银承贴现';
          }
          vocherData[i].custNo = this.selectedCustNo;
          vocherData[i].custName = this.selectedCustName;
          vocherData[i].openBankNo = this.selectedOpenBankNo;
          vocherData[i].custAcctNo = this.selectedAcctNo;

          vocherData[i].billType = billType;
          vocherData[i].flowNo = vocherData[i].acctFlowId;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);
          //打印
          let lodop =  this.$print.getLodop(null,null,this);
          this.$print.vouchPrint(this,lodop,vocherData.length,i+1,templateInfo,vocherData[i],false);
          this.currentSelectList = [];
          this.$refs.discReCheckBillDatagrid.selects = [];
          this.$refs.discReCheckBillDatagrid.dataChange(this.$refs.discReCheckBillDatagrid.pageInfo.pageNo);
       }
      },
      //批次编号超链接
      batchNoMain(str, row) {
        this.discBatchId = str;
        this.billFormItem.batchId = this.discBatchId;
        this.isQuery = true;
        this.discReCheckBatchMain = false;
        this.discReCheckBillMain = true;

        this.selectedCustName = row.custName;
        this.selectedCustNo = row.custNo;
        this.selectedOpenBankNo = row.aoAcctBankNo;
        this.selectedAcctNo = row.custAcctNo;

        this.$nextTick(() => {
          this.billColumns = this.deepClone(this.billTemp);
          this.$refs.discReCheckBillDatagrid.selfAdaption();
          this.$refs.discReCheckBillDatagrid.createShowCol(this.billTemp);
        });
        this.billManagerHandleSearch();
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.showBillInfoWin = true;
      },

    /*  //根据弹框所选数据进行赋值
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
        this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    }
  };
</script>

<style scoped>

</style>
