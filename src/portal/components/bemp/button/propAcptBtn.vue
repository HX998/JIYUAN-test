<template>
  <h-button type="primary" @click="handle" :disabled="isAcceptanceEnable">{{$t("m.i.ebank.propAcpt")}}</h-button>
</template>
<script>
  export default {
    name : "propAcptBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('propAcpt','');
      }

    },
    props:{
      isAcceptanceEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
