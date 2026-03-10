<!-- 企业电票业务签约信息 -->
<template>
  <h-msg-box v-model="tempShowCustElecSignWin" :mask-closable="false" @on-close="handleClose" top="10"
             :maximize="true" width="1000" class="h-form-table-layer" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!-- 查询表单 -->
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
        <h-form-item label="客户号" prop="custNo">
          <h-input v-model="formItem.custNo" placeholder="" :readonly="isShowCustAcctNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.custName')" prop="custNameLike">
          <h-input v-model="formItem.custNameLike" placeholder="" :readonly="isShowCustAcctNo"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate two-form">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="columns"
          :bindForm="formItem"
          highlight-row
          :auto-load="false"
          url="/pl/iopool/inpool/paper/pInPoolApplyMain/func_pagingBillAgreement"
          :onCurrentChange="handleCurrentChange"
          :onCurrentChangeCancel="handleCurrentChangeCancel"
          :onRowDbClick="doubleHandleClick"
          ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "showCustPoolSign",
    data() {
      return{
        formItem : {
          signStatus: "1",
          custNo: "",
          custNameLike: "",
          signFuncNo : "1",
          deleteFlag : "0",
          effectiveFlag : "1"
        },
        columns : [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 60
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "客户号",
            key: "custNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: "客户账号",
            key: "custAcctNo",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        currentSelectRow : [],
        ifShowMore : false,
      }
    },
    props: {
      title: {
        type: String,
        default: "查询客户信息"
      },
      showCustElecSignWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isShowCustAcctNo: {
        type: Boolean,
        default() {
          return false;
        }
      },
      custInfoParams: {
        type: Object,
        default() {
          return {
            custNo: "",
            custName: ""
          };
        }
      }
    },
    watch: {
      showCustElecSignWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearchReset();
            this.$refs.datagrid.$refs.gridPage.clearElevator();
            if (this.isShowCustAcctNo) {
              this.formItem.custNo = this.custInfoParams.custNo;
              this.formItem.custNameLike = this.custInfoParams.custName;
            }
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempShowCustElecSignWin: {
        get() {
          return this.showCustElecSignWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //查询重置
      formSearchReset() {
        this.$refs.formItem.resetFields(true);
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("custElecSignSubmit", this.currentSelectRow);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("custElecSignSubmit", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      getCustAcctList(custNo) {
        let params = { signStatus: "1", custNo: custNo };
        post(params, "/bm/sign/pageQueryCustElecSign").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let list = res.data.retData.list;
              if (list.length === 1) {
                this.currentSelectRow.custAcctNo = list[0].custAcctNo;
              } else {
                this.currentSelectRow.custAcctNo = "";
              }
              this.$emit("custElecSignSubmit", this.currentSelectRow);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleClose() {
        this.$emit("custElecSignWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
