<template>
  <h-button type="primary" v-if="isCommit === 'noCommit'" @click="invoiceManager">{{$t('m.i.bm.invoiceManager')}}</h-button>
</template>

<script>
  export default {
    name: "invoiceManagerBtn",
    data() {
      return {

      }
    },
    props : {
      isCommit: String,
    },
    methods:{
      invoiceManager(){
        this.$emit('invoiceManager','');
      }
    }
  };
</script>

<style scoped>

</style>
