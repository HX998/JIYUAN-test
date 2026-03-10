<!--代客业务-查询客户收款记录-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.busiType')" prop="prodNo">
                  <h-select v-model="formItem.prodNo" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike" :validRules="billNoRule">
                  <h-input v-model="formItem.billNoLike" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctStatus')" prop="acctStatus">
                  <h-select v-model="formItem.acctStatus" placeholder="">
                  <h-option v-for="item in settleStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                                    </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.pyeeName')" prop="pyeeName" >
                  <h-input v-model="formItem.pyeeName" :maxlength=60 icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearCustNo()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.transSignDt')" prop="minOperDt">
                  <h-date-picker :value="operDt" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false placement="bottom-end"
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>

                <h-form-item :label="$t('m.i.pe.pyeeAmt')" :prop="isMinTransAmt">
                  <h-row>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.minTransAmt" :maxlength="20"
                                   @on-blur="formatTransAmt('blur','min')" placeholder=""
                                   @on-focus="formatTransAmt('focus','min')"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center"><span>至</span></h-col>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.maxTransAmt" :maxlength="20"
                                   @on-blur="formatTransAmt('blur','max')" placeholder=""
                                   @on-focus="formatTransAmt('focus','max')" bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->

          <h-datagrid
              :columns="columns"
              highlightRow
              url="/bm/valetBusiness/valetAcct/queryCustAcctSettle"
              :bindForm="formItem"
              :auto-load="true"
              :onCurrentChange="onCurrentChange"
              :onCurrentChangeCancel="onCurrentChangeCancel"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="selectAccount()" :disabled="this.isAccount">{{$t('m.i.ce.account')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustElecSignWin" @custElecSignWinClose="custElecSignWinClose"
                         @custElecSignSubmit="custElecSignSubmit"></show-cust-elec-sign>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustAcctNoWin" :custInfoParams="custInfoParams"
                         :isShowCustAcctNo="true"
                         @custElecSignWinClose="showCustAcctNoWinClose"
                         @custElecSignSubmit="custAcctNoSelectSubmit"></show-cust-elec-sign>
    <!-- 分录弹框 -->
    <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton"
                 :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                 @printSuccessCallback="printSuccessCallback" ref="showAcctRecord"></acct-record>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { on, off, formatNumber,post,getDictValueFromMap,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "queryCustAcctSettle",
    components: {
    },
    data() {
      let options = {};
      //区分最大和最小票据金额
      options.transAmtType = "min";
      options.dueDt = [];
      options.operDt = [];
      options.isAccount = false;
      options.formItem = {
        pyeeCustNo: "",
        pyeeName: "",
        pyeeAcctNo: "",
        billNoLike: "",
        drwrName: "",
        pyeeName: "",
        acptName: "",
        billType: "",
        minTransAmt: "",
        maxTransAmt: "",
        minDueDt: "",
        maxDueDt: "",
        minOperDt: "",
        maxOperDt: "",
        billOrigin: "",
        minBillRangeStart: "",
        maxBillRangeEnd: "",
        prodNo: "",
        acctStatus: "2"
      };
      options.billNoRule = [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }];
      options.columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
        },
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.busiType'),
          key: "prodNo",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let prodNo = "";
            if(params.row.prodNo == "02070101"){
              prodNo = "贴现收款";
            }
            if(params.row.prodNo == "02040124"){
              prodNo = "追索收款";
            }
            if(params.row.prodNo == "02040120"){
              prodNo = "托收收款";
            }
            return h("span", prodNo);
          }
        },
        {
          title: this.$t('m.i.billInfo.billOrigin'),
          key: "billOrigin",
          render: (h, params) => {
            let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = "";
            if (params.row.billNo === null || params.row.billNo === "") {
              billNo = this.$t('m.i.ce.showBillInfo');
            } else {
              billNo = params.row.billNo;
            }
            return h("a", {
              on: {
                click: () => {
                  if (params.row.billRangeStart != null && params.row.billRangeEnd != null) {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart.toString(), params.row.billRangeEnd.toString());
                  } else {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }
            }, billNo);
          }
        },
        {
          title: this.$t('m.i.billInfo.billRange'),
          key: "billRange",
          align: 'center',
          render: (h, params) => {
            return h("span", formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd));
          }
        },
        {
          title: this.$t('m.i.common.acctStatus'),
          key: "acctStatus",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let acctStatus = "";
            if(params.row.acctStatus == "0"){
              acctStatus = "未记账";
            }
            if(params.row.acctStatus == "1"){
              acctStatus = "记账成功";
            }
            if(params.row.acctStatus == "2"){
              acctStatus = "记账失败";
            }
            return h("span", acctStatus);
          }
        },
        {
          title: this.$t('m.i.bm.transSignDt'),
          key: "operDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.operDt == null || params.row.operDt === "" || params.row.operDt == 0) {
              return "";
            }
            let date = this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: "billType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
          key: "remitDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.remitDt == null || params.row.remitDt === "") {
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.billInfo.dueDt'),
          key: "dueDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.dueDt == null || params.row.dueDt === "") {
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },

        {
          title: this.$t('m.i.pe.pyeeAmt'),
          key: "transAmt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let transAmt = formatNumber(params.row.transAmt, 2, ",");
            return h("span", {
              domProps: {
                title: transAmt
              }
            }, transAmt);
          }
        },
        {
          title: this.$t('m.i.pe.drweName'),
          key: "drweName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeName'),
          key: "pyeeName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankName'),
          key: "pyeeBankName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeAcctNo'),
          key: "pyeeAcctNo",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        }
      ];
      options.billTypeList = [];
      options.transNoList = [];
      options.billOriginList= [];
      options.busiTypeList = [{ key: "02070101", value: "贴现收款" },{ key: "02040124", value: "追索收款" },{ key: "02040120", value: "托收收款" }];
      options.settleStatusList = [{ key: "0", value: "未记账" },{ key: "1", value: "记账成功" },{ key: "2", value: "记账失败" }];
      options.dictMap = new Map();
      //是否显示更多查询项
      options.ifShowMore = false;
      options.showCustElecSignWin = false;
      options.showCustAcctNoWin = false;
      options.showBillInfoWin = false;
      options.showPrintButton = false;
      options.acctSubmitFlag = false;
      options.showAcctRecordWin = false;
      options.acctRecordParam = {};
      options.acctRecordUrl =  "";
      options.billId = "";
      options.billNo = "";
      options.billRangeStart = "";
      options.billRangeEnd = "";
      options.custInfoParams = {};
      options.selectData= null;
      return options;
    },
    computed: {
      isMinTransAmt() {
        return this.transAmtType === "min" ? "minTransAmt" : "maxTransAmt";
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,ValetHldrTransNo,EcdsBillStatusCode,SettleType,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.transNoList = res.get("ValetHldrTransNo");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
        if (this.selectData.acctStatus == "0" || this.selectData.acctStatus == "2"){
          this.isAccount = false;
        }else{
          this.isAccount = true;
        }
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
        this.isAccount = false;
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minOperDt = arr[0].replace(/-/g, "");
          this.formItem.maxOperDt = arr[1].replace(/-/g, "");
          this.operDt = [arr[0], arr[1]];
        }else{
          this.formItem.minOperDt = "";
          this.formItem.maxOperDt = "";
          this.operDt = [];
        }

      },
      clearCustNo() {
        this.formItem.custNo = "";
        this.formItem.pyeeName = "";
        this.formItem.pyeeAcctNo = "";
      },
      //查询客户信息
      queryCustNo() {
        this.showCustElecSignWin = true;
      },
      //赋值
      custElecSignSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.pyeeName = info.custName;
        this.formItem.pyeeAcctNo = info.custAcctNo;
        this.showCustElecSignWin = false;
      },
      //关闭
      custElecSignWinClose() {
        this.showCustElecSignWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.custInfoParams = { custNo: this.formItem.custNo, custName: this.formItem.pyeeName };
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.pyeeAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      formatTransAmt(optType, itemType) {
        this.transAmtType = itemType;
        if (optType === "blur") {
          if (itemType === "min") {
            if (!isNaN(parseFloat(this.formItem.minTransAmt)) && isFinite(this.formItem.minTransAmt)) {
              this.formItem.minTransAmt = this.formItem.minTransAmt == null ? "0.00" : formatNumber(this.formItem.minTransAmt, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.formItem.maxTransAmt)) && isFinite(this.formItem.maxTransAmt)) {
              this.formItem.maxTransAmt = this.formItem.maxTransAmt == null ? "0.00" : formatNumber(this.formItem.maxTransAmt, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.formItem.minTransAmt = this.formItem.minTransAmt.toString().replace(/,/g, "");
          } else {
            this.formItem.maxTransAmt = this.formItem.maxTransAmt.toString().replace(/,/g, "");
          }
        }
      },
      //表单查询
      handleSearch() {
        let minTransAmt = this.formItem.minTransAmt.toString().replace(/,/g, "");
        let maxTransAmt = this.formItem.maxTransAmt.toString().replace(/,/g, "");
        if (parseFloat(minTransAmt) > parseFloat(maxTransAmt)) {
          this.$msgTip.info(this, { info: "收款金额区间输入有误" });
          return;
        }
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.formItem.minTransAmt = this.formItem.minTransAmt.toString().replace(/,/g, "");
            this.formItem.maxTransAmt = this.formItem.maxTransAmt.toString().replace(/,/g, "");
            this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
            this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
            this.formItem.minOperDt = this.formItem.minOperDt.replace(/-/g, "");
            this.formItem.maxOperDt = this.formItem.maxOperDt.replace(/-/g, "");
            this.isAccount = false;
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDt = [];
        this.operDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minOperDt = "";
        this.formItem.maxOperDt = "";
        this.formItem.minTransAmt = "";
        this.formItem.maxTransAmt = "";
        this.formItem.pyeeAcctNo = "";
        this.formItem.acctStatus = "0";
        this.$refs.formItem.resetFields();
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },

      //选择记账
      selectAccount() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
  //      if(list.length > 1) {
    //      this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
      //    return;
        //}
        this.acctIds = this.selectData.id;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账吗?",
          onOk: () => {
            this.getEntryInfo();
          }
        });
      },
      //获取分录信息
      getEntryInfo(str) {
        this.acctRecordUrl = "/bm/valetBusiness/valetAcct/func_settleAcctRecord";
        this.acctRecordParam = { id: this.acctIds};
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ id: this.acctIds}, "/bm/valetBusiness/valetAcct/func_settleAcct").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              //组装打印票据明细
              this.contractPrinting(info.recordInfo);
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
        this.showPrintButton = false;
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      },

      //组装打印票据明细
      contractPrinting(recordInfo) {
        let flowNo = "";
        for(let item in Object.keys(recordInfo)) {
          if(recordInfo[Object.keys(recordInfo)[item]].length !== 0) {
            if(recordInfo[Object.keys(recordInfo)[item]][0].voucherType === 'PE031606') {
              flowNo = Object.keys(recordInfo)[item];
            }
          }
        }
        if(flowNo !== "") {
          post({code: flowNo}, "/bm/valetBusiness/valetAcct/func_queryBillInfoListByFlowNo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.getBillListTemplate(res.data.retData);
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        }
      },

      getBillListTemplate(billInfoList) {
        post({voucherType: 'PE031606'}, "/pe/print/printConf/printConfManger/queryPrintConfByVoucherType").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let billListJson = {};
              if (res.data.retData !== null) {
                if(res.data.retData.confContent !== undefined && res.data.retData.confContent !== null && res.data.retData.confContent !== "") {
                  billListJson = JSON.parse(res.data.retData.confContent);
                }
              }
              let billInfoListNext = this.assembleAcptBills(billInfoList,billListJson);
              this.$refs.showAcctRecord.getBillInfoList(billInfoListNext);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

      assembleAcptBills(acptBillList,billListJson) {
        let bodyHtml = [];
        let bodyStr1 = "";
        let bodyStr2 = "";
        if(acptBillList !== null && Object.keys(billListJson).length !== 0) {
          for (let i = 0; i < acptBillList.length; i++) {
            if (!!acptBillList[i].remitDt) {
              acptBillList[i].remitDt = this.$moment(acptBillList[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            if (!!acptBillList[i].dueDt) {
              acptBillList[i].dueDt = this.$moment(acptBillList[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            acptBillList[i].billMoney = formatNumber(acptBillList[i].billMoney, 2, ',');
            acptBillList[i].fee = formatNumber(acptBillList[i].fee, 2, ',');
            acptBillList[i].vochFee = formatNumber(acptBillList[i].vochFee, 2, ',');
            // if (i < 10) {
            bodyStr1 += "<tr>";
            bodyStr1 +=  "<td class='ta-c'>" + (1+i) + "</td>";
            for(let key in billListJson) {
              let temp = acptBillList[i][key] === null? '': acptBillList[i][key];
              bodyStr1 += "<td>" + temp + "</td>";
            }
            bodyStr1 += "</tr>";
            // } else {
            //   bodyStr2 += "<tr>";
            //   bodyStr2 +=  "<td class='ta-c'>" + (1+i) + "</td>";
            //   for(let key in billListJson) {
            //     let temp = acptBillList[i][key] === null? '': acptBillList[i][key];
            //     bodyStr2 += "<td>" + temp + "</td>";
            //   }
            //   bodyStr2 += "</tr>";
            // }
          }
        }
        if(Object.keys(billListJson).length !== 0) {
          let headHtml = "";
          for (let key in billListJson) {
            headHtml += "<th>" + billListJson[key] + "</th>";
          }
          let bodyHtml1 = `<div class="list-table-box"><table class="list-table">
            <thead>
              <tr>
                <th class="ta-c"><b>序号</b></th>
                ${headHtml}
              </tr>
            </thead>
            <tbody>${bodyStr1}</tbody>
          </table>
        </div>`
          bodyHtml.push(bodyHtml1);
          if (!!bodyStr2) {
            let bodyHtml2 = `<div class="list-table-box">
            <table class="list-table">
              <tbody>${bodyStr2}</tbody>
            </table>
          </div>`
            bodyHtml.push(bodyHtml2);
          }
          return bodyHtml;
        }else {
          return "";
        }
      },
    }
  };
</script>

<style scoped>

</style>
