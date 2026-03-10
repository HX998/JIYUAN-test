<template>
  <h-form-item :label="this.$t('m.i.ebank.mouthDt')" prop="mouthDt" required>
    <h-date-picker type="date" v-model="formItem['mouthDt']"
                   placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "mouthDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
    },
    methods : {
      handleDateChange(value){
        this.formItem.mouthDt = value.replace(/-/g, "");
      },
    }
  }
</script>
