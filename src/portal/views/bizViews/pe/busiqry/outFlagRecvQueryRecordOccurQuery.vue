<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                    <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="queryBookNoLike" :label="$t('m.i.pe.queryBookNoLike')">
                    <h-input v-model="formItem.queryBookNoLike" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="answerBookNoLike" :label="$t('m.i.pe.answerBookNoLike')">
                    <h-input v-model="formItem.answerBookNoLike" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="queryDtRangeStr" :label="$t('m.i.pe.queryDtRangeStr')">
                    <h-date-picker v-model="formItem.queryDtRangeStr" format="yyyy-MM-dd" type="daterange" autoPlacement
                                   placeholder="" showFormat :editable=false @on-change="queryDtRangeStrChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="replyDtRangeStr" :label="$t('m.i.pe.replyDtRangeStr')">
                    <h-date-picker v-model="formItem.replyDtRangeStr" format="yyyy-MM-dd" type="daterange" autoPlacement
                                   placeholder="" showFormat :editable=false @on-change="replyDtRangeStrChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="maxQueryDt" label="" v-show=false>
                    <h-input v-model="formItem.maxQueryDt" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="minQueryDt" label="" v-show=false>
                    <h-input v-model="formItem.minQueryDt" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="maxReplyDt" label="" v-show=false>
                    <h-input v-model="formItem.maxReplyDt" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="minReplyDt" label="" v-show=false>
                    <h-input v-model="formItem.minReplyDt" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pe.sumMoney')">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pe.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            hasPage
            :bindForm="formItem"
            getDataFunc
            @get-data="getOccurData"
            :gridData="occurData"
            showListCkeckBox
            :hasSelect=false
            :rowSelect=true
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <show-hvps-bank :showHvpsBank="showHvpsBank" @showHvpsBankClose="showHvpsBankClose"
                    @showHvpsBankSubmit="showHvpsBankSubmit"></show-hvps-bank>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!-- 机构名称选择弹窗框 -->
    <show-branch :showBranchWin="brchNoWin" title="机构名称" @brchNoChange="brchNoChange" ifcheck="isTrue"
                 :checkStrictly="true" @showBranchWinClose="brchNoWinClose"></show-branch>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "outFlagRecvQueryRecordOccurQuery",
    components: {
      ShowHvpsBank: () => import(/* webpackChunkName: "shcpe/cpes/hvpsbank/showHvpsBank" */`@/views/bizViews/shcpe/cpes/hvpsbank/showHvpsBank`),
      ShowBranch: () => import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
    },
    data() {
      return {
        formItem: {
          custNo: "",
          custName: "",
          billNoLike: "",
          queryAnswerStatus: "",
          isPass: "",
          queryBookNoLike: "",
          answerBookNoLike: "",
          minQueryDt: "",
          maxQueryDt: "",
          minReplyDt: "",
          maxReplyDt: "",
          queryDtRangeStr: "",
          replyDtRangeStr: ""
        },
        columns: [
          {
            type: "selection",
            hiddenCol: false,
            width: 60,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
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
            title:  this.$t("m.i.pc.payFromBankNo"),
            key: "payFromBankNo",
            hiddenCol: false
          },
          {
           title:  this.$t("m.i.pc.queryType"),
            key: "queryType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "UpbsQueryType", params.row.queryType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "queryAnswerStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "UpbsQueryAnswerStatus", params.row.queryAnswerStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title:  this.$t("m.i.pc.queryBookNo"),
            key: "queryBookNo",
            hiddenCol: false
          },
          {
            title:  this.$t("m.i.pc.queryDt"),
            key: "queryDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.queryDt && "" !== params.row.queryDt) {
                let dttm = this.$moment(params.row.queryDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title:  this.$t("m.i.pc.queryContent"),
            key: "queryContent",
            hiddenCol: false
          },
          {
           title:  this.$t("m.i.pc.answerBookNo"),
            key: "answerBookNo",
            hiddenCol: false
          },
          {
            title:  this.$t("m.i.pc.replyDt"),
            key: "replyDt",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              if (null != params.row.replyDt && "" !== params.row.replyDt) {
                let dttm = this.$moment(params.row.replyDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title:  this.$t("m.i.pc.replyContent"),
            key: "replyContent",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.remitDt && "" !== params.row.remitDt) {
                let dttm = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.dueDt && "" !== params.row.dueDt) {
                let dttm = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          }
        ],
        ifShowMore: false,
        showHvpsBank: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        brchNoWin: false,
        BillTypeList: [],
        BillClassList: [],
        RiskStatusList: [],
        dictMap: null,
        isList: [],
        upbsQueryTypeList: [],
        upbsQueryAnswerStatusList: [],
        gridData: null
      };
    },
    mounted() {
      this.getDictListByGroups("CDMedia,DraftTypeCode,RiskStatus,BarterTrustStatus,AcctFlag,Yon,UpbsQueryType,UpbsQueryAnswerStatus").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.RiskStatusList = res.get("RiskStatus");
        this.isList = res.get("Yon");
        this.upbsQueryTypeList = res.get("UpbsQueryType");
        this.upbsQueryAnswerStatusList = res.get("UpbsQueryAnswerStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      queryDtRangeStrChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minQueryDt = arr[0].replace(/-/g, "");
          this.formItem.maxQueryDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minQueryDt = "";
          this.formItem.maxQueryDt = "";
        }
      },
      replyDtRangeStrChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minReplyDt = arr[0].replace(/-/g, "");
          this.formItem.maxReplyDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minReplyDt = "";
          this.formItem.maxReplyDt = "";
        }
      },
      handleSearch() {
        let grid = this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      //重置查询结果
      resetSearch() {
        this.formItem.acceptorBankName = "";
        this.formItem.brchName = "";
        this.formItem.transBrchNos = "";
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
      },
      queryHvpsBank() {
        this.showHvpsBank = true;
      },
      showHvpsBankClose() {
        this.showHvpsBank = false;
      },
      showHvpsBankSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.acceptorBankNo = info.actorBrchBankNo;
        this.formItem.acceptorBankName = info.actorBrchName;
        this.showHvpsBank = false;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },

      getOccurData() {
        let obj = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize
        });
        let url = "/pe/busiqry/outFlagRecvQueryRecordOccurQuery/func_pagingOutFlagRecvQueryRecordOccurQueryList";
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.occurData = res.data.retData;
                this.total = res.data.retData.pageInfo.count;
                this.sumMoney = formatNumber(res.data.retData.pageInfo.sumMoney, 2, ",");
                // 翻页选中复选框
                let dataThis = this.$refs.datagrid;
                let that = dataThis;
                res = res["data"];
                if (res[dataThis.property.responseType][dataThis.property.pageInfo][dataThis.property.total] && res[dataThis.property.responseType][dataThis.property.pageInfo][that.property.total] > 0 && res[dataThis.property.responseType][dataThis.property.rows]) {
                  dataThis.tData = res[dataThis.property.responseType][dataThis.property.rows];
                  for (let i = 0; i < dataThis.selects.length; i++) {
                    if (dataThis.selects[i].pageNo === dataThis.pageInfo.pageNo) {
                      let j = dataThis.tData.findIndex((value, index, arr) => {
                        return value.id === dataThis.selects[i][dataThis.paramId];
                      });
                      dataThis.$set(dataThis.tData[j], "_checked", true);
                    }
                  }
                } else {
                  dataThis.tData = [];
                  dataThis.total = 0;
                }
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },

      //机构弹窗
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.transBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.brchName = brchNames.substring(0, brchNames.length - 1);
        // this.formItem.brchName=info[0].title;
        this.brchNoWin = false;
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "getOutFlagRecvQueryRecordOccurQuery";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/outFlagRecvQueryRecordOccurQuery/func_exportRecvQueryRecord";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this,this.param, field, exportType, exportUrl, options);
      },

    }
  };
</script>

<style scoped>

</style>
