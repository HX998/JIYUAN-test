<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 查询表单 -->
        <div class="h-form-search-box">
          <h-panel class="clearfix">
            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <common-input v-model="formItem.draftNo" :label="$t('s.i.odps.draftNo')" prop="draftNo"></common-input>
              <common-input v-model="formItem.orgnlDraftNo" :label="$t('s.i.odps.orgnlDraftNo')" prop="orgnlDraftNo"></common-input>
              <common-input v-model="formItem.msgId" :label="$t('s.i.odps.msgId')" prop="msgId"></common-input>
              <query-btn :formSearch="handleSearch" :formSearchReset="resetSearch" :advanceShow='false'></query-btn>
            </h-form>
          </h-panel>
        </div>
        <!-- 数据展示表格 -->
        <h-datagrid
          :columns="columns"
          highlight-row
          url="/sm/odps/draft/odpsDraftTrggerExcp/func_pageQueryOdpsDraftTriggerExcp"
          :bindForm="formItem"
          :onCurrentChange="handlelRowClick"
          :onCurrentChangeCancel="handlelRowClickCancel"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @on-click="showDetail()">{{$t("s.i.odps.showDetail")}}</h-button>
            <h-button type="primary" @on-click="reRecvMsg()">{{$t("m.i.shcpe.reRecvMsg")}}</h-button>
            <h-button type="primary" @on-click="closeDraftExcp()">{{$t("m.i.shcpe.closeDraftExcp")}}</h-button>
          </div>
        </h-datagrid>
      </h-col>
    </h-row>

    <!--报文详情-->
    <h-msg-box v-model="draftInfoWin" width="1000" class="h-form-search" :mask-closable="false" :maximize="true"
               @on-close="draftInfoWinClose">
      <p slot="header">
        <span>报文详情</span>
      </p>
      <h-panel>
        <h-form :model="draftInfoForm" :label-width="115" ref="draftInfoForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item :label="$t('s.i.odps.draftContent')" prop="draftContent" class="h-form-height-auto">
              <textarea id="draftContentIdError" readonly rows="20"
                        style="overflow-y:auto;overflow-x:auto;width:100%"></textarea>
            </h-form-item>
            <h-form-item label="报文时间" prop="creDtTm">
              <label>{{draftInfoForm.creDtTm}}</label>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="draftInfoWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!--点击查看错误堆栈信息弹出窗-->
    <h-msg-box v-model="stackTraceWin" class="h-form-search" :maximize="true" width="800" height="350" @on-close="closeStackTraceWin">
      <p slot="header">
        <span>错误信息查看</span>
      </p>
      <div>
        <h-form :model="stackTraceForm" :label-width="115" ref="stackTraceForm" cols="4" class="h-form-search">
          <div class="h-search-form-row">
            <h-input v-model="stackTraceForm.stackTrace" readonly type="textarea" :rows="18"></h-input>
          </div>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="closeStackTraceWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "odpsDraftTrggerExcp",
  data() {
    return {
      formItem: {
        draftNo: "",
        orgnlDraftNo: "",
        msgId: "",
      },
      columns: [
        {
          title: " ",
          type: "radio",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
            align: "center"
          },
          {
            title: this.$t('s.i.odps.draftNo'),
            key: "draftNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.draftName'),
            key: "draftName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.orgnlDraftNo'),
            key: "orgnlDraftNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.orgnlDraftName'),
            key: "orgnlDraftName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.msgId'),
            key: "msgId",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.errorCode'),
            key: "errorCode",
            hiddenCol: false
          },
          {
            title: this.$t('s.i.odps.errorMessage'),
            key: "errorMsg",
            hiddenCol: false
          },
          {
            title: this.$t('s.i.odps.stackInformation'),
            key: "stackTrace",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.stackTrace == null || params.row.stackTrace === ""){
                return "";
              }
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showStackTrace(params.row.stackTrace);
                    }
                  }
                }, this.$t('s.i.odps.stackInformation'))
              ]);
            }
          }
      ],
      dictMap: new Map(),
      stackTraceForm: {
        stackTrace: ""
      },
      stackTraceWin: false,
      currentSelectRow: null,
      draftInfoWin: false,
      draftInfoForm: {
        draftContent: "",
        creDtTm: ""
      }
    };
    },
    methods: {
      handleSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handlelRowClickCancel() {
        this.currentSelectRow = null;
      },
      showStackTrace(stackTrace) {
        this.stackTraceForm.stackTrace = stackTrace;
        this.stackTraceWin = true;
      },

      closeStackTraceWin() {
        this.stackTraceForm.stackTrace = "";
        this.stackTraceWin = false;
      },
      showDetail() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.draftInfoWin = true;
        post({ id: this.currentSelectRow.draftLogId }, "/sm/odps/draft/odpsDraftLog/func_getDraftLogContent").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$nextTick(() => {
                document.getElementById("draftContentIdError").innerHTML = retData == null ? "" : retData.draftContent;
                this.draftInfoForm.creDtTm = this.$moment(retData.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              });
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      draftInfoWinClose() {
        this.draftInfoForm.draftContent = "";
        this.draftInfoForm.creDtTm = "";
        this.currentSelectRow = null;
        this.draftInfoWin = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },

      reRecvMsg() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        post({
          id: this.currentSelectRow.id,
          draftNo: this.currentSelectRow.draftNo,
          msgId: this.currentSelectRow.msgId
        }, "/sm/odps/draft/odpsDraftTrggerExcp/func_reRecvExcpMsg").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      closeDraftExcp() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        post({id: this.currentSelectRow.id}, "/sm/odps/draft/odpsDraftTrggerExcp/func_closeDraftExcp").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, {info: this.$t("m.i.common.actionSuccess")});
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = null;
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
