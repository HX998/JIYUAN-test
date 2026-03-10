<template>
  <div>
    <h-msg-box v-model="tempAcptAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose" width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchOptType==='add'">{{$t('m.i.ce.addApply')}}</span>
        <span v-else-if="batchOptType==='modify' && batchParams.isCommit === 'noCommit'">{{$t('m.i.ce.modifyApply')}}</span>
        <span v-else-if="batchOptType==='modify' && batchParams.isCommit === 'hasCommit'">{{$t('m.i.ce.cancelApply')}}</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <!--<own-brch-no :addForm = "addOrEditForm" @brchNoWinOpen="brchNoWin = true" v-if="this.licenseFlag"></own-brch-no>-->
          <show-branch v-model="addOrEditForm.ownedBrchNo" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" title="机构名称"
                       :showCheckBox="false" :msgBoxWin="tempAcptAddOrEditWin" v-if="this.licenseFlag" :params="{authPath: this.$route.path}"
                       :brchNo.sync="addOrEditForm.ownedBrchNo" :brchName.sync="addOrEditForm.ownedBrchName" :readonly="batchParams.isCommit === 'hasCommit'"  :showIcon="batchParams.isCommit !== 'hasCommit'"
                       url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
          </show-branch>
          <h-form-item prop="prodNo" :label="$t('m.i.common.busiType')" required>
              <h-select v-model="addOrEditForm.prodNo" placeholder="" :readonly="batchOptType==='modify'" showTitle>
                <h-option v-for="item in prodNoArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
          <common-select v-model="addOrEditForm.billOriginList" :label="$t('m.i.billInfo.billOrigin')" prop="billOriginList"
                         :dictList="batchParams.billOriginArray" :readonly="batchOptType==='modify'" :multiple="batchParams.isMixPack "  required ></common-select>
          <h-form-item prop="acptType" :label="$t('m.i.ce.acptType')" required>
              <h-select v-model="addOrEditForm.acptType" placeholder="" :readonly="batchOptType==='modify'" showTitle @on-change="changeAcptType">
                <h-option v-for="item in this.batchParams.eAcptTypeArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
              <h-input v-model="addOrEditForm.drwrName" placeholder="" @on-change="handleDrwrNameChange"
                       :icon="batchOptType ==='add' ? 'android-search' : ''"  @on-click="queryCustNo" readonly ></h-input>
            </h-form-item>
            <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" required>
              <h-input v-model="addOrEditForm.drwrAcctNo" placeholder="" :icon="batchOptType ==='add' ? 'android-search' : ''" @on-click="queryCustAcct('drwr')" readonly></h-input>
            </h-form-item>
            <h-form-item prop="settleAcctNo" v-show="this.addOrEditForm.acptType!=='3'" :label="$t('m.i.ce.settleAcctNo')" :required="this.addOrEditForm.acptType!=='3'">
              <h-input v-model="addOrEditForm.settleAcctNo" placeholder="" :icon="(batchParams.isCommit === 'hasCommit' || this.addOrEditForm.acptType === '2') ? '' : 'android-search'" @on-click="queryCustAcct('settle')" readonly></h-input>
            </h-form-item>
            <!--<h-form-item :label="this.addOrEditForm.acptType === '2' ? $t('m.i.ce.signBranch'): $t('m.i.ce.acptBranch')" prop="acptBrchName" required>
              <h-input placeholder="" v-model="addOrEditForm.acptBrchName" readonly icon="android-search" @on-click="queryBrchNo('acpt')"></h-input>
            </h-form-item>-->
          <show-branch v-model="addOrEditForm.acptBrchName" :label="this.addOrEditForm.acptType === '2' ? $t('m.i.ce.signBranch'): $t('m.i.ce.acptBranch')"
                       prop="acptBrchName" required title="机构名称" :showCheckBox="false" :msgBoxWin="tempAcptAddOrEditWin" :readonly="batchParams.isCommit === 'hasCommit' || this.addOrEditForm.acptType === '2'"  :showIcon="batchParams.isCommit !== 'hasCommit' && this.addOrEditForm.acptType !== '2'"
                       @brchNoChange="brchNoChange($event,'acpt')" :brchNo.sync="addOrEditForm.acptBrchNo" :brchName.sync="addOrEditForm.acptBrchName">
          </show-branch>
           <!-- <h-form-item :label="$t('m.i.ce.drweBankName')" v-show="this.addOrEditForm.acptType !== '2'" prop="drweBankName" :required="this.addOrEditForm.acptType !== '2'">
              <h-input placeholder="" v-model="addOrEditForm.drweBankName" readonly icon="android-search" @on-click="queryBrchNo('pay')"></h-input>
            </h-form-item>-->
          <show-branch v-model="addOrEditForm.drweBankName" :label="$t('m.i.ce.drweBankName')" v-show="this.addOrEditForm.acptType !== '2'"
                       prop="drweBankName" :required="this.addOrEditForm.acptType !== '2'" title="机构名称" :readonly="batchParams.isCommit === 'hasCommit'"  :showIcon="batchParams.isCommit !== 'hasCommit'"
                       :showCheckBox="false" :msgBoxWin="tempAcptAddOrEditWin" @brchNoChange="brchNoChange($event,'pay')"
                       :brchNo.sync="addOrEditForm.drweBankNo" :brchName.sync="addOrEditForm.drweBankName" :isInitValueClearable="this.addOrEditForm.acptType === '2'">
          </show-branch>
            <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
              <h-date-picker type="date" placeholder="" v-model="addOrEditForm.remitDt" format="yyyy-MM-dd" showFormat :editable=false :readonly="batchParams.isCommit === 'hasCommit'" transfer></h-date-picker>
            </h-form-item>
            <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
              <h-date-picker type="date" placeholder="" v-model="addOrEditForm.dueDt" format="yyyy-MM-dd" showFormat :editable=false :readonly="batchParams.isCommit === 'hasCommit'" transfer></h-date-picker>
            </h-form-item>
            <h-form-item prop="chargeType" :label="$t('m.i.ce.chargeType')" required>
              <h-select v-model="addOrEditForm.chargeType" placeholder="" :readonly="batchOptType==='modify'" showTitle>
                <h-option v-for="item in chargeTypeArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="feeRatio" :label="$t('m.i.ce.feeRatio')"  required :validRules="ratePctRule">
              <h-typefield  placeholder="费率范围0~10000" type="money" v-model="addOrEditForm.feeRatio" :readonly="batchParams.isCommit === 'hasCommit'">
                <slot slot="append"><span>&#8241;</span></slot>
              </h-typefield>
            </h-form-item>
            <h-form-item prop="commitFeeRatio" :label="$t('m.i.ce.commitFeeRatio')" :validRules="ratePctRule">
              <h-typefield  placeholder="费率范围0~10000" type="money" v-model="addOrEditForm.commitFeeRatio" :readonly="batchParams.isCommit === 'hasCommit'">
                <slot slot="append"><span>&#8241;</span></slot>
              </h-typefield>
            </h-form-item>
            <h-form-item prop="acptProtocalNo" :label="$t('m.i.billInfo.acptProtocalNo')">
              <h-input v-model="addOrEditForm.acptProtocalNo" :maxlength=40 :lengthByByte="false" placeholder="" :readonly="batchParams.isCommit === 'hasCommit'"></h-input>
            </h-form-item>
            <h-form-item prop="guarntrType" :label="$t('m.i.ce.guarntrType')" required>
              <h-select v-model="addOrEditForm.guarntrType" placeholder="" :readonly="batchOptType==='modify'" showTitle  @on-change="changeGuarntrType">
                <h-option v-for="item in this.batchParams.guarntrTypeArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item v-show="this.addOrEditForm.guarntrType !== '' && this.addOrEditForm.guarntrType !== '4'" prop="guarntrNo" :label="this.addOrEditForm.guarntrType === '1' ? $t('m.i.ce.guarntrNo') : this.addOrEditForm.guarntrType === '2' ? $t('m.i.ce.receiptNo') : $t('m.i.ce.pollNo')"
                         :required="this.addOrEditForm.guarntrType !== '' && this.addOrEditForm.guarntrType !== '4'">
              <h-input v-model="addOrEditForm.guarntrNo" placeholder="" :icon="this.addOrEditForm.guarntrType !== '2' && this.batchOptType === 'add' ? 'android-search' : ''" @on-click="queryCustAcct('guarntr')" :readonly="(this.addOrEditForm.guarntrType !== '2' || batchParams.isCommit === 'hasCommit')" :maxlength="32"></h-input>
            </h-form-item>
            <h-form-item placeholder="" :label="$t('m.i.ce.guarntrRateType')"  prop="guarntrRateType" v-show="this.addOrEditForm.guarntrType === '1' || this.addOrEditForm.guarntrType === '2'">
              <h-select v-model="addOrEditForm.guarntrRateType" placeholder=""  @on-change="guarntrRateTypeOnChange" key="guarntrRateTypeSelect" showTitle :readonly="batchParams.isCommit === 'hasCommit'">
                <h-option value="1" key="1">{{$t('m.i.ce.guarntrRateType_day')}}</h-option>
                <h-option value="30" key="30">{{$t('m.i.ce.guarntrRateType_month')}}</h-option>
                <h-option value="360" key="360">{{$t('m.i.ce.guarntrRateType_year')}}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item v-show="this.addOrEditForm.guarntrType === '1' || this.addOrEditForm.guarntrType === '2'" prop="guarntrRate" :label="$t('m.i.ce.guarntrRate')"
                         :validRules="this.guarntrRateRule">
              <h-typefield placeholder="" type="money" v-model="addOrEditForm.guarntrRate" :readonly="batchParams.isCommit === 'hasCommit'">
                <slot slot="append">
                  <span ref="guarntrTypeShow" v-html="guarntrRateTypeIcon"></span>
                </slot>
              </h-typefield>
            </h-form-item>
            <h-form-item v-show="this.addOrEditForm.guarntrType === '1'" prop="bailPcet" :label="$t('m.i.ce.bailPcet')" :required="this.addOrEditForm.guarntrType === '1'" :validRules="this.bailPcetRule">
              <h-typefield placeholder="" type="money" v-model.number="addOrEditForm.bailPcet"  :readonly="batchParams.isCommit === 'hasCommit'">
                <slot slot="append"><span>&#37;</span></slot>
              </h-typefield>
            </h-form-item>
            <h-form-item prop="agencyBankNo" v-show="this.addOrEditForm.acptType === '3'" :label="this.addOrEditForm.acptType === '2' ? $t('m.i.ce.agencyBankNo') : $t('m.i.ce.byAgencyBankNo')"
                         :required="this.addOrEditForm.acptType === '3'" :validRules="this.bankNoRule">
              <h-input v-model="addOrEditForm.agencyBankNo" placeholder="" :maxlength="12" :readonly="batchParams.isCommit === 'hasCommit'"></h-input>
            </h-form-item>
            <h-form-item prop="agencyBankName" v-show=" this.addOrEditForm.acptType === '3'" :label="this.addOrEditForm.acptType === '2' ? $t('m.i.ce.agencyBankName') : $t('m.i.ce.byAgencyBankName')"
                         :required="this.addOrEditForm.acptType === '3'">
              <h-input v-model="addOrEditForm.agencyBankName" placeholder="" :maxlength="255" :readonly="batchParams.isCommit === 'hasCommit'"></h-input>
            </h-form-item>
            <h-form-item prop="agencyAcctNo" v-show="this.addOrEditForm.acptType === '3'" :label="$t('m.i.ce.agencyAcctNo')" :required="this.addOrEditForm.acptType === '3'">
              <h-input  placeholder="" v-model="addOrEditForm.agencyAcctNo" :maxlength="32" :readonly="batchParams.isCommit === 'hasCommit'"></h-input>
            </h-form-item>
            <h-form-item prop="invoiceAfterFlag" :label="$t('m.i.ce.invoiceAfterFlag')" required>
              <h-select v-model="addOrEditForm.invoiceAfterFlag" placeholder="" showTitle :readonly="batchParams.isCommit === 'hasCommit'">
                <h-option v-for="item in this.batchParams.YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="forceInvoiceFlag" v-show="this.addOrEditForm.invoiceAfterFlag === '0'" :label="$t('m.i.ce.forceInvoiceFlag')" :required="this.addOrEditForm.invoiceAfterFlag === '0'">
              <h-select v-model="addOrEditForm.forceInvoiceFlag" placeholder="" showTitle :readonly="batchParams.isCommit === 'hasCommit'">
                <h-option v-for="item in this.batchParams.YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave" v-if="this.batchParams.isCommit === 'noCommit'">{{$t('m.i.common.save')}}</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/ce/acpt/elec/apply/eAcptApplyMain/func_queryPageAcptBil"
          :bindForm="formItem"
          :has-select="true"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="acptElecPickBill">{{$t('m.i.ce.pickBill')}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="acptElecBillDelete">{{$t('m.i.common.delete')}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="relationInvoice">{{$t('m.i.ce.relationInvoice')}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="invoiceManager">{{$t('m.i.bm.invoiceManager')}}</h-button>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t('m.i.common.submit')}}<h-icon name="unfold"></h-icon></h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">{{$t('m.i.ce.selectSubmit')}}</h-dropdown-item>
                <h-dropdown-item name="batch">{{$t('m.i.ce.batchSubmit')}}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="acptElecBillCancel">{{$t('m.i.common.cancel')}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="contractPrinting('acptContract')">{{$t('m.i.ce.contractPrinting')}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">

      </div>
    </h-msg-box>
    <show-cust-message :showCustMessageWin="showCustInfoWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit" ref="showCustInfo"></show-cust-message>
    <show-cust-acct-no :showCustAcctNoWin="showCustAcctWin" :custNo="this.addOrEditForm.drwrCustNo" :isAllOtherBankAcct="this.isAllOtherBankAcct" :custAcctKind="this.custAcctKind" :busiOwnBrchNo="this.busiOwnBrchNo" @showCustAcctNoWinClose="showCustAcctWinClose" @custAcctNoSelectSubmit="custAcctSelectSubmit" ref="showCustAcct"></show-cust-acct-no>
<!--    <show-brch-info :showBranchWin="showBranchWin" :title="$t('m.i.ce.brchTitle')" @brchNoChange="brchNoChange" @showBranchWinClose="showBranchWinClose"></show-brch-info>-->
    <e-acpt-pick-bill :acptPickBillWin="acptPickBillWin"  :acptPickBillParams="acptPickBillParams" @acptPickBillChange="acptPickBillChange" @acptPickBillWinClose="acptPickBillWinClose" ></e-acpt-pick-bill>
    <!--展示票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
    <invoice-pick-bill :billPickInvoiceWin="billPickInvoiceWin" :billPickInvoiceParams="billPickInvoiceParams" @billPickInvoiceWinClose="billPickInvoiceWinClose" @billPickInvoiceChange="billPickInvoiceChange"></invoice-pick-bill>
    <relation-invoice-bill-info :relationInvoiceBillWin="relationInvoiceBillWin" :relationInvoiceBillParams="relationInvoiceBillParams" @relationInvoiceBillWinClose="relationInvoiceBillWinClose" ></relation-invoice-bill-info>
    <show-pool-credit-info :pool-credit-info-win="poolCreditInfoWin" :poolCreditInfoParams="poolCreditInfoParams"
                           @poolCreditInfoChange="poolCreditInfoChange"
                           @poolCreditInfoWinClose="poolCreditInfoWinClose"></show-pool-credit-info>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="licenseBrchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWin=false" :ifcheck="false"></show-license-branch>-->
  </div>
</template>

<script>
import {accDiv, accMul, formatBillRange, formatNumber, post} from "@/api/bizApi/commonUtil";

export default {
    name: "eAcptApplyAdd",
    components: {
      //"show-brch-info":()=>import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      "e-acpt-pick-bill":()=>import(/* webpackChunkName: "ce/acpt/elec/apply/eAcptPickBill" */`@/views/bizViews/ce/acpt/elec/apply/eAcptPickBill`),
      "invoice-pick-bill":()=>import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/billPickInvoice`),
      "relation-invoice-bill-info":()=>import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/relationInvoiceBillInfo`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      return {
        bankNoRule :[{
          test: /^([0-9]{12})$/,
          trigger: "blur",
          message: "行号为12位长度数字"
        }],
       // brchNoWin:false,

        ratePctRule :[{
          test: /^(\d{1,4}(\.\d{1,2})?|10000|10000\.00)$/,
          trigger: "blur",
          message: "利率范围0~10000，且小数位不超过两位"
        }],
        bailPcetRule:[{
          test: /^(\d{1,2}(\.\d{1,2})?|100|100\.00)$/,
          trigger: "blur",
          message: "保证金比例范围0~100，且小数位不超过两位"
        }],
        guarntrRateTypeIcon:"&#37;",
        showCustInfoWin: false,
        showCustAcctWin: false,
        selectDrwrAcct: false,
        selectSettleAcct: false,
        selectGuarntrAcct:false,
       // showBranchWin: false,
       // selectAcptBrch: false,
       // selectPayBrch: false,
        isAllOtherBankAcct:false,
        acptPickBillWin:false,
        billPickInvoiceWin:false,
        relationInvoiceBillWin:false,
        poolCreditInfoWin: false,
        poolCreditInfoParams: {},
        brchTitle: '',
        custAcctKind : "",
        acptPickBillParams: {
          batchId: "",
          drwrAcctNo: "",
          drwrBankNo: "",
          drwrCustNo: "",
          acptType:"",
          agencyAcctNo:"",
          agencyBankNo:"",
          remitDt:"",
          dueDt:"",
          dictMap: this.batchParams.dictMap,
          acptBrchNo: "",
          billOriginArray:[],
          selectBillOriginList:[]
        },
        billPickInvoiceParams: {
          listId: "",
          custNo: "",
          billNo: "",
          invoiceFlag: "",
          billMoney: "",
          batchNo:"",
          billId:"",
          dictMap: this.batchParams.dictMap
        },
        relationInvoiceBillParams: {
          listId: "",
          cancelRelationUrl: "",
          dictMap: this.batchParams.dictMap
        },
        addOrEditForm: {
          id:"",
          drwrCustNo: "",
          drwrName: "",
          drwrAcctNo: "",
          acptType: "1",
          prodNo: "01010121",
          settleAcctNo: "",
          acptProtocalNo: "",
          drwrBrchNo: "",
          drwrBankNo: "",
          drwrBankName: "",
          remitDt: "",
          dueDt: "",
          acptBrchName: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          acptBrchNo: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          paymentBrchNo: "",
          drweBankNo: JSON.parse(window.sessionStorage.getItem('userInfo')).bankNo,
          drweBankName: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          guarntrType:"4",
          guarntrNo:"",
          guarntrOrder:"",
          guarntrRate:"",
          feeRatio:"",
          commitFeeRatio:"",
          bailPcet:"",
          settleAcctOrderNo:"",
          agencyBankNo:"",
          agencyBankName:"",
          agencyAcctNo:"",
          chargeType:"1",
          dataSource:"1",
          billClass:"ME02",
          billType:"AC01",
          guarntrRateType:"",
          invoiceAfterFlag: "0",
          forceInvoiceFlag: "",
          batchNo:"",
          billId:"",
          billOriginList: [],
          ownedBrchNo:"",
          ownedBrchName:"",
        },
        prodNoArray: [{ key: "01010121", value: "电票银承签发" }],
        chargeTypeArray: [{ key: "1", value: "转账" }, { key: "2", value: "现金" }, { key: "3", value: "内部户" }],
        guarntrRateRule: [{ test: this.validRate, trigger: "blur" }],
        formItem:{
          billClass:"ME02",
          ownedBrchNo:""
        },
        guarntrTypeArray: [],
        acptTypeArray: [],
        YonList: [],
        columns:[
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
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap,"BillOrigin",params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
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
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
            }
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: "flowStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
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
            title: this.$t('m.i.billInfo.dueDt'),
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
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
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrBankNo'),
            key: "drwrBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: "pyeeBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          }
        ],
        showBillInfoWin:false,
        billId :"",
        billNo:"",
        billRangeStart:"",
        billRangeEnd:"",
        acptPrintType:"",
        batchOptType: ""
      };
    },
    props: {
      busiOwnBrchNo: {
        type: String,
        default: ""
      },
      acptAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          YonList: [],
          batchId: {
            type: Number
          },
          optType: "",
          isCommit: "",
          curFuncNo: "",
          invoiceAfterFlag:"",
          acptType:"",
          guarntrType:"",
          acptTypeArray:[],
          guarntrTypeArray:[],
          billOriginArray:[],
          isMixPack:""
        }
      },
      licenseFlag:{
        type:Boolean,
        default(){
          return false
        }
      },
      authPath:""
    },
    computed: {
      tempAcptAddOrEditWin: {
        get() {
          return this.acptAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      acptAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchOptType = this.batchParams.optType;
            this.formItem.batchId = this.batchParams.batchId;
            this.formItem.curFuncNo = this.batchParams.curFuncNo;
            this.addOrEditForm.invoiceAfterFlag = this.batchParams.invoiceAfterFlag;
            this.addOrEditForm.acptType = this.batchParams.acptType;
            this.addOrEditForm.guarntrType = this.batchParams.guarntrType;
            if (this.batchParams.optType === "modify") {
              this.queryObjById();
            }
            if (this.batchParams.optType === "add") {
              if (this.licenseFlag) {
                this.addOrEditForm.ownedBrchNo = this.$store.getters.userInfo.brchNo
                this.addOrEditForm.ownedBrchName = this.$store.getters.userInfo.brchName
              }
              this.$refs.addOrEditForm.resetValidate();
              this.$refs.datagrid.tData = [];
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      },
      'addOrEditForm.ownedBrchNo'(val){
        if (this.licenseFlag) {
          this.formItem.ownedBrchNo=val;
        }
      }
    },
    methods: {
      changeAcptType(){
        if(!(this.addOrEditForm.acptType === '2' || this.addOrEditForm.acptType === '3')){
          this.addOrEditForm.agencyBankNo = '';
          this.addOrEditForm.agencyBankName = '';
        }
        if(this.addOrEditForm.acptType === '3'){
          this.addOrEditForm.settleAcctNo = '';
          this.addOrEditForm.settleAcctOrderNo = "";
        }
        if(this.addOrEditForm.acptType !== '3'){
          this.addOrEditForm.agencyAcctNo = '';
        }
        if(this.addOrEditForm.acptType === '2'){
          this.addOrEditForm.drweBankName = '';
          this.addOrEditForm.paymentBrchNo = '';
          this.addOrEditForm.drweBankNo = '';
        }
        this.isAllOtherBankAcct = false;
        this.addOrEditForm.drwrAcctNo = '';
      },
      changeGuarntrType(){
        if(this.addOrEditForm.guarntrType === '4'){
          this.addOrEditForm.guarntrNo = '';
          this.addOrEditForm.guarntrOrder = '';
        }
        if(!(this.addOrEditForm.guarntrType === '1' || this.addOrEditForm.guarntrType === '2')){
          this.addOrEditForm.guarntrRate = '';
        }
        if(this.addOrEditForm.guarntrType !== '1'){
          this.addOrEditForm.bailPcet = '';
        }
      },
      validRate(rule, val, callback) {
        if(!(this.addOrEditForm.guarntrType === '1' || this.addOrEditForm.guarntrType === '2')){
          callback();
        }
        if(!val){
          callback();
        }
        if (this.addOrEditForm.guarntrRateType === "30") {
          let re = /^(\d{1,3}(\.\d{1,2})?|1000|1000\.00)$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("利率范围0~1000，且小数位不超过两位"));
          }
        } else if (this.addOrEditForm.guarntrRateType === "1") {
          let re = /^(\d{1,4}(\.\d{1,2})?|10000|10000\.00)$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("利率范围0~10000，且小数位不超过两位"));
          }
        } else {
          let re = /^(\d{1,2}(\.\d{1,2})?|100|100\.00)$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("利率范围0~100，且小数位不超过两位"));
          }
        }
      },
      queryObjById() {
        let params = { id: this.batchParams.batchId, billClass: "ME02", funcNo: this.batchParams.curFuncNo };
        post(params, "/ce/acpt/elec/apply/eAcptApplyMain/func_getAcptBatchById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.prodNo = obj.prodNo;
              this.addOrEditForm.acptType = obj.acptType;
              this.addOrEditForm.drwrAcctNo = obj.drwrAcctNo;
              this.addOrEditForm.drwrName = obj.drwrName;
              this.addOrEditForm.drwrBrchNo = obj.drwrBrchNo;
              this.addOrEditForm.drwrBankNo = obj.drwrBankNo;
              this.addOrEditForm.drwrCustNo = obj.drwrCustNo;
              this.addOrEditForm.drwrBankName = obj.drwrBankName;
              this.addOrEditForm.settleAcctNo = obj.settleAcctNo;
              this.addOrEditForm.settleAcctOrderNo = obj.settleAcctOrderNo;
              this.addOrEditForm.acptBrchName = obj.acptBrchName;
              this.addOrEditForm.acptBrchNo = obj.acptBrchNo;
              this.addOrEditForm.paymentBrchNo = obj.paymentBrchNo;
              this.addOrEditForm.billMoney = obj.billMoney;
              this.addOrEditForm.batchNo = obj.batchNo;
              this.addOrEditForm.drweBankName = obj.drweBankName;
              this.addOrEditForm.drweBankNo = obj.drweBankNo;
              this.addOrEditForm.chargeType = obj.chargeType;
              this.addOrEditForm.feeRatio = accMul(obj.feeRatio, 10000);
              this.addOrEditForm.commitFeeRatio = accMul(obj.commitFeeRatio, 10000);
              this.addOrEditForm.acptProtocalNo = obj.acptProtocalNo;
              this.addOrEditForm.guarntrType = obj.guarntrType;
              this.addOrEditForm.guarntrNo = obj.guarntrNo;
              if (this.addOrEditForm.guarntrType === '1' || this.addOrEditForm.guarntrType === '2') {
                this.addOrEditForm.guarntrRateType = obj.guarntrRateType;
                this.guarntrRateTypeOnChange(obj.guarntrRateType);
                if (obj.guarntrRateType === "30") {
                  this.addOrEditForm.guarntrRate = accMul(obj.guarntrRate, 1000);
                }else if (obj.guarntrRateType === "1") {
                  this.addOrEditForm.guarntrRate = accMul(obj.guarntrRate, 10000);
                }else {
                  this.addOrEditForm.guarntrRate = accMul(obj.guarntrRate, 100);
                }
              }
              if (this.addOrEditForm.guarntrType === '1') {
                this.addOrEditForm.bailPcet = accMul(obj.bailPcet, 100);
              }
              if (this.addOrEditForm.acptType === '2' || this.addOrEditForm.acptType === '3') {
                this.addOrEditForm.agencyBankNo = obj.agencyBankNo;
                this.addOrEditForm.agencyBankName = obj.agencyBankName;
              }
              if (this.addOrEditForm.acptType === '3') {
                this.addOrEditForm.agencyAcctNo = obj.settleAcctNo;
              }
              if (!!obj.remitDt) {
                this.addOrEditForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              if (!!obj.dueDt) {
                this.addOrEditForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.addOrEditForm.invoiceAfterFlag = obj.invoiceAfterFlag;
              this.addOrEditForm.forceInvoiceFlag = obj.forceInvoiceFlag;
              if (this.licenseFlag) {
                this.addOrEditForm.ownedBrchNo=obj.ownedBrchNo;
                this.addOrEditForm.ownedBrchName=obj.ownedBrchName;
                this.formItem.ownedBrchNo=obj.ownedBrchNo;
              }
              this.batchParams.isMixPack = true ;
              if(obj.billOriginList!==null){
                // this.addOrEditForm.billOriginList = obj.billOriginList[0];
                this.addOrEditForm.billOriginList = obj.billOriginList ;
              }else{
                this.addOrEditForm.billOriginList = [];
              }
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      guarntrRateTypeOnChange(value) {
        if (value === "360") {
          this.guarntrRateTypeIcon = "&#37;";
        } else if (value === "30") {
          this.guarntrRateTypeIcon = "&#8240;";
        } else if (value === "1") {
          this.guarntrRateTypeIcon = "&#8241;";
        } else {
          this.guarntrRateTypeIcon = "&#37;";
        }
      },
      //挑票方法
      acptElecPickBill() {
        if (this.batchParams.optType === "add") {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
        }
        this.acptPickBillParams.batchId = this.batchParams.batchId;
        this.acptPickBillParams.drwrAcctNo = this.addOrEditForm.drwrAcctNo;
        this.acptPickBillParams.drwrBankNo = this.addOrEditForm.drwrBankNo;
        this.acptPickBillParams.agencyAcctNo = this.addOrEditForm.agencyAcctNo;
        this.acptPickBillParams.agencyBankNo = this.addOrEditForm.agencyBankNo;
        this.acptPickBillParams.acptType = this.addOrEditForm.acptType;
        this.acptPickBillParams.remitDt = this.addOrEditForm.remitDt;
        this.acptPickBillParams.dueDt = this.addOrEditForm.dueDt;
        this.acptPickBillParams.dictMap = this.batchParams.dictMap;
        this.acptPickBillParams.licenseFlag=this.licenseFlag;
        this.acptPickBillParams.ownedBrchNo=this.addOrEditForm.ownedBrchNo;
        this.acptPickBillParams.acptBrchNo=this.addOrEditForm.acptBrchNo;
        if(this.addOrEditForm.acptType ==='2'){
          this.acptPickBillParams.drwrCustNo = this.addOrEditForm.drwrCustNo;
        }
        //选中的票据来源
        this.acptPickBillParams.selectBillOriginList=this.addOrEditForm.billOriginList;
        this.acptPickBillParams.billOriginArray=this.batchParams.billOriginArray;
        // this.addOrEditForm
        this.acptPickBillWin = true;
      },
      acptPickBillClear() {
        this.acptPickBillParams.batchId = "";
        this.acptPickBillParams.drwrAcctNo = "";
        this.acptPickBillParams.drwrBankNo = "";
        this.acptPickBillParams.agencyAcctNo = "";
        this.acptPickBillParams.agencyBankNo = "";
      },
      //删除票据方法
      acptElecBillDelete() {
        if (this.$refs.datagrid.selects.length  === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let selects=this.$refs.datagrid.selects
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              let ids = "";
              for (let i = 0; i < selects.length; i++) {
                if (i == 0) {
                  ids = ids + selects[i].id;
                } else {
                  ids = ids + "," + selects[i].id;
                }
              }
              post({ ids: ids, batchId:this.batchParams.batchId,acptType:this.addOrEditForm.acptType,billClass:this.addOrEditForm.billClass }, "/ce/acpt/elec/apply/eAcptApplyMain/func_delAcptBill").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.currentSelectRow = [];
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              });
            }
          });
      },

      //承兑合同打印
      contractPrinting(type) {
        if (this.batchParams.batchId === "" || this.batchParams.batchId == null) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        if (type==="acptContract") {
          this.acptPrintType="PE030413";
        } else {
          this.acptPrintType="PE030414";
        }
        post({ id: this.batchParams.batchId }, "/ce/acpt/elec/apply/eAcptAccountMain/func_printAcptContract").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.assembleAcptParams(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

      assembleAcptParams(acptContract) {
        let vocherData = [];
        acptContract.drwrName = acptContract.drwrName;
        acptContract.acptBrchName = acptContract.acptBrchName;
        acptContract.drwrAcctNo = acptContract.drwrAcctNo;
        acptContract.drwrBankName = acptContract.drwrBankName;
        acptContract.printObj = JSON.stringify(acptContract);
        vocherData.push(acptContract);
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: this.acptPrintType, vocherData: vocherData },
          callback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.$refs.datagrid.$refs.gridPage.clearElevator();
          },
          errorCallback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.$refs.datagrid.$refs.gridPage.clearElevator();
          }
        });
      },

      //关联发票
      relationInvoice () {
        if (this.$refs.datagrid.selects.length  === 1) {
            this.billPickInvoiceParams.listId = this.$refs.datagrid.selectIds;
            this.billPickInvoiceParams.custNo = this.addOrEditForm.drwrCustNo;
            this.billPickInvoiceParams.billNo = this.$refs.datagrid.selects[0].billNo;
            this.billPickInvoiceParams.invoiceFlag = this.$refs.datagrid.selects[0].invoiceFlag;
            this.billPickInvoiceParams.billMoney = this.$refs.datagrid.selects[0].billMoney;
            this.billPickInvoiceParams.batchNo  = this.addOrEditForm.batchNo;
            this.billPickInvoiceParams.billId = this.$refs.datagrid.selects[0].billId;
            this.billPickInvoiceParams.billRangeStart = this.$refs.datagrid.selects[0].billRangeStart;
            this.billPickInvoiceParams.billRangeEnd = this.$refs.datagrid.selects[0].billRangeEnd;
            this.billPickInvoiceParams.dictMap = this.batchParams.dictMap;
            this.billPickInvoiceWin = true;
        }  else if (this.$refs.datagrid.selects.length > 1){
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },

      //关联发票业务表处理
      billPickInvoiceChange(listId) {
        if (this.billPickInvoiceParams.invoiceFlag === "1") {
          this.billPickInvoiceWinClose();
        } else {
          post({id:listId }, "/ce/acpt/elec/apply/eAcptApplyMain/func_relatedInvoice").then(res => {
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
      },

      //发票管理
      invoiceManager() {
        if (this.$refs.datagrid.selects.length === 1) {
            let invoiceFlag = this.$refs.datagrid.selects[0].invoiceFlag;
            if (invoiceFlag === "1") {
              this.relationInvoiceBillParams.listId = this.$refs.datagrid.selects[0].id;
              this.relationInvoiceBillParams.cancelRelationUrl = "/ce/acpt/elec/apply/eAcptApplyMain/func_cancelRelatedInvoice";
              this.relationInvoiceBillParams.dictMap = this.batchParams.dictMap;
              this.relationInvoiceBillWin = true;
            } else {
              this.$msgTip.info(this, { info: this.$t("m.i.ce.relationInvoiceError") });
              return;
            }
        } else if (this.$refs.datagrid.selects.length > 1){
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },
      //发票管理返回
      relationInvoiceBillWinClose() {
        this.relationInvoiceBillParams.listId = "";
        this.relationInvoiceBillParams.cancelRelationUrl = "";
        this.relationInvoiceBillWin = false;
        this.$refs.datagrid.dataChange(1);
      },

      //撤销申请提交方法
      acptElecBillCancel() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗?",
          onOk: () => {
            post({ batchId: this.batchParams.batchId ,licenseFlag:this.licenseFlag,ownedBrchNo:this.addOrEditForm.ownedBrchNo}, "/ce/acpt/elec/apply/eAcptApplyMain/func_cancelSubmitFlow").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                  if (this.tempAcptAddOrEditWin) {
                    this.handleClose();
                  }
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
      acptPickBillWinClose() {
        this.acptPickBillClear();
        this.acptPickBillWin = false;
      },
      //挑票提交方法
      acptPickBillChange(info) {
        let transIds = [];
        for (let i = 0; i < info.length; i++) {
          transIds.push(info[i].transId);
        }
        post({
          transIds: transIds.join(","),
          batchId: this.batchParams.batchId,
          billClass:"ME02",
          licenseFlag:this.licenseFlag,
          ownedBrchNo:this.addOrEditForm.ownedBrchNo
        }, "/ce/acpt/elec/apply/eAcptApplyMain/func_saveSelectAcptBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.acptPickBillClear();
              this.acptPickBillWin = false;
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }

        });

      },
      //提交
      submit(type) {
        if (type === "select") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let acptIds = [];
          for (let i = 0; i < list.length; i++) {
            acptIds.push(list[i].id);
          }
          let params = { batchId: this.batchParams.batchId, ids: acptIds.join(",") , billOperType:'0'};
          this.submitBills(params);
        } else if (type === "batch") {
          if (this.batchParams.batchId === "" || this.batchParams.batchId == null) {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if(this.$refs.datagrid.tData.length === 0){
            this.$msgTip.info(this,{info:"该批次下无数据"});
            return;
          }
          let params = { batchId: this.batchParams.batchId, billOperType:'1' };
          this.submitBills(params);
        }
      },
      submitBills(params) {
        let param={licenseFlag:this.licenseFlag,ownedBrchNo:this.addOrEditForm.ownedBrchNo}
        Object.assign(param,params);
        post(param, "/ce/acpt/elec/apply/eAcptApplyMain/func_submitAcptBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1,(data)=>{
                if (!data||data.length==0) {
                  this.handleClose();
                }
              });
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });

      },
      formSave() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            if ((this.addOrEditForm.dueDt!==null && this.addOrEditForm.dueDt!=="")&&
              (this.addOrEditForm.remitDt!==null && this.addOrEditForm.remitDt!=="")) {
              let remitDate = this.$moment(this.addOrEditForm.remitDt).format('YYYY/MM/DD');
              remitDate=new Date(remitDate);
              let dueDate = this.$moment(this.addOrEditForm.dueDt).format('YYYY/MM/DD');
              dueDate=new Date(dueDate);
              let month = (dueDate.getFullYear() - remitDate.getFullYear())*12;
              month = month + (dueDate.getMonth() - remitDate.getMonth());
              if(dueDate.getDate() - remitDate.getDate() > 0){
                month = month + 1;
              }
              if(month > 12){
                this.$msgTip.info(this, { info: "电票期限最大12个月!" });
                return;
              }
            }
            this.addOrEditForm.remitDt = this.addOrEditForm.remitDt.replace(/-/g, "");
            if (this.addOrEditForm.dueDt!==null && this.addOrEditForm.dueDt!=="") {
              this.addOrEditForm.dueDt = this.addOrEditForm.dueDt.replace(/-/g, "");
            }
            if (this.addOrEditForm.remitDt < window.sessionStorage.getItem("workDate")) {
              this.$msgTip.info(this, { info: "出票日期必须大于或等于当前营业日期" });
              return;
            }
            if (this.addOrEditForm.dueDt!==null && this.addOrEditForm.dueDt!=="") {
              if (this.addOrEditForm.remitDt >= this.addOrEditForm.dueDt) {
                this.$msgTip.info(this, { info: "出票日期必须小于汇票到期日" });
                return;
              }
            }

            let param = this.deepClone(this.addOrEditForm);
            let obj={licenseFlag:this.licenseFlag};
            Object.assign(param,obj)
            if (Number(param.bailPcet) === 0) {
              param.bailPcet = "0";
            } else {
              param.bailPcet = accDiv(param.bailPcet, 100);
            }
            if (Number(param.feeRatio) === 0) {
              param.feeRatio = "0";
            } else {
              param.feeRatio = accDiv(param.feeRatio, 10000);
            }
            if (Number(param.commitFeeRatio) === 0) {
              param.commitFeeRatio = "0";
            } else {
              param.commitFeeRatio = accDiv(param.commitFeeRatio, 10000);
            }
            if (Number(param.guarntrRate) === 0) {
              param.guarntrRate = "0";
            } else {
              if (param.guarntrRateType === "30") {
                param.guarntrRate = accDiv(param.guarntrRate, 1000);
              }else if (param.guarntrRateType === "1") {
                param.guarntrRate = accDiv(param.guarntrRate, 10000);
              }else{
                param.guarntrRate = accDiv(param.guarntrRate, 100);
              }
            }
            param.remitDt = this.$moment(param.remitDt).format("YYYYMMDD");
            if (param.dueDt!==null && param.dueDt!==""){
              param.dueDt = this.$moment(param.dueDt).format("YYYYMMDD");
            }
            if(this.addOrEditForm.acptType === '3') {
              param.settleAcctNo = param.agencyAcctNo;
            }
            let url = "/ce/acpt/elec/apply/eAcptApplyMain/func_addAcptBatch";
            if (this.batchParams.batchId != null) {
              url = "/ce/acpt/elec/apply/eAcptApplyMain/func_editAcptBatch";
            }
            post(param, url).then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  if (this.batchParams.optType === 'add') {
                    this.batchParams.batchId = res.data.retData;
                    this.formItem.batchId = res.data.retData;
                    this.addOrEditForm.id = res.data.retData;
                  }
                  this.$msgTip.success(this, { info: res.data.retMsg });
                  this.batchParams.optType = 'modify';
                  this.batchOptType = this.batchParams.optType;
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
      handleDrwrNameChange(value){
        this.addOrEditForm.drwrAcctNo = "";
        this.addOrEditForm.settleAcctNo = "";
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },

      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.settleAcctNo = "";
        this.addOrEditForm.id="";
        this.addOrEditForm.drwrCustNo= "";
        this.addOrEditForm.drwrName= "";
        this.addOrEditForm.drwrAcctNo= "";
        this.addOrEditForm.acptType= "1";
        this.addOrEditForm.prodNo= "01010121";
        this.addOrEditForm.settleAcctNo= "";
        this.addOrEditForm.acptProtocalNo= "";
        this.addOrEditForm.drwrBrchNo= "";
        this.addOrEditForm.drwrBankNo= "";
        this.addOrEditForm.drwrBankName= "";
        this.addOrEditForm.remitDt= "";
        this.addOrEditForm.dueDt= "";
        this.addOrEditForm.acptBrchName = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.addOrEditForm.acptBrchNo = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.addOrEditForm.paymentBrchNo = "";
        this.addOrEditForm.drweBankNo = JSON.parse(window.sessionStorage.getItem('userInfo')).bankNo;
        this.addOrEditForm.drweBankName = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.addOrEditForm.guarntrType="4";
        this.addOrEditForm.guarntrNo="";
        this.addOrEditForm.guarntrOrder="";
        this.addOrEditForm.guarntrRate="";
        this.addOrEditForm.feeRatio="";
        this.addOrEditForm.commitFeeRatio="";
        this.addOrEditForm.bailPcet="";
        this.addOrEditForm.settleAcctOrderNo="";
        this.addOrEditForm.agencyBankNo="";
        this.addOrEditForm.agencyBankName="";
        this.addOrEditForm.agencyAcctNo="";
        this.addOrEditForm.chargeType="1";
        this.addOrEditForm.dataSource="1";
        this.addOrEditForm.billClass="ME02";
        this.addOrEditForm.billType="AC01";
        this.addOrEditForm.guarntrRateType="";
        this.addOrEditForm.invoiceAfterFlag = "0";
        this.addOrEditForm.forceInvoiceFlag = "";
        this.addOrEditForm.batchNo="";
        this.addOrEditForm.billId="";
        this.addOrEditForm.ownedBrchNo="";
        this.addOrEditForm.ownedBrchName="";
        this.$emit("acptAddOrEditWinClose", "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds=[];
        this.currentSelectList = [];
        this.formItem.licenseFlag=this.licenseFlag
        this.$refs.datagrid.dataChange(1);
      },


      //查询客户账号信息
      queryCustAcct(type) {
        if (this.addOrEditForm.acptType === "") {
          this.$msgTip.info(this, { info: "请先选择签发类型！" });
          return;
        }
        if (this.addOrEditForm.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        if (type === "drwr") {
          if (this.addOrEditForm.acptType === "3" || this.addOrEditForm.acptType === "2") {
            this.isAllOtherBankAcct = true;
          }
          this.custAcctKind = "";
          this.selectDrwrAcct = true;
          this.showCustAcctWin = true;
        } else if (type === "settle") {
          this.selectSettleAcct = true;
          this.showCustAcctWin = true;
        } else if (type === "guarntr") {
          let guarntrType = this.addOrEditForm.guarntrType;
          if (guarntrType === "1") {
            this.selectGuarntrAcct = true;
            this.custAcctKind = "2";
            this.showCustAcctWin = true;
          } else {
            // this.poolCreditInfoParams.batchId = this.currentSelectRow.batchId;
            this.poolCreditInfoParams.custNo = this.addOrEditForm.drwrCustNo;
            this.poolCreditInfoParams.dataUrl = "/ce/acpt/elec/apply/eAcptApplyAdd/func_pagingQueryCustCreditInfo";
            this.poolCreditInfoWin = true;
          }
        }
      },
      //赋值
      custAcctSelectSubmit(info) {
        if (this.selectDrwrAcct) {
          this.addOrEditForm.drwrAcctNo = info.custAcctNo;
          this.addOrEditForm.drwrBankNo = info.openBankNo;
          this.addOrEditForm.drwrBankName = info.openBrchName;
          this.addOrEditForm.drwrBrchNo = info.openBrchNo;
          if (this.addOrEditForm.acptType !== "3") {
            this.addOrEditForm.settleAcctNo = info.custAcctNo;
            this.addOrEditForm.settleAcctOrderNo = info.subAcctSrlNo;
          }
        } else if (this.selectSettleAcct) {
          this.addOrEditForm.settleAcctNo = info.custAcctNo;
          this.addOrEditForm.settleAcctOrderNo = info.subAcctSrlNo;
        } else if (this.selectGuarntrAcct) {
          this.addOrEditForm.guarntrNo = info.custAcctNo;
          this.addOrEditForm.guarntrOrder = info.subAcctSrlNo;
        }
        this.clearAcctFlag();
        this.showCustAcctWin = false;
      },
      //关闭弹窗
      showCustAcctWinClose() {
        this.showCustAcctWin = false;
        this.clearAcctFlag();
      },
      clearAcctFlag() {
        this.isAllOtherBankAcct = false;
        this.selectGuarntrAcct = false;
        this.selectDrwrAcct = false;
        this.selectSettleAcct = false;
      },
      //查询客户信息
      queryCustNo() {
        this.showCustInfoWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.drwrReset();
        this.addOrEditForm.drwrCustNo = info.custNo;
        this.addOrEditForm.drwrName = info.custName;
        this.showCustInfoWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustInfoWin = false;
      },
      /*//查询机构弹出框
      queryBrchNo(type) {
        if (type === "acpt") {
          this.selectAcptBrch = true;
        }
        if (type === "pay") {
          this.selectPayBrch = true;
        }
        this.showBranchWin = true;
      },*/
      //根据弹框所选数据进行赋值
      brchNoChange(info, type) {
        if (type === "acpt") {
          if(info.length>0) {
            this.addOrEditForm.drweBankNo = info[0].bankNo;
            this.addOrEditForm.paymentBrchNo = this.addOrEditForm.acptBrchNo;
            this.addOrEditForm.drweBankName = this.addOrEditForm.acptBrchName;
          }else{
            this.addOrEditForm.drweBankNo = "";
            this.addOrEditForm.paymentBrchNo =  "";
            this.addOrEditForm.drweBankName =  "";
          }
        }
        if (type === "pay") {
          if (info.length > 0) {
            this.addOrEditForm.paymentBrchNo = info[0].brchNo;
            this.addOrEditForm.drweBankNo = info[0].bankNo;
          }/* else {
            this.addOrEditForm.drweBankNo = "";
          }*/
        }
      },
      /*clearBrchFlag() {
        this.selectAcptBrch = false;
        this.selectPayBrch = false;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },*/
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = row.billId;
        } else {
          this.billNo = row.billNo;
        }
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },

      //赋值
      poolCreditInfoChange(info) {
        this.addOrEditForm.guarntrNo = info.poolNo;
        this.poolCreditInfoWin = false;
      },
      //关闭弹出框
      poolCreditInfoWinClose() {
        this.poolCreditInfoWin = false;
      },

      drwrReset() {
        this.addOrEditForm.drwrAcctNo = "";
        this.addOrEditForm.drwrBankNo = "";
        this.addOrEditForm.drwrBankName = "";
        this.addOrEditForm.drwrBrchNo = "";
        this.addOrEditForm.settleAcctNo = "";
        this.addOrEditForm.settleAcctOrderNo = "";
        this.addOrEditForm.guarntrNo = "";
        this.addOrEditForm.guarntrOrder = "";
      }

      /*licenseBrchNoChange(info) {
        this.addOrEditForm.ownedBrchNo = info[0].id;
        this.addOrEditForm.ownedBrchName = info[0].title;
        this.brchNoWin = false;
      },*/
    },
  };
</script>

<style scoped>

</style>
