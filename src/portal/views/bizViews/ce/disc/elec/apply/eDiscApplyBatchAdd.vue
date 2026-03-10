<template>
  <div class="h-tree-search">
    <div class="h-modal-header-wrapper">
      <h-msg-box v-model="tempshowEDiscApplyAddWin" :mask-closable="false" @on-close="handleClose" width="1000"
                 class="h-form-search-layer">
        <p slot="header">
          <span v-if="operType==='add'">{{$t("m.i.ce.addApply")}}</span>
          <span v-else-if="operType==='modify'">{{$t("m.i.ce.modifyApply")}}</span>
        </p>
        <!--弹出框内容-->
        <div>
          <!--输入表单-->
          <h-form :model="addForm" :label-width="115" ref="addForm" cols="3" class="h-form-search">
            <div>
              <!-- <own-brch-no :addForm = "addForm" @brchNoWinOpen="brchNoWinOpen" v-if="this.licenseFlag"></own-brch-no>-->
              <show-branch v-model="addForm.ownedBrchNo" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo"
                           title="机构名称" required :showCheckBox="false" :msgBoxWin="tempshowEDiscApplyAddWin"
                           :brchNo.sync="addForm.ownedBrchNo" :brchName.sync="addForm.ownedBrchName"
                           v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                           @brchNoChange="licenseBrchNoChange($event)"
                           url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                           queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
              </show-branch>
              <busi-type v-model="addForm.prodNo" prop="prodNo" :dictList="busiTypeList" :required="true"
                         :readonly="operType==='modify'"
                         @on-change="busiTypeChange" :paramsMap="{key:'prodNo',value:'prodName'}"></busi-type>
              <common-select v-model="addForm.billOriginList" :label="$t('m.i.billInfo.billOrigin')" prop="billOriginList"
                             :dictList="billOriginList" :multiple="isMixPack" :readonly="operType==='modify'" required ></common-select>
              <cust-no :addForm="addForm" :operType="operType"></cust-no>
              <cust-name :formItem="addForm" :required="isRequired" :showIcon=false :clearable=false></cust-name>
              <ao-acct-no :formItem="addForm" @importBatch="importBatch" :disabledButton="operType==='modify'"
                          :discFlag="discFlag" :operType="operType"></ao-acct-no>
              <protect-type :formItem="addForm" :protectTypeList="protectTypeList"
                            v-if="addForm.prodNo==='01060622' || addForm.prodNo==='01061022' || addForm.prodNo==='01060322' || addForm.prodNo==='01060722'"></protect-type>
              <corp-scale :formItem="addForm" :corpScaleList="corpScaleList" :isRequired="isRequired"></corp-scale>
              <is-green-corp :formItem="addForm" :isList="isList" :isRequired="isRequired"></is-green-corp>
              <bill-type v-model="addForm.billType" :dictList="billTypeList" :readonly="true"
                         :required="true"></bill-type>
              <cust-acct-no-form :formItem="addForm" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no-form>
              <acpt-cust-name :formItem="addForm" :onlyRead="false" @queryAcptCustName="queryAcptCustName"
                              @acptCustNameChange="acptCustNameChange" :isRequired="true"
                              v-if="addForm.prodNo === '01060322' && addForm.protectType === '1'"></acpt-cust-name>
              <guarntr-no :formItem="addForm" @queryBailAcctNo="queryBailAcctNo" :isRequired="true"
                          v-if="addForm.prodNo === '01060322'"></guarntr-no>
              <bail-pcet :formItem="addForm" :isRequired="true" :rateRule="bailpectRule"
                         v-if="addForm.prodNo === '01060322'"></bail-pcet>
              <ce-redeem-open-dt :formItem="addForm" :isRequired="isRequired"></ce-redeem-open-dt>
              <ce-redeem-due-dt :formItem="addForm" :isRequired="isRequired"></ce-redeem-due-dt>
              <clear-mark :formItem="addForm" :clearMarkList="clearMarkList" :required="isRequired"></clear-mark>
              <ce-ban-endrsmt-mark :formItem="addForm"></ce-ban-endrsmt-mark>
              <ce-disc-dt :formItem="addForm" :isRequired="isRequired" :onlyRead="onlyRead"
                          :disabled="addForm.prodNo.indexOf('010611') === -1"></ce-disc-dt>
              <is-bill-rate :formItem="addForm" :isList="isList"  :operType="operType"
                            :isAllowBillRate="isAllowBillRate" v-if="isAllowBillRate"></is-bill-rate>
              <disc-interest-rate :formItem="addForm" :rateRule="rateRule"
                                  :disabled="addForm.prodNo.indexOf('010611') === -1" :required="!discInterestRateOnlyRead"
                                  v-if="addForm.isBillRate==='0'"></disc-interest-rate>
              <rate-type :formItem="addForm" :rateTypeList="rateTypeList" :onlyRead="onlyRead"
                         v-if="addForm.isBillRate==='0'"></rate-type>
              <!--<account-brch-no :formItem = "addForm"></account-brch-no>
              <account-brch-name :formItem = "addForm" :isRequired="isRequired" :isAllowChoiceOtherAcctBranch="isAllowChoiceOtherAcctBranch" @queryBrchNo="queryBrchNo"></account-brch-name>-->
              <show-branch v-model="addForm.accountBrchNo" :label="$t('m.i.common.accountBrchName')"
                           prop="accountBrchNo" title="机构名称"
                           :required="isRequired" :msgBoxWin="tempshowEDiscApplyAddWin" :showCheckBox="false"
                           :filterable="isAllowChoiceOtherAcctBranch" :isInitValueClearable="true"
                           :brchNo.sync="addForm.accountBrchNo" :brchName.sync="addForm.accountBrchName">
              </show-branch>
              <cust-mgr-no :formItem="addForm"></cust-mgr-no>
              <cust-mgr-name :formItem="addForm" :isCustMgrRequired="isCustMgrRequired" :isAllowOtherCustMgr="isAllowOtherCustMgr" :isCustMgrClearable="isAllowOtherCustMgr"
                             @clearVal="clearVal('custMgrName')" @queryCustManager="queryCustManager"></cust-mgr-name>
              <pay-type :formItem="addForm" :payTypeList="payTypeList" :isRequired="isRequired" :onlyRead="onlyRead"
                        @payTypeChange="payTypeChange"></pay-type>
              <pay-cust-name :formItem="addForm" :onlyRead="onlyRead" @queryPayCustName="queryPayCustName"
                             @payCustNameChange="payCustNameChange"></pay-cust-name>
              <buy-pay-pcet :formItem="addForm" :onlyRead="onlyRead" :buyPayPcetRule="buyPayPcetRule"></buy-pay-pcet>
              <pay-acct-no :formItem="addForm" :onlyRead="onlyRead" @queryPayAcctNo="queryPayAcctNo" :maxlength=32 :payAcctNoRule="acctNoRule"></pay-acct-no>
              <third-cust-name :formItem="addForm" :onlyRead="onlyRead" @queryThirdCustName="queryThirdCustName"
                               @thirdCustNameChange="thirdCustNameChange"></third-cust-name>
              <third-cust-no :formItem="addForm" :onlyRead="onlyRead" :maxlength=32 :thirdAcctNoRule="acctNoRule"
                             @queryThirdAcctNo="queryThirdAcctNo"></third-cust-no>
              <invoice-after-flag :formItem="addForm" :youList="isList" :onlyRead="onlyRead"></invoice-after-flag>
              <force-invoice-flag :formItem="addForm" :youList="isList" :onlyRead="onlyRead"
                                  v-if="addForm.invoiceAfterFlag === '0'"></force-invoice-flag>
              <trans-ctrct-no :formItem="addForm" :onlyRead="onlyRead"></trans-ctrct-no>
              <disc-use :formItem="addForm" :onlyRead="onlyRead"></disc-use>
              <advanced-rate :formItem="addForm" :onlyRead="onlyRead" :rateRule="advanceRateRule"></advanced-rate>
              <industry-category :formItem="addForm" :onlyRead="onlyRead" :industryList="industryList"
                                 v-show="false"></industry-category>
              <industry-category-name :formItem="addForm" :onlyRead="onlyRead" v-show="true"
                                      @queryDetailName="queryDetailName"></industry-category-name>
              <sign-addr :formItem="addForm" :onlyRead="onlyRead"></sign-addr>
              <arbitrate-mode :formItem="addForm" :onlyRead="onlyRead"
                              :arbitrateModeList="arbitrateModeList"></arbitrate-mode>
              <arbitration-commission-name :formItem="addForm" :onlyRead="onlyRead"></arbitration-commission-name>
              <arbitration-commission-addr :formItem="addForm" :onlyRead="onlyRead"></arbitration-commission-addr>
              <party-a-addr :formItem="addForm" :onlyRead="onlyRead"></party-a-addr>
              <party-a-post-code :formItem="addForm" :onlyRead="onlyRead"
                                 :postCodeRule="postCodeRule"></party-a-post-code>
              <party-a-name :formItem="addForm" :onlyRead="onlyRead"></party-a-name>
              <party-a-phone :formItem="addForm" :onlyRead="onlyRead" :phoneNoRule="phoneNoRule"></party-a-phone>
              <party-b-addr :formItem="addForm" :onlyRead="onlyRead"></party-b-addr>
              <party-b-post-code :formItem="addForm" :onlyRead="onlyRead"
                                 :postCodeRule="postCodeRule"></party-b-post-code>
              <party-b-name :formItem="addForm" :onlyRead="onlyRead"></party-b-name>
              <party-b-phone :formItem="addForm" :onlyRead="onlyRead" :phoneNoRule="phoneNoRule"></party-b-phone>
              <total-pages :formItem="addForm" :onlyRead="onlyRead" :intRule="intRule"></total-pages>
              <common-select v-model="addForm.isNoticeFirstAudit" label="是否通知审批第一岗" prop="isNoticeFirstAudit" required
                             class="h-form-long-label" v-if="this.showNoticeFirstStationItem"
                             :dictList="isList"></common-select>
            </div>
          </h-form>
          <div style="text-align: right">
            <submiting-btn :submitFlag="submitFlag"></submiting-btn>
            <save-btn :submitFlag="submitFlag" :isCommit="this.isCommit" @formSave="formSave"></save-btn>
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
              url="/ce/disc/elec/apply/eDiscApplyBatchMain/func_pageQueryCeDiscBillList"
              :bindForm="formItem"
              :row-select="true"
              :has-select="hasSelect"
              ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <pick-bill-btn v-if="isCommit === 'noCommit'"
                               @discPickBillWinOpen="discPickBillWinOpen"></pick-bill-btn>
                <delete-bill-btn :isCommit="this.isCommit" @deleteDetailed="deleteDetailed"></delete-bill-btn>
                <calc-interest-btn v-if="isCommit === 'noCommit'"
                                   @interestCalculation="interestCalculation"></calc-interest-btn>
                <change-delay-days-btn v-if="isCommit === 'noCommit'"
                                       @changeDelayDays="changeDelayDays"></change-delay-days-btn>
                <prod-type-choose-btn v-if="openI9flag && isCommit === 'noCommit'" @prodTypeChoose="prodTypeChoose"></prod-type-choose-btn>
                <batch-export-btn :isCommit="this.isCommit" @exportBillExcel="exportBillExcel"></batch-export-btn>
                <disc-img-upload-btn :isCommit="this.isCommit" :isNeedUpdDiscImg="this.isNeedUpdDiscImg"
                                     @discImgUpload="discImgUpload"></disc-img-upload-btn>
                <relation-invoice-btn :isCommit="this.isCommit"
                                      @relationInvoice="relationInvoice"></relation-invoice-btn>
                <invoice-manager-btn :isCommit="this.isCommit" @invoiceManager="invoiceManager"></invoice-manager-btn>
                <submit-btn @submitList="submitList" v-if="isCommit === 'noCommit'"></submit-btn>
                <contract-printing-btn :isCommit="this.isCommit"
                                       @contractPrinting="contractPrinting"></contract-printing-btn>
                <cancel-apply-batch-btn :isCommit="this.isCommit"
                                        @cancelApplyBatch="cancelApplyBatch"></cancel-apply-batch-btn>
                <check-printing-btn :isCommit="this.isCommit" @checkPrinting="checkPrinting"></check-printing-btn>
              </div>
            </h-datagrid>
          </div>
        </div>
        <!-- 弹出框模式底部按钮 -->
        <div slot="footer">
        </div>
      </h-msg-box>
      <!--贴现批次挑选页面-->
      <h-msg-box v-model="discBatchChooseWin" width="800" @on-close="discBatchChooseReset" class="h-form-table-layer"
                 :maximize="true" :mask-closable="false">
        <p slot="header">
          <span>贴现批次挑选</span>
        </p>
        <h-form :model="discBatchChooseFormItem" :label-width="90" ref="discBatchChooseFormItem" cols="4"
                class="h-form-search">
          <disc-dt :formItem="discBatchChooseFormItem"></disc-dt>
          <query-btn :advanceShow='false' :formSearch='discBatchChooseFormSearch'
                     :formSearchReset='discBatchChooseReset' formClassAdd="1"></query-btn>
        </h-form>
        <h-datagrid
          :columns="discBatchChooseColumns"
          highlight-row
          :autoLoad=false
          url="/ce/disc/elec/apply/eDiscApplyBatchMain/func_pageQueryRefusedDsicBatchList"
          :bindForm="discBatchChooseFormItem"
          :on-current-change="discBatchChooseSelectClick"
          :on-current-change-cancel="discBatchChooseSelectClickCancel"
          :onRowDbClick="doubleHandleClick"
          ref="discBatchChooseDatagrid">
        </h-datagrid>
        <!-- 弹出框模式底部按钮 -->
        <div slot="footer">
          <close-btn @close="discBatchChooseClose"></close-btn>
          <commit-btn @commit="discBatchChooseFormSubmit"></commit-btn>
        </div>
      </h-msg-box>
    </div>

    <!--调整顺延天数界面-->
    <h-msg-box v-model="delayDaysChangeWin" width="400" @on-close="delayDaysChangeClose" class="h-form-table-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>调整顺延天数</span>
      </p>
      <h-form :model="delayDaysChangeFormItem" :label-width="90" ref="delayDaysChangeFormItem" cols="4"
              class="h-form-search">
        <h-form-item :label="$t('m.i.ce.delayDays')" prop="delayDays" :validRules="delayDaysRule" required>
          <h-input v-model="delayDaysChangeFormItem.delayDays" :maxlength="2"></h-input>
        </h-form-item>
      </h-form>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <close-btn @close="delayDaysChangeClose"></close-btn>
        <submiting-btn :submitFlag="submitFlag"></submiting-btn>
        <commit-btn @commit="delayDaysChangeSubmit" :isShow="!submitFlag"></commit-btn>
      </div>
    </h-msg-box>

    <!--业务分类选择界面-->
    <asset-industry :assetIndustryWin="prodTypeChooseWin" :dictMap="{'assetIndustryList': busiClassifyList}"
                    :assetInd="prodTypeChooseFormItem.busiClassify"
                    :isAssetIndustryChooseBoolen="isAllowChangeProdType === '0'" :isAssetIndustryRequired="true"
                    :isProdTypeChoose="true"
                    @assetIndustryClose="prodTypeChooseClose" @assetIndustryChange="prodTypeChooseSubmit"
                    ref="prodTypeChooseFormItem"></asset-industry>
    <!-- 二次确认弹窗 -->
    <h-msg-box v-model="confirmAgainWin" :maximize="false" width="400" :footerHide="true" :closable="false"
               :z-index="2010">
      <div class="modal-body">
        <div class="h-modal-confirm">
          <div class="h-modal-confirm-head">
            <div class="h-modal-confirm-head-icon h-modal-confirm-head-icon-confirm">
              <i class="h-icon iconfont icon-feedback"></i>
            </div>
            <div class="h-modal-confirm-head-title">确认</div>
          </div>
          <div class="h-modal-confirm-body">
            <div>风险检查成功,确定提交申请吗</div>
          </div>
          <div class="h-modal-confirm-footer">
            <button type="button" @click="confirmAgainClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span>
            </button>
            <button type="button" @click="handleSubmit()" class="h-btn h-btn-primary h-btn-large"><span>确定</span>
            </button>
          </div>
        </div>
      </div>
    </h-msg-box>

    <!-- 行业投向详细信息选择框 -->
    <h-msg-box v-model="dictNameSelectWin" width="400" class="h-form-search-layer" :maximize="true"
               :mask-closable="false"
               @on-maximize="getTreeHeight($event, 'dictNameSelectMsg')" ref="dictNameSelectMsg">
      <p slot="header">
        <span>行业投向选择</span>
      </p>
      <div class="h-tree-search">
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(indTreeData)'>
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(indTreeData)'>
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
        </div>
        <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
          <h-tree :data="indTreeData" ref='indTreeData' class='h-tree-self' :show-checkbox="false" @on-toggle-expand="toggleExpand"></h-tree>
        </div>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="dictNameSelectWin=!dictNameSelectWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="indNameAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--查询账务机构-->
    <!--  <show-branch :showBranchWin="showBranchWin" :title="$t('m.i.ce.brchQuery')" @brchNoChange="brchNoChange"
                   @showBranchWinClose="showBranchWinClose"></show-branch>-->

    <!--查询客户经理-->
    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="$t('m.i.ce.selectManager')"
                       @showCustManagerWinClose="showCustManagerWinClose" :selectType="'apply'"
                       @custManagerSelectList="custManagerSelectList"></show-cust-manager>

    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.addForm.custNo"
                       :isAllBankAcct=true @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <!--查询保证金账户-->
    <show-cust-acct :showCustAcctWin="showCustAcctWin" :selectCustNo="selectCustNo" :title="'查看保证金账户'"
                    :selectType="'select'" :ifClearBtn="isFalse" :custAcctKind="2"
                    @showCustAcctWinClose="showCustAcctWinClose"
                    @custAcctSelect="custAcctSelect"></show-cust-acct>

    <!--挑票弹窗-->
    <disc-pick-bill :discPickBillWin="discPickBillWin" @discPickBillWinClose="discPickBillWinClose"
                    :queryRefusedUrl="'/ce/disc/elec/apply/eDiscApplyBatchMain/func_pageQueryRefusedDsicBillList'"
                    :refuseUrl="'/ce/disc/elec/apply/eDiscApplyBatchMain/func_refuseBill'"
                    :discPickBillForm="this.discPickBillForm"
                    @discPickBillChange="discPickBillChange" :prodNo="this.addForm.prodNo">

    </disc-pick-bill>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"  :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"
                    :billId="this.billId"></bill-info-main>

    <!--买方付息人名称-->
    <show-cust-message :show-cust-message-win="showPayCustNameWin" @custCorpWinClose="showPayCustNameWinClose"
                       @custCorpSelectSubmit="payCustNameSelect"></show-cust-message>
    <!--承兑人人名称-->
    <show-cust-message :show-cust-message-win="showAcptCustNameWin" @custCorpWinClose="showAcptCustNameWinClose"
                       @custCorpSelectSubmit="acptCustNameSelect"></show-cust-message>

    <!-- 买方付息人账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showPayAcctNoWin" :cust-no="this.addForm.payCustNo"
                       :cust-name="this.addForm.payCustName"
                       @showCustAcctNoWinClose="showPayAcctNoWinClose"
                       @custAcctNoSelectSubmit="payAcctNoSelectSubmit"></show-cust-acct-no>

    <!--第三方付息人名称-->
    <show-cust-message :show-cust-message-win="showThirdCustNameWin" @custCorpWinClose="showThirdCustNameWinClose"
                       @custCorpSelectSubmit="thirdCustNameSelect"></show-cust-message>

    <!-- 第三方付息人账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showThirdAcctNoWin" :cust-no="this.addForm.thirdCustNo"
                       :cust-name="this.addForm.thirdCustName"
                       @showCustAcctNoWinClose="showThirdAcctNoWinClose"
                       @custAcctNoSelectSubmit="thirdAcctNoSelectSubmit"></show-cust-acct-no>

    <!--风险信息-->
    <risk-check :riskCheckWin="riskCheckWin" :riskParams="riskParams" @riskCheckWinClose="riskCheckWinClose"
                @riskCheckSubmit="riskCheckSubmit"></risk-check>

    <show-disc-image-upload :show-upload-image-win="showUploadImageWin" :params="imageParams"
                            @uploadImageWinClose="uploadImageWinClose"></show-disc-image-upload>

    <endrsmt-check :endrsmtParams="endrsmtParams" :showEDiscEndrsmtCheckWin="showEDiscEndrsmtCheckWin"
                   @endrsmtCheckWinClose="endrsmtCheckWinClose"
                   @endrsmtCheckWinSubmit="endrsmtCheckWinSubmit"></endrsmt-check>

    <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="licenseBrchNoChange"
                          :authPath="authPath" @showBranchWinClose="brchNoWinClose" :ifcheck="false"></show-license-branch>
 -->
    <common-excel-download @handleSubmit="exportForm" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

    <invoice-pick-bill :billPickInvoiceWin="billPickInvoiceWin" :billPickInvoiceParams="billPickInvoiceParams"
                       @billPickInvoiceWinClose="billPickInvoiceWinClose"
                       @billPickInvoiceChange="billPickInvoiceChange"></invoice-pick-bill>

    <relation-invoice-bill-info :relationInvoiceBillWin="relationInvoiceBillWin"
                                :relationInvoiceBillParams="relationInvoiceBillParams"
                                @relationInvoiceBillWinClose="relationInvoiceBillWinClose"></relation-invoice-bill-info>
  </div>
