<!--投资管理-授信准备-新增、修改、查看弹出框-->
<template>
    <div>
        <h-msg-box v-model="tempstdCreditGrantAddOrEditWin" :mask-closable="false" @on-close="handleClose"
                   width="1000" class="h-form-search-layer" :footerHide="true">
            <p slot="header">
                <span v-if="batchParams.batchType==='add'">授信准备新增</span>
                <span v-else-if="batchParams.batchType==='modify'">授信准备修改</span>
            <div>
                <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
                    <std-credit-grant-form-item :addForm="addOrEditForm"
                                                :batchParams="batchParams">
                    </std-credit-grant-form-item>
                </h-form>
                <div style="text-align: right">
                    <h-button type="primary" @click="formSave()">{{$t('m.i.common.save')}}</h-button>
                </div>
            </div>
            <!-- 数据展示表格 -->
            <h-datagrid
                    :columns="columns"
                    highlightRow
                    :autoLoad=false
                    url="/bs/investmanage/creditgrant/stdCreditGrantApply/func_queryStdCreditDetailPage"
                    :bindForm="detailFormItem"
                    :has-select="false"
                    rowSelect
                    ref="datagrid">
                <div slot="toolbar" class="pull-left">
                    <h-button type="primary" @click="stdCreditGrantObjOperate('add')">
                        {{$t('m.i.common.addCreditObj')}}
                    </h-button>
                    <h-button type="primary" @click="stdCreditGrantObjOperate('edit')">
                        {{$t('m.i.common.editCreditObj')}}
                    </h-button>
                    <h-button type="primary" @click="deletCreditGrantObj()">
                        {{$t('m.i.common.deleteCreditObj')}}
                    </h-button>
                </div>
            </h-datagrid>
        </h-msg-box>


        <std-credit-grant-credit-obj-edit :addObjOrEditObjWin="addObjOrEditObjWin"
                                          :creditDetailParams="creditDetailParams"
                                          @stdAddObjOrEditObjWinClose="stdAddObjOrEditObjWinClose"
                                          ref="stdCreditGrantCreditObjEdit"></std-credit-grant-credit-obj-edit>


    </div>
</template>

