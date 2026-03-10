<template>
	<h-button type="primary" @click="handle" >{{$t("m.i.ce.batchExport")}}</h-button>
</template>
<script>
	export default {
		name : "batchExportBtn",
		data() {
			return {
			}
		},
		methods:{
			handle(){
				this.$emit('handleExport','');
			}

		}
	}
</script>
