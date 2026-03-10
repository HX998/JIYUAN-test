<template>
  <h-button type="primary" @click="handle" :disabled="isImpawnEnable">{{$t("m.i.ebank.impawnApply")}}</h-button>
</template>
<script>
  export default {
    name : "impawnApplyBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('impawnApply','');
      }

    },
    props:{
      isImpawnEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
