<template>
	<h-button type="primary" @click="handle" >查询</h-button>
</template>
<script>
	export default {
		name : "reportQueryBtn",
		data() {
			return {
			}
		},
		methods:{
			handle(){
				this.$emit('handleQuery',this.param);
			}

		}
	}
</script>
