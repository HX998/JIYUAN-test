<template>
	<h-button type="primary" @click="handle" >{{$t("m.i.ebank.checkShow")}}</h-button>
</template>
<script>
	export default {
		name : "checkShowBtn",
		data() {
			return {

			}
		},
		methods:{
			handle(){
				this.$emit('checkShow','');
			}

		}
	}
</script>
