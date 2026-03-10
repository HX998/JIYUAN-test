<template>
	<h-button type="primary" @click="handle">{{$t("m.i.common.registerCheck")}}</h-button>
</template>
<script>
	export default {
		name : "registCheckBtn",
    props:{
      btnName:String,
      submitFlag:{
        type:Boolean,
        default:false,
      }
    },
		data() {
			return {
			}
		},

		methods:{
			handle(){
				this.$emit('handleForm','');
			}
			
		}
	}
</script>
