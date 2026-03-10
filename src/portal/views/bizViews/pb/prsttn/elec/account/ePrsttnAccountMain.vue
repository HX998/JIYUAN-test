<template>
  <!--电票提示付款记账-->
  <div class="layout">
    <div>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <show-branch
                    v-model="formItem.ownedBrchNames" :label="$t('m.i.common.ownedBrchNo')"
                    prop="ownedBrchNames"
                    v-if="licenseFlag" :showCheckBox="true" :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                    :params="{authPath:this.$route.path}"
                    url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                    queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <!-- 票据类型 -->
                  <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                  <!-- 逾期标识 -->
                  <common-select v-model="formItem.isOverdue" :label="$t('m.i.billInfo.overdueFlag')" prop="isOverdue"
                                 :dictList="YonList"></common-select>
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
                  <!-- 票据金额 -->
                  <bill-money-range v-model="formItem" :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label"
                                    :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false"></bill-money-range>
                  <!-- 出票日 -->
                  <remit-dt-range v-model="remitDt" :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt"></remit-dt-range>
                  <!-- 汇票到期日 -->
                  <due-dt-range v-model="dueDt" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlightRow
                :bindForm="formItem"
                url="/pb/prsttn/elec/account/ePrsttnAccountMain/func_pageQueryPrsttnBill"
                :row-select="true"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="allReceiveAcct()">{{$t('m.i.ce.allReceiveAcct')}}</h-button>
                  <h-button type="primary" v-if="showPartAcct && (childrenBtnAuth.showPartReceiveAcctButton === undefined ? true : childrenBtnAuth.showPartReceiveAcctButton.isShow)"
                            @click="partReceiveAcct()">{{$t('m.i.ce.partReceiveAcct')}}</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
          <!-- 分录弹框 -->
          <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :show-acct-record-win="this.showAcctRecordWin" :showPrintButton="this.showPrintButton"
                       @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose" :submitFlag="this.acctSubmitFlag"
                       @printSuccessCallback="printSuccessCallback" :licenseFlag="licenseFlag" :ownedBrchNo="ownedBrchNo"></acct-record>

          <!--票面信息-->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                          :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
          <!--  部分回款记账页面-->
          <h-msg-box v-model="addOrEditWin" width="500" class="h-form-search-layer" :maximize="true" :mask-closable="false" on-close="handleClose">
            <p slot="header">
              <span>部分回款</span>
            </p>
            <h-panel>
              <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search" onlyBlurRequire>
                <!--票据(包)号码-->
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="addOrEditForm.billNo" prop="billNo" :readonly="true" :required="true"></bill-no>
                <!--子票区间-->
                <common-input :label="$t('m.i.billInfo.billRange')" v-model="addOrEditForm.billRange" prop="billRange" :readonly="true" :required="true" ></common-input>
                <!--票据(包)金额(元)-->
                <common-input :label="$t('m.i.billInfo.billPackageMoney')" v-model="addOrEditForm.billMoney" prop="billMoney"
                              :readonly="true" :required="true" @on-blur="formatBillMoney('blur', 'billMoney')"></common-input>
                <!--已回款金额(元)-->
                <common-input :label="$t('m.i.billInfo.returnMoney')" v-model="addOrEditForm.returnMoney" prop="returnMoney"
                              :readonly="true" :required="true" @on-blur="formatBillMoney('blur', 'returnMoney')"></common-input>
                <!--未回款金额(元)-->
                <common-input :label="$t('m.i.billInfo.noReturnMoney')" v-model="addOrEditForm.noReturnMoney" prop="noReturnMoney"
                              :readonly="true" :required="true" @on-blur="formatBillMoney('blur', 'noReturnMoney')"></common-input>
                <!--本次回款金额(元)-->
                <common-input :label="$t('m.i.billInfo.thisReturnMoney')" v-model="addOrEditForm.thisReturnMoney" prop="thisReturnMoney"
                              :required="true" @on-blur="formatBillMoney('blur', 'thisReturnMoney')"
                              @on-focus="formatBillMoney('focus', 'thisReturnMoney')" :validRules="thisReturnMoneyRule"></common-input>
              </h-form>
            </h-panel>
            <div slot="footer">
              <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary"  @click="submit()">{{$t("m.i.common.submit")}}</h-button>
            </div>
          </h-msg-box>
        </h-col>
      </h-row>
    </div>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "ePrsttnAccountMain",
    components: {
    },
    data() {
      return {
        licenseFlag:false,
        authPath: this.$route.path ,
        ownedBrchNo:"",
        formItem : {
          billType:"",
          billClass:"ME02",
          isOverdue:"",
          reverseBillNo:"",
          acptBankName:"",
          minBillMoney:"",
          maxBillMoney:"",
          minRemitDt:"",
          maxRemitDt:"",
          minDueDt:"",
          maxDueDt:"",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          inOutFlagList: ["1", "3"],
          curFuncNo:"PICE040202",
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
          orderByClause:"prsttn_dt asc,id desc"
        },
        columns : [
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
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
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
            title: this.$t("m.i.billInfo.returnMoney"),
            key: "returnMoney",

            sortable: true,
            hiddenCol: true,
            render: (h, params) => {
              let returnMoney = formatNumber(params.row.returnMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: returnMoney
                }
              }, returnMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.noReturnMoney"),
            key: "noReturnMoney",

            sortable: true,
            hiddenCol: true,
            render: (h, params) => {
              let noReturnMoney = formatNumber(params.row.noReturnMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: noReturnMoney
                }
              }, noReturnMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.overdueFlag"),
            key: "isOverdue",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"Yon",params.row.isOverdue);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.be.clearType"),
            key: "clearMark",
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"SettleType",params.row.clearMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
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
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: remitDt}},  remitDt);
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
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span",{domProps: {title: dueDt}},   dueDt);
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
            title: this.$t("m.i.ce.prsttnDt"),
            key: "prsttnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.prsttnDt == null || params.row.prsttnDt === ""){
                return "";
              }
              let prsttnDt = this.$moment(params.row.prsttnDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span",{domProps: {title: prsttnDt}},   prsttnDt);
            }
          },
          {
            title: this.$t("m.i.ce.prsttnStatus"),
            key: "prsttnStatus",
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"PrsnttnStatusCode",params.row.prsttnStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.prsttnReceiveAmt"),
            key: "prsttnReceiveAmt",
            sortable: true,
            render: (h, params) => {
              if(params.row.prsttnReceiveAmt === "" || params.row.prsttnReceiveAmt === null){
                return h("span", "-");
              }
              let prsttnReceiveAmt = formatNumber(params.row.prsttnReceiveAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: prsttnReceiveAmt
                }
              }, prsttnReceiveAmt);
            }
          },
        ],
        ifShowMore : false,
        dictMap : new Map(),
        billTypeList : [],
        YonList : [],
        billClassList : [],
        billOriginList : [],
        addOrEditWin : false,
        showPartAcct:false,
        addOrEditForm :{
          billNo:"",
          billRange:"",
          billMoney:"",
          returnMoney:"",
          noReturnMoney:"",
          thisReturnMoney:"",
        },
        currentSelectList : [],
        currentSelectRowInx : [],
        remitDt : [],
        dueDt : [],
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        billRangeStart: "",
        billRangeEnd: "",
        //分录
        acctRecordUrl : "",
        acctRecordParam : {},
        showAcctRecordWin : false,
        batchId : "",
        ids : "",
        acctSubmitFlag : false,
        showPrintButton : false,
        hasSelect : false,
        childrenBtnAuth:"",
        thisReturnMoneyRule: [{ test: this.validateThisReturnMoney, trigger: "blur" }],
      }
    },
    created(){
      //集中操作授权
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let  columns = [];
            if (this.licenseFlag) {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.columns=this.deepClone(columns);
            this.$refs.datagrid.createShowCol(this.columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    mounted() {

      this.getDictListByGroups("DraftTypeCode,CDMedia,Yon,SettleType,PrsnttnStatusCode,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.YonList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
        this.getShowPartAcct();
      });

      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if(this.btnAuth.manager!=null&&this.btnAuth.manager!=undefined){
              if(this.btnAuth.manager.children!=null&&this.btnAuth.manager.children!=undefined) {
                this.childrenBtnAuth = this.btnAuth.manager.children;
              }
            }
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      handleClose(){
        this.addOrEditWin = false;
        this.addOrEditForm.thisReturnMoney="";
      },
      getShowPartAcct() {
        let paramKey = "be.trust.prsnttn_part_acct";
        post({ paramKey :paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let param = res.data.retData;
              this.showPartAcct = param === "1";
              if(this.showPartAcct){
                this.$nextTick(() => {
                  this.columns.forEach(element => {
                    if (element.key === "returnMoney") {
                      element.hiddenCol = false;
                    } else if (element.key === "noReturnMoney") {
                      element.hiddenCol = false;
                    }
                  });
                });
              }
            } else {
              this.showPartAcct = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formatMinBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
            this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        }
      },
      formatMaxBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        }
      },
      formatBillMoney(optType, field) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addOrEditForm[field])) && isFinite(this.addOrEditForm[field])) {
            this.addOrEditForm[field] = this.addOrEditForm[field] == null ? "0.00" : formatNumber(this.addOrEditForm[field], 2, ",");
          }
        } else if (optType === "focus") {
          this.addOrEditForm[field] = this.addOrEditForm[field].toString().replace(/,/g, "");
        }
      },
      validateThisReturnMoney(rule, val, callback) {
        let noReturnMoney = this.addOrEditForm["noReturnMoney"].toString().replace(/,/g, "");
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if(value > 0 && Number(value) <= Number(noReturnMoney)){
            callback();
          }else{
            callback(new Error("本次回款金额应小于等于未回款金额[" + this.addOrEditForm["noReturnMoney"] + "]、大于0.00"));
          }
        } else {
          callback(new Error("本次回款金额为大于0.00的不超过100万的数字，且小数位不超过两位"));
        }
      },
      handleMinRemitChange(value){
        this.formItem.minRemitDt = value.replace(/-/g, "");
      },
      handleMaxRemitChange(value){
        this.formItem.maxRemitDt = value.replace(/-/g, "");
      },
      handleMinDueChange(value){
        this.formItem.minDueDt = value.replace(/-/g, "");
      },
      handleMaxDueChange(value){
        this.formItem.maxDueDt = value.replace(/-/g, "");
      },
      //查询
      handleSearch() {
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.ownedBrchNames = "";
        this.formItem.ownedBrchNos = "";
        this.remitDt = [];
        this.dueDt = [];
      },
      // 行选中
      handleSelectClick(arr , selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      //记账按钮
      allReceiveAcct(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }

        let list=this.$refs.datagrid.selects
        let ownedBrchNo=list[0].ownedBrchNo;
        let flag=list.some( item => item.ownedBrchNo !== ownedBrchNo)
        if (flag) {
          this.$msgTip.info(this, { info: "请选择相同的机构下的票据" });
          return;
        }
        this.ownedBrchNo=ownedBrchNo
        // this.batchId = list[0].batchId;
        this.ids = this.$refs.datagrid.selectIds.join(",");
        post({ ids:this.ids , accountType:"1" }, "/pb/prsttn/elec/account/ePrsttnAccountMain/func_regReceiveMoney").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              // this.$msgTip.success(this, { info: msg });
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.queryRecord("1","");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //记账按钮
      partReceiveAcct(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        if (this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        this.ownedBrchNo=this.$refs.datagrid.selects[0].ownedBrchNo
        this.addOrEditWin = true;
        this.$nextTick(() => {
          let obj = this.$refs.datagrid.selects[0];
          this.addOrEditForm.billNo=obj.billNo;
          this.addOrEditForm.billRange = formatBillRange(obj.billOrigin, obj.billRangeStart, obj.billRangeEnd);
          this.addOrEditForm.billMoney=obj.billMoney;
          this.addOrEditForm.returnMoney=obj.returnMoney;
          this.addOrEditForm.noReturnMoney=obj.noReturnMoney;
          this.formatBillMoney('blur', 'billMoney');
          this.formatBillMoney('blur', 'returnMoney');
          this.formatBillMoney('blur', 'noReturnMoney');
        });

      },
      submit(){
        this.$refs['addOrEditForm'].validate((valid) => {
          if (valid) {
            this.ids = this.$refs.datagrid.selectIds.join(",");
            let receiveMoney = this.addOrEditForm.thisReturnMoney.replace(/,/g, "");
            post({ ids:this.ids, accountType:"0" ,receiveMoney:receiveMoney}, "/pb/prsttn/paper/account/pPrsttnAccountMain/func_regReceiveMoney").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  // this.$msgTip.success(this, { info: msg });
                  // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.queryRecord("0",receiveMoney);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }})

      },
      queryRecord(accountType,receiveMoney){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账吗？",
          onOk: () => {
            this.addOrEditWin = false;
            this.addOrEditForm.thisReturnMoney="";
            this.getEntryInfo(accountType,receiveMoney);
            this.currentSelectList = [];
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
          }
        });
      },
      //获取分录信息
      getEntryInfo(accountType,receiveMoney) {
        this.acctRecordUrl = "/pb/prsttn/elec/account/ePrsttnAccountMain/func_generateAcctRecord";
        this.acctRecordParam = {  ids:this.ids ,accountType:accountType ,billClass:"ME02",receiveMoney:receiveMoney,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo};
        this.showAcctRecordWin = true;
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.ids = "";
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ ids:this.ids ,accountType:info.accountType,billClass:"ME02",receiveMoney:info.receiveMoney,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo  }, "/pb/prsttn/elec/account/ePrsttnAccountMain/func_submitPrsttnAccount").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: msg });
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
              // this.showAcctRecordWinClose();
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              // this.ids = "";
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //票面信息关闭
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(row) {
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
