<!--标票追索记账--->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--标票产品名称-->
                <common-input :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                              v-model="formItem.stdProductNameLike" showIcon @on-click="queryProductName"
                              :maxlength="60" lengthByByte></common-input>
                <!--票号-->
                <common-input :label="$t('m.i.billInfo.billNo')" prop="billNoLike" v-model="formItem.billNoLike" :maxlength=30
                              type="int"></common-input>

                <!--票据种类-->
                <common-select v-model="formItem.billType" :label="$t('m.i.billInfo.billType')" prop="billType"
                               :dictList="billTypeList"></common-select>

                <!--出票人全称-->
                <common-input :label="$t('m.i.billInfo.drwrName')" prop="drwrNameLike"
                              v-model="formItem.drwrNameLike"></common-input>
                <!--承兑人全称-->
                <common-input :label="$t('m.i.billInfo.acptName')" prop="acptNameLike"
                              v-model="formItem.acptNameLike"></common-input>
                <!--被追索人名称-->
                <common-input :label="$t('m.i.ce.receiverName')" prop="rcvgNameLike"
                              v-model="formItem.rcvgNameLike" :maxlength=60></common-input>

                <!--追索通知日期-->
                <common-date-picker :label="$t('m.i.ce.recourseDt')" prop="recourseDt" v-model="formItem.recourseDt"
                                    :showFormat="true" :editable=false ></common-date-picker>

                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bs/corpstdbill/recourse/stdRecourseApply/func_queryStayRecourseAccount"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account()" >{{$t('m.i.bs.account')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--票面信息-->
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>

    <acct-record :param="param"  :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 :url="acctRecord" @acctSubmitSure="acctSubmitSure"></acct-record>


  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "stdRecourseAcct",
    data() {
      return {
        ifShowMore : false,
        //给按钮增加权限
        authObj : {
          recourseApplyAuth: true           //发起追索
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.bs.stdProductName'),
            key: "stdProductName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.dpstBillId)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            ellipsis: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.bs.recourseMoneyByUnit"),
            key: "recourseAmt",
            hiddenCol: false,
            sortable: true,
            align: "right",
            ellipsis: false,
            render: (h, params) => {
              let recourseAmt = formatNumber(params.row.recourseAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: recourseAmt
                }
              }, recourseAmt);
            }
          },
          {
            title: this.$t("m.i.ce.recourseDt"),
            key: "recourseDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.recourseDt == null ? "" : this.$moment(params.row.recourseDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.bs.agreeAmtByUnit"),
            key: "agreeAmt",
            hiddenCol: false,
            ellipsis: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              let agreeAmt = formatNumber(params.row.agreeAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: agreeAmt
                }
              }, agreeAmt);
            }
          },
          {
            title: this.$t("m.i.ce.agreeDt"),
            key: "agreeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.agreeDt == null ? "" : this.$moment(params.row.agreeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.agreeRemark"),
            key: "agreeRemark",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.ce.receiverName"),
            key: "rcvgName",
            hiddenCol: false,

            sortable: true
          },
          {
            title: this.$t("m.i.ce.receiverAcctNo"),
            key: "rcvgAcctNo",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.ce.rcvgBankNo"),
            key: "rcvgBankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.recourseType"),
            key: "recourseType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "EcdsRecourseType", params.row.recourseType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true,
            ellipsis: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.recourseReasonCode"),
            key: "recourseReasonCode",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RecourseReasonCode", params.row.recourseReasonCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.recourseRemark"),
            key: "recourseRemark",
            hiddenCol: false,
            ellipsis: false
          },
        ],
        formItem : {
          stdProductNo: "",
          stdProductNameLike:"",
          recourseDt:"",
          recourseType: "",
          likeBillNo: "",
          billType: "",
          billNoLike:"",
          drwrNameLike: "",
          acptNameLike: "",
          rcvgNameLike:"",
          isRecourse: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        recourseMoneyRule: [{ test: this.validateRecourseMoney, trigger: ["blur","change"] }],
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : [],
        recourseTypeList : [],
        billTypeList : [],
        isRecourseList : [],
        remitDt: [],
        dueDt: [],
        recourseReasonCodeList : [],
        dictMap : new Map(),
        showCpesProductBranch: false,
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",
        dpstBillId:"",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,

        param : {},
        acctRecord : "/bs/corpstdbill/recourse/stdRecourseApply/func_generateAcctRecord",
        accountUrl : "/bs/corpstdbill/recourse/stdRecourseApply/func_stdRecourseAccount",
        showPrintButton:false,
        acctSubmitFlag:false,
        showAcctRecordWin : false,
        authPath: this.$route.path,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId:""
      }
    },
    components: {
      stdRecoursesSearch: () => import(/* webpackChunkName: "bs/corpstdbill/recourse/stdRecoursesSearch" */ '@/views/bizViews/bs/corpstdbill/recourse/stdRecoursesSearch'),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    methods: {
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.stdProductNo="";
        this.$refs.formItem.resetFields();
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addForm.ecdsBillStatus = "";
        this.addForm.isRecourse = "";
        this.$refs.addForm.resetFields();
      },
      handleRemitDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      printSuccessCallback(){
        this.showAcctRecordWinClose();
      },

      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, {info: "请先选择记录！"});
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        // this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
      },

      formatRecourseAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.recourseAmt)) && isFinite(this.addForm.recourseAmt)) {
            this.addForm.recourseAmt = this.addForm.recourseAmt == null ? "0.00" : formatNumber(this.addForm.recourseAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.recourseAmt = this.addForm.recourseAmt.toString().replace(/,/g, "");
        }
      },
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.billMoney)) && isFinite(this.addForm.billMoney)) {
            this.addForm.billMoney = this.addForm.billMoney == null ? "0.00" : formatNumber(this.addForm.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.billMoney = this.addForm.billMoney.toString().replace(/,/g, "");
        }
      },

      account() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要追索记账吗") + "?",
          onOk: () => {
            this.param = {id:this.currentSelectRow.id,ownedBrchNo:this.currentSelectRow.transBrchNo};
            this.showAcctRecordWin = true;
          }
        });
      },

      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ id: info.id ,ownedBrchNo:info.ownedBrchNo,
          ownedBrchName:info.ownedBrchName }, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },


      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
      //追索类型变更
      recourseTypeChange(currentValue) {
        if (currentValue === "RT01") {
          this.addForm.recourseReasonCode = "RC00";
        } else {
          this.addForm.recourseReasonCode = "";
        }
      },
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.listId=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,listId){
        this.billId=billId;
        this.billNo=billNo;
        this.listId=listId;
        this.showBillInfoWin=true;
      },
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,EcdsRecourseType,EcdsBillStatusCode,partnerType,RecourseReasonCode").then(res => {
        this.recourseTypeList = res.get("EcdsRecourseType");
        this.billTypeList = res.get("DraftTypeCode");
        this.isRecourseList = res.get("Yon");
        this.recourseReasonCodeList = res.get("RecourseReasonCode");
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
