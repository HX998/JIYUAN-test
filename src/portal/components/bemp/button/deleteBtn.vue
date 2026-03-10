<template>
	<h-button type="primary" @click="handle" >删除</h-button>
</template>
<script>
	export default {
		name : "deleteBtn",
		data() {
			return {
				
			}
		},
		methods:{
			handle(){
				this.$emit('deleteData','');
			}
			
		}
	}
</script>