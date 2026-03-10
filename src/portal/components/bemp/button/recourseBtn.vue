<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.recourse")}}</h-button>
</template>
<script>
  export default {
    name : "recourseBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('recourse','');
      }

    }
  }
</script>
