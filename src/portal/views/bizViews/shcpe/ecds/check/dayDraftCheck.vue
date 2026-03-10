<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.bankNo')" prop="bankNo">
                  <h-input v-model="formItem.bankNo" placeholder=""></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.common.checkDt')" prop="draftCheckDt">
                  <h-date-picker :value="formItem.draftCheckDt" type="date" v-model="formItem.draftCheckDt"
                                 :editable=false :showFormat=true @on-change="handleDateChange" placeholder=""></h-date-picker>
                </h-form-item>

                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/shcpe/ecds/check/dayDraftCheck/func_pagingQueryDayDraftCheckMsg"
                      :bindForm="formItem"
                      ref="datagrid">
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import {
    post,
    on,
    off,
    getDictListByGroups,
    getDictValueFromMap
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "dayDraftCheck",
    data() {
      return {
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.bankNo'),
            key: "bankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.checkDt'),
            key: "draftCheckDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = this.$moment(params.row.draftCheckDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },

          {
            title: this.$t('m.i.shcpe.sendNum'),
            key: "sendNum",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.sendDifNum'),
            key: "sendDifNum",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.rcvNum'),
            key: "rcvNum",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.rcvDifNum'),
            key: "rcvDifNum",
            hiddenCol: false,
            sortable: true
          }
        ],
        formItem: {
          bankNo: "",
          draftCheckDt: ""
        },
        deletDisabled: false,
        tableRef: "selfTable",
        ifShowMore: false
      };
    },
    watch: {},

    computed: {},
    methods: {

      handleDateChange(value) {
        this.formItem.draftCheckDt = value.replace(/-/g, "");
      },

      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      }
    },
    mounted() {
      getDictListByGroups("").then(res => {
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
