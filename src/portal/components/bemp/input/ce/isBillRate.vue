<template>
  <h-form-item :label="$t('m.i.ce.isBillRate')" prop="isBillRate" :required="isAllowBillRate">
    <h-select v-model="formItem.isBillRate" :placeholder="''" :readonly="onlyRead || operType==='modify' || isSave" :disabled="isDisabled">
      <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "isBillRate",
    data() {
      return {
      }
    },
    props:{
      isList:Array,
      onlyRead :{
        type: Boolean,
        default: false
      },
      isAllowBillRate:{
        type: Boolean,
        default: false
      },
      isDisabled:{
        type: Boolean,
        default: false
      },
      operType: String,
      isSave : {
        type: Boolean,
        default: false
      },
      formItem : Object || {},
    },
    methods:{

    }
  }
</script>
