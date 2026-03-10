<template>
  <h-form-item :label="this.$t('m.i.ebank.recouDate')" prop="applyDt" required>
    <h-date-picker type="date" v-model="formItem['applyDt']"
                   placeholder="" @on-change="handleDateChange" :editable=false readonly></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "recouDate",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
    },
    methods : {
      handleDateChange(value){
        this.formItem.applyDt = value.replace(/-/g, "");
      },
    }
  }
</script>
