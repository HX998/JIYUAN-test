<template>
  <h-button type="primary" @click="handle" :disabled="isGuarntrEnable">{{$t("m.i.ebank.guarntrApply")}}</h-button>
</template>
<script>
  export default {
    name : "guarntrApplyBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('guarntrApply','');
      }

    },
    props:{
      isGuarntrEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
