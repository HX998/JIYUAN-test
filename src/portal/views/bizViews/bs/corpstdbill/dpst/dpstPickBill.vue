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
          <!--标票产品名称-->
          <common-input v-model="formItem.stdProductName" :label="$t('m.i.bs.stdProductName')"
                        prop="stdProductName"  readonly></common-input>
          <!--客户名称-->
          <common-input v-model="formItem.custName" :label="$t('m.i.common.custName')"
                        prop="custName" :maxlength="150"></common-input>
          <!--客户账号-->
          <common-input v-model="formItem.custAcctNo" :label="$t('m.i.common.custAcctNo')" :validRules="validAcctNoRules"
                        prop="custAcctNo" :maxlength="32"></common-input>

          <bill-no v-model="formItem.billNo"></bill-no>
          <bill-type v-model="formItem.billType" :dictList="billTypeList" readonly></bill-type>
          <!--汇票到期日-->
          <common-date-picker v-model="dueDate" :label="$t('m.i.billInfo.dueDt')" type="daterange" :autoPlacement="true" @on-change="handleDueDateChange" readonly></common-date-picker>
          <!--票据金额(元)-->
          <common-type-field-range v-model="formItem" :label="$t('m.i.billInfo.billMoneyByUnit')"  :integerNum="16" :suffixNum="2":validRules="billMoneyRule"
                                   :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false"></common-type-field-range>
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
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :creationId="pickBillParams.creationId"></bill-info-main-std>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "dpstPickBill",
    components:{
    },
    data() {
      return {
        billMoneyRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "创设规模上限(万元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        validAcctNoRules: [{
          test: /^[0-9a-zA-Z]{1,32}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为32位"
        }],
        submitFlag: false,
        ifShowMore: false,
        formItem: {
          stdProductNo: "",
          stdProductShortName:"",
          stdProductName:"",
          ecdsAcctNo:"",
          ecdsAcctName:"",
          billNo:"",
          billType:"",
          minBillMoney:"",
          maxBillMoney:"",
          minDueDt:"",
          maxDueDt:"",
          custName:"",
          custAcctNo:""
        },
        dueDate:[],
        billTypeList:[],
        pickColumns: [
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
            title: this.$t('m.i.bs.stdProductName'),
            key: 'stdProductName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.ecdsAcctNo'),
            key: 'ecdsAcctNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.custName'),
            key: 'custName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: 'custAcctNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.endrsmtApplDt'),
            key: 'endrsmtApplDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.endrsmtApplDt ? this.$moment(params.row.endrsmtApplDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.pickBillParams.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: 'drwrName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: 'acptName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },

        ],
        pickBillDatagridUrl:"/bs/corpstdbill/dpst/stdCorpDpstApply/func_queryWaitSignBillPage",
        showBillInfoWin:false,
        billId:"",
        billNo:"",
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
        default(){
          return {};
        }
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
          this.billTypeList=this.pickBillParams.billTypeList;
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
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.stdProductNo = this.pickBillParams.stdProductNo;
        this.formItem.stdProductShortName = this.pickBillParams.stdProductShortName;
        this.formItem.stdProductName = this.pickBillParams.stdProductName;
        this.formItem.ecdsAcctNo = this.pickBillParams.ecdsAcctNo;
        this.formItem.ecdsAcctName = this.pickBillParams.ecdsAcctName;
        this.formItem.minDueDt = this.pickBillParams.preBeginDueDt;
        this.formItem.maxDueDt = this.pickBillParams.preEndDueDt;
        let preBeginDueDt=this.$moment(this.pickBillParams.preBeginDueDt, "YYYYMMDD").format("YYYY-MM-DD");
        let preEndDueDt=this.$moment(this.pickBillParams.preEndDueDt, "YYYYMMDD").format("YYYY-MM-DD")
        this.dueDate = [preBeginDueDt, preEndDueDt];

      },
      handleDueDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDate = [];
        }
      },
      pickBillInit() {
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.stdProductNo = this.pickBillParams.stdProductNo;
        this.formItem.stdProductShortName = this.pickBillParams.stdProductShortName;
        this.formItem.stdProductName = this.pickBillParams.stdProductName;
        this.formItem.ecdsAcctNo = this.pickBillParams.ecdsAcctNo;
        this.formItem.ecdsAcctName = this.pickBillParams.ecdsAcctName;
        this.formItem.minDueDt = this.pickBillParams.preBeginDueDt;
        this.formItem.maxDueDt = this.pickBillParams.preEndDueDt;
        let preBeginDueDt=this.$moment(this.pickBillParams.preBeginDueDt, "YYYYMMDD").format("YYYY-MM-DD");
        let preEndDueDt=this.$moment(this.pickBillParams.preEndDueDt, "YYYYMMDD").format("YYYY-MM-DD")
        this.dueDate = [preBeginDueDt, preEndDueDt];
      },
      pickBillClose() {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.resetSearch();
        this.$emit("pickBillWinClose", "");
      },
      pickBillSubmit() {
        this.submitFlag=true;
        let list = this.$refs.pickBillDatagrid.selects;
        if (list.length === 0) {
          this.submitFlag=false;
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let data = {
          id: this.pickBillParams.batchId,
          endorseSignDtos: list
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
              this.handleSearch();
              this.$msgTip.error(this, { info: res.data.retMsg, width: "600"});
            }
          } else {
            this.submitFlag = false;
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo){
        this.billId=billId;
        this.billNo=billNo;
        this.showBillInfoWin=true;
      },
    }
  };
</script>

<style scoped>

</style>
