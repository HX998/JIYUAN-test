<template>
  <h-button type="primary" @click="handle" >{{$t("m.i.ebank.uncheckAll")}}</h-button>
</template>
<script>
  export default {
    name : "uncheckAllBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('uncheckAll','');
      }

    }
  }
</script>
