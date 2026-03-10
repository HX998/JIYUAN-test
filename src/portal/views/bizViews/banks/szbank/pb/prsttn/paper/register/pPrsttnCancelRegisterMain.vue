<template>
  <!--纸票代客结果登记撤销-->
  <div class="layout">
    <div>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos"
                               title="机构名称"
                               :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                               v-if="this.licenseFlag" :params="{authPath: this.authPath}"
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
                url="/pb/prsttn/paper/register/pPrsttnCancelRegisterMain/func_pageQueryPrsttnBill"
                :row-select="true"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm()">登记结果撤销</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
          <!--票面信息-->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                          :billId="this.billId"></bill-info-main>

        </h-col>
      </h-row>
    </div>

  </div>
</template>

<script>
import {post, on, off, formatNumber} from "@/api/bizApi/commonUtil";

export default {
  name: "pPrsttnCancelRegisterMain",
  components: {},
  data() {
    return {
      formItem: {
        billNoLike: "",
        minDueDt: "",
        maxDueDt: "",
        acptNameLike: "",
        drweBankNoLike: "",
        minBillMoney: "",
        maxBillMoney: "",
        curFuncNo: "PICE040402",
        billClass: "ME01",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        authPath: this.$route.path
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
          hiddenCol: true
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
          title: this.$t("m.i.ce.registerStatus"),
          key: "prsttnStatus",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "PrsnttnStatusCode", params.row.prsttnStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
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
          title: this.$t("m.i.common.custNo"),
          key: "hldrCustNo",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "hldrName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "hldrAcctNo",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.rgstApplDt"),
          key: "signDt",

          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.signDt == null || params.row.signDt === "") {
              return "";
            }
            let signDt = this.$moment(params.row.signDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", {domProps: {title: signDt}}, signDt);
          }
        },
        {
          title: this.$t("m.i.ce.paymentSignOpin"),
          key: "signOpin",

          hiddenCol: false
        },
      ],
      dictMap: new Map(),
      ifShowMore: false,
      currentSelectList: [],
      currentSelectRowInx: [],
      billTypeList: [],
      //票面信息页面
      showBillInfoWin: false,
      billId: "",
      hasSelect: false,
      //业务所属机构
      ownedBrchName: "",
      ownedBrchNo: "",
      ownedBrchNames: "",
      ownedBrchNos: "",
      licenseFlag: false,
      authPath: this.$route.path
    }
  },
  mounted() {
    this.getDictListByGroups("DraftTypeCode,CDMedia,Yon,SettlementMarkCode,PrsnttnStatusCode").then(res => {
      this.billTypeList = res.get("DraftTypeCode");
      this.billClassList = res.get("CDMedia");
      this.clearMarkList = res.get("SettlementMarkCode");
      this.YonList = res.get("Yon");
      this.dictMap = res.get("map");
    });
    //有授权则显示业务所属机构列
    post({authPath: this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
      this.authPath = this.$route.path;
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
    },
    // 行选中
    handleSelectClick(arr) {
      this.currentSelectList = arr;
    },
    //登记结果撤销按钮
    handleForm() {
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      let ownedBrchNo;
      if (this.licenseFlag) {
        let selects = this.$refs.datagrid.selects;
        ownedBrchNo = selects[0].ownedBrchNo;
        for (let i = 0; i < selects.length; i++) {
          if (ownedBrchNo !== selects[i].ownedBrchNo) {
            this.$msgTip.info(this, {info: "所选项的业务所属机构应相同"});
            return;
          }
        }
      }
      let ids = this.$refs.datagrid.selectIds.join(",");
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定登记结果撤销吗?",
        onOk: () => {
          post({
            ids: ids,
            ownedBrchNo: ownedBrchNo,
            licenseFlag: this.licenseFlag
          }, "/pb/prsttn/paper/register/pPrsttnCancelRegisterMain/func_cancelResultReg").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.prsttnCancelRegisterPrint(ids);
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                this.currentSelectList = [];
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
              } else {
                this.$msgTip.error(this, {info: msg});
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
          });
        }
      });
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
    //代客托收结果登记撤销凭证打印
    prsttnCancelRegisterPrint(ids) {
      let param = {listIds: ids};
      let params = {templateName: "CANCEL-BE031804", params: JSON.stringify(param),listIds: ids,saveFlag:1};
      this.$print.vouchTemplatePrint(this, {
        params: params,
        callback: () => {
          this.$emit("printSuccessCallback", "");
        },
        errorCallback: () => {

        }
      });
    }
  }
};
</script>

<style scoped>

</style>
