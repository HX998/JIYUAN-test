<template>
  <!-- 票面信息 -->
  <h-msg-box v-model="tempAddBillWin" width="1050" height="480" class="h-form-search-layer" :maximize="true"
             :mask-closable="false"
             @on-close="handleClose" top="10">
    <p slot="header">
      <span>{{ $t("m.i.billInfo.billInfo") }}</span>
    </p>
    <div>
      <h-form :model="addOrEditForm" ref="addOrEditTopForm" :label-width="68" class="h-form-search" cols="2">
        <bill-type v-model="addOrEditForm.billType" :required="isRequired" :dictList="billTypeList" :readonly="true"
                   @onChange="changeBillType"></bill-type>
        <bill-origin v-model="addOrEditForm.billOrigin" :required="isRequired" :dictList="billOriginList" @on-change="changeBillOrigin"></bill-origin>
        <!--        <rgst-type :formObj = "addOrEditForm" :required="isRequired" :rgstTypeList="rgstTypeList" v-if="this.isOpenReserveRegister" @change="changeRgstType()"></rgst-type>-->
      </h-form>
      <h-form :model="addOrEditForm" ref="addOrEditForm" class="bill-info-table">

        <h-row type="flex" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.remitDt") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <remit-date :formItem="addOrEditForm"></remit-date>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label">{{ $t("m.i.billInfo.transCtrctNo") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="transCtrctNo" :validRules="transCtrctNoRule">
              <h-input v-model="addOrEditForm.transCtrctNo" :maxlength=40></h-input>
            </h-form-item>
          </h-col>
        </h-row>

        <h-row type="flex" align="top" v-if="this.ifAcptProtocalNo && this.ifShowPyeeBusinessAddress">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.acptProtocalNo") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <acpt-protocal-no :formItem="addOrEditForm" :required="this.ifAcptProtocalNo"></acpt-protocal-no>
          </h-col>
          <h-col span="5">
            <h-col span="8" class-name="info-item">
              <p class="label-multi-ebank">{{ $t("m.i.ce.recvMoney") }}</p>
            </h-col>
            <h-col span="16" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{ $t("m.i.makeBill.pyeeBusinessAddress") }}</p>
            </h-col>
          </h-col>
          <h-col span="7" class-name="info-item">
            <pyee-business-address :formItem="addOrEditForm"
                                   :required="this.ifShowPyeeBusinessAddress"></pyee-business-address>
          </h-col>
        </h-row>
        <h-row type="flex" align="top" v-else-if="this.ifShowPyeeBusinessAddress  && !this.ifAcptProtocalNo">
          <h-col span="12" class-name="info-item">
          </h-col>
          <h-col span="5">
            <h-col span="8" class-name="info-item">
              <p class="label-multi-ebank">{{ $t("m.i.ce.recvMoney") }}</p>
            </h-col>
            <h-col span="16" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{ $t("m.i.makeBill.pyeeBusinessAddress") }}</p>
            </h-col>
          </h-col>
          <h-col span="7" class-name="info-item">
            <pyee-business-address :formItem="addOrEditForm"
                                   :required="this.ifShowPyeeBusinessAddress"></pyee-business-address>
          </h-col>
        </h-row>
        <h-row type="flex" align="top" v-else-if="this.ifAcptProtocalNo  && !this.ifShowPyeeBusinessAddress">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.makeBill.acptProtocalNo") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <acpt-protocal-no :formItem="addOrEditForm" :required="this.ifAcptProtocalNo"></acpt-protocal-no>
          </h-col>
          <h-col span="12" class-name="info-item">
          </h-col>
        </h-row>

        <h-row type="flex" align="top">
          <h-col span="5">
            <h-col span="8" class-name="info-item">
              <p class="label-multi-ebank">{{ $t("m.i.ce.drwr") }}</p>
            </h-col>
            <h-col span="16">
              <h-col span="24" class-name="info-item" v-if="this.ifShowDraweeBusinessAddress">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.makeBill.addressName") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.ce.name") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.acctNo") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.acctName") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.openBankNo") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.openBankName") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.memberBrchName") }}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item" v-if="this.ifShowDraweeBusinessAddress">
              <province-city :formItem="addOrEditForm"></province-city>
            </h-col>
            <h-col span="24" class-name="info-item">
<!--              <drawer-name :formItem="addOrEditForm" :isDisabled="isDisabled"></drawer-name>-->
              <h-form-item prop="drwrName" required>
                <h-input v-model="addOrEditForm.drwrName" placeholder="" @on-change="handleDrwrNameChange"
                         :icon="'android-search'" @on-click="queryCustNo" readonly></h-input>
              </h-form-item>

            </h-col>
            <h-col span="24" class-name="info-item">
