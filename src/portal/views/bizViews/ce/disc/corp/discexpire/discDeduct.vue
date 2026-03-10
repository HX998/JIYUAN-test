<!--保贴商票到期扣款-扣款及保证金退回-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue" key="1">
      <h-col span="24">
        <!-- 主页面 -->
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custName" :label="$t('m.i.ce.discountCustName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearCustNo()"></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.ce.discountCustAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()" clearable></h-input>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryDrwrName()"
                           readonly clearable @on-clear="clearDrwrName()"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryDrwrAcctNo()" clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.protectType')" prop="protectType">
                  <h-select v-model="formItem.protectType" placeholder="" showTitle>
                    <h-option v-for="item in protectTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
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
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/disc/corp/discexpire/discDeduct/func_queryDiscBillExpireBatch"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billDetail()">{{$t("m.i.ce.billManage")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <disc-deduct-bill :billManagerVue="billManagerVue" :discDeductParams="discDeductParams"
                      @returnDiscMain="returnDiscMain"></disc-deduct-bill>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" :isAllBankAcct=true
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!-- 查询出票客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showDrwrNameWin" @custCorpWinClose="drwrNameWinClose"
                       @custCorpSelectSubmit="drwrNameSelectSubmit"></show-cust-message>
    <!-- 查询出票客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showDrwrAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                       @showCustAcctNoWinClose="drwrAcctNoWinClose" :isAllBankAcct=true
                       @custAcctNoSelectSubmit="drwrAcctNoSelectSubmit"></show-cust-acct-no>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "discDeduct",
    components: {
      DiscDeductBill:() => import(/* webpackChunkName: "ce/disc/corp/discexpire/discDeductBill" */`@/views/bizViews/ce/disc/corp/discexpire/discDeductBill`)
    },
    data() {
      let columns = [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 60
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
            title: this.$t("m.i.ce.discountCustName"),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.discountCustAcctNo"),
            key: "custAcctNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.protectType"),
            key: "protectType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ProtectType", params.row.protectType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
           title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
           title: this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (!!params.row.discDt) {
                let date = this.$moment(params.row.discDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              } else {
                return "";
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.discInterestRate"),
            key: "rate",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rate != null && params.row.rate !== "") {
                let rate = accMul(params.row.rate, 100) + "(%)";
                return h("span", rate);
              }
            }
          },
          {
           title: this.$t("m.i.ce.sumCount"),
            key: "sumCount",
            ellipsis: false,
            hiddenCol: false
          },
          {
          title: this.$t("m.i.ce.totalAmt"),
            key: "sumMoney",
            sortable: true,
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let sumMoney = formatNumber(params.row.sumMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: sumMoney
                }
              }, sumMoney);
            }
          }
        ];
      return {
        formItem : {
          applFlag: "0",
          custNo: "",
          custName: "",
          custAcctNo: "",
          drwrCustNo: "",
          drwrName: "",
          drwrAcctNo: "",
          protectType: ""
        },
        columns : columns,
        cloneColumns : this.deepClone(columns),
        protectTypeList : [],
        billOriginList : [],
        dictMap : new Map(),
        currentSelectRow : [],
        mainVue : true,
        billManagerVue : false,
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        showDrwrNameWin : false,
        showDrwrAcctNoWin : false,
        //是否显示更多查询项
        ifShowMore : false,
        discDeductParams : {},
      };
    },
    mounted() {
      this.getDictListByGroups("ProtectType,CDMedia,custAcctKind,BillOrigin").then(res => {
        this.protectTypeList = res.get("ProtectType");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
        this.formItem.drwrCustNo = "";
        this.formItem.drwrName = "";
        this.formItem.drwrAcctNo = "";
        this.formItem.protectType = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      clearCustNo() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
      },
      //查询贴现客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        if (info.custAcctNo !== "") {
          this.formItem.custAcctNo = info.custAcctNo;
        } else {
          this.formItem.custAcctNo = "";
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询贴现客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择贴现客户！" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      clearDrwrName() {
        this.formItem.drwrCustNo = "";
        this.formItem.drwrName = "";
        this.formItem.drwrAcctNo = "";
      },
      //查询出票客户信息
      queryDrwrName() {
        this.showDrwrNameWin = true;
      },
      //赋值
      drwrNameSelectSubmit(info) {
        this.formItem.drwrCustNo = info.custNo;
        this.formItem.drwrName = info.custName;
        if (info.drwrAcctNo !== "") {
          this.formItem.drwrAcctNo = info.custAcctNo;
        } else {
          this.formItem.drwrAcctNo = "";
        }
        this.showDrwrNameWin = false;
      },
      //关闭
      drwrNameWinClose() {
        this.showDrwrNameWin = false;
      },
      //查询出票客户账号信息
      queryDrwrAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择出票客户！" });
          return;
        }
        this.showDrwrAcctNoWin = true;
      },
      //赋值
      drwrAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showDrwrAcctNoWin = false;
      },
      //关闭弹窗
      drwrAcctNoWinClose() {
        this.showDrwrAcctNoWin = false;
      },
      //票据管理
      billDetail() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.assembleParams();
      },
      //返回主页面
      returnDiscMain() {
        this.currentSelectRow = [];
        this.mainVue = true;
        this.billManagerVue = false;
        this.discDeductParams = {};
        this.$nextTick(() => {
          this.columns = this.deepClone(this.cloneColumns);
          this.$refs.datagrid.createShowCol(this.cloneColumns);
        });
      },
      //点击批次编号超链接
      openBillManagerWin(batchId) {
        this.discDeductParams.batchId = batchId;
        this.assembleParams();
      },
      assembleParams() {
        this.$nextTick(()=>{
          this.discDeductParams.dictMap = this.dictMap;
          this.discDeductParams.applFlag = this.formItem.applFlag;
          this.discDeductParams.custName = this.currentSelectRow.custName;
          this.discDeductParams.custAcctNo = this.currentSelectRow.custAcctNo;
          this.discDeductParams.drwrName = this.currentSelectRow.drwrName;
          this.discDeductParams.drwrAcctNo = this.currentSelectRow.drwrAcctNo;
          this.discDeductParams.protectType = this.currentSelectRow.protectType;
          this.discDeductParams.billClass = this.currentSelectRow.billClass;
          this.discDeductParams.discDt = this.currentSelectRow.discDt;
          this.discDeductParams.rate = this.currentSelectRow.rate;
          this.discDeductParams.billOriginList = this.billOriginList;
        })
        this.mainVue = false;
        this.billManagerVue = true;
      }
    }
  };
</script>

<style scoped>

</style>
