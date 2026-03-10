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
                <h-col span="15" class="val">{{format("BusiType",formItem.busiType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">批次号：</h-col>
                <h-col span="15" class="val">{{formItem.batchNo}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.dealNo')}}：</h-col>
                <h-col span="15" class="val">{{formItem.dealNo}}</h-col>
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
                <h-col span="9" class="label">对方机构代码：</h-col>
                <h-col span="15" class="val">{{formItem.buyBrchCode}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">对方机构名称：</h-col>
                <h-col span="15" class="val">{{formItem.buyBrchName}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
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
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}：</h-col>
                <h-col span="15" class="val">{{format("SettleType",formItem.settleMode)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.orginDueSettleDt')}}：</h-col>
                <h-col span="15" class="val">{{formatDate(formItem.dueSettleDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">申请日期：</h-col>
                <h-col span="15" class="val">{{formatDate(formItem.applDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">赎回类别：</h-col>
                <h-col span="15" class="val">{{format('RedeemType',formItem.redeemType)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">收款人账号：</h-col>
                <h-col span="15" class="val">{{formItem.pyeeAcctNo}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.pyeeName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.pyeeName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.pyeeBankName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.pyeeBankName}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">赎回事由：</h-col>
                <h-col span="15" class="val">{{format("RedeemReason",formItem.redeemReason)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">原交易利率(%)：</h-col>
                <h-col span="15" class="val">{{formatRate(formItem.ratePct)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">赎回利率(%)：</h-col>
                <h-col span="15" class="val">{{formatRate(formItem.dueRatePct)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.orginTotalAmt")}}：</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.totalAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">原回购总金额：</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.buyBackTotalAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.orginTotalNum')}}：</h-col>
                <h-col span="15" class="val">{{formItem.totalNum}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.totalAmtBillPackage')}}：</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.redeemSumAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">回购总金额：</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.redeemSumBuyTotalAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.totalNumBillPackage')}}：</h-col>
                <h-col span="15" class="val">{{formItem.redeemSumNum}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">试算利息：</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.dueInterest)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">试算结算金额：</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.dueSettleAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">实付利息：</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.duePayInterest)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">实付结算金额：</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.duePayAmt)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">发起方处理意见：</h-col>
                <h-col span="15" class="val">{{formItem.reqDealOpin}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">申请备注：</h-col>
                <h-col span="15" class="val">{{formItem.reqRemark}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">应答方处理意见：</h-col>
                <h-col span="15" class="val">{{formItem.sgnOpin}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">应答备注：</h-col>
                <h-col span="15" class="val">{{formItem.respRemark}}</h-col>
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
            url="/be/market/redeem/sale/querySaleMatureBillList"
            ref="billDatagrid"
          >
            <div slot="toolbar"></div>
          </h-datagrid>
    </div>

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
  getDictListByGroups,
  formatBillRange
} from "@/api/bizApi/commonUtil";

export default {
  name: "saleMatureAudit",
  data() {
    return {
      billFormItem:{
        batchId:""
      },
      formItem:{
        id:'',
        batchNo: "",    //批次号
        dealNo: "",     //成交单编号
        busiType: "",   //业务类型
        saleBrchName: "",   //本方机构名称
        buyBrchCode: "",    //对方机构代码
        buyBrchName: "",    //对方机构名称
        billType: "",       //票据种类
        billClass: "",      //票据介质
        dueSettleDt: "",    //原到期结算日
        applDt: "",         //申请日期
        redeemType: "",     //赎回类别
        rate: "",           //原交易利率
        dueRate: "",        //赎回(到期)利率
        ratePct:"",        //原交易利率(百分比)
        dueRatePct:"",     //赎回(到期)利率(百分比)
        totalAmt: "",        //原票据总额
        buyBackTotalAmt: "",    //回购总金额
        totalNum: "",          //原票据张数
        redeemSumAmt: "",      //票据总额(赎回总金额)
        redeemSumBuyTotalAmt: "",     //赎回回购总金额
        redeemSumNum: "",          //票据张数(赎回总笔数)
        dueInterest: "",        //试算利息
        dueSettleAmt: "",        //试算结算金额
        duePayInterest: "",     //实付利息
        duePayAmt: "",          //实付结算金额
        reqDealOpin: "",       //发起方处理意见
        reqRemark: "",        //申请备注
        sgnOpin: "",          //应答方处理意见
        respRemark: "",         //应答备注
        minDueRate: "",          //赎回最小利率
        maxDueRate: "",          //赎回最大利率
        productMapDict:''
      },
      billColumns:[
        {
          type: 'selection',
          width: 50,
          hiddenCol: false,
          align: 'center'
        },
        {
          type: 'index',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center'
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key:"billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let key = params.row.billOrigin;
            let list = (key == null || key === '' || key.toString() === 'CS00') ? '-' : this.format("BillOrigin", key);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
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
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          key:"billRange",
          hiddenCol: false,
          render: (h, params) => {
            let list = formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("span", formatNumber(params.row.billMoney, 2, ","));
          }
        },
        {
          title: this.$t('m.i.be.trialInterestByUnit'),
          key: "dueInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.dueInterest, 2, ","));
          }
        },
        {
          title: this.$t('m.i.be.trialDueInterestByUnit'),
          key: "dueSettleAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.dueSettleAmt, 2, ","));
          }
        },
        {
          title: this.$t('m.i.be.duePayInterestByUnit'),
          key: "duePayInterest",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.duePayInterest, 2, ","));
          }
        },
        {
          title: this.$t('m.i.be.duePayAmtByUnit'),
          key: "duePayAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.duePayAmt, 2, ","));
          }
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
          key: "remitDt",
          hiddenCol: false,
          render: (h, params) => {
            let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.billInfo.dueDt'),
          key: "dueDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.billInfo.drwrName'),
          key: "drwrName",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: "acptName",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.acptBrchCode'),
          key: "acptBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptBankName'),
          key: "acptBankName",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.cfmAppBrchCode'),
          key: "cfmAppBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.cfmAppBankName'),
          key: "cfmAppBankName",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
          key: "acptGuarntrBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptGuarntrBankName'),
          key: "acptGuarntrBankName",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.discBrchCode'),
          key: "discBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.discBankName'),
          key: "discBankName",
          hiddenCol: false,
          sortable: true
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
        }
      ],
      // 分页切换配置
      pageSizeOpts : [10, 20, 50, 200],
      showBillInfoWin : false,
      billId : "",
      billNo : "",
      billRangeStart:'',
      billRangeEnd:'',
      dictMap: new Map(),
      busiType: ""
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
      "PreRelationFlag,SettleType,BusiType,CDMedia,DraftTypeCode,AcctFlag,StlResult,RedeemType,RedeemReason,BillOrigin"
    ).then(res => {
      this.dictMap = res.get("map");
    });
    this.init();
  },
  methods: {
    turnForm(formItem,obj){
      formItem.id=obj.id;
      formItem.batchNo=obj.batchNo;
      formItem.dealNo=obj.dealNo;
      formItem.busiType=obj.busiType;
      formItem.saleBrchName=obj.saleBrchName;
      formItem.buyBrchCode=obj.buyBrchCode;
      formItem.buyBrchName=obj.buyBrchName;
      formItem.billType=obj.billType;
      formItem.billClass=obj.billClass;
      formItem.dueSettleDt=obj.dueSettleDt;
      formItem.applDt=obj.applDt;
      formItem.redeemType=obj.redeemType;
      formItem.ratePct=obj.ratePct;
      formItem.dueRatePct=obj.dueRatePct;
      formItem.totalAmt=obj.totalAmt;
      formItem.buyBackTotalAmt=obj.buyBackTotalAmt;
      formItem.totalNum=obj.totalNum;
      formItem.redeemReason=obj.redeemReason;
      formItem.redeemSumAmt=obj.redeemSumAmt;
      formItem.redeemSumBuyTotalAmt=obj.redeemSumBuyTotalAmt;
      formItem.pyeeAcctNo=obj.pyeeAcctNo;
      formItem.pyeeName=obj.pyeeName;
      formItem.pyeeBankName=obj.pyeeBankName;
      formItem.redeemSumNum=obj.redeemSumNum;
      formItem.dueInterest=obj.dueInterest;
      formItem.dueSettleAmt=obj.dueSettleAmt;
      formItem.duePayInterest=obj.duePayInterest;
      formItem.duePayAmt=obj.duePayAmt;
      formItem.reqDealOpin=obj.reqDealOpin;
      formItem.reqRemark=obj.reqRemark;
      formItem.sgnOpin=obj.sgnOpin;
      formItem.respRemark=obj.respRemark;
      formItem.minDueRate=obj.minDueRate;
      formItem.maxDueRate=obj.maxDueRate;
      formItem.preChangeInfo=obj.preChangeInfo;
      formItem.settleMode=obj.settleMode;
      formItem.productMapDict=obj.productMap;
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
    format(groupcode, key) {
      return getDictValueFromMap(this.dictMap, groupcode, key);
    },
    formatDate(value) {
      return value
        ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD")
        : "";
    },
    formatMoney(value) {
      return formatNumber(value, 2, ',');
    },
    formatRate(value){
      return formatNumber(value, 4, ',');
    },
    //  初始化页面
    init() {
      let batchId = this.batchId;
      let url = "";
      if (batchId) {
        url = "/be/market/redeem/sale/querySaleMatureInfo";
      } else {
        this.$msgTip.error(this, { info: "批次ID不能为空" });
      }
      post({ id: batchId }, url)
        .then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.turnForm(this.formItem, obj);
                this.busiType = obj.busiType;
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
