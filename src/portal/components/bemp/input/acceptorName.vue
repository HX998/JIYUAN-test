<template>
  <h-form-item prop="acptName" required>
    <h-input v-model="formItem['acptName']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
    export default {
      name: "acceptorName",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>
