<!--贴现通-挑票-->
<template>
  <div>
    <h-msg-box v-model="tempPickBillWin" :mask-closable="false" @on-close="pickBillClose" :maximize="true" width="1000"
               class="h-form-table-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <!--票据种类-->
          <bill-type v-model="formItem.billType" :dictList="pickBillParams.billTypeList" :readonly="this.pickBillParams.pickType!=='discEntrustRelBill'"></bill-type>
          <!--票据介质-->
          <bill-class v-model="formItem.billClass" :dictList="pickBillParams.billClassList" v-if="this.pickBillParams.pickType&&this.pickBillParams.pickType!=='discEntrustRelBill'" :readonly="true" ></bill-class>
          <!--最小委托利率上限(%)-->
          <common-input v-model="formItem.minEntrustMaxRatePct" :label="$t('m.i.be.minEntrustMaxRatePct')" v-if="this.pickBillParams.pickType&&this.pickBillParams.pickType!=='discEntrustRelBill'" :readonly="true"  class="h-form-long-label"></common-input>
          <!--最大委托日期-->
          <common-date-picker v-model="formItem.maxEntrustDate" :label="$t('m.i.be.maxEntrustDate')" v-if="this.pickBillParams.pickType&&this.pickBillParams.pickType!=='discEntrustRelBill'" :readonly="true"></common-date-picker>
          <!--最小委托截止日-->
          <common-date-picker v-model="formItem.minEntrustEndDate" :label="$t('m.i.be.minEntrustEndDate')" v-if="this.pickBillParams.pickType&&this.pickBillParams.pickType!=='discEntrustRelBill'" :readonly="true" class="h-form-long-label"></common-date-picker>
          <!--最大出票日-->
          <common-date-picker v-model="formItem.maxIssuDate" :label="$t('m.i.be.maxIssuDate')" v-if="this.pickBillParams.pickType&&this.pickBillParams.pickType!=='discEntrustRelBill'" :readonly="true"></common-date-picker>
          <!--最小票面到期日-->
          <common-date-picker v-model="formItem.minDueDateGreater" :label="$t('m.i.billInfo.minDueDate')"  v-if="this.pickBillParams.pickType&&this.pickBillParams.pickType!=='discEntrustRelBill'" :readonly="true"  class="h-form-long-label"></common-date-picker>
          <!--最大票面到期日-->
          <common-date-picker v-model="formItem.maxDueDate" :label="$t('m.i.billInfo.maxDueDate')" prop="maxDueDate" v-if="this.pickBillParams.pickType&&this.pickBillParams.pickType!=='discEntrustRelBill'" class="h-form-long-label"></common-date-picker>
          <!--票号模糊-->
          <h-form-item  prop="billNoLike" :label="$t('m.i.billInfo.billNo')" >
            <h-input v-model="formItem.billNoLike"></h-input>
          </h-form-item>
          <common-date-picker v-model="formItem.dueDateTem" :label="$t('m.i.billInfo.dueDt')" prop="dueDateTem" type="daterange"
                              :rangeValue="['minDueDate','maxDueDate']" v-if="this.pickBillParams.pickType&&this.pickBillParams.pickType==='discEntrustRelBill'"
                              :minDueDate.sync="formItem.minDueDate" :maxDueDate.sync="formItem.maxDueDate">
          </common-date-picker>
          <!--票面金额-->
          <bill-money-range v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" ></bill-money-range>
          <!--承兑人名称-->
          <acpt-name v-model="formItem.acptName" ></acpt-name>
          <query-btn @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
        </h-form>
        <h-datagrid
          :columns="pickColumns"
          :url="pickBillDatagridUrl"
          :auto-load="false"
          rowSelect
          :bindForm="formItem"
          :hasSelect="false"
          ref="pickBillDatagrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="pickBillClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="pickBillSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "entrustPickBill",
    components:{
    },
    data() {
      return {
        submitFlag: false,
        ifShowMore: false,
        formItem: {
          billType: "",
          billClass: "",
          minEntrustMaxRatePct:"",
          maxEntrustDate:"",
          minEntrustEndDate:"",
          maxIssuDate:"",
          minDueDateGreater:"",
          minDueDate:"",
          maxDueDate:"",
          billNo:"",
          minBillMoney:"",
          maxBillMoney:"",
          billNoLike:"",
          acptName:"",
          brokerBranchCode:"",
          discCustBankNo:"",
          discCustSocCode:"",
          dueDateTem:[]
        },
        pickColumns: [
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: false,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.ce.discountApplySocCode"),
            key: "discSocCode",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.be.discOutName"),
            key: "discCustName",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.be.entrustRegDate"),
            key: "rgstDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.rgstDt ? this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.ce.discountApplyAcctNo"),
            key: "discOutAcctNo",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.be.discOutBankNo"),
            key: "discOutBankNo",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.be.discOutBankName"),
            key: "discOutBankName",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.be.entrustDate"),
            key: "entrustDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.entrustDt ? this.$moment(params.row.entrustDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.entrustMaxRate"),
            key: "entrustMaxRatePct",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.be.entrustEndDate"),
            key: "entrustEndDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.entrustEndDt ? this.$moment(params.row.entrustEndDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.common.status"),
            key: "entrustStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "EnType", params.row.entrustStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        pickBillDatagridUrl:"/be/discquote/entrust/discEntrustRelApplyMain/func_queryDiscEntrustBillPage"
      };
    },
    props: {
      title: {
        type: String,
        default: "挑票页面"
      },
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      url:"",
      pickBillParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempPickBillWin: {
        get() {
          return this.pickBillWin;
        },
        set() {

        }
      }
    },
    watch: {
      pickBillWin(val) {
        if (val) {
          if(this.pickBillParams.pickBillDatagridUrl){
            this.pickBillDatagridUrl=this.pickBillParams.pickBillDatagridUrl;
          }
          this.$nextTick(() => {
            this.pickBillInit();
            this.$refs.pickBillDatagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.pickBillDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.$refs.pickBillDatagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.batchId = this.pickBillParams.batchId;
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.billClass = this.pickBillParams.billClass;
        this.formItem.minEntrustMaxRatePct  = this.pickBillParams.ratePct;
        this.formItem.maxEntrustDate  = this.pickBillParams.firstSettleDt;
        this.formItem.minEntrustEndDate = this.pickBillParams.firstSettleDt;
        this.formItem.maxIssuDate = this.pickBillParams.firstSettleDt;
        this.formItem.minDueDateGreater = this.pickBillParams.firstSettleDt;
        this.formItem.brokerBranchCode = this.pickBillParams.brokerBrchCode;
        this.formItem.discCustBankNo = this.pickBillParams.discOutBankNo;
        this.formItem.discCustSocCode = this.pickBillParams.discOutSocCode;
      },
      pickBillInit() {
        this.formItem.batchId = this.pickBillParams.batchId;
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.billClass = this.pickBillParams.billClass;
        this.formItem.minEntrustMaxRatePct  = this.pickBillParams.ratePct;
        this.formItem.maxEntrustDate  = this.pickBillParams.firstSettleDt;
        this.formItem.minEntrustEndDate = this.pickBillParams.firstSettleDt;
        this.formItem.maxIssuDate = this.pickBillParams.firstSettleDt;
        this.formItem.minDueDateGreater = this.pickBillParams.firstSettleDt;
        this.formItem.brokerBranchCode = this.pickBillParams.brokerBrchCode;
        this.formItem.discCustBankNo = this.pickBillParams.discOutBankNo;
        this.formItem.discCustSocCode = this.pickBillParams.discOutSocCode;
      },
      pickBillClose() {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.resetSearch();
        this.$emit("pickBillWinClose", "");
      },
      pickBillSubmit() {
        let list = this.$refs.pickBillDatagrid.selectIds;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let data = {
          batchId: this.pickBillParams.batchId,
          entrustBillIds: list,
          pickType:this.pickBillParams.pickType
        };
        post(data, this.pickBillParams.url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.pickBillClose();
              this.submitFlag = false;
            } else {
              this.submitFlag = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.submitFlag = false;
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
