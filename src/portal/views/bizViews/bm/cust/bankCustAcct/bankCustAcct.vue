<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                  <h-input v-model="formItem.custNo" :maxlength=50></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.custAcctNo')" prop="custAcctNo">
                  <h-input v-model="formItem.custAcctNo" :maxlength=32></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.setActiveFlag')" prop="activeFlag">
                  <h-select v-model="formItem.activeFlag" :clearable="false" :value="1" placeholder="" showTitle>
<!--                            @on-change="activeFlagChange" -->
                    <h-option v-for="item in isOffList" :value="item.value" :key="item.value">{{ item.label }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <show-branch v-model="formItem.busiOwnBrchNo" :label="$t('m.i.common.busiOwnBrch')" prop="busiOwnBrchNo" v-if="isAddBusiOwnBrch == '1'"
                             title="机构名称" url="/sm/auth/branch/queryAllBranchTree" :brchNo.sync="formItem.busiOwnBrchNo" :showCheckBox="false" class="h-form-long-label">
                </show-branch>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
              :columns="columns"
              highlight-row
              url="/bm/cust/bankCustAcct/bankCustAcct/func_queryPageOtherBankAcct"
              :bindForm="formItem"
              :hasSelect="false"
              rowSelect
              :onSelectChange="handleSelectClick"
              ref="datagrid">
            <div slot="toolbar" class="pull-left" v-if="this.isShowToolbar">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetRoleAdd && (this.btnAuth.add === undefined ? true : this.btnAuth.add.isShow)"
                        :disabled="this.isLogOn">{{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleAdd && (this.btnAuth.modify === undefined ? true : this.btnAuth.modify.isShow)"
                        :disabled="this.isLogOff">{{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm('logoff')" v-if="authObj.bizSetRoleDelete && (this.btnAuth.loginOut === undefined ? true : this.btnAuth.loginOut.isShow)"
                        :disabled="this.isLogOff">{{$t("m.i.common.loginOut")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm('logon')" v-if="authObj.bizSetRoleDelete && (this.btnAuth.cacelOut === undefined ? true : this.btnAuth.cacelOut.isShow)"
                        :disabled="this.isLogOffAn">{{$t("m.i.bm.cacelOut")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增他行账号</span>
        <span v-if="type=='modify'">修改他行账号</span>
        <span v-if="type=='view'">查看他行账号</span>
        <span v-if="type=='coll'">同步他行账号</span>
      </p>
      <h-panel>

        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" :required="isRequired">
            <h-input v-if="type=='add'" v-model="addForm.custNo" :placeholder="''" readonly
                     icon="android-search" @on-click="queryCustNo" clearable @on-clear="clearCustNo"></h-input>
            <h-input v-else v-model="addForm.custNo" :placeholder="''" readonly
                     icon="android-search" @on-click="queryCustNo" clearable @on-clear="clearCustNo"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.custName" class="input-boder-0"
                     :title="addForm.custName" readonly></h-input>
            <h-input v-else v-model="addForm.custName" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.custAcctNo')" prop="custAcctNo" :required="isRequired" :validRules="custAcctNoRule">
            <h-input v-if="type=='view'" :value="addForm.custAcctNo" class="input-boder-0"
                     :title="addForm.custAcctNo"></h-input>
            <h-input v-else v-model="addForm.custAcctNo" :maxlength=32 :placeholder="'32位以下字母或数字'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.billInfo.custAcctName')" prop="custAcctName">
            <h-input v-if="type=='view'" :value="addForm.custAcctName" class="input-boder-0"
                     :title="addForm.custAcctName"></h-input>
            <h-input v-else v-model="addForm.custAcctName" :maxlength=80 :lengthByByte="false" ></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custAcctKind')" prop="custAcctKind" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.custAcctKind" class="input-boder-0"
                      :title="addForm.custAcctKind" showTitle>
              <h-option v-for="item in custAcctKindList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.custAcctKind" :maxlength=60 :placeholder="'请选择'" showTitle>
              <h-option v-for="item in custAcctKindList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <!--<h-form-item :label="$t('m.i.common.openBankNo')" prop="openBankNo" :required="isRequired" :validRules="bankNoRule">
            <h-input v-if="type=='view'" :value="addForm.openBankNo" class="input-boder-0"
                     :title="addForm.openBankNo"></h-input>
            <h-input v-else v-model="addForm.openBankNo" :maxlength=12 :placeholder="'12位数字'"  icon="android-search" @on-click="brchCodeWinOpen"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.openBankName')" prop="openBrchName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.openBrchName" class="input-boder-0"
                     :title="addForm.openBrchName"></h-input>
            <h-input v-else v-model="addForm.openBrchName" :maxlength=32 :placeholder="''"></h-input>
          </h-form-item>-->
          <show-cpes-branch :label="$t('m.i.common.openBankName')"
                            :bankNo.sync="addForm.openBankNo" :cpesBrchName.sync="addForm.openBrchName"
                            :filterable="type!=='view'" prop="openBrchName" :isInitValueClearable="true"
                            :required="isRequired" :msgBoxWin="addOrEditWin" :isQueryByBankNo="true"
                            datagridUrl="/cpes/branch/queryBranchList"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item :label="$t('m.i.common.openBankNo')" prop="openBankNo" :required="isRequired" :validRules="bankNoRule">
            <h-input v-if="type=='view'" :value="addForm.openBankNo" class="input-boder-0"
                     :title="addForm.openBankNo" readonly ></h-input>
            <h-input v-else v-model="addForm.openBankNo" :maxlength=12 :placeholder="'12位数字'" readonly ></h-input>
          </h-form-item>



          <show-branch :filterable="type==='add' || type==='modify'" v-model="addForm.createBrchNo" :label="$t('m.i.bm.createBrchNo')" prop="createBrchNo"
                       :required="isRequired" :showCheckBox="false" :msgBoxWin="addOrEditWin" showValue
                       title="机构名称" :brchNo.sync="addForm.createBrchNo" :brchName.sync="addForm.createBrchName">
          </show-branch>

          <h-form-item :label="$t('m.i.common.createBrchName')" prop="createBrchName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.createBrchName" class="input-boder-0"
                     :title="addForm.createBrchName" readonly></h-input>
            <h-input v-else v-model="addForm.createBrchName" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>
          <show-branch v-model="addForm.busiOwnBrchNo" :label="$t('m.i.common.busiOwnBrchNo')" prop="busiOwnBrchNo" :required="isRequired"  v-if="isAddBusiOwnBrch == '1'"
                       :brchNo.sync="addForm.busiOwnBrchNo" :brchName.sync="addForm.busiOwnBrchName" showValue url="/sm/auth/branch/queryAllBranchTree"
                       :showCheckBox="false" :msgBoxWin="addOrEditWin">
          </show-branch>
          <h-form-item :label="$t('m.i.common.busiOwnBrch')" prop="busiOwnBrchName" :required="isRequired"  v-if="isAddBusiOwnBrch == '1'">
            <h-input v-if="type=='view'" :value="addForm.busiOwnBrchName" class="input-boder-0"
                     :title="addForm.busiOwnBrchName" readonly></h-input>
            <h-input v-else v-model="addForm.busiOwnBrchName" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <show-cust-corp :showCustCorpWin="showCustCorpWin" :title="'查看企业客户'" @showCustCorpWinClose="showCustCorpWinClose"
                    @custSelect="custSelect"></show-cust-corp>

    <!--<brch-code-search :brchCodeWin="showBrchWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->
  </div>
</template>

<script>
  import { post, on, off,getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "bankCustAcct",
    components: {
      ShowCustCorp: () => import(/* webpackChunkName: "bm/cust/corp/showCustCorp"*/"@/views/bizViews/bm/cust/corp/showCustCorp.vue"),
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
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
          title: this.$t('m.i.common.custNo'),
          key: "custNo",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.custAcctNo'),
          key: "custAcctNo",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.custAcctName'),
          key: "custAcctName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custAcctKind'),
          key: "custAcctKind",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "custAcctKind", params.row.custAcctKind);
            return h("span", { domProps: { title: dictValue } }, dictValue);
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
          key: "openBrchName",
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
        },
        {
          title: this.$t('m.i.common.operBrchNo'),
          key: "operBrchNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.operBrchName'),
          key: "operBrchName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.busiOwnBrchNo'),
          key: "busiOwnBrchNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.busiOwnBrch'),
          key: "busiOwnBrchName",
          sortable: true,
          hiddenCol: false
        },
      ];
      let formItem = {
        custNo: "",
        activeFlag: "1",
        custAcctKind: "",
        custName: "",
        custAcctNo: "",
        openBankNo: "",
        openDt: null,
        createBrchNo: "",
        busiOwnBrchNo:"",
      };
      let addForm = {
        id: "",
        custId: "",
        legalNo: "",
        custNo: "",
        custName: "",
        activeFlag: "",
        custAcctNo: "",
        custAcctName:"",
        custAcctType: "",
        custAcctKind: "1",
        depositStyle: "",
        bailType: "",
        openBankNo: "",
        openBrchId: "",
        openBrchNo: "",
        openBrchName: "",
        openDt: null,
        createBrchNo: "",
        createBrchName: "",
        operBrchNo: "",
        operBrchName: "",
        operTellerNo: "",
        operTellerName: "",
        transplantFlag: "",
        reserve1: "",
        reserve2: "",
        reserve3: "",
        createTime: "",
        updateTime: "",
        busiOwnBrchNo:"",
        busiOwnBrchName:"",
      };
      //给按钮增加权限
      let authObj = {
        bizSetRoleAdd: true, //角色添加
        bizSetRoleDelete: true, //角色删除
        bizSetRoleORight: true, //角色操作权限
        bizSetRoleARight: true, //角色授权权限
        bizRoleRightSet: true, //角色权限处理
        bizRoleRightCopy: true, //角色权限复制
        bizSetRoleDownload: true //角色信息下载
      };

      function validcustAcctNo(rule, val, callback) {
        let re = /^[a-zA-Z0-9]{1,32}$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，只能输入英文、数字"));
        }
      }

      return {
        isShowToolbar: false,
        btnAuth: {},
        //showBrchWin: false,
        authObj: authObj,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        formItem: formItem,
        addForm: addForm,
        columns: columns,
        branchColumns: columns,
        type: null,
        readonly: false,
        isRequired: true,
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        // 字典相关静态数据
        custAcctTypeList: [],
        custAcctKindList: [],
        isList: [],
        isOffList: [
          { value: "1", label: "否" },
          { value: "0", label: "是" }
        ],
        depositStyleList: [],
        bailTypeList: [],
        // 机构，客户选择界面
        brchCodeWin: false,
        showCustCorpWin: false,
        // 提交结果界面相关
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        custAcctNoRule: [{ test: validcustAcctNo, trigger: "blur" }],
        ifShowMore: false,
        isLogOff: false,
        isLogOn: false,
        isLogOffAn: false,
        dictMap: new Map(),
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "大额行号由12位数字组成" }],
        isAddBusiOwnBrch:"",
      };
    },
    methods: {
      getButtonAuth(){
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
              this.isShowToolbar = true;
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }

        });
      },
      /*brchCodeWinOpen(){
        this.showBrchWin = true;
      },*/
      /*brchCodeWinClose() {
        this.showBrchWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        this.addForm.openBankNo = info.transBrchBankNo;
        this.addForm.openBrchName = info.brchFullNameZh;
        this.showBrchWin = false;
      },*/
      addFormReset() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.id = "";
        });
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          this.addFormReset();
          let list = this.$refs.datagrid.selects;
          if (!list || list.length !== 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          if (this.type == "modify") {
            let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            if (userInfo.brchNo != list[0].operBrchNo) {
              this.$msgTip.info(this, { info: "只有创建机构能进行此操作" });
              return;
            }
          }
          if (this.type == "modify") {
            this.readonly = true;
          }
          if (this.type == "view") {
            this.isRequired = false;
          }
          this.$nextTick(() => {
            this.queryObjById(list[0].id);
          });
        } else {
          this.addFormReset();
        }
        this.addOrEditWin = true;
      },
      queryObjById(id) {
        post({ id: id }, "/bm/cust/bankCustAcct/bankCustAcct/func_getOtherBankAcct").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.custId = res.data.retData.custId;
              this.addForm.custNo = res.data.retData.custNo;
              this.addForm.custName = res.data.retData.custName;
              this.addForm.activeFlag = res.data.retData.activeFlag;
              this.addForm.custAcctNo = res.data.retData.custAcctNo;
              this.addForm.custAcctName = res.data.retData.custAcctName;
              this.addForm.custAcctType = res.data.retData.custAcctType;
              this.addForm.custAcctKind = res.data.retData.custAcctKind;
              this.addForm.depositStyle = res.data.retData.depositStyle;
              this.addForm.bailType = res.data.retData.bailType;
              this.addForm.openBankNo = res.data.retData.openBankNo;
              this.addForm.openBrchId = res.data.retData.openBrchId;
              this.addForm.openBrchNo = res.data.retData.openBrchNo;
              this.addForm.openBrchName = res.data.retData.openBrchName;
              this.addForm.openDt = res.data.retData.openDt;
              this.addForm.createBrchNo = res.data.retData.createBrchNo;
              this.addForm.createBrchName = res.data.retData.createBrchName;
              this.addForm.operBrchNo = res.data.retData.operBrchNo;
              this.addForm.operBrchName = res.data.retData.operBrchName;
              this.addForm.operTellerNo = res.data.retData.operTellerNo;
              this.addForm.operTellerName = res.data.retData.operTellerName;
              this.addForm.transplantFlag = res.data.retData.transplantFlag;
              this.addForm.reserve1 = res.data.retData.reserve1;
              this.addForm.reserve2 = res.data.retData.reserve2;
              this.addForm.reserve3 = res.data.retData.reserve3;
              this.addForm.createTime = res.data.retData.createTime;
              this.addForm.updateTime = res.data.retData.updateTime;
              this.addForm.busiOwnBrchNo = res.data.retData.busiOwnBrchNo;
              this.addForm.busiOwnBrchName = res.data.retData.busiOwnBrchName;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },
      activeFlagChange() {
        if (this.formItem.activeFlag === "1") {
          this.isLogOff = false;
        } else if (this.formItem.activeFlag === "0") {
          this.isLogOff = true;
        }
      },
      handleSelectClick(arr, selectInx) {
        let array = this.$refs.datagrid.selects;
        if (array.length === 0) {
          this.isLogOff = false;
          this.isLogOn = false;
          this.isLogOffAn = false;
          return false;
        }
        let activeFlag = array[0].activeFlag;
        for(let i = 1; i < array.length; i++) {
          if (array[i].activeFlag !== activeFlag) {
            this.isLogOff = true;
            this.isLogOn = true;
            this.isLogOffAn = true;
            return true;
          }
        }
        this.isLogOn = false;
        if (activeFlag === "1") {
          this.isLogOff = false;
          this.isLogOffAn = true;
        } else if (activeFlag === "0") {
          this.isLogOff = true;
          this.isLogOffAn = false;
        }
        return true;
      },
      formSearch() {
        this.isLogOff = false;
        this.isLogOn = false;
        this.isLogOffAn = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type == "add" ? "/bm/cust/bankCustAcct/bankCustAcct/func_saveOtherBankAcct" : "/bm/cust/bankCustAcct/bankCustAcct/func_updateOtherBankAcct";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            this.addForm.legalNo = userInfo.legalNo;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  // this.$hMessage.success(msg)
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  // this.$hMessage.error(this.$t('m.i.common.addFailed')+res.data.retMsg);
                  let msg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                  this.submitFailed(msg, res.data.retMsg);
                }
              } else {
                // this.$hMessage.error(this.$t('m.i.common.netError'))
                let msg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                this.submitFailed(msg, this.$t("m.i.common.netError"));
              }

            });
          }
        });
      },
      handleComfirm(oper) {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          // if (list.length > 1) {
          //   this.$msgTip.info(this,{info:this.$t('m.i.common.onlyChooseOneData')});
          //   return
          // }
          let errorCorp = "";
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          for (let i = 0; i < list.length; i++) {
            if (userInfo.brchNo != list[i].operBrchNo) {
              errorCorp += list[i].custAcctNo + ",";
            }
          }
          if (errorCorp != "") {
            this.$msgTip.info(this, { info: "账户号：" + errorCorp.substring(0, errorCorp.length - 1) + "，只有创建机构能进行此操作" });
            return;
          }
          let content = "";
          let url = "";
          let operType = "";
          url = "/bm/cust/bankCustAcct/bankCustAcct/func_updateOtherBankAcctStatus";
          if (oper == "logoff") {
            content = "注销";
            operType = "1";
          } else if (oper == "logon") {
            content = "撤销注销";
            operType = "2";
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "是否要" + content + "?",
            onOk: () => {
              this.handlelog(url, content, operType);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }

      },
      handlelog(url, content, operType) {
        post({ ids: this.$refs.datagrid.selectIds, operType: operType }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              // this.$hMessage.success(content+'成功')
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              // this.submitMsg = content+'失败';
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryCustNo() {
        this.showCustCorpWin = true;
      },
      clearCustNo(){
        this.addForm.custNo = "";
        this.addForm.custName = "";
        this.addForm.custId = "";
      },
      showCustCorpWinClose() {
        this.showCustCorpWin = false;
      },
      custSelect(info) {
        this.addForm.custNo = info.custNo;
        this.addForm.custName = info.custName;
        this.addForm.custId = info.id;
        this.showCustCorpWin = false;
      },
      submitFailed(title, retMsg) {
        this.$msgTip.error(this, { info: retMsg });
      }
    },
    mounted() {
      this.getButtonAuth();
      this.getDictListByGroups("bailType,depositStyle,custAcctKind,custAcctType,Yon").then(res => {
        this.bailTypeList = res.get("bailType");
        this.depositStyleList = res.get("depositStyle");
        this.custAcctKindList = res.get("custAcctKind");
        this.custAcctTypeList = res.get("custAcctType");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      getSingleParamValuesByKeys("pc.is_marketing_bank_mode").then(res => {
        let isMarketingBankMode = res["pc.is_marketing_bank_mode"];
        if(isMarketingBankMode === '1'){
          this.$refs.datagrid.controlColumnsHidden("busiOwnBrchNo", false);
          this.$refs.datagrid.controlColumnsHidden("busiOwnBrchName", false);
          this.addForm.busiOwnBrchNo = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
          this.addForm.busiOwnBrchName = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
        } else {
          this.$refs.datagrid.controlColumnsHidden("busiOwnBrchNo", true);
          this.$refs.datagrid.controlColumnsHidden("busiOwnBrchName", true);
        }
        this.isAddBusiOwnBrch = isMarketingBankMode;
      });
    },
    created(){
      this.getButtonAuth();
    }
  };
</script>

<style scoped>

</style>
