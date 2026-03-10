<template>
 <h-form-item :label="this.$t('m.i.ebank.recouRemark')" prop="recouRemark">
  <h-input v-model="formItem['recouRemark']" placeholder=""></h-input>
 </h-form-item>
</template>

<script>
	export default {
		name : "recouRemark",
		data() {
			return {
				
			}
		},
		props:{
			formItem : Object || {}
		}
	}
</script>
