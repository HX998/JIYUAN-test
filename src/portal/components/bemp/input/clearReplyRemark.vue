<template>
 <h-form-item :label="this.$t('m.i.ebank.clearReplyRemark')" prop="clearReplyRemark">
  <h-input v-model="formItem['clearReplyRemark']" placeholder=""></h-input>
 </h-form-item>
</template>

<script>
	export default {
		name : "clearReplyRemark",
		data() {
			return {
				
			}
		},
		props:{
			formItem : Object || {}
		}
	}
</script>
