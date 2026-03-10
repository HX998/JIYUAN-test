<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.checkDt')" prop="summryDt">
                  <h-date-picker :value="formItem.summryDt" type="date" v-model="formItem.summryDt" :editable=false
                                 :showFormat=true @on-change="handleDateChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/shcpe/ecds/check/dayDraftCheckDetail/func_pagingQueryDayDraftCheckDetailMsg"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryDayDraftCheckDetail()">{{$t("m.i.common.showDetail")}}</h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--查看报文内容窗口-->

    <h-msg-box v-model="draftContentWin" width="1000" :mask-closable="false"
               @on-close="handleWinClose" :maximize="true">
      <p slot="header">
        <span>{{$t('m.i.shcpe.draftContent')}}</span>
      </p>

      <h-form :model="viewForm" ref="viewForm" :label-width="115" cols="1" class="h-form-search">
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.shcpe.draftContent')" prop="draftContent" class="h-form-height-auto">
            <textarea id="draftCheckDraftContentId" readonly rows="10"
                      style="overflow-y:auto;overflow-x:auto;width: 100%"></textarea>
          </h-form-item>
        </div>

      </h-form>
      <!-- 弹出框模式底部按钮 -->
      <p slot="footer">
        <h-button type="ghost" @click="draftContentWin=!draftContentWin">{{$t("m.i.common.close")}}</h-button>

      </p>

    </h-msg-box>

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
    name: "dayDraftCheckDetail",
    data() {
      return {
        currentSelectRow: [],
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.checkDt'),
            key: "summryDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = this.$moment(params.row.summryDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.msgId'),
            key: "msgId",
            hiddenCol: false,
            sortable: true
          },

          {
            title: this.$t('m.i.shcpe.draftContent'),
            key: "draftContent",
            hiddenCol: false,
            sortable: true

          }
        ],
        formItem: {
          summryDt: ""
        },
        viewForm: {
          draftContent: ""
        },
        deletDisabled: false,
        draftContentWin: false,
        tableRef: "selfTable",
        ifShowMore: false
      };
    },
    watch: {},

    computed: {},
    methods: {
      queryDayDraftCheckDetail() {
        let row = this.currentSelectRow;
        if (row != null && row.length !== 0) {
          this.draftContentWin = true;
          this.$nextTick(() => {
            document.getElementById("draftCheckDraftContentId").innerHTML = row.draftContent;
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },

      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.draftContentWin = false;
      },
      handleDateChange(value) {
        this.formItem.summryDt = value.replace(/-/g, "");
      },

      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.unDisabled();
        this.currentSelectRow = [];
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
