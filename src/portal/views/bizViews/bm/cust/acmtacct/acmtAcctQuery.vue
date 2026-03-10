<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNameList" :label="$t('m.i.common.brchName')" prop="brchNameList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.brchNoList" :brchName.sync="formItem.brchNameList"></show-branch>
                <h-form-item :label="$t('m.i.bs.custName')" prop="custNameLike">
                  <h-input v-model="formItem.custNameLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.socCode')" prop="socCodeLike" class="h-form-long-label">
                  <h-input v-model="formItem.socCodeLike" :maxlength=18 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNoLike">
                  <h-input v-model="formItem.custAcctNoLike" :maxlength=32 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctType')" prop="acctType">
                  <h-select v-model="formItem.acctType" placeholder="">
                    <h-option v-for="item in acmtAcctTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bm/cust/acmtacct/acmtAcctQuery/func_queryAcmtInfo"
            :bindForm="formItem"
            :row-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()" >{{$t('m.i.common.export')}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <acmt-auth-list :acmtAuthListWin="acmtAuthListWin" @acmtAuthListWinClose="acmtAuthListWinClose" :propAuthList="this.propAuthList"></acmt-auth-list>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import {post, on, off, getMoreParamValuesByKeys, exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "acmtAcctQuery",
    components: {
      AcmtAuthList:()=>import(/* webpackChunkName: 'bm/cust/acmtacct/acmtAuthList' */`@/views/bizViews/bm/cust/acmtacct/acmtAuthList`),
    },
    data() {
      return {
        acmtAcctTypeList: [],
        distTypeList: [],
        acmtOperStatusList: [],
        acmtOperTypeList: [],
        auditMode: true,
        acmtAuthListWin: false,
        tempShowExcelTemplateWin: false,
        propAuthList:[],
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        param: null,
        rows: null,
        formItem: {
          brchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          custName: '',
          socCode: '',
          custAcctNo: '',
          custNameLike: '',
          socCodeLike: '',
          custAcctNoLike: '',
          acctType: '',
          operType: '',
          status: '',
        },
        dictMap: new Map(),

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
            key: "xuhao",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: 'ID',
            key: "id",
            hiddenCol: true,
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.socCode'),
            key: "socCode",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: "custAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctName'),
            key: "acctName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctType'),
            key: "acctType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtAcctTypeCode", params.row.acctType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.distType'),
            key: "distType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DistTypeCode", params.row.distType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.openBrchCode'),
            key: "openBrchCode",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.common.openBrchName'),
            key: "openBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.busiChannelCode'),
            key: "memberId",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctAuthList'),
            key: "acctAuthList",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showAuthList(params.row.acctAuthList);
                  }
                }
              }, "权限清单");
            }

          },
          {
            title: this.$t('m.i.common.rgstName'),
            key: "rgstName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.rgstBrchCode'),
            key: "rgstBrchCode",
            sortable: true,
            hiddenCol: false
          },

        ],
        currentSelectList: [],
        type: null,
        readonly: false,
        isRequired: true,
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        //brchCodeWin: false,
        submitWin: false,
        showCpesMemberWin: false,
        brchCodeWin: false,
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
      };
    },
    mounted() {
      this.getDictListByGroups("AcmtAcctTypeCode,AcmtOperStatusCode,AcmtOperTypeCode,DistTypeCode").then(res => {
        this.acmtAcctTypeList = res.get("AcmtAcctTypeCode");
        this.acmtOperStatusList = res.get("AcmtOperStatusCode")
        this.acmtOperTypeList = res.get("AcmtOperTypeCode");
        this.distTypeList = res.get("DistTypeCode");
        this.dictMap = res.get("map");
      });


    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },

      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.brchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.brchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      },

      handlelRowClickBill(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handlelRowClickBillCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "acmtAcctQueryExportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/bm/cust/acmtacct/acmtAcctQuery/func_exportExcel";
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params.ids = this.$refs.datagrid.selectIds;
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

      showAuthList(acctAuthList){
        this.propAuthList= acctAuthList.toString().split("|");
        this.acmtAuthListWin = true;
      },
      acmtAuthListWinClose (){
        this.acmtAuthListWin = false;
      },


    }

  };
</script>

<style scoped>

</style>
