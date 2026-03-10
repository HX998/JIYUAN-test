<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="rgstDt" :label="$t('m.i.be.rangeApplDt')">
                  <h-date-picker type="date" v-model="formItem.rgstDt" placeholder="" format="yyyy-MM-dd"
                                 :editable=false showFormat @on-change="handleRgstDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA02" key="BTA01">待复核</h-option>
                    <h-option value="BTA05" key="BTA06">登记失败</h-option>
                  </h-select>
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
                      url="/ce/cpesrgst/acptGuarntrRgst/acptGuarntrRgstRecheck/func_pagingQueryPaperRgstCheck"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckPass">{{$t("m.i.common.pass")}}</h-button>
              <h-button type="primary" @click="recheckBack">{{$t("m.i.common.back")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></rgst-bill-info-main>

    <!-- 查看承兑登记信息界面 -->
    <h-msg-box v-model="showInfoDetailWin" width="800" @on-close="showInfoDetailWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>查看承兑保证登记信息</span>
      </p>
      <div>
        <h-form :model="showInfoDetailForm" :label-width="115" ref="showInfoDetailForm" cols="2" class="h-form-search">
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="showInfoDetailForm.billType" placeholder="" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
            <h-input v-model="showInfoDetailForm.billNo" :maxlength="16" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required>
            <h-typefield v-model="showInfoDetailForm.billMoney" :maxlength="20" placeholder="" bigTips
                         readonly></h-typefield>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="showInfoDetailForm.dueDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           disabled></h-date-picker>
          </h-form-item>

          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.drweBankNo')" required class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.acptBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="rgstDt" :label="$t('m.i.be.rangeApplDt')" required>
            <h-date-picker v-model="showInfoDetailForm.rgstDt" type="date" showFormat :editable=false
                           format="yyyy-MM-dd" disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="transToBankNo" :label="$t('m.i.billInfo.transToBankNo')" required>
            <h-input v-model="showInfoDetailForm.transToBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="transToBankName" :label="$t('m.i.billInfo.transToBankName')" required>
            <h-input v-model="showInfoDetailForm.transToBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="rgstRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="showInfoDetailForm.rgstRemark" :canResize="false"
                     :maxlength="300" readonly></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="showInfoDetailWinClose">{{$t("m.i.common.close")}}</h-button>
        </div>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptGuarntrRgstRecheck",
    components: {},
    data() {
      return {
        //详细信息
        showInfoDetailWin: false,
        showInfoDetailForm: {
          billType: "",
          billNo: "",
          billMoney: "",
          dueDt: "",
          acptBankNo: "",
          rgstDt: "",
          transToBankNo: "",
          transToBankName: "",
          rgstRemark: ""
        },
        //票面
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        //字典值
        dictMap: new Map(),
        billTypeList: [],

        formItem: {
          rgstClass: "RI03",
          billNo: "",
          rgstDt: "",
          rgstStatus: ""
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
            title: this.$t("m.i.ce.info"),
            key: "info",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showInfoDetail(params.row.id);
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.id, params.row.billNo);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.rangeApplDt"),
            key: "rgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rgstDt == null || params.row.rgstDt === "") {
                return "";
              }
              let date = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.transToBankName"),
            key: "transToBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.transFromBankName"),
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.registerStatus"),
            key: "rgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AcptRgstStatus", params.row.rgstStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          }
        ]

      };
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,AcptRgstStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleRgstDtChange(value) {
        this.formItem.rgstDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
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

      //通过
      recheckPass() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定通过吗？",
          onOk: () => {
            this.handleReCheckPass();
          }
        });
      },
      handleReCheckPass() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({
          listIds: ids,
          isPass: "1"
        }, "/ce/cpesrgst/acptGuarntrRgst/acptGuarntrRgstRecheck/func_submitCheck").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //驳回
      recheckBack() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定驳回吗？",
          onOk: () => {
            this.handleReCheckBack();
          }
        });
      },
      handleReCheckBack() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({
          listIds: ids,
          isPass: "0"
        }, "/ce/cpesrgst/acptGuarntrRgst/acptGuarntrRgstRecheck/func_submitCheck").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //详细信息超链接展示
      showInfoDetail(str) {
        post({ id: str }, "/ce/cpesrgst/acptGuarntrRgst/acptGuarntrRgstRecheck/func_queryPaperRgstById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showInfoDetailForm.billType = res.data.retData.billType;
              this.showInfoDetailForm.billNo = res.data.retData.billNo;
              this.showInfoDetailForm.dueDt = res.data.retData.dueDt + "";
              this.showInfoDetailForm.billMoney = res.data.retData.billMoney;
              this.showInfoDetailForm.acptBankNo = res.data.retData.acptBankNo;
              this.showInfoDetailForm.rgstDt = res.data.retData.rgstDt + "";
              this.showInfoDetailForm.transToBankNo = res.data.retData.transToBankNo;
              this.showInfoDetailForm.transToBankName = res.data.retData.transToBankName;
              this.showInfoDetailForm.rgstRemark = res.data.retData.rgstRemark;
              this.showInfoDetailWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showInfoDetailWinClose() {
        this.showInfoDetailWin = false;
        this.$refs.showInfoDetailForm.resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
