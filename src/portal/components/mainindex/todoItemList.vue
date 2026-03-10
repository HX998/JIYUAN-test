<!--首页-代办任务-->
<template>
  <div class="h-event-wrap">
    <div class="h-event-title">
      <span class="h-event-icon"><h-icon name="calendar"></h-icon></span>
      <h2 class="h-event-type">待办任务</h2>
      <span class="h-event-num" v-if="todoItemList.length > 0">(<span>{{todoItemCount}}</span>)</span>
      <h-icon :class="['h-event-refresh', {'h-event-loading' : todoItemLoadingFlag}]" name="shuaxin" @on-click="getItemOptions('TodoItem', 'refresh', false)"></h-icon>
    </div>
    <div class="h-remind-title">
      <strong class="h-wait1">序号</strong>
      <strong class="h-wait2">业务模块</strong>
      <strong class="h-wait3">待办任务名称</strong>
      <strong class="h-wait4">总笔数</strong>
      <strong class="h-wait5">总金额(元)</strong>
      <!--<strong class="h-wait6">查看</strong>-->
    </div>
    <div class="h-event-content" :style="{height: eventConHeight + 'px'}">
      <ul v-if="todoItemList.length > 0" ref="todoItemList">
        <li v-for="(item,index) in todoItemList" :key="index">
          <div class="h-event-item" v-if="item.totalNum > 0">
            <a @click="handleGotoPage($event,item)">
              <span class="h-wait1">{{index + 1}}</span>
              <span class="h-wait2" :title="item.moduleName">{{item.moduleName}}</span>
              <span class="h-wait3" :title="item.pendRemark">{{item.pendRemark}}</span>
              <span class="h-wait4">{{item.totalNum}}</span>
              <span class="h-wait5">{{formatAmt('TodoItem', item.totalAmt)}}</span>
              <!--<span class="h-wait6"><h-icon name="lookup"></h-icon></span>-->
            </a>
          </div>
        </li>
      </ul>
      <div v-else class="h-event-free">暂无待办任务</div>
    </div>
  </div>
</template>

