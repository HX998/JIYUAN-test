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
                <h-form-item class="h-form-operate one-form">
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
            url="pc/risk/ticket/indexRiskTicketCheck/func_queryPageRiskTicketPendingCheck"
            :bindForm="formItem"
            row-select
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleComfirm('pass')">{{ $t('m.i.common.pass') }}</h-button>
              <h-button type="primary" @click="handleComfirm('reject')">{{ $t('m.i.common.reject') }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>

import {post, formatNumber, formatBillRangeNoBillOrigin} from "@/api/bizApi/commonUtil";


export default {
  name: "indexRiskTicketCheck",
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
        title: this.$t("m.i.common.applTellerNo"),
        key: "applTellerNo",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.pc.updateDt"),
        key: "updateTm",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          let updateTime = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
          return h("span", {domProps: {title: updateTime}}, updateTime);
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
          return h("span",
            {
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
        billNo: '',
      },
      addForm: {
        id: "",
        billNo: "",
        billType: "",
        acceptor: "",
        remitter: "",
        billMoney: "",
        acptDt: "",
        dueDt: "",
        riskDesc: "",
        origin: "",
        createDt: "",
        createTime: "",
        operNo: "",
        reserve1: "",
        reserve2: "",
        updateDt: "",
        updateTm: "",
        applTellerNo: "",
        operStatus: "",
      },
      branchColumns: columns,
      billTypeList: [],
      riskStatusList: [],
      originFlagList: [],
      operStatusList: [],
      // 是否显示新增或修改窗口
      addOrEditWin: false,
      type: null,
      readonly: false,
      isRequired: true,
      submitFlag: false,
      copyWin: false,
      brchCodeWin: false,
      ifShowMore: false,
      currentSelectList: []
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
    formSearch() {
      this.$refs.datagrid.dataChange(1);
      this.currentSelectList = [];
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
    },
    handleComfirm(oper) {
      let msg = '';
      if (oper == 'pass') {
        msg = '通过'
      }
      if (oper == 'reject') {
        msg = '驳回'
      }
      this.currentSelectList = this.$refs.datagrid.selects
      let list = this.currentSelectList;
      if (list != null && list.length > 0) {
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: '确定要' + msg + '吗?',
          onOk: () => {
            this.handlePassOrRej(oper);
          }
        })
      } else {
        this.$msgTip.info(this, {info: this.$t('m.i.common.chooseAtLeastOneRecord')});
      }
    },
    handlePassOrRej(oper) {
      let ids = this.$refs.datagrid.selectIds;
      let url = '';
      if (oper == 'pass') {
        url = 'pc/risk/ticket/indexRiskTicketCheck/func_passRiskTicketInfo';
      }
      if (oper == 'reject') {
        url = 'pc/risk/ticket/indexRiskTicketCheck/func_rejectRiskTicketInfo';
      }
      post({ids: ids}, url).then(res => {
        if (res) {
          let retCode = res.data.retCode
          if (retCode === "000000") {
            this.$msgTip.success(this)
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectList = [];
          } else {
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
