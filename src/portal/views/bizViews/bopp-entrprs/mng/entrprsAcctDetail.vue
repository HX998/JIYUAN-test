<!--企业信息管理-账户明细页面-->
<template>
  <div>
    <h-msg-box v-model="tempEntrprsAcctDetailWin" :maximize="true" @on-close="handleClose"
               width="1000" class="h-form-table-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>查看账户明细</span>
      </p>
      <div>
        <h-form :model="viewDatailForm" :label-width="115" ref="viewDatailForm" cols="3" class="h-form-search">
          <div>
            <common-input v-model="viewDatailForm.platformName" :label="$t('s.i.entrprs.platformName')"
                          prop="platformName" readonly></common-input>
            <common-input v-model="viewDatailForm.enterpriseName" :label="$t('s.i.entrprs.enterpriseName')"
                          prop="enterpriseName" readonly></common-input>
            <common-input v-model="viewDatailForm.enterpriseSocCode" :label="$t('s.i.entrprs.enterpriseSocCode')"
                          class="h-form-long-label" prop="enterpriseSocCode" readonly></common-input>
          </div>
        </h-form>
        <div style="margin-top: 15px;">
          <h-tabs :animated="false" :value="tabPane" @on-click="clickTabs" ref="closetab">
            <h-tab-pane :label="$t('s.i.entrprs.entrprsElecDetail')" name="entrprsElecDetailTab">
              <keep-alive>
                <component is="entrprsElecDetailTab" ref="entrprsElecDetailTab"
                           :entrprsParams="entrprsParams"></component>
              </keep-alive>
            </h-tab-pane>
            <h-tab-pane :label="$t('s.i.entrprs.entrprsUserDetail')" name="entrprsUserDetailTab">
              <keep-alive>
                <component is="entrprsUserDetailTab" ref="entrprsUserDetailTab"
                           :entrprsParams="entrprsParams"></component>
              </keep-alive>
            </h-tab-pane>
          </h-tabs>
        </div>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {post} from "@/api/bizApi/commonUtil";

  export default {
    name: "entrprsAcctDetail",
    components: {
      entrprsElecDetailTab: () => import(/* webpackChunkName: "bopp-entrprs/mng/entrprsElecDetailTab" */`@/views/bizViews/bopp-entrprs/mng/entrprsElecDetailTab`),
      entrprsUserDetailTab: () => import(/* webpackChunkName: "bopp-entrprs/mng/entrprsUserDetailTab" */`@/views/bizViews/bopp-entrprs/mng/entrprsUserDetailTab`)
    },
    data() {
      return {
        viewDatailForm: {
          platformName: "",
          enterpriseName: "",
          enterpriseSocCode: ""
        },
        tabPane: "entrprsElecDetailTab"
      };
    },
    props: {
      entrprsAcctDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      entrprsParams: {
        type: Object,
        default() {
          return {
            enterpriseId: "",
            platformName: "",
            enterpriseName: "",
            enterpriseSocCode: ""
          }
        }
      }
    },
    computed: {
      tempEntrprsAcctDetailWin: {
        get() {
          return this.entrprsAcctDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      entrprsAcctDetailWin(val) {
        if (val == true) {
          this.viewDatailForm.platformName = this.entrprsParams.platformName;
          this.viewDatailForm.enterpriseName = this.entrprsParams.enterpriseName;
          this.viewDatailForm.enterpriseSocCode = this.entrprsParams.enterpriseSocCode;
          this.handleSearch();
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //关闭弹窗
      handleClose() {
        this.$refs.viewDatailForm.resetFields();
        this.$refs.entrprsElecDetailTab.resetSearch();
        this.tabPane = "entrprsElecDetailTab";
        this.$refs.entrprsElecDetailTab.entrprsElecDetailFormItem.enterpriseId = "";
        this.$refs.entrprsUserDetailTab.entrprsUserDetailFormItem.enterpriseId = "";
        this.$emit("entrprsAcctDetailWinClose", "");
      },
      //表单查询
      handleSearch() {
        this.$nextTick(() => {
          //企业电票账户明细
          if (this.tabPane === "entrprsElecDetailTab") {
            this.$refs.entrprsElecDetailTab.handleSearch();
          }
          //企业平台用户明细
          if (this.tabPane === "entrprsUserDetailTab") {
            this.$refs.entrprsUserDetailTab.handleSearch();
          }
        })
      },
      //table点击切换事件
      clickTabs(name) {
        this.tabPane = name;
        this.handleSearch();
      }
    }
  };
</script>

<style scoped>

</style>
