<!--授信产品管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/credit/creditProduct/func_pagingQueryCreditProductList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.creditProductAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.creditProductModify">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm" v-if="authObj.creditProductDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type==='add'">新增授信产品</span>
        <span v-if="type==='modify'">修改授信产品</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.creditProdNo')" prop="creditProdNo" :required="isRequired">
            <h-input v-model="addForm.creditProdNo" :maxlength="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.creditProdName')" prop="creditProdName" :required="isRequired">
            <h-input v-model="addForm.creditProdName" :maxlength="100"></h-input>
          </h-form-item>
          <h-form-item  :label="$t('m.i.pc.creditType')" prop="creditType" :required="isRequired">
            <h-select v-model="addForm.creditType" placeholder="">
              <h-option value="1">综合授信</h-option>
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
    name: "creditProduct",
    data() {
      return {
        //给按钮增加权限
        authObj : {
          creditProductAdd: true,        //新增
          creditProductModify: true,     //修改
          creditProductDelete: true      //删除
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
            title: this.$t("m.i.pc.creditProdNo"),
            key: "creditProdNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.creditProdName"),
            key: "creditProdName",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.pc.creditType"),
            key: "creditType",
            hiddenCol: false,
            render: (h, params) => {
              let info = params.row.creditType;
              switch (params.row.creditType) {
                case "1":
                  info = "综合授信";
                  break;
              }
              return h("span", info);
            }
          }
        ],
        formItem : {
        },
        addForm : {
          id: "",
          legalNo: "",
          creditProdNo: "",
          creditProdName: "",
          creditType: "",
        },
        type : null,
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : null,
      };
    },
    components: {},
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addForm.id = "";
        this.$refs.addForm.resetFields();
      },
      // 新增/修改授信产品
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.$nextTick(() => {
              this.addForm.id = this.currentSelectRow.id;
              this.addForm.legalNo = this.currentSelectRow.legalNo;
              this.addForm.creditProdNo = this.currentSelectRow.creditProdNo;
              this.addForm.creditProdName = this.currentSelectRow.creditProdName;
              this.addForm.creditType = this.currentSelectRow.creditType;
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
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/pc/credit/creditProduct/func_addCreditProduct" : "/pc/credit/creditProduct/func_updateCreditProduct";
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
      //删除授信产品
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
        post({ ids: id }, "/pc/credit/creditProduct/func_delCreditProduct").then(res => {
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
    }
  };
</script>

<style scoped>

</style>
