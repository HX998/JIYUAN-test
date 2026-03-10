<template>
  <div class="layout">
    <div v-if="valetRecordBatchMain">
      <!--查询表单-->
      <div class="h-form-search-box">
        <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
          <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.common.custNo')" prop="hldrCustNo" required>
              <h-input v-model="formItem.hldrCustNo" placeholder="" icon="android-search" @on-click="queryCustMessage()" readonly
                       clearable @on-clear="clearVal('hldrCustNo')"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.custName')" prop="hldrName" required>
              <h-input v-model="formItem.hldrName" placeholder="" disabled ></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.custAcctNo')" prop="hldrAcctNo" required>
              <h-input v-model="formItem.hldrAcctNo" placeholder="" icon="android-search"
                       @on-click="queryCustAcctNo()" readonly clearable @on-clear="clearVal('hldrAcctNo')"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billNo')" prop="reverseBillNo">
              <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.ce.isCommit')" prop="activeFlagList">
              <h-radio-group v-model="formItem.activeFlagList">
                <h-radio label="0" @on-click="noCommitButton">
                  <span>未提交</span>
                </h-radio>
                <h-radio label="1,2" @on-click="hasCommitButton">
                  <span>已提交</span>
                </h-radio>
              </h-radio-group>
            </h-form-item>
            <h-form-item class="h-form-operate">
              <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
              <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="valetRecordBatchMain">
      <h-datagrid
        :columns="columns"
        highlight-row
        :bindForm="formItem"
        url="/pb/prsttn/paper/valet/pPrsttnForCustMain/func_pageQueryPaperPrsttnBill"
        :row-select="true"
        :has-select="hasSelect"
        ref="datagrid">
        <div slot="toolbar">
          <h-button type="primary" v-if="noCommitDisabled" :disabled="isShow" @click="valetAddOrModifyBill('add')">
            {{$t("m.i.common.add")}}
          </h-button>
          <h-button type="primary" v-if="noCommitDisabled" :disabled="isShow" @click="valetAddOrModifyBill('modify')">
            {{$t("m.i.common.modify")}}
          </h-button>
          <h-button type="primary" v-if="noCommitDisabled" :disabled="isShow" @click="batchImport()">{{$t("m.i.common.batchImport")}}</h-button>
          <h-button type="primary" v-if="noCommitDisabled" @click="deleteSelectBatch()">{{$t("m.i.common.delete")}}</h-button>
          <h-button type="primary" v-if="noCommitDisabled" @click="templateDownload()">{{$t('m.i.common.importTemplateDownload')}}</h-button>
          <h-button type="primary" v-if="noCommitDisabled" @click="submitBill()">{{$t("m.i.common.submit")}}</h-button>
          <h-button type="primary" v-if="hasCommitDisabled" @click="cancelApplyBill()">{{$t("m.i.common.cancel")}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>

    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.hldrCustNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <!--新增明细-->
    <prsttn-for-cust-add-bill :valetAddBillWin="valetAddBillWin" @valetAddBillWinClose="valetAddBillWinClose"
                              @valetAddBillChange="valetAddBillChange" :valetAddBillInfoParams="valetAddBillInfoParams"></prsttn-for-cust-add-bill>

    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
    <!-- 分录弹框 -->
    <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :show-acct-record-win="this.showAcctRecordWin" :showPrintButton="this.showPrintButton"
                 @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose" :submitFlag="this.acctSubmitFlag"
                 @printSuccessCallback="printSuccessCallback" ref="showAcctRecord"></acct-record>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pPrsttnForCustMain",
    components: {
      PrsttnForCustAddBill: () => import(/* webpackChunkName: "pb/prsttn/paper/valet/prsttnForCustAddBill" */ '@/views/bizViews/pb/prsttn/paper/valet/prsttnForCustAddBill')
    },
    data() {
      return {
        formItem : {
          billClass:"ME01",
          hldrCustNo:"",
          hldrName:"",
          hldrAcctNo:"",
          reverseBillNo:"",
          openBankNo:"",
          openBrchNo:"",
          activeFlagList:"0",
          inOutFlag:"1",
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,

            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: remitDt}},  remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span",{domProps: {title: dueDt}},   dueDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
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
             title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.hldrName"),
            key: "hldrName",
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.ce.hldrCustNo"),
            key: "hldrCustNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrAcctNo"),
            key: "hldrAcctNo",

            hiddenCol: false
          }
        ],
        dictMap : new Map(),
        currentSelectList : [],
        currentSelectRowInx : [],
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        valetRecordBatchMain : true,
        isShow : true,
        noCommitDisabled : true,
        hasCommitDisabled : false,
        isFalse : false,
        ifShowMore : false,
        billTypeList : [],
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        //新增界面
        valetAddBillWin : false,
        //修改票据明细界面所需入参
        valetAddBillInfoParams : {
          billType: "",
          operType: "",
          billId: "",
          billNo: "",
          hldrAcctNo:"",
          dictMap: new Map(),
          billTypeList: []
        },
        //批量导入
        importWin : false,
        fileParams : {
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_loadExcelData",  //导入excel数据解析接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_saveExcelData",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center"
            },
            {
              title: this.$t("m.i.billInfo.billType"),
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
              title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.remitDt"),
              key: "remitDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.dueDt"),
              key: "dueDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.billMoneyByUnit"),
              key: "billMoney",
              hiddenCol: false,
              ellipsis: false,
              sortable: true,
              render: (h, params) => {
                let billMoney = formatNumber(params.row.billMoney, 2, ",");
                return h("span", {
                  domProps: {
                    title: billMoney
                  }
                }, billMoney);
              }
            },
            {
              title: this.$t("m.i.billInfo.acptName"),
              key: "acptName",
              sortable: true,
              hiddenCol: false,
              ellipsis: false,
            },
            {
              title: this.$t("m.i.billInfo.drwrName"),
              key: "drwrName",
              hiddenCol: false,
              sortable: true,
              ellipsis: false,
            },
            {
             title: this.$t("m.i.billInfo.drwrAcctNo"),
              key: "drwrAcctNo",
              hiddenCol: false,
              ellipsis: false,
            },
            {
              title: this.$t("m.i.billInfo.drweBankName"),
              key: "drweBankName",
              hiddenCol: false,
              sortable: true,
              ellipsis: false,
            },
            {
              title: this.$t("m.i.billInfo.drweBankNo"),
              key: "drweBankNo",
              hiddenCol: false,
              ellipsis: false,
            },
            {
               title: this.$t("m.i.billInfo.pyeeName"),
              key: "pyeeName",
              sortable: true,
              hiddenCol: false,
              ellipsis: false,
            },
            {
             title: this.$t("m.i.billInfo.pyeeAcctNo"),
              key: "pyeeAcctNo",
              hiddenCol: false,
              ellipsis: false,
            },
            {
             title: this.$t("m.i.billInfo.pyeeBankName"),
              key: "pyeeBankName",
              sortable: true,
              hiddenCol: false,
              ellipsis: false,
            },
            {
              title: this.$t("m.i.billInfo.acptProtocalNo"),
              key: "acptProtocalNo",
              hiddenCol: false,
              ellipsis: false,
            },
            {
              title: this.$t("m.i.billInfo.drweBankAddr"),
              key: "drweBankAddr",
              hiddenCol: false,
              ellipsis: false,
            },
          ],
          paramKey:"billInfoDtos"
        },
        hasSelect : false,
        //分录
        acctRecordUrl : "",
        acctRecordParam : {},
        showAcctRecordWin : false,
        batchId : "",
        ids : "",
        acctSubmitFlag : false,
        showPrintButton : false,
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal(type) {
        if (type === 'hldrCustNo') {
          this.formItem.hldrAcctNo = "";
          this.formItem.hldrName = "";
          this.formItem.hldrCustNo = "";
          this.formItem.hldrAcctNo = "";
          this.formItem.openBankNo = "";
          this.formItem.openBrchNo = "";
        } else {
          this.formItem.hldrAcctNo = "";
          this.formItem.openBankNo = "";
          this.formItem.openBrchNo = "";
        }
      },
      //查询
      handleSearch() {
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.hldrCustNo = "";
        this.formItem.hldrName = "";
        this.formItem.hldrAcctNo = "";
        this.formItem.reverseBillNo = "";
        this.isShow = true;
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      noCommitButton(){
        this.formItem.activeFlagList = "0";
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
        this.$nextTick(() => {
          this.handleSearch();
        });
      },
      hasCommitButton(){
        this.formItem.activeFlagList = "1,2";
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
        this.$nextTick(() => {
          this.handleSearch();
        });
      },
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        // this.$refs.formItem.resetFields();
        this.formItem.hldrAcctNo = "";
        this.formItem.hldrName = info.custName;
        this.formItem.hldrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.hldrAcctNo = info.custAcctNo;
          this.formItem.openBankNo = info.openBankNo;
          this.formItem.openBrchNo = info.openBrchNo;
          this.isShow = false;
        }
        this.showCustMessageWin = false;
        this.handleSearch();
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.hldrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.hldrAcctNo = info.custAcctNo;
        this.formItem.openBankNo = info.openBankNo;
        this.formItem.openBrchNo = info.openBrchNo;
        this.isShow = false;
        this.showCustAcctNoWin = false;
        this.handleSearch();
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //新增/修改按钮
      valetAddOrModifyBill(type){
        if (this.formItem.hldrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        if(this.formItem.hldrAcctNo === ""){
          this.$msgTip.info(this, { info: "请先选择客户账号！" });
          return;
        }
        this.valetAddBillInfoParams.operType = type;
        if (this.valetAddBillInfoParams.operType === "add") {
          this.valetAddBillInfoParams.billType = "AC01";
          this.jumpToAddBillWin();
        }
        if (this.valetAddBillInfoParams.operType === "modify") {
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return
          }
          if (this.$refs.datagrid.selects.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return
          }
          this.currentSelectList = this.$refs.datagrid.selects;
          this.valetAddBillInfoParams.billId = this.currentSelectList[0].billId;
          this.valetAddBillInfoParams.billNo = this.currentSelectList[0].billNo;
          this.valetAddBillInfoParams.hldrAcctNo = this.currentSelectList[0].hldrAcctNo;
          this.valetAddBillInfoParams.billType = this.currentSelectList[0].billType;
          this.jumpToAddBillWin();
        }

      },
      //跳转到新增明细界面
      jumpToAddBillWin(){
        this.valetAddBillInfoParams.billTypeList = this.billTypeList;
        this.valetAddBillWin = true;
      },
      //新增界面赋值
      valetAddBillChange(info){
        this.valetAddBillInfoForm = info;
        this.valetAddBillInfoForm.remitDt = this.$moment(this.valetAddBillInfoForm.remitDt).format("YYYYMMDD");
        this.valetAddBillInfoForm.dueDt = this.$moment(this.valetAddBillInfoForm.dueDt).format("YYYYMMDD");
        this.valetAddBillInfoForm.billMoney = this.valetAddBillInfoForm.billMoney.replace(/,/g, "");
        if(this.valetAddBillInfoForm.remitDt >= this.valetAddBillInfoForm.dueDt){
          this.$msgTip.info(this,{info:"出票日期必须小于汇票到期日"});
          return
        }
        if(this.valetAddBillInfoForm.remitDt > window.sessionStorage.getItem("workDate")) {
          this.$msgTip.info(this, { info: "出票日期不能大于当前营业日期" });
          return;
        }
        this.valetAddBillInfoForm.custNo = this.formItem.hldrCustNo;
        this.valetAddBillInfoForm.custName = this.formItem.hldrName;
        this.valetAddBillInfoForm.acctNo = this.formItem.hldrAcctNo;
        this.valetAddBillInfoForm.openBankNo = this.formItem.openBankNo;
        this.valetAddBillInfoForm.openBrchNo = this.formItem.openBrchNo;
        this.valetAddBillInfoForm.billClass = "ME01";
        if(this.valetAddBillInfoParams.operType === "add"){
          this.valetAddBillInfoForm.id = "";
          post(this.valetAddBillInfoForm , "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_addPaperPrsttnBill").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this,{info:res.data.retMsg});
                this.valetAddBillWin = false;
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this,{info:res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
            }
          });
        }else if(this.valetAddBillInfoParams.operType === "modify"){
          this.valetAddBillInfoForm.batchId = this.currentSelectList[0].id;
          this.valetAddBillInfoForm.id = this.currentSelectList[0].billId;
          post(this.valetAddBillInfoForm , "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_updatePaperPrsttnBill").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this,{info:res.data.retMsg});
                this.valetAddBillWin = false;
                this.$refs.datagrid.dataChange(1);
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
                this.currentSelectList = [];
              } else {
                this.$msgTip.error(this,{info:res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
            }
          });
        }

      },
      //新增界面关闭
      valetAddBillWinClose(){
        this.valetAddBillWin = false;
        this.handleSearch();
      },
      //批量导入
      batchImport() {
        if (this.formItem.hldrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        if(this.formItem.hldrAcctNo === ""){
          this.$msgTip.info(this, { info: "请先选择客户账号！" });
          return;
        }
        this.importWin = true;
        this.fileParams.extraGridDatas = {
          custName : this.formItem.hldrName,
          custNo :this.formItem.hldrCustNo,
          acctNo : this.formItem.hldrAcctNo,
          openBankNo : this.formItem.openBankNo,
          openBrchNo :this.formItem.openBrchNo,
          billClass : this.formItem.billClass
        };
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      //选择删除
      deleteSelectBatch(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = this.$refs.datagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定删除吗?",
          onOk: () => {
            post( { ids:ids } , "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_deletePaperPrsttnBill").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this,{info:msg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this,{info:res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //提交
      submitBill(){
        if(this.$refs.datagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = this.$refs.datagrid.selectIds.join(",");
        this.ids = ids;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交吗?",
          onOk: () => {
              //查询是否需要收取手续费
            post( { ids:ids } , "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_queryIsNeedFee").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retData = res.data.retData;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                    //收手续费
                    if(retData == true){
                        //判断是否为同一客户
                        let list = this.$refs.datagrid.selects;
                        let custAcctNo = list[0].hldrAcctNo;
                        for(let i=1 ; i< list.length;i++){
                            if(list[i].hldrAcctNo !== custAcctNo){
                                this.$msgTip.info(this, { info: "记账票据必须为同一客户账号！" });
                                return;
                            }
                        }
                        //获取分录信息
                        this.getEntryInfo();
                    }else{
                        //提交代客录票票据信息
                        this.submitPrsttnBillAdd(ids);
                    }
                /*  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];*/
                } else {
                  this.$msgTip.error(this,{info:res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //撤销按钮
      cancelApplyBill(){
        if(this.$refs.datagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = this.$refs.datagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗?",
          onOk: () => {
            post( { ids:ids } , "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_cancelSubmitPrsttnBill").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this,{info:msg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this,{info:res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //判断是否为同一客户账号
      isSameCustAcctNo(){
          let list = this.$refs.datagrid.selects;
          let custAcctNo = list[0].hldrAcctNo;
          for(let i=1 ; i< list.length;i++){
              if(list[i].hldrAcctNo !== custAcctNo){
                  return false;
              }
          }
          return true;
      },
      //票面信息关闭
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      //提交代客录票票据信息
      submitPrsttnBillAdd(ids){
          post( { ids:ids } , "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_submitPrsttnBillAdd").then(res => {
              if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                      this.$msgTip.success(this,{info:msg});
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                      this.currentSelectList = [];
                      this.$refs.datagrid.selects = [];
                      this.$refs.datagrid.selectIds = [];
                  } else {
                      this.$msgTip.error(this,{info:res.data.retMsg});
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  }
              } else {
                  this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
          });
        },
        //获取分录信息
        getEntryInfo() {
            this.acctRecordUrl = "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_queryAcctRecord";
            this.acctRecordParam = {  ids:this.ids ,accountType:"1" ,billClass:"ME01"};
            this.showAcctRecordWin = true;
        },
        //关闭分录弹窗
        showAcctRecordWinClose() {
          debugger
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
        acctSubmitSure(info) {
            this.acctSubmitFlag = true;
            post({ ids:this.ids ,accountType:"1",billClass:"ME01" }, "/pb/prsttn/paper/valet/pPrsttnForCustMain/func_submitPrsnttnAccount").then(res => {
                this.acctSubmitFlag = false;
                if (res) {
                    let msg = res.data.retMsg;
                    let retCode = res.data.retCode;
                    if (retCode === "000000") {
                        this.$msgTip.success(this, { info: msg });
                        //打印
                        this.showPrintButton = true;
                        if(!info.isHasPrint) {
                            this.showAcctRecordWinClose();
                        }
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
    }
  };
</script>

<style scoped>

</style>
