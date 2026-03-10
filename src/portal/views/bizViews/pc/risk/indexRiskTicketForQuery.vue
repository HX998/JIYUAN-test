<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" :maxlength=30></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder=" ">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
                  <h-input v-model="formItem.drwrName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
                  <h-input v-model="formItem.acptName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{ $t('m.i.common.search') }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t('m.i.common.reset') }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="pc/risk/ticket/indexRiskTicketForQuery/func_queryPageRiskTicketHis"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            :row-select="true"
            :has-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()" v-if="authObj.bizSetRoleAdd">
                {{ $t('m.i.common.export') }}
              </h-button>
              <h-button type="primary" @click="ticketPlateComfirm()" v-if="authObj.bizSetRoleDelete"
                        :disabled="deletDisabled">{{ $t('m.i.pc.riskTicketBase') }}
              </h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <common-excel-download @handleSubmit="exportForm" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
import {post, on, off, formatNumber, formatBillRangeNoBillOrigin} from "@/api/bizApi/commonUtil";

export default {
  name: "indexRiskTicketForQuery",
  components: {},
  data() {
    let columns = [
      {
        type: "selection",
        width: 60,
        align: "center",
        key: "duoxuan",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.common.index"),
        type: "index",
        width: 60,
        key: "xuhao",
        align: "center"
      },
      {
        title: this.$t('m.i.common.legalNo'),
        key: "legalNo",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.billInfo.billPackageNo"),
        key: "billNo",
        sortable: true
      },
      {
        title: this.$t("m.i.billInfo.billRange"),
        key: "billRange",
        hiddenCol: false,
        render: (h, params) => {
          let billRangeStart = params.row.billRangeStart;
          let billRangeEnd = params.row.billRangeEnd;
          return h("span", formatBillRangeNoBillOrigin(billRangeStart, billRangeEnd))
        }
      },
      {
        title: this.$t("m.i.billInfo.billType"),
        key: "billType",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          let list = this.billTypeList;
          let billType = params.row.billType;
          for (let i = 0; i < list.length; i++) {
            if (params.row.billType === list[i].key) {
              billType = list[i].value;
            }
          }
          return h("span", {domProps: {title: billType}}, billType);
        }
      },
      {
        title: this.$t("m.i.billInfo.drwrName"),
        key: "drwrName",
        sortable: true,
        hiddenCol: false
      },
      {
        title: this.$t("m.i.billInfo.acptName"),
        key: "acptName",
        sortable: true,
        hiddenCol: false
      },
      {
        title: this.$t("m.i.billInfo.remitDt"),
        key: "acptDt",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          let acptDt = params.row.acptDt == null ? "" : this.$moment(params.row.acptDt, "YYYYMMDD").format("YYYY-MM-DD");
          return h("span", {domProps: {title: acptDt}}, acptDt);
        }
      },
      {
        title: this.$t("m.i.billInfo.dueDt"),
        key: "dueDt",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          let acptDt = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          return h("span", {domProps: {title: acptDt}}, acptDt);
        }
      },
      {
        title: this.$t("m.i.billInfo.billPackageMoney"),
        key: "billMoney",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          let billMoney;
          if (params.row.billMoney == 0.0 || params.row.billMoney == null || params.row.billMoney == "" || params.row.billMoney == "null") {
            billMoney = "0.00";
          } else {
            billMoney = formatNumber(params.row.billMoney, 2, ',');
          }
          return h("span", {
            domProps: {
              title: billMoney
            }
          }, billMoney);
        }
      },
      {
        title: this.$t("m.i.pc.riskDesc"),
        key: "riskDesc",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.billInfo.riskStatus"),
        key: "riskStatus",
        hiddenCol: false,
        render: (h, params) => {
          let list = this.riskStatusList;
          let riskStatus = params.row.riskStatus;
          for (let i = 0; i < list.length; i++) {
            if (params.row.riskStatus === list[i].key) {
              riskStatus = list[i].value;
            }
          }
          return h("span", {domProps: {title: riskStatus}}, riskStatus);
        }
      },
      {
        title: this.$t("m.i.pc.originFlag"),
        key: "originFlag",
        hiddenCol: false,
        render: (h, params) => {
          let list = this.originFlagList;
          let originFlag = params.row.originFlag;
          for (let i = 0; i < list.length; i++) {
            if (params.row.originFlag === list[i].key) {
              originFlag = list[i].value;
            }
          }
          return h("span", {domProps: {title: originFlag}}, originFlag);
        }
      },
      {
        title: this.$t("m.i.pc.newUpdateTime"),
        key: "updateTime",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          let updateTime = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
          return h("span", {domProps: {title: updateTime}}, updateTime);
        }
      },
    ];
    return {
      showBillInfoWin: false,
      billId: '',
      billNo: '',
      columns: columns,
      formItem: {
        billNo: '',
        billType: '',
        drwrName: '',
        acptName: '',
      },
      addForm: {
        id: "",
        billNo: "",
        billType: "",
        acptName: "",
        drwrName: "",
        billMoney: "",
        acptDt: "",
        dueDt: "",
        riskDesc: "",
        originFlag: "",
        createDt: "",
        createTime: "",
        operNo: "",
        reserve1: "",
        reserve2: "",
        updateDt: "",
        updateTm: "",
        legalNo: "",
        xxx: "",
      },
      //给按钮增加权限
      authObj: {
        bizSetRoleAdd: true, //角色添加
        bizSetRoleDelete: true, //角色删除
        bizSetRoleORight: true, //角色操作权限
        bizSetRoleARight: true, //角色授权权限
        bizRoleRightSet: true, //角色权限处理
        bizRoleRightCopy: true, //角色权限复制
        bizSetRoleDownload: true, //角色信息下载
      },
      branchColumns: columns,
      billTypeList: [],
      riskStatusList: [],
      originFlagList: [],
      checkStatusList: [],
      type: null,
      readonly: false,
      isRequired: true,
      tableRef: "selfTable",
      deletDisabled: false,
      submitFlag: false,
      copyWin: false,
      brchCodeWin: false,
      ifShowMore: false,
      param: null,
      rows: null,
      tempShowExcelTemplateWin: false,
    };
  },
  methods: {
    addFormReset() {
      this.$refs.addForm.resetFields();
      this.addForm.id = '';
    },
    //票面
    showBillInfo(billId, billNo) {
      this.billId = billId;
      this.billNo = billNo;
      this.showBillInfoWin = true;
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },

    handlelRowClick(arr) {
      this.currentSelectRow = arr;
    },
    handleSelectClick(arr, selectInx) {
      this.unDisabled()
      this.currentSelectList = arr;
      this.currentSelectRowInx = selectInx
      if (arr.length == 0) return
    },
    unDisabled() {
      this.deletDisabled = false
    },
    formSearch() {
      this.unDisabled()
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
    },
    handleComfirm() {
      let list = this.currentSelectList;
      if (list != null && list.length > 0) {
        //this.delConfirm=true;
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: this.$t('m.i.common.isConfirmDelete') + '?',
          onOk: () => {
            this.handledel();
          }
        })
      } else {
        this.$msgTip.info(this, {info: this.$t('m.i.common.onlyChooseOneData')});
      }

    },
    handledel() {
      let list = this.currentSelectList;

      if (list.length > 1) {
        this.$msgTip.info(this, {info: this.$t('m.i.common.onlyChooseOneData')});
        return
      }
      let delId = this.currentSelectList[0].id;
      post({id: delId}, '/pc/indexRiskTicket/delete.json').then(res => {
        if (res) {
          let retCode = res.data.retCode
          if (retCode == "000000") {
            this.$msgTip.success(this)
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectRow = [];
            this.currentSelectList = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg})
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
        }
      });
    },

    //清单导出
    tempShowExcelTemplateWinOpen() {
      this.param = "riskTicketListExportInfo";
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
    /*导出*/
    exportForm(field, exportType) {
      //exportType: 0-同步 1-异步
      let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/ticket/exportExcel";
      if (exportType === "1") {
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
            billNo: this.formItem.billNo,
            billType: this.formItem.billType,
            drwrName: this.formItem.drwrName,
            acptName: this.formItem.acptName,
            field: field,
            exportType: exportType,
            excelName: this.param,
          };
        }
        post(params, url).then(res => {
          if (res.status === 200 && res.data === null) {
            this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          } else if (res.status === 200 && res.data === "") {
            this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          } else {
            this.$msgTip.error(this, {info: "异步导出失败"});
          }
        });
      } else {
        if (this.$refs.datagrid.selectIds.length !== 0) {
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");

          let input1 = document.createElement("input");
          input1.type = "text";
          input1.name = "ids";
          input1.value = this.$refs.datagrid.selectIds;
          form.appendChild(input1);
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
        } else {
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
    },

    ticketPlateComfirm() {
      //this.delConfirm=true;
      this.$hMsgBox.confirm({
        title: this.$t('m.i.common.confirm'),
        content: this.$t('m.i.common.isConfirmTicketPlate') + '?',
        onOk: () => {
          this.ticketPlate();
        }
      })
    },
    /**风险票盘库**/
    ticketPlate() {
      post({}, '/pc/risk/ticket/indexRiskTicketForQuery/func_plateRiskTicketStock').then(res => {
        if (res) {
          let retCode = res.data.retCode
          if (retCode == "000000") {
            this.$msgTip.success(this)
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectRow = [];
            this.currentSelectList = [];
          } else {
            // this.$hMessage.error('盘库失败'+res.data.retMsg)
            this.$msgTip.error(this, {info: res.data.retMsg})
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
        }
      });
    },

  },

  mounted() {
    this.getDictListByGroups("RiskStatus,DraftTypeCode,OriginFlag,RiskOperStatus").then(res => {
      this.riskStatusList = res.get("RiskStatus");
      this.billTypeList = res.get("DraftTypeCode");
      this.originFlagList = res.get("OriginFlag");
      this.operStatusList = res.get("RiskOperStatus");
      this.dictMap = res.get("map");
    });
  }
};
</script>

<style scoped>

</style>
