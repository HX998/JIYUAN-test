<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="acctBrchNos"
                             title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.brchNameList">
                </show-branch>

                <h-form-item :label="$t('m.i.pc.warteeName')" prop="warteeName">
                  <h-input v-model="formItem.warteeName" :maxlength=60></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.pc.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
            url="pc/risk/guarntrtrust/guarntrTrustTrace/func_query"
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
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
import {
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  post,
  getBusinessParameter
} from "@/api/bizApi/commonUtil";

export default {
  name: "guarntrTrustTrace",
  components: {},
  data() {
    return {
      downLoadUrl: "/pc/risk/guarntrtrust/guarntrTrustTrace/func_export",
      param: '',
      rows: null,
      ifShowMore: false,
      tempShowExcelTemplateWin: false,
      busiTypeMap: new Map(),
      custTypeMap: new Map(),
      opTypeMap: new Map(),
      busiTypeList:[],
      flowStatusList:[],
      brchNo: "",
      showCustCorpWin: false,
      addForm : false,

      formItem: {
        warteeName: '',
        brchNos: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
        brchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        busiType: "",
        // 只查询生效的数据
        deleteFlag:"0",
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
          title: this.$t("m.i.common.brchName"),
          key: "guarntrName",
          align: "center",
          sortable: true,
        },
        {
          title: this.$t("m.i.pc.busiType"),
          key: "busiType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.busiTypeMap.get(params.row.busiType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.common.custType"),
          key: "custType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.custTypeMap.get(params.row.custType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pc.warteeCustNo"),
          key: 'warteeCustNo',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.pc.warteeName"),
          key: 'warteeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.pc.warteeBrchCode"),
          key: 'warteeBrchCode',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.pc.guarntrAmt"),
          key: "guarntrAmt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ",");
            return h("span", {
              domProps: {
                title: guarntrAmt
              }
            }, guarntrAmt);
          }
        },
        {
          title: this.$t("m.i.common.remark"),
          key: "remark",
          hiddenCol: false,
          sortable: false,
        },
        {
          title: this.$t("m.i.pc.newUpdateTime"),
          key: "updateTime",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.updateTime == null || params.row.updateTime === "") {
              return "";
            }
            let date = this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", date);
          }
        },

      ],
    }
  },
  methods: {
    formSearch() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.formItem.warteeName = "";
      this.formItem.busiType = "";
      this.formItem.brchNos=JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
      this.formItem.brchNameList=JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
    },
    //清单导出
    exportList(field, exportType){
      //exportType: 0-同步 1-异步
      let url = window.LOCAL_CONFIG.API_HOME + this.downLoadUrl;
      if(exportType === "1"){
        let params = null;
        if (this.$refs.datagrid.selectIds.length !== 0) {
          params = { ids: this.$refs.datagrid.selectIds, field: field, exportType: exportType, excelName: this.param};
        }else {
          params = {
            warteeName: this.formItem.warteeName,
            brchNos: this.formItem.brchNos,
            busiType: this.formItem.busiType,
            field: field,
            exportType: exportType,
            excelName: this.param
          };
        }
        post(params, url).then(res => {
          if(res.status === 200 && res.data === null){
            this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          }else if(res.status === 200 && res.data === ""){
            this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          } else{
            this.$msgTip.error(this, { info: "异步导出失败" });
          }
        });
      }else {
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        if (this.$refs.datagrid.selectIds.length !== 0) {
          let input1 = document.createElement('input');
          input1.type = 'text';
          input1.name = 'ids';
          input1.value = this.$refs.datagrid.selectIds;
          form.appendChild(input1);
        } else {
          for (let obj in this.formItem) {
            if (this.formItem.hasOwnProperty(obj)) {
              let input = document.createElement('input');
              input.type = 'text';
              input.name = obj;
              input.value = this.formItem[obj];
              form.appendChild(input)
            }
          }
        }
        let input2 = document.createElement('input');
        input2.type = 'text';
        input2.name = 'field';
        input2.value = field;
        form.appendChild(input2);
        let input3 = document.createElement('input');
        input3.type = 'text';
        input3.name = 'exportType';
        input3.value = exportType;
        form.appendChild(input3);
        let input4 = document.createElement('input');
        input4.type = 'text';
        input4.name = 'excelName';
        input4.value = this.param;
        form.appendChild(input4);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      }
    },
    //excel导出
    excelExport(){
      this.param = 'guarntrTrustInfoExport';
      if (this.$refs.datagrid.selectIds.length !== 0) {
        this.rows = this.$refs.datagrid.selectIds.length;
      }else {
        this.rows = this.$refs.datagrid.total;
      }
      this.tempShowExcelTemplateWin = true;
    },
  },
  mounted() {
    this.getDictListByGroups("CreditCustType,GuarntrTrustFlowStatusCode,GuarntrTrustType,GuarntrTrustOpTypeCode").then(res => {
      this.busiTypeMap = res.get("map").get("GuarntrTrustType");
      this.custTypeMap = res.get("map").get("CreditCustType");
      this.flowStatusMap = res.get("map").get("GuarntrTrustFlowStatusCode");
      this.opTypeMap = res.get("map").get("GuarntrTrustOpTypeCode");
      this.custTypeList = res.get("CreditCustType");
      this.busiTypeList = res.get("GuarntrTrustType");
      this.flowStatusList = res.get("GuarntrTrustFlowStatusCode");
      this.dictMap = res.get("map");
    })
  }
}
</script>

<style scoped>

</style>
