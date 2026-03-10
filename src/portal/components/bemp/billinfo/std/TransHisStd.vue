<template>
  <div>
    <h-form :model="transFormItem" ref="transFormItem"></h-form>
    <h-datagrid
      :columns="transFormColumns"
      :auto-load="false"
      highlight-row
      url="/bs/corpstdbill/common/pageQueryTransInfo"
      :bindForm="transFormItem"
      ref="transFormDatagrid"
    ></h-datagrid>
  </div>
</template>

<script>
import { on, getDictValueFromMap } from "@/api/bizApi/commonUtil";


export default {
  name: "TransHisStd",
  data() {
    return {
      transFormItem : {
        billId: "",
        listId:"",
        creationId:""
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
          key: "transStatusName",
          align: "center",
          sortable: true,
        },
        {
          title: this.$t("m.i.common.failReason"),
          key: "failReason",
          align: "center",
          sortable: true,
          render: (h, params) => {
            debugger;
            if((params.row.failType === "031" || params.row.failType === "033" || params.row.failType === "035" || params.row.failType === "036") && params.row.returnCode !== "PE1I0000"){
              if (null != params.row.returnMsg && "" !== params.row.returnMsg && "0" !== params.row.returnMsg) {
                return h("span", params.row.returnMsg);
              }else{
                return h("span", "");
              }
            }else {
              if (null != params.row.failReason && "" !== params.row.failReason && "0" !== params.row.failReason) {
                let dictValue = this.getDictValueFromMap(this.dictMap,"EcdsRefuseCode",params.row.failReason);
                if(null != dictValue && "" !== dictValue){
                  return h("span", {
                    domProps: {
                      title: dictValue
                    }
                  }, dictValue);
                }else {
                  return h("span", params.row.failReason);
                }
              }else{
                return h("span", "");
              }
            }
          }
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
    handleSearch(billId,listId,creationId) {
      this.transFormItem.billId = billId;
      this.transFormItem.listId = listId;
      this.transFormItem.creationId = creationId;
      this.$nextTick(() => {
        this.$refs.transFormDatagrid.dataChange(1);
      });
    }
  }
};
</script>
