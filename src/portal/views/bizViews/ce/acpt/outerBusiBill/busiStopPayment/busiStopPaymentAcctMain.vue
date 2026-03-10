<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="sspdType" :label="$t('m.i.billInfo.sspdAndRelieveType')" class="h-form-long-label">
                  <h-select v-model="formItem.sspdType" placeholder="">
                    <h-option v-for="item in doubleTypeList" :value="item.key" :key="item.key" @on-change="handleTypeChange">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
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
                      url="/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentAcctMain/func_waitCheckAcctList"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account" >{{$t('m.i.ce.account')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam"
                     :url="this.acctRecordUrl"
                     :show-acct-record-win="this.showAcctRecordWin"
                     :showPrintButton="this.showPrintButton"
                     @acctSubmitSure="acctSubmitSure"
                     @showAcctRecordWinClose="showAcctRecordWinClose"
                     :submitFlag="this.acctSubmitFlag"
                     @printSuccessCallback="printSuccessCallback"
                     ref="showAcctRecord"></acct-record>

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiStopPaymentAcctMain",
    components: {
    },
    data() {
      return {
        showPrintButton: false,
        showBillInfoWin: false,
        billId: "",
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          sspdType: '',
          relieveType: '',
          billNo: '',
          acptProtocalNo: '',
          curFuncNo : 'PICE010827',
          reverseBillNo : ''
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            hiddenCol: false,
            align: 'center'
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
            title: this.$t("m.i.billInfo.sspdAndRelieveType"),
            key: 'sspdAndRelieveType',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptStatus",params.row.acptStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
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
            sortable: true,
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
          }
        ],
        dictMap: new Map(),
        ids: "",
        acctRecordUrl: "",
        acctRecordParam: {},
        showAcctRecordWin: false,
        currentSelectRow: [],
        sspdStatusList: [],
        sspdTypeList: [],
        relieveTypeList: [],
        doubleTypeList: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        ifShowMore: false,
        acctSubmitFlag: false
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,SspdStatus,SspdType,AnlgSspdType,AcptStatus").then(res => {
        this.sspdStatusList = res.get("SspdStatus");
        this.sspdTypeList = res.get("SspdType");
        this.relieveTypeList = res.get("AnlgSspdType");
        this.dictMap = res.get("map");
        let sspdList = this.sspdTypeList;
        let relieveList = this.relieveTypeList;
        for(let i=0; i<sspdList.length; i++) {
          this.doubleTypeList.push(
            {
              key: sspdList[i].key,
              value: sspdList[i].value
            }
          )
        }
        for(let i=0; i<relieveList.length; i++) {
          this.doubleTypeList.push(
            {
              key: relieveList[i].key,
              value: relieveList[i].value
            }
          )
        }
      });
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleRemitDtChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      handleDueDtChange(value) {
        this.formItem.dueDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = '';
          this.formItem.drwrAcctNo = '';
          this.formItem.sspdType = '';
          this.formItem.relieveType = '';
          this.formItem.billNo = '';
          this.formItem.acptProtocalNo = '';
          this.formItem.reverseBillNo = ''
        });
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
      handleTypeChange(value) {
        if(value === "ST01") {
          this.formItem.sspdType = "ST01";
        }else if(value === "ST02") {
          this.formItem.sspdType = "ST02";
        }else if(value === "ST03") {
          this.formItem.sspdType = "ST03";
        }else if(value === "RT01") {
          this.formItem.relieveType = "RT01";
          this.formItem.sspdType = "";
        }else if(value === "RT02") {
          this.formItem.relieveType = "RT02";
          this.formItem.sspdType = "";
        }else if(value === "RT03") {
          this.formItem.relieveType = "RT03";
          this.formItem.sspdType = "";
        }else if(value === "RT04") {
          this.formItem.relieveType = "RT04";
          this.formItem.sspdType = "";
        }
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

      //记账
      account() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids = "";
        let list = this.$refs.datagrid.selects;
        //止付和解止付不能同时记账
        let sspdStatus = list[0].sspdStatus;
        for(let i=0; i<list.length; i++) {
          if (list[i].sspdStatus !== sspdStatus) {
            this.$msgTip.info(this, {info: this.$t("止付和解止付不能同时记账！")});
            return;
          }
        }
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          if(i<list.length-1) {
            ids += ",";
          }
        }
        this.ids = ids;
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
        this.acctRecordUrl = "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentAcctMain/func_queryAcctRecord";
        this.acctRecordParam = {  code:this.ids ,accountType:"1" ,billClass:"ME01"};
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ code:this.ids ,accountType:"1",billClass:"ME01" }, "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentAcctMain/func_acpSspdAcct").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              debugger
              this.$msgTip.success(this, { info: msg });
              //打印
              this.showPrintButton = true;
              // if(!info.isHasPrint) {
              //   this.showAcctRecordWinClose();
              // }
              // this.showAcctRecordWinClose();
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              // this.ids = "";
              // this.currentSelectList = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.ids = "";
        this.currentSelectList = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
    }
  };
</script>

<style scoped>

</style>
