<template>
  <h-form-item :label="$t('m.i.ce.redeemOpenDt')" prop="redeemOpenDt" :required="isRequired" v-if="formItem.prodNo==='01060221' || formItem.prodNo==='01060222'">
    <h-date-picker v-model="formItem.redeemOpenDt" format="yyyy-MM-dd" placeholder="赎回开放日" showFormat :editable=false disabled></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name : "ceRedeemOpenDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
      isRequired :{
        type: Boolean,
        default: false
      },
    },
    methods : {
    }
  }
</script>
