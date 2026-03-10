<!--创设业务-设立管理-->
<template>
  <h-msg-box v-model="tempShowStdCreation" width="1000" @on-close="handleClose" class="h-form-table-layer"
             :maximize="true" :zIndex="1003" top="45">
    <p slot="header">
      <span>查询标票名称</span>
    </p>
    <div>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <!--基础资产种类-->
          <common-select v-model="formItem.baseAssetType" :label="$t('m.i.bs.baseAssetType')" prop="baseAssetType"
                         :dictList="batchParams.baseAssetTypeList"></common-select>
          <!--标票产品名称-->
          <!--<h-form-item :label="$t('m.i.bs.stdProductName')" prop="stdProductName"  >
            <h-input v-model="formItem.stdProductName" placeholder="" readonly icon="android-search"
                     @on-click="queryProductName"></h-input>
          </h-form-item>-->
          <common-input v-model="formItem.stdProductNameLike" :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                        showIcon @on-click="queryProductName"></common-input>
          <!--电票账号-->
          <h-form-item :label="$t('m.i.bs.ecdsAcctNo')" prop="ecdsAcctNo"  :validRules="validAcctNoRules">
            <h-input v-model="formItem.ecdsAcctNo" :maxlength=32></h-input>
          </h-form-item>
          <!--存托机构名称-->
          <h-form-item :label="$t('m.i.bs.dpstBrchName')" prop="dpstBrchName"  >
            <h-input v-model="formItem.dpstBrchName" placeholder="" readonly icon="android-search"
                     @on-click="queryCpesBrchName"></h-input>
          </h-form-item>
          <!--承销机构名称-->
          <common-input v-model="formItem.sellBrchName" :label="$t('m.i.bs.sellBrchName')"
                        prop="sellBrchName" :maxlength="150"></common-input>
          <!--创设规模（万元内）-->
          <common-type-field-range v-model="formItem" :label="$t('m.i.bs.creationMaxAmt')" class="h-form-long-label" :integerNum="12" :suffixNum="2":validRules="creationMaxAmtRule"
                                   :rangeProps="['minCreationMaxAmt','maxCreationMaxAmt']" :bigTips="false"></common-type-field-range>
          <!--创设期限（天内）-->
          <common-type-field-range v-model="formItem" :rangeProps="['minCreationMaxTerm','maxCreationMaxTerm']" class="h-form-long-label" :integerNum="3":suffixNum="0"
                                   :label="$t('m.i.bs.creationMaxTerm')" prop="remainingPeriod"
                                   :bigTips="false"></common-type-field-range>
          <!--披露日期-->
          <common-date-picker v-model="publishDate" :label="$t('m.i.bs.publishDt')" type="daterange" :autoPlacement="true" @on-change="handlePublishDateChange"></common-date-picker>
          <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
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
          :url="datagridUrl"
          :bindForm="formItem"
          :onCurrentChangeCancel="onCurrentChangeCancel"
          :onCurrentChange="onCurrentChange"
          :onRowDbClick="doubleHandleClick"
          :auto-load="false"
          ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>

    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      :showMemberId="false" :memberId="memberId"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
  </h-msg-box>
</template>

