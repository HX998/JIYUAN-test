<template>
  <div>
    <h-datagrid
      :columns="columns"
      highlight-row
      :auto-load="false"
      url="/pay/payment/billPaymentMain/func_queryPaymentBillByList"
      :bindForm="queryFormItem"
      :hasPage="false"
      :row-select="true"
      ref="datagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @click="delBill()">{{$t("s.i.pay.delBill")}}</h-button>
      </div>
    </h-datagrid>
  </div>
</template>

<script>
  import {post, on, off, formatNumber,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "showBillInfoList",
    data() {
      return {
        queryFormItem: {
          payInfoId: "",
        },
        columns:[
          {
            type: 'selection',
            width: 50,
            hiddenCol: false,
            align: 'center'
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
      }
    },
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      handleSearch() {
        this.queryFormItem.payInfoId = this.params.payInfoId;
        this.queryFormItem.payStatus = this.params.payStatus;
        this.$refs.datagrid.dataChange(1);
      },
      delBill() {
        let ids = this.$refs.datagrid.selectIds;
        if (ids.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t('s.i.pay.delBill'),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.delBillFunc(ids);
          }
        });
      },
      delBillFunc(ids){
        let url="/pay/payment/billPaymentMain/func_delBill";
        post({idList: ids}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode
            if (retCode === "000000") {
              this.$msgTip.success(this);
              //调用解锁的接口
              let unUrl = "/pay/payment/billPaymentMain/func_lockUnLockBillFromPage"
              let unLockList = [];
              unLockList = ids.filter(item => {
                return item.payStatus == 'PS01' && item.payStatus == 'PS61' && item.payStatus == 'PS02' &&
                  item.payStatus == 'PS62' && item.payStatus == 'PS03' && item.payStatus == 'PS63' &&
                  item.payStatus == 'PS08' && item.payStatus == 'PS68'
              })
              if (unLockList.length > 0) {
                let obj = {
                  id: this.currentSelectRow.id,
                  idList: unLockList,
                  memberId: this.$store.getters.userInfo.memberId,
                  branchCode: this.$store.getters.userInfo.cepsBrchCode,
                  paymentOptionType: "POT02"
                }
                post(obj, unUrl).then(res1 => {
                  if (res1) {
                    let retCode1 = res1.data.retCode
                    if (retCode === "000000") {
                      this.$msgTip.success(this);
                    } else {
                      this.$msgTip.error(this, {info: res1.data.retMsg});
                    }
                  }else {
                    this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
                  }
                })
              }
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          }else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
          }
        });
      }
    },
  }
</script>

<style scoped>

</style>
