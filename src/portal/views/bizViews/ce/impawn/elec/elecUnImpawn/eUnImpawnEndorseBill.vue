<!--解质押背书明细-->
<template>
  <div>
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4"
                      class="h-form-search">
                <!--票据来源：下拉框-->
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="billManagerFormItem.billOrigin" placeholder="">
                    <h-option v-for="item in unImpawnBillParams.billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <!--票据（包）号码：-->
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')"  prop="reverseBillNo">
                  <h-input v-model="billManagerFormItem.reverseBillNo"></h-input>
                </h-form-item>
                <!--子票区间：区间框-->
                <bill-range :form-item="billManagerFormItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" :label-width="100">
                  <h-typefield type="money" v-model="billManagerFormItem.billMoney" placeholder="" @on-blur="formatBillMoney('blur')"
                               @on-focus="formatBillMoney('focus')" bigTips></h-typefield>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="billManagerFormItem.remitDt" placeholder="" showFormat
                                 :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="billManagerFormItem.dueDt" placeholder="" showFormat
                                 :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <impawn-batch-detail :batchDetailParams="unImpawnBillParams" ref="impawnBatchDetail"></impawn-batch-detail>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/impawn/elec/elecUnImpawn/eUnImpawnEndorseMain/func_billlist"
                      highlightRow
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      :has-select="false"
                      :rowSelect="true"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="endorseBack"
                          v-if="this.unImpawnBillParams.isCommit === 'noCommit' && (this.childrenBtnAuth.endorseBack === undefined ? true : this.childrenBtnAuth.endorseBack.isShow)">
                <h-button type="primary">退回
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次退回</h-dropdown-item>
                  <h-dropdown-item name="select">选择退回</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>

              <h-dropdown placement="bottom-start" @on-click="endorse" v-if="this.unImpawnBillParams.isCommit === 'noCommit'">
                <h-button type="primary">背书<h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次背书</h-dropdown-item>
                  <h-dropdown-item name="select">选择背书</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>

              <h-dropdown placement="bottom-start" @on-click="endorseCancel" v-if="this.unImpawnBillParams.isCommit === 'hasCommit'">
                <h-button type="primary">撤销背书<h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次撤销</h-dropdown-item>
                  <h-dropdown-item name="select">选择撤销</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="ghost" @click="returnMain">返回</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>
  </div>
</template>