<!--              <drwr-acct-no :formItem="addOrEditForm" :isDisabled="isDisabled"></drwr-acct-no>-->
              <h-form-item prop="drwrAcctNo"  required>
                <h-input v-model="addOrEditForm.drwrAcctNo" placeholder=""
                         :icon="'android-search'" @on-click="queryCustAcct('drwr')"
                         readonly></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'" >
              <drwr-acct-name :formItem="addOrEditForm" :isReadonly="true" :required="true"></drwr-acct-name>
            </h-col>
            <h-col span="24" class-name="info-item">
              <!--              <drwr-bank-no :formItem="addOrEditForm" :isDisabled="isDisabled"-->
              <!--                            @showBankName="showBankName(addOrEditForm.drwrBankNo,'drwr', addOrEditForm.billOrigin)"></drwr-bank-no>-->
              <drwr-bank-no-two :formItem="addOrEditForm" v-if="addOrEditForm.billOrigin ==='CS01'"
                                @showBankName="showBankName(addOrEditForm.drwrBankNo,'drwr', addOrEditForm.billOrigin)"
                                :maxlength="12" clearable :title="addOrEditForm.drwrBankNo"
                                :androidSearchWin="false" @queryBankInfoForDrwr="queryBankInfoForDrwr"
                                @clearDrwrBankInfo="clearDrwrBankInfo" :isReadonly="true"></drwr-bank-no-two>
              <h-form-item prop="drwrBankNo" required>
                <h-input v-model="addOrEditForm.drwrBankNo" readonly v-if="addOrEditForm.billOrigin != 'CS01'"
                         :maxlength="12" clearable :title="addOrEditForm.drwrBankNo"
                          @on-click="queryBankInfoForDrwr"
                         @on-clear="clearDrwrBankInfo"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <drwr-bank-name :formItem="addOrEditForm" :isReadonly="true"></drwr-bank-name>
            </h-col>
            <h-col span="24" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
              <h-form-item prop="drwrMemberId" v-if="false" required>
                <h-input v-model="addOrEditForm.drwrMemberId" :maxlength="6"></h-input>
              </h-form-item>
              <h-form-item prop="drwrMemberName" required>
                <h-input v-model="addOrEditForm.drwrMemberName" readonly
                         :maxlength="60" :title="addOrEditForm.drwrMemberName"></h-input>
              </h-form-item>
              <h-form-item prop="drwrMemberType" v-if="false" required>
                <h-input v-model="addOrEditForm.drwrMemberType" :maxlength="6"></h-input>
              </h-form-item>
            </h-col>
          </h-col>
          <h-col span="5">
            <h-col span="8" class-name="info-item" v-if="!this.ifShowPyeeBusinessAddress">
              <p class="label-multi-ebank" :required="!this.ifShowPyeeBusinessAddress">{{ $t("m.i.ce.recvMoney") }}</p>
            </h-col>
            <h-col span="8" class-name="info-item" v-else="">
            </h-col>
            <h-col span="16">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.ce.name") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.acctNo") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.acctName") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.openBankNo") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.openBankName") }}</p>
              </h-col>
              <h-col span="24" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
                <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.memberBrchName") }}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <payee-name :formItem="addOrEditForm" @onBlur="onChange('pyeeName',addOrEditForm.pyeeName)"
                          :androidSearchWin="true" :showClearable="true"
                          @queryCommonRosterInfo="queryCommonRosterInfoForPyee"
                          @clearCommonRosterInfo="clearPyeeCommonRosterInfo"></payee-name>
            </h-col>
            <h-col span="24" class-name="info-item">
              <pyee-acct-no :formItem="addOrEditForm"
                            @onBlur="onChange('pyeeAcctNo',addOrEditForm.pyeeAcctNo)"></pyee-acct-no>
            </h-col>
            <h-col span="24" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
              <pyee-acct-name :formItem="addOrEditForm"></pyee-acct-name>
            </h-col>
            <h-col span="24" class-name="info-item">
              <pyee-bank-no-two :formItem="addOrEditForm" v-if="addOrEditForm.billOrigin ==='CS01'"
                                @showBankName="showBankName(addOrEditForm.pyeeBankNo,'pyee', addOrEditForm.billOrigin)"
                                :maxlength="12" clearable :title="addOrEditForm.pyeeBankNo"
                                :androidSearchWin="true" @queryBankInfoForPyee="queryBankInfoForPyee"
                                @clearPyeeBankInfo="clearPyeeBankInfo" :isReadonly="true"></pyee-bank-no-two>
              <h-form-item prop="pyeeBankNo" required>
                <h-input v-model="addOrEditForm.pyeeBankNo" readonly v-if="addOrEditForm.billOrigin != 'CS01'"
                         :maxlength="12" clearable :title="addOrEditForm.pyeeBankNo"
                         icon="android-search" @on-click="queryBankInfoForPyee"
                         @on-clear="clearPyeeBankInfo"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <pyee-bank-name :formItem="addOrEditForm" :isReadonly="true"></pyee-bank-name>
            </h-col>
            <h-col span="24" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
              <h-form-item prop="pyeeMemberId" v-if="false" required>
                <h-input v-model="addOrEditForm.pyeeMemberId" :maxlength="6"></h-input>
              </h-form-item>
              <h-form-item prop="pyeeMemberName" required>
                <h-input v-model="addOrEditForm.pyeeMemberName" readonly
                         :maxlength="60" clearable :title="addOrEditForm.pyeeMemberName"
                         @on-click="queryApplMemberNameForPyee()"
                         @on-clear="clearPyeeMemberName()"></h-input>
              </h-form-item>
              <h-form-item prop="pyeeMemberType" v-if="false" required>
                <h-input v-model="addOrEditForm.pyeeMemberType" :maxlength="6"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <!--              <h-form-item>-->
              <preservation-com-btn
                :formItem="addOrEditForm" :attrName="'isPreservationComRoster4Pyee'"
                @onChange="changePyeeCom($event,'')"></preservation-com-btn>
              <!--              </h-form-item>-->
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.billPackageNo") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <bill-no :formItem="addOrEditForm" v-model="addOrEditForm.billNo" :label=null :validRules="billNoRule" :required="true"></bill-no>
          </h-col>
          <h-col span="5" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.stdAmt") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
            <h-form-item prop="stdAmt" required>
              <h-input v-model="addOrEditForm.stdAmt" readonly :maxlength=125 :value="0.01"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.billPackageMoney") }}</p>
          </h-col>
          <h-col span="12" class-name="info-item">
            <span class="item-val" style="max-width:330px">{{ this.amountWords }}</span>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="billMoney" required>
              <h-typefield type="money" v-model="addOrEditForm.billMoney"
                           :placeholder="this.$t('m.i.ce.billMoneyPlaceholder')" bigTips
                           @on-blur="formatBillMoney" :nonNegative="true" divided></h-typefield>
            </h-form-item>
            <!--            <draw-bill-money :formItem = "addOrEditForm" @formatBillMoneyBlur="formatBillMoney('blur')" @formatBillMoneyFocus="formatBillMoney('focus')"></draw-bill-money>-->
          </h-col>
        </h-row>

        <h-row type="flex" align="top">

          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.dueDt") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <due-date :formItem="addOrEditForm"></due-date>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.banEndrsmtMark") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <ban-endrsmt-mark-two :formItem="addOrEditForm" style="padding-left:10px;"></ban-endrsmt-mark-two>
          </h-col>
        </h-row>
        <h-row type="flex" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.acptName") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <acceptor-name-two :formItem="addOrEditForm" @onBlur="onChange('acptName',addOrEditForm.acptName)"
                               :androidSearchWin="true" :showClearable="true"
                               @queryCommonRosterInfo="queryCommonRosterInfoForAcpt"
                               @clearCommonRosterInfo="clearAcptCommonRosterInfo" :isReadonly="true"></acceptor-name-two>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.acptAcctNo") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <acpt-acct-no :formItem="addOrEditForm"
                          @onBlur="onChange('acptAcctNo',addOrEditForm.acptAcctNo)" :isReadonly="true"></acpt-acct-no>
          </h-col>
          <h-col span="5" class-name="info-item"
                 v-if="addOrEditForm.billOrigin!='CS01' && addOrEditForm.billType === 'AC02'">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.ce.acptAcctName") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item"
                 v-if="addOrEditForm.billOrigin!='CS01' && addOrEditForm.billType === 'AC02'">
            <acpt-acct-name :formItem="addOrEditForm"></acpt-acct-name>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.acptBankNo") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <acpt-bank-no :formItem="addOrEditForm"
                          @showBankName="showBankName(addOrEditForm.acptBankNo,'acpt', addOrEditForm.billOrigin)"
                          v-if="addOrEditForm.billOrigin ==='CS01'"
                          :maxlength="12" :title="addOrEditForm.acptBankNo"
                          :androidSearchWin="true" @queryBankInfoForAcpt="queryBankInfoForAcpt"
                          :isReadonly="true"></acpt-bank-no>
            <h-form-item prop="acptBankNo" required>
              <h-input v-model="addOrEditForm.acptBankNo" readonly v-if="addOrEditForm.billOrigin != 'CS01'"
                       :maxlength="12" :title="addOrEditForm.acptBankNo"
                       @on-click="queryBankInfoForAcpt"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.acptBankName") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <acpt-bank-name-two :formItem="addOrEditForm" readonly></acpt-bank-name-two>
          </h-col>
          <h-col span="5" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.common.memberBrchName") }}</p>
          </h-col>
          <h-col span="7" class-name="info-item" v-if="addOrEditForm.billOrigin!='CS01'">
            <h-form-item prop="acptMemberId" v-if="false" required>
              <h-input v-model="addOrEditForm.acptMemberId" :maxlength="6"></h-input>
            </h-form-item>
            <h-form-item prop="acptMemberName" required>
              <h-input v-model="addOrEditForm.acptMemberName" readonly
                       :maxlength="60" clearable :title="addOrEditForm.acptMemberName"
                       v-if="addOrEditForm.billType == 'AC02'"
                       icon="android-search" @on-click="queryApplMemberNameForAcpt()"
                       @on-clear="clearAcptMemberName()"></h-input>
              <h-input v-model="addOrEditForm.acptMemberName" readonly
                       :maxlength="60" :title="addOrEditForm.acptMemberName"
                       v-if="addOrEditForm.billType != 'AC02'"
                       @on-clear="clearAcptMemberName()"></h-input>
            </h-form-item>
            <h-form-item prop="acptMemberType" v-if="false" required>
              <h-input v-model="addOrEditForm.acptMemberType" :maxlength="6"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item" v-if="addOrEditForm.billType==='AC02'">
          </h-col>
          <h-col span="7" class-name="info-item" v-if="addOrEditForm.billType==='AC02'">
            <preservation-com-btn
              :formItem="addOrEditForm" :attrName="'isPreservationComRoster4Acpt'"
              @onChange="changeAcptCom($event,'')"></preservation-com-btn>
          </h-col>
        </h-row>
        <h-row type="flex" align="top" v-if="addOrEditForm.billOrigin!='CS01'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{ $t("m.i.billInfo.isAllowSplitBill") }}</p>
          </h-col>
          <h-col span="19" class-name="info-item">
            <is-allow-split-bill :formItem="addOrEditForm"></is-allow-split-bill>
          </h-col>
        </h-row>
        <!--        <h-row type="flex" align="top" v-if="this.ifAutoType && $i18n.locale == 'zh-CN'">
                  <h-col span="5" class-name="info-item">
                    <p class="label">{{$t("m.i.makeBill.autoType")}}</p>
                  </h-col>
                  <h-col span="5">
                    <auto-type-acpt :isAcpt="isAcpt" :acptIsReadonly="acptIsReadonly" @autoAcpt="changeAcpt"></auto-type-acpt>
                  </h-col>
                  <h-col span="7">
                    <auto-type-take :isTake="isTake" @autoTake="changeTake"></auto-type-take>
                  </h-col>
                  <h-col span="7">
                    <auto-type-rgst :isRgst="isRgst" :rgstIsReadonly="rgstIsReadonly" @autoRgst="changeRgst"></auto-type-rgst>
                  </h-col>
                </h-row>-->
        <!--        <h-row type="flex" align="top" v-if="this.ifAutoType && $i18n.locale == 'en-US'" class="h-row-en">
                  <h-col span="5" class-name="info-item">
                    <p class="label1">{{$t("m.i.makeBill.autoType")}}</p>
                  </h-col>
                  <h-col span="19">
                    <h-row>
                      <h-col span="12">
                        <auto-type-acpt :isAcpt="isAcpt" :acptIsReadonly="acptIsReadonly" @autoAcpt="changeAcpt"></auto-type-acpt>
                      </h-col>
                      <h-col span="12">
                        <auto-type-take :isTake="isTake" @autoTake="changeTake"></auto-type-take>
                      </h-col>
                    </h-row>
                    <h-row>
                      <h-col span="24">
                        <auto-type-rgst :isRgst="isRgst" :rgstIsReadonly="rgstIsReadonly" @autoRgst="changeRgst"></auto-type-rgst>
                      </h-col>
                    </h-row>
                  </h-col>
                </h-row>-->
      </h-form>
      <!-- 查询会员代码 -->
      <member-id-search :memberIdWin="showCpesMemberWinForDrwr" @memberIdWinClose="memberIdWinCloseForDrwr"
                        @memberIdWinSubmit="memberIdWinSubmitForDrwr" :z-index="1200"></member-id-search>
      <member-id-search :memberIdWin="showCpesMemberWinForPyee" @memberIdWinClose="memberIdWinCloseForPyee"
                        @memberIdWinSubmit="memberIdWinSubmitForPyee" :ownMemberId="this.pyeeMemberId"
                        :ownMemberName="this.pyeeMemberName" :z-index="1200"></member-id-search>
      <member-id-search :memberIdWin="showCpesMemberWinForAcpt" @memberIdWinClose="memberIdWinCloseForAcpt"
                        @memberIdWinSubmit="memberIdWinSubmitForAcpt" :ownMemberId="this.acptMemberId"
                        :ownMemberName="this.acptMemberName" :z-index="1200"></member-id-search>
      <!-- 查询支付行信息 -->
      <bank-search :bankWin="showBankWin" @bankWinClose="bankWinClose"
                   @bankWinSubmit="bankWinSubmit" :z-index="1200"></bank-search>
      <!-- 查询常用人名册-->
      <common-roster-search :params="this.comRosterParams" :commonRosterWin="showCommonRosterWin"
                            @commonRosterWinClose="commonRosterWinClose"
                            @commonRosterWinSubmit="commonRosterWinSubmit" :z-index="1200"></common-roster-search>
      <show-cust-message :showCustMessageWin="showCustInfoWin" @custCorpWinClose="custCorpWinClose"
                         @custCorpSelectSubmit="custCorpSelectSubmit" ref="showCustInfo"></show-cust-message>
      <show-cust-acct-no :showCustAcctNoWin="showCustAcctWin" :custNo="this.addOrEditForm.drwrCustNo"
                         :isAllOtherBankAcct="this.isAllOtherBankAcct" :custAcctKind="this.custAcctKind"
                         :busiOwnBrchNo="this.busiOwnBrchNo" @showCustAcctNoWinClose="showCustAcctWinClose"
                         @custAcctNoSelectSubmit="custAcctSelectSubmit" ref="showCustAcct"></show-cust-acct-no>
    </div>
    <div slot="footer">
      <close-btn @close="handleClose"></close-btn>
      <commit-btn @commit="submitForm" :checkform="addOrEditForm" :check-ref="checkRef"></commit-btn>
    </div>
  </h-msg-box>
