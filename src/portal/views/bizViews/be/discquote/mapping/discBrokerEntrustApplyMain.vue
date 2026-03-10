<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <h-form-item :label="$t('m.i.be.brokerBank')" prop="brokerBrchNameTem"  >
                  <h-input v-model="formItem.brokerBrchNameTem" placeholder="" readonly icon="android-search"
                           @on-click="brchSearchWinOpen('broker')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.entrustBank')" prop="entrustBrchNameTem"  >
                  <h-input v-model="formItem.entrustBrchNameTem" placeholder="" readonly icon="android-search"
                           @on-click="brchSearchWinOpen('entrust')"></h-input>
                </h-form-item>
                <common-select v-model="formItem.activeFlag" :label="$t('m.i.be.activeFlag')" prop="activeFlag"
                               :dictList="isList"></common-select>
                <common-date-picker v-model="formItem.modifyDtTem" :label="$t('m.i.be.modifyDt')" prop="modifyDtTem" type="daterange"
                                    :rangeValue="['minModifyDt','maxModifyDt']"
                                    :minModifyDt.sync="formItem.minModifyDt" :maxModifyDt.sync="formItem.maxModifyDt">
                </common-date-picker>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/discquote/mapping/discBrokerEntrustApplyMain/func_queryDiscBrokerEntrustPage"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="addBrokerEntrust">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="takeEffect">{{$t("m.i.common.takeEffect")}}</h-button>
              <h-button type="primary" @click="invalid">{{$t("m.i.common.invalid")}}</h-button>
              <h-button type="primary" @click="delBrokerEntrust">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="importTemplate()">{{$t("m.i.common.templateDownload")}}</h-button>
              <h-button type="primary" @click="importWinOpen()">{{$t("m.i.common.batchImport")}}</h-button>
              <h-button type="primary" @click="listExport()">{{$t("m.i.common.batchExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <disc-broker-entrust-apply-add :addBrokerEntrustWin="addBrokerEntrustWin" :batchParams="batchParams"
                            @addBrokerEntrustWinClose="addBrokerEntrustWinClose" ref="discListingApplyAdd"></disc-broker-entrust-apply-add>
    <show-cpes-branch-broker :showCpesBranch="showCpesBranch" @showCpesBranchClose="brchSearchWinClose"
                      @showCpesBranchSubmit="brchSearchChange" :memberId="memberId"  :showMemberId="showMemberId"></show-cpes-branch-broker>
    <!-- 批量导入 -->
    <common-file-upload-no-show :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber ,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "discBrokerEntrustApplyMain",
    components: {
      ShowCpesBranchBroker:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranchBroker" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranchBroker`),
      DiscBrokerEntrustApplyAdd: () => import(/* webpackChunkName: "be/discquote/mapping/discBrokerEntrustApplyAdd" */`@/views/bizViews/be/discquote/mapping/discBrokerEntrustApplyAdd`),
    },
    data() {
      return {
        formItem: {
          brokerBrchCode:"",
          brokerBrchNameTem:"",
          entrustBrchCode:"",
          entrustBrchNameTem:"",
          activeFlag: "",
          modifyDtTem:[],
          minModifyDt:"",
          maxModifyDt:"",
        },
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
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
            title: this.$t("m.i.be.brokerBrchName"),
            key: "brokerBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.brokerBrchCode"),
            key: "brokerBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.brokerBrchNum"),
            key: "brokerBrchNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.entrustBrchName"),
            key: "entrustBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.entrustBrchCode"),
            key: "entrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.entrustBrchNum"),
            key: "entrustBrchNum",
            hiddenCol: false
          },

          {
            title: this.$t("m.i.be.activeFlag"),
            key: "activeFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.activeFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },

          {
            title: this.$t("m.i.be.modifyDt"),
            key: "modifyDt",
            hiddenCol: false,
            render: (h, params) => {
              let settleDt = this.$moment(params.row.modifyDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", settleDt);
            }
          },
        ],
        ifShowMore: false,
        dictMap: new Map(),
        isList:[],
        queryType:"",
        showCpesBranch:false,
        memberId:JSON.parse(window.sessionStorage.getItem("userInfo")).memberId,
        showMemberId:false,
        batchParams: {},
        addBrokerEntrustWin:false,
        importWin: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/discquote/mapping/discBrokerEntrustApplyMain/func_batchDiscBrokerEntrust",  //excel数据导入接口
          uploadParams: {//调用excel数据解析接口时附带的额外参数
          }
        },
        tempShowExcelTemplateWin: false,
        param: "",
        rows: "",
      };
    },
    mounted() {
      this.getDictListByGroups("Yon").then(res => {
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //查询
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.brokerBrchCode="";
        this.formItem.entrustBrchCode="";
        this.$refs.formItem.resetFields();
      },
      //查询票交机构
      brchSearchWinOpen(type){
        this.queryType=type;
        this.showCpesBranch=true;

      },
      brchSearchChange(info){
        if("broker"===this.queryType){
          this.formItem.brokerBrchCode=info.brchCode;
          this.formItem.brokerBrchNameTem=info.brchFullNameZh;
        }else if("entrust"===this.queryType){
          this.formItem.entrustBrchCode=info.brchCode;
          this.formItem.entrustBrchNameTem=info.brchFullNameZh;
        }
        this.brchSearchWinClose();
      },
      brchSearchWinClose(){
        this.showCpesBranch=false;
        this.queryType="";
      },
      //打开新增页面
      addBrokerEntrust(){
        this.addBrokerEntrustWin=true;
      },
      //关闭新增弹窗
      addBrokerEntrustWinClose() {
        this.addBrokerEntrustWin = false;
        this.handleSearch(1);
        this.batchParams = {};
      },
      //生效
      takeEffect(){
        let ids =this.$refs.datagrid.selectIds;
        if (ids != null && ids.length !== 0) {
          this.$hMsgBox.confirm({
            title: "生效信息",
            content: "确定要生效吗？",
            onOk: () => {
              let params={ ids:ids,activeFlag:"1"};
              let url="/be/discquote/mapping/discBrokerEntrustApplyMain/func_effectDiscBrokerEntrust";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //失效
      invalid(){
        let ids =this.$refs.datagrid.selectIds;
        if (ids != null && ids.length !== 0) {
          this.$hMsgBox.confirm({
            title: "失效信息",
            content: "确定要失效吗？",
            onOk: () => {
              let params={ ids: ids,activeFlag:"0" };
              let url="/be/discquote/mapping/discBrokerEntrustApplyMain/func_effectDiscBrokerEntrust";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //删除
      delBrokerEntrust(){
        let ids =this.$refs.datagrid.selectIds;
        if (ids != null && ids.length !== 0) {
          this.$hMsgBox.confirm({
            title: "删除信息",
            content: "确定要删除吗？",
            onOk: () => {
              let params={ ids: ids,activeFlag:"0" };
              let url="/be/discquote/mapping/discBrokerEntrustApplyMain/func_delDiscBrokerEntrust";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/mapping/discBrokerEntrustApplyMain/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      importWinOpen(){
        this.importWin = true;
      },
      importSuccess() {
        this.importWin = false;
        this.handleSearch();
      },
      importWinClose() {
        this.handleSearch();
        this.importWin = false;
      },
      listExport() {
        this.param = "discBrokerEntrustExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/mapping/discBrokerEntrustApplyMain/exportDiscBrokerEntrust";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.handleSearch(1);
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

    }
  };
</script>

<style scoped>

</style>
