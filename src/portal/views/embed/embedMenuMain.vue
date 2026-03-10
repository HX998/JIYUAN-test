<!--用于其他系统界面嵌入，如bbep-->
<template>
  <div class="layout">
    <iframe :id="embedMenu.findId" frameborder=0 scrolling=auto :src=embedMenu.embedPath :height="deviceHeight"
            width="100%" marginwidth="0" marginheight="0" style="display:block;"></iframe>
  </div>
</template>

<script>
  import { on, off } from "@/api/bizApi/commonUtil";
  import { mapGetters } from "vuex";

  export default {
    name: "embedMenuMain",
    data() {
      return {
        deviceHeight: 500,
        embedMenu: {}
      };
    },
    props: ["url"],
    methods: {
      setIframeHeight() {
        let appObj = document.getElementsByClassName("app-main");
        let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
        this.deviceHeight = document.documentElement.clientHeight - appOffsetTop;
      }
    },
    mounted() {
      const that = this;
      that.setIframeHeight();
      on(window, "resize", this.setIframeHeight);
    },
    watch: {
      curEmbedMenu: {
        handler(val, old) {
          this.embedMenu = val;
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      ...mapGetters([
        "curEmbedMenu"
      ])
    },
    beforeDestroy() {
      off(window, "resize", this.setIframeHeight);
    },
    activated() {
      on(window, "resize", this.setIframeHeight);
    },
    deactivated() {
      off(window, "resize", this.setIframeHeight);
    }
  };
</script>

<style scoped>

</style>
