<template>
  <!--纸票托收收回撤销记账-->
  <div class="layout">
    <div>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNoLike">
                    <h-input v-model="formItem.billNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.minDueDt')" prop="minDueDt">
                    <h-date-picker type="date" v-model="formItem.minDueDt" placeholder="" @on-change="handleMinDateChange" :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.maxDueDt')" prop="maxDueDt">
                    <h-date-picker type="date" v-model="formItem.maxDueDt" placeholder="" @on-change="handleMaxDateChange" :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                    <h-select v-model="formItem.billType" placeholder="" showTitle>
                      <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptNameLike" >
                    <h-input v-model="formItem.acptNameLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.drweBankNo')" prop="drweBankNoLike" >
                    <h-input v-model="formItem.drweBankNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
                    <h-typefield type="money" v-model="formItem.minBillMoney" placeholder="" @on-blur="formatMinBillMoney('blur')"
                                 @on-focus="formatMinBillMoney('focus')" bigTips></h-typefield>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
                    <h-typefield type="money" v-model="formItem.maxBillMoney" placeholder="" @on-blur="formatMaxBillMoney('blur')"
                                 @on-focus="formatMaxBillMoney('focus')" bigTips></h-typefield>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlightRow
                :bindForm="formItem"
                url="/pb/prsttn/paper/account/pPrsttnCancelAccountMain/func_pageQueryPrsttnBill"
                :row-select="true"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="cancelAccount()">撤销记账</h-button>
                </div>
              </h-datagrid>
            </div>

            <!--票面信息-->
            <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

          </div>
        </h-col>
      </h-row>
    </div>
  </div>
</template>

<script>
  import { post, on, off, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "pPrsttnCancelAccountMain",
    components: {
    },
    data() {
      return {
        formItem : {
          billNoLike:"",
          minDueDt:"",
          maxDueDt:"",
          billType:"",
          acptNameLike:"",
          drweBankNoLike:"",
          minBillMoney:"",
          maxBillMoney:"",
          curFuncNo:"PICE040203",
          billClass:"ME01",
          inOutFlag: "1",
          orderByClause: "PRSTTN_DT desc, ID desc",
          prsttnAcctDt:this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD")
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
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
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let remitDt = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: remitDt}}, remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: dueDt}}, dueDt);
            }
          },

          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",

            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.acctMoney"),
            key: "prsttnReceiveAmt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let prsttnReceiveAmt = formatNumber(params.row.prsttnReceiveAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: prsttnReceiveAmt
                }
              }, prsttnReceiveAmt);
            }
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",

            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.prsttnAcctDt"),
            key: "prsttnAcctDt",
            sortable: true,
            width:120,
            hiddenCol: false,
            render: (h, params) => {
              let prsttnAcctDt = params.row.prsttnAcctDt == null ? "" : this.$moment(params.row.prsttnAcctDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: prsttnAcctDt}}, prsttnAcctDt);
            }
          },
        ],
        dictMap : new Map(),
        ifShowMore : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        billTypeList : [],
        acctStatusList : [],
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        hasSelect : false,
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,AcctFlag").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.acctStatusList = res.get("AcctFlag");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleMinDateChange(value){
        this.formItem.minDueDt = value.replace(/-/g, "");
      },
      handleMaxDateChange(value){
        this.formItem.maxDueDt = value.replace(/-/g, "");
      },
      formatMinBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
            this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        }
      },
      formatMaxBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        }
      },
      //查询
      handleSearch() {
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.billNoLike = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.billType = "";
        this.formItem.acptNameLike = "";
        this.formItem.drweBankNoLike = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      //撤销记账按钮
      cancelAccount(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
          return;
        }
        let ids = this.$refs.datagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销记账吗?",
          onOk: () => {
            post({ids:ids}, "/pb/prsttn/paper/account/pPrsttnCancelAccountMain/func_cancelPrsttnAccount").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //票面信息关闭
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
