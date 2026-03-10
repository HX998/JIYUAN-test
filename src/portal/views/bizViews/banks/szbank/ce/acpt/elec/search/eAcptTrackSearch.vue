<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWin = true" v-if="this.licenseFlag"></own-brch-nos>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.brchName')" prop="brchNos">
                  <h-input v-model="formItem.brchNos" placeholder="" readonly
                           icon="android-search" @on-click="queryBrchNo"
                           v-show="false"
                  ></h-input>
                  <h-input v-model="formItem.branchName" placeholder="" readonly
                           icon="android-search" @on-click="queryBrchNo" :title="formItem.branchName"
                  ></h-input>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="otherBankAcptMark" :label="$t('m.i.ce.otherBankAcptMark')">
                  <h-select v-model="formItem.otherBankAcptMark" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="promNoteNoLike" :label="$t('m.i.ce.promNoteNo')">
                   <h-input v-model="formItem.promNoteNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleRemitDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="formItem.dueDt" placeholder="" @on-change="handleDueDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptStatus" :label="$t('m.i.ce.acptStatus')">
                  <h-select v-model="formItem.acptStatus" placeholder="" showTitle>
                    <h-option v-for="item in acptStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="deductStatusList" :label="$t('m.i.ce.deductStatus')">
                  <h-select v-model="formItem.deductStatusList" placeholder="" multiple>
                    <h-option v-for="item in deductStatusDictList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="payRgstDt" :label="$t('m.i.ce.payRgstDt')">
                  <h-date-picker type="date" v-model="formItem.payRgstDt" placeholder="" @on-change="handlePayRgstDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.payRgstStatus')" prop="payRgstStatus">
                  <h-select v-model="formItem.payRgstStatus" placeholder="">
                    <h-option value="1">已付款登记</h-option>
                    <h-option value="0">未付款登记</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.acptAcctStatus')" prop="acptAcctFlag" v-if="isShowAcctStatus === '1'">
                  <h-select v-model="formItem.acptAcctFlag" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.backAcctStatus')" prop="backAcctFlag" class="h-form-long-label"  v-if="isShowAcctStatus === '1'">
                  <h-select v-model="formItem.backAcctFlag" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.paymentAcctStatus')" prop="paymentAcctFlag" class="h-form-long-label"  v-if="isShowAcctStatus === '1'">
                  <h-select v-model="formItem.paymentAcctFlag" placeholder="">
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
                  <h-form-item :label="$t('m.i.pc.sumMoney')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/elec/search/eAcptTrackSearch/func_trackList"
                      @getSumMoneyAndTotal="getSumMoneyAndTotal"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportData()">{{$t('m.i.common.exportData')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
        <!--excel导出-->
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
        <show-branch-sec :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                     :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch-sec>

      </h-col>
    </h-row>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
import {
  accMul,
  formatBillRange,
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  post
} from "@/api/bizApi/commonUtil";

