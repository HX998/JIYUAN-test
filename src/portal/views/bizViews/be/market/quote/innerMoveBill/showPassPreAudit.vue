<template>
    <div>
        <h-msg-box v-model="tempShowPassPreAuditWin" :mask-closable="false" @on-close="handleClose" :maximize="true"
                   width="1000" :height="600" :z-index="1005">
            <p slot="header">
                <span>选择预审批单</span>
            </p>
            <div class="h-form-search-box">
                <h-panel class="clearfix">
                    <h-form ref="queryFormItem" :model="queryFormItem" :label-width="80" class="h-form-search" cols="4">
                        <div class="h-search-form-row">
                            <h-form-item :label="$t('m.i.be.preAuditNo')" prop="preAuditNo">
                                <h-input v-model="queryFormItem.preAuditNo" placeholder=""></h-input>
                            </h-form-item>
                            <h-form-item :label="$t('m.i.be.tradDir')" prop="trDir">
                                <h-select v-model="queryFormItem.trDir" placeholder="" showTitle>
                                    <h-option v-for="item in trDirList" :value="item.key" :key="item.key">
                                        {{item.value }}
                                    </h-option>
                                </h-select>
                            </h-form-item>
                            <h-form-item prop="prodNo" v-show="false">
                                <h-input v-model="queryFormItem.prodNo" placeholder=""></h-input>
                            </h-form-item>
                            <h-form-item prop="brchCode" v-show="false">
                                <h-input v-model="queryFormItem.brchCode" placeholder=""></h-input>
                            </h-form-item>
                            <h-form-item prop="busiType" v-show="false">
                                <h-input v-model="queryFormItem.busiType" placeholder=""></h-input>
                            </h-form-item>
                            <h-form-item class="h-form-operate">
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
                            :url="batchURL"
                            :auto-load="false"
                            :bindForm="queryFormItem"
                            :onCurrentChange="onCurrentChange"
                            :onCurrentChangeCancel="onCurrentChangeCancle"
                            :notSetWidth="true"
                            ref="datagrid">
                    </h-datagrid>
            <div slot="footer">
                <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
                <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
                <h-button type="primary" v-else @click="pickPassPreAudit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
        </h-msg-box>
    </div>
</template>

<script>
  import { post, on, off,formatNumber} from "@/api/bizApi/commonUtil";
  export default {
    name: "showPassPreAudit",
    data() {
      return {
        queryFormItem : {
          preAuditNo: "",
          trDir: "",
          busiType: "",
          prodNo: "",
          brchCode: "",
          billClass: "",
          billType: ""
        },
        currentSelectList : null,
        columns : [
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
            title: this.$t('m.i.be.preAuditNo'),
            key: "preAuditNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.tradDir'),
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
            title: this.$t('m.i.common.busiType'),
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
            title: this.$t('m.i.be.otherBrchName'),
            key: "custBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.custTraderName'),
            key: "custTraderName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.preAuditStatus'),
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
            title: this.$t('m.i.billInfo.billType'),
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
            title: this.$t('m.i.billInfo.billClass'),
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
            title: this.$t('m.i.be.firstTransRate'),
            key: "ratePct",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dueTransRate'),
            key: "dueRatePct",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.totalAmtByYUAN'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.totalCount'),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.isSubDeal'),
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
            title: this.$t('m.i.be.clearSpeed'),
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
            title: this.$t('m.i.be.innerFirstSettleDate'),
            key: "innerFirstSettleDate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.innerFirstSettleDate ? this.$moment(params.row.innerFirstSettleDate, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.be.outFirstSettleDate'),
            key: "outFirstSettleDate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.outFirstSettleDate ? this.$moment(params.row.outFirstSettleDate, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.be.settleMode'),
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
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.duePayInterestByUnit'),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.dueInterest, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.dueSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.tenorDays'),
            key: "tenorDays",
            hiddenCol: false
          }
        ],
        busiTypeList : [],
        trDirList : [],
        submitFlag : false,
        ifShowMore : false
      }
    },
    props: {
      batchURL: {
        type: String,
        default() {
          return "/be/market/quote/quoteManager/func_findPassBatchByPage";
        }
      },
      prodNo: "",
      brchCode: "",
      trDir: "",
      busiType: "",
      billClass: "",
      billType: "",
      showPassPreAuditWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempShowPassPreAuditWin: {
        get() {
          return this.showPassPreAuditWin;
        },
        set() {

        }
      }
    },
    watch: {
      showPassPreAuditWin(val) {
        if (val) {
          this.queryFormItem.prodNo = this.prodNo;
          this.queryFormItem.branchCode = this.brchCode;
          this.queryFormItem.trDir = this.trDir;
          this.queryFormItem.busiType = this.busiType;
          this.queryFormItem.billClass = this.billClass;
          this.queryFormItem.billType = this.billType;
          this.getDictListByGroups("CreditMajor,CdSelectMode,ClearSpeed,SettleType,ClearType,Yon,BusiType,TrDir,CDMedia,DraftTypeCode,PreAuditBatchStatus").then(res => {
            this.busiTypeList = res.get("BusiType");
            this.trDirList = res.get("TrDir");
            this.dictMap = res.get("map");
            this.$nextTick(() => {
              this.$refs.datagrid.dataChange(1);
            });
          });
        }
      }
    },
    methods: {
      handleSearch() {
        this.currentSelectList = null;
        this.$refs.datagrid.dataChange(1);
      },
      resetSearch() {
        this.$refs.queryFormItem.resetFields();
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectList = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectList = null;
      },
      handleClose() {
        this.currentSelectList = null;
        this.$refs.queryFormItem.resetFields();
        this.$emit("showPassPreAuditWinClose", "");
      },
      pickPassPreAudit() {
        this.$refs.queryFormItem.resetFields();
        this.$emit("pickPassPreAudit", this.currentSelectList);
        this.currentSelectList = null;
      }
    }
  };
</script>

<style scoped>

</style>
