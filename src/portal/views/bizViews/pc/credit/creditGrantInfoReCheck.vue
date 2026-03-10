<!--额度复核-->
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
                    <h-option v-for="item in creditStatusList" :value="item.key" :key="item.value"
                              v-if="item.key === '1' || item.key === '5'">
                      {{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
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
            :auto-load="false"
            :highlight-row=false
            url="/pc/credit/creditGrantInfoReCheck/func_pagingQueryCreditInfoList"
            :bindForm="formItem"
            :rowSelect="true"
            :page-size="pageSizeParamValue"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleCheck('submit')" v-if="authObj.submitCheckAuth">{{$t('m.i.common.submitCheckAuth')}}</h-button>
              <h-button type="primary" @click="handleCheck('cancel')" v-if="authObj.cancelCheckAuth">{{$t('m.i.common.cancelCheckAuth')}}</h-button>
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
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import {on, off, post, formatNumber, exportList} from "@/api/bizApi/commonUtil";


  export default {
    name: "creditGrantInfoReCheck",
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
        creditStatusList: "1,5",
      };
      let _this = this;
      return {
        pageSizeParamValue : "",
        ifShowMore: false,
        needTransform : false,
        //给按钮增加权限
        authObj: {
          submitCheckAuth: true,      //提交复核
          cancelCheckAuth: true      //删除复核
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
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.pc.busiBrch'),
            key: "brchName",
            hiddenCol: false,
            sortable: true,
            ellipsis: false
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
            title: this.$t("m.i.pc.usedCreditAmt"),
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
            title: this.$t("m.i.pc.freezedAmt"),
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
        creditProdNoList: [],
        formItem: formItem,
        addForm: {
          id: "",
          legalNo: "",
          creditBatchId: "",
          creditType: "",
          custType: "",
          doAmt: "",
          usedCreditAmt: "",
          freezedAmt: "",
          creditLimitAmt: "",
          activeDt: "",
          failureDt: "",
          isRecircle: ""
        },
        type: null,
        isRequired: true,
        addOrEditWin: false,
        submitFlag: false,
        currentSelectList: [],
        currentSelectRowInx: [],
        currentSelectRow: null,
        custTypeList: [],
        creditStatusList: [],
        dictMap: new Map(),
        //查看会员弹出框
        showMemberWin: false,
        //查看企业客户弹出框
        showCustCorpWin: false,
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        //区分查询客户号操作类型
        optType: "query",
        workDate: window.sessionStorage.getItem("workDate"),
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
      ShowMember: () => import(/* webpackChunkName: "shcpe/cpes/member/showMember" */`@/views/bizViews/shcpe/cpes/member/showMember`),
      ShowCustCorp: () => import(/* webpackChunkName: "bm/cust/corp/showCustCorp" */`@/views/bizViews/bm/cust/corp/showCustCorp`)
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
          }
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
        } else if (this.optType === "edit") {
          if (this.addForm.custType === "") {
            this.$msgTip.info(this, {info: "请先选择客户类型"});
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
      memberSelect(info) {
        if (this.optType === "query") {
          this.formItem.memberId = info.memberId;
          this.formItem.custName = info.memberName;
        } else if (this.optType === "edit") {
          this.addForm.memberId = info.memberId;
          this.addForm.memberName = info.memberName;
          this.addForm.custName = info.memberName;
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
        this.$refs.formItem.resetFields();
        this.formItem.memberId = "";
        this.formItem.memberName = "";
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
      //提交/撤销复核
      handleCheck(optType) {
        if (this.currentSelectList.length !== 0) {
          let list = this.currentSelectList;
          let content = optType === "submit" ? "确定复核？" : "确定撤销复核?";
          if (optType === "submit"){
            content = "确定复核？" ;
            for (let i = 0; i < list.length; i++) {
              if (list[i].activeDt <= this.workDate && list[i].failureDt >= this.workDate && this.needTransform){
                content = "确定复核？本次复核需要结转历史额度流水，时间较长，建议在业务低谷期再执行此操作" ;
              }
            }
          } else {
            content = "确定撤销复核?";
          }
          let url = optType === "submit" ? "/pc/credit/creditGrantInfoReCheck/func_reCheckGrantInfo" : "/pc/credit/creditGrantInfoReCheck/func_cancelReCheckGrantInfo";

          let ids = [];
          for (let i = 0; i < list.length; i++) {
            if (optType === "submit") {
              if (list[i].creditStatus === "1") {
                ids.push(list[i].id);
              } else {
                let info = this.getDictValueFromMap(this.dictMap, "CreditStatus", list[i].creditStatus);
                this.$msgTip.info(this, {info: "额度信息编号【" + list[i].creditInfoNo + "】的当前状态为【" + info + "】,只有处于【待复核】状态的才可发起此操作"});
                return;
              }
            } else if (optType === "cancel") {
              if (list[i].creditStatus === "5") {
                ids.push(list[i].id);
              } else {
                let info = this.getDictValueFromMap(this.dictMap, "CreditStatus", list[i].creditStatus);
                this.$msgTip.info(this, {info: "额度信息编号【" + list[i].creditInfoNo + "】的当前状态为【" + info + "】,只有处于【已复核】状态的才可发起此操作"});
                return;
              }
            }
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: content,
            onOk: () => {
              this.check(url, ids);
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      check(url, ids) {
        post({ids: ids}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectList = [];
              this.currentSelectRowInx = [];
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //查询授信品种集合
      queryCreditProductList() {
        post({}, "/pc/credit/creditGrantInfoReCheck/func_queryCreditProductList").then(res => {
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
        post({}, "/pc/credit/creditGrantInfoReCheck/func_getPropertyIfDifferCredProd").then(res => {
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
        if (!this.exportByProdNo){
          this.param = "creditGrantReCheckExport";
        }else {
          this.param = "creditGrantReCheckExportForImport";
        }
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
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/credit/creditGrantInfoReCheck/func_exportCreditInfoList";
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
      },
      getParams() {
        if (this.$route.path === "/pc/credit/creditGrantInfoReCheck") {
          let creditStatus = this.$route.query.creditStatus;
          if (creditStatus) {
            this.formItem.creditStatus = creditStatus;
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
      },
      getNeedTransfer() {
        let paramKey = "pc.credit.is_need_transfer";
        post({ paramKey :paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let param = res.data.retData;
              this.needTransform = param === "1";
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
    },
    created() {
      this.getDictListByGroups("CreditCustType,CreditStatus").then(res => {
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
      this.getParams();
      this.getNeedTransfer();
    }
  };
</script>

<style scoped>

</style>
