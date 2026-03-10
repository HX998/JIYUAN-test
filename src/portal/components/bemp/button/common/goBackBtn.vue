<template>
  <h-button type="ghost" @click="returnBack()">{{$t("m.i.common.goBack")}}</h-button>
</template>
<script>
  export default {
    name : "goBackBtn",
    data() {
      return {

      }
    },
    methods:{
      returnBack(){
        this.$emit('returnBack','');
      }

    }
  }
</script>
