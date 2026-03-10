<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchName"  :label="$t('m.i.be.brchName')"      prop="brchName"
                             :showCheckBox="true"     :brchNo.sync="formItem.transBrchNos" :brchName.sync="formItem.brchName">
                </show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.rediscountApplNo')" prop="rediscountApplNo">
                  <h-input v-model="formItem.rediscountApplNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
                  <h-input v-model="formItem.dealNo">
                  </h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.dealStatus')" prop="dealStatusList">
                  <h-select multiple v-model="formItem.dealStatusList" placeholder="">
                    <h-option v-for="item in rediscApplyStatusList" :value="item.key" :key="item.value">{{ item.value
                      }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.firstAcctStatus')" prop="acctStatus">
                  <h-select v-model="formItem.acctStatus" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed">
                  <h-select v-model="formItem.clearSpeed" placeholder="">
                    <h-option v-for="item in clearSpeedList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.clearType')" prop="clearType">
                  <h-select v-model="formItem.clearType" placeholder="">
                    <h-option v-for="item in clearTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode">
                  <h-select v-model="formItem.settleMode" placeholder="">
                    <h-option v-for="item in settleModeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <show-cpes-branch :label="$t('m.i.be.pedBrchName')"
                                  :brchCode.sync="formItem.buyBrchCodeNeed"  :cpesBrchName.sync="formItem.buyBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                  :cpesBrchParams="{'memberId':100000}"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <common-type-field-range v-model="formItem" :label="$t('m.i.be.tradRate')" :integerNum="3" :suffixNum="4" :bigTips="false"
                                         :rangeProps="['minRate','maxRate']"></common-type-field-range>
                <h-form-item :label="$t('m.i.be.firstSettleDate')" >
                  <h-date-picker type="daterange" autoPlacement :value="firstSettleDt" format="yyyy-MM-dd"
                                 showFormat :clearable="true" @on-clear="clearVal('moveFirstSettleDt')" placeholder="" @on-change="handleFirstSettleDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dueSettleDt')" >
                  <h-date-picker type="daterange" autoPlacement :value="dueSettleDt" format="yyyy-MM-dd"
                                 showFormat :clearable="true" @on-clear="clearVal('moveDueSettleDt')" placeholder="" @on-change="handleDueSettleDtChange"></h-date-picker>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary"  @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid :columns="columns" :hasSelect="false" rowSelect
                          :notSetWidth="true" :url="batchsUrl" :bindForm="formItem" ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="transDetail">交易明细</h-button>
                  <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportData')}}</h-button>
                  <h-button type="primary" @click="dealExport()">成交单导出</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <redis-bill-detil :batchid="batchid" :dealStatus="dealStatus" :dictMap="dictMap" :showBills="showBills" :batchUrl="batchUrl"
                      :billsUrl="billsUrl"
                      :billImgsUrl="billImgsUrl" :busiType="busiType" @closeMsgBox="closeMsgBox"></redis-bill-detil>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>
<script>
  import { getDictListByGroups, getDictValueFromMap, on,post,formatNumber} from "@/api/bizApi/commonUtil";
  export default {
	name:'rediscountTrackQuery',
    data() {
      return {
          dictMap : new Map(),
          busiTypeList : [],
          billTypeList : [],
          billClassList : [],
          clearSpeedList : [],
        assetIndustryList : [],
          clearTypeList : [],
          settleModeList : [],
          imgStatusList : [],
          rediscApplyStatusList : [],
        firstSettleDt:[],
        dueSettleDt:[],
          formItem : {
            brchName: "",
            transBrchNos: [],
            batchNo: "",
            rediscountApplNo: "",
            dealNo: "",
            busiType: "",
            urlType:"",
            remindDays:"",
            billType: "",
            dealStatus:"",
            billClass: "",
            acctStatus: "",
            clearSpeed: "",
            clearType: "",
            settleMode: "",
            buyBrchName: "",
            buyBrchCode: "",
            buyBrchCodeNeed: "", //buyBrchCode没有送到后台，所以加此参数
            minRate: "",
            maxRate: "",
            firstSettleDt: "",
            minFirstSettleDt: "",
            maxFirstSettleDt: "",
            dueSettleDt: "",
            minDueSettleDt: "",
            maxDueSettleDt: "",
            dealStatusList: []
          },
          columns : [
            {
              type: "selection",
              width: 50,
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
              title: this.$t('m.i.common.batchNo'),
              key: "batchNo",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                return h("a", {
                  on: {
                    click: () => {
                      this.showDetilBox(params.row.id, params.row.busiType,params.row.dealStatus);
                    }
                  }
                }, params.row.batchNo);
              }
            }, {
              title: this.$t('m.i.common.busiType'),
              key: "busiType",
              hiddenCol: false,
              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "RediscBusiType", params.row.busiType);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              },
              exportRender(cellData) {
                return getDictValueFromMap(this.dictMap, "RediscBusiType", cellData);
              }
            },
            {
              title: this.$t('m.i.be.rediscountApplNo'),
              key: "rediscountApplNo",
              hiddenCol: false,
              sortable: true,
            }, {
              title: this.$t('m.i.be.applRelId'),
              key: "applRelId",
              sortable: true,
              hiddenCol: false
            }, {
              title: this.$t('m.i.be.dealNo'),
              key: "dealNo",
              hiddenCol: false,
              sortable: true,
            }, {
              title: this.$t('m.i.be.dealDt'),
              key: "dealDt",
              sortable: true,
              hiddenCol: false,
              render:(h, params)=>{
                return h("span", params.row.dealDt ? this.$moment(params.row.dealDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
              }
            }, {
              title: this.$t('m.i.common.dealStatus'),
              key: "dealStatus",
              hiddenCol: false,
              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "RediscApplyStatus", params.row.dealStatus);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              },
              exportRender(cellData) {
                return getDictValueFromMap(this.dictMap, "RediscApplyStatus", cellData);
              }
            }, {
              title: this.$t('m.i.be.firstClearStatus'),
              key: "clearStatus",
              hiddenCol: false,

              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "StlResult", params.row.clearStatus);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              },
              exportRender(cellData) {
                return getDictValueFromMap(this.dictMap, "StlResult", cellData);
              }
            }, {
              title: this.$t('m.i.be.dueClearStatus'),
              key: "dueClearStatus",
              hiddenCol: false,

              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "StlResult", params.row.dueClearStatus);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              },
              exportRender(cellData) {
                return getDictValueFromMap(this.dictMap, "StlResult", cellData);
              }
            }, {
              title: this.$t('m.i.be.firstAcctStatus'),
              key: "acctStatus",
              hiddenCol: false,
              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              }
              },
              {
              title: this.$t('m.i.be.dueAcctStatus'),
              key: "dueAcctFlag",
              hiddenCol: false,

              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.dueAcctFlag);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              }
            }, {
              title: this.$t('m.i.be.brchName'),
              key: "saleBrchName",
              sortable: true,
              hiddenCol: false,

            }, {
              title: this.$t('m.i.be.traderName'),
              key: "saleTraderName",
              sortable: true,
              hiddenCol: false
            }, {
              title: this.$t('m.i.be.pedBrchName'),
              key: "buyBrchName",
              sortable: true,
              hiddenCol: false

            }, {
              title: this.$t('m.i.be.humanDecencyReceiver'),
              key: "buyTraderName",
              sortable: true,
              hiddenCol: false
            }, {
              title: this.$t('m.i.be.humanDecencyCheck'),
              key: "buyCheckTraderName",
              sortable: true,
              hiddenCol: false
            }, {
              title: this.$t('m.i.be.humanDecencyApproval'),
              key: "buyApproveTraderName",
              sortable: true,
              hiddenCol: false
            }, {
              title: this.$t('m.i.billInfo.billType'),
              key: "billType",
              hiddenCol: false,
              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              },
              exportRender(cellData) {
                return getDictValueFromMap(this.dictMap, "DraftTypeCode", cellData);
              }
            }, {
              title: this.$t('m.i.billInfo.billClass'),
              key: "billClass",
              hiddenCol: false,
              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              },
              exportRender(cellData) {
                return getDictValueFromMap(this.dictMap, "CDMedia", cellData);
              }
            }, {
              title: this.$t('m.i.be.tradRate'),
              key: "ratePct",
              sortable: true,
              hiddenCol: false
            }, {
              title: this.$t('m.i.be.clearSpeed'),
              key: "clearSpeed",
              hiddenCol: false,
              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "ClearSpeed", params.row.clearSpeed);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              },
              exportRender(cellData) {
                return getDictValueFromMap(this.dictMap, "ClearSpeed", cellData);
              }
            }, {
              title: this.$t('m.i.be.clearType'),
              key: "clearType",
              hiddenCol: false,
              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "ClearType", params.row.clearType);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              },
              exportRender(cellData) {
                return getDictValueFromMap(this.dictMap, "ClearType", cellData);
              }
            }, {
              title: this.$t('m.i.be.settleMode'),
              key: "settleMode",
              hiddenCol: false,
              render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
            return h("span",
              {
              domProps: {
                title: list
              }
            }, list);
              },
              exportRender(cellData) {
                return getDictValueFromMap(this.dictMap, "SettleType", cellData);
              }
            }, {
              title: this.$t('m.i.be.firstSettleDate'),
              key: "firstSettleDt",
              hiddenCol: false,
              sortable:true,
              render:(h, params)=>{
                return h("span", params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
              }
            }, {
              title: this.$t('m.i.be.dueSettleDt'),
              key: "dueSettleDt",
              sortable: true,
              hiddenCol: false,
              render:(h, params)=>{
                return h("span", params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
              }
            }, {
              title: this.$t('m.i.common.totalAmtBillPackage'),
              key: "totalAmt",
              sortable: true,
              hiddenCol: false,
              render:(h, params)=>{
                return h("span", formatNumber(params.row.totalAmt, 2, ","));
              }
            }, {
              title: this.$t('m.i.be.returnBuyAmtByUnit'),
              key: "buyBackTotalAmt",
              sortable: true,
              hiddenCol: false,
              render:(h, params)=>{
                return h("span", formatNumber(params.row.buyBackTotalAmt, 2, ","));
              }
            }, {
              title: this.$t('m.i.be.payInterestByUnit'),
              key: "firstPayInterest",
              sortable: true,
              hiddenCol: false,
              render:(h, params)=>{
                return h("span", formatNumber(params.row.firstPayInterest, 2, ","));
              }
            }, {
              title: this.$t('m.i.be.firstSettleAmtByUnit'),
              key: "firstSettleAmt",
              sortable: true,
              hiddenCol: false,
              render:(h, params)=>{
                return h("span", formatNumber(params.row.firstSettleAmt, 2, ","));
              }
            }, {
              title: this.$t('m.i.be.dueSettleAmtByUnit'),
              key: "dueSettleAmt",
              sortable: true,
              hiddenCol: false,
              render:(h, params)=>{
                return h("span", formatNumber(params.row.dueSettleAmt, 2, ","));
              }
            }, {
              title: this.$t('m.i.be.tenorDays'),
              key: "tenorDays",
              sortable: true,
              hiddenCol: false
            }, {
              title: this.$t('m.i.common.dealPrcMsg'),
              key: "dealPrcMsg",

              hiddenCol: false
            }, {
              title: this.$t('m.i.common.totalNumBillPackage'),
              key: "totalNum",

              hiddenCol: false
            }
          ],
          brchTreeData : [],
          selectData : [],
          ifShowMore : false,
          acctStatusList : [],
          isDisabled : false,
          brchNameSelectWin : false,
          //showbrch : false,
          tempShowExcelTemplateWin : false,
          param : null,
          rows : null,

          batchid : {
            batchId: ""
          },
          showBills : false,
          batchsUrl : "/be/market/rediscount/rediscountTrackQuery/func_queryBatchs",
          batchUrl : "/be/market/rediscount/rediscountTrackQuery/func_queryBatchById",
          billsUrl : "/be/market/rediscount/rediscountTrackQuery/func_queryBills",
          busiType : "",
          dealStatus : "",
          billImgsUrl : "/be/market/rediscount/rediscountConfirmation/func_queryRediscountSaleImagePage",
          tmpForm:{},
          brchNoWin:false
      };
    },
    components: {
     RedisBillDetil:()=>import(/* webpackChunkName: "be/market/rediscount/redisBillDetil" */`@/views/bizViews/be/market/rediscount/redisBillDetil`),
      //ShowBranch:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`),
      //ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    mounted() {
      this.$nextTick(()=>{
      getDictListByGroups("CreditMajor,StlResult,RediscApplyStatus,AssetIndustry,ImgStatus,RediscBusiType,SettleType,ClearType,ClearSpeed,CDMedia,DraftTypeCode,PreRelationFlag,Yon,AcctFlag,CorpScale,Industry,BillOrigin").then(res => {
        this.busiTypeList = res.get("RediscBusiType");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.clearSpeedList = res.get("ClearSpeed");
        this.assetIndustryList = res.get('AssetIndustry');
        this.acctStatusList = res.get("AcctFlag");
        this.clearTypeList = res.get("ClearType");
        this.settleModeList = res.get("SettleType");
        this.imgStatusList = res.get("ImgStatus");
        this.rediscApplyStatusList = res.get("RediscApplyStatus");
        this.dictMap = res.get("map");
      });
        this.getParams();
      });
    },
    methods: {
      clearVal(type){
        if(type=='moveFirstSettleDt'){
          this.formItem.firstSettleDt = "";
          this.formItem.minFirstSettleDt = "";
          this.formItem.maxFirstSettleDt = "";
        }else if(type=='moveDueSettleDt'){
          this.formItem.dueSettleDt = "";
          this.formItem.minDueSettleDt = "";
          this.formItem.maxDueSettleDt = "";
        }

      },
      transDetail() {
        this.selectData=this.$refs.datagrid.selects;
        if (this.selectData.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.selectData.length < 1){
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseOneData") });
        }
        if (this.selectData.length == 1) {
          this.batchid.batchId = this.selectData[0].id;
          this.busiType = this.selectData[0].busiType;
          this.dealStatus = this.selectData[0].dealStatus;
          this.showBills = true;
        }
      },
      dealExport() {
        this.currentSelectList = this.$refs.datagrid.selects
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if(this.currentSelectList[0].dealStatus!="RS03"){
          this.$msgTip.info(this, { info: "该记录不是成交状态，不能导出成交单" });
          return;
        }
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscountTrackQuery/func_exportDealSale";
        let form = document.createElement("form");
        form.innerHTML = `<input type="text" name="id" value="${this.currentSelectList[0].id}"/>`
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'redSaleTransBatch';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscountTrackQuery/func_exportRedSaleTransList";
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if(this.$refs.datagrid.total == 0){
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = { ids: this.$refs.datagrid.selectIds,pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
          }else {
            params = {
              transBrchNos:this.formItem.transBrchNos,
              batchNo:this.formItem.batchNo,
              rediscountApplNo:this.formItem.rediscountApplNo,
              dealNo:this.formItem.dealNo,
              busiType:this.formItem.busiType,
              billClass:this.formItem.billClass,
              billType:this.formItem.billType,
              dealStatusList:this.formItem.dealStatusList,
              acctStatus:this.formItem.acctStatus,
              clearSpeed:this.formItem.clearSpeed,
              clearType:this.formItem.clearType,
              settleMode:this.formItem.settleMode,
              minRate:this.formItem.minRate,
              maxRate:this.formItem.maxRate,
              minFirstSettleDt:this.formItem.minFirstSettleDt,
              maxFirstSettleDt:this.formItem.maxFirstSettleDt,
              minDueSettleDt:this.formItem.minDueSettleDt,
              maxDueSettleDt:this.formItem.maxDueSettleDt,
              buyBrchName:this.formItem.buyBrchName,
              buyBrchCode:this.formItem.buyBrchCode,
              field: field,
              exportType: exportType,
              excelName: this.param,
              pageSize:pageSize
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
        }else {
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscountTrackQuery/func_exportRedSaleTransList";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscountTrackQuery/func_exportRedSaleTransList";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'pageSize';
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1)
            }
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },

      closeBranch() {
        this.showbrch = false;
      },
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
        }
        this.formItem.buyBrchCode = info.brchCode;
        this.formItem.buyBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },
      brchNameAdd() {
        let s = "";
        let nodes = this.$refs.brchTree.getCheckedNodes();
        this.formItem.transBrchNos = [];
        nodes.forEach(x => {
          s = s + x.title + ",";
          this.formItem.transBrchNos.push(x.id);
        });
        this.formItem.brchName = s.slice(0, s.length - 1);
        this.brchNameSelectWin = false;
      },
      minRateVaild() {
        this.formItem.minRate = this.formItem.minRate.trim();
        if (this.formItem.minRate.length != 0 && Number(this.formItem.minRate)) {
          let min = Number(this.formItem.minRate);
          if (min < 0 || min > 100) {
            this.$msgTip.info(this, { info: "利率：0~100(最多4位小数)" });
            this.formItem.minRate = "";
          }
          if (this.formItem.maxRate.length != 0 && Number(this.formItem.maxRate)) {
            let max = Number(this.formItem.maxRate);
            if (min > max) {
              this.$msgTip.info(this, { info: "最大值不能小于最小值" });
              this.formItem.minRate = "";
            }
          }
        } else {
          this.formItem.minRate = "";
        }
      },
      maxRateVaild() {
        if (this.formItem.maxRate.length != 0 && Number(this.formItem.maxRate)) {
          let max = Number(this.formItem.maxRate);
          if (max < 0 || max > 100) {
            this.$msgTip.info(this, { info: "利率：0~100(最多4位小数)" });
            this.formItem.maxRate = "";
          }
          if (this.formItem.minRate.length != 0 && Number(this.formItem.minRate)) {
            let min = Number(this.formItem.minRate);
            if (min > max) {
              this.$msgTip.info(this, { info: "最大值不能小于最小值" });
              this.formItem.maxRate = "";
            }
          }
        } else {
          this.formItem.maxRate = "";
        }
      },
      formSearch() {
        this.$nextTick(() => {
          /**清除多页选择的数据*/
          this.$refs.datagrid.selectIds=[];
          this.$refs.datagrid.selects=[];
          //设置清单导出时所需的查询条件
          this.tmpForm=JSON.parse(JSON.stringify(this.formItem));
          this.$refs.datagrid.dataChange(1);
        });
      },
      handleFirstSettleDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minFirstSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxFirstSettleDt = arr[1].replace(/-/g, "");
          this.firstSettleDt = [arr[0],arr[1]];
        }else {
          this.formItem.minFirstSettleDt = "";
          this.formItem.maxFirstSettleDt = "";
          this.firstSettleDt = [];
        }
      },
      handleDueSettleDtChange(arr){
        if (arr && arr.length === 2) {
          this.formItem.minDueSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueSettleDt = arr[1].replace(/-/g, "");
          this.dueSettleDt = [arr[0],arr[1]];
        } else {
          this.formItem.minDueSettleDt = "";
          this.formItem.maxDueSettleDt = "";
          this.dueSettleDt = [];
        }
      },
      formSearchReset() {
        this.firstSettleDt = [];
        this.dueSettleDt = [];
        this.$refs.formItem.resetFields();
        this.formItem.buyBrchCode = "";
        this.formItem.buyBrchCodeNeed = "";
        this.formItem.buyBrchName = "";
        this.formItem.transBrchNos = [];
        this.formItem.dealStatusList = [];
        this.formItem.minRate = "";
        this.formItem.maxRate = "";
        this.formItem.minFirstSettleDt = "";
        this.formItem.minDueSettleDt = "";
        this.formItem.maxFirstSettleDt = "";
        this.formItem.maxDueSettleDt = "";
        this.formItem.transBrchNos=[];
        this.formItem.busiType='';
        this.formItem.urlType='';
        this.formItem.remindDays='';
      },
      closeMsgBox() {
        this.showBills = false;
      },
      showDetilBox(redisBatchId, busiType,dealStatus) {
        this.batchid.batchId = redisBatchId;
        this.busiType = busiType;
        this.dealStatus = dealStatus;
        this.showBills = true;
      },
      getParams(){
        if (this.$route.path === "/be/market/rediscount/rediscountTrackQuery") {
          if (this.$route.query.dueSettleDt1) {
            let dueSettleDt1 = this.$moment(this.$route.query.dueSettleDt1, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.dueSettleDt = [dueSettleDt1, dueSettleDt1];
            this.$nextTick(() => {
              this.formSearch();
            });
          }
        }
      }
    },
    watch: {
      "$route": "getParams"
    },
  };

</script>
