<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-product v-model="formItem.prodName" @productSelectedChange="productSelectedChange"></show-product>
                <h-form-item prop="operStatus" :label="$t('m.i.common.operStatus')">
                  <h-select v-model="formItem.operStatus" placeholder="">
                    <h-option v-for="item in operStatusList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      :bindForm="formItem"
                      url="/bm/prod/guideRate/guideRateMain/func_queryProductGuideRateHisByGroup"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleForm()" v-if="authObj.guideRateAdd">{{$t('m.i.common.add')}}</h-button>
              <h-button type="primary" @click="copyOrEditHandleForm('modify')" v-if="authObj.guideRateModify">{{$t('m.i.common.modify')}}
              </h-button>
              <h-button type="primary" @click="deleteGuideRate()" v-if="authObj.guideRateDel">{{$t('m.i.common.delete')}}</h-button>
              <h-button type="primary" @click="copyOrEditHandleForm('copy')" v-if="authObj.guideRateCopy">{{$t('m.i.bm.copy')}}
              </h-button>
              <h-button type="primary" @click="submitToReview()" v-if="authObj.guideRateSubmit">{{$t('m.i.common.submit')}}</h-button>
              <h-button type="primary" @click="rollback()" v-if="authObj.guideRateRollback">{{$t('m.i.common.revocation')}}</h-button>
              <h-button type="primary" @click="viewRateDetails()" v-if="authObj.guideRateViews">{{$t('m.i.bm.viewRateDetails')}}</h-button>
              <h-button type="primary" @click="exportRateTem()" v-if="authObj.guideRateExport">{{$t('m.i.bm.exportRateTem')}}</h-button>
              <h-button type="primary" @click="importExcel()" v-if="authObj.guideRateImport">{{$t('m.i.common.import')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增弹出框 -->
    <h-msg-box v-model="addWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="addFormClose()"
               :mask-closable="false" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>新增指导利率</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="90" ref="addForm" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.prodName')" prop="prodNo" required>
            <h-select v-model="addForm.prodNo" placeholder="" @on-change="prodNoChange()">
              <h-option value="0106">贴现</h-option>
              <h-option value="010602">回购式贴现</h-option>
              <h-option value="010612">极速贴现</h-option>
              <h-option value="00101001">系统内转贴现转入</h-option>
              <h-option value="00101002">系统外转贴现转入</h-option>
              <h-option value="00101004">质押式逆回购</h-option>
              <h-option value="00101005">买断式逆回购</h-option>
              <h-option value="00102001">系统内转贴现卖出</h-option>
              <h-option value="00102002">系统外转贴现卖出</h-option>
              <h-option value="00102003">再贴现买断</h-option>
              <h-option value="00102004">质押式正回购</h-option>
              <h-option value="00102005">买断式正回购</h-option>
              <h-option value="00102006">再贴现质押式回购</h-option>
              <h-option value="00409001">权属内转</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.activeDt')" prop="activeDt" required>
            <h-date-picker type="date" v-model="addForm.activeDt" placeholder=""
                           @on-change="dateChange()"></h-date-picker>
          </h-form-item>

          <h-form-item label="渠道" prop="channelNoArray" required v-if="authObj.showChannel">
            <h-select v-model="addForm.channelNoArray" placeholder="" multiple showTitle @on-change="channelChange()">
              <h-option v-for="item in channelList" :value="item.channelNo" :key="item.channelNo">{{item.channelName}}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item class="h-form-operate " :class="[authObj.showChannel?'ont-form':'two-form']">
            <h-button type="primary" @click="addHandleSearch()" :disabled="searchDisabled">{{$t("m.i.common.search")}}
            </h-button>
          </h-form-item>
        </h-form>
        <h-datagrid :columns="addColumns"
                    :autoLoad="false"
                    getDataFunc
                    @get-data="getProductRateDataList"
                    :gridData="addProductRateData"
                    highlight-row
                    :height="350"
                    ref="addDatagrid" class="pl-5 pr-5">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addFormClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 修改、复制弹出框 -->
    <h-msg-box v-model="editOrCopyWin" width="1000" class="h-form-table-layer" :maximize="true" :mask-closable="false" top="10">
      <p slot="header">
        <span v-if="type=='modify'">修改指导利率</span>
        <span v-if="type=='copy'">复制指导利率</span>
      </p>
      <div>
        <h-form :model="editOrCopyForm" :label-width="90" ref="editOrCopyForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.activeDt')" prop="activeDt" required>
            <h-date-picker type="date" v-model="editOrCopyForm.activeDt" placeholder=""
                           :options="dateOptions"
                           :readonly="editActiveDtReadonly"></h-date-picker>
          </h-form-item>
        </h-form>
        <h-datagrid :columns="editOrCopyColumns"
                    highlight-row
                    getDataFunc
                    @get-data="getProductRateEditOrCopyDataList"
                    :gridData="editOrCopyProductRateData"
                    :autoLoad="false"
                    :height="350"
                    ref="editOrCopyDatagrid" class="pl-5 pr-5">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="editOrCopyWin=!editOrCopyWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formEditOrCopy()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 查看利率明细弹出框 -->
    <h-msg-box v-model="showRateDetailWin" width="800" class="h-form-table-layer" :maximize="true"
               :mask-closable="false">
      <!--弹出框模式标题-->
      <p slot="header">
        <span>查看利率明细</span>
      </p>
      <!-- 数据展示表格 -->
      <h-datagrid :columns="showRateColumns"
                  highlight-row
                  :autoLoad="false"
                  url="/bm/prod/guideRate/guideRateMain/func_queryProductGuideRateHisByPage"
                  :bindForm="showRateFormItem"
                  :height="350"
                  ref="showRateDatagrid" class="pl-5 pr-5">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="showRateDetailsWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 导入 -->
    <common-file-upload-no-show :import-win="this.importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "guideRateMain",
    data() {
      let formItem = {
        prodName: "",
        operStatus: "",
        qryType: "0" //0-指导利率设置页面、1-指导利率复核页面、2-指导利率跟踪查询页面
      };
      let addForm = {
        prodNo: "",
        prodName: "",
        activeDt: "",
        channelNoArray:[],
      };
      let editOrCopyForm = {
        prodNo: "",
        activeDt: "",
        operDtTm: "",
        operStatus: "",
        channelNoArray:[],
        channelNameArray:""
      };
      let showRateFormItem = {
        prodNo: "",
        activeDt: "",
        operDtTm: "",
        operStatus: ""
      };
      let columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
        },
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: true,
          align: "center"
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
          title: this.$t("m.i.common.prodNo"),
          key: "prodNo",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.channelNameArray"),
          key: "channelNameArray",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.activeDt'),
          key: "activeDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.activeDt == null || params.row.activeDt === "") {
              return "";
            }
            let date = this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.common.createDt'),
          key: "operDtTm",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.operDtTm == null || params.row.operDtTm === "") {
              return "";
            }
            let date = this.$moment(params.row.operDtTm, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.common.operStatus"),
          key: "operStatus",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "AuditStatusCode", params.row.operStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        }
      ];
      let addColumns = [
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.channelNameArray"),
          key: "channelNameArray",
          sortable: true,
          hiddenCol: true
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        }
      ];
      let authObj = {
        guideRateAdd: true,
        guideRateModify: true,
        guideRateDel: true,
        guideRateCopy: true,
        guideRateSubmit: true,
        guideRateRollback: true,
        guideRateViews: true,
        guideRateExport: true,
        guideRateImport: true,
        showChannel: false,//新增指标分配显示渠道
      };
      let addColumnsStart = [
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          key: "numOrder",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
          }
        }
      ];
      let fileParams = {
        fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/bm/prod/guideRate/guideRateMain/func_inportProductGuideRate",  //excel数据导入接口
        uploadParams: {}       //调用excel数据解析接口时附带的额外参数
      };
      let _that = this;
      return {
        formItem: formItem,
        addForm: addForm,
        editOrCopyForm: editOrCopyForm,
        showRateFormItem: showRateFormItem,
        columns: columns,
        addColumns: addColumns,
        authObj: authObj,
        addColumnsStart: addColumnsStart,
        fileParams: fileParams,
        selectData:null,
        cannotSubmit: false,
        editActiveDtReadonly: false,
        submitInfoMap: new Map(),
        addProductRateData: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        editOrCopyProductRateData: { rows: [], total: 1 },
        arrSubmit: [],
        editOrCopyColumns: [],
        showRateColumns: [],
        searchOpen: "0",
        searchTrue: false,
        type: "",
        showRateDetailWin: false,
        addWin: false,
        editOrCopyWin: false,
        addGuideProductNextWin: false,
        submitFlag: false,
        readonly: false,
        dateOptions: {
          disabledDate (date) {
            return date && date.valueOf() < _that.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
          }
        },
        sysParam: false,
        dictMap: new Map(),
        operStatusList: [],
        importWin: false,
        rateBusiDate: "",
        addFormProdName: "",
        prodMap: new Map(),
        channelList:[],
      };
    },
    computed: {
      searchDisabled() {
        return this.searchOpen == "1" ? false : true;
      },
    },
    mounted() {
      this.getDictListByGroups("AuditStatusCode,DraftTypeCode,CDMedia,bankLevel,bankType,CorpScale,Yon").then(res => {
        this.operStatusList = res.get("AuditStatusCode");
        this.operStatusList = this.operStatusList.filter(item => item.key === "11" || item.key === "12"|| item.key === "13" ||
            item.key === "21" || item.key === "22"|| item.key === "23" ||
            item.key === "31" || item.key === "32"|| item.key === "33" );
        this.dictMap = res.get("map");
      });
      post({}, "/bm/prod/guideRate/guideRateMain/func_getAllChannels").then(res => {
        if (res) {
          if (res.data.retCode === "000000") {
            this.channelList = res.data.retData;
          }
        }
      });
      this.getBusiDate();
      this.getParamInfo();
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      getProductRateDataList() {
        let url = "/bm/prod/guideRate/guideRateMain/func_queryProductGuideTemplateByPage";
        post({
          "prodNo": this.addForm.prodNo,
          "channelNoArray": this.addForm.channelNoArray,
          "pageNo": this.$refs.addDatagrid.pageInfo.pageNo,
          "pageSize": this.$refs.addDatagrid.pageInfo.pageSize
        }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                if (res.data.retData.list.length === 0) {
                  if (this.addForm.prodNo === "0106") {
                    this.addFormProdName = "贴现";
                  } else if (this.addForm.prodNo === "010602") {
                    this.addFormProdName = "回购式贴现";
                  } else if (this.addForm.prodNo === "010612") {
                    this.addFormProdName = "极速贴现";
                  } else if (this.addForm.prodNo === "00101001") {
                    this.addFormProdName = "系统内转贴现转入";
                  } else if (this.addForm.prodNo === "00101002") {
                    this.addFormProdName = "系统外转贴现转入";
                  } else if (this.addForm.prodNo === "00101004") {
                    this.addFormProdName = "质押式逆回购";
                  } else if (this.addForm.prodNo === "00101005") {
                    this.addFormProdName = "买断式逆回购";
                  } else if (this.addForm.prodNo === "00102001") {
                    this.addFormProdName = "系统内转贴现卖出";
                  } else if (this.addForm.prodNo === "00102002") {
                    this.addFormProdName = "系统外转贴现卖出";
                  } else if (this.addForm.prodNo === "00102003") {
                    this.addFormProdName = "再贴现买断";
                  } else if (this.addForm.prodNo === "00102004") {
                    this.addFormProdName = "质押式正回购";
                  } else if (this.addForm.prodNo === "00102005") {
                    this.addFormProdName = "买断式正回购";
                  } else if (this.addForm.prodNo === "00102006") {
                    this.addFormProdName = "再贴现质押式回购";
                  } else if (this.addForm.prodNo === "00409001") {
                    this.addFormProdName = "权属内转";
                  }
                  this.$msgTip.info(this, { info: "该产品【" + this.addFormProdName + "】的利率模板为空，请先维护！" });
                }
                let data = res.data.retData;
                for (let i = 0; i < data.list.length; i++) {
                  if (this.submitInfoMap.get(data.list[i].id) !== undefined) {
                    data.list[i].ratePct = this.submitInfoMap.get(data.list[i].id).ratePct;
                    if (this.sysParam) {
                      data.list[i].costRatePct = this.submitInfoMap.get(data.list[i].id).costRatePct;
                    }
                  }
                }
                this.addProductRateData = data;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      getProductRateEditOrCopyDataList() {
        let url = "/bm/prod/guideRate/guideRateMain/func_queryProductGuideRateHisByPage";
        if(this.type === "copy"){
          url = "/bm/prod/guideRate/guideRateMain/func_xcopyProductGuideRateHisByPage";
        }
        // copy时 还是使用其原来的日期去查询，否则会查不到当日期进行了修改
        let activeDt = this.selectData.activeDt
        post({
          "prodNo": this.editOrCopyForm.prodNo, "activeDt": activeDt, "operDtTm": this.editOrCopyForm.operDtTm,
          "operStatus": this.editOrCopyForm.operStatus, "pageNo": this.$refs.editOrCopyDatagrid.pageInfo.pageNo,
          "pageSize": this.$refs.editOrCopyDatagrid.pageInfo.pageSize
        }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                let data = res.data.retData;
                for (let i = 0; i < data.list.length; i++) {
                  if (this.submitInfoMap.get(data.list[i].id) !== undefined) {
                    data.list[i].ratePct = this.submitInfoMap.get(data.list[i].id).ratePct;
                    if (this.sysParam) {
                      data.list[i].costRatePct = this.submitInfoMap.get(data.list[i].id).costRatePct;
                    }
                  }
                }
                this.editOrCopyProductRateData = data;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      getSysParam() {
        if (this.sysParam) {
          this.addColumns.push(
            {
              title: "成本利率(%)",
              key: "costRatePct",
              hiddenCol: false,
              render: (h, params) => {
                let inp = h("input",
                  {
                    domProps: {
                      name: "costRatePct",
                      value: params.row.costRatePct
                    },
                    on: {
                      change: (event) => {
                        this.costRatePctSubmitInfo(params.row.id, event.currentTarget.value);
                      }
                    }
                  });
                return h("div", [inp]);
              }
            }
          );
        }
      },
      getSysParamEdit() {
        if (this.sysParam) {
          this.editOrCopyColumns.push(
            {
              title: "成本利率(%)",
              key: "costRatePct",
              hiddenCol: false,
              render: (h, params) => {
                let inp = h("input",
                  {
                    domProps: {
                      name: "costRatePct",
                      value: params.row.costRatePct
                    },
                    on: {
                      change: (event) => {
                        this.editOrCopyCostRatePctSubmitInfo(params.row.id, params.row.ratePct, event.currentTarget.value);
                      }
                    }
                  });
                return h("div", [inp]);
              }
            }
          );
        }
      },
      getSysParamShowRateDetail() {
        if (this.sysParam) {
          this.showRateColumns.push(
            {
              title: "成本利率(%)",
              key: "costRatePct",
              hiddenCol: false
            }
          );
        }
        this.$nextTick(() => {
          this.$refs.showRateDatagrid.createShowCol(this.showRateColumns);
        });
      },
      getKpiView() {
        this.addColumns = [];
        let selectProductNo = this.addForm.prodNo;
        let channelNoArray = this.addForm.channelNoArray;
        return post({ prodNo: selectProductNo,channelNoArray:channelNoArray }, "/bm/prod/guideRate/guideRateMain/func_queryProductRateKpi").then(res => {
          if (res && res.data) {

            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.addColumns.push(
              {
                type: "index",
                title: this.$t("m.i.common.index"),
                key: "numOrder",
                width: 60,
                align: "center",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.prodName"),
                key: "prodName",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.channelNameArray"),
                key: "channelNameArray",
                sortable: true,
                hiddenCol: true
              },
              {
                title: this.$t('m.i.billInfo.billType'),
                key: "billType",
                hiddenCol: false,
                render: (h, params) => {
                  return h("span", getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
                }
              }
            );
            for (let item of data) {
              if (item.kpiCode === "isGreenCorp") {
                this.addColumns.push({
                  title: this.$t('m.i.common.isGreenCorpFdisc'),
                  key: "isGreenCorp",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp));
                  }
                });
              }
              if (item.kpiCode === "isArc") {
                this.addColumns.push({
                  title: this.$t('m.i.common.isArcFdisc'),
                  key: "isArc",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isArc));
                  }
                });
              }
              if (item.kpiCode === "billClass") {
                this.addColumns.push({
                  title: this.$t('m.i.billInfo.billClass'),
                  key: "billClass",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass));
                  }
                });
              }
              if (item.kpiCode === "acptBankLevel") {
                this.addColumns.push({
                  title: this.$t('m.i.billInfo.acptTopBankLevel'),
                  hiddenCol: false,
                  key: "acptBankLevel",
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.acptBankLevel));
                  }
                });
              } else if(item.kpiCode === "acptBankType"){
                this.addColumns.push({
                  title: this.$t('m.i.billInfo.acptBankType'),
                  hiddenCol: false,
                  key: "acptBankType",
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankType", params.row.acptBankType));
                  }
                });
              } else if (item.kpiCode === "discBankLevel") {
                this.addColumns.push({
                  title: "贴现行级别",
                  key: "discBankLevel",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.discBankLevel));
                  }
                });
              } else if (item.kpiCode === "corpType") {
                this.addColumns.push({
                  title: this.$t('m.i.common.corpScale'),
                  key: "corpType",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpType));
                  }
                });
              } else if (item.kpiCode === "billMoney") {
                this.addColumns.push({
                  title: "最小票面金额(元)",
                  key: "minBillAmt",
                  hiddenCol: false
                }, {
                  title: "最大票面金额(元)",
                  key: "maxBillAmt",
                  hiddenCol: false
                });
              } else if (item.kpiCode === "remainDays") {
                this.addColumns.push({
                  title: "最小剩余期限(天)",
                  key: "minResidualTerm",
                  hiddenCol: false
                }, {
                  title: "最大剩余期限(天)",
                  key: "maxResidualTerm",
                  hiddenCol: false
                });
              } else if (item.kpiCode === "remainMonths") {
                this.addColumns.push({
                  title: "最小剩余跨月数量(月)",
                  key: "minResidueMonthNum",
                  hiddenCol: false
                }, {
                  title: "最大剩余跨月数量(月)",
                  key: "maxResidueMonthNum",
                  hiddenCol: false
                });
              }
            }
            this.addColumns.push({
              title: "指导利率(%)",
              key: "ratePct",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                let inp = h("input",
                  {
                    domProps: {
                      name: "ratePct",
                      value: params.row.ratePct
                    },
                    on: {
                      change: (event) => {
                        this.ratePctSubmitInfo(params.row.id, event.currentTarget.value);
                      }
                    }
                  });
                return h("div", [inp]);
              }
            });
            this.getSysParam();
          }
          //判断是否添加渠道字段
          this.addColumns.splice(3,0,{
            title: this.$t("m.i.common.channelNameArray"),
            key: "channelNameArray",
            sortable: true,
            hiddenCol: !this.isChannelMode(selectProductNo)
          });
        });
      },
      getKpiViewEditOrCopy() {
        this.editOrCopyColumns = [];
        let selectProductNo = this.selectData.prodNo;
        let channelNoArray = this.selectData.channelNoArray;
        return post({ prodNo: selectProductNo,channelNoArray:channelNoArray }, "/bm/prod/guideRate/guideRateMain/func_queryProductRateKpi").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.editOrCopyColumns.push(
              {
                type: "index",
                title: this.$t("m.i.common.index"),
                key: "numOrder",
                width: 60,
                align: "center",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.prodName"),
                key: "prodName",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.channelNameArray"),
                key: "channelNameArray",
                sortable: true,
                hiddenCol: true
              },
              {
                title: this.$t('m.i.billInfo.billType'),
                key: "billType",
                hiddenCol: false,
                render: (h, params) => {
                  return h("span", getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
                }
              }
            );
            for (let item of data) {
              if (item.kpiCode === "isGreenCorp") {
                this.editOrCopyColumns.push({
                  title: this.$t('m.i.common.isGreenCorpFdisc'),
                  key: "isGreenCorp",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp));
                  }
                });
              };
              if (item.kpiCode === "isArc") {
                this.editOrCopyColumns.push({
                  title: this.$t('m.i.common.isArcFdisc'),
                  key: "isArc",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isArc));
                  }
                });
              };
              if (item.kpiCode === "billClass") {
                this.editOrCopyColumns.push({
                  title: this.$t('m.i.billInfo.billClass'),
                  key: "billClass",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass));
                  }
                });
              }
              ;
              if (item.kpiCode === "acptBankLevel") {
                this.editOrCopyColumns.push({
                  title: this.$t('m.i.billInfo.acptTopBankLevel'),
                  key: "acptBankLevel",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.acptBankLevel));
                  }
                });
              } else if(item.kpiCode === "acptBankType"){
                this.editOrCopyColumns.push({
                  title: this.$t('m.i.billInfo.acptBankType'),
                  hiddenCol: false,
                  key: "acptBankType",
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankType", params.row.acptBankType));
                  }
                });
              } else if (item.kpiCode === "discBankLevel") {
                this.editOrCopyColumns.push({
                  title: "贴现行级别",
                  key: "discBankLevel",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.discBankLevel));
                  }
                });
              } else if (item.kpiCode === "corpType") {
                this.editOrCopyColumns.push({
                  title: this.$t('m.i.common.corpScale'),
                  key: "corpType",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpType));
                  }
                });
              } else if (item.kpiCode === "billMoney") {
                this.editOrCopyColumns.push({
                  title: "最小票面金额(元)",
                  key: "minBillAmt",
                  hiddenCol: false
                }, {
                  title: "最大票面金额(元)",
                  key: "maxBillAmt",
                  align: "left",
                  hiddenCol: false
                });
              } else if (item.kpiCode === "remainDays") {
                this.editOrCopyColumns.push({
                  title: "最小剩余期限(天)",
                  key: "minResidualTerm",
                  hiddenCol: false
                }, {
                  title: "最大剩余期限(天)",
                  key: "maxResidualTerm",
                  hiddenCol: false
                });
              } else if (item.kpiCode === "remainMonths") {
                this.editOrCopyColumns.push({
                  title: "最小剩余跨月数量(月)",
                  key: "minResidueMonthNum",
                  hiddenCol: false
                }, {
                  title: "最大剩余跨月数量(月)",
                  key: "maxResidueMonthNum",
                  hiddenCol: false
                });
              }
            }
            this.editOrCopyColumns.push({
              title: "指导利率(%)",
              key: "ratePct",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                let inp = h("input",
                  {
                    domProps: {
                      name: "ratePct",
                      value: params.row.ratePct
                    },
                    on: {
                      change: (event) => {
                        this.editOrCopyRatePctSubmitInfo(params.row.id, event.currentTarget.value, params.row.costRatePct);
                      }
                    }
                  });
                return h("div", [inp]);
              }
            });

            //判断是否添加渠道字段
            this.editOrCopyColumns.splice(3,0,{
              title: this.$t("m.i.common.channelNameArray"),
              key: "channelNameArray",
              sortable: true,
              hiddenCol: !this.isChannelMode(this.selectData.prodNo)
            });
            this.getSysParamEdit();
          }
        });
      },
      getKpiShowRateDetail() {
        this.showRateColumns = [];
        let selectProductNo = this.selectData.prodNo;
        let channelNoArray = this.selectData.channelNoArray;
        return post({ prodNo: selectProductNo,channelNoArray:channelNoArray }, "/bm/prod/guideRate/guideRateMain/func_queryProductRateKpi").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.showRateColumns.push(
              {
                type: "index",
                title: this.$t("m.i.common.index"),
                width: 60,
                align: "center",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.prodName"),
                key: "prodName",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.channelNameArray"),
                key: "channelNameArray",
                sortable: true,
                hiddenCol: true
              },
              {
                title: this.$t('m.i.billInfo.billType'),
                key: "billType",
                hiddenCol: false,
                render: (h, params) => {
                  return h("span", getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
                }
              }
            );
            for (let item of data) {
              if (item.kpiCode === "isGreenCorp") {
                this.showRateColumns.push({
                  title: this.$t('m.i.common.isGreenCorpFdisc'),
                  key: "isGreenCorp",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp));
                  }
                });
              }
              if (item.kpiCode === "isArc") {
                this.showRateColumns.push({
                  title: this.$t('m.i.common.isArcFdisc'),
                  key: "isArc",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isArc));
                  }
                });
              }
              if (item.kpiCode === "billClass") {
                this.showRateColumns.push({
                  title: this.$t('m.i.billInfo.billClass'),
                  key: "billClass",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass));
                  }
                });
              }
              ;
              if (item.kpiCode === "acptBankLevel") {
                this.showRateColumns.push({
                  title: this.$t('m.i.billInfo.acptTopBankLevel'),
                  key: "acptBankLevel",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.acptBankLevel));
                  }
                });
              } else if(item.kpiCode === "acptBankType"){
                this.showRateColumns.push({
                  title: this.$t('m.i.billInfo.acptBankType'),
                  hiddenCol: false,
                  key: "acptBankType",
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankType", params.row.acptBankType));
                  }
                });
              } else if (item.kpiCode === "discBankLevel") {
                this.showRateColumns.push({
                  title: "贴现行级别",
                  key: "discBankLevel",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.discBankLevel));
                  }
                });
              } else if (item.kpiCode === "corpType") {
                this.showRateColumns.push({
                  title: this.$t('m.i.common.corpScale'),
                  key: "corpType",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpType));
                  }
                });
              } else if (item.kpiCode === "billMoney") {
                this.showRateColumns.push({
                  title: "最小票面金额(元)",
                  key: "minBillAmt",
                  hiddenCol: false
                }, {
                  title: "最大票面金额(元)",
                  key: "maxBillAmt",
                  hiddenCol: false
                });
              } else if (item.kpiCode === "remainDays") {
                this.showRateColumns.push({
                  title: "最小剩余期限(天)",
                  key: "minResidualTerm",
                  hiddenCol: false
                }, {
                  title: "最大剩余期限(天)",
                  key: "maxResidualTerm",
                  hiddenCol: false
                });
              } else if (item.kpiCode === "remainMonths") {
                this.showRateColumns.push({
                  title: "最小剩余跨月数量(月)",
                  key: "minResidueMonthNum",
                  hiddenCol: false
                }, {
                  title: "最大剩余跨月数量(月)",
                  key: "maxResidueMonthNum",
                  hiddenCol: false
                });
              }
            }
            this.showRateColumns.push({
              title: "指导利率(%)",
              key: "ratePct",
              sortable: true,
              hiddenCol: false
            });
            //判断是否添加渠道字段
            this.showRateColumns.splice(3,0,{
              title: this.$t("m.i.common.channelNameArray"),
              key: "channelNameArray",
              sortable: true,
              hiddenCol: !this.isChannelMode(selectProductNo)
            });
            this.getSysParamShowRateDetail();
          }
        });
      },
      ratePctSubmitInfo(id, ratePct) {
        if (this.submitInfoMap.get(id) !== undefined) {
          this.submitInfoMap.get(id).ratePct = ratePct;
        } else {
          this.submitInfoMap.set(id, { id: id, ratePct: ratePct });
        }
        let el = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (!(el.test(ratePct) || ratePct === "" || ratePct === null || ratePct === undefined)) {
          this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
          return;
        }
      },
      costRatePctSubmitInfo(id, costRatePct) {
        if (this.submitInfoMap.get(id) !== undefined) {
          this.submitInfoMap.get(id).costRatePct = costRatePct;
        } else {
          this.submitInfoMap.set(id, { id: id, costRatePct: costRatePct });
        }
        let el = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (!(el.test(costRatePct) || costRatePct === "" || costRatePct === null || costRatePct === undefined)) {
          this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
          return;
        }
      },
      editOrCopyCostRatePctSubmitInfo(id, ratePct, costRatePct) {
        if (this.submitInfoMap.get(id) !== undefined) {
          this.submitInfoMap.get(id).costRatePct = costRatePct;
        } else {
          this.submitInfoMap.set(id, { id: id, costRatePct: costRatePct, ratePct: ratePct });
        }
        let el = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (!(el.test(costRatePct) || costRatePct === "" || costRatePct === null || costRatePct === undefined)) {
          this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
          return;
        }
      },
      editOrCopyRatePctSubmitInfo(id, ratePct, costRatePct) {
        if (this.submitInfoMap.get(id) !== undefined) {
          this.submitInfoMap.get(id).ratePct = ratePct;
        } else {
          this.submitInfoMap.set(id, { id: id, ratePct: ratePct, costRatePct: costRatePct });
        }
        let el = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (!(el.test(ratePct) || ratePct === "" || ratePct === null || ratePct === undefined)) {
          this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
          return;
        }
      },
      prodNoChange() {
        //产品为极速贴现时，显示【渠道】下拉框
        if(this.isChannelMode(this.addForm.prodNo)){
          this.authObj.showChannel = true;
        }else{
          this.authObj.showChannel = false;
          this.addForm.channelNoArray = [];
        }
        this.searchOpen = "0";
        this.searchTrue = false;
        if (this.addForm.prodNo != "" && this.addForm.prodNo != null && this.addForm.activeDt != "" && this.addForm.activeDt != null) {
          this.searchOpen = "1";
          //渠道未选择查询按钮灰显
          if(this.isChannelMode(this.addForm.prodNo) && this.addForm.channelNoArray.length === 0){
            this.searchOpen = "0";
          }else{
            this.searchOpen = "1";
          }
        }
      },
      dateChange() {
        this.searchOpen = "0";
        if (this.addForm.prodNo != "" && this.addForm.prodNo != null &&
          this.addForm.activeDt != "" && this.addForm.activeDt != null) {
          this.searchOpen = "1";
          //渠道未选择查询按钮灰显
          if(this.isChannelMode(this.addForm.prodNo) && this.addForm.channelNoArray.length === 0){
            this.searchOpen = "0";
          }else{
            this.searchOpen = "1";
          }
        }
      },
      channelChange(){
        this.searchOpen = "0";
        if (this.addForm.prodNo != "" && this.addForm.prodNo != null &&
          this.addForm.activeDt != "" && this.addForm.activeDt != null) {
          this.searchOpen = "1";
          //渠道未选择查询按钮灰显
          if(this.isChannelMode(this.addForm.prodNo) && this.addForm.channelNoArray.length === 0){
            this.searchOpen = "0";
          }else{
            this.searchOpen = "1";
          }
        }
        this.searchTrue = false;
      },
      //获取当前营业日期
      getBusiDate() {
        post({}, "/sm/oper/busiDate/viewBusiDate").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.rateBusiDate = res.data.retData.workday + "";
            } else {
              this.$msgTip.error(this, { info: "营业日期获取异常" + msg });
            }
          }
        });
      },
      //选择产品名称弹出框确认
      productSelectedChange(arr) {
        this.formItem.prodName = arr[0].title;
      },
      //表单查询
      handleSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      //新增表单查询
      handleSearchAddForm() {
        this.$refs.addDatagrid.dataChange(1, (data) => {
          if (data.length === 0) {
            if (this.addForm.prodNo === "0106") {
              this.addFormProdName = "贴现";
            } else if (this.addForm.prodNo === "010602") {
              this.addFormProdName = "回购式贴现";
            } else if (this.addForm.prodNo === "010612") {
              this.addFormProdName = "极速贴现";
            } else if (this.addForm.prodNo === "00101001") {
              this.addFormProdName = "系统内转贴现转入";
            } else if (this.addForm.prodNo === "00101002") {
              this.addFormProdName = "系统外转贴现转入";
            } else if (this.addForm.prodNo === "00101004") {
              this.addFormProdName = "质押式逆回购";
            } else if (this.addForm.prodNo === "00101005") {
              this.addFormProdName = "买断式逆回购";
            } else if (this.addForm.prodNo === "00102001") {
              this.addFormProdName = "系统内转贴现卖出";
            } else if (this.addForm.prodNo === "00102002") {
              this.addFormProdName = "系统外转贴现卖出";
            } else if (this.addForm.prodNo === "00102003") {
              this.addFormProdName = "再贴现买断";
            } else if (this.addForm.prodNo === "00102004") {
              this.addFormProdName = "质押式正回购";
            } else if (this.addForm.prodNo === "00102005") {
              this.addFormProdName = "买断式正回购";
            } else if (this.addForm.prodNo === "00102006") {
              this.addFormProdName = "再贴现质押式回购";
            } else if (this.addForm.prodNo === "00409001") {
              this.addFormProdName = "权属内转";
            }
            this.$msgTip.info(this, { info: "该产品【" + this.addFormProdName + "】的利率模板为空，请先维护！" });
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.qryType = "0";
      },
      //新增
      handleForm() {
        this.addColumns = this.addColumnsStart;
        this.searchTrue = false;
        this.addWin = true;
        this.$nextTick(() => {
          this.$refs.addDatagrid.$refs.gridContent.handleResize();
        });

      },
      //新增页面提交
      formAdd() {
        this.cannotSubmit = false;
        this.arrSubmit = [];
        if ((this.addForm.activeDt === "" || this.addForm.activeDt === null) && (this.addForm.prodNo === "" || this.addForm.prodNo === null)) {
          this.$msgTip.info(this, { info: "产品名称和生效日期均不能为空！" });
          return;
        }
        if (this.addForm.activeDt === "" || this.addForm.activeDt === null) {
          this.$msgTip.info(this, { info: "生效日期不能为空！" });
          return;
        }
        if (this.addForm.prodNo === "" || this.addForm.prodNo === null) {
          this.$msgTip.info(this, { info: "产品名称不能为空！" });
          return;
        }
        if (this.searchTrue === false) {
          if (this.addForm.prodNo === "0106") {
            this.addFormProdName = "贴现";
          } else if (this.addForm.prodNo === "010602") {
            this.addFormProdName = "回购式贴现";
          } else if (this.addForm.prodNo === "010612") {
            this.addFormProdName = "极速贴现";
          } else if (this.addForm.prodNo === "00101001") {
            this.addFormProdName = "系统内转贴现转入";
          } else if (this.addForm.prodNo === "00101002") {
            this.addFormProdName = "系统外转贴现转入";
          } else if (this.addForm.prodNo === "00101004") {
            this.addFormProdName = "质押式逆回购";
          } else if (this.addForm.prodNo === "00101005") {
            this.addFormProdName = "买断式逆回购";
          } else if (this.addForm.prodNo === "00102001") {
            this.addFormProdName = "系统内转贴现卖出";
          } else if (this.addForm.prodNo === "00102002") {
            this.addFormProdName = "系统外转贴现卖出";
          } else if (this.addForm.prodNo === "00102003") {
            this.addFormProdName = "再贴现买断";
          } else if (this.addForm.prodNo === "00102004") {
            this.addFormProdName = "质押式正回购";
          } else if (this.addForm.prodNo === "00102005") {
            this.addFormProdName = "买断式正回购";
          } else if (this.addForm.prodNo === "00102006") {
            this.addFormProdName = "再贴现质押式回购";
          } else if (this.addForm.prodNo === "00409001") {
            this.addFormProdName = "权属内转";
          }
          this.$msgTip.info(this, { info: "请先点击查询，查询新条件的利率模板！" });
          return;
        }
        let url = "/bm/prod/guideRate/guideRateMain/func_addProductGuideRate";
        let arr = this.$refs.addDatagrid.tData;
        if (arr.length === 0) {
          this.$msgTip.info(this, { info: "该产品【" + this.addFormProdName + "】的利率模板为空，请先维护！" });
          return;
        }
        this.submitInfoMap.forEach((value, key) => {
          let el = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
          if (!(el.test(value.costRatePct) || value.costRatePct === "" || value.costRatePct === null || value.costRatePct === undefined)) {
            this.cannotSubmit = true;
          }
          if (!(el.test(value.ratePct) || value.ratePct === "" || value.ratePct === null || value.ratePct === undefined)) {
            this.cannotSubmit = true;
          }
          this.arrSubmit.push(value);
        });
        if (this.cannotSubmit) {
          this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
          return;
        }
        let productGuideRatejson = JSON.stringify(this.arrSubmit);
        let activeDt = this.$moment(this.addForm.activeDt).format("YYYYMMDD");
        this.submitFlag = true;
        post({
          productGuideRatejson: productGuideRatejson,
          activeDt: activeDt,
          prodNo: this.addProdNo,
          channelNoArray:this.addForm.channelNoArray
        }, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.selectData = null;
              this.addFormClose();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //新增产品利率表单查询
      async addHandleSearch() {
        this.submitInfoMap = new Map();
        this.$refs.addDatagrid.tData = [];
        await this.getKpiView();
        this.searchTrue = true;
        this.handleSearchAddForm();
        this.addProdNo = this.addForm.prodNo;
      },
      addFormClose() {
        this.$refs.addForm.resetFields();
        this.addForm.channelNoArray = [];
        this.$refs.addDatagrid.tData = [];
        this.addProductRateData　={
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        };
        this.addColumns = this.addColumnsStart;
        this.addWin = false;
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.addDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //修改、复制
      copyOrEditHandleForm(str) {
        this.submitInfoMap = new Map();
        this.editActiveDtReadonly = false;
        this.type = str;
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.selectData.operStatus === "13" || this.selectData.operStatus === "23" || this.selectData.operStatus === "33") {
          this.editActiveDtReadonly = true;
        }
        if ((Number(this.rateBusiDate) > Number(this.selectData.activeDt + "")) && this.type === "modify") {
          this.$msgTip.info(this, { info: "生效日期在当前营业日之前的数据不可【修改】！" });
          return;
        }
        if (((this.selectData.operStatus === "12" || this.selectData.operStatus === "22"
          || this.selectData.operStatus === "32" || this.selectData.operStatus === "33" || this.selectData.operStatus === "31")) && this.type === "modify") {
          this.$msgTip.info(this, { info: "待审核状态和删除的数据不可【修改】！" });
          return;
        }
        if(this.type === "copy"){
          if(this.selectData.operStatus !== "13" && this.selectData.operStatus !== "23"){
            this.$msgTip.info(this, { info: "只有【新增审核通过】和【变更审核通过】的数据允许复制" });
            return;
          }
          this.editActiveDtReadonly = false;
        }
        this.editOrCopyWin = true;
        this.$nextTick(async () => {
          this.$refs.editOrCopyDatagrid.tData = [];
          await this.getKpiViewEditOrCopy();
          this.editOrCopyForm.operDtTm = this.selectData.operDtTm;
          this.editOrCopyForm.operStatus = this.selectData.operStatus;
          this.editOrCopyForm.prodNo = this.selectData.prodNo;
          this.editOrCopyForm.activeDt = this.selectData.activeDt + "";//将int类型转化成日期类型
          this.prodNo = this.selectData.prodNo;
          this.editOrCopyForm.channelNoArray = this.selectData.channelNoArray;
          this.editOrCopyForm.channelNameArray = this.selectData.channelNameArray;
          this.$refs.editOrCopyDatagrid.dataChange(1);
        });
      },
      //修改、复制页面提交
      formEditOrCopy() {
        this.cannotSubmit = false;
        this.arrSubmit = [];
        let url = this.type === "modify" ? "/bm/prod/guideRate/guideRateMain/func_updateProductGuideRate" : "/bm/prod/guideRate/guideRateMain/func_copyProductGuideRate";
        if (this.editOrCopyForm.activeDt === "" || this.editOrCopyForm.activeDt === null) {
          this.$msgTip.info(this, { info: "生效日期不能为空！" });
          return;
        }
        this.submitInfoMap.forEach((value, key) => {
          let el = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
          if (!(el.test(value.costRatePct) || value.costRatePct === "" || value.costRatePct === null || value.costRatePct === undefined)) {
            this.cannotSubmit = true;
          }
          if (!(el.test(value.ratePct) || value.ratePct === "" || value.ratePct === null || value.ratePct === undefined)) {
            this.cannotSubmit = true;
          }
          this.arrSubmit.push(value);
        });
        if (this.cannotSubmit) {
          this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
          return;
        }
        let productGuideRatejson = JSON.stringify(this.arrSubmit);
        let activeDt = this.$moment(this.editOrCopyForm.activeDt).format("YYYYMMDD");
        this.submitFlag = true;
        post({
          productGuideRatejson: productGuideRatejson,
          activeDt: activeDt,
          prodNo: this.selectData.prodNo,
          "operDtTm": this.selectData.operDtTm,
          "operStatus": this.selectData.operStatus,
          oldActiveDt: this.selectData.activeDt,
          channelNoArray:this.editOrCopyForm.channelNoArray
        }, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.editOrCopyWin = false;
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //删除
      deleteGuideRate() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if ((Number(this.rateBusiDate) > Number(this.selectData.activeDt + "")) && this.selectData.operStatus != "11"
          && this.selectData.operStatus != "21" && this.selectData.operStatus != "31") {
          this.$msgTip.info(this, { info: "生效日期在当前营业日之前的数据不可【删除】！" });
          return;
        }
        if ((this.selectData.operStatus === "12" || this.selectData.operStatus === "22" || this.selectData.operStatus === "32" || this.selectData.operStatus === "33")) {
          this.$msgTip.info(this, { info: "待审核状态和删除审核通过状态的数据不可【删除】！" });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        let operDtTm = this.selectData.operDtTm;
        let operStatus = this.selectData.operStatus;
        let activeDt = this.selectData.activeDt;
        let prodNo = this.selectData.prodNo;
        let channelNoArray = this.selectData.channelNoArray;
        post({
          prodNo: prodNo,
          activeDt: activeDt,
          operStatus: operStatus,
          operDtTm: operDtTm,
          channelNoArray: channelNoArray
        }, "/bm/prod/guideRate/guideRateMain/func_deleteProductGuideRate").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //提交审核
      submitToReview() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (Number(this.rateBusiDate) > Number(this.selectData.activeDt + "")) {
          this.$msgTip.info(this, { info: "生效日期在当前营业日之前的数据不可【提交审核】！" });
          return;
        }
        if (!(this.selectData.operStatus === "11" || this.selectData.operStatus === "21" || this.selectData.operStatus === "31")) {
          this.$msgTip.info(this, { info: "待提交状态的数据才可以【提交审核】！" });
          return;
        }
        this.$hMsgBox.confirm({
          title: "提交审核",
          content: "确认提交审核吗？",
          onOk: () => {
            this.submitRecheck();
          }
        });
      },
      submitRecheck() {
        let operDtTm = this.selectData.operDtTm;
        let operStatus = this.selectData.operStatus;
        let activeDt = this.selectData.activeDt;
        let prodNo = this.selectData.prodNo;
        let channelNoArray = this.selectData.channelNoArray;
        let channelNameArray = this.selectData.channelNameArray;
        post({
          prodNo: prodNo,
          activeDt: activeDt,
          operStatus: operStatus,
          operDtTm: operDtTm,
          channelNoArray: channelNoArray,
          channelNameArray: channelNameArray
        }, "/bm/prod/guideRate/guideRateMain/func_commitProductGuideRate").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //撤回
      rollback() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (!(this.selectData.operStatus === "12" || this.selectData.operStatus === "22" || this.selectData.operStatus === "32")) {
          this.$msgTip.info(this, { info: "待审核状态的数据才可以【撤回】！" });
          return;
        }
        this.$hMsgBox.confirm({
          title: "撤回",
          content: "确定撤回待审核数据吗？",
          onOk: () => {
            this.submitRollback();
          }
        });
      },
      submitRollback() {
        let operDtTm = this.selectData.operDtTm;
        let operStatus = this.selectData.operStatus;
        let activeDt = this.selectData.activeDt;
        let prodNo = this.selectData.prodNo;
        let channelNoArray = this.selectData.channelNoArray;
        let channelNameArray = this.selectData.channelNameArray;
        post({
          prodNo: prodNo,
          activeDt: activeDt,
          operStatus: operStatus,
          operDtTm: operDtTm,
          channelNoArray: channelNoArray,
          channelNameArray: channelNameArray
        }, "/bm/prod/guideRate/guideRateMain/func_recallProductGuideRate").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //查看利率明细
      viewRateDetails() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.showRateDetailWin = true;
        this.$nextTick(async () => {
          await this.getKpiShowRateDetail();
          this.showRateFormItem.prodNo = this.selectData.prodNo;
          this.showRateFormItem.activeDt = this.selectData.activeDt;
          this.showRateFormItem.operDtTm = this.selectData.operDtTm;
          this.showRateFormItem.operStatus = this.selectData.operStatus;
          this.$refs.showRateDatagrid.dataChange(1);
        });
      },
      //查看利率明细关闭
      showRateDetailsWinClose() {
        this.showRateDetailWin = false;
      },
      //导出利率模板
      exportRateTem() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let url = window.LOCAL_CONFIG.API_HOME + "/bm/prod/guideRate/guideRateMain/func_exportProductGuideRate";
        let form = document.createElement("form");
        form.innerHTML = `<input type="text" name="operDtTm" value="${this.selectData.operDtTm}"/>
                          <input type="text" name="operStatus" value="${this.selectData.operStatus}"/>
                          <input type="text" name="activeDt" value="${this.selectData.activeDt}"/>
                          <input type="text" name="channelNoArray" value="${this.selectData.channelNoArray}"/>
                          <input type="text" name="prodNo" value="${this.selectData.prodNo}"/>`;
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },

      //导入excel
      importExcel() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      getParamInfo() {
        post({}, "/bm/prod/guideRate/getParamValues").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              let list = res.data.retData;
              if (list.costRateBoolean == true) {
                this.sysParam = true;
              }
            }
          }
        });
      },

      //判断是否是渠道模式
      isChannelMode(prod){
        this.prodMap.set("010612",true);
        return this.prodMap.get(prod);
      },

    }
  };
</script>
