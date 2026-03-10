<!--保证金转结算-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNoList" :label="$t('m.i.common.brchName')" prop="brchNoList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.brchNoList" :brchName.sync="formItem.brchNameList"></show-branch>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo()" clearable @on-clear="clearVal('custName')" readonly></h-input>
                </h-form-item>
                <h-form-item  :label="$t('m.i.common.transDt')"  prop="transDt">
                  <h-date-picker :value="formItem.transDt" type="daterange" showFormat :editable=false
                                 @on-change="handleTransDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <query-btn @showChange="ifShowMore=!ifShowMore" :formSearch="formSearch" :formSearchReset="formSearchReset">
                </query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pl/credit/creditManager/corpCredit/func_pagingQueryCorpCustomerCreditAllotHis"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">

            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul ,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "corpCustomerCreditAllotQuery",
    data() {
      return {
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        ifShowMore : false,
        formItem : {
          custNo: "",
          custName: "",
          transDt: [],
          brchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          custAcctNo: "",
          minTransDt: "",
          maxTransDt: ""
        },
        columns : [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.transFromCustNo"),
            key: "transFromCustNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.transFromCustName"),
            key: "transFromCustName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.transToCustNo"),
            key: "transToCustNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.transToCustName"),
            key: "transToCustName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pc.transToAmt"),
            key: "changeAmt",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let changeAmt = formatNumber(params.row.changeAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: changeAmt
                }
              }, changeAmt);
            }
          },
          {
            title: this.$t("m.i.common.transDt"),
            key: "transDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transDt == null || params.row.transDt === "") {
                return "";
              }
              let date = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
        ],
        currentSelectRow : [],
        dictMap : new Map(),
      };
    },
    components: {

    },
    methods: {
      handleTransDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minTransDt = arr[0].replace(/-/g, "");
          this.formItem.maxTransDt = arr[1].replace(/-/g, "");
          this.formItem.transDt = [arr[0], arr[1]];
        }else{
          this.formItem.minTransDt = "";
          this.formItem.maxTransDt = "";
          this.formItem.transDt = [];
        }
      },
      //搜索选择框清空事件
      clearVal(optType) {
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "custAcctNo"){
          this.formItem.custAcctNo = "";
        }
      },
      // 查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
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
      // 查询客户号信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        if (info.custAcctNo !== "") {
          this.formItem.custAcctNo = info.custAcctNo;
        } else {
          this.formItem.custAcctNo = "";
        }
        this.showCustMessageWin = false;
      },
      // 关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
        this.formItem.transDt = [];
        this.formItem.minTransDt = "";
        this.formItem.maxTransDt = "";
        this.formItem.brchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.brchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
    },
    mounted(){
      this.getDictListByGroups("JjbankBailOperType").then(res => {
        this.dictMap = res.get("map");
      });
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works").then(res => {
        this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
        if (this.isSubAcctWorks==='0'){
          this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo",true);  //不显示保证金子账号
        }
      });
    }
  };
</script>

<style scoped>

</style>
