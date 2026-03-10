<template>
	<h-button type="primary" @click="handle" >导入模板下载</h-button>
</template>
<script>
	export default {
		name : "exportTempBtn",
		data() {
			return {
				
			}
		},
		methods:{
			handle(){
				this.$emit('exportTemplate','');
			}
			
		}
	}
</script>