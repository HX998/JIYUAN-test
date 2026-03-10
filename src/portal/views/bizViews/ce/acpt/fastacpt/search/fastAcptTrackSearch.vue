<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div v-if="mainVue" key="1">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch
                  v-model="formItem.ownedBrchNames" :label="$t('m.i.common.ownedBrchNo')"
                  prop="ownedBrchNames"
                  v-if="licenseFlag" :showCheckBox="true" :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                  :showIcon="true"
                  :params="{authPath:this.$route.path}"
                  url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                  queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <show-branch v-model="formItem.acptBrchNoList" :label="$t('m.i.common.brchName')" prop="acptBrchNoList"
                             title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.acptBrchNoList" :brchName.sync="formItem.acptBrchNameList">
                </show-branch>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="minRemitDt" :label="$t('m.i.billInfo.remitDt')" >
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/fastacpt/search/fastAcptTrackSearch/func_queryPageAcptBatchAndBill"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()">{{$t("m.i.ce.billManage")}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <f-acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams" batchUrl="/ce/acpt/fastacpt/search/fastAcptTrackSearch/func_getAcptBatchByQueryDto"
                                ref="fAcptBatchInfoDetail"></f-acpt-batch-info-detail>

        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/fastacpt/search/fastAcptTrackSearch/func_queryAcptBillMessage"
                      :bindForm="billManagerFormItem"
                      highlightRow
                      :has-select="false"
                      :row-select="true"
                      :auto-load="false"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="ghost" @click="returnMain">{{$t('m.i.common.goBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose"
                           @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                        :billNo="this.billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
        <show-branch-sec :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                         :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch-sec>

      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { getDictListByGroups, getDictValueFromMap, off, on, post, formatNumber,accMul,formatBillRange } from "@/api/bizApi/commonUtil";
  import { deepClone } from "@/utils/index";

  export default {
    name: "fastAcptTrackSearch",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      fAcptBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/fastacpt/fAcptBatchInfoDetail" */`@/views/bizViews/ce/acpt/fastacpt/search/fAcptBatchInfoDetail`),
      ShowBranchSec:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`),
    },
    data() {
      let columns = [
        {
          title: " ",
          type: 'radio',
          align: 'center',
          width : 50
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
          title: this.$t('m.i.billInfo.acptProtocalNo'),
          key: 'acptProtocalNo',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.acptProtocalNoMain(params.row.id,params.row.ownedBrchNo)
                  }
                }
              }, params.row.acptProtocalNo)
            ]);
          }
        },
        {
          title: this.$t('m.i.ce.acptType'),
          key: 'acptType',
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"AcptType",params.row.acptType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.drwrName'),
          key: 'drwrName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.drwrCustNo'),
          key: 'drwrCustNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.drwrAcctNo'),
          key: 'drwrAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.drweBankName'),
          key: 'drweBankName',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
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
          title:  this.$t('m.i.billInfo.dueDt'),
          key: 'dueDt',
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t('m.i.ce.totalFee'),
          key: 'totalFee',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalFee = formatNumber(params.row.totalFee, 2, ',');
            return h("span", {
              domProps: {
                title: totalFee
              }
            }, totalFee);
          }
        },
        {
          title: this.$t('m.i.ce.totalCommitFee'),
          key: 'totalCommitFee',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalCommitFee = formatNumber(params.row.totalCommitFee, 2, ',');
            return h("span", {
              domProps: {
                title: totalCommitFee
              }
            }, totalCommitFee);
          }
        },
        {
          title: this.$t('m.i.ce.totalCount'),
          key: 'totalCount',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.ce.totalAmt'),
          key: 'totalAmt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
            return h("span", {
              domProps: {
                title: totalAmt
              }
            }, totalAmt);
          }
        }
      ];
      let billManagerColumns = [
        {
          type: 'index',
          key: 'numOrder',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.ce.promNoteNo'),
          key: 'promNoteNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          align:'center',
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'),
          key: 'billNo',
          hiddenCol: false,
          render: (h, params) => {
            let billNo = "";
            if (params.row.billNo === null || params.row.billNo === "") {
              if(params.row.flowStatus === 'PICE01091910'){
                billNo = "";
              }else{
                billNo = this.$t('m.i.ce.showBillInfo');
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row);
                    }
                  }
                }, billNo);
              }
            }else{
              billNo = params.row.billNo;
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
            }
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
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t('m.i.billInfo.flowStatus'),
          key: 'flowStatusName',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),
          key: 'billMoney',
          hiddenCol: false,
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
          title: this.$t('m.i.billInfo.dueDt'),
          key: 'dueDt',
          hiddenCol: false,
          // sortable: true,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t('m.i.ce.fee'),
          key: 'fee',
          hiddenCol: false,
          render: (h, params) => {
            let fee = formatNumber(params.row.fee, 2, ',');
            return h("span", {
              domProps: {
                title: fee
              }
            }, fee);
          }
        },
        {
          title: this.$t('m.i.billInfo.pyeeName'),
          key: 'pyeeName',
          // sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.pyeeAcctNo'),
          key: 'pyeeAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankName'),
          key: 'pyeeBankName',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: 'acptName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.bailPcetStr"),
          key: 'bailPcet',
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.bailPcet != null && params.row.bailPcet !== ""){
              let rate = accMul(params.row.bailPcet, 100);
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guarntrAmt"),
          key: 'guarntrAmt',
          hiddenCol: false,
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
        },
        {
          title: this.$t('m.i.ce.drwrAcctNo'),
          key: 'drwrAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.common.result'),
          key: 'errorFlowStatus',
          hiddenCol: false,
        },
/*        {
          title: this.$t('m.i.common.errorMsg'),
          key: 'errorReason',
          hiddenCol: false,
        }*/
      ];
      let _this=this
      return {
        showBranchWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
        ownedBrchNo:"",
        dueOptions: {
          disabledDate(date) {
            return _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") >= date && date.valueOf()
          }
        },
        acctRecordParam:{},
        acctSubmitFlag: false,
        showPrintButton: false,
        showAcctRecordWin: false,
        acptIds:[],
        acptBatchId:"",
        dictMap: new Map(),
        showBillInfoWin: false,
        showDeductAcctInfoWin: false,
        acptTypeList: [],
        // BillClassList: [],
        billId: "",
        billNo:"",
        billRangeStart:"",
        billRangeEnd:"",
        deductAcctFormItem: {
          listId: ""
        },
        formItem: {
          acptBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          acptBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          guarntrNo:'',
          remitDt:'',
          brchNo:'',
          brchName:'',
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          dueDt: '',
          minRemitDt:'',
          maxRemitDt:'',
          acptType:'',
          // deductStatusList:'0,1',
          // deductApplFlag: '0',
          billClass:'ME02',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
          drweBankName:"",
          brchNos:"",
          branchName:"",
          prodNo:"01010821",
          fastAcptFlag:"1",
          reverseBillNo:"",


        },
        billManagerFormItem: {
          billClass:'ME02',
          promNoteNoLike: '',
          batchId: '',
          prodNo:'01010821',
          fastAcptFlag:"1",
          // deductStatusList:'0,1',
          // deductApplFlag: '0'
        },
        acctInfoForm: {
          isBatchOper: '0',
          batchId: '',
          acptIds:'',
          acctNos: []
        },
        deductAcctCurrentList: [],
        remitDt: [],
        viewDetailForm: {},
        columns: columns,
        deductAcctColumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
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
            title:  this.$t("m.i.common.acctNo"),
            key: 'deductAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.dpstNo"),
            key: 'dpstNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.acctType"),
            key: 'deductAcctType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "custAcctKind", params.row.deductAcctType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        batchInfoParams: {
          id:"",
          billClass:'ME02',
          batchId: "",
          promNoteNoLike: "",
          // deductStatusList:'0,1',
          // deductApplFlag: '0',
          authPath:this.$route.path,
          ownedBrchNos:"",
          prodNo:"01010821",
          fastAcptFlag:"1",
          guarntrNo:"",
        },
        acctNoList: [],
        batchId: "",
        currentSelectRow: [],
        billManagerCurrentSelectList: [],
        custAcctKindList: [],
        mainVue: true,
        billManagerVue: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        deductConfirmWin: false,
        submitFlag: false,
        ifShowMore: false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        showParams: {
          listId:"",
        }
      };
    },
    mounted() {
     this.getDictListByGroups("AcptType,BillOrigin").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleAcptDtChange(){
        if(this.formItem.acptDt != null && this.formItem.acptDt != ''){
          this.formItem.acptDt = this.$moment(this.formItem.acptDt).format("YYYYMMDD");
        }
      },
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },
      // 查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      // 根据弹框所选数据进行赋值
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

      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
     /*   this.billId = billId;
        this.showBillInfoWin = true;*/
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      // 日期选择框
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      // 表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      // 重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.formItem.brchName = "";
          this.formItem.drwrCustNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrAcctNo = "";
          this.formItem.acptProtocalNoLike = "";
          this.formItem.remitDt = "";
          this.formItem.billClass="ME02",
          this.formItem.ownedBrchNames="";
          this.formItem.ownedBrchNos="";
          this.remitDt = [];
          this.formItem.acptBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
          this.formItem.acptBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
          this.formItem.reverseBillNo='';
        });
      },
      // 行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
      },
      // 查询客户信息
      // 触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      // 赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if (info.custAcctNo !== "") {
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
          this.$msgTip.info(this, { info: "请先选择客户！" });
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
      //票据管理
      billManager() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.dueDt = this.formItem.dueDt;
        this.billManagerFormItem.batchId = this.batchId;
        this.billManagerFormItem.prodNo = this.formItem.prodNo;
        this.billManagerFormItem.fastAcptFlag = this.fastAcptFlag;
        this.batchInfoParams.guarntrNo = this.formItem.guarntrNo;
        this.batchInfoParams.dueDt = this.formItem.dueDt;
        this.batchInfoParams.id = this.batchId;
        this.batchInfoParams.batchId = this.batchId;
        this.batchInfoParams.ownedBrchNos=this.currentSelectRow.ownedBrchNo;
        this.$refs.datagrid.tData = [];
        this.resetSearch();
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },
      //承兑协议编号超链接
      acptProtocalNoMain(str,ownedBrchNo) {
        this.batchId = str;
        this.billManagerFormItem.batchId = this.batchId;
        this.billManagerFormItem.dueDt = this.formItem.dueDt;
        this.batchInfoParams.batchId = this.batchId;
        this.batchInfoParams.id = this.batchId;
        this.batchInfoParams.ownedBrchNos=ownedBrchNo
        this.batchInfoParams.dueDt = this.formItem.dueDt;
        this.$refs.datagrid.tData = [];
        this.resetSearch();
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },


      //票据管理子页面方法
      //表单查询
      billManagerHandleSearch() {
        this.$refs.billManagerDatagrid.selects = [];
        this.batchInfoParams.promNoteNoLike = this.billManagerFormItem.promNoteNoLike;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.acptBatchInfoDetail.getBatchInfo();
        });
      },
      //重置表单查询结果
      billManagerResetSearch() {
        this.$nextTick(() => {
          this.billManagerFormItem.promNoteNoLike = "";
        });
      },
      //返回主页面
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        this.currentSelectRow = [];
        this.$refs.billManagerDatagrid.selects = [];
        this.billManagerResetSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
        });
      },

    }
  };

</script>

<style scoped>

</style>
