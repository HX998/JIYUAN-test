<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="legalNo" :label="$t('m.i.common.legalNo')">
                  <h-input v-model="formItem.legalNo" placeholder="" :maxlength="6"></h-input>
                </h-form-item>
                <h-form-item prop="legalpersonName" :label="$t('m.i.common.legalpersonName')" :validRules="legalNameRule">
                  <h-input v-model="formItem.legalpersonName" placeholder="" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/sm/auth/legalperson/legalPersonMain/func_getLegalPersonList"
                      :bindForm="formItem"
                      :onSelectChange="handleSelectClick"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleForm('add')" v-if="authObj.legalPersonAdd">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="handleForm('modify')" v-if="authObj.legalPersonModify">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="deleteUser()" v-if="authObj.legalPersonDelete">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="roleDistribute()" v-if="authObj.roleDist">{{$t("m.i.auth.roleDistribute")}}</h-button>
              <h-button type="primary" @click="showMenu()" v-if="authObj.legalPersonShowMenu">{{$t("m.i.auth.showAdminMenu")}}</h-button>
              <h-button type="primary" @click="productDistribution()" v-if="authObj.productDist">{{$t("m.i.auth.productDistribution")}}</h-button>
              <h-button type="primary" @click="batchCopyProduct()" v-if="authObj.batchCopyProd">{{$t("m.i.auth.batchCopyProduct")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增/修改弹出框 -->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="addOrEditWinClose()">
      <p slot="header">
        <span v-if="type=='add'">新增法人</span>
        <span v-if="type=='modify'">修改法人</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.legalpersonName')" prop="legalpersonName" :validRules="legalNameRule" required>
            <h-input v-model="addOrEditForm.legalpersonName" placeholder=""  @on-blur="synBrchName()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.bankNo')" prop="bankNo" :validRules="bankNoRule" :required="isGetEcds">
            <h-input v-model="addOrEditForm.bankNo" placeholder="12位数字"  @on-blur="synBankNo()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.transferBankNo')" prop="transferBankNo" :validRules="transferBankNoRule" :required="isGetEcds">
            <h-input v-model="addOrEditForm.transferBankNo" placeholder="12位数字"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.orgCode')" prop="orgCode" :validRules="orgCodeRule" required>
            <h-input v-model="addOrEditForm.orgCode" placeholder="xxxxxxxx-x" @on-blur="synOrgCode()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo" :validRules="brchNoRule" required>
            <h-input v-model="addOrEditForm.brchNo" placeholder="不超过10位的数字或字母" :readonly="readonly"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchAddr')" prop="brchAddr" :validRules="brchAddrRule" required>
            <h-input v-model="addOrEditForm.brchAddr" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.provisionAcctNo')" prop="provisionAcctNo" :validRules="provisionAcctNoRule" :required="isGetEcds">
            <h-input v-model="addOrEditForm.provisionAcctNo" placeholder="不超过20位的数字"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" :validRules="socCodeRule">
            <h-input v-model="addOrEditForm.socCode" placeholder="18位数字或大写字母"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.memberId')" prop="memberId" required v-if="editNoView">
            <h-input v-model="addOrEditForm.memberId" placeholder="" readonly icon="android-search"
                     @on-click="queryMemberId()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.memberId')" prop="memberId" required v-if="editView">
            <h-input v-model="addOrEditForm.memberId" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
            <h-input v-model="addOrEditForm.memberName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.headCpesBrchCode')" prop="brchCode" :validRules="brchCodeRule" required v-if="editNoView">
            <h-input v-model="addOrEditForm.brchCode" placeholder="" icon="android-search" @on-click="queryBranchCode()"
                     readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.headCpesBrchCode')" prop="brchCode" :validRules="brchCodeRule" required v-if="editView">
            <h-input v-model="addOrEditForm.brchCode" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.headCpesBrchName')" prop="cpesBrchName" :validRules="cpesBrchNameRule">
            <h-input v-model="addOrEditForm.cpesBrchName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.virtualTellerNo')" prop="virtualTellerNo" required :validRules="virtualTellerNoRule">
            <h-input v-model="addOrEditForm.virtualTellerNo" placeholder="不超过10位的数字或字母"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.ecdsBankNo')" prop="ecdsBankNo" :validRules="bankNoRule" :required="isGetEcds">
            <h-input v-model="addOrEditForm.ecdsBankNo"  readonly placeholder="12位数字"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.ecdsBankName')" prop="ecdsBankName" :validRules="ecdsBankNameRule" :required="isGetEcds">
            <h-input v-model="addOrEditForm.ecdsBankName"  readonly placeholder="" ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.ecdsOrgCode')" prop="ecdsOrgCode"  :required="isGetEcds" class="h-form-long-label">
            <h-input v-model="addOrEditForm.ecdsOrgCode" readonly placeholder="" :maxlength="10" ></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWinClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 角色分配弹出框 -->
    <h-msg-box v-model="roleDistributeWin" width="400" class="h-form-search-layer" :maximize="true"
               :mask-closable="false" @on-maximize="getTreeHeight($event, 'roleDistributeMsg', 'roleDistributeTreeHeight')" ref="roleDistributeMsg">
      <!--弹出框模式标题-->
      <p slot="header">
        <span>角色分配</span>
      </p>
      <!--弹出框内容-->
      <div class="h-tree-search">
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(roleTreeData)'>
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(roleTreeData)'>
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
        </div>
        <div class="h-tree-content" style="position:relative;" :style="{height: roleDistributeTreeHeight + 'px'}">
          <h-tree :data="roleTreeData" show-checkbox multiple ref="roleTreeData" class='h-tree-self'@on-toggle-expand="toggleRoleExpand"></h-tree>
        </div>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="roleDistributeWin=!roleDistributeWin;isExpandDisabled=true;isNotExpandDisabled=false;">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="roleDistributeAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--点击弹出设置菜单窗口-->
    <h-msg-box v-model="showMenuWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-maximize="getTreeHeight($event, 'showMenuMsg', 'showMenuTreeHeight')" ref="showMenuMsg">
      <!--弹出框模式标题-->
      <p slot="header">
        <span>查看菜单</span>
      </p>
      <!--弹出框内容-->
      <div class="h-tree-search">
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(menuTreeData)'>
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(menuTreeData)'>
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
        </div>
        <div class="h-tree-content" style="position:relative;" :style="{height: showMenuTreeHeight + 'px'}">
          <h-tree :data="menuTreeData" ref='menuTree' class='h-tree-self' @on-toggle-expand="toggleMenuExpand"></h-tree>
        </div>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="showMenuWin=!showMenuWin;isExpandDisabled=true;isNotExpandDisabled=false;">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 产品授权 -->
    <product-distribute :product-distribute-win="productDistributionWin" :legal-no="legalNo" :opt-type="this.optType"
                        @productDistributeWinClose="productDistributeWinClose"
                        @productDistributionSubmit="productDistributionSubmit"></product-distribute>

    <!-- 查询会员代码 -->
    <member-id-search :memberIdWin="memberIdWin" @memberIdWinClose="memberIdWinClose"
                      @memberIdWinSubmit="memberIdWinSubmit"></member-id-search>

    <!-- 查询票交机构代码 -->
    <brch-code-search :brchCodeWin="brchCodeWin" :needMemberId="needMemberId" @branchCodeWinClose="branchCodeWinClose"
                      @brchCodeWinSubmit="brchCodeWinSubmit"></brch-code-search>
    <show-branch :showBranchWin="showBranchWin" title="机构查询" ifcheck="true" :multiple="true" :checkStrictly="true"
                 @brchNoChange="brchNoChange" @showBranchWinClose="showBranchWinClose"></show-branch>
    <!-- 批量复制授权产品 -->
    <h-msg-box v-model="copyProdWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="copyProdWinClose()">
      <p slot="header">
        <span>批量复制授权产品</span>
      </p>
      <h-panel>
        <h-form :model="copyProdForm" :label-width="115" ref="copyProdForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.auth.targetLegalNo')" prop="targetLegalNo" required>
            <h-input v-model="copyProdForm.targetLegalNo" placeholder="" icon="android-search"
                     @on-click="queryTargetLegalNo()" readonly clearable @on-clear="clearTargetLegal"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.targetLegalpersonName')" prop="targetLegalpersonName">
            <h-input v-model="copyProdForm.targetLegalpersonName" placeholder="" readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="copyProdWinClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="copyProdSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--法人编号弹出框（目标法人编号可选多个）-->
    <h-msg-box v-model="legalNoSearchWin" width="1000" @on-close="legalNoReset" class="h-form-table-layer"
               :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
      <p slot="header">
        <span>查询法人窗口</span>
      </p>
      <h-form :model="legalNoFormItem" :label-width="90" ref="legalNoFormItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo">
          <h-input v-model="legalNoFormItem.legalNo" :maxlength="6"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.legalpersonName')" prop="legalpersonName">
          <h-input v-model="legalNoFormItem.legalpersonName" :maxlength="60"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate two-form">
          <h-button type="primary" @click="legalNoFormSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="legalNoReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
      <h-datagrid :columns="legalNoColumns"
                  :rowSelect="true"
                  :autoLoad="false"
                  url="/sm/auth/legalperson/legalPersonMain/func_getLegalPersonList"
                  :bindForm="legalNoFormItem"
                  :has-select="false"
                  ref="legalNoDatagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="legalNoClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="legalNoFormSubmit">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "legalPersonMain",
    data() {
      return {
        formItem: {
          legalNo: "",
          legalpersonName: ""
        },
        addOrEditForm: {
          id: "",
          legalpersonName: "",
          bankNo: "",
          transferBankNo: "",
          orgCode: "",
          brchNo: "",
          brchAddr: "",
          provisionAcctNo: "",
          socCode: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          cpesBrchName: "",
          ecdsBankNo: "",
          ecdsBankName: "",
          ecdsOrgCode:"",
          virtualTellerNo: ""
        },
        copyProdForm: {
          targetLegalNo: "",
          targetLegalpersonName: ""
        },
        legalNoFormItem: {
          legalNo: "",
          legalpersonName: ""
        },
        //给按钮增加权限
        authObj: {
          legalPersonAdd: true,    //新增
          legalPersonModify: true, //修改
          legalPersonDelete: true, //删除
          roleDist: true, //角色分配
          legalPersonShowMenu: true,//查看菜单
          productDist: true, //产品授权
          batchCopyProd: true //批量复制授权产品
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            type: "selection",
            width: 60,
            hiddenCol: true
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalpersonName'),
            key: "legalpersonName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: "行号",
            key: "bankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.transferBankNo"),
            key: "transferBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.orgCode'),
            key: "orgCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.createDt'),
            key: "createTime",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let date = this.$moment(params.row.createTime, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.auth.provisionAcctNo'),
            key: "provisionAcctNo",
            hiddenCol: false
          }
        ],
        legalNoColumns: [
          {
            type: "selection",
            width: 60,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.legalpersonName'),
            key: "legalpersonName",
            hiddenCol: false,
            sortable: true
          }
        ],
        isGetEcds:true,
        editNoView: true,
        editView: false,
        legalNameRule: [{ test: /^.{1,60}$/, trigger: "blur", message: "法人名称不能超过60位" }],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "请输入12位数字的行号" }],
        transferBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "请输入12位数字的行号" }],
        orgCodeRule: [{ test: /^[0-9A-Z]{8}\-[0-9A-Z]$/, trigger: "blur", message: "8位数字或大写字母加“-”加1位数字或大写字母" }],
        brchNoRule: [{ test: /^[0-9a-zA-Z]{1,10}$/, trigger: "blur", message: "由小于或等于10位数字或字母组成" }],
        brchAddrRule: [{ test: /^.{1,80}$/, trigger: "blur", message: "机构地址不能超过80位" }],
        provisionAcctNoRule: [{ test: /^[0-9]{1,20}$/, trigger: "blur", message: "人行备付金账号为数字且不能超过20位" }],
        socCodeRule: [{ test: /^[0-9A-Z]{18}$/, trigger: "blur", message: "统一社会信用代码由18位数字或大写字母组成" }],
        brchCodeRule: [{ test: /^[0-9A-Za-z]{1,10}$/, trigger: "blur", message: "由小于或等于10位数字或字母组成" }],
        cpesBrchNameRule: [{ test: /^.{1,60}$/, trigger: "blur", message: "总行票交机构名称不能超过60位" }],
        ecdsBankNameRule: [{ test: /^.{1,60}$/, trigger: "blur", message: "ecds参与行名称不能超过60位" }],
        virtualTellerNoRule: [{ test: /^[0-9A-Za-z]{1,10}$/, trigger: "blur", message: "虚拟柜员由小于或等于10位数字或字母组成" }],
        submitFlag: false,
        readonly: false,
        addOrEditWin: false,
        memberIdWin: false,
        brchCodeWin: false,
        currentSelectRow: [],
        currentSelectRowInx: [],
        moveUpDisabled: false,
        moveDownDisabled: false,
        roleDistributeWin: false,
        showMenuWin: false,
        productDistributionWin: false,
        copyProdWin: false,
        legalNoSearchWin: false,
        menuTreeData: [],
        roleTreeData: [],
        productTreeData: [],
        type: null,
        legalNoRoleSubmit: null,
        legalNoCopyProdSubmit: null,
        legalNo: "",
        optType: "",
        isDisabled: true,
        isExpandDisabled: true,
        isNotExpandDisabled: false,
        flag:false,
        //机构查询弹出框
        showBranchWin: false,
        needMemberId: "",
        //是否显示更多查询项
        ifShowMore: false,
        roleDistributeTreeHeight: 300,
        showMenuTreeHeight: 300
      };
    },
    components: {
      ProductDistribute: () => import(/* webpackChunkName: "sm/auth/branch/productDistribute" */`@/views/bizViews/sm/auth/branch/productDistribute`),
      MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`),
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/brchCodeSearch" */`@/views/bizViews/sm/auth/legalperson/brchCodeSearch`),
      LegalNoSearch: () => import(/* webpackChunkName: "sm/auth/legalPersonManager/legalNoSearch" */`@/views/bizViews/sm/auth/legalPersonManager/legalNoSearch`),
      ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),

    },
    watch: {},
    computed: {},
    methods: {
      getTreeHeight(isMax, msgRef, msgHeight) {
        this.$nextTick(() => {
          if(isMax) {
            let headerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header')[0].offsetHeight;
            let footerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-footer')[0].offsetHeight;
            let headerBtnHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header-wrapper')[0].offsetHeight;
            let mTreeHeight = window.innerHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - 20;
            if(window.sessionStorage.getItem("isTransfer") === "0") {
              let appObj = document.getElementsByClassName("app-main");
              let appOffsetHeight = appObj.length == 0 ? 0 : appObj[0].offsetHeight;
              mTreeHeight = appOffsetHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - 20;
            }
            this[msgHeight] = mTreeHeight;
          } else {
            this[msgHeight] = 300;
          }
        });
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.legalNoDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = false;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = true;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            this.$set(arr[i], "expand", isExpand);
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      //查询
      handleSearch() {
        this.unDisabled();
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置新增/修改窗口
      addOrEditReset() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectRow = arr;
        this.currentSelectRowInx = selectInx;
        let selectIndex = selectInx[0];
        let lastSelectIndex = this.$refs.datagrid.tData.length - 1;
        if (selectIndex == "0") {
          this.moveUpDisabled = true;
        }
        if (selectIndex == lastSelectIndex) {
          this.moveDownDisabled = true;
        }
      },
      // 新增/修改
      handleForm(str) {
        this.type = str;
        this.readonly = false;
        this.editNoView = true;
        this.editView = false;
        if (this.type === "modify") {
          this.editNoView = false;
          this.editView = true;
        }
        if (this.type == "modify" && this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.type == "modify" && this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.type == "modify") {
          this.readonly = true;
          let legalPersonId = this.currentSelectRow[0].id;
          post({ id: legalPersonId }, "/sm/auth/legalperson/legalPersonMain/func_queryLegalPerson").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.addOrEditForm.id = res.data.retData.id;
                this.addOrEditForm.legalNo = res.data.retData.legalNo;
                this.addOrEditForm.legalpersonName = res.data.retData.legalpersonName;
                this.addOrEditForm.bankNo = res.data.retData.bankNo;
                this.addOrEditForm.transferBankNo = res.data.retData.transferBankNo;
                this.addOrEditForm.orgCode = res.data.retData.orgCode;
                this.addOrEditForm.brchNo = res.data.retData.brchNo;
                this.addOrEditForm.brchAddr = res.data.retData.brchAddr;
                this.addOrEditForm.provisionAcctNo = res.data.retData.provisionAcctNo;
                this.addOrEditForm.socCode = res.data.retData.socCode;
                this.addOrEditForm.memberId = res.data.retData.memberId;
                this.addOrEditForm.memberName = res.data.retData.memberName;
                this.addOrEditForm.brchCode = res.data.retData.brchCode;
                this.addOrEditForm.cpesBrchName = res.data.retData.cpesBrchName;
                this.addOrEditForm.virtualTellerNo = res.data.retData.virtualTellerNo;
                this.addOrEditForm.ecdsOrgCode = res.data.retData.ecdsOrgCode;
                this.addOrEditForm.ecdsBankName = res.data.retData.ecdsBankName;
                this.addOrEditForm.ecdsBankNo = res.data.retData.ecdsBankNo;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$nextTick(() => {
            this.addOrEditReset();
          });
        }
        this.addOrEditWin = true;
      },
      //删除
      deleteUser() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        let list = this.currentSelectRow;
        let legalNo = "";
        for (var i = 0, count = list.length; i < count; i++) {
          legalNo += list[i].legalNo;
          if (i < list.length - 1) {
            legalNo += ",";
          }
        }
        post({ legalNo: legalNo }, "/sm/auth/legalperson/legalPersonMain/func_deleteLegalPerson").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //新增修改页面提交
      formAdd() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.type == "add" ? "/sm/auth/legalperson/legalPersonMain/func_addLegalPerson" : "/sm/auth/legalperson/legalPersonMain/func_updateLegalPerson";
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                  this.addOrEditWinClose();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //角色分配
      roleDistribute() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.legalNoRoleSubmit = this.currentSelectRow[0].legalNo;
        let legalNo = this.currentSelectRow[0].legalNo;
        post({ code: legalNo }, "/sm/auth/legalperson/legalPersonMain/func_queryRoleTree").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.roleTreeData = data;
            this.expandTree(this.roleTreeData);
          }
          this.roleDistributeWin = true;
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      showBranchWinOpen() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },

      brchNoChange(info) {
        if(info.length > 1){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.addOrEditForm.ecdsBankNo = info[0].bankNo;
        this.addOrEditForm.ecdsBankName = info[0].title;
        this.addOrEditForm.ecdsOrgCode = info[0].orgCode;
        this.showBranchWin = false;
      },
      //查看菜单
      showMenu() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        /*获取菜单树结构*/
        let legalNo = this.currentSelectRow[0].legalNo;
        post({ code: legalNo }, "/sm/auth/legalperson/legalPersonMain/func_queryLegalAuth").then(res => {
          if (res && res.data.retData) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.menuTreeData = data;
            this.expandTree(this.menuTreeData);
          }
          this.showMenuWin = true;
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //产品授权
      productDistribution() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.legalNoRoleSubmit = this.currentSelectRow[0].legalNo;
        this.legalNo = this.currentSelectRow[0].legalNo;
        this.optType = "1";
        this.productDistributionWin = true;
      },
      //查询会员代码弹窗
      queryMemberId() {
        this.memberIdWin = true;
      },
      //查询总行票交机构代码弹窗
      queryBranchCode() {
        if (this.addOrEditForm.memberId === "") {
          this.$msgTip.info(this, { info: "请先选择会员代码！" });
          return;
        }
        this.needMemberId = this.addOrEditForm.memberId;
        this.brchCodeWin = true;
      },
      //查询会员代码
      //关闭窗口
      memberIdWinClose() {
        this.memberIdWin = false;
      },
      //根据弹框所选数据进行赋值
      memberIdWinSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.addOrEditForm.memberId = info.memberId;
        this.addOrEditForm.memberName = info.memberName;
        this.memberIdWin = false;
        if (this.addOrEditForm.memberId != this.needMemberId) {
          this.addOrEditForm.brchCode = "";
          this.addOrEditForm.cpesBrchName = "";
        }
      },
      //查询票交机构代码
      //关闭窗口
      branchCodeWinClose() {
        this.brchCodeWin = false;
      },
      //根据弹框所选数据进行赋值
      brchCodeWinSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.addOrEditForm.brchCode = info.brchCode;
        this.addOrEditForm.cpesBrchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },
      //角色分配提交
      roleDistributeAdd() {
        let legalNo = this.legalNoRoleSubmit;
        let roleIds = "";
        let arr = this.$refs["roleTreeData"].getCheckedNodes();
        for (var i = 0, count = arr.length; i < count; i++) {
          roleIds += arr[i].id;
          if (i < arr.length - 1) {
            roleIds += ",";
          }
        }
        this.submitFlag = true;
        post({
          legalNo: legalNo,
          roleIds: roleIds
        }, "/sm/auth/legalperson/legalPersonMain/func_addLegalPersonRole").then(res => {
          this.submitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.roleDistributeWin = false;
              this.isExpandDisabled=true;
              this.isNotExpandDisabled=false;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //产品分配提交
      productDistributionSubmit() {
        this.productDistributionWin = false;
      },
      productDistributeWinClose() {
        this.productDistributionWin = false;
      },
      //批量复制授权产品
      batchCopyProduct() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.legalNoCopyProdSubmit = this.currentSelectRow[0].legalNo;
        this.copyProdWin = true;
      },
      //批量复制授权产品提交
      copyProdSubmit() {
        this.$refs["copyProdForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post({
              legalNo: this.legalNoCopyProdSubmit,
              targetLegalNos: this.copyProdForm.targetLegalNo
            }, "/bm/prod/product/copyAssignLegalProduct").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.copyProdWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.copyProdReset();
                  this.$refs.legalNoDatagrid.selects = [];
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //查询法人弹窗
      queryTargetLegalNo() {
        this.legalNoSearchWin = true;
        this.$nextTick(() => {
          this.legalNoFormSearch();
        });
      },
      //查询
      legalNoFormSearch() {
        this.$refs.legalNoDatagrid.selects = [];
        this.$refs.legalNoDatagrid.dataChange(1);
      },
      synBankNo(){
        this.addOrEditForm.ecdsBankNo = this.addOrEditForm.bankNo;
      },
      synBrchName(){
        this.addOrEditForm.ecdsBankName = this.addOrEditForm.legalpersonName;
      },
      synOrgCode(){
        this.addOrEditForm.ecdsOrgCode = this.addOrEditForm.orgCode;
      },

      //查询重置
      legalNoReset() {
        this.$refs.legalNoFormItem.resetFields();
      },
      //确定
      legalNoFormSubmit() {
        let list = this.$refs.legalNoDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }

        let legalNos = "";
        for (var i = 0, count = list.length; i < count; i++) {
          legalNos += list[i].legalNo;
          if (i < list.length - 1) {
            legalNos += ",";
          }
        }
        let legalNames = "";
        for (var i = 0, count = list.length; i < count; i++) {
          legalNames += list[i].legalpersonName;
          if (i < list.length - 1) {
            legalNames += ",";
          }
        }
        this.copyProdForm.targetLegalNo = legalNos;
        this.copyProdForm.targetLegalpersonName = legalNames;
        this.legalNoSearchWin = false;
      },
      //关闭
      legalNoClose() {
        this.$refs.legalNoDatagrid.selects = [];
        this.legalNoSearchWin = false;
      },
      copyProdReset() {
        this.$refs.copyProdForm.resetFields();
        this.copyProdForm.targetLegalNo = "";
        this.copyProdForm.targetLegalpersonName = "";
      },
      clearTargetLegal(){
        this.copyProdReset();
      },
      addOrEditWinClose(){
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.legalNo = "";
        this.addOrEditWin=!this.addOrEditWin
      },
      copyProdWinClose(){
        this.copyProdReset();
        this.copyProdWin = false;
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
      toggleMenuExpand(arr, status) {
        let closeCount = 0;
        this.recursiveAssigNode(this.menuTreeData, arr);
        this.isAllExpand(this.menuTreeData);
        // 完全收缩
        for (let i = 0; i < this.menuTreeData.length; i++) {
          if (this.menuTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.menuTreeData.length) {
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
      toggleRoleExpand(arr, status) {
        let closeCount = 0;
        this.recursiveAssigNode(this.roleTreeData, arr);
        this.isAllExpand(this.roleTreeData);
        // 完全收缩
        for (let i = 0; i < this.roleTreeData.length; i++) {
          if (this.roleTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.roleTreeData.length) {
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
    mounted() {
      post({}, "sm/auth/legalperson/legalPersonMain/func_judgeIsGetEcds").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.isGetEcds = res.data.retData;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
  };
</script>

<style scoped>

</style>
