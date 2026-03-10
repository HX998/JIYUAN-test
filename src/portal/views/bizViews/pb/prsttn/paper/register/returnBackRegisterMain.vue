<template>
  <!--纸票托收退回登记-->
  <div class="layout">
    <div>
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
                  <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNoLike">
                    <h-input v-model="formItem.billNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.minDueDt')" prop="minDueDt">
                    <h-date-picker type="date" v-model="formItem.minDueDt" placeholder="" @on-change="handleMinDateChange" :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.maxDueDt')" prop="maxDueDt">
                    <h-date-picker type="date" v-model="formItem.maxDueDt" placeholder="" @on-change="handleMaxDateChange" :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                    <h-select v-model="formItem.billType" placeholder="" showTitle>
                      <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptNameLike" >
                    <h-input v-model="formItem.acptNameLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.drweBankNo')" prop="drweBankNoLike" >
                    <h-input v-model="formItem.drweBankNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
                    <h-typefield type="money" v-model="formItem.minBillMoney" placeholder="" @on-blur="formatMinBillMoney('blur')"
                                 @on-focus="formatMinBillMoney('focus')" bigTips></h-typefield>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
                    <h-typefield type="money" v-model="formItem.maxBillMoney" placeholder="" @on-blur="formatMaxBillMoney('blur')"
                                 @on-focus="formatMaxBillMoney('focus')" bigTips></h-typefield>
                  </h-form-item>
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
                url="/pb/prsttn/paper/register/returnBackRegisterMain/func_pageQueryPrsttnBill"
                :row-select="true"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="refundOfStock()">{{$t('m.i.ce.backBill')}}</h-button>
                  <h-button type="primary" @click="cancellationOfRefund()">{{$t('m.i.ce.backBillSettle')}}</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
          <!-- 分录弹框 -->
          <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"></acct-record>

          <!-- 点击退票入库界面 -->
          <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
            <p slot="header">
              <span>退票入库</span>
            </p>
            <h-panel>
              <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
                <h-form-item :label="$t('m.i.ce.backBillRigtType')" prop="signCode" required>
                  <h-select v-model="addOrEditForm.signCode"  placeholder="" showTitle>
                    <h-option v-for="item in prsnttnReturnRegCodeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.rgstApplDt')" prop="signDt" required>
                  <h-date-picker v-model="addOrEditForm.signDt" format="yyyy-MM-dd" type="date" placeholder="" showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.backBillReason')" prop="signOpin" :validRules="signOpinRule" required>
                  <h-input v-model="addOrEditForm.signOpin" placeholder="不超过80位" type="textarea" :rows="3"></h-input>
                </h-form-item>
              </h-form>
            </h-panel>
            <div slot="footer">
              <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary"  v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
              <h-button type="primary"  v-else @click="refundOfStockSubmit()">{{$t("m.i.common.submit")}}</h-button>
            </div>
          </h-msg-box>

          <!--票面信息-->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

        </h-col>
      </h-row>
    </div>

  </div>
</template>

