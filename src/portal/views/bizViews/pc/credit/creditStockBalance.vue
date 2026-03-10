<!-- 库存余额管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.creditBankName')" prop="creditBankName">
                  <h-input v-model="formItem.creditBankName" readonly icon="android-search"
                           @on-click="queryCustName('query')" clearable @on-clear="clearCustName('query')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.creditDt')" prop="creditDt">
                  <h-date-picker v-model="formItem.creditDt" type="date" :editable=false
                                 :showFormat=true placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <!--<span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"-->
                  <!--:class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            :hasSelect = false
            :rowSelect = true
            url="/pc/credit/creditStockBalance/func_listPageStockBalance"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @on-click="exportTemplate" >
                {{$t('m.i.common.importTemplateDownload')}}
              </h-button>
              <h-button type="primary" @on-click="batchImport" >
                {{$t('m.i.common.batchImport')}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--查看会员-->
    <show-member :showMemberWin="showMemberWin" @memberWinClose="memberWinClose"
                 @memberSelect="memberSelect" :isShowBankNo="true"></show-member>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type==='add'">新增库存余额</span>
        <span v-if="type==='modify'">修改库存余额</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.stockBalanceType')" prop="stockBalanceType" :required="isRequired">
            <h-select v-model="addForm.stockBalanceType" placeholder="">
              <h-option value="1">承兑行贴现库存余额</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.creditBankName')" prop="creditBankName" :required="isRequired">
            <h-input v-model="addForm.creditBankName" readonly icon="android-search"
                     @on-click="queryCustName('edit')" clearable @on-clear="clearCustName('edit')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.creditLimitAmt')" prop="stockLimitAmt" :required="isRequired">
            <h-typefield v-model="addForm.stockLimitAmt" :maxlength="20" placeholder="数字，小数位最多2位" bigTips divided></h-typefield>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!-- 批量导入 -->
    <common-file-upload-no-show :import-win="this.importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditStockBalance",
    data() {
      return {
        ifShowMore : false,
        columns : [
          {
            type: "selection",
            width: 60,
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
            title: this.$t("m.i.pc.stockBalanceType"),
            key: "stockBalanceType",
            hiddenCol: false,
            render: (h, params) => {
              let info = params.row.stockBalanceType;
              switch (params.row.stockBalanceType) {
                case "1":
                  info = "承兑行贴现库存余额";
                  break;
              }
              return h("span", info);
            }
          },
          {
            title: this.$t("m.i.pc.creditBankNo"),
            key: "creditBankNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.creditBankName"),
            key: "creditBankName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.stockLimitAmt"),
            key: "stockLimitAmt",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let stockLimitAmt = formatNumber(params.row.stockLimitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: stockLimitAmt
                }
              }, stockLimitAmt);
            }
          },
          {
            title: this.$t("m.i.pc.stockDoAmt"),
            key: "stockDoAmt",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let stockDoAmt = formatNumber(params.row.stockDoAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: stockDoAmt
                }
              }, stockDoAmt);
            }
          },
          {
            title: this.$t("m.i.pc.stockUsedAmt"),
            key: "stockUsedAmt",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let stockUsedAmt = formatNumber(params.row.stockUsedAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: stockUsedAmt
                }
              }, stockUsedAmt);
            }
          },
          // {
          //   title: "生效日期",
          //   key: "activeDt",
          //   hiddenCol: false,
          //   sortable: true,
          //   render: (h, params) => {
          //     let date = params.row.activeDt == null ? "" : this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          //     return h("span", date);
          //   }
          // },
          // {
          //   title: "失效日期",
          //   key: "failureDt",
          //   hiddenCol: false,
          //   sortable: true,
          //   render: (h, params) => {
          //     let date = params.row.failureDt == null ? "" : this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          //     return h("span", date);
          //   }
          // },
          {
            title:this.$t("m.i.pc.creditDt"),
            key: "creditDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.creditDt == null ? "" : this.$moment(params.row.creditDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.creditTellerNo"),
            key: "creditTellerNo",
            hiddenCol: false
          }
        ],
        formItem : {
          creditBankNo: "",
          creditBankName: "",
          creditDt: ""
        },
        addForm : {
          id: "",
          legalNo: "",
          stockBalanceType: "1",
          creditBankNo: "",
          creditBankName: "",
          stockLimitAmt: "",
          memberId: ""
        },
        currentSelectList: [],
        currentSelectRowInx: [],
        type : null,
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : null,
        //查看会员弹出框
        showMemberWin : false,
        //区分会员弹出框类型
        optType : "query",
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        importWin: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pc/credit/creditStockBalance//func_batchAdd",  //excel数据导入接口
          uploadParams: {}       //调用excel数据解析接口时附带的额外参数
        },
      };
    },
    components: {
      ShowMember:()=>import(/* webpackChunkName: "shcpe/cpes/member/showMember" */`@/views/bizViews/shcpe/cpes/member/showMember`)
    },
    methods: {
      //导出模板
      exportTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/credit/creditStockBalance/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },

      //批量导入
      batchImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "creditStockBalanceListExport";
        this.rows = this.$refs.datagrid.total;
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/credit/creditStockBalance/func_exportBillInfo";
        if (exportType === "1") {
          let params = null;
          params = {
            creditBankNo: this.formItem.creditBankNo,
            creditBankName: this.formItem.creditBankName,
            creditDt: this.formItem.creditDt,
            field: field,
            exportType: exportType,
            excelName: this.param,
          };
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          let form = document.createElement("form");
          for (let obj in this.formItem) {
            if (this.formItem.hasOwnProperty(obj)) {
              let input = document.createElement("input");
              input.type = "text";
              input.name = obj;
              input.value = this.formItem[obj];
              form.appendChild(input);
            }
          }
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          if (this.$refs.datagrid.total > 0) {
            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "pageSize";
            input1.value = this.$refs.datagrid.total;
            form.appendChild(input1);
          }
          let input3 = document.createElement("input");
          input3.type = "text";
          input3.name = "field";
          input3.value = field;
          form.appendChild(input3);
          let input4 = document.createElement("input");
          input4.type = "text";
          input4.name = "exportType";
          input4.value = exportType;
          form.appendChild(input4);
          let input5 = document.createElement("input");
          input5.type = "text";
          input5.name = "excelName";
          input5.value = this.param;
          form.appendChild(input5);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      clearCustName(optType) {
        if (optType === "query") {
          this.formItem.creditBankNo = "";
          this.formItem.creditBankName = "";
        } else if (optType === "edit") {
          this.addForm.creditBankNo = "";
          this.addForm.creditBankName = "";
          this.addForm.memberId = "";
        }
      },
      queryCustName(optType) {
        this.optType = optType;
        this.showMemberWin = true;
      },
      memberWinClose() {
        this.showMemberWin = false;
      },
      memberSelect(info) {
        if (this.optType === "query") {
          this.formItem.creditBankNo = info.memberBankNo;
          this.formItem.creditBankName = info.memberName;
        } else if (this.optType === "edit") {
          this.addForm.creditBankNo = info.memberBankNo;
          this.addForm.creditBankName = info.memberName;
          this.addForm.memberId = info.memberId;
        }
        this.showMemberWin = false;
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.formItem.creditDt = this.formItem.creditDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.creditBankNo = "";
        this.$refs.formItem.resetFields();
      },
      handleWinClose() {
        this.optType = "query";
        this.addOrEditWin = false;
        this.addForm.id = "";
        this.addForm.legalNo = "";
        this.addForm.creditBankNo = "";
        this.addForm.memberId = "";
        this.$refs.addForm.resetFields();
      },
      // 新增/修改额度批次
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
          if (this.$refs.datagrid.selects.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            this.addOrEditWin = false;
            return;
          }
          this.$nextTick(() => {
            this.addForm.id = this.$refs.datagrid.selects[0].id;
            this.addForm.legalNo = this.$refs.datagrid.selects[0].legalNo;
            this.addForm.memberId = this.$refs.datagrid.selects[0].memberId;
            this.addForm.stockBalanceType = this.$refs.datagrid.selects[0].stockBalanceType;
            this.addForm.creditBankNo = this.$refs.datagrid.selects[0].creditBankNo;
            this.addForm.creditBankName = this.$refs.datagrid.selects[0].creditBankName;
            this.addForm.stockLimitAmt = this.$refs.datagrid.selects[0].stockLimitAmt;
          });
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addForm.id = "";
        this.addForm.legalNo = "";
        this.addForm.creditBankNo = "";
        this.addForm.memberId = "";
        this.$refs.addForm.resetFields();
      },
      submitForm() {
        this.addForm.stockLimitAmt = this.addForm.stockLimitAmt.toString().replace(/,/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/pc/credit/creditStockBalance/func_saveCreditStockBalance" : "/pc/credit/creditStockBalance/func_updateCreditStockBalance";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
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
      //删除额度批次
      handleComfirm() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
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
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/pc/credit/creditStockBalance/func_deleteCreditStockBalance").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.currentSelectRow = [];
              this.currentSelectList= [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
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
