<template>
  <div>
    <h-msg-box maximize v-model="tempDetilWin" width="1000" @on-close="handleClose">
      <p slot="header">
        <span>交易明细</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.busiType")}}：</h-col>
              <h-col span="15" class="val">{{format("BusiType",viewDatailForm.busiType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.batchNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.dealNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.dealNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.brchName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleBrchName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.otherBrchName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyBrchName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.custBrchCode")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyBrchCode}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}：</h-col>
              <h-col span="15" class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}：</h-col>
              <h-col span="15" class="val">{{format("CDMedia",viewDatailForm.billClass)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.orginDueSettleDt")}}：</h-col>
              <h-col span="15" class="val">{{formatDate(viewDatailForm.dueSettleDt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.applDt")}}：</h-col>
              <h-col span="15" class="val">{{formatDate(viewDatailForm.applDt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.redeemType")}}：</h-col>
              <h-col span="15" class="val">{{format("RedeemType",viewDatailForm.redeemType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.redeemReason")}}：</h-col>
              <h-col span="15" class="val">{{format("RedeemReason",viewDatailForm.redeemReason)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16" v-if="isShowPyeeInfo==='1'">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.pyeeAcctNo")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.pyeeAcctNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.pyeeName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.pyeeName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.pyeeBankNo")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.pyeeBankNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.pyeeBankName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.pyeeBankName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.orginRate")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.redeemRate")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.dueRatePct}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.orginTotalAmt")}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.totalAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.orginBuyBackTotalAmt")}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.buyBackTotalAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.orginTotalNum")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.totalAmtBillPackage")}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.redeemSumAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.redeemSumBuyTotalAmt")}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.redeemSumBuyTotalAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.totalNumBillPackage")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.redeemSumNum}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.trialInterest")}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.dueInterest)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.trialDueInterest")}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.dueSettleAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.duePayInterest")}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.duePayInterest)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.duePayAmt")}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.duePayAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.reqDealOpin")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.reqDealOpin}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.reqRemark")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.reqRemark}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.sgnOpin")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.sgnOpin}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.respRemark")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.respRemark}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
      </div>
      <h-datagrid
          :columns="billsColumns"
          :auto-load="false"
          :notSetWidth="true"
          highlight-row
          :height="350"
          :bindForm="billFormItem"
          url="/be/market/redeem/sale/querySaleMatureBillList"
          ref="billDatagrid"
      >
        <div slot="toolbar">
          <h-button type="primary" @click="exportTable">{{$t("m.i.common.exportData")}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer"></div>
    </h-msg-box>

    <bill-info-main
        @billInfoWinClose="billInfoWinClose"
        :showBillInfoWin="showBillInfoWin"
        :billId="billId"
        :billNo="billNo"
        :billRangeStart="billRangeStart"
        :billRangeEnd="billRangeEnd"
    ></bill-info-main>
  </div>
</template>
<script>
  import {
    getDictListByGroups,
    getDictValueFromMap, formatNumber,
    post, formatBillRange
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleMatureDetil",
    data() {
      return {
        billsColumns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key:"billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillOrigin("BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.trialInterestByUnit"),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.dueInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.trialDueInterestByUnit"),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.dueSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.duePayInterestByUnit"),
            key: "duePayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.duePayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.duePayAmtByUnit"),
            key: "duePayAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.duePayAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false

          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false

          },
          {
            title: this.$t("m.i.billInfo.acptBrchCode"),
            key: "acptBrchCode",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false

          },
          {
            title: this.$t("m.i.billInfo.cfmAppBrchCode"),
            key: "cfmAppBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.cfmAppBankName"),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false

          },
          {
            title: this.$t("m.i.billInfo.acptGuarntrBrchCode"),
            key: "acptGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptGuarntrBankName"),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false

          },
          {
            title: this.$t("m.i.billInfo.discBrchCode"),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false,
            sortable: true

          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBrchCode"),
            key: "discGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBankName"),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBrchCode"),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        // 分页切换配置
        pageSizeOpts: [10, 20, 50, 200],
        viewDatailForm: {
          busiType: "",
          batchNo: "",
          dealNo: "",
          brchName: "",
          saleBrchCode: "",
          saleBrchName: "",
          buyBrchCode: "",
          buyBrchName: "",
          billType: "",
          billClass: "",
          dueSettleDt: "",
          applDt: "",
          redeemType: "",
          ratePct: "",
          dueRatePct: "",
          totalNum: "",
          totalAmt: "",
          buyBackTotalAmt: "",
          redeemSumNum: "",
          redeemSumAmt: "",
          redeemSumBuyTotalAmt: "",
          dueInterest: "",
          dueSettleAmt: "",
          duePayInterest: "",
          duePayAmt: "",
          batchId: ""
        },
        autoLoad: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        billFormItem: {
          batchId: ""
        }
      };
    },
    mounted() {
      getDictListByGroups(
        "BusiType,CDMedia,DraftTypeCode,RedeemType,RedeemReason,BillOrigin,SettleType"
      ).then(res => {
        this.dictMap = res.get("map");
      });
      //this.init();
    },
    components: {},
    props: {
      isShowPyeeInfo:{
        type: String,
        default: "1"
      },
      batchId: {
        type: "",
        required: true
      },
      showmsg: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    methods: {
      showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      format(groupcode, key) {
        return getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatNumber(number) {
        return formatNumber(number,2,',');
      },
      formatDate(value) {
        return value
          ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD")
          : "";
      },
      exportTable() {
        if (this.$refs.billDatagrid.total > 0) {
          let url =
            window.LOCAL_CONFIG.API_HOME + "/be/market/redeem/sale/downloadSaleInfo";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          let input = document.createElement("input");
          input.tpye = "text";
          input.name = "ids";
          input.value = this.$refs.billDatagrid.selectIds;
          form.appendChild(input);
          let input1 = document.createElement("input");
          input1.type = "text";
          input1.name = "batchId";
          input1.value = this.billFormItem.batchId;
          form.appendChild(input1);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          this.$hMessage.warning("暂无数据可导出");
        }
      },
      handleClose() {
        this.$emit("closeMsgBox", "");
      },
      pageShowFormatBillOrigin(groupCode, key) {
        if (key == null || key === '') {
          return '-';
        }
        if (key.toString() === 'CS00') {
          return '-';
        }
        return this.format(groupCode, key);
      }
    },
    watch: {
      showmsg(val) {
        if (val) {
          this.billFormItem.batchId = this.batchId;
          post({ id: this.batchId }, "/be/market/redeem/sale/querySaleMatureInfo").then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null) {
                this.viewDatailForm = res.data.retData;
                this.$nextTick(() => {
                  this.$refs.billDatagrid.dataChange(1);
                });
              }
            }
          }).catch(error => {
            this.$hMessage.error({
              content: this.$t("m.i.common.netError") + error,
              duration: 5,
              closable: true
            });
          });
        }
      }
    },
    computed: {
      tempDetilWin: {
        get() {
          return this.showmsg;
        },
        set() {
        }
      }
    }
  };
</script>
