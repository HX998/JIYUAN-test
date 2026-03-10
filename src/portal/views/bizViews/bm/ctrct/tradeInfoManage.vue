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
                               prop="endorType" ></common-select>

                <!--票据包编号 -->
                <common-input v-model="formItem.billNoLike" :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike" :maxlength="30"></common-input>

                <!--子票区间 -->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>

<!--                <common-select v-model="formItem.billClass" :label="$t('m.i.billInfo.billClass')" prop="billClass" :dictList="billClassList"></common-select>-->

                <common-input v-model="formItem.buyerNameLike" :label="$t('m.i.bm.tradeBuyerName')" prop="buyerNameLike"></common-input>

                <common-input v-model="formItem.sellerNameLike" :label="$t('m.i.bm.tradeSellerName')" prop="sellerNameLike"></common-input>

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
                      url="/bm/ctrct/tradeInfoManage/func_pagingQueryTradeInfoManage"
                      :bindForm="formItem"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="registManage()">{{$t("m.i.bm.registManage")}}</h-button>
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
  name: "tradeInfoManage",
  components: {
    tradeInfoRegShow:()=>import(/* webpackChunkName: "bm/ctrct/tradeInfoRegShow" */`@/views/bizViews/bm/ctrct/tradeInfoRegShow`),
  },
  data() {
    return {
      formItem: {
        endorType:"",
        billNoLike:"",
        minBillRangeStart:"",
        maxBillRangeEnd:"",
        billClass:"",
        buyerNameLike:"",
        sellerNameLike:"",
      },
      selectData: [],
      ifShowMore: false,
      isShowBotton : false,
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
          title: this.$t("m.i.bm.endorType"),
          key: 'endorType',
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "EndorType", params.row.endorType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
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
          sortable: true,
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
          title: this.$t("m.i.billInfo.billClass"),
          key: "billClass",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.bm.tradeBuyerName"),
          key: "buyerName",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.bm.tradeBuyerAcctNo"),
          key: "buyAcctNo",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.bm.tradeSellerName"),
          key: "sellerName",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.bm.tradeSellerAcctNo"),
          key: "sellerAcctNo",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.bm.invoiceNum"),
          key: "invoiceNum",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.bm.ctrctNum"),
          key: "ctrctNum",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.bm.otherVoucherNum"),
          key: "otherVoucherNum",
          hiddenCol: false,
        }
      ],
      dictMap: new Map(),
      billClassList:[],
      endorTypeList:[],
      tradeModelList:[],
      distTypeList:[],
      currentSelectRow: null,
      tradeInfoRegShowWin:false,
      showBillInfoWin: false,
      billId:"",
      billRangeStart:"",
      billRangeEnd:"",
      batchParams: {},
    };
  },
  mounted() {
    this.getDictListByGroups("EndorType,BillOrigin,DraftTypeCode,CDMedia,PreRelationFlag,TradeModel,DistTypeCode,InvType,AttTypeCode,FileDetailStatus").then(res => {
      this.billClassList = res.get("CDMedia");
      this.endorTypeList = res.get("EndorType");
      this.distTypeList = res.get("DistTypeCode");
      this.tradeModelList = res.get("TradeModel");
      this.batchParams.fileDetailStatusList = res.get("FileDetailStatus");
      this.batchParams.endorTypeList = this.endorTypeList;
      this.dictMap = res.get("map");
    });
  },

  methods:{

    onCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    onCurrentChangeCancel() {
      this.currentSelectRow = [];
    },
    //表单查询
    handleSearch() {
      this.currentSelectRow = null;
      this.$refs.datagrid.dataChange(1);
    },
    //重置表单查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
    },

    billInfoWinClose() {
      this.showBillInfoWin = false;
    },

    showBillInfo(row){
      this.billId = row.billId;
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },

    tradeInfoRegShowClose(){
      this.batchParams={};
      this.tradeInfoRegShowWin = false;
      this.handleSearch();
    },

    registManage(){
      if (this.currentSelectRow == null || this.currentSelectRow.length == 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        return;
      }
      this.batchParams.tradeId = this.currentSelectRow.id;
      this.batchParams.listId = this.currentSelectRow.listId;
      this.batchParams.endorType = this.currentSelectRow.endorType;
      this.batchParams.distTypeList = this.distTypeList;
      this.batchParams.endorTypeList = this.endorTypeList;
      this.batchParams.tradeModelList = this.tradeModelList;
      this.batchParams.title = "登记管理";
      this.batchParams.isManageOpen = "1";
      this.batchParams.buyerName = this.currentSelectRow.buyerName;
      this.batchParams.sellerName = this.currentSelectRow.sellerName;
      this.tradeInfoRegShowWin = true;
    },

    obtainTradeInfo(){
      if (this.currentSelectRow == null || this.currentSelectRow.length == 0) {
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
      let params = { listId: this.currentSelectRow.listId,endorType:this.currentSelectRow.endorType,billNo:this.currentSelectRow.billNo,billRangeStart:this.currentSelectRow.billRangeStart,billRangeEnd:this.currentSelectRow.billRangeEnd,id:this.currentSelectRow.id,operType:"02"};
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

}
</script>

<style scoped>

</style>
