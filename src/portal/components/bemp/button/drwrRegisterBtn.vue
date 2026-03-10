<template>
  <h-button type="primary" @click="handle" :disabled="isRegisterEnable">{{$t("m.i.ebank.drwrRegister")}}</h-button>
</template>
<script>
  export default {
    name : "drwrRegisterBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('drwrRegister','');
      }

    },
    props:{
      isRegisterEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
