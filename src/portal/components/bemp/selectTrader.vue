<template>
  <div>
    <common-input v-model="itemValue" :label="label" @on-click="showtrader = true" :showIcon="true"
                  :readonly="readonly" :clearVal="clearVal" :clearValTag="clearValTag" :clearable="clearable" :prop="prop" :required="required"></common-input>
    <trader-id-search :traderIdWin="showtrader" :brchCode="brchCode" @traderIdWinClose="traderIdWinClose" @traderIdChange="traderIdChange"></trader-id-search>
  </div>
</template>

<script>
  export default {
    name: "selectTrader",
    data() {
      return {
        showtrader: false
      };
    },
    components: {
      TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
    },
    props: {
      label: {
        type: String,
        default: ""
      },
      prop: {
        type: String,
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: true
      },
      className: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: "text"
      },
      clearable:{
        type: Boolean,
        default: true
      },
      clearVal: {
        type: Function,
        default() {
          return "";
        }
      },
      clearValTag: {
        type: String,
        default: ""
      },
      brchCode: {
        type: String,
        default: ""
      },
      value: {
        type: String,
        default: ""
      },
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
      traderIdWinClose() {
        this.showtrader = false;
        this.$emit("traderIdWinClose", "");
      },
      //根据弹框所选数据进行赋值
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.itemValue = info.traderName;
        this.$emit("traderIdChange", info);
        this.showtrader = false;
      }
    }
  };
</script>

<style scoped>

</style>
