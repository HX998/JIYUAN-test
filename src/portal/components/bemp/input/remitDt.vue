<template>
  <h-form-item :label="this.$t('m.i.ebank.remitDt')" prop="remitDt">
    <h-date-picker :value="remitDt" type="daterange" showFormat :editable=false
                   @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name : "remitDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
      remitDt:Array
    },
    methods : {
      handleRemitDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        };
      },
    }
  }
</script>
