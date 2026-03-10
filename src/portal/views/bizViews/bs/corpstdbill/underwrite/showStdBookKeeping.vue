<template>
  <h-msg-box v-model="tempShowStdBookKeepingWin" width="1000" @on-close="handleClose" class="h-form-table-layer"
             :maximize="true" :zIndex="1003" top="45">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <!--产品规模(元)-->
          <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationAmt')" :integerNum="16"
                                   :suffixNum="2"
                                   :validRules="creationAmtRule" :rangeProps="['minCreationAmt','maxCreationAmt']"
                                   :bigTips="false"></common-type-field-range>
          <!--标票产品名称-->
          <h-form-item :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike">
            <h-input v-model="formItem.stdProductNameLike" placeholder="" icon="android-search"
                     @on-click="queryProductName" :maxlength="60" lengthByByte></h-input>
          </h-form-item>
          <!--认购日期-->
          <common-date-picker v-model="purchaseDate" :label="$t('m.i.bs.purchaseDt')" type="daterange"
                              :autoPlacement="true" @on-change="handlePurchaseDateChange"></common-date-picker>
          <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch"
                     :formSearchReset="resetSearch"></query-btn>
        </h-form>
      </div>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="columns"
          highlight-row
          :url="bookUrl"
          :bindForm="formItem"
          :onCurrentChangeCancel="onCurrentChangeCancel"
          :onCurrentChange="onCurrentChange"
          :onRowDbClick="doubleHandleClick"
          :auto-load="false"
          ref="datagridShow">
        </h-datagrid>
      </h-col>
    </h-row>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
    <std-book-keeping-detail :stdBookKeepingDetailWin="stdBookKeepingDetailWin" :batchParams="batchParams"
                             :dictMap="dictMap"
                             @stdBookKeepingDetailClose="stdBookKeepingDetailClose"
                             ref="stdBookKeepingDetail"></std-book-keeping-detail>
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
  </h-msg-box>
</template>

<script>
  import {post, formatNumber} from "@/api/bizApi/commonUtil";
  export default {
    name: "showStdBookKeeping",
    components: {
      StdBookKeepingDetail: () => import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdBookKeepingDetail" */`@/views/bizViews/bs/corpstdbill/underwrite/stdBookKeepingDetail`),
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      return {
        creationAmtRule: [{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "产品规模(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        formItem: {
          minCreationAmt: "",
          maxCreationAmt: "",
          stdProductNo: "",
          stdProductNameLike: "",
          minPurchaseDt: "",
          maxPurchaseDt: "",
        },
        purchaseDate: [],
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.stdBookKeepingDetailOpen(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t('m.i.bs.stdProductName'),
            key: 'stdProductName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.stdProductShortName'),
            key: 'stdProductShortName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.bs.creationAmt"),
            key: "creationAmt",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.creationAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.purchaseDt'),
            key: 'purchaseDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.purchaseDt ? this.$moment(params.row.purchaseDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        isList: [],
        priceMethodList: [],
        stdBookKeepingDetailWin: false,
        batchParams: {},
        batchId: "",
        bookUrl: "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_queryStdBookKeepingPage",
      };
    },
    props: {
      title: {
        type: String,
        default() {
          return "查询簿记信息"
        }
      },
      showStdBookKeepingWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      bookParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempShowStdBookKeepingWin: {
        get() {
          return this.showStdBookKeepingWin;
        },
        set() {
        }
      }
    },
    watch: {
      tempShowStdBookKeepingWin(val) {
        if (val === true) {
          if (this.bookParams.bookUrl) {
            this.bookUrl = this.bookParams.bookUrl;
          }
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = null;
            this.$refs.datagridShow.dataChange(1);
          });
        }
      }
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagridShow.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.purchaseDate = [];
        this.formItem.minPurchaseDt = "";
        this.formItem.maxPurchaseDt = "";
        this.formItem.stdProductNo = "";
        this.$refs.formItem.resetFields();
      },
      handlePurchaseDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minPurchaseDt = arr[0].replace(/-/g, "");
          this.formItem.maxPurchaseDt = arr[1].replace(/-/g, "");
          this.purchaseDate = [arr[0], arr[1]];
        } else {
          this.formItem.minPurchaseDt = "";
          this.formItem.maxPurchaseDt = "";
          this.purchaseDate = [];
        }
      },
      //确定
      submitForm() {
        this.$emit("showStdBookKeepingSubmit", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("showStdBookKeepingClose", "");
      },
      onCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      onCurrentChange(arr, selectInx) {
        this.currentSelectRow = arr;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("showStdBookKeepingSubmit", this.currentSelectRow);
      },
      // 根据弹框所选数据进行赋值
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, {info: "请先选择记录！"});
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        this.showCpesProductBranch = false;
      },
      stdBookKeepingDetailOpen(id) {
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.bookKeepingUrl = "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_findStdBookKeepingById";
        this.stdBookKeepingDetailWin = true;
      },
      stdBookKeepingDetailClose() {
        this.stdBookKeepingDetailWin = false;
        let pageNo = this.$refs.datagridShow.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      }
    },
    mounted() {
      this.getDictListByGroups("Yon,MemberType,PriceMethod,StdBookKeepingFlowStatus").then(res => {
        this.isList = res.get("Yon");
        this.priceMethodList = res.get("PriceMethod");
        this.dictMap = res.get("map");
      });
    },
  };
</script>

<style scoped>

</style>
