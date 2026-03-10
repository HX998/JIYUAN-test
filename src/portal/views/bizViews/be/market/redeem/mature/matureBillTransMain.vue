<template>
    <div class="layout">
        <h-row name="flex" class="layout-menu-wrapper">
            <h-col span="24">
                <div>
                    <!--查询表单-->
                    <div class="h-form-search-box">
                        <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                              <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                                           v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                                           :params="{authPath:this.$route.path}"
                                           url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                                           queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                              </show-branch>
                              <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo">
                                    <h-input v-model="formItem.quoteNo"></h-input>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
                                    <h-input v-model="formItem.dealNo"></h-input>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                                    <h-input v-model="formItem.batchNo"></h-input>
                                </h-form-item>
                              <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                                <h-select class="input-boder-0" v-model="formItem.billOrigin" placeholder="">
                                  <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                                </h-select>
                              </h-form-item>
                                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                                    <h-input v-model="formItem.billNo"></h-input>
                                </h-form-item>
                              <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                              <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                                    <h-select v-model="formItem.busiType" placeholder="">
                                        <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                                    </h-select>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.be.dealDt')" prop="dealDtTmp">
                                    <h-date-picker type="daterange" autoPlacement :value="dealDtTmp" :showFormat="true" placeholder="" @on-change="handleDealDtChange"></h-date-picker>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDtTmp">
                                    <h-date-picker type="daterange" autoPlacement :value="dueDtTmp" :showFormat="true" placeholder="" @on-change="handleDueDtChange"></h-date-picker>
                                </h-form-item>
                                <h-form-item :label="$t('m.i.common.acctStatus')" prop="acctStatus">
                                    <h-select v-model="formItem.acctStatus" placeholder="">
                                        <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                                    </h-select>
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
                            <h-datagrid :columns="columns" highlight-row url="/be/market/redeem/mature/matureBillTransMain/func_queryMatureBillInfoList" :onCurrentChange="onCurrentChange"
                                :onCurrentChangeCancel="onCurrentChangeCancel" :bindForm="formItem" ref="datagrid">
                              <div slot="toolbar" class="pull-left">
                              </div>
                            </h-datagrid>
                </div>
            </h-col>
        </h-row>
      <!-- 查看票面 -->
      <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                      :billNo="this.billNo"  :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

    </div>
