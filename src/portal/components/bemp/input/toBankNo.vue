<template>
  <h-form-item :label="this.$t('m.i.ebank.toBankNo')" prop="toBankNo" required>
    <h-input v-model="formItem['toBankNo']" :maxlength="12"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "toBankNo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>
