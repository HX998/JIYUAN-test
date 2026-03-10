<template>
  <h-form-item v-if="isPrsnttnRequired" :label="this.$t('m.i.ebank.overdueRsn')" prop="overdueRsn"
               :required="isPrsnttnRequired"  class="h-form-height-auto">
    <h-input type="textarea" :rows=2 v-model="formItem['overdueRsn']" :canResize="false"
             :maxlength="60"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "overdueRsn",
      data() {
        return {

        }
      },
      props:{
        isPrsnttnRequired:{
          type:Boolean,
          default:false
        },
        formItem : Object || {}
      }
    }
</script>
