<template>
  <h-form-item :label="this.$t('m.i.ebank.discInterest')" prop="discInterest" required>
    <h-input v-model="formItem['discInterest']" :maxlength=10 readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "discInterest",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>
