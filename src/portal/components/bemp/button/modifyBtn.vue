<template>
	<h-button type="primary" @click="handle" >修改</h-button>
</template>
<script>
	export default {
		name : "modifyBtn",
		data() {
			return {
				param: 'modify'
			}
		},
		methods:{
			handle(){
				this.$emit('handleForm',this.param);
			}
			
		}
	}
</script>