</template>
<script>
    import { post, on, off, formatNumber, formatBillRange} from "@/api/bizApi/commonUtil";
    export default {
		name : "matureBillTransMain",
        data() {
            return {
                acctRecord : "/be/market/redeem/mature/matureBillMain/func_getAcctRecord",
                showPrintButton:false,
                acctSubmitFlag:false,
                dictMap : new Map(),
                billId : "",
                billNo : "",
                billRangeStart:'',
                billRangeEnd:'',
                showBillInfoWin : false,
                formItem : {
                    dealNo: '',
                    batchNo: '',
                    busiType: '',
                    dealDtTmp: '',
                    minDealDt: '',
                    maxDealDt: '',
                    dueDtTmp: '',
                    minDueDt: '',
                    maxDueDt: '',
                    acctStatus:'',
                    billNo:"",
                    billOrigin:"",
                    minBillRangeStart:"",
                    maxBillRangeEnd:"",
                    ownedBrchName:"",
                    ownedBrchNo:"",
                    ownedBrchNames:this.$store.getters.userInfo.brchName,
                    ownedBrchNos:this.$store.getters.userInfo.brchNo,
                    authPath:this.$route.path ,
                    licenseFlag:this.licenseFlag,
                },
                ifShowMore : false,
              dealDtTmp:[],
              billOriginList: [],
              dueDtTmp:[],
                columns : [
                    {
                        type: "radio",
                        width: 50,
                        align: "center",
                        title: ' ',
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
                    title: this.$t("m.i.billInfo.billOrigin"),
                    key:"billOrigin",
                    hiddenCol: false,
                    render: (h, params) => {
                      let list = this.pageShowFormatBillOrigin(this.dictMap, "BillOrigin", params.row.billOrigin);
                      return h("span",
                        {
                          domProps: {
                            title: list
                          }
                        }, list);
                    }
                  },
                    {
                        title: this.$t('m.i.billInfo.billPackageNo'),
                        key: 'billNo',
                        hiddenCol: false,
                        sortable: true,
                        render: (h, params) => {
                            return h("a", {
                                on: {
                                    click: () => {
                                        this.showBillInfo(params.row.billId,params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                                    }
                                }
                            }, params.row.billNo);
                        }
                    },
                  {
                    title: this.$t("m.i.billInfo.billRange"),
                    key:"billRange",
                    hiddenCol: false,
                    render: (h, params) => {
                      let list = formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd);
                      return h("span",
                        {
                          domProps: {
                            title: list
                          }
                        }, list);
                    }
                  },
                    {
                        title: this.$t('m.i.common.batchNo'),
                        key: 'batchNo',
                        sortable: true,
                        hiddenCol: false
                    },
                    {
                        title: this.$t('m.i.be.quoteNo'),
                        key: 'quoteNo',
                        sortable: true,
                        hiddenCol: false
                    },
                    {
                        title: this.$t('m.i.be.dealNo'),
                        key: 'dealNo',
                        sortable: true,
                        hiddenCol: false
                    },
                    {
                        title: this.$t('m.i.common.busiType'),
                        key: 'busiType',
                        hiddenCol: false,
                        render: (h, params) => {
                          let dictValue = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
                          return h("span", {
                            domProps: {
                              title: dictValue
                            }
                          }, dictValue);
                        }
                    },
                    {
                        title: this.$t('m.i.be.impawnSourceProdNo'),
                        key: 'impawnSourceProdNo',
                        hiddenCol: false
                    },
                    {
                        title: this.$t('m.i.be.impawnSourceProdName'),
                        key: 'impawnSourceProdName',
                        hiddenCol: false
                    },
                    {
                        title: this.$t('m.i.be.dealDt'),
                        key: 'dealDt',
                        hiddenCol: false,
                        render:(h, params)=>{
                            return h('span', params.row.dealDt ? this.$moment(params.row.dealDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
                        }
                    },
                    {
                        title: this.$t('m.i.be.saleBrchName'),
                        key: 'saleBrchName',
                        hiddenCol: false
                    },
                    {
                        title: this.$t('m.i.be.buyBrchName'),
                        key: 'buyBrchName',
                        hiddenCol: false
                    },
                    {
                        title: this.$t('m.i.billInfo.billType'),
                        key: 'billType',
                        hiddenCol: false,
                        render:(h, params)=>{
                            let dictValue = this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
                            return h("span", {
                              domProps: {
                                title: dictValue
                              }
                            }, dictValue);
                        }
                    },
                    {
                        title: this.$t('m.i.billInfo.billClass'),
                        key: 'billClass',
                        hiddenCol: false,
                        render:(h, params)=>{
                            let dictValue = this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
                            return h("span", {
                              domProps: {
                                title: dictValue
                              }
                            }, dictValue);
                        }
                    },
                    {
                        title: this.$t('m.i.be.firstTransRate'),
                        key: 'ratePct',
                        hiddenCol: false,
                        render: (h, params) => {
                          return h("p", formatNumber(params.row.ratePct, 4,','));
                        }
                    }, {
                        title: this.$t('m.i.billInfo.billPackageMoney'),
                        key: 'billMoney',
                        hiddenCol: false,
                        sortable: true,
                        render: (h, params) => {
                            return h('p', formatNumber(params.row.billMoney, 2, ','))
                        },
                    }, {
                        title: this.$t('m.i.billInfo.dueDt'),
                        key: 'dueDt',
                        sortable: true,
                        hiddenCol: false,
                        render:(h, params)=>{
                            return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
                        }
                    }, {
                        title: this.$t('m.i.billInfo.remitDt'),
                        key: 'remitDt',
                        hiddenCol: false,
                        render:(h, params)=>{
                            return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
                        }
                    }, {
                        title: this.$t('m.i.billInfo.drwrName'),
                        key: 'drwrName',
                        sortable: true,
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.billInfo.acptName'),
                        key: 'acptName',
                        hiddenCol: false,
                        sortable: true,
                    }, {
                        title: this.$t('m.i.billInfo.acptBankNo'),
                        key: 'acptBankNo',
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.billInfo.acptBankName'),
                        key: 'acptBankName',
                        hiddenCol: false,
                        sortable: true,
                    }, {
                        title: this.$t('m.i.billInfo.acptGuarntrBankName'),
                        key: 'acptGuarntrBankName',
                        sortable: true,
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.be.cfmPayBankName'),
                        key: 'cfmAppBankName',
                        sortable: true,
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.billInfo.discBankName'),
                        key: 'discBankName',
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.billInfo.discGuarntrBankName'),
                        key: 'discGuarntrBankName',
                        sortable: true,
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.billInfo.guarntrTrustBankName'),
                        key: 'guarntrTrustBankName',
                        sortable: true,
                        hiddenCol: false
                    }, {
                        title: this.$t('m.i.common.acctDt'),
                        key: 'acctDt',
                        hiddenCol: false,
                        render:(h, params)=>{
                            return h('span', params.row.acctDt ? this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
                        }
                    }, {
                        title: this.$t('m.i.common.acctStatus'),
                        key: 'acctStatus',
                        hiddenCol: false,
                        render:(h, params)=>{
                            let dictValue = this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.acctStatus);
                            return h("span", {
                              domProps: {
                                title: dictValue
                              }
                            }, dictValue);
                        }
                    },
                ],
                param : {},
                busiTypeList : [
                    {
                        key: 'RBT02',
                        value: '再贴现质押回购'
                    }, {
                        key: 'BT02',
                        value: '质押式回购'
                    }
                ],
                selectData : [],
                acctStatusList:[],
                showAcctRecordWin : false,
                //集中授权管理
                ownedBrchName:"",
                ownedBrchNo:"",
                ownedBrchNames:"",
                ownedBrchNos:"",
                licenseFlag:false,
                authPath: this.$route.path ,
               // brchNoWin : false,
            }
        },
      components: {
        //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
      },
        methods: {
            formatBusiType(value) {
                if (value == 'RBT02') return '再贴现质押回购'
                else if (value == 'BT02') return '质押式回购'
            },
            onCurrentChange(data) {
                this.selectData[0] = data
            },
            onCurrentChangeCancel() {
                this.selectData = []
            },
            showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
                this.billId = billId;
                this.billNo = billNo;
                this.billRangeStart=billRangeStart;
                this.billRangeEnd=billRangeEnd;
                this.showBillInfoWin = true;
            },
            billInfoWinClose() {
              this.billId = null;
              this.billNo = null;
              this.billRangeStart = null;
              this.billRangeEnd = null;
                this.showBillInfoWin = false;
            },
            formSearch() {
                this.$refs.datagrid.dataChange(1);
            },
          handleDealDtChange(arr){
            if (arr && arr.length >= 2) {
              this.formItem.minDealDt = arr[0].replace(/-/g, "");
              this.formItem.maxDealDt = arr[1].replace(/-/g, "");
              this.dealDtTmp = [arr[0],arr[1]];
            } else {
              this.formItem.minDealDt = "";
              this.formItem.maxDealDt = "";
              this.dealDtTmp = [];
            }
          },
          handleDueDtChange(arr){
            if (arr && arr.length >= 2) {
              this.formItem.minDueDt = arr[0].replace(/-/g, "");
              this.formItem.maxDueDt = arr[1].replace(/-/g, "");
              this.dueDtTmp = [arr[0],arr[1]];
            } else {
              this.formItem.minDueDt = "";
              this.formItem.maxDueDt = "";
              this.dueDtTmp = [];
            }
          },
            formSearchReset() {
              this.dealDtTmp = [];
              this.dueDtTmp = [];
                this.formItem.ownedBrchNo = "";
                this.formItem.ownedBrchName = "";
                this.formItem.ownedBrchNos = this.$store.getters.userInfo.brchNo;
                this.formItem.ownedBrchNames = this.$store.getters.userInfo.brchName;
                this.$refs.formItem.resetFields();
                this.formItem.minDealDt = ''
                this.formItem.minDueDt = ''
                this.formItem.maxDealDt = ''
                this.formItem.maxDueDt = ''
            },
          pageShowFormatBillOrigin(map, groupCode, key) {
            if (key == null || key === '') {
              return '-';
            }
            if (key.toString() === 'CS00') {
              return '-';
            }
            return this.getDictValueFromMap(map, groupCode, key);
          }
            //根据弹框所选数据进行赋值
            /*brchNoChange(info) {
              let objs = [];
              if(info instanceof Array){
                objs = info;
              } else {
                objs[0] = info;
              }
              let brchNos = "";
              let brchNames = "";
              for(var i=0;i<objs.length; i++){
                brchNos += objs[i].id + ',';
                brchNames += objs[i].title + ',';
              }
              this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
              this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
              this.brchNoWin = false;
            },
            brchNoWinOpen() {
              this.brchNoWin = true;},
            brchNoWinClose() {
              this.brchNoWin = false;
            },*/
        },
        mounted() {
            this.getDictListByGroups('BusiType,AcctFlag,CDMedia,DraftTypeCode,BillOrigin').then(res => {
              this.billOriginList = res.get("BillOrigin");
              this.acctStatusList = res.get("AcctFlag");
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
        }
    }

</script>
