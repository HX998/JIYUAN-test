<!--CPES管理-->
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
                <h-form-item :label="$t('m.i.shcpe.loginStatus')" prop="loginStatus">
                  <h-select v-model="formItem.loginStatus" placeholder="">
                    <h-option v-for="item in loginStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
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
            url="/shcpe/cpes/systemStatus/systemStatusManageMain/func_manageSystemStatus"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="Cpeslogin()">{{$t("m.i.common.login")}}</h-button>
              <h-button type="primary" @click="CpesloginOut()">{{$t("m.i.common.signOut")}}</h-button>
              <h-button type="primary" @click="CpesInit()">{{$t("m.i.shcpe.syncInfo")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "systemStatusManageMain",
    data() {
      return {
        formItem: {
          legalNo: "",
          loginStatus: "",
          memberId: "",
          memberName: "",
          isPlatform: ""
        },
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.legalpersonName'),
            key: "legalpersonName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.memberId'),
            key: "memberId",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.loginStatus'),
            key: "loginStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CpesLoginStatus", params.row.loginStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }

        ],
        dictMap: new Map(),
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        loginStatusList: [],
        type: null,
        readonly: false,
        isRequired: true,
        editWin: false,
        ifShowMore: false,
        submitFlag: false,
        id: null
      };
    },
    components: {},
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
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) {
          return;
        }
      },
      handleCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = [];
      },
      //同步信息按钮
      CpesInit() {
        this.$hMsgBox.confirm({
          title: this.$t("同步CPES登录信息"),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.Init();
          }
        });
      },
      Init() {
        let url = "/shcpe/cpes/systemStatus/systemStatusManageMain/func_initCpesLoginExitSvr";
        post({}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //登录按钮
      Cpeslogin() {
        if (this.currentSelectList != null && this.currentSelectList.length >= 1) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.shcpe.memerLogin"),
            content: this.$t("m.i.common.confirm") + "?",
            onOk: () => {
              this.login();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      login() {
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          let url = "/shcpe/cpes/systemStatus/systemStatusManageMain/func_loginExitAppSvr";
          let typeMarkCode = "TM00";
          let idList = "";
          let memberList = "";
          for (let i = 0, count = list.length; i < count; i++) {
            idList += list[i].legalNo;
            memberList += list[i].memberId;
            if (i < list.length - 1) {
              idList += ",";
              memberList += ",";
            }
          }
          post({ idList: idList, memberList: memberList, typeMarkCode: typeMarkCode }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      CpesloginOut() {
        if (this.currentSelectList != null && this.currentSelectList.length >= 1) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.shcpe.memerLoginOff"),
            content: this.$t("m.i.common.confirm") + "?",
            onOk: () => {
              this.loginOut();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      loginOut() {
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          let url = "/shcpe/cpes/systemStatus/systemStatusManageMain/func_loginExitAppSvr";
          let typeMarkCode = "TM01";
          let idList = "";
          let memberList = "";
          for (let i = 0, count = list.length; i < count; i++) {
            idList += list[i].legalNo;
            memberList += list[i].memberId;
            if (i < list.length - 1) {
              idList += ",";
              memberList += ",";
            }
          }
          post({ idList: idList, memberList: memberList, typeMarkCode: typeMarkCode }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      formateData() {
        let list = this.currentSelectList;
        let idList = "";
        let memberList = "";
        for (let i = 0, count = list.length; i < count; i++) {
          idList += list[i].legalNo;
          memberList += list[i].memberId;
          if (i < list.length - 1) {
            idList += ",";
            memberList += ",";
          }
        }
      }
    },
    mounted() {
      this.getDictListByGroups("CpesLoginStatus").then(res => {
        this.loginStatusList = res.get("CpesLoginStatus");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
