<!--点击成交-交易对手类型-->
<template>
  <div>
    <common-input v-model="itemValue" :label="label" @on-click="transBrchCodesWinOpen" :showIcon="true"
                  :readonly="true"></common-input>
    <!--机构代码-->
    <show-trans-brch-Code :transBrchCodeWin="transBrchCodeWin" :transBrchCodeParams="transBrchCodeParams"
                          @transBrchCodeWinClose="transBrchCodeWinClose" :datagridUrl="datagridUrl"
                          :notinDatagridUrl="notinDatagridUrl" :deleteUrl="deleteUrl"
                          :addUrl="addUrl" :dictMap="dictMap" :displayType="displayType"></show-trans-brch-Code>
  </div>
</template>

<script>
  export default {
    name: "selectTransBrchCode",
    components: {
      ShowTransBrchCode: () => import(/* webpackChunkName: "be/market/common/showTransBrchCode"*/"@/views/bizViews/be/market/common/showTransBrchCode")
    },
    data() {
      return {
        transBrchCodeWin: false,
        transBrchCodeForm: {}
      };
    },
    props: {
      value: {
        type: String,
        default: ""
      },
      transBrchCodeParams: {
        batchId: "",
        operate: "tradeClass",
        branchClasss: ""
      },
      saveBatch: {
        type: Function,
        required: true
      },
      label: {
        type: String,
        default: ""
      },
      datagridUrl: {
        type: String,
        default: "/be/market/clickdeal/rebuy/rebuyApply/func_queryBranchCodeList"
      },
      notinDatagridUrl: {
        type: String,
        default: "/be/market/clickdeal/rebuy/rebuyApply/func_queryBranchCodeAddList"
      },
      deleteUrl: {
        type: String,
        default: "/be/market/clickdeal/rebuy/rebuyApply/func_deleteRebuyBranchCode"
      },
      addUrl: {
        type: String,
        default: "/be/market/clickdeal/rebuy/rebuyApply/func_addBranchCode"
      },
      dictMap: {
        type: Map,
        default: {}
      },
      //弹框类型
      displayType: {
        type: String,
        default: "display"
      }
    },
    computed: {
      itemValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("input", val);
        }
      }
    },
    methods: {
      transBrchCodesWinOpen() {
        this.saveBatch(res => {
          this.transBrchCodeWin = true;
        });
      },
      transBrchCodeWinClose(val) {
        this.itemValue = val;
        this.transBrchCodeWin = false;
        this.$emit("transBrchCodeWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
