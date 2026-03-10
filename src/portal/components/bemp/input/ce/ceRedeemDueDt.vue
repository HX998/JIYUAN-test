<template>
  <h-form-item :label="$t('m.i.ce.redeemDueDt')" prop="redeemDueDt" :required="isRequired" v-if="formItem.prodNo==='01060221' || formItem.prodNo==='01060222'">
    <h-date-picker v-model="formItem.redeemDueDt" format="yyyy-MM-dd" placeholder="赎回到期日" showFormat :editable=false disabled></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name : "ceRedeemDueDt",
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
