<template>
  <h-form-item :label="applType === 'impawn' ? this.$t('m.i.ebank.impawnToName'): this.$t('m.i.ebank.transToName')" prop="toName" required>
    <h-input v-model="formItem['toName']" :maxlength="125"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "impawnToName",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        applType:{
          type:String,
          default:''
        }
      }
    }
</script>

<style scoped>

</style>
