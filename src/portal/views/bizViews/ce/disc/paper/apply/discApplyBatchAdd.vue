<template>
  <div class="h-tree-search">
    <div class="h-modal-header-wrapper">
      <h-msg-box v-model="tempshowDiscApplyAddWin" :mask-closable="false" @on-close="handleClose" width="1000"
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
              <!--<own-brch-no :addForm = "addForm" @brchNoWinOpen="brchNoWinOpen" v-if="this.licenseFlag"></own-brch-no>-->
              <show-branch v-model="addForm.ownedBrchName" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchName"
                           title="机构名称" required :showCheckBox="false" :msgBoxWin="tempshowDiscApplyAddWin"
                           :brchNo.sync="addForm.ownedBrchNo" :brchName.sync="addForm.ownedBrchName"
                           v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                           @brchNoChange="licenseBrchNoChange($event)"
                           url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                           queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
              </show-branch>
              <busi-type v-model="addForm.prodNo" prop="prodNo" :dictList="busiTypeList" :required="true"
                         :readonly="operType==='modify'"
                         @on-change="busiTypeChange" :paramsMap="{key:'prodNo',value:'prodName'}"></busi-type>
              <cust-no :addForm="addForm" :operType="operType"></cust-no>
              <cust-name :formItem="addForm" :required="isRequired" :showIcon="false"></cust-name>
              <cust-acct-no-group :formItem="addForm" :isRequired="isRequired" :operType="operType"
                                  @selectCustAcctByCustNo="selectCustAcctByCustNo"></cust-acct-no-group>
              <corp-scale :formItem="addForm" :corpScaleList="corpScaleList" :isRequired="isRequired"></corp-scale>
              <is-green-corp :formItem="addForm" :isList="isList" :isRequired="isRequired"></is-green-corp>
              <ao-acct-no-paper :formItem="addForm" :isRequired="isRequired" :discFlag="discFlag"
                                :onlyRead="onlyRead"></ao-acct-no-paper>
              <agent-cust-name :formItem="addForm" :agencyShow="agencyShow" :onlyRead="onlyRead"></agent-cust-name>
              <agent-cust-acct-no :formItem="addForm" :agencyShow="agencyShow"
                                  :onlyRead="onlyRead"></agent-cust-acct-no>
              <agent-cust-bank-no :formItem="addForm" :agencyShow="agencyShow" :onlyRead="onlyRead"
                                  :bankNoRule="bankNoRule"></agent-cust-bank-no>
              <!--<account-brch-no :formItem = "addForm"></account-brch-no>
              <account-brch-name :formItem = "addForm" :isRequired="isRequired" :isAllowChoiceOtherAcctBranch="isAllowChoiceOtherAcctBranch" @queryBrchNo="queryBrchNo"></account-brch-name>-->
              <show-branch v-model="addForm.accountBrchName" :label="$t('m.i.common.accountBrchName')"
                           prop="accountBrchName" title="机构名称"
                           :isRequired="isRequired" :msgBoxWin="tempshowDiscApplyAddWin" :showCheckBox="false"
                           :filterable="isAllowChoiceOtherAcctBranch"
                           :brchNo.sync="addForm.accountBrchNo" :brchName.sync="addForm.accountBrchName">
              </show-branch>
              <cust-mgr-no :formItem="addForm"></cust-mgr-no>
              <cust-mgr-name :formItem="addForm" :isCustMgrRequired="isCustMgrRequired" :isAllowOtherCustMgr="isAllowOtherCustMgr" :isCustMgrClearable="isAllowOtherCustMgr"
                             @clearVal="clearVal('custMgrName')" @queryCustManager="queryCustManager"></cust-mgr-name>
              <trans-ctrct-no :formItem="addForm" :onlyRead="onlyRead"></trans-ctrct-no>
              <protect-type :formItem="addForm" :protectTypeList="protectTypeList" :isRequired="isRequired"
                            v-if="addForm.prodNo==='01060612' || addForm.prodNo==='01061012' || addForm.prodNo==='01060312' || addForm.prodNo==='01060712'"></protect-type>
              <guarntr-no :formItem="addForm" @queryBailAcctNo="selectCustBailAcctByCustNo" :isRequired="isRequired"
                          v-if="addForm.prodNo === '01060312'"></guarntr-no>
              <bill-type v-model="addForm.billType" :dictList="billTypeList" :readonly="true"
                         :required="isRequired"></bill-type>
              <ce-disc-dt :formItem="addForm" :isRequired="isRequired" :onlyRead="onlyRead"></ce-disc-dt>
              <is-bill-rate :formItem="addForm" :isList="isList" :operType="operType" :onlyRead="onlyRead"
                            :isAllowBillRate="isAllowBillRate" v-if="isAllowBillRate"></is-bill-rate>
              <disc-interest-rate :formItem="addForm" :onlyRead="onlyRead" :rateRule="rateRule"
                                  v-if="addForm.isBillRate==='0'" :required="addForm.isBillRate==='0'"></disc-interest-rate>
              <rate-type :formItem="addForm" :rateTypeList="rateTypeList" :onlyRead="onlyRead" :isDisabled="false"
                         v-if="addForm.isBillRate==='0'"></rate-type>
              <pay-type :formItem="addForm" :payTypeList="payTypeList" :onlyRead="onlyRead" :isRequired="isRequired"
                        @payTypeChange="payTypeChange"></pay-type>
              <pay-cust-name :formItem="addForm" :onlyRead="onlyRead" @queryPayCustName="queryPayCustName"
                             @payCustNameChange="payCustNameChange"></pay-cust-name>
              <buy-pay-pcet :formItem="addForm" :onlyRead="onlyRead" :buyPayPcetRule="buyPayPcetRule"></buy-pay-pcet>
              <pay-acct-no :formItem="addForm" :onlyRead="onlyRead" @queryPayAcctNo="queryPayAcctNo" :maxlength="32" :payAcctNoRule="acctNoRule"></pay-acct-no>
              <third-cust-name :formItem="addForm" :onlyRead="onlyRead" @queryThirdCustName="queryThirdCustName"
                               @thirdCustNameChange="thirdCustNameChange"></third-cust-name>
              <third-cust-no :formItem="addForm" :onlyRead="onlyRead" :maxlength="32" :thirdAcctNoRule="acctNoRule"
                             @queryThirdAcctNo="queryThirdAcctNo"></third-cust-no>
              <query-type :formItem="addForm" :queryTypeList="queryTypeList" @queryTypeChange="queryTypeChange"
                          :isQueryRecovery="isQueryRecovery" :onlyRead="onlyRead"></query-type>
              <is-back-query :formItem="addForm" :isList="isList" :isQueryRecovery="isQueryRecovery"
                             :onlyRead="onlyRead"></is-back-query>
              <invoice-after-flag :formItem="addForm" :youList="isList"></invoice-after-flag>
              <force-invoice-flag :formItem="addForm" :youList="isList"
                                  v-if="addForm.invoiceAfterFlag === '0'"></force-invoice-flag>
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
              url="/ce/disc/paper/apply/discApplyBatchMain/func_pageQueryCeDiscBillList"
              :bindForm="formItem"
              :row-select="true"
              :has-select="hasSelect"
              ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <pick-bill-btn
                  v-if="(this.isCommit === 'noCommit' && this.addForm.prodNo === '01061111')|| (this.isCommit === 'noCommit'&& this.addForm.prodNo === '01061112')"
                  @discPickBillWinOpen="pickBillWinOpen"></pick-bill-btn>
                <add-btn v-if="this.isCommit === 'noCommit' && this.addForm.prodNo.indexOf('010611') === -1"
                         @handleForm="discAddOrModifyBill"></add-btn>
                <modify-btn v-if="this.isCommit === 'noCommit'" @handleForm="discAddOrModifyBill"></modify-btn>

                <batch-import-btn v-if="this.isCommit === 'noCommit' && this.addForm.prodNo.indexOf('010611') === -1"
                                  @batchImport="batchImport"></batch-import-btn>
                <delete-btn v-if="this.isCommit === 'noCommit'" @deleteData="deleteDetailed"></delete-btn>
                <calc-interest-btn v-if="this.isCommit === 'noCommit'"
                                   @interestCalculation="interestCalculation"></calc-interest-btn>
                <change-delay-days-btn v-if="this.isCommit === 'noCommit'"
                                       @changeDelayDays="changeDelayDays"></change-delay-days-btn>
                <batch-export-btn :isCommit="this.isCommit" @exportBillExcel="exportBillExcel"></batch-export-btn>
                <template-download-btn v-if="this.isCommit === 'noCommit'"
                                       @handleExport="exportBillNoExcel"></template-download-btn>
                <prod-type-choose-btn v-if="openI9flag && this.isCommit === 'noCommit'" @prodTypeChoose="prodTypeChoose"></prod-type-choose-btn>
                <disc-img-upload-btn :isCommit="this.isCommit" :isNeedUpdDiscImg="this.isNeedUpdDiscImg"
                                     @discImgUpload="discImgUpload"></disc-img-upload-btn>
                <relation-invoice-btn :isCommit="this.isCommit"
                                      @relationInvoice="relationInvoice"></relation-invoice-btn>
                <invoice-manager-btn :isCommit="this.isCommit" @invoiceManager="invoiceManager"></invoice-manager-btn>
                <submit-btn @submitList="submitList" v-if="isCommit === 'noCommit'"></submit-btn>
                <cancel-apply-batch-btn :isCommit="this.isCommit"
                                        @cancelApplyBatch="cancelApplyBatch"></cancel-apply-batch-btn>
                <contract-printing-btn :isCommit="this.isCommit"
                                       @contractPrinting="contractPrinting"></contract-printing-btn>
                <check-printing-btn :isCommit="this.isCommit" @checkPrinting="checkPrinting"></check-printing-btn>

              </div>
            </h-datagrid>
          </div>
        </div>
        <!-- 弹出框模式底部按钮 -->
        <div slot="footer">
        </div>
      </h-msg-box>
    </div>

    <!--调整顺延天数界面-->
    <h-msg-box v-model="delayDaysChangeWin" width="400" @on-close="delayDaysChangeClose" class="h-form-table-layer"
               :maximize="true">
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
            <div>确定提交申请吗</div>
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
    <!--
        <show-branch :showBranchWin="showBranchWin" :title="$t('m.i.ce.brchQuery')" @brchNoChange="brchNoChange" @showBranchWinClose="showBranchWinClose"></show-branch>
    -->
    <!--查询客户经理-->
    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="$t('m.i.ce.selectManager')"
                       @showCustManagerWinClose="showCustManagerWinClose" :selectType="'apply'"
                       @custManagerSelectList="custManagerSelectList"></show-cust-manager>
    <!--查询客户账号-->
    <show-cust-acct :showCustAcctWin="showCustAcctWin" :selectCustNo="addForm.custNo" :title="'查看账户'"
                    :selectType="'select'" :ifClearBtn="isFalse" :custAcctKind="1" :discFlag="discFlag"
                    @showCustAcctWinClose="showCustAcctWinClose" @custAcctSelect="custAcctSelect"></show-cust-acct>
    <!--查询保证金账号-->
    <show-cust-acct :showCustAcctWin="showCustBailAcctWin" :selectCustNo="addForm.custNo" :title="'查看保证金账户'"
                    :selectType="'select'" :ifClearBtn="isFalse" :custAcctKind="2"
                    @showCustAcctWinClose="showCustBailAcctWinClose"
                    @custAcctSelect="custBailAcctSelect"></show-cust-acct>
    <!--挑票-->
    <disc-pick-bill :discPickBillWin="discPickBillWin" @discPickBillWinClose="discPickBillWinClose"
                    :queryRefusedUrl="'/ce/disc/paper/apply/discApplyBatchMain/func_pageQueryRefusedDsicBillList'"
                    @discPickBillChange="discPickBillChange" :disc-pick-bill-form="discPickBillForm"></disc-pick-bill>
    <!--新增明细-->
    <disc-add-bill :discAddBillWin="discAddBillWin" @discAddBillWinClose="discAddBillWinClose"
                   @discAddBillChange="discAddBillChange" :billType="this.discBillType" :operType="this.addWinOperType"
                   :billId="this.discAddWinBillId" :billNo="this.discAddWinBillNo" :isBillRate="addForm.isBillRate"
                   :submitFlag="this.addSubmitFlag"></disc-add-bill>

    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    ref="billInfoMain"></bill-info-main>

    <!--买方付息人名称-->
    <show-cust-message :show-cust-message-win="showPayCustNameWin" @custCorpWinClose="showPayCustNameWinClose"
                       @custCorpSelectSubmit="payCustNameSelect"></show-cust-message>
    <!-- 买方付息人账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showPayAcctNoWin" :cust-no="this.addForm.payCustNo"
                       :cust-name="this.addForm.payCustName" @showCustAcctNoWinClose="showPayAcctNoWinClose"
                       @custAcctNoSelectSubmit="payAcctNoSelectSubmit"></show-cust-acct-no>

    <!--第三方付息人名称-->
    <show-cust-message :show-cust-message-win="showThirdCustNameWin" @custCorpWinClose="showThirdCustNameWinClose"
                       @custCorpSelectSubmit="thirdCustNameSelect"></show-cust-message>
    <!-- 第三方付息人账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showThirdAcctNoWin" :cust-no="this.addForm.thirdCustNo"
                       :cust-name="this.addForm.thirdCustName" @showCustAcctNoWinClose="showThirdAcctNoWinClose"
                       @custAcctNoSelectSubmit="thirdAcctNoSelectSubmit"></show-cust-acct-no>
    <!--风险信息-->
    <risk-check :riskCheckWin="riskCheckWin" :riskParams="riskParams" @riskCheckWinClose="riskCheckWinClose"
                @riskCheckSubmit="riskCheckSubmit"></risk-check>
    <!-- 影像上传 -->
    <show-disc-image-upload :show-upload-image-win="showUploadImageWin" :params="imageParams"
                            @uploadImageWinClose="uploadImageWinClose"></show-disc-image-upload>

    <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="licenseBrchNoChange" :authPath="authPath"
                          @showBranchWinClose="brchNoWinClose" :ifcheck="false"></show-license-branch>-->
    <common-excel-download @handleSubmit="exportForm" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin"
                           :param="this.param" :rows="this.rows"></common-excel-download>

    <invoice-pick-bill :billPickInvoiceWin="billPickInvoiceWin" :billPickInvoiceParams="billPickInvoiceParams"
                       @billPickInvoiceWinClose="billPickInvoiceWinClose"
                       @billPickInvoiceChange="billPickInvoiceChange"></invoice-pick-bill>

    <relation-invoice-bill-info :relationInvoiceBillWin="relationInvoiceBillWin"
                                :relationInvoiceBillParams="relationInvoiceBillParams"
                                @relationInvoiceBillWinClose="relationInvoiceBillWinClose"></relation-invoice-bill-info>

  </div>
