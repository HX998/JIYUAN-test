<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.transBrchNoList" :label="$t('m.i.common.brchName')" prop="transBrchNoList"
                             title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.transBrchNoList" :brchName.sync="formItem.transBrchNameList"></show-branch>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo">
                  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo"></h-input>
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
                <h-form-item  :label="$t('m.i.common.unImpawnDt')" prop="unImpawnDt">
                  <h-date-picker :value="unImpawnDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleImpawnApplDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
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
                <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
                  <h-input v-model="formItem.drwrName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNoLike">
                  <h-input v-model="formItem.drwrAcctNoLike" placeholder=""></h-input>
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
            :url="queryUrl"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            :bindForm="formItem"
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
              <h-button type="primary"  @click="bulkPrintBill" :billId="this.billId" :billIds="this.billIds"
                        :disabled="!this.ifDisabledPrint"  v-if="isShowPrintBtn">{{$t("m.i.pc.billFrontPrint")}}
              </h-button>
              <h-button type="primary"  @click="bulkPrintOutEndo" :billId="this.billId" :billIds="this.billIds"
                        :disabled="!this.ifDisabledPrint" v-if="isShowPrintBtn">{{$t("m.i.pc.endoPrint")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>


    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>

    <bill-infos-main @billInfosWinClose="billInfosWinClose" @bulkPrintBillFlagClose = "bulkPrintBillFlagClose" @bulkPrintOutEndoFlagClose="bulkPrintOutEndoFlagClose" @bulk :showBillInfoWin="showBillInfosWin" :billIds="this.billIds"
                     :billNos="this.billNos" :billRangeStarts="this.billRangeStarts" :billRangeEnds="this.billRangeEnds" ref="billInfosMain" :bulkPrintBillFlag="bulkPrintBillFlag" :bulkPrintOutEndoFlag="bulkPrintOutEndoFlag" v-if="showBillInfosWin"></bill-infos-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "ceUnImpawnOccurQuery",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */ "@/views/bizViews/sm/auth/branch/showBranch")
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
                  this.showBillList(params.row.batchNo);
                }
              }
            }, params.row.batchNo);
          }
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "transBrchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.common.custNo'),
          key: "custNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custAcctNo'),
          key: "custAcctNo",
          hiddenCol: false
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
          title: this.$t("m.i.common.unImpawnDt"),
          key: "unImpawnDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let unImpawnDt = this.$moment(params.row.unImpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", unImpawnDt);
          }
        },
        {
          title: this.$t("m.i.pe.total"),
          key: "sumCount",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.totalAmt"),
          key: "sumMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", formatNumber(params.row.sumMoney, 2, ","));
          }
        }
      ];
      return {
        formItem: {
          transBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          billType: "",
          billClass: "",
          billOrigin: "",
          billNo: "",
          billIds: [],
          batchNo: "",
          custName: "",
          custNo: "",
          custAcctNo: "",
          minRemitDt: "",
          maxRemitDt: "",
          minUnImpawnDt: "",
          maxUnImpawnDt: "",
          minDueDt: "",
          maxDueDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          drwrAcctNoLike : "",
          drwrName : "",
          reverseBillNo: "",
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "transBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custNo'),
            key: "custNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: "custAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.impawnDt"),
            key: "impawnDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.impawnDt === '' || params.row.impawnDt === null || params.row.impawnDt === undefined){
                return h("span", '-');
              }else{
                let impawnDt = this.$moment(params.row.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", impawnDt);
              }
            }
          },
          {
            title: this.$t("m.i.common.unImpawnDt"),
            key: "unImpawnDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let unImpawnDt = this.$moment(params.row.unImpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", unImpawnDt);
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
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          }
        ],
        viewForm: {
          billType: "",
          billClass: "",
          custName: "",
          custBrchCode: "",
          brchName: "",
          applBrchCode: "",
          applDt: "",
          custMgrNo: ""
        },
        isShowBrch: false,
        billTypeList: [],
        billClassList: [],
        billOriginList: [],
        remitDt: [],
        billIds: [],
        billNos: [],
        billRangeStarts: [],
        billRangeEnds: [],
        maxPrintNum: 1,
        dueDt: [],
        unImpawnDt: [],
        dictMap: new Map(),
        billId: "",
        type: "",
        //是否显示更多查询项
        ifShowMore: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        showBillInfoWin: false,
        showBillInfosWin: false,
        bulkPrintBillFlag: false,
        isShowPrintBtn: false,
        bulkPrintOutEndoFlag: false,
        readonly: false,
        batchId: "",
        tempShowExcelTemplateWin: false,
        //showBranchWin: false,
        queryUrl: "/ce/impawn/occurQuery/func_pageQueryUnImpawnBacthOccur",
        ifDisabledExport: false,
        ifDisabledPrint: false,
        showColumns: this.deepClone(batchColumns),
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        selectExportType: ""
      };
    },
    mounted() {
      this.buttonAuthShow();
      this.getDictListByGroups("DraftTypeCode,CDMedia,AcctFlag,BarterTrustStatus,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.url = this.queryUrl;
        this.$refs.datagrid.dataChange(1);
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
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      //重置applSignFlagList
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.transBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        this.formItem.batchNo = "",
        this.formItem.custName = "",
        this.formItem.custNo = "",
        this.formItem.custAcctNo = "",
        this.formItem.billType = "";
        this.formItem.billClass = "";
        this.formItem.billNo = "";
        this.formItem.reverseBillNo = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.drwrName = "";
        this.formItem.drwrAcctNoLike = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minUnImpawnDt = "";
        this.formItem.maxUnImpawnDt = "";
        this.formItem.minBillRangeStart = "";
        this.formItem.maxBillRangeEnd = "";
        this.remitDt = [];
        this.dueDt = [];
        this.unImpawnDt = [];
      },
      queryCustName() {
        this.showCustMessageWin = true;
      },
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //日期选择框
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }else{
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
        }else{
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
        }else{
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
      queryImpawnOccurBatch() {
        this.$refs.datagrid.url = null;
        this.queryUrl = "/ce/impawn/occurQuery/func_pageQueryUnImpawnBacthOccur";
        this.ifDisabledExport = false;
        this.ifDisabledPrint = false;
        this.showColumns = this.deepClone(this.batchColumns);
        this.formSearch();
      },
      queryImpawnOccurBill() {
        this.$refs.datagrid.url = null;
        this.queryUrl = "/ce/impawn/occurQuery/func_pageQueryUnImpawnBillOccur";
        this.ifDisabledExport = true;
        this.ifDisabledPrint = true;
        this.showColumns = this.deepClone(this.billColumns);
        this.formSearch();
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      showBillList(batchNo) {
        this.$refs.datagrid.tData = [];
        this.formItem.batchNo = batchNo;
        this.ifDisabledExport = true;
        this.queryUrl = "/ce/impawn/occurQuery/func_pageQueryUnImpawnBillOccur";
        this.ifDisabledPrint = true;
        this.$nextTick(() => {
          this.showColumns = this.deepClone(this.billColumns);
          this.$refs.datagrid.createShowCol(this.billColumns);
          this.formSearch();
        });
      },
      //清单导出
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "ceUnImpawnBatchOccurExportInfo";
        } else {
          this.param = "ceUnImpawnBillOccurExportInfo";
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
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/ce/impawn/occurQuery/func_exportUnImpawnBatchOccurExcel";
        } else {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/ce/impawn/occurQuery/func_exportUnImpawnBillOccurExcel";
        }
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
      //批量打印正面或者场外背书
      bulkPrint() {
        this.billIds = this.$refs.datagrid.selectIds;
        let selectRows = this.$refs.datagrid.selects;
        console.log('this.billIds1111:'+this.billIds);
        if (this.billIds === null || this.billIds.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        if (this.billIds.length > this.maxPrintNum) {
          this.$msgTip.info(this, {info: "最多选中"+this.maxPrintNum+"条记录"});
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
        setTimeout(()=>{
          this.isLoading = false;
        }, this.billIds.length * 350)
      },
      bulkPrintOutEndo() {
        this.bulkPrintOutEndoFlag = true;
        this.bulkPrint();
        setTimeout(()=>{
          this.isLoading = false;
        }, this.billIds.length * 300)
      },
      queryBusiParamDefaultValue() {
        post({ paramKey: "bm.common.bill_print_max_num" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData == null || res.data.retData == ''){
                this.maxPrintNum = 20;
              }else{
                this.maxPrintNum = Number(res.data.retData);
              }

            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      created() {
        this.queryBusiParamDefaultValue();
      },
      clearVal(optType) {
       if (optType === "custName") {
          this.formItem.custAcctNo = "";
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
      }
    }
  };
</script>

<style scoped>

</style>
