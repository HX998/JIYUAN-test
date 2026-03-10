<template>
  <h-form-item :label="$t('m.i.billInfo.transCtrctNo')" prop="transCtrctNo" :validRules="transCtrctNoRule">
    <h-input  v-model="formItem.transCtrctNo" :maxlength=40 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "transCtrctNo",
    data() {
      return {
        transCtrctNoRule : [{ test: this.validTransCtrctNo, trigger: "blur" }],
      }
    },
    props:{
      operType: String,
      formItem : Object || {},
      onlyRead:{
        type: Boolean,
        default: true
      },
    },
    methods:{
      validTransCtrctNo(rule, val, callback) {
        let re = /^[0-9a-zA-Z]{0,40}$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error(this.$t('m.i.billInfo.transCtrctNo') + "为小于等于40位数字或字母"));
        }
      },
    }
  }
</script>
