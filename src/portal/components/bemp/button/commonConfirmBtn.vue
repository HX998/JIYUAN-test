<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.commonConfirm")}}</h-button>
</template>
<script>
  export default {
    name : "commonConfirmBtn",
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
