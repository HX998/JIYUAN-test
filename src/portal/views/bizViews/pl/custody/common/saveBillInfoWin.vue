<template>
  <!-- 票面信息 -->
  <h-msg-box v-model="tempAddBillWin" width="800" height="480" class="h-form-search-layer" :maximize="true"
             @on-close="handleClose" top="10">
    <p slot="header">
      <span>票面信息</span>
    </p>
    <div>
      <h-form :model="saveAddBillInfoForm" ref="saveAddBillInfoForm" :label-width="68" class="h-form-search" onlyBlurRequire>
        <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired" style="margin-bottom: 14px;">
          <h-select v-model="saveAddBillInfoForm.billType" style="width:200px" readonly>
            <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value
              }}
            </h-option>
          </h-select>
        </h-form-item>
      </h-form>
      <h-form :model="saveAddBillInfoForm" ref="saveAddBillInfoForm" class="bill-info-table" onlyBlurRequire>
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.remitDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="remitDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="saveAddBillInfoForm.remitDt" showFormat
                             :editable=false></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.billNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-col span="16">
              <h-form-item prop="billNo" :required="isRequired" :validRules="billNoRule">
                <h-input v-model="saveAddBillInfoForm.billNo" :maxlength=16 :readonly="saveBillInfoParams.billOptType === 'modify'"
                         placeholder=""></h-input>
              </h-form-item>
            </h-col>
            <h-col span="8">
              <h-button class="export-btn" @click="importBill">{{$t("m.i.pl.importBill")}}</h-button>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.saveBillInfoParams.billType==='AC01'">
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">{{$t("m.i.billInfo.drwrName")}}</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.pl.name")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.acctNo")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.pl.payBankName")}}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrName" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.drwrName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.drwrAcctNo" :maxlength=35></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.drweBankName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
          </h-col>
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">{{$t("m.i.billInfo.pyeeName")}}</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.pl.name")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.acctNo")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankName")}}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeName" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.pyeeName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.pyeeAcctNo" :maxlength=35></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.pyeeBankName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.saveBillInfoParams.billType==='AC02'">
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">{{$t("m.i.pe.drweName")}}</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.pl.name")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.acctNo")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankName")}}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrName" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.drwrName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.drwrAcctNo" :maxlength=35></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.drweBankName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
          </h-col>
          <h-col span="5">
            <h-col span="10" class-name="info-item">
              <p class="label-multi">{{$t("m.i.billInfo.pyeeName")}}</p>
            </h-col>
            <h-col span="14">
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.pl.name")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.acctNo")}}</p>
              </h-col>
              <h-col span="24" class-name="info-item">
                <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankName")}}</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeName" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.pyeeName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.pyeeAcctNo" :maxlength=35></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="saveAddBillInfoForm.pyeeBankName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.billMoney")}}</p>
          </h-col>
          <h-col span="12" class-name="info-item">
            <span class="item-val" style="max-width:330px">{{ amountWords }}</span>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="billMoney" :required="isRequired">
              <h-typefield type="money" v-model="saveAddBillInfoForm.billMoney" :maxlength="20" placeholder="" bigTips
                           @on-blur="formatBillMoney('blur')"
                           @on-focus="formatBillMoney('focus')"></h-typefield>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.saveBillInfoParams.billType==='AC01'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="saveAddBillInfoForm.dueDt" showFormat
                             :editable=false></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.drweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="drweBankNoRule">
              <h-input v-model="saveAddBillInfoForm.drweBankNo" :maxlength=12 placeholder="12位数字"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.saveBillInfoParams.billType==='AC01'">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.acptProtocalNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptProtocalNo">
              <h-input v-model="saveAddBillInfoForm.acptProtocalNo" :maxlength=60></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.drweBankAddr")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr">
              <h-input v-model="saveAddBillInfoForm.drweBankAddr" :maxlength=250></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.saveBillInfoParams.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="saveAddBillInfoForm.dueDt" showFormat
                             :editable=false></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="drweBankNoRule">
              <h-input v-model="saveAddBillInfoForm.drweBankNo" :maxlength=12 placeholder="12位数字"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.saveBillInfoParams.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.transCtrctNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="transCtrctNo">
              <h-input v-model="saveAddBillInfoForm.transCtrctNo" :maxlength=60></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.corpDrweBankAddr")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr">
              <h-input v-model="saveAddBillInfoForm.drweBankAddr" :maxlength=250></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.acptName")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptName">
              <h-input v-model="saveAddBillInfoForm.acptName" :maxlength=125></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.acptBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptBankNo" :required="isRequired" :validRules="drweBankNoRule">
              <h-input v-model="saveAddBillInfoForm.acptBankNo" :maxlength="12" placeholder="12位数字"></h-input>
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
  import { post, on, off, formatNumber, cmycurd, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "saveBillInfoWin",
    data() {
      let saveAddBillInfoForm = {
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
        };
      return {
        saveAddBillInfoForm : saveAddBillInfoForm,
        billTypeList : [],
        dictMap : new Map(),
        amountWords : "",
        isRequired : true,
        billNoRule : [{ test: validBillNo, trigger: "blur" }],
        drweBankNoRule : [{ test: /^[0-9]{12}$/, trigger: "blur", message: "由12位数字组成" }],
      };
      function validBillNo(rule, val, callback) {
        if (saveAddBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
          }
        } else if (saveAddBillInfoForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
          }
        } else {
          callback(new Error("请选择票据种类"));
        }
      };
    },
    props: {
      saveAddBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      saveBillInfoParams: {
        type: Object,
        default: {
          billOptType: "",
          billType: "",
          billId: "",
          billNo: "",
          dictMap: new Map(),
          billTypeList: []
        }
      }
    },
    watch: {
      saveAddBillWin(val) {
        this.getDictInfo();
        if (val === true) {
          this.$nextTick(() => {
            this.initBillInfo("");
            this.saveAddBillInfoForm.billType = this.saveBillInfoParams.billType;
            if (this.saveBillInfoParams.billOptType === "modify") {
              this.queryObjById();
            }
          });
        }
      }
    },
    computed: {
      tempAddBillWin: {
        get() {
          return this.saveAddBillWin;
        },
        set() {
        }
      },
      billNoPlaceholder() {
        return this.saveAddBillInfoForm.billType === "AC01" ? "银票号码为16位数字,第四位为0,第七位为5" : "商票号码为16位数字,第四位为0,第七位为6";
      }
    },
    methods: {
      getDictInfo() {
        getDictListByGroups("DraftTypeCode").then(res => {
          this.billTypeList = res.get("DraftTypeCode");
          this.dictMap = res.get("map");
        });
      },
      //根据明细ID查询票据明细信息
      queryObjById() {
        post({ billNo: this.saveBillInfoParams.billNo }, "/pl/custody/paper/saveBill/saveBillApplyMain/func_getPaperBillInfo").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              if (obj !== null) {
                this.copyBillInfo(obj, "query");
              } else {
                this.$msgTip.info(this, { info: "未找到票号" + this.saveBillInfoParams.billNo + "的相关信息！" });
                this.initBillInfo(this.saveBillInfoParams.billNo);
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
          if (!isNaN(parseFloat(this.saveAddBillInfoForm.billMoney)) && isFinite(this.saveAddBillInfoForm.billMoney)) {
            this.amountWords = cmycurd(this.saveAddBillInfoForm.billMoney);
            this.saveAddBillInfoForm.billMoney = this.saveAddBillInfoForm.billMoney == null ? "0.00" : formatNumber(this.saveAddBillInfoForm.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.saveAddBillInfoForm.billMoney = this.saveAddBillInfoForm.billMoney.toString().replace(/,/g, "");
        }
      },
      handleClose() {
        this.initBillInfo("");
        this.$emit("saveAddBillWinClose", "");
      },
      submitForm() {
        this.$refs["saveAddBillInfoForm"].validate(valid => {
          if (valid) {
            this.$emit("saveAddBillSubmit", this.saveAddBillInfoForm);
          }
        });
      },
      //导入按钮
      importBill() {
        if (this.saveAddBillInfoForm.billNo === "") {
          this.$msgTip.info(this, { info: "请先输入票据号码" });
        }
        let flag = this.validBillNo(this.saveAddBillInfoForm.billNo);
        if (flag) {
          post({ billNo: this.saveAddBillInfoForm.billNo }, "/pl/custody/paper/saveBill/saveBillApplyMain/func_getPaperBillInfo").then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                if (obj !== null) {
                  this.copyBillInfo(obj, "import");
                } else {
                  this.$msgTip.info(this, { info: "未找到票号" + this.saveAddBillInfoForm.billNo + "的相关信息！" });
                  this.initBillInfo(this.saveAddBillInfoForm.billNo);
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
        if (this.saveAddBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        } else if (this.saveAddBillInfoForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        }
        return flag;
      },
      initBillInfo(billNo) {
        this.$refs.saveAddBillInfoForm.resetFields();
        this.saveAddBillInfoForm.billNo = billNo;
        this.amountWords = "";
      },
      copyBillInfo(obj, type) {
        if (type === "query") {
          this.saveAddBillInfoForm.id = obj.id;
        }
        this.saveAddBillInfoForm.billId = obj.id;
        this.saveAddBillInfoForm.billType = obj.billType;
        this.saveAddBillInfoForm.billNo = obj.billNo;
        if (!!obj.remitDt) {
          this.saveAddBillInfoForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.saveAddBillInfoForm.drwrName = obj.drwrName;
        this.saveAddBillInfoForm.drwrAcctNo = obj.drwrAcctNo;
        this.saveAddBillInfoForm.drweBankName = obj.drweBankName;
        this.saveAddBillInfoForm.pyeeName = obj.pyeeName;
        this.saveAddBillInfoForm.pyeeAcctNo = obj.pyeeAcctNo;
        this.saveAddBillInfoForm.pyeeBankName = obj.pyeeBankName;
        this.amountWords = cmycurd(obj.billMoney);
        this.saveAddBillInfoForm.billMoney = formatNumber(obj.billMoney, 2, ",");
        if (!!obj.dueDt) {
          this.saveAddBillInfoForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.saveAddBillInfoForm.drweBankNo = obj.drweBankNo;
        this.saveAddBillInfoForm.drweBankAddr = obj.drweBankAddr;
        this.saveAddBillInfoForm.acptProtocalNo = obj.acptProtocalNo;
        this.saveAddBillInfoForm.transCtrctNo = obj.transCtrctNo;
        this.saveAddBillInfoForm.acptName = obj.acptName;
        this.saveAddBillInfoForm.acptBankNo = obj.acptBankNo;
      }
    }
  };
</script>

<style scoped>

</style>
