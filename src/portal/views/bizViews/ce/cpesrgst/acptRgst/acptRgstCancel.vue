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
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA04" key="BTA04">登记成功</h-option>
                    <h-option value="BTA11" key="BTA11">撤销登记复核驳回</h-option>
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
                      url="/ce/cpesrgst/acptRgst/acptRgstCancel/func_pagingQueryPaperRgstCancel"
                      highlightRow
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="rgstCancel">{{$t("m.i.common.revocation")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 撤回承兑登记信息弹窗 -->
    <h-msg-box v-model="rgstBackWin" width="800" @on-close="rgstBackWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>撤回承兑登记信息</span>
      </p>
      <div>
        <h-form :model="backForm" :label-width="115" ref="backForm" cols="2" class="h-form-search">
          <h-form-item prop="cancelType" :label="$t('m.i.common.cancelType')" required>
            <h-select v-model="backForm.cancelType" placeholder="">
              <h-option value="RV01" key="RV01">未用退回</h-option>
              <h-option value="RV02" key="RV02">信息作废</h-option>
              <h-option value="RV03" key="RV03">票据作废</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="rgstRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="backForm.rgstRemark" :canResize="false"
                     :maxlength="300"></h-input>
          </h-form-item>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="rgstBackWinSubmit()">{{$t("m.i.common.submit")}}</h-button>
        </div>
        <p slot="header">
          <span>票据信息</span>
        </p>
        <h-form :model="showInfoDetailForm" :label-width="115" ref="showInfoDetailForm" cols="2" class="h-form-search">
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="showInfoDetailForm.billType" placeholder="" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
            <h-input v-model="showInfoDetailForm.billNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
            <h-date-picker v-model="showInfoDetailForm.remitDt" type="date" showFormat :editable=false
                           format="yyyy-MM-dd" disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="showInfoDetailForm.dueDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required>
            <h-typefield v-model="showInfoDetailForm.billMoney" :maxlength="20" placeholder="" bigTips
                         readonly></h-typefield>
          </h-form-item>
          <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
            <h-input v-model="showInfoDetailForm.drwrName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" required>
            <h-input v-model="showInfoDetailForm.drwrAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrSocCode" :label="$t('m.i.billInfo.drwrSocCode')" required class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.drwrSocCode" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrIndustry" :label="$t('m.i.billInfo.drwrIndustry')" required>
            <h-select v-model="showInfoDetailForm.drwrIndustry" placeholder="" readonly>
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrCorpScale" :label="$t('m.i.billInfo.drwrCorpScale')" required>
            <h-select v-model="showInfoDetailForm.drwrCorpScale" placeholder="" readonly>
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDrwrArc" :label="$t('m.i.billInfo.isDrwrArc')" required class="h-form-long-label">
            <h-select v-model="showInfoDetailForm.isDrwrArc" placeholder="" readonly>
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')" required>
            <h-input v-model="showInfoDetailForm.acptName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptAcctNo" :label="$t('m.i.billInfo.acptAcctNo')" required>
            <h-input v-model="showInfoDetailForm.acptAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptSocCode" :label="$t('m.i.billInfo.acptSocCode')" required class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.acptSocCode" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')" required>
            <h-input v-model="showInfoDetailForm.pyeeName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')" required>
            <h-input v-model="showInfoDetailForm.pyeeAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankName" :label="$t('m.i.billInfo.pyeeBankName')" required>
            <h-input v-model="showInfoDetailForm.pyeeBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.acptBankNo')" required class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.acptBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptBankName" :label="$t('m.i.billInfo.acptBankName')" required class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.acptBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drweBankNo" :label="$t('m.i.billInfo.drwrBankNo')" required>
            <h-input v-model="showInfoDetailForm.drwrBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drweBankName" :label="$t('m.i.billInfo.drwrBankName')" required>
            <h-input v-model="showInfoDetailForm.drwrBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drweBankNo" :label="$t('m.i.billInfo.drweBankNo')" required>
            <h-input v-model="showInfoDetailForm.drweBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drweBankName" :label="$t('m.i.billInfo.drweBankName')" required>
            <h-input v-model="showInfoDetailForm.drweBankName" placeholder="" readonly></h-input>
          </h-form-item>
        </h-form>

      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="rgstBackWinClose">{{$t("m.i.common.close")}}</h-button>
        </div>
      </div>
    </h-msg-box>

    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></rgst-bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptRgstCancel",
    components: {},
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        formItem: {
          rgstClass: "RI00",
          billNo: ""
        },
        currentSelectRow: [],
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
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
            title: this.$t("m.i.ce.rgstApplDt"),
            key: "rgstApplDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rgstApplDt == null || params.row.rgstApplDt === "") {
                return "";
              }
              let date = this.$moment(params.row.rgstApplDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.registerStatus"),
            key: "rgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AcptRgstStatus", params.row.rgstStatus);
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", { domProps: { title: dictValue } }, dictValue);
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankName"),
            key: "drweBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        dictMap: new Map(),
        billTypeList: [],
        isList: [],
        areaList: [],
        industryCategoryList: [],
        corpScaleList: [],
        rgstBackWin: false,
        backForm: {
          listIds: "",
          cancelType: "",
          rgstRemark: ""
        },
        showInfoDetailForm: {
          billType: "",
          billNo: "",
          remitDt: "",
          dueDt: "",
          billMoney: "",
          drwrName: "",
          drwrAcctNo: "",
          drwrSocCode: "",
          drwrIndustry: "",
          drwrCorpScale: "",
          isDrwrArc: "",
          pyeeName: "",
          pyeeAcctNo: "",
          pyeeBankName: "",
          acptBankNo: "",
          acptBankName: "",
          drweBankNo: "",
          drweBankName: "",
          acptName: "",
          acptAcctNo: "",
          acptSocCode: "",
          drwrBankNo: "",
          drwrBankName: ""
        }
      };
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,AcptRgstStatus,DraftTypeCode").then(res => {
        this.corpScaleList = res.get("CorpScale");
        this.isList = res.get("Yon");
        this.areaList = res.get("Province");
        this.industryCategoryList = res.get("Industry");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
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

      //撤回
      rgstCancel() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        post({ id: this.currentSelectRow.id }, "/ce/cpesrgst/acptRgst/acptRgstCancel/func_queryPaperRgstById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showInfoDetailForm.billType = res.data.retData.billType;
              this.showInfoDetailForm.billNo = res.data.retData.billNo;
              this.showInfoDetailForm.remitDt = res.data.retData.remitDt + "";
              this.showInfoDetailForm.dueDt = res.data.retData.dueDt + "";
              this.showInfoDetailForm.billMoney = res.data.retData.billMoney;
              this.showInfoDetailForm.drwrName = res.data.retData.drwrName;
              this.showInfoDetailForm.drwrAcctNo = res.data.retData.drwrAcctNo;
              this.showInfoDetailForm.drwrSocCode = res.data.retData.drwrSocCode;
              this.showInfoDetailForm.drwrIndustry = res.data.retData.drwrIndustry;
              this.showInfoDetailForm.drwrCorpScale = res.data.retData.drwrCorpScale;
              this.showInfoDetailForm.isDrwrArc = res.data.retData.isDrwrArc;
              this.showInfoDetailForm.acptName = res.data.retData.acptName;
              this.showInfoDetailForm.acptAcctNo = res.data.retData.acptAcctNo;
              this.showInfoDetailForm.acptSocCode = res.data.retData.acptSocCode;
              this.showInfoDetailForm.pyeeName = res.data.retData.pyeeName; //收款人名称
              this.showInfoDetailForm.pyeeAcctNo = res.data.retData.pyeeAcctNo;
              this.showInfoDetailForm.pyeeBankName = res.data.retData.pyeeBankName;
              this.showInfoDetailForm.acptBankNo = res.data.retData.acptBankNo;
              this.showInfoDetailForm.acptBankName = res.data.retData.acptBankName;
              this.showInfoDetailForm.drwrBankNo = res.data.retData.drwrBankNo; //出票人开户行行号
              this.showInfoDetailForm.drwrBankName = res.data.retData.drwrBankName;
              this.showInfoDetailForm.drweBankNo = res.data.retData.drweBankNo; //付款人开户行行号
              this.showInfoDetailForm.drweBankName = res.data.retData.drweBankName;
              this.rgstBackWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      rgstBackWinSubmit() {
        this.backForm.listIds = this.currentSelectRow.id;
        this.$refs["backForm"].validate(valid => {
          if (valid) {
            post(this.backForm, "/ce/cpesrgst/acptRgst/acptRgstCancel/func_cancelAcptRgst").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleSearch();
                  this.rgstBackWinClose();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      rgstBackWinClose() {
        this.$refs.backForm.resetFields();
        this.backForm.listIds = "";
        this.$refs.showInfoDetailForm.resetFields();
        this.rgstBackWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
