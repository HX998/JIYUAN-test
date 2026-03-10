<template>
	<h-form-item :label="this.$t('m.i.ebank.applyDt')" prop="applDt">
		<h-date-picker :value="applDt" type="daterange" showFormat :editable=false
					 @on-change="handleApplDtChange" placeholder=""></h-date-picker>
	</h-form-item>
</template>

<script>
	export default {
		name : "applDt",
		data() {
			return {

			}
		},
		props:{
			formItem : Object || {},
			applDt:Array
		},
		methods : {
      handleApplDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDt = [arr[0], arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDt = [];
        };
			},
		}
	}
</script>
