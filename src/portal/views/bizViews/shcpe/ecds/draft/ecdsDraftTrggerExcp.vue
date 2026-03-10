<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
                    <h-input v-model="formItem.billNo" placeholder=""></h-input>
                  </h-form-item>

                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/ecds/draft/ecdsDraftTrggerExcp/func_pageQueryEcdsDraftTriggerExcp"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="reRecvMsg()">{{$t("m.i.shcpe.reRecvMsg")}}</h-button>
              <h-button type="primary" @on-click="closeDraftExcp()">{{$t("m.i.shcpe.closeDraftExcp")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>


    <h-msg-box v-model="stackTraceWin" width="1000" height="350"
               :maximize="true" @on-close="closeStackTraceWin">
      <p slot="header">
        <span>堆栈信息</span>
      </p>
      <div>
        <h-form :model="stackTraceForm" :label-width="115" ref="stackTraceForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-input v-model="stackTraceForm.stackTrace" readonly type="textarea" :rows="10"></h-input>
          </div>
        </h-form>
      </div>
      <div slot="footer"></div>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "ecdsDraftTrggerExcp",
    data() {
      return {
          billId : "",
          billNo : "",
          showBillInfoWin : false,
        formItem: {
          billNo: ""
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
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.common.draftNo'),
            key: "draftNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.draftName'),
            key: "draftName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.orgnlDraftNo'),
            key: "orgnlDraftNo",
            hiddenCol: false

          },
          {
            title: this.$t('m.i.shcpe.orgnlDraftName'),
            key: "orgnlDraftName",
            hiddenCol: false

          },
          {
            title: this.$t('m.i.common.transName'),
            key: "transName",
            hiddenCol: false

          },
          {
            title: this.$t('m.i.common.msgId'),
            key: "msgId",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.errorCode'),
            key: "errorCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.errorMsg'),
            key: "errorMsg",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.stackInformation'),
            hiddenCol: false,
            render: (h, params) => {
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
                }, this.$t('m.i.shcpe.stackInformation'))
              ]);
            }
          }
        ],
        dictMap: new Map(),
        ifShowMore: false,
        stackTraceForm: {
          stackTrace: ""
        },
        stackTraceWin: false,
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: []
      };
    },
    watch: {},

    computed: {},
    methods: {
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
        showBillInfo(billId, billNo) {
            this.billId = billId;
            this.billNo = billNo;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectRow = arr;
        this.currentSelectRowInx = selectInx;
        let selectIndex = selectInx[0];
        let lastSelectIndex = this.$refs.datagrid.tData.length - 1;
        if (selectIndex === "0") {
          this.moveUpDisabled = true;
        }
        if (selectIndex === lastSelectIndex) {
          this.moveDownDisabled = true;
        }
      },

      showStackTrace(stackTrace) {
        this.stackTraceForm.stackTrace = stackTrace;
        this.stackTraceWin = true;
      },

      closeStackTraceWin() {
        this.stackTraceForm.stackTrace = "";
        this.stackTraceWin = false;
      },

      reRecvMsg() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        post({
          id: this.currentSelectRow[0].id,
          draftNo: this.currentSelectRow[0].draftNo,
          msgId: this.currentSelectRow[0].msgId
        }, "/shcpe/ecds/draft/ecdsDraftTrggerExcp/func_reRecvExcpMsg").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      closeDraftExcp() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        post({ id: this.currentSelectRow[0].id }, "/shcpe/ecds/draft/ecdsDraftTrggerExcp/func_closeDraftExcp").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
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
