<!--分页查询字典与业务字段关联信息-->
<template>
  <div class="layout">
    <div>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <div class="h-form-search-box">
              <!-- 查询表单 -->
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <!--表英文名称-->
                  <common-input :label="$t('m.i.config.tableEnName')" prop="tableEnName" v-model="formItem.tableEnName"></common-input>
                  <!--表中文名称-->
                  <common-input :label="$t('m.i.config.tableZhName')" prop="tableZhName" v-model="formItem.tableZhName"></common-input>
                  <!--字段英文名称-->
                  <common-input :label="$t('m.i.config.fieldEnName')" prop="fieldEnName" v-model="formItem.fieldEnName"></common-input>
                  <!--字段中文名称-->
                  <common-input :label="$t('m.i.config.fieldZhName')" prop="fieldZhName" v-model="formItem.fieldZhName"></common-input>
                  <!--数据字典分组编码-->
                  <common-input :label="$t('m.i.config.relationDictGroupCode')" prop="dictGroupCode" v-model="formItem.dictGroupCode" class="h-form-long-label"></common-input>
                  <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
                </h-form>
              </h-panel>
            </div>
            <!-- 数据展示表格 -->
            <h-datagrid
              :columns="columns"
              highlightRow
              url="/sm/config/dictionary/func_queryDictAndBusiFieldMappingDtoByPage"
              :bindForm="formItem"
              rowSelect
              ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="listExport()" v-if="btnAuth.exportListBtn.isShow">{{$t("m.i.common.listExport")}}</h-button>
              </div>
            </h-datagrid>
          </div>
        </h-col>
      </h-row>
    </div>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose" :showExcelTemplateWin="tempShowExcelTemplateWin"
                           :param="this.param" :rows="this.rows"></common-excel-download>

    <!--点击查看数据字典弹出窗-->
    <h-msg-box v-model="dictDataWin" width="500" height="400" :mask-closable="false" @on-close="handleWinClose" :maximize="true">
      <p slot="header">
        <span>查看字典详情</span>
      </p>
      <div class="text-body">
        <h-table-min border stripe :columns="dictColumns" :data="dictDataList"></h-table-min>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="dictDataWin=!dictDataWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {post, exportList} from "@/api/bizApi/commonUtil";
  export default {
    name: "dictAndBusiFieldMapping",
    components: {
    },
    data() {
      return {
        formItem: {
          tableEnName: "",
          tableZhName: "",
          fieldEnName: "",
          fieldZhName: "",
          dictGroupCode: "",
          dictKey: ""
        },
        currentSelectRow: null,
        tempShowExcelTemplateWin:false,
        columns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.config.tableEnName'),
            key: "tableEnName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.config.tableZhName'),
            key: "tableZhName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.config.fieldEnName'),
            key: "fieldEnName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.config.fieldZhName'),
            key: "fieldZhName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.config.relationDictGroupCode'),
            key: "dictGroupCode",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.getDictKeyAndValuelist(params.row.dictDataList);
                  }
                }
              }, params.row.dictGroupCode);
            }
          },
          {
            title: this.$t('m.i.config.relationDictKey'),
            key: "dictKey",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.config.relationDictictValue'),
            key: "dictValue",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "remark",
            hiddenCol: false
          }
        ],
        dictColumns: [
          {
            title: this.$t('m.i.config.relationDictKey'),
            key: "key",
          },
          {
            title: this.$t('m.i.config.relationDictictValue'),
            key: "value",
          }
        ],
        //是否显示更多查询项
        ifShowMore: false,
        dictDataList: null,
        dictDataWin: false,
        //清单导出
        param:null,
        rows: null,
        btnAuth:{
          exportListBtn: {
            isShow: false
          }
        },
      };
    },
    mounted() {
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            let retData = JSON.parse(res.data.retData);
            if (retData.exportListBtn.isShow){
              this.btnAuth.exportListBtn.isShow = true;
            }
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      //清单导出
      listExport(){
        this.param = "dictAndBusiFieldRelationExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
        this.param = null;
        this.rows = null;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/sm/config/dictionary/func_exportDictAndBusiFieldRelation";
        //let options = {downloadByHttpReq:true, downloadFilename:"字典与业务字段关联信息清单"};
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
      //查看权限弹窗
      getDictKeyAndValuelist(dictDataList) {
        this.dictDataList = dictDataList;
        this.dictDataWin = true;
      },
      handleWinClose() {
        this.dictDataList = null;
        this.dictDataWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
