<!-- 同步支付状态 -->
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
                           @on-click="queryProductName()" readonly></h-input>
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
                      url="/pe/pay/syncPayStatusMain/func_pagingQuerySynPayInfoList"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="syncStatus">{{$t("m.i.pe.syncStatus")}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 产品名称选择弹出框 -->
        <common-product-select :productSelectWin="productSelectWin" @productSelectChange="productSelectChange"
                               @productSelectWinClose="productSelectWinClose"></common-product-select>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "syncPayStatusMain",
    data() {
      return {
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
        brchNoWin:false,
        licenseFlag:false,
        authPath:this.$route.path,
        auditModue:'1',
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false,
            align: "center"
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
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "UpbsPayStatus", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
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
          }
        ],
        productSelectWin: false,
        currentSelectList: [],
        dictMap: new Map(),
        clearStatusList: [],
        //是否显示更多查询项
        ifShowMore: false
      };
    },
    components: {
      CommonProductSelect: () => import(/* webpackChunkName: "bm/prod/product/commonProductSelect" */ "@/views/bizViews/bm/prod/product/commonProductSelect")
    },
    mounted() {
      this.getDictListByGroups("UpbsPayClearStatus").then(res => {
        this.clearStatusList = res.get("UpbsPayClearStatus");
        this.dictMap = res.get("map");
      });
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

      this.getPayModuBusiParam();
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
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.prodNo = "";
        this.formItem.ownedBrchNos="",
        this.formItem.ownedBrchNames=""
      },
      //同步状态
      syncStatus() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.currentSelectList;
        let ids = "";
        for (let i = 0; i < list.length; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        //调用后台
        let url = "/pe/pay/syncPayStatusMain/func_synchronizePayInfoById";
        post({ idList: ids }, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },
      getPayModuBusiParam() {
        post({ paramKey: "pe.pay.audit_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === "2") {
                this.auditModue ='2';
              } else {
                this.auditModue ='1';
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }

    }
  };
</script>

<style scoped>

</style>
