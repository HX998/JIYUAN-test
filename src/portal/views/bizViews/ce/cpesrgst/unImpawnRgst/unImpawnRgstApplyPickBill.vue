<template>
  <!--存票挑票弹出框-->
  <h-msg-box v-model="tempPickBillWin" width="1000" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>挑选解质押登记票据</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="pickBillForm" :label-width="100" ref="pickBillForm" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
          <h-input v-model="pickBillForm.billNo" placeholder=""></h-input>
        </h-form-item>
        <h-form-item prop="rgstDt" :label="$t('m.i.ce.impawnDt')">
          <h-date-picker type="date" v-model="pickBillForm.rgstDt" placeholder="" @on-change="handleDateChange"
                         :editable=false></h-date-picker>
        </h-form-item>
        <h-form-item class="h-form-operate two-form">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="columns"
          :auto-load="false"
          url="/ce/cpesrgst/impawnRgst/impawnRgstApply/func_pagingQueryPaperRgst"
          :bindForm="pickBillForm"
          :row-select="true"
          :has-select="false"
          ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></rgst-bill-info-main>
  </h-msg-box>
</template>

<script>
  import { post, on, off, formatNumber, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "unImpawnRgstApplyPickBill",
    data() {
      return {
        pickBillForm: {
          rgstClass: "RI01",
          rgstStatus: "BTA04",
          busiLock:"0",
          billNo: "",
          rgstDt: ""
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
            title: "序号",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
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
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
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
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.impawnDt"),
            key: "rgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.rgstDt == null ? "" : this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.qualityBankName"),
            key: "transToBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.pledgorName"),
            key: "transFromName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.pledgorAcctNo"),
            key: "transFromAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.pledgorBankNo"),
            key: "transFromBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.pledgorSocCode"),
            key: "transFromSocCode",
            hiddenCol: false
          }
        ],
        billId: "",
        billNo: "",
        showBillInfoWin: false,
      };
    },
    props: {
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    watch: {
      pickBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempPickBillWin: {
        get() {
          return this.pickBillWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleDateChange(value) {
        this.pickBillForm.rgstDt = value.replace(/-/g, "");
      },
      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.pickBillForm.resetFields();
      },
      handleClose() {
        this.$refs.pickBillForm.resetFields();
        this.$emit("pickBillWinClose", "");
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
      submitForm() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$emit("pickBillSubmit", list);
      }
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode").then(res => {
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
