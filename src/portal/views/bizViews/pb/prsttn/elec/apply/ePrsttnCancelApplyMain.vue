<template>
  <!--电票提示付款撤回-->
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
                  <common-select v-model="formItem.isOverdue" :label="$t('m.i.billInfo.overdueFlag')" prop="isOverdue"
                                 :dictList="YonList"></common-select>
                  <!-- 票据来源 -->
                  <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                                 v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>
                  <!-- 票据号码 -->
                  <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                  <!-- 子票区间 -->
                  <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <!-- 承兑行名称 -->
                  <common-input :label="$t('m.i.billInfo.acptBankName')" prop="acptBankName"
                                v-model="formItem.acptBankName" class="h-form-long-label"></common-input>
                  <!-- 票据金额 -->
                  <bill-money-range v-model="formItem" :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label"
                                    :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false"></bill-money-range>
                  <!-- 出票日 -->
                  <remit-dt-range v-model="remitDt" :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt"></remit-dt-range>
                  <!-- 汇票到期日 -->
                  <due-dt-range v-model="dueDt" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>
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
                url="/pb/prsttn/elec/apply/ePrsttnCancelApplyMain/func_pageQueryPrsttnBill"
                :row-select="true"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm()">撤回</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
          <!--票面信息-->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                          :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

        </h-col>
      </h-row>
    </div>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "ePrsttnCancelApplyMain",
    components: {
    },
    data() {
      return {
        licenseFlag:false,
        authPath: this.$route.path ,
        formItem : {
          billType: "",
          billClass: "ME02",
          isOverdue: "",
          reverseBillNo: "",
          acptBankName: "",
          minBillMoney: "",
          maxBillMoney: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          inOutFlagList: ["1", "3"],
          curFuncNo: "PICE040106",
          orderByClause:"prsttn_dt asc,id desc",
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        columns : [
          {
            type: "selection",
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
            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false,

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
            key: "isOverdue",
            hiddenCol: false,

            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isOverdue);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.be.clearType"),
            key: "clearMark",

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.clearMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
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
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.prsttnDt"),
            key: "prsttnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.prsttnDt == null || params.row.prsttnDt === "") {
                return "";
              }
              let prsttnDt = this.$moment(params.row.prsttnDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: prsttnDt}}, prsttnDt);
            }
          },
          {
            title: this.$t("m.i.ce.prsttnStatus"),
            key: "prsttnStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PrsnttnStatusCode", params.row.prsttnStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.prsttnReceiveAmt"),
            key: "prsttnReceiveAmt",
            sortable: true,
            render: (h, params) => {
              if (params.row.prsttnReceiveAmt === "" || params.row.prsttnReceiveAmt === null) {
                return h("span", "-");
              }
              let prsttnReceiveAmt = formatNumber(params.row.prsttnReceiveAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: prsttnReceiveAmt
                }
              }, prsttnReceiveAmt);
            }
          },
        ],
        ifShowMore : false,
        dictMap : new Map(),
        billTypeList : [],
        YonList : [],
        billClassList : [],
        currentSelectRow : [],
        remitDt : [],
        dueDt : [],
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        billRangeStart: "",
        billRangeEnd: "",
        hasSelect : false,
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,Yon,SettleType,PrsnttnStatusCode,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.YonList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
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
      handleSelectClick(arr , selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      //撤回按钮
      handleForm(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤回吗？",
          onOk: () => {
            this.handleRevoke();
          }
        });
      },
      handleRevoke() {
        let ids = "";
        for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
          ids += this.$refs.datagrid.selects[i].transId;
          if (i < this.$refs.datagrid.selects.length - 1) {
            ids += ",";
          }
        }
        post({ transIds: ids, curFuncNo : this.formItem.curFuncNo }, "/pb/prsttn/elec/apply/ePrsttnCancelApplyMain/func_batchPrsttnCancelApply").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: msg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
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
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
