<!--点击成交-卖出跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-select v-model="formItem.sendRcvFlag" :dictList="sendRcvFlagList" :clearable="false"
                               :label="$t('m.i.be.sendRcvFlag')" prop="sendRcvFlag" @on-change="changeSendRcvFlag"></common-select>
                <show-branch v-model="formItem.transBrchName" :labelName="$t('m.i.common.brchNo')"   prop="transBrchName"
                             :showCheckBox="true"     :brchNo.sync="formItem.transBrchNos" :brchName.sync="formItem.transBrchName">
                </show-branch>
                <batch-no v-model="formItem.batchNo"></batch-no>
                <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo"></common-input>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-class v-model="formItem.billClass" :dictList="billClassList"></bill-class>
                <common-select v-model="formItem.quoteStatus" :dictList="quoteStatusList"
                               :label="$t('m.i.be.quoteStatus')" prop="quoteStatus"></common-select>
                <common-select v-model="formItem.creditMainBrchClass" :dictList="creditMajorList"
                               :label="$t('m.i.billInfo.creditMainBankType')" prop="creditMainBrchClass"></common-select>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlightRow
              :hasSelect="false"
              rowSelect
              url="/be/market/clickdeal/sale/saleTrackQuery/func_getClickSaleBatchAll"
              :bindForm="formItem"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportExcel">{{$t('m.i.common.exportExcel')}}</h-button>
              <h-button type="primary" @click="dealInfo">{{$t('m.i.be.dealInfo')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--交易对手类型查看-->
    <show-trans-brch-type :transBrchTypeWin="showTransBrchTypeWin" displayType="show"
                          :transBrchTypeParams="showTransBrchTypeParams" @transBrchTypeWinClose="showTransBrchTypeWinClose"
                          datagridUrl="/be/market/clickdeal/sale/saleApplyConfirm/func_queryBranchClass"></show-trans-brch-type>
    <!--批次链接详细展示框-->
    <sale-detail :saleDetailWin="saleDetailWin" :detailParams="detailParams" @saleDetailWinClose="saleDetailWinClose" :sendRcvFlag="sendRcvFlag" exportParam="clickDealSaleBillInfo"></sale-detail>
    <sale-deal-info :saleDealInfoWin="saleDealInfoWin" :quoteNo="quoteNo" @saleDealInfoWinClose="saleDealInfoWinClose" :rootUrl="rootUrl"></sale-deal-info>
    <!--excel导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "saleTrackQuery",
    components: {
      SaleDealInfo: () => import(/* webpackChunkName: "be/market/clickdeal/sale/saleDealInfo" */`@/views/bizViews/be/market/clickdeal/sale/saleDealInfo`),
      SaleDetail: () => import(/* webpackChunkName: "be/market/clickdeal/sale/saleDetail" */`@/views/bizViews/be/market/clickdeal/sale/saleDetail`),
      ShowTransBrchType: () => import(/* webpackChunkName: "be/market/common/showTransBrchType" */`@/views/bizViews/be/market/common/showTransBrchType`)
    },
    data() {
      return {
        tempShowExcelTemplateWin:false,
        param:"",
        rows:"",
        formItem: {
          transBrchName: "",
          quoteNo: "",
          batchNo: "",
          billType: "",
          billClass: "",
          quoteStatus: "",
          sendRcvFlag: "2",
          creditMainBrchClass: "",
          transBrchNos:""
        },
        sendColumns: [
          {
            title: this.$t("m.i.be.transClearMode"),
            key: "transClearMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ClearMode", params.row.transClearMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "interest",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.interest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "settleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.settleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.tenorDays"),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "failReason",
            hiddenCol: false
          },
        ],
        reciveColumns: [
          {
            title: this.$t("m.i.billInfo.acptBankType"),
            key: "acptBrchClasses",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.acptBrchClasses == null || params.row.acptBrchClasses === "") {
                return "-"
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.id, "acptClass");
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.billInfo.discBankType"),
            key: "discBrchClasses",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.discBrchClasses == null || params.row.discBrchClasses === "") {
                return "-"
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.id, "discClass");
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.billInfo.trustBankType"),
            key: "trustBrchClasses",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.trustBrchClasses == null || params.row.trustBrchClasses === "") {
                return "-"
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.id, "trustClass");
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.be.isNeedConfirm"),
            key: "isNeedConfirm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isNeedConfirm);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.minResidualTermDay"),
            key: "minResidualTerm",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.maxResidualTermDay"),
            key: "maxResidualTerm",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.minDueDt"),
            key: "minDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(!params.row.minDueDt){
                return h("span", "");
              }
              let dt = this.$moment(params.row.minDueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dt);
            }
          },
          {
            title: this.$t("m.i.be.maxDueDt"),
            key: "maxDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(!params.row.maxDueDt){
                return h("span", "");
              }
              let dt = this.$moment(params.row.maxDueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dt);
            }
          },
          {
            title: this.$t("m.i.be.minBillAmt"),
            key: "minBillAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.minBillAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "failReason",
            hiddenCol: false
          },
        ],
        defaultColumns: [
          {
            type: "selection",
            width: 50,
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showSaleDetil(params.row.id,params.row.sendRcvFlag)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t("m.i.be.quoteStatus"),
            key: "quoteStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "QuoteStatus", params.row.quoteStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "quoteNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.quoteRelationNo"),
            key: "quoteRelationNo",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.sendRcvFlag"),
            key: "sendRcvFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SendRcvFlag", params.row.sendRcvFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isAnony"),
            key: "isAnony",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isAnony);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.tradeRange"),
            key: "tradeRange",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "TradeRange", params.row.tradeRange);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            title: this.$t("m.i.pe.dealRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.subDeal"),
            key: "subDeal",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.subDeal);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.clearSpeed"),
            key: "clearSpeed",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ClearSpeed", params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.settleDt"),
            key: "settleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let settleDt = this.$moment(params.row.settleDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", settleDt);
            }
          },
          {
            title: this.$t("m.i.be.settleMode"),
            key: "settleMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.clearType"),
            key: "clearType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ClearType", params.row.clearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.quoteTm"),
            key: "quoteTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.quoteTm == null || params.row.quoteTm === "") {
                return "";
              }
              let quoteTm = params.row.quoteTm.toString();
              if (params.row.quoteTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.quoteTm.toString().length); i++) {
                  quoteTm = "0" + quoteTm;
                }
              }
              let date = this.$moment(quoteTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.be.setTm"),
            key: "setTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.setTm == null || params.row.setTm === "") {
                return "";
              }
              let setTm = params.row.setTm.toString();
              if (params.row.setTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.setTm.toString().length); i++) {
                  setTm = "0" + setTm;
                }
              }
              let date = this.$moment(setTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CreditMajor", params.row.creditMainBrchClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.totalAmtBillPackage"),
            key: "totalAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.transCustType"),
            key: "transCustType",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.transCustType == null || params.row.transCustType === "") {
                return "-"
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.id, "tradeClass");
                  }
                }
              }, "查看");
            }
          },
        ],
        columns: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        billTypeList: [],
        billClassList: [],
        busiTypeList: [],
        assetIndustryList: [],
        trDirList: [],
        isList: [],
        tradeRangeList: [],
        clearSpeedList: [],
        settleTypeList: [],
        clearTypeList: [],
        creditMajorList: [],
        clearModeList: [],
        brchClassList: [],
        quoteStatusList: [],
        saleApplyAddOrEditWin: false,
        batchParams: {},
        showTransBrchTypeWin: false,
        saleDealInfoWin: false,
        showTransBrchTypeParams: {},
        saleDetailWin: false,
        detailParams: {},
        brchClassMap: new Map(),
        quoteNo: "",
        sendRcvFlag: "",
        sendRcvFlagList: [],
        rootUrl: "/be/market/clickdeal/sale/saleTrackQuery"
      };
    },
    mounted() {
      this.columns = this.defaultColumns.concat(this.sendColumns);
      this.getDictListByGroups("BusiType,TrDir,Yon,TradeRange,AssetIndustry,DraftTypeCode,CDMedia,ClearSpeed,SettleType,ClearType,CreditMajor,ClearMode,BrchClass,QuoteStatus,SendRcvFlag,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.busiTypeList = res.get("BusiType");
        this.assetIndustryList = res.get("AssetIndustry");

        this.trDirList = res.get("TrDir");
        this.isList = res.get("Yon");
        this.tradeRangeList = res.get("TradeRange");
        this.clearSpeedList = res.get("ClearSpeed");
        this.settleTypeList = res.get("SettleType");
        this.clearTypeList = res.get("ClearType");
        this.creditMajorList = res.get("CreditMajor");
        this.clearModeList = res.get("ClearMode");
        this.brchClassList = res.get("BrchClass");
        this.quoteStatusList = res.get("QuoteStatus");
        this.sendRcvFlagList = res.get("SendRcvFlag");
        this.brchClassList.forEach(x => {
          return this.brchClassMap.set(x.key, x.value)
        });
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.transBrchNos="";
        this.formItem.transBrchName="";
        this.$refs.formItem.resetFields();
      },
      showTransBrchType(batchId,operate) {
        this.showTransBrchTypeParams = {
          batchId: batchId,
          operate: operate,
        };
        this.showTransBrchTypeWin = true;
      },
      showTransBrchTypeWinClose() {
        this.showTransBrchTypeParams = {};
        this.showTransBrchTypeWin = false;
      },
      exportExcel(){
        if(this.formItem.sendRcvFlag === '2'){
          this.param = 'clickDealTrackSearchExport-Sale';
        }else{
          this.param = 'clickDealTrackSearchExport-Rebuy';
        }
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/clickdeal/sale/saleTrackQuery/func_exportExcel";
        if(exportType === "1"){
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = { ids: this.$refs.datagrid.selectIds, field: field, exportType: exportType, excelName: this.param, pageSize: this.$refs.datagrid.selectIds.length,sendRcvFlag:this.formItem.sendRcvFlag};
          }else {
            let pageSize = this.$refs.datagrid.total;
            if(this.$refs.datagrid.total == 0){
              pageSize = 1;
            }
            params = Object.assign(this.formItem,{field: field, exportType: exportType, excelName: this.param, pageSize: pageSize});
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
        }else {
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let input1 = document.createElement('input');
            input1.type = 'text';
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2);
            let input5 = document.createElement('input');
            input5.type = 'text';
            input5.name = 'sendRcvFlag';
            input5.value = this.formItem.sendRcvFlag;
            form.appendChild(input5);
          } else {
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            if (this.$refs.datagrid.total > 0) {
              let input = document.createElement('input')
              input.type = 'text'
              input.name = 'pageSize';
              input.value = this.$refs.datagrid.total;
              form.appendChild(input)
            }
          }
          let input2 = document.createElement('input');
          input2.type = 'text';
          input2.name = 'field';
          input2.value = field;
          form.appendChild(input2);
          let input3 = document.createElement('input');
          input3.type = 'text';
          input3.name = 'exportType';
          input3.value = exportType;
          form.appendChild(input3);
          let input4 = document.createElement('input');
          input4.type = 'text';
          input4.name = 'excelName';
          input4.value = this.param;
          form.appendChild(input4);

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      dealInfo(){
        let list = this.$refs.datagrid.selects;
        if(list != null && list.length === 1){
          this.quoteNo = list[0].quoteNo;
          if(this.quoteNo){
            this.saleDealInfoWin = true;
          }else{
            this.$msgTip.info(this, { info: "报价单编号为空，无成交信息"});
          }
        }else{
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData")});
        }
      },
      showSaleDetil(batchId,sendRcvFlag) {
        this.sendRcvFlag=sendRcvFlag;
        this.detailParams.batchId = batchId;
        this.detailParams.dictMap = this.dictMap;
        this.detailParams.brchClassMap = this.brchClassMap;
        this.detailParams.exportUrl = "/be/market/clickdeal/sale/saleTrackQuery/func_exportClickSaleBillDetail";
        this.saleDetailWin = true;
      },
      saleDetailWinClose() {
        this.detailParams = {};
        this.saleDetailWin = false;
      },
      saleDealInfoWinClose(){
        this.quoteNo = "";
        this.saleDealInfoWin = false;
      },
      changeSendRcvFlag(val){
        if(val === "2"){
          this.columns = this.defaultColumns.concat(this.sendColumns);
        }else{
          this.columns = this.defaultColumns.concat(this.reciveColumns);
        }
        this.$nextTick(() => {
          this.handleSearch();
        });
      }
    }
  };
</script>

<style scoped>

</style>
