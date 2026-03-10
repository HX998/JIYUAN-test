<template>
  <div>
    <h-form :model="transFormItem" ref="transFormItem"></h-form>
    <h-datagrid
      :columns="transFormColumns"
      :auto-load="false"
      highlight-row
      url="/pc/btrc/trans/func_pagingQueryBillTransInfo"
      :bindForm="transFormItem"
      ref="transFormDatagrid"
    ></h-datagrid>
  </div>
</template>

<script>
import { on, getDictValueFromMap } from "@/api/bizApi/commonUtil";


export default {
  name: "TransHis",
  data() {
    return {
      transFormItem : {
        billId: "",
        billRangeStart: "",
        billRangeEnd: ""
      },
      transFormColumns : [
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          align: "center",
          hiddenCol: false
        },

        {
          title: this.$t("m.i.common.id"),
          key: "id",
          hiddenCol: true,
          align: "center"
        },
        {
          title: this.$t("m.i.common.transName"),
          key: "transName",
          align: "center",
        },
        {
          title: this.$t("m.i.pc.transType"),
          key: "transType",
          align: "center",
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"TransTypeCode",params.row.transType);
            return h("span", dictValue);
          }
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          align: "center",
        },
        {
          title: this.$t("m.i.pc.transFromName"),
          key: "transFromName",
          align: "center",
        },
        {
          title:this.$t("m.i.pc.transFromBankNo"),
          key: "transFromBankNo",
          hiddenCol: false,
          align: "center",
        },
        {
          title:this.$t("m.i.pc.transFromRemark"),
          key: "transFromRemark",
          hiddenCol: false,
          align: "center",
        },
        {
          title: this.$t("m.i.pc.transToName"),
          key: "transToName",
          align: "center",
        },
        {
          title: this.$t("m.i.pc.transToBankNo"),
          key: "transToBankNo",
          align: "center"
        },
        {
          title:this.$t("m.i.pc.transToRemark"),
          key: "transToRemark",
          hiddenCol: false,
          align: "center",
        },
        {
          title: this.$t("m.i.pc.transStartDt"),
          key: "transStartDt",
          align: "center",
          render: (h, params) => {
            if (null != params.row.transStartDt && "" !== params.row.transStartDt && 0 !== params.row.transStartDt) {
              let dttm = this.$moment(params.row.transStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", dttm);
            }else{
              return h("span", "");
            }
          }
        },
        {
          title: this.$t("m.i.pc.transEndDt"),
          key: "transEndDt",
          align: "center",
          render: (h, params) => {
            if (null != params.row.transEndDt && "" !== params.row.transEndDt && 0 !== params.row.transEndDt) {
              let dttm = this.$moment(params.row.transEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", dttm);
            }else{
              return h("span", "");
            }
          }
        },
        {
          title: this.$t("m.i.pc.transStatusName"),
          key: "statusCode",
          align: "center",
          sortable: true,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"TransStatusCode",params.row.statusCode);
            return h("span", dictValue);
          }
        },
        {
          title: this.$t("m.i.pc.transBusiStatus"),
          key: "transBusiStatus",
          align: "center",
          sortable: true,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"TransBusiStatusCode",params.row.transBusiStatus);
            return h("span", dictValue);
          }
        },
        {
          title: this.$t("m.i.common.dealPrcMsg"),
          key: "errorMsg",
          align: "center",
          sortable: true
        }
      ],
    };
  },
  props: {
    dictMap: {
      type: Map
    }
  },
  methods: {
    handleSearch(billId, billRangeStart, billRangeEnd) {
      if(typeof billId !== "undefined" && billId != "" && billId != null){
        this.transFormItem.billId = billId;
        this.transFormItem.billRangeStart = billRangeStart;
        this.transFormItem.billRangeEnd = billRangeEnd;
        this.$nextTick(() => {
          this.$refs.transFormDatagrid.dataChange(1);
        });
      }else{
        this.$msgTip.info(this, { info: "票据ID为空" });
        this.$nextTick(() => {
          this.$refs.transFormDatagrid.$refs.gridContent.handleResize();
        });
      }
    }
  }
};
</script>
