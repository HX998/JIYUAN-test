<template>
    <div>
      <h-msg-box v-model="tempPickBillWin" :mask-closable="false" @on-close="pickBillClose"  :maximize="true" width="1000" :footerHide="false" class="h-form-table-layer" >
        <p slot="header">
          <span >挑票页面</span>
        </p>
        <div :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="pickBillForm" :label-width="90" ref="pickBillForm" cols="4" class="h-form-search">
              <h-form-item :label="$t('m.i.billInfo.billType')" >
                <h-select v-model="pickBillForm.billType"  placeholder="请选择" readonly showTitle>
                  <h-option v-for="item in curDictMap['billTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.billClass')" >
                <h-select v-model="pickBillForm.billClass"  placeholder="请选择" readonly showTitle>
                  <h-option v-for="item in curDictMap['billClassList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')" >
                <h-input v-model="pickBillForm.batchNo" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="billAtm"  :label="$t('m.i.be.billMoneyByTenThousandUnit')" class="h-form-parentheses-label" v-if="pickBillFlag">
                <h-row >
                  <h-col span="11">
                    <h-form-item prop="minBillMoney" >
                      <h-typefield v-model="pickBillForm.minBillMoney" integerNum="12" type="money"
                                   suffixNum="2" placeholder="最多12位整数,2位小数" ></h-typefield>
                    </h-form-item>
                  </h-col>
                  <h-col span="2" style="text-align: center">-</h-col>
                  <h-col span="11">
                    <h-form-item prop="maxBillMoney" >
                      <h-typefield v-model="pickBillForm.maxBillMoney" integerNum="12" type="money"
                                   suffixNum="2" placeholder="最多12位整数,2位小数" ></h-typefield>
                    </h-form-item>
                  </h-col>
                </h-row>
              </h-form-item>
              <h-form-item prop="minDueDt" class="h-form-long-label" :label="$t('m.i.billInfo.minDueDate')"  v-if="pickBillFlag">
                <h-date-picker :value="pickBillForm.minDueDt" format="yyyy-MM-dd" type="date" autoPlacement showFormat :editable=false @on-change="handleDueDateChange"></h-date-picker>
              </h-form-item>
              <h-form-item prop="maxDueDt" class="h-form-long-label" :label="$t('m.i.billInfo.maxDueDate')"  v-if="pickBillFlag">
                <h-date-picker :value="pickBillForm.maxDueDt" format="yyyy-MM-dd" type="date" autoPlacement showFormat :editable=false @on-change="handleMaxDueDateChange"></h-date-picker>
              </h-form-item>
              <h-form-item  prop="acptName" :label="$t('m.i.billInfo.acptName')" v-if="pickBillFlag">
                <h-input v-model="pickBillForm.acptName" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="minBuyDt"  :label="$t('m.i.be.minBuyDt')">
                <h-date-picker :value="pickBillForm.minBuyDt" format="yyyy-MM-dd" type="date" autoPlacement showFormat :editable=false @on-change="handleBuyDateChange"></h-date-picker>
              </h-form-item>
              <h-form-item prop="maxBuyDt"  :label="$t('m.i.be.maxBuyDt')">
                <h-date-picker :value="pickBillForm.maxBuyDt" format="yyyy-MM-dd" type="date" autoPlacement showFormat :editable=false @on-change="handleMaxBuyDateChange"></h-date-picker>
              </h-form-item>
              <h-form-item prop="BuyRatePct" :label="$t('m.i.be.leftHandSeatBuyRate')" class="h-form-long-label">
                <h-row>
                  <h-col span="11">
                    <h-form-item prop="minBuyRatePct">
                      <h-typefield v-model="pickBillForm.minBuyRatePct" integerNum="2"
                                   suffixNum="4" type="money" placeholder="最多2位整数,4位小数"></h-typefield>
                    </h-form-item>
                  </h-col>
                  <h-col span="2" style="text-align: center">-</h-col>
                  <h-col span="11">
                    <h-form-item prop="maxBuyRatePct" >
                      <h-typefield v-model="pickBillForm.maxBuyRatePct" integerNum="2"
                                   suffixNum="4" type="money" placeholder="最多2位整数,4位小数"></h-typefield>
                    </h-form-item>
                  </h-col>
                </h-row>
              </h-form-item>

              <h-form-item prop="initBuyRate" :label="$t('m.i.be.initBuyRate')" class="h-form-long-label">
                <h-row>
                  <h-col span="11">
                    <h-form-item prop="minOrgnlBuyRatePct">
                      <h-typefield v-model="pickBillForm.minOrgnlBuyRatePct" integerNum="2"
                                   suffixNum="4" type="money" placeholder="最多2位整数,4位小数"></h-typefield>
                    </h-form-item>
                  </h-col>
                  <h-col span="2" style="text-align: center">-</h-col>
                  <h-col span="11">
                    <h-form-item prop="maxOrgnlBuyRatePct" >
                      <h-typefield v-model="pickBillForm.maxOrgnlBuyRatePct" integerNum="2"
                                   suffixNum="4" type="money" placeholder="最多2位整数,4位小数"></h-typefield>
                    </h-form-item>
                  </h-col>
                </h-row>
              </h-form-item>

              <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')" v-if="pickBillFlag">
                <h-input v-model="pickBillForm.billNo"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                           v-if="pickBillFlag&&pickBillForm.billClass==='ME02'">
                <h-select v-model="pickBillForm.billOrigin" placeholder="" showTitle>
                  <h-option v-for="item in curDictMap['billOriginList']" :value="item.key" :key="item.key">{{item.value }}
                  </h-option>
                </h-select>
              </h-form-item>
              <h-form-item  prop="transFromName" :label="$t('m.i.common.custName')">
                <h-input v-model="pickBillForm.transFromName"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.acptTopBankLevel')"   prop="acptTopBankLevels"  v-if="pickBillFlag">
                <h-select v-model="pickBillForm.acptTopBankLevels" multiple placeholder="请选择" showTitle>
                  <h-option v-for="item in curDictMap['bankLevelList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.distClass')"  prop="discTopBankLevels"  v-if="pickBillFlag">
                <h-select v-model="pickBillForm.discTopBankLevels" multiple placeholder="请选择" showTitle>
                  <h-option v-for="item in curDictMap['bankLevelList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.be.residualTerm')"  prop="billTerm"  v-if="pickBillFlag">
                <h-select v-model="pickBillForm.billTerm"  placeholder="请选择" showTitle>
                  <h-option v-for="item in curDictMap['TenorCodeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.acptBankType')"  prop="acptBankTypes"  v-if="pickBillFlag">
                <h-select v-model="pickBillForm.acptBankTypes"  placeholder="请选择" multiple showTitle>
                  <h-option v-for="item in curDictMap['bankTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.discBankType')"  prop="discBankTypes"  v-if="pickBillFlag">
                <h-select v-model="pickBillForm.discBankTypes"  placeholder="请选择" multiple showTitle>
                  <h-option v-for="item in curDictMap['bankTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <!--<h-form-item :label="$t('m.i.billInfo.discBankName')" prop="discBankName" v-if="pickBillFlag">
                  <h-input v-model="pickBillForm.discBankName" @on-click="showChooseBrchWin('discBankName')" icon="search" clearable @on-clear="clearVal('discBankName')" readonly placeholder=""></h-input>
              </h-form-item>-->

              <show-cpes-branch :label="$t('m.i.billInfo.discBankName')" v-if="pickBillFlag"
                                :bankNo.sync="pickBillForm.discBankNo"  :cpesBrchName.sync="pickBillForm.discBankName"
                                :isQueryByBankNo="true" :msgBoxWin="tempPickBillWin"
                                @cpesBranchChange="discBankNameChange($event)"
                                datagridUrl="/cpes/branch/queryBranchList" prop="discBankName"
                                queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>


              <h-form-item :label="$t('m.i.billInfo.creditMainBankType')"  prop="creditBranchClasses"  v-if="pickBillFlag">
                <h-select v-model="pickBillForm.creditBranchClasses"  placeholder="请选择" multiple showTitle>
                  <h-option v-for="item in curDictMap['CreditMajorList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.creditMainBankName')"  prop="creditBranchName" class="h-form-long-label"  v-if="pickBillFlag">
                <h-input v-model="pickBillForm.creditBranchName" placeholder=""></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.creditMainBrchCode')" class="h-form-long-label" prop="creditbrchCode"  v-if="pickBillFlag">
                <h-input v-model="pickBillForm.creditbrchCode" @on-click="showChooseBrchWin('creditbrchCode')" icon="search" clearable @on-clear="clearVal('creditMainBrchCode')" readonly placeholder=""></h-input>
              </h-form-item>
              <h-form-item  prop="rejectAcptName" :label="$t('m.i.billInfo.rejectAcptName')" v-if="pickBillFlag">
                <h-input v-model="pickBillForm.rejectAcptName" placeholder=""></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.billSource')"  prop="orgnlProdNos"  v-if="pickBillFlag">
                <h-select v-model="pickBillForm.orgnlProdNos"  placeholder="请选择" multiple showTitle>
                  <h-option v-for="item in curDictMap['billSourceList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.be.assetIndustry')"  prop="assetIndustry"  v-if="pickBillFlag && openI9flag">
                <h-select v-model="pickBillForm.assetIndustry"  placeholder="请选择" showTitle>
                  <h-option v-for="item in this.list" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="isMemory" :label="$t('m.i.ce.isMemory')" v-if="pickBillFlag">
                <h-radio-group v-model="isMemory">
                  <h-radio label="hasMemory" @on-click="hasMemoryButton">
                    <span>{{$t("m.i.ce.hasMemory")}}</span>
                  </h-radio>
                  <h-radio label="noMemory" @on-click="noMemoryButton">
                    <span>{{$t("m.i.ce.noMemory")}}</span>
                  </h-radio>

                </h-radio-group>
              </h-form-item>
              <h-form-item class="h-form-operate">
                <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                <h-button type="primary" @click="handlePickBillSearch()">{{$t('m.i.common.search')}}</h-button>
                <h-button type="ghost" @click="resetPickBillSearch()">{{$t('m.i.common.reset')}}</h-button>
              </h-form-item>
            </h-form>
          <h-datagrid :columns="pickColumns"
                      :url="pickUrl"
                      :auto-load="false"
                      :param-id="paramId"
                      rowSelect
                      :bindForm="pickBillForm"
                      :page-size="pageSizeParamValue"
                      :hasSelect="hasSelect"
                      ref="pickBillDatagrid" class="pl-5 pr-5">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="selectBatchBill()" v-if="pickBillFlag">{{$t('m.i.common.pickBatch')}}</h-button>
              <h-button type="primary" @on-click="selectInfoBill()" v-else>{{$t('m.i.common.pickBillDetail')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <div slot="footer">
          <h-button type="ghost" @click="pickBillClose()">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="pickBillStock()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </h-msg-box>
      <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo"
                      :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
      <brch-code-search :brchCodeWin="showBrchWin" optType="2" @brchCodeWinClose="closeBranch" @brchCodeChange="brchCodeChange"></brch-code-search>

      <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                             :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
    </div>
</template>

<script>
  import {formatNumber, getDictValueFromMap,getUploadImgType, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "pickBill",
    data(){
      return {
        openI9flag:false,
        pageSizeParamValue : "",
        isMemory: "hasMemory",
        billTypeList : [],
        billClassList:[],
        submitFlag : false,
        pickBillFlag:true,
        ifShowMore : false,
        paramId : "id",
        //明细挑票地址
        pickBillUrl:"/be/market/quote/innerMoveBill/saleQuoteApply/func_pagingQueryHldrBillInfo",
        //批次挑票地址
        pickBillBatchUrl:"/be/market/quote/innerMoveBill/saleQuoteApply/func_pagingQueryHldrBillCollect",
        pickUrl:"/be/market/quote/innerMoveBill/saleQuoteApply/func_pagingQueryHldrBillInfo",
        pickBillForm:{
          billType:'',
          billClass:'',
          batchNo:'',
          minBillMoney:'',
          maxBillMoney:'',
          acptName:'',
          rejectAcptName:'',
          orgnlProdNos:[],
          dueDate:'',
          minDueDt:'',
          maxDueDt:'',
          buyDate:'',
          minBuyDt:'',
          maxBuyDt:'',
          minBuyRatePct:'',
          maxBuyRatePct:'',
          minOrgnlBuyRatePct:'',
          maxOrgnlBuyRatePct:'',
          billNo:'',
          billOrigin:'',
          transFromName:'',
          batchId:null,
          isLock:'',
          acptTopBankLevels:[],
          discTopBankLevels:[],
          acptBankTypes:[],
          discBankTypes:[],
          discBankName:'',
          discBrchCode:'',
          discBankNo:'',
          billTerm:'',
          creditBrchCode:'',
          creditBranchName:'',
          creditBranchClasses:[],
          isTotalColl : '',
          custBrchCode:this.custBrchCode,
          assetIndustry : ''
        },
        dueDate:[],
        buyDate:[],
        pickColumns:[],
        pickBillColumns:[
          {
            type: 'selection',
            width: 50,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('m.i.common.batchNo'),
            sortable: true,
            key: 'batchNo',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.curDictMap.dictListMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: 'billNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
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
            title: this.$t('m.i.billInfo.billType'),
            sortable: true,
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =getDictValueFromMap(this.curDictMap.dictListMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: 'billClass',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let dictValue =getDictValueFromMap(this.curDictMap.dictListMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt?this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.be.buyDt'),
            key: 'buyDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.buyDt?this.$moment(params.row.buyDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.be.leftHandSeatBuyRate'),
            key: 'buyRatePct',
            hiddenCol: false,
            sortable:true,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.buyRatePct, 4))
            }
          },
          {
            title: this.$t('m.i.be.initBuyRate'),
            key: 'orgnlBuyRatePct',
            hiddenCol: false,
            sortable:true,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.orgnlBuyRatePct, 4))
            }
          },
          {
            title: this.$t('m.i.common.custName'),
            key: 'transFromName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: 'acptBankName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: 'cfmAppBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: 'acptGuarntrBankName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: 'discBankName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: 'discGuarntrBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: 'guarntrTrustBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,
            sortable: true,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditMainBankType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.curDictMap.dictListMap, 'CreditMajor', params.row.creditMainBankType);
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
              let dictValue =getDictValueFromMap(this.curDictMap.dictListMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        pickBillBatchColumns:[
          {
            type: 'selection',
            width: 50,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: 'batchNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custName'),
            key: 'transFromName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: 'prodName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let dictValue =getDictValueFromMap(this.curDictMap.dictListMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: 'billClass',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let dictValue =getDictValueFromMap(this.curDictMap.dictListMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.buyDt'),
            key: 'buyDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.buyDt?this.$moment(params.row.buyDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.be.leftHandSeatBuyRate'),
            key: 'buyRatePct',
            hiddenCol: false,
            sortable:true,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.buyRatePct, 4))
            }
          },
          {
            title: this.$t('m.i.be.initBuyRate'),
            key: 'orgnlBuyRatePct',
            hiddenCol: false,
            sortable:true,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.orgnlBuyRatePct, 4))
            }
          },
          {
            title: this.$t('m.i.be.totalBillMoney'),
            key: 'totalBillMoney',
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalBillMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.totalCountByUnit'),
            key: 'totalCount',
            hiddenCol: false,
            sortable: true,
            align: "center",
          },
        ],
        pickBillSelectList:[],
        list:[],
        pickBillSelectRowInx:[],
        hasSelect:false,
        curDictMap:new Map(),
        showBillInfoWin:false,
        billId:"",
        billNo:"",
        billRangeStart:"",
        billRangeEnd:"",
        showBrchWin:false,
        tempShowExcelTemplateWin:false,
        param:"",
        rows: "",
        chooseType:"",
      };
    },
    components:{
      BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    props:{
      batchId:Number,
      billType:String,
      dueSettleDt:String,
      billClass:String,
      busiType:String,
      isLock:String,
      custBrchCode:String,
      isTotalColl : String,
      isTemStorage: String,
      childrenBtnAuth:Object || {},
      dictMap:{
        type:Object
      },
      pickBillWin:{
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    computed: {

      tempPickBillWin: {
        get() {
          return this.pickBillWin;
        },
        set(){

        }
      },
    },
    watch:{
      pickBillWin(val){
        if(val){
          this.pickColumns = this.deepClone(this.pickBillColumns);
          this.$nextTick(() => {
            this.pickBillInit();
            if(this.batchId){
              this.memoryInit();
              this.pickBillSelectList = [];
            }
            this.dealBtnAuth(this.childrenBtnAuth);
          });
        }
      }
    },
    methods:{
      memoryInit(){
        this.getDictListByGroups("AssetIndustry").then(res => {
          let assetIndustryList = res.get("AssetIndustry");
          assetIndustryList=assetIndustryList.filter(item => item.key != "0");
          let showFlag="";
          getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
            let value = res.value
            if(value=='0'){//否
              showFlag="0";
            }else if(value=="1"){//是
              showFlag="1";
            }
            if( (this.busiType=="BT01" && showFlag=="0") && this.isTotalColl!="1"){
              this.list=assetIndustryList.filter(item => item.key != "1");
            } else {
              this.list=assetIndustryList;
            }
          })
        });


        let url="/be/market/quote/memory/quoteMemory/func_findQuoteMemoryByBrchCode";
        post({code:this.custBrchCode}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              let obj = res.data.retData;
              if(obj){
                this.pickBillForm.assetIndustry = obj.assetIndustry;
                this.pickBillForm.minBillMoney = obj.minBillMoney;
                this.pickBillForm.maxBillMoney = obj.maxBillMoney;
                this.pickBillForm.acptName = obj.acptName;
                this.pickBillForm.minBuyRatePct= obj.minBuyRatePct;
                this.pickBillForm.maxBuyRatePct= obj.maxBuyRatePct;
                this.pickBillForm.minOrgnlBuyRatePct  = obj.minOrgnlBuyRatePct;
                this.pickBillForm.maxOrgnlBuyRatePct = obj.maxOrgnlBuyRatePct;
                this.pickBillForm.transFromName  = obj.transFromName;
                this.pickBillForm.billTerm  = obj.billTerm;
                if (obj.acptTopBankLevels != null){
                  this.pickBillForm.acptTopBankLevels = obj.acptTopBankLevels.split(",");
                }
                if (obj.discTopBankLevels != null){
                  this.pickBillForm.discTopBankLevels = obj.discTopBankLevels.split(",");
                }
                if(obj.acptBankTypes!=null){
                  this.pickBillForm.acptBankTypes = obj.acptBankTypes.split(",");
                }
                if(obj.orgnlProdNos!=null){
                  this.pickBillForm.orgnlProdNos = obj.orgnlProdNos.split(",");
                }
                if(obj.discBankTypes!=null){
                  this.pickBillForm.discBankTypes = obj.discBankTypes.split(",");
                }
                if(obj.creditBranchClasses!=null){
                  this.pickBillForm.creditBranchClasses = obj.creditBranchClasses.split(",");
                }
                this.pickBillForm.creditBranchName  = obj.creditBranchName;
                this.pickBillForm.rejectAcptName  = obj.rejectAcptName;
              }
              this.$nextTick(()=> {
                this.hasSelect=false;
                this.$refs.pickBillDatagrid.createShowCol(this.pickColumns);
                this.$refs.pickBillDatagrid.dataChange(1);
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },
      //通过按钮权限控制挑票高级查询条件默认是否展示
      dealBtnAuth(childrenBtnAuth) {
        if (childrenBtnAuth != null && childrenBtnAuth != undefined) {
          let str = JSON.stringify(childrenBtnAuth);
          let index = str.lastIndexOf("ifShowMore");
          if (index > 0) {
            str = str.substring(str.lastIndexOf("{"), str.indexOf("}") + 1);
            let obj = JSON.parse(str);
            if (obj.isShow) {
              this.ifShowMore = true;
            }
          }
        }
      },
      clearVal(value){
        if(value==="creditbrchCode")
        {
          this.pickBillForm.creditbrchCode = '';
        }
        else if (value=="discBankName"){
          this.pickBillForm.discBrchCode='';
          this.pickBillForm.discBankNo='';
          this.pickBillForm.discBankName='';
        }
      },
      closeBranch(){
        this.showBrchWin=false
      },
      showChooseBrchWin(value){
        this.chooseType=value;
        this.showBrchWin=true
      },
      discBankNameChange(info){
        if(info.length>0){
          this.pickBillForm.discBrchCode=info[0].brchCode;
        }else{
          this.pickBillForm.discBrchCode="";
        }
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        if (this.chooseType==='creditbrchCode') {
          this.pickBillForm.creditbrchCode = info.brchCode;
        }
        else if (this.chooseType==='discBankName'){
          this.pickBillForm.discBrchCode=info.brchCode;
          this.pickBillForm.discBankNo=info.transBrchBankNo;
          this.pickBillForm.discBankName = info.brchFullNameZh;
        }
        this.showBrchWin = false;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      pickBillClose(){
        this.pickBillFlag=true;
        this.hasSelect=true;
        this.pickUrl=this.pickBillUrl;
        this.pickColumns = this.deepClone(this.pickBillColumns);
        this.pickBillSelectList = [];
        this.resetPickBillSearch();
        this.$emit("pickBillWinClose", "");
      },
      pickBillInit(){
        this.pickBillForm.billType=this.billType;
        this.pickBillForm.billClass=this.billClass;
        this.pickBillForm.busiType=this.busiType;
        this.pickBillForm.batchId = this.batchId;
        this.pickBillForm.dueSettleDt = this.dueSettleDt;
        this.pickBillForm.isLock=this.isLock;
        this.pickBillForm.isTotalColl = this.isTotalColl;
        // this.pickColumns=this.pickBillColumns;
        this.curDictMap=this.dictMap;
        this.pickBillForm.custBrchCode=this.custBrchCode;
        this.isMemory = "hasMemory"
      },
      // 行选中
      pickBillSelectClick(arr, selectInx) {
          this.pickBillSelectList = arr;
        this.pickBillSelectRowInx = selectInx;
      },
      //切换为批次挑票
      selectBatchBill(){
        this.paramId = "batchNo";
        this.pickBillFlag=false;
        this.hasSelect=true;
        this.pickBillSelectList = [];
        this.$refs.pickBillForm.resetFields();
        this.pickUrl=this.pickBillBatchUrl;
        this.pickColumns = this.deepClone(this.pickBillBatchColumns);
        this.$nextTick(()=>{
          this.$refs.pickBillDatagrid.createShowCol(this.pickColumns);
          this.$refs.pickBillDatagrid.dataChange(1);
        })
      },
      //切换为明细挑票
      selectInfoBill(){
        this.paramId = "id";
        this.pickBillFlag=true;
        this.hasSelect=true;
        this.pickBillSelectList = [];
        this.$refs.pickBillForm.resetFields();
        this.isMemory = "hasMemory"
        this.pickUrl=this.pickBillUrl;
        this.pickColumns = this.deepClone(this.pickBillColumns);
        this.memoryInit();
      },
      //未提交
      noMemoryButton() {
        this.isMemory = "noMemory";
      },
      //已提交
      hasMemoryButton() {
        this.isMemory = "hasMemory";
      },
      //挑票页面查询
      handlePickBillSearch() {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.dataChange(1);
        this.pickBillSelectList = [];
        if(this.pickBillFlag){
        if(this.isMemory=="hasMemory"){
          let url="/be/market/quote/memory/quoteMemory/func_addQuoteMemory";
          post(this.pickBillForm, url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
            }
          });
        }else {
          let url="/be/market/quote/memory/quoteMemory/func_deleteQuoteMemoryByBrchCode";
          post({code:this.custBrchCode}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
            }
          });
        }
        }
      },
      handleDueDateChange(arr){
        if(arr != null && arr.length > 0){
          this.pickBillForm.minDueDt=arr.replace(/-/g, "");
        }else {
          this.pickBillForm.minDueDt= "";
        }
      },
      handleMaxDueDateChange(arr){
        if(arr != null && arr.length > 0){
          this.pickBillForm.maxDueDt=arr.replace(/-/g, "");
        }else {
          this.pickBillForm.maxDueDt= "";
        }
      },
      handleBuyDateChange(arr){
        if(arr != null && arr.length > 0){
          this.pickBillForm.minBuyDt=arr.replace(/-/g, "");
        }else {
          this.pickBillForm.minBuyDt= "";
        }
      },
      handleMaxBuyDateChange(arr){
        if(arr != null && arr.length > 0){
          this.pickBillForm.maxBuyDt=arr.replace(/-/g, "");
        }else {
          this.pickBillForm.maxBuyDt= "";
        }
      },
      //挑票页面重置查询条件
      resetPickBillSearch() {
        this.dueDate = [];
        this.buyDate = [];
        this.pickBillForm.discBankName='';
        this.pickBillForm.discBrchCode='';
        this.pickBillForm.discBankNo='';
        this.pickBillForm.creditBranchName='';
        this.$refs.pickBillForm.resetFields();
      },
      //挑票新增方法
      pickBillStock(){
        this.submitFlag=true;
        // let list = this.pickBillSelectList;
        let pickBillFlag=this.pickBillFlag;
        let list = this.$refs.pickBillDatagrid.selects;
        if(pickBillFlag){
          if (list.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            this.submitFlag=false;
            return;
          }
        }else{
          if (list.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.submitFlag=false;
            return;
          }
        }

        console.log("list",list);
        let flag=1;
        let billList=[];
        if(window.sessionStorage.getItem("isOpenI9")=="1"){
          for(let i=0;i<list.length;i++){
            if(list[i].assetIndustry=="1"){
              billList.push(list[i].billNo)
              flag=0;
            }
          }
        }
        console.log(flag)
        if(flag==0 && this.isTotalColl=="1"){
          console.log(flag)
          this.pickBillClose();
          this.$hMsgBox.confirm({
            title: "确认",
            content: "选中票据【"+billList.toString()+"】资产类型为持有-按摊余成本计量，请确定是否提交？",
            onOk: () => {
              this.addBill(list);
              this.submitFlag=false;
              console.log("121212")
            },
            onCancel: () =>{
              console.log(11111)
              this.submitFlag=false;
              return;
            }
          });
        }else{
          this.submitFlag=false;
          this.addBill(list);
        }
      },

      addBill(list){
        let pickBillFlag=this.pickBillFlag;
        if(pickBillFlag){
          //按明细挑票
          let ids = "";
          for (let i = 0; i < list.length; i++) {
            ids += list[i].id;
            if (i < list.length - 1) {
              ids += ",";
            }
          }
          let batchId = this.batchId;
          let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_pickBillStock";
          post({ batchId: batchId ,ids:ids,isLock:this.isLock,isTemStorage:this.isTemStorage}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.pickBillSelectList = [];
                this.pickBillClose();
                this.submitFlag=false;
              } else {
                this.submitFlag=false;
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.submitFlag=false;
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
            }
          });
        }else{
          // 按批次挑票
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            this.submitFlag=false;
            return
          }
          let batchNo=list[0].batchNo;
          let buyDt=list[0].buyDt;
          let transFromName=list[0].transFromName;
          let prodNo=list[0].prodNo;
          let billClass=list[0].billClass;
          let billType=list[0].billType;
          let buyRatePct=list[0].buyRatePct;
          let batchId = this.batchId;
          let data={ batchId: batchId ,batchNo:batchNo,buyDt:buyDt,transFromName:transFromName,
            prodNo:prodNo,billClass:billClass,billType:billType,buyRatePct:buyRatePct,isLock:this.isLock,isTemStorage:this.isTemStorage};
          let url="/be/market/quote/innerMoveBill/saleQuoteApply/func_batchPickBillStock";
          post(data, url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.pickBillSelectList = [];
                this.pickBillClose();
                this.submitFlag=false;
              } else {
                this.submitFlag=false;
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.submitFlag=false;
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
            }
          });
        }
      },
      tempShowExcelTemplateWinOpen() {
        this.param = 'saleHldrBillExportInfo';
        if (this.$refs.pickBillDatagrid.selectIds.length != 0) {
          this.rows = this.$refs.pickBillDatagrid.selectIds.length;
        }else {
          this.rows = this.$refs.pickBillDatagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        let url;
        url= window.LOCAL_CONFIG.API_HOME + "be/market/quote/innerMoveBill/saleQuoteApply/func_exportSaleHldrBillExcel";
        let pageSize = this.$refs.pickBillDatagrid.total;
        if(this.$refs.pickBillDatagrid.total == 0){
          pageSize = 1;
        }
        if(exportType === "1"){
          let params = null;
          if (this.$refs.pickBillDatagrid.selectIds.length != 0) {
            params = { ids: this.$refs.pickBillDatagrid.selectIds, pageSize: this.$refs.pickBillDatagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
          }else {
            params=this.pickBillForm;
            params.field=field;
            params.exportType=exportType;
            params.excelName=this.param;
            params.pageSize=pageSize;
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          if (this.$refs.pickBillDatagrid.selectIds.length != 0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.pickBillDatagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.pickBillDatagrid.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.pickBillForm) {
              if (this.pickBillForm.hasOwnProperty(obj) && this.pickBillForm[obj] && this.pickBillForm[obj] !== "") {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.pickBillForm[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.pickBillDatagrid.total > 0) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'pageSize';
              input1.value = pageSize;
              form.appendChild(input1)
            }
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
    },

    created() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
    }
  };
</script>

<style scoped>

</style>
