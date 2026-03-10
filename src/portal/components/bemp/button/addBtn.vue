<template>
	<h-button type="primary" @click="handle" >新增</h-button>
</template>
<script>
	export default {
		name : "addBtn",
		data() {
			return {
				param: 'add'
			}
		},
		methods:{
			handle(){
				this.$emit('handleForm',this.param);
			}
			
		}
	}
</script>