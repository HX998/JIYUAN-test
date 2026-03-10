<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <show-branch v-model="formItem.brchNos"  label="付款行名称" prop="brchNos"
                             title="机构名称" :showCheckBox="true" isNeedChecked :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.rcvBrchNames"></show-branch>
                <h-form-item prop="billType" label="票据种类">
                  <h-select v-model="formItem.billType" :clearable="false" placeholder="" @on-change="billTypeOnChange">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billClass" label="票据介质">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="riskStatus" label="风险票据状态">
                  <h-select v-model="formItem.riskStatus" placeholder="">
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
                <h-form-item prop="dueDtRange" label="票据到期日">
                  <h-date-picker :value="formItem.dueDtRange" type="daterange" showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder="" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="remitDtRange" label="出票日期">
                  <h-date-picker :value="formItem.remitDtRange" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder="" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="acctDtRange" label="记账日期">
                  <h-date-picker :value="formItem.acctDtRange" type="daterange" showFormat :editable=false
                                 @on-change="handleAcctDtChange" placeholder="" autoPlacement></h-date-picker>
                </h-form-item>
                <show-cpes-branch v-model="formItem.acptBrchCode" :label="$t('m.i.billInfo.acptBankName')" class="h-form-long-label"
                                  :brchCode.sync="formItem.acptBrchCode"  :cpesBrchName.sync="formItem.acceptorBankName"
                                  @cpesBranchChange="acceptorBankNameChange($event)"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="acceptorBankName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

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
                  <h-form-item :label="$t('m.i.pe.sumBillPackageMoney')" class="h-form-long-label">
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
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      :url="queryBillUrl"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportExcel()">{{$t('m.i.common.exportData')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd" ></bill-info-main>
        <!--查询提示付款人信息弹窗-->
        <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWin=false"-->
                          <!--@brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
       <!-- <show-branch :showBranchWin="brchNoWin" title="查询机构树多选" @brchNoChange="brchNoChange"
                     ifcheck="true" :checkStrictly="false" @showBranchWinClose="brchNoWinClose"></show-branch>-->
        <!--<brch-code-search :brchCodeWin="brchCodeWinBrch" @brchCodeWinClose="brchCodeWinClose"
                          @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->
      </h-col>
    </h-row>

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
    name: "innerBillPaymentOccurQuery",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)

    },
    data() {
      return {
        tempShowExcelTemplateWin:false,
        param : null,
        rows : null,
        brchCodeWin:false,
        showBillInfoWin: false,
        billId: "",
        billRangeStart:"",
        billRangeEnd:"",
        //brchNoWin: false,
        formItem: {
          prsttnRespStatus:"",
          acceptorBankName:"",
          applBrchCode: "",
          applBrchName:"",
          rcvBrchNo:"",
          rcvBrchName:"",
          rcvBrchNos:"",
          busiBrchNoList:"",
          rcvBrchNames:"",
          riskStatus: '',
          billType: 'AC01',
          billClass: '',
          billNo: '',
          billNoLike: '',
          acctFlag : "1",
          billMoney:"",
          minBillMoney: '',
          maxBillMoney: '',
          remitDtRange: [],
          dueDtRange: [],
          acctDtRange: [],
          flowStatus:'',
          billStatus:'',
          duePayDtRange: [],
          order: 'ACPT_PROTOCAL_NO,REMIT_DT desc',
          minRemitDt:"",
          maxRemitDt:"",
          minDueDate:"",
          maxDueDate:"",
          minDueDtInt:"",
          maxDueDtInt:"",
          minAcctDate:"",
          maxAcctDate:"",
          needBrchCode:"",
          billOrigin:"",
          reverseBillNo:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          minPaymentDt:"",
          maxPaymentDt:"",
          acptBrchCode:"",
          brchNos:""
        },
        //brchCodeWinBrch: false,
        sumMoney: "",
        total: "",
        columns: [],
        autmentColumns:[
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
          title: this.$t("m.i.billInfo.billType"),
          key: 'billType',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.billClass'),
          key: "billClass",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
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
            title:  this.$t("m.i.common.acctDt"),
            key: 'acctDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.acctDt == null || params.row.acctDt === ""){
                return "";
              }
              let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:  this.$t("m.i.billInfo.acptBankName"),
            key: 'acptBankName',
            hiddenCol: false,
          },
          {
            title:  this.$t("m.i.be.receivingBrchName"),
            key: 'applBrchName',
            hiddenCol: false,
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
            title:  this.$t("m.i.be.payBankName"),
            key: 'respBrchName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title:  this.$t("m.i.billInfo.ecdsBillStatus"),
            key: 'billStatus',
            hiddenCol: false,
            render:(h,params) => {
              let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.billStatus);
              let name = prsttnRespStatusName.replace(/应答方：/,"");
              return h("span", name);
            }
          },
        {
          title:  this.$t("m.i.common.acctStatus"),
          key: 'acctStatus',
          hiddenCol: false,
          sortable: true,
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
        defaultColumns: [
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
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            align:'center',
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
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
            title:  this.$t("m.i.common.acctDt"),
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
            title:  this.$t("m.i.billInfo.acptBankName"),
            key: 'acptBankName',
            hiddenCol: false,
          },
          {
            title:  this.$t("m.i.billInfo.prsttnName"),
            key: 'prsttnName',
            hiddenCol: false,
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
            title:  this.$t("m.i.be.payBankName"),
            key: 'paymentBrchName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title:  this.$t("m.i.billInfo.flowStatus"),
            key: 'prsttnRespStatus',
            hiddenCol: false,
            render:(h,params) => {
              let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.prsttnRespStatus);
              let name = prsttnRespStatusName.replace(/应答方：/,"");
              return h("span", name);
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acptAcctStatus",
            hiddenCol: false,
            render:(h, params)=>{
              if(params.row.acptAcctStatus === null || params.row.acptAcctStatus === "" || params.row.acptAcctStatus.substring(5, 6) === "n"){
                return ""
              }else{
                let list = "";
                if (params.row.billType === 'AC01'){
                  list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acptAcctStatus.substring(5,6));
                } else if (params.row.billType === 'AC02'){
                  list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acptAcctStatus);
                }
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            }
          },
      ],
        riskStatusList: [],
        billClassList: [],
        billTypeList:[],
        flowStatusList:[],
        billOriginList : [],
        dictMap: new Map(),
        queryUrl: "",
        currentSelectRow: [],
        ifShowMore: false,
        mode:"",
        queryBillUrl:"",
        downLoadUrl:"",
      }
    },
    created(){
      /**
       * 获取是对接模式还是直连模式
       */
      getConnectMode().then(res=>{
        this.mode = res;
        // if (this.mode==="1") {
        this.queryBillUrl = "/pe/busiqry/innerBillPaymentOccurQuery/func_queryPaymentApplyNeedRespForTrack";
        this.downLoadUrl="/pe/busiqry/innerBillPaymentOccurQuery/func_exportDataForPayment";
        this.queryUrl= "/pe/busiqry/innerBillPaymentOccurQuery/func_queryPaymentApplyNeedRespForTrack";   //总笔数总金额URL

        // }else {
          //this.queryBillUrl="/pe/busiqry/innerBillPaymentOccurQuery/func_queryPaymentApplyNeedRespForTrack";
          //this.downLoadUrl="/pe/busiqry/innerBillPaymentOccurQuery/func_innerBillPaymentExportInfo"
          //this.queryUrl="/pe/busiqry/innerBillPaymentOccurQuery/func_queryCorpPaymentCount"
        // }
        this.$nextTick(()=>{
          // if (this.mode==="1"){
             this.columns=this.defaultColumns;
          // } else {
          //  this.columns=this.autmentColumns;
          // };
          this.$refs.datagrid.dataChange(1);
          this.getCountData();
          this.$refs.datagrid.createShowCol(this.columns);
        })
      })
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,CDMedia,RiskStatus,BarterTrustStatus,PrsttnSignStatus,AcctFlag,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.riskStatusList = res.get("RiskStatus");
        this.billOriginList = res.get("BillOrigin");
        this.flowStatusList = res.get("BarterTrustStatus");
        this.flowStatusList = this.flowStatusList.filter(item => item.key === "RV00" || item.key === "RV01" || item.key === "RV02"
          || item.key === "RV03"||item.key === "RV04" || item.key === "RV10" || item.key === "RV11"|| item.key === "RV12"
          ||item.key === "RV13" ||item.key === "RV14" || item.key === "RV15" || item.key === "RV15"|| item.key === "RV17"
          ||item.key === "RV18" ||item.key === "RV19" || item.key === "RV20" || item.key === "RV21");


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
      getCountData() {
        let obj = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize,
        });
        let url = this.queryUrl;
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.occurData = res.data.retData;
                // if (this.mode==="1"){
                //   this.total = res.data.retData.pageInfo.count;
                //   this.sumMoney = formatNumber(res.data.retData.pageInfo.sumMoney, 2, ',');
                // }else {
                  this.total = res.data.retData.pageInfo.count;
                  this.sumMoney = formatNumber(res.data.retData.pageInfo.sumMoney, 2, ",");
                // }
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      /*clearVal() {
        this.formItem.applBrchName = "";
        this.formItem.applBrchCode = "";
        this.formItem.rcvBrchNos="";
        this.formItem.rcvBrchNames="";
      },*/
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
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
          this.formItem.minDueDtInt=arr[0].toString().replace(/-/g, "");
          this.formItem.maxDueDtInt=arr[1].toString().replace(/-/g, "");
        } else {
          this.formItem.dueDtRange = [];
          this.formItem.minDueDtInt="";
          this.formItem.maxDueDtInt="";
        }
      },
      handleAcctDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.acctDtRange = [arr[0], arr[1]];
          this.formItem.minPaymentDt=arr[0].toString().replace(/-/g, "");
          this.formItem.maxPaymentDt=arr[1].toString().replace(/-/g, "");
        } else {
          this.formItem.acctDtRange = [];
          this.formItem.minPaymentDt="";
          this.formItem.maxPaymentDt="";
        }
      },
      //表单查询
      handleSearch() {
        this.getCountData();
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
        this.formItem.remitDtRange = [];
        this.formItem.dueDtRange = [];
        this.formItem.minDueDate="";
        this.formItem.maxDueDate="";
        this.formItem.minRemitDt="";
        this.formItem.maxRemitDt="";
        this.formItem.prsttnName="";
        this.formItem.rcvBrchNo="";
        this.formItem.rcvBrchName="";
        this.formItem.rcvBrchNos="";
        this.formItem.rcvBrchNames="";
        this.formItem.needBrchCode="";
        this.formItem.acceptorBankName="";
        this.formItem.applBrchName = "";
        this.formItem.applBrchCode = "";
        this.formItem.rcvBrchNos="";
        this.formItem.rcvBrchNames="";
        this.formItem.billType = "AC01";
        this.formItem.order = 'ACPT_PROTOCAL_NO,REMIT_DT desc';
        //this.clearVal();
      },

