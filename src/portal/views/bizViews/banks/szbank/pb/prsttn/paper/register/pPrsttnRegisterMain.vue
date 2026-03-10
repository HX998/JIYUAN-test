<template>
  <!--纸票代客结果登记-->
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
                url="/pb/prsttn/paper/register/pPrsttnRegisterMain/func_pageQueryPrsttnBill"
                :row-select="true"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm()">{{ $t("m.i.common.register") }}</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
        </h-col>
      </h-row>
    </div>

    <!-- 点击提示付款申请界面 -->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>代客发托结果登记</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.payCondition')" prop="signCode" required>
            <h-select v-model="addOrEditForm.signCode" placeholder="" showTitle>
              <h-option v-for="item in signCodeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              <!--<h-option value="SF00">退票</h-option>-->
              <!--<h-option value="SF01">收回</h-option>-->
              <!--<h-option value="SF02">丢票</h-option>-->
            </h-select>
          </h-form-item>
          <h-form-item prop="signDt" :label="$t('m.i.ce.rgstApplDt')" required>
            <h-date-picker v-model="addOrEditForm.signDt" format="yyyy-MM-dd" type="date" placeholder="" showFormat
                           :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.paymentSignOpin')" prop="signOpin" :validRules="signOpinRule" required>
            <h-input v-model="addOrEditForm.signOpin" placeholder="不超过80位" type="textarea" :rows="3"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="submit()">保存</h-button>
      </div>
    </h-msg-box>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId"></bill-info-main>

  </div>
</template>

<script>
import {post, on, off, formatNumber} from "@/api/bizApi/commonUtil";
import {deepClone} from "@/utils/index";

export default {
  name: "pPrsttnRegisterMain",
  components: {},
  data() {
    return {
      formItem: {
        billNoLike: "",
        minDueDt: "",
        maxDueDt: "",
        billType: "",
        acptNameLike: "",
        drweBankNoLike: "",
        minBillMoney: "",
        maxBillMoney: "",
        curFuncNo: "PICE040401",
        billClass: "ME01",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        orderByClause: "PRSTTN_DT desc, ID desc",
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
      ],
      addOrEditForm: {
        ids: "",
        signCode: "",
        signDt: window.sessionStorage.getItem("workDate"),
        signOpin: "",
        ownedBrchNo: "",
        licenseFlag: false
      },
      signCodeList: [],
      dictMap: new Map(),
      ifShowMore: false,
      addOrEditWin: false,
      currentSelectList: [],
      currentSelectRowInx: [],
      billTypeList: [],
      signOpinRule: [{test: /^.{0,80}$/, trigger: 'blur', message: '备注不能超过80位'}],
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
    this.getDictListByGroups("DraftTypeCode,CDMedia,Yon,PrsnttnResultRegCode").then(res => {
      this.signCodeList = res.get("PrsnttnResultRegCode");
      this.billTypeList = res.get("DraftTypeCode");
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
    //登记按钮
    handleForm() {
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      if (this.licenseFlag) {
        let selects = this.$refs.datagrid.selects;
        let ownedBrchNo = selects[0].ownedBrchNo;
        for (let i = 0; i < selects.length; i++) {
          if (ownedBrchNo !== selects[i].ownedBrchNo) {
            this.$msgTip.info(this, {info: "所选项的业务所属机构应相同"});
            return;
          }
        }
        this.addOrEditForm.ownedBrchNo = ownedBrchNo;
        this.addOrEditForm.licenseFlag = this.licenseFlag;
      }
      this.addOrEditWin = true;
      this.$nextTick(() => {
        this.$refs.addOrEditForm.resetFields();
        let ids = this.$refs.datagrid.selectIds.join(",");
        this.addOrEditForm.ids = ids;
      });

    },
    //代客发托结果登记弹出框保存按钮
    submit() {
      this.$refs["addOrEditForm"].validate(valid => {
        if (valid) {
          this.addOrEditForm.signDt = this.$moment(this.addOrEditForm.signDt).format("YYYYMMDD");
          post(this.addOrEditForm, "/pb/prsttn/paper/register/pPrsttnRegisterMain/func_submitResultReg").then(res => {
            this.submitFlag = false;
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                let form = deepClone(this.addOrEditForm);
                this.prsttnRegisterPrint(form);
                this.addOrEditWin = false;
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                this.currentSelectList = [];
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
              } else {
                this.$msgTip.error(this, {info: msg});
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              }
            } else {
              this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
            }
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
    //代客托收结果登记凭证打印
    prsttnRegisterPrint(form) {
      let param = {listIds: form.ids, signCode: form.signCode};
      let params = {templateName: "BE031804", params: JSON.stringify(param),listIds: form.ids,saveFlag:1};
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
