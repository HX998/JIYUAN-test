<!--创设业务-设立管理-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempStdPurchaseCaseBatchAddOrEditWin" :maximize="true" :mask-closable="false"
               @on-close="handleClose"
               width="1000" class="h-form-search-layer">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">认购函新增</span>
        <span v-else-if="batchParams.batchType==='modify'">认购函修改</span>
        <span v-else-if="batchParams.batchType==='show'">认购函查看</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <std-purchase-case-batch-form-item :addForm="addOrEditForm"
                                             :batchParams="batchParams"></std-purchase-case-batch-form-item>
        </h-form>
        <div>
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
          ref="datagridAdd">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="formSave()">{{$t('m.i.common.save')}}</h-button>
            <h-button type="primary" @click="purchasePriceEdit('add')">{{$t('m.i.bs.purchasePriceAdd')}}</h-button>
            <h-button type="primary" @click="purchasePriceEdit('modify')">{{$t('m.i.bs.purchasePriceEdit')}}</h-button>
            <h-button type="primary" @click="purchasePriceDelete()">{{$t('m.i.bs.purchasePriceDelete')}}</h-button>
            <h-button type="primary" @click="applySubmit()">{{$t('m.i.common.submit')}}</h-button>
            <h-button type="primary" @click="download()">{{$t('m.i.common.templateDownload')}}</h-button>
            <h-button type="primary" @click="importList()">{{$t('m.i.common.importList')}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 新增修改弹窗 -->
    <std-purchase-case-detail-add :stdPurchaseCaseDetailAddOrEditWin="stdPurchaseCaseDetailAddOrEditWin"
                                  :detailParams="detailParams"
                                  :dictMap="dictMap"
                                  @stdPurchaseCaseDetailAddOrEditWinClose="stdPurchaseCaseDetailAddOrEditWinClose"
                                  ref="stdPurchaseCaseDetailAdd"></std-purchase-case-detail-add>
    <!-- 批量导入 -->
    <common-file-upload-no-show :import-win="uploadWin" :fileParams="fileParams" @importWinClose="uploadWinClose"
                                @importSuccess="uploadWinClose"></common-file-upload-no-show>
  </div>
</template>

<script>
  import {post, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdPurchaseCaseBatchAdd",
    components: {
      StdPurchaseCaseBatchFormItem: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdPurchaseCaseBatchFormItem" */"@/views/bizViews/bs/corpstdbill/underwrite/stdPurchaseCaseBatchFormItem"),
      StdPurchaseCaseDetailAdd: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdPurchaseCaseDetailAdd" */"@/views/bizViews/bs/corpstdbill/underwrite/stdPurchaseCaseDetailAdd")
    },
    data() {
      return {
        batchId: "",
        addOrEditForm: {
          id: "",
          legalNo: "",
          memberId: "",
          bkId: "",
          batchStatus: "",
          stdProductName: "",
          stdProductShortName: "",
          stdProductNo: "",
          investBrchName: "",
          investLegalPerson: "",
          investLicenseNo: "",
          investAgentName: "",
          investEmail: "",
          investPhone: "",
          investFax: "",
          investTrustAcctName: "",
          investTrustAcctNo: "",
          investPayAmt: "",
          investPlacingAmt: ""
        },
        dataGridUrl: "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_queryStdPurchaseCaseDetailPage",
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
            title: this.$t("m.i.bs.purchasePrice"),
            key: "purchasePrice",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.purchasePrice, 4, ","));
            }
          },
          {
            title: this.$t("m.i.bs.purchaseAmt"),
            key: "purchaseAmt",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.purchaseAmt, 2, ","));
            }
          },
        ],
        detailType: "",
        stdPurchaseCaseDetailAddOrEditWin: false,
        detailParams: {},
        uploadWin: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_batchAddStdPurchaseCaseDetail",  //excel数据导入接口
          uploadParams: {}       //调用excel数据解析接口时附带的额外参数
        },
      };
    },
    props: {
      stdPurchaseCaseBatchAddOrEditWin: {
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
      },
      dictMap: {
        type: Map,
        required: true
      },
    },
    computed: {
      tempStdPurchaseCaseBatchAddOrEditWin: {
        get() {
          return this.stdPurchaseCaseBatchAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdPurchaseCaseBatchAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.addOrEditForm.resetFields();
            this.addOrEditForm.stdProductName="";
            this.addOrEditForm.stdProductShortName= "";
            this.addOrEditForm.stdProductNo="";
            this.addOrEditForm.investBrchName="";
            this.addOrEditForm.bkId="";
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.batchId = this.batchParams.batchId;
            this.$refs.datagridAdd.tData=[];
            if (this.batchParams.batchType === "add") {
              this.queryObjById();
            }
            if (this.batchParams.batchType === "modify" || this.batchParams.batchType === "show") {
              this.queryObjById();
              if (this.dataGridFormItem.batchId) {
                this.handleSearch();
              }
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      //根据批次Id查询信息
      queryObjById() {
        let params = {id: this.batchId};
        let url = "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_findStdPurchaseCaseBatchById";
        post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                this.addOrEditForm.id = obj.id;
                if (obj.id) {
                  this.dataGridFormItem.batchId = obj.id;
                }
                this.addOrEditForm.legalNo = obj.legalNo;
                this.addOrEditForm.memberId = obj.memberId;
                this.addOrEditForm.bkId = obj.bkId;
                this.addOrEditForm.batchStatus = obj.batchStatus;
                if (obj.stdProductName) {
                  this.addOrEditForm.stdProductName = obj.stdProductName;
                }
                if (obj.stdProductShortName) {
                  this.addOrEditForm.stdProductShortName = obj.stdProductShortName;
                }
                if (obj.stdProductNo) {
                  this.addOrEditForm.stdProductNo = obj.stdProductNo;
                }
                if (obj.investBrchName) {
                  this.addOrEditForm.investBrchName = obj.investBrchName;
                }
                if (obj.investLegalPerson) {
                  this.addOrEditForm.investLegalPerson = obj.investLegalPerson;
                }
                if (obj.investLicenseNo) {
                  this.addOrEditForm.investLicenseNo = obj.investLicenseNo;
                }
                if (obj.investAgentName) {
                  this.addOrEditForm.investAgentName = obj.investAgentName;
                }
                if (obj.investEmail) {
                  this.addOrEditForm.investEmail = obj.investEmail;
                }
                if (obj.investPhone) {
                  this.addOrEditForm.investPhone = obj.investPhone;
                }
                if (obj.investFax) {
                  this.addOrEditForm.investFax = obj.investFax;
                }
                if (obj.investTrustAcctName) {
                  this.addOrEditForm.investTrustAcctName = obj.investTrustAcctName;
                }
                if (obj.investTrustAcctNo) {
                  this.addOrEditForm.investTrustAcctNo = obj.investTrustAcctNo;
                }
                this.addOrEditForm.investPayAmt = obj.investPayAmt === null ? "" : obj.investPayAmt;
                this.addOrEditForm.investPlacingAmt = obj.investPlacingAmt === null ? "" : obj.investPlacingAmt;
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          }
        );
      },
      handleSearch(pageNo) {
        if (this.dataGridFormItem.batchId) {
          this.$refs.datagridAdd.selects = [];
          this.$refs.datagridAdd.selectIds = [];
          this.$refs.datagridAdd.dataChange(!!pageNo ? pageNo : 1);
        }
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.addOrEditForm.bkId="";
        this.dataGridFormItem.batchId = "";
        this.batchId = "";
        this.$refs.datagridAdd.selects = [];
        this.$refs.datagridAdd.selectIds = [];
        this.$emit("stdPurchaseCaseBatchAddOrEditWinClose", "");
      },

      //保存信息
      formSave() {
        this.saveBatch();
      },
      saveBatch(optType) {
        if (optType) {
          this.addOrEditForm.buttonName = optType;
        }
        this.saveBatchFunc(res => {
          if (optType) {
            this.triggerClickEvent(optType);
            this.addOrEditForm.buttonName = "";
          } else {
            this.handleSearch();
            this.$msgTip.success(this);
          }
        });
      },
      saveBatchFunc(callback) {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_editStdPurchaseCaseBatch";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let retData = res.data.retData;
                if (retCode === "000000") {
                  this.batchId = retData.id;
                  this.dataGridFormItem.batchId = retData.id;
                  this.queryObjById();
                  callback();
                } else {
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      //按钮事件触发保存
      triggerClickEvent(optType) {
        if (optType === "commitApply") {//提交申请
          this.applySubmitCallback();
        } else if (optType === "addOrEditPrice") {
          this.purchasePriceEditCallback();
        } else if (optType === "importList") {
          this.importListCallback();
        }
      },
      // 认购价格新增或修改
      purchasePriceEdit(str) {
        if (str === "modify") {
          let list = this.$refs.datagridAdd.selectIds;
          if (list.length === 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            return;
          } else if (list.length > 1) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
            return;
          }
        }
        this.detailType = str;
        this.saveBatch("addOrEditPrice");
      },
      purchasePriceEditCallback() {
        if (this.detailType === "modify") {
          let list = this.$refs.datagridAdd.selectIds;
          if (list.length === 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            return;
          } else if (list.length > 1) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
            return;
          }
          this.detailParams.id = list[0];
        } else {
          this.detailParams.id = "";
        }
        this.assembleParams(this.detailType);
      },
      assembleParams(optType) {
        this.detailParams.batchType = optType;
        this.detailParams.dictMap = this.dictMap;
        this.detailParams.batchId = this.batchId;
        this.stdPurchaseCaseDetailAddOrEditWin = true;
      },
      stdPurchaseCaseDetailAddOrEditWinClose() {
        let pageNo = this.detailParams.batchType === "add" ? 1 : this.$refs.datagridAdd.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.queryObjById();
        this.detailParams = {};
        this.stdPurchaseCaseDetailAddOrEditWin = false;
        this.detailType = "";
      },
      // 删除认购价格
      purchasePriceDelete() {
        let list = this.$refs.datagridAdd.selectIds;
        if (list.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        this.$hMsgBox.confirm({
          title: "删除信息",
          content: "确定要删除吗？",
          onOk: () => {
            let params = {batchId: this.batchId, ids: list};
            let url = "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_deleteStdPurchaseCaseDetail";
            this.sendPost(params, url, res => {
              this.handleSearch(this.$refs.datagridAdd.pageInfo.pageNo);
              this.queryObjById();
            });
          }
        });
      },
      //申请提交
      applySubmit() {
        this.saveBatch("commitApply");
      },
      applySubmitCallback() {
        if (this.batchId) {
          let params = {id: this.batchId};
          let url = "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_commitStdPurchaseCaseBatch";
          this.sendPost(params, url, res => {
            this.handleClose();
          });
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      // 模板下载
      download() {
        // if (this.batchId) {
          let url = window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_downloadStdPurchaseCaseDetail";
          let form = document.createElement('form');
          form.setAttribute("id", "formId");
          form.setAttribute('action', url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        // } else {
        //   this.$msgTip.error(this, {info: "请先保存批次"});
        // }
      },
      // 清单导入
      importList() {
        this.saveBatch("importList");
      },
      importListCallback() {
        if (this.batchId) {
          this.uploadWin = true;
          this.fileParams.uploadParams.batchId=this.batchId;
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      // 关闭上传
      uploadWinClose() {
        this.uploadWin = false;
        this.fileParams.uploadParams={};
        this.queryObjById();
        this.handleSearch();
      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData.erroMsg) {
                this.$msgTip.error(this, {info: res.data.retData.erroMsg});
              } else {
                this.$msgTip.success(this);
                callback();
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
