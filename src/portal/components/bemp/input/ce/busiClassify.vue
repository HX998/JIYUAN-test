<template>
  <h-form-item :label="$t('m.i.be.assetIndustry')" prop="busiClassify" required >
    <h-select v-model="formItem.busiClassify" style="width: 250px" :readonly="this.isAllowChangeProdType === '0'">
      <h-option v-for="item in busiClassifyList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "busiClassify",
    data() {
      return {
      }
    },
    props:{
      busiClassifyList:Array,
      isRequired :{
        type: Boolean,
        default: true
      },
      isAllowChangeProdType: String,
      formItem : Object || {},
    },
    methods:{

    }
  }
</script>
