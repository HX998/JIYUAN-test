<!--发票维护-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="showTransContractWin" key="1">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.brchName')" prop="createBrchNames">
                  <h-input v-model="formItem.createBrchNames" icon="android-search" @on-click="brchNoWin = true"
                           readonly clearable @on-clear="clearVal()"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.createBrchNos" :label="$t('m.i.common.brchName')" prop="createBrchNos"
                             title="机构名称" :isInitValueClearable=true :brchNo.sync="formItem.createBrchNos" :brchName.sync="formItem.createBrchNames">
                </show-branch>
                <h-form-item :label="$t('m.i.bm.ctrctNoLike')" prop="ctrctNoLike">
                  <h-input v-model="formItem.ctrctNoLike" :maxlength="60"></h-input>
                </h-form-item>
                  <h-form-item prop="sellerCustName" :label="$t('m.i.common.custName')">
                    <select-cust-corp v-model="formItem.sellerCustName" :custNo="formItem.sellerCustName" :value.sync="formItem.sellerCustNo"
                                      :custName.sync="formItem.sellerCustName"></select-cust-corp>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.custNo')" prop="sellerCustNo" v-show="false">
                    <h-input v-model="formItem.sellerCustNo" :maxlength=60 readonly></h-input>
                  </h-form-item>
                <h-form-item :label="$t('m.i.bm.buyerName')" prop="buyerCustNameLike">
                  <h-input v-model="formItem.buyerCustNameLike" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.ctrctSignDt')" prop="ctrctSignDtTmp">
                  <h-date-picker v-model="formItem.ctrctSignDtTmp" type="daterange" showFormat :editable=false @on-change="ctrctSignDtChange"
                                 placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.ctrctSignDueDt')" prop="ctrctSignDueDtTmp">
                  <h-date-picker v-model="formItem.ctrctSignDueDtTmp" type="daterange" showFormat :editable=false placement="bottom-end" @on-change="ctrctSignDueDtChange"
                                 placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.ctrctMoney')">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minCtrctAmt" @on-blur="minCtrctAmtVaild" integerNum="13" placeholder="" type="money" bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxCtrctAmt" @on-blur="maxCtrctAmtVaild" integerNum="13" placeholder="" type="money" bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custNo')" prop="sellerCustNo" v-show="false">
                  <h-input v-model="formItem.sellerCustNo" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.brchNo')" prop="createBrchNo" v-show="false">
                  <h-input v-model="formItem.createBrchNo" :maxlength="30"></h-input>
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
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns" highlightRow url="/bm/ctrct/transContractManager/func_pagingQueryTransContract" :bindForm="formItem"
                          :rowSelect="true" ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="invoiceEdit('add')">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @click="invoiceEdit('modify')">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="deleteDetailed">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="invoiceManager">{{$t('m.i.bm.invoiceManager')}}</h-button>
                  <h-button type="primary" @click="showFile">{{$t('m.i.common.fileManage')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>

        <div v-if="showContractInvoiceWin" key="2">
          <trans-ctrct-detail :ctrctObj="ctrctObj" ref="ctrctObj"></trans-ctrct-detail>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="invoiceColumns" highlightRow url="/bm/ctrct/transContractManager/func_pagingQueryInvoiceByCtrct" :bindForm="invoiceFormItem"
                          :rowSelect="true" :auto-load="false" ref="invoiceDatagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="pickInvoice">{{$t('m.i.bm.pickInvoice')}}</h-button>
                  <h-button type="primary" @click="deleteInvoice">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="returnMain">{{$t('m.i.common.goBack')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>

      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增合同信息</span>
        <span v-if="type=='modify'">修改合同信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">

          <h-form-item :label="$t('m.i.bm.ctrctNoLike')" prop="ctrctNo" :required="isRequired">
            <h-input v-if="type=='add'" v-model="addForm.ctrctNo" :maxlength="60"></h-input>
            <h-input v-else readonly v-model="addForm.ctrctNo"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.buyerName')" prop="buyerCustName" :required="isRequired">
            <h-input v-model="addForm.buyerCustName" :maxlength="60"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custNo')" prop="sellerCustNo" :required="isRequired">
            <select-cust-corp v-if="type=='add'" v-model="addForm.sellerCustNo" :custNo="addForm.sellerCustNo" :value.sync="addForm.sellerCustNo"
                              :custName.sync="addForm.sellerCustName"></select-cust-corp>
            <h-input v-else-if="type=='modify'" v-model="addForm.sellerCustNo" :placeholder="''" readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custName')" prop="sellerCustName" :required="isRequired">
            <h-input v-model="addForm.sellerCustName" :maxlength="60" readonly :placeholder="''"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.ctrctSignDt')" prop="ctrctSignDt" :required="isRequired">
            <h-date-picker type="date" v-model="addForm.ctrctSignDt" placeholder="" showFormat :options="signOptions" :editable=false></h-date-picker>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.ctrctSignDueDt')" prop="ctrctSignDueDt" :required="isRequired">
            <h-date-picker type="date" v-model="addForm.ctrctSignDueDt" placeholder="" showFormat :options="dueOptions" :editable=false></h-date-picker>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.ctrctAmtByUnit')" prop="ctrctAmt" :required="isRequired">
            <h-typefield type="money" v-model="addForm.ctrctAmt" :maxlength="20" placeholder="数字，小数位最多2位" @on-blur="formatCtrctAmt('blur')"
                         @on-focus="formatCtrctAmt('focus')" bigTips></h-typefield>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.ctrctContent')" prop="ctrctContent">
            <h-input v-model="addForm.ctrctContent" :maxlength="60"></h-input>
          </h-form-item>

          <common-select v-model="addForm.ctrctType" :label="$t('m.i.bm.ctrctTradeType')" prop="ctrctType" :dictList="tradeInfoTypeList" :required="isRequired"></common-select>

          <common-select v-model="addForm.ctrctTradeModel" :label="$t('m.i.bm.ctrctTradeModel')" prop="ctrctTradeModel" :dictList="tradeModelList" :required="isRequired"></common-select>

          <h-form-item :label="$t('m.i.bm.ctrctRemark')" prop="ctrctRemark">
            <h-input v-model="addForm.ctrctRemark" :maxlength="60"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <!--<h-button type="ghost" style="margin:0 8px"  @click="addFormReset()">{{$t('m.i.common.reset')}}</h-button>-->
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t('m.i.common.confirm')}}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t('m.i.common.close')}}</h-button>
      </div>
    </h-msg-box>

    <ctrct-pick-invoice :ctrctPickInvoiceWin="ctrctPickInvoiceWin" :ctrctPickInvoiceParams="ctrctPickInvoiceParams" @ctrctPickInvoiceWinClose="ctrctPickInvoiceWinClose"></ctrct-pick-invoice>

    <!-- 机构名称选择弹窗框 -->
    <!--<show-branch :showBranchWin="brchNoWin" title="机构名称" @brchNoChange="brchNoChange" ifcheck="isTrue"
                 :checkStrictly="true" @showBranchWinClose="brchNoWin=false"></show-branch>-->

    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>

  </div>
