<template>
    <div>
        <h-msg-box v-model="tempEditBillInfoWin" width="800" class="h-form-table-layer" :maximize="true"
                   @on-close="handleClose">
            <p slot="header">
                <span>{{title}}</span>
            </p>
            <h-panel>
                <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
                    <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDt" required>
                        <h-date-picker type="date" placeholder="" format="yyyy-MM-dd" showFormat
                                       v-model="addForm.remitDt"></h-date-picker>
                    </h-form-item>
                    <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" required  :validRules="billNoRule">
                        <h-input v-model="addForm.billNo" placeholder="" icon="android-search" @on-click="importBill()"
                                 @on-change="changeBillNo" :maxlength=30 type="int"></h-input>
                    </h-form-item>
                  <!--子票区间-->
                  <bill-range :form-item="addForm" :range-props="['billRangeStart','billRangeEnd']" required
                              v-if="this.billClass === 'ME02' && (addForm.billOrigin==='CS02'||addForm.billOrigin==='CS03')"></bill-range>
                    <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" required :validRules="billMoneyRule">
                        <h-typefield v-model="addForm.billMoney" placeholder="" type="money"></h-typefield>
                    </h-form-item>
                    <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt" required>
                        <h-date-picker type="date" placeholder="" format="yyyy-MM-dd" showFormat v-model="addForm.dueDt"></h-date-picker>
                    </h-form-item>
                  <show-cpes-branch :label="$t('m.i.billInfo.acptBankName')" :required="true"
                                    :brchCode.sync="addForm.acptBrchCode"  :cpesBrchName.sync="addForm.acptBankName"
                                    :clearable="false"  :msgBoxWin="tempEditBillInfoWin" @selectedChange="handleacptBankNo"
                                    datagridUrl="/cpes/branch/queryBranchList" prop="acptBankName"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                  <show-cpes-branch :label="$t('m.i.billInfo.cfmAppBankName')"
                                    :brchCode.sync="addForm.cfmAppBrchCode"  :cpesBrchName.sync="addForm.cfmAppBankName"
                                    :clearable="false"   :msgBoxWin="tempEditBillInfoWin"
                                    datagridUrl="/cpes/branch/queryBranchList" prop="cfmAppBankName"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                  <show-cpes-branch :label="$t('m.i.billInfo.acptGuarntrBankName')"
                                    :brchCode.sync="addForm.acptGuarntrBrchCode"  :cpesBrchName.sync="addForm.acptGuarntrBankName"
                                    :clearable="false"   :msgBoxWin="tempEditBillInfoWin"
                                    datagridUrl="/cpes/branch/queryBranchList" prop="acptGuarntrBankName"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                  <show-cpes-branch :label="$t('m.i.billInfo.discBankName')"
                                    :brchCode.sync="addForm.discBrchCode"  :cpesBrchName.sync="addForm.discBankName"
                                    :clearable="false"   :msgBoxWin="tempEditBillInfoWin"
                                    datagridUrl="/cpes/branch/queryBranchList" prop="acptGuarntrBankName"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                  <show-cpes-branch :label="$t('m.i.billInfo.discGuarntrBankName')"
                                    :brchCode.sync="addForm.discGuarntrBrchCode"  :cpesBrchName.sync="addForm.discGuarntrBankName"
                                    :clearable="false"   :msgBoxWin="tempEditBillInfoWin"
                                    datagridUrl="/cpes/branch/queryBranchList" prop="discGuarntrBankName"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                  <show-cpes-branch :label="$t('m.i.billInfo.guarntrTrustBankName')"
                                    :brchCode.sync="addForm.guarntrTrustBrchCode"  :cpesBrchName.sync="addForm.guarntrTrustBankName"
                                    :clearable="false"   :msgBoxWin="tempEditBillInfoWin"
                                    datagridUrl="/cpes/branch/queryBranchList" prop="guarntrTrustBankName"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                    <h-form-item prop="id" v-show="false">
                        <h-input v-model="addForm.id"></h-input>
                    </h-form-item>
                </h-form>
            </h-panel>
            <div slot="footer">
                <h-button type="ghost" style="margin:0 8px" @click="handleClose">{{$t('m.i.common.close')}}</h-button>
                <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
            </div>
        </h-msg-box>
    </div>
</template>

