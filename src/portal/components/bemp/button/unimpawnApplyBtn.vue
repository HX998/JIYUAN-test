<template>
  <h-button type="primary" @click="handle" :disabled="isUnImpawnEnable">{{$t("m.i.ebank.unimpawnApply")}}</h-button>
</template>
<script>
  export default {
    name : "unimpawnApplyBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('unimpawnApply','');
      }

    },
    props:{
      isUnImpawnEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
