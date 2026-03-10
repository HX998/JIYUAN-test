<template>
  <div>
    <common-input v-model="itemValue" :label="label" @on-click="showCpesBrchWin = true" :showIcon="true"
                  :readonly="true" :clearVal="clearVal" :clearValTag="clearValTag" :clearable="true" :prop="prop"></common-input>
    <brch-code-search :brchCodeWin="showCpesBrchWin" optType="2" @brchCodeWinClose="closeBranch" @brchCodeChange="brchCodeChange"></brch-code-search>
  </div>
</template>

<script>
  export default {
    name: "selectCpesBrch",
    data() {
      return {
        showCpesBrchWin: false
      };
    },
    components: {
      BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
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
      className: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: "text"
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
      closeBranch() {
        this.showCpesBrchWin = false;
        this.$emit("closeBranch", "");
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.itemValue = info.brchFullNameZh;
        this.$emit("brchCodeChange", info);
        this.showCpesBrchWin = false;
      }
    }
  };
</script>

<style scoped>

</style>