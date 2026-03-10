<template>
  <h-button type="primary" v-if="isCommit === 'noCommit'" @click="relationInvoice">{{$t('m.i.ce.relationInvoice')}}</h-button>
</template>

<script>
  export default {
    name: "relationInvoiceBtn",
    data() {
      return {

      }
    },
    props : {
      isCommit: String,
    },
    methods:{
      relationInvoice(){
        this.$emit('relationInvoice','');
      }
    }
  };
</script>

<style scoped>

</style>
