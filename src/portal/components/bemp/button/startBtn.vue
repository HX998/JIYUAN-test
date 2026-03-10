<template>
  <h-button type="primary" @click="handle" :disabled="isDisabled">{{$t("m.i.ebank.start")}}</h-button>
</template>
<script>
  export default {
    name : "startBtn",
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
        this.$emit('start','');
      }

    }
  }
</script>
