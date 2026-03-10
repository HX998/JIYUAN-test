<!-- 是否已提交互斥单选框 -->
<template>
  <h-form-item :prop="prop" :label="label" :required="required">
    <h-radio-group v-model="itemValue" @on-change="onChange">
      <h-radio :label="radioLabel[0]" @on-click="onClick('noCommit', radioLabel[0])">
        <span>{{radioCustomLabel[0]}}</span>
      </h-radio>
      <h-radio :label="radioLabel[1]" @on-click="onClick('hasCommit', radioLabel[1])">
        <span>{{radioCustomLabel[1]}}</span>
      </h-radio>
    </h-radio-group>
  </h-form-item>
</template>

<script>
  export default {
    name: "isCommitRadio",
    props: {
      label: {
        type: String,
        default() {
          return this.$t('m.i.ce.isCommit');
        }
      },
      prop: {
        type: String,
        default: "isCommit"
      },
      required: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number, Array],
        default: ""
      },
      radioLabel: {//指定当前选项的 value 值，只在组合使用时有效
        type: Array,
        default() {
          return ["0", "1"];
        }
      },
      radioCustomLabel: {//单选框显示值
        type: Array,
        default() {
          return [this.$t("m.i.ce.noCommit"), this.$t("m.i.ce.hasCommit")];
        }
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
      onClick(isCommit, val) {
        this.$emit("on-click", isCommit, val);
      },
      onChange(val) {
        this.$emit("on-change", val);
      }
    }
  }
</script>

<style scoped>

</style>
