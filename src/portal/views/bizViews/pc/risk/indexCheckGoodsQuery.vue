<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" :maxlength=30></h-input>
                </h-form-item>
                <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"
                             title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.brchName">
                </show-branch>
                <h-form-item :label="$t('m.i.pc.pkDt')" prop="createTime">
                  <h-date-picker type="daterange" placeholder="" placement="bottom-end" v-model="createTime"
                                 format="yyyy-MM-dd" showFormat @on-change="createTimeChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
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
            :url="url+'/indexCheckGoodsQuery/func_queryPlateRiskTicketStock'"
            :bindForm="formItem"
            :onCurrentChange="handlelRowClick"
            :onCurrentChangeCancel="handlelRowClickCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="show()">{{ $t('m.i.common.view') }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--风险票盘库详情弹出窗-->
    <h-msg-box v-model="viewWin" width="800" class="h-form-search-layer"
               @on-close="viewWinClose" :maximize="true" :mask-closable="false" :footerHide="true">
      <p slot="header">
        <span>风险票盘库详情</span>
      </p>
      <h-panel>
        <h-form :model="viewForm" :label-width="120" ref="viewForm" cols="2" class="h-form-search">
          <common-input readonly v-model="viewForm.billNo" :maxlength=30 :label="$t('m.i.billInfo.billPackageNo')"
                        prop="billNo"></common-input>
          <common-input-range readonly v-model="viewForm" :rangeProps="['billRangeStart','billRangeEnd']"
                              :label="$t('m.i.billInfo.billRange')"></common-input-range>
          <common-select readonly :dictList="billTypeList" v-model="viewForm.billType"
                         :label="$t('m.i.billInfo.billType')" prop="billType"></common-select>
          <common-input readonly :maxlength=60 v-model="viewForm.drwrName" :label="$t('m.i.billInfo.drwrName')"
                        prop="drwrName"></common-input>
          <common-input readonly :maxlength=60 v-model="viewForm.acptName" :label="$t('m.i.billInfo.acptName')"
                        prop="acptName"></common-input>
          <common-date-picker readonly v-model="viewForm.remitDt" :label="$t('m.i.billInfo.remitDt')"
                              prop="remitDt"></common-date-picker>
          <common-date-picker readonly v-model="viewForm.dueDt" :label="$t('m.i.billInfo.dueDt')"
                              prop="dueDt"></common-date-picker>
          <common-type-field readonly v-model="viewForm.billMoney" :label="$t('m.i.billInfo.billPackageMoney')"
                             prop="billMoney"></common-type-field>
          <common-select readonly :dictList="riskStatusList" v-model="viewForm.riskStatus"
                         :label="$t('m.i.billInfo.riskStatus')" prop="riskStatus"></common-select>
          <common-date-picker readonly v-model="viewForm.createTime" :label="$t('m.i.pc.pkDt')"
                              prop="createTime"></common-date-picker>
          <common-select readonly :dictList="originFlagList" v-model="viewForm.originFlag"
                         :label="$t('m.i.pc.originFlag')" prop="originFlag"></common-select>
        </h-form>
      </h-panel>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" ref="billInfoMain" :billRangeEnd="this.billRangeEnd"
                    :billRangeStart="this.billRangeStart"></bill-info-main>
  </div>
</template>

<script>
import {post, on, off, formatNumber, formatBillRangeNoBillOrigin} from "@/api/bizApi/commonUtil";

