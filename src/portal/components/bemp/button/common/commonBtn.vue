<template>
	<h-button type="primary" @click="handle">{{$t(this.btnName)}}</h-button>
</template>
<script>
	export default {
		name : "commonBtn",
    props:{
      btnName:String,
      submitFlag:{
        type:Boolean,
        default:false,
      }
    },
		data() {
			return {
			  btnName: this.btnName,
			}
		},

		methods:{
			handle(){
				this.$emit('handleForm','');
			}
			
		}
	}
</script>
