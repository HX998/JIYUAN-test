<!--同业额度查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.memberName')" prop="custName" :required="isRequired">
                  <h-input v-model="formItem.custName" readonly icon="android-search"
                           @on-click="queryCustName" clearable @on-clear="clearCustName()"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :highlight-row=false
            url="/pc/credit/creditFromBeOuter/func_queryCreditGrantInfoFromBeOuter"
            :bindForm="formItem"
            :rowSelect="true"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            :auto-load="isAutoLoad"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--查看会员-->
    <show-member :showMemberWin="showMemberWin" @memberWinClose="memberWinClose"
                 @memberSelect="memberSelect"></show-member>
  </div>
</template>

<script>
  import { on, off, post, formatNumber,getMoreParamValuesByKeys } from "@/api/bizApi/commonUtil";



  export default {
    name: "creditFromBeOuter",
    data() {
      return {
        defaultColumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.memberName'),
            key: "custName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.creditLimitAmt'),
            key: "creditLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              let creditLimitAmt = formatNumber(params.row.creditLimitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: creditLimitAmt
                }
              }, creditLimitAmt);
            }
          },
          {
            title: this.$t('m.i.pc.usedCreditAmt'),
            key: "usedCreditAmt",
            hiddenCol: false,
            render: (h, params) => {
              let usedCreditAmt = formatNumber(params.row.usedCreditAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: usedCreditAmt
                }
              }, usedCreditAmt);
            }
          },
          {
            title: this.$t('m.i.pc.doAmt'),
            key: "doAmt",
            hiddenCol: false,
            render: (h, params) => {
              let doAmt = formatNumber(params.row.doAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: doAmt
                }
              }, doAmt);
            }
          }
        ],
        autmentColumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.bankNo"),
            key: "memberBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.bankNameShort"),
            key: "memberBankName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.creditLimitAmt'),
            key: "creditLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              let creditLimitAmt = formatNumber(params.row.creditLimitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: creditLimitAmt
                }
              }, creditLimitAmt);
            }
          },
          {
            title: this.$t('m.i.pc.doAmt'),
            key: "doAmt",
            hiddenCol: false,
            render: (h, params) => {
              let doAmt = formatNumber(params.row.doAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: doAmt
                }
              }, doAmt);
            }
          },
          {
            title: this.$t('m.i.pc.usedCreditAmt'),
            key: "usedCreditAmt",
            hiddenCol: false,
            render: (h, params) => {
              let usedCreditAmt = formatNumber(params.row.usedCreditAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: usedCreditAmt
                }
              }, usedCreditAmt);
            }
          },
          {
            title:  this.$t("m.i.pc.creditDays"),
            key: 'creditDays',
            hiddenCol: true,
            sortable: true,
          },
          {
            title:  this.$t("m.i.pc.creditActiveDt"),
            key: 'activeDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.activeDt == null || params.row.activeDt === ""){
                return "";
              }
              let activeDt = this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", activeDt);
            }
          },
          {
            title:  this.$t("m.i.pc.creditFailureDt"),
            key: 'failureDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.failureDt == null || params.row.failureDt === ""){
                return "";
              }
              let failureDt = this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", failureDt);
            }
          },
        ],
        formItem : {
          memberId: "",
          custName: "",
          custBankNo:"",
        },
        currentSelectRow : null,
        columns : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        //查看会员弹出框
        showMemberWin : false,
        isRequired : true,
        isAutoLoad : false
      };
    },
    components: {
      ShowMember :()=>import(/* webpackChunkName: "shcpe/cpes/member/showMember" */`@/views/bizViews/shcpe/cpes/member/showMember`)
    },
    methods: {
      clearCustName() {
        this.formItem.memberId = "";
        this.formItem.custName = "";
      },
      //1-同业客户，查询会员信息
      queryCustName() {
        this.showMemberWin = true;
      },
      memberWinClose() {
        this.showMemberWin = false;
      },
      memberSelect(info) {
        this.formItem.memberId = info.memberId;
        this.formItem.custName = info.memberName;
        this.formItem.custBankNo = info.memberBankNo;
        this.showMemberWin = false;
      },
      formSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      formSearchReset() {
        this.formItem.memberId = "";
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      }
    },
    created() {
      getMoreParamValuesByKeys("pc.credit.out_be_credit_query_pds").then(res => {
        let idAudit = res['pc.credit.out_be_credit_query_pds'];
        if(idAudit === '1'){
          this.columns=this.autmentColumns;
          this.isRequired = false;
          this.$nextTick(() => {
            this.formSearch();
          })
        } else {
          this.$refs.datagrid.createColumns(this.defaultColumns);
        }
      });
    }
  };
</script>

<style scoped>

</style>
