<!--匿名点击-买入申请-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempRebuyApplyAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增报价</span>
        <span v-else-if="batchParams.batchType==='modify'">修改报价</span>
        <span v-else-if="batchParams.batchType==='show'">查看报价</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <anony-apply-form-item :addForm="addOrEditForm" :batchParams="batchParams"></anony-apply-form-item>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()">保存</h-button>
        </div>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyApplyAdd",
    components: {
      AnonyApplyFormItem: () => import(/* webpackChunkName: "be/market/anonyclick/rebuy/anonyApplyFormItem" */"@/views/bizViews/be/market/anonyclick/rebuy/anonyApplyFormItem")
    },
    data() {
      return {
        batchId: "",
        addOrEditForm: {
          id: "",
          busiType: "",
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
      rebuyApplyAddOrEditWin: {
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
      tempRebuyApplyAddOrEditWin: {
        get() {
          return this.rebuyApplyAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      rebuyApplyAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            if (this.batchParams.batchType === "add") {
              this.batchParams.isSpeedChange=true;
              this.batchParams.isTenorVarietiesChange=true;
              this.queryObjById();
            }
            if (this.batchParams.batchType === "modify" || this.batchParams.batchType === "show") {
              this.batchParams.isSpeedChange=false;
              this.batchParams.isTenorVarietiesChange=false;
              this.queryObjById();
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/be/market/anonyclick/rebuy/rebuyApply/func_findEditAnonyRebuyBatch";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.busiType = obj.busiType;
              this.addOrEditForm.buyBrchName = obj.buyBrchName;
              this.addOrEditForm.buyTraderName = obj.buyTraderName;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.billClass = obj.billClass;
              this.addOrEditForm.ratePct = obj.ratePct;
              this.addOrEditForm.buyBackTotalAmt = obj.buyBackTotalAmt=== null ?"":obj.buyBackTotalAmt.toString();
              if(obj.tenorDays){
                this.addOrEditForm.tenorDays = obj.tenorDays;
              }
              this.addOrEditForm.tenorVarieties = obj.tenorVarieties;
              this.addOrEditForm.clearType = obj.clearType;
              this.addOrEditForm.settleMode = obj.settleMode;
              this.addOrEditForm.clearSpeed = obj.clearSpeed;
              this.addOrEditForm.settleDt = obj.settleDt === null ? "" : obj.settleDt.toString();
              if(obj.dueSettleDt){
                this.addOrEditForm.dueSettleDt = obj.dueSettleDt === null ? "" : obj.dueSettleDt.toString();
              }
              this.addOrEditForm.creditMainBrchClass = obj.creditMainBrchClass;
              this.addOrEditForm.workDate = obj.workDate;
              this.addOrEditForm.maxTenorDays = obj.maxTenorDays;
              this.addOrEditForm.minRate = obj.minRate;
              this.addOrEditForm.maxRate = obj.maxRate;
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
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.$emit("rebuyApplyAddOrEditWinClose", "");
      },

      //保存批次信息
      formSave() {
          this.saveBatch();
      },
      saveBatch(optType) {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let minRate=this.addOrEditForm.minRate?this.addOrEditForm.minRate:0;
            let maxRate=this.addOrEditForm.maxRate?this.addOrEditForm.maxRate:100;
            let minRateBoolean=this.addOrEditForm.ratePct-minRate<0;
            let maxRateBoolean=this.addOrEditForm.ratePct-maxRate>0;
            if(minRateBoolean){
              this.$msgTip.error(this, { info: "回购利率必须大于等于票交所最小利率参数:"+minRate});
              return;
            }
            if(maxRateBoolean){
              this.$msgTip.error(this, { info: "回购利率必须小于等于票交所最大利率参数:"+maxRate});
              return;
            }
            let maxTenorDays=this.addOrEditForm.maxTenorDays?this.addOrEditForm.maxTenorDays:365;
            if(parseInt(this.addOrEditForm.tenorDays)>parseInt(maxTenorDays)){
              this.$msgTip.error(this, { info: "回购期限不能大于"+maxTenorDays +"天"});
              return;
            }
            this.addOrEditForm.settleDt = this.addOrEditForm.settleDt.replace(/-/g, "");
            this.addOrEditForm.dueSettleDt = this.addOrEditForm.dueSettleDt.replace(/-/g, "");
            let url = "/be/market/anonyclick/rebuy/rebuyApply/func_editAnonyRebuyApply";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleClose();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

    }
  };
</script>

<style scoped>

</style>
