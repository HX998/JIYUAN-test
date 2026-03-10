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
                    v-if="licenseFlag" :showCheckBox="true" :brchNo.sync="formItem.ownedBrchNos"
                    :brchName.sync="formItem.ownedBrchNames"
                    :params="{authPath:this.$route.path}"
                    url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                    queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <!--标票产品名称-->
                  <common-input :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                                v-model="formItem.stdProductNameLike" showIcon @on-click="queryProductName"
                                :maxlength="60" lengthByByte></common-input>
                  <!--票号-->
                  <common-input :label="$t('m.i.billInfo.billNo')" prop="billNoLike" v-model="formItem.billNoLike"
                                :maxlength=30
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
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                      class="icon iconfont"
                      :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
                url="/bs/corpstdbill/prsttn/stdPrsttnAccountMain/func_queryPreAcctPrsttnInfo"
                :row-select="true"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="prsttnAcct()">{{$t('m.i.bs.account')}}</h-button>
                  <!--                  <h-button type="primary" @click="allReceiveAcct()">{{$t('m.i.ce.allReceiveAcct')}}</h-button>-->
                  <!--                  <h-button type="primary" v-if="showPartAcct" @click="partReceiveAcct()">{{$t('m.i.ce.partReceiveAcct')}}</h-button>-->
                </div>
              </h-datagrid>
            </div>
          </div>
          <!-- 分录弹框 -->
          <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl"
                       :show-acct-record-win="this.showAcctRecordWin" :showPrintButton="this.showPrintButton"
                       @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                       :submitFlag="this.acctSubmitFlag"
                       @printSuccessCallback="printSuccessCallback" :licenseFlag="licenseFlag"
                       :ownedBrchNo="ownedBrchNo"></acct-record>
          <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                            :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                            @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
          <!--票面信息-->
          <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                              :billNo="billNo" :listId="listId"></bill-info-main-std>
          <!--  部分回款记账页面-->
          <!--<h-msg-box v-model="addOrEditWin" width="500" class="h-form-search-layer" :maximize="true" :mask-closable="false" on-close="handleClose">
            <p slot="header">
              <span>部分回款</span>
            </p>
            <h-panel>
              <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" required>
                  <h-input v-model="addOrEditForm.billNo" placeholder="" readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" required>
                  <h-typefield type="money" v-model="addOrEditForm.billMoney" placeholder="" readonly></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.returnMoney')" prop="returnMoney" required>
                  <h-typefield type="money" v-model="addOrEditForm.returnMoney" placeholder="" readonly></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.noReturnMoney')" prop="noReturnMoney" required>
                  <h-typefield type="money" v-model="addOrEditForm.noReturnMoney" placeholder="" readonly></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.thisReturnMoney')" prop="thisReturnMoney" required>
                  <h-typefield type="money" v-model="addOrEditForm.thisReturnMoney" placeholder=""  ></h-typefield>
                </h-form-item>
              </h-form>
            </h-panel>
            <div slot="footer">
              <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary"  @click="submit()">{{$t("m.i.common.submit")}}</h-button>
            </div>
          </h-msg-box>-->
        </h-col>
      </h-row>
    </div>
  </div>
</template>

