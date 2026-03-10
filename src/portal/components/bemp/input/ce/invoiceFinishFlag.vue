<template>
  <h-form-item prop="invoiceFinishFlag" :label="$t('m.i.ce.invoiceFinishFlag')" :required="isRequired">
    <h-select v-model="formItem.invoiceFinishFlag" placeholder="" showTitle>
      <h-option v-for="item in youList" :value="item.key" :key="item.key">{{item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name: "invoiceFinishFlag",
    data() {
      return {
      }
    },
    props: {
      youList: Array,
      isRequired :{
        type: Boolean,
        default: false
      },
      formItem : Object || {},
    },
  };
</script>

<style scoped>

</style>
