<!-- 减值管理-减值数据管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"

                             title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
                </show-branch>
                <common-select v-model="formItem.prodNo" prop="prodNo" :dictList="prodNoList"
                               :label="$t('m.i.common.prodName')"></common-select>
                <common-date-picker v-model="operDt" :label="$t('m.i.bm.valuateOperDt')"
                                    type="daterange" :rangeValue="['minOperDt','maxOperDt']"
                                    :minOperDt.sync="formItem.minOperDt" :maxOperDt.sync="formItem.maxOperDt">
                </common-date-picker>
                <is-commit-radio v-model="formItem.isSubmit" @on-click="isCommitButton"></is-commit-radio>
                <query-btn @showChange="ifShowMore =! ifShowMore" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/bm/valuate/deductValuate/func_queryDeductValuateHis"
                      :bindForm="formItem"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="deductValuateEdit('add')" :disabled="hasCommit">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="deductValuateEdit('modify')" :disabled="hasCommit">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="deductValuateDelete" :disabled="hasCommit">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="submitRecheck" :disabled="hasCommit">{{$t("m.i.common.submitCheck")}}</h-button>
              <h-button type="primary" @click="rollback" :disabled="noCommit">{{$t('m.i.common.revocation')}}</h-button>
              <h-button type="primary" @click="templateDownload" :disabled="hasCommit">{{$t("m.i.common.templateDownload")}}</h-button>
              <h-button type="primary" @click="templateImport"  :disabled="hasCommit">{{$t("m.i.common.import")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 新增/修改减值数据 -->
    <h-msg-box v-model="addOrEditWin" width="800" @on-close="addOrEditWinClose" class="h-form-search-layer">
      <p slot="header">
        <span v-if="addOrEditType==='add'">新增减值数据</span>
        <span v-if="addOrEditType==='modify'">修改减值数据</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <show-branch v-model="addOrEditForm.brchNo" prop="brchNo" :label="$t('m.i.common.brchNo')"
                       :brchNo.sync="addOrEditForm.brchNo" :brchName.sync="addOrEditForm.brchName"
                       :msgBoxWin="addOrEditWin" showValue :showCheckBox="false" required></show-branch>
          <common-input v-model="addOrEditForm.brchName" :label="$t('m.i.common.brchName')" prop="brchName"
                        readonly required></common-input>
          <common-select v-model="addOrEditForm.prodNo" prop="prodNo" :dictList="prodNoList"
                         :label="$t('m.i.common.prodName')" required>
          </common-select>
          <common-type-field v-model="addOrEditForm.currentDeductBalanceAmt"
                             :label="$t('m.i.bm.currentDeductBalanceAmt')" prop="currentDeductBalanceAmt"
                             required></common-type-field>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="addOrEditWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>

    <!--文件批量导入-->
    <common-file-upload-no-show :import-win="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importError="importError" @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>

<script>
  import {post, formatNumber, templateDownload, formatTime} from "@/api/bizApi/commonUtil";

  export default {
    name: "deductValuateManage",
    data() {
      return {
        ifShowMore: false,
        noCommit:true,
        hasCommit:false,
        formItem: {
          brchNos:"",
          brchNo: "",
          branchName: "",
          prodNo: "",
          minOperDt: "",
          maxOperDt: "",
          isSubmit: "0"
        },
        operDt: [],
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
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
            title: this.$t("m.i.common.brchNo"),
            key: "brchNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DeductProduct", params.row.prodNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.bm.currentDeductBalanceAmt"),
            key: "currentDeductBalanceAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.currentDeductBalanceAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.previousDeductDiffAmt"),
            key: "previousDeductDiffAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.previousDeductDiffAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.valuateOperTm"),
            key: "operDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let operDt = params.row.operDt ? this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              let operTm = formatTime(this, params.row.operTm);
              return h("span", operDt + " " + operTm);
            }
          },
          {
            title: this.$t("m.i.bm.valuateCreateTellerName"),
            key: "createTellerName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "operStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DeductOperStatus", params.row.operStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        addOrEditWin: false,
        addOrEditType: "",
        addOrEditForm: {
          brchNo: "",
          brchName: "",
          prodNo: "",
          currentDeductBalanceAmt: ""
        },
        dictMap: new Map(),
        prodNoList: [],
        importWin: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/bm/valuate/deductValuate/func_importDeductValuateHis",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},
        },
      }
    },
    methods: {
      isCommitButton(isCommit, val) {

        this.formItem.isSubmit = val;
        console.log(this.formItem.isSubmit)
        if(this.formItem.isSubmit=="0"){
          this.noCommit = true;
          this.hasCommit = false;
        }else if (this.formItem.isSubmit=="1") {
          this.hasCommit = true;
          this.noCommit = false;
        }
        this.handleSearch();
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(pageNo ? pageNo : 1);
      },
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minOperDt = "";
        this.formItem.maxOperDt = "";
        this.operDt = [];
      },
      deductValuateEdit(optType) {
        this.addOrEditType = optType;
        if (this.addOrEditType === "modify") {
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
            return;
          }
          if (this.$refs.datagrid.selects.length > 1) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
            return;
          }
          post({id: this.$refs.datagrid.selectIds}, "/bm/valuate/deductValuate/func_selectDeductValuateHistById").then(res => {
            if (res) {
              if (res.data.retCode === "000000") {
                this.addOrEditWin = true;
                this.$nextTick(() => {
                  this.addOrEditForm.id = res.data.retData.id;
                  this.addOrEditForm.brchNo = res.data.retData.brchNo;
                  this.addOrEditForm.brchName = res.data.retData.brchName;
                  this.addOrEditForm.prodNo = res.data.retData.prodNo;
                  this.addOrEditForm.currentDeductBalanceAmt = formatNumber(res.data.retData.currentDeductBalanceAmt, 2, ",");
                });
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else if (this.addOrEditType === "add") {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
      },
      addFormReset() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
      },
      deductValuateDelete() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        post({ids: this.$refs.datagrid.selectIds}, "/bm/valuate/deductValuate/func_delectDeductValuateHis").then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      submitRecheck() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交复核吗？",
          onOk: () => {
            this.handleRecheck();
          }
        });
      },
      handleRecheck() {
        post({ids: this.$refs.datagrid.selectIds}, "/bm/valuate/deductValuate/func_submitDeductValuateHist").then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      rollback() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤回待复核数据吗？",
          onOk: () => {
            this.handleRollback();
          }
        });
      },
      handleRollback() {
        post({ids: this.$refs.datagrid.selectIds}, "/bm/valuate/deductValuate/func_rollBackDeductValuateHist").then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      templateDownload() {
        templateDownload(window.LOCAL_CONFIG.API_HOME + "/bm/valuate/deductValuate/func_download")
      },
      templateImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      importError(){
        this.$refs.datagrid.dataChange(1);
      },
      addOrEditWinClose() {
        this.addOrEditWin = false;
        this.addFormReset();
      },
      addOrEditWinSubmit() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.addOrEditType === "add" ? "/bm/valuate/deductValuate/func_addDeductValuateHis" : "/bm/valuate/deductValuate/func_updateDeductValuateHis";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWinClose();
                  this.handleSearch(this.addOrEditType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo);
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      }
    },

    mounted() {
      console.log(this.formItem.isSubmit)
      this.getDictListByGroups("DeductProduct,DeductOperStatus").then(res => {
        this.prodNoList = res.get("DeductProduct");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
