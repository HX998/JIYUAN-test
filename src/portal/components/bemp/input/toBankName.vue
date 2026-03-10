<template>
  <h-form-item :label="this.$t('m.i.ebank.toBankName')" prop="toBankName" required>
    <h-input v-model="formItem['toBankName']" :maxlength="125"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "toBankName",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>
