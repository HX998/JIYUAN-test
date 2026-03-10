<template>
  <h-button type="primary" v-if="isCommit === 'noCommit'" @click="exportBillExcel">{{$t("m.i.ce.batchExport")}}</h-button>

</template>
<script>
	export default {
		name : "batchExportBtn",
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
      exportBillExcel(){
				this.$emit('exportBillExcel','');
			}
			
		}
	}
</script>
