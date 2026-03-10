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
                    <h-input v-model="queryFormItem.intentionReqId" placeholder=""  :maxlength="16"></h-input>
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
                  <h-form-item prop="transCustType" :label="$t('m.i.be.transCustType')">
                    <h-select v-model="queryFormItem.transCustType" placeholder="" showTitle>
                      <h-option v-for="item in CreditCustTypeList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="creditCustType" :label="$t('m.i.billInfo.creditMainBankType')">
                    <h-select v-model="queryFormItem.creditCustType" placeholder="" showTitle>
                      <h-option v-for="item in CreditCustTypeList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.minResidualTerm')" prop="residualTerm" cols="1" >
                    <h-row>
                      <h-col span="11">
                        <h-form-item prop="minResidualTerm"  style="width:100%">
                          <h-select v-model="queryFormItem.minResidualTerm" filterable placeholder="" showTitle>
                            <h-option v-for="item in TenorCodeList" :value="item.key" :key="item.value">{{ item.value}}
                            </h-option>
                          </h-select>
                        </h-form-item>
                      </h-col>
                      <h-col span="2" style="text-align: center">-</h-col>
                      <h-col span="11">
                        <h-form-item prop="maxResidualTerm"  style="width:100%">
                          <h-select v-model="queryFormItem.maxResidualTerm" filterable placeholder="" showTitle>
                            <h-option v-for="item in TenorCodeList" :value="item.key" :key="item.value">{{ item.value}}
                            </h-option>
                          </h-select>
                        </h-form-item>
                      </h-col>
                    </h-row>
                  </h-form-item>
                  <common-rate-range v-model="queryFormItem" :label="$t('m.i.be.tradRate')"  :integerNum="2"
                                     :suffixNum="4" :rangeProps="['minRate','maxRate']"
                                     :validRules="rateRule"></common-rate-range>
                  <h-form-item prop="sendRange" :label="$t('m.i.be.sendRange')">
                    <h-select v-model="queryFormItem.sendRange" placeholder="" showTitle>
                      <h-option v-for="item in SendRangeList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="transDts" :label="$t('m.i.be.transDt')">
                    <h-date-picker v-model="queryFormItem.transDts" format="yyyy-MM-dd" type="date"
                                   placeholder="" :clearable="false"
                                   showFormat :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="isRelateQuote" :label="$t('m.i.be.changeToQuoted')">
                    <h-select v-model="queryFormItem.isRelateQuote" placeholder="" showTitle>
                      <h-option v-for="item in YonList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
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
                  highlight-row
                  url="/be/market/intention/intentionRcv/func_findIntentionBatchAsResp"
                  :bindForm="queryFormItem"
                  :onCurrentChange="onCurrentChange"
                  :onCurrentChangeCancel="onCurrentChangeCancle"
                  ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @on-click="transToQuote()">{{$t('m.i.be.changeToQuot')}}</h-button>
                  <h-button type="primary" @on-click="viewIntentionBatch()">查看详情</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <intention-show :intentionShow="intentionShow"
                    :needBatchId="needBatchId"
                    :intentionType="intentionType"
                    @intentionShowClose="intentionShowClose"></intention-show>
  </div>
</template>

<script>
  import { post, on, off,formatNumber ,getDictListByGroups,getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "intentionRcv",
    data() {
      return {
        queryFormItem: {
          intentionReqId: "",
          busiType:"",
          trDir: "",
          billType: "",
          billClass: "",
          transCustType: "",
          creditCustType: "",
          residualTerm: "",
          rate: "",
          sendRange: "",
          transDts: "",
          transDt: "",
          minTransDt: "",
          maxTransDt: "",
          minRate: "",
          maxRate: "",
          minResidualTerm: "",
          maxResidualTerm: "",
          isRelateQuote: ""
        },
        columns : [
          {
            title: " ",
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width : 50,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.id'),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.be.intentionReqId'),
            key: "intentionReqId",
            align: "center",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showIntentionBatch(params.row.id,params.row.busiType);
                  }
                }
              }, params.row.intentionReqId);
            }
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            sortable: true,
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
            title: this.$t('m.i.be.changeToQuoted'),
            key: "isRelateQuote",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'Yon', params.row.isRelateQuote);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.transDt && "" !== params.row.transDt) {
                let dttm = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          }
        ],
        needBatchId : "",
        isView : true,
        intentionType : "",
        intentionShow : false,
        ifShowMore : false,
        dictMap : null,
        SendRangeList : [],
        TenorCodeList : [],
        CreditCustTypeList : [],
        TrDirList : [],
        BillClassList : [],
        BillTypeList : [],
        BusiTypeList : [],
        YonList : [],
        selectData : null,
        rateRule: [{ test: this.validRate, trigger: "blur" }],
      };
    },
    components: {
      IntentionShow:()=>import(/* webpackChunkName: "be/market/intention/intentionShow" */`@/views/bizViews/be/market/intention/intentionShow`)
    },

    created() {
      this.queryFormItem.transDt = window.sessionStorage.getItem("workDate");
      this.queryFormItem.transDts = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      getDictListByGroups("CDMedia,DraftTypeCode,TrDir,CreditMajor,TenorCode,SendRange,QuoteBusiType,Yon,BillOrigin").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.TrDirList = res.get("TrDir");
        this.CreditCustTypeList = res.get("CreditMajor");
        this.TenorCodeList = res.get("TenorCode");
        this.SendRangeList = res.get("SendRange");
        this.BusiTypeList = res.get("QuoteBusiType");
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      this.getParams();
    },
    methods: {
      handleSearch() {
        let transDt = this.queryFormItem.transDts.replace(/-/g, "");
        this.queryFormItem.transDt = transDt;
        this.selectData = null;
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      resetSearch() {
        this.queryFormItem.transDt = "";
        this.$refs.queryFormItem.resetFields();
        this.queryFormItem.transDts = window.sessionStorage.getItem("workDate");
      },
      onCurrentChange(currentRow,oldCurrentRow,_index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancle(currentRow,oldCurrentRow,_index){
        this.selectData = null;
      },
      transToQuote() {
        let selects = this.selectData;
        if (null === selects) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "转对话报价",
          content: "确定要转对话报价吗？",
          onOk: () => {
            post({ id: selects.id }, "/be/market/intention/intentionRcv/func_transToQuoteRcv").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      viewIntentionBatch() {
        let selects = this.selectData;
        if (null === selects) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.intentionType = selects.busiType;
        this.needBatchId = selects.id;
        this.intentionShow = true;
      },
      showIntentionBatch(id, busiType){
        this.intentionType = busiType;
        this.needBatchId = id;
        this.intentionShow = true;
      },
      intentionShowClose() {
        this.intentionShow = false;
      },
      getParams(){
        if (this.$route.path === "/be/market/intention/intentionRcv") {
          if (this.$route.query.transDts) {
            this.queryFormItem.transDts = this.$moment(this.$route.query.transDts, "YYYY-MM-DD").format("YYYYMMDD");
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
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
    },
    watch: {
      "$route": "getParams"
    },
  };
</script>

<style scoped>

</style>
