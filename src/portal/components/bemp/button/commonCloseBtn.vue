<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.commonClose")}}</h-button>
</template>
<script>
  export default {
    name : "commonCloseBtn",
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
