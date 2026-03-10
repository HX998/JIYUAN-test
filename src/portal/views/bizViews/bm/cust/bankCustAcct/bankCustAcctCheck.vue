<!--账号信息复核-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.brchName')" prop="openBrchName">
                  <h-input v-model="formItem.openBrchName" readonly :maxlength="60"
                           icon="android-search" @on-click="queryRcvBrchName()" clearable @on-clear="clearRcvBrchName"></h-input>
                </h-form-item>-->
                <show-cpes-branch v-model="formItem.openBrchCode" :label="$t('m.i.common.brchName')"
                                  :brchCode.sync="formItem.openBrchCode"  :cpesBrchName.sync="formItem.openBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="openBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.bm.isOtherBank')" prop="isOtherBank">
                  <h-select v-model="formItem.isOtherBank" placeholder="">
                    <h-option value="1">他行账号</h-option>
                    <h-option value="0">本行账号</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.bailAcctType')" prop="bailAcctType">
                  <h-select v-model="formItem.bailAcctType" placeholder="">
                    <h-option v-for="item in custAcctKindList" :value="item.key" :key="item.key">{{item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctNo')" prop="acctNo">
                  <h-input v-model="formItem.acctNo" :maxlength="32"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctName')" prop="acctName">
                  <h-input v-model="formItem.acctName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.openBankNo')" prop="openBankNo">
                  <h-input v-model="formItem.openBankNo" :maxlength="12"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.openBankName')" prop="openBankName">
                  <h-input v-model="formItem.openBankName"></h-input>
                </h-form-item>
                <h-form-item prop="openBrchCode" v-show="false">
                  <h-input v-model="formItem.openBrchCode"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch('1')">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
              :columns="checkColumns"
              :rowSelect=true
              :hasSelect=false
              url="/bm/cust/bankcustacct/pageQueryBankCustAcctListfh"
              :bindForm="formItem"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="auditPass()">{{$t("m.i.common.recheckPass")}}</h-button>
              <h-button type="primary" @click="auditRefuse()">{{$t("m.i.common.recheckRefuse")}}</h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="refuseReasonWin" width="800" class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span>退回原因录入</span>
      </p>
      <h-panel>
        <h-form :model="refuseForm" :label-width="115" ref="refuseForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.common.returnReason')" prop="returnReason" :required="isRequired">
            <h-input v-model="refuseForm.returnReason" :maxlength="60"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="close()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--<cpes-brch-code-search :brchCodeWin="showCpesBranchWin" @brchCodeWinClose="brchCodeWinClose"
                           @brchCodeChange="brchCodeChange" optType="2"></cpes-brch-code-search>-->
  </div>
</template>

<script>
  import {  on, off, bempConfirm } from "@/api/bizApi/commonUtil";

  export default {
    name: "bankCustAcctCheck",
    components: {
      //CpesBrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch"*/"@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch")
    },
    data() {
      let columns = [
        {
          type: "selection",
          key: "duoxuan",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          key: "xuhao",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchCode'),
          key: "openBrchCode",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "openBrchName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.isOtherBank'),
          key: "isOtherBank",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getIsOtherBank(params.row.isOtherBank));
          }
        },
        {
          title: this.$t('m.i.common.acctNo'),
          key: "acctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.acctName'),
          key: "acctName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.flowStatus'),
          key: "flowStatus",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CustFlowStatus", params.row.flowStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankName'),
          key: "openBankName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bailAcctType'),
          key: "bailAcctType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "custAcctKind", params.row.bailAcctType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.acctFuncNo'),
          key: "acctFuncNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchNo'),
          key: "createBrchNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchName'),
          key: "createBrchName",
          ellipsis: false,
          hiddenCol: false
        }
      ];
      let checkColumns = [
        {
          type: "selection",
          key: "duoxuan",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          key: "xuhao",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchCode'),
          key: "openBrchCode",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "openBrchName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.isOtherBank'),
          key: "isOtherBank",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getIsOtherBank(params.row.isOtherBank));
          }
        },
        {
          title: this.$t('m.i.common.acctNo'),
          key: "acctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.acctName'),
          key: "acctName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankName'),
          key: "openBankName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bailAcctType'),
          key: "bailAcctType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "custAcctKind", params.row.bailAcctType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.acctFuncNo'),
          key: "acctFuncNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchNo'),
          key: "createBrchNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchName'),
          key: "createBrchName",
          ellipsis: false,
          hiddenCol: false
        }
      ];
      //账号信息查询表单
      let queryFormItem = {
        openBrchNo: "",
        openBrchCode: "",
        openBrchName: "",
        isOtherBank: "",
        bailAcctType: "",
        acctNo: "",
        acctName: "",
        openBankNo: "",
        openBankName: "",
        flowStatus: ""
      };
      //账号信息维护查询表单
      let formItem = {
        openBrchNo: "",
        openBrchCode: "",
        openBrchName: "",
        isOtherBank: "",
        bailAcctType: "",
        acctNo: "",
        acctName: "",
        openBankNo: "",
        openBankName: ""
      };
      //新增/修改表单
      let addForm = {
        openBrchNo: "",
        openBrchCode: "",
        openBrchName: "",
        acctNo: "",
        acctName: "",
        isOtherBank: "",
        openBranchName: "",
        openBankNo: "",
        openBankName: "",
        bailAcctType: "",
        accountType: "",
        acctFuncNo: ""
      };
      let refuseForm = {
        returnReason: ""
      };
      //给按钮增加权限
      let authObj = {
        bizSetAdd: true, //添加
        bizSetModify: true, //修改
        bizSetDelect: true, //删除
        bizSetSubmit: true, //提交
        bizSetCheck: true, //录入复核
        bizSetRefuse: true, //复核拒绝
        bizSetRecallCheck: false, //撤销复核
        bizSetConfirmCheck: true, //复核确认
        bizSetRefuseCheck: true, //复核确认拒绝
        bizSetRecallConfirmCheck: false //撤销确认
      };

      function getIsOtherBank(value) {
        if (value != null && value !== "") {
          switch (value) {
            case '1':return '他行账号';
            case '0':return '本行账号';
          }
        } else {
          return "";
        }
      }

      return {
        authObj: authObj,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        queryFormItem: queryFormItem,
        formItem: formItem,
        addForm: addForm,
        refuseForm: refuseForm,
        columns: columns,
        checkColumns: checkColumns,
        type: null,
        deletDisabled: false,
        submitFlag: false,
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
        flowStatusList: [],
        custAcctKindList: [],
        openBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "行号由12位数字组成" }],
        acctNoRule: [{ test: /^[0-9]{1,32}$/, trigger: "blur", message: "账号由不超过32位的数字组成" }],
        isRequired: true,
        //showCpesBranchWin: false,
        brchType: "",
        brchNoWin: false,
        isShowOpenBrch: true,
        dictMap: null,
        refuseReasonWin: false
      };
    },
    methods: {
      formSearch() {
        this.selectReset();
        this.$refs.datagrid.dataChange(1);
      },
      selectReset() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //查复机构名称
      /*queryRcvBrchName() {
        this.showCpesBranchWin = true;
      },*/
      /*clearRcvBrchName(){
        this.formItem.openBrchNo = "";
        this.formItem.openBrchCode = "";
        this.formItem.openBrchName = "";
      },*/
      /*brchCodeWinClose() {
        this.showCpesBranchWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        this.formItem.openBrchNo = info.brchNo;
        this.formItem.openBrchCode = info.brchCode;
        this.formItem.openBrchName = info.brchFullNameZh;
        this.showCpesBranchWin = false;
      },*/
      auditPass() {
        let list = this.$refs.datagrid.selectIds;
        if (list == null || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let options = {
          title: this.$t("m.i.common.confirm"),
          content: "确认要通过复核吗？"
        };
        bempConfirm(this, "/bm/cust/bankcustacct/submitBankCustAcct", { ids: list }, options, this.$refs.datagrid.selects);
        // this.selectReset();
      },

      submitForm() {
        this.$refs["refuseForm"].validate(valid => {
          if (valid) {
            let list = this.$refs.datagrid.selectIds;
            let options = {
              title: this.$t("m.i.common.confirm"),
              content: "确认要拒绝吗？"
            };
            bempConfirm(this, "/bm/cust/bankcustacct/refuseBankCustAcct", {
              ids: list,
              returnReason: this.refuseForm.returnReason
            }, options, this.$refs.datagrid.selects);
            // this.selectReset();
            this.refuseReasonWin = false;
            this.refuseForm.returnReason = "";
          }
        });
      },

      close() {
        this.refuseReasonWin = false;
        this.refuseForm.returnReason = "";
      },

      auditRefuse() {
        let list = this.$refs.datagrid.selectIds;
        if (list == null || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        this.refuseReasonWin = true;
      },
    },
    mounted() {
      this.getDictListByGroups("CustFlowStatus,custAcctKind").then(res => {
        this.custAcctKindList = res.get("custAcctKind");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
