<!--代客业务-查询客户持票-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custNo" label="客户号" required>
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearCustNo()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName" required>
                  <h-input v-model="formItem.custName" :maxlength=60 readonly></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" label="客户账号" required>
                  <h-input v-model="formItem.custAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()" clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :validRules="billNoRule">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item label="业务分类" prop="transType">
                  <h-select v-model="formItem.transType" placeholder="">
                    <h-option v-for="item in transTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item label="交易名称" prop="transNoList">
                  <h-select v-model="formItem.transNoList" placeholder="">
                    <h-option v-for="item in transNoList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item label="交易结果" prop="statusCodeList">
                  <h-select v-model="formItem.statusCodeList" placeholder="">
                    <h-option v-for="item in statusCodeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.operDt')" prop="operDtStr">
                  <h-date-picker v-model="formItem.operDtStr" type="daterange" showFormat :editable=false
                                 @on-change="handleOperDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid
                :columns="columns"
                highlightRow
                url="/bm/valetBusiness/queryCustHisBill/func_queryCustOperHist"
                :bindForm="formItem"
                :onSelectChange="handleSelectClick"
                :rowSelect="true"
                :auto-load="false"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustElecSignWin" @custElecSignWinClose="custElecSignWinClose"
                         @custElecSignSubmit="custElecSignSubmit"></show-cust-elec-sign>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustAcctNoWin" :custInfoParams="custInfoParams" :isShowCustAcctNo="true"
                         @custElecSignWinClose="showCustAcctNoWinClose"
                         @custElecSignSubmit="custAcctNoSelectSubmit"></show-cust-elec-sign>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,formatBillRange,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "queryCustBill",
    components: { },
    data() {
      let options = {};
      //区分最大和最小票据金额
      options.billMoneyType = "min";
      options.dueDt = [];
      options.remitDt = [];
      options.operDt = [];
      options.formItem = {
        custNo: "",
        custName: "",
        custAcctNo: "",
        billNo: "",
        drwrName: "",
        pyeeName: "",
        acptName: "",
        billType: "",
        minBillMoney: "",
        maxBillMoney: "",
        minDueDt: "",
        maxDueDt: "",
        minRemitDt: "",
        maxRemitDt: "",
        transNoList : [],
        transType : "",
        statusCodeList:[],
        operDtStr : "",
        minTransStartDt:"",
        maxTransStartDt:"",
        billOrigin: "",
        minBillRangeStart: "",
        minBillRangeEnd: "",
        maxBillRangeStart: "",
        maxBillRangeEnd: ""
      };
      options.billNoRule = [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }];
      options.columns = [
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
          title: this.$t('m.i.billInfo.billOrigin'),
          key: "billOrigin",
          render: (h, params) => {
            let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = "";
            if (params.row.billNo === null || params.row.billNo === "") {
              billNo = this.$t('m.i.ce.showBillInfo');
            } else {
              billNo = params.row.billNo;
            }
            return h("a", {
              on: {
                click: () => {
                  if (params.row.billRangeStart != null && params.row.billRangeEnd != null) {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart.toString(), params.row.billRangeEnd.toString());
                  } else {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }
            }, billNo);
          }
        },
        {
          title: this.$t('m.i.billInfo.billRange'),
          key: "billRange",
          align: 'center',
          render: (h, params) => {
            return h("span", formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd));
          }
        },
