<!--批次号-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required">
    <h-input v-model="itemValue" :placeholder="placeholder" :title="itemValue" :readonly="readonly"
             :maxlength="maxlength" :clearable="clearable"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "batchNo",
    props: {
      label: {
        type: String,
        default() {
          return this.$t("m.i.common.batchNo");
        }
      },
      prop: {
        type: String,
        default: "batchNo"
      },
      required: {
        type: Boolean,
        default: false
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
      maxlength: {
        type: Number,
        default: 50
      },
      clearable: {
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
    }
  };
</script>
