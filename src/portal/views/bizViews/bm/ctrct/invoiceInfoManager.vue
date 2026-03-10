<!--发票维护-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.createBrchNos" :label="$t('m.i.common.brchName')" prop="createBrchNos"
                             title="机构名称" :brchNo.sync="formItem.createBrchNos">
                </show-branch>
                <h-form-item :label="$t('m.i.bm.invoiceNo')" prop="invoiceNo">
                  <h-input v-model="formItem.invoiceNo" :maxlength="20"></h-input>
                </h-form-item>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <select-cust-corp v-model="formItem.custName" :custNo="formItem.custName" :value.sync="formItem.custNo"
                                    :custName.sync="formItem.custName"></select-cust-corp>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" v-show="false">
                  <h-input v-model="formItem.custNo" :maxlength=60 readonly></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns" highlightRow url="/bm/ctrct/invoiceInfoManager/func_pagingQueryInvoiceInfo" :bindForm="formItem"
                          :row-select="true" :has-select="false" ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="invoiceEdit('add')">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @click="invoiceEdit('modify')">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="deleteDetailed">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="importInvoice">{{$t('m.i.common.batchImport')}}</h-button>
                  <h-button type="primary" @click="exportInvoice">{{$t('m.i.common.batchExport')}}</h-button>
                  <h-button type="primary" @click="downLoadTemp">{{$t('m.i.common.templateDownload')}}</h-button>
                  <h-button type="primary" @click="showInvoiceHis">{{$t('m.i.bm.showInvoiceHis')}}</h-button>
                  <h-button type="primary" @click="showFile">{{$t('m.i.common.fileManage')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>

    <!--发票额度历史-->
    <h-msg-box v-model="invoiceCreditHis" width="1000" :mask-closable="false" @on-close="invoiceCreditHisClose" top="10"
               class="h-form-table-layer" :maximize="true" >
      <p slot="header">
        <span>发票额度历史</span>
      </p>
      <div class="h-form-search-box">
          <h-form :label-width="90" class="h-form-search" cols="4">
            <div class="h-search-form-row">
              <h-form-item :label="$t('m.i.bm.invoiceAmt')">
                <h-input v-model="invoiceAmt" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.bm.invoiceUsedAmtByUnit')" class="h-form-long-label">
                <h-input v-model="invoiceUsedAmt" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.bm.invoiceUsableAmtByUnit')" class="h-form-long-label">
                <h-input v-model="invoiceUsableAmt" placeholder="" readonly></h-input>
              </h-form-item>
            </div>
          </h-form>
      </div>
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="invoiceCreditHisColumns"
            :url="this.invoiceCreditHisUrl"
            highlightRow
            :auto-load="false"
            :rowSelect="true"
            :bindForm="invoiceCreditHisItem"
            ref="invoiceCreditHisDatagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
      <div slot="footer">
        <h-button type="ghost" @click="invoiceCreditHisClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增发票信息</span>
        <span v-if="type=='modify'">修改发票信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" :required="isRequired">
            <select-cust-corp v-if="type=='add'" v-model="addForm.custNo" :custNo="addForm.custNo" :value.sync="addForm.custNo" :custName.sync="addForm.custName"></select-cust-corp>
            <h-input v-else-if="type=='modify'" v-model="addForm.custNo" :placeholder="''" readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="isRequired">
            <h-input v-model="addForm.custName" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.buyerName')" prop="buyerName" :required="isRequired">
            <h-input v-model="addForm.buyerName" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.buyerTaxNo')" prop="buyerTaxNo">
            <h-input v-model="addForm.buyerTaxNo" :maxlength=25 ></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.invoiceType')" prop="invoiceType" :required="isRequired">
            <h-select v-model="addForm.invoiceType">
              <h-option v-for="item in invoiceTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <!--<h-form-item :label="$t('m.i.bm.invoiceNo')" prop="invoiceNo" :required="isRequired" :validRules="invoiceNoRule">
            <h-input v-model="addForm.invoiceNo"  :maxlength="20"></h-input>
          </h-form-item>-->
          <h-form-item :label="$t('m.i.bm.invoiceCpesCode')" prop="invoiceCpesCode" :validRules="invoiceCpesCodeRule">
            <h-input v-model="addForm.invoiceCpesCode"  :maxlength="12" @on-blur="changeNo" :readonly="type=='modify'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.invoiceCpesNo')" prop="invoiceCpesNo" :required="isRequired" :validRules="invoiceCpesNoRule">
            <h-input v-model="addForm.invoiceCpesNo"  :maxlength="20" @on-blur="changeNo" :readonly="type=='modify'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.invoiceNo')" prop="invoiceNo" :required="isRequired" :validRules="invoiceNoRule">
            <h-input v-model="addForm.invoiceNo"  :maxlength="20" readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.invoiceDt')" prop="invoiceDt" :required="isRequired">
            <h-date-picker type="date" v-model="addForm.invoiceDt" placeholder="" showFormat :editable=false></h-date-picker>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.invoiceAmt')" prop="invoiceAmt" :required="isRequired">
            <h-typefield type="money" v-model="addForm.invoiceAmt" :maxlength="20" placeholder="数字，小数位最多2位" @on-blur="formatInvoiceAmt('blur')"
                         @on-focus="formatInvoiceAmt('focus')" bigTips></h-typefield>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.invoiceRatioPct')" prop="invoiceRatioPct" :validRules="invoiceRatioRules">
            <h-typefield v-model="addForm.invoiceRatioPct" :integerNum="3" :suffixNum="4"></h-typefield>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.invoiceTaxMoney')" prop="invoiceTaxInterest">
            <h-typefield type="money" v-model="addForm.invoiceTaxInterest" :maxlength="20" placeholder="数字，小数位最多2位" @on-blur="formatInvoiceTaxInterest('blur')"
                         @on-focus="formatInvoiceTaxInterest('focus')" bigTips></h-typefield>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.custTaxNo')" prop="sellerTaxNo">
            <h-input v-model="addForm.sellerTaxNo" :maxlength="25"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.invoiceCheckNo')" prop="invoiceCheckCode">
            <h-input v-model="addForm.invoiceCheckCode" :maxlength="25"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.invoiceContent')" prop="invoiceContent">
            <h-input v-model="addForm.invoiceContent" :maxlength="60"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.invoiceRemark')" prop="invoiceRemark">
            <h-input v-model="addForm.invoiceRemark" :maxlength="60"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t('m.i.common.confirm')}}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t('m.i.common.close')}}</h-button>
      </div>
    </h-msg-box>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId"></bill-info-main>
    <!-- 查询客户信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustElecSignWin" @custElecSignWinClose="custElecSignWinClose" @custElecSignSubmit="custElecSignSubmit"></show-cust-elec-sign>
    <!--文件批量导入-->
    <common-file-upload-no-show :import-win="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose" :showExcelTemplateWin="tempShowExcelTemplateWin"
                           :param="this.param" :rows="this.rows"></common-excel-download>

    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "invoiceInfoManager",
    components: {
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
    },
    data() {
      return {
        importWin: false,
        tempShowExcelTemplateWin:false,
        showFileWin:false,
        param:{},
        fileBatchParams:{},
        filePathUrl:"/bm/ctrct/invoiceInfoManager/",
        attTypeCodeList: [{key:'FT07',value:'其他'}],
        rows:[],
        invoiceRatioRules:[{test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/, trigger:'blur', message: '发票税率为0~100之间的数，小数位不超过4位'}],
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/bm/ctrct/invoiceInfoManager/func_importExcelData",  //excel数据导入接口
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
        },
        invoiceNoRule: [{ test:  /^[0-9]{20}$/, trigger: "blur" ,message:'发票编码由12位发票代码加上8位发票号码或20位发票号码组成组成,均为数字'}],
        invoiceCpesNoRule: [{ test:  /^([0-9]{8}|[0-9]{20})$/, trigger: "blur" ,message:'发票号码为8位或20位数字'}],
        invoiceCpesCodeRule: [{ test:  /^[0-9]{12}$/, trigger: "blur" ,message:'发票代码为12位数字'}],
        submitFlag: false,
        formItem: {
          custNo: "",
          custName: "",
          createBrchNos: "",
          createBrchNames: "",
          invoiceNo: "",
        },
        invoiceCreditHisItem:{
          id:"",
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
            title: this.$t('m.i.bm.invoiceNo'),
            key: "invoiceNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceCpesCode'),
            key: "invoiceCpesCode",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceCpesNo'),
            key: "invoiceCpesNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custNo'),
            key: "custNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title:this.$t('m.i.common.brchName'),
            key:"createBrchName",
            hiddenCol:false
          },
          {
            title: this.$t('m.i.bm.custTaxNo'),
            key: "sellerTaxNo",
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
              let list = this.getDictValueFromMap(this.dictMap, "InvType", params.row.invoiceType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
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
                title: this.$t('m.i.bm.invoiceTaxMoney'),
                key: "invoiceTaxMoney",
                ellipsis: false,
                hiddenCol: false,
                sortable: true,
                render: (h, params) => {
                    let invoiceTaxInterestAmt = formatNumber(params.row.invoiceTaxInterest, 2, ',');
                    return h("span", {
                        domProps: {
                            title: invoiceTaxInterestAmt
                        }
                    }, invoiceTaxInterestAmt);
                }
            },
          {
            title: this.$t('m.i.bm.invoiceAmt'),
            key: "invoiceAmt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let invoiceAmt = formatNumber(params.row.invoiceAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: invoiceAmt
                }
              }, invoiceAmt);
            }
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
            title: this.$t('m.i.bm.invoiceDt'),
            key: "invoiceDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.invoiceDt == null || params.row.invoiceDt === "") {
                return "";
              }
              let date = this.$moment(params.row.invoiceDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
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
            sortable: true,
          },
        ],
        invoiceCreditHisColumns:[
          {
            type: "index",
            key: "numOrder",
            title:this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo == null || params.row.billNo == "") {
                billNo = "查看票面";
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.bm.invoiceUsedAmtByUnit"),
            key: "invoiceUsedAmt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let invoiceUsedAmt = formatNumber(params.row.invoiceUsedAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: invoiceUsedAmt
                }
              }, invoiceUsedAmt);
            }
          },
        ],
        billTypeList: [],
        transNoList: [],
        transTypeList: [{ key: "1", value: "申请类" }, { key: "2", value: "签收类" }],
        transResultList: [],
        //是否显示更多查询项
        ifShowMore: false,
        showCustElecSignWin: false,
        showCustAcctNoWin: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        custInfoParams: {},
        invoiceTypeList: [],
        addForm: {
          id: "",
          custNo: "",
          custName: "",
          buyerName: "",
          buyerTaxNo: "",
          invoiceType: "",
          invoiceNo: "",
          invoiceDt: "",
          invoiceAmt: "",
          invoiceRatioPct: "",
          invoiceTaxInterest: "",
          custTaxNo: "",
          invoiceCheckCode: "",
          invoiceContent: "",
          invoiceRemark: "",
          sellerTaxNo: "",
          invoiceCpesCode:"",
          invoiceCpesNo:"",
        },
        addOrEditWin: false,
        type: "",
        isRequired: true,
        invoiceCreditHis:false,
        invoiceCreditHisUrl:"",
        invoiceAmt:"",
        invoiceUsedAmt:"",
        invoiceUsableAmt:"",
        dictMap: new Map(),
        fileDetailStatusList:[],
      }
    },
    computed: {
    },
    watch: {
    },
    mounted() {
      this.getDictListByGroups("AttTypeCode,FileDetailStatus,PreRelationFlag,InvType").then(res => {
        this.fileDetailStatusList = res.get("FileDetailStatus");
        this.invoiceTypeList = res.get("InvType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal(){
        this.formItem.createBrchNames=''
        this.formItem.createBrchNos='';
      },
      //关闭导出窗口
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      invoiceCreditHisClose() {
        this.invoiceAmt = "";
        this.invoiceUsedAmt = "";
        this.invoiceUsableAmt = "";
        this.invoiceCreditHis = false;
      },
      //关闭批量导入窗口
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },
      //批量导入实现
      importInvoice() {
        this.importWin = true
      },
      //批量导出实现
      exportInvoice() {
        this.param = 'invoiceInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //下载发票模板
      downLoadTemp() {
        let url = window.LOCAL_CONFIG.API_HOME + "/bm/ctrct/invoiceInfoManager/func_downloadTemplate";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //发票额度历史
      showInvoiceHis() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        } else if (this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.invoiceCreditHisItem.id = this.$refs.datagrid.selects[0].id;
        this.invoiceAmt = formatNumber(this.$refs.datagrid.selects[0].invoiceAmt, 2, ",");
        this.invoiceUsedAmt = formatNumber(this.$refs.datagrid.selects[0].invoiceUsedAmt, 2, ",");
        this.invoiceUsableAmt = formatNumber(this.$refs.datagrid.selects[0].invoiceUsableAmt, 2, ",");
        this.invoiceCreditHisUrl = "/bm/ctrct/invoiceInfoManager/func_pagingQueryInvoiceCreditHisInfo";
        this.invoiceCreditHis = true;
        this.$nextTick(() => {
          this.$refs.invoiceCreditHisDatagrid.dataChange(1);
        })
      },
      clearCustNo() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
      },
      //查询客户信息
      queryCustNo() {
        this.showCustElecSignWin = true;
      },
      //赋值
      custElecSignSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustElecSignWin = false;
      },
      //关闭
      custElecSignWinClose() {
        this.showCustElecSignWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.custInfoParams = { custNo: this.formItem.custNo, custName: this.formItem.custName };
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
      formatInvoiceAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.invoiceAmt)) && isFinite(this.addForm.invoiceAmt)) {
            this.addForm.invoiceAmt = this.addForm.invoiceAmt == null ? "0.00" : formatNumber(this.addForm.invoiceAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.invoiceAmt = this.addForm.invoiceAmt.toString().replace(/,/g, "");
        }
      },
      formatInvoiceTaxInterest(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.invoiceTaxInterest)) && isFinite(this.addForm.invoiceTaxInterest)) {
            this.addForm.invoiceTaxInterest = this.addForm.invoiceTaxInterest == null ? "0.00" : formatNumber(this.addForm.invoiceTaxInterest, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.invoiceTaxInterest = this.addForm.invoiceTaxInterest.toString().replace(/,/g, "");
        }
      },
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.custNo='';
        this.clearVal();
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      //新增/修改发票申请
      invoiceEdit(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.$refs.datagrid.selects.length === 1) {
            this.$nextTick(() => {
              let selectData=this.$refs.datagrid.selects[0];
              this.addForm.id=selectData.id
              this.addForm.custNo=selectData.custNo
              this.addForm.custName=selectData.custName
              this.addForm.buyerName=selectData.buyerName
              this.addForm.buyerTaxNo=selectData.buyerTaxNo
              this.addForm.invoiceType=selectData.invoiceType
              /*this.addForm.invoiceCpesCode=selectData.invoiceNo.substring(0,12);
              this.addForm.invoiceCpesNo=selectData.invoiceNo.substring(12,20);*/
              this.addForm.invoiceCpesCode=selectData.invoiceCpesCode
              this.addForm.invoiceCpesNo=selectData.invoiceCpesNo
              this.addForm.invoiceNo=selectData.invoiceNo
              this.addForm.invoiceRatioPct=selectData.invoiceRatioPct
              this.addForm.custTaxNo=selectData.custTaxNo
              this.addForm.invoiceCheckCode=selectData.invoiceCheckCode
              this.addForm.invoiceContent=selectData.invoiceContent
              this.addForm.invoiceRemark=selectData.invoiceRemark
              this.addForm.sellerTaxNo=selectData.sellerTaxNo
              this.addForm.invoiceTaxInterest = formatNumber(selectData.invoiceTaxInterest, 2, ',');
              this.addForm.invoiceAmt = formatNumber(selectData.invoiceAmt, 2, ',');
              this.addForm.invoiceTaxInterest = formatNumber(selectData.invoiceTaxInterest, 2, ',');
              if (this.$refs.datagrid.selects[0].invoiceDt != null && this.$refs.datagrid.selects[0].invoiceDt !== "") {
                this.addForm.invoiceDt = this.$moment(this.$refs.datagrid.selects[0].invoiceDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
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
        this.addForm.id = "";
        this.$refs.addForm.resetFields();
      },
      submitForm() {
        this.addForm.invoiceAmt = this.addForm.invoiceAmt.toString().replace(/,/g, "");
        this.addForm.invoiceDt = this.addForm.invoiceDt.replace(/-/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/bm/ctrct/invoiceInfoManager/func_addInvoiceInfo" : "/bm/ctrct/invoiceInfoManager/func_updateInvoiceInfo";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addFormReset();
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
        post({ ids: ids }, "/bm/ctrct/invoiceInfoManager/func_delInvoiceInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //清单导出
      exportList(field, exportType){
        let url = window.LOCAL_CONFIG.API_HOME + "/bm/ctrct/invoiceInfoManager/func_exportExcel";
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if(this.$refs.datagrid.total == 0){
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = { ids: this.$refs.datagrid.selectIds, pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
          }else {
            params = { custNo:this.formItem.custNo,createBrchNos:this.formItem.createBrchNos,invoiceNo:this.formItem.invoiceNo,
              field: field, exportType: exportType, excelName: this.param,pageSize:pageSize};
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          if (this.$refs.datagrid.selectIds.length != 0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'pageSize';
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1)
            }
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },

      showFile(){
        if (this.$refs.datagrid.selects.length === 1) {
          let selectData=this.$refs.datagrid.selects[0];
          this.fileBatchParams.operType = "upload";
          this.fileBatchParams.busiId = selectData.id;
          this.fileBatchParams.attachBusiType = "invoiceInfoFile";
          this.fileBatchParams.attTypeCodeList = this.attTypeCodeList;
          this.fileBatchParams.fileDetailStatusList = this.fileDetailStatusList;
          this.showFileWin = true;
        }else{
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },
      changeNo(){
        this.addForm.invoiceNo = this.addForm.invoiceCpesCode + this.addForm.invoiceCpesNo;
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
