<template>
  <h-dropdown placement="bottom-start" trigger="click" @on-click="reCheckBackList" v-if="btnAuth.reCheckBack ===undefined?true:btnAuth.reCheckBack.isShow">
    <h-button type="primary">{{$t("m.i.ce.returnBack")}}<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list"  >
      <h-dropdown-item name="select" v-if="btnAuth.reCheckSelectBack === undefined ? true : btnAuth.reCheckSelectBack.isShow">选择退回</h-dropdown-item>
      <h-dropdown-item name="batch" v-if="btnAuth.reCheckBatchBack === undefined ? true : btnAuth.reCheckBatchBack.isShow">批次退回</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
</template>
<script>
	export default {
		name : "recheckBackBtn",
		data() {
			return {
			}
		},
    props:{
      isCommit:String,
      submitFlag:{
        type:Boolean,
        default:false,
      },
      btnAuth:{
        type: Object,
        default(){
          return {
            reCheckBatchBack:{
              isShow:true
            },
            reCheckSelectBack:{
              isShow:true
            },
            reCheckBack:{
              isShow:true
            }
          }
        }
      }
    },
		methods:{
		  //传下拉框选中的name值
      reCheckBackList(submitType){
				this.$emit('reCheckBackList',submitType);
			}
			
		}
	}
</script>
