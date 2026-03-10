<template>
  <h-form-item prop="acptBankName" required class="h-form-long-label">
    <h-input v-model="formItem['acptBankName']" placeholder="" :maxlength=60 :lengthByByte="false" :title="formItem.acptBankName" @on-blur="onBlur()" :readonly="readonly"></h-input>
  </h-form-item>
</template>

<script>
    export default {
      name: "acptBankNameTwo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        readonly : {
          type:Boolean,
          default:false
        },
      },
      methods:{
        onBlur(){
          this.$emit('onBlur','');
        }
      }
    }
</script>
