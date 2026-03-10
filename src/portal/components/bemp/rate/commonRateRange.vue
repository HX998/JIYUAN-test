<!--通用利率范围框组件-->
<template>
  <h-form-item :label="label" :required="required" :class="className">
    <h-row>
      <h-col span="11">
        <common-rate v-model="itemValue[rangeProps[0]]" :prop="rangeProps[0]" :validRules="validRules"
                           :required="required" :bigTips="bigTips" :integerNum="integerNum" :suffixNum="suffixNum"
                           :divided="divided" :nonNegative="nonNegative" :notFormat="notFormat" :readonly="readonly"
                            :placeholder="placeholder" styles="width:100%"
                           :className="[{'h-range-required':required === true}]"></common-rate>
      </h-col>
      <h-col span="2" style="text-align: center">-</h-col>
      <h-col span="11">
        <common-rate v-model="itemValue[rangeProps[1]]" :prop="rangeProps[1]" :validRules="validRules"
                           :required="required" :bigTips="bigTips" :integerNum="integerNum" :suffixNum="suffixNum"
                           :divided="divided" :nonNegative="nonNegative" :notFormat="notFormat" :readonly="readonly"
                            :placeholder="placeholder" styles="width:100%"
                           :className="[{'h-range-required':required === true}]"></common-rate>
      </h-col>
    </h-row>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonRateRange",
    props: {
      validRules: {
        type: [Array, String]
      },
      label: {
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
      rangeProps: {//区间框对应prop
        type: Array,
        default: []
      },
      value: {
        type: [String, Object]
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
    methods: {}
  };
</script>
