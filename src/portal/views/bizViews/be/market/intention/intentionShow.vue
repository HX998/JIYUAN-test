<template>
  <h-msg-box v-model="tempIntentionShow" @on-close="handleClose" width="1000"
             class="h-form-search-layer" :maximize="true" :footerHide="true">
    <p slot="header">
      <span>意向询价详情</span>
    </p>
    <h-panel>
      <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
        <div class="h-search-form-row">
          <h-form-item prop="id" v-if="false">
            <h-input :value="addOrEditForm.id"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
            <h-select v-model="addOrEditForm.busiType" disabled placeholder="">
              <h-option v-for="item in BusiTypeList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.intentionReqId')" prop="intentionReqId">
            <h-input v-model="addOrEditForm.intentionReqId" disabled></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.sendBrchName')" prop="sendBrchName">
            <h-input v-model="addOrEditForm.sendBrchName" disabled></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.sendProductName')" prop="sendProductName" class="h-form-long-label">
            <h-input v-model="addOrEditForm.sendProductName" disabled></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.sendTraderName')" prop="sendTraderName">
            <h-input v-model="addOrEditForm.sendTraderName" disabled></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.tradDir')" prop="trDir" v-if="intentionType === 'BT01'">
            <h-select v-model="addOrEditForm.trDir" disabled placeholder="">
              <h-option v-for="item in TdDirectionList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.tradDir')" prop="trDir" v-if="intentionType !== 'BT01'">
            <h-select v-model="addOrEditForm.trDir" disabled placeholder="">
              <h-option v-for="item in CrDirectionList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.transmitRate')" prop="sendRange">
            <h-select v-model="addOrEditForm.sendRange" disabled placeholder="">
              <h-option v-for="item in SendRangeList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
            <h-select v-model="addOrEditForm.billType" disabled placeholder="">
              <h-option v-for="item in BillTypeList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
            <h-select v-model="addOrEditForm.billClass" disabled placeholder="">
              <h-option v-for="item in BillClassList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.totalAmtBillPackageByTenThousandUnit')" prop="totalAmt">
            <h-typefield type="money" v-model="addOrEditForm.totalAmt" disabled></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.buyBackTotalAmtByUnit')" prop="buyBackTotalAmt" v-if="intentionType === 'BT02'">
            <h-typefield type="money" v-model="addOrEditForm.buyBackTotalAmt" disabled></h-typefield>
          </h-form-item>
          <h-form-item :label="residualTermLable" prop="minResidualTerm">
            <h-row>
              <h-col span="11">
                <h-select v-model="addOrEditForm.minResidualTerm" disabled placeholder="">
                  <h-option v-for="item in TenorCodeList" :value="item.key" :key="item.value">{{ item.value}}
                  </h-option>
                </h-select>
              </h-col>
              <h-col span="2" style="text-align: center">-</h-col>
              <h-col span="11">
                <h-select v-model="addOrEditForm.maxResidualTerm" disabled placeholder="">
                  <h-option v-for="item in TenorCodeList" :value="item.key" :key="item.value">{{ item.value}}
                  </h-option>
                </h-select>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.tradRate')" prop="rate" v-if="intentionType === 'BT01'">
            <h-typefield integerNum="2" suffixNum="4"  type="money" v-model="addOrEditForm.rate" disabled></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.repurchaseRate')" prop="rate" v-if="intentionType === 'BT02'">
            <h-typefield integerNum="2" suffixNum="4"  type="money" v-model="addOrEditForm.rate" disabled></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.firstTransRate')" prop="rate" v-if="intentionType === 'BT03'">
            <h-typefield integerNum="2" suffixNum="4"  type="money" v-model="addOrEditForm.rate" disabled></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.dueTransRate')" prop="dueRate" v-if="intentionType === 'BT03'">
            <h-typefield integerNum="2" suffixNum="4"  type="money" v-model="addOrEditForm.dueRate" disabled></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.buyBackEarningRate')" prop="yieldRate" v-if="intentionType === 'BT03'">
            <h-typefield integerNum="2"  suffixNum="6" type="money" v-model="addOrEditForm.yieldRate" disabled></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.billSelectType')" prop="selectType" v-if="intentionType === 'BT02'">
            <h-select v-model="addOrEditForm.selectType" disabled>
              <h-option v-for="item in CdSelectModeList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.transCustType')" prop="transCustTypeList" cols="3">
            <h-checkbox-group v-model="addOrEditForm.transCustTypeList">
              <h-checkbox v-for="item in CreditCustTypeList" :label="item.key" :key="item.value" disabled>{{
                item.value}}
              </h-checkbox>
            </h-checkbox-group>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.creditMainBankType')" prop="creditCustTypeList" cols="3">
            <h-checkbox-group v-model="addOrEditForm.creditCustTypeList">
              <h-checkbox v-for="item in CreditCustTypeList" :label="item.key" :key="item.value" disabled>{{
                item.value}}
              </h-checkbox>
            </h-checkbox-group>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.intentionRemark')" prop="intentionRemark" cols="3">
            <h-input v-model="addOrEditForm.intentionRemark" disabled></h-input>
          </h-form-item>
          <h-form-item prop="sendBrchCode" v-if="false">
            <h-input v-model="addOrEditForm.sendBrchCode"></h-input>
          </h-form-item>
          <h-form-item prop="sendProductNo" v-if="false">
            <h-input v-model="addOrEditForm.sendProductNo"></h-input>
          </h-form-item>
          <h-form-item prop="sendTraderNo" v-if="false">
            <h-input v-model="addOrEditForm.sendTraderNo"></h-input>
          </h-form-item>
        </div>
      </h-form>
    </h-panel>
    <h-form :model="queryFormItem" ref="queryFormItem" v-if="false"></h-form>
    <h-datagrid
        :columns="columns"
        :auto-load="false"
        highlight-row
        url="/be/market/intention/findIntentionBatchByBatchIdShow"
        :bindForm="queryFormItem"
        :onSelectChange="handleSelectChange"
        :rowSelect="true"
        ref="datagrid">
      <!--<div slot="toolbar" class="pull-left">
        <h-button type="primary" @on-click="showTrader()">查看交易员</h-button>
      </div>-->
    </h-datagrid>
    <select-intention-trader :traderView="traderView"
                             :needBatchId="needTraderBatchId"
                             :isView="true"
                             @traderWinClose="traderWinClose"></select-intention-trader>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="billId" :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </h-msg-box>
