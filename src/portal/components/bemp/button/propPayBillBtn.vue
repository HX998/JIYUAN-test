<template>
  <h-button type="primary" @click="handle" :disabled="isPresentationEnable">{{$t("m.i.ebank.propPayBill")}}</h-button>
</template>
<script>
  export default {
    name : "propPayBillBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('propPayBill','');
      }

    },
    props:{
      isPresentationEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
