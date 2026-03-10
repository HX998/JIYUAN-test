<template>
	<h-button type="primary" @click="handle" >{{$t('m.i.common.importTemplateDownload')}}</h-button>
</template>
<script>
	export default {
		name : "templateDownloadBtn",
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
