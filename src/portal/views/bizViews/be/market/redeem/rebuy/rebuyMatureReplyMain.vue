<!-- 返售交易确认 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')" :title="formItem.ownedBrchNames" ></h-input>
                </h-form-item>-->

                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.be.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
                  <h-input v-model="formItem.dealNo">
                  </h-input>
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
                <!--<h-form-item :label="$t('m.i.be.otherBrchName')" prop="saleBrchName">
                  <h-input @on-click="showbrch = true" v-model="formItem.saleBrchName" icon="search"
                           clearable @on-clear="clearVal('saleBrchName')" readonly>
                  </h-input>
                </h-form-item>-->
                <show-cpes-branch :label="$t('m.i.be.otherBrchName')"
                                  :brchCode.sync="formItem.saleBrchCode"  :cpesBrchName.sync="formItem.saleBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary"  @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid :columns="columns"
                          highlight-row
                          url="/be/market/redeem/rebuy/rebuyMatureReplyMain/func_queryRebuyMatureReplyList"
                          :bindForm="formItem"
                          :onCurrentChange="onCurrentChange"
                          :onCurrentChangeCancel="onCurrentChangeCancle"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="send">{{$t('m.i.common.send')}}</h-button>
                  <h-button type="primary" @click="returnEdit">{{$t('m.i.be.returnApply')}}</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--<brch-code-search :showCpesBranch="showbrch" @showCpesBranchClose="closeBranch" @showCpesBranchSubmit="brchCodeChange"></brch-code-search>-->
    <rebuy-mature-detil :showmsg="showmsg" :batchId="batchId" @closeMsgBox="closeMsgBox" :billListURL="billListURL"></rebuy-mature-detil>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>
<script>
  import { formatNumber,  post } from '@/api/bizApi/commonUtil';

  export default {
    name : 'rebuyMatureReplyMain',
    data() {
      return {
        dictMap : new Map(),
        columns : [
          {
            title: " ",
            type: 'radio',
            align: 'center',
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 60,
            hiddenCol: false
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
            sortable: true,
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            hiddenCol: false,
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
              console.log(this.dictMap);
              let list = this.getDictValueFromMap(this.dictMap, "RebuyRedeemStatus", params.row.redeemStatus);
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
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
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
          },
        ],
        formItem : {
          batchNo: "",
          dealNo: "",
          billType: "",
          billClass: "",
          saleBrchName: "",
          saleBrchCode: "",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          licenseFlag:this.licenseFlag,
        },
        selectData : null,
        ifShowMore : false,
        busiTypeList : [],
        //showbrch : false,
        showTransDetil : false,
        brchTreeData:[],
        isDisabled : false,
        brchNameSelectWin:false,
        billTypeList : [],
        redeemStatusList : [],
        billClassList : [],
        redeemTypeList : [],
        showmsg : false,
        batchId : "",
        //集中授权管理
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        //brchNoWin : false,
        billListURL : "/be/market/redeem/rebuy/rebuyMatureReplyMain/func_queryRebuyMatureBillList"
      }
    },
    components: {
      //BrchCodeSearch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
       RebuyMatureDetil:()=>import(/* webpackChunkName: "be/market/redeem/rebuy/rebuyMatureDetil" */`@/views/bizViews/be/market/redeem/rebuy/rebuyMatureDetil`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    mounted() {
      this.getDictListByGroups('BusiType,SettleType,CDMedia,DraftTypeCode,RedeemType,RebuyRedeemStatus,RedeemReason').then(res => {
        this.busiTypeList = res.get("BusiType");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.redeemTypeList = res.get("RedeemType");
        this.redeemStatusList = res.get("RedeemStatus");
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
    },
    methods: {
      /*clearVal(type){
        if(type == 'saleBrchName'){
          this.formItem.saleBrchCode = '';
          this.formItem.saleBrchName = '';
        }
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录" });
          return;
        }
        this.formItem.saleBrchCode = info.brchCode;
        this.formItem.saleBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },*/
      /*closeBranch() {
        this.showbrch = false;
      },*/
      formSearch() {
        this.selectData=null
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.formItem.saleBrchCode = "";
        this.formItem.saleBrchName = "";
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      send() {
        if (this.selectData === null) {
          this.$msgTip.info(this, { info: "请先选择记录" });
        } else {
          this.$hMsgBox.confirm({
            title: "发送申请",
            content: "确定要发送申请吗?",
            onOk: () => {
              this.SendMessage("send")
            }
          });
        }
      },
      returnEdit() {
        if (this.selectData === null) {
          this.$msgTip.info(this, { info: "请先选择记录" });
        } else {
          this.$hMsgBox.confirm({
            title: "退回申请",
            content: "确定要退回申请吗?",
            onOk: () => {
              this.SendMessage("returnEdit")
            }
          });
        }
      },
      SendMessage(type) {
        if (type === 'send') {
          this.postsomethings("/be/market/redeem/rebuy/rebuyMatureReplyMain/func_sendRebuyMature")
        } else if (type === 'returnEdit') {
          this.postsomethings("/be/market/redeem/rebuy/rebuyMatureReplyMain/func_rebuyMatureReturn")
        }
      },
      postsomethings(url) {
        let obj = Object.assign({}, this.selectData, {
          "licenseFlag": this.licenseFlag,
        });
        post(obj, url).then(res => {
          if (res.data.retCode === '000000') {
            this.$msgTip.success(this, { info: this.$t('m.i.common.actionSuccess') });
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
          this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
        })
      },
      closeMsgBox(){
        this.showmsg = false;
      },
      showBatchDetil(batchId){
        this.batchId = batchId;
        this.showmsg = true;
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
  }

</script>
