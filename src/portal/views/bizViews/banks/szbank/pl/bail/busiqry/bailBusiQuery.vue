<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNoList" :label="$t('m.i.common.brchName')" prop="brchNoList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.brchNoList" :brchName.sync="formItem.brchNameList"></show-branch>
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')">
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustMessage()"
                           readonly></h-input>
                </h-form-item>
                <cust-acct-no :formItem = "formItem" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no>
                <query-btn v-on:showChange="showQry" :advanceShow="false" :formSearch='handleSearch' :formSearchReset='resetSearch'></query-btn>
              </h-form>
            </h-panel>
          </div>

          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item label="汇总保证金金额(元)" class="h-form-long-label">
                    <h-input v-model="sumBailMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            rowSelect
            :hasSelect = false
            get-data-func
            @get-data="getBailAcctDataList"
            :gridData="gridData"
            :bindForm="formItem"
            :auto-load="false"
            paramId="bailAcctId"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportDetail')}}</h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="formItem.custNo" :isAllBankAcct=true
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!-- 明细导出 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import {post, formatNumber, exportList} from "@/api/bizApi/commonUtil";

  export default {
    name:"bailBusiQuery",
    data(){
      return {
        ifShowMore:false,
        showCustMessageWin:false,
        showCustAcctNoWin:false,
        formItem:{
          brchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          custNo:"",
          custAcctNo:"",
          custName:""
        },
        gridData : {},
        sumBailMoney : "", // 汇总保证金金额
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
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pl.billBailAcctNo"),
            key: "billBailAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: "保证金金额(元)",
            key: "bailAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let bailAmt = formatNumber(params.row.bailAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: bailAmt
                }
              }, bailAmt);
            }
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false,
            sortable: true
          },
        ],
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
      }
    },
    methods:{
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      showQry(val){
        this.ifShowMore = val;
      },
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.selectIds=[];
      },
      //重置查询结果
      resetSearch() {
        this.formItem.brchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.brchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.custNo = "";
        this.formItem.custName="";
        this.formItem.custAcctNo="";
      },
      getBailAcctDataList() {
        let params = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize
        });
        post(params, "/banks/szbank/pl/bail/busiqry/bailBusiQuery/func_pagingQueryBailInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.gridData = res.data.retData;
              this.sumBailMoney = res.data.retData.pageInfo.sumMoney === null ? "0.00" : formatNumber(res.data.retData.pageInfo.sumMoney, 2, ",");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = "szbankBailBusiDataInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/banks/szbank/pl/bail/busiqry/bailBusiQuery/func_exportExcel";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            bailAcctIdList: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
    },
    mounted() {
      this.getBailAcctDataList();
    },
  }
</script>
