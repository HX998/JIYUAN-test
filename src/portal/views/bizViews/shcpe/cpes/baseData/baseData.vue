<!--基础数据查询-->
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
                <h-form-item :label="$t('m.i.shcpe.comdataTypeCode')" prop="comdataTypeCode">
                  <h-select v-model="formItem.comdataTypeCode" placeholder=" ">
                    <h-option value="CDS00001">交易参数</h-option>
                    <h-option value="CDS00002">运行时段参数</h-option>
                    <h-option value="CDS00003">省份</h-option>
                    <h-option value="CDS00004">机构类别</h-option>
                    <h-option value="CDS00005">机构类型</h-option>
                    <h-option value="CDS00006">机构类型类别关系</h-option>
                    <h-option value="CDS00007">信用等级顺序</h-option>
                    <h-option value="CDS00008">最大数量限制</h-option>
                    <h-option value="CDS00009">再贴现利率</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.comdataName')" prop="comdataName">
                  <h-input v-model="formItem.comdataName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
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
            url="/shcpe/cpes/baseData/baseData/func_queryBaseDataList"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
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
    name: "baseData",
    data() {
      return {
        ifShowMore: false,
        formItem: {
          comdataTypeCode: "",
          comdataName: ""
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
            title: this.$t("m.i.shcpe.comdataTypeCode"),
            key: "comdataTypeName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.comdataName"),
            key: "comdataName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.comdataDataCode"),
            key: "comdataDataCode",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.common.paramValue"),
            key: "currentParamValue",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.shcpe.fieldType"),
            key: "fieldType",
            hiddenCol: false,
            render: (h, params) => {
              let fieldType = params.row.fieldType;
              let info = "";
              if (fieldType == "CT00") {
                info = "日期";
              } else if (fieldType == "CT01") {
                info = "字符串";
              } else if (fieldType == "CT02") {
                info = "金额";
              } else if (fieldType == "CT03") {
                info = "数字";
              } else if (fieldType == "CT04") {
                info = "时间";
              }
              return h("span", info);
            }
          },
          {
            title: this.$t("m.i.common.remark"),
            key: "remark",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        type: null,
        isRequired: true,
        viewDatailWin: false,
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
      }
    }
  };
</script>
