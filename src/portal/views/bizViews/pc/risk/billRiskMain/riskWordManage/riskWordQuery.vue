<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.riskObject')" prop="riskObj">
                  <h-select v-model="formItem.riskObj" placeholder="" showTitle>
                    <h-option v-for="item in riskObjList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.remindRiskWord')" prop="remindRiskWord">
                  <h-input v-model="formItem.remindRiskWord" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.banRiskWord')" prop="banRiskWord">
                  <h-input v-model="formItem.banRiskWord" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_queryRiskWordPassPage"
            :bindForm="formItem"
            :row-select="true"
            :has-select="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="excelExport">{{$t('m.i.common.export')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- excel导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import {exportList} from "@/api/bizApi/commonUtil";
  export default {
    name: "riskWordQuery",
    data() {
      return {
        downLoadUrl: "/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_exportRiskWordExcel",
        param: '',
        rows: null,
        ifShowMore: false,
        tempShowExcelTemplateWin: false,
        dictMap: new Map(),
        operStatusList: [],
        riskObjList: [],
        operTypeList: [],
        riskLevelList: [],
        formItem: {
          riskObj: "",
          remindRiskWord: '',
          banRiskWord: ''
        },
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
            title: this.$t("m.i.pc.riskObject"),
            key: "riskObj",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'RiskObjCode', params.row.riskObj);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.remindRiskWord"),
            key: "remindRiskWord",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pc.banRiskWord"),
            key: "banRiskWord",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pc.createUser"),
            key: "createTellerNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.createTime"),
            key: "createTimeStr",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.newUpdateTime"),
            key: "updateTimeStr",
            hiddenCol: false
          }
        ],
      }
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.datagrid.selects = [];
        this.formItem.riskObj = '';
        this.formItem.remindRiskWord = '';
        this.formItem.banRiskWord = '';
        this.$refs.formItem.resetFields();
      },
      //excel导出
      excelExport() {
        this.param = 'riskWordInfoExport';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + this.downLoadUrl;
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
    },
    mounted() {
      this.getDictListByGroups("OperStatusCode,RiskObjCode,OperTypeCode,RiskLevel").then(res => {
        this.operStatusList = res.get("OperStatusCode");
        this.riskObjList = res.get("RiskObjCode");
        this.operTypeList = res.get("OperTypeCode");
        this.riskLevelList = res.get("RiskLevel");
        this.dictMap = res.get("map");
      })
    }
  }
</script>

<style scoped>

</style>
