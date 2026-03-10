<template>
  <!--挑选可关联发票明细-->
  <h-msg-box v-model="tempImpawnPickBillWin" width="1000" :mask-closable="false" @on-close="handleClose" class="h-form-table-layer"
             :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div class="h-form-search-box">
      <!-- 查询表单 -->
        <h-form :model="billPickInvoiceForm" :label-width="90" ref="billPickInvoiceForm" cols="4" class="h-form-search">
          <h-form-item prop="createTime" :label="$t('m.i.common.createDt')">
            <h-date-picker :value="dateShow" type="daterange" v-model="billPickInvoiceForm.createTime"  placeholder=""  showFormat @on-change="handleDateChange"  :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item prop="invoiceRemark" :label="$t('m.i.common.remark')">
            <h-input v-model="billPickInvoiceForm.invoiceRemark" placeholder="" :maxlength="250"></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid :columns="columns"
                    url="/bm/ctrct/invoiceInfoManager/func_pageQueryInvoiceInfo"
                    :bindForm="billPickInvoiceForm"
                    :auto-load="false"
                    :onCurrentChange="handleCurrentChange"
                    :onCurrentChangeCancel="handleCurrentChangeCancel"
                    highlightRow ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.ce.relationInvoice")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";
  import { mapGetters } from "vuex";

  export default {
    name: "billPickInvoice",
    data() {
      return {
        billPickInvoiceForm: {
          listId: "",
          custNo: "",
          createTellerNo: "",
          createTime: "",
          minCreateTime: "",
          maxCreateTime: "",
          invoiceRemark: "",
        },
        currentSelectRow:[],
        ifShowMore: false,
        dateShow : [],
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t('m.i.bm.invoiceNo'),
            key: "invoiceNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custNo'),
            key: "custNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.buyerName'),
            key: "buyerName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceAmtUnit'),
            key: "invoiceAmt",
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
            title: this.$t('m.i.bm.invoiceUsedAmtByUnit'),
            key:'invoiceUsedAmt',
            hiddenCol:false,
            render: (h, params) => {
              let invoiceUsedAmt = formatNumber(params.row.invoiceUsedAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: invoiceUsedAmt
                }
              }, invoiceUsedAmt);
            }
          },
          {
            title: this.$t('m.i.bm.invoiceUsableAmtByUnit'),
            key:'invoiceUsableAmt',
            hiddenCol:false,
            render: (h, params) => {
              let invoiceUsableAmt = formatNumber(params.row.invoiceUsableAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: invoiceUsableAmt
                }
              }, invoiceUsableAmt);
            }
          },

          {
            title: this.$t('m.i.bm.invoiceDt'),
            key: "invoiceDt",
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
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceTaxMoneyUnit'),
            key: "invoiceTaxInterest",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.invoiceTaxInterest == null || params.row.invoiceTaxInterest === "") {
                return h("span", "0.00");
              } else {
              let invoiceTaxInterest = formatNumber(params.row.invoiceTaxInterest, 2, ',');
              return h("span", {
                domProps: {
                  title: invoiceTaxInterest
                }
              }, invoiceTaxInterest);
            }
            }
          },
          {
            title: this.$t('m.i.bm.invoiceCheckNo'),
            key: "invoiceCheckCode",
            hiddenCol: false,
            sortable: true,
          },
          {
            title:'创建日期',
            key:"",
            hiddenCol:false,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime == "" || params.row.createTime == 0) {
                return "";
              }
              let createDt = params.row.createTime.toString().substring(0, 8);
              let date = this.$moment(createDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            },
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "invoiceRemark",
            hiddenCol: false,
          },
        ]
      }
    },
    props: {
      title: {
        type: String,
        default() {
          return "挑选发票明细";
        }
      },
      billPickInvoiceWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      billPickInvoiceParams: {
        type: Object,
        default: {
          listId: "",
          custNo: "",
          billNo: "",
          billMoney: "",
          batchNo:"",
          billId:"",
          billRangeStart:"",
          billRangeEnd:"",
          dictMap: new Map()
        }
      }
    },
    watch: {
      billPickInvoiceWin(val) {
        if (val === true) {
          this.billPickInvoiceForm.listId = this.billPickInvoiceParams.listId;
          this.billPickInvoiceForm.custNo = this.billPickInvoiceParams.custNo;
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      },
      sidebar: {
        handler(val, oldVal) {
          if (!val.opened) {
            setTimeout(() => {
              this.$refs.datagrid.$refs.gridContent.handleResize();
            }, 100);
          }
        },
        deep: true
      }
    },
    computed: {
      tempImpawnPickBillWin: {
        get() {
          return this.billPickInvoiceWin;
        },
        set() {
        }
      },
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleDateChange(arr) {
        if(arr && arr.length == 2){
          this.billPickInvoiceForm.minCreateTime = arr[0].replace(/-/g, "");
          this.billPickInvoiceForm.maxCreateTime = arr[1].replace(/-/g, "");
          this.dateShow = [arr[0], arr[1]];
        }else{
          this.billPickInvoiceForm.minCreateTime = "";
          this.billPickInvoiceForm.maxCreateTime = "";
          this.dateShow = [];
        }
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.billPickInvoiceForm.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },

      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //表格自适应
      handleResize() {
        this.$nextTick(() => {
          if(this.$refs.datagrid) {
            this.$refs.datagrid.selfAdaption();
          }
        });
      },
      //查询
      formSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleClose() {
        this.currentSelectRow = [];
        this.$refs.billPickInvoiceForm.resetFields();
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("billPickInvoiceWinClose", "");
      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length != 0) {
          let invoiceUsedAmt = this.billPickInvoiceParams.billMoney;
          if (this.currentSelectRow.invoiceUsableAmt < this.billPickInvoiceParams.billMoney) {
            invoiceUsedAmt = this.currentSelectRow.invoiceUsableAmt;
          }
          post({ "listId": this.billPickInvoiceParams.listId, "invoiceIds": this.currentSelectRow.id, "billNo": this.billPickInvoiceParams.billNo,  "invoiceUsedAmt": invoiceUsedAmt, "billMoney":this.billPickInvoiceParams.billMoney, "batchNo":this.billPickInvoiceParams.batchNo, "billId":this.billPickInvoiceParams.billId,"billRangeStart":this.billPickInvoiceParams.billRangeStart,"billRangeEnd":this.billPickInvoiceParams.billRangeEnd}, "/bm/ctrct/invoiceBillInfo/func_relatedBillInfoAndInvoice").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.currentSelectRow = [];
                this.$hMsgBox.info({
                  title: this.$t("m.i.common.info"),
                  content: res.data.retMsg,
                  onOk: () => {
                    this.$emit("billPickInvoiceChange", this.billPickInvoiceParams.listId);
                  }
                });
              } else {
                this.currentSelectRow = [];
                this.$msgTip.error(this, { info: res.data.retMsg });
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return
        }
      }
    },
    mounted() {
    },

  };

</script>

<style scoped>

</style>
