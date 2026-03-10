<!--发票维护-->
<template>
  <div class="layout" v-if="showContractInvoice">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns" highlightRow url="/bm/ctrct/transContractManager/func_pagingQueryInvoiceByCtrct" :bindForm="formItem"
                          :onSelectChange="handleSelectClick" :rowSelect="true" :auto-load="false" ref="datagrid">
                <div slot="toolbar" class="pull-left">
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "invoiceManager",
    components: { },
    data() {
      return {
        dueDt: [],
        remitDt: [],
        formItem: {
          statusList: [],
          custNo: "",
          custName: "",
          createBrchNo: "",
          createBrchName: "",
          invoiceNoLike: "",
          ctrctId: 0,
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
            key: "custTaxNo",
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
          },
          {
            title: this.$t('m.i.bm.invoiceRatioPct'),
            key: "invoiceRatioPct",
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
                return h("span","");
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
            key: "invoiceCheckNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },

        ],
        billTypeList: [],
        transNoList: [],
        transResultList: [],
        currentSelectList: [],
        showBillInfoWin: false,
        billId: "",
        billNo: "",

      }
    },
    computed: {
    },
    props: {
      showContractInvoice: { // 是否展示当前页
        type: Boolean,
        default: false
      },
      ctrctObj: {
        type: Object,
        default: null
      },
    },
    mounted() {
      // this.getDictListByGroups("DraftTypeCode,ValetOperTransNoWithOutType,EcdsBillStatusCode,ValetOperResult").then(res => {
      //   this.billTypeList = res.get("DraftTypeCode");
      //   this.transNoList = res.get("ValetOperTransNoWithOutType");
      //   this.transResultList = res.get("ValetOperResult");
      //   this.dictMap = res.get("map");
      // });
      /*
            post({ }, "/sm/auth/user/queryAllUsersBySession").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let list = res.data.retData;
                  for(let i = 0; i < list.length; i ++){
                    this.userMap.set(list[i].userNo, list[i].userName);
                  }
                }
              }
            });
      */
    },
    watch: {
      showContractInvoice(val) {
        if (val == true) {
          // this.getCustManagerList();
          this.formItem.ctrctId = this.ctrctId;
          this.$refs.datagrid.dataChange(1);
        }
      },

    },
    methods: {
      clearCustNo() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
      },
      //表单查询
      handleSearch() {
        let minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        let maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        if (parseFloat(minBillMoney) > parseFloat(maxBillMoney)) {
          this.$msgTip.info(this, { info: "票据金额区间输入有误" });
          return;
        }
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectList = [];
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
            this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
            this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
            this.formItem.minRemitDt = this.formItem.minRemitDt.replace(/-/g, "");
            this.formItem.maxRemitDt = this.formItem.maxRemitDt.replace(/-/g, "");
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
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
        this.$refs.datagrid.tData = [];
        this.currentSelectList = [];
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        if (arr.length === 0) {
          return false;
        }
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
      }
    }
  };

</script>

<style scoped>

</style>
