<!-- 票面信息 -->
<template>
  <div>
  <h-msg-box v-model="tempAddBillInfoWin" width="800" height="480" class="h-form-search-layer" :maximize="true"
             @on-close="handleClose" top="10">
    <p slot="header">
      <span>票面信息</span>
    </p>
    <div>
      <h-form :model="addBillInfoForm" ref="addBillInfoForm" :label-width="68" class="h-form-search">

        <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired"
                     style="margin-bottom: 14px;">
          <h-select v-model="addBillInfoForm.billType" style="width:200px" readonly>
            <h-option v-for="item in billInfoParams.billTypeList" :value="item.key" :key="item.key">{{ item.value }}
            </h-option>
          </h-select>
          <h-button type="primary" @click="saveCommonPyeeInfo()" style="float: right">{{"保存常用收款人信息"}}</h-button>

        </h-form-item>
      </h-form>
      <h-form :model="addBillInfoForm" ref="addBillInfoForm" class="bill-info-table">
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.remitDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="remitDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="addBillInfoForm.remitDt" showFormat
                             :editable=false :readonly="isAcptApply"></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon" v-if="!isAcptApply">*</span>{{$t("m.i.billInfo.billNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item" v-if="isAcptApply">
            <h-form-item prop="billNo">
              <h-input v-model="addBillInfoForm.billNo" :maxlength=16 readonly placeholder=""></h-input>
            </h-form-item>
          </h-col>
          <h-col span="7" class-name="info-item" v-else>
            <h-col span="16">
              <h-form-item prop="billNo" :required="isRequired" :validRules="billNoRule">
                <h-input v-model="addBillInfoForm.billNo" :maxlength=16
                         :readonly="billInfoParams.billOptType === 'modify'" placeholder=""></h-input>
              </h-form-item>
            </h-col>
            <h-col span="8">
              <h-button class="export-btn" @click="importBill">导入票据</h-button>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billInfoParams.billType==='AC01'">
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">出票人</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>全称</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>账号</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>付款行名称</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrName" :required="isRequired">
                <h-input v-model="addBillInfoForm.drwrName" :maxlength=125 :readonly="isAcptApply"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired">
                <h-input v-model="addBillInfoForm.drwrAcctNo" :maxlength=35 :readonly="isAcptApply"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="addBillInfoForm.drweBankName" @on-keyup="inputDrweBankName" :maxlength=125
                         :readonly="isAcptApply"></h-input>
              </h-form-item>
            </h-col>
          </h-col>
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">收款人</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>全称</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>账号</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>开户银行</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeName" :required="isRequired">
                <h-input v-model="addBillInfoForm.pyeeName" :maxlength=60 :lengthByByte="false" :icon="'android-search'" @on-click="queryCommonPyeeInfo()"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired" :validRules="validAcctNoRules">
                <h-input v-model="addBillInfoForm.pyeeAcctNo" :maxlength=32></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="addBillInfoForm.pyeeBankName" :maxlength=60 :lengthByByte="false"></h-input>
              </h-form-item>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billInfoParams.billType==='AC02'">
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">付款人</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>全称</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>账号</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>开户银行</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrName" :required="isRequired">
                <h-input v-model="addBillInfoForm.drwrName" @on-keyup="inputDrwrName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired">
                <h-input v-model="addBillInfoForm.drwrAcctNo" :maxlength=35></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="addBillInfoForm.drweBankName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
          </h-col>
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">收款人</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>全称</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>账号</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>开户银行</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeName" :required="isRequired">
                <h-input v-model="addBillInfoForm.pyeeName" :maxlength=60 :lengthByByte="false"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired" :validRules="validAcctNoRules">
                <h-input v-model="addBillInfoForm.pyeeAcctNo" :maxlength=32></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="addBillInfoForm.pyeeBankName" :maxlength=60 :lengthByByte="false"></h-input>
              </h-form-item>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>票据金额（人民币）</p>
          </h-col>
          <h-col span="12" class-name="info-item">
            <span class="item-val" style="max-width:330px">{{ amountWords }}</span>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="billMoney" :required="isRequired" :validRules="billMoneyRule">
              <h-typefield type="money" v-model="addBillInfoForm.billMoney" :maxlength="20" placeholder="" bigTips
                           @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')"></h-typefield>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billInfoParams.billType==='AC01'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="addBillInfoForm.dueDt" showFormat
                             :editable=false :readonly="isAcptApply&&!this.acptApplyParams.dueDtFlag"></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.drweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="drweBankNoRule">
              <h-input v-model="addBillInfoForm.drweBankNo" @on-keyup="inputDrweBankNo" :maxlength=12
                       placeholder="12位数字" :readonly="isAcptApply"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billInfoParams.billType==='AC01'">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.acptProtocalNo")}}
            </p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptProtocalNo">
              <h-input v-model="addBillInfoForm.acptProtocalNo" :maxlength=60 :readonly="isAcptApply"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon" v-if="isAcptApply">*</span>付款行地址</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr" :required="isAcptApply">
              <h-input v-model="addBillInfoForm.drweBankAddr" :maxlength=160 :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billInfoParams.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="addBillInfoForm.dueDt" showFormat
                             :editable=false :readonly="isAcptApply&&!this.acptApplyParams.dueDtFlag"></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="drweBankNoRule">
              <h-input v-model="addBillInfoForm.drweBankNo" @on-keyup="inputDrweBankNo" :maxlength=12
                       placeholder="12位数字"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billInfoParams.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.transCtrctNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="transCtrctNo">
              <h-input v-model="addBillInfoForm.transCtrctNo" :maxlength=60></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label">付款人开户行地址</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr">
              <h-input v-model="addBillInfoForm.drweBankAddr" :maxlength=250></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon" v-if="isAcptApply">*</span>承兑人全称</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptName" :required="isAcptApply">
              <h-input v-model="addBillInfoForm.acptName" :maxlength=125 :readonly="isAcptApply" :icon="this.acptApplyParams.acptBankChooseFlag?'android-search':''" @on-click="queryCpesBranch()"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.acptBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptBankNo" :required="isRequired" :validRules="drweBankNoRule">
              <h-input v-model="addBillInfoForm.acptBankNo" :maxlength="12" placeholder="12位数字"
                       :readonly="isAcptApply"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
      </h-form>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <!--<h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>-->
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>

  <show-cpes-branch :showCpesBranch="showCpesBranchWin" @showCpesBranchClose="showCpesBranchClose"
                    @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <!-- 查询机构内部户信息弹窗 -->
    <show-common-pyee-info :showCommonPyeeInfoWin="showCommonPyeeInfoWin"
                             @commonPyeeInfoSelect="commonPyeeInfoSelect" @showCommonPyeeInfoWinClose="showCommonPyeeInfoWinClose" ></show-common-pyee-info>
  </div>
