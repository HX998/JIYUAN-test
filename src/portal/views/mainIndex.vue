<template>
  <div style="width: 99%; margin: 0 auto;" id="mainIndex">
    <h-row :gutter="10" class="h-system-state-wrap">
      <h-col span="10">
        <component :is="stateInfo" :busiClassify="busiClassify"></component>
      </h-col>
      <h-col span="14">
        <component :is="stateChart" :busiClassify="busiClassify" :screenWidth="screenWidth"></component>
      </h-col>
    </h-row>
    <h-row :gutter="10" class="mt-10 mb-40">
      <h-col span="10">
        <component :is="remindList" ref="remindListRef"></component>
      </h-col>
      <h-col span="14">
        <component :is="todoItemList" ref="todoItemListRef"></component>
      </h-col>
    </h-row>
    <div class="h-index-bottom">
      <h-icon name="remind"></h-icon>
      <span>实时获取数据需手动刷新</span>
      <div style="float: right;position: fixed;bottom:0;right:15px">
        <p>{{ curpkg }}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { post,getConnectMode } from "@/api/bizApi/commonUtil";

  export default {
    name: 'mainIndex',
    data () {
      return {
        //是否直连模式界面
        busiClassify: "1",
        stateInfo: "",
        stateChart: "",
        remindList: "",
        todoItemList: "",
        // 屏幕宽度
        screenWidth: document.documentElement ? document.documentElement.clientWidth : '',
        curpkg: "",
      }
    },
    created(){
      let isShowMainindex = window.sessionStorage.getItem("isShowMainindex");
      if (isShowMainindex === "1") {
        getConnectMode().then(res => {
          this.busiClassify = res ? res : "1";
          this.stateInfo = this._getMainIndexByUrl("/mainindex/stateInfo");
          this.stateChart = this._getMainIndexByUrl("/mainindex/stateChart");
          this.remindList = this._getMainIndexByUrl("/mainindex/remindList");
          this.todoItemList = this._getMainIndexByUrl("/mainindex/todoItemList");
        });
      }
      post({loading: false}, "/sm/auth/login/queryVersion").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let obj = res.data.retData;
            if (obj.curpkg) {
              this.curpkg = "版本：" + obj.curpkg;
            } else {
              this.curpkg = "";
            }
          } else {
            this.curpkg = "";
          }
        } else {
          this.curpkg = "";
        }
      });
    },
    mounted(){
      this.$nextTick(() => {
        let _this = this;
        window.onresize = function(){ // 定义窗口大小变更通知事件
          _this.screenWidth = document.documentElement.clientWidth; //窗口宽度
          if(_this.$refs.remindListRef.alculateHeight instanceof Function) {
            _this.$refs.remindListRef.alculateHeight();
          }
          if(_this.$refs.todoItemListRef.alculateHeight instanceof Function) {
            _this.$refs.todoItemListRef.alculateHeight();
          }
        };
      })
    }
  }
</script>
<style>

</style>
