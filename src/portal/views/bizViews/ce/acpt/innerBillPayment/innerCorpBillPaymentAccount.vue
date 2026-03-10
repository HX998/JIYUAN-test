<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <!--<h-form-item prop="applBrchName" :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label" v-if="mode==='2'">
                  <h-input v-model="formItem.applBrchName" placeholder="" icon="android-search" @on-click="brchCodeWin=true" readonly
                           clearable @on-clear="clearVal()" :title="formItem.applBrchName"></h-input>
                </h-form-item>
                <h-form-item prop="prsttnName" :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label" v-if="mode==='1'">
                  <h-input v-model="formItem.prsttnName" placeholder="" :title="formItem.prsttnName" icon="android-search" @on-click="brchCodeWin=true" readonly
                           clearable @on-clear="clearVal()"></h-input>
                </h-form-item>-->
                <!--<show-cpes-branch  :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label" v-if="mode==='2'"
                                   :brchCode.sync="formItem.applBrchCode"  :cpesBrchName.sync="formItem.applBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="applBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <show-cpes-branch  :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label" v-if="mode==='1'"
                                   :bankNo.sync="formItem.prsttnBankNo"  :cpesBrchName.sync="formItem.prsttnName" :isQueryByBankNo="true"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="prsttnName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>-->
                <h-form-item :label="$t('m.i.billInfo.prsttnName')" prop="prsttnName" class="h-form-long-label">
                  <h-input v-model="formItem.prsttnName" :maxlength=80></h-input>
                </h-form-item>
                <h-form-item prop="riskStatus" :label="$t('m.i.billInfo.riskStatus')">
                  <h-select v-model="formItem.riskStatus" placeholder="" showTitle>
                    <h-option v-for="item in riskStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-form-item prop="minBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-form-item prop="maxBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item prop="remitDtRange" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker :value="formItem.remitDtRange" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder="" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDtRange" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="formItem.dueDtRange" type="daterange" showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder="" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      :url="queryBillUrl"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account" >{{$t('m.i.ce.account')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton"
                          :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                          @printSuccessCallback="printSuccessCallback"></acct-record>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
        <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWin=false"
                          @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->
      </h-col>
    </h-row>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
import {
  formatBillRange,
  formatNumber,
  getConnectMode,
  getDictListByGroups,
  getDictValueFromMap,
  post
} from "@/api/bizApi/commonUtil";

