<template>
  <!--电票贴现申请拒绝-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="discRefusedBatchMain" key="1">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                 <!--<own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWinOpen" v-if="this.licenseFlag"></own-brch-nos>-->
                  <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                               :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                               url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <cust-name :formItem = "formItem" @queryCustMessage="queryCustMessage"></cust-name>
                  <cust-acct-no :formItem = "formItem" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no>
                  <query-btn v-on:showChange="showQry" :advanceShow="this.licenseFlag" :formSearch='handleSearch' :formSearchReset='resetSearch'></query-btn>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                url="/ce/disc/elec/refuse/eDiscRefusedBillMain/func_pageQueryRefusedDsicBatchList"
                :on-current-change="handleSelectClick"
                :on-current-change-cancel="handleSelectClickCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <bill-manage-btn @handleForm="handleForm"></bill-manage-btn>
                </div>
              </h-datagrid>
              <!-- 查询客户信息弹窗 -->
              <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
              <!-- 查询客户账号信息弹窗 -->
              <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo" :isAllBankAcct=true
                                 @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
            </div>
          </div>
        </div>
        <div v-if="discRefusedBillMain" key="2">
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="billFormItem" :label-width="90" ref="billFormItem" cols="4" class="h-form-search">
                <common-select v-model="billFormItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="billFormItem.billNo"></bill-no>
                <bill-range :formItem="billFormItem" :rangeProps="['billRangeStart','billRangeEnd']"></bill-range>
                <common-select v-model="billFormItem.otherBankDiscMark" :label="$t('m.i.ce.otherBankDisc')"
                               prop="otherBankDiscMark" :dictList="isList"></common-select>
                <query-btn :advanceShow='false' :formSearch='billManagerHandleSearch' :formSearchReset='billManagerResetSearch' formClassAdd="2"></query-btn>
              </h-form>
            </h-panel>
          </div>
        </div>
        <disc-refused-info-detail :is-show="discRefusedBillMain"
                                  :view-detail-form="viewDetailForm"></disc-refused-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="discRefusedBillMain" key="3">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billFormItem"
            url="/ce/disc/elec/refuse/eDiscRefusedBillMain/func_pageQueryRefusedDsicBillList"
            :row-select="true"
            paramId="hldrId"
            :has-select="hasSelect"
            ref="discRefusedBillDatagrid">
            <div slot="toolbar">
              <disc-refuse-btn @refuse="refusedBatch"></disc-refuse-btn>
              <go-back-btn @returnBack="returnBack"></go-back-btn>
            </div>
          </h-datagrid>
        </div>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"  :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>



  </div>
</template>

