<template>
  <h-button type="primary" @click="changeDelayDays">{{$t("m.i.ce.changeDelayDays")}}</h-button>
</template>
<script>
	export default {
		name : "changeDelayDaysBtn",
		data() {
			return {
			}
		},
    props:{
      isCommit:String,
      submitFlag:{
        type:Boolean,
        default:false,
      }
    },
		methods:{
      changeDelayDays(){
				this.$emit('changeDelayDays','');
			}
			
		}
	}
</script>
