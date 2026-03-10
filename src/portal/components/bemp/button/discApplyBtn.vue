<template>
  <h-button type="primary" @click="handle" :disabled="isDiscEnable">{{$t("m.i.ebank.discApply")}}</h-button>
</template>
<script>
  export default {
    name : "discApplyBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('discApply','');
      }

    },
    props:{
      isDiscEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
