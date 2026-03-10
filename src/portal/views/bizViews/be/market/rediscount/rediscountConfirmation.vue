<template>
    <div class="layout">
        <h-row name="flex" class="layout-menu-wrapper">
            <h-col span="24">
                <div>
                    <!--查询表单-->
                    <div class="h-form-search-box">
                        <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                                <h-form-item :label="$t('m.i.be.rediscountApplNo')" prop="rediscountApplNo">
                                    <h-input v-model="formItem.rediscountApplNo">
                                    </h-input>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                                    <h-select v-model="formItem.busiType" placeholder="">
                                        <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
                                    </h-select>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                                    <h-select v-model="formItem.billType" placeholder="">
                                        <h-option v-for="item in billTypeList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
                                    </h-select>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                                    <h-select v-model="formItem.billClass" placeholder="">
                                        <h-option v-for="item in billClassList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
                                    </h-select>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed">
                                    <h-select v-model="formItem.clearSpeed" placeholder="">
                                        <h-option v-for="item in clearSpeedList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
                                    </h-select>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.be.clearType')" prop="clearType">
                                    <h-select v-model="formItem.clearType" placeholder="">
                                        <h-option v-for="item in clearTypeList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
                                    </h-select>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode">
                                    <h-select v-model="formItem.settleMode" placeholder="">
                                        <h-option v-for="item in settleModeList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
                                    </h-select>
                                </h-form-item>
                                <!--<h-form-item :label="$t('m.i.be.pedBrchName')" prop="buyBrchName">
                                    <h-input @on-click="showbrch = true" v-model="formItem.buyBrchName" icon="search" readonly
                                             clearable @on-clear="clearVal('buyBrchName')" :title="formItem.buyBrchName">
                                    </h-input>
                                </h-form-item>-->
                              <show-cpes-branch :label="$t('m.i.be.pedBrchName')"
                                                :brchCode.sync="formItem.buyBrchCode"  :cpesBrchName.sync="formItem.buyBrchName"
                                                datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                                :cpesBrchParams="{'memberId':100000}"
                                                queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                              <common-type-field-range v-model="formItem" :label="$t('m.i.be.tradRate')" :integerNum="3" :suffixNum="4" :bigTips="false"
                                                       :rangeProps="['minRate','maxRate']"></common-type-field-range>
                                <h-form-item class="h-form-operate">
                                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                                    <h-button type="primary"  @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                                    <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                                </h-form-item>
                            </h-form>
                        </h-panel>
                    </div>
                    <!--数据展示表格-->
                            <h-datagrid :columns="columns" highlight-row :url="batchUrl" :bindForm="formItem"
                                        :onCurrentChange="onCurrentChange" :onCurrentChangeCancel="onCurrentChangeCancle"
                                        ref="datagrid">
                                <div slot="toolbar" class="pull-left">
                                    <h-button type="primary" @click="sendApply">{{$t('m.i.common.send')}}</h-button>
                                    <h-button type="primary" @click="showDeal">{{$t('m.i.be.billDetail')}}</h-button>
                                    <h-button type="primary" @click="returnEdit">{{$t('m.i.be.returnApply')}}</h-button>
                                </div>
                            </h-datagrid>
                </div>
            </h-col>
        </h-row>
      <redis-bill-detil :showBills="showDetilWin"
                        :batchid="redisBatchId"
                        :dealStatus="dealStatus"
                        :dictMap="dictMap"
                        :busi-type="busiType"
                        batchUrl="/be/market/rediscount/rediscountConfirmation/func_queryBatchById"
                        billsUrl="/be/market/rediscount/rediscountConfirmation/func_queryBills"
                        billImgsUrl="/be/market/rediscount/rediscountConfirmation/func_queryRediscountSaleImagePage"
                        @closeMsgBox="showDetilWin = false">
      </redis-bill-detil>
        <!--<brch-code-search :showCpesBranch="showbrch" :showMemberId="false" memberId="100000" @showCpesBranchClose="closeBranch" @showCpesBranchSubmit="brchCodeChange"></brch-code-search>-->
    </div>
