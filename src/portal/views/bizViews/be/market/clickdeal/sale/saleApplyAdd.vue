<!--点击成交-卖出申请-新增、修改、查看弹出框-->
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
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search" onlyBlurRequire>
          <busi-type v-model="addOrEditForm.busiType" :dictList="batchParams.busiTypeList" :readonly="true"></busi-type>
          <common-input v-model="addOrEditForm.saleBrchName" :label="$t('m.i.be.brchName')" prop="saleBrchName"
                        :readonly="true"></common-input>
          <common-input v-model="addOrEditForm.saleTraderName" :label="$t('m.i.be.traderName')" prop="saleTraderName"
                        :readonly="true"></common-input>
          <apply-form-item :addForm="addOrEditForm" :batchParams="batchParams"></apply-form-item>
          <common-select v-model="addOrEditForm.clearSpeed" :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" :dictList="batchParams.clearSpeedList"
                         :required="true" @on-change="changeSpeed"></common-select>
          <common-date-picker v-model="addOrEditForm.settleDt" :label="$t('m.i.be.settleDt')" prop="settleDt"
                              :readonly="true" :required="true"></common-date-picker>
          <common-time-picker v-model="addOrEditForm.setTm" :label="$t('m.i.be.setTm')" prop="setTm"
                               :required="true"></common-time-picker>
          <common-time-picker v-model="addOrEditForm.quoteTm" :label="$t('m.i.be.quoteTm')" prop="quoteTm"
                               :required="true"></common-time-picker>
          <common-select v-model="addOrEditForm.creditMainBrchClass" :label="$t('m.i.billInfo.creditMainBankType')"
                         prop="creditMainBrchClass" :dictList="batchParams.creditMajorList" :clearable="false"
                         :required="true"></common-select>
          <common-select v-model="addOrEditForm.transClearMode" :label="$t('m.i.be.transClearMode')"
                         prop="transClearMode" :dictList="batchParams.clearModeList"></common-select>
          <common-type-field v-model="addOrEditForm.totalAmt" :label="$t('m.i.common.totalAmtBillPackage')" prop="totalAmt"
                        :readonly="true"></common-type-field>
          <common-input v-model="addOrEditForm.totalNum" :label="$t('m.i.common.totalNumBillPackage')" prop="totalNum"
                        :readonly="true"></common-input>
          <common-type-field v-model="addOrEditForm.interest" :label="$t('m.i.be.payInterestByUnit')" prop="interest"
                        :readonly="true"></common-type-field>
          <common-type-field v-model="addOrEditForm.settleAmt" :label="$t('m.i.be.settleAmtByUnit')" prop="settleAmt"
                        :readonly="true"></common-type-field>
          <common-input v-model="addOrEditForm.tenorDays" :label="$t('m.i.be.tenorDays')" prop="tenorDays"
                        :readonly="true" class="h-form-long-label"></common-input>
          <common-input v-model="addOrEditForm.yieldRatePct" :label="$t('m.i.be.yieldRate')" prop="yieldRate"
                        :readonly="true"></common-input>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()">保存</h-button>
        </div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="3" class="h-form-search" onlyBlurRequire>
          <select-trans-brch-type v-model="transBrchTypesName" :transBrchTypeParams="transBrchTypeParams"
                                  :notinDatagridUrl="notinDatagridUrlBrchClass" :deleteUrl="deleteUrlBrchClass"
                                  :addUrl="addUrlBrchClass" @transBrchTypeWinClose="transBrchTypeWinClose"
                                  :saveBatch="saveBatchFunc" :label="$t('m.i.be.transCustType')"></select-trans-brch-type>
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
            <h-button type="primary" @click="importPickBill()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.exportPickBill")}}
            </h-button>
            <h-button type="primary" @click="calcInterest()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.calcInterest")}}
            </h-button>
            <h-button type="primary" @click="applySubmit()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.applyBatch")}}
            </h-button>
            <h-button type="primary" @click="deleteBill()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.be.deleteBill")}}
            </h-button>
            <h-button type="primary" @click="importTemplate()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.templateDownload")}}
            </h-button>
            <h-button type="primary" @click="exportTable()" v-if="batchParams.batchType!=='show'"
                      :disabled="exportBillCommit">
              {{$t("m.i.common.exportExcel")}}
            </h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!--挑票-->
    <sale-pick-bill :pickBillWin="pickBillWin" :pickBillParams="pickBillParams"
                    @pickBillWinClose="pickBillWinClose"></sale-pick-bill>
    <!-- 批量导入-->
    <upload
      :uploadUrl="uploadUrl"
      :batchId="batchId"
      @uploadWinClose="uploadWinClose"
      :uploadWin="uploadWin"
      :importSelect="importSelect"
      :flag="flag"
      :selectDataFirst="selectDataFirst">
    </upload>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <!--提交申请-->
    <apply-commit :applyWin="applyWin" :applyTitle="applyTitle" @applyClose="applyClose" @applyCommit="applyCommit"></apply-commit>
    <!--清单导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="showExcelTemplateWin" :param="this.exportParam"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber ,getDictValueFromMap,getUploadImgType} from "@/api/bizApi/commonUtil";

  export default {
    name: "saleApplyAdd",
    components: {
      ApplyCommit: () => import(/* webpackChunkName: "be/market/common/applyCommitWin"*/"@/views/bizViews/be/market/common/applyCommit"),
      SalePickBill: () => import(/* webpackChunkName: "be/market/clickdeal/sale/salePickBill"*/"@/views/bizViews/be/market/clickdeal/sale/salePickBill"),
      SelectTransBrchType: () => import(/* webpackChunkName: "be/market/common/selectTransBrchType"*/"@/views/bizViews/be/market/common/selectTransBrchType"),
      ApplyFormItem: () => import(/* webpackChunkName: "be/market/common/applyFormItem"*/"@/views/bizViews/be/market/common/applyFormItem"),
      Upload:()=>import(/* webpackChunkName: "be/market/clickdeal/sale/upload" */`@/views/bizViews/be/market/clickdeal/sale/upload`),
    },
    data() {
      return {
        batchId: "",
        transBrchTypesName: "",
        transBrchTypeParams: {
          batchId: this.batchId,
          operate: "tradeClass"
        },
        datagridUrlBrchClass: "/be/market/clickdeal/sale/saleApply/func_queryBranchClass",
        notinDatagridUrlBrchClass: "/be/market/clickdeal/sale/saleApply/func_queryBranchClassAdd",
        deleteUrlBrchClass: "/be/market/clickdeal/sale/saleApply/func_deleteSaleBranchClass",
        addUrlBrchClass: "/be/market/clickdeal/sale/saleApply/func_addSaleBranchClass",
        addForm: {},
        addOrEditForm: {
          workDate: "",
          id: "",
          busiType: "",
          saleBrchName: "",
          saleTraderName: "",
          trDir: "",
          isAnony: "",
          billType: "",
          billClass: "",
          tradeRange: "",
          ratePct: "",
          subDeal: "",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          settleDt: "",
          setTm: "",
          quoteTm: "",
          creditMainBrchClass: "",
          transClearMode: "",
          productNo: "",
          totalAmt: "",
          totalNum: "",
          interest: "",
          settleAmt: "",
          tenorDays: "",
          yieldRate: ""
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
          // {
          //   title: this.$t("m.i.common.status"),
          //   key: "preRelationFlag",
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "PreRelationFlag", params.row.preRelationFlag);
          //     return h("span", {
          //       domProps: {
          //         title: dictValue
          //       }
          //     }, dictValue);
          //   }
          // },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' :  this.getDictValueFromMap(this.batchParams.dictMap, 'BillOrigin', params.row.billOrigin);
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
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
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
            hiddenCol: false,
            sortable: true,
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
            key: "trustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "guarntrTrustBankName",
            hiddenCol: false
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
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.batchParams.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.remainingPeriod"),
            key: "remainDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "interest",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let interest = formatNumber(params.row.interest, 2, ",");
              return h("span", {
                domProps: {
                  title: interest
                }
              }, interest);
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "settleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let settleAmt = formatNumber(params.row.settleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: settleAmt
                }
              }, settleAmt);
            }
          },
        ],
        //记录批次是否已保存
        hadBatchSave: false,
        pickBillWin: false,
        pickBillParams: {},
        uploadUrl:'',
        uploadWin:false,
        importSelect:false,
        selectDataFirst:false,
        flag:"0",
        isCurChange: false,
        exportBillCommit: false,
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart:'',
        billRangeEnd:'',
        applyWin: false,
        applyTitle: "",
        riskFlag: "0",
        showExcelTemplateWin: false,
        rows: null,
        exportParam: "clickDealSaleBillInfo",
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
        default() {
          return {};
        }
      },
      dataGridUrl: {
        type: String,
        default: "/be/market/clickdeal/sale/saleApply/func_getClickSaleBillList"
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
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.isCurChange = false;
            this.dataGridFormItem.batchId = this.batchId;
            this.transBrchTypeParams.batchId = this.batchId;
            if (this.batchParams.batchType === "add") {
              this.hadBatchSave = true;
              this.$refs.datagrid.tData = [];
              this.queryObjById();
            }
            if (this.batchParams.batchType !== "add") {
              this.hadBatchSave = true;
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
      transBrchTypeWinClose(){
        this.queryObjById();
        this.handleSearch();
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { batchId: this.batchId };
        let url = "/be/market/clickdeal/sale/saleApply/func_editClickDealSale";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.workDate = obj.workDate;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.busiType = obj.busiType;
              this.addOrEditForm.saleBrchName = obj.saleBrchName;
              this.addOrEditForm.saleTraderName = obj.saleTraderName;
              this.addOrEditForm.trDir = obj.trDir;
              this.addOrEditForm.isAnony = obj.isAnony;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.billClass = obj.billClass;
              this.addOrEditForm.tradeRange = obj.tradeRange;
              this.addOrEditForm.ratePct = obj.ratePct;
              this.addOrEditForm.subDeal = obj.subDeal;
              this.addOrEditForm.clearType = obj.clearType;
              this.addOrEditForm.settleMode = obj.settleMode;
              this.addOrEditForm.clearSpeed = obj.clearSpeed;
              this.addOrEditForm.settleDt = obj.settleDt === null ? "" : obj.settleDt.toString();
              this.addOrEditForm.setTm = obj.setTm === null ? "" : obj.setTm.toString();
              this.addOrEditForm.quoteTm = obj.quoteTm === null ? "" : obj.quoteTm.toString();
              this.addOrEditForm.creditMainBrchClass = obj.creditMainBrchClass;
              this.addOrEditForm.transClearMode = obj.transClearMode;
              this.addOrEditForm.productNo = obj.productNo;
              this.addOrEditForm.totalAmt = obj.totalAmt;
              this.addOrEditForm.totalNum = obj.totalNum;
              this.addOrEditForm.interest = obj.interest;
              this.addOrEditForm.settleAmt = obj.settleAmt;
              this.addOrEditForm.tenorDays = obj.tenorDays;
              this.addOrEditForm.yieldRatePct = obj.yieldRatePct;
              this.addOrEditForm.transCustType = obj.transCustType;
              if(null != obj.transCustType){
                let transCustNameList = [];
                obj.transCustType.split(",").forEach(x => transCustNameList.push(this.batchParams.brchClassMap.get(x)));
                this.transBrchTypesName = transCustNameList.join(",");
              }
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
        this.hadBatchSave = false;
        this.transBrchTypesName = "";
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
            this.queryObjById();
            this.$msgTip.success(this);
          }
        });
      },
      saveBatchFunc(callback){
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.settleDt = this.addOrEditForm.settleDt.replace(/-/g, "");
            let url = "/be/market/clickdeal/sale/saleApply/func_addClickDealSaleBatch";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.batchId = res.data.retData.id;
                  this.transBrchTypeParams.batchId = res.data.retData.id;
                  this.dataGridFormItem.batchId = res.data.retData.id;
                  this.addOrEditForm.id = res.data.retData.id;
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.hadBatchSave = true;
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
        } else if (optType === "importPickBill") {//导入挑票
          this.importPickBillCallback();
        } else if (optType === "calcInterest") {//利息计算
          this.calcInterestCallback();
        } else if (optType === "applySubmit") {//提交申请
          this.applySubmitCallback();
        }
      },
      //挑票
      pickBill() {
        this.saveBatch("pickBill");
      },
      pickBillCallBack() {
        if (this.hadBatchSave) {
          this.pickBillParams = this.batchParams;
          this.pickBillParams.batchId = this.batchId;
          this.pickBillParams.billType = this.addOrEditForm.billType;
          this.pickBillParams.billClass = this.addOrEditForm.billClass;
          this.pickBillParams.creditBranchClass = this.addOrEditForm.creditMainBrchClass;
          this.pickBillParams.creditBranchClassName = this.batchParams.brchClassMap.get(this.addOrEditForm.creditMainBrchClass);
          this.pickBillParams.url = "/be/market/clickdeal/sale/saleApply/func_addClickDealSaleBill";
          this.pickBillWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      pickBillWinClose() {
        this.pickBillParams = {};
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.queryObjById();
        this.pickBillWin = false;
      },
      //导入挑票
      importPickBill() {
        this.saveBatch("importPickBill");
      },
      importPickBillCallback() {
        if (this.hadBatchSave) {
          this.uploadWin = true;
          this.uploadUrl = window.LOCAL_CONFIG.API_HOME+'/be/market/clickdeal/sale/saleApply/func_batchPickBillStock';
          this.importSelect = true;
          this.selectDataFirst = false;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      uploadWinClose() {
        this.uploadWin = false;
        this.uploadUrl = '';
        this.importSelect = false;
        this.selectDataFirst = false;
        this.queryObjById();
        this.$refs.datagrid.dataChange(1);
      },
      // 利息计算
      calcInterest() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要计算利息吗") + "?",
          onOk: () => {
            this.saveBatch("calcInterest");
          }
        });
      },
      calcInterestCallback() {
        if (this.hadBatchSave) {
          let params = { batchId: this.batchId };
          let url = "/be/market/clickdeal/sale/saleApply/func_calcInterest";
          this.sendPost(params, url, res=>{
            this.queryObjById();
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
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
      //提交申请
      applySubmit() {
        if(window.sessionStorage.getItem("isOpenI9")=="1"){
          let flag1="";
          getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
            let value = res.value
            if(value=='0'){//否
              flag1="0";
            }else if(value=="1"){//是
              flag1="1";
            }
            let list=this.$refs.datagrid.tData;
            let flag=1;
            let billList='';
            console.log(list)
            for(let i=0;i<list.length;i++){
              if (list[i].assetIndustry == "1") {
                if(billList){
                  billList+="、";
                }
                billList+=('票据(包)号码'+this.getBillNoAndCdRange(list[i].billNo,list[i].billRangeStart,list[i].billRangeEnd));
                flag=0;
              }
            }
            if(flag==0 && flag1=="0"){
              let info="选中" + billList + "资产类型为持有-按摊余成本计量，不允许提交";
              this.$msgTip.error(this, { info: info});

            }else if(flag==0 && flag1=="1"){
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
            }else{
              this.applyWin = true;
              this.applyTitle = "确认要提交申请吗?";
            }

          })
        }else{
          this.applyWin = true;
          this.applyTitle = "确认要提交申请吗?";
        }

      },
      applySubmitCallback() {
        if (this.hadBatchSave) {
          let params = { batchId: this.batchId, riskFlag: this.riskFlag };
          let url = "/be/market/clickdeal/sale/saleApply/func_commitClickSaleBatchApply";
          post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                let riskInfo = obj.riskInfo;
                if (riskInfo) {
                  this.riskFlag = "1";
                  this.continueApply(riskInfo);
                } else {
                  this.$msgTip.success(this);
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.handleClose();
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      // 删除票据
      deleteBill() {
        if (this.hadBatchSave) {
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
              let url = "/be/market/clickdeal/sale/saleApply/func_deleteBill";
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
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/clickdeal/sale/saleApply/func_downloadSaleBill";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      // 导出清单
      exportTable() {
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.showExcelTemplateWin = true;
      },
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "be/market/clickdeal/sale/saleApply/func_exportClickSaleBillDetail";
        if (exportType === "1") {
          let params = null;
          params = {
            ids: this.$refs.datagrid.selectIds,
            batchId: this.batchId,
            pageSize: this.$refs.datagrid.selectIds.length,
            field: field,
            exportType: exportType,
            excelName: this.exportParam
          };
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");

          let input1 = document.createElement("input");
          input1.type = "text";
          input1.name = "ids";
          input1.value = this.$refs.datagrid.selectIds;
          form.appendChild(input1);
          let input3 = document.createElement("input");
          input3.type = "text";
          input3.name = "field";
          input3.value = field;
          form.appendChild(input3);
          let input4 = document.createElement("input");
          input4.type = "text";
          input4.name = "exportType";
          input4.value = exportType;
          form.appendChild(input4);
          let input5 = document.createElement("input");
          input5.type = "text";
          input5.name = "excelName";
          input5.value = this.exportParam;
          form.appendChild(input5);
          let input6 = document.createElement("input");
          input6.type = "text";
          input6.name = "batchId";
          input6.value = this.batchId;
          form.appendChild(input6);

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      showExcelTemplateWinClose(){
        this.showExcelTemplateWin = false;
      },
      changeSpeed(currVal) {
        if (!this.isCurChange) {
          this.isCurChange = true;
          return;
        }
        let workDt = window.sessionStorage.getItem("workDate");
        // T+1 情况
        if (currVal === "CS01") {
          let workDate = this.$moment(workDt, "YYYYMMDD").format("YYYY/MM/DD");
          workDate = new Date(workDate);
          let workDatePlus = workDate.valueOf() + (1 * 24 * 60 * 60 * 1000);
          workDatePlus = new Date(workDatePlus);
          workDatePlus = this.$moment(workDatePlus, "YYYYMMDD").format("YYYYMMDD");
          post({ code: workDatePlus }, "/sm/oper/holiday/getWorkDate").then(res => {
            if (res && res.data.retCode === "000000") {
              this.addOrEditForm.settleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYY-MM-DD");
            }
          });
        } else {
          this.addOrEditForm.settleDt = this.$moment(workDt, "YYYYMMDD").format("YYYY-MM-DD");
        }

      },
      billInfoWinClose(){
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
      applyClose() {
        this.applyWin = false;
        this.applyTitle = "";
      },
      applyCommit() {
        this.saveBatch("applySubmit");
        this.applyClose();
      },
      continueApply(content) {
        this.$hMsgBox.confirm({
          title: "确认要继续提交申请吗?",
          content: content,
          onOk: () => {
            let params = { batchId: this.batchId, riskFlag: this.riskFlag };
            let url = "/be/market/clickdeal/sale/saleApply/func_commitClickSaleBatchApply";
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
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
      }
    }
  };
</script>

<style scoped>

</style>
