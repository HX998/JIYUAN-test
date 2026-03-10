<template>
  <!--纸票托收收回记账-->
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
                  <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNoLike">
                    <h-input v-model="formItem.billNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.minDueDt')" prop="minDueDt">
                    <h-date-picker type="date" v-model="formItem.minDueDt" placeholder=""
                                   @on-change="handleMinDateChange" :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.maxDueDt')" prop="maxDueDt">
                    <h-date-picker type="date" v-model="formItem.maxDueDt" placeholder=""
                                   @on-change="handleMaxDateChange" :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                    <h-select v-model="formItem.billType" placeholder="" showTitle>
                      <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{
                          item.value
                        }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptNameLike">
                    <h-input v-model="formItem.acptNameLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.drweBankNo')" prop="drweBankNoLike">
                    <h-input v-model="formItem.drweBankNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
                    <h-typefield type="money" v-model="formItem.minBillMoney" placeholder=""
                                 @on-blur="formatMinBillMoney('blur')"
                                 @on-focus="formatMinBillMoney('focus')" bigTips></h-typefield>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
                    <h-typefield type="money" v-model="formItem.maxBillMoney" placeholder=""
                                 @on-blur="formatMaxBillMoney('blur')"
                                 @on-focus="formatMaxBillMoney('focus')" bigTips></h-typefield>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                      class="icon iconfont"
                      :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{ $t('m.i.common.search') }}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{ $t('m.i.common.reset') }}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlightRow
                :bindForm="formItem"
                url="/pb/prsttn/paper/account/pPrsttnAccountMain/func_pageQueryPrsttnBill"
                :row-select="true"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="receiveAllMoney()">{{ $t('m.i.ce.allReceiveAcct') }}</h-button>
                  <h-button type="primary"
                            v-if="showPartAcct && (childrenBtnAuth.showReceivePartMoneyButton === undefined ? true : childrenBtnAuth.showReceivePartMoneyButton.isShow)"
                            @click="receivePartMoney()">{{ $t('m.i.ce.partReceiveAcct') }}
                  </h-button>
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

          <!--票面信息-->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                          :billId="this.billId"></bill-info-main>
          <!--  部分回款记账页面-->
          <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true"
                     :mask-closable="false" @on-close="handleClose">
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
                  <h-typefield type="money" v-model="addOrEditForm.thisReturnMoney" placeholder=""></h-typefield>
                </h-form-item>
              </h-form>
            </h-panel>
            <div slot="footer">
              <h-button type="ghost" @click="handleClose()">{{ $t("m.i.common.close") }}</h-button>
              <h-button type="primary" @click="submit()">{{ $t("m.i.common.submit") }}</h-button>
            </div>
          </h-msg-box>
        </h-col>
      </h-row>
    </div>
  </div>
</template>

<script>
import {post, on, off, formatNumber} from "@/api/bizApi/commonUtil";

