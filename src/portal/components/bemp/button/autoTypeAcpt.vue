<template>
  <p class="label">
    <h-radio v-model="isAcpt" @on-click="changeAcpt">{{$t("m.i.ebank.autoTypeAcpt")}}</h-radio>
  </p>
</template>

<script>
    export default {
        name: "autoTypeAcpt",
      data() {
        return {

        }
      },
      props:{
        isAcpt:{
          type:Boolean,
          default:true
        }
      },
      methods: {
        changeAcpt() {
          this.$emit('autoAcpt', '');
        },
      }
    }
</script>
