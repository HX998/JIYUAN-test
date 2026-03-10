<template>
  <h-form-item :label="this.$t('m.i.shcpe.showeeName')" prop="showeeName" :required="required" v-if="isShow">
    <h-input v-model="formItem['showeeName']" placeholder="" :readonly="readonly" :maxlength=150></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "showeeName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
      required:{
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      isShow : {
        type: Boolean,
        default: true
      },
    }
  }
</script>
