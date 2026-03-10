<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.recourseCancel")}}</h-button>
</template>
<script>
  export default {
    name : "recourseCancelBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('recourseCancel','');
      }

    }
  }
</script>