export default {
    name: "eAcptTrackSearch",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
      ShowBranchSec:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
    },
    data() {
      return {
        // brchNoWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
        tempShowExcelTemplateWin:false,
        param:"",
        rows:"",
        sumMoney : "",
        total : "",
        formItem: {
          brchNos: "",
          branchName: "",
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          otherBankAcptMark: '',
          billNoLike: '',
          acptProtocalNoLike: '',
          promNoteNoLike: '',
          remitDt: '',
          dueDt: '',
          acptStatus: '',
          deductStatusList: [],
          payRgstDt: '',
          payRgstStatus: '',
          billClass: 'ME02',
          authPath: this.$route.path,
          ownedBrchNos: this.$store.getters.userInfo.brchNo,
          ownedBrchNames: this.$store.getters.userInfo.brchName,
          acptAcctFlag: "",
          backAcctFlag: "",
          paymentAcctFlag: "",
          billOrigin: "",
          reverseBillNo:"",
          minBillRangeStart:"",
          maxBillRangeEnd:""
        },
        acctStatusList:[],

        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
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
            title: this.$t("m.i.common.brchName"),
            key: "transBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: 'billOrigin',
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
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
            title: this.$t("m.i.ce.otherBankAcptMark"),
            key: 'otherBankAcptMark',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.otherBankAcptMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title:  this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptStatus",params.row.acptStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.acptAcctStatus"),
            key: "acptAcctFlag",
            hiddenCol: false,
            render:(h, params)=>{
              if(params.row.acptAcctFlag === "n"){
                return "";
              }
              let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acptAcctFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.backAcctStatus"),
            key: "backAcctFlag",
            hiddenCol: false,
            render:(h, params)=>{
              if(params.row.backAcctFlag === "n"){
                return "";
              }
              let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.backAcctFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.paymentAcctStatus"),
            key: "paymentAcctFlag",
            hiddenCol: false,
            render:(h, params)=>{
              if(params.row.paymentAcctFlag === "n"){
                return "";
              }
              let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.paymentAcctFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.payRgstDt"),
            key: 'payRgstDt',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.payRgstDt == null || params.row.payRgstDt === ""){
                return "";
              }
              let date = this.$moment(params.row.payRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },{
            title: this.$t("m.i.ce.payRgstStatus"),
            key: 'payRgstStatus',
            hiddenCol: false,
            render: (h, params) => {
              let payRgstStatus = "";
              if(params.row.payRgstStatus == "1"){
                payRgstStatus = "已付款登记";
              }
              if(params.row.payRgstStatus == "0"){
                payRgstStatus = "未付款登记";
              }
              return h("span", payRgstStatus);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.promNoteNo"),
            key: 'promNoteNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
            title: this.$t("m.i.ce.deductAmt"),
            key: 'deductAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let deductAmt = formatNumber(params.row.deductAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: deductAmt
                }
              }, deductAmt);
            }
          },
          {
            title: this.$t("m.i.ce.deductStatus"),
            key: 'deductStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DeductStatusType",params.row.deductStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.advancedPayAmt"),
            key: 'preAdvancedPayAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let preAdvancedPayAmt = formatNumber(params.row.preAdvancedPayAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: preAdvancedPayAmt
                }
              }, preAdvancedPayAmt);
            }
          },
          {
            title: this.$t("m.i.ce.overDueAdvancedPayAmt"),
            key: 'advancedPayAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let advancedPayAmt = formatNumber(params.row.advancedPayAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: advancedPayAmt
                }
              }, advancedPayAmt);
            }
          },
          {
            title: this.$t("m.i.ce.bailPcetStr"),
            key: 'bailPcet',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.bailPcet != null && params.row.bailPcet !== ""){
                let rate = accMul(params.row.bailPcet, 100);
                let rateFormat = formatNumber(rate, 2, ',');
                return h("span", rateFormat);
              }
            }
          },
          {
            title: this.$t("m.i.ce.guarntrAmt"),
            key: 'guarntrAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: guarntrAmt
                }
              }, guarntrAmt);
            }
          },
          {
            title: this.$t("m.i.ce.guarntrNo"),
            key: "guarntrNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showDueDeductAcct(params.row.id);
                  }
                }
              }, '查看');
            }
          },
          {
            title:  this.$t("m.i.ce.drwrAcctNo"),
            key: 'settleAcctNo',
            hiddenCol: false,
          },
          {
             title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.billInfo.remitDt"),
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
           title: this.$t("m.i.billInfo.dueDt"),
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
            title: this.$t("m.i.ce.entrustAcctNo"),
            key: 'prsttnAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustName"),
            key: 'prsttnName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustBankNo"),
            key: 'prsttnBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustBankName"),
            key: 'prsttnBankName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.prsttnRemark"),
            key: 'prsttnRemark',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.overdueReason"),
            key: 'overdueReason',
            hiddenCol: false,
          }
        ],
        YonList: [],
        acptStatusList: [],
        deductStatusDictList: [],
        billOriginList: [],
        dictMap: new Map(),
        currentSelectRow: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        showBranchWin: false,
        ifShowMore: false,
        billId: "",
        billRangeStart: "",
        billRangeEnd: "",
        showBillInfoWin: false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        isShowAcctStatus:"",
        showParams: {
          listId:"",
        },
        btnAuth:""
      }
    },
    mounted() {
      this.buttonAuthShow();
      getDictListByGroups("AcptStatus,Yon,AcctFlag,DeductStatusType,BillOrigin").then(res => {
        this.acptStatusList = res.get("AcptStatus");
        this.YonList = res.get("Yon");
        this.deductStatusList = res.get("DeductStatusType");
        this.deductStatusDictList = res.get("DeductStatusType");
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
      this.getParams();
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
      buttonAuthShow(){
        //按钮权限查询 控制按钮显隐
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
              if (this.btnAuth.isShowAcctStatus === undefined ? true : this.btnAuth.isShowAcctStatus.isShow) {
                this.isShowAcctStatus = '1';
              } else {
                this.isShowAcctStatus = '0';
              }
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      getList() {
        let obj = Object.assign({}, this.formItem, { "pageNo": this.$refs.datagrid.pageInfo.pageNo, "pageSize": this.$refs.datagrid.pageInfo.pageSize });
        let url = "/ce/acpt/elec/search/eAcptTrackSearch/func_trackList";
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.total = data.pageInfo.count;
                this.sumMoney = formatNumber(data.pageInfo.sumMoney, 2, ',');
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      handlePayRgstDtChange(value) {
        this.formItem.payRgstDt = value.replace(/-/g, "");
      },
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },

      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      handleRemitDtChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      handleDueDtChange(value) {
        this.formItem.dueDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        // this.getList();
        this.$refs.datagrid.selects = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
        this.formItem.ownedBrchNames =this.$store.getters.userInfo.brchName;
        this.formItem.ownedBrchNos =this.$store.getters.userInfo.brchNo;
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
      },
      //清单导出
      exportData() {
        if (this.licenseFlag) {
          this.param = 'elecAcptTrackSearchExport_2';
        }else {
          this.param = 'elecAcptTrackSearchExport';
        }
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/elec/search/eAcptTrackSearch/func_exportDataForEAcptTrackSearch";
        if(exportType === "1"){
          let params = null;
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = { ids: this.$refs.datagrid.selectIds, field: field, exportType: exportType, excelName: this.param,authPath:this.$route.path,ownedBrchNos:this.formItem.ownedBrchNos};
          }else {
            params = Object.assign({ field: field, exportType: exportType, excelName: this.param},this.formItem);
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post")
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'authPath';
            input2.value = this.$route.path;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'ownedBrchNos';
            input3.value = this.formItem.ownedBrchNos;
            form.appendChild(input3)
          } else {
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
          }
          let input3 = document.createElement('input')
          input3.type = 'text'
          input3.name = 'field';
          input3.value = field;
          form.appendChild(input3)
          let input4 = document.createElement('input')
          input4.type = 'text'
          input4.name = 'exportType';
          input4.value = exportType;
          form.appendChild(input4)
          let input5 = document.createElement('input')
          input5.type = 'text'
          input5.name = 'excelName';
          input5.value = this.param;
          form.appendChild(input5)
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },

      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      clearVal1(){
        this.formItem.brchNos = "";
        this.formItem.branchName = "";
      },
      //查询机构弹出框
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
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      getParams(){
        if (this.$route.path === "/ce/acpt/elec/search/eAcptTrackSearch") {
          if (this.$route.query.dueDt) {
            let dueDt = this.$moment(this.$route.query.dueDt, "YYYY-MM-DD").format("YYYYMMDD");
            this.formItem.dueDt = dueDt;
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
      },
      /* //根据弹框所选数据进行赋值
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
         this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
         this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
         this.brchNoWin = false;
       },*/
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    },
    watch: {
      "$route": "getParams"
    },
  };
</script>

<style scoped>

</style>