</template>

<script>
import {
  post,
  on,
  off,
  formatNumber,
  cmycurd,
  getDictListByGroups
}
  from "@/api/bizApi/commonUtil";
import BanEndrsmtMarkTwo from "../../../../../../components/bemp/button/banEndrsmtMarkTwo";
import BankSearch from "../../../../../../components/bemp/input/bankSearch";
import PyeeAcctName from "../../../../../../components/bemp/input/pyeeAcctName";
import AcptBankNameTwo from "../../../../../../components/bemp/input/acptBankNameTwo";
import AcceptorNameTwo from "../../../../../../components/bemp/input/acceptorNameTwo";
import MemberIdSearch from "../../../../sm/auth/legalperson/memberIdSearch";
import PyeeBankNoTwo from "../../../../../../components/bemp/input/pyeeBankNoTwo";
import DrwrBankNoTwo from "../../../../../../components/bemp/input/drwrBankNoTwo";
import DrwrAcctName from "../../../../../../components/bemp/input/drwrAcctName";
import IsAllowSplitBill from "../../../../../../components/bemp/button/isAllowSplitBill";
import PyeeBankName from "../../../../../../components/bemp/input/pyeeBankName";
// import BankSearch from "../../../components/bemp/input/bankSearch";
// import CommonRosterSearch from "../../../components/commonroster/commonRosterSearch";
// import PreservationComBtn from "../../../components/commonroster/preservationComBtn";

