<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.brchName')" prop="operBrchNoList">
                  <h-input v-model="formItem.operBrchNoList" readonly v-show="false" placeholder=""></h-input>
                  <h-input v-model="formItem.operBrchNameList" readonly icon="android-search" @on-click="queryBrchNo()"
                           :title="formItem.operBrchNameList"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                  <h-input v-model="formItem.custNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.custAcctNo')" prop="custAcctNo">
                  <h-input v-model="formItem.custAcctNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/bm/sign/pageQueryCustElecSign"
                      :bindForm="formItem"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="signOut">{{$t('m.i.bm.signOut')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 机构名称选择弹窗框 -->
    <show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange" ifcheck="true"
                 :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "elecCompulsoryRescission",
    components: {
      ShowBranch: () => import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */ "@/views/bizViews/be/market/rediscount/common/showBranch")
    },
    data() {
      return {
        formItem: {
          custNo: "",
          custName: "",
          custAcctNo: "",
          signStatus: "1",
          operBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          operBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        },
        selectData: null,
        showBranchWin : false,
        ifShowMore: false,
        columns: [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t('m.i.common.custNo'),
          key: "custNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.custAcctNo'),
          key: "custAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.signStatus'),
          key: "signStatus",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.signStatus === "" || params.row.signStatus == null) {
              return "";
            }
            switch (params.row.signStatus) {
              case "1":
                return h("span", "已签约");
              case "0":
                return h("span", "已解约");
            }
          }
        },
        {
          title: this.$t('m.i.bm.eSignStartDt'),
          key: "eSignStartDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.eSignStartDt === "" || params.row.eSignStartDt == null || params.row.eSignStartDt === 0) {
              return h("span", "---");
            } else {
              let date = this.$moment(params.row.eSignStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        },
        {
          title: this.$t('m.i.bm.eSignCancelDt'),
          key: "eSignCancelDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.eSignCancelDt === "" || params.row.eSignCancelDt == null || params.row.eSignCancelDt === 0) {
              return h("span", "---");
            } else {
              let date = this.$moment(params.row.eSignCancelDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        },
        {
          title: this.$t('m.i.common.operBrchNo'),
          key: "operBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.operBrchName'),
          key: "operBrchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.operTellerNo'),
          key: "operTellerNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.operTellerName'),
          key: "operTellerName",
          sortable: true,
          hiddenCol: false
        }
      ]
      };
    },
    mounted() {
      this.handleResize();
      on(window, "resize", this.handleResize);
    },
    beforeDestroy() {
      off(window, "resize", this.handleResize);
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      //表格自适应
      handleResize() {
        this.$nextTick(() => {
          this.$refs.datagrid.selfAdaption();
        });
      },
      //表单查询
      handleSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.operBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      },
      //解约
      signOut() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定要强制解约电票业务吗？",
          onOk: () => {
            this.handleSignOut();
          }
        });
      },
      //解约确定
      handleSignOut() {
        let url = "/bm/sign/elecBusi/elecSignBusi/func_elecCompulsoryRescission";
        post({ ids: this.selectData.id, opeType: "1" }, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              if(this.$refs.datagrid.total % this.$refs.datagrid.pageInfo.pageSize == 1 && this.$refs.datagrid.total > 1 ){
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo - 1);
              } else {
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              }
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      clearVal(optType) {
        if (optType === "acptBrchNoList") {
          this.formItem.operBrchNoList = "";
          this.formItem.operBrchNameList = "";
        }
      },
      //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let operBrchNoList = "";
        let operBrchNameList = "";
        for (var i = 0; i < objs.length; i++) {
          operBrchNoList += objs[i].id + ",";
          operBrchNameList += objs[i].title + ",";
        }
        this.formItem.operBrchNoList = operBrchNoList.substring(0, operBrchNoList.length - 1);
        this.formItem.operBrchNameList = operBrchNameList.substring(0, operBrchNameList.length - 1);
        this.showBranchWin = false;
      },



    }
  };


</script>

<style scoped>

</style>
