<template>
  <div>
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">详细信息</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.common.sysStatus')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"EcdsSysStsCode",formItem.sysStatus)}}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.onlineSettleFlag')}}：</h-col>
              <h-col span="14" class="val">{{
                getDictValueFromMap(this.dictMap,"SettlementMarkCode",formItem.settleMark)}}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.curretSystemDt')}}：</h-col>
              <h-col span="14" class="val">{{formItem.sysDt}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.loginStatus')}}：</h-col>
              <h-col span="14" class="val">{{
                getDictValueFromMap(this.dictMap,"TypeMarkCode",formItem.loginExitResult)}}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.onlineSettleFlagRemark')}}：</h-col>
              <h-col span="14" class="val">{{ formItem.clearOnlineRmrk}}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.nextSystemWorkDt')}}：</h-col>
              <h-col span="14" class="val">{{formItem.nextSysDt}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.orginSystemStatus')}}：</h-col>
              <h-col span="14" class="val">{{
                getDictValueFromMap(this.dictMap,"EcdsSysStsCode",formItem.orgnlSysStatus)}}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.orginSystemDt')}}：</h-col>
              <h-col span="14" class="val">{{formItem.orgnlSysDt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.bigSystemNextDt')}}：</h-col>
              <h-col span="14" class="val">{{ formItem.hvpsNextSysDt}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.batchSwitch')}}：</h-col>
              <h-col span="14" class="val">{{
                getDictValueFromMap(this.dictMap,"EcdsSwitchOnOffCode",formItem.batchTaskSwitch)}}
              </h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
    <div>
      <h-button type="primary" @click="refreshEcdsStatus()">{{$t("m.i.config.refreshCache")}}</h-button>
      <h-button type="primary" @click="ecdsLogin()">{{$t("m.i.common.login")}}</h-button>
      <h-button type="primary" @click="ecdsLoginOut()">{{$t("m.i.common.signOut")}}</h-button>
    </div>
  </div>

</template>

<script>
  import { post, on, off, getDictValueFromMap, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "ecdsStatus",
    data() {
      return {
        formItem: {
          sysStatus: "",
          settleMark: "",
          sysDt: "",
          loginExitResult: "",
          clearOnlineRmrk: "",
          nextSysDt: "",
          orgnlSysStatus: "",
          orgnlSysDt: "",
          hvpsNextSysDt: "",
          batchTaskSwitch: ""
        },
        dictMap: new Map()
      };
    },
    mounted() {
      this.getData();
      getDictListByGroups("SettlementMarkCode,TypeMarkCode,EcdsSysStsCode,EcdsSwitchOnOffCode").then(res => {
        this.dictMap = res.get("map");
      });

      // this.setTimer();
      // if(this.timer){
      //    clearInterval(this.timer);
      // }else{
      //   this.timer = setInterval(() => {
      //     this.getDate();
      //   }, 5000);
      // }
    },
    destroyed() {
      clearInterval(this.timer);
    },
    methods: {
      setTimer() {
        setInterval(() => {
          location.reload(true);
        }, 5000);
      },
      getData() {
        post({}, "shcpe/ecds/mng/ecdsStatus/func_getEcdsStatus").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formItem.sysStatus = res.data.retData.sysStatus;
              this.formItem.settleMark = res.data.retData.settleMark;
              this.formItem.sysDt = res.data.retData.sysDt;
              this.formItem.loginExitResult = res.data.retData.loginExitResult;
              this.formItem.clearOnlineRmrk = res.data.retData.clearOnlineRmrk;
              this.formItem.nextSysDt = res.data.retData.nextSysDt;
              this.formItem.orgnlSysStatus = res.data.retData.orgnlSysStatus;
              this.formItem.orgnlSysDt = res.data.retData.orgnlSysDt;
              this.formItem.hvpsNextSysDt = res.data.retData.hvpsNextSysDt;
              this.formItem.batchTaskSwitch = res.data.retData.batchTaskSwitch;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      refreshEcdsStatus() {
        this.getData();
      },

      ecdsLogin() {
        this.$hMsgBox.confirm({
          title: "ECDS登录",
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.login();
          }
        });
      },
      login() {
        post({ tpMk: "TM00" }, "/shcpe/ecds/mng/ecdsStatus/func_loginInOutEcds").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.shcpe.loginInSuccess") });
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            ththis.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      ecdsLoginOut() {
        this.$hMsgBox.confirm({
          title: "ECDS退出",
          content: this.$t("m.i.common.confirm") + "?<span style='color: red'>【该操作会导致与票交所交易中断，全行无法进行场外票据交易，是否继续执行】</span>",
          onOk: () => {
            this.loginOut();
          }
        });
      },
      loginOut() {
        post({ tpMk: "TM01" }, "/shcpe/ecds/mng/ecdsStatus/func_loginInOutEcds").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.shcpe.loginOutSuccess") });
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
