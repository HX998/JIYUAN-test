<!--信息披露管理-信息披露-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--基础资产种类-->
                <common-select v-model="formItem.baseAssetType" :label="$t('m.i.bs.baseAssetType')" prop="baseAssetType"
                               :dictList="baseAssetTypeList"></common-select>
                <!--标票产品名称-->
                <common-input v-model="formItem.stdProductNameLike" :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                              showIcon @on-click="queryProductName"></common-input>
                <!--披露日期-->
                <common-date-picker v-model="publishDate" :label="$t('m.i.bs.publishDt')" type="daterange" :autoPlacement="true" @on-change="handlePublishDateChange"></common-date-picker>
                <!--披露类型-->
                <common-select v-model="formItem.publishType" :label="$t('m.i.bs.publishType')" prop="publishType"
                               :dictList="publishTypeList"></common-select>
                <!--是否已提交-->
                <is-commit-radio v-model="formItem.isCommit" prop="isCommit" @on-click="isCommitButton"></is-commit-radio>
                <query-btn  v-on:showChange="showQry"  :advanceShow='true' :formSearch='handleSearch' :formSearchReset='resetSearch'> </query-btn>
              </h-form>
            </h-panel>

            <!-- 数据展示表格 -->
            <h-row>
              <h-col span="24">
                <h-datagrid
                  :columns="columns"
                  highlightRow
                  :bindForm="formItem"
                  url="/bs/corpstdbill/publish/stdPublishApply/func_queryStdPublishApply"
                  :onCurrentChange="handleCurrentChange"
                  :onCurrentChangeCancel="handleCurrentChangeCancel"
                  ref="datagrid">
                  <div slot="toolbar" class="pull-left">
                    <h-button type="primary" @click="stdPublishOperate('add')" :disabled="hasCommit">{{$t("m.i.common.add")}}</h-button>
                    <h-button type="primary" @click="stdPublishOperate('modify')" :disabled="hasCommit">{{$t("m.i.common.modify")}}</h-button>
                    <h-button type="primary" @click="stdPublishDelete()" :disabled="hasCommit">{{$t("m.i.common.delete")}}</h-button>
                    <h-button type="primary" @click="stdPublishCancel()" :disabled="noCommit">{{$t("m.i.common.revoke")}}</h-button>
                    <h-button type="primary" @click="formUpload()" :disabled="hasCommit">{{$t('m.i.common.upload')}}</h-button>
                    <h-button type="primary" @click="applySubmit()" :disabled="hasCommit">{{$t('m.i.common.submit')}}</h-button>
                  </div>
                </h-datagrid>
              </h-col>
            </h-row>
            <!-- 新增修改详情弹窗 -->
            <std-publish-add :stdPublishAddOrEditWin="stdPublishAddOrEditWin" :batchParams="batchParams"
                              @stdPublishAddOrEditWinClose="stdPublishAddOrEditWinClose" ref="stdPublishAdd"></std-publish-add>

            <!--查询标票产品名称弹窗-->
            <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                              :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                              @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>

            <common-file-upload-no-show :import-win="this.importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                        @importSuccess="importSuccess" title="上传"></common-file-upload-no-show>
          </div>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdPublishApply",
    components: {
      StdPublishAdd: () => import(/* webpackChunkName: "bs/corpstdbill/publish/stdPublishAdd" */`@/views/bizViews/bs/corpstdbill/publish/stdPublishAdd`),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      return {
        formItem: {
          baseAssetType: "",
          stdProductNameLike:"",
          publishDt:"",
          publishType:"",
          isCommit:"0"
        },
        hasCommit:false,
        noCommit:true,
        publishDate:[],
        importWin : false,
        suffixStr : "jpg,jpeg,png,xls,xlsx,pdf,zip,rar",
        fileParams : {
          fileUploadUrl:window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/publish/func_uploadPublishFile",
          uploadParams: {
            id:"",
            suffixStr:[],
            maxSize:50*1024
          },
        },
        columns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.batchNoMain(params.row.id)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t('m.i.common.fileName'),
            key: 'fileName',
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.fileNameMain(params.row.id)
                    }
                  }
                }, params.row.fileName)
              ]);
            }
          },
          {
            title: this.$t("m.i.bs.baseAssetType"),
            key: "baseAssetType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BaseAssetType", params.row.baseAssetType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.bs.stdProductName'),
            key: 'stdProductName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.stdProductShortName'),
            key: 'stdProductShortName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.publishDt'),
            key: 'publishDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.publishDt ? this.$moment(params.row.publishDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.bs.publishType"),
            key: "publishType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PublishType", params.row.publishType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.bs.publishMode"),
            key: "publishMode",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PublishMode", params.row.publishMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        baseAssetTypeList:[],
        publishTypeList:[],
        publishModeList:[],
        stdPublishAddOrEditWin:false,
        batchParams: {},

      };
    },
    mounted() {
      this.getDictListByGroups("BaseAssetType,PublishType,PublishMode").then(res => {
        this.baseAssetTypeList = res.get("BaseAssetType");
        this.publishTypeList = res.get("PublishType");
        this.publishModeList = res.get("PublishMode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showQry(val){
        this.ifShowMore = val;
      },
      //查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.publishDate=[];
        this.formItem.minPublishDate="";
        this.formItem.maxPublishDt="";
        this.formItem.stdProductNo="";
        this.formItem.stdProductShortName="";
        this.isCommitButton("noCommit", "0");
        this.$refs.formItem.resetFields();
      },
      isCommitButton(isCommit, val) {
        this.formItem.isCommit = val;
        if(isCommit == "hasCommit"){
          this.hasCommit = true;
          this.noCommit = false;
        }else {
          this.noCommit = true;
          this.hasCommit = false;
        }
        this.handleSearch();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handlePublishDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minPublishDt = arr[0].replace(/-/g, "");
          this.formItem.maxPublishDt = arr[1].replace(/-/g, "");
          this.publishDate = [arr[0], arr[1]];
        } else {
          this.formItem.minPublishDt = "";
          this.formItem.maxPublishDt = "";
          this.publishDate = [];
        }
      },
      // 根据弹框所选数据进行赋值
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        // this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
      },
      //打开新增和修改页面
      stdPublishOperate(str){
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.batchId = this.currentSelectRow.id;
          this.batchParams.isPublishDt=false;
        } else {
          this.batchParams.isPublishDt=true;
        }
        this.assembleParams(str);
      },
      //跳转详情页面
      batchNoMain(id){
        this.batchParams.batchId = id;
        this.batchParams.batchType = 'show';
        this.assembleParams('show');
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.publishTypeList = this.publishTypeList;
        this.batchParams.publishModeList = this.publishModeList;
        this.batchParams.baseAssetTypeList = this.baseAssetTypeList;
        this.stdPublishAddOrEditWin = true;
      },
      //文件下载
      fileNameMain(id){
          let url=window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/publish/func_downLoadPublishFile?id="+id;
          let form = document.createElement('form');
          form.setAttribute("id","formId");
          form.setAttribute('action',url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
      },
      //关闭新增、修改弹窗
      stdPublishAddOrEditWinClose() {
        this.stdPublishAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //删除批次信息
      stdPublishDelete(){
        if(this.currentSelectRow == null || this.currentSelectRow.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: this.$t('m.i.common.isConfirmDelete') + '?',
          onOk: () => {
            let params={ id: this.currentSelectRow.id };
            let url="/bs/corpstdbill/publish/stdPublishApply/func_deleteStdPublish";
            this.sendPost(params,url);
          }
        })
      },
      //申请撤销
      stdPublishCancel(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "撤销信息",
            content: "确定要撤销申请吗？",
            onOk: () => {
              let params={ id: this.currentSelectRow.id };
              let url="/bs/corpstdbill/publish/stdPublishApply/func_cancelStdPublish";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //申请提交
      applySubmit(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          let isUpload = this.currentSelectRow.isUpload;
          if(isUpload !== '1') {
            this.$msgTip.error(this, {info: "当期信息披露未包含披露文件，请上传后继续！"});
            return;
          }
          this.$hMsgBox.confirm({
            title: "确认信息",
            content: "确定要提交申请吗？",
            onOk: () => {
              let params={ id: this.currentSelectRow.id };
              let url = "/bs/corpstdbill/publish/stdPublishApply/func_commitStdPublish";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //上传
      formUpload(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          let isUpload = this.currentSelectRow.isUpload;
          let id = this.currentSelectRow.id;
          if(isUpload === '1'){
            this.$hMsgBox.confirm({
              title: this.$t('m.i.common.confirm'),
              content: this.$t('m.i.bs.isConfirmUpload'),
              onOk: () => {
                this.fileParams.uploadParams.id = id;
                this.fileParams.uploadParams.suffixStr = this.suffixStr.split(",");
                this.importWin = true;
              }
            });
          }else{
              this.fileParams.uploadParams.id = id;
              this.fileParams.uploadParams.suffixStr = this.suffixStr.split(",");
              this.importWin = true;
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      importWinClose() {
        this.fileParams.uploadParams.id = "";
        this.fileParams.uploadParams.suffixStr=[];
        this.importWin = false;
      },

      importSuccess(isSuccess) {
          this.fileParams.uploadParams.id = "";
          this.fileParams.uploadParams.suffixStr=[];
          this.importWin = false;
          let pageNo = this.$refs.datagrid.pageInfo.pageNo;
          this.handleSearch(pageNo);
      },
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }




    }
  };

</script>

<style scoped>

</style>
