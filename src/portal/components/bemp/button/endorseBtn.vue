<template>
  <h-button type="primary" @click="handle" :disabled="isEndrmstEnable">{{$t("m.i.ebank.endorse")}}</h-button>
</template>
<script>
  export default {
    name : "endorseBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('endorse','');
      }

    },
    props:{
      isEndrmstEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
