<style>

</style>
<!--流水管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                  <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"
                               title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
                  </show-branch>
                  <h-form-item :label="$t('m.i.pc.balanceType')" prop="balanceTypes">
                    <h-select v-model="formItem.balanceTypes" placeholder="" multiple showTitle>
                      <h-option v-for="item in balanceTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :hasSelect = false
            :rowSelect = true
            :paramId = "'rowNo'"
            url="/pc/acct/balance/indexSumCurrentlyBalance/func_queryCurrentlySumBalanceRegister"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">清单导出</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>
<script>
  import { post, on,off, formatNumber,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: 'indexSumCurrentlyBalance',
    data() {
      return {
        formItem : {
          brchNos: "",
          // balanceType:'',
          balanceTypes:[]
        },
        type : null,
        addOrEditWin : false,
        setRoleRole : false,
        setRoleRight : false,
        setRoleAllotRight : false,
        copyWin : false,
        readonly:false,
        isRequired:true,
        showPartAcct:false,
        //给按钮增加权限
        authObj : {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true, //角色信息下载
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            width:60,
            align: 'center',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.balanceType"),
            key: "balanceType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BalanceType", params.row.balanceType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.sumBillsMoney"),
            key: "sumBillMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.sumBillMoney, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.pc.sumNoReturnMoney"),
            key: "sumNoturnMoney",
            sortable: true,
            hiddenCol: true,
            render: (h, params) => {
              let sumNoturnMoney = formatNumber(params.row.sumNoturnMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: sumNoturnMoney
                }
              }, sumNoturnMoney);
            }
          },
          {
            title: this.$t("m.i.pc.averageBalanceMonth"),
            key: "averageBalanceMonth",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.averageBalanceMonth, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.pc.averageBalanceYear"),
            key: "averageBalanceYear",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.averageBalanceYear, 2, ','))
              ]);
            }
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false,
            sortable: true
          }
        ],
        histData : {rows:[],
          total:1},
        traderData : {rows:[],
          total:1},
        userTraderWin : false,
        showDefaultTeller : false,
        branchDto : {},
        currentSelectRow : [],
        traderSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        balanceTypeList: [],
        ifShowMore : false,
        tempInx : 0,
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        brchRoleDistributeWin : false,
        userHistWin : false,

        defaultTraderNo : null,

        showBranchMenuWin : false,
        submitCopyRoleDisabled : false,

        numberRule : ['num'],
        deletDisabled : false,
        kindTree : [],
        submitFlag : false,
        schemeIdList : [],
        reqUrl : '/pc/acct/balanceReg',
        selectexport : [],
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
      };

    },
    components: {

    },
    mounted() {
      this.getShowPartAcct();
      this.getDictListByGroups("BalanceType").then(res => {
        this.balanceTypeList = res.get("BalanceType");
        this.dictMap = res.get("map");
      });
    },
    methods:{
      getShowPartAcct() {
        let paramKey = "be.trust.prsnttn_part_acct";
        post({ paramKey :paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let param = res.data.retData;
              this.showPartAcct = param === "1";
              if(this.showPartAcct){
                this.$nextTick(() => {
                  this.columns.forEach(element => {
                    if (element.key === "sumBillMoney") {
                      element.hiddenCol = false;
                    } else if (element.key === "sumNoturnMoney") {
                      element.hiddenCol = false;
                    }
                  });
                });
              }
            } else {
              this.showPartAcct = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.$refs.formItem.resetFields();
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'indexSumCurrentlyBalanceReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/acct/balance/indexSumCurrentlyBalance/func_exportCurrentlySumBalanceRegister";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            json: JSON.stringify(this.$refs.datagrid.selects)
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

    },

    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    }
  };
</script>
