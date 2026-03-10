<!-- 解质押登记申请 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div v-if="mainVue">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')" :title="formItem.ownedBrchNames" ></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly  clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()"
                           readonly clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/impawn/paper/paperUnImpawn/pUnImpawnRgstApplyMain/func_list"
                      :bindForm="formItem"
                      :autoLoad="false"
                      :on-select-change="handleSelectClick"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()" >{{$t('m.i.ce.billManage')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <p-un-impawn-rgst-apply-batch-info-detail :is-show="billManagerVue" :params="this.batchInfoParams"
                                            ref="pUnImpawnRgstBatchInfoDetail"></p-un-impawn-rgst-apply-batch-info-detail>
        <div v-if="billManagerVue">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/impawn/paper/paperUnImpawn/pUnImpawnRgstApplyMain/func_rgstBillList"
                      highlightRow
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      :row-select="true"
                      :has-select="false"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="submitRecheckDetail">
                <h-button type="primary">提交复核<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次提交复核</h-dropdown-item>
                  <h-dropdown-item name="select">选择提交复核</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="ghost" @click="returnMain" >返回</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit" title="查询出票人账号信息"></show-cust-acct-no>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

      </h-col>
    </h-row>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "pUnImpawnRgstApplyMain",
    components: {
      PUnImpawnRgstApplyBatchInfoDetail:()=>import(/* webpackChunkName: "ce/impawn/paper/paperUnImpawn/pUnImpawnRgstApplyBatchInfoDetail" */`@/views/bizViews/ce/impawn/paper/paperUnImpawn/pUnImpawnRgstApplyBatchInfoDetail`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      let columns = [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
        },
        {
          type: 'selection',
          key: 'multiSelect',
          width: 60,
          hiddenCol: true,
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
          key: "ownedBrchNo",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: 'batchNo',
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
                    this.batchNoMain(params.row)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.custName"),
          key: 'custName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: 'custAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: 'billType',
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.common.unImpawnDt"),
          key: 'unimpawnDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.unimpawnDt == null || params.row.unimpawnDt === ""){
              return "";
            }
            let date = this.$moment(params.row.unimpawnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.releaseUse"),
          key: 'getWay',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: 'sumCount',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
          key: 'sumMoney',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let sumMoney = formatNumber(params.row.sumMoney, 2, ',');
            return h("span", {
              domProps: {
                title: sumMoney
              }
            }, sumMoney);
          }
        }
      ];
      let billManagerColumns = [
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
          title: this.$t("m.i.billInfo.billNo"),
          key: 'billNo',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (!!params.row.billId) {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            } else {
              return h("span", null, params.row.billNo);
            }
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: 'flowStatusName',
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.unimpawnRgstStatus == null || params.row.unimpawnRgstStatus === "") {
              let flowStatusName = params.row.flowStatusName;
              return h("span", flowStatusName);
            } else {
              let unimpawnRgstStatus = this.getDictValueFromMap(this.dictMap, "ImpawnRgstStatus", params.row.unimpawnRgstStatus);
              return h("span", unimpawnRgstStatus + "(" + params.row.flowStatusName + ")");
            }
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: 'billType',
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billMoney"),
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
          title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drweBankName"),
          key: "drweBankName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drweBankNo"),
          key: "drweBankNo",
          hiddenCol: false
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
            title: this.$t("m.i.billInfo.acptBankName"),
          key: 'acptBankName',
          hiddenCol: false,
          sortable: true,
        },
        {
           title: this.$t("m.i.billInfo.acptName"),
          key: 'acptName',
          hiddenCol: false,
          sortable: true,
        },
      ];
      return {
        formItem: {
          custNo: '',
          custName: '',
          custAcctNo: '',
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          billClass: 'ME01',
          unImpawnRgstStatusList: 'BTC01,BTC06,BTC09',
          queryFlag: "0",
        },
        billManagerFormItem: {
          batchId: '',
          queryType: '1'
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        currentSelectRow: [],
        dictMap: new Map(),
        mainVue: true,
        billManagerVue: false,
        batchId: "",
        batchInfoParams: {
          batchId: '',
          unImpawnRgstStatus: 'BTC01,BTC06,BTC09',
          dictMap: new Map(),
        },
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        showBillInfoWin: false,
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        // brchNoWin : false,
        billId: ""
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,ImpawnRgstStatus").then(res => {
        this.dictMap = res.get("map");
      });
      post({ paramKey: "ce.unimpawn.rgst_audit_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let auditMode = res.data.retData;
            if(auditMode == '0'){
              this.formItem.unImpawnRgstStatusList =  'BTC01,BTC05,BTC06,BTC09';
              this.batchInfoParams.unImpawnRgstStatus =  'BTC01,BTC05,BTC06,BTC09';
            }
          }
        }
        this.handleSearch();
      });

      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let  columns = [];
            if (this.licenseFlag) {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.temp = this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
          this.formItem.custName = "";
        } else {
          this.formItem.custAcctNo = '';
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.ownedBrchNo = "";
          this.formItem.ownedBrchName = "";
          this.formItem.ownedBrchNos = "";
          this.formItem.ownedBrchNames = "";
          this.formItem.custNo = '';
          this.formItem.custName = '';
          this.formItem.custAcctNo = '';
        });
      },
      //行选中
      handleSelectClick(arr) {
        this.currentSelectRow = arr;
      },

      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.$refs.formItem.resetFields();
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.custAcctNo = info.custAcctNo;
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
        if(this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },


      //主页面票据管理
      billManager() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow[0].id;
        this.ownedBrchNo = this.currentSelectRow[0].ownedBrchNo;
        this.billManagerFormItem.batchId = this.batchId;
        this.batchInfoParams.batchId = this.batchId;
        this.batchInfoParams.dictMap=this.dictMap;
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
      //批次编号超链接
      batchNoMain(info) {
        this.batchId = info.id;
        this.ownedBrchNo = info.ownedBrchNo;
        this.billManagerFormItem.batchId = this.batchId;
        this.batchInfoParams.batchId = this.batchId;
        this.batchInfoParams.dictMap=this.dictMap;
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



      //子页面
      //表单查询
      billManagerHandleSearch() {
        this.$refs.billManagerDatagrid.selects = [];
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.pUnImpawnRgstBatchInfoDetail.getBatchInfo();
        })
      },
      //提交复核
      submitRecheckDetail(str) {
        if(str === "batch") {
          this.batchSubmitRecheckConfirm();
        }
        if(str === "select") {
          this.selectSubmitRecheckConfirm();
        }
      },

      batchSubmitRecheckConfirm() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次提交复核吗?",
          onOk: () => {
            this.batchSubmitRecheck();
          }
        });
      },
      //批次提交复核
      batchSubmitRecheck() {
        let url = "/ce/impawn/paper/paperUnImpawn/pUnImpawnRgstApplyMain/func_submit";
        post({batchId: this.batchId, unImpawnRgstStatus : this.formItem.unImpawnRgstStatusList,
          ownedBrchNo : this.ownedBrchNo,
          licenseFlag : this.licenseFlag}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.returnMain();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      selectSubmitRecheckConfirm() {
        if(this.$refs.billManagerDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交复核吗?",
          onOk: () => {
            this.selectSubmitRecheck();
          }
        });
      },
      //选择提交复核
      selectSubmitRecheck() {
        let list = this.$refs.billManagerDatagrid.selects;
        let ids = "";
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          if(i<list.length-1) {
            ids += ",";
          }
        }
        let url = "/ce/impawn/paper/paperUnImpawn/pUnImpawnRgstApplyMain/func_submit";
        post({unImpawnIds: ids, batchId: this.batchId, unImpawnRgstStatus : this.formItem.unImpawnRgstStatusList,
          ownedBrchNo : this.ownedBrchNo,
          licenseFlag : this.licenseFlag}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              if(this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
                this.returnMain();
              }else {
                this.$refs.pUnImpawnRgstBatchInfoDetail.getBatchInfo();
                this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
                this.$refs.billManagerDatagrid.selects = [];
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //返回
      returnMain() {
        this.$refs.billManagerDatagrid.tData = [];
        this.mainVue = true;
        this.billManagerVue = false;
        this.currentSelectRow = [];
        this.$refs.billManagerDatagrid.selects = [];
        this.handleSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
        });
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
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
      },
      brchNoWinOpen() {
        this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    }

  };
</script>

<style scoped>

</style>
