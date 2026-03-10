<template>
	<h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
		<h-date-picker :value="dueDt" type="daterange" showFormat :editable=false
					 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
	</h-form-item>
</template>

<script>
	export default {
		name : "dueDt",
		data() {
			return {
				
			}
		},
		props:{
			formItem : Object || {},
			dueDt:Array
		},
		methods : {
			handleDueDtChange(arr) {
			  if (arr&&arr.length==2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
        };
				//this.dueDt = [arr[0], arr[1]];
			},
		}
	}
</script>
