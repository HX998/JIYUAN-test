<!--点击成交-买入/卖出点击成交展示-受理-->
<template>
  <div>
    <h-msg-box v-model="tempSaleApplyAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增报价</span>
        <span v-else-if="batchParams.batchType==='modify'">修改报价</span>
        <span v-else-if="batchParams.batchType==='accept'">受理报价</span>
        <span v-else-if="batchParams.batchType==='show'">查看报价</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search"
                onlyBlurRequire>
          <busi-type v-model="addOrEditForm.busiType" :dictList="batchParams.busiTypeList" :readonly="true"></busi-type>
          <common-input v-model="addOrEditForm.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo"
                        :readonly="true"></common-input>
          <div v-if="displayType === 'sale'">
            <common-input v-model="addOrEditForm.saleBrchName" :label="$t('m.i.be.brchName')" prop="saleBrchName"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.saleTraderName" :label="$t('m.i.be.traderName')" prop="saleTraderName"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.buyBrchName" :label="$t('m.i.be.otherBrchName')" prop="buyBrchName"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.buyBrchCode" :label="$t('m.i.be.custBrchCode')" prop="buyBrchCode"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.buyProductName" :label="$t('m.i.be.custProductNo')"
                          prop="buyProductName" :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.buyTraderNo" :label="$t('m.i.be.custTraderNo')" prop="buyTraderNo"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.buyTraderName" :label="$t('m.i.be.custTraderName')"
                          prop="buyTraderName"
                          :readonly="true"></common-input>
          </div>
          <div v-else>
            <common-input v-model="addOrEditForm.buyBrchName" :label="$t('m.i.be.brchName')" prop="saleBrchName"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.buyTraderName" :label="$t('m.i.be.traderName')" prop="saleTraderName"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.saleBrchName" :label="$t('m.i.be.otherBrchName')" prop="buyBrchName"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.saleBrchCode" :label="$t('m.i.be.custBrchCode')" prop="buyBrchCode"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.saleProductName" :label="$t('m.i.be.custProductNo')"
                          prop="buyProductName" :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.saleTraderNo" :label="$t('m.i.be.custTraderNo')" prop="buyTraderNo"
                          :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.saleTraderName" :label="$t('m.i.be.custTraderName')"
                          prop="buyTraderName"
                          :readonly="true"></common-input>
          </div>

          <bill-type v-model="addOrEditForm.billType" :dictList="batchParams.billTypeList" :required="true"
                     :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></bill-type>
          <bill-class v-model="addOrEditForm.billClass" :dictList="batchParams.billClassList" :required="true"
                      :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></bill-class>
          <common-input v-model="addOrEditForm.ratePct" :label="$t('m.i.pe.dealRate')" prop="ratePct"
                        :validRules="ratePctRule"
                        :required="true"
                        :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-input>
          <common-select v-model="addOrEditForm.subDeal" :label="$t('m.i.be.subDeal')" prop="subDeal"
                         :dictList="batchParams.isList"
                         :required="true"
                         :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-select>
          <common-select v-model="addOrEditForm.clearType" :label="$t('m.i.be.clearType')" prop="clearType"
                         :dictList="batchParams.clearTypeList"
                         :required="true"
                         :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-select>
          <common-select v-model="addOrEditForm.settleMode" :label="$t('m.i.be.settleMode')" prop="settleMode"
                         :dictList="batchParams.settleTypeList"
                         :required="true"
                         :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-select>
          <common-select v-model="addOrEditForm.clearSpeed" :label="$t('m.i.be.clearSpeed')" prop="clearSpeed"
                         :dictList="batchParams.clearSpeedList"
                         :required="true" :readonly="true"></common-select>
          <common-date-picker v-model="addOrEditForm.firstSettleDt" :label="$t('m.i.be.settleDt')" prop="firstSettleDt"
                              :readonly="true" :required="true"></common-date-picker>
          <common-time-picker v-model="addOrEditForm.setTm" :label="$t('m.i.be.setTm')" prop="setTm"
                              :required="true" :readonly="true"></common-time-picker>
          <common-time-picker v-model="addOrEditForm.quoteTm" :label="$t('m.i.be.quoteTm')" prop="quoteTm"
                              :required="true" :readonly="true"></common-time-picker>
          <common-type-field v-model="addOrEditForm.totalAmt" :label="$t('m.i.common.totalAmtBillPackage')" prop="totalAmt"
                        :readonly="true"></common-type-field>
          <common-input v-model="addOrEditForm.totalNum" :label="$t('m.i.common.totalNumBillPackage')" prop="totalNum"
                        :readonly="true"></common-input>
          <common-type-field v-model="addOrEditForm.firstPayInterest" :label="$t('m.i.be.payInterestByUnit')"
                        prop="firstPayInterest"
                        :readonly="true"></common-type-field>
          <common-type-field v-model="addOrEditForm.firstSettleAmt" :label="$t('m.i.be.settleAmtByUnit')"
                        prop="firstSettleAmt"
                        :readonly="true"></common-type-field>
          <common-input v-model="addOrEditForm.tenorDays" :label="$t('m.i.be.tenorDays')" prop="tenorDays"
                        :readonly="true" class="h-form-long-label"></common-input>
          <common-input v-model="addOrEditForm.yieldRatePct" :label="$t('m.i.be.yieldRate')" prop="yieldRate"
                        :readonly="true"></common-input>
        </h-form>
        <!--数据展示表格-->
        <h-datagrid
            :columns="columns"
            highlight-row
            :auto-load="false"
            :url="dataGridUrl"
            :bindForm="dataGridFormItem"
            :has-select="false"
            :rowSelect="true"
            ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <slot name="dataGridToolbar">
              <h-button type="primary" @click="pickBill()" v-if="batchParams.batchType!=='show'&&((displayType==='rebuy'&&addOrEditForm.subDeal==='1')||displayType==='sale')">
                {{$t("m.i.common.pickBill")}}
              </h-button>
              <h-button type="primary" @click="importPickBill()"
                        v-if="batchParams.batchType!=='show' && displayType!=='rebuy'">
                {{$t("m.i.common.exportPickBill")}}
              </h-button>
              <h-button type="primary" @click="calcInterest()" v-if="batchParams.batchType!=='show'">
                {{$t("m.i.be.calcInterest")}}
              </h-button>
              <h-button type="primary" @click="setAssetType()"  v-if="openI9flag && displayType==='rebuy' && isShowInner==='1'">
                {{$t('m.i.be.setAssetType')}}
              </h-button>

              <h-button type="primary" @click="applySubmit()" v-if="batchParams.batchType!=='show'">
                {{$t("m.i.be.applyBatch")}}
              </h-button>
              <h-button type="primary" @click="deleteBill()" v-if="batchParams.batchType!=='show'&&((displayType==='rebuy'&&addOrEditForm.subDeal==='1')||displayType==='sale')">
                {{$t("m.i.be.deleteBill")}}
              </h-button>
              <h-button type="primary" @click="importTemplate()"
                        v-if="batchParams.batchType!=='show' && displayType!=='rebuy'">
                {{$t("m.i.common.templateDownload")}}
              </h-button>
              <h-button type="primary" @click="exportBill()" v-if="batchParams.batchType!=='show'"
                        :disabled="exportBillCommit">
                {{$t("m.i.common.exportExcel")}}
              </h-button>
            </slot>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <h-msg-box v-model="applyWin" :maximize="false" width="400" :footerHide="true" :closable="false" :z-index="2010">
      <div class="modal-body">
        <div class="h-modal-confirm">
          <div class="h-modal-confirm-head">
            <div class="h-modal-confirm-head-icon h-modal-confirm-head-icon-confirm">
              <i class="h-icon iconfont icon-feedback"></i>
            </div>
            <div class="h-modal-confirm-head-title">确认要继续提交申请吗?</div>
          </div>
          <div class="h-modal-confirm-body">
            <div>{{applyTitle}}</div>
          </div>
          <div class="h-modal-confirm-footer">
            <button type="button" @click="applyClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span></button>
            <button type="button" @click="applyCommit()" class="h-btn h-btn-primary h-btn-large"><span>确定</span>
            </button>
          </div>
        </div>
      </div>
    </h-msg-box>
    <!--卖出挑票-->
    <sale-pick-bill :pickBillWin="salePickBillWin" :pickBillParams="pickBillParams" :pickDataGridUrl="pickDataGridUrl"
                    @pickBillWinClose="pickBillWinClose"></sale-pick-bill>
    <rebuy-pick-bill :pickBillWin="rebuyPickBillWin" :pickBillParams="pickBillParams" :pickDataGridUrl="pickDataGridUrl"
                     @pickBillWinClose="pickBillWinClose"></rebuy-pick-bill>
    <!-- 批量导入-->
    <upload
      :uploadUrl="uploadUrl"
      :batchId="subBatchId"
      @uploadWinClose="uploadWinClose"
      :uploadWin="uploadWin"
      :importSelect="importSelect"
      :flag="flag"
      :selectDataFirst="selectDataFirst">
    </upload>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <!--提交申请-->
    <apply-commit :applyWin="applyWin" :applyTitle="applyTitle" @applyClose="applyClose"
                  @applyCommit="applyCommit"></apply-commit>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="showExcelTemplateWin" :param="exportParam"
                           :rows="this.rows"></common-excel-download>
    <!--资产分类设置-->
    <assetIndustry
      :batchId="curBatchId"
      :billIds="billIds"
      :dictMap="dictObject"
      :assetInd="assetInd"
      :isAssetIndustryChooseBoolen="isAssetIndustryChooseBoolen"
      :isNeedBookTypeBoolen="isNeedBookTypeBoolen"
      :assetIndustryWin="assetIndustryWin"
      @assetIndustryClose="assetIndustryClose">
    </assetIndustry>
  </div>
