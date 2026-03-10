<template>
	<h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
	    <h-typefield v-model="formItem['maxBillMoney']" type="money" bigTips placeholder=""></h-typefield>
	</h-form-item>
</template>

<script>
	export default {
		name : "minBillMoney",
		data() {
			return {
				
			}
		},
		props:{
			formItem : Object || {}
		}
	}
</script>
