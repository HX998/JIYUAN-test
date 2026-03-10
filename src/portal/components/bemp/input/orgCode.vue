<!--组织机构代码-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules" :class="className">
    <h-input v-model="itemValue" :readonly="readonly" :placeholder="placeholder" :clearable="clearable"
             :maxlength="maxlength"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "orgCode",
    props: {
      validRules: {
        type: [Array, String],
        default() {
          return [{
            test: /^[0-9A-Z]{8}-[0-9A-Z]$/,
            trigger: "blur",
            message: "组织机构代码由8位数字或大写字母加上一个“-”再加上一位数字或大写字母组成"
          }];
        }
      },
      label: {
        type: String,
        default() {
          return this.$t("m.i.common.orgCode");
        }
      },
      prop: {
        type: String,
        default: "orgCode"
      },
      required: {
        type: Boolean,
        default: false
      },
      className: {
        type: String,
        default: ""
      },
      value: {
        type: [String, Number],
        default: ""
      },
      placeholder: {
        type: String,
        default: ""
      },
      readonly: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      maxlength: {
        type: Number,
        default: 10
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
    }
  };
</script>

<style scoped>

</style>
