<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <show-branch v-model="formItem.transBrchNoList" :label="$t('m.i.common.brchName')" prop="transBrchNoList"
                               title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.transBrchNoList" :brchName.sync="formItem.transBrchNameList"></show-branch>
                  <!-- 票据类型 -->
                  <bill-type v-model="formItem.billType" :dictList="BillTypeList"></bill-type>
                  <!-- 逾期标识 -->
                  <common-select v-model="formItem.isOverdue" :label="$t('m.i.billInfo.overdueFlag')" prop="isOverdue"
                                 :dictList="yonList"></common-select>
                  <!-- 清算标识 -->
                  <common-select v-model="formItem.clearMark" :label="$t('m.i.be.clearType')" prop="clearMark" :dictList="SettlementMarkCodeList"></common-select>
                  <!-- 票据来源 -->
                  <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                                 v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>
                  <!-- 票据号码 -->
                  <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                  <!-- 子票区间 -->
                  <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <!-- 承兑行名称 -->
                  <common-input :label="$t('m.i.billInfo.acptBankName')" prop="acptBankName"
                                v-model="formItem.acptBankName" class="h-form-long-label"></common-input>
                  <!-- 提示付款日期 -->
                  <common-date-picker :label="$t('m.i.pe.prsttnApplyDt')" prop="applDate" v-model="prsttnDt" :rangeValue="['minPrsttnDt','maxPrsttnDt']"
                                      :minPrsttnDt.sync="formItem.minPrsttnDt" :maxPrsttnDt.sync="formItem.maxPrsttnDt" type="daterange"></common-date-picker>
                  <!-- 出票日 -->
                  <remit-dt-range v-model="remitDt" :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt"></remit-dt-range>
                  <!-- 汇票到期日 -->
                  <due-dt-range v-model="dueDt" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>
                  <!-- 票据金额 -->
                  <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :bigTips="false"
                                    :rangeProps="['minBillMoney','maxBillMoney']" class="h-form-long-label"></bill-money-range>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="formSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="formSearchReset">{{$t("m.i.common.reset")}}</h-button>
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
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            getDataFunc
            @get-data="getOccurData"
            :gridData="occurData"
            :bindForm="formItem"
            :hasSelect=false
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!-- 机构名称选择弹窗框 -->
   <!-- <show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange" ifcheck="true"
                 :checkStrictly="false" @showBranchWinClose="showBranchWinClose"></show-branch>-->
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "cePrsttnOccurQuery",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */ "@/views/bizViews/sm/auth/branch/showBranch")
    },
    data() {
      return {
        formItem: {
          transBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          billType: "",
          billOrigin: "",
          isOverdue: "",
          clearMark: "",
          reverseBillNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          acptBankName: "",
          maxBillMoney: "",
          minBillMoney: "",
          minPrsttnDt: "",
          maxPrsttnDt: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          inOutFlagList: ["1", "3"],
          orderByClause:"prsttn_dt desc,id desc"
        },
        columns: [
          {
            type: "selection",
            hiddenCol: false,
            width: 60,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
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
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "transBrchName",
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
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.overdueFlag"),
            key: "isOverdue",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isOverdue);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.be.clearType"),
            key: "clearMark",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.clearMark);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pe.prsttnApplyDt"),
            key: "prsttnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.prsttnDt && "" !== params.row.prsttnDt) {
                let prsttnDt = this.$moment(params.row.prsttnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", prsttnDt);
              }
            }
          },
          {
            title:  this.$t("m.i.pe.prsttnReceiveAmt"),
            key: "prsttnReceiveAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.prsttnReceiveAmt === "" || params.row.prsttnReceiveAmt === null) {
                return h("span", "-");
              }
              let prsttnReceiveAmt = formatNumber(params.row.prsttnReceiveAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: prsttnReceiveAmt
                }
              }, prsttnReceiveAmt);
            }
          },
          {
            title: this.$t("m.i.pe.billSource"),
            key: "billSourceName",
            hiddenCol: false
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
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", { domProps: { title: remitDt } }, remitDt);
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
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", { domProps: { title: dueDt } }, dueDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
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
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false,
          }
        ],
        ifShowMore: false,
        showBillInfoWin: false,
        //showBranchWin: false,
        tempShowExcelTemplateWin: false,
        billId: "",
        billRangeStart: "",
        billRangeEnd: "",
        BillTypeList: [],
        yonList: [],
        SettlementMarkCodeList: [],
        billOriginList: [],
        remitDt: [],
        dueDt: [],
        prsttnDt: [],
        dictMap: null,
        queryUrl: "/pe/busiqry/cePrsttnOccurQuery/func_listOccurPrsnttnBill",
        occurData: { rows: [], total: 1 },
        sumMoney: "",
        total: "",
        param: null,
        rows: null
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,SettleType,BillOrigin").then(res => {
        this.BillTypeList = res.get("DraftTypeCode");
        this.yonList = res.get("Yon");
        this.SettlementMarkCodeList = res.get("SettleType");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
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
        this.getOccurData();
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
        this.formItem.minPrsttnDt = "";
        this.formItem.maxPrsttnDt = "";
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.remitDt = [];
        this.dueDt = [];
        this.prsttnDt = [];
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

      handlePrsttnDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minPrsttnDt = arr[0].replace(/-/g, "");
          this.formItem.maxPrsttnDt = arr[1].replace(/-/g, "");
          this.prsttnDt = [arr[0], arr[1]];
        }else{
          this.formItem.minPrsttnDt = "";
          this.formItem.maxPrsttnDt = "";
          this.prsttnDt = [];
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
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "cePrsnttnOccurExportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/cePrsttnOccurQuery/func_exportPrsnttnBillOccurExcel";
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
      }
    }
  };
</script>

<style scoped>

</style>
