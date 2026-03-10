<template>
  <h-form-item :label="$t('m.i.ce.rateType')" prop="rateType" :required="formItem.isBillRate==='0'" >
    <h-select  v-model="formItem.rateType" :readonly="onlyRead" :disabled="isDisabled">
      <h-option v-for="item in rateTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "rateType",
    data() {
      return {
      }
    },
    props:{
      rateTypeList:Array,
      onlyRead :{
        type: Boolean,
        default: false
      },
      isDisabled:{
        type: Boolean,
        default: true
      },
      operType: String,
      formItem : Object || {},
    },
    methods:{

    }
  }
</script>
