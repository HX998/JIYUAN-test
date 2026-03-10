<!--权限数据查询-->
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
                <select-member v-model="formItem.memberName" :label="$t('m.i.common.memberName')"  title="查询会员"
                               :clearable="false" :readonly="true"
                               :memberId.sync="formItem.memberId" :memberName.sync="formItem.memberName"></select-member>
                <show-cpes-branch v-model="formItem.brchCode" :label="$t('m.i.common.brchName')"
                                  :brchCode.sync="formItem.brchCode"  :cpesBrchName.sync="formItem.brchName"
                                  datagridUrl="/cpes/branch/queryBranchList"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                <select-trader :label="$t('m.i.common.traderName')" prop="traderName"
                               v-model="formItem.traderName" @traderIdChange="traderIdChange" :clearable="false"></select-trader>
                <common-select v-model="formItem.authType" prop="authType" :dictList="authTypeList"
                               :label="$t('m.i.shcpe.authType')"></common-select>
                <query-btn  @showChange="ifShowMore=!ifShowMore" :formSearch="formSearch" :formSearchReset="formSearchReset"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/authoritydata/authorityData/func_queryAuthorityData"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm()">{{$t("m.i.shcpe.authorityAdd")}}</h-button>
              <h-button type="primary" @click="handleEditForm()">{{$t("m.i.shcpe.authorityCheck")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击查看权限弹出窗-->
    <h-msg-box v-model="viewAuthWin" width="400" :mask-closable="false" @on-close="handleWinClose"
               :maximize="true">
      <p slot="header">
        <span>权限查看</span>
      </p>
      <div style="word-wrap: break-word;">{{authContext}}</div>
      <div slot="footer">
        <h-button type="ghost" @click="viewAuthWin=!viewAuthWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!--点击权限维护弹出窗-->
    <h-msg-box v-model="editWin" width="600" height="370" :mask-closable="false" @on-close="handleWinClose"
                :maximize="true">
      <p slot="header">
        <span>权限信息维护</span>
      </p>
      <h-form :model="editForm" :label-width="130" ref="editForm" cols="1" class="h-form-search">
        <common-input v-model="editForm.brchName" :label="$t('m.i.common.brchName')" prop="brchName" readonly></common-input>
        <common-input v-model="editForm.traderName" :label="$t('m.i.common.traderName')" prop="traderName" readonly></common-input>
        <common-input prop="authList" v-model="editForm.authList"  :maxlength="4000" :rows="8" type="textarea"
                      :label="$t('m.i.shcpe.authList')"
                      :validRules="authListRule" :canResize="false" class="h-form-height-auto h-form-long-label"></common-input>
        <h-form-item>注：使用逗号分隔</h-form-item>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--点击权限维护弹出窗-->
    <h-msg-box v-model="addWin" width="600"  :mask-closable="false" @on-close="handleAddWinClose"
               :maximize="true">
      <p slot="header">
        <span>新增权限信息</span>
      </p>
      <h-form :model="addForm" :label-width="130" ref="addForm" cols="1" class="h-form-search">
        <select-member prop="memberName" v-model="addForm.memberName" :label="$t('m.i.common.memberName')"  title="查询会员"
                       :clearVal="clearVal" clearValTag="addMemberName"  required readonly
                       :memberId.sync="addForm.memberId" :memberName.sync="addForm.memberName"></select-member>
        <common-input v-model="addForm.memberId" :label="$t('m.i.common.memberId')" prop="memberId" required readonly></common-input>
        <common-select v-model="addForm.authType" prop="authType" :dictList="authTypeList"
                       :label="$t('m.i.shcpe.authType')" required  @on-change="changeAuthType"></common-select>
        <show-cpes-branch prop="brchName" v-model="addForm.brchName" :label="$t('m.i.common.brchName')"
                          :brchCode.sync="addForm.brchCode"  :cpesBrchName.sync="addForm.brchName"
                          datagridUrl="/cpes/branch/queryBranchList"
                          queryUrl="/cpes/branch/queryBranchList" v-if="showBranch" required></show-cpes-branch>
        <common-input v-model="addForm.brchCode" :label="$t('m.i.common.brchCode')" prop="brchCode" readonly v-if="showBranch" required></common-input>
        <select-trader prop="traderName" :label="$t('m.i.common.traderName')"  class="h-form-long-label"
                       v-model="addForm.traderName" @traderIdChange="traderIdChangeAdd"
                       :clearVal="clearVal" clearValTag="addTraderName" v-if="showTrader" required></select-trader>
        <common-input v-model="addForm.traderId" :label="$t('m.i.common.traderId')" prop="traderId" readonly v-if="showTrader" required></common-input>
        <common-input prop="authList" v-model="addForm.authList" required  :maxlength="4000" :rows="8" type="textarea"
                      :label="$t('m.i.shcpe.authList')"
                      :validRules="authListRule" :canResize="false" class="h-form-height-auto h-form-long-label"></common-input>
        <h-form-item>注：使用逗号分隔</h-form-item>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="handleAddWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitAddFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitAddForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  import CommonInput from "../../../../../components/bemp/input/commonInput";


  export default {
    name: "authorityDataMain",
    data() {
      return {
        formItem: {
          memberId: "",
          memberName: "",
          brchCode: "",
          brchName: "",
          traderId: "",
          traderName: "",
          authType: ""
        },
        editForm: {
          id: "",
          brchName: "",
          traderName: "",
          authList: ""
        },
        addForm: {
          memberId: "",
          memberName: "",
          brchCode: "",
          brchName: "",
          traderId: "",
          traderName: "",
          authType: "",
          authList: ""
        },
        authContext: null,

        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        columns: [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: " ",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.shcpe.modifyDt"),
            key: "modifyDt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.modifyDt == null ? "" : this.$moment(params.row.modifyDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,

            sortable: true
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.traderName"),
            key: "traderName",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.traderId"),
            key: "traderId",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.authType"),
            key: "authType",
            hiddenCol: false,

            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AuthType", params.row.authType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.authList"),
            key: "authList",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.getAutolist(params.row.authList);
                  }
                }
              }, "查看权限");
            }
          }
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        authListRule: [{ test: /^([0-9a-zA-Z]|,){0,4000}$/, trigger: "blur", message: "权限详情不能超过4000位，由字母、数字和半角逗号组成" }],
        //optType: "",
        dictMap: new Map(),
        authTypeList: [],
        type: null,
        isRequired: true,
        editWin: false,
        addWin: false,
        memberIdWin: false,
        //brchCodeWin: false,
        traderIdWin: false,
        viewAuthWin: false,
        submitFlag: false,
        ifShowMore: false,
        traderType:"",
        submitAddFlag:false,
        showBranch:false,
        showTrader:false
      };
    },
    components: {
      //MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`),
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      //TraderIdSearch: () => import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`)

    },
    watch: {},

    computed: {},
    methods: {
      clearVal(type) {
        if (type === 'addTraderName') {
          this.addForm.traderId = '';
          this.addForm.traderName = '';
        } else if (type === 'addMemberName') {
          this.addForm.memberId = '';
          this.addForm.memberName = '';
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.memberId = "";
        this.formItem.brchCode = "";
        this.formItem.brchName = "";
        this.formItem.traderId = "";
      },
      handleCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = [];
      },
      submitForm() {
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/shcpe/cpes/authoritydata//authorityData/func_updateAuthInfo";
            let msg = this.$t("m.i.common.modifySuccess");
            post(this.editForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$hMessage.success(msg);
                  this.editWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  let msg = this.$t("m.i.common.modifyFailed");
                  this.$hMessage.error(msg + ":" + res.data.retMsg);
                }
              } else {
                this.$hMessage.error(this.$t("m.i.common.netError"));
              }
            });
          }
        });
      },
      //权限维护
      handleEditForm() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.editForm.id = this.currentSelectRow.id;
        this.editForm.brchName = this.currentSelectRow.brchName;
        this.editForm.traderName = this.currentSelectRow.traderName;
        this.editForm.authList = this.currentSelectRow.authList;
        this.editWin = true;
      },
      handleAddForm() {
        this.addWin = true;
      },
      //查看权限弹窗
      getAutolist(value) {
        this.authContext = value;
        this.viewAuthWin = true;
      },
      //查询会员代码弹窗
      queryMemberId(type) {
        this.type = type;
        this.memberIdWin = true;
      },
      //根据弹框所选数据进行赋值
      memberIdWinSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.type === 'query') {
          this.formItem.memberId = info.memberId;
          this.formItem.memberName = info.memberName;
        } else if (this.type === 'add') {
          this.addForm.memberId = info.memberId;
          this.addForm.memberName = info.memberName;
        }
        this.memberIdWin = false;
      },
      //关闭查询会员代码窗口
      memberIdWinClose() {
        this.memberIdWin = false;
      },

      //根据弹框所选数据进行赋值
      traderIdChange(info) {
          this.formItem.traderId = info.traderId;
          this.formItem.traderName = info.traderName;
      },
      traderIdChangeAdd(info) {
          this.addForm.traderId = info.traderId;
          this.addForm.traderName = info.traderName;
      },
      //关闭查询交易员窗口
      traderIdWinClose() {
        this.traderIdWin = false;
      },
      handleWinClose() {
        this.$refs.editForm.resetFields();
        this.editWin = false;
      },
      handleAddWinClose() {
        this.$refs.addForm.resetFields();
        this.showBranch = false;
        this.showTrader = false;
        this.addWin = false;
      },
      submitAddForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitAddFlag = true;
            this.addForm.brchName = this.addForm.brchName === "" ? null:this.addForm.brchName;
            this.addForm.brchCode = this.addForm.brchCode === "" ? null:this.addForm.brchCode;
            this.addForm.traderName = this.addForm.traderName === "" ? null:this.addForm.traderName;
            this.addForm.traderId = this.addForm.traderId === "" ? null:this.addForm.traderId;
            let url = "/shcpe/cpes/authoritydata/authorityData/func_addAuthInfo";
            let msg = this.$t("m.i.common.addSuccess");
            post(this.addForm, url).then(res => {
              this.submitAddFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$hMessage.success(msg);
                  this.handleAddWinClose();
                  this.$refs.datagrid.dataChange(1);
                } else {
                  let msg = this.$t("m.i.common.addFailed");
                  this.$msgTip.error(this, {info: msg + ":" + res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: msg + ":" + res.data.retMsg});
              }
            });
          }
        });
      },
      changeAuthType() {
        if (this.addForm.authType === 'AT01') {
            // 会员权限
            this.disBranch();
            this.disTrader();
        } else if (this.addForm.authType === 'AT02') {
          // 系统参与者权限
          this.showBranch = true;
          this.disTrader();
        } else if (this.addForm.authType === 'AT03') {
          // 用户权限
          this.showBranch = true;
          this.showTrader = true;
        } else if (this.addForm.authType === null || this.addForm.authType === "") {
          // 会员权限
          this.disBranch();
          this.disTrader();
        }
      },
      disBranch() {
        this.showBranch = false;
        this.addForm.brchCode = "";
        this.addForm.brchName = "";
      },
      disTrader() {
        this.showTrader = false;
        this.addForm.traderName = "";
        this.addForm.traderId = "";
      }
    },
    mounted() {
      this.getDictListByGroups("AuthType").then(res => {
        this.authTypeList = res.get("AuthType");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
