<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-select v-model="formItem.sendBrchType" :dictList="this.trgtCodeList"
                               :label="$t('s.i.pay.sendBrchType')" prop="sendBrchType"></common-select>
                <common-input v-model="formItem.payFlowNo" :label="$t('s.i.pay.payFlowNo')"
                              prop="payFlowNo" :maxlength="20"></common-input>
                <common-select v-model="formItem.detailFlag" :dictList="this.dtlMkCodeList"
                               :label="$t('s.i.pay.detailFlag')" prop="detailFlag"></common-select>
                <query-btn :formSearch="handleSearch" :advanceShow="false"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pay/payment/payStatusQueryMain/func_queryPaymentStatusQueryByPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryApply()">{{$t("s.i.pay.apply")}}</h-button>
              <h-button type="primary" @click="showQueryResult()">{{$t("s.i.pay.showQueryResult")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <query-apply-edit :queryApplyEditWin="queryApplyEditWin" :dictMap="dictMap" @queryApplyEditWinClose="queryApplyEditWinClose"></query-apply-edit>
    <show-query-result :showQueryResultWin="showQueryResultWin" :dictMap="dictMap" :statusQueryId="statusQueryId" @showQueryResultWinClose="showQueryResultWinClose"></show-query-result>
  </div>
</template>

<script>
import {getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
  name: "billPaymentMain",
  components: {
    ShowQueryResult: () => import(/* webpackChunkName: "bopp-pay/payment/showQueryResult" */`@/views/bizViews/bopp-pay/payment/showQueryResult`),
    QueryApplyEdit: () => import(/* webpackChunkName: "bopp-pay/payment/queryApplyEdit" */`@/views/bizViews/bopp-pay/payment/queryApplyEdit`)
  },
  data() {
    return {
      formItem: {
          legalNo: "",
          // memberId: "",
          // branchCode: "",
          sendBrchType: "",
          payFlowNo: "",
          detailFlag: "",
        },
        userInfo: null,
        dictMap: new Map(),
        columns:[
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
            title: this.$t("s.i.pay.sendBrchType"),
            key: "sendBrchType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'TrgtCode', params.row.sendBrchType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.payFlowNo"),
            key: "payFlowNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("s.i.pay.detailFlag"),
            key: "detailFlag",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DtlMkCode', params.row.detailFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.payFlowUpdateDtTm"),
            key: "payFlowUpdateDtTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.payFlowUpdateDtTm){
                return h("span",
                    this.$moment(params.row.payFlowUpdateDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
              }else{
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("s.i.pay.remark"),
            key: "remark",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.status"),
            key: "queryStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'BoppQueryStatus', params.row.queryStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealMsg",
            hiddenCol: false,
          },
        ],
        fnclInstsTpCodeList: [],
        trgtCodeList: [],
        dtlMkCodeList: [],
        queryApplyEditWin: false,
        showQueryResultWin: false,
        statusQueryId: "",
      }
    },

    mounted() {
      this.getDictListByGroups("TrgtCode,DtlMkCode,BoppQueryStatus,BillCirStatusCode,BillStatusCode,DraftTypeCode,BillPayStatus,BanEndorsementMarkCode,PymnMthdCode").then(res => {
        this.trgtCodeList = res.get("TrgtCode");
        this.queryStatusCodeList = res.get("BoppQueryStatus");
        this.dtlMkCodeList = res.get("DtlMkCode");
        this.dictMap = res.get("map");
        this.dictMap.dtlMkCodeList = this.dtlMkCodeList;
        this.dictMap.trgtCodeList = this.trgtCodeList;
      });
    },
    methods: {
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = null;
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
        this.currentSelectRow = null;
      },
      showQueryResult(){
        if(this.currentSelectRow){
          this.statusQueryId = this.currentSelectRow.id;
          this.showQueryResultWin = true;
        }else{
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
      showQueryResultWinClose(){
        this.showQueryResultWin = false;
        this.handleSearch(1);
      },
      queryApply(){
        if(this.currentSelectRow && this.currentSelectRow.queryStatus == "QS00") {
          this.$msgTip.info(this, {info: this.$t("s.i.pay.inQueryForFlow")});
          return
        }
        this.queryApplyEditWin = true;
      },
      queryApplyEditWinClose(){
        this.handleSearch(1);
        this.queryApplyEditWin = false;
      },
    },
  created() {
    this.userInfo = this.$store.getters.userInfo
    this.formItem.legalNo = this.userInfo.legalNo
    // this.formItem.memberId = this.userInfo.memberId
    // this.formItem.branchCode = this.userInfo.cepsBrchCode
  }
}

</script>

<style scoped>

</style>
