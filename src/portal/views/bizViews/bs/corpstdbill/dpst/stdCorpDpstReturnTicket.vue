<!--存托-存托退票-->
<template>
  <div>
    <h-msg-box v-model="tempStdCorpDpstReturnTicketWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-table-layer" top="10" >
      <p slot="header">
        <span>存托退票详情</span>
      </p>
      <div  :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="dataGridFormItem" :label-width="90" ref="dataGridFormItem" cols="4" class="h-form-search">
          <!--标票产品名称-->
          <common-input v-model="dataGridFormItem.stdProductName" :label="$t('m.i.bs.stdProductName')"
                        prop="stdProductName"  readonly></common-input>
          <!--客户名称-->
          <common-input v-model="dataGridFormItem.custName" :label="$t('m.i.common.custName')"
                        prop="custName" :maxlength="150"></common-input>
          <!--客户账号-->
          <common-input v-model="dataGridFormItem.custAcctNo" :label="$t('m.i.common.custAcctNo')" :validRules="validAcctNoRules"
                        prop="custAcctNo"  :maxlength="32"></common-input>
          <bill-no v-model="dataGridFormItem.billNo"></bill-no>
          <bill-type v-model="dataGridFormItem.billType" :dictList="this.batchParams.billTypeList"></bill-type>
          <!--汇票到期日-->
          <common-date-picker v-model="dueDate" :label="$t('m.i.billInfo.dueDt')" type="daterange" :autoPlacement="true" @on-change="handleDueDateChange"></common-date-picker>
          <!--票据金额(元)-->
          <common-type-field-range v-model="dataGridFormItem" :label="$t('m.i.billInfo.billMoneyByUnit')" :integerNum="16" :suffixNum="2":validRules="billMoneyRule"
                                   :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false"></common-type-field-range>
          <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                     :formSearchReset="resetSearch"></query-btn>
        </h-form>
        <div > </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlightRow
          :bindForm="dataGridFormItem"
          :auto-load="false"
          :url="dataGridUrl"
          rowSelect
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="signBackTicket()">
              {{$t("m.i.bs.endorseRefuse")}}
            </h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :creationId="batchParams.batchId"></bill-info-main-std>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCorpDpstReturnTicket",
    components: {
      // StdCreationProduct:()=>import(/* webpackChunkName: "bs/corpstdbill/common/stdCreationProduct" */`@/views/bizViews/bs/corpstdbill/common/stdCreationProduct`),

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
        dataGridFormItem: {
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
        batchId: "",
        dataGridUrl: "",
        dueDate:[],
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
            title: this.$t('m.i.bs.stdProductName'),
            key: 'stdProductName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false,
            sortable: true
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
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: 'custAcctNo',
            hiddenCol: false,
            sortable: true
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
            sortable: true,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.batchParams.dictMap, 'DraftTypeCode', params.row.billType);
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
        //是否显示更多查询项
        ifShowMore: false,
        showBillInfoWin:false,
        billId:"",
        billNo:"",

      };
    },
    props: {
      stdCorpDpstReturnTicketWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempStdCorpDpstReturnTicketWin: {
        get() {
          return this.stdCorpDpstReturnTicketWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdCorpDpstReturnTicketWin(val) {
        if (val) {
          this.batchId = this.batchParams.batchId;
          this.dataGridFormItem.stdProductNo = this.batchParams.stdProductNo;
          this.dataGridFormItem.stdProductShortName = this.batchParams.stdProductShortName;
          this.dataGridFormItem.stdProductName = this.batchParams.stdProductName;
          this.dataGridFormItem.ecdsAcctNo = this.batchParams.ecdsAcctNo;
          this.dataGridFormItem.ecdsAcctName = this.batchParams.ecdsAcctName;
          if(this.batchParams.dataGridUrl){
            this.dataGridUrl = this.batchParams.dataGridUrl;
          }else{
            this.dataGridUrl = "/bs/corpstdbill/dpst/stdCorpDpstReturnApply/func_queryWaitSignBillPage";
          }
          this.$nextTick(() => {
              this.handleSearch();
          });
        }
      },
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        // this.$refs["dataGridFormItem"].validate(valid => {
        //   if (valid) {
            if (!this.dataGridFormItem.stdProductName||!this.dataGridFormItem.ecdsAcctNo) {
              this.$msgTip.error(this, { info: "查询条件标票产品名称或其对应的电票账号不能为空" });
              return;
            }
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
        //   }
        // });
      },
      //关闭弹窗
      handleClose() {
        this.$refs.dataGridFormItem.resetFields();
        this.dataGridFormItem.minDueDt="";
        this.dataGridFormItem.maxDueDt="";
        this.dataGridFormItem.stdProductNo="";
        this.dataGridFormItem.stdProductShortName="";
        this.dataGridFormItem.ecdsAcctNo="";
        this.dataGridFormItem.ecdsAcctName="";
        this.batchId="";
        this.dataGridUrl ="";
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("stdCorpDpstReturnTicketWinClose", "");
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDate=[];
        this.dataGridFormItem.minDueDt="";
        this.dataGridFormItem.maxDueDt="";
        this.$refs.dataGridFormItem.resetFields();
        this.dataGridFormItem.stdProductNo = this.batchParams.stdProductNo;
        this.dataGridFormItem.stdProductShortName = this.batchParams.stdProductShortName;
        this.dataGridFormItem.stdProductName = this.batchParams.stdProductName;
        this.dataGridFormItem.ecdsAcctNo = this.batchParams.ecdsAcctNo;
        this.dataGridFormItem.ecdsAcctName = this.batchParams.ecdsAcctName;
      },
      handleDueDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.dataGridFormItem.minDueDt = arr[0].replace(/-/g, "");
          this.dataGridFormItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0], arr[1]];
        } else {
          this.dataGridFormItem.minDueDt = "";
          this.dataGridFormItem.maxDueDt = "";
          this.dueDate = [];
        }
      },
      signBackTicket(){
        debugger;
        let list=this.$refs.datagrid.selects;
        if (!list||list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let url="/bs/corpstdbill/dpst/stdCreationReply/func_agreeStdCreation";
        let endorseSignOrRefuseDtos= [];
        for (let i=0;i<list.length;i++) {
          endorseSignOrRefuseDtos.push({billId:list[i].billId, transId: list[i].transId,msgId:list[i].msgId,billNo:list[i].billNo,ecdsAcctNo:list[i].ecdsAcctNo})
        }
        let params={endorseSignOrRefuseDtos:endorseSignOrRefuseDtos};
        this.$hMsgBox.confirm({
          title: "签收拒绝信息",
          content: "请确认将票据背书拒绝吗？",
          onOk: () => {
            this.sendPost(params,url);
          }
        });
      },
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            }
          } else {
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
