<template>
  <!--电票赎回申请-->
  <div class="layout">
    <div v-if="discBackBatchMain" key="1">
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.ce.isCommit')" prop="isCommit">
                    <h-radio-group v-model="formItem.isCommit">
                      <h-radio label="noCommit" @on-click="noCommitButton">
                        <span>未提交</span>
                      </h-radio>
                      <h-radio label="hasCommit" @on-click="hasCommitButton">
                        <span>已提交</span>
                      </h-radio>
                    </h-radio-group>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.custName')" prop="custName" >
                    <h-input v-model="formItem.custName" icon="android-search"
                             @on-click="queryCustMessage()" clearable @on-clear="clearVal('custName')" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo" >
                    <h-input v-model="formItem.custAcctNo" icon="android-search"
                             @on-click="queryCustAcctNo()" clearable @on-clear="clearVal('custAcctNo')" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.orgnlBatchNo')" prop="orgnlBatchNo">
                    <h-input v-model="formItem.orgnlBatchNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlightRow
                :bindForm="formItem"
                url="/ce/disc/elec/discBack/discBackBatchMain/func_pageQueryDiscBackBatchList"
                :on-current-change="handleSelectClick"
                :on-current-change-cancel="handleSelectClickCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm()">{{$t("m.i.ce.billManage")}}</h-button>
                </div>
              </h-datagrid>
              <!-- 查询客户信息弹窗 -->
              <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
              <!-- 查询客户账号信息弹窗 -->
              <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo" :isAllBankAcct=true
                                 @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
            </div>
          </div>
        </h-col>
      </h-row>
    </div>
    <div v-if="discBackBillMain" key="2">
      <!--查询表单-->
      <div class="h-form-search-box">
        <h-panel class="clearfix">
          <h-form :model="billFormItem" :label-width="90" ref="billFormItem" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
              <h-select v-model="billFormItem.billOrigin" placeholder="">
                <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
              <h-input v-model="billFormItem.billNo" placeholder=""></h-input>
            </h-form-item>
            <bill-range :formItem="billFormItem" :rangeProps="['billRangeStart','billRangeEnd']"></bill-range>
            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="billManagerHandleSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="billManagerResetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
    </div>
    <e-disc-back-info-detail :isQuery="isQuery" :is-show="discBackBillMain"
                             :batchUrl="'/ce/disc/elec/discBack/discBackBatchMain/func_queryDiscBackBatch'"
                            :batchId="this.batchId" :funcNo="formItem.funcNo" ref="eDiscBackInfoDetail" @getRedeemRate="getRedeemRate"></e-disc-back-info-detail>
    <!-- 数据展示表格 -->
    <div v-if="discBackBillMain" key="3">
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :auto-load="false"
        :bindForm="billFormItem"
        url="/ce/disc/elec/discBack/discBackBatchMain/func_pageQueryDiscBackBillList"
        :onSelectChange="discBackHandleSelectClick"
        ref="discBackDatagrid">
        <div slot="toolbar">
          <h-button type="primary" v-if="formItem.isCommit==='noCommit'" @click="applyRecord()">{{$t("m.i.ce.applyAdd")}}</h-button>
          <h-button type="primary" v-if="formItem.isCommit==='noCommit'" @click="interestCalculation()">{{$t("m.i.be.calcInterest")}}</h-button>
          <h-button type="primary" v-if="formItem.isCommit==='noCommit'" @click="interestAdjustment()">{{$t("m.i.ce.adjustInterest")}}</h-button>
          <h-button type="primary" v-if="formItem.isCommit==='noCommit'" @click="submitBatch()">{{$t("m.i.common.submit")}}</h-button>
          <h-button type="primary" v-if="formItem.isCommit==='hasCommit'" @click="cancelApplyBatch()">{{$t("m.i.common.cancel")}}</h-button>
          <h-button type="ghost" @click="returnBack()">{{$t("m.i.common.goBack")}}</h-button>
        </div>
      </h-datagrid>

      <!-- 申请补录弹出框 -->
      <h-msg-box v-model="applyRecordWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
        <p slot="header">
          <span>申请补录</span>
        </p>
        <h-panel>
          <h-form :model="applyRecordForm" :label-width="115" ref="applyRecordForm" cols="1" class="h-form-search">
            <h-form-item :label="$t('m.i.ce.actulRedeemDueDt')" prop="realRedeemDt" required>
              <h-date-picker type="date" v-model="applyRecordForm.realRedeemDt" placeholder="请选择"></h-date-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.ce.clearMark')" prop="clearMark" required>
              <h-select  v-model="applyRecordForm.clearMark" disabled>
                <h-option v-for="item in clearMarkList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.ce.redeemRate')" prop="redeemRate" required :validRules="redeemRateRule">
              <h-input  v-model="applyRecordForm.redeemRate" :maxlength=60 :style="{width:'160px'}"></h-input>
              <span>(%)</span>
            </h-form-item>
            <h-form-item :label="$t('m.i.ce.rateType')" prop="redeemRateType" required>
              <h-select  v-model="applyRecordForm.redeemRateType" disabled>
                <h-option v-for="item in rateTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
          </h-form>
        </h-panel>
        <div slot="footer">
          <h-button type="ghost" @click="applyRecordWin=!applyRecordWin">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="applyRecordSave()">{{$t("m.i.common.save")}}</h-button>
        </div>
      </h-msg-box>

      <!-- 利息调整弹出框 -->
      <h-msg-box v-model="interestAdjustmentWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
        <p slot="header">
          <span>利息调整</span>
        </p>
        <h-panel>
          <h-form :model="interestAdjustmentForm" :label-width="115" ref="interestAdjustmentForm" cols="1" class="h-form-search">
            <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" >
              <h-input v-model="interestAdjustmentForm.billNo" placeholder="" disabled></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" >
              <h-input v-model="interestAdjustmentForm.billMoney" placeholder="" disabled></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billRange')" prop="billRange">
              <h-input v-model="interestAdjustmentForm.billRange" placeholder="" disabled></h-input>
            </h-form-item>

            <h-form-item :label="$t('m.i.ce.beforeAdjustInter')" prop="interest" required>
              <h-input v-model="interestAdjustmentForm.interest" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.ce.adjustType')" prop="adjustType" required>
              <h-select  v-model="interestAdjustmentForm.adjustType" placeholder="">
                <h-option value="1">调增</h-option>
                <h-option value="2">调减</h-option>
                <!--<h-option v-for="item in rateTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>-->
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.ce.adjustMoney')" prop="adjustMoney" required :validRules="adjustMoneyRule">
              <h-typefield type="money" v-model="interestAdjustmentForm.adjustMoney" placeholder=""
                           @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')" :bigTips="false"></h-typefield>
            </h-form-item>
          </h-form>
        </h-panel>
        <div slot="footer">
          <h-button type="ghost" @click="interestAdjustmentWin=!interestAdjustmentWin">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="interestAdjustmentSave()">{{$t("m.i.common.save")}}</h-button>
        </div>
      </h-msg-box>

      <!--票面信息-->
      <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"  :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"  :billId="this.billId"></bill-info-main>
    </div>
  </div>
