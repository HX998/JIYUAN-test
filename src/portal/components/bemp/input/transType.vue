<template>
  <h-form-item :label="this.$t('m.i.ebank.transType')" prop="transType" :class="className" :required="required">
    <h-select v-model="formItem[formType]['transType']" placeholder="" :readonly="readonly">
      <h-option v-for="item in transTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "transType",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      transTypeList:Array,
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
      transTypeReadOnly:{
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
        if(this.transTypeReadOnly){
          return true;
        }else{
          false;
        }
      }
    }
  }
</script>
