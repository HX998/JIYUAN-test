<!--票据池池信息查询-->
<template>
  <h-msg-box v-model="tempPoolCreditInfoWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="columns"
          highlight-row
          :url="poolCreditInfoParams.dataUrl"
          :bindForm="formItem"
          :onCurrentChange="onCurrentChange"
          :onCurrentChangeCancel="handleCurrentChangeCancel"
          :autoLoad=false
          ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "showPoolCreditInfo",
    data() {
      return{
          columns : [
            {
              type: "radio",
              title: " ",
              width: 60,
              hiddenCol: false
            },
            {
              type: "index",
              key: "numOrder",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center",
              hiddenCol: false
            },
            {
              title: "票据池编号",
              key: "poolNo",
              hiddenCol: false
            },
            {
              title: "池名称",
              key: "poolName",
              hiddenCol: false
            },
            {
              title: "客户号",
              key: "custNo",
              hiddenCol: false,
              ellipsis: false
            },
            {
              title: this.$t('m.i.common.custName'),
              key: "custName",
              hiddenCol: false,
              ellipsis: false
            },
            {
              title: "客户账号",
              key: "custAcctNo",
              hiddenCol: false,
              ellipsis: false
            },
            {
              title: "签约协议编号",
              key: "agreementNo",
              hiddenCol: false,
              ellipsis: false
            },
            {
              title: "保证金账号",
              key: "billBailAcctNo",
              hiddenCol: false,
              ellipsis: false
            },
            {
              title: "授信额度",
              key: "creditLimitAmt",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let creditLimitAmt = formatNumber(params.row.creditLimitAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: creditLimitAmt
                  }
                }, creditLimitAmt);
              }
            },
            {
              title: "票据质押额度",
              key: "inPoolAmt",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let inPoolAmt = formatNumber(params.row.inPoolAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: inPoolAmt
                  }
                }, inPoolAmt);
              }
            },
            {
              title: "保证金额度",
              key: "bailBalance",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let bailBalance = formatNumber(params.row.bailBalance, 2, ",");
                return h("span", {
                  domProps: {
                    title: bailBalance
                  }
                }, bailBalance);
              }
            },
            {
              title: "已用票据池额度",
              key: "usedCreditAmt",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let usedCreditAmt = formatNumber(params.row.usedCreditAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: usedCreditAmt
                  }
                }, usedCreditAmt);
              }
            },
            {
              title: "可用票据池额度",
              key: "doAmt",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let doAmt = formatNumber(params.row.doAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: doAmt
                  }
                }, doAmt);
              }
            }
          ],
          formItem : {
            custNo: "",
            batchId: "",
          },
          currentSelectRow : null,
      }
      
    },
    props: {
      poolCreditInfoWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "查询池信息"
      },
      poolCreditInfoParams: {
        type: Object,
        default: {
          dataUrl: "",
          custNo: "",
          batchId: "",
        }
      }
    },
    comments: {},
    watch: {
      poolCreditInfoWin(val) {
        if (val) {
          this.formItem.custNo = this.poolCreditInfoParams.custNo;
          this.formItem.batchId = this.poolCreditInfoParams.batchId;
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempPoolCreditInfoWin: {
        get() {
          return this.poolCreditInfoWin;
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
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      onCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("poolCreditInfoWinClose", "");
      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("poolCreditInfoChange", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      }
    }
  };
</script>

<style scoped>

</style>
