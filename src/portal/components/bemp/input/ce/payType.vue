<template>
  <h-form-item :label="$t('m.i.ce.interestMethod')" prop="payType" :required="isRequired" >
    <h-select  v-model="formItem.payType" :maxlength=60 @on-change="payTypeChange" :readonly="onlyRead">
      <h-option v-for="item in payTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "payType",
    data() {
      return {
      }
    },
    props:{
      payTypeList:Array,
      onlyRead :{
        type: Boolean,
        default: false
      },
      isRequired :{
        type: Boolean,
        default: true
      },
      operType: String,
      formItem : Object || {},
    },
    methods:{
      payTypeChange(){
        this.$emit('payTypeChange','');
      }
    }
  }
</script>
