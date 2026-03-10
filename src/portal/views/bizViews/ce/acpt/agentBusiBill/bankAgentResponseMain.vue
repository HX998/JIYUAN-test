<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                  <h-form-item  :label="$t('m.i.billInfo.billNo')" prop="billNo">
                    <h-input v-model="formItem.billNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDate">
                    <h-date-picker type="daterange" v-model="formItem.dueDate" format="yyyy-MM-dd" @on-change="changeDate" showFormat placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoneyItem" >
                    <h-row>
                      <h-col span="11">
                        <h-typefield  v-model="formItem.minBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
                      </h-col>
                      <h-col span="2" style="text-align: center">至</h-col>
                      <h-col span="11">
                        <h-typefield  v-model="formItem.maxBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
                      </h-col>
                    </h-row>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.prsttnDt')" prop="prsttnDate">
                    <h-date-picker type="daterange" v-model="formItem.prsttnDate" format="yyyy-MM-dd" @on-change="changeDate2" showFormat placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item  :label="$t('m.i.ce.prsttnName')" prop="prsttnName" :label-width="100">
                    <h-input v-model="formItem.prsttnName" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pe.deductDt')" prop="deductDate">
                    <h-date-picker type="daterange" v-model="formItem.deductDate" format="yyyy-MM-dd" @on-change="changeDate3" showFormat placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.deductFlag')" prop="deductFlag">
                    <h-select v-model="formItem.deductFlag" placeholder="" >
                      <h-option v-for="item in corpDeductFlagList" :value="item.key" :key="item.key">{{item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.replyFlag')" prop="signFlag">
                    <h-select v-model="formItem.signFlag" placeholder="">
                      <h-option value="SU00">签收成功</h-option>
                      <h-option value="SU10">签收失败</h-option>
                      <h-option value="SU01">拒绝签收成功</h-option>
                      <h-option value="SU11">拒绝签收失败</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :bindForm="formItem"
            url="/ce/acpt/agentBusiBill/bankAgentResponseMain/pagingQueryCorpBillDeducts"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on,off, formatNumber, accMul } from "@/api/bizApi/commonUtil";

    export default {
      name: "bankAgentResponseMain",
      components: {

      },
      data() {
          return{
            ifShowMore : false,
            dictMap : new Map(),
            corpDeductFlagList: [],
            formItem : {
              billNo:"",
              dueDate:"",
              prsttnDate:"",
              deductDate:"",
              minDueDt:"",
              maxDueDt:"",
              minBillMoney:"",
              maxBillMoney:"",
              minTransApplDt:"",
              maxTransApplDt:"",
              minTransSignDt:"",
              maxTransSignDt:"",
              prsttnName:"",
              deductFlag:"",
              signFlag:"",
              minDeductDt:"",
              draftNo:"034",
              billType:"AC02",
              billClass:"ME02",
              maxDeductDt:""
            },
            columns : [
              {
                title: this.$t("m.i.common.index"),
                type: 'index',
                align: 'center',
                hiddenCol: false
              },
              {
                title: this.$t("m.i.billInfo.billNo"),
                key: "billNo",
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.billType"),
                key: "billType",
                hiddenCol: false,
                sortable: true,
                render: (h, params) => {
                  let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                  return h("span",
                    {
                      domProps: {
                        title: list
                      }
                    }, list);
                }
              },
              {
                title: this.$t("m.i.billInfo.drwrName"),
                key: "drwrName",
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.remitDt"),
                key: 'remitDt',
                hiddenCol: false,
                sortable: true,
                render: (h, params) => {
                  if (params.row.remitDt == null || params.row.remitDt === "" || params.row.remitDt === 0 ) {
                    return "";
                  }
                  let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.billInfo.dueDt"),
                key: 'dueDt',
                hiddenCol: false,
                sortable: true,
                render: (h, params) => {
                  if (params.row.dueDt == null || params.row.dueDt === "" || params.row.dueDt === 0 ) {
                    return "";
                  }
                  let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.billInfo.acptName"),
                key: "acptName",
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.ce.prsttnDt"),
                key: 'transApplDt',
                hiddenCol: false,
                sortable: true,
                render: (h, params) => {
                  if (params.row.transApplDt == null || params.row.transApplDt === "" || params.row.transApplDt === 0 ) {
                    return "";
                  }
                  let date = this.$moment(params.row.transApplDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.pe.deductDt"),
                key: 'deductDt',
                hiddenCol: false,
                sortable: true,
                render: (h, params) => {
                  if (params.row.deductDt == null || params.row.deductDt === "" || params.row.deductDt === 0 ) {
                    return "";
                  }
                  let date = this.$moment(params.row.deductDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title:this.$t("m.i.billInfo.billMoney"),
                key: "billMoney",
                hiddenCol:false,
                sortable: true,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.billMoney, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.ce.prsttnApplAcctNo"),
                key: "prsttnAcctNo",
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.ce.prsttnApplName"),
                key: "prsttnName",
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.ce.prsttnApplBankNo"),
                key: "prsttnBankNo",
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.ce.prsttnApplBankName"),
                key: "prsttnBankName",
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.ce.clearMark"),
                key: "onlineMark",
                hiddenCol: false,
                render: (h, params) => {
                  let list = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.onlineMark);
                  return h("span",
                    {
                      domProps: {
                        title: list
                      }
                    }, list);
                }
              },
              {
                title: this.$t("m.i.ce.overdueReason"),
                key: "overdueReason",
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.common.remark"),
                key: "remark",
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.ce.deductFlag"),
                key: "deductFlag",
                hiddenCol: false,
                render: (h, params) => {
                  let list = this.getDictValueFromMap(this.dictMap, "CorpDeductFlag", params.row.deductFlag);
                  return h("span",
                    {
                      domProps: {
                        title: list
                      }
                    }, list);
                }
              },
              {
                title: this.$t("m.i.ce.replyFlag"),
                key: "signFlag",
                hiddenCol: false,
                render: (h, params) => {
                  let result = "";
                  if(params.row.signFlag === "SU00"){
                    result = "签收成功";
                  }
                  else if(params.row.signFlag === "SU10"){
                    result =  "签收失败";
                  }
                  else if(params.row.signFlag === "SU01"){
                    result = "拒绝签收成功";
                  }else if((params.row.signFlag === "SU11")){
                    result = "拒绝签收失败";
                  }else {
                    result = "未应答";
                  }
                  return h("span",
                    {
                      domProps: {
                        title: result
                      }
                    }, result);
                }
              },
            ]
          }

         },
      methods: {
        changeDate(date){
          if (date!=null && date.length>0){
            this.formItem.minDueDt=date[0].replace(/-/g,"");
            this.formItem.maxDueDt=date[1].replace(/-/g,"");
          } else {
            this.formItem.minDueDt="";
            this.formItem.maxDueDt="";
          }
        },

        changeDate2(date){
          if (date!=null && date.length>0){
            this.formItem.minTransApplDt=date[0].replace(/-/g,"");
            this.formItem.maxTransApplDt=date[1].replace(/-/g,"");
          } else {
            this.formItem.minTransApplDt="";
            this.formItem.maxTransApplDt="";
          }
        },

        changeDate3(date){
          if (date!=null && date.length>0){
            this.formItem.minDeductDt=date[0].replace(/-/g,"");
            this.formItem.maxDeductDt=date[1].replace(/-/g,"");
          } else {
            this.formItem.minDeductDt="";
            this.formItem.maxDeductDt="";
          }
        },
        formSearch(){
          this.$refs.datagrid.dataChange(1);
        },
        formSearchReset() {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.formItem.minBillMoney = "";
          this.formItem.maxBillMoney = "";
          this.formItem.minTransApplDt = "";
          this.formItem.maxTransApplDt = "";
          this.formItem.minTransSignDt = "";
          this.formItem.maxTransSignDt = "";
          this.formItem.signFlag = "";
          this.$refs.formItem.resetFields();
        },
      },
      created() {

      },
      mounted() {
        this.getDictListByGroups("DraftTypeCode,CDMedia,SettlementMarkCode,CorpDeductFlag,SettleType").then(res => {
          this.corpDeductFlagList = res.get("CorpDeductFlag");
          this.dictMap = res.get("map");
        });
      }
    };
</script>

<style scoped>

</style>
