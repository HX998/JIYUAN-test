<!--纸票/电票出池申请管理-新增/修改申请-->
<template>
  <div>
    <h-msg-box v-model="tempOutPoolAddOrEditWin" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchOptType==='add'">新增申请</span>
        <span v-else-if="batchOptType==='modify' && batchParams.isCommit === 'noCommit'">修改申请</span>
        <span v-else-if="batchOptType==='modify' && batchParams.isCommit === 'hasCommit'">撤销申请</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo" required>
              <h-input v-model="addOrEditForm.agreementNo" :maxlength="60" readonly
                       :icon="this.hadBatchSave ? '' : 'android-search'" @on-click="queryAgreementNo()"></h-input>
            </h-form-item>
            <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
              <h-input v-model="addOrEditForm.custNo" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
              <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" required>
              <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="getWay" :label="$t('m.i.pl.getWay')" required>
              <h-select v-model="addOrEditForm.getWay" placeholder="">
                <h-option v-for="item in batchParams.getWayList" :value="item.key" :key="item.key">{{ item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="outPoolDt" :label="$t('m.i.pl.outPoolDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.outPoolDt" placeholder=""
                             @on-change="handleOutPoolDtChange" showFormat :editable=false></h-date-picker>
            </h-form-item>
            <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
              <h-select v-model="addOrEditForm.billType" placeholder="" :readonly="this.hadBatchSave">
                <h-option v-for="item in batchParams.billTypeList" :value="item.key" :key="item.key">{{ item.value }}
                </h-option>
              </h-select>
            </h-form-item>
          </div>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()" v-if="this.batchParams.isCommit === 'noCommit'">
            {{ $t("m.i.common.save") }}
          </h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          :auto-load="false"
          :url="dataUrl"
          :bindForm="formItem"
          :rowSelect="true"
          :hasSelect="hasSelect"
          :onSelectChange="onCurrentBillChange"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="ioPoolPickBill">
              {{ $t('m.i.pl.pickBill') }}
            </h-button>
            <h-button type="primary"
                      v-if="this.batchParams.isCommit === 'noCommit' && this.batchParams.showEbankPickBill=== '1'"
                      @click="ioPoolPickBillByEbank">{{ $t("m.i.pl.pickBillByEbank") }}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoExport">
              {{ $t('m.i.pe.batchExport') }}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoDelete">
              {{ $t("m.i.common.delete") }}
            </h-button>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{ $t("m.i.common.submit") }}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">选择提交</h-dropdown-item>
                <h-dropdown-item name="batch">批次提交</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="inPoolBillPrint()">
              {{ $t("m.i.pl.confirmPrint") }}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="infoCancel">
              {{ $t("m.i.common.cancelCheckAuth") }}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="updateTransAmtBtn"
                      :disabled="hasAmtDisabled">{{$t('m.i.be.editTransAmt')}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 调整票据交易金额 -->
    <h-msg-box v-model="editTransAmtWin" width="700" height="200" class="h-form-table-layer"
               @on-close="editTransAmtClose" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>调整票据交易金额</span>
      </p>

      <h-form :model="splitMoneyForm" :label-width="120" ref="addForm2" cols="1" class="h-form-search">
        <common-input v-model="splitMoneyForm.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo"
                      :required="true" readonly></common-input>

        <common-type-field v-model="splitMoneyForm.billPackageMoney" :label="$t('m.i.billInfo.billPackageMoney')"
                           prop="billPackageMoney"
                           :required="true" readonly></common-type-field>
        <h-form-item :label="$t('m.i.billInfo.transMoney')" prop="transAmt" :required="true">
          <h-typefield type="money" v-model="splitMoneyForm.transAmt" placeholder="" integerNum="10"></h-typefield>
        </h-form-item>
      </h-form>

      <div slot="footer">
        <h-button type="primary" @click="editTransAmtClose()">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="cancelSplit">{{ $t("m.i.common.cancelSplit") }}</h-button>
        <h-button type="primary" @click="editTransAmSubmit()">{{ $t("m.i.common.split") }}</h-button>
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-sign-agreement :signAgreementWin="signAgreementWin" @signAgreementWinClose="signAgreementWinClose"
                         @signAgreementSubmit="signAgreementSubmit" :signParams="signParams"></show-sign-agreement>
    <!--挑票窗口-->
    <e-io-pool-pick-bill :ioPoolPickBillWin="ioPoolPickBillWin" @ioPoolPickBillChange="ioPoolPickBillChange"
                       :ioPoolPickBillParams="ioPoolPickBillParams"
                       @ioPoolPickBillWinClose="ioPoolPickBillWinClose"></e-io-pool-pick-bill>
    <!--挑票窗口 -网银-->
    <e-io-pool-pick-bill :ioPoolPickBillWin="ioPoolPickBillWinWithEbank" @ioPoolPickBillChange="ioPoolPickBillChange"
                         :ioPoolPickBillParams="ioPoolPickBillParams"
                         @ioPoolPickBillWinClose="ioPoolPickBillWinWithEbankClose"></e-io-pool-pick-bill>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :bill-range-start="this.billRangeStart" :bill-range-end="this.billRangeEnd"
                    :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <!--风险信息-->
    <risk-check :riskCheckWin="riskCheckWin" :riskParams="riskParams" @riskCheckWinClose="riskCheckWinClose"
                @riskCheckSubmit="riskCheckSubmit"></risk-check>

    <common-excel-download @handleSubmit="exportForm" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
import {formatBillRange, formatNumber, post} from "@/api/bizApi/commonUtil";

export default {
  name: "eOutPoolApplyAdd",
  components: {
    eIoPoolPickBill: () => import(/* webpackChunkName: "pl/iopool/common/ioPoolPickBill" */ '@/views/bizViews/pl/iopool/common/eIoPoolPickBill'),
  },
  data() {
    return {
      dataUrl: "",
      batchId: "",
      addOrEditForm: {
        id: "",
        legalNo: "",
        agreementNo: "",
        custNo: "",
        custName: "",
        custAcctNo: "",
        getWay: "",
        outPoolDt: "",
        billType: "",
        billClass: ""
      },
      formItem: {
        batchId: "",
        funcNo: "",
        billClass: ""
      },
      splitMoneyForm: {
        billNo: "",
        billPackageMoney: "",
        transAmt: "",
        billOrigin: "",
        billRangeStart: "",
        billRangeEnd: "",
        listIds: "",
        batchId: "",
      },
      columns: [],
      columnsNoCommit: [
        {
          type: "selection",
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
          title: this.$t("m.i.billInfo.billOrigin"),
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let type = "";
            if (!!params.row.billId) {
              type = "billId";
            } else {
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
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          ellipsis: false,
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
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          ellipsis: false,
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
          ellipsis: false,
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
          ellipsis: false,
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
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: "acptProtocalNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drweBankAddr"),
          key: "drweBankAddr",
          ellipsis: false,
          hiddenCol: false
        }
      ],
      columnsHasCommit: [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let type = "";
            if (!!params.row.billId) {
              type = "billId";
            } else {
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
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          ellipsis: false,
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
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          ellipsis: false,
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
          ellipsis: false,
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
          ellipsis: false,
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
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: "acptProtocalNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drweBankAddr"),
          key: "drweBankAddr",
          ellipsis: false,
          hiddenCol: false
        }
      ],
      eColumnsNoCommit: [
        {
          type: "selection",
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
          title: this.$t("m.i.billInfo.billOrigin"),
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let type = "";
            if (!!params.row.billId) {
              type = "billId";
            } else {
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
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          ellipsis: false,
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
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          ellipsis: false,
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
          ellipsis: false,
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
          ellipsis: false,
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
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptBankNo"),
          key: 'acptBankNo',
          hiddenCol: false,
        }
      ],
      eColumnsHasCommit: [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let type = "";
            if (!!params.row.billId) {
              type = "billId";
            } else {
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
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          ellipsis: false,
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
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          ellipsis: false,
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
          ellipsis: false,
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
          ellipsis: false,
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
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptBankNo"),
          key: 'acptBankNo',
          hiddenCol: false,
        }
      ],
      currentSelectList: [],
      signAgreementWin: false,
      signParams: {},
      ioPoolPickBillWin: false,
      ioPoolPickBillWinWithEbank: false,
      ioPoolPickBillParams: {},
      //记录批次是否已保存
      hadBatchSave: false,
      showBillInfoWin: false,
      billId: "",
      billNo: "",
      billRangeStart: "",
      billRangeEnd: "",
      //风险信息窗口
      riskCheckWin: false,
      riskParams: {},
      hasSelect: false,
      //新增时批次下有数据，票据种类不可更改
      isReadOnly: false,
      param: null,
      rows: null,
      tempShowExcelTemplateWin: false,
      submitType: "",
      //票据批次界面-区分新增/修改操作
      batchOptType: "",
      //调整交易金额窗口
      editTransAmtWin: false,
      hasAmtDisabled: true,
      noRollBackDisabled: false,
      currentSelectBillList: [],
        pickBillDtoList: [{
          billId: "",
          hldrId: "",
        }],
    };
  },
  props: {
    outPoolAddOrEditWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    batchParams: {
      type: Object,
      default: {
        batchType: "",
        funcNo: "",
        isCommit: "",
        billClass: "",
        dictMap: new Map(),
        billClassList: [],
        billTypeList: [],
        queryTypeList: [],
        YonList: [],
        outPoolBatchId: "",
        brchNo: "",
        showEbankPickBill: "",
      }
    }
  },
  computed: {
    tempOutPoolAddOrEditWin: {
      get() {
        return this.outPoolAddOrEditWin;
      },
      set() {
      }
    }
  },
  watch: {
    outPoolAddOrEditWin(val) {
      if (val) {
        this.dataUrl = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_pagingQueryOutPoolBill" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_pagingQueryOutPoolBill";
        this.$nextTick(() => {
          this.batchOptType = this.batchParams.batchType;
          this.batchParams.getWayList = this.batchParams.getWayList.filter(item => item.key === "1" || item.key === "5");
          this.batchId = this.batchParams.outPoolBatchId;
          this.formItem.batchId = this.batchId;
          this.formItem.funcNo = this.batchParams.funcNo;
          this.formItem.billClass = this.batchParams.billClass;
          this.addOrEditForm.billClass = this.batchParams.billClass;
          if (this.batchParams.isCommit === 'hasCommit' && this.batchParams.billClass === "ME02") {
            this.columns = this.eColumnsHasCommit;
            this.$refs.datagrid.createShowCol(this.columns);
          } else if (this.batchParams.isCommit === 'hasCommit' && this.batchParams.billClass === "ME01") {
            this.columns = this.columnsHasCommit;
            this.$refs.datagrid.createShowCol(this.columns);
          } else if (this.batchParams.isCommit === 'noCommit' && this.batchParams.billClass === "ME02") {
            this.columns = this.eColumnsNoCommit;
            this.$refs.datagrid.createShowCol(this.columns);
          } else {
            this.columns = this.columnsNoCommit;
            this.$refs.datagrid.createShowCol(this.columns);
          }
          if (this.batchParams.batchType === "modify") {
            this.hadBatchSave = true;
            this.queryObjById();
            this.handleSearch();
          }
          if (this.batchParams.batchType === "add") {
            this.hadBatchSave = false;
            this.$refs.datagrid.tData = [];
            this.addOrEditForm.outPoolDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
          }
          this.hasSelect = false;
          this.currentSelectList = [];
          this.$refs.datagrid.selectIds = [];
          this.$refs.datagrid.selects = [];
        });
      }
    },
    batchId(val) {
      this.batchId = val;
    }
  },
  methods: {
    //修改时根据票据批次Id查询票据批次信息
    queryObjById() {
      let params = {id: this.batchId, billClass: this.batchParams.billClass, funcNo: this.batchParams.funcNo};
      let url = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_findOutPoolBatchById" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_findOutPoolBatchById";
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let obj = res.data.retData;
            this.addOrEditForm.id = obj.id;
            this.addOrEditForm.legalNo = obj.legalNo;
            this.addOrEditForm.agreementNo = obj.agreementNo;
            this.addOrEditForm.custNo = obj.custNo;
            this.addOrEditForm.custName = obj.custName;
            this.addOrEditForm.custAcctNo = obj.custAcctNo;
            this.addOrEditForm.getWay = obj.getWay;
            if (!!obj.outPoolDt) {
              this.addOrEditForm.outPoolDt = this.$moment(obj.outPoolDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            this.addOrEditForm.billClass = obj.billClass;
            this.addOrEditForm.billType = obj.billType;
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    //关闭弹窗
    handleClose() {
      this.$refs.addOrEditForm.resetFields();
      this.addOrEditForm.id = "";
      this.addOrEditForm.legalNo = "";
      this.hadBatchSave = false;
      this.isReadOnly = false;
      this.$refs.datagrid.$refs.gridPage.clearElevator();
      this.$emit("outPoolAddOrEditWinClose", "");
    },
    handleOutPoolDtChange(value) {
      this.addOrEditForm.outPoolDt = value.replace(/-/g, "");
    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    //表单查询
    handleSearch(pageNo) {
      this.currentSelectList = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      if (this.$refs.datagrid.tData.length <= 0) {
        this.isReadOnly = false;
      }
    },
    //行选中
    handleSelectClick(arr) {
      this.currentSelectList = arr;
    },
    //查询签约信息
    queryAgreementNo() {
      let url = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_pagingBillAgreement" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_pagingBillAgreement";
      this.signParams.agreementUrl = url;
      this.signParams.brchNo = this.batchParams.brchNo;
      this.signAgreementWin = true;
    },
    //赋值
    signAgreementSubmit(info) {
      this.addOrEditForm.agreementNo = info.agreementNo;
      this.addOrEditForm.custName = info.custName;
      this.addOrEditForm.custNo = info.custNo;
      this.addOrEditForm.custAcctNo = info.custAcctNo;
      this.signAgreementWin = false;
    },
    //关闭
    signAgreementWinClose() {
      this.signParams = {};
      this.signAgreementWin = false;
    },
    //保存批次信息
    formSave() {
      this.$refs["addOrEditForm"].validate(valid => {
        if (valid) {
          this.addOrEditForm.outPoolDt = this.addOrEditForm.outPoolDt.replace(/-/g, "");
          if (this.addOrEditForm.outPoolDt < window.sessionStorage.getItem("workDate")) {
            this.$msgTip.info(this, {info: "出池日期必须大于或等于当前营业日期"});
            return;
          }
          let url = "";
          if (this.batchParams.billClass === "ME01") {
            url = this.batchParams.batchType === "add" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_addOutPoolBatch" : "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_editOutPoolBatch";
            if (this.hadBatchSave) {
              url = "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_editOutPoolBatch";
            }
          } else if (this.batchParams.billClass === "ME02") {
            url = this.batchParams.batchType === "add" ? "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_addOutPoolBatch" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_editOutPoolBatch";
            if (this.hadBatchSave) {
              url = "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_editOutPoolBatch";
            }
          } else {
            this.$msgTip.info(this, {info: "票据介质不正确，请检查！"});
            return;
          }
          post(this.addOrEditForm, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                if (this.batchParams.batchType === "add" && this.hadBatchSave === false) {
                  this.batchId = res.data.retData;
                  this.formItem.batchId = res.data.retData;
                  this.addOrEditForm.id = res.data.retData;
                }
                this.handleSearch();
                this.hadBatchSave = true;
                this.batchParams.batchType = "modify";
                this.batchOptType = this.batchParams.batchType;
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      });
    },
    //弹出挑票窗口
    ioPoolPickBill() {
      if (this.batchParams.batchType === "add") {
        if (this.hadBatchSave) {
          this.jumpToPickBillWin();
        } else {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
      }
      if (this.batchParams.batchType === "modify") {
        this.jumpToPickBillWin();
      }
    },

    //弹出挑票窗口 网银来源挑票
    ioPoolPickBillByEbank() {
      if (this.batchParams.batchType === "add") {
        if (this.hadBatchSave) {
          this.jumpToPickBillWinWithEbank();
        } else {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
      }
      if (this.batchParams.batchType === "modify") {
        this.jumpToPickBillWinWithEbank();
      }
    },

    //跳转到挑票界面
    jumpToPickBillWin() {
      this.composePickParams();
      this.ioPoolPickBillParams.dataSource = "1";
      this.ioPoolPickBillWin = true;
    },

    composePickParams() {
      this.ioPoolPickBillParams.batchId = this.batchId;
      this.ioPoolPickBillParams.dictMap = this.batchParams.dictMap;
      this.ioPoolPickBillParams.billType = this.addOrEditForm.billType;
      this.ioPoolPickBillParams.billClass = this.batchParams.billClass;
      this.ioPoolPickBillParams.custNo = this.addOrEditForm.custNo;
      this.ioPoolPickBillParams.custAcctNo = this.addOrEditForm.custAcctNo;
      this.ioPoolPickBillParams.pickBillType = "outPool";
      let url = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_pagingQueryOutPoolUnsignBills" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_pagingQueryOutPoolUnsignBills";
      this.ioPoolPickBillParams.pickBillUrl = url;
    },

    //跳转到挑票界面
    jumpToPickBillWinWithEbank() {
      this.composePickParams();
      // 渠道网银发起
      this.ioPoolPickBillParams.dataSource = "2";
      this.ioPoolPickBillWinWithEbank = true;
    },

    //挑票界面根据弹框所选票进行赋值
    ioPoolPickBillChange(info) {
      let pickBillDtoList = [];
      for (let i = 0; i < info.length; i++) {
          pickBillDtoList.push({billId: info[i].billId, hldrId: info[i].hldrId,transId: info[i].transId});
      }
      let url = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_pickOutPoolBillInfo" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_pickOutPoolBillInfo";
        post({batchId: this.batchId,dataSource: this.ioPoolPickBillParams.dataSource, pickBillDtoList: pickBillDtoList}, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.ioPoolPickBillParams = {};
            this.ioPoolPickBillWin = false;
            this.ioPoolPickBillWinWithEbank = false;
            this.isReadOnly = true;
            this.handleSearch();
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    //挑票界面取消按钮
    ioPoolPickBillWinClose() {
      this.ioPoolPickBillParams = {};
      this.ioPoolPickBillWin = false;
    },

    //挑票界面取消按钮
    ioPoolPickBillWinWithEbankClose() {
      this.ioPoolPickBillParams = {};
      this.ioPoolPickBillWinWithEbank = false;
    },
    //批量导出
    infoExport() {
      if (this.$refs.datagrid.selectIds.length !== 0) {
        this.rows = this.$refs.datagrid.selectIds.length;
      } else {
        this.rows = this.$refs.datagrid.total;
      }
      if (this.batchId === "") {
        this.$msgTip.info(this, {info: "请先保存批次"});
        return;
      }
      this.param = "eOutPoolListExportInfo";
      this.tempShowExcelTemplateWin = true;
    },
    showExcelTemplateWinClose() {
      this.tempShowExcelTemplateWin = false;
    },
    exportForm(field, exportType) {
      //exportType: 0-同步 1-异步
      let exportUrl = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_exportExcel" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_exportExcel";
      let url = window.LOCAL_CONFIG.API_HOME + exportUrl;
      if (exportType === "1") {
        let params = null;
        params = {
          funcNo: this.formItem.funcNo,
          billClass: this.formItem.billClass,
          billIds: this.$refs.datagrid.selectIds,
          batchId: this.formItem.batchId,
          field: field,
          exportType: exportType,
          excelName: this.param,
        };
        post(params, url).then(res => {
          if (res.status === 200 && res.data === null) {
            this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          } else if (res.status === 200 && res.data === "") {
            this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          } else {
            this.$msgTip.error(this, {info: "异步导出失败"});
          }
        });
      } else {
        let form = document.createElement("form");
        for (let obj in this.formItem) {
          if (this.formItem.hasOwnProperty(obj)) {
            let input = document.createElement("input");
            input.type = "text";
            input.name = obj;
            input.value = this.formItem[obj];
            form.appendChild(input);
          }
        }
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        if (this.$refs.datagrid.total > 0) {
          let input1 = document.createElement("input");
          input1.type = "text";
          input1.name = "pageSize";
          input1.value = this.$refs.datagrid.total;
          form.appendChild(input1);
        }
        if (this.$refs.datagrid.selectIds.length !== 0) {
          let input2 = document.createElement("input");
          input2.type = "text";
          input2.name = "billIds";
          input2.value = this.$refs.datagrid.selectIds;
          form.appendChild(input2);
        }
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
        input5.value = this.param;
        form.appendChild(input5);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    },
    //删除
    infoDelete() {
      this.currentSelectList = this.$refs.datagrid.selects;
      if (this.currentSelectList.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: this.$t("m.i.common.isConfirmDelete") + "?",
        onOk: () => {
          this.handleDeleteDetail();
        }
      });
    },
    handleDeleteDetail() {
      let outPoolIds = this.$refs.datagrid.selectIds;
      let url = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_deleteOutPoolBill" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_deleteOutPoolBill";
      post({batchId: this.batchId, listIds: outPoolIds.join(",")}, url).then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    //提交
    submit(type) {
      this.submitType = type;
      if (type === "select") {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let outPoolIds = this.$refs.datagrid.selectIds;
        let params = {batchId: this.batchId, listIds: outPoolIds.join(",")};
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交申请吗?",
          onOk: () => {
            this.handleSubmit(params);
          }
        });
        // this.getRiskBillNo(params);
      } else if (type === "batch") {
        if (this.batchId === "") {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
        if (this.$refs.datagrid.tData.length === 0) {
          this.$msgTip.info(this, {info: "该批次下无数据"});
          return;
        }
        let params = {batchId: this.batchId};
        // this.getRiskBillNo(params);
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交申请吗?",
          onOk: () => {
            this.handleSubmit(params);
          }
        });
      }
    },
    //提交前先调用风险检查接口
    getRiskBillNo(params) {
      let url = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_getRiskBillNo" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_getRiskBillNo";
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let data = res.data.retData;
          if (retCode === "000000") {
            if (Object.keys(data).length > 0) {
              this.riskCheckWin = true;
              this.riskParams.gridDatas = data;
              this.riskParams.submitParams = params;
              this.riskParams.YonList = this.batchParams.YonList;
            } else {
              this.$hMsgBox.confirm({
                title: this.$t("m.i.common.confirm"),
                content: "确定提交申请吗?",
                onOk: () => {
                  this.handleSubmit(params);
                }
              });
            }
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    handleSubmit(params, isRiskCkeck) {
      let url = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_submitFlow" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_submitFlow";
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            if (this.submitType === 'select') {
              if (this.$refs.datagrid.total === this.$refs.datagrid.selects.length) {
                this.handleClose();
              } else {
                this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
              }
            } else if (this.submitType === 'batch') {
              this.handleClose();
            }
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          }
          if (isRiskCkeck) {
            this.riskCheckWinClose();
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    //撤销
    infoCancel() {
      // if (this.currentSelectList.length === 0) {
      //   this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
      //   return;
      // }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定撤销申请吗？",
        onOk: () => {
          this.handleCancelApplyBatch();
        }
      });
    },
    //入池确认书打印
    inPoolBillPrint() {
      if (this.batchId === "") {
        this.$msgTip.info(this, {info: "请先保存批次"});
        return;
      }
      let list = this.$refs.datagrid.selects;
      if (list.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      this.assemblePrsttnBillParams(list);
    },
    assemblePrsttnBillParams(vocherData) {
      let bodyStr = "";
      for (let i = 0; i < vocherData.length; i++) {
        let printData = {};
        printData.billOrigin = !!vocherData[i].billOrigin ? this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", vocherData[i].billOrigin) : "";
        printData.billNo = vocherData[i].billNo;
        printData.billRange = formatBillRange(vocherData[i].billOrigin, vocherData[i].billRangeStart, vocherData[i].billRangeEnd);
        printData.flowStatusName = !!vocherData[i].flowStatusName ? vocherData[i].flowStatusName : "";
        printData.billType = !!vocherData[i].billType ? this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", vocherData[i].billType) : "";
        printData.remitDt = !!vocherData[i].remitDt ? this.$moment(vocherData[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
        printData.dueDt = !!vocherData[i].dueDt ? this.$moment(vocherData[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
        printData.billMoney = formatNumber(vocherData[i].billMoney, 2, ",");
        printData.drwrName = vocherData[i].drwrName;
        printData.drwrAcctNo = vocherData[i].drwrAcctNo;
        printData.pyeeName = vocherData[i].pyeeName;
        printData.pyeeAcctNo = vocherData[i].pyeeAcctNo;
        printData.acptName = vocherData[i].acptName;
        printData.flowNo = vocherData[i].acctFlowId;
        printData.printObj = JSON.stringify(vocherData[i]);

        bodyStr += "<tr>";
        bodyStr += "<td class='ta-c'>" + (1 + i) + "</td>";
        bodyStr += "<td>" + printData.billOrigin + "</td>";
        bodyStr += "<td>" + printData.billNo + "</td>";
        bodyStr += "<td>" + printData.billRange + "</td>";
        bodyStr += "<td>" + printData.flowStatusName + "</td>";
        bodyStr += "<td>" + printData.billType + "</td>";
        bodyStr += "<td>" + printData.remitDt + "</td>";
        bodyStr += "<td>" + printData.dueDt + "</td>";
        bodyStr += "<td>" + printData.billMoney + "</td>";
        bodyStr += "<td>" + printData.drwrName + "</td>";
        bodyStr += "<td>" + printData.drwrAcctNo + "</td>";
        bodyStr += "<td>" + printData.pyeeName + "</td>";
        bodyStr += "<td>" + printData.acptName + "</td>";
        bodyStr += "</tr>";
      }
      let headHtml = `<div style="text-align:center;" ref="headHtml">
          <div style="text-align:center;font-size:18px;font-weight:bold;">票据池确认清单</div>
           <div style="text-align:left;font-size:14px;font-weight:bold;">出池：√</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户名称：${this.addOrEditForm.custName}</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户账号：${this.addOrEditForm.custAcctNo}</div>
        </div>`;
      let footerHtml = `<div style="font-size:14px;font-weight:bold;display:-webkit-box;display:flex;justify-content:flex-end;">
          <label style="padding-right:20%">收款行:</label>
          <label style="padding-right:20%">客户:</label>
        </div>`;
      let bodyHtml = `<div class="list-table-box"><table class="list-table">
          <thead>
            <tr>
              <th class="ta-c"><b>序号</b></th>
              <th>票据来源</th>
              <th>票据(包)号码</th>
              <th>子票区间</th>
              <th>流程状态</th>
              <th>票据种类</th>
              <th>出票日期</th>
              <th>汇票到期日</th>
              <th>票据(包)金额(元)</th>
              <th>出票人全称</th>
              <th>出票人账号</th>
              <th>收款人全称</th>
              <th>承兑人全称</th>
            </tr>
          </thead>
          <tbody>${bodyStr}</tbody>
        </table>
      </div>`;
      this.$print.printListHtm(this, headHtml, bodyHtml, {
        bodyTop: "20%", bodyLeft: "1%", bodyWidth: "99%", bodyHeight: "75%"
      }, footerHtml);
    },
    handleCancelApplyBatch() {
      // let list = this.currentSelectList;
      // let outPoolIds = [];
      // for (let i = 0; i < list.length; i++) {
      //   outPoolIds.push(list[i].id);
      // }
      let url = this.batchParams.billClass === "ME01" ? "/pl/iopool/outpool/paper/pOutPoolApplyMain/func_cancelFlow" : "/pl/iopool/outpool/elec/eOutPoolApplyMain/func_cancelFlow";
      post({batchId: this.batchId}, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.handleClose();
            this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    showBillInfo(info, type) {
      this.billId = "";
      this.billNo = "";
      if (type === "billId") {
        this.billId = info.billId;
      } else {
        this.billNo = info.billNo;
      }
      this.billRangeStart = info.billRangeStart;
      this.billRangeEnd = info.billRangeEnd;
      this.showBillInfoWin = true;
    },
    riskCheckWinClose() {
      this.riskCheckWin = false;
      this.riskParams = {};
    },
    riskCheckSubmit(info) {
      this.handleSubmit(info, true);
    },
    /* 修改交易金额点击事件 */
    updateTransAmtBtn() {
      this.currentSelectBillList = this.$refs.datagrid.selects;
      if (this.currentSelectBillList.length == 1) {
        this.editTransAmtWin = true;
      } else if (this.currentSelectBillList.length == 0) {
        this.$msgTip.error(this, {info: this.$t("m.i.common.chooseOneData")});
        return false;
      } else {
        this.$msgTip.error(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return false;
      }
      this.splitMoneyForm.billNo = this.currentSelectBillList[0].billNo;
      this.splitMoneyForm.billPackageMoney = this.currentSelectBillList[0].originBillMoney;
      this.splitMoneyForm.transAmt = this.currentSelectBillList[0].billMoney;
      this.splitMoneyForm.billOrigin = this.currentSelectBillList[0].billOrigin;
      this.splitMoneyForm.billRangeStart = this.currentSelectBillList[0].billRangeStart;
      this.splitMoneyForm.billRangeEnd = this.currentSelectBillList[0].billRangeEnd;
    },
    editTransAmtClose() {
      this.editTransAmtWin = false;
      this.addForm.transAmt = null;
    },
    cancelSplit() {
      this.splitMoneyForm.batchId = this.batchId;
      this.currentSelectBillList = this.$refs.datagrid.selects;
      let list = this.currentSelectBillList;
      this.splitMoneyForm.listIds = "";
      for (let i = 0; i < list.length; i++) {
        this.splitMoneyForm.listIds += list[i].id;
        if (i < list.length - 1) {
          this.splitMoneyForm.listIds += ",";
        }
      }
      post(this.splitMoneyForm, "/pl/iopool/outpool/elec/eOutPoolEndorseMain/func_cancelAdjustTransAmt").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode == "000000") {
            this.currentSelectBillList = [];
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.splitMoneyForm.listIds = null;
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.editTransAmtWin = false;
          } else {
            this.splitMoneyForm.listIds = null;
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    editTransAmSubmit() {
      this.$refs["addForm2"].validate(valid => {
        if (valid) {
          if (!(this.splitMoneyForm.billOrigin == "CS02" || this.splitMoneyForm.billOrigin == "CS03")) {
            this.$msgTip.error(this, {info: "只有票据来源为金融机构票据或供应链票据可以拆包"});
            return;
          }
          if (this.splitMoneyForm.billRangeEnd == 0) {
            this.$msgTip.error(this, {info: "该票为零票，不能进行拆包"});
            return;
          }
          if (this.splitMoneyForm.billRangeStart == this.splitMoneyForm.billRangeEnd){
            this.$msgTip.error(this, {info: "票据包子票区间不可拆"});
            return;
          }
          let billMoney = this.splitMoneyForm.billPackageMoney;
          let transAmt = this.splitMoneyForm.transAmt;
          if (transAmt <= 0) {
            this.$msgTip.error(this, {info: "交易金额输入非法"});
            return;
          }
          if (billMoney == transAmt) {
            this.$msgTip.error(this, {info: "交易金额和票据包金额相同，不需要拆包"});
            return;
          }

          this.splitMoneyForm.batchId = this.batchId;
          this.currentSelectBillList = this.$refs.datagrid.selects;
          let list = this.currentSelectBillList;
          this.splitMoneyForm.listIds = "";
          for (let i = 0; i < list.length; i++) {
            this.splitMoneyForm.listIds += list[i].id;
            if (i < list.length - 1) {
              this.splitMoneyForm.listIds += ",";
            }
          }
          post(this.splitMoneyForm, "/pl/iopool/outpool/elec/eOutPoolEndorseMain/func_adjustTransAmt").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.editTransAmtWin = false;
                this.$msgTip.success(this, {info: this.$t("m.i.common.modifySuccess")});
                this.currentSelectBillList = [];
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
                this.splitMoneyForm.listIds = null;
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              } else {
                this.splitMoneyForm.listIds = null;
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                this.$msgTip.error(this, {info: this.$t("m.i.common.modifyFailed") + ":" + res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      });
    },
    onCurrentBillChange(arr, selectInx) {
      this.currentSelectList = arr;
      if (this.currentSelectList.length == 0 || this.currentSelectList.length > 1) {
        this.hasAmtDisabled = true;
      } else {
        let billClass = this.currentSelectList[0].billClass;
        let billOrigin = this.currentSelectList[0].billOrigin;
        let billRangeStart = this.currentSelectList[0].billRangeStart;
        let billRangeEnd = this.currentSelectList[0].billRangeEnd;
        if (billClass == "ME01" || billOrigin == "CS01") {
          this.hasAmtDisabled = true;
          return;
        }
        if (billRangeEnd == 0) {
          this.hasAmtDisabled = true;
          return;
        }
        if (billRangeEnd == billRangeStart) {
          this.hasAmtDisabled = true;
          return;
        }
        this.hasAmtDisabled = false;
      }
    },
  },
};
</script>

<style scoped>

</style>
