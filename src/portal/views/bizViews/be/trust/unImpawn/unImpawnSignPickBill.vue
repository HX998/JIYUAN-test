<template>
  <!--票交机构弹出框-->
  <h-msg-box v-model="tempPickBillWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="115" ref="formItem" cols="4" class="h-form-search">
        <!--票据来源：下拉框-->
        <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin" v-if="billClass === 'ME02'">
          <h-select v-model="formItem.billOrigin" placeholder="">
            <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
          </h-select>
        </h-form-item>
        <!--票据（包）号码：-->
        <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
          <h-input v-model="formItem.reverseBillNo"></h-input>
        </h-form-item>
        <!--子票区间：区间框-->
        <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']" v-if="billClass === 'ME02'"></bill-range>
        <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney">
          <h-row>
            <h-col span="11">
              <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                           bigTips></h-typefield>
            </h-col>
            <h-col span="2" style="text-align: center">-</h-col>
            <h-col span="11">
              <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                           bigTips></h-typefield>
            </h-col>
          </h-row>
        </h-form-item>
        <h-form-item class="h-form-operate">
          <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                             :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      :url="url+'/unImpawnConfirm/func_queryUnImpawnSignBill'"
      :bindForm="formItem"
      :row-select="true"
      :has-select="false"
      :autoLoad="false"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>


  </h-msg-box>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "unImpawnSignPickBill",
    components: {
    },
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
            title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'), //票据（包）号码
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
            title: this.$t("m.i.billInfo.billRange"),   //子票区间
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
            title: this.$t('m.i.billInfo.billPackageMoney'),   //票据(包)金额
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
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
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          }
        ],
        formItem: {
          reverseBillNo: "",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          billNo: "",
          billClass: "",
          billType: "",
          custName: "",
          applyDate: "",
          custBrchCode: "",
          minApplDt: "",
          maxApplDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          transNoList: "NES.010.20.00P",
        },
        ifShowMore: false,
        showBillInfoWin: false,
        billId: null,
        currentSelectList: [],
        billRangeStart:"",
        billRangeEnd:"",
        billOriginList: [],
        url: "pb/trust/unImpawn"
      };
    },
    props: {
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "挑票查询"
      },
      batchId: {
        type: ""
      },
      billType: {
        type: String
      },
      billClass: {
        type: String
      },
      custBrchCode: {
        type: String
      },
      ownedBrchNo:"",
      licenseFlag:false,
    },
    comments: {},
    watch: {
      pickBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            let  columns = [];
            if (this.billClass ==='ME01') {
              columns = this.$refs.datagrid.controlColumnsHidden("billOrigin", true);
              columns = this.$refs.datagrid.controlColumnsHidden("billRange", true);
              //this.$refs.datagrid.controlColumnsHidden("billRange", true);
              this.columns = this.deepClone(columns);
            }else{
              columns = this.$refs.datagrid.controlColumnsHidden("billOrigin", false);
              columns = this.$refs.datagrid.controlColumnsHidden("billRange", false);
              this.columns = this.deepClone(columns);
            }
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
      /**超链接点击票号弹出票据明细**/
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      formSearch() {
        this.formItem.ownedBrchNo = this.ownedBrchNo;
        this.formItem.licenseFlag = this.licenseFlag;
        this.formItem.custBrchCode = this.custBrchCode;
        this.formItem.billClass = this.billClass;
        this.formItem.billType = this.billType;
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = null;
        this.formItem.maxBillMoney = null;
      },
      applDtChange() {
        if (this.formItem.applDate != null && this.formItem.applDate.length === 2) {
          this.formItem.minApplDt = this.formItem.applDate[0].replace(/-/g, "");
          this.formItem.maxApplDt = this.formItem.applDate[1].replace(/-/g, "");
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
        }
      },
      handleClose() {
        this.$emit("pickBillWinClose", "");
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = null;
        this.formItem.maxBillMoney = null;
      },
      submitForm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length !== 0) {
          this.$emit("pickBillChange", this.currentSelectList);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      }
    },
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,BillOrigin").then(res => {
        this.cdMediaList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
