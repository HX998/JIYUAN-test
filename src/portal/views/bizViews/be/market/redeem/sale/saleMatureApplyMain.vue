<!-- 到期管理-回购 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.be.isCommit')" prop="isCommit">
                  <h-radio-group v-model="formItem.isCommit" >
                    <h-radio label="0" @on-click="noCommitButton">
                      <span>未提交</span>
                    </h-radio>
                    <h-radio label="1" @on-click="hasCommitButton">
                      <span>已提交</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
             <!--   <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')" :title="formItem.ownedBrchNames" ></h-input>
                </h-form-item>
-->
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.be.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
                  <h-input v-model="formItem.dealNo" :maxlength="24"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <!--<h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}-->
                    <!--</h-option>-->
                    <h-option value="BT02">质押式回购</h-option>
                    <h-option value="RBT02">再贴现质押回购</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName">
                  <h-input v-model="formItem.buyBrchName" readonly icon="android-search"
                           @on-click="queryCpesBrchCode" :maxlength="60" :title="formItem.buyBrchName"
                           clearable @on-clear="clearVal('buyBrchName')"></h-input>
                </h-form-item>-->
                <show-cpes-branch :label="$t('m.i.be.otherBrchName')"
                                  :brchCode.sync="formItem.buyBrchCode"  :cpesBrchName.sync="formItem.buyBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary"  @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid
                :columns="columns"
                highlight-row
                url="/be/market/redeem/sale/saleMatureApplyMain/func_querySaleMatureBatchAplList"
                :bindForm="formItem"
                :notSetWidth="true"
                :onCurrentChange="handleCurrentChange"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="applyEdit" :disabled="hasCommit">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="refuseApply" :disabled="hasCommit">{{$t('m.i.be.refuse')}}</h-button>
                  <h-button type="primary" @click="cancelAppl()" :disabled="noCommit">{{$t('m.i.common.revoke')}}</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票据机构查询-->
    <!--<brch-code-search :showCpesBranch="showCpesBrchWin" @showCpesBranchClose="closeBranch"
                      @showCpesBranchSubmit="brchCodeChange"></brch-code-search>-->
    <!--修改申请单弹出框-->
    <sale-mature-apply-edit :applyEditWin="applyEditWin" :applyEditParams="applyEditParams" :dictList="dictList" :isShowPyeeInfo="isShowPyeeInfo"
                            @applyEditWinClose="applyEditWinClose" :licenseFlag="this.licenseFlag"></sale-mature-apply-edit>
    <!--拒绝申请弹出框-->
    <refuse-apply :refuseApplyWin="refuseApplyWin" :refuseParams="refuseParams"
                  @refuseApplyWinWinClose="refuseApplyWinWinClose"   @refuseApplyError="refuseApplyError"
                  @refuseApplySubmit="refuseApplySubmit"></refuse-apply>
    <sale-mature-detil :showmsg="showmsg" :batchId="batchId" :isShowPyeeInfo="isShowPyeeInfo" @closeMsgBox="closeMsgBox"></sale-mature-detil>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>
