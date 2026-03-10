<!--托管票据信息查询申请 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.billInfo.billOrigin')"  prop="billOrigin">
                    <h-select v-model="formItem.billOrigin" placeholder="">
                      <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.billNoLike" prop="billNoLike"></bill-no>
                  <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
                  <bill-money :label="$t('m.i.billInfo.billPackageMoney')" :formItem="formItem" class="h-form-long-label"></bill-money>


                  <h-form-item :label="$t('m.i.common.status')" prop="queryStatus">
                    <h-select v-model="formItem.queryStatus" placeholder="">
                      <h-option v-for="item in queryStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <common-date-picker :label="$t('m.i.common.queryDt')"
                    :value="formItem.queryDt" type="daterange"
                                      prop="queryDt"
                                      autoPlacement :rangeValue="['minQueryDt','maxQueryDt']"
                                      :minQueryDt.sync="formItem.minQueryDt" :maxQueryDt.sync="formItem.maxQueryDt"
                                      placeholder=""></common-date-picker>

                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">
                      {{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="handleReset()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            hasPage
            highlight-row
            url="/be/trust/trustbill/indexTrustBillApply/func_queryTrustBillApply"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="apply()">{{$t('m.i.be.apply')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <h-msg-box title="托管票据信息查询申请"
               width="800"
               v-model="applyWin"
               :mask-closable="maskclosable"
               :maximize="maximize"
               @on-close="cancleWin">
      <!--表单主体-->
      <h-panel>
        <h-form :model="applyForm" :label-width="115" ref="applyForm" cols="2" class="h-form-search">
          <div class="h-search-form-row">
            <common-date-picker :label="$t('m.i.common.queryDt')"
                                :value="applyForm.queryDt" type="date" autoPlacement
                                :readonly="true"
                                placeholder=""></common-date-picker>
            <h-form-item :label="$t('m.i.common.queryType')" prop="queryWay" required>

              <h-select v-model="applyForm.queryWay" placeholder="">
                <h-option v-for="item in queryWayList" :value="item.key" :key="item.key">{{item.value }}</h-option>
<!--                <h-option value="CQT01">持有票据明细查询申请</h-option>-->
<!--                <h-option value="CQT03">质权票据明细查询申请</h-option>-->
              </h-select>
            </h-form-item>
            <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="applyForm.billNo" prop="billNo" required :validRules="billNoRule"></bill-no>
            <bill-range :form-item="applyForm" :range-props="['billRangeStart','billRangeEnd']" ></bill-range>
            <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" required >
              <h-typefield v-model="applyForm.billMoney" integerNum="13" placeholder="" type="money" :immeDivided="true"
                           bigTips :nonNegative="true"></h-typefield>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="cancleWin()">{{$t("m.i.common.cancle")}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";
  import BillMoney from "../../../../../components/bemp/input/billMoney";

  export default {
    name: "indexTrustBillApply",
    components: {BillMoney},
    data() {
      return {
        billNoRule: [{ test: validBillNo, trigger: "blur" }],
        billId: "",
        billNo: "",
        showBillInfoWin: false,
        billOriginList: [],
        queryStatusList: [],
        queryWayList: [],
        // 用于查询的表单
        formItem: {
          queryDt: [],
          billOrigin: "",
          billNoLike: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          minBillMoney: "",
          maxBillMoney: "",
          minQueryDt: "",
          maxQueryDt: "",

        },
        maximize: true,//是否允许最大化
        maskclosable: false,//是否允许点击遮罩层关闭
        //是否必填
        isRequired: true,
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              if ('CS00'===list){
                list='';
              }
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            align: "center",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("div", [
                h("span", formatNumber(params.row.billMoney, 2, ","))
              ]);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "queryStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "QueryStatus", params.row.queryStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.queryDt"),
            key: "queryDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.queryDt == null || params.row.queryDt === "") {
                return "";
              }
              let date = this.$moment(params.row.queryDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.queryType"),
            key: "queryWay",
            hiddenCol: false,
            render: (h, params) => {
              let queryWay = params.row.queryWay;
              if (queryWay != null && queryWay !== "") {
                switch (queryWay) {
                  case "CQT01":
                    queryWay = "持有票据明细查询申请";
                    break;
                  case "CQT03":
                    queryWay = "质权票据明细查询申请";
                    break;
                  default :
                    queryWay = params.row.queryWay;
                }
              }
              return h("span", queryWay);
            }
          },
        ],
        //现在选中的行
        currentSelectRow: null,
        //用于申请的表单
        applyForm: {
          queryDt: this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD").replace(/-/g, ""),
          queryWay: "",
          billRangeStart: "",
          billRangeEnd: "",
          billNo: "",
          billMoney: ""
        },
        dictMap: new Map(),
        applyWin: false,
        ifShowMore: false
      };
      function validBillNo(rule, val, callback) {
        let paperRe = /^[0-9]{16}$/;
        let elecRe = /^[0-9]{30}$/;
        if (paperRe.test(val)) {
          callback();
        }else if (elecRe.test(val)){
          callback();
        }else {
          callback(new Error("纸票为16位数字，电票为30位数字"));
        }

      };
    },
    methods: {
      apply() {
        this.applyWin = true;
      },
      //查询按钮点击事件
      handleSearch() {
        let min = Number(this.formItem.minBillMoney);
        let max = Number(this.formItem.maxBillMoney);
        if (min != 0 && max != 0) {
          if (min > max) {
            this.$msgTip.error(this, { info: "票据(包)金额(元)最小值不能超过最大值" });
          } else {
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.currentSelectRow = [];
          this.$refs.datagrid.dataChange(1);
        }
      },
      handleReset() {
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
        showBillInfo(billId, billNo) {
            this.billId = billId;
            this.billNo = billNo;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      submitForm() {
        this.$refs["applyForm"].validate(valid => {
          if (valid) {
            let url = "/be/trust/trustbill/indexTrustBillApply/func_trustBillInfoQuery";
            post(this.applyForm, url).then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.addSuccess") });
                  this.applyWin = false;
                  this.$refs.applyForm.resetFields();
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed") + res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      cancleWin() {
        this.$refs.applyForm.resetFields();
        this.applyWin = false;
      }
    },
    mounted() {
      this.getDictListByGroups("BillOrigin,QueryStatus,TrustQueryType").then(res => {
        this.billOriginList = res.get("BillOrigin");
        this.queryStatusList = res.get("QueryStatus");
        this.queryWayList = res.get("TrustQueryType");
        this.dictMap = res.get("map");
      })
    }

  };
</script>

<style scoped>

</style>
