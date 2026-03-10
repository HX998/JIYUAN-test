<!--转贴现逾期转垫款-跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo" :maxlength="20"></common-input>
                <common-input v-model="formItem.dealNo" :label="$t('m.i.be.dealNo')" prop="dealNo" :maxlength="20"></common-input>
                <batch-no v-model="formItem.batchNo"></batch-no>
                <bill-no v-model="formItem.billNoLike" prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')"></bill-no>
                <common-date-picker v-model="dueDate" :label="$t('m.i.billInfo.dueDt')" type="daterange" :autoPlacement="true" @on-change="handleDueDtChange"></common-date-picker>
                <!--<common-date-picker v-model="dealDate" :label="$t('m.i.be.dealDt')" type="daterange" :autoPlacement="true" @on-change="handleDealDtChange"></common-date-picker>-->
                <!--<bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-class v-model="formItem.billClass" :dictList="billClassList"></bill-class>-->
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/trust/dueadvance/rebuyDueBillTrackQuery/func_queryRebuyDueBillTrackQuery"
            :bindForm="formItem"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showDetail()">{{$t("m.i.common.showDetail")}}</h-button>
              <h-button type="primary" @click="listExport()">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>
    <rebuy-due-bill-detail :rebuyDueBillDetailWin="rebuyDueBillDetailWin" :batchParams="batchParams"
                         @rebuyDueBillDetailWinClose="rebuyDueBillDetailWinClose" ref="rebuyDueBillDetail"
                         :dataGridUrl="dataGridUrl" :exportUrl="exportUrl" :batchUrl="batchUrl"></rebuy-due-bill-detail>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post,formatNumber,exportList,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyDueBillTrackQuery",
    components: {
      RebuyDueBillDetail: () => import(/* webpackChunkName: "be/trust/dueadvance/rebuyDueBillDetail" */`@/views/bizViews/be/trust/dueadvance/rebuyDueBillDetail`),
    },
    data() {
      return {

        formItem: {
          quoteNo:"",
          dealNo:"",
          batchNo: "",
          billNoLike:"",
          minDueDt:"",
          maxDueDt:"",
          minDealDt:"",
          maxDealDt:"",
          billType: "",
          billClass: "",
        },
        columns: [
          {
            type: "selection",
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
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            key: 'billOrigin',
            render: (h, params) => {
              let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' :  this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params;
                type = "billId";
              } else {
                info = params;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          //子票区间列
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
            }
          },

          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DueAdvanceBusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DueAdvancedStatus", params.row.flowStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.advancedPayAmt'),
            key: "advancedPayAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.advancedPayAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.advancedBalanceAmt'),
            key: "advancedBalanceAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.advancedBalanceAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.advancedPayDt'),
            key: "advancedPayDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.advancedPayDt ? this.$moment(params.row.advancedPayDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.be.saleBrchName'),
            key: "saleBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "quoteNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dealDt'),
            key: "dealDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dealDt ? this.$moment(params.row.dealDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          }
        ],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        showBillInfoWin:false,
        billRangeStart:"",
        billRangeEnd:"",
        billId:"",
        billNo:"",
        dueDate: [],
        dealDate:[],
        billTypeList:[],
        billClassList: [],
        busiTypeList: [],
        isList:[],
        rebuyDueBillDetailWin:false,
        batchParams: {},
        dataGridUrl:"/be/trust/dueadvance/rebuyDueBillTrackQuery/func_queryRebuyDueDetail",
        batchUrl:"/be/trust/dueadvance/rebuyDueBillTrackQuery/func_findRebuyDueBillById",
        exportUrl:"",
        tempShowExcelTemplateWin: false,
        param: "",
        rows: "",
      };
    },
    mounted() {
      this.getDictListByGroups("DueAdvanceBusiType,Yon,DraftTypeCode,CDMedia,DueAdvancedStatus,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.busiTypeList = res.get("DueAdvanceBusiType");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDate= [];
        this.dealDate=[];
        this.formItem.minDueDt="";
        this.formItem.maxDueDt="";
        this.formItem.minDealDt="";
        this.formItem.maxDealDt="";
        this.$refs.formItem.resetFields();
      },

      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDate = [];
        }
      },
      handleDealDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDealDt = arr[0].replace(/-/g, "");
          this.formItem.maxDealDt = arr[1].replace(/-/g, "");
          this.dealDate = [arr[0], arr[1]];
        } else {
          this.formItem.minDealDt = "";
          this.formItem.maxDealDt = "";
          this.dealDate = [];
        }
      },
      //票据详情
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.showBillInfoWin=false;
      },
      showDetail(){
        let list = this.$refs.datagrid.selects;
        if(!list||list.length===0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }else if(list.length>1){
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
        }else{
          this.rebuyDueBillDetailWinOpen(list[0].id);
        }
      },
      rebuyDueBillDetailWinOpen(id){
        this.batchParams.listId=id;
        this.batchParams.dictMap = this.dictMap;
        this.rebuyDueBillDetailWin=true;
      },
      rebuyDueBillDetailWinClose(){
        this.rebuyDueBillDetailWin=false;
        this.batchParams={};
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      listExport() {
        this.param = "rebuyDueBillExport";
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
        let url = window.LOCAL_CONFIG.API_HOME + "/be/trust/dueadvance/rebuyDueBillTrackQuery/func_exportRebuyDueBill";
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
      },
      showBillInfo(row, type) {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        if (type === "billId") {
          this.billId = row.billId;
        } else {
          this.billNo = row.billNo;
        }
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      }

    }
  };
</script>

<style scoped>

</style>
