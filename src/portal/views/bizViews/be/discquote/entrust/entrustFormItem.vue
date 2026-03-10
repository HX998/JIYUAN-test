<!--委托登记/委托解除登记 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--批次号-->
    <common-input v-model="addForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo"
                  readonly  class="h-form-long-label"></common-input>
    <!--本方机构名称-->
    <common-input v-model="addForm.brokerBrchName" :label="$t('m.i.be.ownBrchName')" prop="brokerBrchName"
                  readonly required class="h-form-long-label"></common-input>
    <!--贴现申请人名称-->
    <common-input v-model="addForm.discCustName" :label="$t('m.i.be.discOutName')" prop="discCustName" readonly required showIcon @on-click="discCustSearchWinOpen()" class="h-form-long-label"></common-input>
    <!--贴现申请人社会信用代码-->
    <common-input v-model="addForm.discSocCode" :label="$t('m.i.ce.discountApplySocCode')" prop="discSocCode"
                  readonly required class="h-form-long-label"></common-input>
    <!--票据张数-->
    <common-input v-model="addForm.totalNum" :label="$t('m.i.be.totalNum')" prop="totalNum" readonly></common-input>

    <cust-info-search :custSearchWin="custSearchWin" :brchCode="brokerBrchCode" @custSearchChange="discCustSearchChange"
                      @custSearchWinClose="discCustSearchWinClose" :batchParams="batchParams"> </cust-info-search>

  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "entrustFormItem",
    components: {
      CustInfoSearch: () => import(/* webpackChunkName: "be/discquote/cust/custInfoSearch" */`@/views/bizViews/be/discquote/cust/custInfoSearch`)
    },
    data() {
      return {
        custSearchWin:false,
        brokerBrchCode:"",
      }
    },
    props: {
      addForm: {
        type: Object,
        default() {
          return {};
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    methods:{
      //贴现申请人弹出选择框
      discCustSearchWinOpen(){
        this.brokerBrchCode=this.addForm.brokerBrchCode;
        this.custSearchWin=true;
      },
      discCustSearchChange(info){
        this.addForm.discCustName = info.discCustName;
        this.addForm.discSocCode = info.discSocCode;
      },
      discCustSearchWinClose(){
        this.brokerBrchCode="";
        this.custSearchWin=false;
      }

    }
  };
</script>

<style scoped>

</style>
