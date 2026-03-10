<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="prodNo" :label="$t('m.i.common.busiType')">
                  <h-select v-model="formItem.prodNo" placeholder="">
                    <h-option v-for="item in prodNoList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pe/upbsInqrep/receiveInquiryResponse/func_pagingQueryRecvReplyRecordList"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="synMyBankSendQuery">{{$t("m.i.pe.synMyBankSendQuery")}}</h-button>
              <h-button type="primary" @click="synQueryInfoStatus">{{$t("m.i.pe.synQuery1InfoStatus")}}</h-button>
              <h-button type="primary" @click="register">{{$t("m.i.pe.ansRegister")}}</h-button>
              <h-button type="primary" @click="inquiryPrint">{{$t("m.i.pe.inquiryPrint")}}</h-button>
              <h-button type="primary" @click="inquiryResponsePrint">{{$t("m.i.pe.inquiryResponsePrint")}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 登记弹出框 -->
        <h-msg-box v-model="registerWin" width="400" @on-close="registerWinClose" class="h-form-search-layer"
                   :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>收到查复登记</span>
          </p>
          <div>
            <h-form :model="registerForm" :label-width="115" ref="registerForm" cols="1" class="h-form-search">
              <h-form-item prop="replyContent" :label="$t('m.i.pc.replyContent')" required>
                <h-input v-model="registerForm.replyContent" type="textarea" placeholder="" :canResize="false" :rows="4"
                         :readonly="isRegisterReadonly" :maxlength=1000 :lengthByByte="false" ></h-input>
              </h-form-item>
              <h-form-item>
                <div></div>
              </h-form-item>
              <h-form-item prop="isPass"  :label="$t('m.i.pe.isPass')" required>
                <h-radio-group v-model="registerForm.isPass">
                  <h-radio label="1">
                    <span>正常</span>
                  </h-radio>
                  <h-radio label="0">
                    <span>不正常</span>
                  </h-radio>
                </h-radio-group>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="registerWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="registerFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>
        <!-- 产品名称选择弹出框 -->
        <common-product-select :productSelectWin="productSelectWin" @productSelectChange="productSelectChange"
                               @productSelectWinClose="productSelectWinClose"></common-product-select>
        <!-- 查看票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "receiveInquiryResponse",
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        prodNoList: [],
        formItem: {
          prodNo: "",
          billNoLike: ""
        },
        registerForm: {
          id: "",
          replyContent: "",
          isPass: "1"
        },
        isRegisterReadonly: false,
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.pc.payFromBankNo"),
            key: "payFromBankNo",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.pc.queryType"),
            key: "queryType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "UpbsQueryType", params.row.queryType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "queryAnswerStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "UpbsQueryAnswerStatus", params.row.queryAnswerStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.queryBookNo"),
            key: "queryBookNo",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.pc.queryDt"),
            key: "queryDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.queryDt == null || params.row.queryDt === "") {
                return "";
              }
              let date = this.$moment(params.row.queryDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.queryContent"),
            width:220,
            ellipsis:true,
            key: "queryContent",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.answerBookNo"),
            key: "answerBookNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.replyDt"),
            key: "replyDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.replyDt == null || params.row.replyDt === "") {
                return "";
              }
              let date = this.$moment(params.row.replyDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t("m.i.pc.replyContent"),
            width:220,
            key: "replyContent",
            ellipsis:true,
            hiddenCol: false
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
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.billMoney"),
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
          }
        ],
        currentSelectRow: [],
        registerWin: false,
        submitFlag: false,
        dictMap: new Map(),
        yonList: [],
        productSelectWin: false
      };
    },
    components: {
      CommonProductSelect: () => import(/* webpackChunkName: "bm/prod/product/commonProductSelect" */`@/views/bizViews/bm/prod/product/commonProductSelect`)
    },
    mounted() {
      this.getDictListByGroups("Yon,UpbsQueryType,UpbsQueryAnswerStatus,UpbsQueryBusiType").then(res => {
        this.yonList = res.get("Yon");
        this.prodNoList = res.get("UpbsQueryBusiType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //产品名称选择弹出框
      queryProductName() {
        this.productSelectWin = true;
      },
      //产品名称选择确认
      productSelectChange(info) {
        this.formItem.prodNo = info[0].id;
        this.formItem.prodName = info[0].title;
        this.productSelectWin = false;
      },
      //产品名称选择关闭窗口
      productSelectWinClose() {
        this.productSelectWin = false;
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.prodNo = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
        showBillInfo(billId, billNo) {
            this.billId = billId;
            this.billNo = billNo;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      //同步我行发出查询
      synMyBankSendQuery() {
        let url = "/pe/upbsInqrep/receiveInquiryResponse/func_synchronizeSendQuery";
        post({}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
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

      //同步查询信息状态
      synQueryInfoStatus() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let id = this.currentSelectRow.id;
        let url = "/pe/upbsInqrep/receiveInquiryResponse/func_synchronizeSendQueryFlowStatus";
        post({ id: id }, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
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

      //登记
      register() {
        this.isRegisterReadonly = false;
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.currentSelectRow.queryAnswerStatus !== "003") {
          this.$msgTip.info(this, { info: "还没有收到查复，请收到查复结果之后再登记！" });
          return;
        }
        if (this.currentSelectRow.queryType === "2" || this.currentSelectRow.queryType === "3") {
          this.isRegisterReadonly = true;
          this.registerForm.replyContent = this.currentSelectRow.replyContent;
        }
        this.registerForm.id = this.currentSelectRow.id;
        this.registerWin = true;
      },
      //登记弹窗确定
      registerFormSubmit() {
        this.$refs["registerForm"].validate(valid => {
          if (valid) {
            let url = "/pe/upbsInqrep/receiveInquiryResponse/func_recvReplRegister";
            this.submitFlag = true;
            post(this.registerForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.registerWinClose();
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
      //登记弹窗关闭
      registerWinClose() {
        this.$refs.registerForm.resetFields();
        this.registerWin = false;
      },
      //打印查询书
      inquiryPrint() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.queryPrintData("PE031701");
      },
      //打印查复书
      inquiryResponsePrint() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.queryPrintData("PE031702");
      },
      /**
       * 查询打印数据
       * @param voucherType   打印凭证类型
       */
      queryPrintData(voucherType) {
        let params = { id: this.currentSelectRow.id };
        let url = "/pe/upbsInqrep/receiveInquiryResponse/func_querySendQueryRecordById";
        post(params, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let vocherData = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              this.handelInquiryPrint(voucherType, vocherData);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      handelInquiryPrint(voucherType, vocherData) {
        for (let i = 0; i < vocherData.length; i++) {
          let workDate = window.sessionStorage.getItem("workDate");
          vocherData[i].yyyy = workDate.toString().substring(0, 4);
          vocherData[i].mm = workDate.toString().substring(4, 6);
          vocherData[i].dd = workDate.toString().substring(6, 8);
          if (!!vocherData[i].queryDt) {
            vocherData[i].queryDt = this.$moment(vocherData[i].queryDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (!!vocherData[i].remitDt) {
            vocherData[i].remitDt = this.$moment(vocherData[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (!!vocherData[i].dueDt) {
            vocherData[i].dueDt = this.$moment(vocherData[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          vocherData[i].billMoney = formatNumber(vocherData[i].billMoney, 2, ",");
          vocherData[i].flowNo = vocherData[i].foreFlowNo;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);
        }
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: voucherType, vocherData: vocherData },
          callback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.currentSelectRow = [];
          },
          errorCallback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.currentSelectRow = [];
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
