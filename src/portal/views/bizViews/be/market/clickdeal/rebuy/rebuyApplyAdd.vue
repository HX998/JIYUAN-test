<template>
  <div>
    <h-msg-box v-model="tempRebuyApplyAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1100" class="h-form-search-layer" >
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增报价</span>
        <span v-else-if="batchParams.batchType==='modify'">修改报价</span>
        <span v-else-if="batchParams.batchType==='show'">查看报价</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search"
                onlyBlurRequire>
          <busi-type v-model="addOrEditForm.busiType" :dictList="batchParams.busiTypeList" :readonly="true"></busi-type>
          <common-input v-model="addOrEditForm.buyBrchName" :label="$t('m.i.be.brchName')" prop="buyBrchName"
                        :readonly="true"></common-input>
          <common-input v-model="addOrEditForm.buyTraderName" :label="$t('m.i.be.traderName')" prop="buyTraderName"
                        :readonly="true"></common-input>
          <apply-form-item :addForm="addOrEditForm" :batchParams="batchParams"></apply-form-item>
          <common-select v-model="addOrEditForm.clearSpeed" :label="$t('m.i.be.clearSpeed')" prop="clearSpeed"
                         :dictList="batchParams.clearSpeedList"
                         :required="true" @on-change="changeSpeed"></common-select>
          <common-select v-model="addOrEditForm.isNeedConfirm" :label="$t('m.i.be.isNeedConfirm')" prop="isNeedConfirm"
                         :dictList="batchParams.isList" :required="true"></common-select>
          <common-input v-model="addOrEditForm.minResidualTerm" :label="$t('m.i.be.minResidualTermDay')"
                        prop="minResidualTerm" :validRules="minResidualTermRule"
                        type="int" :required="true" @on-change="changeMinResidualTerm"></common-input>
          <common-input v-model="addOrEditForm.maxResidualTerm" :label="$t('m.i.be.maxResidualTermDay')"
                        prop="maxResidualTerm" :validRules="maxResidualTermRule"
                        type="int" :required="true" @on-change="changeMaxResidualTerm"></common-input>
          <common-date-picker v-model="addOrEditForm.settleDt" :label="$t('m.i.be.settleDt')" prop="settleDt"
                              :readonly="true" :required="true"></common-date-picker>
          <common-date-picker v-model="addOrEditForm.minDueDt" :label="$t('m.i.be.minDueDt')" prop="minDueDt"
                              :editable="false" :required="true" :options="optionMinDueDt"
                              @on-change="changeMinDueDt"></common-date-picker>
          <common-date-picker v-model="addOrEditForm.maxDueDt" :label="$t('m.i.be.maxDueDt')" prop="maxDueDt"
                              :editable="false" :required="true" :options="optionMaxDueDt"
                              @on-change="changeMaxDueDt"></common-date-picker>
          <total-amt v-model="addOrEditForm.totalAmt" :formItem="addOrEditForm" prop="totalAmt" :validRules="totalAmtRule"></total-amt>
          <min-bill-amt-by-million v-model="addOrEditForm.minBillAmt" :form-item="addOrEditForm" prop="minBillAtm" class="h-form-long-label" :validRules="minBillAmtRule"></min-bill-amt-by-million>
          <common-time-picker v-model="addOrEditForm.setTm" :label="$t('m.i.be.setTm')" prop="setTm"
                              :required="true"></common-time-picker>
          <common-time-picker v-model="addOrEditForm.quoteTm" :label="$t('m.i.be.quoteTm')" prop="quoteTm"
                              :required="true"></common-time-picker>
          <common-select v-model="addOrEditForm.creditMainBrchClass" :label="$t('m.i.billInfo.creditMainBankType')"
                         prop="creditMainBrchClass" :dictList="batchParams.creditMajorList" :clearable="false"
                         :required="true"></common-select>
          <common-select v-model="addOrEditForm.creditOccupyType" :label="$t('m.i.be.creditOccType')"
                         prop="creditOccupyType" :dictList="batchParams.creditDeductRuleList"
                         :required="addOrEditForm.tradeRange !== 'TS02'"></common-select>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()">保存</h-button>
        </div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="3" class="h-form-search" onlyBlurRequire>
          <select-trans-brch-code v-model="creditBrchNames"
                                  :transBrchCodeParams="{ batchId: this.batchId, operate: 'credit', branchClasss: this.addOrEditForm.creditMainBrchClass}"
                                  :saveBatch="saveBatchFunc" :datagridUrl="datagridUrlBrchCode"
                                  :notinDatagridUrl="notinDatagridUrlBrchCode" :deleteUrl="deleteUrlBrchCode"
                                  :addUrl="addUrlBrchCode"
                                  :label="$t('m.i.be.creditBrchName')"
                                  @transBrchCodeWinClose="transBrchCodeWinClose"
                                  :dictMap="this.batchParams.dictMap"></select-trans-brch-code>

          <select-trans-brch-type v-model="transBrchTypesName"
                                  :transBrchTypeParams="{ batchId: this.batchId, operate: 'tradeClass' }"
                                  :saveBatch="saveBatchFunc" :datagridUrl="datagridUrlBrchClass"
                                  :notinDatagridUrl="notinDatagridUrlBrchClass" :deleteUrl="deleteUrlBrchClass"
                                  :addUrl="addUrlBrchClass" @transBrchTypeWinClose="transBrchTypeWinClose"
                                  :label="$t('m.i.be.transCustType')"></select-trans-brch-type>

          <select-trans-brch-type v-model="acptBrchTypesName"
                                  :transBrchTypeParams="{ batchId: this.batchId, operate: 'acptClass' }"
                                  :saveBatch="saveBatchFunc" :datagridUrl="datagridUrlBrchClass"
                                  :notinDatagridUrl="notinDatagridUrlBrchClass" :deleteUrl="deleteUrlBrchClass"
                                  :addUrl="addUrlBrchClass" @transBrchTypeWinClose="transBrchTypeWinClose"
                                  :label="$t('m.i.billInfo.acptBankType')"></select-trans-brch-type>

          <select-trans-brch-code v-model="acptBrchNames"
                                  :transBrchCodeParams="{ batchId: this.batchId, operate: 'acpt', branchClasss: this.addOrEditForm.acptBrchClasses }"
                                  :saveBatch="saveBatchFunc" :datagridUrl="datagridUrlBrchCode"
                                  :notinDatagridUrl="notinDatagridUrlBrchCode" :deleteUrl="deleteUrlBrchCode"
                                  :addUrl="addUrlBrchCode"
                                  :label="$t('m.i.billInfo.acptBankName')"
                                  @transBrchCodeWinClose="transBrchCodeWinClose"
                                  :dictMap="this.batchParams.dictMap"></select-trans-brch-code>

          <select-trans-brch-type v-model="discBrchTypesName"
                                  :transBrchTypeParams="{ batchId: this.batchId, operate: 'discClass' }"
                                  :saveBatch="saveBatchFunc" :datagridUrl="datagridUrlBrchClass"
                                  :notinDatagridUrl="notinDatagridUrlBrchClass" :deleteUrl="deleteUrlBrchClass"
                                  :addUrl="addUrlBrchClass" @transBrchTypeWinClose="transBrchTypeWinClose"
                                  :label="$t('m.i.billInfo.discBankType')"></select-trans-brch-type>

          <select-trans-brch-code v-model="discBrchNames"
                                  :transBrchCodeParams="{ batchId: this.batchId, operate: 'disc', branchClasss: this.addOrEditForm.discBrchClasses }"
                                  :saveBatch="saveBatchFunc" :datagridUrl="datagridUrlBrchCode"
                                  :notinDatagridUrl="notinDatagridUrlBrchCode" :deleteUrl="deleteUrlBrchCode"
                                  :addUrl="addUrlBrchCode"
                                  :label="$t('m.i.billInfo.discBankName')"
                                  @transBrchCodeWinClose="transBrchCodeWinClose"
                                  :dictMap="this.batchParams.dictMap"></select-trans-brch-code>

          <select-trans-brch-type v-model="trustBrchTypesName"
                                  :transBrchTypeParams="{ batchId: this.batchId, operate: 'trustClass' }"
                                  :saveBatch="saveBatchFunc" :datagridUrl="datagridUrlBrchClass"
                                  :notinDatagridUrl="notinDatagridUrlBrchClass" :deleteUrl="deleteUrlBrchClass"
                                  :addUrl="addUrlBrchClass" @transBrchTypeWinClose="transBrchTypeWinClose"
                                  :label="$t('m.i.billInfo.trustBankType')"></select-trans-brch-type>

          <select-trans-brch-code v-model="trustBrchNames"
                                  :transBrchCodeParams="{ batchId: this.batchId, operate: 'trust', branchClasss: this.addOrEditForm.trustBrchClasses }"
                                  :saveBatch="saveBatchFunc" :datagridUrl="datagridUrlBrchCode"
                                  :notinDatagridUrl="notinDatagridUrlBrchCode" :deleteUrl="deleteUrlBrchCode"
                                  :addUrl="addUrlBrchCode"
                                  :label="$t('m.i.billInfo.trustBankName')"
                                  @transBrchCodeWinClose="transBrchCodeWinClose"
                                  :dictMap="this.batchParams.dictMap"></select-trans-brch-code>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="applySubmit()" v-if="batchParams.batchType!=='show'">
            {{$t("m.i.be.applyBatch")}}
          </h-button>
        </div>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyApplyAdd",
    components: {
      SelectTransBrchType: () => import(/* webpackChunkName: "be/market/common/selectTransBrchType"*/"@/views/bizViews/be/market/common/selectTransBrchType"),
      SelectTransBrchCode: () => import(/* webpackChunkName: "be/market/common/selectTransBrchCode"*/"@/views/bizViews/be/market/common/selectTransBrchCode"),
      ApplyFormItem: () => import(/* webpackChunkName: "be/market/common/applyFormItem"*/"@/views/bizViews/be/market/common/applyFormItem")
    },
    data() {
      let _this = this;
      return {
        batchId: "",

        transBrchTypesName: "",
        acptBrchTypesName: "",
        discBrchTypesName: "",
        trustBrchTypesName: "",

        creditBrchNames: "",
        acptBrchNames: "",
        discBrchNames: "",
        trustBrchNames: "",

        datagridUrlBrchClass: "/be/market/clickdeal/rebuy/rebuyApply/func_queryBranchClass",
        notinDatagridUrlBrchClass: "/be/market/clickdeal/rebuy/rebuyApply/func_queryBranchClassAdd",
        deleteUrlBrchClass: "/be/market/clickdeal/rebuy/rebuyApply/func_deleteRebuyBranchClass",
        addUrlBrchClass: "/be/market/clickdeal/rebuy/rebuyApply/func_addRebuyBranchClass",

        datagridUrlBrchCode: "/be/market/clickdeal/rebuy/rebuyApply/func_queryBranchCodeList",
        notinDatagridUrlBrchCode: "/be/market/clickdeal/rebuy/rebuyApply/func_queryBranchCodeAddList",
        deleteUrlBrchCode: "/be/market/clickdeal/rebuy/rebuyApply/func_deleteRebuyBranchCode",
        addUrlBrchCode: "/be/market/clickdeal/rebuy/rebuyApply/func_addBranchCode",

        addForm: {},
        addOrEditForm: {
          workDate: "",
          id: "",
          busiType: "",
          rebuyBrchName: "",
          rebuyTraderName: "",
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
          isNeedConfirm: "",
          minResidualTerm: "",
          maxResidualTerm: "",
          minDueDt: "",
          maxDueDt: "",
          minBillAmt: "",
          transCustType: "",
          acptBrchClasses: "",
          discBrchClasses: "",
          trustBrchClasses: "",
          creditOccupyType:""
        },
        dataGridFormItem: {
          batchId: ""
        },
        //记录批次是否已保存
        hadBatchSave: false,
        isCurChange: false,

        optionMinDueDt: {
          disabledDate(date) {
            if (!_this.addOrEditForm.settleDt) {
              return false;
            }
            //开始日期
            let startDt = _this.$moment(_this.addOrEditForm.settleDt, "YYYYMMDD").format("YYYY/MM/DD");
            startDt = new Date(startDt);
            let minResidualTerm = 1;
            let maxResidualTerm = 1;
            if (null != _this.addOrEditForm.minResidualTerm && _this.addOrEditForm.minResidualTerm) {
              minResidualTerm = _this.addOrEditForm.minResidualTerm;
            }
            if (null != _this.addOrEditForm.maxResidualTerm && _this.addOrEditForm.maxResidualTerm) {
              maxResidualTerm = _this.addOrEditForm.maxResidualTerm;
            }
            let startDtPlus = _this.addDay(startDt, minResidualTerm);

            if (null != _this.addOrEditForm.maxResidualTerm) {
              let endDtPlus = _this.addDay(startDt, maxResidualTerm);
              return !(date.valueOf() && startDtPlus.valueOf() <= date.valueOf() && endDtPlus.valueOf() >= date.valueOf());
            } else {
              return !(date.valueOf() && startDtPlus.valueOf() <= date.valueOf());
            }
          }
        },
        optionMaxDueDt: {
          disabledDate(date) {
            if (!_this.addOrEditForm.settleDt) {
              return false;
            }
            //开始日期
            let startDt = null;
            if (_this.addOrEditForm.minDueDt && null != _this.addOrEditForm.minDueDt) {
              startDt = _this.$moment(_this.addOrEditForm.minDueDt, "YYYYMMDD").format("YYYY/MM/DD");
              startDt = new Date(startDt);
            }

            let settleDt = _this.$moment(_this.addOrEditForm.settleDt, "YYYYMMDD").format("YYYY/MM/DD");
            settleDt = new Date(settleDt);
            //结束日期
            let maxResidualTerm = 1;
            if (null != _this.addOrEditForm.maxResidualTerm && _this.addOrEditForm.maxResidualTerm) {
              maxResidualTerm = _this.addOrEditForm.maxResidualTerm;
            }

            if (!startDt || null == startDt) {
              startDt = _this.addDay(settleDt, 1);
            }

            if (null != _this.addOrEditForm.maxResidualTerm) {
              let endDtPlus = _this.addDay(settleDt, maxResidualTerm);
              return !(date.valueOf() && startDt.valueOf() <= date.valueOf() && endDtPlus.valueOf() > date.valueOf());
            } else {
              return !(date.valueOf() && startDt.valueOf() <= date.valueOf());
            }
          }
        },
        minResidualTermRule: [{ test: this.validMinResidualTermRule, trigger: "blur" }],
        maxResidualTermRule: [{ test: this.validMaxResidualTermRule, trigger: "blur" }],
        minDueDtRule: [{ test: this.validMinDueDt, trigger: "blur" }],
        maxDueDtRule: [{ test: this.validMaxDueDt, trigger: "blur" }],
        minBillAmtRule: [{ test: this.validMinBillAmt, trigger: "blur" }],
        totalAmtRule:[{ test:this.validTotalAmt, trigger: "blur" }]
      };
    },
    props: {
      rebuyApplyAddOrEditWin: {
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
      tempRebuyApplyAddOrEditWin: {
        get() {
          return this.rebuyApplyAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      rebuyApplyAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.batchId = this.batchId;
            this.hadBatchSave = true;
            this.isCurChange = false;
            this.queryObjById();
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { batchId: this.batchId };
        let url = "/be/market/clickdeal/rebuy/rebuyApply/func_editClickDealRebuy";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.workDate = obj.workDate;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.busiType = obj.busiType;
              this.addOrEditForm.buyBrchName = obj.buyBrchName;
              this.addOrEditForm.buyTraderName = obj.buyTraderName;
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
              this.addOrEditForm.isNeedConfirm = obj.isNeedConfirm;
              this.addOrEditForm.minResidualTerm = obj.minResidualTerm;
              this.addOrEditForm.maxResidualTerm = obj.maxResidualTerm;
              this.addOrEditForm.minDueDt = obj.minDueDt === null ? "" : obj.minDueDt.toString();
              this.addOrEditForm.maxDueDt = obj.maxDueDt === null ? "" : obj.maxDueDt.toString();
              this.addOrEditForm.minBillAmt = obj.minBillAmt;
              this.addOrEditForm.totalAmt = obj.totalAmt;
              this.addOrEditForm.transCustType = obj.transCustType;
              this.addOrEditForm.acptBrchClasses = obj.acptBrchClasses;
              this.addOrEditForm.discBrchClasses = obj.discBrchClasses;
              this.addOrEditForm.trustBrchClasses = obj.trustBrchClasses;
              this.addOrEditForm.creditOccupyType = obj.creditOccupyType;
              if (null != obj.transCustType) {
                let transCustNameList = [];
                obj.transCustType.split(",").forEach(x => transCustNameList.push(this.batchParams.brchClassMap.get(x)));
                this.transBrchTypesName = transCustNameList.join(",");
              }
              if (null != obj.acptBrchClasses) {
                let transCustNameList = [];
                obj.acptBrchClasses.split(",").forEach(x => transCustNameList.push(this.batchParams.brchClassMap.get(x)));
                this.acptBrchTypesName = transCustNameList.join(",");
              }
              if (null != obj.discBrchClasses) {
                let transCustNameList = [];
                obj.discBrchClasses.split(",").forEach(x => transCustNameList.push(this.batchParams.brchClassMap.get(x)));
                this.discBrchTypesName = transCustNameList.join(",");
              }
              if (null != obj.trustBrchClasses) {
                let transCustNameList = [];
                obj.trustBrchClasses.split(",").forEach(x => transCustNameList.push(this.batchParams.brchClassMap.get(x)));
                this.trustBrchTypesName = transCustNameList.join(",");
              }

              this.creditBrchNames = obj.creditMainBrchNames;
              this.acptBrchNames = obj.acptBrchNames;
              this.discBrchNames = obj.discBrchNames;
              this.trustBrchNames = obj.trustBrchNames;
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
        this.creditBrchNames = "";
        this.acptBrchNames = "";
        this.discBrchNames = "";
        this.trustBrchNames = "";

        this.transBrchTypesName = "";
        this.acptBrchTypesName = "";
        this.discBrchTypesName = "";
        this.trustBrchTypesName = "";

        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.hadBatchSave = false;
        this.$emit("rebuyApplyAddOrEditWinClose", "");
      },
      //保存批次信息
      formSave() {
        this.saveBatch();
      },
      saveBatch(optType) {
        this.saveBatchFunc(res => {
          if (optType) {
            this.triggerClickEvent(optType);
          } else {
            this.$msgTip.success(this);
          }
        });
      },
      saveBatchFunc(callback) {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.settleDt = this.addOrEditForm.settleDt.replace(/-/g, "");
            this.addOrEditForm.minDueDt = this.addOrEditForm.minDueDt.replace(/-/g, "");
            this.addOrEditForm.maxDueDt = this.addOrEditForm.maxDueDt.replace(/-/g, "");
            let url = "/be/market/clickdeal/rebuy/rebuyApply/func_addClickDealRebuyBatch";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.batchId = res.data.retData.id;
                  this.dataGridFormItem.batchId = res.data.retData.id;
                  this.addOrEditForm.id = res.data.retData.id;
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
        if (optType === "applySubmit") {//提交申请
          this.applySubmitCallback();
        }
      },
      //提交申请
      applySubmit() {
        this.saveBatch("applySubmit");
      },
      applySubmitCallback() {
        if (this.hadBatchSave) {
          let params = { batchId: this.batchId };
          let url = "/be/market/clickdeal/rebuy/rebuyApply/func_commitApply";
          this.sendPost(params, url, res => {
            this.handleClose();
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
              callback();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      transBrchCodeWinClose(){
        this.queryObjById();
      },
      transBrchTypeWinClose(){
        this.queryObjById();
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
              this.changeSettleDt();
            }
          });
        } else {
          this.addOrEditForm.settleDt = this.$moment(workDt, "YYYYMMDD").format("YYYY-MM-DD");
          this.changeSettleDt();
        }

      },
      addDay(workDt, residualTerm) {
        let workDtPlus = workDt.valueOf() + (residualTerm * 24 * 60 * 60 * 1000);
        workDtPlus = new Date(workDtPlus);
        return workDtPlus;
      },
      changeSettleDt() {
        let settleDt = this.$moment(this.addOrEditForm.settleDt, "YYYYMMDD").format("YYYY/MM/DD");
        settleDt = new Date(settleDt);
        //顺延起始日和票据到期日
        if (null != this.addOrEditForm.minResidualTerm && this.addOrEditForm.minResidualTerm) {
          let minDueDt = this.addDay(settleDt, this.addOrEditForm.minResidualTerm);
          this.addOrEditForm.minDueDt = this.$moment(minDueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        if (null != this.addOrEditForm.maxResidualTerm && this.addOrEditForm.maxResidualTerm) {
          let maxDueDt = this.addDay(settleDt, this.addOrEditForm.maxResidualTerm);
          this.addOrEditForm.maxDueDt = this.$moment(maxDueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
      },
      //最小剩余期限
      validMinResidualTermRule(rule, val, callback) {
        if (val < 1 || val > 366) {
          callback(new Error("最小剩余期限可输范围【1~366】"));
        }
        callback();
      },
      //最大剩余期限
      validMaxResidualTermRule(rule, val, callback) {
        if (val < 1 || val > 366) {
          callback(new Error("最长剩余期限可输范围【1~366】"));
        }
        if (val < parseInt(this.addOrEditForm.minResidualTerm)) {
          callback(new Error("最长剩余期限不小于最小剩余期限"));
        }
        callback();
      },
      validMinDueDt(rule, val, callback) {
        if (val.replace(/-/g, "") < this.addOrEditForm.settleDt.replace(/-/g, "")) {
          callback(new Error("票据到期起始日需大于结算日"));
        }
        callback();
      },
      validMaxDueDt(rule, val, callback) {
        if (val.replace(/-/g, "") < this.addOrEditForm.settleDt.replace(/-/g, "")) {
          callback(new Error("票据到期截止日需大于结算日"));
        }
        if (val.replace(/-/g, "") < this.addOrEditForm.minDueDt.replace(/-/g, "")) {
          callback(new Error("票据到期截止日需大于票据到期起始日"));
        }
        callback();
      },
      validMinBillAmt(rule, val, callback) {
        if (val < 0) {
          callback(new Error("最小单张票面(包)金额(万元)不能为负值"));
        }
        if (this.addOrEditForm.totalAmt < val * 10000) {
          callback(new Error("最小单张票面(包)金额(万元)不能大于票据总额(元)"));
        }
        callback();
      },
      validTotalAmt(rule,val,callback) {
         if (val < 0) {
            callback(new Error("票据总额(元)不能为负值"));
         }
         callback();
      },
      changeMinResidualTerm(event) {
        if (null != this.addOrEditForm.settleDt && null != this.addOrEditForm.minResidualTerm && this.addOrEditForm.minResidualTerm) {
          let startDt = this.$moment(this.addOrEditForm.settleDt, "YYYYMMDD").format("YYYY/MM/DD");
          startDt = new Date(startDt);
          let startDtPlus = this.addDay(startDt, this.addOrEditForm.minResidualTerm);
          this.addOrEditForm.minDueDt = this.$moment(startDtPlus, "YYYY-MM-DD").format("YYYY-MM-DD");
        }
      },
      changeMaxResidualTerm(event) {
        if (null != this.addOrEditForm.settleDt && null != this.addOrEditForm.maxResidualTerm && this.addOrEditForm.maxResidualTerm) {
          let startDt = this.$moment(this.addOrEditForm.settleDt, "YYYYMMDD").format("YYYY/MM/DD");
          startDt = new Date(startDt);
          let endDtPlus = this.addDay(startDt, this.addOrEditForm.maxResidualTerm);
          this.addOrEditForm.maxDueDt = this.$moment(endDtPlus, "YYYY-MM-DD").format("YYYY-MM-DD");
        }
      },
      changeMinDueDt(data) {
        if (null != data && data) {
          let minDueDt = this.$moment(data, "YYYYMMDD").format("YYYY/MM/DD");
          minDueDt = new Date(minDueDt);

          let settleDt = this.$moment(this.addOrEditForm.settleDt, "YYYYMMDD").format("YYYY/MM/DD");
          settleDt = new Date(settleDt);

          let minResidualTerm = (minDueDt.valueOf() - settleDt.valueOf()) / (24 * 60 * 60 * 1000);
          if (minResidualTerm <= 0) {
            this.$msgTip.error(this, { info: "剩余期限必须为大于0的正整数" });
            return;
          }
          this.addOrEditForm.minResidualTerm = minResidualTerm;
        }
      },
      changeMaxDueDt(data) {
        if (null != data && data) {
          let maxDueDt = this.$moment(data, "YYYYMMDD").format("YYYY/MM/DD");
          maxDueDt = new Date(maxDueDt);

          let settleDt = this.$moment(this.addOrEditForm.settleDt, "YYYYMMDD").format("YYYY/MM/DD");
          settleDt = new Date(settleDt);

          let maxResidualTerm = (maxDueDt.valueOf() - settleDt.valueOf()) / (24 * 60 * 60 * 1000);
          if (maxResidualTerm <= 0) {
            this.$msgTip.error(this, { info: "剩余期限必须为大于0的正整数" });
            return;
          }
          this.addOrEditForm.maxResidualTerm = maxResidualTerm;
        }

      }
    }
  };
</script>

<style scoped>

</style>
