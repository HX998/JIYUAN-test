<template>
  <h-button type="primary" @click="discPickBillWinOpen">{{$t("m.i.ce.pickBill")}}</h-button>

</template>
<script>
	export default {
		name : "pickBillBtn",
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
      discPickBillWinOpen(){
				this.$emit('discPickBillWinOpen','');
			}

		}
	}
</script>
