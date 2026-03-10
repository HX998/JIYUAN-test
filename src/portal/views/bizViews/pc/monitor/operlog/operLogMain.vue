<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo">
                  <h-input v-model="formItem.legalNo"></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.common.brchNo')" prop="operBrchNo">
                  <h-input v-model="formItem.operBrchNo" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.tellerNo')" prop="operTellerNo">
				  <h-input v-model="formItem.operTellerNo" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                     <h-input v-model="formItem.batchNo" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                      <h-input v-model="formItem.billNo" ></h-input>
                </h-form-item>
				<h-form-item :label="$t('m.i.pc.operMsg')" prop="operMsg">
                     <h-input v-model="formItem.operMsg" ></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
            </h-form>
          </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pc/monitor/operlog/operLogMain/func_pagingQueryOperLog"
                      :bindForm="formItem"
                      ref="datagrid">
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import {post, on, off, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";


  export default {
    name: "operLogMain",
    data(){
      return {
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.legalNo"),
            key: "legalNo",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.common.operBrchNo"),
            key: "operBrchNo",
            hiddenCol: false,

          },
          {
            title:  this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.pc.operMsg"),
            key: "operMsg",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.pkValue"),
            key: "pkValue",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.prodNo"),
            key: "prodNo",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.pc.operDtTm"),
            key: "operDtTm",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.operDtTm ==null){
                return null;
              }
              let date = this.$moment(params.row.operDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          },

        ],
        formItem : {
          legalNo : '',
          operBrchNo:'',
          operTellerNo:'',
          batchNo:'',
          billNo:'',
          operMsg:''
        },
        dictMap : new Map(),
        ifShowMore : false,
      };
    },
    methods :{


      unDisabled(){
        this.deletDisabled=false
      },
      formSearch() {
        this.unDisabled()
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
