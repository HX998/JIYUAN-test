<!--企业信息管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.platformName" :label="$t('s.i.entrprs.platformName')"
                              prop="platformName" :maxlength=60></common-input>
                <common-input v-model="formItem.enterpriseName" :label="$t('s.i.entrprs.enterpriseName')"
                              prop="enterpriseName" :maxlength=60></common-input>
                <common-input v-model="formItem.enterpriseSocCode" :label="$t('s.i.entrprs.enterpriseSocCode')"
                              class="h-form-long-label" prop="enterpriseSocCode" :maxlength=18></common-input>
                <query-btn :formSearch="handleSearch" :formSearchReset="resetSearch" :advanceShow='false'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/entrprs/mng/entrprsInfoManage/func_getEnterpriseList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="entrprsAcctDetail()">{{$t("s.i.entrprs.entrprsAcctDetail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 账户明细弹窗 -->
    <entrprs-acct-detail :entrprsAcctDetailWin="this.entrprsAcctDetailWin" :entrprsParams="this.entrprsParams"
                         @entrprsAcctDetailWinClose="entrprsAcctDetailWinClose" ref="entrprsAcctDetail"></entrprs-acct-detail>
  </div>
</template>

<script>
export default {
  name: "entrprsInfoManage",
  components: {
    EntrprsAcctDetail: () => import(/* webpackChunkName: "bopp-entrprs/mng/entrprsAcctDetail" */`@/views/bizViews/bopp-entrprs/mng/entrprsAcctDetail`)
  },
  data() {
    return {
      formItem: {
          legalNo: "",
          platformName: "",
          enterpriseName: "",
          enterpriseSocCode: ""
        },
        columns: [
          {
            type: "radio",
            title: " ",
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.entrprs.platformName"),
            key: "platformName",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.entrprs.enterpriseName"),
            key: "enterpriseName",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.entrprs.enterpriseSocCode"),
            key: "enterpriseSocCode",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("s.i.entrprs.remark"),
            key: "remark",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        entrprsAcctDetailWin: false,
        entrprsParams: {}
      };
    },
    methods: {
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //账户明细
      entrprsAcctDetail() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.entrprsParams.enterpriseId = this.currentSelectRow.id;
        this.entrprsParams.platformName = this.currentSelectRow.platformName;
        this.entrprsParams.enterpriseName = this.currentSelectRow.enterpriseName;
        this.entrprsParams.enterpriseSocCode = this.currentSelectRow.enterpriseSocCode;
        this.entrprsAcctDetailWin = true;
      },
      //关闭账户明细弹窗
      entrprsAcctDetailWinClose() {
        this.entrprsAcctDetailWin = false;
        this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
        this.entrprsParams = {};
      }
    },
  created() {
    //获取法人编号
    this.formItem.legalNo = this.$store.getters.userInfo.legalNo
  }
};
</script>

<style scoped>

</style>
