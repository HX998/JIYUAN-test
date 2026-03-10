<template>
  <div class="h-tree-search">
    <div class="h-modal-header-wrapper">
      <h-msg-box v-model="tempShowPDiscInvoiceWin" :maximize="true" :mask-closable="false"
                 @on-close="handleClose" width="1000" class="h-form-search-layer"
                 top="10" @on-maximize="onMaximize" :footerHide="true">
        <p slot="header">
          <span>{{title}}</span>
        </p>
        <!--弹出框内容-->
        <div>
          <!--输入表单-->
          <h-form :model="addForm" :label-width="115" ref="addForm" cols="3" class="h-form-search">
            <div>
              <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" required v-if="this.licenseFlag">
                <h-input v-model="addForm['ownedBrchName']" icon="android-search" disabled clearable :title="addForm['ownedBrchName']" ></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.busiType')" prop="prodNo" required>
                <h-select  v-model="addForm['prodNo']"   disabled>
                  <h-option v-for="item in busiTypeList" :value="item.prodNo" :key="item.prodNo" >{{ item.prodName }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" required>
                <h-input v-model="addForm['custNo']" :placeholder="''" disabled ></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="isRequired">
                <h-input v-model="addForm['custName']" placeholder="" :icon="false ? 'android-search' : ''" :clearable="false"  disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo" :required="isRequired">
                <h-input v-model="addForm.custAcctNo" :placeholder="''" disabled :maxlength=85 ></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.corpScale')" prop="corpScale" :required="isRequired">
                <h-select v-model="addForm.corpScale" disabled placeholder="">
                  <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.isGreenCorp')" prop="isGreenCorp" :required="isRequired">
                <h-select v-model="addForm.isGreenCorp" disabled placeholder="">
                  <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.recvAcctNo')" prop="aoAcctNo" :required="isRequired">
                <h-input v-model="addForm.aoAcctNo" disabled ></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.agentCustName')" prop="agentCustName" v-show="agencyShow">
                <h-input v-model="addForm.agentCustName" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.agentCustAcctNo')" prop="agentCustAcctNo" v-show="agencyShow">
                <h-input v-model="addForm.agentCustAcctNo" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.agentCustBankNo')" prop="agentCustBankNo" v-show="agencyShow">
                <h-input v-model="addForm.agentCustBankNo" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.accountBrchNo')" prop="accountBrchNo" v-show="false">
                <h-input  v-model="addForm.accountBrchNo" disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.accountBrchName')" prop="accountBrchName" :required="isRequired" >
                <h-input v-model="addForm.accountBrchName" placeholder="" :title="addForm.accountBrchName"
                         disabled :icon="'android-search'"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo" v-show="false" >
                <h-input  v-model="addForm.custMgrNo" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName" :required="isCustMgrRequired">
                <h-input v-model="addForm.custMgrName" placeholder="" disabled :icon="'android-search'"  clearable></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.transCtrctNo')" prop="transCtrctNo">
                <h-input  v-model="addForm.transCtrctNo" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.protectType')" prop="protectType" :required="isRequired"
                           v-if="addForm.prodNo==='01060622' || addForm.prodNo==='01061022' || addForm.prodNo==='01060322' || addForm.prodNo==='01060722'">
                <h-select v-model="addForm['protectType']" :placeholder="''" disabled>
                  <h-option v-for="item in protectTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.guarntrNo')" prop="bailAcctNo" :required="isRequired" v-if="addForm.prodNo === '01060312'">
                <h-input v-model="formItem.bailAcctNo" :placeholder="''" disabled icon="android-search"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="true">
                <h-select v-model="addForm['billType']" placeholder="" disabled >
                  <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="this.$t('m.i.billInfo.discDt')" prop="discDt" :required="isRequired">
                <h-date-picker v-model="addForm.discDt" :options="discOptions" disabled
                               format="yyyy-MM-dd" placeholder="" showFormat :editable=false ></h-date-picker>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.isBillRate')" prop="isBillRate" :required="isAllowBillRate" v-if="isAllowBillRate">
                <h-select v-model="addForm.isBillRate" :placeholder="''" disabled>
                  <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.discInterestRate')" prop="rate" :required="addForm.isBillRate==='0'" :validRules="rateRule" v-if="addForm.isBillRate==='0'">
                <h-input  v-model="addForm.rate" :maxlength=60 :style="{width:'160px'}" disabled></h-input>
                <span v-if="addForm.rateType === '360'">(%)</span>
                <span v-if="addForm.rateType === '30'">(‰)</span>
                <span v-if="addForm.rateType === '1'">(‱)</span>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.rateType')" prop="rateType" :required="addForm.isBillRate==='0'" v-if="addForm.isBillRate==='0'">
                <h-select  v-model="addForm.rateType" disabled>
                  <h-option v-for="item in rateTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.interestMethod')" prop="payType" :required="isRequired" >
                <h-select  v-model="addForm.payType" :maxlength=60  disabled>
                  <h-option v-for="item in payTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.buyerPayInterName')" prop="payCustName" :required="addForm.payType === '1' ||addForm.payType === '3' " v-if="addForm.payType === '1' ||addForm.payType === '3'">
                <h-input  v-model="addForm.payCustName" :maxlength=60 disabled :icon="'android-search'" ></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.buyPayPcet')" prop="buyPayPcet" :required="addForm.payType === '3'" v-if="addForm.payType === '3'" :validRules="buyPayPcetRule">
                <h-input  v-model="addForm.buyPayPcet" :maxlength=60  :style="{width:'160px'}" disabled></h-input><span>(%)</span>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.buyerPayInterAcctNo')" prop="payAcctNo" :required="addForm.payType === '1' ||addForm.payType === '3'" v-if="addForm.payType === '1' ||addForm.payType === '3'">
                <h-input  v-model="addForm.payAcctNo" :maxlength=60 disabled :icon="'android-search'" ></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.thirdCustName')" prop="thirdCustName" :required="addForm.payType === '4'" v-if="addForm.payType === '4'">
                <h-input  v-model="addForm.thirdCustName" :maxlength=60 disabled :icon="'android-search'" ></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.thirdAcctNo')" prop="thirdAcctNo" :required="addForm.payType === '4'" v-if="addForm.payType === '4'">
                <h-input  v-model="addForm.thirdAcctNo" :maxlength=60 disabled :icon="'android-search'" ></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.queryType')" prop="queryType" :required="isQueryRecovery" v-show="isQueryRecovery">
                <h-select v-model="addForm.queryType" :maxlength=60 disabled>
                  <h-option v-for="item in queryTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.isBackQuery')" prop="isBackQuery" :required="addForm.queryType !== '4' && addForm.queryType !== '2' && addForm.queryType !== '' && addForm.queryType != null && isQueryRecovery === true"
                           v-show="addForm.queryType !== '4' && addForm.queryType !== '2' && addForm.queryType !== '' && addForm.queryType != null && isQueryRecovery === true">
                <h-select v-model="addForm.isBackQuery" :maxlength=60 disabled>
                  <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="invoiceAfterFlag" :label="$t('m.i.ce.invoiceAfterFlag')" required>
                <h-select v-model="addForm.invoiceAfterFlag" placeholder="" showTitle disabled>
                  <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="forceInvoiceFlag" :label="$t('m.i.ce.forceInvoiceFlag')" required v-if="addForm.invoiceAfterFlag === '0'">
                <h-select v-model="addForm.forceInvoiceFlag" placeholder="" showTitle disabled>
                  <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.discUse')" prop="discUse">
                <h-input  v-model="addForm.discUse" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.advancedRate')" prop="advancedRate" :validRules="rateRule">
                <h-input  v-model="addForm.advancedRate" :maxlength=60 :style="{width:'160px'}" disabled></h-input><span>(‱)</span>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.industryCategory')" prop="industryCategory" v-show="false">
                <h-select  v-model="addForm.industryCategory" :placeholder="''" :maxlength=60 disabled>
                  <h-option v-for="item in industryList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.industryCategory')" prop="industryCategoryName" :required="false" v-show=true>
                <h-input v-model="addForm.industryCategoryName"  icon="android-search"
                         disabled ></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.signAddr')" prop="signAddr">
                <h-input  v-model="addForm.signAddr" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.arbitrateMode')" prop="arbitrateMode" >
                <h-select  v-model="addForm.arbitrateMode" :placeholder="''" :maxlength=60 disabled>
                  <h-option v-for="item in arbitrateModeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.arbitrationCommissionName')" prop="arbitrationCommissionName" v-if="addForm.arbitrateMode==='2'" >
                <h-input  v-model="addForm.arbitrationCommissionName" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.arbitrationCommissionAddr')" prop="arbitrationCommissionAddr"  v-if="addForm.arbitrateMode==='2'" >
                <h-input  v-model="addForm.arbitrationCommissionAddr" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.partyAAddr')" prop="partyAAddr" >
                <h-input  v-model="addForm.partyAAddr" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.partyAPostCode')" prop="partyAPostCode" :validRules="postCodeRule">
                <h-input  v-model="addForm.partyAPostCode"  disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.partyAName')" prop="partyAName" >
                <h-input  v-model="addForm.partyAName" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.partyAPhone')" prop="partyAPhone" :validRules="phoneNoRule">
                <h-input  v-model="addForm.partyAPhone"  disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.partyBAddr')" prop="partyBAddr" >
                <h-input  v-model="addForm.partyBAddr" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.partyBPostCode')" prop="partyBPostCode"  :validRules="postCodeRule">
                <h-input  v-model="addForm.partyBPostCode" disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.partyBName')" prop="partyBName" >
                <h-input  v-model="addForm.partyBName" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.partyBPhone')" prop="partyBPhone" :validRules="phoneNoRule">
                <h-input  v-model="addForm.partyBPhone"  disabled></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.totalPages')" prop="totalPages" :validRules="intRule">
                <h-input  v-model="addForm.totalPages" :maxlength=60 disabled></h-input>
              </h-form-item>
              <h-form-item prop="invoiceFinishFlag" :label="$t('m.i.ce.invoiceFinishFlag')" required>
                <h-select v-model="addForm.invoiceFinishFlag" placeholder="" showTitle>
                  <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
            </div>
          </h-form>
          <div style="text-align: right">
            <submiting-btn :submitFlag="false"></submiting-btn>
            <save-btn :submitFlag="false" :isCommit="'noCommit'" @formSave="formSave"></save-btn>
          </div>
          <h-form :model="addSumForm" :label-width="115" ref="addSumForm" cols="3" class="h-form-search">
            <div>
              <sum-count :formItem="addSumForm"></sum-count>
              <sum-money :formItem="addSumForm"></sum-money>
              <sum-buyer-interest :formItem="addSumForm"></sum-buyer-interest>
              <sum-saler-interest :formItem="addSumForm"></sum-saler-interest>
              <sum-interest :formItem="addSumForm"></sum-interest>
              <sum-real-pay-amt :formItem="addSumForm"></sum-real-pay-amt>
            </div>
          </h-form>
          <div>
            <h-datagrid
              :columns="columns"
              highlight-row
              getDataFunc
              :auto-load="false"
              url="/ce/disc/paper/invoice/invoiceReplenishMain/func_pageQueryCeDiscBillList"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <relation-invoice-btn :isCommit="'noCommit'" @relationInvoice="relationInvoice" :disabled="invoiceReplenishFlag"></relation-invoice-btn>
                <invoice-manager-btn :isCommit="'noCommit'" @invoiceManager="invoiceManager" :disabled="invoiceReplenishFlag"></invoice-manager-btn>
              </div>
            </h-datagrid>
          </div>
        </div>
      </h-msg-box>
    </div>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
    <invoice-pick-bill :billPickInvoiceWin="billPickInvoiceWin" :billPickInvoiceParams="billPickInvoiceParams"
                       @billPickInvoiceWinClose="billPickInvoiceWinClose" @billPickInvoiceChange="billPickInvoiceChange"></invoice-pick-bill>
    <relation-invoice-bill-info :relationInvoiceBillWin="relationInvoiceBillWin" :relationInvoiceBillParams="relationInvoiceBillParams"
                                @relationInvoiceBillWinClose="relationInvoiceBillWinClose" ></relation-invoice-bill-info>

  </div>
</template>

<script>
  import { accDiv, accMul, cmycurd, formatNumber, getDictListByGroups, numToUpper, off, on, post , getDictValueFromMap,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "invoiceReplenish",
    components: {
      "invoice-pick-bill":()=>import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/billPickInvoice`),
      "relation-invoice-bill-info":()=>import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/relationInvoiceBillInfo`),
    },
    data() {
      return {
        addForm : {
          id:"",
          legalNo:"",
          batchNo:"",
          billClass:"ME01",
          billType:"",
          custNo:"",
          custAcctNo:"",
          custName:"",
          discDt:window.sessionStorage.getItem("workDate"),
          rate:"",
          rateType:"360",
          payType:"2",
          payCustName:"",
          payBankNo:"",
          payCustNo:"",
          payAcctNo:"",
          buyPayPcet:"",
          prodNo:"",
          custMgrNo:this.$store.getters.userInfo.userNo,
          custMgrName:this.$store.getters.userInfo.userName,
          custMgrBrchNo:this.$store.getters.userInfo.brchNo,
          ownedBrchNo:"",
          ownedBrchName:"",
          transBrchNo:"",
          accountBrchNo:this.$store.getters.userInfo.brchNo,
          saveBrchNo:"",
          busiBrchNo:"",
          operBrchNo:"",
          redeemRate:"",
          redeemRateType:"",
          redeemOpenDt:"",
          redeemDueDt:"",
          aoAcctNo:"",
          bailAcctNo:"",
          aoAcctBankNo:"",
          clearMark:"",
          transCtrctNo:"",
          thirdPayPcet:"",
          thirdCustName:"",
          thirdBankNo:"",
          thirdCustNo:"",
          thirdAcctNo:"",
          agentCustName:"",
          agentCustAcctNo:"",
          agentCustBankNo:"",
          isBackQuery:"0",
          isDelayInstore:"",
          isInstore:"",
          creditLimitType:"",
          discRgstStatus:"",
          discRemark:"",
          queryType:"1",
          protectType:"",
          corpScale:"",
          isGreenCorp:"",
          discUse:"周转",
          advancedRate:"5",
          industryCategory:"",
          signAddr:"",
          arbitrateMode:"",
          arbitrationCommissionName:"",
          arbitrationCommissionAddr:"",
          partyAAddr:"",
          partyAPostCode:"",
          partyAName:"",
          partyAPhone:"",
          partyBAddr:"",
          partyBPostCode:"",
          partyBName:"",
          partyBPhone:"",
          totalNum:"",
          totalPages:"",
          dataSource:"",
          transplantFlag:"",
          createTime:"",
          updateTime:"",
          reserve1:"",
          reserve2:"",
          reserve3:"",
          accountBrchName:this.$store.getters.userInfo.brchName,
          isBillRate:"0",
          industryCategoryName:"",
          invoiceAfterFlag: "1",
          forceInvoiceFlag: "",
          invoiceFinishFlag: "",
        },
        addSumForm : {
          sumCount:"",
          sumMoney:"",
          sumBuyerInterest:"",
          sumSalerInterest:"",
          sumInterest:"",
          sumRealPayAmt:"",
        },
        formItem : {
          billClass:"ME01",
          batchId:"",
        },
        columns : [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.discInterestRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.outAcctNo"),
            key: "putOutNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drweBankName"),
            key: "drweBankName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
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
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
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
            title: this.$t("m.i.ce.isSameCity"),
            key: "isSameCity",
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isSameCity);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.assetIndustry"),
            key: "busiClassify",
            hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.busiClassify);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.interestDueDt"),
            key: "galeDt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.galeDt == null || params.row.galeDt === ""){
                return "";
              }
              let date = this.$moment(params.row.galeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.interestCalDays"),
            key: "interestCalDays",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.ce.delayDays"),
            key: "delayDays",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.ce.buyerInterest"),
            key: "buyerInterest",
            hiddenCol: false,
            render: (h, params) => {
              let buyerInterest = formatNumber(params.row.buyerInterest, 2, ',');
              return h("span", {
                domProps: {
                  title: buyerInterest
                }
              }, buyerInterest);
            }
          },
          {
            title: this.$t("m.i.ce.salerInterest"),
            key: "salerInterest",
            hiddenCol: false,
            render: (h, params) => {
              let salerInterest = formatNumber(params.row.salerInterest, 2, ',');
              return h("span", {
                domProps: {
                  title: salerInterest
                }
              }, salerInterest);
            }
          },
          {
            title: this.$t("m.i.ce.thirdInterest"),
            key: "thirdInterest",
            hiddenCol: false,
            render: (h, params) => {
              let thirdInterest = formatNumber(params.row.thirdInterest, 2, ',');
              return h("span", {
                domProps: {
                  title: thirdInterest
                }
              }, thirdInterest);
            }
          },
          {
            title: this.$t("m.i.ce.realPayAmt"),
            key: "realPayAmt",
            hiddenCol: false,
            render: (h, params) => {
              let realPayAmt = formatNumber(params.row.realPayAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: realPayAmt
                }
              }, realPayAmt);
            }
          },
          {
            title: this.$t("m.i.ce.bankPayAmt"),
            key: "payAmt",
            hiddenCol: false,
            render: (h, params) => {
              let payAmt = formatNumber(params.row.payAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: payAmt
                }
              }, payAmt);
            }
          },
          {
            title: this.$t("m.i.ce.buyerCustName"),
            key: "buyerCustName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.queryAnswerErrorReason"),
            key: "queryAnswerErrorReason",
            hiddenCol: false,
          },
        ],
        discOptions : {
          disabledDate (date) {
            return date && date.valueOf() < _that.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
          }
        },
        billId : "",
        currentSelectRow : [],
        protectTypeList : [],
        rateTypeList : [],
        payTypeList : [],
        queryTypeList : [],
        arbitrateModeList : [],
        billTypeList : [],
        corpScaleList : [],
        industryList : [],
        isList : [],
        busiTypeList : [],
        busiClassifyList : [],
        dictMap : new Map(),
        param: null,
        rows: null,
        isRequired:true,
        agencyShow : false,
        hasSelect : false,
        invoiceReplenishFlag: false,
        isCustMgrRequired : false,  //通过参数控制客户经理是否必输
        isQueryRecovery : false,  //纸票贴现是否查询查复参数控制查询方式是否显示
        isAllowBillRate : false, //是否允许明细利率参数
        showBillInfoWin : false,
        billPickInvoiceWin:false,
        relationInvoiceBillWin:false,
        billPickInvoiceParams: {
          listId: "",
          custNo: "",
          billNo: "",
          invoiceFlag: "",
          billMoney: "",
          batchNo:"",
          billId:"",
          dictMap: this.dictMap
        },
        relationInvoiceBillParams: {
          listId: "",
          cancelRelationUrl: "",
          dictMap: this.dictMap
        },
        rateRule : [{test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/, trigger:'blur', message: '利率为0~100之间的数，小数位不超过4位'}],
        phoneNoRule : [{ test: /^[0-9]{1,13}$/, trigger: "blur", message: "电话由不超过13位数字组成" }],
        intRule:[{ test: /^(0|\+?[1-9][0-9]*)$/, trigger: "blur", message: "只能输入正整数" }],
        postCodeRule : [{test: validPostCode, trigger:'blur'}],
        delayDaysRule : [{ test: /^[0-9]{1,2}$/, trigger: "blur", message: "顺延天数由不超过2位数字组成" }],
        buyPayPcetRule : [{test: validBuyPayPcetRule, trigger:'blur'}],
      };

      function validBuyPayPcetRule(rule,val,callback){
        let re = /^((([0-9]{1,2})(\.\d{1,3})?))$/;
        if(val == null || val == ''){
          callback()
        }
        if(re.test(val)){
          let num = Number(val);
          if(num === 0){
            callback(new Error("买方付息比例应大于0"))
          }else {
            callback()
          }
        }else{
          callback(new Error("买方付息比例大于0且小于100,小数位不超过3位"))
        }
      }
      function validPostCode(rule,val,callback){
        let re = /^[0-9]{6}$/;
        if(val == null || val == ''){
          callback()
        }
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，邮编由6位数字组成"))
        }
      }
    },

    mounted() {
      getDictListByGroups("ProtectType,RateType,PayType,QueryType,ArbitrateMode,DraftTypeCode,CorpScale,Yon,Industry,AssetIndustry").then(res => {
        this.busiClassifyList = res.get("AssetIndustry");
        this.protectTypeList = res.get("ProtectType");
        this.rateTypeList = res.get("RateType");
        this.payTypeList = res.get("PayType");
        this.queryTypeList = res.get("QueryType");
        this.arbitrateModeList = res.get("ArbitrateMode");
        this.billTypeList = res.get("DraftTypeCode");
        this.corpScaleList = res.get("CorpScale");
        this.industryList = res.get("Industry");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
        this.getProductList();
        this.getIsCustMgrRequired();
        this.getIsQueryRecovery();
        this.getIsAllowBillRate();
      });
      on(window, "resize", this.handleResize);
    },

    computed: {
      tempShowPDiscInvoiceWin: {
        get() {
          return this.showPDiscInvoiceWin;
        },
        set() {
        }
      }
    },

    props: {
      licenseFlag:"",
      discBatchId: "",
      title: {
        type: String,
        default: "发票后补"
      },
      showPDiscInvoiceWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },

    watch: {
      showPDiscInvoiceWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.queryObjById();
            this.handleSearch();
          });
        }
      },
    },


    methods: {
      //根据批次ID查询票据信息
      queryObjById() {
        let id = this.discBatchId;
        post({ id: id}, "/ce/disc/paper/apply/discApplyBatchMain/func_queryDiscBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addForm.id = obj.id;
              this.addForm.ownedBrchNo = obj.busiBrchNo;
              this.addForm.ownedBrchName = obj.busiBrchName;
              this.addForm.legalNo = obj.legalNo;
              this.addForm.batchNo = obj.batchNo;
              this.addForm.billClass = obj.billClass;
              this.addForm.billType = obj.billType;
              this.addForm.custNo = obj.custNo;
              this.addForm.custAcctNo = obj.custAcctNo;
              this.addForm.custName = obj.custName;
              if (obj.discDt != null && obj.discDt !== "") {
                this.addForm.discDt = this.$moment(obj.discDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.addForm.payType = obj.payType;
              this.addForm.payCustName = obj.payCustName;
              this.addForm.payBankNo = obj.payBankNo;
              this.addForm.payCustNo = obj.payCustNo;
              this.addForm.payAcctNo = obj.payAcctNo;
              this.addForm.buyPayPcet = obj.buyPayPcet;
              this.addForm.prodNo = obj.prodNo;
              this.addForm.custMgrNo = obj.custMgrNo;
              this.addForm.custMgrName = obj.custMgrName;
              this.addForm.custMgrBrchNo = obj.custMgrBrchNo;
              this.addForm.transBrchNo = obj.transBrchNo;
              this.addForm.accountBrchNo = obj.accountBrchNo;
              this.addForm.saveBrchNo = obj.saveBrchNo;
              this.addForm.busiBrchNo = obj.busiBrchNo;
              this.addForm.operBrchNo = obj.operBrchNo;
              this.addForm.redeemRate = obj.redeemRate;
              this.addForm.redeemRateType = obj.redeemRateType;
              this.addForm.redeemOpenDt = obj.redeemOpenDt;
              this.addForm.redeemDueDt = obj.redeemDueDt;
              this.addForm.aoAcctNo = obj.aoAcctNo;
              this.addForm.bailAcctNo = obj.bailAcctNo;
              this.addForm.aoAcctBankNo = obj.aoAcctBankNo;
              this.addForm.isBillRate = obj.isBillRate;
              if (obj.isBillRate === "0") {
                this.addForm.rateType = obj.rateType;
                if (obj.rate.toString() === "0") {
                  this.addForm.rate = "0";
                } else {
                  if (obj.rateType === "360") {
                    this.addForm.rate = accMul(obj.rate, 100);
                  }
                  if (obj.rateType === "30") {
                    this.addForm.rate = accMul(obj.rate, 1000);
                  }
                  if (obj.rateType === "1") {
                    this.addForm.rate = accMul(obj.rate, 10000);
                  }
                }
              }
              this.addForm.clearMark = obj.clearMark;
              this.addForm.accountBrchName = obj.accountBrchName;
              this.addForm.transCtrctNo = obj.transCtrctNo;
              this.addForm.thirdPayPcet = obj.thirdPayPcet;
              this.addForm.thirdCustName = obj.thirdCustName;
              this.addForm.thirdBankNo = obj.thirdBankNo;
              this.addForm.thirdCustNo = obj.thirdCustNo;
              this.addForm.thirdAcctNo = obj.thirdAcctNo;
              this.addForm.agentCustName = obj.agentCustName;
              this.addForm.agentCustAcctNo = obj.agentCustAcctNo;
              this.addForm.agentCustBankNo = obj.agentCustBankNo;
              this.addForm.isBackQuery = obj.isBackQuery;
              this.addForm.isDelayInstore = obj.isDelayInstore;
              this.addForm.isInstore = obj.isInstore;
              this.addForm.creditLimitType = obj.creditLimitType;
              this.addForm.discRgstStatus = obj.discRgstStatus;
              this.addForm.discRemark = obj.discRemark;
              this.addForm.queryType = obj.queryType;
              this.addForm.protectType = obj.protectType;
              this.addForm.corpScale = obj.corpScale;
              this.addForm.isGreenCorp = obj.isGreenCorp;
              this.addForm.discUse = obj.discUse;
              this.addForm.advancedRate = obj.advancedRate;
              this.addForm.industryCategory = obj.industryCategory;
              this.getDictValue();
              this.addForm.signAddr = obj.signAddr;
              this.addForm.arbitrateMode = obj.arbitrateMode;
              this.addForm.arbitrationCommissionName = obj.arbitrationCommissionName;
              this.addForm.arbitrationCommissionAddr = obj.arbitrationCommissionAddr;
              this.addForm.partyAAddr = obj.partyAAddr;
              this.addForm.partyAPostCode = obj.partyAPostCode;
              this.addForm.partyAName = obj.partyAName;
              this.addForm.partyAPhone = obj.partyAPhone;
              this.addForm.partyBAddr = obj.partyBAddr;
              this.addForm.partyBPostCode = obj.partyBPostCode;
              this.addForm.partyBName = obj.partyBName;
              this.addForm.partyBPhone = obj.partyBPhone;
              this.addForm.totalNum = obj.totalNum;
              this.addForm.totalPages = obj.totalPages;
              this.addForm.dataSource = obj.dataSource;
              this.addForm.invoiceAfterFlag = obj.invoiceAfterFlag;
              this.addForm.forceInvoiceFlag = obj.forceInvoiceFlag;
              this.addForm.invoiceFinishFlag = obj.invoiceFinishFlag;
              if (this.addForm.invoiceFinishFlag === "1") {
                this.invoiceReplenishFlag = true;
              } else {
                this.invoiceReplenishFlag = false;
              }
              this.addSumForm.sumCount = obj.sumCount;
              this.addSumForm.sumMoney = formatNumber(obj.sumMoney, 2, ",");
              this.addSumForm.sumBuyerInterest = formatNumber(obj.sumBuyerInterest, 2, ",");
              this.addSumForm.sumSalerInterest = formatNumber(obj.sumSalerInterest, 2, ",");
              this.addSumForm.sumInterest = formatNumber(obj.sumInterest, 2, ",");
              this.addSumForm.sumRealPayAmt = formatNumber(obj.sumRealPayAmt, 2, ",");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //查询
      handleSearch() {
        this.formItem.batchId = this.discBatchId;
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },

      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },

      //表格自适应
      handleResize() {
        this.$nextTick(() => {
          this.$refs.datagrid.selfAdaption();
        });
      },

      handleClose() {
        this.clearForm();
        this.currentSelectRow = [];
        this.$refs.addForm.resetFields();
        this.$emit("pDiscInvoiceWinClose", "");
      },

      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },

      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },

      //清除数据
      clearForm() {
        this.addForm.id = "";
        this.addForm.prodNo = "";
        this.addForm.custNo = "";
        this.addForm.custName = "";
        this.addForm.custAcctNo = "";
        this.addForm.protectType = "";
        this.addForm.corpScale = "";
        this.addForm.isGreenCorp = "";
        this.addForm.billType = "";
        this.addForm.aoAcctNo = "";
        this.addForm.bailAcctNo = "";
        this.addForm.discDt = "";
        this.addForm.transCtrctNo = "";
        this.addForm.isBillRate = "";
        this.addForm.rate = "";
        this.addForm.accountBrchNo = "";
        this.addForm.accountBrchName = "";
        this.addForm.custMgrNo = "";
        this.addForm.custMgrName = "";
        this.addForm.agentCustName = "";
        this.addForm.agentCustAcctNo = "";
        this.addForm.agentCustBankNo = "";
        this.addForm.payType = "";
        this.addForm.payCustName = "";
        this.addForm.buyPayPcet = "";
        this.addForm.payAcctNo = "";
        this.addForm.thirdCustName = "";
        this.addForm.thirdAcctNo = "";
        this.addForm.queryType = "";
        this.addForm.isBackQuery = "";
        this.addForm.discUse = "";
        this.addForm.advancedRate = "";
        this.addForm.industryCategory = "";
        this.addForm.industryCategoryName = "";
        this.addForm.signAddr = "";
        this.addForm.arbitrateMode = "";
        this.addForm.arbitrationCommissionName = "";
        this.addForm.arbitrationCommissionAddr = "";
        this.addForm.partyAAddr = "";
        this.addForm.partyAPostCode = "";
        this.addForm.partyAName = "";
        this.addForm.partyAPhone = "";
        this.addForm.partyBAddr = "";
        this.addForm.partyBPostCode = "";
        this.addForm.partyBName = "";
        this.addForm.partyBPhone = "";
        this.addForm.totalPages = "";
        this.addForm.batchNo = "";
        this.addSumForm.sumCount = "";
        this.addSumForm.sumMoney = "";
        this.addSumForm.sumBuyerInterest = "";
        this.addSumForm.sumSalerInterest = "";
        this.addSumForm.sumInterest = "";
        this.addSumForm.sumRealPayAmt = "";
      },

      getDictValue(){
        post({dictGroupCode : "IndustryCategoryDetail", key :this.addForm.industryCategory }, "/sm/config/dictionary/getDictValue").then(res => {
          if (res) {
            let dictValue = res.data.retMsg;
            if(dictValue == null || dictValue == "" || dictValue == undefined){
              dictValue = this.addForm.industryCategory;
            }
            this.addForm.industryCategoryName = dictValue;
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

      //查询产品业务类型
      getProductList() {
        post({ billClass: "1" }, "/ce/disc/paper/apply/discApplyBatchMain/func_queryDiscProdRelation").then(res => {
          if (res && res.data.retCode === "000000") {
            this.busiTypeList = res.data.retData;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        });
      },

      //获取系统参数（控制客户经理是否必输）
      getIsCustMgrRequired() {
        post({}, "/ce/disc/paper/apply/discApplyBatchMain/func_getCustMgrRequiredForConfigCenter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isCustMgrRequired = res.data.retData.isCustMgrRequired;
              this.isCustMgrRequired = isCustMgrRequired === "1";
            } else {
              this.isCustMgrRequired = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //获取系统参数（纸票贴现是否查询查复）ce.disc.is_query_recovery
      getIsQueryRecovery() {
        let paramKey = "ce.disc.is_query_recovery";
        post({ paramKey: paramKey }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isQueryRecovery = res.data.retData;
              this.isQueryRecovery = isQueryRecovery === "1";
            } else {
              this.isQueryRecovery = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //获取系统参数（是否允许明细利率）ce.disc.is_allow_bill_rate
      getIsAllowBillRate() {
        let paramKey = "ce.disc.is_allow_bill_rate";
        post({ paramKey: paramKey }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isAllowBillRate = res.data.retData;
              this.isAllowBillRate = isAllowBillRate === "1";
            } else {
              this.isAllowBillRate = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //票面信息
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },

      //票面信息关闭
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      //保存
      formSave() {
        this.$refs["addForm"].validate (valid => {
          if(valid) {
            let param = {id:this.addForm.id, invoiceFinishFlag:this.addForm.invoiceFinishFlag};
            let url = "/ce/disc/paper/invoice/invoiceReplenishMain/func_invoiceReplenishFinish";
            post(param, url).then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: res.data.retMsg });
                  this.queryObjById();
                  this.handleSearch();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

      relationInvoice() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.billPickInvoiceParams.listId = this.currentSelectRow.id;
        this.billPickInvoiceParams.custNo = this.addForm.custNo;
        this.billPickInvoiceParams.billNo = this.currentSelectRow.billNo;
        this.billPickInvoiceParams.invoiceFlag = this.currentSelectRow.invoiceFlag;
        this.billPickInvoiceParams.billMoney = this.currentSelectRow.billMoney;
        this.billPickInvoiceParams.batchNo = this.addForm.batchNo;
        this.billPickInvoiceParams.billId = this.currentSelectRow.billId;
        this.billPickInvoiceParams.dictMap = this.dictMap;
        this.billPickInvoiceWin = true;
      },

      billPickInvoiceWinClose() {
        this.billPackInvoiceClear();
        this.billPickInvoiceWin = false;
        this.$refs.datagrid.dataChange(1);
      },

      billPackInvoiceClear() {
        this.billPickInvoiceParams.listId = "";
        this.billPickInvoiceParams.custNo = "";
        this.billPickInvoiceParams.billNo = "";
        this.billPickInvoiceParams.invoiceFlag = "";
        this.billPickInvoiceParams.billMoney = "";
        this.billPickInvoiceParams.batchNo = "";
        this.billPickInvoiceParams.billId = "";
        this.currentSelectRow = [];
      },

      billPickInvoiceChange(listId){
        if (this.billPickInvoiceParams.invoiceFlag === "1") {
          this.billPickInvoiceWinClose();
        } else {
          post({id:listId }, "/ce/disc/paper/invoice/invoiceReplenishMain/func_relatedInvoice").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.billPickInvoiceWinClose();
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
                this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      },

      //发票管理
      invoiceManager() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let invoiceFlag = this.currentSelectRow.invoiceFlag;
        if (invoiceFlag === "1") {
          this.relationInvoiceBillParams.listId = this.currentSelectRow.id;
          this.relationInvoiceBillParams.cancelRelationUrl = "/ce/disc/paper/invoice/invoiceReplenishMain/func_cancelRelatedInvoice";
          this.relationInvoiceBillParams.dictMap = this.dictMap;
          this.relationInvoiceBillWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.ce.relationInvoiceError") });
          return;
        }
      },

      //发票管理返回
      relationInvoiceBillWinClose() {
        this.relationInvoiceBillParams.listId = "";
        this.relationInvoiceBillParams.cancelRelationUrl = "";
        this.relationInvoiceBillWin = false;
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      }

    },
  };
</script>

<style scoped>

</style>
