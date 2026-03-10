<template>
  <!--发起追索弹出窗-->
  <h-msg-box v-model="tempRecoursesWin" width="800" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <h-form :model="formItem" :label-width="115" ref="formItem" cols="2" class="h-form-search">
        <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchName" v-if="this.formItem.licenseFlag">
          <h-input v-model="formItem.ownedBrchName" :maxlength="30" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :validRules="billNoRule" :required="isRequired">
          <h-input v-model="formItem.billNo" :maxlength="30" readonly></h-input>
        </h-form-item>
        <!--票据来源-->
        <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                       :dictList="billOriginList" :readonly="true"></common-select>
        <h-form-item :label="$t('m.i.ce.recourseType')" prop="recourseType" :required="isRequired">
          <h-select v-model="formItem.recourseType" readonly placeholder="" @on-change="recourseTypeChange" showTitle>
            <h-option v-for="item in recourseTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.bs.recourseMoneyByUnit')" prop="recourseAmt" :required="isRequired" onlyBlurRequire>
          <h-typefield type="money" bigTips v-model="formItem.recourseAmt" :maxlength="20" placeholder="数字，小数位最多2位"
                       @on-blur="formatRecourseAmt('blur')" @on-focus="formatRecourseAmt('focus')"></h-typefield>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" :required="isRequired">
          <h-input v-model="formItem.billMoney" :maxlength="20" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.recourseDt')" prop="recourseDt" :required="isRequired">
          <h-date-picker type="date" v-model="formItem.recourseDt" placeholder="" showFormat :editable=false
                         readonly></h-date-picker>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.rcvgName')" prop="rcvgName" :required="isRequired">
          <h-input v-model="formItem.rcvgName" readonly icon="android-search" @on-click="queryRecourses()"
                   :maxlength="60" clearable @on-clear="clearReceiverName()"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.rcvgAcctNo')" prop="rcvgAcctNo" :required="isRequired" :validRules="prsttnAcctNoRule">
          <h-input v-model="formItem.rcvgAcctNo" :maxlength="32"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.rcvgBankNo')" prop="rcvgBankNo"  class="h-form-long-label">
          <h-input v-model="formItem.rcvgBankNo" :maxlength="60" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.rcvgOrgCode')" prop="rcvgSocCode"  class="h-form-long-label">
          <h-input v-model="formItem.rcvgSocCode" :maxlength="10" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.recourseReasonCode')" prop="recourseReasonCode" :required="formItem.recourseType==='BC15'">
          <h-select v-model="formItem.recourseReasonCode" placeholder="" showTitle>
            <h-option v-for="item in recourseReasonCodeList" :value="item.key" :key="item.value">{{ item.value }}
            </h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.recourseRemark')" prop="recourseRemark">
          <h-input type="textarea"  v-model="formItem.recourseRemark" :canResize="false" :maxlength="256" :lengthByByte="false"></h-input>
        </h-form-item>
      </h-form>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="detailSubmitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
    <!--查询可追索对象弹出框-->
    <recourses-search-ecds :showRecoursesWin="showRecoursesWin" :recoursesParam="recoursesParam"
                           @recoursesChange="recoursesChange"
                           @showRecoursesWinlose="showRecoursesWinlose"></recourses-search-ecds>
  </h-msg-box>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "showRecourseApplyDetailEcds",
    data() {
      return {
        prsttnAcctNoRule: [{ test: /^[0-9a-zA-Z]{1,35}$/, trigger: "blur", message: "账号由不超过32位的数字或字母组成" }],
        submitFlag:false,
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        isRequired:true,
        showRecoursesWin : false,
        recoursesParam : {
          billNo: "",
          billId:"",
          hldrId:"",
          hldrBrchNo: "",
          isRecourse: "",
          ownedBrchNo:"",
          licenseFlag: this.licenseFlag,
          hldrType: "",
          hldrSocCode: "",
        },
        formItem: {
          billNo: "",
          billId: "",
          hldrId: "",
          billOrigin:"",
          billRangeStart: "",
          billRangeEnd: "",
          recourseType: "",
          recourseAmt: "",
          hldrBrchNo: "",
          billMoney: "",
          recourseDt : "",
          rcvgName: "",
          rcvgAcctNo: "",
          rcvgBankNo: "",
          rcvgSocCode: "",
          recourseReasonCode: "",
          recourseRemark: "",
          isRecourse: "",
          ownedBrchNo: "",
          ownedBrchName:"",
          cirStatus:"",
          licenseFlag: false,
          // 产品号CPES电票追索
          prodNo: "01080120",
          hldrType: "",
          hldrSocCode: "",
          transNo: "",
          applAcctNo: "",
          custNo: "",

        }
      }
    },
    props:{
      addOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "追索申请"
      },
      recourseReasonCodeList:{
        type: Array,
        default:[],
      },
      recourseTypeList:{
        type: Array,
        default:[],
      },
      billOriginList:{
        type: Array,
        default:[],
      },
      dictMap: {
        type: Map,
        default: new Map,
      },
      addForm : {
        billNo: "",
        billId: "",
        hldrId: "",
        billOrigin:"",
        recourseType: "",
        hldrBrchNo: "",
        billMoney: "",
        recourseDt : "",
        recourseReasonCode: "",
        isRecourse: "",
        ownedBrchNo: "",
        ownedBrchName: "",
        licenseFlag: false,
        transNo: "",
        applAcctNo: "",
        custNo: "",
      }
    },
    components: {
      RecoursesSearchEcds: () => import(/* webpackChunkName: "pb/recourse/elecRecourseApply/recoursesSearchEcds" */ '@/views/bizViews/pb/recourse/elecRecourseApply/recoursesSearchEcds'),
    },
    watch: {
      addOrEditWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.billNo = this.addForm.billNo;
            this.formItem.hldrId = this.addForm.hldrId;
            this.formItem.billId = this.addForm.billId;
            this.formItem.billOrigin = this.addForm.billOrigin;
            this.formItem.hldrBrchNo = this.addForm.hldrBankNo;
            this.formItem.recourseType = this.addForm.recourseType;
            this.formItem.recourseDt = this.addForm.recourseDt;
            this.formItem.billMoney = this.addForm.billMoney;
            this.formItem.recourseAmt = this.addForm.billMoney;
            this.formItem.isRecourse = this.addForm.isRecourse;
            this.formItem.ownedBrchNo = this.addForm.ownedBrchNo;
            this.formItem.ownedBrchName = this.addForm.ownedBrchName;
            this.formItem.recourseReasonCode = this.addForm.recourseReasonCode;
            this.formItem.licenseFlag = this.addForm.licenseFlag;
            this.formItem.hldrType = "1";
            this.formItem.transNo = this.addForm.transNo;
            this.formItem.applAcctNo = this.addForm.applAcctNo;
            this.formItem.custNo = this.addForm.custNo;

          });
        }
      }
    },
    computed: {
      tempRecoursesWin: {
        get() {
          return this.addOrEditWin;
        },
        set() {
        }
      }
    },
    methods:{
      //追索类型变更
      recourseTypeChange(currentValue) {
          this.formItem.recourseReasonCode = "";
      },
      formatRecourseAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.formItem.recourseAmt)) && isFinite(this.formItem.recourseAmt)) {
            this.formItem.recourseAmt = this.formItem.recourseAmt == null ? "0.00" : formatNumber(this.formItem.recourseAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.formItem.recourseAmt = this.formItem.recourseAmt.toString().replace(/,/g, "");
        }
      },
      //可追索对象弹出框
      queryRecourses() {
        this.showRecoursesWin = true;
        this.recoursesParam = {
          billNo: this.addForm.billNo,
          billId:this.addForm.billId,
          hldrId:this.addForm.hldrId,
          hldrBrchNo: this.addForm.hldrBrchNo,
          isRecourse: this.addForm.isRecourse,
          dictMap: this.dictMap,
          licenseFlag: this.licenseFlag,
          hldrType: "1",
          hldrSocCode: this.addForm.hldrSocCode
        };
      },
      clearReceiverName() {
        this.formItem.rcvgName = "";
        this.formItem.rcvgAcctNo = "";
        this.formItem.rcvgBankNo = "";
        this.formItem.rcvgSocCode = "";
      },
      handleClose() {
        this.formItem.isRecourse = "";
        this.formItem.billNo = "";
        this.formItem.billId = "";
        this.formItem.hldrId = "";
        this.$refs.formItem.resetFields();
        this.$emit("handleWinClose", "");
      },
      //根据弹框所选数据进行赋值
      recoursesChange(info) {
        this.formItem.rcvgName = info.custName;
        this.formItem.rcvgAcctNo = info.acctNo;
        this.formItem.rcvgBankNo = info.bankNo;
        this.formItem.rcvgSocCode = info.orgCode;
        this.showRecoursesWin = false;
      },
      showRecoursesWinlose() {
        this.showRecoursesWin = false;
        this.recoursesParam = {};
      },
      detailSubmitForm() {
        this.formItem.recourseAmt = this.formItem.recourseAmt.toString().replace(/,/g, "");
        this.formItem.billMoney = this.formItem.billMoney.toString().replace(/,/g, "");
        this.formItem.recourseDt = this.formItem.recourseDt.toString().replace(/-/g, "");
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let reqInfoList = [];

            let recourseInfo = {
              applyDt: this.formItem.recourseDt.toString().replace(/-/g, ""),
              reqAmt: this.formItem.recourseAmt.toString().replace(/,/g, ""),
              rcrsRsnCd: this.formItem.recourseReasonCode,
              rcvgName: this.formItem.rcvgName,
              rcvgSocCode: this.formItem.rcvgSocCode,
              rcvgBankNo: this.formItem.rcvgBankNo,
              rcvgAcctName: this.formItem.rcvgAcctName,
              rcvgAcctNo: this.formItem.rcvgAcctNo,
            }
            let reqInfo = {
              transNo: this.formItem.transNo,
              hldrId: this.formItem.hldrId,
              billId: this.formItem.billId,
              transAmt: this.formItem.recourseAmt.toString().replace(/,/g, ""),
              recourseInfo: recourseInfo,
            }
            reqInfoList.push(reqInfo)
            let ebank2004From = {
              elctrncSgntr: "0",
              transNo: this.formItem.transNo,
              custNo: this.formItem.custNo,
              applAcctNo: this.formItem.applAcctNo,
              reqInfoList: reqInfoList,
            }
            let url = "/bm/valetBusiness/valetApply/func_valetApplyBill";
            post({ code: JSON.stringify(ebank2004From) }, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleClose();
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
  }
</script>
