<template>
  <h-dropdown placement="bottom-start" trigger="click" @on-click="reBackList" v-if="btnAuth.acctBack ===undefined?false:btnAuth.acctBack.isShow">
    <h-button type="primary">{{$t("m.i.ce.returnBack")}}<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list"  >
      <h-dropdown-item name="select" v-if="btnAuth.acctBackSelectBack === undefined ? true : btnAuth.acctBackSelectBack.isShow">选择退回</h-dropdown-item>
      <h-dropdown-item name="batch" v-if="btnAuth.acctBackBatchBack === undefined ? true : btnAuth.acctBackBatchBack.isShow">批次退回</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
</template>
<script>
	export default {
		name : "acctBackBtn",
		data() {
			return {
			}
		},
    props:{
      btnAuth:{
        type: Object,
        default(){
          return {
            acctBackBatchBack:{
              isShow:true
            },
            acctBackSelectBack:{
              isShow:true
            },
            acctBack:{
              isShow:true
            }
          }
        }
      }
    },
		methods:{
		  //传下拉框选中的name值
      reBackList(submitType){
				this.$emit('reBackList',submitType);
			}
			
		}
	}
</script>