<script>
  import { post, on, off ,getDictListByGroups ,accMul,getDictValueFromMap , formatNumber,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "eDiscRefusedBillMain",
    components: {
      DiscRefusedInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/discRefusedInfoDetail" */`@/views/bizViews/ce/disc/common/discRefusedInfoDetail`) ,
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)
    },
    data() {
      let columns= [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
           title: this.$t("m.i.billInfo.discDt"),
          key: "discDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.discDt == null || params.row.discDt === ""){
              return "";
            }
            let date = this.$moment(params.row.discDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "ratePct",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.discountType"),
          key: "transName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.redeemOpenDt"),
          key: "redeemOpenDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.redeemOpenDt == null || params.row.redeemOpenDt === ""){
              return "";
            }
            let date = this.$moment(params.row.redeemOpenDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.redeemDueDt"),
          key: "redeemDueDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.redeemDueDt == null || params.row.redeemDueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.redeemDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.redeemRate"),
          key: "redeemRatePct",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.clearMark"),
          key: "clearMark",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"SettlementMarkCode",params.row.clearMark);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: "sumCount",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
          key: "sumMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let sumMoney = formatNumber(params.row.sumMoney, 2, ',');
            return h("span", {
              domProps: {
                title: sumMoney
              }
            }, sumMoney);
          }
        },
      ];
      let billColumns = [
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
          align:'center',
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
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
          sortable: true,
          align:'center',
          hiddenCol: false,
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
          align:'center',
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
          title: this.$t("m.i.ce.otherBankDisc"),
          key: "isInner",
          hiddenCol: false,
          render:(h,params) => {
            if (params.row.platformFlag == null || params.row.platformFlag === "") {
              return h("span", "");
            } else if (params.row.platformFlag === "0" || params.row.platformFlag === "1") {
              return h("span", "是");
            } else {
              return h("span", "否");
            }
          }
        },
        {
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "ratePct",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          hiddenCol: false
        },
        {
           title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: "remitDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.remitDt == null || params.row.remitDt === ""){
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
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
            let billMoney = formatNumber(params.row.billMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.billInfo.banEndrsmtMark"),
          key: "banEndrsmtMark",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"BanEndorsementMarkCode",params.row.banEndrsmtMark);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
      ];
      return {
        formItem : {
          custName: "",
          custAcctNo: "",
          custNo:"",
          batchNo:"",
          authPath:this.$route.path ,
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
        },
        billFormItem : {
          billNo:"",
          isInner:"",
          custAcctNo:"",
          discDt:"",
          billType:"",
          billClass:"",
          transNo:"",
          clearMark:"",
          banEndrsmtMark:"",
          aoAcctBankNo:"",
          rate:"",
          isSameLegal:"",
          otherBankDiscMark:"",
          licenseFlag:"",
          ownedBrchNo:"",
          billRangeStart:"",
          billRangeEnd:"",
          billOrigin:""
        },
        columns : columns,
        billColumns : billColumns,
        isList : [],
        billOriginList : [],
        busiTypeList : [],
        dictMap : new Map(),
        discRefusedBatchMain : true,
        discRefusedBillMain : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        ifShowMore : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        viewDetailForm : {},
        //brchNoWin:false,
        licenseFlag:false,
        authPath:this.$route.path,
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        billRangeStart:"",
        billRangeEnd:"",
        hasSelect : false,
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billColumns),
      };
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,SettlementMarkCode,SettleType,BanEndorsementMarkCode,BillOrigin").then(res => {
        this.isList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        let dictList = [];
        let settlementMarkCodeList = res.get("SettlementMarkCode");
        let settleTypeList =res.get("SettleType");
        for (let i = 0; i < settlementMarkCodeList.length+settleTypeList.length; i++) {
          if(i< settlementMarkCodeList.length){
            dictList[i]=settlementMarkCodeList[i];
          }
          if(settlementMarkCodeList.length<=i){
            let obj = settleTypeList[i-settlementMarkCodeList.length];
            obj.dictGroupCode="SettlementMarkCode";
            res.get("map").get(obj.dictGroupCode).set(obj.key,obj.value);
            dictList[i]= obj;
          }
        }
        res.set("SettlementMarkCode",dictList);
        this.dictMap = res.get("map");
      });
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let  columns = [];
            if (this.licenseFlag) {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.temp = this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      showQry(val){
        this.ifShowMore = val;
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "custAcctNo"){
          this.formItem.custAcctNo = "";
        }
      },
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        // this.$refs.formItem.resetFields();
        this.formItem.custNo = '';
        this.formItem.custName = '';
        this.formItem.ownedBrchNos = '';
        this.formItem.ownedBrchNames = '';
        this.formItem.custAcctNo = '';
        this.formItem.batchNo = '';
        this.billFormItem.billOrigin = '';
        this.billFormItem.billNo = '';
        this.billFormItem.billRangeStart = '';
        this.billFormItem.billRangeEnd = '';
        this.billFormItem.otherBankDiscMark = '';
        this.billFormItem.isInner = '';
        this.billFormItem.isSameLegal = '';
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      handleSelectClickCancel() {
        this.currentSelectList = [];
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.hasSelect = false;
        this.$refs.discRefusedBillDatagrid.selects = [];
        this.$refs.discRefusedBillDatagrid.selectIds = [];
        this.$refs.discRefusedBillDatagrid.dataChange(1);
      },
      //票据管理界面重置
      billManagerResetSearch(){
        this.billFormItem.otherBankDiscMark = "";
        this.billFormItem.isInner = '';
        this.billFormItem.isSameLegal = '';
        this.$refs.billFormItem.resetFields();
      },
      //票据管理界面行选中
      discRefusedBillHandleSelectClick(arr, selectInx) {
        this.currentBillSelectList = arr;
        this.currentBillSelectRowInx = selectInx;
      },
      //是否跨行贴现
      changeIsInner(){
        // 1是 0否
        if(this.billFormItem.otherBankDiscMark ==='0'){
          this.billFormItem.isInner = '1';
          this.billFormItem.isSameLegal = '1';
        }else if (this.billFormItem.otherBankDiscMark ==='1'){
          this.billFormItem.isInner = '';
          this.billFormItem.isSameLegal = '0';
        }else{
          this.billFormItem.isInner = '';
          this.billFormItem.isSameLegal = '';
        }
      },
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //票据管理
      handleForm() {
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.billFormItem.custAcctNo = this.currentSelectList.custAcctNo;
        this.billFormItem.discDt = this.currentSelectList.discDt;
        this.billFormItem.billType = this.currentSelectList.billType;
        this.billFormItem.billClass = this.currentSelectList.billClass;
        this.billFormItem.transNo = this.currentSelectList.transNo;
        this.billFormItem.clearMark = this.currentSelectList.clearMark;
        this.billFormItem.banEndrsmtMark = this.currentSelectList.banEndrsmtMark;
        this.billFormItem.aoAcctBankNo = this.currentSelectList.aoAcctBankNo;
        this.billFormItem.rate = this.currentSelectList.rate;
        this.billFormItem.redeemOpenDt = this.currentSelectList.redeemOpenDt;
        this.billFormItem.redeemDueDt = this.currentSelectList.redeemDueDt;
        this.billFormItem.licenseFlag = this.licenseFlag;
        this.billFormItem.ownedBrchNo = this.currentSelectList.ownedBrchNo;
        this.viewDetailForm = this.currentSelectList;
        if(this.viewDetailForm.rate != null && this.viewDetailForm.rate !== ""){
          this.viewDetailForm.rate = accMul(this.viewDetailForm.rate, 100) + "(%)";
        }
        this.discRefusedBatchMain = false;
        this.discRefusedBillMain = true;
        this.$nextTick(() => {
          this.billManagerHandleSearch();
          this.billColumns = this.deepClone(this.billTemp);
          this.$refs.discRefusedBillDatagrid.selfAdaption();
          this.$refs.discRefusedBillDatagrid.createShowCol(this.billTemp);
        });
      },
      //返回
      returnBack() {
        this.resetSearch();
        this.currentSelectList = [];
        this.currentBillSelectList = [];
        this.discRefusedBillMain = false;
        this.discRefusedBatchMain = true;
        this.$nextTick(() => {
          this.columns = this.deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
        });
      },
      //票据管理中拒绝按钮
      refusedBatch() {
        if (this.$refs.discRefusedBillDatagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定拒绝吗？",
          onOk: () => {
            this.handleRefusedBatch();
          }
        });
      },
      handleRefusedBatch() {
        let list = this.$refs.discRefusedBillDatagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].transId;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ transIds: ids }, "/ce/disc/elec/refuse/eDiscRefusedBillMain/func_refuseBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              if(this.$refs.discRefusedBillDatagrid.total === this.$refs.discRefusedBillDatagrid.selects.length) {
                this.returnBack();
              }else{
                // this.$refs.discRegisterInfoDetail.getBatchInfo();
                this.$refs.discRefusedBillDatagrid.dataChange(this.$refs.discRefusedBillDatagrid.pageInfo.pageNo);
                this.currentBillSelectList = [];
                this.$refs.discRefusedBillDatagrid.selects = [];
                this.$refs.discRefusedBillDatagrid.selectIds = [];
              }
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.discRefusedBillDatagrid.dataChange(this.$refs.discRefusedBillDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },


    }
  };
</script>

<style scoped>

</style>
