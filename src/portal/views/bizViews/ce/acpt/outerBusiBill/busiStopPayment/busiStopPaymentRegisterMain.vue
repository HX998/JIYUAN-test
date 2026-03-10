<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="sspdStatus" :label="$t('m.i.ce.sspdStatus')">
                  <h-select v-model="formItem.sspdStatus" placeholder="" @on-change="sspdStatusChange" showTitle>
                    <h-option value="0" key="0">{{$t('m.i.ce.noStopPay')}}</h-option>
                    <h-option value="3" key="3">{{$t('m.i.ce.hasStopPay')}}</h-option>
                    <h-option value="6" key="6">{{$t('m.i.ce.hasRelievePay')}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="sspdType" :label="$t('m.i.billInfo.sspdType')" v-if="formItem.sspdStatus === '3' || formItem.sspdStatus === '2'">
                  <h-select v-model="formItem.sspdType" placeholder="" :readonly="formItem.sspdType==='modify'" showTitle>
                    <h-option v-for="item in this.sspdTypeList" :value="item.key" :key="item.key" >{{ item.value
                      }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="sspdDt" :label="$t('m.i.billInfo.sspdDt')" v-if="formItem.sspdStatus === '3' || formItem.sspdStatus === '2'">
                  <h-date-picker type="date" v-model="formItem.sspdDt" placeholder="" @on-change="handleDateChange"
                                 showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="relieveType" :label="$t('m.i.billInfo.relieveType')" v-if="formItem.sspdStatus === '6' || formItem.sspdStatus === '5'">
                  <h-select v-model="formItem.relieveType" placeholder="" :readonly="formItem.relieveType==='modify'" showTitle>
                    <h-option v-for="item in this.relieveTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="relieveDt" :label="$t('m.i.billInfo.relieveDt')" v-if="formItem.sspdStatus === '6' || formItem.sspdStatus === '5'">
                  <h-date-picker type="date" v-model="formItem.relieveDt" placeholder="" @on-change="handleRelieveDateChange"
                                 showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_pagingQueryCorpSspdList"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <!--<h-button type="primary" @click="uploadImage" v-if="uploadIsShow">影像上传</h-button>-->
              <h-button type="primary" @click="stopPayment()" :disabled="handleSspdStatus">止付</h-button>
              <h-button type="primary" @click="cancelStopPayment()" :disabled="cancelHandleSspdStatus">解除止付</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

        <!-- 止付信息登记界面 -->
        <h-msg-box v-model="stopPaymentRegisterWin" width="800" @on-close="stopPaymentRegisterWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false" :zIndex="999">
          <p slot="header">
            <span>止付信息登记</span>
          </p>
          <div>
            <h-form :model="stopPaymentRegisterForm" :label-width="130" ref="stopPaymentRegisterForm" cols="2" class="h-form-search" onlyBlurRequire>
              <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
                <h-input v-model="stopPaymentRegisterForm.billNo" placeholder="" readonly :maxlength="30"></h-input>
              </h-form-item>
              <h-form-item prop="sspdType" :label="$t('m.i.billInfo.sspdType')" required>
                <h-select v-model="stopPaymentRegisterForm.sspdType" placeholder="" @on-change="secondIsRequiredOnChange()" showTitle>
                  <h-option value="ST01" v-show="ST01Show">挂失止付</h-option>
                  <h-option value="ST02" v-show="ST02Show">公示催告</h-option>
                  <h-option value="ST03" v-show="ST03Show">司法冻结</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="isInnerAcct" :label="$t('m.i.ce.isInnerAcct')" required>
                <h-select v-model="stopPaymentRegisterForm.isInnerAcct" placeholder="" @on-change="isInnerAcctOnChange('sspd')" showTitle>
                  <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="sspdAcctNo" :label="$t('m.i.ce.sspdAcctNo')" :validRules="sspdAcctNoRule" v-if="isInnerAcctShow" required>
                <h-input v-model="stopPaymentRegisterForm.sspdAcctNo" placeholder="" :maxlength="32" icon="android-search" @on-click="querySspdRgstCustAcct('sspd')" readonly></h-input>
              </h-form-item>
              <h-form-item prop="sspdName" :label="$t('m.i.ce.sspdName')" required v-if="isInnerAcctShow">
                <h-input v-model="stopPaymentRegisterForm.sspdName" placeholder="" :maxlength="60" readonly :lengthByByte="false"></h-input>
              </h-form-item>
              <h-form-item prop="sspdAcctNo" :label="$t('m.i.ce.sspdAcctNo')" :validRules="sspdAcctNoRule" v-if="isNotInnerAcctShow">
                <h-input v-model="stopPaymentRegisterForm.sspdAcctNo" placeholder="" :maxlength="32"></h-input>
              </h-form-item>
              <h-form-item prop="sspdName" :label="$t('m.i.ce.sspdName')" required v-if="isNotInnerAcctShow">
                <h-input v-model="stopPaymentRegisterForm.sspdName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
              </h-form-item>
              <h-form-item prop="sspdAddr" :label="$t('m.i.ce.sspdAddr')" required>
                <h-input v-model="stopPaymentRegisterForm.sspdAddr" placeholder="" :maxlength="150"></h-input>
              </h-form-item>
              <h-form-item prop="billMoney" :label="$t('m.i.ce.sspdMoney')" required>
                <h-input v-model="stopPaymentRegisterForm.billMoney" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="sspdDt" :label="$t('m.i.billInfo.sspdDt')" required>
                <h-date-picker type="date" v-model="stopPaymentRegisterForm.sspdDt" placeholder="" @on-change="handleSspdDtChange" :editable=false readonly></h-date-picker>
              </h-form-item>
              <h-form-item prop="sspdReason" :label="$t('m.i.ce.sspdReason')" required>
                <h-input v-model="stopPaymentRegisterForm.sspdReason" placeholder="" :maxlength="150" :lengthByByte="false"></h-input>
              </h-form-item>
              <common-input v-model="stopPaymentRegisterForm.sspdReceiveName" :label="$t('m.i.ce.sspdName1')" prop="sspdReceiveName"
                            :maxlength="60" required :lengthByByte="false"></common-input>
              <h-form-item prop="sspdPhone" :label="$t('m.i.ce.sspdPhone1')" required  :validRules="phoneRule">
                <h-input v-model="stopPaymentRegisterForm.sspdPhone" placeholder="" :maxlength="30"></h-input>
              </h-form-item>
              <h-form-item prop="sspdCertType" :label="$t('m.i.ce.sspdCertType1')" required class="h-form-long-label">
                <h-select v-model="stopPaymentRegisterForm.sspdCertType" placeholder="" showTitle>
                  <h-option v-for="item in certTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="sspdCertNo" :label="$t('m.i.ce.sspdCertNo1')" required :validRules="sspdCertNoRule" class="h-form-long-label">
                <h-input v-model="stopPaymentRegisterForm.sspdCertNo" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item prop="secondSspdName" :label="$t('m.i.ce.secondSspdName2')" :required="secondIsRequired">
                <h-input v-model="stopPaymentRegisterForm.secondSspdName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
              </h-form-item>
              <common-input v-model="stopPaymentRegisterForm.secondSspdPhone" :label="$t('m.i.ce.secondSspdPhone2')" prop="secondSspdPhone"
                            :maxlength="30" :validRules="phoneRule"  :required="secondIsRequired"></common-input>
              <h-form-item prop="secondSspdCertType" :label="$t('m.i.ce.secondSspdCertType2')" :required="secondIsRequired" :class="{'h-form-long-label': secondIsRequired}">
                <h-select v-model="stopPaymentRegisterForm.secondSspdCertType" placeholder="" showTitle>
                  <h-option v-for="item in certTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="secondSspdCertNo" :label="$t('m.i.ce.secondSspdCertNo2')"  :required="secondIsRequired" :validRules="secondSspdCertNoRule"
                           :class="{'h-form-long-label': secondIsRequired}">
                <h-input v-model="stopPaymentRegisterForm.secondSspdCertNo" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item prop="sspdCorpName" :label="$t('m.i.ce.sspdCorpName1')" >
                <h-input v-model="stopPaymentRegisterForm.sspdCorpName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
              </h-form-item>
              <h-form-item prop="sspdReportNo" :label="$t('m.i.ce.sspdReportNo')" >
                <h-input v-model="stopPaymentRegisterForm.sspdReportNo" placeholder="" :maxlength="100"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <h-button type="ghost" @click="stopPaymentRegisterWinClose">{{$t("m.i.common.close")}}</h-button>
            <h-button type="primary" @click="uploadImage('stopPay')"  v-if="uploadIsShow">{{$t("m.i.common.uploadImg")}}</h-button>
            <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
            <h-button type="primary" v-else @click="stopPaymentRegisterSubmit()">{{$t("m.i.ce.sspd")}}</h-button>
          </div>
        </h-msg-box >

        <!-- 解除止付信息登记界面 -->
        <h-msg-box v-model="cancelStopPaymentWin" width="800" @on-close="cancelStopPaymentWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>解除止付信息登记</span>
          </p>
          <div>
            <h-form :model="cancelStopPaymentForm" :label-width="150" ref="cancelStopPaymentForm" cols="2" class="h-form-search" onlyBlurRequire>
              <h-form-item prop="anlgSspdDt" :label="$t('m.i.billInfo.anlgSspdDt')" required>
                <h-date-picker type="date" v-model="cancelStopPaymentForm.anlgSspdDt" placeholder="" @on-change="handleAnlgSspdDtChange" :editable=false readonly></h-date-picker>
              </h-form-item>
              <h-form-item prop="relieveType" :label="$t('m.i.billInfo.relieveType')" required>
                <h-select v-model="cancelStopPaymentForm.relieveType" placeholder="" showTitle>
                  <h-option value="RT01" v-show="RT01Show">挂失止付到期</h-option>
                  <h-option value="RT02" v-show="RT02Show">除权判决</h-option>
                  <h-option value="RT03" v-show="RT03Show">解除司法冻结</h-option>
                  <h-option value="RT05" v-show="RT05Show">解除公示催告</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="isInnerAcct" :label="$t('m.i.ce.isInnerAcct')" required>
                <h-select v-model="cancelStopPaymentForm.isInnerAcct" placeholder="" @on-change="isInnerAcctOnChange('anlgSspd')">
                  <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="anlgSspdAcctNo" :label="$t('m.i.ce.anlgSspdAcctNo')" required :validRules="sspdAcctNoRule" v-if="isInnerAcctShow">
                <h-input v-model="cancelStopPaymentForm.anlgSspdAcctNo" placeholder="" :maxlength="32" icon="android-search" @on-click="querySspdRgstCustAcct('anlgSspd')" readonly></h-input>
              </h-form-item>
              <h-form-item prop="anlgSspdName" :label="$t('m.i.ce.anlgSspdName')" required v-if="isInnerAcctShow">
                <h-input v-model="cancelStopPaymentForm.anlgSspdName" placeholder="" :maxlength="60" readonly :lengthByByte="false"></h-input>
              </h-form-item>
              <h-form-item prop="anlgSspdAcctNo" :label="$t('m.i.ce.anlgSspdAcctNo')" :validRules="sspdAcctNoRule" v-if="isNotInnerAcctShow">
                <h-input v-model="cancelStopPaymentForm.anlgSspdAcctNo" placeholder="" :maxlength="32"></h-input>
              </h-form-item>
              <h-form-item prop="anlgSspdName" :label="$t('m.i.ce.anlgSspdName')" required v-if="isNotInnerAcctShow">
                <h-input v-model="cancelStopPaymentForm.anlgSspdName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
              </h-form-item>
              <h-form-item prop="relieveReason" :label="$t('m.i.ce.relieveReason')" required>
                <h-input v-model="cancelStopPaymentForm.relieveReason" placeholder="" :maxlength="150" :lengthByByte="false"></h-input>
              </h-form-item>
              <common-input v-model="cancelStopPaymentForm.anlgSspdReceiveName" :label="$t('m.i.ce.anlgSspdName1')" prop="anlgSspdReceiveName"
                            :maxlength="60" required :lengthByByte="false"></common-input>
              <common-input v-model="cancelStopPaymentForm.anlgSspdReceivePhone" :label="$t('m.i.ce.anlgSspdPhone1')" prop="anlgSspdReceivePhone"
                            :maxlength="30" :validRules="phoneRule" required></common-input>
              <h-form-item prop="anlgSspdCertType" :label="$t('m.i.ce.anlgSspdCertType1')" required class="h-form-long-label">
                <h-select v-model="cancelStopPaymentForm.anlgSspdCertType" placeholder="" showTitle>
                  <h-option v-for="item in certTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="anlgSspdCertNo" :label="$t('m.i.ce.anlgSspdCertNo1')" required :validRules="sspdCertNoRule" class="h-form-long-label">
                <h-input v-model="cancelStopPaymentForm.anlgSspdCertNo" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item prop="secondAnlgSspdName" :label="$t('m.i.ce.secondAnlgSspdName2')" :required="cancelStopPaymentForm.relieveType === 'RT03'">
                <h-input v-model="cancelStopPaymentForm.secondAnlgSspdName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
              </h-form-item>
              <common-input v-model="cancelStopPaymentForm.secondAnlgSspdPhone" :label="$t('m.i.ce.secondAnlgSspdPhone2')" prop="secondAnlgSspdPhone"
                            :maxlength="30" :validRules="phoneRule" :required="cancelStopPaymentForm.relieveType === 'RT03'"></common-input>
              <h-form-item prop="secondAnlgSspdCertType" :label="$t('m.i.ce.secondAnlgSspdCertType2')" :required="cancelStopPaymentForm.relieveType === 'RT03'"
                           :class="{'h-form-long-label': cancelStopPaymentForm.relieveType === 'RT03'}">
                <h-select v-model="cancelStopPaymentForm.secondAnlgSspdCertType" placeholder="">
                  <h-option v-for="item in certTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="secondAnlgSspdCertNo" :label="$t('m.i.ce.secondAnlgSspdCertNo2')" :validRules="secondSspdCertNoRule" :required="cancelStopPaymentForm.relieveType === 'RT03'"
                           :class="{'h-form-long-label': cancelStopPaymentForm.relieveType === 'RT03'}">
                <h-input v-model="cancelStopPaymentForm.secondAnlgSspdCertNo" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item prop="anlgSspdCorpName" :label="$t('m.i.ce.anlgSspdCorpName1')" >
                <h-input v-model="cancelStopPaymentForm.anlgSspdCorpName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
              </h-form-item>
              <h-form-item prop="anlgSspdReportNo" :label="$t('m.i.ce.anlgSspdReportNo')" >
                <h-input v-model="cancelStopPaymentForm.anlgSspdReportNo" placeholder="" :maxlength="100"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <h-button type="ghost" @click="cancelStopPaymentWinClose">{{$t("m.i.common.close")}}</h-button>
            <h-button type="primary" @click="uploadImage('cancelStopPay')"  v-if="uploadIsShow">{{$t("m.i.common.uploadImg")}}</h-button>
            <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
            <h-button type="primary" v-else @click="cancelStopPaymentSubmit()">{{$t("m.i.ce.anlgSspd")}}</h-button>
          </div>
        </h-msg-box>

        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="imageParams"
          :isShowReset="false"
          :authObj="authObject"
          :format="imageFormatType"
          :maxSize="999999999"
          :isShowImgBatchNo="false"
          @imageWinClose="uploadImageWinClose"></image-loading>

        <!-- 止付登记弹窗 客户账号信息查询 -->
        <h-msg-box v-model="sspdRgstCustAcctWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="sspdRgstCustAcctWinClose" :mask-closable="false" @on-maximize="onMaximize">
          <p slot="header">
            <span>止付账号查询</span>
          </p>
          <!-- 查询表单 -->
          <div>
            <h-form :model="sspdRgstCustAcctFormItem" :label-width="90" ref="sspdRgstCustAcctFormItem" cols="4" class="h-form-search">
              <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                <h-input v-model="sspdRgstCustAcctFormItem.custNo" placeholder=""></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                <h-input v-model="sspdRgstCustAcctFormItem.custName" placeholder=""></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo">
                <h-input v-model="sspdRgstCustAcctFormItem.custAcctNo" placeholder=""></h-input>
              </h-form-item>
              <h-form-item class="h-form-operate">
                <h-button type="primary" @click="sspdRgstCustAcctFormSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="sspdRgstCustAcctFormReset()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="sspdRgstCustAcctColumns"
                      highlight-row
                      url="/bm/cust/acct/pageQueryCustAcctList"
                      :auto-load="false"
                      :height="300"
                      :bind-form="sspdRgstCustAcctFormItem"
                      :onRowDbClick="sspdRgstDoubleHandleClick"
                      :on-select-change="sspdRgstHandleRowClick"
                      ref="sspdRgstCustAcctDatagrid">
          </h-datagrid>
          <div slot="footer">
            <h-button type="ghost" @click="sspdRgstCustAcctWinClose">{{$t("m.i.common.close")}}</h-button>
            <h-button type="primary" @click="sspdRgstCustAcctSubmitForm">{{$t("m.i.common.commit")}}</h-button>
          </div>
        </h-msg-box>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {cmycurd, formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";
import {deepClone} from "@/utils/index";

export default {
    name: "busiStopPaymentRegisterMain",
    components: {
    },
    data() {
      return {
        imageFormatType:['jpg','JPG','png','PNG','jpeg','JPEG'],
        authObject: {
          imageAdd: true,       //影像新增
          imageRegister: false,  //登记
          imageDelete: true     //删除
        },
        YonList: [],
        strType: "",
        sspdCertNoRule: [{ test: this.vaildSspdCertNo, trigger: "blur" }],
        secondSspdCertNoRule: [{ test: this.vaildSspdCertNoSecond, trigger: "blur" }],
        sspdRgstCustAcctWin: false,
        sspdRgstCustAcctCustSelectRow: [],
        sspdRgstCustAcctFormItem: {
          custNo: '',
          custName: '',
          custAcctNo: '',
          activeFlag: '1',
          isOtherBankAcct: '0'
        },
        sspdRgstCustAcctColumns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: true,
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.common.custName"),
            key: "custName",
            sortable: true,
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.custAcctKind"),
            key: "custAcctKind",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"custAcctKind",params.row.custAcctKind);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.isOtherBankAcct"),
            key: "isOtherBankAcct",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"Yon",params.row.isOtherBankAcct);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
           title: this.$t("m.i.common.openBrchName"),
            key: "openBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.operBrchNo"),
            key: "operBrchNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.openBankNo"),
            key: "openBankNo",
            hiddenCol: false,
          }
        ],
        secondIsRequired: false,
        showBillInfoWin: false,
        queryCheck : false,
        billId: "",
        phoneRule: [{ test: this.vaildPhone, trigger: "blur" }],
        // sspdPhoneRule: [{test: /^[0-9]{1,30}$/, trigger:'blur', message: '止付人电话为数字且不能超过30位'}],
        sspdAcctNoRule: [{test: /^[0-9a-zA-Z]{1,32}$/, trigger:'blur', message: '由小于或等于32位数字或字母组成'}],
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          sspdStatus: '',
          billNo: '',
          sspdType:'',
          sspdDt:'',
          relieveType:'',
          relieveDt:'',
          curFuncNo : 'PICE010823',
          reverseBillNo : '',
          notCancelTypes : 'RV03,RV01'
        },
        modifyFirst: "2",
        isNotInnerAcctShow: false,
        isInnerAcctShow: false,
        stopPaymentRegisterForm: {
          acptId: '',
          billNo: '',
          sspdType: '',
          sspdName: '',
          sspdAcctNo: '',
          sspdAddr: '',
          billMoney: '',
          sspdDt: window.sessionStorage.getItem("workDate"),
          sspdReason: '',
          sspdPhone: '',
          sspdCertType: '',
          sspdCertNo: '',
          secondSspdName: '',
          secondSspdCertType: '',
          secondSspdCertNo: '',
          sspdCorpName: '',
          sspdReportNo: '',
          isInnerAcct: ''
        },
        cancelStopPaymentForm: {
          acptId: '',
          sspdId: '',
          anlgSspdDt: window.sessionStorage.getItem("workDate"),
          relieveType: '',
          anlgSspdName: '',
          anlgSspdAcctNo: '',
          relieveReason: '',
          anlgSspdCertType: '',
          anlgSspdCertNo: '',
          secondAnlgSspdName: '',
          secondAnlgSspdCertType: '',
          secondAnlgSspdCertNo: '',
          anlgSspdCorpName: '',
          anlgSspdReportNo: '',
          isInnerAcct: ''
        },
        columns: [
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
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.ce.sspdStatus"),
            key: 'sspdStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"SspdStatus",params.row.sspdStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.sspdAndRelieveType"),
            key: 'sspdAndRelieveType',
            hiddenCol: false
          },
          {
            title:"止付/解除止付日期",
            key:"sspdDt",
            hiddenCol:false,
            render:(h,params)=>{
              let value=params.row.sspdDt!=null ?this.$moment(params.row.sspdDt, "YYYYMMDD").format("YYYY-MM-DD"):"-";
              return h("span",
                {
                  domProps: {
                    title: value
                  }
                }, value);
            }
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptStatus",params.row.acptStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
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
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
             title: this.$t("m.i.billInfo.acptDt"),
            key: 'acptDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.acptDt == null || params.row.acptDt === ""){
                return "";
              }
              let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
        ],
        RT01Show: false,
        RT02Show: false,
        RT03Show: false,
        RT05Show: false,

        ST01Show: false,
        ST02Show: false,
        ST03Show: false,

        uploadIsShow: false,
        certTypeList: [],
        sspdTypeList: [],
        relieveTypeList: [],
        sspdStatusList: [],
        dictMap: new Map(),
        submitFlag: false,
        currentSelectRow: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        stopPaymentRegisterWin: false,
        cancelStopPaymentWin: false,
        handleSspdStatus: false,
        cancelHandleSspdStatus: false,
        sspdImageTypeList : [],
        relieveImageTypeList: [],
        //影像上传
        showUploadImageWin: false,
        sspdId:"",
        imageParams: {
          imgTypeList:[],
          listId:"",
          imgType: '',
          imgBusiType: '',
          billNo: '',
          imageUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_imageListPage", //查询可查看影像url
          imageUploadUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_uploadImageToLocal", //影像上传url
          imageDeleteUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_deleteImage", //影像删除url
          imgShowUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_imageById?id=", //查看影像url
        },
        //是否显示更多查询项
        ifShowMore: false
      }

    },
    mounted() {
      getDictListByGroups("DraftTypeCode,SspdStatus,SspdType,SspdImageType,RelieveImageType,AnlgSspdType,AcptStatus,CertificateType,custAcctKind,Yon").then(res => {
        this.certTypeList = res.get("CertificateType");
        this.sspdTypeList = res.get("SspdType");
        this.relieveTypeList = res.get("AnlgSspdType");
        this.YonList = res.get("Yon");
        this.sspdImageTypeList = res.get("SspdImageType");
        this.relieveImageTypeList = res.get("RelieveImageType");
        this.dictMap = res.get("map");
      });
      this.getUploadIsShow();
      this.getParams();
    },
    methods: {
      vaildPhone(rule, val, callback) {
        let message = "";
        switch (rule.field) {
          case 'sspdPhone':
            message = '止付经办人1电话为数字且不能超过30位';
            break;
          case 'secondSspdPhone':
            message = '止付经办人2电话为数字且不能超过30位';
            break;
          case 'anlgSspdReceivePhone':
            message = '解除止付经办人1电话为数字且不能超过30位';
            break;
          case 'secondAnlgSspdPhone':
            message = '解除止付经办人2电话为数字且不能超过30位';
            break;
          default:
            message = "电话为数字且不能超过30位";
        }
        let re = /^[0-9]{1,30}$/;
        if (val !== "" && val !== null && val !== undefined) {
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error(message));
          }
        } else {
          callback();
        }
      },
      vaildSspdCertNo(rule, val, callback) {
        if (this.stopPaymentRegisterForm.sspdCertType === "3" || this.cancelStopPaymentForm.anlgSspdCertType === "3") {
          let re = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if (val !== "" && val !== null) {
            if (re.test(val)) {
              callback();
            } else {
              callback(new Error("身份证号码输入不合法"));
            }
          } else {
            callback();
          }
        } else {
          if (val !== "" && val !== null) {
            let re = /^[0-9a-zA-Z]{1,60}$/;
            if (re.test(val)) {
              callback();
            } else {
              callback(new Error("由小于或等于60位数字或字母组成"));
            }
          } else {
            callback();
          }
        }
      },
      vaildSspdCertNoSecond(rule, val, callback) {
        if (this.stopPaymentRegisterForm.secondSspdCertType === "3" || this.cancelStopPaymentForm.secondAnlgSspdCertType === "3") {
          let re = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if (val !== "" && val !== null) {
            if (re.test(val)) {
              callback();
            } else {
              callback(new Error("身份证号码输入不合法"));
            }
          } else {
            callback();
          }
        } else {
          if (val !== "" && val !== null) {
            let re = /^[0-9a-zA-Z]{1,60}$/;
            if (re.test(val)) {
              callback();
            } else {
              callback(new Error("由小于或等于60位数字或字母组成"));
            }
          } else {
            callback();
          }
        }
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      handleDateChange(value) {
        this.formItem.sspdDt = value.replace(/-/g, "");
      },
      handleRelieveDateChange(value){
        this.formItem.relieveDt = value.replace(/-/g, "");
      },
      sspdStatusChange() {
          this.formItem.sspdDt = "";
          this.formItem.sspdType = "";
          this.formItem.relieveType = "";
          this.formItem.relieveDt = "";
      },
      isInnerAcctOnChange(str) {
        if(str === "sspd") {
          this.stopPaymentRegisterForm.sspdAcctNo = "";
          this.stopPaymentRegisterForm.sspdName = "";
          if(this.stopPaymentRegisterForm.isInnerAcct === "1") {
            this.isInnerAcctShow = true;
            this.isNotInnerAcctShow = false;
          }else if(this.stopPaymentRegisterForm.isInnerAcct === "0") {
            this.isInnerAcctShow = false;
            this.isNotInnerAcctShow = true;
          }else {
            this.isInnerAcctShow = false;
            this.isNotInnerAcctShow = false;
          }
        }else if(str === "anlgSspd") {
          if(this.modifyFirst === "1") {
            if(this.cancelStopPaymentForm.isInnerAcct === "1") {
              this.isInnerAcctShow = true;
              this.isNotInnerAcctShow = false;
            }else if(this.cancelStopPaymentForm.isInnerAcct === "0") {
              this.isInnerAcctShow = false;
              this.isNotInnerAcctShow = true;
            }else {
              this.isInnerAcctShow = false;
              this.isNotInnerAcctShow = false;
            }
            this.modifyFirst = "2";
          }else {
            this.cancelStopPaymentForm.anlgSspdAcctNo = "";
            this.cancelStopPaymentForm.anlgSspdName = "";
            if(this.cancelStopPaymentForm.isInnerAcct === "1") {
              this.isInnerAcctShow = true;
              this.isNotInnerAcctShow = false;
            }else if(this.cancelStopPaymentForm.isInnerAcct === "0") {
              this.isInnerAcctShow = false;
              this.isNotInnerAcctShow = true;
            }else {
              this.isInnerAcctShow = false;
              this.isNotInnerAcctShow = false;
            }
          }
        }
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.sspdRgstCustAcctDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //止付登记弹窗 客户账号信息弹窗
      querySspdRgstCustAcct(str) {
        this.strType = str;
        this.sspdRgstCustAcctWin = true;
        this.$nextTick(() => {
          this.sspdRgstCustAcctFormSearch();
        });
      },
      //止付登记弹窗 客户账号信息弹窗 查询
      sspdRgstCustAcctFormSearch() {
        this.$refs.sspdRgstCustAcctDatagrid.dataChange(1);
        this.sspdRgstCustAcctCustSelectRow = [];
      },
      //止付登记弹窗 客户账号信息弹窗 重置
      sspdRgstCustAcctFormReset() {
        this.$refs.sspdRgstCustAcctFormItem.resetFields();
      },
      //止付登记弹窗 客户账号信息弹窗 双击行选中
      sspdRgstDoubleHandleClick(arr) {
        this.sspdRgstCustAcctCustSelectRow = arr;
        this.sspdRgstCustAcctSubmitForm();
      },
      //止付登记弹窗 客户账号信息弹窗 行选中
      sspdRgstHandleRowClick(arr) {
        this.sspdRgstCustAcctCustSelectRow = arr[0];
      },
      //止付登记弹窗 客户账号信息弹窗 关闭
      sspdRgstCustAcctWinClose() {
        this.sspdRgstCustAcctWin = false;
        this.sspdRgstCustAcctFormReset();
      },
      //止付登记弹窗 客户账号信息弹窗 确定
      sspdRgstCustAcctSubmitForm() {
        if (this.sspdRgstCustAcctCustSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(this.strType === "sspd") {
          this.stopPaymentRegisterForm.sspdAcctNo = this.sspdRgstCustAcctCustSelectRow.custAcctNo;
          this.stopPaymentRegisterForm.sspdName = this.sspdRgstCustAcctCustSelectRow.custName;
          this.$refs.stopPaymentRegisterForm.validateField('sspdAcctNo');
        }else if(this.strType === "anlgSspd") {
          this.cancelStopPaymentForm.anlgSspdAcctNo = this.sspdRgstCustAcctCustSelectRow.custAcctNo;
          this.cancelStopPaymentForm.anlgSspdName = this.sspdRgstCustAcctCustSelectRow.custName;
          this.$refs.cancelStopPaymentForm.validateField('anlgSspdAcctNo');
        }
        this.sspdRgstCustAcctWinClose();
      },
      secondIsRequiredOnChange() {
        if(this.stopPaymentRegisterForm.sspdType === "ST03") {
          this.secondIsRequired = true;
        }else {
          this.secondIsRequired = false;
        }
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleSspdDtChange(value) {
        this.stopPaymentRegisterForm.sspdDt = value.replace(/-/g, "");
      },
      handleAnlgSspdDtChange(value) {
        this.cancelStopPaymentForm.anlgSspdDt = value.replace(/-/g, "");
      },
      //影像上传按钮是否展示
      getUploadIsShow() {
        //TODO 是否改为使用commonutils方法中获取
        post({}, "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_getImageUploadBtnParam").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retMsg === "1") {
                this.uploadIsShow = true;
              } else if (res.data.retMsg === "0") {
                this.uploadIsShow = false;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
        this.handleSspdStatus = false;
        this.cancelHandleSspdStatus = false;
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = '';
          this.formItem.drwrAcctNo = '';
          this.formItem.sspdStatus = '';
          this.formItem.billNo = '';
          this.formItem.acptProtocalNo = '';
          this.formItem.sspdType='';
          this.formItem.sspdDt='';
          this.formItem.relieveType='';
          this.formItem.relieveDt='';
          this.formItem.reverseBillNo='';
        });
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
        if (this.currentSelectRow.length === 0) {
          this.handleSspdStatus = false;
          this.cancelHandleSspdStatus = false;
          this.clearSspdType();
        }
        if (this.currentSelectRow.sspdStatus === "0" || this.currentSelectRow.sspdStatus === "6") {
          this.handleSspdStatus = false;
          this.cancelHandleSspdStatus = true;
        }
        if (this.currentSelectRow.sspdStatus === "3") {
          if (this.currentSelectRow.sspdType === "ST01") {
            this.handleSspdStatus = false;
            this.cancelHandleSspdStatus = false;
          } else {
            this.handleSspdStatus = true;
            this.cancelHandleSspdStatus = false;
          }
        }
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
        this.handleSspdStatus = false;
        this.cancelHandleSspdStatus = false;
        this.clearSspdType();
      },
      clearSspdType(){
        this.ST01Show=false
        this.ST02Show=false;
        this.ST03Show=false;
        this.RT01Show=false;
        this.RT02Show=false;
        this.RT03Show=false;
        this.RT05Show=false;
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },


      //影像上传
      uploadImage(str) {
        if (str === "stopPay") {
          if (this.currentSelectRow.sspdId !== null && this.currentSelectRow.sspdId !== "") {
            //止付id有值时，传sspdId查询
            this.imageParams.listId = this.currentSelectRow.sspdId;
          } else {
            this.imageParams.listId = this.currentSelectRow.id;
          }
          this.imageParams.billNo = this.currentSelectRow.billNo;
          this.imageParams.imgTypeList = this.sspdImageTypeList;
          this.imageParams.imgBusiType = "0";
          this.showUploadImageWin = true;
        } else {
          if (this.currentSelectRow.sspdId !== null && this.currentSelectRow.sspdId !== "") {
            this.imageParams.listId = this.currentSelectRow.sspdId;
          } else {
            this.imageParams.listId = this.currentSelectRow.id;
          }
          this.imageParams.billNo = this.currentSelectRow.billNo;
          this.imageParams.imgTypeList = this.relieveImageTypeList;
          this.imageParams.imgBusiType = "1";
          this.showUploadImageWin = true;
        }
      },
      //影像上传关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList=[];
      },
      //止付
      stopPayment() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.currentSelectRow.sspdStatus === "6" && this.currentSelectRow.sspdType === "RT02") {
          this.$msgTip.info(this, { info: "解除止付类型为除权判决的票不能进行止付操作!" });
          return;
        }
          this.ST01Show = true;
          this.ST02Show = true;
          this.ST03Show = true;
          if (this.currentSelectRow.sspdStatus === "3" && this.currentSelectRow.sspdType === "ST01") {
            this.ST01Show = false;
            this.ST03Show = false;
          }
        this.stopPaymentRegisterForm.billNo = this.currentSelectRow.billNo;
        this.stopPaymentRegisterForm.billMoney = this.currentSelectRow.billMoney;
        this.queryCheckConfirm(this.currentSelectRow.billNo);
      },
      queryCheckConfirm(billNo){
        post({code:billNo}, "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_queryCheckConfirm").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            this.queryCheck = res.data.retData;
            if (retCode === "000000") {
              if(this.queryCheck === true){
                this.$hMsgBox.confirm({
                  title: this.$t('m.i.common.confirm'),
                  content: '已经查询查复，确定继续?',
                  onOk: () => {
                    this.stopPaymentRegisterWin = true;
                  }
                });
              }else {
                this.stopPaymentRegisterWin = true;
              }
            }else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$loadingbox.close();
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError")});
          }
        }).catch(error => {
          this.$loadingbox.close();
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //止付信息登记弹窗
      //确定
      stopPaymentRegisterSubmit() {
        let id = "";
        if (this.currentSelectRow.sspdId !== null && this.currentSelectRow.sspdId !== "") {
          //止付id有值时，传sspdId查询
          id = this.currentSelectRow.sspdId;
        } else {
          id = this.currentSelectRow.id;
        }
        if (this.uploadIsShow) {
          post({ listId: id, imgBusiType: "0" }, "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_querySspdImageByPage").then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (res.data.retData.list.length === 0) {
                  this.$msgTip.info(this, { info: "请先上传影像" });
                  return;
                }
                this.stopPaymentRegisterSubmitNext();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.stopPaymentRegisterSubmitNext();
        }
      },
      stopPaymentRegisterSubmitNext() {
        this.stopPaymentRegisterForm.acptId = this.currentSelectRow.id;
        this.stopPaymentRegisterForm.sspdDt = this.$moment(this.stopPaymentRegisterForm.sspdDt).format("YYYYMMDD");
        this.$refs["stopPaymentRegisterForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_submitSspdInfo";
            post(this.stopPaymentRegisterForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  let form = deepClone(this.stopPaymentRegisterForm);
                  this.stopPaymentRegisterWinClose();
                  //TODO 止付是否需要打印止付通知书
                  //this.stopPaymentPrint(form);
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
      //关闭
      stopPaymentRegisterWinClose() {
        this.stopPaymentRegisterWin = false;
        this.$refs.stopPaymentRegisterForm.resetFields();
      },
      //挂失止付通知书打印
      stopPaymentPrint(form) {
        let vocherData = this.deepClone(this.currentSelectRow);
        let billMoney = vocherData.billMoney === null ? "0" : vocherData.billMoney;
        vocherData.billMoney = cmycurd(billMoney);
        if (!!vocherData.remitDt) {
          vocherData.remitDt = this.$moment(vocherData.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        if (!!vocherData.dueDt) {
          vocherData.dueDt = this.$moment(vocherData.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        if (!!vocherData.billType) {
          if (vocherData.billType === "AC01") {
            vocherData.billType = "银票";
          } else if (vocherData.billType === "AC02") {
            vocherData.billType = "商票";
          }
        }
        vocherData.sspdName = form.sspdName;
        vocherData.sspdAddr = form.sspdAddr;
        vocherData.sspdPhone = form.sspdPhone;
        vocherData.sspdReportNo = form.sspdReportNo;
        vocherData.printObj = JSON.stringify(vocherData);
        let vocherDataList = [];
        vocherDataList.push(vocherData);
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE030409 ", vocherData: vocherDataList },
          callback: () => {
            this.handleSearch();
          },
          errorCallback: () => {
            this.handleSearch();
          },
          closeCallback: ()=> {
            this.handleSearch();
          }
        });
      },

      //解除止付
      cancelStopPayment() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.cancelStopPaymentWin = true;
          this.RT01Show = true;
          this.RT02Show = true;
          this.RT03Show = true;
          this.RT05Show = true;
          if (this.currentSelectRow.sspdType === "ST01") {
            this.RT02Show = false;
            this.RT03Show = false;
            this.RT05Show = false;
          }
          if (this.currentSelectRow.sspdType === "ST02") {
            this.RT01Show = false;
            this.RT03Show = false;
          }
          if (this.currentSelectRow.sspdType === "ST03") {
            this.RT01Show = false;
            this.RT02Show = false;
            this.RT05Show = false;
          }
        post({ id: this.currentSelectRow.sspdId }, "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_getSspdInfo").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              // this.cancelStopPaymentForm.anlgSspdDt = res.data.retData.sspdDt + "";
              this.cancelStopPaymentForm.anlgSspdName = res.data.retData.sspdName;
              this.cancelStopPaymentForm.anlgSspdAcctNo = res.data.retData.sspdAcctNo;
              this.cancelStopPaymentForm.anlgSspdCertType = res.data.retData.sspdCertType;
              this.cancelStopPaymentForm.anlgSspdCertNo = res.data.retData.sspdCertNo;
              this.cancelStopPaymentForm.isInnerAcct = res.data.retData.isInnerAcct;
              this.cancelStopPaymentForm.anlgSspdCorpName = res.data.retData.sspdCorpName;
              this.modifyFirst = "1";
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //解除止付弹窗
      //确定
      cancelStopPaymentSubmit() {
        let id = "";
        if (this.currentSelectRow.sspdId !== null && this.currentSelectRow.sspdId !== "") {
          //止付id有值时，传sspdId查询
          id = this.currentSelectRow.sspdId;
        } else {
          id = this.currentSelectRow.id;
        }
        if (this.uploadIsShow) {
          post({ listId: id, imgBusiType: "1" }, "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_querySspdImageByPage").then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (res.data.retData.list.length === 0) {
                  this.$msgTip.info(this, { info: "请先上传影像" });
                  return;
                }
                this.cancelStopPaymentSubmitNext();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.cancelStopPaymentSubmitNext();
        }
      },
      cancelStopPaymentSubmitNext() {
        this.cancelStopPaymentForm.id = this.currentSelectRow.sspdId;
        this.cancelStopPaymentForm.acptId = this.currentSelectRow.id;
        this.cancelStopPaymentForm.anlgSspdDt = this.$moment(this.cancelStopPaymentForm.anlgSspdDt).format('YYYYMMDD');
        this.$refs["cancelStopPaymentForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain/func_submitUnSspdInfo";
            post(this.cancelStopPaymentForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  let form = deepClone(this.cancelStopPaymentForm);
                  this.cancelStopPaymentWinClose();
                  //TODO 商票是否需要打印解止付通知书
                  //this.cancelStopPaymentPrint(form);
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
      //关闭
      cancelStopPaymentWinClose() {
        this.cancelStopPaymentWin = false;
        this.$refs.cancelStopPaymentForm.resetFields();
      },
      //解除止付通知书打印
      cancelStopPaymentPrint(form) {
        let vocherData = this.deepClone(this.currentSelectRow);
        vocherData.anlgSspdName = form.anlgSspdName;
        let day = this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD");
        vocherData.yyyy = day.toString().substring(0, 4);
        vocherData.mm = day.toString().substring(4, 6);
        vocherData.dd = day.toString().substring(6, 8);
        vocherData.relieveReason = form.relieveReason;
        vocherData.printObj = JSON.stringify(vocherData);
        let vocherDataList = [];
        vocherDataList.push(vocherData);
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE030410", vocherData: vocherDataList },
          callback: () => {
            this.handleSearch();
          },
          errorCallback: () => {
            this.handleSearch();
          },
          closeCallback: ()=> {
            this.handleSearch();
          }
        });
      },
      getParams(){
        if (this.$route.path === "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterMain") {
          if (this.$route.query.sspdDt) {
            let sspdDt = this.$moment(this.$route.query.sspdDt, "YYYY-MM-DD").format("YYYYMMDD");
            this.formItem.sspdDt = sspdDt;
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
      },
    },
    watch: {
      "$route": "getParams",
    },
  };
</script>

<style scoped>

</style>
