<style>

</style>
<!--流水管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row">
                  <h-form-item prop="compareDts" :label="$t('m.i.pc.compareDt')">
                    <h-date-picker v-model="formItem.compareDts" format="yyyy-MM-dd" type="date"
                                   placeholder=""
                                   showFormat :editable=false :clearable="true"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.compareAcctResult')" prop="compareAcctResult">
                    <h-select v-model="formItem.compareAcctResult">
                      <h-option v-for="item in compareResultList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/acct/compareresult/func_querySubjectCompareResList"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick" ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="compare()" v-if="isshow">{{$t('m.i.pc.compare')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <subject-brch-compare-result @brchCompareWinClose="brchCompareWinClose" :showBrchCompareWin="showBrchCompareWin"
                              :compareDt="this.compareDt" :subjectNo="this.subjectNo"></subject-brch-compare-result>
      </h-col>
    </h-row>
  </div>
</template>
<script>
  import { post, on, getSingleParamValuesByKeys, getDictValueFromMap, formatNumber, off } from "@/api/bizApi/commonUtil";

  export default {
    name: 'subjectBalanceCompareResult',
    data() {
      return {
        isshow: false,
        formItem : {
          compareDt: "",
          compareDts: "",
          compareAcctResult: ""
        },
        compareResultList: Array,
        type : null,
        showBrchCompareWin: false,
        subjectNo: "",
        compareDt: "",
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center'
          },
          {
            title: this.$t('m.i.pc.compareDt'),
            key: "compareDt",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t('m.i.pc.subjectNo'),
            key: "subjectNo",
            hiddenCol:false,
            sortable: true
          },

          {
            title:this.$t('m.i.pc.subjectName'),
            key: "subjectName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.pc.coreBalanceAmt'),
            key: "coreBalanceAmt",
            align: 'right',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = formatNumber(params.row.coreBalanceAmt, 2, ',');
              if (params.row.coreBalanceAmt === null || params.row.coreBalanceAmt === ""){
                return h("span", '-');
              }else {
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            }
          },
          {
            title: this.$t('m.i.pc.bempBalanceAmt'),
            key: "bempBalanceAmt",
            align: 'right',
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let list = formatNumber(params.row.bempBalanceAmt, 2, ',');
              if (params.row.bempBalanceAmt === null || params.row.bempBalanceAmt === ""){
                return h("span", '-');
              }else {
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            }
          },
          {
            title: this.$t("m.i.pc.compareAcctResult"),
            key: "compareAcctResult",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = "";
              dictValue = getDictValueFromMap(this.dictMap, "CompareResultCode", params.row.compareAcctResult);
              return h("a", {
                on: {
                  click: () => {
                    this.showBrchCompare(params.row.compareDt, params.row.subjectNo);
                  }
                }
              }, dictValue);
            }
          }],
        currentSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        ifShowMore : false,
      };

    },
    components: {
      SubjectBrchCompareResult: () => import(/*webpackChunkName: "pc/acct/compare/subjectBrchCompareResult"*/`@/views/bizViews/pc/acct/compare/subjectBrchCompareResult.vue`)
    },
    created() {
      this.formItem.compareDt = window.sessionStorage.getItem("preWorkDate");
      this.formItem.compareDts = window.sessionStorage.getItem("preWorkDate");
    },
    methods: {

      showBrchCompare(compareDt, subjectNo){
        this.compareDt = compareDt;
        this.subjectNo = subjectNo;
        this.showBrchCompareWin = true;
      },

      brchCompareWinClose(){
        this.showBrchCompareWin = false;
      },

      formSearch() {
        let compareDt = this.formItem.compareDts.replace(/-/g, "");
        this.formItem.compareDt=compareDt;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.compareDt = window.sessionStorage.getItem("preWorkDate");
        this.formItem.compareDts = window.sessionStorage.getItem("preWorkDate");
        this.formItem.compareAcctResult = "";
      },
      compare(){
        this.$hMsgBox.confirm({
          title: "提交",
          content: "确认提交吗？",
          onOk: () => {
            this.submitCompareAcct();
          }
        });
      },
      submitCompareAcct(){
        let compareDt = this.formItem.compareDt;
        post({compareDt : compareDt},'/pc/acct/compareresult/func_subjectCompare').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this, { info: "操作成功" });
            }else{
              this.$msgTip.error(this,{info:"操作失败:" + res.data.retMsg});
            }
          }else{
            this.$msgTip.error(this,{info:"操作失败"});
          }
        });
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx
        if (arr.length == 0) return
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      }
    },
    watch: {

    },
    mounted() {
      this.getDictListByGroups("CompareResultCode").then(res => {
        this.compareResultList = res.get("CompareResultCode");
        this.dictMap = res.get("map");
      });
      getSingleParamValuesByKeys("pc.acct.is_subject_compare_mode").then(res => {
        let flag = res["pc.acct.is_subject_compare_mode"];
        this.isshow = flag === '1';
      });
    },
  };
</script>
