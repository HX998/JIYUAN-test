<template>
  <h-dropdown placement="bottom-start" trigger="click" @on-click="accountBackList">
    <h-button type="primary">记账退回<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list"  >
      <h-dropdown-item name="select">选择退回</h-dropdown-item>
      <h-dropdown-item name="batch">批次退回</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
</template>
<script>
	export default {
		name : "accountBackBtn",
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
      accountBackList(submitType){
				this.$emit('accountBackList',submitType);
			}
			
		}
	}
</script>
