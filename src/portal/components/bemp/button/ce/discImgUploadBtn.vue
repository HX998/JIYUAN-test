<template>
  <h-button type="primary" v-if="isCommit === 'noCommit' && isNeedUpdDiscImg" @click="discImgUpload">{{$t("m.i.ce.discImgUpload")}}</h-button>
</template>
<script>
	export default {
		name : "discImgUploadBtn",
		data() {
			return {
			}
		},
    props:{
      isCommit:String,
      isNeedUpdDiscImg:{
        type:Boolean,
        default:false,
      }
    },
		methods:{
      discImgUpload(){
				this.$emit('discImgUpload','');
			}
			
		}
	}
</script>
