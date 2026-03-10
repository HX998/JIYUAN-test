<template>
	<h-button type="primary" @click="handle" >{{$t("m.i.ebank.disAuth")}}</h-button>
</template>
<script>
	export default {
		name : "disAuthBtn",
		data() {
			return {
			}
		},
		methods:{
			handle(){
				this.$emit('disAuth','');
			}

		}
	}
</script>
