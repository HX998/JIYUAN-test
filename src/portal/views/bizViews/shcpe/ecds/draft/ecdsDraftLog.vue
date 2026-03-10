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

                  <h-form-item prop="draftDate" :label="$t('m.i.shcpe.draftDate')">
                    <h-date-picker :value="formItem.draftDtRang" type="daterange" showFormat :editable=false
                                   @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                    <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="draftNo" :label="$t('m.i.common.draftNo')">
                    <h-input v-model="formItem.draftNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="orgnlDraftNo" :label="$t('m.i.common.originalDraftNo')">
                    <h-input v-model="formItem.orgnlDraftNo" placeholder=""></h-input>
                  </h-form-item>

                  <h-form-item prop="draftSender" :label="$t('m.i.shcpe.senderName')">
                    <h-input v-model="formItem.draftSender" placeholder=""></h-input>
                  </h-form-item>

                  <h-form-item prop="draftReceiver" :label="$t('m.i.shcpe.receiverName')">
                    <h-input v-model="formItem.draftReceiver" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="msgId" :label="$t('m.i.common.msgId')">
                    <h-input v-model="formItem.msgId" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="orgnlMsgId" :label="$t('m.i.common.originalMsgId')">
                    <h-input v-model="formItem.orgnlMsgId" placeholder=""></h-input>
                  </h-form-item>



                  <h-form-item prop="draftStatus" :label="$t('m.i.shcpe.draftStatus')">
                    <h-select v-model="formItem.draftStatus">
                      <h-option v-for="item in ecdsDraftStatusCodeList" :value="item.key" :key="item.key">{{ item.value
                        }}
                      </h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item prop="draftDir" :label="$t('m.i.shcpe.draftDir')">
                    <h-select v-model="formItem.draftDir">
                      <h-option v-for="item in ecdsDraftSendRecvMarkCodeList" :value="item.key" :key="item.key">{{
                        item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
            url="/ecds/draft/ecdsDraftLog/func_pageQueryEcdsDraftLog"
            :bindForm="formItem"
            :onCurrentChange="handlelRowClick"
            :onCurrentChangeCancel="handlelRowClickCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showInfo()">{{$t("m.i.common.showDetail")}}</h-button>
              <h-button type="primary" @on-click="reSendOrRecvMsg()">{{$t("m.i.shcpe.rcvAndSendDraft")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <h-msg-box v-model="draftInfoWin" width="1000"  :mask-closable="false" :maximize="true"
               @on-close="closeForm">
      <p slot="header">
        <span>报文详情</span>
      </p>
      <h-panel>
        <h-form :model="draftInfoForm" :label-width="115" ref="draftInfoForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item :label="$t('m.i.shcpe.draftContent')" prop="draftContent" class="h-form-height-auto">
              <!--<h-input v-model="draftInfoForm.draftContent" readonly type="textarea" :rows="10"></h-input>-->
              <textarea id="ecdsDraftContentId" readonly rows="10"
                        style="overflow-y:auto;overflow-x:auto;width: 100%"></textarea>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer"></div>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatTime } from "@/api/bizApi/commonUtil";

  export default {
    name: "ecdsDraftLog",
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        formItem: {
          draftNo: "",
          msgId: "",
          orgnlMsgId: "",
          billNoLike: "",
          draftDtRang: "",
          minDraftDt: this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD"),
          maxDraftDt: this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD"),
          orgnlDraftNo: "",
          draftSender: "",
          draftReceiver: "",
          draftStatus: "",
          draftDir: ""
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
            title: this.$t('m.i.shcpe.draftDir'),
            key: "draftDir",
            hiddenCol: false,

            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "EcdsDraftSendRecvMarkCode", params.row.draftDir);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }

          },
          {
            title: this.$t('m.i.shcpe.orgnlDraftNo'),
            key: "orgnlDraftNo",
            hiddenCol: false

          },
          {
            title: this.$t('m.i.shcpe.senderName'),
            key: "draftSender",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.draftSendBankNo'),
            key: "draftSenderBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.receiverName'),
            key: "draftReceiver",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.draftRecvBankNo'),
            key: "draftReceiverBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.draftDt'),
            key: "draftDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let draftDt = params.row.draftDt == null ? "" : this.$moment(params.row.draftDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", draftDt);
            }
          },
          {
            title: this.$t('m.i.shcpe.draftTm'),
            key: "draftTm",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let draftTm = formatTime(this,params.row.draftTm)
              return h("span", draftTm);
            }
          },
          {
            title: this.$t('m.i.shcpe.draftDealResult'),
            key: "draftStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "EcdsDraftStatusCode", params.row.draftStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.msgId'),
            key: "msgId",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.originalMsgId'),
            key: "orgnlMsgId",
            hiddenCol: false
          }
        ],
        dueDt: [],
        dictMap: new Map(),
        ifShowMore: false,
        draftInfoWin: false,
        draftInfoForm: {
          draftContent: ""
        },
        ecdsDraftSendRecvMarkCodeList: [],
        ecdsDraftStatusCodeList: [],
        currentSelectRow: null,
      };
    },
    watch: {},

    computed: {},
    created() {
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.draftDtRang = [workDate, workDate];
      this.formItem.minDraftDt = window.sessionStorage.getItem("workDate");
      this.formItem.maxDraftDt = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      this.getDictListByGroups("EcdsDraftStatusCode,EcdsDraftSendRecvMarkCode").then(res => {
        this.ecdsDraftSendRecvMarkCodeList = res.get("EcdsDraftSendRecvMarkCode");
        this.ecdsDraftStatusCodeList = res.get("EcdsDraftStatusCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleDueDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minDraftDt = arr[0].replace(/-/g, "");
          this.formItem.maxDraftDt = arr[1].replace(/-/g, "");
          this.formItem.draftDtRang = [arr[0], arr[1]];
        } else {
          this.formItem.minDraftDt = "";
          this.formItem.maxDraftDt = "";
          this.formItem.draftDtRang = [];
        };
      },

      handleSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.formItem.minDraftDt = window.sessionStorage.getItem("workDate");
        this.formItem.maxDraftDt = window.sessionStorage.getItem("workDate");
        this.formItem.draftDtRang = [workDate, workDate];
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
      handlelRowClickCancel() {
        this.currentSelectRow = null;
      },
      showInfo() {
        if (this.currentSelectRow ===null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.draftInfoWin = true;
        post({ regLogId: this.currentSelectRow.id }, "/ecds/draft/ecdsDraftLog/func_getDraftLogContent").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              // this.draftInfoForm.draftContent = retData.draftContent;
              this.$nextTick(() => {
                document.getElementById("ecdsDraftContentId").innerHTML = retData == null ? "" : retData.draftContent;
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

      reSendOrRecvMsg() {
        if (this.currentSelectRow === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        post({id:this.currentSelectRow.id, draftDir:this.currentSelectRow.draftDir}, "/ecds/draft/ecdsDraftLog/func_reSendOrRecvMsg").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      closeForm() {
        //this.$refs["draftInfoWin"].resetFields();
        this.draftInfoWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
