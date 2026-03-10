<template>
  <h-form-item prop="remitDt" required>
    <h-date-picker type="date" v-model="formItem['remitDt']"
                   placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "remitDate",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
    },
    methods : {
      handleDateChange(value){
        this.formItem.remitDt = value.replace(/-/g, "");
      },
    }
  }
</script>
