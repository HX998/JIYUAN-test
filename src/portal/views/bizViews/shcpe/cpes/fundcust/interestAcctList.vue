<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.brchName')" prop="branchName">
                  <h-input v-model="formItem.brchCode" v-show="false"></h-input>
                  <h-input v-model="formItem.branchName" placeholder="" readonly :title="formItem.branchName"
                           icon="android-search" @on-click="queryCpesBrchCode()"></h-input>
                </h-form-item>-->

                <show-cpes-branch v-model="formItem.brchCode" :label="$t('m.i.common.brchName')"
                                  :brchCode.sync="formItem.brchCode"  :cpesBrchName.sync="formItem.branchName"
                                  datagridUrl="/shcpe/cpes/branch/agencyInformation/func_queryBranchs"
                                  queryUrl="/shcpe/cpes/branch/agencyInformation/func_queryBranchs"></show-cpes-branch>

                <h-form-item prop="operDate" label="结束日期">
                  <h-date-picker v-model="formItem.operDate" format="yyyy-MM-dd" type="daterange" placeholder=""
                                 showFormat :editable=false @on-change="handleOperDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/fundCust/fundCustInfo/acctInterestList/func_queryAcctInterestList"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 票交机构弹出框 -->
    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange"></brch-code-search>-->
  </div>
</template>

<script>
  import { post, on,off,formatNumber,getDictListByGroups} from "@/api/bizApi/commonUtil";

  export default {
    name: "interestAcctList",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
    },
    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: true
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctName'),
            key: "fundAcctName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.beginDt"),
            key: "beginInterestDt",
            hiddenCol: false,
            render: (h, params) => {
              let date = params.row.beginInterestDt == null ? "-" : this.$moment(params.row.beginInterestDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.shcpe.endDt"),
            key: "endInterestDt",
            hiddenCol: false,
            render: (h, params) => {
              let date = params.row.endInterestDt == null ? "-" : this.$moment(params.row.endInterestDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.shcpe.interestMoney"),
            key: "interestAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.interestAmt, 2, ','))
              ]);
            }
          }
        ],
        formItem: {
          brchCode: "",
          branchName: "",
          minEndInterestDt: "",
          maxEndInterestDt: "",
          operDate: ""
        },
        type: null,
        readonly: false,
        isRequired: true,
        submitFlag: false,
        copyWin: false,
        //brchCodeWin: false,
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
        //机构查询弹出框
      };
    },
    watch: {},

    computed: {},
    methods: {
      //票交机构弹出框
      /*queryCpesBrchCode() {
        this.brchCodeWin = true;
      },*/
     //关闭查询票交机构窗口
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if(info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.brchCode = info.brchCode;
        this.formItem.branchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },*/
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.brchCode = "";
        this.formItem.branchName= "";
        this.formItem.operDate = "";
        this.formItem.minEndInterestDt = "";
        this.formItem.maxEndInterestDt = "";
      },
      handleOperDateChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.minEndInterestDt = arr[0].replace(/-/g, "");
          this.formItem.maxEndInterestDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minEndInterestDt = "";
          this.formItem.maxEndInterestDt = "";
        }
      },

    },
    created() {
    }

  };
</script>

<style scoped>

</style>
