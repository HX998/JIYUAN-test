<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--        <h-form-item :label="$t('m.i.common.brchName')" prop="acptBrchNoList">
                          <h-input v-model="formItem.acptBrchNoList" readonly v-show="false" placeholder=""></h-input>
                          <h-input v-model="formItem.acptBrchNameList" readonly icon="android-search" @on-click="queryBrchNo()"
                                   clearable @on-clear="clearVal('acptBrchNoList')" :title="formItem.acptBrchNameList"></h-input>
                        </h-form-item>-->
                <show-branch v-model="formItem.acptBrchNameList" :label="$t('m.i.common.brchName')"
                             prop="acptBrchNameList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.acptBrchNoList"
                             :brchName.sync="formItem.acptBrchNameList"></show-branch>

                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.acptType')" prop="acptTypeList">
                  <h-select v-model="formItem.acptTypeList" placeholder="" multiple showTitle>
                    <h-option v-for="item in AcptTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.acptStatus')" prop="acptStatusList">
                  <h-select v-model="formItem.acptStatusList" placeholder="" multiple showTitle>
                    <h-option value="1">签发</h-option>
                    <h-option value="2">未用退回</h-option>
                    <h-option value="3">结清(付款)</h-option>
                    <h-option value="5">失效</h-option>
                  </h-select>
                </h-form-item>
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
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
                <h-form-item :label="$t('m.i.billInfo.payDt')" prop="paymentDtRange">
                  <h-date-picker :value="paymentDtRange" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handlePaymentDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoneyItem"
                             class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.otherBankAcptMark')" prop="otherBankAcptMark">
                  <h-select v-model="formItem.otherBankAcptMark" placeholder="" showTitle>
                    <h-option v-for="item in yonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.deductStatus')" prop="deductStatusList">
                  <h-select v-model="formItem.deductStatusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in DeductStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.inOutFlag')" prop="inOutFlag">
                  <h-select v-model="formItem.inOutFlag" placeholder="" showTitle>
                    <h-option v-for="item in inOutFlagList" :value="item.key" :key="item.key">{{
                        item.value
                      }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.payRgstTellerNo')" prop="payRgstTellerNo" class="h-form-long-label">
                  <h-input v-model="formItem.payRgstTellerNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.payRgstDt')" prop="payRgstDtRange">
                  <h-date-picker :value="payRgstDtRange" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handlepayRgstDtRange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.billOutType')" prop="fastAcptFlag">
                  <h-select v-model="formItem.fastAcptFlag" placeholder="" showTitle>
                    <h-option value="0">普通开票</h-option>
                    <h-option value="1">极速开票</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
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
            :columns="showColumns"
            getDataFunc
            @get-data="getOccurData"
            :gridData="occurData"
            :bindForm="formItem"
            :auto-load="false"
            :hasSelect=false
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryAcptOccurBatch()">{{ $t("m.i.pe.queryAcptOccurBatch") }}</h-button>
              <h-button type="primary" @click="queryAcptOccurBill">{{ $t("m.i.pe.queryAcptOccurBill") }}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('batch')"
                        :disabled="this.ifDisabledExport">{{ $t("m.i.pe.arrayExport") }}
              </h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('bill')"
                        :disabled="!this.ifDisabledExport">{{ $t("m.i.pe.flowExport") }}
              </h-button>
              <h-button type="primary" @click="bulkPrintBill" :billId="this.billId" :billIds="this.billIds"
                        :disabled="!this.ifDisabledPrint" v-if="isShowPrintBtn">{{ $t("m.i.pc.billFrontPrint") }}
              </h-button>
              <h-button type="primary" @click="bulkPrintOutEndo" :billId="this.billId" :billIds="this.billIds"
                        :disabled="!this.ifDisabledPrint" v-if="isShowPrintBtn">{{ $t("m.i.pc.endoPrint") }}
              </h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 登记日期历史查询弹窗 -->
        <h-msg-box v-model="rgstDtHisWin" width="800" class="h-form-table-layer" :maximize="true" :mask-closable="false"
                   @on-close="rgstDtHisWinClose()" @on-maximize="onMaximize">
          <!--弹出框模式标题-->
          <p slot="header">
            <span>登记历史查询</span>
          </p>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="rgstDtHisColumns"
                      highlight-row
                      :autoLoad="false"
                      url="/ce/acpt/paper/search/acptTrackSearch/func_pageQueryAcptInfoRgst"
                      :bindForm="rgstDtHisForm"
                      :height="350"
                      ref="rgstDtHisDatagrid" class="pl-5 pr-5">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
          <!-- 弹出框模式底部按钮 -->
          <div slot="footer">
            <h-button type="ghost" @click="rgstDtHisWinClose()">{{ $t("m.i.common.close") }}</h-button>
          </div>
        </h-msg-box>
      </h-col>
    </h-row>

    <!-- 机构名称选择弹窗框 -->
    <!--  <show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange" ifcheck="true"
                   :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>-->

    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" :isAllBankAcct=true
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart"
                    :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <bill-infos-main @billInfosWinClose="billInfosWinClose" @bulkPrintBillFlagClose="bulkPrintBillFlagClose"
                     @bulkPrintOutEndoFlagClose="bulkPrintOutEndoFlagClose" @bulk :showBillInfoWin="showBillInfosWin"
                     :billIds="this.billIds"
                     :billNos="this.billNos" :billRangeStarts="this.billRangeStarts" :billRangeEnds="this.billRangeEnds"
                     ref="billInfosMain" :bulkPrintBillFlag="bulkPrintBillFlag"
                     :bulkPrintOutEndoFlag="bulkPrintOutEndoFlag" v-if="showBillInfosWin"></bill-infos-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!--查看附件弹窗-->
    <show-attach :showAttachWin="showAttachWin" @attachWinClose="attachWinClose"
                 :attachParams="attachParams"></show-attach>
  </div>
</template>

<script>
import {accMul, exportList, formatBillRange, formatNumber, post} from "@/api/bizApi/commonUtil";

export default {
  name: "acptOccurQuery",
  components: {
    //ShowBranch: () => import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */ "@/views/bizViews/be/market/rediscount/common/showBranch")
  },
  data() {
    let batchColumns = [
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
        title: this.$t("m.i.common.batchNo"),
        key: "batchNo",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          return h("a", {
            on: {
              click: () => {
                this.showAcptOccurBill(params.row.batchNo);
              }
            }
          }, params.row.batchNo);
        }
      },
      {
        title: this.$t("m.i.billInfo.drwrName"),
        key: "drwrName",
        sortable: true,
        hiddenCol: false
      },
      {
        title: this.$t("m.i.billInfo.drwrAcctNo"),
        key: "drwrAcctNo",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t("m.i.billInfo.acptProtocalNo"),
        key: "acptProtocalNo",
        hiddenCol: false,
        sortable: true
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
        title: this.$t("m.i.pe.busiBrchNo"),
        key: "busiBrchNo",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t("m.i.pe.busiBrchNames"),
        key: "busiBrchName",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t("m.i.pe.acptBrchNo"),
        key: "acptBrchNo",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t("m.i.pe.acptBrchNames"),
        key: "acptBrchName",
        hiddenCol: false,
        sortable: true
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
        title: this.$t("m.i.ce.guarntrNo"),
        key: "guarntrNo",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          if (params.row.guarntrType === "3") {
            return "";
          }
          let guarntrNo = params.row.guarntrNo;
          return h("span", guarntrNo);
        }
      },
      {
        title: this.$t("m.i.ce.guarntrAmt"),
        key: "guarntrAmt",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ",");
          return h("span", {
            domProps: {
              title: guarntrAmt
            }
          }, guarntrAmt);
        }
      },
      {
        title: this.$t("m.i.ce.bailPcetStr"),
        key: "bailPcet",
        hiddenCol: false,
        render: (h, params) => {
          if (params.row.bailPcet != null && params.row.bailPcet !== "") {
            let rate = accMul(params.row.bailPcet, 100);
            return h("span", rate);
          }
        }
      },
      {
        title: this.$t("m.i.pe.total"),
        key: "totalCount",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.pe.totalAmt"),
        key: "totalAmt",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          let totalAmt = formatNumber(params.row.totalAmt, 2, ",");
          return h("span", {
            domProps: {
              title: totalAmt
            }
          }, totalAmt);
        }
      },
      {
        title: this.$t("m.i.auth.attachment"),
        key: "attachment",
        render: (h, params) => {
          let attachment = "查看附件";
          return h("a", {
            on: {
              click: () => {
                this.showAttachDeal(params.row.id);
              }
            }
          }, attachment);
        }
      }
    ];
    return {
      formItem: {
        acptBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
        acptBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        acptTypeList: [],
        acptStatusList: [],
        inOutFlagList: [],
        billIds: [],
        batchNo: "",
        fastAcptFlag: "",
        billNoLike: "",
        drwrName: "",
        drwrAcctNo: "",
        drwrCustNo: "",
        minRemitDt: "",
        maxRemitDt: "",
        minAcptDt: "",
        maxAcptDt: "",
        minDueDt: "",
        maxDueDt: "",
        minPaymentDt: "",
        maxPaymentDt: "",
        minPayRgstDt: "",
        maxPayRgstDt: "",
        minBillMoney: "",
        maxBillMoney: "",
        billClass: "",
        otherBankAcptMark: "",
        payRgstTellerNo: "",
        payRgstDt: "",
        deductStatusList: [],
        billOrigin: "",
        reverseBillNo: "",
        minBillRangeStart: "",
        maxBillRangeEnd: ""
      },
      showAttachWin: false,
      attachParams: {
        queryUrl: "",
        downloadUrl: "",
        attachFormItem: {
          batchId: ""
        },
      },
      batchColumns: batchColumns,
      billColumns: [
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
          title: this.$t('m.i.billInfo.billOrigin'),
          align: 'center',
          key: 'billOrigin',
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
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
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
          title: this.$t("m.i.pe.acptStatus"),
          key: "acptStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "AcptStatus", params.row.acptStatus);
            return h("span",
              {
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
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: "acptProtocalNo",
          hiddenCol: false,
          sortable: true
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
          title: this.$t("m.i.pe.busiBrchNo"),
          key: "busiBrchNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pe.busiBrchNames"),
          key: "busiBrchName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pe.acptBrchNo"),
          key: "acptBrchNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pe.acptBrchNames"),
          key: "acptBrchName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.ce.bailPcetStr"),
          key: "bailPcet",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.bailPcet != null && params.row.bailPcet !== "") {
              let rate = accMul(params.row.bailPcet, 100);
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          sortable: true,
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
          title: this.$t("m.i.pe.drweBankName"),
          key: "drweBankName",
          hiddenCol: false,
          sortable: true
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
          title: this.$t("m.i.billInfo.acptDt"),
          key: "acptDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.acptDt == null || params.row.acptDt === "") {
              return "";
            }
            let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
          title: this.$t("m.i.pc.inOutFlag"),
          key: "inOutFlag",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.inOutFlag === '' || params.row.inOutFlag == null) {
              return h('span', {}, '-');
            }
            let dictValue = this.getDictValueFromMap(this.dictMap, "InOutFlagCode", params.row.inOutFlag);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pe.registerStatus"),
          key: "registerStatus",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.acptRgstStatus == null || params.row.acptRgstStatus === "") {
              return h("span", "");
            } else {
              let str = params.row.acptRgstStatus.replace(/-/g, "");
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcptRgstStatus", str.substring(1, 6));
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        },
        {
          title: this.$t("m.i.pe.registerType"),
          key: "registerType",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.acptRgstStatus === null || params.row.acptRgstStatus === "") {
              return "";
            } else {
              let acptRgstStatus = params.row.acptRgstStatus.replace(/-/g, "");
              let list = this.getDictValueFromMap(this.dictMap, "AcptCpesRgstType", acptRgstStatus.substring(0, 1));
              return h("a", {
                domProps: {
                  title: list
                },
                on: {
                  click: () => {
                    this.showRgstDtHis(params.row.id);
                  }
                }
              }, list);
            }
          }
        },
        {
          title: this.$t("m.i.pe.acptRgstDt"),
          key: "acptRgstDt",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.acptRgstDt == null || params.row.acptRgstDt === "" || params.row.acptRgstDt === 0) {
              return "";
            }
            let date = this.$moment(params.row.acptRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pe.drwgBackDt"),
          key: "drwgBackDt",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.drwgBackDt == null || params.row.drwgBackDt === "" || params.row.drwgBackDt === 0) {
              return "";
            }
            let date = this.$moment(params.row.drwgBackDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pe.paymentDt"),
          key: "paymentDt",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.paymentDt == null || params.row.paymentDt === "" || params.row.paymentDt === 0) {
              return "";
            }
            let date = this.$moment(params.row.paymentDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.feeAmtUnit"),
          key: "fee",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let feeAmt = formatNumber(params.row.fee, 2, ",");
            return h("span", {
              domProps: {
                title: feeAmt
              }
            }, feeAmt);
          }
        },
        {
          title: this.$t("m.i.ce.commitFee"),
          key: "commitFee",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let feeAmt = formatNumber(params.row.fee, 2, ",");
            return h("span", {
              domProps: {
                title: feeAmt
              }
            }, feeAmt);
          }
        },
        {
          title: this.$t("m.i.pe.payRgstTellerNo"),
          key: "payRgstTellerNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pe.payRgstDt"),
          key: "payRgstDt",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.payRgstDt == null || params.row.payRgstDt === "" || params.row.payRgstDt === 0) {
              return "";
            }
            let date = this.$moment(params.row.payRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pe.payRgstTime"),
          key: "payRgstTm",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let time = params.row.payRgstTm;
            if (!!params.row.payRgstTm) {
              let payRgstTm = params.row.payRgstTm.toString();
              if (payRgstTm.length < 6) {
                for (let i = 0; i < (6 - payRgstTm.length); i++) {
                  payRgstTm = "0" + payRgstTm;
                }
              }
              time = this.$moment(payRgstTm, "HH:mm:ss").format("HH:mm:ss");
            }
            return h("span", time);
          }
        },
        {
          title: this.$t("m.i.pe.isOwnDisc"),
          key: "isOwnDisc",
          hiddenCol: false,
          sortable: true
        },

      ],
      rgstDtHisWin: false,
      rgstDtHisColumns: [
        {
          type: "radio",
          width: 60,
          title: " ",
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
          key: "rgstType",
          title: this.$t("m.i.pe.rgstType"),
          hiddenCol: true
        },
        {
          title: this.$t("m.i.pe.registerType"),
          key: "rgstBusiType",
          hiddenCol: false,
          render: (h, params) => {
            let rgstBusiType = params.row.rgstBusiType.toString();
            if (rgstBusiType === "1") {
              rgstBusiType = "承兑登记";
            } else if (rgstBusiType === "2") {
              rgstBusiType = "止付登记";
            } else if (rgstBusiType === "3") {
              rgstBusiType = "结清登记";
            } else if (rgstBusiType === "4") {
              rgstBusiType = "解止付登记";
            }
            let prodNameEnd = "";
            if (params.row.rgstType === "1") {
              prodNameEnd = "申请";
            } else if (params.row.rgstType === "2") {
              prodNameEnd = "撤销";
            }
            return h("span", rgstBusiType + prodNameEnd);
          }
        },
        {
          title: this.$t("m.i.common.busiType"),
          key: "prodNo",
          hiddenCol: false,
          render: (h, params) => {
            let prodNo = params.row.prodNo;
            let prodName = "";
            if (prodNo == "01010111") {
              prodName = "纸票银承签发";
            } else if (prodNo == "01010211") {
              prodName = "纸票银承解付(场外)";
            } else if (prodNo == "01010311") {
              prodName = "纸票银承未用退回";
            } else if (prodNo == "01010611") {
              prodName = "纸票银承止付";
            } else if (prodNo == "01010711") {
              prodName = "纸票银承止付解除";
            } else if (prodNo == "02020211") {
              prodName = "纸票银承凭证退回";
            }
            return h("span", prodName);
          }
        },
        {
          title: this.$t("m.i.pe.rgstResult"),
          key: "rgstResult",
          hiddenCol: false,
          render: (h, params) => {
            let rgstResult = params.row.rgstResult;
            if (rgstResult == null || rgstResult === "") {
              return "";
            } else if (rgstResult === "0") {
              rgstResult = "处理失败";
            } else if (rgstResult === "1") {
              rgstResult = "处理成功";
            } else if (rgstResult === "2") {
              rgstResult = "处理中";
            }
            return h("span", rgstResult);
          }
        },
        {
          title: this.$t("m.i.pe.acptRgstDt"),
          key: "rgstDt",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.rgstDt == null || params.row.rgstDt === "") {
              return "";
            }
            let date = this.$moment(params.row.rgstDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", date);
          }
        }
      ],
      rgstDtHisForm: {
        listId: "",
        acptId: ""
      },
      inOutFlagList: [],
      remitDt: [],
      dueDt: [],
      paymentDtRange: [],
      payRgstDtRange: [],
      acptDt: [],
      AcptTypeList: [],
      AcptStatusList: [],
      DeductStatusList: [],
      yonList: [],
      billClassList: [],
      billOriginList: [],
      dictMap: new Map(),
      billIds: [],
      billNos: [],
      billRangeStarts: [],
      billRangeEnds: [],
      maxPrintNum: 1,
      billId: "",
      billRangeStart: "",
      billRangeEnd: "",
      //是否显示更多查询项
      ifShowMore: false,
      showCustAcctNoWin: false,
      showCustMessageWin: false,
      showBillInfoWin: false,
      showBillInfosWin: false,
      bulkPrintBillFlag: false,
      bulkPrintOutEndoFlag: false,
      tempShowExcelTemplateWin: false,
      //showBranchWin: false,
      queryUrl: "/pe/busiqry/acptOccurQuery/func_pageingQueryBatchList",
      ifDisabledExport: false,
      ifDisabledPrint: false,
      isShowPrintBtn: false,
      showColumns: this.deepClone(batchColumns),
      param: null,
      rows: null,
      sumMoney: "",
      total: "",
      selectExportType: "",
      occurData: {rows: [], total: 1}
    };
  },
  mounted() {
    this.buttonAuthShow();
    this.getOccurData();
    this.getDictListByGroups("AcptType,AcptStatus,DeductStatusType,CDMedia,Yon,AcptRgstStatus,AcptCpesRgstType,InOutFlagCode,BillOrigin,GuarntrType").then(res => {
      this.AcptTypeList = res.get("AcptType");
      this.DeductStatusList = res.get("DeductStatusType");
      this.billClassList = res.get("CDMedia");
      this.inOutFlagList = res.get("InOutFlagCode")
      this.yonList = res.get("Yon");
      this.dictMap = res.get("map");
      this.billOriginList = res.get("BillOrigin");
    });
    //按钮权限查询 控制按钮显隐
    let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
    post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
      if (res) {
        let retCode = res.data.retCode;
        let retMsg = res.data.retMsg;
        if (retCode === "000000") {
          let btnAuth = JSON.parse(res.data.retData);
          let isShowAttach = btnAuth.showAttach === undefined ? false : btnAuth.showAttach.isShow;
          this.$refs.datagrid.controlColumnsHidden("attachment", !isShowAttach);
        } else {
          this.$msgTip.error(this, {info: retMsg});
        }
      } else {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
      }
    });
  },
  methods: {
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
              this.occurData = res.data.retData;
              this.total = res.data.retData.pageInfo.count;
              this.sumMoney = formatNumber(res.data.retData.pageInfo.sumMoney, 2, ",");
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        }
      );
    },
    buttonAuthShow() {
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if (this.btnAuth.isShowPrintBtn === undefined ? false : this.btnAuth.isShowPrintBtn.isShow) {
              this.isShowPrintBtn = true;
            } else {
              this.isShowPrintBtn = false;
            }
          } else {
            this.$msgTip.error(this, {info: retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
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
      this.formItem.minDueDt = "";
      this.formItem.maxDueDt = "";
      this.formItem.minAcptDt = "";
      this.formItem.maxAcptDt = "";
      this.formItem.minPaymentDt = "";
      this.formItem.maxPaymentDt = "";
      this.formItem.maxPayRgstDt = "";
      this.formItem.maxPayRgstDt = "";
      this.formItem.drwrCustNo = "";
      this.formItem.acptBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
      this.formItem.acptBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      this.formItem.inOutFlag = "";
      this.remitDt = [];
      this.dueDt = [];
      this.acptDt = [];
      this.paymentDtRange = [];
      this.payRgstDtRange = [];
    },
    /* //查询机构弹出框
     queryBrchNo() {
       this.showBranchWin = true;
     },*/
    /*showBranchWinClose() {
      this.showBranchWin = false;
    },
    //根据弹框所选数据进行赋值
    brchNoChange(info) {
      let objs = [];
      if (info instanceof Array) {
        objs = info;
      } else {
        objs[0] = info;
      }
      let acptBrchNoList = "";
      let acptBrchNameList = "";
      for (var i = 0; i < objs.length; i++) {
        acptBrchNoList += objs[i].id + ",";
        acptBrchNameList += objs[i].title + ",";
      }
      this.formItem.acptBrchNoList = acptBrchNoList.substring(0, acptBrchNoList.length - 1);
      this.formItem.acptBrchNameList = acptBrchNameList.substring(0, acptBrchNameList.length - 1);
      this.showBranchWin = false;
    },*/
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
        this.$msgTip.info(this, {info: "请先选择客户"});
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
      if (arr && arr.length == 2) {
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
      if (arr && arr.length == 2) {
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
      if (arr && arr.length == 2) {
        this.formItem.minDueDt = arr[0].replace(/-/g, "");
        this.formItem.maxDueDt = arr[1].replace(/-/g, "");
        this.dueDt = [arr[0], arr[1]];
      } else {
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.dueDt = [];
      }

    },
    handlePaymentDtChange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minPaymentDt = arr[0].replace(/-/g, "");
        this.formItem.maxPaymentDt = arr[1].replace(/-/g, "");
        this.paymentDtRange = [arr[0], arr[1]];
      } else {
        this.formItem.minPaymentDt = "";
        this.formItem.maxPaymentDt = "";
        this.paymentDtRange = [];
      }
    },
    handlepayRgstDtRange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minPayRgstDt = arr[0].replace(/-/g, "");
        this.formItem.maxPayRgstDt = arr[1].replace(/-/g, "");
        this.payRgstDtRange = [arr[0], arr[1]];
      } else {
        this.formItem.minPayRgstDt = "";
        this.formItem.maxPayRgstDt = "";
        this.payRgstDtRange = [];
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
    billInfosWinClose() {
      this.billIds = [];
      this.billNos = [];
      this.billRangeStarts = [];
      this.billRangeEnds = [];
      this.showBillInfosWin = false;
      this.bulkPrintBillFlag = false;
      this.bulkPrintOutEndoFlag = false;
      // this.$refs.datagrid.dataChange(1);
      // this.$refs.datagrid.selects = [];
      // this.$refs.datagrid.selectIds = [];
    },
    bulkPrintBillFlagClose() {
      this.isLoading = false;
      this.bulkPrintBillFlag = false;

    },
    bulkPrintOutEndoFlagClose() {
      this.isLoading = false;
      this.bulkPrintOutEndoFlag = false;
    },
    //查看附件
    showAttachDeal(batchId) {
      this.attachParams.queryUrl = "/pe/busiqry/acptOccurQuery/func_queryAttachInfoPage";
      this.attachParams.downloadUrl = "/bm/audit/auditTaskSubmit/func_attachDownload";
      this.attachParams.attachFormItem.batchId = batchId;
      this.showAttachWin = true;
    },

    //查看附件窗口关闭
    attachWinClose() {
      this.showAttachWin = false;
      this.attachParams.attachFormItem.batchId = "";
    },
    showAcptOccurBill(batchNo) {
      this.$refs.datagrid.tData = [];
      this.$refs.datagrid.pageInfo.pageNo = 1;
      this.formItem.batchNo = batchNo;
      this.queryUrl = "/pe/busiqry/acptOccurQuery/func_pagingQueryBillList";
      this.ifDisabledExport = true;
      this.ifDisabledPrint = true;
      this.$nextTick(() => {
        this.showColumns = this.deepClone(this.billColumns);
        this.$refs.datagrid.createShowCol(this.billColumns);
        this.formSearch();
      });

    },
    queryAcptOccurBatch() {
      this.$refs.datagrid.tData = [];
      this.$refs.datagrid.pageInfo.pageNo = 1;
      this.queryUrl = "/pe/busiqry/acptOccurQuery/func_pageingQueryBatchList";
      this.ifDisabledExport = false;
      this.ifDisabledPrint = false;
      this.showColumns = this.deepClone(this.batchColumns);
      this.formSearch();
    },
    queryAcptOccurBill() {
      this.$refs.datagrid.tData = [];
      this.$refs.datagrid.pageInfo.pageNo = 1;
      this.queryUrl = "/pe/busiqry/acptOccurQuery/func_pagingQueryBillList";
      this.ifDisabledExport = true;
      this.ifDisabledPrint = true;
      this.$nextTick(() => {
        this.showColumns = this.deepClone(this.billColumns);
        this.$refs.datagrid.createShowCol(this.billColumns);
      });
      this.formSearch();
    },
    showExcelTemplateWinClose() {
      this.tempShowExcelTemplateWin = false;
    },
    //清单导出
    tempShowExcelTemplateWinOpen(type) {
      this.selectExportType = type;
      if (type === "batch") {
        this.param = "acptBatchOccurExportInfo";
      } else {
        this.param = "acptBillOccurExportInfo";
      }
      if (this.$refs.datagrid.selectIds.length != 0) {
        this.rows = this.$refs.datagrid.selectIds.length;
      } else {
        this.rows = this.$refs.datagrid.total;
      }
      this.tempShowExcelTemplateWin = true;
    },

    //清单导出
    exportList(field, exportType) {
      let exportUrl;
      if (this.selectExportType === "batch") {
        exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/acptOccurQuery/func_exportAcptBatchOccurExcel";
      } else {
        exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/acptOccurQuery/func_exportAcptBillOccurExcel";
      }
      let options = {
        params: {}
      };
      if (this.$refs.datagrid.selectIds.length !== 0) {
        if (this.selectExportType === "batch") {
          options.params.batchIds = this.$refs.datagrid.selectIds;
        } else {
          options.params.ids = this.$refs.datagrid.selectIds;
        }
        options.pageSize = this.$refs.datagrid.selectIds.length;
      } else {
        options.params = this.formItem;
        options.pageSize = this.$refs.datagrid.total;
      }
      exportList(this, this.param, field, exportType, exportUrl, options);
    },
    showRgstDtHis(id) {
      this.rgstDtHisWin = true;
      this.$nextTick(() => {
        this.rgstDtHisForm.acptId = id;
        this.$refs.rgstDtHisDatagrid.dataChange(1);
      });
    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.rgstDtHisDatagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    rgstDtHisWinClose() {
      this.rgstDtHisForm.billNo = "";
      this.rgstDtHisWin = false;
    },
    //批量打印正面或者场外背书
    bulkPrint() {
      this.billIds = this.$refs.datagrid.selectIds;
      let selectRows = this.$refs.datagrid.selects;
      console.log('this.billIds1111:' + this.billIds);
      if (this.billIds === null || this.billIds.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      if (this.billIds.length > this.maxPrintNum) {
        this.$msgTip.info(this, {info: "最多选中" + this.maxPrintNum + "条记录"});
        return;
      }

      // let selectRows = this.$refs.datagrid.selects;
      this.billIds = [];
      for (let i = 0; i < selectRows.length; i++) {
        this.billIds.push(selectRows[i].billId);
        this.billNos.push(selectRows[i].billNo);
        this.billRangeStarts.push(selectRows[i].billRangeStart);
        this.billRangeEnds.push(selectRows[i].billRangeEnd);
      }
      this.isLoading = true;
      this.showBillInfosWin = true;

    },
    bulkPrintBill() {
      this.bulkPrintBillFlag = true;
      this.bulkPrint();
      setTimeout(() => {
        this.isLoading = false;
      }, this.billIds.length * 350)
    },
    bulkPrintOutEndo() {
      this.bulkPrintOutEndoFlag = true;
      this.bulkPrint();
      setTimeout(() => {
        this.isLoading = false;
      }, this.billIds.length * 300)
    },
    queryBusiParamDefaultValue() {
      post({paramKey: "bm.common.bill_print_max_num"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            if (res.data.retData == null || res.data.retData == '') {
              this.maxPrintNum = 20;
            } else {
              this.maxPrintNum = Number(res.data.retData);
            }

          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    clearVal(optType) {
      if (optType === "drwrName") {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = "";
        this.formItem.drwrCustNo = "";
      }
    }
  },

  created() {
    this.queryBusiParamDefaultValue();
  }
};
</script>

<style scoped>

</style>
