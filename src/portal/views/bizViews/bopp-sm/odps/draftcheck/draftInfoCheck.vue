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
            url="/sm/odps/draftcheck/draftInfoCheck/func_pageQueryDraftMsgInfo"
            :bindForm="formItem"
            :auto-load="false"
            :hasSelect="false"
            rowSelect
            ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @on-click="detailApply()">{{ $t("s.i.odps.detailApply") }}</h-button>
          </div>
        </h-datagrid>
      </h-col>
    </h-row>
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
      columns: [
        {
          type: "selection",
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
          title: this.$t('s.i.odps.draftNo'),
          key: "draftNo",
          hiddenCol: false
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
      post({}, "/sm/odps/draftcheck/draftInfoCheck/func_sendQueryDraftMsgSumApp").then(res => {
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
    detailApply() {
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.error(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      for (let selectArr of this.$refs.datagrid.selects) {
        if (selectArr.checkResult === 'DC11') {
          this.$msgTip.error(this, {info: "存在核对结果为一致的报文标识号，请取消选择后再次发送"});
          return;
        }
      }
      post({infoIds: this.$refs.datagrid.selectIds},
          "/sm/odps/draftcheck/draftInfoCheck/func_sendQueryDraftMsgDetailApp").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          let retData = res.data.retData;
          if (retCode === "000000") {
            if (retData === 0) {
              this.$msgTip.info(this, {info: "不存在需继续查验的报文，不发送报文"});
            } else {
              this.$msgTip.success(this, {info: this.$t("m.i.common.actionSuccess")});
            }
          } else {
            this.$msgTip.error(this, {info: msg});
          }
          this.$refs.datagrid.dataChange(1);
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
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
