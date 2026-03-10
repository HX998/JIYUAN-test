<!--匿名点击正回购-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempSaleApplyAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增报价</span>
        <span v-else-if="batchParams.batchType==='modify'">修改报价</span>
        <span v-else-if="batchParams.batchType==='show'">查看报价</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <anony-apply-form-item :addForm="addOrEditForm" :batchParams="batchParams"></anony-apply-form-item>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()">保存</h-button>
        </div>
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
            <!--<h-button type="primary" @click="importPickBill()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.exportPickBill")}}
            </h-button>-->
            <!--<h-button type="primary" @click="calcInterest()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.calcInterest")}}
            </h-button>-->
            <h-button type="primary" @click="applySubmit()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.applyBatch")}}
            </h-button>
            <h-button type="primary" @click="deleteBill()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.deleteBill")}}
            </h-button>
            <!--<h-button type="primary" @click="importTemplate()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.templateDownload")}}
            </h-button>-->
            <!--<h-button type="primary" @click="exportBill()" v-if="batchParams.batchType!=='show'"
                      :disabled="exportBillCommit">
              {{$t("m.i.common.exportExcel")}}
            </h-button>-->
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
    <!--<common-file-upload-no-show :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>-->
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleApplyAdd",
    components: {
      AnonyApplyFormItem: () => import(/* webpackChunkName: "be/market/anonyclick/sale/anonyApplyFormItem"*/"@/views/bizViews/be/market/anonyclick/sale/anonyApplyFormItem"),
      SalePickBill: () => import(/* webpackChunkName: "be/market/anonyclick/sale/salePickBill"*/"@/views/bizViews/be/market/anonyclick/sale/salePickBill")
    },
    data() {
      return {
        dataGridUrl: "",
        batchId: "",
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        addOrEditForm: {
          id: "",
          busiType: "",
          saleBrchName: "",
          saleTraderName: "",
          billType: "",
          billClass: "",
          rate: "",
          buyBackTotalAmt: "",
          tenorDays:"",
          tenorVarieties:"",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          settleDt: "",
          dueSettleDt:"",
          creditMainBrchClass: "",
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
            key: "creditMainBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CreditMajor", params.row.creditMainBrchClass);
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
      };
    },
    props: {
      saleApplyAddOrEditWin: {
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
      tempSaleApplyAddOrEditWin: {
        get() {
          return this.saleApplyAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      saleApplyAddOrEditWin(val) {
        if (val) {
          this.dataGridUrl = "/be/market/anonyclick/sale/saleApply/func_queryAnonySaleBillList";
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.batchId=this.batchId;
            if (this.batchParams.batchType === "add") {
              this.batchParams.isSpeedChange=true;
              this.batchParams.isTenorVarietiesChange=true;
              this.queryObjById();
              this.handleSearch();
            }
            if (this.batchParams.batchType === "modify" || this.batchParams.batchType === "show") {
              this.batchParams.isSpeedChange=false;
              this.batchParams.isTenorVarietiesChange=false;
              this.queryObjById();
              this.handleSearch();
            }
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
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/be/market/anonyclick/sale/saleApply/func_findEditAnonySaleBatch";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.busiType = obj.busiType;
              this.addOrEditForm.saleBrchName = obj.saleBrchName;
              this.addOrEditForm.saleTraderName = obj.saleTraderName;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.billClass = obj.billClass;
              this.addOrEditForm.ratePct = obj.ratePct;
              this.addOrEditForm.buyBackTotalAmt = obj.buyBackTotalAmt=== null ?"":obj.buyBackTotalAmt.toString();
              if(obj.tenorDays){
                this.addOrEditForm.tenorDays = obj.tenorDays;
              }
              this.addOrEditForm.tenorVarieties = obj.tenorVarieties;
              this.addOrEditForm.clearType = obj.clearType;
              this.addOrEditForm.settleMode = obj.settleMode;
              this.addOrEditForm.clearSpeed = obj.clearSpeed;
              this.addOrEditForm.settleDt = obj.settleDt === null ? "" : obj.settleDt.toString();
              if(obj.dueSettleDt){
                this.addOrEditForm.dueSettleDt = obj.dueSettleDt === null ? "" : obj.dueSettleDt.toString();
              }
              this.addOrEditForm.creditMainBrchClass = obj.creditMainBrchClass;
              this.addOrEditForm.totalAmt = obj.totalAmt;
              this.addOrEditForm.totalNum = obj.totalNum;
              this.addOrEditForm.workDate = obj.workDate;
              this.addOrEditForm.maxTenorDays = obj.maxTenorDays;
              this.addOrEditForm.minRate = obj.minRate;
              this.addOrEditForm.maxRate = obj.maxRate;
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
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("saleApplyAddOrEditWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //保存批次信息
      formSave() {
          this.saveBatch();
      },
      saveBatch(optType) {
        this.saveBatchFunc(res=>{
          if (optType) {
            this.triggerClickEvent(optType);
          }else{
            this.$msgTip.success(this);
          }
        });
      },
      saveBatchFunc(callback){
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let minRate=this.addOrEditForm.minRate?this.addOrEditForm.minRate:0;
            let maxRate=this.addOrEditForm.maxRate?this.addOrEditForm.maxRate:100;
            let minRateBoolean=this.addOrEditForm.ratePct-minRate<0;
            let maxRateBoolean=this.addOrEditForm.ratePct-maxRate>0;
            if(minRateBoolean){
              this.$msgTip.error(this, { info: "回购利率必须大于等于票交所最小利率参数:"+minRate});
              return;
            }
            if(maxRateBoolean){
              this.$msgTip.error(this, { info: "回购利率必须小于等于票交所最大利率参数:"+maxRate});
              return;
            }
            let maxTenorDays=this.addOrEditForm.maxTenorDays?this.addOrEditForm.maxTenorDays:365;
            if(parseInt(this.addOrEditForm.tenorDays)>parseInt(maxTenorDays)){
              this.$msgTip.error(this, { info: "回购期限不能大于"+maxTenorDays +"天"});
              return;
            }
            this.addOrEditForm.settleDt = this.addOrEditForm.settleDt.replace(/-/g, "");
            this.addOrEditForm.dueSettleDt = this.addOrEditForm.dueSettleDt.replace(/-/g, "");
            let url = "/be/market/anonyclick/sale/saleApply/func_editAnonySaleApply";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.batchId = res.data.retData.id;
                  this.dataGridFormItem.batchId = res.data.retData.id;
                  this.addOrEditForm.id = res.data.retData.id;
                  this.handleSearch();
                  callback();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //按钮事件触发保存
      triggerClickEvent(optType) {
        if (optType === "pickBill") {//挑票
          this.pickBillCallBack();
        } else if (optType === "applySubmit") {//提交申请
          this.applySubmitCallback();
        }
      },
      //挑票
      pickBill() {
        this.saveBatch("pickBill");
      },
      pickBillCallBack() {
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
          this.pickBillParams.url = "/be/market/anonyclick/sale/saleApply/func_anonySalePickBill";
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
      //提交申请
      applySubmit() {
        this.saveBatch("applySubmit");
      },
      applySubmitCallback() {
        if (this.batchId) {
          let params = { id: this.batchId };
          let url = "/be/market/anonyclick/sale/saleApply/func_commitAnonySaleApply";
          this.sendPost(params, url, res=>{
            this.handleClose();
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
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
              let url = "/be/market/anonyclick/sale/saleApply/func_anonySaleDeleteBill";
              this.sendPost(params, url, res=>{
                this.queryObjById();
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
