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
                  <h-form-item prop="settleReqNo" label="结算请求编号">
                    <h-input v-model="formItem.settleReqNo" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item prop="settleBusiType" label="业务种类">
                    <h-select v-model="formItem.settleBusiType" placeholder="">
                      <h-option v-for="item in settleBusiTypeList" :value="item.key" :key="item.value">{{ item.value
                        }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')">
                    <h-input v-model="formItem.billNoLike" placeholder="" :maxlength="30"></h-input>
                  </h-form-item>
                  <bill-range :form-item="formItem" :range-props="['minBillRangeStart', 'maxBillRangeEnd']"></bill-range>
                  <h-form-item prop="dealNo" label="成交单编号">
                    <h-input v-model="formItem.dealNo" placeholder="" :maxlength="30"></h-input>
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
            url="/shcpe/cpes/settle/settleLineMain/func_queryClearLineRcv"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="clearingQueueQuery()" v-if="authObj.clearingQueueQueryBtn">{{$t("m.i.shcpe.chooseAcctNo")}}
              </h-button>
              <h-button type="primary" @on-click="adjustment('QC00')" v-if="authObj.adjustmentBtn">{{$t("m.i.shcpe.adjustHead")}}</h-button>
              <h-button type="primary" @on-click="adjustment('QC01')" v-if="authObj.adjustmentBtn">{{$t("m.i.shcpe.adjustTail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <h-msg-box v-model="fundAcctSeleteWin" width="400"  :mask-closable="false" :maximize="true"
               @on-close="closeWin">
      <p slot="header">
        <span>资金账户选择</span>
      </p>
      <h-panel>
        <h-form :model="fundAcctSeleteForm" :label-width="115" ref="fundAcctSeleteForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item label="资金账号" prop="fundAcctName" required>
              <h-input v-model="fundAcctSeleteForm.fundAcctNo" v-show="false"></h-input>
              <h-input v-model="fundAcctSeleteForm.fundAcctName" :value="fundAcctSeleteForm.fundAcctName"
                       readonly icon="android-search"
                       @on-click="queryfundAcctNo()" placeholder=""></h-input>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closeWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="fundAcctQuery()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <fund-acct-view :fundAcctView="fundAcctView" @fundAcctViewSubmit="fundAcctViewSubmit"
                    @fundAcctViewClose="fundAcctViewClose"></fund-acct-view>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo"
                    :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "settleLineMain",
    data() {
      return {
          billId : "",
          billNo : "",
          billRangeStart : "",
          billRangeEnd : "",
          showBillInfoWin : false,
        formItem: {
          settleReqNo: "",
          settleBusiType: "",
          dealNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          billNoLike: ""
        },
        fundAcctSeleteForm: {
          fundAcctNo: "",
          fundAcctName: ""
        },
        authObj: {
          clearingQueueQueryBtn: true,
          adjustmentBtn: true
        },
        columns: [
          {
            type: "radio",
            title: " ",
            hiddenCol: false,
            align: "center",
            width: 60
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false,
            width: 60
          },
          {
            title: this.$t("m.i.shcpe.queueSeqNo"),
            key: "queueSeqNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.common.settleReqNo"),
            key: "settleReqNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.shcpe.queueNo"),
            key: "queueNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.common.settleBusiType"),
            key: "settleBusiType",
            hiddenCol: false,
            align: "center",

            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "StlRequestType", params.row.settleBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.settleAmt"),
            key: "settleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let settleAmt = formatNumber(params.row.settleAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: settleAmt
                }
              }, settleAmt);
            }
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            align: "center",
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.feeNo"),
            key: "feeNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.common.updateTime"),
            key: "updateTime",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              return h("span", params.row.updateTime ? this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "-");
            }
          },
        ],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        fundAcctView: false,
        submitFlag: false,
        moveUpDisabled: false,
        moveDownDisabled: false,
        fundAcctSeleteWin: false,
        ifShowMore: false,
        tableRef: "selfTable",
        currentSelectRow: null,

        settleBusiTypeList: [],
        dictMap: []
      };
    },
    components: {
      FundAcctView: () => import(/* webpackChunkName: "shcpe/cpes/fundcust/fundAcctView" */`@/views/bizViews/shcpe/cpes/fundcust/fundAcctView`)

    },
    watch: {},

    computed: {},
    mounted() {
      getDictListByGroups("StlRequestType").then(res => {
        this.settleBusiTypeList = res.get("StlRequestType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
        showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
            this.billId = billId;
            this.billNo = billNo;
            this.billRangeStart = billRangeStart;
            this.billRangeEnd = billRangeEnd;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      clearingQueueQuery() {
        this.fundAcctSeleteWin = true;
      },
      closeWin() {
        this.fundAcctSeleteForm.fundAcctNo = "";
        this.fundAcctSeleteForm.fundAcctName = "";
        this.fundAcctSeleteWin = false;
      },
      adjustment(queAdjType) {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let lineId = this.currentSelectRow.id;
        post({
          id: lineId,
          queAdjustType: queAdjType
        }, "/shcpe/cpes/settle/settleLineMain/func_clearLineApl").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryfundAcctNo() {
        this.fundAcctView = true;
      },
      fundAcctViewSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.fundAcctSeleteForm.fundAcctNo = info.cpesAcctNo;
        this.fundAcctSeleteForm.fundAcctName = info.fundAcctName;
        this.fundAcctView = false;
      },
      fundAcctViewClose() {
        this.fundAcctView = false;
      },
      fundAcctQuery() {
        post(this.fundAcctSeleteForm, "/shcpe/cpes/settle/settleLineMain/func_clearLineQueryApl").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.$refs["fundAcctSeleteForm"].resetFields();
              this.closeWin();
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      pageShowFormatBillRange(billRangeStart, billRangeEnd) {
        if (billRangeStart == null || billRangeStart === ""
          || billRangeEnd == null || billRangeEnd === "") {
          return '-';
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0') {
          return '0';
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      }
    }
  };
</script>

<style scoped>

</style>
