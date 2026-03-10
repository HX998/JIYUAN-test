<template>
  <h-form-item prop="redeemOpenDt" :label="this.$t('m.i.ebank.redeemOpenDt')" :required="isDiscRequired" v-if="isDiscRequired">
    <h-date-picker type="date" v-model="formItem['redeemOpenDt']" showFormat
                   placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
  </h-form-item>
</template>

<script>
    export default {
        name: "redeemOpenDt",
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
          this.formItem.redeemOpenDt = value.replace(/-/g, "");
        },
      }
    }
</script>

<style scoped>

</style>
