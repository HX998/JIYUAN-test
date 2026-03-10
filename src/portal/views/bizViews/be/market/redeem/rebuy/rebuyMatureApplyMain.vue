                       <!--返售申请主页--->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form
                :model="queryFormItem"
                :label-width="90"
                ref="queryFormItem"
                cols="4"
                class="h-form-search"
              >
                <h-form-item :label="$t('m.i.be.isCommit')" prop="isCommit">
                  <h-radio-group v-model="queryFormItem.isCommit">
                    <h-radio label="0" @on-click="noCommitButton">
                      <span>未提交</span>
                    </h-radio>
                    <h-radio label="1" @on-click="hasCommitButton">
                      <span>已提交</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <show-branch v-model="queryFormItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="queryFormItem.ownedBrchNos" :brchName.sync="queryFormItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.be.batchNo')" prop="batchNo">
                  <h-input v-model="queryFormItem.batchNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
                  <h-input v-model="queryFormItem.dealNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="queryFormItem.billType" placeholder>
                    <h-option
                      v-for="item in billTypeList"
                      :value="item.key"
                      :key="item.key"
                    >{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="queryFormItem.billClass" placeholder>
                    <h-option
                      v-for="item in billClassList"
                      :value="item.key"
                      :key="item.key"
                    >{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <show-cpes-branch :label="$t('m.i.be.otherBrchName')"
                                  :brchCode.sync="queryFormItem.saleBrchCode"  :cpesBrchName.sync="queryFormItem.saleBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary"  @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--主页面数据展示表格-->
              <h-datagrid
                :columns="columns"
                highlight-row
                url="/be/market/redeem/rebuy/rebuyMatureApplyMain/func_queryRebuyMatureBatchAplList"
                :bindForm="queryFormItem"
                :onCurrentChange="handleCurrentChange"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                ref="editdatagrid"
              >
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm()" :disabled="hasCommit">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @click="applyEdit" :disabled="hasCommit">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="deleteClick" :disabled="hasCommit">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="cancelAppl()" :disabled="noCommit">{{$t('m.i.common.revoke')}}</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增弹出框 -->
    <h-msg-box
      v-model="addOrEditWin"
      width="1000"
      height="400"
      class="h-form-table-layer"
      @on-close="handleWinClose"
      :maximize="true"
    >
      <p slot="header">
        <span>待提前或逾期报价单页面</span>
      </p>
      <div>
        <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore2}">
          <h-form
            :model="addOrEditForm"
            :label-width="80"
            ref="addOrEditForm"
            cols="4"
            class="h-form-search"
          >
            <show-branch v-model="addOrEditForm.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  class="h-form-long-label" prop="ownedBrchNames"
                         v-if="this.licenseFlag"    :showCheckBox="true"  :msgBoxWin="addOrEditWin"   :brchNo.sync="addOrEditForm.ownedBrchNos" :brchName.sync="addOrEditForm.ownedBrchNames"
                         :params="{authPath:this.$route.path}"
                         url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                         queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
            </show-branch>

            <h-form-item label="买入批次号" prop="batchNo">
              <h-input v-model="addOrEditForm.batchNo" placeholder></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
              <h-input v-model="addOrEditForm.dealNo" placeholder></h-input>
            </h-form-item>
            <show-cpes-branch :label="$t('m.i.be.otherBrchName')" class="h-form-long-label"
                              :brchCode.sync="addOrEditForm.saleBrchCode"  :cpesBrchName.sync="addOrEditForm.saleBrchName"
                              datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName" :msgBoxWin="addOrEditWin"
                              queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

            <bill-type v-model="addOrEditForm.billType" :dictList="billTypeList"></bill-type>
            <bill-class v-model="addOrEditForm.billClass" :dictList="billClassList"></bill-class>
            <h-form-item :label="$t('m.i.be.firstSettleDate')" prop="settleDate">
              <h-date-picker
                type="daterange"
                :value="settleDate"
                :showFormat="true"
                @on-change="handleSettleDateChange"
                placeholder
              ></h-date-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.dueSettleDt')" prop="dueSettleDate">
              <h-date-picker
                type="daterange"
                :value="dueSettleDate"
                :showFormat="true"
                @on-change="handleDueSettleDateChange"
                placeholder
              ></h-date-picker>
            </h-form-item>
            <common-type-field-range v-model="addOrEditForm" :label="$t('m.i.be.tradRate')" :integerNum="3" :suffixNum="4"
                                     :validRules="ratePctRule" :bigTips="false"
                                     :rangeProps="['minRatePct','maxRatePct']"></common-type-field-range>
            <h-form-item class="h-form-operate">
              <span class="h-more-input" @click="ifShowMore2=!ifShowMore2">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                              :class="{'icon-arrow-down-screensv':!ifShowMore2,'icon-arrow-up-screen':ifShowMore2}"></i></span>
              <h-button type="primary" @click="formAddSearch()">{{$t('m.i.common.search')}}</h-button>
              <h-button type="ghost" @click="formAddSearchReset()">{{$t('m.i.common.reset')}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <!-- 新增页面数据展示表格 -->
          <h-datagrid
            :columns="addColumns"
            highlight-row
            :auto-load="false"
            url="/be/market/redeem/rebuy/rebuyMatureApplyMain/func_queryPacketList"
            :bindForm="addOrEditForm"
            :notSetWidth="true"
            :onRowDbClick="doubleHandleClick"
            :onCurrentChange="handlePacketCurrentChange"
            :onCurrentChangeCancel="handlePacketCurrentChangeCancel"
            ref="addDatagrid"
          ></h-datagrid>

      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--票据机构查询-->
    <!--<brch-code-search
      :showCpesBranch="showCpesBrchWin"
      @showCpesBranchClose="closeBranch"
      @showCpesBranchSubmit="brchCodeChange"
    ></brch-code-search>-->
    <rebuy-mature-detil :showmsg="showmsg" :batchId="batchId" @closeMsgBox="closeMsgBox" :billListURL="billListURL"></rebuy-mature-detil>
    <!--修改申请单弹出框-->
    <rebuy-mature-apply-edit
      :applyEditWin="applyEditWin"
      :applyEditParams="applyEditParams"
      :dictList="dictList"
      :notSetWidth="true"
      @applyEditWinClose="applyEditWinClose"
      @batchDetailSubmit="batchDetailSubmit"
    ></rebuy-mature-apply-edit>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>
    <show-license-branch :showBranchWin="brchNoWin1" title="机构查询" @brchNoChange="brchNoChange1" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose1" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>
<script>
import { post, on, off ,formatNumber} from "@/api/bizApi/commonUtil";

export default {
  name: "rebuyMatureApplyMain",
  data() {
    return {
      ratePctRule :[{
        test: /^(\d{1,2}(\.\d{1,4})?|100\.0000)$/,
        trigger: "blur",
        message: "利率范围0~100，且小数位不超过四位"
      }],
      ifShowMore : false,
      ifShowMore2 : false,
      settleDate:[],
      dueSettleDate:[],
      columns : [
        {
          type: "radio",
          title: " ",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: 'index',
          align: 'center',
          width: 60,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.batchNo'),
          key: "batchNo",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBatchDetil(params.row.id);
                }
              }
            }, params.row.batchNo);
          }
        },
        {
          title: this.$t('m.i.common.applDt'),
          key: "applDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.be.dealNo'),
          key: "dealNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.busiType'),
          key: "busiType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.redeemStatus'),
          key: "redeemStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "RebuyRedeemStatus", params.row.redeemStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.brchName'),
          key: "buyBrchName",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.be.otherBrchName'),
          key: "saleBrchName",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: "billType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.billClass'),
          key: "billClass",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.firstTransRate'),
          key: "ratePct",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.be.redeemRate'),
          key: "dueRatePct",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.be.redeemType'),
          key: "redeemType",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "RedeemType", params.row.redeemType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.redeemReason'),
          key: "redeemReason",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "RedeemReason", params.row.redeemReason);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.reqDealOpin'),
          key: "reqDealOpin",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.be.orginDueSettleDt'),
          key: "dueSettleDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.dueSettleDt == null ? "" : this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.be.redeemSumAmtByUnit'),
          key: "redeemSumAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', formatNumber(params.row.redeemSumAmt, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.redeemSumBuyTotalAmtByUnit'),
          key: "redeemSumBuyTotalAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', formatNumber(params.row.redeemSumBuyTotalAmt, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.trialInterestByUnit'),
          key: "dueInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', formatNumber(params.row.dueInterest, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.duePayInterestByUnit'),
          key: "duePayInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', formatNumber(params.row.duePayInterest, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.trialDueInterestByUnit'),
          key: "dueSettleAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', formatNumber(params.row.dueSettleAmt, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.duePayAmtByUnit'),
          key: "duePayAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', formatNumber(params.row.duePayAmt, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.redeemTotalNumBillPackage'),
          key: "redeemSumNum",
          hiddenCol: false
        }
      ],
      //新增页面的列表
      addColumns : [
        {
          title:" ",
          type: 'radio',
          width: 60,
          hiddenCol: false,
          align: 'center'
        },
        {
          title: this.$t('m.i.common.id'),
          key: 'id',
          hiddenCol: true,
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
          sortable: true
        },
        {
          title: this.$t('m.i.be.quoteNo'),
          key: 'quoteNo',
          sortable: true
        },
        {
          title: this.$t('m.i.be.dealNo'),
          key: 'dealNo',
          sortable: true
        },
        {
          title: this.$t('m.i.common.dealStatus'),
          key: 'dealStatus',
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "QuoteStatus", params.row.dealStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.busiType'),
          key: 'busiType',
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.dealDtTm'),
          key: 'dealDtTm',
          render: (h, params) => {
            let date = params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "";
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.be.firstClearStatus'),
          key: 'clearStatus',
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "StlResult", params.row.clearStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.dueClearStatus'),
          key: 'dueClearStatus',
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "StlResult", params.row.dueClearStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.firstAcctStatus'),
          key: 'acctStatus',
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.dueAcctStatus'),
          key: 'dueAcctFlag',
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.dueAcctFlag);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.otherBrchName'),
          key: 'saleBrchName',
          sortable: true,
        },
        {
          title: this.$t('m.i.be.custTraderName'),
          key: 'saleTraderName',
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: "billType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
        let dictValue =this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
        return h("span", {
          domProps: {
          title: dictValue
          }
        }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.billClass'),
          key: "billClass",
          hiddenCol: false,
          render: (h, params) => {
        let dictValue =this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
        return h("span", {
          domProps: {
          title: dictValue
          }
        }, dictValue);
          }
        },
        {
          title: this.$t('m.i.be.firstTransRate'),
          key: 'ratePct',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.be.clearSpeed'),
          key: 'clearSpeed',

          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "ClearSpeed", params.row.clearSpeed);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.firstSettleDate'),
          key: 'firstSettleDt',
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.firstSettleDt?this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
          }
        },
        {
          title: this.$t('m.i.be.dueSettleDt'),
          key: 'dueSettleDt',

          render: (h, params) => {
            return h('span', params.row.dueSettleDt?this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
          }
        },
        {
          title: this.$t('m.i.be.settleMode'),
          key: 'settleMode',
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.be.clearType'),
          key: 'clearType',

          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "ClearType", params.row.clearType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.totalAmtBillPackage'),
          key: 'totalAmt',

          render: (h, params) => {
            return h('span', formatNumber(params.row.totalAmt, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.firstPayInterestByUnit'),
          key: 'firstPayInterest',
          render: (h, params) => {
            return h('span', formatNumber(params.row.firstPayInterest, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.dueInterestByUnit'),
          key: 'dueInterest',
          render: (h, params) => {
            return h('span', formatNumber(params.row.dueInterest, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.firstSettleAmtByUnit'),
          key: 'firstSettleAmt',
          render: (h, params) => {
            return h('span', formatNumber(params.row.firstSettleAmt, 2, ','));
          }
        },
        {
          title: this.$t('m.i.be.dueSettleAmtByUnit'),
          key: 'dueSettleAmt',
          render: (h, params) => {
            return h('span', formatNumber(params.row.dueSettleAmt, 2, ','));
          }
        },
        {
          title: this.$t('m.i.common.totalNumBillPackage'),
          key: 'totalNum',

        }
      ],
      queryFormItem : {
        id:"",
        batchNo: "",
        dealNo: "",
        busiType: "",
        billType: "",
        billClass: "",
        saleBrchName: "",
        saleBrchCode: "",
        isCommit: "0",
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        authPath:this.$route.path ,
        licenseFlag:this.licenseFlag,
      },
      //新增form
      addOrEditForm : {
        id: '',
        batchNo:'',
        billType:'',
        billClass:'',
        dealNo:'',
        minFirstSettleDt:'',
        maxFirstSettleDt:'',
        settleDateStr:'',
        minQueryDueSetDt:'',
        maxQueryDueSetDt:'',
        dueSettleDateStr:'',
        minRatePct:'',
        maxRatePct:'',
        ratePct:'',
        saleBrchName:'',
        saleBrchCode:'',
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        authPath:this.$route.path ,
        licenseFlag:this.licenseFlag,
      },
      currentSelectRow : null,
      currentSelectCopyRow : null,
      busiTypeList : [],
      billTypeList : [],
      billClassList : [],
      redeemTypeList : [],
      adjustTypeList : [],
      dictMap : new Map(),
      submitFlag : false,
      //票据机构弹出框
      //showCpesBrchWin : false,
      //修改申请单弹出框
      applyEditWin : false,
      //新增弹出框
      addOrEditWin : false,
      //集中授权管理
      ownedBrchName:"",
      ownedBrchNo:"",
      ownedBrchNames:"",
      ownedBrchNos:"",
      licenseFlag:false,
      authPath: this.$route.path ,
     // brchNoWin : false,
     // brchNoWin1 : false,
      applyEditParams : {
        batchId: "",
        licenseFlag:false,
      },
      showmsg : false,
      batchId : "",
      //拒绝申请弹出框
      refuseApplyWin : false,
      hasCommit : false,
      noCommit : true,
      refuseParams : {
        batchId: ""
      },
      dictList : {
        busiTypeList: [],
        billTypeList: [],
        billClassList: [],
        redeemTypeList: [],
        adjustTypeList: []
      },
      billListURL : "/be/market/redeem/rebuy/rebuyMatureApplyMain/func_queryRebuyMatureBillList",
      //queryType : ""
    }
  },
  components: {
   RebuyMatureApplyEdit:()=>import(/* webpackChunkName: "be/market/redeem/rebuy/rebuyMatureApplyEdit" */`@/views/bizViews/be/market/redeem/rebuy/rebuyMatureApplyEdit`),
     //BrchCodeSearch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    RebuyMatureDetil:()=>import(/* webpackChunkName: "be/market/redeem/rebuy/rebuyMatureDetil" */`@/views/bizViews/be/market/redeem/rebuy/rebuyMatureDetil`),
    //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

  },
  methods: {
    clearVal(type){
      if(type == 'saleBrchName'){
        this.queryFormItem.saleBrchCode = '';
        this.queryFormItem.saleBrchName = '';
      }
    },
    formSearch() {
      this.currentSelectRow = [];
      this.$refs.editdatagrid.dataChange(
        this.$refs.editdatagrid.pageInfo.pageNo
      );
    },
    formSearchReset() {
      this.queryFormItem.ownedBrchNo = "";
      this.queryFormItem.ownedBrchName = "";
      this.queryFormItem.ownedBrchNos = "";
      this.queryFormItem.ownedBrchNames = "";
      this.queryFormItem.saleBrchCode = "";
      this.queryFormItem.saleBrchName = "";
      this.$refs.queryFormItem.resetFields();
      this.noCommitButton();
    },
    formAddSearch() {
      this.currentSelectRow = [];
      this.currentSelectList = [];
      this.addOrEditForm.licenseFlag = this.licenseFlag;
      this.$refs.addDatagrid.dataChange(this.$refs.addDatagrid.pageInfo.pageNo);
    },
    handleSettleDateChange(arr){
      if (arr && arr.length >= 2) {
        this.addOrEditForm.minFirstSettleDt = arr[0].replace(/-/g, "");
        this.addOrEditForm.maxFirstSettleDt = arr[1].replace(/-/g, "");
        this.settleDate = [arr[0],arr[1]];
      } else {
        this.addOrEditForm.minFirstSettleDt = "";
        this.addOrEditForm.maxFirstSettleDt = "";
        this.settleDate = [];
      }
    },
    handleDueSettleDateChange(arr){
      if (arr && arr.length >= 2) {
        this.addOrEditForm.minQueryDueSetDt = arr[0].replace(/-/g, "");
        this.addOrEditForm.maxQueryDueSetDt = arr[1].replace(/-/g, "");
        this.dueSettleDate = [arr[0],arr[1]];
      } else {
        this.addOrEditForm.minQueryDueSetDt = "";
        this.addOrEditForm.maxQueryDueSetDt = "";
        this.dueSettleDate = [];
      }
    },
    formAddSearchReset() {
      this.settleDate = [];
      this.dueSettleDate = [];
      this.addOrEditForm.ownedBrchNo = "";
      this.addOrEditForm.ownedBrchName = "";
      this.addOrEditForm.ownedBrchNos = "";
      this.addOrEditForm.ownedBrchNames = "";
      this.$refs.addOrEditForm.resetFields();
      this.addOrEditForm.saleBrchCode = "";
      this.addOrEditForm.saleBrchName = "";
      this.hasCommitDisabled = false;
      this.noCommitDisabled = false;
    },
    // 新增/修改
    handleForm() {
      this.addOrEditWin = true;
      this.$nextTick(() => {
        this.$refs.addOrEditForm.resetFields();
        this.$refs.addDatagrid.dataChange(this.$refs.addDatagrid.pageInfo.pageNo);
      });
    },
    handleCurrentChange(currentRow, oldCurrentRow, _index) {
      this.currentSelectRow = currentRow;
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = [];
    },
    handlePacketCurrentChange(currentRow, oldCurrentRow, _index) {
      this.currentSelectCopyRow = currentRow;
    },
    handlePacketCurrentChangeCancel() {
      this.currentSelectCopyRow = null;
    },
    //新增页面提交
    formAdd() {
      let list = this.currentSelectCopyRow;
      if (list) {
        let id = list.id;
        let url = "/be/market/redeem/rebuy/rebuyMatureApplyMain/func_addRebuyMature";
        this.submitFlag = true;
        post({ id: id }, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.addOrEditWin = false;
              this.currentSelectCopyRow = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
            this.$refs.editdatagrid.dataChange(
              this.$refs.editdatagrid.pageInfo.pageNo
            );
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      } else {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
      }
    },
    //修改申请
    applyEdit() {
      if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
        this.applyEditParams.batchId = this.currentSelectRow.id;
        this.applyEditParams.licenseFlag = this.licenseFlag;
        this.dictList.busiTypeList = this.busiTypeList;
        this.dictList.billTypeList = this.billTypeList;
        this.dictList.billClassList = this.billClassList;
        this.dictList.redeemTypeList = this.redeemTypeList;
        this.dictList.adjustTypeList = this.adjustTypeList;
        this.dictList.redeemReasonList = this.redeemReasonList;
        this.applyEditWin = true;
      } else {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
      }
    },
    applyEditWinClose() {
      this.applyEditWin = false;
      this.applyEditParams.batchId = "";
      this.currentSelectRow = [];
      this.$refs.editdatagrid.dataChange(
        this.$refs.editdatagrid.pageInfo.pageNo
      );
    },
    //删除
    deleteClick() {
      if (this.currentSelectRow.length > 1) {
        this.$msgTip.info(this, {
          info: this.$t("m.i.common.onlyChooseOneData")
        });
        return;
      }
      if (this.currentSelectRow.length == 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        return;
      }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: this.$t("m.i.common.isConfirmDelete") + "?",
        onOk: () => {
          this.handleDel();
        }
      });
    },
    handleDel() {
      if (this.currentSelectRow.length > 1) {
        this.$msgTip.info(this, {
          info: this.$t("m.i.common.onlyChooseOneData")
        });
        return;
      }
      if (this.currentSelectRow.length == 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        return;
      }
      let id = this.currentSelectRow.id;
      post({ id: id }, "/be/market/redeem/rebuy/rebuyMatureApplyMain/func_deleteRebuyMatureBatch").then(
        res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
            this.$refs.editdatagrid.dataChange(
              this.$refs.editdatagrid.pageInfo.pageNo
            );
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        }
      );
    },
    handleWinClose() {
      this.$refs.addOrEditForm.resetFields();
      this.addOrEditForm.saleBrchCode = "";
      this.addOrEditForm.saleBrchName = "";
      this.settleDate = [];
      this.dueSettleDate = [];
      this.addOrEditWin = false;
      this.currentSelectCopyRow = null;
      this.$refs.editdatagrid.dataChange(
        this.$refs.editdatagrid.pageInfo.pageNo
      );
    },
    closeMsgBox(){
      this.showmsg = false;
    },
    showBatchDetil(batchId){
      this.batchId = batchId;
      this.showmsg = true;
    },
    /*queryCpesBrchCode(type) {
      this.showCpesBrchWin = true;
      this.queryType = type;
    },*/
    /*closeBranch() {
      this.showCpesBrchWin = false;
    },*/
    //根据弹框所选数据进行赋值
    /*brchCodeChange(info) {
      if(this.queryType == "add"){
        this.addOrEditForm.saleBrchCode = info.brchCode;
        this.addOrEditForm.saleBrchName = info.brchFullNameZh;
      }else {
        this.queryFormItem.saleBrchCode = info.brchCode;
        this.queryFormItem.saleBrchName = info.brchFullNameZh;
      }
      this.showCpesBrchWin = false;
    },*/
    batchDetailSubmit() {
      this.applyEditWin = false;
      this.$refs.editdatagrid.dataChange(
        this.$refs.editdatagrid.pageInfo.pageNo
      );
    },
    noCommitButton() {
      this.noCommit = true;
      this.hasCommit = false;
      this.queryFormItem.isCommit = "0";
      this.handleQuoteAppSearch();
    },
    //已提交
    hasCommitButton() {
      this.hasCommit = true;
      this.noCommit = false;
      this.queryFormItem.isCommit = "1";
      this.handleQuoteAppSearch();
    },
    handleQuoteAppSearch() {
      this.currentSelectRow = [];
      this.$refs.editdatagrid.dataChange(1);
    },
    cancelAppl() {
      if (this.currentSelectRow.length > 1) {
        this.$msgTip.info(this, {
          info: this.$t("m.i.common.onlyChooseOneData")
        });
        return;
      }
      if (this.currentSelectRow.length == 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        return;
      }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: this.$t("确认要撤销申请吗") + "?",
        onOk: () => {
          let id = this.currentSelectRow.id;
          post({ id: id,ownedBrchNo:this.currentSelectRow.ownedBrchNo,licenseFlag:this.licenseFlag }, "/be/market/redeem/rebuy/rebuyMatureApplyMain/func_cancelApply").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.currentSelectRow = [];
              } else {
                this.$msgTip.error(this, { info: msg });
              }
              this.$refs.editdatagrid.dataChange(
                this.$refs.editdatagrid.pageInfo.pageNo
              );
            } else {
              this.$msgTip.error(this, {
                info: this.$t("m.i.common.netError")
              });
            }
          });
        }
      });
    },

    //根据弹框所选数据进行赋值
    /*brchNoChange(info) {
      let objs = [];
      if(info instanceof Array){
        objs = info;
      } else {
        objs[0] = info;
      }
      let brchNos = "";
      let brchNames = "";
      for(var i=0;i<objs.length; i++){
        brchNos += objs[i].id + ',';
        brchNames += objs[i].title + ',';
      }
      this.queryFormItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
      this.queryFormItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
      this.brchNoWin = false;
    },
    brchNoWinOpen() {
      this.brchNoWin = true;},
    brchNoWinClose() {
      this.brchNoWin = false;
    },*/


    //根据弹框所选数据进行赋值
    /*brchNoChange1(info) {
      let objs = [];
      if(info instanceof Array){
        objs = info;
      } else {
        objs[0] = info;
      }
      let brchNos = "";
      let brchNames = "";
      for(var i=0;i<objs.length; i++){
        brchNos += objs[i].id + ',';
        brchNames += objs[i].title + ',';
      }
      this.addOrEditForm.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
      this.addOrEditForm.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
      this.brchNoWin1 = false;
    },
    brchNoWinOpen1() {
      this.brchNoWin1 = true;},
    brchNoWinClose1() {
      this.brchNoWin1 = false;
    },*/
    doubleHandleClick(arr) {
      this.currentSelectCopyRow = arr;
      this.formAdd();
      this.currentSelectCopyRow = null;
    },
  },
  mounted() {
    this.getDictListByGroups(
      "BusiType,DraftTypeCode,CDMedia,RedeemType,RebuyRedeemStatus,RedeemReason,AdjustType,QuoteStatus,ClearType,ClearSpeed,AcctFlag,StlResult,SettleType"
    ).then(res => {
      this.busiTypeList = res.get("BusiType");
      this.billTypeList = res.get("DraftTypeCode");
      this.billClassList = res.get("CDMedia");
      this.redeemTypeList = res.get("RedeemType");
      this.adjustTypeList = res.get("AdjustType");
      this.redeemReasonList = res.get("RedeemReason");
      this.dictMap = res.get("map");
    });

    post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
      if (res) {
        let retCode = res.data.retCode;
        if (retCode === "000000") {
          this.licenseFlag = res.data.retData.licenseFlag;
          if (this.licenseFlag) {
            this.$refs.editdatagrid.controlColumnsHidden("ownedBrchName", false);
          }else {
            this.$refs.editdatagrid.controlColumnsHidden("ownedBrchName", true);
          }
        } else {
          this.$msgTip.error(this, { info: res.data.retMsg });
        }
      }else {
        this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
      }
    });
  }
};
</script>
