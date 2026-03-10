<!--纸票质押撤销记账-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNo" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="impawnDt" :label="$t('m.i.ce.impawnDt')">
                  <h-date-picker type="date" v-model="formItem.impawnDt" placeholder="" @on-change="handleDateChange"
                                 showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" v-if="this.licenseFlag" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/ce/impawn/paper/paperImpawn/pImpawnCancelAccountMain/func_queryImpawnBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="cancelAccount()">撤销记账</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <p-impawn-cancel-account-bill :billManagerVue="billManagerVue" :impawnBillParams="impawnBillParams"
                                  @returnCancelAccountMain="returnCancelAccountMain"></p-impawn-cancel-account-bill>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>

  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pImpawnCancelAccountMain",
    components: {
      PImpawnCancelAccountBill:()=>import(/* webpackChunkName: "ce/impawn/paper/paperImpawn/pImpawnCancelAccountBill" */`@/views/bizViews/ce/impawn/paper/paperImpawn/pImpawnCancelAccountBill`),

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
          key: "ownedBrchNo",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
           title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    this.openBillManagerWin(params.row.id)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
         title: this.$t("m.i.common.custName"),
          key: "custName",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.custNo"),
          key: "custNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
         title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.impawnDt"),
          key: "impawnDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.impawnDt == null || params.row.impawnDt === "") {
              return "";
            }
            let date = this.$moment(params.row.impawnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
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
        ifShowMore: false,
        formItem: {
          billClass: "ME01",
          funcNo: "PICE030407",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          custNo: "",
          custName: "",
          batchNo: "",
          impawnDt: "",
          queryFlag: "0",
        },
        columns: columns,
        cloneColumns: this.deepClone(columns),
        currentSelectRow: [],
        mainVue: true,
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        // brchNoWin : false,
        billManagerVue: false,
        showCustMessageWin: false,
        dictMap: new Map(),
        impawnBillParams: {}
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,ImpawnRgstStatus").then(res => {
        this.dictMap = res.get("map");
      });

      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let  columns = [];
            if (this.licenseFlag) {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.cloneColumns = this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
          this.formItem.custName = "";
        }
      },
      handleDateChange(value) {
        this.formItem.impawnDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.formItem.impawnDt = this.formItem.impawnDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.batchNo = "";
        this.formItem.impawnDt = "";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //撤销记账
      cancelAccount() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.impawnBillParams.batchId = this.currentSelectRow.id;
        this.impawnBillParams.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
        this.impawnBillParams.licenseFlag = this.licenseFlag;
        this.assembleParams();
      },
      //返回主页面
      returnCancelAccountMain() {
        this.currentSelectRow = [];
        this.formItem.impawnDt = this.formItem.impawnDt.replace(/-/g, "");
        this.mainVue = true;
        this.billManagerVue = false;
        this.impawnBillParams = {};
        this.$nextTick(() => {
          this.columns = this.deepClone(this.cloneColumns);
          this.$refs.datagrid.createShowCol(this.cloneColumns);
        });
      },
      //点击批次编号超链接
      openBillManagerWin(batchId) {
        this.impawnBillParams.batchId = batchId;
        this.assembleParams();
      },
      assembleParams() {
        this.impawnBillParams.dictMap = this.dictMap;
        this.impawnBillParams.funcNo = this.formItem.funcNo;
        this.impawnBillParams.billClass = this.formItem.billClass;
        this.impawnBillParams.accountType = "impawn";
        this.mainVue = false;
        this.billManagerVue = true;
      },
    }
  };
</script>

<style scoped>

</style>