</template>

<script>
  import { post, formatNumber,getUploadImgType ,getDictValueFromMap,getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleOrRebuyDealDisplayAcpt",
    components: {
      ApplyCommit: () => import(/* webpackChunkName: "be/market/common/applyCommit"*/"@/views/bizViews/be/market/common/applyCommit"),
      SalePickBill: () => import(/* webpackChunkName: "be/market/clickdeal/sale/salePickBill"*/"@/views/bizViews/be/market/clickdeal/sale/salePickBill"),
      RebuyPickBill: () => import(/* webpackChunkName: "be/market/clickdeal/rebuy/rebuyPickBill"*/"@/views/bizViews/be/market/clickdeal/rebuy/rebuyPickBill"),
      SelectTransBrchType: () => import(/* webpackChunkName: "be/market/common/selectTransBrchType"*/"@/views/bizViews/be/market/common/selectTransBrchType"),
      AssetIndustry:()=>import(/* webpackChunkName: "be/market/quote/rebuy/assetIndustry" */`@/views/bizViews/be/market/quote/rebuy/assetIndustry`),
      ApplyFormItem: () => import(/* webpackChunkName: "be/market/common/applyFormItem"*/"@/views/bizViews/be/market/common/applyFormItem"),
      Upload:()=>import(/* webpackChunkName: "be/market/clickdeal/sale/upload" */`@/views/bizViews/be/market/clickdeal/sale/upload`),
    },
    data() {
      return {
        //资产分类添加的data
        openI9flag:"",
        dictObject:{},
        batchId:'',
        curBatchId:this.subBatchId,
        billIds:'',
        assetInd:'',
        flag:"0",
        isNeedBookTypeBoolen:false,
        isAssetIndustryChooseBoolen:false,
        assetIndustryWin:false,
        isInnerDiscSetIndustry:"",
        isShowInner:"",
        showExcelTemplateWin: false,
        rows: null,
        exportParam:null,
        queryBatchIdUrl: "/be/market/clickdeal/sale/saleDealDisplay/func_editClickDealSale",
        pickBillSubmitUrl: "/be/market/clickdeal/sale/saleDealDisplay/func_addClickDealSaleBill",
        pickDataGridUrl: "/be/market/clickdeal/sale/saleDealDisplay/func_pagingQueryHldrBillInfo",
        importPickBillUploadUrl: "/be/market/clickdeal/sale/saleDealDisplay/func_batchPickBillStock",
        calcInterestUrl: "/be/market/clickdeal/sale/saleDealDisplay/func_calcInterest",
        applySubmitUrl: "/be/market/clickdeal/sale/saleDealDisplay/func_commitClickSaleBatchApply",
        deleteBillUrl: "/be/market/clickdeal/sale/saleDealDisplay/func_deleteBill",
        importTemplateUrl: "/be/market/clickdeal/sale/saleDealDisplay/func_downloadSaleBill",
        exportBillUrl: "/be/market/clickdeal/sale/saleDealDisplay/func_exportClickSaleBillDetail",
        saveBatchFuncUrl: "/be/market/clickdeal/sale/saleApply/func_addClickDealSaleBatch",
        ratePctRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        superBatchId: "",
        subBatchId: "",
        transBrchTypeParams: {
          batchId: "",
          operate: "tradeClass"
        },
        addOrEditForm: {
          workDate: "",
          id: "",
          busiType: "",
          saleBrchName: "",
          saleTraderName: "",
          trDir: "",
          isAnony: "",
          billType: "",
          billClass: "",
          tradeRange: "",
          ratePct: "",
          subDeal: "",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          firstSettleDt: "",
          setTm: "",
          quoteTm: "",
          creditMainBrchClass: "",
          transClearMode: "",
          productNo: "",
          totalAmt: "",
          totalNum: "",
          interest: "",
          settleAmt: "",
          tenorDays: "",
          yieldRate: "",
          isInner:""
        },
        dataGridFormItem: {
          subBatchId: ""
        },
        columns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.batchParams.dictMap, 'BillOrigin', params.row.billOrigin);
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
                    this.showBillInfo(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
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
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: 'dueMatDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueMatDt?this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBrchCode"),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
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
            title: this.$t("m.i.billInfo.acptGuarntrBrchCode"),
            key: "acptGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptGuarntrBankName"),
            key: "acptGuarntrBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBrchCode"),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBrchCode"),
            key: "discGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBankName"),
            key: "discGuarntrBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBrchCode"),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "guarntrTrustBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.creditMainBrchCode"),
            key: "creditMainBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankName"),
            key: "creditMainBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CreditMajor", params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.batchParams.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.remainingPeriod'),
            key: "remainDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.payInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.settleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            }
          },
        ],
        //记录批次是否已保存
        hadBatchSave: false,
        salePickBillWin: false,
        rebuyPickBillWin: false,
        pickBillParams: {},
        uploadUrl:'',
        uploadWin:false,
        importSelect:false,
        selectDataFirst:false,
        isCurChange: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + this.importPickBillUploadUrl,  //excel数据导入接口
          uploadParams: {//调用excel数据解析接口时附带的额外参数
            batchId: "",
            flag: "1"
          }
        },
        exportBillCommit: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        applyWin: false,
        applyTitle: "",
        riskFlag: "0"
      };
    },
    props: {
      saleOrRebuyDealDisplayAcptWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      },
      dataGridUrl: {
        type: String,
        default: ""
      },
      //弹框类型
      displayType: {
        type: String,
        default: ""
      }
    },
    computed: {
      tempSaleApplyAddOrEditWin: {
        get() {
          return this.saleOrRebuyDealDisplayAcptWin;
        },
        set() {
        }
      }
    },
    watch: {
      saleOrRebuyDealDisplayAcptWin(val) {
        if (val) {
          if (!!this.batchParams.queryBatchIdUrl) {
            this.queryBatchIdUrl = this.batchParams.queryBatchIdUrl;
          }
          if (!!this.batchParams.pickBillSubmitUrl) {
            this.pickBillSubmitUrl = this.batchParams.pickBillSubmitUrl;
          }
          if (!!this.batchParams.pickDataGridUrl) {
            this.pickDataGridUrl = this.batchParams.pickDataGridUrl;
          }
          if (!!this.batchParams.importPickBillUploadUrl) {
            this.importPickBillUploadUrl = this.batchParams.importPickBillUploadUrl;
          }
          if (!!this.batchParams.calcInterestUrl) {
            this.calcInterestUrl = this.batchParams.calcInterestUrl;
          }
          if (!!this.batchParams.applySubmitUrl) {
            this.applySubmitUrl = this.batchParams.applySubmitUrl;
          }
          if (!!this.batchParams.deleteBillUrl) {
            this.deleteBillUrl = this.batchParams.deleteBillUrl;
          }
          if (!!this.batchParams.importTemplateUrl) {
            this.importTemplateUrl = this.batchParams.importTemplateUrl;
          }
          if (!!this.batchParams.exportBillUrl) {
            this.exportBillUrl = this.batchParams.exportBillUrl;
          }
          if (!!this.batchParams.saveBatchFuncUrl) {
            this.saveBatchFuncUrl = this.batchParams.saveBatchFuncUrl;
          }
          this.$nextTick(() => {
            this.superBatchId = this.batchParams.batchId;
            this.subBatchId = this.batchParams.subBatchId;
            this.flag = this.batchParams.flag;
            this.dataGridFormItem.subBatchId = this.subBatchId;
            this.transBrchTypeParams.batchId = this.superBatchId;
            if (this.batchParams.batchType === "add") {
              this.hadBatchSave = true;
              this.$refs.datagrid.tData = [];
              this.queryObjById();
            }
            if (this.batchParams.batchType !== "add") {
              this.hadBatchSave = true;
              this.queryObjById();
              this.handleSearch();
            }
          });
        }
      },
      superBatchId(val) {
        this.superBatchId = val;
      },
      subBatchId(val) {
        this.subBatchId = val;
      }
    },
    methods: {
      assetIndustryClose(){
        this.billIds=null;
        this.assetIndustryWin=false;
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
        this.assetInd=null;
        this.$refs.datagrid.dataChange(1);
      },
      // 设置资产分类
      setAssetType(){
        let list = this.$refs.datagrid.selects;
        let ids = "";
        let assetInd='';
        let isAssetIndustry=true;
        for (let i = 0; i < list.length; i++) {
          let obj=list[i];
          ids += obj.id;
          if(assetInd){
            if(isAssetIndustry){
              if(!(assetInd===obj.assetIndustry)){
                isAssetIndustry=false;
              }
            }
          }else{
            assetInd=obj.assetIndustry;
          }
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.curBatchId=this.subBatchId;
        this.billIds=ids;
        // //资产分类是否可选，"1"可选 false 表示非只读
        // this.isAssetIndustryChooseBoolen=(this.formItem.isAssetIndustryChoose=='1'?false:true);
        // if(isAssetIndustry&&assetInd&&!this.isAssetIndustryChooseBoolen){
        //   this.assetInd=assetInd;
        // }else{
        //   this.assetInd=this.formItem.defaultAssetIndustry;
        // }
        // this.isNeedBookTypeBoolen=(this.formItem.isNeedBookType=='1'?true:false);

        this.assetIndustryWin=true;
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { batchId: this.superBatchId, subBatchId: this.subBatchId };
        post(params, this.queryBatchIdUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm = obj;
              if (this.batchParams.isInner!==null && this.batchParams.isInner !=="" && this.batchParams.isInner !== undefined) {
                this.getParam(this.batchParams.isInner);
              } else {
                this.getParam(this.addOrEditForm.isInner);
              }
              this.addOrEditForm.firstSettleDt = obj.firstSettleDt === null ? "" : obj.firstSettleDt.toString();
              this.addOrEditForm.setTm = obj.setTm === null ? "" : obj.setTm.toString();
              this.addOrEditForm.quoteTm = obj.quoteTm === null ? "" : obj.quoteTm.toString();
              this.superBatchId = obj.superBatchId;
              this.subBatchId = obj.id;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.hadBatchSave = false;
        this.superBatchId = "";
        this.subBatchId = "";
        this.$emit("saleOrRebuyDealAcptWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      saveBatch(optType) {
        if (optType) {
          this.triggerClickEvent(optType);
        } else {
          this.$msgTip.success(this);
        }
        //不能修改，不需要保存
        /*this.saveBatchFunc(res=>{

        });*/
      },
      saveBatchFunc(callback) {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.firstSettleDt = this.addOrEditForm.firstSettleDt.replace(/-/g, "");
            post(this.addOrEditForm, this.saveBatchFuncUrl).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.subBatchId = res.data.retData.id;
                  this.transBrchTypeParams.batchId = res.data.retData.id;
                  this.dataGridFormItem.subBatchId = res.data.retData.id;
                  this.addOrEditForm.id = res.data.retData.id;
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.hadBatchSave = true;
                  callback();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //按钮事件触发保存
      triggerClickEvent(optType) {
        if (optType === "pickBill") {//挑票
          this.pickBillCallBack();
        } else if (optType === "importPickBill") {//导入挑票
          this.importPickBillCallback();
        } else if (optType === "calcInterest") {//利息计算
          this.calcInterestCallback();
        } else if (optType === "applySubmit") {//提交申请
          this.applySubmitCallback();
        }
      },
      //挑票
      pickBill() {
        this.saveBatch("pickBill");
      },
      pickBillCallBack() {
        if (this.hadBatchSave) {
          this.pickBillParams = this.batchParams;
          this.pickBillParams.billType = this.addOrEditForm.billType;
          this.pickBillParams.billClass = this.addOrEditForm.billClass;
          this.pickBillParams.url = this.pickBillSubmitUrl;
          if (this.displayType === "rebuy") {
            this.pickBillParams.superBatchId = this.superBatchId;
            this.pickBillParams.subBatchId = this.subBatchId;
            this.rebuyPickBillWin = true;
          } else {
            this.pickBillParams.batchId = this.superBatchId;
            this.pickBillParams.subBatchId = this.subBatchId;
            this.pickBillParams.creditBranchClass = this.addOrEditForm.creditMainBrchClass;
            this.pickBillParams.creditBranchClassName = this.batchParams.brchClassMap.get(this.addOrEditForm.creditMainBrchClass);
            this.salePickBillWin = true;
          }
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      pickBillWinClose() {
        this.pickBillParams = {};
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.queryObjById();
        if (this.displayType === "rebuy") {
          this.rebuyPickBillWin = false;
        } else {
          this.salePickBillWin = false;
        }
      },
      //导入挑票
      importPickBill() {
        this.saveBatch("importPickBill");
      },
      importPickBillCallback() {
        if (this.hadBatchSave) {
          this.uploadWin = true;
          this.uploadUrl = window.LOCAL_CONFIG.API_HOME + this.importPickBillUploadUrl;
          this.importSelect = true;
          this.selectDataFirst = false;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      uploadWinClose() {
        this.uploadWin = false;
        this.uploadUrl = '';
        this.importSelect = false;
        this.selectDataFirst = false;
        this.queryObjById();
        this.$refs.datagrid.dataChange(1);
      },
      // 利息计算
      calcInterest() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要计算利息吗") + "?",
          onOk: () => {
            this.saveBatch("calcInterest");
          }
        });
      },
      getParam(isInner){
        if (this.isInnerDiscSetIndustry === "0" && isInner ==="1") {
          this.isShowInner = "0";
        } else {
          this.isShowInner = "1";
        }
      },
      calcInterestCallback() {
        if (this.hadBatchSave) {
          let params = { subBatchId: this.subBatchId };
          this.sendPost(params, this.calcInterestUrl, res => {
            this.queryObjById();
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      getBillNoAndCdRange(billNo, billRangeStart, billRangeEnd) {
        if (billNo && billNo.length === 30) {
          let mark = billNo.charAt(0);
          if (mark === '5' || mark === '6' || mark === '7' || mark === '8') {
            if (billRangeStart === 0) {
              return billNo+"，子票区间[0]";
            }
            if(billRangeStart){
              if (billRangeEnd) {
                return billNo+"，子票区间["+( "0000000000000000" + billRangeStart ).substr( -12 )
                  +( "0000000000000000" + billRangeEnd ).substr( -12 )+"]";
              } else {
                return billNo+"，子票区间["+( "0000000000000000" + billRangeStart ).substr( -12 )+"]";
              }
            }
          }
        }
        return billNo;
      },
      //提交申请
      applySubmit() {
        if(window.sessionStorage.getItem("isOpenI9")=="1"){
          if(this.displayType === "rebuy"){
            let data=this.$refs.datagrid.tData
            if(data!=null || data!=""){
              for(let i=0;i<data.length;i++){
                if(data[i].assetIndustry==null || data[i].assetIndustry==""){
                  this.$msgTip.error(this, { info: "未设置资产分类，不允许提交"});
                  return;
                }
              }
            }
            this.applyWin = true;
            this.applyTitle = "确认要提交申请吗?";
          }else{
            let flag1="";
            getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
              let value = res.value
              if(value=='0'){//否
                flag1="0";
              }else if(value=="1"){//是
                flag1="1";
              }
              let list=this.$refs.datagrid.tData;
              let flag=1;
              let billList='';
              console.log(list)
              for(let i=0;i<list.length;i++){
                if (list[i].assetIndustry == "1") {
                  if(billList){
                    billList+="、";
                  }
                  billList+=('票据(包)号码'+this.getBillNoAndCdRange(list[i].billNo,list[i].billRangeStart,list[i].billRangeEnd));
                  flag=0;
                }
              }
              if(flag==0 && flag1=="0"){
                let info="选中" + billList + "资产类型为持有-按摊余成本计量，不允许提交";
                this.$msgTip.error(this, { info: info});

              }else if(flag==0 && flag1=="1"){
                this.$hMsgBox.confirm({
                  title: "确认",
                  content: "选中" + billList + "资产类型为持有-按摊余成本计量，请确定是否提交？",
                  onOk: () => {
                    this.applyWin = true;
                    this.applyTitle = "确认要提交申请吗?";
                  },
                  onCancel: () =>{
                    return;
                  }
                });
              }else{
                this.applyWin = true;
                this.applyTitle = "确认要提交申请吗?";
              }

            })
          }
        }else {
          this.applyWin = true;
          this.applyTitle = "确认要提交申请吗?";
        }


      },
      applySubmitCallback() {
        if (this.hadBatchSave) {
          this.riskFlag = "0";
          let params = { subBatchId: this.subBatchId, riskFlag: this.riskFlag };
          post(params, this.applySubmitUrl).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                let riskInfo = obj.riskInfo;
                if (riskInfo) {
                  this.riskFlag = "1";
                  this.continueApply(riskInfo);
                } else {
                  this.$msgTip.success(this);
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.handleClose();
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 删除票据
      deleteBill() {
        if (this.hadBatchSave) {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要删除票据吗?",
            onOk: () => {
              let params = { subBatchId: this.subBatchId, billIdList: this.$refs.datagrid.selectIds };
              this.sendPost(params, this.deleteBillUrl, res => {
                this.queryObjById();
                this.$refs.datagrid.dataChange(1);

              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
              callback();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + this.importTemplateUrl;
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      showExcelTemplateWinClose() {
        this.showExcelTemplateWin = false;
      },
      // 导出清单
      exportBill() {
        if (this.hadBatchSave) {
          this.exportParam="clickDealRebuyOrSaleDisplayExport";
          if (this.$refs.datagrid.selectIds.length !== 0) {
            this.rows = this.$refs.datagrid.selectIds.length;
          } else {
            this.rows = this.$refs.datagrid.total;
          }
          this.showExcelTemplateWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url;
        url = window.LOCAL_CONFIG.API_HOME + this.exportBillUrl;
        if (exportType === "1") {
          let params = null;
          params = {
            ids: this.$refs.datagrid.selectIds,
            batchId: this.subBatchId,
            pageSize: this.$refs.datagrid.selectIds.length,
            field: field,
            exportType: exportType,
            excelName: this.exportParam
          };
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");

          let input1 = document.createElement("input");
          input1.type = "text";
          input1.name = "ids";
          input1.value = this.$refs.datagrid.selectIds;
          form.appendChild(input1);
          let input3 = document.createElement("input");
          input3.type = "text";
          input3.name = "field";
          input3.value = field;
          form.appendChild(input3);
          let input4 = document.createElement("input");
          input4.type = "text";
          input4.name = "exportType";
          input4.value = exportType;
          form.appendChild(input4);
          let input5 = document.createElement("input");
          input5.type = "text";
          input5.name = "excelName";
          input5.value = this.exportParam;
          form.appendChild(input5);
          let input6 = document.createElement("input");
          input6.type = "text";
          input6.name = "batchId";
          input6.value = this.subBatchId;
          form.appendChild(input6);

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },

      changeSpeed(currVal) {
        if (!this.isCurChange) {
          this.isCurChange = true;
          return;
        }
        let workDt = window.sessionStorage.getItem("workDate");
        // T+1 情况
        if (currVal === "CS01") {
          let workDate = this.$moment(workDt, "YYYYMMDD").format("YYYY/MM/DD");
          workDate = new Date(workDate);
          let workDatePlus = workDate.valueOf() + (1 * 24 * 60 * 60 * 1000);
          workDatePlus = new Date(workDatePlus);
          workDatePlus = this.$moment(workDatePlus, "YYYYMMDD").format("YYYYMMDD");
          post({ code: workDatePlus }, "/sm/oper/holiday/getWorkDate").then(res => {
            if (res && res.data.retCode === "000000") {
              this.addOrEditForm.firstSettleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYY-MM-DD");
            }
          });
        } else {
          this.addOrEditForm.firstSettleDt = this.$moment(workDt, "YYYYMMDD").format("YYYY-MM-DD");
        }

      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      applyClose() {
        this.applyWin = false;
        this.applyTitle = "";
      },
      applyCommit() {
        this.saveBatch("applySubmit");
        this.applyClose();
      },
      continueApply(content) {
        this.$hMsgBox.confirm({
          title: "确认要继续提交申请吗?",
          content: content,
          onOk: () => {
            let params = { subBatchId: this.subBatchId, riskFlag: this.riskFlag };
            post(params, this.applySubmitUrl).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let obj = res.data.retData;
                  this.$msgTip.success(this);
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.handleClose();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      }
    },
    mounted(){
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      this.getDictListByGroups("BookType,AssetIndustryManage,AssetIndustry").then(res => {
        this.dictObject={
          assetIndustryList:res.get("AssetIndustryManage"),
          bookTypeList:res.get("BookType")
        }
      });
      getSingleParamValuesByKeys("bm.valuate.is_inner_set_valuate").then(res => {
        let isResetIndustry = res["bm.valuate.is_inner_set_valuate"];
        if (isResetIndustry === "" || isResetIndustry == null || isResetIndustry == undefined) {
          this.isInnerDiscSetIndustry = "0";
        } else {
          this.isInnerDiscSetIndustry = isResetIndustry;
        }
      });
    }
  };
</script>

<style scoped>

</style>
