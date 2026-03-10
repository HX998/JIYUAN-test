<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--机构名称-->
                <h-form-item :label="$t('m.i.common.brchName')" prop="brchNos">
                  <h-input v-model="formItem.brchNos" placeholder="" readonly icon="android-search" @on-click="queryBrchNo"
                           v-show="false"></h-input>
                  <h-input v-model="formItem.branchName" placeholder="" readonly
                           icon="android-search" @on-click="queryBrchNo" :title="formItem.branchName"></h-input>
                </h-form-item>
                <!-- 承兑日期-->
                <due-dt-range :label="$t('m.i.billInfo.acptDt')" v-model="acptDt" @on-change="handleAcptDtChange" prop="acptDt"></due-dt-range>
                <!-- 票据包号-->
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.billNo" prop="billNo"></bill-no>
                 <!-- 子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['billRangeStart','billRangeEnd']" v-if="ifShowMore" :maxLength="12"></bill-range>
                <!-- 汇票到期日-->
                <due-dt-range :label="$t('m.i.billInfo.dueDt')" v-model="dueDt" @on-change="handleDueDtChange" prop="dueDt"></due-dt-range>
                <!-- 出票人名称-->
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="drwrqueryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <!-- 承兑人名称-->
                <h-form-item prop="acptName" :label="$t('m.i.ce.acptCustName')">
                  <h-input v-model="formItem.acptName" placeholder="" icon="android-search" @on-click="acptqueryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
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
                      url="/ce/acpt/controller/func_accepBillBusiQuery"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportData()">{{$t('m.i.common.exportData')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询出票客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showDrwrCustMessageWin" @custCorpWinClose="custDrwrCorpWinClose"
                           @custCorpSelectSubmit="drwrCustCorpSelectSubmit"></show-cust-message>
        <!-- 查询承兑客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showAcptCustMessageWin" @custCorpWinClose="custAcptCorpWinClose"
                           @custCorpSelectSubmit="acptCustCorpSelectSubmit"></show-cust-message>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
       <!--excel导出-->
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
        <show-branch-sec :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                         :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch-sec>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {accMul,formatBillRange,formatNumber,getDictListByGroups,getDictValueFromMap,post} from "@/api/bizApi/commonUtil";