<script>
    import {formatNumber, post} from "@/api/bizApi/commonUtil";

    export default {
        name: "stdCreditGrantAdd",
        components: {
            StdCreditGrantFormItem: () => import(/* webpackChunkName: "bs/investmanage/creditgrant/stdCreditGrantFormItem" */"@/views/bizViews/bs/investmanage/creditgrant/stdCreditGrantFormItem"),
            stdCreditGrantCreditObjEdit: () => import(/* webpackChunkName: "bs/investmanage/creditgrant/stdCreditGrantCreditObjEdit" */"@/views/bizViews/bs/investmanage/creditgrant/stdCreditGrantCreditObjEdit")
        },
        data() {
            return {
                batchId: "",
                editFlag: false,
                addOrEditForm: {
                    id: "",
                    legalNo: "",
                    memberId: "",
                    batchNo: "",
                    stdProductName: "",
                    stdProductNo: "",
                    creationAmt: "",
                    investPayAmt: "",
                    appendAmt: "",
                    thisAppendAmt: "",
                    thisReleaseAmt: "",
                    investDt: "",
                    occupyStatus: "",
                    appendCreditStatus: "",
                    isDelete: ""
                },
                detailFormItem: {batchId: this.batchId},
                custType: "客户类型",
                custName: "客户名称",
                custNo: "客户号",
                creditAmt: "占用金额",
                columns: [
                    {
                        type: 'selection',
                        width: 50,
                        hiddenCol: false,
                        align: 'center'
                    },
                    {
                        type: 'index',
                        title: this.$t("m.i.common.index"),
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: this.$t('m.i.bs.investManage.custType'),
                        key: 'custType',
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, 'CreditCustType', params.row.custType);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }

                    },
                    {
                        title: this.$t('m.i.bs.investManage.custNo'),
                        key: 'custNo',
                        sortable: true,
                        hiddenCol: false,
                    },
                    {
                        title: this.$t('m.i.bs.investManage.custName'),
                        key: 'custName',
                        sortable: true,
                        hiddenCol: false,
                    },
                    {
                        title: this.$t('m.i.bs.investManage.creditAmt'),
                        key: 'creditAmt',
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('span', formatNumber(params.row.creditAmt, 2, ','))
                        }
                    },
                    {
                        title: this.$t('m.i.bs.investManage.appendAmt'),
                        key: 'appendAmt',
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                          return h('span', formatNumber(params.row.appendAmt, 2, ','))
                        }
                    },
                    {
                        title: this.$t('m.i.bs.investManage.occupyStatus'),
                        key: "occupyStatus",
                        hiddenCol: false,
                        sortable: true,
                        render: (h, params) => {
                            let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, 'DetailOccupyStatus', params.row.occupyStatus);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    },
                    {
                      title: this.$t('m.i.bs.investManage.appendCreditStatus'),
                      key: "appendCreditStatus",
                      hiddenCol: false,
                      sortable: true,
                      render: (h, params) => {
                        let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, 'DetailAppendCreditStatus', params.row.appendCreditStatus);
                        return h("span", {
                          domProps: {
                            title: dictValue
                          }
                        }, dictValue);
                      }
                    }
                ],

                addObjOrEditObjWin: false,
                creditDetailParams: {}
            };
        },


        props: {
            stdCreditGrantAddOrEditWin: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            batchParams: {
                type: Object,
                default() {
                    return {};
                }
            }

        },
        computed: {
            tempstdCreditGrantAddOrEditWin: {
                get() {
                    return this.stdCreditGrantAddOrEditWin;
                },
                set() {
                }
            }
        },
        watch: {
            stdCreditGrantAddOrEditWin(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.batchId = this.batchParams.batchId;
                        this.editFlag = this.batchParams.editFlag;
                        this.queryObjById();

                    });
                }
            },
            batchId(val) {
                this.batchId = val;
            }
        },
        methods: {

            // 打开新增和修改页面
            stdCreditGrantObjOperate(str) {
                // 批次信息发生变动
                if (this.batchId === null || this.batchId === "") {
                    this.$msgTip.info(this, {info: this.$t("m.i.common.saveBatchMsg")});
                    return;
                }
                if (str === "edit") {
                    if (this.$refs.datagrid.selectIds.length === 0) {
                        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
                        return;
                    }if (this.$refs.datagrid.selectIds.length > 1) {
                        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
                        return;
                    }

                    this.creditDetailParams.id = this.$refs.datagrid.selectIds[0];
                } else {
                    this.creditDetailParams.id = "";
                }
                this.assembleCreditObjParams(str);
            },
            assembleCreditObjParams(optType) {
                this.creditDetailParams.batchId = this.batchId;
                this.creditDetailParams.type = optType;
                this.creditDetailParams.custTypeList = this.batchParams.custTypeList;
                this.creditDetailParams.detailOccupyStatusList = this.batchParams.detailOccupyStatusList;
                this.creditDetailParams.detailAppendCreditStatusList = this.batchParams.detailAppendCreditStatusList;
                // 修改标识
                this.addObjOrEditObjWin = true;
            },
            //关闭新增、修改弹窗
            stdAddObjOrEditObjWinClose() {
                this.addObjOrEditObjWin = false;
                this.$refs.datagrid.dataChange(1);
                this.creditDetailParams = {};
            },
            //根据批次Id查询批次信息
            queryObjById() {
                let params = {id: this.batchId};
                let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_getStdCreditBatchById";
                post(params, url).then(res => {
                    if (res) {
                        let retCode = res.data.retCode;
                        if (retCode === "000000") {
                            let  obj = res.data.retData;
                            this.addOrEditForm.id = obj.id;
                            this.addOrEditForm.legalNo = obj.legalNo;
                            this.addOrEditForm.memberId = obj.memberId;
                            this.addOrEditForm.batchNo = obj.batchNo;
                            this.addOrEditForm.occupyStatus = obj.occupyStatus;
                            this.addOrEditForm.appendCreditStatus = obj.appendCreditStatus;
                            if (obj.stdProductName) {
                                this.addOrEditForm.stdProductName = obj.stdProductName;
                            }
                            if (obj.stdProductShortName) {
                                this.addOrEditForm.stdProductShortName = obj.stdProductShortName;
                            }
                            if (obj.stdProductNo) {
                                this.addOrEditForm.stdProductNo = obj.stdProductNo;
                            }
                            if (obj.creationAmt) {
                                this.addOrEditForm.creationAmt = obj.creationAmt === null ? "" : obj.creationAmt.toString();
                            }
                            if (obj.investPayAmt) {
                                this.addOrEditForm.investPayAmt = obj.investPayAmt === null ? "" : obj.investPayAmt.toString();

                            }
                            if (obj.thisReleaseAmt) {
                              this.addOrEditForm.thisReleaseAmt = obj.thisReleaseAmt === null ? "" : obj.thisReleaseAmt.toString();

                            }
                            // if (obj.thisAppendAmt) {
                            //   this.addOrEditForm.thisAppendAmt = obj.thisAppendAmt === null ? "" : obj.thisAppendAmt.toString();
                            // }
                            if (obj.appendAmt) {
                              this.addOrEditForm.appendAmt = obj.appendAmt === null ? "" : obj.appendAmt.toString();
                            }
                            this.addOrEditForm.investDt = obj.investDt === null ? "" : obj.investDt.toString();
                            this.detailFormItem.batchId = obj.id;
                            this.$refs.datagrid.dataChange(1);
                        } else {
                            this.$msgTip.error(this, {info: res.data.retMsg});
                        }
                    } else {
                        this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                    }
                });
            },
            //关闭弹窗
            handleClose() {
                this.$refs.addOrEditForm.resetFields();
                this.addOrEditForm.id = "";
                this.batchId = "";
                this.$refs.datagrid.tData=[];
                this.$emit("stdCreditGrantAddOrEditWinClose", "");
            },

            deletCreditGrantObj(){
                if (this.$refs.datagrid.selectIds.length === 0) {
                    this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
                    return;
                }
                this.$hMsgBox.confirm({
                    title: "删除额度占用对象信息",
                    content: "确定要删除吗？",
                    onOk: () => {
                        let params = {ids: this.$refs.datagrid.selectIds,batchId:this.batchId};
                        let url= "/bs/investmanage/creditgrant/stdCreditGrantApply/func_deleteStdCreditObj";
                        this.sendPost(params, url, res => {
                            this.$refs.datagrid.dataChange(1);
                        });

                    }
                });
            },

            //保存批次信息
            formSave() {
                this.saveBatch();
            },
            saveBatch(optType) {
                this.saveBatchFunc(res => {
                    this.$msgTip.success(this);
                });
            },
            saveBatchFunc(callback) {
                this.$refs["addOrEditForm"].validate(valid => {
                    if (valid) {
                        let _this = this;
                        let creationAmt = Number(this.addOrEditForm.creationAmt);
                        let investPayAmt = Number(this.addOrEditForm.investPayAmt);
                        let thisAppendAmt = Number(this.addOrEditForm.thisAppendAmt);
                        let thisReleaseAmt = Number(this.addOrEditForm.thisReleaseAmt);
                        let appendAmt = Number(this.addOrEditForm.appendAmt);
                        this.addOrEditForm.investDt = this.addOrEditForm.investDt.replace(/-/g, "");

                        if (investPayAmt < 0) {
                            this.$msgTip.error(this, {info: "投资金额（元）大于零"});
                            return;
                        }
                        if (thisAppendAmt < 0) {
                          this.$msgTip.error(this, {info: "本次追加金额（元）大于零"});
                          return;
                        }
                        if (appendAmt < 0) {
                          this.$msgTip.error(this, {info: "追加金额（元）大于零"});
                          return;
                        }
                        if (thisReleaseAmt < 0) {
                          this.$msgTip.error(this, {info: "本次释放金额（元）大于零"});
                          return;
                        }
                        if (creationAmt < 0) {
                            this.$msgTip.error(this, {info: "产品规模（元）需要大于零"});
                            return;
                        }
                        if (creationAmt < investPayAmt+thisAppendAmt) {
                            this.$msgTip.error(this, {info: "投资金额（元）+本次追加金额（元）需要小于等于产品规模（元）"});
                            return;
                        }
                        let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_editStdCreditGrantBatch";
                        post(this.addOrEditForm, url).then(res => {
                            if (res) {
                                let msg = res.data.retMsg;
                                let retCode = res.data.retCode;
                                let retData = res.data.retData;
                                if (retCode === "000000") {
                                    this.batchId = retData.id;
                                    this.queryObjById();
                                    callback();
                                } else {
                                    this.$msgTip.error(this, {info: msg});
                                }
                            } else {
                                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                            }
                        });
                    }
                });
            },
            applySubmitCallback() {
                if (this.batchId) {
                    let params = {id: this.batchId};
                    let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_getStdCreditBatchById";
                    this.sendPost(params, url, res => {
                        this.handleClose();
                    });
                } else {
                    this.$msgTip.error(this, {info: "请先保存授信准备信息"});
                }
            },
            sendPost(params, url, callback) {
                post(params, url).then(res => {
                    if (res) {
                        let retCode = res.data.retCode;
                        if (retCode === "000000") {
                         this.$msgTip.success(this);
                         callback();
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
