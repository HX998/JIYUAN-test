<!--额度分析规则-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.prodName')" prop="prodName">
                  <h-input v-model="formItem.prodName" readonly icon="android-search"
                           @on-click="queryProductName('query')" clearable @on-clear="clearProductName('query')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/credit/creditOperKind/func_pagingQueryCreditOperKindList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.creditOperKindAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.creditOperKindModify">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm" v-if="authObj.creditOperKindDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 产品名称选择弹出框 -->
    <common-product-select :productSelectWin="prodNameSelectWin" @productSelectChange="prodNameSelect"
                           @productSelectWinClose="prodNameSelectWinClose"></common-product-select>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose" class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type==='add'">新增分析规则</span>
        <span v-if="type==='modify'">修改分析规则</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.prodName')" prop="prodName" :required="isRequired">
            <h-input v-model="addForm.prodName" readonly :icon="type==='add'? 'android-search' : ''" @on-click="queryProductName('edit')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" v-if="billTypeRequired" prop="billType" :required="billTypeRequired">
            <h-select v-model="addForm.billType" placeholder="" :readonly="type==='modify'">
              <h-option v-for="item in billTypeList"  :value="item.key" :key="item.value" :label="item.value">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.deductRule')" prop="deductRule" :required="isRequired">
            <h-select v-model="addForm.deductRule" placeholder="">
              <h-option v-for="item in deductRuleList" :value="item.key" :key="item.value" :label="item.value">{{ item.value }}</h-option>
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
  </div>
</template>

<script>
  import { on, off, post } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditOperKind",
    data() {
      return {
        ifShowMore : false,
        operKindIsDifferBillTypeProd : "",
        billTypeRequired : false,
        //给按钮增加权限
        authObj : {
          creditOperKindAdd: true,        //新增
          creditOperKindModify: true,     //修改
          creditOperKindDelete: true      //删除
        },
        columns : [
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
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.prodNo"),
            key: "prodNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            hiddenCol: false,
            sortable: true
          },
          {
            title:  this.$t("m.i.pc.deductRule"),
            key: "deductRule",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CreditDeductRule", params.row.deductRule);
              if (params.row.billType) {
                list = list + "[" + this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType) + "]";
              }
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        formItem : {
          prodNo: "",
          prodName: "",
          billType: "",
          isBackQuery: ""
        },
        addForm : {
          id: "",
          legalNo: "",
          prodNo: "",
          prodName: "",
          billType: "",
          isBackQuery: "",
          deductRule: ""
        },
        type : null,
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : null,
        billTypeList : [],
        deductRuleList : [],
        dictMap : new Map(),
        //产品弹出框
        prodNameSelectWin : false,
        //区分查询产品号操作类型
        optType : "query",
      };
    },
    components: {
      CommonProductSelect :()=>import(/* webpackChunkName: "bm/prod/product/commonProductSelect" */`@/views/bizViews/bm/prod/product/commonProductSelect`)
    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.prodNo = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.optType = "query";
        this.addOrEditWin = false;
        this.addForm.id = "";
        this.$refs.addForm.resetFields();
      },
      clearProductName(optType) {
        if (optType === "query") {
          this.formItem.prodName = "";
          this.formItem.prodNo = "";
        } else if (optType === "edit") {
          this.addForm.prodName = "";
          this.addForm.prodNo = "";
        }
      },
      //选择产品名称
      queryProductName(optType) {
        this.optType = optType;
        this.prodNameSelectWin = true;
      },
      prodNameSelectWinClose() {
        this.prodNameSelectWin = false;
      },
      //选择产品名称弹出框确认
      prodNameSelect(info) {
        if (this.optType === "query") {
          this.formItem.prodName = info[0].title;
          this.formItem.prodNo = info[0].id;
        } else {
          this.addForm.prodName = info[0].title;
          this.addForm.prodNo = info[0].id;
          this.billTypeRequired = this.checkBillTypeRequired(info[0].id);
          this.addForm.billType = "";
        }
        this.prodNameSelectWin = false;
      },
      checkBillTypeRequired(prodNo){
        if (!this.operKindIsDifferBillTypeProd) {
          return false;
        }
        let prods = this.operKindIsDifferBillTypeProd.split(",");
        if(prods.indexOf(prodNo) > -1) {
          return true;
        }
        return false;
      },
      // 新增/修改分析规则
      handleAddForm(str) {
        this.type = str;
        this.optType = "edit";
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.$nextTick(() => {
              this.addForm.id = this.currentSelectRow.id;
              this.addForm.legalNo = this.currentSelectRow.legalNo;
              this.addForm.prodNo = this.currentSelectRow.prodNo;
              this.billTypeRequired = this.checkBillTypeRequired(this.addForm.prodNo);
              this.addForm.prodName = this.currentSelectRow.prodName;
              this.addForm.billType = this.currentSelectRow.billType;
              this.addForm.isBackQuery = this.currentSelectRow.isBackQuery;
              this.addForm.deductRule = this.currentSelectRow.deductRule;
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addForm.id = "";
        this.$refs.addForm.resetFields();
        this.billTypeRequired = false;
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/pc/credit/creditOperKind/func_addCreditOperKind" : "/pc/credit/creditOperKind/func_updateCreditOperKind";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.billTypeRequired = false;
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //删除分析规则
      handleComfirm() {
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
        let id = this.currentSelectRow.id;
        post({ ids: id }, "/pc/credit/creditOperKind/func_delCreditOperKind").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CreditDeductRule").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.deductRuleList = res.get("CreditDeductRule");
        this.dictMap = res.get("map");
      });
      post({paramKey: "pc.credit.oper_kind_is_differ_bill_type_prod", loading: false}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          if (res.data.retCode === "000000") {
            if (res.data.retData) {
              this.operKindIsDifferBillTypeProd = res.data.retData;
            }
          }
        }
      });
    }
  };
</script>

<style scoped>

</style>
