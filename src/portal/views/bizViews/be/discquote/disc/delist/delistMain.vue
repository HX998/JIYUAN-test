<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <batch-no v-model="formItem.batchNo" :maxlength="30"></batch-no>
                <common-input v-model="formItem.discCustName" :label="$t('m.i.ce.discountApplyName')"
                              class="h-form-long-label" prop="discCustName"></common-input>
                <common-input v-model="formItem.discCustSocCode" class="h-form-long-label" prop="discCustSocCode"
                              :label="$t('m.i.ce.discountApplySocCode')" :maxlength="18"></common-input>
                <common-select v-model="formItem.isAllowBargain" :label="$t('m.i.be.isAllowBargain')"
                               prop="isAllowBargain"
                               :dictList="yonList"></common-select>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-money-range v-model="formItem" :rangeProps="['minTotalAmt','maxTotalAmt']" class="h-form-long-label"
                                  :bigTips="false" :label="$t('m.i.be.totalAmtBillPackage')"></bill-money-range>
                <common-type-field-range v-model="formItem" :rangeProps="['minRatePct','maxRatePct']"
                                         :label="$t('m.i.pe.discRate')" prop="ratePct" :bigTips="false"
                                         :validRules="discRateValidRules" :integerNum="2" :suffixNum="4"></common-type-field-range>
                <common-input-range v-model="formItem" :rangeProps="['minRemainDaysLess','maxRemainDaysLess']"
                                    :label="$t('m.i.be.remainingPeriod')" prop="remainingPeriod"
                                    :bigTips="false" type="int" :maxlength="3"></common-input-range>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/be/discquote/disc/delist/delistMain/func_getDiscDelistingList"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="delistCancel">{{$t("m.i.be.delistCancel")}}</h-button>
              <h-button type="primary" @click="delistDeal">{{$t("m.i.be.delistDeal")}}</h-button>
              <h-button type="primary" @click="changeToQuot">{{$t("m.i.be.changeToQuot")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <listing-detail :listingDetailWin="listingDetailWin" :detailParams="detailParams"
                    @listingDetailWinClose="listingDetailWinClose" showType="appl"
                    :billsUrl="billsUrl" :exportUrl="exportUrl" :delistDealFun="endrsmtCheckWinShow"></listing-detail>

    <!-- 二次确认弹窗 -->
    <h-msg-box v-model="confirmAgainWin" :maximize="false" width="400" :footerHide="true" :closable="false"
               :z-index="2010">
      <div class="modal-body">
        <div class="h-modal-confirm">
          <div class="h-modal-confirm-head">
            <div class="h-modal-confirm-head-icon h-modal-confirm-head-icon-confirm">
              <i class="h-icon iconfont icon-feedback"></i>
            </div>
            <div class="h-modal-confirm-head-title">确认</div>
          </div>
          <div class="h-modal-confirm-body">
            <div>风险检查成功,确定提交申请吗</div>
          </div>
          <div class="h-modal-confirm-footer">
            <button type="button" @click="confirmAgainClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span>
            </button>
            <button type="button" @click="handleSubmit()" class="h-btn h-btn-primary h-btn-large"><span>确定</span>
            </button>
          </div>
        </div>
      </div>
    </h-msg-box>

    <endrsmt-check :endrsmtParams="endrsmtParams" :showEDiscEndrsmtCheckWin="showEDiscEndrsmtCheckWin"
                   @endrsmtCheckWinClose="endrsmtCheckWinClose"
                   @endrsmtCheckWinSubmit="endrsmtCheckWinSubmit"></endrsmt-check>

    <!--风险信息-->
    <risk-check :riskCheckWin="riskCheckWin" :riskParams="riskParams" @riskCheckWinClose="riskCheckWinClose"
                @riskCheckSubmit="riskCheckSubmit"></risk-check>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "delistMain",
    components: {
      ListingDetail: () => import(/* webpackChunkName: "be/discquote/disc/delist/listingDetail" */`@/views/bizViews/be/discquote/disc/delist/listingDetail`),
      EndrsmtCheck: () => import(/* webpackChunkName: "ce/disc/elec/apply/eDiscEndrsmtCheck" */`@/views/bizViews/ce/disc/elec/apply/eDiscEndrsmtCheck`),
    },
    data() {
      return {
        formItem: {
          batchNo: "",
          discCustName: "",
          discCustSocCode: "",
          isAllowBargain: "",
          billType: "",
          minTotalAmt: "",
          maxTotalAmt: "",
          minRatePct: "",
          maxRatePct: "",
          minRemainDaysLess: "",
          maxRemainDaysLess: ""
        },
        detailParams: {
          batchId: "",
          dictMap: new Map()
        },
        dictMap: new Map(),
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showDetail(params.row.id);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t("m.i.be.quoteStatus"),
            key: "quoteStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DiscQuoteStatus", params.row.quoteStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "busiNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.respTm"),
            key: "respTm",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.brchName"),
            key: "discBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.traderName"),
            key: "discTraderName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.discountApplyName"),
            key: "discCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.discountApplySocCode"),
            key: "discOutSocCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discCorpScale"),
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.discIndustry"),
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Industry", params.row.discIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isDiscArc"),
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscArc);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isDiscGreen"),
            key: "isDiscGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscGreenCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isDiscTechnologyCorp"),
            key: "isDiscTechnologyCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscTechnologyCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isDiscPrivateCorp"),
            key: "isDiscPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscPrivateCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.discProv"),
            key: "area",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Province", params.row.area);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isAllowBargain"),
            key: "isBargain",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isBargain);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.totalAmtBillPackage"),
            key: "totalAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.pe.discRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
            sortMethod:(a,b,type)=>{
              if (type==="asc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1-a2;
              }else if (type==="desc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2-a1;
              }
            }
          },
          {
            title: this.$t("m.i.be.remainingPeriod"),
            key: "remainDays",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.settleDt"),
            key: "firstSettleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let settleDt = this.$moment(params.row.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", settleDt);
            }
          },
          {
            title: this.$t("m.i.be.clearSpeed"),
            key: "clearSpeed",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ClearSpeed", params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.settleMode"),
            key: "clearMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.clearMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "firstPayInterest",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "firstSettleAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.discApplMemberId"),
            key: "discApplMemberId",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.distType"),
            key: "discApplDistType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DistTypeCode", params.row.discApplDistType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.be.discApplAcctNo"),
            key: "discApplAcctNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.discApplAcctName"),
            key: "discApplAcctName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.discOutBrchCode"),
            key: "discOutBrchCode",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.aoAcctNo"),
            key: "discApplAoAcctNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.aoAcctName"),
            key: "discApplAoAcctName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.aoAcctBrchCode"),
            key: "discApplAoAcctBrchCode",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.fileNum"),
            key: "fileNum",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ],
        discRateValidRules: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        yonList: [],
        billTypeList: [],
        fileDetailStatusList: [],
        attTypeCodeList: [],
        currentSelectRow: null,
        ifShowMore: false,
        listingDetailWin: false,
        confirmAgainWin: false,
        showEDiscEndrsmtCheckWin: false,
        riskCheckWin: false,
        billsUrl: "/be/discquote/disc/delist/delistMain/func_getListingBillList",
        batchUrl: "/be/discquote/disc/delist/delistMain/func_getDelistingBatch",
        exportUrl: "/be/discquote/disc/delist/delistMain/func_downloadDiscDelistBill",
        filePathUrl: "/be/discquote/disc/delist/delistMain/",
        endrsmtParams: {
          batchId: "",
          ids: "",
          backFlag: "0",
          impawnFlag: "0",
          sameFlag: "0",
          blackFlag: "0",
          endrsmtCheckUrl: "",
          blackEndrsmtCheckUrl: ""
        },
        batchId: null,
        riskParams: {},
      };
    },
    mounted() {
      this.getDictListByGroups("DiscQuoteStatus,Yon,DraftTypeCode,CorpScale,Industry,Province,CDMedia,ClearSpeed,DCBusiType,BillOrigin,DistTypeCode,SettleType,FileDetailStatus,AttTypeCode,PreRelationFlag").then(res => {
        this.fileDetailStatusList = res.get("FileDetailStatus");
        this.attTypeCodeList = res.get("AttTypeCode");
        this.yonList = res.get("Yon");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //查询
      handleSearch(pageNo) {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      showDetail(id) {
        this.detailParams.batchId = id;
        this.detailParams.filePathUrl = this.filePathUrl;
        this.detailParams.dictMap = this.dictMap;
        this.detailParams.fileDetailStatusList = this.fileDetailStatusList;
        this.detailParams.attTypeCodeList = this.attTypeCodeList;
        this.listingDetailWin = true;
      },
      listingDetailWinClose() {
        this.listingDetailWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      delistCancel() {
        if (this.currentSelectRow) {
          this.$hMsgBox.confirm({
            title: "摘牌取消信息",
            content: "确定要摘牌取消吗？",
            onOk: () => {
              let params = { batchId: this.currentSelectRow.id, sgnupMk: "1" };
              let url = "/be/discquote/disc/delist/delistMain/func_delistingAnswer";
              this.sendPost(params, url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      delistDeal() {
        if (this.currentSelectRow) {
          this.batchId = this.currentSelectRow.id;
          let params = { batchId: this.currentSelectRow.id, billOrigin: this.currentSelectRow.billOrigin};
          this.endrsmtCheckWinShow(params);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      changeToQuot() {
        if (this.currentSelectRow) {
          this.$hMsgBox.confirm({
            title: "转对话报价信息",
            content: "确定要转对话报价吗？",
            onOk: () => {
              let params = { batchId: this.currentSelectRow.id };
              let url = "/be/discquote/disc/delist/delistMain/func_changeDelistingToQuote";
              this.sendPost(params, url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.currentSelectRow = null;
              this.batchId = null;
              this.handleSearch(1);
              this.$msgTip.success(this);

              if (!!this.listingDetailWin) {
                this.listingDetailWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      endrsmtCheckWinShow(params) {
        this.batchId = params.batchId;
        if ("CS01" === params.billOrigin) {
          this.handleSubmitAgain(this.batchId);
          return;
        }
        post({bn: "0"}, "/be/discquote/disc/delist/delistMain/func_getEndrsmtCheckParams").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let rs = res.data.retData;
              this.endrsmtParams.backFlag = rs[0];
              this.endrsmtParams.impawnFlag = rs[1];
              this.endrsmtParams.sameFlag = rs[2];
              this.endrsmtParams.blackFlag = rs[3];
              if (this.endrsmtParams.backFlag === '0'
                && this.endrsmtParams.impawnFlag === '0'
                && this.endrsmtParams.sameFlag === '0'
                && this.endrsmtParams.blackFlag === '0') {
                //无需校验背书风险类型
                this.getRiskBillNo(params);
              } else {
                this.endrsmtParams.batchId = params.batchId;
                this.endrsmtParams.endrsmtCheckUrl = "/be/discquote/disc/delist/delistMain/func_getEndrsmtCheckResult";
                this.endrsmtParams.blackEndrsmtCheckUrl = "/be/discquote/disc/delist/delistMain/func_getBlackEndrsmtCheckResult";
                this.showEDiscEndrsmtCheckWin = true;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });

      },

      endrsmtCheckWinClose() {
        this.showEDiscEndrsmtCheckWin = false;
        this.endrsmtParams = {
          batchId: "",
          ids: "",
          backFlag: "0",
          impawnFlag: "0",
          sameFlag: "0",
          blackFlag: "0",
        }
      },

      endrsmtCheckWinSubmit(params) {
        this.showEDiscEndrsmtCheckWin = false;
        this.getRiskBillNo(params)
      },
      //提交前先调用风险检查接口
      getRiskBillNo(params) {
        post(params, "/be/discquote/disc/delist/delistMain/func_getRiskBillNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let data = res.data.retData;
            if (retCode === "000000") {
              if (Object.keys(data).length > 0) {
                this.riskParams.gridDatas = data;
                this.riskParams.submitParams = params;
                this.riskParams.YonList = this.yonList;
                this.riskCheckWin = true;
              } else {
                this.confirmAgainWin = true;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      confirmAgainClose() {
        this.confirmAgainWin = false;
      },
      handleSubmit(info, isRiskCkeck) {
        if (isRiskCkeck) {
          this.riskCheckWinClose(info);
        }
        this.confirmAgainWin = false;
        let params = {};
        params = {batchId: this.batchId};
        post(params, "/be/discquote/disc/delist/delistMain/func_whiteRollCheck").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (msg === null) {
                this.handleSubmitAgain(this.batchId)
              } else {
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: msg,
                  height: 300,
                  onOk: () => {
                    this.handleSubmitAgain(this.batchId);
                  }
                });
              }
            } else {
              this.$msgTip.error(this, {info: msg});
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.$refs.gridPage.clearElevator();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      //风险票据检查界面关闭
      riskCheckWinClose() {
        this.riskParams = {};
        this.riskCheckWin = false;
      },
      //风险票据检查界面提交
      riskCheckSubmit(info) {
        this.handleSubmit(info, true);
      },
      handleSubmitAgain(batchId) {
        let params = { batchId: batchId, sgnupMk: "2" };
        let url = "/be/discquote/disc/delist/delistMain/func_delistingAnswer";
        this.sendPost(params, url);
      }
    }
  };
</script>

<style scoped>

</style>