export default {
    name: "innerCorpBillPaymentAccount",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        //brchCodeWin:false,
        showPrintButton: false,
        showBillInfoWin: false,
        billId: "",
        formItem: {
          applBrchCode: "",
          applBrchName:"",
          riskStatus: '',
          billType: 'AC02',
          billClass: '',
          billNo: '',
          billNoLike: '',
          minBillMoney: '',
          maxBillMoney: '',
          remitDtRange: [],
          dueDtRange: [],
          order:'',
          settleStatus : 'R20',
          prsttnRespStatusList : ['RV21'],
          notAcptStatusList : ['3'],
          acctFlagList:['2','0'],
          minRemitDt:"",
          maxRemitDt:"",
          minDueDate:"",
          maxDueDate:"",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          prsttnName:"",
          prsttnBankNo:"",
          billOrigin:"",
          reverseBillNo:"",
          minBillRangeStart:"",
          maxBillRangeEnd:""
        },
        columns: [],
        autmentColumns:[
        {
          type: 'selection',
          key: 'multiSelect',
          width: 60,
          hiddenCol: false,
        },
        {
          type: 'index',
          key: 'numOrder',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key: 'billOrigin',
          align:'center',
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: 'billNo',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align:'center',
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
          }
        },
        {
          title: this.$t("m.i.billInfo.billClass"),
          key: 'billClass',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"CDMedia",params.row.billClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title:  this.$t("m.i.billInfo.flowStatus"),
          key: 'billStatus',
          hiddenCol: false,
          render:(h,params) => {
            // if(params.row.prsttnRespStatus == null || params.row.prsttnRespStatus === ""){
            //   let flowStatusName = params.row.flowStatusName;
            //   return h("span", flowStatusName);
            // }else if(params.row.flowStatusName != null && params.row.flowStatusName != "" && params.row.flowStatusName != 'null') {
            let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.billStatus);
            let name = prsttnRespStatusName.replace(/应答方：/,"");
            return h("span", name);
            // } else {
            //   let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.prsttnRespStatus);
            //   let name = prsttnRespStatusName.replace("应答方：","");
            //   return h("span", name);
            // }
          }
        },
        {
          title:  this.$t("m.i.billInfo.riskStatus"),
          key: 'riskStatus',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title:  this.$t("m.i.billInfo.billPackageMoney"),
          key: 'billMoney',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title:  this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title:  this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title:  this.$t("m.i.billInfo.remitDt"),
          key: 'remitDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.remitDt == null || params.row.remitDt === ""){
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t("m.i.billInfo.dueDt"),
          key: 'dueDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t("m.i.billInfo.prsttnName"),
          key: 'applBrchName',
          hiddenCol: false,
          sortable: true,
        }
      ],
        defaultColumns: [
        {
          type: 'selection',
          key: 'multiSelect',
          width: 60,
          hiddenCol: false,
        },
        {
          type: 'index',
          key: 'numOrder',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key: 'billOrigin',
          align:'center',
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: 'billNo',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align:'center',
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
          }
        },
        {
          title: this.$t("m.i.billInfo.billClass"),
          key: 'billClass',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"CDMedia",params.row.billClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title:  this.$t("m.i.billInfo.flowStatus"),
          key: 'flowStatusName',
          hiddenCol: false,
          render:(h,params) => {
            if(params.row.prsttnRespStatus == null || params.row.prsttnRespStatus === ""){
              let flowStatusName = params.row.flowStatusName;
              return h("span", flowStatusName);
            }else if(params.row.flowStatusName != null && params.row.flowStatusName != "" && params.row.flowStatusName != 'null') {
              let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.prsttnRespStatus);
              let name = prsttnRespStatusName.replace(/应答方：/,"") + "(" + params.row.flowStatusName + ")";
              return h("span", name);
            } else {
              let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.prsttnRespStatus);
              let name = prsttnRespStatusName.replace("应答方：","");
              return h("span", name);
            }
          }
        },
        {
          title:  this.$t("m.i.billInfo.riskStatus"),
          key: 'riskStatus',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title:  this.$t("m.i.billInfo.billPackageMoney"),
          key: 'billMoney',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title:  this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
          hiddenCol: false,
        },
        {
          title:  this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title:  this.$t("m.i.billInfo.remitDt"),
          key: 'remitDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.remitDt == null || params.row.remitDt === ""){
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t("m.i.billInfo.dueDt"),
          key: 'dueDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t("m.i.billInfo.prsttnName"),
          key: 'prsttnName',
          hiddenCol: false,
        }
      ],
        acptIds: "",
        acctRecordUrl: "",
        acctRecordParam: {},
        riskStatusList: [],
        billClassList: [],
        billOriginList : [],
        dictMap: new Map(),
        showAcctRecordWin: false,
        acctSubmitFlag: false,
        ifShowMore: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        mode:"",
        queryBillUrl:"",
        accountUrl:"",
        inOutFlagList: ["2","3"],
      }
    },
    created(){
      /**
       * 获取是对接模式还是直连模式
       */
      getConnectMode().then(res=>{
        this.mode = res;
        // if (this.mode==="2") {
        //   this.accountUrl="/ce/acpt/innerBillPayment/innerCorpBillPaymentAccount/func_accountPayment";
        //   this.queryBillUrl="/ce/acpt/innerBillPayment/innerCorpBillPaymentAccount/func_prsttnQueryCorpPaymentApplyNeedRespForAccount";
        //   this.acctRecordUrl="/ce/acpt/innerBillPayment/innerCorpBillPaymentAccount/func_getAcctFlow"
        //   this.formItem.order="RESP_DT,id asc";
        // }else {
          this.accountUrl = "/ce/acpt/innerBillPayment/innerCorpBillPaymentAccount/func_innerCorpAccountInCore";
          this.queryBillUrl = "/ce/acpt/innerBillPayment/innerCorpBillPaymentAccount/func_queryCorpPaymentApplyNeedResp";
          this.acctRecordUrl = "/ce/acpt/innerBillPayment/innerCorpBillPaymentAccount/func_accountFlow";
          this.formItem.order="PRSTTN_RESP_DT,id asc"
        // }
        this.$nextTick(()=>{
          // if (this.mode==="1"){
            this.columns=this.defaultColumns;
          // } else {
          //   this.columns=this.autmentColumns;
          // };
          this.$refs.datagrid.dataChange(1);
          this.$refs.datagrid.createShowCol(this.columns);
        })
      })
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,CDMedia,RiskStatus,BarterTrustStatus,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.riskStatusList = res.get("RiskStatus");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (this.mode==='2'){
          this.formItem.applBrchCode = info.brchCode;
          this.formItem.applBrchName = info.brchFullNameZh;
        }else {
          this.formItem.prsttnBankNo = info.transBrchBankNo;
          this.formItem.prsttnName = info.brchFullNameZh;
        }
        this.brchCodeWin = false;
      },*/
      clearVal() {
        if (this.mode==='2') {
          this.formItem.applBrchName = "";
          this.formItem.applBrchCode = "";
        }else {
          this.formItem.prsttnName = "";
          this.formItem.prsttnBankNo = "";
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.remitDtRange = [arr[0], arr[1]];
          this.formItem.minRemitDt = arr[0].toString().replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].toString().replace(/-/g, "");
        } else {
          this.formItem.remitDtRange = [];
          this.formItem.minRemitDt="";
          this.formItem.maxRemitDt="";
        }
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.dueDtRange = [arr[0], arr[1]];
          this.formItem.minDueDate=arr[0].toString().replace(/-/g, "");
          this.formItem.maxDueDate=arr[1].toString().replace(/-/g, "");
        } else {
          this.formItem.dueDtRange = [];
          this.formItem.minDueDate="";
          this.formItem.maxDueDate="";
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
        this.formItem.remitDtRange = [];
        this.formItem.dueDtRange = [];
        this.formItem.minDueDate="";
        this.formItem.maxDueDate="";
        this.formItem.minRemitDt="";
        this.formItem.maxRemitDt="";
        this.formItem.prsttnName=""
        this.clearVal();
      },
      //记账
      account() {
        let list = this.$refs.datagrid.selects;
        if (null === list || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let ownedBrchNo = "";
        let flag = true;
        list.forEach(row => {
          if (ownedBrchNo !== "" && ownedBrchNo !== row.ownedBrchNo) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据记账" });
            return flag = false;
          }
          ownedBrchNo = row.ownedBrchNo;
          this.formItem.ownedBrchNo = ownedBrchNo;
        });
        if(!flag){return;}

        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账吗?",
          onOk: () => {
            this.getEntryInfo();
          }
        });
      },
      //获取分录信息
      getEntryInfo() {
        let ids = [];
        let list = this.$refs.datagrid.selects;
        for(let i=0; i<list.length; i++) {
          ids.push(list[i].id);
        }
        this.acptIds = ids;
        this.acctRecordParam = {ids: this.acptIds, billType : "AC02",ownedBrchNo:this.formItem.ownedBrchNo,licenseFlag:this.licenseFlag};
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        let obj={ids: this.acptIds, billType : "AC02",ownedBrchNo:this.formItem.ownedBrchNo,licenseFlag:this.licenseFlag}
        if (this.mode==='1'){
          Object.assign(obj,{ids:this.acptIds})
        } ;
        post(obj, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.acctRecordParam = {};
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      },

      /*//根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    }
  };
</script>

<style scoped>

</style>
