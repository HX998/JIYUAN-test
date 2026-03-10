<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/ce/disc/elec/fastdisc/discRule/func_queryDiscRuleLimit"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "fdiscLimitSearch",
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
            title: this.$t('m.i.ce.fdiscLimit'),
            key: "ruleName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.totalLimitAmt'),
            key: "ruleValue",
            hiddenCol: false,
            render: (h, params) => {
              let ruleValue = formatNumber(params.row.ruleValue, 2, ",");
              return h("span", {
                domProps: {
                  title: ruleValue
                }
              }, ruleValue);
            }
          },
          {
            title: this.$t('m.i.pc.usedLimitAmt'),
            key: "enableValueStr",
            hiddenCol: false,
            render: (h, params) => {
              let enableValue = formatNumber(params.row.enableValueStr, 2, ",");
              return h("span", {
                domProps: {
                  title: enableValue
                }
              }, enableValue);
            }
          },
          {
            title: this.$t('m.i.pc.doAmt'),
            key: "ruleValueBigStr",
            hiddenCol: false,
            render: (h, params) => {
              let ruleValueBig = formatNumber(params.row.ruleValueBigStr, 2, ",");
              return h("span", {
                domProps: {
                  title: ruleValueBig
                }
              }, ruleValueBig);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "fdiscModeName",
            hiddenCol: false
          }
        ],
        formItem: {
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
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
    }
  };
</script>

<style scoped>

</style>