</template>
<script>
    import { getDictListByGroups, getDictValueFromMap, post, formatNumber  } from '@/api/bizApi/commonUtil'
    export default {
		name : 'rediscountConfirmation',
        data() {
            return {
              dictMap : new Map(),
              busiType : "",
              sendApplyUrl : "/be/market/rediscount/rediscountConfirmation/func_sendApply",
              returnEditUrl : "/be/market/rediscount/rediscountConfirmation/func_rejectBack",
              billsUrl : "/be/market/rediscount/rediscountConfirmation/func_queryBills",
              batchUrl : "/be/market/rediscount/rediscountConfirmation/func_queryBatchs",
              batchByIdUrl : "/be/market/rediscount/rediscountConfirmation/func_queryBatchById",
              showDetilWin : false,
              redisBatchId : {
                batchId: ""
              },
              busiTypeList : [],
              assetIndustryList : [],
              billTypeList : [],
              billClassList : [],
              clearSpeedList : [],
              clearTypeList : [],
              settleModeList : [],
              formItem : {
                id: "",
                rediscountApplNo: "",
                busiType: "",
                billType: "",
                billClass: "",
                clearSpeed: "",
                clearType: "",
                buyBrchCode: "",
                buyBrchName: "",
                minRate: "",
                maxRate: "",
                settleMode:""
              },
              columns :[
                {
                  type: "radio",
                  width: 50,
                  title: " ",
                  align: "center"
                },
                {
                  title: this.$t("m.i.common.index"),
                  type: "index",
                  width: 60,
                  align: "center"
                },
                {
                  title: this.$t('m.i.common.batchNo'),
                  key: "batchNo",
                  hiddenCol: false,
                  sortable: true,
                  render: (h, params) => {
                    return h("a", {
                      on: {
                        click: () => {
                          this.showDetilBox(params.row.id, params.row.busiType);
                        }
                      }
                    }, params.row.batchNo);
                  }
                },
                {
                  title: this.$t('m.i.be.rediscountApplNo'),
                  key: "rediscountApplNo",
                  hiddenCol: false,
                  sortable: true,
                }, {
                  title: this.$t('m.i.be.applRelId'),
                  key: "applRelId",
                  hiddenCol: false,
                  sortable: true,
                }, {
                  title: this.$t('m.i.common.busiType'),
                  key: "busiType",
                  hiddenCol: false,
                  render:(h, params)=> {
                    let list = getDictValueFromMap(this.dictMap, "RediscBusiType", params.row.busiType);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                }, {
                  title: this.$t('m.i.common.dealStatus'),
                  key: "dealStatus",
                  hiddenCol: false,
                  render:(h, params)=> {
                    let list = getDictValueFromMap(this.dictMap, "RediscApplyStatus", params.row.dealStatus);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                }, {
                  title: this.$t('m.i.be.preTradeBhvr'),
                  key: "preTradeBhvr",
                  hiddenCol: false,
                  render: (h, params) => {
                    let list = getDictValueFromMap(this.dictMap, "PreTradeBhvr", params.row.preTradeBhvr);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                }, {
                  title: this.$t('m.i.be.pedBrchName'),
                  key: "buyBrchName",
                  sortable: true,
                  hiddenCol: false

                }, {
                  title: this.$t('m.i.be.humanDecencyReceiver'),
                  key: "buyTraderName",
                  sortable: true,
                  hiddenCol: false
                }, {
                  title: this.$t('m.i.be.humanDecencyCheck'),
                  key: "buyCheckTraderName",
                  hiddenCol: false
                }, {
                  title: this.$t('m.i.be.humanDecencyApproval'),
                  key: "buyApproveTraderName",
                  sortable: true,
                  hiddenCol: false
                }, {
                  title: this.$t('m.i.billInfo.billType'),
                  key: "billType",
                  hiddenCol: false,
                  render:(h, params)=> {
                    let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                }, {
                  title: this.$t('m.i.billInfo.billClass'),
                  key: "billClass",
                  hiddenCol: false,
                  render:(h, params)=> {
                    let list = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                }, {
                  title: this.$t('m.i.be.tradRate'),
                  key: "ratePct",
                  sortable: true,
                  hiddenCol: false
                }, {
                  title: this.$t('m.i.be.clearSpeed'),
                  key: "clearSpeed",
                  hiddenCol: false,
                  render:(h, params)=> {
                    let list = getDictValueFromMap(this.dictMap, "ClearSpeed", params.row.clearSpeed);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                }, {
                  title: this.$t('m.i.be.clearType'),
                  key: "clearType",
                  hiddenCol: false,
                  render:(h, params)=> {
                    let list = getDictValueFromMap(this.dictMap, "ClearType", params.row.clearType);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                }, {
                  title: this.$t('m.i.be.settleMode'),
                  key: "settleMode",
                  hiddenCol: false,
                  render:(h, params)=> {
                    let list = getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                }, {
                  title: this.$t('m.i.be.firstSettleDate'),
                  key: "firstSettleDt",
                  hiddenCol: false,
                  sortable: true,
                  render:(h, params)=> {
                    return h("span", params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
                  }
                }, {
                  title: this.$t('m.i.be.dueSettleDt'),
                  key: "dueSettleDt",
                  sortable: true,
                  hiddenCol: false,
                  render:(h, params)=> {
                    return h("span", params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
                  }
                }, {
                  title: this.$t('m.i.common.totalAmtBillPackage'),
                  key: "totalAmt",
                  sortable: true,
                  hiddenCol: false,
                  render:(h, params)=> {
                    return h("span", formatNumber(params.row.totalAmt, 2, ","));
                  }
                }, {
                  title: this.$t('m.i.be.returnBuyAmtByUnit'),
                  key: "buyBackTotalAmt",
                  sortable: true,
                  hiddenCol: false,
                  render:(h, params)=> {
                    return h("span", formatNumber(params.row.buyBackTotalAmt, 2, ","));
                  }
                }, {
                  title: this.$t('m.i.be.payInterestByUnit'),
                  key: "firstPayInterest",
                  sortable: true,
                  hiddenCol: false,
                  render:(h, params)=> {
                    return h("span", formatNumber(params.row.firstPayInterest, 2, ","));
                  }
                }, {
                  title: this.$t('m.i.be.firstSettleAmtByUnit'),
                  key: "firstSettleAmt",
                  sortable: true,
                  hiddenCol: false,
                  render:(h, params)=> {
                    return h("span", formatNumber(params.row.firstSettleAmt, 2, ","));
                  }
                }, {
                  title: this.$t('m.i.be.dueSettleAmtByUnit'),
                  key: "dueSettleAmt",
                  sortable: true,
                  hiddenCol: false,
                  render:(h, params)=> {
                    return h("span", formatNumber(params.row.dueSettleAmt, 2, ","));
                  }
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
              selectData : [],
              currentSelectRow : null,
              ifShowMore : false,
              //showbrch : false,
              dealStatus : "",
              bills : {
                batchId: ""
              },
              showBills : false,
              id : ""
            }
        },
        components: {
             //BrchCodeSearch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
            RedisBillDetil:()=>import(/* webpackChunkName: "be/market/rediscount/redisBillDetil" */`@/views/bizViews/be/market/rediscount/redisBillDetil`)
        },
        mounted() {
            getDictListByGroups('CreditMajor,AssetIndustry,PreTradeBhvr,ImgStatus,RediscBusiType,SettleType,ClearType,ClearSpeed,CDMedia,DraftTypeCode,RediscApplyStatus,PreRelationFlag,Yon,CorpScale,Industry,BillOrigin').then(res => {
                this.busiTypeList = res.get('RediscBusiType');
                this.assetIndustryList = res.get('AssetIndustry');
                this.billTypeList = res.get('DraftTypeCode')
                this.billClassList = res.get('CDMedia')
                this.clearSpeedList = res.get('ClearSpeed')
                this.clearTypeList = res.get('ClearType')
                this.settleModeList = res.get('SettleType')
                this.dictMap = res.get('map')
            })
        },
        methods: {
          /*clearVal(type){
            if(type == 'buyBrchName'){
              this.formItem.buyBrchCode = '';
              this.formItem.buyBrchName = '';
            }
          },*/
            minRateVaild() {
                this.formItem.minRate = this.formItem.minRate.trim();
                if (this.formItem.minRate.length != 0 && Number(this.formItem.minRate)) {
                    let min = Number(this.formItem.minRate)
                    if (min < 0 || min > 100) {
                        this.$msgTip.info(this,{info:"利率：0~100(最多4位小数)"});
                        this.formItem.minRate = ''
                    }
                    if (this.formItem.maxRate.length != 0 && Number(this.formItem.maxRate)) {
                        let max = Number(this.formItem.maxRate)
                        if (min > max) {
                            this.$msgTip.info(this, {info:"最大值不能小于最小值"});
                            this.formItem.minRate = ''
                        }
                    }
                }
                else {
                    this.formItem.minRate = ''
                }
            },
            maxRateVaild() {
                if (this.formItem.maxRate.length != 0 && Number(this.formItem.maxRate)) {
                    let max = Number(this.formItem.maxRate)
                    if (max < 0 || max > 100) {
                        this.$msgTip.info(this, {info:"利率：0~100(最多4位小数)"});
                        this.formItem.maxRate = ''
                    }
                    if (this.formItem.minRate.length != 0 && Number(this.formItem.minRate)) {
                        let min = Number(this.formItem.minRate)
                        if (min > max) {
                            this.$msgTip.info(this, {info:"最大值不能小于最小值"});
                            this.formItem.maxRate = ''
                        }
                    }
                }
                else {
                    this.formItem.maxRate = ''
                }
            },
            onCurrentChange(currentRow,oldCurrentRow,_index) {
              this.currentSelectRow = currentRow;
            },
            onCurrentChangeCancle(currentRow,oldCurrentRow,_index){
              this.currentSelectRow = null;
            },
            formSearch() {
                this.currentSelectRow = null;
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            },
            formSearchReset() {
                this.$refs.formItem.resetFields();
                this.formItem.minRate = '';
                this.formItem.maxRate = '';
                this.formItem.buyBrchCode = "";
                this.formItem.buyBrchName = "";
            },
            sendApply() {
              if (null===this.currentSelectRow) {
                this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
              }else{
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: "确定要发送报价申请吗?",
                  onOk: () => {
                    this.sendMessage("sendApply")
                  }
                });
              }
            },
            showDeal() {
                if (null===this.currentSelectRow || 0 == this.currentSelectRow.length) {
                    this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
                } else {
                  this.showDetilBox(this.currentSelectRow.id,this.currentSelectRow.busiType);
                }
            },
            returnEdit() {
              if (null===this.currentSelectRow || 0 == this.currentSelectRow.length) {
                  this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
              }else{
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: "确定要退回申请吗?",
                  onOk: () => {
                    this.sendMessage("returnEdit")
                  }
                });
              }
            },
            sendMessage(type) {
                if (type == "sendApply") {
                    post(this.currentSelectRow, this.sendApplyUrl).then(res => {
                        if (res.data.retCode === '000000') {
                            this.$msgTip.success(this,{info:"已发送"});
                            this.currentSelectRow=[];
                        } else {
                            this.$msgTip.error(this,{info:res.data.retMsg});
                        }
                        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    }).catch(error => {
                        this.$msgTip.error(this,{info:this.$t('m.i.common.netError') + error});
                    })
                } else if (type == "returnEdit") {
                    post(this.currentSelectRow, this.returnEditUrl).then(res => {
                        if (res.data.retCode === '000000') {
                            this.$msgTip.success(this,{info:"已发送"});
                            this.currentSelectRow=[];
                        } else {
                            this.$msgTip.error(this,{info:res.data.retMsg});
                        }
                        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    }).catch(error => {
                        this.$msgTip.error(this,{info:this.$t('m.i.common.netError') + error});
                    })
                }
            },
            handleSelectClick(i) {
                this.selectData = i;
            },
            showDetilBox(redisBatchId, busiType) {
              this.redisBatchId.batchId = redisBatchId;
              this.busiType = busiType;
              this.showDetilWin = true;
              this.currentSelectRow=[];
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            },
        },
    }
</script>
