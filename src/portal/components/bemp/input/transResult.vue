<template>
  <h-form-item :label="this.$t('m.i.ebank.transResult')" prop="statusCode" :class="className" :required="required">
    <h-select v-model="formItem[formType]['statusCode']" placeholder="" :readonly="readonly">
      <h-option v-for="item in statusCodeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "transResult",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      statusCodeList:Array,
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
      statusCodeReadOnly:{
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
        if(this.statusCodeReadOnly){
          return true;
        }else{
          false;
        }
      }
    }
  }
</script>
