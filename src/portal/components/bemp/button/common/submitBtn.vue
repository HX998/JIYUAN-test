<template>
  <h-dropdown placement="bottom-start" trigger="click" @on-click="submitList" >
    <h-button type="primary">{{$t("m.i.common.submit")}}<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list">
      <h-dropdown-item name="select">{{$t('m.i.ce.selectSubmit')}}</h-dropdown-item>
      <h-dropdown-item name="batch">{{$t("m.i.ce.batchSubmit")}}</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
</template>
<script>
	export default {
		name : "submitBtn",
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
		  //传下拉框选中的name值
      submitList(submitType){
				this.$emit('submitList',submitType);
			}
			
		}
	}
</script>
