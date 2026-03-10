<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWin = true" v-if="this.licenseFlag"></own-brch-nos>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="formItemRemitDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleRemitDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" :value="formItemDueDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleDueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="otherBankAcptMark" :label="$t('m.i.ce.otherBankAcptMark')">
                  <h-select v-model="formItem.otherBankAcptMark" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="prsttnName" :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label">
                  <h-input v-model="formItem.prsttnName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="prsttnAcctNo" :label="$t('m.i.billInfo.prsttnAcctNo')" class="h-form-long-label">
                  <h-input v-model="formItem.prsttnAcctNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="clearMark" :label="$t('m.i.ce.clearMark')">
                  <h-select v-model="formItem.clearMark" placeholder="" showTitle>
                    <h-option v-for="item in settleTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>

              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/ce/acpt/elec/paymentDue/ePaymentSignMain/func_pageQueryPaymentSignList"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="paymentSign" >{{$t('m.i.ce.paymentSign')}}</h-button>
              <h-button type="primary" @click="print" v-if="this.btnAuth.print === undefined ? true : this.btnAuth.print.isShow">{{$t('m.i.ce.outlinePrint')}}</h-button>
              <h-button type="primary" @click="paymentBack" >{{$t('m.i.ce.paymentBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
        <!-- 退回原因录入弹窗 -->
        <h-msg-box v-model="paymentBackWin" width="400" @on-close="paymentBackWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>退回原因录入</span>
          </p>
          <div>
            <h-form :model="paymentBackForm" :label-width="115" ref="paymentBackForm" cols="1" class="h-form-search">
              <h-form-item prop="paymentReturnReason" :label="$t('m.i.ce.paymentReturnReason')" required>
                <h-input v-model="paymentBackForm.paymentReturnReason" placeholder="" type="textarea" :rows="3" :canResize="false" :maxlength="100"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="paymentBackWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="paymentBackSubmit()">{{$t("m.i.ce.paymentBack")}}</h-button>
            </div>
          </div>
        </h-msg-box>
      </h-col>
    </h-row>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
  import {
    billMoneyDisplay,
    cmycurd,
    formatNumber,
    getDictListByGroups,
    getDictValueFromMap,
    getSingleParamValuesByKeys,
    post
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "ePaymentSignMain",
    components: {
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      return {
        // brchNoWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
        btnAuth:"",
        submitFlag: false,
        paymentBackWin: false,
        settlementMarkCodeList:[],
        settleTypeList:[],
        paymentBackForm: {
          paymentReturnReason: '',
          ids: '',
          prsttnRespStatusList: 'SN03,SN08',
        },
        showBillInfoWin: false,
        billId: "",
        formItem: {
          paymentBrchNo:this.$store.getters.userInfo.brchNo,
          prsttnName: '',
          prsttnAcctNo: '',
          otherBankAcptMark: '',
          billNoLike: '',
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          acptStatus: '1',
          prsttnRespStatusList: 'SN03,SN08',
          billClass:'ME02',
          isLock:'2',
          order:"pay_rgst_dt asc",
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
          clearMark:"",
        },
        formItemRemitDt: "",
        formItemDueDt: "",
        columns: [
          {
            type: "selection",
            hiddenCol: false,
            align: "center",
            width: 60
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t("m.i.ce.otherBankAcptMark"),
            key: 'otherBankAcptMark',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.otherBankAcptMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title:  this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.fastCashStatus"),
            key: 'fastCashStatus',
            hiddenCol: true,
            render: (h, params) => {
              let dict = "";
              if(params.row.fastCashStatus === '1' || params.row.fastCashStatus === '2' || params.row.fastCashStatus === '3'){
                dict = "可秒兑";
              }else if (params.row.fastCashStatus === '5'){
                dict = "不可秒兑";
              }else if(params.row.fastCashStatus === '6'){
                dict = "秒兑失败（人工介入）";
              }
              return h("span",
                {
                  domProps: {
                    title: dict
                  }
                }, dict);
            }
          },
          {
            title: this.$t("m.i.ce.clearMark"),
            key: 'clearMark',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"SettleType",params.row.clearMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.promNoteNo"),
            key: 'promNoteNo',
            hiddenCol: false,
          },
          {
            title:  this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
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
            key: 'dueDt',
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
            title: this.$t("m.i.billInfo.prsttnAcctNo"),
            key: 'prsttnAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.prsttnName"),
            key: 'prsttnName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.prsttnBankNo"),
            key: 'prsttnBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.prsttnBankName"),
            key: 'prsttnBankName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.prsttnRemark"),
            key: 'prsttnRemark',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.overdueReason"),
            key: 'overdueReason',
            hiddenCol: false,
          },
        ],
        YonList: [],
        currentSelectList: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        signConfirmWin: false,
        dictMap: new Map(),
        ifShowMore: false
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,Yon,SettlementMarkCode,FastCashStatus,SettleType").then(res => {
        this.YonList = res.get("Yon");
        this.settlementMarkCodeList = res.get("SettlementMarkCode");
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

      this.fastCastFailReasonShow();
    },
    created(){
      this.buttonAuthShow();
    },
    methods: {
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.formItemRemitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.formItemRemitDt = [];
        }
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.formItemDueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.formItemDueDt = [];
        }

      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItemRemitDt = "";
        this.formItemDueDt = "";
        this.formItem.ownedBrchNames= "";
        this.formItem.ownedBrchNos = "";
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

      //付款签收
      paymentSign() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定签收吗？",
          onOk: () => {
            this.paymentSignSubmit();
          }
        });
      },
      paymentSignSubmit() {
        let ids = "";
        let list = this.$refs.datagrid.selects;
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          if(i<list.length-1) {
            ids += ",";
          }
        }
        post({ids: ids,prsttnRespStatusList: 'SN03,SN08'}, "/ce/acpt/elec/paymentDue/ePaymentSignMain/func_paymentDueSign").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //线下打印
      print() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if(this.$refs.datagrid.selects[0].clearMark === "SM00") {
          this.$msgTip.info(this, { info: "线上清算的不允许线下打印！" });
          return;
        }
        this.assemblePaymentSignParams();
      },
      assemblePaymentSignParams() {
        let vocherData = this.deepClone(this.$refs.datagrid.selects);
        for (let i = 0; i < vocherData.length; i++) {
          let currentDate = this.$moment(new Date()).format("YYYYMMDD");
          vocherData[i].yyyy = currentDate.toString().substring(0, 4);
          vocherData[i].mm = currentDate.toString().substring(4, 6);
          vocherData[i].dd = currentDate.toString().substring(6, 8);
          let billMoney = vocherData[i].billMoney === null ? "0" : vocherData[i].billMoney;
          vocherData[i].billMoney = cmycurd(vocherData[i].billMoney);
          vocherData[i].moneyNum = billMoney.toString();
          let tempMoney = "¥" + billMoney.toString();
          billMoneyDisplay(tempMoney, vocherData[i]);
          let clearMark = vocherData[i].clearMark;
          if('SM01' === clearMark){
            clearMark='线下清算';
          }
          vocherData[i].clearMark = clearMark;
          vocherData[i].flowNo = vocherData[i].acctFlowId;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);
        }
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE030412", vocherData: vocherData,licenseFlag:this.licenseFlag,ownedBrchNo:this.$refs.datagrid.selects[0].ownedBrchNo },
          callback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.$refs.datagrid.selects = [];
          },
          errorCallback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.$refs.datagrid.selects = [];
          }
        });
      },
      //退回
      paymentBack() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        this.paymentBackWin = true;
      },
      paymentBackSubmit() {
        this.$refs["paymentBackForm"].validate(valid => {
          if (valid) {
            let ids = "";
            let list = this.$refs.datagrid.selects;
            for(let i=0; i<list.length; i++) {
              ids += list[i].id;
              if(i<list.length-1) {
                ids += ",";
              }
            }
            this.paymentBackForm.ids = ids;
            this.submitFlag = true;
            post(this.paymentBackForm, "/ce/acpt/elec/paymentDue/ePaymentSignMain/func_paymentDueSignReturn").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.paymentBackWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.$refs.datagrid.selects = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.paymentBackWinClose();
                }
                this.handleSearch();
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      paymentBackWinClose() {
        this.paymentBackWin = false;
        this.$refs.paymentBackForm.resetFields();
      },
      /* //根据弹框所选数据进行赋值
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
       },*/
      fastCastFailReasonShow(){
        //查询业务参数
        getSingleParamValuesByKeys("ce.acpt.fast_cash_bill_class,ce.acpt.fast_cash_mode").then(res => {
          let fastCashBillClass = res['ce.acpt.fast_cash_bill_class'];
          let fastCashMode = res['ce.acpt.fast_cash_mode'];
          if(fastCashMode === '1' && fastCashBillClass !== undefined && fastCashBillClass !== null && fastCashBillClass.includes("ME02")){
            this.$refs.datagrid.controlColumnsHidden("fastCashStatus", false);
          } else {
            this.$refs.datagrid.controlColumnsHidden("fastCashStatus", true);
          }
        });
      },
      buttonAuthShow(){
        //按钮权限查询 控制按钮显隐
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    },
  };
</script>

<style scoped>

</style>
