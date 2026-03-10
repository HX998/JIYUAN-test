<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="showCustMessageWin = true" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="sspdStatus" :label="$t('m.i.ce.sspdStatus')">
                  <h-select v-model="formItem.sspdStatus" placeholder="" showTitle>
                    <h-option value="1" key="1">止付待复核</h-option>
                    <h-option value="3" key="3">{{$t('m.i.ce.hasStopPay')}}</h-option>
                    <h-option value="4" key="4">解除止付待复核</h-option>
                    <h-option value="6" key="6">{{$t('m.i.ce.hasRelievePay')}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="isAcct" label="记账状态">
                  <h-select v-model="formItem.isAcct" placeholder="" >
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="sspdType" :label="$t('m.i.billInfo.sspdType')" v-if="showSspd">
                  <h-select v-model="formItem.sspdType" placeholder="" :readonly="formItem.sspdType==='modify'" showTitle>
                    <h-option v-for="item in this.sspdTypeList" :value="item.key" :key="item.key" >{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="relieveType" :label="$t('m.i.billInfo.relieveType')" v-if="showRelieve">
                  <h-select v-model="formItem.sspdType" placeholder="" :readonly="formItem.relieveType==='modify'" showTitle>
                    <h-option v-for="item in this.relieveTypeList" :value="item.key" :key="item.key">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="rgstDt" label="止付登记日期" v-if="showSspd">
                  <h-date-picker :value="rgstDtRange" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRgstDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item prop="rgstDt" label="解除止付登记日期" v-if="showRelieve" class="h-form-long-label">
                  <h-date-picker :value="rgstDtRange" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRgstDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item prop="sspdDt" :label="$t('m.i.billInfo.sspdDt')" v-if="showSspd">
                  <h-date-picker type="date" v-model="formItem.sspdDt" placeholder="" format="yyyy-MM-dd"
                                 :editable=false showFormat @on-change="handleDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="sspdDt" :label="$t('m.i.billInfo.relieveDt')" v-if="showRelieve">
                  <h-date-picker type="date" v-model="formItem.sspdDt" placeholder="" @on-change="handleDateChange"
                                 showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterTrackSearch/func_pagingQuerySspdAndCancelSspdTrackInfo"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportExcel()">导出</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="showCustMessageWin =false"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWin =false" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!-- 票面信息 -->
        <bill-info-main @billInfoWinClose="showBillInfoWin = false" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>


        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="imageParams"
          :isShow="false"
          :isShowSearch="false"
          :isShowReset="false"
          :authObj="authObject"
          :isShowImgBatchNo="false"
          @imageWinClose="uploadImageWinClose"></image-loading>

        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name:"busiStopPaymentRegisterTrackSearch",
    data(){
      return {
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        columns: [
          {
            type: 'selection',
            align: 'center',
            width : 50
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
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.ce.sspdStatus"),
            key: 'sspdStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"SspdStatus",params.row.sspdStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.sspdAndRelieveType"),
            key: 'sspdAndRelieveType',
            hiddenCol: false,
          },
          {
            title:"止付/解除止付日期",
            key:"sspdAndRelieveDt",
            hiddenCol:false,
            render:(h,params)=>{
              let value=params.row.sspdAndRelieveDt!=null ?this.$moment(params.row.sspdAndRelieveDt, "YYYYMMDD").format("YYYY-MM-DD"):"-";
              return h("span",
                {
                  domProps: {
                    title: value
                  }
                }, value);
            }
          },
          {
            title:"止付/解除止付登记日期",
            key:"sspdAndRelieveRgstDt",
            hiddenCol:false,
            render:(h,params)=>{
              let value=params.row.sspdAndRelieveRgstDt!=null ?this.$moment(params.row.sspdAndRelieveRgstDt, "YYYYMMDD").format("YYYY-MM-DD"):"-";
              return h("span",
                {
                  domProps: {
                    title: value
                  }
                }, value);
            }
          },
          {
            title:"止付/解除止付登记状态",
            key:"sspdAndRelieveRgstStatus",
            hiddenCol:false,
            render:(h,params)=>{
              let dictValue = this.getDictValueFromMap(this.dictMap, 'AcptRgstStatus', params.row.sspdAndRelieveRgstStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
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
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
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
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptDt"),
            key: 'acptDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.acptDt == null || params.row.acptDt === ""){
                return "";
              }
              let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: "记账状态",
            key: "isAcct",
            hiddenCol:false,
            render:(h,params)=>{
              let dictValue = this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.isAcct);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title:"止付/解除止付登记失败原因",
            key:"rgstErrorReason",
            hiddenCol:false
          },
          {
            title: "影像",
            key: 'sspdOrUnSspdImage',
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openImgWin(params.row.id)
                    }
                  }
                }, '查看')
              ]);
            }
          },
        ],
        formItem:{
          drwrName:"",
          drwrAcctNo:"",
          sspdStatus:"",
          billNo:"",
          sspdType:"",
          sspdDt:"",
          relieveType:"",
          isAcct:"",
          minRgstDt:"",
          maxRgstDt:"",
          reverseBillNo : ''
        },
        drwrCustNo:"",
        showCustMessageWin:false,
        showCustAcctNoWin:false,
        ifShowMore:false,
        showBillInfoWin:false,
        billId:"",
        showUploadImageWin:false,
        imageParams: {
          listId: "",
          imageUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterTrackSearch/func_imageListPage", //查询可查看影像url
          imgShowUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterTrackSearch/func_imageById?id=", //查看影像url
          busiType:"RI05"
        },
        authObject:{
          imageAdd:false,
          imageRegister:false,
          imageDelete:false
        },
        billTypeList: [],
        dictMap: new Map(),
        relieveTypeList:[],
        sspdTypeList:[],
        acctStatusList:[],
        rgstDtRange:[],
        showSspd:false,
        showRelieve:false
      }
    },
    methods:{
      handleRgstDtChange(value){
        if (value instanceof Array && value.length==2){
          if (this.showSspd) {
            this.formItem.minSspdRgstDt = value[0].replace(/-/g, "");
            this.formItem.maxSspdRgstDt = value[1].replace(/-/g, "");
          }else {
            this.formItem.minRelieveRgstDt = value[0].replace(/-/g, "");
            this.formItem.maxRelieveRgstDt = value[1].replace(/-/g, "");
          }
          this.rgstDtRange=value;
        }else {
          this.formItem.minSspdRgstDt="";
          this.formItem.maxSspdRgstDt="";
          this.formItem.minRelieveRgstDt="";
          this.formItem.maxRelieveRgstDt="";
          this.rgstDtRange="";
        }
      },
      handleDateChange(value) {
        this.formItem.sspdDt = value.replace(/-/g, "");
      },
      handleSearch(){
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.dataChange(1);
      },
      resetSearch(){
        this.rgstDtRange="";
        this.formItem.minSspdRgstDt="";
        this.formItem.minSspdRgstDt="";
        this.formItem.minRelieveRgstDt="";
        this.formItem.maxRelieveRgstDt="";
        this.drwrCustNo="";
        this.formItem.sspdType="";
        this.$refs.formItem.resetFields();
      },
      //客户名称赋值
      custCorpSelectSubmit(info){
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.drwrCustNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值客户账号
      custAcctNoSelectSubmit(info){
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      exportExcel(){
        this.param = 'busiStopPaymentRegisterTrackSearchExportInfo';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      //影像维护弹窗
      openImgWin(str) {
        this.imageParams.listId = str;
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },

      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterTrackSearch/func_exportExcel";
        if(exportType === "1"){
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = { ids: this.$refs.datagrid.selectIds,pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
          }else {
            params=Object.assign({ field: field, exportType: exportType, excelName: this.param},this.formItem)
            if (this.$refs.datagrid.total > 0) {
              Object.assign(params,{pageNo:1,pageSize:this.$refs.datagrid.total})
            }
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
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,SspdStatus,ImgStatus,RiskStatus,AcptStatus,SspdType,AnlgSspdType,AcctFlag,AcptRgstStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.sspdTypeList = res.get("SspdType");
        this.acctStatusList = res.get("AcctFlag");
        this.relieveTypeList = res.get("AnlgSspdType");
        this.dictMap = res.get("map");
      });
    },
    watch:{
      'formItem.sspdStatus'(val){
        if (val==='1' ||val==='3'){
          this.showSspd=true;
          this.showRelieve=false;
        }
        else if (val==='4'||val==='6'){
          this.showRelieve=true;
          this.showSspd=false;
        }else {
          this.showRelieve=false;
          this.showSspd=false;
        }
        this.rgstDtRange="";
        this.formItem.sspdDt="";
        this.formItem.relieveType="";
        this.formItem.sspdType="";
      }
    }
  }
</script>
