<template>
  <div>
    <div :class="['h-sidebar-leftfixed', {'h-sidebar-leftfixed-normal' : normalStateFlag}]"
         @mouseleave="normalStateFlag = false">
      <div class="h-sidebar-leftfixed-item">
        <h-menu :active-name="activeIndex" mode="vertical" class="h-sidebar-main" style="width:50px;">
          <template v-for="(item, index) in menusRoot">
            <h-menu-item :name='index' v-show="Array.isArray(item.children)"
                         @click.native.prevent.stop="activeSidebar(index)"
                         :key="item.name">
              <h-icon :name="sysIcon(index)" size="26" color="#fff"></h-icon>
              <span>{{item.title}}</span>
            </h-menu-item>
          </template>
        </h-menu>
      </div>
    </div>
    <div v-show="childRoute != null && childRoute.length >= 0" class="h-sidebar-rightmenu">
      <div class="h-sidebar-sysroot">
        <h-icon :name="'android-wifi'" class="menu-icon"></h-icon>
        <span>{{title}}</span>
      </div>
      <div class="h-sidebar-menu">
        <h-menu mode='vertical'
                theme='dark'
                :accordion="isAccordion"
                :collapse="!sidebar.opened"
                :active-name="curMenu"
                :open-names="openMenu"
                width='220px'
                @scroll.native.prevent.stop="handleScroll"
                @on-open-change="menuOpenChange"
                ref="sideBarMenu">
          <sidebar-item :routes="childRoute" @add-menu-items="addMenuItems" ref="sidebarItemRef"></sidebar-item>
        </h-menu>
      </div>
      <div class="h-sidebar-catalogue">
        <div class="h-sidebar-catalogue-body">
          <div class="expandIcon" @click.prevent.stop="expandSiderbar">
            <h-icon name="t-b-leftside" size="12" color="#a4adbf"></h-icon>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  /* mapGetters工具函数会将store中的getter映射到局部计算属性中 */
  /* 使用对象扩展操作符把getter混入到computed中 */
  import { mapGetters } from "vuex";
  import SidebarItem from "./SidebarItem";
  import Cookies from "js-cookie";

  export default {
    data() {
      return {
        isAccordion: false,
        childRoute: [],
        search: "",
        searchText: "请输入...",
        notFoundText: "没有匹配页面",
        menusType: Cookies.get("menusType"),
        curMenu: "",
        openMenu: [],    //当前菜单展开的Submenu的name集合
        covertMenu: {},
        title: "",
        normalStateFlag: false, // 强制常态显示标识符
        currentScrollTop: 0,
        allOpenMenu: {}      //所有菜单各自展开的Submenu的name集合，用于切换时保持展开/收缩状态
      };
    },
    components: {
      SidebarItem
    },
    computed: {
      ...mapGetters([
        "activeIndex",
        "menusRoot",
        "menusNoRoot",
        "searchRoute",
        "sidebar",
        "activeMenuName",
        "menuItems",
        "curEmbedMenu"
      ]),
      isSidebarExpand() {
        return this.sidebar.opened;
      }
    },
    watch: {
      $route: {
        handler(to, from) {
          if(to.path !== "/embed/embedMenuMain") {
            if (!!to.meta.findId) {
              this.locationMenu(to.meta);
            } else {
              this.curMenu = "";
              this.openMenu = [];
              this.$refs.sideBarMenu.$el.scrollTop = 0;
            }
          }
        },
        deep: true
      },
      curEmbedMenu:{
        handler(val, old) {
          if (!!val.findId) {
            this.locationMenu(val);
          } else {
            this.curMenu = "";
            this.openMenu = [];
            this.$refs.sideBarMenu.$el.scrollTop = 0;
          }
        },
        deep: true
      },
      activeIndex() {
        this.computChildRoute();
      },
      childRoute: {
        handler(val) {
          this.curMenu = "";
          // this.openMenu = [];
          this.covertMenu = {};
          this.rebuildMenu(val);
          this.openMenu = this.allOpenMenu[this.activeIndex] ? this.allOpenMenu[this.activeIndex] : [];
          if (this.openMenu.length > 0) {
            this.$nextTick(() => {
              this.$refs.sideBarMenu.updateOpened();
            });
          }
        },
        deep: true
      }
    },
    methods: {
      getScrollTop(el, index) {
        let extralTop = el ? el.offsetTop : 0;
        if (index < this.openMenu.length) {
          index += 1;
          let offsetTop = this.getScrollTop(el.offsetParent, index);
          extralTop += offsetTop;
        }
        return extralTop;
      },
      locationMenu(menuInfo) {
        this.$nextTick(() => {
          this.curMenu = menuInfo.findId ? menuInfo.findId.toString() : "";
          // this.openMenu = [];
          let currentOpenMenu = this.findUp(menuInfo.findId);
          this.openMenu = Array.from(new Set([...this.openMenu, ...currentOpenMenu]));
          if (Object.keys(this.activeMenuName).length === 0) {
            this.$nextTick(() => {
              let currentScrollTop = 0;
              let sideBarMenuObj = this.$refs.sideBarMenu.$el;
              let selectedMenuObj = sideBarMenuObj.querySelector(".h-menu-item-active .h-menu-item-selected");
              if (selectedMenuObj != null) {
                currentScrollTop = this.getScrollTop(selectedMenuObj, 1)
              }
              this.$store.dispatch("addMenuItems", {
                curMenu: menuInfo.findId,
                curMenuName: menuInfo.connectMode === "embed" ? menuInfo.name : menuInfo.title,
                scrollTop: currentScrollTop
              });
              setTimeout(() => {
                for (let i = 0; i < this.menuItems.length; i++) {
                  if (this.menuItems[i].curMenu == menuInfo.findId) {
                    if (this.menuItems[i].scrollTop < this.$refs.sideBarMenu.$el.clientHeight) {
                      this.$refs.sideBarMenu.$el.scrollTop = 0;
                    } else {
                      this.$refs.sideBarMenu.$el.scrollTop = this.menuItems[i].scrollTop;
                    }
                    break;
                  }
                }
              }, 400);
            });
          } else {
            this.$store.dispatch("setActiveMenuName", {});
          }
        });
      },
      sysIcon(ind) {
        let iconMap = {
          0: "x-t-g-l-z-x-t",
          1: "y-w-g-l-z-x-t",
          2: "g-g-j-y-z-x-t",
          3: "d-g-j-y-z-x-t",
          4: "pulic",
          5: "p-l-c-l-z-x-t",
          6: "pool",
          7: "t-b-time",
        };
        return iconMap[ind];
      },
      handleSearch(path) {
        this.search = "";
        this.$refs.select.setQuery("");
        this.$nextTick(() => {
          setTimeout(() => {
            this.$router.push(path);
          }, 300);
        });
      },
      expandSiderbar() {
        this.$store.dispatch("ToggleSidebar");
      },
      computChildRoute() {
        let activeIndex = this.activeIndex ? this.activeIndex : 0
        this.title = this.menusRoot.length === 0 ? "票据所" : this.menusRoot[activeIndex].title;
        if (this.menusType && this.menusType == "1" && this.menusRoot.length > 0) { //多个子系统
          this.childRoute = this.menusRoot[activeIndex].children;
        } else { // 单个系统
          this.childRoute = this.menusNoRoot;
        }
      },
      rebuildMenu(menus) {
        if (menus && menus.length > 0) {
          for (let menu of menus) {
            this.covertMenu[menu.id] = menu.parentId;
            if (menu.children && menu.children.length > 0) this.rebuildMenu(menu.children);
          }
        }
      },
      findUp(id) {
        let openid = this.covertMenu[id];
        let openMenu = [];
        while (openid) {
          openMenu.push(openid);
          openid = this.covertMenu[openid];
        }
        return openMenu;
      },
      activeSidebar(index) {
        if (index >= 0) {
          this.$store.dispatch("ActiveRootIndex", index);
        }
        this.normalStateFlag = true;
        // let item = this.menusRoot[this.activeIndex]
        // 防止页面刷新时会跳转根页面
        // if(this.$route.matched[0].path !== item.url) {
        //   this.$router.push({path: item.url})
        // }
      },
      handleScroll(e) {
        this.currentScrollTop = e.currentTarget.scrollTop;
      },
      addMenuItems(curMenu, curMenuName) {
        this.$store.dispatch("addMenuItems", {
          curMenu: curMenu,
          curMenuName: curMenuName,
          scrollTop: this.currentScrollTop
        });
      },
      menuOpenChange(openMenu) {
        if (this.activeIndex !== undefined) {
          this.allOpenMenu[this.activeIndex] = openMenu;
        }
      }
    },
    created() {
      this.computChildRoute();
      // if (this.childRoute && this.childRoute.length > 0) {
      //   this.openMenu = [this.childRoute[0].id];
      // }
      // 兼容IE中路由无法跳转问题
      let that = this;
      if ("-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style) {
        // detect it's IE11
        window.addEventListener("hashchange", function(event) {
          var currentPath = window.location.hash.slice(1);
          if (that.$route.path !== currentPath) {
            that.$router.push(currentPath);
          }
        }, false);
      }
    },
    beforeDestroy() {
      let that = this;
      window.addEventListener("resize", () => {
        var currentPath = window.location.hash.slice(1);
        if (that.$route.path !== currentPath) {
          that.$router.push(currentPath);
        }
      });
    }
  };
</script>
