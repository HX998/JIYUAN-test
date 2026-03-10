<!--通用普通金额框组件-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules" :class="className"
               :style="styles">
    <h-typefield v-model="itemValue" :readonly="readonly" :integerNum="integerNum" :suffixNum="suffixNum"
                 :bigTips="bigTips" :divided="divided" :nonNegative="nonNegative" :placeholder="placeholder"
                 :type="type" :notFormat="notFormat" @on-change="onChange"  @on-blur="onBlur" @on-enter="onEnter"></h-typefield>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonTypeField",
    props: {
      validRules: {
        type: [Array, String]
      },
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
        type: [String, Array],
        default: ""
      },
      styles: {
        type: String,
        default: ""
      },
      value: {
        type: [String, Number],
        default: ""
      },
      type: {
        type: String,
        default: "money"
      },
      placeholder: {
        type: String,
        default: ""
      },
      readonly: {
        type: Boolean,
        default: false
      },
      integerNum: {
        type: [Number, String],
        default: 12
      },
      suffixNum: {
        type: [Number, String],
        default: 2
      },
      bigTips: {
        type: Boolean,
        default: true
      },
      divided: {
        type: Boolean,
        default: true
      },
      nonNegative: {
        type: Boolean,
        default: false
      },
      notFormat: {
        type: Boolean,
        default: false
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
      onChange(value, oldValue){
        this.$emit("on-change", value, oldValue);
      },
      onBlur(event, isChange){
        this.$emit("on-blur", event, isChange);
      },
      onEnter(event) {
        this.$emit("on-enter", event);
      },
    }
  };
</script>

<style scoped>

</style>
