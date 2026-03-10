<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <cust-name :formItem = "formItem" @queryCustMessage="queryCustMessage"></cust-name>
                <cust-acct-no :formItem = "formItem" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no>
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')">
                  <h-input v-model="formItem.billNoLike"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <!--票面到期日-->
                <due-dt-range v-model="dueDt" @on-change="handleDueDtChange"></due-dt-range>
                <h-form-item :label="$t('m.i.bs.flowStatus')"  prop="flowStatus">
                  <h-select v-model="formItem.flowStatus" placeholder="">
                    <h-option v-for="item in flowStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns"  highlight-row :url="url" :bindForm="formItem" :onCurrentChange="onCurrentChange" :onCurrentChangeCancel="onCurrentChangeCancel"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="sendBanEndorApply">{{$t('m.i.be.apply')}}</h-button>
                  <h-button type="primary" @click="cancelBanEndorApply">{{$t('m.i.common.revoke')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <!--挑票-->
    <pick-bill :pickBillWin="pickBillWin" :pickBillParams="pickBillParams"
                    @pickBillWinClose="pickBillWinClose"></pick-bill>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       :isAllBankAcct=true
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
  </div>
</template>
<script>
  import {
    post,
    getDictListByGroups,
    getDictValueFromMap,
    formatNumber,
    accMul,
    exportList
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "lockBill",
    data() {
      return {
        dictMap: new Map(),
        billClassList: [],
        billTypeList: [],
        billOriginList:[],
        creditMajorList:[],
        bankLevelList:[],
        tenorCodeList:[],
        flowStatusList:[],
        url: "/ce/disc/elec/banEndor/discBanEndorBill/func_queryBanEndorBill",
        dueDt: [],
        formItem: {
          custName: '',
          custNo: '',
          custAcctNo: '',
          billNoLike: '',
          minBillRangeStart:'',
          maxBillRangeEnd:'',
          minDueDt: "",
          maxDueDt: "",
          billOrigin: "",
          flowStatus: "",
        },
        columns: [
          {
            title: ' ',
            type: 'radio',
            width: 50,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('m.i.common.custName'),
            key: 'custName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: 'custAcctNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: 'flowStatus',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'banEndorBillFlowStatus', params.row.flowStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: 'acptName',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.remitDt?this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.billInfo.banEndrsmtMark"),
            key: "banEndrsmtMark",
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"BanEndorsementMarkCode",params.row.banEndrsmtMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false
          },
        ],
        ifShowMore: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart: '',
        billRangeEnd: '',
        pickBillWin: false,
        pickBillParams: {},
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        selectData : [],
      };
    },
    components: {
        pickBill: () => import(/* webpackChunkName: "ce/disc/elec/banEndor/pickBill"*/"@/views/bizViews/ce/disc/elec/banEndor/pickBill")
    },
    mounted() {
      getDictListByGroups('CDMedia,DraftTypeCode,BillOrigin,CreditMajor,bankLevel,TenorCode,BanEndorsementMarkCode,banEndorBillFlowStatus').then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get('CDMedia');
        this.billOriginList = res.get("BillOrigin");
        this.creditMajorList = res.get("CreditMajor");
        this.bankLevelList = res.get("bankLevel");
        this.tenorCodeList = res.get("TenorCode");
        this.flowStatusList = res.get("banEndorBillFlowStatus");
        this.dictMap = res.get('map');
      })
    },
    methods: {
      onCurrentChange(data) {
        this.selectData[0] = data;
      },
      onCurrentChangeCancel() {
        this.selectData = [];
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
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      sendBanEndorApply() {
        this.pickBillParams.dictMap = this.dictMap;
        this.pickBillParams.billTypeList = this.billTypeList;
        this.pickBillParams.billClassList = this.billClassList;
        this.pickBillParams.bankLevelList = this.bankLevelList;
        this.pickBillParams.billClass = "ME02";
        this.pickBillParams.tenorCodeList = this.tenorCodeList;
        this.pickBillParams.creditMajorList = this.creditMajorList;
        this.pickBillParams.url = "/ce/disc/elec/banEndor/discBanEndorBill/func_sendBanEndorApply";
        this.pickBillWin = true;
      },
      pickBillWinClose() {
        this.pickBillParams = {};
        this.formSearch();
        this.pickBillWin = false;
      },
      cancelBanEndorApply() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let id = list[0].id;
        let selectIds=[];
        selectIds.push(id);
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定撤销申请吗？",
          onOk: () => {
            post({ids: selectIds}, "/ce/disc/elec/banEndor/discBanEndorBill/func_cancelBanEndorApply").then(res => {
              if (res && res.data && res.data.retCode == '000000') {
                this.$msgTip.success(this);
                this.$refs.datagrid.selectIds = []
                this.$refs.datagrid.selects = []
                this.$refs.datagrid.dataChange(1);
              } else if (res) {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            }).catch(error => {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
            });
          }
        });

      },
      formSearch() {
        this.selectData = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.dueDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.custAcctNo = "";
        this.formItem.custName = "";
        this.formItem.custNo = "";
        this.$refs.formItem.resetFields();
      },
      //查询客户信息
      queryCustMessage(){
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
    },
  }

</script>
