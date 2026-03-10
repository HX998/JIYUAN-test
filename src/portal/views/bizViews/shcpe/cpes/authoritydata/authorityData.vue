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
                <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
                  <h-input v-model="formItem.memberName" readonly
                           icon="android-search" @on-click="queryMemberId('query')"></h-input>
                </h-form-item>

               <!-- <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
                  <h-input v-model="formItem.brchName" readonly :title="formItem.brchName"
                           icon="android-search" @on-click="queryCpesBrchCode()"></h-input>
                </h-form-item>-->

                <show-cpes-branch v-model="formItem.brchCode" :label="$t('m.i.common.brchName')"
                                  :brchCode.sync="formItem.brchCode"  :cpesBrchName.sync="formItem.brchName"
                                  datagridUrl="/cpes/branch/queryBranchList"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.common.traderName')" prop="traderName">
                  <h-input v-model="formItem.traderName" readonly
                           icon="android-search" @on-click="queryTraderId()"></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.shcpe.authType')" prop="authType">
                  <h-select v-model="formItem.authType" placeholder="">
                    <h-option v-for="item in authTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
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
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/authoritydata/authorityData/func_queryAuthorityData"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleEditForm()">{{$t("m.i.shcpe.authorityCheck")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询会员代码 -->
    <member-id-search :memberIdWin="memberIdWin" @memberIdWinClose="memberIdWinClose"
                      @memberIdWinSubmit="memberIdWinSubmit"></member-id-search>
    <!-- 票交机构弹出框 -->
   <!-- <brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose" :optType="optType"
                      @brchCodeChange="brchCodeChange"></brch-code-search>-->
    <!-- 交易员查询弹出框 -->
    <trader-id-search :traderIdWin="traderIdWin" @traderIdWinClose="traderIdWinClose"
                      @traderIdChange="traderIdChange"></trader-id-search>

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
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
            <h-input :value="editForm.brchName" readonly></h-input>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.traderName')" prop="traderName">
            <h-input :value="editForm.traderName" readonly></h-input>
          </h-form-item>
        </div>
        <h-form-item :label="$t('m.i.shcpe.authList')" prop="authList" :validRules="authListRule"
                     style="height:170px;">
          <h-input v-model="editForm.authList" type="textarea" :maxlength="4000" :rows="8"></h-input>
        </h-form-item>
        <h-form-item>注：使用逗号分隔</h-form-item>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="editWin=!editWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "authorityData",
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
        memberIdWin: false,
        //brchCodeWin: false,
        traderIdWin: false,
        viewAuthWin: false,
        submitFlag: false,
        ifShowMore: false
      };
    },
    components: {
      MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`),
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      TraderIdSearch: () => import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`)

    },
    watch: {},

    computed: {},
    methods: {
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
      //查看权限弹窗
      getAutolist(value) {
        this.authContext = value;
        this.viewAuthWin = true;
      },
      //查询会员代码弹窗
      queryMemberId() {
        this.memberIdWin = true;
      },
      //根据弹框所选数据进行赋值
      memberIdWinSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.memberId = info.memberId;
        this.formItem.memberName = info.memberName;
        this.memberIdWin = false;
      },
      //关闭查询会员代码窗口
      memberIdWinClose() {
        this.memberIdWin = false;
      },
      //票交机构弹出框
     /* queryCpesBrchCode() {
        this.optType = "2";
        this.brchCodeWin = true;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.brchCode = info.brchCode;
        this.formItem.brchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },*/
      //关闭查询票交机构窗口
     /* brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      //交易员弹出框
      queryTraderId() {
        this.traderIdWin = true;
      },
      //根据弹框所选数据进行赋值
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.traderId = info.traderId;
        this.formItem.traderName = info.traderName;
        this.traderIdWin = false;
      },
      //关闭查询交易员窗口
      traderIdWinClose() {
        this.traderIdWin = false;
      },
      handleWinClose() {
        this.$refs.editForm.resetFields();
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
