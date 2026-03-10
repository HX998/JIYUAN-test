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
                <h-form-item :label="$t('m.i.common.checkDt')" prop="summryDt">
                  <h-date-picker :value="formItem.summryDt" type="date" v-model="formItem.summryDt" :editable=false
                                 :showFormat=true @on-change="handleDateChange" placeholder=""></h-date-picker>
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
                      url="/shcpe/ecds/check/monthDraftCheck/func_pagingQueryMonthDraftCheckSum"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="draftCheck()">{{$t("m.i.shcpe.draftCheck")}}</h-button>
              <h-button type="primary" @click="acptDetail()">{{$t("m.i.shcpe.acptDetail")}}</h-button>
              <h-button type="primary" @click="hldrDetail()">{{$t("m.i.shcpe.hldrDetail")}}</h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <acpt-detail :acptDetailWin="acptDetailWin" @acptDetailClose="acptDetailClose"
                 :id="this.id"></acpt-detail>

    <hldr-detail :hldrDetailWin="hldrDetailWin" @hldrDetailClose="hldrDetailClose"
                 :id="this.id"></hldr-detail>

  </div>
</template>

<script>
  import {
    post,
    on,
    off
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "monthDraftCheck",
    components: {
      AcptDetail: () => import(/* webpackChunkName: "shcpe/ecds/check/acptDetail" */`@/views/bizViews/shcpe/ecds/check/acptDetail`),
      HldrDetail: () => import(/* webpackChunkName: "shcpe/ecds/check/hldrDetail" */`@/views/bizViews/shcpe/ecds/check/hldrDetail`)
    },
    data() {
      return {
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
            title: this.$t('m.i.common.bankNo'),
            key: "bankNo",
            hiddenCol: false,
            sortable: true
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
            title: this.$t('m.i.shcpe.acptDifNum'),
            key: "acptDifNum",
            hiddenCol: false,
            sortable: true
          },

          {
            title: this.$t('m.i.shcpe.hldrDifNum'),
            key: "hldrDifNum",
            hiddenCol: false,
            sortable: true

          }
        ],

        formItem: {
          bankNo: "",
          summryDt: ""
        },
        deletDisabled: false,
        ifShowMore: false,
        acptDetailWin: false,
        hldrDetailWin: false,
        id: ""
      };
    },
    watch: {},

    computed: {},
    methods: {
      acptDetail() {
        let row = this.currentSelectRow;
        if (row != null && row.length !== 0) {
          this.id = row.id;
          this.acptDetailWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      hldrDetail() {
        let row = this.currentSelectRow;
        if (row != null && row.length !== 0) {
          this.id = row.id;
          this.hldrDetailWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },

      draftCheck() {

        post({}, "/shcpe/ecds/check/monthDraftCheck/func_monthDraftCheckAppl").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      acptDetailClose() {
        this.acptDetailWin = false;
      },

      hldrDetailClose() {
        this.hldrDetailWin = false;
      },

      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
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
      this.getDictListByGroups("").then(res => {
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
