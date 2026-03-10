<!-- 额度申请-批次 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item  :label="$t('m.i.pc.creditType')" prop="creditType">
                  <h-select v-model="formItem.creditType" placeholder="">
                    <h-option value="1">综合授信</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.custType')" prop="custType">
                  <h-select v-model="formItem.custType" @on-change="custTypeChange('query')" placeholder="">
                    <h-option v-for="item in custTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" readonly icon="android-search"
                           @on-click="queryCustName" clearable @on-clear="clearCustName()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.creditDt')" prop="creditDt">
                  <h-date-picker v-model="formItem.creditDt" type="date" :editable=false
                                 :showFormat=true placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/credit/creditGrantBatch/func_pagingQueryCreditBatchList"
            :bindForm="formItem"
            :page-size="pageSizeParamValue"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.creditBatchAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <!--<h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.creditBatchModify">-->
              <!--{{$t("m.i.common.modify")}}-->
              <!--</h-button>-->
              <h-button type="primary" @click="handleComfirm" v-if="authObj.creditBatchDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="handleCreditGrantInfo" v-if="authObj.creditInfo">
                {{$t("m.i.pc.creditGrantInfo")}}
              </h-button>
              <h-button type="primary"
                        v-if="this.btnAuth.import === undefined ? false : this.btnAuth.import.isShow"
                        @click="infoImport">{{ $t("m.i.common.batchImport") }}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--查看企业客户-->
    <show-cust-corp :showCustCorpWin="showCustCorpWin" :title="'查看企业客户'" @showCustCorpWinClose="showCustCorpWinClose"
                    @custSelect="custCorpSelect"></show-cust-corp>
    <!--查看会员-->
    <show-member :showMemberWin="showMemberWin" @memberWinClose="memberWinClose"
                 @memberSelect="memberSelect"></show-member>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type==='add'">新增额度批复</span>
        <span v-if="type==='modify'">修改额度批复</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.creditType')" prop="creditType" :required="isRequired">
            <h-select v-model="addForm.creditType" :readonly="type === 'modify'" placeholder="">
              <!--<h-option v-for="item in creditTypeList" :value="item.key" :key="item.value">{{ item.value }}-->
              <!--</h-option>-->
              <h-option value="1">综合授信</h-option>
            </h-select>
          </h-form-item>
          <h-form-item  :label="$t('m.i.pc.custType')" prop="custType" :required="isRequired">
            <h-select v-model="addForm.custType" @on-change="custTypeChange('edit')" :readonly="type === 'modify'"
                      placeholder="">
              <h-option v-for="item in custTypeList" :value="item.key" :key="item.value">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="isRequired">
            <h-input v-model="addForm.custName" readonly icon="android-search"
                     @on-click="queryCustName" clearable @on-clear="clearCustName()"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--额度明细弹出框-->
    <credit-grant-info :creditGrantInfoWin.sync="creditGrantInfoWin" :creditGrantInfoParams="creditGrantInfoParams"
                       @creditGrantInfoWinClose="creditGrantInfoWinClose"></credit-grant-info>

    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
  </div>
