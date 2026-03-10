<!--票据金额范围框-->
<template>
  <h-form-item :label="label" :required="required" :class="className">
    <h-row>
      <h-col span="11">
        <common-type-field v-model="itemValue[rangeProps[0]]" :prop="rangeProps[0]" :validRules="validRules"
                           :required="required" :bigTips="bigTips" :integerNum="integerNum" :suffixNum="suffixNum"
                           :divided="divided" :nonNegative="nonNegative" :notFormat="notFormat" styles="width:100%"
                           :className="[{'h-range-required':required === true}]"></common-type-field>

      </h-col>
      <h-col span="2" style="text-align: center">-</h-col>
      <h-col span="11">
        <common-type-field v-model="itemValue[rangeProps[1]]" :prop="rangeProps[1]" :validRules="validRules"
                           :required="required" :bigTips="bigTips" :integerNum="integerNum" :suffixNum="suffixNum"
                           :divided="divided" :nonNegative="nonNegative" :notFormat="notFormat" styles="width:100%"
                           :className="[{'h-range-required':required === true}]"></common-type-field>

      </h-col>
    </h-row>
  </h-form-item>
</template>

<script>
  export default {
    name: "billMoneyRange",
    props: {
      validRules: {
        type: [Array, String]
      },
      label: {
        type: String,
        default() {
          return this.$t("m.i.billInfo.billMoney");
        }
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
        default() {
          return ["minBillMoney", "maxBillMoney"];
        }
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
        type: Number,
        default: 12
      },
      suffixNum: {
        type: Number,
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
    methods: {}
  };
</script>
