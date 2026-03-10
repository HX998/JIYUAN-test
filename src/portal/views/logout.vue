<template>

</template>

<script>
  export default {
    name: "logout",
    created() {
      this.$store.dispatch("AutoLogout", this.$route.query.userNo).then(() => {
        this.$hMessage.success("退出成功");
      });
    }
  };
</script>

<style scoped>

</style>
