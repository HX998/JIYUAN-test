<template>
	<h-button type="primary" @click="handle" >{{this.$t("m.i.ebank.payCredit.creditShow")}}</h-button>
</template>
<script>
	export default {
		name : "payCreditRespBtn",
		data() {
			return {

			}
		},
		methods:{
			handle(){
				this.$emit('creditResp','');
			}

		}
	}
</script>
