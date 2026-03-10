<!--发票管理-->
<template>
  <div>
    <h-msg-box v-model="tempRelationInvoiceBillWin" width="1000" :mask-closable="false" @on-close="goBack"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div>
        <div class="h-form-search-box">
          <h-form :model="relationBillForm" :label-width="100" ref="relationBillForm" cols="4"
                  class="h-form-search">
            <h-form-item :label="$t('m.i.bm.invoiceNo')" prop="invoiceNo">
              <h-input v-model="relationBillForm.invoiceNo" :maxlength="60"></h-input>
            </h-form-item>
            <h-form-item class="h-form-operate one-form">
              <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </div>
      </div>
      <!--数据展示表格-->
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="columns"
            :url="URL"
            :bindForm="relationBillForm"
            :auto-load="false"
            highlightRow
            :row-select="true"
            :has-select="hasSelect"
            ref="datagrid">
            <!-- 弹出框模式顶部按钮 -->
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pickInvoice">{{$t("m.i.bm.pickInvoice")}}</h-button>
              <h-button type="primary" @click="deleteInfo">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" v-if="this.batchParams.isManageOpen === '1'" @click="revokeDelete">{{$t("m.i.common.cancel")}}</h-button>
              <h-button type="ghost" @click="goBack">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" @click="showFile">{{$t('m.i.common.fileManage')}}</h-button>
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
    </h-msg-box>

    <pick-invoice @pickInvoiceWinClose="pickInvoiceWinClose" :pickInvoiceWin="pickInvoiceWin"
                   ref="pickInvoice" :batchParams="batchParams" :dictMap="dictMap"></pick-invoice>

    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>


  </div>
</template>

