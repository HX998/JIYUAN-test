<!--贴现通挂牌-新增、修改弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempDiscListingDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span >挂牌详情</span>
      </p>
      <div>
        <div class="text-body">
          <listing-detail :anonyApplyDetailWin="anonyApplyDetailWin":viewDatailForm="viewDatailForm" :batchParams="batchParams" ></listing-detail>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          :url="dataGridUrl"
          :bindForm="dataGridFormItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">

            <h-button type="primary" @click="showAttach()" v-if="batchParams.batchType!=='show'">
              {{$t("m.i.common.showAttach")}}
            </h-button>
            <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :batchId="batchId" operType="show" @showFileWinClose="showFileWinClose"
                   sourceType="DBL" :filePathUrl="filePathUrl"></show-file-win>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { post, formatNumber ,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "discListingDetail",
    components: {
      ListingDetail: () => import(/* webpackChunkName: "be/discquote/broker/listing/listingDetail"*/"@/views/bizViews/be/discquote/broker/listing/listingDetail"),
      ShowFileWin: () => import(/* webpackChunkName: "be/discquote/file/showFileWin" */`@/views/bizViews/be/discquote/file/showFileWin`)
    },
    data() {
      return {
        batchId: "",
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        viewDatailForm: {
          id: "",
          busiType: "",
          batchNo:"",
          busiNo:"",
          batchStatus:"",
          brokerBrchName: "",
          brokerBrchCode:"",
          brokerBankNo:"",
          brokerTraderName: "",
          brokerTraderNo:"",
          discCustName:"",
          discOutSocCode:"",
          discCorpScale:"",
          discIndustry:"",
          isDiscArc:"",
          isDiscGreenCorp:"",
          isDiscTechnologyCorp:"",
          isDiscPrivateCorp:"",
          area:"",
          billType: "",
          billClass: "",
          isBargain:"",
          clearMode:"",
          clearSpeed:"",
          firstSettleDt:"",
          ratePct: "",
          discOutBankNo:"",
          respTm:"",
          transCustType:"",
          transCustTypeName:"",
          eliminateCpBrchType:"",
          eliminateCpBrchTypeName:"",
          totalAmt: "",
          totalNum:"",
          firstPayInterest:"",
          firstSettleAmt:"",
          remainDays:"",
          fileNum:"",
          listingRemark:"",
        },
        dataGridFormItem: {
          batchId: ""
        },
        columns: [
         /* {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },*/
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueMatDt"),
            key: "dueMatDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },

          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.remainingPeriod"),
            key: "remainDays",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "firstPayInterest",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "firstSettleAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.ce.discountApplyAcctNo"),
            key: "discFundsInAcctNo",
            hiddenCol: false
          },
        ],
        showFileWin: false,
        tempShowExcelTemplateWin: false,
        param: "",
        rows: "",
        filePathUrl: ""
      };
    },
    props: {
      anonyApplyDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      dataGridUrl: {
        type: String,
        default() {
          return "/be/discquote/broker/listing/discListingApplyMain/func_queryDiscListingBillPage";
        }
      },
      exportUrl: {
        type: String,
        default() {
          return "/be/discquote/broker/listing/discListingApplyMain/func_exportDiscListingBill";
        }
      },
      batchUrl: {
        type: String,
        default() {
          return "/be/discquote/broker/listing/discListingApplyMain/func_editDiscListing";
        }
      }
    },
    computed: {
      tempDiscListingDetailWin: {
        get() {
          return this.anonyApplyDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      anonyApplyDetailWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.batchId=this.batchId;
            this.filePathUrl = this.batchParams.filePathUrl;
            this.queryObjById();
            this.handleSearch();
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = this.batchUrl;
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.viewDatailForm.id = obj.id;
              this.viewDatailForm.busiType = obj.busiType;
              this.viewDatailForm.batchNo = obj.batchNo;
              this.viewDatailForm.busiNo = obj.busiNo;
              this.viewDatailForm.batchStatus = obj.batchStatus;
              this.viewDatailForm.brokerBrchName = obj.brokerBrchName;
              this.viewDatailForm.brokerBrchCode = obj.brokerBrchCode;
              this.viewDatailForm.brokerBankNo = obj.brokerBankNo;
              this.viewDatailForm.brokerTraderName = obj.brokerTraderName;
              this.viewDatailForm.brokerTraderNo = obj.brokerTraderNo;
              this.viewDatailForm.discCustName = obj.discCustName;
              this.viewDatailForm.discOutSocCode = obj.discOutSocCode;
              this.viewDatailForm.discCorpScale = obj.discCorpScale;
              this.viewDatailForm.discIndustry = obj.discIndustry;
              this.viewDatailForm.isDiscArc = obj.isDiscArc;
              this.viewDatailForm.isDiscGreenCorp = obj.isDiscGreenCorp;
              this.viewDatailForm.isDiscTechnologyCorp = obj.isDiscTechnologyCorp;
              this.viewDatailForm.isDiscPrivateCorp = obj.isDiscPrivateCorp;
              this.viewDatailForm.area = obj.area;
              this.viewDatailForm.billType = obj.billType;
              this.viewDatailForm.billClass = obj.billClass;
              this.viewDatailForm.isBargain = obj.isBargain;
              this.viewDatailForm.clearMode = obj.clearMode;
              this.viewDatailForm.clearSpeed = obj.clearSpeed;
              this.viewDatailForm.firstSettleDt = obj.firstSettleDt === null ? "" : obj.firstSettleDt.toString();
              this.viewDatailForm.ratePct = obj.ratePct;
              this.viewDatailForm.discOutBankNo = obj.discOutBankNo;
              this.viewDatailForm.respTm = obj.respTm;
              this.viewDatailForm.transCustType = obj.transCustType;
              this.viewDatailForm.transCustTypeName = obj.transCustTypeName?obj.transCustTypeName.replace(/,/g, "┃"):"";
              this.viewDatailForm.eliminateCpBrchType = obj.eliminateCpBrchType;
              this.viewDatailForm.eliminateCpBrchTypeName = obj.eliminateCpBrchTypeName? obj.eliminateCpBrchTypeName.replace(/,/g, "┃"):"";
              this.viewDatailForm.totalAmt = obj.totalAmt=== null ?"":obj.totalAmt.toString();
              this.viewDatailForm.totalNum = obj.totalNum;
              this.viewDatailForm.firstPayInterest = obj.firstPayInterest=== null ?"":obj.firstPayInterest.toString();
              this.viewDatailForm.firstSettleAmt = obj.firstSettleAmt=== null ?"":obj.firstSettleAmt.toString();
              this.viewDatailForm.remainDays = obj.remainDays;
              this.viewDatailForm.fileNum = obj.fileNum;
              this.viewDatailForm.listingRemark = obj.listingRemark;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.viewDatailForm.id = "";
        this.batchId = "";
        this.dataGridFormItem.batchId="";
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("anonyApplyDetailWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //查看附件
      showAttach() {
        if (this.batchId) {
          this.showFileWin = true;
        }else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      showFileWinClose() {
        this.showFileWin = false;
      },
      listExport() {
        this.param = "discListingBillExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + this.exportUrl;
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            batchId: this.batchId,
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = {
            batchId: this.batchId
          };
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },
    }
  };
</script>

<style scoped>

</style>
