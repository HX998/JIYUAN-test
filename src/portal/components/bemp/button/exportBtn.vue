<template>
	<h-button type="primary" @click="handle" >导出</h-button>
</template>
<script>
	export default {
		name : "exportBtn",
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
