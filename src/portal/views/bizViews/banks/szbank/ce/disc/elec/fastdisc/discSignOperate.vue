<!--极速贴现-签约管理/复核弹出界面-->
<template>
  <div>
    <h-msg-box v-model="tempDiscSignOperateWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" :height="getHeight">
      <p slot="header">
        <span v-if="signParams.optType==='accept'">签约受理</span>
        <span v-else-if="signParams.optType==='edit'">修改签约信息</span>
        <span v-else-if="signParams.optType==='pause'">暂停业务</span>
        <span v-else-if="signParams.optType==='recovery'">恢复业务</span>
        <span v-else-if="signParams.optType==='stop'">解约业务</span>
        <span v-if="signParams.optType==='check'">签约复核</span>
      </p>
      <div>
        <h-form :model="discSignOperateForm" :label-width="115" ref="discSignOperateForm" cols="2"
                class="h-form-search">
          <div>
            <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
              <h-input v-model="discSignOperateForm.custNo" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
              <h-input v-model="discSignOperateForm.custName" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" required v-if="discSignOperateForm.signMode !== '1'" >
              <h-input v-model="discSignOperateForm.custAcctNo" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="signBrchName" :label="$t('m.i.ce.signBrchName')" required>
              <h-input v-model="discSignOperateForm.signBrchName" :maxlength=125 readonly></h-input>
            </h-form-item>
            <div v-if="signParams.optType==='accept'">
              <h-form-item prop="operFlag" :label="$t('m.i.ce.operFlag')" required>
                <h-select v-model="discSignOperateForm.operFlag" placeholder="" @on-change="operFlagChange">
                  <h-option value="0">拒绝</h-option>
                  <h-option value="1">同意</h-option>
                </h-select>
              </h-form-item>
              <industry-category-name :formItem = "discSignOperateForm" :isRequired="discSignOperateForm.operFlag === '1' && signParams.optType==='accept'" v-show="discSignOperateForm.operFlag === '1' && signParams.optType==='accept'" @queryDetailName="queryDetailName"></industry-category-name>
            </div>
            <div v-if="signParams.optType==='check'">
              <h-form-item prop="operTypeName" :label="$t('m.i.common.operType')">
                <h-input v-model="discSignOperateForm.operTypeName" :maxlength=125 readonly></h-input>
              </h-form-item>
              <h-form-item prop="operResult" :label="$t('m.i.ce.operFlag')" v-if="discSignOperateForm.operTypeName === '新签约受理'">
                <h-select v-model="discSignOperateForm.operResult" placeholder="" readonly>
                  <h-option value="0">拒绝</h-option>
                  <h-option value="1">同意</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.dealRemark')" prop="operRemark" v-if="discSignOperateForm.operTypeName === '新签约受理' && discSignOperateForm.operResult === '0'"
                           class="h-form-height-auto" cols="2">
                <h-input type="textarea" :rows=3 v-model="discSignOperateForm.operRemark" :canResize="false"
                         :maxlength="500" readonly></h-input>
              </h-form-item>
              <h-form-item prop="applDt" :label="$t('m.i.ce.signApplyDt')"
                           v-if="!(discSignOperateForm.operTypeName === '新签约受理' && discSignOperateForm.operResult === '0')">
                <h-date-picker type="date" v-model="discSignOperateForm.applDt" placeholder="" showFormat
                               :editable=false :readonly="signParams.optType==='check'"></h-date-picker>
              </h-form-item>
            </div>
            <div v-if="signParams.optType==='edit' || (isRefuse!=null && isRefuse) || signParams.optType==='check'">
              <div v-if="!(discSignOperateForm.operTypeName === '新签约受理' && discSignOperateForm.operResult === '0')">
                <h-form-item prop="applActiveDt" :label="$t('m.i.ce.applSignEnableDt')"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)">
                  <h-date-picker type="date" v-model="discSignOperateForm.applActiveDt" placeholder="" showFormat
                                 :editable=false readonly></h-date-picker>
                </h-form-item>
                <h-form-item prop="applFailureDt" :label="$t('m.i.ce.applSignDueDt')"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)">
                  <h-date-picker type="date" v-model="discSignOperateForm.applFailureDt" placeholder="" showFormat
                                 :editable=false readonly></h-date-picker>
                </h-form-item>
                <h-form-item prop="actualActiveDt" :label="$t('m.i.ce.actualSignEnableDt')"
                             required
                             v-if="signParams.optType==='edit' && this.signParams.currentSelectRow.signStatus!=='FD20'">
                  <h-date-picker type="date" v-model="discSignOperateForm.actualActiveDt" placeholder="" showFormat
                                 :editable=false readonly></h-date-picker>
                </h-form-item>
                <h-form-item prop="actualFailureDt" :label="$t('m.i.ce.actualSignDueDt')"
                             required
                             v-if="signParams.optType==='edit' && this.signParams.currentSelectRow.signStatus!=='FD20'">
                  <h-date-picker type="date" v-model="discSignOperateForm.actualFailureDt" placeholder="" showFormat
                                 :editable=false readonly></h-date-picker>
                </h-form-item>

                <channel-select v-model="discSignOperateForm.channelNo" :label="$t('m.i.ce.signChannel')" prop="channelNo" required readonly></channel-select>

                <h-form-item :label="$t('m.i.ce.isBargain')" prop="isBargain" class="h-form-height-auto"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)" cols="2"
                             v-if="discSignOperateForm.operTypeName === '修改签约信息'">
                  <h-row>
                    <h-col span="11" style="padding-right: 28px;">
                      <h-select v-model="discSignOperateForm.isBargain" placeholder="" @on-change="isBargainChange" readonly>
                        <h-option v-for="item in signParams.YonList" :value="item.key" :key="item.key">{{ item.value }}
                        </h-option>
                      </h-select>
                    </h-col>
                    <h-col span="12"><span style="color: red;" v-if="beforeDiscSignForm.isBargain!==''">(修改前：{{beforeDiscSignForm.isBargain}})</span>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.isBargain')" prop="isBargain" v-else
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)">
                  <h-select v-model="discSignOperateForm.isBargain" placeholder="" @on-change="isBargainChange"
                            readonly>
                    <h-option v-for="item in signParams.YonList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.bargainRate')" :label-width="120" prop="bargainRate" class="h-form-height-auto" cols="2"
                             :required="signParams.optType==='edit' || (isBargainRefuse!=null && isBargainRefuse)"
                             v-if="isBargainRefuse!=null && isBargainRefuse && discSignOperateForm.operTypeName === '修改签约信息'"
                             :validRules="adjustRateRule">
                  <h-row>
                    <h-col span="11" style="padding-right: 28px;">
                      <h-typefield v-model="discSignOperateForm.bargainRate" :readonly="(isBargainRefuse!=null && !isBargainRefuse) || signParams.optType==='check'"
                                   :integerNum="3" :suffixNum="4"></h-typefield>
                    </h-col>
                    <h-col span="12"><span style="color: red;" v-if="beforeDiscSignForm.bargainRate!==''">(修改前：{{beforeDiscSignForm.bargainRate}})</span>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.bargainRate')" :label-width="120" prop="bargainRate"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)"
                             :validRules="adjustRateRule" v-else-if="isBargainRefuse!=null && isBargainRefuse">
                  <h-typefield v-model="discSignOperateForm.bargainRate" :readonly="(isBargainRefuse!=null && !isBargainRefuse) || signParams.optType==='check'"
                               :integerNum="3" :suffixNum="4"></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.limitAmt')" prop="limitAmt" class="h-form-height-auto"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)" cols="2"
                             v-if="discSignOperateForm.operTypeName === '修改签约信息'">
                  <h-row>
                    <h-col span="11" style="padding-right: 28px;">
                      <h-typefield type="money" v-model="discSignOperateForm.limitAmt" :maxlength="20"
                                   placeholder="数字，小数位最多2位" bigTips @on-blur="formatBillMoney('blur')"
                                   @on-focus="formatBillMoney('focus')"
                                   :readonly="signParams.optType==='check'"></h-typefield>
                    </h-col>
                    <h-col span="12"><span style="color: red;" v-if="beforeDiscSignForm.limitAmt!==''">(修改前：{{beforeDiscSignForm.limitAmt}})</span>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.limitAmt')" prop="limitAmt" v-else
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)">
                  <h-row>
                  <h-col :span="this.synchAmtShow ? 20:24">
                  <h-typefield type="money" v-model="discSignOperateForm.limitAmt" :maxlength="20"
                               placeholder="数字，小数位最多2位" bigTips @on-blur="formatBillMoney('blur')"
                               @on-focus="formatBillMoney('focus')"
                               :readonly="signParams.optType==='check' || this.synchAmtShow"></h-typefield>
                  </h-col>
                  <h-col :span="this.synchAmtShow ? 4:0">
                    <h-button type="primary" @click="synchAmt()" v-if="this.synchAmtShow">{{$t("m.i.common.synch")}}</h-button>
                  </h-col>
                  </h-row>
                </h-form-item>

                <h-form-item :label="$t('m.i.ce.isLimitFdiscSum')" prop="isLimitFdiscSum" class="h-form-height-auto h-form-long-label"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)" cols="2"
                             v-if="discSignOperateForm.operTypeName === '修改签约信息'">
                  <h-row>
                    <h-col span="11" style="padding-right: 28px;">
                      <h-select v-model="discSignOperateForm.isLimitFdiscSum" placeholder="" @on-change="isLimitFdiscSumChange"
                                :readonly="signParams.optType==='check'">
                        <h-option v-for="item in signParams.YonList" :value="item.key" :key="item.key">{{ item.value }}
                        </h-option>
                      </h-select>
                    </h-col>
                    <h-col span="12"><span style="color: red;" v-if="beforeDiscSignForm.isLimitFdiscSum!==''">(修改前：{{beforeDiscSignForm.isLimitFdiscSum}})</span>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.isLimitFdiscSum')" prop="isLimitFdiscSum" v-else
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)" class="h-form-long-label">
                  <h-select v-model="discSignOperateForm.isLimitFdiscSum" placeholder="" @on-change="isLimitFdiscSumChange"
                            :readonly="signParams.optType==='check'">
                    <h-option v-for="item in signParams.YonList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.everydayFdiscSum')" :label-width="120" prop="everydayFdiscSum" class="h-form-height-auto" cols="2"
                             :required="signParams.optType==='edit' || (isLimitFdiscSumRefuse!=null && isLimitFdiscSumRefuse)"
                             v-if="isLimitFdiscSumRefuse!=null && isLimitFdiscSumRefuse && discSignOperateForm.operTypeName === '修改签约信息'">
                  <h-row>
                    <h-col span="11" style="padding-right: 28px;">
                      <h-input v-model="discSignOperateForm.everydayFdiscSum" :maxlength=9
                               :readonly="(isLimitFdiscSumRefuse!=null && !isLimitFdiscSumRefuse) || signParams.optType==='check'" type="int"></h-input>
                    </h-col>
                    <h-col span="12"><span style="color: red;" v-if="beforeDiscSignForm.everydayFdiscSum!==''">(修改前：{{beforeDiscSignForm.everydayFdiscSum}})</span>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.everydayFdiscSum')" :label-width="120" prop="everydayFdiscSum"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)"
                             :validRules="discLimitRule" v-else-if="isLimitFdiscSumRefuse!=null && isLimitFdiscSumRefuse">
                  <h-input v-model="discSignOperateForm.everydayFdiscSum" :maxlength=9
                           :readonly="(isLimitFdiscSumRefuse!=null && !isLimitFdiscSumRefuse) || signParams.optType==='check'" type="int"></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.ce.discInBrchName')" prop="discInBrchName" class="h-form-height-auto"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)" cols="2"
                             v-if="discSignOperateForm.operTypeName === '修改签约信息'">
                  <h-row>
                    <h-col span="11" style="padding-right: 28px;">
                      <h-input v-model="discSignOperateForm.discInBrchName" placeholder="" readonly :maxlength="125"></h-input>
                    </h-col>
                    <h-col span="12"><span
                      style="color: red;" v-if="beforeDiscSignForm.discInBrchName!==''">(修改前：{{beforeDiscSignForm.discInBrchName}})</span>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.discInBrchName')" prop="discInBrchName" v-else
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)">
                  <h-input v-model="discSignOperateForm.discInBrchName" placeholder="" readonly :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="custMgrNo" :label="$t('m.i.common.custMgrNo')" class="h-form-height-auto"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)" cols="2"
                             v-if="discSignOperateForm.operTypeName === '修改签约信息'">
                  <h-row>
                    <h-col span="11" style="padding-right: 28px;">
                      <h-input v-model="discSignOperateForm.custMgrNo" placeholder="" readonly
                               :icon="signParams.optType==='check' ? '' : 'android-search'"
                               @on-click="queryCustManager('add')"></h-input>
                    </h-col>
                    <h-col span="12"><span style="color: red;" v-if="beforeDiscSignForm.custMgrNo!==''">(修改前：{{beforeDiscSignForm.custMgrNo}})</span>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item prop="custMgrNo" :label="$t('m.i.common.custMgrNo')" v-else
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)">
                  <h-input v-model="discSignOperateForm.custMgrNo" placeholder="" readonly
                           :icon="signParams.optType==='check' ? '' : 'android-search'"
                           @on-click="queryCustManager('add')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName" class="h-form-height-auto"
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)" cols="2"
                             v-if="discSignOperateForm.operTypeName === '修改签约信息'">
                  <h-row>
                    <h-col span="11" style="padding-right: 28px;">
                      <h-input v-model="discSignOperateForm.custMgrName" :maxlength=60 readonly></h-input>
                    </h-col>
                    <h-col span="12"><span
                      style="color: red;" v-if="beforeDiscSignForm.custMgrName!==''">(修改前：{{beforeDiscSignForm.custMgrName}})</span>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName" v-else
                             :required="signParams.optType==='edit' || (isRefuse!=null && isRefuse)">
                  <h-input v-model="discSignOperateForm.custMgrName" :maxlength=60 readonly></h-input>
                </h-form-item>
                <industry-category-name :formItem = "discSignOperateForm" :isRequired="signParams.optType==='edit'" v-show="signParams.optType==='edit'" @queryDetailName="queryDetailName"></industry-category-name>
              </div>
            </div>
            <h-form-item :label="$t('m.i.ce.acceptRemark')" prop="acceptRemark" :required="isRefuse!=null && !isRefuse"
                         v-if="isAcceptRemarkShow" class="h-form-height-auto">
              <h-input type="textarea" :rows=3 v-model="discSignOperateForm.acceptRemark" :canResize="false"
                       :maxlength="500" :readonly="signParams.optType==='check'"></h-input>
            </h-form-item>
            <div v-if="signParams.optType==='check'">
              <h-form-item prop="operFlag" :label="$t('m.i.ce.checkResult')" required>
                <h-select v-model="discSignOperateForm.operFlag" placeholder="" @on-change="operFlagChange">
                  <h-option value="0">拒绝</h-option>
                  <h-option value="1">同意</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.ce.checkRemark')" prop="checkRemark" :required="isCheckRefuse!=null && !isCheckRefuse"
                           v-if="isCheckRefuse!=null && !isCheckRefuse" class="h-form-height-auto">
                <h-input type="textarea" :rows=3 v-model="discSignOperateForm.checkRemark" :canResize="false"
                         :maxlength="500"></h-input>
              </h-form-item>
            </div>
          </div>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 行业投向详细信息选择框 -->
    <h-msg-box v-model="dictNameSelectWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>行业投向选择</span>
      </p>
      <div class="h-tree-search">
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isDisabled" @click='expandTree(indTreeData)'>
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" :disabled="!isDisabled" @click='unExpandTree(indTreeData)'>
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
        </div>
        <div class="h-tree-content" style="position:relative;height:300px">
          <h-tree :data="indTreeData" ref='indTreeData' class='h-tree-self' :show-checkbox="false"></h-tree>
        </div>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="dictNameSelectWin=!dictNameSelectWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="indNameAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul, accDiv } from "@/api/bizApi/commonUtil";

  export default {
    name: "discSignOperate",
    components: {
      ShowBranch:() => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    data() {
      return {
        discSignOperateForm : {
          id: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          signBrchName: "",
          operFlag: "",
          activeDt: "",
          failureDt: "",
          applActiveDt: "",
          applFailureDt: "",
          actualActiveDt: "",
          actualFailureDt: "",
          adjustRate: "",
          limitAmt: "",
          usedLimitAmt:"",
          discInBankNo: "",
          discInBrchNo: "",
          discInBrchName: "",
          custArea: "",
          isBargain: "",
          bargainRate:"",
          bargainAuditBrchNo: "",
          custMgrNo: "",
          custMgrName: "",
          acceptRemark: "",
          operTypeName: "",
          operResult: "",
          operRemark: "",
          checkRemark: "",
          applDt: "",
          industryCategory:"",
          industryCategoryName:"",
          channelNo: "",
          channelName: "",
          isLimitFdiscSum: "",
          everydayFdiscSum: "",
          everydayUsedSum: "",
          signMode: "",
          socCode: "",
          dataSource: ""
        },
        dictNameSelectWin : false,
        synchAmtShow:false,
        adjustRateRule : [{
          // ([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)
          test: /^(((\d|[1-9]\d|-\d|-[0-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000|-100|-100\.0|-100\.00|-100\.000|-100\.0000)$/,
          trigger: "blur",
            message: "利率为-100~100之间的数，小数位不超过4位"
        }],
        discLimitRule : [{
          // ([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)
          test: /^[1-9][0-9]*$/,
          trigger: "blur",
          message: "每日极速贴现张数为正整数"
        }],
        submitFlag : false,
        showBargainAuditBrchWin : false,
        //受理结果,0-拒绝,1-同意
        isRefuse : null,
        //是否允许议价,0-否，1-是
        isBargainRefuse : null,
        //是否控制每日极速贴现张数,0-否，1-是
        isLimitFdiscSumRefuse : null,
        //复核结果,0-拒绝,1-同意
        isCheckRefuse : null,
        beforeDiscSignForm : {
          adjustRate: "",
          limitAmt: "",
          discInBrchName: "",
          custArea: "",
          isBargain: "",
          custMgrNo: "",
          custMgrName: "",
          isLimitFdiscSum: "",
          everydayFdiscSum: ""
        },
        isReAccept : false,
        indTreeData : [],
        isDisabled : false,
      };
    },
    props: {
      discSignOperateWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      signParams: {
        type: Object,
        default: {
          optType: "",
          custAreaList: [],
          YonList: [],
          dictMap: new Map(),
          currentSelectRow: [],
          synchAmtShow:false
        }
      },
      signInfoUrl : {
        type : String,
        default : "/ce/fastdisc/sign/info",
      },
      updateSignUrl : {
        type : String,
        default : "/ce/fastdisc/sign/updateBeforeLog",
      },
      operSignUrl : {
        type : String,
        default : "",
      },
    },
    computed: {
      tempDiscSignOperateWin: {
        get() {
          return this.discSignOperateWin;
        },
        set() {
        }
      },
      isAcceptRemarkShow() {
        let flag = true;
        if (this.discSignOperateForm.operTypeName === '新签约受理' || (this.signParams.optType === "accept" && this.isRefuse == null )) {
          flag = false;
        }
        return flag;
      },
      getHeight() {
        return window.innerHeight - 130;
      }
    },
    mounted() {
    },
    beforeDestroy() {
    },
    watch: {
      discSignOperateWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.discSignOperateFormReset();
            this.isRefuse = null;
            this.isBargainRefuse = null;
            this.isLimitFdiscSumRefuse = null;
            this.isCheckRefuse = null;
            this.isReAccept = false;
            this.synchAmtShow = this.signParams.synchAmtShow;
            this.discSignOperateForm.id = this.signParams.currentSelectRow.id;
            this.discSignOperateForm.custNo = this.signParams.currentSelectRow.custNo;
            this.discSignOperateForm.custName = this.signParams.currentSelectRow.custName;
            this.discSignOperateForm.custAcctNo = this.signParams.currentSelectRow.custAcctNo;
            this.discSignOperateForm.signBrchName = this.signParams.currentSelectRow.signBrchName;
            this.discSignOperateForm.signBrchNo = this.signParams.currentSelectRow.signBrchNo;
            this.discSignOperateForm.channelNo = this.signParams.currentSelectRow.channelNo;
            this.discSignOperateForm.channelName = this.signParams.currentSelectRow.channelName;
            this.discSignOperateForm.everydayFdiscSum = this.signParams.currentSelectRow.everydayFdiscSum;
            this.discSignOperateForm.everydayUsedSum = this.signParams.currentSelectRow.everydayUsedSum;
            this.discSignOperateForm.signMode = this.signParams.currentSelectRow.signMode;
            this.discSignOperateForm.socCode = this.signParams.currentSelectRow.socCode;
            this.discSignOperateForm.dataSource = this.signParams.currentSelectRow.dataSource;
            this.discSignOperateForm.billType = this.signParams.currentSelectRow.billType;
            if (this.signParams.optType === "accept") {
              post({ id: this.signParams.currentSelectRow.id }, this.signInfoUrl).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    let obj = res.data.retData;
                    this.discSignOperateForm.adjustRate = obj.adjustRate == null ? "" : formatNumber(accMul(obj.adjustRate, 100), 4, ",");
                    this.discSignOperateForm.bargainRate = obj.bargainRate == null ? "0.0000" : formatNumber(accMul(obj.bargainRate, 100), 4, ",");
                    this.discSignOperateForm.limitAmt = formatNumber(obj.limitAmt, 2, ",");
                    this.discSignOperateForm.applActiveDt = this.signParams.currentSelectRow.applActiveDt;
                    if (!!this.discSignOperateForm.applActiveDt) {
                      this.discSignOperateForm.applActiveDt = this.$moment(this.discSignOperateForm.applActiveDt, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                    this.discSignOperateForm.applFailureDt = this.signParams.currentSelectRow.applFailureDt;
                    if (!!this.discSignOperateForm.applFailureDt) {
                      this.discSignOperateForm.applFailureDt = this.$moment(this.discSignOperateForm.applFailureDt, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                    this.discSignOperateForm.discInBankNo = obj.discInBankNo;
                    this.discSignOperateForm.discInBrchNo = obj.discInBrchNo;
                    this.discSignOperateForm.discInBrchName = obj.discInBrchName;
                    this.discSignOperateForm.custArea = obj.custArea;
                    this.discSignOperateForm.isBargain = obj.isBargain;
                    this.isBargainChange(this.discSignOperateForm.isBargain);
                    this.discSignOperateForm.bargainAuditBrchNo = obj.bargainAuditBrchNo;
                    this.discSignOperateForm.custMgrNo = obj.custMgrNo;
                    this.discSignOperateForm.custMgrName = obj.custMgrName;
                    this.discSignOperateForm.isLimitFdiscSum = obj.isLimitFdiscSum;
                    this.isLimitFdiscSumChange(this.discSignOperateForm.isLimitFdiscSum);
                    this.discSignOperateForm.industryCategory = obj.industryCategory;
                    this.discSignOperateForm.industryCategoryName = obj.industryCategoryName;
                    if (!!obj.checkRemark) {
                      this.isReAccept = true;
                    } else {
                      this.isReAccept = false;
                    }
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            } else if (this.signParams.optType === "edit") {
              this.discSignOperateForm.applActiveDt = this.signParams.currentSelectRow.applActiveDt;
              if (!!this.discSignOperateForm.applActiveDt) {
                this.discSignOperateForm.applActiveDt = this.$moment(this.discSignOperateForm.applActiveDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.discSignOperateForm.applFailureDt = this.signParams.currentSelectRow.applFailureDt;
              if (!!this.discSignOperateForm.applFailureDt) {
                this.discSignOperateForm.applFailureDt = this.$moment(this.discSignOperateForm.applFailureDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.discSignOperateForm.actualActiveDt = this.signParams.currentSelectRow.actualActiveDt;
              if (!!this.discSignOperateForm.actualActiveDt) {
                this.discSignOperateForm.actualActiveDt = this.$moment(this.discSignOperateForm.actualActiveDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.discSignOperateForm.actualFailureDt = this.signParams.currentSelectRow.actualFailureDt;
              if (!!this.discSignOperateForm.actualFailureDt) {
                this.discSignOperateForm.actualFailureDt = this.$moment(this.discSignOperateForm.actualFailureDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.discSignOperateForm.adjustRate = this.signParams.currentSelectRow.adjustRate == null ? "" : formatNumber(accMul(this.signParams.currentSelectRow.adjustRate, 100), 4, ",");
              this.discSignOperateForm.bargainRate = this.signParams.currentSelectRow.bargainRate == null ? "0.0000" : formatNumber(accMul(this.signParams.currentSelectRow.bargainRate, 100), 4, ",");
              this.discSignOperateForm.limitAmt = formatNumber(this.signParams.currentSelectRow.limitAmt, 2, ",");
              this.discSignOperateForm.discInBankNo = this.signParams.currentSelectRow.discInBankNo;
              this.discSignOperateForm.discInBrchNo = this.signParams.currentSelectRow.discInBrchNo;
              this.discSignOperateForm.discInBrchName = this.signParams.currentSelectRow.discInBrchName;
              this.discSignOperateForm.custArea = this.signParams.currentSelectRow.custArea;
              this.discSignOperateForm.isBargain = this.signParams.currentSelectRow.isBargain;
              this.isBargainChange(this.discSignOperateForm.isBargain);
              this.discSignOperateForm.bargainAuditBrchNo = this.signParams.currentSelectRow.bargainAuditBrchNo;
              this.discSignOperateForm.custMgrNo = this.signParams.currentSelectRow.custMgrNo;
              this.discSignOperateForm.custMgrName = this.signParams.currentSelectRow.custMgrName;
              this.discSignOperateForm.industryCategory = this.signParams.currentSelectRow.industryCategory;
              this.discSignOperateForm.isLimitFdiscSum = this.signParams.currentSelectRow.isLimitFdiscSum;
              this.discSignOperateForm.acceptRemark = this.signParams.currentSelectRow.acceptRemark;
              this.isLimitFdiscSumChange(this.discSignOperateForm.isLimitFdiscSum);
              this.getDictValue();
            } else if (this.signParams.optType === "check") {
              post({ id: this.signParams.currentSelectRow.id }, this.signInfoUrl).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    let obj = res.data.retData;
                    this.discSignOperateForm.activeDt = obj.activeDt;
                    if (!!this.discSignOperateForm.activeDt) {
                      this.discSignOperateForm.activeDt = this.$moment(this.discSignOperateForm.activeDt, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                    this.discSignOperateForm.failureDt = obj.failureDt;
                    if (!!this.discSignOperateForm.failureDt) {
                      this.discSignOperateForm.failureDt = this.$moment(this.discSignOperateForm.failureDt, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                    this.discSignOperateForm.adjustRate = obj.adjustRate == null ? "" : formatNumber(accMul(obj.adjustRate, 100), 4, ",");
                    this.discSignOperateForm.limitAmt = formatNumber(obj.limitAmt, 2, ",");
                    this.discSignOperateForm.discInBankNo = obj.discInBankNo;
                    this.discSignOperateForm.discInBrchNo = obj.discInBrchNo;
                    this.discSignOperateForm.discInBrchName = obj.discInBrchName;
                    this.discSignOperateForm.custArea = obj.custArea;
                    this.discSignOperateForm.isBargain = obj.isBargain;
                    this.isBargainChange("check");
                    this.discSignOperateForm.isLimitFdiscSum = obj.isLimitFdiscSum;
                    this.isLimitFdiscSumChange("check");
                    this.discSignOperateForm.bargainAuditBrchNo = obj.bargainAuditBrchNo;
                    this.discSignOperateForm.custMgrNo = obj.custMgrNo;
                    this.discSignOperateForm.custMgrName = obj.custMgrName;
                    this.discSignOperateForm.acceptRemark = obj.acceptRemark;
                    this.discSignOperateForm.operTypeName = obj.operTypeName;
                    this.discSignOperateForm.operResult = obj.operResult;
                    this.discSignOperateForm.operRemark = obj.operRemark;
                    this.discSignOperateForm.checkRemark = obj.checkRemark;
                    this.discSignOperateForm.applDt = obj.applDt;
                    this.discSignOperateForm.industryCategory = obj.industryCategory;
                    this.discSignOperateForm.industryCategoryName = obj.industryCategoryName;
                    if (!!this.discSignOperateForm.applDt) {
                      this.discSignOperateForm.applDt = this.$moment(this.discSignOperateForm.applDt, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                    if (this.discSignOperateForm.operTypeName === "修改签约信息") {
                      //查询修改前签约信息
                      this.getBeforeDiscSignInfo();
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
        }
      }
    },
    methods: {
      //查询修改前签约信息
      getBeforeDiscSignInfo(){
        post({ id: this.signParams.currentSelectRow.id }, this.updateSignUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let data = res.data.retData;
              let adjustRate = data.adjustRate == null ? "" : formatNumber(accMul(data.adjustRate, 100), 4, ",");
              if (!!data.adjustRate.toString() && adjustRate !== this.discSignOperateForm.adjustRate) {
                this.beforeDiscSignForm.adjustRate = adjustRate;
              }
              let limitAmt = formatNumber(data.limitAmt, 2, ",").replace(/,/g, "");
              if (!!data.limitAmt && limitAmt !== this.discSignOperateForm.limitAmt) {
                this.beforeDiscSignForm.limitAmt = limitAmt;
              }
              if (!!data.discInBrchName && data.discInBrchName !== this.discSignOperateForm.discInBrchName) {
                this.beforeDiscSignForm.discInBrchName = data.discInBrchName;
              }
              if (!!data.custArea && data.custArea !== this.discSignOperateForm.custArea) {
                this.beforeDiscSignForm.custArea = this.getDictValueFromMap(this.signParams.dictMap, "CustArea", data.custArea);
              }
              if (!!data.isBargain && data.isBargain !== this.discSignOperateForm.isBargain) {
                this.beforeDiscSignForm.isBargain = this.getDictValueFromMap(this.signParams.dictMap, "Yon", data.isBargain);
              }
              if (!!data.isLimitFdiscSum && data.isLimitFdiscSum !== this.discSignOperateForm.isLimitFdiscSum) {
                this.beforeDiscSignForm.isLimitFdiscSum = this.getDictValueFromMap(this.signParams.dictMap, "Yon", data.isLimitFdiscSum);
              }
              if (!!data.custMgrNo && data.custMgrNo !== this.discSignOperateForm.custMgrNo) {
                this.beforeDiscSignForm.custMgrNo = data.custMgrNo;
              }
              if (!!data.custMgrName && data.custMgrName !== this.discSignOperateForm.custMgrName) {
                this.beforeDiscSignForm.custMgrName = data.custMgrName;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      discSignOperateFormReset() {
        this.$refs.discSignOperateForm.resetFields(true);
        this.discSignOperateForm = {
          id: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          signBrchName: "",
          operFlag: "",
          activeDt: "",
          failureDt: "",
          applActiveDt: "",
          applFailureDt: "",
          actualActiveDt: "",
          actualFailureDt: "",
          adjustRate: "",
          limitAmt: "",
          usedLimitAmt:"",
          discInBankNo: "",
          discInBrchNo: "",
          discInBrchName: "",
          custArea: "",
          isBargain: "",
          bargainRate:"",
          bargainAuditBrchNo: "",
          custMgrNo: "",
          custMgrName: "",
          acceptRemark: "",
          operTypeName: "",
          operResult: "",
          operRemark: "",
          checkRemark: "",
          applDt: "",
          industryCategory:"",
          industryCategoryName:"",
          channelNo: "",
          channelName: "",
          isLimitFdiscSum: "",
          everydayFdiscSum: "",
          everydayUsedSum: "",
          signMode: "",
          socCode: "",
          dataSource: ""
        };
        // this.discSignOperateForm.id = "";
        // this.discSignOperateForm.custNo = "";
        // this.discSignOperateForm.custName = "";
        // this.discSignOperateForm.custAcctNo = "";
        // this.discSignOperateForm.signBrchName = "";
        // this.discSignOperateForm.operFlag = "";
        // this.discSignOperateForm.activeDt = "";
        // this.discSignOperateForm.failureDt = "";
        // this.discSignOperateForm.adjustRate = "";
        // this.discSignOperateForm.limitAmt = "";
        // this.discSignOperateForm.discInBankNo = "";
        // this.discSignOperateForm.discInBrchNo = "";
        // this.discSignOperateForm.discInBrchName = "";
        // this.discSignOperateForm.custArea = "";
        // this.discSignOperateForm.isBargain = "";
        // this.discSignOperateForm.bargainAuditBrchNo = "";
        // this.discSignOperateForm.custMgrNo = "";
        // this.discSignOperateForm.custMgrName = "";
        // this.discSignOperateForm.acceptRemark = "";
        // this.discSignOperateForm.operTypeName = "";
        // this.discSignOperateForm.operResult = "";
        // this.discSignOperateForm.operRemark = "";
        // this.discSignOperateForm.checkRemark = "";
        // this.discSignOperateForm.applDt = "";
        // this.discSignOperateForm.industryCategory = "";
        // this.discSignOperateForm.industryCategoryName = "";
        // this.discSignOperateForm.everydayFdiscSum = "";
        // this.discSignOperateForm.everydayUsedSum = "";
        // this.discSignOperateForm.signBrchNo = "";
        // this.discSignOperateForm.signMode = "";
        // this.discSignOperateForm.socCode = "";
        // this.discSignOperateForm.dataSource = "";
        // this.discSignOperateForm.channelName = "";
        if (this.signParams.optType === "check") {
          this.beforeDiscSignForm.adjustRate = "";
          this.beforeDiscSignForm.limitAmt = "";
          this.beforeDiscSignForm.discInBrchName = "";
          this.beforeDiscSignForm.custArea = "";
          this.beforeDiscSignForm.isBargain = "";
          this.beforeDiscSignForm.custMgrNo = "";
          this.beforeDiscSignForm.custMgrName = "";
        }
      },
      //关闭弹窗
      handleClose() {
        this.discSignOperateFormReset();
        this.$emit("discSignOperateWinClose", "");
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = true;
      },
      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = false;
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
      queryDetailName() {
        post({code : "IndustryCategoryDetail"}, "/sm/config/dictionary/getIndustyDetailDict").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.expandTree(data);
            this.indTreeData = data;
          }
          this.dictNameSelectWin = true;
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      indNameAdd() {
        let arr = this.$refs["indTreeData"].getSelectedNodes();
        if(arr[0].id.length < 5){
          this.$msgTip.error(this, { info: "请选择具体行业投向！" });
          return;
        }
        this.discSignOperateForm.industryCategory = arr[0].id;
        this.discSignOperateForm.industryCategoryName = arr[0].title;
        this.dictNameSelectWin = false;
      },
      getDictValue(){
        post({dictGroupCode : "IndustryCategoryDetail", key :this.discSignOperateForm.industryCategory }, "/sm/config/dictionary/getDictValue").then(res => {
          if (res) {
            let dictValue = res.data.retMsg;
            if(dictValue == null || dictValue == "" || dictValue == undefined){
              dictValue = this.discSignOperateForm.industryCategory;
            }
            this.discSignOperateForm.industryCategoryName = dictValue;
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      synchAmt(){
        if (this.discSignOperateForm.custNo === "" || this.discSignOperateForm.custAcctNo === "" ||
          this.discSignOperateForm.custNo === null || this.discSignOperateForm.custAcctNo === null) {
          this.$msgTip.info(this, { info: "客户号和客户账号不能为空" });
          return;
        }
        //同步业务额度
        post({custNo: this.discSignOperateForm.custNo,custAcctNo: this.discSignOperateForm.custAcctNo}, "/ce/disc/elec/fastdisc/discSignMain/fun_syncLimitAmt").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.discSignOperateForm.limitAmt = res.data.retData.limitAmt;
              this.discSignOperateForm.usedLimitAmt = res.data.retData.usedLimitAmt;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.discSignOperateForm.limitAmt)) && isFinite(this.discSignOperateForm.limitAmt)) {
            this.discSignOperateForm.limitAmt = this.discSignOperateForm.limitAmt == null ? "0.00" : formatNumber(this.discSignOperateForm.limitAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.discSignOperateForm.limitAmt = this.discSignOperateForm.limitAmt.toString().replace(/,/g, "");
        }
      },
      operFlagChange(currentValue) {
        if (this.signParams.optType === "accept") {
          if (currentValue === "0") {//拒绝
            this.isRefuse = false;
            if (!this.isReAccept) {
              //初始化受理签约同意时展示项数据
              this.initAcceptSignInfo();
            }
          } else if (currentValue === "1") {//同意
            this.isRefuse = true;
            //恢复受理拒绝时清空的默认值
            this.acceptSignDefaultInfo();
            this.discSignOperateForm.acceptRemark = "";
          } else {
            this.isRefuse = null;
            this.discSignOperateForm.acceptRemark = "";
            if (!this.isReAccept) {
              this.initAcceptSignInfo();
            }
          }
        } else if (this.signParams.optType === "check") {
          if (currentValue === "0") {//拒绝
            this.isCheckRefuse = false;
          } else if (currentValue === "1") {//同意
            this.isCheckRefuse = true;
            this.discSignOperateForm.checkRemark = "";
          } else {
            this.isCheckRefuse = null;
            this.discSignOperateForm.checkRemark = "";
          }
        }
      },
      initAcceptSignInfo() {
        this.discSignOperateForm.activeDt = "";
        this.discSignOperateForm.failureDt = "";
        this.discSignOperateForm.bargainRate = "";
        this.discSignOperateForm.discInBrchName = "";
        this.discSignOperateForm.custArea = "";
        this.discSignOperateForm.isBargain = "";
        this.discSignOperateForm.custMgrNo = "";
        this.discSignOperateForm.custMgrName = "";
      },
      acceptSignDefaultInfo(){
        post({ id: this.signParams.currentSelectRow.id }, this.signInfoUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.discSignOperateForm.adjustRate = obj.adjustRate == null ? "0.0000" : formatNumber(accMul(obj.adjustRate, 100), 4, ",");
              this.discSignOperateForm.bargainRate = obj.bargainRate == null ? "0.0000" : formatNumber(accMul(obj.bargainRate, 100), 4, ",");
              this.discSignOperateForm.limitAmt = formatNumber(obj.limitAmt, 2, ",");
              this.discSignOperateForm.discInBrchName = obj.discInBrchName;
              this.discSignOperateForm.isBargain = obj.isBargain;
              this.isBargainChange(this.discSignOperateForm.isBargain);
              this.discSignOperateForm.isLimitFdiscSum = obj.isLimitFdiscSum;
              this.isLimitFdiscSumChange(this.discSignOperateForm.isLimitFdiscSum);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      isBargainChange(currentValue) {
        if (currentValue === "0") {//否
          this.isBargainRefuse = false;
          if (this.signParams.optType !== "edit") {
            this.discSignOperateForm.bargainRate = "0.0000";
            this.discSignOperateForm.bargainAuditBrchNo = "";
          }
        } else if (currentValue === "1") {//是
          this.isBargainRefuse = true;
        } else {
          this.isBargainRefuse = null;
        }
      },
      isLimitFdiscSumChange(currentValue) {
        if (currentValue === "0") {//否
          this.isLimitFdiscSumRefuse = false;
        } else if (currentValue === "1") {//是
          this.isLimitFdiscSumRefuse = true;
        } else {
          this.isLimitFdiscSumRefuse = null;
        }
      },

      //查询议价审批机构弹出框
      queryBargainAuditBrchNo() {
        this.showBargainAuditBrchWin = true;
      },
      showBargainAuditBrchWinClose() {
        this.showBargainAuditBrchWin = false;
      },
      //查询贴入行机构弹出框
      queryDiscInBrchNo(optType) {
        this.$parent.queryDiscInBrchNo(optType);
      },
      //查询客户经理
      queryCustManager(optType) {
        this.$parent.queryCustManager(optType);
      },
      submitForm() {
        this.$refs["discSignOperateForm"].validate(valid => {
          if (valid) {
            if (!!this.discSignOperateForm.activeDt) {
              this.discSignOperateForm.activeDt = this.discSignOperateForm.activeDt.replace(/-/g, "");
            }
            if (!!this.discSignOperateForm.failureDt) {
              this.discSignOperateForm.failureDt = this.discSignOperateForm.failureDt.replace(/-/g, "");
            }
            if (!!this.discSignOperateForm.applActiveDt) {
              this.discSignOperateForm.applActiveDt = this.discSignOperateForm.applActiveDt.replace(/-/g, "");
            }
            if (!!this.discSignOperateForm.applFailureDt) {
              this.discSignOperateForm.applFailureDt = this.discSignOperateForm.applFailureDt.replace(/-/g, "");
            }
            if (!!this.discSignOperateForm.actualActiveDt) {
              this.discSignOperateForm.actualActiveDt = this.discSignOperateForm.actualActiveDt.replace(/-/g, "");
            }
            if (!!this.discSignOperateForm.actualFailureDt) {
              this.discSignOperateForm.actualFailureDt = this.discSignOperateForm.actualFailureDt.replace(/-/g, "");
            }
            if (!!this.discSignOperateForm.applDt) {
              this.discSignOperateForm.applDt = this.discSignOperateForm.applDt.replace(/-/g, "");
            }
            if (!!this.discSignOperateForm.limitAmt) {
              this.discSignOperateForm.limitAmt = this.discSignOperateForm.limitAmt.toString().replace(/,/g, "");
            }
            // this.discSignOperateForm.adjustRate = accDiv(this.discSignOperateForm.adjustRate, 100);
            this.submitFlag = true;
            let url = "/ce/fastdisc/sign";
            let params = {};
            if (this.signParams.optType === "accept") {
              url += "/accept";
              params = this.discSignOperateForm;
            } else if (this.signParams.optType === "edit") {
              url += "/update";
              params = this.discSignOperateForm;
            } else if (this.signParams.optType === "pause") {
              url += "/pause";
              params = {
                id: this.discSignOperateForm.id,
                acceptRemark: this.discSignOperateForm.acceptRemark
              };
            } else if (this.signParams.optType === "recovery") {
              url += "/recovery";
              params = {
                id: this.discSignOperateForm.id,
                acceptRemark: this.discSignOperateForm.acceptRemark
              };
            } else if (this.signParams.optType === "stop") {
              url += "/stop";
              params = {
                id: this.discSignOperateForm.id,
                acceptRemark: this.discSignOperateForm.acceptRemark
              };
            } else if (this.signParams.optType === "check") {
              url += "/check";
              params = {
                id: this.discSignOperateForm.id,
                operFlag: this.discSignOperateForm.operFlag,
                checkRemark: this.discSignOperateForm.checkRemark
              };
            }
            if(this.operSignUrl != null && this.operSignUrl != "" && this.operSignUrl != undefined){
              url = this.operSignUrl;
            }
            post(params, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$emit("discSignOperateSubmit", "");
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
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
