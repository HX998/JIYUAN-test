<template>
  <h-form-item prop="forceInvoiceFlag" :label="$t('m.i.ce.forceInvoiceFlag')" :required="isRequired">
    <h-select v-model="formItem.forceInvoiceFlag" placeholder="" showTitle :readonly="onlyRead">
      <h-option v-for="item in youList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name: "forceInvoiceFlag",
    data() {
      return {
      }
    },
    props: {
      youList: Array,
      isRequired :{
        type: Boolean,
        default: true
      },
      onlyRead :{
        type: Boolean,
        default: false
      },
      formItem : Object || {},
    },

  };
</script>

<style scoped>

</style>
