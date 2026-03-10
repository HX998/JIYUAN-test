<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.checkAll")}}</h-button>
</template>
<script>
  export default {
    name : "checkAllBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('checkAll','');
      }

    }
  }
</script>
