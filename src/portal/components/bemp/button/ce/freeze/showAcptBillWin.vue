<template>
  <div>
    <h-msg-box v-model="tempShowAcptBillWin" maximize width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               @on-maximize="onMaximize" class="h-form-table-layer">
      <p slot="header">
        <span>挑票</span>
      </p>
      <!-- 查询表单 -->
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <!--出票人全称-->
          <common-input v-model="formItem.drwrName" :label="$t('m.i.billInfo.drwrName')" prop="drwrName" :readonly="true" :showIcon="true"
                        @on-click="queryCustName()" :clearable="true" :clearVal="clearVal" :clearValTag="this.custName"></common-input>
          <!--出票人账号-->
          <common-input v-model="formItem.drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo" :readonly="true" :showIcon="true"
                        @on-click="queryCustAcctNo()" :clearable="true" :clearVal="clearVal" :clearValTag="this.custAcctNo"></common-input>
          <!--票据号码-->
          <common-input v-model="formItem.likeBillNo" :label="$t('m.i.billInfo.billPackageNo')" prop="likeBillNo" :maxlength="30"></common-input>
          <!--票据(包)金额(元)-->
          <common-type-field-range v-model="formItem" :label="$t('m.i.billInfo.billPackageMoney')" :integerNum="16" :suffixNum="2" :validRules="billMoneyRule"
                                   :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false" class="h-form-long-label"></common-type-field-range>
          <!--承兑协议编号-->
          <common-input v-if="this.isBankBill" v-model="formItem.acptProtocalNo" :label="$t('m.i.billInfo.acptProtocalNo')" prop="acptProtocalNo" :maxlength="60"></common-input>
          <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
        </h-form>
      </div>
      <!-- 数据展示表格 -->
      <h-row>
        <h-col span="24">
          <h-datagrid :columns="columns"
                      highlightRow
                      :url="queryUrl"
                      :bindForm="formItem"
                      :onRowDbClick="doubleHandleClick"
                      :on-select-change="handleRowClick"
                      :auto-load="true"
                      ref="datagrid">
          </h-datagrid>
        </h-col>
      </h-row>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="formItem.drwrCustNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!-- 票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { getDictListByGroups, getDictValueFromMap, formatNumber, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "showAcptBillWin",
    components: {
    },
    data(){
      return {
        billMoneyRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "票据(包)金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        custName: "custName",
        custAcctNo: "custAcctNo",
        showBillInfoWin: false,
        billId: "",
        billNo:"",
        billRangeStart:"",
        billRangeEnd:"",
        formItem: {
          drwrCustNo: "",
          drwrName: "",
          drwrAcctNo: "",
          likeBillNo: "",
          acptProtocalNo: "",
          billType:"AC01",
          minBillMoney:"",
          maxBillMoney:""
        },
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        //是否显示更多查询项
        ifShowMore: false,
        columns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: true,
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params);
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
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.originBillRange"),
            align:'center',
            key:"originBillRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.originBillRangeStart;
              let billRangeEnd = params.row.originBillRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptStatus",params.row.acptStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.acptDt'),
            key: 'acptDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.acptDt ? this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }
        ],
        currentSelectRow : [],
        YonList: [],
        billTypeList: [],
        dictMap: new Map(),
        // 是否银票
        isBankBill: true
      }
    },
    props: {
      showAcptBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      acptBillParams: {
        type: Object,
        default() {
          return {};
        }
      },
      queryUrl: {
        required: true,
        default() {
          return "";
        }
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,FreezeStatus,FreezeRgstType,AcptStatus,Yon,AttTypeCode,FileDetailStatus,PreRelationFlag").then(res => {
        this.YonList = res.get("Yon");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods:{
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectRow = [];
            this.$nextTick(() => {
              this.$refs.datagrid.dataChange(1);
            });
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.$refs.formItem.resetFields();
          this.formItem.drwrCustNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrAcctNo = "";
          this.formItem.sspdStatus = "";
          this.formItem.likeBillNo = "";
          this.formItem.acptProtocalNo = "";
          this.formItem.billType = this.acptBillParams.billType;
          this.formItem.minBillMoney = "";
          this.formItem.maxBillMoney = "";
        });
      },
      handleClose(){
        this.resetSearch();
        this.$emit("showAcptBillInfoWinClose", "");
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = "";
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = "";
        }
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billInfo) {
        this.billId = billInfo.row.billId;
        this.billNo = billInfo.row.billNo;
        this.billRangeStart = billInfo.row.billRangeStart;
        this.billRangeEnd = billInfo.row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("acptBillInfoSelectSubmit", this.currentSelectRow);
        this.resetSearch();
      },
      submitForm() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
      }
        this.$emit("acptBillInfoSelectSubmit", this.currentSelectRow[0]);
        this.resetSearch();
      },

    },
    watch: {
      showAcptBillWin(val) {
        if (val) {
          this.resetSearch();
          this.formItem.billType = this.acptBillParams.billType;
          this.$nextTick(() => {
            if (this.acptBillParams.billType && this.acptBillParams.billType === 'AC02') {
              this.isBankBill = false;
              this.columns = this.$refs.datagrid.controlColumnsHidden("acptProtocalNo", true);
            }
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempShowAcptBillWin: {
        get() {
          return this.showAcptBillWin;
        },
        set() {
        }
      }
    }
  };
</script>

<style scoped>

</style>
