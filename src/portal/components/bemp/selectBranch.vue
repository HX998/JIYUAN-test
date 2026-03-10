<template>
  <div>
    <h-input  v-model="showMsg" placeholder="" readonly
              icon="android-search" @on-click="brchCodeWinOpen"></h-input>

    <show-branch :showBranchWin="brchNoWin" title="选择机构"  @brchNoChange="brchNoChange" :url="url"
                 @showBranchWinClose="brchNoWinClose"></show-branch>
  </div>
</template>

<script>
  import {post} from "@/api/bizApi/commonUtil";
  export default {
    name: "selectBranch",
    components: {
      ShowBranch:()=>import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
    },
    props:{
      textShow : {
        type: String,
        default() {
          return '';
        }
      },
      showMsg : {
        type: String,
        default() {
          return '';
        }
      },
      url : {
        type: String,
        default() {
          return '/sm/auth/branch/queryBranchTree';
        }
      },
      selectUrl : {
        type: String,
        default() {
          return '/sm/auth/branch/getBranchByBranchTreeNo';
        }
      },
    },
    data() {
      return {
        brchNo : "",
        brchName : "",
        brchNoWin : false,
        isFalse : false,
      }
    },
    methods: {
      brchCodeWinOpen(){
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.$emit('update:brchNo',brchNos.substring(0,brchNos.length - 1));
        this.$emit('update:brchName',brchNames.substring(0,brchNames.length - 1));
        if(this.textShow == 'name'){
          this.showMsg = brchNames.substring(0,brchNames.length - 1);
        } else if(this.textShow == 'bankNo'){
          let brchNo = brchNos.substring(0,brchNos.length - 1);
          post({brchNo:brchNo}, this.selectUrl).then(res => {
            if(res){
              let retCode = res.data.retCode
              if(retCode=="000000"){
                this.showMsg = res.data.retData.bankNo;
                this.$emit('update:bankNo',res.data.retData.bankNo);
              }else{
              }
            }else{
            }
          });
        } else {
          this.showMsg = brchNos.substring(0,brchNos.length - 1);
        }
        this.brchNoWin = false;
      },

    },
  };
</script>

<style scoped>

</style>
