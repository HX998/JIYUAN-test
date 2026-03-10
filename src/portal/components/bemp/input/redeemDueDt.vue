<template>
  <h-form-item prop="redeemDueDt" :label="this.$t('m.i.ebank.discBackEndDt')" :required="isDiscRequired" v-if="isDiscRequired">
    <h-date-picker type="date" v-model="formItem['redeemDueDt']" showFormat
                   placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
  </h-form-item>
</template>

<script>
    export default {
        name: "redeemDueDt",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        isDiscRequired:{
          type:Boolean,
          default:true
        }
      },
      methods : {
        handleDateChange(value){
          this.formItem.redeemDueDt = value.replace(/-/g, "");
        },
      }
    }
</script>

<style scoped>

</style>
