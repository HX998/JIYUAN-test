<template>
  <h-button type="ghost" @click="handle" >{{$t("m.i.common.close")}}</h-button>
</template>
<script>
  export default {
    name : "closeBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('close','');
      }

    }
  }
</script>
