<!--票据池签约管理-签约管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo">
                  <h-input v-model="formItem.agreementNo" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo('query')" clearable @on-clear="clearVal('query')"
                           readonly></h-input>
                </h-form-item>
                <show-branch v-model="formItem.signBrchNameList" :label="$t('m.i.ce.signBrchName')" prop="signBrchNameList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.signBrchNoList" :brchName.sync="formItem.signBrchNameList"></show-branch>
                <h-form-item :label="$t('m.i.ce.signStatus')" prop="signStatus">
                  <h-select v-model="formItem.signStatus" placeholder="" showTitle>
                    <h-option v-for="item in signStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="isCommit" :label="$t('m.i.pl.deleteFlag')">
                  <h-radio-group v-model="formItem.deleteFlag">
                    <h-radio label="0" @on-click="noDeleteButton">
                      <span>未解约</span>
                    </h-radio>
                    <h-radio label="1" @on-click="hasDeleteButton">
                      <span>已解约</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
            url="/pl/plsign/billAgreementMain/func_pagingBillAgreement"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="agreementOperate('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="agreementOperate('modify')" :disabled="formItem.deleteFlag === '1' || isActiveModify === false">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="agreementOperate('renew')" :disabled="formItem.deleteFlag === '1' || isActiveModify === false">
                {{$t("m.i.pl.continue")}}
              </h-button>
              <h-button type="primary" @click="cancelAgreement" :disabled="formItem.deleteFlag === '1'">{{$t("m.i.pl.incontinue")}}
              </h-button>
              <h-button type="primary" @click="freezeAgreement" :disabled="formItem.deleteFlag === '1' || isActive === false">{{$t("m.i.pl.freez")}}
              </h-button>
              <h-button type="primary" @click="percentRule" :disabled="formItem.deleteFlag === '1' || formItem.showPercentRule">{{$t("m.i.pl.setDis")}}
              </h-button>
              <h-button type="primary" @click="ebankQuery" :disabled="formItem.deleteFlag === '1' || isEbankQuery === false">{{$t("m.i.pl.ebankQuery")}}</h-button>
              <h-button type="primary" @click="ebankCancel" :disabled="formItem.deleteFlag === '1' || isEbankCancel === false">{{$t("m.i.pl.ebankCancel")}}</h-button>
              <h-button type="primary" @click="confirm" :disabled="formItem.deleteFlag === '1' || isEbankConfirm === false">{{$t("m.i.pl.confirm")}}</h-button>
              <h-button type="primary" @click="transplantConfirm" :disabled="formItem.deleteFlag === '1' || isTransplantquery === false">{{$t("m.i.pl.confirmBq")}}</h-button>
              <h-button type="primary" @click="confirm" :disabled="formItem.deleteFlag === '1' || isXsEbankConfirm === false">{{$t("m.i.pl.transConfirmOk")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击签约弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="optType==='add'">新增签约</span>
        <span v-if="optType==='modify'">修改签约</span>
        <span v-if="optType==='renew'">续约</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo" required v-if="optType!=='add'"
                       key="agreementNo">
            <h-input v-model="addOrEditForm.agreementNo" :maxlength="60" readonly></h-input>
          </h-form-item>
          <h-form-item prop="signStartDt" :label="$t('m.i.pl.signStartDt')" required>
            <h-date-picker type="date" v-model="addOrEditForm.signStartDt" placeholder="" showFormat
                           :editable=false :options="selectSignStartDt" :readonly="optType!=='add'"></h-date-picker>
          </h-form-item>
          <h-form-item prop="signEndDt" :label="$t('m.i.pl.signEndDt')" required>
            <h-date-picker type="date" v-model="addOrEditForm.signEndDt" placeholder="" showFormat
                           :editable=false :options="selectSignEndDt" :readonly="optType !== 'renew'"></h-date-picker>
          </h-form-item>
          <h-form-item prop="signFuncNo" :label="$t('m.i.pl.signFunc')" required key="signFuncNo">
            <h-select v-model="addOrEditForm.signFuncNo" placeholder="" :readonly="optType==='renew'"
                      @on-change="signFuncNoChange" multiple disabled="">
              <h-option v-for="item in signFuncNoList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
            <h-input v-model="addOrEditForm.custNo" placeholder="" :icon="optType==='add' ? 'android-search' : ''"
                     @on-click="queryCustNo('add')" :clearable="optType==='add'" @on-clear="clearVal('add')"
                     readonly></h-input>
          </h-form-item>
          <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
            <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="isGroupCus" :label="$t('m.i.pl.isGroupCus')" required>
            <h-select v-model="addOrEditForm.isGroupCus" placeholder="" readonly @on-change="isGroupCusChange">
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="custAcctNo" :label="$t('m.i.pl.custSettleAcctNo')" required>
            <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly
                     :icon="optType==='add'||optType==='modify' ? 'android-search' : ''"
                     @on-click="queryCustAcctNo()"></h-input>
          </h-form-item>
          <h-form-item prop="billBailAcctNo" :label="$t('m.i.pl.poolBillBailAcctNo')" :required="this.isContainInPool">
            <h-input v-model="addOrEditForm.billBailAcctNo" placeholder="" readonly
                     :icon="optType!=='renew' ? 'android-search' : ''"
                     @on-click="queryBillBailAcctNo()"></h-input>
          </h-form-item>
          <h-form-item prop="poolBailSubAcctNo" :label="$t('m.i.pl.poolBailSubAcctNo')" v-if="isSubAcctWorks==='1'"
                       key="poolBailSubAcctNo">
            <h-input v-model="addOrEditForm.poolBailSubAcctNo" placeholder="" readonly>
            </h-input>
          </h-form-item>
          <h-form-item prop="guarntrAgreementNo" :label="$t('m.i.pl.guarntrAgreementNo')">
            <h-input v-model="addOrEditForm.guarntrAgreementNo" placeholder="" :readonly="optType==='renew'"
                     :maxlength="30"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.maxMoney')" prop="maxMoney" required="true" v-if="isShowMaxMoney"
                       key="maxMoney" :validRules="agreementMoneyRule" v-show="false">
            <h-row>
              <h-col :span="spanLeft">
                <h-typefield type="money" v-model="addOrEditForm.maxMoney" :maxlength="20" readonly="true"
                             placeholder="数字，小数位最多2位" bigTips divided></h-typefield>
              </h-col>
              <h-col :span="spanRight" offset="1" v-if="isShowSyncButton">
                <h-button type="primary" @click="sysnCreditAmt()" :disabled="optType==='renew'">
                  {{ $t("m.i.common.synch") }}
                </h-button>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.authorizer')" prop="authorizer" required>
            <h-input v-model="addOrEditForm.authorizer" :maxlength="125" :readonly="optType==='renew'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.authorizerIdcard')" prop="authorizerIdcard" :validRules="idCardRule">
            <h-input v-model="addOrEditForm.authorizerIdcard" :maxlength="18" :readonly="optType==='renew'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.secondAuthorizer')" prop="secondAuthorizer">
            <h-input v-model="addOrEditForm.secondAuthorizer" :maxlength="125" :readonly="optType==='renew'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.secondAuthorizerIdcard')" prop="secondAuthorizerIdcard"
                       :validRules="idCardRule"
                       class="h-form-long-label">
            <h-input v-model="addOrEditForm.secondAuthorizerIdcard" :maxlength="18"
                     :readonly="optType==='renew'"></h-input>
          </h-form-item>
          <h-form-item prop="saleOffMode" :label="$t('m.i.pl.saleOffMode')" required>
            <h-select v-model="addOrEditForm.saleOffMode" placeholder="" :readonly="optType==='renew'"
                      @on-change="saleOffModeChange" >
              <h-option v-for="item in saleOffModeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.discountPcet')" prop="discountPcet"
                       :required="addOrEditForm.saleOffMode==='1' || addOrEditForm.saleOffMode===''"
                       v-if="addOrEditForm.saleOffMode==='1' || addOrEditForm.saleOffMode===''"
                       :validRules="discountPcetRule" key="discountPcet">
            <h-typefield v-model="addOrEditForm.discountPcet" placeholder="" :readonly="optType==='renew'"
                         :integerNum="3" :suffixNum="2" nonNegative></h-typefield>
          </h-form-item>
          <h-form-item prop="isCheckBeforeInPool" :label="$t('m.i.pl.isCheckBeforeInPool')" required>
            <h-select v-model="addOrEditForm.isCheckBeforeInPool" placeholder="" :readonly="optType==='renew'">
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isCollect" :label="$t('m.i.pl.isCollect')" :required="isShowCollect" v-if="isShowCollect"
                       key="isCollect">
            <h-select v-model="addOrEditForm.isCollect" placeholder="" :readonly="optType==='renew'" disabled="">
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.bailPcet')" prop="bailPcet" :validRules="discountPcetRule">
            <h-typefield v-model="addOrEditForm.bailPcet" placeholder="" :readonly="'true'" :integerNum="3"
                         :suffixNum="2" nonNegative></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.residual')" prop="residual" :validRules="residualRule" v-show="false">
            <h-input v-model="addOrEditForm.residual" :maxlength="6" :readonly="optType==='renew'"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{ $t("m.i.common.commit") }}</h-button>

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
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" :custAcctKind="1"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--查询池保证金账户-->
    <show-cust-acct :showCustAcctWin="showCustAcctWin" :selectCustNo="addOrEditForm.custNo" :title="'查看保证金账户'"
                    :selectType="'select'" :custAcctKind="2" @showCustAcctWinClose="showCustAcctWinClose"
                    @custAcctSelect="custAcctSelect"></show-cust-acct>
    <percent-rule-info :percentRuleWin="percentRuleWin" :percentRuleParams="percentRuleParams"
                       @percentRuleWinClose="percentRuleWinClose"
                       @percentRuleSubmit="percentRuleSubmit"></percent-rule-info>
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
          title: this.$t("m.i.common.brchName"),
          key: "brchName",
          ellipsis: false,
          hiddenCol: false,
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
         title: this.$t("m.i.pl.deleteFlag"),
          key: "deleteFlag",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let deleteFlag = params.row.deleteFlag;
            switch (params.row.deleteFlag) {
              case "0":
                deleteFlag = "未解约";
                break;
              case "1":
                deleteFlag = "已解约";
                break;
            }
            return h("span", deleteFlag);
          }
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
            if (discountPcet != null && discountPcet !== "" && discountPcet !== 0) {
              discountPcet = formatNumber(accMul(discountPcet, 100), 2, ",");
              return h("span", discountPcet);
            } else {
              return h("span", "");
            }
          }
        },
        {
         title: this.$t("m.i.pl.isCheckBeforeInPool"),
          key: "isCheckBeforeInPool",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCheckBeforeInPool);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
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
          title: this.$t("m.i.ce.signBrchName"),
          key: "signBrchName",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.signStatus"),
          key: "reserve2",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "PoolCtrctSignStatus", params.row.reserve2);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pl.signPdfAddr"),
          key: "reserve3",
          hiddenCol: false,
          render: (h, params) => {
            return h("div", [
              h("a", {
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.showPdf(params.row.reserve3,params.row.reserve2);
                  }
                }
              }, "下载")
            ]);
          }
        },
      ];
      let _this = this;
      return {
        isSubAcctWorks:"",
        agreementMoneyRule : [{ test: validAgreementMoney, trigger: "blur,change"}],
        formItem : {
          signBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          signBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          signStatus:"",
          agreementNo: "",
          custNo: "",
          custName: "",
          deleteFlag: "0",
          isJoin: "0",
          showPercentRule:false
        },
        signStatusList : [],
        columns : columns,
        cloneColumns : this.deepClone(columns),
        currentSelectRow : [],
        addOrEditWin : false,
        submitFlag : false,
        isEbankQuery:true,
        isTransplantquery : true,
        isEbankCancel:true,
        isEbankConfirm:true,
        isXsEbankConfirm : true,
        isActive:true,
        isActiveModify:true,
        addOrEditForm : {
          id: "",
          legalNo: "",
          agreementNo: "",
          signStartDt: "",
          signEndDt: "20991231",
          signFuncNo: ["2"],
          custNo: "",
          custName: "",
          isGroupCus: "0",
          custAcctNo: "",
          billBailAcctNo: "",
          guarntrAgreementNo: "",
          maxMoney: "9999999999999.99",
          authorizer: "",
          authorizerIdcard: "",
          secondAuthorizer: "",
          secondAuthorizerIdcard: "",
          discountPcet: "",
          isCheckBeforeInPool: "",
          isCollect: "0",
          saleOffMode: "1",
          bailPcet: "0",
          residual: "",
          poolBailSubAcctNo: ""
        },
        ifShowMore : false,
        showCustCorpWin : false,
        showCustAcctNoWin : false,
        showCustAcctWin : false,
        signFuncNoList : [],
        saleOffModeList : [],
        YonList : [],
        freezedFuncNoList : [],
        dictMap : new Map(),
        //签约操作
        optType : "",
        //客户号弹框
        custType : "query",
        selectSignStartDt : {
          disabledDate(date) {
            let end = _this.$moment(_this.addOrEditForm.signEndDt).format("YYYY/MM/DD");
            let start = date.valueOf() - new Date(end).getTime();
            return start >= 0 ;
          }
        },
        selectSignEndDt : {
          disabledDate(date) {
            let start = _this.$moment(_this.addOrEditForm.signStartDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0;
          }
        },
        idCardRule : [{ test: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, trigger: "blur", message: "身份证输入不合法" }],
        discountPcetRule : [{
          test: /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100\.0|100\.00)$/,
          trigger: "blur",
          message: "比例为0~100，小数位不超过2位"
        }],
        residualRule : [{ test: /^[0-9]{0,6}$/, trigger: "blur", message: "只能输入数字" }],
        //是否显示票据池限额
        isShowMaxMoney : true,
        isContainInPool: false,
        isShowSyncButton : false,
        spanLeft : 24,
        spanRight : 0,
        //是否显示保证金归集
        isShowCollect : true,
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
        isModifyFirst: false
      };
      function validAgreementMoney(rule, val, callback) {
        debugger;
        let value = val.toString().replace(/,/g, "");
        if(value >= 0) {
          callback();
        } else {
          callback(new Error("票据池限额不能为负数"));
        }
      }
    },
    components: {
      PercentRuleInfo:() => import(/* webpackChunkName: "pl/plsign/percentRule/percentRuleInfo" */`@/views/bizViews/pl/plsign/percentRule/percentRuleInfo`),
      ShowCustAcct:() => import(/* webpackChunkName: "bm/cust/acct/showCustAcct" */`@/views/bizViews/bm/cust/acct/showCustAcct`),
      ShowCustCorp :() => import(/* webpackChunkName: "bm/cust/corp/showCustCorp" */`@/views/bizViews/bm/cust/corp/showCustCorp`)
    },
    methods: {
      showPdf(reserve3,reserve2){
        if (reserve2 === "PS02" || reserve2 === "PS03"){
          this.$msgTip.info(this, { info: "当前状态不允许下载签约协议" });
          return;
        }
        if (reserve3 === null || reserve3 === ""){
          this.$msgTip.info(this, { info: "未获取到签约协议影像id" });
          return;
        }
        let url = window.LOCAL_CONFIG.API_HOME + "/banks/szbank/pl/plsign/billAgreementMain/func_downloadPdf";
        //表单提交
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        let input1 = document.createElement("input");
        input1.type = "text";
        input1.name = "imgAttachNo";
        input1.value = reserve3;
        form.appendChild(input1);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
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
        this.addOrEditForm.custAcctNo = info.custAcctNo;
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
        this.showCustAcctWin = true;
      },
      //根据客户保证金账号查询框所选数据进行赋值
      custAcctSelect(info) {
        this.addOrEditForm.billBailAcctNo = info.custAcctNo;
        this.addOrEditForm.poolBailSubAcctNo=info.subAcctSrlNo; //子账号
        this.showCustAcctWin = false;
      },
      //客户保证金查询框关闭
      showCustAcctWinClose() {
        this.showCustAcctWin = false;
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
        if(optType === "query"){
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
        this.isEbankQuery = true;
        this.isTransplantquery = true;
        this.isEbankCancel = true;
        this.isEbankConfirm = true;
        this.isXsEbankConfirm = true;
        this.isActive = true;
        this.isActiveModify = true;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.custNo = "";
        this.formItem.signEndDt = "";
        this.$refs.formItem.resetFields();
        this.formItem.deleteFlag = "0";
        this.formItem.signStatus = "";
        this.formItem.signBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.signBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formSearch();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
        this.isEbankQuery = true;
        this.isTransplantquery = true;
        this.isEbankCancel = true;
        this.isEbankConfirm = true;
        this.isXsEbankConfirm = true;
        this.isActive = true;
        this.isActiveModify = true;
        if (currentRow != null && currentRow.length !== 0) {
          this.formItem.showPercentRule = (currentRow.saleOffMode == '1' ? true : false);
        }

        if (this.currentSelectRow.reserve2 !== "PS02"|| (this.currentSelectRow.reserve2 === "PS02" && this.currentSelectRow.transplantFlag  !== null && this.currentSelectRow.transplantFlag !=="")) {

          this.isEbankQuery = false;
        }
        if (this.currentSelectRow.reserve2 !== "PS03") {
          this.isEbankCancel = false;
        }
        if (this.currentSelectRow.reserve2 !== "PS04"||(this.currentSelectRow.reserve2 === "PS04" && this.currentSelectRow.transplantFlag  !== null && this.currentSelectRow.transplantFlag !=="")) {
          this.isEbankConfirm = false;
        }
        if (this.currentSelectRow.reserve2 !== "PS01" && this.currentSelectRow.reserve2 !== "PS05") {
          this.isActive = false;
        }
        if (this.currentSelectRow.reserve2 !== "PS01" && this.currentSelectRow.reserve2 !== "PS02") {
          this.isActiveModify = false;
        }
        if (this.currentSelectRow.transplantFlag !== "DM1agreement") {
          this.isTransplantquery = false;
        }
        if ( this.currentSelectRow.transplantFlag !== "DM1agreementPS04") {
          this.isXsEbankConfirm = false;
        }

      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
        this.isEbankQuery = true;
        this.isTransplantquery = true;
        this.isEbankCancel = true;
        this.isEbankConfirm = true;
        this.isXsEbankConfirm = true;

        this.isActive = true;
        this.isActiveModify = true;
        this.formItem.showPercentRule = false;
      },
      signFuncNoChange(currentValue) {
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
        if (currentValue === "0") {//非集团客户
          this.isShowCollect = false;
          this.addOrEditForm.isCollect = "";
        } else if (currentValue === "1") {//集团客户
          this.isShowCollect = true;
        } else {
          this.isShowCollect = true;
          this.addOrEditForm.isCollect = "";
        }
      },
      saleOffModeChange(currentValue) {
        if (currentValue !== "1") {
          this.addOrEditForm.discountPcet = "";
        }else{
          if (this.isModifyFirst) {
            this.isModifyFirst = false;
          } else {
            this.addOrEditForm.discountPcet = 100;
          }
        }
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addFormReset();
      },
      agreementOperate(optType) {
        this.optType = optType;
        if (optType === "add") {
          this.$nextTick(() => {
            this.addFormReset();
          });
          this.isShowMaxMoney = true;
          this.isShowCollect = true;
        } else {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.isModifyFirst = true;
            if (this.optType === "modify" || this.optType === "renew") {
              if (this.checkBrchNo(this.currentSelectRow.brchNo)) {
                return;
              }
            }
            post({ id: this.currentSelectRow.id }, "/pl/plsign/billAgreementMain/func_queryBillAgreement").then(res => {
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
                  this.addOrEditForm.residual = res.data.retData.residual;
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
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addOrEditForm.id = "";
        this.addOrEditForm.legalNo = "";
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.signFuncNo = ["2"];
      },
      submitForm() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.signStartDt = this.addOrEditForm.signStartDt.replace(/-/g, "");
            this.addOrEditForm.signEndDt = this.addOrEditForm.signEndDt.replace(/-/g, "");
            this.addOrEditForm.maxMoney = this.addOrEditForm.maxMoney.toString().replace(/,/g, "");
            let discountPcet = "";
            let bailPcet = "";
            if (!!this.addOrEditForm.discountPcet) {
              discountPcet = accDiv(this.addOrEditForm.discountPcet, 100);
            }
            if (!!this.addOrEditForm.bailPcet) {
              bailPcet = accDiv(this.addOrEditForm.bailPcet, 100);
            }
            let params = Object.assign({}, this.addOrEditForm, {discountPcet: discountPcet, bailPcet: bailPcet})
            this.submitFlag = true;
            let url = "/pl/plsign/billAgreementMain/";
            url = this.optType === "add" ? url + "func_addAgreement" : this.optType === "modify" ? url + "func_updateSignInfo" : url + "func_renewAgreement";
            post(params, url).then(res => {
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
          if (this.checkBrchNo(this.currentSelectRow.brchNo)) {
            return;
          }
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
        post({ id: this.currentSelectRow.id }, "/pl/plsign/billAgreementMain/fun_cancelAgreement").then(res => {
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
          if (this.checkBrchNo(this.currentSelectRow.brchNo)) {
            return;
          }
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
            post(this.freezeForm, "pl/plsign/billAgreementMain/func_freeze").then(res => {
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
      ebankQuery(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定提交吗?",
            onOk: () => {
              this.handleEbankQuery();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },
      handleEbankQuery(){
        post({ id: this.currentSelectRow.id }, "/banks/szbank/pl/plsign/billAgreementMain/func_ebankQuery").then(res => {
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
      ebankCancel(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定撤回吗?",
            onOk: () => {
              this.handleEbankCancel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },
      handleEbankCancel(){
        post({ id: this.currentSelectRow.id }, "/banks/szbank/pl/plsign/billAgreementMain/func_ebankCancel").then(res => {
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
      confirm(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定提交吗?",
            onOk: () => {
              this.handleEbankConfirm();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },
      transplantQyConfirmFrist(){
              post({ id: this.currentSelectRow.id }, "/banks/szbank/pl/plsign/billAgreementMain/func_transplantFrist").then(res => {
                        if (res) {
                          let retCode = res.data.retCode;
                          if (retCode === "000000") {
                             this.$msgTip.success(this);
                             this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                             this.currentSelectRow = [];
                             this.$msgTip.info(this, { info: res.data.retMsg });
                          } else {
                            this.$msgTip.error(this, { info: res.data.retMsg });
                          }
                        } else {
                          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                        }
                      });
            },
      transplantConfirmFrist(){
                   if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
                        this.$hMsgBox.confirm({
                          title: this.$t("m.i.common.confirm"),
                          content: "是否确认发起票据池协议线上补签?",
                          onOk: () => {
                            this.transplantQyConfirmFrist();
                          }
                        });
                      } else {
                        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
                        return;
                    }
                  },
      transplantQyConfirm(){
              post({ id: this.currentSelectRow.id }, "/banks/szbank/pl/plsign/billAgreementMain/func_transplant").then(res => {
                        if (res) {
                          let retCode = res.data.retCode;
                          if (retCode === "000000") {
                            this.transplantConfirmFrist();
                          } else {
                            this.$msgTip.error(this, { info: res.data.retMsg });
                          }
                        } else {
                          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                        }
                      });
            },


      transplantConfirm(){
       if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: "确定提交吗?",
              onOk: () => {
                this.transplantQyConfirm();
              }
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
        }
      },


      handleEbankConfirm(){
        post({ id: this.currentSelectRow.id }, "/banks/szbank/pl/plsign/billAgreementMain/func_ebankConfirm").then(res => {
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
      percentRule() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (this.checkBrchNo(this.currentSelectRow.brchNo)) {
            return;
          }
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
      checkBrchNo(brchNo){
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        if (userInfo.brchNo !== brchNo) {
          this.$msgTip.info(this, {info: "只有签约机构才能进行此操作"});
          return true;
        }
      }
    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      this.getDictListByGroups("SignFuncNo,SaleOffMode,Yon,FreezedFuncNo,CDMedia,PoolCtrctSignStatus,DraftTypeCode,bankLevel,bankType,CorpScale,ModeType").then(res => {
        this.signFuncNoList = res.get("SignFuncNo");
        this.signStatusList = res.get("PoolCtrctSignStatus");
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
