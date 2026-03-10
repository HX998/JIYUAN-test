<template>
  <h-form-item :label="$t('m.i.ce.industryCategory')" prop="industryCategory" >
    <h-select  v-model="formItem.industryCategory" :placeholder="''" :maxlength=60 :readonly="onlyRead">
      <h-option v-for="item in industryList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "industryCategory",
    data() {
      return {
      }
    },
    props:{
      industryList:Array,
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
