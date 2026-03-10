<template>
  <h-form-item v-if="isShow" :label="this.$t('m.i.ebank.recouMoney')" prop="draftTransAmt">
    <h-input v-model="formItem['draftTransAmt']" placeholder="" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "draftTransAmt",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        isShow:{
          type:Boolean,
          default:false
        }
      }
    }
</script>

<style scoped>

</style>