<script>
  import { post, accMul, formatNumber, rateSortMethod } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationProduct",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      return {
        creationMaxAmtRule:[{
          test: /^(?:[1-9]\d{0,11}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "创设规模上限(万元)必须是大于等于0的数字，最多12位整数且小数位不超过两位"
        }],
        validAcctNoRules: [{
          test: /^[0-9a-zA-Z]{1,32}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为32位"
        }],
        formItem: {
          stdProductNo: "",
          stdProductNameLike:"",
          ecdsAcctNo:"",
          dpstBrchCode:"",
          dpstBrchName:"",
          sellBrchName:"",
          minCreationMaxAmt:"",
          maxCreationMaxAmt:"",
          minCreationMaxTerm:"",
          maxCreationMaxTerm:"",
          minPublishDt:"",
          maxPublishDt:"",
        },
        publishDate:[],
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
            sortable: true
          },
          {
            title: this.$t("m.i.bs.baseAssetType"),
            key: "baseAssetType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "BaseAssetType", params.row.baseAssetType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.bs.stdProductName'),
            key: 'stdProductName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.stdProductShortName'),
            key: 'stdProductShortName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.stdProductNo'),
            key: 'stdProductNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.ecdsAcctNo'),
            key: 'ecdsAcctNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.ecdsAcctName'),
            key: 'ecdsAcctName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.dpstBrchName'),
            key: 'dpstBrchName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.dpstBrchCode'),
            key: 'dpstBrchCode',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.sellBrchName'),
            key: 'sellBrchName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bs.creationMaxAmt"),
            key: "creationMaxAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.creationMaxAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.creationMaxTerm'),
            key: 'creationMaxTerm',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bs.financeMaxRatePct'),
            key: 'financeMaxRatePct',
            hiddenCol: false,
            sortable: true,
            sortMethod:(a,b,type)=>{
              return rateSortMethod(a,b,type);
            }
          },
          {
            title: this.$t('m.i.bs.financeMinRatePct'),
            key: 'financeMinRatePct',
            hiddenCol: false,
            sortable: true,
            sortMethod:(a,b,type)=>{
              return rateSortMethod(a,b,type);
            }
          },
          {
            title: this.$t('m.i.bs.preBeginDueDt'),
            key: 'preBeginDueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.preBeginDueDt ? this.$moment(params.row.preBeginDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.preEndDueDt'),
            key: 'preEndDueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.preEndDueDt ? this.$moment(params.row.preEndDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.publishDt'),
            key: 'publishDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.publishDt ? this.$moment(params.row.publishDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.declareEndDtTm'),
            key: 'declareEndDtTm',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.declareEndDtTm ? this.$moment(params.row.declareEndDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
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
          },
          {
            title: this.$t('m.i.bs.raiseDt'),
            key: 'raiseDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.raiseDt ? this.$moment(params.row.raiseDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.paymentDt'),
            key: 'paymentDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.paymentDt ? this.$moment(params.row.paymentDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bs.transPlace'),
            key: 'transPlace',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.batchParams.dictMap, 'TransPlace', params.row.transPlace);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",//资管非法人产品机构类型
        showCpesProductBranch: false,
        showCpesBranch:false,
        datagridUrl:""
      };
    },
    props:{
      showStdCreationProduct:{
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempShowStdCreation: {
        get() {
          return this.showStdCreationProduct;
        },
        set() {
        }
      }
    },
    watch: {
      tempShowStdCreation(val) {
        debugger
        if (val === true) {
          this.datagridUrl=this.batchParams.datagridUrl;
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(1);
            // this.handleSearch();
          });
        }
      }
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.publishDate=[];
        this.formItem.minPublishDt="";
        this.formItem.maxPublishDt="";
        this.formItem.stdProductNo="";
        this.formItem.dpstBrchCode="";
        this.$refs.formItem.resetFields();
      },
      //确定
      submitForm() {
        this.$emit("showStdCreationProductSubmit", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("showStdCreationProductClose", "");
      },
      onCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      onCurrentChange(arr, selectInx) {
        this.currentSelectRow = arr;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("showStdCreationProductSubmit", this.currentSelectRow);
      },
      handlePublishDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minPublishDt = arr[0].replace(/-/g, "");
          this.formItem.maxPublishDt = arr[1].replace(/-/g, "");
          this.publishDate = [arr[0], arr[1]];
        } else {
          this.formItem.minPublishDt = "";
          this.formItem.maxPublishDt = "";
          this.publishDate = [];
        }
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
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        // this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
      },
      // 根据弹框所选数据进行赋值
      queryCpesBrchName() {
        this.showCpesBranch = true;
      },
      showCpesBranchClose() {
        this.showCpesBranch = false;
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.dpstBrchCode = info.brchCode;
        this.formItem.dpstBrchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },
    }
  };
</script>

<style scoped>

</style>
