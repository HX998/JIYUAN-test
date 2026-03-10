<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-date-picker v-model="formItem.compareDate" :label="$t('s.i.odps.compareDt')"
                                    prop="compareDate" required></common-date-picker>
                <query-btn @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch" :advanceShow="false"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/sm/odps/payflowcheck/payFlowCheckMain/func_queryPayCkRstDtoByPage"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleCheck()">{{ $t("s.i.odps.handleCheck") }}</h-button>
              <h-button type="primary" @click="showResult()">{{ $t("s.i.odps.showResult") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <h-msg-box v-model="checkWin" width="400" class="h-form-search" :mask-closable="false" :maximize="true"
               @on-close="checkWinClose">
      <p slot="header">
        <span>{{ $t("s.i.odps.handleCheck") }}</span>
      </p>
      <h-panel>
        <h-form :model="checkForm" :label-width="115" ref="checkForm" cols="1" class="h-form-search" onlyBlurRequire>
          <div class="h-search-form-row">
            <common-date-picker v-model="checkForm.compareDt" :label="$t('s.i.odps.compareDt')" prop="compareDt"
                                type="date" :required="true"></common-date-picker>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="checkWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="checkSubmit()">{{ $t("m.i.common.commit") }}</h-button>
      </div>
    </h-msg-box>

    <pay-info-ck-ep-page-win :dictMap="dictMap" :payInfoCkEpPageWin="payInfoCkEpPageWin"
                             @payBillInfoCkEpPageWinClose="payBillInfoCkEpPageWinClose"
                             :id="payCkRstId"></pay-info-ck-ep-page-win>
  </div>
</template>

<script>
import {getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
  name: "payFlowCheckMain",
  components: {
    PayInfoCkEpPageWin: () => import(/* webpackChunkName: "bopp-sm/odps/payflowcheck/PayInfoCkEpPageWin" */`@/views/bizViews/bopp-sm/odps/payflowcheck/PayInfoCkEpPageWin`)
  },
  data() {
    return {
      formItem: {
        compareDate: "",
        compareDt: ""
      },
      checkForm: {
        compareDt: ""
      },
      payCkRstId: "",
      dictMap: new Map(),
      compareDt: "",
      workDt: "",
      columns: [
        {
          type: "radio",
          title: " ",
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
          key: "compareDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let draftDt = params.row.compareDt == null ? "" : this.$moment(params.row.compareDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", draftDt);
          }
        },
        {
          title: this.$t("s.i.odps.meetIncomeCode"),
          key: "meetIncomeCode",
          hiddenCol: false,
        },
        {
          title: this.$t("s.i.odps.checkStatus"),
          key: "checkStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, 'PayFlowCheckStatus', params.row.checkStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("s.i.odps.checkResult"),
          key: "checkResult",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, 'PayFlowCheckResult', params.row.checkResult);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
      ],
      currentSelectRow: null,
      payInfoCkEpPageWin: false,
      checkWin: false,
    }
  },
  mounted() {
    this.getDictListByGroups("PayFlowCheckStatus,PayFlowCheckResult,PymnIdStsCode,OrdrStsCode,BillPayStatus,NtfyTrgtCode,EcdsBillStatusCode").then(res => {
      this.dictMap = res.get("map");
    });
    this.getCurDate();
  },
  methods: {
    showChange(val) {
      this.ifShowMore = val;
    },
    //表单查询
    handleSearch(pageNo) {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          this.formItem.compareDt = this.formItem.compareDate.replace(/-/g, "") + "";
          this.currentSelectRow = null;
          this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
        }
      });
    },
    //重置表单查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
      this.formItem.compareDate = this.workDt;
    },
    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = null;
    },
    handleCheck() {
      this.checkForm.compareDt = this.workDt;
      this.checkWin = true;
    },
    checkSubmit() {
      let compareDt = this.checkForm.compareDt.replace(/-/g, "");
      this.$refs["checkForm"].validate(valid => {
        if (valid) {
          let url = "/sm/odps/payflowcheck/payFlowCheckMain/func_checkPayFlow";
          post({compareDt: compareDt}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, {info: this.$t("m.i.common.actionSuccess")});
                this.checkWinClose();
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      });
    },
    checkWinClose() {
      this.$refs.checkForm.resetFields();
      this.checkWin = false;
      this.handleSearch(1);
    },
    getCurDate() {
      post({}, "/sm/odps/mng/odpsStatus/func_getOdpsStatus").then(res => {
        if (res) {
          let currentSysDt = this.$moment(res.data.retData.currentSysDt, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.workDt = currentSysDt.replace(/-/g, "");
            this.formItem.compareDate = this.workDt;
          }
        }
      });
    },
    showResult() {
      if (this.currentSelectRow) {
        this.payCkRstId = this.currentSelectRow.id;
        this.payInfoCkEpPageWin = true;
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
      }
    },
    payBillInfoCkEpPageWinClose() {
      this.payInfoCkEpPageWin = false;
    }
  }
}
</script>

<style scoped>

</style>
