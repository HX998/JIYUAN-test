<!--追索申请-撤销追索-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <!--标票产品名称-->
                <common-input :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                              v-model="formItem.stdProductNameLike" showIcon @on-click="queryProductName"
                              :maxlength="60" lengthByByte></common-input>
                <!--票号-->
                <common-input :label="$t('m.i.billInfo.billNo')" prop="billNoLike" v-model="formItem.billNoLike" :maxlength=30
                              type="int"></common-input>
                <!--出票日期-->
                <common-date-picker :label="$t('m.i.billInfo.remitDt')" prop="remitDt" v-model="remitDt"
                                    type="daterange" :autoPlacement="true"
                                    @on-change="handleRemitDtChange"></common-date-picker>
                <!--票面金额-->
                <bill-money-range v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false"
                                  :label="$t('m.i.billInfo.billMoneyByUnit')"></bill-money-range>
                <!--汇票到期日-->
                <common-date-picker :label="$t('m.i.billInfo.dueDt')" prop="dueDt" v-model="dueDt" type="daterange"
                                    :autoPlacement="true" @on-change="handleDueDtChange"></common-date-picker>
                <!--出票人全称-->
                <common-input :label="$t('m.i.billInfo.drwrName')" prop="drwrNameLike"
                              v-model="formItem.drwrNameLike"></common-input>
                <!--承兑人全称-->
                <common-input :label="$t('m.i.billInfo.acptName')" prop="acptNameLike"
                              v-model="formItem.acptNameLike"></common-input>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="formSearch"
                           :formSearchReset="formSearchReset"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bs/corpstdbill/recourse/stdRecourseRevoke/func_queryStayCancelApply"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recourseRevoke()">撤回</h-button>
              <h-button type="primary" @click="recourseStatusSync()" v-if="isBbsp">{{$t('m.i.bs.synch')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
    <!--票面信息-->
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>

  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdRecourseRevoke",
    data() {
      return {
        ifShowMore : false,
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
            key: "ownedBrchNo",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: true
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
            title: this.$t("m.i.ce.receiverName"),
            key: "rcvgName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.receiverAcctNo"),
            key: "rcvgAcctNo",
            hiddenCol: false,
            ellipsis: false
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
          stdProductNameLike: "",
          stdProductNo: "",
          billNoLike: "",
          drwrNameLike: "",
          pyeeNameLike: "",
          acptNameLike: "",
          recourseDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          busiType: "RC",
        },
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        currentSelectRow : null,
        billTypeList : [],
        dictMap : new Map(),
        productBrchType: "4",
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        showCpesProductBranch: false,
        remitDt: [],
        dueDt: [],
        isBbsp: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId:""
      }
    },
    components: {
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      formSearch() {
        this.currentSelectRow = [];
        this.formItem.recourseDt = this.formItem.recourseDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.stdProductNameLike = "";
        this.formItem.stdProductNo = "";
        this.remitDt = [];
        this.dueDt = [];
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
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
      // 撤回追索
      recourseRevoke() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "确认",
            content: "确定撤回追索吗？",
            onOk: () => {
              this.handleRevoke();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        }
      },
      handleRevoke() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        let params = {
          id: this.currentSelectRow.id,
          billId: this.currentSelectRow.billId,
          applicantrole: "RC00",
          applicantAcctNo: "0",
          applicantBankNo: userInfo.bankNo,
          ownedBrchNo:this.currentSelectRow.ownedBrchNo,
          licenseFlag:this.licenseFlag,
        };
        post(params, "/bs/corpstdbill/recourse/stdRecourseRevoke/func_cancelReourseEcdsRequest").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let pageNo = this.$refs.datagrid.pageInfo.pageNo;
              this.$refs.datagrid.dataChange(pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      recourseStatusSync(){
        post(this.formItem, "/bs/corpstdbill/recourse/stdRecourseRevoke/func_recourseStatusSync").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              let pageNo = this.$refs.datagrid.pageInfo.pageNo;
              this.$refs.datagrid.dataChange(pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, {info: "请先选择记录！"});
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        // this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
      },
      getBbsp(){
        let url="/bs/corpstdbill/recourse/stdRecourseApply/func_getIsBbsp";
        post({}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.isBbsp=obj.bbsp;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
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
      this.getDictListByGroups("DraftTypeCode,Yon,EcdsBillStatusCode,EcdsRecourseType,RecourseReasonCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });

      this.getBbsp();

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
