<template>
  <h-form-item prop="billMoney" required>
    <h-input v-model="formItem['billMoney']" :maxlength="20" placeholder = "请输入票面金额(¥)" bigTips
             @on-blur="formatBillMoneyBlur"
             @on-focus="formatBillMoneyFocus"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "drawBillMoney",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
      },
      methods:{
        formatBillMoneyBlur(){
          this.$emit('formatBillMoneyBlur','');
        },
        formatBillMoneyFocus(){
          this.$emit('formatBillMoneyFocus','');
        },

      }
    }
</script>

