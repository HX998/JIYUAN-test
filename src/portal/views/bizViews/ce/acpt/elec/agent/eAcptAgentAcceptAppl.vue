<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/ce/acpt/elec/agent/eAcptAgentAcceptAppl/func_queryPageAcptBatchAndBill"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="acceptance()" >{{$t('m.i.ce.acceptance')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import {
    accMul,
    formatBillRange,
    formatNumber,
    getDictListByGroups,
    getDictValueFromMap,
    post
  } from "@/api/bizApi/commonUtil";
  export default {
      name: "eAcptAgentAcceptAppl",
      components: {
        ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      },
      data() {
        return {
          billId: "",
          billRangeStart:"",
          billRangeEnd:"",
          formItem: {
            reverseBillNo:"",
            billClass: 'ME02',
            curFuncNo: 'PICE010311',
          },
          columns : [
            {
              type: 'selection',
              key: 'multiSelect',
              width: 60,
              hiddenCol: false,
            },
            {
              type: 'index',
              key: 'numOrder',
              title: this.$t("m.i.common.index"),
              width: 60,
              align: 'center',
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.billOrigin"),
              align:'center',
              hiddenCol: false,
              render:(h,params) => {
                let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t("m.i.billInfo.billPackageNo"),
              key: 'billNo',
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let billNo = "";
                if (params.row.billNo === null || params.row.billNo === "") {
                  billNo = "查看票面";
                }else {
                  billNo = params.row.billNo;
                }
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row);
                    }
                  }
                }, billNo);
              }
            },
            {
              title: this.$t("m.i.billInfo.billRange"),
              align:'center',
              key:"billRange",
              hiddenCol: false,
              render:(h,params) => {
                let billOrigin = params.row.billOrigin;
                let billRangeStart = params.row.billRangeStart;
                let billRangeEnd = params.row.billRangeEnd;
                return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
              }
            },
            {
              title:  this.$t("m.i.billInfo.flowStatus"),
              key: 'flowStatusName',
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.billPackageMoney"),
              key: 'billMoney',
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let billMoney = formatNumber(params.row.billMoney, 2, ',');
                return h("span", {
                  domProps: {
                    title: billMoney
                  }
                }, billMoney);
              }
            },
            {
              title: this.$t("m.i.billInfo.dueDt"),
              key: 'dueDt',
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if(params.row.dueDt == null || params.row.dueDt === ""){
                  return "";
                }
                let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.pyeeName"),
              key: 'pyeeName',
              sortable: true,
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.pyeeAcctNo"),
              key: 'pyeeAcctNo',
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.pyeeBankName"),
              key: 'pyeeBankName',
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.acptName"),
              key: 'acptName',
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t("m.i.ce.bailPcetStr"),
              key: 'bailPcet',
              hiddenCol: false,
              render: (h, params) => {
                if(params.row.bailPcet != null && params.row.bailPcet !== ""){
                  let rate = accMul(params.row.bailPcet, 100);
                  let rateFormat = formatNumber(rate, 2, ',');
                  return h("span", rateFormat);
                }
              }
            },
            {
              title: this.$t("m.i.ce.guarntrAmt"),
              key: 'guarntrAmt',
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
                return h("span", {
                  domProps: {
                    title: guarntrAmt
                  }
                }, guarntrAmt);
              }
            },
            {
              title: this.$t("m.i.ce.guarntrNo"),
              key: "guarntrNo",
              hiddenCol: false,
              render: (h, params) => {
                return h("a", {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showDueDeductAcct(params.row.id);
                    }
                  }
                }, '查看');
              }
            },
          ],
          billOriginList:[],
          //查询保证金账户信息
          dueDeductAcctWin: false,
          showParams: {
            listId:"",
          }
        }
      },
      mounted() {
        getDictListByGroups("BillOrigin").then(res => {
          this.billOriginList = res.get("BillOrigin");
          this.dictMap = res.get("map");
        });
      },
      methods: {
        showDueDeductAcct(id) {
          this.showParams.listId = id;
          this.dueDeductAcctWin = true;
        },
        dueDeductAcctWinClose() {
          this.dueDeductAcctWin = false;
        },
        billInfoWinClose(){
          this.showBillInfoWin = false;
        },
        showBillInfo(row){
          this.billId = row.billId;
          this.billRangeStart = row.billRangeStart;
          this.billRangeEnd = row.billRangeEnd;
          this.showBillInfoWin = true;
        },
        //表单查询
        handleSearch() {
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds = [];
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          })
        },
        //重置表单查询结果
        resetSearch() {
          this.$refs.formItem.resetFields();
          this.formItem.reverseBillNo = '';
        },
        //提示承兑申请
        acceptance() {
          if(this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let ids = [];
          let billIds = [];
          let transIds = [];
          for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
            ids.push(this.$refs.datagrid.selectIds[i]);
            billIds.push(this.$refs.datagrid.selects[i].billId);
            transIds.push(this.$refs.datagrid.selects[i].transId);
          }
          post({ids : ids,billIds : billIds,transIds : transIds}, "/ce/acpt/elec/agent/eAcptAgentAcceptAppl/func_agentBillAcceptanceApply").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
                this.$nextTick(() => {
                  this.$refs.datagrid.dataChange(1);
                })
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        },
      }
  }
</script>

<style scoped>

</style>