<script>

  import { post, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "invoiceManager",
    components: {
      pickInvoice:()=>import(/* webpackChunkName: "bm/ctrct/pickInvoice" */`@/views/bizViews/bm/ctrct/pickInvoice`),
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
    },
    data(){
        let _this = this;
        return{
          pickInvoiceWin:false,
          hasSelect : false,
          fileBatchParams:{},
          showFileWin:false,
          attTypeCodeList: [{key:'FT07',value:'其他'}],
          fileDetailStatusList:[],
          filePathUrl:"/bm/ctrct/invoiceInfoManager/",
          currentSelectRow:[],
          columns: [
            {
              type: "selection",
              key: "multiSelect",
              width: 60,
              hiddenCol: false
            },
            {
              type: "index",
              key: "numOrder",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center",
              hiddenCol: false
            },
            {
              title: this.$t('m.i.be.preRelationFlag'),
              key: "preRelationFlag",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "PreRelationFlag", params.row.preRelationFlag);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t('m.i.bm.invoiceNo'),
              key: "invoiceNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t('m.i.common.custNo'),
              key: "custNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t('m.i.common.custName'),
              key: "custName",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t('m.i.bm.custTaxNo'),
              key: "sellerTaxNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t('m.i.bm.invoiceType'),
              key: "invoiceType",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "InvType", params.row.invoiceType);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t('m.i.bm.invoiceRatioPct'),
              key: "invoiceRatioPct",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t('m.i.bm.invoiceTaxMoney'),
              key: "invoiceTaxMoney",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let invoiceTaxInterestAmt = formatNumber(params.row.invoiceTaxInterest, 2, ',');
                return h("span", {
                  domProps: {
                    title: invoiceTaxInterestAmt
                  }
                }, invoiceTaxInterestAmt);
              }
            },
            {
              title: this.$t('m.i.bm.invoiceAmtOnly'),
              key: "invoiceAmt",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let invoiceAmt = formatNumber(params.row.invoiceAmt, 2, ',');
                return h("span", {
                  domProps: {
                    title: invoiceAmt
                  }
                }, invoiceAmt);
              }
            },
            {
              title: this.$t('m.i.bm.buyerName'),
              key: "buyerName",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t('m.i.bm.buyerTaxNo'),
              key: "buyerTaxNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },

            {
              title: this.$t('m.i.bm.invoiceDt'),
              key: "invoiceDt",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (params.row.invoiceDt == null || params.row.invoiceDt === "") {
                  return "";
                }
                let date = this.$moment(params.row.invoiceDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t('m.i.bm.invoiceContent'),
              key: "invoiceContent",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t('m.i.bm.invoiceRemark'),
              key: "invoiceRemark",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t('m.i.bm.invoiceCheckNo'),
              key: "invoiceCheckCode",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
          ],
          URL: "/bm/ctrct/tradeInfo/func_pagingRelationInvoice",
          relationBillForm:{
            voucherType:"03",
            invoiceNo:""
          }
        }
    },
    watch: {
      relationInvoiceBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    props: {
      title: {
        type: String,
        default() {
          return "已关联发票信息查询";
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      relationInvoiceBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
    },
    computed: {
      tempRelationInvoiceBillWin: {
        get() {
          return this.relationInvoiceBillWin;
        },
        set() {
        }
      }
    },
    methods:{
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },

      //查询
      formSearch() {
        //this.relationBillForm.listId = this.relationInvoiceBillParams.listId;
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.relationBillForm.id = this.batchParams.tradeId;
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },
      resetSearch() {
        this.$refs.relationBillForm.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },

      showFile(){
        if (this.$refs.datagrid.selects.length === 1) {
          let selectData=this.$refs.datagrid.selects[0];
          this.fileBatchParams.operType = "show";
          this.fileBatchParams.busiId = selectData.id;
          this.fileBatchParams.attachBusiType = "invoiceInfoFile";
          this.fileBatchParams.attTypeCodeList = this.attTypeCodeList;
          this.fileBatchParams.fileDetailStatusList = this.batchParams.fileDetailStatusList;
          this.showFileWin = true;
        }else if (this.$refs.datagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        } else if (this.$refs.datagrid.selects.length > 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
      },

      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //返回
      goBack() {
        this.$refs.relationBillForm.resetFields();
        this.relationBillForm.listId = "";
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("relationInvoiceBillClose", "");
      },
      deleteInfo(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseAtLeastOneRecord')});
        } else {
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmDelete') + '?',
            onOk: () => {
              this.handledel();
            }
          })
        }
      },
      //确认删除
      handledel() {
        let delId = this.$refs.datagrid.selectIds;
        let list = this.$refs.datagrid.selects;
        for (let i = 0; i < list.length; i++) {
          if (list[i].preRelationFlag === '3'){
            this.$msgTip.info(this, {info: "预关联关系为预删除的发票不能再次删除！"});
            return ;
          }
        }
        post({id:this.batchParams.tradeId,voucherIds: delId,voucherType:"03"}, '/bm/ctrct/tradeInfo/func_deleteInvoice').then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg})
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
          }
        });
      },

      revokeDelete(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseAtLeastOneRecord')});
        } else {
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmRollBack') + '?',
            onOk: () => {
              this.handleRevokeDel();
            }
          })
        }
      },
      //确认撤销
      handleRevokeDel() {
        let revokeId = this.$refs.datagrid.selectIds;
        let list = this.$refs.datagrid.selects;
        for (let i = 0; i < list.length; i++) {
          if (list[i].preRelationFlag !== '3'){
            this.$msgTip.info(this, {info: "只有预关联关系为预删除的发票才能撤销！"});
            return ;
          }
        }
        post({id:this.batchParams.tradeId,voucherIds: revokeId,voucherType:"03"}, '/bm/ctrct/tradeInfo/func_revokeDeleteInvoice').then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg})
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
          }
        });
      },
      pickInvoiceWinClose(){
        this.pickInvoiceWin = false;
        this.formSearch();
      },
      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      },
      // 挑选发票
      pickInvoice(){
        this.pickInvoiceWin = true;
      }
    }

  }
</script>

<style scoped>

</style>
