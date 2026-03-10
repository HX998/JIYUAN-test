<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header">
          <span class="tit">详细信息</span>
        </div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
                <h-col span="15" class="val">{{format("RediscBusiType",formItem.busiType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.batchNo')}}：</h-col>
                <h-col span="15" class="val">{{formItem.batchNo}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.rediscountApplNo')}}：</h-col>
                <h-col span="15" class="val">{{formItem.rediscountApplNo}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.brchName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.traderName')}}:</h-col>
                <h-col span="15" class="val">{{formItem.saleTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.ownReviewsTrader')}}:</h-col>
                <h-col span="15" class="val">{{formItem.saleCheckTraderName}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.pedBrchName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.buyBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
                <h-col span="15" class="val">{{format("DraftTypeCode",formItem.billType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billClass')}}：</h-col>
                <h-col span="15" class="val">{{format('CDMedia',formItem.billClass)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.clearType')}}：</h-col>
                <h-col span="15" class="val">{{format("ClearType",formItem.clearType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.settleMode')}}：</h-col>
                <h-col span="15" class="val">{{format("SettleType",formItem.settleMode)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.clearSpeed')}}：</h-col>
                <h-col span="15" class="val">{{format("ClearSpeed",formItem.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <div v-if="formItem.busiType=='RBT01'">
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.termRangeType')}}：</h-col>
                  <h-col span="15" class="val">{{format("TermType",formItem.termType)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstSettleDt')}}：</h-col>
                  <h-col span="15" class="val">{{formatDate(formItem.firstSettleDt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.tradRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.ratePct)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.prodName}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalAmtBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoneyNumber(formItem.totalAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalNumBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.totalNum}}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstPayInterest')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoneyNumber(formItem.firstPayInterest)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.settleAmtByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoneyNumber(formItem.firstSettleAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.tenorDays')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.tenorDays}}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.yieldRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.yieldRatePct)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
          </div>
          <div v-if="formItem.busiType=='RBT02'">
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.termRangeType')}}：</h-col>
                  <h-col span="15" class="val">{{format("TermType",formItem.termType)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstSettleDt')}}：</h-col>
                  <h-col span="15" class="val">{{formatDate(formItem.firstSettleDt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.repoTerm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.tenorDays}}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.dueSettleDt')}}：</h-col>
                  <h-col span="15" class="val">{{formatDate(formItem.dueSettleDt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.repurchaseRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.ratePct)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.buyBackTotalAmt')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoneyNumber(formItem.buyBackTotalAmt)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.prodName}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalAmtBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoneyNumber(formItem.totalAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalNumBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.totalNum}}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstSettleAmtByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoneyNumber(formItem.firstSettleAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.dueSettleAmtByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoneyNumber(formItem.dueSettleAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstPayInterest')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoneyNumber(formItem.firstPayInterest)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.buyBackEarningRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.yieldRatePct)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
          </div>
          <h-row :gutter="8" style="margin-left: -10px; margin-right: 6px;">
            <h-col span="24" style="padding-left: 10px; padding-right: 10px;">
              <h-row>
                <h-col span="3" class="label">{{$t('m.i.be.diffMsg')}}：</h-col>
                <h-col span="13" class="val">{{formItem.preChangeInfo}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :height="350"
            :notSetWidth="true"
            :bindForm="billFormItem"
            url="/be/market/rediscount/redSaleApplyMain/queryRedSaleBillList"
            :onSelectChange="selectBills"
            ref="billDatagrid"
          >
            <div slot="toolbar">
              <h-button type="primary" @click="showImage">{{$t('m.i.common.image')}}</h-button>
            </div>
          </h-datagrid>
    </div>
    <h-msg-box maximize v-model="showBillImage" width="800">
      <p slot="header">
        <span>影像信息</span>
      </p>
      <h-datagrid
        :columns="billimagecolumns"
        :autoLoad="autoLoad"
        highlight-row
        :url="billImgsUrl"
        :bindForm="imgParams"
        ref="billimages"
      ></h-datagrid>
      <div slot="footer"></div>
    </h-msg-box>
    <!-- 查看影像弹出框-->
    <h-msg-box
      title="影像查看"
      v-model="showImgWin"
      width="1000"
      :mask-closable="false"
      :footerHide="true"
      class="h-form-search-layer"
      top="10"
      :maximize="true"
    >
      <img :src="imgUrl" width="100%">
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
import {
  formatNumber,
  getDictValueFromMap,
  post,
  on,
  off,
  getDictListByGroups
} from "@/api/bizApi/commonUtil";


export default {
  name: "redisAudit",
  data() {
    return  {
      billFormItem:{
        batchId:""
      },
      formItem: {
        id: "",
        busiType:"",
        batchNo:"",
        rediscountApplNo:"",
        saleBrchName:"",
        saleTraderName:"",
        saleCheckTraderName:"",
        buyBrchName:"",
        billType:"",
        billClass:"",
        clearType:"",
        settleMode:"",
        clearSpeed:"",
        termType:"",
        firstSettleDt:"",
        dueSettleDt:"",
        ratePct:"",
        prodName:"",
        totalAmt:"",
        buyBackTotalAmt:"",
        totalNum:"",
        firstPayInterest:"",
        firstSettleAmt:"",
        dueSettleAmt:"",
        tenorDays:"",
        yieldRatePct:"",
      },
      billColumns : [
        {
          type: "selection",
          width: 60,
          align: "center",
          // fixed: "left",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.status'),
          key: 'preRelationFlag',
          hiddenCol: false,
          render: (h, params) => {
         let list = this.getDictValueFromMap(this.dictMap, "PreRelationFlag", params.row.preRelationFlag);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
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
          key: 'billNo',
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
          key: 'billMoney',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('p', formatNumber(params.row.billMoney, 2, ','))
          },
        }, {
          title: this.$t('m.i.billInfo.remitDt'),
          key: 'remitDt',
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        }, {
          title: this.$t('m.i.billInfo.dueDt'),
          key: 'dueDt',
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        }, {
          title: this.$t('m.i.billInfo.drwrName'),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false
        }, {
          title: this.$t('m.i.billInfo.acptBankNo'),
          key: 'acptBankNo',
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.acptBankName'),
          key: 'acptBankName',
          sortable: true,
          hiddenCol: false
        }, {
          title: this.$t('m.i.billInfo.discBankNo'),
          key: 'discBankNo',
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.discBankName'),
          key: 'discBankName',
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.guarntrTrustBankNo'),
          key: 'guarntrTrustBankNo',
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.guarntrTrustBankName'),
          key: 'guarntrTrustBankName',
          sortable: true,
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.cfmAppBankNo'),
          key: 'cfmAppBankNo',
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.cfmAppBankName'),
          key: 'cfmAppBankName',
          sortable: true,
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.acptGuarntrBankNo'),
          key: 'acptGuarntrBankNo',
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.acptGuarntrBankName'),
          key: 'acptGuarntrBankName',
          sortable: true,
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.discGuarntrBankNo'),
          key: 'discGuarntrBankNo',
          hiddenCol: false,

        }, {
          title: this.$t('m.i.billInfo.discGuarntrBankName'),
          key: 'discGuarntrBankName',
          sortable: true,
          hiddenCol: false,

        }, {
          title: this.$t('m.i.be.isDiscount'),
          key: 'isDiscount',
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
        }, {
          title: this.$t('m.i.be.isAnotherPlaceBill'),
          key: 'isAllopatric',
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
        }, {
          title: this.$t('m.i.be.isAccordWithPolicy'),
          key: 'isMeetPolicy',
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
          title: this.$t("m.i.be.assetIndustry"),
          key: "assetIndustry",
          hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.assetIndustry);
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

        },
        {
          title: this.$t('m.i.be.firstPayInterestByUnit'),
          key: "firstPayInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('p', formatNumber(params.row.firstPayInterest, 2, ','))
          },
        },
        {
          title: this.$t('m.i.be.settleAmtFirst'),
          key: "firstSettleAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('p', formatNumber(params.row.firstSettleAmt, 2, ','))
          },
        },
        {
          title: this.$t('m.i.be.dueSettleAmtByUnit'),
          key: "dueSettleAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('p', formatNumber(params.row.dueSettleAmt, 2, ','))
          },
        }
      ],
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
          hiddenCol: false,
          sortable: true,
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
      imgParams : {
        listId: ""
      },
      billImgsUrl: "/be/market/rediscount/rediscountConfirmation/func_queryRediscountSaleImagePage",
      imgUrl : "",
      baseImgUrl : this.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscountConfirmation/showImg?id=",
      autoLoad : false,
      // 分页切换配置
      selectBillsData : [],
      showBillImage : false,
      showImgWin : false,
      pageSizeOpts : [10, 20, 50, 200],
      uploadUrl : "",
      currentInfoSelectList : [],
      currentInfoSelectRowInx : [],
      currentImageInfoSelectList : [],
      currentImageInfoSelectRowInx : [],
      imageWin : false,
      preDeleteBill : false,
      listId : "",
      billType : "",
      billClass : "",
      busiType : "",
      branchCode : "",
      buyBrchCode :"",
      buyBrchName : "",
      buyTraderNo : "",
      buyTraderName : "",
      buyProductNo : "",
      buyProductName : "",
      preChangeInfo : "",
      buyApproveTraderNote:"",
      buyCheckTraderNote:"",
      buyTraderNote:"",
      totalAmt:"",
      buyBackTotalAmt:"",
      batchNo:"",
      ratePct:"",
      firstPayInterest:"",
      firstSettleAmt:"",
      totalNum:"",
      billDatagridData : { rows: [], total: 1 },
      showBillInfoWin : false,
      billId : "",
      billNo : "",
      billRangeStart:'',
      billRangeEnd:'',
      dictMap: new Map(),
    }
  },
  components: {
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    listIds: "",
    batchId: ""
  },
  created() {
    this.billFormItem.batchId = this.batchId;
  },
  mounted() {
    getDictListByGroups(
      "TermType,ClearSpeed,ClearType,PreRelationFlag,SettleType,RediscBusiType,CDMedia,DraftTypeCode,AcctFlag,StlResult,RedeemType,ImgStatus,Yon,AssetIndustry,BillOrigin"
    ).then(res => {
      this.dictMap = res.get("map");
    });
    this.init();
  },
  watch: {
    showBillImage(i) {
      if (i == true) {
        this.$nextTick(() => {
          this.$refs.billimages.dataChange(1);
        });
      }
    }
  },
  methods: {
    turnForm(formItem,obj){
      formItem.id = obj.id;
      formItem.busiType = obj.busiType;
      formItem.batchNo = obj.batchNo;
      formItem.rediscountApplNo = obj.rediscountApplNo;
      formItem.saleBrchName = obj.saleBrchName;
      formItem.saleTraderName = obj.saleTraderName;
      formItem.saleCheckTraderName = obj.saleCheckTraderName;
      formItem.buyBrchName = obj.buyBrchName;
      formItem.billType = obj.billType;
      formItem.billClass = obj.billClass;
      formItem.clearType = obj.clearType;
      formItem.settleMode = obj.settleMode;
      formItem.clearSpeed = obj.clearSpeed;
      formItem.termType = obj.termType;
      formItem.firstSettleDt = obj.firstSettleDt;
      formItem.dueSettleDt = obj.dueSettleDt;
      formItem.ratePct = obj.ratePct;
      formItem.prodName = obj.prodName;
      formItem.totalAmt = obj.totalAmt;
      formItem.buyBackTotalAmt = obj.buyBackTotalAmt;
      formItem.totalNum = obj.totalNum;
      formItem.firstPayInterest = obj.firstPayInterest;
      formItem.firstSettleAmt = obj.firstSettleAmt;
      formItem.dueSettleAmt = obj.dueSettleAmt;
      formItem.tenorDays = obj.tenorDays;
      formItem.yieldRatePct = obj.yieldRatePct;
      formItem.preChangeInfo = obj.preChangeInfo;
    },
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
    selectBills(i) {
      this.selectBillsData = i;
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
        this.$hMessage.error(this.$t("m.i.common.onlyChooseOneData"));
      } else {
        this.$hMessage.error(this.$t("m.i.common.chooseOneData"));
      }
    },
    //显示影像
    showRediscSaleImage(i) {
      this.imgUrl = this.baseImgUrl + i;
      this.showImgWin = true;
    },
    handleClose() {
      this.$emit("closeMsgBox", "");
    },
    format(groupcode, key) {
      return getDictValueFromMap(this.dictMap, groupcode, key);
    },
    formatDate(value) {
      return value
        ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD")
        : "";
    },
    formatMoneyNumber(number) {
      return formatNumber(number,2,',');
    },
    formatRate(value) {
      return formatNumber(value, 4, ',');
    },
    //  初始化页面
    init() {
      let batchId = this.batchId;
      let url = "";
      if (batchId) {
        url = "/be/market/rediscount/redSaleApplyMain/findRedSaleBatchByIdAudit";
      } else {
        this.$msgTip.error(this, { info: "批次ID不能为空" });
      }
      post({ id: batchId }, url)
        .then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.turnForm(this.formItem, obj);
                this.busiType = obj.busiType;
                if (obj.busiType == "RBT01") {
                  this.busiType = "再贴现买断";
                } else {
                  this.busiType = "再贴现质押回购";
                }
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        })
        .catch(error => {
          this.$msgTip.error(this, {
            info: this.$t("m.i.common.netError") + error
          });
        });
    }
  }
};
</script>

<style scoped>
</style>
