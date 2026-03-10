<template>
  <div>
    <h-msg-box v-model="tempEditDiscEntrustRelWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增申请单</span>
        <span v-else-if="batchParams.batchType==='modify'">修改申请单</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search" onlyBlurRequire>
          <entrust-form-item :addForm="addOrEditForm" :batchParams="batchParams"></entrust-form-item>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()">{{$t('m.i.common.save')}}</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
            :columns="columns"
            highlight-row
            :auto-load="false"
            url="/be/discquote/entrust/discEntrustRelApplyMain/func_queryDiscEntrustRelBillPage"
            :bindForm="dataGridFormItem"
            :has-select="false"
            :rowSelect="true"
            ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="pickBill()">{{$t("m.i.common.pickBill")}}</h-button>
            <h-button type="primary" @click="importPickBill()">{{$t("m.i.common.exportPickBill")}}</h-button>
            <h-button type="primary" @click="deleteBill()">{{$t("m.i.common.billDelete")}}</h-button>
            <h-button type="primary" @click="importTemplate()">{{$t("m.i.common.templateDownload")}}</h-button>
            <h-button type="primary" @click="applySubmit()">{{$t("m.i.be.applyBatch")}}</h-button>
            <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
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

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, getDictValueFromMap,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "editDiscEntrustRel",
    components: {
      EntrustFormItem: () => import(/* webpackChunkName: "be/discquote/entrust/entrustFormItem"*/"@/views/bizViews/be/discquote/entrust/entrustFormItem"),
      EntrustPickBill: () => import(/* webpackChunkName: "be/discquote/entrust/entrustPickBill"*/"@/views/bizViews/be/discquote/entrust/entrustPickBill"),
    },
    data() {
      return {
        addOrEditForm: {
          id: "",
          discBrchName: "",
          discBrchCode: "",
          discCustName: "",
          discSocCode:"",
          totalNum: "",
          buttonName:"",
          batchNo:""
        },
        dataGridFormItem: {
          batchId: ""
        },
        columns:[
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
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
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.batchParams.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt){
                let dt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dt);
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt){
                let dt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dt);
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.be.entrustDate"),
            key: "entrustDt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.entrustDt){
                let dt = this.$moment(params.row.entrustDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dt);
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.be.entrustMaxRate"),
            key: "entrustMaxRatePct",
            hiddenCol: false,
            sortMethod:(a,b,type)=>{
              if (type==="asc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1-a2;
              }else if (type==="desc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2-a1;
              }
            }
          },
          {
            title: this.$t("m.i.be.entrustEndDate"),
            key: "entrustEndDt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.entrustEndDt){
                let dt = this.$moment(params.row.entrustEndDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dt);
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.ce.discountApplyAcctNo"),
            key: "discOutAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discOutBankNo"),
            key: "discOutBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discOutBankName"),
            key: "discOutBankName",
            hiddenCol: false
          },
        ],
        batchId: "",
        pickBillWin: false,
        pickBillParams: {},
        importWin: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/discquote/entrust/discEntrustRelApplyMain/func_batchBillReq",  //excel数据导入接口
          uploadParams: {//调用excel数据解析接口时附带的额外参数
            batchId: "",
            batchBillType: "discEntrustRelBill"
          }
        },
        tempShowExcelTemplateWin: false,
        param: "",
        rows: ""
      }
    },
    props: {
      editDiscEntrustRelWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    computed: {
      tempEditDiscEntrustRelWin: {
        get() {
          return this.editDiscEntrustRelWin;
        },
        set() {
        }
      }
    },
    watch: {
      editDiscEntrustRelWin(val) {
        if (val) {
          this.batchId = this.batchParams.batchId;
          this.dataGridFormItem.batchId = this.batchParams.batchId;
          // this.isCurChange = false;
          this.queryObjById();
          this.$nextTick(()=>{
            this.handleSearch();
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
      handleClose(){
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.dataGridFormItem.batchId ="";
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("editDiscEntrustRelWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      queryObjById() {
        let params = { batchId: this.batchId };
        let url = "/be/discquote/entrust/discEntrustRelApplyMain/func_editDiscEntrustRel";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addOrEditForm = res.data.retData;
            }
          }
        });
      },
      //保存批次信息
      formSave() {
        this.saveBatch();
      },
      saveBatch(optType){
        if (optType) {
          this.addOrEditForm.buttonName = optType;
        }
        this.saveBatchFunc(res => {
          if (optType) {
            this.triggerClickEvent(optType);
            this.addOrEditForm.buttonName ="";
          }else{
            this.handleSearch();
            this.$msgTip.success(this);
          }
        })
      },
      saveBatchFunc(callback){
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = "/be/discquote/entrust/discEntrustRelApplyMain/func_addDiscEntrustRelBatch";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.batchId = res.data.retData.id;
                  this.addOrEditForm.id = res.data.retData.id;
                  this.dataGridFormItem.batchId = res.data.retData.id;
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
        } else if (optType === "commitApply") {//提交申请
          this.applySubmitCallback();
        }
      },
      pickBill(){
        this.saveBatch("pickBill");
      },
      pickBillCallBack() {
        if (this.batchId) {
          this.pickBillParams.dictMap = this.batchParams.dictMap;
          this.pickBillParams.billTypeList = this.batchParams.billTypeList;
          this.pickBillParams.billClassList = this.batchParams.billClassList;
          this.pickBillParams.batchId = this.batchId;
          this.pickBillParams.brokerBrchCode = this.addOrEditForm.brokerBrchCode;
          this.pickBillParams.discOutSocCode = this.addOrEditForm.discSocCode;
          this.pickBillParams.pickType = "discEntrustRelBill";
          this.pickBillParams.url = "/be/discquote/entrust/discEntrustRelApplyMain/func_addBill";
          this.pickBillParams.pickBillDatagridUrl="/be/discquote/entrust/discEntrustRelApplyMain/func_queryDiscEntrustBillPage";
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
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/entrust/discEntrustRelApplyMain/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        let input = document.createElement('input')
        input.type = 'text'
        input.name = 'modelType';
        input.value = "discEntrustRelBill";
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
              let url = "/be/discquote/entrust/discEntrustRelApplyMain/func_deleteDiscEntrustRelBill";
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
      //提交申请
      applySubmit() {
        this.saveBatch("commitApply");
      },
      applySubmitCallback() {
        if (this.batchId) {
          let params = {id: this.batchId};
          let url = "/be/discquote/entrust/discEntrustRelApplyMain/func_commitDiscEntrustRelApply";
          this.sendPost(params, url, res=>{
            this.$msgTip.success(this);
            this.handleClose();
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
      listExport() {
        if (this.batchId) {
          this.param = "discEntrustRelBillExport";
          if (this.$refs.datagrid.selectIds.length != 0) {
            this.rows = this.$refs.datagrid.selectIds.length;
          } else {
            this.rows = this.$refs.datagrid.total;
          }
          this.tempShowExcelTemplateWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + this.batchParams.exportUrl;
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            batchId: this.batchId,
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = {
            batchId: this.batchId
          };
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },
    }
  };
</script>

<style scoped>

</style>
