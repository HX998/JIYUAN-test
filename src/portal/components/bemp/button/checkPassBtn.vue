<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.common.pass")}}</h-button>
</template>
<script>
  export default {
    name : "checkPassBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('checkPass','');
      }

    }
  }
</script>