export default {
  name: "indexCheckGoodsQuery",
  components: {},
  data() {
    return {
      showBillInfoWin: false,
      billId: "",
      billNo: "",
      billRangeStart: "",
      billRangeEnd: "",
      columns: [
        {
          title: " ",
          type: "radio",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },

        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row);
                }
              }
            }, params.row.billNo);
          }
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
            let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
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
          key: "remitDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", remitDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", dueDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("div", [
              h("span", formatNumber(params.row.billMoney, 2, ","))
            ]);
          }
        },
        {
          title: this.$t("m.i.billInfo.riskStatus"),
          key: "riskStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "RiskStatus", params.row.riskStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.pc.originFlag"),
          key: "originFlag",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "OriginFlag", params.row.originFlag);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.pc.kcBrch"),
          key: "brchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.pkDt"),
          key: "createTime",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let createTime = this.$moment(params.row.createTime, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", createTime);
          }
        }
      ],
      formItem: {
        billNo: "",
        brchNos: [],
        brchName: "",
        minCreateTime: "",
        maxCreateTime: ""
      },
      viewForm: {
        billNo: "",
        billRangeStart: "",
        billRangeEnd: "",
        billType: "",
        drwrName: "",
        acptName: "",
        remitDt: "",
        dueDt: "",
        billMoney: "",
        riskStatus: "",
        createTime: "",
        originFlag: ""
      },
      billTypeList: [],
      riskStatusList: [],
      originFlagList: [],

      createTime: "",
      dictMap: null,
      readonly: false,
      viewWin: false,
      currentSelectRow: null,
      url: "pc/risk/ticket",
    };
  },
  methods: {
    formSearch() {
      this.currentSelectRow = null;
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
      this.formItem.brchNos = "";
      this.formItem.brchName = "";
      this.createTime = "";
      this.formItem.minCreateTime = "";
      this.formItem.maxCreateTime = "";
    },

    handlelRowClick(arr) {
      this.currentSelectRow = arr;
    },
    handlelRowClickCancel() {
      this.currentSelectRow = null;
    },
    billInfoWinClose() {
      this.billId = "";
      this.billNo = "";
      this.showBillInfoWin = false;
    },
    showBillInfo(row) {
      this.billId = row.billId;
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    createTimeChange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minCreateTime = arr[0].replace(/-/g, "");
        this.formItem.maxCreateTime = arr[1].replace(/-/g, "");
      } else {
        this.formItem.minCreateTime = "";
        this.formItem.maxCreateTime = "";
      }
    },
    show() {
      if (this.currentSelectRow != null) {
        let id = this.currentSelectRow.id;
        post({id: id}, this.url + '/indexCheckGoodsQuery/func_queryPlateRiskTicketDetail').then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let list = res.data.retData;
              this.viewForm.billNo = list.billNo;
              this.viewForm.billType = list.billType;
              this.viewForm.drwrName = list.drwrName;
              this.viewForm.acptName = list.acptName;
              this.viewForm.billRangeStart = list.billRangeStart.toString().padLeft(12, '0');
              this.viewForm.billRangeEnd = list.billRangeEnd.toString().padLeft(12, '0');
              if (list.remitDt) {
                this.viewForm.remitDt = this.$moment(list.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              } else {
                this.viewForm.remitDt = list.remitDt;
              }
              if (list.dueDt) {
                this.viewForm.dueDt = this.$moment(list.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              } else {
                this.viewForm.dueDt = list.dueDt;
              }
              this.viewForm.billMoney = list.billMoney;
              this.viewForm.riskStatus = list.riskStatus;
              if (list.createTime) {
                this.viewForm.createTime = this.$moment((list.createTime / 1000000000), "YYYYMMDD").format("YYYY-MM-DD");
              } else {
                this.viewForm.createTime = list.createTime;
              }
              this.viewForm.originFlag = list.originFlag;
              this.viewWinOpen();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t('m.i.common.chooseOneData')});
      }
    },

    viewWinOpen() {
      this.viewWin = true;
    },
    viewWinClose() {
      this.viewWin = false;
    }
  },
  mounted() {
    this.getDictListByGroups("DraftTypeCode,RiskStatus,OriginFlag").then(res => {
      this.billTypeList = res.get("DraftTypeCode");
      this.riskStatusList = res.get("RiskStatus");
      this.originFlagList = res.get("OriginFlag");
      this.dictMap = res.get("map");
    });
  }
};
</script>

<style scoped>

</style>
