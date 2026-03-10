<!--秒兑规则-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.legalpersonName')" prop="legalNo" v-if="isShow">
                  <h-input v-model="formItem.legalpersonName" readonly icon="android-search"
                           @on-click="queryLegalPersonName" :maxlength="60" clearable @on-clear="clearVal()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.ruleCode')" prop="ruleCode">
                  <h-input v-model="formItem.ruleCode" :maxlength="100"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.ruleName')" prop="ruleName">
                  <h-input v-model="formItem.ruleName" :maxlength="100"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate" :class="!isShow ? 'two-form' : ''">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/ce/acpt/fastCash/fastCashRule/func_queryFCashRolePage"
            :bindForm="formItem"
            :has-select="false"
            :row-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleRuleDistribute" v-if="authObj.ruleDistribute && isShow">
                {{$t("m.i.common.allot")}}
              </h-button>
              <h-button type="primary" @click="handleRuleModify" v-if="authObj.ruleModify">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm" v-if="authObj.ruleDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>修改秒兑规则</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.ruleCode')" prop="ruleCode" :required="isRequired">
            <h-input v-model="addForm.ruleCode" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleName')" prop="ruleName" :required="isRequired">
            <h-input v-model="addForm.ruleName" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleBean')" :required="isRequired">
            <h-input v-model="addForm.ruleBean" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleStatus')" prop="ruleStatus" :required="isRequired">
            <h-select v-model="addForm.ruleStatus" placeholder="" showTitle>
              <h-option value="0">失效</h-option>
              <h-option value="1">生效</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleValue')" prop="ruleValue">
            <h-input v-model="addForm.ruleValue" :maxlength="100"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleDesc')" prop="ruleDesc" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addForm.ruleDesc" :canResize="false"
                     :maxlength="125"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.flowFuncNo')" prop="flowFuncNo" >
            <h-input v-model="addForm.flowFuncNo" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.flowFuncName')" prop="flowFuncName" >
            <h-input v-model="addForm.flowFuncName" :maxlength="100" readonly></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <legal-person-search :showLegalPersonWin="showLegalPersonWin" @legalPersonChange="legalPersonChange"
                         @legalPersonWinClose="legalPersonWinClose"></legal-person-search>
    <allocation-f-cash-rule :allocationFCashRuleWin="allocationFCashRuleWin" :ruleIds="ruleIds"
                            @allocationFCashRuleWinClose="allocationFCashRuleWinClose"
                            @allocationFCashRuleSubmit="allocationFCashRuleSubmit"></allocation-f-cash-rule>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "fastCashRule",
    data() {
      return {
        formItem : {
          legalNo: "",
          legalpersonName: "",
          ruleCode: "",
          ruleName: ""
        },
        //给按钮增加权限
        authObj : {
          ruleDistribute: true, //分配规则
          ruleModify: true, //修改规则
          ruleDelete: true //删除规则
        },
        columns : [
          {
            type: "selection",
            width: 60,
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.legalNo"),
            key: "legalNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: JSON.parse(window.sessionStorage.getItem("userInfo")).userType === "1"
          },
          {
            title: this.$t("m.i.ce.ruleCode"),
            key: "ruleCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.ruleName"),
            key: "ruleName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.ruleBean"),
            key: "ruleBean",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.ruleStatus"),
            key: "ruleStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let ruleStatus = params.row.ruleStatus;
              switch (params.row.ruleStatus) {
                case "0":
                  ruleStatus = "失效";
                  break;
                case "1":
                  ruleStatus = "生效";
                  break;
              }
              return h("span", ruleStatus);
            }
          },
          {
            title: this.$t("m.i.ce.ruleValue"),
            key: "ruleValue",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.ruleDesc"),
            key: "ruleDesc",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.flowFuncNo"),
            key: "flowFuncNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.flowFuncName"),
            key: "flowFuncName",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectList : [],
        currentSelectRowInx : [],
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        addForm : {
          id: "",
          legalNo: "",
          ruleCode: "",
          ruleName: "",
          ruleBean: "",
          ruleStatus: "",
          ruleValue: "",
          ruleDesc: "",
          flowFuncNo: "",
          flowFuncName: ""
        },
        //查询法人弹出框
        showLegalPersonWin : false,
        //分配贴现规则弹出框
        allocationFCashRuleWin : false,
        ifShowMore : false,
        //选中贴现规则ID
        ruleIds : "",
      };
    },
    components: {
      AllocationFCashRule:() => import(/* webpackChunkName: "ce/acpt/fastCash/allocationFCashRule" */`@/views/bizViews/ce/acpt/fastCash/allocationFCashRule`),
      LegalPersonSearch:() => import(/* webpackChunkName: "sm/auth/legalperson/legalPersonSearch" */`@/views/bizViews/sm/auth/legalperson/legalPersonSearch`)
    },
    computed: {
      isShow() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        let userType = userInfo.userType;
        if (userType === "1") {
          return true;
        } else {
          this.formItem.legalNo = userInfo.legalNo;
          return false;
        }
      },
    },
    methods: {
      formSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        let userType = userInfo.userType;
        if (userType === "1") {
          this.formItem.legalNo = "";
          this.formItem.legalpersonName = "";
        }
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.$refs.addForm.resetFields();
      },
      //分配贴现规则
      handleRuleDistribute() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if ("000000" !== list[i].legalNo) {
              this.$msgTip.info(this, { info: "非法人[000000]的参数不可分配，请重新选择记录!" });
              return false;
            }
          }
          this.allocationFCashRuleWin = true;
          this.ruleIds = this.$refs.datagrid.selectIds;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //修改秒兑规则
      handleRuleModify() {
        this.isRequired = true;
        let list = this.$refs.datagrid.selects;
        if(list == null || list.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        }else if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return false;
        } else {
          this.$nextTick(() => {

            let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            let userType = userInfo.userType;
            if (userType === "1" && "000000" !== list[0].legalNo) {
              this.$msgTip.info(this, { info: "非法人[000000]的参数不可修改，请重新选择记录!" });
              return false;
            }
            this.addForm.id = list[0].id;
            this.addForm.legalNo = list[0].legalNo;
            this.addForm.ruleCode = list[0].ruleCode;
            this.addForm.ruleName = list[0].ruleName;
            this.addForm.ruleBean = list[0].ruleBean;
            this.addForm.ruleStatus = list[0].ruleStatus;
            this.addForm.ruleValue = list[0].ruleValue;
            this.addForm.ruleDesc = list[0].ruleDesc;
            this.addForm.flowFuncNo = list[0].flowFuncNo;
            this.addForm.flowFuncName = list[0].flowFuncName;
            this.addOrEditWin = true;
          });
        }
      },
      //删除业务参数
      handleComfirm() {
        let list = this.$refs.datagrid.selects;
        if(list == null ||list.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        }
        for (let i = 0; i < list.length; i++) {
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          let userType = userInfo.userType;
          if (userType === "1" && "000000" !== list[i].legalNo) {
            this.$msgTip.info(this, {info: "非法人[000000]的规则不可删除，请重新选择记录!"});
            return false;
          }
        }
          let paramIds = this.$refs.datagrid.selectIds;
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel(paramIds);
            }
          });
      },
      handleDel(paramIds) {
        post({ ids: paramIds }, "/ce/acpt/fastCash/fastCashRule/func_deleteRule").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/ce/acpt/fastCash/fastCashRule/func_updateRule";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      clearVal() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        let userType = userInfo.userType;
        if (userType === "1") {
          this.formItem.legalNo = "";
          this.formItem.legalpersonName = "";
        }
      },
      //查询法人弹出框
      queryLegalPersonName() {
        this.showLegalPersonWin = true;
      },
      legalPersonChange(info) {
        this.formItem.legalNo = info.legalNo;
        this.formItem.legalpersonName = info.legalpersonName;
        this.showLegalPersonWin = false;
      },
      legalPersonWinClose() {
        this.showLegalPersonWin = false;
      },
      allocationFCashRuleWinClose() {
        this.ruleIds = "";
        this.allocationFCashRuleWin = false;
      },
      allocationFCashRuleSubmit() {
        this.ruleIds = [];
        this.allocationFCashRuleWin = false;
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      }
    }
  };
</script>

<style scoped>

</style>
