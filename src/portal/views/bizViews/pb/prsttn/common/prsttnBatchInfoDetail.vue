<template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.hldrAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.hldrAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.hldrName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.hldrName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.entrustAdverseBankName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.drweBankName  }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.entrustAdverseBankNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.drweBankNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.postCode')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.drwePostCode }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.address')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.drweAddr }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.EMSCode')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.emsNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row v-if="viewDetailForm.prsttnType=='ST02' && (this.btnAuth.postFee === undefined ? false
            : this.btnAuth.postFee.isShow)">
              <h-col span="9" class="label">邮电费：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.postFee }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { post, formatNumber} from "@/api/bizApi/commonUtil";
  export default {
    name: "prsttnBatchInfoDetail",
    data() {
      return {
        tempIsShow : false,
        viewDetailForm : {
          hldrAcctNo: "",
          hldrName: "",
          drweBankName: "",
          drweBankNo: "",
          drwePostCode: "",
          drweAddr: "",
          emsNo: "",
          totalCount: "",
          totalAmt: "",
          postFee: "",
          prsttnType: ""
        },
        btnAuth: {}
      }
    },
    watch:{
      isShow(val) {
        if(val === true) {
          this.tempIsShow = true;
        }
        if(val === false) {
          // this.viewDetailForm = {};
          this.tempIsShow = false;
        }
      },
      isQuery(val) {
        if (val === true && this.batchId !== "") {
          this.viewDetailForm = {};
          this.getBatchInfo();
        }
      }
    },
    props : {
      batchNo: "",
      batchId:"",
      prodNo: "",
      isShow: "",
      isQuery:"",
      funcNo:"",
    },
    // mounted() {
    //   getDictListByGroups("DraftTypeCode,PayType").then(res => {
    //     this.dictMap = res.get("map");
    //   });
    //
    // },
    methods: {
      getBatchInfo() {
        //获取批次详细信息
        post({ id: this.batchId ,curFuncNo: this.funcNo}, "/pb/prsttn/common/prsttnBatchInfoDetail/func_getPrsttnBatchByConditon").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm = res.data.retData;
              if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
              }
              if (this.viewDetailForm.postFee !== null && this.viewDetailForm.postFee !== "") {
                this.viewDetailForm.postFee = formatNumber(this.viewDetailForm.postFee, 2, ',')
              }
              this.$emit("envelopeNoShow", res.data.retData);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      getPostFeeAuth(){
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id, loading: false }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }

        });
      },
    },
    created() {
      this.getPostFeeAuth();
    }
  };
</script>

<style scoped>

</style>
