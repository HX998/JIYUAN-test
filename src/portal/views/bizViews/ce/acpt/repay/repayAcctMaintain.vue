<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.acptProtocalNo')" :validRules="custAcctNoRule">
                  <h-input v-model="formItem.billNo" :maxlength="30" placeholder=" "></h-input>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker v-model="formItem.dueDt" type="date" placeholder="" @on-change="handleDueDtChange"
                                 :editable=false :showFormat=true></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptProtocalNo" :label="$t('m.i.billInfo.acptProtocalNo')" :validRules="custAcctNoRule">
                  <h-input v-model="formItem.acptProtocalNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker v-model="formItem.remitDt" type="date" placeholder="" @on-change="handleRemitDtChange"
                                 :editable=false :showFormat=true></h-date-picker>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      :bindForm="formItem"
                      url="/ce/acpt/repay/repayAcctMaintain/func_pageQueryAcptRepayAcctList"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="guarntrAmtAddToOpenWin()">{{$t('m.i.ce.guarntrAmtAddTo')}}
              </h-button>
            </div>
          </h-datagrid>

        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <guarntr-amt-add :acptAddOrEditWin="acptAddOrEditWin" :batchParams="batchParams"  @acptAddOrEditWinClose="acptAddOrEditWinClose" @refushDatagrid="refushDatagrid"></guarntr-amt-add>
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import {formatNumber, post, on, off, accMul, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "repayAcctMaintain",
    components: {
      "guarntr-amt-add": ()=>import(/* webpackChunkName: "ce/acpt/repay/guarntrAmtAdd" */`@/views/bizViews/ce/acpt/repay/guarntrAmtAdd`),
      "ShowDeductAcct":()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`)
    },
    data() {
      let columns = [
        {
          title: " ",
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
          title: this.$t("m.i.billInfo.billOrigin"),
          key: 'billOrigin',
          align:'center',
          hiddenCol: false,
          render:(h,params) => {
            debugger
            let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
            if (params.row.billOrigin===dictValue) {
              dictValue='-';
            }
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.acptProtocalNo'),
          key: 'acptProtocalNo',
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align:'center',
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'),
          key: 'billNo',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.billInfoWinOpen(params.row)
                }
              }
            }, params.row.billNo)
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: 'flowStatusName',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.ce.acptStatus'),
          key: "acptStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"AcptStatus",params.row.acptStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.ce.promNoteNo'),
          key: 'promNoteNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title:  this.$t("m.i.billInfo.billPackageMoney"),
          key: 'billMoney',
          hiddenCol: false,
          sortable: true,
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
          title: this.$t("m.i.ce.bailPcet"),
          key: 'bailPcet',
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.bailPcet != null && params.row.bailPcet !== ""){
              let rate = accMul(params.row.bailPcet, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guarntrAmt"),
          key: 'bailAmt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let bailAmt = formatNumber(params.row.bailAmt, 2, ',');
            return h("span", {
              domProps: {
                title: bailAmt
              }
            }, bailAmt);
          }
        },
        {
          title: this.$t("m.i.ce.guarntrNo"),
          key: "guarntrNo",
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.showDueDeductAcct(params.row.id);
                }
              }
            }, '查看');
          }
        },
        {
          title: this.$t('m.i.billInfo.pyeeName'),
          key: 'pyeeName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: "drwrAcctNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
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
          title: this.$t('m.i.billInfo.dueDt'),
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
        }
      ];
      let formItem = {
        billNo: '',
        dueDt: '',
        acptProtocalNo: '',
        remitDt: '',
        likeDrwrName : '',
        drwrAcctNo : '',
        drwrCustNo : '',
        legalNo : '',
        transBrchNo : ''
      };

      function validcustAcctNo(rule, val, callback) {
        let re = /^[a-zA-Z0-9]{0,30}$/;
        if (re.test(val)) {
          callback()
        } else {
          callback(new Error("非法输入，只能输入英文、数字"))
        }
      }

      return {
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        acptAddOrEditWin : false,
        showBillInfoWin: false,
        dueDeductAcctWin: false,
        dictMap: new Map(),
        acptStatus: '',
        billOrigin:'',
        type: null,
        ifShowMore: false,
        paramId: "id",
        //明细挑票地址
        formItem: formItem,
        columns: columns,
        param: "",
        rows: "",
        chooseType: "",
        billId: "",
        billNo: "",
        batchParams: {
          id: {
            type: Number
          },
          dictMap: {
            type: Map
          }
        },
        showParams: {
          listId:"",
        },
        custAcctNoRule: [{ test: validcustAcctNo, trigger: "blur" }],
        billRangeStart: "",
        billRangeEnd: "",
      }
    },
    methods: {
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      handleRemitDtChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      handleDueDtChange(value) {
        this.formItem.dueDt = value.replace(/-/g, "");
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.drwrName = '';
        this.formItem.drwrCustNo = '';
      },
      // 关闭保证金追加弹窗
      acptAddOrEditWinClose() {
        this.currentSelectRow = [];
        this.acptAddOrEditWin = false;
        let pageNo =  this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      // 保证金追加
      guarntrAmtAddToOpenWin() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchParams.id = this.currentSelectRow.id;
        this.batchParams.drwrCustNo = this.currentSelectRow.drwrCustNo;
        this.batchParams.acptProtocalNo = this.currentSelectRow.acptProtocalNo;
        this.batchParams.billNo = this.currentSelectRow.billNo;
        this.batchParams.promNoteNo = this.currentSelectRow.promNoteNo;
        this.batchParams.billId = this.currentSelectRow.billId;
        this.acptAddOrEditWin = true;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      billInfoWinOpen(row) {
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },
      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
      refushDatagrid() {
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
      },
    },

    mounted() {
      debugger;
      this.getDictListByGroups("AcptStatus,BillOrigin").then(res => {
        this.dictMap = res.get("map");
        setTimeout(function () {
          this.moreComp = true;
        }, 3000)
      });
    },
    created() {
      this.formItem.legalNo = JSON.parse(window.sessionStorage.getItem("userInfo")).legalNo;
      this.formItem.transBrchNo = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
    }
  };
</script>

<style scoped>

</style>
