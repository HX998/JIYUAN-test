<template>
	<h-button type="primary" @click="handle">{{$t("m.i.ce.rgstCancel")}}</h-button>
</template>
<script>
	export default {
		name : "registCancelBtn",
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
