<!--通用普通利率框组件-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules" :class="className"
               :style="styles">
    <h-typefield v-model="itemValue" :readonly="readonly" :integerNum="integerNum" :suffixNum="suffixNum"
                 :bigTips="bigTips" :divided="divided" :nonNegative="nonNegative" :placeholder="placeholder"
                 :type="type" :notFormat="notFormat">
      <span slot="append" v-if="append"><slot name="append"></slot></span>
    </h-typefield>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonRate",
    data() {
      return {
        append: false
      };
    },
    props: {
      validRules: {
        type: [Array, String],
        default() {
          return [{
            test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/,
            trigger: "blur",
            message: "利率为0~100之间的数，小数位不超过4位"
          }];
        }
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
        type:  [String, Array],
        default: ""
      },
      styles: {
        type: String,
        default: ""
      },
      value: {
        type: String,
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
        default: 2
      },
      suffixNum: {
        type: [Number, String],
        default: 4
      },
      bigTips: {
        type: Boolean,
        default: false
      },
      divided: {
        type: Boolean,
        default: false
      },
      nonNegative: {
        type: Boolean,
        default: true
      },
      notFormat: {
        type: Boolean,
        default: true
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
    created() {
      this.append = this.$slots.append !== undefined;
    },
    methods: {}
  };
</script>

<style scoped>

</style>
