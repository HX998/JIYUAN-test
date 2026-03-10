<template>
  <h-msg-box v-model="tempDiscSignLogWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <h-datagrid
        :columns="columns"
        highlight-row
        :url="histListUrl"
        :bindForm="detailFormItem"
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
    name: "fastAcptSignLog",
    data() {
      return {
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.operType"),
            key: "operTypeName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            hiddenCol: false,
            ellipsis: false
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
            title: this.$t("m.i.ce.operRemark"),
            key: "operRemark",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.signStatus"),
            key: "signStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FAcptSignStatus", params.row.signStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
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
            title: this.$t("m.i.ce.actualSignEnableDt"),
            key: "actualActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualActiveDt;
              if (!!params.row.actualActiveDt) {
                date = this.$moment(params.row.actualActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.actualSignDueDt"),
            key: "actualFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualFailureDt;
              if (!!params.row.actualFailureDt) {
                date = this.$moment(params.row.actualFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.limitAmt"),
            key: "limitAmt",
            hiddenCol: false,
            render: (h, params) => {
              let limitAmt = formatNumber(params.row.limitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: limitAmt
                }
              }, limitAmt);
            }
          },
          {
            title: this.$t("m.i.ce.usedLimitAmt"),
            key: "usedLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              let limitAmt = formatNumber(params.row.usedLimitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: limitAmt
                }
              }, limitAmt);
            }
          },
          {
            title: this.$t("m.i.ce.custLimitChangeAmt"),
            key: "custLimitChangeAmt",
            hiddenCol: false,
            render: (h, params) => {
              let limitAmt = formatNumber(params.row.custLimitChangeAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: limitAmt
                }
              }, limitAmt);
            }
          },
          {
            title: this.$t("m.i.pc.custMgrNo"),
            key: "custMgrNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.custMgrName"),
            key: "custMgrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.remark"),
            key: "remark",
            hiddenCol: false
          }
        ],
      };
    },
    props: {
      title: {
        type: String,
        default: "查看操作历史"
      },
      fastAcptSignLogWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      histListUrl : {
        type : String,
        default : "ce/acpt/fastacpt/sign/fastAcptSignMain/func_queryList",
      },
      detailFormItem: Object,
      dictMap: Map
    },
    watch: {
      fastAcptSignLogWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempDiscSignLogWin: {
        get() {
          return this.fastAcptSignLogWin;
        },
        set() {
        }
      }
    },
    methods:{
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },

      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("fastAcptSignLogWinClose", "");
      }
    }
  }
</script>

<style scoped>

</style>
