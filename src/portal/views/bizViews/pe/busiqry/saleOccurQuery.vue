<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.transBrchNos" :label="$t('m.i.be.ownBrchName')" prop="transBrchNos"
                             isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.transBrchNos"
                             :brchName.sync="formItem.transBrchNameList"></show-branch>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                  <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.value">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.value">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
                  <h-input v-model="formItem.acptName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.firstSettleDt')" prop="firstSettleDt">
                  <h-date-picker :value="firstSettleDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleFirstSettleDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.dueSettleDt')" prop="dueSettleDt">
                  <h-date-picker :value="dueSettleDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueSettleDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.firstAcctDt')" prop="acctDt">
                  <h-date-picker :value="acctDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleAcctDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.dueAcctDt')" prop="dueAcctDt">
                  <h-date-picker :value="dueAcctDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueAcctDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <common-type-field-range v-model="formItem" :label="$t('m.i.pe.ratePct')" :integerNum="3" :suffixNum="4"
                                         :validRules="ratePctRule" :bigTips="false" class="h-form-long-label"
                                         :rangeProps="['minRatePct','maxRatePct']"></common-type-field-range>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.quoteNo')" prop="quoteNo">
                  <h-input v-model="formItem.quoteNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiTypeList" placeholder="" multiple showTitle>
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.assetIndustry')" prop="assetIndustry" v-if="openI9flag">
                  <h-select v-model="formItem.assetIndustry" placeholder="">
                    <h-option v-for="item in busiClassifyList" :value="item.key" :key="item.value">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.isInnerScene')" prop="isInner">
                  <h-select v-model="formItem.isInner" placeholder="">
                    <h-option v-for="item in isInnerSceneList" :value="item.key" :key="item.value">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.otherBrchName')" prop="buyBrchName">
                  <h-input v-model="formItem.buyBrchName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pe.sumBillPackageMoney')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.totalPayInterest')"  class="h-form-long-label">
                    <h-input v-model="totalPayInterest" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.totalsettleAmt')" class="h-form-long-label">
                    <h-input v-model="totalFirstSettleAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pe.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.weightRemainderAverDays')" class="h-form-long-label">
                    <h-input v-model="weightRemainderAverDays" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.weightAverRate')" class="h-form-long-label">
                    <h-input v-model="weightAverRate" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="showColumns"
            :url="queryUrl"
            :bindForm="formItem"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            hasPage
            showListCkeckBox
            :hasSelect="false"
            :rowSelect="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="querySaleOccurBatch()">{{$t("m.i.pe.queryAcptOccurBatch")}}</h-button>
              <h-button type="primary" @click="querySaleOccurBill">{{$t("m.i.pe.queryAcptOccurBill")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('batch')" :disabled="this.ifDisabledExport">
                {{$t("m.i.pe.arrayExport")}}
              </h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('bill')" :disabled="!this.ifDisabledExport">
                {{$t("m.i.pe.flowExport")}}
              </h-button>
              <h-button type="primary"  @click="bulkPrintBill" :billId="this.billId" :billIds="this.billIds"
                        :disabled="!this.ifDisabledPrint" v-if="isShowPrintBtn">{{$t("m.i.pc.billFrontPrint")}}
              </h-button>
              <h-button type="primary"  @click="bulkPrintOutEndo" :billId="this.billId" :billIds="this.billIds"
                        :disabled="!this.ifDisabledPrint" v-if="isShowPrintBtn">{{$t("m.i.pc.endoPrint")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>

      </h-col>
    </h-row>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

    <bill-infos-main @billInfosWinClose="billInfosWinClose" @bulkPrintBillFlagClose = "bulkPrintBillFlagClose" @bulkPrintOutEndoFlagClose="bulkPrintOutEndoFlagClose" @bulk :showBillInfoWin="showBillInfosWin" :billIds="this.billIds"
                     :billNos="this.billNos" :billRangeStarts="this.billRangeStarts" :billRangeEnds="this.billRangeEnds" ref="billInfosMain" :bulkPrintBillFlag="bulkPrintBillFlag" :bulkPrintOutEndoFlag="bulkPrintOutEndoFlag" v-if="showBillInfosWin"></bill-infos-main>


    <sale-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :saleDetailWin="showDetilBox"
                 @closeMsgBox="closeDetil"></sale-detail>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import {post, on, off, formatNumber, exportList} from "@/api/bizApi/commonUtil";
  import {accMul} from "../../../../api/bizApi/commonUtil";

  export default {
    name: "saleOccurQuery",
    components: {
      SaleDetail: () => import(/* webpackChunkName: "be/market/quote/sale/saleDetail" */`@/views/bizViews/be/market/quote/sale/saleDetail`),
    },
    data() {
      let batchColumns = [
        {
          type: "selection",
          width: 50,
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
          title: this.$t("m.i.common.batchNo"),
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showDetil(params.row.id, params.row.busiType);
                }
              }
            }, params.row.batchNo);
          }
        },
        {
          title: this.$t("m.i.pe.dealDtTm"),
          key: "dealDtTm",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "");
          }
        },
        {
          title: this.$t("m.i.pe.otherBrchName"),
          key: "buyBrchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.be.otherTraderBrchClass"),
          key: "buyBrchClass",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "TraderBrchClass", params.row.buyBrchClass);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pe.quoteNo"),
          key: "quoteNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.busiType"),
          key: "busiType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "QuoteBusiType", params.row.busiType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pc.isInnerScene"),
          key: "isInner",
          hiddenCol: false,
          render: (h, params) => {
            let isInner = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isInner);
            return h("span", {
              domProps: {
                title: isInner
              }
            }, isInner);
          }
        },
        {
          title: this.$t("m.i.pe.batchStatus"),
          key: "batchStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "QuoteBatchStatus", params.row.batchStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pe.dealNo"),
          key: "dealNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.dealStatus"),
          key: "dealStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "QuoteStatus", params.row.dealStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pe.preTradeBhvr"),
          key: "preTradeBhvr",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "PreTradeBhvr", params.row.preTradeBhvr);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pe.ownBrchName"),
          key: "saleBrchName",
          hiddenCol: false

        },
        {
          title: this.$t("m.i.pc.buyTraderName"),
          key: "saleTraderName",
          hiddenCol: false
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
          title: this.$t("m.i.billInfo.billClass"),
          key: "billClass",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pe.ratePct"),
          key: "ratePct",
          sortable: true,
          hiddenCol: false,
          sortMethod: (a, b, type) => {
            if (type === "asc") {
              let a1 = parseFloat(a);
              let a2 = parseFloat(b);
              if (isNaN(a1)) return -1;
              if (isNaN(a2)) return 1;
              return a1 - a2;
            } else if (type === "desc") {
              let a1 = parseFloat(a);
              let a2 = parseFloat(b);
              if (isNaN(a1)) return 1;
              if (isNaN(a2)) return -1;
              return a2 - a1;
            }
          }
        },
        {
          title: this.$t("m.i.pe.dueRatePct"),
          key: "dueRatePct",
          sortable: true,
          hiddenCol: false,
          sortMethod: (a, b, type) => {
            if (type === "asc") {
              let a1 = parseFloat(a);
              let a2 = parseFloat(b);
              if (isNaN(a1)) return -1;
              if (isNaN(a2)) return 1;
              return a1 - a2;
            } else if (type === "desc") {
              let a1 = parseFloat(a);
              let a2 = parseFloat(b);
              if (isNaN(a1)) return 1;
              if (isNaN(a2)) return -1;
              return a2 - a1;
            }
          }
        },
        {
          title: this.$t("m.i.pe.subDeal"),
          key: "subDeal",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.subDeal);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pe.clearSpeed"),
          key: "clearSpeed",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "ClearSpeed", params.row.clearSpeed);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        }, {
          title: this.$t("m.i.pe.firstAcctDt"),
          key: "acctDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("span", params.row.acctDt ? this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
          }
        }, {
          title: this.$t("m.i.pe.dueAcctDt"),
          key: "dueAcctDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("span", params.row.dueAcctDt ? this.$moment(params.row.dueAcctDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
          }
        }, {
          title: this.$t("m.i.pe.firstSettleDt"),
          key: "firstSettleDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("span", params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
          }
        }, {
          title: this.$t("m.i.pe.dueSettleDt"),
          key: "dueSettleDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("span", params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
          }
        },
        {
          title: this.$t("m.i.pe.settleMode"),
          key: "settleMode",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        }, {
          title: this.$t("m.i.pe.clearType"),
          key: "clearType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "ClearType", params.row.clearType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        }, {
          title: this.$t("m.i.pe.quoteTm"),
          key: "quoteTm",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.setTm"),
          key: "setTm",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.totalAmtBillPackage"),
          key: "totalAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.totalAmt, 2, ","));
          }
        }, {
          title: this.$t("m.i.pc.firstPayInterest"),
          key: "firstPayInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
          }
        },
        {
          title: this.$t("m.i.pe.dueInterest"),
          key: "dueInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.dueInterest, 2, ","));
          }
        },
        {
          title: this.$t("m.i.pc.firstSettleAmt"),
          key: "firstSettleAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
          }
        }, {
          title: this.$t("m.i.pe.dueSettleAmt"),
          key: "dueSettleAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.dueSettleAmt, 2, ","));
          }
        },
        {
          title: this.$t("m.i.pc.tenorDays"),
          key: "tenorDays",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.totalNumBillPackage"),
          key: "totalNum",
          hiddenCol: false
        }, {
          title: this.$t("m.i.be.firstClearStatus"),
          key: "clearStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "StlResult", params.row.clearStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pc.dueClearStatus"),
          key: "dueClearStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "StlResult", params.row.dueClearStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pc.acctStatus"),
          key: "acctStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pc.dueAcctFlag"),
          key: "dueAcctFlag",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.dueAcctFlag);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pe.buyProductName"),
          key: "buyProductName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.oppoTraderName"),
          key: "buyTraderName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.buyProductName"),
          key: "saleProductName",
          sortable: true,
          hiddenCol: false
        },
      ];
      return {
        ratePctRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        openI9flag: false,
        formItem: {
          transBrchNos: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          billOrigin: "",
          billNoLike: "",
          billClass: "",
          billType: "",
          minBillMoney: "",
          maxBillMoney: "",
          acptName: "",
          minDueDt: "",
          maxDueDt: "",
          minRemitDt: "",
          maxRemitDt: "",
          minFirstSettleDt: "",
          maxFirstSettleDt: "",
          minDueSettleDt: "",
          maxDueSettleDt: "",
          minAcctDt: "",
          maxAcctDt: "",
          minDueAcctDt: "",
          maxDueAcctDt: "",
          minRatePct: "",
          maxRatePct: "",
          batchNo: "",
          quoteNo: "",
          busiTypeList: [],
          isInner: "",
          buyBrchName: "",
          assetIndustry: "",
          minBillRangeStart: '',
          maxBillRangeEnd: ''
        },
        //设置列表列内容
        batchColumns: batchColumns,
        billColumns: [
          {
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pe.oppositeBrchName"),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.otherTraderBrchClass"),
            key: "buyBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "TraderBrchClass", params.row.buyBrchClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "QuoteBusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.packetSeq"),
            key: "packetSeq",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },


          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
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
            title: this.$t("m.i.billInfo.dueMatDt"),
            key: "dueMatDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
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
            title: this.$t("m.i.be.assetIndustry"),
            key: "assetIndustry",
            hiddenCol: window.sessionStorage.getItem("isOpenI9") == "1" ? false : true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AssetIndustry", params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pe.firstSettleDt"),
            key: "firstSettleDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.pe.dueSettleDt"),
            key: "dueSettleDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.pe.ratePct"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
            sortMethod: (a, b, type) => {
              if (type === "asc") {
                let a1 = parseFloat(a);
                let a2 = parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1 - a2;
              } else if (type === "desc") {
                let a1 = parseFloat(a);
                let a2 = parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2 - a1;
              }
            }
          },
          {
            title: this.$t("m.i.pe.dueRatePct"),
            key: "dueRatePct",
            hiddenCol: false,
            sortable: true,
            sortMethod: (a, b, type) => {
              if (type === "asc") {
                let a1 = parseFloat(a);
                let a2 = parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1 - a2;
              } else if (type === "desc") {
                let a1 = parseFloat(a);
                let a2 = parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2 - a1;
              }
            }
          },
          {
            title: this.$t("m.i.pc.first1PayInterest"),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let firstPayInterest = formatNumber(params.row.firstPayInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: firstPayInterest
                }
              }, firstPayInterest);
            }
          },
          {
            title: this.$t("m.i.be.dueInterestByUnit"),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueInterest = formatNumber(params.row.dueInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: dueInterest
                }
              }, dueInterest);
            }
          },
          {
            title: this.$t("m.i.pc.firstSettleAmt"),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let firstSettleAmt = formatNumber(params.row.firstSettleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: firstSettleAmt
                }
              }, firstSettleAmt);
            }
          },
          {
            title: this.$t("m.i.pe.dueSettleAmt"),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueSettleAmt = formatNumber(params.row.dueSettleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: dueSettleAmt
                }
              }, dueSettleAmt);
            }
          },
          {
            title: this.$t("m.i.pc.remainDays"),
            key: "remainDays",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.dueRemainDays"),
            key: "dueRemainDays",
            hiddenCol: false
          },

          {
            title: this.$t("m.i.billInfo.cfmAppBrchCode"),
            key: "cfmAppBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.cfmAppBankName"),
            key: "cfmAppBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.discDt ? this.$moment(params.row.discDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.pe.discBrchCode"),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pe.guarntrTrustBrchCode"),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "guarntrTrustBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.creditMainBrchCode"),
            key: "creditMainBrchCode",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankName"),
            key: "creditMainBankName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'CreditMajor', params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pe.ownBrchName"),
            key: "saleBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pe.ownTraderName"),
            key: "saleTraderName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.custTraderName"),
            key: "buyTraderName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.lastOppName'),
            key: "oppName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.lastRebuyRate'),
            key: "buyRate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.buyRate != null && params.row.buyRate !== "") {
                let rate = accMul(params.row.buyRate, 100);
                rate = formatNumber(rate,4, '');
                return h("span", rate);
              }
            }
          },
        ],
        rgstDtHisWin: false,
        rgstDtHisForm: {
          listId: "",
          acptId: ""
        },
        firstSettleDt: [],
        dueSettleDt: [],
        acctDt: [],
        remitDt: [],
        dueDt: [],
        dueAcctDt: [],
        yonList: [],
        billClassList: [],
        isInnerSceneList: [],
        billTypeList: [],
        busiClassifyList: [],
        billOriginList: [],
        TraderBrchClassList: [],
        dictMap: new Map(),
        billIds: [],
        billNos: [],
        billRangeStarts: [],
        billRangeEnds: [],
        maxPrintNum: 1,
        billId: "",
        billNo: "",
        billRangeStart: '',
        billRangeEnd: '',
        //是否显示更多查询项
        ifShowMore: false,
        showBillInfoWin: false,
        showBillInfosWin: false,
        isShowPrintBtn: false,
        bulkPrintBillFlag: false,
        bulkPrintOutEndoFlag: false,
        tempShowExcelTemplateWin: false,
        queryUrl: "/be/market/quote/saleOccurQuery/func_findOccurSaleBatch",
        showColumns: this.deepClone(batchColumns),
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        totalPayInterest: "",
        totalFirstSettleAmt: "",
        weightRemainderAverDays: "",
        weightAverRate: "",
        selectExportType: "",
        ifDisabledExport: false,
        ifDisabledPrint: false,
        showDetilBox: false,
        batchId: '',
        busiType: '',
        busiTypeList: [],
        acctStatusList: [],
        dealStatusList: [],
        clearStatusList: [],
        querySaleOccurUrl: "/be/market/quote/saleOccurQuery/getSumAmtInfo"
      };
    },
    mounted() {
      this.buttonAuthShow();
      this.openI9flag = window.sessionStorage.getItem('isOpenI9') == '1' ? true : false;
      this.getDictListByGroups("PreRelationFlag,QuoteBatchStatus,BookType,AssetIndustry,CreditDeductRule,DraftTypeCode,CdSelectMode,CDMedia,QuoteBusiType,AcctFlag,QuoteStatus,SettleType,PreTradeBhvr,Yon,ClearSpeed,ClearType,StlResult,MmbStlStatus,CreditMajor,BillOrigin,TraderBrchClass").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.busiTypeList = res.get("QuoteBusiType");
        this.acctStatusList = res.get("AcctFlag");
        this.dealStatusList = res.get("QuoteStatus");
        this.clearStatusList = res.get("StlResult");
        this.isInnerSceneList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        this.TraderBrchClassList = res.get("TraderBrchClass");
        this.busiClassifyList = res.get("AssetIndustry").filter(item => item.key != "0");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      buttonAuthShow() {
        //按钮权限查询 控制按钮显隐
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
              if (this.btnAuth.isShowPrintBtn === undefined ? false : this.btnAuth.isShowPrintBtn.isShow) {
                this.isShowPrintBtn = true;
              } else {
                this.isShowPrintBtn = false;
              }
            } else {
              this.$msgTip.error(this, {info: retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      showDetil(i, busiType) {
        this.batchId = i;
        this.busiType = busiType;
        this.showDetilBox = true;
      },
      closeDetil() {
        this.showDetilBox = false;
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        if (params.sumMoney) {
          this.sumMoney = formatNumber(params.sumMoney, 2, ",");
        } else {
          this.sumMoney = "0.00";
        }
        let statDatas = params.statDatas;
        if (statDatas && statDatas.indexOf(",")!==-1) {
          let statDataArry = statDatas.split(",");
          if (statDataArry[1]) {
            this.totalPayInterest = formatNumber(statDataArry[1], 2, ",");
          } else {
            this.totalPayInterest = "0.00";
          }
          if (statDataArry[2]) {
            this.totalFirstSettleAmt = formatNumber(statDataArry[2], 2, ",");
          } else {
            this.totalFirstSettleAmt = "0.00";
          }
          if (statDataArry[3]) {
            this.weightRemainderAverDays = formatNumber(statDataArry[3], 2, ",");
          } else {
            this.weightRemainderAverDays = "0.00";
          }
          if (statDataArry[4]) {
            this.weightAverRate = formatNumber(statDataArry[4], 2, ",");
          } else {
            this.weightAverRate = "0.00";
          }
        } else {
          this.totalPayInterest = "0.00";
          this.totalFirstSettleAmt = "0.00";
          this.weightRemainderAverDays = "0.00";
          this.weightAverRate = "0.00";
        }
      },
      getOccurData() {
        post(this.formItem, this.querySaleOccurUrl).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.total = data.sumNum;
                if (data.sumAmt !== null) {
                  this.sumMoney = formatNumber(data.sumAmt, 2, ",");
                } else {
                  this.sumMoney = "0.00";
                }
                if (data.totalPayInterest !== null) {
                  this.totalPayInterest = formatNumber(data.totalPayInterest, 2, ",");
                } else {
                  this.totalPayInterest = "0.00";
                }
                if (data.totalFirstSettleAmt !== null) {
                  this.totalFirstSettleAmt = formatNumber(data.totalFirstSettleAmt, 2, ",");
                } else {
                  this.totalFirstSettleAmt = "0.00";
                }
                if (data.weightRemainderAverDays !== null) {
                  this.weightRemainderAverDays = formatNumber(data.weightRemainderAverDays, 2, ",");
                } else {
                  this.weightRemainderAverDays = "0.00";
                }
                if (data.weightAverRate !== null) {
                  this.weightAverRate = formatNumber(data.weightAverRate, 2, ",");
                } else {
                  this.weightAverRate = "0.00";
                }
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          }
        );
      },

      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minBillRangeStart = "";
        this.formItem.maxBillRangeEnd = "";
        this.formItem.busiTypeList=[];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minRatePct = "";
        this.formItem.maxRatePct = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minFirstSettleDt = "";
        this.formItem.maxFirstSettleDt = "";
        this.formItem.minDueSettleDt = "";
        this.formItem.maxDueSettleDt = "";
        this.formItem.minAcctDt = "";
        this.formItem.maxAcctDt = "";
        this.formItem.minDueAcctDt = "";
        this.formItem.maxDueAcctDt = "";
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.remitDt = [];
        this.dueDt = [];
        this.firstSettleDt = [];
        this.dueSettleDt = [];
        this.acctDt = [];
        this.dueAcctDt = [];
      },

      //日期选择框
      handleRemitDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },

      handleFirstSettleDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minFirstSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxFirstSettleDt = arr[1].replace(/-/g, "");
          this.firstSettleDt = [arr[0], arr[1]];
        } else {
          this.formItem.minFirstSettleDt = "";
          this.formItem.maxFirstSettleDt = "";
          this.firstSettleDt = [];
        }
      },
      handleDueSettleDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minDueSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueSettleDt = arr[1].replace(/-/g, "");
          this.dueSettleDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueSettleDt = "";
          this.formItem.maxDueSettleDt = "";
          this.dueSettleDt = [];
        }

      },
      handleAcctDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minAcctDt = arr[0].replace(/-/g, "");
          this.formItem.maxAcctDt = arr[1].replace(/-/g, "");
          this.acctDt = [arr[0], arr[1]];
        } else {
          this.formItem.minAcctDt = "";
          this.formItem.maxAcctDt = "";
          this.acctDt = [];
        }
      },
      handleDueAcctDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minDueAcctDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueAcctDt = arr[1].replace(/-/g, "");
          this.dueAcctDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueAcctDt = "";
          this.formItem.maxDueAcctDt = "";
          this.dueAcctDt = [];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },

      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },

      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfosWinClose() {
        this.billIds = [];
        this.billNos = [];
        this.billRangeStarts = [];
        this.billRangeEnds = [];
        this.showBillInfosWin = false;
        this.bulkPrintBillFlag = false;
        this.bulkPrintOutEndoFlag = false;
      },
      bulkPrintBillFlagClose() {
        this.isLoading = false;
        this.bulkPrintBillFlag = false;

      },
      bulkPrintOutEndoFlagClose() {
        this.isLoading = false;
        this.bulkPrintOutEndoFlag = false;
      },
      querySaleOccurBatch() {
        this.queryUrl = "/be/market/quote/saleOccurQuery/func_findOccurSaleBatch";
        this.querySaleOccurUrl = "/be/market/quote/saleOccurQuery/getSumAmtInfo";
        this.ifDisabledExport = false;
        this.ifDisabledPrint = false;
        this.showColumns = this.deepClone(this.batchColumns);
        this.$nextTick(() => {
          this.formSearch();
        });
      },

      querySaleOccurBill() {
        this.queryUrl = "/be/market/quote/saleOccurQuery/func_findOccurSaleBill";
        this.querySaleOccurUrl = "/be/market/quote/saleOccurQuery/getSumAmtInfoByBill";
        this.ifDisabledExport = true;
        this.ifDisabledPrint = true;
        this.showColumns = this.deepClone(this.billColumns);
        this.$nextTick(() => {
          this.formSearch();
        });
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },

      //清单导出
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "saleBatchOccurExportInfo";
        } else {
          this.param = "saleBillOccurExportInfo";
        }
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl;
        if (this.selectExportType === "batch") {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/saleOccurQuery/func_exportSaleBatchOccurExcel";
        } else {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/saleOccurQuery/func_exportSaleBillOccurExcel";
        }
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          if (this.selectExportType === "batch") {
            options.params = {
              batchIds: this.$refs.datagrid.selectIds
            };
          } else {
            options.params = {
              ids: this.$refs.datagrid.selectIds
            };
          }

          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      //批量打印正面或者场外背书
      bulkPrint() {
        this.billIds = this.$refs.datagrid.selectIds;
        console.log('this.billIds1111:'+this.billIds);
        if (this.billIds === null || this.billIds.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        if (this.billIds.length > this.maxPrintNum) {
          this.$msgTip.info(this, {info: "最多选中"+this.maxPrintNum+"条记录"});
          return;
        }

        let selectRows = this.$refs.datagrid.selects;
        this.billIds = [];
        for (let i = 0; i < selectRows.length; i++) {
          this.billIds.push(selectRows[i].billId);
          this.billNos.push(selectRows[i].billNo);
          this.billRangeStarts.push(selectRows[i].billRangeStart);
          this.billRangeEnds.push(selectRows[i].billRangeEnd);
        }
        this.isLoading = true;
        this.showBillInfosWin = true;

      },
      bulkPrintBill() {
        this.bulkPrintBillFlag = true;
        this.bulkPrint();
        setTimeout(()=>{
          this.isLoading = false;
        }, this.billIds.length * 350)
      },
      bulkPrintOutEndo() {
        this.bulkPrintOutEndoFlag = true;
        this.bulkPrint();
        setTimeout(()=>{
          this.isLoading = false;
        }, this.billIds.length * 300)
      },
      queryBusiParamDefaultValue() {
        post({ paramKey: "bm.common.bill_print_max_num" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData == null || res.data.retData == ''){
                this.maxPrintNum = 20;
              }else{
                this.maxPrintNum = Number(res.data.retData);
              }

            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      clearVal(optType) {
        if (optType === "transBrchNameList") {
          this.formItem.transBrchNos = "";
          this.formItem.transBrchNameList = "";
        }
      }
    },
    created() {
      this.queryBusiParamDefaultValue();
    }
  };
</script>

<style scoped>

</style>