</template>

<script>
import {cmycurd, formatNumber, post,getBusinessParameter} from "@/api/bizApi/commonUtil";
import ShowCommonPyeeInfo from "./showCommonPyeeInfo";

export default {
    name: "commonBillInfo",
    components: {
      ShowCommonPyeeInfo,
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
        addBillInfoForm: {
          billClass: "ME01",
          id: "",
          billId: "",
          billType: "",
          billNo: "",
          remitDt: "",
          drwrName: "",       //银票-出票人全称/商票-付款人全称
          drwrAcctNo: "",     //银票-出票人账号/商票-付款人账号
          drweBankName: "",   //银票-出票人付款行名称/商票-付款人开户银行
          pyeeName: "",
          pyeeAcctNo: "",
          pyeeBankName: "",
          billMoney: "",
          dueDt: "",
          drweBankNo: "",
          drweBankAddr: "",
          acptProtocalNo: "",
          transCtrctNo: "",
          acptName: "",
          acptBankNo: ""
        },
        amountWords: "",
        showCpesBranchWin:false,
        showCommonPyeeInfoWin:false,
        isRequired: true,
        billNoRule: [{ test: this.validBillNo, trigger: "blur" }],
        drweBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "由12位数字组成" }],
        validAcctNoRules: [{ test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "只能输入数字和字母,且长度最大为32位" }],
        billMoneyRule: [{ test: this.validBillMoney, trigger: "blur", }],
        maxPaperBillMoney:1000000
      };
    },
    props: {
      addBillInfoWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      billInfoParams: {
        type: Object,
        default: {
          billOptType: "",
          billType: "",
          billId: "",
          billNo: "",
          dictMap: new Map(),
          billTypeList: []
        }
      },
      isAcptApply: {
        type: Boolean,
        default() {
          return false;
        }
      },
      acptApplyParams: {
        type: Object,
        default: {
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
        }
      }
    },
    watch: {
      addBillInfoWin(val) {
        if (val === true) {
          this.initBillInfo("");
          if (this.isAcptApply) {
            this.addBillInfoForm.remitDt = this.acptApplyParams.remitDt;
            this.addBillInfoForm.dueDt = this.acptApplyParams.dueDt;
            this.addBillInfoForm.drwrName = this.acptApplyParams.drwrName;
            this.addBillInfoForm.drwrAcctNo = this.acptApplyParams.drwrAcctNo;
            this.addBillInfoForm.drweBankName = this.acptApplyParams.drweBankName;
            this.addBillInfoForm.drweBankNo = this.acptApplyParams.drweBankNo;
            this.addBillInfoForm.drweBankAddr = this.acptApplyParams.drweBankAddr;
            this.addBillInfoForm.acptProtocalNo = this.acptApplyParams.acptProtocalNo;
            this.addBillInfoForm.acptName = this.acptApplyParams.acptName;
            this.addBillInfoForm.acptBankNo = this.acptApplyParams.acptBankNo;
          }
          this.amountWords = "";
          this.addBillInfoForm.billType = this.billInfoParams.billType;
          if (this.billInfoParams.billOptType === "modify") {
            this.queryObjById();
          }
          this.getMaxPaperBillMoney();
        }
      }
    },
    computed: {
      tempAddBillInfoWin: {
        get() {
          return this.addBillInfoWin;
        },
        set() {
        }
      },
      billNoPlaceholder() {
        return this.addBillInfoForm.billType === "AC01" ? "银票号码为16位数字,第四位为0,第七位为5" : "商票号码为16位数字,第四位为0,第七位为6";
      }
    },
    methods: {
      validBillNo(rule, val, callback) {
        if (this.addBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
          }
        } else if (this.addBillInfoForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
          }
        } else {
          callback(new Error("请选择票据种类"));
        }
      },
      //根据明细ID查询票据明细信息
      queryObjById() {
        post({ id: this.billInfoParams.billId }, "/pc/btrc/bill/func_getBillInfoByBillId").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              if (obj !== null) {
                this.copyBillInfo(obj, "query");
              } else {
                this.$msgTip.info(this, { info: "未找到票号" + this.billInfoParams.billNo + "的相关信息！" });
                this.initBillInfo(this.billInfoParams.billNo);
              }
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
          if (!isNaN(parseFloat(this.addBillInfoForm.billMoney)) && isFinite(this.addBillInfoForm.billMoney)) {
            this.amountWords = cmycurd(this.addBillInfoForm.billMoney);
            this.addBillInfoForm.billMoney = this.addBillInfoForm.billMoney == null ? "0.00" : formatNumber(this.addBillInfoForm.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.addBillInfoForm.billMoney = this.addBillInfoForm.billMoney.toString().replace(/,/g, "");
        }
      },
      handleClose() {
        this.initBillInfo("");
        this.$refs.addBillInfoForm.resetFields();
        this.$emit("addBillInfoWinClose", "");
      },
      submitForm() {
        this.$refs["addBillInfoForm"].validate(valid => {
          if (valid) {
            this.$emit("addBillInfoSubmit", this.addBillInfoForm);
            this.$refs.addBillInfoForm.resetFields();
          }
        });
      },
      //导入按钮
      importBill() {
        if (this.addBillInfoForm.billNo === "") {
          this.$msgTip.info(this, { info: "请先输入票据号码" });
        }
        let flag = this.validBillNo(this.addBillInfoForm.billNo);
        if (flag) {
          post({ code: this.addBillInfoForm.billNo }, "/pc/btrc/common/getBillInfoByBillNo").then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                if (obj !== null) {
                  this.copyBillInfo(obj, "import");
                } else {
                  this.$msgTip.info(this, { info: "未找到票号" + this.addBillInfoForm.billNo + "的相关信息！" });
                  this.initBillInfo(this.addBillInfoForm.billNo);
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      //票据导入前校验
      validBillNo(billNo) {
        let flag = false;
        if (this.addBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        } else if (this.addBillInfoForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        }
        return flag;
      },
      initBillInfo(billNo) {
        this.addBillInfoForm.id = "";
        this.addBillInfoForm.billId = "";
        this.addBillInfoForm.billNo = billNo;
        this.addBillInfoForm.remitDt = "";
        this.addBillInfoForm.drwrName = "";
        this.addBillInfoForm.drwrAcctNo = "";
        this.addBillInfoForm.drweBankName = "";
        this.addBillInfoForm.pyeeName = "";
        this.addBillInfoForm.pyeeAcctNo = "";
        this.addBillInfoForm.pyeeBankName = "";
        this.amountWords = "";
        this.addBillInfoForm.billMoney = "";
        this.addBillInfoForm.dueDt = "";
        this.addBillInfoForm.drweBankNo = "";
        this.addBillInfoForm.drweBankAddr = "";
        this.addBillInfoForm.acptProtocalNo = "";
        this.addBillInfoForm.transCtrctNo = "";
        this.addBillInfoForm.acptName = "";
        this.addBillInfoForm.acptBankNo = "";
      },
      copyBillInfo(obj, type) {
        if (type === "query") {
          this.addBillInfoForm.id = obj.id;
        }
        this.addBillInfoForm.billId = obj.id;
        this.addBillInfoForm.billType = obj.billType;
        this.addBillInfoForm.billNo = obj.billNo;
        if (!!obj.remitDt) {
          this.addBillInfoForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.addBillInfoForm.drwrName = obj.drwrName;
        this.addBillInfoForm.drwrAcctNo = obj.drwrAcctNo;
        this.addBillInfoForm.drweBankName = obj.drweBankName;
        this.addBillInfoForm.pyeeName = obj.pyeeName;
        this.addBillInfoForm.pyeeAcctNo = obj.pyeeAcctNo;
        this.addBillInfoForm.pyeeBankName = obj.pyeeBankName;
        this.amountWords = cmycurd(obj.billMoney);
        this.addBillInfoForm.billMoney = formatNumber(obj.billMoney, 2, ",");
        if (!!obj.dueDt) {
          this.addBillInfoForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.addBillInfoForm.drweBankNo = obj.drweBankNo;
        this.addBillInfoForm.drweBankAddr = obj.drweBankAddr;
        this.addBillInfoForm.acptProtocalNo = obj.acptProtocalNo;
        this.addBillInfoForm.transCtrctNo = obj.transCtrctNo;
        this.addBillInfoForm.acptName = obj.acptName;
        this.addBillInfoForm.acptBankNo = obj.acptBankNo;
      },
      inputDrweBankName() {
        //银票承兑人默认为付款行
        this.addBillInfoForm.acptName = this.addBillInfoForm.drweBankName;
      },
      inputDrwrName() {
        //商票承兑人默认出票人
        this.addBillInfoForm.acptName = this.addBillInfoForm.drwrName;
      },
      inputDrweBankNo() {
        this.addBillInfoForm.acptBankNo = this.addBillInfoForm.drweBankNo;
      },
      validBillMoney(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if(value> 0 && value<=Number(this.maxPaperBillMoney)){
            callback();
          }else{
            callback(new Error("票面金额应小于等于"+ formatNumber(this.maxPaperBillMoney, 2, ",") +"、大于0.00"));
          }
        } else {
          callback(new Error("票面金额应小于等于"+ formatNumber(this.maxPaperBillMoney, 2, ",") +"、大于0.00的数字，且小数位不超过两位"));
        }
      },
      getMaxPaperBillMoney() {
        post({ paramKey: "pc.btrc.paper_max_billmoney_control" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData == null || res.data.retData == ''){
                this.maxPaperBillMoney = 1000000;
              }else{
                this.maxPaperBillMoney = Number(res.data.retData);
              }

            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      queryCpesBranch(){
        this.showCpesBranchWin = true;
      },

      showCpesBranchClose(){
        this.showCpesBranchWin = false;
      },

      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.info("请先选择记录！");
          return;
        }
        this.addBillInfoForm.acptBankNo = info.transBrchBankNo;
        this.addBillInfoForm.acptName = info.brchFullNameZh;
        this.addBillInfoForm.acptBankName = info.brchFullNameZh;
        this.addBillInfoForm.drweBankName = info.brchFullNameZh;
        this.addBillInfoForm.drweBankNo = info.transBrchBankNo;
        this.addBillInfoForm.drweBankAddr = info.address;
        this.showCpesBranchClose();
      },

      //选择常用收款人信息
      commonPyeeInfoSelect(info) {
        this.addBillInfoForm.pyeeName = info.pyeeName;
        this.addBillInfoForm.pyeeAcctNo = info.pyeeAcctNo;
        this.addBillInfoForm.pyeeBankName = info.pyeeBankName;
        this.showCommonPyeeInfoWin = false;
      },
      showCommonPyeeInfoWinClose(){
        this.showCommonPyeeInfoWin = false;
      },
      queryCommonPyeeInfo(){
        this.showCommonPyeeInfoWin = true;
      },
      //保存常用收款人信息
      saveCommonPyeeInfo(){
        let params = { pyeeName: this.addBillInfoForm.pyeeName,
          pyeeAcctNo: this.addBillInfoForm.pyeeAcctNo,
        pyeeBankName: this.addBillInfoForm.pyeeBankName
        }
        post(params, "/bm/cust/commonPyeeInfo/func_insertCommonPyeeInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