/*
        {
          title: "票据种类",
          key: "billType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: "票据状态",
          key: "ecdsBillStatus",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "EcdsBillStatusCode", params.row.ecdsBillStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
*/
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),
          key: "billMoney",
          ellipsis: false,
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
          title: this.$t('m.i.billInfo.remitDt'),
          key: "remitDt",
          ellipsis: false,
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
          ellipsis: false,
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
          title: "业务分类",
          key: "transType",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.transType == null || params.row.transType === "") {
              return "";
            }
            let list = getDictValueFromMap(this.dictMap, "TransBusiTypeCode", params.row.transType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: "交易名称",
          key: "transNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.transNo == null || params.row.transNo === "") {
              return "";
            }
            let transName = this.getDictValueFromMap(this.dictMap,"ValetOperTransNoWithOutType",params.row.transNo);
            return h("span", transName);
          }
        },
        {
          title: "交易结果",
          key: "statusCode",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "StatusCode", params.row.statusCode);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.common.operDt"),
          key: "transStartDt",
          ellipsis: false,
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let transStartDt = params.row.transStartDt;
            if (transStartDt == null || transStartDt === "" || transStartDt === 0) {
              return "";
            }
            let date = this.$moment(transStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.common.operTellerNo'),
          key: "operTellerNo",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let operTellerNo = params.row.operTellerNo;
            if (operTellerNo == null || operTellerNo === "") {
              return "";
            }
            let operTellerName = this.userMap.get(operTellerNo);
            if (operTellerName == null || operTellerName === "") {
              operTellerName =  operTellerNo;
            }
            return h("span", operTellerName);
          }
        },
        {
          title: "申请日期",
          key: "transApplDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let transApplDt = params.row.transApplDt;
            if (transApplDt == null || transApplDt === "" || transApplDt === 0) {
              return "";
            }
            let date = this.$moment(transApplDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: "签收日期",
          key: "transSignDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.transSignDt == null || params.row.transSignDt === "" || params.row.transSignDt === 0) {
              return "";
            }
            let date = this.$moment(params.row.transSignDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
      ];
      options.billTypeList = [];
      options.transNoList = [];
      options.transTypeList = [];
      options.statusCodeList = [];
      options.billOriginList= [];
      options.dictMap = new Map();
      options.userMap = new Map();
      options.currentSelectList = [];
      //是否显示更多查询项
      options.ifShowMore = false;
      options.showCustElecSignWin = false;
      options.showCustAcctNoWin = false;
      options.showBillInfoWin = false;
      options.billId = "";
      options.billNo = "";
      options.billRangeStart = "";
      options.billRangeEnd = "";
      options.custInfoParams = {};
      return options;
    },
    computed: {
      isMinBillMoney() {
        return this.billMoneyType === "min" ? "minBillMoney" : "maxBillMoney";
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,EbTransNoCode,EcdsBillStatusCode,StatusCode,BillOrigin,TransBusiTypeCode,ValetOperTransNoWithOutType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.transNoList = res.get("ValetOperTransNoWithOutType");
        this.statusCodeList = res.get("StatusCode");
        this.billOriginList = res.get("BillOrigin");
        this.transTypeList=res.get("TransBusiTypeCode");
        this.dictMap = res.get("map");
      });
      post({ }, "/sm/auth/user/queryAllUsersBySession").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let list = res.data.retData;
            for(let i = 0; i < list.length; i ++){
              this.userMap.set(list[i].userNo, list[i].userName);
            }
          }
        }
      });
      //
    },
    watch: {
    },
    methods: {
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }

      },
      handleOperDtChange(arr) {
        if(arr && arr.length == 2) {
          this.formItem.minTransStartDt = arr[0].replace(/-/g, "");
          this.formItem.maxTransStartDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minTransStartDt = "";
          this.formItem.maxTransStartDt = "";
        }
      },

      clearCustNo() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
      },
      //查询客户信息
      queryCustNo() {
        this.showCustElecSignWin = true;
      },
      //赋值
      custElecSignSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustElecSignWin = false;
      },
      //关闭
      custElecSignWinClose() {
        this.showCustElecSignWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.custInfoParams = { custNo: this.formItem.custNo, custName: this.formItem.custName };
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      formatBillMoney(optType, itemType) {
        this.billMoneyType = itemType;
        if (optType === "blur") {
          if (itemType === "min") {
            if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
              this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
              this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
          } else {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
          }
        }
      },
      //表单查询
      handleSearch() {
        let minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        let maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        if (parseFloat(minBillMoney) > parseFloat(maxBillMoney)) {
          this.$msgTip.info(this, { info: "票据金额区间输入有误" });
          return;
        }
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectList = [];
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
            this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
            this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
            this.formItem.minRemitDt = this.formItem.minRemitDt.replace(/-/g, "");
            this.formItem.maxRemitDt = this.formItem.maxRemitDt.replace(/-/g, "");
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDt = [];
        this.remitDt = [];
        this.formItem.minOperDt = "";
        this.formItem.maxOperDt = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
        this.formItem.operDtStr = "";
        this.$refs.datagrid.tData = [];
        this.currentSelectList = [];
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        if (arr.length === 0) {
          return false;
        }
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
