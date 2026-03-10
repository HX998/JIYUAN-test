<template>
  <div class="layout">
    <div v-if="discApplyBatchMain">
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <ban-endrsmt-mark :formItem = "formItem" @noCommitButton='noCommitButton' @hasCommitButton='hasCommitButton'></ban-endrsmt-mark>
                  <!--<own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWinOpen" v-if="this.licenseFlag"></own-brch-nos>-->
                  <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                               :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                               url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <cust-name :formItem = "formItem" @queryCustMessage="queryCustMessage"></cust-name>
                  <cust-acct-no :formItem = "formItem" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no>
                  <batch-no v-model="formItem.batchNo"></batch-no>
                  <query-btn  v-on:showChange="showQry"  :advanceShow='true' :formSearch='handleSearch' :formSearchReset='resetSearch'> </query-btn>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-row>
                <h-col span="24">
                  <h-datagrid
                    :columns="columns"
                    highlightRow
                    :bindForm="formItem"
                    url="/ce/disc/elec/apply/eDiscApplyBatchMain/func_pageQueryDiscBatchList"
                    :on-current-change="handleRowClick"
                    :on-current-change-cancel="handleRowClickCancel"
                    ref="datagrid">
                    <div slot="toolbar" class="pull-left">

                      <add-btn @handleForm="discApplyAddWinOpen('add')" :disabled="hasCommitDisabled"></add-btn>
                      <update-btn @handleForm="discApplyAddWinOpen('modify')" :disabled="hasCommitDisabled"></update-btn>
                      <delete-btn @deleteData="handleComfirm()" :disabled="hasCommitDisabled"></delete-btn>
                      <cancel-btn @cancel="cancelApplyBatch()" :disabled="noCommitDisabled || this.formItem.isCommit === 'noCommit'"></cancel-btn>
                    </div>
                  </h-datagrid>
                </h-col>
              </h-row>

              <!-- 查询客户信息弹窗 -->
              <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
              <!-- 查询客户账号信息弹窗 -->
              <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                                 :isAllBankAcct=true
                                 @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

              <e-disc-apply-batch-add :showEDiscApplyAddWin="showEDiscApplyAddWin" :operType="operType" :isNeedUpdDiscImg="isNeedUpdDiscImg"
                                      :discBatchId="discBatchId" :isCommit="isCommit"  :funcNo="funcNo" @eDiscApplyAddWinClose="eDiscApplyAddWinClose"
                                      @pageReFresh="handlePageReFresh" :licenseFlag="licenseFlag" :authPath="authPath"
                                      :isNoticeFirstAudit="isNoticeFirstAudit" :showNoticeFirstStationItem="showNoticeFirstStationItem"></e-disc-apply-batch-add>
            </div>
          </div>
        </h-col>
      </h-row>
    </div>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                 @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups,getBusinessParameter,getDictValueFromMap , formatNumber,accMul,formatTime } from "@/api/bizApi/commonUtil";

  export default {
    name: "eDiscApplyBatchMain",
    components: {
      EDiscApplyBatchAdd:() => import(/* webpackChunkName: "ce/disc/elec/apply/eDiscApplyBatchAdd" */`@/views/bizViews/ce/disc/elec/apply/eDiscApplyBatchAdd`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
    },
    data() {
      return {
        formItem : {
          custName: "",
          custAcctNo: "",
          custNo:"",
          batchNo:"",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          isCommit:'noCommit',
          billClass:"ME02",
          funcNo:"PICE020215",
        },
        columns : [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
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
                      this.batchNoMain(params.row.id,params.row.lockUserNo)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false
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
             title: this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.discDt == null || params.row.discDt === ""){
                return "";
              }
              let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.discInterestRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
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
          {
            title: this.$t("m.i.common.busiType"),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.interestMethod"),
            key: "payType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"PayType",params.row.payType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.ce.redeemOpenDt"),
            key: "redeemOpenDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.redeemOpenDt == null || params.row.redeemOpenDt === ""){
                return "";
              }
              let date = this.$moment(params.row.redeemOpenDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.redeemDueDt"),
            key: "redeemDueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.redeemDueDt == null || params.row.redeemDueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.redeemDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.redeemRate"),
            key: "redeemRatePct",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.salerCustName"),
            key: "salerCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.salerAcctNo"),
            key: "salerAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyPayPcetByUnit"),
            key: "buyPayPcet",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyerPayInterName"),
            key: "payCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyerPayInterAcctNo"),
            key: "payAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.thirdPayPcet"),
            key: "thirdPayPcet",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.thirdCustName"),
            key: "thirdCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.thirdAcctNo"),
            key: "thirdAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.transCtrctNo"),
            key: "transCtrctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.busiBrchName"),
            key: "busiBrchName",
            hiddenCol: false
          },
          {
              title: this.$t("m.i.common.corpScale"),
            key: "corpScale",

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"CorpScale",params.row.corpScale);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
             title: this.$t("m.i.common.isGreenCorp"),
            key: "isGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isGreenCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.ce.lockUserNo"),
            key: "lockUserNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.lockBrchName"),
            key: "lockBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.lockTm"),
            key: "lockTm",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.lockTm == null || params.row.lockTm === "" ||params.row.lockTm === 0) {
                return "";
              }
              let lockTm = formatTime(this,params.row.lockTm);
              return h("span", lockTm);
            }
          },
        ],
        isList : [
          {value:"1", label:"是"},
          {value:"0", label:"否"},
        ],
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        custElecSignWin : false,
        discApplyBatchMain : true,
        currentSelectRow : [],
        ifShowMore : false,
        hasCommitDisabled : false,
        noCommitDisabled : false,
        showEDiscApplyAddWin : false,
        showEDiscApplyAddBillWin : false,
        discBatchId : '',
        operType : '',
        licenseFlag:"",
        protectTypeList : [],
        dictMap : new Map(),
        funcNo : "",
        isCommit : "",
        authPath:this.$route.path,
        //brchNoWin:false,
        isNeedUpdDiscImg : false,
        lockMark:false,
        syncOperMode:"",
        queryUrl: "/pc/busiLock/func_getBusiLockParam",
        isNoticeFirstAudit:"0",
        showNoticeFirstStationItem:false,
      };
    },
    created() {


    },
    mounted() {
      this.getSyncOperMode();
      getDictListByGroups("RateType,PayType,QueryType,ArbitrateMode,DraftTypeCode,CorpScale,Yon").then(res => {
        this.dictMap = res.get("map");
      });
      getBusinessParameter({paramKey:'ce.disc.is_elec_need_upload_img'}, this.getDiscUpdImgFlag);

      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      this.getIsShowNoticeFirstStationrItem();
      this.getDefaultNoticeFirstStationValue();
    },
    methods: {
      //获取系统参数（审批提交是否显示通知第一岗）
      getIsShowNoticeFirstStationrItem() {
        let paramKey = "pc.flow.is_show_notice_input_when_audit_appl";
        post({ paramKey: paramKey }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showNoticeFirstStationItem = res.data.retData === "1";
            } else {
              this.showNoticeFirstStationItem = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //获取系统参数（短信通知第一岗选项默认值）pc.flow.default_notice_value_when_audit_appl
      getDefaultNoticeFirstStationValue() {
        let paramKey = "pc.flow.default_notice_value_when_audit_appl";
        post({ paramKey: paramKey }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.isNoticeFirstAudit = res.data.retData?res.data.retData:"0";
            } else {
              this.isNoticeFirstAudit="0";
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      getSyncOperMode() {
        let url = this.queryUrl;
        post({},url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.syncOperMode = res.data.retMsg;
                if (this.syncOperMode==='1') {
                  this.$refs.datagrid.controlColumnsHidden("lockUserNo", false);
                  this.$refs.datagrid.controlColumnsHidden("lockBrchName", false);
                  this.$refs.datagrid.controlColumnsHidden("lockTm", false);
                } else {
                  this.$refs.datagrid.controlColumnsHidden("lockUserNo", true);
                  this.$refs.datagrid.controlColumnsHidden("lockBrchName", true);
                  this.$refs.datagrid.controlColumnsHidden("lockTm", true);
                }
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      showQry(val){
        this.ifShowMore = val;
      },
      getDiscUpdImgFlag(res) {
        if (res.data.retData === '1') {
          this.isNeedUpdDiscImg = true;
        }
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "custAcctNo"){
          this.formItem.custAcctNo = "";
        }
      },
      //查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.formItem.custAcctNo = "";
        this.formItem.custName = "";
        this.formItem.batchNo = "";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$nextTick(() => {
          if(this.formItem.isCommit === "noCommit"){
            // this.$refs.formItem.resetFields();
            this.noCommitDisabled = true;
            this.hasCommitDisabled = false;
            this.formItem.isCommit = "noCommit"
          }
          if(this.formItem.isCommit === "hasCommit"){
            // this.$refs.formItem.resetFields();
            this.hasCommitDisabled = true;
            this.noCommitDisabled = false;
            this.formItem.isCommit = "hasCommit"
          }
        });
        // this.noCommitButton();
      },
      // 行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
      },
      noCommitButton(){
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
        this.formItem.funcNo = "PICE020215";
        this.handleSearch();
      },
      hasCommitButton(){
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
        this.formItem.funcNo = "PICE020219";
        this.handleSearch();
      },
      //查询客户信息
      queryCustMessage(){
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      // 新增贴现批次申请提交页面开启
      discApplyAddWinOpen(type) {
        this.operType = type;
        this.isCommit = this.formItem.isCommit;
        this.funcNo = "PICE020215";
        if(type === 'modify'){
          if(this.currentSelectRow == null || this.currentSelectRow.length === 0){
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.discBatchId = this.currentSelectRow.id;
          if (this.syncOperMode==='1') {
            let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
            let lockUserNo = this.currentSelectRow.lockUserNo;
            if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
              if (lockUserNo !== userNo ) {
                this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
                return;
              }
            }
            this.addOrDelBatchBusiLock(this.discBatchId,"add");
          } else {
            this.showEDiscApplyAddWin = true;
          }
        } else {
          this.showEDiscApplyAddWin = true;
        }
      },
      // 新增贴现批次申请提交页面关闭
      eDiscApplyAddWinClose() {
        this.currentSelectRow = [];
        this.showEDiscApplyAddWin = false;
        if (this.lockMark) {
          this.addOrDelBatchBusiLock(this.discBatchId,"delete","");
        }
        this.operType = "";
        this.discBatchId = "";
        this.isCommit = "";
        this.funcNo = "";
        this.lockMark = false;
        this.handleSearch();
      },
      //删除批次信息
      handleComfirm(){
        if(this.currentSelectRow == null || this.currentSelectRow.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: this.$t('m.i.common.isConfirmDelete') + '?',
          onOk: () => {
            this.handledel();
          }
        })
      },
      handledel() {
        let list = this.currentSelectRow;
        let delId = list.id;
        post({ id : delId ,deleteFlag:"0" },'/ce/disc/elec/apply/eDiscApplyBatchMain/func_deleteDiscBatch').then(res => {
          if(res){
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if(retCode==="000000"){
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow=[];
              this.retMsg = "";
            }else if(retCode === "000002" && retMsg === "100001"){
              this.continueApply(delId);
            }else{
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }else{
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },
      continueApply(id){
        let url="/ce/disc/elec/apply/eDiscApplyBatchMain/func_deleteDiscBatch";
        let content ="批次下所有明细将同时删除，确认要删除吗？";
        this.$hMsgBox.confirm({
          title:"确认要继续提交申请吗?",
          content:content,
          onOk: () => {
            post({ id: id ,deleteFlag:"1"}, url).then(res => {
              if (res) {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.currentSelectRow=[];
                    this.retMsg = "";
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }
            });
          }
        });
      },
      //撤销
      cancelApplyBatch(lockUserNo){
        if(this.currentSelectRow == null || this.currentSelectRow.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.discBatchId = this.currentSelectRow.id;
        this.isCommit = this.formItem.isCommit;
        this.funcNo = "PICE020219";
        this.operType = "modify";
        if (this.syncOperMode==='1') {
          let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
            if (lockUserNo !== userNo ) {
              this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
              return;
            }
          }
          this.addOrDelBatchBusiLock(this.discBatchId,"add","modify");
        } else {
          this.showEDiscApplyAddWin = true;
        }
      },
      //新增界面刷新
      handlePageReFresh(){
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      //批次编号超链接
      batchNoMain(str,lockUserNo) {
        this.discBatchId = str;
        this.isCommit = this.formItem.isCommit;
        if(this.formItem.isCommit === "noCommit"){
          this.funcNo = "PICE020215";
        }
        if(this.formItem.isCommit === "hasCommit"){
          this.funcNo = "PICE020219";
        }
        this.operType = "modify";
        if (this.syncOperMode==='1') {
          let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
            if (lockUserNo !== userNo ) {
              this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
              return;
            }
          }
          this.addOrDelBatchBusiLock(this.discBatchId,"add","modify");
        } else {
          this.showEDiscApplyAddWin = true;
        }
      },
      addOrDelBatchBusiLock(id,type,str) {
          let lockUserNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          let lockBrchName = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
          if (type === "add") {
            post({
              id: id,
              lockType: "0",
              lockUserNo: lockUserNo,
              lockBrchName: lockBrchName
            }, "/ce/disc/elec/apply/eAcptApplyMain/func_addBatchBusiLock").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode !== "000000") {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.lockMark = false;
                  this.handleSearch();
                } else {
                  this.lockMark = true;
                  this.showEDiscApplyAddWin = true;
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            post({ id: id, lockType: "1" }, "/ce/disc/elec/apply/eAcptApplyMain/func_deleteBatchBusiLock").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode !== "000000") {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
      },
    }
  };
</script>

<style scoped>

</style>
