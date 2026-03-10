<template>
  <div>
    <h-msg-box v-model="tempAcptAddOrEditWin" :maximize="true" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="9" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchOptType==='add'">{{$t('m.i.ce.addApply')}}</span>
        <span v-else-if="batchOptType==='modify' && batchParams.isCommit === 'noCommit'">{{$t('m.i.ce.modifyApply')}}</span>
        <span v-else-if="batchOptType==='modify' && batchParams.isCommit === 'hasCommit'">{{$t('m.i.ce.cancelApply')}}</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <h-form-item prop="prodNo" :label="$t('m.i.common.busiType')" required>
            <h-select v-model="addOrEditForm.prodNo" placeholder="" :readonly="batchOptType==='modify'">
              <h-option v-for="item in prodNoArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="acptType" :label="$t('m.i.ce.acptType')" required>
            <h-select v-model="addOrEditForm.acptType" placeholder="" :readonly="batchOptType==='modify'">
              <h-option v-for="item in this.batchParams.acptTypeArray" :value="item.key" :key="item.key">{{ item.value
                }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
            <h-input v-model="addOrEditForm.drwrName" placeholder="" @on-change="handleDrwrNameChange"
                     :icon="batchOptType ==='add' ? 'android-search' : ''" @on-click="queryCustNo"
                     readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" required>
            <h-input v-model="addOrEditForm.drwrAcctNo" placeholder=""
                     :icon="batchOptType ==='add' ? 'android-search' : ''" @on-click="queryCustAcct('drwr')"
                     readonly></h-input>
          </h-form-item>
          <h-form-item prop="settleAcctNo" v-if="this.addOrEditForm.acptType!=='3'" :label="$t('m.i.ce.settleAcctNo')" required>
            <h-input v-model="addOrEditForm.settleAcctNo" placeholder="" icon="android-search"
                     @on-click="queryCustAcct('settle')" readonly></h-input>
          </h-form-item>
         <!-- <h-form-item :label="this.addOrEditForm.acptType === '2' ? '被代签机构': '承兑机构'" prop="acptBrchName" required>
            <h-input placeholder="" v-model="addOrEditForm.acptBrchName" readonly icon="android-search"
                     @on-click="queryBrchNo('acpt')"></h-input>
          </h-form-item>-->
          <show-branch v-model="addOrEditForm.acptBrchNo" :label="this.addOrEditForm.acptType === '2' ? $t('m.i.ce.signBranch'): $t('m.i.ce.acptBranch')"
                       prop="acptBrchNo" required title="机构名称" :showCheckBox="false" :msgBoxWin="tempAcptAddOrEditWin"
                       @brchNoChange="brchNoChange($event,'acpt')" :brchNo.sync="addOrEditForm.acptBrchNo" :brchName.sync="addOrEditForm.acptBrchName">
          </show-branch>
         <!-- <h-form-item :label="$t('m.i.ce.drweBankName')" v-if="this.addOrEditForm.acptType !== '2'" prop="drweBankName" required>
            <h-input placeholder="" v-model="addOrEditForm.drweBankName" readonly icon="android-search"
                     @on-click="queryBrchNo('pay')"></h-input>
          </h-form-item>-->
          <show-branch v-model="addOrEditForm.drweBankNo" :label="$t('m.i.ce.drweBankName')" v-if="this.addOrEditForm.acptType !== '2'"
                       prop="drweBankNo" required title="机构名称" :showCheckBox="false" :msgBoxWin="tempAcptAddOrEditWin"
                       @brchNoChange="brchNoChange($event,'pay')" :brchNo.sync="addOrEditForm.drweBankNo" :brchName.sync="addOrEditForm.drweBankName">
          </show-branch>
          <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
            <h-date-picker type="date" placeholder="" v-model="addOrEditForm.remitDt" format="yyyy-MM-dd" showFormat
                           :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker type="date" placeholder="" v-model="addOrEditForm.dueDt" format="yyyy-MM-dd" showFormat
                           :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item prop="chargeType" :label="$t('m.i.ce.chargeType')" required>
            <h-select v-model="addOrEditForm.chargeType" placeholder="" :readonly="batchOptType==='modify'">
              <h-option v-for="item in chargeTypeArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="feeRatio" :label="$t('m.i.ce.feeRatio')" required :validRules="this.ratePerRule">
            <h-typefield placeholder="费率范围0~10000" type="money" v-model="addOrEditForm.feeRatio" :divided="false">
              <slot slot="append"><span>&#8241;</span></slot>
            </h-typefield>
          </h-form-item>
          <h-form-item prop="commitFeeRatio" :label="$t('m.i.ce.commitFeeRatio')" :validRules="this.ratePerRule">
            <h-typefield placeholder="费率范围0~10000" type="money" v-model="addOrEditForm.commitFeeRatio" :divided="false">
              <slot slot="append"><span>&#8241;</span></slot>
            </h-typefield>
          </h-form-item>
          <h-form-item prop="acptProtocalNo" :label="$t('m.i.billInfo.acptProtocalNo')">
            <h-input v-model="addOrEditForm.acptProtocalNo" placeholder="" maxlength="40" :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item prop="guarntrType" :label="$t('m.i.ce.guarntrType')" required>
            <h-select v-model="addOrEditForm.guarntrType" placeholder="" :readonly="batchOptType==='modify'" @on-change="guarntrTypeOnChange" >
              <h-option v-for="item in this.batchParams.guarntrTypeArray" :value="item.key" :key="item.key">{{
                item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item v-if="this.addOrEditForm.guarntrType !== '' && this.addOrEditForm.guarntrType !== '4'"
                       prop="guarntrNo"
                       :label="this.addOrEditForm.guarntrType === '1' ? '保证金账号' : this.addOrEditForm.guarntrType === '2' ? '存单编号' : '票据池编号'"
                       required>
            <h-input v-model="addOrEditForm.guarntrNo" placeholder="" maxlength="32"
                     :icon="this.addOrEditForm.guarntrType !== '2' && this.batchOptType === 'add' ? 'android-search' : ''"
                     @on-click="queryCustAcct('guarntr')" :readonly="this.addOrEditForm.guarntrType !== '2'"></h-input>
          </h-form-item>
          <h-form-item placeholder="" :label="$t('m.i.ce.guarntrRateType')" prop="guarntrRateType"
                       v-if="this.addOrEditForm.guarntrType === '1' || this.addOrEditForm.guarntrType === '2'">
            <h-select v-model="addOrEditForm.guarntrRateType" placeholder=""
                      @on-change="guarntrRateTypeOnChange" key="guarntrRateTypeSelect">
              <h-option value="1" key="1">{{$t('m.i.ce.guarntrRateType_day')}}</h-option>
              <h-option value="30" key="30">{{$t('m.i.ce.guarntrRateType_month')}}</h-option>
              <h-option value="360" key="360">{{$t('m.i.ce.guarntrRateType_year')}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item v-if="this.addOrEditForm.guarntrType === '1' || this.addOrEditForm.guarntrType === '2'"
                       prop="guarntrRate" :label="$t('m.i.ce.guarntrRate')" :validRules="this.guarntrRateRule">
            <h-typefield placeholder="" type="money" v-model="addOrEditForm.guarntrRate" :divided="false">
              <slot slot="append">
                <span ref="guarntrTypeShow" v-html="this.guarntrRateTypeIcon"></span>
              </slot>
            </h-typefield>
          </h-form-item>
          <h-form-item v-if="this.addOrEditForm.guarntrType === '1'" prop="bailPcet" :label="$t('m.i.ce.bailPcet')" required :validRules="this.ratePctRule">
            <h-typefield placeholder="" type="money" v-model="addOrEditForm.bailPcet" min="0" max="100" suffixNum="2">
              <slot slot="append"><span>&#37;</span></slot>
            </h-typefield>
          </h-form-item>
          <h-form-item prop="agencyBankNo" :validRules="this.bankNoRule" key="agencyBankNo"
                       v-if="this.addOrEditForm.acptType === '2' || this.addOrEditForm.acptType === '3'"
                       :label="this.addOrEditForm.acptType === '2' ? '代签行行号' : '被代签行行号'" required>
            <h-input v-model="addOrEditForm.agencyBankNo" placeholder="" :maxlength=12></h-input>
          </h-form-item>
          <h-form-item prop="agencyBankName"
                       v-if="this.addOrEditForm.acptType === '2' || this.addOrEditForm.acptType === '3'"
                       :label="this.addOrEditForm.acptType === '2' ? '代签行行名' : '被代签行行名'" required>
            <h-input v-model="addOrEditForm.agencyBankName" placeholder="" :maxlength=255></h-input>
          </h-form-item>
          <h-form-item prop="agencyAcctNo" v-if="this.addOrEditForm.acptType === '3'" :label="$t('m.i.ce.agencyAcctNo')" required
                       :validRules="this.acctNoRule" key="agencyAcctNo">
            <h-input placeholder="" v-model="addOrEditForm.agencyAcctNo" :maxlength=32></h-input>
          </h-form-item>
          <h-form-item prop="invoiceAfterFlag" :label="$t('m.i.ce.invoiceAfterFlag')" required>
            <h-select v-model="addOrEditForm.invoiceAfterFlag" placeholder="" showTitle>
              <h-option v-for="item in this.batchParams.YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="forceInvoiceFlag" v-if="addOrEditForm.invoiceAfterFlag === '0'" :label="$t('m.i.ce.forceInvoiceFlag')" required>
            <h-select v-model="addOrEditForm.forceInvoiceFlag" placeholder="" showTitle>
              <h-option v-for="item in this.batchParams.YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()" v-if="this.batchParams.isCommit === 'noCommit'">{{$t('m.i.common.save')}}</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/ce/acpt/paper/apply/acptApplyMain/func_queryPageAcptBil"
          :bindForm="formItem"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoAddOrModifyWin('add')">
              新增
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'"
                      @click="infoAddOrModifyWin('modify')">{{$t('m.i.common.modify')}}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="copyBill">{{$t('m.i.be.copy')}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoImport">{{$t('m.i.common.batchImport')}}</h-button>
            <!--<h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoExport">批量导出</h-button>-->
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="importTemplate">{{$t('m.i.common.importTemplateDownload')}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoDelete">{{$t('m.i.common.delete')}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="relationInvoice">{{$t('m.i.ce.relationInvoice')}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="invoiceManager">{{$t('m.i.bm.invoiceManager')}}</h-button>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t('m.i.common.submit')}}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">{{$t('m.i.ce.selectSubmit')}}</h-dropdown-item>
                <h-dropdown-item name="batch">{{$t('m.i.ce.batchSubmit')}}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="infoCancel">{{$t('m.i.common.cancel')}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.addOrEditForm.drwrCustNo"
                       :isAllBankAcct="this.isAllBankAcct" :custAcctKind="this.custAcctKind" :busiOwnBrchNo="this.busiOwnBrchNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
   <!-- <show-brch-info :showBranchWin="showBranchWin" :title="brchTitle" @brchNoChange="brchNoChange"
                    @showBranchWinClose="showBranchWinClose"></show-brch-info>-->
    <!-- 添加票面信息 -->
    <common-bill-info :addBillInfoWin="addBillInfoWin" :billInfoParams="billInfoParams"
                      :acptApplyParams="acptApplyParams" :isAcptApply="true" @addBillInfoWinClose="addBillInfoWinClose"
                      @addBillInfoSubmit="addBillInfoSubmit"></common-bill-info>
    <!--展示票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
    <invoice-pick-bill :billPickInvoiceWin="billPickInvoiceWin" :billPickInvoiceParams="billPickInvoiceParams" @billPickInvoiceWinClose="billPickInvoiceWinClose" @billPickInvoiceChange="billPickInvoiceChange"></invoice-pick-bill>
    <relation-invoice-bill-info :relationInvoiceBillWin="relationInvoiceBillWin" :relationInvoiceBillParams="relationInvoiceBillParams" @relationInvoiceBillWinClose="relationInvoiceBillWinClose" ></relation-invoice-bill-info>
    <show-pool-credit-info :pool-credit-info-win="poolCreditInfoWin" :poolCreditInfoParams="poolCreditInfoParams"
                           @poolCreditInfoChange="poolCreditInfoChange"
                           @poolCreditInfoWinClose="poolCreditInfoWinClose"></show-pool-credit-info>
    <!--复制票据-->
    <show-copy-bill :showCopyBillWin="showCopyBillWin"
                    @showCopyBillWinClose="showCopyBillWinClose" :copyBillInfo="copyBillInfo"></show-copy-bill>
  </div>
</template>

<script>
  import { post, on, off, accMul, accDiv, formatNumber } from "@/api/bizApi/commonUtil";
  import ShowCopyBill from "../../../../../../components/bemp/showCopyBill";

  export default {
    name: "acptApplyAdd",
    components: {
      ShowCopyBill,
      //"show-brch-info": ()=>import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      "invoice-pick-bill":()=>import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/billPickInvoice`),
      "relation-invoice-bill-info":()=>import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/relationInvoiceBillInfo`),
    },
    data() {
      return {
        ratePerRule: [{
          test: /^(\d{1,4}(\.\d{1,2})?|10000|10000\.00)$/,
          trigger: ["blur","change"],
          message: "费率范围0~10000，且小数位不超过两位"
        }],
        ratePctRule: [{
          test: /^(\d{1,2}(\.\d{1,2})?|100|100\.00)$/,
          trigger: ["blur","change"],
          message: "范围0~100，且小数位不超过两位"
        }],
        rateTsdRule: [{
          test: /^(\d{1,3}(\.\d{1,2})?|1000|1000\.00)$/,
          trigger: ["blur","change"],
          message: "范围0~1000，且小数位不超过两位"
        }],
        guarntrRateRule: [{ test: this.validRate, trigger: "blur" }],
        acctNoRule: [{ test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "账号由不超过32位的数字或字母组成" }],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "行号由12位数字组成" }],
        guarntrRateTypeIcon: "&#37;",
        selectDrwrAcct: false,
        selectSettleAcct: false,
        selectGuarntrAcct: false,
        //selectAcptBrch: false,
        //selectPayBrch: false,
        isAllBankAcct: false,
        brchTitle: "承兑机构查询",
        custAcctKind: "",
        batchId: "",
        prodNoArray: [{ key: "01010111", value: "纸票银承签发" }],
        chargeTypeArray: [{ key: "1", value: "转账" }, { key: "2", value: "现金" }, { key: "3", value: "内部户" }],
        formItem: {
          batchId: "",
          curFuncNo: "",
          billClass: "ME01"
        },
        billPickInvoiceParams: {
          listId: "",
          custNo: "",
          billNo: "",
          invoiceFlag: "",
          billMoney: "",
          batchNo: "",
          billId: "",
          dictMap: this.batchParams.dictMap
        },
        relationInvoiceBillParams: {
          listId: "",
          cancelRelationUrl: "",
          dictMap: this.batchParams.dictMap
        },
        YonList: [],
        addOrEditForm: {
          dataSource: "1",
          billClass: "ME01",
          billType: "AC01",
          id: "",
          drwrCustNo: "",
          drwrName: "",
          drwrAcctNo: "",
          acptType: "1",
          prodNo: "01010111",
          settleAcctNo: "",
          acptProtocalNo: "",
          drwrBrchNo: "",
          drwrBankNo: "",
          drwrBankName: "",
          remitDt: "",
          dueDt: "",
          acptBrchName: "",
          acptBrchNo: "",
          paymentBrchNo: "",
          drweBankNo: "",
          drweBankName: "",
          guarntrType: "4",
          guarntrNo: "",
          guarntrOrder: "",
          guarntrRate: "",
          feeRatio: "",
          commitFeeRatio: "",
          bailPcet: "",
          settleAcctOrderNo: "",
          agencyBankNo: "",
          agencyBankName: "",
          agencyAcctNo: "",
          chargeType: "1",
          guarntrRateType: "",
          invoiceAfterFlag: "0",
          forceInvoiceFlag: "",
          batchNo: "",
          billId: ""
        },
        columns: [
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
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
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
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
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.remitDt"),
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
            title: this.$t("m.i.billInfo.dueDt"),
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
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          // {
          //    title: this.$t("m.i.billInfo.pyeeBankNo"),
          //   key: "pyeeBankNo",
          //   ellipsis: false,
          //   hiddenCol: false
          // },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        //票据明细界面-区分新增/修改操作
        billOptType: "",
        //票面信息窗口
        addBillInfoWin: false,
        //修改票据明细界面所需入参
        billInfoParams: {
          billOptType: "",
          billType: "",
          billId: "",
          billNo: "",
          dictMap: new Map(),
          billTypeList: []
        },
        acptApplyParams: {
          remitDt: "",
          dueDt: "",
          drwrName: "",
          drwrAcctNo: "",
          drweBankName: "",
          drweBankNo: "",
          drweBankAddr: "",
          acptProtocalNo: "",
          acptName: "",
          acptBankNo: ""
        },

        showCustMessageWin: false,
        showCustAcctNoWin: false,
        poolCreditInfoWin: false,
        poolCreditInfoParams: {},
        // showBranchWin: false,
        //记录批次是否已保存
        hadBatchSave: false,
        importWin: false,
        fileParams: {
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/apply/acptApplyMain/func_loadExcelData",  //导入excel数据解析接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/apply/acptApplyMain/func_submitExcelData",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
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
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              ellipsis: false,
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
              title: this.$t("m.i.billInfo.billMoneyByUnit"),
              key: "billMoney",
              ellipsis: false,
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
              title: this.$t("m.i.billInfo.pyeeName"),
              key: "pyeeName",
              ellipsis: false,
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeAcctNo"),
              key: "pyeeAcctNo",
              ellipsis: false,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeBankName"),
              key: "pyeeBankName",
              sortable: true,
              ellipsis: false,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drweBankAddr"),
              key: "drweBankAddr",
              ellipsis: false,
              hiddenCol: false
            }
          ],
          paramKey: "list"         //后台接收对应key
        },
        showBillInfoWin: false,
        billPickInvoiceWin: false,
        relationInvoiceBillWin: false,
        showCopyBillWin:false,
        billId: "",
        billNo: "",
        submitType: "",
        //票据批次界面-区分新增/修改操作
        batchOptType: "",
        copyBillInfo:{}
      };
    },
    props: {
      busiOwnBrchNo: {
        type: String,
        default: ""
      },
      acptAddOrEditWin: {
        type: Boolean,
        default: false
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          billTypeList: [],
          batchId: "",
          optType: "",
          isCommit: "",
          curFuncNo: "",
          invoiceAfterFlag: "",
          acptType:"",
          guarntrType:"",
          acptTypeArray: [],
          guarntrTypeArray: [],
          YonList: [],
        }
      }
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
            this.batchId = this.batchParams.batchId;
            this.formItem.batchId = this.batchId;
            this.formItem.curFuncNo = this.batchParams.curFuncNo;
            this.addOrEditForm.invoiceAfterFlag = this.batchParams.invoiceAfterFlag;
            this.addOrEditForm.acptType = this.batchParams.acptType;
            this.addOrEditForm.guarntrType = this.batchParams.guarntrType;
            if (this.batchParams.optType === "modify") {
              this.queryObjById();
              this.handleSearch();
            }
            if (this.batchParams.optType === "add") {
              this.$refs.datagrid.tData = [];
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      validRate(rule, val, callback) {
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
      handleDrwrNameChange(value){
        this.addOrEditForm.drwrAcctNo = "";
        this.addOrEditForm.settleAcctNo = "";
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //修改时根据票据批次Id查询票据批次信息
      queryObjById() {
        let params = { id: this.batchId, billClass: "ME01", funcNo: this.batchParams.curFuncNo };
        post(params, "/ce/acpt/paper/apply/acptApplyMain/func_getAcptBatchById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.prodNo = obj.prodNo;
              this.addOrEditForm.acptType = obj.acptType;
              this.addOrEditForm.drwrAcctNo = obj.drwrAcctNo;
              this.addOrEditForm.drwrName = obj.drwrName;
              this.addOrEditForm.batchNo = obj.batchNo;
              this.addOrEditForm.drwrBrchNo = obj.drwrBrchNo;
              this.addOrEditForm.drwrBankNo = obj.drwrBankNo;
              this.addOrEditForm.drwrCustNo = obj.drwrCustNo;
              this.addOrEditForm.drwrBankName = obj.drwrBankName;
              this.addOrEditForm.settleAcctNo = obj.settleAcctNo;
              this.addOrEditForm.settleAcctOrderNo = obj.settleAcctOrderNo;
              this.addOrEditForm.acptBrchName = obj.acptBrchName;
              this.addOrEditForm.acptBrchNo = obj.acptBrchNo;
              this.addOrEditForm.drweBankName = obj.drweBankName;
              this.addOrEditForm.drweBankNo = obj.drweBankNo;
              this.addOrEditForm.chargeType = obj.chargeType;
              this.addOrEditForm.feeRatio = accMul(obj.feeRatio, 10000);
              /*if (obj.commitFeeRatio != 0) {
                this.addOrEditForm.commitFeeRatio = accMul(obj.commitFeeRatio, 10000);
              }*/
              //测试提出问题修复，出现问题还原
              this.addOrEditForm.commitFeeRatio = accMul(obj.commitFeeRatio, 10000);
              this.addOrEditForm.acptProtocalNo = obj.acptProtocalNo;
              this.addOrEditForm.guarntrType = obj.guarntrType;
              if (this.addOrEditForm.guarntrType !== "" && this.addOrEditForm.guarntrType !== "4") {
                this.addOrEditForm.guarntrNo = obj.guarntrNo;
              }
              if (this.addOrEditForm.guarntrType === "1" || this.addOrEditForm.guarntrType === "2") {
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
              if (this.addOrEditForm.guarntrType === "1") {
                this.addOrEditForm.bailPcet = accMul(obj.bailPcet, 100);
              }
              if (this.addOrEditForm.acptType === "2" || this.addOrEditForm.acptType === "3") {
                this.addOrEditForm.agencyBankNo = obj.agencyBankNo;
                this.addOrEditForm.agencyBankName = obj.agencyBankName;
              }
              if (this.addOrEditForm.acptType === "3") {
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
              this.hadBatchSave = true;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      guarntrTypeOnChange() {
        if (this.batchParams.optType === "add") {
          this.addOrEditForm.guarntrNo = "";
          this.addOrEditForm.guarntrRateType = "";
          this.addOrEditForm.guarntrRate = "";
          this.addOrEditForm.bailPcet = "";
        }
      },
      guarntrRateTypeOnChange(guarntrRateType) {
        if (guarntrRateType === "360") {
          this.guarntrRateTypeIcon = "&#37;";
        } else if (guarntrRateType === "30") {
          this.guarntrRateTypeIcon = "&#8240;";
        } else if (guarntrRateType === "1") {
          this.guarntrRateTypeIcon = "&#8241;";
        } else {
          this.guarntrRateTypeIcon = "&#37;";
        }
        if (!!this.addOrEditForm.guarntrRate) {
          this.$refs.addOrEditForm.validateField("guarntrRate");
        }
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.addOrEditForm.acptType="1";
        this.addOrEditForm.prodNo= "01010111";
        this.addOrEditForm.guarntrType="4";
        this.addOrEditForm.drwrCustNo = "";
        this.addOrEditForm.drwrBrchNo = "";
        this.addOrEditForm.settleAcctNo = "";
        this.addOrEditForm.acptBrchNo = "";
        this.addOrEditForm.drweBankNo = "";
        this.addOrEditForm.drweBankName = "";
        this.addOrEditForm.paymentBrchNo = "";
        this.addOrEditForm.settleAcctOrderNo = "";
        this.addOrEditForm.drwrBankNo = "";
        this.addOrEditForm.drwrBankName = "";
        this.addOrEditForm.guarntrOrder = "";
        this.addOrEditForm.dataSource = "1";
        this.addOrEditForm.chargeType="1";
        this.addOrEditForm.billClass = "ME01";
        this.addOrEditForm.billType = "AC01";
        this.hadBatchSave = false;
        this.addOrEditForm.invoiceAfterFlag = "0";
        this.addOrEditForm.forceInvoiceFlag = "";
        this.addOrEditForm.agencyBankNo = "";
        this.addOrEditForm.agencyBankName = "";
        this.addOrEditForm.agencyAcctNo = "";
        this.addOrEditForm.guarntrRate = "";
        this.addOrEditForm.guarntrRateType="";
        this.guarntrRateTypeIcon = "&#37;";
        this.addOrEditForm.feeRatio = "";
        this.$emit("acptAddOrEditWinClose", "");
      },
      //表单查询
      handleSearch() {
        this.clearSelectData();
        this.$refs.datagrid.dataChange(1);
      },
      clearSelectData(){
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.selectIds=[];
      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.drwrReset();
        this.addOrEditForm.drwrName = info.custName;
        this.addOrEditForm.drwrCustNo = info.custNo;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      queryCustAcct(type) {
        if (this.addOrEditForm.acptType === "") {
          this.$msgTip.info(this, { info: "请先选择签发类型" });
          return;
        }
        if (this.addOrEditForm.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择出票人名称" });
          return;
        }
        if (type === "drwr") {
          if (this.addOrEditForm.acptType === "3") {
            this.isAllBankAcct = true;
          }
          this.selectDrwrAcct = true;
          this.custAcctKind = "";
          this.showCustAcctNoWin = true;
        } else if (type === "settle") {
          this.selectSettleAcct = true;
          this.custAcctKind = "";
          this.showCustAcctNoWin = true;
        } else if (type === "guarntr") {
          let guarntrType = this.addOrEditForm.guarntrType;
          if (guarntrType === "1") {
            this.selectGuarntrAcct = true;
            this.custAcctKind = "2";
            this.showCustAcctNoWin = true;
          } else {
            // this.poolCreditInfoParams.batchId = this.currentSelectRow.batchId;
            this.poolCreditInfoParams.custNo = this.addOrEditForm.drwrCustNo;
            this.poolCreditInfoParams.dataUrl = "/ce/acpt/paper/apply/acptApplyAdd/func_pagingQueryCustCreditInfo";
            this.poolCreditInfoWin = true;
          }
        }
      },
      //赋值
      custAcctNoSelectSubmit(info) {
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
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
        this.clearAcctFlag();
      },
      clearAcctFlag() {
        this.isAllBankAcct = false;
        this.selectGuarntrAcct = false;
        this.selectDrwrAcct = false;
        this.selectSettleAcct = false;
      },
     /* //查询机构弹出框
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
     /* clearBrchFlag() {
        this.selectAcptBrch = false;
        this.selectPayBrch = false;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },*/

      //保存批次信息
      formSave() {
        let remitDate = this.$moment(this.addOrEditForm.remitDt).format('YYYY/MM/DD');
        remitDate=new Date(remitDate);
        let dueDate = this.$moment(this.addOrEditForm.dueDt).format('YYYY/MM/DD');
        dueDate=new Date(dueDate);
        let month = (dueDate.getFullYear() - remitDate.getFullYear())*12;
        month = month + (dueDate.getMonth() - remitDate.getMonth());
        if(dueDate.getDate() - remitDate.getDate() > 0){
          month = month + 1;
        }
        console.log(month);
        if(month > 6){
          this.$msgTip.info(this, { info: "纸票期限最大6个月!" });
          return;
        }

        this.addOrEditForm.remitDt = this.addOrEditForm.remitDt.replace(/-/g, "");
        this.addOrEditForm.dueDt = this.addOrEditForm.dueDt.replace(/-/g, "");
        if (this.addOrEditForm.remitDt < window.sessionStorage.getItem("workDate")) {
          this.$msgTip.info(this, { info: "出票日期必须大于或等于当前营业日期" });
          return;
        }
        if (this.addOrEditForm.remitDt >= this.addOrEditForm.dueDt) {
          this.$msgTip.info(this, { info: "出票日期必须小于汇票到期日" });
          return;
        }
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let param = this.deepClone(this.addOrEditForm);
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
            param.dueDt = this.$moment(param.dueDt).format("YYYYMMDD");
            if (this.addOrEditForm.acptType === "3") {
              param.settleAcctNo = param.agencyAcctNo;
            }
            let url = this.batchParams.optType === "add" ? "/ce/acpt/paper/apply/acptApplyMain/func_addAcptBatch" : "/ce/acpt/paper/apply/acptApplyMain/func_editAcptBatch";
            if (this.hadBatchSave) {
              url = "/ce/acpt/paper/apply/acptApplyMain/func_editAcptBatch";
            }
            post(param, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.batchParams.optType === "add" && this.hadBatchSave === false) {
                    this.batchId = res.data.retData;
                    this.batchParams.batchId = res.data.retData;
                    this.formItem.batchId = res.data.retData;
                    this.addOrEditForm.id = res.data.retData;
                  }
                  this.clearSelectData();
                  this.hadBatchSave = true;
                  this.batchParams.optType = "modify";
                  this.batchOptType = this.batchParams.optType;
                  this.$refs.datagrid.dataChange(1);
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
      //新增、修改
      infoAddOrModifyWin(str) {
        this.billOptType = str;
        let currentSelectList = this.$refs.datagrid.selects;
        if (this.batchParams.optType === "add") {
          if (this.billOptType === "add") {
            if (this.hadBatchSave) {
              this.jumpToAddBillWin();
            } else {
              this.$msgTip.info(this, { info: "请先保存批次" });
              return;
            }
          } else if (this.billOptType === "modify") {
            if (currentSelectList.length === 0) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
              return;
            }
            if (currentSelectList.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.billInfoParams.billId = currentSelectList[0].billId;
            this.billInfoParams.billNo = currentSelectList[0].billNo;
            this.jumpToAddBillWin();
          }
        }
        if (this.batchParams.optType === "modify") {
          if (this.billOptType === "add") {
            this.jumpToAddBillWin();
          }
          if (this.billOptType === "modify") {
            if (currentSelectList.length === 0) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
              return;
            }
            if (currentSelectList.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.billInfoParams.billId = currentSelectList[0].billId;
            this.billInfoParams.billNo = currentSelectList[0].billNo;
            this.jumpToAddBillWin();
          }
        }
      },
      //跳转到新增明细界面
      jumpToAddBillWin() {
        this.billInfoParams.billOptType = this.billOptType;
        this.billInfoParams.billType = this.addOrEditForm.billType;
        this.billInfoParams.dictMap = this.batchParams.dictMap;
        this.billInfoParams.billTypeList = this.batchParams.billTypeList;
        this.acptApplyParams.remitDt = this.addOrEditForm.remitDt;
        this.acptApplyParams.dueDt = this.addOrEditForm.dueDt;
        this.acptApplyParams.drwrName = this.addOrEditForm.drwrName;
        this.acptApplyParams.drwrAcctNo = this.addOrEditForm.drwrAcctNo;
        this.acptApplyParams.drweBankName = this.addOrEditForm.drweBankName;
        this.acptApplyParams.drweBankNo = this.addOrEditForm.drweBankNo;
        this.acptApplyParams.acptProtocalNo = this.addOrEditForm.acptProtocalNo;
        //this.acptApplyParams.acptName = this.addOrEditForm.drweBankName;
        //this.acptApplyParams.acptBankNo = this.addOrEditForm.drweBankNo;
        this.acptApplyParams.acptName = this.addOrEditForm.acptBrchName;
        this.queryObjByBrchNo(this.addOrEditForm.acptBrchNo,this.acptApplyParams,"addBillInfoWin");
        //this.addBillInfoWin = true;
      },
      //根据机构号查询行号
      queryObjByBrchNo(brchNo,params,showWin) {
        post({ brchNo: brchNo }, "sm/auth/branch/getBranchByBranchTreeNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
                params.acptBankNo = res.data.retData.bankNo;
                if("addBillInfoWin" == showWin){
                  this.addBillInfoWin = true;
                }else if("importWin" == showWin){
                  this.importWin = true;
                }
            }
          }
        });
      },
      //新增、修改弹窗关闭
      addBillInfoWinClose() {
        this.addBillInfoWin = false;
        this.billInfoParams = {};
        this.handleSearch();
      },
      //新增、修改弹窗确定
      addBillInfoSubmit(info) {
        let params = {};
        params = info;
        delete params.billNo;
        params.batchId = this.batchId;
        params.remitDt = this.$moment(info.remitDt).format("YYYYMMDD");
        params.dueDt = this.$moment(info.dueDt).format("YYYYMMDD");
        params.billMoney = info.billMoney.replace(/,/g, "");
        if (info.remitDt >= info.dueDt) {
          this.$msgTip.info(this, { info: "出票日期必须小于汇票到期日" });
          return;
        }
        if (this.billOptType === "modify") {
          params.id = this.$refs.datagrid.selects[0].id;
        }
        let url = this.billOptType === "add" ? "/ce/acpt/paper/apply/acptApplyMain/func_addPaperAcptBillInfo" : "/ce/acpt/paper/apply/acptApplyMain/func_updatePaperAcptBillInfo";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.addBillInfoWin = false;
              let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
              this.$refs.datagrid.dataChange(pageNo);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //批量导入
      infoImport() {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        //this.importWin = true;
        let params = {
          batchId: this.batchId,
          billClass: "ME01",
          billType: this.addOrEditForm.billType,
          remitDt: this.addOrEditForm.remitDt.replace(/-/g, ""),
          dueDt: this.addOrEditForm.dueDt.replace(/-/g, ""),
          drwrName: this.addOrEditForm.drwrName,
          drwrAcctNo: this.addOrEditForm.drwrAcctNo,
          drweBankName: this.addOrEditForm.drweBankName,
          drweBankNo: this.addOrEditForm.drweBankNo,
          acptProtocalNo: this.addOrEditForm.acptProtocalNo,
          acptName: this.addOrEditForm.acptBrchName
          //acptBankNo: this.addOrEditForm.drweBankNo
        };
        this.queryObjByBrchNo(this.addOrEditForm.acptBrchNo,params,"importWin");
        this.fileParams.extraGridDatas = params;
      },
      importWinClose() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      //批量导出
      infoExport() {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        this.exportForm();
      },
      exportForm() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_exportExcel";
        let form = document.createElement("form");
        for (let obj in this.formItem) {
          if (this.formItem.hasOwnProperty(obj)) {
            let input = document.createElement("input");
            input.tpye = "text";
            input.name = obj;
            input.value = this.formItem[obj];
            form.appendChild(input);
          }
        }
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/apply/acptApplyMain/func_downloadAcptApply";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //删除
      infoDelete() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDeleteDetail();
          }
        });
      },
      handleDeleteDetail() {
        let list = this.$refs.datagrid.selects;
        let ids = [];
        for (let i = 0; i < list.length; i++) {
          ids.push(list[i].id);
        }
        post({
          ids: ids.join(","),
          batchId: this.batchId,
          acptType: this.addOrEditForm.acptType,
          billClass: this.addOrEditForm.billClass
        }, "/ce/acpt/paper/apply/acptApplyMain/func_delAcptBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.clearSelectData();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
          this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        });
      },
      //提交
      submit(type) {
        this.submitType = type;
        if (type === "select") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let ids = [];
          for (let i = 0; i < list.length; i++) {
            ids.push(list[i].id);
          }
          let params = { batchId: this.batchId, ids: ids.join(","), billOperType: "0" };
          this.handleSubmit(params);
        } else if (type === "batch") {
          if (!this.hadBatchSave) {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if (this.$refs.datagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = { batchId: this.batchId, billOperType: "1" };
          this.handleSubmit(params);
        }
      },
      handleSubmit(params) {
        post(params, "/ce/acpt/paper/apply/acptApplyMain/func_submitAcptBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              if (this.submitType === "batch") {
                this.handleClose();
              } else if (this.submitType === "select") {
                if (this.$refs.datagrid.selects.length === this.$refs.datagrid.total) {
                  this.handleClose();
                } else {
                  this.clearSelectData();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.clearSelectData();
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //撤销
      infoCancel() {
        // if (this.currentSelectList.length === 0) {
        //   this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        //   return;
        // }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },
      handleCancelApplyBatch() {
        post({ batchId: this.batchId }, "/ce/acpt/paper/apply/acptApplyMain/func_cancelSubmitFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.clearSelectData();
              if (this.tempAcptAddOrEditWin) {
                this.handleClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },

      //关联发票
      relationInvoice() {
        if (this.$refs.datagrid.selects.length === 1) {
          this.billPickInvoiceParams.listId = this.$refs.datagrid.selectIds;
          this.billPickInvoiceParams.custNo = this.addOrEditForm.drwrCustNo;
          this.billPickInvoiceParams.billNo = this.$refs.datagrid.selects[0].billNo;
          this.billPickInvoiceParams.invoiceFlag = this.$refs.datagrid.selects[0].invoiceFlag;
          this.billPickInvoiceParams.billMoney = this.$refs.datagrid.selects[0].billMoney;
          this.billPickInvoiceParams.batchNo = this.addOrEditForm.batchNo;
          this.billPickInvoiceParams.billId = this.$refs.datagrid.selects[0].billId;
          this.billPickInvoiceParams.dictMap = this.batchParams.dictMap;
          this.billPickInvoiceWin = true;
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
          post({ id: listId }, "/ce/acpt/paper/apply/acptApplyMain/func_relatedInvoice").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.billPickInvoiceWinClose();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
                this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
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
            this.relationInvoiceBillParams.cancelRelationUrl = "/ce/acpt/paper/apply/acptApplyMain/func_cancelRelatedInvoice";
            this.relationInvoiceBillParams.dictMap = this.batchParams.dictMap;
            this.relationInvoiceBillWin = true;
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.ce.relationInvoiceError") });
            return;
          }
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
      },
      // 打开复制票据弹窗
      copyBill(){
        let currentSelectList = this.$refs.datagrid.selects;
        if (currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.copyBillInfo = currentSelectList[0];
        this.showCopyBillWin = true;
      },
      showCopyBillWinClose(){
        this.showCopyBillWin = false;
        this.copyBillInfo = {};
        this.$refs.datagrid.dataChange(1);
      }

    }
  };
</script>

<style scoped>

</style>
