<template>
  <h-form-item :label="this.$t('m.i.ebank.applyType')" prop="transFromPartnerType" :class="className" :required="required">
    <h-select v-model="formItem[formType]['transFromPartnerType']" placeholder="" :readonly="readonly">
      <h-option v-for="item in transFromPartnerTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "transFromPartnerType",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      transFromPartnerTypeList:Array,
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
      transFromPartnerTypeReadOnly:{
        type: Boolean,
        default: true
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
        if(this.transFromPartnerTypeReadOnly){
          return true;
        }else{
          false;
        }
      }
    }
  }
</script>
