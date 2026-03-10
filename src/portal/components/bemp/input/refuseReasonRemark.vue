<template>
 <h-form-item :label="this.$t('m.i.ebank.refuseReasonRemark')" prop="dshnrRsn" :required="required">
  <h-input v-model="formItem['dshnrRsn']" placeholder=""></h-input>
 </h-form-item>
</template>

<script>
	export default {
		name : "refuseReasonRemark",
		data() {
			return {
				
			}
		},
		props:{
			formItem : Object || {},
      required : {
        type:Boolean,
        default:false
      },
		}
	}
</script>
