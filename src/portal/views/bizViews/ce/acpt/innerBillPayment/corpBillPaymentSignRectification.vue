<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNames" :brchNo.sync="formItem.brchNos"
                             :brchName.sync="formItem.brchNames" :showCheckBox="true" ></show-branch>
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <bill-class v-model="formItem.billClass" :dictList="billClassList"></bill-class>
                <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
                <!--记账日期-->
                <common-date-picker v-model="formItem.accountDate" :label="$t('m.i.common.acctDt')"
                                    type="daterange" :rangeValue="['minAccountDate','maxAccountDate']"
                                    :minAccountDate.sync="formItem.minAccountDate" :maxAccountDate.sync="formItem.maxAccountDate">
                </common-date-picker>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/ce/acpt/innerBillPayment/corpBillPaymentSignRectification/func_queryPaymentSignNeedRectification"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="rectification()">{{$t("m.i.common.rectification")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import {formatBillRange, formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "corpBillPaymentSignRectification",
    data(){
      return {
        formItem: {
          brchNames: "",
          brchNos: "",
          billNoLike: "",
          billClass: "",
          billOrigin:"",
          reverseBillNo:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          accountDate:[],
          minAccountDate:"",
          maxAccountDate:"",
          inOutFlagList: ["2","3"],
        },
        dictMap: new Map(),
        columns: [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 50,
            align: "center",
            hiddenCol: false
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
            title:  this.$t("m.i.common.brchName"),
            key: 'createBrchName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: 'billOrigin',
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
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
            title:  this.$t("m.i.billInfo.billPackageMoney"),
            key: 'billMoney',
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
            title:  this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:  this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: 'billClass',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"CDMedia",params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title:  this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
            render:(h,params) => {
              if(params.row.billStatus == null || params.row.billStatus === ""){
                let flowStatusName = params.row.flowStatusName;
                return h("span", flowStatusName);
              }else if(params.row.flowStatusName != null && params.row.flowStatusName != "" && params.row.flowStatusName != 'null') {
                let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.billStatus);
                let name = prsttnRespStatusName.replace(/应答方：/,"") + "(" + params.row.flowStatusName + ")";
                return h("span", name);
              } else {
                let prsttnRespStatusName = getDictValueFromMap(this.dictMap,"BarterTrustStatus",params.row.billStatus);
                let name = prsttnRespStatusName.replace("应答方：","");
                return h("span", name);
              }
            }
          },
          {
            title:  this.$t("m.i.common.applDt"),
            key: 'prsttnDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.prsttnDt == null || params.row.prsttnDt === ""){
                return "";
              }
              let date = this.$moment(params.row.prsttnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:  this.$t("m.i.billInfo.riskStatus"),
            key: 'riskStatus',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title:  this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            hiddenCol: false,
          },
          {
            title:  this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title:  this.$t("m.i.billInfo.prsttnName"),
            key: 'prsttnName',
            hiddenCol: false,
          },
        ],
        billClassList: [],
        billOriginList : [],
        billId: "",
        showBillInfoWin: false,
        currentSelectRow: null,
      }
    },
    methods: {
      // 默认时间
      timeDefault() {
        let date = new Date();
        // 通过时间戳计算
        let defalutStartTime = date.getTime() - 7 * 24 * 3600 * 1000; // 转化为时间戳
        let defalutEndTime = date.getTime();
        let startDateNs = new Date(defalutStartTime);
        let endDateNs = new Date(defalutEndTime);
        // 月，日 不够10补0
        defalutStartTime =
          startDateNs.getFullYear() +
          "-" +
          (startDateNs.getMonth() + 1 >= 10
            ? startDateNs.getMonth() + 1
            : "0" + (startDateNs.getMonth() + 1)) +
          "-" +
          (startDateNs.getDate() >= 10
            ? startDateNs.getDate()
            : "0" + startDateNs.getDate());
        defalutEndTime =
          endDateNs.getFullYear() +
          "-" +
          (endDateNs.getMonth() + 1 >= 10
            ? endDateNs.getMonth() + 1
            : "0" + (endDateNs.getMonth() + 1)) +
          "-" +
          (endDateNs.getDate() >= 10
            ? endDateNs.getDate()
            : "0" + endDateNs.getDate());
        return [defalutStartTime, defalutEndTime];
      },

      //获取当前日期

      date() {

        var time = new Date();

        var day = ("0" + time.getDate()).slice(-2);

        var month = ("0" + (time.getMonth() + 1)).slice(-2);

        var today = time.getFullYear() + "-" + month + "-" + day;

        return today;

      },
      getNowTime() {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日期
        month = month + 1;
        month = month.toString().padStart(2, "0");
        date = date.toString().padStart(2, "0");
        var defaultDate = `${year}-${month}-${date}`;
        this.$set(this.formItem, "accountDate", defaultDate);
      },

      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.brchNames = userInfo.brchName;
        let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.formItem.accountDate = [workDate, workDate];
        this.formItem.minAccountDate = window.sessionStorage.getItem("workDate");
        this.formItem.maxAccountDate = window.sessionStorage.getItem("workDate");
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      rectification(){
        if (this.currentSelectRow) {
          this.$hMsgBox.confirm({
            title: "确认信息",
            content: "冲正后会将资金退回至企业账户，确认是否执行？",
            onOk: () => {
              this.handleOperate();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleOperate() {
        post({ id: this.currentSelectRow.id }, "/ce/acpt/innerBillPayment/corpBillPaymentSignRectification/func_paymentSignRectification").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retData = res.data.retData;
            if (retCode === "000000") {
              if(retData && retData.respMsg){
                this.$msgTip.info(this,{info: retData.respMsg});
              }else{
                this.$msgTip.success(this);
              }
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
    },
    mounted() {
      getDictListByGroups("CDMedia,RiskStatus,AcctFlag,BarterTrustStatus,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    created(){
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.brchNames = userInfo.brchName;
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.accountDate = [workDate, workDate];
      this.formItem.minAccountDate = window.sessionStorage.getItem("workDate");
      this.formItem.maxAccountDate = window.sessionStorage.getItem("workDate");

    }
  }
</script>

<style scoped>

</style>
