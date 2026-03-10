<template>
  <!--默认显示下拉框-->
  <h-dropdown placement="bottom-start" trigger="click" @on-click="signList"
              v-if="(btnAuth.selectSign === undefined || btnAuth.selectSign.isShow) && (btnAuth.batchSign === undefined || btnAuth.batchSign.isShow)">
    <h-button type="primary">{{$t("m.i.ce.sign")}}<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list"  >
      <h-dropdown-item name="select">{{$t("m.i.ce.selectSign")}}</h-dropdown-item>
      <h-dropdown-item name="batch">{{$t("m.i.ce.batchSign")}}</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
  <h-button type="primary" @click="signList('select')" v-else-if="btnAuth.selectSign === undefined || btnAuth.selectSign.isShow">{{$t("m.i.ce.selectSign")}}</h-button>
  <h-button type="primary" @click="signList('batch')" v-else>{{$t("m.i.ce.batchSign")}}</h-button>

</template>
<script>
	export default {
		name : "signBtn",
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
            batchSign:{
              isShow:true
            },
            selectSign:{
              isShow:true
            }
          }
        }
      }
    },
		methods:{
		  //传下拉框选中的name值
      signList(submitType){
				this.$emit('signList',submitType);
			}
			
		}
	}
</script>
