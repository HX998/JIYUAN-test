<template>
  <div class="layout">
    <div class="login-identify-wrap">
      <div class="identifying">
        <h-spin size="large"></h-spin>
      </div>
      <div v-if="showFlag == '0'">清稍等，系统正在处理...</div>
      <div v-if="showFlag == '1'">跳转到首页...</div>
      <div v-if="showFlag == '2'">跳转到登录页...</div>
    </div>
  </div>
</template>
<script>
import { post, handleGotoPage, getBusinessParameter } from "@/api/bizApi/commonUtil.js";
import hMsgBox from "h_ui/dist/lib/MsgBox";
export default {
  name: "test",
  data() {
    let options = {}
    //是否显示页面 0-加载中，1-跳转到首页，2-登录页
    options.showFlag = "0";
    return options;
  },
  watch: {},
  methods: {
    showMainindex() {
      return post({ paramKey: "is_show_home_page" }, "/sm/auth/systemParameter/findSystemParameter").then(res => {
        let isShowMainindex = "1";
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            if (res.data.retMsg === "0") {
              isShowMainindex = "0";
            }
          }
        }
        window.sessionStorage.setItem("isShowMainindex", isShowMainindex);
      });
    },
  },
  mounted() {

  },
  created() {
    let obj = {userNo:this.$route.query.tellerno,securityToken:this.$route.query.secretData,
      ip:this.$route.query.ip1};

    this.$store.dispatch("singlesignOnLogin", obj).then((res) => {
      console.log("ye:",res);
      if(res.retCode==="000000"){
        this.showMainindex().then(() => {
          if (res.retCode == "000000") {
            if (window.isIE) {
              /* 跳转至ie特有页面indexcommon */
              this.$router.push({ path: "/indexcommon" });
            } else {
              this.$router.push({ path: "/mainIndex" });
            }
          } else {
            hMsgBox.warning({
              title: "提示",
              content: res.retMsg,
              onOk: () => {
                //this.$router.push({ path: '/login' })
                location.reload();
              }
            })
          }        });
          this.showFlag="1"
        }else{
          this.$router.push({ path: '/login' })
          this.showFlag="2"
        }
    })
  }
};
</script>
<style>
.login-identify-wrap{
  width: 350px;
  height: 150px;
  position: fixed;
  left: 50%;
  top: 50%;
  margin: -75px 0 0 -175px;
  text-align: center;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 25px 0;
}
.login-identify-wrap .identifying{
  width: 50px;
  height: 60px;
  margin: 0 auto;
}
</style>
