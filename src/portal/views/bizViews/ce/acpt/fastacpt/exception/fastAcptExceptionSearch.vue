<!--极速贴现-异常票据查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="mainVue" key="1">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
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
                      url="/ce/acpt/fastacpt/exception/fastAcptExceptionSearch/func_queryPageAcptBatchAndBill"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()">{{$t("m.i.ce.billManage")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <f-acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams" batchUrl="/ce/acpt/fastacpt/exception/fastAcptTrackSearch/func_getAcptBatchByQueryDto"
                              ref="fAcptBatchInfoDetail"></f-acpt-batch-info-detail>
    <!--查询保证金账号-->
    <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
    <show-branch-sec :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                     :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch-sec>

    <!-- 数据展示表格 -->
    <div v-if="billManagerVue" key="3">
      <h-datagrid :columns="billManagerColumns"
                  url="/ce/acpt/fastacpt/exception/fastAcptExceptionSearch/func_queryAcptBillMessage"
                  :bindForm="billManagerFormItem"
                  highlightRow
                  :has-select="false"
                  :row-select="true"
                  :auto-load="false"
                  ref="billManagerDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="discInfoExceptionResult('0')">{{$t('m.i.ce.fallback')}}</h-button>
          <h-button type="primary" @click="discInfoExceptionResult('1')">{{$t('m.i.ce.relaunch')}}</h-button>
          <h-button type="ghost" @click="returnMain">{{$t('m.i.common.goBack')}}</h-button>
        </div>
      </h-datagrid>
    </div>
  </div>

</template>

