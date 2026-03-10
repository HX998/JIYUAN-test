<!--其他凭证管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.bm.otherVoucherNo')" prop="otherVoucherNoLike">
                  <h-input v-model="formItem.otherVoucherNoLike" :maxlength="32"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns" highlightRow url="/bm/ctrct/otherVoucherManager/func_pagingQueryOtherVoucher" :bindForm="formItem"
                          :row-select="true" :has-select="false" ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="otherVoucherEdit('add')">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @click="otherVoucherEdit('modify')">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="deleteDetailed">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="showFile">{{$t('m.i.common.fileManage')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增其他凭证信息</span>
        <span v-if="type=='modify'">修改其他凭证信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">

          <h-form-item :label="$t('m.i.bm.otherVoucherNo')" prop="otherVoucherNo" :required="true" :validRules="validNoRules">
            <h-input v-model="addForm.otherVoucherNo" :maxlength=32  :placeholder="''" :readonly="type=='modify'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" :required="true">
            <select-cust-corp v-if="type=='add'" v-model="addForm.custNo" :custNo="addForm.custNo" :value.sync="addForm.custNo" :custName.sync="addForm.custName"></select-cust-corp>
            <h-input v-else-if="type=='modify'" v-model="addForm.custNo" :placeholder="''" readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="true">
            <h-input v-model="addForm.custName" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>

        <!--  <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="isRequired">
            <h-input v-model="addForm.custAcctNo" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>-->

          <h-form-item :label="$t('m.i.billInfo.oppName')" prop="oppName" :required="true">
            <h-input v-model="addForm.oppName" :maxlength=60 :lengthByByte="false"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.voucherUse')" prop="otherVoucherUse" :required="true">
            <h-input v-model="addForm.otherVoucherUse" :maxlength="500" :lengthByByte="false"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t('m.i.common.confirm')}}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t('m.i.common.close')}}</h-button>
      </div>
    </h-msg-box>

    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>


  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "otherVoucherManager",
    components: {
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
      //ShowBranch:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
    },
    data(){
      let _this = this;
      return{
        validNoRules: [{ test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "只能输入数字和字母,且长度最大为32位" }],
        addOrEditWin: false,
        type: "",
        showFileWin:false,
        fileBatchParams:{},
        filePathUrl:"/bm/ctrct/otherVoucherManager/",
        attTypeCodeList: [{key:'FT07',value:'其他'}],
        addForm: {
          id: "",
          custNo: "",
          custName: "",
          custAcctNo:"",
          oppName:"",
          oppAcctNo:"",
          otherVoucherNo: "",
          otherVoucherUse:""
        },
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
          {
            title: this.$t("m.i.common.createBrchName"),
            key: "createBrchName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.createDt"),
            key: "createDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime == "" || params.row.createTime == 0) {
                return "";
              }
              let createDt = params.row.createTime.toString().substring(0, 8);
              let date = _this.$moment(createDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        formItem: {
          custNo: "",
          custName: "",
          otherVoucherNoLike:"",
          createBrchNos: "",
          createBrchNames: ""
        },
        ifShowMore: false,
        dictMap: new Map(),
        fileDetailStatusList:[],
      }
    },
    mounted() {
      this.getDictListByGroups("AttTypeCode,FileDetailStatus,PreRelationFlag").then(res => {
        this.fileDetailStatusList = res.get("FileDetailStatus");
        this.dictMap = res.get("map");
      });
    },
    methods:{
      clearVal(){
        this.formItem.createBrchNames=''
        this.formItem.createBrchNos='';
      },
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.custNo='';
        this.clearVal();
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },


      //新增/修改发票申请
      otherVoucherEdit(str) {
        this.type = str;
        // this.isRequired = true;
        if (this.type === "modify") {
          if (this.$refs.datagrid.selects.length === 1) {
            this.$nextTick(() => {
              let selectData=this.$refs.datagrid.selects[0];
              this.addForm.id=selectData.id
              this.addForm.custNo=selectData.custNo
              this.addForm.custName=selectData.custName
              this.addForm.oppName=selectData.oppName
              this.addForm.otherVoucherNo=selectData.otherVoucherNo
              this.addForm.otherVoucherUse=selectData.otherVoucherUse
            });
          } else if (this.$refs.datagrid.selects.length === 0){
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          } else if (this.$refs.datagrid.selects.length > 0){
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addForm.id = "";
        this.$refs.addForm.resetFields();
      },

      submitForm() {
        // this.addForm.invoiceAmt = this.addForm.invoiceAmt.toString().replace(/,/g, "");
        // this.addForm.invoiceDt = this.addForm.invoiceDt.replace(/-/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/bm/ctrct/otherVoucherManager/func_addOtherVoucherInfo" : "/bm/ctrct/otherVoucherManager/func_updateOtherVoucherInfo";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addFormReset();
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
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

      // 删除
      deleteDetailed() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDeleteDetailed();
          }
        });
      },
      handleDeleteDetailed() {
        let ids = this.$refs.datagrid.selectIds.join(",");
        post({ ids: ids }, "/bm/ctrct/otherVoucherManager/func_delOtherVoucherInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      showFile(){
        if (this.$refs.datagrid.selects.length === 1) {
          let selectData=this.$refs.datagrid.selects[0];
          this.fileBatchParams.operType = "upload";
          this.fileBatchParams.busiId = selectData.id;
          this.fileBatchParams.attachBusiType = "otherVoucherFile";
          this.fileBatchParams.attTypeCodeList = this.attTypeCodeList;
          this.fileBatchParams.fileDetailStatusList = this.fileDetailStatusList;
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
      }

    }
  }
</script>

<style scoped>

</style>
