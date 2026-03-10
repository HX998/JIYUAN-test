<!--首页-系统日期-->
<template>
  <div class="h-state-info">
    <div class="h-company clearfix">
      <h-icon name="jigou" class=""></h-icon>
      <p>{{custAppName}}</p>
    </div>
    <ul class="h-stste-list">
      <li>
        <span>系统</span>
        <label>{{this.$moment(workDate, "YYYYMMDD").format("YYYY-MM-DD")}} ({{getDictValueFromMap(this.dictMap, "SysStatusCode", sysStatus)}})</label>
      </li>
      <li v-if="busiClassify==='1' || busiClassify==='4' || busiClassify==='5'">
        <span>ECDS</span>
        <label>{{this.$moment(ecdsSysDate, "YYYYMMDD").format("YYYY-MM-DD")}} ({{getDictValueFromMap(this.dictMap, "EcdsSysStsCode", ecdsSysStatus)}})</label>
      </li>
      <li  v-if="busiClassify !== '5'">
        <span>CPES</span>
        <label>{{this.$moment(cpesSysDate, "YYYYMMDD").format("YYYY-MM-DD")}} ({{getDictValueFromMap(this.dictMap, "SysSts", cpesSysStatus)}})</label>
      </li>
    </ul>
  </div>
</template>

<script>
  import { post, getParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "stateInfo",
    data() {
      return {
        custAppName: "",
        workDate: window.sessionStorage.getItem("workDate"),
        sysStatus: window.sessionStorage.getItem("sysStatus"),
        ecdsSysDate: 0,
        ecdsSysStatus: "",
        cpesSysDate: 0,
        cpesSysStatus: "",
        dictMap: new Map()
      };
    },
    props: {
      busiClassify: {//是否直连模式界面
        type: String,
        default: "1"
      }
    },
    methods: {
      initInfo() {
        let isShowMainindex = window.sessionStorage.getItem("isShowMainindex");
        if (isShowMainindex === "1") {
          this.getDictListByGroups("SysStatusCode,EcdsSysStsCode,SysSts").then(res => {
            this.dictMap = res.get("map");
          });

          if (this.busiClassify === "1" || this.busiClassify === "4" || this.busiClassify==="5") {
            post({}, "/ecds/getEcdsSysStatus").then(res => {
              if (res) {
                if (res.data.retCode == "000000") {
                  this.ecdsSysDate = res.data.retData.sysDt;
                  this.ecdsSysStatus = res.data.retData.sysStatus;
                }
              }
            });
          }
          if(this.busiClassify!=="5"){
            post({}, "/shcpe/cpes/systemStatus/getCpesSysStatus").then(res => {
              if (res) {
                if (res.data.retCode == "000000") {
                  this.cpesSysDate = res.data.retData.currentSysDt;
                  this.cpesSysStatus = res.data.retData.currentSysStatus;
                }
              }
            });
          }

          getParamValuesByKeys("sm.config.cust_app_name").then(res => {
            let custAppName = res["sm.config.cust_app_name"];
            if (custAppName === "" || custAppName == null || custAppName == undefined) {
              this.custAppName = "恒生银行股份有限股份有限公司";
            } else {
              this.custAppName = custAppName;
            }
          });
        }
      }
    },
    mounted() {
      this.initInfo();
    }
  };
</script>

<style scoped>

</style>
