<!--承销管理-认购结果登记-认购结果登记详情-->
<template>
  <div>
    <h-msg-box v-model="tempstdUnderwriteResultDetailWin" :maximize="true" :mask-closable="false" @on-close="stdUnderwriteResultDetailWinClose"
               width="800" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span >认购结果登记详情</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <std-underwrite-result-detail-form-item :addForm="addOrEditForm" :batchParams="batchParams"></std-underwrite-result-detail-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" v-if="batchParams.flowStatus=='STD040'" @click="stdUnderwriteResultDetailWinClose()" >{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" v-else @click="stdUnderwriteResultDetailWinClose()" >{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" v-if="batchParams.flowStatus=='STD040'" @click="submit()"  >{{$t('m.i.common.submit')}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, formatNumber, accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdUnderwriteResultDetail",
    components: {
      StdUnderwriteResultDetailFormItem: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdUnderwriteResultDetailFormItem" */"@/views/bizViews/bs/corpstdbill/underwrite/stdUnderwriteResultDetailFormItem")
    },
    data() {
      return {
        batchId: "",
        addOrEditForm: {
          id:"",
          legalNo:"",
          memberId:"",
          batchNo:"",
          baseAssetType:"",
          stdProductName:"",
          stdProductShortName:"",
          stdProductNo:"",
          creationAmt:"",
          creationTerm:"",
          purchaseResult:"",
          financeRatePct:"",
          totalCollectAmt:"",
          financeMaxRatePct:"",
          financeMinRatePct:"",
          financeRateCheckFlag:"0"
        },
        purchaseResultList:[]
      };
    },
    props: {
      stdUnderwriteResultDetailWin: {
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
      }
    },
    computed: {
      tempstdUnderwriteResultDetailWin: {
        get() {
          return this.stdUnderwriteResultDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdUnderwriteResultDetailWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.purchaseResultList = this.batchParams.purchaseResultList;
              this.queryObjById();
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
        let url = "/bs/corpstdbill/underwrite/stdUnderwriteResultReg/func_findStdCreationById";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.legalNo = obj.legalNo;
              this.addOrEditForm.memberId = obj.memberId;
              this.addOrEditForm.batchNo = obj.batchNo;
              this.addOrEditForm.baseAssetType = obj.baseAssetType;
              this.addOrEditForm.stdProductName = obj.stdProductName;
              this.addOrEditForm.stdProductShortName = obj.stdProductShortName;
              this.addOrEditForm.stdProductNo = obj.stdProductNo;
              this.addOrEditForm.creationAmt = obj.creationAmt === null ? "" : formatNumber(obj.creationAmt, 2, ",");
              this.addOrEditForm.creationTerm = obj.creationTerm;
              this.addOrEditForm.purchaseResult = obj.purchaseResult;
              this.addOrEditForm.financeRatePct = obj.financeRatePct;
              this.addOrEditForm.totalCollectAmt = obj.totalCollectAmt === null ? "" : formatNumber(obj.totalCollectAmt, 2, ",");
              this.addOrEditForm.financeMaxRatePct = obj.financeMaxRatePct;
              this.addOrEditForm.financeMinRatePct = obj.financeMinRatePct;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      stdUnderwriteResultDetailWinClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.batchId="";
        this.addOrEditForm.financeRateCheckFlag = "0";
        this.$emit("stdUnderwriteResultDetailWinClose", "");
      },
      //提交信息
      submit() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            //创设结果
            let purchaseResult=this.addOrEditForm.purchaseResult;
            //创设规模
            let creationAmt=this.addOrEditForm.creationAmt;
            //收款总额
            let totalCollectAmt=this.addOrEditForm.totalCollectAmt;
            if(creationAmt-totalCollectAmt <= 0){
              this.$msgTip.error(this, { info: "收款总额(元)必须小于产品规模(元)"});
              return;
            }
            let url = "/bs/corpstdbill/underwrite/stdUnderwriteResultReg/func_commitStdUnderwriteResult";
            //若创设结果为创设失败，提示“请确认当前标票电票账户已从中国票据系统中解绑，否则会导致退票失败！”选择确认，继续提交；选择取消，终止操作；
            if(purchaseResult == "PR02"){
              this.$hMsgBox.confirm({
                title: "确认要继续提交吗?",
                content: "请确认当前标票电票账户已从中国票据系统中解绑，否则会导致退票失败！",
                onOk: () => {
                  this.sendPost(this.addOrEditForm, url);
                }
              });
            }else {
              //创设成功
              post(this.addOrEditForm, url).then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    if (msg) {
                      this.$hMsgBox.confirm({
                        title: "确认要继续提交吗?",
                        content: msg,
                        onOk: () => {
                          this.addOrEditForm.financeRateCheckFlag = "1";
                          this.sendPost(this.addOrEditForm, url);
                        }
                      });
                    }else {
                      this.$msgTip.success(this);
                      this.stdUnderwriteResultDetailWinClose();
                    }
                  }else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          }
        })
      },
      //提交请求
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.stdUnderwriteResultDetailWinClose();
            }else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
