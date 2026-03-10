<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <bill-no v-model="formItem.billNo" :maxlength="30"></bill-no>
                <common-select v-model="formItem.aplStatus" :label="$t('m.i.common.status')" prop="aplStatus" :dictList="queryStatusList"></common-select>
                <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/be/discquote/entrust/discEntrustQueryApplyMain/func_queryDiscEntrustQueryApplyPage"
              :bindForm="formItem"
              :hasSelect="false"
              rowSelect
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="apply">{{$t("m.i.be.apply")}}</h-button>
              <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <edit-disc-entrust-query :editDiscEntrustQueryWin="editDiscEntrustQueryWin" :batchParams="batchParams" @editDiscEntrustQueryWinClose="editDiscEntrustQueryWinClose"></edit-disc-entrust-query>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber, getDictValueFromMap, exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "discEntrustQueryApplyMain",
    components:{
      EditDiscEntrustQuery: () => import(/* webpackChunkName: "be/discquote/entrust/editDiscEntrustQuery" */`@/views/bizViews/be/discquote/entrust/editDiscEntrustQuery`),
    },
    data(){
      return {
        formItem: {
          billNo:"",
          aplStatus:"",
        },
        batchParams: {},
        columns:[
          {
            type: "selection",
            width: 50,
            align: "center",
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
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.status'),
            key: 'applStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DCQueryStatus', params.row.applStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt){
                let dt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dt);
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt){
                let dt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dt);
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t('m.i.ce.discountApplySocCode'),
            key: 'discSocCode',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.discountApplyName"),
            key: "discCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.entrustRegDate"),
            key: "rgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.rgstDt){
                let dt = this.$moment(params.row.rgstDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dt);
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.ce.discountApplyAcctNo"),
            key: "discOutAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discOutBankNo"),
            key: "discOutBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discOutBankName"),
            key: "discOutBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.entrustDate"),
            key: "entrustDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.entrustDt){
                let dt = this.$moment(params.row.entrustDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dt);
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.be.entrustMaxRate"),
            key: "entrustMaxRatePct",
            hiddenCol: false,
            sortable: true,
            sortMethod:(a,b,type)=>{
              if (type==="asc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1-a2;
              }else if (type==="desc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2-a1;
              }
            }
          },
          {
            title: this.$t("m.i.be.entrustEndDate"),
            key: "entrustEndDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.entrustEndDt){
                let dt = this.$moment(params.row.entrustEndDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dt);
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t('m.i.be.entrustStatus'),
            key: 'entrustStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'EnType', params.row.entrustStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          },
        ],
        queryStatusList: [],
        billTypeList: [],
        billClassList: [],
        dictMap: new Map(),
        ifShowMore: false,
        editDiscEntrustQueryWin: false,
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,DCQueryStatus,EnType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.queryStatusList = res.get("DCQueryStatus");
        this.dictMap = res.get("map");
      });
    },
    methods:{
      showChange(val) {
        this.ifShowMore = val;
      },
      //查询
      handleSearch(pageNo) {
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      apply(){
        if (this.$refs.datagrid.selectIds.length <= 1) {
          this.batchParams.billTypeList = this.billTypeList;
          this.batchParams.billClassList = this.billClassList;
          let list = this.$refs.datagrid.selectIds;
          if(list && list.length === 1){
            if('3' === this.$refs.datagrid.selects[0].applStatus){
              this.batchParams.batchId = this.$refs.datagrid.selectIds[0];
            }else{
              this.$msgTip.error(this, { info: "状态不符，请确认后再操作" });
              return;
            }
          }else{
            this.batchParams.batchId = "";
          }
          this.editDiscEntrustQueryWin = true;
        }else{
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
        }
      },
      editDiscEntrustQueryWinClose(){
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.editDiscEntrustQueryWin = false;
      },
      listExport() {
        this.param = "discEntrustQueryApplyExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/entrust/discEntrustQueryApplyMain/func_downloadDiscEntrustQueryApply";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      }
    }
  };
</script>

<style scoped>

</style>