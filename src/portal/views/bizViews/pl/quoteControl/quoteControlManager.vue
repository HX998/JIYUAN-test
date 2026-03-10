<!--额度批复-票据池额度批复-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" readonly icon="android-search"
                           @on-click="queryCustNo" clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pl.approvalStatus')" prop="approvalStatusList">
                  <h-select v-model="formItem.approvalStatusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in approvalStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="formSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pl/quoteControl/quoteControlManager/func_pagingQueryWhiteQuoteBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="deleteWhiteQuote" :disabled="isDeleteBan">{{
                  $t("m.i.common.delete")
                }}
              </h-button>
              <h-button type="primary" @click="batchImport">{{ $t("m.i.common.batchImport") }}</h-button>
              <h-button type="primary" @click="downloadTemplate">{{ $t("m.i.common.templateDownload") }}</h-button>
              <h-button type="primary" @click="submitAudit" :disabled="isSubmitBan">{{
                  $t("m.i.common.submitAudit")
                }}
              </h-button>
              <h-button type="primary" @click="showDetail">{{ $t("m.i.common.showDetail") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <quote-control-detail :billManagerVue="billManagerVue" :quoteControlDetailParams="quoteControlDetailParams"
                          @returnMain="returnMain"></quote-control-detail>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>

    <!-- 批量导入 -->
    <common-file-upload-no-show :import-win="this.importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>

<script>
import {on, off, post, formatNumber, accMul, getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

export default {
  name: "quoteControlManager",
  data() {
    let columns = [
      {
        type: "radio",
        width: 60,
        title: " ",
        hiddenCol: false
      },
      {
        type: "index",
        title: this.$t("m.i.common.index"),
        width: 60,
        align: "center"
      },
      {
        title: this.$t("m.i.common.custNo"),
        key: "custNo",
        hiddenCol: false,
        ellipsis: false,
        sortable: true
      },
      {
        title: this.$t("m.i.common.custName"),
        key: "custName",
        hiddenCol: false,
        ellipsis: false,
        sortable: true
      },
      {
        title: this.$t("m.i.pl.inPoolLimitAmt"),
        key: "creditLimitAmt",
        hiddenCol: false,
        ellipsis: false,
        sortable: true,
        render: (h, params) => {
          if (params.row.creditLimitAmt === "" || params.row.creditLimitAmt === null) {
            return h("span", "");
          }
          let money = formatNumber(params.row.creditLimitAmt, 2, ",");
          return h("span", {
            domProps: {
              title: money
            }
          }, money);
        }
      },
      {
        title: this.$t("m.i.billInfo.flowStatus"),
        key: "flowStatus",
        hiddenCol: false,
        ellipsis: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "PoolWhiteQuoteControlFlowStatus", params.row.flowStatus);
          return h("span", {
            domProps: {
              title: dictValue
            }
          }, dictValue);
        }
      },
      {
        title: this.$t("m.i.pl.approvalStatus"),
        key: "approvalStatus",
        hiddenCol: false,
        ellipsis: false,
        render: (h, params) => {
          let status;
          if (params.row.approvalStatus === '0') {
            status = '未生效';
          } else if (params.row.approvalStatus === '1') {
            status = '已生效';
          } else {
            status = '已失效';
          }
          return h("span", status);
        }
      },
      {
        title: this.$t("m.i.pl.approvalStartDt"),
        key: "startDt",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          let date = params.row.startDt == null ? "" : this.$moment(params.row.startDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          return h("span", date);
        }
      },
      {
        title: this.$t("m.i.pl.approvalEndDt"),
        key: "endDt",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          let date = params.row.endDt == null ? "" : this.$moment(params.row.endDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          return h("span", date);
        }
      },
      {
        title: this.$t("m.i.pl.approvalNo"),
        key: "approvalNo",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.pc.operTeller"),
        key: "operTellerName",
        hiddenCol: false
      }
    ];
    return {
      isSubmitBan: true,
      isDeleteBan: true,
      currentSelectRow: [],
      approvalStatusList: [],
      flowStatusList: [],
      columns: columns,
      cloneColumns: this.deepClone(columns),
      formItem: {
        custNo: "",
        custName: "",
        approvalStatusList: [],
      },
      quoteControlDetailParams: {
        batchId: '',
        operType: ''
      },
      dictMap: new Map(),
      showCustMessageWin: false,
      mainVue: true,
      billManagerVue: false,
      importWin: false,
      fileParams: {
        fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pl/quoteControl/func_upload",  //excel数据导入接口
        uploadParams: {}       //调用excel数据解析接口时附带的额外参数
      },
    };
  },
  components: {
    QuoteControlDetail: () => import(/* webpackChunkName: "pl/quoteControl/quoteControlDetail" */`@/views/bizViews/pl/quoteControl/quoteControlDetail`)
  },
  mounted() {
    let a = {"key": "0", "value": "未生效"};
    let b = {"key": "1", "value": "已生效"};
    let c = {"key": "2", "value": "已失效"};
    this.approvalStatusList.push(a);
    this.approvalStatusList.push(b);
    this.approvalStatusList.push(c);
    this.getDictListByGroups("Yon,PoolWhiteQuoteControlFlowStatus").then(res => {
      this.dictMap = res.get("map");
      this.flowStatusList = res.get("PoolWhiteQuoteControlFlowStatus");
    });

  },
  methods: {
    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
      if (currentRow.flowStatus === 'QC00' || currentRow.flowStatus === 'QC04') {
        this.isSubmitBan = false;
        this.isDeleteBan = false;
      } else {
        this.isSubmitBan = true;
        this.isDeleteBan = true;
      }
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = [];
      this.isSubmitBan = true;
      this.isDeleteBan = true;
    },
    //查询客户信息
    queryCustNo() {
      this.showCustMessageWin = true;
    },
    //赋值
    custCorpSelectSubmit(info) {
      this.formItem.custNo = info.custNo;
      this.formItem.custName = info.custName;
      this.showCustMessageWin = false;
    },
    //关闭
    custCorpWinClose() {
      this.showCustMessageWin = false;
    },
    //搜索选择框清空事件
    clearVal(optType) {
      if (optType === "custName") {
        this.formItem.custName = "";
        this.formItem.custNo = "";
      }
    },
    formSearch() {
      this.currentSelectRow = [];
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.formItem.custNo = "";
      this.formItem.custName = "";
      this.$refs.formItem.resetFields();
    },
    //批复明细
    showDetail() {
      if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
        this.quoteControlDetailParams.batchId = this.currentSelectRow.id;
        console.log(this.quoteControlDetailParams.batchId);
        this.quoteControlDetailParams.operType = 'control';
        this.mainVue = false;
        this.billManagerVue = true;
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return false;
      }
    },
    // 删除
    deleteWhiteQuote() {
      if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
      }
    },
    handleDel() {
      post({batchId: this.currentSelectRow.id}, "/pl/quoteControl/quoteControlManager/func_deleteWhiteQuote").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.currentSelectRow = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
          this.$refs.datagrid.dataChange(1);
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    submitAudit() {
      if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
        this.$hMsgBox.confirm({
          title: "提交申请",
          content: "确定要提交申请吗？",
          onOk: () => {
            let params = {batchId: this.currentSelectRow.id};
            let url = "/pl/quoteControl/quoteControlManager/func_submitAudit";
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
      }
    },
    returnMain() {
      this.mainVue = true;
      this.billManagerVue = false;
      this.handleCurrentChangeCancel();
    },
    downloadTemplate() {
      let url = window.LOCAL_CONFIG.API_HOME + "/pl/quoteControl/quoteControlManager/func_download";
      let form = document.createElement("form");
      form.setAttribute("id", "formId");
      form.setAttribute("action", url);
      form.setAttribute("method", "post");
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
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
  }

};
</script>

<style scoped>

</style>
