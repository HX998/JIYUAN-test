<!--点击成交-交易对手类型-->
<template>
  <div>
    <common-input v-model="itemValue" :label="label" @on-click="transBrchTypesWinOpen" :showIcon="true"
                  :readonly="true"></common-input>
    <!--交易对手类型-->
    <show-trans-brch-type :transBrchTypeWin="transBrchTypeWin" :transBrchTypeParams="transBrchTypeParams"
                          @transBrchTypeWinClose="transBrchTypeWinClose" :datagridUrl="datagridUrl"
                          :notinDatagridUrl="notinDatagridUrl" :deleteUrl="deleteUrl"
                          :addUrl="addUrl" :displayType="displayType"></show-trans-brch-type>
  </div>
</template>

<script>
  export default {
    name: "selectTransBrchType",
    components: {
      ShowTransBrchType: () => import(/* webpackChunkName: "be/market/common/showTransBrchType"*/"@/views/bizViews/be/market/common/showTransBrchType")
    },
    data() {
      return {
        transBrchTypeWin: false,
        transBrchTypeForm: {}
      };
    },
    props: {
      value: {
        type: String,
        default: ""
      },
      transBrchTypeParams: {
        batchId: "",
        operate: "tradeClass"
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
        default: "/be/market/clickdeal/sale/saleApply/func_queryBranchClass"
      },
      notinDatagridUrl: {
        type: String,
        default: "/be/market/clickdeal/sale/saleApply/func_queryBranchClassAdd"
      },
      deleteUrl: {
        type: String,
        default: "/be/market/clickdeal/sale/saleApply/func_deleteSaleBranchClass"
      },
      addUrl: {
        type: String,
        default: "/be/market/clickdeal/sale/saleApply/func_addSaleBranchClass"
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
      transBrchTypesWinOpen() {
        this.saveBatch(res => {
          this.transBrchTypeWin = true;
        });
      },
      transBrchTypeWinClose(val) {
        this.itemValue = val;
        this.transBrchTypeWin = false;
        this.$emit("transBrchTypeWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
