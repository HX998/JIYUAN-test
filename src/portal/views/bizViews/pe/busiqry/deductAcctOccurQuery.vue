<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
    <!--            <h-form-item :label="$t('m.i.pe.acptBrchName')" prop="acptBrchNoList">
                  <h-input v-model="formItem.acptBrchNoList" readonly v-show="false" placeholder=""></h-input>
                  <h-input v-model="formItem.acptBrchNameList" readonly icon="android-search" @on-click="queryBrchNo()"
                           clearable @on-clear="clearVal('acptBrchNoList')" :title="formItem.acptBrchNameList"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.acptBrchNoList" :label="$t('m.i.pe.acptBrchName')" prop="acptBrchNoList"
                             title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.acptBrchNoList" :brchName.sync="formItem.acptBrchNameList"></show-branch>

                <h-form-item :label="$t('m.i.pe.acptType')" prop="acptTypeList">
                  <h-select v-model="formItem.acptTypeList" placeholder="" multiple showTitle>
                    <h-option v-for="item in AcptTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.dpstDt')" prop="dpstDt">
                  <h-date-picker :value="dpstDt" type="daterange" autoPlacement  showFormat :editable=false
                                 @on-change="handleDpstDtChange" placeholder=""></h-date-picker>
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
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDt">
                  <h-date-picker :value="remitDt" type="daterange"  autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.acptDt')" prop="acptDt">
                  <h-date-picker :value="acptDt" type="daterange"  autoPlacement showFormat :editable=false
                                 @on-change="handleAcptDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker :value="dueDt" type="daterange"  autoPlacement showFormat :editable=false
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
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.value">{{ item.value}}
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
            hasPage
            showListCkeckBox
            :hasSelect="false"
            :rowSelect="true"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.pe.flowExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 机构名称选择弹窗框 -->
    <!--<show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange" ifcheck="true"
                 :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>-->

    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" :isAllBankAcct=true
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>


    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "deductAcctOccurQuery",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */ "@/views/bizViews/be/market/rediscount/common/showBranch")
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
          minDpstDt: "",
          maxDpstDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          billClass: "",
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
            title:this.$t("m.i.pe.dpstDt"),
            key: 'dpstDt',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dpstDt == null || params.row.dpstDt === "" || params.row.dpstDt === 0){
                return "";
              }
              let date = this.$moment(params.row.dpstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
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
            title:this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              }else {
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
            title:this.$t("m.i.pe.acptBrchName"),
            key: 'acptBrchName',
            hiddenCol: false,
          },
          {
            title:this.$t("m.i.pe.acptType"),
            key: 'acptType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"AcptType",params.row.acptType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t('m.i.pe.deductAcctNo'),
            key: 'deductAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.pe.dpstNo'),
            key: 'dpstNo',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:this.$t('m.i.billInfo.acptDt'),
            key: 'acptDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.acptDt == null || params.row.acptDt === "" || params.row.acptDt===0){
                return "";
              }
              let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"CDMedia",params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title:this.$t('m.i.billInfo.drweBankName'),
            key: 'drweBankName',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.pe.transBrchNo'),
            key: 'transBrchNo',
            hiddenCol: false,
          },
          {
            title:this.$t('m.i.pe.transTellerNo'),
            key: 'operTellerNo',
            hiddenCol: false,
          }
        ],
        remitDt: [],
        dueDt: [],
        acptDt: [],
        dpstDt: [],
        AcptTypeList: [],
        yonList: [],
        billClassList: [],
        billOriginList:[],
        dictMap: new Map(),
        billId: "",
        //是否显示更多查询项
        ifShowMore: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        showBillInfoWin: false,
        tempShowExcelTemplateWin: false,
        //showBranchWin: false,
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        queryUrl: "/pe/busiqry/deductAcctOccurQuery/func_pageingQueryDeductAcctInfo"
      };
    },
    mounted() {
      this.getDictListByGroups("AcptType,CDMedia,Yon,BillOrigin").then(res => {
        this.AcptTypeList = res.get("AcptType");
        this.billClassList = res.get("CDMedia");
        this.yonList = res.get("Yon");
        this.dictMap = res.get("map");
        this.billOriginList = res.get("BillOrigin");
      });
    },
    methods: {
      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
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
        this.formItem.minDpstDt = "";
        this.formItem.maxDpstDt = "";
        this.formItem.minAcptDt = "";
        this.formItem.maxAcptDt = "";
        this.formItem.drwrCustNo = "";
        this.formItem.acptBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.remitDt = [];
        this.acptDt = [];
        this.dueDt = [];
        this.dpstDt = [];
      },
     /* //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
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
        }else{
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
        }else{
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
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

      },

      handleDpstDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDpstDt = arr[0].replace(/-/g, "");
          this.formItem.maxDpstDt = arr[1].replace(/-/g, "");
          this.dpstDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDpstDt = "";
          this.formItem.maxDpstDt = "";
          this.dpstDt = [];
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
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "deductAcctOccurExportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/deductAcctOccurQuery/func_exportDeductAcctOccurExcel";
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

      clearVal(optType) {
       if (optType === "drwrName") {
          this.formItem.drwrAcctNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrCustNo = "";
        }
      }
    }

  };
</script>

<style scoped>

</style>
