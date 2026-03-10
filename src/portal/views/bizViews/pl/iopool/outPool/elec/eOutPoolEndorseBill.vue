<!--出池背书明细-->
<template>
  <div>
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4"
                      class="h-form-search">
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" prop="likeBillNo" v-model="billManagerFormItem.likeBillNo"></bill-no>
                <bill-range :form-item="billManagerFormItem" :range-props="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
                <h-form-item :label="$t('m.i.billInfo.minBillPackageMoney')" prop="minBillMoney" class="h-form-long-label">
                  <h-typefield type="money" v-model="billManagerFormItem.minBillMoney" :maxlength="20"
                               placeholder="" bigTips divided></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.maxBillPackageMoney')" prop="maxBillMoney" class="h-form-long-label">
                  <h-typefield type="money" v-model="billManagerFormItem.maxBillMoney" :maxlength="20"
                               placeholder="" bigTips divided></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <io-pool-batch-detail :batchDetailParams="outPoolBillParams" ref="ioPoolBatchDetail"></io-pool-batch-detail>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="billManagerColumns"
                      url="/pl/iopool/outpool/elec/eOutPoolEndorseMain/func_pagingQueryOutPoolBill"
                      highlightRow
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      :rowSelect="true"
                      :has-select="false"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="endorseBack"
                          v-if="this.outPoolBillParams.isCommit === 'noCommit'">
                <h-button type="primary">{{$t('m.i.pl.returnBack')}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次退回</h-dropdown-item>
                  <h-dropdown-item name="select">选择退回</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-dropdown placement="bottom-start" @on-click="endorse"
                          v-if="this.outPoolBillParams.isCommit === 'noCommit'">
                <h-button type="primary">{{$t('m.i.pl.enDo')}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次背书</h-dropdown-item>
                  <h-dropdown-item name="select">选择背书</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-dropdown placement="bottom-start" @on-click="endorseCancel"
                          v-if="this.outPoolBillParams.isCommit === 'hasCommit'">
                <h-button type="primary">{{$t('m.i.pl.returnEnDo')}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次撤销背书</h-dropdown-item>
                  <h-dropdown-item name="select">选择撤销背书</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="ghost" @click="returnMain">{{$t('m.i.pl.return')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :bill-range-start="this.billRangeStart" :bill-range-end="this.billRangeEnd"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber ,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "eOutPoolEndorseBill",
    components: {

    },
    data() {
      let billManagerColumns= [
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
          title: this.$t("m.i.billInfo.billOrigin"),
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.outPoolBillParams.dictMap, "BillOrigin", params.row.billOrigin);
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
                let type = "";
                if (!!params.row.billId) {
                  type = "billId";
                } else {
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
        {
          title: this.$t("m.i.billInfo.billRange"),
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
            {
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = this.getDictValueFromMap(this.outPoolBillParams.dictMap, "DraftTypeCode", params.row.billType);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t("m.i.billInfo.flowStatus"),
              key: "flowStatusName",
              ellipsis: false,
              hiddenCol: false
            },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
              key: "billMoney",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let billMoney = formatNumber(params.row.billMoney, 2, ",");
                return h("span", {
                  domProps: {
                    title: billMoney
                  }
                }, billMoney);
              }
            },
            {
              title: this.$t("m.i.billInfo.remitDt"),
              key: "remitDt",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (params.row.remitDt == null || params.row.remitDt === "") {
                  return "";
                }
                let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.dueDt"),
              key: "dueDt",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (params.row.dueDt == null || params.row.dueDt === "") {
                  return "";
                }
                let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.drwrName"),
              key: "drwrName",
              sortable: true,
              ellipsis: false,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeName"),
              key: "pyeeName",
              sortable: true,
              ellipsis: false,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptName"),
              key: "acptName",
              ellipsis: false,
              hiddenCol: false
            }
            // {
            //   title: this.$t("m.i.billInfo.acptProtocalNo"),
            //   key: "acptProtocalNo",
            //   ellipsis: false,
            //   hiddenCol: false
            // },
            // {
            //   title: this.$t("m.i.billInfo.drweBankAddr"),
            //   key: "drweBankAddr",
            //   ellipsis: false,
            //   hiddenCol: false
            // }
          ];
      return {
        ifShowMore: false,
        dueDt: [],
        remitDt: [],
        billManagerFormItem: {
          batchId: "",
          funcNo: "",
          billClass: "",
          likeBillNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          minRemitDt: "",
          maxRemitDt: ""
        },
        billManagerColumns: billManagerColumns,
        cloneBillManagerColumns: this.deepClone(billManagerColumns),
        currentSelectList: [],
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart: "",
        billRangeEnd: "",
      }
    },
    props: {
      billManagerVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      outPoolBillParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          batchId: "",
          funcNo: "",
          billClass: "",
          accountType: "",
          batchInfoUrl: ""    //查询批次信息对应Url
        }
      }
    },
    computed: {
      tempBillManagerVue: {
        get() {
          return this.billManagerVue;
        },
        set() {
        }
      }
    },
    mounted() {

    },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.outPoolBillParams.batchId;
          this.billManagerFormItem.funcNo = this.outPoolBillParams.funcNo;
          this.billManagerFormItem.billClass = this.outPoolBillParams.billClass;
          this.$nextTick(() => {
            this.billManagerColumns = this.deepClone(this.cloneBillManagerColumns);
            this.$refs.billManagerDatagrid.createShowCol(this.cloneBillManagerColumns);
            this.handleSearch();
          });
        }
      }
    },
    methods: {
      handleDueDtChange(arr) {
        if (arr&&arr.length==2){
          this.billManagerFormItem.minDueDt = arr[0].replace(/-/g, "");
          this.billManagerFormItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.billManagerFormItem.minDueDt = "";
          this.billManagerFormItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handleRemitDtChange(arr) {
        if (arr&&arr.length==2){
          this.billManagerFormItem.minRemitDt = arr[0].replace(/-/g, "");
          this.billManagerFormItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.billManagerFormItem.minRemitDt = "";
          this.billManagerFormItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectList = [];
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.billManagerDatagrid.selectIds = [];
        this.billManagerFormItem.minBillMoney = this.billManagerFormItem.minBillMoney.toString().replace(/,/g, "");
        this.billManagerFormItem.maxBillMoney = this.billManagerFormItem.maxBillMoney.toString().replace(/,/g, "");
        this.billManagerFormItem.minDueDt = this.billManagerFormItem.minDueDt.toString().replace(/-/g, "");
        this.billManagerFormItem.maxDueDt = this.billManagerFormItem.maxDueDt.toString().replace(/-/g, "");
        this.billManagerFormItem.minRemitDt = this.billManagerFormItem.minRemitDt.toString().replace(/-/g, "");
        this.billManagerFormItem.maxRemitDt = this.billManagerFormItem.maxRemitDt.toString().replace(/-/g, "");
        this.$refs.billManagerDatagrid.dataChange(1);
        this.$refs.ioPoolBatchDetail.getIoPoolBatchInfo();
      },
      //重置表单查询结果
      resetSearch() {
        this.billManagerFormItem.likeBillNo = "";
        this.billManagerFormItem.minBillMoney = "";
        this.billManagerFormItem.maxBillMoney = "";
        this.billManagerFormItem.minDueDt = "";
        this.billManagerFormItem.maxDueDt = "";
        this.billManagerFormItem.minRemitDt = "";
        this.billManagerFormItem.maxRemitDt = "";
        this.dueDt = [];
        this.remitDt = [];
        this.$refs.billManagerFormItem.resetFields();
      },
      //行选中
      billManagerHandleRowClick(arr) {
        this.currentSelectList = arr;
      },
      //批次退回或选择退回
      endorseBack(type) {
        this.currentSelectList = this.$refs.billManagerDatagrid.selects;
        if (type === "select") {
          let list = this.currentSelectList;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let outPoolIds = this.$refs.billManagerDatagrid.selectIds;
          let params = params = {
            batchId: this.outPoolBillParams.batchId,
            listIds: outPoolIds.join(","),
            isPass: "0"
          };
          this.handleBackSubmit(params, "back", type);
        } else if (type === "batch") {
          if (this.$refs.billManagerDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = { batchId: this.outPoolBillParams.batchId, isPass: "0" };
          this.handleBackSubmit(params, "back", type);
        }
      },
      //批次背书或选择背书
      endorse(type) {
        this.currentSelectList = this.$refs.billManagerDatagrid.selects;
        if (type === "select") {
          let list = this.currentSelectList;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let outPoolIds = this.$refs.billManagerDatagrid.selectIds;
          let params = {
            batchId: this.outPoolBillParams.batchId,
            listIds: outPoolIds.join(","),
            isPass: "1"
          };
          this.handleBackSubmit(params, "endorse", type);
        } else if (type === "batch") {
          if (this.$refs.billManagerDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = {
            batchId: this.outPoolBillParams.batchId,
            isPass: "1"
          };
          this.handleBackSubmit(params, "endorse", type);
        }
      },
      //批次撤销背书或选择撤销背书
      endorseCancel(type) {
        this.currentSelectList = this.$refs.billManagerDatagrid.selects;
        if (type === "select") {
          let list = this.currentSelectList;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let outPoolIds = this.$refs.billManagerDatagrid.selectIds;
          let params = {
            batchId: this.outPoolBillParams.batchId,
            listIds: outPoolIds.join(","),
          };
          this.handleBackSubmit(params, "endorseCancel", type);
        } else if (type === "batch") {
          if (this.$refs.billManagerDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = {
            batchId: this.outPoolBillParams.batchId
          };
          this.handleBackSubmit(params, "endorseCancel", type);
        }
      },
      handleBackSubmit(params, signType, type) {
        let content = signType === "back" ? "确定退回吗?" : signType === "endorse" ? "确定背书吗?" : "确定撤销背书吗";
        let url = signType === "endorseCancel" ? "/pl/iopool/outpool/elec/eOutPoolEndorseMain/func_cancelEndorseApply" : "/pl/iopool/outpool/elec/eOutPoolEndorseMain/func_submitEndorseApply";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          onOk: () => {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (type === "batch" || this.$refs.billManagerDatagrid.tData.length === this.currentSelectList.length) {
                    this.returnMain();
                  } else {
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                    this.$refs.ioPoolBatchDetail.getIoPoolBatchInfo();
                    this.currentSelectList = [];
                    this.$refs.billManagerDatagrid.selects = [];
                    this.$refs.billManagerDatagrid.selectIds = [];
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //返回主页面
      returnMain() {
        this.resetSearch();
        this.$emit("returnEndorseMain", "");
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info.billId;
        } else {
          this.billNo = info.billNo;
        }
        this.billRangeStart = info.billRangeStart;
        this.billRangeEnd = info.billRangeEnd;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
