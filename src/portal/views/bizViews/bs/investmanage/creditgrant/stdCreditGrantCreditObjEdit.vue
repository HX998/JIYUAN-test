<!--投资管理-授信准备 额度占用对象-新增、修改、查看弹出框-->
<template>
    <div>
        <!--点击新增/修改弹出窗-->
        <h-msg-box v-model="tempaddObjOrEditObjWin" width="800" :mask-closable="false" @on-close="handleObjWinClose"
                   class="h-form-search-layer" :maximize="true">
            <p slot="header">
                <span v-if="creditDetailParams.type==='add'">占用对象新增</span>
                <span v-if="creditDetailParams.type==='edit'">占用对象修改</span>
            </p>
            <div>
                <h-form :model="addOrEditObjForm"   :creditDetailParams="creditDetailParams" :label-width="115" ref="addOrEditObjForm" cols="2" class="h-form-search">
                    <common-select v-model="addOrEditObjForm.custType" :label="$t('m.i.pc.custType')"  @on-change="custTypeChange()"  :readonly="this.creditDetailParams.type ==='edit'"
                                   :required="true"  prop="custType"
                                   :dictList="creditDetailParams.custTypeList"></common-select>

                    <common-input v-model="addOrEditObjForm.custName"  :label="$t('m.i.common.custName')"   prop="custName"  :showIcon="creditDetailParams.type==='add'"
                                  :required="true" :readonly="true"    @on-click="queryCustName()" :clearable="this.creditDetailParams.type==='add'"   :clearVal="clearCustName"   ></common-input>

                    <common-type-field v-model="addOrEditObjForm.creditAmt" :label="$t('m.i.bs.investManage.creditAmt')"
                                         prop="creditAmt"
                                       :validRules="creditAmtRule" :required="true" :bigTips="false"></common-type-field>
                </h-form>
            </div>
            <div slot="footer">
                <h-button type="ghost" @click="handleObjWinClose()" >{{$t("m.i.common.close")}}</h-button>
                <h-button    type="primary" @click="submitForm()" >{{$t("m.i.common.confirm")}}</h-button>

            </div>
        </h-msg-box>
        <!--查看企业客户-->
        <show-cust-corp :showCustCorpWin="showCustCorpWin" :title="'查看企业客户'" @showCustCorpWinClose="showCustCorpWinClose"
                        @custSelect="custCorpSelect"></show-cust-corp>
        <!--查看会员-->
        <show-member :showMemberWin="showMemberWin" @memberWinClose="memberWinClose"
                     @memberSelect="memberSelect"></show-member>
    </div>
</template>

