<template>
  <div>
    <h-input  v-model="userName" placeholder=" " readonly
              icon="android-search" @on-click="queryBranchManager"></h-input>
    <show-branch-manager :show-branch-manager-win="showBranchManager" :brch-no="this.brchNo"
                         :title="this.title" @showBranchManagerWinClose="showBranchManagerWinClose" @branchManagerSelect="branchManagerSelect"></show-branch-manager>
  </div>
</template>

<script>

  export default {
    name: "selectBranchManager",
    components: { },
    data() {
      return{
        title : "机构管理员查询",
        showBranchManager : false,
      }
      
    },
    props:{
      brchNo: ''
    },
    methods :{
      queryBranchManager(){
        this.showBranchManager = true;
      },
      showBranchManagerWinClose(){
        this.showBranchManager = false;
      },
      branchManagerSelect(info){
        this.$emit('update:value',info);
        this.showBranchManager = false;
      },
    },
  };
</script>

<style scoped>

</style>
