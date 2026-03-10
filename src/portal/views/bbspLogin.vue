<template>
  <div></div>
</template>

<script>
  import { handleAutoLogin } from "@/api/bizApi/handleAutoLogin";
  import { on } from "@/api/bizApi/commonUtil";
  import Vue from "vue";
  import HMsgBox from "@/components/HMsgBox";
  // import msgBoxInstance from "@/utils/msgBoxInstance.js";

  export default {
    name: "bbspLogin",
    created() {
      window.sessionStorage.setItem("isNeedAutoLoad", "1");
      window.sessionStorage.setItem("isRegistMsgBox", "0");
      window.sessionStorage.setItem("isTransfer", "0");
      let hMsgBox = {
        extends: HMsgBox,
        props: {
          transfer: {
            type: Boolean,
            default: false
          },
          top: {
            top: [String, Number],
            default: 10
          },
          scrollable:{
            type: Boolean,
            default: true
          }
        },
        mounted() {
          if(!this.transfer) {
            if(document.querySelector('.window-operate') !== null) {
              this.targetNode = document.querySelector('.window-operate');
            } else {
              this.targetNode = document.querySelector('#appMain').children[0];
            }
          }
        }
      };
      Vue.component("h-msg-box", hMsgBox);
      // Vue.prototype.$hMsgBox = msgBoxInstance;
      this.$messagebox.setTransfer(false);

      let url = decodeURIComponent(this.$route.path);
      if (url.indexOf("//") !== -1) {
        url = url.substr(1);
      }
      let token = decodeURIComponent(this.$route.query.token);
      if (!!this.$route.query.token) {
        let requestInfo = {
          param: { token: token, userNo: this.$route.query.userNo, url: url },
          requestUrl: "/sm/auth/login/securityByToken"
        };
        if (!!this.$route.query.token && !!this.$route.query.userNo) {
          handleAutoLogin(this.$store, this.$router, requestInfo);
        } else {
          if (this.$store.getters.token && this.$store.getters.userInfo != null) { //有token且用户信息不为空，证明已登录
            let isNeedReLogin = this.$route.query.userNo !== this.$store.getters.userInfo.userNo;
            if (isNeedReLogin) {
              handleAutoLogin(this.$store, this.$router, requestInfo);
            } else {
              this.$router.push({ path: url, query: { isNeedKeepAlive: "true" } });
            }
          } else {
            handleAutoLogin(this.$store, this.$router, requestInfo);
          }
        }
      } else if (!!this.$route.query.isNeedKeepAlive) {

      } else {
        this.$hMessage.error("当前会话已失效，请关闭标签后重新打开");
      }
    },
    mounted() {
      if (!!this.$route.query.token && !!this.$route.query.userNo) {
        on(window, "message", this.sendMessage);
      } else if (!this.$route.query.isNeedKeepAlive) {
        on(window, "message", this.sendMessage);
      }
    },
    methods: {
      sendMessage(e) {
        if (!!e.data.url || e.data.url === "") {
          this.$hMsgBox.remove();
          this.$msgTip.remove(this);
          if (this.$store.getters.isNeedReLogin.isRelogin) {
            if (this.$store.getters.isNeedReLogin.msgBoxInstance !== undefined) {
              this.$store.getters.isNeedReLogin.msgBoxInstance.remove();
            }
            this.$store.dispatch("IsNeedReLogin", { isRelogin: false });
            this.$store.dispatch("delAllOpenedList");
            this.$nextTick(() => {
              this.$router.push({ path: "/bbspLogin", query: { isNeedKeepAlive: "true" } });
              this.$hMessage.error("当前会话已失效，请关闭标签后重新打开");
              this.$store.dispatch("ClearTokenAndUser");
            });
            return;
          }
          let url = decodeURIComponent(e.data.url);
          if (url.indexOf("//") !== -1) {
            url = url.substr(1);
          }
          if (window.document.getElementById("appMain") != null) {
            if (this.$route.path !== url && !!e.data.token && !!e.data.userNo) {
              window.document.getElementById("appMain").style.visibility = "hidden";
            } else {
              window.document.getElementById("appMain").style.visibility = "";
            }
          }
          let token = decodeURIComponent(e.data.token);
          if (!!e.data.token && !!e.data.userNo) {//首次加载
            //if (window.LOCAL_CONFIG.isAllKeepAlive) {
            this.$store.dispatch("refreshCurPage", url.substr(url.lastIndexOf("/") + 1));
            this.$nextTick(() => {
              if (this.$route.path === url) {
                this.$router.push({ path: url, query: { token: token, userNo: e.data.userNo, identifiedMenu: (Math.floor((Math.random()*100))).toString() } });
              } else {
                this.$router.push({ path: url, query: { token: token, userNo: e.data.userNo } });
              }
            });
            //}
          } else if (!!e.data.refresh) {//标签刷新
            this.refresh();
          } else if (!!e.data.addTab) {//点击菜单刷新
            // if (window.LOCAL_CONFIG.isAllKeepAlive) {
            if (this.$route.path === url) {
              this.refresh();
            } else {
              this.$store.dispatch("refreshCurPage", url.substr(url.lastIndexOf("/") + 1));
              this.$nextTick(() => {
                if (this.$route.path === url && !!this.$route.query.identifiedMenu) {
                  this.$router.push({ path: url, query: { isNeedKeepAlive: "true", identifiedMenu: this.$route.query.identifiedMenu.toString() } });
                } else {
                  this.$router.push({ path: url, query: { isNeedKeepAlive: "true" } });
                }
              });
            }
            // }
          } else if (!!e.data.closeTab) {//关闭当前标签
            // if (this.LOCAL_CONFIG.isRefresh) {
            //   if (this.$route.meta.isKeepAlive && this.$route.meta.comName) {
            //     this.$store.dispatch("refreshCurPage", url.substr(url.lastIndexOf("/") + 1));
            //   }
            // }
          } else if (!!e.data.closeAllTab) {//关闭全部标签
            this.$store.dispatch("delAllOpenedList");
            this.$nextTick(() => {
              this.$router.push({ path: "/bbspLogin", query: { isNeedKeepAlive: "true" } });
            });
          } else {
            if (this.$route.path === url && !!this.$route.query.identifiedMenu) {
              this.$router.push({ path: url, query: { isNeedKeepAlive: "true", identifiedMenu: this.$route.query.identifiedMenu.toString() } });
            } else {
              this.$router.push({ path: url, query: { isNeedKeepAlive: "true" } });
            }
          }
        }
      },
      refresh() {
        if (this.$route.meta.isKeepAlive && this.$route.meta.comName) {
          this.$route.meta.isKeepAlive = false;
          this.$store.dispatch("refreshCurPage", this.$route.meta.comName);
          this.$nextTick(() => {
            this.$route.meta.isKeepAlive = true;
            this.$store.dispatch("addRouteKeepAlive", this.$route.meta.comName);
          });
        }
      }
    }
  };
</script>
<style type="text/css">
</style>
