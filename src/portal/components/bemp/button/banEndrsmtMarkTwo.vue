<template>
  <h-form-item prop="banEndrsmtMark">
    <h-radio-group v-model="formItem['banEndrsmtMark']">
      <h-radio label="EM00">
        <span>{{$t("m.i.billInfo.endrsmtMark00")}}</span>
      </h-radio>
      <h-radio label="EM01">
        <span>{{$t("m.i.billInfo.endrsmtMark01")}}</span>
      </h-radio>
    </h-radio-group>
  </h-form-item>
</template>

<script>
    export default {
      name: "banEndrsmtMarkTwo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>

