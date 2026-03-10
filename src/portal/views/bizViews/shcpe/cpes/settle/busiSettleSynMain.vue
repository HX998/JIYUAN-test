<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <show-cpes-branch  :label="$t('m.i.common.brchName')"
                                     :brchCode.sync="formItem.applBrchCode"  :cpesBrchName.sync="formItem.branchName"
                                     datagridUrl="/cpes/branch/queryBranchList" prop="branchName" :cpesBrchParams="{'memberId':needMemberId}"
                                     queryUrl="/cpes/branch/queryBranchList" ></show-cpes-branch>

                  <h-form-item prop="settleBusiType" label="业务种类">
                    <h-select v-model="formItem.settleBusiType" placeholder="">
                      <h-option v-for="item in settleBusiTypeList" :value="item.key"
                                :key="item.value">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')">
                    <h-input v-model="formItem.billNoLike" placeholder="" :maxlength="30"></h-input>
                  </h-form-item>
                  <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <h-form-item prop="dealNo" label="成交单编号">
                    <h-input v-model="formItem.dealNo" placeholder="" :maxlength="16"></h-input>
                  </h-form-item>
                  <h-form-item prop="settleReqNo" label="结算请求编号">
                    <h-input v-model="formItem.settleReqNo" placeholder="" :maxlength="35"></h-input>
                  </h-form-item>
                  <h-form-item prop="applBrchCode">
                    <h-input v-model="formItem.applBrchCode" v-show="false"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/settle/busiSettleSynMain/func_querySettleStatusApl"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="synchronous()" v-if="authObj.synchronousBtn">{{$t("m.i.common.synch")}}</h-button>
              <h-button type="primary" @on-click="searchResult()" v-if="authObj.searchResultBtn">
                {{$t("m.i.common.showResult")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <query-settle-syn-result :querySettleSynResult="querySettleSynResult" :needInfoId="needInfoId"
                             @querySettleSynResultClose="querySettleSynResultClose"></query-settle-syn-result>
    <settle-status-synchron :settleStatusSynchron="settleStatusSynchron"
                            @settleStatusSynchronSubmit="settleStatusSynchronSubmit"
                            @settleStatusSynchronClose="settleStatusSynchronClose"></settle-status-synchron>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "busiSettleSynMain",
    components: {
      QuerySettleSynResult: () => import(/* webpackChunkName: "shcpe/cpes/settle/querySettleSynResult" */`@/views/bizViews/shcpe/cpes/settle/querySettleSynResult`),
      SettleStatusSynchron: () => import(/* webpackChunkName: "shcpe/cpes/settle/settleStatusSynchron" */`@/views/bizViews/shcpe/cpes/settle/settleStatusSynchron`),
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
        billId : "",
        billNo : "",
        billRangeStart:'',
        billRangeEnd:'',
        showBillInfoWin : false,
        formItem: {
          applBrchCode: "",
          branchName: "",
          settleBusiType: "",
          billNoLike: "",
          dealNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          settleReqNo: ""
        },
        columns: [
          {
            type: "radio",
            title: " ",
            hiddenCol: false,
            width: 60,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width: 60,
            hiddenCol: false
          },

          {
            title: this.$t("m.i.common.id"),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "applBrchName",
            hiddenCol: false,
            sortable: true,
            align: "center"

          },
          {
            title: this.$t('m.i.common.settleReqNo'),
            key: "settleReqNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.common.settleBusiType'),
            key: "settleBusiType",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "StlRequestType", params.row.settleBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.dealNo'),
            key: "dealNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
            }
          },
          {
            title: this.$t('m.i.ce.applStatus'),
            key: "applStatus",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let flag = params.row.applStatus;
              switch (flag) {
                case "1":
                  return h("span", "发送中");
                case "2":
                  return h("span", "发送成功");
                case "3":
                  return h("span", "发送失败");
                case "4":
                  return h("span", "已接收");
                case "5":
                  return h("span", "复核驳回");
                default :
                  return h("span", "");
              }
            }
          },
          {
            title: this.$t('m.i.shcpe.applRemark'),
            key: "applRemark",
            sortable: true,
            hiddenCol: false,
            align: "center"

          }
        ],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        authObj: {
          synchronousBtn: true,
          searchResultBtn: true
        },
        needInfoId: "",
        tableRef: "selfTable",

        settleStatusSynchron: false,
        querySettleSynResult: false,
        addOrEditForm: false,
        moveUpDisabled: false,
        moveDownDisabled: false,
        //showCpesBranch: false,
        ifShowMore: false,
        currentSelectRow: null,
        needMemberId:"",
        settleBusiTypeList: [],
        dictMap: null
      };
    },
    watch: {},

    computed: {},
    mounted() {
      post({}, "/sm/auth/user/queryCurrentLoginInfo").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retData = res.data.retData;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.needMemberId = retData.memberId;
          } else {
            this.$msgTip.error(this, { info: msg });
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.$hMessage.error(this.$t("m.i.common.netError"));
        }
      });
      getDictListByGroups("StlRequestType").then(res => {
        this.settleBusiTypeList = res.get("StlRequestType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.applBrchCode = "";
        this.formItem.branchName = "";
      },
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
      synchronous() {
          this.settleStatusSynchron = true;
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      searchResult() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.needInfoId = this.currentSelectRow.id;
        this.querySettleSynResult = true;
      },
      querySettleSynResultClose() {
        this.querySettleSynResult = false;
      },
      settleStatusSynchronClose() {
        this.settleStatusSynchron = false;
      },
      settleStatusSynchronSubmit(flag) {
        if (flag) {
          this.settleStatusSynchron = false;
          this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
        }
      },
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      /*showBranchWinShow() {
        this.showCpesBranch = true;
      },*/
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.applBrchCode = info.brchCode;
        this.formItem.branchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      }*/
    }
  };
</script>

<style scoped>

</style>
