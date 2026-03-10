<template>
  <h-form-item v-if="isShow" :label="this.$t('m.i.ebank.recouReasonCode')" prop="rcrsRsnCd" :class="className" :required="required">
    <h-select v-model="formItem[formType]['rcrsRsnCd']" placeholder="" :readonly="readonly">
      <h-option v-for="item in rcrsRsnCdList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "recouReason",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      isShow: {
        type:Boolean,
        default: true
      },
      rcrsRsnCdList:Array,
      className: String,
      required : Boolean,
      formObj : Object || {},
      formType:{
        type:String,
        default:'formItem'
      },
      rcrsRsnCdReadOnly:{
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
        if(this.rcrsRsnCdReadOnly){
          return true;
        }else{
          false;
        }
      }
    }
  }
</script>
