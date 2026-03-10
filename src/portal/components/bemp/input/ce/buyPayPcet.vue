<template>
  <h-form-item :label="$t('m.i.ce.buyPayPcet')" prop="buyPayPcet" :required="formItem.payType === '3'" v-if="formItem.payType === '3'" :validRules="buyPayPcetRule">
    <h-input  v-model="formItem.buyPayPcet" :maxlength=60  :style="{width:'160px'}" :readonly="onlyRead"></h-input><span>(%)</span>
  </h-form-item>
</template>

<script>
    export default {
        name: "buyPayPcet",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        showIcon :{type: Boolean,
          default: true},
        onlyRead:{
          type: Boolean,
          default: true
        },
        required :{
          type: Boolean,
          default: false
        },
        buyPayPcetRule: Array,
        // buyPayPcetRule : [{test: validBuyPayPcetRule, trigger:'blur'}],
      },
      methods:{

      }
    }
</script>
