<template>
  <h-button type="primary" @click="handle()" >{{$t("m.i.ebank.checkBill")}}</h-button>
</template>
<script>
  export default {
    name : "checkBillBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('checkBill','');
      }
    }
  }
</script>
