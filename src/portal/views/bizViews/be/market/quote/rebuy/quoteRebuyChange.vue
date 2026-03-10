<template>
  <div>
    <h-msg-box v-model="tempQuoteRebuyChangeWin" :mask-closable="false" @on-close="handleClose" :maximize="true"
               width="1000" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div>
        <h-form :model="formItem" :label-width="100" ref="formItem" cols="3" class="h-form-search">
          <quote-input :busiType="bt"
                       :rebuyBusiType="rebuyBusiType"
                       :isChange="isChange"
                       :formItem="formItem" :dictMap="dictMap">
            <div slot="save">
              <h-form-item label="" prop="prodName" class="h-form-three">
                <h-button type="primary" @click="saveBatch()">{{$t('m.i.common.save')}}</h-button>
              </h-form-item>
            </div>
          </quote-input>
        </h-form>
      </div>
      <!-- 数据展示表格 -->
      <h-datagrid :columns="columns"
                  url="/be/market/quote/quoteManager/func_queryRebuyBillList"
                  :bindForm="billFormItem"
                  :hasSelect="hasSelect"
                  :page-size="pageSizeParamValue"
                  rowSelect
                  :auto-load="false"
                  :hasAdvanced="true"
                  :advancedParams="advancedParams"
                  ref="billDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="calcInterest()">{{$t('m.i.be.calcInterest')}}</h-button>
          <h-button type="primary" @click="setAssetType()" v-if="openI9flag && isShowInner==='1'">
            {{$t('m.i.be.setAssetType')}}
          </h-button>
          <h-button type="primary" @click="apply()">{{$t('m.i.be.applyBatch')}}</h-button>
          <h-button type="primary" @click="preDelBill()">{{$t('m.i.be.preDelBill')}}</h-button>
          <h-button type="primary" @click="replyDel()">{{$t('m.i.be.replyDel')}}</h-button>
          <h-button type="primary" @click="resetRebuyQuote()">{{$t('m.i.be.resetQuote')}}</h-button>
          <h-button type="primary" @click="editLimitTypeObj()" v-if="formItem.isSelectCreditOccupy=='1'">
            {{$t('m.i.be.editLimitTypeObj')}}
          </h-button>
          <h-button type="primary" @click="exportBill()">{{$t('m.i.common.exportExcel')}}</h-button>
          <h-button type="primary" @click="printBill()"
                    v-if="this.childrenBtnAuth.quoteRebuyChangePrintBill === undefined ? true : this.childrenBtnAuth.quoteRebuyChangePrintBill.isShow">
            {{$t('m.i.be.printBill')}}
          </h-button>
          <h-button type="primary" @click="deletePreAudit()"
                    v-if="formItem.isPreAudit==='1' && (this.childrenBtnAuth.quoteRebuyChangeDeletePreAudit === undefined ? true : this.childrenBtnAuth.quoteRebuyChangeDeletePreAudit.isShow)">
            {{$t('m.i.be.deletePreAudit')}}
          </h-button>
        </div>
      </h-datagrid>
    </h-msg-box>
    <creditOccupy
      :batchId="curBatchId"
      :billIds="billIds"
      :dictMap="dictMap"
      :creditOcc="creditOcc"
      :creditOccupyWin="creditOccupyWin"
      @creditOccupyClose="creditOccupyClose">
    </creditOccupy>
    <creditOccupyType
      :batchId="curBatchId"
      :batchNo="batchNo"
      :dictMap="dictMap"
      :creditOcc="creditOccType"
      :creditOccupyTypeWin="creditOccupyTypeWin"
      @creditOccupyTypeClose="creditOccupyTypeClose">
    </creditOccupyType>
    <assetIndustry
      :batchId="curBatchId"
      :billIds="billIds"
      :dictMap="dictMap"
      :assetInd="assetInd"
      :isAssetIndustryChooseBoolen="isAssetIndustryChooseBoolen"
      :isNeedBookTypeBoolen="isNeedBookTypeBoolen"
      :assetIndustryWin="assetIndustryWin"
      @assetIndustryClose="assetIndustryClose">
    </assetIndustry>
    <h-msg-box v-model="applyWin" :maximize="false" width="400" :footerHide="true" :closable="false" :z-index="2010">
      <div class="modal-body">
        <div class="h-modal-confirm">
          <div class="h-modal-confirm-head">
            <div class="h-modal-confirm-head-icon h-modal-confirm-head-icon-confirm">
              <i class="h-icon iconfont icon-feedback"></i>
            </div>
            <div class="h-modal-confirm-head-title">确认要继续提交申请吗?</div>
          </div>
          <div class="h-modal-confirm-body">
            <div>{{applyTitle}}</div>
          </div>
          <div class="h-modal-confirm-footer">
            <button type="button" @click="applyClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span></button>
            <button type="button" @click="applyCommit()" class="h-btn h-btn-primary h-btn-large"><span>确定</span>
            </button>
          </div>
        </div>
      </div>
    </h-msg-box>
    <h-msg-box v-model="auditWin" width="800" class="h-approve-layer" :maximize="true"
               :mask-closable="false" @on-close="auditClose">
      <p slot="header">
        <span>选择审批岗</span>
      </p>
      <div>
        <h-row>
          <h-col span="12" class="pt-15">
            <h-form :model="auditFormItem" :label-width="100" ref="auditFormItem" class="h-form-search">
              <h-form-item
                :label="$t('m.i.pc.tellerNo')" prop="userName" >
                <h-input v-model="auditFormItem.userNames" :placeholder="''" readonly
                         icon="android-search" @on-click="queryAudit" clearable @on-clear="clearAudit"></h-input>
              </h-form-item>
            </h-form>
          </h-col>
        </h-row>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="auditClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="auditSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <rebuy-detail-print :batchId="batchId" :dictMap="dictMap.dictListMap" :busiType="bt"
                        :rebuyDetailPrintWin="showRebuyDetilPrint"
                        @closeMsgBox="closeDetilPrint()"></rebuy-detail-print>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <show-first-audit-station-and-user :showFirstAuditStationAndUserWin="showFirstAuditStationAndUserWin" :title="'分配首岗审核柜员'"
                                       @showFirstAuditStationAndUserWinClose="showFirstAuditStationAndUserWinClose"
                                       @auditSelect="auditSelect" :prodNo="prodNo" :billType="billType" :billClass="billClass"></show-first-audit-station-and-user>
  </div>
