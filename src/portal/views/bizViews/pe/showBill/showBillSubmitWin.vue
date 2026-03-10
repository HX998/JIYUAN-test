<template>
  <!--照票页面弹框-->
  <h-msg-box v-model="tempShowBillApplyWin" width="1000" height="400" :mask-closable="false" class="h-form-table-layer"
             @on-close="handleClose" :maximize="true" :top="10" @on-maximize="onMaximize">
    <p slot="header">
      <span>照票</span>
    </p>
    <h-form :model="formItem" :label-width="150" cols="2" ref="formItem"
            class="h-form-search">
      <!--票据(包)号码-->
      <bill-no v-model="formItem.billNo" prop="billNo" :label="$t('m.i.billInfo.billPackageNo')"
               :showIcon="true" @on-click="queryStockBill()" placeholder=" " :readonly="true" :required="true"></bill-no>
      <!-- 票据来源 -->
      <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin" :readonly="true" :required="true"
                     v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>
      <!--子票区间-->
      <bill-range :formItem="formItem" :rangeProps="['billRangeStart','billRangeEnd']" :readonly="true" :required="formItem.billOrigin !== 'CS01'"></bill-range>
      <show-money :formItem="formItem" :readonly="formItem.billOrigin === '' || formItem.billOrigin === 'CS01' || formItem.billRangeStart === 0" @on-blur="onShowMoneyBlur" :required="true"></show-money>

      <!-- 业务主体类型 -->
      <common-select :label="$t('m.i.shcpe.showeeRoleType')" prop="showeeRoleType"  :required="true" :readonly="true"
                     v-model="formItem.showeeRoleType" :dictList="ptcptTypeList" @on-change="onPtcptChange"></common-select>

      <!-- 票交所场内查验未开放，场内票据只能给同业查验，企业客户相关字段暂不使用 -->
      <showee-name :formItem="formItem" :required="true" :isShow="formItem.showeeRoleType === 'RC01'"></showee-name>
      <showee-soc-code :formItem="formItem" :required="true" :isShow="formItem.showeeRoleType === 'RC01'"></showee-soc-code>
      <!-- 识别类型 -->
      <common-select :label="$t('m.i.shcpe.showeeDistTp')" prop="showeeDistTp" :isShow="formItem.showeeRoleType === 'RC01'" :required="true"
                     v-model="formItem.showeeDistTp" :dictList="distTypeList" @on-change="onDictChange"></common-select>
      <showee-acct-no :formItem="formItem" :required="true" :isShow="formItem.showeeDistTp === 'DT01' || formItem.showeeDistTp === 'DT02'"></showee-acct-no>
      <showee-acct-name :formItem="formItem" :required="true" :isShow="formItem.showeeDistTp === 'DT02'"></showee-acct-name>
      <show-cpes-branch  :label="'看票人机构名称'" v-if="formItem.showeeRoleType === 'RC00' || formItem.showeeDistTp === 'DT02'" :required="true"
                         :brchCode.sync="formItem.showeeBrchCode"
                         datagridUrl="/cpes/branch/queryBranchList" prop="showeeBrchCode"
                         queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
      <select-member prop="memberName" v-model="formItem.memberName" :label="this.$t('m.i.shcpe.showeeMemberName')"  title="查询会员"
                     :clearVal="clearVal" required readonly v-if="formItem.showeeDistTp === 'DT01'" :memberFormItem="memberFormItem"
                     :memberId.sync="formItem.showeeMemberId" :memberName.sync="formItem.memberName"></select-member>
    </h-form>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <close-btn @close="handleClose"></close-btn>
      <commit-btn @commit="submitForm"></commit-btn>
    </div>
    <!--挑票页面弹框-->
    <choose-bill :chooseBillWin="chooseBillWin" @queryStockBillClose="queryStockBillClose"
                 @chooseBillChange="chooseBillChange"></choose-bill>

  </h-msg-box>
</template>

