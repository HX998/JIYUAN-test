<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pe/upbsInqrep/receiveInquiry/func_pagingQueryRecvQueryRecordList"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="synOtherBankQueryInfo">{{$t("m.i.pe.synOtherBankQueryInfo")}}</h-button>
              <h-button type="primary" @click="synQueryInfoStatus">{{$t("m.i.pe.synQueryInfoStatus")}}</h-button>
              <h-button type="primary" @click="register">{{$t("m.i.pe.register")}}</h-button>
              <h-button type="primary" @click="replyAnswer">{{$t("m.i.pe.replyAnswer")}}</h-button>
              <h-button type="primary" @click="inquiryPrint">{{$t("m.i.pe.inquiryPrint")}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 登记弹出框 -->
        <h-msg-box v-model="registerWin" width="400" @on-close="registerWinClose" class="h-form-search-layer"
                   :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>收到查询登记</span>
          </p>
          <div>
            <h-form :model="registerForm" :label-width="115" ref="registerForm" cols="1" class="h-form-search">
              <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
                <h-input v-model="registerForm.billNo" placeholder="" :maxlength="16"></h-input>
              </h-form-item>
              <h-form-item prop="payFromBankNo" :label="$t('m.i.pc.payFromBankNo')" :validRules="drweBankNoRule">
                <h-input v-model="registerForm.payFromBankNo" :maxlength="12" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="queryContent" :label="$t('m.i.pc.queryContent')">
                <h-input v-model="registerForm.queryContent" type="textarea" placeholder="" :canResize="false"
                         :rows="4"></h-input>
              </h-form-item>
              <h-form-item>
                <div></div>
              </h-form-item>
              <h-form-item prop="replyContent" :label="$t('m.i.pc.replyContent')">
                <h-input v-model="registerForm.replyContent" type="textarea" placeholder="" :canResize="false"
                         :rows="4"></h-input>
              </h-form-item>
              <h-form-item>
                <div></div>
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

        <!-- 回复弹出框 -->
        <h-msg-box v-model="replyAnswerWin" width="800" @on-close="replyAnswerWinClose" class="h-form-search-layer"
                   :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>收到查询回复</span>
          </p>
          <div>
            <h-form :model="replyAnswerForm" :label-width="115" ref="replyAnswerForm" cols="2" class="h-form-search"
                    onlyBlurRequire>
              <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
                <h-input v-model="replyAnswerForm.billNo" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                <h-date-picker type="date" v-model="replyAnswerForm.remitDt" placeholder="" readonly></h-date-picker>
              </h-form-item>
              <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                <h-date-picker type="date" v-model="replyAnswerForm.dueDt" placeholder="" readonly></h-date-picker>
              </h-form-item>
              <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')">
                <h-input v-model="replyAnswerForm.billMoney" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                <h-input v-model="replyAnswerForm.drwrName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
                <h-input v-model="replyAnswerForm.pyeeName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="acptName"  :label="$t('m.i.billInfo.corpDrwrName')">
                <h-input v-model="replyAnswerForm.acptName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="queryContent" :label="$t('m.i.pc.queryContent')">
                <h-input v-model="replyAnswerForm.queryContent" type="textarea" placeholder=""
                         :canResize="false"></h-input>
              </h-form-item>
              <h-form-item prop="replyContent" :label="$t('m.i.pc.replyContent')" required>
                <h-input v-model="replyAnswerForm.replyContent" type="textarea" placeholder=""
                         :canResize="false"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div class="text-wrap mb-10">
            <div class="text-header"><span class="tit">查询历史</span></div>
          </div>
          <div>
            <h-datagrid :columns="replyAnswerColumns"
                        highlight-row
                        :auto-load="false"
                        url="/pe/upbsInqrep/receiveInquiry/func_pagingQueryRecvQueryOccurList"
                        :bindForm="replyAnswerFormItem"
                        ref="replyAnswerDatagrid">
            </h-datagrid>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="replyAnswerWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="replyAnswerFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
          <!-- 查看票面 -->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
        </h-msg-box>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "receiveInquiry",
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        drweBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "请输入12位数字的行号" }],
        formItem: {
          billNoLike: ""
        },
        registerForm: {
          id: "",
          billNo: "",
          payFromBankNo: "",
          queryContent: "",
          replyContent: ""
        },
        replyAnswerForm: {
          id: "",
          billNo: "",
          remitDt: "",
          dueDt: "",
          billMoney: "",
          drwrName: "",
          pyeeName: "",
          acptName: "",
          queryContent: "",
          replyContent: ""
        },
        replyAnswerFormItem: {
          billNo: ""
        },
        replyAnswerRemitDt: "",
        replyAnswerDueDt: "",
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
            hiddenCol: false,
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
            ellipsis:true,
            key: "replyContent",
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
        replyAnswerColumns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
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
            title: this.$t("m.i.pc.payFromBankNo"),
            key: "payFromBankNo",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        registerWin: false,
        replyAnswerWin: false,
        submitFlag: false,
        dictMap: new Map()
      };
    },
    mounted() {
      this.getDictListByGroups("UpbsQueryAnswerStatus,UpbsQueryType").then(res => {
        this.dictMap = res.get("map");
      });
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
      },
      showBillInfo(billId, billNo) {
          this.billId = billId;
          this.billNo = billNo;
          this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //同步他行查询信息
      synOtherBankQueryInfo() {
        let url = "/pe/upbsInqrep/receiveInquiry/func_synchronizeRecQuery";
        this.$loadingbox.open({
          title: "同步中，请稍后..."
        });
        post({}, url).then(res => {
          if (res) {
            this.$loadingbox.close();
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
            this.$loadingbox.close();
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
        let url = "/pe/upbsInqrep/receiveInquiry/func_synchronizeRecQueryFlowStatus";
        this.$loadingbox.open({
          title: "同步中，请稍后..."
        });
        post({ id: id }, url).then(res => {
          if (res) {
            this.$loadingbox.close();
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
            this.$loadingbox.close();
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //登记
      register() {
        this.registerWin = true;
      },
      //登记弹窗确定
      registerFormSubmit() {
        this.$refs["registerForm"].validate(valid => {
          if (valid) {
            let url = "/pe/upbsInqrep/receiveInquiry/func_registerRecvQuery";
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

      //回复
      replyAnswer() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.replyAnswerFormItem.billNo = this.currentSelectRow.billNo;
        let id = this.currentSelectRow.id;
        post({ id: id }, "/pe/upbsInqrep/receiveInquiry/func_queryRecvQueryRecordById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$nextTick(() => {
                this.replyAnswerForm.id = res.data.retData.id;
                this.replyAnswerForm.billNo = res.data.retData.billNo;
                this.replyAnswerForm.remitDt = res.data.retData.remitDt + "";
                this.replyAnswerRemitDt = res.data.retData.remitDt + "";
                this.replyAnswerForm.dueDt = res.data.retData.dueDt + "";
                this.replyAnswerDueDt = res.data.retData.dueDt + "";
                this.replyAnswerForm.billMoney = res.data.retData.billMoney;
                this.replyAnswerForm.drwrName = res.data.retData.drwrName;
                this.replyAnswerForm.pyeeName = res.data.retData.pyeeName;
                this.replyAnswerForm.acptName = res.data.retData.acptName;
                this.replyAnswerForm.queryContent = res.data.retData.queryContent;
                this.replyAnswerForm.replyContent = res.data.retData.replyContent;
                this.$refs.replyAnswerDatagrid.dataChange(1);
              });
              this.replyAnswerWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //回复弹窗确定
      replyAnswerFormSubmit() {
        this.replyAnswerForm.remitDt = this.replyAnswerRemitDt;
        this.replyAnswerForm.dueDt = this.replyAnswerDueDt;
        this.$refs["replyAnswerForm"].validate(valid => {
          if (valid) {
            let url = "/pe/upbsInqrep/receiveInquiry/func_reply";
            this.submitFlag = true;
            post(this.replyAnswerForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.replyAnswerWinClose();
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

      //回复弹窗关闭
      replyAnswerWinClose() {
        this.$refs.replyAnswerForm.resetFields();
        this.$refs.replyAnswerForm.id = "";
        this.replyAnswerWin = false;
      },
      //打印查询书
      inquiryPrint() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.queryPrintData("PE031701");
      },
      /**
       * 查询打印数据
       * @param voucherType   打印凭证类型
       */
      queryPrintData(voucherType) {
        let params = { id: this.currentSelectRow.id };
        let url = "/pe/upbsInqrep/receiveInquiry/func_queryRecvQueryRecordById";
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
          if (!!vocherData[i].replyDt) {
            vocherData[i].replyDt = this.$moment(vocherData[i].replyDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
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
