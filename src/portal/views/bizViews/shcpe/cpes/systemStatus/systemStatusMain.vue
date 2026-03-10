<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo">
                  <h-input v-model="formItem.legalNo" placeholder="" :maxlength="6"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch(1)">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/systemStatus/systemStatusMain/func_indexSystemStatus"
            :bindForm="formItem"
            :notSetWidth="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
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
    name: "systemStatusMain",
    data() {
      return {
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.memberName'),
            key: "legalPersonName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",

            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.curLoginStatus'),
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
          },
          {
            title: this.$t('m.i.shcpe.remark'),
            key: "remark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.curSysDate'),
            key: "curSysDate",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.sysStatus'),
            key: "curSysStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SysSts", params.row.curSysStatus);
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
          loginStatus: "",
          remark: "",
          curSysDate: "",
          curSysStatus: "",
          memberId: "",
          legalNo: ""
        },
        //给按钮赋权限
        authObj: {
          legalManagerAdd: true,      //新增
          legalManagerModify: true,   //修改
          legalManagerDelete: true,   //删除
          legalManagerResetPwd: true, //重置密码
          legalManagerLockUser: true, //用户状态
          legalManagerDropUser: true  //置为离线
        },
        userNoRule: [{ test: /^[0-9A-Za-z]{1,20}$/, trigger: "blur", message: "用户号为小于等于20位的数字或字母组成" }],
        userNameRule: [{ test: /^.{1,60}$/, trigger: "blur", message: "姓名不能超过60位" }],
        legalNoRule: [{ test: /^[0-9]{6}$/, trigger: "blur", message: "法人编号为6位数字" }],
        legalpersonNameRule: [{ test: /^.{1,60}$/, trigger: "blur", message: "法人名称不能超过60位" }],
        brchNoRule: [{ test: /^[0-9a-zA-Z]{1,10}$/, trigger: "blur", message: "由小于或等于10位数字或字母组成" }],
        userRemarkRule: [{ test: /^.{0,80}$/, trigger: "blur", message: "备注不能超过80位" }],
        legalNoSearchWin: false,
        legalNoType: null,
        submitFlag: false,
        addOrEditWin: false,
        readonly: false,
        moveUpDisabled: false,
        moveDownDisabled: false,

        tableRef: "selfTable",
        currentSelectRow: [],
        currentSelectRowInx: [],
        type: "",
        //是否显示更多查询项
        ifShowMore: false
      };
    },

    computed: {},
    mounted() {
      this.getDictListByGroups("SysSts,CpesLoginStatus").then(res => {
        this.sysStsList = res.get("SysSts");
        this.cpesLoginStatusList = res.get("CpesLoginStatus");
        this.dictMap = res.get("map");
      });
    },
    destroyed() {
      clearInterval(this.timer);
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      getDate() {
        post({}, "/shcpe/cpes/systemStatus/systemStatusMain/func_indexSystemStatus").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            let loginStatus = " ";
            let curSysStatus = " ";
            let curSysDate = " ";
            if (retCode === "000000") {
              if (res.data.retData.loginStatus == "1") {
                loginStatus = "已登录";
              } else if (res.data.retData.loginStatus == "4") {
                loginStatus = "已退出";
              } else if (res.data.retData.loginStatus == "3") {
                loginStatus = "退出中";
              } else if (res.data.retData.loginStatus == "2") {
                loginStatus = "登录中";
              }
              if (res.data.retData.curSysStatus == "SS00") {
                curSysStatus = "营业阶段";
              } else if (res.data.retData.curSysStatus == "SS01") {
                curSysStatus = "日终阶段";
              }
              curSysDate = res.data.retData.curSysDate + "";
              this.formItem.loginStatus = loginStatus;
              this.formItem.remark = res.data.retData.remark;
              this.formItem.curSysDate = curSysDate.substring(0, 4) + "-" + curSysDate.substring(4, 6)
                + "-" + curSysDate.substring(6, 8);
              this.formItem.curSysStatus = curSysStatus;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this.$t("m.i.common.netError"));
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
