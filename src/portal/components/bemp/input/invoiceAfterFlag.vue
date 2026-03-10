<template>
  <h-form-item prop="invoiceAfterFlag" :label="$t('m.i.ce.invoiceAfterFlag')" :required="isRequired">
    <h-select v-model="formItem.invoiceAfterFlag" placeholder="" showTitle :readonly="onlyRead">
      <h-option v-for="item in youList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name: "invoiceAfterFlag",
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
        default: false,
      },
      formItem : Object || {},
    },
  };
</script>

<style scoped>

</style>
