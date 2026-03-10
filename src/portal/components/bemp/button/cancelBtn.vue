<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.common.cancel")}}</h-button>
</template>
<script>
  export default {
    name : "cancelBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('cancel','');
      }

    }
  }
</script>
