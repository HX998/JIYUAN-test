<template>
  <h-form-item :label="$t('m.i.ce.industryCategory')" prop="industryCategoryName" :required="isRequired" v-show=true>
    <h-input v-model="formItem.industryCategoryName"  icon="android-search" @on-click="queryDetailName"
             readonly ></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "industryCategoryName",
    data() {
      return {
      }
    },
    props:{
      operType: String,
      formItem : Object || {},
      onlyRead:{
        type: Boolean,
        default: true
      },
      isRequired:{
        type: Boolean,
        default: false
      },
    },
    methods:{
      queryDetailName(){
        this.$emit('queryDetailName','');
      },
    }
  }
</script>
