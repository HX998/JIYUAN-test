<!--贴现通挂牌-新增、修改弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempDiscListingApplyAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增挂牌</span>
        <span v-else-if="batchParams.batchType==='modify'">修改挂牌</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search" onlyBlurRequire>
          <listing-form-item :addForm="addOrEditForm" :batchParams="batchParams"></listing-form-item>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()">保存</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          :url="dataGridUrl"
          :bindForm="dataGridFormItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="pickBill()" v-if="batchParams.batchType!=='show'">{{$t("m.i.common.pickBill")}}
            </h-button>
            <h-button type="primary" @click="importPickBill()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.exportPickBill")}}
            </h-button>
            <h-button type="primary" @click="deleteBill()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.deleteBill")}}
            </h-button>
            <h-button type="primary" @click="calcInterest()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.calcInterest")}}
            </h-button>
            <h-button type="primary" @click="applySubmit()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.applyBatch")}}
            </h-button>

            <h-button type="primary" @click="importTemplate()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.templateDownload")}}
            </h-button>
            <h-button type="primary" @click="showAttach()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.fileManage")}}
            </h-button>
            <!--<h-button type="primary" @click="exportBill()" v-if="batchParams.batchType!=='show'"
                      :disabled="exportBillCommit">
              {{$t("m.i.common.exportExcel")}}
            </h-button>-->
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

    <!--挑票-->
    <entrust-pick-bill :pickBillWin="pickBillWin" :pickBillParams="pickBillParams"
                    @pickBillWinClose="pickBillWinClose"></entrust-pick-bill>
    <!-- 批量导入 -->
    <common-file-upload-no-show :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :batchId="batchId" operType="upload" @showFileWinClose="showFileWinClose"
                   sourceType="DBL" :filePathUrl="filePathUrl"></show-file-win>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "discListingApplyAdd",
    components: {
      ListingFormItem: () => import(/* webpackChunkName: "be/discquote/broker/listing/listingFormItem"*/"@/views/bizViews/be/discquote/broker/listing/listingFormItem"),
      EntrustPickBill: () => import(/* webpackChunkName: "be/discquote/entrust/entrustPickBill"*/"@/views/bizViews/be/discquote/entrust/entrustPickBill"),
      ShowFileWin: () => import(/* webpackChunkName: "be/discquote/file/showFileWin" */`@/views/bizViews/be/discquote/file/showFileWin`)
    },
    data() {
      return {
        dataGridUrl: "",
        batchId: "",
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        addOrEditForm: {
          id: "",
          busiType: "",
          busiNo:"",
          brokerBrchName: "",
          brokerBrchCode:"",
          brokerBankNo:"",
          brokerTraderName: "",
          brokerTraderNo:"",
          discCustName:"",
          discOutSocCode:"",
          discCorpScale:"",
          discIndustry:"",
          isDiscArc:"",
          isDiscGreenCorp:"",
          isDiscTechnologyCorp:"",
          isDiscPrivateCorp:"",
          area:"",
          billType: "",
          billClass: "",
          isBargain:"",
          clearMode:"",
          clearSpeed:"",
          firstSettleDt:"",
          ratePct: "",
          discOutBankNo:"",
          respTm:"",
          transCustType:"",
          transCustTypeName:"",
          eliminateCpBrchType:"",
          eliminateCpBrchTypeName:"",
          totalAmt: "",
          totalNum:"",
          firstPayInterest:"",
          firstSettleAmt:"",
          remainDays:"",
          fileNum:"",
          listingRemark:"",
          workDate:"",
          minRate:"",
          maxRate:"",
          maxTenorDays:""
        },
        dataGridFormItem: {
          batchId: ""
        },
        columns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueMatDt"),
            key: "dueMatDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },

          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.remainingPeriod"),
            key: "remainDays",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "firstPayInterest",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "firstSettleAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.ce.discountApplyAcctNo"),
            key: "discFundsInAcctNo",
            hiddenCol: false
          },
        ],
        pickBillWin: false,
        pickBillParams: {},
        importWin:false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/discquote/broker/listing/discListingApplyMain/func_batchBillReq",  //excel数据导入接口
          uploadParams: {//调用excel数据解析接口时附带的额外参数
            batchId: "",
            batchBillType: "discListingBill"
          }
        },
        showFileWin: false,
        filePathUrl: "/be/discquote/broker/listing/discListingApplyMain/"
      };
    },
    props: {
      addOrEditListingWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempDiscListingApplyAddOrEditWin: {
        get() {
          return this.addOrEditListingWin;
        },
        set() {
        }
      }
    },
    watch: {
      addOrEditListingWin(val) {
        if (val) {
          this.dataGridUrl = "/be/discquote/broker/listing/discListingApplyMain/func_queryDiscListingBillPage";
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.batchId=this.batchId;
            if (this.batchParams.batchType === "add") {
              this.batchParams.isSpeedChange=true;
              this.queryObjById();
              this.handleSearch();
            }
            if (this.batchParams.batchType === "modify") {
              this.batchParams.isSpeedChange=false;
              this.queryObjById();
              this.handleSearch();
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/be/discquote/broker/listing/discListingApplyMain/func_editDiscListing";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.busiType = obj.busiType;
              this.addOrEditForm.busiNo = obj.busiNo;
              this.addOrEditForm.brokerBrchName = obj.brokerBrchName;
              this.addOrEditForm.brokerBrchCode = obj.brokerBrchCode;
              this.addOrEditForm.brokerBankNo = obj.brokerBankNo;
              this.addOrEditForm.brokerTraderName = obj.brokerTraderName;
              this.addOrEditForm.brokerTraderNo = obj.brokerTraderNo;
              this.addOrEditForm.discCustName = obj.discCustName;
              this.addOrEditForm.discOutSocCode = obj.discOutSocCode;
              this.addOrEditForm.discCorpScale = obj.discCorpScale;
              this.addOrEditForm.discIndustry = obj.discIndustry;
              this.addOrEditForm.isDiscArc = obj.isDiscArc;
              this.addOrEditForm.isDiscGreenCorp = obj.isDiscGreenCorp;
              this.addOrEditForm.isDiscTechnologyCorp = obj.isDiscTechnologyCorp;
              this.addOrEditForm.isDiscPrivateCorp = obj.isDiscPrivateCorp;
              this.addOrEditForm.area = obj.area;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.billClass = obj.billClass;
              this.addOrEditForm.isBargain = obj.isBargain;
              this.addOrEditForm.clearMode = obj.clearMode;
              this.addOrEditForm.clearSpeed = obj.clearSpeed;
              this.addOrEditForm.firstSettleDt = obj.firstSettleDt === null ? "" : obj.firstSettleDt.toString();
              this.addOrEditForm.ratePct = obj.ratePct;
              this.addOrEditForm.discOutBankNo = obj.discOutBankNo;
              this.addOrEditForm.respTm = obj.respTm;
              this.addOrEditForm.transCustType = obj.transCustType;
              this.addOrEditForm.transCustTypeName = obj.transCustTypeName;
              this.addOrEditForm.eliminateCpBrchType = obj.eliminateCpBrchType;
              this.addOrEditForm.eliminateCpBrchTypeName = obj.eliminateCpBrchTypeName;
              this.addOrEditForm.totalAmt = obj.totalAmt=== null ?"":obj.totalAmt.toString();
              this.addOrEditForm.totalNum = obj.totalNum;
              this.addOrEditForm.firstPayInterest = obj.firstPayInterest=== null ?"":obj.firstPayInterest.toString();
              this.addOrEditForm.firstSettleAmt = obj.firstSettleAmt=== null ?"":obj.firstSettleAmt.toString();
              this.addOrEditForm.remainDays = obj.remainDays;
              this.addOrEditForm.fileNum = obj.fileNum;
              this.addOrEditForm.listingRemark = obj.listingRemark;
              this.addOrEditForm.workDate = obj.workDate;
              this.addOrEditForm.minRate = obj.minRate;
              this.addOrEditForm.maxRate = obj.maxRate;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.batchId = "";
        this.dataGridFormItem.batchId="";
        this.dataGridUrl ="";
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("addOrEditListingWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //保存批次信息
      formSave() {
          this.saveBatch();
      },
      saveBatch(optType) {
        if (optType) {
          this.addOrEditForm.buttonName = optType;
        }
        this.saveBatchFunc(res=>{
          if (optType) {
            this.triggerClickEvent(optType);
            this.addOrEditForm.buttonName ="";
          }else{
            this.handleSearch();
            this.$msgTip.success(this);
          }
        });
      },
      saveBatchFunc(callback){
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let minRate=this.addOrEditForm.minRate?this.addOrEditForm.minRate:0;
            let maxRate=this.addOrEditForm.maxRate?this.addOrEditForm.maxRate:100;
            let minRateBoolean=this.addOrEditForm.ratePct-minRate<0;
            let maxRateBoolean=this.addOrEditForm.ratePct-maxRate>0;
            if(minRateBoolean){
              this.$msgTip.error(this, { info: "贴现利率必须大于等于票交所最小利率参数:"+minRate});
              return;
            }
            if(maxRateBoolean){
              this.$msgTip.error(this, { info: "贴现利率必须小于等于票交所最大利率参数:"+maxRate});
              return;
            }
            this.addOrEditForm.firstSettleDt = this.addOrEditForm.firstSettleDt.replace(/-/g, "");
            let url = "/be/discquote/broker/listing/discListingApplyMain/func_addDiscListingBatch";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.batchId = res.data.retData.id;
                  this.dataGridFormItem.batchId = res.data.retData.id;
                  this.addOrEditForm.id = res.data.retData.id;
                  this.queryObjById();
                  callback();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //按钮事件触发保存
      triggerClickEvent(optType) {
        if (optType === "pickBill") {//挑票
          this.pickBillCallBack();
        } else if (optType === "importPickBill") {//导入挑票
          this.importPickBillCallback();
        } else if (optType === "calcInterest") {//利息计算
          this.calcInterestCallback();
        } else if (optType === "commitApply") {//提交申请
          this.applySubmitCallback();
        }
      },
      //挑票
      pickBill() {
        this.saveBatch("pickBill");
      },
      pickBillCallBack() {
        if (this.batchId) {
          this.pickBillParams.dictMap = this.batchParams.dictMap;
          this.pickBillParams.billTypeList = this.batchParams.billTypeList;
          this.pickBillParams.billClassList = this.batchParams.billClassList;
          this.pickBillParams.batchId = this.batchId;
          this.pickBillParams.billType = this.addOrEditForm.billType;
          this.pickBillParams.billClass = this.addOrEditForm.billClass;
          this.pickBillParams.ratePct = this.addOrEditForm.ratePct;
          this.pickBillParams.firstSettleDt = this.addOrEditForm.firstSettleDt;
          this.pickBillParams.discOutBankNo = this.addOrEditForm.discOutBankNo;
          this.pickBillParams.discOutSocCode = this.addOrEditForm.discOutSocCode;
          this.pickBillParams.pickType = "discListingBill";
          this.pickBillParams.url = "/be/discquote/broker/listing/discListingApplyMain/func_addBill";
          this.pickBillParams.pickBillDatagridUrl="/be/discquote/broker/listing/discListingApplyMain/func_queryDiscEntrustBillPage";
          this.pickBillWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      pickBillWinClose() {
        this.pickBillParams = {};
        this.queryObjById();
        this.handleSearch();
        this.pickBillWin = false;
      },

      //导入挑票
      importPickBill() {
        this.saveBatch("importPickBill");
      },
      importPickBillCallback() {
        if (this.batchId) {
          this.fileParams.uploadParams.batchId = this.batchId;
          this.importWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      importSuccess() {
        this.queryObjById();
        this.fileParams.uploadParams.batchId = "";
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      importWinClose() {
        this.queryObjById();
        this.handleSearch();
        this.importWin = false;
      },
      //利息计算
      calcInterest(){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要计算利息吗") + "?",
          onOk: () => {
            this.saveBatch("calcInterest");
          }
        });
      },
      calcInterestCallback() {
        if (this.batchId) {
          let params = { id: this.batchId };
          let url = "/be/discquote/broker/listing/discListingApplyMain/func_calcDiscListingInterest";
          this.sendPost(params, url, res=>{
            this.queryObjById();
            this.handleSearch();
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //提交申请
      applySubmit() {
        this.saveBatch("commitApply");
      },
      applySubmitCallback() {
        if (this.batchId) {
          let params = { id: this.batchId };
          let url = "/be/discquote/broker/listing/discListingApplyMain/func_commitDiscListingApply";
          this.sendPost(params, url, res=>{
            this.handleClose();
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/broker/listing/discListingApplyMain/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        let input = document.createElement('input')
        input.type = 'text'
        input.name = 'modelType';
        input.value = "discListingBill";
        form.appendChild(input)
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      // 删除票据
      deleteBill() {
        if (this.batchId) {
          let list = this.$refs.datagrid.selectIds;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要删除票据吗?",
            onOk: () => {
              let params = { batchId: this.batchId, ids: list };
              let url = "/be/discquote/broker/listing/discListingApplyMain/func_deleteDiscListingBill";
              this.sendPost(params, url, res=>{
                this.queryObjById();
                this.handleSearch();
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData.erroMsg){
                this.$msgTip.error(this, { info: res.data.retData.erroMsg });
              }else{
                this.$msgTip.success(this);
              }
              callback();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showAttach() {
        if (this.batchId) {
          this.showFileWin = true;
        }else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      showFileWinClose() {
        this.queryObjById();
        this.handleSearch();
        this.showFileWin = false;
      },
    }
  };
</script>

<style scoped>

</style>
