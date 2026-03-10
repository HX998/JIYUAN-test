<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="acptTopBankNo" label="同业客户行号">
                  <h-input v-model="formItem.acptTopBankNo" placeholder="" icon="android-search" @on-click="queryAcptTopBankInfo()"
                           readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.custName')" prop="acptTopBankNameLike">
                  <h-input v-model="formItem.acptTopBankNameLike" placeholder="" :maxlength="150"></h-input>
                </h-form-item>
                <query-btn v-on:showChange="showQry" :advanceShow="false" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            :row-select="true"
            :has-select="false"
            highlightRow
            url="/banks/szbank/pl/inpoolLimit/acptInPoolLimitForQuery/func_pagingQueryAcptInPoolLimitInfos"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <show-head-bank :showHeadBankWin="showHeadBankWin" @headBankSelect="headBankSelect" @showHeadBankWinClose="showHeadBankWinClose"></show-head-bank>

    <show-acpt-in-pool-limit-usage-detail :showUsageDetailWin="showUsageDetailWin" :acptTopBankNo="acptTopBankNo" :searchUrl="searchUrl"
                                          @showUsageDetailWinClose="showUsageDetailWin=!showUsageDetailWin"></show-acpt-in-pool-limit-usage-detail>
  </div>

</template>

<script>
import { formatNumber } from "@/api/bizApi/commonUtil";

export default {
  name:"acptInPoolLimitForQuery",
  data(){
    return {
      formItem:{
        acptTopBankNo:"",
        acptTopBankNameLike:"",
        activeFlag:"1"
      },
      ifShowMore:false,
      showHeadBankWin:false,
      columns:[
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
          align: "center"
        },
        {
          title: "同业客户行号",
          key:"acptTopBankNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.shcpe.custName'),
          key:"acptTopBankName",
          hiddenCol:false
        },
        {
          title: "入池限额(元)",
          key:"inpoolLimitAmtStr",
          hiddenCol:false,
          render: (h, params) => {
            let inpoolLimitAmt = formatNumber(params.row.inpoolLimitAmtStr, 2, ',');
            return h("span", {
              domProps: {
                title: inpoolLimitAmt
              }
            }, inpoolLimitAmt);
          }
        },
        {
          title: "额度使用详情",
          key: "guarntrNo",
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.showAcptInPoolLimitUsedInfo(params.row.acptTopBankNo);
                }
              }
            }, '查看');
          }
        }
      ],
      acptTopBankNo:"",
      showUsageDetailWin:false,
      searchUrl:"/banks/szbank/pl/inpoolLimit/acptInPoolLimitForQuery/func_queryAcptInpoolLimitUsedInfo",
      operDisabled:false,
    }
  },
  components:{
    ShowHeadBank: () => import(/* webpackChunkName: "banks/szbank/pl/inpoolLimit/showHeadBank" */`@/views/bizViews/banks/szbank/pl/inpoolLimit/showHeadBank`),
    ShowAcptInPoolLimitUsageDetail: () => import(/* webpackChunkName: "banks/szbank/pl/inpoolLimit/showAcptInPoolLimitUsageDetail" */`@/views/bizViews/banks/szbank/pl/inpoolLimit/showAcptInPoolLimitUsageDetail`),
  },
  methods:{
    showQry(val){
      this.ifShowMore = val;
    },
    queryAcptTopBankInfo(){
      this.showHeadBankWin=true;
    },
    headBankSelect(data){
      this.formItem.acptTopBankNo=data.memberBankNo;
      this.formItem.acptTopBankNameLike=data.memberBankName;
      this.showHeadBankWinClose();
    },
    showHeadBankWinClose(){
      this.showHeadBankWin=false
    },
    handleSearch(){
      this.$refs.datagrid.dataChange(1);
      this.$refs.datagrid.selects=[];
      this.$refs.datagrid.selectIds=[];
    },
    resetSearch(){
      this.formItem.acptTopBankNo="";
      this.formItem.acptTopBankNameLike="";
    },
    // 查看承兑行入池限额使用情况
    showAcptInPoolLimitUsedInfo(acptTopBankNo){
      this.acptTopBankNo=acptTopBankNo;
      this.showUsageDetailWin=true;
    }
  },
}

</script>
