<template>
  <h-form-item :label="label" prop="dueDt" :required="required">
    <h-date-picker type="date" v-model="formItem['dueDt']" showFormat :readonly="readonly"
                   placeholder="" @on-change="handleDateChange" :editable=false autoPlacement></h-date-picker>
  </h-form-item>
</template>

<script>
    export default {
        name: "dueDate",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        required: {
          type: Boolean,
          default: true
        },
        readonly: {
          type: Boolean,
          default: false
        },
        label: {
          type: String
        }
      },
      methods : {
        handleDateChange(value){
          if(value !== null && value.length !== 0){
            this.formItem.dueDt = value.replace(/-/g, "");
          }else {
            this.formItem.dueDt = "";
          }

        },
      }
    }
</script>
