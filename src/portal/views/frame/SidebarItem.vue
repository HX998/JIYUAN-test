<template>
  <div class="selfMenu">
    <template v-for="(item, index) in routes">
      <!-- 无hidden,无children,无path   为  空节点 -->
      <h-menu-item :name = "String(item.id)" class="empty-menu" v-if="!item.hidden && !item.children && !item.path">
        <span>{{ item.title }}</span>
      </h-menu-item>
      <!-- 无hidden,children长度为0,无path   为  空节点 -->
      <h-menu-item :name = "String(item.id)" class="empty-menu" v-else-if="!item.hidden && item.children && item.children.length == 0 && !item.path">
        <span>{{ item.title }}</span>
      </h-menu-item>
      <!-- 无hidden,无children,有path   为  link跳转节点 -->
      <!-- <router-link v-if="!item.hidden && !item.children && item.path" :to="item.path" @click.native="handleGotoPage($event, item)"> -->
        <h-menu-item :name = "String(item.id)" v-if="!item.hidden && !item.children && item.path"  @click.native="handleGotoPage($event, item)">
          <span>{{ item.title }}</span>
        </h-menu-item>
      <!-- </router-link>  -->
      <!-- 无hidden,children长度为0,有path   为  link跳转节点 -->
      <!-- <router-link v-else-if="!item.hidden && item.children && item.children.length == 0 && item.path" :to="item.path" > -->
        <h-menu-item :name = "String(item.id)" v-else-if="!item.hidden && item.children && item.children.length == 0 && item.path" @click.native="handleGotoPage($event, item)">
          <span>{{ item.title }}</span>
        </h-menu-item>
      <!-- </router-link> -->
      <!-- 无hidden,children长度大于0   为   目录 -->
      <h-submenu :name="String(item.id)" v-else-if="!item.hidden && item.children && item.children.length > 0" :key="item.id">
        <template slot="title">
          <h-icon name="arrow-right-list" color="#8e9092" class="menu-icon"></h-icon>
          <span>{{ item.title }}</span>
        </template>
        <!-- 遍历children，且child没有hidden -->
        <template v-for="(child, i) in item.children" v-if="!child.hidden" >
          <!-- 继续递归遍历 -->
          <sidebar-item class="menu-indent nest-menu" :routes="[child]" @add-menu-items="addMenuItems"></sidebar-item>
        </template>
      </h-submenu>
    </template>
  </div>
</template>
<script>
  import { handleGotoPage, post } from "@/api/bizApi/commonUtil";

  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      }
    },
    data () {
      return {
        colorArray: ['rgb(230, 80, 20)','rgb(66, 175, 117)','rgb(1, 189, 234)','#9B30FF','#EEAD0E','#ff6600','#B03060','#FFFF00']
      }
    },
    methods: {
      handleGotoPage ($event, item) {
          //对接模式下，提交菜单id到后台获取嵌入菜单真实地址
        if(item.path === "/embed/embedMenuMain") {
          post({ code: item.id }, "joinbbep/authority/dockAuthority/func_getBbepMenuPathByBbepMenuId").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$store.dispatch("setCurEmbedMenu", {
                  connectMode: "embed",
                  findId: item.id,
                  id: item.path.substring(item.path.lastIndexOf("\/") + 1, item.path.length),
                  parentId: item.parentId,
                  name: item.title,
                  path: item.path,
                  embedPath: res.data.retMsg
                });
                handleGotoPage(this, 'sidebar', Object.assign(item, { connectMode: "embed", embedPath: res.data.retMsg }));
              }else{
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          handleGotoPage(this, 'sidebar', item);
        }

        let view = {
          findId: item.id,
          id: item.path.substring(item.path.lastIndexOf('\/')+1,item.path.length),
          name: item.title,
          path: item.path
        };
        this.$store.dispatch("setActiveMenuName", view);
        if (!!item.id) {
          this.$emit("add-menu-items", item.id.toString(), item.title);
        }
      },
      addMenuItems(curMenu, curMenuName) {
        this.$emit("add-menu-items", curMenu, curMenuName);
      }
    },
    mounted(){
      // let menuItem = document.getElementsByClassName('menu-icon')
      // let tempNum = 0
      // for(let i=0;i<menuItem.length;i++){
      //   tempNum = Math.floor(Math.random()*this.colorArray.length)
      //    menuItem[i].style.color = this.colorArray[tempNum]
      // }
    }
  }
</script>
