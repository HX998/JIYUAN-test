<!-- 回购跟踪查询 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.be.brchName')" prop="brchName">
                  <h-input v-model="formItem.brchName" placeholder="" icon="android-search" :title="formItem.brchName"
                           clearable @on-clear="clearVal('brchName')"@on-click="queryBranchName('query')" readonly></h-input>
                </h-form-item>-->

                <show-branch v-model="formItem.brchName" :label="$t('m.i.be.brchName')"   prop="brchName"
                                 :showCheckBox="true"     :brchNo.sync="formItem.transBrchNos" :brchName.sync="formItem.brchName">
                </show-branch>

                <h-form-item :label="$t('m.i.be.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
                  <h-input v-model="formItem.dealNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option value="BT02">质押式回购</h-option>
                    <h-option value="RBT02">再贴现质押回购</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.redeemStatus')" prop="redeemStatus">
                  <h-select  v-model="formItem.redeemStatus" placeholder="">
                    <h-option v-for="item in redeemStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
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
                <h-form-item :label="$t('m.i.be.isAcct')" prop="dueAcctFlag">
                  <h-select  v-model="formItem.dueAcctFlag" placeholder="">
                    <h-option  value="0">未记账</h-option>
                    <h-option  value="1">已记账</h-option>
                  </h-select>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName">
                  <h-input @on-click="showbrch = true" v-model="formItem.buyBrchName" icon="search" readonly :title="formItem.buyBrchName">
                  </h-input>
                </h-form-item>-->
                <show-cpes-branch :label="$t('m.i.be.otherBrchName')"
                                  :brchCode.sync="formItem.buyBrchCode"  :cpesBrchName.sync="formItem.buyBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.common.applDt')" prop="applDate">
                  <h-date-picker type="daterange" autoPlacement :value="applDate" format="yyyy-MM-dd" showFormat placeholder="" @on-change="handleApplDateChange"></h-date-picker>
                </h-form-item>
                <common-type-field-range v-model="formItem" :label="$t('m.i.be.redeemRate')" :integerNum="2" :suffixNum="4" :validRules="ratePctRule" :bigTips="false"
                                         :rangeProps="['minDueRatePct','maxDueRatePct']"></common-type-field-range>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary"  @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid
                :columns="columns"
                url="/be/market/redeem/sale/saleMatureTransMonitor/func_querySaleMatureTransList"
                :bindForm="paramItem"
                :hasSelect="hasSelect"
                :rowSelect = true
                :onSelectChange="handleSelectClick"
                :notSetWidth="true"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="transDetail">{{$t('m.i.be.transDetail')}}</h-button>
                  <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--<brch-code-search :showCpesBranch="showbrch" @showCpesBranchClose="closeBranch" @showCpesBranchSubmit="brchCodeChange"></brch-code-search>-->

    <!--<show-branch :showBranchWin="brchNameSelectWin" title="机构名称" @brchNoChange="brchNameAdd" ifcheck="isTrue"
                 :checkStrictly="true" @showBranchWinClose="brchNoWinClose"></show-branch>-->

    <sale-mature-detil :showmsg="showmsg" :batchId="batchId" @closeMsgBox="closeMsgBox"></sale-mature-detil>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>