<script>
  import { post, on, off, getDictListByGroups } from "@/api/bizApi/commonUtil";
  export default {
    name: "editBillInfo",
    components: {

    },
    data() {
      return {
        title : "新增票据明细",
        addForm : {
          id: "",
          dueDt: "",
          remitDt: "",
          billNo: "",
          billMoney: "",
          acptBankNo: "",
          acptBrchCode: "",
          acptBankName: "",
          cfmAppBrchCode: "",
          cfmAppBankName: "",
          acptGuarntrBrchCode:"",
          acptGuarntrBankName:"",
          discBrchCode:"",
          discBankName:"",
          discGuarntrBrchCode:"",
          discGuarntrBankName:"",
          guarntrTrustBrchCode:"",
          guarntrTrustBankName:"",
          batchId: "",
          billRangeStart: "",
          billRangeEnd:"",
          billOrigin:"",
          billClass:"",
          billType:"",
        },
        //showCpesBranch : false,
        queryType:"",
        billNoRule : [{ test: this.validBillNo, trigger: "blur" }],
        billMoneyRule : [{ test: this.validBillMoney, trigger: "blur" }],
      }
    },
    props: {
      billClass: String,
      billType: String,
      batchId: Number,
      billId: Number,
      dictMap: {
        type: Object
      },
      editBillInfoWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempEditBillInfoWin: {
        get() {
          return this.editBillInfoWin;
        },
        set() {

        }
      }
    },
    watch: {
      editBillInfoWin(val) {
        if (val === true) {
          if (this.billId) {
            this.title = "修改票据明细";
            this.findBillById();
          } else {
            this.title = "新增票据明细";
            this.addForm.billClass = this.billClass;
            this.addForm.billType = this.billType;
          }
        }
      }
    },
    methods: {
      turnForm(formItem, obj,_this) {
        if(obj.id){
          formItem.id = obj.id;
        }
        if (obj.dueDt) {
          formItem.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        if (obj.remitDt) {
          formItem.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        formItem.billNo = obj.billNo;
        formItem.billMoney = obj.billMoney;
        formItem.acptBankNo = obj.acptBankNo;
        formItem.acptBrchCode = obj.acptBrchCode;
        formItem.acptBankName = obj.acptBankName;
        formItem.cfmAppBrchCode = obj.cfmAppBrchCode;
        formItem.cfmAppBankName = obj.cfmAppBankName;
        formItem.acptGuarntrBrchCode = obj.acptGuarntrBrchCode;
        formItem.acptGuarntrBankName = obj.acptGuarntrBankName;
        formItem.discBrchCode = obj.discBrchCode;
        formItem.discBankName = obj.discBankName;
        formItem.discGuarntrBrchCode = obj.discGuarntrBrchCode;
        formItem.discGuarntrBankName = obj.discGuarntrBankName;
        formItem.guarntrTrustBrchCode = obj.guarntrTrustBrchCode;
        formItem.guarntrTrustBankName = obj.guarntrTrustBankName;
        formItem.batchId = obj.batchId;
        formItem.billRangeStart = obj.billRangeStart;
        formItem.billRangeEnd = obj.billRangeEnd;
        formItem.billOrigin = obj.billOrigin;
        formItem.billClass = obj.billClass;
        formItem.billType = obj.billType;
      },
      validBillNo(rule, val, callback) {
        let vueObj = this;
        if(vueObj.billClass === "ME01"){
          if (vueObj.billType === "AC01") {
            let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
            if (re.test(val)) {
              callback();
            } else {
              callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
            }
          } else if (vueObj.billType === "AC02") {
            let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
            if (re.test(val)) {
              callback();
            } else {
              callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
            }
          } else {
            callback(new Error("请选择票据类型"));
          }
        }else if(vueObj.billClass === "ME02"){
          if(val.length !== 30){
            callback(new Error("电票号码为30位数字"));
          }else{
            callback();
          }
        }else{
          callback(new Error("请选择票据介质"));
        }
      },
      validBillMoney(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if (value > 0 && value <= 100000000) {
            callback();
          } else {
            callback(new Error("票面金额应小于等于100,000,000.00、大于0.00"));
          }
        } else {
          callback(new Error("票据金额为大于0的不超过9位的数字，且小数位不超过两位"));
        }
      },
      importBill() {
        if (this.addForm.billNo === null || this.addForm.billNo === "") {
          this.$msgTip.error(this, {info: "请填写票据号码"});
          return;
        }
        if (this.billClass === "ME02" && (this.addForm.billOrigin === 'CS02' || this.addForm.billOrigin === 'CS03')) {
          if (!(this.addForm.billRangeStart || this.addForm.billRangeStart === 0)) {
            this.$msgTip.error(this, {info: this.$t("金融机构票据或供应链票据，子票区间起始不能为空")});
            return;
          }
        }
        post({
          billNo: this.addForm.billNo,
          billRangeStart: this.addForm.billRangeStart,
          billRangeEnd: this.addForm.billRangeEnd,
          batchId: this.batchId
        }, "/be/market/preaudit/preAuditMain/func_findBillInfoByBillNoInHold").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.turnForm(this.addForm, res.data.retData, this);
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      changeBillNo() {
          if (this.addForm.billNo) {
            if (this.addForm.billNo.length === 16) {
              this.addForm.billClass = "ME01";
              this.addForm.billOrigin = "CS00";
            } else if (this.addForm.billNo.length === 30) {
              this.addForm.billClass = "ME02";
              let mark = this.addForm.billNo.charAt(0);
              if (mark === '1' || mark === '2') {
                this.addForm.billOrigin = "CS01";
              } else if (mark === '5' || mark === '6') {
                this.addForm.billOrigin = "CS02";
              } else if (mark === '7' || mark === '8') {
                this.addForm.billOrigin = "CS03";
              }
            }
          }
      },
      findBillById() {
        post({ billId: this.billId }, "/be/market/preaudit/preAuditMain/func_findBillInfoById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.turnForm(this.addForm, res.data.retData,this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleClose() {
        this.resetAddFormFields();
        this.$emit("editBillInfoWinClose", "");
      },
      resetAddFormFields(){
        this.$refs.addForm.resetFields();
        this.addForm.acptBrchCode = "";
        this.addForm.acptBankNo = "";
        this.addForm.acptBankName = "";
        this.addForm.cfmAppBrchCode = "";
        this.addForm.cfmAppBankName = "";
        this.addForm.acptGuarntrBrchCode = "";
        this.addForm.acptGuarntrBankName = "";
        this.addForm.discBrchCode = "";
        this.addForm.discBankName = "";
        this.addForm.discGuarntrBrchCode = "";
        this.addForm.discGuarntrBankName = "";
        this.addForm.guarntrTrustBrchCode = "";
        this.addForm.guarntrTrustBankName = "";
        this.addForm.batchId = "";
        this.addForm.billRangeStart = "";
        this.addForm.billRangeEnd = "";
        this.addForm.billOrigin = "";
        this.addForm.billClass = "";
        this.addForm.billType = "";
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.addForm.batchId = this.batchId;
            let dueDate = this.addForm.dueDt;
            if (dueDate) {
              this.addForm.dueDt = this.$moment(dueDate).format("YYYYMMDD");
            }
            let remitDate = this.addForm.remitDt;
            if (remitDate) {
              this.addForm.remitDt = this.$moment(remitDate).format("YYYYMMDD");
            }
            if (this.addForm.dueDt - this.addForm.remitDt <= 0) {
              this.$msgTip.error(this, { info: "汇票到期日应大于出票日" });
              return;
            }
            if (this.billClass === "ME02" && (this.addForm.billOrigin === 'CS02' || this.addForm.billOrigin === 'CS03')) {
              if (!(this.addForm.billRangeStart || this.addForm.billRangeStart === 0)) {
                this.$msgTip.error(this, {info: this.$t("金融机构票据或供应链票据，子票区间起始不能为空")});
                return;
              }
              if (!(this.addForm.billRangeEnd || this.addForm.billRangeEnd === 0)) {
                this.$msgTip.error(this, {info: this.$t("金融机构票据或供应链票据，子票区间截止不能为空")});
                return;
              }
            }
            post(this.addForm, "/be/market/preaudit/preAuditMain/func_editBillInfo").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: "操作成功" });
                  this.handleClose();
                  this.$emit("editBillInfoCommit", res.data.retData);
                } else {
                  this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: "操作失败" });
              }
            });
          }
        });
      },
      handleacptBankNo(info){
        this.addForm.acptBankNo = info.transBrchBankNo;
      },
    }
  };
</script>

<style scoped>

</style>
