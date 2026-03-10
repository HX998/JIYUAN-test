<template>
  <div>
    <h-msg-box v-model="tempQuoteChangeWin" :mask-closable="false" @on-close="handleClose" :maximize="true" width="1000"
               :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div>
        <h-form :model="formItem" :label-width="100" ref="formItem" cols="3" class="h-form-search" onlyBlurRequire>
          <quote-input :busiType="bt" :isChange="isChange" :formItem="formItem" :dictMap="dictMap"
                       :saleBrchCode="branchCode" :preDeleteBill="preDeleteBill">
            <div slot="save">
              <h-form-item label="" prop="prodName" class="h-form-three">
                <h-button type="primary" @click="saveBatch()">{{$t("m.i.common.save")}}</h-button>
              </h-form-item>
            </div>
          </quote-input>
        </h-form>
      </div>
      <!-- 数据展示表格 -->
      <h-datagrid :columns="columns"
                  :auto-load="false"
                  url="/be/market/rediscount/redSaleApplyMain/func_queryRedSaleBillListMain"
                  :bindForm="billFormItem"
                  :hasSelect="false" rowSelect
                  ref="billDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="pickBill()">{{$t("m.i.common.pickBill")}}</h-button>
          <h-button type="primary" @click="importPickBill()">{{$t("m.i.common.exportPickBill")}}</h-button>
          <h-button type="primary" @click="deleteBill()">{{$t("m.i.be.deleteBill")}}</h-button>
          <h-dropdown placement="bottom-start" @on-click="isAllopatric">
            <h-button type="primary">{{$t("m.i.be.isAnotherPlaceBill")}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="isAll">是</h-dropdown-item>
              <h-dropdown-item name="noAll">否</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-dropdown placement="bottom-start" @on-click="isMeetpolicy">
            <h-button type="primary">{{$t("m.i.be.isAccordWithPolicy")}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="isMeet">是</h-dropdown-item>
              <h-dropdown-item name="noMeet">否</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-button type="primary" @click="calcInterest()">{{$t("m.i.be.calcInterest")}}</h-button>
          <h-button type="primary" @click="imgWinOpen()">{{$t("m.i.common.image")}}</h-button>
          <h-button type="primary" @click="apply()">{{$t("m.i.be.applyBatch")}}</h-button>
          <h-button type="primary" @click="downMoudle()">{{$t("m.i.common.templateDownload")}}</h-button>
          <h-button type="primary" @click="exportBill()">{{$t("m.i.common.exportExcel")}}</h-button>
          <h-button type="primary" @click="removeBill()" v-if="preDeleteBill">{{$t("m.i.be.preDelBill")}}</h-button>
          <h-button type="primary" @click="restoreBill()" v-if="preDeleteBill">{{$t("m.i.be.restoreBill")}}</h-button>
          <h-button type="primary" @click="deletePreAudit()"
                    v-if="formItem.isPreAudit==='1' && (this.btnAuth.redSaleApplChangeDeletePreAudit === undefined ? true : this.btnAuth.redSaleApplChangeDeletePreAudit.isShow)">
            {{$t("m.i.be.deletePreAudit")}}
          </h-button>
          <h-button type="primary" @click="reDiscCheckPrinting()"
                    v-if="this.btnAuth.redSaleApplChangeReDiscCheckPrinting === undefined ? true : this.btnAuth.redSaleApplChangeReDiscCheckPrinting.isShow">
            {{$t("m.i.ce.checkPrinting")}}
          </h-button>
        </div>
      </h-datagrid>
    </h-msg-box>
    <!--影像弹出框-->
    <image-loading
      :imageWin="imageWin"
      :imageParams="imageParams"
      :isReadonly="true"
      :showImgPlat="true"
      :isShowBillRange="true"
      @imageWinClose="imageWinClose"></image-loading>
    <!-- 批量导入-->
    <upload
      :uploadUrl="uploadUrl"
      :batchId="curBatchId"
      @uploadWinClose="uploadWinClose"
      :uploadWin="uploadWin"
      :importSelect="importSelect"
      :selectDataFirst="selectDataFirst">
    </upload>

    <pickBill
      :pickBillUrl="pickBillUrl"
      :batchId="curBatchId"
      :billType="billType"
      :billClass="billClass"
      :busiType="busiType"
      :dueSettleDt="dueSettleDt"
      :dictMap="dictMap"
      @pickBillWinClose="pickBillWinClose"
      :pickBillWin="pickBillWin">
    </pickBill>
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
    post,
    on,
    off,
    accMul,
    getDictListByGroups,
    getDictValueFromMap,
    formatNumber,
    getUploadImgType
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "redSaleApplChange",
    data() {
      return {
        btnAuth: {
          type: Object,
          default() {
            return {
              redSaleApplChangeReDiscCheckPrinting: {
                isShow: true
              },
              redSaleApplChangeDeletePreAudit: {
                isShow: true
              }
            }
          }
        },
        formItem: {
          id: "",
          busiType: "",
          rediscountApplNo: "",
          saleBrchCode: "",
          saleBrchName: this.$store.getters.userInfo.brchName,
          saleTraderNo: "",
          saleTraderName: "",
          saleCheckTraderNo: "",
          saleCheckTraderName: "",
          buyBrchCode: "",
          buyBrchName: "",
          billType: "",
          billClass: "",
          clearType: "CT01",
          settleMode: "ST01",
          clearSpeed: "CS00",
          auditNo: "",
          termType: "RTT01",
          buyTraderNo: "",
          buyTraderName: "",
          buyCheckTraderName: "",
          buyApproveTraderName: "",
          buyTraderNote: "",
          buyCheckTraderNote: "",
          buyApproveTraderNote: "",
          firstSettleDt: "",
          tenorDays: "",
          ratePct: "",
          dueSettleDt: "",
          prodNo: "",
          dueRatePct: "",
          buyBackTotalAmt: "",
          totalAmt: "",
          totalNum: "",
          firstSettleAmt: "",
          dueSettleAmt: "",
          firstPayInterest: "",
          dueInterest: "",
          yieldRatePct: "",
          workDate: "",
          maxTenorDays: "",
          minRate: "",
          maxRate: "",
          buttonName: "",
          isPreAudit: "",
          creditMainBrchCode: "",
          creditMainBankName: "",
          creditMainBankType: "",
          isNoticeFirstAudit: "",
          showNoticeFirstStationItem: false,
          preChangeInfo: "",
          productMapDict: '',
        },
        columns: [
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
              let list = getDictValueFromMap(this.$parent._data.dictMap, "PreRelationFlag", params.row.preRelationFlag);
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
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.$parent._data.dictMap, 'BillOrigin', params.row.billOrigin);
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

            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          }, {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
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
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          }, {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.discDt'),
            key: "discDt",
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
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGuarntrBrchCode",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false,

          }, {
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
              let list = getDictValueFromMap(this.$parent._data.dictMap, "CreditMajor", params.row.creditMainBankType);
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
              let list = getDictValueFromMap(this.$parent._data.dictMap, "Yon", params.row.isDiscount);
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
              let list = getDictValueFromMap(this.$parent._data.dictMap, "Yon", params.row.isAllopatric);
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
              let list = getDictValueFromMap(this.$parent._data.dictMap, "Yon", params.row.isMeetPolicy);
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
            hiddenCol: window.sessionStorage.getItem("isOpenI9") == "1" ? false : true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.$parent._data.dictMap, 'AssetIndustry', params.row.assetIndustry);
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
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
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
              let list = getDictValueFromMap(this.$parent._data.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", {domProps: {title: list}}, list);
            }
          },
          {
            title: this.$t("m.i.be.isDiscGreen"),
            key: "isDiscGreen",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.$parent._data.dictMap, "Yon", params.row.isDiscGreen);
              return h("span", {domProps: {title: list}}, list);
            }
          },
          {
            title: this.$t("m.i.be.discIndustry"),
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.$parent._data.dictMap, "Industry", params.row.discIndustry);
              return h("span", {domProps: {title: list}}, list);
            }
          },
          {
            title: this.$t("m.i.be.isDiscArc"),
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.$parent._data.dictMap, "Yon", params.row.isDiscArc);
              return h("span", {domProps: {title: list}}, list);
            }
          }
        ],
        billimagecolumns: [
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
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.$parent._data.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.imgBatchNo"),
            key: "imgBatchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.imgType"),
            key: "imgType",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.uploadStatus"),
            key: "uploadStatus",
            hiddenCol: false
          }
        ],
        // 分页切换配置
        pageSizeOpts: [10, 20, 50, 200],
        //showBillImage : false,
        bills: {
          batchId: ""
        },

        imageParams: {
          busiBatchId: "",
          listId: "",
          imgTypeList: [],
          imgType: "IM12",
          imageUrl: "/be/market/rediscount/redSaleApplyMain/func_queryRedSaleBillImage", //查询可查看影像url
          imageUploadUrl: "/be/market/rediscount/redSaleApplyMain/func_loadImgFile", //影像上传url
          imageRegisterUrl: "/be/market/rediscount/redSaleApplyMain/func_registerImgInfo", //影像登记url
          imageDeleteUrl: "/be/market/rediscount/redSaleApplyMain/func_delImgInfo", //影像删除url
          imgShowUrl: "/be/market/rediscount/redSaleApplyMain/func_showImg?id=", //查看影像url
          busiType: "RI12"
        },
        imgUrl: "",
        currentInfoSelectList: [],
        currentInfoSelectRowInx: [],
        currentImageInfoSelectList: [],
        currentImageInfoSelectRowInx: [],
        showImgWin: false,
        imageWin: false,
        preDeleteBill: false,
        showBillInfoWin: false,
        billId: "",
        billRangeStart: '',
        billRangeEnd: '',
        billNo: "",
        listId: "",
        billType: "",
        billClass: "",
        busiType: "",
        branchCode: "",
        buyBrchCode: "",
        buyBrchName: "",
        buyTraderNo: "",
        buyTraderName: "",
        buyProductNo: "",
        buyProductName: "",
        preChangeInfo: "",
        buyApproveTraderNote: "",
        buyCheckTraderNote: "",
        buyTraderNote: "",
        buyBackTotalAmt: "",
        riskFlag: "",
        preFlag: "",
        billDatagridData: {rows: [], total: 1},
        curBatchId: this.batchId,
        dueSettleDt: "",
        isChange: false,
        billFormItem: {batchId: this.batchId},
        uploadUrl: "",
        uploadWin: false,
        importSelect: false,
        selectDataFirst: false,
        pickBillUrl: "",
        pickBillWin: false,
        pickPackBillWin: false,
        pickPackBillUrl: "",
        applyWin: false,
        applyTitle: ""
      };
    },
    components: {
      Upload: () => import(/* webpackChunkName: "be/market/rediscount/upload" */`@/views/bizViews/be/market/rediscount/upload`),
      QuoteInput: () => import(/* webpackChunkName: "be/market/rediscount/redSaleInput" */`@/views/bizViews/be/market/rediscount/redSaleInput`),
      PickBill: () => import(/* webpackChunkName: "be/market/rediscount/redSalePickBill" */`@/views/bizViews/be/market/rediscount/redSalePickBill`),
      PickPackBill: () => import(/* webpackChunkName: "be/market/quote/sale/pickPackBill" */`@/views/bizViews/be/market/quote/sale/pickPackBill`)
    },
    props: {
      title: String,
      trDir: String,//交易方向：买入、卖出、正回购、逆回购
      bt: String, //交易类型：转贴现，质押式回购，买断式回购
      batchId: Number,
      dealStatus: String,
      dictMap: {
        type: Object
      },
      quoteChangeWin: {
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
      }
    },
    computed: {
      tempQuoteChangeWin: {
        get() {
          return this.quoteChangeWin;
        },
        set() {
        }
      }
    },
    watch: {
      quoteChangeWin(val) {
        if (val) {
          this.curBatchId = this.batchId;
          if (this.batchId) {
            this.isChange = false;
            this.preDeleteBill = this.dealStatus === "RS04";
          } else {
            this.isChange = true;
            this.preDeleteBill = false;
          }
          this.$nextTick(() => {
            this.formItem.showNoticeFirstStationItem = this.showNoticeFirstStationItem;
            this.formItem.isNoticeFirstAudit = this.isNoticeFirstAudit;
            this.init();
            this.billFormItem.batchId = this.batchId;
            /*this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);*/
          });
        } else {
          this.$refs.formItem.resetFields();
        }
      }
    },
    mounted() {
      this.getButtonAuth();
    },
    methods: {
      getButtonAuth() {
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
            } else {
              this.$msgTip.error(this, {info: retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      turnForm(formItem, obj) {
        formItem.id = obj.id;
        formItem.busiType = obj.busiType;
        formItem.rediscountApplNo = obj.rediscountApplNo;
        formItem.saleBrchCode = obj.saleBrchCode;
        formItem.saleBrchName = obj.saleBrchName;
        formItem.saleTraderNo = obj.saleTraderNo;
        formItem.saleTraderName = obj.saleTraderName;
        formItem.saleCheckTraderNo = obj.saleCheckTraderNo;
        formItem.saleCheckTraderName = obj.saleCheckTraderName;
        formItem.buyBrchCode = obj.buyBrchCode;
        formItem.buyBrchName = obj.buyBrchName;
        formItem.buyTraderNo = obj.buyTraderNo;
        formItem.buyTraderName = obj.buyTraderName;
        formItem.buyCheckTraderName = obj.buyCheckTraderName;
        formItem.buyApproveTraderName = obj.buyApproveTraderName;
        formItem.billClass = obj.billClass;
        formItem.billType = obj.billType;
        formItem.clearSpeed = obj.clearSpeed;
        formItem.clearType = obj.clearType;
        formItem.settleMode = obj.settleMode;
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
        formItem.productMapDict = obj.productMap;
        formItem.workDate = obj.workDate;
        formItem.maxTenorDays = obj.maxTenorDays;
        formItem.minRate = obj.minRate;
        formItem.maxRate = obj.maxRate;
        formItem.termType = obj.termType;
        formItem.preChangeInfo = obj.preChangeInfo;
        formItem.buyApproveTraderNote = obj.buyApproveTraderNote;
        formItem.buyCheckTraderNote = obj.buyCheckTraderNote;
        formItem.buyTraderNote = obj.buyTraderNote;
        formItem.isPreAudit = obj.isPreAudit;
        formItem.auditNo = obj.auditNo;
        if (!!obj.isNoticeFirstAudit) {
          formItem.isNoticeFirstAudit = obj.isNoticeFirstAudit
        } else {
          formItem.isNoticeFirstAudit = this.isNoticeFirstAudit;
        }
      },
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      handleClose() {
        this.$refs.formItem.resetFields();
        this.$emit("quoteChangeWinClose", "");
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
      pickBillWinClose() {
        this.pickBillWin = false;
        this.init();
      },
      imageWinClose() {
        this.imageWin = false;
        this.imageParams.busiBatchId = "";
        this.imageParams.listId = "";
        this.imageParams.imgTypeList = [];
      },
      //保存
      saveBatch() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要保存批次吗") + "?",
          onOk: () => {
            this.editApply();
          }
        });

      },
      editApply(optType) {
        if (this.formItem.firstSettleDt) {
          this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, "YYYY-MM-DD").format("YYYYMMDD");
        }
        if (this.formItem.dueSettleDt) {
          this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, "YYYY-MM-DD").format("YYYYMMDD");
          this.dueSettleDt = this.formItem.dueSettleDt;
        }
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            let minRate = this.formItem.minRate ? this.formItem.minRate : 0;
            let maxRate = this.formItem.maxRate ? this.formItem.maxRate : 100;
            let minRateBoolean = this.formItem.ratePct < minRate;
            let maxRateBoolean = this.formItem.ratePct > maxRate;
            let busiType = this.formItem.busiType;
            if (minRateBoolean) {
              if ("RBT01" == busiType) {
                this.$msgTip.error(this, {info: "交易利率必须大于等于票交所最小利率参数:" + minRate});
                return;
              } else if ("RBT02" == busiType) {
                this.$msgTip.error(this, {info: "回购利率必须大于等于票交所最小利率参数:" + minRate});
                return;
              }
            }
            if (maxRateBoolean) {
              if ("RBT01" == busiType) {
                this.$msgTip.error(this, {info: "交易利率必须小于等于票交所最大利率参数:" + maxRate});
                return;
              } else if ("RBT02" == busiType) {
                this.$msgTip.error(this, {info: "回购利率必须小于等于票交所最大利率参数:" + maxRate});
                return;
              }
            }
            if ("RBT02" === busiType) {
              let maxTenorDays = this.formItem.maxTenorDays ? this.formItem.maxTenorDays : 365;
              if (parseInt(this.formItem.tenorDays) > parseInt(maxTenorDays)) {
                this.$msgTip.error(this, {info: "回购期限不能大于" + maxTenorDays + "天"});
                this.init();
                return;
              }
            }
            let url = "/be/market/rediscount/redSaleApplyMain/func_addRediscountSaleBatch";
            if ("apply" === optType) {
              this.formItem.buttonName = "commitApply";
            }
            post(this.formItem, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let obj = res.data.retData;
                if (retCode == "000000") {
                  if (obj.id) {
                    this.curBatchId = obj.id;
                    this.billFormItem.batchId = obj.id;
                  }
                  if (optType) {
                    this.init(optType);
                  } else {
                    this.init();
                    this.$msgTip.success(this);
                  }
                } else {
                  if (this.formItem.firstSettleDt) {
                    this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                  }
                  if (this.formItem.dueSettleDt) {
                    this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                  }
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                if (this.formItem.firstSettleDt) {
                  this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                if (this.formItem.dueSettleDt) {
                  this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      // 挑票
      pickBill() {
        setTimeout(() => {
          this.editApply("pickBill");
        }, 600);
      },
      pickBillCallback() {
        if (this.formItem.id) {
          this.billType = this.formItem.billType;
          this.billClass = this.formItem.billClass;
          this.busiType = this.formItem.busiType;
          this.curBatchId = this.formItem.id;
          this.pickBillWin = true;
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      // 导入挑票
      importPickBill() {
        setTimeout(() => {
          this.editApply("importPickBill");
        }, 600);
      },
      importPickBillCallback() {
        if (this.formItem.id) {
          this.uploadWin = true;
          this.uploadUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/redSaleApplyMain/func_batchSaleBill";
          this.curBatchId = this.formItem.id;
          this.importSelect = true;
          this.selectDataFirst = false;
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
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
          let url = "/be/market/rediscount/redSaleApplyMain/func_calcRediscSaleInterest";
          post({id: id}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.curBatchId = this.formItem.id;
                this.init();
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
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
      apply() {
        if (window.sessionStorage.getItem("isOpenI9") == "1") {
          let showFlag = "";
          let list = this.$refs.billDatagrid.tData;
          let flag = "0";
          let billList='';
          console.log(list)
          getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {

            let value = res.value
            if (value == '0') {//否
              showFlag = "0";
            } else if (value == "1") {//是
              showFlag = "1";
            }
            console.log(this.formItem.busiType)
            if (this.formItem.busiType == "RBT01" && showFlag == "0") {
              flag = "1";
            }
            console.log(flag)
            for (let i = 0; i < list.length; i++) {
              if (list[i].assetIndustry == "1"
                  &&(list[i].preRelationFlag==='1'||list[i].preRelationFlag==='2')) {
                if(billList){
                  billList+="、";
                }
                billList+=('票据(包)号码'+this.getBillNoAndCdRange(list[i].billNo,list[i].billRangeStart,list[i].billRangeEnd));
                showFlag = "2";
              }
            }
            if (flag != "1" && showFlag == "2") {
              this.$hMsgBox.confirm({
                title: "确认",
                content: "选中" + billList + "资产类型为持有-按摊余成本计量，请确定是否提交？",
                onOk: () => {
                  this.applyWin = true;
                  this.applyTitle = "确认要提交申请吗?";
                },
                onCancel: () => {
                  return;
                }
              });
            } else if (flag == "1" && showFlag == "2") {
              let info = "选中" + billList + "资产类型为持有-按摊余成本计量，不允许提交";
              this.$msgTip.error(this, {info: info});
            } else {
              this.applyWin = true;
              this.applyTitle = "确认要提交申请吗?";
            }
          })
        } else {
          this.applyWin = true;
          this.applyTitle = "确认要提交申请吗?";
        }

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
          let url = "/be/market/rediscount/redSaleApplyMain/func_commitRediscApply";
          post({id: id, riskFlag: this.riskFlag, preFlag: this.preFlag}, url).then(res => {
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
                  this.currentSelectList = [];
                  this.$refs.billDatagrid.selectIds = [];
                  this.$refs.billDatagrid.selects = [];
                  this.handleClose();
                }
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      continueApply(content, id) {
        let url = "/be/market/rediscount/redSaleApplyMain/func_commitRediscApply";
        this.$hMsgBox.confirm({
          title: "确认要继续提交申请吗?",
          content: content,
          onOk: () => {
            post({id: id, riskFlag: this.riskFlag, preFlag: this.preFlag}, url).then(res => {
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
                    this.currentSelectList = [];
                    this.$refs.billDatagrid.selectIds = [];
                    this.$refs.billDatagrid.selects = [];
                    this.handleClose();
                  }
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      initFlag() {
        this.riskFlag = "0";
        this.preFlag = "0";
      },
      // 删除票据
      deleteBill() {
        let list = this.$refs.billDatagrid.selects;
        if (this.formItem.id) {
          if (list.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要删除票据吗") + "?",
            onOk: () => {
              let url = "/be/market/rediscount/redSaleApplyMain/func_deleteRediscountBill";
              let ids = "";
              let batchId = this.formItem.id;
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              post({ids: ids, batchId: batchId}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);
                    this.init();
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
              });
            }
          });
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      // 预删除票据
      removeBill() {
        let list = this.$refs.billDatagrid.selects;
        if (this.formItem.id) {
          if (list.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要预删除票据吗") + "?",
            onOk: () => {
              let url = "/be/market/rediscount/redSaleApplyMain/func_removeBill";
              let ids = "";
              this.batchId = this.formItem.id;
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              post({ids: ids, batchId: this.batchId}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.batchId = this.formItem.id;
                    this.$refs.billDatagrid.dataChange(1);
                    this.init();
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
              });
            }
          });
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      // 恢复预删除票据
      restoreBill() {
        let list = this.$refs.billDatagrid.selects;
        if (this.formItem.id) {
          if (list.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要恢复预删除票据吗") + "?",
            onOk: () => {
              let url = "/be/market/rediscount/redSaleApplyMain/func_restoreBill";
              let ids = "";
              let batchId = this.formItem.id;
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              post({ids: ids, batchId: batchId}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.batchId = this.formItem.id;
                    this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);
                    this.currentInfoSelectList = [];
                    this.init();
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
              });
            }
          });
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      deletePreAudit() {
        if (this.formItem.id) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确认要清除预审批单吗") + "?",
            onOk: () => {
              let url = "/be/market/rediscount/redSaleApplyMain/func_deleteSalePreAudit";
              let batchId = this.formItem.id;
              post({id: batchId}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.batchId = this.formItem.id;
                    this.init();
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
              });
            }
          });
        } else {
          this.formItem.auditNo = "";
        }
      },
      // 模板下载
      downMoudle() {
        if (this.formItem.id) {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/redSaleApplyMain/func_downloadRedSaleBill";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      // 导出清单
      exportBill() {
        if (this.formItem.id) {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/redSaleApplyMain/func_downloadSaleInfo";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          let input = document.createElement("input");
          input.setAttribute("name", "batchId");
          input.setAttribute("value", this.formItem.id);
          form.appendChild(input);
          document.body.appendChild(form);
          let list = this.$refs.billDatagrid.selects;
          if (list.length > 0) {
            let ids = [];
            for (let i = 0; i < list.length; i++) {
              ids.push(list[i].id);
            }
            let input2 = document.createElement("input");
            input2.setAttribute("name", "ids");
            input2.setAttribute("value", ids);
            form.appendChild(input2);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      //票据影像
      imgWinOpen() {
        if (this.formItem.id) {
          let list = this.$refs.billDatagrid.selects;
          if (list != null && list.length === 1) {
            this.imageParams.busiBatchId = this.formItem.id;
            this.imageParams.listId = list[0].id;
            this.imageParams.imgTypeList.push({key: "IM12", value: "再贴现资料"});
            this.imageWin = true;
          } else {
            this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          }
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }


      },
      //是否异地票据isMeetpolicy
      isAllopatric(str) {
        if (this.formItem.id) {
          let batchId = this.formItem.id;
          let list = this.$refs.billDatagrid.selects;
          if (list.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
            return;
          }
          let ids = "";
          for (var i = 0, count = list.length; i < count; i++) {
            ids += list[i].id;
            if (i < list.length - 1) {
              ids += ",";
            }
          }
          let contentStr = "";
          let isAllOpatric = "";
          if (str === "isAll") {
            contentStr = "确定是异地票据吗?";
            isAllOpatric = "1";
          } else if (str === "noAll") {
            contentStr = "确定不是异地票据吗?";
            isAllOpatric = "0";
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: contentStr,
            onOk: () => {
              let param = {batchId: batchId, ids: ids, isAllopatric: isAllOpatric};
              post(param, "/be/market/rediscount/redSaleApplyMain/func_isAllopatricBill").then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);
                    this.currentSelectRow = [];
                    this.currentSelectList = [];
                    this.currentInfoSelectList = [];
                  } else {
                    this.$msgTip.error(this, {info: msg});
                  }
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
              });
            }
          });
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      //是否符合政策标准
      isMeetpolicy(str) {
        if (this.formItem.id) {
          let batchId = this.formItem.id;
          let list = this.$refs.billDatagrid.selects;
          if (list.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
            return;
          }
          let ids = "";
          for (var i = 0, count = list.length; i < count; i++) {
            ids += list[i].id;
            if (i < list.length - 1) {
              ids += ",";
            }
          }
          let contentStr = "";
          let isMeetPolicy = "";
          if (str === "isMeet") {
            contentStr = "确定是符合政策标准吗?";
            isMeetPolicy = "1";
          } else if (str === "noMeet") {
            contentStr = "确定不是符合政策标准的吗?";
            isMeetPolicy = "0";
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: contentStr,
            onOk: () => {
              let param = {batchId: batchId, ids: ids, isMeetPolicy: isMeetPolicy};
              post(param, "/be/market/rediscount/redSaleApplyMain/func_isMeetpolicyBill").then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);
                    this.currentSelectRow = [];
                    this.currentSelectList = [];
                    this.currentInfoSelectList = [];
                  } else {
                    this.$msgTip.error(this, {info: msg});
                  }
                }
              }).catch(error => {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
              });
            }
          });
        } else {
          this.$msgTip.error(this, {info: "请先保存批次"});
        }
      },
      // 打印清单
      printBill() {
      },
      //  初始化页面
      init(optType) {
        let batchId = this.curBatchId;
        let busiType = this.bt;
        let url = "";
        /**清除多页选择的数据*/
        this.$refs.billDatagrid.selectIds = [];
        this.$refs.billDatagrid.selects = [];
        if (batchId) {
          url = "/be/market/rediscount/redSaleApplyMain/func_findRedSaleBatchByIdMain";
        } else {
          url = "/be/market/rediscount/redSaleApplyMain/func_findRedSaleAddData";
        }
        post({id: batchId, busiType: busiType}, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.turnForm(this.formItem, obj);
                if (this.formItem.firstSettleDt) {
                  this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                } else {
                  this.formItem.firstSettleDt = this.$moment(obj.workDate, "YYYYMMDD").format("YYYY-MM-DD");
                }
                if (this.formItem.dueSettleDt) {
                  this.formItem.dueSettleDt = this.$moment(this.formItem.dueSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                this.billFormItem.batchId = obj.id;
                this.branchCode = this.formItem.saleBrchCode;
                this.$refs.billDatagrid.dataChange(1);
                this.currentInfoSelectList = [];
                if (optType) {
                  if ("pickBill" == optType) {
                    this.pickBillCallback();
                  } else if ("importPickBill" == optType) {
                    this.importPickBillCallback();
                  } else if ("pickPackBill" == optType) {
                    this.pickPackBillCall();
                  } else if ("calcInterest" == optType) {
                    this.calcInterestCallback();
                  } else if ("apply" == optType) {
                    this.applyCallback();
                  }
                }
              });
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      /*再贴现审批书打印*/
      reDiscCheckPrinting() {
        if (!this.formItem.id) {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
        let rediscDto = {id: this.formItem.id};
        post(rediscDto, "/be/market/rediscount/redSaleApplyMain/func_findRedSaleBatchByIdMain").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.redDiscPrint(res.data.retData);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      redDiscPrint(rediscBatch) {
        let vocherData = [];
        let data = {};
        data.billType = getDictValueFromMap(this.$parent._data.dictMap, "DraftTypeCode", rediscBatch.billType);
        data.billClass = getDictValueFromMap(this.$parent._data.dictMap, "CDMedia", rediscBatch.billClass);
        data.transDt = rediscBatch.firstSettleDt.toString().substring(0, 4) + "-" + rediscBatch.firstSettleDt.toString().substring(4, 6) + "-" + rediscBatch.firstSettleDt.toString().substring(6, 8);
        if (rediscBatch.dueSettleDt) {
          data.rebuyDt = rediscBatch.dueSettleDt.toString().substring(0, 4) + "-" + rediscBatch.dueSettleDt.toString().substring(4, 6) + "-" + rediscBatch.dueSettleDt.toString().substring(6, 8);
        } else {
          data.rebuyDt = "";
        }
        data.auditDt = data.transDt;
        data.sumCount = rediscBatch.totalNum === null ? 0 : rediscBatch.totalNum;
        data.sumMoney = "¥" + formatNumber(rediscBatch.totalAmt, 2, ',');
        data.rate = accMul(rediscBatch.rate, 100) + "%";
        data.firstPayInterest = "¥" + formatNumber(rediscBatch.firstPayInterest, 2, ',');
        data.firstSettleAmt = "¥" + formatNumber(rediscBatch.firstSettleAmt, 2, ',');
        data.clearType = rediscBatch.settleType === "ST01" ? "线上清算" : "线下清算";
        data.transMode = "再贴现回购首期";
        data.printObj = JSON.stringify(data);
        vocherData.push(data);
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: {voucherType: "PE030711", vocherData: vocherData},
          callback: () => {

          },
          errorCallback: () => {

          }
        });
      },
    },
  };
</script>

