<template>
  <h-form-item :label="label" prop="billMoney" >
    <h-row>
      <h-col span="11">
        <h-form-item prop="minBillMoney" style="width:100%">
          <h-typefield  v-model="formItem['minBillMoney']" bigTips placeholder="" type="money"></h-typefield>
        </h-form-item>
      </h-col>
      <h-col span="2" style="text-align: center">-</h-col>
      <h-col span="11">
        <h-form-item prop="maxBillMoney" style="width:100%">
          <h-typefield  v-model="formItem['maxBillMoney']"  bigTips placeholder="" type="money"></h-typefield>
        </h-form-item>
      </h-col>
    </h-row>
  </h-form-item>
</template>

<script>
    export default {
        name: "billMoney",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        label: {
          type: String,
          default() {
            return this.$t("m.i.billInfo.billMoney");
          }
        },
      }
    }
</script>
