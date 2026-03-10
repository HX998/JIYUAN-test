<template>
  <h-button type="ghost" @click="handle" >{{this.$t('m.i.ebank.return')}}</h-button>
</template>
<script>
  export default {
    name : "returnBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('returnData','');
      }

    }
  }
</script>
