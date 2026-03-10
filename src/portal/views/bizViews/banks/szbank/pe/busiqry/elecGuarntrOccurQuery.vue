<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWin = true" v-if="this.licenseFlag"></own-brch-nos>-->
                <show-branch v-model="formItem.transBrchNos" :label="'查询机构'" prop="transBrchNos"
                             isNeedChecked multiple
                             :showCheckBox="true"
                             :brchNo.sync="formItem.transBrchNos"
                             :brchName.sync="formItem.transBrchNames"></show-branch>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.billNo"
                         prop="billNo"></bill-no>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.ce.contractNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="acptName" :label="$t('m.i.ce.warteeName')">
                  <h-input v-model="formItem.acptName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="acptAcctNo" :label="$t('m.i.ce.warteeAcctNo')">
                  <h-input v-model="formItem.acptAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>

                <h-form-item prop="transBrchNameLike" :label="$t('m.i.ce.guarantorName')">
                  <h-input v-model="formItem.transBrchNameLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.guarntrApplyDt')" prop="guarntrApplyDt">
                  <h-date-picker type="daterange" autoPlacement placeholder="" v-model="formItem.guarntrApplyDt"
                                 format="yyyy-MM-dd" showFormat @on-change="handleGuarntrApplyDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{ $t('m.i.common.search') }}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{ $t('m.i.common.reset') }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.bs.totalAmt')">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="banks/szbank/pe/busiqry/elecGuarntrOccurQuery/func_pageQueryElecGuarntrAcptOccurData"
                      @getSumMoneyAndTotal="getSumMoneyAndTotal"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportData()">{{ $t('m.i.common.exportData') }}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.acptCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose"
                           @custAcctNoSelectSubmit="custAcctNoSelectSubmit" title="查询被保证人账号信息"></show-cust-acct-no>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                        :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
        <!--excel导出-->
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                               :rows="this.rows"></common-excel-download>

      </h-col>
    </h-row>
  </div>
</template>

<script>
import {
  accMul,
  formatBillRange,
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  post
} from "@/api/bizApi/commonUtil";

