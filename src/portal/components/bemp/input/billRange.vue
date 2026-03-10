<template>
  <common-input-range :label="label" :required="required" :class="className" :filterRE="filterRE" v-if="isShow"
                      v-model="formItem" :rangeProps="rangeProps" :readonly="readonly" @on-blur="onBlur()"
                      :placeholder="placeholder" type="int" @on-click="onClick()" @on-change="onChange"
                      :clearable="clearable" @on-clear="clearVal(clearValTag)" :maxlength="maxlength"></common-input-range>
</template>

<script>
export default {
  name: "billRange",
  props: {
    label: {
      type: String,
      default() {
        return this.$t("m.i.billInfo.billRange");
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
    formItem: {
      type: Object,
    },
    rangeProps: {//区间框对应prop
      type: Array,
      default() {
        return ["billRangeStart", "billRangeEnd"];
      }
    },
    placeholder: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isShow : {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
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
    maxlength: {
      type: Number,
      default: 12
    },
    filterRE: {
      type: [Object, RegExp],
      default() {
        return /[^0-9]/g
      }
    }
  },
  methods: {
    onClick() {
      this.$emit("on-click", "");
    },
    onChange(event) {
      this.$emit("on-change", event);
    },
    onBlur(){
      this.$emit("on-blur", "");
    }
  }
}
</script>

<style scoped>

</style>