<script>
  import {post, on, off, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdPrsttnAccountMain",
    components: {
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      return {
        licenseFlag: false,
        authPath: this.$route.path,
        ownedBrchNo: "",
        formItem: {
          billType: "",
          billClass: "ME02",
          isOverdue: "",
          billNoLike: "",
          acptBankName: "",
          minBillMoney: "",
          maxBillMoney: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          curFuncNo: "PIBS020108",
          authPath: this.$route.path,
          ownedBrchNos: "",
          ownedBrchNames: "",
          orderByClause: "prsttn_dt asc,id desc",
          stdProductNameLike: "",
          drwrNameLike: "",
          pyeeNameLike: "",
          acptNameLike: "",
        },
        columns: [
          {
            type: "selection",
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
            title: this.$t("m.i.bs.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false,
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
                    this.billInfoWinOpen(params.row.billId, params.row.billNo, params.row.dpstBillId)
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
        ifShowMore: false,
        dictMap: new Map(),
        billTypeList: [],
        YonList: [],
        billClassList: [],
        remitDt: [],
        dueDt: [],
        addOrEditWin: false,
        showPartAcct: false,
        addOrEditForm: {
          billNo: "",
          billMoney: "",
          returnMoney: "",
          noReturnMoney: "",
          thisReturnMoney: "",
        },
        currentSelectList: [],
        currentSelectRowInx: [],
        //分录
        acctRecordUrl: "",
        productBrchType: "4",
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        acctRecordParam: {},
        showAcctRecordWin: false,
        batchId: "",
        ids: [],
        acctSubmitFlag: false,
        showPrintButton: false,
        hasSelect: false,
        showCpesProductBranch: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId: ""
      }
    },
    mounted() {

      this.getDictListByGroups("DraftTypeCode,CDMedia,Yon,SettlementMarkCode,PrsnttnStatusCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
        // this.getShowPartAcct();
      });

      //集中操作授权
      post({authPath: this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
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
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    methods: {
      handleClose() {
        this.addOrEditWin = false;
        this.addOrEditForm.thisReturnMoney = "";
      },
      /*getShowPartAcct() {
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
      },*/
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
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      //记账按钮
      prsttnAcct() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        this.queryRecord("1", "");
      },
      /*allReceiveAcct(){
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
        post({ ids:this.ids , accountType:"1" }, "/ce/prsttn/elec/account/ePrsttnAccountMain/func_regReceiveMoney").then(res => {
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
      },*/
      //记账按钮
      /*partReceiveAcct(){
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
          this.addOrEditForm.billNo=this.$refs.datagrid.selects[0].billNo;
          this.addOrEditForm.billMoney=this.$refs.datagrid.selects[0].billMoney;
          this.addOrEditForm.returnMoney=this.$refs.datagrid.selects[0].returnMoney;
          this.addOrEditForm.noReturnMoney=this.$refs.datagrid.selects[0].noReturnMoney;
        });

      },*/
      /*submit(){
        this.$refs['addOrEditForm'].validate((valid) => {
          if (valid) {
            this.ids = this.$refs.datagrid.selectIds.join(",");
            let receiveMoney = this.addOrEditForm.thisReturnMoney;
            post({ ids:this.ids, accountType:"0" ,receiveMoney:receiveMoney}, "/ce/prsttn/paper/account/pPrsttnAccountMain/func_regReceiveMoney").then(res => {
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

      },*/
      queryRecord(accountType, receiveMoney) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账吗？",
          onOk: () => {
            this.addOrEditWin = false;
            this.addOrEditForm.thisReturnMoney = "";
            this.getEntryInfo(accountType, receiveMoney);
            this.currentSelectList = [];
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
          }
        });
      },
      //获取分录信息
      getEntryInfo(accountType, receiveMoney) {
        this.acctRecordUrl = "/bs/corpstdbill/prsttn/stdPrsttnAccountMain/func_generateAcctRecord";
        this.ids = this.$refs.datagrid.selectIds;
        this.acctRecordParam = {
          ids: this.ids,
          accountType: accountType,
          billClass: "ME02",
          receiveMoney: receiveMoney,
          licenseFlag: this.licenseFlag,
          ownedBrchNo: this.ownedBrchNo
        };
        this.showAcctRecordWin = true;
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.ids = [];
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({
          ids: this.ids,
          accountType: info.accountType,
          billClass: "ME02",
          receiveMoney: info.receiveMoney,
          licenseFlag: this.licenseFlag,
          ownedBrchNo: this.ownedBrchNo
        }, "/bs/corpstdbill/prsttn/stdPrsttnAccountMain/func_submitPrsnttnAccount").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, {info: msg});
              this.showPrintButton = true;
              if (!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
              // this.showAcctRecordWinClose();
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              // this.ids = "";
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.listId = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo, listId) {
        this.billId = billId;
        this.billNo = billNo;
        this.listId = listId;
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
