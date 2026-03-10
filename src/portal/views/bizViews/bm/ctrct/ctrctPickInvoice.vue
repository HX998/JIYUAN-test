<template>
  <!--电票质押挑票弹出框-->
  <h-msg-box v-model="tempImpawnPickBillWin" width="1000" :mask-closable="false" @on-close="handleClose" class="h-form-table-layer"
             :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid :columns="columns" url="/bm/ctrct/invoiceInfoManager/func_pagingQueryPickInvoiceInfo" :bindForm="ctrctPickInvoiceForm"
                    :auto-load="false" :rowSelect="true" ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "ctrctPickInvoice",
    data() {
      return {
        ctrctPickInvoiceForm: {
          ctrctId: "",
          custNo:"",
          buyerCustName: "",
          isAmtUseAble: "1",
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
            title: this.$t('m.i.bm.invoiceUsedAmt'),
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
            title: this.$t('m.i.bm.invoiceUsableAmt'),
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
            title: this.$t('m.i.bm.buyerName'),
            key: "buyerName",
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
            title: this.$t('m.i.bm.invoiceTaxMoney'),
            key: "invoiceTaxInterest",
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
            }
          },
          {
            title:'创建时间',
            key:"createTime",
            hiddenCol:false,
            render:(h, params) =>{
              return h('span', params.row.createTime?this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"):"")
            }
          }
        ]
      }
    },
    props: {
      title: {
        type: String,
        default() {
          return "挑票查询";
        }
      },
      ctrctPickInvoiceWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      ctrctPickInvoiceParams: {
        type: Object,
        default: {
          ctrctId: "",
          custNo:"",
          buyerName: "",
          dictMap: new Map()
        }
      }
    },
    watch: {
      ctrctPickInvoiceWin(val) {
        if (val === true) {
          // this.ctrctPickInvoiceForm.ctrctId = this.ctrctPickInvoiceParams.ctrctId;
          this.ctrctPickInvoiceForm.custNo = this.ctrctPickInvoiceParams.custNo;
          this.ctrctPickInvoiceForm.buyerName = this.ctrctPickInvoiceParams.buyerCustName;
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempImpawnPickBillWin: {
        get() {
          return this.ctrctPickInvoiceWin;
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
      //查询
      formSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        // this.$refs.impawnPickBillForm.resetFields();
        this.ctrctPickInvoiceForm.buyerCustName = "";
      },
      handleClose() {
        this.formSearchReset();
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("ctrctPickInvoiceWinClose", "");
      },
      submitForm() {
        if (this.$refs.datagrid.selectIds.length == 0) {
          this.$msgTip.info(this, { info: "请先选择记录" });
          return
        }
        let ids = this.$refs.datagrid.selectIds.join(",");
        let amt = 0.0;
        for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
          amt += this.$refs.datagrid.selects[i].invoiceAmt;
        }
        post({ "ctrctId": this.ctrctPickInvoiceParams.ctrctId, "invoiceIds": ids, "submitSumAmt": amt }, "/bm/ctrct/transContractManager/func_pickInvoice").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleClose();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      }
    }
  };

</script>

<style scoped>

</style>