export default {
  name: "pPrsttnAccountMain",
  components: {},
  data() {
    return {
      licenseFlag: false,
      authPath: this.$route.path,
      ownedBrchNo: "",
      formItem: {
        billNoLike: "",
        minDueDt: "",
        maxDueDt: "",
        billType: "",
        acptNameLike: "",
        drweBankNoLike: "",
        minBillMoney: "",
        maxBillMoney: "",
        curFuncNo: "PICE040202",
        billClass: "ME01",
        ownedBrchNos: "",
        ownedBrchNames: "",
        inOutFlag: '1',
        orderByClause: "PRSTTN_DT desc, ID desc",
        authPath: this.$route.path,
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          key: "duoxuan",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          key: "xuhao",
          align: "center"
        },
        {
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billNo"),
          key: "billNo",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row.billId);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",

          sortable: true,
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
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",

          hiddenCol: false
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
            return h("span", remitDt);
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
            return h("span", dueDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.billMoney"),
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
          title: this.$t("m.i.billInfo.drweBankNo"),
          key: "drweBankNo",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.collectionApplyDt"),
          key: "prsttnDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let prsttnDt = params.row.prsttnDt == null ? "" : this.$moment(params.row.prsttnDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", {domProps: {title: prsttnDt}}, prsttnDt);
          }
        },
      ],
      dictMap: new Map(),
      ifShowMore: false,
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
      billTypeList: [],
      //票面信息页面
      showBillInfoWin: false,
      billId: "",
      //分录
      acctRecordUrl: "",
      acctRecordParam: {},
      showAcctRecordWin: false,
      batchId: "",
      ids: "",
      acctSubmitFlag: false,
      showPrintButton: false,
      hasSelect: false,
      childrenBtnAuth: "",
    }
  },
  mounted() {
    this.getDictListByGroups("DraftTypeCode").then(res => {
      this.billTypeList = res.get("DraftTypeCode");
      this.dictMap = res.get("map");
      this.getShowPartAcct();
    });
    //集中操作授权
    post({authPath: this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
      if (res) {
        let retCode = res.data.retCode;
        if (retCode === "000000") {
          this.licenseFlag = res.data.retData.licenseFlag;
          let columns = [];
          if (this.licenseFlag) {
            columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
          } else {
            columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
          }
          this.columns = this.deepClone(columns);
          this.$refs.datagrid.createShowCol(this.columns);
        } else {
          this.$msgTip.error(this, {info: res.data.retMsg});
        }
      } else {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
      }
    });
    //按钮权限查询 控制按钮显隐
    let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
    post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
      if (res) {
        let retCode = res.data.retCode;
        let retMsg = res.data.retMsg;
        if (retCode === "000000") {
          this.btnAuth = JSON.parse(res.data.retData);
          if (this.btnAuth.manager != null && this.btnAuth.manager != undefined) {
            if (this.btnAuth.manager.children != null && this.btnAuth.manager.children != undefined) {
              this.childrenBtnAuth = this.btnAuth.manager.children;
            }
          }
        } else {
          this.$msgTip.error(this, {info: retMsg});
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
    getShowPartAcct() {
      let paramKey = "be.trust.prsnttn_part_acct";
      post({paramKey: paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let param = res.data.retData;
            this.showPartAcct = param === "1";
            if (this.showPartAcct) {
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
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
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
    handleMinDateChange(value) {
      this.formItem.minDueDt = value.replace(/-/g, "");
    },
    handleMaxDateChange(value) {
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
    },
    // 行选中
    handleSelectClick(arr, selectInx) {
      this.currentSelectList = arr;
      this.currentSelectRowInx = selectInx;
    },
    //记账按钮
    receiveAllMoney() {
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      let list = this.$refs.datagrid.selects;
      let ownedBrchNo = list[0].ownedBrchNo;
      let flag = list.some(item => item.ownedBrchNo !== ownedBrchNo)
      if (flag) {
        this.$msgTip.info(this, {info: "请选择相同的机构下的票据"});
        return;
      }
      this.ownedBrchNo = ownedBrchNo
      // this.batchId = list[0].batchId;
      this.ids = this.$refs.datagrid.selectIds.join(",");
      post({
        ids: this.ids,
        accountType: "1"
      }, "/pb/prsttn/paper/account/pPrsttnAccountMain/func_regReceiveMoney").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            // this.$msgTip.success(this, { info: msg });
            // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.queryRecord("1", "");
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    //记账按钮
    receivePartMoney() {
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      if (this.$refs.datagrid.selects.length > 1) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return;
      }
      this.ownedBrchNo = this.$refs.datagrid.selects[0].ownedBrchNo
      this.addOrEditWin = true;
      this.$nextTick(() => {
        this.addOrEditForm.billNo = this.$refs.datagrid.selects[0].billNo;
        this.addOrEditForm.billMoney = this.$refs.datagrid.selects[0].billMoney;
        this.addOrEditForm.returnMoney = this.$refs.datagrid.selects[0].returnMoney;
        this.addOrEditForm.noReturnMoney = this.$refs.datagrid.selects[0].noReturnMoney;
      });

    },
    submit() {
      this.$refs['addOrEditForm'].validate((valid) => {
        if (valid) {
          this.ids = this.$refs.datagrid.selectIds.join(",");
          let receiveMoney = this.addOrEditForm.thisReturnMoney;
          post({
            ids: this.ids,
            accountType: "0",
            receiveMoney: receiveMoney
          }, "/pb/prsttn/paper/account/pPrsttnAccountMain/func_regReceiveMoney").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                // this.$msgTip.success(this, { info: msg });
                // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                this.queryRecord("0", receiveMoney);
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
                //this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      })

    },
    queryRecord(accountType, receiveMoney) {
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定记账吗？",
        onOk: () => {
          this.addOrEditWin = false;
          this.addOrEditForm.thisReturnMoney = "";
          this.currentSelectList = [];
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds = [];
          this.getEntryInfo(accountType, receiveMoney);
        }
      });
    },
    //获取分录信息
    getEntryInfo(accountType, receiveMoney) {
      this.acctRecordUrl = "/pb/prsttn/paper/account/pPrsttnAccountMain/func_generateAcctRecord";
      this.acctRecordParam = {
        ids: this.ids,
        accountType: accountType,
        billClass: "ME01",
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
      this.ids = "";
      this.currentSelectList = [];
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.showAcctRecordWin = false;
      this.showPrintButton = false;
      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
    },
    acctSubmitSure(info) {
      this.acctSubmitFlag = true;
      post({
        ids: this.ids,
        accountType: info.accountType,
        billClass: "ME01",
        receiveMoney: info.receiveMoney,
        licenseFlag: this.licenseFlag,
        ownedBrchNo: this.ownedBrchNo
      }, "/pb/prsttn/paper/account/pPrsttnAccountMain/func_submitPrsttnAccount").then(res => {
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
            // this.currentSelectList = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
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
    //票面信息关闭
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    //票面信息
    showBillInfo(billId, billNo) {
      this.billId = billId;
      this.showBillInfoWin = true;
    },
    //全款收回按钮
    // receiveAllMoney(){
    //   if (this.currentSelectList.length > 1) {
    //     this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
    //     return;
    //   }
    //   if (this.currentSelectList.length === 0) {
    //     this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
    //     return;
    //   }
    //   let list = this.currentSelectList;
    //   let ids = "";
    //   for (let i = 0, count = list.length; i < count; i++) {
    //     ids += list[i].id;
    //     if (i < list.length - 1) {
    //       ids += ",";
    //     }
    //   }
    //   this.$hMsgBox.confirm({
    //     title: this.$t("m.i.common.confirm"),
    //     content: "确定全款收回吗?",
    //     onOk: () => {
    //       post({ids:ids}, "").then(res => {
    //         if(res) {
    //           let msg = res.data.retMsg;
    //           let retCode = res.data.retCode;
    //           if (retCode === "000000") {
    //             this.$msgTip.success(this);
    //             this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
    //             this.currentSelectList = [];
    //           } else {
    //             this.$msgTip.error(this, { info: msg });
    //             this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
    //           }
    //         }
    //       }).catch(error => {
    //         this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
    //       });
    //     }
    //   });
    // },
  }
};
</script>

<style scoped>

</style>
