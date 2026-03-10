<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.check")}}</h-button>
</template>
<script>
  export default {
    name : "checkBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('check','');
      }

    }
  }
</script>
