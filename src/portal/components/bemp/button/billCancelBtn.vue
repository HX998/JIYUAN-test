<template>
  <h-button type="primary" @click="handle" :disabled="isCancelBillEnable">{{$t("m.i.ebank.billCancel")}}</h-button>
</template>
<script>
  export default {
    name : "billCancelBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('billCancel','');
      }

    },
    props:{
      isCancelBillEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
