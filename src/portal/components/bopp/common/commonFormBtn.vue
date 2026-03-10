<template>
  <h-form-item class="h-form-operate" >
    <h-button type="primary" @click="click">{{title}}</h-button>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonFormBtn",
    props: {
      title: {
        type: String,
        default: ""
      },
    },
    methods: {
      click(){
        this.$emit("click", "");
      }
    }
  }
</script>

<style scoped>

</style>