export default {
      name: "accepBillBusiQuery",
      components: {
        ShowBranchSec:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
  },
  data() {
    return {
      licenseFlag:false,
      authPath: this.$route.path ,
      tempShowExcelTemplateWin:false,
      param:"",
      rows:"",
      sumMoney : "",
      total : "",
      formItem: {
        brchNos: "",
        drwrName: '',
        acptName: '',
        acptDtStart: '',
        acptDtEnd: '',
        dueDtStart: '',
        dueDtEnd: '',
        billNo:"",
        billRangeStart:"",
        billRangeEnd:""
      },
      acctStatusList:[],
      acptDt : [],
      dueDt : [],
      billId : '',

      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          key:"duoxuan",
          hiddenCol: false
        },
        {
          key: 'id',
          hiddenCol: true,
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: 'billNo',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let type = "";
            if (!!params.row.id) {
              type = "billId";
            } else {
              type = "billNo";
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row, type);
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
          title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drwrBankName"),
          key: 'drwrBankName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.acptCustName"),
          key: 'acptName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.acptDt"),
          key: 'acptDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.acptDt == null || params.row.acptDt === ""){
              return "";
            }
            let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.billClass"),
          key: 'billClass',
          hiddenCol: false,
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
          title: this.$t("m.i.billInfo.billType"),
          key: 'billType',
          hiddenCol: false,
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
          title: this.$t("m.i.billInfo.billStatus"),
          key: 'billStatus',
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"BillStatusCode",params.row.billStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
      ],
      YonList: [],
      acptStatusList: [],
      deductStatusDictList: [],
      billOriginList: [],
      dictMap: new Map(),
      currentSelectRow: [],
      showCustAcctNoWin: false,
      showDrwrCustMessageWin: false,
      showAcptCustMessageWin: false,
      showBranchWin: false,
      ifShowMore: false,
      billNo: "",
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
        this.formItem.drwrName = "";
      }
    },

    //承兑日期格式转换
    handleAcptDtChange(arr) {
      if (arr && arr.length >= 2) {
        this.formItem.acptDtStart = arr[0].replace(/-/g, "");
        this.formItem.acptDtEnd = arr[1].replace(/-/g, "");
        this.acptDt = [arr[0], arr[1]];
      }else{
        this.formItem.acptDtStart ='';
        this.formItem.acptDtEnd ='';
      }
    },

    //汇票到期日日期格式转换
    handleDueDtChange(arr) {
      if (arr && arr.length >= 2) {
          this.formItem.dueDtStart = arr[0].replace(/-/g, "");
          this.formItem.dueDtEnd = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
      }
    },
    //表单查询
    handleSearch() {
      this.$refs.datagrid.selects = [];
      this.$nextTick(() => {
        this.$refs.datagrid.dataChange(1);
      })
    },
    //重置表单查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
      this.acptDt = [];
      this.dueDt = [];
      this.formItem.acptDtStart = "";
      this.formItem.acptDtEnd = "";
      this.formItem.dueDtStart = "";
      this.formItem.dueDtEnd = "";
    },
    //清单导出
    exportData() {
      this.param = 'exportaccepBillBusi';
      if (this.$refs.datagrid.selectIds.length !== 0) {
        this.rows = this.$refs.datagrid.selectIds.length;
      }else {
        this.rows = this.$refs.datagrid.total;
      }
      this.tempShowExcelTemplateWin = true;
    },
    exportList(field, exportType){
      //exportType: 0-同步 1-异步
      let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/controller/func_exportaccepBillBusi";
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
    drwrqueryCustName() {
      this.showDrwrCustMessageWin = true;
    },
    acptqueryCustName() {
      this.showAcptCustMessageWin = true;
    },
    //赋值
    drwrCustCorpSelectSubmit(drwrInfo) {
      this.formItem.drwrName = drwrInfo.custName;
      this.showDrwrCustMessageWin = false;
    },
    //赋值
    acptCustCorpSelectSubmit(acptInfo) {
      this.formItem.acptName = acptInfo.custName;
      this.showAcptCustMessageWin = false;
    },
    //关闭
    custDrwrCorpWinClose() {
      this.showDrwrCustMessageWin = false;
    },
    //关闭
    custAcptCorpWinClose() {
      this.showAcptCustMessageWin = false;
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
    showBillInfo(row, type) {
      this.billId = "";
      this.billNo = "";
      this.billRangeStart = "";
      this.billRangeEnd = "";
      if (type === "billId") {
        this.billId = row.id;
      } else {
        this.billNo = row.billNo;
      }
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
  },
  created() {
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    this.formItem.brchNos = userInfo.brchNo;
    this.formItem.branchName = userInfo.brchName;
    let workDateStart = this.$moment(window.sessionStorage.getItem("workDate")).format("YYYY-MM-DD");
    let workDateEnd = this.$moment(window.sessionStorage.getItem("workDate")).format("YYYY-MM-DD");
    this.acptDt.push(workDateStart);
    this.acptDt.push(workDateEnd);
    this.formItem.acptDtStart = workDateStart.replace(/-/g, "");
    this.formItem.acptDtEnd = workDateEnd.replace(/-/g, "");
  },

  mounted() {
    this.$nextTick(()=>{this.getDictListByGroups("BillOrigin,DraftTypeCode,BillStatusCode,CDMedia,BillStatusCode").then(res => {
      this.billOriginList = res.get("BillOrigin");
      this.billStatusList = res.get("BillStatusCode");
      this.dictMap = res.get('map');
    });})

  },
};
</script>

<style scoped>

</style>
