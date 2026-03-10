<style>

</style>
<!--权属登记 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!-- 票据来源 -->
                <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               v-model="formItem.billOrigin" :dictList="BillOriginList"></common-select>
                <!-- 票据号码 -->
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.billNo" prop="billNo"></bill-no>
                <!-- 子票区间 -->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <!-- 票据类型 -->
                <bill-type v-model="formItem.billType" :dictList="DraftTypeList"></bill-type>
                <!-- 票据类型 -->
                <bill-class v-model="formItem.billClass" :dictList="CDMediaList"></bill-class>
                <!-- 记账状态 -->
                <common-select :label="$t('m.i.common.acctStatus')" prop="acctStatus"
                               v-model="formItem.acctStatus" :dictList="AcctFlagList"></common-select>
                <!-- 登记日期 -->
                <common-date-picker v-model="rgstDate" type="daterange"  :label="$t('m.i.be.rgstDt')" prop="rgstDate" @on-change="handleRgstDateChange"></common-date-picker>
                <!-- 承兑行名称 -->
                <show-cpes-branch :label="$t('m.i.billInfo.acptBankName')" class="h-form-long-label"
                                  :bankNo.sync="formItem.acptBankNo"  :cpesBrchName.sync="formItem.acptBankName"
                                  :isQueryByBankNo="true"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="acptBankName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                <!-- 票据金额 -->
                <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :bigTips="false"
                                  :rangeProps="['minBillMoney','maxBillMoney']" class="h-form-long-label"></bill-money-range>
                <!-- 汇票到期日 -->
                <due-dt-range v-model="dueDtTmp" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>

                <query-btn :advanceShow='true' @showChange="showChange" :formSearch='formSearch' :formSearchReset='formSearchReset'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            row-select
            :has-select="false"
            url="/be/trust/ownership/registOwershipBillAcct/func_queryPendingAcctOwershipBill"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="showAcctInfo()">{{$t('m.i.be.acct')}}</h-button>
              <h-button type="primary" @click="changeRate()"  v-show="this.rateMode==='0'">{{$t("m.i.be.calcInterest")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--手工添加利率-->
    <h-msg-box v-model="addRate" width="400" @on-close="addRateClose" class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span>手工设置利率</span>
      </p>
      <h-form :model="addRateFormItem" :label-width="90" ref="addRateFormItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.be.rate')" prop="rate" :validRules="rateRule" required>
          <h-typefield v-model="addRateFormItem.rate" placeholder="利率范围0~100" :max="100" :integerNum="3" :suffixNum="4" :maxlength="8"></h-typefield>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <close-btn @close="addRateClose"></close-btn>
        <commit-btn @commit="addRateSubmit" ></commit-btn>
      </div>
    </h-msg-box>

    <acct-record :param="param" :submitFlag="this.acctSubmitFlag" title="分录信息" :showAcctRecordWin="showAcctRecordWin"
                 @showAcctRecordWinClose="showAcctRecordWinClose" :url="url"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 @acctSubmitSure="acctSubmitSure"></acct-record>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>

</template>
<script>
  import { post, on, off, formatNumber, accMul, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "registOwershipBillAcct",
    data() {
      return {
        dictMap: new Map(),
        billId : "",
        billNo : "",
        billRangeStart: "",
        billRangeEnd: "",
        showBillInfoWin : false,
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
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            sortable: true,
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
            sortable: true,
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
            title: this.$t("m.i.billInfo.billOrigin"),
            key:'billOrigin',
            hiddenCol: false,
            render:(h,params) => {
              if (!params.row.billOrigin || "CS00" === params.row.billOrigin){
                return h("span", "-");
              }
              let dictValue = this.getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.rgstDt'),
            key: "rgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.rgstDt ? this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.ownershipBankName'),
            key: "ownershipBankName",
            hiddenCol: false,
            sortable: true

          },
          {
            title: this.$t('m.i.be.rate'),
            key: "ratePct",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.interest'),
            key: "interest",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.interest, 2, ','))
              ]);
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        rgstDate:[],
        dueDtTmp:[],
        formItem: {
          billOrigin: "",
          billNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          billType: "",
          billClass: "",
          billStatus: "",
          rgstDate: "",
          minRgstDt: "",
          maxRgstDt: "",
          acptBankNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          acptBankName: "",
          dueDtTmp: "",
          minDueDt: "",
          maxDueDt: ""
        },
        //手工设置利率
        addRateFormItem : {
          rate:"",
        },
        type: null,
        DraftTypeList: [],
        CDMediaList: [],
        BillOriginList: [],
        AcctFlagList: [
          {key: '0', value: '未记账'},
          {key: '2', value: '记账失败'},
          {key: '3', value: '记账处理中'},
        ],
        currentSelectList: [],
        submitFlag: false,
        ifShowMore: false,
        param: {},
        acctSubmitFlag: false,
        showPrintButton:false,
        schemeIdList: [],
        reqUrl: "/be/trust/ownership/registOwershipBillAcct/func_queryPendingAcctOwershipBill",
        showAcctRecordWin: false,
        id: null,
        ids: null,
        url: "/be/trust/ownership/registOwershipBillAcct/func_getOwershipAcctRecord",
        queryUrl: "/be/trust/ownership/registOwershipBillAcct/getRateMode",
        rateMode:"",
        addRate:false,
        rateRule: [{
          test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
      };
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      getRateMode() {
        let obj = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize
        });
        let url = this.queryUrl;
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.rateMode = res.data.retMsg;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      minBillMoneyVaild() {
        this.formItem.minBillMoney = this.formItem.minBillMoney.trim();
        if (this.formItem.minBillMoney.length != 0 && Number(this.formItem.minBillMoney)) {
          let min = Number(this.formItem.minBillMoney);
          if (this.formItem.maxBillMoney.length != 0 && Number(this.formItem.maxBillMoney)) {
            let max = Number(this.formItem.maxBillMoney);
            if (min > max) {
              this.$msgTip.info(this, { info: "最大值不能小于最小值" });
              this.formItem.minBillMoney = "";
            }
          }
        } else {
          this.formItem.minBillMoney = "";
        }
      },
      maxBillMoneyVaild() {
        if (this.formItem.maxBillMoney.length != 0 && Number(this.formItem.maxBillMoney)) {
          let max = Number(this.formItem.maxBillMoney);
          if (this.formItem.minBillMoney.length != 0 && Number(this.formItem.minBillMoney)) {
            let min = Number(this.formItem.minBillMoney);
            if (min > max) {
              this.$msgTip.info(this, { info: "最大值不能小于最小值" });
              this.formItem.maxBillMoney = "";
            }
          }
        } else {
          this.formItem.maxBillMoney = "";
        }
      },
      //记账弹窗
      showAcctInfo() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList.length > 0) {
          this.$hMsgBox.confirm({
            title:this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmcAcct'),
            onOk:()=>{
              let list = this.currentSelectList;
              let ids = "";
              for (var i = 0, count = list.length; i < count; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              this.param = { ids: ids,rateMode:this.rateMode };
              this.showAcctRecordWin = true;
            }

          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      //确定记账，发送记账请求
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ ids: this.param.ids }, "/be/trust/ownership/registOwershipBillAcct/func_owershipBillAcct").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //打印成功后关闭
      printSuccessCallback(){
        this.showAcctRecordWinClose();
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
        this.currentSelectList = [];
      },
      handleChange(value) {
        this.formItem.acctDt = value.replace(/-/g, "");
      },
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.getRateMode();
      },
      handleRgstDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minRgstDt = arr[0].replace(/-/g, "");
          this.formItem.maxRgstDt = arr[1].replace(/-/g, "");
          this.rgstDate = [arr[0],arr[1]];
        } else {
          this.formItem.minRgstDt = "";
          this.formItem.maxRgstDt = "";
          this.rgstDate = [];
        }
      },
      handleDueDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDtTmp = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDtTmp = [];
        }
      },
      formSearchReset() {
        this.rgstDate = [];
        this.dueDtTmp = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.acptBankNo = "";
        this.formItem.acptBankName = "";
        this.$refs.formItem.resetFields();
      },
      created() {
        this.formItem.acctDt = this.$moment(new Date()).format("YYYYMMDD");
      },
      //手工添加利率
      changeRate() {
        if(this.$refs.datagrid.selects.length===0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        this.addRate = true;
      },
      addRateClose() {
        this.addRate = false;
        this.$refs.addRateFormItem.resetFields();
      },
      addRateSubmit() {
        this.$refs["addRateFormItem"].validate(valid => {
          if (valid) {
            let ids = this.$refs.datagrid.selectIds.join(",");
            post({
              ids: ids,
              rate: this.addRateFormItem.rate
            }, "/be/trust/ownership/registOwershipBillAcct/interestCalc").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addRateClose();
                  this.formSearch();
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      }
    },
    mounted() {
      this.getRateMode();
      this.getDictListByGroups("Yon,CDMedia,DraftTypeCode,BillOrigin,AcctFlag").then(res => {
        this.CDMediaList = res.get("CDMedia");
        this.DraftTypeList = res.get("DraftTypeCode");
        this.BillOriginList = res.get("BillOrigin");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
