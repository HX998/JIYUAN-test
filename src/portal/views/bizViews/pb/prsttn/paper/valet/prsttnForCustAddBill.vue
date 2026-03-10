<template>
  <!-- 票面信息 -->
  <h-msg-box v-model="tempValetAddBillWin" width="800" height="480" class="h-form-search-layer" :maximize="true" @on-close="handleClose" :mask-closable="false">
    <p slot="header">
      <span>票面信息</span>
    </p>
    <div>
      <h-form :model="valetAddBillInfoForm" ref="valetAddBillInfoForm" :label-width="68" class="h-form-search">
        <h-form-item :label="$t('m.i.billInfo.billType')"  prop="billType"  :required="isRequired" style="margin-bottom: 14px;">
          <h-select v-model="valetAddBillInfoForm.billType" style="width:200px" :readonly="valetAddBillInfoParams.operType === 'modify'">
            <h-option v-for="item in valetAddBillInfoParams.billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
          </h-select>
        </h-form-item>
      </h-form>
      <!--电票显示界面-->
      <h-form :model="valetAddBillInfoForm" ref="valetAddBillInfoForm" class="bill-info-table">
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.remitDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="remitDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="valetAddBillInfoForm.remitDt" :editable=false></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.billNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-col span="16">

              <h-form-item prop="billNo" :required="isRequired" :validRules="billNoRule">
                <h-input v-model="valetAddBillInfoForm.billNo" :maxlength="16" :readonly="this.valetAddBillInfoParams.operType === 'modify'"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="8">
              <h-button class="export-btn" @click="importBill">{{$t("m.i.billInfo.importBill")}}</h-button>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.valetAddBillInfoForm.billType==='AC01' || this.valetAddBillInfoForm.billType===''">
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
                <h-input v-model="valetAddBillInfoForm.drwrName" :maxlength=60 :lengthByByte="false"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired" :validRules="validAcctNoRules">
                <h-input v-model="valetAddBillInfoForm.drwrAcctNo" :maxlength=32></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="valetAddBillInfoForm.drweBankName" @on-keyup="inputDrweBankName" :maxlength=60 :lengthByByte="false"></h-input>
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
                <h-input v-model="valetAddBillInfoForm.pyeeName" :maxlength=60 :lengthByByte="false"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired" :validRules="validAcctNoRules">
                <h-input v-model="valetAddBillInfoForm.pyeeAcctNo" :maxlength=32></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="valetAddBillInfoForm.pyeeBankName" :maxlength=60 :lengthByByte="false"></h-input>
              </h-form-item>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.valetAddBillInfoForm.billType==='AC02'">
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
                <h-input v-model="valetAddBillInfoForm.drwrName" @on-keyup="inputDrwrName" :maxlength=60 :lengthByByte="false"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired" :validRules="validAcctNoRules">
                <h-input v-model="valetAddBillInfoForm.drwrAcctNo" :maxlength=32></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="valetAddBillInfoForm.drweBankName" :maxlength=60 :lengthByByte="false"></h-input>
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
                <h-input v-model="valetAddBillInfoForm.pyeeName" :maxlength=60 :lengthByByte="false"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired" :validRules="validAcctNoRules">
                <h-input v-model="valetAddBillInfoForm.pyeeAcctNo" :maxlength=32></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="valetAddBillInfoForm.pyeeBankName" :maxlength=60 :lengthByByte="false"></h-input>
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
              <h-typefield v-model="valetAddBillInfoForm.billMoney" type="money"  integerNum="10" placeholder="数字，小数位最多2位"
                       @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')" bigTips></h-typefield>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.valetAddBillInfoForm.billType==='AC01' || this.valetAddBillInfoForm.billType===''">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="valetAddBillInfoForm.dueDt" :editable=false></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.drweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="bankNoRule">
              <h-input v-model="valetAddBillInfoForm.drweBankNo" @on-keyup="inputDrweBankNo" :maxlength=12 placeholder="12位数字"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.valetAddBillInfoForm.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="valetAddBillInfoForm.dueDt" :editable=false></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="bankNoRule">
              <h-input v-model="valetAddBillInfoForm.drweBankNo" @on-keyup="inputDrweBankNo" :maxlength=12 placeholder="12位数字"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.valetAddBillInfoForm.billType==='AC01' || this.valetAddBillInfoForm.billType===''">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.acptProtocalNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptProtocalNo">
              <h-input v-model="valetAddBillInfoForm.acptProtocalNo" :maxlength=30 :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.drweBankAddr")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr" :required="isRequired">
              <h-input v-model="valetAddBillInfoForm.drweBankAddr" :maxlength=160 :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.valetAddBillInfoForm.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.transCtrctNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="transCtrctNo">
              <h-input v-model="valetAddBillInfoForm.transCtrctNo" :maxlength=30 :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankAddr")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr" :required="isRequired">
              <h-input v-model="valetAddBillInfoForm.drweBankAddr" :maxlength=160 :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex"  align="top">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.acptName")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptName">
              <h-input v-model="valetAddBillInfoForm.acptName" :maxlength=60 :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.acptBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptBankNo" :validRules="bankNoRule">
              <h-input v-model="valetAddBillInfoForm.acptBankNo" :maxlength="12" placeholder="12位数字"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
      </h-form>

    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, formatNumber, cmycurd } from "@/api/bizApi/commonUtil";

  export default {
    name: "prsttnForCustAddBill",
    data() {
      return {
        valetAddBillInfoForm : {
          discId: "",
          batchId: "",
          billType: "",
          billClass: "ME01",
          billNo: "",
          remitDt: "",
          drwrName: "",
          drwrAcctNo: "",
          drweName: "",
          drweAcctNo: "",
          drweBankName: "",
          transCtrctNo: "",
          pyeeName: "",
          pyeeAcctNo: "",
          pyeeBankName: "",
          billMoney: "",
          dueDt: "",
          drweBankNo: "",
          acptProtocalNo: "",
          drweBankAddr: "",
          acptName: "",
          custNo:"",
          custName:"",
          custAcctNo:"",
          openBrchName:"",
          openBrchNo:"",
          acptBankNo:""
        },
        billTypeList : [],
        isList : [],
        amountWords : '',
        isRequired : true,
        billNoRule : [{ test: this.validBillNo, trigger: "blur" }],
        billMoneyRule : [{ test: this.validBillMoney, trigger: "blur", }],
        bankNoRule:[{test: /^[0-9]{12}$/, trigger:'blur', message: '请输入12位数字的行号'}],
        validAcctNoRules: [{ test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "只能输入数字和字母,且长度最大为32位" }]
      }
    },
    props: {
      valetAddBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      valetAddBillInfoParams: {
        type: Object,
        default: {
          billType: "",
          operType: "",
          billId: "",
          billNo: "",
          hldrAcctNo:"",
          dictMap: new Map(),
          billTypeList: []
        }
      }
    },
    watch: {
      valetAddBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            // this.initBillInfo("");
            this.amountWords = "";
            this.$refs.valetAddBillInfoForm.resetFields();
            this.valetAddBillInfoForm.billType = this.valetAddBillInfoParams.billType;
          });
          if(this.valetAddBillInfoParams.operType === "modify"){
            this.queryObjById();
          }
        }
      },
    },
    computed: {
      tempValetAddBillWin: {
        get() {
          return this.valetAddBillWin;
        },
        set() {
        }
      },
    },
    methods: {
      validBillNo(rule, val, callback) {
        if (this.valetAddBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
          }
        } else if (this.valetAddBillInfoForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
          }
        } else {
          callback(new Error("请选择票据类型"));
        }
      },
      validBillMoney(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if(value>=0 && value<=100000000){
            this.valetAddBillInfoForm.billMoney = formatNumber(value, 2, ",");
            callback();
          }else{
            callback(new Error("票面金额最大100,000,000.00、最小为0.00"));
          }
        } else {
          callback(new Error("票据金额为大于等于0的不超过9位的数字，且小数位不超过两位"));
        }
      },
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.valetAddBillInfoForm.billMoney)) && isFinite(this.valetAddBillInfoForm.billMoney)) {
            this.amountWords = cmycurd(this.valetAddBillInfoForm.billMoney);
          }
        } else if (optType === "focus") {
          this.valetAddBillInfoForm.billMoney = this.valetAddBillInfoForm.billMoney.toString().replace(/,/g, "");
        }
      },
      handleClose() {
        this.$refs.valetAddBillInfoForm.resetFields();
        // this.initBillInfo("");
        this.$emit("valetAddBillWinClose", "");
      },
      submitForm() {
        this.$refs["valetAddBillInfoForm"].validate(valid => {
          if (valid) {
            this.$emit("valetAddBillChange", this.valetAddBillInfoForm);
          }
        })
      },
      //根据批次ID查询票据信息
      queryObjById(){
        let billId = this.valetAddBillInfoParams.billId;
        post({id:billId},"/pb/prsttn/paper/valet/pPrsttnForCustMain/func_getBillInfo").then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              let obj = res.data.retData;
              if (obj !== null) {
                this.copyBillInfo(obj, "query");
              } else {
                this.$msgTip.info(this, { info: "未找到票号" + this.valetAddBillInfoForm.billNo + "的相关信息！" });
                this.initBillInfo(this.valetAddBillInfoForm.billNo);
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
        if(this.valetAddBillInfoForm.billNo === ""){
          this.$msgTip.info(this, { info: "请先输入票据号码" });
          return
        }
        let billNo = this.valetAddBillInfoForm.billNo;
        let flag = this.validBillNoBeforeImport(this.valetAddBillInfoForm.billNo);
        if (flag) {
          post({code:billNo},"/pb/prsttn/paper/valet/pPrsttnForCustMain/func_getBillInfo").then(res => {
            if(res){
              let retCode = res.data.retCode;
              if(retCode==="000000"){
                let obj = res.data.retData;
                if (obj !== null) {
                  this.copyBillInfo(obj, "import");
                } else {
                  this.$msgTip.info(this, { info: "未找到票号" + this.valetAddBillInfoForm.billNo + "的相关信息！" });
                  this.initBillInfo(this.valetAddBillInfoForm.billNo);
                }
              }else{
                this.$msgTip.error(this,{info:res.data.retMsg});
              }
            }else{
              this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
            }
          });
        }
      },
      initBillInfo(billNo){
        this.valetAddBillInfoForm.id = "";
        this.valetAddBillInfoForm.billId = "";
        this.valetAddBillInfoForm.billNo = billNo;
        this.valetAddBillInfoForm.remitDt = "";
        this.valetAddBillInfoForm.drwrName = "";
        this.valetAddBillInfoForm.drwrAcctNo = "";
        this.valetAddBillInfoForm.drweBankName = "";
        this.valetAddBillInfoForm.pyeeName = "";
        this.valetAddBillInfoForm.pyeeAcctNo = "";
        this.valetAddBillInfoForm.pyeeBankName = "";
        this.amountWords = "";
        this.valetAddBillInfoForm.billMoney = "";
        this.valetAddBillInfoForm.dueDt = "";
        this.valetAddBillInfoForm.drweBankNo = "";
        this.valetAddBillInfoForm.drweBankAddr = "";
        this.valetAddBillInfoForm.acptProtocalNo = "";
        this.valetAddBillInfoForm.transCtrctNo = "";
        this.valetAddBillInfoForm.acptName = "";
        this.valetAddBillInfoForm.acptBankNo = "";
      },
      copyBillInfo(obj, type) {
        if (type === "query") {
          this.valetAddBillInfoForm.id = obj.id;
        }
        this.valetAddBillInfoForm.billId = obj.id;
        this.valetAddBillInfoForm.billType = obj.billType;
        this.valetAddBillInfoForm.billNo = obj.billNo;
        if (!!obj.remitDt) {
          this.valetAddBillInfoForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.valetAddBillInfoForm.drwrName = obj.drwrName;
        this.valetAddBillInfoForm.drwrAcctNo = obj.drwrAcctNo;
        this.valetAddBillInfoForm.drweBankName = obj.drweBankName;
        this.valetAddBillInfoForm.pyeeName = obj.pyeeName;
        this.valetAddBillInfoForm.pyeeAcctNo = obj.pyeeAcctNo;
        this.valetAddBillInfoForm.pyeeBankName = obj.pyeeBankName;
        this.amountWords = cmycurd(obj.billMoney);
        this.valetAddBillInfoForm.billMoney = formatNumber(obj.billMoney, 2, ",");
        if (!!obj.dueDt) {
          this.valetAddBillInfoForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.valetAddBillInfoForm.drweBankNo = obj.drweBankNo;
        this.valetAddBillInfoForm.drweBankAddr = obj.drweBankAddr;
        this.valetAddBillInfoForm.acptProtocalNo = obj.acptProtocalNo;
        this.valetAddBillInfoForm.transCtrctNo = obj.transCtrctNo;
        this.valetAddBillInfoForm.acptName = obj.acptName;
        this.valetAddBillInfoForm.acptBankNo = obj.acptBankNo;
      },
      //票据导入前校验
      validBillNoBeforeImport(billNo) {
        let flag = false;
        if (this.valetAddBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        } else if (this.valetAddBillInfoForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        }
        return flag;
      },
      inputDrweBankName(){
        //银票承兑人默认为付款行
        this.valetAddBillInfoForm.acptName = this.valetAddBillInfoForm.drweBankName;
      },
      inputDrwrName(){
        //商票承兑人默认出票人
        this.valetAddBillInfoForm.acptName = this.valetAddBillInfoForm.drwrName;
      },
      inputDrweBankNo(){
        this.valetAddBillInfoForm.acptBankNo = this.valetAddBillInfoForm.drweBankNo;
      }
    },
  };
</script>

<style scoped>

</style>
