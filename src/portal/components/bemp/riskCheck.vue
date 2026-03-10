<!--风险票据检查反显界面-->
<template>
  <h-msg-box v-model="tempRiskCheckWin" width="1000" :mask-closable="false" top="10" class="h-form-table-layer"
             :maximize="true" @on-close="handleClose" @on-maximize="onMaximize"  :z-index="1500">
    <p slot="header">
      <span>{{ title }}</span>
    </p>
    <div class="h-risk-box">
      <h-form :model="isPassForm" :label-width="90" ref="isPassForm" cols="3" class="h-form-search">
        <h-form-item prop="isPass" label="是否通过" required>
          <h-select v-model="isPassForm.isPass" placeholder="" :readonly="isPassReadOnly">
            <h-option v-for="item in yonList" :value="item.key" :key="item.key">{{ item.value }}
            </h-option>
          </h-select>
        </h-form-item>
      </h-form>
      <ul>
        <li v-if="ifCustShow">
          <h2 class="h-risk-title">客户黑名单</h2>
          <h-datagrid
            :columns="custInfoColumns"
            :gridData="custInfoGridDatas"
            :hasPage="false"
            highlight-row
            showListCkeckBox
            :auto-load="false"
            :height="200"
            ref="custInfoDatagrid">
          </h-datagrid>
        </li>
        <li v-if="ifBillShow">
          <h2 class="h-risk-title">风险票据</h2>
          <h-datagrid
            :columns="riskBillColumns"
            :gridData="riskBillGridDatas"
            :hasPage="false"
            highlight-row
            showListCkeckBox
            :auto-load="false"
            :height="200"
            ref="riskBillDatagrid">
          </h-datagrid>
        </li>
      </ul>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
      <h-button type="primary" v-else @click="riskSubmit()">{{ $t("m.i.common.commit") }}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import {post, on, off, formatNumber, formatBillRangeNoBillOrigin} from "@/api/bizApi/commonUtil";

export default {
  name: "riskCheck",
  data() {
    return {
      isPassForm: {
        isPass: ""
      },
      custInfoColumns: [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: "风险级别",
          key: "riskLevel",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let info = params.row.riskLevel;
            if (info === "0") {
              info = "禁止";
            } else if (info === "1") {
              info = "提示";
            }
            return h("span", info);
          }
        },
        {
          title: "风险描述",
          key: "riskDesc",
          ellipsis: false,
          hiddenCol: false
        }
      ],
      custInfoGridDatas: {
        list: []
      },
      riskBillColumns: [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'),
          key: "billNo",
          hiddenCol: false,
          sortable: true,
          width: 250
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
          title: this.$t('m.i.billInfo.remitDt'),
          key: "remitDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.remitDt == null || params.row.remitDt === "") {
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.billInfo.dueDt'),
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
          title: this.$t('m.i.billInfo.billPackageMoney'),
          key: "billMoney",
          hiddenCol: false,
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
          title: this.$t('m.i.billInfo.drwrName'),
          key: "drwrName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: "acptName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: "风险描述",
          key: "riskDesc",
          ellipsis: false,
          hiddenCol: false
        }
      ],
      riskBillGridDatas: {
        list: []
      },
      yonList: [],
      submitFlag: false,
      ifCustShow: false,
      ifBillShow: false,
      isPassReadOnly: false,
      riskLevel: "",
    }
  },
  props: {
    title: {
      type: String,
      default: "风险信息"
    },
    riskCheckWin: {
      type: Boolean,
      default: false
    },
    riskParams: {
      type: Object,
      default() {
        return {
          gridDatas: {},           //反显的风险信息数据
          submitParams: {},               //风险信息通过后传参
          YonList: []
        };
      }
    }
  },
  computed: {
    tempRiskCheckWin: {
      get() {
        return this.riskCheckWin;
      },
      set() {
      }
    },
    getHeight() {
      return window.innerHeight - 130;
    }
  },
  watch: {
    riskCheckWin(val) {
      if (val) {
        this.yonList = this.riskParams.YonList;
        this.isPassReadOnly = false;
        if (!!this.riskParams.gridDatas.CUSTNO && this.riskParams.gridDatas.CUSTNO.length > 0) {
          let custInfo = this.riskParams.gridDatas.CUSTNO;
          this.custInfoGridDatas.list = (custInfo instanceof Array) ? custInfo : [custInfo];
          this.ifCustShow = true;
          for (let custInfo of this.custInfoGridDatas.list) {
            this.riskLevel = custInfo.riskLevel;
            if (custInfo.riskLevel === "0") {
              this.isPassForm.isPass = "0";
              this.isPassReadOnly = true;
            }
          }
        } else {
          this.custInfoGridDatas.list = [];
          this.ifCustShow = false;
        }
        if (!!this.riskParams.gridDatas.BILLNO && this.riskParams.gridDatas.BILLNO.length > 0) {
          let billInfo = this.riskParams.gridDatas.BILLNO;
          this.riskBillGridDatas.list = (billInfo instanceof Array) ? billInfo : [billInfo];
          this.ifBillShow = true;
        } else {
          this.riskBillGridDatas.list = [];
          this.ifBillShow = false;
        }
      }
    }
  },
  methods: {
    onMaximize() {
      setTimeout(() => {
        if (this.$refs.custInfoDatagrid != null) {
          this.$refs.custInfoDatagrid.$refs.gridContent.handleResize();
        }
        if (this.$refs.riskBillDatagrid != null) {
          this.$refs.riskBillDatagrid.$refs.gridContent.handleResize();
        }
      }, 100);
    },
    handleResize() {
      this.$nextTick(() => {
        if (this.$refs.custInfoDatagrid != null) {
          this.$refs.custInfoDatagrid.selfAdaption();
        }
        if (this.$refs.riskBillDatagrid != null) {
          this.$refs.riskBillDatagrid.selfAdaption();
        }
      });
    },
    handleClose() {
      this.$refs.isPassForm.resetFields();
      this.$emit("riskCheckWinClose", "");
    },
    riskSubmit() {
      this.$refs["isPassForm"].validate(valid => {
        if (valid) {
          if (this.isPassForm.isPass === "1") {
            this.riskParams.submitParams.riskLevel = this.riskLevel;
            this.$emit("riskCheckSubmit", this.riskParams.submitParams);
          } else {
            this.$emit("riskCheckWinClose", "");
          }
          this.$refs.isPassForm.resetFields();
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
