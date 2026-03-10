<template>
  <!-- 票面信息 -->
  <h-msg-box v-model="tempDiscAddBillWin" width="800" height="480" class="h-form-search-layer" :maximize="true" @on-close="handleClose" :mask-closable="false">
    <p slot="header">
      <span>票面信息</span>
    </p>
    <div>
      <h-form :model="discAddBillInfoForm" ref="discAddBillInfoForm" :label-width="68" class="h-form-search">
        <h-form-item :label="$t('m.i.billInfo.billType')"  prop="billType"  :required="isRequired" style="margin-bottom: 14px;">
          <h-select v-model="discAddBillInfoForm.billType" style="width:200px" readonly>
            <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
          </h-select>
        </h-form-item>
      </h-form>
      <h-form :model="discAddBillInfoForm" ref="discAddBillInfoForm" class="bill-info-table">
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.remitDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="remitDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="discAddBillInfoForm.remitDt"></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.billNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-col span="16">
              <h-form-item prop="billNo" :required="isRequired" :validRules="billNoRule">
                <h-input v-model="discAddBillInfoForm.billNo" :maxlength="16" :disabled="this.operType === 'modify'"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="8">
              <h-button class="export-btn" @click="importBill">{{$t("m.i.billInfo.importBill")}}</h-button>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billType==='AC01'">
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">{{$t("m.i.ce.drwr")}}</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.name")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.acctNo")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.payBankName")}}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrName" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.drwrName" :maxlength="255"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired" :validRules="acctNoRule">
                <h-input v-model="discAddBillInfoForm.drwrAcctNo" :maxlength=32 ></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.drweBankName" @on-keyup="inputDrweBankName" :maxlength="255"></h-input>
              </h-form-item>
            </h-col>
          </h-col>
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">{{$t("m.i.ce.recvMoney")}}</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.name")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.acctNo")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.acctBank")}}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeName" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.pyeeName" :maxlength="255"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired" :validRules="acctNoRule">
                <h-input v-model="discAddBillInfoForm.pyeeAcctNo" :maxlength=32 ></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.pyeeBankName" :maxlength="255"></h-input>
              </h-form-item>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billType==='AC02'">
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">{{$t("m.i.ce.payMoney")}}</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.name")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.acctNo")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.acctBank")}}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrName" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.drwrName" @on-keyup="inputDrwrName"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.drwrAcctNo"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.drweBankName"></h-input>
              </h-form-item>
            </h-col>
          </h-col>
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">{{$t("m.i.ce.recvMoney")}}</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.name")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.acctNo")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.acctBank")}}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeName" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.pyeeName"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.pyeeAcctNo"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="discAddBillInfoForm.pyeeBankName"></h-input>
              </h-form-item>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>票据金额（人民币）</p>
          </h-col>
          <h-col span="12" class-name="info-item">
            <span class="item-val" style="max-width:330px" >{{ amountWords }}</span>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="billMoney" :required="isRequired" :validRules="billMoneyRule">
			   <h-typefield type="money" v-model="discAddBillInfoForm.billMoney" placeholder="" integerNum="10"
                           @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')" bigTips></h-typefield>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billType==='AC01'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="discAddBillInfoForm.dueDt" placement="top-start"></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.drweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="bankNoRule">
              <h-input v-model="discAddBillInfoForm.drweBankNo"  @on-keyup="inputDrweBankNo" :maxlength="12"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billType==='AC01'">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.acptProtocalNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptProtocalNo">
              <h-input v-model="discAddBillInfoForm.acptProtocalNo" :maxlength="60"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.drweBankAddr")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr" :required="isRequired">
              <h-input v-model="discAddBillInfoForm.drweBankAddr" :maxlength="150" :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="discAddBillInfoForm.dueDt"></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="bankNoRule">
              <h-input v-model="discAddBillInfoForm.drweBankNo" @on-keyup="inputDrweBankNo"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.transCtrctNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="transCtrctNo">
              <h-input v-model="discAddBillInfoForm.transCtrctNo"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankAddr")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr" :required="isRequired">
              <h-input v-model="discAddBillInfoForm.drweBankAddr" :maxlength="150" :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.acptName")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptName">
              <h-input v-model="discAddBillInfoForm.acptName" :maxlength="255"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.acptBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptBankNo" :required="isRequired" :validRules="bankNoRule">
              <h-input v-model="discAddBillInfoForm.acptBankNo" :maxlength="12"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.isSameCity")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="isSameCity" :required="isRequired">
              <h-select v-model="discAddBillInfoForm.isSameCity" placeholder="" placement="top-start">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.ce.shopName")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="buyerCustName">
              <h-input v-model="discAddBillInfoForm.buyerCustName" :maxlength="255"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="rateShow">
          <h-col span="5" class-name="info-item" v-if="rateShow">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.ce.rateType")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item" v-if="rateShow">
            <h-form-item prop="rateType" :required="rateShow">
              <h-select  v-model="discAddBillInfoForm.rateType">
                <h-option v-for="item in rateTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>贴现利率
              <span v-if="this.discAddBillInfoForm.rateType === '360'">(%)</span>
              <span v-if="this.discAddBillInfoForm.rateType === '30'">(‰)</span>
              <span v-if="this.discAddBillInfoForm.rateType === '1'">(‱)</span>
            </p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="rate" :required="rateShow" :validRules="rateRule">
              <h-input v-model="discAddBillInfoForm.rate"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
      </h-form>
    </div>
    <div slot="footer">
      <close-btn @close="handleClose"></close-btn>
      <submiting-btn :submitFlag="submitFlag"></submiting-btn>
      <commit-btn :submitFlag="submitFlag" @commit="submitForm"></commit-btn>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off ,formatNumber, getDictListByGroups, getDictValueFromMap ,cmycurd ,accMul} from "@/api/bizApi/commonUtil";

  export default {
    name: "discAddBill",
    data() {
      let discAddBillInfoForm = {
          discId:"",
          batchId:"",
          billType:"",
          billClass:"ME01",
          billNo:"",
          remitDt:"",
          drwrName:"",
          drwrAcctNo:"",
          drweName:"",
          drweAcctNo:"",
          drweBankName:"",
          transCtrctNo:"",
          pyeeName:"",
          pyeeAcctNo:"",
          pyeeBankName:"",
          billMoney:"",
          dueDt:"",
          drweBankNo:"",
          acptProtocalNo:"",
          drweBankAddr:"",
          acptName:"",
          acptBankNo:"",
          isSameCity:"0",
          buyerCustName:"",
          rate:"",
          rateType:"360"
        };
      return {
        discAddBillInfoForm : discAddBillInfoForm,
        billNoRule : [{ test: validBillNo, trigger: "blur" }],
        billMoneyRule : [{ test: validBillMoney, trigger: "blur", }],
        rateRule : [{test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/, trigger:'blur', message: '利率为0~100之间的数，小数位不超过4位'}],
        bankNoRule : [{test: /^[0-9]{12}$/, trigger:'blur', message: '请输入12位数字的行号'}],
        acctNoRule: [{ test: validAcctNo, trigger: "blur" }],
        billTypeList : [],
        rateTypeList : [],
        isList : [],
        amountWords : '',
        isRequired : true,
        rateShow : false,
      };
      function validAcctNo(rule,val,callback){
        let re = /^[a-zA-Z0-9]{1,32}$/;
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，只能输入英文、数字"))
        }
      }
      function validBillNo(rule, val, callback) {
        if (discAddBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
          }
        } else if (discAddBillInfoForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
          }
        } else {
          callback(new Error("请选择票据类型"));
        }
      }
      function validBillMoney(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if(value> 0 && value<=100000000){
            discAddBillInfoForm.billMoney = formatNumber(value, 2, ",");
            callback();
          }else{
            callback(new Error("票面金额应小于等于100,000,000.00、大于0.00"));
          }
        } else {
          callback(new Error("票据金额为大于0的不超过9位的数字，且小数位不超过两位"));
        }
      }
    },
    props: {
      discAddBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      billType:"",
      operType:"",
      billId:"",
      billNo:"",
      isBillRate:"",
      submitFlag: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    watch: {
      discAddBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            if(this.isBillRate === "0"){
              this.rateShow = false;
            }
            if(this.isBillRate === "1"){
              this.rateShow = true;
            }
            this.amountWords = '';
            this.$refs.discAddBillInfoForm.resetFields();
            this.discAddBillInfoForm.billType = this.billType;
            getDictListByGroups("Yon,DraftTypeCode,RateType").then(res => {
              this.rateTypeList = res.get("RateType");
              this.isList = res.get("Yon");
              this.billTypeList = res.get("DraftTypeCode");
            });
            if(this.operType === "modify"){
              this.queryObjById();
            }
          });
        }
      },
    },

    computed: {
      tempDiscAddBillWin: {
        get() {
          return this.discAddBillWin;
        },
        set() {
        }
      },
    },
    methods: {
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.discAddBillInfoForm.billMoney)) && isFinite(this.discAddBillInfoForm.billMoney)) {
            this.amountWords = cmycurd(this.discAddBillInfoForm.billMoney);
            // this.discAddBillInfoForm.billMoney = this.discAddBillInfoForm.billMoney == null ? "0.00" : formatNumber(this.discAddBillInfoForm.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.discAddBillInfoForm.billMoney = this.discAddBillInfoForm.billMoney.toString().replace(/,/g, "");
        }
      },
      billMoneyChange(){
        this.amountWords = cmycurd(this.discAddBillInfoForm.billMoney);
        this.discAddBillInfoForm.billMoney = formatNumber(this.discAddBillInfoForm.billMoney, 2, ',');
      },
      handleClose() {
        // this.$refs.discAddBillInfoForm.resetFields();
        this.initBillInfo("");
        this.$emit("discAddBillWinClose", "");
      },
      submitForm() {
        this.$refs["discAddBillInfoForm"].validate(valid => {
          if (valid) {
            this.$emit("discAddBillChange", this.discAddBillInfoForm);
          }
        })
      },
      //根据批次ID查询票据信息
      queryObjById(){
        let discId = this.billId;
        post({discId:discId},"/ce/disc/paper/apply/discApplyBatchMain/func_getPaperDiscBillInfo").then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              let obj = res.data.retData;
              if (obj !== null) {
                this.copyBillInfo(obj, "query");
              } else {
                this.$msgTip.info(this, { info: "未找到票号" + this.discAddBillInfoForm.billNo + "的相关信息！" });
                this.initBillInfo(this.discAddBillInfoForm.billNo);
              }
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg});
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //导入按钮
      importBill(){
        if(this.discAddBillInfoForm.billNo === ""){
          this.$msgTip.info(this, { info: "请先输入票据号码" });
          return;
        }
        let billNo = this.discAddBillInfoForm.billNo;
        let flag = this.validBillNo(this.discAddBillInfoForm.billNo);
        if (flag) {
          post({billNo:billNo},"/ce/disc/paper/apply/discApplyBatchMain/func_getPaperBillInfo").then(res => {
            if(res){
              let retCode = res.data.retCode;
              if(retCode==="000000"){
                let obj = res.data.retData;
                if (obj !== null) {
                  this.copyBillInfo(obj, "import");
                } else {
                  this.$msgTip.info(this, { info: "未找到票号" + this.discAddBillInfoForm.billNo + "的相关信息！" });
                  this.initBillInfo(this.discAddBillInfoForm.billNo);
                }
                // this.discAddBillInfoForm.billType = obj.billType;
                // this.discAddBillInfoForm.billNo = obj.billNo;
                // if(obj.remitDt != null && obj.remitDt !== ""){
                //   this.discAddBillInfoForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
                // }
                // this.discAddBillInfoForm.drwrName = obj.drwrName;
                // this.discAddBillInfoForm.drwrAcctNo = obj.drwrAcctNo;
                // this.discAddBillInfoForm.drweName = obj.drweName;
                // this.discAddBillInfoForm.drweAcctNo = obj.drweAcctNo;
                // this.discAddBillInfoForm.drweBankName = obj.drweBankName;
                // this.discAddBillInfoForm.transCtrctNo = obj.transCtrctNo;
                // this.discAddBillInfoForm.pyeeName = obj.pyeeName;
                // this.discAddBillInfoForm.pyeeAcctNo = obj.pyeeAcctNo;
                // this.discAddBillInfoForm.pyeeBankName = obj.pyeeBankName;
                // this.amountWords = cmycurd(obj.billMoney);
                // this.discAddBillInfoForm.billMoney = formatNumber(obj.billMoney, 2, ',');
                // if(obj.dueDt != null && obj.dueDt !== ""){
                //   this.discAddBillInfoForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                // }
                // this.discAddBillInfoForm.drweBankNo = obj.drweBankNo;
                // this.discAddBillInfoForm.acptProtocalNo = obj.acptProtocalNo;
                // this.discAddBillInfoForm.drweBankAddr = obj.drweBankAddr;
                // this.discAddBillInfoForm.acptName = obj.acptName;
                // this.discAddBillInfoForm.acptBankNo = obj.acptBankNo;
                // this.discAddBillInfoForm.isSameCity = obj.isSameCity;
                // this.discAddBillInfoForm.buyerCustName = obj.buyerCustName;
                // this.discAddBillInfoForm.rateType = obj.rateType;
                // if(obj.rateType === "360" ){
                //   this.discAddBillInfoForm.rate = accMul(obj.rate,100);
                // }
                // if(obj.rateType === "30" ){
                //   this.discAddBillInfoForm.rate = accMul(obj.rate,1000);
                // }
                // if(obj.rateType === "1" ){
                //   this.discAddBillInfoForm.rate = accMul(obj.rate,10000);
                // }
              }else{
                this.$msgTip.error(this,{info:res.data.retMsg});
              }
            }else{
              this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
            }
          });
        }
      },
      //票据导入前校验
      validBillNo(billNo) {
        let flag = false;
        if (this.discAddBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        } else if (this.discAddBillInfoForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        }
        return flag;
      },
      copyBillInfo(obj, type){
        if (type === "query") {
          this.discAddBillInfoForm.id = obj.id;
        }
        this.discAddBillInfoForm.billType = obj.billType;
        this.discAddBillInfoForm.billNo = obj.billNo;
        if(obj.remitDt != null && obj.remitDt !== ""){
          this.discAddBillInfoForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.discAddBillInfoForm.drwrName = obj.drwrName;
        this.discAddBillInfoForm.drwrAcctNo = obj.drwrAcctNo;
        this.discAddBillInfoForm.drweName = obj.drweName;
        this.discAddBillInfoForm.drweAcctNo = obj.drweAcctNo;
        this.discAddBillInfoForm.drweBankName = obj.drweBankName;
        this.discAddBillInfoForm.transCtrctNo = obj.transCtrctNo;
        this.discAddBillInfoForm.pyeeName = obj.pyeeName;
        this.discAddBillInfoForm.pyeeAcctNo = obj.pyeeAcctNo;
        this.discAddBillInfoForm.pyeeBankName = obj.pyeeBankName;
        this.amountWords = cmycurd(obj.billMoney);
        this.discAddBillInfoForm.billMoney = formatNumber(obj.billMoney, 2, ',');
        if(obj.dueDt != null && obj.dueDt !== ""){
          this.discAddBillInfoForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.discAddBillInfoForm.drweBankNo = obj.drweBankNo;
        this.discAddBillInfoForm.acptProtocalNo = obj.acptProtocalNo;
        this.discAddBillInfoForm.drweBankAddr = obj.drweBankAddr;
        this.discAddBillInfoForm.acptName = obj.acptName;
        this.discAddBillInfoForm.acptBankNo = obj.acptBankNo;
        this.discAddBillInfoForm.isSameCity = obj.isSameCity;
        this.discAddBillInfoForm.buyerCustName = obj.buyerCustName;
        this.discAddBillInfoForm.rateType = obj.rateType;
        if(obj.rate.toString() === "0") {
          this.discAddBillInfoForm.rate = "0";
        }else {
          if(obj.rateType === "360" ){
            this.discAddBillInfoForm.rate = accMul(obj.rate,100);
          }
          if(obj.rateType === "30" ){
            this.discAddBillInfoForm.rate = accMul(obj.rate,1000);
          }
          if(obj.rateType === "1" ){
            this.discAddBillInfoForm.rate = accMul(obj.rate,10000);
          }
        }
      },
      initBillInfo(billNo){
        this.discAddBillInfoForm.id = "";
        this.discAddBillInfoForm.billId = "";
        this.discAddBillInfoForm.billNo = billNo;
        this.discAddBillInfoForm.remitDt = "";
        this.discAddBillInfoForm.drwrName = "";
        this.discAddBillInfoForm.drwrAcctNo = "";
        this.discAddBillInfoForm.drweBankName = "";
        this.discAddBillInfoForm.pyeeName = "";
        this.discAddBillInfoForm.pyeeAcctNo = "";
        this.discAddBillInfoForm.pyeeBankName = "";
        this.amountWords = "";
        this.discAddBillInfoForm.billMoney = "";
        this.discAddBillInfoForm.dueDt = "";
        this.discAddBillInfoForm.drweBankNo = "";
        this.discAddBillInfoForm.drweBankAddr = "";
        this.discAddBillInfoForm.acptProtocalNo = "";
        this.discAddBillInfoForm.transCtrctNo = "";
        this.discAddBillInfoForm.acptName = "";
        this.discAddBillInfoForm.acptBankNo = "";
      },
      inputDrweBankName(){
          //银票承兑人默认为付款行
          this.discAddBillInfoForm.acptName = this.discAddBillInfoForm.drweBankName;
      },
      inputDrwrName(){
        //商票承兑人默认出票人
        this.discAddBillInfoForm.acptName = this.discAddBillInfoForm.drwrName;
      },
      inputDrweBankNo(){
        this.discAddBillInfoForm.acptBankNo = this.discAddBillInfoForm.drweBankNo;
      }
    },
  };
</script>

<style scoped>

</style>
