<template>
  <h-form-item :label="this.$t('m.i.ebank.prsnttnDt')" prop="prsnttnDt" required>
    <h-date-picker type="date" v-model="formItem['prsnttnDt']" readonly
                   placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "prsnttnDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
    },
    methods : {
      handleDateChange(value){
        this.formItem.prsnttnDt = value.replace(/-/g, "");
      },
    }
  }
</script>
