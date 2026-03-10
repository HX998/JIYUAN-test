<!--交易对手名称-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules"
               :class="{'h-form-height-auto':type==='textarea'}">
    <h-input v-model="itemValue" :icon="showIcon ? 'android-search' : ''" :title="itemValue" :readonly="readonly"
             :placeholder="placeholder" :type="type" @on-click="onClick()" @on-change="onChange" :clearable="clearable"
             @on-clear="clearVal(clearValTag)" :maxlength="maxlength"></h-input>
  </h-form-item>
</template>

<script>
    export default {
      name: "oppName",
      props: {
        validRules: {
          type: [Array, String]
        },
        label: {
          type: String,
          default() {
            return this.$t('m.i.billInfo.oppName')
          }
        },
        prop: {
          type: String,
          default: "oppName"
        },
        required: {
          type: Boolean,
          default: false
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
          default: 125
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
        }
      }
    }
</script>
