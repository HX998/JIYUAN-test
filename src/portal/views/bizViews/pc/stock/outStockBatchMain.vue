<template>
  <!--出库记账-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="outStockBatchMain" key="1">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                               :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                               url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <cust-name :formItem = "formItem" @queryCustMessage="queryCustMessage" :isReadonly="false"></cust-name>
                  <common-select v-model="formItem.stockBusiType" label="业务类型" prop="stockBusiType"
                                 :dictList="stockBusiTypeList"></common-select>
                  <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                  <common-date-picker v-model="applDtRange" type="daterange" label="申请日期" :autoPlacement="true" @on-change="handleBuyDtChange"></common-date-picker>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                     :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                url="/pc/stock/outStockBatchMain/func_queryStockBatchInfoByPage"
                :on-current-change="handleSelectClick"
                :on-current-change-cancel="handleSelectClickCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <bill-manage-btn @handleForm="handleForm"></bill-manage-btn>
                </div>
              </h-datagrid>
              <!-- 查询客户信息弹窗 -->
              <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
            </div>
          </div>
        </div>
        <div v-if="outStockAccountBillMain" key="2">
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="billFormItem" :label-width="90" ref="billFormItem" cols="4" class="h-form-search">
                <bill-no v-model="billFormItem.billNoLike" prop="billNoLike"></bill-no>
                <query-btn :advanceShow='false' :formSearch='billManagerHandleSearch' :formSearchReset='billManagerResetSearch'></query-btn>
              </h-form>
            </h-panel>
          </div>
        </div>
        <stock-batch-info-detail :is-show="outStockAccountBillMain" :params="this.params"
                                 :dictMap="dictMap"
                                 :isQuery="isQuery" ref="stockBatchInfoDetail"></stock-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="outStockAccountBillMain" key="3">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billFormItem"
            url="/pc/stock/outStockBatchMain/func_queryStockBillInfoByPage"
            :row-select="true"
            :has-select="false"
            ref="stockAccountBillDatagrid">
            <div slot="toolbar">
              <h-dropdown placement="bottom-start" trigger="click" @on-click="outStockSubmit">
                <h-button type="primary">出库提交<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list"  >
                  <h-dropdown-item name="select">选择提交</h-dropdown-item>
                  <h-dropdown-item name="batch">批次提交</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-dropdown placement="bottom-start" trigger="click" @on-click="accountBackList">
                <h-button type="primary">出库退回<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list"  >
                  <h-dropdown-item name="select">选择退回</h-dropdown-item>
                  <h-dropdown-item name="batch">批次退回</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <go-back-btn @returnBack="returnBack"></go-back-btn>
            </div>
          </h-datagrid>
        </div>
        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :show-acct-record-win="this.showAcctRecordWin" :showPrintButton="this.showPrintButton"
                     @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose" :submitFlag="this.acctSubmitFlag"
                     @printSuccessCallback="printSuccessCallback" @acctAuthorize="acctAuthorize"></acct-record>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off ,getDictListByGroups,formatNumber, getDictValueFromMap,accMul,formatTime,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";
  import CommonDatePicker from "../../../../components/bemp/date/commonDatePicker";
  import BillType from "../../../../components/bemp/select/billType";

  export default {
    name: "outStockBatchMain",
    components: {
      BillType,
      CommonDatePicker,
      StockBatchInfoDetail:() => import(/* webpackChunkName: "pc/stock/stockBatchInfoDetail" */`@/views/bizViews/pc/stock/stockBatchInfoDetail`),

    },
    data() {
      let columns = [
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
                    this.batchNoMain(params.row.id,params.row.brchNo)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: "出库机构名称",
          key: "brchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title:"客户名称",
          key:"custName",
          hiddenCol:false
        },
        {
          title: "业务类型",
          key: "stockBusiType",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"EntityStockBusiType",params.row.stockBusiType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
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
          title: "申请日期",
          key: "applDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.applDt == null || params.row.applDt === ""){
              return h("span","");
            }
            let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", applDt);
          }
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
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
          key: "billMoney",
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
          title:"承兑人全称",
          key:"acptName",
          hiddenCol:false
        },
        {
          title:"出票人全称",
          key:"drwrName",
          hiddenCol:false
        },
        {
          title:"出票人账号",
          key:"drwrAcctNo",
          hiddenCol:false
        },
        {
          title:"出票人开户行行号",
          key:"drwrBankNo",
          hiddenCol:false
        },
        {
          title:"付款行行号",
          key:"drweBankNo",
          hiddenCol:false
        },
        {
          title:"付款行行名",
          key:"drweBankName",
          hiddenCol:false
        },
        {
          title:"收款人全称",
          key:"pyeeName",
          hiddenCol:false
        },
        {
          title:"收款人账号",
          key:"pyeeAcctNo",
          hiddenCol:false
        },
        {
          title:"收款人开户行全称",
          key:"pyeeBankName",
          hiddenCol:false
        }
      ];
      return {
        licenseFlag:false,
        authPath:this.$route.path,
        ifShowMore:false,
        needAcctFlag:false,//是否需要记账,默认不需要记账
        params:{
          batchId:"",
          operType:"3",
          busiType:"2",
          flowStatusList:['EN06','EN10']
        },
        applDtRange:[],
        billTypeList:[],
        stockBusiTypeList:[],
        formItem: {
          billType:"",
          custNo:"",
          custName:"",
          minApplDt:"",
          maxApplDt:"",
          operType:"3",
          busiType:"2",
          flowStatusList:['EN06','EN10'],
          stockBusiType:"",
          ownedBrchNos:"",
          ownedBrchNames:"",
          authPath:this.$route.path
        },
        billFormItem: {
          billNoLike:"",
          batchId:"",
          operType:"3",
          busiType:"2",
          flowStatusList:['EN06','EN10']
        },
        columns: columns,
        billColumns : billColumns,
        dictMap: new Map(),
        outStockBatchMain : true,
        outStockAccountBillMain : false,
        showCustMessageWin : false,
        acctSubmitFlag : false,
        showPrintButton : false,
        currentSelectList : null,
        stockBatchId : "",
        isQuery : false,
        acctType : "",
        acctRecordUrl : "",
        acctRecordParam : {},
        showAcctRecordWin : false,
        stockBillIds : "",

        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billColumns),
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,EntityStockBusiType").then(res => {
        this.billTypeList = res.get("DraftTypeCode")
        this.stockBusiTypeList=res.get("EntityStockBusiType");
        this.dictMap = res.get("map");
      });
      //获取实物入库/出库是否需要记账
      getSingleParamValuesByKeys("pc.stock.is_need_acct").then(res => {
        this.needAcctFlag=res['pc.stock.is_need_acct']==="1"; //1-需要记账
      });
      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

    },
    methods: {
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.billType="";
        this.formItem.custNo="";
        this.formItem.custName="";
        this.formItem.minApplDt="";
        this.formItem.maxApplDt="";
        this.formItem.stockBusiType="";
        this.formItem.ownedBrchNames="";
        this.formItem.ownedBrchNos="";
        this.applDtRange=[]
      },
      // 行选中
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },
      handleSelectClickCancel() {
        this.currentSelectList = null;
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.$nextTick(() => {
          this.$refs.stockBatchInfoDetail.getBatchInfo();
          this.$refs.stockAccountBillDatagrid.selects = [];
          this.$refs.stockAccountBillDatagrid.selectIds = [];
          this.$refs.stockAccountBillDatagrid.dataChange(1);
        })
      },
      //票据管理界面重置
      billManagerResetSearch(){
        this.$refs.billFormItem.resetFields();
      },
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //记账
      handleForm() {
        if (this.currentSelectList==null) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.stockBatchId = this.currentSelectList.id;
        this.billFormItem.batchId = this.currentSelectList.id;
        this.ownedBrchNo=this.currentSelectList.brchNo
        this.isQuery = true;
        this.outStockBatchMain = false;
        this.outStockAccountBillMain = true;
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.stockAccountBillDatagrid.createShowCol(this.billTemp);
          this.$refs.stockAccountBillDatagrid.selfAdaption();
          this.$refs.stockAccountBillDatagrid.selects = [];
          this.$refs.stockAccountBillDatagrid.selectIds = [];
          this.$refs.stockAccountBillDatagrid.dataChange(1);
        });
      },
      //返回
      returnBack() {
        this.currentSelectList = null;
        this.stockBatchId = "";
        this.ownedBrchNo="";
        this.billManagerResetSearch();
        this.resetSearch();
        this.isQuery = false;
        this.outStockAccountBillMain = false;
        this.outStockBatchMain = true;
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
        });
      },
      //出库提交按钮下拉选择“选择提交/批次提交”
      outStockSubmit(str){
        this.acctType = str;
        if(str === "select"){
          this.submitSelect();
        }
        if(str === "batch"){
          this.submitBatch();
        }
      },
      //选择提交
      submitSelect(){
        if(this.$refs.stockAccountBillDatagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        this.stockBillIds = this.$refs.stockAccountBillDatagrid.selectIds.join(",");
        if (this.needAcctFlag) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定选择记账吗?",
            onOk: () => {
              this.getEntryInfo("select");
            }
          });
        }else {
          // 选择出库提交，直接进行出库
          let params={batchId:this.stockBatchId,pageOperType:"0",ids: this.stockBillIds};
          this.outStock(params)
        }
      },
      //批次记账
      submitBatch() {
        if (this.$refs.stockAccountBillDatagrid.tData.length === 0) {
          this.$msgTip.info(this, { info: "该批次下无数据" });
          return;
        }
        if (this.needAcctFlag){
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定批次记账吗？",
            onOk: () => {
              this.getEntryInfo("batch");
            }
          });
        }else {
          // 批次出库提交，直接进行出库
          let params={batchId:this.stockBatchId,pageOperType:"1"};
          this.outStock(params)
        }
      },
      //获取分录信息
      getEntryInfo(str) {
        this.acctRecordUrl = "/pc/stock/outStockBatchMain/func_generateAcctRecord";
        if(str === "batch") {
          this.acctRecordParam = {batchId: this.stockBatchId, pageOperType: "1",busiType: this.formItem.busiType,acctAuthBusiType:"13",licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo}
        }else if(str === "select") {
          this.acctRecordParam = {batchId: this.stockBatchId, pageOperType: "0",busiType:this.formItem.busiType, ids: this.stockBillIds,acctAuthBusiType:"13",licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo}
        }
        this.showAcctRecordWin = true;
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.stockAccountBillDatagrid.selects = [];
        this.$refs.stockAccountBillDatagrid.selectIds = [];
        this.$refs.stockBatchInfoDetail.getBatchInfo();
        this.$refs.stockAccountBillDatagrid.dataChange(1,(data)=>{
          if(data.length === 0) {
            this.returnBack();
          }
        })
      },
      //确定记账
      acctSubmitSure(info) {
        let param = {};
        if(this.acctType === "batch") {
          param = {batchId: this.stockBatchId, pageOperType: "1",busiType:this.formItem.busiType,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo};
        }else if (this.acctType === "select") {
          param = {batchId: this.stockBatchId, pageOperType: "0",busiType:this.formItem.busiType, ids: this.stockBillIds,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo};
        }
        this.acctSubmitFlag = true;
        post(param, "/pc/stock/outStockBatchMain/func_submitAccount").then(res => {
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

      //记账退回按钮下拉选择“选择退回/批次退回”
      accountBackList(str){
        if(str === "select"){
          this.accountSelectBatchBack();
        }
        if(str === "batch"){
          this.accountBatchBack();
        }
      },
      //选择记账退回
      accountSelectBatchBack(){
        if(this.$refs.stockAccountBillDatagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = this.$refs.stockAccountBillDatagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定选择记账退回吗?",
          onOk: () => {
            post({batchId:this.stockBatchId , ids:ids ,pageOperType:"0",busiType:this.formItem.busiType,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo}, "/pc/stock/outStockBatchMain/func_stockBack").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.stockAccountBillDatagrid.selects = [];
                  this.$refs.stockAccountBillDatagrid.selectIds = [];
                  this.$refs.stockBatchInfoDetail.getBatchInfo();
                  this.$refs.stockAccountBillDatagrid.dataChange(1, (data) => {
                    if (data.length === 0) {
                      this.returnBack();
                    }
                  })
                }else {
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //批次记账退回
      accountBatchBack() {
        if (this.$refs.stockAccountBillDatagrid.tData.length === 0) {
          this.$msgTip.info(this, { info: "该批次下无数据" });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次记账退回吗？",
          onOk: () => {
            this.handleAccountBatchBack();
          }
        });
      },
      handleAccountBatchBack() {
        post({ batchId:this.stockBatchId ,pageOperType:"1",busiType:this.formItem.busiType,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo}, "/pc/stock/outStockBatchMain/func_stockBack").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              this.returnBack();
              this.$refs.stockAccountBillDatagrid.selects = [];
              this.$refs.stockAccountBillDatagrid.selectIds = [];
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //批次编号超链接
      batchNoMain(str,brchNo) {
        this.stockBatchId = str;
        this.billFormItem.batchId = this.stockBatchId;
        this.ownedBrchNo=brchNo;
        this.billFormItem.ownedBrchNo=brchNo
        this.isQuery = true;
        this.outStockBatchMain = false;
        this.outStockAccountBillMain = true;
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.stockAccountBillDatagrid.selfAdaption();
          this.$refs.stockAccountBillDatagrid.createShowCol(this.billTemp);
          this.$refs.stockAccountBillDatagrid.selects = [];
          this.$refs.stockAccountBillDatagrid.selectIds = [];
          this.$refs.stockAccountBillDatagrid.dataChange(1);
        });
      },
      //票面信息关闭
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleBuyDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDtRange = [arr[0], arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDtRange = [];
        }
      },
      /*直接调用入库方法*/
      outStock(params){
        post(params, "/pc/stock/outStockBatchMain/func_outStock").then(res=> {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.stockAccountBillDatagrid.selects = [];
            this.$refs.stockAccountBillDatagrid.selectIds = [];
            this.$refs.stockBatchInfoDetail.getBatchInfo();
            this.$refs.stockAccountBillDatagrid.dataChange(1,(data)=>{
              if(data.length === 0) {
                this.returnBack();
              }
            })
          }else {
            this.$msgTip.error(this, {info: msg});
          }
        }).catch(reason=>{

        });
      },
      //提交到记账授权
      acctAuthorize(){
        let param = {};
        if(this.acctType === "batch") {
          param = {batchId: this.stockBatchId, pageOperType: "1",busiType:"2",licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo};
        }else if (this.acctType === "select") {
          param = {batchId: this.stockBatchId, pageOperType: "0", ids: this.stockBillIds,busiType:"2",licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo};
        }
        this.acctSubmitFlag = true;
        post(param, "/pc/stock/outStockBatchMain/func_addAcctAuthorize").then(res => {
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
    },
    watch:{
      stockBatchId(val){
        this.params.batchId=val
      }
    }
  };
</script>

<style scoped>

</style>
