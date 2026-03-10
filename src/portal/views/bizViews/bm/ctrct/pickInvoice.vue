<!--挑选合同-->
<template>
  <div>
    <h-msg-box v-model="tempPickInvoiceWin" width="1000" :mask-closable="false" @on-close="goBack"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div>
        <div class="h-form-search-box">
          <h-form :model="pickInvoiceForm" :label-width="100" ref="pickInvoiceForm" cols="4"
                  class="h-form-search">
            <h-form-item :label="$t('m.i.bm.invoiceNo')" prop="invoiceNo">
              <h-input v-model="pickInvoiceForm.invoiceNo" :maxlength="60"></h-input>
            </h-form-item>
            <h-form-item class="h-form-operate one-form">
              <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </div>
      </div>
      <!--数据展示表格-->
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="columns"
            :url="URL"
            :bindForm="pickInvoiceForm"
            :auto-load="false"
            highlightRow
            :row-select="true"
            :has-select="hasSelect"
            ref="pickDatagrid">
            <!-- 弹出框模式顶部按钮 -->
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pick">{{$t("m.i.common.commit")}}</h-button>
              <h-button type="ghost" @click="goBack">{{$t("m.i.common.close")}}</h-button>
            </div>
          </h-datagrid>
        </h-col>
      </h-row>

   <!--   <div slot="footer">
        <h-button type="ghost" @click="pickBillClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="pickBillStock()">{{$t("m.i.common.commit")}}</h-button>
      </div>-->
    </h-msg-box>
  </div>
</template>
<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "pickInvoice",
    data(){
      let _this = this;
      return{
        URL:"/bm/ctrct/tradeInfo/func_pagingNotRelationInvoice",
        hasSelect:false,
        currentSelectRow:[],
        pickInvoiceForm:{
          invoiceNo:"",
          id:"",
          voucherType:"03",
          endorType:""
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
            title: this.$t('m.i.bm.invoiceAmtOnly'),
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
      }
    },
    watch: {
      pickInvoiceWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    props: {
      title: {
        type: String,
        default() {
          return "挑选发票";
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
      pickInvoiceWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempPickInvoiceWin: {
        get() {
          return this.pickInvoiceWin;
        },
        set() {
        }
      }
    },
    methods:{
      onMaximize() {
        setTimeout(() => {
          this.$refs.pickDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        //this.relationBillForm.listId = this.relationInvoiceBillParams.listId;
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.pickDatagrid.selects = [];
        this.$refs.pickDatagrid.selectIds = [];
        this.pickInvoiceForm.id = this.batchParams.tradeId;
        this.pickInvoiceForm.voucherType = "03";
        this.pickInvoiceForm.endorType = this.batchParams.endorType;
        this.pickInvoiceForm.buyerName = this.batchParams.buyerName;
        this.pickInvoiceForm.sellerName = this.batchParams.sellerName;
        this.$refs.pickDatagrid.dataChange(1);
        this.$refs.pickDatagrid.$refs.gridPage.clearElevator();
      },
      resetSearch() {
        this.$refs.pickInvoiceForm.resetFields();
      },
      //返回
      goBack() {
        this.$refs.pickInvoiceForm.resetFields();
        //this.relationBillForm.listId = "";
        this.pickInvoiceForm.id = "";
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.pickDatagrid.selects = [];
        this.$refs.pickDatagrid.selectIds = [];
        this.$refs.pickDatagrid.$refs.gridPage.clearElevator();
        this.$emit("pickInvoiceWinClose", "");
      },
      // 挑选
      pick(){
        let list = this.$refs.pickDatagrid.selects;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let idList = [];
        for (let i = 0; i < list.length; i++) {
          idList.push(list[i].id)
        }
        let url = "/bm/ctrct/tradeInfo/func_pickInvoice";
        post({voucherType:"03" ,voucherIds:idList,id:this.batchParams.tradeId}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.goBack();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
