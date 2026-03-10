<template>
  <div>
    <div class="cppay" v-if="tempCppayVue">
      <div class="cppay-logo">
        <img src="@/assets/bopp/cppay.png"/>
      </div>
      <div class="cppay-order-account">
        <ul class="clearfix">
          <li>
            <p class="cppay-info-title">订单详情</p>
            <div class="cppay-info-content">
              <p>
                <span>平台名称</span>
                <strong>{{this.formItem.platformName}}</strong>
              </p>
              <p>
                <span>订单交易金额</span>
                <strong>{{formatNumber(this.formItem.payOrderAmt)}}元</strong>
              </p>
              <p>
                <span>订单编号</span>
                <strong>{{this.formItem.payOrderNo}}</strong>
              </p>
              <p>
                <span>订单描述</span>
                <strong>{{this.formItem.payOrderDesc}}</strong>
              </p>
            </div>
          </li>
          <li>
            <p class="cppay-info-title">付款人账户信息</p>
            <div class="cppay-info-content">
              <p>
                <span>付款人名称</span>
                <strong>{{this.formItem.drweEnterpriseName}}</strong>
              </p>
              <p>
                <span>行名</span>
                <strong>{{this.formItem.drweBankName}}</strong>
              </p>
              <p>
                <span>行号</span>
                <strong>{{this.formItem.drweBankNo}}</strong>
              </p>
              <p>
                <span>账号</span>
                <strong>{{this.formItem.drweAcctNo}}</strong>
              </p>
            </div>
          </li>
          <li>
            <p class="cppay-info-title">收款人账户信息</p>
            <div class="cppay-info-content">
              <p>
                <span>收款人名称</span>
                <strong>{{this.formItem.pyeeEnterpriseName}}</strong>
              </p>
              <p>
                <span>行名</span>
                <strong>{{this.formItem.pyeeBankName}}</strong>
              </p>
              <p>
                <span>行号</span>
                <strong>{{this.formItem.pyeeBankNo}}</strong>
              </p>
              <p>
                <span>账号</span>
                <strong>{{this.formItem.pyeeAcctNo}}</strong>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="cppay-tab">
        <h-tabs>
          <h-tab-pane label="新签发票据支付">
            <div class="cppay-tab-btn">
              <h-button type="primary" @click="commitSkipApply('PM01')" :disabled="jumpBack">提交</h-button>
              <h-button type="primary" @click="backToMain()">返回</h-button>
            </div>
          </h-tab-pane>
          <h-tab-pane label="已持有票据支付">
            <div class="cppay-inner-tab">
              <h-tabs type="card" :animated="false" :value="tabPane" @on-click="clickTabs">
                <h-tab-pane label="票据单张录入" name="billImportSignalTab">
                  <div class="cppay-tab-table">
                    <p class="cppay-amount">总计金额：<span>{{formatNumber(totalAmount)}}</span></p>
                    <h-table
                      :columns="columns"
                      :data="data"
                      border
                    ></h-table>
                    <p class="cppay-remind" v-if="jumpBack">{{content}}</p>
                    <div v-else>
                      <br/>
                      <h-form :model="addBillForm" :label-width="115" ref="addBillForm" cols="2"
                              class="h-form-search cppay-form-item" onlyBlurRequire>
                        <bill-no v-model="addBillForm.billNo" prop="billNo" billClass="ME02" title="票据号码：" required
                                 placeholder="请输入票据号码" type="int"></bill-no>
                        <common-type-field v-model="addBillForm.billMoney" label="票据金额：" :append="true" appendTitle="元"
                                           prop="billMoney" :bigTips="false" :integerNum="16"
                                           required placeholder="请输入票据金额"></common-type-field>
                        <common-form-icon name="addition_fill" @on-click="addition" size="24"
                                          color="#33b372"></common-form-icon>
                      </h-form>
                    </div>
                  </div>
                </h-tab-pane>
                <h-tab-pane label="票据批量导入" name="billImportListTab">
                  <div class="cppay-tab-table">
                    <p class="cppay-amount">总计金额：<span>{{formatNumber(totalAmount)}}</span></p>
                    <h-table
                      :columns="columns"
                      :data="data"
                      border
                    ></h-table>
                    <p class="cppay-remind" v-if="jumpBack">{{content}}</p>
                    <div v-else>
                      <br/>
                      <div class="h-btn-list">
                        <h-button icon="t-b-download" class="h-icon-btn" @click="templateDownload">模板下载</h-button>
                        <h-button icon="upload1" class="h-icon-btn" @click="batchImport">上传清单</h-button>
                        <h-button icon="trash-a" class="h-icon-btn" @click="emptyList">清空列表</h-button>
                      </div>
                    </div>
                  </div>
                </h-tab-pane>
                <h-tab-pane label="票据选择" name="selectBill"></h-tab-pane>
              </h-tabs>
            </div>
            <div class="cppay-tab-btn">
              <h-button type="primary" @click="commitWithBill()" :disabled="jumpBack">提交</h-button>
              <h-button type="primary" @click="backToMain()">返回</h-button>
            </div>
          </h-tab-pane>
        </h-tabs>
      </div>
    </div>
    <upload title="上传清单" :importWin="importWin" :fileParams="fileParams" @uploadSuccess="uploadSuccess" @importWinClose="importWinClose" ref="upload"></upload>
  </div>
