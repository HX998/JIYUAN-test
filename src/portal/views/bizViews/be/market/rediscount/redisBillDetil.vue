<template>
  <div>
    <h-msg-box maximize v-model="tempImageWin" width="1000" @on-close="handleClose">
      <p slot="header">
        <span>查看票据明细</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
              <h-col span="15" class="val">{{format("RediscBusiType",viewDatailForm.busiType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">批次号:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.batchNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.rediscountApplNo')}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.rediscountApplNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.applBrchName')}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleBrchName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.dealNo')}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.dealNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.traderName')}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleTraderName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">本方复核交易员名称:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleCheckTraderName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.pedBrchName')}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyBrchName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}:</h-col>
              <h-col span="15" class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.billClass')}}:</h-col>
              <h-col span="15" class="val">{{format("CDMedia",viewDatailForm.billClass)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.clearType')}}:</h-col>
              <h-col span="15" class="val">{{format("ClearType",viewDatailForm.clearType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.settleMode')}}:</h-col>
              <h-col span="15" class="val">{{format("SettleType",viewDatailForm.settleMode)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <!--再贴现买断-->
        <div v-if="busiType=='RBT01'">
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.clearSpeed')}}:</h-col>
                <h-col span="15" class="val">{{format("ClearSpeed",viewDatailForm.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.firstSettleDt')}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.tradRate')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.setTm')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.setTm}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.prodName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.totalAmtBillPackage')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.totalAmt}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.totalNumBillPackage')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.firstPayInterest')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.firstPayInterest}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">结算金额:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.firstSettleAmt}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">加权平均剩余期限:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.tenorDays}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.yieldRate')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.yieldRatePct}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
        <!--再贴现质押回购-->
        <div v-if="busiType=='RBT02'">
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.clearSpeed')}}:</h-col>
                <h-col span="15" class="val">{{format("ClearSpeed",viewDatailForm.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.firstSettleDate')}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">回购期限:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.tenorDays}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.dueSettleDt')}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.dueSettleDt)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.repurchaseRate')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">回购金额:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.buyBackTotalAmt}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.prodName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.totalAmtBillPackage')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.totalAmt}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.totalNumBillPackage')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">首期结算金额:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.firstSettleAmt}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">到期结算金额:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.dueSettleAmt}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.firstPayInterest')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.firstPayInterest}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.buyBackEarningRate')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.yieldRatePct}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
        <br>
        <div >
          <h-row :gutter="16" >
            <h-col span="6" >
              <h-row>
                <h-col span="9" class="label" >人行受理人意见:</h-col>
                <h-col span="15" class="val" >{{viewDatailForm.buyTraderNote}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6" >
              <h-row>
                <h-col span="9" class="label">人行复核意见:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.buyCheckTraderNote}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6" >
              <h-row>
                <h-col span="9" class="label">人行审批意见:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.buyApproveTraderNote}}</h-col>
              </h-row>
            </h-col>
          </h-row>
            <br>
          <h-row>
            <h-col span="6">
              <h-row >
                <h-col span="9" class="label">人行受理人名称:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.buyTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6" >
              <h-row >
                <h-col span="9" class="label">人行复核人名称:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.buyCheckTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6" >
              <h-row>
                <h-col span="9" class="label">人行审批人名称:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.buyApproveTraderName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
      <h-datagrid :columns="billsColumns" :autoLoad="autoLoad" rowSelect :url="billsUrl" :bindForm="batchid" ref="bills"
                  :onSelectChange="selectBills">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="showImage">影像</h-button>
          <h-button type="primary" @click="exportTable">{{$t('m.i.common.exportData')}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>

    <h-msg-box maximize v-model="showBillImage" width="800">
      <p slot="header">
        <span>影像信息</span>
      </p>
      <h-datagrid :columns="billimagecolumns" :autoLoad="autoLoad" highlight-row :url="billImgsUrl"
                  :bindForm="imgParams" ref="billimages">
      </h-datagrid>
      <div slot="footer"></div>
    </h-msg-box>
    <!-- 查看影像弹出框-->
    <h-msg-box title="影像查看" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true"
               class="h-form-search-layer"
               top="10" :maximize="true">
      <img :src="imgUrl" width="100%"/>
    </h-msg-box>

    <bill-info-main
      @billInfoWinClose="billInfoWinClose"
      :showBillInfoWin="showBillInfoWin"
      :billId="billId"
      :billNo="billNo"
      :billRangeStart="billRangeStart"
      :billRangeEnd="billRangeEnd"
    ></bill-info-main>
  </div>
</template>
<script>
  import { getDictListByGroups, getDictValueFromMap, post ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "redisBillDetil",
    data() {
      return  {
        viewDatailForm : {
          batchNo: "",
          rediscountApplNo: "",
          busiType: "",
          buyBrchName: "",
          billType: "",
          billClass: "",
          ratePct: "",
          clearSpeed: "",
          clearType: "",
          settleMode: "",
          firstSettleDt: "",
          dueSettleDt: "",
          totalAmt: "",
          buyBackTotalAmt: "",
          firstPayInterest: "",
          firstSettleAmt: "",
          dueSettleAmt: "",
          tenorDays: "",
          totalNum: "",
          creditMainBrchCode:'',
          creditMainBankName:'',
          creditMainBankType:''
        },
        imgParams : {
          listId: ""
        },
        preDeleteBill:false,
        billsColumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.status'),
            key: "preRelationFlag",
            hiddenCol: false,
            render: (h, params) => {
          let list = getDictValueFromMap(this.dictMap, "PreRelationFlag", params.row.preRelationFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }, {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },{
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                  on: {
                      click: () => {
                          this.showBillInfo(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                      }
                  }
              }, params.row.billNo);
            }
          },{
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          }, {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          }, {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.discDt'),
            key: "discDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.discDt ? this.$moment(params.row.discDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.discInterestRateYear'),
            key: "discInterestRatePct",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          // {
          //   title: this.$t('m.i.billInfo.cfmAppBrchCode'),
          //   key: "cfmAppBrchCode",
          //   hiddenCol: false,
          //
          // }, {
          //   title: this.$t('m.i.billInfo.cfmAppBankName'),
          //   key: "cfmAppBankName",
          //   hiddenCol: false,
          //
          // },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGuarntrBrchCode",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false,

          },{
            title: this.$t('m.i.be.discCustName'),
            key: "discCustName",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
           {
            title: this.$t('m.i.billInfo.cfmAppBankNo'),
            key: "cfmAppBankNo",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBrchCode'),
            key: "discGuarntrBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
            key: "guarntrTrustBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CreditMajor", params.row.creditMainBankType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.isDiscount'),
            key: "isDiscount",
            hiddenCol: false,
            render: (h, params) => {
          let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscount);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.isAnotherPlaceBill'),
            key: "isAllopatric",
            hiddenCol: false,
            render: (h, params) => {
          let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isAllopatric);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.isAccordWithPolicy'),
            key: "isMeetPolicy",
            hiddenCol: false,
            render: (h, params) => {
          let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isMeetPolicy);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.remainDays'),
            key: "remainDays",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          /*{
            title: this.$t('m.i.billInfo.dueInterestByUnit'),
            key: "dueInterest",
            hiddenCol: false,

          },*/
          {
            title: this.$t('m.i.be.settleAmtFirst'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmt'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.dueSettleAmt, 2, ","));
            }
          },
            {
                title: this.$t("m.i.be.discCorpScale"),
                key: "discCorpScale",
                hiddenCol: false,
                render: (h, params) => {
                    let list = getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
                    return h("span", { domProps: { title: list } }, list);
                }
            },
            {
                title: this.$t("m.i.be.isDiscGreen"),
                key: "isDiscGreen",
                hiddenCol: false,
                render: (h, params) => {
                    let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscGreen);
                    return h("span", { domProps: { title: list } }, list);
                }
            },
            {
                title: this.$t("m.i.be.discIndustry"),
                key: "discIndustry",
                hiddenCol: false,
                render: (h, params) => {
                    let list = getDictValueFromMap(this.dictMap, "Industry", params.row.discIndustry);
                    return h("span", { domProps: { title: list } }, list);
                }
            },
            {
                title: this.$t("m.i.be.isDiscArc"),
                key: "isDiscArc",
                hiddenCol: false,
                render: (h, params) => {
                    let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscArc);
                    return h("span", { domProps: { title: list } }, list);
                }
            }
        ],
        selectBillsData : [],
        showBillImage : false,
        showImgWin : false,
        billimagecolumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.imgBatchNo'),
            key: "imgBatchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.imgType'),
            key: "imgType",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", "再贴现资料");
            }
          },
          {
            title: this.$t('m.i.be.uploadStatus'),
            key: "uploadStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "ImgStatus", params.row.applStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }, {
            title: this.$t('m.i.common.showImg'),
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showRediscSaleImage(params.row.id);
                  }
                }
              }, this.$t('m.i.common.view'));
            }
          }
        ],
        imgUrl : "",
        baseImgUrl : this.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscountConfirmation/showImg?id=",
        autoLoad : false,
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart:'',
        billRangeEnd:'',
      }
    },
    components: {
    },
    props: {
      batchid: {
        type: Object,
        required: true
      },
      showBills: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchUrl: {
        type: String,
        required: true
      },
      billsUrl: {
        type: String,
        required: true
      },
      billImgsUrl: {
        type: String,
        required: true
      },
      busiType: {
        type: String,
        required: true
      },
      dictMap: {
        type: Map,
        required: true
      },
    },
    methods: {
      showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      format(groupcode, key) {
        return getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      selectBills(i) {
        this.selectBillsData = i;
      },
      exportTable() {
        if (this.$refs.bills.total > 0) {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscountConfirmation/downloadRediscountSaleInfo";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          let input = document.createElement("input");
          input.tpye = "text";
          input.name = "ids";
          input.value = this.$refs.bills.selectIds;
          form.appendChild(input);
          let input1 = document.createElement("input");
          input1.type = "text";
          input1.name = "batchId";
          input1.value = this.batchid.batchId;
          form.appendChild(input1);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          this.$msgTip.error(this, {info: "暂无数据可导出"});
        }

      },
      //点击影像按钮事件
      showImage() {
        if (this.selectBillsData.length == 1) {
          this.imgParams.listId = this.selectBillsData[0].id;
          this.$nextTick(() => {
            this.$refs.billimages.dataChange(1);
          });
          this.showBillImage = true;
        } else if (this.selectBillsData.length > 1) {
          this.$msgTip.error(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      //显示影像
      showRediscSaleImage(i) {
        this.imgUrl = this.baseImgUrl + i;
        this.showImgWin = true;
      },
      handleClose() {
        this.$emit("closeMsgBox", "");
      }
    },
    watch: {
      showBills(i) {
        // if(this.dealStatus==="RS04"){
        //   this.preDeleteBill = true;
        // }else {
        //   this.preDeleteBill = false;
        // }
        if (i == true) {
          post({ id: this.batchid.batchId }, this.batchUrl).then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null){
                if (res.data.retData.firstPayInterest !== null && res.data.retData.firstPayInterest !== "") {
                  res.data.retData.firstPayInterest = formatNumber(res.data.retData.firstPayInterest, 2, ",");
                }
                if (res.data.retData.totalAmt !== null && res.data.retData.totalAmt !== "") {
                  res.data.retData.totalAmt = formatNumber(res.data.retData.totalAmt, 2, ",");
                }
                if (res.data.retData.firstSettleAmt !== null && res.data.retData.firstSettleAmt !== "") {
                  res.data.retData.firstSettleAmt = formatNumber(res.data.retData.firstSettleAmt, 2, ",");
                }
                if (res.data.retData.buyBackTotalAmt !== null && res.data.retData.buyBackTotalAmt !== "") {
                  res.data.retData.buyBackTotalAmt = formatNumber(res.data.retData.buyBackTotalAmt, 2, ",");
                }
                if (res.data.retData.dueSettleAmt !== null && res.data.retData.dueSettleAmt !== "") {
                  res.data.retData.dueSettleAmt = formatNumber(res.data.retData.dueSettleAmt, 2, ",");
                }
                this.viewDatailForm = res.data.retData;
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          });
          this.$nextTick(() => {
            this.$refs.bills.dataChange(1);
          });
        }
      },
      showBillImage(i) {
        if (i == true) {
          this.$nextTick(() => {
            this.$refs.billimages.dataChange(1);
          });
        }
      },
    },
    computed: {
      tempImageWin: {
        get() {
          return this.showBills;
        },
        set() {
        }
      }
    }
  };

</script>
