<!-- 历史支付信息查询 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">

              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch
                  v-model="formItem.ownedBrchNames":label="$t('m.i.common.ownedBrchNo')"
                  prop="ownedBrchNames"
                  v-if="this.licenseFlag":showCheckBox="true":brchNo.sync="formItem.ownedBrchNos":brchName.sync="formItem.ownedBrchNames"
                  :params="{authPath:this.$route.path}"
                  url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                  queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
                  <h-input v-model="formItem.pyeeName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="payAmt" :label="$t('m.i.pe.payAmt')">
                  <h-typefield v-model="formItem.payAmt" type="money" bigTips placeholder=""></h-typefield>
                </h-form-item>
                <h-form-item prop="secondCheckDt" :label="$t('m.i.pe.secondCheckDt')" v-if="this.auditModue ==='1'" class="h-form-long-label">
                  <h-date-picker type="date" v-model="formItem.secondCheckDt" placeholder=""
                                 @on-change="handleSecondCheckDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="prodName" :label="$t('m.i.common.busiType')">
                  <h-input v-model="formItem.prodName" placeholder="" icon="android-search"
                           @on-click="queryProductName()" readonly clearable @on-clear="clearVal()"></h-input>
                </h-form-item>
                <h-form-item prop="clearStatus" :label="$t('m.i.pe.clearStatus')">
                  <h-select v-model="formItem.clearStatus" placeholder="">
                    <h-option v-for="item in clearStatusList" :value="item.key" :key="item.key">{{item.value }}
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
                      highlight-row
                      url="/pe/pay/syncPayStatusMain/func_pagingQueryPayInfoList"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :auto-load="false"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="vochPrint" v-if="this.btnAuth.vochPrintButtun === undefined ? true : this.btnAuth.vochPrintButtun.isShow">{{$t("m.i.pe.vochPrint")}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 产品名称选择弹出框 -->

      </h-col>
    </h-row>
    <common-product-select :productSelectWin="productSelectWin" @productSelectChange="productSelectChange"
                           @productSelectWinClose="productSelectWinClose"></common-product-select>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "payInfoHistorySearch",
    data() {
      return {
        licenseFlag:false,
        authPath: this.$route.path ,
        auditModue:"1",
        btnAuth:"",
        childrenBtnAuth:"",
        formItem: {
          pyeeName: "",
          payAmt: "",
          secondCheckDt: "",
          prodNo: "",
          prodName: "",
          clearStatus: "",
          ownedBrchNos:"",
          ownedBrchNames:"",
          authPath:this.$route.path,
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
           title: this.$t('m.i.pe.batchIdAndYNo'),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "prodName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.payAmt'),
            key: "payAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.payAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t('m.i.pe.batchStatus'),
            key: "status",
            hiddenCol: false
          },
          {
           title: this.$t('m.i.pe.clearStatus'),
            key: "clearStatus",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "UpbsPayClearStatus", params.row.clearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
           title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: "pyeeBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.oriUppFlowNo'),
            key: "oriUppFlowNo",
            hiddenCol: false
          },
          {
           title: this.$t('m.i.common.operTellerName'),
            key: "operTellerName",
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t('m.i.pe.firstCheckName'),
            key: "firstCheckName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.firstCheckDt'),
            key: "firstCheckDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.firstCheckDt == null || params.row.firstCheckDt === "") {
                return "";
              }
              let date = this.$moment(params.row.firstCheckDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.pe.secondCheckName'),
            key: "secondCheckName",
            hiddenCol: false
          },
          {
            title:this.$t('m.i.pe.secondCheckDt'),
            key: "secondCheckDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.secondCheckDt == null || params.row.secondCheckDt === "") {
                return "";
              }
              let date = this.$moment(params.row.secondCheckDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t('m.i.pe.payReqDt'),
            key: "payReqDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.payReqDt == null || params.row.payReqDt === "") {
                return "";
              }
              let date = this.$moment(params.row.payReqDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.failReason'),
            key: "failReason",
            hiddenCol: false
          },
          {
            title:this.$t('m.i.common.postscript'),
            key: "payRemark",
            hiddenCol: false
          }
        ],
        productSelectWin: false,
        currentSelectRow: [],
        dictMap: new Map(),
        clearStatusList: [],
        //是否显示更多查询项
        ifShowMore: false
      };
    },
    components: {
      CommonProductSelect: () => import(/* webpackChunkName: "bm/prod/product/commonProductSelect" */`@/views/bizViews/bm/prod/product/commonProductSelect`)
    },
    mounted() {
      this.getDictListByGroups("UpbsPayStatus,UpbsPayClearStatus,CreditCustType").then(res => {
        this.clearStatusList = res.get("UpbsPayClearStatus");
        this.dictMap = res.get("map");
      });
      this.getPayModuBusiParam();
      //集中操作授权
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
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
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }

      });
    },
    methods: {
      //产品名称选择弹出框
      queryProductName() {
        this.productSelectWin = true;
      },
      //产品名称选择确认
      productSelectChange(info) {
        this.formItem.prodNo = info[0].id;
        this.formItem.prodName = info[0].title;
        this.productSelectWin = false;
      },
      //产品名称选择关闭窗口
      productSelectWinClose() {
        this.productSelectWin = false;
      },
      handleSecondCheckDtChange(value) {
        this.formItem.secondCheckDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.prodNo = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //凭证打印
      vochPrint() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.assemblePayInfoParams();
      },
      assemblePayInfoParams() {
        let vocherData = this.deepClone([this.currentSelectRow]);
        for (let i = 0; i < vocherData.length; i++) {
          if (!!vocherData[i].firstCheckDt) {
            vocherData[i].firstCheckDt = this.$moment(vocherData[i].firstCheckDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (!!vocherData[i].secondCheckDt) {
            vocherData[i].secondCheckDt = this.$moment(vocherData[i].secondCheckDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (!!vocherData[i].payReqDt) {
            vocherData[i].payReqDt = this.$moment(vocherData[i].payReqDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          vocherData[i].payAmt = formatNumber(vocherData[i].payAmt, 2, ",");
          let custType = this.getDictValueFromMap(this.dictMap, "CreditCustType", vocherData[i].custType);
          vocherData[i].custType = custType;
          let status = this.getDictValueFromMap(this.dictMap, "UpbsPayStatus", vocherData[i].status);
          vocherData[i].status = status;
          let clearStatus = this.getDictValueFromMap(this.dictMap, "UpbsPayClearStatus", vocherData[i].clearStatus);
          vocherData[i].clearStatus = clearStatus;
          vocherData[i].flowNo = vocherData[i].foreFlowNo;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);
        }
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE031902", vocherData: vocherData },
          callback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.currentSelectRow = [];
          },
          errorCallback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.currentSelectRow = [];
          }
        });
      },
      clearVal() {
        this.formItem.prodNo = "";
        this.formItem.prodName = "";
      },
      getPayModuBusiParam() {
        post({ paramKey: "pe.pay.audit_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === "2") {
                this.auditModue = '2';
                this.$refs.datagrid.controlColumnsHidden("firstCheckName", true);
                this.$refs.datagrid.controlColumnsHidden("firstCheckDt", true);
                this.$refs.datagrid.controlColumnsHidden("secondCheckName", true);
                this.$refs.datagrid.controlColumnsHidden("secondCheckDt", true);
              } else {
                this.auditModue = '1';
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

    }
  };
</script>

<style scoped>

</style>
