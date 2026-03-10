<template>
  <div>
    <div>
      <h-form :model="deductCoeffTabFormItem" :label-width="115" ref="deductCoeffTabFormItem" cols="3"
              class="h-form-search">
        <div>
          <h-form :model="deductCoeffTabFormItem" :label-width="90" ref="deductCoeffTabFormItem" cols="4"
                  class="h-form-search">
            <common-select v-model="deductCoeffTabFormItem.creditMainBrchClass" :dictList="creditMajorList"
                           :label="$t('m.i.billInfo.creditMainBankType')" prop="creditMainBrchClass"></common-select>
            <query-btn :advanceShow="false" formClassAdd="1" :formSearch="handleSearch"
                       :formSearchReset="resetSearch"></query-btn>
          </h-form>
        </div>
      </h-form>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        highlight-row
        :auto-load="false"
        :url="dataGridUrl"
        :bindForm="deductCoeffTabFormItem"
        :has-select="false"
        :rowSelect="true"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="infoAdd('add')" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.add")}}
          </h-button>
          <h-button type="primary" @click="infoAdd('modify')" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.modify")}}
          </h-button>
          <h-dropdown placement="bottom-start" @on-click="infoRestore" v-if="batchType!=='show'">
            <h-button type="primary" :disabled="!this.hadBatchSave">
              恢复
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list" id="dropDownMenu">
              <h-dropdown-item name="1" :disabled="!this.hadBatchSave">选择恢复</h-dropdown-item>
              <h-dropdown-item name="2" :disabled="!this.hadBatchSave">批次恢复</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-button type="primary" @click="importTemplate" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.templateDownload")}}
          </h-button>
          <h-button type="primary" @click="infoImport" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.batchImport")}}
          </h-button>
          <h-button type="primary" @click="infoDelete" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.delete")}}
          </h-button>
        </div>
      </h-datagrid>
    </div>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="optType==='add'">新增参数</span>
        <span v-if="optType==='modify'">设置扣除系数</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <common-select v-model="addForm.creditMainBrchClass" :dictList="creditMajorList" :required="true"
                         :label="$t('m.i.billInfo.creditMainBankType')" prop="creditMainBrchClass"
                         :readonly="optType==='modify'"></common-select>
          <common-select v-model="addForm.tenorVarieties" :dictList="tenorVarietiesList" :required="true"
                         :label="$t('m.i.be.tenorVarieties')" prop="tenorVarieties"
                         :readonly="optType==='modify'"></common-select>
          <common-type-field v-model="addForm.deductCoeff" :label="$t('m.i.be.deductCoeff')" prop="deductCoeff"
                             :required="true" :bigTips="false"
                             :validRules="deductCoeffRule" :integerNum="2"></common-type-field>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 批量导入 -->
    <common-file-upload-no-show :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "deductCoeffTab",
    components: {},
    data() {
      return {
        dataGridUrl: "",
        batchType: "",
        creditMajorList: [],
        tenorVarietiesList: [],
        deductCoeffTabFormItem: {
          batchId: this.batchParams.creditId,
          creditMainBrchClass: ""
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
            key: "memberId",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBrchClass",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankName"),
            key: "creditMainClassName",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CreditMajor", params.row.creditMainBrchClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.tenorVarieties"),
            key: "tenorVarieties",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "TenorCode", params.row.tenorVarieties);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.deductCoeff"),
            key: "deductCoeff",
            hiddenCol: false,
            render: (h, params) => {
              let deductCoeff = formatNumber(params.row.deductCoeff, 2, ",");
              return h("span", {
                domProps: {
                  title: deductCoeff
                }
              }, deductCoeff);
            }
          }
        ],
        optType: "",
        submitFlag: false,
        addOrEditWin: false,
        addForm: {
          id: "",
          creditMainBrchClass: "",
          tenorVarieties: "",
          deductCoeff: ""
        },
        deductCoeffRule: [{
          test: /^(([1-9]|[1-9]\d)(\.\d{1,2})?)|(0\.([1-9]\d?|0[1-9]))$/,
          trigger: "change",
          message: "扣除系数为0~100之间的数（不包含0和100），小数位不超过2位"
        }],
        importWin: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/market/anonyclick/credit/creditLimit/func_importCreditTradeParam",  //excel数据导入接口
          uploadParams: {//调用excel数据解析接口时附带的额外参数
            batchId: ""
          }
        }
      };
    },
    props: {
      hadBatchSave: {
        type: Boolean,
        default: true
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          creditMajorList: [],
          tenorVarietiesList: [],
          creditId: "",
          batchType: ""
        }
      }
    },
    watch: {
      "batchParams.batchType": {
        handler(val) {
          if (val) {
            this.dataGridUrl = val === "show" ? "/be/market/anonyclick/credit/creditLimitSearch/func_searchCreditTradeParamPage" : "/be/market/anonyclick/credit/creditLimit/func_searchCreditTradeParamPage";
            this.selectionHiddenCol();
          }
        },
        immediate: true
      },
      "batchParams.creditId": {
        handler(val) {
          if (val) {
            this.deductCoeffTabFormItem.batchId = val;
          }
        },
        immediate: true
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
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.deductCoeffTabFormItem.resetFields();
        this.deductCoeffTabFormItem.creditMainBrchClass = "";
      },
      //新增、修改
      infoAdd(str) {
        this.optType = str;
        if (str === "modify") {
          if (this.$refs.datagrid.selects.length === 0 || this.$refs.datagrid.selects.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          this.addOrEditWin = true;
          this.addForm.id = this.$refs.datagrid.selects[0].id;
          this.addForm.creditMainBrchClass = this.$refs.datagrid.selects[0].creditMainBrchClass;
          this.addForm.tenorVarieties = this.$refs.datagrid.selects[0].tenorVarieties;
          this.addForm.deductCoeff = this.$refs.datagrid.selects[0].deductCoeff;
        } else {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.$refs.addForm.resetFields();
            this.resetAddForm();
          });
        }
      },
      resetAddForm() {
        this.addForm.id = "";
        this.addForm.creditMainBrchClass = "";
        this.addForm.tenorVarieties = "";
        this.addForm.deductCoeff = "";
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.optType === "add" ? "/be/market/anonyclick/credit/creditLimit/func_addCreditTradeParam" : "/be/market/anonyclick/credit/creditLimit/func_editCreditTradeParam";
            let params = Object.assign({ batchId: this.batchParams.creditId }, this.addForm);
            post(params, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      handleWinClose() {
        this.$refs.addForm.resetFields();
        this.resetAddForm();
        this.addOrEditWin = false;
      },
      //批量导入
      infoImport() {
        this.fileParams.uploadParams.batchId = this.batchParams.creditId;
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
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/anonyclick/credit/creditLimit/func_downloadImportParam";
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
          batchId: this.batchParams.creditId,
          ids: creditIds.join(",")
        }, "/be/market/anonyclick/credit/creditLimit/func_deleteCreditTradeParam").then(res => {
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
      },
      infoRestore(type) {
        let param = {};
        if (type === "1") {
          //选择恢复
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          let list = this.$refs.datagrid.selects;
          let creditIds = [];
          for (let i = 0; i < list.length; i++) {
            creditIds.push(list[i].id);
          }
          param.ids = creditIds.join(",");
        }
        param.batchId = this.batchParams.creditId;
        post(param, "/be/market/anonyclick/credit/creditLimit/func_restoreCreditTradeParam").then(res => {
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
    },
    created() {
      this.deductCoeffTabFormItem.batchId = this.batchParams.creditId;
      this.batchType = this.batchParams.batchType;
      this.creditMajorList = this.batchParams.creditMajorList;
      this.tenorVarietiesList = this.batchParams.tenorVarietiesList;
    },
    activated() {
      this.deductCoeffTabFormItem.creditMainBrchClass = "";
    },
    deactivated() {
      this.deductCoeffTabFormItem.creditMainBrchClass = "";
    }
  };
</script>

<style scoped>

</style>
