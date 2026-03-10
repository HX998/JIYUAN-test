<template>
  <h-msg-box v-model="tempShowQueryResultWin" width="800" :mask-closable="false" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true">
    <p slot="header">
      <span>查询结果</span>
    </p>
    <h-panel>
      <div style="margin-top: 15px;">
        <h-tabs :animated="false" :value="tabPane" @on-click="clickTabs" ref="closetab">
          <h-tab-pane :label="$t('s.i.pay.showQueryRespBillListTab')" name="showQueryRespBillListTab">
            <keep-alive>
              <component is="showQueryRespBillListTab" ref="showQueryRespBillListTab"
                         :statusQueryId="statusQueryId" :dictMap="dictMap"></component>
            </keep-alive>
          </h-tab-pane>
          <h-tab-pane :label="$t('s.i.pay.showQueryRespSkipListTab')" name="showQueryRespSkipListTab">
            <keep-alive>
              <component is="showQueryRespSkipListTab" ref="showQueryRespSkipListTab"
                         :statusQueryId="statusQueryId" :dictMap="dictMap"></component>
            </keep-alive>
          </h-tab-pane>
        </h-tabs>
      </div>
    </h-panel>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  export default {
    name: "showQueryResult",
    components: {
      showQueryRespBillListTab: () => import(/* webpackChunkName: "bopp-pay/payment/showQueryRespBillListTab" */`@/views/bizViews/bopp-pay/payment/showQueryRespBillListTab`),
      showQueryRespSkipListTab: () => import(/* webpackChunkName: "bopp-pay/payment/showQueryRespSkipListTab" */`@/views/bizViews/bopp-pay/payment/showQueryRespSkipListTab`)
    },
    data(){
      return {
        tabPane: "showQueryRespBillListTab",
      }
    },
    props: {
      showQueryResultWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      statusQueryId: "",
      dictMap: {
        type: Map
      }
    },
    computed: {
      tempShowQueryResultWin: {
        get() {
          return this.showQueryResultWin;
        },
        set() {
        }
      }
    },
    watch: {
      showQueryResultWin(val) {
        if (val === true) {
          this.handleSearch();
        }
      }
    },
    methods: {
      handleClose() {
        this.tabPane = "showQueryRespBillListTab";
        this.$emit("showQueryResultWinClose", "");
      },
      //表单查询
      handleSearch() {
        this.$nextTick(() => {
          if (this.tabPane === "showQueryRespBillListTab") {
            this.$refs.showQueryRespBillListTab.handleSearch();
          }
          if (this.tabPane === "showQueryRespSkipListTab") {
            this.$refs.showQueryRespSkipListTab.handleSearch();
          }
        })
      },
      //table点击切换事件
      clickTabs(name) {
        this.tabPane = name;
        this.handleSearch();
      }
    }
  }
</script>

<style scoped>

</style>
