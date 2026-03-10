<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.acptBrchNoList" :label="$t('m.i.common.brchName')" prop="acptBrchNoList"
                             title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.acptBrchNoList" :brchName.sync="formItem.acptBrchNameList">
                </show-branch>
                <h-form-item :label="$t('m.i.pe.acptType')" prop="acptTypeList">
                  <h-select v-model="formItem.acptTypeList" placeholder="" multiple showTitle>
                    <h-option v-for="item in AcptTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.deductDt')" prop="minDeductDt">
                  <h-date-picker :value="deductDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDeductDtChange" placeholder=""></h-date-picker>
                </h-form-item>
               <!-- <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" placeholder=""></h-input>
                </h-form-item>-->
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
                <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly clearable @on-clear="clearVal('drwrName')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.acptDt')" prop="minAcptDt">
                  <h-date-picker :value="acptDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleAcptDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoneyItem" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money" bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money" bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.value">{{ item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.otherBankAcptMark')" prop="otherBankAcptMark">
                  <h-select v-model="formItem.otherBankAcptMark" placeholder="">
                    <h-option v-for="item in yonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.deductStatus')" prop="deductStatusList">
                  <h-select v-model="formItem.deductStatusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in DeductStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.deductResult')" prop="deductResult">
                  <h-select v-model="formItem.deductResult" placeholder="">
                    <h-option value="0">扣款中</h-option>
                    <h-option value="1">扣款成功</h-option>
                    <h-option value="2">扣款失败</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.ce.billMoneyPackageTotalAmt')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pe.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :url="queryUrl"
            :bindForm="formItem"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            hasPage
            showListCkeckBox
            :hasSelect="false"
            :rowSelect="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.pe.flowExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 登记日期历史查询弹窗 -->
        <h-msg-box v-model="dueDeductAcctWin" width="800" class="h-form-table-layer" :maximize="true"
                   :mask-closable="false" @on-close="dueDeductAcctWinClose()" @on-maximize="onMaximize">
          <!--弹出框模式标题-->
          <p slot="header">
            <span>账号扣款明细查询</span>
          </p>
          <!-- 数据展示表格 -->
          <div>
            <h-datagrid :columns="dueDeductAcctColumns"
                        highlight-row
                        :autoLoad="false"
                        url="/pe/busiqry/dueDeductOccurQuery/func_pagingQueryDeductAcctInfo"
                        :bindForm="dueDeductAcctForm"
                        :height="350"
                        ref="dueDeductAcctDatagrid" class="pl-5 pr-5">
              <div slot="toolbar" class="pull-left">
              </div>
            </h-datagrid>
          </div>
          <!-- 弹出框模式底部按钮 -->
          <div slot="footer">
            <h-button type="ghost" @click="dueDeductAcctWinClose()">{{$t("m.i.common.close")}}</h-button>
          </div>
        </h-msg-box>

        <!-- 登记日期历史查询弹窗 -->
        <h-msg-box v-model="deductAcctFlowWin" width="800" class="h-form-table-layer" :maximize="true"
                   :mask-closable="false" @on-close="deductAcctFlowWinClose()" @on-maximize="onMaximize">
          <!--弹出框模式标题-->
          <p slot="header">
            <span>扣款历史查询</span>
          </p>
          <!-- 数据展示表格 -->
          <div>
            <h-datagrid :columns="deductAcctFlowColumns"
                        highlight-row
                        :autoLoad="false"
                        url="/ce/acpt/dueDeduct/dueDeductResultTrackSearch/func_pageQueryDeductHis"
                        :bindForm="deductAcctFlowForm"
                        :height="350"
                        ref="deductAcctFlowDatagrid" class="pl-5 pr-5">
              <div slot="toolbar" class="pull-left">
              </div>
            </h-datagrid>
          </div>
          <!-- 弹出框模式底部按钮 -->
          <div slot="footer">
            <h-button type="ghost" @click="deductAcctFlowWinClose()">{{$t("m.i.common.close")}}</h-button>
          </div>
        </h-msg-box>
      </h-col>
    </h-row>

    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>


    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList ,formatBillRange , getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "dueDeductResultTrackSearch",
    components: {
    },
    data() {
      return {
        formItem: {
          acptBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          acptBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          acptTypeList: [],
          billNo: "",
          drwrName: "",
          drwrAcctNo: "",
          drwrCustNo: "",
          minRemitDt: "",
          maxRemitDt: "",
          minAcptDt: "",
          maxAcptDt: "",
          minDueDt: "",
          maxDueDt: "",
          minDeductDt: "",
          maxDeductDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          billClass: "",
          otherBankAcptMark: "",
          deductStatusList: [],
          deductResult:"",
          billOrigin:"",
          reverseBillNo:"",
          minBillRangeStart:"",
          maxBillRangeEnd:""
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.pe.deductDt"),
            key: "deductDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.deductDt == null || params.row.deductDt === "" || params.row.deductDt === 0) {
                return "";
              }
              let date = this.$moment(params.row.deductDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pe.deductStatus"),
            key: "deductStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DeductStatusType", params.row.deductStatus);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.pe.deductResult"),
            key: "deductResult",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let deductResult = this.formatDeductResult(params.row.deductResult);
              return h("span", {
                domProps: {
                  title: deductResult
                }
              }, deductResult);
            }
          },
          {
            title: this.$t("m.i.pe.deductResultRemark"),
            key: "deductResultRemark",
            hiddenCol: false,
            sortable: false
          },
          {
            title: "扣款历史",
            key: "acptProtocalNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let title = "查看扣款历史";
              return h("a", {
                on: {
                  click: () => {
                    this.showFlowNo(params.row);
                  }
                }
              }, title);
            }
          },
          {
            title: this.$t("m.i.pe.acptType"),
            key: "acptType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcptType", params.row.acptType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.pe.otherBankAcptMark"),
            key: "otherBankAcptMark",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.otherBankAcptMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title:this.$t("m.i.pe.paymentBrchNo"),
            key: "paymentBrchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.paymentBrchName"),
            key: "paymentBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: 'billOrigin',
            align:'center',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
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
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              } else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
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
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
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
            title: this.$t("m.i.pe.deductAmt"),
            key: "deductAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let deductAmt = formatNumber(params.row.deductAmt, 2, ",");
              return h("a", {
                domProps: {
                  title: deductAmt
                },
                on: {
                  click: () => {
                    this.showDueDeductAcct(params.row.id);
                  }
                }
              }, deductAmt);
            }
          },
          {
            title: this.$t("m.i.pe.preAdvancedPayAmt"),
            key: "preAdvancedPayAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.preAdvancedPayAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.pe.advancedPayAmt"),
            key: "advancedPayAmt",
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.advancedPayAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.pe.advancedPayAcctNo"),
            key: "advancedPayAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            hiddenCol: false,
            sortable: true
          }
        ],
        dueDeductAcctForm: {
          listId: ""
        },
        dueDeductAcctColumns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.pe.deductAcctNo"),
            key: "deductAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.dpstNo"),
            key: "dpstNo",
            hiddenCol: false
          },
          {
            title:  this.$t("m.i.pe.deductAcctType"),
            key: "deductAcctType",
            hiddenCol: false,
            render: (h, params) => {
              let title = "";
              if (params.row.deductAcctType === "1") {
                title = "结算账户";
              }
              if (params.row.deductAcctType === "2") {
                title = "保证金账户";
              }
              return h("span", title);
            }
          },
          {
            title: this.$t("m.i.pe.deductAmt"),
            key: "deductAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let deductAmt = formatNumber(params.row.deductAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: deductAmt
                }
              }, deductAmt);
            }
          },
          {
            title: this.$t("m.i.pe.deductInterest"),
            key: "deductInterest",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let deductInterest = formatNumber(params.row.deductInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: deductInterest
                }
              }, deductInterest);
            }
          }
        ],
        deductAcctFlowColumns:[
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.foreFlowNo"),
            key: "foreFlowNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.backFlowNo"),
            key: "coreFlowNo",
            hiddenCol: false
          },
          /*{
            title: this.$t("m.i.pe.deductAmt"),
            key: "transAmt",
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
          },*/
          {
            title:  this.$t("m.i.pe.deductDt"),
            key: "deductDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.deductDt == null || params.row.deductDt === "" || params.row.deductDt === 0) {
                return "";
              }
              let date = this.$moment(params.row.deductDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: "扣款时间",
            key: "createTime",
            hiddenCol: false,
            sortable: true,

            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let date = this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pe.deductResult"),
            key: "returnCode",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let deductResult = this.formatDeductResult(params.row.returnCode);
              return h("span", {
                domProps: {
                  title: deductResult
                }
              }, deductResult);
            }
          },
          {
            title: this.$t("m.i.pe.deductResultRemark"),
            key: "returnMsg",
            hiddenCol: false,
            sortable: false
          }
        ],
        deductAcctFlowForm:{
          billNo:"",
          billRangeStart:"",
          billRangeEnd:""
        },
        remitDt: [],
        dueDt: [],
        acptDt: [],
        deductDt: [],
        AcptTypeList: [],
        DeductStatusList: [],
        yonList: [],
        billOriginList : [],
        billClassList: [],
        dictMap: new Map(),
        billId: "",
        //是否显示更多查询项
        ifShowMore: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        showBillInfoWin: false,
        tempShowExcelTemplateWin: false,
        deductAcctFlowWin:false,
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        queryUrl: "/ce/acpt/dueDeduct/dueDeductResultTrackSearch/func_pageQueryDueDeductResult",
        dueDeductAcctWin: false
      };
    },
    mounted() {
      this.getDictListByGroups("AcptType,AcptStatus,DeductStatusType,CDMedia,Yon,AcptRgstStatus,AcptCpesRgstType,BillOrigin").then(res => {
        this.AcptTypeList = res.get("AcptType");
        this.DeductStatusList = res.get("DeductStatusType");
        this.billClassList = res.get("CDMedia");
        this.yonList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.dueDeductAcctDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      getOccurData() {
        let obj = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize
        });
        let url = this.queryUrl;
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.total = data.pageInfo.count;
                this.sumMoney = formatNumber(data.pageInfo.sumMoney, 2, ",");
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },

      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minAcptDt = "";
        this.formItem.maxAcptDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minDeductDt = "";
        this.formItem.maxDeductDt = "";
        this.remitDt = [];
        this.acptDt = [];
        this.dueDt = [];
        this.deductDt = [];
        this.formItem.drwrCustNo = "";
        this.formItem.acptBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.acptBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      },

      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },

      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },

      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },

      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },

      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },

      //日期选择框
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },

      handleAcptDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minAcptDt = arr[0].replace(/-/g, "");
          this.formItem.maxAcptDt = arr[1].replace(/-/g, "");
          this.acptDt = [arr[0], arr[1]];
        } else {
          this.formItem.minAcptDt = "";
          this.formItem.maxAcptDt = "";
          this.acptDt = [];
        }
      },

      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
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
        } else {
          this.formItem.minDeductDt = "";
          this.formItem.maxDeductDt = "";
          this.deductDt = [];
        }
      },

      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },

      queryDueDeductOccurBill() {
        this.formSearch();
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },

      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "dueDeductResultExportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/dueDeduct/dueDeductResultTrackSearch/func_exportDueDeductResult";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

      showDueDeductAcct(id) {
        this.dueDeductAcctWin = true;
        this.$nextTick(() => {
          this.dueDeductAcctForm.listId = id;
          this.$refs.dueDeductAcctDatagrid.dataChange(1);
        });
      },

      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
      clearVal(optType) {
       if (optType === "drwrName") {
          this.formItem.drwrAcctNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrCustNo = "";
        }
      },
      showFlowNo(row){
        this.deductAcctFlowWin = true;
        this.$nextTick(() => {
          this.deductAcctFlowForm.billNo = row.billNo;
          this.deductAcctFlowForm.billRangeStart = row.billRangeStart;
          this.deductAcctFlowForm.billRangeEnd = row.billRangeEnd;
          this.$refs.deductAcctFlowDatagrid.dataChange(1);
        });
      },
      deductAcctFlowWinClose() {
        this.deductAcctFlowWin = false;
        this.deductAcctFlowForm = {};
      },
      //格式化扣款结果
      formatDeductResult(deductResult){
        if(deductResult != null ){
          if(deductResult == "000000"){
            return "扣款成功"
          }else {
            return "扣款失败"
          }
        }else {
          return "扣款中"
        }

      }
    }
  };
</script>

<style scoped>

</style>
