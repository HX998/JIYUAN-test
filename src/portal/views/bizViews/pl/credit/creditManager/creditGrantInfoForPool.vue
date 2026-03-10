<!--额度批复-票据池额度批复明细-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue">
      <h-col span="24">
        <div>
          <cust-credit-detail :batchDetailParams="creditGrantInfoParams" :isShowPoolBailPcet="false"
                              ref="custCreditDetail"></cust-credit-detail>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/pl/credit/CreditManager/creditGrantBatchForPool/func_pagingQueryGrantCreditInfo"
            highlight-row
            :auto-load="false"
            :bindForm="billManagerFormItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="creditOperate('add')"
                        :disabled="creditGrantInfoParams.isMainGroupCus === '0'">{{$t("m.i.common.allot")}}
              </h-button>
              <h-button type="primary" @click="creditOperate('modify')"
                        :disabled="creditGrantInfoParams.isMainGroupCus === '0'">{{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="creditDelete"
                        :disabled="creditGrantInfoParams.isMainGroupCus === '0'">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="ghost" @click="returnMain">{{$t("m.i.pl.returnMain")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击分配/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="optType==='add'">分配额度</span>
        <span v-if="optType==='modify'">修改额度</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item prop="custName" :label="$t('m.i.pl.groupName')" required>
            <h-input v-model="addForm.custName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.groupSumLimit')" prop="creditLimitAmt" required>
            <h-typefield v-model="addForm.creditLimitAmt" :maxlength="20" placeholder="" readonly bigTips
                         divided></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.groupRemainLimit')" prop="doAmt" required class="h-form-long-label">
            <h-typefield v-model="addForm.doAmt" :maxlength="20" placeholder="" readonly bigTips divided></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.bCompanyyName')" prop="joinCustName" required>
            <h-input v-model="addForm.joinCustName" :maxlength="60" readonly ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.creditLimitAmt')" prop="dealAmt" required>
            <h-typefield v-model="addForm.dealAmt" :maxlength="20" placeholder="" bigTips divided :nonNegative="true"></h-typefield>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { accMul, formatNumber, off, on, post } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditGrantInfoForPool",
    data() {
      return {
        columns : [],
        billManagerColumns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
           title:this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title:this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            ellipsis: false
          },
          {
           title:this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title:this.$t("m.i.pl.billBailAcctNo"),
            key: "billBailAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t('m.i.pl.poolBailSubAcctNo'),
            key: "poolBailSubAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
           title:this.$t("m.i.pc.creditLimitAmt"),
            key: "creditLimitAmt",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let creditLimitAmt = formatNumber(params.row.creditLimitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: creditLimitAmt
                }
              }, creditLimitAmt);
            }
          },
          {
           title:this.$t("m.i.pl.inPoolAmt"),
            key: "inPoolAmt",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let inPoolAmt = formatNumber(params.row.inPoolAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: inPoolAmt
                }
              }, inPoolAmt);
            }
          },
          {
            title:this.$t("m.i.pl.bailLimit"),
            key: "bailBalance",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let bailBalance = formatNumber(params.row.bailBalance, 2, ",");
              return h("span", {
                domProps: {
                  title: bailBalance
                }
              }, bailBalance);
            }
          },
          {
            title: this.$t("m.i.pc.usedCreditAmt"),
            key: "usedCreditAmt",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let usedCreditAmt = formatNumber(params.row.usedCreditAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: usedCreditAmt
                }
              }, usedCreditAmt);
            }
          },
          {
            title:  this.$t("m.i.pc.doAmt"),
            key: "doAmt",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let doAmt = formatNumber(params.row.doAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: doAmt
                }
              }, doAmt);
            }
          },
          {
            title: this.$t("m.i.pc.operTeller"),
            key: "operTellerNo",
            hiddenCol: false
          }
        ],
        billManagerFormItem : {
          batchId: "",
          agreementNo: "",
          custNo: "",
        },
        currentSelectRow : [],
        addForm : {
          id: "",
          legalNo: "",
          agreementNo: "",
          poolName: "",
          custNo: "",
          custName: "",
          creditLimitAmt: "",
          doAmt: "",
          joinCustNo: "",
          joinCustName: "",
          dealAmt: ""
        },
        addOrEditWin : false,
        signAgreementWin : false,
        signParams : {},
        submitFlag : false,
        optType : "",
      };
    },
    props: {
      billManagerVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      creditGrantInfoParams: {
        type: Object,
        default: {
          batchId: "",
          isMainGroupCus: "",
          isGroupCus: "",
          isJoin: "",
          custNo: "",
          poolNo: "",
          poolName: "",
          batchInfoUrl: "",
          showSubBillBailAcctNo:false
        }
      }
    },
    components: {
    },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.creditGrantInfoParams.batchId;
          this.billManagerFormItem.custNo = this.creditGrantInfoParams.custNo;
          this.billManagerFormItem.agreementNo = this.creditGrantInfoParams.agreementNo;
          this.$nextTick(() => {
            if (!this.creditGrantInfoParams.showSubBillBailAcctNo){
              this.billManagerColumns.forEach((value, index) => {
                if (value.key === 'poolBailSubAcctNo') {
                  value.hiddenCol = true;
                }
              });
            }
            this.columns = this.deepClone(this.billManagerColumns);
            this.$refs.billManagerDatagrid.createShowCol(this.columns);
            this.handleSearch();
          });
        }
      }
    },
    computed: {
      tempBillManagerVue: {
        get() {
          return this.billManagerVue;
        },
        set() {
        }
      }
    },
    methods: {
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.billManagerDatagrid.dataChange(1);
        this.$refs.custCreditDetail.getCreditBatchInfo();
      },
      resetSearch() {
        this.billManagerFormItem.poolName = "";
      },

      //返回主页面
      returnMain() {
        this.resetSearch();
        this.$emit("returnMain", "");
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addFormReset();
      },
      // 分配/修改额度
      creditOperate(str) {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.optType = str;
          this.$nextTick(() => {
            let params = {
              custNo: this.creditGrantInfoParams.custNo,
              agreementNo:this.creditGrantInfoParams.agreementNo
            };
            let url = "/pl/credit/CreditManager/creditGrantBatchForPool/fun_queryPoolCredit";
            this.getCreditInfo(params, url);
            if (this.optType === "add") {
              this.addFormReset();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addForm.id = "";
        this.addForm.legalNo = "";
        this.addForm.custNo = "";
        this.addForm.joinCustNo = "";
        this.$refs.addForm.resetFields();
      },
      getCreditInfo(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let data = res.data.retData;
              this.addForm.id = data.id;
              this.addForm.legalNo = data.legalNo;
              this.addForm.agreementNo = data.agreementNo;
              this.addForm.joinCustNo = this.currentSelectRow.custNo;
              this.addForm.joinCustName = this.currentSelectRow.custName;
              this.addForm.custNo = data.custNo;
              this.addForm.custName = this.creditGrantInfoParams.custName;
              this.addForm.creditLimitAmt = data.creditLimitAmt == null ? "0.00" : formatNumber(data.creditLimitAmt, 2, ",");
              this.addForm.doAmt = data.doAmt == null ? "0.00" : formatNumber(data.doAmt, 2, ",");
              if (this.optType === "modify") {
                data.dealAmt = this.currentSelectRow.creditLimitAmt;
                this.addForm.dealAmt = data.dealAmt == null ? "0.00" : formatNumber(data.dealAmt, 2, ",");
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      submitForm() {
        this.addForm.creditLimitAmt = this.addForm.creditLimitAmt.toString().replace(/,/g, "");
        this.addForm.doAmt = this.addForm.doAmt.toString().replace(/,/g, "");
        this.addForm.dealAmt = this.addForm.dealAmt.toString().replace(/,/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.optType === "add" ? "/pl/credit/CreditManager/creditGrantBatchForPool/fun_grantCreditLimit" : "/pl/credit/CreditManager/creditGrantBatchForPool/fun_updateCreditBatch";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.optType === "add" ? 1 : this.$refs.billManagerDatagrid.pageInfo.pageNo;
                  this.$refs.billManagerDatagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            this.addForm.creditLimitAmt = this.addForm.creditLimitAmt == null ? "0.00" : formatNumber(this.addForm.creditLimitAmt, 2, ",");
            this.addForm.doAmt = this.addForm.doAmt == null ? "0.00" : formatNumber(this.addForm.doAmt, 2, ",");
            this.addForm.dealAmt = this.addForm.dealAmt == null ? "0.00" : formatNumber(this.addForm.dealAmt, 2, ",");
          }
        });
      },
      //删除额度
      creditDelete() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel() {
        post({ custNo: this.currentSelectRow.custNo }, "/pl/credit/CreditManager/creditGrantBatchForPool/fun_recoveryCreditLimit").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