<script>
  import {post, handleGotoPage, on, off, formatNumber, getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";
  import {mapGetters} from "vuex";

  export default {
    name: "todoItemList",
    data() {
      return {
        todoItemList: [],
        todoItemCount: "0",
        todoItemLoadingFlag: false,   // 待办任务正在加载标识
        todoItemPageNo: 1,  //记录待办任务查询页数
        todoItemPageSize: 0,  //记录待办任务一次查询条数
        isStopQuery: false,   //记录待办任务是否已全部查询完成
        eventConHeight: 320,       // 底部待办事项框高度
        isAutoProceedTodoItemQuery: "1",  // 用户登录后系统是否自动发起首页待办查询：1-是（默认） 0-否
        isAutoContinueQuery: false,  // 是否自动再次查询
        cutBackToHomePageIsAutoRefresh: "0" // 切回首页后提醒/待办任务是否自动进行刷新：1-是 0-否（默认）
      }
    },
    computed: {
      ...mapGetters([
        "menusRoot"
      ])
    },
    watch: {
      "$route.path": function (val) {
        let isShowMainindex = window.sessionStorage.getItem("isShowMainindex");
        if (val === "/mainIndex" && isShowMainindex === "1") {
          if (this.cutBackToHomePageIsAutoRefresh === "1") {
            setTimeout(() => {
              this.getItemOptions("TodoItem", "refresh", false).then(() => {
                this.$nextTick(() => {
                  on(this.$refs.todoItemList, "scroll", this.handleScroll);
                });
              });
            }, 500);
          }
        }
      },
      eventConHeight: {
        handler(val) {
          this.todoItemPageSize = Math.ceil(val / 32);
        },
        immediate: true
      }
    },
    methods: {
      getItemOptions(busiType, optType, isAutoContinueQuery) {
        let userType = JSON.parse(window.sessionStorage.getItem("userInfo")).userType;
        if (userType != '1') {
          this.todoItemLoadingFlag = true;
          let params = {};
          // 手动刷新操作
          if (optType === "refresh" && !isAutoContinueQuery === true) {
            this.isStopQuery = false;
            this.todoItemPageNo = 1;
            this.todoItemList = [];
          }
          params = {
            loading: false,
            "pageNo": this.todoItemPageNo,
            "pageSize": this.todoItemPageSize,
            isAutoContinueQuery: isAutoContinueQuery,
            isHomePageQuery: true
          }
          return post(params, "/sm/msg/todoitem/todoItemMain/func_queryTodoItemByPage").then(res => {
            this.todoItemLoadingFlag = false;
            if (res && res.data.retCode === "000000") {
              let resultTodoItemList = res.data.retData.list;
              // 查询结果为空时，设置待办任务已全部查询完成
              if ((resultTodoItemList == null && !isAutoContinueQuery === true)) {
                this.isStopQuery = true;
              } else {
                this.todoItemCount = !!res.data.retData.pageInfo ? res.data.retData.pageInfo.countKey : 0;
                let isAutoContinueQuery = resultTodoItemList[0].isAutoContinueQuery == null ? false : resultTodoItemList[0].isAutoContinueQuery;
                if (optType === "refresh") {
                  // 是否自动再次查询
                  if (isAutoContinueQuery) {
                    if (resultTodoItemList[0].id != null) {
                      // 刷新操作(自动刷新)，后台返回需要继续自动查询时，只在第一次返回时给list重新赋值
                      if (null == this.todoItemList || this.todoItemList.length == 0 || this.todoItemPageNo === 1) {
                        // 刷新操作，list重新赋值，而不是向后插入，否则会导致多次快速点击刷新，最后展示出重复的数据
                        this.todoItemList = res.data.retData.list;
                      }
                    }
                    this.getItemOptions("TodoItem", "refresh", isAutoContinueQuery);
                  } else {
                    // 刷新操作(手动刷新|自动刷新)，后台返回需要继续自动查询时，只在第一次返回时给list重新赋值，todoItemList为空时是自动刷新，todoItemList不为空时是手动刷新
                    if (null == this.todoItemList || this.todoItemList.length == 0 || this.todoItemPageNo === 1) {
                      // 刷新操作，list重新赋值，而不是向后插入，否则会导致多次快速点击刷新，最后展示出重复的数据
                      this.todoItemList = res.data.retData.list;
                    } else {
                      // 自动刷新时，判断待办任务是否已全部查询完成
                      if (this.isStopQuery) {
                        this.isStopQuery = false;
                        this.todoItemPageNo = this.todoItemPageNo - 1;
                      }
                    }
                  }
                  this.$nextTick(() => {
                    on(this.$refs.todoItemList, "scroll", this.handleScroll);
                  });
                } else {
                  if (resultTodoItemList[0].id != null) {
                    // 向后插入
                    this.todoItemList.push(...res.data.retData.list);
                  }
                }
              }
            }
          });
        }
      },
      handleScroll(e) {
        let scrollDistance = e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight;
        if (scrollDistance <= 0) {//等于0证明已经到底，可以请求接口
          if (!this.isStopQuery) {
            this.todoItemPageNo++;
            this.getItemOptions("TodoItem");
          }
        }
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
        if (busiType === "TodoItem") {
          return totalAmt <= 0 ? "-" : formatNumber(totalAmt, 2, ',');
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
      // 查询业务参数：(1)用户登录后系统是否自动发起首页提醒查询：1-是(默认) 0-否 (2)切回首页后提醒/待办任务是否自动进行刷新：1-是 0-否(默认)
      getBusinessParamValue() {
        return getSingleParamValuesByKeys("sm.msg_is_auto_proceed_todo_item_query,sm.msg_cut_back_to_home_page_is_auto_refresh").then(res => {
          let isAutoProceedTodoItemQuery = res['sm.msg_is_auto_proceed_todo_item_query'];
          let cutBackToHomePageIsAutoRefresh = res['sm.msg_cut_back_to_home_page_is_auto_refresh'];
          if (isAutoProceedTodoItemQuery === "0") {
            this.isAutoProceedTodoItemQuery = "0";
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
        if (this.isAutoProceedTodoItemQuery === "1") {
          setTimeout(() => {
            this.getItemOptions("TodoItem", "refresh", false).then(() => {
              this.$nextTick(() => {
                on(this.$refs.todoItemList, "scroll", this.handleScroll);
              });
            });
          }, 3000);
        }
      }
    },
    beforeDestroy() {
      off(this.$refs.todoItemList, "scroll", this.handleScroll);
    },
  };
</script>

<style scoped>

</style>
