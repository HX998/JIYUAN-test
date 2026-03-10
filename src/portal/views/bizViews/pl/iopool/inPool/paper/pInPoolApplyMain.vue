<!--纸票出入池-入池申请管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" clearable @on-clear="clearVal('custAcctNo')" readonly></h-input>
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
                  <!--<span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"-->
                                                                                  <!--:class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
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
            url="/pl/iopool/inpool/paper/pInPoolApplyMain/func_pagingQueryInPoolBatchList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="inPoolOpenWin('add')" :disabled="formItem.isCommit === 'hasCommit'">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="inPoolOpenWin('modify')"
                        :disabled="formItem.isCommit === 'hasCommit'">{{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="inPoolDelete()" :disabled="formItem.isCommit === 'hasCommit'">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="inPoolCancel()" :disabled="formItem.isCommit === 'noCommit'">{{$t("m.i.common.cancelCheckAuth")}}
              </h-button>
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
        <p-in-pool-apply-add :inPoolAddOrEditWin="inPoolAddOrEditWin" :batchParams="batchParams"
                             :btnAuth="childrenBtnAuth"   @inPoolAddOrEditWinClose="inPoolAddOrEditWinClose"></p-in-pool-apply-add>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pInPoolApplyMain",
    components: {
      PInPoolApplyAdd: () => import(/* webpackChunkName: "pl/iopool/inPool/paper/pInPoolApplyAdd" */ '@/views/bizViews/pl/iopool/inPool/paper/pInPoolApplyAdd')
    },
    data() {
      return {
        formItem : {
          custNo: "",
          custName: "",
          custAcctNo: "",
          isCommit: "noCommit",
          billClass: "ME01",
          funcNo: "PIPL030202"
        },
        columns : [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this.openInPoolEditWin(params.row.id)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
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
           title: this.$t("m.i.pl.isCheckBeforeInPool"),
            key: "isCheckBeforeInPool",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCheckBeforeInPool);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pl.inPoolDt"),
            key: "inPoolDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.inPoolDt == null || params.row.inPoolDt === "") {
                return "";
              }
              let date = this.$moment(params.row.inPoolDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.inPoolTm"),
            key: "inPoolTm",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.inPoolTm == null || params.row.inPoolTm === "") {
                return "";
              }
              let inPoolTm = params.row.inPoolTm.toString();
              if (params.row.inPoolTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.inPoolTm.toString().length); i++) {
                  inPoolTm = "0" + inPoolTm;
                }
              }
              let date = this.$moment(inPoolTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pe.total"),
            key: "totalCount",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.totalAmt"),
            key: "totalAmt",
            sortable: true,
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.totalAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          }
        ],
        currentSelectRow : [],
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        inPoolAddOrEditWin : false,
        //是否显示更多查询项
        ifShowMore : false,
        dictMap : new Map(),
        billClassList : [],
        billTypeList : [],
        queryTypeList : [],
        YonList : [],
        //传入入池明细界面的参数
        batchParams : {},
        btnAuth:"",
        childrenBtnAuth:{},
      };
    },
    mounted() {
      this.getDictListByGroups("CDMedia,DraftTypeCode,QueryType,Yon").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.queryTypeList = res.get("QueryType");
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });

      //按钮权限查询 控制按钮显隐
      console.log(JSON.parse(window.sessionStorage.getItem("curMenu")));
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
    methods: {
      //未提交
      noCommitButton() {
        this.formItem.isCommit = "noCommit";
        this.formItem.funcNo = "PIPL030202";
        this.handleSearch();
      },
      //已提交
      hasCommitButton() {
        this.formItem.isCommit = "hasCommit";
        this.formItem.funcNo = "PIPL030203";
        this.handleSearch();
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
          this.formItem.custName = '';
        }
        if(type === 'custAcctNo'){
          this.formItem.custAcctNo = '';
        }
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
        this.formItem.funcNo = "PIPL030202";
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
      inPoolOpenWin(str) {
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.inPoolBatchId = this.currentSelectRow.id;
        } else {
          this.batchParams.inPoolBatchId = "";
        }
        this.assembleParams(str);
      },
      //关闭新增、修改弹窗
      inPoolAddOrEditWinClose() {
        this.inPoolAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //删除
      inPoolDelete() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel() {
        let id = this.currentSelectRow.id;
        post({ id: id }, "/pl/iopool/inpool/paper/pInPoolApplyMain/func_deleteInPoolBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //撤销
      inPoolCancel() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.batchParams.inPoolBatchId = this.currentSelectRow.id;
          this.assembleParams("modify");
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      //点击批次编号超链接
      openInPoolEditWin(batchId) {
        this.batchParams.inPoolBatchId = batchId;
        this.assembleParams("modify");
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.funcNo = this.formItem.funcNo;
        this.batchParams.billClass = this.formItem.billClass;
        this.batchParams.isCommit = this.formItem.isCommit;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billClassList = this.billClassList;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.queryTypeList = this.queryTypeList;
        this.batchParams.YonList = this.YonList;
        this.inPoolAddOrEditWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
