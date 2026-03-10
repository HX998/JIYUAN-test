<template>
  <h-dropdown placement="bottom-start" trigger="click" @on-click="accountList"
              v-if="!btnAuth||(btnAuth.batchAccount === undefined || btnAuth.batchAccount.isShow) && (btnAuth.selectAccount === undefined || btnAuth.selectAccount.isShow)">
    <h-button type="primary">{{$t("m.i.ce.account")}}<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list"  >
      <h-dropdown-item name="select">{{$t("m.i.ce.selectAccount")}}</h-dropdown-item>
      <h-dropdown-item name="batch">{{$t("m.i.ce.batchAccount")}}</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
  <h-button type="primary" @click="accountList('select')" v-else-if="btnAuth.selectAccount === undefined || btnAuth.selectAccount.isShow">{{$t("m.i.ce.selectAccount")}}</h-button>
  <h-button type="primary" @click="accountList('batch')"  v-else-if="btnAuth.batchAccount === undefined || btnAuth.batchAccount.isShow">{{$t("m.i.ce.batchAccount")}}</h-button>
</template>
<script>
	export default {
		name : "accountBtn",
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
            batchAccount:{
              isShow:true
            },
            selectAccount:{
              isShow:true
            }
          }
        }
      }
    },
		methods:{
		  //传下拉框选中的name值
      accountList(submitType){
				this.$emit('accountList',submitType);
			}
			
		}
	}
</script>
