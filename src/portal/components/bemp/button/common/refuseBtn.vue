<template>
  <h-button type="primary" @click="refusedBatch" v-if="prodNo.indexOf('010611') === -1">{{$t("m.i.common.refuse")}}</h-button>
</template>
<script>
  export default {
    name : "refuseBtn",
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
