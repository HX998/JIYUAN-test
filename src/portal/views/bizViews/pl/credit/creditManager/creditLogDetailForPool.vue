<!--业务查询-流水查询-票据池额度流水历史查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue">
      <h-col span="24">
        <div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :url="logDetailParams.batchUrl"
            highlight-row
            :auto-load="false"
            :bindForm="billManagerFormItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryLog" v-if="logDetailParams.isQueryLog">{{$t("m.i.common.queryLog")}}</h-button>
              <h-button type="ghost" @click="returnMain">{{$t("m.i.pl.return")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--流水明细弹出框-->
    <h-msg-box v-model="logDetailWin" width="1000" :mask-closable="false" top="10" class="h-form-table-layer"
               :maximize="true" :z-index=1010 @on-maximize="onMaximize" @on-close="logDetailWinClose">
      <p slot="header">
        <span>查询历史</span>
      </p>
      <!--查询表单-->
      <div class="h-form-search-box">
        <h-form :model="detailFormItem" :label-width="90" ref="detailFormItem" cols="4"
                class="h-form-search">
          <h-form-item :label="$t('m.i.common.transDt')" prop="minTransDt">
            <h-date-picker v-model="transDt" type="daterange" :editable=false :showFormat=true
                           placeholder="" @on-change="handleTransDtChange"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.creditAdjustType')" prop="creditAdjustType">
            <h-select v-model="detailFormItem.creditAdjustType" placeholder="">
              <h-option v-for="item in logDetailParams.creditAdjustTypeList" :value="item.key" :key="item.value">{{item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate two-form">
            <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <cust-credit-detail :batchDetailParams="logDetailParams" :isShowPoolBailPcet="true" ref="custCreditDetail"></cust-credit-detail>
      <!--数据展示表格-->
      <h-datagrid
        :columns="detailColumns"
        highlight-row
        url="/pl/credit/CreditManager/creditControlLogForPool/func_pagingQueryControlLog"
        :bindForm="detailFormItem"
        :autoLoad=false
        ref="detailDatagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="logDetailWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { on, off, post, formatNumber, accMul ,formatBillRange,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";


  export default {
    name: "creditLogDetailForPool",
    data() {
      return {
        columns : [],
        billManagerColumns : [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.pl.poolName"),
            key: "poolName",
            hiddenCol: false
          },
          {
           title:this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title:this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            ellipsis: false
          },
          {
           title:this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title:this.$t("m.i.pl.agreementNo"),
            key: "agreementNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title:this.$t("m.i.pl.billBailAcctNo"),
            key: "billBailAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t('m.i.pl.poolBailSubAcctNo'),
            key: "poolBailSubAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
           title:this.$t("m.i.pc.creditLimitAmt"),
            key: "creditLimitAmt",
            ellipsis: false,
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
           title:this.$t("m.i.pl.inPoolAmt"),
            key: "inPoolAmt",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let inPoolAmt = formatNumber(params.row.inPoolAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: inPoolAmt
                }
              }, inPoolAmt);
            }
          },
          {
            title:this.$t("m.i.pl.bailLimit"),
            key: "bailBalance",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let bailBalance = formatNumber(params.row.bailBalance, 2, ",");
              return h("span", {
                domProps: {
                  title: bailBalance
                }
              }, bailBalance);
            }
          },
          {
           title:this.$t("m.i.pl.usedCreditAmt"),
            key: "usedCreditAmt",
            ellipsis: false,
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
           title:this.$t("m.i.pl.doPoolAmt"),
            key: "doAmt",
            ellipsis: false,
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
        billManagerFormItem : {
          custNo: "",
          poolNo: "",
          batchId: ""
        },
        detailFormItem : {
          creditInfoId: "",
          minTransDt: "",
          maxTransDt: "",
          creditAdjustType: ""
        },
        transDt : [],
        currentSelectRow : [],
        logDetailWin : false,
        isMultiPool: "0", //默认非多池模式
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
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let bOrigin = params.row.billOrigin;
              let list = "-";
              if (bOrigin === "CS01" || bOrigin === "CS02" || bOrigin === "CS03") {
                list = this.getDictValueFromMap(this.logDetailParams.dictMap, "BillOrigin", params.row.billOrigin);
              }
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
            title: this.$t("m.i.pl.creditAdjustType"),
            key: "creditAdjustType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.logDetailParams.dictMap, "PoolCreditAdjustType", params.row.creditAdjustType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.currentTransAmt"),
            key: "creditChangeValue",
            ellipsis: false,
            hiddenCol: false,
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
            title:this.$t("m.i.pl.discountPcet"),
            key: "discountPcet",
            hiddenCol: false,
            render: (h, params) => {
              let discountPcet = params.row.discountPcet;
              if (discountPcet != null && discountPcet !== "" && discountPcet !== 0) {
                discountPcet = formatNumber(accMul(discountPcet, 100), 2, ",");
                return h("span", discountPcet);
              } else {
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.common.transDt"),
            key: "transDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transDt == null || params.row.transDt === "") {
                return "";
              }
              let date = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
          },
          {
            title: this.$t("m.i.pc.operTeller"),
            key: "operTellerNo",
            hiddenCol: false
          }
        ],
      };
    },
    components: {
    },
    props: {
      billManagerVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      logDetailParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          creditAdjustTypeList: [],
          batchId: "",
          custNo: "",
          poolNo: "",
          poolName: "",
          batchUrl: "",
          batchInfoUrl: "",
          isQueryLog: true,
          showSubBillBailAcctNo:false
        }
      }
    },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.logDetailParams.batchId;
          this.billManagerFormItem.custNo = this.logDetailParams.custNo;
          if (this.isMultiPool === "1") {
            this.billManagerFormItem.poolNo = this.logDetailParams.poolNo;
          }
          this.$nextTick(() => {
            if (!this.logDetailParams.showSubBillBailAcctNo) {
              this.billManagerColumns.forEach((value, index) => {
                if (value.key === 'poolBailSubAcctNo') {
                  value.hiddenCol = true;
                }
              });
            }
            this.columns = this.deepClone(this.billManagerColumns);
            this.$refs.billManagerDatagrid.createShowCol(this.columns);
            this.$refs.billManagerDatagrid.dataChange(1);
          });
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
    methods: {
      handleTransDtChange(arr) {
        if (arr&&arr.length==2){
          this.detailFormItem.minTransDt = arr[0].replace(/-/g, "");
          this.detailFormItem.maxTransDt = arr[1].replace(/-/g, "");
          this.transDt = [arr[0], arr[1]];
        } else {
          this.detailFormItem.minTransDt = "";
          this.detailFormItem.maxTransDt = "";
          this.transDt = [];
        }
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.detailDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleSearch() {
        this.detailFormItem.minTransDt = this.detailFormItem.minTransDt.replace(/-/g, "");
        this.detailFormItem.maxTransDt = this.detailFormItem.maxTransDt.replace(/-/g, "");
        this.$refs.detailDatagrid.dataChange(1);
        this.$refs.custCreditDetail.getCreditBatchInfo();
      },
      resetSearch() {
        this.detailFormItem.minTransDt = "";
        this.detailFormItem.maxTransDt = "";
        this.transDt = [];
        this.detailFormItem.creditAdjustType = "";
      },
      //返回主页面
      returnMain() {
        this.$emit("returnMain", "");
      },
      queryLog() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.logDetailWin = true;
          this.$nextTick(() => {
            this.detailFormItem.creditInfoId = this.currentSelectRow.infoId;
            this.logDetailParams.poolNo = this.currentSelectRow.poolNo;
            this.handleSearch();
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.logDetailWin = false;
        }
      },
      logDetailWinClose() {
        this.$refs.detailDatagrid.$refs.gridPage.clearElevator();
        this.resetSearch();
        this.logDetailWin = false;
      }
    },
    mounted() {
      getSingleParamValuesByKeys("pl.plsign.is_multi_pool").then(res => {
        this.isMultiPool = res["pl.plsign.is_multi_pool"];  // 是否允许多池模式
      });
    }
  };
</script>

<style scoped>

</style>
