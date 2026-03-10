<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.passwdReset")}}</h-button>
</template>
<script>
  export default {
    name : "passwdResetBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('passwdReset','');
      }

    }
  }
</script>