</template>

<script>
  import { post, on, off, formatNumber,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "transContractManager",
    components: {
      TransCtrctDetail:()=>import(/* webpackChunkName: "bm/ctrct/transCtrctDetail" */`@/views/bizViews/bm/ctrct/transCtrctDetail`),
      CtrctPickInvoice:()=>import(/* webpackChunkName: "bm/ctrct/ctrctPickInvoice" */`@/views/bizViews/bm/ctrct/ctrctPickInvoice`),
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
      //ShowBranch:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
    },
    data: function() {
      let _this = this;
      return {
        //brchNoWin: false,
        submitFlag: false,
        type: "",
        showFileWin:false,
        fileBatchParams:{},
        filePathUrl:"/bm/ctrct/transContractManager/",
        attTypeCodeList: [{key:'FT07',value:'其他'}],
        //区分最大和最小票据金额
        // billMoneyType : "min";
        dueDt: [],
        remitDt: [],
        dictMap: new Map(),
        fileDetailStatusList:[],
        tradeInfoTypeList:[],
        tradeModelList:[],
        formItem: {
          statusList: [],
          custNo: "",
          custName: "",
          createBrchNos: "",
          createBrchNames: "",
          invoiceNoLike: "",
          minCtrctSignDueDt: "",
          maxCtrctSignDueDt: "",
          minCtrctSignDt: "",
          maxCtrctSignDt: "",
          ctrctSignDtTmp: "",
          ctrctSignDueDtTmp: "",
          ctrctNoLike: "",
          buyerCustNameLike: "",
          minCtrctAmt: "",
          maxCtrctAmt: ""
        },
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
            title: this.$t("m.i.bm.ctrctNoLike"),
            key: "ctrctNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "sellerCustNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "sellerCustName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bm.buyerName"),
            key: "buyerCustName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bm.ctrctSignDt"),
            key: "ctrctSignDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.ctrctSignDt == null || params.row.ctrctSignDt === "") {
                return "";
              }
              let date = _this.$moment(params.row.ctrctSignDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.bm.ctrctSignDueDt"),
            key: "ctrctSignDueDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.ctrctSignDueDt == null || params.row.ctrctSignDueDt === "") {
                return "";
              }
              let date = _this.$moment(params.row.ctrctSignDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },

          {
            title: this.$t("m.i.bm.ctrctAmtByUnit"),
            key: "ctrctAmt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let ctrctAmt = formatNumber(params.row.ctrctAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: ctrctAmt
                }
              }, ctrctAmt);
            }
          },
          {
            title: this.$t("m.i.bm.ctrctTradeType"),
            key: 'ctrctType',
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TradeInfoType", params.row.ctrctType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.bm.ctrctTradeModel"),
            key: 'ctrctTradeModel',
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TradeModel", params.row.ctrctTradeModel);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.bm.ctrctContent"),
            key: "ctrctContent",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bm.ctrctRemark"),
            key: "ctrctRemark",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.createBrchName"),
            key: "createBrchName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.createDt"),
            key: "createDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime == "" || params.row.createTime == 0) {
                return "";
              }
              let createDt = params.row.createTime.toString().substring(0, 8);
              let date = _this.$moment(createDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        //是否显示更多查询项
        ifShowMore: false,
        showCustAcctNoWin: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        custInfoParams: {},
        addForm: {
          custNo: "",
          custName: "",
          buyerName: "",
          invoiceCheckNo: "",
          invoiceContent: "",
          invoiceRemark: "",
          ctrctNo: "",
          sellerCustNo: "",
          sellerCustName: "",
          ctrctSignDt: "",
          ctrctSignDueDt: "",
          ctrctAmt: null,
          ctrctContent: "",
          ctrctRemark: "",
          ctrctType:"",
          ctrctTradeModel:""
        },
        addOrEditWin: false,
        isRequired: true,
        dueOptions: {
          disabledDate(date) {
            if (_this.addForm.ctrctSignDt != null && _this.addForm.ctrctSignDt != "" && _this.addForm.ctrctSignDt != 0) {
              return date && (date.valueOf() <= _this.$moment(_this.addForm.ctrctSignDt, "YYYYMMDD"));
            }
          }
        },
        signOptions: {
          disabledDate(date) {
            if (_this.addForm.ctrctSignDueDt != null && _this.addForm.ctrctSignDueDt != "" && _this.addForm.ctrctSignDueDt != 0) {
              return date && (date.valueOf() >= _this.$moment(_this.addForm.ctrctSignDueDt, "YYYYMMDD"));
            }
          }
        },
        showContractInvoiceWin: false,
        showTransContractWin: true,
        ctrctId: "",
        ctrctObj: {},

        invoiceFormItem: {
          ctrctId: 0
        },
        invoiceColumns: [
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
            title: this.$t("m.i.bm.invoiceNo"),
            key: "invoiceNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bm.invoiceAmt"),
            key: "invoiceAmt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let invoiceAmt = formatNumber(params.row.invoiceAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: invoiceAmt
                }
              }, invoiceAmt);
            }
          },
          {
            title: this.$t("m.i.bm.invoiceDt"),
            key: "invoiceDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.invoiceDt == null || params.row.invoiceDt === "") {
                return "";
              }
              let date = _this.$moment(params.row.invoiceDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.custTaxNo'),
            key: "sellerTaxNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.buyerName'),
            key: "buyerName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.buyerTaxNo'),
            key: "buyerTaxNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceType'),
            key: "invoiceType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.invoiceType == "1") {
                return h("span", "普通发票");
              } else if (params.row.invoiceType == "2") {
                return h("span", "增值税发票");
              } else {
                return params.row.invoiceType;
              }
            }
          },
          {
            title: this.$t('m.i.bm.invoiceRatioPct'),
            key: "invoiceRatioPct",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceContent'),
            key: "invoiceContent",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceRemark'),
            key: "invoiceRemark",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceCheckNo'),
            key: "invoiceCheckCode",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: "录入日期",
            key: "",
            hiddenCol: false,
            render: function(h, params) {
              if (params.row.createTime != null && params.row.createTime != "") {
                let dt= params.row.createTime.toString().substring(0, 8);
                return h('span',dt);
              }
            }
          },
          {
            title: "创建机构",
            key: "createBrchName",
            hiddenCol: false
          }
        ],
        ctrctPickInvoiceWin: false,
        ctrctPickInvoiceParams: {
          ctrctId: "",
          buyerCustName: "",
          custNo:"",
          selectType:"",
          dictMap: new Map()
        }
      };
    },
    computed: {
    },
    watch: {
    },
    mounted() {
      this.getDictListByGroups("AttTypeCode,FileDetailStatus,PreRelationFlag,TradeInfoType,TradeModel").then(res => {
        this.fileDetailStatusList = res.get("FileDetailStatus");
        this.tradeInfoTypeList = res.get("TradeInfoType");
        this.tradeModelList = res.get("TradeModel")
        this.dictMap = res.get("map");
      });
    },
    methods: {
    /*  brchNoChange(info) {
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
        this.formItem.createBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.createBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },*/
      clearVal(){
        this.formItem.createBrchNames=''
        this.formItem.createBrchNos='';
      },
      minCtrctAmtVaild() {
        this.formItem.minCtrctAmt = this.formItem.minCtrctAmt.trim();
        if (this.formItem.minCtrctAmt.length != 0 && Number(this.formItem.minCtrctAmt)) {
          let min = Number(this.formItem.minCtrctAmt);
          if (this.formItem.maxCtrctAmt.length != 0 && Number(this.formItem.maxCtrctAmt)) {
            let max = Number(this.formItem.maxCtrctAmt);
            if (min > max) {
              this.$msgTip.info(this, { info: "最大值不能小于最小值" });
              this.formItem.minCtrctAmt = "";
            }
          }
        } else {
          this.formItem.minCtrctAmt = "";
        }
      },
      maxCtrctAmtVaild() {
        if (this.formItem.maxCtrctAmt.length != 0 && Number(this.formItem.maxCtrctAmt)) {
          let max = Number(this.formItem.maxCtrctAmt);
          if (this.formItem.minCtrctAmt.length != 0 && Number(this.formItem.minCtrctAmt)) {
            let min = Number(this.formItem.minCtrctAmt);
            if (min > max) {
              this.$msgTip.info(this, { info: "最大值不能小于最小值" });
              this.formItem.maxCtrctAmt = "";
            }
          }
        } else {
          this.formItem.maxCtrctAmt = "";
        }
      },
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDt = [];
        this.remitDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.$nextTick(() => {
          this.formItem.ctrctSignDtTmp = "";
          this.formItem.ctrctSignDueDtTmp = "";
          this.formItem.sellerCustName = "";
          this.formItem.sellerCustNo = "";
          this.formItem.buyerCustNameLike = "";
          this.formItem.ctrctNoLike = "";
          this.formItem.minCtrctAmt = "";
          this.formItem.maxCtrctAmt = "";
        })
        this.$refs.formItem.resetFields();
        this.clearVal();
      },
      ctrctSignDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minCtrctSignDt = arr[0].replace(/-/g, "");
          this.formItem.maxCtrctSignDt = arr[1].replace(/-/g, "");
          this.formItem.ctrctSignDtTmp = [arr[0], arr[1]];
        }else{
          this.formItem.minCtrctSignDt = "";
          this.formItem.maxCtrctSignDt = "";
          this.formItem.ctrctSignDtTmp = [];
        }

      },
      ctrctSignDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minCtrctSignDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxCtrctSignDueDt = arr[1].replace(/-/g, "");
          this.formItem.ctrctSignDueDtTmp = [arr[0], arr[1]];
        }else{
          this.formItem.minCtrctSignDueDt = "";
          this.formItem.maxCtrctSignDueDt = "";
          this.formItem.ctrctSignDueDtTmp = [];
        }

      },
      //新增/修改合同
      invoiceEdit(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.$refs.datagrid.selects.length === 1) {
            this.$nextTick(() => {
              let selectData = this.$refs.datagrid.selects[0];
              this.addForm.id = selectData.id;
              this.addForm.custNo = selectData.custNo;
              this.addForm.custName = selectData.custName;
              this.addForm.buyerName = selectData.buyerName;
              this.addForm.invoiceCheckNo = selectData.invoiceCheckNo;
              this.addForm.invoiceContent = selectData.invoiceContent;
              this.addForm.invoiceRemark = selectData.invoiceRemark;
              this.addForm.ctrctNo = selectData.ctrctNo;
              this.addForm.sellerCustNo = selectData.sellerCustNo;
              this.addForm.sellerCustName = selectData.sellerCustName;
              this.addForm.ctrctSignDt = this.$moment(selectData.ctrctSignDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.addForm.ctrctSignDueDt = this.$moment(selectData.ctrctSignDueDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.addForm.ctrctAmt = formatNumber(selectData.ctrctAmt, 2, ',');
              this.addForm.ctrctContent = selectData.ctrctContent;
              this.addForm.ctrctRemark = selectData.ctrctRemark;
              this.addForm.ctrctType = selectData.ctrctType;
              this.addForm.ctrctTradeModel = selectData.ctrctTradeModel;
              this.addForm.buyerCustName = selectData.buyerCustName;
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addForm.id = "";
            this.$refs.addForm.resetFields();
          });
        }
        this.addOrEditWin = true;
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.addForm.ctrctAmt = this.addForm.ctrctAmt.toString().replace(/,/g, "");
            this.addForm.ctrctSignDt = this.addForm.ctrctSignDt.replace(/-/g, "");
            this.addForm.ctrctSignDueDt = this.addForm.ctrctSignDueDt.replace(/-/g, "");
            this.submitFlag = true;
            let url = this.type === "add" ? "/bm/ctrct/transContractManager/func_addTransContract" : "/bm/ctrct/transContractManager/func_updateTransContract";
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
      // 删除
      deleteDetailed() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDeleteDetailed();
          }
        });
      },
      handleDeleteDetailed() {
        let ids = this.$refs.datagrid.selectIds.join(",");
        post({ ids: ids }, "/bm/ctrct/transContractManager/func_delTransContract").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.handleSearch();
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formatCtrctAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.ctrctAmt)) && isFinite(this.addForm.ctrctAmt)) {
            this.addForm.ctrctAmt = this.addForm.ctrctAmt == null ? "0.00" : formatNumber(this.addForm.ctrctAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.ctrctAmt = this.addForm.ctrctAmt.toString().replace(/,/g, "");
        }
      },
      invoiceManager() {
        if (this.$refs.datagrid.selects.length === 1) {
          this.showContractInvoiceWin = true;
          this.showTransContractWin = false;
          this.ctrctObj = this.$refs.datagrid.selects[0];
          this.ctrctObj.ctrctAmt = formatNumber(this.ctrctObj.ctrctAmt, 2, ',');
          this.ctrctObj.ctrctSignDt = this.$moment(this.ctrctObj.ctrctSignDt, "YYYYMMDD").format("YYYY-MM-DD");
          this.ctrctObj.ctrctSignDueDt = this.$moment(this.ctrctObj.ctrctSignDueDt, "YYYYMMDD").format("YYYY-MM-DD");
          this.invoiceFormItem.ctrctId = this.ctrctObj.id;
          this.$nextTick(() => {
            this.$refs.invoiceDatagrid.dataChange(1);
            if (this.$refs.invoiceDatagrid != null) {
              this.$refs.invoiceDatagrid.selfAdaption();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.showContractInvoiceWin = false;
          return;
        }
      },
      returnMain() {
        this.showContractInvoiceWin = false;
        this.showTransContractWin = true;
      },
      pickInvoice() {
        this.ctrctPickInvoiceWin = true;
        this.ctrctPickInvoiceParams.ctrctId = this.ctrctObj.id;
        this.ctrctPickInvoiceParams.custNo = this.ctrctObj.sellerCustNo;
        this.ctrctPickInvoiceParams.buyerCustName = this.ctrctObj.buyerCustName;
        this.ctrctPickInvoiceParams.selectType = "";
      },
      ctrctPickInvoiceWinClose() {
        this.ctrctPickInvoiceWin = false;
        this.$refs.invoiceDatagrid.dataChange(1)
      },
      deleteInvoice() {
        if (this.$refs.invoiceDatagrid.selects.length > 0) {
          let ids = this.$refs.invoiceDatagrid.selectIds.join(",");
          post({ ids: ids }, "/bm/ctrct/transContractManager/func_delContractInvoice").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
                this.$refs.invoiceDatagrid.dataChange(this.$refs.invoiceDatagrid.pageInfo.pageNo);
                this.currentSelectRow = [];
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }

      },

      showFile(){
        if (this.$refs.datagrid.selects.length === 1) {
          let selectData=this.$refs.datagrid.selects[0];
          this.fileBatchParams.operType = "upload";
          this.fileBatchParams.busiId = selectData.id;
          this.fileBatchParams.attachBusiType = "contractFile";
          this.fileBatchParams.attTypeCodeList = this.attTypeCodeList;
          this.fileBatchParams.fileDetailStatusList = this.fileDetailStatusList;
          this.showFileWin = true;
        }else{
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },

      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      }
    }
  };

</script>

<style scoped>

</style>