/*      //根据弹框所选数据进行赋值
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
        this.formItem.rcvBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.rcvBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/

      /*brchCodeWinOpen() {
        this.brchCodeWinBrch = true;
      },*/
     /* brchCodeWinClose() {
        this.brchCodeWinBrch = false;
      },*/
      /*brchCodeChange(info) {
        this.formItem.acceptorBankName = info.brchFullNameZh;
        this.brchCodeWinBrch = false;
      },*/
      acceptorBankNameChange(info){
        if(info.length>0){

        }else{
          this.formItem.applBrchName = "";
          this.formItem.applBrchCode = "";
          this.formItem.rcvBrchNos="";
          this.formItem.rcvBrchNames="";
        }
      },

      //导出
      exportExcel() {
        this.param = 'innerBillPaymentExportInfo';
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
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this,this.param, field, exportType, exportUrl, options);
      },
      billTypeOnChange(){
        if (this.formItem.billType === "AC01"){
          this.queryBillUrl = "/pe/busiqry/innerBillPaymentOccurQuery/func_queryPaymentApplyNeedRespForTrack";
          this.downLoadUrl="/pe/busiqry/innerBillPaymentOccurQuery/func_exportDataForPayment";
          this.queryUrl= "/pe/busiqry/innerBillPaymentOccurQuery/func_queryPaymentApplyNeedRespForTrack";   //总笔数总金额URL
          this.formItem.order = 'ACPT_PROTOCAL_NO,REMIT_DT desc';
        } else if (this.formItem.billType === "AC02"){
          this.queryBillUrl = "/pe/busiqry/innerBillPaymentOccurQuery/func_queryCorpPaymentApplyNeedRespForCorpTrack";
          this.downLoadUrl="/pe/busiqry/innerBillPaymentOccurQuery/func_exportDataForCorpPayment";
          this.queryUrl= "/pe/busiqry/innerBillPaymentOccurQuery/func_queryCorpPaymentApplyNeedRespForCorpTrack";   //总笔数总金额URL
          this.formItem.order = 'ID,ACPT_PROTOCAL_NO,REMIT_DT desc';
        }
      },

    }
  };
</script>

<style scoped>

</style>
