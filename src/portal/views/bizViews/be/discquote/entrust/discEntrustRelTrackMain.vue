<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" class="h-form-long-label" :maxlength="50"></common-input>
                <common-select v-model="formItem.aplStatus" :label="$t('m.i.common.status')" prop="aplStatus"
                               :dictList="dERelStatusList"></common-select>
                <common-input v-model="formItem.discCustName" :label="$t('m.i.ce.discountApplyName')" prop="discCustName" class="h-form-long-label" :maxlength="50"></common-input>
                <common-input v-model="formItem.discCustSocCode" :label="$t('m.i.ce.discountApplySocCode')" prop="discCustSocCode" class="h-form-long-label" :maxlength="18"></common-input>
                <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/be/discquote/entrust/discEntrustRelTrackMain/func_queryDiscEntrustRelBatchApplyPage"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="viewDatail">{{$t("m.i.common.viewDatail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--新增、修改页面-->
    <!--<edit-disc-entrust-rel :editDiscEntrustRelWin="editDiscEntrustRelWin" :batchParams="batchParams" @editDiscEntrustRelWinClose="editDiscEntrustRelWinClose"></edit-disc-entrust-rel>-->
    <!--明细页面-->
    <disc-entrust-rel-detail :discEntrustRelDetailWin="discEntrustRelDetailWin" :batchParams="batchParams"
                         @discEntrustRelDetailWinClose="discEntrustRelDetailWinClose" ref="discListingDetail"></disc-entrust-rel-detail>
  </div>
</template>

<script>
  import { post, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "discEntrustRelTrackMain",
    components:{
      // EditDiscEntrustRel: () => import(/* webpackChunkName: "be/discquote/entrust/editDiscEntrustRel" */`@/views/bizViews/be/discquote/entrust/editDiscEntrustRel`),
      DiscEntrustRelDetail: () => import(/* webpackChunkName: "be/discquote/entrust/discEntrustRelDetail" */`@/views/bizViews/be/discquote/entrust/discEntrustRelDetail`),

    },
    data(){
      return {
        formItem: {
          batchNo: "",
          discCustName:"",
          discCustSocCode:"",
          aplStatus:""
        },
        batchParams: {},
        columns:[
          {
            type: "radio",
            title: " ",
            width: 50,
            hiddenCol: false,
            align: "center"
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
            title: this.$t('m.i.ce.discountApplyName'),
            key: 'discCustName',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.ce.discountApplySocCode'),
            key: 'discSocCode',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.status'),
            key: 'applStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DERelStatus', params.row.applStatus);
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
          },
        ],
        dictMap: new Map(),
        ifShowMore: false,
        billTypeList: [],
        dERelStatusList:[],
        currentSelectRow: [],
        editDiscEntrustRelWin: false,
        discEntrustRelDetailWin:false,
      }
    },
    mounted() {
      this.getDictListByGroups("DERelStatus,DraftTypeCode,CorpScale,Industry,Yon,Province").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dERelStatusList = res.get("DERelStatus");
        this.dictMap = res.get("map");
      });
    },
    methods:{
      showChange(val) {
        this.ifShowMore = val;
      },
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
      viewDatail(){
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.showDetail(this.currentSelectRow.id);
      },
      showDetail(id){
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.billClassList = this.billClassList;
        this.batchParams.dataGridUrl="/be/discquote/entrust/discEntrustRelTrackMain/func_queryDiscEntrustRelBillPage";
        this.batchParams.url = "/be/discquote/entrust/discEntrustRelTrackMain/func_getDiscEntrustRelBatch";
        this.batchParams.exportUrl="/be/discquote/entrust/discEntrustRelTrackMain/func_exportDiscEntrustRelBill"
        this.discEntrustRelDetailWin = true;
      },
      discEntrustRelDetailWinClose(){
        this.discEntrustRelDetailWin = false;
        this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
        this.batchParams={};
      }
    }
  };
</script>

<style scoped>

</style>
