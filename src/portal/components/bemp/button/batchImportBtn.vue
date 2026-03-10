<template>
	<h-button type="primary" @click="handle" >批量导入</h-button>
</template>
<script>
	export default {
		name : "batchImportBtn",
		data() {
			return {
				
			}
		},
		methods:{
			handle(){
				this.$emit('batchImport','');
			}
			
		}
	}
</script>