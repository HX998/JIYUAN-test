<template>
  <h-form-item :label="$t('m.i.billInfo.discInterestRate')" prop="rate" :required="required" :validRules="rateRule">
    <h-input  v-model="formItem.rate" :maxlength=60 :style="{width:'160px'}" :readonly="onlyRead"></h-input>
    <span v-if="formItem.rateType === '360'">(%)</span>
    <span v-if="formItem.rateType === '30'">(‰)</span>
    <span v-if="formItem.rateType === '1'">(‱)</span>
  </h-form-item>
</template>

<script>
  export default {
    name : "discInterestRate",
    data() {
      return {
      }
    },
    props:{
      rateRef:'',
      formItem : Object || {},
      corpScaleList:Array,
      onlyRead :{
        type: Boolean,
        default: false
      },
      rateRule : Array,
      operType: String,
      required: {
        type: Boolean,
        default() {
          return this.formItem.isBillRate==='0';
        }
      }
    },
    methods:{
      queryBailAcctNo(){
        this.$emit('queryBailAcctNo','');
      }
    }
  }
</script>
