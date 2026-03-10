<!--匿名点击正回购-提票弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempExtractBillAddWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span >提票详情</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <extrack-bill-form-item :addForm="addOrEditForm" :batchParams="batchParams"></extrack-bill-form-item>
        </h-form>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          :url="dataGridUrl"
          :bindForm="dataGridFormItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="pickBill()" v-if="batchParams.batchType!=='show'">{{$t("m.i.common.pickBill")}}
            </h-button>
            <h-button type="primary" @click="deleteBill()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.deleteBill")}}
            </h-button>
            <h-button type="primary" @click="calcInterest()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.calcInterest")}}
            </h-button>
            <h-button type="primary" @click="importTemplate()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.templateDownload")}}
            </h-button>
            <h-button type="primary" @click="importPickBill()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.exportPickBill")}}
            </h-button>
            <!--<h-button type="primary" @click="exportBill()" v-if="batchParams.batchType!=='show'"
                      :disabled="exportBillCommit">
            {{$t("m.i.common.exportExcel")}}
            </h-button>-->
            <h-button type="primary" @click="applySubmit()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.applyBatch")}}
            </h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <!--挑票-->
    <sale-pick-bill :pickBillWin="pickBillWin" :pickBillParams="pickBillParams"
                    @pickBillWinClose="pickBillWinClose"></sale-pick-bill>
    <!-- 批量导入 -->
    <common-file-upload-no-show :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "extractBillAdd",
    components: {
      ExtrackBillFormItem: () => import(/* webpackChunkName: "be/market/anonyclick/sale/extrackBillFormItem" */"@/views/bizViews/be/market/anonyclick/sale/extrackBillFormItem"),
      SalePickBill: () => import(/* webpackChunkName: "be/market/anonyclick/sale/saleExtrackPickBill"*/"@/views/bizViews/be/market/anonyclick/sale/saleExtrackPickBill")
    },
    data() {
      return {
        dataGridUrl: "",
        batchId: "",
        showBillInfoWin:false,
        billId:"",
        billNo:"",
        billRangeStart:'',
        billRangeEnd:'',
        addOrEditForm: {
          id: "",
          batchNo:"",
          busiType: "",
          quoteNo: "",
          dealNo: "",
          saleBrchName: "",
          saleBrchCode: "",
          saleTraderName: "",
          saleTraderNo: "",
          buyBrchName: "",
          buyBrchCode: "",
          buyProductName: "",
          buyProductNo: "",
          buyTraderName: "",
          buyTraderNo: "",
          billType: "",
          billClass: "",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          firstSettleDt: "",
          tenorDays:"",
          tenorVarieties:"",
          dueSettleDt:"",
          rate: "",
          buyBackTotalAmt: "",
          firstSettleAmt: "",
          dueSettleAmt: "",
          firstPayInterest: "",
          creditMainBrchClass: "",
          setTm: "",
          dealDtTm: "",
          respTm: "",
          totalAmt: "",
          totalNum: ""
        },
        dataGridFormItem: {
          batchId: ""
        },
        columns: [
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
            title: this.$t("m.i.common.status"),
            key: "preRelationFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "PreRelationFlag", params.row.preRelationFlag);
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
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.batchParams.dictMap, 'BillOrigin', params.row.billOrigin);
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
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueMatDt"),
            key: "dueMatDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let interest = formatNumber(params.row.firstPayInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: interest
                }
              }, interest);
            }
          },
          {
            title: this.$t("m.i.be.firstSettleAmtByUnit"),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let settleAmt = formatNumber(params.row.firstSettleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: settleAmt
                }
              }, settleAmt);
            }
          },
          {
            title: this.$t("m.i.be.dueSettleAmtByUnit"),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueSettleAmt = formatNumber(params.row.dueSettleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: dueSettleAmt
                }
              }, dueSettleAmt);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBrchCode"),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.cfmAppBrchCode"),
            key: "cfmAppBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.cfmAppBankName"),
            key: "cfmAppBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptGuarntrBrchCode"),
            key: "acptGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptGuarntrBankName"),
            key: "acptGuarntrBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBrchCode"),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBrchCode"),
            key: "discGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBankName"),
            key: "discGuarntrBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBrchCode"),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "guarntrTrustBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CreditMajor", params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.creditMainBrchCode"),
            key: "creditMainBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankName"),
            key: "creditMainBankName",
            hiddenCol: false
          }
        ],
        pickBillWin: false,
        pickBillParams: {},
        importWin:false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/market/anonyclick/sale/extractBill/func_batchExtractPickBillStock",  //excel数据导入接口
          uploadParams: {//调用excel数据解析接口时附带的额外参数
            batchId: ""
          }
        },
      };
    },
    props: {
      extractBillAddWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempExtractBillAddWin: {
        get() {
          return this.extractBillAddWin;
        },
        set() {
        }
      }
    },
    watch: {
      extractBillAddWin(val) {
        if (val) {
          this.dataGridUrl = "/be/market/anonyclick/sale/extractBill/func_querySaleBillList";
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.batchId=this.batchId;
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
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/be/market/anonyclick/sale/extractBill/func_findSaleBatchById";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.batchNo = obj.batchNo;
              this.addOrEditForm.busiType = obj.busiType;
              this.addOrEditForm.quoteNo = obj.quoteNo;
              this.addOrEditForm.dealNo = obj.dealNo;
              this.addOrEditForm.saleBrchName = obj.saleBrchName;
              this.addOrEditForm.saleBrchCode = obj.saleBrchCode;
              this.addOrEditForm.saleTraderName = obj.saleTraderName;
              this.addOrEditForm.saleTraderNo = obj.saleTraderNo;
              this.addOrEditForm.buyBrchName = obj.buyBrchName;
              this.addOrEditForm.buyBrchCode = obj.buyBrchCode;
              this.addOrEditForm.buyProductName = obj.buyProductName;
              this.addOrEditForm.buyProductNo = obj.buyProductNo;
              this.addOrEditForm.buyTraderName = obj.buyTraderName;
              this.addOrEditForm.buyTraderNo = obj.buyTraderNo;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.billClass = obj.billClass;
              this.addOrEditForm.clearType = obj.clearType;
              this.addOrEditForm.settleMode = obj.settleMode;
              this.addOrEditForm.clearSpeed = obj.clearSpeed;
              this.addOrEditForm.firstSettleDt = obj.firstSettleDt === null ? "" : obj.firstSettleDt.toString();
              this.addOrEditForm.tenorDays = obj.tenorDays;
              this.addOrEditForm.tenorVarieties = obj.tenorVarieties;
              this.addOrEditForm.dueSettleDt = obj.dueSettleDt === null ? "" : obj.dueSettleDt.toString();
              this.addOrEditForm.ratePct = obj.ratePct;
              this.addOrEditForm.buyBackTotalAmt = obj.buyBackTotalAmt=== null ?"":obj.buyBackTotalAmt.toString();
              this.addOrEditForm.firstSettleAmt = obj.firstSettleAmt=== null ?"":obj.firstSettleAmt.toString();
              this.addOrEditForm.dueSettleAmt = obj.dueSettleAmt=== null ?"":obj.dueSettleAmt.toString();
              this.addOrEditForm.firstPayInterest = obj.firstPayInterest=== null ?"":obj.firstPayInterest.toString();
              this.addOrEditForm.creditMainBrchClass = obj.creditMainBrchClass;
              this.addOrEditForm.setTm = obj.setTm;
              this.addOrEditForm.dealDtTm = obj.dealDtTm=== null ?"":obj.dealDtTm.toString();
              this.addOrEditForm.respTm = obj.respTm;
              this.addOrEditForm.totalAmt = obj.totalAmt;
              this.addOrEditForm.totalNum = obj.totalNum;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.batchId = "";
        this.dataGridFormItem.batchId="";
        this.dataGridUrl ="";
        this.$emit("extractBillAddWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
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
      //挑票
      pickBill() {
        if (this.batchId) {
          this.pickBillParams.dictMap = this.batchParams.dictMap;
          this.pickBillParams.billTypeList = this.batchParams.billTypeList;
          this.pickBillParams.billClassList = this.batchParams.billClassList;
          this.pickBillParams.bankLevelList = this.batchParams.bankLevelList;
          this.pickBillParams.tenorCodeList = this.batchParams.tenorCodeList;
          this.pickBillParams.creditMajorList = this.batchParams.creditMajorList;
          this.pickBillParams.billOriginList = this.batchParams.billOriginList;
          this.pickBillParams.batchId = this.batchId;
          this.pickBillParams.billType = this.addOrEditForm.billType;
          this.pickBillParams.billClass = this.addOrEditForm.billClass;
          this.pickBillParams.creditBranchClass = this.addOrEditForm.creditMainBrchClass;
          this.pickBillParams.url = "/be/market/anonyclick/sale/extractBill/func_anonySaleExtractPickBillStock";
          this.pickBillWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      pickBillWinClose() {
        this.pickBillParams = {};
        this.queryObjById();
        this.handleSearch();
        this.pickBillWin = false;
      },
      // 删除票据
      deleteBill() {
        if (this.batchId) {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要删除票据吗?",
            onOk: () => {
              let params = { batchId: this.batchId, ids: this.$refs.datagrid.selectIds.join(",") };
              let url = "/be/market/anonyclick/sale/extractBill/func_anonySaleExtractDeleteBill";
              this.sendPost(params, url, res=>{
                this.queryObjById();
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //利息计算
      calcInterest(){
        if (this.batchId) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认利息计算吗?",
            onOk: () => {
              let params = { id: this.batchId };
              let url = "/be/market/anonyclick/sale/extractBill/func_anonySaleExtractCalcInterest";
              this.sendPost(params, url, res=>{
                this.queryObjById();
                this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //模板下载
      importTemplate(){
        if(this.batchId){
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/anonyclick/sale/extractBill/func_downloadSaleExtractBill";
          let form = document.createElement('form');
          form.setAttribute("id","formId");
          form.setAttribute('action',url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }else{
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      importPickBill(){
        if (this.batchId) {
          this.fileParams.uploadParams.batchId = this.batchId;
          this.importWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      importSuccess() {
        this.importWin = false;
        this.queryObjById();
        this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
      },
      importWinClose() {
        this.importWin = false;
        this.queryObjById();
        this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
      },
      //提交申请
      applySubmit() {
        if (this.batchId) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认提交申请吗?",
            onOk: () => {
              let params = { id: this.batchId };
              let url = "/be/market/anonyclick/sale/extractBill/func_anonySaleExtractCommitApply";
              this.sendPost(params, url, res=>{
                this.handleClose();
              });
            }
          });

        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
              callback();
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
