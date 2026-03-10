<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div >
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly clearable @on-clear="clearVal()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="formItemRemitDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleRemitDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" :value="formItemDueDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleDueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item label="是否行内发托" prop="isInnerPrsttn">
                  <h-select v-model="formItem.isInnerPrsttn" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>

                <h-form-item :label="$t('m.i.ce.payRgstDt')">
                  <h-date-picker :value="payRgstDtRange" type="daterange" autoPlacement  showFormat :editable=false @on-change="handlePaymentDtChange" placeholder=""></h-date-picker>
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
                      :url="queryUrl"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import {formatNumber,getDictValueFromMap,getDictListByGroups} from "@/api/bizApi/commonUtil";
  export default {
    name: "paymentRegisterOccurQuery",

    data() {
      return {
        queryUrl:"/banks/szbank/pe/busiqry/paymentRegisterOccurQuery/func_pageQueryAcptPaymentOccurData",
        ifShowMore:false,
        formItem:{
          drwrName:"",
          drwrCustNo:"",
          billNoLike:"",
          isInnerPrsttn:"",
          minRemitDt:"",
          maxRemitDt:"",
          minDueDt:"",
          maxDueDt:"",
          minPayRgstDt:'',
          maxPayRgstDt:''
        },
        formItemRemitDt:[],
        formItemDueDt:[],
        payRgstDtRange:[],
        showBillInfoWin:false,
        showCustMessageWin:false,
        billId:'',
        columns:[
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },{
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (!params.row.billNo) {
                billNo = "查看票面";
              } else {
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
          },{
            title:"是否行内发托",
            key:"isInnerPrsttn",
            hiddenCol:false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isInnerPrsttn);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },{
            title:this.$t("m.i.pe.acptType"),
            key:"acptType",
            hiddenCol:false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcptType", params.row.acptType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },{
            title: this.$t("m.i.ce.payRgstStatus"),
            key: 'payRgstStatus',
            hiddenCol: false,
            render: (h, params) => {
              let payRgstStatus = "";
              if(params.row.payRgstStatus == "1"){
                payRgstStatus = "已付款登记";
              }
              if(params.row.payRgstStatus == "0"){
                payRgstStatus = "付款登记删除";
              }
              return h("span", payRgstStatus);
            }
          },{
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
          },{
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
          },{
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },{
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            hiddenCol: false,
          },{
            title: this.$t('m.i.billInfo.drwrCustNo'),
            key: 'drwrCustNo',
            hiddenCol: false,
          },{
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
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
          },{
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },{
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: 'pyeeAcctNo',
            sortable: true,
            hiddenCol: false,
          },{
            title: this.$t("m.i.ce.prsttnApplAcctNo"),
            key: 'prsttnAcctNo',
            hiddenCol: false,
          },{
            title: this.$t("m.i.ce.prsttnApplName"),
            key: 'prsttnName',
            hiddenCol: false,
          },{
            title: this.$t("m.i.ce.prsttnApplBankNo"),
            key: 'prsttnBankNo',
            hiddenCol: false,
          },{
            title: this.$t("m.i.ce.prsttnApplBankName"),
            key: 'prsttnBankName',
            hiddenCol: false,
          },{
            title:"付款登记柜员",
            key:"payRgstTellerNo",
            hiddenCol:false
          },{
            title: this.$t("m.i.ce.payRgstDt"),
            key: 'payRgstDt',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.payRgstDt == null || params.row.payRgstDt === ""){
                return "";
              }
              let date = this.$moment(params.row.payRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },{
            title:"付款登记时间",
            key:"payRgstTm",
            hiddenCol:false,
            render: (h, params) => {
              if (params.row.payRgstTm == null || params.row.payRgstTm === "") {
                return "";
              }
              let payRgstTm = params.row.payRgstTm.toString();
              if (params.row.payRgstTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.payRgstTm.toString().length); i++) {
                  payRgstTm = "0" + payRgstTm;
                }
              }
              let date = this.$moment(payRgstTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },{
            title:"付款登记机构",
            key:"payRgstBrchName",
            hiddenCol:false
          },{
            title:"付款登记删除柜员",
            key:"delPayRgstTellerNo",
            hiddenCol:false
          },{
            title:"付款登记删除日期",
            key:"delPayRgstDt",
            hiddenCol:false,
            render: (h, params) => {
              if(!params.row.delPayRgstDt){
                return "";
              }
              let date = this.$moment(params.row.delPayRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },{
            title:"付款登记删除时间",
            key:"delPayRgstTm",
            hiddenCol:false,
            render: (h, params) => {
              if (params.row.delPayRgstTm == null || params.row.delPayRgstTm === "") {
                return "";
              }
              let delPayRgstTm = params.row.delPayRgstTm.toString();
              if (params.row.delPayRgstTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.delPayRgstTm.toString().length); i++) {
                  delPayRgstTm = "0" + delPayRgstTm;
                }
              }
              let date = this.$moment(delPayRgstTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },{
            title:"付款登记删除机构",
            key:"delPayRgstBrchName",
            hiddenCol:false
          }
        ],
        dictMap:new Map(),
        YonList:[]
      }
    },
    mounted(){
      getDictListByGroups("Yon,AcptType").then(res => {
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    },
    methods:{
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.formItemRemitDt = [arr[0], arr[1]];
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.formItemRemitDt = [];
        }

      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.formItemDueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.formItemDueDt = [];
        }
      },
      handlePaymentDtChange(arr){
        if(arr && arr.length == 2){
          this.formItem.minPayRgstDt = arr[0].replace(/-/g, "");
          this.formItem.maxPayRgstDt = arr[1].replace(/-/g, "");
          this.payRgstDtRange = [arr[0], arr[1]];
        }else{
          this.formItem.minPayRgstDt = "";
          this.formItem.maxPayRgstDt = "";
          this.payRgstDtRange = [];
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds= [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minPayRgstDt = "";
        this.formItem.maxPayRgstDt = "";
        this.formItemRemitDt = [];
        this.formItemDueDt = [];
        this.payRgstDtRange = [];
        this.formItem.drwrCustNo="";
      },
      //查询客户信息
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      clearVal(){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
      },
    }
  }
</script>
