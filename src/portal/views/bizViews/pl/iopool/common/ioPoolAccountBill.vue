<!--出池/入池记账明细-->
<template>
  <div>
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4"
                      class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="billManagerFormItem.likeBillNo" :maxLength="30"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
                  <h-typefield type="money" v-model="billManagerFormItem.minBillMoney" :maxlength="20"
                               placeholder="" bigTips divided></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
                  <h-typefield type="money" v-model="billManagerFormItem.maxBillMoney" :maxlength="20"
                               placeholder="" bigTips divided></h-typefield>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <io-pool-batch-detail :batchDetailParams="ioPoolBillParams" ref="ioPoolBatchDetail"></io-pool-batch-detail>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      :url="dataUrl"
                      highlightRow
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      :rowSelect="true"
                      :has-select="false"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="accountDetail">
                <h-button type="primary">{{$t('m.i.pl.balance')}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次记账</h-dropdown-item>
                  <h-dropdown-item name="select">选择记账</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-dropdown placement="bottom-start" @on-click="backDetail" v-if="ioPoolBillParams.billClass === 'ME01'">
                <h-button type="primary">{{$t('m.i.pl.returnBack')}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次退回</h-dropdown-item>
                  <h-dropdown-item name="select">选择退回</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="ghost" @click="returnMain">{{$t('m.i.pl.return')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 分录弹框 -->
    <acct-record :param="acctRecordParam" :url="acctRecordUrl" :submitFlag="acctSubmitFlag"
                 :showPrintButton="this.showPrintButton" :show-acct-record-win="showAcctRecordWin"
                 @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                 @printSuccessCallback="printSuccessCallback"></acct-record>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "ioPoolAccountBill",
    components: {

    },
    data() {
      return {
        showPrintButton : false,
        ifShowMore : false,
        dataUrl : "",
        columns : [],
        dueDt : [],
        remitDt : [],
        billManagerFormItem : {
          batchId: "",
          funcNo: "",
          billClass: "",
          likeBillNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          minRemitDt: "",
          maxRemitDt: ""
        },
        billManagerColumns : [
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
            sortable: true,
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
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankAddr"),
            key: "drweBankAddr",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        eOutPoolColumns : [
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
            sortable: true,
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
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectList : [],
        acctSubmitFlag : false,
        showAcctRecordWin : false,
        acctRecordParam : {},
        acctRecordUrl : "",
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
          accountType:"",       //区分入池和出池记账
          dataUrl: "",          //表格明细对应Url
          acctRecordUrl: "",    //获取分录信息对应Url
          acctSubmitUrl: "",    //提交记账对应Url
          acctBackUrl: "",      //记账退回对应Url
          batchInfoUrl: ""      //查询批次信息对应Url
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
            if (this.ioPoolBillParams.accountType === "outPool" && this.ioPoolBillParams.billClass === "ME02") {
              this.columns = this.deepClone(this.eOutPoolColumns);
            } else {
              this.columns = this.deepClone(this.billManagerColumns);
            }
            this.$refs.billManagerDatagrid.createShowCol(this.columns);
            this.handleSearch();
          });
        }
      }
    },
    methods: {
      handleDueDtChange(arr) {
        if (arr&&arr.length==2){
          this.billManagerFormItem.minDueDt = arr[0].replace(/-/g, "");
          this.billManagerFormItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.billManagerFormItem.minDueDt = "";
          this.billManagerFormItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handleRemitDtChange(arr) {
        if (arr&&arr.length==2){
          this.billManagerFormItem.minRemitDt = arr[0].replace(/-/g, "");
          this.billManagerFormItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.billManagerFormItem.minRemitDt = "";
          this.billManagerFormItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectList = [];
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.billManagerDatagrid.selectIds = [];
        this.billManagerFormItem.minBillMoney = this.billManagerFormItem.minBillMoney.toString().replace(/,/g, "");
        this.billManagerFormItem.maxBillMoney = this.billManagerFormItem.maxBillMoney.toString().replace(/,/g, "");
        this.billManagerFormItem.minDueDt = this.billManagerFormItem.minDueDt.toString().replace(/-/g, "");
        this.billManagerFormItem.maxDueDt = this.billManagerFormItem.maxDueDt.toString().replace(/-/g, "");
        this.billManagerFormItem.minRemitDt = this.billManagerFormItem.minRemitDt.toString().replace(/-/g, "");
        this.billManagerFormItem.maxRemitDt = this.billManagerFormItem.maxRemitDt.toString().replace(/-/g, "");
        this.$refs.billManagerDatagrid.dataChange(1);
        this.$refs.ioPoolBatchDetail.getIoPoolBatchInfo();
      },
      //重置表单查询结果
      resetSearch() {
        this.billManagerFormItem.likeBillNo = "";
        this.billManagerFormItem.minBillMoney = "";
        this.billManagerFormItem.maxBillMoney = "";
        this.billManagerFormItem.minDueDt = "";
        this.billManagerFormItem.maxDueDt = "";
        this.billManagerFormItem.minRemitDt = "";
        this.billManagerFormItem.maxRemitDt = "";
        this.dueDt = [];
        this.remitDt = [];
      },
      //行选中
      billManagerHandleRowClick(arr) {
        this.currentSelectList = arr;
      },
      //批次记账或选择记账
      accountDetail(type) {
        this.acctType = type;
        this.currentSelectList = this.$refs.billManagerDatagrid.selects;
        if (type === "select") {
          let list = this.currentSelectList;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let listIds = this.$refs.billManagerDatagrid.selectIds;
          let params = {
            batchId: this.ioPoolBillParams.batchId,
            listIds: listIds.join(","),
            operType: "0",
            funcNo: this.billManagerFormItem.funcNo
          };
          this.handleAccountSubmit(params);
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
          this.handleAccountSubmit(params);
        }
      },
      handleAccountSubmit(params) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账吗?",
          onOk: () => {
            this.getEntryInfo(params);
          }
        });
      },
      //获取分录信息
      getEntryInfo(params) {
        this.acctRecordUrl = this.ioPoolBillParams.acctRecordUrl;
        this.acctRecordParam = params;
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        let params = {};
        if (this.acctType === "select") {
          let listIds = [];
          for (let i = 0; i < this.currentSelectList.length; i++) {
            listIds.push(this.currentSelectList[i].id);
          }
          params = {
            batchId: this.ioPoolBillParams.batchId,
            listIds: listIds.join(","),
            operType: "0",
            funcNo: this.billManagerFormItem.funcNo
          };
        } else if (this.acctType === "batch") {
          params = {
            batchId: this.ioPoolBillParams.batchId,
            operType: "1",
            funcNo: this.billManagerFormItem.funcNo
          };
        }
        this.acctSubmitFlag = true;
        let url = this.ioPoolBillParams.acctSubmitUrl;
        post(params, url).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.currentSelectList = [];
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.billManagerDatagrid.selectIds = [];
        this.$refs.ioPoolBatchDetail.getIoPoolBatchInfo();
        this.$refs.billManagerDatagrid.dataChange(1,(data)=>{
          if(data.length === 0) {
            this.returnMain();
          }
        })
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //记账批次退回或选择退回
      backDetail(type) {
        this.acctType = type;
        this.currentSelectList = this.$refs.billManagerDatagrid.selects;
        if (type === "select") {
          let list = this.currentSelectList;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let listIds = this.$refs.billManagerDatagrid.selectIds;
          let params = {
            batchId: this.ioPoolBillParams.batchId,
            listIds: listIds.join(","),
            operType: "0"
          };
          this.handleAccountBack(params);
        } else if (type === "batch") {
          if (this.$refs.billManagerDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = { batchId: this.ioPoolBillParams.batchId, operType: "1" };
          this.handleAccountBack(params);
        }
      },
      handleAccountBack(params) {
        let url = this.ioPoolBillParams.acctBackUrl;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账退回吗",
          onOk: () => {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.acctType === "batch" || this.$refs.billManagerDatagrid.tData.length === this.currentSelectList.length) {
                    this.returnMain();
                  } else {
                    this.$refs.ioPoolBatchDetail.getIoPoolBatchInfo();
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
      //返回主页面
      returnMain() {
        this.resetSearch();
        this.$emit("returnAccountMain", "");
      },
      billInfoWinClose(){
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
