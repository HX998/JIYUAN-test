<template>
  <!--存票挑票弹出框-->
  <h-msg-box v-model="tempSavePickBillWin" width="1000" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>存票挑票</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="savePickBillForm" :label-width="100" ref="savePickBillForm" cols="4" class="h-form-search">
        <bill-no :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" v-model="savePickBillForm.billNo"></bill-no>
        <bill-range :form-item="savePickBillForm" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
        <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
          <h-date-picker type="date" v-model="savePickBillForm.dueDt" placeholder="" @on-change="handleDateChange"
                         :editable=false></h-date-picker>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney">
          <h-row>
            <h-col span="11">
              <h-typefield v-model="savePickBillForm.minBillMoney" integerNum="10" placeholder="" type="money"
                           bigTips></h-typefield>
            </h-col>
            <h-col span="2" style="text-align: center">-</h-col>
            <h-col span="11">
              <h-typefield v-model="savePickBillForm.maxBillMoney" integerNum="10" placeholder="" type="money"
                           bigTips></h-typefield>
            </h-col>
          </h-row>
        </h-form-item>
        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="formSearch()">{{ $t("m.i.common.search") }}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      :auto-load="false"
      :url="dataUrl"
      :bindForm="savePickBillForm"
      rowSelect
      :has-select="hasSelect"
      :param-id="paramIdVal"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="primary" @click="refusePick">{{ $t('m.i.pl.refuse') }}</h-button>
      <h-button type="primary" @click="submitForm">{{ $t("m.i.common.commit") }}</h-button>
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import {
  post,
  on,
  off,
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  accMul,
  formatBillRange
} from "@/api/bizApi/commonUtil";


export default {
  name: "eSaveBillPick",
  data() {
    return {
      paramIdVal: "billId",
      hasSelect: false,
      dataUrl: "",
      refuseUrl: "",
      savePickBillForm: {
        billNo: '',
        minBillRangeStart: '',
        maxBillRangeEnd: '',
        billRangeStart: '',
        billRangeEnd: '',
        dueDt: '',
        batchId: '',
        billClass: '',
        billType: '',
        minBillMoney: '',
        maxBillMoney: '',
        custAcctNo: '',
        custNo: '',
        billOriginArray: [],
      },
      columns: [
        {
          type: 'selection',
          key: 'multiSelect',
          width: 60,
          hiddenCol: false,
        },
        {
          type: 'index',
          key: 'numOrder',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: "drwrAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
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
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          sortable: true,
          hiddenCol: false,
        }
      ],
      isList: [],
    };
  },
  props: {
    savePickBillWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    eSavePickBillForm: {
      billClass: '',
      billType: '',
      batchId: '',
      custAcctNo: '',
      custNo: '',
      billOriginArray: []
    }
  },
  watch: {
    savePickBillWin(val) {
      if (val === true) {
        this.savePickBillForm.billClass = this.eSavePickBillForm.billClass;
        this.savePickBillForm.billType = this.eSavePickBillForm.billType;
        this.savePickBillForm.batchId = this.eSavePickBillForm.batchId;
        this.savePickBillForm.custAcctNo = this.eSavePickBillForm.custAcctNo;
        this.savePickBillForm.custNo = this.eSavePickBillForm.custNo;
        this.savePickBillForm.billOriginArray = this.eSavePickBillForm.billOriginArray;
        this.dataUrl = this.billClass === "ME01" ? "/pl/custody/paper/saveBill/saveBillApplyMain/func_pageQuerySaveBillPick" : "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_pageQuerySaveBillPick";
        this.refuseUrl = this.billClass === "ME01" ? "/pl/custody/paper/saveBill/saveBillApplyMain/func_applyRefuseBill" : "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_applyRefuseBill";
        this.$nextTick(() => {
          this.formSearch();
        });
      }
    },
  },
  computed: {
    tempSavePickBillWin: {
      get() {
        return this.savePickBillWin;
      },
      set() {
      }
    },
  },
  methods: {
    handleDateChange(value) {
      this.savePickBillForm.dueDt = value.replace(/-/g, "");
    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    //查询
    formSearch() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.dataChange(1);
    },
    //重置
    formSearchReset() {
      this.savePickBillForm.minBillMoney = "";
      this.savePickBillForm.maxBillMoney = "";
      this.$refs.savePickBillForm.resetFields();
    },
    handleClose() {
      this.$refs.savePickBillForm.resetFields();
      this.savePickBillForm.minBillMoney = "";
      this.savePickBillForm.maxBillMoney = "";
      this.$emit("savePickBillWinClose", "");
    },
    submitForm() {
      let list = this.$refs.datagrid.selects;
      if (list.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.$emit("savePickBillChange", list);
    },

    refusePick() {
      let list = this.$refs.datagrid.selects;
      if (list.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      let pickDtoList = [];
      for (let i = 0; i < list.length; i++) {
        let pickDto = {
          transId: list[i].transId,
          billId: list[i].billId,
          hldrId: list[i].hldrId
        };
        pickDtoList.push(pickDto);
      }
      post({pickBillDtoList: pickDtoList}, this.refuseUrl).then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, {info: msg});
            this.formSearch();
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.formSearch();
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
        }
      });
    }
  },
  mounted() {
    getDictListByGroups("Yon,DraftTypeCode,BillOrigin").then(res => {
      this.isList = res.get("Yon");
      this.isList = res.get("BillOrigin");
      this.dictMap = res.get("map");
    });
  }
};
</script>

<style scoped>

</style>
