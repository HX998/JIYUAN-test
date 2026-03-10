<!--承兑收票发生查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--承兑人开户行-->
                <show-branch v-model="formItem.brchNameList" :label="$t('m.i.pe.acptBank')" prop="brchNameList"
                             title="机构名称"
                             :showCheckBox="true" :brchNo.sync="formItem.brchNoList"
                             :brchName.sync="formItem.brchNameList">
                </show-branch>
                <!--票据种类-->
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <!--票据号码-->
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <!--出票日期-->
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <!--承兑日期-->
                <h-form-item :label="$t('m.i.billInfo.acptDt')" prop="minAcptDt">
                  <h-date-picker :value="acptDt" type="daterange" showFormat :editable=false
                                 @on-change="handleAcptDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <!--收票申请日期-->
                <h-form-item :label="$t('m.i.pe.receiveApplyDt')" prop="minReceiveApplyDt">
                  <h-date-picker :value="receiveApplyDt" type="daterange" showFormat :editable=false
                                 @on-change="handleReceiveApplyDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <!--收票签收日期-->
                <h-form-item :label="$t('m.i.pe.receiveSignDt')" prop="minReceiveSignDt">
                  <h-date-picker :value="receiveSignDt" type="daterange" showFormat :editable=false
                                 @on-change="handleReceiveSignDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <!--汇票到期日-->
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <!--出票人全称-->
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearVal('drwrName')"></h-input>
                </h-form-item>
                <!--出票人账号-->
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()"
                           readonly clearable></h-input>
                </h-form-item>
                <!--收款人全称-->
                <h-form-item :label="$t('m.i.billInfo.pyeeName')" prop="pyeeName">
                  <h-input v-model="formItem.pyeeName" :maxlength=60></h-input>
                </h-form-item>
                <!--高级、查询、重置-->
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}
                    <i class="icon iconfont"
                       :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i>
                  </span>
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
                url="/pe/busiqry/acptReceiveQuery/func_pageQueryBillList"
                :bindForm="formItem"
                :hasSelect="false" rowSelect
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.common.listExport")}}
                  </h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" ref="billInfoMain"></bill-info-main>
    <!--清单导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!--出票人全称-->
    <show-cust-message :showCustMessageWin="showCustInfoWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit" ref="showCustInfo"></show-cust-message>
    <!--出票人账号-->
    <show-cust-acct-no :showCustAcctNoWin="showCustAcctWin" :custNo="this.formItem.drwrNo"
                       :isAllBankAcct="false" :custAcctKind="''"
                       @showCustAcctNoWinClose="showCustAcctWinClose"
                       @custAcctNoSelectSubmit="custAcctSelectSubmit" ref="showCustAcct">
    </show-cust-acct-no>
  </div>
</template>

