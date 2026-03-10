<template>
  <!--贴现挑票弹出框-->
  <h-msg-box v-model="tempDiscPickBillWin" width="1000" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{ title }}</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="pickBillForm" :label-width="100" ref="pickBillForm" cols="4" class="h-form-search">
<!--        <common-select v-model="pickBillForm.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                       :dictList="tmpBillOriginList"></common-select>-->
        <bill-no :formItem="pickBillForm" :label="$t('m.i.billInfo.billPackageNo')"
                 v-model="pickBillForm.billNo"></bill-no>
        <bill-range :formItem="pickBillForm" :rangeProps="['billRangeStart','billRangeEnd']"></bill-range>
        <common-select v-model="pickBillForm.otherBankDiscMark" :label="$t('m.i.ce.otherBankDisc')"
                       prop="otherBankDiscMark" :dictList="isList"></common-select>
        <query-btn :advanceShow='false' :formSearch='formSearch' :formSearchReset='formSearchReset'></query-btn>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      :auto-load="false"
      :param-id=paramId
      highlightRow
      :rowSelect="true"
      :url="queryRefusedUrl"
      :has-select="false"
      :bindForm="pickBillForm"
      ref="discPickDatagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <refuse-btn @refuse="refusedBatch" :prodNo="this.prodNo"></refuse-btn>
      <close-btn @close="handleClose"></close-btn>
      <commit-btn @commit="submitForm"></commit-btn>
    </div>
  </h-msg-box>
</template>

<script>
import {post, on, off, formatNumber, getDictListByGroups, getDictValueFromMap, accMul,formatBillRange} from "@/api/bizApi/commonUtil";

export default {
  name: "discPickBill",
  data() {
    return {
      columns: [
        {
          type: "selection",
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
          title: this.$t("m.i.billInfo.billOrigin"),
          align: 'center',
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
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
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "ratePct",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.otherBankDisc"),
          key: "platformFlag",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.platformFlag == null || params.row.platformFlag === "") {
              return h("span", "");
            } else if (params.row.platformFlag === "0" || params.row.platformFlag === "1") {
              return h("span", "是");
            } else {
              return h("span", "否");
            }
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          sortable: true,
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
          render: (h, params) => {
            if (params.row.dueDt == null || params.row.dueDt === "") {
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          hiddenCol: false
        }
      ],
      isList: [],
      billOriginList: [],
      tmpBillOriginList: [],
      paramId:'transId',
      pickBillForm: {
        billNo: '',
        otherBankDiscMark: '',
        billOrigin: '',
        billRangeStart: '',
        billRangeEnd: ''
      }
    }
  },
  props: {
    discPickBillForm: {
      billNo: '',
      otherBankDiscMark: '',
      isInner: '',
      isSameLegal: '',
      billOrigin: '',
      billRangeStart: '',
      billRangeEnd: '',
      billOriginList: [],
      prodNo: '',
    },
    discPickBillWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return "挑票查询";
      }
    },
    queryRefusedUrl: {
      type: String,
      default() {
        return "/ce/disc/batch/pageQueryRefusedDsicBillList";
      }
    },
    refuseUrl: {
      type: String,
      default() {
        return "/ce/disc/bill/refuseBill";
      }
    },
    batchId: "",
    prodNo: "",
  },
  watch: {
    discPickBillWin(val) {
      if (val === true) {
        this.$nextTick(() => {
          this.tmpBillOriginList = [];
          for(let i=0 ; i<this.billOriginList.length ; i++){
            if (this.discPickBillForm.billOriginList.includes(this.billOriginList[i].key)){
              this.tmpBillOriginList.push(this.billOriginList[i]);
            }
          }
          if (this.discPickBillForm.prodNo === '01061121' || this.discPickBillForm.prodNo === '01061122') {
            this.paramId = 'hldrId';
          }
          this.formSearchReset();
          this.formSearch();
        });
      }
    }
  },
  computed: {
    tempDiscPickBillWin: {
      get() {
        return this.discPickBillWin;
      },
      set() {
      }
    }
  },
  methods: {
    onMaximize() {
      setTimeout(() => {
        this.$refs.discPickDatagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    //查询
    formSearch() {
      this.$refs.discPickDatagrid.dataChange(1);
    },
    //重置
    formSearchReset() {
      this.$refs.pickBillForm.resetFields();
      this.pickBillForm.aoAcctNo = this.discPickBillForm.aoAcctNo;
      this.pickBillForm.aoAcctBankNo = this.discPickBillForm.aoAcctBankNo;
      this.pickBillForm.custAcctNo = this.discPickBillForm.custAcctNo;
      this.pickBillForm.discDt = this.discPickBillForm.discDt;
      this.pickBillForm.billClass = this.discPickBillForm.billClass;
      this.pickBillForm.billType = this.discPickBillForm.billType;
      this.pickBillForm.clearMark = this.discPickBillForm.clearMark;
      this.pickBillForm.banEndrsmtMark = this.discPickBillForm.banEndrsmtMark;
      this.pickBillForm.isBillRate = this.discPickBillForm.isBillRate;
      this.pickBillForm.licenseFlag = this.discPickBillForm.licenseFlag;
      this.pickBillForm.ownedBrchNo = this.discPickBillForm.ownedBrchNo;
      this.pickBillForm.rateType = this.discPickBillForm.rateType;
      this.pickBillForm.rate = this.discPickBillForm.rate;
      this.pickBillForm.prodNo = this.discPickBillForm.prodNo;
      this.pickBillForm.billOriginList = this.discPickBillForm.billOriginList;
    },
    handleClose() {
      this.formSearchReset();
      this.$refs.discPickDatagrid.selects = [];
      this.$refs.discPickDatagrid.selectIds = [];
      this.$emit("discPickBillWinClose", "");
    },
    submitForm() {
      if (this.$refs.discPickDatagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      this.$emit("discPickBillChange", this.$refs.discPickDatagrid.selects, () => {
        this.$refs.discPickDatagrid.selects = [];
        this.$refs.discPickDatagrid.selectIds = [];
        this.$refs.discPickDatagrid.dataChange(this.$refs.discPickDatagrid.pageInfo.pageNo);
      });

    },
    //拒绝按钮
    refusedBatch() {
      if (this.$refs.discPickDatagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定拒绝吗？",
        onOk: () => {
          this.handleRefusedBatch();
        }
      });
    },
    handleRefusedBatch() {
      let list = this.$refs.discPickDatagrid.selects;
      let ids = "";
      for (let i = 0, count = list.length; i < count; i++) {
        ids += list[i].transId;
        if (i < list.length - 1) {
          ids += ",";
        }
      }
      post({transIds: ids}, this.refuseUrl).then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, {info: msg});
            this.$refs.discPickDatagrid.dataChange(this.$refs.discPickDatagrid.pageInfo.pageNo);
            this.$refs.discPickDatagrid.selects = [];
            this.$refs.discPickDatagrid.selectIds = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.discPickDatagrid.dataChange(this.$refs.discPickDatagrid.pageInfo.pageNo);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
        }
      });
    },
  },
  mounted() {
    getDictListByGroups("Yon,DraftTypeCode,BillOrigin").then(res => {
      this.isList = res.get("Yon");
      this.billOriginList = res.get("BillOrigin");
      this.dictMap = res.get("map");
    });
    on(window, "resize", this.handleResize);
  }
};
</script>

<style scoped>

</style>
