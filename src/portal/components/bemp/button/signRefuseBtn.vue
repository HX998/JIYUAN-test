<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.signRefuse")}}</h-button>
</template>
<script>
  export default {
    name : "signRefuseBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('signRefuse','');
      }

    }
  }
</script>
