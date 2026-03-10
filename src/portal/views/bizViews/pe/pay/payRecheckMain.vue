<!-- 支付复核 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch
                  v-model="formItem.ownedBrchNames":label="$t('m.i.common.ownedBrchNo')"
                  prop="ownedBrchNames"
                  v-if="this.licenseFlag":showCheckBox="true":brchNo.sync="formItem.ownedBrchNos":brchName.sync="formItem.ownedBrchNames"
                  :params="{authPath:this.$route.path}"
                  url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                  queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
                  <h-input v-model="formItem.pyeeName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="payAmt" :label="$t('m.i.pe.payAmt')">
                  <h-typefield v-model="formItem.payAmt" type="money" bigTips placeholder=""></h-typefield>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pe/pay/payRecheckMain/func_pagingQueryPayCheckInfoList"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="inputRecheck">{{$t("m.i.pe.inputRecheck")}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 录入复核弹出窗 -->
        <h-msg-box v-model="inputRecheckWin" width="800" @on-close="inputRecheckWinClose" class="h-form-search-layer"
                   :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>录入复核支付信息</span>
          </p>
          <div>
            <h-form :model="inputRecheckForm" :label-width="115" ref="inputRecheckForm" cols="2" class="h-form-search"
                    :footerHide="true">
              <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')">
                <h-input v-model="inputRecheckForm.batchNo" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="prodName" :label="$t('m.i.common.busiType')">
                <h-input v-model="inputRecheckForm.prodName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="brchNo" :label="$t('m.i.common.brchNo')">
                <h-input v-model="inputRecheckForm.brchNo" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="brchName" :label="$t('m.i.common.brchName')">
                <h-input v-model="inputRecheckForm.brchName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="operTellerName" :label="$t('m.i.common.operTellerName')">
                <h-input v-model="inputRecheckForm.operTellerName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="drweAcctNo" :label="$t('m.i.pe.drweAcctNo')">
                <h-input v-model="inputRecheckForm.drweAcctNo" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="drweName" :label="$t('m.i.pe.drweName')">
                <h-input v-model="inputRecheckForm.drweName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
                <h-input v-model="inputRecheckForm.pyeeName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')">
                <h-input v-model="inputRecheckForm.pyeeAcctNo" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="pyeeBankNo" :label="$t('m.i.billInfo.pyeeBankNo')" required :validRules="bankNoRule">
                <h-input v-model="inputRecheckForm.pyeeBankNo" placeholder="" :maxlength="12"></h-input>
              </h-form-item>
              <h-form-item prop="payAmt" :label="$t('m.i.pe.payAmt')" required>
                <h-typefield v-model="inputRecheckForm.payAmt" type="money" bigTips placeholder=""></h-typefield>
              </h-form-item>
              <h-form-item prop="payRemark" :label="$t('m.i.common.postscript')">
                <h-input v-model="inputRecheckForm.payRemark" placeholder="" :maxlength="250"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div style="text-align: center">
            <h-button type="primary" @click="recheckNoPassAndCancel" size="large" v-if=this.showCancelButtun>{{$t("m.i.pe.recheckNoPassAndCancel")}}</h-button>
            <h-button type="primary" @click="recheckNoPassAndBack" size="large">{{$t("m.i.pe.recheckNoPassAndBack")}}</h-button>
            <h-button type="primary" @click="recheckPassAndCommit" size="large">{{$t("m.i.pe.recheckPassAndCommit")}}</h-button>
            <h-button type="ghost" @click="inputRecheckWinClose" size="large">{{$t("m.i.common.close")}}</h-button>
          </div>
          <div slot="footer"></div>
        </h-msg-box>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "payRecheckMain",
    data() {
      return {
        brchNoWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
        showCancelButtun:true,
        formItem: {
          pyeeName: "",
          payAmt: "",
          ownedBrchNos:"",
          ownedBrchNames:"",
          authPath:this.$route.path,
        },
        inputRecheckForm: {
          id: "",
          batchNo: "",
          prodName: "",
          brchNo: "",
          brchName: "",
          pyeeName: "",
          pyeeAcctNo: "",
          operTellerName: "",
          drweAcctNo: "",
          drweName: "",
          payAmt: "",
          pyeeBankNo: "",
          payRemark: ""
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
           title: this.$t('m.i.pe.batchIdAndYNo'),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.payAmt'),
            key: "payAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.payAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t('m.i.pe.batchStatus'),
            key: "status",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
           title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: "pyeeBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.corpDrweBankNo'),
            key: "drweBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.drweName'),
            key: "drweName",
            hiddenCol: false
          },
          {
           title: this.$t('m.i.common.operTellerName'),
            key: "operTellerName",
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t('m.i.pe.firstCheckName'),
            key: "firstCheckName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.failReason'),
            key: "failReason",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        inputRecheckWin: false,
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "大额行号由12位数字组成" }]
      };
    },
    mounted() {
      this.getDictListByGroups("CreditCustType").then(res => {
        this.dictMap = res.get("map");
      });

      //集中操作授权
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      this.getPayModuBusiParam();
    },
    methods: {
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.ownedBrchNos="",
        this.formItem.ownedBrchNames=""
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //录入复核
      inputRecheck() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/pe/pay/payRecheckMain/func_queryCheckPayInfoById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.inputRecheckForm.id = res.data.retData.id;
              this.inputRecheckForm.batchNo = res.data.retData.batchNo;
              this.inputRecheckForm.prodName = res.data.retData.prodName;
              this.inputRecheckForm.brchNo = res.data.retData.brchNo;
              this.inputRecheckForm.brchName = res.data.retData.brchName;
              this.inputRecheckForm.pyeeName = res.data.retData.pyeeName;
              this.inputRecheckForm.pyeeAcctNo = res.data.retData.pyeeAcctNo;
              this.inputRecheckForm.operTellerName = res.data.retData.operTellerName;
              this.inputRecheckForm.drweAcctNo = res.data.retData.drweAcctNo;
              this.inputRecheckForm.drweName = res.data.retData.drweName;
              this.inputRecheckForm.payAmt = res.data.retData.payAmt;
              this.inputRecheckForm.pyeeBankNo = res.data.retData.pyeeBankNo;
              this.inputRecheckWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //复核通过并提交信息
      recheckPassAndCommit() {
        if (this.inputRecheckForm.pyeeBankNo !== this.currentSelectRow.pyeeBankNo ||
          formatNumber(this.inputRecheckForm.payAmt, 2, ",") !== formatNumber(this.currentSelectRow.payAmt, 2, ",")) {
          this.$msgTip.info(this, { info: "录入信息与原支付数据信息不一致，请重新录入！" });
          return;
        }
        this.$refs["inputRecheckForm"].validate(valid => {
          if (valid) {
            let url = "/pe/pay/payRecheckMain/func_reCheckPay";
            post(this.inputRecheckForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.inputRecheckWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //复核不通过退回
      recheckNoPassAndBack() {
        let id = this.currentSelectRow.id;
        let url = "/pe/pay/payRecheckMain/func_backReCheckPay";
        post({ id: id }, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.inputRecheckWinClose();
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //复核不通过作废
      // recheckNoPassAndCancel() {
      //   let id = this.currentSelectRow.id;
      //   let url = "/pe/pay/payRecheckMain/func_failReCheckPay";
      //   post({ id: id }, url).then(res => {
      //     if (res) {
      //       let msg = res.data.retMsg;
      //       let retCode = res.data.retCode;
      //       if (retCode === "000000") {
      //         this.$msgTip.success(this);
      //         this.inputRecheckWinClose();
      //         this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      //         this.currentSelectRow = [];
      //       } else {
      //         this.$msgTip.error(this, { info: msg });
      //       }
      //     } else {
      //       this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
      //     }
      //   });
      // },


//复核不通过作废提醒
      recheckNoPassAndCancel() {
        let id = this.currentSelectRow.id;
        let url = "/pe/pay/payRecheckMain/func_failReCheckPay";
        let content = "复核不通过作废，确认要作废吗？";
        this.$hMsgBox.confirm({
          title: "确认要作废吗?",
          content: content,
          onOk: () => {
            post({id: id}, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.inputRecheckWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      //录入复核关闭
      inputRecheckWinClose() {
        this.$refs.inputRecheckForm.resetFields();
        this.inputRecheckWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },
      getPayModuBusiParam() {
        post({ paramKey: "pe.pay.audit_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === "2") {
                this.showCancelButtun = false;
              } else {
                this.showCancelButtun = true;
              }
            } else {
              this.$msgTip.error(this, { info: msg });
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
