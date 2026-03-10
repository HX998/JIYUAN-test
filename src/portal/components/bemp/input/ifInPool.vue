<template>
  <h-form-item v-if="applType === 'impawn' && isPool === true" :label="this.$t('m.i.ebank.ifInPool')" prop="ifInPool" :class="className" :required="required">
    <h-select v-model="formItem[formType]['ifInPool']" placeholder="" :readonly="readonly">
      <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "ifInPool",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      YonList:Array,
      applType:{
        type:String,
        default:''
      },
      isPool:{
        type:Boolean
      },
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
      ifInPoolReadOnly:{
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
        if(this.ifInPoolReadOnly){
          return true;
        }else{
          false;
        }
      }
    }
  }
</script>
