<!--额度流水查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.creditType')" prop="creditType">
                  <h-select v-model="formItem.creditType" placeholder="">
                    <!--<h-option v-for="item in creditTypeList" :value="item.key" :key="item.value">{{ item.value }}-->
                    <!--</h-option>-->
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
                <h-form-item :label="$t('m.i.common.reviewStatus')" prop="creditStatus">
                  <h-select v-model="formItem.creditStatus" placeholder="">
                    <h-option v-for="item in creditStatusList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <show-branch v-model="formItem.brchNos" :label="$t('m.i.pc.busiBrch')" prop="brchNos"
                             title="机构名称" :brchNo.sync="formItem.brchNos">
                </show-branch>
                <h-form-item :label="$t('m.i.pc.creditInfoNo')" prop="creditInfoNo">
                  <h-input v-model="formItem.creditInfoNo" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.activeDt')" prop="activeDt">
                  <h-date-picker v-model="formItem.activeDt" type="date" :editable=false
                                 :showFormat=true placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.failureDt')" prop="failureDt">
                  <h-date-picker v-model="formItem.failureDt" type="date" :editable=false
                                 :showFormat=true :options="selectFailureDt" placeholder=""></h-date-picker>
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
            :highlight-row=false
            url="/pc/credit/creditControlLog/func_pagingQueryCreditInfoList"
            :bindForm="formItem"
            :auto-load="false"
            :rowSelect="true"
            :page-size="pageSizeParamValue"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <!--<h-button type="primary" @click="handleCollect()" v-if="authObj.collcetAuth">选择汇总</h-button>-->
              <h-button type="primary" @click="queryLog()" v-if="authObj.queryLogAuth">{{$t('m.i.common.queryLog')}}</h-button>
              <h-button type="primary" @on-click="tempShowExcelTemplateWinOpen" >{{$t('m.i.common.listExport')}}</h-button>
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
    <!--选择汇总弹出框-->
    <h-msg-box v-model="showCollectWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true" :z-index=1010>
      <p slot="header">
        <span>流水信息汇总</span>
      </p>
      <div>
        <div class="text-wrap mb-10">
          <div class="text-body">
            <h-row :gutter="8">
              <h-col span="12">
                <h-row>
                  <h-col span="10" class="label">授信额度：</h-col>
                  <h-col span="14" class="val">{{ collectForm.creditLimitAmt }}</h-col>
                </h-row>
              </h-col>
              <h-col span="12">
                <h-row>
                  <h-col span="10" class="label">可用额度：</h-col>
                  <h-col span="14" class="val">{{ collectForm.doAmt }}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="12">
                <h-row>
                  <h-col span="10" class="label">已用额度：</h-col>
                  <h-col span="14" class="val">{{ collectForm.usedCreditAmt }}</h-col>
                </h-row>
              </h-col>
              <h-col span="12">
                <h-row>
                  <h-col span="10" class="label">冻结额度：</h-col>
                  <h-col span="14" class="val">{{ collectForm.freezedAmt }}</h-col>
                </h-row>
              </h-col>
            </h-row>
          </div>
        </div>
        <h-form :model="collectForm" :label-width="115" ref="collectForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.creditLimitAmt')" prop="creditLimitAmt">
            <h-input v-model="collectForm.creditLimitAmt" :maxlength="20" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.doAmt')" prop="doAmt">
            <h-input v-model="collectForm.doAmt" :maxlength="20" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.usedCreditAmt')" prop="usedCreditAmt">
            <h-input v-model="collectForm.usedCreditAmt" :maxlength="20" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.freezedAmt')" prop="freezedAmt">
            <h-input v-model="collectForm.freezedAmt" :maxlength="20" readonly></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!--查询额度流水历史弹出框-->
    <show-control-log :controlLogWin="controlLogWin" :controlLogForm="controlLogForm" :dictMap="dictMap"
                      @controlLogWinClose="controlLogWinClose"></show-control-log>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import {on, off, post, formatNumber, exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "creditControlLog",
    data() {
      let formItem = {
        creditType: "",
        custType: "1",
        custNo: "",
        custName: "",
        memberId: "",
        memberName: "",
        creditStatus: "",
        creditInfoNo: "",
        activeDt: "",
        failureDt: "",
        brchNo: "",
        brchName: "",
        brchNos: ""
      };
      let _this = this;
      return {
        pageSizeParamValue : "",
        ifShowMore: false,
        //给按钮增加权限
        authObj: {
          collcetAuth: true,      //选择汇总
          queryLogAuth: true          //查询历史
        },
        columns: [
          {
            type: "selection",
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
            title: this.$t("m.i.pc.creditInfoNo"),
            key: "creditInfoNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.reviewStatus'),
            key: "creditStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CreditStatus", params.row.creditStatus);
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
            title: this.$t('m.i.common.custName'),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.pc.busiBrch'),
            key: "brchName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.pc.creditType'),
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
            title: this.$t('m.i.pc.creditLimitAmt'),
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
            title: this.$t('m.i.pc.doAmt'),
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
            title: this.$t('m.i.pc.usedCreditAmt'),
            key: "usedCreditAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let usedCreditAmt = formatNumber(params.row.usedCreditAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: usedCreditAmt
                }
              }, usedCreditAmt);
            }
          },
          {
            title: this.$t('m.i.pc.freezedAmt'),
            key: "freezedAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let freezedAmt = formatNumber(params.row.freezedAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: freezedAmt
                }
              }, freezedAmt);
            }
          },
          {
            title: this.$t('m.i.pc.activeDt'),
            key: "activeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.activeDt == null ? "" : this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.pc.failureDt'),
            key: "failureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.failureDt == null ? "" : this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:  this.$t('m.i.pc.creditProd'),
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
        creditProdNoList: [],
        formItem: formItem,
        type: null,
        isRequired: true,
        addOrEditWin: false,
        submitFlag: false,
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: [],
        custTypeList: [],
        creditStatusList: [],
        dictMap: new Map(),
        //查看会员弹出框
        showMemberWin: false,
        //查看企业客户弹出框
        showCustCorpWin: false,
        //额度流水历史弹出框
        controlLogWin: false,
        controlLogForm: {},
        //选择汇总弹出框
        showCollectWin: false,
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        collectForm: {
          creditLimitAmt: "",
          doAmt: "",
          usedCreditAmt: "",
          freezedAmt: ""
        },
        //区分查询客户号操作类型
        optType: "query",
        selectFailureDt: {
          disabledDate(date) {
            let start = _this.$moment(formItem.activeDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0;
          }
        },
      };
    },
    components: {
      ShowControlLog:()=>import(/* webpackChunkName: "pc/credit/showControlLog" */`@/views/bizViews/pc/credit/showControlLog`),
      ShowMember:()=>import(/* webpackChunkName: "shcpe/cpes/member/showMember" */`@/views/bizViews/shcpe/cpes/member/showMember`),
      ShowCustCorp :()=>import(/* webpackChunkName: "bm/cust/corp/showCustCorp" */`@/views/bizViews/bm/cust/corp/showCustCorp`)
    },
    methods: {
      formatTwoNumber(num) {
        debugger
        if (num) {
          let newNum = num + "";
          if (newNum.indexOf(".") != -1) {
            return num;
          } else {
            return num + (".00");
          }
        } else {
          return "0.00";
        }

      },
      //1-同业客户，查询会员信息；2-企业客户，查询企业客户信息
      custTypeChange(optType) {
        this.optType = optType;
        if (optType === "query") {
          this.formItem.memberId = "";
          this.formItem.memberName = "";
          this.formItem.custNo = "";
          this.formItem.custName = "";
        }
      },
      clearCustName() {
        if (this.optType === "query") {
          this.formItem.memberId = "";
          this.formItem.memberName = "";
          this.formItem.custNo = "";
          this.formItem.custName = "";
        }
      },
      //1-同业客户，查询会员信息；2-企业客户，查询企业客户信息
      queryCustName() {
        if (this.optType === "query") {
          if (this.formItem.custType === "") {
            this.$msgTip.info(this, {info: "请先选择客户类型"});
            return false;
          }
          if (this.formItem.custType === "1") {
            this.showMemberWin = true;
          } else if (this.formItem.custType === "2") {
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
        }
        this.showCustCorpWin = false;
      },
      memberWinClose() {
        this.showMemberWin = false;
      },
      memberSelect(info) {
        if (this.optType === "query") {
          this.formItem.memberId = info.memberId;
          this.formItem.custName = info.memberName;
        }
        this.showMemberWin = false;
      },
      formSearch() {
        this.currentSelectRow = [];
        this.formItem.activeDt = this.formItem.activeDt.replace(/-/g, "");
        this.formItem.failureDt = this.formItem.failureDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.brchNos = "";
        this.formItem.brchName = "";
        this.formItem.memberId = "";
        this.formItem.brchName = "";
        this.$refs.formItem.resetFields();
        this.formItem.custType="1";
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //选择汇总
      handleCollect() {
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          let ids = [];
          for (let i = 0; i < list.length; i++) {
            ids.push(list[i].id);
          }
          ids = ids.join(",");
          let params = {ids: ids};
          let url = "/pc/credit/";
          post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.collectForm = res.data.retData;
                this.showCollectWin = true;
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        }
      },
      handleWinClose() {
        this.showCollectWin = false;
        this.collectForm = {
          creditLimitAmt: "",
          doAmt: "",
          usedCreditAmt: "",
          freezedAmt: ""
        };
      },
      //查询历史
      queryLog() {
        let list = this.currentSelectList;
        if (list != null && list.length === 1) {
          post({id: list[0].id}, "/pc/credit/creditControlLog/func_queryCreditGrantInfoById").then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.controlLogForm = data;
                this.controlLogForm.memberName = this.currentSelectList[0].custName;
                this.controlLogForm.custName = this.currentSelectList[0].custName;
                this.controlLogWin = true;
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return false;
        }
      },
      controlLogWinClose() {
        this.controlLogForm = {};
        this.controlLogWin = false;
      },
      //查询授信品种集合
      queryCreditProductList() {
        post({}, "/pc/credit/creditControlLog/func_queryCreditProductList").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.creditProdNoList = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              if (this.creditProdNoList.length !== 0) {
                let map = new Map();
                for (let i = 0; i < this.creditProdNoList.length; i++) {
                  map.set(this.creditProdNoList[i].creditProdNo, this.creditProdNoList[i].creditProdName);
                }
                this.dictMap.set("CreditProdNoList", map);
              }
            } else {
              this.creditProdNoList = [];
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //获取系统参数（额度模块是否区分授信品种）
      getIfDifferCredProd() {
        post({}, "/pc/credit/creditControlLog/func_getPropertyIfDifferCredProd").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let differCredProd = res.data.retData.differCredProd;
              let isShowCreditProd = differCredProd === "1";
              if (!isShowCreditProd) {
                this.$refs.datagrid.controlColumnsHidden("creditProdNo", true);
              } else {
                this.$refs.datagrid.controlColumnsHidden("creditProdNo", false);
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "creditGrantInfoExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/credit/creditControlLog/func_exportCreditInfoList";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          this.formItem.activeDt = this.formItem.activeDt.replace(/-/g, "");
          this.formItem.failureDt = this.formItem.failureDt.replace(/-/g, "");
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      }
    },
    created() {
      this.getDictListByGroups("CreditCustType,CreditStatus,CreditAdjustCode").then(res => {
        this.custTypeList = res.get("CreditCustType");
        this.creditStatusList = res.get("CreditStatus");
        this.dictMap = res.get("map");
        this.queryCreditProductList();
        this.formSearch();
      });
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
    },
    mounted() {
      this.getIfDifferCredProd();
    }
  };
</script>

<style scoped>

</style>
