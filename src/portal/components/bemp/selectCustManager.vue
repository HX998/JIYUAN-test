<template>
  <div>
    <h-input  v-model="showValue" :placeholder="'选择客户经理'" readonly
              icon="android-search" @on-click="showCusManager"></h-input>

    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="'选择客户经理'"
                       @showCustManagerWinClose="showCustManagerWinClose" @custManagerSelect="custManagerSelect"></show-cust-manager>
  </div>
</template>

<script>
  export default {
    name: "selectCustManager",
    components: {
      ShowCustManager:()=>import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`),
    },
    props:{
      textShow : {
        type: String,
        default() {
          return '';
        }
      },
    },
    data() {
      return {
        showValue : "",
        showCustManagerWin : false,
        isFalse : false,
      }

    },
    methods:{
      // 展示客户经理选择界面
      showCusManager(){
        this.showCustManagerWin = true;
      },
      // 选择客户经理界面关闭
      showCustManagerWinClose(){
        this.showCustManagerWin = false;
      },
      // 选择客户经理
      custManagerSelect(info){
        this.$emit('update:custMgrNo',info.custMgrNo);
        this.$emit('update:custMgrName',info.custMgrName);
        if(this.textShow == 'name'){
          this.showValue = info.custMgrName;
        } else {
          this.showValue = info.custMgrNo;
        }
        this.showCustManagerWin = false;
      },

    }
  };
</script>

<style scoped>

</style>
