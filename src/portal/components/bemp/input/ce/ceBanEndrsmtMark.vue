<template>
  <h-form-item :label="$t('m.i.billInfo.banEndrsmtMark')" prop="banEndrsmtMark"  v-show="false">
    <h-input v-model="formItem.banEndrsmtMark" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "ceBanEndrsmtMark",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>