</template>

<script>
  import { post, on, off ,getDictListByGroups ,accMul,accDiv,formatNumber,getDictValueFromMap,formatBillRange} from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "discBackBatchMain",
    components: {
      EDiscBackInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/eDiscBackInfoDetail" */`@/views/bizViews/ce/disc/common/eDiscBackInfoDetail`)
    },
    data() {
      let columns = [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
        },
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          key:"xuhao",
          align: "center"
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.batchNoMain(params.row.id,params.row.clearMark,params.row.redeemRate,params.row.redeemOpenDt,params.row.redeemDueDt,params.row.rate)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
           title: this.$t("m.i.billInfo.discDt"),
          key: "discDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.discDt == null || params.row.discDt === ""){
              return "";
            }
            let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", discDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "ratePct",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.busiType"),
          key: "prodName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.redeemOpenDt"),
          key: "redeemOpenDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.redeemOpenDt == null || params.row.redeemOpenDt === ""){
              return "";
            }
            let redeemOpenDt = this.$moment(params.row.redeemOpenDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", redeemOpenDt);
          }
        },
        {
          title: this.$t("m.i.ce.redeemDueDt"),
          key: "redeemDueDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.redeemDueDt == null || params.row.redeemDueDt === ""){
              return "";
            }
            let redeemDueDt = this.$moment(params.row.redeemDueDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", redeemDueDt);
          }
        },
        {
          title: this.$t("m.i.ce.actulRedeemDueDt"),
          key: "realRedeemDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.realRedeemDt == null || params.row.realRedeemDt === ""){
              return "";
            }
            let realRedeemDt = this.$moment(params.row.realRedeemDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", realRedeemDt);
          }
        },
        {
          title: this.$t("m.i.ce.redeemRate"),
          key: "redeemRatePct",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.clearMark"),
          key: "clearMark",
          hiddenCol: false,
          render:(h,params) => {
            return h("span",getDictValueFromMap(this.dictMap,"SettlementMarkCode",params.row.clearMark));
          }
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: "sumCount",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
          key: "sumMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let sumMoney = formatNumber(params.row.sumMoney, 2, ',');
            return h("span", {
              domProps: {
                title: sumMoney
              }
            }, sumMoney);
          }
        },
        {
          title: this.$t("m.i.ce.totalPayInterest"),
          key: "totalInterest",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalInterest = formatNumber(params.row.totalInterest, 2, ',');
            return h("span", {
              domProps: {
                title: totalInterest
              }
            }, totalInterest);
          }
        },
        {
          title: this.$t("m.i.ce.totalSaleReceiveAmt"),
          key: "totalSaleReceiveAmt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalSaleReceiveAmt = formatNumber(params.row.totalSaleReceiveAmt, 2, ',');
            return h("span", {
              domProps: {
                title: totalSaleReceiveAmt
              }
            }, totalSaleReceiveAmt);
          }
        },
        {
          title: this.$t("m.i.ce.orgnlBatchNo"),
          key: "orgnlBatchNo",
          hiddenCol: false
        },
        {
            title: this.$t("m.i.common.corpScale"),
          key: "corpScale",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"CorpScale",params.row.corpScale);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
           title: this.$t("m.i.common.isGreenCorp"),
          key: "isGreenCorp",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isGreenCorp);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
      ];
      let billColumns = [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
        },
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
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
          sortable: true,
          hiddenCol: false,
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
            let billMoney = formatNumber(params.row.billMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          hiddenCol: false
        },
        {
           title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: "remitDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.remitDt == null || params.row.remitDt === ""){
              return "";
            }
            let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", remitDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", dueDt);
          }
        },
        {
          title: this.$t("m.i.ce.isOwnBankAcpt"),
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
          title: this.$t("m.i.ce.interestDueDt"),
          key: "galeDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.galeDt == null || params.row.galeDt === ""){
              return "";
            }
            let galeDt = this.$moment(params.row.galeDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", galeDt);
          }
        },
        {
          title: this.$t("m.i.ce.interestCalDays"),
          key: "interestCalDays",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.delayDays"),
          key: "delayDays",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.orgnlInterest"),
          key: "orgnlInterest",
          hiddenCol: false,
          render: (h, params) => {
            let orgnlInterest = formatNumber(params.row.orgnlInterest, 2, ',');
            return h("span", {
              domProps: {
                title: orgnlInterest
              }
            }, orgnlInterest);
          }
        },
        {
          title: this.$t("m.i.ce.payInterest"),
          key: "interest",
          hiddenCol: false,
          render: (h, params) => {
            let interest = formatNumber(params.row.interest, 2, ',');
            return h("span", {
              domProps: {
                title: interest
              }
            }, interest);
          }
        },
        {
          title: this.$t("m.i.ce.saleReceiveAmt"),
          key: "saleReceiveAmt",
          hiddenCol: false,
          render: (h, params) => {
            let saleReceiveAmt = formatNumber(params.row.saleReceiveAmt, 2, ',');
            return h("span", {
              domProps: {
                title: saleReceiveAmt
              }
            }, saleReceiveAmt);
          }
        },
      ];
      return {
        isEdit: false,
        formItem : {
          orgnlBatchNo:"",
          custName: "",
          custAcctNo: "",
          custNo:"",
          isCommit:"noCommit",
          billClass:"ME02",
          funcNo:"PICE020905",
        },
        columns : columns,
        billColumns : billColumns,
        billFormItem : {
          billNo:"",
          batchId:"",
          funcNo:"",
          billRangeStart:"",
          billRangeEnd:"",
          billOrigin:""

        },
        applyRecordForm : {
          id:"",
          realRedeemDt:"",
          redeemRate:"",
          redeemRateType:"360",
          clearMark:"",
        },
        interestAdjustmentForm : {
          id:"",
          billNo:"",
          billMoney:"",
          interest:"",
          adjustType:"",
          adjustMoney:"",
          billRange:"",
          billOrigin:""
        },
        ifShowMore : false,
        rateTypeList : [],
        clearMarkList : [],
        billOriginList : [],
        dictMap : new Map(),
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        interestAdjustmentWin : false,
        applyRecordWin : false,
        hasCommitDisabled : false,
        noCommitDisabled : false,
        discBackBatchMain : true,
        discBackBillMain : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        isQuery : false,
        batchId : "",
        clearMark : "",
        redeemRate : "",
        redeemOpenDt : "",
        redeemDueDt : "",
        rate : "",
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        billRangeStart:"",
        billRangeEnd:"",
        hasSelect : false,
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billColumns),
        adjustMoneyRule: [{test: validAdjustMoney, trigger: "blur"}],
        redeemRateRule:[{test: validDiscRate, trigger: "blur"}],
      };
      function validAdjustMoney(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if (value > 0) {
            callback();
          } else {
            callback(new Error("调整金额为大于0的不超过9位的数字，且小数位不超过两位"));
          }
        } else {
          callback(new Error("调整金额为大于0的不超过9位的数字，且小数位不超过两位"));
        }
      }
       function validDiscRate(rule, val, callback) {
        let re = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("利率为0~100之间的数，小数位不超过4位"));
        }
      }
    },
    mounted() {
      getDictListByGroups("Yon,SettlementMarkCode,SettleType,DraftTypeCode,CorpScale,RateType,BillOrigin").then(res => {

        this.rateTypeList = res.get("RateType");
        this.billOriginList = res.get("BillOrigin");
        let dictList = [];
        let clearMarkList = res.get("SettlementMarkCode");
        let settleTypeList =res.get("SettleType");
        for (let i = 0; i < clearMarkList.length+settleTypeList.length; i++) {
          if(i< clearMarkList.length){
            dictList[i]=clearMarkList[i];
          }
          if(clearMarkList.length<=i){
            let obj = settleTypeList[i-clearMarkList.length];
            obj.dictGroupCode="SettlementMarkCode";
            res.get("map").get(obj.dictGroupCode).set(obj.key,obj.value);
            dictList[i]= obj;
          }
        }
        res.set("SettlementMarkCode",dictList);
        this.clearMarkList = res.get("SettlementMarkCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "custAcctNo"){
          this.formItem.custAcctNo = "";
        }
      },
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.custNo = '';
        this.formItem.custName = '';
        this.formItem.custAcctNo = '';
        this.formItem.orgnlBatchNo = '';
        this.billFormItem.billOrigin = '';
        this.billFormItem.billNo = '';
        this.billFormItem.billRangeStart = '';
        this.billFormItem.billRangeEnd = '';
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      handleSelectClickCancel() {
        this.currentSelectList = [];
      },
      noCommitButton(){
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
        this.formItem.funcNo = "PICE020905";
        this.handleSearch();
      },
      hasCommitButton(){
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
        this.formItem.funcNo = "PICE020906";
        this.handleSearch();
      },
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if(this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.$nextTick(() => {
          this.hasSelect = false;
          this.currentBillSelectList = [];
          // this.$refs.discBackDatagrid.selectIds = [];
          this.$refs.discBackDatagrid.dataChange(1);
        });
      },
      //票据管理界面重置
      billManagerResetSearch(){
        this.$refs.billFormItem.resetFields();
      },
      //票据管理界面行选中
      discBackHandleSelectClick(arr, selectInx) {
        this.currentBillSelectList = arr;
        this.currentBillSelectRowInx = selectInx;
      },
      //票据管理
      handleForm() {
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.discBackBatchMain = false;
        this.billFormItem.funcNo = this.formItem.funcNo;
        this.billFormItem.batchId = this.currentSelectList.id;
        this.batchId = this.currentSelectList.id;
        this.clearMark = this.currentSelectList.clearMark;
        this.redeemRate = this.currentSelectList.redeemRate;
        this.redeemOpenDt = this.currentSelectList.redeemOpenDt;
        this.redeemDueDt = this.currentSelectList.redeemDueDt;
        this.rate = this.currentSelectList.rate;
        this.isQuery = true;
        this.discBackBillMain = true;
        this.billManagerHandleSearch();
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.discBackDatagrid.selfAdaption();
          this.$refs.discBackDatagrid.createShowCol(this.billTemp);
        });
      },
      //申请补录按钮
      applyRecord(){
        // if (this.currentBillSelectList.length === 0) {
        //   this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        //   return;
        // }
        // if (this.currentBillSelectList.length > 1) {
        //   this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
        //   return;
        // }
        this.applyRecordWin = true;
        this.$nextTick(() => {
          this.$refs.applyRecordForm.resetFields();
          this.applyRecordForm.id = this.batchId;
          this.applyRecordForm.realRedeemDt = window.sessionStorage.getItem("workDate");
          this.applyRecordForm.clearMark = this.clearMark;
          this.applyRecordForm.redeemRate = accMul(this.redeemRate,100) ;
        });
      },
      //申请补录界面保存按钮
      applyRecordSave(){
        this.$refs["applyRecordForm"].validate(valid => {
          if (valid) {
            let nowData = window.sessionStorage.getItem("workDate");
            this.applyRecordForm.realRedeemDt = this.$moment(this.applyRecordForm.realRedeemDt).format("YYYYMMDD");
            //校验实际赎回日期是否不早于当前营业日期
            if(this.applyRecordForm.realRedeemDt < nowData){
              this.$msgTip.info(this,{info:"实际赎回日不得早于当前营业日期"});
              return
            }
            //校验实际赎回日期是否大于等于赎回开放日
            if(this.applyRecordForm.realRedeemDt < this.redeemOpenDt){
              this.$msgTip.info(this,{info:"实际赎回日应大于等于赎回开放日"});
              return
            }
            //校验实际赎回日期是否小于等于赎回到期日
            if(this.applyRecordForm.realRedeemDt > this.redeemDueDt){
              this.$msgTip.info(this,{info:"实际赎回日应小于等于赎回到期日"});
              return
            }
            //校验赎回利率与原贴现利率是否一致
            if(this.applyRecordForm.redeemRate /100 === this.rate){
              this.applyRecordSubmitBatch();
            }else{
              this.$hMsgBox.confirm({
                title: this.$t("m.i.common.confirm"),
                content: "赎回利率与原贴现利率不一致，确定保存吗？",
                onOk: () => {
                  this.applyRecordSubmitBatch();
                }
              });
            }
          }
        });
      },
      applyRecordSubmitBatch(){
        // let param = {id: this.batchId, operType: "1", funcNo: ""};
        this.applyRecordForm.redeemRate = accDiv(this.applyRecordForm.redeemRate,100);
        post(this.applyRecordForm , "/ce/disc/elec/discBack/discBackBatchMain/func_updateDiscBackBatch").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.applyRecordWin = false;
              this.$msgTip.success(this,{info:msg});
              this.$refs.eDiscBackInfoDetail.getBatchInfo();
              this.$refs.discBackDatagrid.dataChange(this.$refs.discBackDatagrid.pageInfo.pageNo);
              this.currentBillSelectList = [];
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.applyRecordForm.redeemRate = accMul(this.applyRecordForm.redeemRate,100);
              this.$refs.discBackDatagrid.dataChange(this.$refs.discBackDatagrid.pageInfo.pageNo);
            }
          } else {
            this.applyRecordForm.redeemRate = accMul(this.applyRecordForm.redeemRate,100);
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //利息计算
      interestCalculation() {
        this.$loadingbox.open({
          title: "利息计算中，请稍后..."
        });
        post({ id: this.batchId }, "/ce/disc/elec/discBack/discBackBatchMain/func_calculateInterest").then(res => {
          this.$loadingbox.close();
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.eDiscBackInfoDetail.getBatchInfo();
              this.billManagerHandleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.interestAdjustmentForm.adjustMoney)) && isFinite(this.interestAdjustmentForm.adjustMoney)) {
            this.interestAdjustmentForm.adjustMoney = this.interestAdjustmentForm.adjustMoney == null ? "0.00" : formatNumber(this.interestAdjustmentForm.adjustMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.interestAdjustmentForm.adjustMoney = this.interestAdjustmentForm.adjustMoney.toString().replace(/,/g, "");
        }
      },
      //利息调整按钮
      interestAdjustment(){
        if (this.currentBillSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentBillSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.interestAdjustmentWin = true;
        this.$nextTick(() => {
          this.$refs.interestAdjustmentForm.resetFields();
          this.interestAdjustmentForm.billNo = this.currentBillSelectList[0].billNo;
          this.interestAdjustmentForm.billMoney = this.currentBillSelectList[0].billMoney;
          this.interestAdjustmentForm.interest = this.currentBillSelectList[0].interest;
          this.interestAdjustmentForm.billRange=this.currentBillSelectList[0].billRangeStart.toString().padLeft(12, '0') + "," +this.currentBillSelectList[0].billRangeEnd.toString().padLeft(12, '0');
          this.i
        });
      },
      //利息调整界面保存按钮
      interestAdjustmentSave(){
        this.$refs["interestAdjustmentForm"].validate(valid => {
          if (valid) {
            this.interestAdjustmentForm.adjustMoney = this.interestAdjustmentForm.adjustMoney.toString().replace(/,/g, "");
            if(this.interestAdjustmentForm.adjustType === "1"){
              if(this.interestAdjustmentForm.adjustMoney === "0.00"){
                this.$msgTip.info(this, { info: "调整金额应大于0" });
                return;
              }
              let money = this.interestAdjustmentForm.billMoney - this.interestAdjustmentForm.interest;
              if(this.interestAdjustmentForm.adjustMoney > money){
                this.$msgTip.info(this, { info: "调整金额应小于等于票据金额-调整前利息" });
                return;
              }
            }else if(this.interestAdjustmentForm.adjustType === "2"){
              if(this.interestAdjustmentForm.adjustMoney === "0.00"){
                this.$msgTip.info(this, { info: "调整金额应大于0" });
                return;
              }
              if(this.interestAdjustmentForm.adjustMoney > this.interestAdjustmentForm.interest){
                this.$msgTip.info(this, { info: "调整金额应小于等于调整前利息" });
                return;
              }
            }
            this.interestAdjustmentForm.id = this.currentBillSelectList[0].id;
            post(this.interestAdjustmentForm , "/ce/disc/elec/discBack/discBackBatchMain/func_interestAdjust").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this,{info:msg});
                  this.interestAdjustmentWin = false;
                  this.$refs.eDiscBackInfoDetail.getBatchInfo();
                  this.$refs.discBackDatagrid.dataChange(this.$refs.discBackDatagrid.pageInfo.pageNo);
                  this.currentBillSelectList = [];
                } else {
                  this.$msgTip.error(this,{info:res.data.retMsg});
                  this.$refs.discBackDatagrid.dataChange(this.$refs.discBackDatagrid.pageInfo.pageNo);
                }
                this.interestAdjustmentForm.adjustType ='';
                this.interestAdjustmentForm.adjustMoney ='';
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //提交按钮
      submitBatch(){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交申请吗？",
          onOk: () => {
            this.handleSubmitBatch();
          }
        });
      },
      handleSubmitBatch() {
        post({ batchId: this.batchId }, "/ce/disc/elec/discBack/discBackBatchMain/func_commitDiscBackBills").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              this.returnBack();
              this.currentBillSelectList = [];
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.discBackDatagrid.dataChange(this.$refs.discBackDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //撤销按钮
      cancelApplyBatch(){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },
      handleCancelApplyBatch() {
        if(this.$refs.discBackDatagrid.tData.length === 0){
          this.$msgTip.info(this,{info:"该批次下无数据"});
          return;
        }
        post({ batchId:this.batchId }, "/ce/disc/elec/discBack/discBackBatchMain/func_cancelFlow").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              this.returnBack();
              this.currentBillSelectList = [];
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.discBackDatagrid.dataChange(this.$refs.discBackDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //返回
      returnBack() {
        this.currentSelectList = [];
        this.currentBillSelectList = [];
        this.batchId = "";
        this.isQuery = false;
        this.resetSearch();
        this.discBackBillMain = false;
        this.discBackBatchMain = true;
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
        });
      },
      //批次编号超链接
      batchNoMain(id,clearMark,redeemRate,redeemOpenDt,redeemDueDt,rate) {
        this.batchId = id;
        this.billFormItem.batchId = this.batchId;
        this.billFormItem.funcNo = this.formItem.funcNo;
        this.clearMark = clearMark;
        this.redeemRate = redeemRate;
        this.redeemOpenDt = redeemOpenDt;
        this.redeemDueDt = redeemDueDt;
        this.rate = rate;
        this.isQuery = true;
        this.discBackBatchMain = false;
        this.discBackBillMain = true;
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.discBackDatagrid.selfAdaption();
          this.$refs.discBackDatagrid.createShowCol(this.billTemp);
        });
        this.billManagerHandleSearch();
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      //获取批次最新的赎回利率
      getRedeemRate(redeemRate){
        console.log(redeemRate)
        this.redeemRate = redeemRate
      },
    }
  };
</script>

<style scoped>

</style>
