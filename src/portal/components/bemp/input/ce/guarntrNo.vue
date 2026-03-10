<template>
  <h-form-item :label="$t('m.i.ce.guarntrNo')" prop="bailAcctNo" :required="isRequired">
    <h-input v-model="formItem.bailAcctNo" :placeholder="''" readonly icon="android-search" @on-clear="clearVal('guarntrNo')" clearable @on-click="queryBailAcctNo"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "guarntrNo",
    data() {
      return {
      }
    },
    props:{
      formItem : Object || {},
      corpScaleList:Array,
      isRequired :{
        type: Boolean,
        default: false
      },
      operType: String,

    },
    methods:{
      queryBailAcctNo(){
        this.$emit('queryBailAcctNo','');
      },
      clearVal(type){
        this.$emit('clearVal',type);
      }
    }
  }
</script>
