<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.setNoCkeck")}}</h-button>
</template>
<script>
  export default {
    name : "setNoCheckBtn",
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
