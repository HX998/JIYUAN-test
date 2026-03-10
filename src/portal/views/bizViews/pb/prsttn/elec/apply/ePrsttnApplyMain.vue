<template>
  <!--电票提示付款申请-->
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
                  <common-select v-model="formItem.overdueFlag" :label="$t('m.i.billInfo.overdueFlag')" prop="overdueFlag"
                                 :dictList="YonList"></common-select>
                  <!-- 票据来源 -->
                  <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                                 v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>
                  <!-- 票据号码 -->
                  <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                  <!-- 子票区间 -->
                  <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <!-- 承兑行名称 -->
                  <common-input :label="$t('m.i.billInfo.acptBankName')" prop="acptBankNameLike"
                                v-model="formItem.acptBankNameLike" class="h-form-long-label"></common-input>
                  <!-- 票据金额 -->
                  <bill-money-range v-model="formItem" :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label"
                                    :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false"></bill-money-range>
                  <!-- 出票日 -->
                  <remit-dt-range v-model="remitDt" :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt"></remit-dt-range>
                  <!-- 汇票到期日 -->
                  <due-dt-range v-model="dueDt" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>
                  <!-- 是否被拒绝 -->
                  <common-select v-model="formItem.isRefuse" :label="$t('m.i.ce.isRefuse')" prop="isRefuse"
                                 :dictList="IsRefuseList"></common-select>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}
                      <i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
                url="/pb/prsttn/elec/apply/ePrsttnApplyMain/func_queryApplyHldrInfoForElec"
                :on-current-change="handleSelectClick"
                :on-current-change-cancel="onCurrentChangeCancle"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm()">提示付款</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
        </h-col>
      </h-row>
    </div>

    <!-- 点击提示付款申请界面 -->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" @on-close="handleClose" :mask-closable="false">
      <p slot="header">
        <span>提示付款申请</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <!-- 逾期标识 -->
          <common-select v-model="addOrEditForm.overdueFlag" :label="$t('m.i.billInfo.overdueFlag')" prop="overdueFlag"
                         :dictList="YonList" disabled v-if="addOrEditForm.billOrigin === 'CS01'"></common-select>
          <!-- 清算标识 -->
          <common-select v-model="addOrEditForm.sttlmMk" :label="$t('m.i.be.clearType')" prop="sttlmMk"
                         :dictList="clearMarkList" required v-if="addOrEditForm.billOrigin === 'CS01'"></common-select>

          <!-- 逾期原因 -->
          <common-input :label="$t('m.i.ce.overdueReason')" prop="overdueRsn" v-model="addOrEditForm.overdueRsn"
                        :validRules="overdueReasonRule" required v-if="addOrEditForm.overdueFlag === '1' && addOrEditForm.billOrigin === 'CS01'"
                        type="textarea" :rows=2 :canResize="false" :maxlength="500" ></common-input>
          <!-- 备注 -->
          <common-input :label="$t('m.i.common.remark')" prop="prsnttnRemark" v-model="addOrEditForm.prsnttnRemark"
                        :validRules="userRemarkRule" type="textarea" :rows=2 :canResize="false" :maxlength="500" ></common-input>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary"  @click="submit()">{{$t("m.i.common.submit")}}</h-button>
      </div>
    </h-msg-box>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "ePrsttnApplyMain",
    data() {
      return {
        licenseFlag:false,
        authPath: this.$route.path ,
        remitDt:[],
        dueDt:[],
        formItem: {
          billType: "",
          billClass: "ME02",
          overdueFlag: "",
          reverseBillNo: "",
          acptBankNameLike: "",
          minBillMoney: "",
          maxBillMoney: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          transNo: "",
          isRefuse: "",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
          inOutFlagList: ["1", "3"],
        },
        addOrEditForm: {
          overdueFlag: "",
          sttlmMk: "",
          prsnttnRemark: "",
          billId: "",
          hldrId: "",
          acptBankNo: "",
          overdueRsn: "",
          billOrigin: ""
        },
        columns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width: 50
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
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: 'billOrigin',
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
            title: this.$t("m.i.ce.currentStatusName"),
            key: "currentStatusName",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillStatusCode", params.row.billStatus);
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
            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.overdueFlag"),
            key: "overdueFlag",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", this.getDictValueFromMap(this.dictMap, "Yon", params.row.overdueFlag));
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: remitDt}}, remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: dueDt}}, dueDt);
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
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.isRefuse"),
            key: "currentStatus",
            sortable: false,
            hiddenCol: false,
            render : (h, params) => {
              let flag = "";
              if (params.row.cirStatus && params.row.cirStatus.startsWith("TF0401")) {
                flag = "是";
              } else {
                flag = "否";
              }
              return h("span", flag);
            }
          },
        ],
        ifShowMore: false,
        addOrEditWin: false,
        dictMap: new Map(),
        billTypeList: [],
        YonList: [],
        billClassList: [],
        clearMarkList: [],
        currentSelectRow: null,
        IsRefuseList:[{
          key:"1",value:"是"
        }],
        userRemarkRule: [{test: /^.{0,80}$/, trigger: 'blur', message: '备注不能超过80位'}],
        overdueReasonRule: [{test: /^.{1,60}$/, trigger: 'blur', message: '逾期原因不能超过60位'}],
        //票面信息页面
        showBillInfoWin: false,
        billId: "",
        billRangeStart: "",
        billRangeEnd: "",
        param: {},
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,Yon,SettleType,BillOrigin,BillStatusCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.clearMarkList = res.get("SettleType");
        this.YonList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      this.getParams();
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

    },
    methods: {
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
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.transNo = "";
        this.$refs.formItem.resetFields();
        this.formItem.ownedBrchNames = "";
        this.formItem.ownedBrchNos = "";
        this.remitDt = [];
        this.dueDt = [];
      },
      // 行选中
      handleSelectClick(arr) {
        this.currentSelectRow = arr;
      },
      onCurrentChangeCancle() {
        this.currentSelectRow = null;
      },
      //提示付款按钮
      handleForm(){
        if (!this.currentSelectRow) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.$refs.addOrEditForm.resetFields();
          this.addOrEditForm.billId = this.currentSelectRow.billId;
          this.addOrEditForm.hldrId = this.currentSelectRow.hldrId;
          this.addOrEditForm.acptBankNo = this.currentSelectRow.acptBankNo;
          this.addOrEditForm.overdueFlag = this.currentSelectRow.overdueFlag;
          this.addOrEditForm.billOrigin = this.currentSelectRow.billOrigin;
        });
      },
      //提示付款弹出框提交按钮
      submit(){
        let params=Object.assign({licenseFlag:this.licenseFlag,ownedBrchNo:this.currentSelectRow.ownedBrchNo},this.addOrEditForm);
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            post(params, "/pb/prsttn/elec/apply/ePrsttnApplyMain/func_prsttnDrftApply").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = null;
                } else {
                  let row = this.currentSelectRow;
                  this.$msgTip.error(this,{info:msg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = row;
                }
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      remarkWinSubmit(param, remark){
        post({ billId: param.billId, hldrId: param.hldrId, acptBankNo: param.acptBankNo,
            ownedBrchNo:param.ownedBrchNo, licenseFlag:param.licenseFlag, prsnttnRemark:remark },
          "/pb/prsttn/elec/apply/ePrsttnApplyMain/func_prsttnDrftApply").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$msgTip.success(this, { info: "操作成功" });
              this.remarkWinClose();
            } else {
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //提示付款弹出关闭
      handleClose(){
        this.currentSelectRow = null;
        this.addOrEditWin = false;
        this.handleSearch();
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
      getParams(){
        if (this.$route.path === "/pb/prsttn/elec/apply/ePrsttnApplyMain") {
          if (this.$route.query.dueDt) {
            let dueDt = this.$moment(this.$route.query.dueDt, "YYYY-MM-DD").format("YYYYMMDD");
            this.formItem.minDueDt = dueDt;
            this.formItem.maxDueDt = dueDt;
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
          if(this.$route.query.maxDueDt){
            this.formItem.maxDueDt = this.$moment(this.$route.query.maxDueDt, "YYYY-MM-DD").format("YYYYMMDD");
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
          if(this.$route.query.transNo){
            this.formItem.transNo = this.$route.query.transNo;
            this.formItem.isRefuse = "1";
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
      },
    },
    watch: {
      "$route": "getParams"
    },
  };
</script>

<style scoped>

</style>
