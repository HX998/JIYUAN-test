<template>
  <!-- 票面信息 -->
  <h-msg-box v-model="tempAddBillWin" width="800" height="480" class="h-form-search-layer" :maximize="true"
             @on-close="handleClose" top="10">
    <p slot="header">
      <span>票面信息</span>
    </p>
    <div>
      <h-form :model="impawnAddBillInfoForm" ref="impawnAddBillInfoForm" :label-width="68" class="h-form-search">
        <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired" style="margin-bottom: 14px;">
          <h-select v-model="impawnAddBillInfoForm.billType" style="width:200px" readonly>
            <h-option v-for="item in impawnBillInfoParams.billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
          </h-select>
        </h-form-item>
      </h-form>
      <h-form :model="impawnAddBillInfoForm" ref="impawnAddBillInfoForm" class="bill-info-table">
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.remitDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="remitDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="impawnAddBillInfoForm.remitDt" showFormat :editable=false></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.billNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-col span="16">
              <h-form-item prop="billNo" :required="isRequired" :validRules="billNoRule">
                <h-input v-model="impawnAddBillInfoForm.billNo" :maxlength=16 :readonly="impawnBillInfoParams.billOptType === 'modify'" placeholder=""></h-input>
              </h-form-item>
            </h-col>
            <h-col span="8">
              <h-button class="export-btn" @click="importBill">{{$t("m.i.billInfo.importBill")}}</h-button>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.impawnBillInfoParams.billType==='AC01'">
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
                <p class="label"><span class="required-icon">*</span>付款行名称</p>
              </h-col>
            </h-col>
          </h-col>
          <h-col span="7">
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrName" :required="isRequired">
                <h-input v-model="impawnAddBillInfoForm.drwrName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired">
                <h-input v-model="impawnAddBillInfoForm.drwrAcctNo" :maxlength=35></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="impawnAddBillInfoForm.drweBankName" @on-keyup="inputDrweBankName" :maxlength=125></h-input>
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
                <h-input v-model="impawnAddBillInfoForm.pyeeName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired">
                <h-input v-model="impawnAddBillInfoForm.pyeeAcctNo" :maxlength=35></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="impawnAddBillInfoForm.pyeeBankName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.impawnBillInfoParams.billType==='AC02'">
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
                <h-input v-model="impawnAddBillInfoForm.drwrName" @on-keyup="inputDrwrName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drwrAcctNo" :required="isRequired">
                <h-input v-model="impawnAddBillInfoForm.drwrAcctNo" :maxlength=35></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="drweBankName" :required="isRequired">
                <h-input v-model="impawnAddBillInfoForm.drweBankName" :maxlength=125></h-input>
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
                <h-input v-model="impawnAddBillInfoForm.pyeeName" :maxlength=125></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeAcctNo" :required="isRequired">
                <h-input v-model="impawnAddBillInfoForm.pyeeAcctNo" :maxlength=35></h-input>
              </h-form-item>
            </h-col>
            <h-col span="24" class-name="info-item">
              <h-form-item prop="pyeeBankName" :required="isRequired">
                <h-input v-model="impawnAddBillInfoForm.pyeeBankName" :maxlength=125></h-input>
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
            <h-form-item prop="billMoney" :required="isRequired">
              <h-typefield type="money" v-model="impawnAddBillInfoForm.billMoney" :maxlength="20" placeholder="" bigTips @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')"></h-typefield>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.impawnBillInfoParams.billType==='AC01'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="impawnAddBillInfoForm.dueDt" showFormat :editable=false></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.drweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="drweBankNoRule">
              <h-input v-model="impawnAddBillInfoForm.drweBankNo" @on-keyup="inputDrweBankNo" :maxlength=12 placeholder="12位数字"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.impawnBillInfoParams.billType==='AC01'">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.acptProtocalNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptProtocalNo">
              <h-input v-model="impawnAddBillInfoForm.acptProtocalNo" :maxlength=60></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.drweBankAddr")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr" :required="isRequired" >
              <h-input v-model="impawnAddBillInfoForm.drweBankAddr" :maxlength="150" :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.impawnBillInfoParams.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="dueDt" :required="isRequired">
              <h-date-picker type="date" placeholder="" v-model="impawnAddBillInfoForm.dueDt" showFormat :editable=false></h-date-picker>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankNo" :required="isRequired" :validRules="drweBankNoRule">
              <h-input v-model="impawnAddBillInfoForm.drweBankNo" @on-keyup="inputDrweBankNo" :maxlength=12 placeholder="12位数字"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top" v-if="this.impawnBillInfoParams.billType==='AC02'">
          <h-col span="5" class-name="info-item">
            <p class="label">{{$t("m.i.billInfo.transCtrctNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="transCtrctNo">
              <h-input v-model="impawnAddBillInfoForm.transCtrctNo" :maxlength=60></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.corpDrweBankAddr")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="drweBankAddr" :required="isRequired">
              <h-input v-model="impawnAddBillInfoForm.drweBankAddr" :maxlength="150" :lengthByByte="false"></h-input>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row type="flex" justify="center" align="top">
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.acptName")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptName" :required="isRequired">
              <h-input v-model="impawnAddBillInfoForm.acptName" :maxlength=125></h-input>
            </h-form-item>
          </h-col>
          <h-col span="5" class-name="info-item">
            <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.acptBankNo")}}</p>
          </h-col>
          <h-col span="7" class-name="info-item">
            <h-form-item prop="acptBankNo" :required="isRequired" :validRules="drweBankNoRule">
              <h-input v-model="impawnAddBillInfoForm.acptBankNo" :maxlength="12" placeholder="12位数字"></h-input>
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
  import {
    post,
    on,
    off,
    formatNumber,
    cmycurd
  } from "@/api/bizApi/commonUtil";

export default {
    name: "impawnBillInfo",
    data() {
      return {
        impawnAddBillInfoForm: {
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
          acptBankNo: "",
          custNo: "",
        },
        amountWords: "",
        isRequired: true,
        billNoRule: [{ test: this.validBillNoRule, trigger: "blur" }],
        drweBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "由12位数字组成" }]
      }
    },
    props: {
      impawnAddBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      impawnBillInfoParams: {
        type: Object,
        default: {
          billOptType: "",
          billType: "",
          billId: "",
          billNo: "",
          dictMap: new Map(),
          billTypeList: [],
          batchId: "",
          commitUrl: "",
          impawnId: "",
          custNo: "",
        }
      }
    },
    watch: {
      impawnAddBillWin(val) {
        if (val === true) {
          this.initBillInfo("");
          this.amountWords = "";
          this.impawnAddBillInfoForm.billType = this.impawnBillInfoParams.billType;
          if (this.impawnBillInfoParams.billOptType === "modify") {
            this.queryObjById();
          }
        }
      }
    },
    computed: {
      tempAddBillWin: {
        get() {
          return this.impawnAddBillWin;
        },
        set() {
        }
      },
      billNoPlaceholder() {
        return this.impawnAddBillInfoForm.billType === "AC01" ? "银票号码为16位数字,第四位为0,第七位为5" : "商票号码为16位数字,第四位为0,第七位为6";
      }
    },
    methods: {
      validBillNoRule(rule, val, callback) {
        if (this.impawnAddBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
          }
        } else if (this.impawnAddBillInfoForm.billType === "AC02") {
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
        //post({ id: this.impawnBillInfoParams.billId }, "/pc/btrc/common/getBaseBillInfo").then(res => {
        post({ billId: this.impawnBillInfoParams.billId }, "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_getPaperBillInfo").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              if (obj !== null) {
                this.copyBillInfo(obj, "query");
              } else {
                this.$msgTip.info(this, { info: "未找到票号" + this.impawnBillInfoParams.billNo + "的相关信息！" });
                this.initBillInfo(this.impawnBillInfoParams.billNo);
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
          if (!isNaN(parseFloat(this.impawnAddBillInfoForm.billMoney)) && isFinite(this.impawnAddBillInfoForm.billMoney)) {
            this.amountWords = cmycurd(this.impawnAddBillInfoForm.billMoney);
            this.impawnAddBillInfoForm.billMoney = this.impawnAddBillInfoForm.billMoney == null ? "0.00" : formatNumber(this.impawnAddBillInfoForm.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.impawnAddBillInfoForm.billMoney = this.impawnAddBillInfoForm.billMoney.toString().replace(/,/g, "");
        }
      },
      handleClose() {
        this.initBillInfo("");
        this.$refs.impawnAddBillInfoForm.resetFields();
        this.$emit("impawnAddBillWinClose", "");
      },
      submitForm() {
        this.$refs["impawnAddBillInfoForm"].validate(valid => {
          if (valid) {
            this.impawnAddBillInfoForm.batchId = this.impawnBillInfoParams.batchId;
            this.impawnAddBillInfoForm.impawnId = this.impawnBillInfoParams.impawnId;
            this.impawnAddBillInfoForm.remitDt = this.$moment(this.impawnAddBillInfoForm.remitDt).format("YYYYMMDD");
            this.impawnAddBillInfoForm.dueDt = this.$moment(this.impawnAddBillInfoForm.dueDt).format("YYYYMMDD");
            this.impawnAddBillInfoForm.billMoney = this.impawnAddBillInfoForm.billMoney.replace(/,/g, "");
            this.impawnAddBillInfoForm.custNo = this.impawnBillInfoParams.custNo;
            if (this.impawnAddBillInfoForm.remitDt > this.impawnAddBillInfoForm.dueDt) {
              this.$msgTip.info(this, { info: "出票日期必须小于汇票到期日" });
              return;
            }
            let remitDt = this.impawnAddBillInfoForm.remitDt.replace(/-/g, "");
            if(remitDt >  window.sessionStorage.getItem("workDate") ){
              this.$msgTip.info(this, { info: "出票日期["+this.impawnAddBillInfoForm.remitDt+"]必须小于当前营业日["+ window.sessionStorage.getItem("workDate") +"]" });
              return;
            }
            if (this.impawnBillInfoParams.billOptType === "modify") {
              this.impawnAddBillInfoForm.id = this.impawnBillInfoParams.impawnId;
            }
            let url = this.impawnBillInfoParams.commitUrl;
            let params = this.impawnAddBillInfoForm;
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.initBillInfo("");
                  this.$refs.impawnAddBillInfoForm.resetFields();
                  this.$emit("impawnAddBillSubmit", "");
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
      //导入按钮
      importBill() {
        if (this.impawnAddBillInfoForm.billNo === "") {
          this.$msgTip.info(this, { info: "请先输入票据号码" });
        }
        let flag = this.validBillNo(this.impawnAddBillInfoForm.billNo);
        if (flag) {
          //post({ code: this.impawnAddBillInfoForm.billNo }, "/pc/btrc/common/getBillInfoByBillNo").then(res => {
          post({ billNo: this.impawnAddBillInfoForm.billNo }, "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_getPaperBillInfo").then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                if (obj !== null) {
                  this.copyBillInfo(obj, "import");
                } else {
                  this.$msgTip.info(this, { info: "未找到票号" + this.impawnAddBillInfoForm.billNo + "的相关信息！" });
                  this.initBillInfo(this.impawnAddBillInfoForm.billNo);
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
        if (this.impawnAddBillInfoForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        } else if (this.impawnAddBillInfoForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        }
        return flag;
      },
      initBillInfo(billNo) {
        this.impawnAddBillInfoForm.id = "";
        this.impawnAddBillInfoForm.billId = "";
        this.impawnAddBillInfoForm.billNo = billNo;
        this.impawnAddBillInfoForm.remitDt = "";
        this.impawnAddBillInfoForm.drwrName = "";
        this.impawnAddBillInfoForm.drwrAcctNo = "";
        this.impawnAddBillInfoForm.drweBankName = "";
        this.impawnAddBillInfoForm.pyeeName = "";
        this.impawnAddBillInfoForm.pyeeAcctNo = "";
        this.impawnAddBillInfoForm.pyeeBankName = "";
        this.amountWords = "";
        this.impawnAddBillInfoForm.billMoney = "";
        this.impawnAddBillInfoForm.dueDt = "";
        this.impawnAddBillInfoForm.drweBankNo = "";
        this.impawnAddBillInfoForm.drweBankAddr = "";
        this.impawnAddBillInfoForm.acptProtocalNo = "";
        this.impawnAddBillInfoForm.transCtrctNo = "";
        this.impawnAddBillInfoForm.acptName = "";
        this.impawnAddBillInfoForm.acptBankNo = "";
      },
      copyBillInfo(obj, type) {
        if (type === "query") {
          this.impawnAddBillInfoForm.id = obj.id;
        }
        this.impawnAddBillInfoForm.billId = obj.id;
        this.impawnAddBillInfoForm.billType = obj.billType;
        this.impawnAddBillInfoForm.billNo = obj.billNo;
        if (!!obj.remitDt) {
          this.impawnAddBillInfoForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.impawnAddBillInfoForm.drwrName = obj.drwrName;
        this.impawnAddBillInfoForm.drwrAcctNo = obj.drwrAcctNo;
        this.impawnAddBillInfoForm.drweBankName = obj.drweBankName;
        this.impawnAddBillInfoForm.pyeeName = obj.pyeeName;
        this.impawnAddBillInfoForm.pyeeAcctNo = obj.pyeeAcctNo;
        this.impawnAddBillInfoForm.pyeeBankName = obj.pyeeBankName;
        this.amountWords = cmycurd(obj.billMoney);
        this.impawnAddBillInfoForm.billMoney = formatNumber(obj.billMoney, 2, ",");
        if (!!obj.dueDt) {
          this.impawnAddBillInfoForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.impawnAddBillInfoForm.drweBankNo = obj.drweBankNo;
        this.impawnAddBillInfoForm.drweBankAddr = obj.drweBankAddr;
        this.impawnAddBillInfoForm.acptProtocalNo = obj.acptProtocalNo;
        this.impawnAddBillInfoForm.transCtrctNo = obj.transCtrctNo;
        this.impawnAddBillInfoForm.acptName = obj.acptName;
        this.impawnAddBillInfoForm.acptBankNo = obj.acptBankNo;
      },
      inputDrweBankName(){
        //银票承兑人默认为付款行
        this.impawnAddBillInfoForm.acptName = this.impawnAddBillInfoForm.drweBankName;
      },
      inputDrwrName(){
        //商票承兑人默认出票人
        this.impawnAddBillInfoForm.acptName = this.impawnAddBillInfoForm.drwrName;
      },
      inputDrweBankNo(){
        this.impawnAddBillInfoForm.acptBankNo = this.impawnAddBillInfoForm.drweBankNo;
      }
    }
  };
</script>

<style scoped>

</style>