<script>
  import { post,formatNumber } from '@/api/bizApi/commonUtil'

  export default {
	name : 'saleMatureTransMonitor',
    data() {
      return {
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        dictMap : new Map(),
        paramItem : {},
        formItem : {
          brchName:"",
          transBrchNos:"",
          batchNo: "",
          dealNo: "",
          busiType: "",
          redeemStatus: "",
          billType: "",
          billClass: "",
          dueAcctFlag: "",
          applDate:"",
          minApplDt:"",
          maxApplDt:"",
          minDueRatePct:"",
          maxDueRatePct:"",
          buyBrchName: "",
          buyBrchCode: ""
        },
        viewDatailForm : {
          busiType: '',
          batchNo:'',
          dealNo: '',
          brchName: '',
          saleBrchCode: '',
          saleBrchName: '',
          buyBrchCode: '',
          buyBrchName: '',
          billType: '',
          billClass: '',
          dueSettleDt: '',
          applDt: '',
          redeemType: '',
          ratePct: '',
          dueRatePct: '',
          totalNum: '',
          totalAmt: '',
          buyBackTotalAmt: '',
          redeemSumNum: '',
          redeemSumAmt: '',
          redeemSumBuyTotalAmt: '',
          dueInterest: '',
          dueSettleAmt: '',
          duePayInterest: '',
          duePayAmt: '',
          batchId: '',
        },
        applDate:[],
         columns : [
          {
            type: 'selection',
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
            sortable: true,
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
            title: this.$t('m.i.be.dueClearStatus'),
            key: "dueClearStatus",
            hiddenCol: false ,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "StlResult", params.row.dueClearStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.dueAcctFlag'),
            key: "dueAcctFlag",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.dueAcctFlag);
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
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "buyBrchName",
            hiddenCol: false,
            sortable: true
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
            title: this.$t('m.i.be.redeemRate'),
            key: "dueRatePct",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.be.sgnupMark'),
            key: "respFlag",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SignUpMarkCode", params.row.respFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.sgnOpin'),
            key: "sgnOpin",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.signUpMarkCode'),
            key: "signUpMarkCode",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SignUpMarkCode", params.row.signUpMarkCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.apvOpin'),
            key: "apvOpin",
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
            title: this.$t('m.i.be.duePayInterestByUnit'),
            key: "duePayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.duePayInterest, 2, ','));
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
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.be.redeemTotalNumBillPackage'),
            key: "redeemSumNum",
            hiddenCol: false
          },
        ],

        //表格内选中的数据的id号
        selection : {
          batchId: ''
        },
        selectData : [],
        ifShowMore : false,
        busiTypeList : [],
        //showbrch : false,
        showmsg : false,
        batchId : "",
        brchTreeData:[],
        isDisabled : false,
        //brchNameSelectWin:false,
        hasSelect : false,
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        redeemStatusList : [],
        billTypeList : [],
        billClassList : []
      }
    },
    components: {
       //BrchCodeSearch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      SaleMatureDetil:()=>import(/* webpackChunkName: "be/market/redeem/sale/saleMatureDetil" */`@/views/bizViews/be/market/redeem/sale/saleMatureDetil`),
       //ShowBranch:()=>import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)

    },
    mounted() {
      this.getDictListByGroups('BusiType,SettleType,CDMedia,DraftTypeCode,RedeemType,RedeemStatus,AcctFlag,StlResult,RedeemReason,SignUpMarkCode').then(res => {
        this.busiTypeList = res.get("BusiType");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.redeemTypeList = res.get("RedeemType");
        this.redeemStatusList = res.get("RedeemStatus");
        this.dictMap = res.get("map");
      })
    },
    methods: {
      clearVal(type){
        if(type == 'brchName'){
          this.formItem.transBrchNos = '';
          this.formItem.brchName = '';
        }
      },
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key)
      },
      formatDate(value) {
        return this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD")
      },
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$hMessage.error("请先选择记录！");
          return;
        }
        this.formItem.buyBrchCode = info.brchCode;
        this.formItem.buyBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },*/
      /*closeBranch() {
        this.showbrch = false;
      },*/
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.paramItem = this.deepClone(this.formItem);
        this.$nextTick(()=>{
          this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        });
      },
      handleApplDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDate = [arr[0],arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDate = [];
        }
      },
      formSearchReset() {
        this.applDate = [];
        this.$refs.formItem.resetFields();
        this.formItem.buyBrchCode = "";
        this.formItem.buyBrchName = "";
        this.formItem.transBrchNos = "";
      },
      handleSelectClick(i) {
        this.selectData = i;
      },
      transDetail() {
        if (this.selectData.length == 1) {
          this.viewDatailForm.batchId = this.selectData[0].id;
          this.selection.batchId = this.selectData[0].id;
          this.batchId = this.selectData[0].id;
          this.showmsg = true
        } else {
          this.$msgTip.info(this, { info: this.$t('m.i.common.onlyChooseOneData') });
        }
      },
      closeMsgBox() {
        this.showmsg = false
      },
      showBatchDetil(batchId){
        this.batchId = batchId;
        this.showmsg = true;
      },
      //选择机构名称
     /* queryBranchName(str) {
        this.brchNameSelectWin = true;
      },
      //选择机构名称弹出框确认
      brchNameAdd(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let transBrchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          transBrchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.formItem.transBrchNos = transBrchNos.substring(0,transBrchNos.length - 1);
        this.formItem.brchName=brchNames.substring(0,brchNames.length - 1);
        this.brchNameSelectWin = false;
      },
      brchNoWinClose(){
        this.brchNameSelectWin = false;
      },*/

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'redeemSaleTransBatch';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/redeem/sale/saleMatureTransMonitor/func_exportSaleMatureTransList";
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if(this.$refs.datagrid.total == 0){
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = { ids: this.$refs.datagrid.selectIds, pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
          }else {
            params = { transBrchNos:this.formItem.transBrchNos,batchNo:this.formItem.batchNo,
              dealNo:this.formItem.dealNo,busiType:this.formItem.busiType,redeemStatus:this.formItem.redeemStatus,
              billType:this.formItem.billType,billClass:this.formItem.billClass,dueAcctFlag:this.formItem.dueAcctFlag,
              minApplDt:this.formItem.minApplDt,maxApplDt:this.formItem.maxApplDt,
              minDueRatePct:this.formItem.minDueRatePct,maxDueRatePct:this.formItem.maxDueRatePct,
              buyBrchCode:this.formItem.buyBrchCode,
              field: field, exportType: exportType, excelName: this.param,pageSize:pageSize};
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
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/market/redeem/sale/saleMatureTransMonitor/func_exportSaleMatureTransList";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/market/redeem/sale/saleMatureTransMonitor/func_exportSaleMatureTransList";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'pageSize';
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1)
            }
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },

    },
  }

</script>
