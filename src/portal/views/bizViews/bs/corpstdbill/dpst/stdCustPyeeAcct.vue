<!--贴现通-挑票-->
<template>
  <div>
    <h-msg-box v-model="tempCustPyeeAcctWin" :mask-closable="false" @on-close="custPyeeAcctClose" :maximize="true" width="1000"
               class="h-form-table-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <!--客户名称-->
          <common-input v-model="formItem.custName" :label="$t('m.i.common.custName')"
                        prop="custName" :maxlength="150"></common-input>
          <!--客户组织机构代码-->
          <common-input v-model="formItem.custOrgCode" :label="$t('m.i.common.orgCode')" prop="custOrgCode"
                        :maxlength="10"  :validRules="orgCodeRule" ></common-input>

          <query-btn @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch" :advanceShow="false" formClassAdd="2"></query-btn>
        </h-form>
        <h-datagrid
          :columns="columns"
          :url="datagridUrl"
          :auto-load="false"
          rowSelect
          :bindForm="formItem"
          :hasSelect="false"
          :hasPage = "false"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="setAcct()">
              {{$t("m.i.bs.setAcct")}}
            </h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <h-msg-box v-model="setAcctWin" width="800" :mask-closable="false" @on-close="setAcctWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span >设置账号</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="120" ref="addOrEditForm" cols="2" class="h-form-search">
          <!--客户收款账号-->
          <common-input v-model="addOrEditForm.custPyeeAcctNo" :label="$t('m.i.bs.custPyeeAcctNo')" prop="custPyeeAcctNo"
                        :maxlength="32"  :validRules="validAcctNoRules" :required="true"></common-input>
          <!--收款账号开户行行号-->
          <common-input v-model="addOrEditForm.custPyeeBankNo" :label="$t('m.i.bs.custPyeeBankNo')" prop="custPyeeBankNo" class="h-form-long-label"
                        :maxlength="12"  :validRules="validBankNoRules" :required="true"></common-input>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="setAcctWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="setAcctSubmit">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <h-msg-box v-model="billAcctWin"  width="800" :mask-closable="false" @on-close="billAcctWinClose"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximizeBillAcct">
      <p slot="header">
        <span>票据收款账号详情</span>
      </p>
      <div>
        <h-datagrid
          :columns="billAcctColumns"
          :url="billAcctDatagridUrl"
          :auto-load="false"
          rowSelect
          :bindForm="billAcctFormItem"
          :hasSelect="false"
          ref="datagridBillAcct">
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCustPyeeAcct",
    components:{
    },
    data() {
      return {
        orgCodeRule: [{
          test: /^[0-9A-Z]{8}\-[0-9A-Z]$/,
          trigger: "blur",
          message: "组织机构代码由8位数字或大写字母加上一个“-”再加上一位数字或大写字母组成"
        }],
        validAcctNoRules: [{
          test: /^[0-9a-zA-Z]{1,32}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为32位"
        }],
        validBankNoRules: [{
          test:  /^[0-9]{12}$/,
          trigger: "blur",
          message: "只能输入数字母,且长度为12位"
        }],

        submitFlag: false,
        ifShowMore: false,
        formItem: {
          custName:"",
          custOrgCode:"",
          batchId:"",
          creationId:"",
        },
        addOrEditForm:{
          custPyeeAcctNo:"",
          custPyeeBankNo:"",
          batchId:"",
          creationId:"",
          stdCorpDpstBillCustDtos:{}
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
            title: this.$t('m.i.common.custName'),
            key: 'custName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.orgCode'),
            key: 'custOrgCode',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custBankNo'),
            key: 'custBankNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custPyeeAcctNo'),
            key: 'custPyeeAcctNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custPyeeBankNo'),
            key: 'custPyeeBankNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custPyeeAcctNoIsAgree'),
            key: 'result',
            hiddenCol: false,
            render: (h, params) => {
              let result = params.row.result;
              if(result==="1"){
                return h("span", {
                  domProps: {
                    title: "不一致"
                  },
                  style: {
                    color: 'red'
                  }
                }, "不一致");
              }else{
                return h("span", {
                  domProps: {
                    title: "一致"
                  }
                }, "一致");
              }

            }
          },
          {
            title: this.$t('m.i.be.totalAmtByYUAN'),
            key: 'sumAmt',
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.sumAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.totalCount'),
            key: 'sumNum',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billAcctWinOpen(params.row.custOrgCode, params.row.custBankNo);
                  }
                }
              }, params.row.sumNum)
            }
          },
        ],
        datagridUrl:"/bs/corpstdbill/dpst/stdCorpDpstApply/func_queryStdCorpDpstBillCustGroup",
        setAcctWin:false,
        billAcctWin:false,
        billAcctColumns:[
        //   {
        //   type: "selection",
        //   width: 50,
        //   hiddenCol: false,
        //   align: "center"
        // },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center"
        },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: 'billNo',
            hiddenCol: false
          },
        {
          title: this.$t('m.i.common.custName'),
          key: 'custName',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.orgCode'),
          key: 'custOrgCode',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custAcctNo'),
          key: 'custAcctNo',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bs.custBankNo'),
          key: 'custBankNo',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bs.custPyeeAcctNo'),
          key: 'custPyeeAcctNo',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bs.custPyeeBankNo'),
          key: 'custPyeeBankNo',
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
          key: "billMoney",
          hiddenCol: false,
          render: (h, params) => {
            return h("p", formatNumber(params.row.billMoney, 2, ","));
          }
        },
        ],
        billAcctDatagridUrl:"bs/corpstdbill/dpst/stdCorpDpstApply/func_queryStdCorpDpstBillPage",
        billAcctFormItem:{
          batchId:"",
          custOrgCode:"",
          custBankNo:"",
          batchType:"billAcct"
        }
      };
    },
    props: {
      title: {
        type: String,
        default: "收款账号设置页面"
      },
      custPyeeAcctWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      url:"",
      custPyeeAcctParams: {
        type: Object,
        default(){
          return {};
        }
      }
    },
    computed: {
      tempCustPyeeAcctWin: {
        get() {
          return this.custPyeeAcctWin;
        },
        set() {

        }
      }
    },
    watch: {
      custPyeeAcctWin(val) {
        if (val) {
          if(this.custPyeeAcctParams.datagridUrl){
            this.datagridUrl=this.custPyeeAcctParams.datagridUrl;
          }
          this.formItem.creationId = this.custPyeeAcctParams.creationId;
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      onMaximizeBillAcct(){
        setTimeout(() => {
          this.$refs.datagridBillAcct.$refs.gridContent.handleResize();
        }, 100);
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.creationId = this.custPyeeAcctParams.creationId;
      },
      custPyeeAcctClose() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.resetSearch();
        this.$emit("custPyeeAcctClose", "");
      },
      setAcct(){
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let custOrgCode="";
        for (let i = 0; i < list.length; i++) {
          let custOrgCodeTem = list[i].custOrgCode;
          if(!custOrgCode){
            custOrgCode=custOrgCodeTem;
          }else{
            if(custOrgCode!==custOrgCodeTem){
              this.$msgTip.info(this, { info: this.$t("m.i.bs.acctNoAndBankNoIsAgree") });
              return
            }
          }
        }
        if(list.length===1){
          this.addOrEditForm.custPyeeAcctNo=list[0].custPyeeAcctNo;
          this.addOrEditForm.custPyeeBankNo=list[0].custPyeeBankNo;
        }
        this.addOrEditForm.creationId=this.formItem.creationId;
        this.addOrEditForm.stdCorpDpstBillCustDtos=list;
        this.setAcctWin = true;
      },
      setAcctWinClose(){
        this.addOrEditForm.creationId="";
        this.addOrEditForm.stdCorpDpstBillCustDtos={};
        this.addOrEditForm.custPyeeAcctNo="";
        this.addOrEditForm.custPyeeBankNo="";
        this.addOrEditForm.batchId="";
        this.setAcctWin = false;
      },
      setAcctSubmit(){
        this.submitFlag=true;
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            debugger
            let url = "/bs/corpstdbill/dpst/stdCorpDpstApply/func_saveCustPyeeAcctNo";
            let data ={ creationId:this.addOrEditForm.creationId,
                        custPyeeAcctNo:this.addOrEditForm.custPyeeAcctNo,
                        custPyeeBankNo:this.addOrEditForm.custPyeeBankNo,
                        stdCorpDpstBillCustDtos:this.addOrEditForm.stdCorpDpstBillCustDtos};
            post(data, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let retData=res.data.retData;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.setAcctWinClose();
                  this.handleSearch();
                  this.submitFlag=false;
                } else {
                  this.submitFlag=false;
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.submitFlag=false;
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }else{
            this.submitFlag=false;
          }
        });
      },
      billAcctWinOpen(custOrgCode,custBankNo){
        this.billAcctFormItem.custBankNo=custBankNo;
        this.billAcctFormItem.custOrgCode=custOrgCode;
        this.billAcctFormItem.batchId=this.formItem.creationId;
        this.billAcctWin = true;
        this.$nextTick(() => {
          this.$refs.datagridBillAcct.dataChange(1);
        });
      },
      billAcctWinClose(){
        this.billAcctFormItem.custBankNo="";
        this.billAcctFormItem.custOrgCode="";
        this.billAcctFormItem.batchId="";
        this.billAcctWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
