<template>
  <h-form-item prop="isAllowSplitBill">
    <h-radio-group v-model="formItem['isAllowSplitBill']" style="width:100%;">
      <h-radio label="1" style="padding-left:20%;">
        <span>{{$t("m.i.common.yes")}}</span>
      </h-radio>
      <h-radio label="0" style="padding-left:40%;">
        <span>{{$t("m.i.common.no")}}</span>
      </h-radio>
    </h-radio-group>
  </h-form-item>
</template>

<script>
  export default {
    name: "isAllowSplitBill",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>

