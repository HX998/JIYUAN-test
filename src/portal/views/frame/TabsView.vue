<template>
  <div class="tabs-view-container" ref="scrollCon" @DOMMouseScroll.prevent.stop="handlescroll"
       @mousewheel.prevent.stop="handlescroll">
    <div class="tag-homepage">
      <template v-if="isIE">
        <span class="tabs-view" ref="tagsPage">
          <h-icon name="home" @click.left.native.stop.prevent="openViewTabs($event, ieMainTag)"></h-icon>
        </span>
      </template>
      <router-link v-else class="tabs-view" :to="homepageView.path" :name="homepageView.name" ref="tagsPage">
        <h-icon name="home"></h-icon>
      </router-link>
    </div>
    <div v-if="tagBodyOverflow" ref="scrollLeft" class="tags-scroll-left-btn" @click="tagScrollLeft">
      <h-icon name="return" size="12"></h-icon>
    </div>
    <div ref="scrollBody" class="tags-inner-scroll-body">
      <div ref="scrollContent" class="tags-scroll-content" :style="{left: tagBodyLeft + 'px'}">
        <template v-if="isIE">
          <template v-for="(tag, index) in Array.from(iframeList)">
            <h-tag closable v-if="index > 0" :style="{zIndex: Array.from(iframeList).length - index}" :name="tag.name"
                   :color="isActive(tag.path, index)? 'active' : 'default'"
                   @on-close='closeViewTabs($event, tag, index)'
                   @click.left.native.stop.prevent="openViewTabs($event, tag)"
                   @click.right.native.stop.prevent="closeChoice($event, tag, index)" ref="tagsPageOpened" :key="index">
              {{tag.name}}
            </h-tag>
          </template>
        </template>
        <template v-else>
          <router-link class="tabs-view" v-for="(tag, index) in Array.from(visitedViews)" :to="{ path: tag.path, query: tag.connectMode === 'embed' ? { embedPath: tag.embedPath.substring(tag.embedPath.indexOf('url')).split('=')[1] } : {}}"
                       :key="tag.path + index" v-if="index > 0">
            <h-tag closable :style="{zIndex: Array.from(visitedViews).length - index}" :name="tag.name"
                   :color="isActive(tag.connectMode === 'embed' ? tag.embedPath.substring(tag.embedPath.indexOf('url')).split('=')[1] : tag.path, index, tag.connectMode)? 'active' : 'default'" @on-close='closeViewTabs($event, tag, index)'
                   @click.right.native.stop.prevent="closeChoice($event, tag, index)" ref="tagsPageOpened">
              {{tag.name}}
            </h-tag>
          </router-link>
        </template>

      </div>
    </div>
    <div v-if="tagBodyOverflow" ref="scrollRight" class="tags-scroll-right-btn" @click="tagScrollRight">
      <h-icon name="enter" size="12"></h-icon>
    </div>
    <ul class="h-tag-close-tip" :style="styles" v-clickoutside="handleHide">
      <li class="h-tag-close-tip-item" @click.stop.prevent="handleCloseCurrent()">
        <span>关闭当前选项卡</span>
      </li>
      <li class="h-tag-close-tip-item" @click.stop.prevent="handleCloseAll()">
        <span>关闭全部选项卡</span>
      </li>
      <li class="h-tag-close-tip-item" @click.stop.prevent="handleCloseOther()">
        <span>关闭当前以外选项卡</span>
      </li>
      <li class="h-tag-close-tip-item" @click.stop.prevent="handleRefresh()" v-if="LOCAL_CONFIG.isRefresh">
        <span>刷新当前页面</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import { mapGetters } from "vuex";
  import HTag from "@/components/HTag.vue";
  import clickoutside from "@/directive/clickoutside";

  export default {
    data() {
      return {
        menusType: window.sessionStorage.getItem("menusType"),
        tabsViewLimit: this.LOCAL_CONFIG.TABS_VIEW_LIMIT,
        limit: 100,
        styles: {},
        curTag: {},
        sideWidth: 0,
        topHeight: 0,
        tagBodyLeft: 0,
        refsTag: [],
        // 目录条超出容器框标识
        tagBodyOverflow: false,
        ieMainTag: {
          path: "/mainIndex",
          name: "首页",
          id: "mainIndex"
        }
      };
    },
    directives: {
      clickoutside
    },
    components: {
      HTag
    },
    watch: {
      $route: {
        handler(to, from) {
          if(to.path !== "/embed/embedMenuMain") {
            if(window.sessionStorage.getItem("isTransfer") === "0") {
              this.$hMsgBox.remove();
              this.$msgTip.remove(this);
            }
            this.addViews();
            this.$nextTick(() => {
              this.refsTag = this.$refs.tagsPageOpened;
              if (this.refsTag && this.refsTag.length > 0) {
                this.refsTag.forEach((item, index) => {
                  if (to.name === "首页") {
                    window.sessionStorage.removeItem('curMenu');
                    return;
                  }
                  if (to.name === item.name) {
                    let curMenu = {
                      title: to.meta.title,
                      id: to.meta.findId,
                      parentId: to.meta.parentId,
                      path: to.meta.path
                    };
                    window.sessionStorage.setItem("curMenu", JSON.stringify(curMenu));
                    let tag = this.refsTag[index].$el;
                    this.moveToView(tag);
                    this.moveBtnShow();
                  }
                });
              }
            });
          }
        },
        deep: true,
      },
      curEmbedMenu:{
        handler(val, old) {
          this.addViews(val);
          this.$nextTick(() => {
            this.refsTag = this.$refs.tagsPageOpened;
            if (this.refsTag && this.refsTag.length > 0) {
              this.refsTag.forEach((item, index) => {
                if (val.name === "首页") {
                  window.sessionStorage.removeItem('curMenu');
                  return;
                }
                if (val.name === item.name) {
                  let curMenu = {
                    title: val.name,
                    id: val.findId,
                    parentId: val.parentId,
                    path: val.path,
                    embedPath: val.embedPath,
                    connectMode: "embed"
                  };
                  window.sessionStorage.setItem("curMenu", JSON.stringify(curMenu));
                  let tag = this.refsTag[index].$el;
                  this.moveToView(tag);
                  this.moveBtnShow();
                }
              });
            }
          });
        },
        deep: true
      }
    },
    computed: {
      visitedViews() {
        let arr = this.$store.state.app.visitedViews.slice(1 - this.limit);
        if (arr[0].name !== "首页") {
          arr.unshift(this.$store.state.app.visitedViews[0]);
        }
        return arr;
      },
      homepageView() {
        //let arr = this.$store.state.app.visitedViews.slice(1 - this.limit)
        //if (arr[0].name !== '首页') {
        //arr.unshift(this.$store.state.app.visitedViews[0])
        //}
        //return arr[0]
        //// return this.$store.state.app.visitedViews[0]
        return { path: "/mainIndex", name: "首页" };
      },
      ...mapGetters([
        "rootPath",
        "activeIndex",
        "menusRoot",
        "menusNoRoot",
        "iframeList",
        "isIE",
        "curEmbedMenu"
      ])
    },
    methods: {
      handleHide() {
        this.styles = {};
        this.curTag = {};
      },
      openViewTabs($event, view) {
        this.$store.dispatch("setCurOpenTag", view);
        this.$store.dispatch("addFrame", view);
      },
      closeViewTabs($event, view, index) {
        $event.preventDefault();
        if (this.isIE) {
          //  将前一个显示
          this.$store.state.app.iframeList[index - 1].isActive = true;
          // ie直接关闭iframe标签
          let frame = document.getElementById(view.id);//获取到iframe对象
          let ifm_container = document.getElementById("appMain");
          if (frame) {
            frame.src = "about:blank";
            try {
              frame.window = null;
              frame.contentWindow.document.write("");
              // frame.contentWindow = null
              CollectGarbage();
              frame.document.write("");
              frame.document.clear();
              frame.src = "";
            } catch (e) {
              console.log(e);
            }
            ifm_container.removeChild(document.getElementById("id" + view.id));
          }
          frame = undefined;
          ifm_container = undefined;
          // 删除iframe
          this.$nextTick(() => {
            this.$store.state.app.iframeList.splice(index, 1);
          });
        }
        //  将前一个显示
        // this.$store.state.app.iframeList[index - 1].isActive = true

        //首页不可被关闭
        this.$store.dispatch("delCurVisitedViews", view);
        // 若页面有缓存，清除当前页面缓存
        if (!this.isIE && this.LOCAL_CONFIG.isRefresh) {
          if (this.$route.meta.isKeepAlive && this.$route.meta.comName) {
            this.$store.dispatch("refreshCurPage", this.$route.meta.comName);
          }
        }
        let isActive = this.isActive(view.connectMode === 'embed' ? view.embedPath.substring(view.embedPath.indexOf('url')).split('=')[1] : view.path, 0, view.connectMode);
        if (!this.isIE && isActive) { //关闭当前打开页面
          let newVisitedView = null;
          if (index > 0 && this.visitedViews.length < index + 1) {//关闭最后一个标签
            newVisitedView = this.visitedViews[index - 1];
            window.sessionStorage.removeItem('curMenu');
            // let newPath = this.visitedViews[index - 1].path;
            // this.$router.push({ path: newPath });
          } else if (index > 0) {
            newVisitedView = this.visitedViews[index];
            // let newPath = this.visitedViews[index].path;
            // this.$router.push({ path: newPath });
          }
          if (newVisitedView.name !== "首页") {
            let curMenu = {
              title: newVisitedView.name,
              id: newVisitedView.findId,
              parentId: newVisitedView.parentId,
              path: newVisitedView.path
            };
            if(newVisitedView.connectMode === "embed") {
              curMenu.connectMode = newVisitedView.connectMode;
              curMenu.embedPath = newVisitedView.embedPath;
            }
            window.sessionStorage.setItem("curMenu", JSON.stringify(curMenu));
          }
          this.$store.dispatch("delMenuItems", { curMenu: view.findId });
          this.$store.dispatch("setActiveMenuName", {});
          if(this.$store.getters.activeIndex !== newVisitedView.activeIndex) {
            this.$store.dispatch('ActiveRootIndex', newVisitedView.activeIndex)
          }
          this.$router.push({ path: newVisitedView.path, query: newVisitedView.connectMode === "embed" ? { embedPath: newVisitedView.embedPath.substring(newVisitedView.embedPath.indexOf("url")).split("=")[1] } : {} });
        }
        this.refsTag = this.$refs.tagsPageOpened;
        // if (this.refsTag && this.refsTag.length > 0) {
        //   setTimeout(() => {
        //     this.refsTag.forEach((item, index) => {
        //       if (this.$route.name === item.name) {
        //         let tag = this.refsTag[index].$el;
        //         this.moveToView(tag);
        //       }
        //     });
        //   }, 1);
        // };
        // setTimeout(() => {
        //   this.moveBtnShow();
        // }, 1);
      },
      addViews(views) {
        if (this.menusType && this.menusType == "1") {
          this.toggleSidebarm();
        }
        if(views) {
          this.$store.dispatch("addVisitedViews", views);
        } else {
          this.$store.dispatch("addVisitedViews", this.$route);
        }
        if (this.$route.meta.isKeepAlive && this.$route.meta.comName) {
          this.$store.dispatch("addRouteKeepAlive", this.$route.meta.comName);
        }
      },
      closeChoice($event, view, index) {
        if (index > 0) {
          this.styles = {
            display: "block",
            top: `${$event.clientY}px`,
            left: `${$event.clientX}px`,
            height: "148px"
          };
          this.curTag = {
            event: $event,
            view: view,
            index: index
          };
        }
      },
      handleCloseCurrent() {
        this.closeViewTabs(this.curTag.event, this.curTag.view, this.curTag.index);
        this.styles = {};
        this.curTag = {};
      },
      handleCloseAll() {
        this.$store.dispatch("delAllVisitedViews", this.curTag.view);
        if (this.LOCAL_CONFIG.isRefresh) {
          this.$store.dispatch("delAllKeepAlive");
        }
        this.$store.dispatch("delAllMenuItems");
        // 跳转至首页
        let newPath = this.visitedViews[0].path;
        this.$router.push({ path: newPath });
        this.styles = {};
        this.curTag = {};
        window.sessionStorage.removeItem('curMenu');
        setTimeout(() => {
          this.moveBtnShow();
        }, 1);
      },
      handleCloseOther() {
        this.$store.dispatch("delOtherVisitedViews", this.curTag.view);
        if (this.LOCAL_CONFIG.isRefresh) {
          if (this.$route.meta.isKeepAlive && this.$route.meta.comName) {
            this.$store.dispatch("delOtherKeepAlive", this.$route.meta.comName);
          }
        }
        let curMenu = {
          title: this.curTag.view.name,
          id: this.curTag.view.findId,
          parentId: this.curTag.view.parentId,
          path: this.curTag.view.path
        };
        if(this.curTag.view.connectMode === "embed") {
          curMenu.connectMode = this.curTag.view.connectMode;
          curMenu.embedPath = this.curTag.view.embedPath;
        }
        window.sessionStorage.setItem("curMenu", JSON.stringify(curMenu));
        this.$store.dispatch("delOtherMenuItems", { curMenu: this.curTag.view.findId });
        this.$store.dispatch("setActiveMenuName", {});
        if(this.$store.getters.activeIndex !== this.curTag.view.activeIndex) {
          this.$store.dispatch('ActiveRootIndex', this.curTag.view.activeIndex)
        }
        // 当前页面非激活时，激活
        let isActive = this.isActive(this.curTag.view.connectMode === 'embed' ? this.curTag.view.embedPath.substring(this.curTag.view.embedPath.indexOf('url')).split('=')[1] : this.curTag.view.path, this.curTag.index, this.curTag.view.connectMode);
        if (!isActive) {
          this.$router.push({ path: this.curTag.view.path, query: this.curTag.view.connectMode === "embed" ? { embedPath: this.curTag.view.embedPath.substring(this.curTag.view.embedPath.indexOf("url")).split("=")[1] } : {} });
        }
        this.styles = {};
        setTimeout(() => {
          this.moveBtnShow();
        }, 1);
      },
      toggleSidebarm() {
        // 服务端返回菜单渲染路由之后无法再用url去切换子系统，使用每个路由中保存rootId，进行切换
        // if (this.$route.path.indexOf(this.menusRoot[this.activeIndex].url) < 0) {
        //   let urlArr = this.$route.path.split('/')
        //   let curUrl ='/' + urlArr[1]
        //   for (let [key, value] of this.menusRoot.entries()) {
        //     if (curUrl === value.url) {
        //       this.$store.dispatch('ActiveRootIndex', key)
        //       return
        //     }
        //   }
        // }
        if (this.$route.meta.rootId != this.menusRoot[this.activeIndex].id) {
          for (let [key, value] of this.menusRoot.entries()) {
            if (this.$route.meta.rootId === value.id) {
              this.$store.dispatch("ActiveRootIndex", key);
              return;
            }
          }
        }
      },
      isActive(path, index, connectMode) {
        let flag = false;
        if(this.isIE) {
          flag = this.$store.state.app.iframeList[index].isActive == true;
        } else if(connectMode === "embed") {
          flag = path === this.$route.query.embedPath;
        } else {
          flag = path === this.$route.path
        }
        return flag;
      },
      handlescroll(e) {
        var type = e.type;
        let delta = 0;
        if (type === "DOMMouseScroll" || type === "mousewheel") {
          delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
        }
        let left = 0;
        if (delta > 0) {
          left = Math.min(0, this.tagBodyLeft + delta);
        } else {
          if (this.$refs.scrollBody.offsetWidth < this.$refs.scrollContent.offsetWidth) {
            if (this.tagBodyLeft < -(this.$refs.scrollContent.offsetWidth - this.$refs.scrollBody.offsetWidth)) {
              left = this.tagBodyLeft;
            } else {
              left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollBody.offsetWidth - this.$refs.scrollContent.offsetWidth);
            }
          } else {
            this.tagBodyLeft = 0;
          }
        }
        this.tagBodyLeft = left;
      },
      moveToView(tag) {
        this.tagBodyOverflow = this.$refs.scrollContent.offsetWidth > this.$refs.scrollBody.offsetWidth;
        if (tag.offsetLeft < -this.tagBodyLeft) {
          // 标签在可视区域左侧
          this.tagBodyLeft = -tag.offsetLeft + 10;
        } else if (tag.offsetLeft + 10 > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + this.$refs.scrollBody.offsetWidth) {
          // 标签在可视区域
          this.tagBodyLeft = Math.min(0, this.$refs.scrollBody.offsetWidth - tag.offsetWidth - tag.offsetLeft - 20);
        } else {
          // 标签在可视区域右侧
          this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollBody.offsetWidth - tag.offsetWidth) + 20);
        }
      },
      moveBtnShow() {
        // 目录条超出容器框则修改标识，显示左右滚动按钮
        this.tagBodyOverflow = this.$refs.scrollContent.offsetWidth > this.$refs.scrollBody.offsetWidth;
      },
      handleRefresh() {
        this.styles = {};
        this.$nextTick(() => {
          setTimeout(() => {
            this.refresh();
          }, 0);
        });
        // this.$destroy() // destroy后 不能缓存了
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
      },
      // 目录条向左侧滚动
      tagScrollLeft() {
        var left = this.tagBodyLeft;
        if (left + 100 < 0) {
          this.tagBodyLeft = left + 100;
        } else {
          this.tagBodyLeft = 0;
        }
      },
      // 目录条向右侧滚动
      tagScrollRight() {
        let left = this.tagBodyLeft;
        if (-(left - 100) < (this.$refs.scrollContent.offsetWidth - this.$refs.scrollBody.offsetWidth)) {
          this.tagBodyLeft = left - 100;
        } else {
          this.tagBodyLeft = -(this.$refs.scrollContent.offsetWidth - this.$refs.scrollBody.offsetWidth) - 20;
        }
      },
      //标签页切换事件
      activeCurrentTag($event, view, index) {
        this.$store.dispatch("setActiveMenuName", {});
        if(this.$store.getters.activeIndex !== view.activeIndex) {
          this.$store.dispatch('ActiveRootIndex', view.activeIndex)
        }
        if(view.connectMode === "embed") {
          this.$store.dispatch("setCurEmbedMenu", {
            connectMode: "embed",
            findId: view.findId,
            id: view.id,
            parentId: view.parentId,
            name: view.name,
            path: view.path,
            embedPath: view.embedPath
          });
        }
      }
    },
    created() {
      if(this.$route.path === "/embed/embedMenuMain") {
        this.addViews(this.curEmbedMenu);
      } else {
        this.addViews();
      }
    },
    mounted() {
      // 右击阻止原生浏览器事件
      document.getElementsByClassName("tabs-view-container")[0].oncontextmenu = function(e) {
        return false;
      };
      this.refsTag = this.$refs.tagsPageOpened;
      if (this.refsTag && this.refsTag.length > 0) {
        setTimeout(() => {
          this.refsTag.forEach((item, index) => {
            if (this.$route.name === item.name) {
              let tag = this.refsTag[index].$el;
              this.moveToView(tag);
            }
          });
        }, 1); // 这里不设定时器就会有偏移bug
      }
      this.moveBtnShow();
    },
    destroyed() {
      this.styles = {};
    }
  };
</script>
