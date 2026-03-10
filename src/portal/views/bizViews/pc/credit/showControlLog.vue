<!--额度流水历史查询-->
<template>
  <h-msg-box v-model="tempControlLogWin" width="1000" :mask-closable="false" top="10" class="h-form-table-layer"
             :maximize="true" :footerHide="true" @on-close="handleClose" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div class="h-form-search-box">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.transDt')" prop="transDt">
            <h-date-picker v-model="formItem.transDt" type="date" :editable=false
                           :showFormat=true placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item class="h-form-operate one-form">
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
    </div>
    <div class="text-wrap mb-10" v-if="isShow">
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.common.custName")}}:</h-col>
              <h-col span="14" class="val">{{ controlLogForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pc.busiBrch")}}:</h-col>
              <h-col span="14" class="val">{{ controlLogForm.brchName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pc.creditType")}}:</h-col>
              <h-col span="14" class="val">{{ controlLogForm.creditType === "1" ? "综合授信" : controlLogForm.creditType
                }}
              </h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pc.creditInfoNo")}}:</h-col>
              <h-col span="14" class="val">{{ controlLogForm.creditInfoNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pc.creditLimitAmt")}}:</h-col>
              <h-col span="14" class="val">{{ formatLimitAmt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pc.doAmt")}}:</h-col>
              <h-col span="14" class="val">{{ formatDoAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
    <div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        url="/pc/credit/creditControlLog/func_pagingQueryCreditFlowBatchList"
        highlight-row
        :auto-load="false"
        :bindForm="formItem"
        :onCurrentChange="handleCurrentChange"
        :onCurrentChangeCancel="handleCurrentChangeCancel"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="logDetail">{{$t("m.i.common.detail")}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <!--流水明细弹出框-->
    <h-msg-box v-model="logDetailWin" width="1000" :mask-closable="false" top="10"
               class="h-form-search-layer" :maximize="true" :z-index=1010 @on-maximize="onMaximize">
      <p slot="header">
        <span>流水明细</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid
        :columns="detailColumns"
        highlight-row
        url="/pc/credit/creditControlLog/func_pagingQueryCreditControlLogList"
        :bindForm="detailFormItem"
        :autoLoad=false
        ref="detailDatagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="logDetailWin=!logDetailWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </h-msg-box>
</template>

<script>
  import { on, off, formatNumber ,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "showControlLog",
    data() {
      return {
        tempIsShow : false,
        currentSelectRow : null,
        formItem : {
          creditInfoId: "",
          transDt: ""
        },
        columns : [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.pc.creditAdjustType"),
            key: "creditAdjustType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CreditAdjustCode", params.row.creditAdjustType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.currentTransAmt"),
            key: "currentTransAmt",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let currentTransAmt = this.formatTwoNumber(params.row.currentTransAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: currentTransAmt
                }
              }, currentTransAmt);
            }
          },
          {
            title: this.$t("m.i.pc.currentDoAmt"),
            key: "currentDoAmt",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let currentDoAmt = this.formatTwoNumber(params.row.currentDoAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: currentDoAmt
                }
              }, currentDoAmt);
            }
          },
          {
            title: this.$t("m.i.common.transDt"),
            key: "transDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.transDt == null ? "" : this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:this.$t("m.i.common.transTm"),
            key: 'transTm',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transTm == null || params.row.transTm === "") {
                return "";
              }
              if (params.row.transTm.toString().length < 6) {
                let transTm = params.row.transTm + "";
                for(let i=0; i<(6-params.row.transTm.toString().length); i++) {
                  transTm = "0" + transTm;
                }
                let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
                return h("span", date);
              }else{
                let date = this.$moment(params.row.transTm, "HH:mm:ss").format("HH:mm:ss");
                return h("span", date);
              }
            }
          },
          {
            title: this.$t("m.i.pc.operTeller"),
            key: "operTellerNo",
            hiddenCol: false
          }
        ],
        detailFormItem : {
          creditFlowBatchId: ""
        },
        detailColumns : [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false
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
            title: this.$t("m.i.pc.creditChangeValue"),
            key: "creditChangeValue",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let creditChangeValue = formatNumber(params.row.creditChangeValue, 2, ",");
              return h("span", {
                domProps: {
                  title: creditChangeValue
                }
              }, creditChangeValue);
            }
          },
          {
            title: this.$t("m.i.common.transDt"),
            key: "transDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.transDt == null ? "" : this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:this.$t("m.i.common.transTm"),
            key: "transTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transTm == null || params.row.transTm === "") {
                return "";
              }
              if (params.row.transTm.toString().length < 6) {
                let transTm = params.row.transTm + "";
                for(let i=0; i<(6-params.row.transTm.toString().length); i++) {
                  transTm = "0" + transTm;
                }
                let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
                return h("span", date);
              }else{
                let date = this.$moment(params.row.transTm, "HH:mm:ss").format("HH:mm:ss");
                return h("span", date);
              }
            }
          },
          {
            title: this.$t("m.i.pc.operTeller"),
            key: "operTellerNo",
            hiddenCol: false
          }
        ],
        //流水明细弹出框
        logDetailWin : false,
      };
    },
    props: {
      title: {
        type: String,
        default: "额度流水"
      },
      isShow: {
        type: Boolean,
        default: true
      },
      controlLogWin: {
        type: Boolean,
        default: false
      },
      controlLogForm: {
        type: Object
      },
      dictMap: Map
    },
    computed: {
      tempControlLogWin: {
        get() {
          return this.controlLogWin;
        },
        set() {
        }
      },
      formatLimitAmt() {
        return formatNumber(this.controlLogForm.creditLimitAmt, 2, ",");
      },
      formatDoAmt() {
        return formatNumber(this.controlLogForm.doAmt, 2, ",");
      }
    },
    watch: {
      controlLogWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.creditInfoId = this.controlLogForm.id;
            this.formSearch();
          });
        }
      },
      logDetailWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.detailDatagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          if (this.$refs.datagrid != null) {
            this.$refs.datagrid.$refs.gridContent.handleResize();
          }
          if (this.$refs.detailDatagrid != null) {
            this.$refs.detailDatagrid.$refs.gridContent.handleResize();
          }
        }, 100);
      },
      formatTwoNumber(num){
        debugger
        if(num){
          let newNum = num+"";
          if(newNum.indexOf(".")!= -1){
            return num;
          }else{
            return num+(".00");
          }
        }else{
          return "0.00";
        }

      },
      handleClose() {
        this.$emit("controlLogWinClose", "");
      },
      formSearch() {
        this.currentSelectRow = [];
        this.formItem.transDt = this.formItem.transDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      logDetail() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.detailFormItem.creditFlowBatchId = this.currentSelectRow.id;
          this.logDetailWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.logDetailWin = false;
        }
      }
    }
  };
</script>

<style scoped>

</style>
