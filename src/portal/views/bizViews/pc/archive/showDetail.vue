<template>
  <h-msg-box v-model="tempShowDetailWin" width="1000" class="h-form-table-layer" :maximize="true" :mask-closable="false"
             @on-close="handleClose"
             :z-index="1002">
    <p slot="header">
      <span>明细页面</span>
    </p>
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="detailForm" :label-width="90" ref="detailForm" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.status')" prop="status">
          <h-select v-model="detailForm.status" placeholder="">
            <h-option v-for="item in statusList" :value="item.key" :key="item.value">{{ item.value }}
            </h-option>
          </h-select>
        </h-form-item>
      </h-form>
    </div>
    <h-datagrid :columns="detailColumns" :url="thisUrl" :auto-load="false" :bindForm="detailForm"
                :hasSelect="hasSelect"
                :param-id="paramId" rowSelect ref="detailDatagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @on-click="selectInfoBill()">{{$t("m.i.common.pickBillDetail")}}</h-button>
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="pickBillStock()">{{$t("m.i.common.commit")}}</h-button>
    </div>

  </h-msg-box>
</template>

<script>
import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber, formatBillRange} from "@/api/bizApi/commonUtil";

export default {
  name: "showDetail",
  data() {
    let _this = this;
    return {
      list:[],
      billTypeList: [],
      billClassList: [],
      tenorCodeList: [],
      bankLevelList: [],
      billOriginList: [],
      assetIndustryList: [],
      submitFlag: false,
      openI9flag:false,
      hasSelect: false,
      ifShowMore: false,
      paramId: "id",
      dueDate: [],
      buyDate: [],
      dictMap: new Map(),
      detailForm: {
        status: "",
      },
      pickBillObj: {
        creditCustTypeKeyList: [],
        billType: "",
        billClass: "",
        minResidualTerm: "",
        maxResidualTerm: ""
      },
      thisUrl: "/pc/archive/archiveMain/func_pagingQueryArchiveDetailList",
      detailColumns: [],
      billColumns: [
        {
          type: "selection",
          hiddenCol: false,
          width: 60,
        },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          hiddenCol: false,
        },
      ],
      statusList: [],
      showBrchWin: false
    };
  },
  components: {
  },
  props: {
    batchId: "",
    pickBillWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    needPickBillObj: {
      type: Object,
      default() {
        return this.pickBillObj;
      }
    },
    isTotalColl: String
  },
  computed: {
    tempShowDetailWin: {
      get() {
        return this.showDetailWin;
      },
      set() {
      }
    }
  },
  watch: {
    showDetailWin(val) {
      if (val) {
        this.handlePickBillSearch();
      }
    },
    mounted() {
      getDictListByGroups("TenorCode").then(res => {
        this.billClassList = res.get("CDMedia");
        this.dictMap = res.get("map");
      });
    }
  },
  methods:{
    handleClose(){
      this.tempShowDetailWin = false;
    },
    formatTwoNumber(num) {
      debugger
      if (num) {
        let newNum = num + "";
        if (newNum.indexOf(".") != -1) {
          return num;
        } else {
          return num + (".00");
        }
      } else {
        return "0.00";
      }
    },
    formSearch() {
      this.currentSelectRow = [];
      this.$refs.detailDatagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
      this.formItem.status="2";
    },
    handleSelectClick(arr, selectInx) {
      this.currentSelectList = arr;
      this.currentSelectRowInx = selectInx;
      if (arr.length === 0) {
        return false;
      }
    },
    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = [];
    },
    handleWinClose() {
      this.showCollectWin = false;
      this.collectForm = {
        creditLimitAmt: "",
        doAmt: "",
        usedCreditAmt: "",
        freezedAmt: ""
      };
    },
    //查询明细
    detailBillWinOpen() {
      if (!this.currentSelectRow){
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        return;
      }
      this.showDetailWin = true;
    },
    detailBillWinClose() {
      this.showDetailWin = false;
    },
  },
  created() {
    this.getDictListByGroups("ArchiveStatusList").then(res => {
      this.statusList = res.get("ArchiveStatusList");
      this.dictMap = res.get("map");
      this.formSearch();
    });
    this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
  },

};

</script>

<style scoped>

</style>
