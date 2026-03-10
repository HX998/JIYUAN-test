<!--创设业务-设立管理-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempStdBookKeepingAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">簿记信息新增</span>
        <span v-else-if="batchParams.batchType==='modify'">簿记信息修改</span>
        <span v-else-if="batchParams.batchType==='show'">簿记信息查看</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <std-book-keeping-form-item :addForm="addOrEditForm" :batchParams="batchParams"></std-book-keeping-form-item>
        </h-form>
        <div>

        </div>
      </div>
      <div slot="footer">
        <h-button type="primary" @click="formSave()">{{$t('m.i.common.save')}}</h-button>
        <h-button type="primary" @click="applySubmit()">{{$t('m.i.common.submit')}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import {post} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdBookKeepingAdd",
    components: {
      StdBookKeepingFormItem: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdBookKeepingFormItem" */"@/views/bizViews/bs/corpstdbill/underwrite/stdBookKeepingFormItem")
    },
    data() {
      return {
        batchId: "",
        addOrEditForm: {
          id: "",
          legalNo: "",
          memberId: "",
          batchNo: "",
          flowStatus: "",
          stdProductName: "",
          stdProductShortName: "",
          stdProductNo: "",
          creationAmt: "",
          priceType: "",
          purchaseResult: "",
          purchaseDt: "",
          minPurchaseAmt: "",
          steppedUpBasisAmt: "",
          minPurchasePrice: "",
          creationPrice: "",
          sellEmail: "",
          sellLinkMan: "",
          sellPhone: ""
        },
      };
    },
    props: {
      stdBookKeepingAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
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
      tempStdBookKeepingAddOrEditWin: {
        get() {
          return this.stdBookKeepingAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdBookKeepingAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            if (this.batchParams.batchType === "add") {
              this.queryObjById();
            }
            if (this.batchParams.batchType === "modify" || this.batchParams.batchType === "show") {
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
      //根据批次Id查询信息
      queryObjById() {
        let params = {id: this.batchId};
        let url = "/bs/corpstdbill/underwrite/stdBookKeepingApply/func_findStdBookKeepingById";
        post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                this.addOrEditForm.id = obj.id;
                this.addOrEditForm.legalNo = obj.legalNo;
                this.addOrEditForm.memberId = obj.memberId;
                this.addOrEditForm.batchNo = obj.batchNo;
                this.addOrEditForm.flowStatus = obj.flowStatus;
                if (obj.stdProductName) {
                  this.addOrEditForm.stdProductName = obj.stdProductName;
                }
                if (obj.stdProductShortName) {
                  this.addOrEditForm.stdProductShortName = obj.stdProductShortName;
                }
                if (obj.stdProductNo) {
                  this.addOrEditForm.stdProductNo = obj.stdProductNo;
                }
                this.addOrEditForm.creationAmt = obj.creationAmt === null ? "" : obj.creationAmt;
                if (obj.priceType) {
                  this.addOrEditForm.priceType = obj.priceType;
                }
                if (obj.purchaseResult) {
                  this.addOrEditForm.purchaseResult = obj.purchaseResult;
                }
                this.addOrEditForm.purchaseDt = obj.purchaseDt === null ? "" : obj.purchaseDt.toString();
                this.addOrEditForm.minPurchaseAmt = obj.minPurchaseAmt === null ? "" : obj.minPurchaseAmt;
                this.addOrEditForm.steppedUpBasisAmt = obj.steppedUpBasisAmt === null ? "" : obj.steppedUpBasisAmt;
                this.addOrEditForm.minPurchasePrice = obj.minPurchasePrice === null ? "" : obj.minPurchasePrice;
                this.addOrEditForm.creationPrice = obj.creationPrice === null ? "" : obj.creationPrice;

                if (obj.sellEmail) {
                  this.addOrEditForm.sellEmail = obj.sellEmail;
                }
                if (obj.sellLinkMan) {
                  this.addOrEditForm.sellLinkMan = obj.sellLinkMan;
                }
                if (obj.sellPhone) {
                  this.addOrEditForm.sellPhone = obj.sellPhone;
                }
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
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.batchId = "";
        this.$emit("stdBookKeepingAddOrEditWinClose", "");
      },

      //保存信息
      formSave() {
        this.saveBatch();
      },
      saveBatch(optType) {
        if (optType) {
          this.addOrEditForm.buttonName = optType;
        }
        this.saveBatchFunc(res => {
          if (optType) {
            this.triggerClickEvent(optType);
            this.addOrEditForm.buttonName = "";
          } else {
            this.$msgTip.success(this);
          }
        });
      },
      saveBatchFunc(callback) {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let creationAmt = this.addOrEditForm.creationAmt;
            let minPurchaseAmt = this.addOrEditForm.minPurchaseAmt;
            if (creationAmt <= 0) {
              this.$msgTip.error(this, { info: "产品规模(元)必须大于0(元)"});
              return;
            }
            if (minPurchaseAmt <= 0) {
              this.$msgTip.error(this, { info: "认购金额下限(元)必须大于0(元)"});
              return;
            }
            let url = "/bs/corpstdbill/underwrite/stdBookKeepingApply/func_editStdBookKeeping";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let retData = res.data.retData;
                if (retCode === "000000") {
                  this.batchId = retData.id;
                  this.queryObjById();
                  callback();
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
      //按钮事件触发保存
      triggerClickEvent(optType) {
        if (optType === "commitApply") {//提交申请
          this.applySubmitCallback();
        }
      },
      //申请提交
      applySubmit() {
        this.saveBatch("commitApply");
      },
      applySubmitCallback() {
        if (this.batchId) {
          let params = {id: this.batchId};
          let url = "/bs/corpstdbill/underwrite/stdBookKeepingApply/func_commitStdBookKeeping";
          this.sendPost(params, url, res => {
            this.handleClose();
          });
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData.erroMsg) {
                this.$msgTip.error(this, {info: res.data.retData.erroMsg});
              } else {
                this.$msgTip.success(this);
                callback();
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
