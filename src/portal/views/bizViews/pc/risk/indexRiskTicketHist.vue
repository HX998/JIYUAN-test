<template>
  <div class="layout">
    <h-msg-box v-model="tempShowHistWin" width="1000" @on-close="handleClose()" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>{{ optTitle }}</span>
      </p>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--数据展示表格-->
            <h-datagrid
              :columns="columns"
              highlight-row
              getDataFunc
              hasPage
              :auto-load="false"
              @get-data="queryHistData"
              :gridData="histData"
              :bindForm="formItem"
              :onRowClick="handlelRowClick"
              :onSelectChange="handleSelectClick"
              ref="datagrid">
            </h-datagrid>

          </div>
        </h-col>
      </h-row>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      </div>

    </h-msg-box>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>

import {post, on, off, formatNumber, formatBillRangeNoBillOrigin} from "@/api/bizApi/commonUtil";

export default {
  name: "indexRiskTicketHist",
  components: {},
  props: {
    optTitle: String,
    id: String,
    showOptHistWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
  },

  data() {
    let columns = [
      {
        type: "selection",
        width: 60,
        align: "center",
        key: "duoxuan",
        hiddenCol: true
      },
      {
        title: this.$t("m.i.common.index"),
        type: "index",
        width: 60,
        key: "xuhao",
        align: "center"
      },
      {
        title: this.$t("m.i.pc.id"),
        key: "id",
        hiddenCol: true,
      },
      {
        title: this.$t("m.i.billInfo.billPackageNo"),
        key: "billNo",
        sortable: true,
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
          let dueDt = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          return h("span", {domProps: {title: dueDt}}, dueDt);
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
        title: this.$t("m.i.pc.applTellerName"),
        key: "applTellerName",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.pc.updateTime"),
        key: "updateTime",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          let updateTime = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
          return h("span", {domProps: {title: updateTime}}, updateTime);
        }
      },
      {
        title: this.$t("m.i.pc.checkTellerName"),
        key: "checkTellerName",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.pc.checkDtTm"),
        key: "checkDtTm",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          let checkDtTm = params.row.checkDtTm == null ? "" : this.$moment(params.row.checkDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
          return h("span", {domProps: {title: checkDtTm}}, checkDtTm);
        }
      },
      {
        title: this.$t("m.i.common.operStatus"),
        key: "operStatus",
        hiddenCol: false,
        render: (h, params) => {
          let list = this.operStatusList;
          let operStatus = params.row.operStatus;
          for (let i = 0; i < list.length; i++) {
            if (params.row.operStatus === list[i].key) {
              operStatus = list[i].value;
            }
          }
          return h("span", {
            domProps: {
              title: operStatus
            }
          }, operStatus);
        }
      },
    ];
    return {
      showBillInfoWin: false,
      billId: '',
      billNo: '',
      columns: columns,
      formItem: {
        custName: "",
        custType: '',
      },
      addForm: {
        id: "",
        billNo: "",
        billType: "",
        drwrName: "",
        acptName: "",
        acptDt: "",
        dueDt: "",
        billMoney: "",
        riskDesc: "",
        riskStatus: "",
        applTellerNo: "",
        createTime: "",
        checkTellerNo: "",
        updateTime: "",
        operStatus: "",
      },
      branchColumns: columns,
      billTypeList: [],
      riskStatusList: [],
      operStatusList: [],

      // 是否显示新增或修改窗口
      showHistWin: false,
      type: null,
      readonly: false,
      isRequired: true,
      title: "",
      histData: {},
    };
  },
  methods: {
    addFormReset() {
      this.$refs.addForm.resetFields();
      this.addForm.id = '';
    },
    handleAddForm(str) {

      this.type = str;
      this.readonly = false;
      this.isRequired = true
      this.addForm.schemeId = ""
      this.addForm.schemeName = ""
      if (this.type == "modify" || this.type == "view") {
        let list = this.currentSelectList;
        if (list != null && list.length == 1) {
          this.currentSelectRow = this.currentSelectList[0];
        } else {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseOneData')});
          return;
        }
        this.addForm.id = this.currentSelectRow.id;
        if (this.type == "modify") {
          this.readonly = true;
        }
        if (this.type == "view") {
          this.isRequired = false
        }
      } else {
        this.addFormReset();
      }
      this.addOrEditWin = true;
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
    //票面
    showBillInfo(billId, billNo) {
      this.billId = billId;
      this.billNo = billNo;
      this.showBillInfoWin = true;
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    formSearch() {
      this.unDisabled()
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
    },
    handleClose() {
      this.$emit("showHistWinClose", "");
    },

    queryHistData() {
      let params = Object.assign({},{
        "pageNo": this.$refs.datagrid.pageInfo.pageNo,
        "pageSize": this.$refs.datagrid.pageInfo.pageSize,
        id: this.id
      });
      // let json = {id: this.id, pageInfo: this.pageInfo};
      post(params, 'pc/risk/ticket/indexRiskTicketHist/func_findRiskTicketById').then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.histData = res.data.retData;
            } else {
              // this.submitMsg = "查询失败";
              this.$msgTip.error(this, {info: res.data.retMsg})
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
          }
        }
      )
    }

  },
  computed: {
    tempShowHistWin: {
      get() {
        return this.showOptHistWin;
      },
      set() {
        if(this.showOptHistWin){
          this.$refs.datagrid.pageInfo.pageNo = 1;
        }
      }
    }
  },
  watch: {
    showOptHistWin(val) {
      if (val == true) {
        this.getDictListByGroups("RiskStatus,DraftTypeCode,OriginFlag,RiskOperStatus").then(res => {
          this.riskStatusList = res.get("RiskStatus");
          this.billTypeList = res.get("DraftTypeCode");
          this.originFlagList = res.get("OriginFlag");
          this.operStatusList = res.get("RiskOperStatus");
          this.dictMap = res.get("map");
        });
        this.queryHistData();
      }
    }
  },

};
</script>

<style scoped>

</style>
