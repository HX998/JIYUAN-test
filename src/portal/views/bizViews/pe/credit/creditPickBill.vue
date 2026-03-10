<template>
  <!--信用查询挑票弹出框-->
  <h-msg-box v-model="tempCreditPickBillWin" width="1000"  @on-close="handleClose" top="30"
             class="h-form-table-layer" :maximize="true"  @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="creditPickBillForm" :label-width="100" ref="creditPickBillForm" cols="4" class="h-form-search">

        <bill-type v-model="creditPickBillForm.billType" :dictList="billTypeList"></bill-type>
        <!-- 票据来源 -->
        <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                       v-model="creditPickBillForm.billOrigin" :dictList="billOriginList"></common-select>

        <!--票据(包)号码-->
        <bill-no v-model="creditPickBillForm.billNoLike" prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')"></bill-no>
        <!--子票区间-->
        <bill-range :formItem="creditPickBillForm" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
        <!-- 票据(包)金额 -->
        <bill-money-range v-model="creditPickBillForm" :rangeProps="['minBillMoney','maxBillMoney']" :label="$t('m.i.billInfo.billPackageMoney')"></bill-money-range>
        <!-- 签收状态 -->
        <common-select v-model="creditPickBillForm.cdtQrySignStatus" :label="$t('m.i.shcpe.cdtInfoType')" prop="cdtQrySignStatus"
                       :dictList="cdtQrySignStatusList"></common-select>
        <query-btn :advanceShow='true' @showChange="showChange" :formSearch='formSearch' :formSearchReset='formSearchReset'></query-btn>
      </h-form>
      </h-panel>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      :auto-load="false"
      highlightRow
      :rowSelect="true"
      url="/pe/credit/creditQry/func_queryCreditPick"
      :bindForm="creditPickBillForm"
      :onSelectChange="handleSelectClick"
      ref="creditPickDatagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <close-btn @close="handleClose"></close-btn>
      <commit-btn @commit="submitForm"></commit-btn>
    </div>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"
                    :billId="this.billId"></bill-info-main>
  </h-msg-box>
</template>

<script>
  import { post, on, off ,formatNumber, getDictListByGroups, getDictValueFromMap, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditPickBill",
    data() {
      return {
        showBillInfoWin : false,
        billId : "",
        billRangeStart:"",
        billRangeEnd:"",
        ifShowMore: false,
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
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
            key: "billNo",
            sortable: true,
            hiddenCol: false,
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
            align:'center',
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render:(h,params) => {
              return h("span",getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType));
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
            title: this.$t("m.i.shcpe.cdtInfoType"),
            key: "cdtQrySignStatus",
            hiddenCol: false,
            sortable: true,
            render:(h,params) => {
              return h("span",getDictValueFromMap(this.dictMap,"CdtQrySignCode",params.row.cdtQrySignStatus));
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: 'pyeeAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: 'pyeeBankNo',
            hiddenCol: false,
          },
          {
             title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cpesBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.formatBillStatus(params.row.billOrigin,params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        currentSelectList : [],
        currentSelectRowInx : [],
        isList : [],
        billTypeList : [],
        billOriginList:[],
        cdtQrySignStatusList : [],
        creditPickBillForm : {
           billType : '',
           billOrigin : '',
           billMoney : '',
           minBillMoney:"",
           maxBillMoney:"",
           billNoLike : '',
           cdtQrySignStatus : '',
           billRangeStart : '',
           billRangeEnd : '',
          minBillRangeStart:"",
          maxBillRangeEnd : "",
        }
      }
    },
    props: {
      creditPickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default() {
          return "挑票";
        }
      },
    },
    watch: {
      creditPickBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearchReset();
            this.$refs.creditPickDatagrid.dataChange(1);
            this.currentSelectList = [];
            this.currentSelectRow = [];
          });
        }
      }
    },
    computed: {
      tempCreditPickBillWin: {
        get() {
          return this.creditPickBillWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.creditPickDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.$refs["creditPickBillForm"].validate(valid => {
            if (valid) {
              this.$refs.creditPickDatagrid.dataChange(1);
              this.currentSelectList = [];
              this.currentSelectRow = [];
            }
         });
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //重置
      formSearchReset() {
        this.$refs.creditPickBillForm.resetFields();
        this.creditPickBillForm.cdtQrySignStatus = 'CI01';
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      handleClose() {
        this.currentSelectList = [];
        this.$emit("creditPickBillWinClose", "");
      },
      //票面信息
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      submitForm() {
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定发送信用查询申请吗？",
          onOk: () => {
            this.$emit("creditPickSubmit", this.$refs.creditPickDatagrid.selectIds,
              this.currentSelectList[0].cdtQrySignStatus);
          }
        });
      },
      formatBillStatus(billOrigin, billStatus){
        if(billOrigin==="CS01"){
          return  this.dictMap.get("EcdsBillStatusCode").get(billStatus);
        }else {
          return this.dictMap.get("BillStatusCode").get(billStatus);
        }

      },
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,BillOrigin,DraftTypeCode,CdtQrySignCode,EcdsBillStatusCode,BillStatusCode").then(res => {
        this.billTypeList=res.get("DraftTypeCode");
        this.isList = res.get("Yon");
        this.billOriginList= res.get("BillOrigin");
        this.cdtQrySignStatusList = res.get("CdtQrySignCode")
        this.dictMap = res.get("map");
      });
      on(window, "resize", this.handleResize);
    }
  };
</script>

<style scoped>

</style>
