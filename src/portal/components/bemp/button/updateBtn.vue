<template>
	<h-button type="primary" @click="handle" >{{$t("m.i.common.modify")}}</h-button>
</template>
<script>
	export default {
		name : "updateBtn",
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
