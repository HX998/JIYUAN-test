<!--投资管理 授信准备 新增/修改弹窗共用字段-->
<template>
    <div>
        <!--标票产品名称-->
        <common-input v-model="addForm.stdProductName" :label="$t('m.i.bs.stdProductName')"
                      prop="stdProductName"   :required="true" @on-click="queryProductName"  :showIcon="batchParams.batchType==='add'" :maxlength="60"
                      readonly ></common-input>
        <!-- 标票产品代码 -->
        <common-input v-model="addForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo"
                      :required="true" :readonly="true" :validRules="stdProductNoRule" :maxlength="9"></common-input>

        <!-- 产品规模 -->
        <common-type-field v-model="addForm.creationAmt" :label="$t('m.i.bs.investManage.creationAmt')"
                           :readonly="batchParams.batchType==='show'" prop="creationAmt"
                           :validRules="creationAmtRule" :required="true"
                           :bigTips="false"></common-type-field>

        <!-- 投资金额 -->
        <common-type-field v-model="addForm.investPayAmt" :label="$t('m.i.bs.investManage.investPayAmt')"
                           :readonly="batchParams.batchType==='show'" prop="investPayAmt"
                           :validRules="investPayAmtRule" :required="true" :bigTips="false"></common-type-field>

        <!--投资日期-->
        <common-date-picker v-model="addForm.investDt" :label="$t('m.i.bs.investManage.investDt')" prop="investDt"
                            :readonly="batchParams.batchType==='show'"
                            :required="true" :options="options3"></common-date-picker>
        <!--占用状态-->
        <common-select v-model="addForm.occupyStatus" :label="$t('m.i.bs.investManage.occupyStatus')" :readonly="true"
                       :required="true" prop="occupyStatus"
                       :dictList="batchParams.occupyStatusList"></common-select>

        <div v-if="batchParams.batchType==='modify' && addForm.occupyStatus != '0' && addForm.occupyStatus != '2' ">
          <!-- 本次投资金额 -->
          <common-type-field v-model="addForm.thisAppendAmt" :label="$t('m.i.bs.investManage.thisAppendAmt')"
                             :readonly="batchParams.batchType==='show'" prop="thisAppendAmt"
                             :validRules="thisAppendAmtRule" :required="true" :bigTips="false"></common-type-field>
        </div>
        <show-cpes-branch :showCpesBranch="cpesProductBranch" @showCpesBranchClose="cpesProductBranchClose"
                          :showMemberId="false" :brchType="productBrchType"
                          @showCpesBranchSubmit="cpesProductBranchSubmit"></show-cpes-branch>
    </div>
</template>

<script>
    import {post} from "@/api/bizApi/commonUtil";

    export default {
        name: "stdCreditGrantFormItem",
        components: {
            ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
        },
        data() {
            let _this = this;

            return {
                options3: {
                    disabledDate (date) {
                        return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
                    }
                },
                creationAmtRule: [{
                    test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
                    trigger: "blur",
                    message: "产品规模(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
                }],
                investPayAmtRule: [{
                    test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
                    trigger: "blur",
                    message: "投资金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
                }],
                thisAppendAmtRule: [{
                    test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
                    trigger: "blur",
                    message: "本次追加金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
                }],
                stdProductNoRule: [{test: this.validateStdProductNo, trigger: "blur"}],
                memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
                productBrchType: "7",
                cpesProductBranch: false
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
            changeInvestDt() {
                /*            post({code: this.$moment( this.addForm.stdProductNo.investDt, "YYYYMMDD").format('YYYYMMDD')}, '/sm/oper/holiday/isHoliday').then(res => {
                                if (res && res.data.retCode === '000000') {
                                    if (res.data.retData === true) {
                                        this.$msgTip.info(this, {info: '您选择的是节假日，请重新选择！'});
                                        this.addForm.investDt = '';
                                    }
                                }
                            });*/

            },
        }


    };
</script>

<style scoped>

</style>
