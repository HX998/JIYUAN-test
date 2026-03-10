<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="queryFormItem" :model="queryFormItem" :label-width="90" class="h-form-search"
                      cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.be.isCommit')" prop="isCommit">
                    <h-radio-group v-model="queryFormItem.isCommit">
                      <h-radio label="0" @on-click="noCommitButton">
                        <span>未提交</span>
                      </h-radio>
                      <h-radio label="1" @on-click="hasCommitButton">
                        <span>已提交</span>
                      </h-radio>
                    </h-radio-group>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.preAuditNo')" prop="preAuditNo">
                    <h-input v-model="queryFormItem.preAuditNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.tradDir')" prop="trDir">
                    <h-select v-model="queryFormItem.trDir" placeholder="">
                      <h-option v-for="item in trDirList" :value="item.key" :key="item.key">
                        {{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                    <h-select v-model="queryFormItem.busiType" placeholder="">
                      <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key"
                                v-if="item.key !== 'BT06'">
                        {{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.transDt')" prop="transDts">
                    <h-date-picker type="daterange" autoPlacement placeholder="" :value="transDts" format="yyyy-MM-dd"
                                   showFormat @on-change="handleTransDtsChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.preAuditStatus')" prop="batchStatus">
                    <h-select v-model="queryFormItem.batchStatus" placeholder="" showTitle>
                      <h-option v-for="item in preAuditBatchStatusList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.isHasUsed')" prop="isHasUsed">
                    <h-radio-group v-model="queryFormItem.isHasUsed">
                      <h-radio label="0" @on-click="notUsedButton">
                        <span>未关联</span>
                      </h-radio>
                      <h-radio label="1" @on-click="hasUsedButton">
                        <span>已关联</span>
                      </h-radio>
                    </h-radio-group>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                        class="icon iconfont"
                        :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}
                    </h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}
                    </h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlight-row
              url="/be/market/preaudit/preAuditMain/func_findBatchByPage"
              :bindForm="queryFormItem"
              :onCurrentChange="onCurrentChange"
              :onCurrentChangeCancel="onCurrentChangeCancle"
              :notSetWidth="true"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="addPreAuditBatch"
                          :disabled="hasCommit || hasUsed">
                <h-button type="primary" :disabled="hasCommit || hasUsed">
                  {{$t("m.i.common.add")}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="BT01">转贴现</h-dropdown-item>
                  <h-dropdown-item name="BT02">质押式回购</h-dropdown-item>
                  <h-dropdown-item name="BT03">买断式回购</h-dropdown-item>
                  <h-dropdown-item name="RBT01">再贴现买断</h-dropdown-item>
                  <h-dropdown-item name="RBT02">再贴现质押式回购</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="primary" @on-click="editPreAuditBatch"
                        :disabled="hasCommit || hasUsed">{{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @on-click="delePreAuditBatch"
                        :disabled="hasCommit || hasUsed">{{$t("m.i.be.nullify")}}
              </h-button>
              <h-button type="primary" @on-click="transToQuote" :disabled="hasCommit || hasUsed">
                {{$t("m.i.be.createQuote")}}
              </h-button>
              <h-button type="primary" @on-click="copyPreAuditBatch" :disabled="hasCommit">{{$t("m.i.be.copy")}}
              </h-button>
              <h-button type="primary" @on-click="cancelPreAuditBatch"
                        :disabled="noCommit || hasUsed">{{$t("m.i.common.revoke")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <pre-audit-change :dictMap="dictList" :bt="busiType" :batchId="batchId" :title="title"
                      @preAuditChangeWinClose="preAuditChangeWinClose"
                      ref="preAuditChange" :preAuditChangeWin="preAuditChangeWin"></pre-audit-change>
    <pre-audit-detail :batchId="batchId" :preAuditDetailWin="preAuditDetailWin" :busiType="busiType"
                      :dictMap="dictMap" @closeMsgBox="closeMsgBox"></pre-audit-detail>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "preAuditMain",
    data() {
      return {
        currentSelectList: null,
        dictMap: null,
        queryFormItem: {
          preAuditNo: "",
          trDir: "",
          busiType: "",
          isCommit: "0",
          isHasUsed: "0",
          transDts: "",
          minTransDt: "",
          maxTransDt: "",
          preAuditStatus: "",
        },
        transDts:[],
        columns: [
          {
            type: "radio",
            width: 50,
            title: " ",
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
            title: this.$t("m.i.be.preAuditNo"),
            key: "preAuditNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.openDetailWin(params.row.id, params.row.busiType);
                  }
                }
              }, params.row.preAuditNo);
            }
          },
          {
            title: this.$t("m.i.be.tradDir"),
            key: "trDir",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "TrDir", params.row.trDir);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.otherBrchName"),
            key: "custBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.custTraderName"),
            key: "custTraderName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.preAuditStatus"),
            key: "batchStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PreAuditBatchStatus", params.row.batchStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.firstTransRate"),
            key: "ratePct",
            sortable: true,
            hiddenCol: false,
            align: "right",
          },
          {
            title: this.$t("m.i.be.dueTransRate"),
            key: "dueRatePct",
            sortable: true,
            hiddenCol: false,
            align: "right",
          },
          {
            title: this.$t("m.i.common.totalAmtBillPackage"),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.isSubDeal"),
            key: "subDeal",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.subDeal);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.clearSpeed"),
            key: "clearSpeed",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ClearSpeed", params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.firstSettleDate"),
            key: "firstSettleDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.dueSettleDt"),
            key: "dueSettleDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.settleMode"),
            key: "settleMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.firstPayInterestByUnit"),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.duePayInterestByUnit"),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.dueInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.firstSettleAmtByUnit"),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.dueSettleAmtByUnit"),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.dueSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.tenorDays"),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
          }
        ],
        busiTypeList: [],
        trDirList: [],
        billClassList: [],
        billTypeList: [],
        preRelationFlagList: [],
        preAuditBatchStatusList: [],
        noCommit: true,
        hasCommit: false,
        hasUsed: false,
        preAuditChangeWin: false,
        preAuditDetailWin: false,
        ifShowMore: false,
        busiType: "",
        batchId: 0,
        title: "",
        dictList: {}
      };
    },
    components: {
      PreAuditChange: () => import(/* webpackChunkName: "be/market/preaudit/preAuditChange" */`@/views/bizViews/be/market/preaudit/preAuditChange`),
      PreAuditDetail: () => import(/* webpackChunkName: "be/market/preaudit/preAuditDetail" */`@/views/bizViews/be/market/preaudit/preAuditDetail`)
    },
    mounted() {
      getDictListByGroups("TenorCode,bankLevel,BookType,AssetIndustryManage,AssetIndustry,CreditMajor,PreRelationFlag,PreTradeBhvr,CdSelectMode,ClearSpeed,SettleType,ClearType,Yon,BusiType,TrDir,CDMedia,DraftTypeCode,AcctFlag,QuoteStatus,StlResult,bankType,TdDirection,CrDirection,PreAuditBatchStatus,BillOrigin").then(res => {
        this.busiTypeList = res.get("BusiType");
        this.trDirList = res.get("TrDir");
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.preRelationFlagList = res.get("PreRelationFlag");
        this.preAuditBatchStatusList = res.get("PreAuditBatchStatus");
        this.dictList = {
          busiTypeList: this.busiTypeList,
          billClassList: this.billClassList,
          billTypeList: this.billTypeList,
          acctStatusList: this.acctStatusList,
          dealStatusList: this.dealStatusList,
          clearStatusList: this.clearStatusList,
          preTradeBhvrList: this.preTradeBhvrList,
          quoteBatchStatusList: this.quoteBatchStatusList,
          TdDirectionList: res.get("TdDirection"),
          CrDirectionList: res.get("CrDirection"),
          YonList: res.get("Yon"),
          assetIndustryList: res.get("AssetIndustryManage"),
          bookTypeList: res.get("BookType"),
          ClearTypeList: res.get("ClearType"),
          SettleType: res.get("SettleType"),
          clearSpeed: res.get("ClearSpeed"),
          CdSelectMode: res.get("CdSelectMode"),
          bankLevelList: res.get("bankLevel"),
          TenorCodeList: res.get("TenorCode"),
          bankTypeList: res.get("bankType"),
          billOriginList: res.get("BillOrigin"),
          dictListMap: res.get("map")
        };
        this.dictMap = res.get("map");
      });
      this.getParams();
    },
    methods: {
      handleSearch() {
        this.currentSelectList = null;
        this.$refs.datagrid.dataChange(1);
      },
      handleTransDtsChange(arr){
        if (arr && arr.length >= 2) {
          this.queryFormItem.minTransDt = arr[0].replace(/-/g, "");
          this.queryFormItem.maxTransDt = arr[1].replace(/-/g, "");
          this.transDts = [arr[0],arr[1]];
        } else {
          this.queryFormItem.minTransDt = "";
          this.queryFormItem.maxTransDt = "";
          this.transDts = [];
        }
      },
      resetSearch() {
        this.transDts = [];
        this.queryFormItem.minTransDt = "";
        this.queryFormItem.maxTransDt = "";
        this.$refs.queryFormItem.resetFields();
        this.noCommit = true;
        this.hasCommit = false;
        this.queryFormItem.isCommit = "0";
        this.hasUsed = false;
        this.queryFormItem.isHasUsed = "0";
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectList = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectList = null;
      },
      //未提交
      noCommitButton() {
        this.noCommit = true;
        this.hasCommit = false;
        this.queryFormItem.isCommit = "0";
        this.handleSearch();
      },
      //已提交
      hasCommitButton() {
        this.noCommit = false;
        this.hasCommit = true;
        this.queryFormItem.isCommit = "1";
        this.handleSearch();
      },
      //未关联
      notUsedButton() {
        this.hasUsed = false;
        this.queryFormItem.isHasUsed = "0";
        this.handleSearch();
      },
      //已关联
      hasUsedButton() {
        this.hasUsed = true;
        this.queryFormItem.isHasUsed = "1";
        this.handleSearch();
      },
      addPreAuditBatch(bt) {
        this.title = "新增预审批";
        this.busiType = bt;
        this.preAuditChangeWin = true;
      },
      editPreAuditBatch() {
        if (this.currentSelectList) {
          this.checkPreAuditHasUsed(this, res => {
            this.preAuditChangeWin = true;
            this.title = "修改预审批";
            this.batchId = this.currentSelectList.id;
            this.busiType = this.currentSelectList.busiType;
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      delePreAuditBatch() {
        let list = this.currentSelectList;
        if (!list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let url = "/be/market/preaudit/preAuditMain/func_deleteBatch";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确定要作废预审批单吗") + "?",
          onOk: () => {
            let id = list.id;
            post({ batchId: id }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
                this.$refs.datagrid.dataChange(1);
                this.currentSelectList = null;
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      transToQuote() {
        let list = this.currentSelectList;
        if (!list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let url = "/be/market/preaudit/preAuditMain/func_transToQuote";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确定要生成对话报价吗") + "?",
          onOk: () => {
            post({ id: list.id }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
                this.$refs.datagrid.dataChange(1);
                this.currentSelectList = null;
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      copyPreAuditBatch() {
        let list = this.currentSelectList;
        if (!list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let url = "/be/market/preaudit/preAuditMain/func_copyBatch";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确定要复制预审批单吗") + "?",
          onOk: () => {
            let id = list.id;
            post({ batchId: id }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
                this.$refs.datagrid.dataChange(1);
                this.currentSelectList = null;
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      cancelPreAuditBatch() {
        let list = this.currentSelectList;
        if (!list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let url = "/be/market/preaudit/preAuditMain/func_cancelApply";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确定要撤销预审批单吗") + "?",
          onOk: () => {
            let id = list.id;
            post({ batchId: id }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
                this.$refs.datagrid.dataChange(1);
                this.currentSelectList = null;
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      preAuditChangeWinClose() {
        this.preAuditChangeWin = false;
        this.batchId = null;
        this.currentSelectList = null;
        this.$refs.datagrid.dataChange(1);
      },
      openDetailWin(batchId, busiType) {
        this.batchId = batchId;
        this.busiType = busiType;
        this.preAuditDetailWin = true;
      },
      closeMsgBox() {
        this.batchId = null;
        this.preAuditDetailWin = false;
      },
      checkPreAuditHasUsed(_this, callback) {
        post({ id: this.currentSelectList.id }, "/be/market/preaudit/preAuditMain/func_checkPreAuditHasUsed").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let msg = res.data.retMsg;
            if (retCode === "000000") {
              callback();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      getParams() {
        if (this.$route.path === "/be/market/preaudit/preAuditMain") {
          if (this.$route.query.transDt) {
            let transDt = this.$moment(this.$route.query.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.transDts = [transDt , transDt];
            this.queryFormItem.batchStatus = this.$route.query.batchStatus;
            this.$nextTick(()=>{
              this.handleSearch();
            });
          }
        }
      }
    },
    watch: {
      "$route": "getParams"
    }
  };
</script>

<style scoped>

</style>
