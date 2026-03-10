<template>
  <h-form-item :label="this.$t('m.i.ebank.recouType')" prop="rcrsTp" :class="className" :required="required">
    <h-select v-model="formItem[formType]['rcrsTp']" placeholder="" :readonly="readonly" @on-change="handle">
      <h-option v-for="item in rcrsTpList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "recouType",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      rcrsTpList:Array,
      className: String,
      required :{
        type: Boolean,
        default: true
      },
      formObj : Object || {},
      formType:{
        type:String,
        default:'formItem'
      },
      rcrsTpReadOnly:{
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
        if(this.rcrsTpReadOnly){
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
