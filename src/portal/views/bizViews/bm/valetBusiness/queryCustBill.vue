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
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="" @on-change="onChange">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.ecdsBillStatus')" prop="ecdsStatusList" v-if="this.formItem.billOrigin == 'CS01'">
                  <h-select v-model="formItem.ecdsStatusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in ecdsBillStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.cpesBillStatus')" prop="billStatusList" v-if="this.formItem.billOrigin == 'CS02' || this.formItem.billOrigin == 'CS03'">
                  <h-select v-model="formItem.billStatusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in billStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearCustNo()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName" required>
                  <h-input v-model="formItem.custName" :maxlength=60 readonly></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.bm.custAcctNo')" required>
                  <h-input v-model="formItem.custAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()" clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :validRules="billNoRule">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
                  <h-input v-model="formItem.pyeeName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
                  <h-input v-model="formItem.acptName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" :prop="isMinBillMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.minBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','min')" placeholder=""
                                   @on-focus="formatBillMoney('focus','min')"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2"><span>至</span></h-col>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.maxBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','max')" placeholder=""
                                   @on-focus="formatBillMoney('focus','max')" bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false placement="bottom-end"
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
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

          <h-datagrid
              :columns="columns"
              highlightRow
              url="/bm/valetBusiness/queryCustBill/func_queryHldrBillInfo"
              :bindForm="formItem"
              :rowSelect="true"
              :hasSelect="false"
              :auto-load="false"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="tempShowExcelTemplateWinOpen" >{{$t('m.i.common.listExport')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustElecSignWin" @custElecSignWinClose="custElecSignWinClose"
                         @custElecSignSubmit="custElecSignSubmit"></show-cust-elec-sign>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustAcctNoWin" :custInfoParams="custInfoParams"
                         :isShowCustAcctNo="true"
                         @custElecSignWinClose="showCustAcctNoWinClose"
                         @custElecSignSubmit="custAcctNoSelectSubmit"></show-cust-elec-sign>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { on, off, formatNumber,getDictValueFromMap,formatBillRange,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "queryCustBill",
    components: {
    },
    data() {
      let options = {};
      //区分最大和最小票据金额
      options.billMoneyType = "min";
      options.dueDt = [];
      options.remitDt = [];
      options.tempShowExcelTemplateWin = false;
      options.param= null;
      options.rows= null;
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
        ecdsStatusList: [],
        billStatusList: [],
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
        {
          title: this.$t('m.i.billInfo.billType'),
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
          title: this.$t('m.i.billInfo.ecdsBillStatus'),
          key: "billStatus",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = "无";
            if (params.row.billOrigin == "CS01") {
              dictValue = getDictValueFromMap(this.dictMap, "EcdsBillStatusCode", params.row.ecdsBillStatus);
            } else if (params.row.billOrigin == "CS02" || params.row.billOrigin == "CS03") {
              dictValue = getDictValueFromMap(this.dictMap, "BillStatusCode", params.row.billStatus);
            } else {
              dictValue = "无";
            }
            if (dictValue == null || dictValue == "NULL") {
              dictValue = "无";
            }
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
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
          title: this.$t('m.i.billInfo.drwrName'),
          key: "drwrName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.drwrBankNo'),
          key: "drwrBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.drwrBankName'),
          key: "drwrBankName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeName'),
          key: "pyeeName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankNo'),
          key: "pyeeBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankName'),
          key: "pyeeBankName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: "acptName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptBankNo'),
          key: "acptBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptBankName'),
          key: "acptBankName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        }
      ];
      options.billTypeList = [];
      options.transNoList = [];
      options.billOriginList = [];
      options.billStatusList = [];
      options.ecdsBillStatusList = [];
      options.dictMap = new Map();
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
      options.hldrIdListParam = [];
      return options;
    },
    computed: {
      isMinBillMoney() {
        return this.billMoneyType === "min" ? "minBillMoney" : "maxBillMoney";
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,ValetHldrTransNo,EcdsBillStatusCode,,BillOrigin,BillStatusCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.transNoList = res.get("ValetHldrTransNo");
        this.ecdsBillStatusList = res.get("EcdsBillStatusCode");
        this.billStatusList = res.get("BillStatusCode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      onChange(value) {
        if (value == "CS01") {
          this.formItem.billStatusList = [];
        } else {
          this.formItem.ecdsStatusList = [];
        }
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
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
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
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
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
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
      //清单导出
      tempShowExcelTemplateWinOpen() {
        if (this.formItem.custNo==='' ||this.formItem.custName===''||this.formItem.custAcctNo==='') {
          this.$msgTip.info(this, { info: "请先输入必输查询条件" });
          return;
        }
        this.param = "hldrBillInfoExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {

        let exportUrl = window.LOCAL_CONFIG.API_HOME + "bm/valetBusiness/queryCustBill/func_exportHldrBillInfo";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          debugger
          let hldrList= this.$refs.datagrid.selects;

          if (hldrList != null && hldrList.length > 0) {
            for (let i = 0; i < hldrList.length; i++) {
              this.hldrIdListParam.push(hldrList[i].hldrId)
            }
          }
          options.params = {
            hldrIdList: this.hldrIdListParam,
            custNo : this.formItem.custNo,
            custName : this.formItem.custName,
            custAcctNo : this.formItem.custAcctNo,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          // this.formItem.activeDt = this.formItem.activeDt.replace(/-/g, "");
          // this.formItem.failureDt = this.formItem.failureDt.replace(/-/g, "");
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }

        exportList(this, this.param, field, exportType, exportUrl, options);
        this.hldrIdListParam = [];
      }
    }
  };
</script>

<style scoped>

</style>
