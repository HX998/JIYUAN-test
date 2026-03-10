<template>
	<h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
	    <h-typefield v-model="formItem['minBillMoney']" type="money"  bigTips placeholder=""></h-typefield>
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
