<template>
  <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo" v-show="false" >
    <h-input  v-model="formItem.custMgrNo" :maxlength=60 readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "custMgrNo",
      data() {
        return {
        }
      },
      props:{
        formItem : Object || {},
        operType: String,
      },
      methods:{

      }
    }
</script>
