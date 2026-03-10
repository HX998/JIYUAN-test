<style>

</style>
<!--流水管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row">
                  <h-form-item prop="compareDts" :label="$t('m.i.pc.compareDt')">
                    <h-date-picker v-model="formItem.compareDts" format="yyyy-MM-dd" type="date"
                                   placeholder=""
                                   showFormat :editable=false :clearable="true"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.compareAcctResult')" prop="compareAcctResult">
                    <h-select v-model="formItem.compareAcctResult" placeholder="" showTitle>
                      <h-option value="0">全部</h-option>
                      <h-option value="1">票据缺失</h-option>
                      <h-option value="2">核心缺失</h-option>
                      <h-option value="4">借贷金额不平</h-option>
                      <h-option value="3">正常</h-option>
                    </h-select>
                  </h-form-item>
                  <show-branch v-model="formItem.accountBrchNos" :label="$t('m.i.pc.accountBrch')" prop="accountBrchNos"
                               title="机构名称" :brchNo.sync="formItem.accountBrchNos" :brchName.sync="formItem.branchName">
                  </show-branch>
                  <h-form-item :label="$t('m.i.common.foreFlowNo')" prop="foreFlowNo">
                    <h-input v-model="formItem.foreFlowNo" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.backFlowNo')" prop="backFlowNo">
                    <h-input v-model="formItem.backFlowNo" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.acctTellerNo')" prop="acctTellerNo">
                    <h-input v-model="formItem.acctTellerNo" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" highlight-row url="/pc/acct/compare/indexCompareAcctResult/func_queryCompareAcctResult" :bindForm="formItem" :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick" ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="compareApply()" v-if="isShowBtn === '1'">{{$t('m.i.pc.compareApply')}}</h-button>
              <h-button type="primary" @click="compareAcct()" v-if="isShowBtn === '1'">{{$t('m.i.pc.compareAcct')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: 'indexCompareAcctResult',
    data() {
      return {
        formItem : {
          compareDt: "",
          compareDts: "",
          compareAcctResult: "",
          accountBrchNos:'',
          foreFlowNo:'',
          backFlowNo:'',
          acctTellerNo:""
        },
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
        isRequired:true,
        isShowBtn:"",
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
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center'
          },
          {
            title: this.$t("m.i.pc.compareAcctResult"),
            key: "compareAcctResult",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatteriscompareAcctResult(params.row.compareAcctResult,params.row,params.row.index))
              ]);
            }
          },
          {
            title: this.$t("m.i.common.foreFlowNo"),
            key: "foreFlowNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.backFlowNo"),
            key: "backFlowNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.pc.compareDt'),
            key: "compareDt",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.acctDt'),
            key: "coreSysBusiDt",
            hiddenCol:false,
            sortable: true
          },

          {
            title:this.$t('m.i.pc.coreSysDrAmt'),
            key: "coreSysDrAmt",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.pc.coreSysCrAmt'),
            key: "coreSysCrAmt",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.pc.billSysDrAmt'),
            key: "billSysDrAmt",
            hiddenCol:false,
          },
          {
            title: this.$t('m.i.pc.billSysCrAmt'),
            key: "billSysCrAmt",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.operTellerNo'),
            key: "operTellerNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.acctTellerNo'),
            key: "acctTellerNo",
            hiddenCol: false,
            sortable: true,
          }],
        histData : {rows:[],
          total:1},
        traderData : {rows:[],
          total:1},
        userTraderWin : false,
        showDefaultTeller : false,
        branchDto : {},
        currentSelectRow : [],
        traderSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        ifShowMore : false,
        tempInx : 0,
        brchRoleDistributeWin : false,
        userHistWin : false,
        defaultTraderNo : null,
        showBranchMenuWin : false,
        submitCopyRoleDisabled : false,
        numberRule : ['num'],
        deletDisabled : false,
        kindTree : [],
        submitFlag : false,
        schemeIdList : [],
        reqUrl : '/pc/acct/compareAcct',
      };
      function formatteriscompareAcctResult(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case '1':return '票据缺失';
            case '2':return '核心缺失';
            case '3':return '正常';
            case '4':return '借贷金额不平';
          }
        } else {
          return "";
        }
      }
    },
    components: {

    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.accountBrchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
      this.formItem.compareDt = window.sessionStorage.getItem("preWorkDate");
      this.formItem.compareDts = window.sessionStorage.getItem("preWorkDate");
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
                if (this.btnAuth.isShowBtn === undefined ? true : this.btnAuth.isShowBtn.isShow) {
                this.isShowBtn = '1';
              } else {
                this.isShowBtn = '0';
              }
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formSearch() {
        let compareDt = this.formItem.compareDts.replace(/-/g, "");
        this.formItem.compareDt=compareDt;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.accountBrchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.formItem.compareDt = window.sessionStorage.getItem("preWorkDate");
        this.formItem.compareDts = window.sessionStorage.getItem("preWorkDate");
      },
      compareApply(){
        this.$hMsgBox.confirm({
          title: "提交",
          content: "确认提交吗？",
          onOk: () => {
            this.submitCompareApply();
          }
        });
      },
      submitCompareApply(){
        post({},'/pc/acct/compare/indexCompareAcctResult/func_compareApply').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this, { info: "操作成功" });
            }else{
              this.$msgTip.error(this,{info:"操作失败:" + res.data.retMsg});
            }
          }else{
            this.$msgTip.error(this,{info:"操作失败"});
          }
        });
      },
      compareAcct(){
        this.$hMsgBox.confirm({
          title: "提交",
          content: "确认提交吗？",
          onOk: () => {
            this.submitCompareAcct();
          }
        });
      },
      submitCompareAcct(){
        post({},'/pc/acct/compare/indexCompareAcctResult/func_compareAcct').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this, { info: "操作成功" });
            }else{
              this.$msgTip.error(this,{info:"操作失败:" + res.data.retMsg});
            }
          }else{
            this.$msgTip.error(this,{info:"操作失败"});
          }
        });
      },
      showAcctRecordClose() {
        this.showAcctRecordWin = false;
      },
      showBillWinClose() {
        this.showBillWin = false;
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx
        if (arr.length == 0) return
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      getParams(){
        if (this.$route.path === "/pc/acct/compare/indexCompareAcctResult") {
          if (this.$route.query.compareDts) {
            let compareDts = this.$moment(this.$route.query.compareDts, "YYYY-MM-DD").format("YYYYMMDD");
            this.formItem.compareDts = compareDts;
            this.$nextTick(() => {
              this.formSearch();
            });
          }
        }
      }
    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      this.getParams();
      this.buttonAuthShow();
    },
  };
</script>
