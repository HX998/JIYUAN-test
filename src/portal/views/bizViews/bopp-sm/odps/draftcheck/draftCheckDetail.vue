<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 查询表单 -->
        <div class="h-form-search-box">
          <h-panel class="clearfix">
            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <common-date-picker v-model="formItem.draftCheckDt" :label="$t('s.i.odps.compareDt')" prop="draftDtRang"
                                  type="date"></common-date-picker>
              <common-select v-model="formItem.checkResults" :dictList="this.checkResultList"
                             :label="$t('s.i.odps.checkResult')" prop="checkResults" :multiple="true"></common-select>
              <query-btn :formSearch="handleSearch" :formSearchReset="resetSearch"
                         :advanceShow='false'></query-btn>
            </h-form>
          </h-panel>
        </div>
        <!-- 数据展示表格 -->
        <h-datagrid
            :columns="columns"
            highlight-row
            url="/sm/odps/draftcheck/draftCheckDetail/func_pageQueryDraftMsgDetail"
            :bindForm="formItem"
            :auto-load="false"
            :onCurrentChange="handlelRowClick"
            :onCurrentChangeCancel="handlelRowClickCancel"
            ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @on-click="showDetail()">{{ $t("s.i.odps.showDetail") }}</h-button>
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
              <textarea id="checkDraftContentId" readonly rows="20"
                        style="overflow-y:auto;overflow-x:auto;width:100%"></textarea>
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
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "odpsDraftLog",
  data() {
    return {
      formItem: {
        draftCheckDt: "",
        checkResults: []
      },
      draftInfoForm: {

      },
      columns: [
        {
          type: "radio",
          title: " ",
          align: "center",
          width: 60,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t('s.i.odps.compareDt'),
          key: "draftCheckDt",
          hiddenCol: false,
          ellipsis: false,
          sortable: true,
          render: (h, params) => {
            let draftCheckDt = params.row.draftCheckDt == null ? "" : this.$moment(params.row.draftCheckDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", draftCheckDt);
          }
        },
        {
          title: this.$t('s.i.odps.draftDir'),
          key: "draftDir",
          hiddenCol: false,
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
          title: this.$t('s.i.odps.msgId'),
          key: "msgId",
          hiddenCol: false
        },
        {
          title: this.$t('s.i.odps.meetIncomeCode'),
          key: "meetIncomeCode",
          hiddenCol: false
        },
        {
          title: this.$t('s.i.odps.checkResult'),
          key: "checkResult",
          hiddenCol: false,
          render: (h, params) => {
            let checkResult = this.getDictValueFromMap(this.dictMap, "DraftCheckResultCode", params.row.checkResult);
            return h("span",
                {
                  domProps: {
                    title: checkResult
                  }
                }, checkResult);
          }
        }
      ],
      checkResultList: [],
      dictMap: new Map(),
      currentSelectRow: null,
      draftInfoWin: false,
    };
  },
  mounted() {
    this.getDictListByGroups("OdpsDraftSendRecvMarkCode,DraftCheckResultCode").then(res => {
      this.checkResultList = res.get("DraftCheckResultCode");
      this.dictMap = res.get("map");
    });
    this.getCurDate(res => {
      this.handleSearch();
    });
  },
  methods: {
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
    sumApply() {
      post({}, "/sm/odps/draftcheck/draftCheckDetail/func_sendQueryDraftMsgSumApp").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, {info: this.$t("m.i.common.actionSuccess")});
          } else {
            this.$msgTip.error(this, {info: msg});
          }
          this.$refs.datagrid.dataChange(1);
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    showDetail() {
      if (!this.currentSelectRow) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.draftInfoWin = true;
      post({ id: this.currentSelectRow.id }, "/sm/odps/draftcheck/draftCheckDetail/func_getDraftLogContent").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retData = res.data.retData;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            document.getElementById("checkDraftContentId").innerHTML = retData == null ? "" : retData.draftContent;
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
      this.currentSelectRow = null;
      this.draftInfoWin = false;
      this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
    },
    getCurDate(callback) {
      post({}, "/sm/odps/mng/odpsStatus/func_getOdpsStatus.currentSysDt").then(res => {
        if (res) {
          let currentSysDt = this.$moment(res.data.retData.currentSysDt, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.formItem.draftCheckDt = currentSysDt.replace(/-/g, "");
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
