<template>

  <h-form-item prop="isCheck" :label="this.$t('m.i.ebank.isCheck')">
    <h-radio-group v-model="formItem['isCheck']">
      <h-radio label="1">
        <span>{{ this.$t('m.i.ebank.yes') }}</span>
      </h-radio>
      <h-radio label="0">
        <span>{{ this.$t('m.i.ebank.no') }}</span>
      </h-radio>
    </h-radio-group>
  </h-form-item>
</template>
<script>
  export default {
    name : "isCheck",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
