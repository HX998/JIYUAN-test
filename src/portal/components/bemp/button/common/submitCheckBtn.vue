<template>
	<h-button type="primary" @click="handle">{{$t("m.i.common.submitCheck")}}</h-button>
</template>
<script>
	export default {
		name : "submitCheckBtn",
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
