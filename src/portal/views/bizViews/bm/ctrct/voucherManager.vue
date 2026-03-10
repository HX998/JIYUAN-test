<!--发票管理-->
<template>
  <div>
    <h-msg-box v-model="tempRelationVoucherBillWin" width="1000" :mask-closable="false" @on-close="goBack"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div>
        <div class="h-form-search-box">
          <h-form :model="relationBillForm" :label-width="100" ref="relationBillForm" cols="4"
                  class="h-form-search">
            <h-form-item :label="$t('m.i.bm.otherVoucherNo')" prop="otherVoucherNoLike">
              <h-input v-model="relationBillForm.otherVoucherNoLike" :maxlength="32"></h-input>
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
              <h-button type="primary" @click="pickVoucher">{{$t("m.i.bm.pickVoucher")}}</h-button>
              <h-button type="primary" @click="deleteInfo">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" v-if="this.batchParams.isManageOpen === '1'" @click="revokeDelete">{{$t("m.i.common.cancel")}}</h-button>
              <h-button type="ghost" @click="goBack">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" @click="showFile">{{$t('m.i.common.fileManage')}}</h-button>
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
    </h-msg-box>

    <pick-voucher @pickVoucherWinClose="pickVoucherWinClose" :pickVoucherWin="pickVoucherWin"
                   ref="pickVoucher" :batchParams="batchParams"></pick-voucher>

    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>


  </div>
</template>

<script>

  import { post, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "voucherManager",
    components: {
      pickVoucher:()=>import(/* webpackChunkName: "bm/ctrct/pickVoucher" */`@/views/bizViews/bm/ctrct/pickVoucher`),
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
    },
    data(){
        let _this = this;
        return{
          pickVoucherWin:false,
          hasSelect : false,
          fileBatchParams:{},
          attTypeCodeList: [{key:'FT07',value:'其他'}],
          fileDetailStatusList:[],
          showFileWin:false,
          filePathUrl:"/bm/ctrct/otherVoucherManager/",
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
              title: this.$t('m.i.bm.otherVoucherNo'),
              key: "otherVoucherNo",
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
           /* {
              title: this.$t('m.i.common.custAcctNo'),
              key: "custAcctNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },*/
            {
              title:this.$t('m.i.billInfo.oppName'),
              key:"oppName",
              hiddenCol:false
            },
            /*{
              title: this.$t('m.i.bm.oppAcctNo'),
              key: "oppAcctNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },*/
            {
              title: this.$t('m.i.bm.voucherUse'),
              key: "otherVoucherUse",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
            },
          ],
          URL: "/bm/ctrct/tradeInfo/func_pagingRelationVoucher",
          relationBillForm:{
            voucherType:"02",
            otherVoucherNoLike:""
          }
        }
    },
    watch: {
      relationVoucherBillWin(val) {
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
          return "已关联其他凭证信息查询";
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      relationVoucherBillWin: {
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
      tempRelationVoucherBillWin: {
        get() {
          return this.relationVoucherBillWin;
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
        //this.relationBillForm.listId = this.relationVoucherBillParams.listId;
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
        this.$emit("relationVoucherBillClose", "");
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
            this.$msgTip.info(this, {info: "预关联关系为预删除的其他凭证不能再次删除！"});
            return ;
          }
        }
        post({id:this.batchParams.tradeId,voucherIds: delId,voucherType:"02"}, '/bm/ctrct/tradeInfo/func_deleteVoucher').then(res => {
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
            this.$msgTip.info(this, {info: "只有预关联关系为预删除的其他凭证才能撤销！"});
            return ;
          }
        }
        post({id:this.batchParams.tradeId,voucherIds: revokeId,voucherType:"02"}, '/bm/ctrct/tradeInfo/func_revokeDeleteVoucher').then(res => {
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
      pickVoucherWinClose(){
        this.pickVoucherWin = false;
        this.formSearch();
      },
      showFile(){
        if (this.$refs.datagrid.selects.length === 1) {
          let selectData=this.$refs.datagrid.selects[0];
          this.fileBatchParams.operType = "show";
          this.fileBatchParams.busiId = selectData.id;
          this.fileBatchParams.attachBusiType = "otherVoucherFile";
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

      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      },

      // 挑选发票
      pickVoucher(){
        this.pickVoucherWin = true;
      }
    }

  }
</script>

<style scoped>

</style>
