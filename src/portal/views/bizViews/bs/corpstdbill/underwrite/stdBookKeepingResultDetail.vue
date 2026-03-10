<template>
  <div>
    <h-msg-box v-model="tempStdBookKeepingResultDetailWin" maximize width="1000" :mask-closable="false" @on-close="handleClose">
      <p slot="header">
        <span v-if="this.batchParams.bookResultPage == 'query' ||
          this.batchParams.bookResultPage == 'confirmQuery'">簿记结果详情</span>
        <span v-if="this.batchParams.bookResultPage == 'confirm'">簿记结果确认详情</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.batchNo") }}:</h-col>
              <h-col span="15" class="val">{{ formItem.batchNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.stdProductName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.stdProductShortName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductShortName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.stdProductNo') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.creationPrice') }}:</h-col>
              <h-col span="15" class="val">{{ formatPriceNumber(formItem.creationPrice) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.purchaseResult') }}:</h-col>
              <h-col span="15" class="val">{{ format("PurchaseResult", formItem.purchaseResult) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.creationAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.creationAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.priceType') }}:</h-col>
              <h-col span="15" class="val">{{ format("PriceMethod", formItem.priceType) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.purchaseDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.purchaseDt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.minPurchaseAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.minPurchaseAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.steppedUpBasisAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.steppedUpBasisAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.email') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.sellEmail }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.linkMan') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.sellLinkMan }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.phone') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.sellPhone }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
      <!-- 数据展示表格 -->
      <h-datagrid
        :columns="columns"
        highlightRow
        @on-page-change="handlePage"
        :gridData="batchList"
        :bindForm="batchParams"
        :auto-load="false"
        :onCurrentChange="handleCurrentChange"
        :onCurrentChangeCancel="handleCurrentChangeCancel"
        ref="batchDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="stdBookKeepingResultCalBtn()" v-if="this.batchParams.bookResultPage == 'confirm'">
            {{$t("m.i.bs.bookKeepingResultCal")}}
          </h-button>
          <h-button type="primary" @click="stdBookKeepingConfirmBtn()" v-if="this.batchParams.bookResultPage == 'confirm'">
            {{$t("m.i.common.confirm")}}
          </h-button>
          <h-button type="primary" @click="stdBookKeepingExportBtn()">
            {{$t("m.i.common.exportData")}}
          </h-button>
          <h-button type="primary" @click="stdBookPurchaseDetailBtn()">
            {{$t("m.i.bs.purchaseDetail")}}
          </h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>

    <!-- 配售明细 -->
    <std-purchase-case-detail :stdPurchaseCaseDetailWin="stdPurchaseCaseDetailWin" :billParams="billParams"
                                    :dictMap="dictMap"
                                    @stdPurchaseDetailBtnClose="stdPurchaseDetailBtnClose"
                                    ref="stdPurchaseCaseDetail"></std-purchase-case-detail>

    <!-- 认购函详情 -->
    <std-purchase-case-batch-detail :stdPurchaseCaseBatchDetailWin="stdPurchaseCaseBatchDetailWin"
                                    :batchParams="batchParams"
                                    :dictMap="dictMap"
                                    @stdPurchaseCaseBatchDetailClose="stdPurchaseCaseBatchDetailClose"
                                    ref="stdPurchaseCaseBatchDetail"></std-purchase-case-batch-detail>
    <!-- 导出 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
import {getDictValueFromMap, post, formatNumber, exportList} from "@/api/bizApi/commonUtil";
export default {
  name: "stdBookKeepingResultDetail",
  components: {
    StdPurchaseCaseDetail: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdPurchaseCaseDetail" */`@/views/bizViews/bs/corpstdbill/underwrite/stdPurchaseCaseDetail`),
    StdPurchaseCaseBatchDetail: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdPurchaseCaseBatchDetail" */`@/views/bizViews/bs/corpstdbill/underwrite/stdPurchaseCaseBatchDetail`),
    ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
  },
  data() {
    return {
      batchId: "",
      formItem: {},
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
          title: this.$t("m.i.common.brchName"),
          key: "investBrchName",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.stdPurchaseCaseBatchDetailOpen(params.row.id)
                }
              }
            }, params.row.investBrchName)
          }
        },
        {
          title: this.$t('m.i.bs.investPayAmt'),
          key: 'investPayAmt',
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.investPayAmt, 2, ","));
          }
        },
        {
          title: this.$t('m.i.bs.investPlacingAmt'),
          key: 'investPlacingAmt',
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.investPlacingAmt, 2, ","));
          }
        }
      ],
      currentSelectRow: [],
      billParams: {},
      batchList: {
        list: [],
        pageInfo: {
          count: 0,
          pageNo: 1,
          pageSize: 10
        }
      },
      stdPurchaseCaseDetailWin: false,
      tempShowExcelTemplateWin:false,
      stdPurchaseCaseBatchDetailWin: false,
      param: "",
      rows: "",
    };
  },
  props: {
    stdBookKeepingResultDetailWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    batchParams: {
      type: Object,
      default() {
        return {};
      }
    },
    dictMap: {
      type: Map,
      required: true
    }
  },
  computed: {
    tempStdBookKeepingResultDetailWin: {
      get() {
        return this.stdBookKeepingResultDetailWin;
      },
      set() {
      }
    }
  },
  watch: {
    stdBookKeepingResultDetailWin(val) {
      if (val) {
        this.$nextTick(() => {
          this.batchId = this.batchParams.bkId;
          this.queryObjById();
          this.handleSearch();
        });
      }
    },
    batchId(val) {
      this.batchId = val;
    }
  },


  methods: {
    //根据批次Id查询信息
    queryObjById() {
      let params = {id: this.batchId};
      let url = "";
      if(this.batchParams.bookResultPage == "query"){
        url = "/bs/corpstdbill/underwrite/stdBookKeepingResultQry/func_findStdBookKeepingById";
      }else if(this.batchParams.bookResultPage == "confirm" || this.batchParams.bookResultPage == "confirmQuery"){
        url = "/bs/corpstdbill/underwrite/stdBookKeepingConfirm/func_findStdBookKeepingById"
      }
      post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$nextTick(() => {
                this.formItem = res.data.retData;
              });
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        }
      );
    },

    // 分页事件
    handlePage(pageNo, pageSize) {
      let obj = Object.assign({}, { bkId: this.batchParams.bkId }, { pageNo: pageNo, pageSize: pageSize });
      this.queryBatchList(obj);
    },
    // 查询票据清单
    queryBatchList(obj) {
      let url = "";
      if(this.batchParams.bookResultPage == "query"){
        url = "/bs/corpstdbill/underwrite/stdBookKeepingResultQry/func_queryStdPurchaseCaseBatchPage";
      }else if(this.batchParams.bookResultPage == "confirm"  || this.batchParams.bookResultPage == "confirmQuery"){
        url = "/bs/corpstdbill/underwrite/stdBookKeepingConfirm/func_queryStdPurchaseCaseBatchPage";
      }
      post(obj, url).then(res => {
        let retCode = res.data.retCode;
        if (retCode === "000000") {
          this.batchList = res.data.retData;
        }
      });
    },

    //查询认购函批次列表
    handleSearch() {
      this.formItem.bkId = this.batchParams.bkId;
      this.$refs.batchDatagrid.selects = [];
      this.$refs.batchDatagrid.selectIds = [];
      this.$refs.batchDatagrid.dataChange(1);
      this.$refs.batchDatagrid.$refs.gridPage.clearElevator();
    },

    //认购函批次下的明细信息
    stdBookPurchaseDetailBtn(){
      if(this.currentSelectRow != null && this.currentSelectRow.length !== 0){
        this.billParams.batchId = this.currentSelectRow.id;
        this.billParams.investBrchName = this.currentSelectRow.investBrchName;
        this.billParams.investPlacingAmt = this.currentSelectRow.investPlacingAmt;
        this.billParams.bookResultPage = this.batchParams.bookResultPage;
        this.billParams.dictMap = this.dictMap;
        this.stdPurchaseCaseDetailWin = true;
      }else{
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")})
        return;
      }
    },
    stdPurchaseDetailBtnClose() {
      this.stdPurchaseCaseDetailWin = false;
      let pageNo = this.$refs.batchDatagrid.pageInfo.pageNo;
      this.handleSearch(pageNo);
      this.billParams = {};
    },

    //簿记结果结算
    stdBookKeepingResultCalBtn(){
      let url = "/bs/corpstdbill/underwrite/stdBookKeepingConfirm/func_calcStdBookKeeping";
      post({id: this.batchParams.bkId}, url).then(res => {
        let retCode = res.data.retCode;
        if (retCode === "000000") {
          this.queryObjById();
          //计算成功查询认购函批次列表
          this.handleSearch();
        }else{
          this.$msgTip.error(this, {info: res.data.retMsg});
        }
      });
    },

    //认购函确认详情弹框-确认按钮操作
    stdBookKeepingConfirmBtn(){
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: this.$t("m.i.bs.isConfirmBookKeepingResult") + "?",
        onOk: () => {
          let url = "/bs/corpstdbill/underwrite/stdBookKeepingConfirm/func_confirmStdBookKeeping";
          let obj = Object.assign({},{ id: this.batchParams.bkId });
          post(obj, url).then(res => {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.batchList = res.data.retData;
              this.handleClose();
            }else{
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          });
        }
      });
    },

    //机构超链接查看认购函详情
    stdPurchaseCaseBatchDetailOpen(id) {
      this.batchParams.batchId = id;
      this.batchParams.dictMap = this.dictMap;
      if(this.batchParams.bookResultPage == "query"){
        this.batchParams.batchUrl = "/bs/corpstdbill/underwrite/stdBookKeepingResultQry/func_findStdPurchaseCaseBatchById";
        this.batchParams.dataGridUrl = "/bs/corpstdbill/underwrite/stdBookKeepingResultQry/func_queryStdPurchaseCaseDetailPage";
      }else if(this.batchParams.bookResultPage == "confirm"  || this.batchParams.bookResultPage == "confirmQuery"){
        this.batchParams.batchUrl = "/bs/corpstdbill/underwrite/stdBookKeepingConfirm/func_findStdPurchaseCaseBatchById";
        this.batchParams.dataGridUrl = "/bs/corpstdbill/underwrite/stdBookKeepingConfirm/func_queryStdPurchaseCaseDetailPage";

      }
      this.stdPurchaseCaseBatchDetailWin = true;
    },
    stdPurchaseCaseBatchDetailClose() {
      this.stdPurchaseCaseBatchDetailWin = false;
      let pageNo = this.$refs.datagrid.pageInfo.pageNo;
      this.handleSearch(pageNo);
      this.batchParams = {};
    },

    //清单导出
    stdBookKeepingExportBtn() {
      this.param = "stdBookKeepingExportInfo";
      this.rows = this.$refs.batchDatagrid.total;
      this.tempShowExcelTemplateWin = true;
    },
    showExcelTemplateWinClose() {
      this.tempShowExcelTemplateWin = false;
    },
    exportList(field, exportType) {
      let exportUrl = "";
      if(this.batchParams.bookResultPage == "query"){
        exportUrl = "/bs/corpstdbill/underwrite/stdBookKeepingResultQry/func_exportStdBookKeepingDetailList"
      }else if(this.batchParams.bookResultPage == "confirm"  || this.batchParams.bookResultPage == "confirmQuery"){
        exportUrl = "/bs/corpstdbill/underwrite/stdBookKeepingConfirm/func_exportStdBookKeepingDetailList"
      }
      let url = window.LOCAL_CONFIG.API_HOME + exportUrl;
      let options = {};
      options.params = {
        bkId: this.formItem.id,
      };
      options.pageSize = this.$refs.batchDatagrid.total;
      exportList(this, this.param, field, exportType, url, options);
    },

    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = [];
    },
    handleClose() {
      this.$emit("stdBookKeepingDetailClose", "");
    },
    format(groupCode, key) {
      return getDictValueFromMap(this.dictMap, groupCode, key);
    },
    formatDate(value) {
      return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
    },
    formatDateTime(value) {
      return value ? this.$moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "";
    },
    formatNumber(value){
      return formatNumber(value, 2, ",");
    },
    formatPriceNumber(value){
      return formatNumber(value, 4, ",");
    },
  }
};
</script>

<style scoped>

</style>
