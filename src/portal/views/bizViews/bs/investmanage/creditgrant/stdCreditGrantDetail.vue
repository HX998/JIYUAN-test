<!--投资管理-授信准备-新增、修改、查看弹出框-->
<template>
    <div>
        <h-msg-box v-model="tempstdCreditGrantBatchDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
                   width="1000" class="h-form-search-layer" :footerHide="true">
            <p slot="header">
                <span>授信准备详情</span>
            <div class="text-body">
            <div>
                <h-form :model="formItem" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
                    <!--标票产品名称-->
                    <common-input v-model="formItem.stdProductName" :label="$t('m.i.bs.stdProductName')"
                                  prop="stdProductName"     :maxlength="60"  :readonly="true"></common-input>
                    <!-- 标票产品代码 -->
                    <common-input v-model="formItem.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo"     :readonly="true"   :maxlength="9"></common-input>

                    <!-- 产品规模 -->
                    <common-type-field v-model="formItem.creationAmt" :label="$t('m.i.bs.investManage.creationAmt')"    :readonly="true"     prop="creationAmt"

                                       :bigTips="false"></common-type-field>

                    <!-- 投资金额 -->
                    <common-type-field v-model="formItem.investPayAmt" :label="$t('m.i.bs.investManage.investPayAmt')"  :readonly="true" prop="investPayAmt"
                                       :bigTips="false"></common-type-field>

                    <!--投资日期-->
                    <common-date-picker v-model="formItem.investDt" :label="$t('m.i.bs.investManage.investDt')" prop="investDt"    :readonly="true"></common-date-picker>
                    <!--占用状态-->
                    <common-select v-model="formItem.occupyStatus" :label="$t('m.i.bs.investManage.occupyStatus')"  :readonly="true"    prop="occupyStatus"
                                   :dictList="batchParams.occupyStatusList"></common-select>
                </h-form>
            </div>
                <br>
            </div>
            <h-datagrid
                    :columns="columns"
                    highlightRow
                    :autoLoad=false
                    url="/bs/investmanage/creditgrant/stdCreditGrantApply/func_queryStdCreditDetailPage"
                    :bindForm="detailFormItem"
                    :has-select="false"
                    ref="datagrid">

            </h-datagrid>
        </h-msg-box>


    </div>
</template>

<script>
    import {formatNumber, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

    export default {
        name: "stdCreditGrantDetail",
        data() {
            return {
                batchId: "",
                formItem: {
                    id: "",
                    legalNo: "",
                    memberId: "",
                    batchNo: "",
                    stdProductName: "",
                    stdProductNo: "",
                    creationAmt: "",
                    investPayAmt: "",
                    investDt: "",
                    occupyStatus: ""
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
                        hiddenCol: true,
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
                            let dictValue = getDictValueFromMap(this.batchParams.dictMap, 'CreditCustType', params.row.custType);
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
                        title: this.$t('m.i.bs.investManage.occupyStatus'),
                        key: "occupyStatus",
                        hiddenCol: false,
                        sortable: true,
                        render: (h, params) => {
                            let dictValue = getDictValueFromMap(this.batchParams.dictMap, 'DetailOccupyStatus', params.row.occupyStatus);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    }
                ]
            };
        },
        props: {
            stdCreditGrantBatchDetailWin: {
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
            tempstdCreditGrantBatchDetailWin: {
                get() {
                    return this.stdCreditGrantBatchDetailWin;
                },
                set() {
                }
            }
        },
        watch: {
            stdCreditGrantBatchDetailWin(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.batchId = this.batchParams.batchId;
                        this.queryObjById();
                    });
                }
            },
            batchId(val) {
                this.batchId = val;
            }
        },
        methods: {
            // 勾选
            handleCurrentChange(currentRow) {
                this.currentSelectRow = currentRow;
            },
            // 取消选择
            handleCurrentChangeCancel() {
                this.currentSelectRow = [];
            },

            //根据批次Id查询批次信息
            queryObjById() {
                let params = {id: this.batchId};
                let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_getStdCreditBatchById";
                post(params, url).then(res => {
                    if (res) {
                        let retCode = res.data.retCode;
                        if (retCode === "000000") {
                            let obj = res.data.retData;
                            this.formItem.id = obj.id;
                            this.formItem.legalNo = obj.legalNo;
                            this.formItem.memberId = obj.memberId;
                            this.formItem.batchNo = obj.batchNo;
                            this.formItem.occupyStatus = obj.occupyStatus;

                            if (obj.stdProductName) {
                                this.formItem.stdProductName = obj.stdProductName;
                            }
                            if (obj.stdProductShortName) {
                                this.formItem.stdProductShortName = obj.stdProductShortName;
                            }
                            if (obj.stdProductNo) {
                                this.formItem.stdProductNo = obj.stdProductNo;
                            }
                            if (obj.creationAmt) {
                                this.formItem.creationAmt = obj.creationAmt === null ? "" : obj.creationAmt.toString();
                            }
                            if (obj.investPayAmt) {
                                this.formItem.investPayAmt = obj.investPayAmt === null ? "" : obj.investPayAmt.toString();
                            }
                            this.formItem.investDt = obj.investDt === null ? "" : obj.investDt.toString();

                            this.detailFormItem.batchId= obj.id;
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
                this.formItem.id = "";
                this.batchId = "";
                this.$emit("stdCreditGrantBatchDetailOpenClose", "");
            }


        }
    };
</script>

<style scoped>

</style>
