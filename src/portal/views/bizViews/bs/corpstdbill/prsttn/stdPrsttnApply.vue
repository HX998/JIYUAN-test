<!--提示付款申请-->
<template>
  <div class="layout">
    <div>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <div class="h-form-search-box">
              <!-- 查询表单 -->
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <!--标票产品名称-->
                  <common-input :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                                v-model="formItem.stdProductNameLike" showIcon @on-click="queryProductName"
                                :maxlength="60" lengthByByte></common-input>
                  <!--票号-->
                  <common-input :label="$t('m.i.billInfo.billNo')" prop="billNoLike" v-model="formItem.billNoLike" :maxlength=30
                                type="int"></common-input>
                  <!--出票人全称-->
                  <common-input :label="$t('m.i.billInfo.drwrName')" prop="drwrNameLike"
                                v-model="formItem.drwrNameLike"></common-input>
                  <!--收款人全称-->
                  <common-input :label="$t('m.i.billInfo.pyeeName')" prop="pyeeNameLike"
                                v-model="formItem.pyeeNameLike"></common-input>
                  <!--承兑人全称-->
                  <common-input :label="$t('m.i.billInfo.acptName')" prop="acptNameLike"
                                v-model="formItem.acptNameLike"></common-input>
                  <!--票面金额-->
                  <bill-money-range v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false"
                                    :label="$t('m.i.billInfo.billMoneyByUnit')"></bill-money-range>
                  <!--出票日期-->
                  <common-date-picker :label="$t('m.i.billInfo.remitDt')" prop="remitDt" v-model="remitDt"
                                      type="daterange" :autoPlacement="true"
                                      @on-change="handleRemitDtChange"></common-date-picker>
                  <!--汇票到期日-->
                  <common-date-picker :label="$t('m.i.billInfo.dueDt')" prop="dueDt" v-model="dueDt" type="daterange"
                                      :autoPlacement="true" @on-change="handleDueDtChange"></common-date-picker>
                  <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                             :formSearchReset="resetSearch"></query-btn>
                </h-form>
              </h-panel>
            </div>
            <!-- 数据展示表格 -->
            <h-datagrid
              :columns="columns"
              highlightRow
              url="/bs/corpstdbill/prsttn/stdPrsttnApply/func_queryPrePrsttnApplPage"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="handleForm()">{{$t('m.i.bs.presentPayment')}}</h-button>
                <h-button type="primary" @click="prsttnStatusSync()" v-if="this.isBbsp">{{$t('m.i.bs.synch')}}</h-button>
              </div>
            </h-datagrid>
          </div>
        </h-col>
      </h-row>
    </div>

    <!-- 点击提示付款申请界面 -->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" @on-close="handleClose"
               :mask-closable="false">
      <p slot="header">
        <span>提示付款申请</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">

          <common-select v-model="addOrEditForm.isOverdue" :label="$t('m.i.billInfo.overdueFlag')" prop="isOverdue"
                         :dictList="YonList" readonly></common-select>
          <common-select v-model="addOrEditForm.clearMark" :label="$t('m.i.ce.clearMark')" prop="clearMark"
                         :dictList="clearMarkList" required></common-select>
          <common-input v-model="addOrEditForm.overdueReason" :label="$t('m.i.ce.overdueReason')" prop="overdueReason"
                        :validRules="overdueReasonRule" required v-if="addOrEditForm.isOverdue === '1'" :maxlength="500"></common-input>
          <common-input v-model="addOrEditForm.prsttnRemark"  :label="$t('m.i.common.remark')"  prop="prsttnRemark"
                        :validRules="userRemarkRule" :maxlength="500"></common-input>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose()">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="submit()">{{ $t("m.i.common.submit") }}</h-button>
      </div>
    </h-msg-box>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>
  </div>
</template>

<script>
import {post, accMul, formatNumber} from "@/api/bizApi/commonUtil";
import {getSingleParamValuesByKeys} from "../../../../../api/bizApi/commonUtil";

