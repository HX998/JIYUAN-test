<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="queryFormItem" :model="queryFormItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="intentionReqId" :label="$t('m.i.be.intentionReqId')" class="h-form-long-label">
                    <h-input v-model="queryFormItem.intentionReqId" :maxlength="16"></h-input>
                  </h-form-item>
                  <h-form-item prop="busiType" :label="$t('m.i.common.busiType')">
                    <h-select v-model="queryFormItem.busiType" placeholder="" showTitle>
                      <h-option v-for="item in BusiTypeList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="trDir" :label="$t('m.i.be.tradDir')">
                    <h-select v-model="queryFormItem.trDir" placeholder="" showTitle>
                      <h-option v-for="item in TrDirList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
                    <h-select v-model="queryFormItem.billType" placeholder="" showTitle>
                      <h-option v-for="item in BillTypeList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                    <h-select v-model="queryFormItem.billClass" placeholder="" showTitle>
                      <h-option v-for="item in BillClassList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <common-rate-range v-model="queryFormItem" :label="$t('m.i.be.tradRate')"  :integerNum="2"
                                     :suffixNum="4" :rangeProps="['minRate','maxRate']"
                                     :validRules="rateRule"></common-rate-range>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                      class="icon iconfont"
                      :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            url="/be/market/intention/intentionCancel/func_findPreCancelIntentionBatch"
            :bindForm="queryFormItem"
            :rowSelect="true"
            :hasSelect="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="sendIntentionCancel()">{{$t('m.i.common.revoke')}}</h-button>
              <h-button type="primary" @on-click="viewIntentionBatch()">{{$t('m.i.common.showDetail')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <remark-msg-box :remarkWin="remarkWin" title="意向询价撤销附言" label="撤销附言" :param="param" @remarkWinClose="remarkWinClose"
                    @remarkWinSubmit="remarkWinSubmit" :maxlength="50"></remark-msg-box>
    <intention-show :intentionShow="intentionShow"
                    :needBatchId="needBatchId"
                    :intentionType="intentionType"
                    @intentionShowClose="intentionShowClose"></intention-show>
  </div>
</template>

<script>
  import {post, on, off, formatNumber, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "intentionCancel",
    data() {
      return {
        queryFormItem: {
          intentionReqId: "",
          trDir: "",
          busiType: "",
          billType: "",
          billClass: "",
          rate: "",
          minRate: "",
          maxRate: ""
        },
        columns: [
          {
            type: "selection",
            hiddenCol: false,
            width: 50,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width: 50,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.id"),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.common.status'),
            key: "intentionStatus",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'IntentionStatus', params.row.intentionStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.intentionReqId'),
            key: "intentionReqId",
            hiddenCol: false,
            sortable: true,
            align: "center",
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showIntentionBatch(params.row.id, params.row.busiType);
                  }
                }
              }, params.row.intentionReqId);
            }
          },
          {
            title: this.$t('m.i.be.tradDir'),
            key: "trDir",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'TrDir', params.row.trDir);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.sendBrchName'),
            key: "sendBrchName",
            align: "center",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.be.sendTraderName'),
            key: "sendTraderName",
            align: "center",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.be.sendRange'),
            key: "sendRange",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'SendRange', params.row.sendRange);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.transCustType'),
            key: "transCustType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let keyList = params.row.transCustType.split(",");
              if (keyList.length === this.CreditCustTypeList.length) {
                return h("span", "");
              }
              let valueList = [];
              for (let i = 0; i < keyList.length; i++) {
                valueList.push(getDictValueFromMap(this.dictMap, "CreditMajor", keyList[i]));
              }
              return h("span", valueList.join(","));
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            align: "center",
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
            key: "billClass",
            align: "center",
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
            title: this.$t('m.i.be.tradRate'),
            key: "rate",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.rate, 4, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueTradRate'),
            key: "dueRate",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueRate, 4, ','))
            }
          },
          {
            title: this.$t('m.i.be.totalAmtBillPackageByTenThousandUnit'),
            key: "totalAmt",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.buyBackTotalAmtByUnit'),
            key: "buyBackTotalAmt",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.buyBackTotalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.minResidualTerm'),
            key: "minResidualTerm",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.minResidualTerm && params.row.maxResidualTerm) {
                let minResidualTerm = getDictValueFromMap(this.dictMap, "TenorCode", params.row.minResidualTerm);
                let maxResidualTerm = getDictValueFromMap(this.dictMap, "TenorCode", params.row.maxResidualTerm);
                if (minResidualTerm !== "" && maxResidualTerm !== "") {
                  return h("span", minResidualTerm + "-" + maxResidualTerm);
                }
              }
              return h("span", "");
            }
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditCustType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let keyList = params.row.creditCustType.split(",");
              if (keyList.length === this.CreditCustTypeList.length) {
                return h("span", "");
              }
              let valueList = [];
              for (let i = 0; i < keyList.length; i++) {
                valueList.push(getDictValueFromMap(this.dictMap, "CreditMajor", keyList[i]));
              }
              return h("span", valueList.join(","));
            }
          },
          {
            title: this.$t('m.i.be.transDt'),
            key: "transDt",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.transDt && "" !== params.row.transDt) {
                let dttm = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false,
            align: "center",

          }
        ],
        intentionType: "",
        needBatchId: "",
        intentionShow: false,
        ifShowMore: false,
        dictMap: null,
        SendRangeList: [],
        TenorCodeList: [],
        CreditCustTypeList: [],
        TrDirList: [],
        BillClassList: [],
        BillTypeList: [],
        BusiTypeList: [],
        remarkWin: false,
        param: {},
        rateRule: [{ test: this.validRate, trigger: "blur" }],
      };
    },
    components: {
      IntentionShow: () => import(/* webpackChunkName: "be/market/intention/intentionShow" */`@/views/bizViews/be/market/intention/intentionShow`)
    },

    mounted() {
      getDictListByGroups("CDMedia,DraftTypeCode,TrDir,CreditMajor,TenorCode,SendRange,QuoteBusiType,IntentionStatus,BillOrigin").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.TrDirList = res.get("TrDir");
        this.CreditCustTypeList = res.get("CreditMajor");
        this.BusiTypeList = res.get("QuoteBusiType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.unDisabled();
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      resetSearch() {
        this.$refs.queryFormItem.resetFields();
      },
      viewIntentionBatch() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return
        }
        this.intentionType = list[0].busiType;
        this.needBatchId = list[0].id;
        this.intentionShow = true;
      },
      showIntentionBatch(id, busiType) {
        this.intentionType = busiType;
        this.needBatchId = id;
        this.intentionShow = true;
      },
      intentionShowClose() {
        this.intentionShow = false;
      },
      sendIntentionCancel() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          if(list[i].intentionStatus !== "IQS02"){
            this.$msgTip.info(this, {info: "意向询价批次状态不为已发送，不能撤销"});
            return;
          }
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.param.ids = ids;
        this.remarkWin = true;
      },
      remarkWinClose(){
        this.remarkWin = false;
      },
      remarkWinSubmit(param, remark){
        post({ids: param.ids,note: remark}, "/be/market/intention/intentionCancel/func_sendIntentionCancel").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.remarkWinClose();
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      validRate(rule, val, callback) {
        if (this.queryFormItem.minRate === "" || this.queryFormItem.maxRate === "") {
          callback();
          return;
        }
        if (this.queryFormItem.minRate > this.queryFormItem.maxRate) {
          callback(new Error("最大交易利率不能小于最小交易利率"));
        } else {
          callback();
        }
      }
    }
  };
</script>

<style scoped>

</style>
