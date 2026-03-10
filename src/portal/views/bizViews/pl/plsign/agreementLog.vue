<!--票据池子系统-签约管理-操作历史-->
<template>
  <h-msg-box v-model="tempAgreementLogWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <h-datagrid
        :columns="columns"
        highlight-row
        :url="histListUrl"
        :bindForm="logFormItem"
        :onCurrentChange="handleCurrentChange"
        :onCurrentChangeCancel="handleCurrentChangeCancel"
        :autoLoad=false
        ref="datagrid">
      </h-datagrid>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off, formatNumber, accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "agreementLog",
    data() {
      return {
        columns : [
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
            align: "center",
            hiddenCol: false
          },

          {
            title: this.$t('m.i.common.custNo'),
            key: "custNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.operType"),
            key: "operType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SignLogOperType", params.row.operType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.operTellerName"),
            key: "operTellerName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.operDt"),
            key: "operDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.operDt;
              if (!!params.row.operDt) {
                date = this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.operResult"),
            key: "operResult",
            hiddenCol: false,
            render: (h, params) => {
              let operResult = params.row.operResult;
              switch (params.row.operResult) {
                case "0":
                  operResult = "拒绝";
                  break;
                case "1":
                  operResult = "同意";
                  break;
              }
              return h("span", operResult);
            }
          },
          {
            title: this.$t("m.i.ce.signStatus"),
            key: "signStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PoolSignStatus", params.row.signStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.operRemark"),
            key: "operRemark",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.signApplyDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt;
              if (!!params.row.applDt) {
                date = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.signApplyTm"),
            key: "applTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let time = params.row.applTm;
              if (!!params.row.applTm) {
                let transTm = params.row.applTm.toString();
                if (transTm.length < 6) {
                  for (let i = 0; i < (6 - transTm.length); i++) {
                    transTm = "0" + transTm;
                  }
                }
                time = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              }
              return h("span", time);
            }
          },
          {
            title: this.$t("m.i.ce.applSignEnableDt"),
            key: "applActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applActiveDt;
              if (!!params.row.applActiveDt) {
                date = this.$moment(params.row.applActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.applSignDueDt"),
            key: "applFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applFailureDt;
              if (!!params.row.applFailureDt) {
                date = this.$moment(params.row.applFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },

          {
            title: this.$t("m.i.pl.bailPcet"),
            key: "bailPcet",
            hiddenCol: false,
            render: (h, params) => {
              let bailPcet = params.row.bailPcet;
              if (!!params.row.bailPcet) {
                bailPcet = accMul(params.row.bailPcet, 100);
              }
              return h("span", bailPcet);
            }
          },
          {
            title: this.$t("m.i.pl.discountPcet"),
            key: "discountPcet",
            hiddenCol: false,
            render: (h, params) => {
              let discountPcet = params.row.discountPcet;
              if (discountPcet != null && discountPcet !== "" &&  discountPcet !== 0) {
                discountPcet = accMul(discountPcet, 100);
                return h("span", discountPcet);
              } else {
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.pl.isCollect"),
            key: "isCollect",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCollect);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.fee"),
            key: "fee",
            hiddenCol: false,
            render: (h, params) => {
              let fee = formatNumber(params.row.fee, 2, ",");
              return h("span", {
                domProps: {
                  title: fee
                }
              }, fee);
            }
          },
          {
            title: this.$t("m.i.ce.inCustManagerName"),
            key: "custMgrName",
            hiddenCol: false
          }
        ],
        currentSelectRow : null,
      };
    },
    props: {
      title: {
        type: String,
        default: "查看操作历史"
      },
      agreementLogWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      histListUrl : {
        type : String,
        default : "/ce/fastdisc/sign/queryHistList",
      },
      logFormItem: Object,
      dictMap: Map
    },
    components: {},
    watch: {
      agreementLogWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempAgreementLogWin: {
        get() {
          return this.agreementLogWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("agreementLogWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
