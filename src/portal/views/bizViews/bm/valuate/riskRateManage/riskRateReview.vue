<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-date-picker :rangeValue="['minDueDate','maxDueDate']" v-model="formItem.valuateDts"
                                    :label="$t('m.i.common.valuationDate')" prop="valuateDts" format="yyyy-MM-dd"
                                    :minDueDate.sync="formItem.minDueDate" :maxDueDate.sync="formItem.maxDueDate"
                                    type="daterange"></common-date-picker>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid :columns="columns" highlight-row
                          url="/bm/valuate/riskRateManage/func_queryRiskRateMangeHisCheckPage"
                          :bindForm="formItem"
                          :onCurrentChangeCancel="onCurrentChangeCancel"
                          :onCurrentChange="onCurrentChange"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="pass">{{$t('m.i.common.pass')}}</h-button>
                  <h-button type="primary" @click="refuse">{{$t('m.i.common.refuse')}}</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import { post} from '@/api/bizApi/commonUtil'
  export default {
    name: "riskRateReview",
    data() {
      return {
        trDir: '',
        url: null,
        quoteNo: null,
        isQuoteNew: null,
        reqNum: null,
        quoteHistChangeWin: false,
        title: '',
        batchId: null,
        ifShowMore: false,
        saleTotalChangeWin: false,
        showProvisionDetil: false,
        busiType: "",
        selectData: [],
        dictMap: new Map(),
        valuationDate: "",
        operationStatus: "",
        DtRange: [],
        formItem: {
          minDueDate: "",
          maxDueDate: "",
          valuateDts: [],
        },
        columns: [
          {
            type: "radio",
            width: 50,
            title: " ",
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
            title: this.$t('m.i.common.valuationDate'),
            key: "valuateDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.valuateDt == null || params.row.valuateDt === "") {
                return "";
              }
              let date = this.$moment(params.row.valuateDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }, {
            title: this.$t('m.i.common.today'),
            key: "todayRate",
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.oneWeek'),
            key: "oneWeekRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.twoWeek'),
            key: "twoWeekRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.oneMonth'),
            key: "oneMonthRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.threeMonth'),
            key: "threeMonthRate",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.sixMonth'),
            key: "halfYearRate",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.nineMonth'),
            key: "nineMonthRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.oneYear'),
            key: "oneYearRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.createDt'),
            key: "createTime",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let date = this.$moment(params.row.createTime, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }, {
            title: this.$t('m.i.common.operStatus'),
            key: "operStatus",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "RiskOperStatus", params.row.operStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
      };
    },
    methods: {
      //重置
      formSearchReset() {
        this.formItem = {};
      },
      //查询
      formSearch() {
        this.selectData = []
        this.$refs.datagrid.dataChange(1);
      },
      onCurrentChange(arr, selectInx) {
        let tmpArr = [];
        tmpArr.push(arr);
        this.selectData = tmpArr;
      },
      onCurrentChangeCancel() {
        this.selectData = [];
      },

      //审核通过
      pass() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }


        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定复核通过吗？",
          onOk: () => {
            let id = list[0].id;
            let url = "/bm/valuate/riskRateManage/func_passRiskRateMangeHis"
            post({ id: id },url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },

      //审核驳回
      refuse() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定拒绝待复核数据吗？",
          onOk: () => {
            let id = list[0].id;
            let url = "/bm/valuate/riskRateManage/func_rejectRiskRateMangeHis"
            post({ id: id },url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },


    },
    mounted() {
      this.getDictListByGroups("RiskOperStatus").then(res => {
        this.dictList = res.get("RiskOperStatus");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
