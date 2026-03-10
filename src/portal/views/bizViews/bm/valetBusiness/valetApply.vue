<!--代客业务-代客申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--                <h-form-item :label="$t('m.i.billInfo.ecdsBillStatus')" prop="ecdsStatusList" required v-if="this.formItem.billOrigin == 'CS01'">-->
                <!--                  <h-select v-model="formItem.ecdsStatusList" placeholder="" multiple showTitle>-->
                <!--                    <h-option v-for="item in ecdsBillStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>-->
                <!--                  </h-select>-->
                <!--                </h-form-item>-->
                <!--                <h-form-item :label="$t('m.i.billInfo.cpesBillStatus')" prop="billStatusList" required v-if="this.formItem.billOrigin == 'CS02' || this.formItem.billOrigin == 'CS03'">-->
                <!--                  <h-select v-model="formItem.billStatusList" placeholder="" multiple showTitle>-->
                <!--                    <h-option v-for="item in billStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>-->
                <!--                  </h-select>-->
                <!--                </h-form-item>-->
                <h-form-item :label="$t('m.i.bm.transId')" prop="transNo" required>
                  <h-select v-model="formItem.transNo" placeholder="">
                    <h-option v-for="item in transNoList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearCustNo()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName" required>
                  <h-input v-model="formItem.custName" :maxlength=60 readonly></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.bm.custAcctNo')" required>
                  <h-input v-model="formItem.custAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()" clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="" @on-change="onChange">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :validRules="billNoRule">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
                  <h-input v-model="formItem.pyeeName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
                  <h-input v-model="formItem.acptName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" :prop="isMinBillMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.minBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','min')" placeholder=""
                                   @on-focus="formatBillMoney('focus','min')"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2"><span>至</span></h-col>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.maxBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','max')" placeholder=""
                                   @on-focus="formatBillMoney('focus','max')" bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false placement="bottom-end"
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            url="/bm/valetBusiness/valetApply/func_queryApplyBillInfo"
            :bindForm="formItem"
            :hasSelect="selected"
            param-id="billId"
            :row-select="true"
            :auto-load="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="valetOperate('register')">{{$t('m.i.bm.valetRegister')}}</h-button>
              <h-button type="primary" @click="valetOperate('acceptance')">{{$t('m.i.bm.valetAcceptance')}}</h-button>
              <h-button type="primary" @click="valetOperate('issuance')">{{$t('m.i.bm.valetIssuance')}}</h-button>
              <h-button type="primary" @click="valetOperate('presentation')">{{$t('m.i.bm.valetPresentation')}}</h-button>
              <h-button type="primary" @click="valetOperate('pledge')">{{$t('m.i.be.pledgeApplication')}}</h-button>
              <h-button type="primary" @click="valetOperate('disc')" v-if="discShow">{{$t('m.i.bm.valetDisc')}}</h-button>
              <h-button type="primary" @click="valetOperate('discount')" v-if="discountShow">{{$t('m.i.bm.discountApplication')}}</h-button>
              <h-button type="primary" @click="valetOperate('recourseApply')">{{$t('m.i.be.recourseApplication')}}</h-button>
              <h-button type="primary" @click="valetOperate('agreement')">{{$t('m.i.ce.agreement')}}</h-button>
              <!--              <h-button type="primary" @click="valetOperate('presentation')" :disabled="formItem.transNo!='202001' && formItem.transNo!='202101' && ifShowEndrsmt">{{$t('m.i.bm.valetPresentation')}}</h-button>-->
              <h-button type="primary" @click="valetOperate('endrsmt')" >{{$t('m.i.bm.valetEndrsmt')}}</h-button>
              <h-button type="primary" @click="valetOperate('relieve')" >{{$t('m.i.bm.valetRelieve')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustElecSignWin" @custElecSignWinClose="custElecSignWinClose"
                         @custElecSignSubmit="custElecSignSubmit"></show-cust-elec-sign>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustAcctNoWin" :custInfoParams="custInfoParams"
                         :isShowCustAcctNo="true"
                         @custElecSignWinClose="showCustAcctNoWinClose"
                         @custElecSignSubmit="custAcctNoSelectSubmit"></show-cust-elec-sign>
    <!-- 提示付款申请界面 -->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :mask-closable="false" :maximize="true"
               @on-close="handleWinClose">
      <p slot="header">
        <span>提示付款申请</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <h-form-item prop="prsnttnDt" :label="$t('m.i.common.applDt')" required>
            <h-date-picker type="date" v-model="addOrEditForm.prsnttnDt" placeholder="" showFormat
                           :editable=false readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.prsnttnAmt')" prop="prsnttnAmt" required>
            <h-typefield type="money" v-model="addOrEditForm.prsnttnAmt" :maxlength="20"
                         placeholder="数字，小数位最多2位" bigTips readonly></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.overdueFlag')" prop="overdueFlag" required>
            <h-select v-model="addOrEditForm.overdueFlag" placeholder="" @on-change="overdueFlagChange" readonly>
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.sttlmMk')" prop="sttlmMk" required>
            <h-select v-model="addOrEditForm.sttlmMk" placeholder="">
              <h-option v-for="item in clearMarkList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.overdueRsn')" prop="overdueRsn" :required="isRequired" class="h-form-height-auto" v-if="isRequired">
            <h-input type="textarea" :rows=3 v-model="addOrEditForm.overdueRsn" :canResize="false"
                     :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.prsnttnRemark')" prop="prsnttnRemark" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addOrEditForm.prsnttnRemark" :canResize="false"
                     :maxlength="256"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t('m.i.be.submission')}}</h-button>
      </div>
    </h-msg-box>

    <!-- 质押申请界面 -->
    <h-msg-box v-model="pledgeWin" width="400" class="h-form-search-layer" :mask-closable="false" :maximize="true"
               @on-close="pledgeWinClose">
      <p slot="header">
        <span>质押申请</span>
      </p>
      <h-panel>
        <h-form :model="pledgeForm" :label-width="115" ref="pledgeForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.be.pledgeDt')" prop="pledgeDt">
            <h-date-picker type="date" v-model="pledgeForm.pledgeDt" placeholder="" showFormat
                           :editable=false readonly></h-date-picker>
          </h-form-item>
          <h-form-item prop="pledgeeName" :label="$t('m.i.pe.pledgeeName')" required>
            <h-input v-model="pledgeForm.pledgeeName" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('drwr')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pawneeNo')" prop="pawneeNo">
            <h-input v-model="pledgeForm.pawneeNo" :maxlength="60" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.pledgorBankNo')" prop="pledgorBankNo">
            <h-input v-model="pledgeForm.pledgorBankNo" :maxlength="32" readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="handlePledgeClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitPledgeForm()">{{$t('m.i.common.commit')}}</h-button>
      </div>
    </h-msg-box>


    <!-- 代客贴现申请界面 -->
    <h-msg-box v-model="addOrEditWinDisc" width="800" class="h-form-search-layer" :mask-closable="false" :maximize="true"
               @on-close="handleWinCloseDisc">
      <p slot="header">
        <span>无感贴现申请</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditFormDisc" :label-width="115" ref="addOrEditFormDisc" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :validRules="billNoRule">
            <h-input v-model="addOrEditFormDisc.billNo" :maxlength="30" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" >
            <h-typefield type="money" v-model="addOrEditFormDisc.billMoney" :maxlength="20"
                         placeholder="数字，小数位最多2位" readonly></h-typefield>
          </h-form-item>
          <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" >
            <h-date-picker type="date" v-model="addOrEditFormDisc.remitDt" placeholder="" showFormat
                           :editable=false readonly></h-date-picker>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" >
            <h-date-picker type="date" v-model="addOrEditFormDisc.dueDt" placeholder="" showFormat
                           :editable=false readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName" >
            <h-input v-model="addOrEditFormDisc.drwrName" :maxlength="60" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName" >
            <h-input v-model="addOrEditFormDisc.acptName" :maxlength="60" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.pyeeName')" prop="pyeeName" >
            <h-input v-model="addOrEditFormDisc.pyeeName" :maxlength="60" readonly></h-input>
          </h-form-item>
          <h-form-item prop="discDt" :label="$t('m.i.billInfo.discDt')" >
            <h-date-picker type="date" v-model="addOrEditFormDisc.discDt" placeholder="" showFormat
                           :editable=false readonly></h-date-picker>
          </h-form-item>
          <!--贴现利率-->
          <common-type-field v-model="addOrEditFormDisc.discRate" :label="$t('m.i.pe.discRate')" prop="discRate"
                             :required="true" :integerNum="3" :suffixNum="4" :bigTips="false" readonly></common-type-field>
          <h-form-item :label="$t('m.i.billInfo.discInterest')" prop="discInterest" required>
            <h-typefield type="money" v-model="addOrEditFormDisc.discInterest" :maxlength="20"
                         placeholder="数字，小数位最多2位" readonly></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.discInBankNum')" prop="discInBankNo" required>
            <h-input v-model="addOrEditFormDisc.discInBankNo" :maxlength="60" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.discInBankNameTo')" prop="discInBankName" required>
            <h-input v-model="addOrEditFormDisc.discInBankName" :maxlength="60" readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinCloseDisc()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitFormDisc()">{{$t('m.i.be.submission')}}</h-button>
      </div>
    </h-msg-box>

    <!-- 贴现申请界面 -->
    <h-msg-box v-model="discountWin" width="800" class="h-form-search-layer" :mask-closable="false" :maximize="true"
               @on-close="discountWinClose">
      <p slot="header">
        <span>贴现申请</span>
      </p>
      <h-panel>
        <h-form :model="discountForm" :label-width="130" ref="discountForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.discType')" prop="discType" required>
            <h-select v-model="discountForm.discType" placeholder="" @on-change="discTypeChange">
              <h-option v-for="item in RepurchasedMarkList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <!--贴现利率-->
          <div class="server-name-div">
            <common-type-field v-model="discountForm.discRate" :label="$t('m.i.pe.discRate')" prop="discRate"
                               :required="true" :integerNum="3" :suffixNum="4" :bigTips="false"  class="server-name-input"></common-type-field>
            <h-button type="primary"  class="server-name-button" @click="interestCalculation()" style="width:60px;height:30px;padding-left:3px;padding-top:4px;">
              {{$t('m.i.bm.calcDiscRate')}}</h-button>
          </div>
          <h-form-item :label="$t('m.i.bm.discountFactor')" prop="discountFactor">
            <h-typefield type="money" v-model="discountForm.discountFactor" :maxlength="20"
                         placeholder="数字，小数位最多2位" readonly></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.actPayAmt')" prop="saleReceiveAmt">
            <h-input v-model="discountForm.saleReceiveAmt" :maxlength="50"
                     placeholder="数字，小数位最多2位" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billPackageMoney">
            <h-input v-model="discountForm.billPackageMoney" :maxlength="50" readonly></h-input>
          </h-form-item>
          <h-form-item prop="discDt" :label="$t('m.i.billInfo.discDt')" required>
            <h-date-picker type="date" v-model="discountForm.discDt" placeholder="" showFormat
                           :editable=false readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.toBankName')" prop="toBankName" required>
            <h-input v-model="discountForm.toBankName" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('disc')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.toBankNo')" prop="toBankNo">
            <h-input v-model="discountForm.toBankNo" :maxlength="50" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.discInAcctNo')" prop="discInAcctNo" required>
            <h-input v-model="discountForm.discInAcctNo" :maxlength="50" ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.aoAcctNo')" prop="aoAcctNo" required>
            <h-input v-model="discountForm.aoAcctNo" :maxlength="50" ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.aoAcctName')" prop="aoAcctName" :required = "this.discountForm.billOrigin !== 'CS01'">
            <h-input v-model="discountForm.aoAcctName" :maxlength="50" ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.aoAcctBankNo')" prop="aoAcctBankNo" required>
            <h-input v-model="discountForm.aoAcctBankNo" :maxlength="50" ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.banEndrsmtMark')" prop="banEndrsmtMark" required>
            <h-select v-model="discountForm.banEndrsmtMark" placeholder="">
              <h-option v-for="item in BanEndorsementMarkList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.shcpe.onlineSettleFlags')" prop="onlineSettleFlag" required>
            <h-select v-model="discountForm.onlineSettleFlag" placeholder="">
              <h-option v-for="item in clearMarkList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.ce.discountRedemptionBeginDay')" prop="discountRedemptionBeginDay" v-show="this.discountForm.discType === 'RM01'">
            <h-date-picker type="date" v-model="discountForm.discountRedemptionBeginDay" placeholder="" showFormat
                           :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.discountRedemptionEndDay')" prop="discountRedemptionEndDay" v-show="this.discountForm.discType === 'RM01'">
            <h-date-picker  type="date" v-model="discountForm.discountRedemptionEndDay" placeholder="" showFormat
                            :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.discountRedemptionRate')" prop="discountRedemptionRate" v-show="this.discountForm.discType === 'RM01'">
            <h-input  v-model="discountForm.discountRedemptionRate" :maxlength="50" ></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="handleDiscountClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitDiscountForm()">{{$t('m.i.common.commit')}}</h-button>
      </div>
    </h-msg-box>

    <!-- 代客同意清偿界面 -->
    <h-msg-box v-model="addOrEditWinAgreement" width="800" class="h-form-search-layer" :mask-closable="false"
               :maximize="true"
               @on-close="handleWinCloseAgreement">
      <p slot="header">
        <span>同意清偿</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditFormAgreement" :label-width="115" ref="addOrEditFormAgreement" cols="1"
                class="h-form-search">
          <!--同意清偿金额-->
          <h-form-item :label="$t('m.i.ce.agreeAmt')" prop="rcrsAmt" required>
            <h-typefield type="money" v-model="addOrEditFormAgreement.rcrsAmt" :maxlength="20"
                         placeholder="数字，小数位最多2位"></h-typefield>
          </h-form-item>
          <!--追索同意清偿备注-->
          <h-form-item :label="$t('m.i.ce.agreeRemark')" prop="rmrkByPropsr">
            <h-input v-model="addOrEditFormAgreement.rmrkByPropsr" :maxlength="256"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinCloseAgreement()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitFormAgreement()">{{$t('m.i.be.submission')}}</h-button>
      </div>
    </h-msg-box>

    <!-- 背书申请界面 -->
    <h-msg-box v-model="endrsmtWin" width="800" class="h-form-search-layer" :mask-closable="false" :maximize="true"
               @on-close="handleEndrsmtWinClose">
      <p slot="header">
        <span>背书申请</span>
      </p>
      <h-panel>
        <h-form :model="endrsmtForm" :label-width="115" ref="endrsmtForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.bs.endrsmtDt')" prop="endrsmtDt" required>
            <h-date-picker type="date" v-model="endrsmtForm.endrsmtDt" placeholder="" showFormat
                           :editable=false readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.endrsmt')" prop="endrsmtName" required>
            <h-input v-model="endrsmtForm.endrsmtName" :maxlength="60" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.endrsmtAcctNo')" prop="endrsmtAcctNo" required>
            <h-input v-model="endrsmtForm.endrsmtAcctNo" :maxlength="32" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.endrseeDistType')" prop="endrseeDistType" required v-if="endrsmtForm.billOriginFlag">
            <h-select v-model="endrsmtForm.endrseeDistType" placeholder="" @on-change="enonChange">
              <h-option value="DT01">票据账户</h-option>
              <h-option value="DT02">银行账户</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.endrseeName')" prop="endrseeName" required>
            <h-input v-model="endrsmtForm.endrseeName" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.endrseeAcctNo')" prop="endrseeAcctNo" required>
            <h-input v-model="endrsmtForm.endrseeAcctNo" :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.endrseeAcctName')" prop="endrseeAcctName" :required = "endrsmtForm.esanrequired" v-if="endrsmtForm.billOriginFlag">
            <h-input v-model="endrsmtForm.endrseeAcctName" :maxlength="125"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.endrseeBankNo')" prop="endrseeBankNo" :required = "endrsmtForm.esanrequired">
            <h-input v-model="endrsmtForm.endrseeBankNo" placeholder="" @on-change="brchNoChange" readonly
                     icon="android-search" @on-click="queryHvpsBank()" @on-clear="clearVal()" :maxlength="12"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.endrseeBankName')" prop="endrseeBankName" :required = "endrsmtForm.esanrequired">
            <h-input v-model="endrsmtForm.endrseeBankName" readonly :maxlength="125"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.endrseeMemberId')" prop="endrseeMemberId" :required = "!endrsmtForm.esanrequired" v-if="endrsmtForm.memberIdFlag" class="h-form-long-label">
            <h-input v-model="endrsmtForm.endrseeMemberId" :maxlength="125"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.banEndrsmtMark')" prop="banEndrsmtMark" required>
            <h-select v-model="endrsmtForm.banEndrsmtMark" placeholder="">
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="remark" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="endrsmtForm.remark" :canResize="false"
                     :maxlength="256"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="handleEndrsmtWinClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitEndrsmtForm()">{{$t('m.i.be.submission')}}</h-button>
      </div>
    </h-msg-box>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <show-hvps-bank :showHvpsBank="endrsmtBankNoWin" @showHvpsBankClose="showHvpsBankClose"
                    @showHvpsBankSubmit="brchNoChange"></show-hvps-bank>

    <!-- 票交所机构 -->
    <show-cpes-branch :showCpesBranch="showCpesBranchWin" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>

    <!--ecds追索申请页面-->
    <show-recourse-apply-detail-ecds :addOrEditWin="showRecoursesEcds" :recourseReasonCodeList="this.recourseReasonCodeList" :recourseTypeList="this.EcdsRecourseTypeList" :billOriginList="this.billOriginList"
                                :dictMap="this.dictMap" :addForm="this.addForm" @handleWinClose="handleEcdsWinClose"/>

    <!--cpes追索申请页面-->
    <show-recourse-apply-detail-cpes :addOrEditWin="showRecoursesCpes" :rcvgDistTypeList="this.rcvgDistTypeList" :recourseTypeList="this.EcdsRecourseTypeList" :billOriginList="this.billOriginList"
                                :dictMap="this.dictMap" :addForm="this.addForm" @handleWinClose="handleEcdsWinClose"/>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,formatBillRange,getDictValueFromMap,accMul,accSub,accDiv  } from "@/api/bizApi/commonUtil";

  export default {
    name: "valetApply",
    components: {
      ShowRecourseApplyDetailCpes: () => import(/* webpackChunkName: "bm/valetBusiness/showRecourseApplyDetailCpes" */ '@/views/bizViews/bm/valetBusiness/showRecourseApplyDetailCpes'),
      ShowRecourseApplyDetailEcds: () => import(/* webpackChunkName: "bm/valetBusiness/showRecourseApplyDetailEcds" */ '@/views/bizViews/bm/valetBusiness/showRecourseApplyDetailEcds'),
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      ShowHvpsBank: () => import(/* webpackChunkName: "shcpe/cpes/hvpsbank/showHvpsBank" */`@/views/bizViews/shcpe/cpes/hvpsbank/showHvpsBank`),
    },
    data() {
      let formItem = {
        transNo: "",
        custNo: "",
        custName: "",
        custAcctNo: "",
        billNo: "",
        drwrName: "",
        pyeeName: "",
        acptName: "",
        billType: "",
        minBillMoney: "",
        maxBillMoney: "",
        minDueDt: "",
        maxDueDt: "",
        minRemitDt: "",
        maxRemitDt: "",
        ecdsStatusList: [],
        billStatusList: [],
        billOrigin: "",
        minBillRangeStart: "",
        minBillRangeEnd: "",
        maxBillRangeStart: "",
        maxBillRangeEnd: ""
      };
      let columns = [
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
          key: "billId",
          title: this.$t('m.i.common.billId'),
          hiddenCol: true
        },
        {
          title: this.$t('m.i.billInfo.billOrigin'),
          key: "billOrigin",
          render: (h, params) => {
            let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
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
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = "";
            if (params.row.billNo === null || params.row.billNo === "") {
              billNo = this.$t('m.i.ce.showBillInfo');
            } else {
              billNo = params.row.billNo;
            }
            return h("a", {
              on: {
                click: () => {
                  if (params.row.billRangeStart != null && params.row.billRangeEnd != null) {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart.toString(), params.row.billRangeEnd.toString());
                  } else {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }
            }, billNo);
          }
        },
        {
          title: this.$t('m.i.billInfo.billRange'),
          key: "billRange",
          align: 'center',
          render: (h, params) => {
            return h("span", formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd));
          }
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: "billType",
          ellipsis: false,
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
          title: this.$t('m.i.billInfo.ecdsBillStatus'),
          key: "billStatus",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = "无";
            if (params.row.billOrigin == "CS01") {
              dictValue = getDictValueFromMap(this.dictMap, "EcdsBillStatusCode", params.row.ecdsBillStatus);
            } else if (params.row.billOrigin == "CS02" || params.row.billOrigin == "CS03") {
              dictValue = getDictValueFromMap(this.dictMap, "BillStatusCode", params.row.billStatus);
            } else {
              dictValue = "无";
            }
            if (dictValue == null || dictValue == "NULL") {
              dictValue = "无";
            }
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),
          key: "billMoney",
          ellipsis: false,
          sortable: true,
          hiddenCol: false,
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
          title: this.$t('m.i.billInfo.remitDt'),
          key: "remitDt",
          ellipsis: false,
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
          ellipsis: false,
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
          title: this.$t('m.i.billInfo.drwrName'),
          key: "drwrName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.drwrBankNo'),
          key: "drwrBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.drwrBankName'),
          key: "drwrBankName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeName'),
          key: "pyeeName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankNo'),
          key: "pyeeBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankName'),
          key: "pyeeBankName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: "acptName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptBankNo'),
          key: "acptBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptBankName'),
          key: "acptBankName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        }
      ];
      let addOrEditForm = {
        prsnttnDt: "",
        prsnttnAmt: "",
        overdueFlag: "",
        sttlmMk: "",
        overdueRsn: "",
        prsnttnRemark: ""
      };
      let pledgeForm = {
        pledgeDt: "",
        pledgeeName: "",
        pawneeNo: "",
        pledgorBankNo: ""
      };
      let discountForm = {
        discType: "RM00",
        discRate: "",
        discountFactor: "",
        saleReceiveAmt: "",
        billPackageMoney: "",
        discDt: "",
        toBankName: "",
        toBankNo: "",
        discInAcctNo: "",
        aoAcctNo: "",
        aoAcctName: "",
        aoAcctBankNo: "",
        banEndrsmtMark: "EM00",
        onlineSettleFlag: "SM01",
        discountRedemptionBeginDay: "",
        discountRedemptionEndDay: "",
        discountRedemptionRate: "",
        billOrigin: "",
      };
      let addForm = {
        elctrncSgntr: "",
        transAmt: "",
        stdAmt: "",
        billNo: "",
        billId: "",
        hldrId: "",
        billOrigin:"",
        billRangeStart: "",
        billRangeEnd: "",
        recourseType: "",
        recourseAmt: "",
        hldrBrchNo: "",
        billMoney: "",
        recourseDt : this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD"),
        isRecourse: "",
        ownedBrchNo: "",
        ownedBrchName: "",
        cirStatus:"",
        licenseFlag: false,
        hldrSocCode: "",
        transNo: "",
        applAcctNo: "",
        custNo: "",
      };
      let addOrEditFormDisc = {
        billNo:"",
        billMoney:"",
        remitDt:"",
        dueDt:"",
        drwrName:"",
        acptName:"",
        pyeeName:"",
        discDt:"",
        discRate:"",
        discInterest:"",
        discInBankNo:"",
        discInBankName:""
      };
      let addOrEditFormAgreement = {
        rcrsAmt: "",
        rmrkByPropsr: ""
      };
      let endrsmtForm = {
        endrsmtDt: this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD"),
        endrsmtName :"",
        endrsmtAcctNo : "",
        endrseeName: "",
        endrseeAcctNo: "",
        endrseeBankNo: "",
        endrseeBankName: "",
        banEndrsmtMark: "",
        remark : "",
        endrseeDistType:"",
        billOriginFlag : "",
        memberIdFlag : "",
        billOrigin : "",
        endrseeAcctName : "",
        endrseeMemberId : "",
        esanrequired : "true"
      };

      return {
        formItem: formItem,
        columns: columns,
        addOrEditForm: addOrEditForm,
        pledgeForm: pledgeForm,
        discountForm:discountForm,
        addOrEditFormAgreement: addOrEditFormAgreement,
        addOrEditFormDisc: addOrEditFormDisc,
        endrsmtForm: endrsmtForm,
        addForm:addForm,
        billMoneyType: "min",
        dueDt: [],
        remitDt: [],
        selected: false,
        billNoRule: [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        RepurchasedMarkList: [{ key: "RM00", value: "买断式" }],
        BanEndorsementMarkList: [],
        billTypeList: [],
        clearMarkList: [],
        YonList: [],
        transNoList: [],
        banEndrsmtMarkList: [],
        EcdsRecourseTypeList: [],
        RecourseReasonList: [],
        recourseReasonCodeList : [],
        rcvgDistTypeList: [],
        dictMap: new Map(),
        //是否显示更多查询项
        ifShowMore: false,
        showCustElecSignWin: false,
        showCustAcctNoWin: false,
        addOrEditWin: false,
        addOrEditWinDisc:false,
        endrsmtWin: false,
        addOrEditWinAgreement: false,
        endrsmtBankNoWin : false,
        pledgeWin: false,
        discountWin: false,
        recourseWin: false,
        showCpesBranchWin: false,
        isRequired: false,
        submitFlag: false,
        showBillInfoWin: false,
        showRecoursesEcds:false,
        showRecoursesCpes:false,
        cpesBranchType: "",
        billId: "",
        billNo: "",
        billRangeStart:"",
        billRangeEnd:"",
        custInfoParams: {},
        ifShowEndrsmt : false,
        billOriginList: [],
        billStatusList: [],
        ecdsBillStatusList: [],
        //按钮权限
        btnAuth:"",
        discShow:false,
        discountShow:true,
      };
    },
    computed: {
      isMinBillMoney() {
        return this.billMoneyType === "min" ? "minBillMoney" : "maxBillMoney";
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,SettlementMarkCode,Yon,RcrsTypeCode,ValetApplTransNo,BanEndorsementMarkCode," +
        "BillOrigin,BillStatusCode,ValetApplTransNo,EcdsRecourseType,RecourseReasonCode,RepurchasedMarkCode,EcdsBillStatusCode,DistTypeCode,partnerType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.clearMarkList = res.get("SettlementMarkCode");
        this.YonList = res.get("Yon");
        this.transNoList = res.get("ValetApplTransNo");
        this.banEndrsmtMarkList = res.get("BanEndorsementMarkCode");
        this.ecdsBillStatusList = res.get("EcdsBillStatusCode");
        this.billStatusList = res.get("BillStatusCode");
        this.billOriginList = res.get("BillOrigin");
        this.EcdsRecourseTypeList = res.get("RcrsTypeCode");
        this.RecourseReasonList = res.get("RecourseReasonCode");
        this.recourseReasonCodeList = res.get("RecourseReasonCode");
        this.BanEndorsementMarkList = res.get("BanEndorsementMarkCode");
        this.rcvgDistTypeList = res.get("DistTypeCode");
        //       this.RepurchasedMarkList = res.get("RepurchasedMarkCode");
        // for(let i= 0; i < this.transNoList.length; i++){
        //   if(this.transNoList[i].key == "201001"){
        //     this.ifShowEndrsmt = true;
        //   }
        // }
        this.dictMap = res.get("map");
      });

      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if (this.btnAuth.discount === undefined ? false : this.btnAuth.discount.isShow) {
              this.discShow = true;
              this.discountShow = false;
            } else {
              this.discountShow = true;
              this.discShow = false;
            }
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      enonChange(value) {
        if(value == "DT01"){
          this.endrsmtForm.esanrequired = false;
          this.endrsmtForm.memberIdFlag = true;
          debugger;
        } else {
          this.endrsmtForm.esanrequired = true;
          this.endrsmtForm.memberIdFlag = false;
        }
      },
      onChange(value) {
        if (value == "CS01") {
          this.formItem.billStatusList = [];
        } else {
          this.formItem.ecdsStatusList = [];
        }
      },
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
      clearCustNo() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
      },
      //查询客户信息
      queryCustNo() {
        this.showCustElecSignWin = true;
      },
      //赋值
      custElecSignSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustElecSignWin = false;
      },
      //关闭
      custElecSignWinClose() {
        this.showCustElecSignWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.custInfoParams = { custNo: this.formItem.custNo, custName: this.formItem.custName };
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      formatBillMoney(optType, itemType) {
        this.billMoneyType = itemType;
        if (optType === "blur") {
          if (itemType === "min") {
            if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
              this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
              this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
          } else {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
          }
        }
      },
      //表单查询
      handleSearch() {
        let minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        let maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        if (parseFloat(minBillMoney) > parseFloat(maxBillMoney)) {
          this.$msgTip.info(this, { info: "票据金额区间输入有误" });
          return;
        }
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
            this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
            this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
            this.formItem.minRemitDt = this.formItem.minRemitDt.replace(/-/g, "");
            this.formItem.maxRemitDt = this.formItem.maxRemitDt.replace(/-/g, "");
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDt = [];
        this.remitDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      valetOperate(optType) {
        let content = "", url = "/bm/valetBusiness/valetApply/func_valetApplyBill", params = {};
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length !== 0) {
          if (optType === "register") {
            //代客出票登记
            content = "确定进行代客出票登记吗？";
            params = { code: JSON.stringify(this.initParams("NES.001.20.00P","出票登记")) };
          }else if (optType === "relieve") {
            //解质押申请
            content = "确定进行代客解质押申请吗？";
            params = { code: JSON.stringify(this.initParams("NES.010.20.00P","解质押申请")) };
          }
          else if (optType === "acceptance") {
            //代客提示承兑
            content = "确定进行代客提示承兑吗？";
            params = { code: JSON.stringify(this.initParams("NES.002.20.00P","提示承兑")) };
          } else if (optType === "issuance") {
            //代客提示收票
            content = "确定进行代客提示收票吗？";
            params = { code: JSON.stringify(this.initParams("NES.003.20.00P","提示收票")) };
          } else if (optType === "presentation") {
            //代客提示付款
            if (list.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.addOrEditWin = true;
            this.$nextTick(() => {
              this.$refs.addOrEditForm.resetFields();
              this.addOrEditForm.prsnttnDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
              this.addOrEditForm.prsnttnAmt = formatNumber(list[0].billMoney, 2, ",");
              this.addOrEditForm.overdueFlag = list[0].overdueFlag;
            });
            return;
          } else if (optType === "endrsmt"){
            //代客背书申请
            if (list.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.endrsmtForm.endrsmtName = list[0].hldrName;
            this.endrsmtForm.endrsmtAcctNo = list[0].hldrAcctNo;
            if(list[0].billOrigin != "CS01") {
              this.endrsmtForm.billOriginFlag = true;
            } else {
              this.endrsmtForm.billOriginFlag = false;
              if (list[0].billOrigin == "CS01") {
                this.endrsmtForm.esanrequired = true;
              }
            }
            this.endrsmtWin = true;
            return;
            // content = "确定进行代客背书申请吗？";
            // params = { code: JSON.stringify(this.initParams("201001")) };
          }else if (optType === "pledge") {
            //质押申请
            this.pledgeWin = true;
            this.$nextTick(() => {
              this.$refs.pledgeForm.resetFields();
              post({}, "/sm/oper/busiDate/viewBusiDate").then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.pledgeForm.pledgeDt = this.$moment(res.data.retData.workday, "YYYY-MM-DD").format("YYYY-MM-DD");
                  } else {
                    this.$msgTip.error(this, { info: "质押日期获取异常" + msg });
                  }
                }
              });
              this.pledgeForm.list = list;
            });
            return;
          }else if (optType === "disc"){
            //代客贴现申请
            if (list.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            let url="/bm/valetBusiness/valetApply/func_queryDiscApplyBillInfo";
            post({ billId:list[0].billId }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let obj = res.data.retData;
                  this.addOrEditWinDisc = true;
                  this.$nextTick(() => {
                    this.$refs.addOrEditFormDisc.resetFields();
                    this.addOrEditFormDisc.billNo = list[0].billNo;
                    this.addOrEditFormDisc.billMoney = formatNumber(list[0].billMoney, 2, ",");
                    this.addOrEditFormDisc.remitDt = this.$moment(list[0].remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                    this.addOrEditFormDisc.dueDt = this.$moment(list[0].dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                    this.addOrEditFormDisc.drwrName = list[0].drwrName;
                    this.addOrEditFormDisc.acptName = list[0].acptName;
                    this.addOrEditFormDisc.pyeeName = list[0].pyeeName;
                    this.addOrEditFormDisc.discDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
                    this.addOrEditFormDisc.discRate = accMul(obj.discRate,100);
                    this.addOrEditFormDisc.discInterest = obj.discInterest;
                    this.addOrEditFormDisc.discInBankNo = obj.discInBankNo;
                    this.addOrEditFormDisc.discInBankName = obj.discInBankName;
                  });
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.handleWinCloseDisc();
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
            return;
          }else if (optType === "discount") {
            //贴现申请
            if (list.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.discountWin = true;
            this.$nextTick(() => {
              this.$refs.discountForm.resetFields();
              post({}, "/sm/oper/busiDate/viewBusiDate").then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.discountForm.discDt = this.$moment(res.data.retData.workday, "YYYY-MM-DD").format("YYYY-MM-DD");
                  } else {
                    this.$msgTip.error(this, { info: "贴现日期获取异常" + msg });
                  }
                }
              });
              this.discountForm.billOrigin = list[0].billOrigin;
              this.discountForm.aoAcctNo = list[0].hldrAcctNo;
              this.discountForm.aoAcctBankNo = list[0].hldrBankNo;
              this.discountForm.aoAcctName = list[0].hldrAcctName;

              let sumBillMoney = null;
              for(let i=0 ;i<list.length;i++) {
                sumBillMoney += list[i].billMoney;
              }
              this.discountForm.billPackageMoney = formatNumber(sumBillMoney, 2, ",");;
              this.discountForm.list = list;
              this.billId = list[0].billId;
              this.funcNo = list[0].funcNo;
            });
            return;
          }else if (optType === "recourseApply") {
            //追索申请
            if (list.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            post({code:list[0].billOrigin}, "/pb/recourse/elecRecourseApply/recourseApply/func_isEcdsChannelAvailable").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.addForm.transAmt = list[0].transAmt
                  this.addForm.stdAmt = list[0].stdAmt;
                  this.addForm.elctrncSgntr = "0";
                  this.addForm.billNo = list[0].billNo;
                  this.addForm.billId = list[0].billId;
                  this.addForm.hldrId =  list[0].hldrId;
                  this.addForm.cirStatus = list[0].cirStatus;
                  this.addForm.isRecourse = list[0].isRecourse;
                  /*拒付追索*/
                  if (this.formItem.transNo && this.formItem.transNo == "NES.012.20.00P"){
                    this.addForm.recourseType = "BC14";
                  }
                  /*非拒付追索*/
                  if (this.formItem.transNo && this.formItem.transNo == "NES.012.20.01P"){
                    this.addForm.recourseType = "BC15";
                  }
                  this.addForm.ownedBrchNo = list[0].hldrBrchCode;
                  this.addForm.hldrBrchNo = list[0].hldrBrchCode;
                  this.addForm.billOrigin = list[0].billOrigin;
                  this.addForm.licenseFlag = this.licenseFlag;
                  this.addForm.billRangeStart = list[0].billRangeStart;
                  this.addForm.billRangeEnd = list[0].billRangeEnd;
                  this.addForm.billMoney = list[0].billMoney == null ? "0.00" : list[0].billMoney.toString().replace(/,/g, "");
                  this.addForm.recourseAmt = this.addForm.billMoney;
                  this.addForm.hldrSocCode = list[0].hldrSocCode;
                  this.addForm.transNo = this.formItem.transNo;
                  this.addForm.applAcctNo = this.formItem.custAcctNo;
                  this.addForm.custNo = this.formItem.custNo;
                  post({}, "/sm/oper/busiDate/viewBusiDate").then(res => {
                    if (res) {
                      let msg = res.data.retMsg;
                      let retCode = res.data.retCode;
                      if (retCode == "000000") {
                        this.addForm.recourseDt = this.$moment(res.data.retData.workday, "YYYY-MM-DD").format("YYYY-MM-DD");
                      } else {
                        this.$msgTip.error(this, { info: "追索日期获取异常" + msg });
                      }
                    }
                  });
                  if (res.data.retData) {
                    // ecds
                    this.showRecoursesEcds = true;
                  } else {
                    // cpes
                    this.showRecoursesCpes = true;
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            });
            return;
          }else if (optType === "agreement") {
            //代客同意清偿申请
            if (list.length > 1) {
              this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
              return;
            }
            let transNo = list[0].transNo;
            if (transNo !== "NES.013.20.10P" && transNo !== "NES.013.20.11P" && transNo !== "NES.013.20.00P" && transNo !== "NES.013.20.01P") {
              this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseAgreement")});
              return;
            }
            this.addOrEditWinAgreement = true;
            return;
          }
          this.handleValet(content, params, url);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      initParams(transNo,transName) {
        let list = this.$refs.datagrid.selects;
        let requestDto = {};
        requestDto.custNo = this.formItem.custNo;
        requestDto.applAcctNo = this.formItem.custAcctNo;
        requestDto.elctrncSgntr = "0";
        let reqInfoList = [];
        for (let i = 0, len = list.length; i < len; i++) {
          let reqInfo = {};
          let billInfo = {};
          billInfo = list[i];
          reqInfo.transNo = transNo;
          reqInfo.transName = transName;
          reqInfo.hldrId = list[i].hldrId;
          reqInfo.billId = list[i].billId;
          reqInfo.billOrigin = list[i].billOrigin;
          reqInfo.transAmt = list[i].transAmt
          reqInfo.stdAmt = list[i].stdAmt;
          reqInfo.billRangeStart = list[i].billRangeStart;
          reqInfo.billRangeEnd = list[i].billRangeEnd;
          billInfo.id = list[i].billId;
          if (billInfo.extChnlData !== null && billInfo.extChnlData !== "") {
            if (typeof billInfo.extChnlData === 'string') {
              billInfo.extChnlData = JSON.parse(billInfo.extChnlData);
            }
          } else {
            billInfo.extChnlData = null;
          }
          reqInfo.billInfo = billInfo;
          if (transNo === "NES.011.20.00P" || transNo === "NES.011.20.01P" || transNo === "NES.011.20.03P") {
            let prsnttn = {};
            prsnttn.prsnttnDt = this.addOrEditForm.prsnttnDt.replace(/-/g, "");
            prsnttn.prsnttnAmt = this.addOrEditForm.prsnttnAmt.toString().replace(/,/g, "");
            prsnttn.sttlmMk = this.addOrEditForm.sttlmMk;
            prsnttn.overdueRsn = this.addOrEditForm.overdueRsn;
            reqInfo.rmrkByPropsr = this.addOrEditForm.prsnttnRemark;
            reqInfo.prsnttn = prsnttn;
          }else if (transNo === "NES.006.20.00P") {
            let endrsmtInfo = {};
            endrsmtInfo.endrsmtDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD").replace(/-/g, "");
            endrsmtInfo.endrseeName = this.endrsmtForm.endrseeName;
            endrsmtInfo.endrseeAcctNo = this.endrsmtForm.endrseeAcctNo;
            endrsmtInfo.endrseeBankNo = this.endrsmtForm.endrseeBankNo;
            endrsmtInfo.endrseeBankName = this.endrsmtForm.endrseeBankName;
            endrsmtInfo.endrseeAcctName = this.endrsmtForm.endrseeAcctName;
            endrsmtInfo.endrseeDistType = this.endrsmtForm.endrseeDistType;
            endrsmtInfo.endrseeMemberId = this.endrsmtForm.endrseeMemberId;
            if(this.endrsmtForm.banEndrsmtMark == "0"){
              endrsmtInfo.banEndrsmtMark = "EM01";
            } else if (this.endrsmtForm.banEndrsmtMark == "1"){
              endrsmtInfo.banEndrsmtMark = "EM00";
            }
            reqInfo.endrsmtInfo = endrsmtInfo;
            reqInfo.rmrkByPropsr = this.endrsmtForm.remark;
          }if (transNo === "NES.009.20.00P") {
            let impawnInfo = {};
            impawnInfo.impawnDt = this.pledgeForm.pledgeDt.replace(/-/g, "");
            impawnInfo.toName = this.pledgeForm.pledgeeName;
            impawnInfo.toAcctNo = this.pledgeForm.pawneeNo;
            impawnInfo.toBankNo = this.pledgeForm.pledgorBankNo;
            reqInfo.impawnInfo = impawnInfo;
          }if (transNo === "NES.010.20.00P") {
            let UnImpawnInfo = {};
            UnImpawnInfo.unImpawnDt = window.sessionStorage.getItem("workDate");
            reqInfo.UnImpawnInfo = UnImpawnInfo;
          }else if (transNo === "NES.007.20.00P"){
            let discInfo = {};
            discInfo.discType = this.discountForm.discType;
            discInfo.discRate = this.discountForm.discRate/100;
            // discInfo.discountFactor = this.discountForm.discountFactor;
            discInfo.discAmt = list[i].billMoney;
            discInfo.discDt = this.discountForm.discDt.replace(/-/g, "");
            discInfo.toBankName = this.discountForm.toBankName;
            discInfo.toBankNo = this.discountForm.toBankNo;
            discInfo.toAcctNo = this.discountForm.discInAcctNo;
            discInfo.aoAcctNo = this.discountForm.aoAcctNo;
            discInfo.aoAcctName = "1111";
            discInfo.aoBankNo = this.discountForm.aoAcctBankNo;
            discInfo.banEndrsmtMark = this.discountForm.banEndrsmtMark;
            discInfo.sttlmMk = this.discountForm.onlineSettleFlag;
            discInfo.discountRedemptionBeginDay = this.discountForm.discountRedemptionBeginDay;
            discInfo.discountRedemptionEndDay = this.discountForm.discountRedemptionEndDay;
            discInfo.discountRedemptionRate = this.discountForm.discountRedemptionRate;
            reqInfo.discInfo = discInfo;
          }else if (transNo === "NES.013.20.10P" || transNo === "NES.013.20.11P" || transNo === "NES.013.20.00P" || transNo === "NES.013.20.01P") {
            let rcrsAgreementInfo = {};
            rcrsAgreementInfo.rcrsDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYYMMDD");
            rcrsAgreementInfo.rcrsAmt = this.addOrEditFormAgreement.rcrsAmt;
            reqInfo.rmrkByPropsr = this.addOrEditFormAgreement.rmrkByPropsr;
            reqInfo.rcrsAgreementInfo = rcrsAgreementInfo;
          }
          reqInfoList.push(reqInfo);
        }
        requestDto.reqInfoList = reqInfoList;
        return requestDto;
      },
      handleValet(content, params, url) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          onOk: () => {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      overdueFlagChange() {
        this.isRequired = this.addOrEditForm.overdueFlag === "1";
      },

      handleWinCloseDisc() {
        this.addOrEditWinDisc = false;
        this.$refs.addOrEditFormDisc.resetFields();
      },
      submitFormDisc() {
        this.$refs["addOrEditFormDisc"].validate(valid => {
          if (valid) {
            let list = this.$refs.datagrid.selects;
            this.submitFlag = true;
            let url = "/bm/valetBusiness/valetApply/func_discApplyBillInfo";
            post({ billId: list[0].billId }, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.addOrEditWinDisc = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
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
      handleWinClose() {
        this.addOrEditWin = false;
        this.$refs.addOrEditForm.resetFields();
      },
      submitPledgeForm(){
        this.$refs["pledgeForm"].validate(valid => {
          if (valid) {
            let list = this.$refs.datagrid.selects;
            this.submitFlag = true;
            let params = this.initParams("NES.009.20.00P","质押申请");
            let url = "/bm/valetBusiness/valetApply/func_valetApplyBill";
            post({ code: JSON.stringify(params) }, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, { info: res.data.retMsg });
                  this.pledgeWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
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
      handleEcdsWinClose() {
        this.addForm.billNo = "";
        this.addForm.billId = "";
        this.addForm.hldrId =  "";
        this.addForm.cirStatus = "";
        this.addForm.isRecourse = "";
        this.addForm.recourseType = "";
        this.addForm.ownedBrchNo = "";
        this.addForm.billRangeStart = "";
        this.addForm.billRangeEnd = "";
        this.addForm.billMoney = "";
        this.addForm.hldrBrchNo = "";
        this.addForm.applyDt = this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD");
        this.showRecoursesEcds = false;
        this.showRecoursesCpes = false;
        this.formSearch();
      },
      pledgeWinClose() {
        this.pledgeWin = false;
        this.$refs.pledgeForm.resetFields();
      },
      discountWinClose() {
        this.discountWin = false;
        this.$refs.pledgeForm.resetFields();
      },
      //票交所机构弹窗
      queryCpesBranchCode(type) {
        this.cpesBranchType = type;
        this.showCpesBranchWin = true;
      },
      showCpesBranchClose() {
        this.showCpesBranchWin = false;
      },
      handlePledgeClose(){
        this.pledgeWin = false;
        this.$refs.pledgeForm.resetFields();
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.info("请先选择记录！");
          return;
        }
        if(this.cpesBranchType === "drwr"){
          this.pledgeForm.pledgorBankNo = info.transBrchBankNo;
          this.pledgeForm.pledgeeName = info.brchFullNameZh;
          this.pledgeForm.pawneeNo = "0";
        }
        if(this.cpesBranchType === "disc"){
          this.discountForm.toBankNo = info.transBrchBankNo;
          this.discountForm.toBankName = info.brchFullNameZh;
          this.discountForm.discInAcctNo = "0";
        }
        this.showCpesBranchClose();
      },
      handleDiscountClose(){
        this.discountWin = false;
        this.$refs.discountForm.resetFields();
      },
      //利息计算按钮
      interestCalculation() {
        if (this.discountForm.discType === "") {
          this.$msgTip.info(this, {info: "计算利息前请先选择贴现类型"});
          return;
        }
        if (this.discountForm.discRate === null || this.discountForm.discRate === "") {
          this.$msgTip.info(this, {info: "请先填写贴现利率"});
          return;
        }
        if(this.discountForm.discRate < 0 || this.discountForm.discRate >=100){
          this.$msgTip.info(this, {info: "贴现利率范围在0-100之间!"});
          return;
        }
        this.$loadingbox.open({
          title: "利息计算中，请稍后..."
        });
        let requestDto = {};
        let discBillInfoListDto = [];
        let list = this.discountForm.list;
        for(let i=0 ;i<list.length;i++) {
          let reqInfo = {};
          reqInfo.discId = list[i].billId;
          reqInfo.discRate = accDiv(this.discountForm.discRate, 100);
          reqInfo.galeDt = this.discountForm.discDt.replace(/-/g, "");
          discBillInfoListDto.push(reqInfo);
        }
        requestDto.discBillInfoListDto = discBillInfoListDto;
        let billPackageMoney = this.discountForm.billPackageMoney;
        post(requestDto, "/ce/disc/paper/apply/discApplyBatchMain/func_calculateDiscInterest").then(res => {
          this.$loadingbox.close();
          if (res) {
            this.$msgTip.success(this);
            billPackageMoney = billPackageMoney.replace(/,/g, "");
            this.discountForm.discountFactor = formatNumber(res.data, 2, ",");
            this.discountForm.saleReceiveAmt = formatNumber(accSub(billPackageMoney,res.data), 2, ",");
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      submitDiscountForm(){
        this.$refs["discountForm"].validate(valid => {
          if (valid) {
            let reqInfoList = [];
            let list = this.$refs.datagrid.selects[0];
            let discountInfo = {
              discType: this.discountForm.discType,
              discRate: accDiv(this.discountForm.discRate.replace(/,/g, ""), 100),
              discAmt: this.discountForm.saleReceiveAmt.replace(/,/g, ""),
              discDt: this.discountForm.discDt.replace(/-/g, ""),
              toBankName: this.discountForm.toBankName,
              toBankNo: this.discountForm.toBankNo,
              toAcctNo: this.discountForm.discInAcctNo,
              aoAcctNo: this.discountForm.aoAcctNo,
              aoAcctName: this.discountForm.aoAcctName,
              aoBankNo: this.discountForm.aoAcctBankNo,
              banEndrsmtMark: this.discountForm.banEndrsmtMark,
              sttlmMk: this.discountForm.onlineSettleFlag,
              redeemOpenDt: this.discountForm.discountRedemptionBeginDay.replace(/-/g, ""),
              redeemDueDt: this.discountForm.discountRedemptionEndDay.replace(/-/g, ""),
              redeemRate: this.discountForm.discountRedemptionRate.replace(/,/g, ""),
            }
            let reqInfo = {
              transNo: "NES.007.20.00P",
              hldrId: list.hldrId,
              billId: list.billId,
              transAmt: this.discountForm.billPackageMoney.replace(/,/g, ""),
              discInfo: discountInfo,
            };
            reqInfoList.push(reqInfo)
            let ebank2004From = {
              custNo: this.formItem.custNo,
              elctrncSgntr: "0",
              transNo: "NES.007.20.00P",
              applAcctNo: this.formItem.custAcctNo,
              reqInfoList: reqInfoList,
            }
            this.submitFlag = true;
            let url = "/bm/valetBusiness/valetApply/func_valetApplyBill";
            post({ code: JSON.stringify(ebank2004From) }, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, { info: res.data.retMsg });
                  this.discountWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
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
      discTypeChange() {
        if((this.discountForm.discType === 'RM01')){
          this.discountForm.discountRedemptionBeginDay = '';
          this.discountForm.discountRedemptionEndDay = '';
        }
      },
      submitForm() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let list = this.$refs.datagrid.selects;
            this.submitFlag = true;
            let transNo = "";
            let transName = "";
            if (this.addOrEditForm.overdueFlag === "0" && list[0].billStatus === "CS03") {
              transNo = "NES.011.20.00P";
              transName = "提前提示付款申请";
            } else if (this.addOrEditForm.overdueFlag === "0" && list[0].billStatus !== "CS03") {
              transNo = "NES.011.20.01P";
              transName = "到期提示付款申请";
            } else {
              transNo = "NES.011.20.03P";
              transName = "逾期提示付款申请";
            }
            let params = this.initParams(transNo,transName);
            let url = "/bm/valetBusiness/valetApply/func_valetApplyBill";
            post({ code: JSON.stringify(params) }, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, { info: res.data.retMsg });
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
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
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      brchNoChange(info) {
        this.endrsmtForm.endrseeBankNo = info.actorBrchBankNo;
        this.endrsmtForm.endrseeBankName = info.actorBrchName;
        this.showHvpsBankClose();
      },
      handleEndrsmtWinClose(){
        this.endrsmtWin = false;
        this.$refs.endrsmtForm.resetFields();
      },
      queryHvpsBank(){
        this.endrsmtBankNoWin = true;
      },
      clearVal(){
        this.endrsmtForm.endrseeBankNo = "";
        this.endrsmtForm.endrseeBankName = "";
      },
      showHvpsBankClose(){
        this.endrsmtBankNoWin = false;
      },
      submitEndrsmtForm(){
        this.$refs["endrsmtForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let transNo = "NES.006.20.00P";
            let params = this.initParams(transNo);
            let url = "/bm/valetBusiness/valetApply/func_valetApplyBill";
            post({ code: JSON.stringify(params) }, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, { info: res.data.retMsg });
                  this.handleEndrsmtWinClose();
                  this.phoneNo = "";
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
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
      handleWinCloseAgreement() {
        this.addOrEditWinAgreement = false;
        this.$refs.addOrEditFormAgreement.resetFields();
      },
      submitFormAgreement() {
        this.$refs["addOrEditFormAgreement"].validate(valid => {
          if (valid) {
            let list = this.$refs.datagrid.selects;
            this.submitFlag = true;
            let transNo = list[0].transNo;
            let transName = list[0].transName;
            let params = this.initParams(transNo, transName);
            let url = "/bm/valetBusiness/valetApply/func_valetApplyAgreement";
            post({code: JSON.stringify(params)}, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  if (res.data.retData[0].retCode !== "000000") {
                    this.$msgTip.error(this, {info: res.data.retData[0].retMsg});
                  } else {
                    this.$msgTip.info(this, {info: res.data.retMsg});
                  }
                  this.handleWinCloseAgreement();
                  this.phoneNo = "";
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
