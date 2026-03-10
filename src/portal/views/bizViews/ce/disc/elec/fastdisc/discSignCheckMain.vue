<!--极速贴现-签约复核-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')">
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearCustNo()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60 readonly></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()" clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.signApplyDt')" prop="minApplDt">
                  <h-date-picker :value="applDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleApplDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.signEnableDt')" prop="minActiveDt">
                  <h-date-picker :value="activeDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleActiveDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.signDueDt')" prop="minFailureDt">
                  <h-date-picker :value="failureDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleFailureDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.discInBrchName')" prop="discInBrchName">
                  <h-input v-model="formItem.discInBrchName" placeholder="" readonly :maxlength="125" :title="formItem.discInBrchName"
                           icon="android-search" @on-click="queryDiscInBrchNo('query')" clearable @on-clear="clearDiscInBrchNo('query')"></h-input>
                </h-form-item>
                <h-form-item prop="custMgrName" :label="$t('m.i.ce.inCustManager')">
                  <h-input v-model="formItem.custMgrName" placeholder="" readonly icon="android-search"
                           @on-click="queryCustManager('query')" clearable @on-clear="clearCustManager('query')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/ce/disc/elec/fastdisc/discSignCheckMain/func_queryList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="signOperate('check')">复核
              </h-button>
              <h-button type="primary" @click="signOperate('detail')">查看操作历史</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--查询客户经理-->
    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="$t('m.i.ce.selectManager')"
                       @showCustManagerWinClose="showCustManagerWinClose"
                       @custManagerSelect="custManagerSelect"></show-cust-manager>
    <!--贴入行机构-->
    <show-branch :showBranchWin="showDiscInBrchWin" @brchNoChange="discInBrchChange"
                 @showBranchWinClose="showDiscInBrchWinClose"></show-branch>
    <!--签约操作弹出框-->
    <disc-sign-operate :discSignOperateWin="discSignOperateWin" :signParams="signParams" ref="discSignOperate"
                       @discSignOperateWinClose="discSignOperateWinClose"
                       :signInfoUrl="'/ce/disc/elec/fastdisc/discSignCheckMain/func_info'"
                       :updateSignUrl="'/ce/disc/elec/fastdisc/discSignCheckMain/func_updateBeforeLog'"
                       :operSignUrl="operSignUrl"
                       @discSignOperateSubmit="discSignOperateSubmit"></disc-sign-operate>
    <!--查看操作历史-->
    <disc-sign-log :discSignLogWin="discSignLogWin" :detailFormItem="detailFormItem" :dictMap="dictMap"
                   :histListUrl = "'/ce/disc/elec/fastdisc/discSignCheckMain/func_queryHistList'"
                   @discSignLogWinClose="discSignLogWinClose"></disc-sign-log>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "discSignCheckMain",
    components: {
      DiscSignLog:() => import(/* webpackChunkName: "ce/disc/elec/fastdisc/discSignLog" */`@/views/bizViews/ce/disc/elec/fastdisc/discSignLog`),
      ShowBranch:() => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      DiscSignOperate:() => import(/* webpackChunkName: "ce/disc/elec/fastdisc/discSignOperate" */`@/views/bizViews/ce/disc/elec/fastdisc/discSignOperate`),
      ShowCustManager:() => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`)
    },
    data() {
      return {
        activeDt : [],
        applDt : [],
        failureDt : [],
        formItem : {
          busiType: "2",
          custNo: "",
          custName: "",
          custAcctNo: "",
          minApplDt: "",
          maxApplDt: "",
          minActiveDt: "",
          maxActiveDt: "",
          minFailureDt: "",
          maxFailureDt: "",
          discInBrchNo: "",
          discInBrchName: "",
          custMgrNo: "",
          custMgrName: ""
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
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
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.operType"),
            key: "operTypeName",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.ce.signBrchName"),
            key: "signBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.signStatus"),
            key: "signStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FDiscSignStatus", params.row.signStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.signApplyDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt;
              if (!!params.row.applDt) {
                date = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.signApplyTm"),
            key: "applTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let time = params.row.applTm;
              if (!!params.row.applTm) {
                let transTm = params.row.applTm.toString();
                if (transTm.length < 6) {
                  for (let i = 0; i < (6 - transTm.length); i++) {
                    transTm = "0" + transTm;
                  }
                }
                time = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              }
              return h("span", time);
            }
          },
          {
            title: this.$t("m.i.ce.signEnableDt"),
            key: "activeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.activeDt;
              if (!!params.row.activeDt) {
                date = this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.signDueDt"),
            key: "failureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.failureDt;
              if (!!params.row.failureDt) {
                date = this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.adjustRate"),
            key: "adjustRate",
            hiddenCol: false,
            render: (h, params) => {
              let  adjustRate = formatNumber(accMul(params.row.adjustRate, 100), 4, ",");
              return h("span", adjustRate);
            }
          },
          {
            title: this.$t("m.i.ce.limitAmt"),
            key: "limitAmt",
            hiddenCol: false,
            render: (h, params) => {
              let limitAmt = formatNumber(params.row.limitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: limitAmt
                }
              }, limitAmt);
            }
          },
          {
            title: this.$t("m.i.ce.discInBrchName"),
            key: "discInBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.isBargain"),
            key: "isBargain",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isBargain);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.bargainAuditBrchName"),
            key: "bargainAuditBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.inCustManagerNo"),
            key: "custMgrNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.inCustManagerName"),
            key: "custMgrName",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.ce.custArea"),
            key: "custArea",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CustArea", params.row.custArea);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        operSignUrl : "",
        YonList : [],
        custAreaList : [],
        dictMap : new Map(),
        currentSelectRow : [],
        //是否显示更多查询项
        ifShowMore : false,
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        showCustManagerWin : false,
        custManagerOptType : null,
        //贴入行机构查询弹出框
        showDiscInBrchWin : false,
        discInBrchOptType : null,
        //签约操作弹出框
        discSignOperateWin : false,
        signParams : {},
        //查询操作历史弹出框
        discSignLogWin : false,
        detailFormItem : {},
      };
    },
    mounted() {
      this.getDictListByGroups("FDiscSignStatus,Yon,CustArea").then(res => {
        this.YonList = res.get("Yon");
        this.custAreaList = res.get("CustArea");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectRow = [];
            this.formItem.minApplDt = this.formItem.minApplDt.replace(/-/g, "");
            this.formItem.maxApplDt = this.formItem.maxApplDt.replace(/-/g, "");
            this.formItem.minActiveDt = this.formItem.minActiveDt.replace(/-/g, "");
            this.formItem.maxActiveDt = this.formItem.maxActiveDt.replace(/-/g, "");
            this.formItem.minFailureDt = this.formItem.minFailureDt.replace(/-/g, "");
            this.formItem.minFailureDt = this.formItem.minFailureDt.replace(/-/g, "");
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.activeDt = [];
        this.applDt = [];
        this.failureDt = [];
        this.formItem.minActiveDt = "";
        this.formItem.maxActiveDt = "";
        this.formItem.minApplDt = "";
        this.formItem.maxApplDt = "";
        this.formItem.minFailureDt = "";
        this.formItem.maxFailureDt = "";
        this.formItem.custMgrNo = "";
        this.formItem.discInBrchNo = "";
        this.$refs.formItem.resetFields();
        this.currentSelectRow = [];
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleActiveDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minActiveDt = arr[0].replace(/-/g, "");
          this.formItem.maxActiveDt = arr[1].replace(/-/g, "");
          this.activeDt = [arr[0], arr[1]];
        } else {
          this.formItem.minActiveDt = "";
          this.formItem.maxActiveDt = "";
          this.activeDt = [];
        }
      },
      handleApplDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDt = [arr[0], arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDt = [];
        }
      },
      handleFailureDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minFailureDt = arr[0].replace(/-/g, "");
          this.formItem.maxFailureDt = arr[1].replace(/-/g, "");
          this.failureDt = [arr[0], arr[1]];
        } else {
          this.formItem.minFailureDt = "";
          this.formItem.maxFailureDt = "";
          this.failureDt = [];
        }
      },
      clearCustNo() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
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
      clearCustManager(optType) {
        if (optType === "query") {
          this.formItem.custMgrNo = "";
          this.formItem.custMgrName = "";
        } else if (optType === "add") {
          this.$refs.discSignOperate.discSignOperateForm.custMgrNo = "";
          this.$refs.discSignOperate.discSignOperateForm.custMgrName = "";
        }
      },
      //查询客户经理
      queryCustManager(optType) {
        this.showCustManagerWin = true;
        this.custManagerOptType = optType;
      },
      //赋值
      custManagerSelect(info) {
        if (this.custManagerOptType === "query") {
          this.formItem.custMgrNo = info.custMgrNo;
          this.formItem.custMgrName = info.custMgrName;
        } else if (this.custManagerOptType === "add") {
          this.$refs.discSignOperate.discSignOperateForm.custMgrNo = info.custMgrNo;
          this.$refs.discSignOperate.discSignOperateForm.custMgrName = info.custMgrName;
        }
        this.showCustManagerWin = false;
      },
      //关闭弹窗
      showCustManagerWinClose() {
        this.showCustManagerWin = false;
      },
      clearDiscInBrchNo(optType) {
        if (optType === "query") {
          this.formItem.discInBrchNo = "";
          this.formItem.discInBrchName = "";
        } else if (optType === "add") {
          this.$refs.discSignOperate.discSignOperateForm.discInBrchNo = "";
          this.$refs.discSignOperate.discSignOperateForm.discInBrchName = "";
        }
      },
      //查询贴入行机构弹出框
      queryDiscInBrchNo(optType) {
        this.showDiscInBrchWin = true;
        this.discInBrchOptType = optType;
      },
      //根据弹框所选数据进行赋值
      discInBrchChange(info) {
        if (this.discInBrchOptType === "query") {
          this.formItem.discInBrchNo = info[0].id;
          this.formItem.discInBrchName = info[0].title;
        } else if (this.discInBrchOptType === "add") {
          this.$refs.discSignOperate.discSignOperateForm.discInBrchNo = info[0].id;
          this.$refs.discSignOperate.discSignOperateForm.discInBrchName = info[0].title;
        }
        this.showDiscInBrchWin = false;
      },
      showDiscInBrchWinClose() {
        this.showDiscInBrchWin = false;
      },
      signOperate(optType) {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (optType !== "detail") {
            this.discSignOperateWin = true;
            if (optType == "check") {
              this.operSignUrl = "/ce/disc/elec/fastdisc/discSignCheckMain/func_check";
            }
            this.signParams = {
              optType: optType,
              custAreaList: this.custAreaList,
              YonList: this.YonList,
              dictMap: this.dictMap,
              currentSelectRow: this.currentSelectRow
            };
          } else {
            this.discSignLogWin = true;
            this.detailFormItem.signId = this.currentSelectRow.id;
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      discSignOperateSubmit() {
        this.discSignOperateWin = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.currentSelectRow = [];
        this.signParams = {};
      },
      discSignOperateWinClose() {
        this.discSignOperateWin = false;
        this.signParams = {};
      },
      discSignLogWinClose() {
        this.discSignLogWin = false;
        this.detailFormItem = {};
      },
    }
  };
</script>

<style scoped>

</style>