export default {
  name: "elecGuarntrOccurQuery",
  components: {},
  data() {
    return {
      // brchNoWin:false,
      licenseFlag: false,
      authPath: this.$route.path,
      tempShowExcelTemplateWin: false,
      param: "",
      rows: "",
      sumMoney: "",
      total: "",
      formItem: {
        transBrchNos: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
        transBrchNames: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        acptCustNo: '',
        acptName: '',
        acptAcctNo: '',
        billNo: '',
        acptProtocalNoLike: '',
        transBrchNameLike: '',
        billClass: 'ME02',
        acptAcctFlag: '',
        guarntrApplyDt: [],
        minGuarntrDt: '',
        maxGuarntrDt: '',
      },
      acctStatusList: [],
      payAcctStatusList: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          key: "duoxuan",

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
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: 'billNo',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = "";
            if (params.row.billNo === null || params.row.billNo === "") {
              billNo = "查看票面";
            } else {
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
          title: this.$t("m.i.billInfo.billOrigin"),
          key: 'billOrigin',
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
          title: this.$t("m.i.billInfo.billRange"),   //子票区间
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },


        {
          title: this.$t('m.i.ce.guarantorName'),
          key: "transBrchName",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.ce.warteeName'),
          key: 'guarntrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.ce.warteeAcctNo'),
          key: 'guarntrAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.ce.guarntrApplyDt'),
          key: 'guarntrDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.guarntrDt == null || params.row.guarntrDt === "") {
              return "";
            }
            let date = this.$moment(params.row.guarntrDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: 'billType',
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: 'remitDt',
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
          key: 'dueDt',
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
          title: this.$t('m.i.billInfo.acptName'),
          key: 'acptName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.acptAcctNo'),
          key: 'acptAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.acptBankNo'),
          key: 'acptBankNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.pyeeBankName"),
          key: 'pyeeBankName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.guarntrAmt"),
          key: 'guarntrAmt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
            return h("span", {
              domProps: {
                title: guarntrAmt
              }
            }, guarntrAmt);
          }
        },
        {
          title: this.$t('m.i.ce.feeMoney'),
          key: 'fee',
          hiddenCol: false,
          render: (h, params) => {
            let fee = formatNumber(params.row.fee, 2, ',');
            return h("span", {
              domProps: {
                title: fee
              }
            }, fee);
          }
        },
        {
          title: this.$t("m.i.ce.contractNo"),
          key: 'acptProtocalNo',
          hiddenCol: false,
        },
      ],
      YonList: [],
      billOriginList: [],
      dictMap: new Map(),
      currentSelectRow: [],
      showCustAcctNoWin: false,
      showCustMessageWin: false,
      showBranchWin: false,
      ifShowMore: false,
      billId: "",
      billRangeStart: "",
      billRangeEnd: "",
      showBillInfoWin: false,
    }
  },
  mounted() {
    getDictListByGroups("CorpAcptStatus,Yon,AcctFlag,DeductStatusType,BillOrigin,DraftTypeCode").then(res => {
      this.YonList = res.get("Yon");
      this.billOriginList = res.get("BillOrigin");
      this.dictMap = res.get("map");
    });
  },
  methods: {
    handleGuarntrApplyDtChange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minGuarntrDt = arr[0].replace(/-/g, "");
        this.formItem.maxGuarntrDt = arr[1].replace(/-/g, "");
        this.dueDt = [arr[0], arr[1]];
      } else {
        this.formItem.minGuarntrDt = "";
        this.formItem.maxGuarntrDt = "";
        this.dueDt = [];
      }
    },

    getSumMoneyAndTotal(params) {
      this.total = params.total;
      this.sumMoney = formatNumber(params.sumMoney, 2, ",");
    },

    clearVal(type) {
      if (type === 'custName') {
        this.formItem.acptCustNo = '';
        this.formItem.acptName = "";
        this.formItem.acptAcctNo = '';
      } else {
        this.formItem.acptAcctNo = '';
      }
    },
    //表单查询
    handleSearch() {
      this.$refs.datagrid.selects = [];
      this.$nextTick(() => {
        this.$refs.datagrid.dataChange(1);
      })
    },
    //重置表单查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
      this.formItem.acptCustNo = '';
      this.formItem.transBrchNos = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
      this.formItem.transBrchNames = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      this.formItem.maxGuarntrDt = "";
      this.formItem.minGuarntrDt = "";
    },
    //清单导出
    exportData() {
      this.param = 'elecAcptGuarntrOccurQueryExport';
      if (this.$refs.datagrid.selectIds.length !== 0) {
        this.rows = this.$refs.datagrid.selectIds.length;
      } else {
        this.rows = this.$refs.datagrid.total;
      }
      this.tempShowExcelTemplateWin = true;
    },
    exportList(field, exportType) {
      //exportType: 0-同步 1-异步
      let url = window.LOCAL_CONFIG.API_HOME + "/banks/szbank/pe/busiqry/elecGuarntrOccurQuery/func_exportDataForEAcptGuarntrOccurQuery";
      if (exportType === "1") {
        let params = null;
        if (this.$refs.datagrid.selectIds.length != 0) {
          params = {
            ids: this.$refs.datagrid.selectIds,
            field: field,
            exportType: exportType,
            excelName: this.param,
            authPath: this.$route.path,
            ownedBrchNos: this.formItem.ownedBrchNos
          };
        } else {
          params = Object.assign({field: field, exportType: exportType, excelName: this.param}, this.formItem);
        }
        post(params, url).then(res => {
          if (res.status === 200 && res.data === null) {
            this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          } else if (res.status === 200 && res.data === "") {
            this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          } else {
            this.$msgTip.error(this, {info: "异步导出失败"});
          }
        });
      } else {
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post")
        if (this.$refs.datagrid.selectIds.length !== 0) {
          let input1 = document.createElement('input')
          input1.type = 'text'
          input1.name = 'ids';
          input1.value = this.$refs.datagrid.selectIds;
          form.appendChild(input1)
          let input2 = document.createElement('input')
          input2.type = 'text'
          input2.name = 'authPath';
          input2.value = this.$route.path;
          form.appendChild(input2)
          let input3 = document.createElement('input')
          input3.type = 'text'
          input3.name = 'ownedBrchNos';
          input3.value = this.formItem.ownedBrchNos;
          form.appendChild(input3)
        } else {
          for (let obj in this.formItem) {
            if (this.formItem.hasOwnProperty(obj)) {
              let input = document.createElement("input");
              input.type = "text";
              input.name = obj;
              input.value = this.formItem[obj];
              form.appendChild(input);
            }
          }
        }
        let input3 = document.createElement('input')
        input3.type = 'text'
        input3.name = 'field';
        input3.value = field;
        form.appendChild(input3)
        let input4 = document.createElement('input')
        input4.type = 'text'
        input4.name = 'exportType';
        input4.value = exportType;
        form.appendChild(input4)
        let input5 = document.createElement('input')
        input5.type = 'text'
        input5.name = 'excelName';
        input5.value = this.param;
        form.appendChild(input5)
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    },

    //查询客户信息
    //触发弹窗
    queryCustName() {
      this.showCustMessageWin = true;
    },
    //赋值
    custCorpSelectSubmit(info) {
      console.log(info);
      this.formItem.acptAcctNo = "";
      this.formItem.acptName = info.custName;
      this.formItem.acptCustNo = info.custNo;
      if (info.custAcctNo !== "") {
        this.formItem.acptAcctNo = info.custAcctNo;
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
      if (this.formItem.acptCustNo === "") {
        this.$msgTip.info(this, {info: "请选择客户"});
        return;
      }
      this.showCustAcctNoWin = true;
    },
    //赋值
    custAcctNoSelectSubmit(info) {
      this.formItem.acptAcctNo = info.custAcctNo;
      this.showCustAcctNoWin = false;
    },
    //关闭弹窗
    showCustAcctNoWinClose() {
      this.showCustAcctNoWin = false;
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    clearVal1() {
      this.formItem.brchNos = "";
      this.formItem.branchName = "";
    },
    //查询机构弹出框
    queryBrchNo() {
      this.showBranchWin = true;
    },
    showBranchWinClose() {
      this.showBranchWin = false;
    },
    //根据弹框所选数据进行赋值
    brchNoChange(info) {

      let objs = [];
      if (info instanceof Array) {
        objs = info;
      } else {
        objs[0] = info;
      }
      let brchNos = "";
      let brchNames = "";
      for (var i = 0; i < objs.length; i++) {
        brchNos += objs[i].id + ',';
        brchNames += objs[i].title + ',';
      }
      this.formItem.transBrchNos = brchNos.substring(0, brchNos.length - 1);
      this.formItem.transBrchNames = brchNames.substring(0, brchNames.length - 1);
      this.showBranchWin = false;
    },
    showBillInfo(row) {
      this.billId = row.billId;
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
  },
  created() {
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    this.formItem.brchNos = userInfo.brchNo;
    this.formItem.branchName = userInfo.brchName;
  },

};
</script>

<style scoped>

</style>
