<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.signBatch")}}</h-button>
</template>
<script>
  export default {
    name : "signBatchBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('signBatch','');
      }

    }
  }
</script>
