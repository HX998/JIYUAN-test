<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div>
                  <show-branch v-model="formItem.brchName" :label="$t('m.i.common.brchName')" prop="transBrchNos" isNeedChecked
                               title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.transBrchNos" :brchName.sync="formItem.brchName"></show-branch>
                  <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                    <h-select v-model="formItem.busiType" @on-change="busiTypeWinOpen" placeholder="" :clearable="false">
                      <h-option v-for="item in busiTypeList" :value="item.value" :key="item.value">{{ item.label }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                    <h-select class="input-boder-0" v-model="formItem.billOrigin" placeholder="">
                      <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                    <h-input v-model="formItem.billNo"></h-input>
                  </h-form-item>
                  <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
                    <h-input v-model="formItem.busiBatchNo"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.applDt')" prop="applDate">
                    <h-date-picker type="daterange" autoPlacement v-model="formItem.applDate" placeholder="" format="yyyy-MM-dd"
                                   showFormat @on-change="handleApplDateChange"></h-date-picker>
                  </h-form-item>
                 <!-- <h-form-item :label="$t('m.i.pe.sendBrch')" prop="saleBrchName" v-if="isShowBrch">
                    <h-input v-model="formItem.saleBrchName" :maxlength=60 readonly
                             icon="android-search" @on-click="brchCodeWinOpen" clearable
                             @on-clear="clearVal('saleBrchName')"  ></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pe.receiveBrch')" prop="buyBrchName" v-if="!isShowBrch">
                    <h-input v-model="formItem.buyBrchName" :maxlength=60 readonly
                             icon="android-search" @on-click="brchCodeWinOpen1" clearable
                             @on-clear="clearVal('buyBrchName')" ></h-input>
                  </h-form-item>-->

                  <show-cpes-branch :label="$t('m.i.pe.sendBrch')" v-if="isShowBrch"
                                    :brchCode.sync="formItem.saleBrchCode"  :cpesBrchName.sync="formItem.saleBrchName"
                                    datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                  <show-cpes-branch  :label="$t('m.i.pe.receiveBrch')" v-if="!isShowBrch"
                                     :brchCode.sync="formItem.buyBrchCode"  :cpesBrchName.sync="formItem.buyBrchName"
                                     datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                     queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>


                  <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label">
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
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pe.sumBillPackageMoney')" class="h-form-long-label">
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
            hasPage
            :url="queryUrl"
            :bindForm="formItem"
            showListCkeckBox
            :hasSelect=false
            :rowSelect=true
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryTransferOccurBatch()">{{$t("m.i.pe.queryAcptOccurBatch")}}</h-button>
              <h-button type="primary" @click="queryTransferOccurBill()">{{$t("m.i.pe.queryAcptOccurBill")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('batch')" :disabled="this.ifDisabledExport">
                {{$t("m.i.pe.arrayExport")}}
              </h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('bill')" :disabled="!this.ifDisabledExport">
                {{$t("m.i.pe.flowExport")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改/票据明细弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" :maximize="true">
      <p slot="header">
        <span >票据明细</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
            <h-input :value="addForm.busiBatchNo" readonly></h-input>
          </h-form-item>
          <div v-if="this.busiType === '1'">
            <h-form-item :label="$t('m.i.pe.ownBrchName')" prop="saleBrchName">
              <h-input :value="addForm.saleBrchName" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pe.oppositeBrchName')" prop="buyBrchName" :required="isRequired">
              <h-input :value="addForm.buyBrchName" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pe.oppositeBrchCode')" prop="buyBrchCode">
              <h-input :value="addForm.buyBrchCode" readonly></h-input>
            </h-form-item>
          </div>
          <div v-else>
            <h-form-item :label="$t('m.i.pe.ownBrchName')" prop="buyBrchName">
              <h-input :value="addForm.buyBrchName" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pe.oppositeBrchName')" prop="saleBrchName" :required="isRequired">
              <h-input :value="addForm.saleBrchName" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pe.oppositeBrchCode')" prop="saleBrchCode">
              <h-input :value="addForm.saleBrchCode" readonly></h-input>
            </h-form-item>
          </div>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt" :required="isRequired">
            <h-date-picker :value="addForm.applDt" type="date" readonly placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.billType" readonly placeholder="">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billType" placeholder="" :readonly="readonly">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.billClass" readonly placeholder="">
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billClass" placeholder="" :readonly="readonly">
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.transferReason')" prop="transferReason" :required="isRequired">
            <h-input :value="addForm.transferReason" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="reqRemark">
            <h-input :value="addForm.reqRemark" readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid
        :columns="billColumns2"
        :bindForm="billItem"
        :hasSelect=false
        :rowSelect=true
        :auto-load="false"
        :gridData="billList"
        @on-page-change="handleBillPage"
        ref="datagridbill">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
      </div>
    </h-msg-box>

    <!--<brch-code-search :brchCodeWin="brchCodeWinBrch" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->

    <!--<brch-code-search :brchCodeWin="brchCodeWinCust" @brchCodeWinClose="brchCodeWinClose1"
                      @brchCodeChange="brchCodeChange1" optType="2"></brch-code-search>-->

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart"
                    :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferSaleOccurQuery",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */ "@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch"),
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
         title:this.$t("m.i.common.batchNo"),
          key: "busiBatchNo",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBillList(params.row);
                }
              }
            }, params.row.busiBatchNo);
          }
        },
        {
          title: this.$t('m.i.common.applDt'),
          key: "applDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.common.busiType"),
          key: "busiType",

          hiddenCol: false,
          render: (h) => {
            return h("span", this.busiType === "1" ? "转让" : "受让");
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
          title:  this.$t("m.i.pe.sendBrch"),
          key: "saleBrchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title:  this.$t("m.i.pe.receiveBrch"),
          key: "buyBrchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.totalAmt"),
          key: "totalAmt",
          sortable: true,
          hiddenCol: false,
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
          title: this.$t("m.i.pe.total"),
          key: "totalNum",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.transferReason'),
          key: "transferReason",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.remark'),
          key: "respRemark",
          hiddenCol: false
        }
      ];
      return {
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
            title: this.$t("m.i.common.batchNo"),
            key: "busiBatchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key:"billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillOrigin(this.dictMap, "BillOrigin", params.row.billOrigin);
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
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
            hiddenCol: false,
            sortable: true,
            render:(h, params) =>{
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render:(h, params) =>{
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
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
           title: this.$t("m.i.pe.discBrchCode"),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
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
        billColumns2: [
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
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",

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
           title: this.$t("m.i.pe.discBrchCode"),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
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
        formItem: {
          busiType: "1",
          billNo: "",
          busiBatchNo: "",
          applDate: "",
          minApplDt: "",
          maxApplDt: "",
          saleBrchName: "",//发起方机构名称
          saleBrchCode: "",//发起方机构代码，查询条件是利用机构代码查询
          buyBrchName: "",//接收方机构名称
          buyBrchCode: "",//接收方机构代码
          transferStatus: "",
          minBillMoney: "",
          maxBillMoney: "",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          brchName: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          transBrchNos: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          queryType: "1",//1-批次查询 2-，明细查询
        },
        addForm: {
          id: "",
          legalNo: "",
          memberId: "",
          isCommit: "",
          buyBrchName: "",
          saleBrchName: "",
          buyBrchCode: "",
          saleBrchCode: "",
          transferReason: "",
          reqRemark: "",
          transBrchNo: "",
          brchName: "",
          applBrchCode: "",
          busiBatchNo: "",
          transCtrctNo: "",
          custBrchNo: "",
          custBrchCode: "",
          custBankNo: "",
          applDt: "",
          createTime: "",
          updateTime: "",
          billNo: "",
          billClass: "",
          billType: "",
          billMoney: "",
          remitDt: "",
          dueDt: "",
          drwrName: "",
          acptName: "",
          billIdsStr: "",
          billIds: "",
          busiBatchId: "",
          batchStatus: "",
          respRemark: ""
        },
        billItem: {
          id: "",
          busiBatchId: "",
          billIdsStr: "",
          respFlag: "SU00",
        },
        //业务类型
        busiTypeList: [{
          value: "1",
          label: "转让"
        }, {
          value: "2",
          label: "受让"
        }],
        billOriginList: [],
        busiStatusList: [],
        billClassList: [],
        billId: null,
        billNo: null,
        showBillInfoWin: false,
        billRangeStart: null,
        billRangeEnd: null,
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        dueDt: "",
        applDt: "",
        busiType: "1",
        selectexport: [],
        transferStatusList: [],
        acctFlagList: [],
        readonly: false,
        ifShowMore: false,
        //brchCodeWinBrch: false,
        //brchCodeWinCust: false,
        dictMap: new Map(),
        queryUrl: "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferSaleOccurBatch",
        querySumOccurUrl: "/be/trust/transfer/transferSaleOccurQuery/func_sumTransferSaleOccur",
        ifDisabledExport: false,
        isShowBrch : false,
        showColumns: this.deepClone(batchColumns),
        sumMoney: "",
        total: "",
        //brchNoWin: false,
        selectExportType: "",
        // 是否显示新增或修改窗口
        billTypeList: [],
        addOrEditWin: false,
        type: null,
        isRequired: true,
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        busiBatchId: null
      };
    },
    methods: {
      busiTypeWinOpen(value) {
        if (!this.ifDisabledExport) {
          this.queryUrl = this.formItem.busiType === "2" ? "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferRebuyOccurBatch" : "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferSaleOccurBatch";
        }else{
          this.queryUrl = this.formItem.busiType === "2" ? "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferRebuyOccurBill" : "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferSaleOccurBill";
        }
        //转让
        if (value === "1") {
          this.isShowBrch = false;
          this.formItem.saleBrchName = "";
          this.formItem.saleBrchCode = "";
          this.formItem.buyBrchName = "";
          this.formItem.buyBrchCode = "";
        }
        //受让
        else if (value === "2") {
          this.isShowBrch = true;
          this.formItem.saleBrchName = "";
          this.formItem.saleBrchCode = "";
          this.formItem.buyBrchName = "";
          this.formItem.buyBrchCode = "";
        }
        this.getDictListByGroups("DraftTypeCode,CDMedia,TransferRebuyBillStatus,TransferSaleBillStatus,AcctFlag,BillOrigin").then(res => {
          if (this.formItem.busiType == 1) {
            //转让，即申请方
            this.transferStatusList = res.get("TransferSaleBillStatus");
          } else {
            this.transferStatusList = res.get("TransferRebuyBillStatus");
          }
          this.dictMap = res.get("map");
        });
      },

      getOccurData() {
        this.querySumOccurUrl = this.formItem.busiType === "2" ? "/be/trust/transfer/transferSaleOccurQuery/func_sumTransferRebuyOccur" : "/be/trust/transfer/transferSaleOccurQuery/func_sumTransferSaleOccur";
        post(this.formItem, this.querySumOccurUrl).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.total = data.sumNum;
                if(data.sumAmt!==null){
                  this.sumMoney = formatNumber(data.sumAmt, 2, ",");
                }else{
                  this.sumMoney="0";
                }
                if(data.totalPayInterest!==null){
                  this.totalPayInterest = formatNumber(data.totalPayInterest, 2, ",");
                }else{
                  this.totalPayInterest="0";
                }
                if(data.totalFirstSettleAmt!==null){
                  this.totalFirstSettleAmt = formatNumber(data.totalFirstSettleAmt, 2, ",");
                }else{
                  this.totalFirstSettleAmt="0";
                }
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },


      //超链接点击批次号弹出票据明细
      showBillList(list) {
        this.readonly = true;
        this.addForm.busiBatchId = list.id;//业务批次id
        this.currentSelectRow = list;
        this.addForm.id = list.id;
        this.addForm.billType = list.billType;
        this.addForm.billClass = list.billClass;
        this.addForm.busiBatchNo = list.busiBatchNo;
        this.addForm.buyBrchName = list.buyBrchName;
        this.addForm.saleBrchName = list.saleBrchName;
        this.addForm.buyBrchCode = list.buyBrchCode;
        this.addForm.saleBrchCode = list.saleBrchCode;
        this.addForm.transferReason = list.transferReason;
        this.addForm.reqRemark = list.reqRemark;
        if (list.applDt) {
          this.addForm.applDt = this.$moment(list.applDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.addForm.applDt = list.applDt;
        }

        let obj = Object.assign({}, this.billItem, { busiBatchId: list.id});
        this.queryApprovalObjById(obj);
        this.isRequired = false;
        this.readonly = true;
        this.addOrEditWin = true;
      },

      handleBillPage(pageNo, pageSize) {
        let obj = Object.assign({}, this.billItem, {
          busiBatchId: this.addForm.id,
          pageNo: pageNo,
          pageSize: pageSize,
        });
        this.queryApprovalObjById(obj);
      },

      //查询已经交批次下明细
      queryApprovalObjById(obj) {
        let url = this.busiType === "2" ? "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferRebuyBatchBill" : "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferSaleBatchBill";
        post(obj, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;
            } else {
              this.$refs.datagrid.dataChange(1);
            }
          }
        });

      },
      handleWinClose() {
        this.$refs.datagridbill.selects = [];
        this.$refs.datagridbill.selectIds = [];
        this.busiBatchId = null;
        this.addForm.id = null;
        this.$refs.addForm.resetFields();
      },
      handleApplDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
        }
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.busiType = this.formItem.busiType;
        this.$refs.datagrid.url = this.queryUrl;
        this.$refs.datagrid.dataChange(1);
        this.getOccurData();

      },
      formSearchReset() {
        this.formItem.minApplDt = "";
        this.formItem.maxApplDt = "";
        this.formItem.saleBrchCode = "";
        this.formItem.buyBrchCode = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.busiType = "1";
        this.isShowBrch = false;
        this.queryType = "1";
        this.formItem.brchName =  JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.transBrchNos =  JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.$refs.formItem.resetFields();
        this.formItem.buyBrchName = "";
        this.formItem.saleBrchName = "";
      },

      /*brchCodeWinOpen() {
        this.brchCodeWinBrch = true;
      },*/

      /*brchCodeWinOpen1() {
        this.brchCodeWinCust = true;
      },*/

      /*brchCodeWinClose() {
        this.brchCodeWinBrch = false;
      },*/

      /*brchCodeWinClose1() {
        this.brchCodeWinCust = false;
      },*/

      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        this.formItem.saleBrchName = info.brchFullNameZh;//发起方机构名称
        this.formItem.saleBrchCode = info.brchCode;//机构代码
        this.brchCodeWinBrch = false;
      },*/

      /*brchCodeChange1(info) {
        this.formItem.buyBrchName = info.brchFullNameZh;//接收方机构名称
        this.formItem.buyBrchCode = info.brchCode;
        this.brchCodeWinCust = false;
      },*/

      queryTransferOccurBatch() {
        this.formItem.queryType = "1";
        this.$refs.datagrid.url = null;
        this.queryUrl = this.formItem.busiType === "2" ? "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferRebuyOccurBatch" : "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferSaleOccurBatch";
        this.ifDisabledExport = false;
        this.showColumns = this.deepClone(this.batchColumns);
        this.formSearch();
      },

      queryTransferOccurBill() {
        this.formItem.queryType = "2";
        this.$refs.datagrid.url = null;
        this.queryUrl = this.formItem.busiType === "2" ? "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferRebuyOccurBill" : "/be/trust/transfer/transferSaleOccurQuery/func_queryTransferSaleOccurBill";
        this.ifDisabledExport = true;
        this.showColumns = this.deepClone(this.billColumns);
        this.formSearch();
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },

      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "transferOccurQueryBatch";
        } else {
          this.param = "transferOccurQueryBill";
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
        let exportUrl = null;
        if (this.formItem.busiType === "2") {
          if (this.selectExportType === "batch") {
            exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleOccurQuery/func_exportTransferRebuyOccurBatchExcel";
          } else {
            exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleOccurQuery/func_exportTransferRebuyOccurBillExcel";
          }
        } else {
          if (this.selectExportType === "batch") {
            exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleOccurQuery/func_exportTransferSaleOccurBatchExcel";
          } else {
            exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleOccurQuery/func_exportTransferSaleOccurBillExcel";
          }
        }
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          if (this.selectExportType === "batch") {
            options.params.ids = this.$refs.datagrid.selectIds;
          }else{
            options.params.billIds = this.$refs.datagrid.selectIds;
          }
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      //将后台传来的null转成空字符串
      formatTableData(arr) {
        arr.forEach(x => {
          Object.keys(x).forEach(function(key) {
            if (x[key] == null) x[key] = "";
          });
        });
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      pageShowFormatBillRange(billRangeStart, billRangeEnd) {
        if (billRangeStart == null || billRangeStart === ""
          || billRangeEnd == null || billRangeEnd === "") {
          return '-';
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0') {
          return '0';
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      },
      pageShowFormatBillOrigin(map, groupCode, key) {
        if (key == null || key === '') {
          return '-';
        }
        if (key.toString() === 'CS00') {
          return '-';
        }
        return this.getDictValueFromMap(map, groupCode, key);
      },
      /*clearVal(optType) {
       if (optType === "buyBrchName") {
          this.formItem.buyBrchName = "";
          this.formItem.buyBrchCode = "";
        } else {
         this.formItem.saleBrchName = "";
         this.formItem.saleBrchCode = "";
       }
      }*/
    },
    mounted() {
      this.getOccurData();
      this.getDictListByGroups("DraftTypeCode,CDMedia,TransferRebuyBillStatus,TransferSaleBillStatus,AcctFlag,BillOrigin").then(res => {
        if (this.formItem.busiType == 1) {
          //转让，即申请方
          this.transferStatusList = res.get("TransferSaleBillStatus");
        } else {
          this.transferStatusList = res.get("TransferRebuyBillStatus");
        }
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
