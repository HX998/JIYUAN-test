<template>
  <div>
  <!--票交机构弹出框-->
  <h-msg-box v-model="tempPickBillWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>挑票查询</span>
    </p>
    <!--查询表单-->
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box" :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <!--票据来源-->
              <h-form-item v-if="!hiddenBillOriginSelect" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                <h-select v-model="formItem.billOrigin" placeholder="">
                  <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                <h-input v-model="formItem.billNo" placeholder="多张票据用,分隔"></h-input>
              </h-form-item>
              <bill-range v-if="!hiddenBillOriginSelect" :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
              <h-form-item :label="$t('m.i.billInfo.billType')">
                <h-select v-model="formItem.billType" placeholder="" readonly>
                  <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.billClass')">
                <h-select v-model="formItem.billClass" placeholder="" readonly>
                  <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                  </h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.be.rangeDueDt')" prop="rangeDueDt">
                <h-date-picker :value="rangeDueDt" type="daterange" placeholder="" format="yyyy-MM-dd"
                               showFormat @on-change="handleDueDtChange"></h-date-picker>
              </h-form-item>
              <h-form-item class="h-form-operate">
                <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
          </div>
        </div>
      </h-col>
    </h-row>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      url="/be/trust/transfer/transferRebuyApply/func_queryTransferRebuyBillPage"
      :bindForm="formItem"
      :onRowDbClick="doubleHandleClick"
      :autoLoad="false"
      :row-select="true"
      :has-select="false"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
  <bill-info-main @billInfoWinClose="billInfoPickWinClose" :showBillInfoWin="showBillInfoPickWin" :billId="billId" :billNo="billNo"
                  :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferRebuyPickBill",
    data() {
      return {
        formItem: {
          billNo: "",
          saleBrchCode: "",
          billType: "",
          billClass: "",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          rangeDueDt: "",
          minDueDt: "",
          maxDueDt: ""
        },
        rangeDueDt:[],
        columns: [
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
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key:"billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillOrigin(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoPickWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart, params.row.billRangeEnd)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = formatBillRange(params.row.billOrigin, params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.transferReason'),
            key: "transferReason",
            hiddenCol: false
          }
        ],
        datagridUrl: "/be/trust/transfer/transferRebuyApply/func_queryTransferRebuyBillPage",
        dictMap: null,
        ifShowMore: false,
        billTypeList: [],
        billClassList: [],
        billOriginList: [],
        currentSelectList: [],
        showBillInfoPickWin:false,
        billId:"",
        billRangeStart:"",
        billRangeEnd:"",
        billNo:""
      };
    },
    props: {
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      billType: {
        type: String
      },
      billClass: {
        type: String
      },
      billOrigin: {
        type: String
      },
      saleBrchCode: {
        type: String
      },
      ownedBrchNo:"",
      licenseFlag:false,
      hiddenBillOriginSelect:true,
    },
    watch: {
      pickBillWin(val) {
        if (val === true) {
          this.formItem.billType = this.billType;
          this.formItem.billClass = this.billClass;
          this.formItem.saleBrchCode = this.saleBrchCode;
          this.datagridUrl = "/be/trust/transfer/transferRebuyApply/func_queryTransferRebuyBillPage";
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      },
      hiddenBillOriginSelect(val) {
        // 遍历 columns 找到需要隐藏的字段
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].key === "billRange" || this.columns[i].key === "billOrigin") {
            this.columns[i].hiddenCol = val;
          }
        }
      }
    },
    computed: {
      tempPickBillWin: {
        get() {
          return this.pickBillWin;
        },
        set() {
        }
      }
    },
    methods: {
      billInfoPickWinClose(){
        this.billId=null;
        this.billNo=null;
        this.billRangeStart=null;
        this.billRangeEnd=null;
        this.showBillInfoPickWin=false;
        this.hiddenBillOriginSelect = true;
      },
      billInfoPickWinOpen(billId,billNo,billRangeStart,billRangeEnd){
        this.billId=billId;
        this.billNo=billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoPickWin=true;
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearch() {
        this.formItem.ownedBrchNo = this.ownedBrchNo;
        this.formItem.licenseFlag = this.licenseFlag;
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleDueDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.rangeDueDt = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.rangeDueDt = [];
        }
      },
      formSearchReset() {
        this.rangeDueDt = [];
        this.$refs.formItem.resetFields();
      },
      doubleHandleClick(arr) {
        this.currentSelectList.push(arr);
        this.$emit("pickBillChange", this.currentSelectList);
      },
      handleClose() {
        this.formSearchReset();
        this.$refs.formItem.resetFields();
        this.$emit("pickBillWinClose", "");
      },
      submitForm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length !== 0) {
          this.formSearchReset();
          this.$emit("pickBillChange", this.currentSelectList);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      pageShowFormatBillOrigin(map, groupCode, key) {
        if (key == null || key === '') {
          return '-';
        }
        if (key.toString() === 'CS00') {
          return '-';
        }
        return this.getDictValueFromMap(map, groupCode, key);
      }
    },
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });

    },
    mounted() {
      // 遍历 columns 找到需要隐藏的字段
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].key === "billRange" || this.columns[i].key === "billOrigin") {
          this.columns[i].hiddenCol = this.hiddenBillOriginSelect;
        }
      }
    }
  };
</script>

<style scoped>

</style>
