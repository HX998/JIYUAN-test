<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.discCustSocCodeLike" class="h-form-long-label" prop="discCustSocCodeLike" :label="$t('m.i.ce.discountApplySocCode')" :maxlength="18"></common-input>
                <common-input v-model="formItem.discCustName" :label="$t('m.i.ce.discountApplyName')" class="h-form-long-label" prop="discCustName"></common-input>
                <common-type-field-range v-model="formItem" :rangeProps="['minEntrustMaxRatePct','maxEntrustMaxRatePct']" :label="$t('m.i.be.entrustMaxRate')" prop="entrustMaxRate" :bigTips="false" :validRules="entrustMaxRateRules" :integerNum="2" :suffixNum="4" class="h-form-long-label"></common-type-field-range>
                <common-date-picker v-model="entrustEndDate" :label="$t('m.i.be.entrustEndDate')" type="daterange" :autoPlacement="true" @on-change="handleEntrustEndDateChange"></common-date-picker>
                <common-select v-model="formItem.entrustStatus" :label="$t('m.i.be.entrustStatus')" prop="entrustStatus" :dictList="enTypeList"></common-select>
                <bill-no v-model="formItem.billNoLike" prop="billNoLike"></bill-no>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-money-range v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" :label="$t('m.i.billInfo.billMoneyByUnit')" :bigTips="false"></bill-money-range>
                <common-date-picker v-model="dueDate" :label="$t('m.i.billInfo.dueDt')" type="daterange" :autoPlacement="true" @on-change="handleDueDtChange"></common-date-picker>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/be/discquote/entrust/discEntrustBillMain/func_queryDiscEntrustBillIndexPage"
              :bindForm="formItem"
              :hasSelect="false"
              rowSelect
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber, getDictValueFromMap, exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "discEntrustBillMain",
    components:{
      EditDiscEntrustQuery: () => import(/* webpackChunkName: "be/discquote/entrust/editDiscEntrustQuery" */`@/views/bizViews/be/discquote/entrust/editDiscEntrustQuery`),
    },
    data(){
      return {
        formItem: {
          discCustSocCodeLike:"",
          discCustName:"",
          minEntrustMaxRatePct:"",
          maxEntrustMaxRatePct:"",
          minEntrustEndDate:"",
          maxEntrustEndDate:"",
          entrustStatus:"",
          billNoLike:"",
          billType:"",
          minBillMoney:"",
          maxBillMoney:"",
          minDueDate:"",
          maxDueDate:"",
        },
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.billInfo.billClass'),
            key: 'billClass',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
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
        ],
        entrustMaxRateRules: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        enTypeList: [],
        billTypeList: [],
        billClassList: [],
        entrustEndDate: [],
        dueDate: [],
        dictMap: new Map(),
        ifShowMore: false,
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,EnType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.enTypeList = res.get("EnType");
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
        this.entrustEndDate = [];
        this.dueDate = [];
        this.formItem.minEntrustEndDate = "";
        this.formItem.maxEntrustEndDate = "";
        this.formItem.minDueDate = "";
        this.formItem.maxDueDate = "";
        this.$refs.formItem.resetFields();
      },
      handleEntrustEndDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minEntrustEndDate = arr[0].replace(/-/g, "");
          this.formItem.maxEntrustEndDate = arr[1].replace(/-/g, "");
          this.entrustEndDate = [arr[0], arr[1]];
        } else {
          this.formItem.minEntrustEndDate = "";
          this.formItem.maxEntrustEndDate = "";
          this.entrustEndDate = [];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDate = arr[0].replace(/-/g, "");
          this.formItem.maxDueDate = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDate = "";
          this.formItem.maxDueDate = "";
          this.dueDate = [];
        }
      },
      listExport() {
        this.param = "DiscEntrustBillExport";
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
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/entrust/discEntrustBillMain/func_downloadDiscEntrustBill";
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
