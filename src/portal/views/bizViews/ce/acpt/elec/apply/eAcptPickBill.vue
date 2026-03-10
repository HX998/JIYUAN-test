<template>
  <!--电票质押挑票弹出框-->
  <h-msg-box v-model="tempAcptPickBillWin" width="1000" :mask-closable="false" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="acptPickBillForm" :label-width="100" ref="acptPickBillForm" cols="4"
                class="h-form-search">
          <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="acptPickBillForm.reverseBillNo" prop="reverseBillNo"></bill-no>
          <bill-range :formItem="acptPickBillForm" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
          <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
            <h-input v-model="acptPickBillForm.acptName" :maxlength=60></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.minBillPackageMoney')" prop="minBillMoney" class="h-form-long-label">
            <h-typefield type="money" v-model="acptPickBillForm.minBillMoney" :maxlength="20"
                         placeholder="数字，小数位最多2位" bigTips ></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.maxBillPackageMoney')" prop="maxBillMoney" class="h-form-long-label">
            <h-typefield type="money" v-model="acptPickBillForm.maxBillMoney" :maxlength="20"
                         placeholder="数字，小数位最多2位" bigTips></h-typefield>
          </h-form-item>
          <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
            <h-input v-model="acptPickBillForm.pyeeName" :maxlength=60></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                            :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="columns"
          :url="URL"
          paramId="billId"
          :bindForm="acptPickBillForm"
          :hasSelect="false"
          :auto-load="false"
          :rowSelect="true"
          ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" ref="billInfoMain" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </h-msg-box>
</template>

<script>
import {formatBillRange, formatNumber} from "@/api/bizApi/commonUtil";

export default {
    name: "eImpawnPickBill",
    data() {
      return {
          showBillInfoWin: false,
          billId: "",
          billNo: "",
          billRangeStart:"",
          billRangeEnd:"",
        acptPickBillForm: {
          billNo: "",
          acptName: "",
          minDueDt: "",
          maxDueDt: "",
          minRemitDt: "",
          maxRemitDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          batchId: "",
          billType: "",
          pyeeName:"",
          drwrAcctNo: "",
          drwrBankNo:"",
          acptType:"",
          agencyAcctNo:"",
          agencyBankNo:"",
          acptBrchNo:"",
          billOrigin:"",
          reverseBillNo:"",
          billOriginList:[],
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          reserve2:"",
        },
        URL: "/ce/acpt/elec/apply/eAcptApplyMain/func_queryAcptPickBillList",
        ifShowMore: false,
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
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.acptPickBillParams.dictMap,"BillOrigin",params.row.billOrigin);
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
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
            }
          },
          {
            title:  this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.acptPickBillParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
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
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false,
          }
        ],
        currentSelectList: [],
        currentSelectRowInx: [],
        isList: []
      }
    },
    props: {
      title: {
        type: String,
        default() {
          return "挑票查询";
        }
      },
      acptPickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      acptPickBillParams: {
        type: Object,
        default: {
          batchId: "",
          drwrAcctNo: "",
          drwrBankNo:"",
          acptType:"",
          agencyAcctNo:"",
          agencyBankNo:"",
          remitDt:"",
          dueDt:"",
          dictMap: new Map(),
          licenseFlag:false,
          ownedBrchNo:"",
          acptBrchNo:"",
          selectBillOriginList:[],
          billOriginList:[]
        }
      }
    },
    watch: {
      acptPickBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempAcptPickBillWin: {
        get() {
          return this.acptPickBillWin;
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
      //查询
      formSearch() {
        this.currentSelectList = [];
        this.acptPickBillForm.batchId = this.acptPickBillParams.batchId;
        this.acptPickBillForm.drwrAcctNo = this.acptPickBillParams.drwrAcctNo;
        this.acptPickBillForm.drwrBankNo = this.acptPickBillParams.drwrBankNo;
        this.acptPickBillForm.acptType = this.acptPickBillParams.acptType;
        this.acptPickBillForm.agencyAcctNo = this.acptPickBillParams.agencyAcctNo;
        this.acptPickBillForm.agencyBankNo = this.acptPickBillParams.agencyBankNo;
        this.acptPickBillForm.minRemitDt = this.acptPickBillForm.maxRemitDt = this.acptPickBillParams.remitDt.replace(/-/g, "");
        this.acptPickBillForm.minDueDt = this.acptPickBillForm.maxDueDt = this.acptPickBillParams.dueDt.replace(/-/g, "");
        this.acptPickBillForm.ownedBrchNo = this.acptPickBillParams.ownedBrchNo;
        this.acptPickBillForm.licenseFlag = this.acptPickBillParams.licenseFlag;
        this.acptPickBillForm.acptBrchNo = this.acptPickBillParams.acptBrchNo;
        this.acptPickBillForm.reserve2 = this.acptPickBillParams.reserve2;
        this.acptPickBillForm.billOriginList = this.acptPickBillParams.selectBillOriginList;

        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.acptPickBillForm.resetFields();
      },
      // handleSelectClick(arr, selectInx) {
      //   this.currentSelectList = arr;
      //   this.currentSelectRowInx = selectInx;
      // },
      handleClose() {
        this.formSearchReset();
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("acptPickBillWinClose", "");
      },
      submitForm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList.length > 0) {
          this.$refs.datagrid.$refs.gridPage.clearElevator();
          this.$emit("acptPickBillChange", this.currentSelectList);
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        }
      },
        billInfoWinClose() {
            this.billId = "";
            this.billNo = "";
            this.showBillInfoWin = false;
        },
        showBillInfo(row) {
            this.billId = row.billId;
            this.billNo = row.billNo;
            this.billRangeStart = row.billRangeStart;
            this.billRangeEnd = row.billRangeEnd;
            this.showBillInfoWin = true;
        }
    }
  };
</script>

<style scoped>

</style>
