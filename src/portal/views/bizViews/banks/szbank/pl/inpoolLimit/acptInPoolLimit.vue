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
                  <h-input v-model="formItem.acptTopBankNo" placeholder="" icon="android-search" @on-click="queryAcptTopBankInfo('formItemSearch')"
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
            url="/banks/szbank/pl/inpoolLimit/acptInPoolLimit/func_pagingQueryAcptInPoolLimitInfos"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="addAcptInPoolLimit">新增</h-button>
              <h-button type="primary" @click="updateAcptInPoolLimit">修改</h-button>
              <h-button type="primary" @click="delAcptInPoolLimit">删除</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">导出</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 明细导出 -->
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                               :rows="this.rows"></common-excel-download>
        <show-head-bank :showHeadBankWin="showHeadBankWin" @headBankSelect="headBankSelect" @showHeadBankWinClose="showHeadBankWinClose"></show-head-bank>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="editWinClose">
      <p slot="header">
        <span v-if="optType==='add'">新增入池承兑行名单</span>
        <span v-if="optType==='modify'">修改入池承兑行名单</span>
      </p>
      <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
        <h-form-item prop="acptTopBankNo" label="同业客户行号" required>
          <h-input v-if="optType==='add'" v-model="addForm.acptTopBankNo" placeholder="" icon="android-search" @on-click="queryAcptTopBankInfo('addFormQuery')"
                   readonly></h-input>
          <h-input v-else v-model="addForm.acptTopBankNo" placeholder="" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.shcpe.custName')" prop="acptTopBankName" required>
          <h-input v-model="addForm.acptTopBankName" placeholder="" readonly></h-input>
        </h-form-item>

        <!--票据金额-->
        <common-type-field v-model="addForm.inpoolLimitAmt" label="入池限额(元)" integerNum="16"
                           prop="inpoolLimitAmt" required></common-type-field>
      </h-form>

      <div slot="footer">
        <h-button type="ghost" @click="editWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{ $t("m.i.common.commit") }}</h-button>
      </div>
    </h-msg-box>

    <show-acpt-in-pool-limit-usage-detail :showUsageDetailWin="showUsageDetailWin" :acptTopBankNo="acptTopBankNo" :searchUrl="searchUrl"
        @showUsageDetailWinClose="showUsageDetailWin=!showUsageDetailWin"></show-acpt-in-pool-limit-usage-detail>
  </div>

</template>

<script>
  import { post, formatNumber, exportList } from "@/api/bizApi/commonUtil";

  export default {
    name:"acptInPoolLimit",
    data(){
      return {
        formItem:{
          acptTopBankNo:"",
          acptTopBankNameLike:"",
          operStatusList:["02","03","05","06","08"]
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
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        addOrEditWin:false,
        addForm:{
          acptTopBankNo:"",
          acptTopBankName:"",
          inpoolLimitAmt:"",
          id:""
        },
        optType:"",
        submitFlag:false,
        queryTopBankType:"",
        acptTopBankNo:"",
        showUsageDetailWin:false,
        searchUrl:"/banks/szbank/pl/inpoolLimit/acptInPoolLimit/func_queryAcptInpoolLimitUsedInfo"
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
      queryAcptTopBankInfo(queryType){
        this.queryTopBankType=queryType;
        this.showHeadBankWin=true;
      },
      headBankSelect(data){
        if (this.queryTopBankType==='formItemSearch'){
          this.formItem.acptTopBankNo=data.memberBankNo;
          this.formItem.acptTopBankNameLike=data.memberBankName;
        }else {
          this.addForm.acptTopBankNo=data.memberBankNo;
          this.addForm.acptTopBankName=data.memberBankName;
        }
        this.showHeadBankWinClose();
      },
      showHeadBankWinClose(){
        this.queryTopBankType="";
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
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = "szbankAcptInPoolLimitDataInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/banks/szbank/pl/inpoolLimit/acptInPoolLimit/func_exportExcel";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      addAcptInPoolLimit(){
        this.optType="add";
        this.addOrEditWin=true;
      },
      updateAcptInPoolLimit(){
        if (this.$refs.datagrid.selects.length === 0 || this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let selectData=this.$refs.datagrid.selects[0];
        this.addForm.id=selectData.id;
        this.addForm.acptTopBankNo=selectData.acptTopBankNo;
        this.addForm.acptTopBankName=selectData.acptTopBankName;
        this.addForm.inpoolLimitAmt=selectData.inpoolLimitAmtStr;
        this.optType="modify";
        this.addOrEditWin=true;
      },
      delAcptInPoolLimit(){
        let selectIds= this.$refs.datagrid.selectIds;
        if (selectIds.length<1){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            post({ids:selectIds}, "/banks/szbank/pl/inpoolLimit/acptInPoolLimit/func_deleteAcptInPoolLimit").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      editWinClose(){
        this.optType="";
        this.addForm.acptTopBankName="";
        this.addForm.acptTopBankNo="";
        this.addForm.inpoolLimitAmt="";
        this.addForm.id="";
        this.$refs.addForm.resetFields();
        this.addOrEditWin=false;

      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.optType === "add" ? "/banks/szbank/pl/inpoolLimit/acptInPoolLimit/func_addAcptInPoolLimit" : "/banks/szbank/pl/inpoolLimit/acptInPoolLimit/func_updateAcptInPoolLimit";
            let params = this.addForm;
            post(params, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.editWinClose();
                  let pageNo = this.optType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
    },
  }

</script>
