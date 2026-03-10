<template>
  <h-button type="primary" @click="handle" :disabled="isIssuanceEnable">{{$t("m.i.ebank.propTakeBill")}}</h-button>
</template>
<script>
  export default {
    name : "propTakeBillBtn",
    data() {
      return {

      }
    },
    methods:{
      handle(){
        this.$emit('propTakeBill','');
      }

    },
    props:{
      isIssuanceEnable :{
        type: Boolean,
        default: false
      },
    }
  }
</script>
