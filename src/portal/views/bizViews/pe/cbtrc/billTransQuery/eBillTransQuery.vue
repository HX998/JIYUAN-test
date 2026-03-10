<!--票据中心查询-电票查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="mainVue" key="1">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>

                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo" :maxlength="30"></h-input>
                </h-form-item>

                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>

                <common-date-picker v-model="remitDt" :label="$t('m.i.billInfo.remitDt')" prop="remitDt" type="daterange" :rangeValue="['minRemitDt','maxRemitDt']"
                                    :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt">
                </common-date-picker>
                <h-form-item  :label="$t('m.i.billInfo.billType')"  prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" :prop="isMinBillMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.minBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','min')" placeholder=""
                                   @on-focus="formatBillMoney('focus','min')" bigTips></h-typefield>
                    </h-col>
                    <h-col span="2"><span>至</span></h-col>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.maxBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','max')" placeholder=""
                                   @on-focus="formatBillMoney('focus','max')" bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item  :label="$t('m.i.billInfo.dueDt')"  prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item prop="drwrNameLike"  :label="$t('m.i.billInfo.drwrName')" >
                  <h-input v-model="formItem.drwrNameLike" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="pyeeNameLike"  :label="$t('m.i.billInfo.pyeeName')" >
                  <h-input v-model="formItem.pyeeNameLike" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="acptNameLike"  :label="$t('m.i.billInfo.acptName')" >
                  <h-input v-model="formItem.acptNameLike" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item  :label="$t('m.i.billInfo.inOutFlag')"  prop="inOutFlag">
                  <h-select v-model="formItem.inOutFlag" placeholder="">
                    <h-option v-for="item in inOutFlagList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
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
                url="/pc/btrc/query/center/func_pagingQueryBillInfo"
                :bindForm="formItem"
                :onCurrentChange="handleCurrentChange"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <bill-manage-btn @handleForm="billManager"></bill-manage-btn>
