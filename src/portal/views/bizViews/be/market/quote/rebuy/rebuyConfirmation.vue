<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"      prop="ownedBrchNames"
                             v-if="this.licenseFlag"     :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo">
                  <h-input v-model="formItem.quoteNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>

                <show-cpes-branch  :label="$t('m.i.be.otherBrchName')"
                                   :brchCode.sync="formItem.saleBrchCode"  :cpesBrchName.sync="formItem.saleBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.custTraderName')" prop="saleTraderName" class="h-form-long-label">
                  <h-input @on-click="showtrader = true" v-model="formItem.saleTraderName" icon="search" readonly
                           clearable @on-clear="clearVal('saleTraderName')">
                  </h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" highlight-row :url="batchsUrl" :bindForm="formItem" :onCurrentChange="onCurrentChange" :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="quoteApply" :disabled="applyFlagDisable">{{$t('m.i.be.quoteApply')}}</h-button>
              <h-button type="primary" @click="quoteDeal" :disabled="dealFlagDisable">{{$t('m.i.be.quoteDeal')}}</h-button>
              <h-button type="primary" @click="returnApply">{{$t('m.i.be.returnApply')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <rebuy-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :rebuyDetailWin="showProvisionDetil" :rootUrl="rootUrl"
                  @closeMsgBox="closeDetil"></rebuy-detail>
    <trader-id-search :traderIdWin="showtrader" :brchCode="formItem.saleBrchCode" @traderIdWinClose="traderIdWinClose" @traderIdChange="traderIdChange"></trader-id-search>


  </div>
</template>
<script>
    import { getDictListByGroups, getDictValueFromMap, post,formatNumber } from "@/api/bizApi/commonUtil";
    export default {
        name: "rebuyConfirmation",
        data() {
            return {
                filename : "买入票据明细",
                batchsUrl : "/be/market/quote/rebuy/rebuyConfirmation/func_queryBatch",
                quoteApplyUrl : "/be/market/quote/rebuy/rebuyConfirmation/func_quoteApply",
                queryIsAllotSuccessUrl : "/be/market/quote/rebuy/rebuyConfirmation/func_queryIsAllotSuccess",
                quoteDealUrl : "/be/market/quote/rebuy/rebuyConfirmation/func_quoteDeal",
                returnApplyUrl : "/be/market/quote/rebuy/rebuyConfirmation/func_returnApply",
                dictMap : new Map(),
                busiType : "",
                rootUrl:"/be/market/quote/rebuy/rebuyConfirmation",
                batchId:'',
                formItem :{
                  batchNo: "",
                  quoteNo: "",
                  busiType: "",
                  saleBrchName: "",
                  saleBrchCode: "",
                  saleTraderName: "",
                  saleTraderNo: "",
                  ownedBrchName:"",
                  ownedBrchNo:"",
                  ownedBrchNames:"",
                  ownedBrchNos:"",
                  authPath:this.$route.path ,
                },
                selectData : [],
                ifShowMore : false,
                busiTypeList : [],
                showtrader : false,
                showProvisionDetil : false,
                //集中授权管理
                ownedBrchName:"",
                ownedBrchNo:"",
                ownedBrchNames:"",
                ownedBrchNos:"",
                licenseFlag:false,
                authPath: this.$route.path ,
                columns : [
                    {
                        type: "radio",
                        width: 50,
                        title: " ",
                        align: "center",
                        hiddenCol: false
                    },
                    {
                        title: this.$t("m.i.common.index"),
                        type: "index",
                        width: 60,
                        align: "center"
                    },
                    {
                      title: this.$t("m.i.common.ownedBrchNo"),
                      key: "ownedBrchName",
                      hiddenCol: false
                    },
                    {
                        title: this.$t('m.i.common.batchNo'),
                        key: "batchNo",
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        this.billDetail(params.row.id, params.row.busiType)
                                    }
                                }
                            }, params.row.batchNo)
                        }
                    }, {
                        title: this.$t('m.i.be.quoteNo'),
                        key: "quoteNo",
                        sortable: true,
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.common.busiType'),
                        key: "busiType",
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            let dictValue =getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        },
                    }, {
                        title: this.$t('m.i.common.dealStatus'),
                        key: "dealStatus",
                        hiddenCol: false,
                        render: (h, params) =>{
                            let dictValue =getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    },
                    {
                        title: this.$t('m.i.be.preTradeBhvr'),
                        key: 'preTradeBhvr',
                        hiddenCol: false,
                        render: (h, params) => {
                            let dictValue =getDictValueFromMap(this.dictMap, 'PreTradeBhvr', params.row.preTradeBhvr);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    }, {
                        title: this.$t('m.i.be.otherBrchName'),
                        key: "saleBrchName",
                        sortable: true,
                        hiddenCol: false,
                    }, {
                        title: this.$t('m.i.be.custTraderName'),
                        key: "saleTraderName",
                        sortable: true,
                        hiddenCol: false,
                    }, {
                        title: this.$t('m.i.billInfo.billType'),
                        key: "billType",
                        hiddenCol: false,
                        render: (h, params) =>{
                            let dictValue =getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    }, {
                        title: this.$t('m.i.billInfo.billClass'),
                        key: "billClass",
                        hiddenCol: false,
                        render: (h, params) => {
                            let dictValue =getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    }, {
                        title: this.$t('m.i.be.firstTransRate'),
                        key: "ratePct",
                        sortable: true,
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.be.dueTransRate'),
                        key: "dueRatePct",
                        sortable: true,
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.be.subDeal'),
                        key: "subDeal",
                        hiddenCol: false,
                        render: (h, params) => {
                            let dictValue =getDictValueFromMap(this.dictMap, 'Yon', params.row.subDeal);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    }, {
                        title: this.$t('m.i.be.clearSpeed'),
                        key: "clearSpeed",
                        hiddenCol: false,
                        render: (h, params) => {
                            let dictValue =getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.clearSpeed);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    }, {
                        title: this.$t('m.i.be.firstSettleDate'),
                        key: "firstSettleDt",
                        hiddenCol: false,
                        sortable: true,
                        render:(h, params) => {
                            let firstSettleDt= params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
                            return h('span',  firstSettleDt)
                        }
                    }, {
                        title: this.$t('m.i.be.dueSettleDt'),
                        key: "dueSettleDt",
                        sortable: true,
                        hiddenCol: false,
                        render:(h, params)  => {
                            let dueSettle = params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
                            return h('span', dueSettle)
                        }
                    }, {
                        title: this.$t('m.i.be.settleMode'),
                        key: "settleMode",
                        hiddenCol: false,
                        render: (h, params) =>{
                            let dictValue =getDictValueFromMap(this.dictMap, 'SettleType', params.row.settleMode);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    }, {
                        title: this.$t('m.i.be.clearType'),
                        key: "clearType",
                        hiddenCol: false,
                        render: (h, params) =>{
                            let dictValue =getDictValueFromMap(this.dictMap, 'ClearType', params.row.clearType);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    }, {
                        title: this.$t('m.i.be.quoteTm'),
                        key: "quoteTm",
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.be.setTm'),
                        key: "setTm",
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.common.totalAmtBillPackage'),
                        key: "totalAmt",
                         sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('span', formatNumber(params.row.totalAmt, 2, ','))
                        },
                    }, {
                        title: this.$t('m.i.be.firstPayInterestByUnit'),
                        key: "firstPayInterest",
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
                        },
                    }, {
                        title: this.$t('m.i.be.dueInterestByUnit'),
                        key: "dueInterest",
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('span', formatNumber(params.row.dueInterest, 2, ','))
                        },
                    }, {
                        title: this.$t('m.i.be.firstSettleAmtByUnit'),
                        key: "firstSettleAmt",
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
                        },
                    }, {
                        title: this.$t('m.i.be.dueSettleAmtByUnit'),
                        key: "dueSettleAmt",
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('span', formatNumber(params.row.dueSettleAmt, 2, ','))
                        },
                    }, {
                        title: this.$t('m.i.be.tenorDays'),
                        key: "tenorDays",
                        sortable: true,
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.common.totalNumBillPackage'),
                        key: "totalNum",
                        hiddenCol: false
                    }
                ],
              applyFlagDisable:false,
              dealFlagDisable:false,
            };
        },
        components: {
            TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
            RebuyDetail:()=>import(/* webpackChunkName: "be/market/quote/rebuy/rebuyDetail" */`@/views/bizViews/be/market/quote/rebuy/rebuyDetail`),

        },
        mounted() {
            getDictListByGroups('PreRelationFlag,BookType,AssetIndustry,CreditDeductRule,Yon,CdSelectMode,QuoteStatus,PreTradeBhvr,QuoteBusiType,SettleType,ClearType,ClearSpeed,CDMedia,DraftTypeCode,CreditMajor,BillOrigin').then(res => {
                this.busiTypeList = res.get('QuoteBusiType');
                this.dictMap = res.get('map')
            });

          post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.licenseFlag = res.data.retData.licenseFlag;
                if (this.licenseFlag) {
                  this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
                }else {
                  this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            }else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        },
        methods: {
            onCurrentChange(data) {
                this.selectData[0] = data;
                if (this.selectData[0].preTradeBhvr == "2") {
                  this.applyFlagDisable = true;
                  this.dealFlagDisable = false;
                } else {
                  this.applyFlagDisable = false;
                  this.dealFlagDisable = true;
                }
            },
            onCurrentChangeCancel() {
                this.selectData = [];
                this.applyFlagDisable = false;
                this.dealFlagDisable = false;
            },
            format(groupcode, key) {
                return getDictValueFromMap(this.dictMap, groupcode, key)
            },
            formatDate(value) {
                return this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD")
            },
            traderIdChange(info) {
                if (info === null) {
                    this.$msgTip.info(this, { info: "请先选择记录！" });
                    return;
                }
                this.formItem.saleTraderNo = info.traderId;
                this.formItem.saleTraderName = info.traderName;
                this.showtrader = false;
            },
            traderIdWinClose() {
                this.showtrader = false;
            },
            formSearch() {
                this.selectData = [];
                this.$refs.datagrid.dataChange(1);
            },
            formSearchReset() {
                this.$refs.formItem.resetFields();
                this.formItem.saleBrchCode = '';
                this.formItem.saleTraderNo = '';
                this.formItem.ownedBrchNo = "";
                this.formItem.ownedBrchName = "";
                this.formItem.ownedBrchNos = "";
                this.formItem.ownedBrchNames = "";
                this.formItem.saleBrchName = "";
            },
            quoteApply() {
                let list = this.selectData;
                if (list.length == 0) {
                    this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
                    return;
                }
                if (list.length > 1) {
                    this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
                    return;
                }
                this.$hMsgBox.confirm({
                    title: this.$t("m.i.common.confirm"),
                    content: this.$t("确定要报价申请吗") + "?",
                    onOk: () => {
                        let id = list[0].id;
                        let ownedBrchNo = list[0].ownedBrchNo;
                        post({ id: id ,ownedBrchNo:ownedBrchNo,licenseFlag:this.licenseFlag}, this.quoteApplyUrl).then(res => {
                            if (res) {
                                let retCode = res.data.retCode
                                if (retCode == "000000") {
                                    this.$msgTip.success(this);
                                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                                    this.selectData = [];
                                } else {
                                    this.$msgTip.error(this, { info: res.data.retMsg });
                                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                                    this.selectData = [];
                                }
                            } else {
                                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                            }
                        });
                    }
                });

            },

            quoteDeal() {
                let list = this.selectData;
                if (list.length == 0) {
                    this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
                    return;
                }
                if (list.length > 1) {
                    this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
                    return;
                }
                let id = list[0].id;
                let ownedBrchNo = list[0].ownedBrchNo;
                post({ id: id }, this.queryIsAllotSuccessUrl).then(res => {
                    if (res) {
                        let retCode = res.data.retCode;
                        if (retCode == "000000") {
                            let data = res.data.retData;
                            if (data === "0") {
                                //强制校验,资金调拨未成功，不能成交！
                                this.$msgTip.error(this, {info: "资金调拨未成功，不能成交！"});
                            }else if (data === "1") {
                                //资金调拨成功
                                this.quoteConfirm(id,ownedBrchNo);
                            } else if (data === "2") {
                                //资金调拨未成功，线下确认
                                this.$hMsgBox.confirm({
                                    title: this.$t("m.i.common.confirm"),
                                    content: this.$t("资金调拨失败，请线下确认调拨结果。点击确认进行成交！"),
                                    onOk: () => {
                                        this.quoteConfirm(id,ownedBrchNo);
                                    }
                                });
                            } else {
                                this.$msgTip.error(this, {info: res.data.retMsg});
                                this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                                this.selectData = [];
                            }
                        } else {
                            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
                        }
                    }
                });
            },
            quoteConfirm(id,ownedBrchNo){
                this.$hMsgBox.confirm({
                    title: this.$t("m.i.common.confirm"),
                    content: this.$t("确定要报价成交吗") + "?",
                    onOk: () => {
                        post({ id: id,ownedBrchNo:ownedBrchNo,licenseFlag:this.licenseFlag }, this.quoteDealUrl).then(res => {
                            if (res) {
                                let retCode = res.data.retCode;
                                if (retCode == "000000") {
                                    this.$msgTip.success(this);
                                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                                    this.selectData = [];
                                } else {
                                    this.$msgTip.error(this, { info: res.data.retMsg });
                                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                                    this.selectData = [];
                                }
                            } else {
                                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                            }
                        });
                    }
                });
            },
            returnApply() {
                let list = this.selectData;
                if (list.length == 0) {
                    this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
                    return;
                }
                if (list.length > 1) {
                    this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
                    return;
                }
                this.$hMsgBox.confirm({
                    title: this.$t("m.i.common.confirm"),
                    content: this.$t("确定退回申请吗") + "?",
                    onOk: () => {
                        let id = list[0].id;
                        let ownedBrchNo = list[0].ownedBrchNo;
                        post({ id: id ,ownedBrchNo:ownedBrchNo,licenseFlag:this.licenseFlag}, this.returnApplyUrl).then(res => {
                            if (res) {
                                let retCode = res.data.retCode
                                if (retCode == "000000") {
                                    this.$msgTip.success(this);
                                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                                    this.selectData = [];
                                } else {
                                    this.$msgTip.error(this, { info: res.data.retMsg });
                                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                                    this.selectData = [];
                                }
                            } else {
                                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                            }
                        });
                    }
                });
            },
            billDetail(id, busiType) {
                this.batchId = id;
                this.busiType = busiType;
                this.showProvisionDetil = true
            },
            closeDetil() {
                this.showProvisionDetil = false
            },
            clearVal(type){
                if(type == 'saleBrchName'){
                    this.formItem.saleBrchCode = '';
                    this.formItem.saleBrchName = '';
                }
                if(type == 'saleTraderName'){
                    this.formItem.saleTraderNo = '';
                    this.formItem.saleTraderName = '';
                }
            },

        }
    }

</script>
