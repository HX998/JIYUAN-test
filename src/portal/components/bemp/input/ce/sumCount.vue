<template>

  <h-form-item :label="$t('m.i.ce.totalCount')" prop="sumCount">
    <h-input  v-model="formItem.sumCount" disabled></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "sumCount",
    data() {
      return {
      }
    },
    props:{
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
    }
  }
</script>
