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
                <common-select v-model="formItem.comdataDataType" :dictList="this.comdataDataTypeList"
                               :label="$t('s.i.odps.comdataTypeCode')" prop="comdataDataType"></common-select>
                <common-input v-model="formItem.comdataDataName" :label="$t('s.i.odps.comdataName')" prop="comdataDataName"></common-input>
                <query-btn :formSearch="formSearch" :formSearchReset="formSearchReset" :advanceShow='false'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/sm/odps/basedata/odpsCommonData/func_queryBaseDataList"
            :bindForm="formItem"
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
    name: "odpsCommonData",
    data() {
      return {
        ifShowMore: false,
        formItem: {
          comdataDataType: "",
          comdataDataName: ""
        },
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('s.i.odps.comdataTypeCode'),
            key: "comdataDataType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "OdpsCmonDtTpCode", params.row.comdataDataType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('s.i.odps.comdataName'),
            key: "comdataDataName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.comdataDataCode'),
            key: "comdataDataCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.comdataDataValue'),
            key: "currentComdataValue",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.activeDt'),
            key: "activeDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.activeDt ? this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('s.i.odps.postscript'),
            key: "remark",
            hiddenCol: false
          }
        ],
        comdataDataTypeList : [],
        dictMap: new Map()
      };
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      }
    },
    mounted() {
      this.$nextTick(()=>{
      this.getDictListByGroups("OdpsCmonDtTpCode,OdpsCmonDtFctvTpCode").then(res => {
        this.comdataDataTypeList = res.get("OdpsCmonDtTpCode");
        this.dictMap = res.get("map");
      });
      });
    }
  };
</script>
