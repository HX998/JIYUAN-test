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
         <!--       <h-form-item :label="$t('m.i.common.brchName')" prop="brchNos">
                  <h-input v-model="formItem.brchNos" placeholder="" readonly
                           icon="android-search" @on-click="queryBrchNo"
                           v-show="false"
                  ></h-input>
                  <h-input v-model="formItem.branchName" placeholder="" readonly
                           icon="android-search" @on-click="queryBrchNo" :title="formItem.branchName"
                  ></h-input>
                </h-form-item>-->

                <show-branch v-model="formItem.branchName" ::label="$t('m.i.common.brchName')"  placeholder=""  prop="branchName"
                             :showCheckBox="true"     :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
                </show-branch>
              <!--  <h-form-item prop="applBrchName" :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label" v-if="mode==='2'">
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
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="riskStatus" :label="$t('m.i.billInfo.riskStatus')">
                  <h-select v-model="formItem.riskStatus" placeholder="" showTitle>
                    <h-option v-for="item in riskStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
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
                <!--解付日期-->
                <h-form-item prop="duePayDtRange" :label="$t('m.i.billInfo.duePayDt')">
                  <h-date-picker :value="formItem.duePayDtRange" type="daterange" showFormat :editable=false
                                 @on-change="handleDuePayDtChange" placeholder="" autoPlacement></h-date-picker>
                </h-form-item>
                <!--流程状态-->
                <h-form-item prop="prsttnRespStatus" :label="$t('m.i.billInfo.flowStatus')">
                  <h-select v-model="formItem.prsttnRespStatus" placeholder="">
                    <h-option v-for="item in flowStatusList" :value="item.key" :key="item.key">{{getFlowStatus(item)}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctStatus')" prop="acctFlag">
                  <h-select v-model="formItem.acctFlag" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.ce.billMoneyPackageTotalAmt')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pe.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns"
                          highlightRow
                          :row-select="true"
                          :has-select="false"
                          :url="queryBillUrl"
                          :bindForm="formItem"
                          :auto-load="false"
                          @getSumMoneyAndTotal="getSumMoneyAndTotal"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="exportExcel()">{{$t('m.i.common.exportData')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
        <!--查询提示付款人信息弹窗-->
        <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWin=false"
                          @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
       <!-- <show-branch-sec :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                     :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch-sec>-->
      </h-col>
    </h-row>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
import {
  exportList,
  formatBillRange,
  formatNumber,
  getConnectMode,
  getDictListByGroups,
  getDictValueFromMap,
  post
} from "@/api/bizApi/commonUtil";

export default {
    name: "paymentCorpTrackSearch",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      /*ShowLicenseBranch: () => import(/!* webpackChunkName: "sm/auth/branch/showLicenseBranch" *!/`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
      ShowBranchSec:()=>import(/!* webpackChunkName: "be/market/rediscount/common/showBranch" *!/`@/views/bizViews/be/market/rediscount/common/showBranch`)*/
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        tempShowExcelTemplateWin:false,
        param : null,
        //showBranchWin:false,
        rows : null,
        //brchCodeWin:false,
        showBillInfoWin: false,
        acctStatusList : [],
        billId: "",
        billNo: "",
        billRangeStart:"",
        billRangeEnd:"",
        formItem: {
          acctFlag:"",
          brchNos: "",
          branchName:"",
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
          billStatus:'',
          duePayDtRange: [],
          order:'ID,ACPT_PROTOCAL_NO,REMIT_DT desc',
          minRemitDt:"",
          maxRemitDt:"",
          minDueDate:"",
          maxDueDate:"",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:this.$store.getters.userInfo.brchName,
          ownedBrchNos:this.$store.getters.userInfo.brchNo,
          authPath: this.$route.path,
          prsttnName:"",
          prsttnBankNo:"",
          drwrCustNo : '',
          minDuePayDate:"",
          maxDuePayDate:"",
          billOrigin:"",
          reverseBillNo:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          inOutFlagList: ["2","3"],
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
            title:  this.$t("m.i.common.brchName"),
            key: 'rcvBrchName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
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
            title: this.$t('m.i.ce.deductStatus'),
            key: "deductStatus",
            hiddenCol: false,
            render: (h, params) => {
              let deductStatus = "";
              if(params.row.deductStatus == "0" || params.row.deductStatus == "2" || params.row.deductStatus == null){
                deductStatus = "未扣款";
              }else if(params.row.deductStatus == "1"){
                deductStatus = "已扣款";
              }else if(params.row.deductStatus == "3"){
                deductStatus = "已冲正";
              }else if(params.row.deductStatus == "4"){
                deductStatus = "冲正失败";
              }
              return h("span", deductStatus);
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
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
              //   if(params.row.prsttnRespStatus == null || params.row.prsttnRespStatus === ""){
              //     let flowStatusName = params.row.flowStatusName;
              //     return h("span", flowStatusName);
              //   }else if(params.row.flowStatusName != null && params.row.flowStatusName != "" && params.row.flowStatusName != 'null') {
              let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.billStatus);
              let name = prsttnRespStatusName.replace(/应答方：/,"");
              return h("span", name);
              //   } else {
              //     let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.prsttnRespStatus);
              //     let name = prsttnRespStatusName.replace("应答方：","");
              //     return h("span", name);
              //   }
            }
          },
          {
            title:  this.$t("m.i.billInfo.duePayDt"),
            key: 'applDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.applDt == null || params.row.applDt === ""){
                return "";
              }
              let date = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
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
            title:  this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
          },
          {
            title:  this.$t("m.i.ce.promNoteNo"),
            key: 'promNoteNo',
            hiddenCol: false,
          },
          {
            title:  this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            sortable: true,
            hiddenCol: false,
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
            title:  this.$t("m.i.common.brchName"),
            key: 'createBrchName',
            hiddenCol: false,
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
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
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
            title: this.$t('m.i.ce.deductStatus'),
            key: "deductStatus",
            hiddenCol: false,
            render: (h, params) => {
              let deductStatus = "";
              if(params.row.deductStatus == "0" || params.row.deductStatus == "2" || params.row.deductStatus == null){
                deductStatus = "未扣款";
              }else if(params.row.deductStatus == "1"){
                deductStatus = "已扣款";
              }else if(params.row.deductStatus == "3"){
                deductStatus = "已冲正";
              }else if(params.row.deductStatus == "4"){
                deductStatus = "冲正失败";
              }
              return h("span", deductStatus);
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acptAcctStatus",
            hiddenCol: false,
            render:(h, params)=>{
              if (params.row.acptAcctStatus === null || params.row.acptAcctStatus === "" || params.row.acptAcctStatus === "n") {
                return ""
              } else {
                let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acptAcctStatus);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
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
            title:  this.$t("m.i.billInfo.duePayDt"),
            key: 'paymentDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.paymentDt == null || params.row.paymentDt === ""){
                return "";
              }
              let date = this.$moment(params.row.paymentDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
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
            title:  this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            sortable: true,
            hiddenCol: false,
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
            title:  this.$t("m.i.billInfo.prsttnName"),
            key: 'prsttnName',
            hiddenCol: false,
          }
        ],
        riskStatusList: [],
        flowStatusList:[],
        duePayDtRange: [],
        billOriginList : [],
        sumMoney: "",
        total: "",
        billClassList: [],
        queryUrl: "",
        dictMap: new Map(),
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
        downLoadUrl:"",
      }
    },
    computed:{
      getFlowStatus(){
        return function(item) {
          return item.value.substring(item.value.indexOf("：")+1)
        }
      }
    },
    created(){
      /**
       * 获取是对接模式还是直连模式
       */
      getConnectMode().then(res=>{
        this.mode = res;
        // if (this.mode==="2") {
        //   this.queryBillUrl="/ce/acpt/innerBillPayment/paymentCorpTrackSearch/func_prsttnQueryCorpPaymentApplyNeedRespForCorpTrack";
        //   this.downLoadUrl="/ce/acpt/innerBillPayment/paymentCorpTrackSearch/func_exportDataForPayment"
        //   this.queryUrl="/ce/acpt/innerBillPayment/paymentCorpTrackSearch/func_queryCorpPaymentCount"
        // }else {
          this.queryBillUrl = "/ce/acpt/innerBillPayment/paymentCorpTrackSearch/func_queryCorpPaymentApplyNeedRespForCorpTrack";
          this.downLoadUrl="/ce/acpt/innerBillPayment/paymentCorpTrackSearch/func_exportDataForCorpPayment";
          this.queryUrl= "/ce/acpt/innerBillPayment/paymentCorpTrackSearch/func_queryCorpPaymentApplyNeedRespForCorpTrack"   //总笔数总金额URL
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
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,CDMedia,AcctFlag,RiskStatus,BarterTrustStatus,PrsttnSignStatus,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.riskStatusList = res.get("RiskStatus");
        this.flowStatusList = res.get("BarterTrustStatus");
        this.flowStatusList = this.flowStatusList.filter(item => item.key === "RV00" || item.key === "RV01" || item.key === "RV02"
          || item.key === "RV03"||item.key === "RV04" || item.key === "RV10" || item.key === "RV11"|| item.key === "RV12"
          ||item.key === "RV13" ||item.key === "RV14" || item.key === "RV15" || item.key === "RV15"|| item.key === "RV17"
          ||item.key === "RV18" ||item.key === "RV19" || item.key === "RV20" || item.key === "RV21");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      let item1 = {};
      let item2 = {};
      let item3 = {};
      item1.value = "未记账";
      item2.value = "已记账";
      item3.value = "记账失败";
      item1.key = "0";
      item2.key = "1";
      item3.key = "2";
      this.acctStatusList.push(item1);
      this.acctStatusList.push(item2);
      this.acctStatusList.push(item3);
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
      showBillInfo(row){
        this.billId = row.billId;
        this.billNo = row.billNo;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.remitDtRange = [arr[0], arr[1]];
          this.formItem.minRemitDt=arr[0].toString().replace(/-/g, "");
          this.formItem.maxRemitDt=arr[1].toString().replace(/-/g, "");
        } else  {
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
      handleDuePayDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.duePayDtRange = [arr[0], arr[1]];
          this.formItem.minPaymentDt=arr[0].toString().replace(/-/g, "");
          this.formItem.maxPaymentDt=arr[1].toString().replace(/-/g, "");
        } else {
          this.formItem.duePayDtRange = [];
          this.formItem.minPaymentDt="";
          this.formItem.maxPaymentDt="";
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      clearVal1(){
        this.formItem.brchNos = "";
        this.formItem.branchName = "";
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.ownedBrchNames = this.$store.getters.userInfo.brchName;
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
        this.formItem.remitDtRange = [];
        this.formItem.dueDtRange = [];
        this.formItem.duePayDtRange = [];
        this.formItem.prsttnRespStatus = "";
        this.formItem.riskStatus = "";
        this.formItem.minDueDate="";
        this.formItem.maxDueDate="";
        this.formItem.minRemitDt="";
        this.formItem.maxRemitDt="";
        this.formItem.prsttnName="";
        this.clearVal();
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
      },
      /*//查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {

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
        this.formItem.brchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.branchName = brchNames.substring(0,brchNames.length - 1);
        this.showBranchWin = false;
      },*/
      //导出
      exportExcel() {
        if (this.mode==="1"){
          this.param = 'prsttnCorpTrackSearchExportInfo';
        }else{
          this.param = 'prsttnCorpTrackSearchExportInfo_2';
        }

        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + this.downLoadUrl;
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
            brchNos : this.formItem.brchNos,
            ownedBrchNos : this.formItem.ownedBrchNos,
            order : this.formItem.order
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
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
    },
  };
</script>

<style scoped>

</style>
