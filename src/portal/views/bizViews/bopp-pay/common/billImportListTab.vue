<template>
  <div>
    <div style="height: 46px">
      <h-button type="primary" @click="templateDownload">{{$t('m.i.common.templateDownload')}}</h-button>
      <h-button type="primary" @click="batchImport">{{$t('m.i.common.batchImport')}}</h-button>
    </div>
    <bopp-show-bill-info-list :params="params" ref="billInfoList"></bopp-show-bill-info-list>
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose" @importSuccess="importSuccess"></common-file-upload>
  </div>
</template>

<script>
import {formatNumber} from "@/api/bizApi/commonUtil";

export default {
  name: "billImportListTab",
  data() {
    return {
      params: {
        payInfoId: "",
      },
      fileParams: {
        columns:[
          // {
          //   type: 'selection',
          //   width: 50,
          //   hiddenCol: false,
          //   align: 'center'
          // },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            // render:(h,params) => {
            //   let billOrigin = params.row.billOrigin;
            //   let billRangeStart = params.row.billRangeStart;
            //   let billRangeEnd = params.row.billRangeEnd;
            //   return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            // }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.stdAmt"),
            key: "stdAmt",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.stdAmt, 2, ","));
            }
          }
        ],
        loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pay/payment/billPaymentMain/func_loadExcelData",  //导入excel数据解析接口
        fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pay/payment/billPaymentMain/func_submitExcelData",  //excel数据导入接口
        formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          paramKey: "list",        //后台接收对应key
          ignoreError: true,
        },
        importWin: false,

      }
    },
    props: {
      payInfoId: "",
    },
    methods: {
      handleSearch(){
        this.params.payInfoId = this.payInfoId;
        this.$refs.billInfoList.handleSearch();
      },
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/pay/payment/billPaymentMain/func_templateDownload";
        let form = document.createElement('form');
        form.setAttribute("id","formId");
        form.setAttribute('action',url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      batchImport() {
        this.fileParams.uploadParams.id = this.payInfoId;
        this.importWin = true;
      },
      importWinClose(){
        this.importWin = false;
        this.handleSearch();
      },
      importSuccess(){
        this.importWin = false;
        this.handleSearch();
      }
    }
  }
</script>

<style scoped>

</style>
