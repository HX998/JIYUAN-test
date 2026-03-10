<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.whiteBusiType')" prop="companyWhiteBusiType">
                  <h-select v-model="formItem.companyWhiteBusiType" placeholder=" ">
                    <h-option v-for="item in companyWhiteBusiTypes" :value="item.key" :key="item.key">{{
                        item.value
                      }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custNameLike">
                  <h-input v-model="formItem.custNameLike" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{ $t('m.i.common.search') }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t('m.i.common.reset') }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="pc/risk/companyWhite/riskCompanyWhiteRollView/func_queryRiskCompanyWhiteRollInfoPage"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            :row-select="true"
            :has-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportForm()" v-if="authObj.bizSetRoleAdd">
                {{ $t('m.i.common.export') }}
              </h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
import {post, on, off} from "@/api/bizApi/commonUtil";

export default {
  name: "riskCompanyWhiteRollView",
  components: {},
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: false
        },
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
          sortable: true
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          hiddenCol: false,
          sortable: true
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
          hiddenCol: false,
          sortable: true,
        },

        {
          title: this.$t("m.i.pc.riskRemark"),
          key: "riskRemark",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.newUpdateTime"),
          key: "operDtTm",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let operDtTm = params.row.operDtTm == null ? "" : this.$moment(params.row.operDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", {domProps: {title: operDtTm}}, operDtTm);
          }
        }
      ],
      formItem: {
        companyWhiteBusiType: "",
        custNameLike: ''
      },
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
      // 是否显示新增或修改窗口
      readonly: false,
      isRequired: true,
      deletDisabled: false,
      ifShowMore: false,
      companyWhiteBusiTypes: [],
      dictMap: new Map(),
    };
  },
  methods: {
    handlelRowClick(arr) {
      this.currentSelectRow = arr;
    },
    handleSelectClick(arr, selectInx) {
      this.unDisabled()
      this.currentSelectList = arr;
      this.currentSelectRowInx = selectInx
      if (arr.length == 0) return
    },
    unDisabled() {
      this.deletDisabled = false
    },
    formSearch() {
      this.unDisabled()
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
    },
    exportForm() {
      if (this.$refs.datagrid.selectIds.length !== 0) {
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/companyWhite/exportExcel";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        form.innerHTML = `<input type="text" name="ids" value="${this.$refs.datagrid.selectIds}"/>
                            <input type="text" name="companyWhiteBusiType" value="${this.formItem.companyWhiteBusiType}"/>
                            <input type="text" name="custNameLike" value="${this.formItem.custNameLike}"/>`
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      } else {
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/companyWhite/exportExcel";
        let form = document.createElement("form");
        for (let obj in this.formItem) {
          if (this.formItem.hasOwnProperty(obj)) {
            let input = document.createElement('input')
            input.tpye = 'text'
            input.name = obj;
            input.value = this.formItem[obj];
            form.appendChild(input)
          }
        }
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    },
  },

  mounted() {
    this.getDictListByGroups("CompanyWhiteBusiType,BrchType,BrchClass,RiskOperStatus").then(res => {
      this.companyWhiteBusiTypes = res.get("CompanyWhiteBusiType");
      this.dictMap = res.get("map");
    });
  }
};
</script>

<style scoped>

</style>
