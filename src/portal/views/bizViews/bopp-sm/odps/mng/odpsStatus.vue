<template>
  <div>
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">详细信息</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('s.i.odps.currentSysStatus')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"OdpsSysStsCode",formItem.currentSysStatus)}}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('s.i.odps.currentSysDt')}}：</h-col>
              <h-col span="14" class="val">{{formItem.currentSysDt}}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('s.i.odps.loginStatus')}}：</h-col>
              <h-col span="14" class="val">{{
                getDictValueFromMap(this.dictMap,"OdpsLoginStatus",formItem.loginStatus)}}
              </h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('s.i.odps.orgnlSysStatus')}}：</h-col>
              <h-col span="14" class="val">{{
                getDictValueFromMap(this.dictMap,"OdpsSysStsCode",formItem.orgnlSysStatus)}}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('s.i.odps.orgnlSysDt')}}：</h-col>
              <h-col span="14" class="val">{{formItem.orgnlSysDt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('s.i.odps.nextSysDt')}}：</h-col>
              <h-col span="14" class="val">{{formItem.nextSysDt}}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
    <div>
      <h-button type="primary" @click="refreshOdpsStatus()">{{$t("s.i.odps.refresh")}}</h-button>
      <h-button type="primary" @click="odpsLogin()">{{$t("s.i.odps.login")}}</h-button>
      <h-button type="primary" @click="odpsLoginOut()">{{$t("s.i.odps.signOut")}}</h-button>
    </div>
  </div>

</template>

<script>
  import { post, on, off, getDictValueFromMap, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "odpsStatus",
    data() {
      return {
        formItem: {
          currentSysStatus: "",
          currentSysDt: "",
          loginStatus: "",
          orgnlSysStatus: "",
          orgnlSysDt: "",
          nextSysDt: ""
        },
        dictMap: new Map()
      };
    },
    mounted() {
      this.getData();
      getDictListByGroups("OdpsLoginStatus,OdpsSysStsCode").then(res => {
        this.dictMap = res.get("map");
      });
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
        post({}, "/sm/odps/mng/odpsStatus/func_getOdpsStatus").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formItem.currentSysStatus = res.data.retData.currentSysStatus;
              this.formItem.currentSysDt = this.$moment(res.data.retData.currentSysDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.formItem.loginStatus = res.data.retData.loginStatus;
              this.formItem.orgnlSysStatus = res.data.retData.orgnlSysStatus;
              this.formItem.orgnlSysDt = this.$moment(res.data.retData.orgnlSysDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.formItem.nextSysDt = this.$moment(res.data.retData.nextSysDt, "YYYYMMDD").format("YYYY-MM-DD");
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      refreshOdpsStatus() {
        this.getData();
      },

      odpsLogin() {
        this.$hMsgBox.confirm({
          title: "ODPS登录",
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.login();
          }
        });
      },
      login() {
        post({ tpMk: "TM00" }, "/sm/odps/mng/odpsStatus/func_loginInOutOdps").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("s.i.odps.loginInSuccess") });
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      odpsLoginOut() {
        this.$hMsgBox.confirm({
          title: "ODPS退出",
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.loginOut();
          }
        });
      },
      loginOut() {
        post({ tpMk: "TM01" }, "/sm/odps/mng/odpsStatus/func_loginInOutOdps").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("s.i.odps.loginOutSuccess") });
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
