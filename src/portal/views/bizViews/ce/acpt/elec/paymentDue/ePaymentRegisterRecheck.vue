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
                      url="/ce/acpt/elec/paymentDue/ePaymentRegisterRecheck/func_pageQueryPaymentRgstCheckList"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckPass" >{{$t('m.i.common.recheckPass')}}</h-button>
              <h-button type="primary" @click="recheckBack" >{{$t('m.i.common.recheckReturn')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin"
                           @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 退回原因录入弹窗 -->
        <h-msg-box v-model="paymentBackWin" width="400" @on-close="paymentBackWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>退回原因录入</span>
          </p>
          <div>
            <h-form :model="paymentBackForm" :label-width="115" ref="paymentBackForm" cols="1" class="h-form-search">
              <h-form-item prop="paymentReturnReason" :label="$t('m.i.ce.paymentReturnReason')" required :validRules="paymentReturnReasonRule">
                <h-input v-model="paymentBackForm.paymentReturnReason" placeholder="" type="textarea" :rows="3" :canResize="false" :maxlength="100"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="paymentBackWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="paymentBackWinSubmit()">{{$t("m.i.ce.returnBack")}}</h-button>
            </div>
          </div>
        </h-msg-box>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
import {
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  getSingleParamValuesByKeys,
  post
} from "@/api/bizApi/commonUtil";

export default {
    name: "ePaymentRegisterRecheck",
    components: {
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      return {
        // brchNoWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
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
          billClass: 'ME02',
          acptStatus: '1',
          prsttnRespStatusList: 'SN02',
          applTellerNoNotEqual : this.$store.getters.userInfo.userNo,
          auditModeKey : 'ce.acpt.payment.is_rgst_check_exclude',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        formItemRemitDt: "",
        formItemDueDt: "",
        paymentBackForm: {
          ids: '',
          billOperType: '2',
          paymentReturnReason: '',
          prsttnRespStatusList: 'SN02',

        },
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
        paymentBackWin: false,
        submitFlag: false,
        dictMap: new Map(),
        ifShowMore: false,
        controlMode : "0",
        workDate: window.sessionStorage.getItem("workDate"),
        paymentReturnReasonRule: [{test: /^.{1,300}$/, trigger:'blur', message: '退回原因长度不能超过300位'}]
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,Yon,SettlementMarkCode,FastCashStatus,SettleType").then(res => {
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      this.fastCastFailReasonShow();
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
      this.getBusinessParmeter();
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
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.formItemRemitDt = [];
        }

      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2) {
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
        this.formItem.ownedBrchNames = "";
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

      //复核通过
      recheckPass() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        let acptIds = "";
        let ownedBrchNo=list[0].ownedBrchNo;
        let flag=false;
        let dueFlag=false;
        for(let i=0; i<list.length; i++) {
          acptIds += list[i].id;
          if(i<list.length-1) {
            acptIds += ",";
          }
          if (list[i].ownedBrchNo!==ownedBrchNo) {
            flag=true;
            break;
          }
          if(list[i].dueDt > this.workDate){
            dueFlag = true;
          }
        }
        if (flag) {
          this.$msgTip.info(this, { info: "请选择相同的机构下的票据" });
          return;
        }
        if(dueFlag){
          //提前签收不控制
          if (this.controlMode === "0"){
            this.postrecheck(acptIds,ownedBrchNo);
            //提前签收提醒
          }else if (this.controlMode === "2"){
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: "当前选择的记录存在未到期票据，是否继续办理付款签收业务？",
              onOk: () => {
                this.postrecheck(acptIds,ownedBrchNo);
              }
            });
            //提前签收禁止
          }else if (this.controlMode === "1"){
            this.$msgTip.info(this, { info: "当前选择的记录存在未到期票据，禁止提前签收！" });
            return;
          }
        }else{
          this.postrecheck(acptIds,ownedBrchNo);
        }

      },
      postrecheck(acptIds,ownedBrchNo){
        post({ ids: acptIds, billOperType: "1", billClass: "ME02",prsttnRespStatusList : 'SN02',licenseFlag:this.licenseFlag,ownedBrchNo: ownedBrchNo}, "/ce/acpt/elec/paymentDue/ePaymentRegisterRecheck/func_paymentDueRgstCheck").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
            this.handleSearch();
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },


      //复核退回
      recheckBack() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list=this.$refs.datagrid.selects
        let ownedBrchNo=list[0].ownedBrchNo;
        let flag=list.some( item => item.ownedBrchNo !== ownedBrchNo)
        if (flag) {
          this.$msgTip.info(this, { info: "请选择相同的机构下的票据" });
          return;
        }
        this.paymentBackWin = true;
      },
      //退回弹窗确认
      paymentBackWinSubmit() {
        this.$refs["paymentBackForm"].validate(valid => {
          if (valid) {
            let list = this.$refs.datagrid.selects;
            let acptIds = "";
            for (let i = 0; i < list.length; i++) {
              acptIds += list[i].id;
              if (i < list.length - 1) {
                acptIds += ",";
              }
            }
            this.paymentBackForm.ids = acptIds;
            this.submitFlag = true;
            let params={licenseFlag:this.licenseFlag,ownedBrchNo:list[0].ownedBrchNo}
            Object.assign(params,this.paymentBackForm)
            post(params, "/ce/acpt/elec/paymentDue/ePaymentRegisterRecheck/func_paymentDueRgstCheck").then(res => {
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
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });

          }
        });

      },
      //退回弹窗关闭
      paymentBackWinClose() {
        this.paymentBackWin = false;
        this.$refs.paymentBackForm.resetFields();
      },
      /*//根据弹框所选数据进行赋值
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
      getBusinessParmeter(){
        post({ paramKey: "ce.acpt.payment.is_settle_before_control_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === "2") {
                this.controlMode = "2";
              } else if (res.data.retData === "1") {
                this.controlMode = "1";
              }else{
                this.controlMode = "0";
              }
            } else {
              this.$msgTip.error(this, { info: msg });
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
