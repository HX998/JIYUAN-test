<!--票据种类-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :class="className">
    <h-select v-model="itemValue" :placeholder="placeholder" :showTitle="showTitle" :readonly="readonly"
              :clearable="clearable" @on-change="onChange" :setDefSelect="setDefSelect" :disabled="disabled">
      <h-option v-for="item in dictList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name: "billType",
    props: {
      label: {
        type: String,
        default() {
          return this.$t("m.i.billInfo.billType");
        }
      },
      prop: {
        type: String,
        default: "billType"
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
        type: String,
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
      showTitle: {
        type: Boolean,
        default: true
      },
      clearable: {
        type: Boolean,
        default: true
      },
      dictList: {
        type: Array,
        default() {
          return [];
        }
      },
      setDefSelect: {
        type: Boolean,
        default: false
      },
      disabled: {
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
      onChange(val) {
        this.$emit("on-change", val);
      }
    }
  };
</script>
