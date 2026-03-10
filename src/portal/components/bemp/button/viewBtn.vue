<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.view")}}</h-button>
</template>
<script>
  export default {
    name : "viewBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('view','');
      }

    }
  }
</script>
