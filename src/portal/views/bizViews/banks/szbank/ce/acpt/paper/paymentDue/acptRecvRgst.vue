<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.recvRgstStatus')" prop="ticketRecvStatusList">
                  <h-select v-model="formItem.ticketRecvStatusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in ticketRecvStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoneyByUnit')" prop="billMoneyItem">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.rgstTellerNo')" prop="rgstTellerNo">
                  <h-input v-model="formItem.rgstTellerNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.trackNumber')" prop="courierNo">
                  <h-input v-model="formItem.courierNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="" showTitle>
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.isAcpt')" prop="isAcpt">
                  <h-select v-model="formItem.isAcpt" placeholder="" showTitle>
                    <h-option v-for="item in isAcptList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.payRgstDt')" prop="payRgstDt">
                  <h-date-picker :value="payRgstDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handlePayRgstDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.payRgstStatus')" prop="payRgstStatusList">
                  <h-select v-model="formItem.payRgstStatusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in payRgstStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="showColumns"
            getDataFunc
            @get-data="getTicketRecvRgstData"
            :gridData="TicketRecvRgstData"
            :bindForm="formItem"
            :auto-load="false"
            :hasSelect=false
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryTicketRecvRgstBatch()">
                {{$t("m.i.ce.queryTicketRecvRgstBatch")}}
              </h-button>
              <h-button type="primary" @click="queryTicketRecvRgstBill">
                {{$t("m.i.ce.queryTicketRecvRgstBill")}}
              </h-button>
              <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptRecvRgst",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */ "@/views/bizViews/be/market/rediscount/common/showBranch")
    },
    data() {
      let batchColumns = [
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t("m.i.ce.trackNumber"),
          key: "courierNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.trackCompanyName"),
          key: "courierCompanyName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.ce.recvRgstStatus"),
          key: "ticketRecvStatus",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "TicketRecvStatus", params.row.ticketRecvStatus);
            return h("span", {
              domProps: {
                title: list
              }
            }, list);
          }
        },
        {
          title: this.$t("m.i.ce.totalNumber"),
          key: "billNumber",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.rgstTellerNo"),
          key: "rgstTellerNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.ce.rgstDt"),
          key: "rgstDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.rgstDt == null || params.row.rgstDt === "") {
              return "";
            }
            let date = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.ticketCancelTellerNo"),
          key: "ticketCancelTellerNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.ce.ticketCancelDt"),
          key: "ticketCancelDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.ticketCancelDt == null || params.row.ticketCancelDt === "") {
              return "";
            }
            let date = this.$moment(params.row.ticketCancelDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.ticketRejectTellerNo"),
          key: "ticketRejectTellerNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.ce.rejectDt"),
          key: "rejectDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.rejectDt == null || params.row.rejectDt === "") {
              return "";
            }
            let date = this.$moment(params.row.rejectDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        }

      ];
      return {
        formItem: {
          isAcptList: [],
          payRgstStatusList: [],
          billNo: "",
          busiTypeList: [],
          ticketRecvStatusList: [],
          rgstTellerNo: "",
          courierNo: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          minpPayRgstDt: "",
          maxPayRgstDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          rgstTm: "",
          ticketCancelTellerNo: "",
          ticketCancelTm: "",
          ticketRejectTellerNo: "",
          ticketRejectTm: ""
        },
        showAttachWin: false,
        batchColumns: batchColumns,
        billColumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              } else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, billNo);
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
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.payBankName"),
            key: "drweBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.billMoney"),
            key: "billMoney",
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
            title: this.$t("m.i.ce.trackCompanyName"),
            key: "courierCompanyName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.trackNumber"),
            key: "courierNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.rgstTellerNo"),
            key: "rgstTellerNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.rgstDt"),
            key: "rgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rgstDt == null || params.row.rgstDt === "") {
                return "";
              }
              let date = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.rgstTm"),
            key: "rgstTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rgstTm == null || params.row.rgstTm === "") {
                return "";
              }
              let rgstTm = params.row.rgstTm.toString();
              if (params.row.rgstTm.toString().length < 6) {
                for(let i=0; i<(6-params.row.rgstTm.toString().length); i++) {
                  rgstTm = "0" + rgstTm;
                }
              }
              let date = this.$moment(rgstTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.recvRgstStatus"),
            key: "ticketRecvStatus",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TicketRecvStatus", params.row.ticketRecvStatus);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.ce.payRgstStatus"),
            key: "payRgstStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "PayRgstStatus", params.row.payRgstStatus);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "TicketRecvBusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.isAcpt"),
            key: "isAcpt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "IsAcpt", params.row.isAcpt);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.payRgstTellerNo"),
            key: "payRgstTellerNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.payRgstDt"),
            key: "payRgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.payRgstDt == null || params.row.payRgstDt === "") {
                return "";
              }
              let date = this.$moment(params.row.payRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.payRgstTm"),
            key: "payRgstTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.payRgstTm == null || params.row.payRgstTm === "") {
                return "";
              }
              let payRgstTm = params.row.payRgstTm.toString();
              if (params.row.payRgstTm.toString().length < 6) {
                for(let i=0; i<(6-params.row.payRgstTm.toString().length); i++) {
                  payRgstTm = "0" + payRgstTm;
                }
              }
              let date = this.$moment(payRgstTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.ticketCancelTellerNo"),
            key: "ticketCancelTellerNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.ticketCancelDt"),
            key: "ticketCancelDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.ticketCancelDt == null || params.row.ticketCancelDt === "") {
                return "";
              }
              let date = this.$moment(params.row.ticketCancelDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.ticketCancelTm"),
            key: "ticketCancelTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.ticketCancelTm == null || params.row.ticketCancelTm === "") {
                return "";
              }
              let ticketCancelTm = params.row.ticketCancelTm.toString();
              if (params.row.ticketCancelTm.toString().length < 6) {
                for(let i=0; i<(6-params.row.ticketCancelTm.toString().length); i++) {
                  ticketCancelTm = "0" + ticketCancelTm;
                }
              }
              let date = this.$moment(ticketCancelTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.ticketRejectTellerNo"),
            key: "ticketRejectTellerNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.rejectDt"),
            key: "rejectDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rejectDt == null || params.row.rejectDt === "") {
                return "";
              }
              let date = this.$moment(params.row.rejectDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.rejectTm"),
            key: "ticketRejectTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.ticketRejectTm == null || params.row.ticketRejectTm === "") {
                return "";
              }
              let ticketRejectTm = params.row.ticketRejectTm.toString();
              if (params.row.ticketRejectTm.toString().length < 6) {
                for(let i=0; i<(6-params.row.ticketRejectTm.toString().length); i++) {
                  ticketRejectTm = "0" + ticketRejectTm;
                }
              }
              let date = this.$moment(ticketRejectTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.backRejectReason"),
            key: "rejectReason",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.remark"),
            key: "remark",
            hiddenCol: false,
            sortable: true
          }
        ],
        rgstDtHisWin: false,
        rgstDtHisForm: {
          courierNo: ""
        },
        ticketRecvStatusList: [],
        isAcptList: [],
        payRgstStatusList: [],
        billNo: "",
        remitDt: [],
        dueDt: [],
        rgstTellerNo: "",
        courierNo: "",
        payRgstDt: [],
        payRgstTm: [],
        ticketCancelDt: [],
        ticketCancelTm: [],
        rejectDt: [],
        ticketRejectTm: [],
        ticketRecvStatus: "",
        busiTypeList: [],
        dictMap: new Map(),
        billId: "",
        //是否显示更多查询项
        ifShowMore: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        showBillInfoWin: false,
        //showBranchWin: false,
        queryUrl: "/banks/szbank/ce/acpt/paper/paymentDue/acptRecvRgst/func_pagingQueryBatchList",
        showColumns: this.deepClone(batchColumns),
        param: null,
        rows: null,
        TicketRecvRgstData: { rows: [], total: 1 }
      };
    },
    mounted() {
      this.getTicketRecvRgstData();
      this.getDictListByGroups("TicketRecvStatus,IsAcpt,PayRgstStatus,TicketRecvBusiType").then(res => {
        this.ticketRecvStatusList = res.get("TicketRecvStatus");
        this.isAcptList = res.get("IsAcpt");
        this.payRgstStatusList = res.get("PayRgstStatus");
        this.busiTypeList = res.get("TicketRecvBusiType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      getTicketRecvRgstData() {
        let obj = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize
        });
        let url = this.queryUrl;
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.TicketRecvRgstData = res.data.retData;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      }
      ,
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.billNo = "";
        this.formItem.ticketRecvStatusList = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minpPayRgstDt = "";
        this.formItem.maxPayRgstDt = "";
        this.formItem.rgstTellerNo = "";
        this.formItem.courierNo = "";
        this.formItem.busiType = "";
        this.formItem.isAcpt = "";
        this.formItem.paymentDt = [];
        this.formItem.payRgstStatusList = [];
        this.formItem.payRgstDt = [];
        this.remitDt = [];
        this.dueDt = [];
        this.payRgstDt = [];
      },
      //日期选择框
      handleRemitDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handlePayRgstDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minPayRgstDt = arr[0].replace(/-/g, "");
          this.formItem.maxPayRgstDt = arr[1].replace(/-/g, "");
          this.payRgstDt = [arr[0], arr[1]];
        } else {
          this.formItem.minPayRgstDt = "";
          this.formItem.maxPayRgstDt = "";
          this.PayRgstDt = [];
        }
      },
      handleDateChange(value) {
        this.formItem.payRgstDt = value.replace(/-/g, "");
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      queryTicketRecvRgstBatch() {
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.pageInfo.pageNo = 1;
        this.queryUrl = "/banks/szbank/ce/acpt/paper/paymentDue/acptRecvRgst/func_pagingQueryBatchList";
        this.showColumns = this.deepClone(this.batchColumns);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      queryTicketRecvRgstBill() {
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.pageInfo.pageNo = 1;
        this.queryUrl = "/banks/szbank/ce/acpt/paper/paymentDue/acptRecvRgst/func_pagingQueryBillList";
        this.$nextTick(() => {
          this.showColumns = this.deepClone(this.billColumns);
          this.$refs.datagrid.createShowCol(this.billColumns);
        });
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      }
    }
  };

</script>

<style scoped>

</style>
