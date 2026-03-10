<template>
  <h-form-item :label="$t('m.i.common.isGreenCorp')" prop="isGreenCorp" :required="isRequired">
    <h-select v-model="formItem.isGreenCorp" readonly placeholder="">
      <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "isGreenCorp",
    data() {
      return {
      }
    },
    props:{
      formItem : Object || {},
      isList:Array,
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
