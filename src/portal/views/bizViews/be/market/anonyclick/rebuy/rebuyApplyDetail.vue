<!--匿名点击-买入申请-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempRebuyApplyDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span>查看报价</span>
      </p>
      <div class="text-body">
        <anony-apply-detail :anonyApplyDetailWin="rebuyApplyDetailWin" :viewDatailForm="rebuyApplyDetailForm" :batchParams="batchParams" ></anony-apply-detail>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyApplyDetail",
    components: {
      AnonyApplyDetail: () => import(/* webpackChunkName: "be/market/anonyclick/rebuy/anonyApplyDetail"*/"@/views/bizViews/be/market/anonyclick/rebuy/anonyApplyDetail")
    },
    data() {
      return {
        batchId: "",
        rebuyApplyDetailForm: {
          id: "",
          busiType: "",
          batchNo: "",
          quoteNo: "",
          buyBrchName: "",
          buyTraderName: "",
          billType: "",
          billClass: "",
          rate: "",
          buyBackTotalAmt: "",
          tenorDays:"",
          tenorVarieties:"",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          settleDt: "",
          dueSettleDt:"",
          creditMainBrchClass: ""
        }

      };
    },
    props: {
      rebuyApplyDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempRebuyApplyDetailWin: {
        get() {
          return this.rebuyApplyDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      rebuyApplyDetailWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.queryObjById();
          });
        }
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = this.batchParams.batchUrl;
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.rebuyApplyDetailForm.id = obj.id;
              this.rebuyApplyDetailForm.busiType = obj.busiType;
              this.rebuyApplyDetailForm.batchNo = obj.batchNo;
              this.rebuyApplyDetailForm.quoteNo = obj.quoteNo;
              this.rebuyApplyDetailForm.buyBrchName = obj.buyBrchName;
              this.rebuyApplyDetailForm.buyTraderName = obj.buyTraderName;
              this.rebuyApplyDetailForm.billType = obj.billType;
              this.rebuyApplyDetailForm.billClass = obj.billClass;
              this.rebuyApplyDetailForm.ratePct = obj.ratePct;
              this.rebuyApplyDetailForm.buyBackTotalAmt = obj.buyBackTotalAmt=== null ?"":obj.buyBackTotalAmt.toString();
              this.rebuyApplyDetailForm.tenorDays = obj.tenorDays;
              this.rebuyApplyDetailForm.tenorVarieties = obj.tenorVarieties;
              this.rebuyApplyDetailForm.clearType = obj.clearType;
              this.rebuyApplyDetailForm.settleMode = obj.settleMode;
              this.rebuyApplyDetailForm.clearSpeed = obj.clearSpeed;
              this.rebuyApplyDetailForm.settleDt = obj.settleDt === null ? "" : obj.settleDt.toString();
              this.rebuyApplyDetailForm.dueSettleDt = obj.dueSettleDt === null ? "" : obj.dueSettleDt.toString();
              this.rebuyApplyDetailForm.creditMainBrchClass = obj.creditMainBrchClass;

            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.rebuyApplyDetailForm.id = "";
        this.$emit("rebuyApplyDetailWinClose", "");
      },
    }
  };
</script>

<style scoped>

</style>
