<template>
  <h-form-item :label="this.$t('m.i.ebank.checkStatus')" prop="checkStatus" :class="className" :required="required">
    <h-select v-model="formItem[formType]['checkStatus']" placeholder="" :readonly="readonly">
      <h-option v-for="item in checkStatusList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "checkStatus",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      checkStatusList:Array,
      className: String,
      required :{
        type: Boolean,
        default: false
      },
      formObj : Object || {},
      formType:{
        type:String,
        default:'formItem'
      },
      checkStatusReadOnly:{
        type: Boolean,
        default: false
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
    computed:{
      readonly(){
        if(this.checkStatusReadOnly){
          return true;
        }else{
          false;
        }
      }
    }
  }
</script>
