<template>
  <div>
    <h-msg-box v-model="tempPreAuditChangeWin" :mask-closable="false" @on-close="handleClose" :maximize="true"
               width="1000" :height="600" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div>
        <h-form :model="formItem" :label-width="100" ref="formItem" cols="3" class="h-form-search"
                onlyBlurRequire>
          <quote-input :busiType="bt" :isChange="isChange" :formItem="formItem" :dictMap="dictMap" :brchType="formItem.brchType"
                       :isClose="this.isClose" :preAuditChangeWin="tempPreAuditChangeWin" >
            <div slot="save">
              <h-form-item label="" prop="save" class="h-form-three">
                <h-button type="primary" @click="savePreAuditBatch()">{{$t('m.i.common.save')}}</h-button>
              </h-form-item>
            </div>
          </quote-input>
        </h-form>
      </div>
      <!-- 数据展示表格 -->
      <h-datagrid :columns="columns"
                  url="/be/market/preaudit/preAuditMain/func_findBillByBatchIdByPage"
                  :bindForm="billFormItem"
                  :onSelectChange="quoteBillSelectClick"
                  :rowSelect="true"
                  :auto-load="false"
                  ref="billDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="pickBill()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.common.pickBill')}}</h-button>
          <h-button type="primary" @click="importPickBill()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.common.exportPickBill')}}</h-button>
          <h-button type="primary" @click="addBill()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.be.addBill')}}</h-button>
          <h-button type="primary" @click="editBill()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.be.editBill')}}</h-button>
          <h-button type="primary" @click="pickPackBill()" v-if="'BT02'==bt" :disabled="this.formItem.selectType !== 'CSM02'">{{$t('m.i.be.pickPacketBill')}}</h-button>
          <h-button type="primary" @click="calcInterest()">{{$t('m.i.be.calcInterest')}}</h-button>
          <h-button type="primary" @click="applyBatch()">{{$t('m.i.be.applyBatch')}}</h-button>
          <h-button type="primary" @click="clearPack()" v-if="'BT02'==bt" :disabled="this.formItem.selectType !== 'CSM02'">{{$t('m.i.be.clearPacket')}}</h-button>
          <h-button type="primary" @click="deleteBill()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.be.deleteBill')}}</h-button>
          <h-button type="primary" @click="downMoudle()" :disabled="this.formItem.selectType === 'CSM02'">{{$t('m.i.common.templateDownload')}}</h-button>
          <h-button type="primary" @click="replyDel()">{{$t('m.i.be.replyDel')}}</h-button>
          <h-button type="primary" @click="exportBill()" :disabled="exportBillCommit">{{$t('m.i.common.exportExcel')}}</h-button>
          <h-button type="primary" @click="printBill()">{{$t('m.i.be.printBill')}}</h-button>
        </div>
      </h-datagrid>
    </h-msg-box>

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
            <button type="button" @click="applyClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span>
            </button>
            <button type="button" @click="applyCommit()" class="h-btn h-btn-primary h-btn-large">
              <span>确定</span>
            </button>
          </div>
        </div>
      </div>
    </h-msg-box>

    <!-- 批量导入-->
    <upload
      :uploadUrl="uploadUrl"
      :batchId="curBatchId"
      :isLock="isLock"
      @uploadWinClose="uploadWinClose"
      @handleUploadSuccess="handleUploadSuccess"
      :uploadWin="uploadWin"
      :importSelect="importSelect"
      :selectDataFirst="selectDataFirst">
    </upload>
    <pickBill
      :pickBillUrl="pickBillUrl"
      :batchId="curBatchId"
      :billType="billType"
      :billClass="billClass"
      :settleDt="formItem.dueSettleDt ? formItem.dueSettleDt : formItem.firstSettleDt"
      :isLock="isLock"
      :busiType="busiType"
      :dictMap="dictMap"
      @pickBillWinClose="pickBillWinClose"
      :pickBillWin="pickBillWin">
    </pickBill>
    <pickPackBill
      :pickPackBillUrl="pickPackBillUrl"
      :batchId="curBatchId"
      :billType="formItem.billType"
      :billClass="formItem.billClass"
      :dictMap="dictMap"
      :firstSettleDt="formItem.firstSettleDt"
      :dueSettleDt="formItem.dueSettleDt"
      @pickPackBillWinClose="pickPackBillWinClose"
      :pickPackBillWin="pickPackBillWin">
    </pickPackBill>
    <pre-audit-detail-print :batchId="curBatchId" :dictMap="dictMap.dictListMap" :busiType="bt"
                            :preAuditPrintWin="preAuditPrintWin"
                            @closeMsgBox="closeDetilPrint()"></pre-audit-detail-print>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <edit-bill-info :billClass="formItem.billClass" :billType="formItem.billType" :batchId="curBatchId"
                    :billId="billInfoId" :dictMap="dictMap"
                    :editBillInfoWin="editBillInfoWin"
                    @editBillInfoCommit="editBillInfoCommit"
                    @editBillInfoWinClose="editBillInfoWinClose"></edit-bill-info>
  </div>