</template>

<script>
  import { accDiv, accMul, cmycurd, formatNumber, getDictListByGroups, getSingleParamValuesByKeys, numToUpper, off, on, post, getDictValueFromMap, getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "discApplyBatchAdd",
    components: {
      DiscAddBill: () => import(/* webpackChunkName: "ce/disc/paper/apply/discAddBill" */`@/views/bizViews/ce/disc/paper/apply/discAddBill`),
      ShowCustAcct: () => import(/* webpackChunkName: "bm/cust/acct/showCustAcct" */`@/views/bizViews/bm/cust/acct/showCustAcct`),
      DiscPickBill: () => import(/* webpackChunkName: "ce/disc/paper/apply/discPickBill" */`@/views/bizViews/ce/disc/paper/apply/discPickBill`),
      CommonFileUpload: () => import(/* webpackChunkName: "ce/disc/paper/apply/DiscCommonFileUpload" */`@/views/bizViews/ce/disc/paper/apply/DiscCommonFileUpload`),
      // ShowBranch:() => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      ShowCustManager: () => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
      ShowDiscImageUpload: () => import(/* webpackChunkName: "ce/disc/common/showDiscImageUpload" */`@/views/bizViews/ce/disc/common/showDiscImageUpload`),
      "invoice-pick-bill": () => import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/billPickInvoice`),
      "relation-invoice-bill-info": () => import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/relationInvoiceBillInfo`),
      AssetIndustry: () => import(/* webpackChunkName: "be/market/quote/rebuy/assetIndustry" */`@/views/bizViews/be/market/quote/rebuy/assetIndustry`)
    },
    data() {
      let _that = this;
      return {
        isFirstOpen: true,
        busiOwnBrchNo: '',
        isMarketMode: false,
        openI9flag: false,
        btnAuth: "",
        childrenBtnAuth: {},
        addForm: {
          id: "",
          legalNo: "",
          batchNo: "",
          billClass: "ME01",
          billType: "",
          custNo: "",
          custAcctNo: "",
          custName: "",
          discDt: window.sessionStorage.getItem("workDate"),
          rate: "",
          rateType: "360",
          payType: "2",
          payCustName: "",
          payBankNo: "",
          payCustNo: "",
          payAcctNo: "",
          buyPayPcet: "",
          prodNo: "",
          custMgrNo: this.$store.getters.userInfo.userNo,
          custMgrName: this.$store.getters.userInfo.userName,
          custMgrBrchNo: this.$store.getters.userInfo.brchNo,
          ownedBrchNo: "",
          ownedBrchName: "",
          transBrchNo: "",
          accountBrchNo: this.$store.getters.userInfo.brchNo,
          accountBrchName: this.$store.getters.userInfo.brchName,
          saveBrchNo: "",
          busiBrchNo: "",
          operBrchNo: "",
          redeemRate: "",
          redeemRateType: "",
          redeemOpenDt: "",
          redeemDueDt: "",
          aoAcctNo: "",
          bailAcctNo: "",
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
          industryCategoryName: "",
          invoiceAfterFlag: "1",
          forceInvoiceFlag: "",
          isNoticeFirstAudit: ""
        },
        addSumForm: {
          sumCount: "",
          sumMoney: "",
          sumBuyerInterest: "",
          sumSalerInterest: "",
          sumInterest: "",
          sumRealPayAmt: "",
        },
        formItem: {
          funcNo: "",
          billClass: "ME01",
          batchId: "",
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
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
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
            title: this.$t("m.i.ce.isSameCity"),
            key: "isSameCity",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isSameCity);
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
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
        },
        discOptions: {
          disabledDate(date) {
            return date && date.valueOf() < _that.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
          }
        },
        tableRef: "selfTable",
        discBillType: "",
        addWinOperType: "",
        discAddWinBillId: "",
        discAddWinBillNo: "",
        billId: "",
        discIds: "",
        submitType: "",
        imgType: 'IM20',
        isAllowChangeProdType: '1',
        riskParams: {},
        imageParams: {},
        discAddBillInfoForm: {},
        indTreeData: [],
        currentSelectList: [],
        protectTypeList: [],
        rateTypeList: [],
        payTypeList: [],
        queryTypeList: [],
        arbitrateModeList: [],
        billTypeList: [],
        corpScaleList: [],
        industryList: [],
        isList: [],
        busiTypeList: [],
        busiClassifyList: [],
        dictMap: new Map(),
        paramMap: new Map(),
        param: null,
        rows: null,
        readonly: false,
        submitFlag: false,
        isRequired: true,
        isFalse: false,
        isSelectAcct: false,
        addSubmitFlag: false,
        agencyShow: false,
        canPick: false,
        onlyRead: false,//当已提交进入明细时，为true将所有字段变为readonly
        confirmAgainWin: false,
        // brchNoWin:false,
        showCustAcctWin: false,
        showCustBailAcctWin: false,
        discAddBillWin: false,
        showBillInfoWin: false,
        //挑票
        discPickBillWin: false,
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
          isBillRate: "",
          prodNo: "",
        },
        //调整顺延天数
        delayDaysChangeFormItem: {
          id: "",
          ids: "",
          delayDays: "",
        },
        delayDaysChangeWin: false,
        //批量导入
        importWin: false,
        fileParams: {
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/disc/paper/analysisExcelData",  //导入excel数据解析接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/disc/paper/saveExcelData",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {
            batchId: '',
            billClass: '',
            inOutFlag: ''
          },     //需在反显数据中额外添加的字段
          columns: [
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center"
            },
            {
              title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.remitDt"),
              key: "remitDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.dueDt"),
              key: "dueDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.billMoneyByUnit"),
              key: "billMoney",
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
              title: this.$t("m.i.billInfo.acptName"),
              key: "acptName",
              sortable: true,
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.drwrName"),
              key: "drwrName",
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.drwrAcctNo"),
              key: "drwrAcctNo",
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
              title: this.$t("m.i.billInfo.pyeeName"),
              key: "pyeeName",
              sortable: true,
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.pyeeAcctNo"),
              key: "pyeeAcctNo",
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.pyeeBankName"),
              key: "pyeeBankName",
              sortable: true,
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.ce.isSameCity"),
              key: "isSameCity",
              hiddenCol: false,
              render: (h, params) => {
                return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isSameCity));
              }
            },
            {
              title: this.$t("m.i.billInfo.acptBankNo"),
              key: "acptBankNo",
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.drweBankAddr"),
              key: "drweBankAddr",
              hiddenCol: false,
            }
          ],
          paramKey: "list"
        },
        //业务分类界面
        prodTypeChooseFormItem: {
          busiClassify: "1",
          batchId: "",
          discIds: ""
        },
        isAllowChoiceOtherAcctBranch: false,  //通过参数控制账务机构是否可选
        // showBranchWin : false,  //账务机构弹出框
        showCustManagerWin: false,  //客户经理弹出框
        isCustMgrRequired: false,  //通过参数控制客户经理是否必输
        isAllowOtherCustMgr: false, //通过参数控制客户经理是否可选
        isQueryRecovery: false,  //纸票贴现是否查询查复参数控制查询方式是否显示
        isAllowBillRate: false, //是否允许明细利率参数
        prodTypeChooseWin: false,
        showPayCustNameWin: false,
        showPayAcctNoWin: false,
        showThirdCustNameWin: false,
        showThirdAcctNoWin: false,
        //风险信息窗口
        riskCheckWin: false,
        hasSelect: false,
        showUploadImageWin: false,
        isIndustryDetail: false,
        dictNameSelectWin: false,
        isDisabled: false,
        isExpandDisabled: true,
        isNotExpandDisabled: false,
        flag:false,
        tempShowExcelTemplateWin: false,
        billPickInvoiceWin: false,
        relationInvoiceBillWin: false,
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
        rateRule: [{test: this.validDiscRate, trigger: "blur"}],
        advanceRateRule: [{
          test: /^(((\d|[1-9]\d{1,3})(\.\d{1,4})?)|10000|10000\.0|10000\.00|10000\.000|10000\.0000)$/,
          trigger: 'blur',
          message: '利率为0~10000之间的数，小数位不超过4位'
        }],
        phoneNoRule: [{test: /^[0-9]{1,13}$/, trigger: "blur", message: "电话由不超过13位数字组成"}],
        intRule: [{test: /^(0|\+?[1-9][0-9]{0,8})$/, trigger: "blur", message: "只能输入不超过9位的正整数或0"}],
        postCodeRule: [{test: validPostCode, trigger: 'blur'}],
        delayDaysRule: [{test: /^[0-9]{1,2}$/, trigger: "blur", message: "顺延天数由不超过2位数字组成"}],
        bankNoRule: [{test: /^\d{12}$/, trigger: "blur", message: "行号由12位数字组成"}],
        buyPayPcetRule: [{test: validBuyPayPcetRule, trigger: 'blur'}],
        acctNoRule: [{ test: validAcctNo, trigger: "blur" }],
        mTreeHeight: 300,
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
    },
    mounted() {
      this.openI9flag = window.sessionStorage.getItem('isOpenI9') == '1' ? true : false;
      getDictListByGroups("ProtectType,RateType,PayType,QueryType,ArbitrateMode,DraftTypeCode,CorpScale,Yon,Industry,AssetIndustryManage,AssetIndustry").then(res => {
        // this.busiClassifyList = res.get("AssetIndustry");
        this.busiClassifyList = res.get("AssetIndustryManage");
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
      });
      this.getProductList();
      this.getIsAllowChoiceOtherAcctBranch();
      this.getIsQueryRecovery();
      this.getIsAllowBillRate();
      this.getCustManagerName();
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if (this.btnAuth.manager != null && this.btnAuth.manager != undefined) {
              if (this.btnAuth.manager.children != null && this.btnAuth.manager.children != undefined) {
                this.childrenBtnAuth = this.btnAuth.manager.children;
              }
            }
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, {info: retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
      post({paramKey: "ce.disc.default_prod_type"}, "/sm/auth/systemParameter/findSystemParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.prodTypeChooseFormItem.busiClassify = res.data.retMsg ? res.data.retMsg : "1"
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
      post({paramKey: "ce.disc.is_allow_change_prod_type"}, "/sm/auth/systemParameter/findSystemParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.isAllowChangeProdType = res.data.retMsg;
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
      this.getIsOtherBankDiscParam();
      getSingleParamValuesByKeys("pc.is_marketing_bank_mode").then(res => {
        let flag = res["pc.is_marketing_bank_mode"];
        this.isMarketMode = flag === '1';
        if (this.isMarketMode) {
          this.busiOwnBrchNo = this.$store.getters.userInfo.brchNo;
        }
      });
      on(window, "resize", this.handleResize);
    },
    computed: {
      tempshowDiscApplyAddWin: {
        get() {
          return this.showDiscApplyAddWin;
        },
        set() {
        }
      }
    },
    props: {
      funcNo: String,
      isCommit: String,
      operType: String,
      discBatchId: "",
      licenseFlag: "",
      authPath: "",
      isNeedUpdDiscImg: {
        type: Boolean,
        default: false
      },
      showDiscApplyAddWin: {
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
      showDiscApplyAddWin(val) {
        if (val) {
          this.isFirstOpen = true;
          if (this.operType === "add") {
            this.$nextTick(() => {
              this.$refs.addForm.resetFields();
              this.addForm.billClass = "ME01";
              this.addForm.invoiceAfterFlag = "1";
              this.addForm.batchNo = "";
              this.addForm.ownedBrchNo = this.$store.getters.userInfo.brchNo,
                this.addForm.ownedBrchName = this.$store.getters.userInfo.brchName,
                this.$refs.datagrid.tData = [];
              this.addForm.accountBrchNo = this.$store.getters.userInfo.brchNo;
              this.addForm.accountBrchName = this.$store.getters.userInfo.brchName;
              this.onlyRead = false;
              this.canPick = false;
              this.addForm.isNoticeFirstAudit = this.isNoticeFirstAudit;
              if (!this.isAllowBillRate){
                this.addForm.isBillRate = "0";
              }
            });
          }
          if (this.operType === "modify") {
            if (this.isCommit === "hasCommit") {
              this.onlyRead = true;
            }
            if (this.isCommit === "noCommit") {
              this.onlyRead = false;
            }
            this.$nextTick(() => {
              this.addForm.isNoticeFirstAudit = this.isNoticeFirstAudit;
              this.queryObjById();
              this.handleSearch();
            });
          }
        }
      },
      selectDataFirst(val) {
        if (val) {
          this.importSelect = false;
        }
      },
      'addForm.rateType'(val) {
        this.$refs.addForm.validateField('rate')
      }
    },
    methods: {
      async getCustManagerName() {
        await this.getIsCustMgrRequired();
        await this.getIsAllowOtherCustMgr();
        /* 根据需求文档, 如果参数ce.disc.is_allow_other_cust_mgr为false,
           且参数ce.disc.is_cust_mgr_required为true时, 客户经理名字默认取当前柜员名字 */
        if (this.isAllowOtherCustMgr === false && this.isCustMgrRequired === true) {
          console.log(JSON.parse(window.sessionStorage.getItem('userInfo')).userName);
          this.addForm.custMgrName = JSON.parse(window.sessionStorage.getItem('userInfo')).userName;
        }
      },
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
      //根据批次ID查询票据信息
      queryObjById() {
        let id = this.discBatchId;
        let funcNo = this.funcNo;
        post({id: id, funcNo: funcNo}, "/ce/disc/paper/apply/discApplyBatchMain/func_queryDiscBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              if (obj.id){
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
                // this.addForm.rate = obj.rate;
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
                if (!!obj.isNoticeFirstAudit) {
                  this.addForm.isNoticeFirstAudit = obj.isNoticeFirstAudit;
                } else {
                  this.addForm.isNoticeFirstAudit = this.isNoticeFirstAudit;
                }
              }

              this.addSumForm.sumCount = obj.sumCount;
              this.addSumForm.sumMoney = formatNumber(obj.sumMoney, 2, ",");
              this.addSumForm.sumBuyerInterest = formatNumber(obj.sumBuyerInterest, 2, ",");
              this.addSumForm.sumSalerInterest = formatNumber(obj.sumSalerInterest, 2, ",");
              this.addSumForm.sumInterest = formatNumber(obj.sumInterest, 2, ",");
              this.addSumForm.sumRealPayAmt = formatNumber(obj.sumRealPayAmt, 2, ",");
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //查询
      handleSearch() {
        this.formItem.batchId = this.discBatchId;
        this.formItem.funcNo = this.funcNo;
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },

      handleClose() {
        this.clearForm();
        this.$emit("discApplyAddWinClose", "");
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

      //查询产品业务类型
      getProductList() {
        post({billClass: "1"}, "/ce/disc/paper/apply/discApplyBatchMain/func_queryDiscProdRelation").then(res => {
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
        if (this.addForm.prodNo.indexOf("010604") > -1 || this.addForm.prodNo === "01061012" || this.addForm.prodNo === "01061022") {
          this.agencyShow = true;
        } else {
          this.agencyShow = false;
        }
        if (this.operType === 'add') {
          this.addForm.bailAcctNo = "";
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
        return post({}, "/ce/disc/paper/apply/discApplyBatchMain/func_getCustMgrRequiredForConfigCenter").then(res => {
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
        return post({}, "/ce/disc/paper/apply/discApplyBatchMain/func_getCustMgrforConfigCenter").then(res => {
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

      //获取系统参数（纸票贴现是否查询查复）ce.disc.is_query_recovery
      getIsQueryRecovery() {
        let paramKey = "ce.disc.is_query_recovery";
        post({paramKey: paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isQueryRecovery = res.data.retData;
              this.isQueryRecovery = isQueryRecovery === "1";
            } else {
              this.isQueryRecovery = false;
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

      clearVal(type) {
        if (type === 'custMgrName') {
          this.addForm.custMgrName = "";
          this.addForm.custMgrNo = "";
          this.addForm.custMgrBrchNo = "";
        }
      },

      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },

      /*  //查询机构弹出框
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

      //查询客户账号界面关闭
      showCustAcctWinClose() {
        this.showCustAcctWin = false;
      },

      //查询客户账号赋值
      custAcctSelect(info) {
        this.addForm.custAcctNo = info.custAcctNo;
        this.showCustAcctWin = false;
      },

      //查询客户账号
      selectCustAcctByCustNo() {
        if (this.addForm.custNo == null || this.addForm.custNo === "") {
          this.$msgTip.info(this, {info: '请先选择客户'});
          return;
        }
        this.showCustAcctWin = true;
      },

      //查询保证金账号
      selectCustBailAcctByCustNo() {
        if (this.addForm.custNo == null || this.addForm.custNo === "") {
          this.$msgTip.info(this, {info: "请先选择客户"});
          return;
        }
        this.showCustBailAcctWin = true;
      },

      //查询保证金账号赋值
      custBailAcctSelect(info) {
        this.addForm.bailAcctNo = info.custAcctNo;
        this.showCustBailAcctWin = false;
      },

      //查询保证金账号界面关闭
      showCustBailAcctWinClose() {
        this.showCustBailAcctWin = false;
      },

      //查询方式change方法
      queryTypeChange() {
        if (!this.isFirstOpen) {
          if (this.addForm.queryType === "4" || this.addForm.queryType === "2") {
            this.addForm.isBackQuery = "";
          } else {
            this.addForm.isBackQuery = "0";
          }
        }
        if (this.isFirstOpen) {
          this.isFirstOpen = false;
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
          this.addForm.payCustNo = "";
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
          this.addForm.payCustNo = "";
          this.addForm.payCustName = "";
          this.addForm.buyPayPcet = "";
          this.addForm.payAcctNo = "";
        }
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
        this.addForm.payAcctNo = "";
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
        this.addForm.thirdAcctNo = "";
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

      //保存
      formSave() {
        this.addForm.discDt = this.$moment(this.addForm.discDt).format("YYYYMMDD");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            if (this.isQueryRecovery) {
            } else {
              this.addForm.queryType = "4";
              this.addForm.isBackQuery = "";
            }
            let batchParam = this.deepClone(this.addForm);
            let msg = this.operType === "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            if (this.canPick) {
              batchParam.id = this.discBatchId;
              msg = this.$t("m.i.common.modifySuccess");
            }
            if (batchParam.isBillRate === "0") {
              if (this.addForm.rate === "0") {
                batchParam.rate = "0";
              } else {
                if (batchParam.rateType === "360") {
                  batchParam.rate = accDiv(this.addForm.rate, 100);
                }
                if (batchParam.rateType === "30") {
                  batchParam.rate = accDiv(this.addForm.rate, 1000);
                }
                if (batchParam.rateType === "1") {
                  batchParam.rate = accDiv(this.addForm.rate, 10000);
                }
              }
            } else if (batchParam.isBillRate === "1") {
              batchParam.rateType = "";
              batchParam.rate = "";
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
            let url = "/ce/disc/paper/apply/discApplyBatchMain/func_insertOrUpateDiscBatch";
            this.submitFlag = true;
            post(batchParam, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, {info: msg});
                  this.operType = "modify";
                  this.canPick = true;
                  this.discBatchId = res.data.retData;
                  this.formItem.batchId = res.data.retData;
                  this.queryObjById();
                  this.handleSearch();
                  this.$emit("pageReFresh", "");
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      //挑票
      pickBillWinOpen() {
        if (this.operType === "add") {
          if (this.canPick) {
            this.jumpToBillWin();
          } else {
            this.$msgTip.info(this, {info: "请先保存批次"});
            return;
          }
        }
        if (this.operType === "modify") {
          this.jumpToBillWin();
        }
      },

      //跳转到挑票界面
      jumpToBillWin() {
        this.discPickBillForm.aoAcctNo = this.addForm.aoAcctNo;
        this.discPickBillForm.custAcctNo = this.addForm.custAcctNo;
        this.discPickBillForm.discDt = this.$moment(this.addForm.discDt).format("YYYYMMDD");
        this.discPickBillForm.billClass = this.addForm.billClass;
        this.discPickBillForm.billType = this.addForm.billType;
        this.discPickBillForm.clearMark = this.addForm.clearMark;
        this.discPickBillForm.banEndrsmtMark = this.addForm.banEndrsmtMark;
        this.discPickBillForm.isBillRate = this.addForm.isBillRate;
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
        }
        this.discPickBillForm.prodNo = this.addForm.prodNo;
        this.discPickBillWin = true;
      },

      //挑票界面根据弹框所选票进行赋值
      discPickBillChange(info) {
        this.currentSelectList = info;
        let transIds = "";
        let hldrIds = "";
        let btrcIdDtoList = [];
        for (let i = 0, count = this.currentSelectList.length; i < count; i++) {
          if (this.currentSelectList[i].transId !== "") {
            transIds += this.currentSelectList[i].transId;
            if (i < this.currentSelectList.length - 1) {
              transIds += ",";
            }
          }
          if (this.currentSelectList[i].hldrId !== "") {
            hldrIds += this.currentSelectList[i].hldrId;
            if (i < this.currentSelectList.length - 1) {
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
        }, "/ce/disc/paper/apply/discApplyBatchMain/func_pickDiscBillInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, {info: res.data.retMsg});
              this.discPickBillWin = false;
              this.queryObjById();
              this.handleSearch();
              this.$emit("pageReFresh", "");
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
              this.$emit("pageReFresh", "");
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //挑票界面取消按钮
      discPickBillWinClose() {
        this.discPickBillWin = false;
        this.handleSearch();
      },

      //新增/修改按钮
      discAddOrModifyBill(type) {
        this.addWinOperType = type;
        if (this.operType === "add") {
          if (this.addWinOperType === "add") {
            if (this.canPick) {
              this.jumpToAddBillWin();
            } else {
              this.$msgTip.info(this, {info: "请先保存批次"});
              return;
            }
          }
          if (this.addWinOperType === "modify") {
            if (this.$refs.datagrid.selects == null || this.$refs.datagrid.selects.length === 0) {
              this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
              return;
            }
            if (this.$refs.datagrid.selects.length > 1) {
              this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
              return;
            }
            this.discAddWinBillId = this.$refs.datagrid.selects[0].id;
            this.discAddWinBillNo = this.$refs.datagrid.selects[0].billNo;
            this.jumpToAddBillWin();
          }
        }
        if (this.operType === "modify") {
          if (this.addWinOperType === "add") {
            this.jumpToAddBillWin();
          }
          if (this.addWinOperType === "modify") {
            if (this.$refs.datagrid.selects == null || this.$refs.datagrid.selects.length === 0) {
              this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
              return;
            }
            if (this.$refs.datagrid.selects.length > 1) {
              this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
              return;
            }
            this.discAddWinBillId = this.$refs.datagrid.selects[0].id;
            this.discAddWinBillNo = this.$refs.datagrid.selects[0].billNo;
            this.jumpToAddBillWin();
          }
        }

      },

      //跳转到新增明细界面
      jumpToAddBillWin() {
        this.discBillType = this.addForm.billType;
        this.discAddBillWin = true;
      },

      //新增界面赋值
      discAddBillChange(info) {
        this.discAddBillInfoForm = info;
        let billParam = this.deepClone(this.discAddBillInfoForm);
        billParam.remitDt = this.$moment(this.discAddBillInfoForm.remitDt).format("YYYYMMDD");
        billParam.dueDt = this.$moment(this.discAddBillInfoForm.dueDt).format("YYYYMMDD");
        billParam.billMoney = this.discAddBillInfoForm.billMoney.replace(/,/g, "");
        billParam.batchId = this.discBatchId;
        if (billParam.remitDt > billParam.dueDt) {
          this.$msgTip.info(this, {info: "出票日期必须小于汇票到期日"});
          return;
        }
        if (this.addForm.isBillRate === "1") {
          if (this.discAddBillInfoForm.rate === "0") {
            billParam.rate = "0";
          } else {
            if (billParam.rateType === "360") {
              billParam.rate = accDiv(this.discAddBillInfoForm.rate, 100);
            }
            if (billParam.rateType === "30") {
              billParam.rate = accDiv(this.discAddBillInfoForm.rate, 1000);
            }
            if (billParam.rateType === "1") {
              billParam.rate = accDiv(this.discAddBillInfoForm.rate, 10000);
            }
          }
        }
        if (this.addWinOperType === "add") {
          this.addSubmitFlag = true;
          billParam.id = "";
          post(billParam, "/ce/disc/paper/apply/discApplyBatchMain/func_addPaperDiscBillInfo").then(res => {
            this.addSubmitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, {info: res.data.retMsg});
                this.discAddBillWin = false;
                this.queryObjById();
                this.$refs.datagrid.dataChange(1);
                this.$refs.datagrid.$refs.gridPage.clearElevator();
                this.currentSelectList = [];
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else if (this.addWinOperType === "modify") {
          billParam.discId = this.$refs.datagrid.selects[0].id;
          this.addSubmitFlag = true;
          post(billParam, "/ce/disc/paper/apply/discApplyBatchMain/func_updateDiscBill").then(res => {
            this.addSubmitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, {info: res.data.retMsg});
                this.discAddBillWin = false;
                this.queryObjById();
                this.$refs.datagrid.dataChange(1);
                this.$refs.datagrid.$refs.gridPage.clearElevator();
                this.currentSelectList = [];
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

      },

      //新增界面关闭
      discAddBillWinClose() {
        this.currentSelectList = [];
        this.addSubmitFlag = false;
        this.discAddBillWin = false;
        this.handleSearch();
      },

      //批量导入
      batchImport() {
        if (this.operType === "add") {
          if (this.canPick) {
            this.fileParams.extraGridDatas.batchId = this.discBatchId;
            this.fileParams.extraGridDatas.billClass = "ME01";
            this.fileParams.extraGridDatas.inOutFlag = "2";
            this.importWin = true;
          } else {
            this.$msgTip.info(this, {info: "请先保存批次"});
            return;
          }
        } else if (this.operType === "modify") {
          this.fileParams.extraGridDatas.batchId = this.discBatchId;
          this.fileParams.extraGridDatas.billClass = "ME01";
          this.fileParams.extraGridDatas.inOutFlag = "2";
          this.importWin = true;
        }
      },

      importWinClose() {
        this.importWin = false;
      },

      importSuccess(isSuccess) {
        if (isSuccess) {
          this.importWin = false;
          this.queryObjById();
          this.$refs.datagrid.dataChange(1);
          this.$refs.datagrid.$refs.gridPage.clearElevator();
        } else {
          this.$refs.datagrid.dataChange(1);
          this.$refs.datagrid.$refs.gridPage.clearElevator();
        }
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
        post({discIds: ids}, "/ce/disc/paper/apply/discApplyBatchMain/func_deleteDiscBill").then(res => {
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
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
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
        post({id: this.discBatchId}, "/ce/disc/paper/apply/discApplyBatchMain/func_calculateInterest").then(res => {
          this.$loadingbox.close();
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.queryObjById();
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
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
            post(this.delayDaysChangeFormItem, "/ce/disc/paper/apply/discApplyBatchMain/func_calculateInterest").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.delayDaysChangeWin = false;
                  this.$refs.delayDaysChangeFormItem.resetFields();
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
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
        });
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
            this.param = "discApplListExportInfo";
            this.tempShowExcelTemplateWin = true;
          } else {
            this.$msgTip.info(this, {info: "请先保存批次"});
            return;
          }
        } else if (this.operType === "modify") {
          this.param = "discApplListExportInfo";
          this.tempShowExcelTemplateWin = true;
        }
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },

      exportForm(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/disc/paper/apply/discApplyBatchMain/func_exportExcel";
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
              billClass: this.formItem.billClass,
              batchId: this.formItem.batchId,
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

      //导入票号模板下载
      exportBillNoExcel() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/disc/paper/apply/discApplyBatchMain/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },

      //业务类型选择界面
      prodTypeChoose() {
        this.prodTypeChooseWin = true;
      },

      //业务类型选择界面提交
      prodTypeChooseSubmit(assetIndustryRef, assetIndustry) {
        this.prodTypeChooseFormItem.batchId = this.discBatchId;
        let ids = this.$refs.datagrid.selectIds.join(",");
        this.prodTypeChooseFormItem.discIds = ids;
        this.$refs["prodTypeChooseFormItem"].$refs[assetIndustryRef].validate(valid => {
          if (valid) {
            if (this.$refs.datagrid.tData.length === 0) {
              this.$msgTip.info(this, {info: "该批次下无数据"});
              return;
            }
            this.submitFlag = true;
            post({
              busiClassify: assetIndustry, funcNo: this.funcNo,
              batchId: this.prodTypeChooseFormItem.batchId, discIds: this.prodTypeChooseFormItem.discIds
            }, "/ce/disc/paper/apply/discApplyBatchMain/func_updateBusiClassify").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, {info: msg});
                  this.prodTypeChooseWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.$refs.gridPage.clearElevator();
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

      //调整顺延天数界面关闭
      prodTypeChooseClose() {
        this.prodTypeChooseWin = false;
      },

      //批次提交或选择提交
      submitList(str) {
        this.submitType = str;
        if (this.submitType === "select") {
          this.currentSelectList = this.$refs.datagrid.selects;
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
            return;
          }

          let dataList = this.$refs.datagrid.selects;
          let flag = window.sessionStorage.getItem("isOpenI9") == "1" ? true : false;
          if (flag) {
            for (let i = 0; i < dataList.length; i++) {
              if (dataList[i].busiClassify == null || dataList[i].busiClassify == "" || dataList[i].busiClassify == undefined) {
                this.$msgTip.info(this, {info: "资产分类为空的票不允许提交"});
                return;
              }
            }
          }


          this.discIds = this.$refs.datagrid.selectIds.join(",");
          let params = {batchId: this.discBatchId, ids: this.discIds};
          if (this.isNeedUpdDiscImg) {
            this.checkDiscImgUpd(params);
          } else {
            this.getRiskBillNo(params);
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
          let flag = window.sessionStorage.getItem("isOpenI9") == "1" ? true : false;
          console.log(flag)
          if (flag) {
            for (let i = 0; i < dataList.length; i++) {
              if (dataList[i].busiClassify == null || dataList[i].busiClassify == "" || dataList[i].busiClassify == undefined) {
                this.$msgTip.info(this, {info: "资产分类为空的票不允许提交"});
                return;
              }
            }
          }
          let params = {batchId: this.discBatchId};
          if (this.isNeedUpdDiscImg) {
            this.checkDiscImgUpd(params);
          } else {
            this.getRiskBillNo(params);
          }
        }
      },

      //提交前先调用风险检查接口
      getRiskBillNo(params) {
        post(params, "/ce/disc/paper/apply/discApplyBatchMain/func_getRiskBillNo").then(res => {
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

      confirmAgainClose() {
        this.confirmAgainWin = false;
      },

      //提交
      handleSubmit(info, isRiskCkeck) {
        if (isRiskCkeck) {
          this.riskCheckWinClose(info);
        }
        this.confirmAgainWin = false;
        let params = {};
        if (this.submitType === "select") {
          params = {batchId: this.discBatchId, ids: this.discIds, billOperType: "0"};
        } else if (this.submitType === "batch") {
          params = {batchId: this.discBatchId, billOperType: "1"};
        }
        post(params, "/ce/disc/paper/apply/discApplyBatchMain/func_whiteRollCheck").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (msg === null) {
                this.handleSubmitAgain();
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
                this.getRiskBillNo(params);
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

      handleSubmitAgain() {
        let params = {};
        if (this.submitType === "select") {
          params = {batchId: this.discBatchId, discIds: this.discIds};
        } else if (this.submitType === "batch") {
          params = {batchId: this.discBatchId};
        }
        post(params, "/ce/disc/paper/apply/discApplyBatchMain/func_submitPaperFlow").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, {info: msg});
              if (this.submitType === "select") {
                if (this.$refs.datagrid.total === this.currentSelectList.length) {
                  this.handleClose();
                } else {
                  this.queryObjById();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.$refs.gridPage.clearElevator();
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                }
              } else if (this.submitType === "batch") {
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
        post({batchId: this.discBatchId}, "/ce/disc/paper/apply/discApplyBatchMain/func_cancelFlow").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, {info: msg});
              this.handleClose();
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectList = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //票面信息关闭
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      //票面信息
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },

      //贴现合同打印
      contractPrinting() {
        if (this.discBatchId === "") {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
        post({id: this.discBatchId, funcNo: this.funcNo}, "/ce/disc/paper/apply/discApplyBatchMain/func_printDiscContract").then(res => {
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
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
          },
          errorCallback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.$refs.datagrid.$refs.gridPage.clearElevator();
            this.currentSelectList = [];
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
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
          discContractBills[i].billMoney = formatNumber(discContractBills[i].billMoney, 2, ",");

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
        </div>`;
        bodyHtml.push(bodyHtml1);
        if (!!bodyStr2) {
          let bodyHtml2 = `<div class="list-table-box">
            <table class="list-table">
              <tbody>${bodyStr2}</tbody>
            </table>
          </div>`;
          bodyHtml.push(bodyHtml2);
        }
        return bodyHtml;
      },

      //审批书打印
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

      //风险票据检查界面关闭
      riskCheckWinClose() {
        this.riskCheckWin = false;
        this.riskParams = {};
      },

      //风险票据检查界面提交
      riskCheckSubmit(info) {
        this.handleSubmit(info, true);
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
        this.addSumForm.sumCount = "";
        this.addSumForm.sumMoney = "";
        this.addSumForm.sumBuyerInterest = "";
        this.addSumForm.sumSalerInterest = "";
        this.addSumForm.sumInterest = "";
        this.addSumForm.sumRealPayAmt = "";
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
        this.imageParams.imgType = this.imgType;
        this.imageParams.uploadUrl = window.LOCAL_CONFIG.API_HOME + '/ce/disc/paper/apply/discApplyBatchMain/func_uploadImage';
        this.imageParams.viewUrl = window.LOCAL_CONFIG.API_HOME + '/ce/disc/paper/apply/discApplyBatchMain/func_imageById';
        this.showUploadImageWin = true;
      },

      uploadImageWinClose() {
        this.showUploadImageWin = false;
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
          post({id: listId}, "/ce/disc/paper/apply/discApplyBatchAdd/func_relatedInvoice").then(res => {
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
            this.relationInvoiceBillParams.cancelRelationUrl = "/ce/disc/paper/apply/discApplyBatchAdd/func_cancelRelatedInvoice";
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
    },
  };
</script>

<style scoped>

</style>
