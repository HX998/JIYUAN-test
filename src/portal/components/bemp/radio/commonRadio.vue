<!-- 是否已提交互斥单选框 -->
<template>
  <h-form-item :prop="prop" :label="label" :required="required">
    <h-radio-group v-model="itemValue" @on-change="onChange" :canCancel="canCancel">
      <h-radio v-for="(radio ,i) in radioList" :label="radio.lable" @on-click="getCallback(radio, 'on-click')" :key="i">
        <span>{{radio.customLabel ? radio.customLabel : radio.lable}}</span>
      </h-radio>
    </h-radio-group>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonRadio",
    props: {
      label: {
        type: String,
        default() {
          return "单选";
        }
      },
      prop: {
        type: String,
        default: "commonRadio"
      },
      required: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number, Array],
        default: ""
      },
      canCancel: {
        type: Boolean,
        default: false
      },
      radioList: { //单选按钮组
        type: Array,
        required: true,
        default() {
          // lable(必须) : 主键
          // customLabel: 单选按钮
          // callback: 回调方法，如（'on-click':{func: func, param: param}）
          return [{lable: "", customLabel: ""}];
        }
      },
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
      },
      getCallback(radio, name){
        return radio.callback ? radio.callback[name] ? radio.callback[name].func(radio.callback[name].param) : this.defaultFunc(name) : this.defaultFunc(name);
      },
      defaultFunc(name){
        console.warn("No callback method named '" + name +"' was found");
      }
    }
  }
</script>

<style scoped>

</style>
