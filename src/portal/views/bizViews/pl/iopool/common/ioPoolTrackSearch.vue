<!--入池/出池跟踪查询明细-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo" :validRules="billNoRule">
                  <h-input v-model="formItem.likeBillNo" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
                  <h-typefield type="money" v-model="formItem.minBillMoney" :maxlength="20"
                               placeholder="" bigTips divided></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
                  <h-typefield type="money" v-model="formItem.maxBillMoney" :maxlength="20"
                               placeholder="" bigTips divided></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <io-pool-batch-detail :batchDetailParams="ioPoolBillParams" ref="ioPoolBatchDetail"></io-pool-batch-detail>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            :url="dataUrl"
            :bindForm="formItem"
            :rowSelect="true"
            :auto-load="false"
            :has-select="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="ioPoolBillPrint()">{{$t('m.i.pl.confirmAddPrint')}}</h-button>
              <h-button type="primary" @click="replyResult()" v-if="ioPoolBillParams.accountType === 'inPool' && ioPoolBillParams.billClass === 'ME01'">
                {{$t('m.i.pl.replyResult')}}
              </h-button>
              <h-button type="ghost" @click="returnMain">{{$t('m.i.pl.return')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
    <!-- 回复弹出框 -->
    <h-msg-box v-model="replyResultWin" width="800" @on-close="replyResultWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false" @on-maximize="onMaximize" top="10">
      <p slot="header">
        <span>查复结果</span>
      </p>
      <h-datagrid :columns="replyResultColumns"
                  highlight-row
                  :auto-load="false"
                  :url="ioPoolBillParams.replyResultUrl"
                  :bindForm="replyResultFormItem"
                  ref="replyResultDatagrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="replyResultWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "ioPoolTrackSearch",
    components: {

    },
    data() {
      return {
        dataUrl : "",
        dueDt : [],
        remitDt : [],
        formItem : {
          batchId: "",
          billClass: "",
          likeBillNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          minRemitDt: "",
          maxRemitDt: ""
        },
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        impawnRgstStatus : {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.impawnRgstStatus == null || params.row.impawnRgstStatus === "") {
              let flowStatusName = params.row.flowStatusName;
              return h("span", flowStatusName);
            } else {
              let impawnRgstStatus = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "ImpawnRgstStatus", params.row.impawnRgstStatus);
              return h("span", impawnRgstStatus + "(" + params.row.flowStatusName + ")");
            }
          }
        },
        unimpawnRgstStatus : {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.unimpawnRgstStatus == null || params.row.unimpawnRgstStatus === "") {
              let flowStatusName = params.row.flowStatusName;
              return h("span", flowStatusName);
            } else {
              let unimpawnRgstStatus = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "ImpawnRgstStatus", params.row.unimpawnRgstStatus);
              return h("span", unimpawnRgstStatus + "(" + params.row.flowStatusName + ")");
            }
          }
        },
        columns : [],
        billManagerColumns : [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.impawnRgstStatus == null || params.row.impawnRgstStatus === "") {
                let flowStatusName = params.row.flowStatusName;
                return h("span", flowStatusName);
              } else {
                let impawnRgstStatus = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "ImpawnRgstStatus", params.row.impawnRgstStatus);
                return h("span", impawnRgstStatus + "(" + params.row.flowStatusName + ")");
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            ellipsis: false,
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
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
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
            ellipsis: false,
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
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankAddr"),
            key: "drweBankAddr",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        eOutPoolColumns : [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.impawnRgstStatus == null || params.row.impawnRgstStatus === "") {
                let flowStatusName = params.row.flowStatusName;
                return h("span", flowStatusName);
              } else {
                let impawnRgstStatus = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "ImpawnRgstStatus", params.row.impawnRgstStatus);
                return h("span", impawnRgstStatus + "(" + params.row.flowStatusName + ")");
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            ellipsis: false,
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
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
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
            ellipsis: false,
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
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectList : [],
        //是否显示更多查询项
        ifShowMore : false,
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        replyResultWin : false,
        replyResultFormItem : {
          billNo: "",
          listId : ""
        },
        replyResultColumns : [
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
            hiddenCol: false,
            sortable: true,
              render: (h, params) => {
                  let info = "", type = "";
                  if (!!params.row.billId) {
                      info = params.row.billId;
                      type = "billId";
                  } else {
                      info = params.row.billNo;
                      type = "billNo";
                  }
                  return h("a", {
                      on: {
                          click: () => {
                              this.showBillInfo(info, type);
                          }
                      }
                  }, params.row.billNo);
              }
          },
          {
            title: this.$t("m.i.pl.queryAnswerStatus"),
            key: "queryAnswerStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "UpbsQueryAnswerStatus", params.row.queryAnswerStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.queryDt"),
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
            key: "queryContent",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.replyDt"),
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
            key: "replyContent",
            hiddenCol: false
          }
        ],
      };
    },
    props: {
      billManagerVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      ioPoolBillParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          batchId: "",
          billClass: "",
          accountType: "",    //区分入池和出池
          custName: "",
          custAcctNo: "",
          dataUrl: "",          //表格明细对应Url
          replyResultUrl: "",    //查复结果对应Url
          batchInfoUrl: ""       //查询批次信息对应Url
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
    mounted() {
    },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.formItem.batchId = this.ioPoolBillParams.batchId;
          this.formItem.billClass = this.ioPoolBillParams.billClass;
          this.dataUrl = this.ioPoolBillParams.dataUrl;
          this.$nextTick(() => {
            if (this.ioPoolBillParams.accountType === "inPool") {
              this.billManagerColumns.splice(4, 1, this.impawnRgstStatus);
              this.columns = this.deepClone(this.billManagerColumns);
            } else {
              if (this.ioPoolBillParams.billClass === "ME02") {
                this.eOutPoolColumns.splice(4, 1, this.unimpawnRgstStatus);
                this.columns = this.deepClone(this.eOutPoolColumns);
              } else {
                this.billManagerColumns.splice(4, 1, this.unimpawnRgstStatus);
                this.columns = this.deepClone(this.billManagerColumns);
              }
            }
            this.$refs.datagrid.createShowCol(this.columns);
            this.handleSearch();
          });
        }
      }
    },
    methods: {
      handleDueDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handleRemitDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.replyResultDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //表单查询
      handleSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        this.formItem.minDueDt = this.formItem.minDueDt.toString().replace(/-/g, "");
        this.formItem.maxDueDt = this.formItem.maxDueDt.toString().replace(/-/g, "");
        this.formItem.minRemitDt = this.formItem.minRemitDt.toString().replace(/-/g, "");
        this.formItem.maxRemitDt = this.formItem.maxRemitDt.toString().replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
        this.$refs.ioPoolBatchDetail.getIoPoolBatchInfo();
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.likeBillNo = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.dueDt = [];
        this.remitDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
      },
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },
      //入池/出池确认书补打
      ioPoolBillPrint() {
        let list = this.$refs.datagrid.selectIds;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.assemblePrsttnBillParams();
      },
      assemblePrsttnBillParams() {
        let vocherData = this.$refs.datagrid.selects;
        let bodyStr = "";
        for (let i = 0; i < vocherData.length; i++) {
          let printData = {};
          printData.billNo = vocherData[i].billNo;
          let flowStatusName = !!vocherData[i].flowStatusName ? vocherData[i].flowStatusName : "";
          if (this.ioPoolBillParams.accountType === "inPool") {
            if (!!vocherData[i].impawnRgstStatus) {
              let impawnRgstStatus = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "ImpawnRgstStatus", vocherData[i].impawnRgstStatus);
              flowStatusName = impawnRgstStatus + "(" + flowStatusName + ")";
            }
          } else {
            if (!!vocherData[i].unimpawnRgstStatus) {
              let unimpawnRgstStatus = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "ImpawnRgstStatus", vocherData[i].unimpawnRgstStatus);
              flowStatusName = unimpawnRgstStatus + "(" + flowStatusName + ")";
            }
          }
          printData.flowStatusName = flowStatusName;
          printData.billType = !!vocherData[i].billType ? this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "DraftTypeCode", vocherData[i].billType) : "";
          printData.remitDt = !!vocherData[i].remitDt ? this.$moment(vocherData[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
          printData.dueDt = !!vocherData[i].dueDt ? this.$moment(vocherData[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
          printData.billMoney = formatNumber(vocherData[i].billMoney, 2, ",");
          printData.drwrName = vocherData[i].drwrName;
          printData.drwrAcctNo = vocherData[i].drwrAcctNo;
          printData.pyeeName = vocherData[i].pyeeName;
          printData.acptName = vocherData[i].acptName;
          printData.pyeeAcctNo = vocherData[i].pyeeAcctNo;
          printData.flowNo = vocherData[i].acctFlowId;
          printData.printObj = JSON.stringify(vocherData[i]);

          bodyStr += "<tr>";
          bodyStr += "<td class='ta-c'>" + (1 + i) + "</td>";
          bodyStr += "<td>" + printData.billNo + "</td>";
          bodyStr += "<td>" + printData.flowStatusName + "</td>";
          bodyStr += "<td>" + printData.billType + "</td>";
          bodyStr += "<td>" + printData.remitDt + "</td>";
          bodyStr += "<td>" + printData.dueDt + "</td>";
          bodyStr += "<td>" + printData.billMoney + "</td>";
          bodyStr += "<td>" + printData.drwrName + "</td>";
          bodyStr += "<td>" + printData.drwrAcctNo + "</td>";
          bodyStr += "<td>" + printData.pyeeName + "</td>";
          bodyStr += "<td>" + printData.acptName + "</td>";
          bodyStr += "</tr>";
        }
        let info = this.ioPoolBillParams.accountType === "inPool" ? "入池：√" : "出池：√";
        let headHtml = `<div style="text-align:center;" ref="headHtml">
          <div style="text-align:center;font-size:18px;font-weight:bold;">票据池确认清单</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">${info}</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户名称：${this.ioPoolBillParams.custName}</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户账号：${this.ioPoolBillParams.custAcctNo}</div>
        </div>`;
        let footerHtml = `<div style="font-size:14px;font-weight:bold;display:-webkit-box;display:flex;justify-content:flex-end;">
          <label style="padding-right:20%">收款行:</label>
          <label style="padding-right:20%">客户:</label>
        </div>`;
        let bodyHtml = `<div class="list-table-box"><table class="list-table">
          <thead>
            <tr>
              <th class="ta-c"><b>序号</b></th>
              <th>票据号码</th>
              <th>流程状态</th>
              <th>票据种类</th>
              <th>出票日期</th>
              <th>汇票到期日</th>
              <th>票据金额</th>
              <th>出票人全称</th>
              <th>出票人账号</th>
              <th>收款人全称</th>
              <th>承兑人全称</th>
            </tr>
          </thead>
          <tbody>${bodyStr}</tbody>
        </table>
      </div>`;
        this.$print.printListHtm(this, headHtml, bodyHtml, {
          bodyTop: "20%", bodyLeft: "1%", bodyWidth: "99%", bodyHeight: "75%"
        }, footerHtml);
      },
      //查复结果
      replyResult() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 1) {
          this.replyResultFormItem.billNo = list[0].billNo;
          this.replyResultFormItem.listId = list[0].id;
          this.replyResultWin = true;
          this.$nextTick(() => {
            this.$refs.replyResultDatagrid.dataChange(1);
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      replyResultWinClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.replyResultWin = false;
      },
      //返回主页面
      returnMain() {
        this.resetSearch();
        this.$emit("returnTrackSearchMain", "");
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
