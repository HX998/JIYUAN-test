<!--票据池签约管理-签约预受理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo">
                  <h-input v-model="formItem.agreementNo" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo('query')" clearable @on-clear="clearVal('custName')"
                           readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.signStatus')" prop="signStatus">
                  <h-select v-model="formItem.signStatus" placeholder="" showTitle>
                    <h-option v-for="item in signStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pl/plsign/preAgreementMain/func_pagingWaitAcceptAgreement"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="agreementOperate('accept')" :disabled="isAcceptAllow">{{$t("m.i.common.acceptance")}}</h-button>
              <h-button type="primary" @click="agreementOperate('modify')" :disabled="isEditAllow" >{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="freezeAgreement" :disabled="isPauseAllow">{{$t("m.i.pl.freez")}}</h-button>
              <h-button type="primary" @click="cancelAgreement" :disabled="isCancelAllow">{{$t("m.i.pl.incontinue")}}</h-button>
              <h-button type="primary" @click="percentRule" :disabled="isShowPercentRule">{{$t("m.i.pl.setDis")}}</h-button>
              <h-button type="primary" @click="queryOperateLog()">{{$t("m.i.pl.showOperLog")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击签约弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="optType==='accept'">签约受理</span>
        <span v-if="optType==='modify'">签约修改</span>
        <span v-if="optType==='renew'">续约受理</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
            <h-input v-model="addOrEditForm.custNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
            <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="custAcctNo" :label="$t('m.i.pl.custSettleAcctNo')" required>
            <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly ></h-input>
          </h-form-item>

          <h-form-item prop="operResult" :label="$t('m.i.ce.operFlag')"  required  v-if="isShowOperResult">
            <h-select v-model="addOrEditForm.operResult" placeholder="" @on-change="operFlagChange">
              <h-option value="0">拒绝</h-option>
              <h-option value="1">同意</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.dealRemark')" prop="operRemark" v-if="addOrEditForm.operResult === '0'"
                       class="h-form-height-auto" cols="2">
            <h-input type="textarea" :rows=3 v-model="addOrEditForm.operRemark" :canResize="false"
                     :maxlength="500" ></h-input>
          </h-form-item>

          <div v-if="(isRefuse!=null && isRefuse)">
            <div v-if="!(addOrEditForm.operResult === '0') ">
            <h-form-item prop="signStartDt" :label="$t('m.i.pl.signStartDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.signStartDt" placeholder="" showFormat
                             :editable=false readonly></h-date-picker>
            </h-form-item>
            <h-form-item prop="signEndDt" :label="$t('m.i.pl.signEndDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.signEndDt" placeholder="" showFormat
                             :editable=false :options="selectSignEndDt" readonly></h-date-picker>
            </h-form-item>
            <h-form-item prop="signFuncNo" :label="$t('m.i.pl.signFunc')" required>
              <h-select v-model="addOrEditForm.signFuncNo" placeholder="" :readonly="optType!='modify'" @on-change="signFuncNoChange" multiple>
                <h-option v-for="item in signFuncNoList" :value="item.key" :key="item.key" >{{ item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="isGroupCus" :label="$t('m.i.pl.isGroupCus')" required>
              <h-select v-model="addOrEditForm.isGroupCus" placeholder="" readonly @on-change="isGroupCusChange">
                <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="billBailAcctNo" :label="$t('m.i.pl.poolBillBailAcctNo')" :required="this.isContainInPool">
              <h-input v-model="addOrEditForm.billBailAcctNo" placeholder="" readonly :icon="optType!=='renew' ? 'android-search' : ''"
                       @on-click="queryBillBailAcctNo()"></h-input>
            </h-form-item>
            <h-form-item prop="poolBailSubAcctNo" :label="$t('m.i.pl.poolBailSubAcctNo')" v-if="isSubAcctWorks==='1'">
              <h-input v-model="addOrEditForm.poolBailSubAcctNo" placeholder="" readonly>
              </h-input>
            </h-form-item>
            <h-form-item prop="guarntrAgreementNo" :label="$t('m.i.pl.guarntrAgreementNo')">
              <h-input v-model="addOrEditForm.guarntrAgreementNo" placeholder="" :readonly="optType==='renew'" :maxlength="30"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pl.maxMoney')" prop="maxMoney" :required="isShowMaxMoney" v-if="isShowMaxMoney">
              <h-row>
                <h-col :span="spanLeft">
                  <h-typefield type="money" v-model="addOrEditForm.maxMoney" :maxlength="20"  :readonly="isShowSyncButton"
                               placeholder="数字，小数位最多2位" bigTips divided ></h-typefield>
                </h-col>
                <h-col :span="spanRight" offset="1" v-if="isShowSyncButton">
                  <h-button type="primary" @click="sysnCreditAmt()" >{{$t("m.i.common.synch")}}</h-button>
                </h-col>
              </h-row>
            </h-form-item>
            <h-form-item :label="$t('m.i.pl.authorizer')" prop="authorizer" >
              <h-input v-model="addOrEditForm.authorizer" :maxlength="125" :readonly="optType!='modify'"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pl.authorizerIdcard')" prop="authorizerIdcard" :validRules="idCardRule">
              <h-input v-model="addOrEditForm.authorizerIdcard" :maxlength="18" :readonly="optType!='modify'"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pl.secondAuthorizer')" prop="secondAuthorizer" >
              <h-input v-model="addOrEditForm.secondAuthorizer" :maxlength="125" :readonly="optType!='modify'"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pl.secondAuthorizerIdcard')" prop="secondAuthorizerIdcard" :validRules="idCardRule"
                         class="h-form-long-label">
              <h-input v-model="addOrEditForm.secondAuthorizerIdcard" :maxlength="18" :readonly="optType!='modify'"></h-input>
            </h-form-item>
            <h-form-item prop="saleOffMode" :label="$t('m.i.pl.saleOffMode')" required>
              <h-select v-model="addOrEditForm.saleOffMode" placeholder="" :readonly="optType==='renew'" @on-change="saleOffModeChange">
                <h-option v-for="item in saleOffModeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pl.discountPcet')" prop="discountPcet" :required="addOrEditForm.saleOffMode==='1' || addOrEditForm.saleOffMode===''"
                         v-if="addOrEditForm.saleOffMode==='1' || addOrEditForm.saleOffMode===''" :validRules="discountPcetRule">
              <h-typefield v-model="addOrEditForm.discountPcet" :readonly="optType==='renew'" :integerNum="3" :suffixNum="4" :bigTips="false"></h-typefield>
            </h-form-item>
            <h-form-item prop="isCollect" :label="$t('m.i.pl.isCollect')" :required="isShowCollect" v-if="isShowCollect">
              <h-select v-model="addOrEditForm.isCollect" placeholder="" :readonly="optType!='modify'">
                <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pl.bailPcet')" prop="bailPcet" :validRules="discountPcetRule">
              <h-typefield v-model="addOrEditForm.bailPcet" :readonly="optType==='renew'" :integerNum="3" :suffixNum="4" :bigTips="false"></h-typefield>
            </h-form-item>

            <h-form-item prop="custodyReturnAcctNo" :label="$t('m.i.pl.custodyReturnAcctNo')" :required="this.isContainSave" v-if="this.isContainSave">
              <h-input v-model="addOrEditForm.custodyReturnAcctNo"  readonly  placeholder=""
                       icon="android-search" @on-click="queryCustAcctNo()"></h-input>
            </h-form-item>

            <h-form-item :label="$t('m.i.ce.inCustManager')" prop="custMgrNo">
              <h-input v-if="type!=='view'" v-model="addOrEditForm.custMgrNo" :maxlength=60 readonly
                       icon="android-search" @on-click="showCusManager" clearable></h-input>
              <h-input v-else v-model="addOrEditForm.custMgrNo" :maxlength=60 readonly></h-input>
            </h-form-item>

            <h-form-item :label="$t('m.i.pl.fee')" prop="fee" required>
              <h-row>
                <h-typefield type="money" v-model="addOrEditForm.fee" :maxlength="20" :readonly="this.addOrEditForm.operType != '0'"
                             placeholder="数字，小数位最多2位" bigTips divided></h-typefield>
              </h-row>
            </h-form-item>
          </div>
          </div>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <!--冻结或解冻弹出窗-->
    <h-msg-box v-model="freezeWin" width="800" :mask-closable="false" @on-close="freezeWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>冻结/解冻</span>
      </p>
      <div>
        <h-form :model="freezeForm" :label-width="115" ref="freezeForm" cols="2" class="h-form-search">
          <h-form-item prop="freezedFuncNo" :label="$t('m.i.common.busiType')">
            <h-select v-model="freezeForm.freezedFuncNo" placeholder="" multiple showTitle>
              <h-option v-for="item in freezedFuncNoList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="freezeWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="freezeSubmitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitFreezeForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <!--查看企业客户-->
    <show-cust-corp :showCustCorpWin="showCustCorpWin" :title="'查询客户信息窗口'" @showCustCorpWinClose="showCustCorpWinClose"
                    @custSelect="custCorpSelect"></show-cust-corp>
    <!-- 查询客户结算账号 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.addOrEditForm.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--查询池保证金账户-->
    <show-cust-acct :showCustAcctWin="showCustAcctWin" :selectCustNo="addOrEditForm.custNo" :title="'查看保证金账户'"
                    :selectType="'select'" :custAcctKind="2" @showCustAcctWinClose="showCustAcctWinClose"
                    @custAcctSelect="custAcctSelect"></show-cust-acct>
    <!--查询票据池保证金账户-->
    <show-pool-acct :showPoolAcctWin="showPoolAcctWin" :selectCustNo="addOrEditForm.custNo" :title="'查看保证金账户'"
                    @showPoolAcctWinClose="showPoolAcctWinClose"
                    @poolAcctSelect="poolAcctSelect"></show-pool-acct>

    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="'选择客户经理'"
                       @showCustManagerWinClose="showCustManagerWinClose"
                       @custManagerSelect="custManagerSelect"></show-cust-manager>

    <percent-rule-info :percentRuleWin="percentRuleWin" :percentRuleParams="percentRuleParams"
                       @percentRuleWinClose="percentRuleWinClose"
                       @percentRuleSubmit="percentRuleSubmit"></percent-rule-info>
    <!--查看操作历史-->
    <agreement-Log :agreementLogWin="agreementLogWin" :logFormItem="logFormItem" :dictMap="dictMap"
                   :histListUrl = "'/pl/plsign/agreementLog/func_pagingagreementLog'"
                   @agreementLogWinClose="agreementLogWinClose"></agreement-Log>
  </div>
</template>

<script>
  import {accDiv, accMul, formatNumber, getSingleParamValuesByKeys, post} from "@/api/bizApi/commonUtil";


  export default {
    name: "billAgreementMain",
    data() {
      let columns = [
        {
          type: "radio",
          title: " ",
          key: "multiSelect",
          width: 60,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pl.agreementNo"),
          key: "agreementNo",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pl.signStartDt"),
          key: "signStartDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.signStartDt == null || params.row.signStartDt === "") {
              return "";
            }
            let date = this.$moment(params.row.signStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pl.signEndDt"),
          key: "signEndDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.signEndDt == null || params.row.signEndDt === "") {
              return "";
            }
            let date = this.$moment(params.row.signEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pl.signFunc"),
          key: "signFuncNo",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let _signFuncNo = params.row.signFuncNo.indexOf("!") >=0 ? params.row.signFuncNo.substring(0,params.row.signFuncNo.length-1) : params.row.signFuncNo;
            let dictValue = this.getDictValueFromMap(this.dictMap, "SignFuncNo", _signFuncNo);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pl.signCustNo"),
          key: "custNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pl.custSettleAcctNo"),
          key: "custAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.pl.poolBillBailAcctNo"),
          key: "billBailAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t('m.i.pl.poolBailSubAcctNo'),
          key: "poolBailSubAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.pl.authorizer"),
          key: "authorizer",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pl.secondAuthorizer"),
          key: "secondAuthorizer",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.pl.isGroupCus"),
          key: "isGroupCus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGroupCus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pl.saleOffMode"),
          key: "saleOffMode",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "SaleOffMode", params.row.saleOffMode);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pl.discountPcet"),
          key: "discountPcet",
          hiddenCol: false,
          render: (h, params) => {
            let discountPcet = params.row.discountPcet;
            if (discountPcet != null && discountPcet !== "" &&  discountPcet !== 0) {
              discountPcet = accMul(discountPcet, 100);
              return h("span", discountPcet);
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: this.$t("m.i.pl.maxMoney"),
          key: "maxMoney",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let maxMoney = formatNumber(params.row.maxMoney, 2, ",");
            return h("span", {
              domProps: {
                title: maxMoney
              }
            }, maxMoney);
          }
        },
        {
          title: this.$t("m.i.ce.fee"),
          key: 'fee',
          hiddenCol: false,
          render: (h, params) => {
            let fee = formatNumber(params.row.fee, 2, ',');
            return h("span", {
              domProps: {
                title: fee
              }
            }, fee);
          }
        },
        {
          title: this.$t("m.i.pl.isCollect"),
          key: "isCollect",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCollect);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.signStatus"),
          key: "signStatus",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "PoolSignStatus", params.row.signStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
      ];
      let _this = this;
      return {
        //受理结果,0-拒绝,1-同意
        isRefuse : null,
        isAcceptAllow : true,
        isEditAllow : true,
        isPauseAllow : true,
        isCancelAllow : true,
        isShowPercentRule: true,
        isShowOperResult:true,
        isSubAcctWorks:"",
        signStatusList : [],
        formItem : {
          agreementNo: "",
          signStatus:"PS01",
          custNo: "",
          custName: "",
          deleteFlag: "0",
          brchNo:JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          isJoin: "0",
          showPercentRule:false
        },
        columns : columns,
        cloneColumns : this.deepClone(columns),
        currentSelectRow : [],
        addOrEditWin : false,
        submitFlag : false,
        addOrEditForm : {
          id: "",
          legalNo: "",
          agreementNo: "",
          signStartDt: "",
          signEndDt: "",
          signFuncNo: [],
          custNo: "",
          custName: "",
          isGroupCus: "",
          isMainGroupCus:"",
          custAcctNo: "",
          custodyReturnAcctNo:"",
          custMgrNo:"",
          custMgrName:"",
          billBailAcctNo: "",
          guarntrAgreementNo: "",
          maxMoney: "",
          authorizer: "",
          authorizerIdcard: "",
          secondAuthorizer: "",
          secondAuthorizerIdcard: "",
          discountPcet: "",
          isCheckBeforeInPool: "",
          isCollect: "",
          saleOffMode: "",
          bailPcet: "",
          residual: "",
          poolBailSubAcctNo:"",
          fee:"",
          operType:"",
          operResult:"",
          operRemark:"",
          dataSource: "0"
        },
        ifShowMore : false,
        showCustCorpWin : false,
        showCustAcctNoWin : false,
        showCustAcctWin : false,
        showPoolAcctWin : false,
        signFuncNoList : [],
        saleOffModeList : [],
        YonList : [],
        freezedFuncNoList : [],
        dictMap : new Map(),
        //签约操作
        optType : "",
        //客户号弹框
        custType : "query",
        selectSignEndDt : {
          disabledDate(date) {
            let start = _this.$moment(_this.addOrEditForm.signStartDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0;
          }
        },
        idCardRule : [{ test: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, trigger: "blur", message: "身份证输入不合法" }],
        discountPcetRule : [{
          test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0000|0|0\.0000)$/,
          trigger: "blur",
          message: "比例为0~100，小数位不超过4位"
        }],
        residualRule : [{ test: /^[0-9]{0,6}$/, trigger: "blur", message: "只能输入数字" }],
        isContainInPool: false,
        isContainSave: false,
        //是否显示票据池限额
        isShowMaxMoney : true,
        isShowSyncButton : false,
        spanLeft : 24,
        spanRight : 0,
        //是否显示保证金归集
        isShowCollect : false,
        percentRuleWin : false,
        percentRuleParams : {},
        //记录是否为首次设置打折比例
        isFirst : true,
        freezeWin : false,
        freezeSubmitFlag : false,
        freezeForm : {
          id:"",
          freezedFuncNo: []
        },
        //查询操作历史弹出框
        agreementLogWin : false,
        showCustManagerWin: false,
        logFormItem:{
          agreeId:""
        }
      };

    },
    components: {
      PercentRuleInfo:() => import(/* webpackChunkName: "pl/plsign/percentRule/percentRuleInfo" */`@/views/bizViews/pl/plsign/percentRule/percentRuleInfo`),
      ShowCustAcct:() => import(/* webpackChunkName: "bm/cust/acct/showCustAcct" */`@/views/bizViews/bm/cust/acct/showCustAcct`),
      ShowCustCorp :() => import(/* webpackChunkName: "bm/cust/corp/showCustCorp" */`@/views/bizViews/bm/cust/corp/showCustCorp`),
      agreementLog:() => import(/* webpackChunkName: "pl/plsign/agreementLog" */`@/views/bizViews/pl/plsign/agreementLog`),
      showCustManager: () => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`),
    },
    methods: {
      operFlagChange(currentValue) {
        if (this.optType === "accept") {
          if (currentValue === "0") {//拒绝
            this.isRefuse = false;
            if (!this.isReAccept) {
              //初始化受理签约同意时展示项数据
             // this.initAcceptSignInfo();
            }
          } else if (currentValue === "1") {//同意
            this.isRefuse = true;
            this.addOrEditForm.acceptRemark = "";
          } else {
            this.isRefuse = null;
            this.addOrEditForm.acceptRemark = "";
            if (!this.isReAccept) {
              //this.initAcceptSignInfo();
            }
          }
        }
      },
      initBtn() {
        this.isAcceptAllow = true;
        this.isEditAllow = true;
        this.isPauseAllow = true;
        this.isCancelAllow = true;
        this.isShowPercentRule = true;
      },
      //查询客户信息
      queryCustNo(custType) {
        this.showCustCorpWin = true;
        this.custType = custType;
      },
      //赋值
      custCorpSelect(info) {
        this.showCustCorpWin = false;
        if (this.custType === "query") {
          this.formItem.custNo = info.custNo;
          this.formItem.custName = info.custName;
        } else if (this.custType === "add") {
          this.addOrEditForm.custNo = info.custNo;
          this.addOrEditForm.custName = info.custName;
          this.addOrEditForm.isGroupCus = info.isGroupCus;
          this.addOrEditForm.custAcctNo = "";
          this.addOrEditForm.billBailAcctNo = "";
        }
      },
      //关闭
      showCustCorpWinClose() {
        this.showCustCorpWin = false;
      },
      //查询客户结算账户
      queryCustAcctNo() {
        if (this.addOrEditForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.addOrEditForm.custodyReturnAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //查询池保证金账号
      queryBillBailAcctNo() {
        if (this.addOrEditForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showPoolAcctWin = true;
      },
      //根据客户保证金账号查询框所选数据进行赋值
      custAcctSelect(info) {
        this.addOrEditForm.billBailAcctNo = info.custAcctNo;
        this.addOrEditForm.poolBailSubAcctNo=info.subAcctSrlNo; //子账号
        this.showCustAcctWin = false;
      },
      //根据客户保证金账号查询框所选数据进行赋值
      poolAcctSelect(info) {
        this.addOrEditForm.billBailAcctNo = info.custAcctNo;
        this.addOrEditForm.poolBailSubAcctNo=info.subAcctSrlNo; //子账号
        this.showPoolAcctWin = false;
      },
      //客户保证金查询框关闭
      showCustAcctWinClose() {
        this.showCustAcctWin = false;
      },
      showPoolAcctWinClose() {
        this.showPoolAcctWin = false;
      },
      //未解约
      noDeleteButton() {
        this.formItem.deleteFlag = "0";
        this.formSearch();
      },
      //已解约
      hasDeleteButton() {
        this.formItem.deleteFlag = "1";
        this.formSearch();
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "add"){
          this.addOrEditForm.custName = "";
          this.addOrEditForm.custNo = "";
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.custNo = "";
        this.formItem.signEndDt = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
        /* PS01 签约待受理：修改、续约、解约、冻结或解冻、打折比例按钮显灰，受理、查看操作历史按钮正常显示
           PS05 签约审批通过待生效：受理、续约、解约、冻结或解冻、打折比例按钮显灰，修改、查看操作历史按钮正常显示
           PS07 签约已生效：受理按钮显灰，修改、续约、解约、冻结或解冻、打折比例（票据维度）查看操作历史按钮正常显示
          */
        if (currentRow.signStatus === "PS01") {
          this.isAcceptAllow = false;
          this.isEditAllow = true;
          this.isPauseAllow = true;
          this.isCancelAllow = true;
          this.isShowPercentRule = true
        } else if (currentRow.signStatus === "PS05") {
          this.isAcceptAllow = true;
          this.isEditAllow = false;
          this.isPauseAllow = true;
          this.isCancelAllow = true;
          this.isShowPercentRule = true
        } else if (currentRow.signStatus === "PS07") {
          this.isAcceptAllow = true;
          this.isEditAllow = false;
          this.isPauseAllow = false|| ( currentRow.signFuncNo.indexOf('2')<0 );
          this.isCancelAllow = false;
          this.isShowPercentRule = ( currentRow.saleOffMode == '1' ? true : false) || currentRow.signFuncNo.indexOf('2')<0;
        }
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      signFuncNoChange(currentValue) {
        //代保管
        if(currentValue.indexOf("1") > -1){
          this.isContainSave = true;
        }else{
          this.isContainSave = false;
        }
        //入池
        if (currentValue.indexOf("2") > -1) {
          this.isContainInPool = true;
        } else {
          this.isContainInPool = false;
        }

        if (this.isContainInPool) {
          this.isShowMaxMoney = true;
        } else {
          this.isShowMaxMoney = false;
          this.addOrEditForm.maxMoney = "";
        }
      },
      isGroupCusChange(currentValue) {
        if (currentValue === "1" && this.addOrEditForm.isMainGroupCus === "1") {//集团客户
          this.isShowCollect = true;
        } else {
          this.isShowCollect = false;
          this.addOrEditForm.isCollect = "";
        }
      },
      saleOffModeChange(currentValue) {
        if (currentValue !== "1") {
          this.addOrEditForm.discountPcet = "";
        }else{
          this.addOrEditForm.discountPcet = 100;
        }
      },

      operFlagChange(currentValue) {
        if (this.optType === "accept" || this.optType === "modify") {
          if (currentValue === "0") {//拒绝
            this.isRefuse = false;
          } else if (currentValue === "1") {//同意
            this.isRefuse = true;
            this.addOrEditForm.acceptRemark = "";
          } else {
            this.isRefuse = null;
            this.addOrEditForm.acceptRemark = "";
          }
        }
      },


      handleWinClose() {
        this.addOrEditWin = false;
        this.addFormReset();
      },

      agreementOperate(operateType) {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          post({ id: this.currentSelectRow.id }, "/pl/plsign/preAgreementMain/func_getPreAgreement").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addOrEditForm.id = res.data.retData.id;
                this.addOrEditForm.legalNo = res.data.retData.legalNo;
                this.addOrEditForm.agreementNo = res.data.retData.agreementNo;
                this.addOrEditForm.signStartDt = res.data.retData.signStartDt.toString();
                this.addOrEditForm.signEndDt = res.data.retData.signEndDt.toString();
                if (res.data.retData.signFuncNo === "" || res.data.retData.signFuncNo === null) {
                  this.addOrEditForm.signFuncNo = [];
                } else {
                  let _signFuncNo = res.data.retData.signFuncNo.indexOf("!") >=0 ? res.data.retData.signFuncNo.substring(0,res.data.retData.signFuncNo.length-1) : res.data.retData.signFuncNo;
                  this.addOrEditForm.signFuncNo = _signFuncNo.split(",");
                }
                this.addOrEditForm.custNo = res.data.retData.custNo;
                this.addOrEditForm.custName = res.data.retData.custName;
                this.addOrEditForm.isGroupCus = res.data.retData.isGroupCus;
                this.addOrEditForm.isMainGroupCus = res.data.retData.isMainGroupCus;
                this.addOrEditForm.custAcctNo = res.data.retData.custAcctNo;
                this.addOrEditForm.billBailAcctNo = res.data.retData.billBailAcctNo;
                this.addOrEditForm.poolBailSubAcctNo = res.data.retData.poolBailSubAcctNo;
                this.addOrEditForm.guarntrAgreementNo = res.data.retData.guarntrAgreementNo;
                this.addOrEditForm.maxMoney = res.data.retData.maxMoney;
                this.addOrEditForm.authorizer = res.data.retData.authorizer;
                this.addOrEditForm.authorizerIdcard = res.data.retData.authorizerIdcard;
                this.addOrEditForm.secondAuthorizer = res.data.retData.secondAuthorizer;
                this.addOrEditForm.secondAuthorizerIdcard = res.data.retData.secondAuthorizerIdcard;
                this.addOrEditForm.saleOffMode = res.data.retData.saleOffMode;
                this.addOrEditForm.discountPcet = accMul(res.data.retData.discountPcet, 100);
                this.addOrEditForm.isCheckBeforeInPool = res.data.retData.isCheckBeforeInPool;
                this.addOrEditForm.isCollect = res.data.retData.isCollect;
                this.addOrEditForm.bailPcet = accMul(res.data.retData.bailPcet, 100);
                this.addOrEditForm.custodyReturnAcctNo = res.data.retData.custodyReturnAcctNo;
                this.addOrEditForm.residual = res.data.retData.residual;
                this.addOrEditForm.fee = res.data.retData.fee;
                this.addOrEditForm.operType = res.data.retData.operType;
                this.addOrEditForm.custMgrNo = res.data.retData.custMgrNo;
                this.addOrEditForm.custMgrName = res.data.retData.custMgrName;
                //页面发起的修改，隐藏受理结果
                if (operateType == 'modify') {
                  //票据系统
                  this.addOrEditForm.dataSource ="1";
                  this.optType = "modify";
                  this.isShowOperResult = false;
                  this.addOrEditForm.operResult = '1';
                  this.addOrEditForm.operType = "1";
                  this.isRefuse = true;
                } else {
                  this.optType = "accept";
                }

                //签约功能选择
                this.signFuncNoChange(this.addOrEditForm.signFuncNo);
                //保证金归集
                this.isGroupCusChange(this.addOrEditForm.isGroupCus);
              } else {
                this.$msgTip.error(this,{info:res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });

        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.addOrEditWin = false;
          return;
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addOrEditForm.id = "";
        this.addOrEditForm.legalNo = "";
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.signFuncNo = [];
        this.isRefuse = null;
        this.isShowOperResult = true,
        this.addOrEditForm.acceptRemark = "";
        this.addOrEditForm.operResult = "";
      },
      submitForm() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            if (!!this.addOrEditForm.signStartDt) {
              this.addOrEditForm.signStartDt = this.addOrEditForm.signStartDt.replace(/-/g, "");
            }
            if (!!this.addOrEditForm.signEndDt) {
              this.addOrEditForm.signEndDt = this.addOrEditForm.signEndDt.replace(/-/g, "");
            }

            if (!!this.addOrEditForm.maxMoney) {
              this.addOrEditForm.maxMoney = this.addOrEditForm.maxMoney.toString().replace(/,/g, "");
            }

            if (!!this.addOrEditForm.discountPcet) {
              this.addOrEditForm.discountPcet = accDiv(this.addOrEditForm.discountPcet, 100);
            }
            if (!!this.addOrEditForm.bailPcet) {
              this.addOrEditForm.bailPcet = accDiv(this.addOrEditForm.bailPcet, 100);
            }
            this.submitFlag = true;
            let url = "/pl/plsign/preAgreementMain/";
            url = (this.optType === "modify" || this.addOrEditForm.operType === "1") ? url + "func_modifyAccept" : url + "func_acceptSign";
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.addFormReset();
                  let pageNo = this.optType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                } else {
                  if (!!this.addOrEditForm.discountPcet) {
                    this.addOrEditForm.discountPcet = accMul(this.addOrEditForm.discountPcet, 100);
                  }
                  if (!!this.addOrEditForm.bailPcet) {
                    this.addOrEditForm.bailPcet = accMul(this.addOrEditForm.bailPcet, 100);
                  }
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      cancelAgreement() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定解约该签约信息吗?",
            onOk: () => {
              this.handleCancel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleCancel() {
        post({ id: this.currentSelectRow.id }, "/pl/plsign/preAgreementMain/fun_cancelAgreement").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      freezeAgreement() {
        this.freezeForm.freezedFuncNoList = [];
        this.freezeForm.freezedFuncNo = [];
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (!!this.currentSelectRow.freezedFuncNo) {
            this.freezeForm.freezedFuncNoList = this.currentSelectRow.freezedFuncNo.split(",");
            this.freezeForm.freezedFuncNo = this.currentSelectRow.freezedFuncNo.split(",");
          }
          this.freezeForm.id = this.currentSelectRow.id;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.freezeWin = false;
          return;
        }
        this.freezeWin = true;
      },
      submitFreezeForm() {
        this.$refs["freezeForm"].validate(valid => {
          if (valid) {
            this.freezeSubmitFlag = true;
            post(this.freezeForm, "pl/plsign/preAgreementMain/func_freeze").then(res => {
              this.freezeSubmitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.freezeWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
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
      freezeWinClose() {
        this.freezeWin = false;
        this.$refs.freezeForm.resetFields();
      },
      percentRule() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$nextTick(() => {
            this.getIsFirst();
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      getIsFirst() {
        post({agreeId:  this.currentSelectRow.id, agreementNo: this.currentSelectRow.agreementNo}, "/pl/plsign/percentRules/pagingQueryPercentRules").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let data = res.data.retData.list;
              if (data.length === 0) {
                this.isFirst = true;
                this.percentRuleParams.isFirst = this.isFirst;
                this.percentRuleParams.agreeId = this.currentSelectRow.id;
                this.percentRuleParams.agreementNo = this.currentSelectRow.agreementNo;
                this.percentRuleParams.saleOffMode = this.currentSelectRow.saleOffMode;
                this.percentRuleParams.custNo = this.currentSelectRow.custNo;
                this.percentRuleParams.dictMap = this.dictMap;
                this.percentRuleParams.YonList = this.YonList;
                this.percentRuleWin = true;
              }else {
                this.isFirst = false;
                this.percentRuleParams.isFirst = this.isFirst;
                this.percentRuleParams.agreeId = this.currentSelectRow.id;
                this.percentRuleParams.agreementNo = this.currentSelectRow.agreementNo;
                this.percentRuleParams.saleOffMode = this.currentSelectRow.saleOffMode;
                this.percentRuleParams.custNo = this.currentSelectRow.custNo;
                this.percentRuleParams.dictMap = this.dictMap;
                this.percentRuleParams.YonList = this.YonList;
                this.percentRuleWin = true;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      percentRuleSubmit(submitPercentRuleMap, isRecalculate,custNo) {
        let params = {};
        let url = {};
        if (!!isRecalculate) {
          params.isRecalculate = isRecalculate;
          params.custNo = custNo;
        }
        if (this.isFirst) {
          url = "/pl/plsign/billAgreementMain/func_addPercentRule";
        }else {
          url = "/pl/plsign/billAgreementMain/func_updatePercentRule";
        }
        let percentRuleArr = [];
        submitPercentRuleMap.forEach((value, key) => {
          value.agreeId = this.currentSelectRow.id;
          value.agreementNo = this.currentSelectRow.agreementNo;
          value.id = key;
          if (!!value.discountPcet) {
            value.discountPcet = accDiv(value.discountPcet, 100);
          }
          percentRuleArr.push(value);
        });
        params.list = percentRuleArr;
        this.submitFlag = true;
        post(params, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.percentRuleWinClose();
              let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
              this.$refs.datagrid.dataChange(pageNo);
              this.isFirst = false;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      percentRuleWinClose() {
        this.percentRuleWin = false;
        this.percentRuleParams = {};
      },
      //查询业务参数
      queryBusiParamValue() {
        post({paramKey: "" }, "/pl/plsign/billAgreementMain/fun_getIsSyncCreditLimitParam").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isSyncCreditAmt = res.data.retData;
              if (isSyncCreditAmt === "1") {
                this.spanLeft = 17;
                this.spanRight = 5;
                this.isShowSyncButton = true;
              } else {
                this.spanLeft = 24;
                this.spanRight = 0;
                this.isShowSyncButton = false;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      sysnCreditAmt(){
        if (this.addOrEditForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        //查询业务参数
        post({code: this.addOrEditForm.custNo }, "/pl/plsign/billAgreementMain/fun_syncLimitAmt").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addOrEditForm.maxMoney = res.data.retData.maxMoney;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      getParams(){
        if (this.$route.path === "/pl/plsign/billAgreementMain") {
          if (this.$route.query.signEndDt) {
            this.formItem.signEndDt = this.$moment(this.$route.query.signEndDt, "YYYY-MM-DD").format("YYYYMMDD");
            this.$nextTick(() => {
              this.formSearch();
            });
          }
        }
      },

      queryOperateLog() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.agreementLogWin = true;
          this.logFormItem.agreeId = this.currentSelectRow.id;
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },

      agreementLogWinClose() {
        this.agreementLogWin = false;
        this.logFormItem = {};
      },
      // 展示客户经理选择界面
      showCusManager() {
        this.showCustManagerWin = true;
      },
      // 选择客户经理界面关闭
      showCustManagerWinClose() {
        this.showCustManagerWin = false;
      },
      // 选择客户经理
      custManagerSelect(info) {
        this.addOrEditForm.custMgrNo = info.custMgrNo;
        this.addOrEditForm.custMgrName = info.custMgrName;
        this.showCustManagerWin = false;
      },
    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      this.getDictListByGroups("SignFuncNo,SaleOffMode,Yon,FreezedFuncNo,CDMedia,DraftTypeCode,bankLevel,CorpScale,ModeType,PoolSignStatus,SignLogOperType,bankType").then(res => {
        this.signStatusList = res.get("PoolSignStatus");
        this.signStatusList = this.signStatusList.filter(item => item.key === "PS01" || item.key === "PS07");
        this.signFuncNoList = res.get("SignFuncNo");
        this.saleOffModeList = res.get("SaleOffMode");
        this.YonList = res.get("Yon");
        this.freezedFuncNoList = res.get("FreezedFuncNo");
        this.dictMap = res.get("map");
      });
      this.getParams();
      this.queryBusiParamValue();
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works").then(res => {
        this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
        if (this.isSubAcctWorks==='0'){
          this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo",true);  //不显示保证金子账号
        }
      });
    }
  };
</script>

<style scoped>

</style>
