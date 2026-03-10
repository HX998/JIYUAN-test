<!--对方机构类型输入框-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required"
               :class="{'h-form-height-auto':type==='textarea'}">
    <h-input v-model="itemValue" :icon="showIcon ? 'android-search' : ''" :title="itemValue" :readonly="readonly"
             :placeholder="placeholder" :type="type" @on-click="onClick()" :clearable="clearable"
             @on-clear="clearVal(clearValTag)" :maxlength="maxlength"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "transBrchType",
    props: {
      value: {
        type: String,
        default: ""
      },
      label: {
        type: String,
        default() {
          return this.$t('m.i.be.transBrchType')
        }
      },
      prop: {
        type: String,
        default: "transBrchTypesName"
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
        default: true
      },
      required: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: true
      },
      clearable: {
        type: Boolean,
        default: true
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
        type: Number
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
      }
    }
  };
</script>

<style scoped>

</style>