</template>

<script>
  import { accDiv, accMul, cmycurd, formatNumber, getDictListByGroups, getSingleParamValuesByKeys, numToUpper, off, on, post, getDictValueFromMap, getBusinessParameter, formatBillRange, formatBillNoAndRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "eDiscApplyBatchAdd",
    components: {
      DiscPickBill: () => import(/* webpackChunkName: "ce/disc/elec/apply/discPickBill" */`@/views/bizViews/ce/disc/elec/apply/discPickBill`),
      // EDiscBatchInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/eDiscBatchInfoDetail" */`@/views/bizViews/ce/disc/common/eDiscBatchInfoDetail`),
      //ShowBranch:() => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      ShowCustManager: () => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`),
      ShowCustAcct: () => import(/* webpackChunkName: "bm/cust/acct/showCustAcct" */`@/views/bizViews/bm/cust/acct/showCustAcct`),
      EndrsmtCheck: () => import(/* webpackChunkName: "ce/disc/elec/apply/eDiscEndrsmtCheck" */`@/views/bizViews/ce/disc/elec/apply/eDiscEndrsmtCheck`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
      ShowDiscImageUpload: () => import(/* webpackChunkName: "ce/disc/common/showDiscImageUpload" */`@/views/bizViews/ce/disc/common/showDiscImageUpload`),
      "invoice-pick-bill": () => import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/billPickInvoice`),
      "relation-invoice-bill-info": () => import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/relationInvoiceBillInfo`),
      AssetIndustry: () => import(/* webpackChunkName: "be/market/quote/rebuy/assetIndustry" */`@/views/bizViews/be/market/quote/rebuy/assetIndustry`)

    },
    data() {
      let _that = this;
      return {
        applyParams: {},
        busiOwnBrchNo: '',
        isMarketMode: false,
        // 贴现利率是否只读, 默认为是
        discInterestRateOnlyRead: true,
        formItem: {
          funcNo: "",
          batchId: "",
          billClass: "ME02",
          ownedBrchName: "",
        },
        openI9flag: false,
        addForm: {
          id: "",
          legalNo: "",
          batchNo: "",
          billClass: "ME02",
          billType: "",
          custNo: "",
          custAcctNo: "",
          custName: "",
          discDt: "",
          rate: "",
          rateType: "360",
          payType: "2",
          payCustName: "",
          payBankNo: "",
          payCustNo: "",
          payAcctNo: "",
          buyPayPcet: "",
          bailPcet: "",
          prodNo: "",
          custMgrNo: this.$store.getters.userInfo.userNo,
          custMgrName: this.$store.getters.userInfo.userName,
          custMgrBrchNo: this.$store.getters.userInfo.brchNo,
          transBrchNo: "",
          ownedBrchNo: "",
          ownedBrchName: "",
          accountBrchNo: this.$store.getters.userInfo.brchNo,
          accountBrchName: this.$store.getters.userInfo.brchName,
          redeemRate: "",
          redeemRateType: "",
          redeemOpenDt: "",
          redeemDueDt: "",
          aoAcctNo: "",
          aoAcctBankNo: "",
          clearMark: "",
          transCtrctNo: "",
          thirdPayPcet: "",
          thirdCustName: "",
          thirdBankNo: "",
          thirdCustNo: "",
          thirdAcctNo: "",
          agentCustName: "",
          agentCustAcctNo: "",
          agentCustBankNo: "",
          isBackQuery: "0",
          isDelayInstore: "",
          isInstore: "",
          creditLimitType: "",
          discRgstStatus: "",
          discRemark: "",
          queryType: "1",
          protectType: "",
          corpScale: "",
          isGreenCorp: "",
          discUse: "周转",
          advancedRate: "5",
          industryCategory: "",
          industryCategoryName: "",
          signAddr: "",
          arbitrateMode: "",
          arbitrationCommissionName: "",
          arbitrationCommissionAddr: "",
          partyAAddr: "",
          partyAPostCode: "",
          partyAName: "",
          partyAPhone: "",
          partyBAddr: "",
          partyBPostCode: "",
          partyBName: "",
          partyBPhone: "",
          totalNum: "",
          totalPages: "",
          dataSource: "",
          transplantFlag: "",
          createTime: "",
          updateTime: "",
          reserve1: "",
          reserve2: "",
          reserve3: "",
          isBillRate: "0",
          banEndrsmtMark: "",
          bailAcctNo: "",
          acptCustNo: "",
          acptCustName: "",
          invoiceAfterFlag: "1",
          forceInvoiceFlag: "",
          billOriginList: [],
        },
        addSumForm: {
          sumCount: "",
          sumMoney: "",
          sumBuyerInterest: "",
          sumSalerInterest: "",
          sumInterest: "",
          sumRealPayAmt: "",
        },
        columns: [
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
            title: this.$t("m.i.ce.otherBankDisc"),
            key: "otherBankDiscMark",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.otherBankDiscMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
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
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
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
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
            render: (h, params) => {
              if (params.row.isAcpt == null || params.row.isAcpt === "") {
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
            title: this.$t("m.i.be.assetIndustry"),
            key: "busiClassify",
            hiddenCol: window.sessionStorage.getItem("isOpenI9") == "1" ? false : true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AssetIndustry", params.row.busiClassify);
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
              if (params.row.galeDt == null || params.row.galeDt === "") {
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
            title: this.$t("m.i.ce.realInterest"),
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
            title: this.$t("m.i.ce.draftPayAmt"),
            key: "draftPayAmt",
            hiddenCol: false,
            render: (h, params) => {
              let draftPayAmt = formatNumber(params.row.draftPayAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: draftPayAmt
                }
              }, draftPayAmt);
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
            title: this.$t("m.i.ce.isSame"),
            key: "isSame",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isSame);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.isCancel"),
            key: "isCancel",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isCancel);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.buyerCustName"),
            key: "buyerCustName",
            hiddenCol: false,
          },
        ],
        discBatchChooseFormItem: {
          discDt: '',
          custAcctNo: '',
          aoAcctNo: '',
          prodNo: '',
          isBillRate: '',
          ownedBrchNo: "",
          ownedBrchName: "",
          billOriginList: [],
        },
        discBatchChooseColumns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width: 50
          },
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: true
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
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discDt"),
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
            title: this.$t("m.i.common.custName"),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.discInterestRate"),
            key: "rate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rate !== null && params.row.rate !== "") {
                let rate = accMul(params.row.rate, 100) + "(%)";
                return h("span", rate);
              }
            }
          },
          {
            title: this.$t("m.i.ce.redeemOpenDt"),
            key: "redeemOpenDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.redeemOpenDt == null || params.row.redeemOpenDt === "") {
                return "";
              }
              let discDt = this.$moment(params.row.redeemOpenDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
          },
          {
            title: this.$t("m.i.ce.redeemDueDt"),
            key: "redeemDueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.redeemDueDt == null || params.row.redeemDueDt === "") {
                return "";
              }
              let discDt = this.$moment(params.row.redeemDueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
          },
          {
            title: this.$t("m.i.ce.redeemRate"),
            key: "redeemRate",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.redeemRate !== null && params.row.redeemRate !== "") {
                let rate = accMul(params.row.redeemRate, 100) + "(%)";
                return h("span", rate);
              }
            }
          },
          {
            title: this.$t("m.i.ce.clearMark"),
            key: "clearMark",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "SettlementMarkCode", params.row.clearMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.banEndrsmtMark"),
            key: "banEndrsmtMark",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "BanEndorsementMarkCode", params.row.banEndrsmtMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
        ],
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
        },
        tableRef: "selfTable",
        prodTypeChooseWin: false,
        //业务分类界面
        prodTypeChooseFormItem: {
          busiClassify: "0",
          batchId: "",
          discIds: ""
        },
        isAllowChangeProdType: '1',
        busiClassifyList: [],
        currentSelectList: [],
        protectTypeList: [],
        rateTypeList: [],
        payTypeList: [],
        billTypeList: [],
        corpScaleList: [],
        queryTypeList: [],
        arbitrateModeList: [],
        industryList: [],
        isList: [],
        clearMarkList: [],
        busiTypeList: [],
        billOriginList: [],
        dictMap: new Map(),
        submitBillNo: "",
        submitBillRangeStart: "",
        submitBillRangeEnd: "",
        discOptions: {
          disabledDate(date) {
            return date && date.valueOf() < _that.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
          }
        },
        discBatchChooseSelectList: [],
        viewDetailForm: {
          prodNo: "",
          billType: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          aoAcctNo: "",
          redeemOpenDt: "",
          redeemDueDt: "",
          clearMark: "",
          discDt: "",
          rate: "",
          payType: "",
          payCustName: "",
          payAcctNo: "",
          buyPayPcet: "",
          sumCount: "",
          sumMoney: "",
          sumBuyerInterest: "",
          sumSalerInterest: "",
          sumInterest: "",
          sumRealPayAmt: "",
        },
        discPickBillForm: {
          billNo: "",
          isInner: "",
          custAcctNo: "",
          discDt: "",
          billClass: "",
          billType: "",
          clearMark: "",
          banEndrsmtMark: "",
          aoAcctBankNo: "",
          aoAcctNo: "",
          isBillRate: "",
          prodNo: "",
          otherBankDiscMark: "",
          isSameLegal: "",
          licenseFlag: "",
          ownedBrchNo: "",
        },
        //调整顺延天数
        delayDaysChangeFormItem: {
          id: "",
          ids: "",
          delayDays: "",
        },
        billId: "",
        billRangeStart:"",
        billRangeEnd:"",
        endrsmtParams: {
          batchId: "",
          ids: "",
          backFlag: "0",
          impawnFlag: "0",
          sameFlag: "0",
          blackFlag: "0",
          endrsmtCheckUrl: "",
          blackEndrsmtCheckUrl: ""
        },
        riskParams: {},
        discIds: "",
        submitType: "",
        imageParams: {},
        indTreeData: [],
        billPickInvoiceParams: {
          listId: "",
          custNo: "",
          billNo: "",
          invoiceFlag: "",
          billMoney: "",
          batchNo: "",
          billId: "",
          dictMap: this.dictMap
        },
        relationInvoiceBillParams: {
          listId: "",
          cancelRelationUrl: "",
          dictMap: this.dictMap
        },
        param: null,
        rows: null,
        isDisabled: false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
        isRequired: true,
        isFalse: false,
        notShow: false,
        onlyRead: false,
        submitFlag: false,
        isQuery: false,
        canPick: false,
        hasSelect: false,
        //通过参数控制账务机构是否可选
        isAllowChoiceOtherAcctBranch: false,
        //通过参数控制客户经理是否必输
        isCustMgrRequired: false,
        //通过参数控制客户经理是否可选
        isAllowOtherCustMgr: false,
        //是否允许明细利率参数
        isAllowBillRate: false,
        //账务机构弹出框
        //showBranchWin : false,
        //客户经理弹出框
        showCustManagerWin: false,
        delayDaysChangeWin: false,
        confirmAgainWin: false,
        discBatchChooseWin: false,
        discPickBillWin: false,
        showCustAcctNoWin: false,
        showCustAcctWin: false,
        selectCustNo: "",
        // brchNoWin:false,
        showPayCustNameWin: false,
        showAcptCustNameWin: false,
        showPayAcctNoWin: false,
        showThirdCustNameWin: false,
        showThirdAcctNoWin: false,
        showEDiscEndrsmtCheckWin: false,
        tempShowExcelTemplateWin: false,
        dictNameSelectWin: false,
        showUploadImageWin: false,
        //票面信息页面
        showBillInfoWin: false,
        //风险信息窗口
        riskCheckWin: false,
        billPickInvoiceWin: false,
        relationInvoiceBillWin: false,
        isMixPack: false,
        phoneNoRule: [{test: /^[0-9]{1,13}$/, trigger: "blur", message: "电话由不超过13位数字组成"}],
        intRule: [{test: /^(0|\+?[1-9][0-9]{0,8})$/, trigger: "blur", message: "只能输入不超过9位的正整数或0"}],
        postCodeRule: [{test: validPostCode, trigger: 'blur'}],
        rateRule: [{test: this.validDiscRate, trigger: 'blur', message: '利率为0~100之间的数，小数位不超过4位'}],
        bailpectRule: [{
          test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: 'blur',
          message: '比例为0~100之间的数，小数位不超过4位'
        }],
        delayDaysRule: [{test: /^[0-9]{1,2}$/, trigger: "blur", message: "顺延天数由不超过2位数字组成"}],
        buyPayPcetRule: [{test: validBuyPayPcetRule, trigger: 'blur'}],
        mTreeHeight: 300,
        advanceRateRule: [{
          test: /^(((\d|[1-9]\d{1,3})(\.\d{1,4})?)|10000|10000\.0|10000\.00|10000\.000|10000\.0000)$/,
          trigger: 'blur',
          message: '利率为0~10000之间的数，小数位不超过4位'
        }],
          acctNoRule: [{ test: validAcctNo, trigger: "blur" }],
        queryUrl: "/ce/disc/paper/apply/discApplyBatchMain/func_getIsOtherBankDiscParam",
        discFlag: "",
      };

      function validAcctNo(rule,val,callback){
        let re = /^[a-zA-Z0-9]{1,32}$/;
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，只能输入英文、数字"))
        }
      }

      function validPostCode(rule, val, callback) {
        let re = /^[0-9]{6}$/;
        if (val == null || val == '') {
          callback()
        }
        if (re.test(val)) {
          callback()
        } else {
          callback(new Error("非法输入，邮编由6位数字组成"))
        }
      }

      function validBuyPayPcetRule(rule, val, callback) {
        let re = /^(((\d|[1-9]\d)(\.\d{1,4})?))$/;
        if (val == null || val == '') {
          callback()
        }
        if (re.test(val)) {
          let num = Number(val);
          if (num === 0) {
            callback(new Error("买方付息比例应大于0"))
          } else {
            callback()
          }
        } else {
          callback(new Error("买方付息比例大于0且小于100,小数位不超过4位"))
        }
      }
    },
    mounted() {
      this.openI9flag = window.sessionStorage.getItem('isOpenI9') == '1' ? true : false;
      getDictListByGroups("ProtectType,RateType,PayType,DraftTypeCode,BillOrigin,SettleType,CorpScale,Yon,SettlementMarkCode,QueryType,ArbitrateMode,Industry,BanEndorsementMarkCode,AssetIndustryManage,AssetIndustry").then(res => {
        this.protectTypeList = res.get("ProtectType");
        this.rateTypeList = res.get("RateType");
        this.payTypeList = res.get("PayType");
        this.billTypeList = res.get("DraftTypeCode");
        this.corpScaleList = res.get("CorpScale");
        this.clearMarkList = res.get("SettlementMarkCode");
        this.isList = res.get("Yon");
        this.queryTypeList = res.get("QueryType");
        this.arbitrateModeList = res.get("ArbitrateMode");
        this.industryList = res.get("Industry");
        this.dictMap = res.get("map");
        this.busiClassifyList = res.get("AssetIndustryManage");
        this.billOriginList = res.get("BillOrigin");
        this.getProductList();


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
        this.clearMarkList = res.get("SettlementMarkCode");

        this.getIsAllowChoiceOtherAcctBranch();
        this.getIsCustMgrRequired();
        this.getIsAllowOtherCustMgr();
        this.getIsAllowBillRate();
      });
      this.getIsOtherBankDiscParam();
      getSingleParamValuesByKeys("pc.is_marketing_bank_mode").then(res => {
        let flag = res["pc.is_marketing_bank_mode"];
        this.isMarketMode = flag === '1';
        if (this.isMarketMode) {
          this.busiOwnBrchNo = this.$store.getters.userInfo.brchNo;
        }
      });
      post({ paramKey: "ce.disc.default_prod_type" }, "/sm/auth/systemParameter/findSystemParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.prodTypeChooseFormItem.busiClassify = res.data.retMsg ? res.data.retMsg : "1"
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      post({ paramKey: "ce.disc.is_allow_change_prod_type" }, "/sm/auth/systemParameter/findSystemParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.isAllowChangeProdType = res.data.retMsg;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      //查询业务参数，混包业务场景
      post({paramKey: "cs.mix_pack_busi_scene"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let mixPackBusiScene = res.data.retData;
            if(mixPackBusiScene) {
              if(mixPackBusiScene.indexOf("02") >= 0){
                this.isMixPack = true;
              }else{
                this.isMixPack = false;
              }
            }else {
              this.isMixPack = false;
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    computed: {
      tempshowEDiscApplyAddWin: {
        get() {
          return this.showEDiscApplyAddWin;
        },
        set() {
        }
      }
    },
    props: {
      funcNo: "",
      isCommit: "",
      operType: "",
      licenseFlag: "",
      authPath: "",
      discBatchId: "",
      isNeedUpdDiscImg: {
        type: Boolean,
        default: false
      },
      showEDiscApplyAddWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isNoticeFirstAudit: {
        type: String,
        default() {
          return "0"
        }
      },
      showNoticeFirstStationItem: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    watch: {
      showEDiscApplyAddWin(val) {
        if (val) {
          if (this.licenseFlag === true) {
            this.isAllowOtherCustMgr = true;
          }
          if (this.operType === "add") {
            this.$nextTick(() => {
              this.clearForm();
              this.$refs.addForm.resetFields();
              this.addForm.clearMark = "";
              this.addForm.banEndrsmtMark = "";
              this.addForm.isBillRate = "0";
              this.addForm.ownedBrchNo = this.$store.getters.userInfo.brchNo;
              this.addForm.ownedBrchName = this.$store.getters.userInfo.brchName;
              this.addForm.accountBrchNo = this.$store.getters.userInfo.brchNo;
              this.addForm.accountBrchName = this.$store.getters.userInfo.brchName;
              this.addForm.invoiceAfterFlag = "1";
              this.addForm.billClass = "ME02";
              this.$refs.datagrid.tData = [];
              this.onlyRead = false;
              this.canPick = false;
              this.addForm.isNoticeFirstAudit = this.isNoticeFirstAudit;
            });
          }
          if (this.operType === "modify") {
            if (this.isCommit === 'hasCommit') {
              this.onlyRead = true;
            }
            if (this.isCommit === 'noCommit') {
              this.onlyRead = false;
            }
            this.addForm.id = this.discBatchId;
            this.$nextTick(() => {
              this.addForm.isNoticeFirstAudit = this.isNoticeFirstAudit;
              this.queryObjById();
              this.handleSearch();
            });
          }
        }
      },
      'addForm.rateType'(val) {
        this.$refs.addForm.validateField('rate')
      }
    },
    methods: {
      getIsOtherBankDiscParam() {
        post({}, this.queryUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.discFlag = res.data.retMsg;
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
          }
        });
      },
      validDiscRate(rule, val, callback) {
        // 贴现利率是否只读为否时校验
        if (!this.discInterestRateOnlyRead) {
          //是否利率明细为否时校验
          if (this.addForm.isBillRate === '0') {
            if (this.addForm.rateType === "1") {
              let re = /^(((\d|[1-9]\d{1,3})(\.\d{1,4})?)|10000|10000\.0|10000\.00|10000\.000|10000\.0000)$/;
              if (re.test(val)) {
                callback();
              } else {
                callback(new Error("利率为0~10000之间的数，小数位不超过4位"));
              }
            } else if (this.addForm.rateType === "30") {
              let re = /^(((\d|[1-9]\d{1,2})(\.\d{1,4})?)|1000|1000\.0|1000\.00|1000\.000|1000\.0000)$/;
              if (re.test(val)) {
                callback();
              } else {
                callback(new Error("利率为0~1000之间的数，小数位不超过4位"));
              }
            } else if (this.addForm.rateType === "360") {
              let re = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
              if (re.test(val)) {
                callback();
              } else {
                callback(new Error("利率为0~100之间的数，小数位不超过4位"));
              }
            } else {
              callback(new Error("请选择利率类型"))
            }
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      getTreeHeight(isMax, msgRef) {
        this.$nextTick(() => {
          if (isMax) {
            let headerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header')[0].offsetHeight;
            let footerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-footer')[0].offsetHeight;
            let headerBtnHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header-wrapper')[0].offsetHeight;
            let mTreeHeight = window.innerHeight - (headerHeight + 1) - (footerHeight + 1) - headerBtnHeight - 20;
            if (window.sessionStorage.getItem("isTransfer") === "0") {
              let appObj = document.getElementsByClassName("app-main");
              let appOffsetHeight = appObj.length == 0 ? 0 : appObj[0].offsetHeight;
              mTreeHeight = appOffsetHeight - (headerHeight + 1) - (footerHeight + 1) - headerBtnHeight - 20;
            }
            this.mTreeHeight = mTreeHeight;
          } else {
            this.mTreeHeight = 300;
          }
        });
      },
      //查询批次信息
      queryObjById() {
        let id = this.discBatchId;
        let funcNo = this.funcNo;
        post({id: id, funcNo: funcNo}, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_queryDiscBatch").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.viewDetailForm = obj;
              if (obj.id){
                this.addForm.id = obj.id;
                this.addForm.ownedBrchNo = obj.busiBrchNo;
                this.addForm.ownedBrchName = obj.busiBrchName;
                if (this.isMixPack) {
                  this.addForm.billOriginList = obj.billOriginList;
                } else {
                  this.addForm.billOriginList = obj.billOriginList[0];
                }
                this.addForm.prodNo = obj.prodNo;
                this.addForm.custNo = obj.custNo;
                this.addForm.custAcctNo = obj.custAcctNo;
                this.addForm.custName = obj.custName;
                this.addForm.aoAcctNo = obj.aoAcctNo;
                this.addForm.bailAcctNo = obj.bailAcctNo;
                this.addForm.bailPcet = obj.bailPcet;
                this.addForm.acptCustNo = obj.acptCustNo;
                this.addForm.acptCustName = obj.acptCustName;
                this.addForm.aoAcctBankNo = obj.aoAcctBankNo;
                if (obj.redeemOpenDt != null && obj.redeemOpenDt !== "") {
                  this.addForm.redeemOpenDt = this.$moment(obj.redeemOpenDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                if (obj.redeemDueDt != null && obj.redeemDueDt !== "") {
                  this.addForm.redeemDueDt = this.$moment(obj.redeemDueDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                this.addForm.clearMark = obj.clearMark;
                this.addForm.legalNo = obj.legalNo;
                this.addForm.batchNo = obj.batchNo;
                this.addForm.billClass = obj.billClass;
                this.addForm.billType = obj.billType;
                if (obj.discDt != null && obj.discDt !== "") {
                  this.addForm.discDt = this.$moment(obj.discDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                this.addForm.payType = obj.payType;
                this.addForm.payCustName = obj.payCustName;
                this.addForm.payBankNo = obj.payBankNo;
                this.addForm.payCustNo = obj.payCustNo;
                this.addForm.payAcctNo = obj.payAcctNo;
                this.addForm.buyPayPcet = obj.buyPayPcet;
                this.addForm.custMgrNo = obj.custMgrNo;
                this.addForm.custMgrName = obj.custMgrName;
                this.addForm.custMgrBrchNo = obj.custMgrBrchNo;
                this.addForm.transBrchNo = obj.transBrchNo;
                this.addForm.isBillRate = obj.isBillRate;
                if (obj.isBillRate === "0") {
                  this.addForm.rateType = obj.rateType;
                  if (obj.rate === "0") {
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
                this.addForm.accountBrchNo = obj.accountBrchNo;
                this.addForm.redeemRate = obj.redeemRate;
                this.addForm.redeemRateType = obj.redeemRateType;
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
                if (!!obj.isNoticeFirstAudit) {
                  this.addForm.isNoticeFirstAudit = obj.isNoticeFirstAudit;
                } else {
                  this.addForm.isNoticeFirstAudit = this.isNoticeFirstAudit;//若老数据，则重新塞一个默认值
                }
                this.addForm.invoiceAfterFlag = obj.invoiceAfterFlag;
                this.addForm.forceInvoiceFlag = obj.forceInvoiceFlag;
              }

              this.addSumForm.sumCount = obj.sumCount;
              this.addSumForm.sumMoney = formatNumber(obj.sumMoney, 2, ',');
              this.addSumForm.sumBuyerInterest = formatNumber(obj.sumBuyerInterest, 2, ',');
              this.addSumForm.sumSalerInterest = formatNumber(obj.sumSalerInterest, 2, ',');
              this.addSumForm.sumInterest = formatNumber(obj.sumInterest, 2, ',');
              this.addSumForm.sumRealPayAmt = formatNumber(obj.sumRealPayAmt, 2, ',');
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
            this.$nextTick(() => {
              //修改时校验批次必输项,信贷推过来有必输项未输，不能直接挑票
              this.$refs["addForm"].validate(valid => {
                this.canPick = valid;
              });
            });
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //查询
      handleSearch() {
        this.formItem.batchId = this.discBatchId;
        this.formItem.funcNo = this.funcNo;
        this.currentSelectList = [];
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },

      handleClose() {
        this.clearForm();
        this.$emit("eDiscApplyAddWinClose", "");
      },

      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },

      handleDiscDtChange(value) {
        this.discBatchChooseFormItem.discDt = value.replace(/-/g, "");
      },

      clearVal(type) {
        if (type === 'custMgrName') {
          this.addForm.custMgrName = "";
          this.addForm.custMgrNo = "";
          this.addForm.custMgrBrchNo = "";
        }
      },

      //贴现批次挑选界面查询
      discBatchChooseFormSearch() {
        this.$refs.discBatchChooseDatagrid.dataChange(1);
      },

      //贴现批次挑选界面重置
      discBatchChooseReset() {
        this.$refs.discBatchChooseFormItem.resetFields();
      },

      //贴现批次挑选界面多选
      discBatchChooseSelectClick(arr) {
        this.discBatchChooseSelectList = arr;
      },
      discBatchChooseSelectClickCancel() {
        this.discBatchChooseSelectList = [];
      },

      //查询客户账号
      queryCustAcctNo() {
        if (this.addForm.custNo === "") {
          this.$msgTip.info(this, {info: "请先选择客户"});
          return;
        }
        this.showCustAcctNoWin = true;
      },

      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.addForm.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },

      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

      //查询客户保证金账号
      queryBailAcctNo() {
        if (this.addForm.protectType === '1') {
          //买方保贴，选承兑人保证金账号
          if (!this.addForm.acptCustNo) {
            this.$msgTip.info(this, {info: "请先选择承兑人名称!"});
            return;
          }
          this.selectCustNo = this.addForm.acptCustNo
        } else {
          //卖方保贴
          if (!this.addForm.custNo) {
            this.$msgTip.info(this, {info: "请先选择客户"});
            return;
          }
          this.selectCustNo = this.addForm.custNo
        }
        this.showCustAcctWin = true;
      },

      //根据客户保证金账号查询框所选数据进行赋值
      custAcctSelect(info) {
        this.addForm.bailAcctNo = info.custAcctNo;
        this.showCustAcctWin = false;
      },

      //客户保证金查询框关闭
      showCustAcctWinClose() {
        this.showCustAcctWin = false;
      },

      /* //查询机构弹出框
       queryBrchNo() {
         this.showBranchWin = true;
       },

       //根据弹框所选数据进行赋值
       brchNoChange(info) {
         this.addForm.accountBrchNo = info[0].id;
         this.addForm.accountBrchName = info[0].title;
         this.showBranchWin = false;
       },

       showBranchWinClose() {
         this.showBranchWin = false;
       },*/

      //查询客户经理
      queryCustManager() {
        this.showCustManagerWin = true;
      },

      //赋值
      custManagerSelectList(info) {
        this.addForm.custMgrNo = info.custMgrNo;
        this.addForm.custMgrName = info.custMgrName;
        this.addForm.custMgrBrchNo = info.custMgrBrchNo;
        this.showCustManagerWin = false;
      },

      //关闭弹窗
      showCustManagerWinClose() {
        this.showCustManagerWin = false;
      },

      //导入按钮
      importBatch() {
        if (this.addForm.prodNo === "") {
          this.$msgTip.info(this, {info: "请先选择业务类型"});
          return;
        }
        if (this.addForm.custNo === "") {
          this.$msgTip.info(this, {info: "请先选择客户"});
          return;
        }
        if (this.addForm.aoAcctNo === "") {
          this.$msgTip.info(this, {info: "请先选择入账账号"});
          return;
        }
        if (this.addForm.billOriginList === "") {
          this.$msgTip.info(this, {info: "请先选择票据来源"});
          return;
        }
        this.discBatchChooseFormItem.aoAcctNo = this.addForm.aoAcctNo;
        this.discBatchChooseFormItem.prodNo = this.addForm.prodNo;
        this.discBatchChooseFormItem.isBillRate = this.addForm.isBillRate;
        this.discBatchChooseFormItem.ownedBrchNo = this.addForm.ownedBrchNo;
        this.discBatchChooseFormItem.ownedBrchName = this.addForm.ownedBrchName;
        this.discBatchChooseFormItem.billOriginList = this.addForm.billOriginList;
        this.discBatchChooseWin = true;
        this.$nextTick(() => {
          if (this.licenseFlag) {
            this.$refs.discBatchChooseDatagrid.controlColumnsHidden("ownedBrchName", false);
          } else {
            this.$refs.discBatchChooseDatagrid.controlColumnsHidden("ownedBrchName", true);
          }
          this.discBatchChooseFormSearch();
        });
      },

      doubleHandleClick(arr) {
        this.discBatchChooseSelectList = arr;
        this.discBatchChooseFormSubmit();
      },

      //导入界面确认按钮
      discBatchChooseFormSubmit() {
        if (this.discBatchChooseSelectList.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (this.discBatchChooseSelectList.redeemOpenDt !== "" && this.discBatchChooseSelectList.redeemOpenDt != null) {
          this.addForm.redeemOpenDt = this.$moment(this.discBatchChooseSelectList.redeemOpenDt, "YYYYMMDD").format("YYYY-MM-DD");
          this.addForm.redeemDueDt = this.$moment(this.discBatchChooseSelectList.redeemDueDt, "YYYYMMDD").format("YYYY-MM-DD");
          this.addForm.redeemRate = this.discBatchChooseSelectList.redeemRate;
          //赎回利率类型默认年利率
          this.addForm.redeemRateType = "360";
        }
        // this.addForm.billType = this.discBatchChooseSelectList[0].billType;
        this.addForm.custAcctNo = this.discBatchChooseSelectList.custAcctNo;

        this.addForm.clearMark = this.discBatchChooseSelectList.clearMark;
        this.addForm.banEndrsmtMark = this.discBatchChooseSelectList.banEndrsmtMark;
        this.addForm.discDt = this.$moment(this.discBatchChooseSelectList.discDt, "YYYYMMDD").format("YYYY-MM-DD");
        this.addForm.rate = accMul(this.discBatchChooseSelectList.rate, 100);
        this.discBatchChooseSelectList = [];
        this.discBatchChooseWin = false;
      },

      //贴现批次挑选界面取消按钮
      discBatchChooseClose() {
        this.discBatchChooseSelectList = [];
        this.discBatchChooseWin = false;
      },

      //保存批次按钮
      formSave() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = "/ce/disc/elec/apply/eDiscApplyBatchMain/func_insertOrUpateDiscBatch";
            let msg = this.operType === "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            if (this.canPick) {
              msg = this.$t('m.i.common.modifySuccess');
            }
            let batchParam = this.deepClone(this.addForm);
            if (this.addForm.isBillRate === '0') {
              if (this.addForm.rate === "0") {
                batchParam.rate = "0";
              } else {
                if (this.addForm.rateType === "360") {
                  batchParam.rate = accDiv(this.addForm.rate, 100);
                }
                if (this.addForm.rateType === "30") {
                  batchParam.rate = accDiv(this.addForm.rate, 1000);
                }
                if (this.addForm.rateType === "1") {
                  batchParam.rate = accDiv(this.addForm.rate, 10000);
                }
              }
            } else if (this.addForm.isBillRate === '1') {
              batchParam.rateType = "";
              batchParam.rate = "";
            }
            batchParam.discDt = this.$moment(this.addForm.discDt).format("YYYYMMDD");
            if (this.addForm.redeemOpenDt !== "" && this.addForm.redeemOpenDt != null) {
              batchParam.redeemOpenDt = this.$moment(this.addForm.redeemOpenDt).format("YYYYMMDD");
              batchParam.redeemDueDt = this.$moment(this.addForm.redeemDueDt).format("YYYYMMDD");
            }
            if (this.addForm.payType === "1") {
              batchParam.buyPayPcet = "100";
              batchParam.thirdPayPcet = "0";
            } else if (this.addForm.payType === "2") {
              batchParam.buyPayPcet = "0";
              batchParam.thirdPayPcet = "0";
            } else if (this.addForm.payType === "4") {
              batchParam.buyPayPcet = "0";
              batchParam.thirdPayPcet = "100";
            } else if (this.addForm.payType === "3") {
              batchParam.thirdPayPcet = "0";
              batchParam.buyPayPcet = this.addForm.buyPayPcet;
            }
            this.submitFlag = true;
            post(batchParam, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, {info: msg});
                  this.discBatchId = res.data.retData;
                  this.canPick = true;
                  this.formItem.batchId = res.data.retData;
                  this.queryObjById();
                  this.handleSearch();
                  this.currentSelectList = [];
                  this.operType = "modify";
                  this.$emit("pageReFresh", "");
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.currentSelectList = [];
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }

            });
          }
        });
      },

      //点击挑票，打开弹框
      discPickBillWinOpen() {
        if (this.operType === "add") {
          if (this.canPick) {
            this.jumpToBillWin();
          } else {
            this.$msgTip.info(this, {info: "请先保存批次"});
            return;
          }
        }
        if (this.operType === "modify") {
          this.$refs["addForm"].validate(valid => {
            if (valid) {
              if (this.canPick) {
                this.jumpToBillWin();
              } else {
                this.$msgTip.info(this, {info: "请先保存批次"});
              }
            } else {
              this.canPick = false;
              this.$msgTip.info(this, {info: "批次信息必输项校验不通过"});
            }
          });
        }
      },

      //跳转到挑票界面
      jumpToBillWin() {
        this.discPickBillForm.aoAcctNo = this.addForm.aoAcctNo;
        this.discPickBillForm.aoAcctBankNo = this.addForm.aoAcctBankNo;
        this.discPickBillForm.custAcctNo = this.addForm.custAcctNo;
        this.discPickBillForm.discDt = this.$moment(this.addForm.discDt).format("YYYYMMDD");
        this.discPickBillForm.billClass = this.addForm.billClass;
        this.discPickBillForm.billType = this.addForm.billType;
        this.discPickBillForm.clearMark = this.addForm.clearMark;
        this.discPickBillForm.banEndrsmtMark = this.addForm.banEndrsmtMark;
        this.discPickBillForm.isBillRate = this.addForm.isBillRate;
        this.discPickBillForm.licenseFlag = this.licenseFlag;
        this.discPickBillForm.ownedBrchNo = this.addForm.ownedBrchNo;
        this.discPickBillForm.billOriginList = this.addForm.billOriginList;
        if (this.discPickBillForm.isBillRate === "0") {
          this.discPickBillForm.rateType = this.addForm.rateType;
          if (this.addForm.rate === "0") {
            this.discPickBillForm.rate = "0";
          } else {
            if (this.addForm.rateType === "360") {
              this.discPickBillForm.rate = accDiv(this.addForm.rate, 100);
            }
            if (this.addForm.rateType === "30") {
              this.discPickBillForm.rate = accDiv(this.addForm.rate, 1000);
            }
            if (this.addForm.rateType === "1") {
              this.discPickBillForm.rate = accDiv(this.addForm.rate, 10000);
            }
          }
        }else {
          this.discPickBillForm.rateType = "";
          this.discPickBillForm.rate = "";
        }
        this.discPickBillForm.prodNo = this.addForm.prodNo;
        this.discPickBillWin = true;
      },

      //挑票界面根据弹框所选票进行赋值
      discPickBillChange(info, callback) {
        let transIds = "";
        let hldrIds = "";
        let btrcIdDtoList = [];
        for (let i = 0, count = info.length; i < count; i++) {
          if (info[i].transId !== "") {
            transIds += info[i].transId;
            if (i < info.length - 1) {
              transIds += ",";
            }
          }
          if (info[i].hldrId !== "") {
            hldrIds += info[i].hldrId;
            if (i < info.length - 1) {
              hldrIds += ",";
            }
          }
          let btrcIdDto = {
            "hldrId": info[i].hldrId,
            "transId": info[i].transId,
            "billId": info[i].billId,
            "billRangeStart": info[i].billRangeStart,
            "billRangeEnd": info[i].billRangeEnd
          }
          btrcIdDtoList.push(btrcIdDto);
        }
        let batchId = this.discBatchId;
        post({
          batchId: batchId,
          transIds: transIds,
          hldrIds: hldrIds,
          btrcIdDtoList: btrcIdDtoList
        }, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_pickDiscBillInfoElec").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, {info: res.data.retMsg});
              this.discPickBillWin = false;
              this.queryObjById();
              this.handleSearch();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
              callback();
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            callback();
          }
        });
      },

      //挑票界面取消按钮
      discPickBillWinClose() {
        this.discPickBillWin = false;
      },

      //删除按钮
      deleteDetailed() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDeleteDetailed();
          }
        });
      },

      handleDeleteDetailed() {
        let ids = this.$refs.datagrid.selectIds.join(",");
        post({discIds: ids}, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_deleteDiscBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, {info: this.$t("m.i.common.deleteSuccess")});
              this.queryObjById();
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
              this.currentSelectList = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //利息计算按钮
      interestCalculation() {
        this.$loadingbox.open({
          title: "利息计算中，请稍后..."
        });
        post({id: this.discBatchId}, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_calculateInterest").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$loadingbox.close();
              this.$msgTip.success(this);
              this.queryObjById();
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
            } else {
              this.$loadingbox.close();
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$loadingbox.close();
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //调整顺延天数
      changeDelayDays() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        this.delayDaysChangeWin = true;
      },

      //调整顺延天数界面提交
      delayDaysChangeSubmit() {
        let ids = this.$refs.datagrid.selectIds.join(",");
        this.delayDaysChangeFormItem.id = this.discBatchId;
        this.delayDaysChangeFormItem.ids = ids;
        this.$refs["delayDaysChangeFormItem"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.delayDaysChangeFormItem, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_calculateInterest").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.delayDaysChangeWin = false;
                  this.$refs.delayDaysChangeFormItem.resetFields();
                  this.currentSelectList = [];
                  this.queryObjById();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.$refs.gridPage.clearElevator();
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.$refs.gridPage.clearElevator();
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        })
      },

      //调整顺延天数界面关闭
      delayDaysChangeClose() {
        // this.currentSelectList = [];
        this.delayDaysChangeWin = false;
      },

      exportBillExcel() {
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        if (this.operType === "add") {
          if (this.canPick) {
            this.exportForm();
          } else {
            this.$msgTip.info(this, {info: "请先保存批次"});
            return;
          }
        } else if (this.operType === "modify") {
          this.param = "eDiscApplListExportInfo";
          this.tempShowExcelTemplateWin = true;
        }
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },

      exportForm(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/disc/elec/apply/eDiscApplyBatchMain/func_exportExcel";
        if (exportType === "1") {
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              discIds: this.$refs.datagrid.selectIds,
              funcNo: this.formItem.funcNo,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              funcNo: this.formItem.funcNo,
              batchId: this.formItem.batchId,
              billClass: this.formItem.billClass,
              ownedBrchName: this.formItem.ownedBrchName,
              field: field,
              exportType: exportType,
              excelName: this.param,
            };
          }
          post(params, url).then(res => {
            if (res.status === 200 && res.data === null) {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else if (res.status === 200 && res.data === "") {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else {
              this.$msgTip.error(this, {info: "异步导出失败"});
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "discIds";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "funcNo";
            input2.value = this.formItem.funcNo;
            form.appendChild(input2);
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
            input5.value = this.param;
            form.appendChild(input5);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement("input");
              input1.type = "text";
              input1.name = "pageSize";
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1);
            }
            // let input2 = document.createElement("input");
            // input2.type = "text";
            // input2.name = "funcNo";
            // input2.value = this.formItem.funcNo;
            // form.appendChild(input2);
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
            input5.value = this.param;
            form.appendChild(input5);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      //业务类型选择界面
      prodTypeChoose() {
        this.prodTypeChooseWin = true;
      },
      prodTypeChooseClose() {
        this.prodTypeChooseWin = false;
      },
      //业务类型选择界面提交
      prodTypeChooseSubmit(assetIndustryRef, assetIndustry) {
        this.prodTypeChooseFormItem.batchId = this.discBatchId;
        let ids = this.$refs.datagrid.selectIds.join(",");
        this.prodTypeChooseFormItem.discIds = ids;
        let funcNo = this.funcNo;
        this.$refs["prodTypeChooseFormItem"].$refs[assetIndustryRef].validate(valid => {
          if (valid) {
            if (this.$refs.datagrid.tData.length === 0) {
              this.$msgTip.info(this, {info: "该批次下无数据"});
              return;
            }
            this.submitFlag = true;
            post({
              busiClassify: assetIndustry, funcNo: funcNo,
              batchId: this.prodTypeChooseFormItem.batchId, discIds: this.prodTypeChooseFormItem.discIds
            }, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_updateBusiClassify").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, {info: msg});
                  this.prodTypeChooseWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.$refs.datagrid.clearElevator();
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, {info: msg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.$refs.gridPage.clearElevator();
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      //批次提交或选择提交
      submitList(str) {
        this.submitType = str;
        if (this.submitType === "select") {
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
            return;
          }
          let dataList = this.$refs.datagrid.selects;
          let flag1 = window.sessionStorage.getItem("isOpenI9") == "1" ? true : false;
          if (flag1) {
            for (let i = 0; i < dataList.length; i++) {
              if (dataList[i].busiClassify == null || dataList[i].busiClassify == "" || dataList[i].busiClassify == undefined) {
                this.$msgTip.info(this, {info: "资产分类为空的票不允许提交"});
                return;
              }
            }
          }

          let list = this.$refs.datagrid.selects;
          this.discIds = this.$refs.datagrid.selectIds.join(",");
          let params = {batchId: this.discBatchId, ids: this.discIds};
          let flag = "";
          for (let i = 0, count = list.length; i < count; i++) {
            if (list[i].isSame === "0") {
              flag = "1";
              this.submitBillNo = list[i].billNo;
              this.submitBillRangeStart = list[i].billRangeStart;
              this.submitBillRangeEnd = list[i].billRangeEnd;
              break;
            }
          }
          if (flag === "1" && this.isNotForceDisc(this.addForm.prodNo)) {
            if (this.addForm.clearMark === "SM00") {
              this.$msgTip.info(this, {info: "利息计算不一致，线上清算不允许提交"});
              return;
            }else if (this.addForm.clearMark === "ST01") {
              this.$msgTip.info(this, {info: "利息计算不一致，票款对付（DVP）不允许提交"});
              return;
            } else {
              let content = `<p class="word-break">存在与人行报文利息不一致的票据,如:票据(包)号码 ${formatBillNoAndRange(this.submitBillNo, this.submitBillRangeStart, this.submitBillRangeEnd)},确定提交申请吗？</p>`;
              this.$hMsgBox.confirm({
                title: this.$t("m.i.common.confirm"),
                content: content,
                onOk: () => {
                  if (this.isNeedUpdDiscImg) {
                    this.checkDiscImgUpd(params)
                  } else {
                    this.endrsmtCheckWinShow(params);
                  }
                }
              });
            }
          } else {
            if (this.isNeedUpdDiscImg) {
              this.checkDiscImgUpd(params)
            } else {
              this.endrsmtCheckWinShow(params);
            }
          }
        }
        if (this.submitType === "batch") {
          if (this.discBatchId === "") {
            this.$msgTip.info(this, {info: "请先保存批次"});
            return;
          }
          if (this.$refs.datagrid.tData.length === 0) {
            this.$msgTip.info(this, {info: "该批次下无数据"});
            return;
          }

          let dataList = this.$refs.datagrid.tData;
          let flag1 = window.sessionStorage.getItem("isOpenI9") == "1" ? true : false;
          console.log(flag1)
          if (flag1) {
            for (let i = 0; i < dataList.length; i++) {
              if (dataList[i].busiClassify == null || dataList[i].busiClassify == "" || dataList[i].busiClassify == undefined) {
                this.$msgTip.info(this, {info: "资产分类为空的票不允许提交"});
                return;
              }
            }
          }
          let list = this.$refs.datagrid.tData;
          let params = {batchId: this.discBatchId};
          let flag = "";
          for (let i = 0, count = list.length; i < count; i++) {
            if (list[i].isSame === "0") {
              flag = "1";
              this.submitBillNo = list[i].billNo;
              this.submitBillRangeStart = list[i].billRangeStart;
              this.submitBillRangeEnd = list[i].billRangeEnd;
              break;
            }
          }
          if (flag === "1" && this.isNotForceDisc(this.addForm.prodNo)) {
            if (this.addForm.clearMark === "SM00") {
              this.$msgTip.info(this, {info: "利息计算不一致，线上清算不允许提交"});
              return;
            }else if (this.addForm.clearMark === "ST01") {
              this.$msgTip.info(this, {info: "利息计算不一致，票款对付（DVP）不允许提交"});
              return;
            } else {
              let content = `<p class="word-break">存在与人行报文利息不一致的票据,如:票据(包)号码 ${formatBillNoAndRange(this.submitBillNo, this.submitBillRangeStart, this.submitBillRangeEnd)},确定提交申请吗？</p>`;
              this.$hMsgBox.confirm({
                title: this.$t("m.i.common.confirm"),
                content: content,
                onOk: () => {
                  if (this.isNeedUpdDiscImg) {
                    this.checkDiscImgUpd(params);
                  } else {
                    this.endrsmtCheckWinShow(params);
                  }
                }
              });
            }
          } else {
            if (this.isNeedUpdDiscImg) {
              this.checkDiscImgUpd(params)
            } else {
              this.endrsmtCheckWinShow(params);
            }
          }
        }
      },
      //提交前先调用风险检查接口
      getRiskBillNo(params) {
        post(params, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_getRiskBillNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let data = res.data.retData;
            if (retCode === "000000") {
              if (Object.keys(data).length > 0) {
                this.riskCheckWin = true;
                this.riskParams.gridDatas = data;
                this.riskParams.submitParams = params;
                this.riskParams.YonList = this.isList;
              } else {
                this.confirmAgainWin = true;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },

      handleSubmit(info, isRiskCkeck) {
        if (isRiskCkeck) {
          this.riskCheckWinClose(info);
        }
        this.confirmAgainWin = false;
        let params = {};
        if (this.submitType === 'select') {
          params = {batchId: this.discBatchId, ids: this.discIds, billOperType: '0'};
        } else if (this.submitType === 'batch') {
          params = {batchId: this.discBatchId, billOperType: '1'};
        }
        post(params, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_whiteRollCheck").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (msg === null) {
                this.handleSubmitAgain()
              } else {
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: msg,
                  height: 300,
                  onOk: () => {
                    this.handleSubmitAgain();
                  }
                });
              }
            } else {
              this.$msgTip.error(this, {info: msg});
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },

      handleSubmitAgain() {
        let params = {};
        if (this.submitType === 'select') {
          params = {batchId: this.discBatchId, discIds: this.discIds};
          if (this.addForm.prodNo === '01061321' || this.addForm.prodNo === '01061322') {
            this.checkDiscQuoteRate(params);
          } else {
            this.submitApply();
          }
        } else if (this.submitType === 'batch') {
          params = {batchId: this.discBatchId};
          if (this.addForm.prodNo === '01061321' || this.addForm.prodNo === '01061322') {
            this.checkDiscQuoteRate(params);
          } else {
            this.submitApply();
          }
        }
      },
      submitApply() {
        let params = {};
        if (this.submitType === 'select') {
          params = {batchId: this.discBatchId, discIds: this.discIds};
        } else if (this.submitType === 'batch') {
          params = {batchId: this.discBatchId};
        }
        post(params, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_submitElecFlow").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              if (this.submitType === 'select') {
                if (this.$refs.datagrid.total === this.$refs.datagrid.selects.length) {
                  this.handleClose();
                } else {
                  this.queryObjById();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.$refs.gridPage.clearElevator();
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                }
              } else if (this.submitType === 'batch') {
                this.handleClose();
              }
            } else {
              this.$msgTip.error(this, {info: msg});
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      checkDiscQuoteRate(params) {
        post(params, '/ce/disc/elec/apply/eAcptApplyMain/func_checkDiscQuoteRate').then((res) => {
          if (res) {
            let retCode = res.data.retCode;
            let msg = res.data.retMsg;
            if (retCode === "000000") {
              if (msg === "" || msg === null || msg === undefined) {
                this.submitApply()
              } else {
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: "票据" + "[" + msg + "]" + "贴现利率与贴现通意向成交利率不一致，是否继续提交？",
                  onOk: () => {
                    this.submitApply();
                  }
                });
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      //撤销按钮
      cancelApplyBatch() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },

      handleCancelApplyBatch() {
        post({batchId: this.discBatchId}, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_cancelFlow").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, {info: msg});
              this.handleClose();
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              // this.currentBillSelectList = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
          }
        });
      },

      //票面信息关闭
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      //票面信息
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },

      //风险票据检查界面关闭
      riskCheckWinClose() {
        this.riskParams = {};
        this.riskCheckWin = false;
      },

      //风险票据检查界面提交
      riskCheckSubmit(info) {
        this.handleSubmit(info, true);
      },

      //查询业务类型
      getProductList() {
        let billClass = "2";
        post({billClass: billClass}, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_queryDiscProdRelation").then(res => {
          if (res && res.data.retCode === "000000") {
            this.busiTypeList = res.data.retData;
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        });
      },

      busiTypeChange() {
        if (this.addForm.prodNo.endsWith("1")) {
          this.addForm.billType = "AC01";
        } else if (this.addForm.prodNo.endsWith("2")) {
          this.addForm.billType = "AC02";
        } else {
          this.addForm.billType = "";
        }
        if (this.addForm.prodNo.indexOf('010611') === 0) {
          // this.notShow = true;
          this.addForm.clearMark = "SM01";
          this.addForm.discDt = window.sessionStorage.getItem("workDate");
        } else {
          // this.notShow = false;
          // this.addForm.clearMark = "";
          // this.addForm.discDt = "";
        }
        if (this.operType === 'add') {
          this.addForm.bailAcctNo = "";
          // 清空已经输入的贴现利率
          this.addForm.rate = "";
          // 重置利率校验
          this.$refs.addForm.resetValidateField('rate');
        }
        if (this.addForm.prodNo === '01061121' || this.addForm.prodNo === '01061122') {
          this.discInterestRateOnlyRead = false;
        } else {
          this.discInterestRateOnlyRead = true;
        }
      },

      //付息方式change方法
      payTypeChange() {
        if (this.addForm.payType === "1") {
          this.addForm.buyPayPcet = "";
          this.addForm.thirdCustNo = "";
          this.addForm.thirdCustName = "";
          this.addForm.thirdAcctNo = "";
        } else if (this.addForm.payType === "2") {
          this.addForm.payCustNo = '';
          this.addForm.payCustName = "";
          this.addForm.buyPayPcet = "";
          this.addForm.payAcctNo = "";
          this.addForm.thirdCustNo = "";
          this.addForm.thirdCustName = "";
          this.addForm.thirdAcctNo = "";
        } else if (this.addForm.payType === "3") {
          this.addForm.thirdCustNo = "";
          this.addForm.thirdCustName = "";
          this.addForm.thirdAcctNo = "";
        } else if (this.addForm.payType === "4") {
          this.addForm.payCustNo = '';
          this.addForm.payCustName = "";
          this.addForm.buyPayPcet = "";
          this.addForm.payAcctNo = "";
        }
      },

      //获取系统参数（控制账务机构是否可选）ce.disc.is_allow_choice_other_acct_branch
      getIsAllowChoiceOtherAcctBranch() {
        let paramKey = "ce.disc.is_allow_choice_other_acct_branch";
        post({paramKey: paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isAllowChoiceOtherAcctBranch = res.data.retData;
              this.isAllowChoiceOtherAcctBranch = isAllowChoiceOtherAcctBranch === "1";
            } else {
              this.isAllowChoiceOtherAcctBranch = false;
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
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
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //获取系统参数（控制客户经理是否可选）
      getIsAllowOtherCustMgr() {
        post({}, "/ce/disc/paper/apply/discApplyBatchMain/func_getCustMgrforConfigCenter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isAllowOtherCustMgr = res.data.retData.isAllowOtherCustMgr;
              this.isAllowOtherCustMgr = isAllowOtherCustMgr === "1";
            } else {
              this.isAllowOtherCustMgr = false;
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //获取系统参数（是否允许明细利率）ce.disc.is_allow_bill_rate
      getIsAllowBillRate() {
        let paramKey = "ce.disc.is_allow_bill_rate";
        post({paramKey: paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isAllowBillRate = res.data.retData;
              this.isAllowBillRate = isAllowBillRate === "1";
            } else {
              this.isAllowBillRate = false;
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //查询买方付息人名称
      queryPayCustName() {
        this.showPayCustNameWin = true;
      },

      showPayCustNameWinClose() {
        this.showPayCustNameWin = false;
      },

      payCustNameSelect(info) {
        this.addForm.payCustNo = info.custNo;
        this.addForm.payCustName = info.custName;
        if (info.custAcctNo !== "") {
          this.addForm.payAcctNo = info.custAcctNo;
        } else {
          this.addForm.payAcctNo = "";
        }
        this.showPayCustNameWin = false;
      },

      payCustNameChange() {
        this.addForm.payCustNo = "";
        this.addForm.payAcctNo = '';
      },
      //查询承兑人名称
      queryAcptCustName() {
        this.showAcptCustNameWin = true;
      },

      showAcptCustNameWinClose() {
        this.showAcptCustNameWin = false;
      },

      acptCustNameSelect(info) {
        this.addForm.acptCustNo = info.custNo;
        this.addForm.acptCustName = info.custName;
        if (info.custAcctNo !== "") {
          this.addForm.bailAcctNo = info.custAcctNo;
        } else {
          this.addForm.bailAcctNo = "";
        }
        this.showAcptCustNameWin = false;
      },

      acptCustNameChange() {
        this.addForm.acptCustNo = "";
        this.addForm.bailAcctNo = '';
      },
      //查询买方付息人账号
      queryPayAcctNo() {
        if (this.addForm.payCustName === "") {
          this.$msgTip.info(this, {info: "请先选择买方付息人名称！"});
          return;
        }
        this.showPayAcctNoWin = true;
      },

      //赋值
      payAcctNoSelectSubmit(info) {
        this.addForm.payAcctNo = info.custAcctNo;
        this.showPayAcctNoWin = false;
      },

      //关闭弹窗
      showPayAcctNoWinClose() {
        this.showPayAcctNoWin = false;
      },

      //查询第三方付息人名称
      queryThirdCustName() {
        this.showThirdCustNameWin = true;
      },

      showThirdCustNameWinClose() {
        this.showThirdCustNameWin = false;
      },

      thirdCustNameSelect(info) {
        this.addForm.thirdCustNo = info.custNo;
        this.addForm.thirdCustName = info.custName;
        if (info.custAcctNo !== "") {
          this.addForm.thirdAcctNo = info.custAcctNo;
        } else {
          this.addForm.thirdAcctNo = "";
        }
        this.showThirdCustNameWin = false;
      },

      thirdCustNameChange() {
        this.addForm.thirdCustNo = "";
        this.addForm.thirdAcctNo = '';
      },

      //查询第三方付息人账号
      queryThirdAcctNo() {
        if (this.addForm.thirdCustName === "") {
          this.$msgTip.info(this, {info: "请先选择第三方付息人名称！"});
          return;
        }
        this.showThirdAcctNoWin = true;
      },

      //赋值
      thirdAcctNoSelectSubmit(info) {
        this.addForm.thirdAcctNo = info.custAcctNo;
        this.showThirdAcctNoWin = false;
      },

      //关闭弹窗
      showThirdAcctNoWinClose() {
        this.showThirdAcctNoWin = false;
      },

      confirmAgainClose() {
        this.confirmAgainWin = false;
      },

      //清除数据
      clearForm() {
        this.addForm.redeemRate = "";
        this.addForm.redeemRateType = "";
        this.addForm.id = "";
        this.addForm.batchNo = "";
        this.addForm.billId = "";
        this.addForm.prodNo = "";
        this.addForm.ownedBrchNo = "";
        this.addForm.ownedBrchName = "";
        this.addForm.custNo = "";
        this.addForm.custName = "";
        this.addForm.custAcctNo = "";
        this.addForm.protectType = "";
        this.addForm.corpScale = "";
        this.addForm.isGreenCorp = "";
        this.addForm.redeemOpenDt = "";
        this.addForm.redeemDueDt = "";
        this.addForm.clearMark = "";
        this.addForm.banEndrsmtMark = "";
        this.addForm.billType = "";
        this.addForm.aoAcctNo = "";
        this.addForm.bailAcctNo = "";
        this.addForm.bailPcet = "";
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
        this.addSumForm.sumCount = "";
        this.addSumForm.sumMoney = "";
        this.addSumForm.sumBuyerInterest = "";
        this.addSumForm.sumSalerInterest = "";
        this.addSumForm.sumInterest = "";
        this.addSumForm.sumRealPayAmt = "";
      },

      //贴现合同打印
      contractPrinting() {
        if (this.discBatchId === "") {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
        post({id: this.discBatchId, funcNo: this.funcNo}, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_printDiscContract").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.assembleDiscParams(res.data.retData);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },

      assembleDiscParams(discContract) {
        let vocherData = [];
        discContract.discYear = discContract.discDt.toString().substring(0, 4);
        discContract.discMonth = discContract.discDt.toString().substring(4, 6);
        discContract.discDate = discContract.discDt.toString().substring(6, 8);
        let count = discContract.count === null ? "0" : discContract.count;
        discContract.upperCount = numToUpper(count.toString(), true);
        let sumBillMoney = discContract.sumBillMoney === null ? "0" : discContract.sumBillMoney;
        discContract.upperSumBillMoney = cmycurd(sumBillMoney);
        let sumRealPayMoney = discContract.sumRealPayMoney === null ? "0" : discContract.sumRealPayMoney;
        discContract.upperSumRealPayMoney = cmycurd(sumRealPayMoney);
        if (discContract.rate != null) {
          discContract.rate = accMul(discContract.rate, 100) + "(%)";
        } else {
          discContract.rate = "";
        }
        let discContractBills = this.assembleDiscBills(discContract.discContractBills);
        discContract.discContractBills = discContractBills;
        discContract.printObj = JSON.stringify(discContract);
        vocherData.push(discContract);
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: {voucherType: "PE030601", vocherData: vocherData}, billInfo: discContractBills,
          callback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.$refs.datagrid.$refs.gridPage.clearElevator();
            this.currentSelectList = [];
          },
          errorCallback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.$refs.datagrid.$refs.gridPage.clearElevator();
            this.currentSelectList = [];
          }
        });
      },

      assembleDiscBills(discContractBills) {
        let bodyHtml = [];
        let bodyStr1 = "";
        let bodyStr2 = "";
        for (let i = 0; i < discContractBills.length; i++) {
          if (!!discContractBills[i].remitDt) {
            discContractBills[i].remitDt = this.$moment(discContractBills[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (!!discContractBills[i].dueDt) {
            discContractBills[i].dueDt = this.$moment(discContractBills[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          discContractBills[i].billMoney = formatNumber(discContractBills[i].billMoney, 2, ',');

          let acptBankName = discContractBills[i].acptBankName == null ? "" : discContractBills[i].acptBankName;
          if (i < 10) {
            bodyStr1 += "<tr>";
            bodyStr1 += "<td class='ta-c'>" + (1 + i) + "</td>";
            bodyStr1 += "<td>" + discContractBills[i].billNo + "</td>";
            bodyStr1 += "<td>" + discContractBills[i].billMoney + "</td>";
            bodyStr1 += "<td>" + acptBankName + "</td>";
            bodyStr1 += "<td>" + discContractBills[i].remitDt + "</td>";
            bodyStr1 += "<td>" + discContractBills[i].dueDt + "</td>";
            bodyStr1 += "<td>" + accMul(discContractBills[i].rate, 100) + "</td>";
            bodyStr1 += "</tr>";
          } else {
            bodyStr2 += "<tr>";
            bodyStr2 += "<td class='ta-c'>" + (1 + i) + "</td>";
            bodyStr2 += "<td>" + discContractBills[i].billNo + "</td>";
            bodyStr2 += "<td>" + discContractBills[i].billMoney + "</td>";
            bodyStr2 += "<td>" + acptBankName + "</td>";
            bodyStr2 += "<td>" + discContractBills[i].remitDt + "</td>";
            bodyStr2 += "<td>" + discContractBills[i].dueDt + "</td>";
            bodyStr2 += "<td>" + accMul(discContractBills[i].rate, 100) + "</td>";
            bodyStr2 += "</tr>";
          }
        }
        let bodyHtml1 = `<div class="list-table-box"><table class="list-table">
            <thead>
              <tr>
                <th class="ta-c"><b>序号</b></th>
                <th>汇票号码</th>
                <th>汇票金额</th>
                <th>承兑银行</th>
                <th>出票日期</th>
                <th>汇票到期日</th>
                <th>贴现利率(%)</th>
              </tr>
            </thead>
            <tbody>${bodyStr1}</tbody>
          </table>
        </div>`
        bodyHtml.push(bodyHtml1);
        if (!!bodyStr2) {
          let bodyHtml2 = `<div class="list-table-box">
            <table class="list-table">
              <tbody>${bodyStr2}</tbody>
            </table>
          </div>`
          bodyHtml.push(bodyHtml2);
        }
        return bodyHtml;
      },

      /*贴现审批书打印*/
      checkPrinting() {
        if (this.discBatchId === "") {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
        let discDto = {batchId: this.discBatchId, funcNo: this.funcNo};
        post(discDto, "/ce/disc/paper/apply/discApplyBatchMain/func_printDiscCheck").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.getDiscCheckTemp(res.data.retData);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },

      getDiscCheckTemp(discCheck) {
        post({voucherType: 'PE030708'}, "/pe/print/printConf/printConfManger/queryPrintConfByVoucherType").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let billListJson = {};
              if (res.data.retData !== null) {
                if (res.data.retData.confContent !== undefined && res.data.retData.confContent !== null && res.data.retData.confContent !== "") {
                  billListJson = JSON.parse(res.data.retData.confContent);
                }
              }
              this.discCheckParams(discCheck, billListJson);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },

      discCheckParams(discCheck, billListJson) {
        let vocherData = [];
        let data = {};
        data.year = discCheck.discDt.toString().substring(0, 4);
        data.month = discCheck.discDt.toString().substring(4, 6);
        data.date = discCheck.discDt.toString().substring(6, 8);
        data.applyName = discCheck.applyName;
        data.applyAcctNo = discCheck.applyAcctNo;
        data.applyBankName = discCheck.applyBankName;
        data.legalName = '';
        data.addr = discCheck.addr;
        data.linkMan = '';
        data.phoneNo = discCheck.phoneNo;
        data.discUse = discCheck.discUse;
        data.billType = getDictValueFromMap(this.dictMap, "DraftTypeCode", discCheck.billType);
        data.sumCount = discCheck.sumCount;
        data.sumMoney = formatNumber(discCheck.sumMoney, 2, ',');
        data.billInfoList = this.assembleDiscCheckBills(discCheck.discContractBills, billListJson);
        data.printObj = JSON.stringify(data);
        vocherData.push(data);
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: {voucherType: "PE030708", vocherData: vocherData}, billInfo: data.billInfoList,
          callback: () => {

          },
          errorCallback: () => {

          }
        });
      },

      //组装审批票据明细
      assembleDiscCheckBills(billInfoList, billListJson) {
        let bodyHtml = [];
        let bodyStr1 = "";
        let bodyStr2 = "";
        if (billInfoList !== null && Object.keys(billListJson).length !== 0) {
          for (let i = 0; i < billInfoList.length; i++) {
            if (!!billInfoList[i].remitDt) {
              billInfoList[i].remitDt = this.$moment(billInfoList[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            if (!!billInfoList[i].dueDt) {
              billInfoList[i].dueDt = this.$moment(billInfoList[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            billInfoList[i].billMoney = formatNumber(billInfoList[i].billMoney, 2, ',');
            billInfoList[i].fee = formatNumber(billInfoList[i].fee, 2, ',');
            billInfoList[i].vochFee = formatNumber(billInfoList[i].vochFee, 2, ',');
            if (i < 6) {
              bodyStr1 += "<tr>";
              bodyStr1 += "<td class='ta-c'>" + (1 + i) + "</td>";
              for (let key in billListJson) {
                let temp = billInfoList[i][key] === null ? '' : billInfoList[i][key];
                bodyStr1 += "<td>" + temp + "</td>";
              }
              bodyStr1 += "</tr>";
            }
          }
        }
        if (Object.keys(billListJson).length !== 0) {
          let headHtml = "";
          for (let key in billListJson) {
            headHtml += "<th>" + billListJson[key] + "</th>";
          }
          let bodyHtml1 = `<div class="list-table-box"><table class="list-table">
            <thead>
              <tr>
                <th class="ta-c"><b>序号</b></th>
                ${headHtml}
              </tr>
            </thead>
            <tbody>${bodyStr1}</tbody>
          </table>
        </div>`
          bodyHtml.push(bodyHtml1);
          if (!!bodyStr2) {
            let bodyHtml2 = `<div class="list-table-box">
            <table class="list-table">
              <tbody>${bodyStr2}</tbody>
            </table>
          </div>`
            bodyHtml.push(bodyHtml2);
          }
          return bodyHtml;
        } else {
          return "";
        }
      },

      /*贴现审批书打印结束*/
      endrsmtCheckWinShow(params) {
        post({bn: "0"}, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_getEndrsmtCheckParams").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let rs = res.data.retData;
              this.endrsmtParams.backFlag = rs[0];
              this.endrsmtParams.impawnFlag = rs[1];
              this.endrsmtParams.sameFlag = rs[2];
              this.endrsmtParams.blackFlag = rs[3];
              if (this.endrsmtParams.backFlag === '0'
                && this.endrsmtParams.impawnFlag === '0'
                && this.endrsmtParams.sameFlag === '0'
                && this.endrsmtParams.blackFlag === '0') {
                //无需校验背书风险类型
                this.getRiskBillNo(params);
              } else {
                this.endrsmtParams.batchId = params.batchId;
                this.endrsmtParams.ids = params.ids;
                this.endrsmtParams.endrsmtCheckUrl = "/ce/disc/elec/apply/eDiscApplyBatchMain/func_getEndrsmtCheckResult";
                this.endrsmtParams.blackEndrsmtCheckUrl = "/ce/disc/elec/apply/eDiscApplyBatchMain/func_getBlackEndrsmtCheckResult";
                this.showEDiscEndrsmtCheckWin = true;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });

      },

      endrsmtCheckWinClose() {
        this.showEDiscEndrsmtCheckWin = false;
        this.endrsmtParams = {
          batchId: "",
          ids: "",
          backFlag: "0",
          impawnFlag: "0",
          sameFlag: "0",
          blackFlag: "0",
        }
      },

      endrsmtCheckWinSubmit(params) {
        this.showEDiscEndrsmtCheckWin = false;
        this.getRiskBillNo(params)
      },

      discImgUpload() {
        if (this.operType === "add") {
          if (this.canPick) {
          } else {
            this.$msgTip.info(this, {info: "请先保存批次"});
            return;
          }
        }
        this.imageParams.listId = this.discBatchId;
        this.imageParams.prodNo = this.addForm.prodNo;
        this.imageParams.imgType = 'IM20';
        this.imageParams.uploadUrl = window.LOCAL_CONFIG.API_HOME + '/ce/disc/elec/apply/discApplyBatchMain/func_uploadImage';
        this.imageParams.viewUrl = window.LOCAL_CONFIG.API_HOME + '/ce/disc/elec/apply/discApplyBatchMain/func_imageById';
        this.showUploadImageWin = true;
      },

      uploadImageWinClose() {
        this.showUploadImageWin = false;
      },

      checkDiscImgUpd(params) {
        post({
          listId: this.discBatchId,
          prodNo: this.addForm.prodNo,
          imgType: this.imgType
        }, '/ce/disc/paper/apply/discApplyBatchMain/func_countImgList').then((res) => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === 0) {
                this.$msgTip.info(this, {info: "该批次未进行贴现资料影像维护"});
              } else {
                this.endrsmtCheckWinShow(params);
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },

      licenseBrchNoChange(info) {
        //this.addForm.ownedBrchNo = info[0].id;
        //this.addForm.ownedBrchName = info[0].title;
        this.addForm.accountBrchNo = info[0].brchNo;
        this.addForm.accountBrchName = info[0].brchName;
        // this.brchNoWin = false;
      },

      /* //根据弹框所选数据进行赋值
       brchNoWinOpen() {
         this.brchNoWin = true;
       },

       brchNoWinClose() {
         this.brchNoWin = false;
       },*/

      //机构弹窗
      dictNameSelectWinOpen() {
        this.dictNameSelectWin = true;
      },

      dictNameSelectWinClose() {
        this.dictNameSelectWin = false;
      },

      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = false;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },

      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = true;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },

      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            this.$set(arr[i], "expand", isExpand);
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },

      //选择机构名称
      queryDetailName() {
        post({code: "IndustryCategoryDetail"}, "/sm/config/dictionary/getIndustyDetailDict").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.expandTree(data);
            this.indTreeData = data;
          }
          this.dictNameSelectWin = true;
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },

      getDictValue() {
        post({
          dictGroupCode: "IndustryCategoryDetail",
          key: this.addForm.industryCategory
        }, "/sm/config/dictionary/getDictValue").then(res => {
          if (res) {
            let dictValue = res.data.retMsg;
            if (dictValue == null || dictValue == "" || dictValue == undefined) {
              dictValue = this.addForm.industryCategory;
            }
            this.addForm.industryCategoryName = dictValue;
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },

      //选择机构名称弹出框确认
      indNameAdd() {
        let arr = this.$refs["indTreeData"].getSelectedNodes();
        if (arr[0].id.length < 5) {
          this.$msgTip.error(this, {info: "请选择具体行业投向！"});
          return;
        }
        this.addForm.industryCategory = arr[0].id;
        this.addForm.industryCategoryName = arr[0].title;
        this.dictNameSelectWin = false;
      },

      //关联发票
      relationInvoice() {
        if (this.$refs.datagrid.selects.length === 1) {
          this.billPickInvoiceParams.listId = this.$refs.datagrid.selectIds;
          this.billPickInvoiceParams.custNo = this.addForm.custNo;
          this.billPickInvoiceParams.billNo = this.$refs.datagrid.selects[0].billNo;
          this.billPickInvoiceParams.invoiceFlag = this.$refs.datagrid.selects[0].invoiceFlag;
          this.billPickInvoiceParams.billMoney = this.$refs.datagrid.selects[0].billMoney;
          this.billPickInvoiceParams.batchNo = this.addForm.batchNo;
          this.billPickInvoiceParams.billId = this.$refs.datagrid.selects[0].billId;
          this.billPickInvoiceParams.billRangeStart = this.$refs.datagrid.selects[0].billRangeStart;
          this.billPickInvoiceParams.billRangeEnd = this.$refs.datagrid.selects[0].billRangeEnd;
          this.billPickInvoiceParams.dictMap = this.dictMap;
          this.billPickInvoiceWin = true;
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
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
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },

      billPickInvoiceChange(listId) {
        if (this.billPickInvoiceParams.invoiceFlag === "1") {
          this.billPickInvoiceWinClose();
        } else {
          post({id: listId}, "/ce/disc/elec/apply/eDiscApplyBatchMain/func_relatedInvoice").then(res => {
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
        if (this.$refs.datagrid.selects.length === 1) {
          let invoiceFlag = this.$refs.datagrid.selects[0].invoiceFlag;
          if (invoiceFlag === "1") {
            this.relationInvoiceBillParams.listId = this.$refs.datagrid.selects[0].id;
            this.relationInvoiceBillParams.cancelRelationUrl = "/ce/disc/elec/apply/eDiscApplyBatchMain/func_cancelRelatedInvoice";
            this.relationInvoiceBillParams.dictMap = this.dictMap;
            this.relationInvoiceBillWin = true;
          } else {
            this.$msgTip.info(this, {info: this.$t("m.i.ce.relationInvoiceError")});
            return;
          }
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
      },

      //发票管理返回
      relationInvoiceBillWinClose() {
        this.relationInvoiceBillParams.listId = "";
        this.relationInvoiceBillParams.cancelRelationUrl = "";
        this.relationInvoiceBillWin = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },
      recursiveAssigNode(menuTreeData, arr) {
        this.flag = false;
        for (let i = 0; i < menuTreeData.length; i++) {
          if (this.flag) {
            break;
          }
          if (menuTreeData[i].id === arr.id) {
            menuTreeData[i] = arr;
            this.flag = true;
            break;
          }
          if (menuTreeData[i].children) {
            this.recursiveAssigNode(menuTreeData[i].children, arr)
          }
        }
      },
      isAllExpand(arr) {
        this.flag = true;
        for (let i = 0; i < arr.length; i++) {
          if (!this.flag) {
            break;
          }
          if (arr[i].expand === false && arr[i].children) {
            this.flag = false;
            break;
          }
          if (arr[i].children) {
            this.isAllExpand(arr[i].children)
          }
        }
      },
      toggleExpand(arr, status) {
        let closeCount = 0;
        this.recursiveAssigNode(this.indTreeData, arr);
        this.isAllExpand(this.indTreeData);
        // 完全收缩
        for (let i = 0; i < this.indTreeData.length; i++) {
          if (this.indTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.indTreeData.length) {
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = true;
          return;
        }
        if(!this.flag){
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = false;
        }else{
          this.isExpandDisabled = true;
          this.isNotExpandDisabled = false;
        }

      },
      isNotForceDisc(prodNo){
        return prodNo !== '01061121' && prodNo !== '01061122';
      }
    },
  };
</script>

<style scoped>

</style>