</template>
<script>
  import { post,formatNumber,getDictValueFromMap,getUploadImgType,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "preAuditChange",
    data() {
      return {
        formItem : {
          id: "",
          busiType: "",
          trDir: "",
          preAuditNo: "",
          brchCode: "",
          brchName: "",
          traderNo: "",
          traderName: "",
          productNo: "",
          productName: "",
          custBrchCode: "",
          custBrchName: "",
          custTraderNo: "",
          custTraderName: "",
          custProductNo: "",
          custProductName: "",
          subDeal: "",
          billClass: "",
          billType: "",
          clearSpeed: "",
          settleMode: "",
          selectType: "",
          packetSeq: "",
          firstSettleDt: "",
          dueSettleDt: "",
          prodNo: "",
          ratePct: "",
          dueRatePct: "",
          totalNum: "",
          totalAmt: "",
          buyBackTotalAmt: "",
          tenorDays: "",
          yieldRatePct: "",
          firstSettleAmt: "",
          dueSettleAmt: "",
          firstPayInterest: "",
          dueInterest: "",
          productMapDict: "",
          workDate: "",
          maxTenorDays: "",
          brchType: "",
          minRate: "",
          maxRate: ""
        },
        columns : [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.status'),
            key: "preRelationFlag",
            hiddenCol: false,
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
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: "dueMatDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false,

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
            hiddenCol: false,

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

          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap.dictListMap, 'AssetIndustry', params.row.assetIndustry);
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
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dueRemainDays'),
            key: "dueRemainDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("span", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("span", formatNumber(params.row.dueInterest, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("span", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h("span", formatNumber(params.row.dueSettleAmt, 2, ","));
            },
          }
        ],
        hasSelect : false,
        applyWin : false,
        editBillInfoWin : false,
        applyTitle : "",
        billInfoId : null,
        preAuditPrintWin : false,
        isClose : false,
        curBatchId: this.curBatchId,
        isChange: false,
        billFormItem: { batchId: this.curBatchId },
        uploadUrl: "",
        uploadWin: false,
        importSelect: false,
        selectDataFirst: false,
        quoteBillSelectList: [],
        quoteBillSelectRowInx: [],
        pickPackBillWin: false,
        pickPackBillUrl: "",
        pickBillUrl: "",
        pickBillWin: false,
        billType: "",
        billClass: "",
        busiType: "",
        exportBillCommit: false,
        isLock: null,
        showBillInfoWin: false,
        showSaleDetilPrint: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
      };
    },
    components: {
      QuoteInput:()=>import(/* webpackChunkName: "be/market/preaudit/preAuditInput" */`@/views/bizViews/be/market/preaudit/preAuditInput`),
      PickBill:()=>import(/* webpackChunkName: "be/market/preaudit/pickBill" */`@/views/bizViews/be/market/preaudit/pickBill`),
      Upload:()=>import(/* webpackChunkName: "be/market/preaudit/upload" */`@/views/bizViews/be/market/preaudit/upload`),
      PickPackBill:()=>import(/* webpackChunkName: "be/market/preaudit/pickPackBill" */`@/views/bizViews/be/market/preaudit/pickPackBill`),
      PreAuditDetailPrint:()=>import(/* webpackChunkName: "be/market/preaudit/preAuditDetailPrint" */`@/views/bizViews/be/market/preaudit/preAuditDetailPrint`),
      EditBillInfo:()=>import(/* webpackChunkName: "be/market/preaudit/editBillInfo" */`@/views/bizViews/be/market/preaudit/editBillInfo`)
    },
    props: {
      title: String,
      bt: String, //交易类型：转贴现，质押式回购，买断式回购
      batchId: Number,
      dictMap: {
        type: Object
      },
      preAuditChangeWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempPreAuditChangeWin: {
        get() {
          return this.preAuditChangeWin;
        },
        set() {

        }
      }
    },
    watch: {
      preAuditChangeWin(val) {
        if (val) {
          this.curBatchId = this.batchId;
          this.isChange = !this.batchId;
          this.isClose = false;
          this.init();
        }
      }
    },
    methods: {
      turnForm(formItem, obj) {
        formItem.id = obj.id;
        formItem.memberId = obj.memberId;
        formItem.busiType = obj.busiType;
        formItem.trDir = obj.trDir;
        formItem.preAuditNo = obj.preAuditNo;
        formItem.brchCode = obj.brchCode;
        formItem.brchName = obj.brchName;
        formItem.traderNo = obj.traderNo;
        formItem.traderName = obj.traderName;
        formItem.productNo = obj.productNo;
        formItem.productName = obj.productName;
        formItem.custBrchCode = obj.custBrchCode;
        formItem.custBrchName = obj.custBrchName;
        formItem.custTraderNo = obj.custTraderNo;
        formItem.custTraderName = obj.custTraderName;
        formItem.custProductNo = obj.custProductNo;
        formItem.custProductName = obj.custProductName;
        formItem.subDeal = obj.subDeal;
        formItem.billClass = obj.billClass;
        formItem.billType = obj.billType;
        formItem.clearSpeed = obj.clearSpeed;
        formItem.clearType = obj.clearType;
        formItem.settleMode = obj.settleMode;
        formItem.selectType = obj.selectType;
        formItem.packetSeq = obj.packetSeq;
        formItem.firstSettleDt = obj.firstSettleDt;
        formItem.dueSettleDt = obj.dueSettleDt;
        formItem.prodNo = obj.prodNo;
        formItem.ratePct = obj.ratePct;
        formItem.dueRatePct = obj.dueRatePct;
        formItem.totalNum = obj.totalNum;
        formItem.totalAmt = obj.totalAmt;
        formItem.buyBackTotalAmt = obj.buyBackTotalAmt + "";
        formItem.tenorDays = obj.tenorDays;
        formItem.yieldRatePct = obj.yieldRatePct;
        formItem.firstSettleAmt = obj.firstSettleAmt;
        formItem.dueSettleAmt = obj.dueSettleAmt;
        formItem.firstPayInterest = obj.firstPayInterest;
        formItem.dueInterest = obj.dueInterest;
        formItem.productMapDict = obj.productMap;
        formItem.workDate = obj.workDate;
        formItem.maxTenorDays = obj.maxTenorDays;
        formItem.minRate = obj.minRate;
        formItem.maxRate = obj.maxRate;
        if (formItem.firstSettleDt) {
          formItem.firstSettleDt = this.$moment(formItem.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        if (formItem.dueSettleDt) {
          formItem.dueSettleDt = this.$moment(formItem.dueSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
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
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      handleClose() {
        this.isClose = true;
        this.formItem.clearSpeed = "";
        this.curBatchId = null;
        this.billFormItem.batchId = null;
        this.$refs.formItem.resetFields();
        /**清除多页选择的数据*/
        this.$refs.billDatagrid.selectIds = [];
        this.$refs.billDatagrid.selects = [];
        this.$emit("preAuditChangeWinClose", "");
      },
      //选择记录
      quoteBillSelectClick(arr, selectInx) {
        this.quoteBillSelectList = arr;
        this.quoteBillSelectRowInx = selectInx;
      },
      // 关闭上传
      uploadWinClose() {
        this.uploadWin = false;
        this.uploadUrl = "";
        this.importSelect = false;
        this.selectDataFirst = false;
        this.init();
      },
      //关闭挑票页面
      pickBillWinClose(data) {
        this.pickBillWin = false;
        if (data) {
          this.turnForm(this.formItem, data,this);
          this.$refs.billDatagrid.dataChange(1);
        } else {
          this.init();
        }
      },
      //关闭票据包挑票页面
      pickPackBillWinClose(data) {
        this.pickPackBillWin = false;
        if (data) {
          this.turnForm(this.formItem, data,this);
          this.$refs.billDatagrid.dataChange(1);
        } else {
          this.init();
        }
      },
      //保存批次方法
      handleSavePreAuditBatch(_this, callback) {
        if (_this.formItem.firstSettleDt) {
          _this.formItem.firstSettleDt = _this.$moment(_this.formItem.firstSettleDt, "YYYY-MM-DD").format("YYYYMMDD");
        }
        if (_this.formItem.dueSettleDt) {
          _this.formItem.dueSettleDt = _this.$moment(_this.formItem.dueSettleDt, "YYYY-MM-DD").format("YYYYMMDD");
        }
        _this.$refs["formItem"].validate(valid => {
          if (valid) {
            let minRate = _this.formItem.minRate ? _this.formItem.minRate : 0;
            let maxRate = _this.formItem.maxRate ? _this.formItem.maxRate : 100;
            let minRateBoolean = _this.formItem.ratePct - minRate < 0;
            let maxRateBoolean = _this.formItem.ratePct - maxRate > 0;
            let busiType = _this.formItem.busiType;
            if (minRateBoolean) {
              if ("BT01" === busiType || "RBT01" === busiType) {
                _this.$msgTip.error(_this, { info: "交易利率必须大于等于票交所最小利率参数:" + minRate });
                return;
              } else if ("BT02" === busiType || "RBT02" === busiType) {
                _this.$msgTip.error(_this, { info: "回购利率必须大于等于票交所最小利率参数:" + minRate });
                return;
              } else if ("BT03" === busiType) {
                _this.$msgTip.error(_this, { info: "首期交易利率必须大于等于票交所最小利率参数:" + minRate });
                return;
              }
            }
            if (maxRateBoolean) {
              if ("BT01" === busiType || "RBT01" === busiType) {
                _this.$msgTip.error(_this, { info: "交易利率必须小于等于票交所最大利率参数:" + maxRate });
                return;
              } else if ("BT02" === busiType || "RBT02" === busiType) {
                _this.$msgTip.error(_this, { info: "回购利率必须小于等于票交所最大利率参数:" + maxRate });
                return;
              } else if ("BT03" === busiType) {
                _this.$msgTip.error(_this, { info: "首期交易利率必须小于等于票交所最大利率参数:" + maxRate });
                return;
              }
            }
            if ("BT03" === busiType) {
              let minDueRateBoolean = _this.formItem.dueRatePct - minRate < 0;
              let maxDueRateBoolean = _this.formItem.dueRatePct - maxRate > 0;
              if (minDueRateBoolean) {
                _this.$msgTip.error(_this, { info: "到期交易利率必须大于等于票交所最小利率参数:" + minRate });
                return;
              }
              if (maxDueRateBoolean) {
                _this.$msgTip.error(_this, { info: "到期交易利率必须小于等于票交所最大利率参数:" + maxRate });
                return;
              }
            }
            if ("BT03" === busiType || "BT02" === busiType || "RBT02" === busiType) {
              let maxTenorDays = _this.formItem.maxTenorDays ? _this.formItem.maxTenorDays : 365;
              if (parseInt(_this.formItem.tenorDays) > parseInt(maxTenorDays)) {
                _this.$msgTip.error(_this, { info: "回购期限不能大于" + maxTenorDays + "天" });
                return;
              }
            }
            post(_this.formItem, "/be/market/preaudit/preAuditMain/func_createPreAuditBatch").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let obj = res.data.retData;
                if (retCode === "000000") {
                  if (obj.id) {
                    _this.curBatchId = obj.id;
                    _this.billFormItem.batchId = obj.id;
                  }
                  this.turnForm(_this.formItem, obj,this);
                  _this.$refs.billDatagrid.dataChange(1);
                  _this.quoteBillSelectList = [];
                  callback(obj.id);
                } else {
                  _this.$msgTip.error(_this, { info: msg });
                }
              } else {
                _this.$msgTip.error(_this, { info: _this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //保存
      savePreAuditBatch() {
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定要保存吗？",
          onOk: () => {
            this.handleSavePreAuditBatch(this, res => {
              this.$msgTip.success(this);
            });
          }
        });
      },
      // 挑票
      pickBill() {
        this.handleSavePreAuditBatch(this, res => {
          if (this.formItem.selectType && this.formItem.selectType === "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型为票据包时，不能进行挑票操作，请选择票据包挑票操作！") });
            return;
          }
          this.billType = this.formItem.billType;
          this.billClass = this.formItem.billClass;
          this.busiType = this.formItem.busiType;
          this.curBatchId = this.formItem.id;
          this.pickBillWin = true;
        });
      },
      // 导入挑票
      importPickBill() {
        this.handleSavePreAuditBatch(this, res => {
          if (this.formItem.selectType && this.formItem.selectType === "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型为票据包时，不能进行导入挑票操作！") });
            return;
          }
          this.uploadWin = true;
          this.uploadUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/preaudit/preAuditMain/func_batchImportPickBill";
          this.curBatchId = this.formItem.id;
          this.importSelect = true;
          this.selectDataFirst = false;
        });
      },
      //新增票据
      addBill() {
        this.handleSavePreAuditBatch(this, res => {
          this.billInfoId = null;
          this.curBatchId = res;
          this.editBillInfoWin = true;
        });
      },
      //修改票据
      editBill() {
        let list = this.$refs.billDatagrid.selectIds;
        if (list && list.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list && list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        this.handleSavePreAuditBatch(this, res => {
          this.curBatchId = res;
          this.billInfoId = list[0];
          this.editBillInfoWin = true;
        });
      },
      //修改
      editBillInfoCommit(data) {
        this.turnForm(this.formItem, data,this);
        this.editBillInfoWin = false;
        this.$refs.billDatagrid.selectIds = [];
        this.$refs.billDatagrid.selects = [];
        this.$refs.billDatagrid.dataChange(1);
      },
      editBillInfoWinClose() {
        this.editBillInfoWin = false;
        this.$refs.billDatagrid.selectIds = [];
        this.$refs.billDatagrid.selects = [];
        this.$refs.billDatagrid.dataChange(1);
      },
      // 票据包挑票
      pickPackBill() {
        this.handleSavePreAuditBatch(this, res => {
          if (this.formItem.selectType && this.formItem.selectType !== "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型不是票据包时，不能进行票据包挑票操作！") });
            return;
          }
          this.pickPackBillWin = true;
          this.curBatchId = this.formItem.id;
          this.billType = this.formItem.billType;
          this.billClass = this.formItem.billClass;
          this.busiType = this.formItem.busiType;
        });
      },
      // 利息计算
      calcInterest() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要计算利息吗") + "?",
          onOk: () => {
            this.handleSavePreAuditBatch(this, res => {
              this.$msgTip.success(this);
              this.curBatchId = this.formItem.id;
              this.$refs.billDatagrid.dataChange(1);
            });
          }
        });
      },
      getBillNoAndCdRange(billNo, billRangeStart, billRangeEnd) {
        if (billNo && billNo.length === 30) {
          let mark = billNo.charAt(0);
          if (mark === '5' || mark === '6' || mark === '7' || mark === '8') {
            if (billRangeStart === 0) {
              return billNo+"，子票区间[0]";
            }
            if(billRangeStart){
              if (billRangeEnd) {
                return billNo+"，子票区间["+( "0000000000000000" + billRangeStart ).substr( -12 )
                  +( "0000000000000000" + billRangeEnd ).substr( -12 )+"]";
              } else {
                return billNo+"，子票区间["+( "0000000000000000" + billRangeStart ).substr( -12 )+"]";
              }
            }
          }
        }
        return billNo;
      },
      // 提交申请
      applyBatch() {
        if(window.sessionStorage.getItem("isOpenI9")=="1"){
          let showFlag="";
          let list=this.$refs.billDatagrid.tData;
          let flag="0";
          let billList='';
          console.log(list)
          getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
            let value = res.value
            if(value=='0'){//否
              showFlag="0";
            }else if(value=="1"){//是
              showFlag="1";
            }
            if((this.formItem.busiType=="BT01" || this.formItem.busiType=="RBT01") && showFlag=="0"){
              flag="1";
            }
            for(let i=0;i<list.length;i++){
              if (list[i].assetIndustry == "1") {
                if(billList){
                  billList+="、";
                }
                billList+=('票据(包)号码'+this.getBillNoAndCdRange(list[i].billNo,list[i].billRangeStart,list[i].billRangeEnd));
                showFlag="2";
              }
            }
            if(flag!="1" && showFlag=="2"){
              this.$hMsgBox.confirm({
                title: "确认",
                content: "选中" + billList + "资产类型为持有-按摊余成本计量，请确定是否提交？",
                onOk: () => {
                  this.applyWin = true;
                  this.applyTitle = "确认要提交申请吗?";
                },
                onCancel: () =>{
                  return;
                }
              });
            }else if(flag=="1" && showFlag=="2"){
              let info="选中" + billList + "资产类型为持有-按摊余成本计量，不允许提交";
              this.$msgTip.error(this, { info: info});
            }
            else{
              this.applyWin = true;
              this.applyTitle = "确认要提交申请吗?";
            }
          })
        }else {
          this.applyWin = true;
          this.applyTitle = "确认要提交申请吗?";
        }



      },
      // 提交申请
      applyCallback() {
        if (this.curBatchId) {
          let id = this.curBatchId;
          let url = "/be/market/preaudit/preAuditMain/func_commitApply";
          post({ batchId: id, flag: "0" }, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                let riskInfo = obj.riskInfo;
                if (riskInfo) {
                  this.$hMsgBox.confirm({
                    title: "确认要继续提交申请吗?",
                    content: riskInfo,
                    onOk: () => {
                      post({ batchId: id, flag: "1" }, url).then(res => {
                        if (res) {
                          let retCode = res.data.retCode;
                          if (retCode === "000000") {
                            this.$msgTip.success(this);
                            this.quoteBillSelectList = [];
                            this.handleClose();
                          } else {
                            this.$msgTip.error(this, { info: res.data.retMsg });
                          }
                        } else {
                          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                        }
                      });
                    }
                  });
                } else {
                  this.$msgTip.success(this);
                  this.quoteBillSelectList = [];
                  this.handleClose();
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      // 清除票据包
      clearPack() {
        if (this.formItem.id) {
          if (this.formItem.selectType && this.formItem.selectType !== "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型不是票据包时，不能进行票据包清除操作！") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要清除票据包吗") + "?",
            onOk: () => {
              let id = this.formItem.id;
              let url = "/be/market/preaudit/preAuditMain/func_deletPicketBill";
              post({ batchId: id }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.turnForm(this.formItem, res.data.retData,this);
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                  this.$refs.billDatagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        }
      },
      // 删除票据
      deleteBill() {
        if (this.formItem.id) {
          if (this.formItem.selectType && this.formItem.selectType === "CSM02") {
            this.$msgTip.info(this, { info: this.$t("挑票类型为票据包时，不能删除票据进行操作！") });
            return;
          }
          let list = this.$refs.billDatagrid.selectIds;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要删除票据吗") + "?",
            onOk: () => {
              let url = "/be/market/preaudit/preAuditMain/func_deleteBill";
              let batchId = this.curBatchId;
              post({ batchId: batchId, billIds: list }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.turnForm(this.formItem, res.data.retData,this);
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                  this.$refs.billDatagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            }
          });
        }
      },
      // 模板下载
      downMoudle() {
        if (this.formItem.id) {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/preaudit/preAuditMain/func_downloadImportBillInfo";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      // 恢复预删除
      replyDel() {
        if (this.formItem.id) {
          let list = this.$refs.billDatagrid.selectIds;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要恢复预删除票据吗") + "?",
            onOk: () => {
              let url = "/be/market/preaudit/preAuditMain/func_restoreBill";
              let batchId = this.curBatchId;
              post({ batchId: batchId, billIds: list }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.curBatchId = this.formItem.id;
                    this.turnForm(this.formItem, res.data.retData,this);
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                  this.$refs.billDatagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            }
          });
        }
      },
      // 导出清单
      exportBill() {
        if (this.formItem.id) {
          this.exportBillCommit = true;
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/preaudit/preAuditMain/func_downloadPreAuditInfo";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          form.setAttribute("target", "downLoadFrame");
          let input = document.createElement("input");
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
            let input2 = document.createElement("input");
            input2.setAttribute("name", "billIds");
            input2.setAttribute("value", ids);
            form.appendChild(input2);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
          this.exportBillCommit = false;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 打印清单
      printBill() {
        if (this.curBatchId) {
          this.preAuditPrintWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //关闭打印窗口
      closeDetilPrint(i) {
        this.preAuditPrintWin = false;
      },
      //  初始化页面
      init() {
        let batchId = this.curBatchId;
        let busiType = this.bt;
        let url = "";
        if (batchId) {
          url = "/be/market/preaudit/preAuditMain/func_findPreAuditById";
        } else {
          url = "/be/market/preaudit/preAuditMain/func_findPreAuditAddData";
        }
        post({ id: batchId, busiType: busiType }, url).then(async res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.turnForm(this.formItem, obj, this);
              this.formItem.busiType = busiType;
              this.formItem.brchType = await this.getBranchType();
              this.billFormItem.batchId = obj.id;
              this.$nextTick(() => {
                this.$refs.billDatagrid.dataChange(1);
              });
              this.quoteBillSelectList = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      getBranchType(){
        if (this.formItem.custBrchCode != null && this.formItem.custBrchCode.trim().length == 9) {
          return post({brchCode:this.formItem.custBrchCode}, "/cpes/branch/queryBranchList").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (res.data.retData.list.length > 0) {
                  return res.data.retData.list[0].brchType;
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        } else {
          return "";
        }
      },

      applyClose() {
        this.applyWin = false;
        this.applyTitle = "";
      },
      applyCommit() {
        this.handleSavePreAuditBatch(this, res => {
          this.applyCallback();
          this.applyWin = false;
          this.applyTitle = "";
        });
      },
      handleUploadSuccess(data) {
        this.turnForm(this.formItem, data,this);
      }
    }
  };
</script>
