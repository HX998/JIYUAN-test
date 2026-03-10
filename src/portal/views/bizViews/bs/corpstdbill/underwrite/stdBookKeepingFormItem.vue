<!--创设业务 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--批次号-->
    <common-input v-model="addForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo"
                  :readonly="true"></common-input>
    <!--标票产品名称-->
    <common-input v-model="addForm.stdProductName" :label="$t('m.i.bs.stdProductName')"
                  prop="stdProductName" showIcon :required="true" @on-click="queryProductName"
                  :maxlength="60" readonly></common-input>
    <!--标票产品简称-->
    <common-input v-model="addForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')"
                  prop="stdProductShortName" :required="true" :maxlength="60" lengthByByte readonly></common-input>
    <!--标票产品代码-->
    <common-input v-model="addForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo" :required="true"
                  :validRules="stdProductNoRule" :maxlength="9" readonly></common-input>
    <!--产品规模(元)-->
    <common-type-field v-model="addForm.creationAmt" :label="$t('m.i.bs.creationAmt')" prop="creationAmt"
                       :readonly="false" :validRules="creationAmtRule"
                       :bigTips="false" :required="true"></common-type-field>
    <!--定价方式-->
    <common-select v-model="addForm.priceType" :label="$t('m.i.bs.priceType')"
                   prop="priceType" :dictList="batchParams.priceMethodList"
                   :required="true" readonly></common-select>
    <!--认购日期-->
    <common-date-picker v-model="addForm.purchaseDt" :label="$t('m.i.bs.purchaseDt')" prop="purchaseDt"
                        :options="purchaseDtFilter" :required="true"></common-date-picker>
    <!--认购金额下限(元)-->
    <common-type-field v-model="addForm.minPurchaseAmt" :label="$t('m.i.bs.minPurchaseAmt')" prop="minPurchaseAmt"
                       :readonly="false" :validRules="minPurchaseAmtRule" :required="true"
                       :bigTips="false"></common-type-field>
    <!--递增基数(元)-->
    <common-type-field v-model="addForm.steppedUpBasisAmt" :label="$t('m.i.bs.steppedUpBasisAmt')"
                       prop="steppedUpBasisAmt" :readonly="false" :validRules="steppedUpBasisAmtRule"
                       :bigTips="false" :required="true"></common-type-field>
    <!--最低认购价格(元)-->
    <common-type-field v-model="addForm.minPurchasePrice" :label="$t('m.i.bs.minPurchasePrice')"
                       prop="minPurchasePrice" :validRules="minPurchasePriceRule" :suffixNum="4"
                       :bigTips="false"></common-type-field>
    <!--电子邮箱-->
    <common-input v-model="addForm.sellEmail" :label="$t('m.i.bs.email')" :validRules="emailRule"
                  prop="sellEmail" :required="true" :maxlength="320" lengthByByte></common-input>
    <!--联系人-->
    <common-input v-model="addForm.sellLinkMan" :label="$t('m.i.bs.linkMan')"
                  prop="sellLinkMan" :required="true" :maxlength="60" lengthByByte></common-input>
    <!--电话-->
    <common-input v-model="addForm.sellPhone" :label="$t('m.i.bs.phone')" :validRules="phoneRule"
                  prop="sellPhone" :required="true" :maxlength="13" lengthByByte></common-input>

    <show-cpes-branch :showCpesBranch="cpesProductBranch" @showCpesBranchClose="cpesProductBranchClose"
                      :showMemberId="false" :brchType="productBrchType"
                      @showCpesBranchSubmit="cpesProductBranchSubmit"></show-cpes-branch>

  </div>
</template>

<script>
  import {post, on, off} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdBookKeepingFormItem",
    components: {
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      let _this = this;
      return {
        purchaseDtFilter: {
          disabledDate(date) {
            return _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf();
          }
        },
        creationAmtRule: [{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "产品规模(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        minPurchaseAmtRule: [{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "认购金额下限(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        steppedUpBasisAmtRule: [{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "递增基数(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        minPurchasePriceRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?)$/,
          trigger: "blur",
          message: "最低认购价格(元)0~100(不包括100)，且小数位不超过四位"
        }],
        phoneRule: [{
          test: /^[0-9_-]{1,13}$/,
          trigger: "blur",
          message: "电话号码为小于等于13位的数字或-组成"
        }],
        emailRule: ["email"],
        stdProductNoRule: [{test: this.validateStdProductNo, trigger: "blur"}],
        productBrchType: "4",//资管非法人产品机构类型
        cpesProductBranch: false,
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
        let params = {stdProductNo: this.addForm.stdProductNo};
        let url = "/bs/corpstdbill/underwrite/stdBookKeepingApply/func_getStdCreation";
        post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                if (obj.creationAmt) {
                  this.addForm.creationAmt = obj.creationAmt;
                }
                if (obj.purchaseDt) {
                  this.addForm.purchaseDt = obj.purchaseDt === null ? "" : obj.purchaseDt.toString();
                }
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          }
        );

      },


    }
  };
</script>

<style scoped>

</style>
