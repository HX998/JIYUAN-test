<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--票据行为 -->
                <common-select v-model="formItem.endorType" :dictList="endorTypeList" :label="$t('m.i.bm.endorType')"
                               prop="endorType" :clearable="false" @on-change="changeEndorType()"></common-select>

                <!--票据包编号 -->
                <common-input v-model="formItem.reverseBillNo" :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo" :maxlength="30"></common-input>

                <!--子票区间 -->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>


                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/bm/ctrct/tradeInfo/func_pagingQueryCanRgstInfo"
                      :bindForm="formItem"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button v-if="formItem.endorType=='BB01'" type="primary" @click="sendRgst()">{{$t("m.i.bm.sendRgst")}}</h-button>
              <h-button type="primary" @click="obtainTradeInfo()">{{$t("m.i.bm.queryTradeInfo")}}</h-button>

            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--登记详情-->
    <trade-info-reg-show @tradeInfoRegShowClose="tradeInfoRegShowClose" :tradeInfoRegShowWin="tradeInfoRegShowWin" :batchParams="batchParams"
        :dictMap="dictMap" ref="tradeInfoRegShow"></trade-info-reg-show>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

  </div>
</template>

<script>
import { post, on, off,formatNumber ,formatBillRange } from "@/api/bizApi/commonUtil";

export default {
  name: "custCorpSign",
  components: {
    tradeInfoRegShow:()=>import(/* webpackChunkName: "bm/ctrct/tradeInfoRegShow" */`@/views/bizViews/bm/ctrct/tradeInfoRegShow`),
  },
  data() {
    return {
      formItem: {
        endorType:"BB01",
        billNo:"",
        minBillRangeStart:"",
        maxBillRangeEnd:"",
        reverseBillNo:"",
      },
      selectData: [],
      tradeInfoRegShowWin:false,
      ifShowMore: false,
      columns: [
        {
          type: "radio",
          title: " ",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          type: "index",
          width: 60,
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key: 'billOrigin',
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = params.row.billNo;
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row);
                }
              }
            }, billNo);
          }
        },
        //子票区间列
        {
          title: this.$t("m.i.billInfo.billRange"),
          align:'center',
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          hiddenCol: false,
          ellipsis: false,
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
          render: (h, params) => {
            let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          hiddenCol: false,
          render: (h, params) => {
            let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
      ],
      dictMap: new Map(),
      endorTypeList:[],
      distTypeList:[],
      tradeModelList:[],
      btnAuth: {},
      showBillInfoWin: false,
      isMustSelect: true,
      hasCommit:true,
      batchParams: {},
      billId:"",
      billRangeStart:"",
      billRangeEnd:"",
    };
  },
  mounted() {
    this.getDictListByGroups("EndorType,BillOrigin,DraftTypeCode,DistTypeCode,PreRelationFlag,TradeModel,InvType,FileDetailStatus,AttTypeCode").then(res => {
      this.distTypeList = res.get("DistTypeCode");
      this.endorTypeList = res.get("EndorType");
      this.tradeModelList = res.get("TradeModel");
      this.batchParams.endorTypeList = this.endorTypeList;
      this.batchParams.fileDetailStatusList = res.get("FileDetailStatus");
      this.dictMap = res.get("map");
    });
  },

  methods: {
    onCurrentChange(currentRow, oldCurrentRow, _index) {
      this.selectData = currentRow;
    },
    onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
      this.selectData = [];
    },

    //表单查询
    handleSearch() {
      this.selectData = [];
      this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
    },
    //重置表单查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
    },

    showBillInfo(row){
      this.billId = row.billId;
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },

    billInfoWinClose() {
      this.showBillInfoWin = false;
    },

    changeEndorType(){
      this.handleSearch();
    },

    tradeInfoRegShowClose(){
      this.batchParams={};
      this.tradeInfoRegShowWin = false;
      this.handleSearch();
    },

    sendRgst(){
      if (this.selectData == null || this.selectData.length === 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        return;
      }
      this.batchParams.listId = this.selectData.id;
      this.batchParams.endorType = this.formItem.endorType;
      this.batchParams.billNo = this.selectData.billNo;
      this.batchParams.billRangeStart = this.selectData.billRangeStart;
      this.batchParams.billRangeEnd = this.selectData.billRangeEnd;
      this.batchParams.title = "登记申请";
      this.batchParams.operType = "OT01";
      this.batchParams.distTypeList = this.distTypeList;
      this.batchParams.endorTypeList = this.endorTypeList;
      this.batchParams.tradeModelList = this.tradeModelList;
      this.tradeInfoRegShowWin = true;
    },
    obtainTradeInfo(){
      if (this.selectData == null || this.selectData.length == 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        return;
      }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: this.$t("请确认是否要进行查询") + "?",
        onOk: () => {
          this.handleObtainTradeInfo();
        }
      });
    },


    handleObtainTradeInfo(){
      let params = { listId: this.selectData.id,endorType:this.formItem.endorType,billNo:this.selectData.billNo,billRangeStart:this.selectData.billRangeStart,billRangeEnd:this.selectData.billRangeEnd,operType:"02"};
      let url = "/bm/ctrct/tradeInfo/func_obtainTradeInfo";
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            let obj = res.data.retData;
            this.handleSearch()
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
  }
};


</script>

<style scoped>

</style>
