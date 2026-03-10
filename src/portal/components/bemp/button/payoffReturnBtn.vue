<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.payoffReturn")}}</h-button>
</template>
<script>
  export default {
    name : "payoffReturnBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('payoffReturn','');
      }

    }
  }
</script>
