<template>
  <h-form-item :label="$t('m.i.billInfo.discDt')" prop="discDt">
    <h-date-picker type="date" v-model="formItem.discDt" placeholder="" @on-change="handleDiscDtChange" :editable=false></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "discDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
    },
    methods : {
      handleDiscDtChange(value){
        this.formItem.discDt = value.replace(/-/g, "");
      },
    }
  }
</script>
