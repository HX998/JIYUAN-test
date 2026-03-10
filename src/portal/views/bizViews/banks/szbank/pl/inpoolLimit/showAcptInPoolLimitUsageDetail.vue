<template>
  <h-msg-box maximize v-model="tempShowUsageDetailWin" width="1000" @on-close="handleClose">
    <p slot="header">
      <span>已入池名单总额度</span>
    </p>
    <div class="layout">
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <div class="text-wrap mb-10">
              <div class="text-body">
                <h-row :gutter="8">
                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">在池笔数：</h-col>
                      <h-col span="15" class="val">{{ this.viewDatailForm.totalNum }}</h-col>
                    </h-row>
                  </h-col>
                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">在池总额度(元)：</h-col>
                      <h-col span="15" class="val">{{ this.viewDatailForm.totalUsedAmt}}</h-col>
                    </h-row>
                  </h-col>
                </h-row>
              </div>
            </div>
          </div>
        </h-col>
      </h-row>
    </div>

    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name:"showAcptInPoolLimitUsageDetail",
    data(){
      return {
        viewDatailForm:{
          totalNum:"",
          totalUsedAmt:""
        }
      }
    },
    props:{
      acptTopBankNo:{
        type: String,
        default() {
          return "";
        }
      },
      showUsageDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      searchUrl:{
        type:String,
        default(){
          return "";
        }
      }
    },
    methods:{
      handleClose(){
        this.$emit("showUsageDetailWinClose", "");
      }
    },
    watch: {
      showUsageDetailWin(flag) {
        if (flag == true) {
          let url="";
          if (this.searchUrl) {
            url=this.searchUrl;
          } else {
            url="/banks/szbank/pl/inpoolLimit/acptInPoolLimit/func_queryAcptInpoolLimitUsedInfo"
          }
          post({ code: this.acptTopBankNo }, url).then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null) {
                this.viewDatailForm.totalNum= res.data.retData.totalNum?res.data.retData.totalNum:0;
                this.viewDatailForm.totalUsedAmt= res.data.retData.totalUsedAmt?formatNumber(res.data.retData.totalUsedAmt):"0.00";
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        }
      }
    },
    computed: {
      tempShowUsageDetailWin: {
        get() {
          return this.showUsageDetailWin;
        },
        set() {
        }
      }
    }
  }
</script>
