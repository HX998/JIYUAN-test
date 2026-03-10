<!--通用普通文本框组件-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules" :onlyBlurRequire="onlyBlurRequire"
               :class="[{'h-form-height-auto':type==='textarea'}, className]">
    <h-input v-model="itemValue" :icon="showIcon ? 'android-search' : ''" :title="itemValue" :readonly="readonly" :lengthByByte="lengthByByte"
             :placeholder="placeholder" :type="type" @on-click="onClick()" @on-change="onChange"  @on-blur="onBlur" :clearable="clearable"
             @on-clear="clearVal(clearValTag)" :maxlength="maxlength" :rows="rows" :canResize="canResize" :autosize="autosize" :filterRE="filterRE"
             @on-focus="onFocus"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonInput",
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
      onlyBlurRequire: {
        type: Boolean,
        default: false
      },
      className: {
        type: [String, Array],
        default: ""
      },
      value: {
        type: [String, Number],
        default: ""
      },
      type: {
        type: String,
        default: "text"
      },
      placeholder: {
        type: String,
        default: ""
      },
      showIcon: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      clearVal: {
        type: Function
      },
      clearValTag: {
        type: String,
        default: ""
      },
      maxlength: {
        type: Number
      },
      rows: {
        type: Number,
        default: 2
      },
      canResize: {
        type: Boolean,
        default: false
      },
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      lengthByByte: {
        type: Boolean,
        default: true
      },
      filterRE: {
        type: [Object, RegExp],
        default() {
          return /[^\w`·~!@#$%^……&*()-——_=+\[\]{}\\|;:'"’”,.<>/?‘’“”\s\u4e00-\u9fa5\uFF00-\uFFEF\u2E80-\u2EFF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\uFE10-\uFE1F\uFE30-\uFE4F]/g
        }
      }
    },
    computed: {
      itemValue: {
        get(){
          return this.value;
        },
        set(val){
          this.$emit('input', val);
        }
      }
    },
    methods: {
      onClick() {
        this.$emit("on-click", "");
      },
      onChange(event){
        this.$emit("on-change", event);
      },
      onBlur(){
        this.$emit("on-blur", "");
      },
      onFocus(){
        this.$emit("on-focus", "");
      }
    }
  };
</script>

<style scoped>

</style>
