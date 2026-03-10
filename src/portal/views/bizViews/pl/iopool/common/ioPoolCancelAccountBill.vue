<!--出池/入池撤销记账明细-->
<template>
  <div name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue">
    <div>
      <!-- 数据展示表格 -->
      <h-datagrid
        :columns="billManagerColumns"
        :url="dataUrl"
        highlightRow
        :auto-load="false"
        :bindForm="billManagerFormItem"
        :rowSelect="true"
        :has-select="false"
        ref="billManagerDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-dropdown placement="bottom-start" @on-click="cancelAccountBtn">
            <h-button type="primary">{{$t('m.i.pl.cancelAccountMain')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="batch">批次撤销记账</h-dropdown-item>
              <h-dropdown-item name="select">选择撤销记账</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-button type="primary" @click="accountBillDetail">{{$t('m.i.pl.accountBillDetail')}}</h-button>
          <h-button type="ghost" @click="returnMain">{{$t('m.i.pl.return')}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <!--显示票据明细界面-->
    <h-msg-box v-model="billDetailSearchWin" width="1000" :mask-closable="false" @on-close="billDetailClose" top="10"
               class="h-form-search-layer" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>票据明细</span>
      </p>
      <h-datagrid
        :columns="billDetailColumns"
        :url="dataDetailUrl"
        highlightRow
        :auto-load="false"
        :bindForm="billDetailFormItem"
        :rowSelect="true"
        ref="billDetailDatagrid">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="billDetailClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!--显示流水明细界面-->
    <h-msg-box v-model="acctFlowDetailWin" width="1000" :mask-closable="false" @on-close="acctFlowDetailClose" top="10"
               class="h-form-search-layer" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>流水明细</span>
      </p>
      <h-datagrid
        :columns="acctFlowColumns"
        :url="acctFlowUrl"
        highlightRow
        :auto-load="false"
        :bindForm="acctFlowFormItem"
        :rowSelect="true"
        ref="acctFlowDatagrid">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="acctFlowDetailClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "ioPoolCancelAccountBill",
    components: {
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
          title: this.$t("m.i.common.foreFlowNo"),
          key: "frontFlowNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("div", [
              h("a", {
                on: {
                  click: () => {
                    this.showAcctFlowDetail(params.row.id);
                  }
                }
              }, params.row.frontFlowNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.sendAcctBrchNo"),
          key: "sendAcctBrchNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.operTellerNo"),
          key: "operTellerNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.accountBrch"),
          key: "acctBrchNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pl.acctTellerName"),
          key: "acctTellerNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.transDt"),
          key: "acctDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.acctDt == null || params.row.acctDt === "") {
              return "";
            }
            let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.common.transTm"),
          key: "transTm",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.transTm == null || params.row.transTm === "") {
              return "";
            }
            let transTm = params.row.transTm.toString();
            if (params.row.transTm.toString().length < 6) {
              for (let i = 0; i < (6 - params.row.transTm.toString().length); i++) {
                transTm = "0" + transTm;
              }
            }
            let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
            return h("span", date);
          }
        }
      ];
      return {
        dataUrl : "",
        dataDetailUrl : "",
        acctFlowUrl : "",
        ifShowMore : false,
        billManagerFormItem : {
          batchId: "",
          funcNo: "",
          billClass: ""
        },
        billManagerColumns : billManagerColumns,
        cloneBillManagerColumns : this.deepClone(billManagerColumns),
        billDetailFormItem : {
          batchId:"",
          acctFlowId: ""
        },
        billDetailColumns : [
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            width: 250,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.ioPoolBillParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
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
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
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
        ],
        acctFlowFormItem : {
          foreFlowIds: ""
        },
        acctFlowColumns : [
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
            title: this.$t("m.i.common.foreFlowNo"),
            key: "foreFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.common.backFlowNo"),
            key: "backFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.sendAcctBrchNo"),
            key: "sendAcctBrchNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.accountBrch"),
            key: "accountBrchNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pl.acctTellerName"),
            key: "acctTellerNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.transDt"),
            key: "acctDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.acctDt == null || params.row.acctDt === "") {
                return "";
              }
              let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.transTm"),
            key: "transTm",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transTm == null || params.row.transTm === "") {
                return "";
              }
              let transTm = params.row.transTm.toString();
              if (params.row.transTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.transTm.toString().length); i++) {
                  transTm = "0" + transTm;
                }
              }
              let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          }
        ],
        billDetailSearchWin : false,
        acctFlowDetailWin : false,
        currentSelectList : [],
        //区分批次记账和明细记账
        acctType : "",
        showBillInfoWin : false,
        billId : "",
        billNo : "",
      };
    },
    props: {
      billManagerVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      ioPoolBillParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          batchId: "",
          funcNo: "",
          billClass: "",
          accountType: "",       //区分入池和出池撤销记账
          dataUrl: "",          //撤销记账明细界面对应Url
          cancelAcctUrl: "",     //撤销记账对应Url
          dataDetailUrl: ""     //票据明细对应Url
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
    mounted() {
    },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.ioPoolBillParams.batchId;
          this.billManagerFormItem.funcNo = this.ioPoolBillParams.funcNo;
          this.billManagerFormItem.billClass = this.ioPoolBillParams.billClass;
          this.dataUrl = this.ioPoolBillParams.dataUrl;
          this.$nextTick(() => {
            this.billManagerColumns = this.deepClone(this.cloneBillManagerColumns);
            this.$refs.billManagerDatagrid.createShowCol(this.cloneBillManagerColumns);
            this.handleSearch();
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          if (this.$refs.billDetailDatagrid != null) {
            this.$refs.billDetailDatagrid.selfAdaption();
          }
          if (this.$refs.acctFlowDatagrid != null) {
            this.$refs.acctFlowDatagrid.selfAdaption();
          }
        }, 100);
      },
      //表单查询
      handleSearch() {
        this.currentSelectList = [];
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.billManagerDatagrid.selectIds = [];
        this.$refs.billManagerDatagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.billManagerFormItem.resetFields();
      },
      //行选中
      billManagerHandleRowClick(arr) {
        this.currentSelectList = arr;
      },
      //记账批次撤销或选择撤销
      cancelAccountBtn(type) {
        this.acctType = type;
        this.currentSelectList = this.$refs.billManagerDatagrid.selects;
        if (type === "select") {
          let list = this.currentSelectList;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let acctFlowIds = [];
          for (let i = 0; i < list.length; i++) {
            acctFlowIds.push(list[i].id);
          }
          let params = {
            batchId: this.ioPoolBillParams.batchId,
            acctFlowIds: acctFlowIds.join(","),
            operType: "0",
            funcNo: this.billManagerFormItem.funcNo
          };
          this.handleAccountBack(params);
        } else if (type === "batch") {
          if (this.$refs.billManagerDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = {
            batchId: this.ioPoolBillParams.batchId,
            operType: "1",
            funcNo: this.billManagerFormItem.funcNo
          };
          this.handleAccountBack(params);
        }
      },
      handleAccountBack(params) {
        let url = this.ioPoolBillParams.cancelAcctUrl;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销记账吗",
          onOk: () => {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.acctType === "batch" || this.$refs.billManagerDatagrid.tData.length === this.currentSelectList.length) {
                    this.returnMain();
                  } else {
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                    this.currentSelectList = [];
                    this.$refs.billManagerDatagrid.selects = [];
                    this.$refs.billManagerDatagrid.selectIds = [];
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
      //票据明细界面
      accountBillDetail() {
        this.currentSelectList = this.$refs.billManagerDatagrid.selects;
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.billDetailFormItem.acctFlowId = this.currentSelectList[0].id;
        this.billDetailFormItem.batchId = this.ioPoolBillParams.batchId;
        this.dataDetailUrl = this.ioPoolBillParams.dataDetailUrl;
        this.billDetailSearchWin = true;
        this.$nextTick(() => {
          if (this.$refs.billDetailDatagrid != null) {
            this.$refs.billDetailDatagrid.dataChange(1);
          }
        });
      },
      //票据明细关闭按钮
      billDetailClose() {
        this.billDetailFormItem.acctFlowId = "";
        this.billDetailFormItem.batchId = "";
        this.billDetailSearchWin = false;
      },
      showAcctFlowDetail(frontFlowNo) {
        this.acctFlowFormItem.foreFlowIds = frontFlowNo;
        this.acctFlowUrl = "/pc/acct/flow/queryAcctFlowPageByBatchIds";
        this.acctFlowDetailWin = true;
        this.$nextTick(() => {
          if (this.$refs.acctFlowDatagrid != null) {
            this.$refs.acctFlowDatagrid.dataChange(1);
          }
        });
      },
      acctFlowDetailClose() {
        this.acctFlowDetailWin = false;
      },
      //返回主页面
      returnMain() {
        this.$emit("returnCancelAccountMain", "");
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
