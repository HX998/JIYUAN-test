<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <h-form :model="formItem" :label-width="120" ref="formItem" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billType')">
            {{format("DraftTypeCode",formItem.billType)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')">
            {{format("CDMedia",formItem.billClass)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pledgorName')+':'">
            {{formItem.custName}}
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pledgorBrchCode')+':'">
            {{formItem.custBrchCode}}
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')+':'">
            {{formItem.applDt}}
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')+':'">
            {{formItem.custMgrNo}}
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pawneeBrchName')+':'">
            {{formItem.brchName}}
          </h-form-item>
        </h-form>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :bindForm="formItem"
            url="/be/trust/unImpawn/unImpawnApply/func_queryUnImpawnApplyBillByIds"
            row-select="true"
            ref="billDatagrid">
            <div slot="toolbar">
            </div>
          </h-datagrid>
    </div>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "unImpawnApplyAudit",
    data() {
      return {
        formItem: {
          batchId: "",
          billIds: "",
          billNo: "",
          billType: "",
          billClass: "",
          custName: "",
          custBrchCode: "",
          applDt: "",
          custMgrNo: "",
          brchName: "",
          billMoney: "",
          dueDt: "",
          acptBankName: "",
          unImpawnRemark: ""
        },
        billColumns: [
          {
            type: "selection",
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
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.unImpawnRemark'),
            key: "unImpawnRemark",
            hiddenCol: false
          }
        ],
        dictMap: new Map(),
        busiType: "",
        showBillInfoWin: false,
        billId: "",
        billNo: ""
      };
    },
    components: {
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    created() {
      this.formItem.batchId = this.batchId;
      this.formItem.billIds = this.listIds;
    },
    mounted() {
      this.getDictListByGroups("CDMedia,DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
      this.init();
    },
    methods: {
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      //  初始化页面
      init() {
        let batchId = this.batchId;
        let url = "";
        if (batchId) {
          url = "/be/trust/unImpawn/unImpawnApply/func_getUnImpawnBatchById";
        } else {
          this.$msgTip.error(this, { info: "批次ID不能为空" });
        }
        post({ id: batchId }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                this.formItem = res.data.retData;
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
