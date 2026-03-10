<template>
  <h-form-item :label="this.$t('m.i.ebank.transDt')" prop="transStartDt">
    <h-date-picker :value="transStartDt" type="daterange" showFormat :editable=false
                   @on-change="handleTransDtChange" placeholder=""></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name : "transDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
      transStartDt:Array
    },
    methods : {
      handleTransDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minTransStartDt = arr[0].replace(/-/g, "");
          this.formItem.maxTransStartDt = arr[1].replace(/-/g, "");
          this.transDt = [arr[0], arr[1]];
        } else {
          this.formItem.minTransStartDt = "";
          this.formItem.maxTransStartDt = "";
          this.transDt = [];
        };
      },
    }
  }
</script>
