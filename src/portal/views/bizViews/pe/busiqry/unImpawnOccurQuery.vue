<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.transBrchNoList" :label="$t('m.i.common.brchName')" prop="transBrchNoList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.transBrchNoList" :brchName.sync="formItem.transBrchNameList"></show-branch>

                <h-form-item :label="$t('m.i.pe.applSignFlag')" prop="applSignFlag">
                  <h-select v-model="formItem.applSignFlag" placeholder="" @on-change="showBrch" :clearable="false">
                    <h-option v-for="item in applSignFlagList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo"></h-input>
                </h-form-item>

                <show-cpes-branch :label="$t('m.i.pe.plegdorBrchName')" v-if="isShowBrch"
                                  :brchCode.sync="formItem.plegdorBrchCode"  :cpesBrchName.sync="formItem.plegdorBrchName"
                                  @cpesBranchChange="brchNameChange($event,'plegdorBrchName')"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="plegdorBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <show-cpes-branch  :label="$t('m.i.pe.pledgeeBrchName')" v-if="!isShowBrch"
                                   :brchCode.sync="formItem.pledgeeBrchCode"  :cpesBrchName.sync="formItem.pledgeeBrchName"
                                   @cpesBranchChange="brchNameChange($event,'pledgeeBrchName')"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="pledgeeBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.reverseBillNo"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
                  <h-input v-model="formItem.acptName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" class="h-form-long-label">
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
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.impawnApplDt')" prop="impawnApplDt">
                  <h-date-picker :value="unImpawnDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleImpawnApplDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <h-form-item :label="$t('m.i.pe.sumBillPackageMoney')" class="h-form-long-label">
                  <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.total')">
                  <h-input v-model="total" placeholder="" readonly></h-input>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="showColumns"
            :url="queryUrl"
            :bindForm="formItem"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            hasPage
            showListCkeckBox
            :hasSelect="false"
            :rowSelect="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryImpawnOccurBatch()">{{$t("m.i.pe.queryAcptOccurBatch")}}</h-button>
              <h-button type="primary" @click="queryImpawnOccurBill">{{$t("m.i.pe.queryAcptOccurBill")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('batch')"
                        :disabled="this.ifDisabledExport">{{$t("m.i.pe.arrayExport")}}
              </h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('bill')"
                        :disabled="!this.ifDisabledExport">{{$t("m.i.pe.flowExport")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="unImpawnTrackQueryWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="unImpawnTrackQueryWinClose" :maximize="true" @on-maximize="onMaximize" :mask-closable="false"
               :footerHide="true">
      <p slot="header">
        <span v-if="type=='view'">查看批次明细信息</span>
      </p>
      <h-panel>
        <h-form :model="viewForm" :label-width="120" ref="viewForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
            <h-select v-model="viewForm.billType" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
            <h-select v-model="viewForm.billClass" readonly>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.pledgeeName')" prop="brchName">
            <h-input v-model="viewForm.brchName" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.pledgeeBrchCode')" prop="applBrchCode">
            <h-input v-model="viewForm.applBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.plegdorName')" prop="custName">
            <h-input v-model="viewForm.custName" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.plegdorBrchCode')" prop="custBrchCode">
            <h-input v-model="viewForm.custBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.impawnApplDt')" prop="unImpawnDt">
            <h-date-picker v-model="viewForm.unImpawnDt" :maxlength=60 type="date" readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-model="viewForm.custMgrNo" :maxlength=60 readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid
        :columns="unImpawnBill.billColumns"
        highlight-row
        :bindForm="formItem"
        :gridData="billList"
        :row-select="true"
        :auto-load="false"
        has-select="false"
        @on-page-change="handlePage"
        ref="datagridbill">
      </h-datagrid>
    </h-msg-box>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "unImpawnOccurQuery",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      //ShowBranch: () => import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
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
          title:  this.$t('m.i.pe.impawnApplDt'),
          key: "unImpawnDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let unImpawnDt = params.row.unImpawnDt ? this.$moment(params.row.unImpawnDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
            return h("span", unImpawnDt);
          }
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
                  this.showBillList(params.row);
                }
              }
            }, params.row.batchNo);
          }
        },
        {
          title: this.$t("m.i.pe.applSignFlag"),
          key: "trDir",
          hiddenCol: false,
          render: (h, params) => {
            let trDir = params.row.trDir;
            if (trDir != null && trDir !== "") {
              switch (trDir) {
                case "IM02":
                  trDir = "质权人";break;
                case "IM01":
                  trDir = "出质人";break;
              }
            }
            return h("span", trDir);
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billClass"),
          key: "billClass",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "applBrchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.custBrchCode'),
          key: "custBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.totalAmt"),
          key: "sumMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let sumMoney = formatNumber(params.row.sumMoney, 2, ",");
            return h("span", {
              domProps: {
                title: sumMoney
              }
            }, sumMoney);
          }
        },
        {
          title: this.$t("m.i.pe.total"),
          key: "sumCount",
          hiddenCol: false
        }
      ];
      return {
        formItem: {
          transBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          applSignFlag: "",
          plegdorBrchName: "",
          plegdorBrchCode: "",
          pledgeeBrchCode: "",
          pledgeeBrchName: "",
          billType: "",
          billClass: "",
          billOrigin: "",
          billNo: "",
          batchNo: "",
          acptBankName: "",
          acptName: "",
          minRemitDt: "",
          maxRemitDt: "",
          minUnImpawnDt: "",
          maxUnImpawnDt: "",
          minDueDt: "",
          maxDueDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          minBillRangeStart: '',
          maxBillRangeEnd: ''
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
            title: this.$t("m.i.pe.impawnApplDt"),
            key: "unImpawnDt",
            hiddenCol: false,
            render: (h, params) => {
              let unImpawnDt = params.row.unImpawnDt ?this.$moment(params.row.unImpawnDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
              return h("span", unImpawnDt);
            }
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
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
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),   //子票区间
            key: "billRange",
            ellipsis: false,
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
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
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
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
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          }
        ],
        applSignFlagList: [
          {
            key: "1",
            value: "出质人"
          },
          {
            key: "2",
            value: "质权人"
          }
        ],
        viewForm: {
          billType: "",
          billClass: "",
          custName: "",
          custBrchCode: "",
          brchName: "",
          applBrchCode: "",
          unImpawnDt: "",
          custMgrNo: ""
        },
        isShowBrch: false,
        billTypeList: [],
        billClassList: [],
        remitDt: [],
        dueDt: [],
        impawnApplDt: [],
        dictMap: new Map(),
        billId: "",
        type: "",
        //是否显示更多查询项
        ifShowMore: false,
        showBillInfoWin: false,
        unImpawnTrackQueryWin: false,
        readonly: false,
        batchId: "",
        tempShowExcelTemplateWin: false,
        queryUrl: "/pb/trust/unImpawn/unImpawnOccurQuery/func_findOcucurUnImpawnBatch",
        ifDisabledExport: false,
        showColumns: this.deepClone(batchColumns),
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        selectExportType: "",
        unImpawnBill: {
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
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row);
                    }
                  }
                }, params.row.billNo);
              }
            },
            {
              title: this.$t("m.i.billInfo.billRange"),   //子票区间
              key: "billRange",
              ellipsis: false,
              hiddenCol: false,
              render:(h,params) => {
                let billOrigin = params.row.billOrigin;
                let billRangeStart = params.row.billRangeStart;
                let billRangeEnd = params.row.billRangeEnd;
                return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
              }
            },
            {
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.billClass"),
              key: "billClass",
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
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
              title: this.$t("m.i.billInfo.dueDt"),
              key: "dueDt",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dueDt);
              }
            },
            {
              title: this.$t("m.i.billInfo.acptBankName"),
              key: "acptBankName",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.pe.unImpawnRemark"),
              key: "respRemark",
              hiddenCol: false
            }
          ]
        },
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        billOriginList: [],
        acctStatusList: [],
        billStatusList: [],
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,AcctFlag,BarterTrustStatus,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.acctStatusList = res.get("AcctFlag");
        this.billStatusList = res.get("BarterTrustStatus");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      onMaximize() {
        this.$refs.datagridbill.$refs.gridContent.handleResize();
      },
      // 分页事件
      handlePage(pageNo, pageSize) {
        let obj = Object.assign({}, this.formItem, { batchId: this.batchId }, { pageNo: pageNo, pageSize: pageSize });
        this.queryBillList(obj);
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      // 查询批次下明细
      queryBillList(obj) {
        post(obj, "/pb/trust/unImpawn/unImpawnOccurQuery/func_queryUnImpawnBillByBatchId").then(res => {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.billList = res.data.retData;
          }
        });
      },
      showBrch(value) {
        //出质人
        if (value === "1") {
          this.isShowBrch = false;
          this.formItem.plegdorBrchCode = "";
          this.formItem.plegdorBrchName = "";
        }
        //质权人
        else if (value === "2") {
          this.isShowBrch = true;
          this.formItem.pledgeeBrchCode = "";
          this.formItem.pledgeeBrchName = "";
        }
      },
      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.url = this.queryUrl;
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.pledgeeBrchName = "";
        this.formItem.pledgeeBrchCode = "";
        this.formItem.plegdorBrchName = "";
        this.formItem.plegdorBrchCode = "";
        this.formItem.applSignFlag = "";
        this.formItem.billType = "";
        this.formItem.billClass = "";
        this.formItem.reverseBillNo = "";
        this.formItem.acptBankName = "";
        this.formItem.batchNo = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minBillRangeStart = "";
        this.formItem.maxBillRangeEnd = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minUnImpawnDt = "";
        this.formItem.maxUnImpawnDt = "";
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.remitDt = [];
        this.dueDt = [];
        this.unImpawnDt = [];
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
      handleImpawnApplDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minUnImpawnDt = arr[0].replace(/-/g, "");
          this.formItem.maxUnImpawnDt = arr[1].replace(/-/g, "");
          this.unImpawnDt = [arr[0], arr[1]];
        } else {
          this.formItem.minUnImpawnDt = "";
          this.formItem.maxUnImpawnDt = "";
          this.unImpawnDt = [];
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
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      brchNameChange(info,type){
        if(info.length>0){
          if(type==="plegdorBrchName"){
            this.formItem.pledgeeBrchName = "";
            this.formItem.pledgeeBrchCode = "";
          }else if(type==="pledgeeBrchName"){
            this.formItem.plegdorBrchName = "";
            this.formItem.plegdorBrchCode = "";
          }
        }
      },
      queryImpawnOccurBatch() {
        this.$refs.datagrid.url = null;
        this.queryUrl = "/pb/trust/unImpawn/unImpawnOccurQuery/func_findOcucurUnImpawnBatch";
        this.ifDisabledExport = false;
        this.showColumns = this.deepClone(this.batchColumns);
        this.formSearch();
      },
      queryImpawnOccurBill() {
        this.$refs.datagrid.url = null;
        this.queryUrl = "/pb/trust/unImpawn/unImpawnOccurQuery/func_findOccurUnImpawnBill";
        this.ifDisabledExport = true;
        this.showColumns = this.deepClone(this.billColumns);
        this.formSearch();
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      showBillList(list) {
        this.type = "view";
        this.viewForm.billType = list.billType;
        this.viewForm.billClass = list.billClass;
        if (list.unImpawnDt) {
          this.viewForm.unImpawnDt = this.$moment(list.unImpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.viewForm.unImpawnDt = list.unImpawnDt;
        }
        this.viewForm.custMgrNo = list.custMgrNo;
        if ("IM02" === list.trDir) {
          this.viewForm.custName = list.custName;
          this.viewForm.custBrchCode = list.custBrchCode;
          this.viewForm.brchName = list.applBrchName;
          this.viewForm.applBrchCode = list.applBrchCode;
        } else if ("IM01" === list.trDir) {
          this.viewForm.custName = list.applBrchName;
          this.viewForm.custBrchCode = list.applBrchCode;
          this.viewForm.brchName = list.custName;
          this.viewForm.applBrchCode = list.custBrchCode;
        }
        this.queryBillByBatchId(list.id);
        this.readonly = true;
        this.unImpawnTrackQueryWin = true;
      },
      unImpawnTrackQueryWinClose() {
        this.unImpawnTrackQueryWin = false;
      },
      // 查询票据明细
      queryBillByBatchId(id) {
        let batchId = id;
        this.batchId = id;
        let obj = Object.assign({}, this.formItem, { batchId: id }, { pageNo: 1, pageSize: 10 });
        post(obj, "/pb/trust/unImpawn/unImpawnOccurQuery/func_queryUnImpawnBillByBatchId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.billList = res.data.retData;
            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询票据明细失败";
              this.retMsg = res.data.retMsg;
              this.signWinClose();
            }
          } else {
            this.submitMsg = "查询票据明细失败";
            this.retMsg = this.$t("m.i.common.netError");
            this.signWinClose();
          }
        });
      },
      //清单导出
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "unImpawnBatchOccurExportInfo";
        } else {
          this.param = "unImpawnBillOccurExportInfo";
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
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pb/trust/unImpawn/unImpawnOccurQuery/func_exportUnImpawnBatchOccurExcel";
        } else {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pb/trust/unImpawn/unImpawnOccurQuery/func_exportUnImpawnBillOccurExcel";
        }
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          if (this.selectExportType === "batch") {
            options.params.batchIds = this.$refs.datagrid.selectIds;
          }else{
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
        this.rgstDtHisForm.acptId = id;
        this.rgstDtHisWin = true;
        this.$refs.rgstDtHisDatagrid.dataChange(1);
      },
      rgstDtHisWinClose() {
        this.rgstDtHisForm.billNo = "";
        this.rgstDtHisWin = false;
      },
    }
  };
</script>

<style scoped>

</style>
