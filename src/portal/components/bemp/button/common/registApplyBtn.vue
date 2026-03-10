<template>
	<h-button type="primary" @click="handle">{{$t("m.i.ce.rgstApply")}}</h-button>
</template>
<script>
	export default {
		name : "registApplyBtn",
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