<script>
  import { formatNumber, off, on, post,formatBillRange } from "@/api/bizApi/commonUtil";
  import { deepClone } from "@/utils/index";
  import ImpawnBatchDetail from "@/views/bizViews/ce/impawn/elec/elecUnImpawn/eUnImpawnEndorseBatchDetail";

  export default {
    name: "eUnImpawnEndorseBill",
    components: {
      ImpawnBatchDetail
    },
    data() {
      let billManagerColumns = [
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
          title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue =(!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.unImpawnBillParams.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'), //票据（包）号码
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let info = "", type = "";
            if (!!params.row.billId) {
              info = params;
              type = "billId";
            } else {
              info = params;
              type = "billNo";
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row, type);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),   //子票区间
          key: "billRange",
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),   //票据(包)金额
          key: "billMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', formatNumber(params.row.billMoney, 2, ','))
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.unImpawnBillParams.dictMap, "DraftTypeCode", params.row.billType);
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
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.remitDt == null || params.row.remitDt === "") {
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.dueDt == null || params.row.dueDt === "") {
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
         title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
         title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: "drwrAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drwrBankNo"),
          key: "drwrBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
         title: this.$t("m.i.billInfo.pyeeAcctNo"),
          key: "pyeeAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
           title: this.$t("m.i.billInfo.pyeeBankNo"),
          key: "pyeeBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        }
      ];
      return {
        ifShowMore: false,
        billManagerFormItem: {
          batchId: "",
          funcNo: "",
          billClass: "ME02",
          billNo: "",
          billMoney: "",
          remitDt: "",
          dueDt: "",
          reverseBillNo:"",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
        },
        childrenBtnAuth:"",
        btnAuth:"",
        billManagerColumns: billManagerColumns,
        cloneBillManagerColumns: deepClone(billManagerColumns),
        showBillInfoWin: false,
        billId: "",
        billNo: "",
      }
    },
    props: {
      billManagerVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      unImpawnBillParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          batchId: "",
          funcNo: "",
          billClass: "",
          isCommit: "",
          accountType: "",
          ownedBrchNo:"",    //授权机构号
          licenseFlag:false, //授权标志
          billOriginList: [],
        }
      }
    },
    computed: {
      tempBillManagerVue: {
        get() {
          return this.billManagerVue;
        },
        set() {
        }
      }
    },
    mounted() {
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if(this.btnAuth.manager!=null&&this.btnAuth.manager!=undefined){
              if(this.btnAuth.manager.children!=null&&this.btnAuth.manager.children!=undefined) {
                this.childrenBtnAuth = this.btnAuth.manager.children;
              }
            }
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.unImpawnBillParams.batchId;
          this.billManagerFormItem.funcNo = this.unImpawnBillParams.funcNo;
          this.billManagerFormItem.billClass = this.unImpawnBillParams.billClass;
          this.$nextTick(() => {
            this.billManagerColumns = this.deepClone(this.cloneBillManagerColumns);
            this.$refs.billManagerDatagrid.createShowCol(this.cloneBillManagerColumns);
            this.handleSearch();
            this.$refs.impawnBatchDetail.getImpawnBatchInfo("unImpawn");
          });
        }
      }
    },
    methods: {
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.billManagerFormItem.billMoney)) && isFinite(this.billManagerFormItem.billMoney)) {
            this.billManagerFormItem.billMoney = this.billManagerFormItem.billMoney == null ? "0.00" : formatNumber(this.billManagerFormItem.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.billManagerFormItem.billMoney = this.billManagerFormItem.billMoney.toString().replace(/,/g, "");
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.billManagerDatagrid.selects = [];
        this.billManagerFormItem.remitDt = this.billManagerFormItem.remitDt.replace(/-/g, "");
        this.billManagerFormItem.dueDt = this.billManagerFormItem.dueDt.replace(/-/g, "");
        this.$refs.billManagerDatagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.billManagerFormItem.billNo = "";
        this.billManagerFormItem.billMoney = "";
        this.billManagerFormItem.remitDt = "";
        this.billManagerFormItem.dueDt = "";
        this.billManagerFormItem.reverseBillNo = "";
        this.billManagerFormItem.billOrigin = "";
        this.billManagerFormItem.minBillRangeStart = "";
        this.billManagerFormItem.maxBillRangeEnd = "";
      },
      //批次退回或选择退回
      endorseBack(type) {
        let params = this.composeParams(type);
        if (null == params) {
          return;
        } else {
          params.isPass = "0";
          this.handleBackSubmit(params, "back", type);
        }
      },
      //背书
      endorse(type) {
        let params = this.composeParams(type);
        if (null == params) {
          return;
        } else {
          params.isPass = "1";
          this.handleBackSubmit(params, "endorse", type);
        }
      },
      endorseCancel(type) {
        let params = this.composeParams(type);
        if (null == params) {
          return;
        } else {
          this.handleBackSubmit(params, "endorseCancel", type);
        }
      },
      composeParams(type) {
        let params = {
          batchId: this.unImpawnBillParams.batchId,
          ownedBrchNo:this.unImpawnBillParams.ownedBrchNo,
          licenseFlag: this.unImpawnBillParams.licenseFlag,
        };
        if (type === "select") {
          let list = this.$refs.billManagerDatagrid.selects;
          if (list.length === 0 ) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return null;
          }
          let unImpawnIds = [];
          for (let i = 0; i < list.length; i++) {
            unImpawnIds.push(list[i].id);
          }
          params.unImpawnIds = unImpawnIds.join(",");
        } else {
          if (this.$refs.billManagerDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return null;
          }
        }
        return params;
      },
      handleBackSubmit(params, signType, type) {
        let content = signType === "back" ? "确定退回吗?" : signType === "endorse" ? "确定背书吗?" : "确定撤销背书吗";
        let url = signType === "endorseCancel" ? "/ce/impawn/elec/elecUnImpawn/eUnImpawnEndorseBill/func_cancelUnImpawnEndSmtApply" : "/ce/impawn/elec/elecUnImpawn/eUnImpawnEndorseBill/func_submitSmtApply";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          onOk: () => {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (type === "batch" || this.$refs.billManagerDatagrid.tData.length === this.$refs.billManagerDatagrid.selects.length) {
                    this.returnMain();
                  } else {
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                    this.$refs.impawnBatchDetail.getImpawnBatchInfo("unImpawn");
                    this.$refs.billManagerDatagrid.selects = [];
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //返回主页面
      returnMain() {
        this.resetSearch();
        this.$emit("returnSignMain", "");
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(row, type) {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        if (type === "billId") {
          this.billId = row.billId;
        } else {
          this.billNo = row.billNo;
        }
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
