<template>
  <h-button type="primary" @click="refusedBatch">{{$t("m.i.common.refuse")}}</h-button>
</template>
<script>
  export default {
    name : "discRefuseBtn",
    data() {
      return {

      }
    },
    props:{
      prodNo: String,
      formItem : Object || {},

    },
    methods:{
      refusedBatch(){
        this.$emit('refuse','');
      }

    }
  }
</script>
