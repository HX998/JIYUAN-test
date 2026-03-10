<template>
  <h-form-item :label="this.$t('m.i.ebank.clearReplyDate')" prop="rcrsDt" required>
    <h-date-picker type="date" v-model="formItem['rcrsDt']"
                   placeholder="" @on-change="handleDateChange" :editable=false readonly></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "clearReplyDate",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
    },
    methods : {
      handleDateChange(value){
        this.formItem.rcrsDt = value.replace(/-/g, "");
      },
    }
  }
</script>