<script>
  import { post, on, off ,formatNumber, getDictListByGroups, accDiv, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "showBillSubmitWin",
    components: {
      ChooseBill: () => import(/* webpackChunkName: "pe/showBill/chooseBill" */`@/views/bizViews/pe/showBill/chooseBill`),
    },
    data() {
      return {
        billId : "",
        billRangeStart:"",
        billRangeEnd:"",
        ifShowMore: false,
        billTypeList : [],
        chooseBillWin :false,
        ecdsAvailable : true,
        billOriginList :[],
        ptcptTypeList :[],
        distTypeList : [],
        memberFormItem:{
          memberName: "",
          memberTypeCode : "MT05"
        },
        formItem: {
          billId : "",
          hldrId : "",
          billNo: "",
          billOrigin : "",
          showeeAcctNo: "",
          showeeAcctName : "",
          showeeBankNo: "",
          showeeName: "",
          showeeMemberId: "",
          memberName : "",
          showeeSocCode: "",
          showeeBrchCode : "",
          showeeRoleType : "RC00",
          showeeDistTp : "",
          billMoney: "",
          originBillMoney : "",
          billRangeStart : '',
          billRangeEnd : '',
          stdAmt : "",
        },
      }
    },
    props: {
      showBillApplyWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    watch: {
      showBillApplyWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.billRangeStart = '';
            this.formItem.billRangeEnd = '';
          });
        }
      }
    },
    computed: {
      tempShowBillApplyWin: {
        get() {
          return this.showBillApplyWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {

        }, 100);
      },
      queryStockBill() {
        this.chooseBillWin = true;
      },
      queryStockBillClose() {
        this.chooseBillWin = false;
      },
      clearVal() {
        this.formItem.memberId = '';
        this.formItem.memberName = '';
      },
      cpesBranchChange(info){
        this.formItem.showeeBrchCode = info.brchCode;
        this.formItem.showeeMemberId = info.memberId;
      },
      onPtcptChange(value){
        this.formItem.showeeName = "";
        this.formItem.showeeAcctNo = "";
        this.formItem.showeeAcctName = "";
        this.formItem.showeeBankNo = "";
        this.formItem.showeeBrchCode = "";
        this.formItem.showeeDistTp = "";
        this.formItem.showeeSocCode = "";
        this.formItem.showeeMemberId = "";
        this.formItem.memberName = "";
      },
      onDictChange(value){
        this.formItem.showeeAcctNo = "";
        this.formItem.showeeAcctName = "";
        this.formItem.showeeBrchCode = "";
        this.formItem.showeeMemberId = "";
        this.formItem.memberName = "";
      },
      chooseBillChange(info) {
        this.formItem.billId = info.billId;
        this.formItem.hldrId = info.hldrId;
        this.formItem.billNo = info.billNo;
        this.formItem.billRangeStart = info.billRangeStart;
        this.formItem.billRangeEnd = info.billRangeEnd;
        this.formItem.billType = info.billType;
        this.formItem.originBillMoney = info.billMoney;
        this.formItem.billMoney = info.billMoney;
        this.formItem.stdAmt = info.stdAmt;
        this.formItem.billOrigin = info.billOrigin;
        this.formItem.showeeMemberId = "";
        this.formItem.memberName = "";
        this.formItem.showeeRoleType = "RC00";
        this.formItem.showeeDistTp = "";
        this.formItem.showeeName = "";
        this.formItem.showeeAcctNo = "";
        this.formItem.showeeAcctName = "";
        this.formItem.showeeBankNo = "";
        // this.formItem.showeeBrchCode = "";
        this.formItem.showeeSocCode = "";
        this.chooseBillWin = false;
      },
      handleClose() {
        this.$refs.formItem.resetFields();
        this.formItem.billRangeStart = '';
        this.formItem.billRangeEnd = '';
        this.$emit("showBillApplyWinClose", "");
      },
      onShowMoneyBlur(){
        if (this.formItem.billOrigin === "CS01" || this.formItem.billRangeStart === 0
          || this.formItem.billMoney === '' || this.formItem.billMoney === null){
          return;
        }
        if (this.formItem.billMoney <= 0 || this.formItem.billMoney > this.formItem.originBillMoney){
          this.$msgTip.info(this, { info: "查验金额必须大于零且小于等于票据包金额"});
          this.formItem.billMoney = '';
          return;
        }
        let n = accDiv(this.formItem.billMoney,this.formItem.stdAmt);
        if (parseInt(n) < parseFloat(n)){
          this.$msgTip.info(this, { info: "查验金额必须是标准金额的整数倍"});
          this.formItem.billMoney = '';
          return;
        }

        this.formItem.billRangeEnd = parseInt(this.formItem.billRangeStart) + n - 1;
      },
      submitForm() {
        // 校验
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: "确定发送照票申请吗？",
              onOk: () => {
                this.$emit("showBillApplyWinSubmit", this.formItem);
              }
            });
          }
        });
      },
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,BillOrigin,DraftTypeCode,PtcptTypeCode,DistTypeCode").then(res => {
        this.billTypeList=res.get("DraftTypeCode");
        this.ptcptTypeList = res.get("PtcptTypeCode");
        this.distTypeList = res.get("DistTypeCode");
        this.billOriginList= res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      on(window, "resize", this.handleResize);
    },
  };
</script>

<style scoped>

</style>
