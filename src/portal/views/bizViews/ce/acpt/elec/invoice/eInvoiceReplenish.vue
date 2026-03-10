<template>
  <div>
    <h-msg-box  v-model="tempInvoiceReplenishWin" :maximize="true" :mask-closable="false"
                @on-close="handleClose" width="1000" class="h-form-search-layer"
                top="10" @on-maximize="onMaximize" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div>
        <h-form :model="invoiceReplenishForm" :label-width="115" ref="invoiceReplenishForm" cols="3" class="h-form-search">
          <h-form-item prop="prodNo" :label="$t('m.i.common.busiType')" required>
            <h-select v-model="invoiceReplenishForm.prodNo" placeholder="" disabled showTitle>
              <h-option v-for="item in prodNoArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="acptType" :label="$t('m.i.ce.acptType')" required>
            <h-select v-model="invoiceReplenishForm.acptType" placeholder="" disabled showTitle>
              <h-option v-for="item in this.batchParams.acptTypeArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
            <h-input v-model="invoiceReplenishForm.drwrName" placeholder="" icon="android-search" disabled></h-input>
          </h-form-item>
          <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" required>
            <h-input v-model="invoiceReplenishForm.drwrAcctNo" placeholder="" icon="android-search" disabled></h-input>
          </h-form-item>
          <h-form-item prop="settleAcctNo" v-if="this.invoiceReplenishForm.acptType!=='3'" :label="$t('m.i.ce.settleAcctNo')" required>
            <h-input v-model="invoiceReplenishForm.settleAcctNo" placeholder="" icon="android-search" disabled></h-input>
          </h-form-item>
          <h-form-item prop="acptBrchName" :label="this.invoiceReplenishForm.acptType === '2' ? $t('m.i.ce.signBranch'): $t('m.i.ce.acptBranch')">
            <h-input placeholder="" v-model="invoiceReplenishForm.acptBrchName" icon="android-search" disabled></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.drweBankName')" v-if="this.invoiceReplenishForm.acptType !== '2'" prop="drweBankName">
            <h-input placeholder="" v-model="invoiceReplenishForm.drweBankName" icon="android-search" disabled></h-input>
          </h-form-item>
          <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
            <h-date-picker type="date" placeholder="" v-model="invoiceReplenishForm.remitDt" format="yyyy-MM-dd" showFormat :editable=false disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
            <h-date-picker type="date" placeholder="" v-model="invoiceReplenishForm.dueDt" format="yyyy-MM-dd" showFormat :editable=false disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="chargeType" :label="$t('m.i.ce.chargeType')" required>
            <h-select v-model="invoiceReplenishForm.chargeType" placeholder="" disabled showTitle>
              <h-option v-for="item in chargeTypeArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="feeRatio" :label="$t('m.i.ce.feeRatio')"  required>
            <h-typefield  placeholder="" type="money" v-model="invoiceReplenishForm.feeRatio" disabled>
              <slot slot="append"><span>&#8241;</span></slot>
            </h-typefield>
          </h-form-item>
          <h-form-item prop="commitFeeRatio" :label="$t('m.i.ce.commitFeeRatio')" disabled>
            <h-typefield  placeholder="" type="money" v-model="invoiceReplenishForm.commitFeeRatio" disabled>
              <slot slot="append"><span>&#8241;</span></slot>
            </h-typefield>
          </h-form-item>
          <h-form-item prop="acptProtocalNo" :label="$t('m.i.billInfo.acptProtocalNo')">
            <h-input v-model="invoiceReplenishForm.acptProtocalNo" placeholder="" disabled></h-input>
          </h-form-item>
          <h-form-item prop="guarntrType" :label="$t('m.i.ce.guarntrType')" required>
            <h-select v-model="invoiceReplenishForm.guarntrType" placeholder="" disabled showTitle>
              <h-option v-for="item in this.batchParams.guarntrTypeArray" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item v-if="this.invoiceReplenishForm.guarntrType !== '' && this.invoiceReplenishForm.guarntrType !== '4'" prop="guarntrNo" :label="this.invoiceReplenishForm.guarntrType === '1' ? $t('m.i.ce.guarntrNo') : this.invoiceReplenishForm.guarntrType === '2' ? $t('m.i.ce.receiptNo') : $t('m.i.ce.pollNo')" required>
            <h-input v-model="invoiceReplenishForm.guarntrNo" placeholder="" icon="android-search" disabled></h-input>
          </h-form-item>
          <h-form-item placeholder="" :label="$t('m.i.ce.guarntrRateType')"  prop="guarntrRateType" v-if="this.invoiceReplenishForm.guarntrType === '1' || this.invoiceReplenishForm.guarntrType === '2'">
            <h-select v-model="invoiceReplenishForm.guarntrRateType" placeholder=""  @on-change="guarntrRateTypeOnChange" key="guarntrRateTypeSelect" disabled showTitle>
              <h-option value="1" key="1">{{$t('m.i.ce.guarntrRateType_day')}}</h-option>
              <h-option value="30" key="30">{{$t('m.i.ce.guarntrRateType_month')}}</h-option>
              <h-option value="360" key="360">{{$t('m.i.ce.guarntrRateType_year')}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item v-if="this.invoiceReplenishForm.guarntrType === '1' || this.invoiceReplenishForm.guarntrType === '2'" prop="guarntrRate" :label="$t('m.i.ce.guarntrRate')">
            <h-typefield placeholder="" type="money" v-model="invoiceReplenishForm.guarntrRate" disabled>
              <slot slot="append">
                <span ref="guarntrTypeShow" v-html="this.guarntrRateTypeIcon"></span>
              </slot>
            </h-typefield>
          </h-form-item>
          <h-form-item v-if="this.invoiceReplenishForm.guarntrType === '1'" prop="bailPcet" :label="$t('m.i.ce.bailPcet')" required>
            <h-typefield placeholder="" type="money" v-model.number="invoiceReplenishForm.bailPcet"  disabled>
              <slot slot="append"><span>&#37;</span></slot>
            </h-typefield>
          </h-form-item>
          <h-form-item prop="agencyBankNo" v-if="this.invoiceReplenishForm.acptType === '2' || this.invoiceReplenishForm.acptType === '3'" :label="this.invoiceReplenishForm.acptType === '2' ? $t('m.i.ce.agencyBankNo') : $t('m.i.ce.byAgencyBankNo')" required>
            <h-input v-model="invoiceReplenishForm.agencyBankNo" placeholder="" disabled></h-input>
          </h-form-item>
          <h-form-item prop="agencyBankName" v-if="this.invoiceReplenishForm.acptType === '2' || this.invoiceReplenishForm.acptType === '3'" :label="this.invoiceReplenishForm.acptType === '2' ? $t('m.i.ce.agencyBankName') : $t('m.i.ce.byAgencyBankName')" required>
            <h-input v-model="invoiceReplenishForm.agencyBankName" placeholder="" disabled></h-input>
          </h-form-item>
          <h-form-item prop="agencyAcctNo" v-if="this.invoiceReplenishForm.acptType === '3'" :label="$t('m.i.ce.agencyAcctNo')" required>
            <h-input  placeholder="" v-model="invoiceReplenishForm.agencyAcctNo" disabled></h-input>
          </h-form-item>
          <h-form-item prop="invoiceAfterFlag" :label="$t('m.i.ce.invoiceAfterFlag')" required>
            <h-select v-model="invoiceReplenishForm.invoiceAfterFlag" placeholder="" showTitle disabled>
              <h-option v-for="item in this.batchParams.YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="forceInvoiceFlag" v-if="this.invoiceReplenishForm.invoiceAfterFlag === '0'" :label="$t('m.i.ce.forceInvoiceFlag')" required>
            <h-select v-model="invoiceReplenishForm.forceInvoiceFlag" placeholder="" showTitle disabled>
              <h-option v-for="item in this.batchParams.YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="invoiceFinishFlag" :label="$t('m.i.ce.invoiceFinishFlag')" required>
            <h-select v-model="invoiceReplenishForm.invoiceFinishFlag" placeholder="" showTitle>
              <h-option v-for="item in this.batchParams.YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave" >{{$t('m.i.common.save')}}</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="billColumns"
          highlight-row
          :auto-load="false"
          url="/ce/acpt/elec/invoice/eInvoiceReplenishMain/func_queryPageAcptBillByCondition"
          :bindForm="formItem"
          :onCurrentChange="handleCurrentChange"
          :onCurrentChangeCancel="handleCurrentChangeCancel"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="relationInvoice" :disabled="invoiceReplenishFlag">{{$t('m.i.ce.relationInvoice')}}</h-button>
            <h-button type="primary"  @click="invoiceManager" :disabled="invoiceReplenishFlag">{{$t('m.i.bm.invoiceManager')}}</h-button>
          </div>
        </h-datagrid>
      </div>
    </h-msg-box>
    <bill-info-main :showBillInfoWin="showBillInfoWin" @billInfoWinClose="billInfoWinClose"  :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
    <invoice-pick-bill :billPickInvoiceWin="billPickInvoiceWin" :billPickInvoiceParams="billPickInvoiceParams"
                       @billPickInvoiceWinClose="billPickInvoiceWinClose" @billPickInvoiceChange="billPickInvoiceChange"></invoice-pick-bill>
    <relation-invoice-bill-info :relationInvoiceBillWin="relationInvoiceBillWin" :relationInvoiceBillParams="relationInvoiceBillParams"
                                @relationInvoiceBillWinClose="relationInvoiceBillWinClose" ></relation-invoice-bill-info>


  </div>
</template>

<script>
import {accMul, formatBillRange, formatNumber, post} from "@/api/bizApi/commonUtil";

export default {
    name: "eInvoiceReplenish",
    components: {
      "invoice-pick-bill":()=>import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/billPickInvoice`),
      "relation-invoice-bill-info":()=>import(/* webpackChunkName: "bm/ctrct/billPickInvoice" */`@/views/bizViews/bm/ctrct/relationInvoiceBillInfo`),
    },
    data() {
      return {
        guarntrRateTypeIcon:"&#37;",
        prodNoArray: [{ key: "01010821", value: "电票银承极速签发" }, { key: "01010121", value: "电票银承签发" }],
        chargeTypeArray: [{ key: "1", value: "转账" }, { key: "2", value: "现金" }, { key: "3", value: "内部户" }],
        showBillInfoWin:false,
        billPickInvoiceWin:false,
        relationInvoiceBillWin:false,
        invoiceReplenishFlag: false,
        invoiceReplenishForm: {
          id:"",
          drwrCustNo: "",
          drwrName: "",
          drwrAcctNo: "",
          acptType: "",
          prodNo: "",
          settleAcctNo: "",
          acptProtocalNo: "",
          drwrBrchNo: "",
          drwrBankNo: "",
          drwrBankName: "",
          remitDt: "",
          dueDt: "",
          acptBrchName: "",
          acptBrchNo: "",
          paymentBrchNo: "",
          drweBankNo: "",
          drweBankName: "",
          guarntrType:"4",
          guarntrNo:"",
          guarntrOrder:"",
          guarntrRate:"",
          feeRatio:"",
          commitFeeRatio:"",
          bailPcet:"",
          settleAcctOrderNo:"",
          agencyBankNo:"",
          agencyBankName:"",
          agencyAcctNo:"",
          chargeType:"1",
          dataSource:"1",
          billClass:"ME02",
          billType:"AC01",
          guarntrRateType:"",
          invoiceAfterFlag: "0",
          forceInvoiceFlag: "",
          invoiceFinishFlag: "",
          batchNo:"",
          billId:"",
        },
        currentSelectRow:[],
        acptTypeArray: [],
        YonList: [],
        guarntrTypeArray:[],
        billId :"",
        billNo:"",
        billRangeStart:"",
        billRangeEnd:"",
        formItem:{billClass:"ME02"},
        billColumns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap,"BillOrigin",params.row.billOrigin);
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
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
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
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
            }
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: "flowStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
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
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrBankNo'),
            key: "drwrBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: "pyeeBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          }
        ],
        billPickInvoiceParams: {
          listId: "",
          custNo: "",
          billNo: "",
          invoiceFlag: "",
          billMoney: "",
          batchNo:"",
          billId:"",
          dictMap: this.batchParams.dictMap
        },
        relationInvoiceBillParams: {
          listId: "",
          cancelRelationUrl: "",
          dictMap: this.batchParams.dictMap
        },
      };
    },

    props: {
      showInvoiceReplenishWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "发票后补"
      },
      batchParams : {
        type: Object,
        default: {
          dictMap: new Map(),
          YonList: [],
          batchId: {
            type: Number
          },
          acptTypeArray:[],
          guarntrTypeArray:[]
        }
      }
    },

    computed: {
      tempInvoiceReplenishWin: {
        get() {
          return this.showInvoiceReplenishWin;
        },
        set() {
        }
      }
    },

    watch: {
      showInvoiceReplenishWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.formItem.batchId = this.batchParams.batchId;
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

      //表格自适应
      handleResize() {
        this.$nextTick(() => {
          this.$refs.datagrid.selfAdaption();
        });
      },

      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },

      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },

      //查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },

      handleClose() {
        this.currentSelectRow = [];
        this.$refs.invoiceReplenishForm.resetFields();
        this.$emit("invoiceReplenishFormClose", "");
      },

      queryObjById() {
        let params = { id: this.batchParams.batchId};
        post(params, "/ce/acpt/elec/invoice/eInvoiceReplenishMain/func_getAcptBatchById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.invoiceReplenishForm.id = obj.id;
              this.invoiceReplenishForm.prodNo = obj.prodNo;
              this.invoiceReplenishForm.acptType = obj.acptType;
              this.invoiceReplenishForm.drwrAcctNo = obj.drwrAcctNo;
              this.invoiceReplenishForm.drwrName = obj.drwrName;
              this.invoiceReplenishForm.batchNo = obj.batchNo;
              this.invoiceReplenishForm.drwrBankNo = obj.drwrBankNo;
              this.invoiceReplenishForm.drwrCustNo = obj.drwrCustNo;
              this.invoiceReplenishForm.settleAcctNo = obj.settleAcctNo;
              this.invoiceReplenishForm.acptBrchName = obj.acptBrchName;
              this.invoiceReplenishForm.acptBrchNo = obj.acptBrchNo;
              this.invoiceReplenishForm.drweBankName = obj.drweBankName;
              this.invoiceReplenishForm.drweBankNo = obj.drweBankNo;
              this.invoiceReplenishForm.chargeType = obj.chargeType;
              this.invoiceReplenishForm.feeRatio = accMul(obj.feeRatio, 10000);
              if (obj.commitFeeRatio != 0) {
                this.invoiceReplenishForm.commitFeeRatio = accMul(obj.commitFeeRatio, 10000);
              }
              this.invoiceReplenishForm.acptProtocalNo = obj.acptProtocalNo;
              this.invoiceReplenishForm.guarntrType = obj.guarntrType;
              if (this.invoiceReplenishForm.guarntrType !== '' && this.invoiceReplenishForm.guarntrType !== '4') {
                this.invoiceReplenishForm.guarntrNo = obj.guarntrNo;
              }
              if (this.invoiceReplenishForm.guarntrType === '1' || this.invoiceReplenishForm.guarntrType === '2') {
                this.invoiceReplenishForm.guarntrRateType = obj.guarntrRateType;
                this.guarntrRateTypeOnChange(obj.guarntrRateType);
                if (obj.guarntrRateType === "360") {
                  this.invoiceReplenishForm.guarntrRate = accMul(obj.guarntrRate, 100);
                }
                if (obj.guarntrRateType === "30") {
                  this.invoiceReplenishForm.guarntrRate = accMul(obj.guarntrRate, 1000);
                }
                if (obj.guarntrRateType === "1") {
                  this.invoiceReplenishForm.guarntrRate = accMul(obj.guarntrRate, 10000);
                }
              }
              if (this.invoiceReplenishForm.guarntrType === '1') {
                this.invoiceReplenishForm.bailPcet = accMul(obj.bailPcet, 100);
              }
              if (this.invoiceReplenishForm.acptType === '2' || this.invoiceReplenishForm.acptType === '3') {
                this.invoiceReplenishForm.agencyBankNo = obj.agencyBankNo;
                this.invoiceReplenishForm.agencyBankName = obj.agencyBankName;
              }
              if (this.invoiceReplenishForm.acptType === '3') {
                this.invoiceReplenishForm.agencyAcctNo = obj.settleAcctNo;
              }
              if (!!obj.remitDt) {
                this.invoiceReplenishForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              if (!!obj.dueDt) {
                this.invoiceReplenishForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.invoiceReplenishForm.invoiceAfterFlag = obj.invoiceAfterFlag;
              this.invoiceReplenishForm.forceInvoiceFlag = obj.forceInvoiceFlag;
              this.invoiceReplenishForm.invoiceFinishFlag = obj.invoiceFinishFlag;
              if (this.invoiceReplenishForm.invoiceFinishFlag === "1") {
                  this.invoiceReplenishFlag = true;
              } else {
                this.invoiceReplenishFlag = false;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      guarntrRateTypeOnChange(value) {
        if (value === "360") {
          this.guarntrRateTypeIcon = "&#37;";
        } else if (value === "30") {
          this.guarntrRateTypeIcon = "&#8240;";
        } else if (value === "1") {
          this.guarntrRateTypeIcon = "&#8241;";
        } else {
          this.guarntrRateTypeIcon = "";
        }
      },

      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      showBillInfo(row, type) {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        if (type === "billId") {
          this.billId = row.billId;
        } else {
          this.billNo = row.billNo;
        }
        this.showBillInfoWin = true;
      },

      //保存
      formSave() {
        this.$refs["invoiceReplenishForm"].validate (valid => {
            if(valid) {
              let param = {id:this.batchParams.batchId, invoiceFinishFlag:this.invoiceReplenishForm.invoiceFinishFlag};
              let url = "/ce/acpt/elec/invoice/eInvoiceReplenishMain/func_invoiceReplenishFinish";
              post(param, url).then(res => {
                if (res) {
                  if (res.data.retCode === "000000") {
                    this.$msgTip.success(this, { info: res.data.retMsg });
                    this.queryObjById();
                    this.handleSearch();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
        });
      },

      //关联发票
      relationInvoice() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.billPickInvoiceParams.listId = this.currentSelectRow.id;
        this.billPickInvoiceParams.custNo = this.invoiceReplenishForm.drwrCustNo;
        this.billPickInvoiceParams.billNo = this.currentSelectRow.billNo;
        this.billPickInvoiceParams.invoiceFlag = this.currentSelectRow.invoiceFlag;
        this.billPickInvoiceParams.billMoney = this.currentSelectRow.billMoney;
        this.billPickInvoiceParams.batchNo = this.invoiceReplenishForm.batchNo;
        this.billPickInvoiceParams.billId = this.currentSelectRow.billId;
        this.billPickInvoiceParams.billRangeStart = this.currentSelectRow.billRangeStart;
        this.billPickInvoiceParams.billRangeEnd = this.currentSelectRow.billRangeEnd;
        this.billPickInvoiceParams.dictMap = this.batchParams.dictMap;
        this.billPickInvoiceWin = true;
      },

      //关联发票业务表处理
      billPickInvoiceChange(listId) {
        if (this.billPickInvoiceParams.invoiceFlag === "1") {
          this.billPickInvoiceWinClose();
        } else {
          post({id:listId }, "/ce/acpt/elec/invoice/eInvoiceReplenishMain/func_relatedInvoice").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.billPickInvoiceWinClose();
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
                this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      },

      billPickInvoiceWinClose() {
        this.billPackInvoiceClear();
        this.currentSelectRow = [];
        this.billPickInvoiceWin = false;
        this.$refs.datagrid.dataChange(1);
      },

      billPackInvoiceClear() {
        this.billPickInvoiceParams.listId = "";
        this.billPickInvoiceParams.custNo = "";
        this.billPickInvoiceParams.billNo = "";
        this.billPickInvoiceParams.invoiceFlag = "";
        this.billPickInvoiceParams.billMoney = "";
        this.billPickInvoiceParams.batchNo = "";
        this.billPickInvoiceParams.billId = "";
      },

      //发票管理
      invoiceManager() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let invoiceFlag = this.currentSelectRow.invoiceFlag;
        if (invoiceFlag === "1") {
          this.relationInvoiceBillParams.listId = this.currentSelectRow.id;
          this.relationInvoiceBillParams.cancelRelationUrl = "/ce/acpt/elec/invoice/eInvoiceReplenishMain/func_cancelRelatedInvoice";
          this.relationInvoiceBillParams.dictMap = this.batchParams.dictMap;
          this.relationInvoiceBillWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.ce.relationInvoiceError") });
          return;
        }
      },

      //发票管理返回
      relationInvoiceBillWinClose() {
        this.relationInvoiceBillParams.listId = "";
        this.relationInvoiceBillParams.cancelRelationUrl = "";
        this.relationInvoiceBillWin = false;
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      }

    },
  };
</script>

<style scoped>

</style>
