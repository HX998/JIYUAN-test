<template>
  <h-dropdown placement="bottom-start" trigger="click" @on-click="reCheckList"
              v-if="(btnAuth.selectRecheck === undefined || btnAuth.selectRecheck.isShow) && (btnAuth.batchRecheck === undefined || btnAuth.batchRecheck.isShow)">
    <h-button type="primary">{{$t("m.i.common.recheckPass")}}<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list"  >
      <h-dropdown-item name="select" >{{$t("m.i.ce.selectRecheck")}}</h-dropdown-item>
      <h-dropdown-item name="batch" >{{$t("m.i.ce.batchRecheck")}}</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>

  <h-button type="primary" @click="reCheckList('select')" v-else-if="btnAuth.selectRecheck === undefined || btnAuth.selectRecheck.isShow">{{$t("m.i.ce.selectRecheck")}}</h-button>
  <h-button type="primary" @click="reCheckList('batch')" v-else-if="btnAuth.batchRecheck === undefined || btnAuth.batchRecheck.isShow">{{$t("m.i.ce.batchRecheck")}}</h-button>
</template>
<script>
	export default {
		name : "recheckPassBtn",
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
            selectRecheck:{
              isShow:true
            },
            batchRecheck:{
              isShow:true
            }
          }
        }
      }
    },
		methods:{
		  //传下拉框选中的name值
      reCheckList(submitType){
				this.$emit('reCheckList',submitType);
			}

		}
	}
</script>