<script>
  import {post, on, off, formatNumber, exportList, formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "acptReceiveQuery",
    components: {},
    data() {
      return {
        formItem: {
          brchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNo: "",
          brchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          billType: "",
          billNo: "",
          minRemitDt: "",
          maxRemitDt: "",
          minAcptDt: "",
          maxAcptDt: "",
          minReceiveSignDt: "",
          maxReceiveSignDt: "",
          minReceiveApplyDt: "",
          maxReceiveApplyDt: "",
          minDueDt: "",
          maxDueDt: "",
          drwrNo: "",
          drwrName: "",
          drwrAcctNo: "",
          pyeeName: ""
        },
        columns: [
          {
            type: "selection",
            key: "duoxuan",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            key: "numOrder",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
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
            sortable: true,
            align:'center',
            hiddenCol: false,
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
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          // 票据种类
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
          // 票据金额（元）
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          // 出票日期
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          // 承兑日期
          {
            title: this.$t("m.i.billInfo.acptDt"),
            key: "acptDt",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              if (params.row.acptDt == null || params.row.acptDt === "") {
                return "";
              }
              let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          // 收票申请日期
          {
            title: this.$t("m.i.pe.receiveApplyDt"),
            key: "receiveApplyDt",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              if (params.row.receiveApplyDt == null || params.row.receiveApplyDt === "") {
                return "";
              }
              let date = this.$moment(params.row.receiveApplyDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          // 收票签收日期
          {
            title: this.$t("m.i.pe.receiveSignDt"),
            key: "receiveSignDt",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              if (params.row.receiveSignDt == null || params.row.receiveSignDt === "") {
                return "";
              }
              let date = this.$moment(params.row.receiveSignDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },

          // 汇票到期日
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          // 出票人全称
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: false,
            hiddenCol: false
          },
          // 出票人账号
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          // 出票人开户行行名
          {
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: false,
            hiddenCol: false
          },
          // 出票人开户行行号
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol: false
          },
          // 承兑人全称
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          // 承兑人账号
          {
            title: this.$t("m.i.billInfo.acptAcctNo"),
            key: "acptAcctNo",
            hiddenCol: false
          },
          // 承兑人开户行行号
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          // 承兑人开户行行名
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          },
          // 承兑人统一社会信用代码
          {
            title: this.$t("m.i.pe.acptSocCode"),
            key: "acptSocCode",
            hiddenCol: false
          },
          // 收款人全称
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: false,
            hiddenCol: false
          },
          // 收款人账号
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            sortable: false,
            hiddenCol: false
          },
          // 收款人开户行行名
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            sortable: false,
            hiddenCol: false
          },
          // 收款人开户行行号
          {
            title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            hiddenCol: false
          },
        ],
        remitDt: [],
        acptDt: [],
        receiveSignDt: [],
        receiveApplyDt: [],
        dueDt: [],
        billTypeList: [],
        // 出票人全称展示
        showCustInfoWin: false,
        // 出票人账号展示
        showCustAcctWin: false,
        //是否显示更多查询项
        ifShowMore: false,
        currentSelectRow: [],
        // 票据详情展示
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        dictMap: new Map(),
      };
    },
    computed: {},
    mounted() {
      this.getDictListByGroups("DraftTypeCode,EcdsBillStatusCode,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleRemitDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      handleAcptDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minAcptDt = arr[0].replace(/-/g, "");
          this.formItem.maxAcptDt = arr[1].replace(/-/g, "");
          this.acptDt = [arr[0], arr[1]];
        } else {
          this.formItem.minAcptDt = "";
          this.formItem.maxAcptDt = "";
          this.acptDt = [];
        }
      },
      handleReceiveSignDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minReceiveSignDt = arr[0].replace(/-/g, "");
          this.formItem.maxReceiveSignDt = arr[1].replace(/-/g, "");
          this.receiveSignDt = [arr[0], arr[1]];
        } else {
          this.formItem.minReceiveSignDt = "";
          this.formItem.maxReceiveSignDt = "";
          this.receiveSignDt = [];
        }
      },
      handleReceiveApplyDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minReceiveApplyDt = arr[0].replace(/-/g, "");
          this.formItem.maxReceiveApplyDt = arr[1].replace(/-/g, "");
          this.receiveApplyDt = [arr[0], arr[1]];
        } else {
          this.formItem.minReceiveApplyDt = "";
          this.formItem.maxReceiveApplyDt = "";
          this.receiveApplyDt = [];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      // 打开出票人名称弹框
      queryCustNo() {
        this.showCustInfoWin = true;
      },
      // 出票人名称赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrNo = info.custNo;
        this.formItem.drwrName = info.custName;
        this.formItem.drwrAcctNo = "";
        if (info.custAcctNo !== "") {
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustInfoWin = false;
      },
      // 关闭出票人名称弹框
      custCorpWinClose() {
        this.showCustInfoWin = false;
      },
      // 打开出票人账号弹框
      queryCustAcctNo() {
        if (this.formItem.drwrName === "") {
          this.$msgTip.info(this, {info: "请先选择出票人全称！"});
          return;
        }
        this.showCustAcctWin = true;
      },
      // 关闭出票人账号弹框
      showCustAcctWinClose() {
        this.showCustAcctWin = false;
      },
      // 出票人账号赋值
      custAcctSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctWin = false;
      },
      // 表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      // 重置表单查询结果
      resetSearch() {
        this.formItem.brchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.brchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.acptBankNo = "";
        this.formItem.acptBankName = "";
        this.formItem.billType = "";
        this.formItem.billNo = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.remitDt = "";
        this.formItem.minAcptDt = "";
        this.formItem.maxAcptDt = "";
        this.acptDt = "";
        this.formItem.minReceiveSignDt = "";
        this.formItem.maxReceiveSignDt = "";
        this.formItem.minReceiveApplyDt = "";
        this.formItem.maxReceiveApplyDt = "";
        this.receiveSignDt = "";
        this.receiveApplyDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.dueDt = "";
        this.formItem.drwrNo = "";
        this.formItem.drwrName = "";
        this.formItem.drwrAcctNo = "";
        this.formItem.pyeeName = "";
      },
      // 打开清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "acptReceiveBillExportInfo";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      // 关闭清单导出
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      // 清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/acptReceiveQuery/func_exportAcptReceiveBill";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          console.log(this.$refs.datagrid.selectIds);
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      // 关闭票据详情弹框
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.showBillInfoWin = false;
      },
      // 取消出票人全称
      clearVal(optType) {
        if (optType === "drwrName") {
          this.formItem.drwrAcctNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrCustNo = "";
        }
      },
      // 打开票据详情
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>
</style>
