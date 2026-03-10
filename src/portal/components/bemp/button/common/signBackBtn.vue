<template>
  <h-dropdown placement="bottom-start" trigger="click" @on-click="signBackList"
              v-if="(btnAuth.signSelectBack === undefined || btnAuth.signSelectBack.isShow) && (btnAuth.signBatchBack === undefined || btnAuth.signBatchBack.isShow)">
    <h-button type="primary">{{$t("m.i.ce.returnBack")}}<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list"  >
      <h-dropdown-item name="select">{{$t('m.i.ce.selectReturnBack')}}</h-dropdown-item>
      <h-dropdown-item name="batch">{{$t('m.i.ce.batchReturnBack')}}</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
    <h-button type="primary" @click="signBackList('select')" v-else-if="btnAuth.signSelectBack === undefined || btnAuth.signSelectBack.isShow">{{$t('m.i.ce.selectReturnBack')}}</h-button>
    <h-button type="primary" @click="signBackList('batch')" v-else>{{$t('m.i.ce.batchReturnBack')}}</h-button>

</template>
<script>
	export default {
		name : "signBackBtn",
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
            signBatchBack:{
              isShow:true
            },
            signSelectBack:{
              isShow:true
            }
          }
        }
      }
    },
		methods:{
		  //传下拉框选中的name值
      signBackList(submitType){
				this.$emit('signBackList',submitType);
			}
			
		}
	}
</script>
