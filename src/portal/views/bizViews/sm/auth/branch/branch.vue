<!--机构管理-->
<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 4}">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--左侧树-->
      <h-col :span="spanLeft" class="layout-menu-left">
        <div>
          <div class="h-tree-search h-sidebar-menutree">
            <div class="h-sidebar-menutree-header">
              <h-button type="primary" @click="handleExpandTree(branchList)" :disabled="isExpandDisabled">
                {{$t("m.i.common.expand")}}
              </h-button>
              <h-button type="primary" @click="handleUnExpandTree(branchList)" :disabled="isNotExpandDisabled">
                {{$t("m.i.common.noExpand")}}
              </h-button>
            </div>
            <div class="h-sidebar-menutree-body">
              <h-tree :data="branchList" :show-checkbox="false" @on-select-change="orgSelectChange"
                      :style="{height: mBarHeight-153 + 'px',overflow: 'auto'}" ref="branchTree"
                      @on-toggle-expand="toggleExpand"></h-tree>
            </div>
          </div>
        </div>
      </h-col>
      <!--右侧数据展示表格-->
      <h-col :span="spanRight" class="layout-menu-right">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
                  <h-input v-model="formItem.brchName" :maxlength="60" :title="formItem.brchName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo">
                  <h-input v-model="formItemBrchNo" :maxlength="10"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.cpesBrchCode')" prop="cpesBrchCode">
                  <h-input v-model="formItem.cpesBrchCode" :maxlength="9"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch('1')">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" highlight-row url="/sm/auth/branch/branch/func_querySubBranchAndSelf"
                      :bindForm="formItem" :onSelectChange="handleSelectClick"
                      :onCurrentChange="handleCurrentChange" :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.branchAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.branchModify">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('synch')" v-if="this.btnAuth.synch === undefined ? true : this.btnAuth.synch.isShow">
                {{$t("m.i.common.synch")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm" v-if="authObj.branchDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="roleDistribute()" v-if="authObj.roleDistributeAuth">
                {{$t("m.i.auth.roleDistribute")}}
              </h-button>
              <h-button type="primary" @click="showBranchMenu()" v-if="authObj.showBranchMenuAuth">
                {{$t("m.i.auth.showBranchMenu")}}
              </h-button>
              <h-button type="primary" @click="productDistribution()" v-if="authObj.productDistAuth">
                {{$t("m.i.auth.productDistribution")}}
              </h-button>
              <h-button type="primary" @click="batchCopyProduct()" v-if="authObj.batchCopyProd">
                {{$t("m.i.auth.batchCopyProduct")}}
              </h-button>
              <h-button type="primary" @click="brchLogDetail()" v-if="authObj.brchLogDetailAuth">
                {{$t("m.i.auth.brchLogDetail")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer"
               :maximize="true">
      <p slot="header">
        <span v-if="type==='add'">新增机构</span>
        <span v-if="type==='modify'">修改机构</span>
        <span v-if="type==='synch'">同步机构</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName" :required="isRequired" >
            <h-input v-model="addForm.brchName" :maxlength="60" placeholder="机构名称不可重复" @on-blur="synBrchName()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo" :required="isRequired" :validRules="brchNoRule">
            <div v-if="type!=='synch'">
              <h-input v-if="type==='modify'" :value="addForm.brchNo" readonly :maxlength="10"
                       placeholder="机构号不可重复，不超过10位数字或字母"></h-input>
              <h-input v-else v-model="addForm.brchNo" :maxlength="10" placeholder="机构号不可重复，不超过10位数字或字母"></h-input>
            </div>
            <h-row v-if="type==='synch'">
              <h-col span="17">
                <h-input v-model="addForm.brchNo" :maxlength="10"></h-input>
              </h-col>
              <h-col span="5" offset="1">
                <h-button type="primary" @click="syncBrch()">{{$t("m.i.common.synch")}}</h-button>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchAddr')" prop="brchAddr" :required="isRequired">
            <h-input v-model="addForm.brchAddr" :maxlength="80"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.cashorgid')" prop="cashorgid" :validRules="cashorgidRule">
            <h-input v-model="addForm.cashorgid" :maxlength="10" placeholder="不超过10位数字或字母"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.bankNo')" prop="bankNo" :validRules="bankNoRule" >
            <h-input v-model="addForm.bankNo" :maxlength="12" placeholder="12位数字" @on-blur="synBankNo()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.orgCode')" prop="orgCode" :required="isRequired"
                       :validRules="orgCodeRule">
            <h-input v-model="addForm.orgCode" :maxlength="10" @on-blur="synOrgCode()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.virtualTellerNo')" prop="virtualTellerNo"
                       :validRules="virtualTellerNoRule">
            <h-input v-model="addForm.virtualTellerNo" :maxlength="20" placeholder="不超过20位数字或字母"></h-input>
          </h-form-item>
          <show-branch :filterable="type==='modify' && this.isShowEditParentBrch && this.currentSelectRow.parentBrchNo !== '0000'"
                       v-model="addForm.parentBrchName" :label="$t('m.i.common.parentBrchName')" prop="parentBrchName" required
                       title="机构名称" :brchNo.sync="addForm.parentBrchNo" :brchName.sync="addForm.parentBrchName" :showCheckBox="false" :msgBoxWin="addOrEditWin">
          </show-branch>

          <show-cpes-branch v-model="addForm.cpesBrchCode" :label="$t('m.i.common.cpesBrchCode')" prop="cpesBrchCode"
                            :brchCode.sync="addForm.cpesBrchCode"  :cpesBrchName.sync="addForm.cpesBrchName" showValue
                            datagridUrl="/cpes/branch/queryBranchList"
                            queryUrl="/cpes/branch/queryBranchList" :msgBoxWin="addOrEditWin"></show-cpes-branch>
          <h-form-item :label="$t('m.i.common.cpesBrchName')" prop="cpesBrchName">
            <h-input  v-model="addForm.cpesBrchName"  readonly :maxlength="125"></h-input>
          </h-form-item>
        <!-- <h-form-item :label="$t('m.i.common.cpesBrchCode')" prop="cpesBrchCode">
           <h-input v-model="addForm.cpesBrchCode" readonly  :maxlength="9"></h-input>
         </h-form-item>-->

          <show-ecds-branch v-model="addForm.ecdsBankNo" :label="$t('m.i.common.ecdsBankNo')" prop="ecdsBankNo" :validRules="bankNoRule" :required="isRequiredEcdsInputText"
                            title="机构名称" :ecdsBankNo.sync="addForm.ecdsBankNo"
                            showValue :isBankNoRequire="true"
                            @brchNoChange="brchNoChange2" :showCheckBox="false"  :msgBoxWin="addOrEditWin" :isInitValueRequired="isRequiredEcdsInputText">
          </show-ecds-branch>
          <h-form-item :label="$t('m.i.common.ecdsBankName')" prop="ecdsBankName"  :required="isRequiredEcdsInputText">
            <h-input v-model="addForm.ecdsBankName" readonly :maxlength="125"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.ecdsOrgCode')" prop="ecdsOrgCode"  :required="isRequiredEcdsInputText" class="h-form-long-label">
            <h-input v-model="addForm.ecdsOrgCode"  readonly :maxlength="10" ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.reserve3')" prop="reserve3" >
            <h-input v-model="addForm.reserve3" :maxlength="80"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.reserve4')" prop="reserve4" :required="isRequired">
            <h-input v-model="addForm.reserve4" :maxlength="80"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.reserve5')" prop="reserve5" :required="isRequired">
            <h-input v-model="addForm.reserve5" :maxlength="100"></h-input>
          </h-form-item>
          <!--<h-form-item v-if="type==='modify'" :label="$t('m.i.auth.defaultTraderName')" prop="defaultTraderName">
            <h-input v-show="false" :value="addForm.defaultTraderNo" readonly
                     :placeholder="$t('m.i.auth.defaultTraderNo')"></h-input>
            <h-input :value="addForm.defaultTraderName" readonly
                     :placeholder="$t('m.i.auth.defaultTraderName')"
                     icon="android-search" @on-click="queryTraderName(addForm.brchNo)"></h-input>
          </h-form-item>-->
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <!--票交机构弹出框-->
    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange"></brch-code-search>-->
    <!-- TODO 交易柜员弹出框- -->
    <!--<user-trader-search :userTraderWin="brchUserTraderWin" :brchNo="brchNo" @userTraderWinClose="userTraderWinClose"
                        @userTraderChange="userTraderChange"></user-trader-search>-->
    <!--角色分配-->
    <role-distribute :roleDistributeWin="brchRoleDistributeWin" :brchNo="brchNo" roleType="1"
                     @roleDistributeWinClose="roleDistributeWinClose"
                     @roleDistributeSubmit="roleDistributeSubmit" title="角色分配"></role-distribute>
    <!--查看菜单-->
    <show-branch-menu :showBranchMenuWin="showBranchMenuWin" :brchNo="brchNo" roleType="1"
                      @showBranchMenuWinClose="showBranchMenuWinClose"
                      title="查看菜单"></show-branch-menu>
    <!--产品分配-->
    <product-distribute :productDistributeWin="productDistributeWin" :brchNo="brchNo" :optType="2" title="产品分配"
                        @productDistributeWinClose="productDistributeWinClose"
                        @productDistributionSubmit="productDistributeSubmit"></product-distribute>
    <!-- 批量复制授权产品 -->
    <h-msg-box v-model="brchCopyProdWin" :mask-closable="false" width="400" class="h-form-search-layer" :maximize="true"
               @on-close="brchCopyProdWinClose">
      <p slot="header">
        <span>批量复制授权产品</span>
      </p>
      <div>
        <h-form :model="copyProdForm" :label-width="115" ref="copyProdForm" cols="1" class="h-form-search">
          <show-branch v-model="copyProdForm.targetBrchNo" :label="$t('m.i.auth.targetBrchNo')" prop="targetBrchNo" showValue
                       title="机构名称" :brchNo.sync="copyProdForm.targetBrchNo" :brchName.sync="copyProdForm.targetBrchName">
          </show-branch>
          <h-form-item :label="$t('m.i.auth.targetBrchName')" prop="targetBrchName" required>
            <h-input v-model="copyProdForm.targetBrchName" readonly></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="brchCopyProdWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="copyProdSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--机构历史查询-->
    <brch-log-detail :brchLogDetailWin="brchLogDetailWin" title="机构历史查询" :detailFormItem="detailFormItem"
                     :dictMap="dictMap"
                     @brchLogDetailWinClose="brchLogDetailWinClose"></brch-log-detail>
  </div>
</template>
<script>
  import { post, on, off ,getConnectMode} from "@/api/bizApi/commonUtil";

  export default {
    name: "branch",
    data() {
      return {
        branchList: [],
        //机构树收缩是否可用
        isDisabled: false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
        //optType:0-查询当前及下属机构，1-只查询当前机构
        formItem: {
          brchName: "",
          brchNo: "",
          cpesBrchCode: "",
          optType: "0"
        },
        formItemBrchNo: "",
        brchNo: "",
        mBarHeight: 0,
        spanLeft: 4,
        spanRight: 20,
        //按钮权限
        btnAuth:"",
        //给按钮增加权限
        authObj: {
          branchAdd: true, //新增机构
          branchModify: true, //修改机构
          branchDelete: true, //删除机构
          roleDistributeAuth: true,//角色分配
          showBranchMenuAuth: true,  //查看机构菜单
          productDistAuth: true,  //产品授权
          batchCopyProd: true,      //批量复制授权产品
          brchLogDetailAuth: true,  //机构操作详情
          branchSynch: true    //同步机构
        },
        dictMap: new Map(),
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: "系统内" + this.$t("m.i.common.brchNo"),
            key: "brchNo",
            hiddenCol: false,
            sortable: true,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.parentBrchNo"),
            key: "parentBrchNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.auth.brchLevel"),
            key: "brchLevel",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BranchLevel", params.row.brchLevel);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.bankNo"),
            key: "bankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.cpesBrchCode"),
            key: "cpesBrchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.orgCode"),
            key: "orgCode",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.auth.virtualTellerNo"),
            key: "virtualTellerNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.auth.defaultTraderName"),
            key: "defaultTraderName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchAddr"),
            key: "brchAddr",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: [],
        type: null,
        isRequired: true,
        addOrEditWin: false,
        submitFlag: false,
        addForm: {
          id: "",
          brchName: "",
          brchNo: "",
          cashorgid: "",
          brchAddr: "",
          bankNo: "",
          orgCode: "",
          virtualTellerNo: "",
          parentBrchNo: "",
          parentBrchName: "",
          cpesBrchCode: "",
          cpesBrchName: "",
          ownershipBrchNo: "",
          ownershipBrchName: "",
          defaultTraderNo: "",
          defaultTraderName: "",
          ecdsBankName:"",
          ecdsBankNo:"",
          ecdsOrgCode:"",
          reserve3:"",
          reserve4:"",
          reserve5:"",
        },
        brchNoRule: [{ test: /^[0-9a-zA-Z]{1,10}$/, trigger: "blur", message: "系统内机构号由不超过10位数字或字母组成" }],
        cashorgidRule: [{ test: /^[0-9a-zA-Z]{1,10}$/, trigger: "blur", message: "核算机构号由不超过10位数字或字母组成" }],
        virtualTellerNoRule: [{ test: /^[0-9a-zA-Z]{1,20}$/, trigger: "blur", message: "虚拟柜员号由不超过20位数字或字母组成" }],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "大额行号由12位数字组成" }],
        orgCodeRule: [{
          test: /^[0-9A-Z]{8}\-[0-9A-Z]$/,
          trigger: "blur",
          message: "组织机构代码由8位数字或大写字母加上一个“-”再加上一位数字或大写字母组成"
        }],
        //票交机构弹出框
       // brchCodeWin: false,
        //交易柜员弹出框
        brchUserTraderWin: false,
        //角色分配弹出框
        brchRoleDistributeWin: false,
        //查看菜单弹出框
        showBranchMenuWin: false,
        //产品授权弹出框
        productDistributeWin: false,
        //批量复制授权产品弹出框
        brchCopyProdWin: false,
        //机构历史查询弹出框
        brchLogDetailWin: false,
        copyProdForm: {
          targetBrchNo: "",
          targetBrchName: ""
        },
        detailFormItem: {
          brchNo: ""
        },
        isShowEditParentBrch: true,
        isRequiredEcdsInputText:true,
      };
    },
    components: {
      BrchLogDetail: () => import(/* webpackChunkName: "sm/auth/branch/brchLogDetail" */`@/views/bizViews/sm/auth/branch/brchLogDetail`),
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      RoleDistribute: () => import(/* webpackChunkName: "sm/auth/branch/roleDistribute" */`@/views/bizViews/sm/auth/branch/roleDistribute`),
      ShowBranchMenu: () => import(/* webpackChunkName: "sm/auth/branch/showBranchMenu" */`@/views/bizViews/sm/auth/branch/showBranchMenu`),
      ProductDistribute: () => import(/* webpackChunkName: "sm/auth/branch/productDistribute" */`@/views/bizViews/sm/auth/branch/productDistribute`),
    },
    watch: {},
    computed: {},
    methods: {
      handleResize() {
        this.$nextTick(() => {
          this.mBarHeight = window.innerHeight;
        });
      },
      //查询机构树
      queryBranchTree() {
        post({}, "/sm/auth/branch/queryBranchTree").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.branchList = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              this.handleExpandTree(this.branchList);
            } else {
              this.branchList = [];
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //收拢左侧树
      handleUnExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = !this.isDisabled;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      handleExpandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = !this.isDisabled;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            arr[i].expand = isExpand;
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      orgSelectChange(item) {
        if (item.length > 0) {
          this.formItem.brchNo = item[0].id;
        } else {
          this.formItem.brchNo = "";
        }
        this.formItemBrchNo = "";
        this.formSearch("0");
      },
      formSearch(optType) {
        if (optType === "1") {
          this.formItem.brchNo = this.formItemBrchNo;
          if (this.$refs["branchTree"].getSelectedNodes().length !== 0) {
            this.$refs["branchTree"].$set(this.$refs["branchTree"].getSelectedNodes()[0], "selected", false);
          }
        }
        this.formItem.optType = optType;
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItemBrchNo = "";
        this.brchNo = "";
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
        if (this.$refs["branchTree"].getSelectedNodes().length !== 0) {
          this.$refs["branchTree"].$set(this.$refs["branchTree"].getSelectedNodes()[0], "selected", false);
        }
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addFormReset();

        this.addOrEditWin=false;
      },
      // 新增/修改机构
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            if(this.currentSelectRow.brchLevel === "2"){
              this.$msgTip.info(this, { info: "总行信息不允许修改" });
              return;
            }
            this.addOrEditWin = true;
            this.$nextTick(() => {
              this.addForm.id = this.currentSelectRow.id;
              this.addForm.brchName = this.currentSelectRow.brchName;
              this.addForm.brchNo = this.currentSelectRow.brchNo;
              this.addForm.cashorgid = this.currentSelectRow.cashorgid;
              this.addForm.brchAddr = this.currentSelectRow.brchAddr;
              this.addForm.bankNo = this.currentSelectRow.bankNo;
              this.addForm.orgCode = this.currentSelectRow.orgCode;
              this.addForm.virtualTellerNo = this.currentSelectRow.virtualTellerNo;
              this.addForm.parentBrchNo = this.currentSelectRow.parentBrchNo;
              //给上级机构名称字段赋值
              this.queryObjByBrchNo(this.addForm.parentBrchNo);
              this.addForm.cpesBrchCode = this.currentSelectRow.cpesBrchCode;
              this.addForm.cpesBrchName = this.currentSelectRow.cpesBrchName;
              this.addForm.defaultTraderName = this.currentSelectRow.defaultTraderName;
              this.addForm.ecdsOrgCode = this.currentSelectRow.ecdsOrgCode;
              this.addForm.ecdsBankName = this.currentSelectRow.ecdsBankName;
              this.addForm.ecdsBankNo = this.currentSelectRow.ecdsBankNo;
              this.addForm.reserve3 = this.currentSelectRow.reserve3;
              this.addForm.reserve4 = this.currentSelectRow.reserve4;
              this.addForm.reserve5 = this.currentSelectRow.reserve5;
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          let branchNode = this.$refs["branchTree"].getSelectedNodes();
          if (branchNode.length === 0 && (this.currentSelectRow == null || this.currentSelectRow.length === 0)) {
            this.$msgTip.info(this, { info: "请先选择父机构" });
            return;
          }
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addFormReset();
            if (branchNode && branchNode.length !== 0) {
              this.addForm.parentBrchNo = branchNode[0].id;
              this.addForm.parentBrchName = branchNode[0].title;
            } else if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
              this.addForm.parentBrchNo = this.currentSelectRow.brchNo;
              this.addForm.parentBrchName = this.currentSelectRow.brchName;
            }
          });
        }
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id= "";
        this.addForm.parentBrchNo = "";
      },
      queryObjByBrchNo(brchNo) {
        post({ brchNo: brchNo }, "sm/auth/branch/getBranchByBranchTreeNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.parentBrchName = res.data.retData.brchName;
            }
          }
        });
      },
      synBankNo(){
          this.addForm.ecdsBankNo = this.addForm.bankNo;
      },
      synBrchName(){
          this.addForm.ecdsBankName = this.addForm.brchName;
      },
      synOrgCode(){
        this.addForm.ecdsOrgCode = this.addForm.orgCode;
      },

      //删除机构
      handleComfirm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel() {
        let id = this.currentSelectRow.id;
        post({ id: id }, "/sm/auth/branch/branch/func_deleteBranch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.queryBranchTree();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //角色分配
      roleDistribute() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.brchRoleDistributeWin = true;
          this.brchNo = this.currentSelectRow.brchNo;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //查看菜单
      showBranchMenu() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.showBranchMenuWin = true;
          this.brchNo = this.currentSelectRow.brchNo;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //产品授权
      productDistribution() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.productDistributeWin = true;
          this.brchNo = this.currentSelectRow.brchNo;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //批量复制授权产品
      batchCopyProduct() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$nextTick(() => {
            this.$refs.copyProdForm.resetFields();
            this.brchNo = this.currentSelectRow.brchNo;
          });
          this.brchCopyProdWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //机构历史查询
      brchLogDetail() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.detailFormItem.brchNo = this.currentSelectRow.brchNo;
          this.brchLogDetailWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/sm/auth/branch/branch/func_addBranch" : "/sm/auth/branch/branch/func_updateBranch";
            if (this.type === "synch") {
              url = "/sm/auth/branch/branch/func_syncBranch";
            }
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                  this.queryBranchTree();
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
     /* //票交机构弹出框
      queryCpesBrchCode() {
        this.brchCodeWin = true;
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        this.addForm.cpesBrchCode = info.brchCode;
        this.addForm.cpesBrchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },
      brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      // TODO 交易柜员弹出框，目前需求未提出
      /* queryTraderName(brchNo) {
         this.brchUserTraderWin = true;
         this.brchNo = brchNo;
       },
       userTraderChange(info) {
         this.addForm.defaultTraderNo = info.userNo;
         this.addForm.defaultTraderName = info.userName;
         this.brchUserTraderWin = false;
       },
       userTraderWinClose() {
         this.brchUserTraderWin = false;
       },*/
      roleDistributeWinClose() {
        this.brchRoleDistributeWin = false;
      },
      roleDistributeSubmit() {
        this.brchRoleDistributeWin = false;
      },
      showBranchMenuWinClose() {
        this.showBranchMenuWin = false;
      },
      productDistributeWinClose() {
        this.productDistributeWin = false;
      },
      productDistributeSubmit() {
        this.productDistributeWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        this.copyProdForm.targetBrchNo = "";
        this.copyProdForm.targetBrchName = "";
        for (let i = 0; i < info.length; i++) {
          this.copyProdForm.targetBrchNo += info[i].id;
          this.copyProdForm.targetBrchName += info[i].title;
          if (i < info.length - 1) {
            this.copyProdForm.targetBrchNo += ",";
            this.copyProdForm.targetBrchName += ",";
          }
        }
      },
      brchNoChange2(info) {
        if(info.length > 0) {
          this.addForm.ecdsOrgCode = info[0].orgCode;
          this.addForm.ecdsBankName = info[0].ecdsBankName;
        } else {
            this.addForm.ecdsOrgCode = "";
            this.addForm.ecdsBankName = "";
        }
      },
      brchCopyProdWinClose() {
        this.brchCopyProdWin = false;
      },
      //批量复制授权产品提交
      copyProdSubmit() {
        this.$refs["copyProdForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post({
              brchNo: this.brchNo,
              targetBrchNos: this.copyProdForm.targetBrchNo
            }, "/bm/prod/product/copyAssignBranchProduct").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.brchCopyProdWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
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
      brchLogDetailWinClose() {
        this.brchLogDetailWin = false;
      },
      syncBrch() {
        if (this.addForm.brchNo !== "") {
          let brchNo = this.addForm.brchNo;
          let parentBrchNo = this.addForm.parentBrchNo;
          post({ brchNo: brchNo, parentBrchNo: parentBrchNo }, "/sm/auth/branch/branch/func_findExternalBrch").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let brchInfo = res.data.retData;
                  if (brchInfo != null) {
                    this.addForm.brchName = brchInfo.brchName;
                    this.addForm.brchNo = brchInfo.brchNo;
                    this.addForm.brchAddr = brchInfo.brchAddr;
                    this.addForm.cashorgid = brchInfo.cashorgid;
                    this.addForm.bankNo = brchInfo.bankNo;
                    this.addForm.orgCode = brchInfo.orgCode;
                    this.addForm.virtualTellerNo = brchInfo.virtualTellerNo;
                    this.addForm.parentBrchNo = brchInfo.parentBrchNo;
                    this.addForm.cpesBrchCode = brchInfo.cpesBrchCode;
                    this.addForm.cpesBrchName = brchInfo.cpesBrchName;
                    this.addForm.ecdsBankNo = brchInfo.bankNo;
                    this.addForm.ecdsBankName = brchInfo.brchName;
                    this.addForm.ecdsOrgCode = brchInfo.orgCode;
                  }
                } else {
                  this.$msgTip.error(this, { info: "同步机构信息失败：" + res.data.retMsg });
                }
              }
            }
          ).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          });
        } else {
          this.$msgTip.info(this, { info: "机构号不能为空" });
        }
      },
      recursiveAssigNode(menuTreeData, arr) {
        this.flag = false;
        for (let i = 0; i < menuTreeData.length; i++) {
          if (this.flag) {
            break;
          }
          if (menuTreeData[i].id === arr.id) {
            menuTreeData[i] = arr;
            this.flag = true;
            break;
          }
          if (menuTreeData[i].children) {
            this.recursiveAssigNode(menuTreeData[i].children, arr)
          }
        }
      },
      isAllExpand(arr) {
        this.flag = true;
        for (let i = 0; i < arr.length; i++) {
          if (!this.flag) {
            break;
          }
          if (arr[i].expand === false && arr[i].children) {
            this.flag = false;
            break;
          }
          if (arr[i].children) {
            this.isAllExpand(arr[i].children)
          }
        }
      },
      toggleExpand(arr, status) {
        let closeCount = 0;
        this.recursiveAssigNode(this.branchList, arr);
        this.isAllExpand(this.branchList);
        // 完全收缩
        for (let i = 0; i < this.branchList.length; i++) {
          if (this.branchList[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.branchList.length) {
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = true;
          return;
        }
        if(!this.flag){
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = false;
        }else{
          this.isExpandDisabled = true;
          this.isNotExpandDisabled = false;
        }

      },
    },
    created() {
      // 获取是对接模式还是直连模式，对接模式BBSP暂不支持，如需拓展需BBSP修改支持。
      getConnectMode().then(res => {
        this.mode = res;
        if (this.mode === "2" || this.mode === "6") {
          this.isShowEditParentBrch = false;
        } else {
          this.isShowEditParentBrch = true;
        }
      })
    },
    mounted() {
      this.handleResize();
      on(window, "resize", this.handleResize);
      this.queryBranchTree();
      this.getDictListByGroups("BranchLevel,BranchLogOperType").then(res => {
        this.dictMap = res.get("map");
      });
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if (this.btnAuth.isRequiredEcdsInputText === undefined ? true : this.btnAuth.isRequiredEcdsInputText.isShow) {
              this.isRequiredEcdsInputText = true;
            } else {
              this.isRequiredEcdsInputText = false;
            }
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    beforeDestroy() {
      off(window, "resize", this.handleResize);
    }
  };

</script>
