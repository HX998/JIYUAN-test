<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ce.returnBack")}}</h-button>
</template>
<script>
  export default {
    name : "checkBackBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('checkBack','');
      }

    }
  }
</script>