</template>
<script>
  import {post, on, off, formatNumber, getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "cppay",
    data() {
      return {
        formItem: {
          payFlowNo: "",
          platformName: "",
          payOrderAmt: "",
          payOrderNo: "",
          payOrderDesc: "",
          drweEnterpriseName: "",
          drweBankNo: "",
          drweAcctNo: "",
          pyeeEnterpriseName: "",
          pyeeBankNo: "",
          pyeeAcctNo: "",
        },
        addBillForm: {
          billNo: "",
          billMoney: "",
        },
        fileParams: {
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pay/cashier/cppay/func_loadExcelData",   //导入excel数据解析接口
        },
        jumpBack: false,
        importWin: false,
        payFlowUpdateDtTm: "",
        totalAmount: "0",
        columns: [
          {
            title: "票据号码",
            key: "billNo",
            align: "center",
          },
          {
            title: "票据金额",
            key: "billMoney",
            align: "center",
            render: (h, params) => {
              if (params.row.billNo) {
                return h("p", formatNumber(params.row.billMoney, 2, ",") + "元");
              }else {
                return "";
              }
            }
          },
          {
            title: "操作",
            key: "operating",
            align: "center",
            render: (h, params) => {
              if (params.row.billNo && !this.jumpBack) {
                return h("a", [h("Button", {
                  props: {type: "text", size: "small", icon: "error"},
                  style: {color: 'red'},
                  on: {
                    'click': () => {
                      this.data.splice(params.index, 1);
                      this.totalAmount = Number(this.totalAmount) - Number(params.row.billMoney);
                      if(this.data.length === 0){
                        this.data = this.initData;
                      }
                    }
                  },
                }, "删除")]);
              } else {
                return "";
              }
            }
          }
        ],
        data: [
          {
            billNo: "",
            billMoney: "",
            operating: "",
          }
        ],
        initData: [
          {
            billNo: "",
            billMoney: "",
            operating: "",
          }
        ],
        billNoList: [],
        tabPane: "billImportSignalTab",
        content: "5秒后自动跳入订单平台",
        totalTime: 5,
      };
    },
    computed: {
      tempCppayVue: {
        get() {
          return this.cppayVue;
        },
        set() {
        }
      }
    },
    props: {
      cppayVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      cppayParams: {
        type: Object,
        default: {
          payInfoId: "",
        }
      }
    },
    watch: {
      cppayVue(val) {
        if (val) {
          this.initFormItem();
        }
      },
      jumpBack(val){
        if (val) {
          this.countDown();
        }
      }
    },
    methods: {
      initFormItem() {
        let params = {id: this.cppayParams.payInfoId};
        let url = "/pay/cashier/cppay/func_queryOrderPayInfoDtoByPage";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formItem = res.data.retData;
              if (this.formItem.payFlowUpdateDtTm) {
                this.payFlowUpdateDtTm = this.$moment(this.formItem.payFlowUpdateDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      backToMain() {
        this.initList();
        this.jumpBack = false;
        this.$emit("backToMain", "");
      },
      initList(){
        this.data = this.initData;
        this.billNoList = [];
        this.totalAmount = "0";
      },
      formatNumber(val) {
        if(!val || val === "0" || val === 0){
          return "0";
        }
        return formatNumber(val, 2, ',')
      },
      commitSkipApply(type) {
        let url = "/pay/cashier/cppay/func_skipAppl";
        post({id: this.cppayParams.payInfoId, operType: type}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.skipResp = res.data.retData;
              if (this.skipResp.successFlag) {
                this.$msgTip.info(this, {info: "ODPS返回跳转请求，URL：" + this.skipResp.url});
                this.jumpBack = true;
              } else {
                this.$msgTip.info(this, {info: "ODPS返回跳转请求失败，失败原因：" + this.skipResp.prcMsg});
              }
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      addition() {
        this.$refs["addBillForm"].validate(valid => {
          if (valid) {
            let point = this.billNoList.indexOf(this.addBillForm.billNo);
            if (point >= 0) {
              return;
            }
            this.addBillToData(this.addBillForm);
            /*this.checkBillFunc(this, res=> {
              this.addBillToData();
            });*/
          }
        });
      },
      checkBillFunc(_this, callBack){
        let url = "/pay/cashier/cppay/func_addBillCheck";
        post({id: _this.cppayParams.payInfoId, billNo: _this.addBillForm.billNo, billMoney: _this.addBillForm.billMoney}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              callBack();
            } else {
              _this.$msgTip.error(_this, {info: msg});
            }
          } else {
            _this.$msgTip.error(_this, {info: _this.$t("m.i.common.netError")});
          }
        });
      },
      addBillToData(form){
        let point = this.billNoList.indexOf(form.billNo);
        if (point >= 0) {
          return;
        }
        if (this.data[0].billNo === "") {
          this.data = [];
        }
        let rowData = {};
        rowData.billNo = form.billNo;
        rowData.billMoney = form.billMoney;
        this.totalAmount = Number(this.totalAmount) + Number(form.billMoney);
        this.billNoList.push(form.billNo);
        this.data.push(rowData);
        form.billNo = "";
        form.billMoney = "";
      },
      commitWithBill(){
        if(this.tabPane === "selectBill"){
          this.commitSkipApply('PM02');
        }else{
          this.lockBillFunc(this, res => {
            this.$hMsgBox.confirm({
              title:"询问?",
              content:"是否需要提交跳转申请",
              onOk: () => {
                this.commitSkipApply('PM03');
              },
              onCancel: () => {
                this.jumpBack = true;
              }
            });
          })
        }
      },
      templateDownload(){
        let url = window.LOCAL_CONFIG.API_HOME + "/pay/cashier/cppay/func_templateDownload";
        let form = document.createElement('form');
        form.setAttribute("id","formId");
        form.setAttribute('action',url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      batchImport(){
        this.importWin = true;
      },
      importWinClose(){
        this.importWin = false;
      },
      uploadSuccess(response, file){
        let retCode = response.retCode;
        if (retCode === "000000") {
          let list = response.retData;
          for(let i = 0 ; i < list.length ; i++){
            this.addBillToData(list[i]);
          }
          this.importWinClose();
        } else {
          this.$refs.upload.uploadSuccessErrorFunc();
          this.$msgTip.error(this, { info: `<div>${"文件上传失败：<br/>" + response.retMsg}</div>` });
        }

      },
      emptyList(){
        this.initList();
      },
      clickTabs(val){
        this.tabPane = val;
      },
      lockBillFunc(_this, callBack){
        let url = "/pay/cashier/cppay/func_lockUnLockBill";
        post({payFlowNo: _this.formItem.payFlowNo, payBillInfoDtoList: _this.data, sendBrchType: "FIT01", paymentOptionType: "POT01"}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              callBack();
            } else {
              _this.$msgTip.error(_this, {info: msg});
            }
          } else {
            _this.$msgTip.error(_this, {info: _this.$t("m.i.common.netError")});
          }
        });
      },
      countDown() {
        let clock = window.setInterval(() => {
          this.totalTime--;
          this.content = this.totalTime + '秒后自动跳入订单平台';
          if (this.totalTime <= 0) {     //当倒计时小于等于0时清除定时器
            window.clearInterval(clock)
            this.backToMain();
            this.totalTime = 5;
            this.content = '5秒后自动跳入订单平台';
          }
        },1000)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .cppay {
    background: #fff;
    padding: 20px 40px 50px;

    .cppay-order-account {
      margin-top: 40px;
      padding-bottom: 50px;

      ul {
        margin-left: -20px;
      }

      li {
        width: 33%;
        float: left;
        padding-left: 20px;

        &:nth-child(2) {
          width: 34%;
        }
      }

      .cppay-info-title {
        font-size: 18px;
        color: #0D6EB8;
        line-height: 20px;
        margin-bottom: 15px;
        font-weight: bold;
      }

      .cppay-info-content {
        background: #FAFAFA;
        border-radius: 2px;
        font-size: 16px;
        padding: 15px 20px 0;
        height: 240px;
        overflow: hidden;

        p {
          height: 48px;
          overflow: hidden;
          margin-top: 8px;

          span {
            float: left;
            color: #999;
            width: 40%;
          }

          strong {
            float: right;
            color: #333;
            width: 60%;
            text-align: right;
            font-weight: normal;
            line-height: 20px;
          }
        }
      }
    }

    .h-tabs-nav {
      .h-tabs-tab {
        font-size: 24px;
        font-weight: bold;
        color: #666666;

        &:hover {
          color: #0F71BC;
        }

        padding: 8px 16px 20px;
      }

      .h-tabs-tab-active {
        color: #0F71BC;
      }
    }

    .h-tabs-ink-bar {
      height: 3px;
      width: 90px !important;
      left: 50px;

      &:before {
        position: absolute;
        content: '';
        border-top: 8px transparent dashed;
        border-left: 7px transparent dashed;
        border-right: 7px transparent dashed;
        border-bottom: 8px #0F71BC solid;
        z-index: 9999;
        top: -15px;
        left: 40px;
      }
    }

    .h-tabs-bar {
      margin-bottom: 0;
    }

    .cppay-inner-tab {
      border: 1px solid #D9D9D9;
      margin-top: 34px;

      .h-tabs.h-tabs-card > .h-tabs-bar .h-tabs-nav-container,
      .h-tabs.h-tabs-card-top > .h-tabs-bar-top .h-tabs-nav-container {
        height: 57px;
        background: #FAFAFA;
        border-bottom: 1px solid #D9D9D9;
      }

      .h-tabs.h-tabs-card > .h-tabs-bar .h-tabs-tab,
      .h-tabs.h-tabs-card-top > .h-tabs-bar-top .h-tabs-tab {
        border-left: none;
        margin: 0;
        font-size: 18px;
        font-weight: normal;
        width: 160px;
        height: 57px;
        padding: 0;
        text-align: center;
        line-height: 57px;
        border-radius: 0;
        border-top: 1px solid transparent;
        border-bottom: 1px solid #D9D9D9;
        border-right: 1px solid #D9D9D9;
        background: #FAFAFA;
      }

      .h-tabs.h-tabs-card > .h-tabs-bar .h-tabs-tab-active {
        background: #fff;
        border-bottom: none;
        border-top: 1px solid #0F71BC;
      }

      .h-tabs .h-tabs-tabpane {
        padding-bottom: 80px;
      }
    }

    .cppay-tab-table {
      padding: 20px 262px 0 30px;

      .h-table th, .h-table td {
        height: 40px;
        text-align: center;
        font-size: 16px;
      }

      .cppay-amount {
        height: 30px;
        line-height: 30px;
        text-align: right;
        font-size: 14px;
        color: #999999;

        span {
          color: #0F71BC;
        }
      }

      .cppay-remind {
        font-size: 14px;
        color: #F14C5D;
        margin-top: 5px;
      }

      .cppay-form-item {
        width: 100%;
      }
    }

    .cppay-tab-btn {
      text-align: center;
      margin-top: 33px;

      .h-btn {
        width: 124px;
        height: 40px;
        border-radius: 4px;
        margin: 0 13px;
        font-size: 18px;
      }
    }

    .h-btn-list{
      height: 46px;

      .h-icon-btn{
        color:#037df3;
        border: 1px solid #037df3;
        margin-right: 10px;
      }
    }
  }
</style>
