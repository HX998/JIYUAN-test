<template>
  <h-button type="primary"  v-if="isCommit === 'noCommit'" @click="contractPrinting">{{$t("m.i.ce.contractPrinting")}}</h-button>
</template>
<script>
	export default {
		name : "contractPrintingBtn",
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
      contractPrinting(){
				this.$emit('contractPrinting','');
			}
			
		}
	}
</script>
