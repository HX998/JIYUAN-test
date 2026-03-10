<template>
  <h-form-item :label="$t('m.i.ce.otherBankDisc')" prop="otherBankDiscMark">
    <h-select v-model="formItem.otherBankDiscMark" placeholder="" @on-change="changeIsInner">
      <h-option value="0">否</h-option>
      <h-option value="1">是</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
    export default {
        name: "otherBankDiscMark",
      data() {
        return {
        }
      },
      props:{
        operType: String,
        formItem : Object || {},
        onlyRead:{
          type: Boolean,
          default: true
        },
        isRequired:{
          type: Boolean,
          default: true
        },
        rateRule : Array,

      },
      methods:{
        changeIsInner(){
          this.$emit('changeIsInner','');
        }
      }
    }
</script>
