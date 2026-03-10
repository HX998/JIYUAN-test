<template>
  <h-form-item :label="this.$t('m.i.ebank.refuseReasonCode')" prop="dshnrCd" :class="className" :required="required">
    <h-select v-model="formItem[formType]['dshnrCd']" placeholder="" :readonly="readonly" @on-change="handle">
      <h-option v-for="item in dshnrCdList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "refuseReason",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      dshnrCdList:Array,
      className: String,
      required : {
        type:Boolean,
        default:true
      },
      formObj : Object || {},
      formType:{
        type:String,
        default:'formItem'
      },
      dshnrCdReadOnly:{
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
        if(this.dshnrCdReadOnly){
          return true;
        }else{
          false;
        }
      }
    },
    methods:{
      handle(){
        this.$emit('change',this.formItem);
      }
    }
  }
</script>
