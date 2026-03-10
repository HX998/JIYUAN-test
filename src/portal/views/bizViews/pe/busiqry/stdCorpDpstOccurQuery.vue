<!--公共查询-存托签收发生查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--批次号-->
                <common-input v-model="formItem.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" :maxlength="50"></common-input>
                <!--基础资产种类-->
                <common-select v-model="formItem.baseAssetType" :label="$t('m.i.bs.baseAssetType')" prop="baseAssetType"
                               :dictList="baseAssetTypeList"></common-select>
                <!--标票产品名称-->
                <common-input v-model="formItem.stdProductNameLike" :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                              showIcon @on-click="queryProductName"></common-input>
                <!--电票账号-->
                <!--<common-input v-model="formItem.ecdsAcctName" :label="$t('m.i.bs.ecdsAcctName')" prop="ecdsAcctName"
                              readonly showIcon @on-click="queryEcdsAcctNo"></common-input>-->
                <common-input v-model="formItem.ecdsAcctNo" :label="$t('m.i.bs.ecdsAcctNo')" prop="ecdsAcctNo"
                              :validRules="validAcctNoRules" :maxlength=32></common-input>
                <!--存托机构名称-->
                <common-input v-model="formItem.dpstBrchName" :label="$t('m.i.bs.dpstBrchName')" prop="dpstBrchName"
                              readonly showIcon @on-click="queryCpesBrchName"></common-input>
                <!--承销机构名称-->
                <common-input v-model="formItem.sellBrchName" :label="$t('m.i.bs.sellBrchName')"
                              prop="sellBrchName" :maxlength="150"></common-input>
                <!--产品规模(元)-->
                <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationAmt')" :integerNum="16" :suffixNum="2":validRules="creationAmtRule"
                                         :rangeProps="['minCreationAmt','maxCreationAmt']" :bigTips="false"></common-type-field-range>
                <!--申购日期-->
                <common-date-picker v-model="purchaseDate" :label="$t('m.i.bs.purchaseDt')" type="daterange" :autoPlacement="true" @on-change="handlePurchaseDateChange"></common-date-picker>
                <!--票据号码-->
                <common-input v-model="formItem.billNoLike" :label="$t('m.i.billInfo.billNo')" prop="billNoLike" :maxlength="32"></common-input>
                <!--出票日期-->
                <common-date-picker v-model="remitDt" :label="$t('m.i.billInfo.remitDt')" type="daterange" :autoPlacement="true" @on-change="handleRemitDtChange"></common-date-picker>
                <!--汇票到期日-->
                <common-date-picker v-model="dueDt" :label="$t('m.i.billInfo.dueDt')" type="daterange" :autoPlacement="true" @on-change="handleDueDtChange"></common-date-picker>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.bs.totalAmt')">
                    <h-input v-model="totalAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.bs.totalNum')">
                    <h-input v-model="totalNum" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="showColumns"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            :url="queryUrl"
            :bindForm="formItem"
            hasPage
            highlightRow
            :row-select="true"
            :has-select="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryStdCorpDpstOccurBatch()">{{$t("m.i.bs.queryStdCorpDpstOccurBatch")}}</h-button>
              <h-button type="primary" @click="queryStdCorpDpstOccurBill">{{$t("m.i.bs.queryStdCorpDpstOccurBill")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('batch')" :disabled="this.ifDisabledExport">
                {{$t("m.i.bs.batchExport")}}
              </h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('bill')" :disabled="!this.ifDisabledExport">
                {{$t("m.i.bs.billExport")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--标票产品名称-->
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      :showMemberId="false" :memberId="memberId"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true></show-cust-acct-no>
    <!-- 清单导出组件 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!--票面信息-->
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                        :billNo="billNo" :listId="listId"></bill-info-main-std>


  </div>
</template>

<script>
  import { post, accMul, formatNumber, exportList, rateSortMethod } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCorpDpstOccurQuery",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      let batchColumns = [
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
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.showStdCorpDpstOccurBill(params.row.batchNo)
                }
              }
            }, params.row.batchNo)
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatus",
          hiddenCol: false,
          render: (h, params) => {
            let flowStatus = this.getDictValueFromMap(this.dictMap, "StdCreationFlowStatus", params.row.flowStatus);
            return h("span", {
              domProps: {
                title: flowStatus
              }
            }, flowStatus);
          }
        },
        {
          title: this.$t("m.i.bs.baseAssetType"),
          key: "baseAssetType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let baseAssetType = this.getDictValueFromMap(this.dictMap, "BaseAssetType", params.row.baseAssetType);
            return h("span", {
              domProps: {
                title: baseAssetType
              }
            }, baseAssetType);
          }
        },
        {
          title: this.$t("m.i.bs.collectMode"),
          key: "collectMode",
          hiddenCol: false,
          render: (h, params) => {
            let collectMode = this.getDictValueFromMap(this.dictMap, "CollectMode", params.row.collectMode);
            return h("span", {
              domProps: {
                title: collectMode
              }
            }, collectMode);
          }
        },
        {
          title: this.$t('m.i.bs.stdProductName'),
          key: 'stdProductName',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.bs.stdProductShortName'),
          key: 'stdProductShortName',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bs.stdProductNo'),
          key: 'stdProductNo',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.bs.ecdsAcctNo'),
          key: 'ecdsAcctNo',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.bs.ecdsAcctName'),
          key: 'ecdsAcctName',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bs.dpstBrchName'),
          key: 'dpstBrchName',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bs.dpstBrchCode'),
          key: 'dpstBrchCode',
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bs.sellBrchName'),
          key: 'sellBrchName',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.bs.creationMaxAmt"),
          key: "creationMaxAmt",
          align: "right",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.creationMaxAmt, 2, ","));
          }
        },
        {
          title: this.$t('m.i.bs.creationMaxTerm'),
          key: 'creationMaxTerm',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.bs.financeMaxRatePct'),
          key: 'financeMaxRatePct',
          align: "right",
          hiddenCol: false,
          sortable: true,
          sortMethod:(a,b,type)=>{
            return rateSortMethod(a,b,type);
          }
        },
        {
          title: this.$t('m.i.bs.financeMinRatePct'),
          key: 'financeMinRatePct',
          align: "right",
          hiddenCol: false,
          sortable: true,
          sortMethod:(a,b,type)=>{
            return rateSortMethod(a,b,type);
          }
        },
        {
          title: this.$t('m.i.bs.beginDueDt'),
          key: 'beginDueDt',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.beginDueDt ? this.$moment(params.row.beginDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t('m.i.bs.endDueDt'),
          key: 'endDueDt',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.endDueDt ? this.$moment(params.row.endDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t("m.i.bs.creationAmt"),
          key: "creationAmt",
          align: "right",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.creationAmt, 2, ","));
          }
        },
        {
          title: this.$t('m.i.bs.creationNum'),
          key: 'creationNum',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.bs.creationTerm'),
          key: 'creationTerm',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.bs.purchaseResult'),
          key: 'purchaseResult',
          hiddenCol: false,
          render: (h, params) => {
            let purchaseResult =this.getDictValueFromMap(this.dictMap, 'PurchaseResult', params.row.purchaseResult);
            return h("span", {
              domProps: {
                title: purchaseResult
              }
            }, purchaseResult);
          }
        },
        {
          title: this.$t('m.i.bs.financeRatePct'),
          key: 'financeRatePct',
          align: "right",
          hiddenCol: false,
          sortable: true,
          sortMethod:(a,b,type)=>{
            return rateSortMethod(a,b,type);
          }
        },
        {
          title: this.$t('m.i.bs.publishDt'),
          key: 'publishDt',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.publishDt ? this.$moment(params.row.publishDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t('m.i.bs.declareEndDtTm'),
          key: 'declareEndDtTm',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.declareEndDtTm ? this.$moment(params.row.declareEndDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
          }
        },
        {
          title: this.$t('m.i.bs.purchaseDt'),
          key: 'purchaseDt',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.purchaseDt ? this.$moment(params.row.purchaseDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t('m.i.bs.raiseDt'),
          key: 'raiseDt',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.raiseDt ? this.$moment(params.row.raiseDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t('m.i.bs.paymentDt'),
          key: 'paymentDt',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.paymentDt ? this.$moment(params.row.paymentDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t('m.i.bs.transPlace'),
          key: 'transPlace',
          hiddenCol: false,
          render: (h, params) => {
            let transPlace =this.getDictValueFromMap(this.dictMap, 'TransPlace', params.row.transPlace);
            return h("span", {
              domProps: {
                title: transPlace
              }
            }, transPlace);
          }
        },
        {
          title: this.$t("m.i.bs.totalFeeAmt"),
          key: "totalFeeAmt",
          align: "right",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.totalFeeAmt, 2, ","));
          }
        },
        {
          title: this.$t("m.i.bs.totalSettleAmt"),
          key: "totalSettleAmt",
          align: "right",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.totalSettleAmt, 2, ","));
          }
        },
        {
          title: this.$t("m.i.bs.totalCollectAmt"),
          key: "totalCollectAmt",
          align: "right",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.totalCollectAmt, 2, ","));
          }
        }
      ];
      return {
        creationAmtRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "产品规模(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        validAcctNoRules: [{
          test: /^[0-9a-zA-Z]{1,32}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为32位"
        }],
        formItem: {
          batchNo:"",
          baseAssetType:"",
          stdProductNo: "",
          stdProductNameLike:"",
          ecdsAcctNo:"",
          dpstBrchCode:"",
          dpstBrchName:"",
          sellBrchName:"",
          minCreationAmt:"",
          maxCreationAmt:"",
          minPurchaseDt:"",
          maxPurchaseDt:"",
          billNoLike:"",
          minRemitDt:"",
          maxRemitDt:"",
          minDueDt:"",
          maxDueDt:""
        },
        purchaseDate:[],
        remitDt:[],
        dueDt:[],
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showStdCorpDpstOccurBill(params.row.batchNo);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t("m.i.bs.baseAssetType"),
            key: "baseAssetType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let baseAssetType = this.getDictValueFromMap(this.dictMap, "BaseAssetType", params.row.baseAssetType);
              return h("span", {
                domProps: {
                  title: baseAssetType
                }
              }, baseAssetType);
            }
          },
          {
            title: this.$t('m.i.bs.stdProductName'),
            key: 'stdProductName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.stdProductShortName'),
            key: 'stdProductShortName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billClass = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: billClass
                }
              }, billClass);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billType = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: billType
                }
              }, billType);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.id)
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            align: "right",
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
            title: this.$t("m.i.bs.flowStatus"),
            key: "flowStatus",
            hiddenCol: false,
            render: (h, params) => {
              let flowStatus = this.getDictValueFromMap(this.dictMap, "DpstBillFlowStatus", params.row.flowStatus);
              return h("span", {
                domProps: {
                  title: flowStatus
                }
              }, flowStatus);
            }
          },
          {
            title: this.$t("m.i.bs.dueRecoverAmt"),
            key: "dueRecoverAmt",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dueRecoverAmt = formatNumber(params.row.dueRecoverAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: dueRecoverAmt
                }
              }, dueRecoverAmt);
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
            title: this.$t("m.i.billInfo.dueMatDt"),
            key: "dueMatDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueMatDt == null || params.row.dueMatDt === "") {
                return "";
              }
              let dueMatDt = this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", dueMatDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptAcctNo'),
            key: "acptAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankNo'),
            key: "cfmAppBankNo",
            sortable: true,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: false,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankNo'),
            key: "acptGuarntrBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankNo'),
            key: "discBankNo",
            sortable: true,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            sortable: false,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankNo'),
            key: "discGuarntrBankNo",
            sortable: true,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: false,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankNo'),
            key: "guarntrTrustBankNo",
            sortable: true,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: false,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.bs.custAcctNo'),
            key: "custAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.custPyeeAcctNo'),
            key: "custPyeeAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.custPyeeBankNo'),
            key: "custPyeeBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.custName'),
            key: "custName",
            sortable: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.custBankNo'),
            key: "custBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.feeAmt'),
            key: "feeAmt",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let feeAmt = formatNumber(params.row.feeAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: feeAmt
                }
              }, feeAmt);
            }
          },
          {
            title: this.$t('m.i.bs.settleAmt'),
            key: "settleAmt",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let settleAmt = formatNumber(params.row.settleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: settleAmt
                }
              }, settleAmt);
            }
          },
          {
            title: this.$t('m.i.bs.endrsmtApplDt'),
            key: "endrsmtApplDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.endrsmtApplDt == null || params.row.endrsmtApplDt === "") {
                return "";
              }
              let endrsmtApplDt = this.$moment(params.row.endrsmtApplDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", endrsmtApplDt);
            }
          },
          {
            title: this.$t('m.i.bs.endrsmtSignDt'),
            key: "endrsmtSignDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.endrsmtSignDt == null || params.row.endrsmtSignDt === "") {
                return "";
              }
              let endrsmtSignDt = this.$moment(params.row.endrsmtSignDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", endrsmtSignDt);
            }
          },
          {
            title: this.$t('m.i.bs.settleStatus'),
            key: "settleStatus",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let settleStatus = this.formatSettleStatus(params.row.settleStatus);
              return h("span", {
                domProps: {
                  title: settleStatus
                }
              }, settleStatus);
            }
          },
          {
            title: this.$t('m.i.bs.isSettleLock'),
            key: "isSettleLock",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let isSettleLock = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isSettleLock);
              return h("span", {
                domProps: {
                  title: isSettleLock
                }
              }, isSettleLock);
            }
          },
          {
            title: this.$t('m.i.bs.settleDt'),
            key: "settleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.settleDt == null || params.row.settleDt === "") {
                return "";
              }
              let settleDt = this.$moment(params.row.settleDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", settleDt);
            }
          },
          {
            title: this.$t('m.i.bs.payRefuseReason'),
            key: "payRefuseReason",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t('m.i.bs.payStatus'),
            key: "payStatus",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let payStatus = this.formatPayStatus(params.row.payStatus);
              return h("span", {
                domProps: {
                  title: payStatus
                }
              }, payStatus);
            }
          },
        ],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        showCpesBranch:false,
        showCustAcctNoWin: false,
        baseAssetTypeList:[],
        transPlaceList:[],
        purchaseResultList:[],
        tempShowExcelTemplateWin: false,
        totalAmt: "",
        totalNum: "",
        param: null,
        rows: null,
        selectExportType: "",
        queryUrl: "/pe/busiqry/stdCorpDpstOccurQuery/func_pageingStdCorpDpstBatchOccurList",
        ifDisabledExport: false,
        showColumns: this.deepClone(batchColumns),
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId: "",
        occurData: { rows: [], total: 1 }
      };
    },
    mounted() {
      // this.getOccurData();
      this.getDictListByGroups("BaseAssetType,TransPlace,PurchaseResult,Yon,DraftTypeCode,CDMedia,StdCreationFlowStatus,DpstBillFlowStatus,CollectMode").then(res => {
        this.baseAssetTypeList = res.get("BaseAssetType");
        this.transPlaceList = res.get("TransPlace");
        this.purchaseResultList = res.get("PurchaseResult");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      getSumMoneyAndTotal(params) {
        this.totalNum = params.total;
        this.totalAmt = formatNumber(params.sumMoney, 2, ",");
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        // this.$refs.datagrid.url = this.queryUrl;
        this.$refs.datagrid.dataChange(1);
        // this.getOccurData();
      },
      //重置表单查询结果
      resetSearch() {
        this.purchaseDate=[];
        this.formItem.minPurchaseDt="";
        this.formItem.maxPurchaseDt="";
        this.formItem.billNoLike="";
        this.formItem.minRemitDt="";
        this.formItem.maxRemitDt="";
        this.remitDt=[];
        this.formItem.minDueDt="";
        this.formItem.maxDueDt="";
        this.dueDt=[];
        this.formItem.stdProductNo="";
        this.formItem.ecdsAcctNo="";
        this.formItem.dpstBrchCode="";
        this.$refs.formItem.resetFields();
      },
      //申购日期
      handlePurchaseDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minPurchaseDt = arr[0].replace(/-/g, "");
          this.formItem.maxPurchaseDt = arr[1].replace(/-/g, "");
          this.purchaseDate = [arr[0], arr[1]];
        } else {
          this.formItem.minPurchaseDt = "";
          this.formItem.maxPurchaseDt = "";
          this.purchaseDate = [];
        }
      },
      //出票日期
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }

      },
      //票据到期日
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

      },
      // 根据弹框所选数据进行赋值
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        this.showCpesProductBranch = false;
      },
      // 根据弹框所选数据进行赋值
      queryCpesBrchName() {
        this.showCpesBranch = true;
      },
      showCpesBranchClose() {
        this.showCpesBranch = false;
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.dpstBrchCode = info.brchCode;
        this.formItem.dpstBrchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },
      //查询电票账号
      queryEcdsAcctNo(){
        this.showCustAcctNoWin = true;
      },
      showCustAcctNoWinClose(){
        this.showCustAcctNoWin = false;
      },
      custAcctNoSelectSubmit(info) {
        this.formItem.ecdsAcctNo = info.custAcctNo;
        this.formItem.ecdsAcctName = info.custName;
        this.showCustAcctNoWin = false;
      },
      //统计总金额和总笔数
      getOccurData() {
        let obj = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize
        });
        let url = this.queryUrl;
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.occurData = data;
                this.totalNum = data.pageInfo.count;
                this.totalAmt = formatNumber(data.pageInfo.sumMoney, 2, ",");
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      //点击批次号超链接查询明细
      showStdCorpDpstOccurBill(batchNo) {
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.pageInfo.pageNo = 1;
        this.formItem.batchNo = batchNo;
        this.ifDisabledExport = true;
        this.queryUrl = "/pe/busiqry/stdCorpDpstOccurQuery/func_pageingStdCorpDpstBillOccurList";
        this.$nextTick(() => {
          this.showColumns = this.deepClone(this.billColumns);
          this.$refs.datagrid.createShowCol(this.billColumns);
          this.handleSearch();
        });
      },
      //批次查询
      queryStdCorpDpstOccurBatch() {
        // this.$refs.datagrid.url = null;
        this.queryUrl = "/pe/busiqry/stdCorpDpstOccurQuery/func_pageingStdCorpDpstBatchOccurList";
        this.ifDisabledExport = false;
        this.showColumns = this.deepClone(this.batchColumns);
        this.handleSearch();
      },
      //明细查询
      queryStdCorpDpstOccurBill() {
        // this.$refs.datagrid.url = null;
        this.queryUrl = "/pe/busiqry/stdCorpDpstOccurQuery/func_pageingStdCorpDpstBillOccurList";
        this.ifDisabledExport = true;
        this.showColumns = this.deepClone(this.billColumns);
        this.handleSearch();
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "stdCorpDpstBatchOccurExportInfo";
        } else {
          this.param = "stdCorpDpstBillOccurExportInfo";
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
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/stdCorpDpstOccurQuery/func_exportStdCorpDpstBatchOccurExcel";
        } else {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/stdCorpDpstOccurQuery/func_exportStdCorpDpstBillOccurExcel";
        }
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          if (this.selectExportType === "batch") {
            options.params.ids = this.$refs.datagrid.selectIds;
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
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.listId = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billId,billNo,listId){
        this.billId = billId;
        this.billNo = billNo;
        this.listId = listId;
        this.showBillInfoWin = true;
      },

     //格式化标票明细结清状态
      formatSettleStatus(settleStatus){
        let settleStatusValue = "";
        if("0" == settleStatus){
          settleStatusValue = "正常";
        }else if("1" == settleStatus){
          settleStatusValue = "提示付款结清";
        }else if("2" == settleStatus){
          settleStatusValue = "追索结清";
        }else if("3" == settleStatus){
          settleStatusValue = "提前提示付款已拒付";
        }else if("4" == settleStatus){
          settleStatusValue = "提示付款已拒付";
        }
      return settleStatusValue;
  },
      //格式化标票明细兑付状态
      formatPayStatus(payStatus){
        let payStatusValue = "";
          if("0" == payStatus){
            payStatusValue = "未兑付";
          }else if("1" == payStatus){
            payStatusValue = "兑付中";
          }else if("2" == payStatus){
            payStatusValue = "已兑付";
          }
        return payStatusValue;
      }
    }
  };
</script>

<style scoped>

</style>