</template>
<script>
  import { on, off, post,formatNumber } from "@/api/bizApi/commonUtil";



  export default {
    name: "creditGrantBatch",
    data() {
      return {
        pageSizeParamValue : "",
        ifShowMore : false,
        //给按钮增加权限
        authObj : {
          creditBatchAdd: true,       //新增额度批次
          creditBatchModify: true,    //修改额度批次
          creditBatchDelete: true,    //删除额度批次
          creditInfo: true           //额度明细
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.pc.creditType"),
            key: "creditType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = params.row.creditType;
              switch (params.row.creditType) {
                case "1":
                  info = "综合授信";
                  break;
              }
              return h("span", info);
            }
          },
          {
            title: this.$t("m.i.pc.custType"),
            key: "custType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CreditCustType", params.row.custType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberBankNo"),
            key: "custBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true

          },
          {
            title: this.$t("m.i.pc.creditDt"),
            key: "creditDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.creditDt == null ? "" : this.$moment(params.row.creditDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.operTeller"),
            key: "operTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.total"),
            key: "totalCount",
            hiddenCol: false
          }
        ],
        formItem : {
          creditType: "",
          custType: "1",
          custNo: "",
          custName: "",
          memberId: "",
          memberName: "",
          creditDt: ""
        },
        addForm : {
          id: "",
          legalNo: "",
          creditType: "",
          custType: "",
          memberId: "",
          memberName: "",
          custNo: "",
          custName: "",
          custBankNo: ""
        },
        fileParams: {
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pc/credit/creditGrantInfoReCheck/func_loadExcelData",  //导入excel数据解析接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pc/credit/creditGrantInfoReCheck/func_submitExcelData",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
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
              title: this.$t("m.i.pc.creditInfoNo"),
              key: "creditInfoNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true
            },
            {
              title: this.$t("m.i.pc.creditLimitAmt"),
              key: "creditLimitAmt",
              hiddenCol: false,
              ellipsis: false,
              sortable: true,
              render: (h, params) => {
                let creditLimitAmt = formatNumber(params.row.creditLimitAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: creditLimitAmt
                  }
                }, creditLimitAmt);
              }
            },
            {
              title: this.$t("m.i.pc.doAmt"),
              key: "doAmt",
              hiddenCol: false,
              ellipsis: false,
              sortable: true,
              render: (h, params) => {
                let doAmt = formatNumber(params.row.doAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: doAmt
                  }
                }, doAmt);
              }
            },
            {
              title: this.$t("m.i.pc.activeDt"),
              key: "activeDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.activeDt == null ? "" : this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.pc.failureDt"),
              key: "failureDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.failureDt == null ? "" : this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.pc.creditProd"),
              key: "creditProdNo",
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "CreditProdNoList", params.row.creditProdNo);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            }
          ],
          paramKey: "list"         //后台接收对应key
        },
        type : null,
        importWin: false,
        showImportProdNo: false,
        exportByProdNo: false,
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : null,
        btnAuth: {},
        creditTypeList : [],
        custTypeList : [],
        creditStatusList : [],
        dictMap : new Map(),
        //查看会员弹出框
        showMemberWin : false,
        //查看企业客户弹出框
        showCustCorpWin : false,
        //额度明细批复弹出框
        creditGrantInfoWin : false,
        creditGrantInfoParams : {
          creditBatchId: "",
          creditType: "",
          custType: "",
          dictMap: new Map(),
          creditProdNoList: []
        },
        creditProdNoList : [],
        //区分查询客户号操作类型
        optType : "query",
      };
    },
    components: {
      ShowMember:()=>import(/* webpackChunkName: "shcpe/cpes/member/showMember" */`@/views/bizViews/shcpe/cpes/member/showMember`),
      ShowCustCorp:()=>import(/* webpackChunkName: "bm/cust/corp/showCustCorp" */`@/views/bizViews/bm/cust/corp/showCustCorp`),
      CreditGrantInfo :()=>import(/* webpackChunkName: "pc/credit/creditGrantInfo" */`@/views/bizViews/pc/credit/creditGrantInfo`)
    },
    methods: {
      //1-同业客户，查询会员信息；2-企业客户，查询企业客户信息
      custTypeChange(optType) {
        this.optType = optType;
        if (optType === "query") {
          this.formItem.memberId = "";
          this.formItem.memberName = "";
          this.formItem.custNo = "";
          this.formItem.custName = "";
        } else if (optType === "edit") {
          if (this.type === "add") {
            this.addForm.memberId = "";
            this.addForm.memberName = "";
            this.addForm.custNo = "";
            this.addForm.custName = "";
            this.addForm.custBankNo = "";
          }
        }
      },
      clearCustName() {
        if (this.optType === "query") {
          this.formItem.memberId = "";
          this.formItem.memberName = "";
          this.formItem.custNo = "";
          this.formItem.custName = "";
        } else if (optType === "edit") {
          if (this.type === "add") {
            this.addForm.memberId = "";
            this.addForm.memberName = "";
            this.addForm.custNo = "";
            this.addForm.custName = "";
            this.addForm.custBankNo = "";
          }
        }
      },
      //1-同业客户，查询会员信息；2-企业客户，查询企业客户信息
      queryCustName() {
        if (this.optType === "query") {
          if (this.formItem.custType === "") {
            this.$msgTip.info(this, { info: "请先选择客户类型" });
            return false;
          }
          if (this.formItem.custType === "1") {
            this.showMemberWin = true;
          } else if (this.formItem.custType === "2") {
            this.showCustCorpWin = true;
          }
        } else if (this.optType === "edit") {
          if (this.addForm.custType === "") {
            this.$msgTip.info(this, { info: "请先选择客户类型" });
            return false;
          }
          if (this.addForm.custType === "1") {
            this.showMemberWin = true;
          } else if (this.addForm.custType === "2") {
            this.showCustCorpWin = true;
          }
        }
      },
      showCustCorpWinClose() {
        this.showCustCorpWin = false;
      },
      custCorpSelect(info) {
        if (this.optType === "query") {
          this.formItem.custNo = info.custNo;
          this.formItem.custName = info.custName;
        } else if (this.optType === "edit") {
          this.addForm.custNo = info.custNo;
          this.addForm.custName = info.custName;
        }
        this.showCustCorpWin = false;
      },
      memberWinClose() {
        this.showMemberWin = false;
      },
      getButtonAuth() {
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
            } else {
              this.$msgTip.error(this, {info: retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      memberSelect(info) {
        if (this.optType === "query") {
          this.formItem.memberId = info.memberId;
          this.formItem.custName = info.memberName;
        } else if (this.optType === "edit") {
          this.addForm.memberId = info.memberId;
          this.addForm.memberName = info.memberName;
          this.addForm.custName = info.memberName;
          this.addForm.custBankNo = info.memberBankNo;
        }
        this.showMemberWin = false;
      },
      formSearch() {
        this.currentSelectRow = [];
        this.formItem.creditDt = this.formItem.creditDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.custType="1";
        this.formItem.memberId = "";
        this.formItem.memberName = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.optType = "query";
        this.addOrEditWin = false;
        this.addForm.id = "";
        this.addForm.legalNo = "";
        this.addForm.memberId = "";
        this.addForm.custNo = "";
        this.$refs.addForm.resetFields();
      },
      //动态创建工具条
      createShowCol(columns) {
        this.checked = [];
        this.showCol = [];
        let _this = this;
        columns.forEach((value, index, showCol) => {
          if (value.hiddenCol != true) {
            if (value.type == "index") {
              value.key = "_index";
            }
            let tempItem = JSON.parse(JSON.stringify(value));
            if (tempItem.type != "radio" && tempItem.type != "selection" && value.type !== "index") {
              _this.showCol.push(tempItem);
              if(!value.hiddenCol) {
                _this.checked.push(value.key);
              }
            }
          }
          for(let checkedItem in _this.checkedItems) {
            if(value.key === checkedItem) {
              let isExist = _this.showCol.some(item => {
                return item.key === checkedItem
              })
              if(!isExist) {
                _this.showCol.push(JSON.parse(JSON.stringify(_this.checkedItems[checkedItem])));
              }
              if(_this.checked.join(",").indexOf(checkedItem) <= -1 && !value.hiddenCol) {
                _this.checked.push(checkedItem);
              }
            }
          }
        });
      },
      //控制单列显示隐藏
      controlColumnsHidden(columnName, isHidden) {
        this.fileParams.columns.forEach((value, index) => {
          if (value.key === columnName) {
            value.hiddenCol = isHidden;
            this.createShowCol(this.tempColumns);
          }
        });
        return this.tempColumns;
      },
      // 新增/修改额度批次
      handleAddForm(str) {
        this.type = str;
        this.optType = "edit";
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.$nextTick(() => {
              this.addForm.id = this.currentSelectRow.id;
              this.addForm.legalNo = this.currentSelectRow.legalNo;
              this.addForm.creditType = this.currentSelectRow.creditType;
              this.addForm.custType = this.currentSelectRow.custType;
              this.addForm.memberId = this.currentSelectRow.memberId;
              this.addForm.memberName = this.currentSelectRow.custName;
              this.addForm.custNo = this.currentSelectRow.custNo;
              this.addForm.custName = this.currentSelectRow.custName;
              this.addForm.custBankNo = this.currentSelectRow.custBankNo;
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/pc/credit/creditGrantBatch/func_addCreditGrantBatch" : "/pc/credit/creditGrantBatch/func_updateCreditGrantBatch";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //删除额度批次
      handleComfirm() {
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
        post({ ids: id }, "/pc/credit/creditGrantBatch/func_delCreditGrantBatch").then(res => {
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
      //批复明细
      handleCreditGrantInfo() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.creditGrantInfoParams.creditBatchId = this.currentSelectRow.id;
          this.creditGrantInfoParams.creditType = this.currentSelectRow.creditType;
          this.creditGrantInfoParams.custType = this.currentSelectRow.custType;
          this.creditGrantInfoParams.creditStatusList = this.creditStatusList;
          this.creditGrantInfoParams.creditProdNoList = this.creditProdNoList;
          this.creditGrantInfoParams.dictMap = this.dictMap;
          this.creditGrantInfoWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.creditGrantInfoWin = false;
          return false;
        }
      },
      creditGrantInfoWinClose() {
        this.creditGrantInfoParams.creditBatchId = "";
        this.creditGrantInfoParams.creditType = "";
        this.creditGrantInfoParams.custType = "";
        this.creditGrantInfoParams.creditStatusList = [];
        this.creditGrantInfoParams.dictMap = new Map();
        this.creditGrantInfoWin = false;
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      //获取系统参数（额度模块是否区分授信品种）
      getIfDifferCredProd() {
        post({}, "/pc/credit/creditGrantInfoReCheck/func_getPropertyIfDifferCredProd").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let differCredProd = res.data.retData.differCredProd;
              let isShowCreditProd = differCredProd === "1";
              if (!isShowCreditProd) {
                this.controlColumnsHidden('creditProdNo', true)
              } else {
                this.controlColumnsHidden('creditProdNo', false)
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      infoImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.$refs.datagrid.dataChange(1);
      },
      //查询授信品种集合
      queryCreditProductList() {
        post({}, "/pc/credit/creditGrantBatch/func_queryCreditProductList").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.creditProdNoList = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              if (this.creditProdNoList.length !== 0) {
                let map = new Map();
                for(let i=0; i<this.creditProdNoList.length; i++) {
                  map.set(this.creditProdNoList[i].creditProdNo, this.creditProdNoList[i].creditProdName);
                }
                this.dictMap.set("CreditProdNoList", map);
              }
            } else {
              this.creditProdNoList = [];
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
    },
    created() {
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
    },
    mounted() {
      this.getDictListByGroups("CreditCreditType,CreditCustType,CreditStatus").then(res => {
        this.creditTypeList = res.get("CreditCreditType");
        this.custTypeList = res.get("CreditCustType");
        this.creditStatusList = res.get("CreditStatus");
        this.dictMap = res.get("map");
        this.queryCreditProductList();
        this.getButtonAuth();
        this.getIfDifferCredProd();
      });
    }
  };
</script>
