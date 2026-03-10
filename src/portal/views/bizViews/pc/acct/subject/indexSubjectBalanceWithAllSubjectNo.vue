<style>

</style>
<!--科目余额 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                  <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.accountBrch')" prop="brchNos"
                               title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.brchName">
                  </show-branch>
                  <h-form-item :label="$t('m.i.pc.date')" prop="Date">
                    <h-date-picker type="daterange" v-model="formItem.Date" format="yyyy-MM-dd" showFormat @on-change="handleDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.subjectCode')" prop="subjectNo">
                    <h-input v-model="formItem.subjectNo" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <!--<span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>

                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/acct/subjectbalance/func_querySubjectSumBalanceWithAllSubjectNo"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>
<script>
  import { post, on,off,exportList,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: 'indexSubjectBalanceWithAllSubjectNo',
    data() {
      let formItem = {
        subjectNo: "",
        brchNos:'',
        // startDate:'',
        // endDate:"",
        Date:'',
      };
      let _this = this;
      return {
        formItem : formItem,
        traderForm : {
          traderId: "",
          traderName: "",
          traderType:""
        },
        typeForm : {
          copyType: "1",
          toCopyRoleCode:"",
          creators:"",
          copyRoleCode:""
        },
        type : null,
        addOrEditWin : false,
        setRoleRole : false,
        setRoleRight : false,
        setRoleAllotRight : false,
        copyWin : false,
        readonly:false,
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        isRequired:true,
        addForm : {
          roleCode: "",
          roleName: "",
          roleOrder: "",
          paramValue: "",
          kindCode: "BIZFRAME",
          kindId:"",
          paramDesc: "",
          paramRegex: "",
          relOrg:"0_000000",
          beginDate:"",
          endDate:"",
          beginDateFmt:"",
          endDateFmt:"",
          roleType:0,
          schemeId:"",
          schemeName: "",
          remark:""
        },
        //给按钮增加权限
        authObj : {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true, //角色信息下载
        },
        columns : [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 60
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 60
          },
          {
            title: this.$t("m.i.pc.subjectCode"),
            key: "subjectNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.subjectName"),
            key: "subjectName",

            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.drBalanceBefore"),
            key: "drBalanceBefore",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              if (params.row.drBalanceBefore == null || params.row.drBalanceBefore === "") {
                return h("span", "0.00");
              } else {
                let fee = formatNumber(params.row.drBalanceBefore, 2, ',');
                return h("span", {
                  domProps: {
                    title: fee
                  }
                }, fee);
              }
            }
          },
          {
            title:  this.$t("m.i.pc.crBalanceBefore"),
            key: "crBalanceBefore",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              if (params.row.crBalanceBefore == null || params.row.crBalanceBefore === "") {
                return h("span", "0.00");
              } else {
                let fee = formatNumber(params.row.crBalanceBefore, 2, ',');
                return h("span", {
                  domProps: {
                    title: fee
                  }
                }, fee);
              }
            }
          },
          {
            title: this.$t("m.i.pc.drAmount"),
            key: "drAmount",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.drAmount == null || params.row.drAmount === "") {
                return h("span", "0.00");
              } else {
                let fee = formatNumber(params.row.drAmount, 2, ',');
                return h("span", {
                  domProps: {
                    title: fee
                  }
                }, fee);
              }
            }
          },
          {
            title: this.$t("m.i.pc.crAmount"),
            key: "crAmount",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.crAmount == null || params.row.crAmount === "") {
                return h("span", "0.00");
              } else {
                let fee = formatNumber(params.row.crAmount, 2, ',');
                return h("span", {
                  domProps: {
                    title: fee
                  }
                }, fee);
              }
            }
          },
          {
            title: this.$t("m.i.pc.drBalance"),
            key: "drBalance",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.drBalance == null || params.row.drBalance === "") {
                return h("span", "0.00");
              } else {
                let fee = formatNumber(params.row.drBalance, 2, ',');
                return h("span", {
                  domProps: {
                    title: fee
                  }
                }, fee);
              }
            }
          },
          {
            title: this.$t("m.i.pc.crBalance"),
            key: "crBalance",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.crBalance == null || params.row.crBalance === "") {
                return h("span", "0.00");
              } else {
                let fee = formatNumber(params.row.crBalance, 2, ',');
                return h("span", {
                  domProps: {
                    title: fee
                  }
                }, fee);
              }
            }
          },
        ],

        histData : {rows:[],
          total:1},
        traderData : {rows:[],
          total:1},
        userTraderWin : false,
        showDefaultTeller:false,
        branchDto : {},
        currentSelectRow : [],
        traderSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        tempInx : 0,
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        brchRoleDistributeWin : false,
        userHistWin : false,
        defaultTraderNo:null,
        showBranchMenuWin:false,
        submitCopyRoleDisabled : false,
        numberRule : ['num'],
        deletDisabled : false,
        kindTree: [],
        submitFlag : false,
        ifShowMore :false,
        schemeIdList : [],
        reqUrl : '/pc/acct/subjectbalance',
        maxEndDate : {
          disabledDate(date) {
            let start = _this.$moment(formItem.endDate).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0 || end / (3600 * 1000 * 24) > 30;
          }
        },
      };
    },
    components: {

    },
    methods:{
      handleMinChange(value) {
        this.formItem.startDate = value.replace(/-/g, "");
      },
      handleMaxChange(value) {
        this.formItem.endDate = value.replace(/-/g, "");
      },
      handleDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.startDate = arr[0].replace(/-/g, "");
          this.formItem.endDate = arr[1].replace(/-/g, "");
        }else{
          this.formItem.startDate = "";
          this.formItem.endDate = "";
        }
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.setDefaultValue()
      },
      setDefaultValue(){
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos=userInfo.brchNo
        this.formItem.brchName = userInfo.brchName;
        let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.formItem.Date=[workDate, workDate];
        this.formItem.startDate = window.sessionStorage.getItem("workDate");
        this.formItem.endDate = window.sessionStorage.getItem("workDate");
      },
      showAcctRecordClose() {
        this.showAcctRecordWin = false;
      },
      showBillWinClose() {
        this.showBillWin = false;
      },
      handleSelectClick(arr,selectInx) {

        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx
        if(arr.length==0) return
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      listExport() {
        this.param = "subjectBalanceHistoryResultExport";
        this.rows = this.$refs.datagrid.total;
        this.tempShowExcelTemplateWin = true;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/acct/subjectbalance/func_downloadSubjectbalanceQuery";
        let options = {};
        options.params = this.formItem;
        options.pageSize = this.$refs.datagrid.total;
        exportList(this, this.param, field, exportType, url, options);
      }
    },
    created() {
      this.setDefaultValue()
    },
  };
</script>
