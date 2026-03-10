<style>

</style>
<!-- 回购跟踪查询 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <!--  <h-form-item :label="$t('m.i.pe.ownBrchName')" prop="brchName">
                  <h-input v-model="formItem.brchName" placeholder="" icon="android-search"
                           @on-click="queryBranchName('query')" readonly clearable
                           @on-clear="clearVal('brchName')" :title="formItem.brchName"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.transBrchNos" :label="$t('m.i.pe.ownBrchName')" prop="transBrchNos" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.transBrchNos" :brchName.sync="formItem.brchName"></show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select class="input-boder-0" v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.pe.dealNo')" prop="dealNo">
                  <h-input v-model="formItem.dealNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option value="BT02">质押式回购</h-option>
                    <h-option value="RBT02">再贴现质押回购</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.pe.oppositeBrchName')" prop="buyBrchName">
                  <h-input @on-click="showbrch = true" v-model="formItem.buyBrchName" icon="search" readonly clearable
                           @on-clear="clearVal('buyBrchName')" :title="formItem.buyBrchName">
                  </h-input>
                </h-form-item>-->
                <show-cpes-branch :label="$t('m.i.pe.oppositeBrchName')"
                                  :brchCode.sync="formItem.buyBrchCode"  :cpesBrchName.sync="formItem.buyBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.common.applDt')" prop="applDate">
                  <h-date-picker type="daterange" autoPlacement v-model="formItem.applDate" format="yyyy-MM-dd" showFormat
                                 placeholder="" @on-change="handleApplDateChange"></h-date-picker>
                </h-form-item>
                <common-type-field-range v-model="formItem" :label="$t('m.i.pe.dueRate')" :integerNum="3" :suffixNum="4" :validRules="ratePctRule" :bigTips="false"
                                         :rangeProps="['minDueRatePct','maxDueRatePct']"></common-type-field-range>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
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
            :hasSelect="hasSelect"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            :rowSelect=true
            hasPage
            showListCkeckBox
            :notSetWidth="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryRebuyOccurBatch()">{{$t("m.i.pe.queryAcptOccurBatch")}}</h-button>
              <h-button type="primary" @click="queryRebuyOccurBill()">{{$t("m.i.pe.queryAcptOccurBill")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('batch')"
                        :disabled="this.ifDisabledExport">{{$t("m.i.pe.arrayExport")}}
              </h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('bill')"
                        :disabled="!this.ifDisabledExport">{{$t("m.i.pe.flowExport")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--<brch-code-search :showCpesBranch="showbrch" @showCpesBranchClose="closeBranch"
                      @showCpesBranchSubmit="brchCodeChange"></brch-code-search>-->

   <!-- <show-branch :showBranchWin="brchNameSelectWin" title="机构名称" @brchNoChange="brchNameAdd" ifcheck="isTrue"
                  :onlyUpdateDown="true" @showBranchWinClose="brchNoWinClose"></show-branch>-->

    <sale-mature-detil :showmsg="showmsg" :batchId="batchId" @closeMsgBox="closeMsgBox"></sale-mature-detil>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>
<script>
  import { post, on, off, formatNumber,exportList, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleMatureOccurQuery",
    data() {
      let batchColumns = [
        {
          type: "selection",
          align: "center",
          width: 60,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          align: "center",
          width: 60,
          hiddenCol: false
        },
        {
         title:this.$t("m.i.common.batchNo"),
          key: "batchNo",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBatchDetil(params.row.id);
                }
              }
            }, params.row.batchNo);
          }
        },
        {
          title: this.$t('m.i.common.applDt'),
          key: "applDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
         title: this.$t("m.i.pe.dealNo"),
          key: "dealNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.busiType"),
          key: "busiType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.pe.ownBrchName"),
          key: "saleBrchName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pe.oppositeBrchName"),
          key: "buyBrchName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billClass"),
          key: "billClass",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.settleMode'),
          key: "settleMode",
          hiddenCol: false,
          render:(h, params)=> {
            let list = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
         title: this.$t("m.i.pe.ratePct"),
          key: "ratePct",
          sortable: true,
          hiddenCol: false,
          sortMethod:(a,b,type)=>{
            if (type==="asc") {
              let a1=parseFloat(a);
              let a2=parseFloat(b);
              if (isNaN(a1)) return -1;
              if (isNaN(a2)) return 1;
              return a1-a2;
            }else if (type==="desc") {
              let a1=parseFloat(a);
              let a2=parseFloat(b);
              if (isNaN(a1)) return 1;
              if (isNaN(a2)) return -1;
              return a2-a1;
            }
          }
        },
        {
         title: this.$t("m.i.pe.dueRate"),
          key: "dueRatePct",
          hiddenCol: false,
          sortable: true,
          sortMethod:(a,b,type)=>{
            if (type==="asc") {
              let a1=parseFloat(a);
              let a2=parseFloat(b);
              if (isNaN(a1)) return -1;
              if (isNaN(a2)) return 1;
              return a1-a2;
            }else if (type==="desc") {
              let a1=parseFloat(a);
              let a2=parseFloat(b);
              if (isNaN(a1)) return 1;
              if (isNaN(a2)) return -1;
              return a2-a1;
            }
          }
        },
        {
         title: this.$t("m.i.pe.redeemType"),
          key: "redeemType",
          hiddenCol: false,
          width: 130,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "RedeemType", params.row.redeemType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.pe.redeemReason"),
          key: "redeemReason",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "RedeemReason", params.row.redeemReason);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
         title: this.$t("m.i.pe.sgnupMark"),
          key: "respFlag",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "SignUpMarkCode", params.row.respFlag);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.pe.sgnOpin"),
          key: "sgnOpin",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.be.orginDueSettleDt"),
          key: "dueSettleDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let date = params.row.dueSettleDt == null ? "" : this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.be.redeemSumAmtByUnit'),
          key: "redeemSumAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.redeemSumAmt, 2, ","));
          }
        },
        {
         title: this.$t("m.i.pe.redeemSumBuyTotalAmt"),
          key: "redeemSumBuyTotalAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.redeemSumBuyTotalAmt, 2, ","));
          }
        },
        {
          title: this.$t("m.i.pe.duePayInterest"),
          key: "duePayInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.duePayInterest, 2, ","));
          }
        },
        {
          title: this.$t("m.i.pe.duePayAmt"),
          key: "duePayAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.duePayAmt, 2, ","));
          }
        },
        {
          title: this.$t("m.i.common.dealPrcMsg"),
          key: "dealPrcMsg",
          hiddenCol: false

        },
        {
         title: this.$t("m.i.pe.redeemTotalNumBillPackage"),
          key: "redeemSumNum",
          hiddenCol: false
        }
      ];
      return {
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        dictMap: new Map(),
        formItem: {
          brchName: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          transBrchNos: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          batchNo: "",
          dealNo: "",
          busiType: "",
          redeemStatus: "",
          billType: "",
          billClass: "",
          dueAcctFlag: "",
          applDate: "",
          minApplDt: "",
          maxApplDt: "",
          minDueRatePct: "",
          maxDueRatePct: "",
          buyBrchName: "",
          billOrigin: "",
          billNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          buyBrchCode: ""
        },
        viewDatailForm: {
          busiType: "",
          batchNo: "",
          dealNo: "",
          brchName: "",
          saleBrchCode: "",
          saleBrchName: "",
          buyBrchCode: "",
          buyBrchName: "",
          billType: "",
          billClass: "",
          dueSettleDt: "",
          applDt: "",
          redeemType: "",
          ratePct: "",
          dueRatePct: "",
          totalNum: "",
          totalAmt: "",
          buyBackTotalAmt: "",
          redeemSumNum: "",
          redeemSumAmt: "",
          redeemSumBuyTotalAmt: "",
          dueInterest: "",
          dueSettleAmt: "",
          duePayInterest: "",
          duePayAmt: "",
          batchId: ""
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
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key:"billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillOrigin(this.dictMap, "BillOrigin", params.row.billOrigin);
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              } else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
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
            title: this.$t("m.i.pe.galeDt"),
            key: "galeDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.galeDt ? this.$moment(params.row.galeDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
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
            title: this.$t("m.i.pe.dueInterest"),
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
            title: this.$t("m.i.pe.duePayInterest"),
            key: "duePayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let duePayInterest = formatNumber(params.row.duePayInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: duePayInterest
                }
              }, duePayInterest);
            }
          },
          {
            title: this.$t("m.i.pe.dueRealPayAmt"),
            key: "duePayAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let duePayAmt = formatNumber(params.row.duePayAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: duePayAmt
                }
              }, duePayAmt);
            }
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
          }
        ],
        //表格内选中的数据的id号
        selection: {
          batchId: ""
        },
        ifShowMore: false,
        busiTypeList: [],
        //showbrch: false,
        showmsg: false,
        batchId: "",
        brchTreeData: [],
        billOriginList: [],
        isDisabled: false,
        //brchNameSelectWin: false,
        hasSelect: false,
        showBillInfoWin: false,
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        redeemStatusList: [],
        billTypeList: [],
        billClassList: [],
        sumMoney: "",
        total: "",
        billId:"",
        billRangeStart:"",
        billRangeEnd:"",
        selectExportType: "",
        ifDisabledExport: false,
        showColumns: this.deepClone(batchColumns),
        queryUrl: "/be/market/redeem/sale/saleMatureTransMonitor/func_findOccurSaleMatureBatch"
      };
    },
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      SaleMatureDetil: () => import(/* webpackChunkName: "be/market/redeem/sale/saleMatureDetil" */`@/views/bizViews/be/market/redeem/sale/saleMatureDetil`),
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    mounted() {
      this.getDictListByGroups("BusiType,SettleType,CDMedia,DraftTypeCode,RedeemType,RedeemStatus,AcctFlag,StlResult,RedeemReason,SignUpMarkCode,BillOrigin").then(res => {
        this.busiTypeList = res.get("BusiType");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.redeemTypeList = res.get("RedeemType");
        this.redeemStatusList = res.get("RedeemStatus");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD");
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$hMessage.error("请先选择记录！");
          return;
        }
        this.formItem.buyBrchCode = info.brchCode;
        this.formItem.buyBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },*/
      /*closeBranch() {
        this.showbrch = false;
      },*/
      handleApplDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
        }
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.url = this.queryUrl;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.buyBrchCode = "";
        this.formItem.buyBrchName = "";
        this.formItem.brchName = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.transBrchNos = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
      },
      closeMsgBox() {
        this.showmsg = false;
      },
      showBatchDetil(batchId) {
        this.batchId = batchId;
        this.showmsg = true;
      },
      /*//选择机构名称
      queryBranchName(str) {
        this.brchNameSelectWin = true;
      },
      //选择机构名称弹出框确认
      brchNameAdd(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let transBrchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          transBrchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.transBrchNos = transBrchNos.substring(0, transBrchNos.length - 1);
        this.formItem.brchName = info[0].title;
        this.brchNameSelectWin = false;
      },
      brchNoWinClose() {
        this.brchNameSelectWin = false;
      },*/

      billInfoWinClose() {
        this.billId = null;
        this.billRangeStart = null;
        this.billRangeEnd =null;
        this.showBillInfoWin = false;
      },

      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },

      queryRebuyOccurBatch() {
        this.$refs.datagrid.url = null;
        this.queryUrl = "/be/market/redeem/sale/saleMatureTransMonitor/func_findOccurSaleMatureBatch";
        this.ifDisabledExport = false;
        this.showColumns = this.deepClone(this.batchColumns);
        this.$refs.datagrid.createShowCol(this.showColumns);
        this.formSearch();
      },

      queryRebuyOccurBill() {
        this.$refs.datagrid.url = null;
        this.queryUrl = "/be/market/redeem/sale/saleMatureTransMonitor/func_findOccurSaleMatureBill";
        this.ifDisabledExport = true;
        this.showColumns = this.deepClone(this.billColumns);
        this.$refs.datagrid.createShowCol(this.showColumns);
        this.formSearch();
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "saleMatureOccurBatch";
        } else {
          this.param = "saleMatureOccurBill";
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
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/redeem/sale/saleMatureTransMonitor/func_exportSaleMatureOccurBatchExcel";
        } else {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/redeem/sale/saleMatureTransMonitor/func_exportSaleMatureOccurBillExcel";
        }
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            selectExportType: this.selectExportType
          };
          if (this.selectExportType === "batch") {
            options.params.ids = this.$refs.datagrid.selectIds;
          }else{
            options.params.billIds = this.$refs.datagrid.selectIds;
          }
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this,this.param, field, exportType, exportUrl, options);
      },
      pageShowFormatBillOrigin(map, groupCode, key) {
        if (key == null || key === '') {
          return '-';
        }
        if (key.toString() === 'CS00') {
          return '-';
        }
        return this.getDictValueFromMap(map, groupCode, key);
      }

      /*clearVal(optType) {
        if (optType === "buyBrchName") {
          this.formItem.buyBrchCode = "";
          this.formItem.buyBrchName = "";
        }
      }*/
    }
  };

</script>
