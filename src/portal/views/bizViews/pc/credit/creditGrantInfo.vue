<!-- 额度申请-明细-->
<template>
  <h-msg-box v-model="tempCreditGrantInfoWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" :footerHide="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <!--查询表单-->
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.activeDt')" prop="activeDt">
            <h-date-picker v-model="formItem.activeDt" type="date" :editable=false
                           :showFormat=true @on-change="activeDtChange('query')" placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.failureDt')" prop="failureDt">
            <h-date-picker v-model="formItem.failureDt" type="date" :editable=false
                           :showFormat=true :options="selectFailureDt" placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.reviewStatus')" prop="creditStatus">
            <h-select v-model="formItem.creditStatus" placeholder="">
              <h-option v-for="item in creditGrantInfoParams.creditStatusList" :value="item.key" :key="item.value" v-if="item.key !== '10'" >
                {{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item  :label="$t('m.i.pc.creditInfoNo')" prop="creditInfoNo">
            <h-input v-model="formItem.creditInfoNo" :maxlength="50"></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
                <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        :highlight-row=false
        url="/pc/credit/creditGrantInfo/func_pagingQueryCreditInfoList"
        :bindForm="formItem"
        :rowSelect="true"
        :onSelectChange="handleSelectClick"
        :onCurrentChange="handleCurrentChange"
        :onCurrentChangeCancel="handleCurrentChangeCancel"
        :auto-load="false"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.creditInfoAdd">
            {{$t("m.i.common.add")}}
          </h-button>
          <h-button type="primary" @click="handleAddForm('modify')"
                    v-if="authObj.creditInfoModify">
            {{$t("m.i.common.modify")}}
          </h-button>
          <h-button type="primary" @click="handleComfirm" v-if="authObj.creditInfoDelete">
            {{$t("m.i.common.delete")}}
          </h-button>
          <h-button type="primary" @click="handleCheck('submit')" v-if="authObj.submitCheckAuth">
            {{$t("m.i.common.submitCheck")}}
          </h-button>
          <h-button type="primary" @click="handleCheck('cancel')" v-if="authObj.cancelCheckAuth">
            {{$t("m.i.common.cancelCheck")}}
          </h-button>
        </div>
      </h-datagrid>
    </div>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true" :z-index=1010>
      <p slot="header">
        <span v-if="type==='add'">新增额度批复明细</span>
        <span v-if="type==='modify'">修改额度批复明细</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search" onlyBlurRequire>
          <h-form-item :label="$t('m.i.pc.creditType')" prop="creditType" :required="type === 'modify'" v-if="type === 'modify'">
            <h-select v-model="addForm.creditType" :readonly="type === 'modify'" placeholder="">
              <!--<h-option v-for="item in creditTypeList" :value="item.key" :key="item.value">{{ item.value }}-->
              <!--</h-option>-->
              <h-option value="1">综合授信</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.doAmt')" prop="doAmt" :required="isRequired"  v-if="type === 'modify'">
            <h-typefield  type="money" bigTips v-model="addForm.doAmt" integerNum="12"
                          placeholder="大于0的数字，小数位只能输2位" :readonly="type === 'modify'"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.usedCreditAmt')" prop="usedCreditAmt"  v-if="type === 'modify'">
            <h-typefield  type="money" bigTips v-model="addForm.usedCreditAmt" integerNum="12"
                          placeholder="大于0的数字，小数位只能输2位" :readonly="type === 'modify'"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.freezedAmt')" prop="freezedAmt"  v-if="type === 'modify'">
            <h-typefield  type="money" bigTips v-model="addForm.freezedAmt" integerNum="12"
                          placeholder="大于0的数字，小数位只能输2位" :readonly="type === 'modify'"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.creditLimitAmt')" prop="creditLimitAmt"  :required="isRequired">
            <h-typefield  type="money" bigTips v-model="addForm.creditLimitAmt" integerNum="12"
                         placeholder="大于0的数字，小数位只能输2位"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.creditProdNo')" prop="creditProdNo" :required="isRequired" v-if="isShowCreditProd">
            <h-select v-model="addForm.creditProdNo" :readonly="type === 'modify'" placeholder="">
              <h-option v-for="item in this.creditGrantInfoParams.creditProdNoList" :value="item.creditProdNo" :key="item.creditProdName">{{ item.creditProdName }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.activeDt')" prop="activeDt" :required="isRequired">
            <h-date-picker v-model="addForm.activeDt" type="date" :editable=false placeholder=""
                           :showFormat=true @on-change="activeDtChange('addOrEdit')"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.failureDt')" prop="failureDt" :required="isRequired">
            <h-date-picker v-model="addForm.failureDt" type="date" :editable=false placeholder=""
                           :showFormat=true :options="selectFailureDt"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.isRecircle')" prop="isRecircle" :required="isRequired">
            <h-select v-model="addForm.isRecircle" readonly placeholder="">
              <h-option value="0">否</h-option>
              <h-option value="1">是</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </h-msg-box>
</template>
<script>
  import { on, off, post, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditGrantInfo",
    data() {
      let addForm = {
        id: "",
        legalNo: "",
        creditBatchId: "",
        creditType: "",
        custType: "",
        doAmt: "",
        usedCreditAmt: "",
        freezedAmt: "",
        creditLimitAmt: "",
        activeDt: "",
        failureDt: "",
        isRecircle: "0",
        creditProdNo: ""
      };
      let formItem = {
        batchId: "",
        creditStatus: "",
        creditInfoNo: "",
        activeDt: "",
        failureDt: "",
        creditStatusList: "0,1,5"
      };
      let _this = this;
      return {
        ifShowMore : false,
        isShowCreditProd : false,
        creditProdNoList : [],
        //给按钮增加权限
        authObj : {
          creditInfoAdd: true,       //新增额度明细
          creditInfoModify: true,    //修改额度明细
          creditInfoDelete: true,    //删除额度明细
          submitCheckAuth: true,      //提交复核
          cancelCheckAuth: true      //删除复核
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.pc.creditInfoNo"),
            key: "creditInfoNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.reviewStatus'),
            key: "creditStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.creditGrantInfoParams.dictMap, "CreditStatus", params.row.creditStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.creditType"),
            key: "creditType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = params.row.creditType;
              switch (params.row.creditType) {
                case "1":
                  info = "综合授信";
                  break;
              }
              return h("span", info);
            }
          },
          {
            title:this.$t("m.i.pc.creditLimitAmt"),
            key: "creditLimitAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
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
            title: this.$t("m.i.pc.doAmt"),
            key: "doAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
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
            title: this.$t("m.i.pc.usedCreditAmt"),
            key: "usedCreditAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
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
            title: this.$t("m.i.pc.freezedAmt"),
            key: "freezedAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let freezedAmt = formatNumber(params.row.freezedAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: freezedAmt
                }
              }, freezedAmt);
            }
          },
          {
            title:this.$t("m.i.pc.activeDt"),
            key: "activeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.activeDt == null ? "" : this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.failureDt"),
            key: "failureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.failureDt == null ? "" : this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.creditProd"),
            key: "creditProdNo",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.creditGrantInfoParams.dictMap, "CreditProdNoList", params.row.creditProdNo);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        formItem : formItem,
        addForm : addForm,
        amtRule : [{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "金额为大于等于0的不超过20位的数字，且小数位不超过两位"
        }],
        type : "query",
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : null,
        currentSelectList : [],
        currentSelectRowInx : [],
        selectFailureDt : {
          disabledDate(date) {
            if (_this.type !== "query") {
              let start = _this.$moment(addForm.activeDt).format("YYYY/MM/DD");
              let end = date.valueOf() - new Date(start).getTime();
              return end < 0;
            } else {
              let start = _this.$moment(formItem.activeDt).format("YYYY/MM/DD");
              let end = date.valueOf() - new Date(start).getTime();
              return end < 0;
            }
          }
        },
      };
    },
    props: {
      title: {
        type: String,
        default: "额度批复明细"
      },
      creditGrantInfoWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      creditGrantInfoParams: {
        type: Object,
        default: {
          creditBatchId: "",
          creditType: "",
          custType: "",
          creditStatusList: [],
          creditProdNoList: [],
          dictMap: Map
        }
      }
    },
    components: {},
    watch: {
      creditGrantInfoWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.getIfDifferCredProd();
            this.formItem.creditBatchId = this.creditGrantInfoParams.creditBatchId;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempCreditGrantInfoWin: {
        get() {
          return this.creditGrantInfoWin;
        },
        set() {
        }
      },
    },
    methods: {
      //获取系统参数（额度模块是否区分授信品种）
      getIfDifferCredProd() {
        post({}, "/pc/credit/creditGrantInfo/func_getPropertyIfDifferCredProd").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let differCredProd = res.data.retData.differCredProd;
              this.isShowCreditProd = differCredProd === "1";
              if (!this.isShowCreditProd) {
                this.$refs.datagrid.controlColumnsHidden("creditProdNo", true);
              }else {
                this.$refs.datagrid.controlColumnsHidden("creditProdNo", false);
              }
            } else {
              this.isShowCreditProd = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleClose() {
        this.$emit("creditGrantInfoWinClose", "");
      },
      activeDtChange(optType) {
        if (optType === "query") {
          this.formItem.failureDt = "";
        } else {
          if (this.addForm.activeDt !== "" && this.addForm.activeDt !== null && this.addForm.activeDt !== undefined
              && this.addForm.failureDt !== "" || this.addForm.failureDt !== null || this.addForm.failureDt !== undefined) {
            let activeDt = this.$moment(this.addForm.activeDt, "YYYY-MM-DD").format("YYYYMMDD");
            let failureDt = this.$moment(this.addForm.failureDt, "YYYY-MM-DD").format("YYYYMMDD");
            if (Number(activeDt) > Number(failureDt)) {
              this.addForm.failureDt = "";
            }
          }else {
            this.addForm.failureDt = "";
          }
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.currentSelectRowInx = [];
        this.formItem.activeDt = this.formItem.activeDt.replace(/-/g, "");
        this.formItem.failureDt = this.formItem.failureDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.type = "query";
        this.$refs.addForm.resetFields();
      },
      // 新增/修改额度批次明细
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.currentSelectList.length === 1) {
            let currentSelectRow = this.currentSelectList[0];
            if (currentSelectRow.creditStatus !== "0") {
              let info = this.getDictValueFromMap(this.creditGrantInfoParams.dictMap, "CreditStatus", currentSelectRow.creditStatus);
              this.$msgTip.info(this, { info: "状态为【" + info + "】,不允许修改" });
              return;
            }
            this.$nextTick(() => {
              post({ id: currentSelectRow.id }, "/pc/credit/creditGrantInfo/func_queryCreditGrantInfoById").then(res => {
                this.submitFlag = false;
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    let data = res.data.retData;
                    this.addForm.id = data.id;
                    this.addForm.legalNo = data.legalNo;
                    this.addForm.creditBatchId = data.creditBatchId;
                    this.addForm.creditType = data.creditType;
                    this.addForm.custType = data.custType;
                    this.addForm.doAmt = data.doAmt == null ? "0.00" : formatNumber(data.doAmt, 2, ",");
                    this.addForm.usedCreditAmt = data.usedCreditAmt == null ? "0.00" : formatNumber(data.usedCreditAmt, 2, ",");
                    this.addForm.freezedAmt = data.freezedAmt == null ? "0.00" : formatNumber(data.freezedAmt, 2, ",");
                    this.addForm.creditLimitAmt = data.creditLimitAmt == null ? "0.00" : formatNumber(data.creditLimitAmt, 2, ",");
                    this.addForm.creditProdNo = data.creditProdNo;
                    if (data.activeDt != null && data.activeDt !== "") {
                      this.addForm.activeDt = this.$moment(data.activeDt, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                    if (data.failureDt != null && data.failureDt !== "") {
                      this.addForm.failureDt = this.$moment(data.failureDt, "YYYYMMDD").format("YYYY-MM-DD");
                    }
                    this.addForm.isRecircle = data.isRecircle;
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
            this.addForm.isRecircle = "0";
            this.addForm.creditBatchId = this.creditGrantInfoParams.creditBatchId;
            this.addForm.creditType = this.creditGrantInfoParams.creditType;
            this.addForm.custType = this.creditGrantInfoParams.custType;
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addForm.creditBatchId = "";
        this.addForm.id = "";
        this.$refs.addForm.resetFields();
      },
      formatDoAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.doAmt)) && isFinite(this.addForm.doAmt)) {
            this.addForm.doAmt = this.addForm.doAmt == null ? "0.00" : formatNumber(this.addForm.doAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.doAmt = this.addForm.doAmt.toString().replace(/,/g, "");
        }
      },
      formatLimitAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.creditLimitAmt)) && isFinite(this.addForm.creditLimitAmt)) {
            this.addForm.creditLimitAmt = this.addForm.creditLimitAmt == null ? "0.00" : formatNumber(this.addForm.creditLimitAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.creditLimitAmt = this.addForm.creditLimitAmt.toString().replace(/,/g, "");
        }
      },
      submitForm() {
        this.addForm.creditLimitAmt = this.addForm.creditLimitAmt.toString().replace(/,/g, "");
        if (this.type === "modify") {
          this.addForm.doAmt = this.addForm.doAmt.toString().replace(/,/g, "");
          this.addForm.usedCreditAmt = this.addForm.usedCreditAmt.toString().replace(/,/g, "");
          this.addForm.freezedAmt = this.addForm.freezedAmt.toString().replace(/,/g, "");
          this.addForm.creditLimitAmt = this.addForm.creditLimitAmt.toString().replace(/,/g, "");
        }
        this.addForm.activeDt = this.addForm.activeDt.replace(/-/g, "");
        this.addForm.failureDt = this.addForm.failureDt.replace(/-/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/pc/credit/creditGrantInfo/func_addCreditGrantInfo" : "/pc/credit/creditGrantInfo/func_updateCreditGrantInfo";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                  this.currentSelectRowInx = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            this.addForm.creditLimitAmt = this.addForm.creditLimitAmt == null ? "0.00" : formatNumber(this.addForm.creditLimitAmt, 2, ",");
            if (this.type === "modify") {
              this.addForm.doAmt = this.addForm.doAmt == null ? "0.00" : formatNumber(this.addForm.doAmt, 2, ",");
              this.addForm.usedCreditAmt = this.addForm.usedCreditAmt == null ? "0.00" : formatNumber(this.addForm.usedCreditAmt, 2, ",");
              this.addForm.freezedAmt = this.addForm.freezedAmt == null ? "0.00" : formatNumber(this.addForm.freezedAmt, 2, ",");
              this.addForm.creditLimitAmt = this.addForm.creditLimitAmt == null ? "0.00" : formatNumber(this.addForm.creditLimitAmt, 2, ",");
            }
          }
        });
      },
      //删除额度批次明细
      handleComfirm() {
        if (this.currentSelectList.length !== 0) {
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
        let list = this.currentSelectList;
        let ids = [];
        for (let i = 0; i < list.length; i++) {
          ids.push(list[i].id);
        }
        post({ ids: ids.join(",") }, "/pc/credit/creditGrantInfo/func_delCreditGrantInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.currentSelectRowInx = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //提交/撤销复核,0-未提交：可进行复核；1-待复核、5-已复核：可进行撤销复核
      handleCheck(optType) {
        if (this.currentSelectList.length !== 0) {
          let content = optType === "submit" ? "确定提交复核？" : "确定撤销提交?";
          let url = optType === "submit" ? "/pc/credit/creditGrantInfo/func_submitReCheckGrantInfo" : "/pc/credit/creditGrantInfo/func_cancelSubmitReCheckGrantInfo";
          let list = this.currentSelectList;
          let ids = [];
          for (let i = 0; i < list.length; i++) {
            if (optType === "submit") {
              if (list[i].creditStatus === "0") {
                ids.push(list[i].id);
              } else {
                let info = this.getDictValueFromMap(this.creditGrantInfoParams.dictMap, "CreditStatus", list[i].creditStatus);
                this.$msgTip.info(this, { info: "额度信息编号【" + list[i].creditInfoNo + "】的当前状态为【" + info + "】,只有处于【未提交】状态的才可发起此操作" });
                return;
              }
            } else if (optType === "cancel") {
              if (list[i].creditStatus === "1") {
                ids.push(list[i].id);
              } else {
                let info = this.getDictValueFromMap(this.creditGrantInfoParams.dictMap, "CreditStatus", list[i].creditStatus);
                this.$msgTip.info(this, { info: "额度信息编号【" + list[i].creditInfoNo + "】的当前状态为【" + info + "】,只有处于【待复核】状态的才可发起此操作" });
                return;
              }
            }
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: content,
            onOk: () => {
              this.check(url, ids);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      check(url, ids) {
        post({ ids: ids }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.currentSelectRowInx = [];
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
