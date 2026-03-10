<template>
  <h-form-item :label="this.$t('m.i.ebank.recouDt')" prop="applyDt">
    <h-date-picker :value="applyDt" type="daterange" showFormat :editable=false
                   @on-change="handleRecouDtChange" placeholder=""></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name : "recouDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
      applyDt:Array
    },
    methods : {
      handleRecouDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minApplyDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplyDt = arr[1].replace(/-/g, "");
          this.applyDt = [arr[0], arr[1]];
        } else {
          this.formItem.minApplyDt = "";
          this.formItem.maxApplyDt = "";
          this.applyDt = [];
        };
      },
    }
  }
</script>
