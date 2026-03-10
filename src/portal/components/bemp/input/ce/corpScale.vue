<template>
  <h-form-item :label="$t('m.i.common.corpScale')" prop="corpScale" :required="isRequired">
    <h-select v-model="formItem.corpScale" readonly placeholder="">
      <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "corpScale",
    data() {
      return {
      }
    },
    props:{
      formItem : Object || {},
      corpScaleList:Array,
      isRequired :{
        type: Boolean,
        default: true
      },
      operType: String,

    },
    methods:{

    }
  }
</script>
