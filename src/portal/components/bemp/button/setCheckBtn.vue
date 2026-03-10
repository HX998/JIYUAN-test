<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.setCkeck")}}</h-button>
</template>
<script>
  export default {
    name : "setCheckBtn",
    data() {
      return {
        param: 'modify'
      }
    },
    methods:{
      handle(){
        this.$emit('handleForm',this.param);
      }

    }
  }
</script>
