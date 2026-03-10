<!--创设业务 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--标票产品名称-->
    <common-input v-model="addForm.stdProductName" :label="$t('m.i.bs.stdProductName')"
                  prop="stdProductName" :showIcon="!addForm.id" :required="true" @on-click="showStdBookKeepingOpen"
                  :maxlength="60" readonly></common-input>
    <!--标票产品简称-->
    <common-input v-model="addForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')"
                  prop="stdProductShortName" :required="true" :maxlength="60" lengthByByte readonly></common-input>
    <!--标票产品代码-->
    <common-input v-model="addForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo" :required="true"
                  readonly :validRules="stdProductNoRule" :maxlength="9"></common-input>
    <!--机构名称-->
    <common-input v-model="addForm.investBrchName" :label="$t('m.i.common.brchName')" prop="investBrchName"
                  :required="true"
                  :maxlength="60" lengthByByte></common-input>
    <!--法定代表人-->
    <common-input v-model="addForm.investLegalPerson" :label="$t('m.i.bs.investLegalPerson')" prop="investLegalPerson"
                  :maxlength="60" lengthByByte></common-input>
    <!--营业执照号码-->
    <common-input v-model="addForm.investLicenseNo" :label="$t('m.i.bs.investLicenseNo')" prop="investLicenseNo"
                  :maxlength="30" lengthByByte></common-input>
    <!--经办人姓名-->
    <common-input v-model="addForm.investAgentName" :label="$t('m.i.bs.investAgentName')" prop="investAgentName"
                  :maxlength="60" lengthByByte></common-input>
    <!--电子邮箱-->
    <common-input v-model="addForm.investEmail" :label="$t('m.i.bs.email')" :validRules="emailRule"
                  prop="investEmail" :maxlength="320" lengthByByte></common-input>
    <!--联系电话-->
    <common-input v-model="addForm.investPhone" :label="$t('m.i.bs.linkPhone')" :validRules="phoneRule"
                  prop="investPhone" :maxlength="13" lengthByByte></common-input>
    <!--传真号码-->
    <common-input v-model="addForm.investFax" :label="$t('m.i.bs.fax')" :validRules="faxRule"
                  prop="investFax" :maxlength="13" lengthByByte></common-input>
    <!--上海清算所托管户名-->
    <common-input v-model="addForm.investTrustAcctName" :label="$t('m.i.bs.investTrustAcctName')"
                  class="h-form-long-label" prop="investTrustAcctName" :maxlength="60"
                  lengthByByte></common-input>
    <!--上海清算所托管账号-->
    <common-input v-model="addForm.investTrustAcctNo" :label="$t('m.i.bs.investTrustAcctNo')" class="h-form-long-label"
                  prop="investTrustAcctNo" :maxlength="32" lengthByByte></common-input>

    <show-std-book-keeping :showStdBookKeepingWin="showStdBookKeepingWin"
                           @showStdBookKeepingClose="showStdBookKeepingClose" :bookParams="bookParams"
                           @showStdBookKeepingSubmit="showStdBookKeepingSubmit"></show-std-book-keeping>

  </div>
</template>

<script>
  import {post, on, off} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdPurchaseCaseBatchFormItem",
    components: {
      ShowStdBookKeeping: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/showStdBookKeeping" */`@/views/bizViews/bs/corpstdbill/underwrite/showStdBookKeeping`),
    },
    data() {
      let _this = this;
      return {
        licenseNoRule: [{
          test: /^[A-Za-z0-9\-]{0,18}$/,
          trigger: "blur",
          message: "营业执照号码为0-18位只含a-z,A-Z,0-9,-字符"
        }],
        phoneRule: [{
          test: /^[0-9_-]{1,13}$/,
          trigger: "blur",
          message: "电话号码为小于等于13位的数字或-组成"
        }],
        faxRule: [{
          test: /^[0-9_-]{1,13}$/,
          trigger: "blur",
          message: "传真号码为小于等于13位的数字或-组成"
        }],
        emailRule: ["email"],
        stdProductNoRule: [{test: this.validateStdProductNo, trigger: "blur"}],
        showStdBookKeepingWin: false,
        bookParams: {},
      }
    },
    props: {
      addForm: {
        type: Object,
        default() {
          return {};
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    methods: {
      validateStdProductNo(rule, value, callback) {
        if (value) {
          let leg = this.getLength(value);
          if (leg !== 9) {
            callback(new Error("标票产品代码必须是9位数字"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      getLength(val) {
        var str = new String(val);
        var bytesCount = 0;
        for (var i = 0, n = str.length; i < n; i++) {
          var c = str.charCodeAt(i);
          if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            bytesCount += 1;
          } else {
            bytesCount += 2;
          }
        }
        return bytesCount;
      },
      queryProductName() {
        this.cpesProductBranch = true;
      },
      cpesProductBranchClose() {
        this.cpesProductBranch = false;
      },
      cpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, {info: "请先选择记录！"});
          return;
        }
        this.addForm.stdProductNo = info.brchCode;
        this.addForm.stdProductName = info.brchFullNameZh;
        this.addForm.stdProductShortName = info.brchShortNameZh;
        this.cpesProductBranch = false;
      },
      showStdBookKeepingOpen() {
        this.showStdBookKeepingWin = true;
        this.bookParams.bookUrl = "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_queryStdBookKeepingPage";
      },
      showStdBookKeepingClose() {
        this.showStdBookKeepingWin = false;
        this.bookParams = {};
      },
      showStdBookKeepingSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, {info: "请先选择记录！"});
          return;
        }
        this.addForm.stdProductNo = info.stdProductNo;
        this.addForm.stdProductName = info.stdProductName;
        this.addForm.stdProductShortName = info.stdProductShortName;
        this.addForm.bkId = info.id;
        this.showStdBookKeepingWin = false;
        this.bookParams = {};
      }
    }
  };
</script>

<style scoped>

</style>
