<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.be.pledgeType')" prop="applSignFlag">
                  <h-select v-model="formItem.applSignFlag" placeholder="" @on-change="showBrch" :clearable="false">
                    <h-option v-for="item in applSignFlagList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.branchType')" prop="brchType">
                  <h-select v-model="formItem.brchType" placeholder="">
                    <h-option v-for="item in brchTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.be.pledgorBrchName')" prop="plegdorBrchName" v-if="!isShowBrch">
                  <h-input v-model="formItem.plegdorBrchName" :maxlength=60 readonly
                           icon="android-search" @on-click="brchCodeWinOpen()"
                           clearable @on-clear="clearVal('plegdorBrchName')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.pawneeBrchName')" prop="pledgeeBrchName" v-if="isShowBrch">
                  <h-input v-model="formItem.pledgeeBrchName" :maxlength=60 readonly
                           icon="android-search" @on-click="brchCodeWinOpen2()"
                           clearable @on-clear="clearVal('pledgeeBrchName')"></h-input>
                </h-form-item>-->

                <show-cpes-branch  :label="$t('m.i.be.pledgorBrchName')"  v-if="!isShowBrch"
                                   :brchCode.sync="formItem.plegdorBrchCode"  :cpesBrchName.sync="formItem.plegdorBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="plegdorBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <show-cpes-branch  :label="$t('m.i.be.pawneeBrchName')"  v-if="isShowBrch"
                                   :brchCode.sync="formItem.pledgeeBrchCode"  :cpesBrchName.sync="formItem.pledgeeBrchName"
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
               <!-- <h-form-item :label="$t('m.i.billInfo.ecdsBillStatus')" prop="billStatus">
                  <h-select v-model="formItem.billStatus" placeholder="">
                    <h-option v-for="item in billStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>-->
                <!--票据来源：-->
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker type="daterange" placeholder="" :value="dueDt" format="yyyy-MM-dd" showFormat
                                 @on-change="dueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.unImpawnDt')" prop="unimpawnDt">
                  <h-date-picker type="daterange" placeholder="" :value="unimpawnDt" format="yyyy-MM-dd"
                                 showFormat @on-change="applDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.releasePledgeRespFlag')" prop="respFlag" class="h-form-long-label">
                  <h-select v-model="formItem.respFlag" placeholder="">
                    <h-option v-for="item in respFlagList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctStatus')" prop="acctStatus">
                  <h-select v-model="formItem.acctStatus" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
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
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :url="url+'/unImpawnTrackQuery/func_unImpawnTrackQuery'"
            :bindForm="formItem"
            :hasSelect=false
            :rowSelect=true
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportData')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--质押跟踪查询弹出窗-->
    <h-msg-box v-model="unImpawnTrackQueryWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="unImpawnTrackQueryWinClose" @on-maximize="onMaximize" :maximize="true" :mask-closable="false"
               :footerHide="true">
      <p slot="header">
        <span>质押解除跟踪查询明细</span>
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
          <h-form-item :label="$t('m.i.be.pledgorName')" prop="brchName">
            <h-input v-model="viewForm.brchName" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pledgorBrchCode')" prop="applBrchCode">
            <h-input v-model="viewForm.applBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pawneeName')" prop="custName">
            <h-input v-model="viewForm.custName" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pawneeBrchCode')" prop="custBrchCode">
            <h-input v-model="viewForm.custBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="unimpawnDt">
            <h-date-picker v-model="viewForm.unimpawnDt" :maxlength=60 type="date" readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-model="viewForm.custMgrNo" :maxlength=60 readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-row>
        <h-col span="24">
          <h-datagrid :columns="unImpawnBill.billColumns"
                      highlight-row
                      :gridData="billList"
                      :bindForm="formItem"
                      :hasPage="false"
                      :auto-load="false"
                      ref="datagridbill">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
    </h-msg-box>

    <!--<brch-code-search :brchCodeWin="brchCodeWinBrch" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>
    <brch-code-search :brchCodeWin="brchCodeWinCust" @brchCodeWinClose="brchCodeWinClose2"
                      @brchCodeChange="brchCodeChange2" optType="2"></brch-code-search>-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "unImpawnTrackQuery",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    data() {
      return {
        formItem: {
          applSignFlag: "1",
          brchType: "",
          plegdorBrchName: "",
          plegdorBrchCode: "",
          pledgeeBrchName: "",
          pledgeeBrchCode: "",
          billType: "",
          billClass: "",
          billStatus: "",
          billNo: "",
          billMoney: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          dueDt: "",
          unimpawnDt: "",
          minImpawnApplDt: "",
          maxImpawnApplDt: "",
          respFlag: "",
          acctStatus: "",
          billOrigin:"",
          reverseBillNo:"",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
        },
        viewForm: {
          billType: "",
          billClass: "",
          custName: "",
          custBrchCode: "",
          brchName: "",
          applBrchCode: "",
          unimpawnDt: "",
          custMgrNo: ""
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
            title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'), //票据（包）号码
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
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),   //票据(包)金额
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.common.unImpawnDt'),
            key: "unimpawnDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let unimpawnDt = this.$moment(params.row.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", unimpawnDt);
            }
          },
          /*{
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },*/
          {
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            hiddenCol: false
          },
          /*{
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", formatNumber(params.row.billMoney, 2, ","))
              ]);
            }
          },*/
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.be.pledgorBrchName'),
            key: "plegdorBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: "flowStatusName",
            hiddenCol: false
          },
          /*{
            title: this.$t('m.i.billInfo.flowStatus'),
            key: "flowStatus",
            hiddenCol: false,
            render: (h, params) => {
              let flowStatusList = [
                { key: "PIBE03010100", value: "加入批次初始状态" },
                { key: "PIBE03010700", value: "待审批" },
                { key: "PIBE03010710", value: "已审批" },
                { key: "PIBE03010730", value: "审批中" },
                { key: "PIBE03010740", value: "无需审批" },
                { key: "PIBE03060100", value: "加入批次初始状态" },
                { key: "PIBE03060700", value: "待审批" },
                { key: "PIBE03060710", value: "已审批" },
                { key: "PIBE03060730", value: "审批中" },
                { key: "PIBE03060740", value: "无需审批" }
              ];
              let flowStatus = params.row.flowStatus;
              for (let i = 0; i < flowStatusList.length; i++) {
                if (params.row.flowStatus === flowStatusList[i].key) {
                  flowStatus = flowStatusList[i].value;
                }
              }
              return h("span", { domProps: { title: flowStatus } }, flowStatus);
            }
          },*/
          {
            title: this.$t('m.i.billInfo.billType'),
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
            title: this.$t('m.i.billInfo.billClass'),
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
          /*{
            title: this.$t('m.i.billInfo.ecdsBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BarterTrustBillStatus", params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },*/
          {
            title: this.$t('m.i.be.pawneeBrchName'),
            key: "pledgeeBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.releasePledgeRespFlag'),
            key: "respFlag",
            hiddenCol: false,
            render: (h, params) => {
              let respFlag = params.row.respFlag;
              if (respFlag != null && respFlag !== "") {
                switch (respFlag) {
                  case "SU00":
                    respFlag = "同意";
                    break;
                  case "SU01":
                    respFlag = "拒绝";
                    break;
                }
              }
              return h("span", respFlag);
            }
          }

        ],
        applSignFlagList: [
          {
            key: "1",
            value: "质权人"
          },
          {
            key: "2",
            value: "出质人"
          }
        ],
        brchTypeList: [
          {
            key: "1",
            value: "本机构"
          },
          {
            key: "2",
            value: "本机构及下级机构"
          }
        ],
        billTypeList: [],
        billClassList: [],
        billStatusList: [],
        billOriginList: [],
        respFlagList: [
          {
            key: "SU00",
            value: "同意"
          },
          {
            key: "SU01",
            value: "拒绝"
          }
        ],
        acctStatusList: [],
        dueDt: [],
        unimpawnDt: [],
        readonly: false,
        ifShowMore: false,
        //brchCodeWinBrch: false,
        //brchCodeWinCust: false,
        unImpawnTrackQueryWin: false,
        showBillInfoWin: false,
        billId: null,
        billRangeStart:"",
        billRangeEnd:"",
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        dictMap: new Map(),
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
              title: this.$t('m.i.billInfo.billNo'),
              key: "billNo",
              hiddenCol: false,
              render: (h, params) => {
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row.billId);
                    }
                  }
                }, params.row.billNo);
              }
            },
            {
              title: this.$t('m.i.billInfo.billType'),
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
              title: this.$t('m.i.billInfo.billClass'),
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
              title: this.$t('m.i.billInfo.billMoney'),
              key: "billMoney",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t('m.i.billInfo.dueDt'),
              key: "dueDt",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dueDt);
              }
            },
            {
              title: this.$t('m.i.billInfo.acptBankName'),
              key: "acptBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t('m.i.be.unImpawnRemark'),
              key: "unImpawnRemark",
              hiddenCol: false
            }
          ]
        },
        url: "/pb/trust/unImpawn",
        url2: "pb/trust/unImpawn/unImpawnConfirm",
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        batchId: null
      };
    },
    watch: {
      "formItem.billStatus": {
        handler(newVal, oldVal) {
          if (newVal !== "") {
            this.formItem.respFlag = "";
          }
        },
        deep: true,
        immediate: true
      },
     /* "formItem.respFlag": {
        handler(newVal, oldVal) {
          if (newVal !== "") {
            this.formItem.billStatus = "";
          }
        },
        deep: true,
        immediate: true
      }*/
    },
    methods: {
      onMaximize() {
        this.$refs.datagridbill.$refs.gridContent.handleResize();
      },
      showBrch(value) {
        //质权人
        if (value === "1") {
          this.isShowBrch = false;
          this.formItem.pledgeeBrchName = "";
          this.formItem.pledgeeBrchCode = "";
        }
        //出质人
        else if (value === "2") {
          this.isShowBrch = true;
          this.formItem.plegdorBrchName = "";
          this.formItem.plegdorBrchCode = "";
        }
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.dueDt = [];
        this.unimpawnDt = [];
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minImpawnApplDt = "";
        this.formItem.maxImpawnApplDt = "";
        this.formItem.plegdorBrchCode = "";
        this.formItem.pledgeeBrchCode = "";
        this.formItem.plegdorBrchName = "";
        this.formItem.pledgeeBrchName = "";
      },

      dueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      applDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minImpawnApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxImpawnApplDt = arr[1].replace(/-/g, "");
          this.unimpawnDt = [arr[0],arr[1]];
        } else {
          this.formItem.minImpawnApplDt = "";
          this.formItem.maxImpawnApplDt = "";
          this.unimpawnDt = [];
        }
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = "unImpawnTrackQueryReportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + this.url + "/unImpawnTrackQuery/func_exportExcel";
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if (this.$refs.datagrid.total == 0) {
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              applSignFlag: this.formItem.applSignFlag,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              billNo: this.formItem.billNo,
              batchNo: this.formItem.batchNo,
              billType: this.formItem.billType,
              billClass: this.formItem.billClass,
              billStatus: this.formItem.billStatus,
              unimpawnDt: this.formItem.unimpawnDt,
              brchType: this.formItem.brchType,
              plegdorBrchName: this.formItem.plegdorBrchName,
              plegdorBrchCode: this.formItem.plegdorBrchCode,
              pledgeeBrchName: this.formItem.pledgeeBrchName,
              pledgeeBrchCode: this.formItem.pledgeeBrchCode,
              respFlag: this.formItem.respFlag,
              acctStatus: this.formItem.acctStatus,
              applSignFlag: this.formItem.applSignFlag,
              minBillMoney: this.formItem.minBillMoney,
              maxBillMoney: this.formItem.maxBillMoney,
              minDueDt: this.formItem.minDueDt,
              maxDueDt: this.formItem.maxDueDt,
              minImpawnApplDt: this.formItem.minImpawnApplDt,
              maxImpawnApplDt: this.formItem.maxImpawnApplDt,
              billOrigin:this.formItem.billOrigin,
              reverseBillNo:this.formItem.reverseBillNo,
              minBillRangeStart: this.formItem.minBillRangeStart,
              maxBillRangeEnd: this.formItem.maxBillRangeEnd,
              field: field,
              exportType: exportType,
              excelName: this.param,
              pageSize: pageSize
            };
          }
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
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + this.url + "/unImpawnTrackQuery/func_exportExcel";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "ids";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "pageSize";
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2);
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
            let input6 = document.createElement("input");
            input6.type = "text";
            input6.name = "applSignFlag";
            input6.value = this.formItem.applSignFlag;
            form.appendChild(input6);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + this.url + "/unImpawnTrackQuery/func_exportExcel";
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
        }
      },
      // 查询票据明细
      queryBillByBatchId(id) {
        let obj = Object.assign({}, this.formItem, { id: id }, { pageNo: 1, pageSize: 10 });
        post(obj, this.url2 + "/func_queryUnImpawnBillByBillId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.billList = res.data.retData;
            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询票据明细失败";
              this.retMsg = res.data.retMsg;
              this.unImpawnTrackQueryWinClose();
            }
          } else {
            this.submitMsg = "查询票据明细失败";
            this.retMsg = this.$t("m.i.common.netError");
            this.unImpawnTrackQueryWinClose();
          }
        });
      },
      /**超链接点击批次号弹出票据明细**/
      showBillList(list) {
        this.type = "view";
        this.isRollBack = true;
        this.viewForm.billType = list.billType;
        this.viewForm.billClass = list.billClass;
        this.viewForm.custName = list.custName;
        this.viewForm.custBrchCode = list.custBrchCode;
        this.viewForm.brchName = list.brchName;
        this.viewForm.applBrchCode = list.applBrchCode;
        if (list.unimpawnDt) {
          this.viewForm.unimpawnDt = this.$moment(list.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.viewForm.unimpawnDt = list.unimpawnDt;
        }
        this.viewForm.custMgrNo = list.custMgrNo;
        this.viewForm.brchName = list.brchName;
        this.queryBillByBatchId(list.id);
        this.isRequired = false;
        this.readonly = true;
        this.unImpawnTrackQueryWin = true;
      },
      unImpawnTrackQueryWinClose() {
        this.unImpawnTrackQueryWin = false;
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
      /*brchCodeWinOpen() {
        this.brchCodeWinBrch = true;
      },*/
      /*brchCodeWinClose() {
        this.brchCodeWinBrch = false;
      },*/
      /*brchCodeChange(info) {
        this.formItem.plegdorBrchName = info.brchFullNameZh;
        this.formItem.plegdorBrchCode = info.brchCode;
        this.brchCodeWinBrch = false;
      },*/
      /*brchCodeWinOpen2() {
        this.brchCodeWinCust = true;
      },*/
      /*brchCodeWinClose2() {
        this.brchCodeWinCust = false;
      },*/
      /*brchCodeChange2(info) {
        this.formItem.pledgeeBrchName = info.brchFullNameZh;
        this.formItem.pledgeeBrchCode = info.brchCode;
        this.brchCodeWinCust = false;
      },*/
      /*clearVal(type) {
        if (type == "plegdorBrchName") {
          this.formItem.plegdorBrchCode = "";
          this.formItem.plegdorBrchName = "";
        }
        if (type == "pledgeeBrchName") {
          this.formItem.pledgeeBrchCode = "";
          this.formItem.pledgeeBrchName = "";
        }
      }*/
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,AcctFlag,BarterTrustBillStatus,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.acctStatusList = res.get("AcctFlag");
        this.billStatusList = res.get("BarterTrustBillStatus");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
