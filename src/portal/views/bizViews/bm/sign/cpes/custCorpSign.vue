<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--客户号 -->
                <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                  <select-cust-corp v-model="formItem.custNo" :custNo="formItem.custNo"
                                    :value.sync="formItem.custNo" :custName.sync="formItem.custName" :socCode.sync="formItem.socCode" ></select-cust-corp>
                </h-form-item>
                <!--客户名称-->
                <common-input v-model="formItem.custName" :label="$t('m.i.common.corpName')"
                              prop="custName" :maxlength=60 ></common-input>
                <!--统一社会信用代码-->
                <common-input v-model="formItem.socCode" :label="$t('m.i.common.socCode')"
                              prop="socCode" className="h-form-long-label" :maxlength=18></common-input>

                <!--登记状态-->
                <h-form-item :label="$t('m.i.ce.rgstStatus')" prop="custRgstStatus">
                  <h-select v-model="formItem.custRgstStatus" placeholder="" @on-change="changeStatus()" :clearable="false">
                    <h-option value="0">未登记</h-option>
                    <h-option value="1">已登记</h-option>
                  </h-select>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/bm/cpes/custsign/custCorpSign/func_queryCustCorpInfoByPage"
                      :bindForm="formItem"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="acctDetail()" :disabled=!this.isShowBotton>{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="acctDetail()" :disabled=this.isShowBotton>{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="cancelSignRgst()" :disabled=this.isShowBotton>{{$t("m.i.common.loginOut")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()"
                        :disabled="this.ifDisabledExport">{{$t("m.i.common.export")}}</h-button>

            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 明细弹出 -->
    <acct-detail-show :acctDetailShowWin="acctDetailShowWin" :batchParams="batchParams" :dictMap="dictMap"
                      @acctDetailShowWinClose="acctDetailShowWinClose" ref="acctDetailShow"></acct-detail-show>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, exportList, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "custCorpSign",
    components: {
      acctDetailShow:()=>import(/* webpackChunkName: "bm/sign/cpes/acctDetailShow" */`@/views/bizViews/bm/sign/cpes/acctDetailShow`),
    },
    data() {
      return {
        formItem: {
          custNo:"",
          custName:"",
          socCode:"",
          isArc:"",
          isGreenCorp:"",
          isTechnologyCorp:"",
          custRgstStatus:"1",
        },
        selectData: [],
        ifShowMore: false,
        isShowBotton : false,
        columns: [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custNo'),
            key: 'custNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.corpName'),
            key: 'custName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.socCode'),
            key: 'socCode',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.corpScale'),
            key: 'corpScale',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpScale);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.industryCategory'),
            key: 'industryCategory',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Industry", params.row.industryCategory);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.isArcFdisc'),
            key: 'isArc',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isArc);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.isGreenCorpFdisc'),
            key: 'isGreenCorp',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.bm.corpNature"),
            key: "corpNature",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CpesCorpNature", params.row.corpNature);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.isSciCorpFdisc'),
            key: 'isTechnologyCorp',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isTechnologyCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.bs.creditRating'),
            key: 'creditRating',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.cdtRatgAgcy'),
            key: 'creditRatingMain',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.cdtRatgDueDt'),
            key: 'creditRatgDueDt',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.rgstStatus'),
            key: 'custRgstStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CorpSignRgstStatus", params.row.custRgstStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        dictMap: new Map(),
        yonList:[],
        corpRgstStatusList:[],
        corpScaleList:[],
        corpNatureList:[],
        certTypeList:[],
        cespAcctTypeList:[],
        preRelationFlagList:[],
        industryCategoryList:[],
        custAcctKindList:[],
        attTypeCodeList:[],
        fileDetailStatusList:[],
        btnAuth: {},
        acctDetailShowWin: false,
        isMustSelect: true,
        hasCommit:true,
        batchParams: {},
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        ifDisabledExport: false,
      };
    },
    mounted() {
      this.getDictListByGroups("CorpSignRgstStatus,CpesCorpNature,Yon,Industry,CorpScale,CertType,CpesAcctType,CpesCorpNature,PreRelationFlag,custAcctKind,AttTypeCode,FileDetailStatus").then(res => {
          this.corpRgstStatusList = res.get("CorpSignRgstStatus");
          this.yonList = res.get("Yon");
          this.corpScaleList = res.get("CorpScale");
          this.corpNatureList = res.get("CpesCorpNature");
          this.certTypeList = res.get("CertType");
          this.cespAcctTypeList = res.get("CpesAcctType");
          this.preRelationFlagList = res.get("PreRelationFlag");
          this.industryCategoryList = res.get("Industry");
          this.custAcctKindList = res.get("custAcctKind");
          this.attTypeCodeList = res.get("AttTypeCode").filter(item => item.key === "FT08" ||item.key === "FT01");
          this.fileDetailStatusList = res.get("FileDetailStatus");
          this.dictMap = res.get("map");
        });
    },

    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = [];
      },
      //修改签约状态时刷新
      changeStatus() {
        if(this.formItem.custRgstStatus !== "1"){
          this.isShowBotton = true;
        }else{
          this.isShowBotton = false;
        }
        this.handleSearch();
      },
      //表单查询
      handleSearch() {
        this.selectData = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },

      acctDetail(){
        if (this.selectData.length < 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchParams.custRgstStatus = this.formItem.custRgstStatus;
        this.batchParams.custNo = this.selectData.custNo;
        this.batchParams.custId = this.selectData.id;
        this.batchParams.corpScaleList = this.corpScaleList;
        this.batchParams.yonList = this.yonList;
        this.batchParams.corpNatureList = this.corpNatureList;
        this.batchParams.certTypeList = this.certTypeList;
        this.batchParams.industryCategoryList = this.industryCategoryList;
        this.batchParams.attTypeCodeList = this.attTypeCodeList;
        this.batchParams.fileDetailStatusList = this.fileDetailStatusList;
        this.acctDetailShowWin = true;
      },

      acctDetailShowWinClose(status) {
        this.batchParams = {};
        this.acctDetailShowWin = false;
        this.formItem.custRgstStatus = status;
        this.handleSearch();
      },

      modifySignRgst(){
        if (this.selectData.length < 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let signId = this.selectData.id;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要对该企业进行修改登记吗") + "?",
          onOk: () => {
            let custNo = this.custNo;
            let url = "/bm/cpes/custsign/custCorpSign/func_custModifySign";
            post({ id: signId }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.handleClose();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },

      cancelSignRgst(){
        if (this.selectData.length < 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let custNo = this.selectData.custNo;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("请确认是否向票交所注销该企业") + "！",
          onOk: () => {
            let url = "/bm/cpes/custsign/custCorpSign/func_custCancelSign";
            post({ custNo: custNo,custRgstStatus:"9"}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.handleSearch();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "szbankCustCorpSignDataInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/bm/cpes/custsign/custCorpSign/func_exportCustCorpSignListExcel";
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params.ids = this.$refs.datagrid.selectIds;
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

    }
  };


</script>

<style scoped>

</style>
