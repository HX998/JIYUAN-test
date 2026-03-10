<template>
  <h-button type="primary" @click="interestCalculation">{{$t("m.i.be.calcInterest")}}</h-button>
</template>
<script>
	export default {
		name : "calcInterestBtn",
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
      interestCalculation(){
				this.$emit('interestCalculation','');
			}
			
		}
	}
</script>
