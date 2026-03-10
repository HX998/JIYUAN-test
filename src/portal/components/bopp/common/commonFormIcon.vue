<template>
  <h-form-item class="h-form-operate">
    <h-icon :name="name" @on-click="onClick" :size="size" :color="color" :fontClass="fontClass" style="float:left;"></h-icon>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonFormIcon",
    props: {
      name: {
        type: String,
        default: ""
      },
      size: {
        type: String | Number,
        default: ""
      },
      color: {
        type: String,
        default: ""
      },
      fontClass: {
        type: String,
        default: "iconfont"
      },
    },
    methods: {
      onClick() {
        this.$emit("on-click", "");
      }
    }
  }
</script>

<style scoped>

</style>
