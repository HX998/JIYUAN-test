<template>
  <h-button type="primary" @click="accountBillDetail()">{{$t('m.i.ce.detailBill')}}</h-button>

</template>
<script>
	export default {
		name : "detailBillBtn",
		data() {
			return {
			}
		},
		methods:{
      accountBillDetail(){
				this.$emit('accountBillDetail','');
			}
			
		}
	}
</script>
