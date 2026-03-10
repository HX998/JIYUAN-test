<template>

  <h-button type="primary" @click="handleForm()">{{$t("m.i.ce.billManage")}}</h-button>
</template>
<script>
	export default {
		name : "billManageBtn",
		data() {
			return {
			}
		},
		methods:{
      handleForm(){
				this.$emit('handleForm','');
			}
			
		}
	}
</script>
