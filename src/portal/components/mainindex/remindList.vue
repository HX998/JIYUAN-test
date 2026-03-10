<!--首页-提醒列表-->
<template>
  <div class="h-event-wrap">
    <div class="h-event-title">
      <span class="h-event-icon"><h-icon name="bell"></h-icon></span>
      <h2 class="h-event-type">提醒</h2>
      <span class="h-event-num" v-if="remindList.length > 0">(<span>{{remindCount}}</span>)</span>
      <h-icon :class="['h-event-refresh', {'h-event-loading' : remindLoadingFlag}]" name="shuaxin" @on-click="getItemOptions('Remind',false)"></h-icon>
    </div>
    <div class="h-remind-title">
      <strong class="h-remind-0">序号</strong>
      <strong class="h-remind-l">提醒消息</strong>
      <strong class="h-remind-c">总笔数</strong>
      <strong class="h-remind-r">总金额(元)</strong>
    </div>
    <div class="h-event-content" :style="{height: eventConHeight + 'px'}">
      <ul v-if="remindList.length > 0" ref="remindList">
        <li v-for="(item,index) in remindList" :key="index">
          <div class="h-event-item" v-if="item.total > 0">
            <a @click="handleGotoPage($event,item)">
              <span class="h-remind-0">{{index + 1}}</span>
              <span class="h-remind-l" :title="item.pendRemark">{{item.pendRemark}}</span>
              <span class="h-remind-c">{{item.total}}</span>
              <span class="h-remind-r">{{formatAmt('Remind', item.totalAmt)}}</span>
            </a>
          </div>
        </li>
      </ul>
      <div v-else class="h-event-free">暂无提醒</div>
    </div>
  </div>
</template>

<script>
  import {post, handleGotoPage, formatNumber, getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";
  import {mapGetters} from "vuex";

  export default {
    name: "remindList",
    data() {
      return {
        remindList: [],
        remindLoadingFlag: false,  // 提醒列表正在加载标识
        eventConHeight: 320,       // 底部待办事项框高度
        isAutoProceedPendItemQuery: "1",  // 用户登录后系统是否自动发起首页提醒查询：1-是（默认） 0-否
        isAutoContinueQuery: false,  // 是否自动再次查询
        cutBackToHomePageIsAutoRefresh: "0" // 切回首页后提醒/待办任务是否自动进行刷新：1-是 0-否（默认）
      };
    },
    computed: {
      ...mapGetters([
        "menusRoot"
      ]),
      remindCount() {
        let remindNum = 0;
        for (let i = 0; i < this.remindList.length; i++) {
          remindNum += Number.parseInt(this.remindList[i].total == null ? 0 : this.remindList[i].total);
        }
        return remindNum;
      }
    },
    watch: {
      "$route.path": function (val) {
        let isShowMainindex = window.sessionStorage.getItem("isShowMainindex");
        if (val === "/mainIndex" && isShowMainindex === "1") {
          if (this.cutBackToHomePageIsAutoRefresh === "1") {
            setTimeout(() => {
              this.getItemOptions("Remind", false);
            }, 200);
          }
        }
      }
    },
    methods: {
      getItemOptions(busiType, isAutoContinueQuery) {
        this.remindLoadingFlag = true;
        // 手动刷新操作
        if (!isAutoContinueQuery === true) {
          this.remindList = [];
        }
        return post({ busiType: busiType, loading: false, isAutoContinueQuery: isAutoContinueQuery, isHomePageQuery: true}, "/sm/msg/penditem/queryPendItemDto").then(res => {
          this.remindLoadingFlag = false;
          this.remindList = [];
          if (res && res.data.retCode === "000000") {
            this.remindList = res.data.retData ? res.data.retData : [];
            if (this.remindList.length > 0) {
              let isAutoContinueQuery = this.remindList[0].isAutoContinueQuery == null ? false : this.remindList[0].isAutoContinueQuery
              if (isAutoContinueQuery) {
                if (this.remindList[0].id == null) {
                  this.remindList = []
                }
                this.getItemOptions("Remind", isAutoContinueQuery);
              }
            }
          }
        });
      },
      handleGotoPage($event, item, turnType) {
        //根据菜单调整左侧菜单树展示内容
        let currentActiveIndex = item.menuId.toString().substr(0, 1);
        for (let i = 0; i < this.menusRoot.length; i++) {
          if (this.menusRoot[i].id === currentActiveIndex) {
            this.$store.dispatch('ActiveRootIndex', i);
          }
        }
        handleGotoPage(this, 'mainIndex', item, turnType);
      },
      formatAmt(busiType, totalAmt) {
        if (busiType === "Remind") {
          return totalAmt <= 0 ? "-" : formatNumber(totalAmt, 2, ',')
        }
      },
      // 计算底部待办事项框高度
      alculateHeight() {
        let appObj = document.getElementsByClassName('app-main');
        let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
        let stateH = document.getElementsByClassName('h-system-state-wrap').length > 0 ? document.getElementsByClassName('h-system-state-wrap')[0].clientHeight : 0;
        let eventTitleH = document.getElementsByClassName('h-event-title').length > 0 ? document.getElementsByClassName('h-event-title')[0].clientHeight : 0;
        let remindTitleH = document.getElementsByClassName('h-remind-title').length > 0 ? document.getElementsByClassName('h-remind-title')[0].clientHeight : 0;
        let eventConHeight = window.innerHeight - appOffsetTop - stateH - eventTitleH - remindTitleH - (10 + 40 + 5 + 8 + 11);
        this.eventConHeight = eventConHeight < 155 ? 155 : eventConHeight;
      },
      // 查询业务参数：(1)用户登录后系统是否自动发起首页提醒查询：1-是(默认)0-否 (2)切回首页后提醒/待办任务是否自动进行刷新：1-是 0-否(默认)
      getBusinessParamValue() {
        return getSingleParamValuesByKeys("sm.msg_is_auto_proceed_pend_item_query,sm.msg_cut_back_to_home_page_is_auto_refresh").then(res => {
          let isAutoProceedTodoItemQuery = res['sm.msg_is_auto_proceed_pend_item_query'];
          let cutBackToHomePageIsAutoRefresh = res['sm.msg_cut_back_to_home_page_is_auto_refresh'];
          if (isAutoProceedTodoItemQuery === "0") {
            this.isAutoProceedPendItemQuery = "0";
          }
          if (cutBackToHomePageIsAutoRefresh === "1") {
            this.cutBackToHomePageIsAutoRefresh = "1";
          }
        });
      }
    },
    async mounted() {
      let isShowMainindex = window.sessionStorage.getItem("isShowMainindex");
      if (isShowMainindex === "1") {
        this.alculateHeight();
        // 业务参数控制是否在用户登录时查询
        await this.getBusinessParamValue();
        if (this.isAutoProceedPendItemQuery === "1") {
          setTimeout(() => {
            this.getItemOptions("Remind", false);
          }, 1000);
        }
      }
    }
  };
</script>

<style scoped>

</style>
