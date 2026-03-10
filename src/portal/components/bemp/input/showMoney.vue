<template>
  <h-form-item :label="label" :required="required" prop="billMoney" >
	    <h-typefield v-model="formItem['billMoney']" type="money" :readonly="readonly"
                   @on-blur="onBlur()" bigTips placeholder=""></h-typefield>
	</h-form-item>
</template>

<script>
	export default {
		name : "showMoney",
		data() {
			return {

			}
		},
		props:{
			formItem : Object || {},
      label: {
        type: String,
        default() {
          return this.$t("m.i.shcpe.showBillMoney");
        }
      },
      required: {
        type: Boolean,
        default: false
      },
      readonly:{
        type : Boolean,
        default: false
      },
		},
    methods: {
      onBlur() {
        this.$emit("on-blur", "");
      },
    }
	}
</script>
