<template>
	<h-button type="primary" @click="handle" >{{ this.$t("m.i.ebank.payCredit.sendApply") }}</h-button>
</template>
<script>
	export default {
		name : "payCreditQueryBtn",
		data() {
			return {
				param: 'add'
			}
		},
		methods:{
			handle(){
				this.$emit('creditQuery',this.param);
			}

		}
	}
</script>
