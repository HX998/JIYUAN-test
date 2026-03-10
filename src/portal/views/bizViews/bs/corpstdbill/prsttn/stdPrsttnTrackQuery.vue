<!--提示付款-跟踪查询-->
<template>
  <div class="layout">
    <div>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <div class="h-form-search-box">
              <!-- 查询表单 -->
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <!--标票产品名称-->
                  <common-input :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                                v-model="formItem.stdProductNameLike" showIcon @on-click="queryProductName"
                                :maxlength="60" lengthByByte></common-input>
                  <!--票据种类-->
                  <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                  <!--票号-->
                  <common-input :label="$t('m.i.billInfo.billNo')" prop="billNoLike" v-model="formItem.billNoLike" :maxlength=30
                                type="int"></common-input>
                  <!--交易日期-->
                  <common-date-picker :label="$t('m.i.common.transDt')" prop="signDt" v-model="signDt"
                                      type="daterange" :autoPlacement="true"
                                      @on-change="handleSignDtChange"></common-date-picker>
                  <!--票面金额-->
                  <bill-money-range v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false"
                                    :label="$t('m.i.billInfo.billMoneyByUnit')"></bill-money-range>
                  <!--汇票到期日-->
                  <common-date-picker :label="$t('m.i.billInfo.dueDt')" prop="dueDt" v-model="dueDt" type="daterange"
                                      :autoPlacement="true" @on-change="handleDueDtChange"></common-date-picker>
                  <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                             :formSearchReset="resetSearch"></query-btn>
                </h-form>
              </h-panel>
            </div>
            <!-- 数据展示表格 -->
            <h-datagrid
              :columns="columns"
              highlightRow
              url="/bs/corpstdbill/prsttn/prsttnTrackQuery/func_queryPrsttnTrackQuery"
              :bindForm="formItem"
              rowSelect
              ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="listExport()">{{$t("m.i.common.listExport")}}</h-button>
              </div>
            </h-datagrid>
          </div>
        </h-col>
      </h-row>
    </div>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>
  </div>
</template>

<script>
  import {post, formatNumber, exportList} from "@/api/bizApi/commonUtil";
  export default {
    name: "stdPrsttnTrackQuery",
    components: {
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      return {
        formItem: {
          stdProductNo: "",
          stdProductNameLike: "",
          billNoLike: "",
          minSignDt: "",
          maxSignDt: "",
          minDueDt: "",
          maxDueDt: "",
          minBillMoney: "",
          maxBillMoney: "",
        },
        dictMap: new Map(),
        currentSelectRow: null,
        signDt: [],
        dueDt: [],
        billTypeList:[],
        tempShowExcelTemplateWin:false,
        columns: [
          {
            type: "selection",
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
            title: this.$t('m.i.bs.stdProductName'),
            key: "stdProductName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.dpstBillId)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t('m.i.bs.sendName'),
            key: "hldrName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.sendAcctNo'),
            key: "hldrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.receiveName'),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.receiveAcctNo'),
            key: "acptAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bs.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.transDt'),
            key: "prsttnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.prsttnDt && "" !== params.row.prsttnDt) {
                let dttm = this.$moment(params.row.prsttnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.remitDt && "" !== params.row.remitDt) {
                let dttm = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.dueDt && "" !== params.row.dueDt) {
                let dttm = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          }
        ],
        productBrchType: "4",
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        //是否显示更多查询项
        ifShowMore: false,
        showCpesProductBranch: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId:""
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      resetSearch() {
        this.signDt = [];
        this.formItem.minSignDt = "";
        this.formItem.maxSignDt = "";
        this.dueDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";

        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      handleSignDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minSignDt = arr[0].replace(/-/g, "");
          this.formItem.maxSignDt = arr[1].replace(/-/g, "");
          this.signDt = [arr[0], arr[1]];
        } else {
          this.formItem.minSignDt = "";
          this.formItem.maxSignDt = "";
          this.signDt = [];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, {info: "请先选择记录！"});
          return;
        }
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        this.showCpesProductBranch = false;
      },
      //清单导出
      listExport(){
        this.param = "stdPrsttnTrackQueryExport";
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
        let url = window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/prsttn/prsttnTrackQuery/func_exportStdPrsttn";
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
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.listId=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,listId){
        this.billId=billId;
        this.billNo=billNo;
        this.listId=listId;
        this.showBillInfoWin=true;
      },

    }
  };
</script>

<style scoped>

</style>
