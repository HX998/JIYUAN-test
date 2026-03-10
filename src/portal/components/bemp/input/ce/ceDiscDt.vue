<template>
  <h-form-item :label="this.$t('m.i.billInfo.discDt')" prop="discDt" :required="isRequired">
    <h-date-picker v-model="formItem.discDt" :options="discOptions" :readonly="onlyRead"
                   format="yyyy-MM-dd" placeholder="" showFormat :editable=false  @on-change="handleDateChange"></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "ceDiscDt",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
      onlyRead :{
        type: Boolean,
        default: false
      },
      isRequired :{
        type: Boolean,
        default: false
      },
      discOptions : {
        disabledDate (date) {
          return date && date.valueOf() < this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
        }
      },
    },
    methods : {
      handleDateChange(value){
        this.formItem.discDt = value.replace(/-/g, "");
      },
    }
  }
</script>
