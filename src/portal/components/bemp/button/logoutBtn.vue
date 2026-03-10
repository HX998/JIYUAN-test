<template>
  <h-button type="primary" @click="handle" :disabled="isDisabled">{{$t("m.i.ebank.logout")}}</h-button>
</template>
<script>
  export default {
    name : "logoutBtn",
    data() {
      return {

      }
    },
    props:{
      isDisabled:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      handle(){
        this.$emit('logout','');
      }

    }
  }
</script>
