<template>
  <h-form-item :label="$t('m.i.ce.protectType')" prop="protectType" :required="isRequired">
    <h-select v-model="formItem['protectType']" :placeholder="''">
      <h-option v-for="item in protectTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "protectType",
    data() {
      return {
      }
    },
    props:{
      protectTypeList:Array,
      isRequired :{
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
