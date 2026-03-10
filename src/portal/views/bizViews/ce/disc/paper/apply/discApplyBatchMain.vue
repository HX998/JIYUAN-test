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
                 <!-- <own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWinOpen" v-if="this.licenseFlag"></own-brch-nos>-->
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
              <h-datagrid
                :columns="columns"
                highlightRow
                :bindForm="formItem"
                url="/ce/disc/paper/apply/discApplyBatchMain/func_pageQueryDiscBatchList"
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

              <!-- 查询客户信息弹窗 -->
              <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
              <!-- 查询客户账号信息弹窗 -->
              <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                                 :isAllBankAcct=true
                                 @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
              <!--新增修改界面-->
              <disc-apply-add :showDiscApplyAddWin="showDiscApplyAddWin" :operType="operType" :discBatchId="discBatchId" :isCommit="isCommit" :funcNo="funcNo"
                              :isNeedUpdDiscImg="isNeedUpdDiscImg" @discApplyAddWinClose="discApplyAddWinClose"
                              @pageReFresh="handlePageReFresh" ref="paperDiscApplyAdd"
                              :licenseFlag="licenseFlag" :authPath="authPath" :isNoticeFirstAudit="isNoticeFirstAudit" :showNoticeFirstStationItem="showNoticeFirstStationItem"></disc-apply-add>
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
  import { post, on, off, getDictListByGroups,getBusinessParameter,getDictValueFromMap ,formatNumber ,accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "discApplyBatchMain",
    components: {
      ShowDiscImageUpload:() => import(/* webpackChunkName: "ce/disc/common/showDiscImageUpload" */`@/views/bizViews/ce/disc/common/showDiscImageUpload`),
      DiscApplyAdd:() => import(/* webpackChunkName: "ce/disc/paper/apply/discApplyBatchAdd" */`@/views/bizViews/ce/disc/paper/apply/discApplyBatchAdd`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
    },
    data() {
      return {
        //影像上传
        showUploadImageWin : false,
        isNeedUpdDiscImg : false,
        imageParams : {
          id: '',
          uploadUrl: window.LOCAL_CONFIG.API_HOME+"/ce/disc/paper/apply/discApplyBatchMain/func_uploadImage",
          viewUrl: window.LOCAL_CONFIG.API_HOME + "/ce/disc/paper/apply/discApplyBatchMain/func_imageById"
        },
        formItem : {
          custName: "",
          custNo: "",
          custAcctNo:"",
          batchNo:"",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path,
          billClass:"ME01",
          funcNo:"PICE020215",
          isCommit:'noCommit'
        },
        columns : [
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
                      this.batchNoMain(params.row.id)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            sortable: true,
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
            sortable: true,
            hiddenCol: false,
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
        ],
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        custElecSignWin : false,
        discApplyBatchMain : true,
        ifShowMore : false,
        hasCommitDisabled : false,
        noCommitDisabled : false,
        showDiscApplyAddWin : false,
        currentSelectRow : [],
        discBatchId : '',
        operType : '',
        isCommit : "",
        funcNo : "",
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:"",
        authPath: this.$route.path ,
        // brchNoWin : false,
        protectTypeList : [],
        dictMap : new Map(),
        isNoticeFirstAudit:"0",
        showNoticeFirstStationItem:false
      };
    },
    mounted() {
      getDictListByGroups("RateType,PayType,QueryType,ArbitrateMode,DraftTypeCode,CorpScale,Yon").then(res => {
        this.dictMap = res.get("map");
      });
      getBusinessParameter({paramKey:'ce.disc.is_paper_need_upload_img'}, this.getDiscUpdImgFlag);

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
      showQry(val){
        this.ifShowMore = val;
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
      getDiscUpdImgFlag(res) {
        if (res.data.retData === '1') {
          this.isNeedUpdDiscImg = true;
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
        // this.noCommitButton();
      },
      // 行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
      },
      //未提交
      noCommitButton(){
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
        this.formItem.funcNo = "PICE020215";
        this.handleSearch();
      },
      //已提交
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
        }
        this.showDiscApplyAddWin = true;
      },
      // 新增贴现批次申请提交页面关闭
      discApplyAddWinClose() {
        this.currentSelectRow = [];
        this.showDiscApplyAddWin = false;
        this.handleSearch()
      },
      //删除按钮
      handleComfirm(){
        if(this.currentSelectRow == null || this.currentSelectRow.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return
        }
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: this.$t('m.i.common.isConfirmDelete') + '?',
          onOk: () => {
            this.handledel();
          }
        })
      },
      //提示页面选择‘是’之后进行删除操作
      handledel() {
        let delId = this.currentSelectRow.id;
        post({id:delId, deleteFlag: "0"},'/ce/disc/paper/apply/discApplyBatchMain/func_deleteDiscBatch').then(res => {
          if(res){
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if(retCode==="000000"){
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              // this.retMsg = "";
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
        let url="/ce/disc/paper/apply/discApplyBatchMain/func_deleteDiscBatch";
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
                    this.currentSelectRow = [];
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
      //刷新当前界面
      handlePageReFresh(){
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        })
      },
      //撤销
      cancelApplyBatch(){
        if(this.currentSelectRow == null || this.currentSelectRow.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return
        }
        this.discBatchId = this.currentSelectRow.id;
        this.isCommit = this.formItem.isCommit;
        this.funcNo = "PICE020219";
        this.operType = "modify";
        this.showDiscApplyAddWin = true;
      },

      //批次编号超链接
      batchNoMain(str) {
        this.discBatchId = str;
        this.isCommit = this.formItem.isCommit;
        if(this.formItem.isCommit === "noCommit"){
          this.funcNo = "PICE020215";
        }
        if(this.formItem.isCommit === "hasCommit"){
          this.funcNo = "PICE020219";
        }
        this.operType = "modify";
        this.showDiscApplyAddWin = true;
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
      },
      brchNoWinOpen() {
        console.log(this.$route.path),
        this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    }
  };
</script>

<style scoped>

</style>
