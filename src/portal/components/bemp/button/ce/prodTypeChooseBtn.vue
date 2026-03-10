<template>
	<h-button type="primary" @click="handle" > {{$t("m.i.be.setAssetType")}}</h-button>
</template>
<script>
	export default {
		name : "prodTypeChooseBtn",
		data() {
			return {
			}
		},
		methods:{
			handle(){
				this.$emit('prodTypeChoose','');
			}

		}
	}
</script>