</template>
<script>
  import {post, on, off, formatNumber, getDictValueFromMap, getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteRebuyChange",
    data() {
      return {
        openI9flag: "",
        formItem: {
          id: '',
          busiType: '',
          batchNo: '',
          quoteNo: '',
          saleBrchCode: '',
          saleBrchName: '',
          saleTraderNo: '',
          saleTraderName: '',
          saleProductNo: '',
          saleProductName: '',
          buyBrchCode: '',
          buyBrchName: '',
          buyTraderNo: '',
          buyTraderName: '',
          buyProductNo: '',
          buyProductName: '',
          subDeal: '',
          billClass: '',
          billType: '',
          clearSpeed: '',
          clearType: '',
          settleMode: '',
          selectType: '',
          packetSeq: '',
          quoteTm: '',
          setTm: '',
          firstSettleDt: '',
          dueSettleDt: '',
          prodNo: '',
          ratePct: '',
          dueRatePct: '',
          totalNum: '',
          totalAmt: '',
          buyBackTotalAmt: null,
          tenorDays: '',
          yieldRatePct: '',
          firstSettleAmt: '',
          dueSettleAmt: '',
          firstPayInterest: '',
          dueInterest: '',
          creditOccupyType: '',
          productMapDict: '',
          workDate: '',
          maxTenorDays: '',
          minRate: '',
          maxRate: '',
          isSelectCreditOccupy: '',
          isNeedAssetIndustry: '',
          isAssetIndustryChoose: '',
          defaultAssetIndustry: '',
          isNeedBookType: '',
          isPreAudit: '',
          auditNo: '',
          creditMainBrchCode: '',
          creditMainBankName: '',
          creditMainBankType: '',
          ownedBrchNo: '',
          liFlag: false,
          memberId: '',
          isNoticeFirstAudit: "",
          isInner: "",
          showNoticeFirstStationItem: false,
        },
        columns: [
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
            title: this.$t('m.i.common.status'),
            key: 'preRelationFlag',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap.dictListMap, 'PreRelationFlag', params.row.preRelationFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap.dictListMap, 'BillOrigin', params.row.billOrigin);
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('p', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: 'dueMatDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.creditOccType'),
            key: 'creditOccupyType',
            hiddenCol: true,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap.dictListMap, 'CreditDeductRule', params.row.creditOccupyType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },

          {
            title: this.$t('m.i.be.bookType'),
            key: 'bookType',
            hiddenCol: true,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap.dictListMap, 'BookType', params.row.bookType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false,
            sortable: true,
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
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGuarntrBrchCode",
            hiddenCol: false,
            sortable: true,
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
            hiddenCol: false,
            sortable: true,
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
            sortable: true,
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
            sortable: true,
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
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap.dictListMap, 'CreditMajor', params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },

          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol: window.sessionStorage.getItem("isOpenI9") == "1" ? false : true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap.dictListMap, 'AssetIndustry', params.row.assetIndustry);
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
            title: this.$t('m.i.be.dueRemainDays'),
            key: "dueRemainDays",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueSettleAmt, 2, ','))
            }
          }
        ],
        pageSizeParamValue: "",
        // 分页切换配置
        pageSizeOpts: [10, 20, 50, 200],
        riskFlag: "0",
        preFlag: "0",
        userIds:"",
        isNeedToAudit: "0",
        auditWin:false,
        auditFormItem:{
          userIds: "",
          userNames: "",
        },
        showFirstAuditStationAndUserWin: false,
        prodNo: "",
        billType:"",
        billClass:"",
        curBatchId: this.batchId,
        batchNo: '',
        billIds: '',
        isChange: false,
        billFormItem: {
          batchId: this.batchId,
          billMoneyRange : {
            minBillMoney: "",
            maxBillMoney: "",
          },
          minBillMoney: "",
          maxBillMoney: "",
          reverseBillNo: "",
          acptName: "",
          dueDtRange: [],
          minDueDt: "",
          maxDueDt: "",
        },
        quoteBillSelectList: [],
        quoteBillSelectRowInx: [],
        creditOccupyWin: false,
        creditOccupyTypeWin: false,
        creditOcc: '',
        creditOccType: '',
        assetIndustryWin: false,
        assetInd: '',
        isNeedBookTypeBoolen: false,
        isAssetIndustryChooseBoolen: false,
        applyWin: false,
        applyTitle: "",
        showRebuyDetilPrint: false,
        hasSelect: false,
        showBillInfoWin: false,
        billId: null,
        billNo: "",
        billRangeStart: '',
        billRangeEnd: '',
        liFlag: false,
        preDict: this.dictMap,
        isInnerDiscSetIndustry: "",
        isShowInner: "",
        advancedParams : {}
      };
    },
    components: {
      QuoteInput: () => import(/* webpackChunkName: "be/market/quote/rebuy/quoteRebuyInput" */`@/views/bizViews/be/market/quote/rebuy/quoteRebuyInput`),
      CreditOccupy: () => import(/* webpackChunkName: "be/market/quote/rebuy/creditOccupy" */`@/views/bizViews/be/market/quote/rebuy/creditOccupy`),
      CreditOccupyType: () => import(/* webpackChunkName: "be/market/quote/rebuy/creditOccupyType" */`@/views/bizViews/be/market/quote/rebuy/creditOccupyType`),
      AssetIndustry: () => import(/* webpackChunkName: "be/market/quote/rebuy/assetIndustry" */`@/views/bizViews/be/market/quote/rebuy/assetIndustry`),
      RebuyDetailPrint: () => import(/* webpackChunkName: "be/market/quote/rebuy/rebuyDetailPrint" */`@/views/bizViews/be/market/quote/rebuy/rebuyDetailPrint`),
      ShowFirstAuditStationAndUser: () => import(/* webpackChunkName: "bm/audit/showFirstAuditStationAndUser"*/"@/views/bizViews/bm/audit/showFirstAuditStationAndUser.vue"),
    },
    props: {
      title: String,
      trDir: String,//交易方向：买入、卖出、正回购、逆回购
      bt: String, //交易类型：转贴现，质押式回购，买断式回购
      batchId: Number,
      dictMap: {
        type: Object
      },
      quoteRebuyChangeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      licenseFlag: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isNoticeFirstAudit: {
        type: String,
        default() {
          return "0"
        }
      },
      showNoticeFirstStationItem: {
        type: Boolean,
        default() {
          return false
        }
      },
      childrenBtnAuth: {
        type: Object,
        default() {
          return {
            quoteRebuyChangePrintBill: {
              isShow: true
            },
            quoteRebuyChangeDeletePreAudit: {
              isShow: true
            }
          }
        }
      },
    },
    computed: {
      tempQuoteRebuyChangeWin: {
        get() {
          return this.quoteRebuyChangeWin;
        },
        set() {

        }
      },
      rebuyBusiType: {
        get() {
          return "R" + (this.bt ? this.bt : "BT01");
        },
        set() {

        }
      }
    },
    watch: {
      quoteRebuyChangeWin(val) {
        if (val) {
          this.curBatchId = this.batchId;
          if (this.batchId) {
            this.isChange = false;
          } else {
            this.isChange = true;
          }
          this.hasSelect = false;
          this.formItem.showNoticeFirstStationItem = this.showNoticeFirstStationItem;
          this.formItem.isNoticeFirstAudit = this.isNoticeFirstAudit;
          this.init();
          this.billFormItem.batchId = this.curBatchId;
          this.$nextTick(() => {
            /**清除多页选择的数据*/
            this.$refs.billDatagrid.selectIds = [];
            this.$refs.billDatagrid.selects = [];
            this.$refs.billDatagrid.dataChange(1);
          });
          // 转贴现
          if(this.bt==='BT01'){
            getSingleParamValuesByKeys("be.market.BT01_is_asset_industry_choose").then(res=>{
              let isAssetIndustryChose = res["be.market.BT01_is_asset_industry_choose"];
              if (isAssetIndustryChose === "" || isAssetIndustryChose == null || isAssetIndustryChose == undefined) {
                this.isAssetIndustryChooseBoolen = false;
              }else {
                this.isAssetIndustryChooseBoolen = isAssetIndustryChose==="0"?true:false;
              }
            });
            getSingleParamValuesByKeys("be.market.BT01_asset_industry").then(res=>{
              let assetIndustry = res["be.market.BT01_asset_industry"];
              if (assetIndustry === "" || assetIndustry == null || assetIndustry == undefined) {
                this.assetInd = 0;
              }else {
                this.assetInd = assetIndustry;
              }
            })
          }else if (this.bt === 'BT02') {
            //质押式
            getSingleParamValuesByKeys("be.market.BT02_is_asset_industry_choose").then(res=>{
              let isAssetIndustryChose = res["be.market.BT02_is_asset_industry_choose"];
              if (isAssetIndustryChose === "" || isAssetIndustryChose == null || isAssetIndustryChose == undefined) {
                this.isAssetIndustryChooseBoolen = false;
              }else {
                this.isAssetIndustryChooseBoolen = isAssetIndustryChose==="0"?true:false;
              }
            });
            getSingleParamValuesByKeys("be.market.BT02_asset_industry").then(res=>{
              let assetIndustry = res["be.market.BT02_asset_industry"];
              if (assetIndustry === "" || assetIndustry == null || assetIndustry == undefined) {
                this.assetInd = 0;
              }else {
                this.assetInd = assetIndustry;
              }
            });
          }else if (this.bt === 'BT03') {
            //买断式
            getSingleParamValuesByKeys("be.market.BT03_is_asset_industry_choose").then(res=>{
              let isAssetIndustryChose = res["be.market.BT03_is_asset_industry_choose"];
              if (isAssetIndustryChose === "" || isAssetIndustryChose == null || isAssetIndustryChose == undefined) {
                this.isAssetIndustryChooseBoolen = false;
              }else {
                this.isAssetIndustryChooseBoolen = isAssetIndustryChose === "0" ? true : false;
              }
            });
            getSingleParamValuesByKeys("be.market.BT03_asset_industry").then(res=>{
              let assetIndustry = res["be.market.BT03_asset_industry"];
              if (assetIndustry === "" || assetIndustry == null || assetIndustry == undefined) {
                this.assetInd = 0;
              }else {
                this.assetInd = assetIndustry;
              }
            });
          }
        }
      }
    },
    methods: {
      turnForm(formItem, obj) {
        formItem.id = obj.id;
        formItem.busiType = obj.busiType;
        formItem.quoteNo = obj.quoteNo;
        formItem.saleBrchCode = obj.saleBrchCode;
        formItem.saleBrchName = obj.saleBrchName;
        formItem.saleTraderNo = obj.saleTraderNo;
        formItem.saleTraderName = obj.saleTraderName;
        formItem.saleProductNo = obj.saleProductNo;
        formItem.saleProductName = obj.saleProductName;
        formItem.buyBrchCode = obj.buyBrchCode;
        formItem.buyBrchName = obj.buyBrchName;
        formItem.buyTraderNo = obj.buyTraderNo;
        formItem.buyTraderName = obj.buyTraderName;
        formItem.buyProductNo = obj.buyProductNo;
        formItem.buyProductName = obj.buyProductName;
        formItem.subDeal = obj.subDeal;
        formItem.billClass = obj.billClass;
        formItem.billType = obj.billType;
        formItem.clearSpeed = obj.clearSpeed;
        formItem.clearType = obj.clearType;
        formItem.settleMode = obj.settleMode;
        formItem.selectType = obj.selectType;
        formItem.packetSeq = obj.packetSeq;
        formItem.quoteTm = obj.quoteTm;
        formItem.setTm = obj.setTm;
        formItem.firstSettleDt = obj.firstSettleDt;
        formItem.dueSettleDt = obj.dueSettleDt;
        formItem.prodNo = obj.prodNo;
        formItem.ratePct = obj.ratePct;
        formItem.dueRatePct = obj.dueRatePct;
        formItem.totalNum = obj.totalNum;
        formItem.totalAmt = obj.totalAmt;
        formItem.buyBackTotalAmt = obj.buyBackTotalAmt;
        formItem.tenorDays = obj.tenorDays;
        formItem.yieldRatePct = obj.yieldRatePct;
        formItem.firstSettleAmt = obj.firstSettleAmt;
        formItem.dueSettleAmt = obj.dueSettleAmt;
        formItem.firstPayInterest = obj.firstPayInterest;
        formItem.dueInterest = obj.dueInterest;
        formItem.preChangeInfo = obj.preChangeInfo;
        formItem.productMapDict = obj.productMap;
        formItem.workDate = obj.workDate;
        formItem.maxTenorDays = obj.maxTenorDays;
        formItem.minRate = obj.minRate;
        formItem.maxRate = obj.maxRate;
        formItem.isSelectCreditOccupy = obj.isSelectCreditOccupy;
        formItem.isNeedAssetIndustry = obj.isNeedAssetIndustry;
        formItem.isAssetIndustryChoose = obj.isAssetIndustryChoose;
        formItem.defaultAssetIndustry = obj.defaultAssetIndustry;
        formItem.isNeedBookType = obj.isNeedBookType;
        formItem.creditOccupyType = obj.creditOccupyType;
        formItem.batchNo = obj.batchNo;
        formItem.isPreAudit = obj.isPreAudit;
        formItem.auditNo = obj.auditNo;
        formItem.ownedBrchNo = obj.transBrchNo;
        formItem.ownedBrchName = obj.ownedBrchName;
        formItem.isInner = obj.isInner;
        if (!!obj.isNoticeFirstAudit) {
          formItem.isNoticeFirstAudit = obj.isNoticeFirstAudit
        } else {
          formItem.isNoticeFirstAudit = this.isNoticeFirstAudit;//放默认值，老数据
        }
      },
      getParam(isInner) {
        if (this.isInnerDiscSetIndustry === "0" && isInner === "1") {
          this.isShowInner = "0";
        } else {
          this.isShowInner = "1";
        }
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      creditOccupyClose() {
        this.billIds = null;
        this.creditOccupyWin = false;
        /**清除多页选择的数据*/
        this.$refs.billDatagrid.selectIds = [];
        this.$refs.billDatagrid.selects = [];
        this.creditOcc = null;
        this.$refs.billDatagrid.dataChange(1);
      },
      creditOccupyTypeClose() {
        this.creditOccupyTypeWin = false;
        /**清除多页选择的数据*/
        this.$refs.billDatagrid.selectIds = [];
        this.$refs.billDatagrid.selects = [];
        this.creditOccType = null;
        this.batchNo = null;
        this.$refs.billDatagrid.dataChange(1);
      },
      assetIndustryClose() {
        this.billIds = null;
        this.assetIndustryWin = false;
        /**清除多页选择的数据*/
        this.$refs.billDatagrid.selectIds = [];
        this.$refs.billDatagrid.selects = [];
        this.assetInd = null;
        this.$refs.billDatagrid.dataChange(1);
      },
      handleClose() {
        this.initFlag();
        this.userIds = "";
        this.formItem.clearSpeed = '';
        this.billFormItem.batchId = null;
        this.billFormItem.reverseBillNo = "";
        this.billFormItem.billMoneyRange.minBillMoney = "";
        this.billFormItem.billMoneyRange.maxBillMoney = "";
        this.billFormItem.minBillMoney = "";
        this.billFormItem.maxBillMoney = "";
        this.billFormItem.dueDtRange = [];
        this.billFormItem.minDueDt = "";
        this.billFormItem.maxDueDt = "";
        this.billFormItem.acptName = "";
        this.$refs.billDatagrid.showAdvanced = false;
        this.curBatchId = null;
        this.hasSelect = true;
        this.$emit("quoteRebuyChangeWinClose", "");
      },
      //选择记录
      quoteBillSelectClick(arr, selectInx) {
        this.quoteBillSelectList = arr;
        this.quoteBillSelectRowInx = selectInx;
      },
      //保存批次
      saveBatch() {
        this.$refs["formItem"].validate(valid => {
            if (valid) {
              this.$hMsgBox.confirm({
                title: this.$t("m.i.common.confirm"),
                content: this.$t("确认要保存批次吗") + "?",
                onOk: () => {
                  this.editApply();
                }
              });
            }
        });
      },
      //保存
      editApply(optType) {
        if (this.formItem.firstSettleDt) {
          this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, 'YYYY-MM-DD').format('YYYYMMDD');
        }
        if (this.formItem.dueSettleDt) {
          this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, 'YYYY-MM-DD').format('YYYYMMDD');
        }

        this.$refs["formItem"].validate(valid => {
          if (valid) {
            let minRate = this.formItem.minRate ? this.formItem.minRate : 0;
            let maxRate = this.formItem.maxRate ? this.formItem.maxRate : 100;
            let minRateBoolean = this.formItem.ratePct - minRate < 0;
            let maxRateBoolean = this.formItem.ratePct - maxRate > 0;
            let busiType = this.formItem.busiType;
            if (minRateBoolean) {
              if ('BT01' == busiType) {
                this.$msgTip.error(this, {info: "交易利率必须大于等于票交所最小利率参数:" + minRate});
                return;
              } else if ('BT02' == busiType) {
                this.$msgTip.error(this, {info: "回购利率必须大于等于票交所最小利率参数:" + minRate});
                return;
              } else if ('BT03' == busiType) {
                this.$msgTip.error(this, {info: "首期交易利率必须大于等于票交所最小利率参数:" + minRate});
                return;
              }
            }
            if (maxRateBoolean) {
              if ('BT01' == busiType) {
                this.$msgTip.error(this, {info: "交易利率必须小于等于票交所最大利率参数:" + maxRate});
                return;
              } else if ('BT02' == busiType) {
                this.$msgTip.error(this, {info: "回购利率必须小于等于票交所最大利率参数:" + maxRate});
                return;
              } else if ('BT03' == busiType) {
                this.$msgTip.error(this, {info: "首期交易利率必须小于等于票交所最大利率参数:" + maxRate});
                return;
              }
            }
            if ('BT03' == busiType) {
              let minDueRateBoolean = this.formItem.dueRatePct - minRate < 0;
              let maxDueRateBoolean = this.formItem.dueRatePct - maxRate > 0;
              if (minDueRateBoolean) {
                this.$msgTip.error(this, {info: "到期交易利率必须大于等于票交所最小利率参数:" + minRate});
                return;
              }
              if (maxDueRateBoolean) {
                this.$msgTip.error(this, {info: "到期交易利率必须小于等于票交所最大利率参数:" + maxRate});
                return;
              }
            }
            if ('BT03' == busiType || 'BT02' == busiType) {
              let maxTenorDays = this.formItem.maxTenorDays ? this.formItem.maxTenorDays : 365;
              if (parseInt(this.formItem.tenorDays) > parseInt(maxTenorDays)) {
                this.$msgTip.error(this, {info: "回购期限不能大于" + maxTenorDays + "天"});
                return;
              }
            }
            let url = '/be/market/quote/quoteManager/func_editRebuyApply';
            this.formItem.liFlag = this.licenseFlag;
            post(this.formItem, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  if (optType) {
                    this.init(optType);
                  } else {
                    this.init();
                    this.$refs.billDatagrid.dataChange(1);
                    /**清除多页选择的数据*/
                    this.$refs.billDatagrid.selectIds = [];
                    this.$refs.billDatagrid.selects = [];
                    this.$msgTip.success(this);
                  }
                } else {
                  if (this.formItem.firstSettleDt) {
                    this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, 'YYYYMMDD').format('YYYY-MM-DD');
                  }
                  if (this.formItem.dueSettleDt) {
                    this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, 'YYYYMMDD').format('YYYY-MM-DD');
                  }
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                if (this.formItem.firstSettleDt) {
                  this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, 'YYYYMMDD').format('YYYY-MM-DD');
                }
                if (this.formItem.dueSettleDt) {
                  this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, 'YYYYMMDD').format('YYYY-MM-DD');
                }
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },

      // 利息计算
      calcInterest() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要计算利息吗") + "?",
          onOk: () => {
            this.editApply("calcInterest");
          }
        });
      },
      calcInterestCallback() {
        if (this.formItem.id) {
          let id = this.formItem.id;
          let url = "/be/market/quote/quoteManager/func_calcRebuyInterest";
          post({id: id}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.curBatchId = this.formItem.id;
                this.init();
                this.$refs.billDatagrid.dataChange(1);
                /**清除多页选择的数据*/
                this.$refs.billDatagrid.selectIds = [];
                this.$refs.billDatagrid.selects = [];
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
            }
          });
        }
      },
      // 提交申请
      // 提交申请
      apply() {
        post({ prodNo:  this.formItem.prodNo}, "/bm/audit/audit/func_checkIsNeedToAudit").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === true){
                this.isNeedToAudit = 1;
              }else{
                this.isNeedToAudit = 0;
              }
              // 有审批时选择审批岗用户
              if (this.isNeedToAudit == '1'){
                this.$hMsgBox.confirm({
                  title: "确认",
                  content: "是否需要选择审批首岗？",
                  onOk: () => {
                    this.prodNo = this.formItem.prodNo;
                    this.billType = this.formItem.billType;
                    this.billClass = this.formItem.billClass;
                    this.auditWin = true;
                  },
                  onCancel: () =>{
                    // 无审批直接提交
                    this.applyWin = true;
                    this.applyTitle = "确认要提交申请吗?";
                  }
                });

              }else{
                // 无审批直接提交
                this.applyWin = true;
                this.applyTitle = "确认要提交申请吗?";
              }
            } else {
              this.isNeedToAudit = "0";
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      applyClose() {
        this.applyWin = false;
        this.applyTitle = "";
      },
      applyCommit() {
        this.editApply("apply");
        this.applyWin = false;
        this.applyTitle = "";
      },
      applyCallback() {
        this.initFlag();
        if (this.formItem.id) {
          let id = this.formItem.id;
          let url = "/be/market/quote/quoteManager/func_commitRebuyApply";
          post({id: id, riskFlag: this.riskFlag, preFlag: this.preFlag, userIds:this.userIds}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                let obj = res.data.retData;
                let riskInfo = obj.riskInfo;
                let preAuditInfo = obj.preAuditInfo;
                if (riskInfo) {
                  this.riskFlag = "1";
                  this.continueApply(riskInfo, id);
                } else if (preAuditInfo) {
                  this.preFlag = "1";
                  this.continueApply(preAuditInfo, id);
                } else {
                  this.$msgTip.success(this);
                  /**清除多页选择的数据*/
                  this.$refs.billDatagrid.selectIds = [];
                  this.$refs.billDatagrid.selects = [];
                  this.handleClose();
                }
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
            }
          });
        }
      },
      continueApply(content, id) {
        let url = "/be/market/quote/quoteManager/func_commitRebuyApply";
        this.$hMsgBox.confirm({
          title: "确认要继续提交申请吗?",
          content: content,
          onOk: () => {
            post({id: id, riskFlag: this.riskFlag, preFlag: this.preFlag, userIds:this.userIds}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let obj = res.data.retData;
                  let riskInfo = obj.riskInfo;
                  let preAuditInfo = obj.preAuditInfo;
                  if (riskInfo) {
                    this.riskFlag = "1";
                    this.continueApply(riskInfo, id);
                  } else if (preAuditInfo) {
                    this.preFlag = "1";
                    this.continueApply(preAuditInfo, id);
                  } else {
                    this.$msgTip.success(this);
                    /**清除多页选择的数据*/
                    this.$refs.billDatagrid.selectIds = [];
                    this.$refs.billDatagrid.selects = [];
                    this.handleClose();
                  }
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      initFlag() {
        this.riskFlag = "0";
        this.preFlag = "0";
      },
      // 预删除票据
      preDelBill() {
        if (this.formItem.id) {
          let list = this.$refs.billDatagrid.selects;
          if (list.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要预删除票据吗") + "?",
            onOk: () => {
              let ids = "";
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              let url = "/be/market/quote/quoteManager/func_removeRebuyBill";
              let batchId = this.formItem.id;
              post({batchId: batchId, ids: ids}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.init();
                    this.$refs.billDatagrid.dataChange(1);
                    /**清除多页选择的数据*/
                    this.$refs.billDatagrid.selectIds = [];
                    this.$refs.billDatagrid.selects = [];
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError') + error});
              })
            }
          });
        }
      },
      // 恢复预删除
      replyDel() {
        if (this.formItem.id) {
          let list = this.$refs.billDatagrid.selects;
          if (list.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要恢复预删除票据吗") + "?",
            onOk: () => {
              let ids = "";
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              let url = "/be/market/quote/quoteManager/func_restoreRebuyBill";
              let batchId = this.formItem.id;
              post({batchId: batchId, ids: ids}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.batchId = this.formItem.id;
                    this.init();
                    this.$refs.billDatagrid.dataChange(1);
                    /**清除多页选择的数据*/
                    this.$refs.billDatagrid.selectIds = [];
                    this.$refs.billDatagrid.selects = [];
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError') + error});
              })
            }
          });
        }
      },
      resetRebuyQuote() {
        if (this.formItem.id) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要报价重置吗") + "?",
            onOk: () => {
              let url = "/be/market/quote/quoteManager/func_resetLastRebuyQuote";
              let batchId = this.formItem.id;
              post({id: batchId}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.init();
                    this.$refs.billDatagrid.dataChange(1);
                    /**清除多页选择的数据*/
                    this.$refs.billDatagrid.selectIds = [];
                    this.$refs.billDatagrid.selects = [];
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError') + error});
              })
            }
          });
        }
      },
      // 修改额度对象
      editLimitObj() {
        if (this.curBatchId) {
          let list = this.$refs.billDatagrid.selects;
          if (list.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            return;
          }
          let ids = "";
          let creditOccType = '';
          let isCreditOccType = true;
          for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            ids += obj.id;
            if (creditOccType) {
              if (isCreditOccType) {
                if (!(creditOccType === obj.creditOccupyType)) {
                  isCreditOccType = false;
                }
              }
            } else {
              creditOccType = obj.creditOccupyType;
            }
            if (i < list.length - 1) {
              ids += ",";
            }
          }
          this.billIds = ids;
          if (isCreditOccType) {
            this.creditOcc = creditOccType;
          } else {
            this.creditOcc = this.formItem.creditOccupyType;
          }
          this.creditOccupyWin = true;
        }

      },
      editLimitTypeObj() {
        if (this.curBatchId) {
          this.batchNo = this.formItem.batchNo;
          this.creditOccType = this.formItem.creditOccupyType;
          this.creditOccupyTypeWin = true;
        }
      },
      // 设置资产分类
      setAssetType() {
        let list = this.$refs.billDatagrid.selects;
        let ids = "";
        let assetInd = '';
        let isAssetIndustry = true;
        for (let i = 0; i < list.length; i++) {
          let obj = list[i];
          ids += obj.id;
          if (assetInd) {
            if (isAssetIndustry) {
              if (!(assetInd === obj.assetIndustry)) {
                isAssetIndustry = false;
              }
            }
          } else {
            assetInd = obj.assetIndustry;
          }
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.billIds=ids;
        this.isNeedBookTypeBoolen=(this.formItem.isNeedBookType=='1'?true:false);
        this.dictMap.assetIndustryList=this.dictMap.assetIndustryList=this.dictMap.assetIndustryListOne;
        this.assetIndustryWin=true;
      },
      // 导出清单
      exportBill() {
        if (this.formItem.id) {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/quoteManager/func_downloadRebuyInfo";
          let form = document.createElement('form');
          form.setAttribute("id", "formId");
          form.setAttribute('action', url);
          form.setAttribute("method", "post");
          let input = document.createElement('input');
          input.setAttribute("name", "batchId");
          input.setAttribute("value", this.formItem.id);
          form.appendChild(input);
          let list = this.$refs.billDatagrid.selects;
          if (list.length > 0) {
            let ids = "";
            for (let i = 0; i < list.length; i++) {
              ids += list[i].id;
              if (i < list.length - 1) {
                ids += ",";
              }
            }
            let input2 = document.createElement('input');
            input2.setAttribute("name", "ids");
            input2.setAttribute("value", ids);
            form.appendChild(input2);
          }

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      // 打印清单
      printBill() {
        this.showRebuyDetilPrint = true;
      },
      //关闭打印窗口
      closeDetilPrint(i) {
        this.showRebuyDetilPrint = false;
      },
      deletePreAudit() {
        if (this.formItem.id) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要清除预审批单吗") + "?",
            onOk: () => {
              let url = "/be/market/quote/quoteManager/func_deleteRebuyPreAudit";
              let batchId = this.formItem.id;
              post({id: batchId}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError') + error});
              })
            }
          });
        } else {
          this.formItem.auditNo = "";
        }
      },
      //  初始化页面
      init(optType) {
        let batchId = this.curBatchId;
        let busiType = this.bt;
        let url = '';
        if (batchId) {
          url = '/be/market/quote/quoteManager/func_findRebuyBatchById';
        } else {
          this.$msgTip.error(this, {info: "请选择一条记录"});
        }
        post({id: batchId, busiType: busiType}, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                //控制某列显隐
                const columns = this.columns;
                let creditOccupyTypeCol = null;
                let assetIndustryCol = null;
                let bookTypeCol = null;
                for (let column of columns) {
                  if (column.key === 'creditOccupyType') {
                    creditOccupyTypeCol = column;
                    continue;
                  } else if (column.key === 'assetIndustry') {
                    assetIndustryCol = column;
                    continue;
                  } else if (column.key === 'bookType') {
                    bookTypeCol = column;
                    continue;
                  }
                }
                if (creditOccupyTypeCol != null) {
                  creditOccupyTypeCol.hiddenCol = (obj.isSelectCreditOccupy == "1" ? false : true);
                }
                if (assetIndustryCol != null) {
                  assetIndustryCol.hiddenCol = (obj.isNeedAssetIndustry == "1" ? false : true);
                }
                if (bookTypeCol != null) {
                  bookTypeCol.hiddenCol = (obj.isNeedBookType == "1" ? false : true);
                }
                this.turnForm(this.formItem, obj);
                this.getParam(this.formItem.isInner);
                this.formItem.busiType = busiType;
                if (this.formItem.firstSettleDt) {
                  this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, 'YYYYMMDD').format('YYYY-MM-DD');
                } else {
                  this.formItem.firstSettleDt = this.$moment(obj.workDate, 'YYYYMMDD').format('YYYY-MM-DD');
                }
                if (this.formItem.dueSettleDt) {
                  this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, 'YYYYMMDD').format('YYYY-MM-DD');
                }
                if ("calcInterest" == optType) {
                  this.calcInterestCallback();
                } else if ("apply" == optType) {
                  this.applyCallback();
                }
              });
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError') + error});
        })
      },
      // 组件中获取的金额区间赋值到传输到后台的最大最小金额上
      billMoneyRangeChange(billMoneyRange) {
        if (billMoneyRange != null) {
          this.billFormItem.minBillMoney = billMoneyRange.minBillMoney;
          this.billFormItem.maxBillMoney = billMoneyRange.maxBillMoney;
        }
      },
      queryAudit() {
        this.showFirstAuditStationAndUserWin = true;
      },
      clearAudit() {
        this.auditFormItem.userIds = "";
        this.auditFormItem.userNames = "";
      },
      showFirstAuditStationAndUserWinClose() {
        this.showFirstAuditStationAndUserWin = false;
      },
      auditSelect(info) {
        this.auditFormItem.userIds = info.userIds;
        this.auditFormItem.userNames = info.userName;
        this.showFirstAuditStationAndUserWin = false;
      },
      //审批确认
      auditSubmit() {
        this.userIds = this.auditFormItem.userIds;
        this.auditClose();
        this.applyWin = true;
        this.applyTitle = "确认要提交申请吗?";
      },
      //审批关闭
      auditClose() {
        this.$nextTick(() => {
          this.prodNo = "";
          this.billType = "";
          this.billClass = "";
          this.auditWin = false;
          this.$refs.auditFormItem.resetFields();
          this.auditFormItem.userIds = "";
          this.auditFormItem.userNames = "";
        });
      },
    },
    created() {
      this.openI9flag = window.sessionStorage.getItem('isOpenI9') == '1' ? true : false;
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
      getSingleParamValuesByKeys("bm.valuate.is_inner_set_valuate").then(res => {
        let isResetIndustry = res["bm.valuate.is_inner_set_valuate"];
        if (isResetIndustry === "" || isResetIndustry == null || isResetIndustry == undefined) {
          this.isInnerDiscSetIndustry = "0";
        } else {
          this.isInnerDiscSetIndustry = isResetIndustry;
        }
      });
    },
    mounted() {
      this.$nextTick(()=>{
        this.advancedParams = {
          formItem: this.billFormItem,
          formItemCols: 2,
          componentList: [
            {
              model: 'reverseBillNo',
              componentName: "commonInput",
              componentProps: {
                label: this.$t('m.i.billInfo.billPackageNo'),
                prop: "reverseBillNo",
                className: "h-form-long-label",
              },
              componentOns: {}
            },
            {
              componentName: "billMoneyRange",
              model: 'billMoneyRange',
              componentProps: {
                label: this.$t('m.i.billInfo.billPackageMoney'),
                prop: "billMoneyRange",
                className: "h-form-long-label",
                bigTips: false,
              },
              componentOns: {}
            },
            {
              componentName: "dueDtRange",
              model: 'dueDtRange',
              componentProps: {
                label: this.$t('m.i.billInfo.dueDt'),
                prop: "dueDtRange",
                className: "h-form-long-label",
                transfer: true,
              },
              componentOns: {
                input: (date) => {
                  if (date && date.length >= 2) {
                    this.billFormItem.minDueDt = date[0].replace(/-/g, "");
                    this.billFormItem.maxDueDt = date[1].replace(/-/g, "");
                    this.billFormItem.dueDtRange = [date[0], date[1]];
                  } else {
                    this.billFormItem.minDueDt = "";
                    this.billFormItem.maxDueDt = "";
                    this.billFormItem.dueDtRange = [];
                  }
                }
              }
            },
            {
              componentName: "commonInput",
              model: 'acptName',
              componentProps: {
                label: this.$t('m.i.billInfo.acptName'),
                prop: "acptName",
                className: "h-form-long-label",
              },
              componentOns: {}
            },
          ],
          formSearch: ()=>{
            this.billMoneyRangeChange(this.billFormItem.billMoneyRange);
            this.$refs.billDatagrid.dataChange(1);
            this.$refs.billDatagrid.showAdvanced = false;
          },
          formSearchReset: ()=> {
            this.billFormItem.reverseBillNo = "";
            this.billFormItem.billMoneyRange.minBillMoney = "";
            this.billFormItem.billMoneyRange.maxBillMoney = "";
            this.billFormItem.minBillMoney = "";
            this.billFormItem.maxBillMoney = "";
            this.billFormItem.dueDtRange = [];
            this.billFormItem.minDueDt = "";
            this.billFormItem.maxDueDt = "";
            this.billFormItem.acptName = "";
          },
        }
      });
    }
  }
</script>

