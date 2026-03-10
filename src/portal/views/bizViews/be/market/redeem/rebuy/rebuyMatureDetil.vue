<template>
  <div>
    <h-msg-box maximize v-model="tempDetilWin" width="1000" @on-close="handleClose">
      <p slot="header">
        <span>查看票据明细</span>
      </p>
      <div class="text-wrap">
        <div class="text-body">
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.busiType")}}：</h-col>
                <h-col span="15" class="val">{{format("QuoteBusiType",viewDatailForm.busiType)}}</h-col>
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
                <h-col span="15" class="val">{{viewDatailForm.buyBrchName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.otherBrchName")}}：</h-col>
                <h-col span="15" class="val">{{viewDatailForm.saleBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.custBrchCode")}}：</h-col>
                <h-col span="15" class="val">{{viewDatailForm.saleBrchCode}}</h-col>
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
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.totalAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.orginBuyBackTotalAmt")}}：</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.buyBackTotalAmt)}}</h-col>
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
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.redeemSumAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.redeemSumBuyTotalAmt")}}：</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.redeemSumBuyTotalAmt)}}</h-col>
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
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.dueInterest)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                  <h-col span="9" class="label">{{$t("m.i.be.trialDueInterest")}}：</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.dueSettleAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.duePayInterest")}}：</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.duePayInterest)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.duePayAmt")}}：</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.duePayAmt)}}</h-col>
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
        </div>
      </div>
      <h-datagrid
        :columns="billColumns"
        :auto-load="false"
        highlight-row
        :height="350"
        :notSetWidth="true"
        :bindForm="billFormItem"
        :url="billListURL"
        ref="billDatagrid"
      >
        <div slot="toolbar">
          <h-button type="primary" @click="exportTable">{{$t("m.i.common.exportData")}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer"></div>

      <bill-info-main
        @billInfoWinClose="billInfoWinClose"
        :showBillInfoWin="showBillInfoWin"
        :billId="billId"
        :billNo="billNo"
        :billRangeStart="billRangeStart"
        :billRangeEnd="billRangeEnd"
      ></bill-info-main>
    </h-msg-box>
  </div>
</template>
<script>
  import {
    getDictListByGroups,
    getDictValueFromMap, formatNumber,
    post,formatBillRange
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyMatureDetil",
    data() {
      return {
        billColumns: [
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
            hiddenCol: false

          }
        ],
        // 分页切换配置
        pageSizeOpts: [10, 20, 50, 200],
        viewDatailForm: {
          id: "",
          batchNo: "",    //批次号
          dealNo: "",     //成交单编号
          busiType: "",   //业务类型
          buyBrchName: "",   //本方机构名称
          saleBrchCode: "",    //对方机构代码
          saleBrchName: "",    //对方机构名称
          billType: "",       //票据种类
          billClass: "",      //票据介质
          dueSettleDt: "",    //原到期结算日
          applDt: "",         //申请日期
          redeemType: "",     //赎回类别
          rate: "",           //原交易利率
          dueRate: "",        //赎回(到期)利率
          ratePct: "",        //原交易利率(百分比)
          dueRatePct: "",     //赎回(到期)利率(百分比)
          totalAmt: "",        //原票据总额
          buyBackTotalAmt: "",    //回购总金额
          totalNum: "",          //原票据张数
          redeemSumAmt: "",      //票据总额(赎回总金额)
          redeemSumBuyTotalAmt: "",     //赎回回购总金额
          redeemSumNum: "",          //票据张数(赎回总笔数)
          dueInterest: "",        //试算利息
          dueSettleAmt: "",        //试算结算金额
          duePayInterest: "",     //实付利息
          duePayAmt: "",          //实付结算金额
          reqDealOpin: "",       //发起方处理意见
          reqRemark: "",        //申请备注
          sgnOpin: "",          //应答方处理意见
          respRemark: "",         //应答备注
          minDueRate: "",          //赎回最小利率
          maxDueRate: "",          //赎回最大利率
          productMapDict: ""
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
        "QuoteBusiType,CDMedia,DraftTypeCode,RedeemType,RedeemReason,BillOrigin"
      ).then(res => {
        this.dictMap = res.get("map");
      });
      //this.init();
    },
    components: {},
    props: {
      batchId: {
        type: String,
        required: true
      },
      billListURL: {
        type: String,
        default() {
          return "/be/market/redeem/rebuy/rebuyMatureApplyMain/func_queryRebuyMatureBillList";
        }
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
      formatDate(value) {
        return value
          ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD")
          : "";
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      exportTable() {
        if (this.$refs.billDatagrid.total > 0) {
          let url =
            window.LOCAL_CONFIG.API_HOME + "/be/market/redeem/rebuy/func_downloadInfo";
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
          post(
            { id: this.batchId },
            "/be/market/redeem/rebuy/queryRebuyMatureInfo"
          ).then(res => {
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
