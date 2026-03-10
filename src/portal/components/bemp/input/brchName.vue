<template>
 <h-form-item :label="$t('m.i.common.brchName')" prop="brchName" :required="required">
  <h-input v-model="formItem['brchName']" placeholder="" :readonly="readonly" ></h-input>
 </h-form-item>
</template>

<script>
	export default {
		name : "brchName",
		data() {
			return {

			}
		},
		props:{
			formItem : Object || {},
      required :{
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      }
		}
	}
</script>
