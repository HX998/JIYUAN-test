<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')" class="h-form-long-label">
                  <h-input v-model="formItem.batchNo"  placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="discCustName" :label="$t('m.i.be.discOutName')" class="h-form-long-label">
                  <h-input v-model="formItem.discCustName" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="discCustSocCode" :label="$t('m.i.ce.discountApplySocCode')" class="h-form-long-label">
                  <h-input v-model="formItem.discCustSocCode" :maxlength=18></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/be/discquote/entrust/discEntrustRegCheck/func_queryDiscEntrustRegCheck"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pass">{{$t("m.i.common.pass")}}</h-button>
              <h-button type="primary" @click="back">{{$t("m.i.common.back")}}</h-button>
              <h-button type="primary" @click="viewDatail">{{$t("m.i.common.viewDatail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 委托申请详情页面 -->
    <disc-entrust-reg-detail :discEntrustRegDetailWin="discEntrustRegDetailWin" :batchParams="batchParams"
                             @discEntrustRegDetailWinClose="discEntrustRegDetailWinClose" ref="discEntrustRegDetail"
                             :dataGridUrl="dataGridUrl" :exportUrl="exportUrl" :batchUrl="batchUrl"></disc-entrust-reg-detail>

  </div>
</template>

<script>
  import { post} from "@/api/bizApi/commonUtil";

  export default {
    name: "discEntrustRegCheck",
    components: {
      DiscEntrustRegDetail: () => import(/* webpackChunkName: "be/discquote/entrust/discEntrustRegDetail" */`@/views/bizViews/be/discquote/entrust/discEntrustRegDetail`)
    },
    data() {
      return {
        formItem: {
          batchNo: "",
          discCustName: "",
          discCustSocCode: ""
        },
        columns: [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
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
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showDetail(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t("m.i.be.discOutName"),
            key: "discCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.discountApplySocCode"),
            key: "discSocCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.status"),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DERegStatus", params.row.applStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.totalNum"),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        dictMap: new Map(),
        billTypeList:[],
        dERegStatusList:[],
        batchParams: {},
        discEntrustRegDetailWin:false,
        dataGridUrl: "/be/discquote/entrust/discEntrustRegCheck/func_queryDiscEntrustRegBillPage",
        exportUrl: "/be/discquote/entrust/discEntrustRegCheck/func_exportDiscEntrustRegBill",
        batchUrl: "/be/discquote/entrust/discEntrustRegCheck/func_editDiscEntrustReg"
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,DERegStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dERegStatusList = res.get("DERegStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //查询
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
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.currentSelectRow = null;
              this.handleSearch(1);
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      viewDatail() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.showDetail(this.currentSelectRow.id);
      },
      showDetail(id) {
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billTypeList = this.billTypeList;
        this.discEntrustRegDetailWin = true;
      },
      discEntrustRegDetailWinClose(){
        this.discEntrustRegDetailWin = false;
        this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
        this.batchParams={};
      },
      pass() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "贴现委托登记复核",
          content: "确定要复核通过吗？",
          onOk: () => {
            let params = { id: this.currentSelectRow.id };
            let url = "/be/discquote/entrust/discEntrustRegCheck/func_passDiscEntrustReg";
            this.sendPost(params, url);
          }
        });
      },
      back() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "贴现委托登记复核驳回",
          content: "确定要复核驳回吗？",
          onOk: () => {
            let params = { id: this.currentSelectRow.id };
            let url = "/be/discquote/entrust/discEntrustRegCheck/func_rejectDiscEntrustReg";
            this.sendPost(params, url);
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
