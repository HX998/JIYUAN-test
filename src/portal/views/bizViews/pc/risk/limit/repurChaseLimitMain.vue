<!-- 回购限额管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
                  <h-input v-model="formItem.memberName" readonly icon="android-search"
                           @on-click="queryCustName('query')" clearable @on-clear="clearCustName('query')"></h-input>
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
            highlight-row
            :row-select="true"
            url="/pc/limit/repurChaseLimit/func_listPageRepurChaseLimit"
            :bindForm="formItem"
            :page-size="pageSizeParamValue"
            :onSelectChange="handleSelectClick"
            :on-select-change="handleCurrentChange"
            :on-current-change-cancel="handleCurrentChangeCancel"
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
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()" >{{$t('m.i.common.listExport')}}</h-button>
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
        <span v-if="type==='add'">新增回购限额</span>
        <span v-if="type==='modify'">修改回购限额</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">

          <h-form-item :label="$t('m.i.common.memberName')" prop="memberName" :required="isRequired">
            <h-input v-model="addForm.memberName" readonly icon="android-search"
                     @on-click="queryCustName('edit')" clearable @on-clear="clearCustName('edit')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.memberId')" prop="memberId" :required="isRequired">
            <h-input v-model="addForm.memberId" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.impawnRebuyAuditAmt')" prop="impawnRebuyAuditAmt" :required="isRequired" class="h-form-long-label">
            <h-typefield v-model="addForm.impawnRebuyAuditAmt" :maxlength="20" placeholder="数字，小数位最多2位" bigTips divided @on-change="handleAmtChange"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.impawnRebuyUsedAmt')" prop="impawnRebuyUsedAmt" :required="isRequired" class="h-form-long-label">
            <h-typefield v-model="addForm.impawnRebuyUsedAmt" :maxlength="20" placeholder="数字，小数位最多2位" bigTips divided readonly></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.impawnRebuyDoAmt')" prop="impawnRebuyDoAmt" :required="isRequired" class="h-form-long-label">
            <h-typefield v-model="addForm.impawnRebuyDoAmt" :maxlength="20" placeholder="数字，小数位最多2位" bigTips divided readonly></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.redeemRebuyAuditAmt')" prop="redeemRebuyAuditAmt" :required="isRequired" class="h-form-long-label">
            <h-typefield v-model="addForm.redeemRebuyAuditAmt" :maxlength="20" placeholder="数字，小数位最多2位" bigTips divided @on-change="handleAmtChange1"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.redeemRebuyUsedAmt')" prop="redeemRebuyUsedAmt" :required="isRequired" class="h-form-long-label">
            <h-typefield v-model="addForm.redeemRebuyUsedAmt" :maxlength="20" placeholder="数字，小数位最多2位" bigTips divided readonly></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.redeemRebuyDoAmt')" prop="redeemRebuyDoAmt" :required="isRequired" class="h-form-long-label">
            <h-typefield v-model="addForm.redeemRebuyDoAmt" :maxlength="20" placeholder="数字，小数位最多2位" bigTips divided readonly></h-typefield>
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
    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "repurChaseLimitMain",
    data() {
      return {
        // impawnRebuyAuditAmtRule : [{ test: this.impawnRebuyAuditAmtRule, trigger: "blur,change" }],
        // redeemRebuyAuditAmtRule : [{ test: this.redeemRebuyAuditAmtRule, trigger: "blur,change" }],
        pageSizeParamValue : "",
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
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.impawnRebuyAuditAmt"),
            key: "impawnRebuyAuditAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let impawnRebuyAuditAmt = formatNumber(params.row.impawnRebuyAuditAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: impawnRebuyAuditAmt
                }
              }, impawnRebuyAuditAmt);
            }
          },
          {
            title: this.$t("m.i.pc.impawnRebuyUsedAmt"),
            key: "impawnRebuyUsedAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let impawnRebuyUsedAmt = formatNumber(params.row.impawnRebuyUsedAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: impawnRebuyUsedAmt
                }
              }, impawnRebuyUsedAmt);
            }
          },
          {
            title: this.$t("m.i.pc.impawnRebuyDoAmt"),
            key: "impawnRebuyDoAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let impawnRebuyDoAmt = formatNumber(params.row.impawnRebuyDoAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: impawnRebuyDoAmt
                }
              }, impawnRebuyDoAmt);
            }
          },
          {
            title: this.$t("m.i.pc.redeemRebuyAuditAmt"),
            key: "redeemRebuyAuditAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let redeemRebuyAuditAmt = formatNumber(params.row.redeemRebuyAuditAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: redeemRebuyAuditAmt
                }
              }, redeemRebuyAuditAmt);
            }
          },
          {
            title: this.$t("m.i.pc.redeemRebuyUsedAmt"),
            key: "redeemRebuyUsedAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let redeemRebuyUsedAmt = formatNumber(params.row.redeemRebuyUsedAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: redeemRebuyUsedAmt
                }
              }, redeemRebuyUsedAmt);
            }
          },
          {
            title: this.$t("m.i.pc.redeemRebuyDoAmt"),
            key: "redeemRebuyDoAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let redeemRebuyDoAmt = formatNumber(params.row.redeemRebuyDoAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: redeemRebuyDoAmt
                }
              }, redeemRebuyDoAmt);
            }
          }
        ],
        formItem : {
          memberId: "",
          memberName: "",
        },
        addForm : {
          id: "",
          memberId: "",
          memberName:"",
          impawnRebuyAuditAmt:"",
          impawnRebuyUsedAmt:"",
          impawnRebuyDoAmt:"",
          redeemRebuyAuditAmt:"",
          redeemRebuyUsedAmt:"",
          redeemRebuyDoAmt:"",
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
          //导入excel数据解析接口
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pc/limit/repurChaseLimit/func_batchAdd",
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pc/limit/repurChaseLimit/func_submitExcelData",
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
            {
              type: "radio",
              title: " ",
              width: 60,
              align: "center",
              hiddenCol: false
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center"
            },
            {
              title: this.$t("m.i.common.memberId"),
              key: "memberId",
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t("m.i.common.memberName"),
              key: "memberName",
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t("m.i.pc.impawnRebuyAuditAmt"),
              key: "impawnRebuyAuditAmt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let impawnRebuyAuditAmt = formatNumber(params.row.impawnRebuyAuditAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: impawnRebuyAuditAmt
                  }
                }, impawnRebuyAuditAmt);
              }
            },
            {
              title: this.$t("m.i.pc.redeemRebuyAuditAmt"),
              key: "redeemRebuyAuditAmt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let impawnRebuyUsedAmt = formatNumber(params.row.redeemRebuyAuditAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: impawnRebuyUsedAmt
                  }
                }, impawnRebuyUsedAmt);
              }
            }
          ],
          paramKey: "list"         //后台接收对应key
        },
      };
    },
    components: {
      ShowMember:()=>import(/* webpackChunkName: "shcpe/cpes/member/showMember" */`@/views/bizViews/shcpe/cpes/member/showMember`)
    },
    methods: {
      // impawnRebuyAuditAmtRule(rule, value, callback){
      //   if (Number(this.addForm.impawnRebuyAuditAmt) < Number(this.addForm.impawnRebuyUsedAmt)) {
      //     callback(new Error("质押式逆回购总额不能小于已用额度"));
      //   } else {
      //     callback();
      //   }
      // },
      handleAmtChange(value) {
        this.addForm.impawnRebuyDoAmt = Number(value)-Number(this.addForm.impawnRebuyUsedAmt);
      },
      // redeemRebuyAuditAmtRule(rule, value, callback){
      //   if (Number(this.addForm.redeemRebuyAuditAmt) < Number(this.addForm.redeemRebuyUsedAmt)) {
      //     callback(new Error("买断式逆回购总额不能小于已用额度"));
      //   } else {
      //     callback();
      //   }
      // },
      handleAmtChange1(value) {
        this.addForm.redeemRebuyDoAmt = Number(value)-Number(this.addForm.redeemRebuyUsedAmt);
      },
      //导出模板
      exportTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/limit/repurChaseLimit/func_download";
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
        this.param = "repurChaseLimitListExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/limit/repurChaseLimit/func_exportRepurChaseLimit";
        let pageSize = this.$refs.datagrid.total;
        if (exportType === "1") {
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          }else {
            params = {
              memberId:  this.formItem.memberId,
              field: field,
              exportType: exportType,
              excelName: this.param,
              pageSize:pageSize,
            };
          }
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
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "ids";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
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
        }
      },
      clearCustName(optType) {
        if (optType === "query") {
          this.formItem.memberId = "";
          this.formItem.memberName = "";
        } else if (optType === "edit") {
          this.addForm.memberName = "";
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
          this.formItem.memberId = info.memberId;
          this.formItem.memberName = info.memberName;
        } else if (this.optType === "edit") {
          this.addForm.memberName = info.memberName;
          this.addForm.memberId = info.memberId;
        }
        this.showMemberWin = false;
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.memberId = "";
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) {
          return;
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.optType = "query";
        this.addOrEditWin = false;
        this.addForm.id = "";
        this.addForm.memberId = "";
        this.$refs.addForm.resetFields();
      },
      // 新增/修改额度批次
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.currentSelectList.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
          if (this.currentSelectList.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            this.addOrEditWin = false;
            return;
          }
          this.$nextTick(() => {
            this.addForm.id = this.currentSelectList[0].id;
            this.addForm.memberId = this.currentSelectList[0].memberId;
            this.addForm.memberName = this.currentSelectList[0].memberName;
            this.addForm.impawnRebuyAuditAmt = this.currentSelectList[0].impawnRebuyAuditAmt;
            this.addForm.redeemRebuyAuditAmt = this.currentSelectList[0].redeemRebuyAuditAmt;
            this.addForm.impawnRebuyUsedAmt = this.currentSelectList[0].impawnRebuyUsedAmt;
            this.addForm.redeemRebuyUsedAmt = this.currentSelectList[0].redeemRebuyUsedAmt;
            this.addForm.impawnRebuyDoAmt = this.currentSelectList[0].impawnRebuyDoAmt;
            this.addForm.redeemRebuyDoAmt = this.currentSelectList[0].redeemRebuyDoAmt;
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
        this.addForm.memberId = "";
        this.$refs.addForm.resetFields();
        this.addForm.impawnRebuyUsedAmt=0;
        this.addForm.redeemRebuyUsedAmt=0;
      },
      submitForm() {
        this.addForm.impawnRebuyAuditAmt = this.addForm.impawnRebuyAuditAmt.toString().replace(/,/g, "");
        this.addForm.redeemRebuyAuditAmt = this.addForm.redeemRebuyAuditAmt.toString().replace(/,/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/pc/limit/repurChaseLimit/func_saveRepurChaseLimit" : "/pc/limit/repurChaseLimit/func_updateRepurChaseLimit";
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
        post({ ids: ids }, "/pc/limit/repurChaseLimit/func_deleteRepurChaseLimit").then(res => {
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
      },
    },
    created() {
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
    }
  };
</script>

<style scoped>

</style>