<!--                  <h-button type="primary" @click="showBill">{{$t("m.i.pe.showBill")}}</h-button>-->
<!--                  <h-button type="primary" @click="tempShowExcelTemplateWinOpen()"
                            v-if="this.btnAuth.exportBtn === undefined ? true : this.btnAuth.exportBtn.isShow">{{$t("m.i.common.listExport")}}</h-button>-->
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
        <div v-if="billManagerVue" key="2">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
                <!--子票区间-->
                <bill-range :formItem="billManagerFormItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <h-datagrid :columns="billManagerColumns"
                      url="/pc/btrc/bill/func_pagingQueryCenterBillInfo"
                      :auto-load="true"
                      highlightRow
                      :bindForm="billManagerFormItem"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
            </div>
          </h-datagrid>
          <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                                 :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                                 :rows="this.rows"></common-excel-download>
        </div>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                        :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd" ref="billInfoMain"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, formatNumber ,exportList, formatBillRange,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "eBillTransQuery",
    components: {
    },
    data() {
      return {
        //区分最大和最小票据金额
        billMoneyType: "min",
        mainVue: true,
        billManagerVue: false,
        dueDt: [],
        remitDt: [],
        btnAuth:"",
        childrenBtnAuth:"",
        billManagerFormItem: {
          billId:"",
          billRangeStart:"",
          billRangeEnd:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          billMoney:"",
          billOrigin:""
        },
        billManagerColumns: [
          {
            type: "radio",
            title: " ",
            width: 50,
            align: "center",
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
            title: this.$t("m.i.billInfo.billRange"),   //子票区间
            key: "billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(this.billManagerFormItem.billOrigin, billRangeStart, billRangeEnd))
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
          }

        ],
        formItem: {
          legalNo: this.$store.getters.userInfo.legalNo,
          billClass: "ME02",
          billOrigin: "",
          billNo: "",
          reverseBillNo: "",
          drwrNameLike: "",
          pyeeNameLike: "",
          acptNameLike: "",
          billType: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          inOutFlag: "",
          minRemitDt: this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD"),
          maxRemitDt: this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD"),
          minBillRangeStart: "",
          maxBillRangeEnd: "",
        },
        billNoRule: [{ test: /^[1|2][0-9]{0,29}$/, trigger: "blur", message: "电票号码为30位数字,银票首位为1,商票首位为2" }],
        columns: [
          {
            type: "radio",
            title: " ",
            width: 50,
            align: "center",
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
            key: 'billOrigin',
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillManager(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
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
/*          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
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
          }, */
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
          }, {
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
          }, {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: true,
            hiddenCol: false
          }, {
           title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            hiddenCol: false
          }, {
           title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            sortable: true,
            hiddenCol: false
          }, {
           title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          }, {
           title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.inOutFlag"),
            key: "inOutFlag",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.inOutFlag === "" || params.row.inOutFlag == null) {
                return h("span", {}, "-");
              }
              let dictValue = this.getDictValueFromMap(this.dictMap, "InOutFlagCode", params.row.inOutFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        billTypeList: [],
        inOutFlagList :[],
        billOriginList:[],
        dictMap: new Map(),
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        showBillInfoWin: false,
        billRangeStart: "",
        billRangeEnd: "",
        billId: "",
        billNo: "",
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        custInfoParams: {}
      };
    },
    computed: {
      isMinBillMoney() {
        return this.billMoneyType === "min" ? "minBillMoney" : "maxBillMoney";
      }
    },
    created() {
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.remitDt = [workDate, workDate];
      this.formItem.minRemitDt = window.sessionStorage.getItem("workDate");
      this.formItem.maxRemitDt = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,EcdsBillStatusCode,InOutFlagCode,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.inOutFlagList = res.get("InOutFlagCode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });

      //按钮权限查询 控制按钮显隐
      console.log(JSON.parse(window.sessionStorage.getItem("curMenu")));
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;

      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if(this.btnAuth.manager!=null&&this.btnAuth.manager!=undefined){
              if(this.btnAuth.manager.children!=null&&this.btnAuth.manager.children!=undefined) {
                this.childrenBtnAuth = this.btnAuth.manager.children;
              }
            }
            // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }

      });
    },
    methods: {
      billManager() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let billInfo = this.currentSelectRow;
        this.showBillManager(billInfo);
      },
      showBillManager(billInfo) {
        if (billInfo.billOrigin == 'CS02' || billInfo.billOrigin == 'CS03') {
          // 仅等分化可拆包票据需要明细
          if (billInfo.isAllowSplitBill == '1') {
            this.billManagerFormItem.billId = billInfo.billId;
            this.billManagerFormItem.billNo = billInfo.billNo;
            this.billManagerFormItem.billOrigin = billInfo.billOrigin;
            this.mainVue = false;
            this.billManagerVue = true;
          } else {
            let bill = {billId: billInfo.billId, billNo: billInfo.billNo, billRangeStart: 0, billRangeEnd: 0}
            this.showBillInfo(bill);
          }
        } else {
          this.showBillInfo(billInfo);
        }
      },
      billManagerHandleSearch() {
        this.$refs["billManagerFormItem"].validate(valid => {
          if (valid) {
            this.currentSelectRow = [];
            this.$refs.billManagerDatagrid.dataChange(1);
          }
        });
      },
      billManagerResetSearch() {
        this.$refs.billManagerFormItem.resetFields();
      },
      returnMain() {
        this.resetSearch();
        this.billManagerFormItem.billId = null;
        this.billManagerFormItem.billNo = null;
        this.billManagerFormItem.billOrigin = null;
        this.billManagerFormItem.minBillRangeStart = null;
        this.billManagerFormItem.maxBillRangeEnd = null;
        this.currentSelectRow = [];
        this.billManagerVue = false;
        this.mainVue = true;
      },
      showBill() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let billId = this.currentSelectRow.id;
        let billNo = this.currentSelectRow.billNo;
        this.showBillInfo(billId, billNo);
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
            this.currentSelectRow = [];
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
        let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.remitDt = [workDate, workDate];
        this.formItem.minRemitDt = window.sessionStorage.getItem("workDate");
        this.formItem.maxRemitDt = window.sessionStorage.getItem("workDate");
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.reverseBillNo = "";
        this.formItem.billType = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.drwrNameLike = "";
        this.formItem.pyeeNameLike = "";
        this.formItem.acptNameLike = "";
        this.formItem.inOutFlag = "";
        this.formItem.billOrigin = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billInfo) {
        this.billId = billInfo.billId;
        this.billNo = billInfo.billNo;
        this.billRangeStart = billInfo.billRangeStart;
        this.billRangeEnd = billInfo.billRangeEnd;
        this.showBillInfoWin = true;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "eBillTransReportInfo";
        if (this.currentSelectRow.length != 0) {
          this.rows = 1;
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
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/cbtrc/billTransQuery/eBillTransQuery/func_exportEBillTransExcel";
        let options = {};
        if (this.currentSelectRow.length !== 0) {
          let billIds = [];
          billIds.push(this.currentSelectRow.id);
          options.params = {
            billIds: billIds
          };
          options.pageSize = 1;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
    }
  };
</script>

<style scoped>

</style>