export default {
  name: "stdPrsttnApply",
  components: {
    ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
  },
  data() {
    return {
      formItem: {
        stdProductNo: "",
        stdProductNameLike: "",
        billNoLike: "",
        drwrNameLike: "",
        pyeeNameLike: "",
        acptNameLike: "",
        minRemitDt: "",
        maxRemitDt: "",
        minDueDt: "",
        maxDueDt: "",
        minBillMoney: "",
        maxBillMoney: "",
        busiType: "PA"
      },
      addOrEditForm: {
        dpstBillId: "",
        clearMark: "",
        overdueRsn: "",
        prsttnRemark: "",
        acptBankNo: "",
        isOverdue: "",
      },
      dictMap: new Map(),
      currentSelectRow: null,
      remitDt: [],
      dueDt: [],
      clearMarkList: [],
      YonList: [],
      columns: [
        {
          type: "radio",
          title: " ",
          key: "multiSelect",
          width: 60,
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
          title: this.$t('m.i.bs.stdProductName'),
          key: "stdProductName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.ecdsBillStatus"),
          key: "ecdsBillStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "EcdsBillStatusCode", params.row.ecdsBillStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.billNo'),
          key: "billNo",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.id)
                }
              }
            }, params.row.billNo)
          }
        },
        {
          title: this.$t('m.i.billInfo.billType'),
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
          title: this.$t('m.i.billInfo.billMoney'),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          align: "right",
          render: (h, params) => {
            return h("p", formatNumber(params.row.billMoney, 2, ","));
          }
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
          key: "remitDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (null != params.row.remitDt && "" !== params.row.remitDt) {
              let dttm = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", dttm);
            }
          }
        },
        {
          title: this.$t('m.i.billInfo.dueDt'),
          key: "dueDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (null != params.row.dueDt && "" !== params.row.dueDt) {
              let dttm = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", dttm);
            }
          }
        },
        {
          title: this.$t('m.i.billInfo.drwrAcctNo'),
          key: "drwrAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeAcctNo'),
          key: "pyeeAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeName'),
          key: "pyeeName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.drwrName'),
          key: "drwrName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: "acptName",
          sortable: true,
          hiddenCol: false
        }
      ],
      overdueReasonRule: [{test: /^.{0,80}$/, trigger: 'blur', message: '逾期原因不能超过80位'}],
      userRemarkRule: [{test: /^.{0,80}$/, trigger: 'blur', message: '备注不能超过80位'}],
      productBrchType: "4",
      memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
      //是否显示更多查询项
      ifShowMore: false,
      showCpesProductBranch: false,
      addOrEditWin: false,
      showBillInfoWin: false,
      billId: "",
      billNo: "",
      listId:"",
      isBbsp: false,
    };
  },
  mounted() {
    this.getDictListByGroups("EcdsBillStatusCode,CDMedia,DraftTypeCode,Yon,SettlementMarkCode").then(res => {
      this.clearMarkList = res.get("SettlementMarkCode");
      this.YonList = res.get("Yon");
      this.dictMap = res.get("map");
    });
    this.getBbsp();

  },
  methods: {
    showChange(val) {
      this.ifShowMore = val;
    },
    handleSearch(pageNo) {
      this.currentSelectRow = [];
      this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
    },
    resetSearch() {
      this.remitDt = [];
      this.dueDt = [];
      this.formItem.stdProductNo = "";
      this.$refs.formItem.resetFields();
    },
    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = null;
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
    handleForm(){
      if (this.currentSelectRow === null) {
        this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.getIsOverdueFlag(this, this.currentSelectRow.id, res=>{
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.addOrEditForm.dpstBillId = this.currentSelectRow.id;
          this.addOrEditForm.acptBankNo = this.currentSelectRow.acptBankNo;
          this.addOrEditForm.isOverdue = res;
        });
      });
    },
    handleClose() {
      this.$refs.addOrEditForm.resetFields();
      this.addOrEditForm.overdueReason = "";
      this.addOrEditForm.prsttnRemark = "";
      this.currentSelectRow = null;
      this.addOrEditWin = false;
      this.handleSearch();
    },
    sendPost(params, url) {
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectRow = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    submit() {
      this.$refs["addOrEditForm"].validate(valid => {
        if (valid) {
          post(this.addOrEditForm, "/bs/corpstdbill/prsttn/stdPrsttnApply/func_prsttnApply").then(res => {
            this.submitFlag = false;
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.handleClose();
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
            }
          });
        }
      });
    },
    prsttnStatusSync(){
      post(this.formItem, "/bs/corpstdbill/prsttn/stdPrsttnApply/func_prsttnStatusSync").then(res => {
        this.submitFlag = false;
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(1);
            this.currentSelectRow = null;
          } else {
            this.$msgTip.error(this, {info: msg});
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
        }
      });
    },
    getIsOverdueFlag(_this, id, callback){
      post({dpstBillId: id}, "/bs/corpstdbill/prsttn/stdPrsttnApply/func_getIsOverdueFlag").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            callback(res.data.retMsg);
          } else {
            _this.$msgTip.error(_this, {info: msg});
          }
        } else {
          _this.$msgTip.error(_this, {info: _this.$t('m.i.common.netError')});
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
    getBbsp(){
      let url="/bs/corpstdbill/prsttn/stdPrsttnApply/func_getIsBbsp";
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
  }
};
</script>

<style scoped>

</style>
