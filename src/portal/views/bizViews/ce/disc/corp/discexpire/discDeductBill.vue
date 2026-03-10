<!--保贴商票到期扣款-扣款及保证金退回-票据管理-->
<template>
  <div>
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue" key="2">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
                <common-select v-model="billManagerFormItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="discDeductParams.billOriginList"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="billManagerFormItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="billManagerFormItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <disc-batch-detail :batchDetailParams="discDeductParams" ref="discBatchDetail"></disc-batch-detail>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/disc/corp/discexpire/discDeductBill/func_queryDiscBillExpire"
                      highlightRow
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      :onSelectChange="billManagerHandleRowClick"
                      :rowSelect="true"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="deduct" v-if="discDeductParams.applFlag === '0'">
                <h-button type="primary">扣款
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次扣款</h-dropdown-item>
                  <h-dropdown-item name="select">选择扣款</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-dropdown placement="bottom-start" @on-click="returnBailAmt"
                          v-if="discDeductParams.applFlag === '0'">
                <h-button type="primary" :disabled="discDeductParams.protectType === '1'">退回保证金
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list" v-if="discDeductParams.protectType !== '1'">
                  <h-dropdown-item name="batch">批次退回</h-dropdown-item>
                  <h-dropdown-item name="select">选择退回</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="ghost" @click="returnMain">返回</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart" :billNo="this.billNo"></bill-info-main>
    <!--扣款确认界面-->
    <h-msg-box v-model="showDeductAcctInfoWin" :maximize="true" :mask-closable="false" width="1000" top="10"
               class="h-form-table-layer" @on-close="showDeductAcctInfoWinClose" @on-maximize="onMaximize">
      <p slot="header">
        <span>账号信息</span>
      </p>
      <h-datagrid
        :columns="deductAcctColumns"
        :rowSelect=true
        :gridData="deductAcctGridDatas"
        :auto-load="false"
        :onSelectChange="handleSeleceDeductAcctChange"
        :bindForm="deductAcctFormItem"
        ref="deductAcctInfoDatagrid">
      </h-datagrid>
      <div slot="toolbar" class="pull-left">
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="showDeductAcctInfoWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="deductConfirmSubmit()">确定</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, getDictValueFromMap, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "discDeductBill",
    components: {
      DiscBatchDetail:() => import(/* webpackChunkName: "ce/disc/corp/discexpire/discBatchDetail" */`@/views/bizViews/ce/disc/corp/discexpire/discBatchDetail`)
    },
    data() {
      let billManagerColumns = [
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
          title: this.$t("m.i.billInfo.billOrigin"),
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.discDeductParams.dictMap,"BillOrigin",params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          hiddenCol: false,
          width: 250,
          sortable: true,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
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
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.dueDt == null || params.row.dueDt === "") {
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.guarntrNo"),
          key: "bailAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.guarntrAmt"),
          key: "bailAmt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let bailAmt = formatNumber(params.row.bailAmt, 2, ",");
            return h("span", {
              domProps: {
                title: bailAmt
              }
            }, bailAmt);
          }
        },
        {
         title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
         title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: "drwrAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
         title: this.$t("m.i.billInfo.pyeeAcctNo"),
          key: "pyeeAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
           title: this.$t("m.i.billInfo.pyeeBankName"),
          key: "pyeeBankName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        }
      ];
      return {
        billManagerFormItem : {
          billNo: "",
          reverseBillNo: "",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          applFlag: "",
          custName: "",
          custAcctNo: "",
          drwrName: "",
          drwrAcctNo: "",
          protectType: "",
          billClass: "",
          discDt: "",
          rate: ""
        },
        billManagerColumns : billManagerColumns,
        cloneBillManagerColumns : this.deepClone(billManagerColumns),
        currentSelectList : [],
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart : "",
        billRangeEnd : "",
        showDeductAcctInfoWin : false,
        deductAcctColumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
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
            title: this.$t("m.i.ce.deductAcctNo"),
            key: "deductAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.deductAcctNo1"),
            key: "deductAcctNo1",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.acctType"),
            key: "deductAcctType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.discDeductParams.dictMap, "custAcctKind", params.row.deductAcctType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        deductAcctGridDatas : {
          list: [],
          pageInfo: { count: 2, pageCount: 1, pageNo: 1, pageSize: 10 }
        },
        deductAcctFormItem : {},
        deductAcctCurrentList : [],
        submitFlag : false,
      };
    },
    props: {
      billManagerVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      discDeductParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          applFlag: "",
          custName: "",
          custAcctNo: "",
          drwrName: "",
          drwrAcctNo: "",
          protectType: "",
          billClass: "",
          discDt: "",
          rate: ""
        }
      }
    },
    computed: {
      tempBillManagerVue: {
        get() {
          return this.billManagerVue;
        },
        set() {
        }
      }
    },
    beforeDestroy() {
      off(window, "resize", this.handleResize);
    },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.billManagerFormItem = {
            applFlag: this.discDeductParams.applFlag,
            custName: this.discDeductParams.custName,
            custAcctNo: this.discDeductParams.custAcctNo,
            drwrName: this.discDeductParams.drwrName,
            drwrAcctNo: this.discDeductParams.drwrAcctNo,
            protectType: this.discDeductParams.protectType,
            billClass: this.discDeductParams.billClass,
            discDt: this.discDeductParams.discDt,
            rate: this.discDeductParams.rate
          };
          this.$nextTick(() => {
            this.billManagerColumns = this.deepClone(this.cloneBillManagerColumns);
            this.$refs.billManagerDatagrid.createShowCol(this.cloneBillManagerColumns);
            this.handleSearch();
          });
        }
      }
    },
    methods: {
      //表单查询
      handleSearch() {
        this.currentSelectList = [];
        this.$refs.billManagerDatagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.billManagerFormItem.resetFields();
        this.billManagerFormItem.reverseBillNo = "";
        this.billManagerFormItem.billOrigin = "";
        this.billManagerFormItem.minBillRangeStart = "";
        this.billManagerFormItem.maxBillRangeEnd = "";
      },
      //行选中
      billManagerHandleRowClick(arr) {
        this.currentSelectList = arr;
      },
      //批次扣款或选择扣款
      deduct(type) {
        if (type === "select") {
          let list = this.currentSelectList;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          if (list.length === 1) {
            this.showDeductAcctInfoWin = true;
            this.$nextTick(()=>{
              if (this.discDeductParams.protectType === "1") {
                //买方保贴-“结算账号”默认展示出票人账号
                this.deductAcctGridDatas.list = [{
                  deductAcctNo: this.discDeductParams.drwrAcctNo,
                  deductAcctType: "1"
                }, { deductAcctNo: list[0].bailAcctNo, deductAcctType: "2" }];
              } else if (this.discDeductParams.protectType === "2") {
                //卖方保贴-“结算账号”默认展示贴现人账号
                this.deductAcctGridDatas.list = [{
                  deductAcctNo: this.discDeductParams.custAcctNo,
                  deductAcctType: "1"
                }, { deductAcctNo: list[0].bailAcctNo, deductAcctType: "2" }];
              }
            })
          } else {
            let ids = [];
            for (let i = 0; i < list.length; i++) {
              ids.push(list[i].id);
            }
            let params = {
              isBatchOper: "2",
              ids: ids.join(",")
            };
            this.handleSubmit(params, "deduct", type);
          }
        } else if (type === "batch") {
          let params = {
            isBatchOper: "1",
            custName: this.discDeductParams.custName,
            custAcctNo: this.discDeductParams.custAcctNo,
            drwrName: this.discDeductParams.drwrName,
            drwrAcctNo: this.discDeductParams.drwrAcctNo,
            protectType: this.discDeductParams.protectType,
            billClass: this.discDeductParams.billClass,
            discDt: this.discDeductParams.discDt,
            rate: this.discDeductParams.rate
          };
          this.handleSubmit(params, "deduct", type);
        }
      },
      //批次退回保证金或选择退回保证金
      returnBailAmt(type) {
        if (type === "select") {
          let list = this.currentSelectList;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let ids = [];
          for (let i = 0; i < list.length; i++) {
            ids.push(list[i].id);
          }
          let params = {
            isBatchOper: "2",
            ids: ids.join(",")
          };
          this.handleSubmit(params, "bailAmt", type);
        } else if (type === "batch") {
          let params = {
            isBatchOper: "1",
            custName: this.discDeductParams.custName,
            custAcctNo: this.discDeductParams.custAcctNo,
            drwrName: this.discDeductParams.drwrName,
            drwrAcctNo: this.discDeductParams.drwrAcctNo,
            protectType: this.discDeductParams.protectType,
            billClass: this.discDeductParams.billClass,
            discDt: this.discDeductParams.discDt,
            rate: this.discDeductParams.rate
          };
          this.handleSubmit(params, "bailAmt", type);
        }
      },
      handleSubmit(params, optType, type) {
        let content = optType === "deduct" ? "确定扣款吗?" : "确定退回保证金吗?";
        let url = optType === "deduct" ? "/ce/disc/corp/discexpire/discDeductBill/func_deductAccount" : "/ce/disc/corp/discexpire/discDeductBill/returnBailAmt";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          onOk: () => {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (type === "batch" || this.$refs.billManagerDatagrid.tData.length === this.currentSelectList.length) {
                    this.returnMain();
                  } else {
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                    this.$refs.discBatchDetail.getDiscBatchInfo();
                    this.currentSelectList = [];
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //返回主页面
      returnMain() {
        this.resetSearch();
        this.$emit("returnDiscMain", "");
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
        this.billNo = row.billNo;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      handleSeleceDeductAcctChange(arr) {
        this.deductAcctCurrentList = arr;
      },
      showDeductAcctInfoWinClose() {
        this.showDeductAcctInfoWin = false;
        this.deductAcctGridDatas.list = [];
      },
      //扣款弹窗确定
      deductConfirmSubmit() {
        let list = this.currentSelectList;
        let ids = [];
        for (let i = 0; i < list.length; i++) {
          ids.push(list[i].id);
        }
        let params = {
          isBatchOper: "2",
          ids: ids.join(",")
        };
        this.submitFlag = true;
        post(params, "/ce/disc/corp/discexpire/discDeductBill/func_deductAccount").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showDeductAcctInfoWinClose();
              if (this.$refs.billManagerDatagrid.tData.length === this.currentSelectList.length) {
                this.returnMain();
              } else {
                this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                this.$refs.discBatchDetail.getDiscBatchInfo();
                this.currentSelectList = [];
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      onMaximize() {
        if (this.$refs.deductAcctInfoDatagrid != null) {
          this.$refs.deductAcctInfoDatagrid.$refs.gridContent.handleResize();
        }
      }
    }
  };
</script>

<style scoped>

</style>
