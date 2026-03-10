<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
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
               <!-- <h-form-item prop="applBrchName" :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label" v-if="mode==='2'">
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
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item prop="riskStatus" :label="$t('m.i.billInfo.riskStatus')">
                  <h-select v-model="formItem.riskStatus" placeholder="" showTitle>
                    <h-option v-for="item in RiskStatusList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass"  placeholder="" showTitle>
                    <h-option v-for="item in BillClassList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
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
                <h-form-item prop="acceptorBankNo" v-show="false">
                  <h-input v-model="formItem.acceptorBankNo"></h-input>
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
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            :row-select="true"
            :has-select="false"
            :url="queryBillUrl"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="sendPrsttnSign('SU00')" v-if="authObj.sendPrsttnSignAppBtn && (this.btnAuth.sendPrsttnSignAgree === undefined ? true : this.btnAuth.sendPrsttnSignAgree.isShow) ">{{$t("m.i.common.agree")}}</h-button>
              <h-button type="primary" @on-click="sendPrsttnSign('SU01')" v-if="authObj.sendPrsttnSignRefBtn">{{$t("m.i.common.refuse")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--<show-hvps-bank :showHvpsBank="showHvpsBank" @showHvpsBankClose="showHvpsBankClose" @showHvpsBankSubmit="showHvpsBankSubmit"></show-hvps-bank>-->
    <!-- 提示付款拒绝弹窗 -->
    <h-msg-box v-model="refuseWin" width="400" @on-close="refuseWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>提示付款拒绝</span>
      </p>
      <div>
        <h-form :model="refuseFormItem" :label-width="115" ref="refuseFormItem" cols="1" class="h-form-search">
          <h-form-item prop="prsttnRefuseReasonCode" :label="$t('m.i.ce.prsttnRefuseReasonCode')" required >
            <h-select v-model="refuseFormItem.prsttnRefuseReasonCode" placeholder="" showTitle @on-change="reasonCodeChange">
              <h-option v-for="item in refuseCodeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="prsttnRefuseReason" :label="$t('m.i.be.prsttnRefuseReason')" class="h-form-height-auto"
                       :required = "this.refuseFormItem.prsttnRefuseReasonCode == 'CP06'">
            <h-input v-model="refuseFormItem.prsttnRefuseReason" placeholder="" type="textarea" :autosize="{minRows: 2, maxRows: 4}"
                      :maxlength="150" :readonly = "otherRefuse" :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item prop="prsttnAnswerRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto">
            <h-input v-model="refuseFormItem.prsttnAnswerRemark" placeholder="" type="textarea" :autosize="{minRows: 2, maxRows: 4}" :maxlength="150" :lengthByByte="false"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="refuseWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="refuseWinSubmit()">{{$t("m.i.common.confirm")}}</h-button>
        </div>
      </div>
    </h-msg-box>
    <!--查询提示付款人信息弹窗-->
    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWin=false"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
import {formatBillRange, formatNumber, getConnectMode, post} from "@/api/bizApi/commonUtil";

export default {
    name: "promptCorpPaymentResponseMain",
    components: {
      ShowHvpsBank:()=>import(/* webpackChunkName: "shcpe/cpes/hvpsbank/showHvpsBank" */`@/views/bizViews/shcpe/cpes/hvpsbank/showHvpsBank`),
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        otherRefuse:true,
        //brchCodeWin:false,
        signmkType: "",
        refuseWin: false,
        showBillInfoWin: false,
        billId: null,
        billRangeStart:"",
        billRangeEnd:"",
        paymentRespIsDeduct : "",
        refuseFormItem: {
          ids: '',
          billNos :'',
          billType:'AC02',
          prsttnRefuseReasonCode: '',
          respFlag: '',
          prsttnRefuseReason: '',
          prsttnAnswerRemark:'',
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          licenseFlag: false,
          authPath: this.$route.path
        },
        submitFlag: false,
        refuseCodeList: [],
        billOriginList : [],
        formItem: {
          applBrchName:"",
          applBrchCode:'',
          settleBusiType:'',
          billNo:'',
          billNoLike: '',
          //acptBankNo:'',
          //acptBankName:'',
          maxBillMoney:'',
          minBillMoney:'',
          acptDtShow:'',
          dueDtShow:'',
          minIssuDate:'',
          maxIssuDate:'',
          billType:'AC02',
          billClass:'',
          riskStatus:'',
          order:'',
          billStatusList : ['RV10','RV12'],
          prsttnRespStatusList : ['RV10','RV12'],
          notAcptStatusList : ['3'],
          remitDtRange: [],
          dueDtRange: [],
          minRemitDt:"",
          maxRemitDt:"",
          minDueDate:"",
          maxDueDate:"",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          maxDueDt:window.sessionStorage.getItem("workDate"),
          prsttnName:"",
          prsttnBankNo:"",
          billOrigin:"",
          reverseBillNo:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          inOutFlagList: ["2","3"],
        },
        btnAuth:"",
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
          title: this.$t("m.i.common.index"),
          align: 'center',
          width: 60,
          hiddenCol:false,
        },
        {
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billClass"),
          key: 'billClass',
          hiddenCol:false,
          render:(h,params) => {
            let list = this.getDictValueFromMap(this.dictMap,"CDMedia",params.row.billClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billNo"),
          key: 'billNo',
          hiddenCol:false,
          sortable: true,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row.billId);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title:  this.$t("m.i.billInfo.billMoneyByUnit"),
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
          title:  this.$t("m.i.billInfo.remitDt"),
          key: 'remitDt',
          hiddenCol: false,
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
          hiddenCol:false,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t("m.i.billInfo.flowStatus"),
          key: 'billStatus',
          hiddenCol:false,
          render:(h,params) => {
            let prsttnRespStatusName = this.getDictValueFromMap(this.dictMap, "BarterTrustStatus", params.row.billStatus).replace("应答方：", "");
            if (prsttnRespStatusName!=null){
              let name = prsttnRespStatusName.replace(/应答方：/,"");
              return h("span", name);
            }
            return h("span","-")
          }
        },
        {
          title:  this.$t("m.i.billInfo.riskStatus"),
          key: 'riskStatus',
          hiddenCol:false,
          render:(h,params) => {
            let list = this.getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        // {
        //   title:  this.$t("m.i.billInfo.acptProtocalNo"),
        //   key: 'acptProtocalNo',
        //   hiddenCol: false,
        // },
        // {
        //   title:  this.$t("m.i.ce.promNoteNo"),
        //   key: 'promNoteNo',
        //   hiddenCol: false,
        // },
        {
          title:  this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
          sortable: true,
          hiddenCol:false,
        },
        {
          title:  this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol:false,
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
          title: this.$t("m.i.common.index"),
          align: 'center',
          width: 60,
          hiddenCol:false,
        },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
        {
          title: this.$t("m.i.billInfo.billClass"),
          key: 'billClass',
          hiddenCol:false,
          render:(h,params) => {
            let list = this.getDictValueFromMap(this.dictMap,"CDMedia",params.row.billClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
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
          hiddenCol:false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row.billId,params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                }
              }
            }, params.row.billNo);
          }
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
          title:  this.$t("m.i.billInfo.remitDt"),
          key: 'remitDt',
          hiddenCol: false,
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
          hiddenCol:false,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t("m.i.billInfo.flowStatus"),
          key: 'flowStatusName',
          hiddenCol:false,
          render:(h,params) => {
            if(params.row.prsttnRespStatus == null || params.row.prsttnRespStatus === ""){
              let flowStatusName = params.row.flowStatusName;
              return h("span", flowStatusName);
            }else if(params.row.flowStatusName != null && params.row.flowStatusName != "" && params.row.flowStatusName != 'null') {
              let prsttnRespStatusName = this.getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.prsttnRespStatus).replace("应答方：","");
              let name = prsttnRespStatusName + "(" + params.row.flowStatusName + ")";
              return h("span", name);
            } else {
              let prsttnRespStatusName = this.getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.prsttnRespStatus);
              let name = prsttnRespStatusName;
              return h("span", name);
            }
          }
        },
        {
          title:  this.$t("m.i.billInfo.riskStatus"),
          key: 'riskStatus',
          hiddenCol:false,
          render:(h,params) => {
            let list = this.getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title:  this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
          hiddenCol:false,
        },
        {
          title:  this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          hiddenCol:false,
        },
        {
          title:  this.$t("m.i.billInfo.prsttnName"),
          key: 'prsttnName',
          hiddenCol: false,
        }
      ],
        authObj: {
          sendPrsttnSignAppBtn:true,
          sendPrsttnSignRefBtn:true,
        },
        ifShowMore: false,
        moveUpDisabled: false,
        moveDownDisabled: false,
        //showHvpsBank: false,
        BillClassList: [],
        RiskStatusList: [],
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        dictMap: null,
        queryBillUrl:"",
        answerUrl:"",
        mode:""
      }
    },

    created(){
      /**
       * 获取是对接模式还是直连模式
       */
      getConnectMode().then(res=>{
        this.mode = res;
        // if (this.mode==="2") {
        //   this.answerUrl="/ce/acpt/innerBillPayment/promptCorpPaymentResponseMain/func_prsttnSavePrsttnSignBill";
        //   this.queryBillUrl="/ce/acpt/innerBillPayment/promptCorpPaymentResponseMain/func_queryPaymentApplyNeedResp";
        //   this.formItem.order="APPL_DT,id asc";
        // }else {
          this.answerUrl = "/ce/acpt/innerBillPayment/promptCorpPaymentResponseMain/func_savePrsttnSignBill";
          this.queryBillUrl = "/ce/acpt/innerBillPayment/promptCorpPaymentResponseMain/func_queryCorpPaymentApplyNeedResp";
          this.formItem.order="PRSTTN_DT,id asc"
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
      this.getDictListByGroups("CDMedia,DraftTypeCode,RiskStatus,BarterTrustStatus,DishonorCode,BillOrigin").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.RiskStatusList = res.get("RiskStatus");
        this.refuseCodeList = res.get("DishonorCode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      this.formItem.maxDueDt = window.sessionStorage.getItem("workDate");

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
      /**
       * 获取业务参数商票提示付款是否扣款
       */
      post({ paramKey: "ce.acpt.corp_payment_resp_is_deduct" }, "/sm/auth/findArraySystemParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.paymentRespIsDeduct = res.data.retData[0];
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods:{
      //根据弹框所选数据进行赋值
     /* brchCodeChange(info) {
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
      handleSearch() {
        // let acptDt = this.formItem.acptDtShow.replace(/-/g,"");
        // let acptDtRange = acptDt.split("  ");
        // this.formItem.minIssuDate = acptDtRange[0];
        // this.formItem.maxIssuDate = acptDtRange[1];
        // let dueDt = this.formItem.dueDtShow.replace(/-/g,"");
        // let dueDtRange = dueDt.split("  ");
        // this.formItem.minDueDate = dueDtRange[0];
        // this.formItem.maxDueDate = dueDtRange[1];
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.remitDtRange = [arr[0], arr[1]];
          this.formItem.minRemitDt=arr[0].toString().replace(/-/g, "");
          this.formItem.maxRemitDt=arr[1].toString().replace(/-/g, "");
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
        }else {
          this.formItem.dueDtRange = [];
          this.formItem.minDueDate="";
          this.formItem.maxDueDate="";
        }
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.acceptorBankName = '';
        this.$refs.formItem.resetFields();
        this.formItem.remitDtRange = [];
        this.formItem.dueDtRange = [];
        this.formItem.billClass = '';
        this.formItem.riskStatus = '';
        this.formItem.prsttnName="";
        this.formItem.prsttnBankNo="";
        this.clearVal();
      },
      sendPrsttnSign(signmk){
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
          this.refuseFormItem.ownedBrchNo = ownedBrchNo;
        });
        if(!flag){return;}
        this.signmkType = signmk;
        if (signmk === "SU00") {
          let tipMsg = "";
          if(this.paymentRespIsDeduct === "0"){
            //不扣款 提示
            tipMsg = "商票提示付款应答不进行扣款，请线下确认资金情况。确定应答同意吗?";
          }else{
            tipMsg = "确定应答同意吗?";
          }
          this.$hMsgBox.confirm({
            title: "确认",
            content: tipMsg,
            onOk: () => {
              let lineId = Array();
              let acptIds = Array();
              let billNos = Array();
              let billType = "AC02";
              for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
                lineId.push(this.$refs.datagrid.selects[i].id);
                acptIds.push(this.$refs.datagrid.selects[i].id);
                billNos.push(this.$refs.datagrid.selects[i].billNo);
              }
              this.$loadingbox.open({
                title: "请稍后..."
              });
              post({ids:lineId.join(','),acptIds:acptIds, billType:billType, billNos: billNos, respFlag:signmk
              ,ownedBrchNo:ownedBrchNo,licenseFlag:this.licenseFlag,prxySgntr:'PS00'},this.answerUrl).then(res =>{
                if (res) {
                  this.$loadingbox.close();
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this,{info:"操作成功"});
                    this.$refs.datagrid.dataChange(1);
                    this.$refs.datagrid.selects = [];
                  } else {
                    this.$msgTip.error(this,{info:msg});
                    this.$refs.datagrid.dataChange(1);
                    this.$refs.datagrid.selects = [];
                  }
                } else {
                  this.$loadingbox.close();
                  this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
                }
              });
            }
          })
        }else {
          this.refuseWin = true;
        }
      },
      refuseWinSubmit() {
        let lineId = Array();
        let billNos = Array();
        let billType = "AC02";
        for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
          lineId.push(this.$refs.datagrid.selects[i].id);
          billNos.push(this.$refs.datagrid.selects[i].billNo);
        }
        this.refuseFormItem.ids = lineId.join(',');
        this.refuseFormItem.respFlag = this.signmkType;
        this.refuseFormItem.billNos = billNos;
        this.refuseFormItem.billType = billType;
        this.refuseFormItem.licenseFlag = this.licenseFlag;
        this.$refs["refuseFormItem"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.refuseFormItem, this.answerUrl).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: "操作成功" });
                  this.refuseWinClose();
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                  /*this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];*/
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      refuseWinClose() {
        this.refuseWin = false;
        this.$refs.refuseFormItem.resetFields();
      },
      /**超链接点击票号弹出票据明细**/
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },

      //根据弹框所选数据进行赋值
     /* brchNoChange(info) {
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
      // queryHvpsBank(){
      //   this.showHvpsBank = true;
      // },
      // showHvpsBankClose(){
      //   this.showHvpsBank = false;
      // },
      // showHvpsBankSubmit(info){
      //   if (info === null) {
      //     this.$msgTip.error(this,{info:"请先选择记录！"});
      //     return;
      //   }
      //   this.formItem.acptBankNo = info.actorBrchBankNo;
      //   this.formItem.acptBankName = info.actorBrchName;
      //   this.showHvpsBank = false;
      // },

      reasonCodeChange(){
        if(this.refuseFormItem.prsttnRefuseReasonCode == 'CP06'){
          this.otherRefuse = false;
        }else{
          this.refuseFormItem.prsttnRefuseReason = "";
          this.otherRefuse = true;
        }
      },

    },
  };
</script>

<style scoped>

</style>