<script>
  import { getDictListByGroups, getDictValueFromMap, off, on, post, formatNumber,accMul,formatBillRange } from "@/api/bizApi/commonUtil";
  import { deepClone } from "@/utils/index";

  export default {
    name: "fastAcptExceptionSearch",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      ShowCustManager:() => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`),
      fAcptBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/fastacpt/fAcptBatchInfoDetail" */`@/views/bizViews/ce/acpt/fastacpt/search/fAcptBatchInfoDetail`),
      ShowBranchSec:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`),
    },

    data() {
      let columns =[
          {
            title: " ",
            type: "radio",
            width: 60,
            // hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            ellipsis: false,
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
            title: this.$t("m.i.ce.acptType"),
            key: "acptType",
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
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
              billNo = this.$t('m.i.ce.showBillInfo');
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
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t('m.i.billInfo.flowStatus'),
          key: 'flowStatusName',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: 'billType',
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType));
          }
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
          key: 'remitDt',
          hiddenCol: false,
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
          title: this.$t('m.i.billInfo.drwrName'),
          key: 'drwrName',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.drwrAcctNo'),
          key: 'drwrAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.drwrBankNo'),
          key: 'drwrBankNo',
          hiddenCol: false,
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
          title: this.$t('m.i.billInfo.pyeeBankNo'),
          key: 'pyeeBankNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: 'acptName',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.common.result'),
          key: 'errorFlowStatus',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.common.errorMsg'),
          key: 'errorReason',
          hiddenCol: false,
        }
      ];
      return {
        showBranchWin:false,
        showCustAcctNoWin: false,
        dueDt : [],
        batchId: "",
        remitDt: [],
        //区分最大和最小票据金额
        billMoneyType : "min",
        formItem: {
          acptBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          acptBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          brchName:'',
          remitDt:'',
          minRemitDt:'',
          maxRemitDt:'',
          brchNo:'',
          brchNamw:'',
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          dueDt: '',
          acptType:'',
          batchId: "",
          billClass:'ME02',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
          drweBankName:"",
          brchNos:"",
          branchName:"",
          prodNo:"01010821",
          fastAcptFlag:"1",
          isFastAcptErrorBatch:"1",
          reverseBillNo:"",
        },
        billManagerFormItem: {
          billClass:'ME02',
          promNoteNoLike: '',
          batchId: '',
          prodNo:'01010821',
          fastAcptFlag:"1",
        },
        columns:columns,
        billTypeList: [],
        currentSelectRow: [],
        YonList: [],
        dictMap: new Map(),
        currentSelectList : [],
        batchInfoParams: {
          id:"",
          billClass:'ME02',
          batchId: "",
          promNoteNoLike: "",
          // deductStatusList:'0,1',
          // deductApplFlag: '0',
          authPath:this.$route.path,
          ownedBrchNos:""
        },
        //是否显示更多查询项
        ifShowMore: false,
        showBillInfoWin: false,
        billManagerVue: false,
        showCustMessageWin: false,
        mainVue: true,
        billManagerColumns: billManagerColumns,
        billTemp: deepClone(billManagerColumns),
        temp: deepClone(columns),
        billId: "",
        billNo: "",
        billRangeStart:"",
        billRangeEnd:"",
        //查询保证金账户信息
        dueDeductAcctWin: false,
        showParams: {
          listId:"",
        },
      };
    },
    computed: {
      isMinBillMoney() {
        return this.billMoneyType === "min" ? "minBillMoney" : "maxBillMoney";
      }
    },
    mounted() {
      this.getDictListByGroups("AcptType,DraftTypeCode,BillOrigin").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
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
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.remitDt = "";
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.formItem.brchName = "";
          this.formItem.drwrName = "";
          this.formItem.drwrCustNo = "";
          this.formItem.drwrAcctNo = "";
          this.formItem.acptProtocalNo = "";
          this.formItem.acptProtocalNoLike = "";
          this.currentSelectList = [];
          this.remitDt = [];
          this.formItem.acptBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
          this.formItem.acptBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
          this.formItem.reverseBillNo='';
        });
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户！" });
          return;
        }
        this.showCustAcctNoWin = true;
      },

      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },
      handleDateChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

      },
      formatBillMoney(optType, itemType) {
        this.billMoneyType = itemType;
        if (optType === "blur") {
          if (itemType === "min") {
            if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
              this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
              this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
          } else {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
          }
        }
      },
      billManager() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.dueDt = this.formItem.dueDt;
        this.billManagerFormItem.batchId = this.batchId;
        this.batchInfoParams.guarntrNo = this.formItem.guarntrNo;
        this.batchInfoParams.dueDt = this.formItem.dueDt;
        this.billManagerFormItem.fastAcptFlag =this.formItem.fastAcptFlag;
        this.billManagerFormItem.prodNo = this.formItem.prodNo;
        this.batchInfoParams.id = this.batchId;
        this.batchInfoParams.batchId = this.batchId;
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
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
       /* this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;*/
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
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
      //票据异常
      discInfoExceptionResult(handlingDirection){
        let msg='';
        if ("0"===handlingDirection){
           msg ="撤销";
        } else {
           msg ="重新发起";
        }
        let param = {batchId : this.billManagerFormItem.batchId ,handlingDirection:handlingDirection};

        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定进行批次"+msg+"极速开票吗？",
          onOk: () => {
            this.fastAcptInfoExceptionResultManage(param);
          }
        });
      },
      // 票据异常信息查询
      // fastAcptInfoExceptionSearch(param){
      //   post(param, "/ce/acpt/fastacpt/exception/fastAcptExceptionSearch/func_queryAcptBillMessage").then(res => {
      //     if(res.data.retCode =="000000"){
      //       if(res.data.retData.list.size === 0){
      //         this.returnMain();
      //       }else {
      //         this.$nextTick(() => {
      //           this.billManagerColumns = deepClone(this.billTemp);
      //           this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
      //           this.$refs.billManagerDatagrid.dataChange(1);
      //         });
      //       }
      //     }
      //   })
      // },
      // 票据异常信息处理
      fastAcptInfoExceptionResultManage(param){
        post(param, "/ce/acpt/fastacpt/exception/fastAcptExceptionSearch/func_exceptionBillProcess").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);

                this.returnMain();

            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
    }
  };
</script>

<style scoped>

</style>
