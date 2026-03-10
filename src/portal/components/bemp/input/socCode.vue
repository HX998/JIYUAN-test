<!--统一社会信用代码-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules"
               :class="className">
    <h-input v-model="itemValue" :title="itemValue" :readonly="readonly" :placeholder="placeholder"
             :clearable="clearable" :maxlength="maxlength"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "socCode",
    props: {
      validRules: {
        type: [Array, String],
        default() {
          return [{ test: /^[A-Z0-9\-]{18}$/, trigger: "blur", message: "社会信用代码由18位数字或大写字母组成" }];
        }
      },
      label: {
        type: String,
        default() {
          return this.$t("m.i.common.socCode");
        }
      },
      prop: {
        type: String,
        default: "socCode"
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
        default: "18位数字或大写字母"
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
        default: 18
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
