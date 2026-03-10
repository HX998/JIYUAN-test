<!--通用普通时间框组件-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :class="className">
    <h-time-picker v-model="itemValue" :readonly="readonly" :placeholder="placeholder" :type="type" :format="format" :disabled="disabled"
                   :placement="placement" @on-change="onChange()" :clearable="clearable" :editable="editable"
                   @on-clear="clearVal(clearValTag)"></h-time-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonTimePicker",
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
      value: {
        type: [Date, String, Array]
      },
      type: {
        type: String,
        default: "time"
      },
      placeholder: {
        type: String,
        default: ""
      },
      readonly: {
        type: Boolean,
        default: false
      },
      format: {
        type: String,
        default: "HH:mm:ss"
      },
      placement: {
        type: String,
        default: "bottom-start"
      },
      clearable: {
        type: Boolean,
        default: true
      },
      editable: {
        type: Boolean,
        default: false
      },
      disabled: {
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
      onChange(time) {
        this.$emit("on-change", time);
      }
    }
  };
</script>

<style scoped>

</style>
