<!-- 首页上方工具栏-左侧logo -->
<template>
  <div class="h-topbar-logo">
    <span class="h-topbar-logo-img"><img :src="logoUrl" height="30"/></span>
    <span class="h-topbar-logo-span">{{this.productName}}</span>
    <span class="h-topbar-logo-version">{{this.productVersion}}</span>
  </div>
</template>

<script>
  import { getParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "topBarLogo",
    props: {
      logoUrl: ""
    },
    data() {
      return {
        productName: "票据交易管理平台",
        productVersion: "v5.0",
      }
    },
    created() {
      getParamValuesByKeys("bemp.product_name,bemp.product_version").then(res => {
        this.productName = res["bemp.product_name"] ? res["bemp.product_name"] : this.$t("m.i.topBar.busiInfraStru");
        this.productVersion = res["bemp.product_version"] ? res["bemp.product_version"] : this.$t("m.i.topBar.version");
      });
    }
  };
</script>

<style scoped>

</style>
