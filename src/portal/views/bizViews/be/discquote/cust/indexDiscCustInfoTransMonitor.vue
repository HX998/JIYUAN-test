<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item prop="transBrchNameList" :label="$t('m.i.common.brchName')">
                  <h-input v-model="formItem.transBrchNameList" placeholder="" readonly
                           icon="android-search" @on-click="queryBranchTree()"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.transBrchNameList" :label="$t('m.i.common.brchName')"  prop="transBrchNameList"
                             :showCheckBox="true"     :brchNo.sync="formItem.transBrchNoList" :brchName.sync="formItem.transBrchNameList">
                </show-branch>

                <h-form-item prop="applStatus" :label="$t('m.i.common.status')">
                  <h-select v-model="formItem.applStatus" placeholder="">
                    <h-option v-for="item in applStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="discCustName" :label="$t('m.i.shcpe.trgtPtcptName')">
                  <h-input v-model="formItem.discCustName" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="discSocCode" :label="$t('m.i.common.socCode')" class="h-form-long-label">
                  <h-input v-model="formItem.discSocCode" :maxlength=18></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/be/discquote/cust/indexDiscCustInfoTransMonitor/func_queryDiscCustInfoTransMonitorPage"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportExcel">{{$t("m.i.common.export")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 机构名称选择弹窗框 -->
   <!-- <show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange" ifcheck="true"
                 :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>-->
    <!-- 附件查看 -->
    <show-file-win :showFileWin="showFileWin" :batchId="batchId" operType="show" @showFileWinClose="showFileWinClose"
                   sourceType="DCR" :filePathUrl="filePathUrl"></show-file-win>
    <!-- 明细导出 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "indexDiscCustInfoTransMonitor",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      ShowFileWin: () => import(/* webpackChunkName: "be/discquote/file/showFileWin" */`@/views/bizViews/be/discquote/file/showFileWin`)
    },
    data() {
      return {
        //导出
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        //字典值
        dictMap: new Map(),
        batchId:"",
        applStatusList: [],
        //机构树多选
       // showBranchWin: false,
        //影像上传
        showFileWin: false,
        propsVue: "indexDiscCustInfoTransMonitor",
        formItem: {
          transBrchNameList: JSON.parse(window.sessionStorage.getItem("userInfo")).brchName,
          transBrchNoList: JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo,
          applStatus: "",
          discCustName: "",
          discSocCode: ""
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
            title: this.$t("m.i.shcpe.trgtPtcptName"),
            key: "discCustName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.socCode"),
            key: "discSocCode",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.status"),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DCAplStatus", params.row.applStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.attachment"),
            key: "attachment",
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
                      this.openFileWin(params.row.id);
                    }
                  }
                }, "附件")
              ]);
            }
          },
          {
            title: this.$t("m.i.be.fileStatus"),
            key: "fileStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DCFileStatus", params.row.fileStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.corpScale"),
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.industryCategory"),
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.discIndustry);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.area"),
            key: "area",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Province", params.row.area);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isArc"),
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscArc);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isGreenCorp"),
            key: "isDiscGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscGreenCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isSciCorp"),
            key: "isDiscTechnologyCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscTechnologyCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isPrivateCorp"),
            key: "isDiscPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscPrivateCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brokerBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discCustStatus"),
            key: "discCustStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "RelStatus", params.row.discCustStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ],
        filePathUrl: "/be/discquote/cust/indexDiscCustInfoTransMonitor/"
      };
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,DCAplStatus,DCFileStatus,RelStatus").then(res => {
        this.applStatusList = res.get("DCAplStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
        this.formItem.transBrchNoList = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
        this.formItem.applStatus = "";
        this.formItem.discCustName = "";
        this.formItem.discSocCode = "";
      },
     /* //机构树多选
      queryBranchTree() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let transBrchNoList = "";
        let transBrchNameList = "";
        for (var i = 0; i < objs.length; i++) {
          transBrchNoList += objs[i].id + ",";
          transBrchNameList += objs[i].title + ",";
        }
        this.formItem.transBrchNoList = transBrchNoList;
        this.formItem.transBrchNameList = transBrchNameList;
        this.showBranchWin = false;
      },*/
      openFileWin(batchId) {
        this.batchId = batchId;
        this.showFileWin = true;
      },
      showFileWinClose() {
        this.showFileWin = false;
      },

      //导出
      exportExcel() {
        this.param = "discCustInfoExport";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },

      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/cust/indexDiscCustInfoTransMonitor/func_exportDiscCustInfo";
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              transBrchNoList: this.formItem.transBrchNoList,
              applStatus: this.formItem.applStatus,
              discCustName: this.formItem.discCustName,
              discSocCode: this.formItem.discSocCode,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          }
          post(params, url).then(res => {
            if (res.status === 200 && res.data === null) {
              this.$msgTip.info(this, { info: "异步导出成功，请进入公共管理》导出下载页面，进行下载" });
            } else if (res.status === 200 && res.data === "") {
              this.$msgTip.info(this, { info: "异步导出成功，请进入公共管理》导出下载页面，进行下载" });
            } else {
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/cust/indexDiscCustInfoTransMonitor/func_exportDiscCustInfo";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "ids";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "field";
            input2.value = field;
            form.appendChild(input2);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "exportType";
            input3.value = exportType;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "excelName";
            input4.value = this.param;
            form.appendChild(input4);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/cust/indexDiscCustInfoTransMonitor/func_exportDiscCustInfo";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "field";
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      }
    }
  };
</script>

<style scoped>

</style>
