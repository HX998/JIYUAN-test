<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
                  <h-select v-model="formItem.billType" showTitle>
                    <h-option v-for="item in BillTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" showTitle>
                    <h-option v-for="item in BillClassList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="riskStatus" :label="$t('m.i.billInfo.riskStatus')">
                  <h-select v-model="formItem.riskStatus" showTitle>
                    <h-option v-for="item in RiskStatusList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNo"></h-input>
                </h-form-item>
                <h-form-item prop="minBillMoney" :label="$t('m.i.billInfo.minBillMoney')">
                  <h-typefield integerNum="10" v-model="formItem.minBillMoney" type="money"
                               isround></h-typefield>
                </h-form-item>
                <h-form-item prop="maxBillMoney" :label="$t('m.i.billInfo.maxBillMoney')">
                  <h-typefield integerNum="10" v-model="formItem.maxBillMoney" type="money"
                               isround></h-typefield>
                </h-form-item>
                <h-form-item prop="acceptorBankName" :label="$t('m.i.billInfo.acceptorBankName')">
                  <h-input v-model="formItem.acceptorBankName" readonly icon="android-search"
                           @on-click="queryHvpsBank()" clearable
                           @on-clear="clearVal()"></h-input>
                </h-form-item>
                <h-form-item prop="acceptorBankNo" v-show="false">
                  <h-input v-model="formItem.acceptorBankNo"></h-input>
                </h-form-item>
                <h-form-item prop="acptDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker :value="acptDt" format="yyyy-MM-dd" type="daterange"
                                 showFormat :editable=false @on-change="handleAcptDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="dueDt" format="yyyy-MM-dd" type="daterange"
                                 showFormat :editable=false @on-change="handleDueDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/be/trust/prsttn/prsttnSignBillAcct/func_acctountPrsttnBillQuery"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="prsttnSignAcct()" v-if="authObj.prsttnSignAcctBtn">{{$t('m.i.be.acct')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <show-hvps-bank :showHvpsBank="showHvpsBank" @showHvpsBankClose="showHvpsBankClose"
                    @showHvpsBankSubmit="showHvpsBankSubmit"></show-hvps-bank>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "prsttnSignBillAcct",
    components: {
      ShowHvpsBank: () => import(/* webpackChunkName: "shcpe/cpes/hvpsbank/showHvpsBank" */`@/views/bizViews/shcpe/cpes/hvpsbank/showHvpsBank`)
    },
    data() {
      return {
        formItem: {
          settleBusiType: "",
          billNo: "",
          acceptorBankNo: "",
          acceptorBankName: "",
          maxBillMoney: "",
          minBillMoney: "",
          acptDt: "",
          dueDt: "",
          minIssuDate: "",
          maxIssuDate: "",
          minDueDate: "",
          maxDueDate: ""
        },
        acptDt: [],
        dueDt:[],
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false
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
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.riskStatus'),
            key: "riskStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RiskStatus", params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        authObj: {
          prsttnSignAcctBtn: true
        },
        ifShowMore: false,
        showHvpsBank: false,
        BillTypeList: [],
        BillClassList: [],
        RiskStatusList: [],
        currentSelectRow: [],
        dictMap: null
      };
    },
    mounted() {
      this.getDictListByGroups("CDMedia,DraftTypeCode,RiskStatus").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.RiskStatusList = res.get("RiskStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.currentSelectRow = [];

        this.$refs.datagrid.dataChange(1);
      },
      handleAcptDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minIssuDate = arr[0].replace(/-/g, "");
          this.formItem.maxIssuDate = arr[1].replace(/-/g, "");
          this.acptDt = [arr[0],arr[1]];
        } else {
          this.formItem.minIssuDate = "";
          this.formItem.maxIssuDate = "";
          this.acptDt = [];
        }
      },
      handleDueDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDate = arr[0].replace(/-/g, "");
          this.formItem.maxDueDate = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDate = "";
          this.formItem.maxDueDate = "";
          this.dueDt = [];
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //重置查询结果
      resetSearch() {
        this.acptDt = [];
        this.dueDt = [];
        this.formItem.acceptorBankName = "";
        this.$refs.formItem.resetFields();
      },
      prsttnSignAcct() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let lineId = Array();
        for (let i = 0; i < this.currentSelectRow.length; i++) {
          lineId.push(this.currentSelectRow[i].id);
        }
        post({ ids: lineId.join(",") }, "/be/trust/prsttn/prsttnSignBillAcct/func_accountPayment").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.currentSelectRow = [];
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryHvpsBank() {
        this.showHvpsBank = true;
      },
      showHvpsBankClose() {
        this.showHvpsBank = false;
      },
      showHvpsBankSubmit(info) {
        if (info === null) {
          this.$hMessage.error("请先选择记录！");
          return;
        }
        this.formItem.acceptorBankNo = info.actorBrchBankNo;
        this.formItem.acceptorBankName = info.actorBrchName;
        this.showHvpsBank = false;
      },
      clearVal() {
        this.formItem.acceptorBankNo = "";
        this.formItem.acceptorBankName = "";
      }
    }
  };
</script>

<style scoped>

</style>
