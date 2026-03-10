<!--点击成交-授信关系管理-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempCreditManageAddOrEditWin" :maximize="true" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增授信关系</span>
        <span v-else-if="batchParams.batchType==='modify'">修改授信关系</span>
        <span v-else-if="batchParams.batchType==='show'">查看授信关系</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <common-input v-model="addOrEditForm.memberId" :label="$t('m.i.common.memberId')" prop="memberId"
                          :maxlength="6" :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.memberName" :label="$t('m.i.common.memberName')" prop="memberName"
                          :maxlength="60" :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.headBrchCode" :label="$t('m.i.common.headCpesBrchCode')"
                          prop="headBrchCode" :maxlength="9" :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.headBrchName" :label="$t('m.i.common.headCpesBrchName')"
                          prop="headBrchName" :readonly="true"></common-input>
            <trans-brch-type v-model="addOrEditForm.transBrchTypesName" @on-click="transBrchTypesWinOpen"
                             :clearVal="clearVal" :required="true"
                             :showIcon="batchParams.batchType!=='show'"></trans-brch-type>
            <common-select v-model="addOrEditForm.validFlag" :dictList="batchParams.isList" :readonly="true"
                           :label="$t('m.i.common.validFlag')" prop="validFlag"
                           v-if="batchParams.batchType==='show'"></common-select>
            <common-select v-model="addOrEditForm.preValidFlag" :dictList="batchParams.isList"
                           :label="$t('m.i.common.operateFlag')" prop="preValidFlag"
                           :readonly="batchParams.batchType==='show' || addOrEditForm.status != 'CT_2'"></common-select>
            <common-select v-model="addOrEditForm.creditRelationModel" :dictList="batchParams.creditRelationModelList"
                           :label="$t('m.i.be.creditRelationModel')" prop="creditRelationModel" :required="true"
                           :readonly="batchParams.batchType !== 'add'" :clearable="false"></common-select>
          </div>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()" v-if="batchParams.batchType!=='show'">保存</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          :url="dataGridUrl"
          :bindForm="formItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="infoAdd()" :disabled="!this.hadBatchSave || this.addOrEditForm.preValidFlag === '0'"
                      v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.add")}}
            </h-button>
            <h-button type="primary" @click="importTemplate" :disabled="!this.hadBatchSave || this.addOrEditForm.preValidFlag === '0'"
                      v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.templateDownload")}}
            </h-button>
            <h-button type="primary" @click="infoImport" :disabled="!this.hadBatchSave || this.addOrEditForm.preValidFlag === '0'"
                      v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.batchImport")}}
            </h-button>
            <h-button type="primary" @click="infoDelete" :disabled="!this.hadBatchSave || this.addOrEditForm.preValidFlag === '0'"
                      v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.delete")}}
            </h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <show-cpes-brch :brchCodeWin="showCpesBranchWin" @brchCodeWinClose="brchCodeWinClose"
                    @brchCodeChange="brchCodeChange" :cpesBrchParams="cpesBrchParams"></show-cpes-brch>
    <!-- 批量导入 -->
    <common-file-upload-no-show :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditManageAdd",
    components: {
      ShowCpesBrch: () => import(/* webpackChunkName: "be/market/common/showCpesBrch"*/"@/views/bizViews/be/market/common/showCpesBrch")
    },
    data() {
      return {
        dataGridUrl: "",
        batchId: "",
        addOrEditForm: {
          id: "",
          memberId: "",
          memberName: "",
          headBrchCode: "",
          headBrchName: "",
          transBrchTypes: "",
          transBrchTypesName: "",
          preValidFlag: "1",
          creditRelationModel: "1",
          validFlag: ""
        },
        formItem: {
          batchId: ""
        },
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.status"),
            key: "operFlag",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CreditOperStatus", params.row.operFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "transMemberId",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "transMemberName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "transBrchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "transBrchName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.transBrchClassNo"),
            key: "transBrchClass",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.transBrchClassName"),
            key: "transBrchClassName",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.batchParams.dictMap, "BrchClass", params.row.transBrchClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        //记录批次是否已保存
        hadBatchSave: false,
        showCpesBranchWin: false,
        cpesBrchParams: {
          batchId: "",
          transBrchTypes: ""
        },
        importWin: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/market/clickdeal/credit/creditManage/func_importCreditTradeMember",  //excel数据导入接口
          uploadParams: {//调用excel数据解析接口时附带的额外参数
            batchId: ""
          }
        }
      };
    },
    props: {
      creditManageAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          creditRelationModelList: [],
          isList: [],
          creditId: "",
          batchType: ""
        }
      }
    },
    computed: {
      tempCreditManageAddOrEditWin: {
        get() {
          return this.creditManageAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      creditManageAddOrEditWin(val) {
        if (val) {
          this.dataGridUrl = this.batchParams.batchType === "show" ? "/be/market/clickdeal/credit/creditSearch/func_searchCreditTradeMemberPage" : "/be/market/clickdeal/credit/creditManage/func_searchCreditTradeMemberPage";
          this.$nextTick(() => {
            this.batchId = this.batchParams.creditId;
            this.formItem.batchId = this.batchId;
            if (this.batchParams.batchType === "add") {
              this.hadBatchSave = false;
              this.$refs.datagrid.tData = [];
              this.queryMember();
            }
            if (this.batchParams.batchType === "modify" || this.batchParams.batchType === "show") {
              this.queryObjById();
              this.handleSearch();
            }
            this.selectionHiddenCol();
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      selectionHiddenCol(){
        const columns = this.columns;
        let selection=null;
        for (let column of columns) {
          if (column.key === 'multiSelect') {
            selection = column;
            break;
          }
        }
        if (selection != null) {
          selection.hiddenCol = this.batchParams.batchType === "show" ? true : false;
        }
      },
      transBrchTypesWinOpen() {
        this.$parent.transBrchTypesWinOpen("add");
      },
      clearVal() {
        this.addOrEditForm.transBrchTypes = "";
        this.addOrEditForm.transBrchTypesName = "";
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //新增时查询会员信息
      queryMember() {
        post({}, "/be/market/clickdeal/credit/creditManage/func_findClickCreditTradeAddData").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.memberId = obj.memberId;
              this.addOrEditForm.memberName = obj.memberName;
              this.addOrEditForm.headBrchCode = obj.headBrchCode;
              this.addOrEditForm.headBrchName = obj.headBrchName;
              this.addOrEditForm.preValidFlag = obj.preValidFlag;
              this.addOrEditForm.validFlag = obj.validFlag;
              this.addOrEditForm.creditRelationModel = obj.creditRelationModel;
              this.addOrEditForm.status = obj.status;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //修改时根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = this.batchParams.batchType === "show" ? "/be/market/clickdeal/credit/creditSearch/func_queryCreditTradeBatchById" : "/be/market/clickdeal/credit/creditManage/func_queryCreditTradeBatchById";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.memberId = obj.memberId;
              this.addOrEditForm.memberName = obj.memberName;
              this.addOrEditForm.headBrchCode = obj.headBrchCode;
              this.addOrEditForm.headBrchName = obj.headBrchName;
              this.addOrEditForm.transBrchTypes = obj.transBrchTypes;
              this.formatTransBrchTypes();

              this.addOrEditForm.creditRelationModel = obj.creditRelationModel;
              this.addOrEditForm.status = obj.status;
              this.addOrEditForm.validFlag = obj.validFlag;
              this.hadBatchSave = this.addOrEditForm.validFlag === "1" || this.addOrEditForm.status === "CT_0";

              if(obj.validFlag === "0"){
                this.addOrEditForm.preValidFlag = "1";
              }else{
                this.addOrEditForm.preValidFlag = obj.preValidFlag;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formatTransBrchTypes() {
        let keyList = this.addOrEditForm.transBrchTypes === "" ? [] : this.addOrEditForm.transBrchTypes.split(",");
        let valueList = [];
        for (let i = 0; i < keyList.length; i++) {
          valueList.push(this.getDictValueFromMap(this.batchParams.dictMap, "BrchClass", keyList[i]));
        }
        this.addOrEditForm.transBrchTypesName = valueList.join(",");
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.transBrchTypes = "";
        this.addOrEditForm.id = "";
        this.hadBatchSave = false;
        this.$emit("creditManageAddOrEditWinClose", "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //保存批次信息
      formSave() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.batchParams.batchType === "add" ? "/be/market/clickdeal/credit/creditManage/func_addCreditTradeBatch" : "/be/market/clickdeal/credit/creditManage/func_updateCreditTradeBatch";
            if (this.hadBatchSave) {
              url = "/be/market/clickdeal/credit/creditManage/func_updateCreditTradeBatch";
            }
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.batchParams.batchType === "add" && this.hadBatchSave === false) {
                    this.batchId = res.data.retData.id;
                    this.formItem.batchId = res.data.retData.id;
                    this.addOrEditForm.id = res.data.retData.id;
                  }
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.hadBatchSave = true;
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
      //新增、修改
      infoAdd() {
        this.cpesBrchParams.batchId = this.batchId;
        this.cpesBrchParams.transBrchTypes = this.addOrEditForm.transBrchTypes;
        this.showCpesBranchWin = true;
      },
      brchCodeWinClose() {
        this.cpesBrchParams.batchId = "";
        this.cpesBrchParams.transBrchTypes = "";
        this.showCpesBranchWin = false;
      },
      brchCodeChange(info) {
        this.showCpesBranchWin = false;
        let params = { batchId: this.batchId, creditTradeMemberDtos: info };
        post(params, "/be/market/clickdeal/credit/creditManage/func_addCreditTradeMember").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //批量导入
      infoImport() {
        this.fileParams.uploadParams.batchId = this.batchId;
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/clickdeal/credit/creditManage/func_downloadImportInfo";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //删除
      infoDelete() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDeleteDetail();
          }
        });
      },
      handleDeleteDetail() {
        let list = this.$refs.datagrid.selects;
        let creditIds = [];
        for (let i = 0; i < list.length; i++) {
          creditIds.push(list[i].id);
        }
        post({
          batchId: this.batchId,
          ids: creditIds.join(",")
        }, "/be/market/clickdeal/credit/creditManage/func_deleteCreditTradeMember").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
