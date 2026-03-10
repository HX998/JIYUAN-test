<template>
  <h-form-item :label="this.$t('m.i.ebank.guarntrDt')" prop="guarntrDt" required>
    <h-date-picker type="date" v-model="formItem['guarntrDt']"
                   placeholder="" @on-change="handleDateChange" :editable=false readonly></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "guarntrDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
    },
    methods : {
      handleDateChange(value){
        this.formItem.guarntrDt = value.replace(/-/g, "");
      },
    }
  }
</script>
