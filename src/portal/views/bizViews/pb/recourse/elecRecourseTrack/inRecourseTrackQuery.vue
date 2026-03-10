<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--票据来源-->
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="recourseBusiType" :label="$t('m.i.ce.recourceBusiType')">
                  <h-select v-model="formItem.recourseBusiType" placeholder="" :clearable="false" @on-change="changeRecourseBusiType()">
                    <h-option v-for="item in trDirTypeList"  :value="item.key" :key="item.key">{{ item.value }}
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
                <h-form-item prop="riskStatus" :label="$t('m.i.billInfo.riskStatus')">
                  <h-select v-model="formItem.riskStatus" placeholder="">
                    <h-option v-for="item in riskStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>

                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDate">
                  <h-date-picker :value="dueDate" format="yyyy-MM-dd" type="daterange" showFormat
                                 :editable=false placeholder="" @on-change="handleDueDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.accountBrch')" prop="brchNos" v-show="false">
                  <h-input v-model="formItem.transBrchNos" placeholder="" v-show="false"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDate">
                  <h-date-picker :value="remitDate" format="yyyy-MM-dd" type="daterange" showFormat
                                 :editable=false placeholder="" @on-change="handleRemitDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.recourseApplDt')" prop="recourseApplDate">
                  <h-date-picker :value="recourseApplDate" format="yyyy-MM-dd" type="daterange" showFormat
                                 :editable=false placeholder="" @on-change="handleRecourseApplDateChange"></h-date-picker>
                </h-form-item>
              <!--  <h-form-item :label="$t('m.i.common.accountBrch')" prop="brchName">
                  <h-input v-model="formItem.brchName" readonly icon="android-search"
                           @on-click="queryBrchNo()" placeholder="" :title="formItem.brchName"
                           clearable @on-clear="clearVal('brchName')"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.brchName"  :label="$t('m.i.pc.brchName')"  prop="brchName"
                             :showCheckBox="true" :brchNo.sync="formItem.transBrchNos" :brchName.sync="formItem.brchName"></show-branch>

               <h-form-item prop="acctStatus" :label="$t('m.i.common.acctStatus')">
                  <h-select v-model="formItem.acctStatus" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <!--  <h-form-item prop="billStatus" :label="$t('m.i.billInfo.ecdsBillStatus')">
                   <h-select v-model="formItem.billStatus" placeholder="">
                     <h-option v-for="item in billStatusList" :value="item.key" :key="item.key">{{ item.value }}
                     </h-option>
                   </h-select>
                 </h-form-item>-->
                <!--<h-form-item :label="$t('m.i.billInfo.acptBankName')" prop="acptBankName" class="h-form-long-label">
                  <h-input v-model="formItem.acptBankNo" v-show="false"></h-input>
                  <h-input v-model="formItem.acptBankName" readonly icon="android-search"
                           @on-click="queryBranchCode()" placeholder=""
                           clearable @on-clear="clearVal('acptBankName')"></h-input>
                </h-form-item>-->
                <show-cpes-branch :label="$t('m.i.billInfo.acptBankName')" class="h-form-long-label"
                                  :bankNo.sync="formItem.acptBankNo"  :cpesBrchName.sync="formItem.acptBankName"
                                  :isQueryByBankNo="true"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="acptBankName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>


                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/pb/recourse/elecRecourseTrack/recourseTrackQuery"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            :notSetWidth="true"
            showListCkeckBox
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

   <!-- <show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                 @showBranchWinClose="showBranchWinClose" ifcheck="true"></show-branch>-->
    <!--<show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>-->
    <bill-info-main
      @billInfoWinClose="billInfoWinClose"
      :showBillInfoWin="showBillInfoWin"
      :billId="billId"
      :billNo="billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"
    ></bill-info-main>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>
  </div>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "inQueryRecourseTrackQuery",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
      ShowFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),

    },
    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 50,
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
            title: this.$t('m.i.be.recourseType'),
            key: "recourseType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "InRcrsTypeCode", params.row.recourseType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.ce.recourceBusiType'),
            key: "recourseBusiType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RecourseTrDir", params.row.recourseBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
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
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
            render: (h, params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            //fileManage
            title: this.$t("m.i.common.fileManage"),
            key: "fileManage",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showAttach(params);
                  }
                }
              }, "查看详情");
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-");
            }
          },
          {
            title: this.$t('m.i.be.recourseApplDt'),
            key: "recourseDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.recourseDt ? this.$moment(params.row.recourseDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-");
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.brchName'),
            key: "transBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.offLineRecType'),
            key: "offLineRecType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "OffLineRecType", params.row.offLineRecType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.riskStatus'),
            key: "riskStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RiskStatus", params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.common.failReason'),
            key: "dealPrcMsg",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "recourseRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "recourseAcctNo",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: "recourseBankNo",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "recourseName",
            sortable: true,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankName'),
            key: "recourseBankName",
            sortable: true,
            hiddenCol: true
          }
        ],
        formItem: {
          reverseBillNo: "",
          billOrigin:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          transBrchNos: "",
          brchName: "",
          billClass: "",
          billType: "",
          recourseBusiType: "1",
          minBillMoney: "",
          maxBillMoney: "",
          riskStatus: "",
          dueDt: [],
          minDueDt: "",
          maxDueDt: "",
          remitDt: [],
          minRemitDt: "",
          maxRemitDt: "",
          recourseDt: [],
          minRecourseDt: "",
          maxRecourseDt: "",
          billStatus: "",
          acctStatus: "",
          queryType:"2",
          acptBankName: ""
        },
        showBillInfoWin: false,
        showFileWin:false,
        dueDate:[],
        remitDate:[],
        recourseApplDate:[],
        billClassList: [],
        fileBatchParams:{},
        billNo: "",
        billId: "",
        billRangeStart:"",
        billRangeEnd:"",
        billTypeList: [],
        riskStatusList: [],
        trDirTypeList: [],
        acctStatusList: [],
        billStatusList: [],
        billOriginList: [],
        fileDetailStatusList:[],
        filePathUrl:"/pb/recourse/elecRecourseTrack/inRecourseTrackQuery/",
        dictMap: new Map(),
        //showBranchWin: false,
        //showCpesBranch: false,
        ifShowMore: false,

        tempShowExcelTemplateWin: false,
        param: null,
        rows: null
      };
    },
    methods: {
      // 打开附件弹窗
      showAttach(params) {
        this.fileBatchParams.busiId = params.row.hldrId;
        this.fileBatchParams.attachBusiType = "recourseFile";
        this.fileBatchParams.attTypeCodeList = [{key:'FT07',value:'其他'}];
        this.fileBatchParams.fileDetailStatusList = this.fileDetailStatusList;
        this.showFileWin = true;
      },
      // 附件关闭
      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      },
      showBillInfo(billInfo) {
        this.billId = billInfo.billId;
        this.billNo = billInfo.billNo;
        this.billRangeStart = billInfo.billRangeStart;
        this.billRangeEnd = billInfo.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      /*queryBranchCode() {
        this.showCpesBranch = true;
      },*/
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.error("请先选择记录！");
          return;
        }
        this.formItem.acptBankNo = info.bankNo;
        this.formItem.acptBankName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },*/
      //查询机构弹出框
     /* queryBrchNo() {
        this.showBranchWin = true;
      },
      //根据弹框所选数据进行赋值
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
        this.formItem.brchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.brchName = brchNames.substring(0, brchNames.length - 1);
        this.showBranchWin = false;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },*/
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },
      handleDueDateChange(arr){
        if (arr != null && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDate = [];
        }
      },
      handleRemitDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDate = [arr[0],arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDate = [];
        }
      },
      handleRecourseApplDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minRecourseDt = arr[0].replace(/-/g, "");
          this.formItem.maxRecourseDt = arr[1].replace(/-/g, "");
          this.recourseApplDate = [arr[0],arr[1]];
        } else {
          this.formItem.minRecourseDt = "";
          this.formItem.maxRecourseDt = "";
          this.recourseApplDate = [];
        }
      },
      formSearchReset() {
        this.dueDate = [];
        this.remitDate = [];
        this.recourseApplDate = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.billMoney="";
        this.formItem.acptBankNo = "";
        this.formItem.acptBankName = "";
        this.formItem.minRemitDt="";
        this.formItem.maxRemitDt="";
        this.formItem.minDueDt="";
        this.formItem.maxDueDt="";
        this.formItem.minRecourseDt = "";
        this.formItem.maxRecourseDt = "";
        this.$refs.formItem.resetFields();
        this.formItem.recourseBusiType="1";
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        if (this.formItem.recourseBusiType==="1"){
          this.param = "recourseQueryReportInfo";
        }else if (this.formItem.recourseBusiType==="2"){
          this.param = "recourseSignQueryReportInfo";
        }
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pb/recourse/elecRecourseTrack/inRecourseTrackQuery/func_paymentRecourseExportExcel";
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params.ids = this.$refs.datagrid.selectIds;
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      clearVal(type) {
        if (type == "brchName") {
          this.formItem.brchNos = "";
          this.formItem.brchName = "";
        }
        if (type == "acptBankName") {
          this.formItem.acptBankNo = "";
          this.formItem.acptBankName = "";
        }
      },
      changeRecourseBusiType() {
        if (this.formItem.recourseBusiType === "1") {
          //追索场景
          this.$nextTick(() => {
            this.columns.forEach(element => {
              if (element.key === "recourseAcctNo") {
                element.hiddenCol = true;
              } else if (element.key === "recourseBankNo") {
                element.hiddenCol = true;
              } else if (element.key === "recourseName") {
                element.hiddenCol = true;
              }else if (element.key==="recourseBankName") {
                element.hiddenCol = true;
              }
            });
          });
        } else if (this.formItem.recourseBusiType === "2") {
          //被追索场景
          this.$nextTick(() => {
            this.columns.forEach(element => {
              if (element.key === "recourseAcctNo") {
                element.hiddenCol = false;
              } else if (element.key === "recourseBankNo") {
                element.hiddenCol = false;
              } else if (element.key === "recourseName") {
                element.hiddenCol = false;
              }else if (element.key==="recourseBankName") {
                element.hiddenCol = false;
              }
            });
          });
        }
      }
    },
    mounted() {
      this.getDictListByGroups("RiskStatus,CDMedia,DraftTypeCode,BarterTrustStatus,RecourseTrDir,AcctFlag,OffLineRecType,BillOrigin,InRcrsTypeCode,FileDetailStatus,AttTypeCode,PreRelationFlag").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.riskStatusList = res.get("RiskStatus");
        this.trDirTypeList = res.get("RecourseTrDir");
        this.acctStatusList = res.get("AcctFlag");
        this.billStatusList = res.get("BarterTrustStatus");
        this.billOriginList = res.get("BillOrigin");
        this.fileDetailStatusList = res.get("FileDetailStatus");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
