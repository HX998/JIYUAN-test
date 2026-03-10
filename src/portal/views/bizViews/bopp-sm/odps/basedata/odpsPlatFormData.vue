<!--平台信息查询-->
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
                <common-input v-model="formItem.platformNo" :label="$t('s.i.odps.platformNo')" prop="platformNo"></common-input>
                <query-btn :formSearch="formSearch" :formSearchReset="formSearchReset" :advanceShow='false'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/sm/odps/basedata/odpsPlatFormData/func_queryPlatFormDataList"
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
    name: "odpsPlatFormData",
    data() {
      return {
        ifShowMore: false,
        formItem: {
          platformNo: ""
        },
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('s.i.odps.platformNo'),
            key: "platformNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.platformName'),
            key: "platformName",
            hiddenCol: false,
            ellipsis: false,
            sortable: false
          },
          {
            title: this.$t('s.i.odps.platformFullName'),
            key: "platformFullName",
            hiddenCol: false
          },
          {
            title: this.$t('s.i.odps.socCode'),
            key: "socCode",
            hiddenCol: false,
            sortable: true
          }

        ],
      };
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      }
    }
  };
</script>
