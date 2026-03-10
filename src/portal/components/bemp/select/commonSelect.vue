<!--通用普通下拉框框组件-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :class="className" v-if="isShow">
    <h-select v-model="itemValue" :placeholder="placeholder" :showTitle="showTitle" :readonly="readonly"
              :clearable="clearable" @on-change="onChange" :multiple="multiple" :isString="isString"
              :setDefSelect="setDefSelect" :disabled="disabled">
      <h-option v-for="item in dictList" :value="item[paramsMap.key]" :key="item[paramsMap.key]">
        {{item[paramsMap.value]}}
      </h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonSelect",
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
        type: [String, Number, Array],
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
      isShow : {
        type: Boolean,
        default: true
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
      paramsMap: {//查询获取下拉数据时对应的key-value，默认从数据字典取值
        type: Object,
        default() {
          return { key: "key", value: "value" };
        }
      },
      multiple: {
        type: Boolean,
        default: false
      },
      isString: {
        type: Boolean,
        default: false
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

<style scoped>

</style>
