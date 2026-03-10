<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.brchName')" prop="branchName">
                  <h-input v-model="formItem.brchCode" v-show="false"></h-input>
                  <h-input v-model="formItem.branchName" placeholder="" readonly :title="formItem.branchName"
                           icon="android-search" @on-click="queryCpesBrchCode()"></h-input>
                </h-form-item>-->

<!--                <show-cpes-branch v-model="formItem.brchCode" :label="$t('m.i.common.brchName')"-->
<!--                                  :brchCode.sync="formItem.brchCode"  :cpesBrchName.sync="formItem.branchName"-->
<!--                                  datagridUrl="/shcpe/cpes/branch/agencyInformation/func_queryBranchs"-->
<!--                                  queryUrl="/shcpe/cpes/branch/agencyInformation/func_queryBranchs"></show-cpes-branch>-->

                <h-form-item label="资金账户账号" prop="cpesAcctNo">
                  <h-input v-model="formItem.cpesAcctNo" placeholder="" :maxlength="32"></h-input>
                </h-form-item>
                <h-form-item label="账户状态" prop="accountStatus">
                  <h-select v-model="formItem.accountStatus" placeholder="">
                    <h-option value="STT000">正常</h-option>
                    <h-option value="STT001">冻结</h-option>
                    <h-option value="STT002">部分冻结</h-option>
                    <h-option value="STT003">只收不付冻结</h-option>
                    <h-option value="STT009">销户</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            url="/fundCust/fundCustInfo/queryFundAcctInfo"
            :bindForm="formItem"
            :hasSelect="false" rowSelect
            :notSetWidth="true"
            :auto-load="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('apl')" v-if="authObj.bizSetRoleAdd">{{$t("m.i.shcpe.appl")}}</h-button>
              <h-button type="primary" @click="synCpesAcctNo()">{{$t("m.i.common.synch")}}</h-button>
              <h-button type="primary" @click="handleBankTypeForm()">{{$t("m.i.shcpe.outCash")}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-table-layer" :maximize="true"  @on-close="handleClose">
      <p slot="header">
        <span v-if="type=='apl'">申请</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" class="h-form-search">
          <h-form-item :label="'资金账户账号'" prop="cpesAcctNo" :required="isRequired" :validRules="socCodeRule">
            <h-input v-if="type=='view'" :value="addForm.cpesAcctNo" class="input-boder-0" style="width: 50%"
                     :title="addForm.cpesAcctNo" :maxlength="32" :label-width="65"></h-input>
            <h-input v-else v-model="addForm.cpesAcctNo" style="width: 61%" :maxlength="32"></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" style="margin:0 8px" @click="addOrEditWinClose()">{{$t("m.i.common.close")}}
        </h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <h-msg-box v-model="bankTypeWin" width="800" class="h-form-table-layer" @on-close="closeBankTypeWin"
               :maximize="true">
      <p slot="header">
        <span>出金</span>
      </p>
      <h-panel>
        <h-form :model="bankTypeForm" :label-width="115" ref="bankTypeForm" cols="2" class="h-form-search">
          <h-form-item :label="'收款人账号'" prop="pyeeAcctNo" :required="isRequired" :validRules="socCodeRule">
            <h-input v-if="type=='view'" :value="bankTypeForm.pyeeAcctNo" class="input-boder-0"
                     :title="bankTypeForm.pyeeAcctNo"></h-input>
            <h-input v-else v-model="bankTypeForm.pyeeAcctNo" :maxlength=32></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.acctName')" prop="pyeeAcctName" :required="isRequired">
            <h-input v-if="type=='view'" :value="bankTypeForm.pyeeAcctName" class="input-boder-0"
                     :title="bankTypeForm.pyeeAcctName"></h-input>
            <h-input v-else v-model="bankTypeForm.pyeeAcctName" :maxlength=150></h-input>
          </h-form-item>
          <h-form-item :label="'开户行行号'" prop="pyeeBankNo" :required="isRequired" :validRules="bankNoRule">
            <h-input v-if="type=='view'" :value="bankTypeForm.pyeeBankNo" class="input-boder-0"
                     :title="bankTypeForm.pyeeBankNo"></h-input>
            <h-input v-else v-model="bankTypeForm.pyeeBankNo" :maxlength=12></h-input>
          </h-form-item>
          <h-form-item :label="'开户行行名'" prop="pyeeBankName" :required="isRequired">
            <h-input v-if="type=='view'" :value="bankTypeForm.pyeeBankName" class="input-boder-0"
                     :title="bankTypeForm.pyeeBankName"></h-input>
            <h-input v-else v-model="bankTypeForm.pyeeBankName" :maxlength=150></h-input>
          </h-form-item>
          <h-form-item :label="'金额（元）'" prop="amount" :required="isRequired">
            <h-typefield v-model="bankTypeForm.amount" integerNum="16"
                         suffixNum="2" placeholder="最多16位整数,2位小数"></h-typefield>
          </h-form-item>
          <h-form-item :label="'资金账户账号'" prop="cpesAcctNo" :required="isRequired" readonly>
            <h-input v-model="bankTypeForm.cpesAcctNo"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closeBankTypeWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="bankTypeSubmitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <h-msg-box v-model="submitWin" width="300" height="180">
      <p slot="header">
        <span>{{submitTitle}}</span>
      </p>
      <div class="h-prompt-content">
        <div class="h-prompt-top">
          <i v-if="retMsg == ''" class="icon iconfont icon-right"></i>
          <!--<i v-else class="icon iconfont icon-remind"></i>-->
          <i v-else class="icon iconfont icon-wrong"></i>
          <span>{{submitMsg}}</span>
        </div>
        <p class="h-prompt-words">{{retMsg}}</p>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="submitWin = false">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitWin = false">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 票交机构弹出框 -->
   <!-- <brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange"></brch-code-search>-->
  </div>

</template>

<script>
  import { post, on, off ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "fundAcctInfo",
    components: {
      ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
    },
    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 60,
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
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            sortable: true,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.common.brchCode'),
            key: "brchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.cpesAcctNo'),
            key: "cpesAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.fundAcctName'),
            key: "fundAcctName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.balanceAmt'),
            key: "balanceAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let balanceAmt = formatNumber(params.row.balanceAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: balanceAmt
                }
              }, balanceAmt);
            }
          },
          {
            title: this.$t('m.i.shcpe.acctAvailableAmt'),
            key: "acctAvailableAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let acctAvailableAmt = formatNumber(params.row.acctAvailableAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: acctAvailableAmt
                }
              }, acctAvailableAmt);
            }
          },
          {
            title: this.$t('m.i.shcpe.accountStatus'),
            key: "accountStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctStatus", params.row.accountStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        formItem: {
          brchCode:"",
          bankNo: "",
          brchNos: "",
          accountStatus: "",
          cpesAcctNo: "",
          branchName: ""
        },
        addForm: {
          id: "",
          legalNo: "",
          memberId: "",
          brchCode: "",
          cpesAcctNo: "",
          fundAcctName: "",
          balanceAmt: "",
          acctAvailableAmt: "",
          accountStatus: "",
          acctOperMark: "",
          pyeeAcctNo: "",
          pyeeAcctName: "",
          pyeeBankNo: "",
          pyeeBankName: "",
          amount: "",
          branchCode : "",
          aplBranchCode : ""
        },
        bankTypeForm: {
          id: "",
          legalNo: "",
          memberId: "",
          brchCode: "",
          cpesAcctNo: "",
          fundAcctName: "",
          balanceAmt: "",
          acctAvailableAmt: "",
          accountStatus: "",
          acctOperMark: "",
          pyeeAcctNo: "",
          pyeeAcctName: "",
          pyeeBankNo: "",
          pyeeBankName: "",
          amount: "",
          branchCode : "",
          aplBranchCode : ""
        },
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },

        // 是否显示新增或修改窗口
        addOrEditWin: false,
        type: null,
        readonly: false,
        isRequired: true,
        tableRef: "selfTable",
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        //brchCodeWin: false,
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
        showBranchWin: false,
        currentSelectRow: [],
        socCodeRule: [{ test: /^[0-9A-Za-z]{0,32}$/, trigger: "blur", message: "资金账户由32位数字或大小写字母组成" }],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "行号由12位数字组成" }],
        bankTypeWin: false,
        submitBankTypeFlag: false
      };
    },
    watch: {},

    computed: {},
    methods: {
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      //票交机构弹出框
      /*queryCpesBrchCode() {
        this.brchCodeWin = true;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if(info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.brchCode = info.brchCode;
        this.formItem.branchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },*/
      //关闭查询票交机构窗口
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addForm.schemeId = "";
        this.addForm.schemeName = "";
        this.addForm.cpesAcctNo = "";
        this.addOrEditWin = true;
      },

      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.brchCode = "";
        this.formItem.branchName = "";
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addForm.resetFields();
      },
      addOrEditWinClose(){
        this.addForm.cpesAcctNo = "",
        this.addForm.fundAcctName = "",
        this.$refs.addForm.resetFields();
        this.addOrEditWin=false;
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = "/fundCust/fundCustInfo/fundAcctInfo/func_fundFundAcctAppl";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            this.submitMsg = msg;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  // this.$hMessage.success(msg)
                  this.$msgTip.success(this, msg);
                  this.$refs.addForm.resetFields();
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.retMsg = "";
                } else {
                  // this.$hMessage.error(this.$t('m.i.common.addFailed')+res.data.info);
                  this.$refs.datagrid.dataChange(pageNo);
                  this.submitMsg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                  this.retMsg = res.data.retMsg;
                  this.submitWin = true;
                }
              } else {
                // this.$hMessage.error(this.$t('m.i.common.netError'))
                this.submitMsg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                this.retMsg = this.$t("m.i.common.netError");
                this.submitWin = true;
              }

            });
          }
        });

      },
      closeBankTypeWin() {
        this.bankTypeForm.pyeeAcctNo = "",
        this.bankTypeForm.pyeeAcctName = "",
        this.bankTypeForm.pyeeBankNo = "",
        this.bankTypeForm.pyeeBankName = "",
        this.bankTypeForm.amount = "";
        this.$refs.bankTypeForm.resetFields();
        this.bankTypeWin = false;
      },
      bankTypeSubmitForm() {
        this.$refs["bankTypeForm"].validate(valid => {
          if (valid) {
            this.submitBankLevelFlag = true;
            let url = "/fundCust/fundCustInfo/fundAcctInfo/func_queryFundAcctOutAppl";
            let msg = this.$t("m.i.common.modifySuccess");
            post(this.bankTypeForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  // this.$hMessage.success(msg)
                  this.$msgTip.success(this, { info: msg });
                  this.bankTypeWin = false;
                  this.$refs.bankTypeForm.resetFields();
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.retMsg = "";
                  this.bankTypeForm.pyeeAcctNo = "",
                  this.bankTypeForm.pyeeAcctName = "",
                  this.bankTypeForm.pyeeBankNo = "",
                  this.bankTypeForm.pyeeBankName = "",
                  this.bankTypeForm.amount = "";
                } else {
                  // this.$hMessage.error(this.$t('m.i.common.addFailed')+res.data.info);
                  this.$refs.datagrid.dataChange(1);
                  this.submitMsg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                  this.retMsg = res.data.retMsg;
                  this.submitWin = true;
                }
              } else {
                // this.$hMessage.error(this.$t('m.i.common.netError'))
                this.submitMsg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                this.retMsg = this.$t("m.i.common.netError");
                this.submitWin = true;
              }

            });
          }
        });

      },
      handleComfirm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          //this.delConfirm=true;
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }

      },
      synCpesAcctNo() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: "同步",
            content: "确定要同步吗？",
            onOk: () => {
              let cpesAcctNos = [];
              for (let i = 0; i < list.length; i++) {
                cpesAcctNos.push(list[i].cpesAcctNo);
              }
              post({
                cpesAcctNos: cpesAcctNos,
              }, "/fundCust/fundCustInfo/fundAcctInfo/func_fundFundAcctAppl").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this, { info: this.$t("m.i.shcpe.syncSuccess") });
                    this.$refs.datagrid.dataChange(1);
                    this.$refs.datagrid.selectIds = [];
                    this.$refs.datagrid.selects = [];
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },
      handleBankTypeForm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length == 1) {
          this.bankTypeForm.cpesAcctNo = list[0].cpesAcctNo;
          this.bankTypeForm.aplBranchCode = list[0].brchCode;
          this.addForm.cpesAcctNo = list[0].cpesAcctNo;
          this.bankTypeWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },
      handledel() {
        let list = this.$refs.datagrid.selects;
        let delId = this.$refs.datagrid.selects[0].id;
        post({ id: delId }, "/pc/fundAcctInfo/delete.json").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.info(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.retMsg = "";
            } else {
              // this.$hMessage.error(this.$t('m.i.common.deleteFailed')+res.data.retMsg)
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = this.$t("m.i.common.deleteFailed");
              this.retMsg = res.data.retMsg;
              this.submitWin = true;
            }
          } else {
            // this.$hMessage.error(this.$t('m.i.common.netError'))
            this.retMsg = this.$t("m.i.common.netError");
            this.submitWin = true;
          }
        });
      }

    },
    mounted() {
      this.getDictListByGroups("AcctStatus").then(res => {
        this.dictMap = res.get("map");
        this.$nextTick(() => {
          this.formSearch();
        });
      });
    }

  };
</script>

<style scoped>

</style>