</template>

<script>
  import { post, on, off, formatNumber, formatBillRange, getDictValueFromMap, getDictListByGroups } from "@/api/bizApi/commonUtil";
  export default {
    name: "intentionShow",
    data() {
      return {
        addOrEditForm : {
            id: "",
            busiType: "",
            intentionReqId: "",
            sendBrchName: "",
            sendProductName: "",
            sendTraderName: "",
            trDir: "",
            sendRange: "",
            billType: "",
            billClass: "",
            totalAmt: "",
            buyBackTotalAmt: "",
            rate: "",
            dueRate: "",
            yieldRate: "",
            selectType: "",
            transCustTypeList: [],
            transCustType: "",
            creditCustTypeList: [],
            creditCustType: [],
            intentionRemark: "",
            sendBrchCode: "",
            sendProductNo: "",
            sendTraderNo: "",
            creditMainBrchCode:'',
            creditMainBankName:'',
            creditMainBankType:''
          },
        queryFormItem : {
            id: "",
            intentionReqId: ""
          },
        traderView : false,
        indeterminate1 : false,
        checkAll1 : false,
        indeterminate2 : false,
        checkAll2 : false,
        showBillInfoWin : false,
        columns : [
            {
              type: "selection",
              hiddenCol: true,
              width : 50,
              align: "center",
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              align: "center",
              width : 50,
              hiddenCol: false,
            },
            {
              title: this.$t('m.i.common.id'),
              key: "id",
              hiddenCol: true,
              align: "center"
            },
            {
              title: this.$t('m.i.be.preRelationFlag'),
              key: "preRelationFlag",
              align: "center",
              hiddenCol: false,

              render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, 'PreRelationFlag', params.row.preRelationFlag);
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
                let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t('m.i.billInfo.billPackageNo'),
              key: "cdNo",
              align: "center",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if(this.addOrEditForm.sendRcvFlag === "1"){
                  return h("span",params.row.cdNo);
                }
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row.billId,params.row.cdNo, params.row.billRangeStart, params.row.billRangeEnd);
                    }
                  }
                }, params.row.cdNo);
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
              key: "cdAmt",
              hiddenCol: false,
              sortable: true,
              align: "center",
              render: (h, params) => {
                return h('span', formatNumber(params.row.cdAmt, 2, ','))
              }
            },
            {
              title: this.$t('m.i.billInfo.remitDt'),
              key: "issDt",
              align: "center",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (null != params.row.issDt && "" !== params.row.issDt) {
                  let dttm = this.$moment(params.row.issDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", dttm);
                }
              }
            },
            {
              title: this.$t('m.i.billInfo.dueDt'),
              key: "dueDt",
              align: "center",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (null != params.row.dueDt && "" !== params.row.dueDt) {
                  let dttm = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", dttm);
                }
              }
            },
            {
              title: this.$t('m.i.billInfo.dueMatDt'),
              key: "matDt",
              align: "center",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (null != params.row.matDt && "" !== params.row.matDt) {
                  let dttm = this.$moment(params.row.matDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", dttm);
                }
              }
            },
            {
              title: this.$t('m.i.be.remainingPeriod'),
              key: "remainingPeriod",
              hiddenCol: false,
              sortable: true,
              align: "center"
            },
            {
              title: this.$t('m.i.billInfo.drwrName'),
              key: "dwrName",
              align: "center",
              hiddenCol: false,
            },
            {
              title: this.$t('m.i.billInfo.acptName'),
              key: "acptName",
              align: "center",
              hiddenCol: false,
            },
            {
              title: this.$t('m.i.billInfo.acptBankName'),
              key: "acptBankName",
              sortable: true,
              align: "center",
              hiddenCol: false,
            },
            {
              title: this.$t('m.i.billInfo.discBankName'),
              key: "discBankName",
              align: "center",
              hiddenCol: false,
              sortable: true
            },
            {
              title: this.$t('m.i.billInfo.guarntrTrustBankName'),
              key: "guarntrTrustBankName",
              sortable: true,
              align: "center",
              hiddenCol: false,
            },
            {
              title:  this.$t('m.i.billInfo.cfmAppBankName'),
              key: "cfmAppBankName",
              align: "center",
              hiddenCol: false,
            },
            {
              title: this.$t('m.i.billInfo.acptGuarntrBankName'),
              key: "acptGuarntrBankName",
              sortable: true,
              align: "center",
              hiddenCol: false,
            },
            {
              title: this.$t('m.i.be.discGuarntrBankName'),
              key: "discGuarntrBankName",
              sortable: true,
              align: "center",
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
                let dictValue = this.getDictValueFromMap(this.dictMap, 'CreditMajor', params.row.creditMainBankType);
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
              let dictValue =this.getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          ],
        needTraderBatchId : "",
        residualTermLable : "剩余期限",
        billId : "",
        billNo : "",
        billRangeStart: '',
        billRangeEnd: '',
        BillClassList : [],
        BillTypeList : [],
        TdDirectionList : [],
        CrDirectionList : [],
        SendRangeList : [],
        CdSelectModeList : [],
        assetIndustryList :[],
        CreditCustTypeList : [],
        CreditCustTypeKeyList : [],
        TenorCodeList : [],
        BusiTypeList : [],
        dictMap : [],
        checkAllTenorGroup : [],
        checkAllCreditGroup : [],
        currentSelectList : []
      }
    },
    components: {
      SelectIntentionTrader:()=>import(/* webpackChunkName: "be/market/intention/selectIntentionTrader" */`@/views/bizViews/be/market/intention/selectIntentionTrader`)
    },
    props: {
      intentionShow: {
        type: Boolean,
        default() {
          return false;
        }
      },
      intentionType: "",
      needBatchId: "",
      intentionReqId: {
        type: String,
        default() {
          return "";
        }
      }
    },
    computed: {
      tempIntentionShow: {
        get() {
          return this.intentionShow;
        },
        set() {
        }
      }
    },
    mounted() {
      getDictListByGroups("CDMedia,DraftTypeCode,AssetIndustry,TdDirection,CrDirection,CreditMajor,TenorCode,SendRange,BusiType,CdSelectMode,PreRelationFlag,TrDir,BillOrigin").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.BusiTypeList = res.get("BusiType");
        this.TdDirectionList = res.get("TdDirection");
        this.CrDirectionList = res.get("CrDirection");
        this.SendRangeList = res.get("SendRange");
        this.CreditCustTypeList = res.get("CreditMajor");
        this.TenorCodeList = res.get("TenorCode");
        this.CdSelectModeList = res.get("CdSelectMode");
        this.assetIndustryList = res.get("AssetIndustry");
        this.dictMap = res.get("map");
        this.CreditCustTypeKeyList = [];
        for (let item in this.CreditCustTypeList) {
          this.CreditCustTypeKeyList.push(this.CreditCustTypeList[item].key);
        }
      });
    },
    watch: {
      intentionShow(val) {
        if (val === true) {
          if (this.intentionType !== "BT01") {
            this.residualTermLable = "回购期限";
          }
          this.queryFormItem.id = this.needBatchId;
          this.addOrEditForm.busiType = this.intentionType;
          this.createForm();
        }
      }
    },
    methods: {
      turnForm(formItem, obj, _this) {
        formItem.id = obj.id;
        formItem.busiType = obj.busiType;
        formItem.intentionReqId = obj.intentionReqId;
        formItem.sendBrchName = obj.sendBrchName;
        formItem.sendProductName = obj.sendProductName;
        formItem.sendTraderName = obj.sendTraderName;
        formItem.minResidualTerm = obj.minResidualTerm;
        formItem.maxResidualTerm = obj.maxResidualTerm;
        formItem.trDir = obj.trDir;
        formItem.sendRange = obj.sendRange;
        formItem.billType = obj.billType;
        formItem.billClass = obj.billClass;
        formItem.totalAmt = obj.totalAmt * 1;
        formItem.buyBackTotalAmt = obj.buyBackTotalAmt * 1;
        formItem.rate = obj.rate * 1;
        formItem.dueRate = obj.dueRate * 1;
        formItem.yieldRate = obj.yieldRate * 1;
        formItem.selectType = obj.selectType;
        formItem.transCustTypeList = obj.transCustType.split(",");
        formItem.creditCustTypeList = obj.creditCustType.split(",");
        formItem.intentionRemark = obj.intentionRemark;
        formItem.sendBrchCode = obj.sendBrchCode;
        formItem.sendProductNo = obj.sendProductNo;
        formItem.sendTraderNo = obj.sendTraderNo;
        formItem.sendRcvFlag = obj.sendRcvFlag;
      },
      handleClose() {
        this.addOrEditForm.maxResidualTerm = "";
        this.addOrEditForm.minResidualTerm = "";
        this.$refs.addOrEditForm.resetFields();
        this.$emit("intentionShowClose", "");
      },
      handleSelectChange(selection) {
        this.currentSelectList = selection;
      },
      createForm() {
        post({ id: this.needBatchId }, "/be/market/intention/findIntentionBatchByIdShow").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.turnForm(this.addOrEditForm, retData, this);
              this.$nextTick(() => {
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              });
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showTrader() {
        this.needTraderBatchId = this.needBatchId;
        this.traderView = true;
      },
      traderWinClose() {
        this.traderView = false;
      },
      showBillInfo(billId,billNo,billRangeStart,billRangeEnd){
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose(){
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
    }
  };
</script>

<style scoped>

</style>
