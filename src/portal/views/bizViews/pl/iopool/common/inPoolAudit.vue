<!--入池审批明细-->
<template>
  <div>
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempIsShow">
      <h-col span="24">
        <div>
          <io-pool-batch-detail :batchDetailParams="inPoolBillParams" ref="ioPoolBatchDetail"></io-pool-batch-detail>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="billManagerColumns"
            url="/bm/audit/prodAuditMain/func_pagingQueryInPoolBill"
            highlightRow
            :bindForm="billManagerFormItem"
            :onSelectChange="billManagerHandleRowClick"
            :rowSelect="true"
            ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "inPoolAudit",
    components: {

    },
    data() {
      return {
        billManagerFormItem : {
          batchId: "",
          listIds: ""
        },
        billManagerColumns : [
          {
            type: "selection",
            key: "multiSelect",
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.inPoolBillParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankAddr"),
            key: "drweBankAddr",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectList : [],
        inPoolBillParams : {
          id: "",
          listIds: "",
          accountType: "",
          dictMap: "",
          batchInfoUrl: ""
        },
        showBillInfoWin : false,
        billId : "",
        billNo : "",
      };
    },
    props: {
      isShow: {
        type: Boolean,
        default() {
          return false;
        }
      },
      listIds: "",
      batchId: ""
    },
    computed: {
      tempIsShow: {
        get() {
          return this.isShow;
        },
        set() {
        }
      }
    },
    created() {
      this.billManagerFormItem.batchId = this.batchId;
      this.billManagerFormItem.listIds = this.listIds;
      this.inPoolBillParams.id = this.batchId;
      this.inPoolBillParams.listIds = this.listIds;
      this.inPoolBillParams.accountType = "inPool";
      this.inPoolBillParams.batchInfoUrl = "/bm/audit/prodAuditMain/func_getInPoolBatchDtoByConditon";
      this.getDictListByGroups("DraftTypeCode,Yon").then(res => {
        this.dictMap = res.get("map");
        this.inPoolBillParams.dictMap = this.dictMap;
      });
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.ioPoolBatchDetail.getIoPoolBatchInfo("audit");
      });
    },
    watch: {
      isShow(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.batchId;
          this.billManagerFormItem.listIds = this.listIds;
          this.inPoolBillParams.id = this.batchId;
          this.inPoolBillParams.listIds = this.listIds;
          this.inPoolBillParams.accountType = "inPool";
          this.inPoolBillParams.dictMap = this.dictMap;
          this.inPoolBillParams.batchInfoUrl = "/bm/audit/prodAuditMain/func_getInPoolBatchDtoByConditon";
          this.$nextTick(() => {
            this.$refs.ioPoolBatchDetail.getIoPoolBatchInfo("audit");
          });
        }
      }
    },
    methods: {
      //行选中
      billManagerHandleRowClick(arr) {
        this.currentSelectList = arr;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