<script>
  import { post, on, off, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "returnBackRegisterMain",
    components: {
    },
    data() {
      return {
        formItem : {
          billNoLike:"",
          minDueDt:"",
          maxDueDt:"",
          billType:"",
          acptNameLike:"",
          drweBankNoLike:"",
          minBillMoney:"",
          maxBillMoney:"",
          curFuncNo:"PICE040202",
          billClass:"ME01",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          orderByClause: "PRSTTN_DT desc, ID desc",
          authPath:this.$route.path
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
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
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
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
            sortable: true,
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.prsttnDt == null || params.row.prsttnDt === ""){
                return h("span", "-");
              }
              let prsttnDt = this.$moment(params.row.prsttnDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span",{domProps: {title: prsttnDt}},   prsttnDt);
            }
          },
        ],
        ifShowMore : false,
        submitFlag : false,
        dictMap : new Map(),
        currentSelectList : [],
        currentSelectRowInx : [],
        billTypeList : [],
        prsnttnReturnRegCodeList : [],
        addOrEditWin : false,
        addOrEditForm : {
          ids:"",
          signCode:"",
          signDt:window.sessionStorage.getItem("workDate"),
          signOpin:"",
          ownedBrchNo: "",
          licenseFlag: false
        },
        signOpinRule:[{test: /^.{0,80}$/, trigger:'blur', message: '备注不能超过80位'}],
        //分录
        acctRecordUrl : "",
        acctRecordParam : {},
        showAcctRecordWin : false,
        batchId : "",
        ids : "",
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        hasSelect : false,
        //业务所属机构
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath:this.$route.path
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,Yon,SettlementMarkCode,PrsnttnReturnRegCode").then(res => {
        this.prsnttnReturnRegCodeList = res.get("PrsnttnReturnRegCode");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.clearMarkList = res.get("SettlementMarkCode");
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
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
      handleMinDateChange(value){
        this.formItem.minDueDt = value.replace(/-/g, "");
      },
      handleMaxDateChange(value){
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
      //退票入库按钮
      refundOfStock(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        if (this.licenseFlag) {
          let selects = this.$refs.datagrid.selects;
          let ownedBrchNo = selects[0].ownedBrchNo;
          for (let i = 0; i < selects.length; i++) {
            if (ownedBrchNo !== selects[i].ownedBrchNo) {
              this.$msgTip.info(this,{info:"所选项的业务所属机构应相同"});
              return;
            }
          }
          this.addOrEditForm.ownedBrchNo = ownedBrchNo;
          this.addOrEditForm.licenseFlag = this.licenseFlag;
        }
        let ids = this.$refs.datagrid.selectIds.join(",");
        this.addOrEditForm.ids = ids;
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.$refs.addOrEditForm.resetFields();
        });
      },
      refundOfStockSubmit(){
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.signDt = this.$moment(this.addOrEditForm.signDt).format("YYYYMMDD");
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: "确定退票入库吗?",
              onOk: () => {
                this.submitFlag = true;
                post(this.addOrEditForm, "/pb/prsttn/paper/register/returnBackRegisterMain/func_submitReturnReg").then(res => {
                  this.submitFlag = false;
                  if (res) {
                    let msg = res.data.retMsg;
                    let retCode = res.data.retCode;
                    if (retCode === "000000") {
                      this.$msgTip.success(this, { info: msg });
                      this.addOrEditWin = false;
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                      this.currentSelectList = [];
                      this.$refs.datagrid.selects = [];
                      this.$refs.datagrid.selectIds = [];
                    } else {
                      this.$msgTip.error(this, { info: msg });
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    }
                  }
                }).catch(error => {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
                });
              }
            });
          }
        });
      },
      //退票结清按钮
      cancellationOfRefund(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let ownedBrchNo;
        if (this.licenseFlag) {
          let selects = this.$refs.datagrid.selects;
          ownedBrchNo = selects[0].ownedBrchNo;
          for (let i = 0; i < selects.length; i++) {
            if (ownedBrchNo !== selects[i].ownedBrchNo) {
              this.$msgTip.info(this,{info:"所选项的业务所属机构应相同"});
              return;
            }
          }
        }
        // this.batchId = list[0].batchId;
        this.ids = this.$refs.datagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账吗？",
          onOk: () => {
            // this.getEntryInfo();
            this.acctSubmitSure();
          }
        });
      },
      //获取分录信息
      getEntryInfo() {
        this.acctRecordUrl = "/pb/prsnttn/reg/generateAcctRecord";
        this.acctRecordParam = {  ids:this.ids };
        this.showAcctRecordWin = true;
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.showAcctRecordWin = false;
      },
      acctSubmitSure() {
        post({ ids:this.ids,ownedBrchNo:this.$refs.datagrid.selects[0].ownedBrchNo, licenseFlag: this.licenseFlag }, "/pb/prsttn/paper/register/returnBackRegisterMain/func_submitReturnRegAccount").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: msg });
              this.showAcctRecordWinClose();
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.ids = "";
              this.currentSelectList = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //票面信息关闭
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
