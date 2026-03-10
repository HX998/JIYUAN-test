<template>
  <div>
    <!--票交机构弹出框-->
    <h-msg-box v-model="tempPickBillWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="115" ref="formItem" cols="4" class="h-form-search">
          <!--票据来源：下拉框-->
          <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin" v-if="billClass === 'ME02'">
            <h-select v-model="formItem.billOrigin" placeholder="">
              <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
            <h-input v-model="formItem.reverseBillNo" :maxLength="30"></h-input>
          </h-form-item>
          <!--子票区间-->
          <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']" v-if="billClass === 'ME02'"></bill-range>
          <!--<h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">-->
            <!--<h-input v-model="formItem.billNo"></h-input>-->
          <!--</h-form-item>-->
          <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney">
            <h-row>
              <h-col span="11">
                <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                             bigTips></h-typefield>
              </h-col>
              <h-col span="2" style="text-align: center">-</h-col>
              <h-col span="11">
                <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                             bigTips></h-typefield>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                             :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        :url="url+'/unImpawnApply/func_queryPendingUnImpawnApplyBill'"
        :bindForm="formItem"
        :row-select="true"
        :has-select="false"
        :autoLoad="false"
        :param-id="'hldrId'"
        ref="datagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "unImpawnPickBill",
    components: {
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    data() {
      return {
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
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
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
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params;
                type = "billId";
              } else {
                info = params;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),   //子票区间
            key: "billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),   //票据(包)金额
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.pledgorName'),
            key: "oppName",
            hiddenCol: false,
            sortable: true,
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

            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
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
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false

          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false

          }
        ],
        formItem: {
          billNo: "",
          custName: "",
          opponentBrchCode: "",
          minBillMoney: "",
          maxBillMoney: "",
          reverseBillNo:"",
          billOrigin:"",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
        },
        ifShowMore: false,
        brchCodeWin: false,
        currentSelectList: [],
        showBillInfoWin: false,
        billId: null,
        billNo:null,
        billRangeStart:"",
        billRangeEnd:"",
        billOriginList: [],
        url: "pb/trust/unImpawn"
      };
    },
    props: {
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "挑票查询"
      },
      batchId: {
        type: ""
      },
      billType: {
        type: String
      },
      billClass: {
        type: String
      },
      custBrchCode: {
        type: String
      },
      ownedBrchNo:"",
      licenseFlag:false,
    },
    watch: {
      pickBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            let  columns = [];
            if (this.billClass ==='ME01') {
              columns = this.$refs.datagrid.controlColumnsHidden("billOrigin", true);
              columns = this.$refs.datagrid.controlColumnsHidden("billRange", true);
              //this.$refs.datagrid.controlColumnsHidden("billRange", true);
              this.columns = this.deepClone(columns);
            }else{
              columns = this.$refs.datagrid.controlColumnsHidden("billOrigin", false);
              columns = this.$refs.datagrid.controlColumnsHidden("billRange", false);
              this.columns = this.deepClone(columns);
            }
            this.formSearch();
          });
        }
      },
    },
    computed: {
      tempPickBillWin: {
        get() {
          return this.pickBillWin;
        },
        set() {
        }
      },
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      /**超链接点击票号弹出票据明细**/
      showBillInfoa(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      formSearch() {
        this.formItem.ownedBrchNo = this.ownedBrchNo;
        this.formItem.licenseFlag = this.licenseFlag;
        this.formItem.custBrchCode = this.custBrchCode;
        this.formItem.billClass = this.billClass;
        this.formItem.billType = this.billType;
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = null;
        this.formItem.maxBillMoney = null;
      },
      handleClose() {
        this.$emit("pickBillWinClose", "");
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = null;
        this.formItem.maxBillMoney = null;
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },
      submitForm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length !== 0) {
          this.$emit("pickBillChange", this.currentSelectList);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
        this.formItemClearValue();
      },
      formItemClearValue(){
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = null;
        this.formItem.maxBillMoney = null;
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },
      //机构查询界面的开启、关闭和赋值
      brchCodeWinOpen() {
        this.brchCodeWin = true;
      },
      brchCodeWinClose() {
        this.brchCodeWin = false;
      },
      brchCodeChange(info) {
        this.formItem.opponentBrchCode = info.brchCode;
        this.formItem.custName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },
      clearVal(optType) {
        if (optType === "custName") {
          this.formItem.opponentBrchCode = "";
          this.formItem.custName = "";
        }
      },
      showBillInfo(row, type) {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        if (type === "billId") {
          this.billId = row.billId;
        } else {
          this.billNo = row.billNo;
        }
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      }
    },
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,BillOrigin").then(res => {
        this.cdMediaList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
        this.billOriginList = res.get("BillOrigin");
      });
    },

  };
</script>

<style scoped>

</style>
