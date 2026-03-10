<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="remitDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="remitDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" :value="dueDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="dueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="prsttnName" :label="$t('m.i.ce.entrustName')">
                  <h-input v-model="formItem.prsttnName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="prsttnAcctNo" :label="$t('m.i.ce.entrustAcctNo')">
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
                      url="/ce/acpt/paper/paymentDue/paymentAccountMain/func_list"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="remittanceChannelSet" v-if="auditMode" >{{$t('m.i.ce.remittanceChannelSet')}}</h-button>
              <h-button type="primary" @click="paymentAccount" >{{$t('m.i.ce.paymentAccount')}}</h-button>
              <h-button type="primary" @click="paymentBack" >{{$t('m.i.common.back')}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 汇划渠道设置弹窗 -->
        <h-msg-box v-model="remittanceChannelSetWin" width="400" @on-close="remittanceChannelSetWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>汇划渠道设置</span>
          </p>
          <div>
            <h-form :model="remittanceChannelForm" :label-width="115" ref="remittanceChannelForm" cols="1" class="h-form-search">
              <h-form-item prop="remittanceChannel" :label="$t('m.i.ce.remittanceChannel')" required>
                <h-select v-model="remittanceChannelForm.remittanceChannel">
                  <h-option v-for="item in remittanceChannelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="remittanceChannelSetWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="remittanceChannelSetWinSubmit()">{{$t("m.i.common.confirm")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 退回原因录入弹窗 -->
        <h-msg-box v-model="paymentBackWin" width="400" @on-close="paymentBackWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>退回原因录入</span>
          </p>
          <div>
            <h-form :model="paymentBackForm" :label-width="115" ref="paymentBackForm" cols="1" class="h-form-search">
              <h-form-item prop="paymentReturnReason" :label="$t('m.i.ce.paymentReturnReason')" required>
                <h-input v-model="paymentBackForm.paymentReturnReason" placeholder="" type="textarea" :rows="3" :canResize="false" :maxlength=100 :lengthByByte="false"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="paymentBackWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="paymentBackWinSubmit()">{{$t("m.i.common.back")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton" @acctAuthorize="acctAuthorize"
                          :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                          @printSuccessCallback="printSuccessCallback"></acct-record>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin"
                           @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
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
    name: "paymentAccountMain",
    components: {
    },
    data() {
      return {
        acctSubmitFlag: false,
        showPrintButton: false,
        showBillInfoWin: false,
        licenseFlag:false,
        authPath: this.$route.path ,
        ownedBrchNo:"",
        billId: "",
        formItem: {
          paymentBrchNo:this.$store.getters.userInfo.brchNo,
          prsttnName: '',
          prsttnAcctNo: '',
          billNo: '',
          minRemitDt: '',
          maxRemitDt: '',
          minDueDt: '',
          maxDueDt: '',
          inOutFlag:'1',
          billClass: 'ME01',
          licenseFlag:this.licenseFlag,
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
          reverseBillNo:''
        },
        dueDt: "",
        remitDt: "",
        remittanceChannelForm: {
          ids: '',
          remittanceChannel: ''
        },
        paymentBackForm: {
          ids: '',
          paymentReturnReason: ''
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
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
           title: this.$t("m.i.ce.acptType"),
            key: 'acptType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptType",params.row.acptType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
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
            title: this.$t("m.i.billInfo.riskStatus"),
            key: 'riskStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
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
            title: this.$t("m.i.billInfo.billType"),
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
            title: this.$t("m.i.billInfo.billMoney"),
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
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.entrustAcctNo"),
            key: 'prsttnAcctNo',
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.ce.entrustName"),
            key: 'prsttnName',
            sortable: true,
            hiddenCol: false,
          },
          {
          title: this.$t("m.i.ce.entrustBankNo"),
            key: 'prsttnBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustBankName"),
            key: 'prsttnBankName',
            sortable: true,
            hiddenCol: false,
          },
        ],
        acctRecordUrl: "",
        acctRecordParam: {},
        showAcctRecordWin: false,
        acptIds: "",
        submitFlag: false,
        remittanceChannelList: [],
        dictMap: new Map(),
        currentSelectList: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        remittanceChannelSetWin: false,
        paymentBackWin: false,
        auditMode: false,
        ifShowMore: false
      }

    },
    mounted() {
      getDictListByGroups("RemittanceChannel,AcptType,RiskStatus,DraftTypeCode,FastCashStatus").then(res => {
        this.remittanceChannelList = res.get("RemittanceChannel");
        this.dictMap = res.get("map");
      });
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            this.formItem.licenseFlag = this.licenseFlag;
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
      this.remittanceChannelIsShow();
      this.fastCastFailReasonShow();
    },
    methods: {
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      remitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      dueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      //汇划渠道按钮是否展示
      remittanceChannelIsShow() {
        post({}, "/ce/acpt/paper/paymentDue/paymentAccountMain/func_getRemittanceChannelBtnParam").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retMsg === "1") {
                this.auditMode = true;
              }else if(res.data.retMsg === "0") {
                this.auditMode = false;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      fastCastFailReasonShow(){
        //查询业务参数
        getSingleParamValuesByKeys("ce.acpt.fast_cash_bill_class,ce.acpt.fast_cash_mode").then(res => {
          let fastCashBillClass = res['ce.acpt.fast_cash_bill_class'];
          let fastCashMode = res['ce.acpt.fast_cash_mode'];
          if(fastCashMode === '1' && fastCashBillClass !== undefined && fastCashBillClass !== null && fastCashBillClass.includes("ME01")){
            this.$refs.datagrid.controlColumnsHidden("fastCashStatus", false);
          } else {
            this.$refs.datagrid.controlColumnsHidden("fastCashStatus", true);
          }
        });
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
        this.remitDt = "";
        this.dueDt = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.reverseBillNo = '';
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

      //汇划渠道设置
      remittanceChannelSet() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.remittanceChannelForm.remittanceChannel = this.$refs.datagrid.selects[0].remittanceChannel;
        this.remittanceChannelSetWin = true;
      },
      //汇划渠道设置弹窗确定
      remittanceChannelSetWinSubmit() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          if(i < list.length - 1) {
            ids += ",";
          }
        }
        this.remittanceChannelForm.ids = ids;
        this.submitFlag = true;
        post(this.remittanceChannelForm, "/ce/acpt/paper/paymentDue/paymentAccountMain/func_setChannel").then(res => {
          this.submitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.remittanceChannelSetWinClose();
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
      //汇划渠道设置弹窗关闭
      remittanceChannelSetWinClose() {
        this.remittanceChannelSetWin = false;
        this.$refs.remittanceChannelForm.resetFields();
      },
      //解付记账
      paymentAccount() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        let ids = "";
        let ownedBrchNo=list[0].ownedBrchNo;
        let flag=false;
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          if(i < list.length - 1) {
            ids += ",";
          }
          if (list[i].ownedBrchNo!==ownedBrchNo) {
            flag=true;
            break;
          }
        }
        if (flag) {
          this.$msgTip.info(this, { info: "请选择相同的机构下的票据记账" });
          return;
        }
        this.acptIds = ids;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账吗?",
          onOk: () => {
            this.getEntryInfo();
          }
        });
      },
      //获取分录信息
      getEntryInfo() {
        this.acctRecordUrl = "/ce/acpt/paper/paymentDue/paymentAccountMain/func_generateAcctRecord";
        this.acctRecordParam = {code: this.acptIds,acctAuthBusiType:"03",licenseFlag:this.licenseFlag,ownedBrchNo:this.$refs.datagrid.selects[0].ownedBrchNo};
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({code: this.acptIds,licenseFlag:this.licenseFlag,ownedBrchNo:this.$refs.datagrid.selects[0].ownedBrchNo}, "/ce/acpt/paper/paymentDue/paymentAccountMain/func_acct").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
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
      //退回原因录入弹窗确定退回
      paymentBackWinSubmit() {
        let list = this.$refs.datagrid.selects;
        let acptIds = "";
        for(let i=0; i<list.length; i++) {
          acptIds += list[i].id;
          if(i<list.length - 1) {
            acptIds += ",";
          }
        }
        this.paymentBackForm.ids = acptIds;
        this.submitFlag = true;
        post(this.paymentBackForm, "/ce/acpt/paper/paymentDue/paymentAccountMain/func_goBack").then(res => {
          this.submitFlag = false;
          if(res) {
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
      },
      //退回原因录入弹窗关闭
      paymentBackWinClose() {
        this.paymentBackWin = false;
        this.$refs.paymentBackForm.resetFields();
      },
      //提交到记账授权
      acctAuthorize(){
        let param = {};
        let paymentBrchNo = this.$refs.datagrid.selects[0].ownedBrchNo;
        if(paymentBrchNo === null || paymentBrchNo === "" ){
          paymentBrchNo = this.$store.getters.userInfo.brchNo;
        }
        param = {ids: this.acptIds,curFuncNo: "PICE010810",paymentBrchNo:paymentBrchNo,acctType:"1",billClass:"ME01"};
        this.acctSubmitFlag = true;
        post(param, "/ce/acpt/paper/paymentDue/paymentAccountMain/func_addAcctAuthorize").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showAcctRecordWinClose();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
    }
  };
</script>

<style scoped>

</style>
