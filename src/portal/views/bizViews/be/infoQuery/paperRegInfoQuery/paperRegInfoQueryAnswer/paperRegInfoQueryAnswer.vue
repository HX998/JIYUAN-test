<!--纸票登记信息查询申请-->
<template>
  <div>
    <div class="layout">
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                    <h-input v-model="formItem.billNo"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billMoney')">
                    <h-row>
                      <h-col span="11">
                        <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-col>
                      <h-col span="2" style="text-align: center">-</h-col>
                      <h-col span="11">
                        <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-col>
                    </h-row>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
            </div>
            <!--数据展示表格-->
            <h-datagrid
              :columns="dataColumns"
              hasPage
              highlight-row
              url="/be/infoQuery/paperRegInfoQuery/paperRegInfoQueryAnswer/func_pageQueryUsableRegAnswerList"
              :bindForm="formItem"
              :hasSelect="false"
              rowSelect
              ref="datagrid">
              <div slot="toolbar" class='pull-left'>
                <h-button type="primary" @click="hisQueryInfo()">{{$t('m.i.be.searchHis')}}</h-button>
                <h-button type="primary" @click="checkImg()">{{$t('m.i.common.showImg')}}</h-button>
                <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
              </div>
            </h-datagrid>
          </div>
        </h-col>
      </h-row>
    </div>
    <query-info-his :showmsg="queryInfoHisWin" :bills=bills :title="$t('m.i.be.searchHis')"
                    @queryInfoHisWinClose="queryInfoHisWinClose"></query-info-his>
    <check-img :showmsg="checkImgWin" :bills=bills :title="$t('m.i.common.showImg')" @checkImgWinClose="checkImgWinClose"></check-img>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "paperRegInfoQueryAnswer",
    components: {
      QueryInfoHis: () => import(/* webpackChunkName: "be/infoQuery/paperRegInfoQuery/paperRegInfoQueryAnswer/queryInfoHis" */`@/views/bizViews/be/infoQuery/paperRegInfoQuery/paperRegInfoQueryAnswer/queryInfoHis`),
      CheckImg: () => import(/* webpackChunkName: "be/infoQuery/paperRegInfoQuery/paperRegInfoQueryAnswer/checkImg" */`@/views/bizViews/be/infoQuery/paperRegInfoQuery/paperRegInfoQueryAnswer/checkImg`)
    },
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        formItem: {
          status: "",
          billNo: "",
          billType: "",
          minBillMoney: "",
          maxBillMoney: ""
        },
        ifShowMore: false,
        hisQueryInfoWin: false,
        imgWin: false,
        queryInfoHisWin: false,
        checkImgWin: false,
        title: "",
        bills: {
          id: ""
        },
        billTypeList: [],
        dataColumns: [
          {
            title: " ",
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            /*render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }*/
          },
          {
            title: this.$t('m.i.common.queryDt'),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.applDt ? this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
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
            title: this.$t('m.i.billInfo.billMoneyByUnit'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.cpesBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CpesBillStatus", params.row.billStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.cirStatus'),
            key: "billTransStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BillCirStatusCode", params.row.billTransStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.riskStatus'),
            key: "riskStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", this.getDictValueFromMap(this.dictMap, "RiskStatus", params.row.riskStatus));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.acptDt'),
            key: "acptDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.acptDt ? this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.drweBankNo'),
            key: "drweBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.queryTimes'),
            key: "queryNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "rgstRemark",
            hiddenCol: false
          }
        ],
        dictMap: new Map()
      };
    },
    methods: {
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "usableRegAnswerExportInfo";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME +  "/be/infoQuery/paperRegInfoQuery/paperRegInfoQueryAnswer/func_exportUsableRegAnswerExcel";
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params.idList = this.$refs.datagrid.selectIds;
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD");
      },
      /**
       * 列表搜索
       * */
      formSearch() {
        let min = Number(this.formItem.minBillMoney);
        let max = Number(this.formItem.maxBillMoney);
        if (min != 0 && max != 0) {
          if (min > max) {
            this.$msgTip.error(this, { info: "票据金额最小值不能超过最大值" });
          } else {
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds = [];
          this.$refs.datagrid.dataChange(1);
        }
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
      },
      // 展现历史查询信息
      hisQueryInfo() {
        let list = this.$refs.datagrid.selects;
        if (list == null || list.length <= 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.bills.id = list[0].id;
        this.queryInfoHisWin = true;
      },
      queryInfoHisWinClose() {
        this.queryInfoHisWin = false;
      },
      showBillInfo(billId, billNo) {
          this.billId = billId;
          this.billNo = billNo;
          this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },
      // 查看影像
      checkImg() {
        let list = this.$refs.datagrid.selects;
        if (list == null || list.length <= 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.bills.id = list[0].id;
        this.checkImgWin = true;
      },
      checkImgWinClose() {
        this.checkImgWin = false;
      },
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,RiskStatus,BillCirStatusCode,CpesBillStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
