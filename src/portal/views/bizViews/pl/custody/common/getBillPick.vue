<template>
  <!--取票挑票弹出框-->
  <h-msg-box v-model="tempSavePickBillWin" width="1000"  @on-close="handleClose"
             class="h-form-table-layer" :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>取票挑票</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="savePickBillForm" :label-width="100" ref="savePickBillForm" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
          <h-input v-model="savePickBillForm.billNo" placeholder=""></h-input>
        </h-form-item>
        <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
          <h-date-picker type="date" v-model="savePickBillForm.dueDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" >
          <h-row>
            <h-col span="11">
              <h-typefield  v-model="savePickBillForm.minBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
            </h-col>
            <h-col span="2" style="text-align: center">-</h-col>
            <h-col span="11">
              <h-typefield  v-model="savePickBillForm.maxBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
            </h-col>
          </h-row>
        </h-form-item>
        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      :auto-load="false"
      :row-select="true"
      :has-select="false"
      :url="dataUrl"
      param-id="billId"
      :bindForm="savePickBillForm"
      ref="savePickDatagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off ,formatNumber, getDictListByGroups, getDictValueFromMap, accMul } from "@/api/bizApi/commonUtil";


  export default {
    name: "getBillPick",
    data() {
      return {
        dataUrl : "",
        savePickBillForm : {
          billNo: '',
          dueDt: '',
          batchId: '',
          billClass: '',
          billType: '',
          minBillMoney: '',
          maxBillMoney: '',
          custAcctNo: '',
          acctBrchNo: '',
          dataSource: '',
        },
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
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
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
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
           title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false,
          }
        ],
        isList : [],
      };
    },
    props: {
      savePickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchId:"",
      billClass:"",
      custAcctNo: "",
      billType: "",
      acctBrchNo: "",
      dataSource: '',
    },
    watch: {
      savePickBillWin(val) {
        if (val === true) {
          this.savePickBillForm.billClass = this.billClass;
          this.savePickBillForm.billType = this.billType;
          this.savePickBillForm.batchId = this.batchId;
          this.savePickBillForm.custAcctNo = this.custAcctNo;
          this.savePickBillForm.acctBrchNo = this.acctBrchNo;
          this.savePickBillForm.dataSource = this.dataSource;
          this.dataUrl = this.billClass === "ME01" ? "/pl/custody/paper/getBill/getBillApplyMain/func_pageQueryGetBillPick" : "/pl/custody/elec/getBill/eGetBillApplyMain/func_pageQueryGetBillPick";
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      },
    },
    computed: {
      tempSavePickBillWin: {
        get() {
          return this.savePickBillWin;
        },
        set() {
        }
      },
    },
    methods: {
      handleDateChange(value) {
        this.savePickBillForm.dueDt = value.replace(/-/g, "");
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.savePickDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.$refs.savePickDatagrid.selects = [];
        this.$refs.savePickDatagrid.selectIds = [];
        this.$refs.savePickDatagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.savePickBillForm.minBillMoney = "";
        this.savePickBillForm.maxBillMoney = "";
        this.$refs.savePickBillForm.resetFields();
      },
      handleClose() {
        this.$refs.savePickBillForm.resetFields();
        this.savePickBillForm.minBillMoney = "";
        this.savePickBillForm.maxBillMoney = "";
        this.$emit("savePickBillWinClose", "");
      },
      submitForm() {
        let list = this.$refs.savePickDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$emit("savePickBillChange", list, this.dataSource);
      },
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode").then(res => {
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    },
  };
</script>

<style scoped>

</style>