<script>
  import { on, off, post,formatNumber,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "saleMatureApplyMain",
    data() {
      return {
        ifShowMore : false,
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
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
              return h("a", {
                on: {
                  click: () => {
                    this.showBatchDetil(params.row.id);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.be.dealNo'),
            key: "dealNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.redeemStatus'),
            key: "redeemStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RedeemStatus", params.row.redeemStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.brchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "buyBrchName",
            hiddenCol: false,
            sortable: true,

          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.settleMode'),
            key: "settleMode",
            hiddenCol: false,
            render:(h, params)=> {
              let list = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.firstTransRate'),
            key: "ratePct",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.redeemRate'),
            key: "dueRatePct",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.redeemType'),
            key: "redeemType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RedeemType", params.row.redeemType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.redeemReason'),
            key: "redeemReason",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RedeemReason", params.row.redeemReason);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.reqDealOpin'),
            key: "reqDealOpin",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.orginDueSettleDt'),
            key: "dueSettleDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let date = params.row.dueSettleDt == null ? "" : this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.be.redeemSumAmtByUnit'),
            key: "redeemSumAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.redeemSumAmt, 2, ','));
            }
          },
          {
            title: this.$t('m.i.be.redeemSumBuyTotalAmtByUnit'),
            key: "redeemSumBuyTotalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.redeemSumBuyTotalAmt, 2, ','));
            }
          },
          {
            title: this.$t('m.i.be.trialInterestByUnit'),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueInterest, 2, ','));
            }
          },
          {
            title: this.$t('m.i.be.duePayInterestByUnit'),
            key: "duePayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.duePayInterest, 2, ','));
            }
          },
          {
            title: this.$t('m.i.be.trialDueInterestByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueSettleAmt, 2, ','));
            }
          },
          {
            title: this.$t('m.i.be.duePayAmtByUnit'),
            key: "duePayAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.duePayAmt, 2, ','));
            }
          },
          {
            title: this.$t('m.i.be.redeemTotalNumBillPackage'),
            key: "redeemSumNum",
            hiddenCol: false
          }
        ],
        formItem : {
          batchNo: "",
          dealNo: "",
          busiType: "",
          billType: "",
          billClass: "",
          buyBrchName: "",
          buyBrchCode: "",
          isCommit: "0",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          licenseFlag:this.licenseFlag,
        },
        currentSelectRow : null,
        busiTypeList : [],
        billTypeList : [],
        billClassList : [],
        redeemTypeList : [],
        adjustTypeList : [],
        dictMap : new Map(),
        //票据机构弹出框
        //showCpesBrchWin : false,
        //修改申请单弹出框
        applyEditWin : false,
        hasCommit : false,
        noCommit : true,
        //集中授权管理
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        isShowPyeeInfo:"",
        authPath: this.$route.path ,
        btnAuth:"",
       // brchNoWin : false,
        applyEditParams : {
          batchId: ""
        },
        showmsg : false,
        batchId : "",
        //拒绝申请弹出框
        refuseApplyWin : false,
        refuseParams : {
          batchId: ""
        },
        dictList : {
          busiTypeList: [],
          billTypeList: [],
          billClassList: [],
          redeemTypeList: [],
          adjustTypeList: []
        }
      }
    },
    components: {
      RefuseApply:()=>import(/* webpackChunkName: "be/market/redeem/sale/refuseApply" */`@/views/bizViews/be/market/redeem/sale/refuseApply`),
      SaleMatureApplyEdit:()=>import(/* webpackChunkName: "be/market/redeem/sale/saleMatureApplyEdit" */`@/views/bizViews/be/market/redeem/sale/saleMatureApplyEdit`),
      //BrchCodeSearch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      SaleMatureDetil:()=>import(/* webpackChunkName: "be/market/redeem/sale/saleMatureDetil" */`@/views/bizViews/be/market/redeem/sale/saleMatureDetil`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    methods: {
      buttonAuthShow(){
        //按钮权限查询 控制按钮显隐
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
              if (this.btnAuth.isShowPyeeInfo === undefined ? true : this.btnAuth.isShowPyeeInfo.isShow) {
                this.isShowPyeeInfo = '1';
              } else {
                this.isShowPyeeInfo = '0';
              }
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      /*clearVal(type){
        if(type == 'buyBrchName'){
          this.formItem.buyBrchCode = '';
          this.formItem.buyBrchName = '';
        }
      },*/
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.buyBrchCode = "";
        this.formItem.buyBrchName = "";
        this.$refs.formItem.resetFields();
        this.noCommitButton();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //修改申请
      applyEdit() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.applyEditParams.batchId = this.currentSelectRow.id;
          this.dictList.busiTypeList = this.busiTypeList;
          this.dictList.billTypeList = this.billTypeList;
          this.dictList.billClassList = this.billClassList;
          this.dictList.redeemTypeList = this.redeemTypeList;
          this.dictList.adjustTypeList = this.adjustTypeList;
          this.dictList.redeemReasonList = this.redeemReasonList;
          this.dictList.settleTypeList = this.settleTypeList;
          this.applyEditWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.applyEditWin = false;
        }
      },
      applyEditWinClose() {
        this.applyEditWin = false;
        this.applyEditParams.batchId = "";
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      //拒绝申请
      refuseApply() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.refuseParams.batchId = this.currentSelectRow.id;
          this.refuseApplyWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.refuseApplyWin = false;
        }
      },
      refuseApplyWinWinClose() {
        this.refuseApplyWin = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.currentSelectRow = [];
      },
      refuseApplyError() {
        this.refuseApplyWin = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      refuseApplySubmit() {
        this.refuseApplyWin = false;
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      /*queryCpesBrchCode() {
        this.showCpesBrchWin = true;
      },*/
      /*closeBranch() {
        this.showCpesBrchWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        this.formItem.buyBrchCode = info.brchCode;
        this.formItem.buyBrchName = info.brchFullNameZh;
        this.showCpesBrchWin = false;
      },*/
      noCommitButton(){
        this.noCommit = true;
        this.hasCommit = false;
        this.formItem.isCommit='0';
        this.handleQuoteAppSearch();
      },
      //已提交
      hasCommitButton(){
        this.hasCommit = true;
        this.noCommit = false;
        this.formItem.isCommit='1';
        this.handleQuoteAppSearch();
      },
      handleQuoteAppSearch(){
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      closeMsgBox(){
        this.showmsg = false;
      },
      showBatchDetil(batchId){
        this.batchId = batchId;
        this.showmsg = true;
      },
      cancelAppl(){
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t('m.i.common.onlyChooseOneData') });
          return
        }
        if(this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要撤销申请吗") + "?",
          onOk: () => {
            let id = this.currentSelectRow.id;
            post({ id: id }, '/be/market/redeem/sale/saleMatureApplyMain/func_cancelApply').then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo)
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            })
          }
        });
      },

      //根据弹框所选数据进行赋值
      /*brchNoChange(info) {
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
      brchNoWinOpen() {
        this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    },

    mounted() {
      this.getDictListByGroups("BusiType,DraftTypeCode,CDMedia,RedeemType,RedeemStatus,RedeemReason,InterestAdjustType,SettleType").then(res => {
        this.busiTypeList = res.get("BusiType");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.redeemTypeList = res.get("RedeemType");
        this.adjustTypeList = res.get("InterestAdjustType");
        this.redeemReasonList = res.get("RedeemReason");
        this.settleTypeList = res.get("SettleType");
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
      this.buttonAuthShow();
    }
  };

</script>
