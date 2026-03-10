<!--创设业务-设立管理-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempStdPurchaseCaseDetailAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer">
      <p slot="header">
        <span v-if="detailParams.batchType==='add'">认购价格新增</span>
        <span v-else-if="detailParams.batchType==='modify'">认购价格修改</span>
        <span v-else-if="detailParams.batchType==='show'">认购价格查看</span>
      </p>
      <div>
        <h-form :model="addOrEditDetailForm" :label-width="115" ref="addOrEditDetailForm" cols="2" class="h-form-search">
          <std-purchase-case-detail-form-item :addDetailForm="addOrEditDetailForm" :detailParams="detailParams"></std-purchase-case-detail-form-item>
        </h-form>
        <div>

        </div>
      </div>
      <div slot="footer">
        <h-button type="primary" @click="formSave()">{{$t('m.i.common.confirm')}}</h-button>
        <h-button type="ghost"  @click="handleClose()">{{$t('m.i.common.cancle')}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import {post} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdPurchaseCaseDetailAdd",
    components: {
      StdPurchaseCaseDetailFormItem: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdPurchaseCaseDetailFormItem" */"@/views/bizViews/bs/corpstdbill/underwrite/stdPurchaseCaseDetailFormItem")
    },
    data() {
      return {
        batchId: "",
        id:"",
        addOrEditDetailForm: {
          id: "",
          legalNo: "",
          memberId: "",
          bkId:"",
          batchId: "",
          flowStatus: "",
          purchasePrice: "",
          purchaseAmt: "",
          placingAmt: ""
        },
      };
    },
    props: {
      stdPurchaseCaseDetailAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      detailParams: {
        type: Object,
        default() {
          return {};
        }
      },
      dictMap: {
        type: Map,
        required: true
      },
    },
    computed: {
      tempStdPurchaseCaseDetailAddOrEditWin: {
        get() {
          return this.stdPurchaseCaseDetailAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdPurchaseCaseDetailAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.detailParams.batchId;
            this.id = this.detailParams.id;
            if (this.detailParams.batchType === "add") {
              this.queryObjById();
            }
            if (this.detailParams.batchType === "modify" || this.detailParams.batchType === "show") {
              this.queryObjById();
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      },
      id(val){
        this.id = val;
      }
    },
    methods: {
      //根据批次Id查询信息
      queryObjById() {
        let params = {id: this.id};
        let url = "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_findStdPurchaseCaseDetailById";
        post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                this.addOrEditDetailForm.id = obj.id;
                this.addOrEditDetailForm.legalNo = obj.legalNo;
                this.addOrEditDetailForm.memberId = obj.memberId;
                this.addOrEditDetailForm.bkId = obj.bkId;
                this.addOrEditDetailForm.batchId = obj.batchId;
                this.addOrEditDetailForm.flowStatus = obj.flowStatus;
                this.addOrEditDetailForm.purchasePrice = obj.purchasePrice === null ? "" : obj.purchasePrice;
                this.addOrEditDetailForm.purchaseAmt = obj.purchaseAmt === null ? "" : obj.purchaseAmt;
                this.addOrEditDetailForm.placingAmt = obj.placingAmt === null ? "" : obj.placingAmt;
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          }
        );
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditDetailForm.resetFields();
        this.addOrEditDetailForm.id = "";
        this.batchId = "";
        this.id = "";
        this.$emit("stdPurchaseCaseDetailAddOrEditWinClose", "");
      },

      //保存信息
      formSave() {
        this.$refs["addOrEditDetailForm"].validate(valid => {
          this.addOrEditDetailForm.batchId=this.batchId;
          if (valid) {
            let url = "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_editStdPurchaseCaseDetail";
            post(this.addOrEditDetailForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let retData = res.data.retData;
                if (retCode === "000000") {
                  this.handleClose();
                } else {
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
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
