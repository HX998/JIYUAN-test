<template>
  <h-form-item :label="$t('m.i.ce.arbitrateMode')" prop="arbitrateMode" >
    <h-select  v-model="formItem.arbitrateMode" :placeholder="''" :maxlength=60 :readonly="onlyRead">
      <h-option v-for="item in arbitrateModeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "arbitrateMode",
    data() {
      return {
      }
    },
    props:{
      arbitrateModeList:Array,
      onlyRead :{
        type: Boolean,
        default: false
      },
      operType: String,
      formItem : Object || {},
    },
    methods:{
    }
  }
</script>
