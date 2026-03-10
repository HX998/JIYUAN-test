<template>
  <p class="label">
    <h-radio v-model="isTake" @on-click="changeTake">{{$t("m.i.ebank.autoTypeTake")}}</h-radio>
  </p>
</template>

<script>
    export default {
        name: "autoTypeTake",
      data() {
        return {

        }
      },
      props:{
        isTake:{
          type:Boolean,
          default:true
        }
      },
      methods: {
        changeTake() {
          this.$emit('autoTake', '');
        },
      }
    }
</script>
