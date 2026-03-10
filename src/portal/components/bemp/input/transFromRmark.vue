<template>
  <h-form-item :label="this.$t('m.i.ebank.applyRemark')" prop="transFromRmark" >
    <h-input v-model="formItem['transFromRmark']" placeholder="" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "transFromRmark",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>

<style scoped>

</style>
