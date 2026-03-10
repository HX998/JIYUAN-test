<!--签约协议弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempSignAgreementWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div v-if="isShowQuery">
        <h-form :model="formItem" :label-width="115" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo">
            <h-input v-model="formItem.agreementNo" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item prop="custName" :label="$t('m.i.common.custName')">
            <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                     @on-click="queryCustNo()" clearable @on-clear="clearVal('custName')" readonly></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate two-form">
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        highlight-row
        :url="signParams.agreementUrl"
        :bindForm="formItem"
        :onCurrentChange="onCurrentChange"
        :onCurrentChangeCancel="onCurrentChangeCancle"
        :onRowDbClick="doubleHandleClick"
        :autoLoad=false
        ref="datagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm" v-if="isShowQuery">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
  </div>
</template>

<script>
  import { post, on, off, accMul, formatNumber } from "@/api/bizApi/commonUtil";


  export default {
    name: "showSignAgreement",
    components: {  },
    data() {
      return {
        columns : [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pl.agreementNo"),
            key: "agreementNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pl.signStartDt"),
            key: "signStartDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.signStartDt == null || params.row.signStartDt === "") {
                return "";
              }
              let date = this.$moment(params.row.signStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.signEndDt"),
            key: "signEndDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.signEndDt == null || params.row.signEndDt === "") {
                return "";
              }
              let date = this.$moment(params.row.signEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.signFunc"),
            key: "signFuncNo",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SignFuncNo", params.row.signFuncNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pl.signCustNo"),
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
            title: this.$t("m.i.pl.custSettleAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.poolBillBailAcctNo"),
            key: "billBailAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t('m.i.pl.poolBailSubAcctNo'),
            key: "poolBailSubAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title:this.$t("m.i.pl.authorizer"),
            key: "authorizer",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pl.secondAuthorizer"),
            key: "secondAuthorizer",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.deleteFlag"),
            key: "deleteFlag",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let deleteFlag = params.row.deleteFlag;
              switch (params.row.deleteFlag) {
                case "0":
                  deleteFlag = "未解约";
                  break;
                case "1":
                  deleteFlag = "已解约";
                  break;
              }
              return h("span", deleteFlag);
            }
          },
          {
            title: this.$t("m.i.pl.isGroupCus"),
            key: "isGroupCus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGroupCus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pl.discountPcet"),
            key: "discountPcet",
            hiddenCol: false,
            render: (h, params) => {
              let discountPcet = params.row.discountPcet;
              if (discountPcet != null && discountPcet !== "" && discountPcet !== 0) {
                discountPcet = formatNumber(accMul(discountPcet, 100), 2, ",");
                return h("span", discountPcet);
              } else {
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.pl.maxMoney"),
            key: "maxMoney",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let maxMoney = formatNumber(params.row.maxMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: maxMoney
                }
              }, maxMoney);
            }
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
            title: this.$t("m.i.pl.isCollect"),
            key: "isCollect",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCollect);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title:this.$t("m.i.pl.saleOffMode"),
            key: "saleOffMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SaleOffMode", params.row.saleOffMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        formItem : {
          deleteFlag: "0",
          agreementNo: "",
          custNo: "",
          custName: "",
          isGroupCus: "",
          isMainGroupCus: "",
          signFuncNo: "",
          parentAgreementNo:"",
          effectiveFlag: ""
        },
        currentSelectRow : null,
        showCustMessageWin : false,
        dictMap : new Map(),
      };
    },
    props: {
      signAgreementWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "查询签约协议"
      },
      //是否显示查询栏
      isShowQuery: {
        type: Boolean,
        default: true
      },
      signParams: {
        type: Object,
        default() {
          return {
            agreementNo: "",
            isGroupCus: "",
            agreementUrl: "",
            signFuncNo: "",
            isMainGroupCus: "",
            parentAgreementNo:"",
            effectiveFlag: "",
            showSubBillBailAcctNo:false   //显示子账号
          };
        }
      }
    },
    watch: {
      signAgreementWin(val) {
        if (val === true) {
          this.formItem.agreementNo = this.signParams.agreementNo;
          this.formItem.isGroupCus = this.signParams.isGroupCus;
          this.formItem.isMainGroupCus = this.signParams.isMainGroupCus;
          this.formItem.signFuncNo = this.signParams.signFuncNo;
          this.formItem.effectiveFlag = this.signParams.effectiveFlag;
          this.formItem.parentAgreementNo = this.signParams.parentAgreementNo;
          this.$nextTick(() => {
            if (!this.signParams.showSubBillBailAcctNo){
              this.columns.forEach((value, index) => {
                if (value.key === 'poolBailSubAcctNo') {
                  value.hiddenCol = true;
                }
              });
              this.$refs.datagrid.createShowCol(this.columns);
            }
            if (this.isShowQuery) {
              this.formSearchReset();
            }
            this.formSearch();
          });
        }
      },
    },
    computed: {
      tempSignAgreementWin: {
        get() {
          return this.signAgreementWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.custNo = "";
        this.$refs.formItem.resetFields();
      },
      onCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("signAgreementSubmit", this.currentSelectRow);
      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("signAgreementWinClose", "");
      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("signAgreementSubmit", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      }
    },
    mounted() {
      this.getDictListByGroups("SignFuncNo,SaleOffMode,Yon").then(res => {
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
