<!--票据中心查询-纸票查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo" :maxlength="30"></h-input>
                </h-form-item>
                <common-date-picker v-model="remitDt" :label="$t('m.i.billInfo.remitDt')" prop="remitDt" type="daterange" :rangeValue="['minRemitDt','maxRemitDt']"
                                    :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt">
                </common-date-picker>
                <h-form-item  :label="$t('m.i.billInfo.billType')"  prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" :prop="isMinBillMoney">
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
                <h-form-item  :label="$t('m.i.pc.inOutFlag')"  prop="inOutFlag">
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
                  <h-button type="primary" @click="showBill">{{$t("m.i.pe.showBill")}}</h-button>
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
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pBillTransQuery",
    components: {
    },
    data() {
      return {
        //区分最大和最小票据金额
        billMoneyType: "min",
        dueDt: [],
        remitDt: [],
        formItem: {
          legalNo: this.$store.getters.userInfo.legalNo,
          billClass: "ME01",
          billNo: "",
          reverseBillNo: "",
          drwrName: "",
          pyeeName: "",
          acptName: "",
          billType: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          minRemitDt: "",
          maxRemitDt: ""
        },
        billNoRule: [{ test: /^[0-9]{3}[0][0-9]{2}[5|6][0-9]{0,9}$/, trigger: "blur", message: "纸票票据号码为16位数字,第四位为0,银票第七位为5，商票第七位为6" }],
        columns: [
          {
            type: "radio",
            title: " ",
            width: 50,
            align: "center",
            hiddenCol: false
          }, {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.id, params.row.billNo);
                  }
                }
              }, params.row.billNo);
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
          }, {
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
          },
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
          },
          {
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
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
              title: this.$t("m.i.pc.inOutFlag"),
              key: "inOutFlag",
              hiddenCol: false,
              render: (h, params) => {
                  if(params.row.inOutFlag === '' || params.row.inOutFlag == null){
                      return h('span',{},'-');
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
        dictMap: new Map(),
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
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
      this.getDictListByGroups("DraftTypeCode,EcdsBillStatusCode,InOutFlagCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.inOutFlagList = res.get("InOutFlagCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleDueDtChange(arr) {
        if(arr && arr.length){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

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
        this.formItem.inOutFlag = "";
        this.$refs.formItem.resetFields();
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
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
