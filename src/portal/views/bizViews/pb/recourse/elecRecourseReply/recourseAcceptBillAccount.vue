<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-form-item prop="minBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-form-item prop="maxBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                  </h-row>
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
            highlight-row
            url="/pb/recourse/recourseAcceptBillAccount/func_queryAccountContingentRecourseBill"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account()">{{$t('m.i.be.acct')}}</h-button>
              <h-button type="primary" @click="recording()">{{$t('m.i.be.recordingInfo')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击查看详情弹出窗-->
    <h-msg-box v-model="recordingPayWin" width="800" :mask-closable="false" :maximize="true">
      <p slot="header">
        <span>收款人信息补录</span>
      </p>
      <h-panel>
        <h-form :model="recordingPayForm" :label-width="115" ref="recordingPayForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.pyeeAcctNo')" prop="recourseAcctNo" required :validRules="validAcctNoRules">
            <h-input v-model="recordingPayForm.recourseAcctNo" :maxlength=32></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.pyeeName')" prop="recourseName" required>
            <h-input v-model="recordingPayForm.recourseName" :maxlength=60 :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.pyeeBankNo')" prop="recourseBankNo" required :validRules="validRules">
            <h-input v-model="recordingPayForm.recourseBankNo" :maxlength=12></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.pyeeBankName')" prop="recourseBankName" required>
            <h-input v-model="recordingPayForm.recourseBankName" :maxlength=60 :lengthByByte="false"></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="recordingClose">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" @click="recordingSubmitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <acct-record :param="param" :url="acctRecord" :submitFlag="acctSubmitFlag"
                 :show-acct-record-win="showAcctRecordWin" @acctSubmitSure="acctRecordSure"
                 @showAcctRecordWinClose="showAcctRecordWinClose"
                 :showPrintButton="showPrintButton" @printSuccessCallback="printSuccessCallback"></acct-record>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off,formatNumber,getDictValueFromMap,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "recourseAcceptBillAccount",
    components: {
      RecourseAcceptHist: () => import(/* webpackChunkName: "be/trust/recourse/recourseAcceptHist" */`@/views/bizViews/be/trust/recourse/recourseAcceptHist`),
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
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
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params);
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.recoveryType'),
            key: "recourseType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "InRcrsTypeCode", params.row.recourseType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.recourseRemark'),
            key: "recourseRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "recourseAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: "recourseBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "recourseName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankName'),
            key: "recourseBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        contingentRecourseDate:[],
        validRules: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "只能输入数字,且长度为12位" }],
        validAcctNoRules: [{ test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "只能输入数字和字母,且长度最大为32位" }],
        formItem: {
          billOrigin: "",
          billNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          prstBranchName: "",
          prsttnBrchCode: "",
          hldrBranchName: "",
          hldrBrchCode: "",
          minBillMoney: "",
          maxBillMoney: "",
          minContingentRecourseDate: "",
          maxContingentRecourseDate: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        billOriginList: [],
        recordingPayWin: false,
        isRequired: true,
        dictMap: new Map(),
        ifShowMore: false,
        //showCpesBranch: false,
        showBillInfoWin: false,
        //showCpesBranchTwo: false,
        selectData: [],
        param: {},
        showAcctRecordWin: false,
        showPrintButton: false,
        acctSubmitFlag: false,
        currentSelectRow:[],
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        accountUrl: "/pb/recourse/recourseAcceptBillAccount/func_submitSaveContingentRecourseBill",
        acctRecord: "/pb/recourse/recourseAcceptBillAccount/func_recourseAcceptQueryAcctRecord",
        histId: "",
        billNo: "",
        billRangeStart:"",
        billRangeEnd:"",
        billId: "",
        histUrl: "be/trust/recourse/recourseAcceptBillAccount/func_queryHistInfo",
        recordingPayForm: {
          id: "",
          recourseName: "",
          recourseAcctNo: "",
          recourseBankNo: "",
          recourseBankName: ""
        }
      };
    },
    methods: {
      showBillInfo(params){
        this.billId = params.row.billId;
        this.billNo = params.row.billNo;
        this.billRangeStart = params.row.billRangeStart;
        this.billRangeEnd = params.row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      //行选中
      handleSelectClick(selection, selectInx) {
        this.selectData = selection;
      },
      formSearch() {

        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      handleContingentRecourseDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minContingentRecourseDate = arr[0].replace(/-/g, "");
          this.formItem.maxContingentRecourseDate = arr[1].replace(/-/g, "");
          this.contingentRecourseDate = [arr[0],arr[1]];
        } else {
          this.formItem.minContingentRecourseDate = "";
          this.formItem.maxContingentRecourseDate = "";
          this.contingentRecourseDate = [];
        }
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.contingentRecourseDate = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
        this.formItem.prsttnBrchCode = "";
        this.formItem.prstBranchName = "";
        this.formItem.hldrBrchCode = "";
        this.formItem.hldrBranchName = "";
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
        this.showPrintButton = false;
        this.showAcctRecordWin = false;
      },
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      acctRecordSure(info) {
        this.acctSubmitFlag = true;
        post({ id: info.id ,ownedBrchNo:info.ownedBrchNo,licenseFlag:this.licenseFlag }, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "操作成功" });
              this.showPrintButton = true;
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              if (!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      account() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定记账吗?",
            onOk: () => {
              let recourseType = this.currentSelectRow.recourseType;
              let recourseAcctNo = this.currentSelectRow.recourseAcctNo;
              let recourseBankNo = this.currentSelectRow.recourseBankNo;
              let recourseBankName = this.currentSelectRow.recourseBankName;
              let recourseName = this.currentSelectRow.recourseName;
              if (recourseType == "BC1402" && (recourseAcctNo == "" || recourseBankNo == "" || recourseBankName == "" || recourseName == ""
                || recourseAcctNo == null || recourseBankNo == null || recourseBankName == null || recourseName == null)) {
                this.$msgTip.info(this, { info: "线下被追索记账，必须输入收款人名称、收款人账号、收款人行号、收款人行名" });
                return;
              }
              this.param = { id: this.currentSelectRow.id,ownedBrchNo:this.currentSelectRow.ownedBrchNo,licenseFlag:this.licenseFlag };
              this.showAcctRecordWin = true;//分录弹出框
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      recording() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (this.currentSelectRow.recourseType == "BC1402"){
            this.recordingPayWin = true;
            this.recordingPayForm.id = this.currentSelectRow.id;
            this.recordingPayForm.recourseName = this.currentSelectRow.recourseName;
            this.recordingPayForm.recourseAcctNo = this.currentSelectRow.recourseAcctNo;
            this.recordingPayForm.recourseBankNo = this.currentSelectRow.recourseBankNo;
            this.recordingPayForm.recourseBankName = this.currentSelectRow.recourseBankName;
          }else {
            this.$msgTip.info(this, { info: "线上追索无需补录收款人账号" });
          }
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      recordingSubmitForm() {
        this.$refs['recordingPayForm'].validate((valid) => {
          if (valid) {
            post(this.recordingPayForm, "/pb/recourse/recourseAcceptBillAccount/func_recordingPay").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: "操作成功" });
                  this.recordingPayWin = false;
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);

                } else {
                  this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: "操作失败" });
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
              }
            });

          }
        })
      },
      recordingClose() {
        this.recordingPayWin = false;
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.$refs.recordingPayForm.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
    },
    mounted() {
      this.getDictListByGroups("RiskStatus,CashStatus,MmbStlStatus,BarterTrustStatus,SendRecourseType,DishonorCode,SignUpMarkCode,RecourseType,StlResult,IsAcctSuccess,BillOrigin,InRcrsTypeCode").then(res => {
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };
</script>

<style scoped>

</style>