export default {
  name: "billMainAddOrEditWin",
  components: {
    PyeeBankName,
    IsAllowSplitBill,
    DrwrAcctName,
    DrwrBankNoTwo,
    PyeeBankNoTwo,
    MemberIdSearch,
    AcceptorNameTwo,
    AcptBankNameTwo,
    PyeeAcctName,
    BankSearch,
    BanEndrsmtMarkTwo,
    ShowHvpsBank: () => import(/* webpackChunkName: "shcpe/cpes/hvpsbank/showHvpsBank" */`@/views/bizViews/shcpe/cpes/hvpsbank/showHvpsBank`)
  },
  // components: {PreservationComBtn, CommonRosterSearch, BankSearch},
  data() {


    return {
      rgstIsReadonly: false,
      acptIsReadonly: false,
      isDisabled: false,
      isAcpt: false,
      isTake: false,
      isRgst: false,
      isAddress: false,
      showHvpsBank: false,
      showCustInfoWin: false,
      showCustAcctWin: false,
      signStatus: "",
      cpesSignStatus: "",
      checkRef: null,
      addOrEditForm: {
        id: "",
        billId: "",
        billType: "AC01",
        billClass: "ME02",
        remitDt: window.sessionStorage.getItem("workDate"),
        billNo: "",
        billRangeStart: "",
        billRangeEnd: "",
        drwrName: "",
        drwrCustNo:"",
        drwrAcctNo: "",
        drwrAcctName: "",
        drwrBankNo: "",
        drwrBankName: "",
        drwrMemberId: "",
        drwrMemberName: "",
        drwrMemberType: "",
        pyeeName: "",
        pyeeAcctNo: "",
        pyeeAcctName: "",
        pyeeBankNo: "",
        pyeeBankName: "",
        pyeeMemberId: "",
        pyeeMemberName: "",
        pyeeMemberType: "",
        pyeeBusinessAddress: "",
        billMoney: "",
        dueDt: "",
        acptName: "",
        acptAcctNo: "0",
        acptAcctName: "",
        acptBankNo: "",
        acptBankName: "",
        acptMemberId: "",
        acptMemberName: "",
        acptMemberType: "",
        transCtrctNo: "",
        acptProtocalNo: "",
        banEndrsmtMark: "EM00",
        drwrAutoType: "AT04",
        billOrigin: "CS02",
        stdAmt: "0.01",
        isAllowSplitBill: "1",
        draweeBusinessAddress: "",
        draweeBusinessAddressArr: [],
        rgstType: "RT00",
        isPreservationComRoster4Pyee: false,
        isPreservationComRoster4Acpt: false,
      },
      comRosterParams: {
        billType: "",
        bankType: "",
        billOrigin: "",
      },
      billTypeList: [],
      rgstTypeList: [],
      billOriginList: [{key: "CS01", value: "ECDS"}, {key: "CS02", value: "金融机构"}],
      dictMap: new Map(),
      amountWords: "",
      isRequired: true,
      ifAcptProtocalNo: false,
      ifShowPyeeBusinessAddress: false,
      ifShowDraweeBusinessAddress: false,
      draweeBusinessAddress: "",
      isOpenReserveRegister: false,
      ifAutoType: true,
      ifAutoQueryPyeeInfo: false,
      //会员弹出框
      showCpesMemberWinForDrwr: false,
      showCpesMemberWinForAcpt: false,
      showCpesMemberWinForPyee: false,
      showBankWin: false,
      showCommonRosterWin: false,
      drwrMemberId: "",
      pyeeMemberId: "",
      pyeeMemberName: "",
      acptMemberId: "",
      acptMemberName: "",
      bankType: "",
      transCtrctNoRule: [{test: this.validTransCtrctNo, trigger: "blur"}],
      billNoRule : [{ test: /^\d{0,30}$/, trigger: "blur", message: "请输入不超过30位的数字" }],


    }
  },
  props: {
    addOrEditWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    params: {
      billOptType: "",
      selectRowList: [],
      ifAcptProtocalNo: false,
      ifShowPyeeBusinessAddress: false,
      ifShowDraweeBusinessAddress: false,
      draweeBusinessAddress: "",
      draweeBusinessAddressArr: [],
      ifAutoType: true,
      ifAutoQueryPyeeInfo: false,
      isPreservationComRoster4Pyee: false,
      isPreservationComRoster4Acpt: false,
    }
  },
  watch: {
    addOrEditWin(val) {
      this.getDictInfo();
      this.$refs.addOrEditForm.resetFields();
      this.$refs.addOrEditTopForm.resetFields();
      if (val === true) {
        this.ifAcptProtocalNo = this.params.ifAcptProtocalNo;
        this.ifShowPyeeBusinessAddress = this.params.ifShowPyeeBusinessAddress;
        this.ifShowDraweeBusinessAddress = this.params.ifShowDraweeBusinessAddress;
        this.isOpenReserveRegister = this.params.isOpenReserveRegister;
        this.draweeBusinessAddress = this.params.draweeBusinessAddress;
        this.addOrEditForm.draweeBusinessAddressArr = this.params.draweeBusinessAddressArr;
        this.pyeeBusinessAddress = this.params.pyeeBusinessAddress;
        this.addOrEditForm.pyeeBusinessAddress = this.params.pyeeBusinessAddress;
        this.addOrEditForm.isPreservationComRoster4Pyee = this.params.isPreservationComRoster4Pyee;
        this.addOrEditForm.isPreservationComRoster4Acpt = this.params.isPreservationComRoster4Acpt;
        this.ifAutoType = this.params.ifAutoType;
        this.ifAutoQueryPyeeInfo = this.params.ifAutoQueryPyeeInfo;
        this.initBillInfo("");
        this.amountWords = "";
        if (this.params.billOptType === "modify") {
          this.copyBillInfo(this.params.selectRowList);
          this.isDisabled = true;
        }
        if (this.params.billOptType === "add") {
          this.isAcpt = false;
          this.isTake = false;
          this.isRgst = false;
          this.isDisabled = true;
          this.addOrEditForm.remitDt = window.sessionStorage.getItem("workDate");
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          this.signStatus = userInfo.signStatus;
          this.cpesSignStatus = userInfo.cpesSignStatus;
          this.addOrEditForm.drwrName = userInfo.custName;
          this.addOrEditForm.drwrAcctNo = userInfo.acctNo;
          this.addOrEditForm.drwrAcctName = userInfo.acctName;
          this.addOrEditForm.drwrBankNo = userInfo.openBankNo;
          this.addOrEditForm.drwrBankName = userInfo.openBankName;
          if (this.signStatus == "1" && this.cpesSignStatus != "1") {
            this.addOrEditForm.billOrigin = "CS01";
            this.billOriginList = [{key: "CS01", value: "ECDS"}];
          } else if (this.cpesSignStatus == "1" && this.signStatus != "1") {
            this.addOrEditForm.billOrigin = "CS02";
            this.billOriginList = [{key: "CS02", value: "金融机构"}];
          } else {
            this.addOrEditForm.billOrigin = "CS02";
            this.billOriginList = [{key: "CS01", value: "ECDS"}, {key: "CS02", value: "金融机构"}];
          }
/*          if (this.addOrEditForm.billOrigin == 'CS02' || this.addOrEditForm.billOrigin == 'CS03') {
            this.addOrEditForm.drwrBankNo = userInfo.signBankNo;
            post({bankNo: userInfo.signBankNo}, "/ce/channel/ebank/func_queryCpesBankInfo").then(res => {
              if (res && res.data.retCode === '000000') {
                this.addOrEditForm.drwrBankName = res.data.retData.transBrchBankName;
                this.addOrEditForm.drwrMemberId = res.data.retData.memberId;
                this.drwrMemberId = res.data.retData.memberId;
                this.addOrEditForm.drwrMemberName = res.data.retData.memberName;
              } else {
                this.addOrEditForm.drwrBankName = "";
                this.addOrEditForm.drwrMemberId = "";
                this.addOrEditForm.drwrMemberName = "";
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            });
          }*/
        }
      }
    }
  },
  computed: {
    tempAddBillWin: {
      get() {
        return this.addOrEditWin;
      },
      set() {
      }
    },
  },

  methods: {
    clearDrwrMemberName() {
      this.addOrEditForm.drwrMemberId = "";
      this.addOrEditForm.drwrMemberName = "";
    },
    clearPyeeMemberName() {
      this.addOrEditForm.pyeeMemberId = "";
      this.addOrEditForm.pyeeMemberName = "";
    },
    clearAcptMemberName() {
      this.addOrEditForm.acptMemberId = "";
      this.addOrEditForm.acptMemberName = "";
    },
    clearPyeeCommonRosterInfo() {
      this.addOrEditForm.pyeeName = "";
    },
    clearAcptCommonRosterInfo() {
      this.addOrEditForm.acptName = "";
      this.addOrEditForm.acptBankNo = "";
      this.addOrEditForm.acptBankName = "";
      this.addOrEditForm.acptMemberId = "";
      this.addOrEditForm.acptMemberName = "";
      this.addOrEditForm.acptMemberType = "";
    },
    clearPyeeBankInfo() {
      this.addOrEditForm.pyeeBankNo = "";
      this.addOrEditForm.pyeeBankName = "";
    },
    clearAcptBankInfo() {
      this.addOrEditForm.acptBankNo = "";
      this.addOrEditForm.acptBankName = "";
    },
    clearDrwrBankInfo() {
      this.addOrEditForm.drwrBankNo = "";
      this.addOrEditForm.drwrBankName = "";
    },
    changePyeeCom($event, parameter) {
      this.addOrEditForm.isPreservationComRoster4Pyee = $event;
    },
    changeAcptCom($event, parameter) {
      this.addOrEditForm.isPreservationComRoster4Acpt = $event;
    },
    //查询会员名称
    queryApplMemberNameForDrwr() {
      this.showCpesMemberWinForDrwr = true;
    },
    queryApplMemberNameForPyee() {
      this.showCpesMemberWinForPyee = true;
    },
    queryApplMemberNameForAcpt() {
      this.showCpesMemberWinForAcpt = true;
    },
    memberIdWinCloseForDrwr() {
      this.showCpesMemberWinForDrwr = false;
    },
    memberIdWinCloseForPyee() {
      this.showCpesMemberWinForPyee = false;
    },
    memberIdWinCloseForAcpt() {
      this.showCpesMemberWinForAcpt = false;
    },
    bankWinClose() {
      this.showBankWin = false;
      this.bankType = '';
    },
    queryBankInfoForPyee() {
      this.showBankWin = true;
      this.bankType = 'pyee';
    },
    queryBankInfoForAcpt() {
      this.showBankWin = true;
      this.bankType = 'acpt';
    },
    queryBankInfoForDrwr() {
      this.showBankWin = true;
      this.bankType = 'drwr';
    },
    queryCommonRosterInfoForPyee() {
      this.comRosterParams.bankType = 'pyee';
      this.comRosterParams.billType = this.addOrEditForm.billType;
      this.comRosterParams.billOrigin = this.addOrEditForm.billOrigin;
      this.showCommonRosterWin = true;
      this.bankType = 'pyee';
    },
    queryCommonRosterInfoForAcpt() {
      this.comRosterParams.bankType = 'acpt';
      if (this.addOrEditForm.billType === 'AC01') {
        this.comRosterParams.billType = this.addOrEditForm.billType;
        this.comRosterParams.billOrigin = this.addOrEditForm.billOrigin;
        this.showBankWin = true;
      } else {
        this.showCommonRosterWin = true;
      }
      this.bankType = 'acpt';
    },
    commonRosterWinClose() {
      this.showCommonRosterWin = false;
      this.bankType = '';
    },
    //根据弹框所选数据进行赋值
    memberIdWinSubmitForDrwr(info) {
      if (info === null) {
        // this.$msgTip.info(this, { info: "请先选择记录!" });
        this.$msgTip.info(this, {info: this.$t('m.i.makeBill.msg.info2')});
        return;
      }
      this.addOrEditForm.drwrMemberId = info.memberId;
      this.addOrEditForm.drwrMemberName = info.memberName;
      this.addOrEditForm.drwrMemberType = info.memberTypeCode;
      this.showCpesMemberWinForDrwr = false;
    },
    //根据弹框所选数据进行赋值
    memberIdWinSubmitForPyee(info) {
      if (info === null) {
        // this.$msgTip.info(this, { info: "请先选择记录!" });
        this.$msgTip.info(this, {info: this.$t('m.i.makeBill.msg.info2')});
        return;
      }
      this.addOrEditForm.pyeeMemberId = info.memberId;
      this.addOrEditForm.pyeeMemberName = info.memberName;
      this.addOrEditForm.pyeeMemberType = info.memberTypeCode;
      this.showCpesMemberWinForPyee = false;
    },
    //根据弹框所选数据进行赋值
    memberIdWinSubmitForAcpt(info) {
      if (info === null) {
        // this.$msgTip.info(this, { info: "请先选择记录!" });
        this.$msgTip.info(this, {info: this.$t('m.i.makeBill.msg.info2')});
        return;
      }
      this.addOrEditForm.acptMemberId = info.memberId;
      this.addOrEditForm.acptMemberName = info.memberName;
      this.addOrEditForm.acptMemberType = info.memberTypeCode;
      this.showCpesMemberWinForAcpt = false;
    },
    bankWinSubmit(info) {
      if (info === null) {
        // this.$msgTip.info(this, { info: "请先选择记录!" });
        this.$msgTip.info(this, {info: this.$t('m.i.makeBill.msg.info2')});
        return;
      }
      this.showBankWin = false;
      if (this.bankType === 'drwr') {
        this.addOrEditForm.drwrBankNo = info.actorBrchBankNo;
        this.addOrEditForm.drwrBankName = info.actorBrchName;
      }
      if (this.bankType === 'pyee') {
        this.addOrEditForm.pyeeBankNo = info.actorBrchBankNo;
        this.addOrEditForm.pyeeBankName = info.actorBrchName;
      }
      if (this.bankType === 'acpt') {
        this.addOrEditForm.acptBankNo = info.actorBrchBankNo;
        this.addOrEditForm.acptBankName = info.actorBrchName;
        if (this.addOrEditForm.billType === "AC01") {
          this.addOrEditForm.acptName = info.actorBrchName;
        }
      }
      post({bankNo: info.actorBrchBankNo}, "/ce/channel/ebank/func_queryCpesBankInfo").then(res => {
        if (res && res.data.retCode === '000000') {
          if (this.bankType === 'pyee') {
            this.addOrEditForm.pyeeMemberId = res.data.retData.memberId;
            this.pyeeMemberId = res.data.retData.memberId;
            this.pyeeMemberName = res.data.retData.memberName;
            this.addOrEditForm.pyeeMemberName = res.data.retData.memberName;
            this.addOrEditForm.pyeeMemberType = res.data.retData.memberTypeCode;
          } else if (this.bankType === 'acpt') {
            this.addOrEditForm.acptMemberId = res.data.retData.memberId;
            this.acptMemberId = res.data.retData.memberId;
            this.acptMemberName = res.data.retData.memberName;
            this.addOrEditForm.acptMemberName = res.data.retData.memberName;
            this.addOrEditForm.acptMemberType = res.data.retData.memberTypeCode;
          } else if (this.bankType === 'drwr') {
            this.addOrEditForm.drwrMemberId = res.data.retData.memberId;
            this.drwrMemberId = res.data.retData.memberId;
            this.drwrMemberName = res.data.retData.memberName;
            this.addOrEditForm.drwrMemberName = res.data.retData.memberName;
            this.addOrEditForm.drwrMemberType = res.data.retData.memberTypeCode;
          }
        } else {
          if (this.bankType === 'pyee') {
            this.addOrEditForm.pyeeBankNo = "";
            this.addOrEditForm.pyeeBankName = "";
            this.addOrEditForm.pyeeMemberId = "";
            this.addOrEditForm.pyeeMemberName = "";
            this.addOrEditForm.pyeeMemberType = "";
          } else if (this.bankType === 'acpt') {
            this.addOrEditForm.acptBankNo = "";
            this.addOrEditForm.acptBankName = "";
            this.addOrEditForm.acptMemberId = "";
            this.addOrEditForm.acptMemberName = "";
            this.addOrEditForm.acptMemberType = "";
          } else if (this.bankType === 'drwr') {
            this.addOrEditForm.drwrBankNo = "";
            this.addOrEditForm.drwrBankName = "";
            this.addOrEditForm.drwrMemberId = "";
            this.addOrEditForm.drwrMemberName = "";
            this.addOrEditForm.drwrMemberType = "";
          }
          this.$msgTip.error(this, {info: res.data.retMsg});
        }
      });
    },
    commonRosterWinSubmit(info) {
      if (info === null) {
        // this.$msgTip.info(this, { info: "请先选择记录!" });
        this.$msgTip.info(this, {info: this.$t('m.i.makeBill.msg.info2')});
        return;
      }
      this.showCommonRosterWin = false;
      if (this.bankType === 'pyee') {
        this.addOrEditForm.pyeeName = info.name;
        this.addOrEditForm.pyeeAcctNo = info.acctNo;
        this.addOrEditForm.pyeeAcctName = info.acctName;
        this.addOrEditForm.pyeeBankNo = info.openBankNo;
        this.addOrEditForm.pyeeBankName = info.openBankName;
        this.addOrEditForm.pyeeMemberId = info.memberId;
        this.pyeeMemberId = info.memberId;
        this.addOrEditForm.pyeeMemberName = info.memberName;
      } else if (this.bankType === 'acpt') {
        this.addOrEditForm.acptName = info.name;
        this.addOrEditForm.acptAcctNo = info.acctNo;
        this.addOrEditForm.acptAcctName = info.acctName;
        this.addOrEditForm.acptBankNo = info.openBankNo;
        this.addOrEditForm.acptBankName = info.openBankName;
        this.addOrEditForm.acptMemberId = info.memberId;
        this.acptMemberId = info.memberId;
        this.addOrEditForm.acptMemberName = info.memberName;
      }
      this.bankType = '';

    },
    changeBillType() {
      if (this.addOrEditForm.billType === "AC01") {
        this.addOrEditForm.isPreservationComRoster4Acpt = false;
        if (this.params.billOptType === "add") {
          this.addOrEditForm.acptAcctNo = "0";
        }
      } else if (this.addOrEditForm.billType === "AC02") {
        if (this.params.billOptType === "add") {
          this.addOrEditForm.acptAcctNo = "";
        }
      }
    },
    changeBillOrigin() {
      if (this.addOrEditForm.billOrigin === "CS01") {
        // this.addOrEditForm.drwrAcctName = "";
      }
    },
    changeRgstType() {
      if (this.addOrEditForm.rgstType === "RT01") {
        this.isAcpt = true;
        this.isTake = false;
        this.isRgst = true;
        this.acptIsReadonly = true;
        this.rgstIsReadonly = true;
      } else if (this.addOrEditForm.rgstType === "RT00") {
        this.isAcpt = false;
        this.isTake = false;
        this.isRgst = false;
        this.acptIsReadonly = false;
        this.rgstIsReadonly = false;
      }
    },
    getDictInfo() {
      getDictListByGroups("DraftTypeCode,RgstType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.rgstTypeList = res.get("RgstType");
        this.dictMap = res.get("map");
      });
    },
    showBankName(bankNo, type, billOrigin) {
      if (bankNo.length < 12) {
        return;
      }
      if (billOrigin == 'CS01') {
        post({code: bankNo}, "/ce/channel/ebank/func_queryEcdsBankName").then(res => {
          if (res && res.data.retCode === '000000') {
            if (type === 'drwr') {
              this.addOrEditForm.drwrBankName = res.data.retData;
            } else if (type === 'pyee') {
              this.addOrEditForm.pyeeBankName = res.data.retData;
            } else if (type === 'acpt') {
              this.addOrEditForm.acptBankName = res.data.retData;
            }
          } else {
            if (type === 'drwr') {
              this.addOrEditForm.drwrBankName = "";
            } else if (type === 'pyee') {
              this.addOrEditForm.pyeeBankName = "";
            } else if (type === 'acpt') {
              this.addOrEditForm.acptBankName = "";
            }
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        });
      }
      if (billOrigin == 'CS02' || billOrigin == 'CS03') {
        post({bankNo: bankNo}, "/ce/channel/ebank/func_queryCpesBankInfo").then(res => {
          if (res && res.data.retCode === '000000') {
            if (type === 'drwr') {
              this.addOrEditForm.drwrBankName = res.data.retData.transBrchBankName;
              this.addOrEditForm.drwrMemberId = res.data.retData.memberId;
              this.drwrMemberId = res.data.retData.memberId;
              this.addOrEditForm.drwrMemberName = res.data.retData.memberName;
              this.addOrEditForm.drwrMemberType = res.data.retData.memberTypeCode;
            } else if (type === 'pyee') {
              this.addOrEditForm.pyeeBankName = res.data.retData.transBrchBankName;
              this.addOrEditForm.pyeeMemberId = res.data.retData.memberId;
              this.pyeeMemberId = res.data.retData.memberId;
              this.pyeeMemberName = res.data.retData.memberName;
              this.addOrEditForm.pyeeMemberName = res.data.retData.memberName;
              this.addOrEditForm.pyeeMemberType = res.data.retData.memberTypeCode;
            } else if (type === 'acpt') {
              this.addOrEditForm.acptBankName = res.data.retData.transBrchBankName;
              this.addOrEditForm.acptMemberId = res.data.retData.memberId;
              this.acptMemberId = res.data.retData.memberId;
              this.acptMemberName = res.data.retData.memberName;
              this.addOrEditForm.acptMemberName = res.data.retData.memberName;
              this.addOrEditForm.acptMemberType = res.data.retData.memberTypeCode;
            }
          } else {
            if (type === 'drwr') {
              this.addOrEditForm.drwrBankName = "";
              this.addOrEditForm.drwrMemberId = "";
              this.addOrEditForm.drwrMemberName = "";
              this.addOrEditForm.drwrMemberType = "";
            } else if (type === 'pyee') {
              this.addOrEditForm.pyeeBankName = "";
              this.addOrEditForm.pyeeMemberId = "";
              this.addOrEditForm.pyeeMemberName = "";
              this.addOrEditForm.pyeeMemberType = "";
            } else if (type === 'acpt') {
              this.addOrEditForm.acptBankName = "";
              this.addOrEditForm.acptMemberId = "";
              this.addOrEditForm.acptMemberName = "";
              this.addOrEditForm.acptMemberType = "";
            }
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        });
      }
    },
    onChange(type, val) {
      let flag = true;
      if (type === 'pyeeName') {
        if (this.addOrEditForm.acptName && this.addOrEditForm.acptName === val) {
          // this.$msgTip.error(this, {info: "“收款人”信息和“承兑人”信息不能一致"});
          this.$msgTip.error(this, {info: this.$t('m.i.makeBill.msg.error3')});
          this.addOrEditForm.pyeeName = '';
          return;
        }
        if (this.ifAutoQueryPyeeInfo) {
          post({code: this.addOrEditForm.pyeeName}, "/makeBill/billMain/func_queryPyeeInfo").then(res => {
            if (res && res.data.retCode === '000000') {
              this.addOrEditForm.pyeeAcctNo = res.data.retData.pyeeAcctNo;
              this.addOrEditForm.pyeeBankName = res.data.retData.pyeeBankName;
              this.addOrEditForm.pyeeBankNo = res.data.retData.pyeeBankNo;
            }
          });
        }
      } else if (type === 'pyeeAcctNo') {
        if (this.addOrEditForm.acptAcctNo && this.addOrEditForm.acptAcctNo === val) {
          this.addOrEditForm.pyeeAcctNo = '';
          flag = false;
        }
      } else if (type === 'acptName') {
        if (this.addOrEditForm.pyeeName && this.addOrEditForm.pyeeName === val) {
          this.addOrEditForm.acptName = '';
          flag = false;
        }
      } else if (type === 'acptAcctNo') {
        if (this.addOrEditForm.pyeeAcctNo && this.addOrEditForm.pyeeAcctNo === val) {
          this.addOrEditForm.acptAcctNo = '';
          flag = false;
        }
      }
      if (!flag) {
        // this.$msgTip.error(this, {info: "“收款人”信息和“承兑人”信息不能一致"});
        this.$msgTip.error(this, {info: this.$t('m.i.makeBill.msg.error3')});
        return;
      }
    },
    formatBillMoney() {
      if (!isNaN(parseFloat(this.addOrEditForm.billMoney)) && isFinite(this.addOrEditForm.billMoney)) {
        if (parseFloat(this.addOrEditForm.billMoney) === 0) {
          // this.$msgTip.error(this, {info: "票据(包)金额不能为0元"});
          this.$msgTip.error(this, {info: this.$t('m.i.makeBill.msg.error4')});
          this.addOrEditForm.billMoney = '';
          return;
        }
        if (parseFloat(this.addOrEditForm.billMoney) >= 1000000000) {
          // this.$msgTip.error(this, {info: "票据(包)金额不能大于等于票据最大金额[1,000,000,000]元"});
          this.$msgTip.error(this, {info: this.$t('m.i.makeBill.msg.error5')});
          this.addOrEditForm.billMoney = '';
          return;
        }
        this.amountWords = cmycurd(this.addOrEditForm.billMoney);
      }
    },
    changeAcpt() {
      this.isAcpt = !this.isAcpt;
    },
    changeTake() {
      this.isTake = !this.isTake;
    },
    changeRgst() {
      this.isRgst = !this.isRgst;
    },
    handleClose() {
      this.drwrMemberId = "";
      this.drwrMemberName = "";
      this.pyeeMemberId = "";
      this.pyeeMemberName = "";
      this.acptMemberId = "";
      this.acptMemberName = "";
      this.addOrEditForm.billNo = "";
      this.$refs.addOrEditForm.resetFields();
      this.$refs.addOrEditTopForm.resetFields();
      this.$emit("addOrEditWinClose", "");
    },
    submitForm() {
      this.$refs["addOrEditForm"].validate(valid => {
        if (valid) {
          if (this.addOrEditForm.billType === "") {
            return;
          }
          if (this.isAcpt === false && this.isTake === false && this.isRgst === false) {
            this.addOrEditForm.drwrAutoType = "AT00";
          }
          if (this.isAcpt === false && this.isTake === false && this.isRgst === true) {
            this.addOrEditForm.drwrAutoType = "AT01";
          }
          if (this.isAcpt === true && this.isTake === false && this.isRgst === true) {
            this.addOrEditForm.drwrAutoType = "AT02";
          }
          if (this.isAcpt === false && this.isTake === true && this.isRgst === true) {
            this.addOrEditForm.drwrAutoType = "AT03";
          }
          if (this.isAcpt === true && this.isTake === true && this.isRgst === true) {
            this.addOrEditForm.drwrAutoType = "AT04";
          }
          if (this.isAcpt === true && this.isTake === false && this.isRgst === false) {
            this.addOrEditForm.drwrAutoType = "AT05";
          }
          if (this.isAcpt === true && this.isTake === true && this.isRgst === false) {
            this.addOrEditForm.drwrAutoType = "AT06";
          }
          if (this.isAcpt === false && this.isTake === true && this.isRgst === false) {
            this.addOrEditForm.drwrAutoType = "AT07";
          }
          if (this.addOrEditForm.billType === "AC01") {
            if (this.addOrEditForm.acptAcctNo !== "0") {
              // this.$msgTip.error(this, { info: "银票承兑人账号必须为0" });
              this.$msgTip.error(this, {info: this.$t('m.i.makeBill.msg.error6')});
              return;
            }
          }
          if (this.addOrEditForm.billType === "AC02") {
            if (this.addOrEditForm.acptAcctNo === "0") {
              // this.$msgTip.error(this, {info: "商票承兑人账号不能为0"});
              this.$msgTip.error(this, {info: this.$t('m.i.makeBill.msg.error7')});
              return;
            }
          }
          let remitDt = this.$moment(this.addOrEditForm.remitDt).format("YYYYMMDD");
          let dueDt = this.$moment(this.addOrEditForm.dueDt).format("YYYYMMDD");
          let workDate = window.sessionStorage.getItem("workDate");
          if (remitDt >= dueDt) {
            this.$msgTip.info(this, {info: "出票日期必须小于汇票到期日"});
            return;
          }
          if (this.addOrEditForm.rgstType === "RT00" && remitDt > workDate) {
            this.$msgTip.info(this, {info: this.$t('m.i.makeBill.msg.info2')});
            return;
          }
          if (this.addOrEditForm.isPreservationComRoster4Pyee) {
            this.preservationPyeeComForm();
          }
          if (this.addOrEditForm.isPreservationComRoster4Acpt) {
            this.preservationAcptComForm();
          }
          if (this.addOrEditForm.drwrMemberId == this.drwrMemberId) {
            this.addOrEditForm.drwrMemberId = "";
          }
          if (this.addOrEditForm.pyeeMemberId == this.pyeeMemberId) {
            this.addOrEditForm.pyeeMemberId = "";
          }
          if (this.addOrEditForm.acptMemberId == this.acptMemberId) {
            this.addOrEditForm.acptMemberId = "";
          }
          this.$emit("addOrEditWinSubmit", this.addOrEditForm);
        }
      });
    },
    preservationPyeeComForm() {
      let parms = {
        distType: "DT02", // 银行账户
        type: "TC01",  //企业常用人
        name: this.addOrEditForm.pyeeName,
        acctNo: this.addOrEditForm.pyeeAcctNo,
        acctName: this.addOrEditForm.pyeeAcctName,
        openBankNo: this.addOrEditForm.pyeeBankNo,
        openBankName: this.addOrEditForm.pyeeBankName,
        memberId: this.addOrEditForm.pyeeMemberId,
        memberName: this.addOrEditForm.pyeeMemberName,
      };
      post(parms, "/ebank/commonRoster/func_addOrUpdateCommonRoster").then(res => {
        if (res && res.data.retCode === '000000') {

        } else {
          this.$msgTip.error(this, {info: res.data.retMsg});
          return;
        }
      });
    },
    preservationAcptComForm() {
      if (this.addOrEditForm.billType === 'AC01') {
        return;
      }
      let parms = {
        distType: "DT02", // 银行账户
        type: this.addOrEditForm.billType === 'AC01' ? "TC02" : "TC01",
        name: this.addOrEditForm.acptName,
        acctNo: this.addOrEditForm.acptAcctNo,
        acctName: this.addOrEditForm.acptAcctName,
        openBankNo: this.addOrEditForm.acptBankNo,
        openBankName: this.addOrEditForm.acptBankName,
        memberId: this.addOrEditForm.acptMemberId,
        memberName: this.addOrEditForm.acptMemberName,
      };
      post(parms, "/ebank/commonRoster/func_addOrUpdateCommonRoster").then(res => {
        if (res && res.data.retCode === '000000') {

        } else {
          this.$msgTip.error(this, {info: res.data.retMsg});
          return;
        }
      });
    },
    initBillInfo() {
      this.addOrEditForm.id = "";
      this.addOrEditForm.billId = "";
      this.addOrEditForm.drwrName = "";
      this.addOrEditForm.drwrAcctNo = "";
      this.addOrEditForm.drwrAcctName = "";
      this.addOrEditForm.drwrBankNo = "";
      this.addOrEditForm.drwrBankName = "";
      this.addOrEditForm.pyeeName = "";
      this.addOrEditForm.pyeeAcctNo = "";
      this.addOrEditForm.pyeeAcctName = "";
      this.addOrEditForm.pyeeBankNo = "";
      this.addOrEditForm.pyeeBankName = "";
      this.addOrEditForm.pyeeBusinessAddress = "";
      this.amountWords = "";
      this.addOrEditForm.billMoney = "";
      this.addOrEditForm.dueDt = "";
      this.addOrEditForm.transCtrctNo = "";
      this.addOrEditForm.acptProtocalNo = "";
      this.addOrEditForm.acptName = "";
      this.addOrEditForm.acptAcctNo = "0";
      this.addOrEditForm.acptAcctName = "";
      this.addOrEditForm.acptBankNo = "";
      this.addOrEditForm.acptBankName = "";
      this.addOrEditForm.drwrAutoType = "AT04";
      this.addOrEditForm.banEndrsmtMark = "EM00";
      this.addOrEditForm.billType = "AC01";
      this.addOrEditForm.rgstType = "RT00"
    },
    copyBillInfo(obj) {
      this.addOrEditForm.billOrigin = obj.billOrigin;
      this.addOrEditForm.isAllowSplitBill = obj.isAllowSplitBill;
      this.addOrEditForm.billType = obj.billType;
      if (!!obj.remitDt) {
        this.addOrEditForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
      }
      this.addOrEditForm.drwrName = obj.drwrName;
      this.addOrEditForm.drwrAcctNo = obj.drwrAcctNo;
      this.addOrEditForm.drwrAcctName = obj.drwrAcctName;
      this.addOrEditForm.drwrBankNo = obj.drwrBankNo;
      this.addOrEditForm.drwrBankName = obj.drwrBankName;
      this.drwrMemberId = obj.drwrMemberId;
      this.addOrEditForm.drwrMemberName = obj.drwrMemberName;
      this.addOrEditForm.pyeeName = obj.pyeeName;
      this.addOrEditForm.pyeeAcctNo = obj.pyeeAcctNo;
      this.addOrEditForm.pyeeAcctName = obj.pyeeAcctName;
      this.addOrEditForm.pyeeBankNo = obj.pyeeBankNo;
      this.addOrEditForm.pyeeBankName = obj.pyeeBankName;
      this.addOrEditForm.pyeeMemberId = obj.pyeeMemberId;
      this.pyeeMemberId = obj.pyeeMemberId;
      this.pyeeMemberName = obj.pyeeMemberName;
      this.addOrEditForm.pyeeMemberName = obj.pyeeMemberName;
      this.addOrEditForm.pyeeBusinessAddress = obj.pyeeBusinessAddress;
      this.amountWords = cmycurd(obj.billMoney);
      this.addOrEditForm.billMoney = formatNumber(obj.billMoney, 2, ",");
      if (!!obj.dueDt) {
        this.addOrEditForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
      }
      this.addOrEditForm.transCtrctNo = obj.transCtrctNo;
      this.addOrEditForm.acptProtocalNo = obj.acptProtocalNo;
      this.addOrEditForm.acptName = obj.acptName;
      this.addOrEditForm.acptAcctNo = obj.acptAcctNo;
      this.addOrEditForm.acptAcctName = obj.acptAcctName;
      this.addOrEditForm.acptBankNo = obj.acptBankNo;
      this.addOrEditForm.acptBankName = obj.acptBankName;
      this.addOrEditForm.acptMemberId = obj.acptMemberId;
      this.acptMemberId = obj.acptMemberId;
      this.acptMemberName = obj.acptMemberName;
      this.addOrEditForm.acptMemberName = obj.acptMemberName;
      this.addOrEditForm.banEndrsmtMark = obj.banEndrsmtMark;
      this.addOrEditForm.drwrAutoType = obj.drwrAutoType;
      if (this.addOrEditForm.drwrAutoType === "AT00") {
        this.isAcpt = false;
        this.isTake = false;
        this.isRgst = false;
      }
      if (this.addOrEditForm.drwrAutoType === "AT01") {
        this.isAcpt = false;
        this.isTake = false;
        this.isRgst = true;
      }
      if (this.addOrEditForm.drwrAutoType === "AT02") {
        this.isAcpt = true;
        this.isTake = false;
        this.isRgst = true;
      }
      if (this.addOrEditForm.drwrAutoType === "AT03") {
        this.isAcpt = false;
        this.isTake = true;
        this.isRgst = true;
      }
      if (this.addOrEditForm.drwrAutoType === "AT04") {
        this.isAcpt = true;
        this.isTake = true;
        this.isRgst = true;
      }
      if (this.addOrEditForm.drwrAutoType === "AT05") {
        this.isAcpt = true;
        this.isTake = false;
        this.isRgst = false;
      }
      if (this.addOrEditForm.drwrAutoType === "AT06") {
        this.isAcpt = true;
        this.isTake = true;
        this.isRgst = false;
      }
      if (this.addOrEditForm.drwrAutoType === "AT07") {
        this.isAcpt = false;
        this.isTake = true;
        this.isRgst = false;
      }
    },
    validTransCtrctNo(rule, val, callback) {
      let re = /^[0-9a-zA-Z]{0,40}$/;
      if (re.test(val)) {
        callback();
      } else {
        callback(new Error(this.$t('m.i.billInfo.transCtrctNo') + "为小于等于40位数字或字母"));
      }
    },
    handleDrwrNameChange(value) {
      this.addOrEditForm.drwrAcctNo = "";
      this.addOrEditForm.settleAcctNo = "";
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
    drwrReset() {
      this.addOrEditForm.drwrAcctNo = "";
      this.addOrEditForm.drwrBankNo = "";
      this.addOrEditForm.drwrBankName = "";
      this.addOrEditForm.drwrBrchNo = "";
      this.addOrEditForm.settleAcctNo = "";
      this.addOrEditForm.settleAcctOrderNo = "";
      this.addOrEditForm.guarntrNo = "";
      this.addOrEditForm.guarntrOrder = "";
    },
    //关闭
    custCorpWinClose() {
      this.showCustInfoWin = false;
    },
    //查询客户账号信息
    queryCustAcct(type) {

      if (this.addOrEditForm.drwrCustNo === "") {
        this.$msgTip.info(this, {info: "请先选择客户！"});
        return;
      }
      if (type === "drwr") {

        this.isAllOtherBankAcct = true;
        this.custAcctKind = "";
        this.selectDrwrAcct = true;
        this.showCustAcctWin = true;
      }

    },
    //赋值
    custAcctSelectSubmit(info) {
      if (this.selectDrwrAcct) {
        this.addOrEditForm.drwrAcctNo = info.custAcctNo;
        this.addOrEditForm.drwrAcctName = info.acctName;
        this.addOrEditForm.drwrBankNo = info.openBankNo;
        this.addOrEditForm.drwrBrchNo = info.openBrchNo;
debugger
        post({actorBrchBankNo: info.openBankNo}, "/shcpe/cpes/hvpsbank/hvpsBank/func_queryHvpsBank").then(res => {
          if (res && res.data.retCode === '000000') {
            console.log(res.data.retData[0]);
            this.addOrEditForm.drwrBankName = res.data.retData.list[0].actorBrchName;
          } else {
              this.addOrEditForm.drwrBankName = "";
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        });

        if (this.addOrEditForm.billOrigin == 'CS02' || this.addOrEditForm.billOrigin == 'CS03') {
            post({bankNo: this.addOrEditForm.drwrBankNo}, "/ce/channel/ebank/func_queryCpesBankInfo").then(res => {
              if (res && res.data.retCode === '000000') {
                this.addOrEditForm.drwrMemberId = res.data.retData.memberId;
                this.drwrMemberId = res.data.retData.memberId;
                this.addOrEditForm.drwrMemberName = res.data.retData.memberName;
              } else {
                this.addOrEditForm.drwrBankName = "";
                this.addOrEditForm.drwrMemberId = "";
                this.addOrEditForm.drwrMemberName = "";
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            });
          }
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
      this.selectDrwrAcct = false;
    },
  },
  mounted() {
    this.checkRef = this.$refs['addOrEditForm']
  }
};
</script>

