<template>
  <div class="layout">
    <h-msg-box v-model="tempImageWin" width="1000" @on-close="handleClose()" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>{{ title }}</span>
      </p>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--数据展示表格-->
            <h-datagrid
              :columns="columns"
              highlight-row
              getDataFunc
              :autoLoad="false"
              @get-data="queryHistData"
              :gridData="histData"
              :onRowClick="handlelRowClick"
              :onSelectChange="handleSelectClick"
              ref="datagrid">
            </h-datagrid>

          </div>
        </h-col>
      </h-row>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      </div>

    </h-msg-box>
  </div>
</template>

<script>
import {post, on, off} from "@/api/bizApi/commonUtil";

export default {
  name: "riskCompanyWhiteRollHist",
  components: {},
  props: {
    title: String,
    whiteId: [String, Number],
    showHistWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
  },
  data() {
    return {
      columns: [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          key: "xuhao",
          align: "center"
        },
        {
          title: 'ID',
          key: "id",
          hiddenCol: true,
        },
        {
          title: this.$t("m.i.pc.whiteBusiType"),
          key: "companyWhiteBusiType",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CompanyWhiteBusiType", params.row.companyWhiteBusiType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.common.custNo"),
          key: "custNo",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custMgrNo"),
          key: "custMgrNo",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custMgrName"),
          key: "custMgrName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: "客户经理手机号",
          key: "phoneNo",
          width: 130,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pc.riskRemark"),
          key: "riskRemark",
          hiddenCol: false
        },


        {
          title: this.$t("m.i.pc.applTellerName"),
          key: "operTellerName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.updateTime"),
          key: "operDtTm",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let operDtTm = params.row.operDtTm == null ? "" : this.$moment(params.row.operDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", {domProps: {title: operDtTm}}, operDtTm);
          }
        },
        {
          title: this.$t("m.i.pc.checkTellerName"),
          key: "checkTellerName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.checkDtTm"),
          key: "checkDtTm",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let checkDtTm = params.row.checkDtTm == null ? "" : this.$moment(params.row.checkDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", {domProps: {title: checkDtTm}}, checkDtTm);
          }
        },
        {
          title: this.$t("m.i.common.operStatus"),
          key: "operStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "RiskOperStatus", params.row.operStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
      ],
      //给按钮增加权限
      authObj: {
        bizSetRoleAdd: true, //角色添加
        bizSetRoleDelete: true, //角色删除
        bizSetRoleORight: true, //角色操作权限
        bizSetRoleARight: true, //角色授权权限
        bizRoleRightSet: true, //角色权限处理
        bizRoleRightCopy: true, //角色权限复制
        bizSetRoleDownload: true, //角色信息下载
      },
      operStatusList: [],
      companyWhiteBusiType: '',
      // 是否显示新增或修改窗口
      type: null,
      readonly: false,
      isRequired: true,
      tableRef: "selfTable",
      histData: {rows: [], total: 1},
      submitWin: false,
      custTypes: [],
      brchClassList: [],
      dictMap: new Map(),
    };
  },
  watch: {
    showHistWin(val) {
      this.$nextTick(() => {
        if (val == true) {
          this.getDictListByGroups("CompanyWhiteBusiType,BrchType,BrchClass,RiskOperStatus").then(res => {
            this.companyWhiteBusiType = res.get("CompanyWhiteBusiType");
            this.dictMap = res.get("map");
          });
          this.queryHistData();
        }
      })
    }

  },
  methods: {
    addFormReset() {
      this.$refs.addForm.resetFields();
      this.addForm.id = '';
    },
    handlelRowClick(arr) {
      this.currentSelectRow = arr;
    },
    handleSelectClick(arr, selectInx) {
      this.unDisabled()
      this.currentSelectList = arr;
      this.currentSelectRowInx = selectInx
      if (arr.length === 0) return
    },
    unDisabled() {
      this.deletDisabled = false
    },
    formSearch() {
      this.unDisabled()
      this.currentSelectRow = [];
      this.currentSelectList = [];
      this.$refs.datagrid.dataChange(1);
    },
    handleClose() {
      this.$emit("showHistWinClose", "");
    },

    queryHistData() {
      let json = {
        id: this.whiteId,
        pageNo: this.$refs.datagrid.pageInfo.pageNo,
        pageSize: this.$refs.datagrid.pageInfo.pageSize
      };
      post(json, 'pc/risk/companyWhite/riskCompanyWhiteRollHist/func_queryRiskCompanyWhiteHisByCompanyWhiteId').then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.histData = res.data.retData;
            } else {
              // 查询失败
              // this.submitMsg = "查询失败";
              this.$msgTip.error(this, {info: res.data.retMsg})
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
          }
        }
      )
    }

  },
  computed: {
    tempImageWin: {
      get() {
        return this.showHistWin;
      },
      set() {
      }
    }
  },

};
</script>

<style scoped>

</style>
