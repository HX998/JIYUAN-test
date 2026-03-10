<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 查询表单 -->
        <div class="h-form-search-box">
          <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <common-date-picker v-model="formItem.draftDtRang" :label="$t('s.i.odps.draftDt')" prop="draftDtRang" type="daterange"
                                  :rangeValue="['minDraftDt','maxDraftDt']" :minDraftDt.sync="formItem.minDraftDt"
                                  :maxDraftDt.sync="formItem.maxDraftDt" @on-change="handleDraftDtChange">
              </common-date-picker>
              <common-input v-model="formItem.payFlowNo" :label="$t('s.i.odps.payFlowNo')" prop="payFlowNo"></common-input>
              <common-input v-model="formItem.draftNo" :label="$t('s.i.odps.draftNo')" prop="draftNo"></common-input>
              <common-select v-model="formItem.draftDir" :dictList="this.odpsDraftSendRecvMarkCodeList" :label="$t('s.i.odps.draftDir')" prop="draftDir"></common-select>
              <common-input v-model="formItem.orgnlDraftNo" :label="$t('s.i.odps.orgnlDraftNo')" prop="orgnlDraftNo"></common-input>
              <common-input v-model="formItem.draftSender" :label="$t('s.i.odps.draftSender')" prop="draftSender"></common-input>
              <common-input v-model="formItem.draftReceiver" :label="$t('s.i.odps.draftReceiver')" prop="draftReceiver"></common-input>
              <common-select v-model="formItem.draftStatus" :dictList="this.odpsDraftStatusCodeList" :label="$t('s.i.odps.draftDealResult')" prop="draftStatus"></common-select>
              <common-input v-model="formItem.msgId" :label="$t('s.i.odps.msgId')" prop="msgId"></common-input>
              <common-input v-model="formItem.orgnlMsgId" :label="$t('s.i.odps.orgnlMsgId')" prop="orgnlMsgId"></common-input>
              <query-btn @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch" :advanceShow='true'></query-btn>
            </h-form>
          </h-panel>
        </div>
        <!-- 数据展示表格 -->
        <h-datagrid
          :columns="columns"
          highlight-row
          url="/sm/odps/draft/odpsDraftLog/func_pageQueryOdpsDraftLog"
          :bindForm="formItem"
          :auto-load="false"
          :onCurrentChange="handlelRowClick"
          :onCurrentChangeCancel="handlelRowClickCancel"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @on-click="showDetail()">{{$t("s.i.odps.showDetail")}}</h-button>
            <h-button type="primary" @on-click="reSendOrRecvMsg()">{{$t("s.i.odps.rcvAndSendDraft")}}</h-button>
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
              <textarea id="odpsDraftContentId" readonly rows="20"
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
  </div>
</template>

<script>
import {formatTime, post} from "@/api/bizApi/commonUtil";

export default {
  name: "odpsDraftLog",
  data() {
    return {
      formItem: {
        draftDtRang: [],
        minDraftDt: "",
        maxDraftDt: "",
        draftNo: "",
        msgId: "",
        orgnlDraftNo: "",
        orgnlMsgId: "",
        draftDir: "",
        draftSender: "",
        draftReceiver: "",
        draftStatus: "",
        payFlowNo: ""
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
            title: this.$t('s.i.odps.payFlowNo'),
            key: "payFlowNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.draftNo'),
            key: "draftNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.draftDir'),
            key: "draftDir",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let draftDir = this.getDictValueFromMap(this.dictMap, "OdpsDraftSendRecvMarkCode", params.row.draftDir);
              return h("span",
                {
                  domProps: {
                    title: draftDir
                  }
                }, draftDir);
            }
          },
          {
            title: this.$t('s.i.odps.orgnlDraftNo'),
            key: "orgnlDraftNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.draftSender'),
            key: "draftSender",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('s.i.odps.draftReceiver'),
            key: "draftReceiver",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('s.i.odps.draftDt'),
            key: "draftDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let draftDt = params.row.draftDt == null ? "" : this.$moment(params.row.draftDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", draftDt);
            }
          },
          {
            title: this.$t('s.i.odps.draftTm'),
            key: "draftTm",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let draftTm = formatTime(this,params.row.draftTm);
              return h("span", draftTm );
            }
          },
          {
            title: this.$t('s.i.odps.draftDealResult'),
            key: "draftStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let draftStatus = this.getDictValueFromMap(this.dictMap, "OdpsDraftStatusCode", params.row.draftStatus);
              return h("span",
                {
                  domProps: {
                    title: draftStatus
                  }
                }, draftStatus);
            }
          },
          {
            title: this.$t('s.i.odps.msgId'),
            key: "msgId",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.orgnlMsgId'),
            key: "orgnlMsgId",
            hiddenCol: false,
            sortable: true
          }
        ],
        dictMap: new Map(),
        ifShowMore: false,
        draftInfoWin: false,
        draftInfoForm: {
          draftContent: "",
          creDtTm:""
        },
        odpsDraftSendRecvMarkCodeList: [],
        odpsDraftStatusCodeList: [],
        currentSelectRow: null,
      };
    },
    mounted() {
      this.getDictListByGroups("OdpsDraftStatusCode,OdpsDraftSendRecvMarkCode").then(res => {
        this.odpsDraftSendRecvMarkCodeList = res.get("OdpsDraftSendRecvMarkCode");
        this.odpsDraftStatusCodeList = res.get("OdpsDraftStatusCode");
        this.dictMap = res.get("map");
      });
      this.getCurDate(res => {
        this.handleSearch();
      });


    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },

      handleDraftDtChange(arr) {
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
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.getCurDate(res => {
        });
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handlelRowClickCancel() {
        this.currentSelectRow = null;
      },
      showDetail() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.draftInfoWin = true;
        post({ id: this.currentSelectRow.id }, "/sm/odps/draft/odpsDraftLog/func_getDraftLogContent").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$nextTick(() => {
                document.getElementById("odpsDraftContentId").innerHTML = retData == null ? "" : retData.draftContent;
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

      reSendOrRecvMsg() {
        if (this.currentSelectRow === null) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        post({id:this.currentSelectRow.id, draftDir:this.currentSelectRow.draftDir}, "/sm/odps/draft/odpsDraftLog/func_reSendOrRecvMsg").then(res => {
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

      getCurDate(callback) {
        post({}, "/sm/odps/mng/odpsStatus/func_getOdpsStatus.currentSysDt").then(res => {
          if (res) {
            let currentSysDt = this.$moment(res.data.retData.currentSysDt, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formItem.draftDtRang = [currentSysDt, currentSysDt];
              this.formItem.minDraftDt = currentSysDt.replace(/-/g, "");
              this.formItem.maxDraftDt = currentSysDt.replace(/-/g, "");
              callback();
            }
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
