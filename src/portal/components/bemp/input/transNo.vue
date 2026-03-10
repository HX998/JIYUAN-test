<template>
  <h-form-item :label="this.$t('m.i.ebank.transName')" prop="transNo" :class="className" :required="required">
    <h-select v-model="formItem[formType]['transNo']" placeholder="" :readonly="readonly">
      <h-option v-for="item in transNoList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "transNo",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      transNoList:Array,
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
      transNoReadOnly:{
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
        if(this.transNoReadOnly){
          return true;
        }else{
          false;
        }
      }
    }
  }
</script>
