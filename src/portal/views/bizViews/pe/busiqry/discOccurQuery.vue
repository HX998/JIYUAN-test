<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.transBrchNoList" :label="$t('m.i.common.brchName')" prop="transBrchNoList"
                             title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.transBrchNoList" :brchName.sync="formItem.transBrchNameList"></show-branch>

                <h-form-item :label="$t('m.i.common.busiType')" prop="prodNoList">
                  <h-select v-model="formItem.prodNoList" placeholder="" multiple showTitle>
                    <h-option v-for="item in productNoList" :value="item.key" :key="item.value">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <common-select v-model="formItem.busiClassify" prop="busiClassify" v-if="openI9flag" :dictList="busiClassifyList"
                               :label="$t('m.i.be.assetIndustry')"></common-select>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo" placeholder=""></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>


                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>

                <bill-range :formItem="formItem" :rangeProps="['billRangeStart','billRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo">
                  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.discDt')" prop="discDt">
                  <h-date-picker :value="discDt" type="daterange" autoPlacement  showFormat :editable=false
                                 @on-change="handleDiscDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement  showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label" prop="billMoney">
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
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.value">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.otherBankDiscMark')" prop="otherBankDiscMark">
                  <h-select v-model="formItem.otherBankDiscMark" placeholder="">
                    <h-option v-for="item in yonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.isPoolDisc')" prop="isPoolDisc">
                  <h-select v-model="formItem.isPoolDisc" placeholder="">
                    <h-option v-for="item in yonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
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
                  <h-form-item :label="$t('m.i.pe.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
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
              <h-button type="primary" @click="queryDiscOccurBatch()">{{$t("m.i.pe.queryAcptOccurBatch")}}</h-button>
              <h-button type="primary" @click="queryDiscOccurBill">{{$t("m.i.pe.queryAcptOccurBill")}}</h-button>
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

    <!-- 机构名称选择弹窗框 -->
    <!--<show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange" ifcheck="true"
                 :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>-->

    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit" :isAllBankAcct="true"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct="true"></show-cust-acct-no>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

    <bill-infos-main @billInfosWinClose="billInfosWinClose" @bulkPrintBillFlagClose = "bulkPrintBillFlagClose" @bulkPrintOutEndoFlagClose="bulkPrintOutEndoFlagClose" @bulk :showBillInfoWin="showBillInfosWin" :billIds="this.billIds"
                     :billNos="this.billNos" :billRangeStarts="this.billRangeStarts" :billRangeEnds="this.billRangeEnds" ref="billInfosMain" :bulkPrintBillFlag="bulkPrintBillFlag" :bulkPrintOutEndoFlag="bulkPrintOutEndoFlag" v-if="showBillInfosWin"></bill-infos-main>


    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!--查看附件弹窗-->
    <show-attach :showAttachWin="showAttachWin" @attachWinClose="attachWinClose"
                 :attachParams="attachParams"></show-attach>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul,exportList,getDictValueFromMap,formatBillRange  } from "@/api/bizApi/commonUtil";

  export default {
    name: "discOccurQuery",
    components: {
     // ShowBranch: () => import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */ "@/views/bizViews/be/market/rediscount/common/showBranch")
    },
    data() {
      let batchColumns = [
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
          title: this.$t("m.i.common.busiType"),
          key: "prodName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showDiscOccurBill(params.row.batchNo);
                }
              }
            }, params.row.batchNo);
          }
        },
        {
          title: this.$t('m.i.common.brchNo'),
          key: "transBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "discBrchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.custAcctNo'),
          key: "custAcctNo",
          hiddenCol: false
        },
        {
         title: this.$t('m.i.billInfo.discDt'),
          key: "discDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.discDt == null || params.row.discDt === "") {
              return "";
            }
            let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", discDt);
          }
        },
        {
          title: this.$t('m.i.pe.discRateStr'),
          key: "ratePct",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.pe.redeemOpenDt'),
          key: "redeemOpenDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.redeemOpenDt == null || params.row.redeemOpenDt === "" || params.row.redeemOpenDt === 0) {
              return "";
            }
            let discDt = this.$moment(params.row.redeemOpenDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", discDt);
          }
        },
        {
          title: this.$t('m.i.pe.redeemDueDt'),
          key: "redeemDueDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.redeemDueDt == null || params.row.redeemDueDt === "" || params.row.redeemDueDt === 0) {
              return "";
            }
            let discDt = this.$moment(params.row.redeemDueDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", discDt);
          }
        },
        {
          title: this.$t('m.i.pe.payType'),
          key: "payType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "PayType", params.row.payType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title:  this.$t('m.i.pe.buyPayPcet'),
          key: "buyPayPcet",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.payCustName'),
          key: "payCustName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.payAcctNo'),
          key: "payAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.clearMark'),
          key: "clearMark",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "SettlementMarkCode", params.row.clearMark);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.common.custMgrNo'),
          key: "custMgrNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrName'),
          key: "custMgrName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.custMgrBrchNo'),
          key: "custMgrBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrBrchName'),
          key: "custMgrBrchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.sumBuyerInterest'),
          key: "sumBuyerInterest",
          hiddenCol: false,
          render: (h, params) => {
            let sumBuyerInterest = formatNumber(params.row.sumBuyerInterest, 2, ",");
            return h("span", {
              domProps: {
                title: sumBuyerInterest
              }
            }, sumBuyerInterest);
          }
        },
        {
          title: this.$t('m.i.pe.sumSalerInterest'),
          key: "sumSalerInterest",
          hiddenCol: false,
          render: (h, params) => {
            let sumSalerInterest = formatNumber(params.row.sumSalerInterest, 2, ",");
            return h("span", {
              domProps: {
                title: sumSalerInterest
              }
            }, sumSalerInterest);
          }
        },
        {
          title: this.$t('m.i.pe.sumInterest'),
          key: "sumInterest",
          hiddenCol: false,
          render: (h, params) => {
            let sumInterest = formatNumber(params.row.sumInterest, 2, ",");
            return h("span", {
              domProps: {
                title: sumInterest
              }
            }, sumInterest);
          }
        },
        {
          title: this.$t('m.i.pe.sumRealPayAmt'),
          key: "sumRealPayAmt",
          hiddenCol: false,
          render: (h, params) => {
            let sumRealPayAmt = formatNumber(params.row.sumRealPayAmt, 2, ",");
            return h("span", {
              domProps: {
                title: sumRealPayAmt
              }
            }, sumRealPayAmt);
          }
        },
        {
          title: this.$t("m.i.pe.total"),
          key: "sumCount",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.totalAmt"),
          key: "sumMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.sumMoney, 2, ",");
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.auth.attachment"),
          key: "attachment",
          render: (h, params) => {
            let attachment = "查看附件";
            return h("a", {
              on: {
                click: () => {
                  this.showAttachDeal(params.row.id);
                }
              }
            }, attachment);
          }
        }
      ];
      return {
        formItem: {
          transBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNameList:JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          prodNoList: [],
          batchNo: "",
          reverseBillNo: "",
          custName: "",
          custAcctNo: "",
          custNo: "",
          minDiscDt: "",
          maxDiscDt: "",
          minDueDt: "",
          maxDueDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          billClass: "",
          otherBankDiscMark: "",
          busiClassify: "",
          isPoolDisc:"",
          billRangeStart:"",
          billRangeEnd:"",
          billOrigin:""
        },
        openI9flag:false,
        showAttachWin: false,
        attachParams: {
          queryUrl: "",
          downloadUrl: "",
          attachFormItem: {
            batchId: ""
          },
        },
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
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showDiscOccurBill(params.row.batchNo);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "prodName",
            hiddenCol: false
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
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.pe.otherBankDiscMark"),
            key: "otherBankDiscMark",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.otherBankDiscMark);
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
            title: this.$t('m.i.common.brchNo'),
            key: "transBrchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "discBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: "custAcctNo",
            hiddenCol: false
          },
          {
           title: this.$t('m.i.billInfo.discDt'),
            key: "discDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.discDt == null || params.row.discDt === "") {
                return "";
              }
              let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
          },
          {
            title: this.$t('m.i.pe.discRateStr'),
            key: "ratePct",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.pe.redeemRateStr'),
            key: "redeemRatePct",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.pe.redeemOpenDt'),
            key: "redeemOpenDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.redeemOpenDt == null || params.row.redeemOpenDt === "" || params.row.redeemOpenDt === 0) {
                return "";
              }
              let discDt = this.$moment(params.row.redeemOpenDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
          },
          {
            title: this.$t('m.i.pe.redeemDueDt'),
            key: "redeemDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.redeemDueDt == null || params.row.redeemDueDt === "" || params.row.redeemDueDt === 0) {
                return "";
              }
              let discDt = this.$moment(params.row.redeemDueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
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
            title: this.$t("m.i.pe.galeDt"),
            key: "galeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.galeDt == null || params.row.galeDt === "") {
                return "";
              }
              let date = this.$moment(params.row.galeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.be.assetIndustry"),
            key: "busiClassify",
            hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.busiClassify);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },

          {
            title: this.$t("m.i.pe.isSameCity"),
            key: "isSameCity",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isSameCity);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pe.isAcpt"),
            key: "isAcpt",
            hiddenCol: false,
            render:(h,params) => {
              if (params.row.isAcpt == null || params.row.isAcpt === ""){
                return "";
              }
              if (params.row.isAcpt === '1') {
                return h("span", "是");
              } else {
                return h("span", "否");
              }
            }
          },
          {
            title: this.$t("m.i.pe.delayDays"),
            key: "delayDays",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.interestCalDays"),
            key: "interestCalDays",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.salerInterest"),
            key: "salerInterest",
            hiddenCol: false,
            render: (h, params) => {
              let salerInterest = formatNumber(params.row.salerInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: salerInterest
                }
              }, salerInterest);
            }
          },
          {
            title:this.$t("m.i.pe.buyerInterest"),
            key: "buyerInterest",
            hiddenCol: false,
            render: (h, params) => {
              let buyerInterest = formatNumber(params.row.buyerInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: buyerInterest
                }
              }, buyerInterest);
            }
          },
          {
            title: this.$t("m.i.pe.interest"),
            key: "interest",
            hiddenCol: false,
            render: (h, params) => {
              let interest = formatNumber(params.row.interest, 2, ",");
              return h("span", {
                domProps: {
                  title: interest
                }
              }, interest);
            }
          },
          {
            title: this.$t("m.i.pe.realPayAmt"),
            key: "realPayAmt",
            hiddenCol: false,
            render: (h, params) => {
              let realPayAmt = formatNumber(params.row.realPayAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: realPayAmt
                }
              }, realPayAmt);
            }
          },
          {
            title: this.$t("m.i.pe.registerStatus"),
            key: "discRgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DiscRgstStatus", params.row.discRgstStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pe.discRgstDt"),
            key: "discRgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.discRgstDt == null || params.row.discRgstDt === "" || params.row.discRgstDt === 0) {
                return "";
              }
              let date = this.$moment(params.row.discRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title:"是否贴现通办理",
            key:"isDiscQuote",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscQuote);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        discDt: [],
        dueDt: [],
        yonList: [],
        billClassList: [],
        productNoList: [],
        billOriginList : [],
        busiClassifyList: [],
        dictMap: new Map(),
        billIds: [],
        billNos: [],
        billRangeStarts: [],
        billRangeEnds: [],
        billId: "",
        maxPrintNum: 1,
        //是否显示更多查询项
        ifShowMore: false,
        isShowPrintBtn: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        showBillInfoWin: false,
        showBillInfosWin: false,
        bulkPrintBillFlag: false,
        bulkPrintOutEndoFlag: false,
        tempShowExcelTemplateWin: false,
        //showBranchWin: false,
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        selectExportType: "",
        queryUrl: "/pe/busiqry/discOccurQuery/func_pageingQueryDiscBatchOccurList",
        ifDisabledExport: false,
        ifDisabledPrint: false,
        showColumns: this.deepClone(batchColumns),
        billRangeStart: "",
        billRangeEnd: "",
      };
    },
    mounted() {
      this.buttonAuthShow();
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      this.getDictListByGroups("CDMedia,Yon,DraftTypeCode,DiscQueryBusiType,SettlementMarkCode,PayType,DiscRgstStatus,AssetIndustry,SettleType,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.productNoList = res.get("DiscQueryBusiType");
        this.busiClassifyList=res.get("AssetIndustry").filter(item => item.key != "0");
        this.billOriginList = res.get("BillOrigin");

        let dictList = [];
        let settlementMarkCodeList = res.get("SettlementMarkCode");
        let settleTypeList =res.get("SettleType");
        for (let i = 0; i < settlementMarkCodeList.length+settleTypeList.length; i++) {
          if(i< settlementMarkCodeList.length){
            dictList[i]=settlementMarkCodeList[i];
          }
          if(settlementMarkCodeList.length<=i){
            let obj = settleTypeList[i-settlementMarkCodeList.length];
            obj.dictGroupCode="SettlementMarkCode";
            res.get("map").get(obj.dictGroupCode).set(obj.key,obj.value);
            dictList[i]= obj;
          }
        }
        res.set("SettlementMarkCode",dictList);
        this.yonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      //按钮权限查询 查看附件列显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            let btnAuth = JSON.parse(res.data.retData);
            let isShowAttach = btnAuth.showAttach === undefined ? false : btnAuth.showAttach.isShow;
            this.$refs.datagrid.controlColumnsHidden("attachment",!isShowAttach);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
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
      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.url = this.queryUrl;
        this.$refs.datagrid.dataChange(1);
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minDiscDt = "";
        this.formItem.maxDiscDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.discDt = [];
        this.dueDt = [];
        this.formItem.billRangeStart="";
        this.formItem.billRangeEnd="";
        this.formItem.custNo = "";
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.prodNoList = [];
        this.formItem.busiList = [];
      },

    /*  //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let discBrchNoList = "";
        let discBrchNameList = "";
        for (var i = 0; i < objs.length; i++) {
          discBrchNoList += objs[i].id + ",";
          discBrchNameList += objs[i].title + ",";
        }
        this.formItem.transBrchNoList = discBrchNoList.substring(0, discBrchNoList.length - 1);
        this.formItem.transBrchNameList = discBrchNameList.substring(0, discBrchNameList.length - 1);
        this.showBranchWin = false;
      },*/

      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },

      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },

      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },

      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },

      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },

      //查看附件
      showAttachDeal(batchId) {
        this.attachParams.queryUrl = "/pe/busiqry/discOccurQuery/func_queryOccurAttachInfo";
        this.attachParams.downloadUrl = "/bm/audit/auditTaskSubmit/func_attachDownload";
        this.attachParams.attachFormItem.batchId = batchId;
        this.showAttachWin = true;
      },
      //查看附件窗口关闭
      attachWinClose() {
        this.showAttachWin = false;
        this.attachParams.attachFormItem.batchId = "";
      },
      //日期选择框
      handleDiscDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDiscDt = arr[0].replace(/-/g, "");
          this.formItem.maxDiscDt = arr[1].replace(/-/g, "");
          this.discDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDiscDt = "";
          this.formItem.maxDiscDt = "";
          this.discDt = [];
        }
      },

      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
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
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
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
      showDiscOccurBill(batchNo) {
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.pageInfo.pageNo = 1;
        this.formItem.batchNo = batchNo;
        this.ifDisabledExport = true;
        this.ifDisabledPrint = true;
        this.queryUrl = "/pe/busiqry/discOccurQuery/func_pageingQueryDiscBillOccurList";
        this.$nextTick(() => {
          this.showColumns = this.deepClone(this.billColumns);
          this.$refs.datagrid.createShowCol(this.billColumns);
          this.formSearch();
        });
      },

      queryDiscOccurBatch() {
        this.$refs.datagrid.url = null;
        this.queryUrl = "/pe/busiqry/discOccurQuery/func_pageingQueryDiscBatchOccurList";
        this.ifDisabledExport = false;
        this.ifDisabledPrint = false;
        this.showColumns = this.deepClone(this.batchColumns);
        this.formSearch();
      },

      queryDiscOccurBill() {
        this.$refs.datagrid.url = null;
        this.queryUrl = "/pe/busiqry/discOccurQuery/func_pageingQueryDiscBillOccurList";
        this.ifDisabledExport = true;
        this.ifDisabledPrint = true;
        this.showColumns = this.deepClone(this.billColumns);
        this.formSearch();
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },

      //清单导出
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "discBatchOccurExportInfo";
        } else {
          this.param = "discBillOccurExportInfo";
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
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/discOccurQuery/func_exportDiscBatchOccurExcel";
        } else {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/discOccurQuery/func_exportDiscBillOccurExcel";
        }
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          if (this.selectExportType === "batch") {
            options.params.batchIds = this.$refs.datagrid.selectIds;
          }else{
            options.params.ids = this.$refs.datagrid.selectIds;
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
          this.formItem.transBrchNoList = "";
          this.formItem.transBrchNameList = "";
        } else if (optType === "custName") {
          this.formItem.custAcctNo = "";
          this.formItem.custName = "";
          this.formItem.custNo = "";
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
