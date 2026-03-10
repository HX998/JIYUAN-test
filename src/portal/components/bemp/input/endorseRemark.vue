<template>
  <h-form-item v-if="applType !== 'impawn'" :label="this.$t('m.i.ebank.transFromRmark')" prop="endorseRemark">
    <h-input type="textarea" :rows=2 v-model="formItem['endorseRemark']" :canResize="false"
             :maxlength="60"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "endorseRemark",
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
