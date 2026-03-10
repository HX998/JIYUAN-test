<template>
  <h-dropdown placement="bottom-start" trigger="click" @on-click="cancelAccountList">
    <h-button type="primary">{{$t('m.i.ce.cancelAccount')}}<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list"  >
      <h-dropdown-item name="select">{{$t('m.i.ce.selectCancelAccount')}}</h-dropdown-item>
      <h-dropdown-item name="batch">{{$t('m.i.ce.batchCancelAccount')}}</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
</template>
<script>
	export default {
		name : "cancelAccountBtn",
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
      cancelAccountList(submitType){
				this.$emit('cancelAccountList',submitType);
			}
			
		}
	}
</script>
