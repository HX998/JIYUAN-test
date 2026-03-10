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
                <query-btn  v-on:showChange="showQry"  :advanceShow='false' :formSearch='handleSearch' :formSearchReset='resetSearch'> </query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/corpstdbill/publish/stdPublishQuery/func_queryStdPublishTrackQuery"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 详情弹窗 -->
    <std-publish-add :stdPublishAddOrEditWin="stdPublishAddOrEditWin" :batchParams="batchParams"
                     @stdPublishAddOrEditWinClose="stdPublishAddOrEditWinClose" ref="stdPublishAdd"></std-publish-add>
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
  </div>

</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";
  export default {
    name: "stdPublishTrackQuery",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      StdPublishAdd: () => import(/* webpackChunkName: "bs/corpstdbill/publish/stdPublishAdd" */`@/views/bizViews/bs/corpstdbill/publish/stdPublishAdd`),
    },
    data() {
      return {
        formItem: {
          baseAssetType: "",
          stdProductNameLike:"",
          publishDt: ""
        },
        publishDate: [],
        columns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width: 50
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
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "publishStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PublishOperStatus", params.row.publishStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
        showCpesBranch: false,
        baseAssetTypeList: [],
        publishTypeList: [],
        publishModeList: [],
        publishOperStatusList: [],
        stdPublishAddOrEditWin: false,
        batchParams: {},
      };
    },
    mounted() {
      this.getDictListByGroups("BaseAssetType,PublishType,PublishMode,PublishOperStatus").then(res => {
        this.baseAssetTypeList = res.get("BaseAssetType");
        this.publishTypeList = res.get("PublishType");
        this.publishModeList = res.get("PublishMode");
        this.publishOperStatusList = res.get("PublishOperStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showQry(val) {
        this.ifShowMore = val;
      },
      //查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.publishDate = [];
        this.formItem.baseAssetType = "";
        this.formItem.minPublishDate="";
        this.formItem.maxPublishDt="";
        this.formItem.stdProductNo="";
        this.formItem.stdProductShortName = "";
        this.$refs.formItem.resetFields();
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
          this.$msgTip.error(this, {info: "请先选择记录！"});
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        // this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
      },
      batchNoMain(id) {
        this.batchParams.batchId = id;
        this.assembleParams('show');
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.publishTypeList = this.publishTypeList;
        this.batchParams.publishModeList = this.publishModeList;
        this.batchParams.baseAssetTypeList = this.baseAssetTypeList;
        this.batchParams.publishOperStatusList = this.publishOperStatusList;
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
      //关闭详情弹窗
      stdPublishAddOrEditWinClose() {
        this.stdPublishAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      }
    }
  }
</script>
  <style scoped>

  </style>
