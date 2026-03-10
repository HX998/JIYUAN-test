<template>
  <h-form-item :label="applType === 'impawn' ? this.$t('m.i.ebank.impawnDt') : this.$t('m.i.ebank.endorDate')" prop="impawnDt" required>
    <h-date-picker type="date" v-model="formItem['impawnDt']"
                   placeholder="" @on-change="handleDateChange" :editable=false readonly></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "impawnDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
      applType:{
        type:String,
        default:''
      }
    },
    methods : {
      handleDateChange(value){
        this.formItem.impawnDt = value.replace(/-/g, "");
      },
    }
  }
</script>
