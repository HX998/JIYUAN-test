<template>
  <h-form-item :label="this.$t('m.i.ebank.loginStatus')" prop="loginStatus" :class="className">
    <h-select v-model = "formItem[formType]['loginStatus']">
      <h-option v-for="item in loginStatusList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "operTellerLoginStatus",
    data() {
      return {
          formItem:{}
      }
    },
    props:{
      formObj : Object || {},
      className: String,
      loginStatusList:Array,
      formType:{
          type:String,
          default:'formItem'
      }
    },
  created(){
      let typef = this.formType;
      let obj = {};
      if(typef == 'addForm'){
          obj = { addForm : this.formObj};
      }else{
          obj = { formItem : this.formObj};
      }
      this.formItem = obj;
  },
  }
</script>
