<!--代客业务-查询客户付款记录-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.busiType')" prop="prodNo">
                  <h-select v-model="formItem.prodNo" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="drweName" :label="$t('m.i.billInfo.corpDrwrName')">
                  <h-input v-model="formItem.drweName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearCustNo()"></h-input>
                </h-form-item>
                <h-form-item prop="drweAcctNo" :label="$t('m.i.billInfo.corpDrwrAcctNo')">
                  <h-input v-model="formItem.drweAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()" clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike" :validRules="billNoRule">
                  <h-input v-model="formItem.billNoLike" :maxlength="30"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['billRangeStart','billRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false placement="bottom-end"
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.deductAmt')" :prop="isMinTransAmt">
                  <h-row>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.minTransAmt" :maxlength="20"
                                   @on-blur="formatTransAmt('blur','min')" placeholder=""
                                   @on-focus="formatTransAmt('focus','min')"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center"><span>至</span></h-col>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.maxTransAmt" :maxlength="20"
                                   @on-blur="formatTransAmt('blur','max')" placeholder=""
                                   @on-focus="formatTransAmt('focus','max')" bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.deductDt')" prop="minDeductDt">
                  <h-date-picker :value="deductDt" type="daterange" showFormat :editable=false placement="bottom-end"
                                 @on-change="handleDeductDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.deductFlag')" prop="deductFlag">
                  <h-select v-model="formItem.deductFlag" placeholder="">
                    <h-option v-for="item in deductFlagist" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                     :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bm/valetBusiness/valetAcct/queryCustBillDeduct"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="selectAccount()" :disabled="this.isCancelAccount">{{$t('m.i.ce.cancelAccount')}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustElecSignWin" @custElecSignWinClose="custElecSignWinClose"
                         @custElecSignSubmit="custElecSignSubmit"></show-cust-elec-sign>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustAcctNoWin" :custInfoParams="custInfoParams"
                         :isShowCustAcctNo="true"
                         @custElecSignWinClose="showCustAcctNoWinClose"
                         @custElecSignSubmit="custAcctNoSelectSubmit"></show-cust-elec-sign>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber ,exportList, formatBillRange, getDictValueFromMap, getDictListByGroups} from "@/api/bizApi/commonUtil";
    export default {
      name: "queryCustAcctDeduct",
      data() {
        return {
          //区分最大和最小票据金额
          transAmtType: "min",
          dueDt: [],
          deductDt: [],
          showBillInfoWin: false,
          showBillInfoWin: false,
          showCustAcctNoWin: false,
          showCustElecSignWin: false,
          isCancelAccount: false,
          billNoRule: [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
          custInfoParams: {},
          //是否显示更多查询项
          ifShowMore: false,
          billRangeStart: "",
          billRangeEnd: "",
          billId: "",
          billNo: "",
          deductFlagist: [{ key: "0", value: "扣款成功" },{ key: "1", value: "扣款已冲正" },{ key: "2", value: "扣款冲正失败" }],
          formItem: {
            drweCustNo: "",
            drweName: "",
            drweAcctNo: "",
            billNoLike: "",
            minDueDt: "",
            maxDueDt: "",
            minDeductDt: "",
            maxDeductDt: "",
            billType: "",
            minTransAmt: "",
            maxTransAmt: "",
            minTransSignDt: "",
            maxTransSignDt: "",
            billOrigin: "",
            billRangeStart: "",
            billRangeEnd: "",
            prodNo: "",
            deductFlag: "2"
          },
          billTypeList : [],
          billOriginList: [],
          busiTypeList: [],
          dictMap: new Map(),
          columns: [
            {
              type: "radio",
              title: " ",
              width: 50,
              align: "center",
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
              title: this.$t('m.i.common.busiType'),
              key: "prodNo",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = getDictValueFromMap(this.dictMap, 'CustAcctDeductBusiType', params.row.prodNo);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t('m.i.billInfo.billOrigin'),
              key: "billOrigin",
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
              key: "billNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let billNo = "";
                if (params.row.billNo === null || params.row.billNo === "") {
                  billNo = this.$t('m.i.ce.showBillInfo');
                } else {
                  billNo = params.row.billNo;
                }
                return h("a", {
                  on: {
                    click: () => {
                      if (params.row.billRangeStart != null && params.row.billRangeEnd != null) {
                        this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart.toString(), params.row.billRangeEnd.toString());
                      } else {
                        this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                      }
                    }
                  }
                }, billNo);
              }
            },
            {
              title: this.$t('m.i.billInfo.billRange'),
              key: "billRange",
              align: 'center',
              render: (h, params) => {
                return h("span", formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd));
              }
            },
            {
              title: this.$t("m.i.pe.deductDt"),
              key: "deductDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (params.row.deductDt == null || params.row.deductDt === "") {
                  return "";
                }
                let date = this.$moment(params.row.deductDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t('m.i.pe.deductAmt'),
              key: "transAmt",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let transAmt = formatNumber(params.row.transAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: transAmt
                  }
                }, transAmt);
              }
            },
            {
              title: this.$t('m.i.ce.deductFlag'),
              key: "deductStatus",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let deductStatus = "";
                if(params.row.deductFlag == "3"){
                  deductStatus = "扣款失败";
                }
                if(params.row.deductFlag == "2" && params.row.isRefund == "0"){
                  deductStatus = "扣款成功";
                }
                if(params.row.deductFlag == "0" && params.row.isRefund == "1"){
                  deductStatus = "扣款已冲正";
                }
                if(params.row.deductFlag == "2" && params.row.isRefund == "2"){
                  deductStatus = "扣款冲正失败";
                }
                return h("span", deductStatus);
              }
            },
            {
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t("m.i.billInfo.remitDt"),
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
              title: this.$t("m.i.billInfo.dueDt"),
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
              title: this.$t("m.i.billInfo.corpDrwrName"),
              key: "drweName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.corpDrwrAcctNo"),
              key: "drweAcctNo",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drweBankName"),
              key: "drweBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.corpDrweBankNo"),
              key: "drweBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeName"),
              key: "prsttnName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeAcctNo"),
              key: "prsttnAcctNo",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeBankName"),
              key: "prsttnBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeBankNo"),
              key: "prsttnBankNo",
              hiddenCol: false
            },
            {
              title: this.$t('m.i.be.settleMode'),
              key: "onlineMark",
              sortable: true,
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.onlineMark);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            }
          ],
        }
      },
      computed: {
        isMinTransAmt() {
          return this.transAmtType === "min" ? "minTransAmt" : "maxTransAmt";
        }
      },
      mounted() {
        this.getDictListByGroups("DraftTypeCode,SettleType,BillOrigin,CustAcctDeductBusiType").then(res => {
          this.billTypeList = res.get("DraftTypeCode");
          this.transNoList = res.get("ValetHldrTransNo");
          this.billOriginList = res.get("BillOrigin");
          this.busiTypeList = res.get("CustAcctDeductBusiType");
          this.dictMap = res.get("map");
        });
      },
      methods: {
        handleCurrentChange(currentRow) {
          this.currentSelectRow = currentRow;
          if (this.currentSelectRow.deductFlag == "2" && this.currentSelectRow.isRefund == "2"){
            this.isCancelAccount = false;
          }else{
            this.isCancelAccount = true;
          }
        },
        handleCurrentChangeCancel() {
          this.currentSelectRow = [];
          this.isCancelAccount = false;
        },
        clearCustNo() {
          this.formItem.drweCustNo = "";
          this.formItem.drweName = "";
          this.formItem.drweAcctNo = "";
        },
        //查询客户信息
        queryCustNo() {
          this.showCustElecSignWin = true;
        },
        //查询客户账号信息
        queryCustAcctNo() {
          if (this.formItem.drweCustNo === "") {
            this.$msgTip.info(this, { info: "请先选择付款人" });
            return;
          }
          this.custInfoParams = { custNo: this.formItem.drweCustNo, custName: this.formItem.drweName };
          this.showCustAcctNoWin = true;
        },
        //赋值
        custElecSignSubmit(info) {
          this.formItem.drweCustNo = info.custNo;
          this.formItem.drweName = info.custName;
          this.formItem.drweAcctNo = info.custAcctNo;
          this.showCustElecSignWin = false;
        },
        //赋值
        custAcctNoSelectSubmit(info) {
          this.formItem.drweAcctNo = info.custAcctNo;
          this.showCustAcctNoWin = false;
        },
        //关闭弹窗
        showCustAcctNoWinClose() {
          this.showCustAcctNoWin = false;
        },
        //关闭
        custElecSignWinClose() {
          this.showCustElecSignWin = false;
        },
        handleDueDtChange(arr) {
          if(arr && arr.length == 2){
            this.formItem.minDueDt = arr[0].replace(/-/g, "");
            this.formItem.maxDueDt = arr[1].replace(/-/g, "");
            this.dueDt = [arr[0], arr[1]];
          }else{
            this.formItem.minDueDt = "";
            this.formItem.maxDueDt = "";
            this.dueDt = [];
          }
        },
        handleDeductDtChange(arr) {
          if(arr && arr.length == 2){
            this.formItem.minDeductDt = arr[0].replace(/-/g, "");
            this.formItem.maxDeductDt = arr[1].replace(/-/g, "");
            this.deductDt = [arr[0], arr[1]];
          }else{
            this.formItem.minDeductDt = "";
            this.formItem.maxDeductDt = "";
            this.deductDt = [];
          }
        },
        formatTransAmt(optType, itemType) {
          this.transAmtType = itemType;
          if (optType === "blur") {
            if (itemType === "min") {
              if (!isNaN(parseFloat(this.formItem.minTransAmt)) && isFinite(this.formItem.minTransAmt)) {
                this.formItem.minTransAmt = this.formItem.minTransAmt == null ? "0.00" : formatNumber(this.formItem.minTransAmt, 2, ",");
              }
            } else {
              if (!isNaN(parseFloat(this.formItem.maxTransAmt)) && isFinite(this.formItem.maxTransAmt)) {
                this.formItem.maxTransAmt = this.formItem.maxTransAmt == null ? "0.00" : formatNumber(this.formItem.maxTransAmt, 2, ",");
              }
            }
          } else if (optType === "focus") {
            if (itemType === "min") {
              this.formItem.minTransAmt = this.formItem.minTransAmt.toString().replace(/,/g, "");
            } else {
              this.formItem.maxTransAmt = this.formItem.maxTransAmt.toString().replace(/,/g, "");
            }
          }
        },
        //表单查询
        handleSearch() {
          let minTransAmt = this.formItem.minTransAmt.toString().replace(/,/g, "");
          let maxTransAmt = this.formItem.maxTransAmt.toString().replace(/,/g, "");
          if (parseFloat(minTransAmt) > parseFloat(maxTransAmt)) {
            this.$msgTip.info(this, { info: "扣款金额区间输入有误" });
            return;
          }
          this.$refs["formItem"].validate(valid => {
            if (valid) {
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.formItem.minTransAmt = this.formItem.minTransAmt.toString().replace(/,/g, "");
              this.formItem.maxTransAmt = this.formItem.maxTransAmt.toString().replace(/,/g, "");
              this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
              this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
              this.formItem.minDeductDt = this.formItem.minDeductDt.replace(/-/g, "");
              this.formItem.maxDeductDt = this.formItem.maxDeductDt.replace(/-/g, "");
              this.isCancelAccount = false;
              this.$refs.datagrid.dataChange(1);
            }
          });
        },
        //重置表单查询结果
        resetSearch() {
          this.dueDt = [];
          this.deductDt = [];
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.formItem.minDeductDt = "";
          this.formItem.maxDeductDt = "";
          this.formItem.minTransAmt = "";
          this.formItem.maxTransAmt = "";
          this.formItem.drweAcctNo = "";
          this.formItem.drweCustNo = "";
          this.formItem.drweName = "";
          this.formItem.deductFlag = "2";
          this.$refs.formItem.resetFields();
        },
        billInfoWinClose() {
          this.billId = "";
          this.billNo = "";
          this.billRangeStart = "";
          this.billRangeEnd = "";
          this.showBillInfoWin = false;
        },
        showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
          this.billId = billId;
          this.billNo = billNo;
          this.billRangeStart = billRangeStart;
          this.billRangeEnd = billRangeEnd;
          this.showBillInfoWin = true;
        },
        //选择记账
        selectAccount() {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: "确定撤销记账吗?",
              onOk: () => {
                post({ id: this.currentSelectRow.id,prodNo: this.currentSelectRow.prodNo}, "/bm/valetBusiness/valetAcct/func_submitCancelAcctBill").then(res => {
                  if(res) {
                    let msg = res.data.retMsg;
                    let retCode = res.data.retCode;
                    if (retCode === "000000") {
                      this.$msgTip.success(this);
                      this.$refs.datagrid.dataChange(1);
                      this.$refs.datagrid.selects = [];
                    } else {
                      this.$msgTip.error(this, { info: msg });
                    }
                  }
                }).catch(error => {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
                });
              }
            });
          } else {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          }
        },
      }
    }
</script>

<style scoped>

</style>
