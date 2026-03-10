<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
                <!--票据来源-->
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <!--票据(包)号码-->
                <bill-no v-model="formItem.billNoLike" prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')"></bill-no>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>

                <bill-money-range v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" :label="$t('m.i.billInfo.billPackageMoney')"></bill-money-range>
                <!--查询日期-->
                <common-date-picker v-model="formItem.applDt" :label="$t('m.i.common.applDt')" :autoPlacement="true" @on-change="handleDateChange"></common-date-picker>

                <query-btn :advanceShow='true' @showChange="showChange" :formSearch='formSearch' :formSearchReset='formSearchReset'></query-btn>

              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pe/showBill/showBillApply/func_queryShowBillApplyList"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showBillRequest()">{{$t("m.i.shcpe.showBillRequest")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <show-bill-submit-win :showBillApplyWin="showBillApplyWin" @showBillApplyWinClose="showBillApplyWinClose"
                          @showBillApplyWinSubmit="showBillApplyWinSubmit"></show-bill-submit-win>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"
                    :billId="this.billId"></bill-info-main>
  </div>
</template>

<script>
  import {
    post,
    formatNumber,
    formatBillRange,
    getDictListByGroups,
    getDictValueFromMap
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "showBillApply",
    components: {
      ShowBillSubmitWin: () => import(/* webpackChunkName: "pe/showBill/showBillSubmitWin" */`@/views/bizViews/pe/showBill/showBillSubmitWin`),
    },
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        showBillApplyWin : false,
        billRangeStart:"",
        minBillRangeStart:"",
        maxBillRangeEnd : "",
        billRangeEnd:"",
        billOriginList:[],
        applyStatusList : [],
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 60
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render:(h,params) => {
              return h("span",getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType));
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",

            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",

            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",

            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.showeeName'),
            key: "showeeName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.showeeBrchCode'),
            key: "showeeBrchCode",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.applDt == null || params.row.applDt === ""){
                return "";
              }
              let date = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.shcpe.showFlag'),
            key: "showFlag",
            hiddenCol: false,
            sortable: true,
            render:(h,params) => {
              return h("span",getDictValueFromMap(this.dictMap,"QryDraftStatusCode",params.row.showFlag));
            }
          }
        ],

        formItem: {
          billNoLike: "",
          billOrigin:"",
          status:"",
          cdtQrySignStatus : '',
          billRangeStart:"",
          minBillRangeStart:"",
          maxBillRangeEnd : "",
          billRangeEnd:"",
          billMoney : "",
          minBillMoney:"",
          maxBillMoney:"",
          applDt : ""
        },
        submitFlag: false,
        isRequired: true,
        deletDisabled: false,
        ifShowMore: false,
        licenseFlag: false,
        authPath: this.$route.path,
        isList: []
      };
    },
    watch: {},
    computed: {},
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      showBillRequest() {
        this.showBillApplyWin = true;
      },

      queryStockBill() {
        this.chooseBillWin = true;
      },
      queryStockBillClose() {
        this.chooseBillWin = false;
      },
      showBillApplyWinClose(){
        this.showBillApplyWin = false;
      },
      //票面信息
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },

      showBillApplyWinSubmit(showBillApplyFormItem) {
        let url = "/pe/showBill/showBillApply/func_showBillAppl";
        this.submitFlag = true;
        post(showBillApplyFormItem, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.showBillApplyWin = false;
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.applDt = "";
      },
      handleWinClose() {
        this.showBillApplyWin = false;
        this.$refs.showBillApplyFormItem.resetFields();
      },
      handleDateChange(value) {
        this.formItem.applDt = value.replace(/-/g, "");
      },
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,BillOrigin,QryDraftStatusCode").then(res => {
        this.billOriginList = res.get("BillOrigin");
        this.isList = res.get("DraftTypeCode");
        this.applyStatusList = res.get("QryDraftStatusCode")
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