<script>
    import {post} from "@/api/bizApi/commonUtil";

    export default {
        name: "stdCreditGrantCreditObjEdit",
        components: {
            ShowMember:()=>import(/* webpackChunkName: "shcpe/cpes/member/showMember" */`@/views/bizViews/shcpe/cpes/member/showMember`),
            ShowCustCorp:()=>import(/* webpackChunkName: "bm/cust/corp/showCustCorp" */`@/views/bizViews/bm/cust/corp/showCustCorp`)
        },
        data() {
            return {
                id: "",
                addOrEditObjForm: {
                    id:"",
                    legalNo: "",
                    memberId: "",
                    batchId: "",
                    custType: "",
                    custName: "",
                    custNo: "",
                    creditAmt: "",
                    appendAmt: "",
                    occupyStatus: "",
                    isDelete:"",
                },
                custType: "",
                custName: "",
                custNo: "",
                creditAmtRule: [{
                    test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
                    trigger: "blur",
                    message: "占用金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
                }],
                additionalPayAmtRule: [{
                    test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
                    trigger: "blur",
                    message: "追加金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
                  }],

                custTypeList:[],
                detailOccupyStatusList:[],
                detailAppendCreditStatusList:[],
                showCustCorpWin:false,
                showMemberWin:false,
                dictMap:new Map()
            };
        },
        props: {
            addObjOrEditObjWin: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            creditDetailParams: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        computed: {
            tempaddObjOrEditObjWin: {
                get() {
                    return this.addObjOrEditObjWin;
                },
                set() {
                }
            }
        },
        watch: {
            addObjOrEditObjWin(val) {
                if (val) {
                    this.$nextTick(() => {
                       this.id = this.creditDetailParams.id;
                       this.custTypeList= this.creditDetailParams.custTypeList;
                        if (this.creditDetailParams.type === "add") {
                            this.addOrEditObjForm.batchId= this.creditDetailParams.batchId;
                        }
                        if (this.creditDetailParams.type === "edit") {
                            this.queryObjById();

                        }
                    });
                }
            },
        },


        methods: {
            // 关闭弹窗
            handleObjWinClose() {
                this.optType = "";
                this.id= "";
                this.$refs.addOrEditObjForm.resetFields();
                this.addOrEditObjForm.id = "";
                this.addOrEditObjForm.legalNo = "";
                this.addOrEditObjForm.memberId = "";
                this.addOrEditObjForm.batchId="";
                this.addOrEditObjForm.id="";
                this.addOrEditObjForm.occupyStatus="";
                this.addOrEditObjForm.isDelete="";
                this.$emit("stdAddObjOrEditObjWinClose");
            },

            //1-同业客户，查询会员信息；2-企业客户，查询企业客户信息
            custTypeChange() {
                if(this.addOrEditObjForm.id===null||this.addOrEditObjForm.id===""){
                    this.addOrEditObjForm.custNo = "";
                    this.addOrEditObjForm.custName = "";
                }

            },
            clearCustName() {
              this.addOrEditObjForm.custNo = "";
              this.addOrEditObjForm.custName = "";
            },
            //1-同业客户，查询会员信息；2-企业客户，查询企业客户信息
            queryCustName() {
                    if (this.addOrEditObjForm.custType === "") {
                        this.$msgTip.info(this, { info: "请先选择客户类型" });
                        return false;
                    }
                    if (this.addOrEditObjForm.custType === "1") {
                        this.showMemberWin = true;
                    } else if (this.addOrEditObjForm.custType === "2") {
                        this.showCustCorpWin = true;
                    }
            },
            showCustCorpWinClose() {
                this.showCustCorpWin = false;
            },
            custCorpSelect(info) {
                if(info.custNo===""||info.custNo===null ||info.custName ===""||info.custName===null){
                    this.$msgTip.info(this, { info: "选择的客户客户号不能为空或客户名称不能为空" });
                    return;
                }
            this.addOrEditObjForm.custNo = info.custNo;
            this.addOrEditObjForm.custName = info.custName;
            this.showCustCorpWin = false;
            },
            memberWinClose() {
                this.showMemberWin = false;
            },
            memberSelect(info) {
                if(info.memberBankNo===""||info.memberBankNo===null ||info.memberName ===""||info.memberName===null){
                    this.$msgTip.info(this, { info: "选择的同业客户大额行号不能为空或行名不能为空" });
                    return;
                }
                this.addOrEditObjForm.custName = info.memberName;
                this.addOrEditObjForm.custNo = info.memberBankNo;
                this.showMemberWin = false;
            },
            //根据Id查询额度占用对象信息
            queryObjById() {
                let params = {id: this.id};
                let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_getStdCreditDetailById";
                post(params, url).then(res => {
                    if (res) {
                        let retCode = res.data.retCode;
                        if (retCode === "000000") {
                            let obj = res.data.retData;
                            this.addOrEditObjForm.id = obj.id;
                            this.addOrEditObjForm.legalNo = obj.legalNo;
                            this.addOrEditObjForm.memberId = obj.memberId;
                            if(obj.batchId){
                                this.addOrEditObjForm.batchId = obj.batchId;
                            }else {
                                this.addOrEditObjForm.batchId = this.batchId;
                            }
                            this.addOrEditObjForm.custName= obj.custName;
                            this.addOrEditObjForm.custNo= obj.custNo;
                            this.addOrEditObjForm.custType= obj.custType;
                            this.addOrEditObjForm.occupyStatus = obj.occupyStatus;
                            this.addOrEditObjForm.isDelete= obj.isDelete;
                            this.addOrEditObjForm.creditAmt = obj.creditAmt? obj.creditAmt.toString() : "" ;
                        } else {
                            this.$msgTip.error(this, {info: res.data.retMsg});
                        }
                    } else {
                        this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                    }
                });
            },
            submitForm() {
              this.$refs["addOrEditObjForm"].validate(valid => {
                    if (valid) {
                        let creditAmt = Number(this.addOrEditObjForm.creditAmt);
                        let appendAmt = Number(this.addOrEditObjForm.appendAmt);
                        if (creditAmt < 0) {
                            this.$msgTip.error(this, {info: "占用金额（元）需大于零"});
                            return;
                        }
                        if (appendAmt < 0) {
                            this.$msgTip.error(this, {info: "追加金额（元）需大于零"});
                            return;
                        }
                        let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_editStdCreditGrantDetail" ;
                        post(this.addOrEditObjForm, url).then(res => {
                            if (res) {
                                let retCode = res.data.retCode;
                                if (retCode === "000000") {
                                    this.$msgTip.success(this);
                                    this.handleObjWinClose();
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
            sendPost(params, url, callback) {
                post(params, url).then(res => {
                    if (res) {
                        let retCode = res.data.retCode;
                        if (retCode === "000000") {
                            if (res.data.retData.errorMsg) {
                                this.$msgTip.error(this, {info: res.data.retData.errorMsg});
                            } else {
                                this.$msgTip.success(this);
                                callback();
                            }
                        } else {
                            this.$msgTip.error(this, {info: res.data.retMsg});
                        }
                    } else {
                        this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                    }
                });
            }


        }

    };
</script>

<style scoped>

</style>
