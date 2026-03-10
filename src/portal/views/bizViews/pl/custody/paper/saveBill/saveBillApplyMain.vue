<!-- 纸票代保管存票--存票申请 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')">
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="isCommit" :label="$t('m.i.pl.isCommit')">
                  <h-radio-group v-model="formItem.isCommit">
                    <h-radio label="noCommit" @on-click="noCommitButton">
                      <span>未提交</span>
                    </h-radio>
                    <h-radio label="hasCommit" @on-click="hasCommitButton">
                      <span>已提交</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <h-form-item class="h-form-operate">
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
            url="/pl/custody/paper/saveBill/saveBillApplyMain/func_pageQuerySaveBatchList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="saveBillOpenWin('add')" :disabled="formItem.isCommit === 'hasCommit'">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="saveBillOpenWin('modify')" :disabled="formItem.isCommit === 'hasCommit'">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="saveBillDelete()" :disabled="formItem.isCommit === 'hasCommit'">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="saveBillCancel()" :disabled="formItem.isCommit === 'noCommit'">{{$t("m.i.common.cancelCheckAuth")}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose"
                           @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!-- 新增修改弹窗 -->
        <save-bill-apply-add :saveBillAddOrEditWin="saveBillAddOrEditWin" :batchParams="batchParams"
                             @saveBillAddOrEditWinClose="saveBillAddOrEditWinClose"></save-bill-apply-add>

      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "saveBillApplyMain",
    components: {
      SaveBillApplyAdd : () => import(/* webpackChunkName: "pl/custody/paper/saveBill/saveBillApplyAdd" */ '@/views/bizViews/pl/custody/paper/saveBill/saveBillApplyAdd')
    },
    data() {
      return {
        formItem : {
          custNo: '',
          custAcctNo: '',
          isCommit: "noCommit",
          billClass: 'ME01',
          curFuncNo: 'PIPL020201',
          transBrchNo: this.$store.getters.userInfo.brchNo,
        },
        columns : [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width: 50
          },
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: true,
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: 'batchNo',
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this.openSaveBillEditWin(params.row.id, params.row.custAcctNo, params.row.billType);
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.common.custName"),
            key: 'custName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: 'custNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: 'custAcctNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pl.checkType"),
            key: 'checkType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CheckType", params.row.checkType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pl.saveBrchName"),
            key: 'saveBrchName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.createDt'),
            key: 'saveBatchDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.saveBatchDt == null || params.row.saveBatchDt === "") {
                return "";
              }
              let date = this.$moment(params.row.saveBatchDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.createTime'),
            key: 'createTime',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let createTime = params.row.createTime.toString().substring(8,14);
              let date = this.$moment(createTime, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pe.totalAmt"),
            key: 'totalAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t("m.i.pe.total"),
            key: 'totalCount',
            hiddenCol: false,
          }
        ],
        checkTypeList : [],
        currentSelectRow : [],
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        saveBillAddOrEditWin : false,
        //是否显示更多查询项
        ifShowMore : false,
        dictMap : new Map(),
        billTypeList : [],
        //传入入池明细界面的参数
        batchParams : {},
        isList : [],
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CheckType,Yon").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.checkTypeList = res.get("CheckType");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
        }else{
          this.formItem.custAcctNo = '';
        }
      },
      //未提交
      noCommitButton() {
        this.formItem.isCommit = "noCommit";
        this.formItem.curFuncNo = "PIPL020201";
        this.handleSearch();
      },
      //已提交
      hasCommitButton() {
        this.formItem.isCommit = "hasCommit";
        this.formItem.curFuncNo = "PIPL020202";
        this.handleSearch();
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.$refs.formItem.resetFields();
        this.formItem.isCommit = "noCommit";
        this.formItem.curFuncNo = "PIPL020201";
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
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
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
      //新增、修改
      saveBillOpenWin(str) {
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.batchId = this.currentSelectRow.id;
          this.batchParams.custAcctNo = this.currentSelectRow.custAcctNo;
          this.batchParams.billType = this.currentSelectRow.billType;
        } else {
          this.batchParams.batchId = "";
        }
        this.assembleParams(str);
      },
      //关闭新增、修改弹窗
      saveBillAddOrEditWinClose() {
        this.saveBillAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //删除
      saveBillDelete() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        post({id: this.currentSelectRow.id},'/pl/custody/paper/saveBill/saveBillApplyMain/func_deleteSaveBatch').then(res => {
          if(res){
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectRow = [];
            }else{
              this.$msgTip.error(this, { info: msg });
            }
          }else{
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        })
      },
      //撤销
      saveBillCancel() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.batchParams.batchId = this.currentSelectRow.id;
          this.assembleParams("modify");
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //点击批次编号超链接
      openSaveBillEditWin(batchId,custAcctNo,billType) {
        this.batchParams.batchId = batchId;
        this.batchParams.custAcctNo = custAcctNo;
        this.batchParams.billType = billType;
        this.assembleParams("modify");
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.curFuncNo = this.formItem.curFuncNo;
        this.batchParams.billClass = this.formItem.billClass;
        this.batchParams.isCommit = this.formItem.isCommit;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.isList = this.isList;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.checkTypeList = this.checkTypeList;
        this.saveBillAddOrEditWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
