<template>
  <h-msg-box maximize v-model="showBrchCompareWin" width="900" :height="getHeight" @on-close="handleClose" top="10" :z-index="1010">
    <p slot="header">
      <span>{{$t('m.i.pc.subjectCompareInfo')}}</span>
    </p>
    <div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        highlight-row
        url="/pc/acct/compareresult/func_querySubjectBrchCompareResList"
        :bindForm="formItem"
        :auto-load="false"
        :onRowClick="handlelRowClick"
        :onSelectChange="handleSelectClick" ref="datagrid">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
    </div>
  </h-msg-box>
</template>
<script>
  import { post, on, getDictValueFromMap,formatNumber, off } from "@/api/bizApi/commonUtil";

  export default {
    name: 'subjectBrchCompareResult',
    data() {
      return {
        formItem : {
          compareDt: "",
          subjectNo: ""
        },
        compareResultList: Array,
        type : null,
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center'
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            sortable: true,
            hiddenCol:false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t('m.i.pc.coreBalanceAmt'),
            key: "coreBalanceAmt",
            align: 'right',
            sortable: true,
            hiddenCol: false,
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
            sortable: true,
            hiddenCol:false,
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
              return h("span", {
                domProps: {
                  title: dictValue
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
    props: {
      //页面是否展示
      showBrchCompareWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      //登记中心ID
      compareDt: "",
      subjectNo:""
    },
    computed: {
      // tempBrchCompareWin: {
      //   get() {
      //     return this.showBrchCompareWin;
      //   },
      //   set() {
      //   }
      // },
      getHeight() {
        return window.innerHeight - 240;
      }
    },
    components: {

    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //关闭页面处理
      handleClose() {
        this.$emit("brchCompareWinClose", "");
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
      showBrchCompareWin(val) {
        if (val) {
          //页面打开
          this.formItem.compareDt = this.compareDt;
          this.formItem.subjectNo = this.subjectNo;
          this.$nextTick(() => {
            this.formSearch();
          });
        } else {
          this.formItem.compareDt = "";
          this.formItem.subjectNo = "";
        }
      }
    },
    mounted() {
      this.getDictListByGroups("CompareResultCode").then(res => {
        this.compareResultList = res.get("CompareResultCode");
        this.dictMap = res.get("map");
      });
    },
  };
</script>
